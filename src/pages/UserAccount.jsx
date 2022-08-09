import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./UserAccount.css";
import {
  UserFilesCard,
  UserClientCard,
} from "../components/UserAccountCardComponents";
import LabTabs from "../components/UserAccountNavigation";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange, deepPurple } from "@mui/material/colors";

let initialFiles = [];
let username = localStorage.getItem('username')
const LetterAvatars = () => {
  return (
    <Stack direction="row" spacing={2} style={{ marginLeft: "1480px" }}>
      <Avatar sx={{ bgcolor: deepOrange[500] }}>{username[0]}</Avatar>
    </Stack>
  );
};

try {
  initialFiles = JSON.parse(localStorage.getItem("userFiles"));
  console.log("user files from local storage", initialFiles);
} catch (e) {
  console.log(e);
}

const UserAccount = () => {
  const [files, setFiles] = useState(initialFiles);
  const [clients, setClients] = useState([{ clientID : 'TFF-1'}])

  useEffect(() => {
    getUserFiles();
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
        <LetterAvatars />
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
