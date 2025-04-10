const { getFile, uploadFile, deleteFile } = require("../utils/upload");
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
