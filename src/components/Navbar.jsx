import ThemeManager from "../utils/themeManager";
import React, { useState } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { BiNetworkChart } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import Logo from "../Logo.ico";
import { SideBar, Link } from "../components/StyledElemnts";

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

      <Link to={"./feedback"}>
        <Tooltip title="feedback">
          <IconButton
            onClick={() => setCurrentPage("feedback")}
            className="icon"
            style={currentPage === "feedback" ? activeStyles : inactiveStyles}
          >
            <AiFillMessage />
          </IconButton>
        </Tooltip>
      </Link>

      <ThemeManager />
    </SideBar>
  );
};

export default Navbar;
