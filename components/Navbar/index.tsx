import {
  unsetAuthCookies,
  useAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
// import Login from "../Login";
import Register from "../Register";
import styles from "./style.module.css";

import "react-responsive-modal/styles.css";
type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const AuthUser = useAuthUser();
  const logout = () => {
    AuthUser.signOut();
  };
  const handleClose = () => {
    setOpenLoginModal(false);
    setIsRegistering(false);
  };

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
          {AuthUser.email ? (
            <h1 className={styles.loginTitle} onClick={logout}>
              {AuthUser.email}
            </h1>
          ) : (
            <h1
              tabIndex={0}
              className={styles.loginTitle}
              onClick={() => setOpenLoginModal(true)}
            >
              Login
            </h1>
          )}
        </div>
        <Modal open={openLoginModal} onClose={handleClose} center>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 style={{ textAlign: "center" }}>Senso Adventure</h2>
              <Image src="/icons/dice.png" width={30} height={30} />
            </div>
            {
              isRegistering ? (
                <Register
                  closeModal={handleClose}
                  setIsRegistering={setIsRegistering}
                />
              ) : null
              // <Login
              //   closeModal={handleClose}
              //   setIsRegistering={setIsRegistering}
              // />
            }
            <div style={{ marginTop: "1rem" }}></div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
