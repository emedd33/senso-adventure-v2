export interface FirebaseUserItems {
  campaigns: FirebaseCampaign;
}
export interface FirebaseUser {
  [id: string]: FirebaseUserItems;
}
export interface FirebaseCampaignItems {
  title: string;
  image: any;
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
  image: any;
  sessions?: Session[];
}

export interface Session {
  id: string;
  title: string;
  subTitle: string;
}
