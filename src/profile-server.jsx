import "console.jsx";
import "nodejs.jsx/*.jsx";

class _Main {

	static function homeDir() : string {
		if (process.env["HOME"]) {
			return process.env["HOME"];
		}
		return process.env["USERPROFILE"];
	}

	static function mkdir(dir : string) : void {
		try {
			fs.mkdirSync(dir);
		} catch (e : Error) {
			// FIXME ignore EEXIST only, but how?
		}
	}

	static function finish(response : ServerResponse, uri : string, status : number, content_type : Nullable.<string>, content : string, encoding : string = "utf-8") : void {
		var len = content.length;

		var headers = {
			"Cache-Control" : "no-cache",
			"Content-Length" : len.toString()
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
		response.write(content, encoding);
		response.end();
	}

	static function serveFile(response : ServerResponse, uri : string, filename : string) : void {
		try {
			if (fs.statSync(filename).isDirectory()) {
				filename += '/index.html';
			}
		} catch (e : Error) {
			_Main.finish(response, uri, 404, "text/plain", "404 Not Found\n");
			return;
		}

		fs.readFile(filename, "binary", function(err, content) {
			if(err) {
				_Main.finish(response, uri, 500, "text/plain", err.message + "\n");
				return;
			}

			_Main.finish(response, uri, 200, null, content, "binary");
		});
	}

	static function saveProfile(request : ServerRequest, response : ServerResponse, uri : string, outputFolder : string) : void {
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST,PUT,GET,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type,*");
		if (request.method != "POST" || request.method == "PUT") {
			response.end();
			return;
		}

		function twodigits(n : number) : string {
			var s = n.toString();
			while (s.length < 2) {
				s = "0" + s;
			}
			return s;
		}
		function YYYYmmddHHMMSS() : string {
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
			body += data as string;
		});
		request.on("end", function () {
			// parse as JSON
			try {
				var json = JSON.parse(body);
			} catch (e : Error) {
				_Main.finish(response, uri, 400, "text/plain", "POST data is corrupt: " + e.toString() + "\n");
				return;
			}
			// save
			var id = YYYYmmddHHMMSS();

			fs.writeFileSync(path.join(outputFolder, id + '.json'), JSON.stringify(json));

			console.info("[I] saved profile at http://" + request.headers["host"] + "/?" + id);

			response.setHeader("Location", "http://" + request.headers["host"] + "/?" + id);
			_Main.finish(response, uri, 200, "text/plain", "saved profile at http://" + request.headers["host"] + "/?" + id);
		});
	}

	static function listProfileResults(request : ServerRequest, response : ServerResponse, uri : string, outputFolder : string) : void {
		var results = new string[];
		if (fs.existsSync(outputFolder)) {
			results = fs.readdirSync(outputFolder).filter(function (file) {
				return /\d{4}-\d{2}-\d{2}-\d{6}/.test(file);
			}).map(function (file) {
				return file.replace(/\.\w+$/, "");
			}).sort(function (a, b) {
				return b.localeCompare(a);
			});
		}
		_Main.finish(response, uri, 200, "application/json", JSON.stringify(results));
	}

	static function main(args : string[]) : void {
		var port = args[0] ?: "2012";
		var outputFolder;
		if (args[1]) {
			outputFolder = args[1];
		} else {
			var home = _Main.homeDir();
			_Main.mkdir(path.join(home, '.jsx'));
			_Main.mkdir(path.join(home, '.jsx', 'profile'));
			outputFolder = path.join(home, '.jsx', 'profile');
		}
		console.log("Profile results are stored in: " + outputFolder);

		var httpd = http.createServer(function(request, response) {
			var uri = url.parse(request.url).pathname;

			// profiler stuff
			var filepath;
			if (/^\/post-profile\/?$/.test(uri)) {
				return _Main.saveProfile(request, response, uri, outputFolder);
			}
			else if (/^\/\.profile\//.test(uri)) {
				var basename = uri.substring("/.profile/".length);
				if (basename == "results.json") {
					return _Main.listProfileResults(request, response, uri, outputFolder);
				}
				filepath = path.resolve(outputFolder, basename);
			}
			else {
				filepath = path.resolve(node.__dirname, '..', 'etc', 'profiler', uri.slice(1));
			}
			_Main.serveFile(response, uri, filepath);
		});
		httpd.listen(Number.parseInt(port, 10));

		console.log("Open http://localhost:" + port + "/");
	}

}
