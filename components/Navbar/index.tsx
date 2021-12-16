import Link from "next/link";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./style.module.css";
type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const responseGoogle = (response: any) => {
    console.log(response);
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
          <div className={styles.modalContainer}>
            <h2 style={{ textAlign: "center" }}>Login</h2>
            <GoogleLogin
              clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
            ,
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
