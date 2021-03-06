import Head from "next/head";
import BackgroundLayout from "../components/BackgroundLayout";
import ContentContainer from "../components/ContentContainer";

// pages/404.js
export default function Custom404() {
  return (
    <>
      <Head>
        <title>Senso Adventure</title>
        <link rel="shortcut icon" href="/icons/dice.png" />
      </Head>
      <BackgroundLayout>
        <ContentContainer style={{ backgroundColor: "#face8b" }}>
          <h1>Could not find the page</h1>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
}
