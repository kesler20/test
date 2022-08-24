/**
 * interface for the files resources
 * a resource can be a JSON object taken from a pandas data frame, can be a file from a form data body
 */
export default class Resource {
  constructor() {
    this.filename = null;
    this.formData = new FormData();
    this.file = new File();
  }
}
