import React, { Component } from "react";
import MQTTApi, { check } from "../APIs/mqttProtocol";
import DatabaseApi from "../APIs/redisDatabase";
import { PrimaryBtn, Grid } from "../components/StyledElemnts";
import PlotlyInterface from "../APIs/PlotlyInterface";

let dataFromLocalStorage = JSON.parse(localStorage.getItem("json-database"));
if (dataFromLocalStorage === null) {
  dataFromLocalStorage = [];
}

class Iot extends Component {
  state = {
    mqttClient: new MQTTApi(),
    db: new DatabaseApi("json-database"),
    plotlyInterface: new PlotlyInterface(
      "plot",
      dataFromLocalStorage,
      "Random Number Streams",
      "Random Number Streams",
      "Random Number ID"
    ),
    // channel id corresponds to the id of the channel in the channels array
    channels: [
      { controlled: false, id: 0, smoothing: { value: 0, visibility: false } },
    ],
  };

  //TODO: improve this algorithm 
  toggleClicked = (channelID) => {
    if (!this.state.channels[channelID].controlled) {
      alert("Process is being controlled");
    } else {
      alert("process is NOT being controlled ");
    }
    const allChannels = this.state.channels
    const updatedChannel = channels[channelID]
    updatedChannel.controlled = !updatedChannel.controlled
    allChannels[channelID] = updatedChannel

    this.setState({ channels : allChannels });
  };

  componentDidMount() {
    this.state.mqttClient.onConnect(() => {
      this.state.mqttClient.subscribeClient("pump/pressure", () => {
        this.state.plotlyInterface.constructInitialPlot();
      });
    });

    this.state.mqttClient.client.on("message", (topic, message) => {
      try {
        let data = JSON.parse(message.toString());
        this.setState({ data });
        console.log(data);
        this.state.db.createResource(data);
      } catch (e) {
        console.log(e);
      }

      check(
        this.state.mqttClient.client,
        this.state.data.trend_1,
        this.state.data.total_1,
        this.state.data.trend_2,
        this.state.data.total_2,
        this.state.clicked
      );

      console.log("Message Arrived: " + message.toString());
      console.log("Topic:     " + topic);
      //this.state.db.viewDatabase().then((val) => console.log(val));

      let dataMatrix = [
        this.state.data.trend_1,
        this.state.data.total_1,
        this.state.data.trend_2,
        this.state.data.total_2,
        this.state.data.trend_1 + 20,
        this.state.data.trend_1 - 20,
        this.state.data.trend_2 + 5,
        this.state.data.trend_2 - 5,
      ];

      plotly.extendTraces(
        "plot",
        {
          y: [
            [this.state.data.trend_1],
            [this.state.data.total_1],
            [this.state.data.trend_2],
            [this.state.data.total_2],
            [this.state.data.trend_1 + 20],
            [this.state.data.trend_1 - 20],
            [this.state.data.trend_2 + 5],
            [this.state.data.trend_2 - 5],
          ],
          x: [
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
            [this.state.data.x_value],
          ],
        },
        [0, 1, 2, 3, 4, 5, 6, 7]
      );

      if (this.state.data) {
        console.log(
          `resizing ${[
            Math.min(...dataMatrix) - 50,
            Math.max(...dataMatrix) + 50,
          ]}`
        );
        plotly.relayout("plot", {
          yaxis: {
            range: [Math.min(...dataMatrix) - 50, Math.max(...dataMatrix) + 50],
          },
        });
      }
    });
  }
  render() {
    return (
      <>
        <div id="plot"></div>
        {this.state.channels.map((channel) => {
          <Grid>
            <PrimaryBtn onClick={this.selectSMA}>Calculate SMA</PrimaryBtn>
            <PrimaryBtn onClick={this.toggleClicked}>
              Control Process
            </PrimaryBtn>
          </Grid>;
        })}
      </>
    );
  }
}

export default Iot;
