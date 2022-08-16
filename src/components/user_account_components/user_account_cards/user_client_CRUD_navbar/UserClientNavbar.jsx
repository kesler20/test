import "./UserClientNavbar.css";
import React, { useState } from "react";

import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaBars } from "react-icons/fa";

import CRUDBtn from "./crud_btn/CRUDBtn";
import CreateLinkModal from "./create_link_modal/CreateLinkModal";
import DeleteLinkModal from "./delete_link_modal/DeleteLinkModal";

const UserClientNavbar = ({ handleCreate, handleDelete }) => {
  const [viewCreateModal, setViewCreateModal] = useState(false);
  const [viewDeleteModal, setViewDeleteModal] = useState(false);

  const onCreateLink = (link) => {
    handleCreate(link);
  };
  const onDeleteLink = (name) => {
    handleDelete(name);
  };

  return (
    <div className="navigation-bar">
      <div className="navigation-bar__btn">
        <FaBars
          className="navigation-bar__btn__icon"
          onClick={() => setViewDeleteModal(!viewDeleteModal)}
        />
        <BiDotsVerticalRounded className="navigation-bar__btn__icon" />
      </div>
      <CRUDBtn onCreate={() => setViewCreateModal(!viewCreateModal)} />
      {viewCreateModal === true ? (
        <CreateLinkModal handleSubmit={(link) => onCreateLink(link)} />
      ) : (
        React.Fragment
      )}
      {viewDeleteModal === true ? (
        <DeleteLinkModal handleSubmit={(name) => onDeleteLink(name)} />
      ) : (
        React.Fragment
      )}
    </div>
  );
};

export default UserClientNavbar;
