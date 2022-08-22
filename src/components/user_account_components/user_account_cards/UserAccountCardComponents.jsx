import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect, useState } from "react";
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

export const UserFilesCard = ({ files, onDeleteFile }) => {
  const [viewContent, setViewContent] = useState(false);
  const [userFileID, setUserFileID] = useState(0); // this is used to toggle the right read

  const toggleTable = (fileID) => {
    setUserFileID(fileID);
    setViewContent(!viewContent);
  };

  return (
    <>
      <Splide
        options={{
          perPage: 3,
          arrows: true,
          pagination: false,
          drag: "free",
          gap: "10px",
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
                    onClick={() => toggleTable(files.indexOf(file))}
                    variant="outlined"
                    color="success"
                  >
                    Read
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
      {viewContent === true ? (
        <CustomPaginationActionsTable fileID={userFileID} />
      ) : (
        ""
      )}
    </>
  );
};

export const UserClientCard = ({
  clients,
  topics,
  onCreateTopic,
  onDeleteTopic,
  onChangeConnection,
  onChangeReadTopic,
  onChangeWriteTopic,
}) => {
  const [newTopic, setNewTopic] = useState("");

  return (
    <>
      <Splide
        options={{
          perPage: 2,
          arrows: true,
          pagination: false,
          drag: "free",
          gap: "0px",
        }}
      >
        {clients.map((client) => {
          return (
            <SplideSlide key={clients.indexOf(client)}>
              <Card
                className="angry-grid--client"
                key={clients.indexOf(client)}
              >
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
                    onClick={() => onChangeConnection(client.channelID)}
                    variant="outlined"
                    color="success"
                  >
                    {client.online === false ? "Switch on" : "Switch off"}
                  </Button>
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => onCreateTopic(newTopic)}
                    variant="outlined"
                    color="success"
                  >
                    Create Topic
                  </Button>
                  <Button
                    className="user-card__buttons__btn"
                    onClick={() => onDeleteTopic(newTopic)}
                    variant="outlined"
                    color="success"
                  >
                    Delete Topic
                  </Button>
                  <TextField
                    onChange={(e) => setNewTopic(e.target.value)}
                    id="outlined-basic"
                    label="Write Topic Name"
                    color="secondary"
                    variant="outlined"
                  />
                </div>
                <div id="item-3">
                  <p className="user-card__header">status</p>
                  <hr />
                </div>
                <p id="item-4" className="user-card__body">
                  {client.online === true ? "online ✅" : "offline ❌"}
                </p>
                <div id="item-5">
                  <p className="user-card__header">topic</p>
                  <hr />
                </div>
                <div id="item-6" className="user-card__body">
                  <div
                    className="flex-space-evenly"
                    style={{ width: "270px" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        className="user-card__header"
                        id="demo-simple-select-label"
                      >
                        READ
                      </InputLabel>
                      <Select
                        style={{ marginRight: "10px" }}
                        className="user-card__header"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={client.readTopic}
                        label="topic"
                        onChange={(e) =>
                          onChangeReadTopic(e.target.value, client.channelID)
                        }
                      >
                        {topics.map((topic) => {
                          return (
                            <MenuItem
                              key={topics.indexOf(topic)}
                              value={topic}
                            >
                              {topic}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel
                        className="user-card__header"
                        id="demo-simple-select-label"
                      >
                        WRITE
                      </InputLabel>
                      <Select
                        className="user-card__header"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={client.writeTopic}
                        label="topic"
                        onChange={(e) =>
                          onChangeWriteTopic(e.target.value, client.channelID)
                        }
                      >
                        {topics.map((topic) => {
                          return (
                            <MenuItem
                              key={topics.indexOf(topic)}
                              value={topic}
                            >
                              {topic}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Card>
            </SplideSlide>
          );
        })}
      </Splide>
    </>
  );
};
