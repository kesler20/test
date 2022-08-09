import React, { useState } from "react";
import { Slider, Switch, Paper } from "@material-ui/core";
import Knobs from "../pages/knob";
import { PrimaryBtn } from "./StyledElemnts";
const paperStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  width: "400px",
  height: "300px",
  marginTop: "10px",
  backgroundColor: "#1b2444",
};

const subPaperStyles = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  alignItems: "center",
};

const ChannelCommand = ({
  onKnobValueChange,
  onControlBtnClicked,
  onSliderChange,
  handlePowerBtnClicked
}) => {
  const [lastTrace, setLastTrace] = useState([0]);
  return (
    <Paper elevation={3} style={paperStyles}>
      <Paper
        style={{
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70%",
          backgroundColor: "#161d33",
        }}
      >
        <Knobs onValueChange={(value) => onKnobValueChange(value)} onPowerBtnClicked={handlePowerBtnClicked} />
      </Paper>
      <div style={subPaperStyles}>
        <Switch
          {...lastTrace}
          defaultChecked
          onClick={onControlBtnClicked}
          //   style={{ color: "#27bb27", backgroundColor: '#27bb27' }}
        />
        <Slider
          style={{ width: "20%", margin: "10px", color: "#27bb27" }}
          aria-label="Small steps"
          defaultValue={5}
          step={10}
          marks
          min={0}
          max={50}
          valueLabelDisplay="auto"
          onChange={(e) => onSliderChange(e)}
        />
        <PrimaryBtn
          style={{ width: "100px", height: "38px", borderRadius: "10px" }}
        >
          smoothing
        </PrimaryBtn>
      </div>
    </Paper>
  );
};

export default ChannelCommand;
