import React, { useEffect, useState } from "react";
import PlotlyInterface from "../APIs/PlotlyInterface";

let trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 11, 12, 13],
  mode: "markers",
  marker: {
    color: 'red',
    size: [40, 60, 80, 100],
  },
};

let data = [trace1];

const plotly = new PlotlyInterface("canvas", "this", "that", "values");

const Dashboard = () => {
  const [columns, setColumns] = useState({});
  const [fileData, setFileData] = useState({});

  useEffect(() => {
    getFileMetadata();
    plotly.constructInitialPlot(data);
  }, []);

  const getFileMetadata = () => {
    setColumns(
      Object.keys(JSON.parse(localStorage.getItem("userFiles"))[0].file_content)
    );
    setFileData(JSON.parse(localStorage.getItem('userFiles'))[0])
    console.log(columns[0])
  };

  return <div id="canvas"></div>;
};

export default Dashboard;
