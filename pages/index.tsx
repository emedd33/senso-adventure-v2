import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";
import content, { Campaign } from "../assets/campaints";
import { Button } from "antd";
import { useRouter } from "next/router";
const myLoader: React.FC<{}> = () => {
  return <p>loading</p>;
};
const Home: NextPage = () => {
  const router = useRouter();

  const routeToCampaign = (campaign: Campaign) => {
    router.push({
      pathname: `campaign/${campaign.id}`,
      query: {
        title: campaign.title,
        sessions: campaign.sessions.map((session) => session.id),
      },
    });
  };
  return (
    <>
      <Head>
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer>
          <div className={styles.container}>
            {content.map((campaign: Campaign) => {
              return (
                <div
                  key={campaign.id}
                  className={styles.campaignContainer}
                  onClick={() => routeToCampaign(campaign)}
                >
                  {campaign.image ? (
                    <Image
                      src={campaign.image}
                      alt="Picture of the author"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <h1>{campaign.title}</h1>
                  )}
                </div>
              );
            })}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
