import Link from "next/link";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Login from "../login/login";
import styles from "./style.module.css";
type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

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
          <h1
            tabIndex={0}
            className={styles.loginTitle}
            onClick={() => setOpenLoginModal(true)}
          >
            Login
          </h1>
        </div>
        <Modal
          open={openLoginModal}
          onClose={() => setOpenLoginModal(false)}
          center
        >
          <Login />
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
