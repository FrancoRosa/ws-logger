// Import the socket.io-client and fs modules
const io = require("socket.io-client");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Set the WebSocket server URL and port
const SERVER_URL = "ws://localhost:10000"; // Adjust if your server has a different IP/hostname

// Set the file path for wslogger.csv on the desktop
const desktopPath = path.join(os.homedir(), "Desktop", "wslogger.csv");

// Connect to the WebSocket server
const socket = io(SERVER_URL);

// Ensure the CSV file has a header if it doesn't exist
if (!fs.existsSync(desktopPath)) {
  fs.writeFileSync(desktopPath, "Timestamp,Message\n");
}

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to WebSocket server on port 1000.");
});

// Listen for all broadcasted messages and log them
socket.on("broadcast", (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp},"${message}"\n`;
  
  // Append the message to wslogger.csv
  fs.appendFile(desktopPath, logEntry, (err) => {
    if (err) {
      console.error("Error writing to wslogger.csv:", err);
    } else {
      console.log("Logged message:", message);
    }
  });
});

// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server.");
});
