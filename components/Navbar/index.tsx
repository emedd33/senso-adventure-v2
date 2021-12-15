import React from "react";
import styles from "./style.module.css";
type NavbarProp = {};
const Navbar: React.FC<NavbarProp> = ({}) => {
  return (
    <div className={styles.container}>
      <a className={styles.title} href="/">
        <div className={styles.title1}>Senso</div>
        <div className={styles.title2}>Adventure</div>
      </a>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login</h1>
      </div>
    </div>
  );
};

export default Navbar;