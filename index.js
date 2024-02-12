const express = require("express");
//const rate = require("express-rate-limit");
require("dotenv").config();
const port = process.env.PORT;
//const lim = process.env.RATE_LIMIT;
//const timeLim = process.env.RATE_LIMIT_TIME;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /*
  // rate limiting - TEMPORARILY DISABLED - PROXY ISSUE
  const initialLimiter = rate.rateLimit({
    windowMs: timeLim * 60 * 1000,
    limit: lim,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: (req, res) => {
      //prettier-ignore
      const retryAfterSeconds = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
      //prettier-ignore
      console.log(`User ${req.ip} was rate limited for another ${retryAfterSeconds} seconds.`);
      return res.status(429).json({
        error: `Too many requests from this IP, please try again later.`,
        retryAfter: retryAfterSeconds,
      });
    },
  });
  */

  app.use((req, res, next) => {
    if (req.path === "/health-check") {
      return next();
    }
    //prettier-ignore
    console.log(`Request received for ${req.path} at ${new Date()}`); //removed:  by user ${req.ip}
    initialLimiter(req, res, next);
  });

  // import endpoints
  // deployment endpoints
  const health = require("./apis/deployment/health.js");
  // canvas endpoints
  const progressBar = require("./apis/canvas/progressBar.js");
  // strings endpoints
  const matchRegex = require("./apis/strings/regex.js");
  const encodeDecode = require("./apis/strings/encodeDecode.js");
  const replaceText = require("./apis/strings/replace.js");
  const checkHexColor = require("./apis/strings/checkHexColor.js");
  // discord_specific endpoints
  const permissionCalc = require("./apis/discord_specific/permissionCalc.js");

  // run endpoints
  // deployment endpoints
  app.get("/health-check", health);
  // canvas endpoints
  app.get("/progress-bar", progressBar);
  // strings endpoints
  app.post("/regex", matchRegex);
  app.post("/encode-decode", encodeDecode);
  app.post("/replace", replaceText);
  app.get("/check-hex", checkHexColor);
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
