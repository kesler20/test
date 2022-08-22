import RESTfulApiInterface from "./RESTfulApi";

/**
 * This api is used to connect the front end to the local storage and the backend
 * 
 * @param resourceKey - The unique identifier key of the resource, this needs to be a string
 */
export default class DatabaseApi {
    constructor(resourcesDomain) {
      this.resourcesDomain = resourcesDomain
      this.api = new RESTfulApiInterface()
    }

    /**
     * The create resource method will create a resource in local storage and in the database
     * 
     * @param {*} resourceKey - The unique identifier key of the resource, this needs to be a string
     * @param {*} resource - The resource that will be stored, preferably an object or array of objects
     */
    createResource(resourceKey, resource) {
      /**
       * create resource in local storage {this overrides existing resources with the same key}
       */
      localStorage.setItem(resourceKey,JSON.stringify(resource))
      /**
       * check if the resource already exists in the database
       * put resource as a JSON object to ./baseURL/resourcesDomain/CREATE if does not exist
       */
      this.api.putResource(this.resourcesDomain, resource)
    }
    updateResource(resourceKey, resource) {
      /*
      
      - check for existing resources and if the resource is an object

      */
      let existingResources = this.readResource(resourceKey)
      let updatedResources = [...existingResources, resource];
      this.createResource(resourceKey, resource)
    }
  
    viewDatabase = async () => {
      return await localStorage.getItem(`${this.resourceKey}`);
    };
  
    readResource = (resourceName) => {
      let resource =  JSON.parse(localStorage.getItem(`${this.resourceKey}`));
      return resource.filter((item) => item.name === resourceName);
    };
    
  }