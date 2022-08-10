import React, { useState } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { BiNetworkChart } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./Navbar.css";
import Logo from "../../assets/Logo.ico";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

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

const Navbar = () => {
  const [currentPage, setCurrentPage] = useState("iot");
  return (
    <SideBar>
      <img
        className="navbar__site-logo"
        src={Logo}
        alt="logo of the company"
      ></img>

      <Link to={"./userAccount"}>
        <Tooltip title="User Account">
          <IconButton
            onClick={() => setCurrentPage("account")}
            className={
              currentPage === "account"
                ? "icon navbar__navigation-link--active"
                : "icon navbar__navigation-link--inactive"
            }
          >
            <i className="fa fa-user"></i>
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./"}>
        <Tooltip title="Real Time Analysis">
          <IconButton
            onClick={() => setCurrentPage("iot")}
            className={
              currentPage === "iot"
                ? "icon navbar__navigation-link--active"
                : "icon navbar__navigation-link--inactive"
            }
          >
            <BiNetworkChart className="navbar__navigation-link__icon" />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./userUpload"}>
        <Tooltip title="Upload Files">
          <IconButton
            onClick={() => setCurrentPage("upload")}
            className={
              currentPage === "upload"
                ? "icon navbar__navigation-link--active"
                : "icon navbar__navigation-link--inactive"
            }
          >
            <FaCloudUploadAlt className="navbar__navigation-link__icon" />
          </IconButton>
        </Tooltip>
      </Link>

      <Link to={"./dashboard"}>
        <Tooltip title="dashboard">
          <IconButton
            onClick={() => setCurrentPage("dashboard")}
            className={
              currentPage === "dashboard"
                ? "icon navbar__navigation-link--active"
                : "icon navbar__navigation-link--inactive"
            }
          >
            <MdDashboard className="navbar__navigation-link__icon" />
          </IconButton>
        </Tooltip>
      </Link>
    </SideBar>
  );
};

export default Navbar;
