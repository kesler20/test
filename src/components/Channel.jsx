import React, { useState, useEffect } from "react";
import MQTTApi, { check } from "../APIs/mqttProtocol";
import DatabaseApi from "../APIs/redisDatabase";
import { Switch, Slider } from "@material-ui/core";

const Channel = ({
  id,
  controlled,
  readTopic,
  writeTopic,
  onUpdateDatabase,
  onChangeControlled
}) => {

  // Could all of these be props?
  const [mqttClient, setMqttClient] = useState(new MQTTApi());
  const [db, setDb] = useState(new DatabaseApi(`/${readTopic}/json-database`));
  const [lastTrace, setLastTrace] = useState([]);

  useEffect(() => {
    mqttClient.onConnect(() => {
      mqttClient.subscribeClient(`${readTopic}`, () => {
        console.log(`channel ${id} subscribed to topic : ${readTopic} 👂🎶...`);
        console.log(`channel ${id} and controls topic : ${writeTopic} 🖊️`);
      });
      mqttClient.client.on("message", (topic, message) => {
        let data = { x_values: [0], total_1: [0], trend_1: [0] };
        try {
          data = JSON.parse(message.toString());
          db.createResource(data);
          setLastTrace(data)
          onUpdateDatabase();
        } catch (e) {
          console.log(e);
        }

        check(
          mqttClient.client,
          data.trend_1,
          data.total_1,
          controlled,
          writeTopic
        );

        console.log("Message Arrived: " + message.toString());
        console.log("Topic:     " + topic);
      });
    }, []);
  });

  return (
    <div>
      <Switch {...controlled} defaultChecked onClick={() => onChangeControlled(id)} />
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
