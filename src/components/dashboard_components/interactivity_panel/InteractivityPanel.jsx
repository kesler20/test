import React, { forwardRef, useEffect } from "react";
import "./InteractivityPanel.css";
import InteractiveToolsNav from "./interactive_tool_nav/InteractiveToolsNav";
import PropertyTab from "./property_tab/PropertyTab";

const properties = ["Weight", "height", "wealth"];

const InteractivityPanel = forwardRef(({ style, className, ...props }, ref) => {
  useEffect(() => {
    console.log(style.width);
  });
  return (
    <div
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={className}
      ref={ref}
      {...props}
    >
      <div
        className="user-interactivity-panel__container"
        style={{ overflow: "hidden" }}
      >
        <InteractiveToolsNav
          properties={properties.map((property) => {
            return (
              <PropertyTab
                property={property}
                containerHeight={style.height}
                containerWidth={style.width}
              />
            );
          })}
          propertyNames={properties}
        />
        {props.viewMode === "edit" ? props.children[1] : <React.Fragment />}
      </div>
    </div>
  );
});

export default InteractivityPanel;
