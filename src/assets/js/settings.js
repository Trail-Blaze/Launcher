const os = require("os");
const path = require("path");
const fs = require("fs");
let __drivename =
  os.platform == "win32" ? process.cwd().split(path.sep)[0] : "/";
let baseDir = path.join(__drivename, "/Voltaic/");
const configDir = path.join(baseDir, "/Launcher/");
let launcherConfig;

// All the checkboxes in the settings window

const enableTracking = document.getElementById("enableTracking");
const darkTheme = document.getElementById("darkTheme");
const lightTheme = document.getElementById("lightTheme");
const custom_ = document.getElementById("custom_");

const errmsg = document.getElementById("errmsg");
// const sIP = document.getElementById("server-ip");

lightTheme.addEventListener("change", function () {
  if (this.checked) {
    // Checkbox is checked..
    darkTheme.checked = false;
    custom_.checked = false;
  } else {
    // Checkbox is not checked..
    darkTheme.checked = true;
  }
  saveSettings();
  setTimeout(() => {
    window.location.reload();
  }, 950);
});

darkTheme.addEventListener("change", function () {
  if (this.checked) {
    // Checkbox is checked..
    lightTheme.checked = false;
    custom_.checked = false;
  } else {
    // Checkbox is not checked..
    custom_.checked = true;
  }
  saveSettings();
  setTimeout(() => {
    window.location.reload();
  }, 950);
});

custom_.addEventListener("change", function () {
  if (this.checked) {
    // Checkbox is checked..
    darkTheme.checked = false;
    lightTheme.checked = false;
  } else {
    // Checkbox is not checked..
    darkTheme.checked = true;
  }
  saveSettings();
  setTimeout(() => {
    window.location.reload();
  }, 950);
});

//TODO FSACCESS NAVJSON. IF NOT FOUND, CREATE FILE

(function createConfig() {
  fs.access(baseDir, function (error) {
    if (error) {
      fs.mkdirSync(baseDir);
      console.log("Created New Base Dir!");
      createRepoDir();
    }
    fs.access(configDir, function (error) {
      if (error) {
        fs.mkdirSync(configDir);
        console.log("Created New Voltaic/Launcher Dir!");

        fetch("https://voltaicfn.github.io/res/config/settings.json")
          .then((response) => response.json())
          .then((data) => {
            launcherConfig = data;
            let navjson = JSON.stringify(launcherConfig, null, 2);
            fs.writeFileSync(
              path.join(configDir, "settings.json"),
              navjson,
              "utf-8"
            );
            createConfig();
          })
          .catch((err) => console.error(err));
      }
      if (fs.existsSync(path.join(configDir, "settings.json"))) {
        launcherConfig = require(path.join(configDir, "settings.json"));
        restoreSettings();
      }
      if (!fs.existsSync(path.join(configDir, "settings.json"))) {
        fetch("https://voltaicfn.github.io/res/config/settings.json")
          .then((response) => response.json())
          .then((data) => {
            launcherConfig = data;
            let navjson = JSON.stringify(launcherConfig, null, 2);
            fs.writeFileSync(
              path.join(configDir, "settings.json"),
              navjson,
              "utf-8"
            );
            launcherConfig = require(path.join(configDir, "settings.json"));
            restoreSettings();
          })
          .catch((err) => console.error(err));
      }
    });
  });
})();

function restoreSettings() {
  // Restore all of the settings in the window
  console.log(launcherConfig);
  document.body.classList.remove("pointer-events-none");

  if (launcherConfig.tracking === true) {
    enableTracking.checked = true;
  }

  if (launcherConfig.theme === "light") {
    lightTheme.checked = true;
  } else if (launcherConfig.theme === "dark") {
    darkTheme.checked = true;
  } else if (launcherConfig.theme === "custom") {
    custom_.checked = true;
  } else {
    errmsg.classList.remove("hidden");
  }
}

function saveSettings() {
  if (fs.existsSync(path.join(configDir, "settings.json"))) {
    // Could've used case statments for this but I totally forgot; if anyone would like to fix this I wouldn't mind a bit
    // Go right ahead! :)
    // baseDir, used in some scripts - since it's getting ridiculous now to include the above
    // imports in **EVERY SINGLE ONE** OF THEM now...
    launcherConfig.base = configDir;
    // platinum

    if (enableTracking.checked === true) {
      launcherConfig.tracking = true;
    } else {
      launcherConfig.tracking = false;
    }

    if (lightTheme.checked === false) {
      launcherConfig.theme = "dark";
    }
    if (lightTheme.checked) {
      launcherConfig.theme = "light";
    }

    if (custom_.checked === true) {
      launcherConfig.theme = "custom";
    }

    //  launcherConfig.server_ip = sIP.value;

    let navjson = JSON.stringify(launcherConfig, null, 2);
    fs.writeFileSync(path.join(configDir, "settings.json"), navjson, "utf-8");
  }
}
