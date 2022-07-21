import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const hashDigest = sha256(nonce + message);
const hmacDigest = Base64.stringify(hmacSHA512(path + hashDigest, privateKey));

// the endpoint can be found in the settings
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

export default function getEndpoint() {
  // example: us-east-1
  const REGION = process.env.REACT_APP_REGION;

  // example: blahblahblah-ats.iot.your-region.amazonaws.com
  const IOT_ENDPOINT = process.env.REACT_APP_IOT_ENDPOINT;

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