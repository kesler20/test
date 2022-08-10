import { useState } from "react";
import React from "react";
import { Knob, Pointer, Value, Arc } from "rc-knob";
import "./knob.css";

const Knobs = ({ onValueChange, onPowerBtnClicked }) => {
  const [powerOn, setPowerOn] = useState(true);
  const handlePowerBtn = (e) => {
    e.target.classList.toggle("power-off", powerOn);
    setPowerOn(!powerOn);
    onPowerBtnClicked();
  };
  return (
    <div className="outer">
      <div className="inner">
        <div className="circular-dot" style={{ "--i": 1 }}></div>
        <div className="circular-dot" style={{ "--i": 2 }}></div>
        <div className="circular-dot" style={{ "--i": 3 }}></div>
        <div className="circular-dot" style={{ "--i": 4 }}></div>
        <div className="circular-dot" style={{ "--i": 5 }}></div>
        <div className="circular-dot" style={{ "--i": 6 }}></div>
        <div id="powerBtn" onClick={handlePowerBtn}>
          <i className="fa fa-power-off"></i>
        </div>
        <Knob
          className="knob"
          size={100}
          angleOffset={220}
          angleRange={280}
          min={1}
          max={5}
          onChange={(value) => onValueChange(value)}
        >
          <Arc arcWidth={7} color="#FC5A96" radius={47.5} />
          <Pointer width={4} radius={40} type="circle" color="#ffff" />
          <Value marginBottom={40} className="value" />
        </Knob>
      </div>
    </div>
  );
};

export default Knobs;
