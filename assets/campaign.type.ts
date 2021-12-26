export interface FirebaseUserItems {
  campaigns: FirebaseCampaign;
  username: string;
}
export interface FirebaseUser {
  [id: string]: FirebaseUserItems;
}
export interface FirebaseCampaignItems {
  title: string;
  image: string;
  color: number;
  players?: FirebasePlayer[];
  sessions?: FirebaseSession[];
}

export interface FirebasePlayer {
  [id: string]: { characterName: string; playerName: string };
}

export interface Player {
  characterName: string;
  playerName: string;
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
  players?: { characterName: string; playerName: string }[];
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
  sessionid: string;
  ownerid: string;
  title: string;
};
