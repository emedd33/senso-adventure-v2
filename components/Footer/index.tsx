import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className={styles.container}>
      <span
        style={{
          color: "gray",
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ marginRight: "1rem", color: "white" }}>
          @2022 Eskild Ruud Mageli
        </span>
        <Link href="https://github.com/emedd33/senso-adventure-v2/">
          <a>
            <Image
              src="/images/github.png"
              width={30}
              height={30}
              alt="github icon"
              className={styles.githubLogo}
            />
          </a>
        </Link>
      </span>
      <div></div>
    </div>
  );
};

export default Footer;
