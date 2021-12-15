import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import styles from "./style.module.css";
type NavbarProp = {};
const Navbar: React.FC<NavbarProp> = ({}) => {
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <Link href="/">
            <a className={styles.title1}>Senso</a>
          </Link>
          <Link href="/">
            <a className={styles.title2}>Adventure</a>
          </Link>
        </div>
        <div className={styles.loginContainer}>
          <h1 className={styles.loginTitle}>Login</h1>
        </div>
      </div>
    </>
  );
};

export default Navbar;
