import React from 'react';
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Logo from "../Logo.png";
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
        <SideBar>
          <Link to={"./diet"}>Diet Plan</Link>
          <Link to={"./meal"}>Meals</Link>
          <Link to={"./food"}>Foods</Link>
        </SideBar>
      );
    } else {
      return "";
    }
  };
  return (
    <div>
      <NavBar>
        <HamburgerMenu onClick={() => changeBarView()}>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
          <div className="hamburger"></div>
        </HamburgerMenu>
        <SiteTitle>
          <Link to={"./"}>
            <img src={Logo} alt="site logo" />
          </Link>
          <p>sofiaDiet</p>
        </SiteTitle>
        <Version>
          <p>version: {process.env.REACT_APP_VERSION}</p>
        </Version>
      </NavBar>
      <hr />
      {renderSideBar(sideBarView)}
    </div>
  );
};

const NavBar = styled.nav`
  --nav-margins: 100px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 80px;
  border: 10px black;
`;

const HamburgerMenu = styled.div`
  border: 0.1px solid rgb(186, 202, 183);
  width: 57px;
  height: 42px;
  margin-right: 50px;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;

  :hover {
    box-shadow: 1px 1px 1px 10px rgb(245, 255, 229);
  }

  .hamburger {
    border-bottom: solid 3px grey;
    width: 28px;
  }
`;
const SiteTitle = styled.div`
  font-size: 40px;
  font-weight: 700;
  width: 280px;
  display: flex;
  justify-content: space-evenly;
  margin-left: var(--nav-margins);

  p {
    /* global 94%+ browsers support */
    background: linear-gradient(
      90deg,
      rgba(0, 255, 235, 1) 0%,
      rgba(7, 58, 187, 1) 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }

  img {
    width: 59px;
    height: 53px;
    border-radius: 20px;
  }
`;

const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin-right: 20px;
  color: rgb(104, 104, 104);
`;

const Version = styled.div`
  font-size: 28px;
  font-weight: 400;
  display: flex;
  color: #555555;
  justify-content: space-evenly;
  width: 180px;
  align-items: center;
  margin-left: var(--nav-margins);
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .nav-link:hover {
    border-bottom: 1px solid rgb(104, 104, 104);
  }
`;

export default Navbar;
