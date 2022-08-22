import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { FaBars } from "react-icons/fa";

////////////////////////////////////////////////
// HAMBURGER MENU FOR SELECTING EDITABLE FEATURE
////////////////////////////////////////////////

/**
 * The command line hamburger is the left most button in the plot command line
 * This is used to select the feature of the dashboard that we want to edit
 *
 * State:
 * - anchorEl - this is used for visual purposes and is included from the implementation
 * of the material ui component
 *
 * Props:
 * - onOptionSelected - this triggers the <PARENT EVENT> and passes the selection name
 * - plotMetaData - a list of objects with properties name and metaData, containing the features of the plot
 * i.e. [ { name: "Select a File", metaData: dashboardThemes } ...]
 */
const CommandLineHamburger = ({ onFeatureSelected, plotMetaData }) => {
  /*

   - anchorEl, open, handle click and close are used to toggle the component
   - the onFeatureSelected prop is called within the handleClose method when the user selects a menu item 

   */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (selection) => {
    // to make sure that an option has being clicked
    if (plotMetaData.filter((data) => data.name === selection).length >= 1) {
      onFeatureSelected(selection);
      setAnchorEl(null);
    }
  };
  /* 

  - editable feature should be converted into data coming from a state
  - find a way to pass METADATA to the user selection component

   */
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FaBars />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {plotMetaData.map((editableFeature) => {
          return (
            <MenuItem
              key={plotMetaData.indexOf(editableFeature)}
              onClick={() => handleClose(editableFeature.name)}
              value={editableFeature.name}
            >
              {editableFeature.name}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default CommandLineHamburger;
