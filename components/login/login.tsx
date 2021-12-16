import { ChangeEvent, useMemo, useState } from "react";
import ContentContainer from "../ContentContainer";
import style from "./style.module.css";
type LoginProp = {};
const Login: React.FC<LoginProp> = ({}) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword1, setRegisterPassword1] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const register = async () => {
    console.log("register");
    return false;
  };

  const login = async () => {};

  const logout = async () => {};

  return (
    <ContentContainer>
      {isRegistering ? (
        <>
          <h2 style={{ textAlign: "center" }}>Register</h2>
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
            <button onClick={register}>Register</button>
            <svg
              width="100%"
              height="4"
              viewBox="0 0 375 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
            </svg>
            <button onClick={() => setIsRegistering(false)}>Go to Login</button>
          </div>
        </>
      ) : (
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
          <svg
            width="100%"
            height="4"
            viewBox="0 0 375 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M375 2L0 3.73205V0.267949L375 2Z" fill="#A12A20" />
          </svg>
          <button onClick={() => setIsRegistering(true)}>
            Register with Email
          </button>
        </div>
      )}
    </ContentContainer>
  );
};
export default Login;
