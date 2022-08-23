/**
 * __Common Successful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | OK | 200 | Standard response for successful HTTP requests |
 * | Created | 201 | server does'nt have a current representation and the PUT request successfully creates one |
 * | Updated | 204 | if the server has a current representation and is successfully modified |
 *
 * __Common Unsuccessful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | Unauthorized | 401 |  authentication is required and has failed |
 * | Forbidden | 403 | the request was successful but the user may not have the necessary permissions for a resource |
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes for more information
 */
export default class RESTfulApiInterface {
  constructor() {
    this.baseUrl = `${process.env.REACT_APP_BACKEND_URL_DEV}`;
  }

  /**
   * This will send an HTTP PUT request to the ``baseUrl/resourceEndpoint/CREATE`` endpoint
   * The HTTP PUT request method creates a new resource or replaces a representation of the target resource
   * with the request payload
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   * @param {*} resource - this is the object that will be posted to the specified backend
   *
   * @returns {*} statusCode - a ``<Promise>`` containing the status code of the request
   *
   * Side Effects:
   * - the URI and the response from the backend are logged to the console
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   *
   * If you send the same PUT request multiple times, the result will remain the same but
   * if you send the same POST request multiple times, you will receive different results.
   * PUT method is idempotent whereas POST method is not idempotent
   * @see https://stackoverflow.com/questions/630453/what-is-the-difference-between-post-and-put-in-http
   * for more information
   */
  async putResource(resourceEndpoint, resource) {
    let URI = `${this.baseUrl}/${resourceEndpoint}/CREATE`;
    let statusCode = 0;
    let _ = await fetch(URI, {
      headers: new Headers({
        "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
      }),
      method: "POST",
      body: JSON.stringify(resource),
    })
      .then((res) => {
        statusCode = res.status;
        return res.json();
      })
      .then((res) => {
        console.log("backend response", res);
        console.log(`PUT ${URI}`, resource);
      });
    return { statusCode };
  }

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @returns {*} {statusCode, resource} - a ``<Promise>`` containing the status code and
   * the resource returned by the server of the request
   *
   * ### Dev Information
   *  - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  async getResource(resourceEndpoint) {
    let URI = `http://127.0.0.1:8000/${resourceEndpoint}/READ`;
    let statusCode = 0;
    let resource = await fetch(URI, {
      headers: new Headers({
        "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
      }),
      method: "GET",
    })
      .then((res) => {
        statusCode = res.status;
        return res.json();
      })
      .then((resource) => resource);
    return { resource, statusCode };
  }

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @param {*} resourceKey - string specifying the unique identifier of the resource to be deleted
   *
   * @returns {*} {statusCode} - a ``<Promise>`` containing the status code of the request
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  async deleteResource(resourceEndpoint, resourceKey) {
    let URI = `${this.baseUrl}/${resourceEndpoint}/DELETE`;
    let statusCode = 0;
    let _ = await fetch(URI, {
      headers: new Headers({
        "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
      }),
      method: "DELETE",
      body: JSON.stringify(resourceKey),
    })
      .then((res) => {
        statusCode = res.status;
        return res.json();
      })
      .then((res) => {
        console.log("backend response", res);
        console.log(`DELETE ${URI}`, resourceKey);
      });
    return { statusCode };
  }
}
