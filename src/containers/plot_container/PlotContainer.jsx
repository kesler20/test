import { Splide, SplideSlide } from "@splidejs/react-splide";
import { range } from "../../modules/DataProcessing";
import React, { Component } from "react";
import Channel from "../Channel";
import PlotlyInterface from "../../APIs/PlotlyInterface";
import DatabaseApi from "../../APIs/DatabaseApi";
import {
  constructChannelPlot,
  updateChannelPlot,
} from "../../modules/DataProcessing";
import MQTTClient from "../../modules/MQTTClient";

/**
 * The plot container handles the mQTT messages which are processed by channels
 * channels are instances of MQTTClients
 * the cnt state is used to keep track of the number of data points displayed on the current plot
 * this needs to be refreshed to avoid cluttering the plot
 */
class PlotContainer extends Component {
  state = {
    plotlyInterface: new PlotlyInterface(
      "plot",
      "Random Number Streams",
      "Value",
      "Date Time"
    ),
    databaseApi: new DatabaseApi("userPlotContainerData"),
    /**
     * channels is an array of MQTTClients instances
     *  the read resource function returns clients from local storage if present otherwise return empty list, the clients are retrieved from the user account page
     */
    channels: new DatabaseApi("userPlotContainerData")
      .readResourceFromLocalStorage("client-info")
      .map((client) => {
        return new MQTTClient(
          client.channelID,
          client.readTopic,
          client.writeTopic,
          client.controlled,
          client.errorBound,
          client.smoothing,
          client.controlIntensity,
          client.online,
          client.clientID
        );
      }),
    dataSet: [], // array with the same lenght of the number of channels there should be a symmetry between channel id and index of global infos
    cnt: [], // array with the same length of the number of channels
  };

  componentDidMount = () => {
    console.log(this.state.channels)
    this.setupState();
  };

  setupState = () => {
    let dataSet = [];
    let { cnt } = this.state;
    let plotData = [];

    this.state.channels.forEach((channel) => {
      /**
       * save data from storage to dataset
       */
      let dataFromLocalStorage = range(
        this.state.databaseApi.readResourceFromLocalStorage(
          `/${channel.readTopic}/json-database`
        ),
        30
      );

      dataSet.push(dataFromLocalStorage);

      /**
       * construct plot Data
       */
      plotData.push(
        ...constructChannelPlot(
          dataFromLocalStorage,
          channel.errorBound,
          channel.channelID,
          channel.controlled,
          channel.online
        )
      );

      /**
       * keep track of count
       */
      cnt.push(0);
    });

    this.setState({ cnt });
    this.setState({ dataSet });
    this.state.plotlyInterface.constructInitialPlot(plotData);
  };

  updateChannelAndState = (
    channelID,
    channelProperty,
    channelPropertyValue,
    updatePlot
  ) => {
    const { channels } = this.state;
    channels[channelID][`${channelProperty}`] = channelPropertyValue;
    this.setState({ channels });

    if (updatePlot) {
      this.state.plotlyInterface.constructInitialPlot(
        constructChannelPlot(
          this.state.dataSet[channelID],
          this.state.channels[channelID].errorBound,
          channelID,
          this.state.channels[channelID].controlled,
          this.state.channels[channelID].online
        )
      );
    }

    this.state.channels[channelID].saveClient();
  };

  handleDatabaseUpdate = () => {
    // HANDLE DATASET
    let dataSet = [];
    this.state.channels.forEach((channel) => {
      dataSet.push(
        range(
          this.state.databaseApi.readResourceFromLocalStorage(
            `/${channel.readTopic}/json-database`
          ),
          30
        )
      );
    });
    this.setState({ dataSet });

    // HANDLE EXTENDED TRACE
    let extendedTraces = [];
    this.state.channels.forEach((channel) => {
      extendedTraces.push(
        updateChannelPlot(
          this.state.dataSet[channel.channelID],
          channel.errorBound,
          channel.channelID
        )
      );
    });

    let extendedTrace = { y: [], x: [] };
    extendedTraces.forEach((val) => {
      extendedTrace.y.push(...val.y);
      extendedTrace.x.push(...val.x);
    });
    console.log("this is the exteneded traces", extendedTrace);

    this.state.plotlyInterface.updateInitialPlot(
      extendedTrace.y,
      extendedTrace.x
    );

    // HANDLE REFRESH PLOT
    let refresh = false;
    let plotData = [];
    let { cnt } = this.state;
    this.state.channels.forEach((channel) => {
      if (this.state.cnt[channel.channelID] >= 5) {
        refresh = true;
        plotData.push(
          ...constructChannelPlot(
            this.state.dataSet[channel.channelID],
            channel.errorBound,
            channel.channelID,
            channel.controlled,
            channel.online
          )
        );
        cnt[channel.channelID] = 0;
      } else {
        cnt[channel.channelID]++;
      }
    });
    this.setState({ cnt });
    console.log(this.state.cnt);
    if (refresh === true) {
      this.state.plotlyInterface.constructInitialPlot(plotData);
    }
  };

  handleChangeControl = (channelID) => {
    /**
     * change the control status of the channel and remove boundaries
     */
    this.updateChannelAndState(
      channelID,
      "controlled",
      !this.state.channels[channelID].controlled,
      true
    );
  };

  changeControlIntensity = (val, channelID) => {
    /**
     * change the control intensity of the channel to the selected value
     */
    this.updateChannelAndState(channelID, "controlIntensity", val, false);
  };

  handleChangeErrorBound = (e, channelID) => {
    /**
     * update the error bounds property of the channel to the selected value
     */
    this.updateChannelAndState(
      channelID,
      "errorBound",
      e.target.innerText,
      true
    );
  };

  handleRemoveChannel = (channelID) => {
    // change visibility and control status
    const { channels } = this.state;
    channels[channelID].online = !channels[channelID].online;
    channels[channelID].controlled = !channels[channelID].controlled;
    this.setState({ channels });

    this.setupState();
  };

  render() {
    return (
      <>
        <div id="plot"></div>
        <Splide
          options={{
            perPage: 4,
            arrows: true,
            pagination: false,
            drag: "free",
            gap: "0rem",
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
                  controlStatus={channel.controlStatus}
                  controlIntensity={channel.controlIntensity}
                  target={channel.target}
                  onChangeControlled={(id) => this.handleChangeControl(id)}
                  onUpdateDatabase={() => this.handleDatabaseUpdate()}
                  onChangeErrorBound={(e, id) =>
                    this.handleChangeErrorBound(e, id)
                  }
                  handleControlIntensity={(v, id) =>
                    this.changeControlIntensity(v, id)
                  }
                  onViewOff={(id) => this.handleRemoveChannel(id)}
                  clientID={channel.clientID}
                />
              </SplideSlide>
            );
          })}
        </Splide>
      </>
    );
  }
}

export default PlotContainer;

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
//TODO: let dataParams = [`total_${channelID + 1}`, `trend_${channelID + 1}`]; CHANGE THIS LINE WHEN YOU WILL CHANGE THE BACKEND
// TODO: break the update database function into three smaller functions
