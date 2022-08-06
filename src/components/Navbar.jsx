import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Logo from "../Logo.jpg";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [sideBarView, setSideBarView] = useState([]);

  useEffect(() => {
    changeBarView();
  }, []);

  const changeBarView = () => {
    let currentView = !sideBarView;
    setSideBarView(currentView);
  };

  const renderSideBar = (toRender) => {
    if (toRender) {
      return (
        <NavbarLinks>
          <div onClick={() => changeBarView()}>
            <i className="fa fa-bars" style={{ color: "white" }}></i>
          </div>
          <hr />
          <Link to={"./"}><i className="fa fa-line-chart"></i></Link>
          <Link to={"./userUpload"}><i className="fa fa-file"></i></Link>
          <Link to={"./userAccount"}><i className="fa fa-user"></i></Link>
          <Link to={"./test"}>test</Link>
          <Link to={"./dashboard"}><i className="fa fa-chart-pie"></i></Link>
        </NavbarLinks>
      );
    } else {
      return "";
    }
  };
  return (
    <div>
      <SideBar>
        <div onClick={() => changeBarView()}>
          <i className="fa fa-bars" style={{ color: "white" }}></i>
        </div>
        <hr />
        {renderSideBar(sideBarView)}
      </SideBar>
    </div>
  );
};

const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin: 20px;
  color: rgb(104, 104, 104);
`;

const SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 4rem;
  margin: 0;
  display: flex;
  background-color: black;
  flex-direction: column;
  `;
  
  const NavbarLinks = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 10rem;
  margin: 0;
  display: flex;
  display: flex;
  background-color: black;
  flex-direction: column;
`;

export default Navbar;
