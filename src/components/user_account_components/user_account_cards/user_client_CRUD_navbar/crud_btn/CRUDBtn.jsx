import "./CRUDBtn.css";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const CRUDBtn = ({ onCreate }) => {
  return (
    <div className="btn__outer" onClick={onCreate}>
      <AiOutlinePlus />
    </div>
  );
};

export default CRUDBtn;
