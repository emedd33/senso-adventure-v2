import "../styles/globals.css";
import type { AppProps } from "next/app";
import initFirebase from "../firebase/firebase-config";
initFirebase();
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
