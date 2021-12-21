import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/index.module.css";
import BackgroundLayout from "../../components/BackgroundLayout";
import ContentContainer from "../../components/ContentContainer";
import { Campaign } from "../../assets/campaign.type";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";

import { Params } from "next/dist/server/router";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";

const Home: NextPage = ({ campaigns, ownerId }: Params) => {
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
                <Link key={campaign.id} href={`/${ownerId}/${campaign.id}`}>
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

export async function getStaticPaths() {
  // Creates all the static paths from the database instances
  const userPaths = await get(child(ref(getDatabase()), `users`)).then(
    (snapshot) => (snapshot.exists() ? Object.keys(snapshot.val()) : null)
  );

  return {
    paths: userPaths?.map((path) => ({ params: { user: path } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: Params) {
  const ownerId = params.user;
  const storage = getStorage();

  const campaigns = await get(
    child(ref(getDatabase()), `users/${ownerId}/campaigns/`)
  )
    .then((snapshot) =>
      Promise.all(
        Object.keys(snapshot.val()).map((campaignId: string) =>
          getDownloadURL(
            storageRef(
              storage,
              `users/${ownerId}/campaigns/${campaignId}/${campaignId}.jpg`
            )
          ).then((url) => {
            return {
              ...snapshot.val()[campaignId],
              id: campaignId,
              image: url,
            };
          })
        )
      )
    )
    .catch((error) => console.error(error));

  return {
    props: { campaigns: campaigns, ownerId: ownerId }, // will be passed to the page component as props
  };
}

export default Home;
