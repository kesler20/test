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

    createResource(resourceKey, resource) {
      localStorage.setItem(resourceKey,JSON.stringify(resource))

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