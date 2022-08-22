import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

/**
 * Provides the user the ability to select which graph they want to plot from the actual graph
 *
 * @param FormControl
 * @param InputLabel
 */

const CommandLineSelector = ({
  selectedPlotFeature,
  onFeatureOptionSelected,
}) => {
  const [currentFeature, setCurrentFeature] = useState("");

  const handleChange = (selection) => {
    onFeatureOptionSelected(selection);
    setCurrentFeature(selection);
  };
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="demo-simple-select-label">
        {selectedPlotFeature.name}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentFeature}
        label="Plot"
        onChange={(e) => handleChange(e.target.value)}
      >
        {selectedPlotFeature.metaData.map((option) => {
          return (
            <MenuItem
              key={selectedPlotFeature.metaData.indexOf(option)}
              value={option.name}
            >
              {option.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default CommandLineSelector;
