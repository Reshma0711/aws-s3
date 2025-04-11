const {
  getFile,
  uploadFile,
  deleteFile,
  downloadFile,
} = require("../utils/upload");
const File = require("../model/upload"); // your Mongoose model

exports.uploadFile = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    console.log("Incoming request:", fileName, fileType);

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "fileName and fileType are required" });
    }

    const key = `${Date.now()}-${fileName}`;

    const fileUrl = await uploadFile(key, fileType); // Pass fileType if your util needs it

    // Save file metadata to DB
    await File.create({
      key,
      fileName,
      mimeType: fileType,
    });

    res.status(200).json({ status: "success", fileUrl, key });
  } catch (err) {
    console.error("Error getting file URL:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFile = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ message: "File key is required" });
    }
    const fileUrl = await getFile(key);
    return res.status(200).json({ status: "success", fileUrl });
  } catch (error) {
    console.error("Error generating presigned GET URL:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ message: "File key is required" });
    }

    const deleteData = await deleteFile(key);

    // Step 2: Delete file metadata from MongoDB
    const dbDeleteResult = await File.findOneAndDelete({ key });

    // if (!dbDeleteResult) {
    //   return res.status(404).json({ message: "File not found in database" });
    // }

    // if (deleteData) {
    //   res.status(204).json({ message: "File Deleted Successfully in S3" });
    // }

    return res
      .status(200)
      .json({ message: "File deleted successfully from S3 and database" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ suucess: "false", message: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({ message: "File key is required" });
    }

    const data = await downloadFile(key);

    res.setHeader(
        "Content-Type",
        data.ContentType || "application/octet-stream"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
  

    // Pipe the file stream to the response
    data.Body.pipe(res).on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ message: "Error streaming file" });
    });
  } catch (err) {
    console.log("errorrrrrrrrr", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET all uploaded image metadata
// exports.getFile = async (req, res) => {
//     try {
//       const files = await File.find({});
//       const fileUrls = await Promise.all(
//         files.map(async (file) => {
//           const url = await getFile(file.key); // You must have this helper
//           return {
//             key: file.key,
//             url,
//           };
//         })
//       );
//       res.status(201).json({success:true,fileUrls});
//     } catch (err) {
//       console.error("Error fetching files:", err.message);
//       res.status(500).json({ error: "Could not fetch files" });
//     }
//   };
