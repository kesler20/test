import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const DashboardTitle = ({ viewMode, theme }) => {
  const [title, setTitle] = useState("My Dashboard");
  return (
    <div
      style={{
        fontWeight: 700,
        color: `${theme ? "#9292a5" : "#768db7"}`,
        width: "300px",
        fontFamily: "'Ubuntu', sans-serif",
      }}
    >
      {viewMode === "edit" ? (
        <TextField
          id="outlined-basic"
          label="Enter the Dashboard Title"
          color="secondary"
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <h2>{title}</h2>
      )}
    </div>
  );
};

export default DashboardTitle;
