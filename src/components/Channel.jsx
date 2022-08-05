import React, { useState, useEffect } from "react";
import MQTTApi, { check } from "../APIs/mqttProtocol";
import DatabaseApi from "../APIs/redisDatabase";
import { Switch, Slider } from "@material-ui/core";
import { convertUnixEpochTimeSToDate } from "../APIs/otherScripts";

const Channel = (props) => {
  const {
    id,
    readTopic,
    writeTopic,
    onUpdateDatabase,
    onChangeControlled,
    onChangeErrorBound
  } = props;

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
        let data = { x_value: [0], total_1: [0], trend_1: [0] };
        try {
          data = JSON.parse(message.toString());
          let { x_value } = data;
          const unix_x_value = convertUnixEpochTimeSToDate(x_value);
          data.x_value = unix_x_value;
          console.log("the following data will be stored", data);
          db.createResource(data);
          onUpdateDatabase();
        } catch (e) {
          console.log(e);
        }

        const { controlStatus, controlSeverity, target } = JSON.parse(
          localStorage.getItem(`channel ${id} control state`)
        );
        try {
          check(
            mqttClient.client,
            data.trend_1,
            data.total_1,
            controlStatus,
            writeTopic,
            controlSeverity,
            target
          );
        } catch (e) {
          console.log(e);
        }

        // console.log("Message Arrived: " + message.toString());
        // console.log("Topic:     " + topic);
      });
    }, []);
  });

  return (
    <div>
      <Switch
        {...lastTrace}
        defaultChecked
        onClick={() => onChangeControlled(id)}
      />
      <Slider
        style={{ width: "20%", margin: "10px" }}
        aria-label="Small steps"
        defaultValue={5}
        step={10}
        marks
        min={0}
        max={50}
        valueLabelDisplay="auto"
        onChange={(e) => onChangeErrorBound(e)}
      />
    </div>
  );
};

export default Channel;

// the channel should just display the commands which come with it which should control the state of the channel
// those commands will raise events which will be handled by the iot
