import Link from "next/link";
import React from "react";
import styles from "./style.module.css";
type NavbarProp = {};
const Navbar: React.FC<NavbarProp> = ({}) => {
  return (
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
  );
};

export default Navbar;
