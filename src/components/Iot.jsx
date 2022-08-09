import { Splide, SplideSlide } from "@splidejs/react-splide";
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

const initialClients = [
  {
    channelID: 0,
    readTopic: "pump/pressure",
    writeTopic: "pump/control",
    controlled: true,
    errorBound: 5,
    smoothing: { value: 0, visible: false },
    controlIntensity: 1,
    online: true,
  },
  {
    channelID: 1,
    readTopic: "pump/temperature",
    writeTopic: "heater/control",
    controlled: true,
    errorBound: 5,
    smoothing: { value: 0, visible: false },
    controlIntensity: 1,
    online: true,
  },
]
class Iot extends Component {
  state = {
    plotlyInterface: new PlotlyInterface(
      "plot",
      "Random Number Streams",
      "Value",
      "Date Time"
    ),
    channels: initialClients,
    dataSet: [],
    cnt: [], // array with the same length of the number of channels
  };

  componentDidMount() {
    let { dataSet } = this.state;
    let { cnt } = this.state;

    this.state.channels.forEach((channel) => {
      dataSet.push(getDataFromLocalStorage(channel.readTopic));

      this.state.plotlyInterface.constructInitialPlot(
        constructChannelPlot(
          getDataFromLocalStorage(channel.readTopic),
          channel.errorBound,
          channel.channelID,
          channel.controlled,
          channel.online
        )
      );

      localStorage.setItem(
        `channel ${channel.channelID} control state`,
        JSON.stringify({
          controlStatus: channel.controlled,
          controlIntensity: channel.controlIntensity,
          target: `${channel.errorBound}`,
        })
      );

      cnt.push(0);
    });
    this.setState({ cnt });
    this.setState({ dataSet });
  }

  handleChangeControl = (channelID) => {
    // update the state of the system
    const channels = this.state.channels;
    const { controlled } = channels[channelID];
    channels[channelID].controlled = !controlled;
    this.setState({ channels });
    console.log("system changed to ", !controlled);

    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        this.state.channels[channelID].errorBound,
        channelID,
        !controlled,
        this.state.channels[channelID].online
      )
    );

    localStorage.setItem(
      `channel ${channelID} control state`,
      JSON.stringify({
        controlStatus: !controlled,
        controlIntensity: this.state.channels[channelID].controlIntensity,
        target: `${this.state.channels[channelID].errorBound}`,
      })
    );
  };

  changeControlIntensity = (val, channelID) => {
    const { channels } = this.state;
    channels[channelID].controlIntensity = val;

    this.setState({ channels });

    localStorage.setItem(
      `channel ${channelID} control state`,
      JSON.stringify({
        controlStatus: this.state.channels[channelID].controlled,
        controlIntensity: this.state.channels[channelID].controlIntensity,
        target: `${this.state.channels[channelID].errorBound}`,
      })
    );
  };

  handleChangeErrorBound = (e, channelID) => {
    let { channels } = this.state;
    channels[channelID].errorBound = parseInt(e.target.innerText);
    this.setState({ channels });

    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        this.state.channels[channelID].errorBound,
        channelID,
        this.state.channels[0].controlled,
        this.state.channels[0].online
      )
    );

    localStorage.setItem(
      `channel ${channelID} control state`,
      JSON.stringify({
        controlStatus: this.state.channels[channelID].controlled,
        controlIntensity: this.state.channels[channelID].controlIntensity,
        target: `${this.state.channels[channelID].errorBound}`,
      })
    );
  };

  handleRemoveChannel = (channelID) => {
    this.handleChangeControl(channelID);
    const { channels } = this.state;
    channels[channelID].online = !channels[channelID].online;
    this.setState({ channels });

    this.state.plotlyInterface.constructInitialPlot(
      constructChannelPlot(
        this.state.dataSet,
        this.state.channels[channelID].errorBound,
        channelID,
        this.state.channels[channelID].controlled,
        this.state.channels[channelID].online
      )
    );
  };

  handleDatabaseUpdate = () => {
    this.setState({ dataSet: getDataFromLocalStorage("pump/pressure") });

    this.state.channels.forEach((channel) => {
      let extendedTraces = updateChannelPlot(
        this.state.dataSet,
        channel.errorBound
      );

      this.state.plotlyInterface.updateInitialPlot(
        extendedTraces.y,
        extendedTraces.x
      );

      // refresh the plot
      if (this.state.cnt >= 5) {
        const { controlled } = channel;
        this.state.plotlyInterface.constructInitialPlot(
          constructChannelPlot(
            this.state.dataSet,
            channel.errorBound,
            channel.channelID,
            controlled,
            channel.online
          )
        );
        let { cnt } = this.state;
        cnt[channel.channelID] = 0;
        this.setState({ cnt });
      } else {
        let { cnt } = this.state;
        cnt[channel.channelID]++;

        this.setState({ cnt });
      }
    });
  };

  render() {
    return (
      <>
        <div id="plot"></div>
        <Splide
          options={{
            perPage: 4,
            arrows: false,
            pagination: false,
            drag: "free",
            gap: "50px",
          }}
        >
          {this.state.channels.map((channel) => {
            return (
              <SplideSlide key={channel.channelID}>
                <Channel
                  key={channel.channelID}
                  id={channel.channelID}
                  readTopic={channel.readTopic}
                  writeTopic={channel.writeTopic}
                  onChangeControlled={(id) => this.handleChangeControl(id)}
                  onUpdateDatabase={() => this.handleDatabaseUpdate()}
                  onChangeErrorBound={(e, id) =>
                    this.handleChangeErrorBound(e, id)
                  }
                  handleControlIntensity={(v, id) =>
                    this.changeControlIntensity(v, id)
                  }
                  onViewOff={(id) => this.handleRemoveChannel(id)}
                />
              </SplideSlide>
            );
          })}
        </Splide>
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
//TODO: when the component mounts load all the channel info to storage so that it can also be read by the user account page
