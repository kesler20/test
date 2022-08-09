import { range } from "../APIs/otherScripts";
import React, { Component } from "react";
import Channel from "./Channel";
import PlotlyInterface from "../APIs/PlotlyInterface";

// get only the last 30 data points from local storage
const getDataFromLocalStorage = (topic) => {
  let dataFromLocalStorage = JSON.parse(
    localStorage.getItem(`/${topic}/json-database`)
  );
  if (dataFromLocalStorage === null) {
    return [];
  }

  dataFromLocalStorage = range(dataFromLocalStorage, 30);
  return dataFromLocalStorage;
};

const constructChannelPlot = (
  data,
  boundValues,
  channelID,
  visibility,
  channelVisibility
) => {
  const total = [];
  const trend = [];
  const x_values = [];
  let upperBound = [];
  let lowerBound = [];

  data.forEach((val) => {
    total.push(val.total_1);
    trend.push(val.trend_1);
    upperBound.push(val.trend_1 + boundValues);
    lowerBound.push(val.trend_1 - boundValues);
    let x = val.x_value;
    x_values.push(x);
  });

  const total1 = {
    x: [...x_values],
    y: [...total],
    mode: "lines",
    name: "Channel 1",
    visible: channelVisibility,
    line: {
      color: "green",
      dash: "solid",
      width: "5",
    },
  };
  const trend1 = {
    x: [...x_values],
    y: [...trend],
    mode: "lines",
    visible: channelVisibility,
    name: "Trend 1",
    line: {
      color: "yellow",
      dash: "dot",
    },
  };
  const trend1Upper = {
    x: [...x_values],
    y: [...upperBound],
    mode: "lines",
    name: "Trend 1 Upper Bound",
    visible: visibility,
    showlegend: false,
    line: {
      color: "#79eec9",
    },
  };
  const trend1Lower = {
    x: [...x_values],
    y: [...lowerBound],
    mode: "lines",
    visible: visibility,
    showlegend: false,
    fill: "tonexty",
    name: "Trend 1 Lower Bound",
    line: {
      color: "#79eec9",
    },
  };
  return [total1, trend1, trend1Upper, trend1Lower];
};

const updateChannelPlot = (data, boundValue) => {
  const total = data[data.length - 1].total_1;
  const trend = data[data.length - 1].trend_1;
  let upperBound = data[data.length - 1].trend_1 + boundValue;
  let lowerBound = data[data.length - 1].trend_1 - boundValue;

  return {
    y: [[total], [trend], [upperBound], [lowerBound]],
    x: [
      [data[data.length - 1].x_value],
      [data[data.length - 1].x_value],
      [data[data.length - 1].x_value],
      [data[data.length - 1].x_value],
    ],
  };
};

class Iot extends Component {
  state = {
    plotlyInterface: new PlotlyInterface(
      "plot",
      "Random Number Streams",
      "Value",
      "Date Time"
    ),
    channels: [
      {
        channelID: 1,
        readTopic: "pump/pressure",
        writeTopic: "pump/control",
        controlled: true,
        errorBound: 5,
        smoothing: { value: 0, visible: false },
        online: true,
      },
    ],
    dataSet: getDataFromLocalStorage("pump/pressure"),
    cnt: 0,
    controlSeverity: 1,
  };

  componentDidMount() {
    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        5,
        1,
        this.state.channels[0].controlled,
        this.state.channels[0].online
      )
    );

    localStorage.setItem(
      `channel ${1} control state`,
      JSON.stringify({
        controlStatus: true,
        controlSeverity: this.state.controlSeverity,
        target: `${this.state.channels[0].errorBound}`,
      })
    );
  }

  handleChangeControl = (channelID) => {
    const channels = this.state.channels;
    const { controlled } = channels[channelID - 1];
    console.log("system changed to ", !controlled);
    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        this.state.channels[0].errorBound,
        channelID,
        !controlled,
        this.state.channels[0].online
      )
    );

    localStorage.setItem(
      `channel ${channelID} control state`,
      JSON.stringify({
        controlStatus: true,
        controlSeverity: this.state.controlSeverity,
        target: `${this.state.channels[0].errorBound}`,
      })
    );

    channels[channelID - 1].controlled = !controlled;
    this.setState({ channels });
  };

  changeControlSeverity = (val) => {
    localStorage.setItem(
      `channel 1 control state`,
      JSON.stringify({
        controlStatus: true,
        controlSeverity: val,
        target: `${this.state.channels[0].errorBound}`,
      })
    );

    this.setState({ controlSeverity: val });
  };

  handleChangeErrorBound = (e) => {
    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        parseInt(e.target.innerText),
        1,
        this.state.channels[0].controlled,
        this.state.channels[0].online
      )
    );

    let { channels } = this.state;
    channels[0].errorBound = parseInt(e.target.innerText);
    this.setState({ channels });

    localStorage.setItem(
      `channel 1 control state`,
      JSON.stringify({
        controlStatus: true,
        controlSeverity: this.state.controlSeverity,
        target: `${this.state.channels[0].errorBound}`,
      })
    );
  };

  handleRemoveChannel = (ID) => {
    this.handleChangeControl(ID);
    const { channels } = this.state;
    channels[0].online = !channels[0].online;
    this.setState({ channels });
    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        this.state.channels[0].errorBound,
        0,
        this.state.channels[0].controlled,
        this.state.channels[0].online
      )
    );
  };

  handleDatabaseUpdate = () => {
    this.setState({ dataSet: getDataFromLocalStorage("pump/pressure") });
    let extendedTraces = updateChannelPlot(
      this.state.dataSet,
      this.state.channels[0].errorBound
    );

    this.state.plotlyInterface.updateInitialPlot(
      extendedTraces.y,
      extendedTraces.x
    );

    // refresh the plot
    if (this.state.cnt >= 5) {
      const { controlled } = this.state.channels[0];
      this.state.plotlyInterface.constructInitialPlot(
        constructChannelPlot(
          this.state.dataSet,
          this.state.channels[0].errorBound,
          0,
          controlled,
          this.state.channels[0].online
        )
      );
      this.setState({ cnt: 0 });
    } else {
      let count = 1 + this.state.cnt;
      this.setState({ cnt: count });
    }
  };

  render() {
    return (
      <>
        <div id="plot"></div>
        <div style={{ display: "flex" }}>
          {this.state.channels.map((channel) => {
            return (
              <Channel
                key={channel.channelID}
                id={channel.channelID}
                readTopic={channel.readTopic}
                writeTopic={channel.writeTopic}
                onChangeControlled={(id) => this.handleChangeControl(id)}
                onUpdateDatabase={() => this.handleDatabaseUpdate()}
                onChangeErrorBound={(e) => this.handleChangeErrorBound(e)}
                handleControlSeverity={(v) => this.changeControlSeverity(v)}
                onViewOff={(id) => this.handleRemoveChannel(id)}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Iot;

//TODO: find a better way to get access of the data from the database which does not involve
// calling the read from the database function within each function
// this will be called N times where N is the number of channels
// find whether your default way of displaying the plot is good
// make sure that when a channel stops sending data that you can recreate a new plot from scratch
// if the plot has not being updated yet use the previous value as default
// store the previous value within the state of the channel
//TODO: make the constructCHannelPlot function moire channel agnostic
// TODO: make the update plot function channel agnostic
//TODO: give the user the capacity to decide the time to live of their data and when it needs to
// be backed up on AWS
// TODO: find a better way to convert the x values to time stamps
// TODO: might use continuous error bars instead of the upper and lower bound https://plotly.com/javascript/continuous-error-bars/
// TODO: remove all the inline stylings
