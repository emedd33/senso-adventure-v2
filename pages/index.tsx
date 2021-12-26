import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";

import { useMemo, useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";
import Link from "next/link";

const Home: NextPage = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useMemo(() => {
    get(child(ref(getDatabase()), `users/`))
      .then((snapshot) => snapshot.val())
      .then((res) => {
        const allUsers = Object.entries(res).map(
          ([id, user]: [string, any]) => {
            return { username: user.username, uid: id };
          }
        ) as any[];
        setAllUsers(allUsers);
      });
  }, []);
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer>
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
            <h1 style={{ width: "100%", textAlign: "center" }}>Users</h1>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {allUsers
                ? allUsers.map((user) => (
                    <Link href={`/${user.uid}`} key={user.uid}>
                      <a>
                        <div className={styles.userContainer}>
                          {" "}
                          {user.username}
                        </div>
                      </a>
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
