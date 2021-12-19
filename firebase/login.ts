import { FirebaseError } from "firebase-admin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

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
    .then(() => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      return { code: 0, message: "" };
    })
    .catch((error: FirebaseError) => {
      return { code: 1, message: error.message };
    });
};
