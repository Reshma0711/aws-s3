import React, { useState, useEffect } from "react";
import axios from "axios";

const GetImage = () => {
  const [img, setImg] = useState(null);

  useEffect(() => {
    const getRes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7777/1744173478194-image1.jpg"
        );
        setImg(res.data.fileUrl); // assuming the backend returns { url: "presigned_url" }
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii", res.data.fileUrl);
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };

    getRes();
  }, []); // empty dependency array to run only once

  return (
    <div>
      <h4>Uploaded Image:</h4>
      {img ? (
        <img src={img} alt="Uploaded" style={{ width: 250, marginTop: 20 }} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default GetImage;
