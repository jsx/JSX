(function () {
	"use strict";

	var Profiler = $__jsx_profiler;

	var getTime;
	if (typeof(performance) != "undefined" && typeof(performance.now) == "function") {
		getTime  = function () { return performance.now() };
	}
	else {
		getTime  = function () { return Date.now() };
	}

	var stack = [ {
		$name: "<<root>>",
		$cur_exclusive: getTime()
	} ];

	Profiler.enter = function (name) {
		var t = getTime();
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive -= t;
		var callee = caller[name];
		if (callee) {
			callee.$cur_inclusive = t;
			callee.$cur_exclusive = t;
		} else {
			callee = caller[name] = {
				$name: name,
				$cur_inclusive: t,
				$cur_exclusive: t,
				$inclusive: 0,
				$exclusive: 0,
				$count: 0
			};
		}
		stack.push(callee);
		return stack.length;
	};

	Profiler.exit = function (retval) {
		var t = getTime();
		var callee = stack.pop();
		++callee.$count;
		callee.$exclusive += t - callee.$cur_exclusive;
		callee.$inclusive += t - callee.$cur_inclusive;
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive += t;
		return retval;
	};

	Profiler.resume = function (context) {
		while (context < stack.length) {
			Profiler.exit();
		}
	};

	Profiler.getResults = function () {
		return stack[0];
	};

	Profiler.postResults = function (url, cb) {
		if (! cb) {
			cb = function (error, message) {
				if (error) {
					console.error("Profiler: " + error.toString());
				}
				else {
					console.log("Profiler: " + message);
				}
			}
		}
		var content = JSON.stringify(Profiler.getResults(), function (k, v) {
			return typeof(v) === "number" ? Math.round(v) : v;
		});
		if (typeof(XMLHttpRequest) !== "undefined") {
			return this._postResultsXHR(url, content, cb);
		}
		if (typeof(require) !== "undefined" && require("http")) {
			return this._postResultsNode(url, content, cb);
		}
		cb(new ReferenceError("XMLHttpRequest is not defined"), null);
	};

	Profiler._postResultsXHR = function (url, content, cb) {
		// post target should support gist-style API
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200 || xhr.status == 201 || xhr.status == 0) {
					cb(null, xhr.getResponseHeader("Location") || xhr.responseText);
				} else {
					cb(new Error("failed to post profiler results, received " + xhr.status + " " + xhr.statusText + " response from server"), null);
				}
			}
		};
		xhr.onerror = function (event) {
			cb(new Error("failed to post profiler results"), null);
		};
		xhr.open("POST", url, /* async: */true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(content);
	};

	Profiler._postResultsNode = function (url, content, cb) {
		var http = require("http");
		url = require("url").parse(url);
		var req = http.request({
			method: "POST",
			hostname: url.hostname,
			port: url.port,
			path: url.path,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(content, "utf8"),
			},
		}, function (res) {
			res.setEncoding("utf8");
			var data = "";
			res.on("data", function (chunk) {
				data += chunk;
			});
			res.on("end", function () {
				if (res.statusCode == 200 || res.statusCode == 201) {
					cb(null, res.headers.location || data);
				} else {
					cb(new Error("failed to post profiler results, received " + res.statusCode + " response from server"), null);
				}
			});
		}).on('error', function (e) {
			cb(e, null);
		});
		req.write(content, "utf8");
		req.end();
	};

	Profiler.resetResults = function () {
		var t = getTime();
		for (var stackIndex = 0; stackIndex < stack.length; ++stackIndex) {
			var isLeaf = stackIndex == stack.length - 1;
			// reset the counters
			stack[stackIndex].$cur_inclusive = t;
			stack[stackIndex].$cur_exclusive = isLeaf ? t : 0;
			stack[stackIndex].$inclusive = 0;
			stack[stackIndex].$exclusive = 0;
			stack[stackIndex].$count = 0;
			// reset callees
			for (var k in stack[stackIndex]) {
				if (k.charAt(0) != "$") {
					if (! isLeaf && stack[stackIndex][k] == stack[stackIndex + 1]) {
						// preserve the current call path
					} else {
						delete stack[stackIndex][k];
					}
				}
			}
		}
	};

})();
