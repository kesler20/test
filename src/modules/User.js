
/**
 * An interface for the users
 */
 export default class User {
  constructor() {
    this.username = localStorage.getItem("username");
  }
}
