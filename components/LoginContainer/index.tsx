import { ChangeEvent, useState } from "react";
import style from "./style.module.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  dispatchLoginWithEmail,
  dispatchLoginWithGoogle,
} from "../../firebase/login";

type LoginProp = {
  closeModal?: () => void;
  setIsRegistering: (value: boolean) => void;
};
const Login: React.FC<LoginProp> = ({ closeModal, setIsRegistering }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginWithEmail = () => {
    if (!loginEmail || !loginPassword) {
      return setErrorMessage("Please fill out loginform");
    }
    setIsLoading(true);

    dispatchLoginWithEmail(loginEmail, loginPassword).then(
      ({ code, message }) => {
        if (code === 0 && closeModal) {
          closeModal();
        } else {
          setErrorMessage(message);
        }
      }
    );
  };

  const loginWithGoogle = () => {
    dispatchLoginWithGoogle().then(({ code, message }) => {
      if (code === 0 && closeModal) {
        closeModal();
      } else {
        setErrorMessage(message);
      }
    });
  };

  return (
    <div
      className={style.formContainer}
      onKeyDown={(event) => (event.key === "Enter" ? loginWithEmail() : null)}
    >
      <input
        id="email"
        value={loginEmail}
        type="email"
        placeholder="Enter email"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setLoginEmail(event.target.value)
        }
      ></input>
      <input
        id="password1"
        value={loginPassword}
        type="password"
        placeholder="Enter password"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setLoginPassword(event.target.value)
        }
      ></input>
      <div className={style.registerBox}>
        <button
          onClick={() => setIsRegistering(true)}
          className={style.registerBoxText}
        >
          Register new account?
        </button>
        <></>
        {/* <button className={style.registerBoxText}>Forgotten password?</button> */}
      </div>

      <button
        disabled={isLoading}
        onClick={loginWithEmail}
        className={style.loginButton}
      >
        {isLoading ? (
          <Loader type="Oval" color="#fff" height={20} width={20} />
        ) : (
          "Login"
        )}
      </button>
      {errorMessage ? (
        <p className={style.errorMessage}>{errorMessage}</p>
      ) : null}
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
      </div>
      <button className={style.googleButton} onClick={loginWithGoogle}>
        <img
          src="/icons/google.svg"
          width={"18px"}
          height={"18px"}
          style={{ marginRight: "24px", color: "black" }}
        />
        Sign in with Google
      </button>
    </div>
  );
};
export default Login;
