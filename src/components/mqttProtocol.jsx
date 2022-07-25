import { connect, Message } from "mqtt";

var CryptoJS = require("crypto-js");

class P4 {
  sign = function (key, msg) {
    const hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
  };

  sha256 = function (msg) {
    const hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
  };
  getSignatureKey = function (key, dateStamp, regionName, serviceName) {
    const kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
  };
}
const p4 = new P4();

const getEndpoint = () => {
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
  const req = `GET\n/mqtt\n${qs}\nhost:${IOT_ENDPOINT}\n\nhost\n${p4.sha256(
    ""
  )}`;

  qs +=
    "&X-Amz-Signature=" +
    p4.sign(
      p4.getSignatureKey(SECRET_KEY, ymd, REGION, "iotdevicegateway"),
      `AWS4-HMAC-SHA256\n${fdt}\n${scope}\n${p4.sha256(req)}`
    );
  return `wss://${IOT_ENDPOINT}/mqtt?${qs}`;
};

// Create a client instance: Broker, Port, Websocket Path, Client ID
const clientId = Math.random().toString(36).substring(7);
const client = connect(getEndpoint(), clientId);

export const check = (client, t1a, y1a, t2a, y2a, clicked) => {
  let x1;
  let x2;
  if (t1a > y1a + 20) {
    x1 = -1;
  } else if (t1a < y1a - 20) {
    x1 = 1;
  } else {
    x1 = 0;
  }

  if (t2a > y2a + 5) {
    x2 = -1;
  } else if (t2a < y2a - 5) {
    x2 = 1;
  } else {
    x2 = 0;
  }

  let payload = { control1: [x1], control2: [x2] };
  if (!clicked) {
    console.log("process control has being stopped");
    payload = { control1: [0], control2: [0] };
  }
  let payloadText = JSON.stringify(payload);

  client.publish('pump/control', payloadText, { qos : 0 }, error => {
    if (error) {
      console.log('Publish error: ', error);
    }
  });
};

export default client;
