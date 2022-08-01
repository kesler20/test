import React, { Component } from "react";
import MQTTApi, { check } from "../mqttProtocol";
import DatabaseApi from "./redisDatabase";
import { PrimaryBtn } from "../components/StyledElemnts";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

const PrimaryBtnStyles = {
  margin: 25,
  width: 160,
  height: 60,
  fontSize: "1.2rem",
  borderRadius: 20,
};

const IncreaseBtnStyles = {
  margin: 25,
  width: 50,
  height: 50,
  borderRadius: "50%",
};

const plotly = window.Plotly;

const dataFromLocalStorage = JSON.parse(localStorage.getItem("json-database"));

let smaData = [];
let cleanSMA = [];
const uploadSMAData = async () => {
  let smaFromStorage = [];

  if (smaFromStorage.length > 0) return smaFromStorage;
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL_DEV}/jobs/SMA`,
    {
      headers: new Headers({
        "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
      }),
      method: "POST",
      body: JSON.stringify(dataFromLocalStorage),
    }
  );
  response.json().then((res) => {
    smaData.push(JSON.parse(res["job completed"]));
    for (let i = 0; i < 100; i++) {
      smaData[0][`SMA${i}`].x = [];
      smaData[0][`SMA${i}`].y = [];
      Object.keys(smaData[0][`SMA${i}`]).forEach((key) => {
        smaData[0][`SMA${i}`].x.push(key - 100);
        smaData[0][`SMA${i}`].y.push(smaData[0][`SMA${i}`][key]);
      });
      let val = {
        x: smaData[0][`SMA${i}`].x,
        y: smaData[0][`SMA${i}`].y,
        mode: "lines",
        name: `SMA${i}`,
        line: {
          dash: "dot",
        },
      };
      cleanSMA.push(val);
    }
  });
};

uploadSMAData();

const constructInitialPlot = (dataFromLocalStorage, sma, trend1Bound, trend2Bound) => {
  let x_values = [];
  let trends_1 = [];
  let totals_1 = [];
  let trends_2 = [];
  let totals_2 = [];
  let trend1Upper = [];
  let trend2Upper = [];
  let trend1Lower = [];
  let trend2Lower = [];

  const dataSet = [];

  for (let i = 1; i < 100; i++) {
    dataSet.push(dataFromLocalStorage[dataFromLocalStorage.length - i]);
  }

  dataSet.forEach((element) => {
    x_values.push(element.x_value);
    trends_1.push(element.trend_1);
    totals_1.push(element.total_1);
    trends_2.push(element.trend_2);
    totals_2.push(element.total_2);
    trend1Upper.push(element.trend_1 + 20);
    trend1Lower.push(element.trend_1 - 20);
    trend2Upper.push(element.trend_2 + 5);
    trend2Lower.push(element.trend_2 - 5);
  });

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

  let config = {
    responsive: true,
    editable: true,
  };

  const trend1 = {
    x: [...x_values],
    y: [...trends_1],
    mode: "lines",
    name: "Trend 1",
    line: {
      color: "blue",
      dash: "dot",
    },
  };

  const total1 = {
    x: [...x_values],
    y: [...totals_1],
    mode: "lines",
    name: "Channel 1",
    line: {
      color: "blue",
      dash: "solid",
      width: "5",
    },
  };

  const trend1UpperBoundary = {
    x: [...x_values],
    y: [...trend1Upper],
    mode: "lines",
    name: "Trend 1 Upper Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };

  const trend1LowerBoundary = {
    x: [...x_values],
    y: [...trend1Lower],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 1 Lower Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };

  const trend2 = {
    x: [...x_values],
    y: [...trends_2],
    name: "Trend 2",
    mode: "lines",
    line: {
      color: "red",
      dash: "dot",
    },
  };

  const total2 = {
    x: [...x_values],
    y: [...totals_2],
    mode: "lines",
    name: "Channel 2",
    line: {
      color: "red",
      dash: "solid",
      width: "5",
    },
  };

  const trend2UpperBoundary = {
    x: [...x_values],
    y: [...trend2Upper],
    mode: "lines",
    name: "Trend 2 Upper Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  const trend2LowerBoundary = {
    x: [...x_values],
    y: [...trend2Lower],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 2 Lower Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  const plotData = [
    trend1,
    total1,
    trend2,
    total2,
    trend1UpperBoundary,
    trend1LowerBoundary,
    trend2UpperBoundary,
    trend2LowerBoundary,
    cleanSMA[sma],
  ];
  console.log(cleanSMA);
  console.log(plotData);

  return [plotData, layout, config];
};

class Iot extends Component {
  state = {
    data: dataFromLocalStorage[dataFromLocalStorage.length - 1],
    mqttClient: new MQTTApi(),
    db: new DatabaseApi("json-database"),
    clicked: false,
    sma: 0,
  };

  toggleClicked = () => {
    if (!this.state.clicked) {
      alert("Process is being controlled");
    } else {
      alert("process is NOT being controlled ");
    }
    this.setState({ clicked: !this.state.clicked });
  };

  increaseSMA = () => {
    this.setState({ sma: this.state.sma + 1 });
    plotly.newPlot("plot", ...constructInitialPlot(dataFromLocalStorage, this.state.sma));
  };
  decreaseSMA = () => {
    this.setState({ sma: this.state.sma - 1 });
    plotly.newPlot("plot", ...constructInitialPlot(dataFromLocalStorage, this.state.sma));
  };

  componentDidMount() {
    this.state.mqttClient.onConnect(() => {
      this.state.mqttClient.subscribeClient("pump/pressure", () => {
        plotly.plot(
          "plot",
          ...constructInitialPlot(dataFromLocalStorage, this.state.sma)
        );
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
        <PrimaryBtn style={PrimaryBtnStyles} onClick={this.selectSMA}>
          Calculate SMA
        </PrimaryBtn>
        <PrimaryBtn style={PrimaryBtnStyles} onClick={this.toggleClicked}>
          Control Process
        </PrimaryBtn>
        <PrimaryBtn style={IncreaseBtnStyles} onClick={this.increaseSMA}>
          <AiFillCaretUp />
        </PrimaryBtn>
        <PrimaryBtn style={IncreaseBtnStyles}onClick={this.decreaseSMA}>
          <AiFillCaretDown />
        </PrimaryBtn>
      </>
    );
  }
}

export default Iot;
