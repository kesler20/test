/**
 * interface for the files resources
 * a resource can be a JSON object taken from a pandas data frame, can be a file from a form data body
 */
export default class Resource {
  constructor() {
    this.filename = null;
    this.fileType = "application/json";
    this.file = new File([""], this.filename, { type: this.fileType });
    this.formData = new FormData();
  }

  addFileToFormData(fileCategory, file) {
    this.formData.append(fileCategory, file);
  }
}

// const uploadSMAData = async () => {
//   let smaFromStorage = [];

//   if (smaFromStorage.length > 0) return smaFromStorage;
//   const response = await fetch(
//     `${process.env.REACT_APP_BACKEND_URL_DEV}/jobs/SMA`,
//     {
//       headers: new Headers({
//         "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
//       }),
//       method: "POST",
//       body: JSON.stringify(dataFromLocalStorage),
//     }
//   );
//   response.json().then((res) => {
//     smaData.push(JSON.parse(res["job completed"]));
//     for (let i = 0; i < 100; i++) {
//       smaData[0][`SMA${i}`].x = [];
//       smaData[0][`SMA${i}`].y = [];
//       Object.keys(smaData[0][`SMA${i}`]).forEach((key) => {
//         smaData[0][`SMA${i}`].x.push(key - 20);
//         smaData[0][`SMA${i}`].y.push(smaData[0][`SMA${i}`][key]);
//       });
//       let val = {
//         x: smaData[0][`SMA${i}`].x,
//         y: smaData[0][`SMA${i}`].y,
//         mode: "lines",
//         name: `SMA${i}`,
//         line: {
//           dash: "dot",
//         },
//       };
//       cleanSMA.push(val);
//     }
//   });
// };

// increaseSMA = () => {
//   this.setState({ sma: this.state.sma + 1 });
//   plotly.newPlot("plot", ...constructInitialPlot(dataFromLocalStorage, this.state.sma));
// };
// decreaseSMA = () => {
//   this.setState({ sma: this.state.sma - 1 });
//   plotly.newPlot("plot", ...constructInitialPlot(dataFromLocalStorage, this.state.sma));
// };

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export const convertUnixEpochTimeSToDate = (unixEpochTimeS) => {
  const unixEpochTimeMS = unixEpochTimeS * 1000;
  const d = new Date(unixEpochTimeMS);
  let h = addZero(d.getHours());
  let m = addZero(d.getMinutes());
  let s = addZero(d.getSeconds());
  let time = h + ":" + m + ":" + s;
  return time;
};

export const convertEpochTimeToLocalTime = (unixEpochTimeS) => {
  return new Date(unixEpochTimeS * 1000);
};
export const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

export const getRandomColor = () => {
  const r = getRandomNumber(250);
  const g = getRandomNumber(250);
  const b = getRandomNumber(250);

  return `rgb(${r}, ${g}, ${b})`;
};

export const range = (collection, numberOfDataPoints) => {
  const reducedCollection = [];
  for (let i = 1; i < collection.length; i++) {
    if (i < numberOfDataPoints) {
      try {
        reducedCollection.push(collection.pop());
      } catch (e) {
        console.log(e);
      }
    }
  }

  reducedCollection.reverse();
  return reducedCollection;
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}

export const rows = [
  createData("Cupcake", 305, 3.7),
  createData("Donut", 452, 25.0),
  createData("Eclair", 262, 16.0),
  createData("Frozen yoghurt", 159, 6.0),
  createData("Gingerbread", 356, 16.0),
  createData("Honeycomb", 408, 3.2),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Jelly Bean", 375, 0.0),
  createData("KitKat", 518, 26.0),
  createData("Lollipop", 392, 0.2),
  createData("Marshmallow", 318, 0),
  createData("Nougat", 360, 19.0),
  createData("Oreo", 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

// this pure function returns 3 colors given the channelID
// returns -> total color , trend color, boundary color
export const plotColorPalette = (channelID) => {
  if (channelID === 0) return ["green", "yellow", "#79eec9"];
  if (channelID === 1) return ["rgb(255, 0, 76)", "white", "#f6aac6"];
  if (channelID === 2) return ["green", "yellow", "#79eec9"];
  return ["green", "yellow", "#79eec9"];
};

export const constructChannelPlot = (
  data,
  boundValues,
  channelID,
  visibility,
  channelVisibility
) => {
  let dataParams = [`total_${channelID + 1}`, `trend_${channelID + 1}`];

  if (data.length === 0) return [];
  if (data[data.length - 1][dataParams[0]] === undefined) return [];

  const total = [];
  const trend = [];
  const x_values = [];
  let upperBound = [];
  let lowerBound = [];

  data.forEach((val) => {
    total.push(val[dataParams[0]]);
    trend.push(val[dataParams[1]]);
    upperBound.push(val[dataParams[1]] + boundValues);
    lowerBound.push(val[dataParams[1]] - boundValues);
    x_values.push(val.x_value);
  });

  const total1 = {
    x: [...x_values],
    y: [...total],
    mode: "lines",
    name: `Channel ${channelID}`,
    visible: channelVisibility,
    line: {
      color: plotColorPalette(channelID)[0],
      dash: "solid",
      width: "5",
    },
  };
  const trend1 = {
    x: [...x_values],
    y: [...trend],
    mode: "lines",
    visible: channelVisibility,
    name: `Trend ${channelID}`,
    line: {
      color: plotColorPalette(channelID)[1],
      dash: "dot",
    },
  };
  const trend1Upper = {
    x: [...x_values],
    y: [...upperBound],
    mode: "lines",
    name: `Trend ${channelID} Upper Bound`,
    visible: visibility,
    showlegend: false,
    line: {
      color: plotColorPalette(channelID)[2],
    },
  };
  const trend1Lower = {
    x: [...x_values],
    y: [...lowerBound],
    mode: "lines",
    visible: visibility,
    showlegend: false,
    fill: "tonexty",
    name: `Trend ${channelID} Lower Bound`,
    line: {
      color: plotColorPalette(channelID)[2],
    },
  };
  return [total1, trend1, trend1Upper, trend1Lower];
};

export const updateChannelPlot = (data, boundValue, channelID) => {
  let y = [];
  let x = [];
  let dataParams = [`total_${channelID + 1}`, `trend_${channelID + 1}`];

  if (data[data.length - 1] === undefined) return { y: [], x: [] };
  if (data[data.length - 1][dataParams[0]] === undefined)
    return { y: [], x: [] };

  y.push([data[data.length - 1][dataParams[0]]]);
  y.push([data[data.length - 1][dataParams[1]]]);
  y.push([data[data.length - 1][dataParams[1]] + boundValue]);
  y.push([data[data.length - 1][dataParams[1]] - boundValue]);
  // x array must be of the same length of the y array
  y.forEach((val) => {
    x.push([data[data.length - 1].x_value]);
  });

  return {
    y: y,
    x: x,
  };
};
