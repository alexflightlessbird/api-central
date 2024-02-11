const express = require("express");
const rate = require("express-rate-limit");
require("dotenv").config();
const port = process.env.PORT;
const lim = process.env.RATE_LIMIT;
const timeLim = process.env.RATE_LIMIT_TIME;

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const initialLimiter = rate.rateLimit({
    windowMs: timeLim * 60 * 1000,
    limit: lim,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: (req, res) => {
      const retryAfterSeconds =
        Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
      return res.status(429).json({
        error: `Too many requests from this IP, please try again later.`,
        retryAfter: retryAfterSeconds,
      });
    },
  });

  app.use((req, res, next) => {
    if (req.path === "/health-check") {
      return next();
    }

    //prettier-ignore
    console.log(`Request received for ${req.path} at ${new Date()} by user ${req.ip}`);
    initialLimiter(req, res, next);
  });

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
