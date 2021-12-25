import { child, get, getDatabase, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { FirebaseSessionItems, Session } from "../assets/campaign.type";

export const getSessionsById = async (
  ownerid: string,
  campaignid: string
): Promise<Session[]> => {
  // Fetches the campaign in SSR
  return get(
    child(
      ref(getDatabase()),
      `users/${ownerid}/campaigns/${campaignid}/sessions`
    )
  )
    .then((snapshot) => snapshot.val())
    .then((sessions) => {
      return sessions
        ? Object.keys(sessions).map((id) => ({
            ...sessions[id],
            id: id,
          }))
        : [];
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export const getCampaignImageById = async (
  ownerid: string,
  campaignid: string
): Promise<string> => {
  const storage = getStorage();
  return get(
    child(ref(getDatabase()), `users/${ownerid}/campaigns/${campaignid}/image`)
  )
    .then((snapshot) => snapshot.val())
    .then((image) =>
      getDownloadURL(
        storageRef(storage, `users/${ownerid}/campaigns/${campaignid}/${image}`)
      )
    )
    .catch((err) => {
      console.error(err);
      return "";
    });
};

export const dispatchNewSession = (
  ownerid: string,
  campaignid: string,
  sessions: Session[]
): Promise<any> => {
  const db = getDatabase();
  const date = new Date().toLocaleDateString();
  const newSessionId = sessions
    ? `session_${sessions.length + 1}`
    : "session_1";
  const newSession: FirebaseSessionItems = {
    date: date,
    title: newSessionId,
    subTitle: "",
    snippet: "",
    isPublished: false,
  };
  return set(
    ref(
      db,
      `users/${ownerid}/campaigns/${campaignid}/sessions/${newSessionId}`
    ),
    newSession
  ).then(() => newSessionId);
};
