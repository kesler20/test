
export default class DatabaseApi {
    constructor(fileName) {
      this.fileName = fileName;
    }
  
    createResource(resource) {
      //check for existing resources or if the resource is an object
      let existingResources = JSON.parse(localStorage.getItem(`${this.fileName}`));
      if (existingResources === null) {
        existingResources = []
      }
      let updatedResources = [...existingResources, resource];
      updatedResources = JSON.stringify(updatedResources);
  
      localStorage.setItem(`${this.fileName}`, updatedResources);
    }
  
    viewDatabase = async () => {
      return await localStorage.getItem(`${this.fileName}`);
    };
  
    getResource = (resourceName) => {
      let resource =  JSON.parse(localStorage.getItem(`${this.fileName}`));
      return resource.filter((item) => item.name === resourceName);
    };
  }