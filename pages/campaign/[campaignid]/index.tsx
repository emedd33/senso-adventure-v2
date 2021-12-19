import Head from "next/head";
import { useRouter } from "next/router";
import BackgroundLayout from "../../../components/BackgroundLayout";
import ContentContainer from "../../../components/ContentContainer";
import styles from "./style.module.css";
import { Campaign, Session } from "../../../assets/campaign.type";
import { text } from "../../../assets/loremIpsum";
import Link from "next/link";
import Custom404 from "../../404";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useMemo, useState } from "react";

const CampaignPage = () => {
  const router = useRouter();
  const { campaignid } = router.query;
  const [campaign, setCampaign] = useState<Campaign>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useMemo(() => {
    setIsLoading(true);
    get(child(ref(getDatabase()), `campaign/${campaignid}`))
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
      .then((res) => {
        if (res && campaignid) {
          setCampaign({
            ...res,
            id: campaignid,
            image: `/images/${campaignid}.jpg`,
            sessions: res.sessions
              ? Object.keys(res.sessions).map((id) => ({
                  ...res.sessions[id],
                  id: id,
                }))
              : [],
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [campaignid]);

  const getTextSnippet = (text: string, start: number = 0, end?: number) => {
    return text.substring(start, end ? end : text.length);
  };

  if (isLoading) {
    return <BackgroundLayout isLoading={isLoading}></BackgroundLayout>;
  }
  if (!campaign) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{campaign.title}</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout backgroundImageUrl={campaign.image}>
        <ContentContainer>
          <h1 className={styles.title}>{campaign.title}</h1>
          {campaign.sessions?.map((session: Session) => {
            return (
              <Link
                key={session.id}
                href={`/campaign/${campaign.id}/session/${session.id}`}
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

export default CampaignPage;
