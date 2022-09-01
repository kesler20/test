import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useState } from "react";

const SelectToolBar = ({ containerWidth }) => {
  const [age, setAge] = useState("");

  return (
    <FormControl
      style={{
        maxWidth: "380px",
        minWidth: `200px`,
        width: `${parseFloat(containerWidth) - 90}px`,
      }}
    >
      <InputLabel id="demo-simple-select-label">
        Select an interactive Tool
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        label="Age"
        onChange={(e) => setAge(e.target.value)}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectToolBar;
