import Head from "next/head";
import styles from "./style.module.css";
import BackgroundLayout from "../../../../components/BackgroundLayout";
import ContentContainer from "../../../../components/ContentContainer";
import styled from "./style.module.css";
import Custom404 from "../../../404";
import BackNavigation from "../../../../components/BackNavigation";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SessionIdPageProps } from "../../../../assets/campaign.type";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadString,
} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Loader from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import "react-datepicker/dist/react-datepicker.css";
import { createSessionSnippet } from "../../../../utils/stringUtils";
import { quillFormats, quillModules } from "../../../../assets/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const SessionPage = ({
  campaignId,
  session,
  ownerid,
  campaignImage,
  content,
}: SessionIdPageProps) => {
  const storage = getStorage();
  const [sessionContent, setSessionContent] = useState(content);
  const [sessionTitle, setSessionTitle] = useState(session.title);
  const [sessionSubTitle, setSessionSubTitle] = useState(session.subTitle);
  const [sessionDate, setSessionDate] = useState(new Date(session.date));
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, error, loading] = useAuthState(getAuth());
  const [modules, setModules] = useState<any>({ toolbar: [] });
  const [formats, setFormats] = useState<any>([]);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(
    () => setModules(isEditMode ? quillModules : { toolbar: [] }),
    [isEditMode]
  );
  useEffect(
    () => setFormats(isEditMode ? quillFormats : [isEditMode]),
    [isEditMode]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useMemo(() => setIsOwner(user?.uid === ownerid), [user, ownerid]);

  const handleDiscordPublish = async () => {
    if (!session.isPublished) {
      const webhook = (await get(
        ref(getDatabase(), `/users/${ownerid}/webhook/`)
      )
        .then((snapshot) => snapshot.val())
        .catch((error) => {
          console.log(error);
          return "";
        })) as string;

      const sessionUrl = `http://localhost:3000/${ownerid}/${campaignId}/${session.id}`;
      const color = await get(
        ref(getDatabase(), `/users/${ownerid}/campaigns/${campaignId}/color`)
      ).catch((error) => {
        console.log(error);
        return "";
      });
      const campaignTitle = await get(
        ref(getDatabase(), `/users/${ownerid}/campaigns/${campaignId}/title`)
      )
        .then((snapshot) => snapshot.val())
        .catch((error) => {
          console.log(error);
          return "";
        });
      const data = {
        username: "Senso bot",
        embeds: [
          {
            title: `${campaignTitle}: ${sessionTitle}`,
            url: sessionUrl,
            description: createSessionSnippet(sessionContent),
            color: color,
          },
        ],
        image: {
          url: campaignImage,
        },
      };
      if (webhook) {
        fetch(webhook, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
      }
    }
  };
  const handleSave = () => {
    if (isEditMode && isOwner) {
      uploadString(
        storageRef(
          storage,
          `users/${ownerid}/campaigns/${campaignId}/sessions/${session.id}.html`
        ),
        sessionContent
      )
        .then(() => console.log("Session updated in Firebase Storage"))
        .catch((err) => console.error(err));
      set(
        ref(
          getDatabase(),
          `/users/${ownerid}/campaigns/${campaignId}/sessions/${session.id}`
        ),
        {
          title: sessionTitle,
          subTitle: sessionSubTitle,
          date: sessionDate.toLocaleDateString(),
          snippet: createSessionSnippet(sessionContent),
        }
      )
        .then(() => console.log("Session updated in Firebase Database"))
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.ctrlKey && event.key === "s" && isOwner && isEditMode) {
      event.preventDefault();
      handleSave();
    }
  };
  if (!session || !campaignId) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <title>{session.title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout backgroundImageUrl={campaignImage}>
        <ContentContainer>
          <BackNavigation href={`/${ownerid}/${campaignId}`} />
          <div
            className={styled.container}
            onKeyDown={(event) => handleKeyDown(event)}
          >
            <div style={{ gridColumn: "1/2" }}>
              {isEditMode ? (
                <DatePicker
                  selected={sessionDate}
                  onChange={(date: Date) => setSessionDate(date)}
                />
              ) : (
                <h4 className={styles.date} suppressHydrationWarning>
                  {sessionDate.toLocaleDateString()}
                </h4>
              )}
            </div>
            <div style={{ gridColumn: "3/6" }}>
              {isEditMode ? (
                <>
                  <label
                    htmlFor="title-container"
                    style={{ marginLeft: "1rem" }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title-container"
                    placeholder="Write a fitting title"
                    value={sessionTitle}
                    onChange={(event) => setSessionTitle(event.target.value)}
                  />
                </>
              ) : (
                <h1 className={styles.title}>
                  {sessionTitle ? sessionTitle : session.id}
                </h1>
              )}
            </div>
            {isOwner ? (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                  gridColumn: "7/8",
                  height: "2rem",
                }}
              >
                Edit
              </button>
            ) : null}

            <div style={{ gridColumn: "3/6" }}>
              {isEditMode ? (
                <>
                  <label
                    htmlFor="subtitle-container"
                    style={{ marginLeft: "1rem" }}
                  >
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle-container"
                    placeholder="Write a fitting subtile"
                    value={sessionSubTitle}
                    onChange={(event) => setSessionSubTitle(event.target.value)}
                  />
                </>
              ) : (
                <h2 className={styles.subtitle}>{sessionSubTitle}</h2>
              )}
            </div>
            <div style={{ gridColumn: "2/7" }}>
              <svg
                width="100%"
                height="4"
                viewBox="0 0 375 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
              </svg>
            </div>
            <div
              className={
                isEditMode ? styles.quillContainer : styles.quillContainerRead
              }
              style={{ gridColumn: "1/8" }}
            >
              {isLoading ? (
                <Loader type="Oval" color="#000" height={40} width={40} />
              ) : (
                <ReactQuill
                  readOnly={!isEditMode}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={sessionContent}
                  modules={modules}
                  onChange={(val) => setSessionContent(val)}
                />
              )}
            </div>
            {isEditMode ? (
              <button onClick={handleSave} style={{ gridColumn: "1/2" }}>
                Save
              </button>
            ) : null}

            {isOwner ? (
              <button
                onClick={handleDiscordPublish}
                style={{ gridColumn: "7/8", marginTop: "2rem" }}
              >
                Publish to discord
              </button>
            ) : null}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  const storage = getStorage();

  // fetches the campaign data pased on the path
  const campaignid = params.campaignid;
  const sessionid = params.sessionid;
  const ownerid = params.user;

  const campaignImageId = await get(
    child(ref(getDatabase()), `/users/${ownerid}/campaigns/${campaignid}/image`)
  )
    .then((snapshot) => snapshot.val())
    .catch((error) => console.error(error));

  const session = await get(
    child(
      ref(getDatabase()),
      `/users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}`
    )
  )
    .then((snapshot) => snapshot.val())
    .catch((error) => console.error(error));
  // Fetches url for background image in SSR
  const campaignImage = await getDownloadURL(
    storageRef(
      storage,
      `users/${ownerid}/campaigns/${campaignid}/${campaignImageId}`
    )
  ).catch((err) => console.log(err));

  const sessionContent = await getDownloadURL(
    storageRef(
      storage,
      `users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}.html`
    )
  )
    .then((url) =>
      fetch(url, {
        credentials: "same-origin",
      })
        .then((res) => res.text())
        .catch((err) => console.error(err))
    )
    .catch((err) => console.error(err));
  return {
    props: {
      campaignId: campaignid,
      session: { ...session, id: sessionid },
      ownerid: ownerid,
      campaignImage: campaignImage,
      content: sessionContent ? sessionContent : "",
    }, // will be passed to the page component as props
  };
}

export default SessionPage;
