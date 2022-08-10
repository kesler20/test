import React, { useState } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { BiNetworkChart } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Logo from "../assets/Logo.ico";
import { SideBar, Link } from "../StyledElemnts";

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
      <img
        src={Logo}
        alt="logo of the company"
        style={{ width: "50px", margin: "20%" }}
      ></img>
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

      <Link to={"./dashboard"}>
        <Tooltip title="dashboard">
          <IconButton
            onClick={() => setCurrentPage("dashboard")}
            className="icon"
            style={currentPage === "dashboard" ? activeStyles : inactiveStyles}
          >
            <MdDashboard />
          </IconButton>
        </Tooltip>
      </Link>
    </SideBar>
  );
};

export default Navbar;
