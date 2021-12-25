import Head from "next/head";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import BackgroundLayout from "../../../components/BackgroundLayout";
import ContentContainer from "../../../components/ContentContainer";
import styles from "./style.module.css";
import { Campaign, Session } from "../../../assets/campaign.type";
import Link from "next/link";
import Custom404 from "../../404";
import { child, get, getDatabase, ref, set } from "firebase/database";

import { Params } from "next/dist/server/router";
import BackNavigation from "../../../components/BackNavigation";
import { useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const CampaignPage = ({
  campaign,
  ownerid,
  campaignImage,
}: {
  campaign: Campaign;
  ownerid: string;
  campaignImage: string;
}) => {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [user, error, loading] = useAuthState(getAuth());
  useMemo(() => setIsOwner(user?.uid === ownerid), [user, ownerid]);
  const createNewSession = () => {
    const db = getDatabase();
    const date = new Date().toLocaleDateString();
    const newSessionId = campaign.sessions
      ? `session_${campaign.sessions.length + 1}`
      : "session_1";
    set(
      ref(
        db,
        `users/${ownerid}/campaigns/${campaign.id}/sessions/${newSessionId}`
      ),
      {
        date: date,
        title: newSessionId,
        subtitle: "",
        snippet: "",
      }
    ).then((res) => {
      router.push(`/${ownerid}/${campaign.id}/${newSessionId}`);
    });
  };
  if (!campaign) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{campaign.title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>

      <BackgroundLayout backgroundImageUrl={campaignImage}>
        <ContentContainer>
          <BackNavigation href={`/${ownerid}`} />
          <h1 className={styles.title}>{campaign.title}</h1>
          {isOwner ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                marginBottom: "1rem",
              }}
            >
              <button onClick={createNewSession}>Create new session</button>
            </div>
          ) : null}
          {campaign.sessions?.map((session: Session) => {
            return (
              <Link
                key={session.id}
                href={`/${ownerid}/${campaign.id}/${session.id}`}
                passHref={true}
              >
                <a className={styles.sessionContainer}>
                  <h1 className={styles.title}>{session.title}</h1>
                  <h2 className={styles.subTitle}>{session.subTitle}</h2>
                  <svg
                    width="100%"
                    height="4"
                    viewBox="0 0 375 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
                  </svg>
                  <p>
                    {session.snippet ? (
                      session.snippet.length > 410 ? (
                        <>
                          <span>{session.snippet.substring(0, 400)}</span>
                          <span style={{ opacity: 0.7 }}>
                            {session.snippet.substring(400, 410)}
                          </span>
                          {Array.from(Array(7).keys()).map((key) => (
                            <span key={key} style={{ opacity: 0.7 - key / 10 }}>
                              {session.snippet.substring(
                                410 + key,
                                410 + key + 1
                              )}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span>{session.snippet}</span>
                      )
                    ) : null}
                  </p>
                </a>
              </Link>
            );
          })}
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export async function getServerSideProps({ params }: Params) {
  // fetches the campaign data pased on the path
  const storage = getStorage();
  const campaignid = params.campaignid;
  const ownerid = params.user;

  // Fetches the campaign in SSR
  const campaign: Campaign = (await get(
    child(ref(getDatabase()), `users/${ownerid}/campaigns/${campaignid}`)
  )
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .then((res) => {
      if (res && campaignid) {
        return {
          ...res,
          id: campaignid,
          sessions: res.sessions
            ? Object.keys(res.sessions).map((id) => ({
                ...res.sessions[id],
                id: id,
              }))
            : [],
        };
      }
    })
    .catch((error) => console.error(error))) as Campaign;

  // Fetches url for background image in SSR
  const campaignImage = await getDownloadURL(
    storageRef(
      storage,
      `users/${ownerid}/campaigns/${campaignid}/${campaign.image}`
    )
  ).catch(() => "");

  return {
    props: {
      campaign: campaign,
      ownerid: ownerid,
      campaignImage: campaignImage,
    }, // will be passed to the page component as props
  };
}
export default CampaignPage;
