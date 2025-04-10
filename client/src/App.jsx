import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // for preview after S3 upload
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadStatus("");
    setPreview(null); // Clear previous preview
  };
  
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    try {
      // Step 1: Get presigned PUT URL
      const { data } = await axios.post("http://localhost:7777/upload", {
        fileName: file.name,
        fileType: file.type,
      });

      const { fileUrl, key } = data;

      // Step 2: Upload file to S3
      await axios.put(fileUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setUploadStatus("Uploaded successfully!");

      // Step 3: Get presigned GET URL to display uploaded image
      const getRes = await axios.get(`http://localhost:7777/${key}`
      );

      setPreview(getRes.data.fileUrl); // Set S3 image preview
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiii",getRes.data.fileUrl)

      console.log("File uploaded and preview URL fetched:", getRes.data.fileUrl);
    } catch (error) {
      console.error("Upload error:", error.message);
      setUploadStatus("Upload failed!");
    }
  };

  return (
    <div className="upload-container" style={{ padding: 20 }}>
      <h2>Upload Image to S3</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ marginTop: 10 }}>
        Upload
      </button>
      <p>{uploadStatus}</p>

      {preview && (
        <div style={{ marginTop: 20 }}>
          <h4>Uploaded Image:</h4>
          <img src={preview} alt="Uploaded" style={{ width: 250 }} />
        </div>
      )}
    </div>
  );
};

export default App;


