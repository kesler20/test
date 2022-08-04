import { React, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports"; //Some tutorials suggest awsconfig instead
import { withAuthenticator, Button, defaultTheme } from "@aws-amplify/ui-react";
import Pages from "./pages/Pages";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../src/components/Navbar"

Amplify.configure(awsExports); //some configure using awsconfig rather than awsExports

function App() {
  //This useEffect stores current user's username and JSON web token to local storage
  //the username and jwtToken are used for API fetches for authentication
  useEffect(() => {
    Auth.currentUserInfo().then((user) => {
      localStorage.setItem("username", user.username);
      console.log("username set");
    });

    Auth.currentSession().then((user) => {
      localStorage.setItem("jwtToken", user.accessToken.jwtToken);
      console.log("token set");
    });
  }, []);

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (e) {
      console.log(e)
    }
  };

  const uploadUserFiles = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/`, {
      headers: { "X-JWT": "Bearer " + localStorage.getItem("jwtToken") },
    });
    console.log(response);
    if (!response.ok) {
      alert("No dashboard save found");
      return null;
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar>
          <Logo to={"/"}>Site Title</Logo>
        </Navbar>
        <Pages />
      </BrowserRouter>
    </div>
  );
}

const Logo = styled(Link)`
  text-decoration: none;
  font-size:1.5rem;
  font-weight:400;
  font-family: 'Lobster Two', cursive;
`;

export default withAuthenticator(App, true);

