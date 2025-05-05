const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

// Simple HTTP server to serve the Telegram Mini App
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  // Default to index.html
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  // Check if the file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If not found, try to serve from the parent directory
      const parentPath = path.join(__dirname, "..", req.url);
      fs.stat(parentPath, (err2, stats2) => {
        if (err2 || !stats2.isFile()) {
          // If not found in parent either, return 404
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }

        // Serve the file from the parent directory
        serveFile(parentPath, res);
      });
    } else {
      // Serve the file
      serveFile(filePath, res);
    }
  });
});

// Helper function to serve files
function serveFile(filePath, res) {
  const extname = path.extname(filePath);
  let contentType = "text/html";

  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }

  // Read and serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Telegram Mini App server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop`);
});
