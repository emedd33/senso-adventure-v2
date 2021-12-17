import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";
import content, { Campaign } from "../assets/campaints";
import Link from "next/link";

const Home: NextPage = () => {
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
                <Link key={campaign.id} href={`/campaign/${campaign.id}`}>
                  <a key={campaign.id} className={styles.campaignContainer}>
                    {campaign.image ? (
                      <Image
                        src={campaign.image}
                        alt="Campaign picture"
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                      />
                    ) : null}
                    <h1 className={styles.campaignTitle}>{campaign.title}</h1>
                  </a>
                </Link>
              );
            })}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
