import Head from "next/head";
import styles from "./style.module.css";
import BackgroundLayout from "../../../../components/BackgroundLayout";
import ContentContainer from "../../../../components/ContentContainer";
import Custom404 from "../../../404";
import BackNavigation from "../../../../components/BackNavigation";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SessionIdPageProps } from "../../../../assets/campaign.type";
import { getStorage } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Loader from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { createSessionSnippet } from "../../../../utils/stringUtils";
import { quillFormats, quillModules } from "../../../../assets/quill";
import {
  dispatchDiscordPublish,
  dispatchSaveSession,
  getContentById,
} from "../../../../utils/sessionIdUtils";
import { getCampaignImageById } from "../../../../utils/campaignIdUtils";
import { toast, ToastContainer } from "react-toastify";
import { toastObject } from "../../../../assets/toast";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const SessionPage = ({
  campaignId,
  sessionid,
  ownerid,
  title,
}: SessionIdPageProps) => {
  const storage = getStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, error, loading] = useAuthState(getAuth());
  const [modules, setModules] = useState<any>({ toolbar: [] });
  const [formats, setFormats] = useState<any>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [campaignImage, setCampaignImage] = useState<string>();

  const [sessionIsPublished, setSessionIsPublished] = useState<boolean>(true);
  const [sessionContent, setSessionContent] = useState<string>();
  const [sessionTitle, setSessionTitle] = useState<string>(title);
  const [sessionSubTitle, setSessionSubTitle] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<Date>(new Date());

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
  useMemo(() => {
    setIsLoading(true);
    getContentById(ownerid, campaignId, sessionid)
      .then((res) => {
        if (res.session) {
          setSessionDate(
            res.session.date ? new Date(res.session.date) : new Date()
          );
          setSessionSubTitle(res.session.subTitle);
          setSessionIsPublished(res.session.isPublished);
          setSessionContent(res.sessionContent);
        }
      })
      .finally(() => setIsLoading(false));
  }, [ownerid, campaignId, sessionid]);

  // Get Campaign Image
  useMemo(() => {
    setIsLoading(true);
    getCampaignImageById(ownerid, campaignId)
      .then((url) => {
        setCampaignImage(url);
      })
      .catch((err) => console.error(err));
  }, [ownerid, campaignId]);

  const handleDiscordPublish = async () => {
    if (!sessionIsPublished && sessionContent) {
      setIsLoading(true);
      dispatchDiscordPublish(
        ownerid,
        campaignId,
        sessionid,
        sessionTitle,
        createSessionSnippet(sessionContent),
        campaignImage
      )
        .then((isSuccess) => {
          if (isSuccess) {
            toast.success("Created new post ", toastObject);
          } else {
            throw new Error("");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };
  const handleSave = () => {
    if (isEditMode && isOwner && sessionContent) {
      dispatchSaveSession(
        ownerid,
        campaignId,
        sessionid,
        sessionContent,
        sessionTitle,
        sessionSubTitle,
        sessionDate
      )
        .then((isSuccess: boolean) => {
          if (isSuccess) {
            toast.success("Saved", toastObject);
          } else {
            throw new Error("");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!", toastObject);
        });
    }
  };

  const handleKeyDown = (event: any) => {
    if (
      event instanceof KeyboardEvent &&
      event.ctrlKey &&
      event.key === "s" &&
      isOwner &&
      isEditMode
    ) {
      event.preventDefault();
      handleSave();
    }
  };
  if (!title || !ownerid) return <Custom404 />;
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout backgroundImageUrl={campaignImage}>
        <ContentContainer>
          <BackNavigation href={`/${ownerid}/${campaignId}`} />
          <div
            className={styles.contentContainer}
            onKeyUp={(event) => handleKeyDown(event)}
          >
            <div style={{ gridColumn: "1/2" }}>
              {isEditMode ? (
                <DatePicker
                  selected={sessionDate}
                  onChange={(date: Date) => setSessionDate(date)}
                />
              ) : (
                <h4 className={styles.date} suppressHydrationWarning>
                  {sessionDate?.toLocaleDateString()}
                </h4>
              )}
            </div>
            <div style={{ gridColumn: "2/7" }}>
              {isEditMode ? (
                <input
                  type="text"
                  id="title-container"
                  placeholder="Write a fitting title"
                  value={sessionTitle}
                  onChange={(event) => setSessionTitle(event.target.value)}
                />
              ) : (
                <h1 className={styles.title}>
                  {sessionTitle ? sessionTitle : sessionid}
                </h1>
              )}
            </div>
            {isOwner ? (
              <div
                style={{
                  gridColumn: "7/8",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button onClick={() => setIsEditMode(!isEditMode)}>Edit</button>
              </div>
            ) : null}

            <div style={{ gridColumn: "1/8" }}>
              {isEditMode ? (
                <input
                  type="text"
                  id="subtitle-container"
                  placeholder="Write a fitting subtile"
                  value={sessionSubTitle}
                  onChange={(event) => setSessionSubTitle(event.target.value)}
                />
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

            {!sessionIsPublished && isOwner ? (
              <button
                onClick={handleDiscordPublish}
                style={{ gridColumn: "1/8", marginTop: "2rem" }}
              >
                Publish to discord
              </button>
            ) : null}
            <ToastContainer />
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  // fetches the campaign data pased on the path
  const campaignid = params.campaignid;
  const sessionid = params.sessionid;
  const ownerid = params.user;
  const sessionTitle: string = await get(
    child(
      ref(getDatabase()),
      `users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}/title`
    )
  )
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch((error) => {
      console.error(error);
      return "";
    });
  return {
    props: {
      campaignId: campaignid,
      ownerid: ownerid,
      sessionid: sessionid,
      title: sessionTitle,
    },
  };
}

export default SessionPage;
