const express = require("express");
const { dbConnect } = require("./dbconnect");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
const cors=require("cors")
app.use(cors());
const uploadRouter = require("./routes/upload");
dbConnect();
app.use("/", uploadRouter);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
