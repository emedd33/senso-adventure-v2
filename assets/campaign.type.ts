export interface FirebaseUserItems {
  campaigns: FirebaseCampaign;
}
export interface FirebaseUser {
  [id: string]: FirebaseUserItems;
}
export interface FirebaseCampaignItems {
  title: string;
  image: string;
  color: number;
  sessions?: FirebaseSession[];
}
export interface FirebaseCampaign {
  [id: string]: FirebaseCampaignItems;
}

export interface FirebaseSessionItems {
  title: string;
  subTitle: string;
  date: string;
  snippet: string;
  isPublished: boolean;
}
export interface FirebaseSession {
  [id: string]: FirebaseSessionItems;
}

export interface Campaign {
  id: string;
  title: string;
  image: string;
  color: number;
  sessions?: Session[];
}

export interface Session {
  date: string;
  id: string;
  title: string;
  subTitle: string;
  snippet: string;
  isPublished: boolean;
}

export type SessionIdPageProps = {
  campaignId: string;
  session: Session;
  ownerid: string;
  campaignImage: string;
  content: string;
};
