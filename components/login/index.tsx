import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import ContentContainer from "../ContentContainer";
import style from "./style.module.css";

type LoginProp = {};
const Login: React.FC<LoginProp> = ({}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, [loginEmail, loginPassword]);
  const login = () => {
    if (!loginEmail || !loginPassword) {
      return setErrorMessage("Please fill out loginform");
    }
  };

  return (
    <div>
      <div className={style.formContainer}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
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
        <button onClick={login}>Login</button>
        {errorMessage ? (
          <p className={style.errorMessage}>{errorMessage}</p>
        ) : null}
      </div>
    </div>
  );
};
export default Login;
