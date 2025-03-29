const btn = document.querySelector("#launch-b");

btn.addEventListener("click", () => {
  console.log("click btn in AppA");
  launchAppB();
});

function launchAppB() {
  // Log the actual directory to see what __dirname resolves to
  console.log("Current directory:", __dirname);

  // Try a relative path approach instead
  const appBExePath = path.join(__dirname, "..", "AppB", "dist", "mac-arm64", "appb.app", "Contents", "MacOS", "appb");

  console.log("Attempting to launch:", appBExePath);

  const AppBArgs = ["--remote-debugging-port=9223"];

  const child = spawn(appBExePath, [AppBArgs], {
    stdio: "inherit",
  });

  child.on("close", (code) => {
    console.log(`AppB exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.error("Failed to start AppB:", err);
  });
}