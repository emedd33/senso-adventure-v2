import { FirebaseError } from "firebase-admin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";

export const dispatchLoginWithEmail = (email: string, password: string) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return { code: 0, message: "" };
    })
    .catch((error: FirebaseError) => {
      return { code: 1, message: error.message };
    });
};

export const dispatchLoginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  return signInWithPopup(auth, provider)
    .then((res) => {
      return get(ref(getDatabase(), `users/${res.user.uid}/username`))
        .then((snapshot) => snapshot.val())
        .then((username) => {
          if (!username) {
            return set(
              ref(getDatabase(), `users/${res.user.uid}/username`),
              res.user.uid
            ).then((res) => {
              return { code: 0, message: "" };
            });
          }
          return { code: 0, message: "" };
        });
      // This gives you a Google Access Token. You can use it to access the Google API
    })
    .catch((error: FirebaseError) => {
      return { code: 1, message: error.message };
    });
};
