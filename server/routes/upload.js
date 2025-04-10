const express = require("express");
const { uploadFile, getFile, deleteFile } = require("../controllers/upload");
const router = express.Router();

router.post("/upload", uploadFile);

router.get("/:key",getFile)

router.delete("/:key",deleteFile)

module.exports = router;
