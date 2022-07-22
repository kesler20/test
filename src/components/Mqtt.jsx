import React, { useState } from "react";
import getEndpoint, { mqttClient} from "../config";
import { useEffect } from "react";

const options = {
  // Clean session
  clean: true,
  connectTimeout: 4000,
  // Auth
  clientId: 'emqx_test',
  username: 'emqx_test',
  password: 'emqx_test',
}

const initialClient  = mqttClient.connect(getEndpoint(), options)

const MqttClient = () => {
  const [client, setClient] = useState(initialClient);
  const [payload, setPayload] = useState(null);
  const [connectStatus, setConnectStatus] = useState('');
  const [isSub, setIsSub] = useState(false);

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
        console.log(payload)
      });
    }
  }, [client]);

    // connect
  const mqttConnect = (host, mqttOption) => {
    setConnectStatus("Connecting");
    setClient(mqttClient.connect(host, mqttOption));
  };

  // subscribe
  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        setIsSub(true);
      });
    }
  };

  // disconnect 
  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setConnectStatus('Connect');
      });
    }
  }  

  // unsubscribe
  const mqttUnSub = (subscription) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        setIsSub(false);
      });
    }
  };

  // publish
  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  return <div></div>;
};

export default MqttClient;
