import UserClientNavbar from "../../components/user_account_components/user_account_cards/user_client_CRUD_navbar/UserClientNavbar";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./UserAccount.css";
import {
  UserFilesCard,
  UserClientCard,
} from "../../components/user_account_components/user_account_cards/UserAccountCardComponents";
import LabTabs from "../../components/user_account_components/user_account_navigation_bar/UserAccountNavigation";
import LetterAvatars from "../../components/user_account_components/letter_avatar/LetterAvatar";

let username = localStorage.getItem("username");

const UserAccount = () => {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getUserFiles();
    getUserClients();
    getUserTopics();
  }, []);

  const createTopic = (name) => {
    let topicNames = JSON.parse(localStorage.getItem("user-topics"));
    topicNames.push(name);
    localStorage.setItem("user-topics", JSON.stringify(topicNames));
    setTopics(topicNames.map((name) => name));
    console.log("topic created  successfully ✅", name);
  };

  const getUserTopics = () => {
    if (localStorage.getItem("user-topics") === null) {
      localStorage.setItem(
        "user-topics",
        JSON.stringify(["concentration", "temperature", "pressure"])
      );
    }

    setTopics(JSON.parse(localStorage.getItem("user-topics")));
  };

  const deleteTopic = (name) => {
    let topicNames = JSON.parse(localStorage.getItem("user-topics"));
    topicNames = topicNames.filter((topic) => topic !== name);
    localStorage.setItem("user-topics", JSON.stringify(topicNames));
    setTopics(topicNames.filter((topic) => topic !== name));
    console.log("topic created  successfully ✅", name);
  };

  const getUserFiles = async () => {
    try {
      setFiles(JSON.parse(localStorage.getItem("userFiles")));
    } catch (e) {
      console.log(e);
    }

    if (files.length === 0) {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/READ`,
        {
          headers: new Headers({
            "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
          }),
          method: "GET",
        }
      );
      response.json().then((res) => {
        setFiles(res["files found"]);
        localStorage.setItem("userFiles", JSON.stringify(res["files found"]));
      });
    }
  };

  const deleteFile = async ({ filename }) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/DELETE`,
      {
        headers: new Headers({
          "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
        }),
        method: "POST",
        body: filename,
      }
    );

    response.json().then((res) => {
      setFiles(res["deleted file"]);
      localStorage.setItem("userFiles", JSON.stringify(res["deleted file"]));
    });

    setFiles(files.filter((file) => file.filename !== filename));
    console.log(files);
  };

  const createClient = (client) => {
    let clients = JSON.parse(localStorage.getItem("client-info"));
    clients.push(client);
    localStorage.setItem("client-info", JSON.stringify(clients));
    setClients(clients.map((client) => client));
    console.log("client created  successfully ✅", client);
  };

  const getUserClients = () => {
    if (localStorage.getItem("client-info") === null) {
      localStorage.setItem(
        "client-info",
        JSON.stringify([
          {
            channelID: 0,
            readTopic: "pump/pressure",
            writeTopic: "pump/control",
            controlled: true,
            errorBound: 5,
            smoothing: { value: 0, visible: false },
            controlIntensity: 1,
            online: true,
            clientID: "TFF-1",
          },
          {
            channelID: 1,
            readTopic: "pump/temperature",
            writeTopic: "heater/control",
            controlled: true,
            errorBound: 5,
            smoothing: { value: 0, visible: false },
            controlIntensity: 1,
            online: true,
            clientID: "IVT-1",
          },
        ])
      );
    }
    setClients(JSON.parse(localStorage.getItem("client-info")));
  };

  const deleteClient = (clientID) => {
    let clients = JSON.parse(localStorage.getItem("client-info"));
    clients = clients.filter((client) => client.clientID !== clientID);
    localStorage.setItem("client-info", JSON.stringify(clients));
    setClients(clients.filter((client) => client.clientID !== clientID));
    console.log("client created  successfully ✅", clientID);
  };

  return (
    <div>
      <div className="user-account__header">
        {/* <i className="user-account__header__verified fa fa-check" /> */}
        <h2 className="user-account__header__username">{username}</h2>
        <LetterAvatars username={username} />
      </div>

      <LabTabs
        userFilesPanels={
          <UserFilesCard
            files={files}
            onDeleteFile={(file) => deleteFile(file)}
          />
        }
        userClientPanels={
          <div>
            <UserClientCard
              clients={clients}
              topics={topics}
              onCreateTopic={(topicName) => createTopic(topicName)}
              onDeleteTopic={(topicName) => deleteTopic(topicName)}
            />
            <UserClientNavbar
              handleCreate={(client) => createClient(client)}
              handleDelete={(clientID) => deleteClient(clientID)}
            />
          </div>
        }
        userDashboards={<div />}
      />
    </div>
  );
};

export default UserAccount;

// TODO: run this to start the local storage
//localStorage.setItem(
//   "client-info",
//   JSON.stringify({
//     channelID: 0,
//     readTopic: "pump/pressure",
//     writeTopic: "pump/control",
//     controlled: true,
//     errorBound: 5,
//     smoothing: { value: 0, visible: false },
//     controlIntensity: 1,
//     online: true,
//     clientID: "TFF-1"
//   })
// );
// TODO: create apis for whenever you use local storage so that it can be easily turned into aws storage
