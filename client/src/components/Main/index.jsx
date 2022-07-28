import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import deleteIcon from "../../images/delete.png";
import configData from "../../config.json";

const Main = () => {
  const [data, setData] = useState({ user: "", thought: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [existingThoughts, setExistingThoughts] = useState([]);
  const locale =
    window.navigator.language ||
    window.navigator.userLanguage ||
    configData.LOCALE;
  const apiUrl = configData.API_BASEURL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    // Get the existing thoughts from the server initially.  To save some
    // roundtrips to the server, we're just going to update the existingThougths locally
    // as items are added and removed.  I suppose you could insert a dependency in this useEffect
    // to watch for changes and refetch.

    async function getThoughts() {
      const config = {
        method: "GET",
        url:
          configData.API_BASEURL + "thoughts/" + localStorage.getItem("user"),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {},
      };
      console.log(config);
      try {
        const response = await axios.request(config);
        console.log(response);
        setExistingThoughts(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    }
    getThoughts();
  }, []);

  const callThoughtApi = async (operation, path, body) => {
    try {
      const config = {
        method: operation.toUpperCase(),
        url: apiUrl + "thoughts/" + path,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: body,
      };
      console.log(config);
      const response = await axios.request(config);
      setInfo(config.method + " successful");
      console.log(config, response);
      return response;
    } catch (error) {
      setError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");
    setInfo("");
  };

  // post thoughts to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.thought.length < 1) {
      setError("Please enter a thought");
      return;
    }
    data.user = localStorage.getItem("user");
    console.log(data);
    const response = await callThoughtApi("post", "", data);
    existingThoughts.unshift(response.data); //unshift rather than push to add to the top of the list
    setData({ user: "", thought: "" });
  };

  // delete thoughts from server
  const handleDelete = async (e) => {
    await callThoughtApi("delete", e.target.id);
    setExistingThoughts(
      existingThoughts.filter((thought) => thought._id !== e.target.id)
    );
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>ShowerThoughts Depot™</h1>
        <button className={styles.button} onClick={handleLogout}>
          {"Logout " + localStorage.getItem("user").toUpperCase()}
        </button>
      </nav>
      <div className={styles.body_container}>
        {error && <div className={styles.error_msg}>{error}</div>}
        {info && <div className={styles.info_msg}>{info}</div>}
        <textarea
          className={styles.textarea}
          name="thought"
          onChange={handleChange}
          placeholder="What's on your mind?"
          value={data.thought}
        ></textarea>
        <button className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th width="100%">Thought</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {existingThoughts.map((thought) => (
              <tr key={thought._id}>
                <td className={styles.date}>
                  {new Date(thought.date).toLocaleString(locale, {
                    timeZoneName: "short",
                  })}
                </td>
                <td>{thought.thought}</td>
                <td>
                  <img
                    id={thought._id}
                    src={deleteIcon}
                    alt="Delete"
                    onClick={handleDelete}
                  ></img>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;
