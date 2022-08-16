import { React, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports"; //Some tutorials suggest awsconfig instead
import { withAuthenticator } from "@aws-amplify/ui-react";
import Pages from "./pages/Pages";
import Navbar from "./components/navbar/Navbar";

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
      console.log(e);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar></Navbar>
        <Pages />
      </BrowserRouter>
    </div>
  );
}

export default withAuthenticator(App, true);
