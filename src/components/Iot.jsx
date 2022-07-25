import React from "react";
import { Button } from "@material-ui/core";
import client, { check } from "./mqttProtocol";
import { useEffect, useState } from "react";

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

const initialisePlotData = (data) => {
  let trend1 = {
    x: [0],
    y: [getData(data)[0]],
    mode: "lines",
    name: "Trend 1",
    line: {
      color: "blue",
      dash: "dot",
    },
  };

  let total1 = {
    x: [0],
    y: [getData(data)[1]],
    mode: "lines",
    name: "Channel 1",
    line: {
      color: "blue",
      dash: "solid",
      width: "5",
    },
  };

  let trend2 = {
    x: [0],
    y: [getData(data)[2]],
    name: "Trend 2",
    mode: "lines",
    line: {
      color: "red",
      dash: "dot",
    },
  };

  let total2 = {
    x: [0],
    y: [getData(data)[3]],
    mode: "lines",
    name: "Channel 2",
    line: {
      color: "red",
      dash: "solid",
      width: "5",
    },
  };

  let trend1UpperBoundary = {
    x: [0],
    y: [getData(data)[0] + 20],
    mode: "lines",
    name: "Trend 1 Upper Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };

  let trend1LowerBoundary = {
    x: [0],
    y: [getData(data)[0] - 20],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 1 Lower Bound",
    line: {
      color: "rgb(55,128,191)",
    },
  };
  let trend2UpperBoundary = {
    x: [0],
    y: [getData(data)[2] + 5],
    mode: "lines",
    name: "Trend 2 Upper Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  let trend2LowerBoundary = {
    x: [0],
    y: [getData(data)[2] - 5],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 2 Lower Bound",
    line: {
      color: "rgb(254,92,92)",
    },
  };

  return [
    trend1,
    total1,
    trend2,
    total2,
    trend1UpperBoundary,
    trend1LowerBoundary,
    trend2UpperBoundary,
    trend2LowerBoundary,
  ];
};

const initialData = {
  x_value: 2,
  total_1: 1001.0,
  total_2: 1079.3520691329636,
  trend_1: 1000.0,
  trend_2: 1079.8000000000002,
};

const Iot = () => {
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState(initialisePlotData(initialData));

  useEffect(() => {
    let cnt = 0;
    plotly.plot("plot", data, layout, config);

    client.on("connect", () => {
      console.log("Connected!");
      client.subscribe("pump/pressure", (err) => {
        if (!err) {
          console.log(
            "Subscribed to pump/pressure listening to upcoming messages..."
          );
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log("Message Arrived: " + message.toString());
      console.log("Topic:     " + topic);
      console.log("QoS:       " + message.qos);
      console.log("Retained:  " + message.retained);
      // Read Only, set if message might be a duplicate sent from broker
      console.log("Duplicate: " + message.duplicate);

      let info = JSON.parse(message.toString());
      setData(initialisePlotData(info));

      check(
        client,
        info["trend_1"],
        info["total_1"],
        info["trend_2"],
        info["total_2"],
        clicked
      );

      plotly.extendTraces(
        "plot",
        {
          y: [
            [getData(data)[0]],
            [getData(data)[1]],
            [getData(data)[2]],
            [getData(data)[3]],
            [getData(data)[0] + 20],
            [getData(data)[0] - 20],
            [getData(data)[2] + 5],
            [getData(data)[2] - 5],
          ],
          x: [
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
            [getData(data)[4]],
          ],
        },
        [0, 1, 2, 3, 4, 5, 6, 7]
      );
      cnt++;

      if (cnt > 5000) {
        plotly.relayout("plot", {
          yaxis: {
            range: [getData(data)[3], getData(data)[1]],
          },
          xaxis: {
            range: [cnt - 500, cnt],
          },
        });
      }
    });
  }, []);

  const toggleClicked = () => {
    let newClicked = !clicked;
    setClicked(newClicked);
  };
  return (
    <React.Fragment>
      <div id="plot"></div>
      <Button color="primary" onClick={toggleClicked}>
        Add 1
      </Button>
    </React.Fragment>
  );
};

export default Iot;
