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
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const Home: NextPage = () => {
  const [user, loading, error] = useAuthState(getAuth());
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer>
          <div className={styles.container}></div>
          {user ? (
            <Link href={`/${user?.uid}`}>
              <a>
                <button>My campaigns</button>
              </a>
            </Link>
          ) : null}
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
