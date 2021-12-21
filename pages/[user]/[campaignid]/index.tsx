import Head from "next/head";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import BackgroundLayout from "../../../components/BackgroundLayout";
import ContentContainer from "../../../components/ContentContainer";
import styles from "./style.module.css";
import {
  Campaign,
  FirebaseUser,
  FirebaseUserItems,
  Session,
} from "../../../assets/campaign.type";
import { text } from "../../../assets/loremIpsum";
import Link from "next/link";
import Custom404 from "../../404";
import { child, get, getDatabase, ref } from "firebase/database";

import { Params } from "next/dist/server/router";
import BackNavigation from "../../../components/BackNavigation";

const CampaignPage = ({
  campaign,
  ownerid,
  campaignImage,
}: {
  campaign: Campaign;
  ownerid: string;
  campaignImage: string;
}) => {
  const getTextSnippet = (text: string, start: number = 0, end?: number) => {
    return text.substring(start, end ? end : text.length);
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
          <h1 className={styles.title}>{campaign.title}</h1>
          <BackNavigation href={`/${ownerid}`} />
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
                    <span>{getTextSnippet(text, 0, 400)}</span>
                    <span style={{ opacity: 0.7 }}>
                      {getTextSnippet(text, 400, 410)}
                    </span>
                    {Array.from(Array(7).keys()).map((key) => (
                      <span key={key} style={{ opacity: 0.7 - key / 10 }}>
                        {getTextSnippet(text, 410 + key, 410 + key + 1)}
                      </span>
                    ))}
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

export async function getStaticPaths() {
  // Creates all the static paths from the database instances
  const allPaths = await get(child(ref(getDatabase()), `users`))
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .then((users: FirebaseUser) => {
      return Object.entries(users)
        .map(([id, users]: [string, FirebaseUserItems]) => {
          if (users.campaigns) {
            return Object.keys(users.campaigns).map((campaignid: string) => {
              return { user: id, campaignid: campaignid };
            });
          }
          return [{ user: id, campaignid: undefined }];
        })
        .flat()
        .filter((path) => path.user && path.campaignid);
    });

  return {
    paths: allPaths?.map((paths) => ({
      params: { user: paths.user, campaignid: paths.campaignid },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: Params) {
  // fetches the campaign data pased on the path
  const storage = getStorage();
  const campaignid = params.campaignid;
  const ownerid = params.user;

  // Fetches the campaign in SSR
  const campaign = await get(
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
    .catch((error) => console.error(error));

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
