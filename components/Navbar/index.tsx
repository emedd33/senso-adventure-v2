import {
  unsetAuthCookies,
  useAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Login from "../Login";
import Register from "../Register";
import styles from "./style.module.css";
type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const AuthUser = useAuthUser();
  const logout = () => {
    AuthUser.signOut();
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
        <Modal
          open={openLoginModal}
          onClose={() => {
            setOpenLoginModal(false);
            setIsRegistering(false);
          }}
          center
        >
          <div className={styles.modalContainer}>
            {isRegistering ? <Register /> : <Login />}
            <svg
              width="100%"
              height="4"
              viewBox="0 0 375 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
            </svg>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className={styles.registerLoginButton}
            >
              {isRegistering ? "Go to login" : "Register"}
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
