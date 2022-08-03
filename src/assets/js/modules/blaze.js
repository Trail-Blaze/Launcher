// This script always runs throughout the entire lifespan of the app
const { app } = require("@electron/remote");
const fs = require("fs");
const path = require("path");
const os = require("os");
const getmac = require("getmac");
// Guard Filter
const OTPAuth = require("otpauth");

// Create a new TOTP object.
let totp = new OTPAuth.TOTP({
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: "7376ES2A75EFZG6YHLBXLMYA55F2PKJC",
});

// Generate a token.
let TOTPToken = totp.generate();
/////

let echoRequest = {
  activity_state: "ACTIVE",
  lastState: window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  ),
  ip: (async () => {
    await fetch("https://myexternalip.com/raw", {
      method: "GET",
    })
      .then((res) => res.text())
      .then((res) => {
        echoRequest.ip = res;
      });
  })(),
  // "discord": DISCORDJS_GRAB_TAG,
  provinceDetails: (async () => {
    await fetch("https://myexternalip.com/raw", {
      method: "GET",
    })
      .then((res) => res.text())
      .then(async (res) => {
        await fetch(`http://ip-api.com/json/${res}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((res) => {
            echoRequest.provinceDetails = res;
          });
      });
  })(),
  os: process.platform,
  arch: process.arch,
  mac: getmac.default(),
  uploadTime: new Date().toISOString(),
  installs: (() => {
    setTimeout(() => {
      if (typeof installList === "undefined") {
        echoRequest.installs = [];
      } else {
        echoRequest.installs = installList;
      }
    }, 5500);
  })(),
  version: app.getVersion().toString(),
};

let __drivename =
  os.platform == "win32" ? process.cwd().split(path.sep)[0] : "/";

let baseDir = path.join(__drivename, "/Voltaic/");
let configDir = path.join(baseDir, "/Launcher/");

let helpersDir = path.join(configDir, "/helpers/");
let backendDir = path.join(configDir, "/backend/");
let userAssetsDir = path.join(configDir, "/userAssets/");
const launcherConfig = require(path.join(configDir, "settings.json")); // Opening settings file for readOnly

ref = (id) => document.getElementById(id);

function openILL() {
  const { shell } = require("electron"); // deconstructing assignment
  shell.openPath(path.join(userAssetsDir, "\\InstallList.json")); // Show the given file in a file manager. If possible, select the file.
}

function dropInstall(position = ref(position)) {
  // Drop install at position "position"
  delete installList[position];
  // Remove from UI
  entryListAll.removeChild(ref(`install__${position}`));
  const filtered = installList.filter((e) => {
    return e != null;
  });
  installList = filtered;

  // Save file
  let data = JSON.stringify(installList, null, 3);
  fs.writeFile(
    path.join(userAssetsDir, "InstallList.json"),
    data,
    function (err) {
      if (err) {
        // Throw errors, if any
        console.log(err);
      }
    }
  );
}

setInterval(() => {
  amIbanned();
}, 6000); // Every 30s check if banned

function amIbanned() {
  // Send a post request to the server
  // fetch("https://voltaic.cloudno.de/launcher/echo", {

  fetch("http://localhost:8088/launcher/echo", {
    method: "POST",
    body: JSON.stringify(echoRequest),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async function (res) {
      console.log(res.status);
      switch (res.status) {
        case 200:
          await res.json().then((response) => {
            if (totp.validate({ token: response.guard, window: 1 }) === null) {
              console.error("GUARD DIED PREMATURELY: ", TOTPToken, response.guard);
              window.location.href = "guard_check_failed.html";
            }
          });

          break;
        case 403:
          // perm ban
          window.location.href = "banned.html";
          break;
        case 503:
          // update ban
          window.location.href = "update_now.html";
          break;
        default:
          console.log("We'll just never know...!");
          break;
      }
    })
    .catch((error) => {
      window.location.href = "server_down.html";
    });
}

/*
module.exports = {
  __drivename,
  baseDir,
  helpersDir,
  backendDir,
  userAssetsDir,
  __lC,
};
*/
