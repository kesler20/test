import React from "react";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import Upload from "./Upload"
const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userUpload" element={<Upload />} />
    </Routes>
  );
};

export default Pages;
