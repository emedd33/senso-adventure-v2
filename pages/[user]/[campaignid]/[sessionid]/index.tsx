import Head from "next/head";
import styles from "./style.module.css";
import BackgroundLayout from "../../../../components/BackgroundLayout";
import ContentContainer from "../../../../components/ContentContainer";
import styled from "./style.module.css";
import Custom404 from "../../../404";
import { text } from "../../../../assets/loremIpsum";
import BackNavigation from "../../../../components/BackNavigation";
import { child, get, getDatabase, ref } from "firebase/database";
import { Params } from "next/dist/server/router";
import { useState } from "react";
import dynamic from "next/dynamic";
import { quillFormats, quillModules } from "../../../../assets/quill";
import "react-quill/dist/quill.snow.css";
import {
  FirebaseCampaignItems,
  FirebaseSessionItems,
  FirebaseUser,
  FirebaseUserItems,
} from "../../../../assets/campaign.type";
import path from "path/posix";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { SessionIdProps } from "./type";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const SessionPage = ({
  campaignId,
  session,
  ownerId,
  campaignImage,
}: SessionIdProps) => {
  const [value, setValue] = useState(text);
  const [isEditMode, setIsEditMode] = useState(false);
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
          <BackNavigation href={`/${ownerId}/${campaignId}`} />
          <div className={styled.container}>
            <h1 className={styles.title}>{session?.title}</h1>
            <h2 className={styles.subtitle}>{session?.subTitle}</h2>
            <div
              className={
                isEditMode ? styles.quillContainer : styles.quillContainerRead
              }
            >
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                modules={isEditMode ? quillModules : { toolbar: [] }}
                formats={isEditMode ? quillFormats : []}
                readOnly={!isEditMode}
              ></ReactQuill>
            </div>
          </div>
          <button onClick={() => setIsEditMode(!isEditMode)}>Edit</button>
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
  ).catch(() => "");
  return {
    props: {
      campaignId: campaignid,
      session: session,
      ownerid: params.user,
      campaignImage: campaignImage,
    }, // will be passed to the page component as props
  };
}

export default SessionPage;
