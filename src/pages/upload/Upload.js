import "./Upload.css";
import DropFileInput from "../../components/drop_file_input/DropFileInput"

const Upload = () => {
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <div className="uploadPage">
      <div className="uploadPage-body">
        <div className="box">
          <h2 className="header">Drop your files below</h2>
          <DropFileInput onFileChange={(files) => onFileChange(files)} />
        </div>
      </div>
    </div>
  );
};

export default Upload;
