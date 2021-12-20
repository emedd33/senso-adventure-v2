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

import { Params } from "next/dist/server/router";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";

const Home: NextPage = ({ campaigns }: Params) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
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

export async function getStaticProps({ params }: Params) {
  const storage = getStorage();
  const campaigns = await get(child(ref(getDatabase()), `campaign/`))
    .then((snapshot) =>
      Promise.all(
        Object.keys(snapshot.val()).map((id) =>
          getDownloadURL(storageRef(storage, `images/${id}.jpg`)).then(
            (url) => {
              return {
                ...snapshot.val()[id],
                id: id,
                image: url,
              };
            }
          )
        )
      )
    )
    .catch((error) => console.error(error));

  return {
    props: { campaigns: campaigns }, // will be passed to the page component as props
  };
}

export default Home;
