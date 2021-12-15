import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";
import content, { Campaign } from "../assets/campaints";
import { Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
const myLoader: React.FC<{}> = () => {
  return <p>loading</p>;
};
const Home: NextPage = () => {
  const router = useRouter();

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
                        alt="Picture of the author"
                        layout="fill"
                        objectFit="cover"
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
