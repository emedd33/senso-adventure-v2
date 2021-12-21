export interface FirebaseUserItems {
  campaigns: FirebaseCampaign;
}
export interface FirebaseUser {
  [id: string]: FirebaseUserItems;
}
export interface FirebaseCampaignItems {
  title: string;
  image: string;
  sessions?: FirebaseSession[];
}
export interface FirebaseCampaign {
  [id: string]: FirebaseCampaignItems;
}

export interface FirebaseSessionItems {
  title: string;
  subTitle: string;
}
export interface FirebaseSession {
  [id: string]: FirebaseSessionItems;
}

export interface Campaign {
  id: string;
  title: string;
  image: string;
  sessions?: Session[];
}

export interface Session {
  id: string;
  title: string;
  subTitle: string;
}

export type SessionIdPageProps = {
  campaignId: string;
  session: Session;
  ownerid: string;
  campaignImage: string;
};
