import "../styles/globals.css";
import type { AppProps } from "next/app";
import initAuth from "../firebase/firebase-config";
initAuth();
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
