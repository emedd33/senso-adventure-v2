import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import BackgroundLayout from "../components/BackgroundLayout"
import ContentContainer from "../components/ContentContainer";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer>
          <h2>hei</h2>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
