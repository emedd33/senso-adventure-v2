// Import the functions you need from the SDKs you need
import { init } from "next-firebase-auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKER,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    // firebaseAuthEmulatorHost: "localhost:9099",
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          : "",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          ? process.env.FIREBASE_CLIENT_EMAIL
          : "",
        // The private key must not be accessible on the client side.
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY
          : "",
      },
      databaseURL: "",
    },
    // Use application default credentials (takes precedence over fireaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        : "", // required
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        : "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        : "",
    },
    cookies: {
      name: "ExampleApp", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // set this to false in local (non-HTTPS) development
      signed: false,
    },
    /**
     * Optional function: handler called if there's an unexpected error while
     * verifying the user's ID token server-side.
     */
    // onVerifyTokenError: (err) => {}
    /**
     * Optional function: handler called if there's an unexpected error while
     * refreshing the user's ID token server-side.
     */
    // onTokenRefreshError: (err) => {}
  });
  console.log("Firebase initialized");
};
export default initAuth;
// export const firebaseAuth = getAuth(app);
