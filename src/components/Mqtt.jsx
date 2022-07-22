import { PubSub, Auth, Amplify } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";
import { React, useEffect, useState } from "react";

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: process.env.REACT_APP_REGION,
    aws_pubsub_endpoint: `wss://${process.env.REACT_APP_IOT_ENDPOINT}/mqtt`,
  })
);


const MQTTClient = () => {
  const [sensorMsg, setSensorMsg] = useState([]);

  useEffect(() => {
    PubSub.publish('myTopic', { msg: 'Hello to all subscribers!' });

    PubSub.subscribe("myTopic").subscribe({
      next: (data) => {
        try {
          const sensorMsg = data.value;
          setSensorMsg(sensorMsg);
          console.log(sensorMsg);
        } catch (error) {
          console.log("Error, are you sending the correct data?");
        }
      },
      error: (error) => console.error(error),
      close: () => console.log("Done"),
    });
  }, []);

  return <div>MQTTClient</div>;
};

export default MQTTClient;
