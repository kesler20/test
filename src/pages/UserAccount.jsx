import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./UserAccount.css";
import {
  UserFilesCard,
  UserClientCard,
} from "../components/UserAccountCardComponents";
import LabTabs from "../components/UserAccountNavigation";
import LetterAvatars from "../components/LetterAvatar";

let username = localStorage.getItem("username");

const UserAccount = () => {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getUserFiles();
    getUserClients()
  }, []);

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

  const getUserFiles = async () => {
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
    } else {
      try {
        setFiles(JSON.parse(localStorage.getItem("userFiles")));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const createClient = () => {};
  const deleteClient = () => {};

  const getUserClients = () => {
    try {
      clients.push(JSON.parse(localStorage.getItem("client-info")))
      setClients(clients);
      console.log(clients)
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          backgroundColor: "#24315a",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          height: "60px",
          borderRadius: "20px",
          margin: "10px",
        }}
      >
        <i
          className="fa fa-check"
          style={{
            backgroundColor: "#27bb27",
            borderRadius: "50%",
            marginLeft: "10px",
            color: "white",
            height: "30px",
            width: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <h2 style={{ color: "white", marginLeft: "15px" }}>{username}</h2>
        <LetterAvatars username={username}/>
      </div>
      <LabTabs
        userFilesPanels={
          <UserFilesCard
            files={files}
            onDeleteFile={(file) => deleteFile(file)}
          />
        }
        userClientPanels={
          <UserClientCard
            onDeleteClient={(cli) => console.log(cli)}
            clients={clients}
          />
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
