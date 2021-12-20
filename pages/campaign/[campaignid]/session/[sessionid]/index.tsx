import Head from "next/head";
import styles from "./style.module.css";
import BackgroundLayout from "../../../../../components/BackgroundLayout";
import ContentContainer from "../../../../../components/ContentContainer";
import styled from "./style.module.css";
import Custom404 from "../../../../404";
import { text } from "../../../../../assets/loremIpsum";
import BackNavigation from "../../../../../components/BackNavigation";
import { child, get, getDatabase, ref } from "firebase/database";
import { Params } from "next/dist/server/router";

const SessionPage = ({ campaignId, session }: Params) => {
  if (!session || !campaignId) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <title>{session.title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout backgroundImageUrl={`/images/${campaignId}.jpg`}>
        <ContentContainer>
          <BackNavigation href={`/campaign/${campaignId}`} />
          <div className={styled.container}>
            <h1 className={styles.title}>{session?.title}</h1>
            <h2 className={styles.subtitle}>{session?.subTitle}</h2>
            <p>{text}</p>
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export async function getStaticPaths() {
  // Creates all the static paths from the database instances
  const campaigns = await get(child(ref(getDatabase()), `campaign`))
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
    .then((campaigns) => {
      return Object.entries(campaigns)
        .map(([id, campaign]: [string, any]) => {
          if (campaign.sessions) {
            return Object.keys(campaign.sessions).map((sessionId: any) => {
              return { campaignId: id, sessionId: sessionId };
            });
          }
          return [{ campaignId: id, sessionId: undefined }];
        })
        .flat()
        .filter((path) => path.campaignId && path.sessionId);
    });

  return {
    paths: campaigns?.map((paths) => ({
      params: { campaignid: paths.campaignId, sessionid: paths.sessionId },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  // fetches the campaign data pased on the path
  const campaignId = params.campaignid;
  const sessionId = params.sessionid;
  const session = await get(
    child(ref(getDatabase()), `campaign/${campaignId}/sessions/${sessionId}`)
  )
    .then((snapshot) =>
      snapshot.exists() ? { ...snapshot.val(), id: snapshot.key } : null
    )
    .catch((error) => console.error(error));

  return {
    props: { campaignId: campaignId, session: session }, // will be passed to the page component as props
  };
}

export default SessionPage;
