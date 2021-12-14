import type { NextPage } from "next";
import Head from "next/head";
import {Image} from "antd"
import styles from "../styles/index.module.css"
import BackgroundLayout from "../components/BackgroundLayout"
import ContentContainer from "../components/ContentContainer";
import content, { Campaign } from "../assets/campaints"
import { Button } from "antd";
const Home: NextPage = () => {

  const handleClick = (campaign:Campaign)=>{
    console.log(campaign);
    
  }
  return (
    <>
      <Head>
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer>
          <div className={styles.container}>
            
            {content.map((campaign: Campaign)=>{
            return (
              <div key={campaign.id} className={styles.campaignContainer}>
                {campaign.image?
                <h1>{campaign.title}</h1>
                  :<h1>{campaign.title}</h1>
                  }
                </div>
              )})}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export default Home;
