let smaData = [];
let cleanSMA = [];

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
