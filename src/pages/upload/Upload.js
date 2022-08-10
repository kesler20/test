import "./Upload.css";
import DropFileInput from "../../components/drop_file_input/DropFileInput"


const Upload = () => {
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <div className="upload-page">
      <div className="upload-page__body">
        <div className="upload-page__body__box">
          <h2 className="upload-page__body__box__header">Drop your files below</h2>
          <DropFileInput onFileChange={(files) => onFileChange(files)} />
        </div>
      </div>
    </div>
  );
};

export default Upload;
