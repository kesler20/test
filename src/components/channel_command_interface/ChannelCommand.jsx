import React from "react";
import { Slider, Switch, Paper } from "@material-ui/core";
import Knobs from "./knob/knob";
import "./ChannelCommand.css";

const ChannelCommand = ({
  onKnobValueChange,
  onControlBtnClicked,
  onSliderChange,
  handlePowerBtnClicked,
  channelName,
}) => {
  return (
    <Paper elevation={3} id="channel-command__outer">
      <p className="channel-command__name">{channelName}</p>
      <Paper className="channel-command__inner">
        <Knobs
          onValueChange={(value) => onKnobValueChange(value)}
          onPowerBtnClicked={handlePowerBtnClicked}
        />
      </Paper>
      <div className="channel-command__inner__controls">
        <Switch defaultChecked onClick={onControlBtnClicked} />
        <Slider
          className="channel-command__slider"
          aria-label="Small steps"
          defaultValue={5}
          step={10}
          marks
          min={0}
          max={50}
          valueLabelDisplay="auto"
          onChange={(e) => onSliderChange(e)}
        />
        <div className="channel-command__btn">smoothing</div>
      </div>
    </Paper>
  );
};

export default ChannelCommand;
