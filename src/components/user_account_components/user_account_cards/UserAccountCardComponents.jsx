import React, { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import {
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Card } from "react-bootstrap";
import CustomPaginationActionsTable from "../table_user_data/TabularUserFiles";
import "./UserAccountCardComponents.css";
// let object = {
//     name: 'Jack',
//     age: 25
//   };
//   let keys = Object.keys(object)
//   console.log(keys);

// const initialClients = [
//   {
//     channelID: 0,
//     readTopic: "pump/pressure",
//     writeTopic: "pump/control",
//     controlled: true,
//     errorBound: 5,
//     smoothing: { value: 0, visible: false },
//     controlIntensity: 1,
//     online: true,
//   },
//   {
//     channelID: 1,
//     readTopic: "pump/temperature",
//     writeTopic: "heater/control",
//     controlled: true,
//     errorBound: 5,
//     smoothing: { value: 0, visible: false },
//     controlIntensity: 1,
//     online: true,
//   },
// ];

export const UserFilesCard = ({ files, onDeleteFile }) => {
  const [viewContent, setViewContent] = useState(false);

  return (
    <>
      <Splide
        options={{
          perPage: 4,
          arrows: false,
          pagination: false,
          drag: "free",
          gap: "530px",
        }}
      >
        {files.map((file) => {
          return (
            <SplideSlide key={files.indexOf(file)}>
              <Card className="angry-grid" key={files.indexOf(file)}>
                <div id="item-0" className="user-card__header">
                  <p>filename</p>
                  <hr />
                </div>
                <p id="item-1" className="user-card__body">
                  {file.filename}
                </p>
                <div id="item-2" className="user-card__buttons">
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => setViewContent(!viewContent)}
                    variant="outlined"
                    color="success"
                  >
                    Read
                  </Button>
                  <Button
                    className="user-card__buttons__btn"
                    variant="outlined"
                    color="success"
                  >
                    Update
                  </Button>
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => onDeleteFile(file)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
                <div id="item-3" className="user-card__header">
                  <p>file size</p>
                  <hr />
                </div>
                <p id="item-4" className="user-card__body">
                  254 MB
                </p>
                <div id="item-5" className="user-card__header">
                  <p>format</p>
                  <hr />
                </div>
                <p id="item-6" className="user-card__body">
                  tabular
                </p>
              </Card>
            </SplideSlide>
          );
        })}
      </Splide>
      {viewContent === true ? <CustomPaginationActionsTable /> : ""}
    </>
  );
};

export const UserClientCard = ({ clients, onDeleteClient }) => {
  const [connected, setConnected] = useState(false);
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      <Splide
        options={{
          perPage: 4,
          arrows: true,
          pagination: false,
          drag: "free",
          gap: "580px",
        }}
      >
        {clients.map((client) => {
          return (
            <SplideSlide key={clients.indexOf(client)}>
              <Card className="angry-grid" key={clients.indexOf(client)}>
                <div id="item-0" className="user-card__header">
                  <p>client ID</p>
                  <hr />
                </div>
                <p id="item-1" className="user-card__body">
                  {client.clientID}
                </p>
                <div id="item-2" className="user-card__buttons">
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => setConnected(!connected)}
                    variant="outlined"
                    color="success"
                  >
                    {connected === false ? "Switch on" : "Switch off"}
                  </Button>
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => onDeleteClient(client)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </div>
                <div id="item-3">
                  <p className="user-card__header">status</p>
                  <hr />
                </div>
                <p id="item-4" className="user-card__body">
                  {connected === false ? "online ✅" : "offline ❌"}
                </p>
                <div id="item-5">
                  <p className="user-card__header">topic</p>
                  <hr />
                </div>
                <div id="item-6" className="user-card__body">
                  <FormControl fullWidth>
                    <InputLabel
                      className="user-card__header"
                      id="demo-simple-select-label"
                    >
                      DATA
                    </InputLabel>
                    <Select
                      className="user-card__header"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Age"
                      onChange={handleChange}
                    >
                      <MenuItem value={10}>DATA/pressure</MenuItem>
                      <MenuItem value={20}>DATA/temperature</MenuItem>
                      <MenuItem value={30}>DATA/concentration</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Card>
            </SplideSlide>
          );
        })}
      </Splide>
    </>
  );
};
