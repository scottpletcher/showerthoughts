import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Auth } from "aws-amplify";

const Login = () => {

  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    Auth.signIn({
      username: data.username,
      password: data.password,
    })
      .then((user) => {
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", user.signInUserSession.accessToken.jwtToken);
        setData({ ...data, username: "", password: "" });
        window.location = "/";
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      }
      );
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSignIn}>
            <h1>Welcome Back!</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
          {error && <div className={styles.error_msg}>{error}</div>}
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <Link to="/register">
            <button type="button" className={styles.button}>
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
