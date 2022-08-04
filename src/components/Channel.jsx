import React, { Component, useState } from "react";
import MQTTApi, { check } from "../APIs/mqttProtocol";
import DatabaseApi from "../APIs/redisDatabase";
import { Switch, Slider } from "@material-ui/core";
import PlotlyInterface from "../APIs/PlotlyInterface";

const getDataFromLocalStorage = (topic) => {
  let dataFromLocalStorage = JSON.parse(
    localStorage.getItem(`/${topic}/json-database`)
  );
  if (dataFromLocalStorage === null) {
    dataFromLocalStorage = [];
  }
  return dataFromLocalStorage;
};

// change variables names to make it channel agnostic
const constructChannelPlot = (total_1, trend_1, x_values, channelID) => {
  
  // include a filter for the data in order to select  the right channel
  // in the future try to broadcast only one data stream to only one channel
  let color;
  if (channelID === 1) {
    lineStyle = {
      color: "blue",
      dash: "solid",
      width: "5",    
    }
    color = "rgb(55,128,191)"
  } else if (channelID === 2) {
    lineStyle = {
      color: "red",
      dash: "solid",
      width: "5",    
    }
    color = "rgb(254,92,92)"
  } else {
    lineStyle = {
      dash: "solid",
      width: "5",    
    }
    color = "rgb(254,92,92)"
  }

  let upperBound = []
  trend_1.forEach(val => {
    upperBound.push(val + 20)
  })

  let lowerBound = []
  trend_1.forEach(val => {
    upperBound.push(val - 20)
  })

  const total1 = {
    x: [...x_values],
    y: [...total_1],
    mode: "lines",
    name: "Channel 1",
    line: lineStyle
  };
  const trend1 = {
    x: [...x_values],
    y: [...trend_1],
    mode: "lines",
    name: "Trend 1",
    line: lineStyle
  };
  const trend1Upper = {
    x: [...x_values],
    y: [...upperBound],
    mode: "lines",
    name: "Trend 1 Upper Bound",
    line: {
      color: color,
    },
  };
  const trend1Lower = {
    x: [...x_values],
    y: [...lowerBound],
    mode: "lines",
    fill: "tonexty",
    name: "Trend 1 Lower Bound",
    line: {
      color: color,
    },
  };
  return [total1, trend1, trend1Upper, trend1Lower]
}

const Channel = ({ id, controlled }) => {
  const [topic, setTopic] = useState(initialState);
  const [mqttClient, setMqttClient] = useState(new MQTTApi());
  const [db, setDb] = useState(new DatabaseApi(`/${topic}/json-database`));
  const [plotlyInterface, setPlotlyInterface] = useState(
    new PlotlyInterface(
      "plot",
      constructChannelPlot(getDataFromLocalStorage(topic)),
      "Random Number Streams",
      "Random Number Streams",
      "Random Number ID"
    )
  );

  useEffect(() => {
    mqttClient.onConnect(() => {
      mqttClient.subscribeClient(`${topic}`, () => {
        plotlyInterface.constructInitialPlot();
      });
      mqttClient.client.on("message", (topic, message) => {
        try {
          let data = JSON.parse(message.toString());
          console.log(data);
          db.createResource(data, topic);
        } catch (e) {
          console.log(e);
        }

        check(
          mqttClient.client,
          data.trend_1,
          data.total_1,
          data.trend_2,
          data.total_2,
          controlled,
          topic
        );

        console.log("Message Arrived: " + message.toString());
        console.log("Topic:     " + topic);

        plotlyInterface.updateInitialPlot(data);
      });
    }, []);
  });

  return (
    <div>
      <Switch
        {...controlled}
        defaultChecked
        onClick={changeControlled}
      />
      <Slider
        style={{ width: "30%", margin: "10px" }}
        aria-label="Small steps"
        defaultValue={20}
        step={10}
        marks
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
    </div>
  );
};

export default Channel;

// the channel should just display the commands which come with it which should control the state of the channel
// those commands will raise events which will be handled by the iot
