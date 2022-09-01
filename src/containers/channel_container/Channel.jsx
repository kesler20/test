import React, { useState, useEffect } from "react";
import MQTTApi from "../../APIs/MQTTApi";
import Controller from "../../modules/Controller";
import DatabaseApi from "../../APIs/DatabaseApi";
import ChannelCommand from "../../components/channel_command_interface/ChannelCommand";
import { convertEpochTimeToLocalTime, convertUnixEpochTimeSToDate } from "../../modules/DataProcessing";

const Channel = (props) => {
  const {
    id,
    readTopic,
    writeTopic,
    controlStatus,
    controlIntensity,
    target,
    onUpdateDatabase,
    onChangeControlled,
    onChangeErrorBound,
    handleControlIntensity,
    onViewOff,
    clientID,
  } = props;

  const [mqttClient, setMqttClient] = useState(new MQTTApi(clientID));
  const [controller, setController] = useState(
    new Controller(mqttClient.client)
  );
  const [db, setDb] = useState(new DatabaseApi(`userIoTData`));

  const onMessageCallback = (message) => {
    console.log("this is also called ")
    let data = { x_value: [0], total_1: [0], trend_1: [0] };
    try {
      data = JSON.parse(message);
      data.x_value = convertEpochTimeToLocalTime(data.x_value)
      console.log("the following data will be stored", data);
      db.saveResourceToLocalStorage(`/${readTopic}/json-database`,data);
      onUpdateDatabase();
    } catch (e) {
      console.log(e);
    }

    try {
      controller.check(
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
  };

  useEffect(() => {
    mqttClient.onConnect(() => {
      mqttClient.subscribeClient(`${readTopic}`, () => {
        console.log(`channel ${id} subscribed to topic : ${readTopic} 👂🎶...`);
        console.log(`channel ${id} and controls topic : ${writeTopic} 🖊️`);
      });
      mqttClient.onMessage(onMessageCallback);
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
