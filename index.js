const express = require("express");
require("dotenv").config();
const port = process.env.PORT;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const matchRegex = require("./apis/regex.js");
  const progressBar = require("./apis/progressBar.js");
  const encodeDecode = require("./apis/encodeDecode.js");

  app.post("/regex", matchRegex);
  app.get("/progress-bar", progressBar);
  app.post("/encode-decode", encodeDecode);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init();
