const express = require("express");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const port = process.env.PORT;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: "Error: rate limit exceeded",
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);

  const logRequests = (req, res, next) => {
    console.log(`Request received for ${req.path} at ${new Date()} by user ${req.ip}`);
    next();
  };

  app.use(logRequests);

  // import endpoint functions
  const matchRegex = require("./apis/strings/regex.js");
  const progressBar = require("./apis/canvas/progressBar.js");
  const encodeDecode = require("./apis/strings/encodeDecode.js");
  const replaceText = require("./apis/strings/replace.js");
  const permissionCalc = require("./apis/discord_specific/permissionCalc.js");
  const checkHexColor = require("./apis/strings/checkHexColor.js");
  const health = require("./apis/deployment/health.js");

  //deployment
  app.get("/health-check", health);

  //canvas
  app.get("/progress-bar", progressBar);

  //strings
  app.post("/regex", matchRegex);
  app.post("/encode-decode", encodeDecode);
  app.post("/replace", replaceText);
  app.get("/check-hex", checkHexColor);

  //discord_specific
  app.get("/permission-calc", permissionCalc);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init();
