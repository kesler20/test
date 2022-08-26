import DatabaseApi from "../APIs/DatabaseApi";

export default class MQTTClient {
  constructor(
    channelID,
    readTopic,
    writeTopic,
    controlled,
    errorBound,
    smoothing,
    controlIntensity,
    online,
    clientID
  ) {
    this.channelID = channelID;
    this.readTopic = readTopic;
    this.writeTopic = writeTopic;
    this.controlled = controlled;
    this.errorBound = errorBound;
    this.smoothing = smoothing;
    this.controlIntensity = controlIntensity;
    this.online = online;
    this.clientID = clientID;
    this.db = new DatabaseApi("IoTClient");
  }

  saveClient() {
    /**
     * replace a resource in local storage with the corresponding channelID
     */
    this.db.updateResourceInLocalStorage("client-info","channelID", this.channelID,{
      channelID: this.channelID,
      readTopic: this.readTopic,
      writeTopic: this.writeTopic,
      controlled: this.controlled,
      errorBound: this.errorBound,
      smoothing: this.smoothing,
      controlIntensity: this.controlIntensity,
      online: this.online,
      clientID: this.clientID,
    });
  }
}

// TODO: the client could also be saved to the database