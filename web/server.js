/***
 * JSX development server started by `make server`
 * includes JSX compiler for web (try/build/jsx-compiler.js).
 *
 */

"use strict";

var http = require("http"),
	url = require("url"),
	path = require("path"),
	child_process = require("child_process"),
	fs = require("fs");

// version check
try {
	var nodeVersionParts = process.version.match(/(\d+)/g);
	var nodeVersion = (+nodeVersionParts[0]) + (nodeVersionParts[1] / 1000) + (nodeVersionParts[2]/ (1000*1000));
	if(nodeVersion < 0.006) {
		throw new Error("Requires nodejs v0.6.0 or later");
	}
}
catch(e) {
	console.warn("Unexpected node.js version (>=0.6.0 required), because: %s", e.toString());
}

function finish(response, uri, status, content_type, content) {
	var len = content.length;

	var headers = {
		"Cache-Control" : "no-cache",
		"Content-Length" : len
	};
	if(content_type) {
		headers["Content-Type"] = content_type;
	}
	else if(/\.jsx$/.test(uri)) {
		headers["Content-Type"] = "text/plain";
	}
	else if(/\.js$/.test(uri)) {
		headers["Content-Type"] = "application/javascript";
	}
	else if(/\.css$/.test(uri)) {
		headers["Content-Type"] = "text/css";
	}
	else if(/\.png$/.test(uri)) {
		headers["Content-Type"] = "image/png";
	}
	else if(/\.jpe?g$/.test(uri)) {
		headers["Content-Type"] = "image/jpeg";
	}
	else if(/\//.test(uri) || /\.html$/.test(uri)) {
		headers["Content-Type"] = "text/html";
	}

	console.log("%s %s %s %s (%s bytes)", (new Date()).toISOString(), status, headers["Content-Type"] || "(unknown type)", uri, len);

	response.writeHead(status, headers);
	response.write(content, "binary");
	response.end();
}

function serveFile(response, uri, filename) {
	fs.exists(filename, function(exists) {
		if(!exists) {
			finish(response, uri, 404, "text/plain", "404 Not Found\n");
			return;
		}

		if (fs.statSync(filename).isDirectory()) {
			filename += '/index.html';
		}

		fs.readFile(filename, "binary", function(err, content) {
			if(err) {
				finish(response, uri, 500, "text/plain", err + "\n");
				return;
			}

			finish(response, uri, 200, undefined, content);
		});
	});
}

function main(args) {
	var port = args[0] || "5000";

	var httpd = http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname;

		if(uri === "/") {
			response.writeHead(301, {
				Location: "try/"
			});
			response.end();
			return;
		}

		if(/(?:\.html|\/)$/.test(filename)) {
			child_process.execFile(
				"perl", ["web/build.pl"],
				function(error, stdout, stderr) {
					if(error) {
						finish(response, uri, 500, "text/plain", error + "\n");
						return;
					}
					serveFile(response, uri, filename);
			});
		}
		else {
			serveFile(response, uri, filename);
		}
	});
	httpd.listen(parseInt(port, 10));

	console.log("Open http://localhost:" + port + "/");
}

main(process.argv.slice(2));
