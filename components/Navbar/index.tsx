import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import LoginContainer from "../LoginContainer";
import Register from "../Register";
import styles from "./style.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import "react-responsive-modal/styles.css";
import { getAuth, signOut } from "firebase/auth";
type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [openModal, setOpenModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const logout = () => {
    signOut(auth).catch((error) => console.error(error));
  };
  const handleClose = () => {
    setOpenModal(false);
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
          {user ? (
            <h1
              className={styles.loginTitle}
              onClick={() => setOpenModal(true)}
            >
              {user.email}
            </h1>
          ) : (
            <h1
              tabIndex={0}
              className={styles.loginTitle}
              onClick={() => setOpenModal(true)}
            >
              Login
            </h1>
          )}
        </div>
        <Modal open={openModal} onClose={handleClose} center>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 style={{ textAlign: "center" }}>Senso Adventure</h2>
              <Image
                src="/icons/dice.png"
                width={30}
                height={30}
                alt="Site icon"
              />
            </div>
            {user ? (
              <button onClick={logout} style={{ color: "red" }}>
                Logout
              </button>
            ) : isRegistering ? (
              <Register
                closeModal={handleClose}
                setIsRegistering={setIsRegistering}
              />
            ) : (
              <LoginContainer
                closeModal={handleClose}
                setIsRegistering={setIsRegistering}
              />
            )}
            <div style={{ marginTop: "1rem" }}></div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
