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
import fetch from "isomorphic-fetch";
import DatabaseApi from "../APIs/DatabaseApi";

const api = new DatabaseApi("userFiles");
let initialUserFiles = [];
/**
 * Setup and tear down
 * for more information regarding jets set up and tear down read
 * https://jestjs.io/docs/25.x/setup-teardown#:~:text=Jest%20executes%20all%20describe%20handlers%20in%20a%20test,
 */
beforeEach(async () => {
  /**
   * get all the initial user files
   * __NOTE the test could fail if the user has no files?__
   */
  await fetch(`${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/READ`, {
    headers: new Headers({
      "X-JWT": "Bearer " + `${process.env.REACT_APP_JWT_FOR_TESTING}`,
    }),
    method: "GET",
  })
    .then(async (res) => {
      await console.log(res.status);
      if (res.ok) {
        return res.json();
      }
    })
    .then((resource) => initialUserFiles.push(...resource["files found"]));
});

afterEach(() => {
  initialUserFiles = []
});

test("testing setup", () => {
  expect(initialUserFiles).toHaveLength(2);
});

test("testing teardown", () => {
  expect(initialUserFiles).toHaveLength(2);
});
