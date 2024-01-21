const express = require("express");
require("dotenv").config();
const port = process.env.PORT;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const matchRegex = require("./apis/strings/regex.js");
  const progressBar = require("./apis/canvas/progressBar.js");
  const encodeDecode = require("./apis/strings/encodeDecode.js");
  const replaceText = require("./apis/strings/replace.js");

  //canvas
  app.get("/progress-bar", progressBar);

  //strings
  app.post("/regex", matchRegex);
  app.post("/encode-decode", encodeDecode);
  app.post("/replace", replaceText);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init();
