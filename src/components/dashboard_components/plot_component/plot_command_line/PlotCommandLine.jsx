import React, { useEffect, useState } from "react";
import { Delete } from "@material-ui/icons";
import CommandLineSelector from "./command_line_selector/CommandLineSelector";
import CommandLineHamburger from "./command_line_hamburger/CommandLineHamburger.jsx.jsx";
import "./PlotCommandLine.css";

/**
 * This is the white navbar at the top of the plot which is used to change the features iof the plot
 *
 * Props:
 * - onDeleteBtnClicked - triggered by the delete btn component onClick event
 * - plotMetaData - a list of objects with properties name and metaData, containing the features of the plot
 * i.e. [ { name: "Select a File", metaData: dashboardThemes } ...]
 */
const PlotCommandLine = ({
  onDeleteBtnClicked,
  plotMetaData,
  selectedPlotFeature,
  onFeatureSelected,
  onFeatureOptionSelected,
}) => {
  return (
    <div className="command-line">
      <CommandLineHamburger
        plotMetaData={plotMetaData}
        onFeatureSelected={(selection) => onFeatureSelected(selection)}
      />
      <div className="command-line__selector">
        <CommandLineSelector
          selectedPlotFeature={selectedPlotFeature}
          onFeatureOptionSelected={(selection) =>
            onFeatureOptionSelected(selection)
          }
        />
      </div>
      <div className="command-line__button">
        <Delete onClick={onDeleteBtnClicked} />
      </div>
    </div>
  );
};

export default PlotCommandLine;
