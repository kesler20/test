import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { PrimaryBtn } from "../StyledElemnts";
import "./drop-file-input.css";

import { ImageConfig } from "../../config/ImageConfig";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const PrimaryBtnStyles = {
  marginTop: 25,
  width: 160,
  height: 60,
  fontSize: "1.2rem",
  borderRadius: 20,
};

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const uploadData = async (formData) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_DEV}/userFiles/`,
      {
        headers: new Headers({
          "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
        }),
        method: "POST",
        body: formData,
      }
    );
    console.log(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("user_files", file);
      console.log("added a csv file 📁", file);
      uploadData(formData)
    });
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <form>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <PrimaryBtn style={PrimaryBtnStyles} onClick={(e) => handleSubmit(e)}>
        Submit
      </PrimaryBtn>
    </form>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
