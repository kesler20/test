function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export const convertUnixEpochTimeSToDate = (unixEpochTimeS) => {
  const unixEpochTimeMS = unixEpochTimeS * 1000;
  const d = new Date(unixEpochTimeMS);
  let h = addZero(d.getHours());
  let m = addZero(d.getMinutes());
  let s = addZero(d.getSeconds());
  let time = h + ":" + m + ":" + s;
  return time;
};

export const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

export const getRandomColor = () => {
  const r = getRandomNumber(250);
  const g = getRandomNumber(250);
  const b = getRandomNumber(250);

  return `rgb(${r}, ${g}, ${b})`;
};

export const range = (collection, numberOfDataPoints) => {
  const reducedCollection = [];
  for (let i = 1; i < collection.length; i++) {
    if (i < numberOfDataPoints) {
      try {
        reducedCollection.push(collection.pop());
      } catch (e) {
        console.log(e);
      }
    }
  }

  reducedCollection.reverse()
  return reducedCollection;
};
