import React from "react";
import CustomizedSlider from "./slider/Slider";
import SelectToolBar from "./select_tool_bar/SelectToolBar";

const PropertyTab = ({ property, containerWidth, containerHeight }) => {
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        maxHeight: "400px",
        minHeight: `180px`,
        height: `${parseFloat(containerHeight) - 180}px`,
      }}
    >
      <SelectToolBar containerWidth={containerWidth} />
      <CustomizedSlider name={`Filter ${property} above N`} containerWidth={containerWidth}/>
      <CustomizedSlider name={`Filter ${property} below N`} containerWidth={containerWidth}/>
    </div>
  );
};

export default PropertyTab;
