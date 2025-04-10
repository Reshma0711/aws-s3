const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  mimeType: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', FileSchema);
