const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./src/routes"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((e) => {
    console.log("Connected to MongoDB...");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running...");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
