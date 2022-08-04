import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, Cards } from "../components/StyledElemnts";
import './UserAccount.css'

let initialFiles = [];

try {
  initialFiles = JSON.parse(localStorage.getItem("userFiles"));
} catch (e) {
  console.log(e);
}

const UserAccount = () => {
  const [files, setFiles] = useState(initialFiles);

  useEffect(() => {
    getUserFiles();
  }, []);

  const getUserFiles = async () => {
    if (files) {
      setFiles(localStorage.getItem('userFiles'))
    }
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
      localStorage.setItem("userFiles", res["files found"]);
    });
  };
  return (
    <div>
      <Grid>
        {files.map((file) => {
          return (
            <Cards key={files.indexOf(file)}>{JSON.stringify(file)}</Cards>
          );
        })}
      </Grid>
    </div>
  );
};

export default UserAccount;
