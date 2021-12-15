import Head from "next/head";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import Link from "next/link";
import content, { Campaign } from "../../../../../assets/campaints";
import BackgroundLayout from "../../../../../components/BackgroundLayout";
import ContentContainer from "../../../../../components/ContentContainer";
import Custom404 from "../../../../404";

const CampaignPage = () => {
  const router = useRouter();
  const { campaignid, sessionid } = router.query;

  // TODO: switch to backend api
  const campaign = content.find((e: Campaign) => e.id === campaignid);
  const session = campaign?.sessions.find((s) => s.id === sessionid);

  if (!session) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <title>{campaign?.title}</title>
      </Head>
      <BackgroundLayout backgroundImageUrl={campaign?.image}>
        <ContentContainer>
          <h1 className={styles.title}>{session?.title}</h1>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default CampaignPage;
