import { PrimaryBtn } from "../components/StyledElemnts";
import React, { useState } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import {AiOutlineBgColors} from "react-icons/ai";

const inactiveStyles = {
  color: "rgb(39, 187, 39)",
  boxShadow: "2px 2px 40px rgb(16,136,36)",
};

const ThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  return (
    <div>
      <Tooltip title="Theme Manager">
        <IconButton
          onClick={() => setCurrentTheme("dashboard")}
          className="icon"
          style={inactiveStyles}
        >
          <AiOutlineBgColors />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ThemeManager;
