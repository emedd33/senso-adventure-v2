import { createUserWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import ContentContainer from "../ContentContainer";
import style from "./style.module.css";

type RegisterProp = {};
const Register: React.FC<RegisterProp> = ({}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword1, setRegisterPassword1] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const register = () => {
    console.log(registerEmail, registerPassword1, registerPassword2);

    if (!registerEmail) {
      setErrorMessage("Fill out email");
    }
    if (!registerPassword1) {
      setErrorMessage("Fill out password");
    }

    if (registerPassword2 !== registerPassword1) {
      setErrorMessage("Passwords are not equal");
    }
    // createUserWithEmailAndPassword(firebaseAuth,registerEmail, registerPassword1).then(user=> {
    //   console.log(user)
    // }).catch((err)=>{
    //   console.log(err)
    // })
  };
  return (
    <div>
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
        <button onClick={() => register()}>Register</button>
      </div>
      <p className={style.errorMessage}>{errorMessage}</p>
    </div>
  );
};
export default Register;
