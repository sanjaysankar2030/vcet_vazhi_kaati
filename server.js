const path = require("path");
const fs = require("fs");
const http = require("http");

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_DIR = path.resolve(__dirname, "frontend");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

function resolveSafePath(reqUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(reqUrl.split("?")[0]);
  } catch {
    return null;
  }

  // Default to main HTML entry file
  if (pathname === "/" || pathname === "" || pathname === "/index.html") {
    pathname = "/VCET_Navigation_F1_F2_Updated.html";
  }

  const resolvedPath = path.resolve(FRONTEND_DIR, "." + pathname);
  const relative = path.relative(FRONTEND_DIR, resolvedPath);

  // Prevent directory traversal outside frontend
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return resolvedPath;
}

if (typeof Bun !== "undefined") {
  // Bun server
  const server = Bun.serve({
    port: PORT,
    async fetch(req) {
      const url = new URL(req.url);
      const filePath = resolveSafePath(url.pathname);

      if (!filePath) {
        return new Response("403 Forbidden", { status: 403 });
      }

      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        return new Response("404 Not Found", { status: 404 });
      }

      return new Response(file);
    },
    error(err) {
      console.error("Server error:", err);
      return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
    },
  });

  console.log(`Server running at: http://localhost:${server.port}`);
} else {
  // Node.js fallback server
  const server = http.createServer(async (req, res) => {
    const filePath = resolveSafePath(req.url || "/");

    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("403 Forbidden");
      return;
    }

    try {
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        console.error("Server error:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}
