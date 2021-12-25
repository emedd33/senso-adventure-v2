import { child, get, getDatabase, ref } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import {
  Campaign,
  FirebaseCampaign,
  FirebaseCampaignItems,
} from "../assets/campaign.type";

export const getCampaigns = async (ownerId: string): Promise<Campaign[]> => {
  const storage = getStorage();
  return get(child(ref(getDatabase()), `users/${ownerId}/campaigns/`))
    .then((snapshot) => snapshot.val())
    .then((campagins: FirebaseCampaign) =>
      Promise.all(
        Object.entries(campagins).map(
          async ([campaignid, campaign]: [string, FirebaseCampaignItems]) =>
            ({
              id: campaignid,
              title: campaign.title,
              image: campaign.image
                ? await getDownloadURL(
                    storageRef(
                      storage,
                      `/users/${ownerId}/campaigns/${campaignid}/${campaign.image}`
                    )
                  )
                : "",
            } as Campaign)
        )
      )
    ) as Promise<Campaign[]>;
};
