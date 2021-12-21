import { Session } from "../../../../assets/campaign.type";

export type SessionIdProps = {
  campaignId: string;
  session: Session;
  ownerId: string;
  campaignImage: string;
};
