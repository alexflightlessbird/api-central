const express = require("express");
require("dotenv").config();
const port = process.env.PORT;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    if (req.path === "/health-check" || req.path.startsWith("/auth/")) {
      return next();
    }
    //prettier-ignore
    console.log(`Request received for ${req.path} at ${new Date()}`);
    next();
  });

  // import middleware
  const authorizationMiddleware = require("./middleware/authorizationMiddleware.js");

  // import endpoints
  // deployment endpoints
  const health = require("./apis/deployment/health.js");
  // canvas endpoints
  const progressBar = require("./apis/canvas/progressBar.js");
  const qrCode = require("./apis/canvas/qrCode.js");
  // colors endpoints
  const checkHexColor = require("./apis/colors/checkHexColor.js");
  const randomHex = require("./apis/colors/randomHex.js");
  // strings endpoints
  const matchRegex = require("./apis/strings/regex.js");
  const encodeDecode = require("./apis/strings/encodeDecode.js");
  const replaceText = require("./apis/strings/replace.js");
  const arraySort = require("./apis/strings/arraySort.js");
  // discord_specific endpoints
  const permissionCalc = require("./apis/discord_specific/permissionCalc.js");

  // run endpoints
  // deployment endpoints
  app.get("/health-check", health);
  // canvas endpoints
  app.get("/progress-bar", progressBar);
  app.get("/qrcode", qrCode);
  // colors endpoints
  app.get("/check-hex", checkHexColor);
  app.get("/random-hex", randomHex);
  // strings endpoints
  app.post("/regex", matchRegex);
  app.post("/encode-decode", encodeDecode);
  app.post("/replace", replaceText);
  app.post("/array-sort", arraySort);
  // discord_specific endpoints
  app.get("/permission-calc", permissionCalc);

  app.use(function (req, res, next) {
    if (!app.path(req, res)) {
      return res.status(404).json({ error: "This endpoint doesn't exist" });
    } else {
      next();
    }
  });

  // app and port logging
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init();
