import React, { Component } from "react";
import MQTTApi, { check } from "../mqttProtocol";

const plotly = window.Plotly;

let layout = {
  title: "Random Number Streams",
  yaxis: {
    title: "Value",
    range: [900, 1150],
    titlefont: {
      family: "Arial, sans-serif",
      size: 18,
      color: "black",
    },
  },
  xaxis: {
    title: "Random Number ID",
    titlefont: {
      family: "Arial, sans-serif",
      size: 18,
      color: "black",
    },
  },
};

const getData = (data) => {
  try {
    return [
      data["trend_1"],
      data["total_1"],
      data["trend_2"],
      data["total_2"],
      data["x_value"],
    ];
  } catch (e) {
    console.log(e);
    return [0, 0, 0, 0];
  }
};

let config = {
  responsive: true,
  editable: true,
};

class Iot extends Component {
  state = {
    data: {
      trend_1: NaN,
      total_1: NaN,
      trend_2: NaN,
      total_2: NaN,
      x_value: NaN,
    },
    mqttClient: new MQTTApi(),
  };

  trend1 = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[0]],
    mode: "lines",
    name: "Trend 1",
    line: {
      color: "blue",
      dash: "dot",
    },
  };

  total1 = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[1]],
    mode: "lines",
    name: "Channel 1",
    line: {
      color: "blue",
      dash: "solid",
      width: "5",
    },
  };
  
  trend1UpperBoundary = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[0] + 20],
    mode: "lines",
    name: "Trend 1 Upper Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };
  trend1LowerBoundary = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[0] - 20],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 1 Lower Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };
  
  trend2 = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[2]],
    name: "Trend 2",
    mode: "lines",
    line: {
      color: "red",
      dash: "dot",
    },
  };

  total2 = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[3]],
    mode: "lines",
    name: "Channel 2",
    line: {
      color: "red",
      dash: "solid",
      width: "5",
    },
  };

  trend2UpperBoundary = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[2] + 5],
    mode: "lines",
    name: "Trend 2 Upper Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  trend2LowerBoundary = {
    x: [getData(this.state.data)[4]],
    y: [getData(this.state.data)[2] - 5],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 2 Lower Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  plotData = [
    this.trend1,
    this.total1,
    this.trend2,
    this.total2,
    this.trend1UpperBoundary,
    this.trend1LowerBoundary,
    this.trend2UpperBoundary,
    this.trend2LowerBoundary,
  ];

  componentDidMount() {
    this.state.mqttClient.onConnect(() => {
      this.state.mqttClient.subscribeClient("pump/pressure", () => {
        plotly.plot("plot", this.plotData, layout, config);
      });
    });

    this.state.mqttClient.client.on("message", (topic, message) => {
      try {
        let data = JSON.parse(message.toString());
        this.setState({ data });
      } catch (e) {
        console.log(e);
      }

      check(
        this.state.mqttClient.client,
        this.state.data["trend_1"],
        this.state.data["total_1"],
        this.state.data["trend_2"],
        this.state.data["total_2"]
      );

      console.log("Message Arrived: " + message.toString());
      console.log("Topic:     " + topic);

      let dataMatrix = [
        getData(this.state.data)[0],
        getData(this.state.data)[1],
        getData(this.state.data)[2],
        getData(this.state.data)[3],
        getData(this.state.data)[0] + 20,
        getData(this.state.data)[0] - 20,
        getData(this.state.data)[2] + 5,
        getData(this.state.data)[2] - 5,
      ];

      plotly.extendTraces(
        "plot",
        {
          y: [
            [getData(this.state.data)[0]],
            [getData(this.state.data)[1]],
            [getData(this.state.data)[2]],
            [getData(this.state.data)[3]],
            [getData(this.state.data)[0] + 20],
            [getData(this.state.data)[0] - 20],
            [getData(this.state.data)[2] + 5],
            [getData(this.state.data)[2] - 5],
          ],
          x: [
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
            [getData(this.state.data)[4]],
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
    return <div id="plot"></div>;
  }
}

export default Iot;
