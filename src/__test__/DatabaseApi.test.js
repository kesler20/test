///////////////////////////////////////////////////////////////////////////////////
// THIS SECTION OF THE DATABASE TESTING ONLY TESTS THE USER FILES MANAGEMENT SYSTEM
///////////////////////////////////////////////////////////////////////////////////

/*
1. The following link directs to documentation regarding AWS performance limits 
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html#default-limits-throughput-capacity-modes

2. The following article expands on those limits 
https://www.alexdebrie.com/posts/dynamodb-limits/

########## REQUIREMENTS #################

Methods for data storage in Amazon Web Services (AWS), identify big data technologies 
in processing and storing large volumes of data in seconds e.g. in MongoDB.
*/

import DatabaseApi from "../APIs/DatabaseApi";
const api = new DatabaseApi("userFiles");

afterEach(() => {
  localStorage.clear();
});

/**
 * Setup and tear down
 * for more information regarding jets set up and tear down read
 * https://jestjs.io/docs/25.x/setup-teardown#:~:text=Jest%20executes%20all%20describe%20handlers%20in%20a%20test,
 */
test("read files from local storage", () => {
  let userFiles = api.readResource("userFiles");
  expect(typeof userFiles.length).toEqual(typeof 0);
});

test("save two objects to local storage", () => {
  api.saveResourceToLocalStorage("testFiles", { objectAttribute: "test1" });
  api.saveResourceToLocalStorage("testFiles", { objectAttribute: "test2" });
  expect(api.readResource("testFiles")).toHaveLength(2);
  expect(api.readResource("testFiles")[0].objectAttribute).toBe("test1");
  expect(api.readResource("testFiles")[1].objectAttribute).toBe("test2");
});

test("delete one object from local storage", () => {
  api.saveResourceToLocalStorage("testFiles", { objectAttribute: "test1" });
  expect(api.readResource("testFiles")).toHaveLength(1);
  api.deleteResource("testFiles");
  expect(api.readResource("testFiles")).toHaveLength(0);
});

