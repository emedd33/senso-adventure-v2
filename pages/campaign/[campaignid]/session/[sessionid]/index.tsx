import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import content, {
  Campaign,
  Session,
} from "../../../../../assets/campaign.type";
import BackgroundLayout from "../../../../../components/BackgroundLayout";
import ContentContainer from "../../../../../components/ContentContainer";
import styled from "./style.module.css";
import Custom404 from "../../../../404";
import { text } from "../../../../../assets/loremIpsum";
import BackNavigation from "../../../../../components/BackNavigation";
import { useMemo, useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";

const SessionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { campaignid, sessionid } = router.query;
  const [session, setSession] = useState<Session>();
  const [campaign, setCampaign] = useState<Campaign>();
  useMemo(() => {
    setIsLoading(true);
    get(
      child(ref(getDatabase()), `campaign/${campaignid}/sessions/${sessionid}`)
    )
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
      .then((res) => {
        if (res) {
          setSession({ ...res, id: sessionid });
        }
      })
      .catch((error) => console.error(error));
    get(child(ref(getDatabase()), `campaign/${campaignid}`))
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
      .then((res) => {
        if (res) {
          setCampaign({
            ...res,
            id: campaignid,
            image: `/images/${campaignid}.jpg`,
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [campaignid, sessionid]);

  if (isLoading) {
    return <BackgroundLayout isLoading={isLoading}></BackgroundLayout>;
  }
  if (!session || !campaignid) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <title>{session.title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout backgroundImageUrl={campaign?.image}>
        <ContentContainer>
          <div className={styled.container}>
            <BackNavigation href={`/campaign/${campaignid}`} />
            <h1 className={styles.title}>{session?.title}</h1>
            <h2 className={styles.subtitle}>{session?.subTitle}</h2>
            <p>{text}</p>
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};
export default SessionPage;
