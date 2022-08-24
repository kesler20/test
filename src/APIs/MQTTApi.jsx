import { connect } from "mqtt";
let CryptoJS = require("crypto-js");

/**
 * This is the MQTT Api interface which implements the MQTT messaging protocol
 *
 * @param {*} clientID - this is a string which should be unique across different clients
 * the users of the web applications can be left to decide adequate naming conventions
 *
 * The MQTT protocol defines two types of network entities: a message broker and a number of clients.
 * An MQTT broker is a server that receives all messages from the clients
 * and then routes the messages to the appropriate destination clients.
 * An MQTT client is any device (from a micro controller up to a fully-fledged server)
 * that runs an MQTT library and connects to an MQTT broker over a network
 * MQTT clients should also provide:
 * 
 * | Type of message | Description |
 * | --------------- | ----------- |
 * | birth message | message sent on connection | 
 * | close or death message | message sent before disconnecting |
 * | last will of statement message | message sent on an unexpected disconnection |  
 * 
 * for a secure connection connect to ``port 8883`` using (SSL/TSL)
 * for non encrypted communication ``port: 1883`` can be used 
 * __NOTE the former will require password and username and certifications which matches the one in the server
 * messages can also be retained however the system needs to be coupled with more robust storage systems
 * 
 * @see https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html for more information
 *
 * __NOTE the implementation assumes that the data will be received from TLSv1.2 Mutual Authenticated clients__
 */
export default class MQTTApi {
  constructor(clientID) {
    this.clientId = clientID;
    this.client = this.connectClient();
  }
  /**
   * This function will run when the client is initially instantiated and will connect the client to the
   * broker via a secure connection
   *
   * @returns {*} returns an instance of an MQTT object
   */
  connectClient(){
    return connect(this.getEndpoint(), this.clientId);
  };

  /**
   * This function generates the endpoint to connection to AWS from the credentials provided
   *
   * @returns {*} the mqtt web socket endpoint used for streaming connection
   */
  getEndpoint(){
    const authUser = new UserDataEncriptor();

    // example: us-east-1
    const REGION = "eu-west-2";

    // example: blahblahblah-ats.iot.your-region.amazonaws.com
    const IOT_ENDPOINT = "a2gac7ap3hk6n-ats.iot.eu-west-2.amazonaws.com";

    // your AWS access key ID
    const KEY_ID = process.env.REACT_APP_ACCESS_KEY_ID;

    // your AWS secret access key
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

    // date & time
    const dt = new Date().toISOString().replace(/[^0-9]/g, "");
    const ymd = dt.slice(0, 8);
    const fdt = `${ymd}T${dt.slice(8, 14)}Z`;

    const scope = `${ymd}/${REGION}/iotdevicegateway/aws4_request`;
    const ks = encodeURIComponent(`${KEY_ID}/${scope}`);
    let qs = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${ks}&X-Amz-Date=${fdt}&X-Amz-SignedHeaders=host`;
    const req = `GET\n/mqtt\n${qs}\nhost:${IOT_ENDPOINT}\n\nhost\n${authUser.sha256(
      ""
    )}`;

    qs +=
      "&X-Amz-Signature=" +
      authUser.sign(
        authUser.getSignatureKey(SECRET_KEY, ymd, REGION, "iotdevicegateway"),
        `AWS4-HMAC-SHA256\n${fdt}\n${scope}\n${authUser.sha256(req)}`
      );
    return `wss://${IOT_ENDPOINT}/mqtt?${qs}`;
  };

  /**
   * this function subscribe the client to the provided topic,
   * the function should be called within the on connect callback and
   *
   * @param {*} topic - a topic is a channel where data can be streamed too and consumed by various clients
   * @param {*} callBack - a callback is a function which will be executed when the client subscribe
   */
  subscribeClient(topic, callBack){
    this.client.subscribe(topic, (err) => {
      if (err) return;
      callBack();
    });
  };

  /**
   * This function runs when the mqttClient is connected to the web socket which occurs when the class is instantiated
   * @see the connectClient() method
   * keep this function within a ``useEffect`` or a ``componentDidMount()`` to avoid connection timeout errors
   *
   * @param {*} callBack - a callback is a function which will be executed when the client connect
   * specify most of the logic of the client within this block
   */
  onConnect(callBack){
    this.client.on("connect", () => {
      console.log("Connected!");
      callBack();
    });
  };

  /**
   * This function runs the callback when a new message arrives, 
   * the message event listener of the MQTT object returns the topic and the message that are received automatically
   * however this is taken care of within the wrapper function therefore the callback should have:
   * 
   * ```javascript
   * const onMessageCallBack(message) {
   *   messageProcessingLogic()
   * }
   * ```
   * call this function wihtin the onConnect callback,
   * after the client is subscribed i.e.
   * 
   * ```javascript
   * onConnect(() => {
   *   onSubscribe()
   *   onMessage(onMessageCallback)
   *  }
   * )
   * ```
   *
   * @param {*} callBack - this is a function which is called when a new message arrives
   * to a topic which the client is listening too
   */
  onMessage(callBack){
    this.client.on("message", (topic, message) => {
      let decodedMessage = message.toString()
      console.log("message arrived",decodedMessage)
      callBack(decodedMessage);
    });
  };

  /**
   * This function publishes messages to the Broker <AWS>,the quality of service is kept as 0 to avoid timeouts
   *
   * @param {*} topic - the topic which the client will publish the message to
   * @param {*} payload - the payload that the client needs to publish
   */
  publishMessage(topic, payload){
    this.client.publish(topic, JSON.stringify(payload), { qos: 0 }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      } else {
      }
    });
  };
}

/**
 * This object can be used to encrypt messages by using private keys
 */
class UserDataEncriptor {
  sign = function(key, msg) {
    const hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
  };

  sha256 = function(msg) {
    const hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
  };
  getSignatureKey = function(key, dateStamp, regionName, serviceName) {
    const kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
  };
}

