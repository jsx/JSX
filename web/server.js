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

	console.log("%s %s %s %s (%s bytes)", (new Date()), status, headers["Content-Type"] || "(unknown type)", uri, len);

	response.writeHead(status, headers);
	response.write(content, "binary");
	response.end();
}

function serveFile(response, uri, filename) {
	path.exists(filename, function(exists) {
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

function saveProfile(request, response) {
	var profileDir = "web/.profile";

	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type,*");
	if (request.method != "POST") {
		response.end();
		return;
	}

	function twodigits(s) {
		s = s.toString();
		while (s.length < 2) {
			s = "0" + s;
		}
		return s;
	}
	function YYYYmmddHHMMSS() {
		var d = new Date();
		return d.getFullYear() + '-' +
			twodigits(d.getMonth() + 1) + '-' +
			twodigits(d.getDate()) + '-' +
			twodigits(d.getHours()) +
			twodigits(d.getMinutes()) +
			twodigits(d.getSeconds());
	}

	var body = "";
	// accumulate all data
	request.on("data", function (data) {
		body += data;
	});
	request.on("end", function () {
		// parse as JSON
		try {
			var json = JSON.parse(body);
		} catch (e) {
			response.writeHead(400, "Bad Request", {
				"Content-Type": "text/plain"
			});
			response.write("POST data is corrupt: " + e.toString());
			response.end();
			return;
		}
		// save
		try {
			fs.mkdirSync(profileDir);
		} catch (e) {
			// FIXME ignore EEXIST only, but how?
		}
		var id = YYYYmmddHHMMSS();

		fs.writeFileSync(profileDir + "/" + id + ".txt",
				JSON.stringify(json));
		// send response
		response.writeHead(200, "OK", {
			"Content-Type": "text/plain"
		});
		response.write("saved profile at http://" + request.headers.host + "/web/profiler.html?" + id);
		response.end();

		var resultList = fs.readdirSync(profileDir).filter(function (d) {
			return /^[\d-]+\.txt$/.test(d);
		}).map(function(d) {
			return d.replace(/\.txt$/, "");
		}).sort().reverse();
		fs.writeFileSync(profileDir + "/results.json",
				JSON.stringify(resultList));

		console.info("[I] saved profile at http://" + request.headers.host + "/web/profiler.html?" + id);
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

		if (uri.match(/^\/post-profile\/?$/) != null) {
			return saveProfile(request, response);
		}

		var filename = path.join(process.cwd(), uri);

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
