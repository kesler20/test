import "./CreateLinkModal.css";
import React, { useState } from "react";

const CreateLinkModal = ({ handleSubmit }) => {
  const [name, setTitle] = useState("Create Link");

  const onSubmit = (e) => {
    let currentChannels = JSON.parse(localStorage.getItem("client-info"))
    e.preventDefault();
    let newClient = {
      channelID: currentChannels.length,
      readTopic: "",
      writeTopic: "pump/control",
      controlled: true,
      errorBound: 5,
      smoothing: { value: 0, visible: false },
      controlIntensity: 1,
      online: true,
      clientID: name,
    }
    handleSubmit(newClient);
  };
  return (
    <div className="modal__container">
      <div className="modal__card">
        <form className="modal__card__form" onSubmit={(e) => onSubmit(e)}>
          <div className="modal__card__header">
            <div className="modal__card__badge--create">
              <img
                src="https://uploads-ssl.webflow.com/612b579592e3bf93283444b6/612b69f61d22d5ca878550af_chevron-right.svg"
                loading="lazy"
                alt=""
                className="image-2-copy-copy"
              />
            </div>
            <p>client ID ?</p>
          </div>
          <input
            type="text"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="modal__card__btn--create">
            Create
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15 15"
              width="12"
              height="12"
              style={{ marginLeft: "0.33em" }}
            >
              <g
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M4.497 1H3a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-1.5h0"
                  opacity=".6"
                ></path>
                <path d="M9 1.008L14 1v5M14 1L6 9"></path>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateLinkModal;

// TODO: create a modal for alerting th user that everything worked well