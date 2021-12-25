import Head from "next/head";
import Image from "next/image";
import styles from "./style.module.css";
import BackgroundLayout from "../../components/BackgroundLayout";
import ContentContainer from "../../components/ContentContainer";
import { Campaign } from "../../assets/campaign.type";
import Link from "next/link";
import { Params } from "next/dist/server/router";
import { useMemo, useState } from "react";
import { getCampaigns } from "../../utils/campaignIdUtils";

const Home = ({ ownerId }: { ownerId: string }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useMemo(() => {
    setIsLoading(true);
    getCampaigns(ownerId)
      .then((campaigns) => {
        setCampaigns(campaigns);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [ownerId]);
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/icons/dice.png" />
        <title>Senso adventure</title>
      </Head>
      <BackgroundLayout>
        <ContentContainer isLoading={isLoading}>
          <div className={styles.container}>
            {campaigns
              ? campaigns.map((campaign: Campaign) => {
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
                        <h1 className={styles.campaignTitle}>
                          {campaign.title}
                        </h1>
                      </a>
                    </Link>
                  );
                })
              : null}
          </div>
        </ContentContainer>
      </BackgroundLayout>
    </>
  );
};

export async function getServerSideProps({ params }: Params) {
  const ownerId = params.user;
  return {
    props: { ownerId: ownerId }, // will be passed to the page component as props
  };
}

export default Home;
