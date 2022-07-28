import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Register";
import Login from "./components/Login";
import Amplify from "aws-amplify";
import { useEffect } from "react";

function App() {
  const user = localStorage.getItem("token");

  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      },
    });
  })

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/register" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
