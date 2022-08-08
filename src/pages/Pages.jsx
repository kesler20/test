import React from "react";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import Upload from "./Upload";
import UserAccount from "./UserAccount";
import Dashboard from "./Dashboard";

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userUpload" element={<Upload />} />
      <Route path="/userAccount" element={<UserAccount />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default Pages;
