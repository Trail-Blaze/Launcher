let status_ = document.getElementById("reviewStatus");

amIbanned();

if (!fs.existsSync(path.join(userAssetsDir, "\\InstallList.json"))) {
  status_.innerHTML = "WELCOME TO VOLTAIC! HAVE FUN!<br/><p>LIVE-BUILD_9<br/><code>[2022-07-25T02:57:05.158Z]</code></p>";
  setTimeout(()=>{window.location.replace("firststartup.html")}, 4500);
} else {
  status_.innerText = "ROUTING..."
  setTimeout(()=>{window.location.replace("index.html")}, 4500);
}
