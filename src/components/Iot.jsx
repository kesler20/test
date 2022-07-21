import Plot from "react-plotly.js";
import React, { Component } from "react";
import { Button } from "@material-ui/core";

// client.onConnectionLost = function (responseObject) {
//   console.log("Connection Lost: " + responseObject.errorMessage);
// };

// const onConnect = () => {
//   console.log("Connected!");
//   client.subscribe("pump/pressure");
// };

// client.connect({
//   onSuccess: onConnect,
// });

// var data;

// const check = (client, t1a, y1a, t2a, y2a) => {
//   if (t1a > y1a + 20) {
//     x1 = -1;
//   } else if (t1a < y1a - 20) {
//     x1 = 1;
//   } else {
//     x1 = 0;
//   }

//   if (t2a > y2a + 5) {
//     x2 = -1;
//   } else if (t2a < y2a - 5) {
//     x2 = 1;
//   } else {
//     x2 = 0;
//   }

//   let payload = { control1: [x1], control2: [x2] };
//   if (!clicked) {
//     console.log('process control has being stopped')
//     payload = { control1: [0], control2: [0] };
//   }
//   let payloadText = JSON.stringify(payload);
//   let message = new Paho.MQTT.Message(payloadText);
//   message.destinationName = "pump/control";
//   message.retained = false;
//   message.qos = 0;
//   client.send(message);
// };

// client.onMessageArrived = (message) => {
//   info = JSON.parse(message.payloadString);
//   data = info;
//   check(
//     client,
//     info["trend_1"],
//     info["total_1"],
//     info["trend_2"],
//     info["total_2"]
//   );
//   console.log("Message Arrived: " + message.payloadString);
//   console.log("Topic:     " + message.destinationName);
//   console.log("QoS:       " + message.qos);
//   console.log("Retained:  " + message.retained);
//   // Read Only, set if message might be a duplicate sent from broker
//   console.log("Duplicate: " + message.duplicate);
// };

// const getData = () => {
//   try {
//     return [
//       data["trend_1"],
//       data["total_1"],
//       data["trend_2"],
//       data["total_2"],
//       data["x_value"],
//     ];
//   } catch (e) {
//     console.log(e);
//     return [0, 0, 0, 0];
//   }
// };

// let layout = {
//   title: "Random Number Streams",
//   yaxis: {
//     title : 'Value',
//     range: [900, 1150],
//     titlefont: {
//       family: 'Arial, sans-serif',
//       size: 18,
//       color: 'black'
//     },
//   },
//   xaxis: {
//     title : 'Random Number ID',
//     titlefont: {
//       family: 'Arial, sans-serif',
//       size: 18,
//       color: 'black'
//     },
//   },
// };

// let config = {
//   responsive: true,
//   editable: true,
// };

// let trend1 = {
//   x: [getData()[4]],
//   y: [getData()[0]],
//   mode: "lines",
//   name: "Trend 1",
//   line: {
//     color: "blue",
//     dash: "dot",
//   },
// };

// let total1 = {
//   x: [getData()[4]],
//   y: [getData()[1]],
//   mode: "lines",
//   name: "Channel 1",
//   line: {
//     color: "blue",
//     dash: "solid",
//     width: "5",
//   },
// };

// let trend2 = {
//   x: [getData()[4]],
//   y: [getData()[2]],
//   name: "Trend 2",
//   mode: "lines",
//   line: {
//     color: "red",
//     dash: "dot",
//   },
// };

// let total2 = {
//   x: [getData()[4]],
//   y: [getData()[3]],
//   mode: "lines",
//   name: "Channel 2",
//   line: {
//     color: "red",
//     dash: "solid",
//     width: "5",
//   },
// };

// let trend1UpperBoundary = {
//   x: [getData()[4]],
//   y: [getData()[0] + 20],
//   mode: "lines",
//   name: 'Trend 1 Upper Bound',
//   line: {
//     color: "rgb(55,128,191)",
//   },
// };

// let trend1LowerBoundary = {
//   x: [getData()[4]],
//   y: [getData()[0] - 20],
//   mode: "lines",
//   fill: "tonexty",
//   name: 'Trend 1 Lower Bound',
//   line: {
//     color: "rgb(55,128,191)",
//   },
// };
// let trend2UpperBoundary = {
//   x: [getData()[4]],
//   y: [getData()[2] + 5],
//   mode: "lines",
//   name: 'Trend 2 Upper Bound',
//   line: {
//     color: "rgb(254,92,92)",
//   },
// };

// let trend2LowerBoundary = {
//   x: [getData()[4]],
//   y: [getData()[2] - 5],
//   mode: "lines",
//   fill: "tonexty",
//   name: 'Trend 2 Lower Bound',
//   line: {
//     color: "rgb(254,92,92)",
//   },
// };

// let plotData = [
//   trend1,
//   total1,
//   trend2,
//   total2,
//   trend1UpperBoundary,
//   trend1LowerBoundary,
//   trend2UpperBoundary,
//   trend2LowerBoundary,
// ];

// console.log("plot data", plotData);

// Plotly.plot("plot", plotData, layout, config);

// var cnt = 0;

// setInterval(function () {
//   Plotly.extendTraces(
//     "plot",
//     {
//       y: [
//         [getData()[0]],
//         [getData()[1]],
//         [getData()[2]],
//         [getData()[3]],
//         [getData()[0] + 20],
//         [getData()[0] - 20],
//         [getData()[2] + 5],
//         [getData()[2] - 5],
//       ],
//       x: [
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//         [getData()[4]],
//       ],
//     },
//     [0, 1, 2, 3, 4, 5, 6, 7]
//   );
//   cnt++;

//   if (cnt > 5000) {
//     Plotly.relayout("plot", {
//       yaxis: {
//         range: [getData()[3], getData()[1]],
//       },
//       xaxis: {
//         range: [cnt - 500, cnt],
//       },
//     });
//   }
// }, 2000);


class Iot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        }
      ],
    };
  }

  changeData = () => {
    let data = this.state.data;
    data[0].x = data[0].x.map(item => item += 1);
    data[0].x.push(data[0].x[data[0].x.length - 1] + 1)
    data[0].y.push(4)
    console.log(data)
    this.setState({ data });
  }
  render() {
    return (
      <React.Fragment>
        <Plot
          data={this.state.data}
          layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
        />
        <Button color="primary" onClick={this.changeData}>Add 1</Button>
      </React.Fragment>
    );
  }
}

export default Iot;
