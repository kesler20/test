import React, { forwardRef, useEffect, useState } from "react";
import PlotCommandLine from "../plot_component/plot_command_line/PlotCommandLine";
import PlotlyInterface from "../../../APIs/PlotlyInterface";

/////////////////////////////////////
//PLOT COMPONENT DISPLAYING THE GRAPH
/////////////////////////////////////

/**
 * This component represents the Plotly graph which is resizable and draggable
 * @see https://github.com/react-grid-layout/react-grid-layout
 *
 * Props:
 *
 */
const PlotComponent = forwardRef(
  (
    {
      style,
      className,
      onRemoveBtnClicked,
      viewMode,
      plotMetaData,
      onFeatureSelected,
      selectedPlotFeature,
      theme,
      ...props
    },
    ref
  ) => {
    const [plotInfo, setPlotInfo] = useState({
      x: props.data.x,
      y: props.data.y,
      plotType: props.plotType,
    });
    const [plotTheme, setPlotTheme] = useState("");
    /*
    
    - forwardRef takes a component as an argument and it references it to a DOM Element
    - this is used to integrate the Plotly graph as a react grid layout grid item child
    - therefore we need to pass style, className, ref and the other props to the div with the plot ID
    @see section on custom components from  https://github.com/react-grid-layout/react-grid-layout 

    */
    useEffect(() => {
      const plotly = new PlotlyInterface(`plot-${props.plotID}`);
      let trace1 = plotly.createPlotData(
        plotInfo.x,
        plotInfo.y,
        plotInfo.plotType,
        "markers",
        "circle",
        false
      );
      if (plotTheme === "" || plotTheme === "default") {
        let _ = theme
          ? plotly.changeLayout("light ", "", "", "")
          : plotly.changeLayout("default", "", "", "");
      } else {
        plotly.changeLayout(plotTheme, "", "", "");
      }
      plotly.constructInitialPlot([trace1]);
    });

    const handleFeatureOptionSelection = (selection) => {
      if (selectedPlotFeature.name === "Select a File") {
        let selectedFile = selectedPlotFeature.metaData.filter(
          (file) => file.name === selection
        );
        setPlotInfo(
          selectedFile.map((file) => {
            return {
              x: file.data.x,
              y: file.data.y,
              plotType: plotInfo.plotType,
            };
          })[0]
        );
        console.log(
          selectedFile.map((file) => {
            return {
              x: file.data.x,
              y: file.data.y,
              plotType: plotInfo.plotType,
            };
          })[0]
        );
      } else if (selectedPlotFeature.name === "Select a Plot") {
        if (selection === "BarChart") {
          setPlotInfo({ x: plotInfo.x, y: plotInfo.y, plotType: "bar" });
        } else if (selection === "Pie Chart") {
          setPlotInfo({ x: plotInfo.x, y: plotInfo.y, plotType: "pie" });
        } else if (selection === "Heatmap") {
          setPlotInfo({ x: plotInfo.x, y: plotInfo.y, plotType: "heatmap" });
        } else if (selection === "3D Plot") {
          setPlotInfo({ x: plotInfo.x, y: plotInfo.y, plotType: "scatter3d" });
        } else {
          console.log(selection);
        }
      } else if (selectedPlotFeature.name === "Select a Theme") {
        setPlotTheme(selection);
      }
    };

    return (
      <div
        style={{ ...style }}
        className={className}
        ref={ref}
        id={`plot-${props.plotID}`}
        {...props}
      >
        {viewMode === "edit" ? (
          <React.Fragment>
            <PlotCommandLine
              plotMetaData={plotMetaData}
              onFeatureSelected={(selection) => onFeatureSelected(selection)}
              onDeleteBtnClicked={() => onRemoveBtnClicked(props.plotID)}
              selectedPlotFeature={selectedPlotFeature}
              onFeatureOptionSelected={(selection) =>
                handleFeatureOptionSelection(selection)
              }
            />
            {props.children[1]}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
);

export default PlotComponent;

//TODO: remove all this many props and make sure that there is no state for the components
