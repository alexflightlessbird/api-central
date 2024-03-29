const express = require("express");
require("dotenv").config();
const port = process.env.PORT;
const lockedPath = process.env.LOCKED_PATH; // endpoints with this path are available only for internal use

const swaggerui = require("swagger-ui-express");
const YAML = require("yamljs");

async function Init() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    if (
      req.path === "/health-check" ||
      req.path === "/" ||
      req.path.startsWith("/docs") ||
      req.path.startsWith(`${lockedPath}/docs`)
    ) {
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
  const faceClaim = require("./apis/canvas/faceClaim.js");
  // colors endpoints
  const checkHexColor = require("./apis/colors/checkHexColor.js");
  const randomHex = require("./apis/colors/randomHex.js");
  const avgColorFromImageUrl = require("./apis/colors/avgColorFromImageUrl.js");
  // strings endpoints
  const matchRegex = require("./apis/strings/regex.js");
  const encodeDecode = require("./apis/strings/encodeDecode.js");
  const replaceText = require("./apis/strings/replace.js");
  const arraySort = require("./apis/strings/arraySort.js");
  // discord_specific endpoints
  const idToTime = require("./apis/discord_specific/idToUnix.js");
  const permissionCalc = require("./apis/discord_specific/permissionCalc.js");
  const permissionComp = require("./apis/discord_specific/permissionComp.js");
  const permissionFullComp = require("./apis/discord_specific/permissionFullComp.js");

  // run endpoints
  // deployment endpoints
  app.get("/health-check", health);
  // canvas endpoints
  app.get("/progress-bar", progressBar);
  app.get("/qrcode", qrCode);
  app.get(`${lockedPath}/face-claim`, faceClaim);
  // colors endpoints
  app.get("/check-hex", checkHexColor);
  app.get("/random-hex", randomHex);
  app.get("/avg-color", avgColorFromImageUrl);
  // strings endpoints
  app.post("/regex", matchRegex);
  app.post("/encode-decode", encodeDecode);
  app.post("/replace", replaceText);
  app.post("/array-sort", arraySort);
  // discord_specific endpoints
  app.get("/id-to-time", idToTime);
  app.get("/permission-calc", permissionCalc);
  app.get("/permission-comp", permissionComp);
  app.get("/permission-comp/full", permissionFullComp);

  app.get("/", (req, res) => {
    res.redirect("/docs");
  });
  const swaggerDoc = YAML.load("./config/docs.yaml");
  app.use("/docs", swaggerui.serve, swaggerui.setup(swaggerDoc));

  app.use(function (req, res, next) {
    if (!app.path(req, res)) {
      return res.status(404).json({
        error:
          "This endpoint doesn't exist. Please check https://www.api-central.xyz/docs for currently available endpoints.",
      });
    } else {
      next();
    }
  });

  // app and port logging
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

Init().catch(console.error);
