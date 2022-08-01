const fs = require("fs");

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
    console.log(existingResources)
    let updatedResources = [...existingResources, resource];
    updatedResources = JSON.stringify(updatedResources);

    localStorage.setItem(`${this.fileName}`, updatedResources);
    //console.log(`resource : ${updatedResources} created successfully✅`);
  }

  viewDatabase = async () => {
    return await localStorage.getItem(`${this.fileName}`);
  };

  getResource = (resourceName) => {
    let resource = require(`${this.fileName}`);
    console.log(resource);
    return resource.filter((item) => item.name === resourceName);
  };
}
