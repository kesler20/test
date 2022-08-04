import React, { useState, useEffect } from "react";
import MQTTApi, { check } from "../APIs/mqttProtocol";
import DatabaseApi from "../APIs/redisDatabase";
import { Switch, Slider } from "@material-ui/core";



const Channel = ({ id, controlled, topic, onChangeControlled, onNewData }) => {

  // Could all of these be props?
  const [mqttClient, setMqttClient] = useState(new MQTTApi());
  const [db, setDb] = useState(new DatabaseApi(`/${topic}/json-database`));

  useEffect(() => {
    mqttClient.onConnect(() => {
      mqttClient.subscribeClient(`${topic}`, () => {
        console.log(`channel ${id} subscribed to topic : ${topic}`)
      });
      mqttClient.client.on("message", (topic, message) => {
        let data = { x_values : [NaN], total_1 : [NaN], trend_1 : [NaN]}
        try {
          data = JSON.parse(message.toString());
          console.log(data);
          db.createResource(data);
        } catch (e) {
          console.log(e);
        }

        onNewData(data, id)

        check(
          mqttClient.client,
          data.trend_1,
          data.total_1,
          controlled,
          "pump/control"
        );

        console.log("Message Arrived: " + message.toString());
        console.log("Topic:     " + topic);

      });
    }, []);
  });

  //TODO: replace the x values toi remove weird rendering 
  return (
    <div>
      <Switch
        {...controlled}
        defaultChecked
        onClick={onChangeControlled}
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
