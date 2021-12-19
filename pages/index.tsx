import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";
import { Campaign } from "../assets/campaign.type";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";

const Home: NextPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useMemo(() => {
    setIsLoading(true);
    get(child(ref(getDatabase()), `campaign/`))
      .then((snapshot) => (snapshot.exists() ? snapshot.val() : null))
      .then((res) => {
        setCampaigns(
          Object.keys(res).map((id) => ({
            ...res[id],
            id: id,
            image: `/images/${id}.jpg`,
          }))
        );
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout isLoading={isLoading}>
        <ContentContainer>
          <div className={styles.container}>
            {campaigns.map((campaign: Campaign) => {
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
// Note that this is a higher-order function.

export default Home;
