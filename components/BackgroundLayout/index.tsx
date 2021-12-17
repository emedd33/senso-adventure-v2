import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./style.module.css";
import Image from "next/image";
type BackgroundComponentProp = {
  children: any;
  backgroundImageUrl?: string;
};
const BackgroundLayout: React.FC<BackgroundComponentProp> = ({
  children,
  backgroundImageUrl,
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
        <div className={styles.contentContainer}>{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default BackgroundLayout;
