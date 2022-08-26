/////////////////////////////////////////////////////////////////////////////////
//THIS SECTION OF THE DATABASE TESTING ONLY TESTS THE USER FILES MANAGEMENT SYSTEM
/////////////////////////////////////////////////////////////////////////////////

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
import RESTfulApi from "../APIs/RESTfulApi";
import testFetch from "./test_fetch";

const dbApi = new DatabaseApi("userFiles");
const api = new RESTfulApi();
const jwtToken = `Bearer ${process.env.REACT_APP_JWT_FOR_TESTING}`;
let initialUserFiles = [];

api.activateTestMode = true;
api.jwtToken = jwtToken;
dbApi.api = api;

//////////////////////////////
//SETUP AND TEARDOWN TO CLEANUP
//////////////////////////////
/**
 * for more information regarding jets set up and tear down read
 * https://jestjs.io/docs/25.x/setup-teardown#:~:text=Jest%20executes%20all%20describe%20handlers%20in%20a%20test,
 */
const deleteFileFromDatabase = async (file) => {
  await testFetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/DELETE`, {
    headers: new Headers({
      "X-JWT": jwtToken,
    }),
    method: "POST",
    body: JSON.stringify(file.filename),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
};

beforeAll(async () => {
  /**
   * get all the initial user files
   * __NOTE the test could fail if the user has no files?__
   */
  await testFetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/READ`, {
    headers: new Headers({
      "X-JWT": jwtToken,
    }),
    method: "GET",
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((resource) => initialUserFiles.push(...resource["files found"]));
});

afterAll(() => {
  initialUserFiles.forEach((file) => {
    if (initialUserFiles.indexOf(file) === -1) {
      deleteFileFromDatabase(file);
    }
  });
});

test("testing setup", () => {
  expect(initialUserFiles).toHaveLength(2);
});

test("testing teardown", () => {
  expect(initialUserFiles).toHaveLength(2);
});

afterEach(() => {
  localStorage.clear();
});

//////////////////////////////
//UNIT TEST FOR CRUD OPERATIONS
//////////////////////////////
/**
 * Setup and tear down
 * for more information regarding jets set up and tear down read
 * https://jestjs.io/docs/25.x/setup-teardown#:~:text=Jest%20executes%20all%20describe%20handlers%20in%20a%20test,
 */
test("read files from local storage", () => {
  let userFiles = dbApi.readResource("userFiles");
  expect(typeof userFiles.length).toEqual(typeof 0);
});

test("save two objects to local storage", () => {
  dbApi.saveResourceToLocalStorage("testFiles", { objectAttribute: "test1" });
  dbApi.saveResourceToLocalStorage("testFiles", { objectAttribute: "test2" });
  expect(dbApi.readResource("testFiles")).toHaveLength(2);
  expect(dbApi.readResource("testFiles")[0].objectAttribute).toBe("test1");
  expect(dbApi.readResource("testFiles")[1].objectAttribute).toBe("test2");
});

test("delete one object from local storage", () => {
  dbApi.saveResourceToLocalStorage("testFiles", { objectAttribute: "test1" });
  expect(dbApi.readResource("testFiles")).toHaveLength(1);
  dbApi.deleteResource("testFiles");
  expect(dbApi.readResource("testFiles")).toHaveLength(0);
});

test("update a resource in local storage", () => {
  dbApi.saveResourceToLocalStorage("testFiles", { objectAttribute: "test1" });
  dbApi.saveResourceToLocalStorage("testFiles", {
    name: "testToChange",
    objectAttribute1: "test2",
  });
  dbApi.updateResourceInLocalStorage("testFiles", "name", "testToChange", {
    name: "testToChange",
    objectAttribute1: "test3",
  });
  expect(
    dbApi
      .readResourceFromLocalStorage("testFiles")
      .filter((testFile) => testFile["name"] === "testToChange")[0]["objectAttribute1"]
  ).toBe("test3");
});
// THE CREATE FILE FUNCTIONALITY IS TESTED USING JEST INTEGRATION TESTING
