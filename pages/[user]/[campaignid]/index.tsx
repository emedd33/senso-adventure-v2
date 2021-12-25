import Head from "next/head";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import BackgroundLayout from "../../../components/BackgroundLayout";
import ContentContainer from "../../../components/ContentContainer";
import styles from "./style.module.css";
import { Session } from "../../../assets/campaign.type";
import Link from "next/link";
import Custom404 from "../../404";
import { child, get, getDatabase, ref, set } from "firebase/database";

import { Params } from "next/dist/server/router";
import BackNavigation from "../../../components/BackNavigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import {
  dispatchNewSession,
  getCampaignImageById,
  getSessionsById,
} from "../../../utils/campaignIdUtils";

const CampaignPage = ({
  campaignid,
  ownerid,
  campaignTitle,
}: {
  campaignid: string;
  ownerid: string;
  campaignTitle: string;
}) => {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[]>();
  const [campaignImage, setCampaignImage] = useState<string>();
  const [user, loading, error] = useAuthState(getAuth());
  useMemo(() => setIsOwner(user?.uid === ownerid), [user, ownerid]);

  // Get Campaign Sessions
  useMemo(() => {
    setIsLoading(true);
    getSessionsById(ownerid, campaignid).then((res: Session[]) =>
      setSessions(res)
    );
  }, [ownerid, campaignid]);

  // Get Campaign Image
  useEffect(() => {
    setIsLoading(true);
    getCampaignImageById(ownerid, campaignid)
      .then((url) => {
        setCampaignImage(url);
      })
      .catch((err) => console.error(err));
  }, [campaignid]);

  // Create new Session
  const createNewSession = () => {
    setIsLoading(true);
    if (sessions) {
      dispatchNewSession(ownerid, campaignid, sessions)
        .then((newSessionId) => {
          router.push(`/${ownerid}/${campaignid}/${newSessionId}`);
        })
        .catch((err) => console.error(err));
    }
  };
  useEffect(() => {
    if (sessions !== undefined && campaignImage !== undefined) {
      setIsLoading(false);
    }
  }, [sessions, campaignImage]);
  return (
    <>
      <Head>
        <title>{campaignTitle}</title>
        <link rel="" href="/icons/dice.png" />
      </Head>

      <BackgroundLayout backgroundImageUrl={campaignImage}>
        <ContentContainer isLoading={isLoading}>
          <div className={styles.header}>
            <BackNavigation
              style={{ gridColumn: "1/2" }}
              href={`/${ownerid}`}
            />

            <h1 className={styles.title} style={{ gridColumn: "2/3" }}>
              {campaignTitle}{" "}
            </h1>
            {isOwner ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginBottom: "1rem",
                  gridColumn: "2/3",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <button onClick={createNewSession}>new session</button>
                </div>
              </div>
            ) : null}
          </div>
          {sessions?.map((session: Session) => {
            return (
              <Link
                key={session.id}
                href={`/${ownerid}/${campaignid}/${session.id}`}
                passHref={true}
              >
                <div className={styles.sessionContainer}>
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
                      <path
                        d="M375 2L0 3.73205V0.267949L375 2Z"
                        fill="#A12A20"
                      />
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
                              <span
                                key={key}
                                style={{ opacity: 0.7 - key / 10 }}
                              >
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
                </div>
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
  const campaignid = params.campaignid;
  const ownerid = params.user;

  // Fetches the campaign in SSR
  const campaignTitle: string = await get(
    child(ref(getDatabase()), `users/${ownerid}/campaigns/${campaignid}/title`)
  )
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .catch((error) => {
      console.error(error);
      return "";
    });
  // Fetches url for background image in SSR

  return {
    props: {
      ownerid: ownerid,
      campaignid: campaignid,
      campaignTitle: campaignTitle,
    }, // will be passed to the page component as props
  };
}
export default CampaignPage;
