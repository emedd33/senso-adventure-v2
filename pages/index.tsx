import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [user, loading, error] = useAuthState(getAuth());
  const router = useRouter();
  if (user) {
    router.push(`/${user.uid}`);
  }
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer isLoading={loading}>
          <div className={styles.container}>
            <div className={styles.campaignContainer}>
              <Image
                src={"/images/campfire.jpg"}
                alt="Campaign picture"
                layout="fill"
                objectFit="cover"
                priority={true}
              />
              <h1 className={styles.title}>A blog for Dnd sessions</h1>
            </div>
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
