import { child, get, getDatabase, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadString,
} from "firebase/storage";
import { Session } from "../assets/campaign.type";
import { getEnvironment } from "./environment";
import { createSessionSnippet } from "./stringUtils";

export const getContentById = async (
  ownerid: string,
  campaignid: string,
  sessionid: string
): Promise<{ session: Session; sessionContent: string }> => {
  const session = await get(
    child(
      ref(getDatabase()),
      `/users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}`
    )
  )
    .then((snapshot) => snapshot.val())
    .catch((error) => console.error(error));
  // Fetches url for background image in SSR

  const storage = getStorage();
  const sessionContent = await getDownloadURL(
    storageRef(
      storage,
      `users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}.html`
    )
  )
    .then((url) =>
      fetch(url, {
        credentials: "same-origin",
      })
        .then((res) => res.text())
        .catch((err) => {
          console.error(err);
          return "";
        })
    )
    .catch((err) => {
      console.error(err);
      return "";
    });

  return { session: session, sessionContent: sessionContent };
};

export const dispatchSaveSession = async (
  ownerid: string,
  campaignid: string,
  sessionid: string,
  sessionContent: string,
  sessionTitle: string,
  sessionSubTitle: string,
  sessionDate: Date
) => {
  // Saving content to storage
  const storage = getStorage();
  let isSuccess = true;
  await uploadString(
    storageRef(
      storage,
      `users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}.html`
    ),
    sessionContent
  )
    .then(() => console.log("Session updated in Firebase Storage"))
    .catch((err) => {
      (isSuccess = false), console.error(err);
    });

  // Saving metadata to database
  await set(
    ref(
      getDatabase(),
      `/users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}`
    ),
    {
      title: sessionTitle,
      subTitle: sessionSubTitle,
      date: sessionDate.toLocaleDateString(),
      snippet: createSessionSnippet(sessionContent),
    }
  )
    .then(() => console.log("Session updated in Firebase Database"))
    .catch((error) => {
      isSuccess = false;
      console.error(error);
    });
  return isSuccess;
};

export const dispatchDiscordPublish = async (
  ownerid: string,
  campaignid: string,
  sessionid: string,
  sessionTitle: string,
  sessionSnippet: string,
  campaignImageUrl: string | undefined
) => {
  // Fetches webhook url
  let isSuccess = true;
  const webhook = await get(ref(getDatabase(), `/users/${ownerid}/webhook/`))
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.log(error);
      isSuccess = false;
    });

  // Fetches metadata for session
  const sessionUrl = `${getEnvironment()}/${ownerid}/${campaignid}/${sessionid}`;
  const color = await get(
    ref(getDatabase(), `/users/${ownerid}/campaigns/${campaignid}/color`)
  ).catch((error) => {
    console.log(error);
    return "";
  });
  const campaignTitle = await get(
    ref(getDatabase(), `/users/${ownerid}/campaigns/${campaignid}/title`)
  )
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.log(error);
      return "";
    });
  const data = {
    username: "Senso bot",
    embeds: [
      {
        title: `${campaignTitle}: ${sessionTitle}`,
        url: sessionUrl,
        description: sessionSnippet,
        color: color,
        image: campaignImageUrl
          ? {
              url: campaignImageUrl,
            }
          : {},
      },
    ],
  };

  // Post reqiest to discord
  await fetch("webhook", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  }).then(() =>
    set(
      ref(
        getDatabase(),
        `/users/${ownerid}/campaigns/${campaignid}/sessions/${sessionid}/isPublished`
      ),
      true
    ).catch((error) => {
      isSuccess = false;
      console.log(error);
      return "";
    })
  );
  return isSuccess;
};
