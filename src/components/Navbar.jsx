import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Tooltip, IconButton } from "@material-ui/core";
import { BiNetworkChart } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa"
const activeStyles = {
  backgroundColor: "#39424e",
  color: "rgb(39, 187, 39)",
  boxShadow: "2px 2px 40px rgb(16,136,36)",
};

const inactiveStyles = {
  color: "rgb(39, 187, 39)",
  boxShadow: "2px 2px 40px rgb(16,136,36)",
};

const Navbar = () => {
  const [currentPage, setCurrentPage] = useState("iot");
  return (
    <SideBar>
      <Link to={"./userAccount"}>
        <Tooltip title="User Account">
          <IconButton
            onClick={() => setCurrentPage("account")}
            className="icon"
            style={currentPage === "account" ? activeStyles : inactiveStyles}
          >
            <i className="fa fa-user"></i>
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./"}>
        <Tooltip title="Real Time Analysis">
          <IconButton
            onClick={() => setCurrentPage("iot")}
            className="icon"
            style={currentPage === "iot" ? activeStyles : inactiveStyles}
          >
            <BiNetworkChart />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./userUpload"}>
        <Tooltip title="Upload Files">
          <IconButton
            onClick={() => setCurrentPage("upload")}
            className="icon"
            style={currentPage === "upload" ? activeStyles : inactiveStyles}
          >
            <FaCloudUploadAlt />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./test"}>
        <Tooltip title="test">
          <IconButton
            onClick={() => setCurrentPage("test")}
            className="icon"
            style={currentPage === "test" ? activeStyles : inactiveStyles}
          >
            <i className="fa fa-upload"></i>
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./dashboard"}>
        <Tooltip title="dashboard">
          <IconButton
            onClick={() => setCurrentPage("dashboard")}
            className="icon"
            style={currentPage === "dashboard" ? activeStyles : inactiveStyles}
          >
            <i className="fa fa-chart-pie"></i>
          </IconButton>
        </Tooltip>
      </Link>
    </SideBar>
  );
};

const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin: 10px;
`;

const SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 5rem;
  margin: 0;
  display: flex;
  align-items: center;
  background-color: black;
  flex-direction: column;
`;

export default Navbar;
