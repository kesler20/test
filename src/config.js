import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
// the endpoint can be found in the settings
class P4 {
  sign = function (key, msg) {
    const hashDigest = sha256(msg);
    const hmacDigest = Base64.stringify(
      hmacSHA512(hashDigest, key)
    );
    return hmacDigest
  };

  sha256 = function (msg) {
    const hash = sha256(msg);
    return Base64.stringify(hash)
  };

  getSignatureKey = function (key, dateStamp, regionName, serviceName) {
    const kDate = sha256(dateStamp, "AWS4" + key);
    const kRegion = sha256(regionName, kDate);
    const kService = sha256(serviceName, kRegion);
    const kSigning = sha256("aws4_request", kService);
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
}
