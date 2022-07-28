import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Auth } from "aws-amplify";

const Register = () => {
  const [data, setData] = useState({
    user: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [code, setCode] = useState("");
  const [waitingForCode, setWaitingForCode] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setInfo("");
    setError("");
  };



  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log(data);

    Auth.signUp({
      username: data.user,
      password: data.password,
      attributes: { email: data.email },
    })
      .then((response) => {
        console.log(response);
        setWaitingForCode(true);
        setData({ ...data, password: "" });
      }
      )
      .catch((err) => {
        console.log(err);
        setError(err.message);
      }
      );
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    Auth.confirmSignUp(data.user, code)
      .then((response) => {
        console.log(response);
        setInfo("Account confirmed. Please log in.");
        setError("");
        setCode("");
        setData({});
        setWaitingForCode(false);
      }
    )
      .catch((err) => {
        setInfo("");
        setError(err.message);
        console.log(err.message);
      }
    );
  }

  const resendCode = async (e) => {
    e.preventDefault();
    console.log(data);
    Auth.resendSignUp(data.user)
      .then(() => {
        setInfo("Code resent. Please check your email.");
      })
      .catch((err) => {
        setError(err.message);
        console.log(err.message);
      }
    );
  }

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Already Registered?</h1>
          <Link to="/login">
            <button type="button" className={styles.button}>
              Login
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          {!waitingForCode && (
            <form className={styles.form_container}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Username"
                name="user"
                onChange={handleChange}
                value={data.user}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                className={styles.input}
              />

              <button
                type="submit"
                className={styles.button}
                onClick={handleSignUp}
              >
                Register
              </button>
            </form>
          )}
          {waitingForCode && (
            <form className={styles.form_container}>
              <h1>Validation Code</h1>
              <input
                type="code"
                placeholder="_ _ _ _ _"
                name="code"
                onChange={(e) => setCode(e.target.value)} 
                value={code}
                className={styles.input_validate}
              />
              <button
                type="submit"
                className={styles.button}
                onClick={handleConfirm}
              >
                Validate Account
              </button>
              <button
                type="submit"
                className={styles.button}
                onClick={resendCode}
              >
                Resend Code
              </button>
            </form>
          )}
          {error && <div className={styles.error_msg}>{error}</div>}
          {info && <div className={styles.info_msg}>{info}</div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
