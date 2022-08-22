import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Upload from "./upload/Upload";
import UserAccount from "./user_account/UserAccount";
import Dashboard from "./dashboard/Dashboard";
import Feedback from "react-bootstrap/esm/Feedback";

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userUpload" element={<Upload />} />
      <Route path="/userAccount" element={<UserAccount />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
};

export default Pages;
