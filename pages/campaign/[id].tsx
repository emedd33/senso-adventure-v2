import Head from "next/head";
import { useRouter } from "next/router";
import BackgroundLayout from "../../components/BackgroundLayout";
import ContentContainer from "../../components/ContentContainer";
import styles from "./style.module.css";
import content, { Session } from "../../assets/campaints";
import { text } from "../../assets/loremIpsum";
const CampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO: switch to backend api
  const campaign = content.find((e) => e.id === id);

  const getTextSnippet = (text: string, start: number = 0, end?: number) => {
    return text.substring(start, end ? end : text.length);
  };
  return (
    <>
      <Head>
        <title>{id}</title>
      </Head>
      <BackgroundLayout backgroundImageUrl={campaign?.image}>
        <ContentContainer>
          <h1>{campaign?.title}</h1>
          {campaign?.sessions.map((session: Session) => {
            return (
              <div key={session.id} className={styles.sessionContainer}>
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
                  {Array.from(Array(10).keys()).map((key) => (
                    <span key={key} style={{ opacity: 1 - key / 10 }}>
                      {getTextSnippet(text, 400 + key, 400 + key + 1)}
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default CampaignPage;
