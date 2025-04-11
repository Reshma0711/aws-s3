const express = require("express");
const {
  uploadFile,
  getFile,
  deleteFile,
  downloadFile,
} = require("../controllers/upload");
const router = express.Router();

router.post("/upload", uploadFile);

router.get("/:key", getFile);

router.delete("/:key", deleteFile);

router.get("/download/:key", downloadFile);

module.exports = router;
