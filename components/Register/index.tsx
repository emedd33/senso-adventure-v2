import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ChangeEvent, useState } from "react";
import Loader from "react-loader-spinner";
import style from "./style.module.css";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseError } from "firebase-admin";

type RegisterProp = {
  closeModal?: () => void;
  setIsRegistering: (value: boolean) => void;
};
const Register: React.FC<RegisterProp> = ({ closeModal, setIsRegistering }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword1, setRegisterPassword1] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const register = () => {
    if (!registerEmail) {
      return setErrorMessage("Fill out email");
    }
    if (!registerPassword1) {
      return setErrorMessage("Fill out password");
    }

    if (registerPassword2 !== registerPassword1) {
      return setErrorMessage("Passwords are not equal");
    }
    if (!errorMessage) {
      setErrorMessage("");
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, registerEmail, registerPassword1)
      .then(() => {
        if (closeModal) {
          closeModal();
        }
      })
      .catch((err: FirebaseError) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <div>
      <div
        onKeyDown={(event) => (event.key === "Enter" ? register() : null)}
        className={style.formContainer}
      >
        <input
          id="email"
          value={registerEmail}
          placeholder="Enter email"
          type="email"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setRegisterEmail(event.target.value)
          }
        ></input>
        <input
          id="password1"
          value={registerPassword1}
          placeholder="Enter password"
          type="password"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setRegisterPassword1(event.target.value)
          }
        ></input>
        <input
          id="password2"
          value={registerPassword2}
          type="password"
          placeholder="Confirm password"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setRegisterPassword2(event.target.value)
          }
        ></input>
        <button
          disabled={isLoading}
          onClick={register}
          className={style.registerButton}
        >
          {isLoading ? (
            <Loader type="Oval" color="#fff" height={20} width={20} />
          ) : (
            "Register"
          )}
        </button>
        {errorMessage ? (
          <p className={style.errorMessage}>{errorMessage}</p>
        ) : null}
      </div>
      <div style={{ margin: "1rem" }}>
        <svg
          width="15rem"
          height="4"
          viewBox="0 0 375 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
        </svg>
        <div className={style.registerBox}>
          <button
            onClick={() => setIsRegistering(false)}
            className={style.registerBoxText}
          >
            Go back to login
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
