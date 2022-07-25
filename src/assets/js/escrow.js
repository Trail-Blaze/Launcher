let status_ = document.getElementById("reviewStatus");

if (!fs.existsSync(path.join(userAssetsDir, "\\InstallList.json"))) {
  status_.innerHTML = "WELCOME TO VOLTAIC! HAVE FUN!<br/><p>LIVE-BUILD_9<br/><code>[2022-05-14T20:22:40.770Z]</code></p>";
  setTimeout(window.location.replace("firststartup.html"), 5000);
} else {
  status_.innerText = "ROUTING..."
  window.location.replace("index.html");
}
