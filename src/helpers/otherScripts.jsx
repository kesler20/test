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

function createData(name, calories, fat) {
  return { name, calories, fat };
}

export const rows = [
  createData("Cupcake", 305, 3.7),
  createData("Donut", 452, 25.0),
  createData("Eclair", 262, 16.0),
  createData("Frozen yoghurt", 159, 6.0),
  createData("Gingerbread", 356, 16.0),
  createData("Honeycomb", 408, 3.2),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Jelly Bean", 375, 0.0),
  createData("KitKat", 518, 26.0),
  createData("Lollipop", 392, 0.2),
  createData("Marshmallow", 318, 0),
  createData("Nougat", 360, 19.0),
  createData("Oreo", 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));