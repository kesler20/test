
export default class DatabaseApi {
    constructor(resourceKey) {
      this.resourceKey = resourceKey;
    }
  
    createResource(resource) {
      //check for existing resources or if the resource is an object
      let existingResources = JSON.parse(localStorage.getItem(`${this.resourceKey}`));
      if (existingResources === null) {
        existingResources = []
      }
      let updatedResources = [...existingResources, resource];
      updatedResources = JSON.stringify(updatedResources);
  
      localStorage.setItem(`${this.resourceKey}`, updatedResources);
    }
  
    viewDatabase = async () => {
      return await localStorage.getItem(`${this.resourceKey}`);
    };
  
    getResource = (resourceName) => {
      let resource =  JSON.parse(localStorage.getItem(`${this.resourceKey}`));
      return resource.filter((item) => item.name === resourceName);
    };
  }