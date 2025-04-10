const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv").config();
const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
});

exports.getFile = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3, command);
  return url;
};

exports.uploadFile = async (key, fileType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    fileType,
  });
  const url = await getSignedUrl(s3, command);
  return url;
};

exports.deleteFile = async (key) => {

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  const result = await s3.send(command);
  return result; // important!
  
};
