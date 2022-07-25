import { React, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports"; //Some tutorials suggest awsconfig instead
import Iot from "./components/Iot";
import { withAuthenticator, Button, defaultTheme } from "@aws-amplify/ui-react";

Amplify.configure(awsExports); //some configure using awsconfig rather than awsExports

function App() {
  //This useEffect stores current user's username and JSON web token to local storage
  //the username and jwtToken are used for API fetches for authentication
  useEffect(() => {
    Auth.currentCredentials().then((info) => {
      const cognitoIdentityId = info.identityId;
      console.log(cognitoIdentityId);
    });

    Auth.currentUserInfo().then((user) => {
      localStorage.setItem("username", user.username);
      console.log("username set");
    });

    Auth.currentSession().then((user) => {
      localStorage.setItem("jwtToken", user.accessToken.jwtToken);
      console.log("token set");
    });
  }, []);

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async function loadUserDash() {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/loaddash`,
      {
        headers: { "X-JWT": "Bearer " + localStorage.getItem("jwtToken") },
      }
    );
    console.log(response);
    if (!response.ok) {
      alert("No dashboard save found");
      return null;
    }

    let dashboard = await response.json();
    dashboard = JSON.parse(dashboard);
    console.log(dashboard);

    localStorage.setItem("userDash", JSON.stringify(dashboard.userDash));
    localStorage.setItem("theme", dashboard.theme);

    for (const [key, value] of Object.entries(dashboard.grids)) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    // The elements were never parsed so these values don't need to be stringified
    for (const [key, value] of Object.entries(dashboard.elements)) {
      localStorage.setItem(key, value);
    }

    // Easy method: Force refresh for graphs to re-render
    window.location.reload();
  }

  return (
    <div>
      <Button theme={defaultTheme} onClick={signOut}>
        Sign Out
      </Button>
      <Iot />
    </div>
  );
}

export default withAuthenticator(App, true);
