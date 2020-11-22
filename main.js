"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mime = require("mime");

const HTTP_CODE_200 = 200;
const HTTP_CODE_403 = 403;
const HTTP_CODE_404 = 404;

const baseLocation = "./public";

const PORT = 8686;

const server = http.createServer(function (req, res) {
  const pathName = path.normalize(baseLocation + req.url);

  console.log(`pathname=${pathName}`);

  fs.stat(pathName, function (err, stats) {
    if (err) {
      res.writeHead(HTTP_CODE_404);
      res.end();
    } else {
      if (stats.isFile()) {
        const fileType = mime.getType(pathName);

        res.setHeader("Content-Type", fileType);

        let file = fs.createReadStream(pathName);

        file.on("open", function () {
          res.writeHead(HTTP_CODE_200);
          file.pipe(res);
        });

        file.on("error", function (err) {
          console.log(err);
          res.statusCode = HTTP_CODE_FORBIDDEN;
          res.write("no file");
          res.end();
        });
      } else {
        res.writeHead(HTTP_CODE_403);
        res.end();
      }
    }
  });
});
server.listen(PORT);
console.log(`static server running at ${PORT}`);
