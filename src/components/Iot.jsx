import React, { useEffect, useState } from "react";
import Channel from "./Channel";
import PlotlyInterface from "../APIs/PlotlyInterface";

// TODO: check if getting data by topic is something that the database api can do
const getDataFromLocalStorage = (topic) => {
  let dataFromLocalStorage = JSON.parse(
    localStorage.getItem(`/${topic}/json-database`)
  );
  if (dataFromLocalStorage === null) {
    dataFromLocalStorage = [];
  }
  return dataFromLocalStorage;
};

// store abnd get the newe data from the iot
// construct the newDayta array from all the channels

// there should be onkly one plot and one source of updating it
// the channels will take care of passing the data to it

// TODO: change variables names to make it channel agnostic
const constructChannelPlot = (data, channelID) => {
  // include a filter for the data in order to select  the right channel
  // TODO: in the future try to broadcast only one data stream to only one channel

  const total_1 = [];
  const trend_1 = [];
  const x_values = [];

  data.forEach((val) => {
    total_1.push(val[`total_${channelID}`]);
    trend_1.push(val[`trend_${channelID}`]);
    x_values.push(val.x_value);
  });

  let color;
  let lineStyle;
  if (channelID === 1) {
    lineStyle = {
      color: "blue",
      dash: "solid",
      width: "5",
    };
    color = "rgb(55,128,191)";
  } else if (channelID === 2) {
    lineStyle = {
      color: "red",
      dash: "solid",
      width: "5",
    };
    color = "rgb(254,92,92)";
  } else {
    lineStyle = {
      dash: "solid",
      width: "5",
    };
    color = "rgb(254,92,92)";
  }

  let upperBound = [];
  trend_1.forEach((val) => {
    upperBound.push(val + 20);
  });

  let lowerBound = [];
  trend_1.forEach((val) => {
    upperBound.push(val - 20);
  });

  const total1 = {
    x: [...x_values],
    y: [...total_1],
    mode: "lines",
    name: "Channel 1",
    line: lineStyle,
  };
  const trend1 = {
    x: [...x_values],
    y: [...trend_1],
    mode: "lines",
    name: "Trend 1",
    line: lineStyle,
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
  return [total1, trend1, trend1Upper, trend1Lower];
};

const initialChannels = [
  {
    channelID: 1,
    channelTopic: "pump/pressure",
    controlled: true,
    smoothing: { value: 0, visible: false },
  },
  {
    channelID: 2,
    channelTopic: "pump/pressure",
    controlled: false,
    smoothing: { value: 0, visible: false },
  },
];

const plotly = new PlotlyInterface(
  "plot",
  "Random Number Streams",
  "Value",
  "Random Number ID"
);

const Iot = () => {
  const [plotlyInterface, setPlotlyInterface] = useState(plotly);

  const [channels, setChannels] = useState(initialChannels);
  const [newDataFromChannels, setNewDataFromChannels] = useState([[], []]);

  useEffect(() => {
    loadPlotData(getDataFromLocalStorage("pump/pressure"));
  }, [getDataFromLocalStorage]);

  const handleChangeControl = (channelID) => {
    let currentChannels = channels;
    let channelToUpdate = currentChannels[channelID];
    channelToUpdate.controlled = !channelToUpdate.controlled;
    currentChannels[channelID] = channelToUpdate;
    setChannels(currentChannels);
  };

  // this will be called N times where N is the number of channels
  // fill up the new data array with nans and the upper  and lower bounds
  const handleNewData = (newData, channelID) => {
    console.log(
      "-----------------------------------------------------------------------------------"
    );  
    // update the respective databases
    let data = [...newDataFromChannels, newData];
    let dataY = [];
    let dataX = [];
    data.forEach((val) => {
      dataY.push(val[`total_${channelID}`]);
      dataX.push(val[`trend_${channelID}`]);
    });
    setNewDataFromChannels([dataY], [dataX]);
    plotlyInterface.updateInitialPlot(...newDataFromChannels);
  };

  // this will be called N times where N is the number of channels
  const loadPlotData = (dataFromChannels) => {
    try {
      plotlyInterface.loadData(constructChannelPlot(dataFromChannels));
    } catch (e) {
      console.log(e);
      console.log(`the channel plot that was constructed ${dataFromChannels}`);
    }
  };

  return (
    <>
      <div id="plot"></div>
      {channels.map((channel) => {
        return (
          <Channel
            key={channel.channelID}
            id={channel.channelID}
            topic={channel.channelTopic}
            onChangeControlled={() => handleChangeControl(channel.channelID)}
            controlled={channel.controlled}
            onNewData={(newData, channelID) =>
              handleNewData(newData, channelID)
            }
          />
        );
      })}
    </>
  );
};

export default Iot;
