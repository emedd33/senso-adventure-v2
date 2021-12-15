import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import useSWR from "swr";
import BackgroundLayout from "../../components/BackgroundLayout";
import ContentContainer from "../../components/ContentContainer";
import styles from "./styles.module.css";
import content from "../../assets/campaints";
const CampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO: switch to backend api
  const campaign = content.find((e) => e.id === id);
  return (
    <>
      <Head>
        <title>{id}</title>
      </Head>
      <BackgroundLayout backgroundImageUrl={campaign?.image}>
        <ContentContainer style={{ width: "50%" }}>
          <h1>{campaign?.title}</h1>
          {campaign?.sessions.map((session) => {
            return <h2>{session.title}</h2>;
          })}
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default CampaignPage;
