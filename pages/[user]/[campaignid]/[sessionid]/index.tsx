import Head from "next/head";
import styles from "./style.module.css";
import BackgroundLayout from "../../../../components/BackgroundLayout";
import ContentContainer from "../../../../components/ContentContainer";
import styled from "./style.module.css";
import Custom404 from "../../../404";
import { text } from "../../../../assets/loremIpsum";
import BackNavigation from "../../../../components/BackNavigation";
import { child, get, getDatabase, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { quillFormats, quillModules } from "../../../../assets/quill";
import "react-quill/dist/quill.snow.css";
import {
  FirebaseCampaignItems,
  FirebaseUser,
  FirebaseUserItems,
  SessionIdPageProps,
} from "../../../../assets/campaign.type";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadString,
} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Loader from "react-loader-spinner";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const SessionPage = ({
  campaignId,
  session,
  ownerid,
  campaignImage,
}: SessionIdPageProps) => {
  const storage = getStorage();
  const [sessionContent, setSessionContent] = useState("");
  const [sessionTitle, setSessionTitle] = useState(session.title);
  const [sessionSubTitle, setSessionSubTitle] = useState(session.subTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, error, loading] = useAuthState(getAuth());

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useMemo(() => setIsOwner(user?.uid === ownerid), [user, ownerid]);
  useMemo(() => {
    setIsLoading(true);
    getDownloadURL(
      storageRef(
        storage,
        `users/${ownerid}/campaigns/${campaignId}/sessions/${session.id}.txt`
      )
    ).then((url) => {
      fetch(url, {
        credentials: "same-origin",
      })
        .then((res) => res.text())
        .then((res) => {
          setSessionContent(res);
        })
        .finally(() => setIsLoading(false))
        .catch((err) => "");
    });
  }, [session, campaignId, ownerid]);

  const handleSave = () => {
    if (isEditMode && isOwner) {
      uploadString(
        storageRef(
          storage,
          `users/${ownerid}/campaigns/${campaignId}/sessions/${session.id}.txt`
        ),
        sessionContent
      ).then((snapshot) => {
        console.log("Uploaded a raw string!");
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {isOwner ? (
                <button onClick={() => setIsEditMode(!isEditMode)}>Edit</button>
              ) : null}
            </div>

            {isEditMode ? (
              <>
                <label htmlFor="title-container" style={{ marginLeft: "1rem" }}>
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
            <div
              className={
                isEditMode ? styles.quillContainer : styles.quillContainerRead
              }
            >
              {isLoading ? (
                <Loader type="Oval" color="#000" height={40} width={40} />
              ) : (
                <ReactQuill
                  theme="snow"
                  value={sessionContent}
                  onKeyDown={(event) => handleKeyDown(event)}
                  onChange={setSessionContent}
                  modules={isEditMode ? quillModules : { toolbar: [] }}
                  formats={isEditMode ? quillFormats : []}
                  readOnly={!isEditMode}
                ></ReactQuill>
              )}
            </div>
            {isEditMode ? <button onClick={handleSave}>Save</button> : null}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

type AllPathType = { ownerid: string; campaignid: string; sessionid: string };
export async function getStaticPaths() {
  // Creates all the static paths from the database instances
  const allPaths = await get(child(ref(getDatabase()), `users`))
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .then((users: FirebaseUser) => {
      return Object.entries(users)
        .map(([ownerid, users]: [string, FirebaseUserItems]) => {
          if (users.campaigns) {
            return Object.entries(users.campaigns).map(
              ([campaignid, campaign]: [string, FirebaseCampaignItems]) => {
                if (campaign.sessions) {
                  return Object.keys(campaign.sessions).map(
                    (sessionid: string) => ({
                      ownerid: ownerid,
                      campaignid: campaignid,
                      sessionid: sessionid,
                    })
                  );
                }
                return {
                  ownerid: ownerid,
                  campaignid: campaignid,
                  sessionid: "",
                };
              }
            );
          }
          return [{ ownerid: ownerid, campaignid: "", sessionid: "" }];
        })
        .flat()
        .flat()
        .filter(
          (path) => path.ownerid && path.campaignid && path.sessionid
        ) as AllPathType[];
    });

  return {
    paths: allPaths?.map((paths: AllPathType) => ({
      params: {
        campaignid: paths.campaignid,
        sessionid: paths.sessionid,
        user: paths.ownerid,
      },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
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

  return {
    props: {
      campaignId: campaignid,
      session: { ...session, id: sessionid },
      ownerid: ownerid,
      campaignImage: campaignImage,
    }, // will be passed to the page component as props
  };
}

export default SessionPage;
