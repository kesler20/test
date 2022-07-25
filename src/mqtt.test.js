/* 
########## REQUIREMENTS #################

Develop and establish dataflow methodologies. Data acquired from generic sensors to 
visualization of live processed data on dashboard at a minimum sampling rate of 5Hz. 
The flow requires that data is routed from the sensor to the cloud where bespoke data 
processing methods (e.g. data smoothing) can be applied before rendering live on the 
dashboard by calculating 60 second moving average. Basic statistical analysis e.g. 
ANOVA. Assess, report and formulate methods of improving any time delays between 
acquisition and visualization on the dashboard, with a latency of less than 5s 
for raw data and less than 10s-60s for processed data depending on complexity of data manipulation.
*/

import { publishData, mqttGetMessage } from "./components/mqttProtocol";

/// read and write topics with respect to the application
const readTopic = "DATA/pressure";
const writeTopic = "DATA/control";

// const cutomCallback = (topic, message) => {

// }

const sum = (array) => {
  let result = 0
  array.forEach(item => result += item)
  return result
}

test("test that mqtt messages can be sampled at a rate of 5Hz", () => {
  // construct an array of length 50
  let dataArray = [];
  let dataFromAws = [];
  let readTime = [];

  for (let i = 0; i < 50; i++) {
    dataArray.push(i);
  }

  const customCallback = (payload) => {
    var start = new Date().getTime();

    dataFromAws.push(payload);

    var end = new Date().getTime();
    readTime.push(end - start);
  };

  // subscribe to read topic to listen for new data
  mqttGetMessage(readTopic, customCallback);

  // push 50 data points to the read topic
  dataArray.forEach((dataPoint) => publishData(dataPoint, readTopic));

  // check that at least 5 data points where read in 1 second
  expect(dataFromAws.length).toBeGreaterThanOrEqual(5);
  expect(sum(readTime)).toBeLessThanOrEqual(1);
});
