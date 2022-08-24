import RESTfulApiInterface from "./RESTfulApi";

/**
 * This api is used to connect the front end to the local storage and the backend
 *
 * @param resourceKey - The unique identifier key of the resource, this needs to be a string
 */
export default class DatabaseApi {
  constructor(resourcesDomain) {
    this.resourcesDomain = resourcesDomain;
    this.api = new RESTfulApiInterface();
  }

  /**
   * The create resource method will create a resource in local storage and in the database
   *
   * @param {*} resource - The resource that will be stored, preferably an object or array of objects
   */
  createResource(resourceKey, resource) {
    /**
     * check if the resource already exists in the database
     * put resource as a JSON object to ./baseURL/resourcesDomain/CREATE if does not exist
     */
    localStorage.setItem(resourceKey, JSON.stringify(resource))
    this.api.putResource(this.resourcesDomain, resource);
  }

  /**
   * Update resources in local storage,this function can be run iteratively as
   * the resource value will be overridden each times the function is called
   *
   * @param {*} resourceKey - The unique identifier key of the resource, this needs to be a string
   * @param {*} resource - The resource that will be stored, preferably an object or array of objects
   *
   * __NOTE ensure that the existing resource and therefore the initial resource stored under the
   *  selected resourceKey is an array or other collections which can be unpacked ``...resource``__
   */
  saveResourceToLocalStorage(resourceKey, resource) {
    /**
     * update an existing resource in local storage
     * or create the resource if the resourceKey returns null
     */
    let existingResources = this.readResource(resourceKey);
    let updatedResources = [...existingResources, resource];
    localStorage.setItem(resourceKey, JSON.stringify(updatedResources));
  }

  /**
   * This method will read the resource from local storage, if the resource key will not be found
   * it will send a GET request to the server to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * if also this fail it will return an empty array []
   *
   * @param {*} resourceKey - The unique identifier key of the resource, this needs to be a string
   * @returns The requested resource as a an object or an empty array
   */
  readResource(resourceKey) {
    /**
     * if the local storage get request returns null i.e. the item is not in local storage
     * call the GET method on the backend
     * if the resource remains undefined after the request return an empty list
     */
    let resource;
    if (localStorage.getItem(resourceKey) != null)
      return JSON.parse(localStorage.getItem(resourceKey));
    this.api.getResource(this.resourcesDomain).then((res) => {
      resource = res;
    });
    return resource === undefined ? [] : resource;
  }

  /**
   * Delete a resource both in local storage and in the backend
   * __NOTE: due to the implementation of the delete function in the backend all the resources
   * which will share the same resourceKey will be removed from the database__
   * @param {*} resourceKey - The unique identifier key of the resource, this needs to be a string
   * @returns
   */
  deleteResource(resourceKey) {
    /**
     * if the local storage get request returns null i.e. the item is not in local storage
     * call the GET method on the backend
     * if the resource remains undefined after the request return an empty list
     */
    localStorage.removeItem(resourceKey);
    this.api.deleteResource(this.resourcesDomain, resourceKey);
  }
}
