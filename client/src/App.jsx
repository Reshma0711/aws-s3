import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]); // Store multiple images

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    try {
      const { data } = await axios.post("http://localhost:7777/upload", {
        fileName: file.name,
        fileType: file.type,
      });

      const { fileUrl, key } = data;

      await axios.put(fileUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // Get the GET URL to show the uploaded image
      const getRes = await axios.get(`http://localhost:7777/${key}`);

      setUploadedImages((prev) => [
        ...prev,
        { key, url: getRes.data.fileUrl },
      ]);

      setUploadStatus("Uploaded successfully!");
      setFile(null); // Reset file input
    } catch (error) {
      console.error("Upload error:", error.message);
      setUploadStatus("Upload failed!");
    }
  };

  const handleDelete = async (keyToDelete) => {
    try {
      await axios.delete(`http://localhost:7777/${keyToDelete}`);
      setUploadedImages((prev) =>
        prev.filter((img) => img.key !== keyToDelete)
      );
      setUploadStatus("Deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.message);
      setUploadStatus("Delete failed!");
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

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Uploaded Images:</h4>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {uploadedImages.map((img) => (
              <div key={img.key} style={{ textAlign: "center" }}>
                <img
                  src={img.url}
                  alt="Uploaded"
                  style={{ width: 200, borderRadius: 8 }}
                />
                <br />
                <button
                  onClick={() => handleDelete(img.key)}
                  style={{
                    marginTop: 10,
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
