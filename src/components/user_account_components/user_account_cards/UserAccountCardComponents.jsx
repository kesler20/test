import React, { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Button, Select, FormControl, MenuItem, InputLabel } from "@material-ui/core";
import { Card } from "react-bootstrap";
import CustomPaginationActionsTable from "../table_user_data/TabularUserFiles";

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
              <Card
                className="angry-grid"
                style={{
                  width: "500px",
                  boxShadow: "3px 2px 15px rgb(12, 12, 12)",
                }}
                key={files.indexOf(file)}
              >
                <div id="item-0" style={{ color: "white" }}>
                  <p>filename</p>
                  <hr />
                </div>
                <p id="item-1" style={{ color: "#767c76" }}>
                  {file.filename}
                </p>
                <div id="item-2" style={{ display: "flex" }}>
                  <Button
                    onClick={() => setViewContent(!viewContent)}
                    variant="outlined"
                    color="success"
                    style={{
                      margin: 8,
                      backgroundColor: "#161d33",
                      color: "#767c76",
                    }}
                  >
                    Read
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    style={{
                      margin: 8,
                      backgroundColor: "#161d33",
                      color: "#767c76",
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => onDeleteFile(file)}
                    variant="outlined"
                    color="error"
                    style={{
                      margin: 8,
                      backgroundColor: "#161d33",
                      color: "#767c76",
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div id="item-3">
                  <p style={{ color: "white" }}>file size</p>
                  <hr />
                </div>
                <p id="item-4" style={{ color: "#767c76" }}>
                  254 MB
                </p>
                <div id="item-5">
                  <p style={{ color: "white" }}>format</p>
                  <hr />
                </div>
                <p id="item-6" style={{ color: "#767c76" }}>
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
  const [age, setAge] = useState('');

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
              <Card
                className="angry-grid"
                style={{
                  width: "550px",
                  boxShadow: "3px 2px 15px rgb(12, 12, 12)",
                }}
                key={clients.indexOf(client)}
              >
                <div id="item-0" style={{ color: "white" }}>
                  <p>client ID</p>
                  <hr />
                </div>
                <p id="item-1" style={{ color: "#767c76" }}>
                  {client.clientID}
                </p>
                <div id="item-2" style={{ display: "flex" }}>
                  <Button
                    onClick={() => setConnected(!connected)}
                    variant="outlined"
                    color="success"
                    style={{
                      margin: 8,
                      backgroundColor: "#161d33",
                      color: "#767c76",
                    }}
                  >
                    {connected === false ? "Switch on" : "Switch off"}
                  </Button>
                  <Button
                    onClick={() => onDeleteClient(client)}
                    variant="outlined"
                    color="error"
                    style={{
                      margin: 8,
                      backgroundColor: "#161d33",
                      color: "#767c76",
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div id="item-3">
                  <p style={{ color: "white" }}>status</p>
                  <hr />
                </div>
                <p id="item-4" style={{ color: "#767c76" }}>
                  {connected === false ? "online ✅" : "offline ❌"}
                </p>
                <div id="item-5">
                  <p style={{ color: "white" }}>topic</p>
                  <hr />
                </div>
                <div id="item-6" style={{ color: "#767c76" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" style={{ color: 'white'}}>DATA</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Age"
                      onChange={handleChange}
                      style={{ color: 'white'}}
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
