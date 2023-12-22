const express = require("express");
const port = 3000;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const matchRegex = require("./apis/regex.js");

  app.post("/regex", matchRegex);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init();
