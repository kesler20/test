import client, { check } from "./mqttProtocol";

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