import { connect } from "mqtt";
var CryptoJS = require("crypto-js");

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

export default class MQTTApi {
  constructor() {
    this.clientId = Math.random()
      .toString(36)
      .substring(7);
    this.client = this.connectClient();
  }

  getEndpoint = () => {
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

  subscribeClient = (topic, callBack) => {
    this.client.subscribe(topic, (err) => {
      if (err) return;
      callBack();
    });
  };

  onConnect = (callBack) => {
    this.client.on("connect", () => {
      console.log("Connected!");
      callBack();
    });
  };

  connectClient = () => {
    return connect(this.getEndpoint(), this.clientId);
  };
}

// now channel 1 and two are both controlled 20
export const check = (client, t1a, y1a, controlStatus, topic, controlSeverity, target) => {
  
  let bound = parseInt(target)
  let x = controlSeverity;
  if (t1a > y1a + bound) {
    x = -controlSeverity;
  } else if (t1a < y1a - bound) {
    x = controlSeverity;
  } else {
    x = 0;
  }

  let payload = { control1: [x] };
  // avoid to use type coercion
  if (controlStatus === false) {
    console.log("process control has being stopped ❌");
    payload = { control1: [0]  };
  } else {
    console.log("process is being controlled ✅")
    console.log(payload)
  }
  let payloadText = JSON.stringify(payload);

  client.publish(topic, payloadText, { qos: 0 }, (error) => {
    if (error) {
      console.log("Publish error: ", error);
    } else {
    }
  });
};

