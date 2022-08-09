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
        <li style={{ "--i": 1 }}></li>
        <li style={{ "--i": 2 }}></li>
        <li style={{ "--i": 3 }}></li>
        <li style={{ "--i": 4 }}></li>
        <li style={{ "--i": 5 }}></li>
        <li style={{ "--i": 6 }}></li>
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
