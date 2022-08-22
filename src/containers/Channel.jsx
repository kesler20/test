import React, { useState, useEffect } from "react";
import MQTTApi, { check } from "../APIs/MQTTApi";
import DatabaseApi from "../APIs/DatabaseApi";
import ChannelCommand from "../components/channel_command_interface/ChannelCommand";

const Channel = (props) => {
  const {
    id,
    readTopic,
    writeTopic,
    onUpdateDatabase,
    onChangeControlled,
    onChangeErrorBound,
    handleControlIntensity,
    onViewOff,
    clientID
  } = props;

  const [mqttClient, setMqttClient] = useState(new MQTTApi(clientID));
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
          console.log("the following data will be stored", data);
          db.createResource(data);
          onUpdateDatabase();
        } catch (e) {
          console.log(e);
        }

        const { controlStatus, controlIntensity, target } = JSON.parse(
          localStorage.getItem(`channel ${id} control state`)
        );
        try {
          check(
            mqttClient.client,
            data.trend_1,
            data.total_1,
            controlStatus,
            writeTopic,
            controlIntensity,
            target
          );
        } catch (e) {
          console.log(e);
        }

      });
    }, []);
  });

  return (
    <div>
      <ChannelCommand
        onKnobValueChange={(value) => handleControlIntensity(value, id)}
        onControlBtnClicked={() => onChangeControlled(id)}
        onSliderChange={(e) => onChangeErrorBound(e, id)}
        handlePowerBtnClicked={() => onViewOff(id)}
        channelName={clientID}
      />
    </div>
  );
};

export default Channel;

// the channel should just display the commands which come with it which should control the state of the channel
// those commands will raise events which will be handled by the iot
