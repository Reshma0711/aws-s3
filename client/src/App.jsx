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

  // const handleDownload = (key) => {
  //   const link = document.createElement("a");
  //   link.href = `http://localhost:7777/download/${key}`;
  //   link.target = "_blank"; // Open in new tab
  //   link.download = ""; // Hint to browser to download (not required for S3 signed URLs)
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  
  const handleDownload = async (key) => {
    try {
      const response = await fetch(`http://localhost:7777/download/${key}`);
  
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
  
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = key;
  
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err.message);
    }
  };
  


  // const handleDownload = (key) => {
  //   window.location.href = `http://localhost:7777/download/${key}`

  //   // window.open(`http://localhost:7777/download/${key}`,_self);
  // };

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

      setUploadedImages((prev) => [...prev, { key, url: getRes.data.fileUrl }]);

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
                {/* <a
                  href={img.url}
                  // download
                  // target="_blank"
                  // rel="noreferrer"
                > */}
                  <button  
                  onClick={() => handleDownload(img.key)}
                    style={{
                      marginTop: 10,
                      backgroundColor: "green",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Download
                  </button>
                {/* </a> */}
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

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const App = () => {
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [uploadedImages, setUploadedImages] = useState([]);

//   const fetchFiles = async () => {
//     try {
//       const res = await axios.get("http://localhost:7777/files");
//       setUploadedImages(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setUploadStatus("");
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a file");

//     try {
//       const { data } = await axios.post("http://localhost:7777/upload", {
//         fileName: file.name,
//         fileType: file.type,
//       });

//       await axios.put(data.fileUrl, file, {
//         headers: {
//           "Content-Type": file.type,
//         },
//       });

//       // Get the GET URL to show the uploaded image
//       const getRes = await axios.get(`http://localhost:7777/${key}`);

//       setUploadedImages((prev) => [...prev, { key, url: getRes.data.fileUrl }]);

//       setUploadStatus("Uploaded!");
//       setFile(null);
//       fetchFiles();
//     } catch (error) {
//       console.error("Upload error:", error);
//       setUploadStatus("Upload failed!");
//     }
//   };

//   const handleDelete = async (key) => {
//     try {
//       await axios.delete(`http://localhost:7777/${key}`);
//       setUploadedImages((prev) => prev.filter((img) => img.key !== key));
//       setUploadStatus("Deleted!");
//     } catch (err) {
//       console.error("Delete error:", err);
//       setUploadStatus("Delete failed!");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Upload Image to S3</h2>
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <br />
//       <button onClick={handleUpload} style={{ marginTop: 10 }}>
//         Upload
//       </button>
//       <p>{uploadStatus}</p>

//       {uploadedImages.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <h4>Uploaded Images:</h4>
//           <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//             {uploadedImages.map((img) => (
//               <div key={img.key} style={{ textAlign: "center" }}>
//                 <img
//                   src={img.url}
//                   alt="Uploaded"
//                   style={{ width: 200, borderRadius: 8 }}
//                 />
//                 <br />
//                 <a
//                   href={img.url}
//                   download={img.fileName}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   <button
//                     style={{
//                       marginTop: 10,
//                       backgroundColor: "green",
//                       color: "white",
//                       padding: "5px 10px",
//                       border: "none",
//                       borderRadius: 4,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Download
//                   </button>
//                 </a>
//                 <br />
//                 <button
//                   onClick={() => handleDelete(img.key)}
//                   style={{
//                     marginTop: 10,
//                     backgroundColor: "red",
//                     color: "white",
//                     padding: "5px 10px",
//                     border: "none",
//                     borderRadius: 4,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
