import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Modal from "react-responsive-modal";
import LoginContainer from "../LoginContainer";
import Register from "../Register";
import styles from "./style.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import "react-responsive-modal/styles.css";
import { getAuth, signOut } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import { AiFillCheckCircle, AiFillEdit } from "react-icons/ai";
import { FiXCircle } from "react-icons/fi";
import { dispatchSetWebhook } from "../../utils/UserIdUtils";
import { toast, ToastContainer } from "react-toastify";
import { toastObject } from "../../assets/toast";
import "react-toastify/dist/ReactToastify.css";

type NavbarProp = {};

const Navbar: React.FC<NavbarProp> = ({}) => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [openModal, setOpenModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [webhook, setWebhook] = useState<string>("");
  const [editWebhookOpen, setEditWebhookPotter] = useState<boolean>(false);
  const logout = () => {
    signOut(auth).catch((error) => console.error(error));
  };
  const handleClose = () => {
    setOpenModal(false);
    setIsRegistering(false);
  };

  const saveWebhook = () => {
    if (user?.uid) {
      dispatchSetWebhook(user?.uid, webhook).then((isSuccess) => {
        isSuccess
          ? toast.success("Saved", toastObject)
          : toast.error("Something went wrong", toastObject);
      });
    }
  };
  useMemo(() => {
    get(child(ref(getDatabase()), `users/${user?.uid}/webhook`))
      .then((snapshot) => snapshot.val())
      .then((res) => setWebhook(res));
  }, [user]);

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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span>
                    Discord webhook:{" "}
                    {webhook ? (
                      <AiFillCheckCircle color="green" />
                    ) : (
                      <FiXCircle color="red" />
                    )}
                  </span>
                  <button
                    onClick={() => setEditWebhookPotter(!editWebhookOpen)}
                  >
                    <AiFillEdit />
                  </button>
                </div>
                {editWebhookOpen ? (
                  <div>
                    <input
                      value={webhook}
                      onChange={(event) => setWebhook(event.target.value)}
                    />
                    <button onClick={saveWebhook}>Save</button>
                  </div>
                ) : null}
                <button onClick={logout} style={{ color: "red" }}>
                  Logout
                </button>
              </div>
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
          <ToastContainer />
        </Modal>
      </div>
    </>
  );
};

export default Navbar;
