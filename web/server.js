"use strict";
var http = require("http"),
	url = require("url"),
	path = require("path"),
	child_process = require("child_process"),
	fs = require("fs");

function finish(response, uri, status, content_type, content) {
	var len = Buffer.byteLength(content);

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
	else if(/\//.test(uri) || /\.html$/.test(uri)) {
		headers["Content-Type"] = "text/html";
	}

	console.log("%s %s %s (%s bytes)", status, headers["Content-Type"] || "(unknown type)", uri, len);

	response.writeHead(status, headers);
	response.write(content, "binary");
	response.end();
}

function serveFile(response, uri, filename) {
	fs.readFile(filename, "binary", function(err, file) {
		if(err) {
			finish(response, uri, 500, "text/plain", err + "\n");
			return;
		}

		finish(response, uri, 200, undefined, file);
	});
}

function main(args) {
	var port = args[0] || "5000";

	http.createServer(function(request, response) {
		var uri = url.parse(request.url).pathname;
		var filename = path.join(process.cwd(), uri);

		path.exists(filename, function(exists) {
			if(!exists) {
				finish(response, uri, 404, "text/plain", "404 Not Found\n");
				return;
			}

			if(uri === "/") {
				filename += "web/index.html";
			}

			if (fs.statSync(filename).isDirectory()) {
				filename += '/index.html';
			}

			if(/\.htm$/.test(filename)) {
				child_process.execFile(
					"perl", ["web/build.pl"],
					function(error, stdout, stderr) {
						if(error) {
							finish(response, uri, 500, error + "\n");
							return;
						}
						serveFile(response, uri, filename);
				});;
			}
			else {
				serveFile(response, uri, filename);
			}
		});
	}).listen(parseInt(port, 10));

	console.log("Open http://localhost:" + port + "/");
}

main(process.argv.slice(2));
