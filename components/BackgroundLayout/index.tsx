import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./style.module.css";
import Image from "next/image";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

type BackgroundComponentProp = {
  children?: any;
  backgroundImageUrl?: string;
  isLoading?: boolean;
};
const BackgroundLayout: React.FC<BackgroundComponentProp> = ({
  children,
  backgroundImageUrl,
  isLoading,
}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.bgWrap}>
          <Image
            alt="Background image"
            src={
              backgroundImageUrl
                ? backgroundImageUrl
                : "/images/background-home.jpg"
            }
            layout="fill"
            objectFit="fill"
          />
        </div>
        <Navbar />
        <div className={styles.contentContainer}>
          {isLoading ? (
            <Loader type="Oval" color="#fff" height={80} width={80} />
          ) : (
            children
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BackgroundLayout;
