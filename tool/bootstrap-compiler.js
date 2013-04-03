#!/usr/bin/env node
// generatedy by JSX compiler 0.9.21 (2013-04-03 11:07:15 +0900; e0b98a35c5f6640b04c6d8b01861b091d19eeb2a)
var JSX = {};
(function (JSX) {
/**
 * copies the implementations from source interface to target
 */
function $__jsx_merge_interface(target, source) {
	for (var k in source.prototype)
		if (source.prototype.hasOwnProperty(k))
			target.prototype[k] = source.prototype[k];
}

/**
 * defers the initialization of the property
 */
function $__jsx_lazy_init(obj, prop, func) {
	function reset(obj, prop, value) {
		delete obj[prop];
		obj[prop] = value;
		return value;
	}

	Object.defineProperty(obj, prop, {
		get: function () {
			return reset(obj, prop, func());
		},
		set: function (v) {
			reset(obj, prop, v);
		},
		enumerable: true,
		configurable: true
	});
}

/**
 * sideeffect().a /= b
 */
function $__jsx_div_assign(obj, prop, divisor) {
	return obj[prop] = (obj[prop] / divisor) | 0;
}

/*
 * global functions, renamed to avoid conflict with local variable names
 */
var $__jsx_parseInt = parseInt;
var $__jsx_parseFloat = parseFloat;
var $__jsx_isNaN = isNaN;
var $__jsx_isFinite = isFinite;

var $__jsx_encodeURIComponent = encodeURIComponent;
var $__jsx_decodeURIComponent = decodeURIComponent;
var $__jsx_encodeURI = encodeURI;
var $__jsx_decodeURI = decodeURI;

var $__jsx_ObjectToString = Object.prototype.toString;
var $__jsx_ObjectHasOwnProperty = Object.prototype.hasOwnProperty;

/*
 * profiler object, initialized afterwards
 */
function $__jsx_profiler() {
}

/*
 * public interface to JSX code
 */
JSX.require = function (path) {
	var m = $__jsx_classMap[path];
	return m !== undefined ? m : null;
};

JSX.profilerIsRunning = function () {
	return $__jsx_profiler.getResults != null;
};

JSX.getProfileResults = function () {
	return ($__jsx_profiler.getResults || function () { return {}; })();
};

JSX.postProfileResults = function (url, cb) {
	if ($__jsx_profiler.postResults == null)
		throw new Error("profiler has not been turned on");
	return $__jsx_profiler.postResults(url, cb);
};

JSX.resetProfileResults = function () {
	if ($__jsx_profiler.resetResults == null)
		throw new Error("profiler has not been turned on");
	return $__jsx_profiler.resetResults();
};
JSX.DEBUG = true;
/**
 * class CompilationServer extends Object
 * @constructor
 */
function CompilationServer() {
}

/**
 * @constructor
 * @param {Platform} parentPlatform
 */
function CompilationServer$LPlatform$(parentPlatform) {
	this._requestSequence = 0;
	this._pidFile = "";
	this._portFile = "";
	this._httpd = null;
	this._timer = null;
	this._platform = parentPlatform;
	this._home = process.env.JSX_HOME || (process.env.HOME || process.env.USERPROFILE) + "/.jsx";
	if (! parentPlatform.fileExists$S(this._home)) {
		parentPlatform.mkpath$S(this._home);
	}
	this._pidFile = this._home + "/pid";
	this._portFile = this._home + "/port";
};

CompilationServer$LPlatform$.prototype = new CompilationServer;

/**
 * @param {Platform} platform
 * @param {!number} port
 * @return {!number}
 */
CompilationServer.start$LPlatform$I = function (platform, port) {
	/** @type {CompilationServer} */
	var server;
	server = new CompilationServer$LPlatform$(platform);
	server._httpd = node.http.createServer((function (request, response) {
		server.handleRequest$LServerRequest$LServerResponse$(request, response);
	}));
	server._httpd.listen(port);
	platform.save$USS(server._pidFile, process.pid + "");
	platform.save$USS(server._portFile, port + "");
	console.info("%s [%s] listen http://localhost:%s/", new Date().toISOString(), process.pid, port);
	server._timer = Timer$setTimeout$F$V$N((function () {
		server.shutdown$S("timeout");
	}), CompilationServer.LIFE);
	process.on("SIGTERM", (function () {
		server.shutdown$S("SIGTERM");
	}));
	process.on("SIGINT", (function () {
		server.shutdown$S("SIGINT");
	}));
	if (CompilationServer.AUTO_SHUTDOWN) {
		node.fs.watch(node.__filename, ({ persistent: false }), (function (event, filename) {
			server.shutdown$S(event);
		}));
	}
	return 0;
};

var CompilationServer$start$LPlatform$I = CompilationServer.start$LPlatform$I;

/**
 * @param {!string} reason
 */
CompilationServer.prototype.shutdown$S = function (reason) {
	try {
		node.fs.unlinkSync(this._portFile);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
		} else {
			throw $__jsx_catch_0;
		}
	}
	try {
		node.fs.unlinkSync(this._pidFile);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
		} else {
			throw $__jsx_catch_0;
		}
	}
	Timer$clearTimeout$LTimerHandle$(this._timer);
	this._httpd.close();
	console.info("%s [%s] shutdown by %s, handled %s requests", new Date().toISOString(), process.pid, reason, this._requestSequence);
};

/**
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
CompilationServer.prototype.handleRequest$LServerRequest$LServerResponse$ = function (request, response) {
	var $this = this;
	/** @type {Date} */
	var startTime;
	/** @type {!number} */
	var id;
	/** @type {CompilationServerPlatform} */
	var c;
	/** @type {Array.<undefined|!string>} */
	var matched;
	/** @type {!string} */
	var query;
	/** @type {!string} */
	var inputData;
	startTime = new Date();
	id = ++ this._requestSequence;
	Timer$clearTimeout$LTimerHandle$(this._timer);
	this._timer = Timer$setTimeout$F$V$N((function () {
		$this.shutdown$S("timeout");
	}), CompilationServer.LIFE);
	if (request.method === "GET") {
		console.info("%s #%s start %s", startTime.toISOString(), id, request.url);
		this.handleGET$NLDate$LServerRequest$LServerResponse$(id, startTime, request, response);
		return;
	}
	c = new CompilationServerPlatform$SNLServerRequest$LServerResponse$(this._platform.getRoot$(), id, request, response);
	matched = request.url.match(/\?(.*)/);
	if (! (matched && matched[1])) {
		c.error$S("invalid request to compilation server");
		this.finishRequest$NLDate$LServerResponse$NX(id, startTime, response, 400, c.getContents$());
		return;
	}
	query = $__jsx_decodeURIComponent(matched[1]);
	console.info("%s #%s start %s", startTime.toISOString(), id, query.replace(/\n/g, "\\n"));
	inputData = "";
	request.on("data", (function (chunk) {
		inputData += chunk + "";
	}));
	request.on("end", (function () {
		/** @type {Array.<undefined|!string>} */
		var args;
		if (inputData) {
			c.setFileContent$SS("-", inputData);
		}
		try {
			args = JSON.parse(query);
			c.setStatusCode$N(JSXCommand$main$LPlatform$AS(c, args));
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				console.error("%s #%s %s", startTime.toISOString(), id, $__jsx_catch_0.stack);
				c.error$S($__jsx_catch_0.stack);
			} else {
				throw $__jsx_catch_0;
			}
		}
		$this.finishRequest$NLDate$LServerResponse$NX(id, startTime, response, 200, c.getContents$());
	}));
	request.on("close", (function () {
		c.error$S("the connecion is unexpectedly closed.\n");
		$this.finishRequest$NLDate$LServerResponse$NX(id, startTime, response, 500, c.getContents$());
	}));
};

/**
 * @param {!number} id
 * @param {Date} startTime
 * @param {ServerRequest} request
 * @param {ServerResponse} response
 */
CompilationServer.prototype.handleGET$NLDate$LServerRequest$LServerResponse$ = function (id, startTime, request, response) {
	this.finishRequest$NLDate$LServerResponse$NX(id, startTime, response, 200, ({ version_string: Meta.VERSION_STRING, version_number: Meta.VERSION_NUMBER, last_commit_hash: Meta.LAST_COMMIT_HASH, last_commit_date: Meta.LAST_COMMIT_DATE, status: true }));
};

/**
 * @param {!number} id
 * @param {Date} startTime
 * @param {ServerResponse} response
 * @param {!number} statusCode
 * @param {*} data
 */
CompilationServer.prototype.finishRequest$NLDate$LServerResponse$NX = function (id, startTime, response, statusCode, data) {
	/** @type {!string} */
	var content;
	/** @type {Object.<string, undefined|!string>} */
	var headers;
	/** @type {Date} */
	var now;
	/** @type {!number} */
	var elapsed;
	content = JSON.stringify(data);
	headers = ({ "Content-Type": "application/json", "Content-Length": Buffer.byteLength(content, "utf-8") + "", "Cache-Control": "no-cache" });
	response.writeHead(statusCode, headers);
	response.end(content, "utf-8");
	now = new Date();
	elapsed = now.getTime() - startTime.getTime();
	console.info("%s #%s finish, elapsed %s [ms]", now.toISOString(), id, elapsed);
};

/**
 * class _Main extends Object
 * @constructor
 */
function _Main() {
}

/**
 * @constructor
 */
function _Main$() {
};

_Main$.prototype = new _Main;

/**
 * @param {Array.<undefined|!string>} args
 */
_Main.main$AS = function (args) {
	/** @type {!number} */
	var exitCode;
	/** @type {!boolean} */
	var stdoutIsFlushed;
	/** @type {!boolean} */
	var stderrIsFlushed;
	/** @type {*} */
	var exitIfFlushed;
	exitCode = JSXCommand$main$LPlatform$AS(new NodePlatform$(), NodePlatform$getEnvOpts$().concat(args));
	if (exitCode === 0) {
		return;
	}
	stdoutIsFlushed = process.stdout.write("");
	stderrIsFlushed = process.stderr.write("");
	exitIfFlushed = (function (data) {
		if (stdoutIsFlushed && stderrIsFlushed) {
			process.exit(exitCode);
		}
	});
	if (! stdoutIsFlushed) {
		process.stdout.on('drain', exitIfFlushed);
	}
	if (! stderrIsFlushed) {
		process.stderr.on('drain', exitIfFlushed);
	}
	exitIfFlushed(null);
};

var _Main$main$AS = _Main.main$AS;

/**
 * class js extends Object
 * @constructor
 */
function js() {
}

/**
 * @constructor
 */
function js$() {
};

js$.prototype = new js;

/**
 * class node extends Object
 * @constructor
 */
function node() {
}

/**
 * @constructor
 */
function node$() {
};

node$.prototype = new node;

/**
 * @param {!string} source
 * @return {*}
 */
node.require$S = function (source) {
	/** @type {!string} */
	var src;
	src = 'require(' + JSON.stringify(source) + ')';
	return eval(src);
};

var node$require$S = node.require$S;

/**
 * class Timer extends Object
 * @constructor
 */
function Timer() {
}

/**
 * @constructor
 */
function Timer$() {
};

Timer$.prototype = new Timer;

/**
 * @param {*} callback
 * @param {!number} intervalMS
 * @return {TimerHandle}
 */
Timer.setTimeout$F$V$N = function (callback, intervalMS) {
	return js.global.setTimeout(callback, intervalMS);
};

var Timer$setTimeout$F$V$N = Timer.setTimeout$F$V$N;

/**
 * @param {TimerHandle} timer
 */
Timer.clearTimeout$LTimerHandle$ = function (timer) {
	js.global.clearTimeout(timer);
};

var Timer$clearTimeout$LTimerHandle$ = Timer.clearTimeout$LTimerHandle$;

/**
 * @param {*} callback
 * @param {!number} intervalMS
 * @return {TimerHandle}
 */
Timer.setInterval$F$V$N = function (callback, intervalMS) {
	return js.global.setInterval(callback, intervalMS);
};

var Timer$setInterval$F$V$N = Timer.setInterval$F$V$N;

/**
 * @param {TimerHandle} timer
 */
Timer.clearInterval$LTimerHandle$ = function (timer) {
	js.global.clearInterval(timer);
};

var Timer$clearInterval$LTimerHandle$ = Timer.clearInterval$LTimerHandle$;

/**
 * @param {*} callback
 * @return {TimerHandle}
 */
Timer.requestAnimationFrame$F$NV$ = function (callback) {
	return Timer._requestAnimationFrame(callback);
};

var Timer$requestAnimationFrame$F$NV$ = Timer.requestAnimationFrame$F$NV$;

/**
 * @param {TimerHandle} timer
 */
Timer.cancelAnimationFrame$LTimerHandle$ = function (timer) {
	Timer._cancelAnimationFrame(timer);
};

var Timer$cancelAnimationFrame$LTimerHandle$ = Timer.cancelAnimationFrame$LTimerHandle$;

/**
 * @param {!boolean} enable
 */
Timer.useNativeRAF$B = function (enable) {
	Timer._requestAnimationFrame = Timer$_getRequestAnimationFrameImpl$B(enable);
	Timer._cancelAnimationFrame = Timer$_getCancelAnimationFrameImpl$B(enable);
};

var Timer$useNativeRAF$B = Timer.useNativeRAF$B;

/**
 * @param {!boolean} useNativeImpl
 * @return {*}
 */
Timer._getRequestAnimationFrameImpl$B = function (useNativeImpl) {
	/** @type {!number} */
	var lastTime;
	if (useNativeImpl) {
		if (js.global.requestAnimationFrame) {
			return (function (callback) {
				return js.global.requestAnimationFrame(callback);
			});
		} else {
			if (js.global.webkitRequestAnimationFrame) {
				return (function (callback) {
					return js.global.webkitRequestAnimationFrame(callback);
				});
			} else {
				if (js.global.mozRequestAnimationFrame) {
					return (function (callback) {
						return js.global.mozRequestAnimationFrame(callback);
					});
				} else {
					if (js.global.oRequestAnimationFrame) {
						return (function (callback) {
							return js.global.oRequestAnimationFrame(callback);
						});
					} else {
						if (js.global.msRequestAnimationFrame) {
							return (function (callback) {
								return js.global.msRequestAnimationFrame(callback);
							});
						}
					}
				}
			}
		}
	}
	lastTime = 0;
	return (function (callback) {
		/** @type {!number} */
		var now;
		/** @type {!number} */
		var timeToCall;
		now = Date.now();
		timeToCall = Math.max(0, 16 - (now - lastTime));
		lastTime = now + timeToCall;
		return Timer$setTimeout$F$V$N((function () {
			callback(now + timeToCall);
		}), timeToCall);
	});
};

var Timer$_getRequestAnimationFrameImpl$B = Timer._getRequestAnimationFrameImpl$B;

/**
 * @param {!boolean} useNativeImpl
 * @return {*}
 */
Timer._getCancelAnimationFrameImpl$B = function (useNativeImpl) {
	if (useNativeImpl) {
		if (js.global.cancelAnimationFrame) {
			return (function (timer) {
				js.global.cancelAnimationFrame(timer);
			});
		} else {
			if (js.global.webkitCancelAnimationFrame) {
				return (function (timer) {
					js.global.webkitCancelAnimationFrame(timer);
				});
			} else {
				if (js.global.mozCancelAnimationFrame) {
					return (function (timer) {
						js.global.mozCancelAnimationFrame(timer);
					});
				} else {
					if (js.global.oCancelAnimationFrame) {
						return (function (timer) {
							js.global.oCancelAnimationFrame(timer);
						});
					} else {
						if (js.global.msCancelAnimationFrame) {
							return (function (timer) {
								js.global.msCancelAnimationFrame(timer);
							});
						}
					}
				}
			}
		}
	}
	return Timer$clearTimeout$LTimerHandle$;
};

var Timer$_getCancelAnimationFrameImpl$B = Timer._getCancelAnimationFrameImpl$B;

/**
 * class TimerHandle extends Object
 * @constructor
 */
function TimerHandle() {
}

/**
 * @constructor
 */
function TimerHandle$() {
};

TimerHandle$.prototype = new TimerHandle;

/**
 * class Util extends Object
 * @constructor
 */
function Util() {
}

/**
 * @constructor
 */
function Util$() {
};

Util$.prototype = new Util;

/**
 * @param {!string} c
 * @param {!number} n
 * @return {!string}
 */
Util.repeat$SN = function (c, n) {
	/** @type {!string} */
	var s;
	/** @type {!number} */
	var i;
	s = "";
	for (i = 0; i < n; ++ i) {
		s += c;
	}
	return s;
};

var Util$repeat$SN = Util.repeat$SN;

/**
 * @param {!string} fmt
 * @param {Array.<undefined|!string>} args
 * @return {!string}
 */
Util.format$SAS = function (fmt, args) {
	/** @type {!number} */
	var i;
	if (! (args != null)) {
		debugger;
		throw new Error("[src/util.jsx:80:20] assertion failure\n        assert args != null;\n                    ^^\n");
	}
	i = 0;
	return fmt.replace(/%(\d+|%)/g, (function (m) {
		/** @type {undefined|!string} */
		var arg;
		if (m === "%%") {
			return "%";
		} else {
			arg = args[(m.substring(1) | 0) - 1];
			return (arg == null ? "null" : arg);
		}
	}));
};

var Util$format$SAS = Util.format$SAS;

/**
 * @param {AnalysisContext} context
 * @param {Array.<undefined|Expression>} args
 * @param {Expression} parentExpr
 * @param {Array.<undefined|Array.<undefined|Type>>} expectedTypes
 * @return {Array.<undefined|Type>}
 */
Util.analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$ = function (context, args, parentExpr, expectedTypes) {
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!number} */
	var i;
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	/** @type {Type} */
	var expectedCallbackType;
	/** @type {!number} */
	var j;
	/** @type {ArrayLiteralExpression} */
	var arrayExpr;
	/** @type {Type} */
	var expectedArrayType;
	/** @type {MapLiteralExpression} */
	var mapExpr;
	/** @type {Type} */
	var expectedMapType;
	argTypes = [  ];
	for (i = 0; i < args.length; ++ i) {
		if (args[i] instanceof FunctionExpression && ! args[i].argumentTypesAreIdentified$()) {
			funcDef = args[i].getFuncDef$();
			expectedCallbackType = null;
			for (j = 0; j < expectedTypes.length; ++ j) {
				if (expectedTypes[j][i] != null && expectedTypes[j][i] instanceof FunctionType && expectedTypes[j][i].getArgumentTypes$().length === funcDef.getArguments$().length) {
					if (expectedCallbackType == null) {
						expectedCallbackType = expectedTypes[j][i];
					} else {
						if (Util$typesAreEqual$ALType$ALType$(expectedCallbackType.getArgumentTypes$(), expectedTypes[j][i].getArgumentTypes$()) && expectedCallbackType.getReturnType$().equals$LType$(expectedTypes[j][i].getReturnType$())) {
						} else {
							break;
						}
					}
				}
			}
			if (j !== expectedTypes.length) {
			} else {
				if (expectedCallbackType != null) {
					if (! args[i].deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, expectedCallbackType)) {
						return null;
					}
				}
			}
		} else {
			if (args[i] instanceof ArrayLiteralExpression && args[i].getExprs$().length === 0 && args[i].getType$() == null) {
				arrayExpr = args[i];
				expectedArrayType = null;
				for (j = 0; j < expectedTypes.length; ++ j) {
					if (expectedTypes[j][i] != null && expectedTypes[j][i] instanceof ObjectType && expectedTypes[j][i].getClassDef$() instanceof InstantiatedClassDefinition && expectedTypes[j][i].getClassDef$().getTemplateClassName$() === 'Array') {
						if (expectedArrayType == null) {
							expectedArrayType = expectedTypes[j][i];
						} else {
							if (expectedArrayType.equals$LType$(expectedTypes[j][i])) {
							} else {
								break;
							}
						}
					}
				}
				if (j !== expectedTypes.length) {
				} else {
					if (expectedArrayType != null) {
						arrayExpr.setType$LType$(expectedArrayType);
					}
				}
			} else {
				if (args[i] instanceof MapLiteralExpression && args[i].getElements$().length === 0 && args[i].getType$() == null) {
					mapExpr = args[i];
					expectedMapType = null;
					for (j = 0; j < expectedTypes.length; ++ j) {
						if (expectedTypes[j][i] != null && expectedTypes[j][i] instanceof ObjectType && expectedTypes[j][i].getClassDef$() instanceof InstantiatedClassDefinition && expectedTypes[j][i].getClassDef$().getTemplateClassName$() === 'Map') {
							if (expectedMapType == null) {
								expectedMapType = expectedTypes[j][i];
							} else {
								if (expectedMapType.equals$LType$(expectedTypes[j][i])) {
								} else {
									break;
								}
							}
						}
					}
					if (j !== expectedTypes.length) {
					} else {
						if (expectedMapType != null) {
							mapExpr.setType$LType$(expectedMapType);
						}
					}
				}
			}
		}
		if (! args[i].analyze$LAnalysisContext$LExpression$(context, parentExpr)) {
			return null;
		}
		argTypes[i] = args[i].getType$();
	}
	return argTypes;
};

var Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$ = Util.analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$;

/**
 * @param {Array.<undefined|Type>} x
 * @param {Array.<undefined|Type>} y
 * @return {!boolean}
 */
Util.typesAreEqual$ALType$ALType$ = function (x, y) {
	/** @type {!number} */
	var i;
	if (x.length !== y.length) {
		return false;
	}
	for (i = 0; i < x.length; ++ i) {
		if (! x[i].equals$LType$(y[i])) {
			return false;
		}
	}
	return true;
};

var Util$typesAreEqual$ALType$ALType$ = Util.typesAreEqual$ALType$ALType$;

/**
 * @param {*} cb
 * @param {Array.<undefined|Statement>} statements
 * @return {!boolean}
 */
Util.forEachStatement$F$LStatement$B$ALStatement$ = function (cb, statements) {
	/** @type {!number} */
	var i;
	if (statements != null) {
		for (i = 0; i < statements.length; ++ i) {
			if (! cb(statements[i])) {
				return false;
			}
		}
	}
	return true;
};

var Util$forEachStatement$F$LStatement$B$ALStatement$ = Util.forEachStatement$F$LStatement$B$ALStatement$;

/**
 * @param {*} cb
 * @param {Array.<undefined|Expression>} exprs
 * @return {!boolean}
 */
Util.forEachExpression$F$LExpression$B$ALExpression$ = function (cb, exprs) {
	return Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$((function (expr, _) {
		return cb(expr);
	}), exprs);
};

var Util$forEachExpression$F$LExpression$B$ALExpression$ = Util.forEachExpression$F$LExpression$B$ALExpression$;

/**
 * @param {*} cb
 * @param {Array.<undefined|Expression>} exprs
 * @return {!boolean}
 */
Util.forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$ = function (cb, exprs) {
	/** @type {!number} */
	var i;
	if (exprs != null) {
		for (i = 0; i < exprs.length; ++ i) {
			if (! cb(exprs[i], (function (exprs, index) {
				return (function (expr) {
					exprs[index] = expr;
				});
			})(exprs, i))) {
				return false;
			}
		}
	}
	return true;
};

var Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$ = Util.forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$;

/**
 * @param {ClassDefinition} classDef
 * @param {!string} funcName
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {MemberFunctionDefinition}
 */
Util.findFunctionInClass$LClassDefinition$SALType$B = function (classDef, funcName, argTypes, isStatic) {
	/** @type {MemberFunctionDefinition} */
	var found;
	found = null;
	classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		if (isStatic === ((funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0) && funcDef.name$() === funcName && Util$typesAreEqual$ALType$ALType$(funcDef.getArgumentTypes$(), argTypes)) {
			found = funcDef;
			return false;
		}
		return true;
	}));
	return found;
};

var Util$findFunctionInClass$LClassDefinition$SALType$B = Util.findFunctionInClass$LClassDefinition$SALType$B;

/**
 * @param {!string} str
 * @return {!string}
 */
Util.encodeStringLiteral$S = function (str) {
	/** @type {!string} */
	var escaped;
	escaped = str.replace(/[\0-\x19\\'"\u007f-\uffff]/g, (function (ch) {
		/** @type {!string} */
		var t;
		if (ch in Util._stringLiteralEncodingMap) {
			return Util._stringLiteralEncodingMap[ch];
		} else {
			t = "000" + ch.charCodeAt(0).toString(16);
			t = t.substring(t.length - 4);
			return "\\u" + t;
		}
	}));
	return "\"" + escaped + "\"";
};

var Util$encodeStringLiteral$S = Util.encodeStringLiteral$S;

/**
 * @param {!string} literal
 * @return {!string}
 */
Util.decodeStringLiteral$S = function (literal) {
	/** @type {Array.<undefined|!string>} */
	var matched;
	/** @type {!string} */
	var src;
	/** @type {!string} */
	var decoded;
	/** @type {!number} */
	var pos;
	/** @type {!number} */
	var backslashAt;
	/** @type {!string} */
	var escapeChar;
	matched = literal.match(/^([\'\"]).*([\'\"])$/);
	if (matched == null || matched[1] != matched[2]) {
		throw new Error("input string is not quoted properly: " + literal);
	}
	src = literal.substring(1, literal.length - 1);
	decoded = "";
	pos = 0;
	while ((backslashAt = src.indexOf("\\", pos)) !== - 1) {
		decoded += src.substring(pos, backslashAt);
		pos = backslashAt + 1;
		if (pos === src.length) {
			throw new Error("last character within a string literal cannot be a backslash: " + literal);
		}
		escapeChar = src.charAt(pos++);
		switch (escapeChar) {
		case "'":
		case "\"":
		case "\\":
			decoded += escapeChar;
			break;
		case "b":
			decoded += "\b";
			break;
		case "f":
			decoded += "\f";
			break;
		case "n":
			decoded += "\n";
			break;
		case "r":
			decoded += "\r";
			break;
		case "t":
			decoded += "\t";
			break;
		case "v":
			decoded += "\v";
			break;
		case "u":
			matched = src.substring(pos).match(/^([0-9A-Fa-f]{4})/);
			if (matched == null) {
				throw new Error("expected four hexdigits after \\u: " + literal);
			}
			decoded += String.fromCharCode($__jsx_parseInt(matched[1], 16));
			pos += 4;
			break;
		case "0":
			if (pos === src.length || src.charAt(pos).match(/[0-9]/) == null) {
				decoded += "\0";
			} else {
				throw new Error("found a digit after '\\0': " + literal);
			}
			break;
		}
	}
	decoded += src.substring(pos);
	return decoded;
};

var Util$decodeStringLiteral$S = Util.decodeStringLiteral$S;

/**
 * @param {!string} path
 * @return {Array.<undefined|!string>}
 */
Util._resolvedPathParts$S = function (path) {
	/** @type {Array.<undefined|!string>} */
	var tokens;
	/** @type {!number} */
	var i;
	tokens = path.split(/[\\\/]+/);
	if (tokens.length === 1) {
		return tokens;
	}
	for (i = 0; i < tokens.length; ) {
		if (tokens[i] == ".") {
			tokens.splice(i, 1);
		} else {
			if (tokens[i] == ".." && i !== 0 && tokens[i - 1] != "..") {
				tokens.splice(i - 1, 2);
				i -= 1;
			} else {
				i++;
			}
		}
	}
	return tokens;
};

var Util$_resolvedPathParts$S = Util._resolvedPathParts$S;

/**
 * @param {!string} path
 * @return {!string}
 */
Util.resolvePath$S = function (path) {
	return Util$_resolvedPathParts$S(path).join("/");
};

var Util$resolvePath$S = Util.resolvePath$S;

/**
 * @param {!string} fromPath
 * @param {!string} toPath
 * @param {!boolean} isFile
 * @return {!string}
 */
Util.relativePath$SSB = function (fromPath, toPath, isFile) {
	/** @type {Array.<undefined|!string>} */
	var f;
	/** @type {Array.<undefined|!string>} */
	var t;
	/** @type {!number} */
	var minLen;
	/** @type {!number} */
	var samePartsIndex;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|!string>} */
	var pathParts;
	f = Util$_resolvedPathParts$S(fromPath);
	t = Util$_resolvedPathParts$S(toPath);
	if (isFile) {
		f.pop();
	}
	if (f[0] == "") {
		f.shift();
	}
	if (t[0] == "") {
		t.shift();
	}
	minLen = Math.min(f.length, t.length);
	samePartsIndex = minLen;
	for (i = 0; i < minLen; ++ i) {
		if (f[i] != t[i]) {
			samePartsIndex = i;
			break;
		}
	}
	pathParts = [];
	for (i = samePartsIndex; i < f.length; ++ i) {
		pathParts.push("..");
	}
	return pathParts.concat(t.slice(samePartsIndex)).join("/");
};

var Util$relativePath$SSB = Util.relativePath$SSB;

/**
 * @param {!string} path
 * @return {!string}
 */
Util.basename$S = function (path) {
	/** @type {Array.<undefined|!string>} */
	var parts;
	parts = Util$_resolvedPathParts$S(path);
	return parts.pop();
};

var Util$basename$S = Util.basename$S;

/**
 * @param {!string} path
 * @return {!string}
 */
Util.dirname$S = function (path) {
	/** @type {Array.<undefined|!string>} */
	var parts;
	parts = Util$_resolvedPathParts$S(path);
	parts.pop();
	return parts.join("/");
};

var Util$dirname$S = Util.dirname$S;

/**
 * @param {!number} n
 * @return {!string}
 */
Util.toOrdinal$N = function (n) {
	if (10 < n && n < 14) {
		return (n + "") + 'th';
	}
	switch (n % 10) {
	case 1:
		return (n + "") + 'st';
	case 2:
		return (n + "") + 'nd';
	case 3:
		return (n + "") + 'rd';
	default:
		return (n + "") + 'th';
	}
};

var Util$toOrdinal$N = Util.toOrdinal$N;

/**
 * @param {Platform} platform
 * @param {!string} message
 * @param {undefined|!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!number} size
 * @return {!string}
 */
Util.makeErrorMessage$LPlatform$SUSNNN = function (platform, message, filename, lineNumber, columnNumber, size) {
	/** @type {!string} */
	var content;
	/** @type {!string} */
	var sourceLine;
	/** @type {!number} */
	var TAB_WIDTH;
	/** @type {Array.<undefined|!string>} */
	var tabs;
	if (filename == null) {
		return message + "\n";
	}
	content = platform.load$S(filename);
	sourceLine = content.split(/\n/)[lineNumber - 1] + "\n";
	TAB_WIDTH = 4;
	tabs = sourceLine.slice(0, columnNumber).match(/\t/g);
	if (tabs != null) {
		columnNumber += (TAB_WIDTH - 1) * tabs.length;
	}
	sourceLine = sourceLine.replace(/\t/g, Util$repeat$SN(" ", TAB_WIDTH));
	sourceLine += Util$repeat$SN(" ", columnNumber);
	sourceLine += Util$repeat$SN("^", size);
	return Util$format$SAS("[%1:%2:%3] %4\n%5\n", [ filename, lineNumber + "", columnNumber + "", message, sourceLine ]);
};

var Util$makeErrorMessage$LPlatform$SUSNNN = Util.makeErrorMessage$LPlatform$SUSNNN;

/**
 * class TemplateInstantiationRequest extends Object
 * @constructor
 */
function TemplateInstantiationRequest() {
}

/**
 * @constructor
 * @param {Token} token
 * @param {!string} className
 * @param {Array.<undefined|Type>} typeArgs
 */
function TemplateInstantiationRequest$LToken$SALType$(token, className, typeArgs) {
	this._token = token;
	this._className = className;
	this._typeArgs = typeArgs;
};

TemplateInstantiationRequest$LToken$SALType$.prototype = new TemplateInstantiationRequest;

/**
 * @return {Token}
 */
TemplateInstantiationRequest.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {!string}
 */
TemplateInstantiationRequest.prototype.getClassName$ = function () {
	return this._className;
};

/**
 * @return {Array.<undefined|Type>}
 */
TemplateInstantiationRequest.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};

/**
 * class CompileIssue extends Object
 * @constructor
 */
function CompileIssue() {
}

/**
 * @constructor
 * @param {Token} token
 * @param {!string} message
 */
function CompileIssue$LToken$S(token, message) {
	this._filename = null;
	this._lineNumber = 0;
	this._columnNumber = 0;
	this._message = "";
	this._size = 0;
	if (token != null) {
		this._filename = token.getFilename$();
		this._lineNumber = token.getLineNumber$();
		this._columnNumber = token.getColumnNumber$();
		this._size = token.getValue$().length;
		this._message = message;
	} else {
		this._filename = null;
		this._lineNumber = 0;
		this._columnNumber = - 1;
		this._message = message;
		this._size = 1;
	}
};

CompileIssue$LToken$S.prototype = new CompileIssue;

/**
 * @constructor
 * @param {!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!string} message
 */
function CompileIssue$SNNS(filename, lineNumber, columnNumber, message) {
	this._filename = filename;
	this._lineNumber = lineNumber;
	this._columnNumber = columnNumber;
	this._message = message;
	this._size = 1;
};

CompileIssue$SNNS.prototype = new CompileIssue;

/**
 * @param {Platform} platform
 * @return {!string}
 */
CompileIssue.prototype.format$LPlatform$ = function (platform) {
	return Util$makeErrorMessage$LPlatform$SUSNNN(platform, this.getPrefix$() + this._message, this._filename, this._lineNumber, this._columnNumber, this._size);
};

/**
 * class CompileError extends CompileIssue
 * @constructor
 */
function CompileError() {
}

CompileError.prototype = new CompileIssue;
/**
 * @constructor
 * @param {Token} token
 * @param {!string} message
 */
function CompileError$LToken$S(token, message) {
	CompileIssue$LToken$S.call(this, token, message);
	this._notes = [];
};

CompileError$LToken$S.prototype = new CompileError;

/**
 * @constructor
 * @param {!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!string} message
 */
function CompileError$SNNS(filename, lineNumber, columnNumber, message) {
	CompileIssue$SNNS.call(this, filename, lineNumber, columnNumber, message);
	this._notes = [];
};

CompileError$SNNS.prototype = new CompileError;

/**
 * @param {CompileNote} note
 */
CompileError.prototype.addCompileNote$LCompileNote$ = function (note) {
	this._notes.push(note);
};

/**
 * @param {Array.<undefined|CompileNote>} notes
 */
CompileError.prototype.addCompileNotes$ALCompileNote$ = function (notes) {
	var $this = this;
	notes.forEach((function (note) {
		$this.addCompileNote$LCompileNote$(note);
	}));
};

/**
 * @return {Array.<undefined|CompileNote>}
 */
CompileError.prototype.getCompileNotes$ = function () {
	return this._notes;
};

/**
 * @return {!string}
 */
CompileError.prototype.getPrefix$ = function () {
	return "";
};

/**
 * class CompileWarning extends CompileError
 * @constructor
 */
function CompileWarning() {
}

CompileWarning.prototype = new CompileError;
/**
 * @constructor
 * @param {Token} token
 * @param {!string} message
 */
function CompileWarning$LToken$S(token, message) {
	CompileError$LToken$S.call(this, token, message);
};

CompileWarning$LToken$S.prototype = new CompileWarning;

/**
 * @constructor
 * @param {!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!string} message
 */
function CompileWarning$SNNS(filename, lineNumber, columnNumber, message) {
	CompileError$SNNS.call(this, filename, lineNumber, columnNumber, message);
};

CompileWarning$SNNS.prototype = new CompileWarning;

/**
 * @return {!string}
 */
CompileWarning.prototype.getPrefix$ = function () {
	return "Warning: ";
};

/**
 * class DeprecatedWarning extends CompileWarning
 * @constructor
 */
function DeprecatedWarning() {
}

DeprecatedWarning.prototype = new CompileWarning;
/**
 * @constructor
 * @param {Token} token
 * @param {!string} message
 */
function DeprecatedWarning$LToken$S(token, message) {
	CompileWarning$LToken$S.call(this, token, message);
};

DeprecatedWarning$LToken$S.prototype = new DeprecatedWarning;

/**
 * @constructor
 * @param {!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!string} message
 */
function DeprecatedWarning$SNNS(filename, lineNumber, columnNumber, message) {
	CompileWarning$SNNS.call(this, filename, lineNumber, columnNumber, message);
};

DeprecatedWarning$SNNS.prototype = new DeprecatedWarning;

/**
 * class CompileNote extends CompileIssue
 * @constructor
 */
function CompileNote() {
}

CompileNote.prototype = new CompileIssue;
/**
 * @constructor
 * @param {Token} token
 * @param {!string} message
 */
function CompileNote$LToken$S(token, message) {
	CompileIssue$LToken$S.call(this, token, message);
};

CompileNote$LToken$S.prototype = new CompileNote;

/**
 * @constructor
 * @param {!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {!string} message
 */
function CompileNote$SNNS(filename, lineNumber, columnNumber, message) {
	CompileIssue$SNNS.call(this, filename, lineNumber, columnNumber, message);
};

CompileNote$SNNS.prototype = new CompileNote;

/**
 * @return {!string}
 */
CompileNote.prototype.getPrefix$ = function () {
	return "Note: ";
};

/**
 * class Cloner$Expression$E extends Object
 * @constructor
 */
function Cloner$Expression$E() {
}

/**
 * @constructor
 */
function Cloner$Expression$E$() {
};

Cloner$Expression$E$.prototype = new Cloner$Expression$E;

/**
 * @param {Array.<undefined|Expression>} a
 * @return {Array.<undefined|Expression>}
 */
Cloner$Expression$E.cloneArray$ALExpression$ = function (a) {
	/** @type {Array.<undefined|Expression>} */
	var r;
	/** @type {!number} */
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

var Cloner$Expression$E$cloneArray$ALExpression$ = Cloner$Expression$E.cloneArray$ALExpression$;

/**
 * @param {Expression} o
 * @return {Expression}
 */
Cloner$Expression$E.cloneNullable$LExpression$ = function (o) {
	return (o == null ? null : o.clone$());
};

var Cloner$Expression$E$cloneNullable$LExpression$ = Cloner$Expression$E.cloneNullable$LExpression$;

/**
 * class Serializer$Expression$E extends Object
 * @constructor
 */
function Serializer$Expression$E() {
}

/**
 * @constructor
 */
function Serializer$Expression$E$() {
};

Serializer$Expression$E$.prototype = new Serializer$Expression$E;

/**
 * @param {Array.<undefined|Expression>} a
 * @return {*}
 */
Serializer$Expression$E.serializeArray$ALExpression$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$Expression$E$serializeArray$ALExpression$ = Serializer$Expression$E.serializeArray$ALExpression$;

/**
 * @param {Expression} v
 * @return {*}
 */
Serializer$Expression$E.serializeNullable$LExpression$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$Expression$E$serializeNullable$LExpression$ = Serializer$Expression$E.serializeNullable$LExpression$;

/**
 * class Serializer$Type$E extends Object
 * @constructor
 */
function Serializer$Type$E() {
}

/**
 * @constructor
 */
function Serializer$Type$E$() {
};

Serializer$Type$E$.prototype = new Serializer$Type$E;

/**
 * @param {Array.<undefined|Type>} a
 * @return {*}
 */
Serializer$Type$E.serializeArray$ALType$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$Type$E$serializeArray$ALType$ = Serializer$Type$E.serializeArray$ALType$;

/**
 * @param {Type} v
 * @return {*}
 */
Serializer$Type$E.serializeNullable$LType$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$Type$E$serializeNullable$LType$ = Serializer$Type$E.serializeNullable$LType$;

/**
 * class Serializer$MapLiteralElement$E extends Object
 * @constructor
 */
function Serializer$MapLiteralElement$E() {
}

/**
 * @constructor
 */
function Serializer$MapLiteralElement$E$() {
};

Serializer$MapLiteralElement$E$.prototype = new Serializer$MapLiteralElement$E;

/**
 * @param {Array.<undefined|MapLiteralElement>} a
 * @return {*}
 */
Serializer$MapLiteralElement$E.serializeArray$ALMapLiteralElement$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$MapLiteralElement$E$serializeArray$ALMapLiteralElement$ = Serializer$MapLiteralElement$E.serializeArray$ALMapLiteralElement$;

/**
 * @param {MapLiteralElement} v
 * @return {*}
 */
Serializer$MapLiteralElement$E.serializeNullable$LMapLiteralElement$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$MapLiteralElement$E$serializeNullable$LMapLiteralElement$ = Serializer$MapLiteralElement$E.serializeNullable$LMapLiteralElement$;

/**
 * class Serializer$ClassDefinition$E extends Object
 * @constructor
 */
function Serializer$ClassDefinition$E() {
}

/**
 * @constructor
 */
function Serializer$ClassDefinition$E$() {
};

Serializer$ClassDefinition$E$.prototype = new Serializer$ClassDefinition$E;

/**
 * @param {Array.<undefined|ClassDefinition>} a
 * @return {*}
 */
Serializer$ClassDefinition$E.serializeArray$ALClassDefinition$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$ClassDefinition$E$serializeArray$ALClassDefinition$ = Serializer$ClassDefinition$E.serializeArray$ALClassDefinition$;

/**
 * @param {ClassDefinition} v
 * @return {*}
 */
Serializer$ClassDefinition$E.serializeNullable$LClassDefinition$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$ = Serializer$ClassDefinition$E.serializeNullable$LClassDefinition$;

/**
 * class Serializer$Token$E extends Object
 * @constructor
 */
function Serializer$Token$E() {
}

/**
 * @constructor
 */
function Serializer$Token$E$() {
};

Serializer$Token$E$.prototype = new Serializer$Token$E;

/**
 * @param {Array.<undefined|Token>} a
 * @return {*}
 */
Serializer$Token$E.serializeArray$ALToken$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$Token$E$serializeArray$ALToken$ = Serializer$Token$E.serializeArray$ALToken$;

/**
 * @param {Token} v
 * @return {*}
 */
Serializer$Token$E.serializeNullable$LToken$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$Token$E$serializeNullable$LToken$ = Serializer$Token$E.serializeNullable$LToken$;

/**
 * class Cloner$Statement$E extends Object
 * @constructor
 */
function Cloner$Statement$E() {
}

/**
 * @constructor
 */
function Cloner$Statement$E$() {
};

Cloner$Statement$E$.prototype = new Cloner$Statement$E;

/**
 * @param {Array.<undefined|Statement>} a
 * @return {Array.<undefined|Statement>}
 */
Cloner$Statement$E.cloneArray$ALStatement$ = function (a) {
	/** @type {Array.<undefined|Statement>} */
	var r;
	/** @type {!number} */
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

var Cloner$Statement$E$cloneArray$ALStatement$ = Cloner$Statement$E.cloneArray$ALStatement$;

/**
 * @param {Statement} o
 * @return {Statement}
 */
Cloner$Statement$E.cloneNullable$LStatement$ = function (o) {
	return (o == null ? null : o.clone$());
};

var Cloner$Statement$E$cloneNullable$LStatement$ = Cloner$Statement$E.cloneNullable$LStatement$;

/**
 * class Serializer$Statement$E extends Object
 * @constructor
 */
function Serializer$Statement$E() {
}

/**
 * @constructor
 */
function Serializer$Statement$E$() {
};

Serializer$Statement$E$.prototype = new Serializer$Statement$E;

/**
 * @param {Array.<undefined|Statement>} a
 * @return {*}
 */
Serializer$Statement$E.serializeArray$ALStatement$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$Statement$E$serializeArray$ALStatement$ = Serializer$Statement$E.serializeArray$ALStatement$;

/**
 * @param {Statement} v
 * @return {*}
 */
Serializer$Statement$E.serializeNullable$LStatement$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$Statement$E$serializeNullable$LStatement$ = Serializer$Statement$E.serializeNullable$LStatement$;

/**
 * class Cloner$CatchStatement$E extends Object
 * @constructor
 */
function Cloner$CatchStatement$E() {
}

/**
 * @constructor
 */
function Cloner$CatchStatement$E$() {
};

Cloner$CatchStatement$E$.prototype = new Cloner$CatchStatement$E;

/**
 * @param {Array.<undefined|CatchStatement>} a
 * @return {Array.<undefined|CatchStatement>}
 */
Cloner$CatchStatement$E.cloneArray$ALCatchStatement$ = function (a) {
	/** @type {Array.<undefined|CatchStatement>} */
	var r;
	/** @type {!number} */
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

var Cloner$CatchStatement$E$cloneArray$ALCatchStatement$ = Cloner$CatchStatement$E.cloneArray$ALCatchStatement$;

/**
 * @param {CatchStatement} o
 * @return {CatchStatement}
 */
Cloner$CatchStatement$E.cloneNullable$LCatchStatement$ = function (o) {
	return (o == null ? null : o.clone$());
};

var Cloner$CatchStatement$E$cloneNullable$LCatchStatement$ = Cloner$CatchStatement$E.cloneNullable$LCatchStatement$;

/**
 * class Serializer$CatchStatement$E extends Object
 * @constructor
 */
function Serializer$CatchStatement$E() {
}

/**
 * @constructor
 */
function Serializer$CatchStatement$E$() {
};

Serializer$CatchStatement$E$.prototype = new Serializer$CatchStatement$E;

/**
 * @param {Array.<undefined|CatchStatement>} a
 * @return {*}
 */
Serializer$CatchStatement$E.serializeArray$ALCatchStatement$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$CatchStatement$E$serializeArray$ALCatchStatement$ = Serializer$CatchStatement$E.serializeArray$ALCatchStatement$;

/**
 * @param {CatchStatement} v
 * @return {*}
 */
Serializer$CatchStatement$E.serializeNullable$LCatchStatement$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$CatchStatement$E$serializeNullable$LCatchStatement$ = Serializer$CatchStatement$E.serializeNullable$LCatchStatement$;

/**
 * class Serializer$ParsedObjectType$E extends Object
 * @constructor
 */
function Serializer$ParsedObjectType$E() {
}

/**
 * @constructor
 */
function Serializer$ParsedObjectType$E$() {
};

Serializer$ParsedObjectType$E$.prototype = new Serializer$ParsedObjectType$E;

/**
 * @param {Array.<undefined|ParsedObjectType>} a
 * @return {*}
 */
Serializer$ParsedObjectType$E.serializeArray$ALParsedObjectType$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$ParsedObjectType$E$serializeArray$ALParsedObjectType$ = Serializer$ParsedObjectType$E.serializeArray$ALParsedObjectType$;

/**
 * @param {ParsedObjectType} v
 * @return {*}
 */
Serializer$ParsedObjectType$E.serializeNullable$LParsedObjectType$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$ = Serializer$ParsedObjectType$E.serializeNullable$LParsedObjectType$;

/**
 * class Serializer$MemberDefinition$E extends Object
 * @constructor
 */
function Serializer$MemberDefinition$E() {
}

/**
 * @constructor
 */
function Serializer$MemberDefinition$E$() {
};

Serializer$MemberDefinition$E$.prototype = new Serializer$MemberDefinition$E;

/**
 * @param {Array.<undefined|MemberDefinition>} a
 * @return {*}
 */
Serializer$MemberDefinition$E.serializeArray$ALMemberDefinition$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$MemberDefinition$E$serializeArray$ALMemberDefinition$ = Serializer$MemberDefinition$E.serializeArray$ALMemberDefinition$;

/**
 * @param {MemberDefinition} v
 * @return {*}
 */
Serializer$MemberDefinition$E.serializeNullable$LMemberDefinition$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$MemberDefinition$E$serializeNullable$LMemberDefinition$ = Serializer$MemberDefinition$E.serializeNullable$LMemberDefinition$;

/**
 * class Serializer$ArgumentDeclaration$E extends Object
 * @constructor
 */
function Serializer$ArgumentDeclaration$E() {
}

/**
 * @constructor
 */
function Serializer$ArgumentDeclaration$E$() {
};

Serializer$ArgumentDeclaration$E$.prototype = new Serializer$ArgumentDeclaration$E;

/**
 * @param {Array.<undefined|ArgumentDeclaration>} a
 * @return {*}
 */
Serializer$ArgumentDeclaration$E.serializeArray$ALArgumentDeclaration$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$ArgumentDeclaration$E$serializeArray$ALArgumentDeclaration$ = Serializer$ArgumentDeclaration$E.serializeArray$ALArgumentDeclaration$;

/**
 * @param {ArgumentDeclaration} v
 * @return {*}
 */
Serializer$ArgumentDeclaration$E.serializeNullable$LArgumentDeclaration$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$ArgumentDeclaration$E$serializeNullable$LArgumentDeclaration$ = Serializer$ArgumentDeclaration$E.serializeNullable$LArgumentDeclaration$;

/**
 * class Serializer$LocalVariable$E extends Object
 * @constructor
 */
function Serializer$LocalVariable$E() {
}

/**
 * @constructor
 */
function Serializer$LocalVariable$E$() {
};

Serializer$LocalVariable$E$.prototype = new Serializer$LocalVariable$E;

/**
 * @param {Array.<undefined|LocalVariable>} a
 * @return {*}
 */
Serializer$LocalVariable$E.serializeArray$ALLocalVariable$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$LocalVariable$E$serializeArray$ALLocalVariable$ = Serializer$LocalVariable$E.serializeArray$ALLocalVariable$;

/**
 * @param {LocalVariable} v
 * @return {*}
 */
Serializer$LocalVariable$E.serializeNullable$LLocalVariable$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$LocalVariable$E$serializeNullable$LLocalVariable$ = Serializer$LocalVariable$E.serializeNullable$LLocalVariable$;

/**
 * class TypedMap$Array$Type$E$MemberFunctionDefinition$E extends Object
 * @constructor
 */
function TypedMap$Array$Type$E$MemberFunctionDefinition$E() {
}

/**
 * @constructor
 */
function TypedMap$Array$Type$E$MemberFunctionDefinition$E$() {
	var $this = this;
	TypedMap$Array$Type$E$MemberFunctionDefinition$E$F$ALType$ALType$B$.call(this, (function (x, y) {
		return x == y;
	}));
};

TypedMap$Array$Type$E$MemberFunctionDefinition$E$.prototype = new TypedMap$Array$Type$E$MemberFunctionDefinition$E;

/**
 * @constructor
 * @param {*} equalsCallback
 */
function TypedMap$Array$Type$E$MemberFunctionDefinition$E$F$ALType$ALType$B$(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

TypedMap$Array$Type$E$MemberFunctionDefinition$E$F$ALType$ALType$B$.prototype = new TypedMap$Array$Type$E$MemberFunctionDefinition$E;

/**
 * @return {TypedMap$Array$Type$E$MemberFunctionDefinition$E}
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.clone$ = function () {
	/** @type {TypedMap$Array$Type$E$MemberFunctionDefinition$E} */
	var x;
	x = new TypedMap$Array$Type$E$MemberFunctionDefinition$E$F$ALType$ALType$B$(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};

/**
 * @param {Array.<undefined|Type>} key
 * @return {!boolean}
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.has$ALType$ = function (key) {
	var $this = this;
	return ! this.forEach$F$ALType$LMemberFunctionDefinition$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};

/**
 * @param {Array.<undefined|Type>} key
 * @param {MemberFunctionDefinition} val
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.set$ALType$LMemberFunctionDefinition$ = function (key, val) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$Array$Type$E$MemberFunctionDefinition$E$ALType$LMemberFunctionDefinition$(key, val));
};

/**
 * @param {Array.<undefined|Type>} key
 * @return {MemberFunctionDefinition}
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.get$ALType$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};

/**
 * @param {Array.<undefined|Type>} key
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.delete$ALType$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};

/**
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.forEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$Array$Type$E$MemberFunctionDefinition$E} */
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.reversedForEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$Array$Type$E$MemberFunctionDefinition$E} */
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * class Pair$Array$Type$E$MemberFunctionDefinition$E extends Object
 * @constructor
 */
function Pair$Array$Type$E$MemberFunctionDefinition$E() {
}

/**
 * @constructor
 * @param {Array.<undefined|Type>} first
 * @param {MemberFunctionDefinition} second
 */
function Pair$Array$Type$E$MemberFunctionDefinition$E$ALType$LMemberFunctionDefinition$(first, second) {
	this.first = first;
	this.second = second;
};

Pair$Array$Type$E$MemberFunctionDefinition$E$ALType$LMemberFunctionDefinition$.prototype = new Pair$Array$Type$E$MemberFunctionDefinition$E;

/**
 * class Serializer$Import$E extends Object
 * @constructor
 */
function Serializer$Import$E() {
}

/**
 * @constructor
 */
function Serializer$Import$E$() {
};

Serializer$Import$E$.prototype = new Serializer$Import$E;

/**
 * @param {Array.<undefined|Import>} a
 * @return {*}
 */
Serializer$Import$E.serializeArray$ALImport$ = function (a) {
	/** @type {Array.<undefined|*>} */
	var ret;
	/** @type {!number} */
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++ i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

var Serializer$Import$E$serializeArray$ALImport$ = Serializer$Import$E.serializeArray$ALImport$;

/**
 * @param {Import} v
 * @return {*}
 */
Serializer$Import$E.serializeNullable$LImport$ = function (v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

var Serializer$Import$E$serializeNullable$LImport$ = Serializer$Import$E.serializeNullable$LImport$;

/**
 * class Pair$ClassDefinition$MemberFunctionDefinition$E extends Object
 * @constructor
 */
function Pair$ClassDefinition$MemberFunctionDefinition$E() {
}

/**
 * @constructor
 * @param {ClassDefinition} first
 * @param {MemberFunctionDefinition} second
 */
function Pair$ClassDefinition$MemberFunctionDefinition$E$LClassDefinition$LMemberFunctionDefinition$(first, second) {
	this.first = first;
	this.second = second;
};

Pair$ClassDefinition$MemberFunctionDefinition$E$LClassDefinition$LMemberFunctionDefinition$.prototype = new Pair$ClassDefinition$MemberFunctionDefinition$E;

/**
 * class TypedMap$LocalVariable$boolean$E extends Object
 * @constructor
 */
function TypedMap$LocalVariable$boolean$E() {
}

/**
 * @constructor
 */
function TypedMap$LocalVariable$boolean$E$() {
	var $this = this;
	TypedMap$LocalVariable$boolean$E$F$LLocalVariable$LLocalVariable$B$.call(this, (function (x, y) {
		return x == y;
	}));
};

TypedMap$LocalVariable$boolean$E$.prototype = new TypedMap$LocalVariable$boolean$E;

/**
 * @constructor
 * @param {*} equalsCallback
 */
function TypedMap$LocalVariable$boolean$E$F$LLocalVariable$LLocalVariable$B$(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

TypedMap$LocalVariable$boolean$E$F$LLocalVariable$LLocalVariable$B$.prototype = new TypedMap$LocalVariable$boolean$E;

/**
 * @return {TypedMap$LocalVariable$boolean$E}
 */
TypedMap$LocalVariable$boolean$E.prototype.clone$ = function () {
	/** @type {TypedMap$LocalVariable$boolean$E} */
	var x;
	x = new TypedMap$LocalVariable$boolean$E$F$LLocalVariable$LLocalVariable$B$(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};

/**
 * @param {LocalVariable} key
 * @return {!boolean}
 */
TypedMap$LocalVariable$boolean$E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$BB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};

/**
 * @param {LocalVariable} key
 * @param {!boolean} val
 */
TypedMap$LocalVariable$boolean$E.prototype.set$LLocalVariable$B = function (key, val) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$LocalVariable$boolean$E$LLocalVariable$B(key, val));
};

/**
 * @param {LocalVariable} key
 * @return {undefined|!boolean}
 */
TypedMap$LocalVariable$boolean$E.prototype.get$LLocalVariable$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};

/**
 * @param {LocalVariable} key
 */
TypedMap$LocalVariable$boolean$E.prototype.delete$LLocalVariable$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};

/**
 */
TypedMap$LocalVariable$boolean$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$LocalVariable$boolean$E.prototype.forEach$F$LLocalVariable$BB$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$LocalVariable$boolean$E} */
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$LocalVariable$boolean$E.prototype.reversedForEach$F$LLocalVariable$BB$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$LocalVariable$boolean$E} */
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * class Pair$LocalVariable$boolean$E extends Object
 * @constructor
 */
function Pair$LocalVariable$boolean$E() {
}

/**
 * @constructor
 * @param {LocalVariable} first
 * @param {!boolean} second
 */
function Pair$LocalVariable$boolean$E$LLocalVariable$B(first, second) {
	this.first = first;
	this.second = second;
};

Pair$LocalVariable$boolean$E$LLocalVariable$B.prototype = new Pair$LocalVariable$boolean$E;

/**
 * class TypedMap$LocalVariable$Expression$E extends Object
 * @constructor
 */
function TypedMap$LocalVariable$Expression$E() {
}

/**
 * @constructor
 */
function TypedMap$LocalVariable$Expression$E$() {
	var $this = this;
	TypedMap$LocalVariable$Expression$E$F$LLocalVariable$LLocalVariable$B$.call(this, (function (x, y) {
		return x == y;
	}));
};

TypedMap$LocalVariable$Expression$E$.prototype = new TypedMap$LocalVariable$Expression$E;

/**
 * @constructor
 * @param {*} equalsCallback
 */
function TypedMap$LocalVariable$Expression$E$F$LLocalVariable$LLocalVariable$B$(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

TypedMap$LocalVariable$Expression$E$F$LLocalVariable$LLocalVariable$B$.prototype = new TypedMap$LocalVariable$Expression$E;

/**
 * @return {TypedMap$LocalVariable$Expression$E}
 */
TypedMap$LocalVariable$Expression$E.prototype.clone$ = function () {
	/** @type {TypedMap$LocalVariable$Expression$E} */
	var x;
	x = new TypedMap$LocalVariable$Expression$E$F$LLocalVariable$LLocalVariable$B$(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};

/**
 * @param {LocalVariable} key
 * @return {!boolean}
 */
TypedMap$LocalVariable$Expression$E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$LExpression$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};

/**
 * @param {LocalVariable} key
 * @param {Expression} val
 */
TypedMap$LocalVariable$Expression$E.prototype.set$LLocalVariable$LExpression$ = function (key, val) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$LocalVariable$Expression$E$LLocalVariable$LExpression$(key, val));
};

/**
 * @param {LocalVariable} key
 * @return {Expression}
 */
TypedMap$LocalVariable$Expression$E.prototype.get$LLocalVariable$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};

/**
 * @param {LocalVariable} key
 */
TypedMap$LocalVariable$Expression$E.prototype.delete$LLocalVariable$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};

/**
 */
TypedMap$LocalVariable$Expression$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$LocalVariable$Expression$E.prototype.forEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$LocalVariable$Expression$E} */
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$LocalVariable$Expression$E.prototype.reversedForEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$LocalVariable$Expression$E} */
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * class Pair$LocalVariable$Expression$E extends Object
 * @constructor
 */
function Pair$LocalVariable$Expression$E() {
}

/**
 * @constructor
 * @param {LocalVariable} first
 * @param {Expression} second
 */
function Pair$LocalVariable$Expression$E$LLocalVariable$LExpression$(first, second) {
	this.first = first;
	this.second = second;
};

Pair$LocalVariable$Expression$E$LLocalVariable$LExpression$.prototype = new Pair$LocalVariable$Expression$E;

/**
 * class Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E extends Object
 * @constructor
 */
function Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E() {
}

/**
 * @constructor
 * @param {LocalVariable} first
 * @param {AssignmentExpression} second
 * @param {*} third
 */
function Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E$LLocalVariable$LAssignmentExpression$F$LExpression$V$(first, second, third) {
	this.first = first;
	this.second = second;
	this.third = third;
};

Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E$LLocalVariable$LAssignmentExpression$F$LExpression$V$.prototype = new Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E;

/**
 * class Pair$AssignmentExpression$function$$$$Expression$$$$void$E extends Object
 * @constructor
 */
function Pair$AssignmentExpression$function$$$$Expression$$$$void$E() {
}

/**
 * @constructor
 * @param {AssignmentExpression} first
 * @param {*} second
 */
function Pair$AssignmentExpression$function$$$$Expression$$$$void$E$LAssignmentExpression$F$LExpression$V$(first, second) {
	this.first = first;
	this.second = second;
};

Pair$AssignmentExpression$function$$$$Expression$$$$void$E$LAssignmentExpression$F$LExpression$V$.prototype = new Pair$AssignmentExpression$function$$$$Expression$$$$void$E;

/**
 * class TypedMap$ClassDefinition$string$E extends Object
 * @constructor
 */
function TypedMap$ClassDefinition$string$E() {
}

/**
 * @constructor
 */
function TypedMap$ClassDefinition$string$E$() {
	var $this = this;
	TypedMap$ClassDefinition$string$E$F$LClassDefinition$LClassDefinition$B$.call(this, (function (x, y) {
		return x == y;
	}));
};

TypedMap$ClassDefinition$string$E$.prototype = new TypedMap$ClassDefinition$string$E;

/**
 * @constructor
 * @param {*} equalsCallback
 */
function TypedMap$ClassDefinition$string$E$F$LClassDefinition$LClassDefinition$B$(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

TypedMap$ClassDefinition$string$E$F$LClassDefinition$LClassDefinition$B$.prototype = new TypedMap$ClassDefinition$string$E;

/**
 * @return {TypedMap$ClassDefinition$string$E}
 */
TypedMap$ClassDefinition$string$E.prototype.clone$ = function () {
	/** @type {TypedMap$ClassDefinition$string$E} */
	var x;
	x = new TypedMap$ClassDefinition$string$E$F$LClassDefinition$LClassDefinition$B$(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};

/**
 * @param {ClassDefinition} key
 * @return {!boolean}
 */
TypedMap$ClassDefinition$string$E.prototype.has$LClassDefinition$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LClassDefinition$SB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};

/**
 * @param {ClassDefinition} key
 * @param {!string} val
 */
TypedMap$ClassDefinition$string$E.prototype.set$LClassDefinition$S = function (key, val) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$ClassDefinition$string$E$LClassDefinition$S(key, val));
};

/**
 * @param {ClassDefinition} key
 * @return {undefined|!string}
 */
TypedMap$ClassDefinition$string$E.prototype.get$LClassDefinition$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};

/**
 * @param {ClassDefinition} key
 */
TypedMap$ClassDefinition$string$E.prototype.delete$LClassDefinition$ = function (key) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};

/**
 */
TypedMap$ClassDefinition$string$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$ClassDefinition$string$E.prototype.forEach$F$LClassDefinition$SB$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$ClassDefinition$string$E} */
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TypedMap$ClassDefinition$string$E.prototype.reversedForEach$F$LClassDefinition$SB$ = function (cb) {
	/** @type {!number} */
	var i;
	/** @type {Pair$ClassDefinition$string$E} */
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};

/**
 * class Pair$ClassDefinition$string$E extends Object
 * @constructor
 */
function Pair$ClassDefinition$string$E() {
}

/**
 * @constructor
 * @param {ClassDefinition} first
 * @param {!string} second
 */
function Pair$ClassDefinition$string$E$LClassDefinition$S(first, second) {
	this.first = first;
	this.second = second;
};

Pair$ClassDefinition$string$E$LClassDefinition$S.prototype = new Pair$ClassDefinition$string$E;

/**
 * class _TypeAnnotation extends Object
 * @constructor
 */
function _TypeAnnotation() {
}

/**
 * @constructor
 */
function _TypeAnnotation$() {
};

_TypeAnnotation$.prototype = new _TypeAnnotation;

/**
 * @param {Type} type
 * @return {undefined|!string}
 */
_TypeAnnotation.toClosureType$LType$ = function (type) {
	/** @type {ClassDefinition} */
	var classDef;
	if (type.equals$LType$(Type.booleanType)) {
		return "!boolean";
	} else {
		if (type.equals$LType$(Type.integerType) || type.equals$LType$(Type.numberType)) {
			return "!number";
		} else {
			if (type.equals$LType$(Type.stringType)) {
				return "!string";
			} else {
				if (type instanceof NullableType) {
					return "undefined|" + _TypeAnnotation$toClosureType$LType$(type.getBaseType$());
				} else {
					if (type instanceof ObjectType) {
						classDef = type.getClassDef$();
						if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Array") {
							return "Array.<undefined|" + _TypeAnnotation$toClosureType$LType$(classDef.getTypeArguments$()[0]) + ">";
						} else {
							if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map") {
								return "Object.<string, undefined|" + _TypeAnnotation$toClosureType$LType$(classDef.getTypeArguments$()[0]) + ">";
							} else {
								return classDef.getOutputClassName$();
							}
						}
					} else {
						if (type instanceof VariantType) {
							return "*";
						} else {
							if (type instanceof FunctionType) {
								return "*";
							}
						}
					}
				}
			}
		}
	}
	return null;
};

var _TypeAnnotation$toClosureType$LType$ = _TypeAnnotation.toClosureType$LType$;

/**
 * @param {!string} template
 * @param {Type} type
 * @return {!string}
 */
_TypeAnnotation.build$SLType$ = function (template, type) {
	/** @type {undefined|!string} */
	var closureType;
	closureType = _TypeAnnotation$toClosureType$LType$(type);
	if (closureType == null) {
		return "";
	}
	return Util$format$SAS(template, [ closureType ]);
};

var _TypeAnnotation$build$SLType$ = _TypeAnnotation.build$SLType$;

/**
 * class _StatementEmitter extends Object
 * @constructor
 */
function _StatementEmitter() {
}

/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 */
function _StatementEmitter$LJavaScriptEmitter$(emitter) {
	this._emitter = emitter;
};

_StatementEmitter$LJavaScriptEmitter$.prototype = new _StatementEmitter;

/**
 * @param {LabellableStatement} statement
 */
_StatementEmitter.prototype.emitLabelOfStatement$LLabellableStatement$ = function (statement) {
	/** @type {Token} */
	var label;
	label = statement.getLabel$();
	if (label != null) {
		this._emitter._reduceIndent$();
		this._emitter._emit$SLToken$(label.getValue$() + ":\n", label);
		this._emitter._advanceIndent$();
	}
};

/**
 * class _ConstructorInvocationStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ConstructorInvocationStatementEmitter() {
}

_ConstructorInvocationStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ConstructorInvocationStatement} statement
 */
function _ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$.prototype = new _ConstructorInvocationStatementEmitter;

/**
 */
_ConstructorInvocationStatementEmitter.prototype.emit$ = function () {
	/** @type {ResolvedFunctionType} */
	var ctorType;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!string} */
	var ctorName;
	/** @type {Token} */
	var token;
	ctorType = this._statement.getConstructorType$();
	argTypes = (ctorType != null ? ctorType.getArgumentTypes$() : []);
	ctorName = this._emitter._mangleConstructorName$LClassDefinition$ALType$(this._statement.getConstructingClassDef$(), argTypes);
	token = this._statement.getToken$();
	if (ctorName === "Error" && this._statement.getArguments$().length === 1) {
		this._emitter._emit$SLToken$("Error.call(this);\n", token);
		this._emitter._emit$SLToken$("this.message = ", token);
		this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getArguments$()[0]).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		this._emitter._emit$SLToken$(";\n", token);
	} else {
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(token, ctorName + ".call(this", this._statement.getArguments$(), argTypes);
		this._emitter._emit$SLToken$(";\n", token);
	}
};

/**
 * class _ExpressionStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ExpressionStatementEmitter() {
}

_ExpressionStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ExpressionStatement} statement
 */
function _ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$.prototype = new _ExpressionStatementEmitter;

/**
 */
_ExpressionStatementEmitter.prototype.emit$ = function () {
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};

/**
 * class _ReturnStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ReturnStatementEmitter() {
}

_ReturnStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ReturnStatement} statement
 */
function _ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$.prototype = new _ReturnStatementEmitter;

/**
 */
_ReturnStatementEmitter.prototype.emit$ = function () {
	/** @type {Expression} */
	var expr;
	expr = this._statement.getExpr$();
	if (expr != null) {
		this._emitter._emit$SLToken$("return ", null);
		if (this._emitter._enableProfiler) {
			this._emitter._emit$SLToken$("$__jsx_profiler.exit(", null);
		}
		this._emitter._emitRHSOfAssignment$LExpression$LType$(this._statement.getExpr$(), this._emitter._emittingFunction.getReturnType$());
		if (this._emitter._enableProfiler) {
			this._emitter._emit$SLToken$(")", null);
		}
		this._emitter._emit$SLToken$(";\n", null);
	} else {
		if (this._emitter._enableProfiler) {
			this._emitter._emit$SLToken$("return $__jsx_profiler.exit();\n", this._statement.getToken$());
		} else {
			this._emitter._emit$SLToken$("return;\n", this._statement.getToken$());
		}
	}
};

/**
 * class _DeleteStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _DeleteStatementEmitter() {
}

_DeleteStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {DeleteStatement} statement
 */
function _DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$.prototype = new _DeleteStatementEmitter;

/**
 */
_DeleteStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("delete ", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};

/**
 * class _BreakStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _BreakStatementEmitter() {
}

_BreakStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {BreakStatement} statement
 */
function _BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$.prototype = new _BreakStatementEmitter;

/**
 */
_BreakStatementEmitter.prototype.emit$ = function () {
	if (this._statement.getLabel$() != null) {
		this._emitter._emit$SLToken$("break " + this._statement.getLabel$().getValue$() + ";\n", this._statement.getToken$());
	} else {
		this._emitter._emit$SLToken$("break;\n", this._statement.getToken$());
	}
};

/**
 * class _ContinueStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ContinueStatementEmitter() {
}

_ContinueStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ContinueStatement} statement
 */
function _ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$.prototype = new _ContinueStatementEmitter;

/**
 */
_ContinueStatementEmitter.prototype.emit$ = function () {
	if (this._statement.getLabel$() != null) {
		this._emitter._emit$SLToken$("continue " + this._statement.getLabel$().getValue$() + ";\n", this._statement.getToken$());
	} else {
		this._emitter._emit$SLToken$("continue;\n", this._statement.getToken$());
	}
};

/**
 * class _DoWhileStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _DoWhileStatementEmitter() {
}

_DoWhileStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {DoWhileStatement} statement
 */
function _DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$.prototype = new _DoWhileStatementEmitter;

/**
 */
_DoWhileStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("do {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("} while (", null);
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(");\n", null);
};

/**
 * class _ForInStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ForInStatementEmitter() {
}

_ForInStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ForInStatement} statement
 */
function _ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$.prototype = new _ForInStatementEmitter;

/**
 */
_ForInStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("for (", null);
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getLHSExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(" in ", null);
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getListExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};

/**
 * class _ForStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ForStatementEmitter() {
}

_ForStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ForStatement} statement
 */
function _ForStatementEmitter$LJavaScriptEmitter$LForStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ForStatementEmitter$LJavaScriptEmitter$LForStatement$.prototype = new _ForStatementEmitter;

/**
 */
_ForStatementEmitter.prototype.emit$ = function () {
	/** @type {Expression} */
	var initExpr;
	/** @type {Expression} */
	var condExpr;
	/** @type {Expression} */
	var postExpr;
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("for (", this._statement.getToken$());
	initExpr = this._statement.getInitExpr$();
	if (initExpr != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(initExpr).emit$N(0);
	}
	this._emitter._emit$SLToken$("; ", null);
	condExpr = this._statement.getCondExpr$();
	if (condExpr != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(condExpr).emit$N(0);
	}
	this._emitter._emit$SLToken$("; ", null);
	postExpr = this._statement.getPostExpr$();
	if (postExpr != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(postExpr).emit$N(0);
	}
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};

/**
 * class _IfStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _IfStatementEmitter() {
}

_IfStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {IfStatement} statement
 */
function _IfStatementEmitter$LJavaScriptEmitter$LIfStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_IfStatementEmitter$LJavaScriptEmitter$LIfStatement$.prototype = new _IfStatementEmitter;

/**
 */
_IfStatementEmitter.prototype.emit$ = function () {
	/** @type {Array.<undefined|Statement>} */
	var ifFalseStatements;
	this._emitter._emit$SLToken$("if (", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getOnTrueStatements$());
	ifFalseStatements = this._statement.getOnFalseStatements$();
	if (ifFalseStatements.length !== 0) {
		this._emitter._emit$SLToken$("} else {\n", null);
		this._emitter._emitStatements$ALStatement$(ifFalseStatements);
	}
	this._emitter._emit$SLToken$("}\n", null);
};

/**
 * class _SwitchStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _SwitchStatementEmitter() {
}

_SwitchStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {SwitchStatement} statement
 */
function _SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$.prototype = new _SwitchStatementEmitter;

/**
 */
_SwitchStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("switch (", this._statement.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._statement.getExpr$(), 0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};

/**
 * class _CaseStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _CaseStatementEmitter() {
}

_CaseStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {CaseStatement} statement
 */
function _CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$.prototype = new _CaseStatementEmitter;

/**
 */
_CaseStatementEmitter.prototype.emit$ = function () {
	this._emitter._reduceIndent$();
	this._emitter._emit$SLToken$("case ", null);
	this._emitter._emitWithNullableGuard$LExpression$N(this._statement.getExpr$(), 0);
	this._emitter._emit$SLToken$(":\n", null);
	this._emitter._advanceIndent$();
};

/**
 * class _DefaultStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _DefaultStatementEmitter() {
}

_DefaultStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {DefaultStatement} statement
 */
function _DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$.prototype = new _DefaultStatementEmitter;

/**
 */
_DefaultStatementEmitter.prototype.emit$ = function () {
	this._emitter._reduceIndent$();
	this._emitter._emit$SLToken$("default:\n", null);
	this._emitter._advanceIndent$();
};

/**
 * class _WhileStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _WhileStatementEmitter() {
}

_WhileStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {WhileStatement} statement
 */
function _WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$.prototype = new _WhileStatementEmitter;

/**
 */
_WhileStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("while (", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};

/**
 * class _TryStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _TryStatementEmitter() {
}

_TryStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {TryStatement} statement
 */
function _TryStatementEmitter$LJavaScriptEmitter$LTryStatement$(emitter, statement) {
	/** @type {!number} */
	var outerCatchStatements;
	/** @type {!number} */
	var i;
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._emittingLocalName = "";
	this._statement = statement;
	outerCatchStatements = 0;
	for (i = 0; i < this._emitter._emittingStatementStack.length; ++ i) {
		if (this._emitter._emittingStatementStack[i] instanceof _TryStatementEmitter) {
			++ outerCatchStatements;
		}
	}
	this._emittingLocalName = "$__jsx_catch_" + (outerCatchStatements + "");
};

_TryStatementEmitter$LJavaScriptEmitter$LTryStatement$.prototype = new _TryStatementEmitter;

/**
 */
_TryStatementEmitter.prototype.emit$ = function () {
	var $this = this;
	/** @type {Array.<undefined|CatchStatement>} */
	var catchStatements;
	/** @type {Array.<undefined|Statement>} */
	var finallyStatements;
	this._emitter._emit$SLToken$("try {\n", this._statement.getToken$());
	this._emitter._emitStatements$ALStatement$(this._statement.getTryStatements$());
	this._emitter._emit$SLToken$("}", null);
	catchStatements = this._statement.getCatchStatements$();
	if (catchStatements.length !== 0) {
		this._emitter._emit$SLToken$(" catch (" + this._emittingLocalName + ") {\n", null);
		if (this._emitter._enableProfiler) {
			this._emitter._advanceIndent$();
			this._emitter._emit$SLToken$("$__jsx_profiler.resume($__jsx_profiler_ctx);\n", null);
			this._emitter._reduceIndent$();
		}
		this._emitter._emitStatements$ALStatement$(catchStatements.map((function (s) {
			return s;
		})));
		if (! catchStatements[catchStatements.length - 1].getLocal$().getType$().equals$LType$(Type.variantType)) {
			this._emitter._advanceIndent$();
			this._emitter._emit$SLToken$("{\n", null);
			this._emitter._advanceIndent$();
			this._emitter._emit$SLToken$("throw " + this._emittingLocalName + ";\n", null);
			this._emitter._reduceIndent$();
			this._emitter._emit$SLToken$("}\n", null);
			this._emitter._reduceIndent$();
		}
		this._emitter._emit$SLToken$("}", null);
	}
	finallyStatements = this._statement.getFinallyStatements$();
	if (finallyStatements.length !== 0) {
		this._emitter._emit$SLToken$(" finally {\n", null);
		this._emitter._emitStatements$ALStatement$(finallyStatements);
		this._emitter._emit$SLToken$("}", null);
	}
	this._emitter._emit$SLToken$("\n", null);
};

/**
 * @return {!string}
 */
_TryStatementEmitter.prototype.getEmittingLocalName$ = function () {
	return this._emittingLocalName;
};

/**
 * class _CatchStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _CatchStatementEmitter() {
}

_CatchStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {CatchStatement} statement
 */
function _CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$.prototype = new _CatchStatementEmitter;

/**
 */
_CatchStatementEmitter.prototype.emit$ = function () {
	/** @type {Type} */
	var localType;
	/** @type {_TryStatementEmitter} */
	var tryStatement;
	/** @type {!string} */
	var localName;
	localType = this._statement.getLocal$().getType$();
	if (localType instanceof ObjectType) {
		tryStatement = this._emitter._emittingStatementStack[this._emitter._emittingStatementStack.length - 2];
		localName = tryStatement.getEmittingLocalName$();
		this._emitter._emit$SLToken$("if (" + localName + " instanceof " + localType.getClassDef$().getOutputClassName$() + ") {\n", this._statement.getToken$());
		this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
		this._emitter._emit$SLToken$("} else ", null);
	} else {
		this._emitter._emit$SLToken$("{\n", null);
		this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
		this._emitter._emit$SLToken$("}\n", null);
	}
};

/**
 * @param {JavaScriptEmitter} emitter
 * @param {!string} name
 * @return {!string}
 */
_CatchStatementEmitter.getLocalNameFor$LJavaScriptEmitter$S = function (emitter, name) {
	/** @type {!number} */
	var i;
	/** @type {_CatchStatementEmitter} */
	var catchStatement;
	/** @type {_StatementEmitter} */
	var tryEmitter;
	for (i = emitter._emittingStatementStack.length - 1; i >= 0; -- i) {
		if (! (emitter._emittingStatementStack[i] instanceof _CatchStatementEmitter)) {
			continue;
		}
		catchStatement = emitter._emittingStatementStack[i];
		if (catchStatement._statement.getLocal$().getName$().getValue$() === name) {
			tryEmitter = emitter._emittingStatementStack[i - 1];
			if (! (tryEmitter instanceof _TryStatementEmitter)) {
				throw new Error("logic flaw");
			}
			return tryEmitter.getEmittingLocalName$();
		}
	}
	throw new Error("logic flaw");
};

var _CatchStatementEmitter$getLocalNameFor$LJavaScriptEmitter$S = _CatchStatementEmitter.getLocalNameFor$LJavaScriptEmitter$S;

/**
 * class _ThrowStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _ThrowStatementEmitter() {
}

_ThrowStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ThrowStatement} statement
 */
function _ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$.prototype = new _ThrowStatementEmitter;

/**
 */
_ThrowStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("throw ", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};

/**
 * class _AssertStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _AssertStatementEmitter() {
}

_AssertStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {AssertStatement} statement
 */
function _AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$.prototype = new _AssertStatementEmitter;

/**
 */
_AssertStatementEmitter.prototype.emit$ = function () {
	var $this = this;
	/** @type {Expression} */
	var condExpr;
	condExpr = this._statement._expr;
	this._emitter._emitAssertion$F$V$LToken$S((function () {
		$this._emitter._getExpressionEmitterFor$LExpression$(condExpr).emit$N(0);
	}), condExpr.getToken$(), "assertion failure");
};

/**
 * class _LogStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _LogStatementEmitter() {
}

_LogStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {LogStatement} statement
 */
function _LogStatementEmitter$LJavaScriptEmitter$LLogStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_LogStatementEmitter$LJavaScriptEmitter$LLogStatement$.prototype = new _LogStatementEmitter;

/**
 */
_LogStatementEmitter.prototype.emit$ = function () {
	/** @type {Array.<undefined|Expression>} */
	var exprs;
	/** @type {!number} */
	var i;
	this._emitter._emit$SLToken$("console.log(", this._statement.getToken$());
	exprs = this._statement.getExprs$();
	for (i = 0; i < exprs.length; ++ i) {
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", null);
		}
		this._emitter._getExpressionEmitterFor$LExpression$(exprs[i]).emit$N(0);
	}
	this._emitter._emit$SLToken$(");\n", null);
};

/**
 * class _DebuggerStatementEmitter extends _StatementEmitter
 * @constructor
 */
function _DebuggerStatementEmitter() {
}

_DebuggerStatementEmitter.prototype = new _StatementEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {DebuggerStatement} statement
 */
function _DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$(emitter, statement) {
	_StatementEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._statement = statement;
};

_DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$.prototype = new _DebuggerStatementEmitter;

/**
 */
_DebuggerStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("debugger;\n", this._statement.getToken$());
};

/**
 * class _ExpressionEmitter extends Object
 * @constructor
 */
function _ExpressionEmitter() {
}

/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 */
function _ExpressionEmitter$LJavaScriptEmitter$(emitter) {
	this._emitter = emitter;
};

_ExpressionEmitter$LJavaScriptEmitter$.prototype = new _ExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 * @param {!number} precedence
 * @param {*} callback
 */
_ExpressionEmitter.prototype.emitWithPrecedence$NNF$V$ = function (outerOpPrecedence, precedence, callback) {
	if (precedence > outerOpPrecedence) {
		this._emitter._emit$SLToken$("(", null);
		callback();
		this._emitter._emit$SLToken$(")", null);
	} else {
		callback();
	}
};

/**
 * class _LocalExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _LocalExpressionEmitter() {
}

_LocalExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {LocalExpression} expr
 */
function _LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$.prototype = new _LocalExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_LocalExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {LocalVariable} */
	var local;
	/** @type {!string} */
	var localName;
	local = this._expr.getLocal$();
	localName = local.getName$().getValue$();
	if (local instanceof CaughtVariable) {
		localName = _CatchStatementEmitter$getLocalNameFor$LJavaScriptEmitter$S(this._emitter, localName);
	}
	this._emitter._emit$SLToken$(localName, this._expr.getToken$());
};

/**
 * class _ClassExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _ClassExpressionEmitter() {
}

_ClassExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ClassExpression} expr
 */
function _ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$.prototype = new _ClassExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_ClassExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Type} */
	var type;
	type = this._expr.getType$();
	this._emitter._emit$SLToken$(type.getClassDef$().getOutputClassName$(), null);
};

/**
 * class _NullExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _NullExpressionEmitter() {
}

_NullExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {NullExpression} expr
 */
function _NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$.prototype = new _NullExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_NullExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$("null", token);
};

/**
 * class _BooleanLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _BooleanLiteralExpressionEmitter() {
}

_BooleanLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {BooleanLiteralExpression} expr
 */
function _BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$.prototype = new _BooleanLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_BooleanLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};

/**
 * class _IntegerLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _IntegerLiteralExpressionEmitter() {
}

_IntegerLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {IntegerLiteralExpression} expr
 */
function _IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$.prototype = new _IntegerLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_IntegerLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$("" + token.getValue$(), token);
};

/**
 * class _NumberLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _NumberLiteralExpressionEmitter() {
}

_NumberLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {NumberLiteralExpression} expr
 */
function _NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$.prototype = new _NumberLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_NumberLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	/** @type {!string} */
	var str;
	token = this._expr.getToken$();
	str = token.getValue$();
	if (outerOpPrecedence === _PropertyExpressionEmitter._operatorPrecedence && str.indexOf(".") === - 1) {
		this._emitter._emit$SLToken$("(" + str + ")", token);
	} else {
		this._emitter._emit$SLToken$("" + str, token);
	}
};

/**
 * class _StringLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _StringLiteralExpressionEmitter() {
}

_StringLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {StringLiteralExpression} expr
 */
function _StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$.prototype = new _StringLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_StringLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};

/**
 * class _RegExpLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _RegExpLiteralExpressionEmitter() {
}

_RegExpLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {RegExpLiteralExpression} expr
 */
function _RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$.prototype = new _RegExpLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_RegExpLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Token} */
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};

/**
 * class _ArrayLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _ArrayLiteralExpressionEmitter() {
}

_ArrayLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ArrayLiteralExpression} expr
 */
function _ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$.prototype = new _ArrayLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_ArrayLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Array.<undefined|Expression>} */
	var exprs;
	/** @type {!number} */
	var i;
	this._emitter._emit$SLToken$("[ ", null);
	exprs = this._expr.getExprs$();
	for (i = 0; i < exprs.length; ++ i) {
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", null);
		}
		this._emitter._getExpressionEmitterFor$LExpression$(exprs[i]).emit$N(0);
	}
	this._emitter._emit$SLToken$(" ]", null);
};

/**
 * class _MapLiteralExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _MapLiteralExpressionEmitter() {
}

_MapLiteralExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {MapLiteralExpression} expr
 */
function _MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$.prototype = new _MapLiteralExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_MapLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Array.<undefined|MapLiteralElement>} */
	var elements;
	/** @type {!number} */
	var i;
	/** @type {MapLiteralElement} */
	var element;
	this._emitter._emit$SLToken$("({ ", null);
	elements = this._expr.getElements$();
	for (i = 0; i < elements.length; ++ i) {
		element = elements[i];
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", null);
		}
		this._emitter._emit$SLToken$(element.getKey$().getValue$(), element.getKey$());
		this._emitter._emit$SLToken$(": ", null);
		this._emitter._getExpressionEmitterFor$LExpression$(element.getExpr$()).emit$N(0);
	}
	this._emitter._emit$SLToken$(" })", null);
};

/**
 * class _ThisExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _ThisExpressionEmitter() {
}

_ThisExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ThisExpression} expr
 */
function _ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$.prototype = new _ThisExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_ThisExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {MemberFunctionDefinition} */
	var emittingFunction;
	emittingFunction = this._emitter._emittingFunction;
	if ((emittingFunction.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		this._emitter._emit$SLToken$("$this", this._expr.getToken$());
	} else {
		this._emitter._emit$SLToken$("this", this._expr.getToken$());
	}
};

/**
 * class _AsExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _AsExpressionEmitter() {
}

_AsExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {AsExpression} expr
 */
function _AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$.prototype = new _AsExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_AsExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {Type} */
	var srcType;
	/** @type {Type} */
	var destType;
	/** @type {undefined|!number} */
	var prec;
	srcType = this._expr.getExpr$().getType$();
	destType = this._expr.getType$();
	if (srcType instanceof ObjectType || srcType.equals$LType$(Type.variantType)) {
		if (srcType.isConvertibleTo$LType$(destType)) {
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(outerOpPrecedence);
			return;
		}
		if (destType instanceof ObjectType || destType instanceof FunctionType) {
			new _AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$(this._emitter, new AsNoConvertExpression$LToken$LExpression$LType$(this._expr.getToken$(), this._expr.getExpr$(), this._expr.getType$())).emit$N(outerOpPrecedence);
			return;
		}
	}
	if (srcType.resolveIfNullable$().equals$LType$(Type.booleanType)) {
		if (destType.equals$LType$(Type.integerType) || destType.equals$LType$(Type.numberType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "+", null);
			return;
		}
		if (destType.equals$LType$(Type.stringType)) {
			prec = _AdditiveExpressionEmitter._operatorPrecedence;
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " + \"\"");
			return;
		}
	}
	if (srcType.resolveIfNullable$().equals$LType$(Type.integerType)) {
		if (destType.equals$LType$(Type.booleanType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "!! ", null);
			return;
		}
		if (destType.equals$LType$(Type.numberType)) {
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(outerOpPrecedence);
			return;
		}
		if (destType.equals$LType$(Type.stringType)) {
			prec = _AdditiveExpressionEmitter._operatorPrecedence;
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " + \"\"");
			return;
		}
	}
	if (srcType.resolveIfNullable$().equals$LType$(Type.numberType)) {
		if (destType.equals$LType$(Type.booleanType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "!! ", null);
			return;
		}
		if (destType.equals$LType$(Type.integerType)) {
			prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " | 0");
			return;
		}
		if (destType.equals$LType$(Type.stringType)) {
			prec = _AdditiveExpressionEmitter._operatorPrecedence;
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " + \"\"");
			return;
		}
	}
	if (srcType.resolveIfNullable$().equals$LType$(Type.stringType)) {
		if (destType.equals$LType$(Type.booleanType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "!! ", null);
			return;
		}
		if (destType.equals$LType$(Type.integerType)) {
			prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " | 0");
			return;
		}
		if (destType.equals$LType$(Type.numberType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "+", null);
			return;
		}
	}
	if (srcType.equals$LType$(Type.variantType)) {
		if (destType.equals$LType$(Type.booleanType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["!"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "!! ", null);
			return;
		}
		if (destType.equals$LType$(Type.integerType)) {
			prec = _BinaryNumberExpressionEmitter._operatorPrecedence["|"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " | 0");
			return;
		}
		if (destType.equals$LType$(Type.numberType)) {
			prec = _UnaryExpressionEmitter._operatorPrecedence["+"];
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, "+", null);
			return;
		}
		if (destType.equals$LType$(Type.stringType)) {
			prec = _AdditiveExpressionEmitter._operatorPrecedence;
			this._emitWithParens$NNNUSUS(outerOpPrecedence, prec, prec, null, " + \"\"");
			return;
		}
	}
	if (srcType.isConvertibleTo$LType$(destType)) {
		if (srcType instanceof NullableType) {
			this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getExpr$(), outerOpPrecedence);
		} else {
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(outerOpPrecedence);
		}
		return;
	}
	throw new Error("explicit conversion logic unknown from " + srcType.toString() + " to " + destType.toString());
};

/**
 * @param {!number} outerOpPrecedence
 * @param {!number} opPrecedence
 * @param {!number} innerOpPrecedence
 * @param {undefined|!string} prefix
 * @param {undefined|!string} postfix
 */
_AsExpressionEmitter.prototype._emitWithParens$NNNUSUS = function (outerOpPrecedence, opPrecedence, innerOpPrecedence, prefix, postfix) {
	if (opPrecedence >= outerOpPrecedence) {
		this._emitter._emit$SLToken$("(", null);
	}
	if (prefix != null) {
		this._emitter._emit$SLToken$(prefix, this._expr.getToken$());
	}
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getExpr$(), innerOpPrecedence);
	if (postfix != null) {
		this._emitter._emit$SLToken$(postfix, this._expr.getToken$());
	}
	if (opPrecedence >= outerOpPrecedence) {
		this._emitter._emit$SLToken$(")", null);
	}
};

/**
 * class _AsNoConvertExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _AsNoConvertExpressionEmitter() {
}

_AsNoConvertExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {AsNoConvertExpression} expr
 */
function _AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$.prototype = new _AsNoConvertExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_AsNoConvertExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	/** @type {*} */
	var emitWithAssertion;
	/** @type {Type} */
	var srcType;
	/** @type {Type} */
	var destType;
	/** @type {ClassDefinition} */
	var destClassDef;
	if (this._emitter._enableRunTimeTypeCheck) {
		emitWithAssertion = (function (emitCheckExpr, message) {
			/** @type {Token} */
			var token;
			token = $this._expr.getToken$();
			$this._emitter._emit$SLToken$("(function (v) {\n", token);
			$this._emitter._advanceIndent$();
			$this._emitter._emitAssertion$F$V$LToken$S(emitCheckExpr, token, message);
			$this._emitter._emit$SLToken$("return v;\n", token);
			$this._emitter._reduceIndent$();
			$this._emitter._emit$SLToken$("}(", token);
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(0);
			$this._emitter._emit$SLToken$("))", token);
		});
		srcType = this._expr.getExpr$().getType$();
		destType = this._expr.getType$();
		if (srcType.equals$LType$(destType) || srcType.equals$LType$(destType.resolveIfNullable$())) {
		} else {
			if (destType instanceof VariantType) {
			} else {
				if (srcType instanceof ObjectType && srcType.isConvertibleTo$LType$(destType)) {
				} else {
					if (destType.equals$LType$(Type.booleanType)) {
						emitWithAssertion((function () {
							$this._emitter._emit$SLToken$("typeof v === \"boolean\"", $this._expr.getToken$());
						}), "detected invalid cast, value is not a boolean");
						return;
					} else {
						if (destType.resolveIfNullable$().equals$LType$(Type.booleanType)) {
							emitWithAssertion((function () {
								$this._emitter._emit$SLToken$("v == null || typeof v === \"boolean\"", $this._expr.getToken$());
							}), "detected invalid cast, value is not a boolean nor null");
							return;
						} else {
							if (destType.equals$LType$(Type.numberType)) {
								emitWithAssertion((function () {
									$this._emitter._emit$SLToken$("typeof v === \"number\"", $this._expr.getToken$());
								}), "detected invalid cast, value is not a number");
								return;
							} else {
								if (destType.resolveIfNullable$().equals$LType$(Type.numberType)) {
									emitWithAssertion((function () {
										$this._emitter._emit$SLToken$("v == null || typeof v === \"number\"", $this._expr.getToken$());
									}), "detected invalid cast, value is not a number nor nullable");
									return;
								} else {
									if (destType.equals$LType$(Type.integerType)) {
										emitWithAssertion((function () {
											$this._emitter._emit$SLToken$("typeof v === \"number\" && (! $__jsx_isFinite(v) || v % 1 === 0)", $this._expr.getToken$());
										}), "detected invalid cast, value is not an int");
										return;
									} else {
										if (destType.resolveIfNullable$().equals$LType$(Type.integerType)) {
											emitWithAssertion((function () {
												$this._emitter._emit$SLToken$("v == null || typeof v === \"number\" && (! $__jsx_isFinite(v) || v % 1 === 0)", $this._expr.getToken$());
											}), "detected invalid cast, value is not an int nor null");
											return;
										} else {
											if (destType.equals$LType$(Type.stringType)) {
												emitWithAssertion((function () {
													$this._emitter._emit$SLToken$("typeof v === \"string\"", $this._expr.getToken$());
												}), "detected invalid cast, value is not a string");
												return;
											} else {
												if (destType.resolveIfNullable$().equals$LType$(Type.stringType)) {
													emitWithAssertion((function () {
														$this._emitter._emit$SLToken$("v == null || typeof v === \"string\"", $this._expr.getToken$());
													}), "detected invalid cast, value is not a string nor null");
													return;
												} else {
													if (destType instanceof FunctionType) {
														emitWithAssertion((function () {
															$this._emitter._emit$SLToken$("v == null || typeof v === \"function\"", $this._expr.getToken$());
														}), "detected invalid cast, value is not a function or null");
														return;
													} else {
														if (destType instanceof ObjectType) {
															destClassDef = destType.getClassDef$();
															if ((destClassDef.flags$() & ClassDefinition.IS_FAKE) !== 0) {
															} else {
																if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName$() === "Array") {
																	emitWithAssertion((function () {
																		$this._emitter._emit$SLToken$("v == null || v instanceof Array", $this._expr.getToken$());
																	}), "detected invalid cast, value is not an Array or null");
																	return;
																} else {
																	if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName$() === "Map") {
																		if (srcType.equals$LType$(Type.variantType)) {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("v == null || typeof v === \"object\" || typeof v === \"function\"", $this._expr.getToken$());
																			}), "detected invalid cast, value is not a Map or null");
																		} else {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("v == null || typeof v === \"object\"", $this._expr.getToken$());
																			}), "detected invalid cast, value is not a Map or null");
																		}
																		return;
																	} else {
																		if ((destClassDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("v == null || v instanceof " + destClassDef.getOutputClassName$(), $this._expr.getToken$());
																			}), "detected invalid cast, value is not an instance of the designated type or null");
																			return;
																		} else {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("v == null || v.$__jsx_implements_" + destClassDef.getOutputClassName$(), $this._expr.getToken$());
																			}), "detected invalid cast, value is not an instance of the designated type or null");
																			return;
																		}
																	}
																}
															}
														} else {
															throw new Error("Hmm");
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(outerOpPrecedence);
	return;
};

/**
 * class _OperatorExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _OperatorExpressionEmitter() {
}

_OperatorExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 */
function _OperatorExpressionEmitter$LJavaScriptEmitter$(emitter) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
};

_OperatorExpressionEmitter$LJavaScriptEmitter$.prototype = new _OperatorExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_OperatorExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	this.emitWithPrecedence$NNF$V$(outerOpPrecedence, this._getPrecedence$(), (function () {
		$this._emit$();
	}));
};

/**
 */
_OperatorExpressionEmitter.prototype._emit$ = function () {
};

/**
 * class _UnaryExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _UnaryExpressionEmitter() {
}

_UnaryExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {UnaryExpression} expr
 */
function _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$.prototype = new _UnaryExpressionEmitter;

/**
 */
_UnaryExpressionEmitter.prototype._emit$ = function () {
	/** @type {Token} */
	var opToken;
	opToken = this._expr.getToken$();
	this._emitter._emit$SLToken$(opToken.getValue$() + " ", opToken);
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(this._getPrecedence$());
};

/**
 * @return {!number}
 */
_UnaryExpressionEmitter.prototype._getPrecedence$ = function () {
	return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_UnaryExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _UnaryExpressionEmitter$_setOperatorPrecedence$SN = _UnaryExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _PostfixExpressionEmitter extends _UnaryExpressionEmitter
 * @constructor
 */
function _PostfixExpressionEmitter() {
}

_PostfixExpressionEmitter.prototype = new _UnaryExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {UnaryExpression} expr
 */
function _PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(emitter, expr) {
	_UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$.call(this, emitter, expr);
};

_PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$.prototype = new _PostfixExpressionEmitter;

/**
 */
_PostfixExpressionEmitter.prototype._emit$ = function () {
	/** @type {Token} */
	var opToken;
	opToken = this._expr.getToken$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(this._getPrecedence$());
	this._emitter._emit$SLToken$(opToken.getValue$(), opToken);
};

/**
 * @return {!number}
 */
_PostfixExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_PostfixExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _PostfixExpressionEmitter$_setOperatorPrecedence$SN = _PostfixExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _InstanceofExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _InstanceofExpressionEmitter() {
}

_InstanceofExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {InstanceofExpression} expr
 */
function _InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$.prototype = new _InstanceofExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_InstanceofExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	/** @type {Type} */
	var expectedType;
	expectedType = this._expr.getExpectedType$();
	if (! (expectedType.getClassDef$() != null)) {
		debugger;
		throw new Error("[src/jsemitter.jsx:1140:42] assertion failure\n        assert expectedType.getClassDef() != null;\n                                          ^^\n");
	}
	if (expectedType.getClassDef$() instanceof InstantiatedClassDefinition && expectedType.getClassDef$().getTemplateClassName$() === "Array") {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_InstanceofExpressionEmitter._operatorPrecedence);
			$this._emitter._emit$SLToken$(" instanceof Array", $this._expr.getToken$());
		}));
	} else {
		if (expectedType.getClassDef$() instanceof InstantiatedClassDefinition && expectedType.getClassDef$().getTemplateClassName$() === "Map") {
			this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
				$this._emitter._emit$SLToken$("(typeof(", $this._expr.getToken$());
				$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_InstanceofExpressionEmitter._operatorPrecedence);
				$this._emitter._emit$SLToken$(") === \"object\")", $this._expr.getToken$());
			}));
		} else {
			if ((expectedType.getClassDef$().flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
					$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_InstanceofExpressionEmitter._operatorPrecedence);
					$this._emitter._emit$SLToken$(" instanceof " + $this.getInstanceofNameFromClassDef$LClassDefinition$(expectedType.getClassDef$()), $this._expr.getToken$());
				}));
			} else {
				this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _CallExpressionEmitter._operatorPrecedence, (function () {
					$this._emitter._emit$SLToken$("(function (o) { return !! (o && o.$__jsx_implements_" + expectedType.getClassDef$().getOutputClassName$() + "); })(", $this._expr.getToken$());
					$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(0);
					$this._emitter._emit$SLToken$(")", $this._expr.getToken$());
				}));
			}
		}
	}
};

/**
 * @param {ClassDefinition} classDef
 * @return {!string}
 */
_InstanceofExpressionEmitter.prototype.getInstanceofNameFromClassDef$LClassDefinition$ = function (classDef) {
	/** @type {!string} */
	var name;
	if (classDef instanceof InstantiatedClassDefinition) {
		name = classDef.getTemplateClassName$();
		if (name === "Map") {
			name = "Object";
		}
	} else {
		name = classDef.getOutputClassName$();
	}
	return name;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_InstanceofExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_InstanceofExpressionEmitter._operatorPrecedence = precedence;
};

var _InstanceofExpressionEmitter$_setOperatorPrecedence$SN = _InstanceofExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _PropertyExpressionEmitter extends _UnaryExpressionEmitter
 * @constructor
 */
function _PropertyExpressionEmitter() {
}

_PropertyExpressionEmitter.prototype = new _UnaryExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {PropertyExpression} expr
 */
function _PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$(emitter, expr) {
	_UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$.call(this, emitter, expr);
};

_PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$.prototype = new _PropertyExpressionEmitter;

/**
 */
_PropertyExpressionEmitter.prototype._emit$ = function () {
	/** @type {PropertyExpression} */
	var expr;
	/** @type {Type} */
	var exprType;
	/** @type {Token} */
	var identifierToken;
	expr = this._expr;
	exprType = expr.getType$();
	identifierToken = expr.getIdentifierToken$();
	if (expr.getExpr$() instanceof ClassExpression && expr.getExpr$().getType$().getClassDef$() == Type.numberType.getClassDef$()) {
		switch (identifierToken.getValue$()) {
		case "parseInt":
		case "parseFloat":
		case "isNaN":
		case "isFinite":
			this._emitter._emit$SLToken$('$__jsx_' + identifierToken.getValue$(), identifierToken);
			return;
		}
	} else {
		if (expr.getExpr$() instanceof ClassExpression && expr.getExpr$().getType$().getClassDef$() == Type.stringType.getClassDef$()) {
			switch (identifierToken.getValue$()) {
			case "encodeURIComponent":
			case "decodeURIComponent":
			case "encodeURI":
			case "decodeURI":
				this._emitter._emit$SLToken$('$__jsx_' + identifierToken.getValue$(), identifierToken);
				return;
			}
		}
	}
	this._emitter._getExpressionEmitterFor$LExpression$(expr.getExpr$()).emit$N(this._getPrecedence$());
	if (exprType instanceof FunctionType && ! exprType.isAssignable$() && (expr.getHolderType$().getClassDef$().flags$() & ClassDefinition.IS_NATIVE) === 0) {
		if (expr.getExpr$() instanceof ClassExpression) {
			this._emitter._emit$SLToken$("$", identifierToken);
		} else {
			this._emitter._emit$SLToken$(".", identifierToken);
		}
		this._emitter._emit$SLToken$(this._emitter._mangleFunctionName$SALType$(identifierToken.getValue$(), exprType.getArgumentTypes$()), identifierToken);
	} else {
		this._emitter._emit$SLToken$(".", identifierToken);
		this._emitter._emit$SLToken$(identifierToken.getValue$(), identifierToken);
	}
};

/**
 * @return {!number}
 */
_PropertyExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PropertyExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_PropertyExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_PropertyExpressionEmitter._operatorPrecedence = precedence;
};

var _PropertyExpressionEmitter$_setOperatorPrecedence$SN = _PropertyExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _FunctionExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _FunctionExpressionEmitter() {
}

_FunctionExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {FunctionExpression} expr
 */
function _FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$.prototype = new _FunctionExpressionEmitter;

/**
 */
_FunctionExpressionEmitter.prototype._emit$ = function () {
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var i;
	funcDef = this._expr.getFuncDef$();
	if (! this._expr.isStatement$()) {
		this._emitter._emit$SLToken$("(", funcDef.getToken$());
	}
	this._emitter._emit$SLToken$("function " + (funcDef.getNameToken$() != null ? funcDef.name$() : "") + "(", funcDef.getToken$());
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++ i) {
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", funcDef.getToken$());
		}
		this._emitter._emit$SLToken$(args[i].getName$().getValue$(), funcDef.getToken$());
	}
	this._emitter._emit$SLToken$(") {\n", funcDef.getToken$());
	this._emitter._advanceIndent$();
	this._emitter._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
	this._emitter._reduceIndent$();
	this._emitter._emit$SLToken$("}", funcDef.getToken$());
	if (! this._expr.isStatement$()) {
		this._emitter._emit$SLToken$(")", funcDef.getToken$());
	}
};

/**
 * @return {!number}
 */
_FunctionExpressionEmitter.prototype._getPrecedence$ = function () {
	return _FunctionExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_FunctionExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_FunctionExpressionEmitter._operatorPrecedence = precedence;
};

var _FunctionExpressionEmitter$_setOperatorPrecedence$SN = _FunctionExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _AdditiveExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _AdditiveExpressionEmitter() {
}

_AdditiveExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {AdditiveExpression} expr
 */
function _AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$.prototype = new _AdditiveExpressionEmitter;

/**
 */
_AdditiveExpressionEmitter.prototype._emit$ = function () {
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _AdditiveExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(" + ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _AdditiveExpressionEmitter._operatorPrecedence - 1);
};

/**
 * @return {!number}
 */
_AdditiveExpressionEmitter.prototype._getPrecedence$ = function () {
	return _AdditiveExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_AdditiveExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_AdditiveExpressionEmitter._operatorPrecedence = precedence;
};

var _AdditiveExpressionEmitter$_setOperatorPrecedence$SN = _AdditiveExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _AssignmentExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _AssignmentExpressionEmitter() {
}

_AssignmentExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {AssignmentExpression} expr
 */
function _AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$.prototype = new _AssignmentExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_AssignmentExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	if (this._expr.getToken$().getValue$() === "/=" && this._expr.getFirstExpr$().getType$().resolveIfNullable$().equals$LType$(Type.integerType)) {
		this._emitDivAssignToInt$N(outerOpPrecedence);
		return;
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};

/**
 */
_AssignmentExpressionEmitter.prototype._emit$ = function () {
	/** @type {!string} */
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitRHSOfAssignment$LExpression$LType$(this._expr.getSecondExpr$(), this._expr.getFirstExpr$().getType$());
};

/**
 * @param {!number} outerOpPrecedence
 */
_AssignmentExpressionEmitter.prototype._emitDivAssignToInt$N = function (outerOpPrecedence) {
	var $this = this;
	/** @type {Expression} */
	var firstExpr;
	/** @type {Expression} */
	var secondExpr;
	firstExpr = this._expr.getFirstExpr$();
	secondExpr = this._expr.getSecondExpr$();
	if (firstExpr instanceof PropertyExpression || firstExpr instanceof ArrayExpression) {
		this._emitter._emit$SLToken$("$__jsx_div_assign(", this._expr.getToken$());
		if (firstExpr instanceof PropertyExpression) {
			this._emitter._getExpressionEmitterFor$LExpression$(firstExpr.getExpr$()).emit$N(0);
			this._emitter._emit$SLToken$(", ", this._expr.getToken$());
			this._emitter._emit$SLToken$(Util$encodeStringLiteral$S(firstExpr.getIdentifierToken$().getValue$()), firstExpr.getIdentifierToken$());
		} else {
			this._emitter._getExpressionEmitterFor$LExpression$(firstExpr.getFirstExpr$()).emit$N(0);
			this._emitter._emit$SLToken$(", ", this._expr.getToken$());
			this._emitter._getExpressionEmitterFor$LExpression$(firstExpr.getSecondExpr$()).emit$N(0);
		}
		this._emitter._emit$SLToken$(", ", this._expr.getToken$());
		this._emitter._emitWithNullableGuard$LExpression$N(secondExpr, 0);
		this._emitter._emit$SLToken$(")", this._expr.getToken$());
	} else {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], (function () {
			$this._emitter._getExpressionEmitterFor$LExpression$(firstExpr).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			$this._emitter._emit$SLToken$(" = (", $this._expr.getToken$());
			$this._emitter._emitWithNullableGuard$LExpression$N(firstExpr, _BinaryNumberExpressionEmitter._operatorPrecedence["/"]);
			$this._emitter._emit$SLToken$(" / ", $this._expr.getToken$());
			$this._emitter._emitWithNullableGuard$LExpression$N(secondExpr, _BinaryNumberExpressionEmitter._operatorPrecedence["/"] - 1);
			$this._emitter._emit$SLToken$(") | 0", $this._expr.getToken$());
		}));
	}
};

/**
 * @return {!number}
 */
_AssignmentExpressionEmitter.prototype._getPrecedence$ = function () {
	return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_AssignmentExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _AssignmentExpressionEmitter$_setOperatorPrecedence$SN = _AssignmentExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _EqualityExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _EqualityExpressionEmitter() {
}

_EqualityExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {EqualityExpression} expr
 */
function _EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$.prototype = new _EqualityExpressionEmitter;

/**
 */
_EqualityExpressionEmitter.prototype._emit$ = function () {
	/** @type {!string} */
	var op;
	/** @type {!string} */
	var emitOp;
	op = this._expr.getToken$().getValue$();
	emitOp = op;
	if (this._expr.getFirstExpr$().getType$() instanceof PrimitiveType && this._expr.getSecondExpr$().getType$() instanceof PrimitiveType) {
		emitOp += "=";
	}
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
	this._emitter._emit$SLToken$(" " + emitOp + " ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
};

/**
 * @return {!number}
 */
_EqualityExpressionEmitter.prototype._getPrecedence$ = function () {
	return _EqualityExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_EqualityExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_EqualityExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _EqualityExpressionEmitter$_setOperatorPrecedence$SN = _EqualityExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _InExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _InExpressionEmitter() {
}

_InExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {InExpression} expr
 */
function _InExpressionEmitter$LJavaScriptEmitter$LInExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_InExpressionEmitter$LJavaScriptEmitter$LInExpression$.prototype = new _InExpressionEmitter;

/**
 */
_InExpressionEmitter.prototype._emit$ = function () {
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _InExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(" in ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_InExpressionEmitter._operatorPrecedence);
};

/**
 * @return {!number}
 */
_InExpressionEmitter.prototype._getPrecedence$ = function () {
	return _InExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_InExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_InExpressionEmitter._operatorPrecedence = precedence;
};

var _InExpressionEmitter$_setOperatorPrecedence$SN = _InExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _LogicalExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _LogicalExpressionEmitter() {
}

_LogicalExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {LogicalExpression} expr
 */
function _LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$.prototype = new _LogicalExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_LogicalExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	if (this._emitter.shouldBooleanize$LExpression$(this._expr)) {
		this._emitter._emit$SLToken$("!! (", this._expr.getToken$());
		_OperatorExpressionEmitter.prototype.emit$N.call(this, 0);
		this._emitter._emit$SLToken$(")", this._expr.getToken$());
		return;
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};

/**
 */
_LogicalExpressionEmitter.prototype._emit$ = function () {
	/** @type {!string} */
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_LogicalExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_LogicalExpressionEmitter._operatorPrecedence[op] - 1);
};

/**
 * @return {!number}
 */
_LogicalExpressionEmitter.prototype._getPrecedence$ = function () {
	return _LogicalExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_LogicalExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_LogicalExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _LogicalExpressionEmitter$_setOperatorPrecedence$SN = _LogicalExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _ShiftExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _ShiftExpressionEmitter() {
}

_ShiftExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ShiftExpression} expr
 */
function _ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$.prototype = new _ShiftExpressionEmitter;

/**
 */
_ShiftExpressionEmitter.prototype._emit$ = function () {
	/** @type {!string} */
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _ShiftExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _ShiftExpressionEmitter._operatorPrecedence[op] - 1);
};

/**
 * @return {!number}
 */
_ShiftExpressionEmitter.prototype._getPrecedence$ = function () {
	return _ShiftExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_ShiftExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_ShiftExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _ShiftExpressionEmitter$_setOperatorPrecedence$SN = _ShiftExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _BinaryNumberExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _BinaryNumberExpressionEmitter() {
}

_BinaryNumberExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {BinaryNumberExpression} expr
 */
function _BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$.prototype = new _BinaryNumberExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_BinaryNumberExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	if (this._expr.getToken$().getValue$() === "*") {
		if (this._emitIfEitherIs$NF$LExpression$LExpression$LExpression$$(outerOpPrecedence, (function (expr1, expr2) {
			return ((expr1 instanceof IntegerLiteralExpression || expr1 instanceof NumberLiteralExpression) && +expr1.getToken$().getValue$() === 1 ? expr2 : null);
		}))) {
			return;
		}
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};

/**
 */
_BinaryNumberExpressionEmitter.prototype._emit$ = function () {
	/** @type {!string} */
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
};

/**
 * @param {!number} outerOpPrecedence
 * @param {*} cb
 * @return {!boolean}
 */
_BinaryNumberExpressionEmitter.prototype._emitIfEitherIs$NF$LExpression$LExpression$LExpression$$ = function (outerOpPrecedence, cb) {
	/** @type {Expression} */
	var outcomeExpr;
	if ((outcomeExpr = cb(this._expr.getFirstExpr$(), this._expr.getSecondExpr$())) != null || (outcomeExpr = cb(this._expr.getSecondExpr$(), this._expr.getFirstExpr$())) != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(outcomeExpr).emit$N(outerOpPrecedence);
		return true;
	} else {
		return false;
	}
};

/**
 * @return {!number}
 */
_BinaryNumberExpressionEmitter.prototype._getPrecedence$ = function () {
	return _BinaryNumberExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_BinaryNumberExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_BinaryNumberExpressionEmitter._operatorPrecedence[op] = precedence;
};

var _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN = _BinaryNumberExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _ArrayExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _ArrayExpressionEmitter() {
}

_ArrayExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ArrayExpression} expr
 */
function _ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$.prototype = new _ArrayExpressionEmitter;

/**
 */
_ArrayExpressionEmitter.prototype._emit$ = function () {
	/** @type {Expression} */
	var secondExpr;
	/** @type {!boolean} */
	var emitted;
	/** @type {!string} */
	var propertyName;
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_ArrayExpressionEmitter._operatorPrecedence);
	secondExpr = this._expr.getSecondExpr$();
	emitted = false;
	if (secondExpr instanceof StringLiteralExpression) {
		propertyName = Util$decodeStringLiteral$S(secondExpr.getToken$().getValue$());
		if (propertyName.match(/^[\$_A-Za-z][\$_0-9A-Za-z]*$/) != null) {
			this._emitter._emit$SLToken$(".", this._expr.getToken$());
			this._emitter._emit$SLToken$(propertyName, secondExpr.getToken$());
			emitted = true;
		}
	}
	if (! emitted) {
		this._emitter._emit$SLToken$("[", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(secondExpr).emit$N(0);
		this._emitter._emit$SLToken$("]", null);
	}
};

/**
 * @return {!number}
 */
_ArrayExpressionEmitter.prototype._getPrecedence$ = function () {
	return _ArrayExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_ArrayExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_ArrayExpressionEmitter._operatorPrecedence = precedence;
};

var _ArrayExpressionEmitter$_setOperatorPrecedence$SN = _ArrayExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _ConditionalExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _ConditionalExpressionEmitter() {
}

_ConditionalExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {ConditionalExpression} expr
 */
function _ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$.prototype = new _ConditionalExpressionEmitter;

/**
 */
_ConditionalExpressionEmitter.prototype._emit$ = function () {
	/** @type {!number} */
	var precedence;
	/** @type {Expression} */
	var ifTrueExpr;
	precedence = this._getPrecedence$();
	ifTrueExpr = this._expr.getIfTrueExpr$();
	if (ifTrueExpr != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getCondExpr$()).emit$N(precedence - 1);
		this._emitter._emit$SLToken$(" ? ", null);
		this._emitter._getExpressionEmitterFor$LExpression$(ifTrueExpr).emit$N(precedence);
		this._emitter._emit$SLToken$(" : ", null);
		this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getIfFalseExpr$()).emit$N(precedence);
	} else {
		this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getCondExpr$()).emit$N(precedence - 1);
		this._emitter._emit$SLToken$(" || ", null);
		this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getIfFalseExpr$()).emit$N(precedence - 1);
	}
};

/**
 * @return {!number}
 */
_ConditionalExpressionEmitter.prototype._getPrecedence$ = function () {
	return (this._expr.getIfTrueExpr$() != null ? _ConditionalExpressionEmitter._operatorPrecedence : _LogicalExpressionEmitter._operatorPrecedence["||"]);
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_ConditionalExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_ConditionalExpressionEmitter._operatorPrecedence = precedence;
};

var _ConditionalExpressionEmitter$_setOperatorPrecedence$SN = _ConditionalExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _CallExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _CallExpressionEmitter() {
}

_CallExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {CallExpression} expr
 */
function _CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$.prototype = new _CallExpressionEmitter;

/**
 */
_CallExpressionEmitter.prototype._emit$ = function () {
	/** @type {Expression} */
	var calleeExpr;
	if (this._emitSpecial$()) {
		return;
	}
	calleeExpr = this._expr.getExpr$();
	this._emitter._getExpressionEmitterFor$LExpression$(calleeExpr).emit$N(_CallExpressionEmitter._operatorPrecedence);
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "(", this._expr.getArguments$(), this._expr.getExpr$().getType$().resolveIfNullable$().getArgumentTypes$());
};

/**
 * @return {!number}
 */
_CallExpressionEmitter.prototype._getPrecedence$ = function () {
	return _CallExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_CallExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_CallExpressionEmitter._operatorPrecedence = precedence;
};

var _CallExpressionEmitter$_setOperatorPrecedence$SN = _CallExpressionEmitter._setOperatorPrecedence$SN;

/**
 * @return {!boolean}
 */
_CallExpressionEmitter.prototype._emitSpecial$ = function () {
	/** @type {Expression} */
	var calleeExpr;
	calleeExpr = this._expr.getExpr$();
	if (! (calleeExpr instanceof PropertyExpression)) {
		return false;
	}
	if (this._emitIfJsInvoke$LPropertyExpression$(calleeExpr)) {
		return true;
	}
	if (this._emitIfJsEval$LPropertyExpression$(calleeExpr)) {
		return true;
	} else {
		if (this._emitCallsToMap$LPropertyExpression$(calleeExpr)) {
			return true;
		} else {
			if (this._emitIfMathAbs$LPropertyExpression$(calleeExpr)) {
				return true;
			}
		}
	}
	return false;
};

/**
 * @param {PropertyExpression} calleeExpr
 * @return {!boolean}
 */
_CallExpressionEmitter.prototype._emitIfJsEval$LPropertyExpression$ = function (calleeExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Array.<undefined|Expression>} */
	var args;
	if (! (calleeExpr.getType$() instanceof StaticFunctionType)) {
		return false;
	}
	if (calleeExpr.getIdentifierToken$().getValue$() !== "eval") {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! this._emitter.isJsModule$LClassDefinition$(classDef)) {
		return false;
	}
	args = this._expr.getArguments$();
	this._emitter._emit$SLToken$("eval(", calleeExpr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(args[0]).emit$N(0);
	this._emitter._emit$SLToken$(")", calleeExpr.getToken$());
	return true;
};

/**
 * @param {PropertyExpression} calleeExpr
 * @return {!boolean}
 */
_CallExpressionEmitter.prototype._emitIfJsInvoke$LPropertyExpression$ = function (calleeExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Array.<undefined|Expression>} */
	var args;
	if (! (calleeExpr.getType$() instanceof StaticFunctionType)) {
		return false;
	}
	if (calleeExpr.getIdentifierToken$().getValue$() !== "invoke") {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! this._emitter.isJsModule$LClassDefinition$(classDef)) {
		return false;
	}
	args = this._expr.getArguments$();
	if (args[2] instanceof ArrayLiteralExpression) {
		this._emitter._getExpressionEmitterFor$LExpression$(args[0]).emit$N(_PropertyExpressionEmitter._operatorPrecedence);
		this._emitter._emit$SLToken$("[", calleeExpr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(args[1]).emit$N(0);
		this._emitter._emit$SLToken$("]", calleeExpr.getToken$());
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "(", args[2].getExprs$(), null);
	} else {
		this._emitter._emit$SLToken$("(function (o, p, a) { return o[p].apply(o, a); }(", calleeExpr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(args[0]).emit$N(0);
		this._emitter._emit$SLToken$(", ", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(args[1]).emit$N(0);
		this._emitter._emit$SLToken$(", ", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(args[2]).emit$N(0);
		this._emitter._emit$SLToken$("))", this._expr.getToken$());
	}
	return true;
};

/**
 * @param {PropertyExpression} calleeExpr
 * @return {!boolean}
 */
_CallExpressionEmitter.prototype._emitCallsToMap$LPropertyExpression$ = function (calleeExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	if (calleeExpr.getType$() instanceof StaticFunctionType) {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! (classDef instanceof InstantiatedClassDefinition)) {
		return false;
	}
	if (classDef.getTemplateClassName$() !== "Map") {
		return false;
	}
	switch (calleeExpr.getIdentifierToken$().getValue$()) {
	case "toString":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "$__jsx_ObjectToString.call(", [ calleeExpr.getExpr$() ], [ new ObjectType$LClassDefinition$(classDef) ]);
		return true;
	case "hasOwnProperty":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "$__jsx_ObjectHasOwnProperty.call(", [ calleeExpr.getExpr$(), this._expr.getArguments$()[0] ], [ new ObjectType$LClassDefinition$(classDef), Type.stringType ]);
		return true;
	case "keys":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "Object.keys(", [ calleeExpr.getExpr$() ], [ new ObjectType$LClassDefinition$(classDef) ]);
		return true;
	default:
		return false;
	}
};

/**
 * @param {PropertyExpression} calleeExpr
 * @return {!boolean}
 */
_CallExpressionEmitter.prototype._emitIfMathAbs$LPropertyExpression$ = function (calleeExpr) {
	/** @type {Expression} */
	var argExpr;
	if (! _CallExpressionEmitter$_calleeIsMathAbs$LPropertyExpression$(calleeExpr)) {
		return false;
	}
	argExpr = this._expr.getArguments$()[0];
	if (argExpr instanceof LeafExpression) {
		this._emitter._emit$SLToken$("(", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(argExpr).emit$N(0);
		this._emitter._emit$SLToken$(" >= 0 ? ", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(argExpr).emit$N(0);
		this._emitter._emit$SLToken$(" : - ", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(argExpr).emit$N(0);
		this._emitter._emit$SLToken$(")", this._expr.getToken$());
	} else {
		this._emitter._emit$SLToken$("(($math_abs_t = ", this._expr.getToken$());
		this._emitter._getExpressionEmitterFor$LExpression$(argExpr).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		this._emitter._emit$SLToken$(") >= 0 ? $math_abs_t : -$math_abs_t)", this._expr.getToken$());
	}
	return true;
};

/**
 * @param {PropertyExpression} calleeExpr
 * @return {!boolean}
 */
_CallExpressionEmitter._calleeIsMathAbs$LPropertyExpression$ = function (calleeExpr) {
	if (! (calleeExpr.getType$() instanceof StaticFunctionType)) {
		return false;
	}
	if (calleeExpr.getIdentifierToken$().getValue$() !== "abs") {
		return false;
	}
	if (calleeExpr.getExpr$().getType$().getClassDef$().className$() !== "Math") {
		return false;
	}
	return true;
};

var _CallExpressionEmitter$_calleeIsMathAbs$LPropertyExpression$ = _CallExpressionEmitter._calleeIsMathAbs$LPropertyExpression$;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_CallExpressionEmitter.mathAbsUsesTemporary$LMemberFunctionDefinition$ = function (funcDef) {
	return ! funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (! statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			/** @type {Expression} */
			var calleeExpr;
			if (expr instanceof CallExpression && (calleeExpr = expr.getExpr$()) instanceof PropertyExpression && _CallExpressionEmitter$_calleeIsMathAbs$LPropertyExpression$(calleeExpr) && ! (expr.getArguments$()[0] instanceof LeafExpression)) {
				return false;
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}))) {
			return false;
		}
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
};

var _CallExpressionEmitter$mathAbsUsesTemporary$LMemberFunctionDefinition$ = _CallExpressionEmitter.mathAbsUsesTemporary$LMemberFunctionDefinition$;

/**
 * class _SuperExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _SuperExpressionEmitter() {
}

_SuperExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {SuperExpression} expr
 */
function _SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$.prototype = new _SuperExpressionEmitter;

/**
 */
_SuperExpressionEmitter.prototype._emit$ = function () {
	/** @type {ResolvedFunctionType} */
	var funcType;
	/** @type {!string} */
	var className;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!string} */
	var mangledFuncName;
	funcType = this._expr.getFunctionType$();
	className = funcType.getObjectType$().getClassDef$().getOutputClassName$();
	argTypes = funcType.getArgumentTypes$();
	mangledFuncName = this._emitter._mangleFunctionName$SALType$(this._expr.getName$().getValue$(), argTypes);
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), className + ".prototype." + mangledFuncName + ".call(this", this._expr.getArguments$(), argTypes);
};

/**
 * @return {!number}
 */
_SuperExpressionEmitter.prototype._getPrecedence$ = function () {
	return _CallExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_SuperExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_SuperExpressionEmitter._operatorPrecedence = precedence;
};

var _SuperExpressionEmitter$_setOperatorPrecedence$SN = _SuperExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _NewExpressionEmitter extends _OperatorExpressionEmitter
 * @constructor
 */
function _NewExpressionEmitter() {
}

_NewExpressionEmitter.prototype = new _OperatorExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {NewExpression} expr
 */
function _NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$(emitter, expr) {
	_OperatorExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$.prototype = new _NewExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_NewExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	/** @type {*} */
	var getInliner;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {ResolvedFunctionType} */
	var ctor;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {MemberFunctionDefinition} */
	var callingFuncDef;
	/** @type {*} */
	var inliner;
	function getInliner(funcDef) {
		/** @type {OptimizerStash} */
		var stash;
		stash = funcDef.getOptimizerStash$().unclassify;
		return (stash ? stash.inliner : null);
	};
	classDef = this._expr.getType$().getClassDef$();
	ctor = this._expr.getConstructor$();
	argTypes = ctor.getArgumentTypes$();
	callingFuncDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, "constructor", argTypes, false);
	if (callingFuncDef == null) {
		throw new Error("logic flaw");
	}
	inliner = getInliner(callingFuncDef);
	if (inliner) {
		this._emitAsObjectLiteral$LClassDefinition$ALExpression$(classDef, inliner(this._expr));
	} else {
		if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Array" && argTypes.length === 0) {
			this._emitter._emit$SLToken$("[]", this._expr.getToken$());
		} else {
			if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map") {
				this._emitter._emit$SLToken$("{}", this._expr.getToken$());
			} else {
				this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "new " + this._emitter._mangleConstructorName$LClassDefinition$ALType$(classDef, argTypes) + "(", this._expr.getArguments$(), argTypes);
			}
		}
	}
};

/**
 * @param {ClassDefinition} classDef
 * @param {Array.<undefined|Expression>} propertyExprs
 */
_NewExpressionEmitter.prototype._emitAsObjectLiteral$LClassDefinition$ALExpression$ = function (classDef, propertyExprs) {
	var $this = this;
	/** @type {!number} */
	var propertyIndex;
	this._emitter._emit$SLToken$("({", this._expr.getToken$());
	propertyIndex = 0;
	classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		if ((member.flags$() & ClassDefinition.IS_STATIC) === 0) {
			if (propertyIndex !== 0) {
				$this._emitter._emit$SLToken$(", ", $this._expr.getToken$());
			}
			$this._emitter._emit$SLToken$(member.name$() + ": ", $this._expr.getToken$());
			$this._emitter._getExpressionEmitterFor$LExpression$(propertyExprs[propertyIndex++]).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		}
		return true;
	}));
	this._emitter._emit$SLToken$("})", this._expr.getToken$());
};

/**
 * @return {!number}
 */
_NewExpressionEmitter.prototype._getPrecedence$ = function () {
	return _NewExpressionEmitter._operatorPrecedence;
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_NewExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_NewExpressionEmitter._operatorPrecedence = precedence;
};

var _NewExpressionEmitter$_setOperatorPrecedence$SN = _NewExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class _CommaExpressionEmitter extends _ExpressionEmitter
 * @constructor
 */
function _CommaExpressionEmitter() {
}

_CommaExpressionEmitter.prototype = new _ExpressionEmitter;
/**
 * @constructor
 * @param {JavaScriptEmitter} emitter
 * @param {CommaExpression} expr
 */
function _CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$(emitter, expr) {
	_ExpressionEmitter$LJavaScriptEmitter$.call(this, emitter);
	this._expr = expr;
};

_CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$.prototype = new _CommaExpressionEmitter;

/**
 * @param {!number} outerOpPrecedence
 */
_CommaExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	/** @type {!boolean} */
	var useBrackets;
	useBrackets = outerOpPrecedence !== _CommaExpressionEmitter._operatorPrecedence;
	if (useBrackets) {
		this._emitter._emit$SLToken$("(", null);
	}
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_CommaExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(", ", null);
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_CommaExpressionEmitter._operatorPrecedence);
	if (useBrackets) {
		this._emitter._emit$SLToken$(")", null);
	}
};

/**
 * @param {!string} op
 * @param {!number} precedence
 */
_CommaExpressionEmitter._setOperatorPrecedence$SN = function (op, precedence) {
	_CommaExpressionEmitter._operatorPrecedence = precedence;
};

var _CommaExpressionEmitter$_setOperatorPrecedence$SN = _CommaExpressionEmitter._setOperatorPrecedence$SN;

/**
 * class Platform extends Object
 * @constructor
 */
function Platform() {
}

/**
 * @constructor
 */
function Platform$() {
	this.fileContent = {};
};

Platform$.prototype = new Platform;

/**
 * @param {!string} name
 * @param {!string} content
 */
Platform.prototype.setFileContent$SS = function (name, content) {
	this.fileContent[name] = content;
};

/**
 * @param {!string} s
 */
Platform.prototype.log$S = function (s) {
	console.log(s);
};

/**
 * @param {!string} s
 */
Platform.prototype.warn$S = function (s) {
	console.warn(s);
};

/**
 * @param {!string} s
 */
Platform.prototype.error$S = function (s) {
	console.error(s);
};

/**
 * @param {!string} filename
 * @return {!string}
 */
Platform.prototype.encodeFilename$S = function (filename) {
	/** @type {!string} */
	var rootDir;
	rootDir = this.getRoot$() + "/";
	if (filename.indexOf(rootDir) === 0) {
		filename = "system:" + filename.substring(rootDir.length);
	}
	return filename;
};

/**
 * class NodePlatform extends Platform
 * @constructor
 */
function NodePlatform() {
}

NodePlatform.prototype = new Platform;
/**
 * @constructor
 */
function NodePlatform$() {
	NodePlatform$S.call(this, node.path.dirname(node.__dirname));
};

NodePlatform$.prototype = new NodePlatform;

/**
 * @constructor
 * @param {!string} root
 */
function NodePlatform$S(root) {
	Platform$.call(this);
	this._cwd = Util$resolvePath$S(process.cwd());
	this._root = Util$resolvePath$S(root);
};

NodePlatform$S.prototype = new NodePlatform;

/**
 * @return {!string}
 */
NodePlatform.prototype.getRoot$ = function () {
	return this._root;
};

/**
 * @param {!string} path
 * @return {!string}
 */
NodePlatform.prototype._absPath$S = function (path) {
	return (path.charAt(0) === "/" || path.match(/^[a-zA-Z]:\//) ? path : this._cwd + "/" + path);
};

/**
 * @param {!string} name
 * @return {!boolean}
 */
NodePlatform.prototype.fileExists$S = function (name) {
	name = Util$resolvePath$S(name);
	if ($__jsx_ObjectHasOwnProperty.call(this.fileContent, name)) {
		return true;
	}
	return node.fs.existsSync(this._absPath$S(name));
};

/**
 * @param {!string} path
 * @return {Array.<undefined|!string>}
 */
NodePlatform.prototype.getFilesInDirectory$S = function (path) {
	return node.fs.readdirSync(this._absPath$S(path));
};

/**
 * @param {!string} name
 * @return {!string}
 */
NodePlatform.prototype.load$S = function (name) {
	/** @type {!number} */
	var fd;
	/** @type {!string} */
	var content;
	/** @type {!number} */
	var BUFFER_SIZE;
	/** @type {Buffer} */
	var buffer;
	/** @type {!number} */
	var n;
	name = Util$resolvePath$S(name);
	if ($__jsx_ObjectHasOwnProperty.call(this.fileContent, name)) {
		return this.fileContent[name];
	} else {
		if (name === "-") {
			fd = process.stdin.fd;
			content = "";
			BUFFER_SIZE = 4096;
			buffer = new Buffer(BUFFER_SIZE);
			while ((n = node.fs.readSync(fd, buffer, 0, BUFFER_SIZE)) > 0) {
				content += buffer.slice(0, n).toString();
			}
			return content;
		} else {
			content = node.fs.readFileSync(this._absPath$S(name), "utf-8");
			this.fileContent[name] = content;
			return content;
		}
	}
};

/**
 * @param {undefined|!string} outputFile
 * @param {!string} content
 */
NodePlatform.prototype.save$USS = function (outputFile, content) {
	if (outputFile == null) {
		process.stdout.write(content);
	} else {
		outputFile = this._absPath$S(outputFile);
		this.mkpath$S(Util$dirname$S(outputFile));
		node.fs.writeFileSync(outputFile, content);
	}
};

/**
 * @param {!string} dir
 */
NodePlatform.prototype.setWorkingDir$S = function (dir) {
	this._cwd = Util$resolvePath$S(dir);
};

/**
 * @param {!string} path
 */
NodePlatform.prototype.mkpath$S = function (path) {
	/** @type {!string} */
	var dirOfPath;
	path = this._absPath$S(path);
	if (! node.fs.existsSync(path)) {
		dirOfPath = Util$dirname$S(path);
		if (dirOfPath !== path) {
			this.mkpath$S(dirOfPath);
		}
		node.fs.mkdirSync(path);
	}
};

/**
 * @param {Emitter} emitter
 * @param {*} sourceFile
 * @param {!string} targetCode
 * @param {!string} entryPoint
 * @param {!string} executableFor
 * @return {!string}
 */
NodePlatform.prototype.addLauncher$LEmitter$XSSS = function (emitter, sourceFile, targetCode, entryPoint, executableFor) {
	/** @type {!string} */
	var args;
	/** @type {!string} */
	var launcher;
	/** @type {!string} */
	var callEntryPoint;
	if (emitter instanceof JavaScriptEmitter) {
		targetCode += this.load$S(this.getRoot$() + "/src/js/launcher.js");
		switch (executableFor) {
		case "node":
			args = "process.argv.slice(2)";
			break;
		case "commonjs":
			args = "require('system').args.slice(1)";
			break;
		default:
			args = "[]";
			break;
		}
		switch (entryPoint) {
		case "_Main":
			launcher = "runMain";
			break;
		case "_Test":
			launcher = "runTests";
			break;
		default:
			throw new Error("Unknown entry point type: " + entryPoint);
		}
		callEntryPoint = Util$format$SAS("JSX.%1(%2, %3)", [ launcher, JSON.stringify(sourceFile), args ]);
		if (executableFor === "web") {
			callEntryPoint = this.wrapOnLoad$S(callEntryPoint);
		}
		return targetCode + callEntryPoint + "\n";
	} else {
		throw new Error("FIXME: unknown emitter");
	}
};

/**
 * @param {!string} code
 * @return {!string}
 */
NodePlatform.prototype.wrapOnLoad$S = function (code) {
	/** @type {!string} */
	var wrapper;
	wrapper = this.load$S(this.getRoot$() + "/src/js/web-launcher.js");
	return wrapper.replace(/\/\/--CODE--\/\//, code);
};

/**
 * @param {!string} file
 * @param {!string} runEnv
 */
NodePlatform.prototype.makeFileExecutable$SS = function (file, runEnv) {
	if (runEnv === "node") {
		node.fs.chmodSync(this._absPath$S(file), "0755");
	}
};

/**
 * @param {undefined|!string} scriptFile
 * @param {!string} jsSource
 * @param {Array.<undefined|!string>} args
 */
NodePlatform.prototype.execute$USSAS = function (scriptFile, jsSource, args) {
	var $this = this;
	/** @type {undefined|!string} */
	var tmpdir;
	/** @type {!string} */
	var jsFile;
	/** @type {ChildProcess} */
	var child;
	tmpdir = (process.env.TMPDIR || process.env.TMP) || "/tmp";
	jsFile = Util$format$SAS("%1/%2.%3.%4.js", [ tmpdir, node.path.basename(scriptFile || "-"), process.pid.toString(), Date.now().toString(16) ]);
	node.fs.writeFileSync(jsFile, jsSource);
	process.on("exit", (function (stream) {
		node.fs.unlinkSync(jsFile);
	}));
	if (process.env.JSX_RUNJS) {
		child = node.child_process.spawn(process.env.JSX_RUNJS, [ jsFile ].concat(args));
		child.stdin.end();
		child.stdout.on("data", (function (data) {
			process.stdout.write(data + "");
		}));
		child.stderr.on("data", (function (data) {
			process.stderr.write(data + "");
		}));
	} else {
		process.argv = [ process.argv[0], jsFile ].concat(args);
		node$require$S(jsFile);
	}
};

/**
 * @return {Array.<undefined|!string>}
 */
NodePlatform.getEnvOpts$ = function () {
	/** @type {undefined|!string} */
	var opts;
	opts = process.env.JSX_OPTS;
	if (! opts) {
		return [];
	}
	return opts.split(/\s+/);
};

var NodePlatform$getEnvOpts$ = NodePlatform.getEnvOpts$;

/**
 * @param {*} arg
 * @return {!number}
 */
NodePlatform.prototype.runCompilationServer$X = function (arg) {
	/** @type {!number} */
	var port;
	port = arg | 0;
	return CompilationServer$start$LPlatform$I(this, port);
};

/**
 * class CompilationServerPlatform extends NodePlatform
 * @constructor
 */
function CompilationServerPlatform() {
}

CompilationServerPlatform.prototype = new NodePlatform;
/**
 * @constructor
 * @param {!string} root
 * @param {!number} reqId
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 */
function CompilationServerPlatform$SNLServerRequest$LServerResponse$(root, reqId, req, res) {
	NodePlatform$S.call(this, root);
	this._stdout = "";
	this._stderr = "";
	this._file = {};
	this._executableFile = {};
	this._statusCode = 1;
	this._scriptFile = null;
	this._scriptSource = null;
	this._scriptArgs = null;
	this._requestId = reqId;
	this._request = req;
	this._response = res;
};

CompilationServerPlatform$SNLServerRequest$LServerResponse$.prototype = new CompilationServerPlatform;

/**
 * @param {undefined|!string} outputFile
 * @param {!string} content
 */
CompilationServerPlatform.prototype.save$USS = function (outputFile, content) {
	if (outputFile == null) {
		this._stdout += content;
	} else {
		this._file[outputFile] = content;
	}
};

/**
 * @param {!string} message
 */
CompilationServerPlatform.prototype.log$S = function (message) {
	this._stdout += message + "\n";
};

/**
 * @param {!string} message
 */
CompilationServerPlatform.prototype.warn$S = function (message) {
	this._stderr += message + "\n";
};

/**
 * @param {!string} message
 */
CompilationServerPlatform.prototype.error$S = function (message) {
	this._stderr += message + "\n";
};

/**
 * @param {undefined|!string} jsFile
 * @param {!string} jsSource
 * @param {Array.<undefined|!string>} jsArgs
 */
CompilationServerPlatform.prototype.execute$USSAS = function (jsFile, jsSource, jsArgs) {
	this._scriptFile = jsFile;
	this._scriptSource = jsSource;
	this._scriptArgs = jsArgs;
};

/**
 * @param {!number} statusCode
 */
CompilationServerPlatform.prototype.setStatusCode$N = function (statusCode) {
	this._statusCode = statusCode;
};

/**
 * @return {Object.<string, undefined|*>}
 */
CompilationServerPlatform.prototype.getContents$ = function () {
	/** @type {Object.<string, undefined|*>} */
	var content;
	content = ({ stdout: this._stdout, stderr: this._stderr, file: this._file, executableFile: this._executableFile, statusCode: this._statusCode });
	if (this._scriptSource != null) {
		content.run = ({ scriptFile: this._scriptFile, scriptSource: this._scriptSource, scriptArgs: this._scriptArgs });
	}
	return content;
};

/**
 * @param {!string} file
 * @param {!string} runEnv
 */
CompilationServerPlatform.prototype.makeFileExecutable$SS = function (file, runEnv) {
	this._executableFile[file] = runEnv;
};

/**
 * @param {*} arg
 * @return {!number}
 */
CompilationServerPlatform.prototype.runCompilationServer$X = function (arg) {
	this.error$S('--compilation-server is not supported');
	return 1;
};

/**
 * class JSXCommand extends Object
 * @constructor
 */
function JSXCommand() {
}

/**
 * @constructor
 */
function JSXCommand$() {
};

JSXCommand$.prototype = new JSXCommand;

/**
 * @return {!string}
 */
JSXCommand.help$ = function () {
	return "JSX compiler version " + Meta.VERSION_STRING + "\n" + "\n" + "Usage: jsx [options] source-files\n" + "\n" + "Options:\n" + "  --add-search-path path     adds a path to library search paths\n" + "  --executable RUNENV        adds launcher to call _Main.main(:string[]):void\n" + "                             supported RUNENV is node, commonjs and web.\n" + "  --run                      runs _Main.main(:string[]):void after compiling\n" + "  --test                     runs _Test#test*():void after compiling\n" + "  --output file              output file (default:stdout)\n" + "  --input-filename file      names input filename\n" + "  --mode (compile|parse|doc) specifies compilation mode (default:compile)\n" + "  --target (javascript|c++)  specifies target language (default:javascript)\n" + "  --release                  disables run-time type checking and enables optimizations (" + Optimizer$getReleaseOptimizationCommands$().join(",") + ")\n" + "  --profile                  enables the profiler (experimental)\n" + "  --optimize cmd1,cmd2,...   enables optimization commands\n" + "  --warn type1,type2,...     enables warnings (all, deprecated, none)\n" + "  --disable-type-check       disables run-time type checking\n" + "  --enable-source-map        enables source map debugging info\n" + "  --complete line:column     shows code completion at line:column\n" + "  --version                  displays the version and compiler identifier and exits\n" + "  --version-number           displays the version as number and exits\n" + "  --help                     displays this help and exits\n" + "\n" + "Env:\n" + "  JSX_OPTS   options of jsx(1)\n" + "  JSX_RUNJS  JavaScript engine used by --run and --test\n" + "";
};

var JSXCommand$help$ = JSXCommand.help$;

/**
 * @param {Platform} platform
 * @param {Array.<undefined|!string>} args
 * @return {!number}
 */
JSXCommand.main$LPlatform$AS = function (platform, args) {
	/** @type {!number} */
	var argIndex;
	/** @type {*} */
	var getopt;
	/** @type {*} */
	var getoptarg;
	/** @type {Compiler} */
	var compiler;
	/** @type {Array.<undefined|*>} */
	var tasks;
	/** @type {Optimizer} */
	var optimizer;
	/** @type {CompletionRequest} */
	var completionRequest;
	/** @type {Emitter} */
	var emitter;
	/** @type {undefined|!string} */
	var outputFile;
	/** @type {undefined|!string} */
	var inputFilename;
	/** @type {undefined|!string} */
	var executable;
	/** @type {undefined|!string} */
	var run;
	/** @type {!boolean} */
	var runImmediately;
	/** @type {Array.<undefined|!string>} */
	var optimizeCommands;
	/** @type {undefined|!string} */
	var opt;
	/** @type {undefined|!string} */
	var optarg;
	/** @type {Array.<undefined|!string>} */
	var switchOpt;
	/** @type {!boolean} */
	var mode;
	/** @type {undefined|!string} */
	var sourceFile;
	/** @type {undefined|!string} */
	var err;
	/** @type {!boolean} */
	var result;
	/** @type {!string} */
	var output;
	/** @type {Object.<string, undefined|!string>} */
	var map;
	/** @type {!string} */
	var filename;
	argIndex = 0;
	getopt = (function () {
		/** @type {undefined|!string} */
		var arg;
		if (args.length <= argIndex) {
			return null;
		}
		arg = args[argIndex++];
		if (arg == "--") {
			return null;
		}
		if (arg.match(/^-/)) {
			return arg;
		} else {
			-- argIndex;
			return null;
		}
	});
	getoptarg = (function () {
		if (args.length <= argIndex) {
			platform.error$S("option " + args[argIndex - 1] + " requires a value");
			return null;
		}
		return args[argIndex++];
	});
	compiler = new Compiler$LPlatform$(platform);
	tasks = [];
	optimizer = null;
	completionRequest = null;
	emitter = null;
	outputFile = null;
	inputFilename = null;
	executable = null;
	run = null;
	runImmediately = false;
	optimizeCommands = [];
	while ((opt = getopt()) != null) {
	NEXTOPT:
		switch (opt) {
		case "--add-search-path":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			compiler.addSearchPath$S(optarg);
			break;
		case "--output":
			if ((outputFile = getoptarg()) == null) {
				return 1;
			}
			break;
		case "--input-filename":
			if ((inputFilename = getoptarg()) == null) {
				return 1;
			}
			break;
		case "--working-dir":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			platform.setWorkingDir$S(optarg);
			break;
		case "--mode":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			switch (optarg) {
			case "compile":
				compiler.setMode$N(Compiler.MODE_COMPILE);
				break;
			case "parse":
				compiler.setMode$N(Compiler.MODE_PARSE);
				break;
			case "doc":
				compiler.setMode$N(Compiler.MODE_DOC);
				break;
			default:
				platform.error$S("unknown mode: " + optarg);
				return 1;
			}
			break;
		case "--complete":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			completionRequest = (function () {
				/** @type {Array.<undefined|!string>} */
				var a;
				a = optarg.split(/:/);
				return new CompletionRequest$NN(+a[0], +a[1] - 1);
			})();
			compiler.setMode$N(Compiler.MODE_COMPLETE);
			break;
		case "--target":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			switch (optarg) {
			case "javascript":
				emitter = new JavaScriptEmitter$LPlatform$(platform);
				break;
			case "c++":
				throw new Error("FIXME");
			default:
				platform.error$S("unknown target: " + optarg);
				return 1;
			}
			break;
		case "--release":
			tasks.push((function () {
				emitter.setEnableRunTimeTypeCheck$B(false);
				optimizer.setEnableRunTimeTypeCheck$B(false);
			}));
			optimizeCommands = Optimizer$getReleaseOptimizationCommands$();
			break;
		case "--optimize":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			optimizeCommands = optimizeCommands.concat(optarg.split(","));
			break;
		case "--disable-optimize":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			optimizeCommands = optimizeCommands.filter((function (item) {
				return optarg.split(",").indexOf(item) === - 1;
			}));
			break;
		case "--warn":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			optarg.split(",").forEach((function (type) {
				switch (type) {
				case "none":
					compiler.getWarningFilters$().unshift((function (warning) {
						return false;
					}));
					break;
				case "all":
					compiler.getWarningFilters$().unshift((function (warning) {
						return true;
					}));
					break;
				case "deprecated":
					compiler.getWarningFilters$().unshift((function (warning) {
						if (warning instanceof DeprecatedWarning) {
							return true;
						}
						return null;
					}));
					break;
				default:
					platform.error$S("unknown warning type: " + type);
				}
			}));
			break;
		case "--executable":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			switch (optarg) {
			case "web":
				break;
			case "commonjs":
				break;
			case "node":
				tasks.push((function () {
					/** @type {!string} */
					var shebang;
					shebang = "#!/usr/bin/env node\n";
					emitter.addHeader$S(shebang);
				}));
				break;
			default:
				platform.error$S("unknown executable type (node|web)");
				return 1;
			}
			executable = optarg;
			run = "_Main";
			break;
		case "--run":
			run = "_Main";
			executable = executable || "node";
			runImmediately = true;
			break;
		case "--test":
			run = "_Test";
			executable = executable || "node";
			runImmediately = true;
			tasks.push((function () {
				/** @type {!number} */
				var idx;
				idx = optimizeCommands.indexOf("staticize");
				if (idx !== - 1) {
					optimizeCommands.splice(idx, 1);
				}
			}));
			break;
		case "--profile":
			tasks.push((function () {
				emitter.setEnableProfiler$B(true);
			}));
			break;
		case "--compilation-server":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			return platform.runCompilationServer$X(optarg);
		case "--version":
			platform.log$S(Meta.IDENTIFIER);
			return 0;
		case "--version-number":
			platform.log$S(Meta.VERSION_NUMBER + "");
			return 0;
		case "--help":
			platform.log$S(JSXCommand$help$());
			return 0;
		default:
			switchOpt = opt.match(new RegExp("^--(enable|disable)-(.*)$"));
			if (switchOpt != null) {
				mode = switchOpt[1] == "enable";
				switch (switchOpt[2]) {
				case "type-check":
					tasks.push((function (mode) {
						return (function () {
							emitter.setEnableRunTimeTypeCheck$B(mode);
							optimizer.setEnableRunTimeTypeCheck$B(mode);
						});
					})(mode));
					break NEXTOPT;
				case "source-map":
					tasks.push((function (mode) {
						return (function () {
							emitter.setEnableSourceMap$B(mode);
						});
					})(mode));
					break NEXTOPT;
				default:
					break;
				}
			}
			platform.error$S("unknown option: " + opt);
			return 1;
		}
	}
	if (argIndex === args.length) {
		platform.error$S("no files");
		return 1;
	}
	sourceFile = args[argIndex++];
	if (inputFilename != null) {
		platform.setFileContent$SS(inputFilename, platform.load$S(sourceFile));
		sourceFile = inputFilename;
	}
	compiler.addSourceFile$LToken$SLCompletionRequest$(null, sourceFile, completionRequest);
	switch (compiler.getMode$()) {
	case Compiler.MODE_PARSE:
		if (compiler.compile$()) {
			platform.save$USS(outputFile, JSON.stringify(compiler.getAST$()));
			return 0;
		} else {
			return 1;
		}
	}
	if (emitter == null) {
		emitter = new JavaScriptEmitter$LPlatform$(platform);
	}
	compiler.setEmitter$LEmitter$(emitter);
	switch (compiler.getMode$()) {
	case Compiler.MODE_DOC:
		if (outputFile == null) {
			platform.error$S("--output is mandatory for --mode doc");
			return 1;
		}
		if (compiler.compile$()) {
			new DocumentGenerator$LCompiler$SS(compiler, platform.getRoot$() + "/src/doc", outputFile).setResourceFiles$AS([ "style.css" ]).setPathFilter$F$SB$((function (sourcePath) {
				if (sourcePath.indexOf("system:") === 0) {
					return false;
				}
				if (sourcePath.charAt(0) === "/") {
					return false;
				}
				if (sourcePath.indexOf("../") === 0) {
					return false;
				}
				if (sourcePath.indexOf("/../") !== - 1) {
					return false;
				}
				return true;
			})).buildDoc$();
			return 0;
		} else {
			return 1;
		}
	}
	optimizer = new Optimizer$();
	tasks.forEach((function (proc) {
		proc();
	}));
	err = optimizer.setup$AS(optimizeCommands);
	if (err != null) {
		platform.error$S(err);
		return 1;
	}
	emitter.setOutputFile$US(outputFile);
	compiler.setOptimizer$LOptimizer$(optimizer);
	result = compiler.compile$();
	if (completionRequest != null) {
		platform.save$USS(null, JSON.stringify(completionRequest.getCandidates$()));
		return 0;
	}
	if (! result) {
		return 1;
	}
	output = emitter.getOutput$SUSUS(sourceFile, run, executable);
	if (emitter instanceof JavaScriptEmitter) {
		if (! runImmediately) {
			platform.save$USS(outputFile, output);
			if (outputFile != null) {
				map = emitter.getSourceMappingFiles$();
				for (filename in map) {
					platform.save$USS(filename, map[filename]);
				}
				if (executable != null) {
					platform.makeFileExecutable$SS(outputFile, executable);
				}
			}
		} else {
			platform.execute$USSAS(sourceFile, output, args.slice(argIndex));
		}
	} else {
		throw new Error("FIXME: C++ emitter");
	}
	return 0;
};

var JSXCommand$main$LPlatform$AS = JSXCommand.main$LPlatform$AS;

/**
 * class Meta extends Object
 * @constructor
 */
function Meta() {
}

/**
 * @constructor
 */
function Meta$() {
};

Meta$.prototype = new Meta;

/**
 * class MapLiteralElement extends Object
 * @constructor
 */
function MapLiteralElement() {
}

/**
 * @constructor
 * @param {Token} key
 * @param {Expression} expr
 */
function MapLiteralElement$LToken$LExpression$(key, expr) {
	this._key = key;
	this._expr = expr;
};

MapLiteralElement$LToken$LExpression$.prototype = new MapLiteralElement;

/**
 * @return {Token}
 */
MapLiteralElement.prototype.getKey$ = function () {
	return this._key;
};

/**
 * @return {Expression}
 */
MapLiteralElement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
MapLiteralElement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {*}
 */
MapLiteralElement.prototype.serialize$ = function () {
	return [ this._key.serialize$(), this._expr.serialize$() ];
};

/**
 * class InstantiationContext extends Object
 * @constructor
 */
function InstantiationContext() {
}

/**
 * @constructor
 * @param {Array.<undefined|CompileError>} errors
 * @param {Object.<string, undefined|Type>} typemap
 */
function InstantiationContext$ALCompileError$HLType$(errors, typemap) {
	this.errors = errors;
	this.typemap = typemap;
	this.objectTypesUsed = [];
};

InstantiationContext$ALCompileError$HLType$.prototype = new InstantiationContext;

/**
 * class TemplateDefinition
 * @constructor
 */
function TemplateDefinition() {
}

TemplateDefinition.prototype.$__jsx_implements_TemplateDefinition = true;

/**
 * @constructor
 */
function TemplateDefinition$() {
};

TemplateDefinition$.prototype = new TemplateDefinition;

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} token
 * @param {Array.<undefined|Token>} formalTypeArgs
 * @param {Array.<undefined|Type>} actualTypeArgs
 * @return {InstantiationContext}
 */
TemplateDefinition.prototype.buildInstantiationContext$ALCompileError$LToken$ALToken$ALType$ = function (errors, token, formalTypeArgs, actualTypeArgs) {
	/** @type {Object.<string, undefined|Type>} */
	var typemap;
	/** @type {!number} */
	var i;
	if (formalTypeArgs.length !== actualTypeArgs.length) {
		errors.push(new CompileError$LToken$S(token, "wrong number of template arguments (expected " + (formalTypeArgs.length + "") + ", got " + (actualTypeArgs.length + "")));
		return null;
	}
	typemap = {};
	for (i = 0; i < formalTypeArgs.length; ++ i) {
		typemap[formalTypeArgs[i].getValue$()] = actualTypeArgs[i];
	}
	return new InstantiationContext$ALCompileError$HLType$(errors, typemap);
};

/**
 * class Block
 * @constructor
 */
function Block() {
}

Block.prototype.$__jsx_implements_Block = true;

/**
 * @constructor
 */
function Block$() {
};

Block$.prototype = new Block;

/**
 * class BlockContext extends Object
 * @constructor
 */
function BlockContext() {
}

/**
 * @constructor
 * @param {LocalVariableStatuses} localVariableStatuses
 * @param {Block} block
 */
function BlockContext$LLocalVariableStatuses$LBlock$(localVariableStatuses, block) {
	this.localVariableStatuses = localVariableStatuses;
	this.block = block;
};

BlockContext$LLocalVariableStatuses$LBlock$.prototype = new BlockContext;

/**
 * class AnalysisContext extends Object
 * @constructor
 */
function AnalysisContext() {
}

/**
 * @constructor
 * @param {Array.<undefined|CompileError>} errors
 * @param {Parser} parser
 * @param {*} postInstantiationCallback
 */
function AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, parser, postInstantiationCallback) {
	this.errors = errors;
	this.parser = parser;
	this.postInstantiationCallback = postInstantiationCallback;
	this.funcDef = null;
	this.blockStack = null;
	this.statement = null;
};

AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$.prototype = new AnalysisContext;

/**
 * @return {AnalysisContext}
 */
AnalysisContext.prototype.clone$ = function () {
	return new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(this.errors, this.parser, this.postInstantiationCallback).setFuncDef$LMemberFunctionDefinition$(this.funcDef);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {AnalysisContext}
 */
AnalysisContext.prototype.setFuncDef$LMemberFunctionDefinition$ = function (funcDef) {
	this.funcDef = funcDef;
	return this;
};

/**
 * @param {Array.<undefined|BlockContext>} stack
 * @return {AnalysisContext}
 */
AnalysisContext.prototype.setBlockStack$ALBlockContext$ = function (stack) {
	this.blockStack = stack;
	return this;
};

/**
 * @return {BlockContext}
 */
AnalysisContext.prototype.getTopBlock$ = function () {
	return this.blockStack[this.blockStack.length - 1];
};

/**
 * class LocalVariable extends Object
 * @constructor
 */
function LocalVariable() {
}

/**
 * @constructor
 * @param {Token} name
 * @param {Type} type
 */
function LocalVariable$LToken$LType$(name, type) {
	this.isInstantiated = false;
	this._name = name;
	this._type = type;
	this._instantiated = [];
};

LocalVariable$LToken$LType$.prototype = new LocalVariable;

/**
 * @return {*}
 */
LocalVariable.prototype.serialize$ = function () {
	return [ this._name, Serializer$Type$E$serializeNullable$LType$(this._type) ];
};

/**
 * @return {Token}
 */
LocalVariable.prototype.getName$ = function () {
	return this._name;
};

/**
 * @return {Type}
 */
LocalVariable.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
LocalVariable.prototype.setType$LType$ = function (type) {
	if (this._type != null) {
		throw new Error("type is already set for " + this.toString());
	}
	if (type.equals$LType$(Type.integerType)) {
		type = Type.numberType;
	}
	this._type = type;
};

/**
 * @param {Type} type
 */
LocalVariable.prototype.setTypeForced$LType$ = function (type) {
	this._type = type;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {!boolean} isAssignment
 * @return {!boolean}
 */
LocalVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	if (isAssignment) {
		context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this);
	} else {
		switch (context.getTopBlock$().localVariableStatuses.getStatus$LLocalVariable$(this)) {
		case LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION:
			context.errors.push(new CompileError$LToken$S(token, "the return type of recursive function needs to be explicitly declared"));
			return false;
		case LocalVariableStatuses.ISSET:
			break;
		case LocalVariableStatuses.UNSET:
			context.errors.push(new CompileError$LToken$S(token, "variable is not initialized"));
			return false;
		case LocalVariableStatuses.MAYBESET:
			context.errors.push(new CompileError$LToken$S(token, "variable may not be initialized"));
			return false;
		default:
			throw new Error("logic flaw");
		}
	}
	return true;
};

/**
 * @return {!string}
 */
LocalVariable.prototype.toString = function () {
	return this._name.getValue$() + " : " + this._type.toString();
};

/**
 */
LocalVariable.prototype.popInstantiated$ = function () {
	this._instantiated.pop();
};

/**
 * @return {LocalVariable}
 */
LocalVariable.prototype.getInstantiated$ = function () {
	if (this._instantiated.length === 0) {
		throw new Error("logic flaw, no instantiation for " + this._name.getValue$() + "," + (this.isInstantiated + ""));
	}
	return this._instantiated[this._instantiated.length - 1];
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {LocalVariable}
 */
LocalVariable.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	/** @type {LocalVariable} */
	var instantiated;
	instantiated = this._instantiate$LInstantiationContext$(instantiationContext);
	instantiated.isInstantiated = true;
	this._instantiated.push(instantiated);
	return instantiated;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {LocalVariable}
 */
LocalVariable.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var type;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	return new LocalVariable$LToken$LType$(this._name, type);
};

/**
 * class CaughtVariable extends LocalVariable
 * @constructor
 */
function CaughtVariable() {
}

CaughtVariable.prototype = new LocalVariable;
/**
 * @constructor
 * @param {Token} name
 * @param {Type} type
 */
function CaughtVariable$LToken$LType$(name, type) {
	LocalVariable$LToken$LType$.call(this, name, type);
};

CaughtVariable$LToken$LType$.prototype = new CaughtVariable;

/**
 * @return {CaughtVariable}
 */
CaughtVariable.prototype.clone$ = function () {
	return new CaughtVariable$LToken$LType$(this._name, this._type);
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {!boolean} isAssignment
 * @return {!boolean}
 */
CaughtVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	return true;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {CaughtVariable}
 */
CaughtVariable.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	return new CaughtVariable$LToken$LType$(this._name, this._type.instantiate$LInstantiationContext$(instantiationContext));
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {CaughtVariable}
 */
CaughtVariable.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	return LocalVariable.prototype.instantiateAndPush$LInstantiationContext$.call(this, instantiationContext);
};

/**
 * class ArgumentDeclaration extends LocalVariable
 * @constructor
 */
function ArgumentDeclaration() {
}

ArgumentDeclaration.prototype = new LocalVariable;
/**
 * @constructor
 * @param {Token} name
 * @param {Type} type
 */
function ArgumentDeclaration$LToken$LType$(name, type) {
	LocalVariable$LToken$LType$.call(this, name, type);
};

ArgumentDeclaration$LToken$LType$.prototype = new ArgumentDeclaration;

/**
 * @return {ArgumentDeclaration}
 */
ArgumentDeclaration.prototype.clone$ = function () {
	return new ArgumentDeclaration$LToken$LType$(this._name, this._type);
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {ArgumentDeclaration}
 */
ArgumentDeclaration.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var type;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	return new ArgumentDeclaration$LToken$LType$(this._name, type);
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {ArgumentDeclaration}
 */
ArgumentDeclaration.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	return LocalVariable.prototype.instantiateAndPush$LInstantiationContext$.call(this, instantiationContext);
};

/**
 * class LocalVariableStatuses extends Object
 * @constructor
 */
function LocalVariableStatuses() {
}

/**
 * @constructor
 * @param {MemberFunctionDefinition} funcDef
 * @param {LocalVariableStatuses} base
 */
function LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$(funcDef, base) {
	/** @type {!string} */
	var k;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	this._statuses = {};
	if (base != null) {
		for (k in base._statuses) {
			this._statuses[k] = (base._statuses[k] == LocalVariableStatuses.UNSET ? LocalVariableStatuses.MAYBESET : base._statuses[k]);
		}
	}
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++ i) {
		this._statuses[args[i].getName$().getValue$()] = LocalVariableStatuses.ISSET;
	}
	locals = funcDef.getLocals$();
	for (i = 0; i < locals.length; ++ i) {
		this._statuses[locals[i].getName$().getValue$()] = LocalVariableStatuses.UNSET;
	}
};

LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$.prototype = new LocalVariableStatuses;

/**
 * @constructor
 * @param {LocalVariableStatuses} srcStatus
 */
function LocalVariableStatuses$LLocalVariableStatuses$(srcStatus) {
	this._statuses = {};
	this._copyFrom$LLocalVariableStatuses$(srcStatus);
};

LocalVariableStatuses$LLocalVariableStatuses$.prototype = new LocalVariableStatuses;

/**
 * @return {LocalVariableStatuses}
 */
LocalVariableStatuses.prototype.clone$ = function () {
	return new LocalVariableStatuses$LLocalVariableStatuses$(this);
};

/**
 * @param {LocalVariableStatuses} that
 * @return {LocalVariableStatuses}
 */
LocalVariableStatuses.prototype.merge$LLocalVariableStatuses$ = function (that) {
	/** @type {LocalVariableStatuses} */
	var ret;
	/** @type {!string} */
	var k;
	ret = this.clone$();
	for (k in ret._statuses) {
		if (ret._statuses[k] == LocalVariableStatuses.UNSET && that._statuses[k] == LocalVariableStatuses.UNSET) {
		} else {
			if (ret._statuses[k] == LocalVariableStatuses.ISSET && that._statuses[k] == LocalVariableStatuses.ISSET) {
			} else {
				ret._statuses[k] = LocalVariableStatuses.MAYBESET;
			}
		}
	}
	return ret;
};

/**
 * @param {LocalVariable} local
 */
LocalVariableStatuses.prototype.setStatus$LLocalVariable$ = function (local) {
	/** @type {!string} */
	var name;
	name = local.getName$().getValue$();
	if (this._statuses[name] == null) {
		throw new Error("logic flaw, could not find status for local variable: " + name);
	}
	this._statuses[name] = LocalVariableStatuses.ISSET;
};

/**
 * @param {LocalVariable} local
 * @return {!number}
 */
LocalVariableStatuses.prototype.getStatus$LLocalVariable$ = function (local) {
	/** @type {!string} */
	var name;
	name = local.getName$().getValue$();
	if (this._statuses[name] == null) {
		throw new Error("logic flaw, could not find status for local variable: " + name);
	}
	return this._statuses[name];
};

/**
 * @param {LocalVariableStatuses} that
 */
LocalVariableStatuses.prototype._copyFrom$LLocalVariableStatuses$ = function (that) {
	/** @type {!string} */
	var k;
	for (k in that._statuses) {
		this._statuses[k] = that._statuses[k];
	}
};

/**
 * class Type extends Object
 * @constructor
 */
function Type() {
}

/**
 * @constructor
 */
function Type$() {
};

Type$.prototype = new Type;

/**
 * @return {*}
 */
Type.prototype.serialize$ = function () {
	return this.toString();
};

/**
 * @param {Type} x
 * @return {!boolean}
 */
Type.prototype.equals$LType$ = function (x) {
	return this == x;
};

/**
 * @return {Type}
 */
Type.prototype.resolveIfNullable$ = function () {
	if (this instanceof NullableType) {
		return this.getBaseType$();
	}
	return this;
};

/**
 * @return {Type}
 */
Type.prototype.asAssignableType$ = function () {
	return this;
};

/**
 * @return {Type}
 */
Type.prototype.toNullableType$ = function () {
	return this.toNullableType$B(false);
};

/**
 * @param {!boolean} force
 * @return {Type}
 */
Type.prototype.toNullableType$B = function (force) {
	if (force || this instanceof PrimitiveType) {
		return new NullableType$LType$(this);
	}
	return this;
};

/**
 * @param {!string} parameterizedTypeName
 * @param {Array.<undefined|Type>} typeArgs
 * @return {!string}
 */
Type.templateTypeToString$SALType$ = function (parameterizedTypeName, typeArgs) {
	/** @type {!string} */
	var s;
	/** @type {!number} */
	var i;
	s = parameterizedTypeName + ".<";
	for (i = 0; i < typeArgs.length; ++ i) {
		if (i !== 0) {
			s += ",";
		}
		s += typeArgs[i].toString();
	}
	s += ">";
	return s;
};

var Type$templateTypeToString$SALType$ = Type.templateTypeToString$SALType$;

/**
 * @param {Type} type
 * @return {!boolean}
 */
Type.isIntegerOrNumber$LType$ = function (type) {
	return type instanceof IntegerType || type instanceof NumberType;
};

var Type$isIntegerOrNumber$LType$ = Type.isIntegerOrNumber$LType$;

/**
 * @param {Type} type1
 * @param {Type} type2
 * @return {Type}
 */
Type.calcLeastCommonAncestor$LType$LType$ = function (type1, type2) {
	return Type$calcLeastCommonAncestor$LType$LType$B(type1, type2, false);
};

var Type$calcLeastCommonAncestor$LType$LType$ = Type.calcLeastCommonAncestor$LType$LType$;

/**
 * @param {Type} type1
 * @param {Type} type2
 * @param {!boolean} acceptVariant
 * @return {Type}
 */
Type.calcLeastCommonAncestor$LType$LType$B = function (type1, type2, acceptVariant) {
	/** @type {ObjectType} */
	var obj1;
	/** @type {ObjectType} */
	var obj2;
	/** @type {Array.<undefined|ObjectType>} */
	var ifaces1;
	/** @type {Array.<undefined|Type>} */
	var candidates;
	/** @type {!number} */
	var i;
	/** @type {ObjectType} */
	var iface;
	/** @type {*} */
	var uniquify;
	if (type1.equals$LType$(type2)) {
		return type1;
	}
	if (Type$isIntegerOrNumber$LType$(type1) && Type$isIntegerOrNumber$LType$(type2)) {
		return Type.numberType;
	}
	if (Type.voidType.equals$LType$(type1) || Type.voidType.equals$LType$(type2)) {
		return null;
	}
	if (Type.variantType.equals$LType$(type1) || Type.variantType.equals$LType$(type2)) {
		return Type.variantType;
	}
	if (Type.nullType.equals$LType$(type1)) {
		return (Type.nullType.isConvertibleTo$LType$(type2) ? type2 : new NullableType$LType$(type2));
	}
	if (Type.nullType.equals$LType$(type2)) {
		return (Type.nullType.isConvertibleTo$LType$(type1) ? type1 : new NullableType$LType$(type1));
	}
	if (type1.resolveIfNullable$() instanceof PrimitiveType || type2.resolveIfNullable$() instanceof PrimitiveType) {
		if (type1.resolveIfNullable$().equals$LType$(type2.resolveIfNullable$())) {
			return new NullableType$LType$(type1);
		} else {
			if (Type$isIntegerOrNumber$LType$(type1.resolveIfNullable$()) && Type$isIntegerOrNumber$LType$(type2.resolveIfNullable$())) {
				return new NullableType$LType$(Type.numberType);
			} else {
				return (acceptVariant ? Type.variantType : null);
			}
		}
	}
	if (type1.resolveIfNullable$() instanceof ObjectType && type2.resolveIfNullable$() instanceof ObjectType) {
		obj1 = type1.resolveIfNullable$();
		obj2 = type2.resolveIfNullable$();
		ifaces1 = [];
		for (; ; ) {
			ifaces1 = ifaces1.concat(obj1.getClassDef$().implementTypes$().map((function (t) {
				return t;
			})));
			if (obj2.isConvertibleTo$LType$(obj1)) {
				break;
			}
			obj1 = obj1.getClassDef$().extendType$();
		}
		if (obj1.getClassDef$().className$() !== "Object") {
			return obj1;
		}
		candidates = [];
		for (i in ifaces1) {
			iface = ifaces1[i];
			do {
				if (obj2.isConvertibleTo$LType$(iface)) {
					candidates.push(iface);
					break;
				}
			} while (iface = iface.getClassDef$().extendType$());
		}
		function uniquify(list) {
			/** @type {Array.<undefined|Type>} */
			var result;
			/** @type {!number} */
			var i;
			/** @type {!number} */
			var j;
			result = [];
			for (i = 0; i < list.length; ++ i) {
				result.push(list[i]);
				for (j = i + 1; j < list.length; ++ j) {
					if (list[i].equals$LType$(list[j])) {
						result.pop();
						break;
					}
				}
			}
			return result;
		};
		candidates = uniquify(candidates);
		switch (candidates.length) {
		case 0:
			return obj1;
		case 1:
			return candidates[0];
		default:
			return null;
		}
	}
	if (type1.resolveIfNullable$() instanceof FunctionType && type2.resolveIfNullable$() instanceof FunctionType) {
		return null;
	}
	return (acceptVariant ? Type.variantType : null);
};

var Type$calcLeastCommonAncestor$LType$LType$B = Type.calcLeastCommonAncestor$LType$LType$B;

/**
 * @param {Array.<undefined|Type>} types
 * @return {Type}
 */
Type.calcLeastCommonAncestor$ALType$ = function (types) {
	return Type$calcLeastCommonAncestor$ALType$B(types, false);
};

var Type$calcLeastCommonAncestor$ALType$ = Type.calcLeastCommonAncestor$ALType$;

/**
 * @param {Array.<undefined|Type>} types
 * @param {!boolean} acceptVariant
 * @return {Type}
 */
Type.calcLeastCommonAncestor$ALType$B = function (types, acceptVariant) {
	/** @type {Type} */
	var type;
	/** @type {!number} */
	var i;
	if (types.length === 0) {
		return null;
	}
	type = types[0];
	for (i = 1; i < types.length; ++ i) {
		type = Type$calcLeastCommonAncestor$LType$LType$B(type, types[i], acceptVariant);
		if (type == null) {
			return null;
		}
	}
	return type;
};

var Type$calcLeastCommonAncestor$ALType$B = Type.calcLeastCommonAncestor$ALType$B;

/**
 * class VoidType extends Type
 * @constructor
 */
function VoidType() {
}

VoidType.prototype = new Type;
/**
 * @constructor
 */
function VoidType$() {
	Type$.call(this);
};

VoidType$.prototype = new VoidType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {VoidType}
 */
VoidType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};

/**
 * @return {!boolean}
 */
VoidType.prototype.isAssignable$ = function () {
	return false;
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
VoidType.prototype.isConvertibleTo$LType$ = function (type) {
	return false;
};

/**
 * @return {ClassDefinition}
 */
VoidType.prototype.getClassDef$ = function () {
	throw new Error("VoidType#getClassDef() is not supported");
};

/**
 * @return {!string}
 */
VoidType.prototype.toString = function () {
	return "void";
};

/**
 * class NullType extends Type
 * @constructor
 */
function NullType() {
}

NullType.prototype = new Type;
/**
 * @constructor
 */
function NullType$() {
	Type$.call(this);
};

NullType$.prototype = new NullType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {NullType}
 */
NullType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};

/**
 * @return {!boolean}
 */
NullType.prototype.isAssignable$ = function () {
	return false;
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
NullType.prototype.isConvertibleTo$LType$ = function (type) {
	return type instanceof NullableType || type instanceof ObjectType || type instanceof VariantType || type instanceof StaticFunctionType;
};

/**
 * @return {ClassDefinition}
 */
NullType.prototype.getClassDef$ = function () {
	throw new Error("NullType#getClassDef() is not supported");
};

/**
 * @return {!string}
 */
NullType.prototype.toString = function () {
	return "null";
};

/**
 * class PrimitiveType extends Type
 * @constructor
 */
function PrimitiveType() {
}

PrimitiveType.prototype = new Type;
/**
 * @constructor
 */
function PrimitiveType$() {
	Type$.call(this);
};

PrimitiveType$.prototype = new PrimitiveType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {Type}
 */
PrimitiveType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};

/**
 * @return {!boolean}
 */
PrimitiveType.prototype.isAssignable$ = function () {
	return true;
};

/**
 * class BooleanType extends PrimitiveType
 * @constructor
 */
function BooleanType() {
}

BooleanType.prototype = new PrimitiveType;
/**
 * @constructor
 */
function BooleanType$() {
	PrimitiveType$.call(this);
};

BooleanType$.prototype = new BooleanType;

/**
 * @param {Type} type
 * @return {!boolean}
 */
BooleanType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof BooleanType || type instanceof VariantType;
};

/**
 * @return {ClassDefinition}
 */
BooleanType.prototype.getClassDef$ = function () {
	return BooleanType._classDef;
};

/**
 * @return {!string}
 */
BooleanType.prototype.toString = function () {
	return "boolean";
};

/**
 * class IntegerType extends PrimitiveType
 * @constructor
 */
function IntegerType() {
}

IntegerType.prototype = new PrimitiveType;
/**
 * @constructor
 */
function IntegerType$() {
	PrimitiveType$.call(this);
};

IntegerType$.prototype = new IntegerType;

/**
 * @param {Type} type
 * @return {!boolean}
 */
IntegerType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
};

/**
 * @return {ClassDefinition}
 */
IntegerType.prototype.getClassDef$ = function () {
	return NumberType._classDef;
};

/**
 * @return {!string}
 */
IntegerType.prototype.toString = function () {
	return "int";
};

/**
 * class NumberType extends PrimitiveType
 * @constructor
 */
function NumberType() {
}

NumberType.prototype = new PrimitiveType;
/**
 * @constructor
 */
function NumberType$() {
	PrimitiveType$.call(this);
};

NumberType$.prototype = new NumberType;

/**
 * @param {Type} type
 * @return {!boolean}
 */
NumberType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
};

/**
 * @return {ClassDefinition}
 */
NumberType.prototype.getClassDef$ = function () {
	return NumberType._classDef;
};

/**
 * @return {!string}
 */
NumberType.prototype.toString = function () {
	return "number";
};

/**
 * class StringType extends PrimitiveType
 * @constructor
 */
function StringType() {
}

StringType.prototype = new PrimitiveType;
/**
 * @constructor
 */
function StringType$() {
	PrimitiveType$.call(this);
};

StringType$.prototype = new StringType;

/**
 * @param {Type} type
 * @return {!boolean}
 */
StringType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof StringType || type instanceof VariantType;
};

/**
 * @return {ClassDefinition}
 */
StringType.prototype.getClassDef$ = function () {
	return StringType._classDef;
};

/**
 * @return {!string}
 */
StringType.prototype.toString = function () {
	return "string";
};

/**
 * class VariantType extends Type
 * @constructor
 */
function VariantType() {
}

VariantType.prototype = new Type;
/**
 * @constructor
 */
function VariantType$() {
	Type$.call(this);
};

VariantType$.prototype = new VariantType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {VariantType}
 */
VariantType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};

/**
 * @return {!boolean}
 */
VariantType.prototype.isAssignable$ = function () {
	return true;
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
VariantType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof VariantType;
};

/**
 * @return {ClassDefinition}
 */
VariantType.prototype.getClassDef$ = function () {
	throw new Error("VariantType#getClassDef() is not supported");
};

/**
 * @return {!string}
 */
VariantType.prototype.toString = function () {
	return "variant";
};

/**
 * class NullableType extends Type
 * @constructor
 */
function NullableType() {
}

NullableType.prototype = new Type;
/**
 * @constructor
 * @param {Type} type
 */
function NullableType$LType$(type) {
	Type$.call(this);
	this._baseType = null;
	if (type.equals$LType$(Type.variantType)) {
		throw new Error("logic flaw, cannot create Nullable.<variant>");
	}
	this._baseType = (type instanceof NullableType ? type._baseType : type);
};

NullableType$LType$.prototype = new NullableType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {Type}
 */
NullableType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var baseType;
	baseType = this._baseType.resolveIfNullable$().instantiate$LInstantiationContext$(instantiationContext);
	return baseType.toNullableType$();
};

/**
 * @param {Type} x
 * @return {!boolean}
 */
NullableType.prototype.equals$LType$ = function (x) {
	return x instanceof NullableType && this._baseType.equals$LType$(x._baseType);
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
NullableType.prototype.isConvertibleTo$LType$ = function (type) {
	return this._baseType.isConvertibleTo$LType$(type instanceof NullableType ? type._baseType : type);
};

/**
 * @return {!boolean}
 */
NullableType.prototype.isAssignable$ = function () {
	return true;
};

/**
 * @return {ClassDefinition}
 */
NullableType.prototype.getClassDef$ = function () {
	return this._baseType.getClassDef$();
};

/**
 * @return {Type}
 */
NullableType.prototype.getBaseType$ = function () {
	return this._baseType;
};

/**
 * @return {!string}
 */
NullableType.prototype.toString = function () {
	return "Nullable.<" + this._baseType.toString() + ">";
};

/**
 * class VariableLengthArgumentType extends Type
 * @constructor
 */
function VariableLengthArgumentType() {
}

VariableLengthArgumentType.prototype = new Type;
/**
 * @constructor
 * @param {Type} type
 */
function VariableLengthArgumentType$LType$(type) {
	Type$.call(this);
	this._baseType = null;
	if (type instanceof VariableLengthArgumentType) {
		throw new Error("logic flaw");
	}
	this._baseType = type;
};

VariableLengthArgumentType$LType$.prototype = new VariableLengthArgumentType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {VariableLengthArgumentType}
 */
VariableLengthArgumentType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var baseType;
	baseType = this._baseType.instantiate$LInstantiationContext$(instantiationContext);
	return new VariableLengthArgumentType$LType$(baseType);
};

/**
 * @param {Type} x
 * @return {!boolean}
 */
VariableLengthArgumentType.prototype.equals$LType$ = function (x) {
	return x instanceof VariableLengthArgumentType && this._baseType.equals$LType$(x._baseType);
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
VariableLengthArgumentType.prototype.isConvertibleTo$LType$ = function (type) {
	throw new Error("logic flaw");
};

/**
 * @return {!boolean}
 */
VariableLengthArgumentType.prototype.isAssignable$ = function () {
	throw new Error("logic flaw");
};

/**
 * @return {ClassDefinition}
 */
VariableLengthArgumentType.prototype.getClassDef$ = function () {
	throw new Error("logic flaw");
};

/**
 * @return {Type}
 */
VariableLengthArgumentType.prototype.getBaseType$ = function () {
	return this._baseType;
};

/**
 * @return {!string}
 */
VariableLengthArgumentType.prototype.toString = function () {
	return "..." + this._baseType.toString();
};

/**
 * class ObjectType extends Type
 * @constructor
 */
function ObjectType() {
}

ObjectType.prototype = new Type;
/**
 * @constructor
 * @param {ClassDefinition} classDef
 */
function ObjectType$LClassDefinition$(classDef) {
	Type$.call(this);
	this._classDef = classDef;
};

ObjectType$LClassDefinition$.prototype = new ObjectType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {Type}
 */
ObjectType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
};

/**
 * @param {Type} x
 * @return {!boolean}
 */
ObjectType.prototype.equals$LType$ = function (x) {
	if (this instanceof ParsedObjectType && x instanceof ParsedObjectType && (this._classDef == null || x._classDef == null)) {
		return this.toString() === x.toString();
	}
	return x instanceof ObjectType && this._classDef == x._classDef;
};

/**
 * @param {AnalysisContext} context
 */
ObjectType.prototype.resolveType$LAnalysisContext$ = function (context) {
	if (this._classDef == null) {
		throw new Error("logic flaw");
	}
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
ObjectType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	if (type instanceof VariantType) {
		return true;
	}
	if (! (type instanceof ObjectType)) {
		return false;
	}
	if (this._classDef == null) {
		return false;
	}
	return this._classDef.isConvertibleTo$LClassDefinition$(type._classDef);
};

/**
 * @return {!boolean}
 */
ObjectType.prototype.isAssignable$ = function () {
	return true;
};

/**
 * @return {ClassDefinition}
 */
ObjectType.prototype.getClassDef$ = function () {
	return this._classDef;
};

/**
 * @return {!string}
 */
ObjectType.prototype.toString = function () {
	return (this._classDef != null ? this._classDef.className$() : "(null)");
};

/**
 * class ParsedObjectType extends ObjectType
 * @constructor
 */
function ParsedObjectType() {
}

ParsedObjectType.prototype = new ObjectType;
/**
 * @constructor
 * @param {QualifiedName} qualifiedName
 * @param {Array.<undefined|Type>} typeArgs
 */
function ParsedObjectType$LQualifiedName$ALType$(qualifiedName, typeArgs) {
	ObjectType$LClassDefinition$.call(this, null);
	this._qualifiedName = qualifiedName;
	this._typeArguments = typeArgs;
};

ParsedObjectType$LQualifiedName$ALType$.prototype = new ParsedObjectType;

/**
 * @return {Token}
 */
ParsedObjectType.prototype.getToken$ = function () {
	return this._qualifiedName.getToken$();
};

/**
 * @return {QualifiedName}
 */
ParsedObjectType.prototype.getQualifiedName$ = function () {
	return this._qualifiedName;
};

/**
 * @return {Array.<undefined|Type>}
 */
ParsedObjectType.prototype.getTypeArguments$ = function () {
	return this._typeArguments;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {Type}
 */
ParsedObjectType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {ParsedObjectType} */
	var enclosingType;
	/** @type {Type} */
	var actualType;
	/** @type {QualifiedName} */
	var qualifiedName;
	/** @type {ParsedObjectType} */
	var actualEnclosingType;
	/** @type {Array.<undefined|Type>} */
	var typeArgs;
	/** @type {!number} */
	var i;
	/** @type {!string} */
	var templateClassName;
	/** @type {ParsedObjectType} */
	var objectType;
	enclosingType = this._qualifiedName.getEnclosingType$();
	if (enclosingType == null && this._typeArguments.length === 0) {
		actualType = instantiationContext.typemap[this._qualifiedName.getToken$().getValue$()];
		if (actualType != null) {
			return actualType;
		}
		if (this._classDef == null) {
			instantiationContext.objectTypesUsed.push(this);
		}
		return this;
	}
	qualifiedName = this._qualifiedName;
	if (enclosingType != null) {
		actualEnclosingType = this._qualifiedName.getEnclosingType$().instantiate$LInstantiationContext$(instantiationContext);
		if (! this._qualifiedName.getEnclosingType$().equals$LType$(actualEnclosingType)) {
			qualifiedName = new QualifiedName$LToken$LParsedObjectType$(this._qualifiedName.getToken$(), actualEnclosingType);
		}
	}
	typeArgs = [];
	for (i = 0; i < this._typeArguments.length; ++ i) {
		if (this._typeArguments[i] instanceof ParsedObjectType && this._typeArguments[i].getTypeArguments$().length !== 0) {
			actualType = this._typeArguments[i].instantiate$LInstantiationContext$(instantiationContext);
		} else {
			actualType = instantiationContext.typemap[this._typeArguments[i].toString()];
		}
		typeArgs[i] = (actualType != null ? actualType : this._typeArguments[i]);
		if (typeArgs[i] instanceof NullableType) {
			templateClassName = qualifiedName.getToken$().getValue$();
			if (templateClassName === "Array" || templateClassName === "Map") {
				typeArgs[i] = typeArgs[i].getBaseType$();
			}
		}
	}
	objectType = new ParsedObjectType$LQualifiedName$ALType$(qualifiedName, typeArgs);
	instantiationContext.objectTypesUsed.push(objectType);
	return objectType;
};

/**
 * @param {AnalysisContext} context
 */
ParsedObjectType.prototype.resolveType$LAnalysisContext$ = function (context) {
	if (this._classDef == null) {
		this._classDef = this._qualifiedName.getClass$LAnalysisContext$ALType$(context, this._typeArguments);
	}
};

/**
 * @return {!string}
 */
ParsedObjectType.prototype.toString = function () {
	return (this._typeArguments.length !== 0 ? Type$templateTypeToString$SALType$(this._qualifiedName.getToken$().getValue$(), this._typeArguments) : this._qualifiedName.getToken$().getValue$());
};

/**
 * class FunctionType extends Type
 * @constructor
 */
function FunctionType() {
}

FunctionType.prototype = new Type;
/**
 * @constructor
 */
function FunctionType$() {
	Type$.call(this);
};

FunctionType$.prototype = new FunctionType;

/**
 * @param {Type} type
 * @return {!boolean}
 */
FunctionType.prototype.isConvertibleTo$LType$ = function (type) {
	return false;
};

/**
 * @return {ClassDefinition}
 */
FunctionType.prototype.getClassDef$ = function () {
	return FunctionType._classDef;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {FunctionType}
 */
FunctionType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw");
};

/**
 * class FunctionChoiceType extends FunctionType
 * @constructor
 */
function FunctionChoiceType() {
}

FunctionChoiceType.prototype = new FunctionType;
/**
 * @constructor
 * @param {Array.<undefined|ResolvedFunctionType>} types
 */
function FunctionChoiceType$ALResolvedFunctionType$(types) {
	FunctionType$.call(this);
	this._types = types;
};

FunctionChoiceType$ALResolvedFunctionType$.prototype = new FunctionChoiceType;

/**
 * @return {!boolean}
 */
FunctionChoiceType.prototype.isAssignable$ = function () {
	return false;
};

/**
 * @return {Type}
 */
FunctionChoiceType.prototype.asAssignableType$ = function () {
	throw new Error("logic flaw");
};

/**
 * @param {AnalysisContext} context
 * @param {Token} operatorToken
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {ResolvedFunctionType}
 */
FunctionChoiceType.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var $this = this;
	/** @type {Array.<undefined|ResolvedFunctionType>} */
	var types;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|ResolvedFunctionType>} */
	var matched;
	/** @type {Array.<undefined|CompileNote>} */
	var notes;
	types = this._types;
	for (i = 0; i < types.length; ++ i) {
		if (types[i]._deduceByArgumentTypes$ALType$BBF$SV$(argTypes, isStatic, true, (function (msg) {
		}))) {
			return types[i];
		}
	}
	matched = [];
	notes = [];
	for (i = 0; i < types.length; ++ i) {
		if (types[i]._deduceByArgumentTypes$ALType$BBF$SV$(argTypes, isStatic, false, (function (msg) {
			notes.push(new CompileNote$LToken$S(types[i].getToken$(), 'candidate function not viable: ' + msg));
		}))) {
			matched.push(types[i]);
		}
	}
	switch (matched.length) {
	case 0:
		context.errors.push(new CompileError$LToken$S(operatorToken, operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$().toString() : "no function with matching arguments"));
		break;
	case 1:
		return matched[0];
	default:
		context.errors.push(new CompileError$LToken$S(operatorToken, "result of function resolution using the arguments is ambiguous"));
		break;
	}
	context.errors[context.errors.length - 1].addCompileNotes$ALCompileNote$(notes);
	return null;
};

/**
 * @param {!number} numberOfArgs
 * @param {!boolean} isStatic
 * @return {Array.<undefined|Array.<undefined|Type>>}
 */
FunctionChoiceType.prototype.getExpectedTypes$NB = function (numberOfArgs, isStatic) {
	/** @type {Array.<undefined|Array.<undefined|Type>>} */
	var expected;
	/** @type {!number} */
	var i;
	expected = [];
	for (i = 0; i < this._types.length; ++ i) {
		this._types[i]._getExpectedTypes$AALType$NB(expected, numberOfArgs, isStatic);
	}
	return expected;
};

/**
 * @return {!string}
 */
FunctionChoiceType.prototype.toString = function () {
	return (this._types.length === 1 ? this._types[0].toString() : "<<multiple choices>>");
};

/**
 * @return {Type}
 */
FunctionChoiceType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};

/**
 * class ResolvedFunctionType extends FunctionType
 * @constructor
 */
function ResolvedFunctionType() {
}

ResolvedFunctionType.prototype = new FunctionType;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} returnType
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isAssignable
 */
function ResolvedFunctionType$LToken$LType$ALType$B(token, returnType, argTypes, isAssignable) {
	FunctionType$.call(this);
	this._token = token;
	this._returnType = returnType;
	this._argTypes = argTypes;
	this._isAssignable = isAssignable;
};

ResolvedFunctionType$LToken$LType$ALType$B.prototype = new ResolvedFunctionType;

/**
 * @return {ResolvedFunctionType}
 */
ResolvedFunctionType.prototype._clone$ = function () {
	throw new Error("logic flaw");
};

/**
 * @return {!string}
 */
ResolvedFunctionType.prototype._toStringPrefix$ = function () {
	throw new Error("logic flaw");
};

/**
 * @param {!boolean} isAssignable
 * @return {ResolvedFunctionType}
 */
ResolvedFunctionType.prototype.setIsAssignable$B = function (isAssignable) {
	this._isAssignable = isAssignable;
	return this;
};

/**
 * @return {!boolean}
 */
ResolvedFunctionType.prototype.isAssignable$ = function () {
	return this._isAssignable;
};

/**
 * @return {Type}
 */
ResolvedFunctionType.prototype.asAssignableType$ = function () {
	return this._clone$().setIsAssignable$B(true);
};

/**
 * @return {Token}
 */
ResolvedFunctionType.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Type}
 */
ResolvedFunctionType.prototype.getReturnType$ = function () {
	return this._returnType;
};

/**
 * @return {Array.<undefined|Type>}
 */
ResolvedFunctionType.prototype.getArgumentTypes$ = function () {
	return this._argTypes;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} operatorToken
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {ResolvedFunctionType}
 */
ResolvedFunctionType.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var $this = this;
	/** @type {!string} */
	var note;
	/** @type {CompileError} */
	var error;
	note = '';
	if (! this._deduceByArgumentTypes$ALType$BBF$SV$(argTypes, isStatic, false, (function (msg) {
		note = msg;
	}))) {
		error = new CompileError$LToken$S(operatorToken, operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$.toString() : "no function with matching arguments");
		error.addCompileNote$LCompileNote$(new CompileNote$LToken$S(this._token != null ? this._token : operatorToken, 'candidate function not viable: ' + note));
		context.errors.push(error);
		return null;
	}
	return this;
};

/**
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @param {!boolean} exact
 * @param {*} cb
 * @return {!boolean}
 */
ResolvedFunctionType.prototype._deduceByArgumentTypes$ALType$BBF$SV$ = function (argTypes, isStatic, exact, cb) {
	var $this = this;
	/** @type {*} */
	var compareArg;
	/** @type {VariableLengthArgumentType} */
	var vargType;
	/** @type {!number} */
	var i;
	compareArg = (function (formal, actual) {
		if (formal.equals$LType$(actual)) {
			return true;
		} else {
			if (! exact && actual.isConvertibleTo$LType$(formal)) {
				return true;
			}
		}
		return false;
	});
	if (this instanceof StaticFunctionType !== isStatic) {
		cb('unmatched static flags');
		return false;
	}
	if (this._argTypes.length !== 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		vargType = this._argTypes[this._argTypes.length - 1];
		if (argTypes.length < this._argTypes.length - 1) {
			cb('wrong number of arguments');
			return false;
		}
		for (i = 0; i < this._argTypes.length - 1; ++ i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				cb(Util$format$SAS('no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ]));
				return false;
			}
		}
		if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length === this._argTypes.length) {
			if (! compareArg(this._argTypes[i].getBaseType$(), argTypes[i].getBaseType$())) {
				cb(Util$format$SAS('no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].getBaseType$().toString(), this._argTypes[i].getBaseType$().toString(), Util$toOrdinal$N(i + 1) ]));
				return false;
			}
		} else {
			for (; i < argTypes.length; ++ i) {
				if (! compareArg(vargType.getBaseType$(), argTypes[i])) {
					cb(Util$format$SAS('no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), vargType.getBaseType$().toString(), Util$toOrdinal$N(i + 1) ]));
					return false;
				}
			}
		}
	} else {
		if (argTypes.length !== this._argTypes.length) {
			cb(Util$format$SAS('wrong number of arguments (%1 for %2)', [ argTypes.length + "", this._argTypes.length + "" ]));
			return false;
		}
		for (i = 0; i < argTypes.length; ++ i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				cb(Util$format$SAS('no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ]));
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {!number} numberOfArgs
 * @param {!boolean} isStatic
 * @return {Array.<undefined|Array.<undefined|Type>>}
 */
ResolvedFunctionType.prototype.getExpectedTypes$NB = function (numberOfArgs, isStatic) {
	/** @type {Array.<undefined|Array.<undefined|Type>>} */
	var expected;
	expected = [];
	this._getExpectedTypes$AALType$NB(expected, numberOfArgs, isStatic);
	return expected;
};

/**
 * @param {Array.<undefined|Array.<undefined|Type>>} expected
 * @param {!number} numberOfArgs
 * @param {!boolean} isStatic
 */
ResolvedFunctionType.prototype._getExpectedTypes$AALType$NB = function (expected, numberOfArgs, isStatic) {
	var $this = this;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!number} */
	var i;
	/** @type {!boolean} */
	var hasCallback;
	/** @type {Array.<undefined|Type>} */
	var callbackArgTypes;
	if (this instanceof StaticFunctionType !== isStatic) {
		return;
	}
	argTypes = [];
	if (this._argTypes.length > 0 && numberOfArgs >= this._argTypes.length && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		for (i = 0; i < numberOfArgs; ++ i) {
			if (i < this._argTypes.length - 1) {
				argTypes[i] = this._argTypes[i];
			} else {
				argTypes[i] = this._argTypes[this._argTypes.length - 1].getBaseType$();
			}
		}
	} else {
		if (this._argTypes.length === numberOfArgs) {
			argTypes = this._argTypes;
		} else {
			return;
		}
	}
	hasCallback = false;
	callbackArgTypes = argTypes.map((function (argType) {
		/** @type {!string} */
		var typeName;
		typeName = '';
		if (argType instanceof StaticFunctionType || argType instanceof ObjectType && argType.getClassDef$() instanceof InstantiatedClassDefinition && ((typeName = argType.getClassDef$().getTemplateClassName$()) === 'Array' || typeName === 'Map')) {
			hasCallback = true;
			return argType;
		} else {
			return null;
		}
	}));
	if (hasCallback) {
		expected.push(callbackArgTypes);
	}
};

/**
 * @return {!string}
 */
ResolvedFunctionType.prototype.toString = function () {
	/** @type {Array.<undefined|!string>} */
	var args;
	/** @type {!number} */
	var i;
	args = [];
	for (i = 0; i < this._argTypes.length; ++ i) {
		if (this._argTypes[i] instanceof VariableLengthArgumentType) {
			args[i] = "... : " + this._argTypes[i].getBaseType$().toString();
		} else {
			args[i] = ": " + this._argTypes[i].toString();
		}
	}
	return this._toStringPrefix$() + "function (" + args.join(", ") + ") : " + this._returnType.toString();
};

/**
 * @return {Type}
 */
ResolvedFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};

/**
 * class StaticFunctionType extends ResolvedFunctionType
 * @constructor
 */
function StaticFunctionType() {
}

StaticFunctionType.prototype = new ResolvedFunctionType;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} returnType
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isAssignable
 */
function StaticFunctionType$LToken$LType$ALType$B(token, returnType, argTypes, isAssignable) {
	ResolvedFunctionType$LToken$LType$ALType$B.call(this, token, returnType, argTypes, isAssignable);
};

StaticFunctionType$LToken$LType$ALType$B.prototype = new StaticFunctionType;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {StaticFunctionType}
 */
StaticFunctionType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var returnType;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!number} */
	var i;
	returnType = this._returnType.instantiate$LInstantiationContext$(instantiationContext);
	if (returnType == null) {
		return null;
	}
	argTypes = [];
	for (i = 0; i < this._argTypes.length; ++ i) {
		if ((argTypes[i] = this._argTypes[i].instantiate$LInstantiationContext$(instantiationContext)) == null) {
			return null;
		}
	}
	return new StaticFunctionType$LToken$LType$ALType$B(this._token, returnType, argTypes, this._isAssignable);
};

/**
 * @param {Type} x
 * @return {!boolean}
 */
StaticFunctionType.prototype.equals$LType$ = function (x) {
	return x instanceof StaticFunctionType && this._returnType.equals$LType$(x._returnType) && Util$typesAreEqual$ALType$ALType$(this._argTypes, x._argTypes);
};

/**
 * @return {ResolvedFunctionType}
 */
StaticFunctionType.prototype._clone$ = function () {
	return new StaticFunctionType$LToken$LType$ALType$B(this._token, this._returnType, this._argTypes, this._isAssignable);
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
StaticFunctionType.prototype.isConvertibleTo$LType$ = function (type) {
	var $this = this;
	type = type.resolveIfNullable$();
	if (type instanceof VariantType) {
		return true;
	}
	if (! (type instanceof StaticFunctionType)) {
		return false;
	}
	if (! this._returnType.equals$LType$(type.getReturnType$())) {
		return false;
	}
	return this._deduceByArgumentTypes$ALType$BBF$SV$(type.getArgumentTypes$(), true, true, (function (msg) {
	}));
};

/**
 * @return {!string}
 */
StaticFunctionType.prototype._toStringPrefix$ = function () {
	return "";
};

/**
 * @return {Type}
 */
StaticFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};

/**
 * class MemberFunctionType extends ResolvedFunctionType
 * @constructor
 */
function MemberFunctionType() {
}

MemberFunctionType.prototype = new ResolvedFunctionType;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} objectType
 * @param {Type} returnType
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isAssignable
 */
function MemberFunctionType$LToken$LType$LType$ALType$B(token, objectType, returnType, argTypes, isAssignable) {
	ResolvedFunctionType$LToken$LType$ALType$B.call(this, token, returnType, argTypes, isAssignable);
	this._objectType = objectType;
};

MemberFunctionType$LToken$LType$LType$ALType$B.prototype = new MemberFunctionType;

/**
 * @param {Type} x
 * @return {!boolean}
 */
MemberFunctionType.prototype.equals$LType$ = function (x) {
	return x instanceof MemberFunctionType && this._objectType == x._objectType && this._returnType.equals$LType$(x._returnType) && Util$typesAreEqual$ALType$ALType$(this._argTypes, x._argTypes);
};

/**
 * @return {MemberFunctionType}
 */
MemberFunctionType.prototype._clone$ = function () {
	return new MemberFunctionType$LToken$LType$LType$ALType$B(this._token, this._objectType, this._returnType, this._argTypes, this._isAssignable);
};

/**
 * @return {!string}
 */
MemberFunctionType.prototype._toStringPrefix$ = function () {
	return this._objectType.toString() + ".";
};

/**
 * @return {Type}
 */
MemberFunctionType.prototype.getObjectType$ = function () {
	return this._objectType;
};

/**
 * class Token extends Object
 * @constructor
 */
function Token() {
}

/**
 * @constructor
 * @param {!string} value
 * @param {!boolean} isIdentifier
 */
function Token$SB(value, isIdentifier) {
	Token$SBUSNN.call(this, value, isIdentifier, null, NaN, NaN);
};

Token$SB.prototype = new Token;

/**
 * @constructor
 * @param {!string} value
 * @param {!boolean} isIdentifier
 * @param {undefined|!string} filename
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 */
function Token$SBUSNN(value, isIdentifier, filename, lineNumber, columnNumber) {
	this._value = value;
	this._isIdentifier = isIdentifier;
	this._filename = filename;
	this._lineNumber = lineNumber;
	this._columnNumber = columnNumber;
};

Token$SBUSNN.prototype = new Token;

/**
 * @return {!string}
 */
Token.prototype.getValue$ = function () {
	return this._value;
};

/**
 * @return {!boolean}
 */
Token.prototype.isIdentifier$ = function () {
	return this._isIdentifier;
};

/**
 * @return {undefined|!string}
 */
Token.prototype.getFilename$ = function () {
	return this._filename;
};

/**
 * @return {!number}
 */
Token.prototype.getLineNumber$ = function () {
	return this._lineNumber;
};

/**
 * @return {!number}
 */
Token.prototype.getColumnNumber$ = function () {
	return this._columnNumber;
};

/**
 * @return {*}
 */
Token.prototype.serialize$ = function () {
	return [ this._value, this._isIdentifier, this._filename, this._lineNumber, this._columnNumber ];
};

/**
 * class _Lexer extends Object
 * @constructor
 */
function _Lexer() {
}

/**
 * @constructor
 */
function _Lexer$() {
};

_Lexer$.prototype = new _Lexer;

/**
 * @param {Array.<undefined|!string>} patterns
 * @return {!string}
 */
_Lexer.makeAlt$AS = function (patterns) {
	return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
};

var _Lexer$makeAlt$AS = _Lexer.makeAlt$AS;

/**
 * @param {!string} pattern
 * @return {!string}
 */
_Lexer.quoteMeta$S = function (pattern) {
	return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
};

var _Lexer$quoteMeta$S = _Lexer.quoteMeta$S;

/**
 * @param {Array.<undefined|!string>} array
 * @return {Object.<string, undefined|!boolean>}
 */
_Lexer.asMap$AS = function (array) {
	/** @type {Object.<string, undefined|!boolean>} */
	var hash;
	/** @type {!number} */
	var i;
	hash = {};
	for (i = 0; i < array.length; ++ i) {
		hash[array[i]] = true;
	}
	return hash;
};

var _Lexer$asMap$AS = _Lexer.asMap$AS;

/**
 * @param {!string} pat
 * @return {RegExp}
 */
_Lexer.rx$S = function (pat) {
	return new RegExp(pat.replace(/[ \t\r\n]/g, ""));
};

var _Lexer$rx$S = _Lexer.rx$S;

/**
 * class Import extends Object
 * @constructor
 */
function Import() {
}

/**
 * @constructor
 * @param {Parser} parser
 */
function Import$LParser$(parser) {
	this._filenameToken = null;
	this._aliasToken = null;
	this._classNames = null;
	this._sourceParsers = [ parser ];
};

Import$LParser$.prototype = new Import;

/**
 * @constructor
 * @param {Token} filenameToken
 * @param {Token} aliasToken
 * @param {Array.<undefined|Token>} classNames
 */
function Import$LToken$LToken$ALToken$(filenameToken, aliasToken, classNames) {
	this._filenameToken = filenameToken;
	this._aliasToken = aliasToken;
	this._classNames = classNames;
	this._sourceParsers = [  ];
};

Import$LToken$LToken$ALToken$.prototype = new Import;

/**
 * @return {Token}
 */
Import.prototype.getFilenameToken$ = function () {
	return this._filenameToken;
};

/**
 * @return {undefined|!string}
 */
Import.prototype.getAlias$ = function () {
	if (this._aliasToken) {
		return this._aliasToken.getValue$();
	} else {
		return null;
	}
};

/**
 * @return {Array.<undefined|!string>}
 */
Import.prototype.getClassNames$ = function () {
	/** @type {Array.<undefined|!string>} */
	var names;
	/** @type {!number} */
	var i;
	if (this._classNames == null) {
		return null;
	}
	names = [];
	for (i = 0; i < this._classNames.length; ++ i) {
		names[i] = this._classNames[i].getValue$();
	}
	return names;
};

/**
 * @return {*}
 */
Import.prototype.serialize$ = function () {
	return [ "Import", Serializer$Token$E$serializeNullable$LToken$(this._filenameToken), Serializer$Token$E$serializeNullable$LToken$(this._aliasToken), Serializer$Token$E$serializeArray$ALToken$(this._classNames) ];
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} nameToken
 * @return {!boolean}
 */
Import.prototype.checkNameConflict$ALCompileError$LToken$ = function (errors, nameToken) {
	/** @type {!number} */
	var i;
	if (this._aliasToken != null) {
		if (this._aliasToken.getValue$() === nameToken.getValue$()) {
			errors.push(new CompileError$LToken$S(nameToken, "an alias with the same name is already declared"));
			return false;
		}
	} else {
		if (this._classNames != null) {
			for (i = 0; i < this._classNames.length; ++ i) {
				if (this._classNames[i].getValue$() === nameToken.getValue$()) {
					errors.push(new CompileError$LToken$S(nameToken, "a class with the same name has already been explicitely imported"));
					return false;
				}
			}
		}
	}
	return true;
};

/**
 * @param {Parser} parser
 */
Import.prototype.addSource$LParser$ = function (parser) {
	this._sourceParsers.push(parser);
};

/**
 * @return {Array.<undefined|Parser>}
 */
Import.prototype.getSources$ = function () {
	return this._sourceParsers;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 */
Import.prototype.assertExistenceOfNamedClasses$ALCompileError$ = function (errors) {
	var $this = this;
	/** @type {Array.<undefined|!string>} */
	var allClassNames;
	/** @type {!number} */
	var i;
	/** @type {*} */
	var countNumberOfClassesByName;
	if (this._classNames == null) {
		return;
	}
	allClassNames = [];
	for (i = 0; i < this._sourceParsers.length; ++ i) {
		allClassNames = allClassNames.concat(this._sourceParsers[i].getClassDefs$().map((function (classDef) {
			return classDef.className$();
		})));
		allClassNames = allClassNames.concat(this._sourceParsers[i].getTemplateClassDefs$().map((function (classDef) {
			return classDef.className$();
		})));
	}
	function countNumberOfClassesByName(className) {
		/** @type {!number} */
		var num;
		/** @type {!number} */
		var i;
		num = 0;
		for (i = 0; i < allClassNames.length; ++ i) {
			if (allClassNames[i] == className) {
				++ num;
			}
		}
		return num;
	};
	for (i = 0; i < this._classNames.length; ++ i) {
		switch (countNumberOfClassesByName(this._classNames[i].getValue$())) {
		case 0:
			errors.push(new CompileError$LToken$S(this._classNames[i], "no definition for class '" + this._classNames[i].getValue$() + "'"));
			break;
		case 1:
			break;
		default:
			errors.push(new CompileError$LToken$S(this._classNames[i], "multiple candidates for class '" + this._classNames[i].getValue$() + "'"));
			break;
		}
	}
};

/**
 * @param {!string} name
 * @return {Array.<undefined|ClassDefinition>}
 */
Import.prototype.getClasses$S = function (name) {
	/** @type {Array.<undefined|ClassDefinition>} */
	var found;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	/** @type {!number} */
	var j;
	/** @type {ClassDefinition} */
	var classDef;
	if (! this._classIsImportable$S(name)) {
		return [  ];
	}
	found = [  ];
	for (i = 0; i < this._sourceParsers.length; ++ i) {
		classDefs = this._sourceParsers[i].getClassDefs$();
		for (j = 0; j < classDefs.length; ++ j) {
			classDef = classDefs[j];
			if (classDef.className$() === name) {
				found.push(classDef);
				break;
			}
		}
	}
	return found;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @param {*} postInstantiationCallback
 * @return {Array.<undefined|*>}
 */
Import.prototype.createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	/** @type {Array.<undefined|*>} */
	var callbacks;
	/** @type {!number} */
	var i;
	/** @type {*} */
	var callback;
	if (! this._classIsImportable$S(request.getClassName$())) {
		return [];
	}
	callbacks = [];
	for (i = 0; i < this._sourceParsers.length; ++ i) {
		callback = this._sourceParsers[i].createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback);
		if (callback != null) {
			callbacks.push(callback);
		}
	}
	return callbacks;
};

/**
 * @param {!string} name
 * @return {!boolean}
 */
Import.prototype._classIsImportable$S = function (name) {
	/** @type {!number} */
	var i;
	if (this._classNames != null) {
		for (i = 0; i < this._classNames.length; ++ i) {
			if (this._classNames[i].getValue$() === name) {
				break;
			}
		}
		if (i === this._classNames.length) {
			return false;
		}
	} else {
		if (name.charAt(0) === '_') {
			return false;
		}
	}
	return true;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} filenameToken
 * @param {Token} aliasToken
 * @param {Array.<undefined|Token>} classNames
 * @return {Import}
 */
Import.create$ALCompileError$LToken$LToken$ALToken$ = function (errors, filenameToken, aliasToken, classNames) {
	/** @type {!string} */
	var filename;
	/** @type {Array.<undefined|!string>} */
	var match;
	filename = Util$decodeStringLiteral$S(filenameToken.getValue$());
	if (filename.indexOf("*") !== - 1) {
		match = filename.match(/^([^\*]*)\/\*(\.[^\/\*]*)$/);
		if (match == null) {
			errors.push(new CompileError$LToken$S(filenameToken, "invalid use of wildcard"));
			return null;
		}
		return new WildcardImport$LToken$LToken$ALToken$SS(filenameToken, aliasToken, classNames, match[1], match[2]);
	}
	return new Import$LToken$LToken$ALToken$(filenameToken, aliasToken, classNames);
};

var Import$create$ALCompileError$LToken$LToken$ALToken$ = Import.create$ALCompileError$LToken$LToken$ALToken$;

/**
 * class WildcardImport extends Import
 * @constructor
 */
function WildcardImport() {
}

WildcardImport.prototype = new Import;
/**
 * @constructor
 * @param {Token} filenameToken
 * @param {Token} aliasToken
 * @param {Array.<undefined|Token>} classNames
 * @param {!string} directory
 * @param {!string} suffix
 */
function WildcardImport$LToken$LToken$ALToken$SS(filenameToken, aliasToken, classNames, directory, suffix) {
	Import$LToken$LToken$ALToken$.call(this, filenameToken, aliasToken, classNames);
	this._directory = directory;
	this._suffix = suffix;
};

WildcardImport$LToken$LToken$ALToken$SS.prototype = new WildcardImport;

/**
 * @return {!string}
 */
WildcardImport.prototype.getDirectory$ = function () {
	return this._directory;
};

/**
 * @return {!string}
 */
WildcardImport.prototype.getSuffix$ = function () {
	return this._suffix;
};

/**
 * class QualifiedName extends Object
 * @constructor
 */
function QualifiedName() {
}

/**
 * @constructor
 * @param {Token} token
 */
function QualifiedName$LToken$(token) {
	this._token = token;
	this._import = null;
	this._enclosingType = null;
};

QualifiedName$LToken$.prototype = new QualifiedName;

/**
 * @constructor
 * @param {Token} token
 * @param {Import} imprt
 */
function QualifiedName$LToken$LImport$(token, imprt) {
	this._token = token;
	this._import = imprt;
	this._enclosingType = null;
};

QualifiedName$LToken$LImport$.prototype = new QualifiedName;

/**
 * @constructor
 * @param {Token} token
 * @param {ParsedObjectType} enclosingType
 */
function QualifiedName$LToken$LParsedObjectType$(token, enclosingType) {
	this._token = token;
	this._import = null;
	this._enclosingType = enclosingType;
};

QualifiedName$LToken$LParsedObjectType$.prototype = new QualifiedName;

/**
 * @return {Token}
 */
QualifiedName.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Import}
 */
QualifiedName.prototype.getImport$ = function () {
	return this._import;
};

/**
 * @return {ParsedObjectType}
 */
QualifiedName.prototype.getEnclosingType$ = function () {
	return this._enclosingType;
};

/**
 * @return {*}
 */
QualifiedName.prototype.serialize$ = function () {
	return [ "QualifiedName", this._token.serialize$(), Serializer$Import$E$serializeNullable$LImport$(this._import), Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$(this._enclosingType) ];
};

/**
 * @param {QualifiedName} x
 * @return {!boolean}
 */
QualifiedName.prototype.equals$LQualifiedName$ = function (x) {
	if (x == null) {
		return false;
	}
	if (this._token.getValue$() !== x._token.getValue$()) {
		return false;
	}
	if (this._import != x._import) {
		return false;
	}
	if (this._enclosingType == null) {
		if (x._enclosingType != null) {
			return false;
		}
	} else {
		if (! this._enclosingType.equals$LType$(x._enclosingType)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {Array.<undefined|Type>} typeArguments
 * @return {ClassDefinition}
 */
QualifiedName.prototype.getClass$LAnalysisContext$ALType$ = function (context, typeArguments) {
	var $this = this;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	/** @type {Array.<undefined|*>} */
	var callbacks;
	/** @type {ClassDefinition} */
	var enclosingClassDef;
	classDef = null;
	if (this._import != null) {
		if (typeArguments.length === 0) {
			classDefs = this._import.getClasses$S(this._token.getValue$());
			switch (classDefs.length) {
			case 1:
				classDef = classDefs[0];
				break;
			case 0:
				context.errors.push(new CompileError$LToken$S(this._token, "no definition for class '" + this.toString() + "' in file '" + this._import.getFilenameToken$().getValue$() + "'"));
				return null;
			default:
				context.errors.push(new CompileError$LToken$S(this._token, "multiple candidates"));
				return null;
			}
		} else {
			callbacks = this._import.createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest$LToken$SALType$(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
				return null;
			}));
			switch (callbacks.length) {
			case 1:
				return callbacks[0](null, null, null);
			case 0:
				context.errors.push(new CompileError$LToken$S(this._token, "no definition for template class '" + this.toString() + "' in file '" + this._import.getFilenameToken$().getValue$() + "'"));
				return null;
			default:
				context.errors.push(new CompileError$LToken$S(this._token, "multiple canditates"));
				return null;
			}
		}
	} else {
		if (this._enclosingType != null) {
			this._enclosingType.resolveType$LAnalysisContext$(context);
			if ((enclosingClassDef = this._enclosingType.getClassDef$()) == null) {
				return null;
			}
			if (typeArguments.length === 0) {
				if ((classDef = enclosingClassDef.lookupInnerClass$S(this._token.getValue$())) == null) {
					context.errors.push(new CompileError$LToken$S(this._token, "no class definition for '" + this.toString() + "'"));
					return null;
				}
			} else {
				if ((classDef = enclosingClassDef.lookupTemplateInnerClass$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest$LToken$SALType$(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
					return null;
				}))) == null) {
					context.errors.push(new CompileError$LToken$S(this._token, "failed to instantiate class"));
					return null;
				}
			}
		} else {
			if (typeArguments.length === 0) {
				if ((classDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, this._token.getValue$())) == null) {
					context.errors.push(new CompileError$LToken$S(this._token, "no class definition for '" + this.toString() + "'"));
					return null;
				}
			} else {
				if ((classDef = context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest$LToken$SALType$(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
					return null;
				}))) == null) {
					context.errors.push(new CompileError$LToken$S(this._token, "failed to instantiate class"));
					return null;
				}
			}
		}
	}
	return classDef;
};

/**
 * @param {Parser} parser
 * @return {TemplateClassDefinition}
 */
QualifiedName.prototype.getTemplateClass$LParser$ = function (parser) {
	var $this = this;
	/** @type {Array.<undefined|TemplateClassDefinition>} */
	var foundClassDefs;
	/** @type {*} */
	var checkClassDef;
	foundClassDefs = [];
	checkClassDef = (function (classDef) {
		if (classDef.className$() === $this._token.getValue$()) {
			foundClassDefs.push(classDef);
		}
	});
	if (this._import != null) {
		this._import.getSources$().forEach((function (parser) {
			parser.getTemplateClassDefs$().forEach(checkClassDef);
		}));
	} else {
		parser.getTemplateClassDefs$().forEach(checkClassDef);
		if (foundClassDefs.length === 0) {
			parser.getImports$().forEach((function (imprt) {
				imprt.getSources$().forEach((function (parser) {
					parser.getTemplateClassDefs$().forEach(checkClassDef);
				}));
			}));
		}
	}
	return (foundClassDefs.length === 1 ? foundClassDefs[0] : null);
};

/**
 * @return {!string}
 */
QualifiedName.prototype.toString = function () {
	return (this._enclosingType != null ? this._enclosingType.toString() + "." + this._token.getValue$() : this._token.getValue$());
};

/**
 * class ParserState extends Object
 * @constructor
 */
function ParserState() {
}

/**
 * @constructor
 * @param {!number} lineNumber
 * @param {!number} columnNumber
 * @param {DocComment} docComment
 * @param {!number} tokenLength
 * @param {!number} numErrors
 * @param {!number} numClosures
 * @param {!number} numObjectTypesUsed
 * @param {!number} numTemplateInstantiationRequests
 */
function ParserState$NNLDocComment$NNNNN(lineNumber, columnNumber, docComment, tokenLength, numErrors, numClosures, numObjectTypesUsed, numTemplateInstantiationRequests) {
	this.lineNumber = lineNumber;
	this.columnOffset = columnNumber;
	this.docComment = docComment;
	this.tokenLength = tokenLength;
	this.numErrors = numErrors;
	this.numClosures = numClosures;
	this.numObjectTypesUsed = numObjectTypesUsed;
	this.numTemplateInstantiationRequests = numTemplateInstantiationRequests;
};

ParserState$NNLDocComment$NNNNN.prototype = new ParserState;

/**
 * class ClassState extends Object
 * @constructor
 */
function ClassState() {
}

/**
 * @constructor
 * @param {ClassState} outer
 * @param {ParsedObjectType} classType
 * @param {Array.<undefined|Token>} typeArgs
 * @param {ParsedObjectType} extendType
 * @param {Array.<undefined|ParsedObjectType>} implementTypes
 * @param {Array.<undefined|ParsedObjectType>} objectTypesUsed
 * @param {!number} classFlags
 * @param {Array.<undefined|ClassDefinition>} inners
 * @param {Array.<undefined|TemplateClassDefinition>} templateInners
 */
function ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$(outer, classType, typeArgs, extendType, implementTypes, objectTypesUsed, classFlags, inners, templateInners) {
	this.outer = outer;
	this.classType = classType;
	this.typeArgs = typeArgs;
	this.extendType = extendType;
	this.implementTypes = implementTypes;
	this.objectTypesUsed = objectTypesUsed;
	this.classFlags = classFlags;
	this.inners = inners;
	this.templateInners = templateInners;
};

ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$.prototype = new ClassState;

/**
 * class Scope extends Object
 * @constructor
 */
function Scope() {
}

/**
 * @constructor
 * @param {Scope} prev
 * @param {Array.<undefined|LocalVariable>} locals
 * @param {LocalVariable} funcName
 * @param {Array.<undefined|ArgumentDeclaration>} args
 * @param {Array.<undefined|Statement>} statements
 * @param {Array.<undefined|MemberFunctionDefinition>} closures
 */
function Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$(prev, locals, funcName, args, statements, closures) {
	this.prev = prev;
	this.locals = locals;
	this.funcName = funcName;
	this.arguments = args;
	this.statements = statements;
	this.closures = closures;
};

Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$.prototype = new Scope;

/**
 * class Parser extends Object
 * @constructor
 */
function Parser() {
}

/**
 * @constructor
 * @param {Token} sourceToken
 * @param {!string} filename
 * @param {CompletionRequest} completionRequest
 */
function Parser$LToken$SLCompletionRequest$(sourceToken, filename, completionRequest) {
	this._input = "";
	this._lines = null;
	this._tokenLength = 0;
	this._lineNumber = 0;
	this._columnOffset = 0;
	this._fileLevelDocComment = null;
	this._docComment = null;
	this._errors = null;
	this._templateClassDefs = null;
	this._classDefs = null;
	this._imports = null;
	this._locals = null;
	this._statements = null;
	this._closures = null;
	this._outerClass = null;
	this._classType = null;
	this._extendType = null;
	this._implementTypes = null;
	this._objectTypesUsed = null;
	this._inners = null;
	this._templateInners = null;
	this._templateInstantiationRequests = null;
	this._prevScope = null;
	this._funcName = null;
	this._arguments = null;
	this._classFlags = 0;
	this._typeArgs = null;
	this._sourceToken = sourceToken;
	this._filename = filename;
	this._completionRequest = completionRequest;
};

Parser$LToken$SLCompletionRequest$.prototype = new Parser;

/**
 * @param {!string} input
 * @param {Array.<undefined|CompileError>} errors
 * @return {!boolean}
 */
Parser.prototype.parse$SALCompileError$ = function (input, errors) {
	/** @type {!number} */
	var compLineNumber;
	/** @type {undefined|!string} */
	var line;
	/** @type {Token} */
	var importToken;
	this._input = input;
	this._lines = this._input.split(_Lexer.rxNewline);
	this._tokenLength = 0;
	this._lineNumber = 1;
	this._columnOffset = 0;
	this._fileLevelDocComment = null;
	this._docComment = null;
	if (this._completionRequest != null) {
		compLineNumber = Math.min(this._completionRequest.getLineNumber$(), this._lines.length + 1);
		line = this._lines[compLineNumber - 1] || '';
		this._lines[compLineNumber - 1] = line.substring(0, this._completionRequest.getColumnOffset$()) + "Q," + line.substring(this._completionRequest.getColumnOffset$());
	}
	this._errors = errors;
	this._templateClassDefs = [];
	this._classDefs = [];
	this._imports = [];
	this._locals = null;
	this._statements = null;
	this._closures = [];
	this._classType = null;
	this._extendType = null;
	this._implementTypes = null;
	this._objectTypesUsed = [];
	this._inners = [];
	this._templateInners = [];
	this._templateInstantiationRequests = [];
	while (! this._isEOF$()) {
		importToken = this._expectOpt$S("import");
		if (importToken == null) {
			break;
		}
		this._importStatement$LToken$(importToken);
	}
	while (! this._isEOF$()) {
		if (this._classDefinition$() == null) {
			return false;
		}
	}
	if (this._errors.length !== 0) {
		return false;
	}
	return true;
};

/**
 * @return {!string}
 */
Parser.prototype._getInput$ = function () {
	return this._lines[this._lineNumber - 1].substring(this._columnOffset);
};

/**
 * @param {!number} length
 * @return {!string}
 */
Parser.prototype._getInputByLength$N = function (length) {
	return this._lines[this._lineNumber - 1].substring(this._columnOffset, this._columnOffset + length);
};

/**
 * @param {!number} len
 */
Parser.prototype._forwardPos$N = function (len) {
	this._columnOffset += len;
};

/**
 * @return {Token}
 */
Parser.prototype.getSourceToken$ = function () {
	return this._sourceToken;
};

/**
 * @return {!string}
 */
Parser.prototype.getPath$ = function () {
	return this._filename;
};

/**
 * @return {DocComment}
 */
Parser.prototype.getDocComment$ = function () {
	return this._fileLevelDocComment;
};

/**
 * @return {Array.<undefined|ClassDefinition>}
 */
Parser.prototype.getClassDefs$ = function () {
	return this._classDefs;
};

/**
 * @return {Array.<undefined|TemplateClassDefinition>}
 */
Parser.prototype.getTemplateClassDefs$ = function () {
	return this._templateClassDefs;
};

/**
 * @return {Array.<undefined|TemplateInstantiationRequest>}
 */
Parser.prototype.getTemplateInstantiationRequests$ = function () {
	return this._templateInstantiationRequests;
};

/**
 * @return {Array.<undefined|Import>}
 */
Parser.prototype.getImports$ = function () {
	return this._imports;
};

/**
 * @param {Array.<undefined|Parser>} parsers
 */
Parser.prototype.registerBuiltinImports$ALParser$ = function (parsers) {
	/** @type {!number} */
	var i;
	for (i = parsers.length - 1; i >= 0; -- i) {
		this._imports.unshift(new Import$LParser$(parsers[i]));
	}
};

/**
 * @param {!string} name
 * @return {Import}
 */
Parser.prototype.lookupImportAlias$S = function (name) {
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var alias;
	for (i = 0; i < this._imports.length; ++ i) {
		alias = this._imports[i].getAlias$();
		if (alias != null && alias == name) {
			return this._imports[i];
		}
	}
	return null;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} contextToken
 * @param {!string} className
 * @return {ClassDefinition}
 */
Parser.prototype.lookup$ALCompileError$LToken$S = function (errors, contextToken, className) {
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Array.<undefined|ClassDefinition>} */
	var found;
	for (i = 0; i < this._classDefs.length; ++ i) {
		classDef = this._classDefs[i];
		if (classDef.className$() === className) {
			return classDef;
		}
	}
	found = [];
	for (i = 0; i < this._imports.length; ++ i) {
		if (this._imports[i].getAlias$() == null) {
			found = found.concat(this._imports[i].getClasses$S(className));
		}
	}
	if (found.length === 1) {
		return found[0];
	}
	if (found.length >= 2) {
		errors.push(new CompileError$LToken$S(contextToken, "multiple candidates exist for class name '" + className + "'"));
	}
	return null;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @param {*} postInstantiationCallback
 * @return {ClassDefinition}
 */
Parser.prototype.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	/** @type {*} */
	var instantiateCallback;
	/** @type {Array.<undefined|*>} */
	var candidateCallbacks;
	/** @type {!number} */
	var i;
	instantiateCallback = this.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback);
	if (instantiateCallback != null) {
		return instantiateCallback(errors, request, postInstantiationCallback);
	}
	candidateCallbacks = [];
	for (i = 0; i < this._imports.length; ++ i) {
		candidateCallbacks = candidateCallbacks.concat(this._imports[i].createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback));
	}
	if (candidateCallbacks.length === 0) {
		errors.push(new CompileError$LToken$S(request.getToken$(), "could not find definition for template class: '" + request.getClassName$() + "'"));
		return null;
	} else {
		if (candidateCallbacks.length >= 2) {
			errors.push(new CompileError$LToken$S(request.getToken$(), "multiple candidates exist for template class name '" + request.getClassName$() + "'"));
			return null;
		}
	}
	return candidateCallbacks[0](null, null, null);
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @param {*} postInstantiationCallback
 * @return {*}
 */
Parser.prototype.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {TemplateClassDefinition} */
	var templateDef;
	for (i = 0; i < this._classDefs.length; ++ i) {
		classDef = this._classDefs[i];
		if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === request.getClassName$() && Util$typesAreEqual$ALType$ALType$(classDef.getTypeArguments$(), request.getTypeArguments$())) {
			return (function (_, __, ___) {
				return classDef;
			});
		}
	}
	for (i = 0; i < this._templateClassDefs.length; ++ i) {
		templateDef = this._templateClassDefs[i];
		if (templateDef.className$() === request.getClassName$()) {
			return (function (_, __, ___) {
				/** @type {InstantiatedClassDefinition} */
				var classDef;
				classDef = templateDef.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$(errors, request);
				if (classDef == null) {
					return null;
				}
				$this._classDefs.push(classDef);
				classDef.setParser$LParser$($this);
				classDef.resolveTypes$LAnalysisContext$(new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, $this, null));
				postInstantiationCallback($this, classDef);
				return classDef;
			});
		}
	}
	return null;
};

/**
 */
Parser.prototype._pushClassState$ = function () {
	this._outerClass = new ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$(this._outerClass, this._classType, this._typeArgs, this._extendType, this._implementTypes, this._objectTypesUsed, this._classFlags, this._inners, this._templateInners);
};

/**
 */
Parser.prototype._popClassState$ = function () {
	this._classType = this._outerClass.classType;
	this._typeArgs = this._outerClass.typeArgs;
	this._extendType = this._outerClass.extendType;
	this._implementTypes = this._outerClass.implementTypes;
	this._objectTypesUsed = this._outerClass.objectTypesUsed;
	this._classFlags = this._outerClass.classFlags;
	this._inners = this._outerClass.inners;
	this._templateInners = this._outerClass.templateInners;
	this._outerClass = this._outerClass.outer;
};

/**
 * @param {LocalVariable} funcName
 * @param {Array.<undefined|ArgumentDeclaration>} args
 */
Parser.prototype._pushScope$LLocalVariable$ALArgumentDeclaration$ = function (funcName, args) {
	this._prevScope = new Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$(this._prevScope, this._locals, this._funcName, this._arguments, this._statements, this._closures);
	this._locals = [];
	this._funcName = funcName;
	this._arguments = args;
	this._statements = [];
	this._closures = [];
};

/**
 */
Parser.prototype._popScope$ = function () {
	this._locals = this._prevScope.locals;
	this._funcName = this._prevScope.funcName;
	this._arguments = this._prevScope.arguments;
	this._statements = this._prevScope.statements;
	this._closures = this._prevScope.closures;
	this._prevScope = this._prevScope.prev;
};

/**
 * @param {Token} identifierToken
 * @param {Type} type
 * @return {LocalVariable}
 */
Parser.prototype._registerLocal$LToken$LType$ = function (identifierToken, type) {
	var $this = this;
	/** @type {*} */
	var isEqualTo;
	/** @type {!number} */
	var i;
	/** @type {LocalVariable} */
	var newLocal;
	function isEqualTo(local) {
		if (local.getName$().getValue$() === identifierToken.getValue$()) {
			if (type != null && ! local.getType$().equals$LType$(type)) {
				$this._newError$S("conflicting types for variable " + identifierToken.getValue$());
			}
			return true;
		}
		return false;
	};
	if (this._arguments == null) {
		this._newError$S(Util$format$SAS("cannot declare variable %1 outside of a function", [ identifierToken.getValue$() ]));
		return null;
	}
	if (this._funcName != null) {
		if (isEqualTo(this._funcName)) {
			return this._funcName;
		}
	}
	for (i = 0; i < this._arguments.length; ++ i) {
		if (isEqualTo(this._arguments[i])) {
			return this._arguments[i];
		}
	}
	for (i = 0; i < this._locals.length; i++) {
		if (isEqualTo(this._locals[i])) {
			return this._locals[i];
		}
	}
	newLocal = new LocalVariable$LToken$LType$(identifierToken, type);
	this._locals.push(newLocal);
	return newLocal;
};

/**
 * @return {ParserState}
 */
Parser.prototype._preserveState$ = function () {
	return new ParserState$NNLDocComment$NNNNN(this._lineNumber, this._columnOffset, this._docComment, this._tokenLength, this._errors.length, this._closures.length, this._objectTypesUsed.length, this._templateInstantiationRequests.length);
};

/**
 * @param {ParserState} state
 */
Parser.prototype._restoreState$LParserState$ = function (state) {
	this._lineNumber = state.lineNumber;
	this._columnOffset = state.columnOffset;
	this._docComment = state.docComment;
	this._tokenLength = state.tokenLength;
	this._errors.length = state.numErrors;
	this._closures.splice(state.numClosures, this._closures.length - state.numClosures);
	this._objectTypesUsed.splice(state.numObjectTypesUsed, this._objectTypesUsed.length - state.numObjectTypesUsed);
	this._templateInstantiationRequests.splice(state.numTemplateInstantiationRequests, this._templateInstantiationRequests.length - state.numTemplateInstantiationRequests);
};

/**
 * @return {!number}
 */
Parser.prototype._getColumn$ = function () {
	return this._columnOffset;
};

/**
 * @param {!string} message
 */
Parser.prototype._newError$S = function (message) {
	this._errors.push(new CompileError$SNNS(this._filename, this._lineNumber, this._getColumn$(), message));
};

/**
 * @param {!string} message
 */
Parser.prototype._newDeprecatedWarning$S = function (message) {
	this._errors.push(new DeprecatedWarning$SNNS(this._filename, this._lineNumber, this._getColumn$(), message));
};

/**
 */
Parser.prototype._advanceToken$ = function () {
	/** @type {Array.<undefined|!string>} */
	var matched;
	/** @type {DocComment} */
	var fileLevelDocComment;
	if (this._tokenLength !== 0) {
		this._forwardPos$N(this._tokenLength);
		this._tokenLength = 0;
		this._docComment = null;
	}
	while (true) {
		while (true) {
			matched = this._getInput$().match(/^[ \t]+/);
			if (matched != null) {
				this._forwardPos$N(matched[0].length);
			}
			if (this._columnOffset !== this._lines[this._lineNumber - 1].length) {
				break;
			}
			if (this._lineNumber === this._lines.length) {
				break;
			}
			this._lineNumber++;
			this._columnOffset = 0;
		}
		switch (this._getInputByLength$N(2)) {
		case "/*":
			if (this._getInputByLength$N(4) === "/***") {
				this._forwardPos$N(3);
				fileLevelDocComment = this._parseDocComment$();
				if (fileLevelDocComment == null) {
					return;
				}
				if (this._fileLevelDocComment == null) {
					this._fileLevelDocComment = fileLevelDocComment;
				}
			} else {
				if (this._getInputByLength$N(3) === "/**") {
					this._forwardPos$N(2);
					if ((this._docComment = this._parseDocComment$()) == null) {
						return;
					}
				} else {
					this._forwardPos$N(2);
					this._docComment = null;
					if (! this._skipMultilineComment$()) {
						return;
					}
				}
			}
			break;
		case "//":
			this._docComment = null;
			if (this._lineNumber === this._lines.length) {
				this._columnOffset = this._lines[this._lineNumber - 1].length;
			} else {
				this._lineNumber++;
				this._columnOffset = 0;
			}
			break;
		default:
			return;
		}
	}
};

/**
 * @return {!boolean}
 */
Parser.prototype._skipMultilineComment$ = function () {
	/** @type {!number} */
	var startLineNumber;
	/** @type {!number} */
	var startColumnOffset;
	/** @type {!number} */
	var endAt;
	startLineNumber = this._lineNumber;
	startColumnOffset = this._columnOffset;
	while (true) {
		endAt = this._getInput$().indexOf("*/");
		if (endAt !== - 1) {
			this._forwardPos$N(endAt + 2);
			return true;
		}
		if (this._lineNumber === this._lines.length) {
			this._columnOffset = this._lines[this._lineNumber - 1].length;
			this._errors.push(new CompileError$SNNS(this._filename, startLineNumber, startColumnOffset, "could not find the end of the comment"));
			return false;
		}
		++ this._lineNumber;
		this._columnOffset = 0;
	}
	return false;
};

/**
 * @return {DocComment}
 */
Parser.prototype._parseDocComment$ = function () {
	/** @type {DocComment} */
	var docComment;
	/** @type {DocCommentNode} */
	var node;
	/** @type {Array.<undefined|!string>} */
	var tagMatch;
	/** @type {undefined|!string} */
	var tag;
	/** @type {Array.<undefined|!string>} */
	var nameMatch;
	/** @type {Token} */
	var token;
	/** @type {!number} */
	var endAt;
	docComment = new DocComment$();
	node = docComment;
	while (true) {
		this._parseDocCommentAdvanceWhiteSpace$();
		if (this._getInputByLength$N(2) === "*/") {
			this._forwardPos$N(2);
			return docComment;
		} else {
			if (this._getInputByLength$N(1) === "*") {
				this._forwardPos$N(1);
				this._parseDocCommentAdvanceWhiteSpace$();
			}
		}
		tagMatch = this._getInput$().match(/^\@([0-9A-Za-z_]+)[ \t]*/);
		if (tagMatch != null) {
			this._forwardPos$N(tagMatch[0].length);
			tag = tagMatch[1];
			switch (tag) {
			case "param":
				nameMatch = this._getInput$().match(/[0-9A-Za-z_]+/);
				if (nameMatch != null) {
					token = new Token$SBUSNN(nameMatch[0], false, this._filename, this._lineNumber, this._getColumn$());
					this._forwardPos$N(nameMatch[0].length);
					node = new DocCommentParameter$LToken$(token);
					docComment.getParams$().push(node);
				} else {
					this._newError$S("name of the parameter not found after @param");
					node = null;
				}
				break;
			default:
				node = new DocCommentTag$S(tag);
				docComment.getTags$().push(node);
				break;
			}
		}
		endAt = this._getInput$().indexOf("*/");
		if (endAt !== - 1) {
			if (node != null) {
				node.appendDescription$S(this._getInput$().substring(0, endAt));
			}
			this._forwardPos$N(endAt + 2);
			return docComment;
		}
		if (node != null) {
			node.appendDescription$S(this._getInput$());
		}
		if (this._lineNumber === this._lines.length) {
			this._columnOffset = this._lines[this._lineNumber - 1].length;
			this._newError$S("could not find the end of the doccomment");
			return null;
		}
		++ this._lineNumber;
		this._columnOffset = 0;
	}
	return null;
};

/**
 */
Parser.prototype._parseDocCommentAdvanceWhiteSpace$ = function () {
	/** @type {!string} */
	var ch;
	while (true) {
		ch = this._getInputByLength$N(1);
		if (ch === " " || ch === "\t") {
			this._forwardPos$N(1);
		} else {
			break;
		}
	}
};

/**
 * @return {!boolean}
 */
Parser.prototype._isEOF$ = function () {
	this._advanceToken$();
	return this._lineNumber === this._lines.length && this._columnOffset === this._lines[this._lines.length - 1].length;
};

/**
 * @return {!boolean}
 */
Parser.prototype._expectIsNotEOF$ = function () {
	if (this._isEOF$()) {
		this._newError$S("unexpected EOF");
		return false;
	}
	return true;
};

/**
 * @param {!string} expected
 * @return {Token}
 */
Parser.prototype._expectOpt$S = function (expected) {
	return this._expectOpt$ASLRegExp$([ expected ], null);
};

/**
 * @param {Array.<undefined|!string>} expected
 * @return {Token}
 */
Parser.prototype._expectOpt$AS = function (expected) {
	return this._expectOpt$ASLRegExp$(expected, null);
};

/**
 * @param {!string} expected
 * @param {RegExp} excludePattern
 * @return {Token}
 */
Parser.prototype._expectOpt$SLRegExp$ = function (expected, excludePattern) {
	return this._expectOpt$ASLRegExp$([ expected ], excludePattern);
};

/**
 * @param {Array.<undefined|!string>} expected
 * @param {RegExp} excludePattern
 * @return {Token}
 */
Parser.prototype._expectOpt$ASLRegExp$ = function (expected, excludePattern) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var offset;
	this._advanceToken$();
	for (i = 0; i < expected.length; ++ i) {
		if (this._completionRequest != null) {
			offset = this._completionRequest.isInRange$NNN(this._lineNumber, this._columnOffset, expected[i].length);
			if (offset !== - 1) {
				this._completionRequest.pushCandidates$LCompletionCandidates$(new KeywordCompletionCandidate$S(expected[i]).setPrefix$S(this._getInputByLength$N(offset)));
			}
		}
		if (this._getInputByLength$N(expected[i].length) == expected[i]) {
			if (expected[i].match(_Lexer.rxIdent) != null && this._getInput$().match(_Lexer.rxIdent)[0].length !== expected[i].length) {
			} else {
				if (excludePattern != null && this._getInput$().match(excludePattern) != null) {
				} else {
					this._tokenLength = expected[i].length;
					return new Token$SBUSNN(expected[i], false, this._filename, this._lineNumber, this._getColumn$());
				}
			}
		}
	}
	return null;
};

/**
 * @param {!string} expected
 * @return {Token}
 */
Parser.prototype._expect$S = function (expected) {
	return this._expect$ASLRegExp$([ expected ], null);
};

/**
 * @param {Array.<undefined|!string>} expected
 * @return {Token}
 */
Parser.prototype._expect$AS = function (expected) {
	return this._expect$ASLRegExp$(expected, null);
};

/**
 * @param {!string} expected
 * @param {RegExp} excludePattern
 * @return {Token}
 */
Parser.prototype._expect$SLRegExp$ = function (expected, excludePattern) {
	return this._expect$ASLRegExp$([ expected ], excludePattern);
};

/**
 * @param {Array.<undefined|!string>} expected
 * @param {RegExp} excludePattern
 * @return {Token}
 */
Parser.prototype._expect$ASLRegExp$ = function (expected, excludePattern) {
	/** @type {Token} */
	var token;
	token = this._expectOpt$ASLRegExp$(expected, excludePattern);
	if (token == null) {
		this._newError$S("expected keyword: " + expected.join(" "));
		return null;
	}
	return token;
};

/**
 * @return {Token}
 */
Parser.prototype._expectIdentifierOpt$ = function () {
	return this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
};

/**
 * @param {*} completionCb
 * @return {Token}
 */
Parser.prototype._expectIdentifierOpt$F$LParser$LCompletionCandidates$$ = function (completionCb) {
	/** @type {Array.<undefined|!string>} */
	var matched;
	/** @type {!number} */
	var offset;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxIdent);
	if (completionCb != null && this._completionRequest != null) {
		offset = this._completionRequest.isInRange$NNN(this._lineNumber, this._columnOffset, matched != null ? matched[0].length : 0);
		if (offset !== - 1) {
			this._completionRequest.pushCandidates$LCompletionCandidates$(completionCb(this).setPrefix$S(matched[0].substring(0, offset)));
		}
	}
	if (matched == null) {
		return null;
	}
	if ($__jsx_ObjectHasOwnProperty.call(_Lexer.keywords, matched[0])) {
		this._newError$S("expected an identifier but found a keyword");
		return null;
	}
	if ($__jsx_ObjectHasOwnProperty.call(_Lexer.reserved, matched[0])) {
		this._newError$S("expected an identifier but found a reserved word");
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$SBUSNN(matched[0], true, this._filename, this._lineNumber, this._getColumn$());
};

/**
 * @return {Token}
 */
Parser.prototype._expectIdentifier$ = function () {
	return this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
};

/**
 * @param {*} completionCb
 * @return {Token}
 */
Parser.prototype._expectIdentifier$F$LParser$LCompletionCandidates$$ = function (completionCb) {
	/** @type {Token} */
	var token;
	token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(completionCb);
	if (token != null) {
		return token;
	}
	this._newError$S("expected an identifier");
	return null;
};

/**
 * @return {Token}
 */
Parser.prototype._expectStringLiteralOpt$ = function () {
	/** @type {Array.<undefined|!string>} */
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxStringLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$SBUSNN(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};

/**
 * @return {Token}
 */
Parser.prototype._expectStringLiteral$ = function () {
	/** @type {Token} */
	var token;
	token = this._expectStringLiteralOpt$();
	if (token != null) {
		return token;
	}
	this._newError$S("expected a string literal");
	return null;
};

/**
 * @return {Token}
 */
Parser.prototype._expectNumberLiteralOpt$ = function () {
	/** @type {Array.<undefined|!string>} */
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxIntegerLiteral);
	if (matched == null) {
		matched = this._getInput$().match(_Lexer.rxNumberLiteral);
	}
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$SBUSNN(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};

/**
 * @return {Token}
 */
Parser.prototype._expectRegExpLiteralOpt$ = function () {
	/** @type {Array.<undefined|!string>} */
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxRegExpLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$SBUSNN(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};

/**
 */
Parser.prototype._skipStatement$ = function () {
	/** @type {!boolean} */
	var advanced;
	advanced = false;
	while (! this._isEOF$()) {
		switch (this._getInputByLength$N(1)) {
		case ";":
			this._tokenLength = 1;
			this._advanceToken$();
			return;
		case "{":
			if (! advanced) {
				this._tokenLength = 1;
				this._advanceToken$();
			}
			return;
		case "}":
			return;
		}
		this._tokenLength = 1;
		this._advanceToken$();
		advanced = true;
	}
};

/**
 * @param {Token} importToken
 * @return {!boolean}
 */
Parser.prototype._importStatement$LToken$ = function (importToken) {
	/** @type {Array.<undefined|Token>} */
	var classes;
	/** @type {Token} */
	var token;
	/** @type {Token} */
	var filenameToken;
	/** @type {Token} */
	var alias;
	/** @type {!boolean} */
	var success;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	/** @type {Import} */
	var imprt;
	classes = null;
	token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (token != null) {
		classes = [ token ];
		while (true) {
			if ((token = this._expect$AS([ ",", "from" ])) == null) {
				return false;
			}
			if (token.getValue$() === "from") {
				break;
			}
			if ((token = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null)) == null) {
				return false;
			}
			classes.push(token);
		}
	}
	filenameToken = this._expectStringLiteral$();
	if (filenameToken == null) {
		return false;
	}
	alias = null;
	if (this._expectOpt$S("into") != null) {
		if ((alias = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null)) == null) {
			return false;
		}
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	if (alias != null && Parser$_isReservedClassName$S(alias.getValue$())) {
		this._errors.push(new CompileError$LToken$S(alias, "cannot use name of a built-in class as an alias"));
		return false;
	}
	if (classes != null) {
		success = true;
		for (i = 0; i < this._imports.length; ++ i) {
			for (j = 0; j < classes.length; ++ j) {
				if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, classes[j])) {
					success = false;
				}
			}
		}
		if (! success) {
			return false;
		}
	} else {
		for (i = 0; i < this._imports.length; ++ i) {
			if (alias == null) {
				if (this._imports[i].getAlias$() == null && this._imports[i].getFilenameToken$().getValue$() === filenameToken.getValue$()) {
					this._errors.push(new CompileError$LToken$S(filenameToken, "cannot import the same file more than once (unless using an alias)"));
					return false;
				}
			} else {
				if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, alias)) {
					return false;
				}
			}
		}
	}
	imprt = Import$create$ALCompileError$LToken$LToken$ALToken$(this._errors, filenameToken, alias, classes);
	if (imprt == null) {
		return false;
	}
	this._imports.push(imprt);
	return true;
};

/**
 * @return {!boolean}
 */
Parser.prototype._expectClassDefOpt$ = function () {
	/** @type {ParserState} */
	var state;
	/** @type {Token} */
	var token;
	state = this._preserveState$();
	try {
		while (true) {
			token = this._expectOpt$AS([ "class", "interface", "mixin", "abstract", "final" ]);
			if (token == null) {
				return false;
			}
			if (token.getValue$() === "class" || token.getValue$() === "interface" || token.getValue$() === "mixin") {
				return true;
			}
		}
	} finally {
		this._restoreState$LParserState$(state);
	}
	return true;
};

/**
 * @return {ClassDefinition}
 */
Parser.prototype._classDefinition$ = function () {
	var $this = this;
	/** @type {DocComment} */
	var docComment;
	/** @type {Token} */
	var token;
	/** @type {!number} */
	var newFlag;
	/** @type {Token} */
	var className;
	/** @type {ParsedObjectType} */
	var implementType;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {!boolean} */
	var success;
	/** @type {MemberDefinition} */
	var member;
	/** @type {!number} */
	var i;
	/** @type {TemplateClassDefinition} */
	var templateClassDef;
	/** @type {ClassDefinition} */
	var classDef;
	this._classType = null;
	this._extendType = null;
	this._implementTypes = [];
	this._objectTypesUsed = [];
	this._inners = [];
	this._templateInners = [];
	this._classFlags = 0;
	docComment = null;
	while (true) {
		token = this._expect$AS([ "class", "interface", "mixin", "abstract", "final", "native", "__fake__" ]);
		if (token == null) {
			return null;
		}
		if (this._classFlags === 0) {
			docComment = this._docComment;
		}
		if (token.getValue$() === "class") {
			break;
		}
		if (token.getValue$() === "interface") {
			if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
				this._newError$S("interface cannot have final or native attribute set");
				return null;
			}
			this._classFlags |= ClassDefinition.IS_INTERFACE;
			break;
		}
		if (token.getValue$() === "mixin") {
			if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
				this._newError$S("mixin cannot have final or native attribute set");
				return null;
			}
			this._classFlags |= ClassDefinition.IS_MIXIN;
			break;
		}
		newFlag = 0;
		switch (token.getValue$()) {
		case "abstract":
			newFlag = ClassDefinition.IS_ABSTRACT;
			break;
		case "final":
			newFlag = ClassDefinition.IS_FINAL;
			break;
		case "native":
			newFlag = ClassDefinition.IS_NATIVE;
			break;
		case "__fake__":
			newFlag = ClassDefinition.IS_FAKE;
			break;
		default:
			throw new Error("logic flaw");
		}
		if ((this._classFlags & newFlag) !== 0) {
			this._newError$S("same attribute cannot be specified more than once");
			return null;
		}
		this._classFlags |= newFlag;
	}
	className = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (className == null) {
		return null;
	}
	if ((this._typeArgs = this._formalTypeArguments$()) == null) {
		return null;
	}
	this._classType = new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$LParsedObjectType$(className, this._outerClass != null ? this._outerClass.classType : null), this._typeArgs.map((function (token) {
		return new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$(token), []);
	})));
	this._objectTypesUsed.push(this._classType);
	if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		if (this._expectOpt$S("extends") != null) {
			this._extendType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, (function (classDef) {
				return (classDef.flags$() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_FINAL)) === 0;
			}));
		}
		if (this._extendType == null && className.getValue$() !== "Object") {
			this._extendType = new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$(new Token$SB("Object", true)), []);
			this._objectTypesUsed.push(this._extendType);
		}
	} else {
		if ((this._classFlags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
			this._newError$S("interface or mixin cannot have attributes: 'abstract', 'final', 'native");
			this._classFlags &= ~ (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE);
		}
	}
	if (this._expectOpt$S("implements") != null) {
		do {
			implementType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, (function (classDef) {
				return (classDef.flags$() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE)) !== 0;
			}));
			if (implementType != null) {
				this._implementTypes.push(implementType);
			}
		} while (this._expectOpt$S(",") != null);
	}
	if (this._expect$S("{") == null) {
		return null;
	}
	members = [];
	success = true;
	while (this._expectOpt$S("}") == null) {
		if (! this._expectIsNotEOF$()) {
			break;
		}
		if (this._expectClassDefOpt$()) {
			this._pushClassState$();
			if (this._classDefinition$() == null) {
				this._skipStatement$();
			}
			this._popClassState$();
			continue;
		}
		member = this._memberDefinition$();
		if (member != null) {
			for (i = 0; i < members.length; ++ i) {
				if (member.name$() === members[i].name$() && (member.flags$() & ClassDefinition.IS_STATIC) === (members[i].flags$() & ClassDefinition.IS_STATIC)) {
					if (member instanceof MemberFunctionDefinition && members[i] instanceof MemberFunctionDefinition) {
						if (Util$typesAreEqual$ALType$ALType$(member.getArgumentTypes$(), members[i].getArgumentTypes$())) {
							this._errors.push(new CompileError$LToken$S(member.getNameToken$(), "a " + ((member.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "static" : "member") + " function with same name and arguments is already defined"));
							success = false;
							break;
						}
					} else {
						this._errors.push(new CompileError$LToken$S(member.getNameToken$(), "a property with same name already exists; only functions may be overloaded"));
						success = false;
						break;
					}
				}
			}
			members.push(member);
		} else {
			this._skipStatement$();
		}
	}
	if ((this._classFlags & ClassDefinition.IS_NATIVE) === 0 && Parser$_isReservedClassName$S(className.getValue$())) {
		this._errors.push(new CompileError$LToken$S(className, "cannot re-define a built-in class"));
		success = false;
	} else {
		if (this._outerClass != null) {
			for (i = 0; i < this._outerClass.inners.length; ++ i) {
				if (this._outerClass.inners[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError$LToken$S(className, "a non-template inner class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (i = 0; i < this._outerClass.templateInners.length; ++ i) {
				if (this._outerClass.templateInners[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError$LToken$S(className, "a non-template inner class with the same name has been already declared"));
					success = false;
					break;
				}
			}
		} else {
			for (i = 0; i < this._imports.length; ++ i) {
				if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, className)) {
					success = false;
				}
			}
			for (i = 0; i < this._classDefs.length; ++ i) {
				if (this._classDefs[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError$LToken$S(className, "a non-template class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (i = 0; i < this._templateClassDefs.length; ++ i) {
				if (this._templateClassDefs[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError$LToken$S(className, "a template class with the name same has been already declared"));
					success = false;
					break;
				}
			}
		}
	}
	if (! success) {
		return null;
	}
	if (this._typeArgs.length !== 0) {
		templateClassDef = new TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(className, className.getValue$(), this._classFlags, this._typeArgs, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
		if (this._outerClass != null) {
			this._outerClass.templateInners.push(templateClassDef);
		} else {
			this._templateClassDefs.push(templateClassDef);
		}
		return templateClassDef;
	} else {
		classDef = new ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(className, className.getValue$(), this._classFlags, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
		if (this._outerClass != null) {
			this._outerClass.inners.push(classDef);
		} else {
			this._classDefs.push(classDef);
		}
		classDef.setParser$LParser$(this);
		return classDef;
	}
};

/**
 * @return {MemberDefinition}
 */
Parser.prototype._memberDefinition$ = function () {
	/** @type {!number} */
	var flags;
	/** @type {DocComment} */
	var docComment;
	/** @type {Token} */
	var token;
	/** @type {!number} */
	var newFlag;
	/** @type {Token} */
	var name;
	/** @type {Type} */
	var type;
	/** @type {Expression} */
	var initialValue;
	flags = 0;
	docComment = null;
	while (true) {
		token = this._expect$AS([ "function", "var", "static", "abstract", "override", "final", "const", "native", "__readonly__", "inline", "__pure__", "delete" ]);
		if (token == null) {
			return null;
		}
		if (flags === 0) {
			docComment = this._docComment;
		}
		if (token.getValue$() === "const") {
			if ((flags & ClassDefinition.IS_STATIC) === 0) {
				this._newError$S("constants must be static");
				return null;
			}
			flags |= ClassDefinition.IS_CONST;
			break;
		} else {
			if (token.getValue$() === "function" || token.getValue$() === "var") {
				break;
			}
		}
		newFlag = 0;
		switch (token.getValue$()) {
		case "static":
			if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
				this._newError$S("interfaces and mixins cannot have static members");
				return null;
			}
			newFlag = ClassDefinition.IS_STATIC;
			break;
		case "abstract":
			newFlag = ClassDefinition.IS_ABSTRACT;
			break;
		case "override":
			if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
				this._newError$S("functions of an interface cannot have 'override' attribute set");
				return null;
			}
			newFlag = ClassDefinition.IS_OVERRIDE;
			break;
		case "final":
			if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
				this._newError$S("functions of an interface cannot have 'final' attribute set");
				return null;
			}
			newFlag = ClassDefinition.IS_FINAL;
			break;
		case "native":
			newFlag = ClassDefinition.IS_NATIVE;
			break;
		case "__readonly__":
			newFlag = ClassDefinition.IS_READONLY;
			break;
		case "inline":
			newFlag = ClassDefinition.IS_INLINE;
			break;
		case "__pure__":
			newFlag = ClassDefinition.IS_PURE;
			break;
		case "delete":
			newFlag = ClassDefinition.IS_DELETE;
			break;
		default:
			throw new Error("logic flaw");
		}
		if ((flags & newFlag) !== 0) {
			this._newError$S("same attribute cannot be specified more than once");
			return null;
		}
		flags |= newFlag;
	}
	if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
		flags |= ClassDefinition.IS_ABSTRACT;
	}
	if (token.getValue$() === "function") {
		return this._functionDefinition$LToken$NLDocComment$(token, flags, docComment);
	}
	if ((flags & ~ (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST | ClassDefinition.IS_READONLY | ClassDefinition.IS_INLINE)) !== 0) {
		this._newError$S("variables may only have attributes: static, abstract, const");
		return null;
	}
	if ((flags & ClassDefinition.IS_READONLY) !== 0 && (this._classFlags & ClassDefinition.IS_NATIVE) === 0) {
		this._newError$S("only native classes may use the __readonly__ attribute");
		return null;
	}
	name = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (name == null) {
		return null;
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	initialValue = null;
	if (this._expectOpt$S("=") != null) {
		if ((flags & ClassDefinition.IS_ABSTRACT) !== 0) {
			this._newError$S("abstract variable cannot have default value");
			return null;
		}
		if ((initialValue = this._assignExpr$B(false)) == null) {
			return null;
		}
	}
	if (type == null && initialValue == null) {
		this._newError$S("variable declaration should either have type declaration or initial value");
		return null;
	}
	if (! this._expect$S(";")) {
		return null;
	}
	if (this._typeArgs.length === 0 && initialValue == null && (this._classFlags & ClassDefinition.IS_NATIVE) === 0) {
		initialValue = Expression$getDefaultValueExpressionOf$LType$(type);
	}
	return new MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$(token, name, flags, type, initialValue, docComment);
};

/**
 * @param {Token} token
 * @param {!number} flags
 * @param {DocComment} docComment
 * @return {MemberFunctionDefinition}
 */
Parser.prototype._functionDefinition$LToken$NLDocComment$ = function (token, flags, docComment) {
	var $this = this;
	/** @type {Token} */
	var name;
	/** @type {Array.<undefined|Token>} */
	var typeArgs;
	/** @type {!number} */
	var numObjectTypesUsed;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {Type} */
	var returnType;
	/** @type {*} */
	var createDefinition;
	/** @type {Token} */
	var endDeclToken;
	/** @type {Token} */
	var lastToken;
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	name = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (name == null) {
		return null;
	}
	if (name.getValue$() === "constructor") {
		if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
			this._newError$S("interface cannot have a constructor");
			return null;
		}
		if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL)) !== 0) {
			this._newError$S("constructor cannot be declared as 'abstract' or 'final'");
			return null;
		}
		flags |= ClassDefinition.IS_FINAL;
	}
	flags |= this._classFlags & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL);
	typeArgs = this._formalTypeArguments$();
	if (typeArgs == null) {
		return null;
	}
	if (typeArgs.length !== 0 && (this._classFlags & ClassDefinition.IS_NATIVE) === 0) {
		this._newError$S("only native classes may have template functions (for the time being)");
		return null;
	}
	this._typeArgs = this._typeArgs.concat(typeArgs);
	numObjectTypesUsed = this._objectTypesUsed.length;
	try {
		if (this._expect$S("(") == null) {
			return null;
		}
		args = this._functionArgumentsExpr$BB((this._classFlags & ClassDefinition.IS_NATIVE) !== 0, true);
		if (args == null) {
			return null;
		}
		returnType = null;
		if (name.getValue$() === "constructor") {
			returnType = Type.voidType;
		} else {
			if (this._expect$S(":") == null) {
				return null;
			}
			returnType = this._typeDeclaration$B(true);
			if (returnType == null) {
				return null;
			}
		}
		if ((flags & ClassDefinition.IS_DELETE) !== 0) {
			if (name.getValue$() !== "constructor" || (flags & ClassDefinition.IS_STATIC) !== 0) {
				this._newError$S("only constructors may have the \"delete\" attribute set");
				return null;
			}
			if (args.length !== 0) {
				this._newError$S("cannot \"delete\" a constructor with one or more arguments");
				return null;
			}
		}
		function createDefinition(locals, statements, closures, lastToken) {
			return (typeArgs.length !== 0 ? new TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastToken, docComment) : new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, returnType, args, locals, statements, closures, lastToken, docComment));
		};
		if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_DELETE)) !== 0) {
			if (this._expect$S(";") == null) {
				return null;
			}
			return createDefinition(null, null, null, null);
		} else {
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) !== 0) {
				endDeclToken = this._expect$AS([ ";", "{" ]);
				if (endDeclToken == null) {
					return null;
				}
				if (endDeclToken.getValue$() === ";") {
					return createDefinition(null, null, null, null);
				}
			} else {
				if (this._expect$S("{") == null) {
					return null;
				}
			}
		}
		this._funcName = null;
		this._arguments = args;
		this._locals = [];
		this._statements = [];
		this._closures = [];
		if (name.getValue$() === "constructor") {
			lastToken = this._initializeBlock$();
		} else {
			lastToken = this._block$();
		}
		funcDef = createDefinition(this._locals, this._statements, this._closures, lastToken);
		this._locals = null;
		this._statements = null;
		return funcDef;
	} finally {
		this._typeArgs.splice(this._typeArgs.length - typeArgs.length, this._typeArgs.length);
		if (typeArgs.length !== 0) {
			this._objectTypesUsed.splice(numObjectTypesUsed, this._objectTypesUsed.length - numObjectTypesUsed);
		}
	}
	return null;
};

/**
 * @return {Array.<undefined|Token>}
 */
Parser.prototype._formalTypeArguments$ = function () {
	/** @type {Array.<undefined|Token>} */
	var typeArgs;
	/** @type {Token} */
	var typeArg;
	/** @type {Token} */
	var token;
	if (this._expectOpt$S(".") == null) {
		return [];
	}
	if (this._expect$S("<") == null) {
		return null;
	}
	typeArgs = [];
	do {
		typeArg = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
		if (typeArg == null) {
			return null;
		}
		typeArgs.push(typeArg);
		token = this._expectOpt$AS([ ",", ">" ]);
		if (token == null) {
			return null;
		}
	} while (token.getValue$() === ",");
	return typeArgs;
};

/**
 * @return {Array.<undefined|Type>}
 */
Parser.prototype._actualTypeArguments$ = function () {
	/** @type {Array.<undefined|Type>} */
	var types;
	/** @type {ParserState} */
	var state;
	/** @type {Type} */
	var type;
	/** @type {Token} */
	var token;
	types = [];
	state = this._preserveState$();
	if (this._expectOpt$S(".") == null) {
		return types;
	}
	if (this._expect$S("<") == null) {
		this._restoreState$LParserState$(state);
		return types;
	}
	do {
		type = this._typeDeclaration$B(false);
		if (type == null) {
			return null;
		}
		types.push(type);
		token = this._expect$AS([ ">", "," ]);
		if (token == null) {
			return null;
		}
	} while (token.getValue$() === ",");
	return types;
};

/**
 * @param {!boolean} allowVoid
 * @return {Type}
 */
Parser.prototype._typeDeclaration$B = function (allowVoid) {
	/** @type {Token} */
	var token;
	/** @type {Type} */
	var typeDecl;
	if (this._expectOpt$S("void") != null) {
		if (! allowVoid) {
			this._newError$S("'void' cannot be used here");
			return null;
		}
		return Type.voidType;
	}
	typeDecl = this._typeDeclarationNoArrayNoVoid$();
	if (typeDecl == null) {
		return null;
	}
	while (this._expectOpt$S("[") != null) {
		if ((token = this._expect$S("]")) == null) {
			return null;
		}
		if (typeDecl instanceof NullableType) {
			this._newError$S("Nullable.<T> cannot be an array, should be: T[]");
			return null;
		}
		typeDecl = this._registerArrayTypeOf$LToken$LType$(token, typeDecl);
	}
	return typeDecl;
};

/**
 * @return {Type}
 */
Parser.prototype._typeDeclarationNoArrayNoVoid$ = function () {
	/** @type {Token} */
	var token;
	token = this._expectOpt$AS([ "MayBeUndefined", "Nullable", "variant" ]);
	if (token == null) {
		return this._primaryTypeDeclaration$();
	}
	switch (token.getValue$()) {
	case "MayBeUndefined":
		this._newDeprecatedWarning$S("use of 'MayBeUndefined' is deprecated, use 'Nullable' instead");
	case "Nullable":
		return this._nullableTypeDeclaration$();
	case "variant":
		return Type.variantType;
	default:
		throw new Error("logic flaw");
	}
};

/**
 * @return {Type}
 */
Parser.prototype._nullableTypeDeclaration$ = function () {
	/** @type {Type} */
	var baseType;
	/** @type {!number} */
	var i;
	if (this._expect$S(".") == null || this._expect$S("<") == null) {
		return null;
	}
	baseType = this._typeDeclaration$B(false);
	if (baseType == null) {
		return null;
	}
	if (this._expect$S(">") == null) {
		return null;
	}
	if (baseType.equals$LType$(Type.variantType)) {
		this._newError$S("variant cannot be declared as nullable (since it is always nullable)");
		return null;
	}
	if (baseType instanceof NullableType) {
		this._newError$S("nested Nullable.<T> is forbidden");
		return null;
	}
	if (this._typeArgs != null) {
		for (i = 0; i < this._typeArgs.length; ++ i) {
			if (baseType.equals$LType$(new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$(this._typeArgs[i]), []))) {
				return baseType.toNullableType$B(true);
			}
		}
	}
	return baseType.toNullableType$();
};

/**
 * @return {Type}
 */
Parser.prototype._primaryTypeDeclaration$ = function () {
	/** @type {Token} */
	var token;
	token = this._expectOpt$AS([ "(", "function", "boolean", "int", "number", "string" ]);
	if (token != null) {
		switch (token.getValue$()) {
		case "(":
			return this._lightFunctionTypeDeclaration$LType$(null);
		case "function":
			return this._functionTypeDeclaration$LType$(null);
		case "boolean":
			return Type.booleanType;
		case "int":
			return Type.integerType;
		case "number":
			return Type.numberType;
		case "string":
			return Type.stringType;
		default:
			throw new Error("logic flaw");
		}
	} else {
		return this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, null);
	}
};

/**
 * @param {Token} firstToken
 * @param {!boolean} allowInner
 * @param {*} autoCompleteMatchCb
 * @return {ParsedObjectType}
 */
Parser.prototype._objectTypeDeclaration$LToken$BF$LClassDefinition$B$ = function (firstToken, allowInner, autoCompleteMatchCb) {
	var $this = this;
	/** @type {Token} */
	var token;
	/** @type {Import} */
	var imprt;
	/** @type {QualifiedName} */
	var qualifiedName;
	/** @type {Array.<undefined|Type>} */
	var typeArgs;
	/** @type {ParsedObjectType} */
	var objectType;
	/** @type {ParsedObjectType} */
	var enclosingType;
	if (firstToken == null) {
		if ((token = this._expectIdentifier$F$LParser$LCompletionCandidates$$((function (self) {
			return self._getCompletionCandidatesOfTopLevel$F$LClassDefinition$B$(autoCompleteMatchCb);
		}))) == null) {
			return null;
		}
	} else {
		token = firstToken;
	}
	if (token.getValue$() === "variant") {
		this._errors.push(new CompileError$LToken$S(token, "cannot use 'variant' as a class name"));
		return null;
	} else {
		if (token.getValue$() === "Nullable" || token.getValue$() === "MayBeUndefined") {
			this._errors.push(new CompileError$LToken$S(token, "cannot use 'Nullable' (or MayBeUndefined) as a class name"));
			return null;
		}
	}
	imprt = this.lookupImportAlias$S(token.getValue$());
	if (imprt != null) {
		if (this._expect$S(".") == null) {
			return null;
		}
		token = this._expectIdentifier$F$LParser$LCompletionCandidates$$((function (self) {
			return self._getCompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$(imprt, autoCompleteMatchCb);
		}));
		if (token == null) {
			return null;
		}
	}
	if (! allowInner) {
		qualifiedName = new QualifiedName$LToken$LImport$(token, imprt);
		typeArgs = this._actualTypeArguments$();
		if (typeArgs == null) {
			return null;
		} else {
			if (typeArgs.length !== 0) {
				return this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
			} else {
				objectType = new ParsedObjectType$LQualifiedName$ALType$(qualifiedName, []);
				this._objectTypesUsed.push(objectType);
				return objectType;
			}
		}
	} else {
		enclosingType = null;
		while (true) {
			qualifiedName = (enclosingType != null ? new QualifiedName$LToken$LParsedObjectType$(token, enclosingType) : new QualifiedName$LToken$LImport$(token, imprt));
			typeArgs = this._actualTypeArguments$();
			if (typeArgs == null) {
				return null;
			} else {
				if (typeArgs.length !== 0) {
					enclosingType = this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
				} else {
					objectType = new ParsedObjectType$LQualifiedName$ALType$(qualifiedName, []);
					this._objectTypesUsed.push(objectType);
					enclosingType = objectType;
				}
			}
			if (this._expectOpt$S(".") == null) {
				break;
			}
			token = this._expectIdentifier$();
			if (token == null) {
				return null;
			}
		}
		return enclosingType;
	}
};

/**
 * @param {QualifiedName} qualifiedName
 * @param {Array.<undefined|Type>} typeArgs
 * @return {ParsedObjectType}
 */
Parser.prototype._templateTypeDeclaration$LQualifiedName$ALType$ = function (qualifiedName, typeArgs) {
	/** @type {!string} */
	var className;
	/** @type {ParsedObjectType} */
	var objectType;
	className = qualifiedName.getToken$().getValue$();
	if ((className === "Array" || className === "Map") && typeArgs[0] instanceof NullableType) {
		this._newError$S("cannot declare " + className + ".<Nullable.<T>>, should be " + className + ".<T>");
		return null;
	}
	objectType = new ParsedObjectType$LQualifiedName$ALType$(qualifiedName, typeArgs);
	this._objectTypesUsed.push(objectType);
	return objectType;
};

/**
 * @param {Type} objectType
 * @return {Type}
 */
Parser.prototype._lightFunctionTypeDeclaration$LType$ = function (objectType) {
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!boolean} */
	var isVarArg;
	/** @type {Type} */
	var argType;
	/** @type {Token} */
	var token;
	/** @type {Type} */
	var returnType;
	argTypes = [];
	if (this._expectOpt$S(")") == null) {
		do {
			isVarArg = this._expectOpt$S("...") != null;
			argType = this._typeDeclaration$B(false);
			if (argType == null) {
				return null;
			}
			if (isVarArg) {
				argTypes.push(new VariableLengthArgumentType$LType$(argType));
				if (this._expect$S(")") == null) {
					return null;
				}
				break;
			}
			argTypes.push(argType);
			token = this._expect$AS([ ")", "," ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	if (this._expect$S("->") == null) {
		return null;
	}
	returnType = this._typeDeclaration$B(true);
	if (returnType == null) {
		return null;
	}
	if (objectType != null) {
		return new MemberFunctionType$LToken$LType$LType$ALType$B(null, objectType, returnType, argTypes, true);
	} else {
		return new StaticFunctionType$LToken$LType$ALType$B(null, returnType, argTypes, true);
	}
};

/**
 * @param {Type} objectType
 * @return {Type}
 */
Parser.prototype._functionTypeDeclaration$LType$ = function (objectType) {
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!boolean} */
	var isVarArg;
	/** @type {Type} */
	var argType;
	/** @type {Token} */
	var token;
	/** @type {Type} */
	var returnType;
	this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (this._expect$S("(") == null) {
		return null;
	}
	argTypes = [];
	if (this._expectOpt$S(")") == null) {
		do {
			isVarArg = this._expectOpt$S("...") != null;
			this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
			if (this._expect$S(":") == null) {
				return null;
			}
			argType = this._typeDeclaration$B(false);
			if (argType == null) {
				return null;
			}
			if (isVarArg) {
				argTypes.push(new VariableLengthArgumentType$LType$(argType));
				if (this._expect$S(")") == null) {
					return null;
				}
				break;
			}
			argTypes.push(argType);
			token = this._expect$AS([ ")", "," ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	if (this._expect$S(":") == null) {
		return null;
	}
	returnType = this._typeDeclaration$B(true);
	if (returnType == null) {
		return null;
	}
	if (objectType != null) {
		return new MemberFunctionType$LToken$LType$LType$ALType$B(null, objectType, returnType, argTypes, true);
	} else {
		return new StaticFunctionType$LToken$LType$ALType$B(null, returnType, argTypes, true);
	}
};

/**
 * @param {Token} token
 * @param {Type} elementType
 * @return {ParsedObjectType}
 */
Parser.prototype._registerArrayTypeOf$LToken$LType$ = function (token, elementType) {
	/** @type {ParsedObjectType} */
	var arrayType;
	arrayType = new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$(new Token$SB("Array", true)), [ elementType ]);
	this._objectTypesUsed.push(arrayType);
	return arrayType;
};

/**
 * @return {Token}
 */
Parser.prototype._initializeBlock$ = function () {
	/** @type {Token} */
	var token;
	/** @type {ParserState} */
	var state;
	while ((token = this._expectOpt$S("}")) == null) {
		state = this._preserveState$();
		if (! this._constructorInvocationStatement$()) {
			this._restoreState$LParserState$(state);
			return this._block$();
		}
	}
	return token;
};

/**
 * @return {Token}
 */
Parser.prototype._block$ = function () {
	/** @type {Token} */
	var token;
	while ((token = this._expectOpt$S("}")) == null) {
		if (! this._expectIsNotEOF$()) {
			return null;
		}
		if (! this._statement$()) {
			this._skipStatement$();
		}
	}
	return token;
};

/**
 * @return {!boolean}
 */
Parser.prototype._statement$ = function () {
	/** @type {ParserState} */
	var state;
	/** @type {Token} */
	var label;
	/** @type {Token} */
	var token;
	/** @type {Expression} */
	var expr;
	state = this._preserveState$();
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (label != null && this._expectOpt$S(":") != null) {
	} else {
		this._restoreState$LParserState$(state);
		label = null;
	}
	token = this._expectOpt$AS([ "{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete", "debugger", "function", "void" ]);
	if (label != null) {
		if (! (token != null && token.getValue$().match(/^(?:do|while|for|switch)$/) != null)) {
			this._newError$S("only blocks, iteration statements, and switch statements are allowed after a label");
			return false;
		}
	}
	if (token != null) {
		switch (token.getValue$()) {
		case "{":
			return this._block$() != null;
		case "var":
			return this._variableStatement$();
		case ";":
			return true;
		case "if":
			return this._ifStatement$LToken$(token);
		case "do":
			return this._doWhileStatement$LToken$LToken$(token, label);
		case "while":
			return this._whileStatement$LToken$LToken$(token, label);
		case "for":
			return this._forStatement$LToken$LToken$(token, label);
		case "continue":
			return this._continueStatement$LToken$(token);
		case "break":
			return this._breakStatement$LToken$(token);
		case "return":
			return this._returnStatement$LToken$(token);
		case "switch":
			return this._switchStatement$LToken$LToken$(token, label);
		case "throw":
			return this._throwStatement$LToken$(token);
		case "try":
			return this._tryStatement$LToken$(token);
		case "assert":
			return this._assertStatement$LToken$(token);
		case "log":
			return this._logStatement$LToken$(token);
		case "delete":
			return this._deleteStatement$LToken$(token);
		case "debugger":
			return this._debuggerStatement$LToken$(token);
		case "function":
			return this._functionStatement$LToken$(token);
		case "void":
			break;
		default:
			throw new Error("logic flaw, got " + token.getValue$());
		}
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	this._statements.push(new ExpressionStatement$LExpression$(expr));
	if (this._expect$S(";") == null) {
		return false;
	}
	return true;
};

/**
 * @return {!boolean}
 */
Parser.prototype._constructorInvocationStatement$ = function () {
	/** @type {Token} */
	var token;
	/** @type {ParsedObjectType} */
	var classType;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|Expression>} */
	var args;
	if ((token = this._expectOpt$S("super")) != null) {
		classType = this._extendType;
	} else {
		if ((token = this._expectOpt$S("this")) != null) {
			classType = this._classType;
		} else {
			if ((classType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, null)) == null) {
				return false;
			}
			token = classType.getToken$();
			if (this._classType.equals$LType$(classType)) {
			} else {
				if (this._extendType != null && this._extendType.equals$LType$(classType)) {
				} else {
					for (i = 0; i < this._implementTypes.length; ++ i) {
						if (this._implementTypes[i].equals$LType$(classType)) {
							break;
						}
					}
					if (i === this._implementTypes.length) {
						return false;
					}
				}
			}
		}
	}
	if (this._expect$S("(") == null) {
		return false;
	}
	args = this._argsExpr$();
	if (args == null) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new ConstructorInvocationStatement$LToken$LType$ALExpression$(token, classType, args));
	return true;
};

/**
 * @return {!boolean}
 */
Parser.prototype._variableStatement$ = function () {
	/** @type {Array.<undefined|!boolean>} */
	var succeeded;
	/** @type {Expression} */
	var expr;
	succeeded = [ false ];
	expr = this._variableDeclarations$BAB(false, succeeded);
	if (! succeeded[0]) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	if (expr != null) {
		this._statements.push(new ExpressionStatement$LExpression$(expr));
	}
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._functionStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var funcExpr;
	funcExpr = this._functionExpr$LToken$B(token, true);
	if (funcExpr == null) {
		return false;
	}
	this._statements.push(new ExpressionStatement$LExpression$(funcExpr));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._ifStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var expr;
	/** @type {Array.<undefined|Statement>} */
	var onTrueStatements;
	/** @type {Array.<undefined|Statement>} */
	var onFalseStatements;
	if (this._expect$S("(") == null) {
		return false;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	if (this._expect$S(")") == null) {
		return false;
	}
	onTrueStatements = this._subStatements$();
	onFalseStatements = [];
	if (this._expectOpt$S("else") != null) {
		onFalseStatements = this._subStatements$();
	}
	this._statements.push(new IfStatement$LToken$LExpression$ALStatement$ALStatement$(token, expr, onTrueStatements, onFalseStatements));
	return true;
};

/**
 * @param {Token} token
 * @param {Token} label
 * @return {!boolean}
 */
Parser.prototype._doWhileStatement$LToken$LToken$ = function (token, label) {
	/** @type {Array.<undefined|Statement>} */
	var statements;
	/** @type {Expression} */
	var expr;
	statements = this._subStatements$();
	if (this._expect$S("while") == null) {
		return false;
	}
	if (this._expect$S("(") == null) {
		return false;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	if (this._expect$S(")") == null) {
		return false;
	}
	this._statements.push(new DoWhileStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, statements));
	return true;
};

/**
 * @param {Token} token
 * @param {Token} label
 * @return {!boolean}
 */
Parser.prototype._whileStatement$LToken$LToken$ = function (token, label) {
	/** @type {Expression} */
	var expr;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	if (this._expect$S("(") == null) {
		return false;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	if (this._expect$S(")") == null) {
		return false;
	}
	statements = this._subStatements$();
	this._statements.push(new WhileStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, statements));
	return true;
};

/**
 * @param {Token} token
 * @param {Token} label
 * @return {!boolean}
 */
Parser.prototype._forStatement$LToken$LToken$ = function (token, label) {
	/** @type {ParserState} */
	var state;
	/** @type {Expression} */
	var initExpr;
	/** @type {Array.<undefined|!boolean>} */
	var succeeded;
	/** @type {Expression} */
	var condExpr;
	/** @type {Expression} */
	var postExpr;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	state = this._preserveState$();
	switch (this._forInStatement$LToken$LToken$(token, label)) {
	case - 1:
		break;
	case 0:
		return false;
	case 1:
		return true;
	}
	this._restoreState$LParserState$(state);
	if (this._expect$S("(") == null) {
		return false;
	}
	initExpr = null;
	if (this._expectOpt$S(";") != null) {
	} else {
		if (this._expectOpt$S("var") != null) {
			succeeded = [ false ];
			initExpr = this._variableDeclarations$BAB(true, succeeded);
			if (! succeeded[0]) {
				return false;
			}
			if (this._expect$S(";") == null) {
				return false;
			}
		} else {
			if ((initExpr = this._expr$B(true)) == null) {
				return false;
			}
			if (this._expect$S(";") == null) {
				return false;
			}
		}
	}
	condExpr = null;
	if (this._expectOpt$S(";") != null) {
	} else {
		if ((condExpr = this._expr$B(false)) == null) {
			return false;
		}
		if (this._expect$S(";") == null) {
			return false;
		}
	}
	postExpr = null;
	if (this._expectOpt$S(")") != null) {
	} else {
		if ((postExpr = this._expr$B(false)) == null) {
			return false;
		}
		if (this._expect$S(")") == null) {
			return false;
		}
	}
	statements = this._subStatements$();
	this._statements.push(new ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$(token, label, initExpr, condExpr, postExpr, statements));
	return true;
};

/**
 * @param {Token} token
 * @param {Token} label
 * @return {!number}
 */
Parser.prototype._forInStatement$LToken$LToken$ = function (token, label) {
	/** @type {Expression} */
	var lhsExpr;
	/** @type {Expression} */
	var listExpr;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	if (this._expect$S("(") == null) {
		return 0;
	}
	if (this._expectOpt$S("var") != null) {
		if ((lhsExpr = this._variableDeclaration$B(true)) == null) {
			return - 1;
		}
	} else {
		if ((lhsExpr = this._lhsExpr$()) == null) {
			return - 1;
		}
	}
	if (this._expect$S("in") == null) {
		return - 1;
	}
	listExpr = this._expr$B(false);
	if (listExpr == null) {
		return 0;
	}
	if (this._expect$S(")") == null) {
		return 0;
	}
	statements = this._subStatements$();
	this._statements.push(new ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$(token, label, lhsExpr, listExpr, statements));
	return 1;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._continueStatement$LToken$ = function (token) {
	/** @type {Token} */
	var label;
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new ContinueStatement$LToken$LToken$(token, label));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._breakStatement$LToken$ = function (token) {
	/** @type {Token} */
	var label;
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new BreakStatement$LToken$LToken$(token, label));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._returnStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var expr;
	if (this._expectOpt$S(";") != null) {
		this._statements.push(new ReturnStatement$LToken$LExpression$(token, null));
		return true;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	this._statements.push(new ReturnStatement$LToken$LExpression$(token, expr));
	if (this._expect$S(";") == null) {
		return false;
	}
	return true;
};

/**
 * @param {Token} token
 * @param {Token} label
 * @return {undefined|!boolean}
 */
Parser.prototype._switchStatement$LToken$LToken$ = function (token, label) {
	/** @type {Expression} */
	var expr;
	/** @type {!boolean} */
	var foundCaseLabel;
	/** @type {!boolean} */
	var foundDefaultLabel;
	/** @type {!number} */
	var startStatementIndex;
	/** @type {Token} */
	var caseOrDefaultToken;
	/** @type {Expression} */
	var labelExpr;
	if (this._expect$S("(") == null) {
		return false;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	if (this._expect$S(")") == null || this._expect$S("{") == null) {
		return null;
	}
	foundCaseLabel = false;
	foundDefaultLabel = false;
	startStatementIndex = this._statements.length;
	while (this._expectOpt$S("}") == null) {
		if (! this._expectIsNotEOF$()) {
			return false;
		}
		if (! foundCaseLabel && ! foundDefaultLabel) {
			if ((caseOrDefaultToken = this._expect$AS([ "case", "default" ])) == null) {
				this._skipStatement$();
				continue;
			}
		} else {
			caseOrDefaultToken = this._expectOpt$AS([ "case", "default" ]);
		}
		if (caseOrDefaultToken != null) {
			if (caseOrDefaultToken.getValue$() === "case") {
				labelExpr = this._expr$();
				if (labelExpr == null) {
					this._skipStatement$();
					continue;
				}
				if (this._expect$S(":") == null) {
					this._skipStatement$();
					continue;
				}
				this._statements.push(new CaseStatement$LToken$LExpression$(caseOrDefaultToken, labelExpr));
				foundCaseLabel = true;
			} else {
				if (this._expect$S(":") == null) {
					this._skipStatement$();
					continue;
				}
				if (foundDefaultLabel) {
					this._newError$S("cannot have more than one default statement within one switch block");
					this._skipStatement$();
					continue;
				}
				this._statements.push(new DefaultStatement$LToken$(caseOrDefaultToken));
				foundDefaultLabel = true;
			}
		} else {
			if (! this._statement$()) {
				this._skipStatement$();
			}
		}
	}
	this._statements.push(new SwitchStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, this._statements.splice(startStatementIndex, this._statements.length - startStatementIndex)));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._throwStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	this._statements.push(new ThrowStatement$LToken$LExpression$(token, expr));
	return true;
};

/**
 * @param {Token} tryToken
 * @return {!boolean}
 */
Parser.prototype._tryStatement$LToken$ = function (tryToken) {
	/** @type {!number} */
	var startIndex;
	/** @type {Array.<undefined|Statement>} */
	var tryStatements;
	/** @type {Array.<undefined|CatchStatement>} */
	var catchStatements;
	/** @type {Token} */
	var catchOrFinallyToken;
	/** @type {Token} */
	var catchIdentifier;
	/** @type {Type} */
	var catchType;
	/** @type {CaughtVariable} */
	var caughtVariable;
	/** @type {Array.<undefined|Statement>} */
	var finallyStatements;
	if (this._expect$S("{") == null) {
		return false;
	}
	startIndex = this._statements.length;
	if (this._block$() == null) {
		return false;
	}
	tryStatements = this._statements.splice(startIndex, this._statements.length - startIndex);
	catchStatements = [];
	catchOrFinallyToken = this._expect$AS([ "catch", "finally" ]);
	if (catchOrFinallyToken == null) {
		return false;
	}
	for (; catchOrFinallyToken != null && catchOrFinallyToken.getValue$() === "catch"; catchOrFinallyToken = this._expectOpt$AS([ "catch", "finally" ])) {
		if (this._expect$S("(") == null || (catchIdentifier = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null)) == null || this._expect$S(":") == null || (catchType = this._typeDeclaration$B(false)) == null || this._expect$S(")") == null || this._expect$S("{") == null) {
			return false;
		}
		caughtVariable = new CaughtVariable$LToken$LType$(catchIdentifier, catchType);
		this._locals.push(caughtVariable);
		try {
			if (this._block$() == null) {
				return false;
			}
		} finally {
			this._locals.splice(this._locals.indexOf(caughtVariable), 1);
		}
		catchStatements.push(new CatchStatement$LToken$LCaughtVariable$ALStatement$(catchOrFinallyToken, caughtVariable, this._statements.splice(startIndex, this._statements.length - startIndex)));
	}
	if (catchOrFinallyToken != null) {
		if (this._expect$S("{") == null) {
			return false;
		}
		if (this._block$() == null) {
			return false;
		}
		finallyStatements = this._statements.splice(startIndex, this._statements.length - startIndex);
	} else {
		finallyStatements = [];
	}
	this._statements.push(new TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$(tryToken, tryStatements, catchStatements, finallyStatements));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._assertStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new AssertStatement$LToken$LExpression$(token, expr));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._logStatement$LToken$ = function (token) {
	/** @type {Array.<undefined|Expression>} */
	var exprs;
	/** @type {Expression} */
	var expr;
	exprs = [];
	do {
		expr = this._assignExpr$B(false);
		if (expr == null) {
			return false;
		}
		exprs.push(expr);
	} while (this._expectOpt$S(",") != null);
	if (this._expect$S(";") == null) {
		return false;
	}
	if (exprs.length === 0) {
		this._newError$S("no arguments");
		return false;
	}
	this._statements.push(new LogStatement$LToken$ALExpression$(token, exprs));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._deleteStatement$LToken$ = function (token) {
	/** @type {Expression} */
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new DeleteStatement$LToken$LExpression$(token, expr));
	return true;
};

/**
 * @param {Token} token
 * @return {!boolean}
 */
Parser.prototype._debuggerStatement$LToken$ = function (token) {
	this._statements.push(new DebuggerStatement$LToken$(token));
	return true;
};

/**
 * @return {Array.<undefined|Statement>}
 */
Parser.prototype._subStatements$ = function () {
	/** @type {!number} */
	var statementIndex;
	statementIndex = this._statements.length;
	if (! this._statement$()) {
		this._skipStatement$();
	}
	return this._statements.splice(statementIndex, this._statements.length - statementIndex);
};

/**
 * @param {!boolean} noIn
 * @param {Array.<undefined|!boolean>} isSuccess
 * @return {Expression}
 */
Parser.prototype._variableDeclarations$BAB = function (noIn, isSuccess) {
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var commaToken;
	/** @type {Expression} */
	var declExpr;
	isSuccess[0] = false;
	expr = null;
	commaToken = null;
	do {
		declExpr = this._variableDeclaration$B(noIn);
		if (declExpr == null) {
			return null;
		}
		if (! (declExpr instanceof LocalExpression)) {
			expr = (expr != null ? new CommaExpression$LToken$LExpression$LExpression$(commaToken, expr, declExpr) : declExpr);
		}
	} while ((commaToken = this._expectOpt$S(",")) != null);
	isSuccess[0] = true;
	return expr;
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._variableDeclaration$B = function (noIn) {
	/** @type {Token} */
	var identifier;
	/** @type {Type} */
	var type;
	/** @type {LocalVariable} */
	var local;
	/** @type {Expression} */
	var initialValue;
	/** @type {Token} */
	var assignToken;
	/** @type {Expression} */
	var expr;
	identifier = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (identifier == null) {
		return null;
	}
	type = null;
	if (this._expectOpt$S(":")) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	local = this._registerLocal$LToken$LType$(identifier, type);
	initialValue = null;
	if ((assignToken = this._expectOpt$S("=")) != null) {
		if ((initialValue = this._assignExpr$B(noIn)) == null) {
			return null;
		}
	}
	expr = new LocalExpression$LToken$LLocalVariable$(identifier, local);
	if (initialValue != null) {
		expr = new AssignmentExpression$LToken$LExpression$LExpression$(assignToken, expr, initialValue);
	}
	return expr;
};

/**
 * @return {Expression}
 */
Parser.prototype._expr$ = function () {
	return this._expr$B(false);
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._expr$B = function (noIn) {
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var commaToken;
	/** @type {Expression} */
	var assignExpr;
	expr = this._assignExpr$B(noIn);
	if (expr == null) {
		return null;
	}
	while ((commaToken = this._expectOpt$S(",")) != null) {
		assignExpr = this._assignExpr$B(noIn);
		if (assignExpr == null) {
			break;
		}
		expr = new CommaExpression$LToken$LExpression$LExpression$(commaToken, expr, assignExpr);
	}
	return expr;
};

/**
 * @return {Expression}
 */
Parser.prototype._assignExpr$ = function () {
	return this._assignExpr$B(false);
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._assignExpr$B = function (noIn) {
	/** @type {ParserState} */
	var state;
	/** @type {Expression} */
	var lhsExpr;
	/** @type {Token} */
	var op;
	/** @type {Expression} */
	var assignExpr;
	state = this._preserveState$();
	lhsExpr = this._lhsExpr$();
	if (lhsExpr != null) {
		op = this._expect$ASLRegExp$([ "=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=" ], /^==/);
		if (op != null) {
			assignExpr = this._assignExpr$B(noIn);
			if (assignExpr == null) {
				return null;
			}
			return new AssignmentExpression$LToken$LExpression$LExpression$(op, lhsExpr, assignExpr);
		}
	}
	this._restoreState$LParserState$(state);
	return this._condExpr$B(noIn);
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._condExpr$B = function (noIn) {
	/** @type {Expression} */
	var lorExpr;
	/** @type {Token} */
	var operatorToken;
	/** @type {Expression} */
	var ifTrueExpr;
	/** @type {Expression} */
	var ifFalseExpr;
	lorExpr = this._lorExpr$B(noIn);
	if (lorExpr == null) {
		return null;
	}
	if ((operatorToken = this._expectOpt$S("?")) == null) {
		return lorExpr;
	}
	ifTrueExpr = null;
	ifFalseExpr = null;
	if (this._expectOpt$S(":") == null) {
		ifTrueExpr = this._assignExpr$B(noIn);
		if (ifTrueExpr == null) {
			return null;
		}
		if (this._expect$S(":") == null) {
			return null;
		}
	}
	ifFalseExpr = this._assignExpr$B(noIn);
	if (ifFalseExpr == null) {
		return null;
	}
	return new ConditionalExpression$LToken$LExpression$LExpression$LExpression$(operatorToken, lorExpr, ifTrueExpr, ifFalseExpr);
};

/**
 * @param {Array.<undefined|!string>} ops
 * @param {RegExp} excludePattern
 * @param {*} parseFunc
 * @param {!boolean} noIn
 * @param {*} builderFunc
 * @return {Expression}
 */
Parser.prototype._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$ = function (ops, excludePattern, parseFunc, noIn, builderFunc) {
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var op;
	/** @type {Expression} */
	var rightExpr;
	expr = parseFunc(noIn);
	if (expr == null) {
		return null;
	}
	while (true) {
		op = this._expectOpt$ASLRegExp$(ops, excludePattern);
		if (op == null) {
			break;
		}
		rightExpr = parseFunc(false);
		if (rightExpr == null) {
			return null;
		}
		expr = builderFunc(op, expr, rightExpr);
	}
	return expr;
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._lorExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "||" ], null, (function (noIn) {
		return $this._landExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new LogicalExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._landExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "&&" ], null, (function (noIn) {
		return $this._borExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new LogicalExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._borExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "|" ], /^\|\|/, (function (noIn) {
		return $this._bxorExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._bxorExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "^" ], null, (function (noIn) {
		return $this._bandExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._bandExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "&" ], /^&&/, (function (noIn) {
		return $this._eqExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._eqExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "==", "!=" ], null, (function (noIn) {
		return $this._relExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new EqualityExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @param {!boolean} noIn
 * @return {Expression}
 */
Parser.prototype._relExpr$B = function (noIn) {
	var $this = this;
	/** @type {Array.<undefined|!string>} */
	var ops;
	ops = [ "<=", ">=", "<", ">" ];
	if (! noIn) {
		ops.push("in");
	}
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$(ops, null, (function (noIn) {
		return $this._shiftExpr$();
	}), noIn, (function (op, e1, e2) {
		if (op.getValue$() === "in") {
			return new InExpression$LToken$LExpression$LExpression$(op, e1, e2);
		} else {
			return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
		}
	}));
};

/**
 * @return {Expression}
 */
Parser.prototype._shiftExpr$ = function () {
	var $this = this;
	/** @type {Expression} */
	var expr;
	expr = this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ ">>>", "<<", ">>" ], null, (function (noIn) {
		return $this._addExpr$();
	}), false, (function (op, e1, e2) {
		return new ShiftExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
	return expr;
};

/**
 * @return {Expression}
 */
Parser.prototype._addExpr$ = function () {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "+", "-" ], /^[+-]{2}/, (function (noIn) {
		return $this._mulExpr$();
	}), false, (function (op, e1, e2) {
		if (op.getValue$() === "+") {
			return new AdditiveExpression$LToken$LExpression$LExpression$(op, e1, e2);
		} else {
			return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
		}
	}));
};

/**
 * @return {Expression}
 */
Parser.prototype._mulExpr$ = function () {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "*", "/", "%" ], null, (function (noIn) {
		return $this._unaryExpr$();
	}), false, (function (op, e1, e2) {
		return new BinaryNumberExpression$LToken$LExpression$LExpression$(op, e1, e2);
	}));
};

/**
 * @return {Expression}
 */
Parser.prototype._unaryExpr$ = function () {
	/** @type {Token} */
	var op;
	/** @type {Expression} */
	var expr;
	op = this._expectOpt$AS([ "++", "--", "+", "-", "~", "!", "typeof" ]);
	if (op == null) {
		return this._asExpr$();
	}
	expr = this._unaryExpr$();
	if (expr == null) {
		return null;
	}
	switch (op.getValue$()) {
	case "++":
	case "--":
		return new PreIncrementExpression$LToken$LExpression$(op, expr);
	case "+":
	case "-":
		return new SignExpression$LToken$LExpression$(op, expr);
	case "~":
		return new BitwiseNotExpression$LToken$LExpression$(op, expr);
	case "!":
		return new LogicalNotExpression$LToken$LExpression$(op, expr);
	case "typeof":
		return new TypeofExpression$LToken$LExpression$(op, expr);
	default:
		throw new Error("logic flaw");
	}
};

/**
 * @return {Expression}
 */
Parser.prototype._asExpr$ = function () {
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var token;
	/** @type {Token} */
	var noConvert;
	/** @type {Type} */
	var type;
	expr = this._postfixExpr$();
	if (expr == null) {
		return null;
	}
	while ((token = this._expectOpt$S("as")) != null) {
		noConvert = this._expectOpt$S("__noconvert__");
		type = this._typeDeclaration$B(false);
		if (type == null) {
			return null;
		}
		expr = (noConvert ? new AsNoConvertExpression$LToken$LExpression$LType$(token, expr, type) : new AsExpression$LToken$LExpression$LType$(token, expr, type));
	}
	return expr;
};

/**
 * @return {Expression}
 */
Parser.prototype._postfixExpr$ = function () {
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var op;
	/** @type {Type} */
	var type;
	expr = this._lhsExpr$();
	op = this._expectOpt$AS([ "++", "--", "instanceof" ]);
	if (op == null) {
		return expr;
	}
	switch (op.getValue$()) {
	case "instanceof":
		type = this._typeDeclaration$B(false);
		if (type == null) {
			return null;
		}
		return new InstanceofExpression$LToken$LExpression$LType$(op, expr, type);
	default:
		return new PostIncrementExpression$LToken$LExpression$(op, expr);
	}
};

/**
 * @return {Expression}
 */
Parser.prototype._lhsExpr$ = function () {
	var $this = this;
	/** @type {ParserState} */
	var state;
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var token;
	/** @type {Array.<undefined|Expression>} */
	var args;
	/** @type {Expression} */
	var index;
	/** @type {Token} */
	var identifier;
	/** @type {Array.<undefined|Type>} */
	var typeArgs;
	state = this._preserveState$();
	token = this._expectOpt$AS([ "new", "super", "(", "function" ]);
	if (token != null) {
		switch (token.getValue$()) {
		case "super":
			return this._superExpr$();
		case "(":
			expr = this._lambdaExpr$LToken$(token);
			if (expr == null) {
				this._restoreState$LParserState$(state);
				expr = this._primaryExpr$();
				if (expr == null) {
					return null;
				}
			}
			break;
		case "function":
			expr = this._functionExpr$LToken$B(token, false);
			break;
		case "new":
			expr = this._newExpr$LToken$(token);
			break;
		default:
			throw new Error("logic flaw");
		}
	} else {
		expr = this._primaryExpr$();
	}
	if (expr == null) {
		return null;
	}
	while ((token = this._expectOpt$AS([ "(", "[", "." ])) != null) {
		switch (token.getValue$()) {
		case "(":
			if ((args = this._argsExpr$()) == null) {
				return null;
			}
			expr = new CallExpression$LToken$LExpression$ALExpression$(token, expr, args);
			break;
		case "[":
			index = this._expr$B(false);
			if (index == null) {
				return null;
			}
			if (this._expect$S("]") == null) {
				return null;
			}
			expr = new ArrayExpression$LToken$LExpression$LExpression$(token, expr, index);
			break;
		case ".":
			identifier = this._expectIdentifier$F$LParser$LCompletionCandidates$$((function (self) {
				return self._getCompletionCandidatesOfProperty$LExpression$(expr);
			}));
			if (identifier == null) {
				return null;
			}
			typeArgs = this._actualTypeArguments$();
			if (typeArgs == null) {
				return null;
			}
			expr = new PropertyExpression$LToken$LExpression$LToken$ALType$(token, expr, identifier, typeArgs);
			break;
		}
	}
	return expr;
};

/**
 * @param {Token} newToken
 * @return {Expression}
 */
Parser.prototype._newExpr$LToken$ = function (newToken) {
	/** @type {Type} */
	var type;
	/** @type {Expression} */
	var lengthExpr;
	/** @type {Array.<undefined|Expression>} */
	var args;
	type = this._typeDeclarationNoArrayNoVoid$();
	if (type == null) {
		return null;
	}
	while (this._expectOpt$S("[") != null) {
		if (type instanceof NullableType) {
			this._newError$S("cannot instantiate an array of an Nullable type");
			return null;
		}
		type = this._registerArrayTypeOf$LToken$LType$(newToken, type);
		if (this._expectOpt$S("]") == null) {
			lengthExpr = this._assignExpr$B(false);
			if (lengthExpr == null) {
				return null;
			}
			if (this._expect$S("]") == null) {
				return null;
			}
			return new NewExpression$LToken$LType$ALExpression$(newToken, type, [ lengthExpr ]);
		}
	}
	if (! (type instanceof ParsedObjectType)) {
		this._newError$S("cannot instantiate a primitive type '" + type.toString() + "' using 'new'");
		return null;
	}
	if (this._expectOpt$S("(") != null) {
		args = this._argsExpr$();
		if (args == null) {
			return null;
		}
	} else {
		args = [];
	}
	return new NewExpression$LToken$LType$ALExpression$(newToken, type, args);
};

/**
 * @return {Expression}
 */
Parser.prototype._superExpr$ = function () {
	/** @type {Token} */
	var identifier;
	/** @type {Token} */
	var token;
	/** @type {Array.<undefined|Expression>} */
	var args;
	if (this._expect$S(".") == null) {
		return null;
	}
	identifier = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (identifier == null) {
		return null;
	}
	token = this._expect$S("(");
	if (token == null) {
		return null;
	}
	args = this._argsExpr$();
	if (args == null) {
		return null;
	}
	return new SuperExpression$LToken$LToken$ALExpression$(token, identifier, args);
};

/**
 * @param {Token} token
 * @return {Expression}
 */
Parser.prototype._lambdaExpr$LToken$ = function (token) {
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {Type} */
	var returnType;
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	args = this._functionArgumentsExpr$BB(false, false);
	if (args == null) {
		return null;
	}
	returnType = null;
	if (this._expectOpt$S(":") != null) {
		if ((returnType = this._typeDeclaration$B(true)) == null) {
			return null;
		}
	}
	if (this._expect$S("->") == null) {
		return null;
	}
	funcDef = this._lambdaBody$LToken$ALArgumentDeclaration$LType$(token, args, returnType);
	if (funcDef == null) {
		return null;
	}
	this._closures.push(funcDef);
	return new FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B(token, null, funcDef, false);
};

/**
 * @param {Token} token
 * @param {Array.<undefined|ArgumentDeclaration>} args
 * @param {Type} returnType
 * @return {MemberFunctionDefinition}
 */
Parser.prototype._lambdaBody$LToken$ALArgumentDeclaration$LType$ = function (token, args, returnType) {
	/** @type {Token} */
	var openBlock;
	/** @type {Expression} */
	var expr;
	/** @type {Token} */
	var lastToken;
	openBlock = this._expectOpt$S("{");
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(null, args);
	try {
		if (openBlock == null) {
			expr = this._expr$();
			this._statements.push(new ReturnStatement$LToken$LExpression$(token, expr));
			return new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, null, null);
		} else {
			lastToken = this._block$();
			if (lastToken == null) {
				return null;
			}
			return new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, null, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
		}
	} finally {
		this._popScope$();
	}
	return null;
};

/**
 * @param {Token} token
 * @param {!boolean} isStatement
 * @return {Expression}
 */
Parser.prototype._functionExpr$LToken$B = function (token, isStatement) {
	var $this = this;
	/** @type {Token} */
	var name;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {Type} */
	var returnType;
	/** @type {Type} */
	var type;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {LocalVariable} */
	var funcName;
	/** @type {Token} */
	var lastToken;
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	name = this._expectIdentifierOpt$();
	if (isStatement && name == null) {
		return null;
	}
	if (this._expect$S("(") == null) {
		return null;
	}
	args = this._functionArgumentsExpr$BB(false, isStatement);
	if (args == null) {
		return null;
	}
	if (isStatement) {
		if (this._expect$S(":") == null) {
			return null;
		}
		returnType = this._typeDeclaration$B(true);
		if (returnType == null) {
			return null;
		}
	} else {
		if (this._expectOpt$S(":") != null) {
			returnType = this._typeDeclaration$B(true);
			if (returnType == null) {
				return null;
			}
		} else {
			returnType = null;
		}
	}
	if (this._expect$S("{") == null) {
		return null;
	}
	type = null;
	if (returnType != null) {
		argTypes = args.map((function (arg) {
			return arg.getType$();
		}));
		type = new StaticFunctionType$LToken$LType$ALType$B(token, returnType, argTypes, false);
	}
	funcName = null;
	if (name != null) {
		if (isStatement) {
			funcName = this._registerLocal$LToken$LType$(name, type);
		} else {
			funcName = new LocalVariable$LToken$LType$(name, type);
		}
	}
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(funcName, args);
	lastToken = this._block$();
	if (lastToken == null) {
		this._popScope$();
		return null;
	}
	funcDef = new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, ClassDefinition.IS_STATIC, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
	this._popScope$();
	this._closures.push(funcDef);
	return new FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B(token, funcName, funcDef, isStatement);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
Parser.prototype._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$ = function (cb) {
	/** @type {Scope} */
	var scope;
	if (this._locals != null) {
		if (! cb(this._funcName, this._locals, this._arguments)) {
			return false;
		}
		for (scope = this._prevScope; scope != null; scope = scope.prev) {
			if (scope.locals && ! cb(scope.funcName, scope.locals, scope.arguments)) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {!string} name
 * @return {LocalVariable}
 */
Parser.prototype._findLocal$S = function (name) {
	var $this = this;
	/** @type {LocalVariable} */
	var found;
	found = null;
	this._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$((function (funcName, locals, args) {
		/** @type {!number} */
		var i;
		if (funcName != null && funcName.getName$().getValue$() === name) {
			found = funcName;
			return false;
		}
		for (i = 0; i < locals.length; ++ i) {
			if (locals[i].getName$().getValue$() === name) {
				found = locals[i];
				return false;
			}
		}
		if (args != null) {
			for (i = 0; i < args.length; ++ i) {
				if (args[i].getName$().getValue$() === name) {
					found = args[i];
					return false;
				}
			}
		}
		return true;
	}));
	return found;
};

/**
 * @return {Expression}
 */
Parser.prototype._primaryExpr$ = function () {
	var $this = this;
	/** @type {Token} */
	var token;
	/** @type {Expression} */
	var expr;
	/** @type {LocalVariable} */
	var local;
	/** @type {ParsedObjectType} */
	var parsedType;
	if ((token = this._expectOpt$AS([ "this", "undefined", "null", "false", "true", "[", "{", "(" ])) != null) {
		switch (token.getValue$()) {
		case "this":
			return new ThisExpression$LToken$LClassDefinition$(token, null);
		case "undefined":
			this._newDeprecatedWarning$S("use of 'undefined' is deprerated, use 'null' instead");
		case "null":
			return this._nullLiteral$LToken$(token);
		case "false":
			return new BooleanLiteralExpression$LToken$(token);
		case "true":
			return new BooleanLiteralExpression$LToken$(token);
		case "[":
			return this._arrayLiteral$LToken$(token);
		case "{":
			return this._hashLiteral$LToken$(token);
		case "(":
			expr = this._expr$B(false);
			if (this._expect$S(")") == null) {
				return null;
			}
			return expr;
		default:
			throw new Error("logic flaw");
		}
	} else {
		if ((token = this._expectNumberLiteralOpt$()) != null) {
			return new NumberLiteralExpression$LToken$(token);
		} else {
			if ((token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$((function (self) {
				return self._getCompletionCandidatesWithLocal$();
			}))) != null) {
				local = this._findLocal$S(token.getValue$());
				if (local != null) {
					return new LocalExpression$LToken$LLocalVariable$(token, local);
				} else {
					parsedType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(token, false, null);
					if (parsedType == null) {
						return null;
					}
					return new ClassExpression$LToken$LType$(parsedType.getToken$(), parsedType);
				}
			} else {
				if ((token = this._expectStringLiteralOpt$()) != null) {
					return new StringLiteralExpression$LToken$(token);
				} else {
					if ((token = this._expectRegExpLiteralOpt$()) != null) {
						return new RegExpLiteralExpression$LToken$(token);
					} else {
						this._newError$S("expected primary expression");
						return null;
					}
				}
			}
		}
	}
};

/**
 * @param {Token} token
 * @return {NullExpression}
 */
Parser.prototype._nullLiteral$LToken$ = function (token) {
	/** @type {Type} */
	var type;
	type = Type.nullType;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
		if (type instanceof PrimitiveType) {
			this._newError$S("type '" + type.toString() + "' is not nullable");
			return null;
		}
	}
	return new NullExpression$LToken$LType$(token, type);
};

/**
 * @param {Token} token
 * @return {ArrayLiteralExpression}
 */
Parser.prototype._arrayLiteral$LToken$ = function (token) {
	/** @type {Array.<undefined|Expression>} */
	var exprs;
	/** @type {Expression} */
	var expr;
	/** @type {Type} */
	var type;
	exprs = [];
	if (this._expectOpt$S("]") == null) {
		do {
			expr = this._assignExpr$();
			if (expr == null) {
				return null;
			}
			exprs.push(expr);
			token = this._expect$AS([ ",", "]" ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	return new ArrayLiteralExpression$LToken$ALExpression$LType$(token, exprs, type);
};

/**
 * @param {Token} token
 * @return {MapLiteralExpression}
 */
Parser.prototype._hashLiteral$LToken$ = function (token) {
	/** @type {Array.<undefined|MapLiteralElement>} */
	var elements;
	/** @type {Token} */
	var keyToken;
	/** @type {Expression} */
	var expr;
	/** @type {Type} */
	var type;
	elements = [];
	if (this._expectOpt$S("}") == null) {
		do {
			if ((keyToken = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null)) != null || (keyToken = this._expectNumberLiteralOpt$()) != null || (keyToken = this._expectStringLiteralOpt$()) != null) {
			} else {
				this._newError$S("expected identifier, number or string but got '" + token.toString() + "'");
			}
			if (this._expect$S(":") == null) {
				return null;
			}
			expr = this._assignExpr$();
			if (expr == null) {
				return null;
			}
			elements.push(new MapLiteralElement$LToken$LExpression$(keyToken, expr));
			if ((token = this._expect$AS([ ",", "}" ])) == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	return new MapLiteralExpression$LToken$ALMapLiteralElement$LType$(token, elements, type);
};

/**
 * @param {!boolean} allowVarArgs
 * @param {!boolean} isStatement
 * @return {Array.<undefined|ArgumentDeclaration>}
 */
Parser.prototype._functionArgumentsExpr$BB = function (allowVarArgs, isStatement) {
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {Token} */
	var token;
	/** @type {!boolean} */
	var isVarArg;
	/** @type {Token} */
	var argName;
	/** @type {Type} */
	var argType;
	/** @type {!number} */
	var i;
	args = [];
	if (this._expectOpt$S(")") == null) {
		token = null;
		do {
			isVarArg = allowVarArgs && this._expectOpt$S("...") != null;
			argName = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
			if (argName == null) {
				return null;
			}
			argType = null;
			if (isStatement) {
				if (this._expect$S(":") == null) {
					this._newError$S("type declarations are mandatory for non-expression function definition");
					return null;
				}
				if ((argType = this._typeDeclaration$B(false)) == null) {
					return null;
				}
			} else {
				if (this._expectOpt$S(":") != null) {
					if ((argType = this._typeDeclaration$B(false)) == null) {
						return null;
					}
				}
			}
			for (i = 0; i < args.length; ++ i) {
				if (args[i].getName$().getValue$() === argName.getValue$()) {
					this._errors.push(new CompileError$LToken$S(argName, "cannot declare an argument with the same name twice"));
					return null;
				}
			}
			if (isVarArg) {
				if (argType == null && isVarArg) {
					throw new Error("not yet implemented!");
				}
				args.push(new ArgumentDeclaration$LToken$LType$(argName, new VariableLengthArgumentType$LType$(argType)));
				if (this._expect$S(")") == null) {
					return null;
				}
				break;
			}
			args.push(new ArgumentDeclaration$LToken$LType$(argName, argType));
			token = this._expect$AS([ ")", "," ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	return args;
};

/**
 * @return {Array.<undefined|Expression>}
 */
Parser.prototype._argsExpr$ = function () {
	/** @type {Array.<undefined|Expression>} */
	var args;
	/** @type {Token} */
	var token;
	/** @type {Expression} */
	var arg;
	args = [];
	if (this._expectOpt$S(")") == null) {
		token = null;
		do {
			arg = this._assignExpr$B(false);
			if (arg == null) {
				return null;
			}
			args.push(arg);
			token = this._expect$AS([ ")", "," ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	return args;
};

/**
 * @param {*} autoCompleteMatchCb
 * @return {CompletionCandidatesOfTopLevel}
 */
Parser.prototype._getCompletionCandidatesOfTopLevel$F$LClassDefinition$B$ = function (autoCompleteMatchCb) {
	return new CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$(this, autoCompleteMatchCb);
};

/**
 * @return {_CompletionCandidatesWithLocal}
 */
Parser.prototype._getCompletionCandidatesWithLocal$ = function () {
	return new _CompletionCandidatesWithLocal$LParser$(this);
};

/**
 * @param {Import} imprt
 * @param {*} autoCompleteMatchCb
 * @return {_CompletionCandidatesOfNamespace}
 */
Parser.prototype._getCompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$ = function (imprt, autoCompleteMatchCb) {
	return new _CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$(imprt, autoCompleteMatchCb);
};

/**
 * @param {Expression} expr
 * @return {_CompletionCandidatesOfProperty}
 */
Parser.prototype._getCompletionCandidatesOfProperty$LExpression$ = function (expr) {
	return new _CompletionCandidatesOfProperty$LExpression$(expr);
};

/**
 * @param {!string} name
 * @return {!boolean}
 */
Parser._isReservedClassName$S = function (name) {
	return name.match(/^(Array|Boolean|Date|Function|Map|Number|Object|RegExp|String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError|JSX)$/) != null;
};

var Parser$_isReservedClassName$S = Parser._isReservedClassName$S;

/**
 * class OptimizerStash extends Object
 * @constructor
 */
function OptimizerStash() {
}

/**
 * @constructor
 */
function OptimizerStash$() {
};

OptimizerStash$.prototype = new OptimizerStash;

/**
 * class _JSEmitterStash extends OptimizerStash
 * @constructor
 */
function _JSEmitterStash() {
}

_JSEmitterStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _JSEmitterStash$() {
	OptimizerStash$.call(this);
	this.shouldBooleanize = false;
	this.returnsBoolean = false;
};

_JSEmitterStash$.prototype = new _JSEmitterStash;

/**
 * @return {_JSEmitterStash}
 */
_JSEmitterStash.prototype.clone$ = function () {
	throw new Error("logic flaw");
};

/**
 * class Stashable
 * @constructor
 */
function Stashable() {
}

Stashable.prototype.$__jsx_implements_Stashable = true;

/**
 * @constructor
 */
function Stashable$() {
	this._optimizerStash = {};
};

Stashable$.prototype = new Stashable;

/**
 * @return {Object.<string, undefined|OptimizerStash>}
 */
Stashable.prototype.getOptimizerStash$ = function () {
	return this._optimizerStash;
};

/**
 * class MemberDefinition extends Object
 * @constructor
 */
function MemberDefinition() {
}

$__jsx_merge_interface(MemberDefinition, Stashable);

/**
 * @constructor
 * @param {Token} token
 * @param {Token} nameToken
 * @param {!number} flags
 * @param {DocComment} docComment
 */
function MemberDefinition$LToken$LToken$NLDocComment$(token, nameToken, flags, docComment) {
	Stashable$.call(this);
	this._token = token;
	this._nameToken = nameToken;
	this._flags = flags;
	this._docComment = docComment;
	this._classDef = null;
};

MemberDefinition$LToken$LToken$NLDocComment$.prototype = new MemberDefinition;

/**
 * @return {Token}
 */
MemberDefinition.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Token}
 */
MemberDefinition.prototype.getNameToken$ = function () {
	return this._nameToken;
};

/**
 * @return {!string}
 */
MemberDefinition.prototype.name$ = function () {
	return this._nameToken.getValue$();
};

/**
 * @return {!number}
 */
MemberDefinition.prototype.flags$ = function () {
	return this._flags;
};

/**
 * @param {!number} flags
 */
MemberDefinition.prototype.setFlags$N = function (flags) {
	this._flags = flags;
};

/**
 * @return {DocComment}
 */
MemberDefinition.prototype.getDocComment$ = function () {
	return this._docComment;
};

/**
 * @param {DocComment} docComment
 */
MemberDefinition.prototype.setDocComment$LDocComment$ = function (docComment) {
	this._docComment = docComment;
};

/**
 * @return {ClassDefinition}
 */
MemberDefinition.prototype.getClassDef$ = function () {
	return this._classDef;
};

/**
 * @param {ClassDefinition} classDef
 */
MemberDefinition.prototype.setClassDef$LClassDefinition$ = function (classDef) {
	this._classDef = classDef;
};

/**
 * class MemberFunctionDefinition extends MemberDefinition
 * @constructor
 */
function MemberFunctionDefinition() {
}

MemberFunctionDefinition.prototype = new MemberDefinition;
$__jsx_merge_interface(MemberFunctionDefinition, Block);

/**
 * @constructor
 * @param {Token} token
 * @param {Token} name
 * @param {!number} flags
 * @param {Type} returnType
 * @param {Array.<undefined|ArgumentDeclaration>} args
 * @param {Array.<undefined|LocalVariable>} locals
 * @param {Array.<undefined|Statement>} statements
 * @param {Array.<undefined|MemberFunctionDefinition>} closures
 * @param {Token} lastTokenOfBody
 * @param {DocComment} docComment
 */
function MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	/** @type {!number} */
	var i;
	MemberDefinition$LToken$LToken$NLDocComment$.call(this, token, name, flags, docComment);
	Block$.call(this);
	this._returnType = returnType;
	this._args = args;
	this._locals = locals;
	this._statements = statements;
	this._closures = closures;
	this._lastTokenOfBody = lastTokenOfBody;
	this._parent = null;
	this._classDef = null;
	if (this._closures != null) {
		for (i = 0; i < this._closures.length; ++ i) {
			this._closures[i].setParent$LMemberFunctionDefinition$(this);
		}
	}
};

MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$.prototype = new MemberFunctionDefinition;

/**
 * @return {!boolean}
 */
MemberFunctionDefinition.prototype.isAnonymous$ = function () {
	return this._nameToken == null;
};

/**
 * @return {!string}
 */
MemberFunctionDefinition.prototype.getNotation$ = function () {
	var $this = this;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {!string} */
	var s;
	classDef = this.getClassDef$();
	s = (classDef != null ? classDef.className$() : "<<unknown>>");
	s += ((this.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "." : "#");
	s += (this.getNameToken$() != null ? this.name$() : "$" + (this.getToken$().getLineNumber$() + "") + "_" + (this.getToken$().getColumnNumber$() + ""));
	s += "(";
	s += this._args.map((function (arg) {
		return ":" + arg.getType$().toString();
	})).join(",");
	s += ")";
	return s;
};

/**
 * @return {!string}
 */
MemberFunctionDefinition.prototype.toString = function () {
	var $this = this;
	/** @type {!string} */
	var argsText;
	argsText = this._args.map((function (arg) {
		return arg.getName$().getValue$() + " : " + arg.getType$().toString();
	})).join(", ");
	return "function " + this.name$() + "(" + argsText + ") : " + this._returnType.toString();
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {MemberFunctionDefinition}
 */
MemberFunctionDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	return this._instantiateCore$LInstantiationContext$F$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$LMemberFunctionDefinition$$(instantiationContext, (function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		return new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}));
};

/**
 * @param {InstantiationContext} instantiationContext
 * @param {*} constructCallback
 * @return {MemberFunctionDefinition}
 */
MemberFunctionDefinition.prototype._instantiateCore$LInstantiationContext$F$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$LMemberFunctionDefinition$$ = function (instantiationContext, constructCallback) {
	var $this = this;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {Array.<undefined|CaughtVariable>} */
	var caughtVariables;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	/** @type {Array.<undefined|MemberFunctionDefinition>} */
	var closures;
	/** @type {Type} */
	var returnType;
	args = [];
	for (i = 0; i < this._args.length; ++ i) {
		args[i] = this._args[i].instantiateAndPush$LInstantiationContext$(instantiationContext);
	}
	if (this._statements != null) {
		locals = [];
		for (i = 0; i < this._locals.length; ++ i) {
			locals[i] = this._locals[i].instantiateAndPush$LInstantiationContext$(instantiationContext);
		}
		caughtVariables = [];
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			if (statement instanceof CatchStatement) {
				caughtVariables.push(statement.getLocal$().instantiateAndPush$LInstantiationContext$(instantiationContext));
			}
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}), this._statements);
		statements = [];
		for (i = 0; i < this._statements.length; ++ i) {
			if (this._statements[i] instanceof ConstructorInvocationStatement) {
				statements[i] = this._statements[i].instantiate$LInstantiationContext$(instantiationContext);
			} else {
				statements[i] = this._statements[i].clone$();
			}
		}
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			if (statement instanceof CatchStatement) {
				if (caughtVariables.length === 0) {
					throw new Error("logic flaw");
				}
				statement.setLocal$LCaughtVariable$(caughtVariables.shift());
			}
			statement.forEachExpression$F$LExpression$B$((function (expr) {
				return expr.instantiate$LInstantiationContext$(instantiationContext);
			}));
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
		closures = [];
		for (i = 0; i < this._closures.length; ++ i) {
			closures[i] = this._closures[i].instantiate$LInstantiationContext$(instantiationContext);
		}
		for (i = 0; i < this._locals.length; ++ i) {
			if (this._locals[i].isInstantiated) {
				throw new Error("logic flaw");
			}
			this._locals[i].popInstantiated$();
		}
		if (caughtVariables.length !== 0) {
			throw new Error("logic flaw");
		}
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			if (statement instanceof CatchStatement) {
				statement.getLocal$().popInstantiated$();
			}
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}), this._statements);
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			/** @type {*} */
			var onExpr;
			function onExpr(expr) {
				/** @type {!number} */
				var i;
				if (expr instanceof FunctionExpression) {
					for (i = 0; i < $this._closures.length; ++ i) {
						if ($this._closures[i] == expr.getFuncDef$()) {
							break;
						}
					}
					if (i === $this._closures.length) {
						throw new Error("logic flaw, cannot find the closure");
					}
					expr.setFuncDef$LMemberFunctionDefinition$(closures[i]);
				}
				return expr.forEachExpression$F$LExpression$B$(onExpr);
			};
			statement.forEachExpression$F$LExpression$B$(onExpr);
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
	} else {
		locals = null;
		statements = null;
		closures = null;
	}
	for (i = 0; i < this._args.length; ++ i) {
		this._args[i].popInstantiated$();
	}
	if (this._returnType != null) {
		returnType = this._returnType.instantiate$LInstantiationContext$(instantiationContext);
		if (returnType == null) {
			return null;
		}
	} else {
		returnType = null;
	}
	return constructCallback(this._token, this._nameToken, this._flags, returnType, args, locals, statements, closures, this._lastTokenOfBody, this._docComment);
};

/**
 * @return {*}
 */
MemberFunctionDefinition.prototype.serialize$ = function () {
	return ({ "token": Serializer$Token$E$serializeNullable$LToken$(this._token), "nameToken": Serializer$Token$E$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "returnType": Serializer$Type$E$serializeNullable$LType$(this._returnType), "args": Serializer$ArgumentDeclaration$E$serializeArray$ALArgumentDeclaration$(this._args), "locals": Serializer$LocalVariable$E$serializeArray$ALLocalVariable$(this._locals), "statements": Serializer$Statement$E$serializeArray$ALStatement$(this._statements) });
};

/**
 * @param {AnalysisContext} outerContext
 */
MemberFunctionDefinition.prototype.analyze$LAnalysisContext$ = function (outerContext) {
	var $this = this;
	/** @type {DocComment} */
	var docComment;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {AnalysisContext} */
	var context;
	/** @type {!number} */
	var i;
	docComment = this.getDocComment$();
	if (docComment) {
		args = this.getArguments$();
		docComment.getParams$().forEach((function (docParam, i) {
			for (; i < args.length; ++ i) {
				if (args[i].getName$().getValue$() === docParam.getParamName$()) {
					return;
				}
			}
			outerContext.errors.push(new CompileError$LToken$S(docParam.getToken$(), 'invalid parameter name "' + docParam.getParamName$() + '" for ' + $this.name$() + "()"));
		}));
	}
	if (this._statements == null) {
		return;
	}
	context = outerContext.clone$().setFuncDef$LMemberFunctionDefinition$(this);
	if (this._parent == null) {
		context.setBlockStack$ALBlockContext$([ new BlockContext$LLocalVariableStatuses$LBlock$(new LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$(this, null), this) ]);
	} else {
		context.setBlockStack$ALBlockContext$(outerContext.blockStack);
		context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(new LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$(this, outerContext.getTopBlock$().localVariableStatuses), this));
		if (! this.isAnonymous$()) {
			if (this._returnType != null) {
				context.getTopBlock$().localVariableStatuses._statuses[this.name$()] = LocalVariableStatuses.ISSET;
			} else {
				context.getTopBlock$().localVariableStatuses._statuses[this.name$()] = LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION;
			}
		}
	}
	try {
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				break;
			}
		}
		if (this._returnType == null) {
			this._returnType = Type.voidType;
		}
		if (! this._returnType.equals$LType$(Type.voidType) && context.getTopBlock$().localVariableStatuses != null) {
			context.errors.push(new CompileError$LToken$S(this._lastTokenOfBody, "missing return statement"));
		}
		if (this.getNameToken$() != null && this.name$() === "constructor") {
			this._fixupConstructor$LAnalysisContext$(context);
		}
	} finally {
		context.blockStack.pop();
	}
};

/**
 * @param {AnalysisContext} context
 */
MemberFunctionDefinition.prototype._fixupConstructor$LAnalysisContext$ = function (context) {
	var $this = this;
	/** @type {!boolean} */
	var success;
	/** @type {!boolean} */
	var isAlternate;
	/** @type {!number} */
	var stmtIndex;
	/** @type {!number} */
	var baseIndex;
	/** @type {ParsedObjectType} */
	var baseClassType;
	/** @type {ConstructorInvocationStatement} */
	var ctorStmt;
	/** @type {!number} */
	var normalStatementFromIndex;
	/** @type {Object.<string, undefined|!boolean>} */
	var initProperties;
	/** @type {!number} */
	var i;
	/** @type {*} */
	var onExpr;
	/** @type {!boolean} */
	var canContinue;
	/** @type {!number} */
	var insertStmtAt;
	success = true;
	isAlternate = false;
	stmtIndex = 0;
	if (stmtIndex < this._statements.length && this._statements[stmtIndex] instanceof ConstructorInvocationStatement && this._statements[stmtIndex].getConstructingClassDef$() == this._classDef) {
		isAlternate = true;
		++ stmtIndex;
	} else {
		for (baseIndex = 0; baseIndex <= this._classDef.implementTypes$().length; ++ baseIndex) {
			baseClassType = (baseIndex === 0 ? this._classDef.extendType$() : this._classDef.implementTypes$()[baseIndex - 1]);
			if (baseClassType != null) {
				if (stmtIndex < this._statements.length && this._statements[stmtIndex] instanceof ConstructorInvocationStatement && baseClassType.getClassDef$() == this._statements[stmtIndex].getConstructingClassDef$()) {
					if (baseClassType.getToken$().getValue$() === "Object") {
						this._statements.splice(stmtIndex, 1);
					} else {
						++ stmtIndex;
					}
				} else {
					if (baseClassType.getClassDef$().className$() === "Object") {
					} else {
						if (baseClassType.getClassDef$().hasDefaultConstructor$()) {
							ctorStmt = new ConstructorInvocationStatement$LToken$LType$ALExpression$(this._token, baseClassType, []);
							this._statements.splice(stmtIndex, 0, ctorStmt);
							if (! ctorStmt.analyze$LAnalysisContext$(context)) {
								throw new Error("logic flaw");
							}
							++ stmtIndex;
						} else {
							if (stmtIndex < this._statements.length) {
								context.errors.push(new CompileError$LToken$S(this._statements[stmtIndex].getToken$(), "constructor of class '" + baseClassType.toString() + "' should be called prior to the statement"));
							} else {
								context.errors.push(new CompileError$LToken$S(this._token, "super class '" + baseClassType.toString() + "' should be initialized explicitely (no default constructor)"));
							}
							success = false;
						}
					}
				}
			}
		}
	}
	for (; stmtIndex < this._statements.length; ++ stmtIndex) {
		if (! (this._statements[stmtIndex] instanceof ConstructorInvocationStatement)) {
			break;
		}
		context.errors.push(new CompileError$LToken$S(this._statements[stmtIndex].getToken$(), "constructors should be invoked in the order they are implemented"));
		success = false;
	}
	if (! success) {
		return;
	}
	if (isAlternate) {
		return;
	}
	normalStatementFromIndex = stmtIndex;
	initProperties = {};
	this._classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) === 0) {
			initProperties[member.name$()] = true;
		}
		return true;
	}));
	for (i = normalStatementFromIndex; i < this._statements.length; ++ i) {
		if (! (this._statements[i] instanceof ExpressionStatement)) {
			break;
		}
		function onExpr(expr) {
			/** @type {Expression} */
			var lhsExpr;
			if (expr instanceof AssignmentExpression && expr.getToken$().getValue$() === "=" && (lhsExpr = expr.getFirstExpr$()) instanceof PropertyExpression && lhsExpr.getExpr$() instanceof ThisExpression) {
				initProperties[lhsExpr.getIdentifierToken$().getValue$()] = false;
				return true;
			} else {
				if (expr instanceof ThisExpression || expr instanceof FunctionExpression) {
					return false;
				}
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		};
		canContinue = this._statements[i].forEachExpression$F$LExpression$B$(onExpr);
		if (! canContinue) {
			break;
		}
	}
	insertStmtAt = normalStatementFromIndex;
	this._classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		/** @type {ExpressionStatement} */
		var stmt;
		if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) === 0) {
			if (initProperties[member.name$()]) {
				stmt = new ExpressionStatement$LExpression$(new AssignmentExpression$LToken$LExpression$LExpression$(new Token$SB("=", false), new PropertyExpression$LToken$LExpression$LToken$ALType$LType$(new Token$SB(".", false), new ThisExpression$LToken$LClassDefinition$(new Token$SB("this", false), $this._classDef), member.getNameToken$(), [], member.getType$()), member.getInitialValue$()));
				$this._statements.splice(insertStmtAt++, 0, stmt);
			}
		}
		return true;
	}));
};

/**
 * @return {Type}
 */
MemberFunctionDefinition.prototype.getReturnType$ = function () {
	return this._returnType;
};

/**
 * @param {Type} type
 */
MemberFunctionDefinition.prototype.setReturnType$LType$ = function (type) {
	this._returnType = type;
};

/**
 * @return {Array.<undefined|ArgumentDeclaration>}
 */
MemberFunctionDefinition.prototype.getArguments$ = function () {
	return this._args;
};

/**
 * @return {Array.<undefined|Type>}
 */
MemberFunctionDefinition.prototype.getArgumentTypes$ = function () {
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!number} */
	var i;
	argTypes = [];
	for (i = 0; i < this._args.length; ++ i) {
		argTypes[i] = this._args[i].getType$();
	}
	return argTypes;
};

/**
 * @return {MemberFunctionDefinition}
 */
MemberFunctionDefinition.prototype.getParent$ = function () {
	return this._parent;
};

/**
 * @param {MemberFunctionDefinition} parent
 */
MemberFunctionDefinition.prototype.setParent$LMemberFunctionDefinition$ = function (parent) {
	this._parent = parent;
};

/**
 * @return {Array.<undefined|LocalVariable>}
 */
MemberFunctionDefinition.prototype.getLocals$ = function () {
	return this._locals;
};

/**
 * @return {Array.<undefined|Statement>}
 */
MemberFunctionDefinition.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {Array.<undefined|MemberFunctionDefinition>}
 */
MemberFunctionDefinition.prototype.getClosures$ = function () {
	return this._closures;
};

/**
 * @param {AnalysisContext} context
 * @param {!string} name
 * @return {LocalVariable}
 */
MemberFunctionDefinition.prototype.getLocal$LAnalysisContext$S = function (context, name) {
	/** @type {!number} */
	var i;
	/** @type {Block} */
	var block;
	/** @type {!number} */
	var j;
	/** @type {LocalVariable} */
	var local;
	/** @type {ArgumentDeclaration} */
	var arg;
	for (i = context.blockStack.length - 1; i >= 0; -- i) {
		block = context.blockStack[i].block;
		if (block instanceof MemberFunctionDefinition) {
			for (j = 0; j < block._locals.length; ++ j) {
				local = block._locals[j];
				if (local.getName$().getValue$() === name) {
					return local;
				}
			}
			for (j = 0; j < block._args.length; ++ j) {
				arg = block._args[j];
				if (arg.getName$().getValue$() === name) {
					return arg;
				}
			}
		} else {
			if (block instanceof CatchStatement) {
				local = block.getLocal$();
				if (local.getName$().getValue$() === name) {
					return local;
				}
			}
		}
	}
	return null;
};

/**
 * @return {FunctionType}
 */
MemberFunctionDefinition.prototype.getType$ = function () {
	return ((this._flags & ClassDefinition.IS_STATIC) !== 0 ? new StaticFunctionType$LToken$LType$ALType$B(this._token, this._returnType, this.getArgumentTypes$(), false) : new MemberFunctionType$LToken$LType$LType$ALType$B(this._token, new ObjectType$LClassDefinition$(this._classDef), this._returnType, this.getArgumentTypes$(), false));
};

/**
 * @param {AnalysisContext} context
 * @param {ResolvedFunctionType} type
 * @return {!boolean}
 */
MemberFunctionDefinition.prototype.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$ = function (context, type) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._args.length; ++ i) {
		if (this._args[i].getType$() == null) {
			break;
		}
	}
	if (i === this._args.length && this._returnType != null) {
		return true;
	}
	if (type.getArgumentTypes$().length !== this._args.length) {
		context.errors.push(new CompileError$LToken$S(this.getToken$(), "expected the function to have " + (type.getArgumentTypes$().length + "") + " arguments, but found " + (this._args.length + "")));
		return false;
	} else {
		if (this._args.length !== 0 && type.getArgumentTypes$()[this._args.length - 1] instanceof VariableLengthArgumentType) {
			context.errors.push(new CompileError$LToken$S(this.getToken$(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
			return false;
		}
	}
	for (i = 0; i < this._args.length; ++ i) {
		if (this._args[i].getType$() != null) {
			if (! this._args[i].getType$().equals$LType$(type.getArgumentTypes$()[i])) {
				context.errors.push(new CompileError$LToken$S(this.getToken$(), "detected type conflict for argument '" + this._args[i].getName$().getValue$() + "' (expected '" + type.getArgumentTypes$()[i].toString() + "' but found '" + this._args[i].getType$().toString() + "'"));
				return false;
			}
		} else {
			this._args[i].setTypeForced$LType$(type.getArgumentTypes$()[i]);
		}
	}
	if (this._returnType != null) {
		if (! this._returnType.equals$LType$(type.getReturnType$())) {
			context.errors.push(new CompileError$LToken$S(this.getToken$(), "detected return type conflict, expected '" + type.getReturnType$().toString() + "' but found '" + this._returnType.toString() + "'"));
			return false;
		}
	} else {
		this._returnType = type.getReturnType$();
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
MemberFunctionDefinition.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
MemberFunctionDefinition.prototype.forEachClosure$F$LMemberFunctionDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	if (this._closures != null) {
		for (i = 0; i < this._closures.length; ++ i) {
			if (! cb(this._closures[i])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * class TemplateFunctionDefinition extends MemberFunctionDefinition
 * @constructor
 */
function TemplateFunctionDefinition() {
}

TemplateFunctionDefinition.prototype = new MemberFunctionDefinition;
$__jsx_merge_interface(TemplateFunctionDefinition, TemplateDefinition);

/**
 * @constructor
 * @param {Token} token
 * @param {Token} name
 * @param {!number} flags
 * @param {Array.<undefined|Token>} typeArgs
 * @param {Type} returnType
 * @param {Array.<undefined|ArgumentDeclaration>} args
 * @param {Array.<undefined|LocalVariable>} locals
 * @param {Array.<undefined|Statement>} statements
 * @param {Array.<undefined|MemberFunctionDefinition>} closures
 * @param {Token} lastTokenOfBody
 * @param {DocComment} docComment
 */
function TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	var $this = this;
	MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	TemplateDefinition$.call(this);
	this._typeArgs = typeArgs.concat([]);
	this._instantiatedDefs = new TypedMap$Array$Type$E$MemberFunctionDefinition$E$F$ALType$ALType$B$((function (x, y) {
		/** @type {!number} */
		var i;
		for (i = 0; i < x.length; ++ i) {
			if (! x[i].equals$LType$(y[i])) {
				return false;
			}
		}
		return true;
	}));
	this._resolvedTypemap = {};
};

TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$.prototype = new TemplateFunctionDefinition;

/**
 * @return {Array.<undefined|Token>}
 */
TemplateFunctionDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {MemberFunctionDefinition}
 */
TemplateFunctionDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {TemplateFunctionDefinition} */
	var instantiated;
	/** @type {!string} */
	var k;
	instantiated = new TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(this._token, this.getNameToken$(), this.flags$(), this._typeArgs.concat([]), this._returnType, this._args.concat([]), this._locals, this._statements, this._closures, this._lastTokenOfBody, this._docComment);
	for (k in this._resolvedTypemap) {
		instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
	}
	for (k in instantiationContext.typemap) {
		instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
	}
	return instantiated;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} token
 * @param {Array.<undefined|Type>} typeArgs
 * @return {MemberFunctionDefinition}
 */
TemplateFunctionDefinition.prototype.instantiateTemplateFunction$ALCompileError$LToken$ALType$ = function (errors, token, typeArgs) {
	var $this = this;
	/** @type {MemberFunctionDefinition} */
	var instantiated;
	/** @type {InstantiationContext} */
	var instantiationContext;
	/** @type {!string} */
	var k;
	/** @type {AnalysisContext} */
	var analysisContext;
	/** @type {!number} */
	var i;
	instantiated = this._instantiatedDefs.get$ALType$(typeArgs);
	if (instantiated != null) {
		return instantiated;
	}
	instantiationContext = this.buildInstantiationContext$ALCompileError$LToken$ALToken$ALType$(errors, token, this._typeArgs, typeArgs);
	if (instantiationContext == null) {
		return null;
	}
	for (k in this._resolvedTypemap) {
		instantiationContext.typemap[k] = this._resolvedTypemap[k];
	}
	instantiated = this._instantiateCore$LInstantiationContext$F$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$LMemberFunctionDefinition$$(instantiationContext, (function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		return new InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}));
	if (instantiated == null) {
		return null;
	}
	instantiated.setClassDef$LClassDefinition$(this._classDef);
	this._classDef._members.push(instantiated);
	analysisContext = new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, this._classDef.getParser$(), (function (parser, classDef) {
		throw new Error("not implemented");
	}));
	for (i = 0; i < instantiationContext.objectTypesUsed.length; ++ i) {
		instantiationContext.objectTypesUsed[i].resolveType$LAnalysisContext$(analysisContext);
	}
	instantiated.analyze$LAnalysisContext$(analysisContext);
	this._instantiatedDefs.set$ALType$LMemberFunctionDefinition$(typeArgs.concat([]), instantiated);
	return instantiated;
};

/**
 * class InstantiatedMemberFunctionDefinition extends MemberFunctionDefinition
 * @constructor
 */
function InstantiatedMemberFunctionDefinition() {
}

InstantiatedMemberFunctionDefinition.prototype = new MemberFunctionDefinition;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} name
 * @param {!number} flags
 * @param {Type} returnType
 * @param {Array.<undefined|ArgumentDeclaration>} args
 * @param {Array.<undefined|LocalVariable>} locals
 * @param {Array.<undefined|Statement>} statements
 * @param {Array.<undefined|MemberFunctionDefinition>} closures
 * @param {Token} lastTokenOfBody
 * @param {DocComment} docComment
 */
function InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
};

InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$.prototype = new InstantiatedMemberFunctionDefinition;

/**
 * class MemberVariableDefinition extends MemberDefinition
 * @constructor
 */
function MemberVariableDefinition() {
}

MemberVariableDefinition.prototype = new MemberDefinition;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} name
 * @param {!number} flags
 * @param {Type} type
 * @param {Expression} initialValue
 * @param {DocComment} docComment
 */
function MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$(token, name, flags, type, initialValue, docComment) {
	MemberDefinition$LToken$LToken$NLDocComment$.call(this, token, name, flags, docComment);
	this._type = type;
	this._initialValue = initialValue;
	this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
	this._analysisContext = null;
};

MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$.prototype = new MemberVariableDefinition;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {MemberDefinition}
 */
MemberVariableDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	/** @type {Type} */
	var type;
	/** @type {Expression} */
	var initialValue;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	initialValue = null;
	if (this._initialValue != null) {
		initialValue = this._initialValue.clone$();
		initialValue.instantiate$LInstantiationContext$(instantiationContext);
	}
	return new MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$(this._token, this._nameToken, this._flags, type, initialValue, null);
};

/**
 * @return {!string}
 */
MemberVariableDefinition.prototype.toString = function () {
	return this.name$() + " : " + this._type.toString();
};

/**
 * @return {*}
 */
MemberVariableDefinition.prototype.serialize$ = function () {
	return ({ "token": Serializer$Token$E$serializeNullable$LToken$(this._token), "nameToken": Serializer$Token$E$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "type": Serializer$Type$E$serializeNullable$LType$(this._type), "initialValue": Serializer$Expression$E$serializeNullable$LExpression$(this._initialValue) });
};

/**
 * @param {AnalysisContext} context
 */
MemberVariableDefinition.prototype.setAnalysisContext$LAnalysisContext$ = function (context) {
	this._analysisContext = context.clone$();
};

/**
 * @return {Type}
 */
MemberVariableDefinition.prototype.getType$ = function () {
	/** @type {Type} */
	var ivType;
	switch (this._analyzeState) {
	case MemberVariableDefinition.NOT_ANALYZED:
		try {
			this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
			if (this._initialValue != null) {
				if (! this._initialValue.analyze$LAnalysisContext$LExpression$(this._analysisContext, null)) {
					return null;
				}
				ivType = this._initialValue.getType$();
				if (this._type == null) {
					if (ivType.equals$LType$(Type.nullType)) {
						this._analysisContext.errors.push(new CompileError$LToken$S(this._initialValue.getToken$(), "cannot assign null to an unknown type"));
						return null;
					}
					this._type = ivType.asAssignableType$();
				} else {
					if (! ivType.isConvertibleTo$LType$(this._type)) {
						this._analysisContext.errors.push(new CompileError$LToken$S(this._nameToken, "the variable is declared as '" + this._type.toString() + "' but initial value is '" + ivType.toString() + "'"));
					}
				}
			}
			this._analyzeState = MemberVariableDefinition.ANALYZE_SUCEEDED;
		} finally {
			if (this._analyzeState !== MemberVariableDefinition.ANALYZE_SUCEEDED) {
				this._analyzeState = MemberVariableDefinition.ANALYZE_FAILED;
			}
		}
		break;
	case MemberVariableDefinition.IS_ANALYZING:
		this._analysisContext.errors.push(new CompileError$LToken$S(this.getNameToken$(), "please declare type of variable '" + this.name$() + "' (detected recursion while trying to reduce type)"));
		break;
	default:
		break;
	}
	return this._type;
};

/**
 * @return {Expression}
 */
MemberVariableDefinition.prototype.getInitialValue$ = function () {
	return this._initialValue;
};

/**
 * @param {Expression} initialValue
 */
MemberVariableDefinition.prototype.setInitialValue$LExpression$ = function (initialValue) {
	this._initialValue = initialValue;
};

/**
 * @return {!string}
 */
MemberVariableDefinition.prototype.getNotation$ = function () {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {!string} */
	var s;
	classDef = this.getClassDef$();
	s = (classDef != null ? classDef.className$() : "<<unknown>>");
	s += ((this.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "." : "#");
	s += this.name$();
	return s;
};

/**
 * class ClassDefinition extends Object
 * @constructor
 */
function ClassDefinition() {
}

$__jsx_merge_interface(ClassDefinition, Stashable);

/**
 * @constructor
 * @param {Token} token
 * @param {!string} className
 * @param {!number} flags
 * @param {ParsedObjectType} extendType
 * @param {Array.<undefined|ParsedObjectType>} implementTypes
 * @param {Array.<undefined|MemberDefinition>} members
 * @param {Array.<undefined|ClassDefinition>} inners
 * @param {Array.<undefined|TemplateClassDefinition>} templateInners
 * @param {Array.<undefined|ParsedObjectType>} objectTypesUsed
 * @param {DocComment} docComment
 */
function ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment) {
	Stashable$.call(this);
	this._baseClassDef = null;
	this._outerClassDef = null;
	this._parser = null;
	this._token = token;
	this._className = className;
	this._outputClassName = null;
	this._flags = flags;
	this._extendType = extendType;
	this._implementTypes = implementTypes;
	this._members = members;
	this._inners = inners;
	this._templateInners = templateInners;
	this._objectTypesUsed = objectTypesUsed;
	this._docComment = docComment;
	this._resetMembersClassDef$();
};

ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$.prototype = new ClassDefinition;

/**
 * @return {*}
 */
ClassDefinition.prototype.serialize$ = function () {
	return ({ "token": this._token, "name": this._className, "flags": this._flags, "extends": Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$(this._extendType), "implements": Serializer$ParsedObjectType$E$serializeArray$ALParsedObjectType$(this._implementTypes), "members": Serializer$MemberDefinition$E$serializeArray$ALMemberDefinition$(this._members) });
};

/**
 * @param {Array.<undefined|ClassDefinition>} classDefs
 * @return {*}
 */
ClassDefinition.serialize$ALClassDefinition$ = function (classDefs) {
	/** @type {Array.<undefined|*>} */
	var s;
	/** @type {!number} */
	var i;
	s = [];
	for (i = 0; i < classDefs.length; ++ i) {
		s[i] = classDefs[i].serialize$();
	}
	return s;
};

var ClassDefinition$serialize$ALClassDefinition$ = ClassDefinition.serialize$ALClassDefinition$;

/**
 * @return {Parser}
 */
ClassDefinition.prototype.getParser$ = function () {
	return this._parser;
};

/**
 * @param {Parser} parser
 */
ClassDefinition.prototype.setParser$LParser$ = function (parser) {
	this._parser = parser;
};

/**
 * @return {Token}
 */
ClassDefinition.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {!string}
 */
ClassDefinition.prototype.className$ = function () {
	return this._className;
};

/**
 * @return {!string}
 */
ClassDefinition.prototype.classFullName$ = function () {
	return (this._outerClassDef != null ? this._outerClassDef.classFullName$() + "." + this._className : this.className$());
};

/**
 * @param {!string} name
 */
ClassDefinition.prototype.setOutputClassName$S = function (name) {
	this._outputClassName = name;
};

/**
 * @return {!string}
 */
ClassDefinition.prototype.getOutputClassName$ = function () {
	return this._outputClassName;
};

/**
 * @return {!number}
 */
ClassDefinition.prototype.flags$ = function () {
	return this._flags;
};

/**
 * @param {!number} flags
 */
ClassDefinition.prototype.setFlags$N = function (flags) {
	this._flags = flags;
};

/**
 * @return {ParsedObjectType}
 */
ClassDefinition.prototype.extendType$ = function () {
	return this._extendType;
};

/**
 * @return {Array.<undefined|ParsedObjectType>}
 */
ClassDefinition.prototype.implementTypes$ = function () {
	return this._implementTypes;
};

/**
 * @return {Array.<undefined|MemberDefinition>}
 */
ClassDefinition.prototype.members$ = function () {
	return this._members;
};

/**
 * @param {ClassDefinition} outer
 */
ClassDefinition.prototype.setOuterClassDef$LClassDefinition$ = function (outer) {
	this._outerClassDef = outer;
};

/**
 * @return {ClassDefinition}
 */
ClassDefinition.prototype.getOuterClassDef$ = function () {
	return this._outerClassDef;
};

/**
 * @return {Array.<undefined|ClassDefinition>}
 */
ClassDefinition.prototype.getInnerClasses$ = function () {
	return this._inners;
};

/**
 * @return {Array.<undefined|TemplateClassDefinition>}
 */
ClassDefinition.prototype.getTemplateInnerClasses$ = function () {
	return this._templateInners;
};

/**
 * @return {DocComment}
 */
ClassDefinition.prototype.getDocComment$ = function () {
	return this._docComment;
};

/**
 * @param {DocComment} docComment
 */
ClassDefinition.prototype.setDocComment$LDocComment$ = function (docComment) {
	this._docComment = docComment;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachClassToBase$F$LClassDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	if (! cb(this)) {
		return false;
	}
	for (i = this._implementTypes.length - 1; i >= 0; -- i) {
		if (! cb(this._implementTypes[i].getClassDef$())) {
			return false;
		}
	}
	if (this._extendType != null) {
		if (! this._extendType.getClassDef$().forEachClassToBase$F$LClassDefinition$B$(cb)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachClassFromBase$F$LClassDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	if (this._extendType != null) {
		if (! this._extendType.getClassDef$().forEachClassFromBase$F$LClassDefinition$B$(cb)) {
			return false;
		}
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		if (! cb(this._implementTypes[i].getClassDef$())) {
			return false;
		}
	}
	if (! cb(this)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachMember$F$LMemberDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (! cb(this._members[i])) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachMemberVariable$F$LMemberVariableDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i] instanceof MemberVariableDefinition) {
			if (! cb(this._members[i])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachMemberFunction$F$LMemberFunctionDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i] instanceof MemberFunctionDefinition) {
			if (! cb(this._members[i])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ClassDefinition.prototype.forEachInnerClass$F$LClassDefinition$B$ = function (cb) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._inners.length; ++ i) {
		if (! cb(this._inners[i])) {
			return false;
		}
	}
	return true;
};

/**
 */
ClassDefinition.prototype._resetMembersClassDef$ = function () {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {*} */
	var setClassDef;
	for (i = 0; i < this._members.length; ++ i) {
		this._members[i].setClassDef$LClassDefinition$(this);
		if (this._members[i] instanceof MemberFunctionDefinition) {
			function setClassDef(funcDef) {
				funcDef.setClassDef$LClassDefinition$($this);
				return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(setClassDef);
			};
			this._members[i].forEachClosure$F$LMemberFunctionDefinition$B$(setClassDef);
		}
	}
	for (i = 0; i < this._inners.length; ++ i) {
		this._inners[i].setOuterClassDef$LClassDefinition$(this);
		this._inners[i]._resetMembersClassDef$();
	}
	for (i = 0; i < this._templateInners.length; ++ i) {
		this._templateInners[i].setOuterClassDef$LClassDefinition$(this);
	}
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} token
 * @param {!string} name
 * @param {!boolean} isStatic
 * @param {Array.<undefined|Type>} typeArgs
 * @param {!number} mode
 * @return {Type}
 */
ClassDefinition.prototype.getMemberTypeByName$ALCompileError$LToken$SBALType$N = function (errors, token, name, isStatic, typeArgs, mode) {
	var $this = this;
	/** @type {Array.<undefined|Type>} */
	var types;
	/** @type {*} */
	var pushMatchingMember;
	types = [];
	function pushMatchingMember(classDef) {
		/** @type {!number} */
		var i;
		/** @type {MemberDefinition} */
		var member;
		/** @type {Type} */
		var type;
		/** @type {!number} */
		var j;
		if (mode !== ClassDefinition.GET_MEMBER_MODE_SUPER) {
			for (i = 0; i < classDef._members.length; ++ i) {
				member = classDef._members[i];
				if ((member.flags$() & ClassDefinition.IS_DELETE) !== 0) {
				} else {
					if (((member.flags$() & ClassDefinition.IS_STATIC) !== 0) === isStatic && name === member.name$()) {
						if (member instanceof MemberVariableDefinition) {
							if ((member.flags$() & ClassDefinition.IS_OVERRIDE) === 0) {
								type = member.getType$();
								if (type != null && types.length === 0) {
									types[0] = type;
								}
							}
						} else {
							if (member instanceof MemberFunctionDefinition) {
								if (member instanceof InstantiatedMemberFunctionDefinition) {
								} else {
									if (member instanceof TemplateFunctionDefinition) {
										if ((member = member.instantiateTemplateFunction$ALCompileError$LToken$ALType$(errors, token, typeArgs)) == null) {
											return;
										}
									}
									if (member.getStatements$() != null || mode !== ClassDefinition.GET_MEMBER_MODE_NOT_ABSTRACT) {
										for (j = 0; j < types.length; ++ j) {
											if (Util$typesAreEqual$ALType$ALType$(member.getArgumentTypes$(), types[j].getArgumentTypes$())) {
												break;
											}
										}
										if (j === types.length) {
											types.push(member.getType$());
										}
									}
								}
							} else {
								throw new Error("logic flaw");
							}
						}
					}
				}
			}
		} else {
			mode = ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY;
		}
		if (mode !== ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY) {
			if (classDef._extendType != null) {
				pushMatchingMember(classDef._extendType.getClassDef$());
			}
			for (i = 0; i < classDef._implementTypes.length; ++ i) {
				pushMatchingMember(classDef._implementTypes[i].getClassDef$());
			}
		}
	};
	pushMatchingMember(this);
	switch (types.length) {
	case 0:
		return null;
	case 1:
		return types[0];
	default:
		return new FunctionChoiceType$ALResolvedFunctionType$(types.map((function (t) {
			return t;
		})));
	}
};

/**
 * @param {!string} className
 * @return {ClassDefinition}
 */
ClassDefinition.prototype.lookupInnerClass$S = function (className) {
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var inner;
	for (i = 0; i < this._inners.length; ++ i) {
		inner = this._inners[i];
		if (inner.className$() === className) {
			return inner;
		}
	}
	return null;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @param {*} postInstantiationCallback
 * @return {ClassDefinition}
 */
ClassDefinition.prototype.lookupTemplateInnerClass$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	/** @type {*} */
	var instantiateCallback;
	instantiateCallback = this.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback);
	if (instantiateCallback != null) {
		return instantiateCallback(errors, request, postInstantiationCallback);
	}
	return null;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @param {*} postInstantiationCallback
 * @return {*}
 */
ClassDefinition.prototype.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {TemplateClassDefinition} */
	var templateDef;
	for (i = 0; i < this._inners.length; ++ i) {
		classDef = this._inners[i];
		if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === request.getClassName$() && Util$typesAreEqual$ALType$ALType$(classDef.getTypeArguments$(), request.getTypeArguments$())) {
			return (function (_, __, ___) {
				return classDef;
			});
		}
	}
	for (i = 0; i < this._templateInners.length; ++ i) {
		templateDef = this._templateInners[i];
		if (templateDef.className$() === request.getClassName$()) {
			return (function (_, __, ___) {
				/** @type {InstantiatedClassDefinition} */
				var classDef;
				classDef = templateDef.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$(errors, request);
				if (classDef == null) {
					return null;
				}
				$this._inners.push(classDef);
				classDef.setParser$LParser$($this._parser);
				classDef.resolveTypes$LAnalysisContext$(new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, $this._parser, null));
				postInstantiationCallback($this._parser, classDef);
				return classDef;
			});
		}
	}
	return null;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {ClassDefinition}
 */
ClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	/** @type {InstantiationContext} */
	var context;
	/** @type {!boolean} */
	var succeeded;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	/** @type {Array.<undefined|ClassDefinition>} */
	var inners;
	/** @type {ClassDefinition} */
	var inner;
	/** @type {Array.<undefined|TemplateClassDefinition>} */
	var templateInners;
	/** @type {TemplateClassDefinition} */
	var templateInner;
	context = new InstantiationContext$ALCompileError$HLType$(instantiationContext.errors, instantiationContext.typemap);
	succeeded = true;
	members = [];
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i].instantiate$LInstantiationContext$(context);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++ i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(context);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++ i) {
		templateInner = this._templateInners[i].instantiate$LInstantiationContext$(context);
		if (templateInner == null) {
			succeeded = false;
		}
		templateInners[i] = templateInner;
	}
	if (! succeeded) {
		return null;
	}
	return new ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(this._token, this._className, this._flags, this._extendType != null ? this._extendType.instantiate$LInstantiationContext$(context) : null, this._implementTypes.map((function (t) {
		return t.instantiate$LInstantiationContext$(context);
	})), members, inners, templateInners, context.objectTypesUsed, this._docComment);
};

/**
 * @param {AnalysisContext} context
 */
ClassDefinition.prototype.resolveTypes$LAnalysisContext$ = function (context) {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var baseClass;
	/** @type {!number} */
	var j;
	/** @type {!boolean} */
	var isNative;
	/** @type {MemberFunctionDefinition} */
	var func;
	for (i = 0; i < this._objectTypesUsed.length; ++ i) {
		this._objectTypesUsed[i].resolveType$LAnalysisContext$(context);
	}
	for (i = 0; i < this._inners.length; ++ i) {
		this._inners[i].resolveTypes$LAnalysisContext$(context);
	}
	if (this._extendType != null) {
		baseClass = this._extendType.getClassDef$();
		if (baseClass != null) {
			if ((baseClass.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError$LToken$S(this._extendType.getToken$(), "cannot extend a final class"));
			} else {
				if ((baseClass.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
					context.errors.push(new CompileError$LToken$S(this._extendType.getToken$(), "cannot extend an interface, use the 'implements' keyword"));
				} else {
					if ((baseClass.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
						context.errors.push(new CompileError$LToken$S(this._extendType.getToken$(), "cannot extend an mixin, use the 'implements' keyword"));
					}
				}
			}
		}
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		baseClass = this._implementTypes[i].getClassDef$();
		if (baseClass != null) {
			if ((baseClass.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError$LToken$S(this._implementTypes[i].getToken$(), "cannot implement a class (only interfaces can be implemented)"));
			} else {
				for (j = i + 1; j < this._implementTypes.length; ++ j) {
					if (this._implementTypes[j].getClassDef$() == baseClass) {
						context.errors.push(new CompileError$LToken$S(this._implementTypes[i].getToken$(), "cannot implement the same interface more than once"));
						break;
					}
				}
			}
		}
	}
	if (this.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		return funcDef.name$() !== "constructor";
	}))) {
		isNative = (this.flags$() & ClassDefinition.IS_NATIVE) !== 0;
		func = new MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$(this._token, new Token$SB("constructor", true), ClassDefinition.IS_FINAL | this.flags$() & ClassDefinition.IS_NATIVE, Type.voidType, [], isNative ? null : [], isNative ? null : [], isNative ? null : [], this._token, null);
		func.setClassDef$LClassDefinition$(this);
		this._members.push(func);
	}
	this.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		return funcDef.forEachStatement$F$LStatement$B$((function (statement) {
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				/** @type {PropertyExpression} */
				var propExpr;
				/** @type {Token} */
				var identifierToken;
				/** @type {ParsedObjectType} */
				var receiverType;
				/** @type {ClassDefinition} */
				var receiverClassDef;
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				if (expr instanceof PropertyExpression && expr.getExpr$() instanceof ClassExpression) {
					propExpr = expr;
					identifierToken = propExpr.getIdentifierToken$();
					receiverType = propExpr.getExpr$().getType$();
					receiverClassDef = receiverType.getClassDef$();
					if (receiverClassDef) {
						receiverClassDef.forEachInnerClass$F$LClassDefinition$B$((function (classDef) {
							/** @type {ParsedObjectType} */
							var objectType;
							if (classDef.className$() === identifierToken.getValue$()) {
								objectType = new ParsedObjectType$LQualifiedName$ALType$(new QualifiedName$LToken$LParsedObjectType$(identifierToken, receiverType), propExpr.getTypeArguments$());
								objectType.resolveType$LAnalysisContext$(context);
								replaceCb(new ClassExpression$LToken$LType$(propExpr.getToken$(), objectType));
								return false;
							}
							return true;
						}));
					} else {
						return true;
					}
				}
				return true;
			}));
		}));
	}));
};

/**
 * @param {AnalysisContext} context
 */
ClassDefinition.prototype.setAnalysisContextOfVariables$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member instanceof MemberVariableDefinition) {
			member.setAnalysisContext$LAnalysisContext$(context);
		}
	}
};

/**
 * @param {AnalysisContext} context
 */
ClassDefinition.prototype.analyze$LAnalysisContext$ = function (context) {
	/** @type {Token} */
	var token;
	/** @type {!string} */
	var srcPos;
	try {
		this._analyzeClassDef$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			token = this.getToken$();
			srcPos = (token != null ? Util$format$SAS(" at file %1, line %2", [ token.getFilename$(), token.getLineNumber$() + "" ]) : "");
			$__jsx_catch_0.message = Util$format$SAS("fatal error while analyzing class %1%2\n%3", [ this.className$(), srcPos, $__jsx_catch_0.message ]);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	this._analyzeMembers$LAnalysisContext$(context);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ClassDefinition.prototype._analyzeClassDef$LAnalysisContext$ = function (context) {
	var $this = this;
	/** @type {Array.<undefined|ClassDefinition>} */
	var implementClassDefs;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|ClassDefinition>} */
	var allMixins;
	/** @type {ClassDefinition} */
	var interfaceDef;
	/** @type {!number} */
	var j;
	/** @type {Array.<undefined|MemberDefinition>} */
	var overrideFunctions;
	/** @type {!boolean} */
	var done;
	/** @type {!number} */
	var k;
	/** @type {Array.<undefined|MemberDefinition>} */
	var abstractMembers;
	/** @type {!string} */
	var msg;
	this._baseClassDef = (this.extendType$() != null ? this.extendType$().getClassDef$() : null);
	implementClassDefs = this.implementTypes$().map((function (type) {
		return type.getClassDef$();
	}));
	if ((this.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		if (this._baseClassDef != null) {
			if ((this._baseClassDef.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError$LToken$S(this.getToken$(), "cannot extend final class '" + this._baseClassDef.className$() + "'"));
				return false;
			}
			if ((this._baseClassDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
				context.errors.push(new CompileError$LToken$S(this.getToken$(), "interfaces (or mixins) should be implemented, not extended"));
				return false;
			}
			if (! this._baseClassDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				if ($this == classDef) {
					context.errors.push(new CompileError$LToken$S($this.getToken$(), "class inheritance is in loop"));
					return false;
				}
				return true;
			}))) {
				return false;
			}
		}
	} else {
		for (i = 0; i < implementClassDefs.length; ++ i) {
			if ((implementClassDefs[i].flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError$LToken$S(this.getToken$(), "class '" + implementClassDefs[i].className$() + "' can only be extended, not implemented"));
				return false;
			}
			if (! implementClassDefs[i].forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				if ($this == classDef) {
					context.errors.push(new CompileError$LToken$S($this.getToken$(), "class inheritance is in loop"));
					return false;
				}
				return true;
			}))) {
				return false;
			}
		}
	}
	allMixins = [];
	if (! this.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
		if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
			if (allMixins.indexOf(classDef) !== - 1) {
				context.errors.push(new CompileError$LToken$S($this.getToken$(), "mixin '" + classDef.className$() + "' is implemented twice"));
				return false;
			}
			allMixins.push(classDef);
		}
		return true;
	}))) {
		return false;
	}
	for (i = 0; i < this._members.length; ++ i) {
		this._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$(context, this._members[i], this, this._members[i].getToken$());
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		interfaceDef = this._implementTypes[i].getClassDef$();
		for (j = 0; j < interfaceDef._members.length; ++ j) {
			this._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$(context, interfaceDef._members[j], interfaceDef, this._implementTypes[i].getToken$());
		}
	}
	if ((this._flags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		for (i = 0; i < this._members.length; ++ i) {
			if (this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags$() & ClassDefinition.IS_OVERRIDE) !== 0) {
				if (this._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$(context, this._members[i]) == null) {
					context.errors.push(new CompileError$LToken$S(this._members[i].getNameToken$(), "could not find function definition in base classes / mixins to be overridden"));
				}
			}
		}
		for (i = 0; i < this._implementTypes.length; ++ i) {
			if ((this._implementTypes[i].getClassDef$().flags$() & ClassDefinition.IS_MIXIN) === 0) {
				continue;
			}
			overrideFunctions = [];
			this._implementTypes[i].getClassDef$()._getMembers$ALMemberDefinition$BNN(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
			for (j = 0; j < overrideFunctions.length; ++ j) {
				done = false;
				if (this._baseClassDef != null) {
					if (this._baseClassDef._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, overrideFunctions[j]) != null) {
						done = true;
					}
				}
				for (k = 0; k < i; ++ k) {
					if (this._implementTypes[k].getClassDef$()._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, overrideFunctions[j]) != null) {
						done = true;
						break;
					}
				}
				if (! done) {
					context.errors.push(new CompileError$LToken$S(this.getToken$(), "could not find function definition to be overridden by '" + overrideFunctions[j].getNotation$() + "'"));
				}
			}
		}
	}
	if ((this._flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		abstractMembers = [];
		this.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			return classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				/** @type {!number} */
				var i;
				if ((member.flags$() & ClassDefinition.IS_ABSTRACT) !== 0) {
					for (i = 0; i < abstractMembers.length; ++ i) {
						if (ClassDefinition$membersAreEqual$LMemberDefinition$LMemberDefinition$(abstractMembers[i], member)) {
							break;
						}
					}
					if (i === abstractMembers.length) {
						abstractMembers[i] = member;
					}
				}
				return true;
			}));
		}));
		this.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			return classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				/** @type {!number} */
				var i;
				if (abstractMembers.length === 0) {
					return false;
				}
				if ((member.flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
					for (i = 0; i < abstractMembers.length; ++ i) {
						if (ClassDefinition$membersAreEqual$LMemberDefinition$LMemberDefinition$(abstractMembers[i], member)) {
							abstractMembers.splice(i, 1);
							break;
						}
					}
				}
				return true;
			}));
		}));
		if (abstractMembers.length !== 0) {
			msg = "class should be declared as 'abstract' since the following members do not have concrete definition: ";
			for (i = 0; i < abstractMembers.length; ++ i) {
				if (i !== 0) {
					msg += ", ";
				}
				msg += abstractMembers[i].getNotation$();
			}
			context.errors.push(new CompileError$LToken$S(this.getToken$(), msg));
		}
	}
	return false;
};

/**
 * @param {AnalysisContext} context
 */
ClassDefinition.prototype._analyzeMembers$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	/** @type {MemberVariableDefinition} */
	var varDef;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member instanceof MemberFunctionDefinition) {
			if (! (member instanceof TemplateFunctionDefinition)) {
				member.analyze$LAnalysisContext$(context);
			}
		} else {
			varDef = member;
			if (varDef.getInitialValue$() == null) {
				varDef.setInitialValue$LExpression$(Expression$getDefaultValueExpressionOf$LType$(varDef.getType$()));
			}
		}
	}
};

/**
 */
ClassDefinition.prototype.analyzeUnusedVariables$ = function () {
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member instanceof MemberVariableDefinition) {
			member.getType$();
		}
	}
};

/**
 * @param {ClassDefinition} classDef
 * @return {!boolean}
 */
ClassDefinition.prototype.isConvertibleTo$LClassDefinition$ = function (classDef) {
	/** @type {!number} */
	var i;
	if (this == classDef) {
		return true;
	}
	if (classDef.className$() === "Object") {
		return true;
	}
	if (this._extendType != null && this._extendType.getClassDef$().isConvertibleTo$LClassDefinition$(classDef)) {
		return true;
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		if (this._implementTypes[i].getClassDef$().isConvertibleTo$LClassDefinition$(classDef)) {
			return true;
		}
	}
	return false;
};

/**
 * @param {AnalysisContext} context
 * @param {MemberDefinition} member
 * @param {ClassDefinition} memberClassDef
 * @param {Token} token
 * @return {!boolean}
 */
ClassDefinition.prototype._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$ = function (context, member, memberClassDef, token) {
	/** @type {!number} */
	var numImplementsToCheck;
	/** @type {!boolean} */
	var isCheckingSibling;
	/** @type {!number} */
	var i;
	if ((member.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		return true;
	}
	for (numImplementsToCheck = 0; numImplementsToCheck < this._implementTypes.length; ++ numImplementsToCheck) {
		if (memberClassDef == this._implementTypes[numImplementsToCheck].getClassDef$()) {
			break;
		}
	}
	isCheckingSibling = numImplementsToCheck !== this._implementTypes.length;
	if (member instanceof MemberVariableDefinition) {
		if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
			return false;
		}
		for (i = 0; i < numImplementsToCheck; ++ i) {
			if (! this._implementTypes[i].getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
				return false;
			}
		}
	} else {
		if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B(context, member, memberClassDef, token, false)) {
			return false;
		}
		for (i = 0; i < numImplementsToCheck; ++ i) {
			if (memberClassDef != this._implementTypes[i].getClassDef$() && ! this._implementTypes[i].getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B(context, member, memberClassDef, token, isCheckingSibling)) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {MemberVariableDefinition} member
 * @param {ClassDefinition} memberClassDef
 * @param {Token} token
 * @return {!boolean}
 */
ClassDefinition.prototype._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$ = function (context, member, memberClassDef, token) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i].name$() === member.name$()) {
			if ((this._members[i].flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
				context.errors.push(new CompileError$LToken$S(member.getNameToken$(), Util$format$SAS("cannot define property '%1', the name is already used in class '%2'", [ member.getNotation$(), this.className$() ])));
				return false;
			}
			if (! this._members[i].getType$().equals$LType$(member.getType$())) {
				context.errors.push(new CompileError$LToken$S(member.getNameToken$(), Util$format$SAS("cannot override property '%1' of type '%2' with different type '%3'", [ member.getNotation$(), this._members[i].getType$().toString(), member.getType$().toString() ])));
				return false;
			}
		}
	}
	if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
		return false;
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		if (! this._implementTypes[i].getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {MemberFunctionDefinition} member
 * @param {ClassDefinition} memberClassDef
 * @param {Token} token
 * @param {!boolean} reportOverridesAsWell
 * @return {!boolean}
 */
ClassDefinition.prototype._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B = function (context, member, memberClassDef, token, reportOverridesAsWell) {
	/** @type {!number} */
	var i;
	if (member.name$() === "constructor") {
		return true;
	}
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i].name$() !== member.name$()) {
			continue;
		}
		if (this._members[i] instanceof MemberVariableDefinition) {
			throw new Error("logic flaw: " + member.getNotation$());
		}
		if (! Util$typesAreEqual$ALType$ALType$(this._members[i].getArgumentTypes$(), member.getArgumentTypes$())) {
			continue;
		}
		if ((member.flags$() & ClassDefinition.IS_OVERRIDE) === 0) {
			context.errors.push(new CompileError$LToken$S(member.getNameToken$(), "overriding functions must have 'override' attribute set (defined in base class '" + this.className$() + "')"));
			return false;
		}
		if (reportOverridesAsWell && (this._members[i].flags$() & ClassDefinition.IS_OVERRIDE) !== 0) {
			context.errors.push(new CompileError$LToken$S(member.getNameToken$(), "definition of the function conflicts with sibling mix-in '" + this.className$() + "'"));
			return false;
		}
		return true;
	}
	if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B(context, member, memberClassDef, token, false)) {
		return false;
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		if (! this._implementTypes[i].getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B(context, member, memberClassDef, token, false)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {MemberFunctionDefinition} overrideDef
 * @return {undefined|!boolean}
 */
ClassDefinition.prototype._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$ = function (context, overrideDef) {
	/** @type {!number} */
	var i;
	/** @type {Type} */
	var overrideReturnType;
	/** @type {Type} */
	var memberReturnType;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i].name$() === overrideDef.name$() && this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags$() & ClassDefinition.IS_STATIC) === 0 && Util$typesAreEqual$ALType$ALType$(this._members[i].getArgumentTypes$(), overrideDef.getArgumentTypes$())) {
			if ((this._members[i].flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError$LToken$S(overrideDef.getToken$(), "cannot override final function defined in class '" + this.className$() + "'"));
				return false;
			}
			overrideReturnType = overrideDef.getReturnType$();
			memberReturnType = this._members[i].getReturnType$();
			if (! (overrideReturnType.equals$LType$(memberReturnType) || overrideReturnType.isConvertibleTo$LType$(memberReturnType)) || memberReturnType instanceof NullableType && ! (overrideReturnType instanceof NullableType)) {
				context.errors.push(new CompileError$LToken$S(overrideDef.getToken$(), "return type '" + overrideReturnType.toString() + "' is not convertible to '" + memberReturnType.toString() + "'"));
				return false;
			} else {
				return true;
			}
		}
	}
	return this._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$(context, overrideDef);
};

/**
 * @param {AnalysisContext} context
 * @param {MemberFunctionDefinition} member
 * @return {undefined|!boolean}
 */
ClassDefinition.prototype._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$ = function (context, member) {
	/** @type {undefined|!boolean} */
	var ret;
	/** @type {!number} */
	var i;
	if (this._extendType != null) {
		ret = this._extendType.getClassDef$()._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, member);
		if (ret != null) {
			return ret;
		}
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		ret = this._implementTypes[i].getClassDef$()._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, member);
		if (ret != null) {
			return ret;
		}
	}
	return null;
};

/**
 * @param {Array.<undefined|MemberDefinition>} list
 * @param {!boolean} functionOnly
 * @param {!number} flagsMask
 * @param {!number} flagsMaskMatch
 */
ClassDefinition.prototype._getMembers$ALMemberDefinition$BNN = function (list, functionOnly, flagsMask, flagsMaskMatch) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	if (this._baseClassDef != null) {
		this._baseClassDef._getMembers$ALMemberDefinition$BNN(list, functionOnly, flagsMask, flagsMaskMatch);
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		this._implementTypes[i].getClassDef$()._getMembers$ALMemberDefinition$BNN(list, functionOnly, flagsMask, flagsMaskMatch);
	}
	for (i = 0; i < this._members.length; ++ i) {
		if (functionOnly && ! (this._members[i] instanceof MemberFunctionDefinition)) {
			continue;
		}
		if ((this._members[i].flags$() & flagsMask) !== flagsMaskMatch) {
			continue;
		}
		for (j = 0; j < list.length; ++ j) {
			if (list[j].name$() === this._members[i].name$()) {
				if (list[j] instanceof MemberVariableDefinition || Util$typesAreEqual$ALType$ALType$(list[j].getArgumentTypes$(), this._members[j].getArgumentTypes$())) {
					break;
				}
			}
		}
		if (j === list.length) {
			list.push(this._members[i]);
		}
	}
};

/**
 * @return {!boolean}
 */
ClassDefinition.prototype.hasDefaultConstructor$ = function () {
	/** @type {!boolean} */
	var hasCtorWithArgs;
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	hasCtorWithArgs = false;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member.name$() === "constructor" && (member.flags$() & ClassDefinition.IS_STATIC) === 0 && member instanceof MemberFunctionDefinition) {
			if (member.getArguments$().length === 0) {
				return true;
			}
			hasCtorWithArgs = true;
		}
	}
	return ! hasCtorWithArgs;
};

/**
 * @param {MemberDefinition} x
 * @param {MemberDefinition} y
 * @return {!boolean}
 */
ClassDefinition.membersAreEqual$LMemberDefinition$LMemberDefinition$ = function (x, y) {
	if (x.name$() !== y.name$()) {
		return false;
	}
	if (x instanceof MemberFunctionDefinition) {
		if (! (y instanceof MemberFunctionDefinition)) {
			return false;
		}
		if (! Util$typesAreEqual$ALType$ALType$(x.getArgumentTypes$(), y.getArgumentTypes$())) {
			return false;
		}
	} else {
		if (! (y instanceof MemberVariableDefinition)) {
			return false;
		}
	}
	return true;
};

var ClassDefinition$membersAreEqual$LMemberDefinition$LMemberDefinition$ = ClassDefinition.membersAreEqual$LMemberDefinition$LMemberDefinition$;

/**
 * class InstantiatedClassDefinition extends ClassDefinition
 * @constructor
 */
function InstantiatedClassDefinition() {
}

InstantiatedClassDefinition.prototype = new ClassDefinition;
/**
 * @constructor
 * @param {TemplateClassDefinition} templateClassDef
 * @param {Array.<undefined|Type>} typeArguments
 * @param {ParsedObjectType} extendType
 * @param {Array.<undefined|ParsedObjectType>} implementTypes
 * @param {Array.<undefined|MemberDefinition>} members
 * @param {Array.<undefined|ClassDefinition>} inners
 * @param {Array.<undefined|TemplateClassDefinition>} templateInners
 * @param {Array.<undefined|ParsedObjectType>} objectTypesUsed
 */
function InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$(templateClassDef, typeArguments, extendType, implementTypes, members, inners, templateInners, objectTypesUsed) {
	ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$.call(this, null, Type$templateTypeToString$SALType$(templateClassDef.classFullName$(), typeArguments), templateClassDef.flags$(), extendType, implementTypes, members, inners, templateInners, objectTypesUsed, null);
	this._templateClassDef = templateClassDef;
	this._typeArguments = typeArguments;
};

InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$.prototype = new InstantiatedClassDefinition;

/**
 * @return {TemplateClassDefinition}
 */
InstantiatedClassDefinition.prototype.getTemplateClass$ = function () {
	return this._templateClassDef;
};

/**
 * @return {!string}
 */
InstantiatedClassDefinition.prototype.getTemplateClassName$ = function () {
	return this._templateClassDef.className$();
};

/**
 * @return {Array.<undefined|Type>}
 */
InstantiatedClassDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArguments;
};

/**
 * @param {Array.<undefined|Type>} typeArgs
 * @return {!boolean}
 */
InstantiatedClassDefinition.prototype.typeArgumentsAreEqual$ALType$ = function (typeArgs) {
	/** @type {!number} */
	var i;
	if (! (this._typeArguments.length === typeArgs.length)) {
		return false;
	}
	for (i = 0; i < typeArgs.length; ++ i) {
		if (! this._typeArguments[i].equals$LType$(typeArgs[i])) {
			return false;
		}
	}
	return true;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {InstantiatedClassDefinition}
 */
InstantiatedClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw");
};

/**
 * class TemplateClassDefinition extends ClassDefinition
 * @constructor
 */
function TemplateClassDefinition() {
}

TemplateClassDefinition.prototype = new ClassDefinition;
$__jsx_merge_interface(TemplateClassDefinition, TemplateDefinition);

/**
 * @constructor
 * @param {Token} token
 * @param {!string} className
 * @param {!number} flags
 * @param {Array.<undefined|Token>} typeArgs
 * @param {ParsedObjectType} extendType
 * @param {Array.<undefined|ParsedObjectType>} implementTypes
 * @param {Array.<undefined|MemberDefinition>} members
 * @param {Array.<undefined|ClassDefinition>} inners
 * @param {Array.<undefined|TemplateClassDefinition>} templateInners
 * @param {Array.<undefined|ParsedObjectType>} objectTypesUsed
 * @param {DocComment} docComment
 */
function TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(token, className, flags, typeArgs, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment) {
	ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$.call(this, token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment);
	TemplateDefinition$.call(this);
	this._token = token;
	this._className = className;
	this._flags = flags;
	this._typeArgs = typeArgs.concat([]);
	this._resetMembersClassDef$();
};

TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$.prototype = new TemplateClassDefinition;

/**
 * @return {Token}
 */
TemplateClassDefinition.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {!string}
 */
TemplateClassDefinition.prototype.className$ = function () {
	return this._className;
};

/**
 * @return {!number}
 */
TemplateClassDefinition.prototype.flags$ = function () {
	return this._flags;
};

/**
 * @return {Array.<undefined|Token>}
 */
TemplateClassDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {TemplateClassDefinition}
 */
TemplateClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	/** @type {Object.<string, undefined|Type>} */
	var typemap;
	/** @type {!string} */
	var key;
	/** @type {!number} */
	var i;
	/** @type {InstantiationContext} */
	var context;
	/** @type {!boolean} */
	var succeeded;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {MemberDefinition} */
	var member;
	/** @type {Array.<undefined|ClassDefinition>} */
	var inners;
	/** @type {ClassDefinition} */
	var inner;
	/** @type {Array.<undefined|TemplateClassDefinition>} */
	var templateInners;
	/** @type {TemplateClassDefinition} */
	var templateInner;
	typemap = {};
	for (key in instantiationContext.typemap) {
		typemap[key] = instantiationContext.typemap[key];
	}
	for (i = 0; i < this._typeArgs.length; ++ i) {
		delete typemap[this._typeArgs[i].getValue$()];
	}
	context = new InstantiationContext$ALCompileError$HLType$(instantiationContext.errors, typemap);
	succeeded = true;
	members = [];
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i].instantiate$LInstantiationContext$(context);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++ i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(context);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++ i) {
		templateInner = this._templateInners[i].instantiate$LInstantiationContext$(context);
		if (templateInner == null) {
			succeeded = false;
		}
		templateInners[i] = templateInner;
	}
	if (! succeeded) {
		return null;
	}
	return new TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$(this._token, this._className, this._flags, this._typeArgs, this._extendType != null ? this._extendType.instantiate$LInstantiationContext$(context) : null, this._implementTypes.map((function (t) {
		return t.instantiate$LInstantiationContext$(context);
	})), members, inners, templateInners, context.objectTypesUsed, this._docComment);
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {TemplateInstantiationRequest} request
 * @return {InstantiatedClassDefinition}
 */
TemplateClassDefinition.prototype.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$ = function (errors, request) {
	var $this = this;
	/** @type {InstantiationContext} */
	var instantiationContext;
	/** @type {!boolean} */
	var succeeded;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	/** @type {Array.<undefined|ClassDefinition>} */
	var inners;
	/** @type {ClassDefinition} */
	var inner;
	/** @type {Array.<undefined|TemplateClassDefinition>} */
	var templateInners;
	/** @type {TemplateClassDefinition} */
	var templateInner;
	/** @type {InstantiatedClassDefinition} */
	var instantiatedDef;
	instantiationContext = this.buildInstantiationContext$ALCompileError$LToken$ALToken$ALType$(errors, request.getToken$(), this._typeArgs, request.getTypeArguments$());
	if (instantiationContext == null) {
		return null;
	}
	succeeded = true;
	members = [];
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i].instantiate$LInstantiationContext$(instantiationContext);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++ i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(instantiationContext);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++ i) {
		templateInner = this._templateInners[i].instantiate$LInstantiationContext$(instantiationContext);
		if (templateInner == null) {
			succeeded = false;
		}
		templateInners[i] = templateInner;
	}
	if (! succeeded) {
		return null;
	}
	instantiatedDef = new InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$(this, request.getTypeArguments$(), this._extendType != null ? this._extendType.instantiate$LInstantiationContext$(instantiationContext) : null, this._implementTypes.map((function (t) {
		return t.instantiate$LInstantiationContext$(instantiationContext);
	})), members, inners, templateInners, instantiationContext.objectTypesUsed);
	return instantiatedDef;
};

/**
 * class Statement extends Object
 * @constructor
 */
function Statement() {
}

$__jsx_merge_interface(Statement, Stashable);

/**
 * @constructor
 */
function Statement$() {
	Stashable$.call(this);
};

Statement$.prototype = new Statement;

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
Statement.prototype.analyze$LAnalysisContext$ = function (context) {
	/** @type {Token} */
	var token;
	/** @type {!string} */
	var srcPos;
	if (! (this instanceof CaseStatement || this instanceof DefaultStatement)) {
		if (! Statement$assertIsReachable$LAnalysisContext$LToken$(context, this.getToken$())) {
			return false;
		}
	}
	try {
		return this.doAnalyze$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			token = this.getToken$();
			srcPos = (token != null ? Util$format$SAS(" at file %1, line %2", [ token.getFilename$(), token.getLineNumber$() + "" ]) : "");
			$__jsx_catch_0.message = Util$format$SAS("fatal error while compiling statement%1\n%2", [ srcPos, $__jsx_catch_0.message ]);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return false;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
Statement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
Statement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
Statement.prototype.forEachExpression$F$LExpression$B$ = function (cb) {
	var $this = this;
	return this.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, _) {
		return cb(expr);
	}));
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} expr
 * @return {!boolean}
 */
Statement.prototype._analyzeExpr$LAnalysisContext$LExpression$ = function (context, expr) {
	/** @type {!boolean} */
	var result;
	if (context.statement != null) {
		throw new Error("logic flaw");
	}
	context.statement = this;
	result = false;
	try {
		result = expr.analyze$LAnalysisContext$LExpression$(context, null);
	} finally {
		context.statement = null;
	}
	return result;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @return {!boolean}
 */
Statement.assertIsReachable$LAnalysisContext$LToken$ = function (context, token) {
	if (context.getTopBlock$().localVariableStatuses == null) {
		context.errors.push(new CompileError$LToken$S(token, "the code is unreachable"));
		return false;
	}
	return true;
};

var Statement$assertIsReachable$LAnalysisContext$LToken$ = Statement.assertIsReachable$LAnalysisContext$LToken$;

/**
 * class InformationStatement extends Statement
 * @constructor
 */
function InformationStatement() {
}

InformationStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 */
function InformationStatement$LToken$(token) {
	Statement$.call(this);
	this._token = token;
};

InformationStatement$LToken$.prototype = new InformationStatement;

/**
 * @return {Token}
 */
InformationStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * class DebuggerStatement extends InformationStatement
 * @constructor
 */
function DebuggerStatement() {
}

DebuggerStatement.prototype = new InformationStatement;
/**
 * @constructor
 * @param {Token} token
 */
function DebuggerStatement$LToken$(token) {
	InformationStatement$LToken$.call(this, token);
};

DebuggerStatement$LToken$.prototype = new DebuggerStatement;

/**
 * @return {Statement}
 */
DebuggerStatement.prototype.clone$ = function () {
	return new DebuggerStatement$LToken$(this._token);
};

/**
 * @return {*}
 */
DebuggerStatement.prototype.serialize$ = function () {
	return [ "DebuggerStatement", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
DebuggerStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
DebuggerStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class LogStatement extends InformationStatement
 * @constructor
 */
function LogStatement() {
}

LogStatement.prototype = new InformationStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Array.<undefined|Expression>} exprs
 */
function LogStatement$LToken$ALExpression$(token, exprs) {
	InformationStatement$LToken$.call(this, token);
	this._exprs = exprs;
};

LogStatement$LToken$ALExpression$.prototype = new LogStatement;

/**
 * @return {Statement}
 */
LogStatement.prototype.clone$ = function () {
	return new LogStatement$LToken$ALExpression$(this._token, Cloner$Expression$E$cloneArray$ALExpression$(this._exprs));
};

/**
 * @return {Array.<undefined|Expression>}
 */
LogStatement.prototype.getExprs$ = function () {
	return this._exprs;
};

/**
 * @return {*}
 */
LogStatement.prototype.serialize$ = function () {
	return [ "LogStatement", this._token.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._exprs) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
LogStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	/** @type {Type} */
	var exprType;
	for (i = 0; i < this._exprs.length; ++ i) {
		if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._exprs[i])) {
			return true;
		}
		exprType = this._exprs[i].getType$();
		if (exprType == null) {
			return true;
		}
		if (exprType.equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError$LToken$S(this._token, "cannot log a void expression"));
			break;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
LogStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._exprs);
};

/**
 * class AssertStatement extends InformationStatement
 * @constructor
 */
function AssertStatement() {
}

AssertStatement.prototype = new InformationStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 */
function AssertStatement$LToken$LExpression$(token, expr) {
	InformationStatement$LToken$.call(this, token);
	this._expr = expr;
};

AssertStatement$LToken$LExpression$.prototype = new AssertStatement;

/**
 * @return {Statement}
 */
AssertStatement.prototype.clone$ = function () {
	return new AssertStatement$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {Expression}
 */
AssertStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @return {*}
 */
AssertStatement.prototype.serialize$ = function () {
	return [ "AssertStatement", this._token.serialize$(), Serializer$Expression$E$serializeNullable$LExpression$(this._expr) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
AssertStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var exprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	exprType = this._expr.getType$();
	if (exprType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._expr.getToken$(), "argument of the assert statement cannot be void"));
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
AssertStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class ThrowStatement extends Statement
 * @constructor
 */
function ThrowStatement() {
}

ThrowStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 */
function ThrowStatement$LToken$LExpression$(token, expr) {
	Statement$.call(this);
	this._token = token;
	this._expr = expr;
};

ThrowStatement$LToken$LExpression$.prototype = new ThrowStatement;

/**
 * @return {Statement}
 */
ThrowStatement.prototype.clone$ = function () {
	return new ThrowStatement$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {Token}
 */
ThrowStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Expression}
 */
ThrowStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @return {*}
 */
ThrowStatement.prototype.serialize$ = function () {
	return [ "ThrowStatement", this._token.serialize$(), this._expr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ThrowStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {ClassDefinition} */
	var errorClassDef;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	errorClassDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, "Error");
	if (errorClassDef == null) {
		throw new Error("could not find definition for Error");
	}
	if (this._expr.getType$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot throw 'void'"));
		return true;
	}
	context.getTopBlock$().localVariableStatuses = null;
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ThrowStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class CatchStatement extends Statement
 * @constructor
 */
function CatchStatement() {
}

CatchStatement.prototype = new Statement;
$__jsx_merge_interface(CatchStatement, Block);

/**
 * @constructor
 * @param {Token} token
 * @param {CaughtVariable} local
 * @param {Array.<undefined|Statement>} statements
 */
function CatchStatement$LToken$LCaughtVariable$ALStatement$(token, local, statements) {
	Statement$.call(this);
	Block$.call(this);
	this._token = token;
	this._local = local;
	this._statements = statements;
};

CatchStatement$LToken$LCaughtVariable$ALStatement$.prototype = new CatchStatement;

/**
 * @return {Statement}
 */
CatchStatement.prototype.clone$ = function () {
	return new CatchStatement$LToken$LCaughtVariable$ALStatement$(this._token, this._local.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Token}
 */
CatchStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {CaughtVariable}
 */
CatchStatement.prototype.getLocal$ = function () {
	return this._local;
};

/**
 * @param {CaughtVariable} local
 */
CatchStatement.prototype.setLocal$LCaughtVariable$ = function (local) {
	this._local = local;
};

/**
 * @return {Array.<undefined|Statement>}
 */
CatchStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {*}
 */
CatchStatement.prototype.serialize$ = function () {
	return [ "CatchStatement", this._token.serialize$(), this._local.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
CatchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var catchType;
	/** @type {LocalVariableStatuses} */
	var lvStatusesAfterCatch;
	/** @type {!number} */
	var i;
	catchType = this.getLocal$().getType$();
	if (! (catchType instanceof ObjectType || catchType.equals$LType$(Type.variantType))) {
		context.errors.push(new CompileError$LToken$S(this._token, "only objects or a variant may be caught"));
	}
	context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(context.getTopBlock$().localVariableStatuses.clone$(), this));
	lvStatusesAfterCatch = null;
	try {
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesAfterCatch = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	if (lvStatusesAfterCatch != null) {
		context.getTopBlock$().localVariableStatuses = context.getTopBlock$().localVariableStatuses.merge$LLocalVariableStatuses$(lvStatusesAfterCatch);
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CatchStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CatchStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	return cb(this._statements);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CatchStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class TryStatement extends Statement
 * @constructor
 */
function TryStatement() {
}

TryStatement.prototype = new Statement;
$__jsx_merge_interface(TryStatement, Block);

/**
 * @constructor
 * @param {Token} token
 * @param {Array.<undefined|Statement>} tryStatements
 * @param {Array.<undefined|CatchStatement>} catchStatements
 * @param {Array.<undefined|Statement>} finallyStatements
 */
function TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$(token, tryStatements, catchStatements, finallyStatements) {
	Statement$.call(this);
	Block$.call(this);
	this._token = token;
	this._tryStatements = tryStatements;
	this._catchStatements = catchStatements;
	this._finallyStatements = finallyStatements;
};

TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$.prototype = new TryStatement;

/**
 * @return {Statement}
 */
TryStatement.prototype.clone$ = function () {
	return new TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$(this._token, Cloner$Statement$E$cloneArray$ALStatement$(this._tryStatements), Cloner$CatchStatement$E$cloneArray$ALCatchStatement$(this._catchStatements), Cloner$Statement$E$cloneArray$ALStatement$(this._finallyStatements));
};

/**
 * @return {Token}
 */
TryStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Array.<undefined|Statement>}
 */
TryStatement.prototype.getTryStatements$ = function () {
	return this._tryStatements;
};

/**
 * @return {Array.<undefined|CatchStatement>}
 */
TryStatement.prototype.getCatchStatements$ = function () {
	return this._catchStatements;
};

/**
 * @return {Array.<undefined|Statement>}
 */
TryStatement.prototype.getFinallyStatements$ = function () {
	return this._finallyStatements;
};

/**
 * @return {*}
 */
TryStatement.prototype.serialize$ = function () {
	return [ "TryStatement", Serializer$Statement$E$serializeArray$ALStatement$(this._tryStatements), Serializer$CatchStatement$E$serializeArray$ALCatchStatement$(this._catchStatements), Serializer$Statement$E$serializeArray$ALStatement$(this._finallyStatements) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
TryStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {LocalVariableStatuses} */
	var lvStatusesAfterTry;
	/** @type {!number} */
	var i;
	/** @type {Type} */
	var curCatchType;
	/** @type {!number} */
	var j;
	/** @type {Type} */
	var precCatchType;
	context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(context.getTopBlock$().localVariableStatuses.clone$(), this));
	lvStatusesAfterTry = null;
	try {
		for (i = 0; i < this._tryStatements.length; ++ i) {
			if (! this._tryStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesAfterTry = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	context.getTopBlock$().localVariableStatuses = (lvStatusesAfterTry != null ? context.getTopBlock$().localVariableStatuses.merge$LLocalVariableStatuses$(lvStatusesAfterTry) : context.getTopBlock$().localVariableStatuses.clone$());
	for (i = 0; i < this._catchStatements.length; ++ i) {
		if (! this._catchStatements[i].analyze$LAnalysisContext$(context)) {
			return false;
		}
		curCatchType = this._catchStatements[i].getLocal$().getType$();
		for (j = 0; j < i; ++ j) {
			precCatchType = this._catchStatements[j].getLocal$().getType$();
			if (curCatchType.isConvertibleTo$LType$(precCatchType)) {
				context.errors.push(new CompileError$LToken$S(this._catchStatements[i]._token, "code is unreachable, a broader catch statement for type '" + precCatchType.toString() + "' already exists"));
				return false;
			}
		}
	}
	for (i = 0; i < this._finallyStatements.length; ++ i) {
		if (! this._finallyStatements[i].analyze$LAnalysisContext$(context)) {
			return false;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TryStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	var $this = this;
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._tryStatements)) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._catchStatements.map((function (s) {
		return s;
	})))) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._finallyStatements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TryStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	var $this = this;
	if (! cb(this._tryStatements)) {
		return false;
	}
	if (! cb(this._catchStatements.map((function (s) {
		return s;
	})))) {
		return false;
	}
	if (! cb(this._finallyStatements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
TryStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class DefaultStatement extends Statement
 * @constructor
 */
function DefaultStatement() {
}

DefaultStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 */
function DefaultStatement$LToken$(token) {
	Statement$.call(this);
	this._token = token;
};

DefaultStatement$LToken$.prototype = new DefaultStatement;

/**
 * @return {Statement}
 */
DefaultStatement.prototype.clone$ = function () {
	return new DefaultStatement$LToken$(this._token);
};

/**
 * @return {Token}
 */
DefaultStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {*}
 */
DefaultStatement.prototype.serialize$ = function () {
	return [ "DefaultStatement" ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
DefaultStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$(context);
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
DefaultStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class CaseStatement extends Statement
 * @constructor
 */
function CaseStatement() {
}

CaseStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 */
function CaseStatement$LToken$LExpression$(token, expr) {
	Statement$.call(this);
	this._token = token;
	this._expr = expr;
};

CaseStatement$LToken$LExpression$.prototype = new CaseStatement;

/**
 * @return {Statement}
 */
CaseStatement.prototype.clone$ = function () {
	return new CaseStatement$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {Token}
 */
CaseStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Expression}
 */
CaseStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @return {*}
 */
CaseStatement.prototype.serialize$ = function () {
	return [ "CaseStatement", this._expr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
CaseStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Block} */
	var statement;
	/** @type {Type} */
	var expectedType;
	/** @type {Type} */
	var exprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	statement = context.getTopBlock$().block;
	if (! (statement instanceof SwitchStatement)) {
		throw new Error("logic flaw");
	}
	expectedType = statement.getExpr$().getType$();
	if (expectedType == null) {
		return true;
	}
	expectedType = expectedType.resolveIfNullable$();
	exprType = this._expr.getType$();
	if (exprType == null) {
		return true;
	}
	exprType = exprType.resolveIfNullable$();
	if (exprType.equals$LType$(expectedType)) {
	} else {
		if (Type$isIntegerOrNumber$LType$(exprType) && Type$isIntegerOrNumber$LType$(expectedType)) {
		} else {
			if (expectedType.equals$LType$(Type.stringType) && exprType.equals$LType$(Type.nullType)) {
			} else {
				context.errors.push(new CompileError$LToken$S(this._token, "type mismatch; expected type was '" + expectedType.toString() + "' but got '" + exprType.toString() + "'"));
			}
		}
	}
	SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$(context);
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CaseStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class IfStatement extends Statement
 * @constructor
 */
function IfStatement() {
}

IfStatement.prototype = new Statement;
$__jsx_merge_interface(IfStatement, Block);

/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 * @param {Array.<undefined|Statement>} onTrueStatements
 * @param {Array.<undefined|Statement>} onFalseStatements
 */
function IfStatement$LToken$LExpression$ALStatement$ALStatement$(token, expr, onTrueStatements, onFalseStatements) {
	Statement$.call(this);
	Block$.call(this);
	this._token = token;
	this._expr = expr;
	this._onTrueStatements = onTrueStatements;
	this._onFalseStatements = onFalseStatements;
};

IfStatement$LToken$LExpression$ALStatement$ALStatement$.prototype = new IfStatement;

/**
 * @return {Statement}
 */
IfStatement.prototype.clone$ = function () {
	return new IfStatement$LToken$LExpression$ALStatement$ALStatement$(this._token, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._onTrueStatements), Cloner$Statement$E$cloneArray$ALStatement$(this._onFalseStatements));
};

/**
 * @return {Token}
 */
IfStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Expression}
 */
IfStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
IfStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {Array.<undefined|Statement>}
 */
IfStatement.prototype.getOnTrueStatements$ = function () {
	return this._onTrueStatements;
};

/**
 * @return {Array.<undefined|Statement>}
 */
IfStatement.prototype.getOnFalseStatements$ = function () {
	return this._onFalseStatements;
};

/**
 * @return {*}
 */
IfStatement.prototype.serialize$ = function () {
	return [ "IfStatement", this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._onTrueStatements), Serializer$Statement$E$serializeArray$ALStatement$(this._onFalseStatements) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
IfStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {LocalVariableStatuses} */
	var lvStatusesOnTrueStmts;
	/** @type {LocalVariableStatuses} */
	var lvStatusesOnFalseStmts;
	/** @type {!number} */
	var i;
	if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError$LToken$S(this._expr.getToken$(), "expression of the if statement should not return void"));
		}
	}
	context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(context.getTopBlock$().localVariableStatuses.clone$(), this));
	(lvStatusesOnTrueStmts = null, lvStatusesOnFalseStmts = null);
	try {
		for (i = 0; i < this._onTrueStatements.length; ++ i) {
			if (! this._onTrueStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesOnTrueStmts = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	try {
		context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(context.getTopBlock$().localVariableStatuses.clone$(), this));
		for (i = 0; i < this._onFalseStatements.length; ++ i) {
			if (! this._onFalseStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesOnFalseStmts = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	if (lvStatusesOnTrueStmts != null) {
		if (lvStatusesOnFalseStmts != null) {
			context.getTopBlock$().localVariableStatuses = lvStatusesOnTrueStmts.merge$LLocalVariableStatuses$(lvStatusesOnFalseStmts);
		} else {
			context.getTopBlock$().localVariableStatuses = lvStatusesOnTrueStmts;
		}
	} else {
		context.getTopBlock$().localVariableStatuses = lvStatusesOnFalseStmts;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
IfStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._onTrueStatements)) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._onFalseStatements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
IfStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._onTrueStatements)) {
		return false;
	}
	if (! cb(this._onFalseStatements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
IfStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class LabellableStatement extends Statement
 * @constructor
 */
function LabellableStatement() {
}

LabellableStatement.prototype = new Statement;
$__jsx_merge_interface(LabellableStatement, Block);

/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 */
function LabellableStatement$LToken$LToken$(token, label) {
	Statement$.call(this);
	Block$.call(this);
	this._lvStatusesOnBreak = null;
	this._token = token;
	this._label = label;
};

LabellableStatement$LToken$LToken$.prototype = new LabellableStatement;

/**
 * @return {Token}
 */
LabellableStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Token}
 */
LabellableStatement.prototype.getLabel$ = function () {
	return this._label;
};

/**
 * @return {Array.<undefined|*>}
 */
LabellableStatement.prototype._serialize$ = function () {
	return [ Serializer$Token$E$serializeNullable$LToken$(this._label) ];
};

/**
 * @param {AnalysisContext} context
 */
LabellableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.push(new BlockContext$LLocalVariableStatuses$LBlock$(context.getTopBlock$().localVariableStatuses.clone$(), this));
	this._lvStatusesOnBreak = null;
};

/**
 * @param {AnalysisContext} context
 */
LabellableStatement.prototype._abortBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.pop();
	this._lvStatusesOnBreak = null;
};

/**
 * @param {AnalysisContext} context
 */
LabellableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.pop();
	context.getTopBlock$().localVariableStatuses = this._lvStatusesOnBreak;
	this._lvStatusesOnBreak = null;
};

/**
 * @param {LocalVariableStatuses} statuses
 */
LabellableStatement.prototype.registerVariableStatusesOnBreak$LLocalVariableStatuses$ = function (statuses) {
	if (statuses != null) {
		if (this._lvStatusesOnBreak == null) {
			this._lvStatusesOnBreak = statuses.clone$();
		} else {
			this._lvStatusesOnBreak = this._lvStatusesOnBreak.merge$LLocalVariableStatuses$(statuses);
		}
	}
};

/**
 * class SwitchStatement extends LabellableStatement
 * @constructor
 */
function SwitchStatement() {
}

SwitchStatement.prototype = new LabellableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Expression} expr
 * @param {Array.<undefined|Statement>} statements
 */
function SwitchStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, statements) {
	LabellableStatement$LToken$LToken$.call(this, token, label);
	this._expr = expr;
	this._statements = statements;
};

SwitchStatement$LToken$LToken$LExpression$ALStatement$.prototype = new SwitchStatement;

/**
 * @return {Statement}
 */
SwitchStatement.prototype.clone$ = function () {
	return new SwitchStatement$LToken$LToken$LExpression$ALStatement$(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Expression}
 */
SwitchStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
SwitchStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {Array.<undefined|Statement>}
 */
SwitchStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {*}
 */
SwitchStatement.prototype.serialize$ = function () {
	return [ "SwitchStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
SwitchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var exprType;
	/** @type {!boolean} */
	var hasDefaultLabel;
	/** @type {!number} */
	var i;
	/** @type {Statement} */
	var statement;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	exprType = this._expr.getType$().resolveIfNullable$();
	if (! (exprType.equals$LType$(Type.booleanType) || exprType.equals$LType$(Type.integerType) || exprType.equals$LType$(Type.numberType) || exprType.equals$LType$(Type.stringType))) {
		context.errors.push(new CompileError$LToken$S(this._token, "switch statement only accepts boolean, number, or string expressions"));
		return true;
	}
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		hasDefaultLabel = false;
		for (i = 0; i < this._statements.length; ++ i) {
			statement = this._statements[i];
			if (! statement.analyze$LAnalysisContext$(context)) {
				return false;
			}
			if (statement instanceof DefaultStatement) {
				hasDefaultLabel = true;
			}
		}
		if (! hasDefaultLabel) {
			this.registerVariableStatusesOnBreak$LLocalVariableStatuses$(context.blockStack[context.blockStack.length - 2].localVariableStatuses);
		}
		this._finalizeBlockAnalysis$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			this._abortBlockAnalysis$LAnalysisContext$(context);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
SwitchStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
SwitchStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._statements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
SwitchStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 */
SwitchStatement.resetLocalVariableStatuses$LAnalysisContext$ = function (context) {
	context.getTopBlock$().localVariableStatuses = context.blockStack[context.blockStack.length - 2].localVariableStatuses.clone$();
};

var SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$ = SwitchStatement.resetLocalVariableStatuses$LAnalysisContext$;

/**
 * class ContinuableStatement extends LabellableStatement
 * @constructor
 */
function ContinuableStatement() {
}

ContinuableStatement.prototype = new LabellableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Array.<undefined|Statement>} statements
 */
function ContinuableStatement$LToken$LToken$ALStatement$(token, label, statements) {
	LabellableStatement$LToken$LToken$.call(this, token, label);
	this._lvStatusesOnContinue = null;
	this._statements = statements;
};

ContinuableStatement$LToken$LToken$ALStatement$.prototype = new ContinuableStatement;

/**
 * @return {Array.<undefined|Statement>}
 */
ContinuableStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ContinuableStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ContinuableStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._statements)) {
		return false;
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 */
ContinuableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$.call(this, context);
	this._lvStatusesOnContinue = null;
};

/**
 * @param {AnalysisContext} context
 */
ContinuableStatement.prototype._abortBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._abortBlockAnalysis$LAnalysisContext$.call(this, context);
	this._lvStatusesOnContinue = null;
};

/**
 * @param {AnalysisContext} context
 */
ContinuableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$.call(this, context);
	this._restoreContinueVariableStatuses$LAnalysisContext$(context);
};

/**
 * @param {AnalysisContext} context
 */
ContinuableStatement.prototype._restoreContinueVariableStatuses$LAnalysisContext$ = function (context) {
	if (this._lvStatusesOnContinue != null) {
		if (context.getTopBlock$().localVariableStatuses != null) {
			context.getTopBlock$().localVariableStatuses = context.getTopBlock$().localVariableStatuses.merge$LLocalVariableStatuses$(this._lvStatusesOnContinue);
		} else {
			context.getTopBlock$().localVariableStatuses = this._lvStatusesOnContinue;
		}
		this._lvStatusesOnContinue = null;
	}
};

/**
 * @param {LocalVariableStatuses} statuses
 */
ContinuableStatement.prototype.registerVariableStatusesOnContinue$LLocalVariableStatuses$ = function (statuses) {
	if (statuses != null) {
		if (this._lvStatusesOnContinue == null) {
			this._lvStatusesOnContinue = statuses.clone$();
		} else {
			this._lvStatusesOnContinue = this._lvStatusesOnContinue.merge$LLocalVariableStatuses$(statuses);
		}
	}
};

/**
 * class WhileStatement extends ContinuableStatement
 * @constructor
 */
function WhileStatement() {
}

WhileStatement.prototype = new ContinuableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Expression} expr
 * @param {Array.<undefined|Statement>} statements
 */
function WhileStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, statements) {
	ContinuableStatement$LToken$LToken$ALStatement$.call(this, token, label, statements);
	this._expr = expr;
};

WhileStatement$LToken$LToken$LExpression$ALStatement$.prototype = new WhileStatement;

/**
 * @return {Statement}
 */
WhileStatement.prototype.clone$ = function () {
	return new WhileStatement$LToken$LToken$LExpression$ALStatement$(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Expression}
 */
WhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @return {Array.<undefined|Statement>}
 */
WhileStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {*}
 */
WhileStatement.prototype.serialize$ = function () {
	return [ "WhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
WhileStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError$LToken$S(this._expr.getToken$(), "expression of the while statement should not return void"));
		}
	}
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		this.registerVariableStatusesOnContinue$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
		this._finalizeBlockAnalysis$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			this._abortBlockAnalysis$LAnalysisContext$(context);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
WhileStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class ForStatement extends ContinuableStatement
 * @constructor
 */
function ForStatement() {
}

ForStatement.prototype = new ContinuableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Expression} initExpr
 * @param {Expression} condExpr
 * @param {Expression} postExpr
 * @param {Array.<undefined|Statement>} statements
 */
function ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$(token, label, initExpr, condExpr, postExpr, statements) {
	ContinuableStatement$LToken$LToken$ALStatement$.call(this, token, label, statements);
	this._initExpr = initExpr;
	this._condExpr = condExpr;
	this._postExpr = postExpr;
};

ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$.prototype = new ForStatement;

/**
 * @return {Statement}
 */
ForStatement.prototype.clone$ = function () {
	return new ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$(this._token, this._label, Cloner$Expression$E$cloneNullable$LExpression$(this._initExpr), Cloner$Expression$E$cloneNullable$LExpression$(this._condExpr), Cloner$Expression$E$cloneNullable$LExpression$(this._postExpr), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Expression}
 */
ForStatement.prototype.getInitExpr$ = function () {
	return this._initExpr;
};

/**
 * @param {Expression} expr
 */
ForStatement.prototype.setInitExpr$LExpression$ = function (expr) {
	this._initExpr = expr;
};

/**
 * @return {Expression}
 */
ForStatement.prototype.getCondExpr$ = function () {
	return this._condExpr;
};

/**
 * @return {Expression}
 */
ForStatement.prototype.getPostExpr$ = function () {
	return this._postExpr;
};

/**
 * @return {Array.<undefined|Statement>}
 */
ForStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {*}
 */
ForStatement.prototype.serialize$ = function () {
	return [ "ForStatement" ].concat(this._serialize$()).concat([ Serializer$Expression$E$serializeNullable$LExpression$(this._initExpr), Serializer$Expression$E$serializeNullable$LExpression$(this._condExpr), Serializer$Expression$E$serializeNullable$LExpression$(this._postExpr), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ForStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	if (this._initExpr != null) {
		this._analyzeExpr$LAnalysisContext$LExpression$(context, this._initExpr);
	}
	if (this._condExpr != null) {
		if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._condExpr)) {
			if (this._condExpr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError$LToken$S(this._condExpr.getToken$(), "condition expression of the for statement should not return void"));
			}
		}
	}
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		this._restoreContinueVariableStatuses$LAnalysisContext$(context);
		if (this._postExpr != null) {
			if (! Statement$assertIsReachable$LAnalysisContext$LToken$(context, this._postExpr.getToken$())) {
				return false;
			}
			this._analyzeExpr$LAnalysisContext$LExpression$(context, this._postExpr);
		}
		this.registerVariableStatusesOnBreak$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
		this._finalizeBlockAnalysis$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			this._abortBlockAnalysis$LAnalysisContext$(context);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ForStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (this._initExpr != null && ! cb(this._initExpr, (function (expr) {
		$this._initExpr = expr;
	}))) {
		return false;
	}
	if (this._condExpr != null && ! cb(this._condExpr, (function (expr) {
		$this._condExpr = expr;
	}))) {
		return false;
	}
	if (this._postExpr != null && ! cb(this._postExpr, (function (expr) {
		$this._postExpr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class ForInStatement extends ContinuableStatement
 * @constructor
 */
function ForInStatement() {
}

ForInStatement.prototype = new ContinuableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Expression} lhsExpr
 * @param {Expression} listExpr
 * @param {Array.<undefined|Statement>} statements
 */
function ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$(token, label, lhsExpr, listExpr, statements) {
	ContinuableStatement$LToken$LToken$ALStatement$.call(this, token, label, statements);
	this._lhsExpr = lhsExpr;
	this._listExpr = listExpr;
};

ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$.prototype = new ForInStatement;

/**
 * @return {Statement}
 */
ForInStatement.prototype.clone$ = function () {
	return new ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$(this._token, this._label, this._lhsExpr.clone$(), this._listExpr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Expression}
 */
ForInStatement.prototype.getLHSExpr$ = function () {
	return this._lhsExpr;
};

/**
 * @return {Expression}
 */
ForInStatement.prototype.getListExpr$ = function () {
	return this._listExpr;
};

/**
 * @return {Array.<undefined|Statement>}
 */
ForInStatement.prototype.getStatements$ = function () {
	return this._statements;
};

/**
 * @return {*}
 */
ForInStatement.prototype.serialize$ = function () {
	return [ "ForInStatement" ].concat(this._serialize$()).concat([ this._lhsExpr.serialize$(), this._listExpr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ForInStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var listType;
	/** @type {ClassDefinition} */
	var listClassDef;
	/** @type {!string} */
	var listTypeName;
	/** @type {!number} */
	var i;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._listExpr)) {
		return true;
	}
	listType = this._listExpr.getType$().resolveIfNullable$();
	if (listType instanceof ObjectType && (listClassDef = listType.getClassDef$()) instanceof InstantiatedClassDefinition && ((listTypeName = listClassDef.getTemplateClassName$()) === "Array" || listTypeName === "Map")) {
	} else {
		context.errors.push(new CompileError$LToken$S(this.getToken$(), "list expression of the for..in statement should be an array or a map"));
		return true;
	}
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		this._analyzeExpr$LAnalysisContext$LExpression$(context, this._lhsExpr);
		if (! this._lhsExpr.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, listTypeName === "Array" ? Type.numberType : Type.stringType)) {
			return false;
		}
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		this.registerVariableStatusesOnContinue$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
		this._finalizeBlockAnalysis$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			this._abortBlockAnalysis$LAnalysisContext$(context);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ForInStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._lhsExpr, (function (expr) {
		$this._lhsExpr = expr;
	}))) {
		return false;
	}
	if (! cb(this._listExpr, (function (expr) {
		$this._listExpr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class DoWhileStatement extends ContinuableStatement
 * @constructor
 */
function DoWhileStatement() {
}

DoWhileStatement.prototype = new ContinuableStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 * @param {Expression} expr
 * @param {Array.<undefined|Statement>} statements
 */
function DoWhileStatement$LToken$LToken$LExpression$ALStatement$(token, label, expr, statements) {
	ContinuableStatement$LToken$LToken$ALStatement$.call(this, token, label, statements);
	this._expr = expr;
};

DoWhileStatement$LToken$LToken$LExpression$ALStatement$.prototype = new DoWhileStatement;

/**
 * @return {Statement}
 */
DoWhileStatement.prototype.clone$ = function () {
	return new DoWhileStatement$LToken$LToken$LExpression$ALStatement$(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};

/**
 * @return {Expression}
 */
DoWhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @return {*}
 */
DoWhileStatement.prototype.serialize$ = function () {
	return [ "DoWhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
DoWhileStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		for (i = 0; i < this._statements.length; ++ i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		this._restoreContinueVariableStatuses$LAnalysisContext$(context);
		if (! Statement$assertIsReachable$LAnalysisContext$LToken$(context, this._expr.getToken$())) {
			return false;
		}
		if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
			if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError$LToken$S(this._expr.getToken$(), "expression of the do-while statement should not return void"));
			}
		}
		this.registerVariableStatusesOnBreak$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
		this._finalizeBlockAnalysis$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			this._abortBlockAnalysis$LAnalysisContext$(context);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
DoWhileStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class JumpStatement extends Statement
 * @constructor
 */
function JumpStatement() {
}

JumpStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 */
function JumpStatement$LToken$LToken$(token, label) {
	Statement$.call(this);
	this._token = token;
	this._label = label;
};

JumpStatement$LToken$LToken$.prototype = new JumpStatement;

/**
 * @return {Token}
 */
JumpStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Token}
 */
JumpStatement.prototype.getLabel$ = function () {
	return this._label;
};

/**
 * @return {*}
 */
JumpStatement.prototype.serialize$ = function () {
	return [ this._getName$(), this._token.serialize$(), Serializer$Token$E$serializeNullable$LToken$(this._label) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
JumpStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {BlockContext} */
	var targetBlock;
	targetBlock = this._determineDestination$LAnalysisContext$(context);
	if (targetBlock == null) {
		return true;
	}
	if (this instanceof BreakStatement) {
		targetBlock.block.registerVariableStatusesOnBreak$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
	} else {
		targetBlock.block.registerVariableStatusesOnContinue$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
	}
	context.getTopBlock$().localVariableStatuses = null;
	return true;
};

/**
 * @param {AnalysisContext} context
 * @return {BlockContext}
 */
JumpStatement.prototype._determineDestination$LAnalysisContext$ = function (context) {
	/** @type {!number} */
	var i;
	/** @type {Block} */
	var statement;
	/** @type {Token} */
	var statementLabel;
	for (i = context.blockStack.length - 1; ! (context.blockStack[i].block instanceof MemberFunctionDefinition); -- i) {
		statement = context.blockStack[i].block;
		if (! (statement instanceof LabellableStatement)) {
			continue;
		}
		if (this._label != null) {
			statementLabel = statement.getLabel$();
			if (statementLabel != null && statementLabel.getValue$() === this._label.getValue$()) {
				if (this._token.getValue$() === "continue" && statement instanceof SwitchStatement) {
					context.errors.push(new CompileError$LToken$S(this._token, "cannot 'continue' to a switch statement"));
					return null;
				}
			} else {
				continue;
			}
		} else {
			if (this._token.getValue$() === "continue" && statement instanceof SwitchStatement) {
				continue;
			}
		}
		return context.blockStack[i];
	}
	if (this._label != null) {
		context.errors.push(new CompileError$LToken$S(this._label, "label '" + this._label.getValue$() + "' is either not defined or invalid as the destination"));
	} else {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot '" + this._token.getValue$() + "' at this point"));
	}
	return null;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
JumpStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class ContinueStatement extends JumpStatement
 * @constructor
 */
function ContinueStatement() {
}

ContinueStatement.prototype = new JumpStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 */
function ContinueStatement$LToken$LToken$(token, label) {
	JumpStatement$LToken$LToken$.call(this, token, label);
};

ContinueStatement$LToken$LToken$.prototype = new ContinueStatement;

/**
 * @return {Statement}
 */
ContinueStatement.prototype.clone$ = function () {
	return new ContinueStatement$LToken$LToken$(this._token, this._label);
};

/**
 * @return {!string}
 */
ContinueStatement.prototype._getName$ = function () {
	return "ContinueStatement";
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ContinueStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class BreakStatement extends JumpStatement
 * @constructor
 */
function BreakStatement() {
}

BreakStatement.prototype = new JumpStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} label
 */
function BreakStatement$LToken$LToken$(token, label) {
	JumpStatement$LToken$LToken$.call(this, token, label);
};

BreakStatement$LToken$LToken$.prototype = new BreakStatement;

/**
 * @return {Statement}
 */
BreakStatement.prototype.clone$ = function () {
	return new BreakStatement$LToken$LToken$(this._token, this._label);
};

/**
 * @return {!string}
 */
BreakStatement.prototype._getName$ = function () {
	return "BreakStatement";
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
BreakStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class ReturnStatement extends Statement
 * @constructor
 */
function ReturnStatement() {
}

ReturnStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 */
function ReturnStatement$LToken$LExpression$(token, expr) {
	Statement$.call(this);
	this._token = token;
	this._expr = expr;
};

ReturnStatement$LToken$LExpression$.prototype = new ReturnStatement;

/**
 * @return {Statement}
 */
ReturnStatement.prototype.clone$ = function () {
	return new ReturnStatement$LToken$LExpression$(this._token, Cloner$Expression$E$cloneNullable$LExpression$(this._expr));
};

/**
 * @return {Token}
 */
ReturnStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Expression}
 */
ReturnStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
ReturnStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {*}
 */
ReturnStatement.prototype.serialize$ = function () {
	return [ "ReturnStatement", Serializer$Expression$E$serializeNullable$LExpression$(this._expr) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ReturnStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var returnType;
	/** @type {Type} */
	var exprType;
	returnType = context.funcDef.getReturnType$();
	if (returnType == null) {
		if (this._expr != null) {
			if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
				return true;
			}
			exprType = this._expr.getType$();
			if (exprType == null) {
				return true;
			}
			context.funcDef.setReturnType$LType$(exprType);
		} else {
			context.funcDef.setReturnType$LType$(Type.voidType);
		}
	} else {
		if (returnType.equals$LType$(Type.voidType)) {
			if (this._expr != null) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot return a value from a void function"));
				return true;
			}
		} else {
			if (this._expr == null) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot return void, the function is declared to return a value of type '" + returnType.toString() + "'"));
				return true;
			}
			if (this._expr instanceof FunctionExpression && ! this._expr.argumentTypesAreIdentified$() && returnType instanceof StaticFunctionType) {
				if (! this._expr.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, returnType)) {
					return false;
				}
			}
			if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
				return true;
			}
			exprType = this._expr.getType$();
			if (exprType == null) {
				return true;
			}
			if (! exprType.isConvertibleTo$LType$(returnType)) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
				return false;
			}
		}
	}
	context.getTopBlock$().localVariableStatuses = null;
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ReturnStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (this._expr != null && ! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class UnaryExpressionStatement extends Statement
 * @constructor
 */
function UnaryExpressionStatement() {
}

UnaryExpressionStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Expression} expr
 */
function UnaryExpressionStatement$LExpression$(expr) {
	Statement$.call(this);
	this._expr = null;
	if (expr == null) {
		throw new Error("logic flaw");
	}
	this._expr = expr;
};

UnaryExpressionStatement$LExpression$.prototype = new UnaryExpressionStatement;

/**
 * @return {Token}
 */
UnaryExpressionStatement.prototype.getToken$ = function () {
	return this._expr.getToken$();
};

/**
 * @return {Expression}
 */
UnaryExpressionStatement.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
UnaryExpressionStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
UnaryExpressionStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr);
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
UnaryExpressionStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class DeleteStatement extends UnaryExpressionStatement
 * @constructor
 */
function DeleteStatement() {
}

DeleteStatement.prototype = new UnaryExpressionStatement;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 */
function DeleteStatement$LToken$LExpression$(token, expr) {
	UnaryExpressionStatement$LExpression$.call(this, expr);
	this._token = token;
};

DeleteStatement$LToken$LExpression$.prototype = new DeleteStatement;

/**
 * @return {Statement}
 */
DeleteStatement.prototype.clone$ = function () {
	return new DeleteStatement$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {Token}
 */
DeleteStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {*}
 */
DeleteStatement.prototype.serialize$ = function () {
	return [ "DeleteStatement", this._expr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
DeleteStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var secondExprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	if (! (this._expr instanceof ArrayExpression)) {
		context.errors.push(new CompileError$LToken$S(this._token, "only properties of a hash object can be deleted"));
		return true;
	}
	secondExprType = this._expr.getSecondExpr$().getType$();
	if (secondExprType == null) {
		return true;
	}
	if (! secondExprType.resolveIfNullable$().equals$LType$(Type.stringType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "only properties of a hash object can be deleted"));
		return true;
	}
	return true;
};

/**
 * class ExpressionStatement extends UnaryExpressionStatement
 * @constructor
 */
function ExpressionStatement() {
}

ExpressionStatement.prototype = new UnaryExpressionStatement;
/**
 * @constructor
 * @param {Expression} expr
 */
function ExpressionStatement$LExpression$(expr) {
	UnaryExpressionStatement$LExpression$.call(this, expr);
};

ExpressionStatement$LExpression$.prototype = new ExpressionStatement;

/**
 * @return {Statement}
 */
ExpressionStatement.prototype.clone$ = function () {
	return new ExpressionStatement$LExpression$(this._expr.clone$());
};

/**
 * @return {*}
 */
ExpressionStatement.prototype.serialize$ = function () {
	return [ "ExpressionStatement", this._expr.serialize$() ];
};

/**
 * class ConstructorInvocationStatement extends Statement
 * @constructor
 */
function ConstructorInvocationStatement() {
}

ConstructorInvocationStatement.prototype = new Statement;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} ctorClassType
 * @param {Array.<undefined|Expression>} args
 */
function ConstructorInvocationStatement$LToken$LType$ALExpression$(token, ctorClassType, args) {
	ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$.call(this, token, ctorClassType, args, null);
};

ConstructorInvocationStatement$LToken$LType$ALExpression$.prototype = new ConstructorInvocationStatement;

/**
 * @constructor
 * @param {Token} token
 * @param {Type} ctorClassType
 * @param {Array.<undefined|Expression>} args
 * @param {FunctionType} ctorFunctionType
 */
function ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$(token, ctorClassType, args, ctorFunctionType) {
	Statement$.call(this);
	this._token = token;
	this._ctorClassType = ctorClassType;
	this._args = args;
	this._ctorFunctionType = (ctorFunctionType != null ? ctorFunctionType : null);
};

ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$.prototype = new ConstructorInvocationStatement;

/**
 * @return {Statement}
 */
ConstructorInvocationStatement.prototype.clone$ = function () {
	return new ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$(this._token, this._ctorClassType, Cloner$Expression$E$cloneArray$ALExpression$(this._args), this._ctorFunctionType);
};

/**
 * @param {InstantiationContext} instantiationContext
 * @return {Statement}
 */
ConstructorInvocationStatement.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	if (this._ctorFunctionType != null) {
		throw new Error("instantiation after analysis?");
	}
	return new ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$(this._token, this._ctorClassType.instantiate$LInstantiationContext$(instantiationContext), Cloner$Expression$E$cloneArray$ALExpression$(this._args), null);
};

/**
 * @return {Token}
 */
ConstructorInvocationStatement.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Array.<undefined|Expression>}
 */
ConstructorInvocationStatement.prototype.getArguments$ = function () {
	return this._args;
};

/**
 * @return {ClassDefinition}
 */
ConstructorInvocationStatement.prototype.getConstructingClassDef$ = function () {
	return this._ctorClassType.getClassDef$();
};

/**
 * @return {FunctionType}
 */
ConstructorInvocationStatement.prototype.getConstructorType$ = function () {
	return this._ctorFunctionType;
};

/**
 * @return {*}
 */
ConstructorInvocationStatement.prototype.serialize$ = function () {
	return [ "ConstructorInvocationStatement", this._ctorClassType.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ConstructorInvocationStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	/** @type {FunctionType} */
	var ctorType;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	ctorType = this.getConstructingClassDef$().getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "constructor", false, [], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
	if (ctorType == null) {
		if (this._args.length !== 0) {
			context.errors.push(new CompileError$LToken$S(this.getToken$(), "no function with matching arguments"));
			return true;
		}
		ctorType = new ResolvedFunctionType$LToken$LType$ALType$B(this.getConstructingClassDef$().getToken$(), Type.voidType, [], false);
	} else {
		argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, null, ctorType.getExpectedTypes$NB(this._args.length, false));
		if (argTypes == null) {
			return true;
		}
		if ((ctorType = ctorType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this.getToken$(), argTypes, false)) == null) {
			return true;
		}
	}
	this._ctorFunctionType = ctorType;
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ConstructorInvocationStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};

/**
 * class Expression extends Object
 * @constructor
 */
function Expression() {
}

$__jsx_merge_interface(Expression, Stashable);

/**
 * @constructor
 * @param {Token} token
 */
function Expression$LToken$(token) {
	Stashable$.call(this);
	this._token = token;
};

Expression$LToken$.prototype = new Expression;

/**
 * @constructor
 * @param {Expression} that
 */
function Expression$LExpression$(that) {
	/** @type {!string} */
	var k;
	Stashable$.call(this);
	this._token = that.getToken$();
	for (k in that._optimizerStash) {
		this._optimizerStash[k] = that._optimizerStash[k].clone$();
	}
};

Expression$LExpression$.prototype = new Expression;

/**
 * @param {InstantiationContext} instantiationContext
 * @return {!boolean}
 */
Expression.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	/** @type {*} */
	var onExpr;
	function onExpr(expr) {
		/** @type {Type} */
		var srcType;
		/** @type {InstanceofExpression} */
		var instanceofExpr;
		if (expr instanceof NullExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
			}
		} else {
			if (expr instanceof NewExpression) {
				srcType = expr.getType$();
				if (srcType != null) {
					expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
				}
			} else {
				if (expr instanceof ArrayLiteralExpression) {
					srcType = expr.getType$();
					if (srcType != null) {
						expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
					}
				} else {
					if (expr instanceof MapLiteralExpression) {
						srcType = expr.getType$();
						if (srcType != null) {
							expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
						}
					} else {
						if (expr instanceof AsExpression) {
							srcType = expr.getType$();
							if (srcType != null) {
								expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
							}
						} else {
							if (expr instanceof AsNoConvertExpression) {
								srcType = expr.getType$();
								if (srcType != null) {
									expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
								}
							} else {
								if (expr instanceof ClassExpression) {
									srcType = expr.getType$();
									if (srcType != null) {
										expr.setType$LType$(srcType.instantiate$LInstantiationContext$(instantiationContext));
									}
								} else {
									if (expr instanceof LocalExpression) {
										expr.setLocal$LLocalVariable$(expr.getLocal$().getInstantiated$());
									} else {
										if (expr instanceof InstanceofExpression) {
											instanceofExpr = expr;
											instanceofExpr.setExpectedType$LType$(instanceofExpr.getExpectedType$().instantiate$LInstantiationContext$(instantiationContext));
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	};
	return onExpr(this);
};

/**
 * @return {Token}
 */
Expression.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {Type}
 */
Expression.prototype.getHolderType$ = function () {
	return null;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
Expression.prototype.forEachExpression$F$LExpression$B$ = function (cb) {
	var $this = this;
	return this.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, _) {
		return cb(expr);
	}));
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} type
 * @return {!boolean}
 */
Expression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	context.errors.push(new CompileError$LToken$S(token, "left-hand-side expression is not assignable"));
	return false;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} lhsType
 * @param {Type} rhsType
 * @return {!boolean}
 */
Expression.assertIsAssignable$LAnalysisContext$LToken$LType$LType$ = function (context, token, lhsType, rhsType) {
	if (! lhsType.isAssignable$()) {
		context.errors.push(new CompileError$LToken$S(token, "left-hand-side expression is not assignable"));
		return false;
	}
	if (! rhsType.isConvertibleTo$LType$(lhsType)) {
		context.errors.push(new CompileError$LToken$S(token, "cannot assign a value of type '" + rhsType.toString() + "' to '" + lhsType.toString() + "'"));
		return false;
	}
	return true;
};

var Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$ = Expression.assertIsAssignable$LAnalysisContext$LToken$LType$LType$;

/**
 * @param {Type} type
 * @return {Expression}
 */
Expression.getDefaultValueExpressionOf$LType$ = function (type) {
	if (type.equals$LType$(Type.booleanType)) {
		return new BooleanLiteralExpression$LToken$(new Token$SB("false", false));
	} else {
		if (type.equals$LType$(Type.integerType)) {
			return new IntegerLiteralExpression$LToken$(new Token$SB("0", false));
		} else {
			if (type.equals$LType$(Type.numberType)) {
				return new NumberLiteralExpression$LToken$(new Token$SB("0", false));
			} else {
				if (type.equals$LType$(Type.stringType)) {
					return new StringLiteralExpression$LToken$(new Token$SB("\"\"", false));
				} else {
					return new NullExpression$LToken$LType$(new Token$SB("null", false), type);
				}
			}
		}
	}
};

var Expression$getDefaultValueExpressionOf$LType$ = Expression.getDefaultValueExpressionOf$LType$;

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {!string} className
 * @param {Array.<undefined|Type>} typeArguments
 * @return {ClassDefinition}
 */
Expression.instantiateTemplate$LAnalysisContext$LToken$SALType$ = function (context, token, className, typeArguments) {
	return context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest$LToken$SALType$(token, className, typeArguments), context.postInstantiationCallback);
};

var Expression$instantiateTemplate$LAnalysisContext$LToken$SALType$ = Expression.instantiateTemplate$LAnalysisContext$LToken$SALType$;

/**
 * class CommaExpression extends Expression
 * @constructor
 */
function CommaExpression() {
}

CommaExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function CommaExpression$LToken$LExpression$LExpression$(token, expr1, expr2) {
	Expression$LToken$.call(this, token);
	this._expr1 = null;
	this._expr2 = null;
	if (! (expr1 != null)) {
		debugger;
		throw new Error("[src/expression.jsx:2211:21] assertion failure\n        assert expr1 != null;\n                     ^^\n");
	}
	if (! (expr2 != null)) {
		debugger;
		throw new Error("[src/expression.jsx:2212:21] assertion failure\n        assert expr2 != null;\n                     ^^\n");
	}
	this._expr1 = expr1;
	this._expr2 = expr2;
};

CommaExpression$LToken$LExpression$LExpression$.prototype = new CommaExpression;

/**
 * @return {CommaExpression}
 */
CommaExpression.prototype.clone$ = function () {
	return new CommaExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @return {Expression}
 */
CommaExpression.prototype.getFirstExpr$ = function () {
	return this._expr1;
};

/**
 * @return {Expression}
 */
CommaExpression.prototype.getSecondExpr$ = function () {
	return this._expr2;
};

/**
 * @return {*}
 */
CommaExpression.prototype.serialize$ = function () {
	return [ "CommaExpression", this._expr1.serialize$(), this._expr2.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
CommaExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return this._expr1.analyze$LAnalysisContext$LExpression$(context, this) && this._expr2.analyze$LAnalysisContext$LExpression$(context, this);
};

/**
 * @return {Type}
 */
CommaExpression.prototype.getType$ = function () {
	return this._expr2.getType$();
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CommaExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr1, (function (expr) {
		$this._expr1 = expr;
	}))) {
		return false;
	}
	if (! cb(this._expr2, (function (expr) {
		$this._expr2 = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class FunctionExpression extends Expression
 * @constructor
 */
function FunctionExpression() {
}

FunctionExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 * @param {LocalVariable} funcName
 * @param {MemberFunctionDefinition} funcDef
 * @param {!boolean} isStatement
 */
function FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B(token, funcName, funcDef, isStatement) {
	Expression$LToken$.call(this, token);
	this._funcName = funcName;
	this._funcDef = funcDef;
	this._isStatement = isStatement;
};

FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B.prototype = new FunctionExpression;

/**
 * @return {FunctionExpression}
 */
FunctionExpression.prototype.clone$ = function () {
	return new FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B(this._token, this._funcName, this._funcDef, this._isStatement);
};

/**
 * @return {LocalVariable}
 */
FunctionExpression.prototype.getFuncName$ = function () {
	return this._funcName;
};

/**
 * @return {MemberFunctionDefinition}
 */
FunctionExpression.prototype.getFuncDef$ = function () {
	return this._funcDef;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
FunctionExpression.prototype.setFuncDef$LMemberFunctionDefinition$ = function (funcDef) {
	this._funcDef = funcDef;
};

/**
 * @return {!boolean}
 */
FunctionExpression.prototype.isStatement$ = function () {
	return this._isStatement;
};

/**
 * @return {*}
 */
FunctionExpression.prototype.serialize$ = function () {
	return [ "FunctionExpression", this._funcDef.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
FunctionExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this.argumentTypesAreIdentified$()) {
		context.errors.push(new CompileError$LToken$S(this._token, "argument types were not automatically deductable, please specify them by hand"));
		return false;
	}
	this._funcDef.analyze$LAnalysisContext$(context);
	if (this._isStatement) {
		this._funcName.setTypeForced$LType$(this.getType$());
		context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this._funcName);
	}
	return true;
};

/**
 * @return {Type}
 */
FunctionExpression.prototype.getType$ = function () {
	return this._funcDef.getType$();
};

/**
 * @return {!boolean}
 */
FunctionExpression.prototype.argumentTypesAreIdentified$ = function () {
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!number} */
	var i;
	argTypes = this._funcDef.getArgumentTypes$();
	for (i = 0; i < argTypes.length; ++ i) {
		if (argTypes[i] == null) {
			return false;
		}
	}
	return true;
};

/**
 * @return {!boolean}
 */
FunctionExpression.prototype.typesAreIdentified$ = function () {
	if (! this.argumentTypesAreIdentified$()) {
		return false;
	}
	if (this._funcDef.getReturnType$() == null) {
		return false;
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {ResolvedFunctionType} type
 * @return {!boolean}
 */
FunctionExpression.prototype.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$ = function (context, type) {
	if (! this._funcDef.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, type)) {
		return false;
	}
	if (this._funcName != null) {
		if (this._funcName.getType$() != null) {
			if (! this._funcName.getType$().equals$LType$(this._funcDef.getType$())) {
				throw new Error("unmatched type for local function: " + this._funcName.getName$().getValue$());
			}
		} else {
			this._funcName.setType$LType$(this._funcDef.getType$());
		}
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
FunctionExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class ThisExpression extends Expression
 * @constructor
 */
function ThisExpression() {
}

ThisExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 * @param {ClassDefinition} classDef
 */
function ThisExpression$LToken$LClassDefinition$(token, classDef) {
	Expression$LToken$.call(this, token);
	this._classDef = classDef;
};

ThisExpression$LToken$LClassDefinition$.prototype = new ThisExpression;

/**
 * @return {ThisExpression}
 */
ThisExpression.prototype.clone$ = function () {
	return new ThisExpression$LToken$LClassDefinition$(this._token, this._classDef);
};

/**
 * @return {*}
 */
ThisExpression.prototype.serialize$ = function () {
	return [ "ThisExpression", this._token.serialize$(), Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$(this._classDef) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ThisExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {MemberFunctionDefinition} */
	var rootFuncDef;
	rootFuncDef = context.funcDef;
	if (rootFuncDef != null) {
		while (rootFuncDef.getParent$() != null) {
			rootFuncDef = rootFuncDef.getParent$();
		}
	}
	if (rootFuncDef == null || (rootFuncDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot use 'this' outside of a member function"));
		return false;
	}
	this._classDef = rootFuncDef.getClassDef$();
	return true;
};

/**
 * @return {Type}
 */
ThisExpression.prototype.getType$ = function () {
	return new ObjectType$LClassDefinition$(this._classDef);
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ThisExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class MapLiteralExpression extends Expression
 * @constructor
 */
function MapLiteralExpression() {
}

MapLiteralExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 * @param {Array.<undefined|MapLiteralElement>} elements
 * @param {Type} type
 */
function MapLiteralExpression$LToken$ALMapLiteralElement$LType$(token, elements, type) {
	Expression$LToken$.call(this, token);
	this._elements = elements;
	this._type = type;
};

MapLiteralExpression$LToken$ALMapLiteralElement$LType$.prototype = new MapLiteralExpression;

/**
 * @return {MapLiteralExpression}
 */
MapLiteralExpression.prototype.clone$ = function () {
	/** @type {MapLiteralExpression} */
	var ret;
	/** @type {!number} */
	var i;
	ret = new MapLiteralExpression$LToken$ALMapLiteralElement$LType$(this._token, [], this._type);
	for (i = 0; i < this._elements.length; ++ i) {
		ret._elements[i] = new MapLiteralElement$LToken$LExpression$(this._elements[i].getKey$(), this._elements[i].getExpr$().clone$());
	}
	return ret;
};

/**
 * @return {Array.<undefined|MapLiteralElement>}
 */
MapLiteralExpression.prototype.getElements$ = function () {
	return this._elements;
};

/**
 * @return {Type}
 */
MapLiteralExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
MapLiteralExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * @return {*}
 */
MapLiteralExpression.prototype.serialize$ = function () {
	return [ "MapLiteralExpression", this._token.serialize$(), Serializer$MapLiteralElement$E$serializeArray$ALMapLiteralElement$(this._elements), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
MapLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	/** @type {!boolean} */
	var succeeded;
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Type} */
	var expectedType;
	/** @type {Type} */
	var elementType;
	succeeded = true;
	for (i = 0; i < this._elements.length; ++ i) {
		if (! this._elements[i].getExpr$().analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else {
			if (this._elements[i].getExpr$().getType$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot assign void to a hash"));
				succeeded = false;
			}
		}
	}
	if (! succeeded) {
		return false;
	}
	if (this._type != null && this._type == Type.variantType) {
	} else {
		if (this._type != null && this._type instanceof ObjectType) {
			classDef = this._type.getClassDef$();
			if (! (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map")) {
				context.errors.push(new CompileError$LToken$S(this._token, "specified type is not a hash type"));
				return false;
			}
			expectedType = this._type.getTypeArguments$()[0];
			for (i = 0; i < this._elements.length; ++ i) {
				elementType = this._elements[i].getExpr$().getType$();
				if (! elementType.isConvertibleTo$LType$(expectedType)) {
					context.errors.push(new CompileError$LToken$S(this._token, "cannot assign '" + elementType.toString() + "' to a map of '" + expectedType.toString() + "'"));
					succeeded = false;
				}
			}
		} else {
			if (this._type != null) {
				context.errors.push(new CompileError$LToken$S(this._token, "invalid type for a map literal"));
				return false;
			} else {
				elementType = Type$calcLeastCommonAncestor$ALType$B(this._elements.map((function (elt) {
					return elt.getExpr$().getType$();
				})), true);
				if (elementType == null || elementType.equals$LType$(Type.nullType)) {
					context.errors.push(new CompileError$LToken$S(this._token, "could not deduce hash type, please specify"));
					return false;
				}
				if (elementType.equals$LType$(Type.integerType)) {
					elementType = Type.numberType;
				}
				elementType = elementType.resolveIfNullable$();
				this._type = new ObjectType$LClassDefinition$(Expression$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Map", [ elementType ]));
			}
		}
	}
	return succeeded;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
MapLiteralExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	/** @type {!number} */
	var i;
	for (i = 0; i < this._elements.length; ++ i) {
		if (! cb(this._elements[i].getExpr$(), (function (elements, index) {
			return (function (expr) {
				elements[index].setExpr$LExpression$(expr);
			});
		})(this._elements, i))) {
			return false;
		}
	}
	return true;
};

/**
 * class ArrayLiteralExpression extends Expression
 * @constructor
 */
function ArrayLiteralExpression() {
}

ArrayLiteralExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 * @param {Array.<undefined|Expression>} exprs
 * @param {Type} type
 */
function ArrayLiteralExpression$LToken$ALExpression$LType$(token, exprs, type) {
	Expression$LToken$.call(this, token);
	this._exprs = exprs;
	this._type = type;
};

ArrayLiteralExpression$LToken$ALExpression$LType$.prototype = new ArrayLiteralExpression;

/**
 * @return {ArrayLiteralExpression}
 */
ArrayLiteralExpression.prototype.clone$ = function () {
	return new ArrayLiteralExpression$LToken$ALExpression$LType$(this._token, Cloner$Expression$E$cloneArray$ALExpression$(this._exprs), this._type);
};

/**
 * @return {Array.<undefined|Expression>}
 */
ArrayLiteralExpression.prototype.getExprs$ = function () {
	return this._exprs;
};

/**
 * @return {Type}
 */
ArrayLiteralExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
ArrayLiteralExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * @return {*}
 */
ArrayLiteralExpression.prototype.serialize$ = function () {
	return [ "ArrayLiteralExpression", this._token.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._exprs), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ArrayLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	/** @type {!boolean} */
	var succeeded;
	/** @type {!number} */
	var i;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Type} */
	var expectedType;
	/** @type {Type} */
	var elementType;
	succeeded = true;
	for (i = 0; i < this._exprs.length; ++ i) {
		if (! this._exprs[i].analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else {
			if (this._exprs[i].getType$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot assign void to an array"));
				succeeded = false;
			}
		}
	}
	if (! succeeded) {
		return false;
	}
	if (this._type != null) {
		if (this._type instanceof ObjectType && (classDef = this._type.getClassDef$()) instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Array") {
		} else {
			context.errors.push(new CompileError$LToken$S(this._token, "the type specified after ':' is not an array type"));
			return false;
		}
		expectedType = this._type.getClassDef$().getTypeArguments$()[0].toNullableType$();
		for (i = 0; i < this._exprs.length; ++ i) {
			elementType = this._exprs[i].getType$();
			if (! elementType.isConvertibleTo$LType$(expectedType)) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot assign '" + elementType.toString() + "' to an array of '" + expectedType.toString() + "'"));
				succeeded = false;
			}
		}
	} else {
		elementType = Type$calcLeastCommonAncestor$ALType$B(this._exprs.map((function (expr) {
			return expr.getType$();
		})), true);
		if (elementType == null || elementType.equals$LType$(Type.nullType)) {
			context.errors.push(new CompileError$LToken$S(this._token, "could not deduce array type, please specify"));
			return false;
		}
		if (elementType.equals$LType$(Type.integerType)) {
			elementType = Type.numberType;
		}
		elementType = elementType.resolveIfNullable$();
		this._type = new ObjectType$LClassDefinition$(Expression$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Array", [ elementType ]));
	}
	return succeeded;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ArrayLiteralExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._exprs)) {
		return false;
	}
	return true;
};

/**
 * class OperatorExpression extends Expression
 * @constructor
 */
function OperatorExpression() {
}

OperatorExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 */
function OperatorExpression$LToken$(token) {
	Expression$LToken$.call(this, token);
};

OperatorExpression$LToken$.prototype = new OperatorExpression;

/**
 * @constructor
 * @param {Expression} that
 */
function OperatorExpression$LExpression$(that) {
	Expression$LExpression$.call(this, that);
};

OperatorExpression$LExpression$.prototype = new OperatorExpression;

/**
 * @param {AnalysisContext} context
 * @param {Expression} expr
 * @param {Type} type
 * @param {!boolean} mayUnbox
 * @return {!boolean}
 */
OperatorExpression.prototype.isConvertibleTo$LAnalysisContext$LExpression$LType$B = function (context, expr, type, mayUnbox) {
	/** @type {Type} */
	var exprType;
	exprType = expr.getType$().resolveIfNullable$();
	if (mayUnbox && type instanceof PrimitiveType && exprType instanceof ObjectType && exprType.getClassDef$() == type.getClassDef$()) {
		return true;
	}
	return exprType.isConvertibleTo$LType$(type);
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} expr
 * @param {Type} type
 * @param {!boolean} mayUnbox
 * @return {!boolean}
 */
OperatorExpression.prototype.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B = function (context, expr, type, mayUnbox) {
	if (! this.isConvertibleTo$LAnalysisContext$LExpression$LType$B(context, expr, type, mayUnbox)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '" + this._token.getValue$() + "' to type '" + expr.getType$().toString() + "'"));
		return false;
	}
	return true;
};

/**
 * class NewExpression extends OperatorExpression
 * @constructor
 */
function NewExpression() {
}

NewExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} type
 * @param {Array.<undefined|Expression>} args
 */
function NewExpression$LToken$LType$ALExpression$(token, type, args) {
	OperatorExpression$LToken$.call(this, token);
	this._type = type;
	this._args = args;
	this._constructor = null;
};

NewExpression$LToken$LType$ALExpression$.prototype = new NewExpression;

/**
 * @constructor
 * @param {NewExpression} that
 */
function NewExpression$LNewExpression$(that) {
	OperatorExpression$LExpression$.call(this, that);
	this._type = that._type;
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
	this._constructor = that._constructor;
};

NewExpression$LNewExpression$.prototype = new NewExpression;

/**
 * @return {NewExpression}
 */
NewExpression.prototype.clone$ = function () {
	return new NewExpression$LNewExpression$(this);
};

/**
 * @return {QualifiedName}
 */
NewExpression.prototype.getQualifiedName$ = function () {
	throw new Error("will be removed");
};

/**
 * @return {Array.<undefined|Expression>}
 */
NewExpression.prototype.getArguments$ = function () {
	return this._args;
};

/**
 * @return {*}
 */
NewExpression.prototype.serialize$ = function () {
	return [ "NewExpression", this._token.serialize$(), this._type.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
NewExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {FunctionType} */
	var ctors;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	if (! (this._type instanceof ObjectType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot instantiate a non-object type: " + this._type.toString()));
		return false;
	}
	classDef = this._type.getClassDef$();
	if (classDef == null) {
		return false;
	}
	if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot instantiate an interface or a mixin"));
		return false;
	}
	if ((classDef.flags$() & ClassDefinition.IS_ABSTRACT) !== 0) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot instantiate an abstract class"));
		return false;
	}
	ctors = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "constructor", false, [], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
	if (ctors == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "the class cannot be instantiated"));
		return false;
	}
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, this, ctors.getExpectedTypes$NB(this._args.length, false));
	if (argTypes == null) {
		return false;
	}
	if ((this._constructor = ctors.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, false)) == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot create an object of type '" + this._type.toString() + "', arguments mismatch"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
NewExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
NewExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * @return {ResolvedFunctionType}
 */
NewExpression.prototype.getConstructor$ = function () {
	return this._constructor;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
NewExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};

/**
 * class SuperExpression extends OperatorExpression
 * @constructor
 */
function SuperExpression() {
}

SuperExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {Token} name
 * @param {Array.<undefined|Expression>} args
 */
function SuperExpression$LToken$LToken$ALExpression$(token, name, args) {
	OperatorExpression$LToken$.call(this, token);
	this._classDef = null;
	this._name = name;
	this._args = args;
	this._funcType = null;
};

SuperExpression$LToken$LToken$ALExpression$.prototype = new SuperExpression;

/**
 * @constructor
 * @param {SuperExpression} that
 */
function SuperExpression$LSuperExpression$(that) {
	OperatorExpression$LExpression$.call(this, that);
	this._classDef = null;
	this._name = that._name;
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
	this._funcType = that._funcType;
};

SuperExpression$LSuperExpression$.prototype = new SuperExpression;

/**
 * @return {SuperExpression}
 */
SuperExpression.prototype.clone$ = function () {
	return new SuperExpression$LSuperExpression$(this);
};

/**
 * @return {Token}
 */
SuperExpression.prototype.getName$ = function () {
	return this._name;
};

/**
 * @return {Array.<undefined|Expression>}
 */
SuperExpression.prototype.getArguments$ = function () {
	return this._args;
};

/**
 * @return {FunctionType}
 */
SuperExpression.prototype.getFunctionType$ = function () {
	return this._funcType;
};

/**
 * @return {*}
 */
SuperExpression.prototype.serialize$ = function () {
	return [ "SuperExpression", this._token.serialize$(), this._name.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args), Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$(this._classDef) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
SuperExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {FunctionType} */
	var funcType;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	if ((context.funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot use 'super' keyword in a static function"));
		return false;
	}
	classDef = context.funcDef.getClassDef$();
	funcType = null;
	if ((funcType = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, this._name.getValue$(), false, [], ClassDefinition.GET_MEMBER_MODE_SUPER)) == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "could not find a member function with given name in super classes of class '" + classDef.className$() + "'"));
		return false;
	}
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, this, funcType.getExpectedTypes$NB(this._args.length, false));
	if (argTypes == null) {
		return false;
	}
	if ((funcType = funcType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, false)) == null) {
		return false;
	}
	this._funcType = funcType;
	return true;
};

/**
 * @return {Type}
 */
SuperExpression.prototype.getType$ = function () {
	return this._funcType.getReturnType$();
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
SuperExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};

/**
 * class CallExpression extends OperatorExpression
 * @constructor
 */
function CallExpression() {
}

CallExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {Expression} expr
 * @param {Array.<undefined|Expression>} args
 */
function CallExpression$LToken$LExpression$ALExpression$(token, expr, args) {
	OperatorExpression$LToken$.call(this, token);
	this._expr = expr;
	this._args = args;
};

CallExpression$LToken$LExpression$ALExpression$.prototype = new CallExpression;

/**
 * @constructor
 * @param {CallExpression} that
 */
function CallExpression$LCallExpression$(that) {
	OperatorExpression$LExpression$.call(this, that);
	this._expr = that._expr.clone$();
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
};

CallExpression$LCallExpression$.prototype = new CallExpression;

/**
 * @return {CallExpression}
 */
CallExpression.prototype.clone$ = function () {
	return new CallExpression$LCallExpression$(this);
};

/**
 * @return {Expression}
 */
CallExpression.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
CallExpression.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {Array.<undefined|Expression>}
 */
CallExpression.prototype.getArguments$ = function () {
	return this._args;
};

/**
 * @return {*}
 */
CallExpression.prototype.serialize$ = function () {
	return [ "CallExpression", this._token.serialize$(), this._expr.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
CallExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	/** @type {Array.<undefined|Type>} */
	var argTypes;
	/** @type {!boolean} */
	var isCallingStatic;
	if (! this._expr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	exprType = this._expr.getType$().resolveIfNullable$();
	if (! (exprType instanceof FunctionType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot call a non-function"));
		return false;
	}
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, this, exprType.getExpectedTypes$NB(this._args.length, ! (this._expr instanceof PropertyExpression && ! exprType.isAssignable$() && ! (this._expr.getExpr$() instanceof ClassExpression))));
	if (argTypes == null) {
		return false;
	}
	if (this._expr instanceof PropertyExpression && ! exprType.isAssignable$()) {
		isCallingStatic = this._expr.getExpr$() instanceof ClassExpression;
		if (! isCallingStatic && this._expr.getIdentifierToken$().getValue$() === "constructor") {
			context.errors.push(new CompileError$LToken$S(this._token, "cannot call a constructor other than by using 'new'"));
			return false;
		}
		if (this._expr.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, isCallingStatic) == null) {
			return false;
		}
	} else {
		if (exprType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, true) == null) {
			return false;
		}
	}
	return true;
};

/**
 * @return {Type}
 */
CallExpression.prototype.getType$ = function () {
	/** @type {Type} */
	var type;
	type = this._expr.getType$();
	if (type == null) {
		return null;
	}
	return type.resolveIfNullable$().getReturnType$();
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
CallExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};

/**
 * class ConditionalExpression extends OperatorExpression
 * @constructor
 */
function ConditionalExpression() {
}

ConditionalExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} condExpr
 * @param {Expression} ifTrueExpr
 * @param {Expression} ifFalseExpr
 */
function ConditionalExpression$LToken$LExpression$LExpression$LExpression$(operatorToken, condExpr, ifTrueExpr, ifFalseExpr) {
	ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$.call(this, operatorToken, condExpr, ifTrueExpr, ifFalseExpr, null);
};

ConditionalExpression$LToken$LExpression$LExpression$LExpression$.prototype = new ConditionalExpression;

/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} condExpr
 * @param {Expression} ifTrueExpr
 * @param {Expression} ifFalseExpr
 * @param {Type} type
 */
function ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$(operatorToken, condExpr, ifTrueExpr, ifFalseExpr, type) {
	OperatorExpression$LToken$.call(this, operatorToken);
	this._condExpr = condExpr;
	this._ifTrueExpr = ifTrueExpr;
	this._ifFalseExpr = ifFalseExpr;
	this._type = (type != null ? type : null);
};

ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$.prototype = new ConditionalExpression;

/**
 * @return {ConditionalExpression}
 */
ConditionalExpression.prototype.clone$ = function () {
	return new ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$(this._token, this._condExpr.clone$(), this._ifTrueExpr != null ? this._ifTrueExpr.clone$() : null, this._ifFalseExpr.clone$(), this._type);
};

/**
 * @return {Expression}
 */
ConditionalExpression.prototype.getCondExpr$ = function () {
	return this._condExpr;
};

/**
 * @param {Expression} expr
 */
ConditionalExpression.prototype.setCondExpr$LExpression$ = function (expr) {
	this._condExpr = expr;
};

/**
 * @return {Expression}
 */
ConditionalExpression.prototype.getIfTrueExpr$ = function () {
	return this._ifTrueExpr;
};

/**
 * @return {Expression}
 */
ConditionalExpression.prototype.getIfFalseExpr$ = function () {
	return this._ifFalseExpr;
};

/**
 * @return {*}
 */
ConditionalExpression.prototype.serialize$ = function () {
	return [ "ConditionalExpression", this._token.serialize$(), this._condExpr.serialize$(), Serializer$Expression$E$serializeNullable$LExpression$(this._ifTrueExpr), this._ifFalseExpr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ConditionalExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var typeIfTrue;
	/** @type {Type} */
	var typeIfFalse;
	if (! this._condExpr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._ifTrueExpr != null && ! this._ifTrueExpr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (! this._ifFalseExpr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._condExpr.getType$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "condition cannot be void"));
		return false;
	}
	if (this._ifTrueExpr != null) {
		typeIfTrue = this._ifTrueExpr.getType$();
	} else {
		typeIfTrue = this._condExpr.getType$();
	}
	typeIfFalse = this._ifFalseExpr.getType$();
	this._type = Type$calcLeastCommonAncestor$LType$LType$(typeIfTrue, typeIfFalse);
	if (this._type == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "could not get the join type of '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
ConditionalExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
ConditionalExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._condExpr, (function (expr) {
		$this._condExpr = expr;
	}))) {
		return false;
	}
	if (this._ifTrueExpr != null && ! cb(this._ifTrueExpr, (function (expr) {
		$this._ifTrueExpr = expr;
	}))) {
		return false;
	}
	if (! cb(this._ifFalseExpr, (function (expr) {
		$this._ifFalseExpr = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class BinaryExpression extends OperatorExpression
 * @constructor
 */
function BinaryExpression() {
}

BinaryExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function BinaryExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	OperatorExpression$LToken$.call(this, operatorToken);
	this._expr1 = expr1;
	this._expr2 = expr2;
};

BinaryExpression$LToken$LExpression$LExpression$.prototype = new BinaryExpression;

/**
 * @return {Expression}
 */
BinaryExpression.prototype.getFirstExpr$ = function () {
	return this._expr1;
};

/**
 * @param {Expression} expr
 */
BinaryExpression.prototype.setFirstExpr$LExpression$ = function (expr) {
	this._expr1 = expr;
};

/**
 * @return {Expression}
 */
BinaryExpression.prototype.getSecondExpr$ = function () {
	return this._expr2;
};

/**
 * @param {Expression} expr
 */
BinaryExpression.prototype.setSecondExpr$LExpression$ = function (expr) {
	this._expr2 = expr;
};

/**
 * @return {*}
 */
BinaryExpression.prototype.serialize$ = function () {
	return [ "BinaryExpression", this._token.serialize$(), this._expr1.serialize$(), this._expr2.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
BinaryExpression.prototype._analyze$LAnalysisContext$ = function (context) {
	if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (! this._expr2.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
BinaryExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr1, (function (expr) {
		$this._expr1 = expr;
	}))) {
		return false;
	}
	if (! cb(this._expr2, (function (expr) {
		$this._expr2 = expr;
	}))) {
		return false;
	}
	return true;
};

/**
 * class ShiftExpression extends BinaryExpression
 * @constructor
 */
function ShiftExpression() {
}

ShiftExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function ShiftExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

ShiftExpression$LToken$LExpression$LExpression$.prototype = new ShiftExpression;

/**
 * @return {ShiftExpression}
 */
ShiftExpression.prototype.clone$ = function () {
	return new ShiftExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ShiftExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr1, Type.integerType, true)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr2, Type.integerType, true)) {
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
ShiftExpression.prototype.getType$ = function () {
	return Type.integerType;
};

/**
 * class LogicalExpression extends BinaryExpression
 * @constructor
 */
function LogicalExpression() {
}

LogicalExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function LogicalExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

LogicalExpression$LToken$LExpression$LExpression$.prototype = new LogicalExpression;

/**
 * @return {LogicalExpression}
 */
LogicalExpression.prototype.clone$ = function () {
	return new LogicalExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
LogicalExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr1.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "left argument of operator '" + this._token.getValue$() + "' cannot be void"));
		return false;
	}
	if (this._expr2.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "right argument of operator '" + this._token.getValue$() + "' cannot be void"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
LogicalExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class InExpression extends BinaryExpression
 * @constructor
 */
function InExpression() {
}

InExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function InExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

InExpression$LToken$LExpression$LExpression$.prototype = new InExpression;

/**
 * @return {InExpression}
 */
InExpression.prototype.clone$ = function () {
	return new InExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
InExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var expr2Type;
	/** @type {ClassDefinition} */
	var expr2ClassDef;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this._expr1.getType$().resolveIfNullable$().equals$LType$(Type.stringType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "left operand of 'in' expression should be a string"));
		return false;
	}
	if ((expr2Type = this._expr2.getType$().resolveIfNullable$()) instanceof ObjectType && (expr2ClassDef = expr2Type.getClassDef$()) instanceof InstantiatedClassDefinition && expr2ClassDef.getTemplateClassName$() === "Map") {
	} else {
		context.errors.push(new CompileError$LToken$S(this._token, "right operand of 'in' expression should be a map"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
InExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class EqualityExpression extends BinaryExpression
 * @constructor
 */
function EqualityExpression() {
}

EqualityExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function EqualityExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

EqualityExpression$LToken$LExpression$LExpression$.prototype = new EqualityExpression;

/**
 * @return {EqualityExpression}
 */
EqualityExpression.prototype.clone$ = function () {
	return new EqualityExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
EqualityExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	/** @type {*} */
	var bool;
	/** @type {Type} */
	var expr1Type;
	/** @type {Type} */
	var expr2Type;
	function bool(x) {
		return (x ? 1 : 0);
	};
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	expr1Type = this._expr1.getType$();
	expr2Type = this._expr2.getType$();
	if (expr1Type.resolveIfNullable$().equals$LType$(expr2Type.resolveIfNullable$())) {
	} else {
		if (expr1Type.isConvertibleTo$LType$(expr2Type) || expr2Type.isConvertibleTo$LType$(expr1Type)) {
		} else {
			if (bool(expr1Type instanceof ObjectType) + bool(expr2Type instanceof ObjectType) === 1 && expr1Type.getClassDef$() == expr2Type.getClassDef$()) {
			} else {
				context.errors.push(new CompileError$LToken$S(this._token, "either side of operator == should be convertible from the other"));
				return false;
			}
		}
	}
	return true;
};

/**
 * @return {Type}
 */
EqualityExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class BinaryNumberExpression extends BinaryExpression
 * @constructor
 */
function BinaryNumberExpression() {
}

BinaryNumberExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function BinaryNumberExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

BinaryNumberExpression$LToken$LExpression$LExpression$.prototype = new BinaryNumberExpression;

/**
 * @return {BinaryNumberExpression}
 */
BinaryNumberExpression.prototype.clone$ = function () {
	return new BinaryNumberExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
BinaryNumberExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var expr1Type;
	/** @type {Type} */
	var expr2Type;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	switch (this._token.getValue$()) {
	case "<":
	case "<=":
	case ">":
	case ">=":
		if (this.isConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr1, Type.numberType, true)) {
			return this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr2, Type.numberType, true);
		}
		if (this.isConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr1, Type.stringType, true)) {
			return this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr2, Type.stringType, true);
		}
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '" + this._token.getValue$() + "' to type '" + this._expr1.getType$().toString() + "'"));
		return false;
	default:
		expr1Type = this._expr1.getType$().resolveIfNullable$();
		if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr1, Type.numberType, true)) {
			return false;
		}
		expr2Type = this._expr2.getType$().resolveIfNullable$();
		if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr2, Type.numberType, true)) {
			return false;
		}
		return true;
	}
};

/**
 * @return {Type}
 */
BinaryNumberExpression.prototype.getType$ = function () {
	switch (this._token.getValue$()) {
	case "+":
	case "-":
	case "*":
		if (this._expr1.getType$().resolveIfNullable$().equals$LType$(Type.numberType) || this._expr2.getType$().resolveIfNullable$().equals$LType$(Type.numberType)) {
			return Type.numberType;
		} else {
			return Type.integerType;
		}
	case "/":
	case "%":
		return Type.numberType;
	case "<":
	case "<=":
	case ">":
	case ">=":
		return Type.booleanType;
	case "&":
	case "|":
	case "^":
		return Type.integerType;
	default:
		throw new Error("unexpected operator:" + this._token.getValue$());
	}
};

/**
 * class AssignmentExpression extends BinaryExpression
 * @constructor
 */
function AssignmentExpression() {
}

AssignmentExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function AssignmentExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
};

AssignmentExpression$LToken$LExpression$LExpression$.prototype = new AssignmentExpression;

/**
 * @return {AssignmentExpression}
 */
AssignmentExpression.prototype.clone$ = function () {
	return new AssignmentExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
AssignmentExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var rhsType;
	/** @type {Type} */
	var lhsType;
	if (this._expr2 instanceof FunctionExpression) {
		return this._analyzeFunctionExpressionAssignment$LAnalysisContext$LExpression$(context, parentExpr);
	}
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._token.getValue$() !== "=") {
		return this._analyzeFusedAssignment$LAnalysisContext$(context);
	}
	rhsType = this._expr2.getType$();
	if (rhsType == null) {
		return false;
	}
	if (rhsType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot assign void"));
		return false;
	}
	if (this._expr2 instanceof ClassExpression) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot assign a class"));
		return false;
	}
	if (rhsType.resolveIfNullable$().equals$LType$(Type.nullType) && this._expr1.getType$() == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot assign null to an unknown type"));
		return false;
	}
	if (rhsType instanceof FunctionChoiceType) {
		lhsType = this._expr1.getType$();
		if (lhsType != null) {
			if (! (lhsType instanceof ResolvedFunctionType)) {
				context.errors.push(new CompileError$LToken$S(this._token, "cannot assign a function reference to '" + this._expr1.getType$().toString() + "'"));
				return false;
			}
			if ((rhsType = this._expr2.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, lhsType.getArgumentTypes$(), lhsType instanceof StaticFunctionType)) == null) {
				return false;
			}
		} else {
			context.errors.push(new CompileError$LToken$S(this._token, "function reference is ambiguous"));
			return false;
		}
	}
	if (rhsType instanceof MemberFunctionType) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot assign a member function"));
		return false;
	}
	if (! this._expr1.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, rhsType)) {
		return false;
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
AssignmentExpression.prototype._analyzeFusedAssignment$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var lhsType;
	/** @type {Type} */
	var rhsType;
	lhsType = this._expr1.getType$().resolveIfNullable$();
	rhsType = this._expr2.getType$().resolveIfNullable$();
	if (! this._expr1.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, lhsType)) {
		return false;
	}
	if (this._token.getValue$() === "+=" && lhsType.equals$LType$(Type.stringType) && rhsType.equals$LType$(Type.stringType)) {
		return true;
	}
	if (Type$isIntegerOrNumber$LType$(lhsType) && Type$isIntegerOrNumber$LType$(rhsType)) {
		return true;
	}
	context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '" + this._token.getValue$() + "' against '" + this._expr1.getType$().toString() + "' and '" + this._expr2.getType$().toString() + "'"));
	return false;
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
AssignmentExpression.prototype._analyzeFunctionExpressionAssignment$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._expr1.getType$() == null) {
		if (! this._expr2.typesAreIdentified$()) {
			context.errors.push(new CompileError$LToken$S(this._token, "either side of the operator should be fully type-qualified : " + (this._expr2.argumentTypesAreIdentified$() ? "return type not declared" : "argument / return types not declared")));
			return false;
		}
	} else {
		if (! this._expr1.getType$().equals$LType$(Type.variantType)) {
			if (! this._expr2.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, this._expr1.getType$())) {
				return false;
			}
		}
	}
	if (! this._expr1.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, this._expr2.getType$())) {
		return false;
	}
	if (! this._expr2.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
AssignmentExpression.prototype.getType$ = function () {
	return this._expr1.getType$();
};

/**
 * class ArrayExpression extends BinaryExpression
 * @constructor
 */
function ArrayExpression() {
}

ArrayExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function ArrayExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
	this._type = null;
};

ArrayExpression$LToken$LExpression$LExpression$.prototype = new ArrayExpression;

/**
 * @return {ArrayExpression}
 */
ArrayExpression.prototype.clone$ = function () {
	/** @type {ArrayExpression} */
	var ret;
	ret = new ArrayExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
	ret._type = this._type;
	return ret;
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ArrayExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var expr1Type;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr1.getType$() == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot determine type due to preceding errors"));
		return false;
	}
	expr1Type = this._expr1.getType$().resolveIfNullable$();
	if (expr1Type instanceof ObjectType) {
		return this._analyzeApplicationOnObject$LAnalysisContext$LType$(context, expr1Type);
	} else {
		if (expr1Type.equals$LType$(Type.variantType)) {
			return this._analyzeApplicationOnVariant$LAnalysisContext$(context);
		}
	}
	context.errors.push(new CompileError$LToken$S(this._token, "cannot apply []; the operator is only applicable against an array or an variant"));
	return false;
};

/**
 * @param {AnalysisContext} context
 * @param {Type} expr1Type
 * @return {!boolean}
 */
ArrayExpression.prototype._analyzeApplicationOnObject$LAnalysisContext$LType$ = function (context, expr1Type) {
	/** @type {ClassDefinition} */
	var expr1ClassDef;
	/** @type {FunctionType} */
	var funcType;
	/** @type {ResolvedFunctionType} */
	var deducedFuncType;
	expr1ClassDef = expr1Type.getClassDef$();
	if (! (expr1ClassDef)) {
		debugger;
		throw new Error("[src/expression.jsx:1500:15] assertion failure\n        assert expr1ClassDef;\n               ^^^^^^^^^^^^^\n");
	}
	funcType = expr1ClassDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "__native_index_operator__", false, [], ClassDefinition.GET_MEMBER_MODE_ALL);
	if (funcType == null) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator[] on an instance of class '" + expr1ClassDef.className$() + "'"));
		return false;
	}
	deducedFuncType = funcType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, [ this._expr2.getType$() ], false);
	if (deducedFuncType == null) {
		return false;
	}
	this._type = deducedFuncType.getReturnType$();
	return true;
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
ArrayExpression.prototype._analyzeApplicationOnVariant$LAnalysisContext$ = function (context) {
	/** @type {Type} */
	var expr2Type;
	expr2Type = this._expr2.getType$().resolveIfNullable$();
	if (! (expr2Type.equals$LType$(Type.stringType) || expr2Type.isConvertibleTo$LType$(Type.numberType))) {
		context.errors.push(new CompileError$LToken$S(this._token, "the argument of variant[] should be a string or a number"));
		return false;
	}
	this._type = Type.variantType;
	return true;
};

/**
 * @return {Type}
 */
ArrayExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} type
 * @return {!boolean}
 */
ArrayExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	return Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$(context, token, this._type, type);
};

/**
 * class AdditiveExpression extends BinaryExpression
 * @constructor
 */
function AdditiveExpression() {
}

AdditiveExpression.prototype = new BinaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Expression} expr2
 */
function AdditiveExpression$LToken$LExpression$LExpression$(operatorToken, expr1, expr2) {
	BinaryExpression$LToken$LExpression$LExpression$.call(this, operatorToken, expr1, expr2);
	this._type = null;
};

AdditiveExpression$LToken$LExpression$LExpression$.prototype = new AdditiveExpression;

/**
 * @return {AdditiveExpression}
 */
AdditiveExpression.prototype.clone$ = function () {
	/** @type {AdditiveExpression} */
	var ret;
	ret = new AdditiveExpression$LToken$LExpression$LExpression$(this._token, this._expr1.clone$(), this._expr2.clone$());
	ret._type = this._type;
	return ret;
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
AdditiveExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var expr1Type;
	/** @type {Type} */
	var expr2Type;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	expr1Type = this._expr1.getType$().resolveIfNullable$();
	expr2Type = this._expr2.getType$().resolveIfNullable$();
	if ((expr1Type.isConvertibleTo$LType$(Type.numberType) || expr1Type instanceof ObjectType && expr1Type.getClassDef$() == Type.numberType.getClassDef$()) && (expr2Type.isConvertibleTo$LType$(Type.numberType) || expr2Type instanceof ObjectType && expr2Type.getClassDef$() == Type.numberType.getClassDef$())) {
		this._type = (expr1Type instanceof NumberType || expr2Type instanceof NumberType ? Type.numberType : Type.integerType);
	} else {
		if ((expr1Type.equals$LType$(Type.stringType) || expr1Type instanceof ObjectType && expr1Type.getClassDef$() == Type.stringType.getClassDef$()) && (expr2Type.equals$LType$(Type.stringType) || expr2Type instanceof ObjectType && expr2Type.getClassDef$() == Type.stringType.getClassDef$())) {
			this._type = expr1Type;
		} else {
			context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
	}
	return true;
};

/**
 * @return {Type}
 */
AdditiveExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * class UnaryExpression extends OperatorExpression
 * @constructor
 */
function UnaryExpression() {
}

UnaryExpression.prototype = new OperatorExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function UnaryExpression$LToken$LExpression$(operatorToken, expr) {
	OperatorExpression$LToken$.call(this, operatorToken);
	this._expr = expr;
};

UnaryExpression$LToken$LExpression$.prototype = new UnaryExpression;

/**
 * @return {Expression}
 */
UnaryExpression.prototype.getExpr$ = function () {
	return this._expr;
};

/**
 * @param {Expression} expr
 */
UnaryExpression.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};

/**
 * @return {*}
 */
UnaryExpression.prototype.serialize$ = function () {
	return [ "UnaryExpression", this._token.serialize$(), this._expr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @return {!boolean}
 */
UnaryExpression.prototype._analyze$LAnalysisContext$ = function (context) {
	if (! this._expr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._expr.getType$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '" + this._token.getValue$() + "' against void"));
		return false;
	}
	return true;
};

/**
 * @param {*} cb
 * @return {!boolean}
 */
UnaryExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	return cb(this._expr, (function (expr) {
		$this._expr = expr;
	}));
};

/**
 * class SignExpression extends UnaryExpression
 * @constructor
 */
function SignExpression() {
}

SignExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function SignExpression$LToken$LExpression$(operatorToken, expr) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

SignExpression$LToken$LExpression$.prototype = new SignExpression;

/**
 * @return {SignExpression}
 */
SignExpression.prototype.clone$ = function () {
	return new SignExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
SignExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr, Type.numberType, true)) {
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
SignExpression.prototype.getType$ = function () {
	/** @type {Type} */
	var type;
	type = this._expr.getType$();
	if (type.resolveIfNullable$().equals$LType$(Type.numberType)) {
		return Type.numberType;
	} else {
		return Type.integerType;
	}
};

/**
 * class TypeofExpression extends UnaryExpression
 * @constructor
 */
function TypeofExpression() {
}

TypeofExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function TypeofExpression$LToken$LExpression$(operatorToken, expr) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

TypeofExpression$LToken$LExpression$.prototype = new TypeofExpression;

/**
 * @return {TypeofExpression}
 */
TypeofExpression.prototype.clone$ = function () {
	return new TypeofExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
TypeofExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (! exprType.equals$LType$(Type.variantType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator 'typeof' to '" + this._expr.getType$().toString() + "'"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
TypeofExpression.prototype.getType$ = function () {
	return Type.stringType;
};

/**
 * class PropertyExpression extends UnaryExpression
 * @constructor
 */
function PropertyExpression() {
}

PropertyExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Token} identifierToken
 * @param {Array.<undefined|Type>} typeArgs
 */
function PropertyExpression$LToken$LExpression$LToken$ALType$(operatorToken, expr1, identifierToken, typeArgs) {
	PropertyExpression$LToken$LExpression$LToken$ALType$LType$.call(this, operatorToken, expr1, identifierToken, typeArgs, null);
};

PropertyExpression$LToken$LExpression$LToken$ALType$.prototype = new PropertyExpression;

/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr1
 * @param {Token} identifierToken
 * @param {Array.<undefined|Type>} typeArgs
 * @param {Type} type
 */
function PropertyExpression$LToken$LExpression$LToken$ALType$LType$(operatorToken, expr1, identifierToken, typeArgs, type) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr1);
	this._identifierToken = identifierToken;
	this._typeArgs = typeArgs;
	this._type = (type != null ? type : null);
};

PropertyExpression$LToken$LExpression$LToken$ALType$LType$.prototype = new PropertyExpression;

/**
 * @return {PropertyExpression}
 */
PropertyExpression.prototype.clone$ = function () {
	return new PropertyExpression$LToken$LExpression$LToken$ALType$LType$(this._token, this._expr.clone$(), this._identifierToken, this._typeArgs, this._type);
};

/**
 * @return {Token}
 */
PropertyExpression.prototype.getIdentifierToken$ = function () {
	return this._identifierToken;
};

/**
 * @return {Array.<undefined|Type>}
 */
PropertyExpression.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};

/**
 * @return {*}
 */
PropertyExpression.prototype.serialize$ = function () {
	return [ "PropertyExpression", this._expr.serialize$(), this._identifierToken.serialize$(), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
PropertyExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	/** @type {ClassDefinition} */
	var classDef;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._identifierToken, "cannot obtain a member of void"));
		return false;
	}
	if (exprType.equals$LType$(Type.nullType)) {
		context.errors.push(new CompileError$LToken$S(this._identifierToken, "cannot obtain a member of null"));
		return false;
	}
	if (exprType.resolveIfNullable$().equals$LType$(Type.variantType)) {
		context.errors.push(new CompileError$LToken$S(this._identifierToken, "property of a variant should be referred to by using the [] operator"));
		return false;
	}
	classDef = exprType.getClassDef$();
	if (classDef == null) {
		context.errors.push(new CompileError$LToken$S(this._identifierToken, "cannot determine type due to preceding errors"));
		return false;
	}
	this._type = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._identifierToken, this._identifierToken.getValue$(), this._expr instanceof ClassExpression, this._typeArgs, this._expr instanceof ClassExpression ? ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY : ClassDefinition.GET_MEMBER_MODE_ALL);
	if (this._type == null) {
		context.errors.push(new CompileError$LToken$S(this._identifierToken, "'" + exprType.toString() + "' does not have a property named '" + this._identifierToken.getValue$() + "'"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
PropertyExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @return {Type}
 */
PropertyExpression.prototype.getHolderType$ = function () {
	/** @type {Type} */
	var type;
	type = this._expr.getType$();
	if (type instanceof PrimitiveType) {
		type = new ObjectType$LClassDefinition$(type.getClassDef$());
	}
	return type;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} type
 * @return {!boolean}
 */
PropertyExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	var $this = this;
	/** @type {Type} */
	var holderType;
	/** @type {!number} */
	var varFlags;
	if (! Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$(context, token, this._type, type)) {
		return false;
	}
	holderType = this.getHolderType$();
	varFlags = 0;
	if (! holderType.equals$LType$(Type.variantType)) {
		if (holderType.getClassDef$().forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			return classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
				if (varDef.name$() === $this._identifierToken.getValue$()) {
					varFlags = varDef.flags$();
					return false;
				}
				return true;
			}));
		}))) {
			throw new Error("logic flaw, could not find definition for " + holderType.getClassDef$().className$() + "#" + this._identifierToken.getValue$());
		}
	}
	if ((varFlags & ClassDefinition.IS_CONST) !== 0) {
		context.errors.push(new CompileError$LToken$S(token, "cannot modify a constant"));
		return false;
	} else {
		if ((varFlags & ClassDefinition.IS_READONLY) !== 0) {
			context.errors.push(new CompileError$LToken$S(token, "cannot modify a readonly variable"));
			return false;
		}
	}
	return true;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} operatorToken
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {ResolvedFunctionType}
 */
PropertyExpression.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	/** @type {!number} */
	var i;
	/** @type {ResolvedFunctionType} */
	var rhsType;
	for (i = 0; i < argTypes.length; ++ i) {
		if (argTypes[i] instanceof FunctionChoiceType) {
			context.errors.push(new CompileError$LToken$S(operatorToken, "type deduction of overloaded function passed in as an argument is not supported; use 'as' to specify the function"));
			return null;
		}
	}
	rhsType = this._type.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, operatorToken, argTypes, isStatic);
	if (rhsType == null) {
		return null;
	}
	this._type = rhsType;
	return rhsType;
};

/**
 * class IncrementExpression extends UnaryExpression
 * @constructor
 */
function IncrementExpression() {
}

IncrementExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function IncrementExpression$LToken$LExpression$(operatorToken, expr) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

IncrementExpression$LToken$LExpression$.prototype = new IncrementExpression;

/**
 * @return {*}
 */
IncrementExpression.prototype.serialize$ = function () {
	return [ this._getClassName$(), this._token.serialize$(), this._expr.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
IncrementExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType.resolveIfNullable$().equals$LType$(Type.integerType) || exprType.resolveIfNullable$().equals$LType$(Type.numberType)) {
	} else {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '" + this._token.getValue$() + "' to a non-number"));
		return false;
	}
	if (! this._expr.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, exprType)) {
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
IncrementExpression.prototype.getType$ = function () {
	return this._expr.getType$().resolveIfNullable$();
};

/**
 * class PreIncrementExpression extends IncrementExpression
 * @constructor
 */
function PreIncrementExpression() {
}

PreIncrementExpression.prototype = new IncrementExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function PreIncrementExpression$LToken$LExpression$(operatorToken, expr) {
	IncrementExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

PreIncrementExpression$LToken$LExpression$.prototype = new PreIncrementExpression;

/**
 * @return {PreIncrementExpression}
 */
PreIncrementExpression.prototype.clone$ = function () {
	return new PreIncrementExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {!string}
 */
PreIncrementExpression.prototype._getClassName$ = function () {
	return "PreIncrementExpression";
};

/**
 * class PostIncrementExpression extends IncrementExpression
 * @constructor
 */
function PostIncrementExpression() {
}

PostIncrementExpression.prototype = new IncrementExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function PostIncrementExpression$LToken$LExpression$(operatorToken, expr) {
	IncrementExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

PostIncrementExpression$LToken$LExpression$.prototype = new PostIncrementExpression;

/**
 * @return {PostIncrementExpression}
 */
PostIncrementExpression.prototype.clone$ = function () {
	return new PostIncrementExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @return {!string}
 */
PostIncrementExpression.prototype._getClassName$ = function () {
	return "PostIncrementExpression";
};

/**
 * class LogicalNotExpression extends UnaryExpression
 * @constructor
 */
function LogicalNotExpression() {
}

LogicalNotExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function LogicalNotExpression$LToken$LExpression$(operatorToken, expr) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

LogicalNotExpression$LToken$LExpression$.prototype = new LogicalNotExpression;

/**
 * @return {LogicalNotExpression}
 */
LogicalNotExpression.prototype.clone$ = function () {
	return new LogicalNotExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
LogicalNotExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot apply operator '!' against void"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
LogicalNotExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class AsNoConvertExpression extends UnaryExpression
 * @constructor
 */
function AsNoConvertExpression() {
}

AsNoConvertExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 * @param {Type} type
 */
function AsNoConvertExpression$LToken$LExpression$LType$(operatorToken, expr, type) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
	this._type = type;
};

AsNoConvertExpression$LToken$LExpression$LType$.prototype = new AsNoConvertExpression;

/**
 * @return {AsNoConvertExpression}
 */
AsNoConvertExpression.prototype.clone$ = function () {
	return new AsNoConvertExpression$LToken$LExpression$LType$(this._token, this._expr.clone$(), this._type);
};

/**
 * @return {*}
 */
AsNoConvertExpression.prototype.serialize$ = function () {
	return [ "AsNoConvertExpression", this._expr.serialize$(), this._type.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
AsNoConvertExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var srcType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	srcType = this._expr.getType$();
	if (srcType.equals$LType$(Type.nullType) && ! (this._type instanceof NullableType || this._type instanceof ObjectType || this._type instanceof FunctionType)) {
		context.errors.push(new CompileError$LToken$S(this._token, "'" + srcType.toString() + "' cannot be treated as a value of type '" + this._type.toString() + "'"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
AsNoConvertExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
AsNoConvertExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * class AsExpression extends UnaryExpression
 * @constructor
 */
function AsExpression() {
}

AsExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 * @param {Type} type
 */
function AsExpression$LToken$LExpression$LType$(operatorToken, expr, type) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
	this._type = type;
};

AsExpression$LToken$LExpression$LType$.prototype = new AsExpression;

/**
 * @return {AsExpression}
 */
AsExpression.prototype.clone$ = function () {
	return new AsExpression$LToken$LExpression$LType$(this._token, this._expr.clone$(), this._type);
};

/**
 * @return {*}
 */
AsExpression.prototype.serialize$ = function () {
	return [ "AsExpression", this._expr.serialize$(), this._type.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
AsExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	/** @type {!boolean} */
	var success;
	/** @type {ResolvedFunctionType} */
	var deducedType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._type instanceof NullableType) {
		context.errors.push(new CompileError$LToken$S(this._token, "right operand of 'as' expression cannot be a Nullable<T> type"));
		return false;
	}
	if (this._expr.getType$().isConvertibleTo$LType$(this._type)) {
		return true;
	}
	exprType = this._expr.getType$().resolveIfNullable$();
	success = false;
	if (exprType.equals$LType$(Type.nullType)) {
		if (this._type instanceof ObjectType || this._type instanceof FunctionType) {
			success = true;
		}
	} else {
		if (exprType instanceof PrimitiveType) {
			if (this._type instanceof PrimitiveType) {
				success = true;
			}
		} else {
			if (exprType.equals$LType$(Type.variantType)) {
				success = true;
			} else {
				if (exprType instanceof ObjectType) {
					if (this._type instanceof ObjectType && this._type.isConvertibleTo$LType$(exprType)) {
						success = true;
					}
				} else {
					if (this._expr instanceof PropertyExpression && exprType instanceof FunctionType && this._type instanceof StaticFunctionType) {
						deducedType = this._expr.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, this._type.getArgumentTypes$(), true);
						if (deducedType != null) {
							exprType = deducedType;
							if (deducedType.getReturnType$().equals$LType$(this._type.getReturnType$())) {
								success = true;
							}
						}
					}
				}
			}
		}
	}
	if (! success) {
		context.errors.push(new CompileError$LToken$S(this._token, "cannot convert a value of type '" + exprType.toString() + "' to '" + this._type.toString() + "'"));
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
AsExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
AsExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * class InstanceofExpression extends UnaryExpression
 * @constructor
 */
function InstanceofExpression() {
}

InstanceofExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 * @param {Type} expectedType
 */
function InstanceofExpression$LToken$LExpression$LType$(operatorToken, expr, expectedType) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
	this._expectedType = expectedType;
};

InstanceofExpression$LToken$LExpression$LType$.prototype = new InstanceofExpression;

/**
 * @return {InstanceofExpression}
 */
InstanceofExpression.prototype.clone$ = function () {
	return new InstanceofExpression$LToken$LExpression$LType$(this._token, this._expr.clone$(), this._expectedType);
};

/**
 * @return {Type}
 */
InstanceofExpression.prototype.getExpectedType$ = function () {
	return this._expectedType;
};

/**
 * @param {Type} type
 */
InstanceofExpression.prototype.setExpectedType$LType$ = function (type) {
	this._expectedType = type;
};

/**
 * @return {*}
 */
InstanceofExpression.prototype.serialize$ = function () {
	return [ "InstanceofExpression", this._expr.serialize$(), this._expectedType.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
InstanceofExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {Type} */
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType instanceof ObjectType) {
	} else {
		if (exprType.equals$LType$(Type.variantType)) {
		} else {
			context.errors.push(new CompileError$LToken$S(this._token, "operator 'instanceof' is only applicable to an object or a variant"));
			return false;
		}
	}
	return true;
};

/**
 * @return {Type}
 */
InstanceofExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class BitwiseNotExpression extends UnaryExpression
 * @constructor
 */
function BitwiseNotExpression() {
}

BitwiseNotExpression.prototype = new UnaryExpression;
/**
 * @constructor
 * @param {Token} operatorToken
 * @param {Expression} expr
 */
function BitwiseNotExpression$LToken$LExpression$(operatorToken, expr) {
	UnaryExpression$LToken$LExpression$.call(this, operatorToken, expr);
};

BitwiseNotExpression$LToken$LExpression$.prototype = new BitwiseNotExpression;

/**
 * @return {BitwiseNotExpression}
 */
BitwiseNotExpression.prototype.clone$ = function () {
	return new BitwiseNotExpression$LToken$LExpression$(this._token, this._expr.clone$());
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
BitwiseNotExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr, Type.numberType, false)) {
		return false;
	}
	return true;
};

/**
 * @return {Type}
 */
BitwiseNotExpression.prototype.getType$ = function () {
	return Type.integerType;
};

/**
 * class LeafExpression extends Expression
 * @constructor
 */
function LeafExpression() {
}

LeafExpression.prototype = new Expression;
/**
 * @constructor
 * @param {Token} token
 */
function LeafExpression$LToken$(token) {
	Expression$LToken$.call(this, token);
};

LeafExpression$LToken$.prototype = new LeafExpression;

/**
 * @param {*} cb
 * @return {!boolean}
 */
LeafExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};

/**
 * class RegExpLiteralExpression extends LeafExpression
 * @constructor
 */
function RegExpLiteralExpression() {
}

RegExpLiteralExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 */
function RegExpLiteralExpression$LToken$(token) {
	RegExpLiteralExpression$LToken$LType$.call(this, token, null);
};

RegExpLiteralExpression$LToken$.prototype = new RegExpLiteralExpression;

/**
 * @constructor
 * @param {Token} token
 * @param {Type} type
 */
function RegExpLiteralExpression$LToken$LType$(token, type) {
	LeafExpression$LToken$.call(this, token);
	this._type = type;
};

RegExpLiteralExpression$LToken$LType$.prototype = new RegExpLiteralExpression;

/**
 * @return {RegExpLiteralExpression}
 */
RegExpLiteralExpression.prototype.clone$ = function () {
	return new RegExpLiteralExpression$LToken$LType$(this._token, this._type);
};

/**
 * @return {*}
 */
RegExpLiteralExpression.prototype.serialize$ = function () {
	return [ "RegExpLiteralExpression", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
RegExpLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	/** @type {ClassDefinition} */
	var classDef;
	classDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, "RegExp");
	if (classDef == null) {
		throw new Error("could not find definition for RegExp");
	}
	this._type = new ObjectType$LClassDefinition$(classDef);
	return true;
};

/**
 * @return {Type}
 */
RegExpLiteralExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * class StringLiteralExpression extends LeafExpression
 * @constructor
 */
function StringLiteralExpression() {
}

StringLiteralExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 */
function StringLiteralExpression$LToken$(token) {
	LeafExpression$LToken$.call(this, token);
};

StringLiteralExpression$LToken$.prototype = new StringLiteralExpression;

/**
 * @return {StringLiteralExpression}
 */
StringLiteralExpression.prototype.clone$ = function () {
	return new StringLiteralExpression$LToken$(this._token);
};

/**
 * @return {*}
 */
StringLiteralExpression.prototype.serialize$ = function () {
	return [ "StringLiteralExpression", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
StringLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
StringLiteralExpression.prototype.getType$ = function () {
	return Type.stringType;
};

/**
 * class NumberLiteralExpression extends LeafExpression
 * @constructor
 */
function NumberLiteralExpression() {
}

NumberLiteralExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 */
function NumberLiteralExpression$LToken$(token) {
	LeafExpression$LToken$.call(this, token);
};

NumberLiteralExpression$LToken$.prototype = new NumberLiteralExpression;

/**
 * @return {NumberLiteralExpression}
 */
NumberLiteralExpression.prototype.clone$ = function () {
	return new NumberLiteralExpression$LToken$(this._token);
};

/**
 * @return {*}
 */
NumberLiteralExpression.prototype.serialize$ = function () {
	return [ "NumberLiteralExpression", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
NumberLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
NumberLiteralExpression.prototype.getType$ = function () {
	return Type.numberType;
};

/**
 * class IntegerLiteralExpression extends LeafExpression
 * @constructor
 */
function IntegerLiteralExpression() {
}

IntegerLiteralExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 */
function IntegerLiteralExpression$LToken$(token) {
	LeafExpression$LToken$.call(this, token);
};

IntegerLiteralExpression$LToken$.prototype = new IntegerLiteralExpression;

/**
 * @return {IntegerLiteralExpression}
 */
IntegerLiteralExpression.prototype.clone$ = function () {
	return new IntegerLiteralExpression$LToken$(this._token);
};

/**
 * @return {*}
 */
IntegerLiteralExpression.prototype.serialize$ = function () {
	return [ "IntegerLiteralExpression", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
IntegerLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
IntegerLiteralExpression.prototype.getType$ = function () {
	return Type.integerType;
};

/**
 * class BooleanLiteralExpression extends LeafExpression
 * @constructor
 */
function BooleanLiteralExpression() {
}

BooleanLiteralExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 */
function BooleanLiteralExpression$LToken$(token) {
	LeafExpression$LToken$.call(this, token);
};

BooleanLiteralExpression$LToken$.prototype = new BooleanLiteralExpression;

/**
 * @return {BooleanLiteralExpression}
 */
BooleanLiteralExpression.prototype.clone$ = function () {
	return new BooleanLiteralExpression$LToken$(this._token);
};

/**
 * @return {*}
 */
BooleanLiteralExpression.prototype.serialize$ = function () {
	return [ "BooleanLiteralExpression", this._token.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
BooleanLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
BooleanLiteralExpression.prototype.getType$ = function () {
	return Type.booleanType;
};

/**
 * class NullExpression extends LeafExpression
 * @constructor
 */
function NullExpression() {
}

NullExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} type
 */
function NullExpression$LToken$LType$(token, type) {
	LeafExpression$LToken$.call(this, token);
	this._type = type;
};

NullExpression$LToken$LType$.prototype = new NullExpression;

/**
 * @return {NullExpression}
 */
NullExpression.prototype.clone$ = function () {
	return new NullExpression$LToken$LType$(this._token, this._type);
};

/**
 * @return {*}
 */
NullExpression.prototype.serialize$ = function () {
	return [ "NullExpression", this._token.serialize$(), this._type.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
NullExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
NullExpression.prototype.getType$ = function () {
	return this._type;
};

/**
 * @param {Type} type
 */
NullExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};

/**
 * class ClassExpression extends LeafExpression
 * @constructor
 */
function ClassExpression() {
}

ClassExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {Type} parsedType
 */
function ClassExpression$LToken$LType$(token, parsedType) {
	LeafExpression$LToken$.call(this, token);
	this._parsedType = parsedType;
};

ClassExpression$LToken$LType$.prototype = new ClassExpression;

/**
 * @return {ClassExpression}
 */
ClassExpression.prototype.clone$ = function () {
	return new ClassExpression$LToken$LType$(this._token, this._parsedType);
};

/**
 * @return {*}
 */
ClassExpression.prototype.serialize$ = function () {
	return [ "ClassExpression", this._token.serialize$(), this._parsedType.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
ClassExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};

/**
 * @return {Type}
 */
ClassExpression.prototype.getType$ = function () {
	return this._parsedType;
};

/**
 * @param {Type} type
 */
ClassExpression.prototype.setType$LType$ = function (type) {
	this._parsedType = type;
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} type
 * @return {!boolean}
 */
ClassExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	context.errors.push(new CompileError$LToken$S(token, "cannot modify a class definition"));
	return false;
};

/**
 * class LocalExpression extends LeafExpression
 * @constructor
 */
function LocalExpression() {
}

LocalExpression.prototype = new LeafExpression;
/**
 * @constructor
 * @param {Token} token
 * @param {LocalVariable} local
 */
function LocalExpression$LToken$LLocalVariable$(token, local) {
	LeafExpression$LToken$.call(this, token);
	this._cloned = false;
	this._local = local;
};

LocalExpression$LToken$LLocalVariable$.prototype = new LocalExpression;

/**
 * @return {LocalExpression}
 */
LocalExpression.prototype.clone$ = function () {
	/** @type {LocalExpression} */
	var that;
	that = new LocalExpression$LToken$LLocalVariable$(this._token, this._local);
	that._cloned = true;
	return that;
};

/**
 * @return {LocalVariable}
 */
LocalExpression.prototype.getLocal$ = function () {
	return this._local;
};

/**
 * @param {LocalVariable} local
 */
LocalExpression.prototype.setLocal$LLocalVariable$ = function (local) {
	this._local = local;
};

/**
 * @return {*}
 */
LocalExpression.prototype.serialize$ = function () {
	return [ "LocalExpression", this._token.serialize$(), this._local.serialize$() ];
};

/**
 * @param {AnalysisContext} context
 * @param {Expression} parentExpr
 * @return {!boolean}
 */
LocalExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (parentExpr instanceof AssignmentExpression && parentExpr.getFirstExpr$() == this && parentExpr.getToken$().getValue$() === "=" || parentExpr == null && context.statement instanceof ForInStatement && context.statement.getLHSExpr$() == this) {
	} else {
		this._local.touchVariable$LAnalysisContext$LToken$B(context, this._token, false);
		if (this._local.getType$() == null) {
			return false;
		}
	}
	return true;
};

/**
 * @return {Type}
 */
LocalExpression.prototype.getType$ = function () {
	return this._local.getType$();
};

/**
 * @param {AnalysisContext} context
 * @param {Token} token
 * @param {Type} type
 * @return {!boolean}
 */
LocalExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	if (this._local.getType$() == null) {
		if (type.equals$LType$(Type.nullType)) {
			context.errors.push(new CompileError$LToken$S(token, "cannot assign null without type annotation to a value of undetermined type"));
			return false;
		}
		this._local.setType$LType$(type.asAssignableType$());
	} else {
		if (! type.isConvertibleTo$LType$(this._local.getType$())) {
			context.errors.push(new CompileError$LToken$S(token, "cannot assign a value of type '" + type.toString() + "' to '" + this._local.getType$().toString() + "'"));
			return false;
		}
	}
	this._local.touchVariable$LAnalysisContext$LToken$B(context, this._token, true);
	return true;
};

/**
 * class Emitter
 * @constructor
 */
function Emitter() {
}

$__jsx_merge_interface(Emitter, Stashable);

Emitter.prototype.$__jsx_implements_Emitter = true;

/**
 * @constructor
 */
function Emitter$() {
	Stashable$.call(this);
};

Emitter$.prototype = new Emitter;

/**
 * class JavaScriptEmitter extends Object
 * @constructor
 */
function JavaScriptEmitter() {
}

$__jsx_merge_interface(JavaScriptEmitter, Emitter);

/**
 * @constructor
 * @param {Platform} platform
 */
function JavaScriptEmitter$LPlatform$(platform) {
	Emitter$.call(this);
	this._fileHeader = "var JSX = {};\n" + "(function (JSX) {\n";
	this._fileFooter = "})(JSX);\n";
	this._enableSourceMap = false;
	this._enableProfiler = false;
	this._sourceMapper = null;
	JavaScriptEmitter$_initialize$();
	this._platform = platform;
	this._output = "";
	this._outputEndsWithReturn = true;
	this._outputFile = null;
	this._indent = 0;
	this._emittingClass = null;
	this._emittingFunction = null;
	this._emittingStatementStack = [];
	this._enableRunTimeTypeCheck = true;
	this._output += "// generatedy by JSX compiler " + Meta.IDENTIFIER + "\n";
	this._output += this._fileHeader;
};

JavaScriptEmitter$LPlatform$.prototype = new JavaScriptEmitter;

/**
 * @param {ClassDefinition} classDef
 * @return {!boolean}
 */
JavaScriptEmitter.prototype.isJsModule$LClassDefinition$ = function (classDef) {
	return classDef.className$() === "js" && classDef.getToken$().getFilename$() == Util$resolvePath$S(this._platform.getRoot$() + "/lib/js/js.jsx");
};

/**
 * @return {Array.<undefined|!string>}
 */
JavaScriptEmitter.prototype.getSearchPaths$ = function () {
	return [ this._platform.getRoot$() + "/lib/js" ];
};

/**
 * @param {undefined|!string} name
 */
JavaScriptEmitter.prototype.setOutputFile$US = function (name) {
	if (name == null) {
		return;
	}
	this._outputFile = Util$resolvePath$S(name);
	if (this._enableSourceMap) {
		this._sourceMapper = new SourceMapper$SS(this._platform.getRoot$(), name);
	}
};

/**
 * @return {Object.<string, undefined|!string>}
 */
JavaScriptEmitter.prototype.getSourceMappingFiles$ = function () {
	/** @type {Object.<string, undefined|!string>} */
	var files;
	/** @type {SourceMapper} */
	var sourceMapper;
	/** @type {Object.<string, undefined|!string>} */
	var fileMap;
	/** @type {!string} */
	var filename;
	/** @type {undefined|!string} */
	var dest;
	files = {};
	sourceMapper = this._sourceMapper;
	if (sourceMapper != null) {
		files[sourceMapper.getSourceMappingFile$()] = sourceMapper.generate$();
		fileMap = sourceMapper.getSourceFileMap$();
		for (filename in fileMap) {
			dest = fileMap[filename];
			try {
				files[dest] = this._platform.load$S(filename);
			} catch ($__jsx_catch_0) {
				if ($__jsx_catch_0 instanceof Error) {
				} else {
					throw $__jsx_catch_0;
				}
			}
		}
	}
	return files;
};

/**
 * @param {SourceMapper} gen
 */
JavaScriptEmitter.prototype.setSourceMapper$LSourceMapper$ = function (gen) {
	this._sourceMapper = gen;
};

/**
 * @param {!boolean} enable
 */
JavaScriptEmitter.prototype.setEnableRunTimeTypeCheck$B = function (enable) {
	this._enableRunTimeTypeCheck = enable;
};

/**
 * @param {!boolean} enable
 */
JavaScriptEmitter.prototype.setEnableSourceMap$B = function (enable) {
	this._enableSourceMap = enable;
};

/**
 * @param {!boolean} enable
 */
JavaScriptEmitter.prototype.setEnableProfiler$B = function (enable) {
	this._enableProfiler = enable;
};

/**
 * @param {!string} header
 */
JavaScriptEmitter.prototype.addHeader$S = function (header) {
	this._output = header + this._output;
};

/**
 * @param {Array.<undefined|ClassDefinition>} classDefs
 */
JavaScriptEmitter.prototype.emit$ALClassDefinition$ = function (classDefs) {
	var $this = this;
	/** @type {!string} */
	var bootstrap;
	/** @type {_NoDebugCommand$CStash} */
	var stash;
	/** @type {!number} */
	var i;
	bootstrap = this._platform.load$S(this._platform.getRoot$() + "/src/js/bootstrap.js");
	this._output += bootstrap;
	stash = this.getOptimizerStash$()[_NoDebugCommand.IDENTIFIER];
	this._emit$SLToken$("JSX.DEBUG = " + (stash == null || stash.debugValue ? "true" : "false") + ";\n", null);
	for (i = 0; i < classDefs.length; ++ i) {
		classDefs[i].forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFuncDef(funcDef) {
			funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFuncDef);
			$this._setupBooleanizeFlags$LMemberFunctionDefinition$(funcDef);
			return true;
		}));
	}
	for (i = 0; i < classDefs.length; ++ i) {
		if ((classDefs[i].flags$() & ClassDefinition.IS_NATIVE) === 0) {
			this._emitClassDefinition$LClassDefinition$(classDefs[i]);
		}
	}
	for (i = 0; i < classDefs.length; ++ i) {
		this._emitStaticInitializationCode$LClassDefinition$(classDefs[i]);
	}
	this._emitClassMap$ALClassDefinition$(classDefs);
};

/**
 * @param {Stashable} stashable
 * @return {_JSEmitterStash}
 */
JavaScriptEmitter.prototype.getStash$LStashable$ = function (stashable) {
	/** @type {Object.<string, undefined|OptimizerStash>} */
	var stash;
	stash = stashable.getOptimizerStash$();
	if (stash.jsemitter == null) {
		stash.jsemitter = new _JSEmitterStash$();
	}
	return stash.jsemitter;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._setupBooleanizeFlags$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {*} */
	var exprReturnsBoolean;
	exprReturnsBoolean = (function (expr) {
		if (expr instanceof LogicalExpression) {
			return $this.getStash$LStashable$(expr).returnsBoolean;
		} else {
			return expr.getType$().equals$LType$(Type.booleanType);
		}
	});
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		/** @type {Array.<undefined|Expression>} */
		var parentExpr;
		parentExpr = [];
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			/** @type {!boolean} */
			var shouldBooleanize;
			/** @type {!boolean} */
			var returnsBoolean;
			parentExpr.unshift(expr);
			expr.forEachExpression$F$LExpression$B$(onExpr);
			parentExpr.shift();
			if (expr instanceof LogicalExpression) {
				shouldBooleanize = true;
				returnsBoolean = false;
				if (exprReturnsBoolean(expr.getFirstExpr$()) && exprReturnsBoolean(expr.getSecondExpr$())) {
					returnsBoolean = true;
					shouldBooleanize = false;
				} else {
					if (parentExpr.length === 0) {
						if (statement instanceof ExpressionStatement || statement instanceof IfStatement || statement instanceof DoWhileStatement || statement instanceof WhileStatement || statement instanceof ForStatement) {
							shouldBooleanize = false;
						}
					} else {
						if (parentExpr[0] instanceof LogicalExpression || parentExpr[0] instanceof LogicalNotExpression) {
							shouldBooleanize = false;
						} else {
							if (parentExpr[0] instanceof ConditionalExpression && parentExpr[0].getCondExpr$() == expr) {
								shouldBooleanize = false;
							}
						}
					}
				}
				$this.getStash$LStashable$(expr).shouldBooleanize = shouldBooleanize;
				$this.getStash$LStashable$(expr).returnsBoolean = returnsBoolean;
			}
			return true;
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
};

/**
 * @param {Expression} logicalExpr
 * @return {!boolean}
 */
JavaScriptEmitter.prototype.shouldBooleanize$LExpression$ = function (logicalExpr) {
	return this.getStash$LStashable$(logicalExpr).shouldBooleanize;
};

/**
 * @param {ClassDefinition} classDef
 */
JavaScriptEmitter.prototype._emitClassDefinition$LClassDefinition$ = function (classDef) {
	/** @type {Array.<undefined|MemberFunctionDefinition>} */
	var ctors;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {MemberDefinition} */
	var member;
	this._emittingClass = classDef;
	try {
		this._emitClassObject$LClassDefinition$(classDef);
		ctors = this._findFunctions$LClassDefinition$SB(classDef, "constructor", false);
		for (i = 0; i < ctors.length; ++ i) {
			this._emitConstructor$LMemberFunctionDefinition$(ctors[i]);
		}
		members = classDef.members$();
		for (i = 0; i < members.length; ++ i) {
			member = members[i];
			if (member instanceof MemberFunctionDefinition) {
				if (! (member.name$() === "constructor" && (member.flags$() & ClassDefinition.IS_STATIC) === 0) && member.getStatements$() != null) {
					if (member instanceof TemplateFunctionDefinition) {
					} else {
						this._emitFunction$LMemberFunctionDefinition$(member);
					}
				}
			}
		}
	} finally {
		this._emittingClass = null;
	}
};

/**
 * @param {ClassDefinition} classDef
 */
JavaScriptEmitter.prototype._emitStaticInitializationCode$LClassDefinition$ = function (classDef) {
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return;
	}
	if (this.isJsModule$LClassDefinition$(classDef)) {
		this._emit$SLToken$("js.global = (function () { return this; })();\n", null);
		return;
	}
	members = classDef.members$();
	for (i = 0; i < members.length; ++ i) {
		member = members[i];
		if (member instanceof MemberVariableDefinition && (member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) === ClassDefinition.IS_STATIC) {
			this._emitStaticMemberVariable$SLMemberVariableDefinition$(classDef.getOutputClassName$(), member);
		}
	}
};

/**
 * @param {Array.<undefined|ClassDefinition>} classDefs
 */
JavaScriptEmitter.prototype._emitClassMap$ALClassDefinition$ = function (classDefs) {
	var $this = this;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|Array.<undefined|!string>>} */
	var list;
	/** @type {*} */
	var pushClass;
	/** @type {undefined|!string} */
	var filename;
	/** @type {!string} */
	var escapedFilename;
	classDefs = classDefs.concat([]);
	for (i = 0; i < classDefs.length; ) {
		if (classDefs[i].getToken$() == null || (classDefs[i].flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			classDefs.splice(i, 1);
		} else {
			++ i;
		}
	}
	this._emit$SLToken$("var $__jsx_classMap = {\n", null);
	this._advanceIndent$();
	while (classDefs.length !== 0) {
		list = [];
		pushClass = (function (classDef) {
			/** @type {*} */
			var push;
			/** @type {Array.<undefined|MemberFunctionDefinition>} */
			var ctors;
			/** @type {!number} */
			var i;
			push = (function (suffix) {
				list.push([ classDef.className$() + suffix, classDef.getOutputClassName$() + suffix ]);
			});
			ctors = $this._findFunctions$LClassDefinition$SB(classDef, "constructor", false);
			push("");
			if (ctors.length === 0) {
				push($this._mangleFunctionArguments$ALType$([]));
			} else {
				for (i = 0; i < ctors.length; ++ i) {
					push($this._mangleFunctionArguments$ALType$(ctors[i].getArgumentTypes$()));
				}
			}
		});
		filename = classDefs[0].getToken$().getFilename$();
		pushClass(classDefs.shift());
		for (i = 0; i < classDefs.length; ) {
			if (classDefs[i].getToken$().getFilename$() == filename) {
				pushClass(classDefs[i]);
				classDefs.splice(i, 1);
			} else {
				++ i;
			}
		}
		escapedFilename = JSON.stringify(this._platform.encodeFilename$S(filename));
		this._emit$SLToken$(escapedFilename + ": ", null);
		this._emit$SLToken$("{\n", null);
		this._advanceIndent$();
		for (i = 0; i < list.length; ++ i) {
			this._emit$SLToken$(list[i][0] + ": " + list[i][1], null);
			if (i !== list.length - 1) {
				this._emit$SLToken$(",", null);
			}
			this._emit$SLToken$("\n", null);
		}
		this._reduceIndent$();
		this._emit$SLToken$("}", null);
		if (classDefs.length !== 0) {
			this._emit$SLToken$(",", null);
		}
		this._emit$SLToken$("\n", null);
	}
	this._reduceIndent$();
	this._emit$SLToken$("};\n\n", null);
};

/**
 * @param {!string} sourceFile
 * @param {undefined|!string} entryPoint
 * @param {undefined|!string} executableFor
 * @return {!string}
 */
JavaScriptEmitter.prototype.getOutput$SUSUS = function (sourceFile, entryPoint, executableFor) {
	/** @type {!string} */
	var output;
	output = this._output + "\n";
	if (this._enableProfiler) {
		output += this._platform.load$S(this._platform.getRoot$() + "/src/js/profiler.js");
	}
	if (entryPoint != null) {
		output = this._platform.addLauncher$LEmitter$XSSS(this, this._platform.encodeFilename$S(sourceFile), output, entryPoint, executableFor);
	}
	output += this._fileFooter;
	if (this._sourceMapper) {
		output += this._sourceMapper.magicToken$();
	}
	return output;
};

/**
 * @param {ClassDefinition} classDef
 */
JavaScriptEmitter.prototype._emitClassObject$LClassDefinition$ = function (classDef) {
	/** @type {Array.<undefined|ParsedObjectType>} */
	var implementTypes;
	/** @type {!number} */
	var i;
	this._emit$SLToken$("/**\n" + " * class " + classDef.getOutputClassName$() + (classDef.extendType$() != null ? " extends " + classDef.extendType$().getClassDef$().getOutputClassName$() : "") + "\n" + " * @constructor\n" + " */\n" + "function ", null);
	this._emit$SLToken$(classDef.getOutputClassName$() + "() {\n" + "}\n" + "\n", classDef.getToken$());
	if (classDef.extendType$() != null && classDef.extendType$().getClassDef$().getOutputClassName$() !== "Object") {
		this._emit$SLToken$(classDef.getOutputClassName$() + ".prototype = new " + classDef.extendType$().getClassDef$().getOutputClassName$() + ";\n", null);
	}
	implementTypes = classDef.implementTypes$();
	if (implementTypes.length !== 0) {
		for (i = 0; i < implementTypes.length; ++ i) {
			this._emit$SLToken$("$__jsx_merge_interface(" + classDef.getOutputClassName$() + ", " + implementTypes[i].getClassDef$().getOutputClassName$() + ");\n", null);
		}
		this._emit$SLToken$("\n", null);
	}
	if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
		this._emit$SLToken$(classDef.getOutputClassName$() + ".prototype.$__jsx_implements_" + classDef.getOutputClassName$() + " = true;\n\n", null);
	}
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._emitConstructor$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {!string} */
	var funcName;
	funcName = this._mangleConstructorName$LClassDefinition$ALType$(funcDef.getClassDef$(), funcDef.getArgumentTypes$());
	this._emit$SLToken$("/**\n", null);
	this._emit$SLToken$(" * @constructor\n", null);
	this._emitFunctionArgumentAnnotations$LMemberFunctionDefinition$(funcDef);
	this._emit$SLToken$(" */\n", null);
	this._emit$SLToken$("function ", null);
	this._emit$SLToken$(funcName + "(", funcDef.getClassDef$().getToken$());
	this._emitFunctionArguments$LMemberFunctionDefinition$(funcDef);
	this._emit$SLToken$(") {\n", null);
	this._advanceIndent$();
	this._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
	this._reduceIndent$();
	this._emit$SLToken$("};\n\n", null);
	this._emit$SLToken$(funcName + ".prototype = new " + funcDef.getClassDef$().getOutputClassName$() + ";\n\n", null);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._emitFunction$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {!string} */
	var className;
	/** @type {!string} */
	var funcName;
	className = funcDef.getClassDef$().getOutputClassName$();
	funcName = this._mangleFunctionName$SALType$(funcDef.name$(), funcDef.getArgumentTypes$());
	this._emit$SLToken$("/**\n", null);
	this._emitFunctionArgumentAnnotations$LMemberFunctionDefinition$(funcDef);
	this._emit$SLToken$(_TypeAnnotation$build$SLType$(" * @return {%1}\n", funcDef.getReturnType$()), null);
	this._emit$SLToken$(" */\n", null);
	this._emit$SLToken$(className + ".", null);
	if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		this._emit$SLToken$("prototype.", null);
	}
	this._emit$SLToken$(funcName + " = ", funcDef.getNameToken$());
	this._emit$SLToken$("function (", funcDef.getToken$());
	this._emitFunctionArguments$LMemberFunctionDefinition$(funcDef);
	this._emit$SLToken$(") {\n", null);
	this._advanceIndent$();
	this._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
	this._reduceIndent$();
	this._emit$SLToken$("};\n\n", null);
	if ((funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		this._emit$SLToken$("var " + className + "$" + funcName + " = " + className + "." + funcName + ";\n\n", null);
	}
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._emitFunctionArgumentAnnotations$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var i;
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++ i) {
		this._emit$SLToken$(_TypeAnnotation$build$SLType$(" * @param {%1} " + args[i].getName$().getValue$() + "\n", args[i].getType$()), null);
	}
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._emitFunctionArguments$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var i;
	/** @type {Token} */
	var name;
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++ i) {
		if (i !== 0) {
			this._emit$SLToken$(", ", null);
		}
		name = args[i].getName$();
		this._emit$SLToken$(name.getValue$(), name);
	}
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
JavaScriptEmitter.prototype._emitFunctionBody$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {MemberFunctionDefinition} */
	var prevEmittingFunction;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {!number} */
	var i;
	/** @type {Type} */
	var type;
	/** @type {Token} */
	var name;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	prevEmittingFunction = this._emittingFunction;
	try {
		this._emittingFunction = funcDef;
		if (this._enableProfiler) {
			this._emit$SLToken$("var $__jsx_profiler_ctx = $__jsx_profiler.enter(" + Util$encodeStringLiteral$S(funcDef.getNotation$()) + ");\n", null);
		}
		if (funcDef.getClosures$().length !== 0 && (funcDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
			this._emit$SLToken$("var $this = this;\n", null);
		}
		if (_CallExpressionEmitter$mathAbsUsesTemporary$LMemberFunctionDefinition$(funcDef)) {
			this._emit$SLToken$("var $math_abs_t;\n", null);
		}
		locals = funcDef.getLocals$();
		for (i = 0; i < locals.length; ++ i) {
			type = locals[i].getType$();
			if (type == null) {
				continue;
			}
			this._emit$SLToken$(_TypeAnnotation$build$SLType$("/** @type {%1} */\n", type), null);
			name = locals[i].getName$();
			this._emit$SLToken$("var " + name.getValue$() + ";\n", null);
		}
		statements = funcDef.getStatements$();
		for (i = 0; i < statements.length; ++ i) {
			this._emitStatement$LStatement$(statements[i]);
		}
		if (this._enableProfiler) {
			if (statements.length === 0 || ! (statements[statements.length - 1] instanceof ReturnStatement)) {
				this._emit$SLToken$("$__jsx_profiler.exit();\n", null);
			}
		}
	} finally {
		this._emittingFunction = prevEmittingFunction;
	}
};

/**
 * @param {!string} holder
 * @param {MemberVariableDefinition} variable
 */
JavaScriptEmitter.prototype._emitStaticMemberVariable$SLMemberVariableDefinition$ = function (holder, variable) {
	/** @type {Expression} */
	var initialValue;
	initialValue = variable.getInitialValue$();
	if (initialValue != null && ! (initialValue instanceof NullExpression || initialValue instanceof BooleanLiteralExpression || initialValue instanceof IntegerLiteralExpression || initialValue instanceof NumberLiteralExpression || initialValue instanceof StringLiteralExpression || initialValue instanceof RegExpLiteralExpression)) {
		this._emit$SLToken$("$__jsx_lazy_init(" + holder + ", \"" + variable.name$() + "\", function () {\n", variable.getNameToken$());
		this._advanceIndent$();
		this._emit$SLToken$("return ", variable.getNameToken$());
		this._emitRHSOfAssignment$LExpression$LType$(initialValue, variable.getType$());
		this._emit$SLToken$(";\n", variable.getNameToken$());
		this._reduceIndent$();
		this._emit$SLToken$("});\n", variable.getNameToken$());
	} else {
		this._emit$SLToken$(holder + "." + variable.name$() + " = ", variable.getNameToken$());
		this._emitRHSOfAssignment$LExpression$LType$(initialValue, variable.getType$());
		this._emit$SLToken$(";\n", initialValue.getToken$());
	}
};

/**
 * @param {Type} type
 */
JavaScriptEmitter.prototype._emitDefaultValueOf$LType$ = function (type) {
	if (type.equals$LType$(Type.booleanType)) {
		this._emit$SLToken$("false", null);
	} else {
		if (type.equals$LType$(Type.integerType) || type.equals$LType$(Type.numberType)) {
			this._emit$SLToken$("0", null);
		} else {
			if (type.equals$LType$(Type.stringType)) {
				this._emit$SLToken$("\"\"", null);
			} else {
				if (type instanceof NullableType) {
					this._emit$SLToken$("null", null);
				} else {
					this._emit$SLToken$("null", null);
				}
			}
		}
	}
};

/**
 * @param {Array.<undefined|Statement>} statements
 */
JavaScriptEmitter.prototype._emitStatements$ALStatement$ = function (statements) {
	/** @type {!number} */
	var i;
	this._advanceIndent$();
	for (i = 0; i < statements.length; ++ i) {
		this._emitStatement$LStatement$(statements[i]);
	}
	this._reduceIndent$();
};

/**
 * @param {Statement} statement
 */
JavaScriptEmitter.prototype._emitStatement$LStatement$ = function (statement) {
	/** @type {_StatementEmitter} */
	var emitter;
	emitter = this._getStatementEmitterFor$LStatement$(statement);
	this._emittingStatementStack.push(emitter);
	try {
		emitter.emit$();
	} finally {
		this._emittingStatementStack.pop();
	}
};

/**
 * @param {Token} token
 */
JavaScriptEmitter.prototype._addSourceMapping$LToken$ = function (token) {
	/** @type {!number} */
	var lastNewLinePos;
	/** @type {!number} */
	var genColumn;
	/** @type {Object.<string, undefined|!number>} */
	var genPos;
	/** @type {undefined|!string} */
	var tokenValue;
	/** @type {Object.<string, undefined|!number>} */
	var origPos;
	/** @type {undefined|!string} */
	var filename;
	lastNewLinePos = this._output.lastIndexOf("\n") + 1;
	genColumn = this._output.length - lastNewLinePos;
	genPos = ({ line: this._output.match(/^/mg).length, column: genColumn });
	tokenValue = null;
	origPos = null;
	if (! $__jsx_isNaN(token.getLineNumber$())) {
		origPos = ({ line: token.getLineNumber$(), column: token.getColumnNumber$() });
		if (token.isIdentifier$()) {
			tokenValue = token.getValue$();
		}
	}
	filename = token.getFilename$();
	this._sourceMapper.add$HNHNUSUS(genPos, origPos, filename, tokenValue);
};

/**
 * @param {!string} str
 * @param {Token} token
 */
JavaScriptEmitter.prototype._emit$SLToken$ = function (str, token) {
	var $this = this;
	if (str === "") {
		return;
	}
	if (this._outputEndsWithReturn && this._indent !== 0) {
		this._output += this._getIndent$();
		this._outputEndsWithReturn = false;
	}
	if (this._sourceMapper != null && token != null) {
		this._addSourceMapping$LToken$(token);
	}
	str = str.replace(/\n(.)/g, (function (m) {
		return "\n" + $this._getIndent$() + m.substring(1);
	}));
	this._output += str;
	this._outputEndsWithReturn = str.charAt(str.length - 1) === "\n";
};

/**
 */
JavaScriptEmitter.prototype._advanceIndent$ = function () {
	++ this._indent;
};

/**
 */
JavaScriptEmitter.prototype._reduceIndent$ = function () {
	if (-- this._indent < 0) {
		throw new Error("indent mistach");
	}
};

/**
 * @return {!string}
 */
JavaScriptEmitter.prototype._getIndent$ = function () {
	/** @type {!string} */
	var s;
	/** @type {!number} */
	var i;
	s = "";
	for (i = 0; i < this._indent; ++ i) {
		s += "\t";
	}
	return s;
};

/**
 * @param {Statement} statement
 * @return {_StatementEmitter}
 */
JavaScriptEmitter.prototype._getStatementEmitterFor$LStatement$ = function (statement) {
	if (statement instanceof ConstructorInvocationStatement) {
		return new _ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$(this, statement);
	} else {
		if (statement instanceof ExpressionStatement) {
			return new _ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$(this, statement);
		} else {
			if (statement instanceof ReturnStatement) {
				return new _ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$(this, statement);
			} else {
				if (statement instanceof DeleteStatement) {
					return new _DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$(this, statement);
				} else {
					if (statement instanceof BreakStatement) {
						return new _BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$(this, statement);
					} else {
						if (statement instanceof ContinueStatement) {
							return new _ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$(this, statement);
						} else {
							if (statement instanceof DoWhileStatement) {
								return new _DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$(this, statement);
							} else {
								if (statement instanceof ForInStatement) {
									return new _ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$(this, statement);
								} else {
									if (statement instanceof ForStatement) {
										return new _ForStatementEmitter$LJavaScriptEmitter$LForStatement$(this, statement);
									} else {
										if (statement instanceof IfStatement) {
											return new _IfStatementEmitter$LJavaScriptEmitter$LIfStatement$(this, statement);
										} else {
											if (statement instanceof SwitchStatement) {
												return new _SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$(this, statement);
											} else {
												if (statement instanceof CaseStatement) {
													return new _CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$(this, statement);
												} else {
													if (statement instanceof DefaultStatement) {
														return new _DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$(this, statement);
													} else {
														if (statement instanceof WhileStatement) {
															return new _WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$(this, statement);
														} else {
															if (statement instanceof TryStatement) {
																return new _TryStatementEmitter$LJavaScriptEmitter$LTryStatement$(this, statement);
															} else {
																if (statement instanceof CatchStatement) {
																	return new _CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$(this, statement);
																} else {
																	if (statement instanceof ThrowStatement) {
																		return new _ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$(this, statement);
																	} else {
																		if (statement instanceof AssertStatement) {
																			return new _AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$(this, statement);
																		} else {
																			if (statement instanceof LogStatement) {
																				return new _LogStatementEmitter$LJavaScriptEmitter$LLogStatement$(this, statement);
																			} else {
																				if (statement instanceof DebuggerStatement) {
																					return new _DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$(this, statement);
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize$()));
};

/**
 * @param {Expression} expr
 * @return {_ExpressionEmitter}
 */
JavaScriptEmitter.prototype._getExpressionEmitterFor$LExpression$ = function (expr) {
	if (expr instanceof LocalExpression) {
		return new _LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$(this, expr);
	} else {
		if (expr instanceof ClassExpression) {
			return new _ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$(this, expr);
		} else {
			if (expr instanceof NullExpression) {
				return new _NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$(this, expr);
			} else {
				if (expr instanceof BooleanLiteralExpression) {
					return new _BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$(this, expr);
				} else {
					if (expr instanceof IntegerLiteralExpression) {
						return new _IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$(this, expr);
					} else {
						if (expr instanceof NumberLiteralExpression) {
							return new _NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$(this, expr);
						} else {
							if (expr instanceof StringLiteralExpression) {
								return new _StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$(this, expr);
							} else {
								if (expr instanceof RegExpLiteralExpression) {
									return new _RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$(this, expr);
								} else {
									if (expr instanceof ArrayLiteralExpression) {
										return new _ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$(this, expr);
									} else {
										if (expr instanceof MapLiteralExpression) {
											return new _MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$(this, expr);
										} else {
											if (expr instanceof ThisExpression) {
												return new _ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$(this, expr);
											} else {
												if (expr instanceof BitwiseNotExpression) {
													return new _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
												} else {
													if (expr instanceof InstanceofExpression) {
														return new _InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$(this, expr);
													} else {
														if (expr instanceof AsExpression) {
															return new _AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$(this, expr);
														} else {
															if (expr instanceof AsNoConvertExpression) {
																return new _AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$(this, expr);
															} else {
																if (expr instanceof LogicalNotExpression) {
																	return new _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
																} else {
																	if (expr instanceof TypeofExpression) {
																		return new _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
																	} else {
																		if (expr instanceof PostIncrementExpression) {
																			return new _PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
																		} else {
																			if (expr instanceof PreIncrementExpression) {
																				return new _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
																			} else {
																				if (expr instanceof PropertyExpression) {
																					return new _PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$(this, expr);
																				} else {
																					if (expr instanceof SignExpression) {
																						return new _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$(this, expr);
																					} else {
																						if (expr instanceof AdditiveExpression) {
																							return new _AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$(this, expr);
																						} else {
																							if (expr instanceof ArrayExpression) {
																								return new _ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$(this, expr);
																							} else {
																								if (expr instanceof AssignmentExpression) {
																									return new _AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$(this, expr);
																								} else {
																									if (expr instanceof BinaryNumberExpression) {
																										return new _BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$(this, expr);
																									} else {
																										if (expr instanceof EqualityExpression) {
																											return new _EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$(this, expr);
																										} else {
																											if (expr instanceof InExpression) {
																												return new _InExpressionEmitter$LJavaScriptEmitter$LInExpression$(this, expr);
																											} else {
																												if (expr instanceof LogicalExpression) {
																													return new _LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$(this, expr);
																												} else {
																													if (expr instanceof ShiftExpression) {
																														return new _ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$(this, expr);
																													} else {
																														if (expr instanceof ConditionalExpression) {
																															return new _ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$(this, expr);
																														} else {
																															if (expr instanceof CallExpression) {
																																return new _CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$(this, expr);
																															} else {
																																if (expr instanceof SuperExpression) {
																																	return new _SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$(this, expr);
																																} else {
																																	if (expr instanceof NewExpression) {
																																		return new _NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$(this, expr);
																																	} else {
																																		if (expr instanceof FunctionExpression) {
																																			return new _FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$(this, expr);
																																		} else {
																																			if (expr instanceof CommaExpression) {
																																				return new _CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$(this, expr);
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize$()) : expr.toString()));
};

/**
 * @param {ClassDefinition} classDef
 * @param {Array.<undefined|Type>} argTypes
 * @return {!string}
 */
JavaScriptEmitter.prototype._mangleConstructorName$LClassDefinition$ALType$ = function (classDef, argTypes) {
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		if (classDef instanceof InstantiatedClassDefinition) {
			if (classDef.getTemplateClassName$() === "Map") {
				return "Object";
			} else {
				return classDef.getTemplateClassName$();
			}
		} else {
			return classDef.className$();
		}
	}
	return classDef.getOutputClassName$() + this._mangleFunctionArguments$ALType$(argTypes);
};

/**
 * @param {!string} name
 * @param {Array.<undefined|Type>} argTypes
 * @return {!string}
 */
JavaScriptEmitter.prototype._mangleFunctionName$SALType$ = function (name, argTypes) {
	if (name !== "toString") {
		name += this._mangleFunctionArguments$ALType$(argTypes);
	}
	return name;
};

/**
 * @param {Type} type
 * @return {!string}
 */
JavaScriptEmitter.prototype._mangleTypeName$LType$ = function (type) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {Array.<undefined|Type>} */
	var typeArgs;
	if (type.equals$LType$(Type.voidType)) {
		return "V";
	} else {
		if (type.equals$LType$(Type.booleanType)) {
			return "B";
		} else {
			if (type.equals$LType$(Type.integerType)) {
				return "I";
			} else {
				if (type.equals$LType$(Type.numberType)) {
					return "N";
				} else {
					if (type.equals$LType$(Type.stringType)) {
						return "S";
					} else {
						if (type instanceof ObjectType) {
							classDef = type.getClassDef$();
							if (classDef instanceof InstantiatedClassDefinition) {
								typeArgs = classDef.getTypeArguments$();
								switch (classDef.getTemplateClassName$()) {
								case "Array":
									return "A" + this._mangleTypeName$LType$(typeArgs[0]);
								case "Map":
									return "H" + this._mangleTypeName$LType$(typeArgs[0]);
								default:
								}
							}
							return "L" + type.getClassDef$().getOutputClassName$() + "$";
						} else {
							if (type instanceof StaticFunctionType) {
								return "F" + this._mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this._mangleTypeName$LType$(type.getReturnType$()) + "$";
							} else {
								if (type instanceof MemberFunctionType) {
									return "M" + this._mangleTypeName$LType$(type.getObjectType$()) + this._mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this._mangleTypeName$LType$(type.getReturnType$()) + "$";
								} else {
									if (type instanceof NullableType) {
										return "U" + this._mangleTypeName$LType$(type.getBaseType$());
									} else {
										if (type.equals$LType$(Type.variantType)) {
											return "X";
										} else {
											throw new Error("FIXME " + type.toString());
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

/**
 * @param {Array.<undefined|Type>} argTypes
 * @return {!string}
 */
JavaScriptEmitter.prototype._mangleFunctionArguments$ALType$ = function (argTypes) {
	/** @type {!string} */
	var s;
	/** @type {!number} */
	var i;
	s = "$";
	for (i = 0; i < argTypes.length; ++ i) {
		s += this._mangleTypeName$LType$(argTypes[i]);
	}
	return s;
};

/**
 * @param {String} s
 * @return {!string}
 */
JavaScriptEmitter.prototype._mangleTypeString$LString$ = function (s) {
	return (s.length + "") + s;
};

/**
 * @param {ClassDefinition} classDef
 * @param {!string} name
 * @param {!boolean} isStatic
 * @return {Array.<undefined|MemberFunctionDefinition>}
 */
JavaScriptEmitter.prototype._findFunctions$LClassDefinition$SB = function (classDef, name, isStatic) {
	/** @type {Array.<undefined|MemberFunctionDefinition>} */
	var functions;
	/** @type {Array.<undefined|MemberDefinition>} */
	var members;
	/** @type {!number} */
	var i;
	/** @type {MemberDefinition} */
	var member;
	functions = [];
	members = classDef.members$();
	for (i = 0; i < members.length; ++ i) {
		member = members[i];
		if (member instanceof MemberFunctionDefinition && member.name$() === name && (member.flags$() & ClassDefinition.IS_STATIC) === (isStatic ? ClassDefinition.IS_STATIC : 0)) {
			functions.push(member);
		}
	}
	return functions;
};

/**
 * @param {Token} token
 * @param {!string} prefix
 * @param {Array.<undefined|Expression>} args
 * @param {Array.<undefined|Type>} argTypes
 */
JavaScriptEmitter.prototype._emitCallArguments$LToken$SALExpression$ALType$ = function (token, prefix, args, argTypes) {
	/** @type {!number} */
	var i;
	/** @type {Type} */
	var argType;
	this._emit$SLToken$(prefix, token);
	for (i = 0; i < args.length; ++ i) {
		if (i !== 0 || prefix.charAt(prefix.length - 1) !== '(') {
			this._emit$SLToken$(", ", null);
		}
		argType = null;
		if (argTypes != null) {
			if (i < argTypes.length) {
				argType = argTypes[i];
			} else {
				if (argTypes.length !== 0 && argTypes[argTypes.length - 1] instanceof VariableLengthArgumentType) {
					argType = argTypes[argTypes.length - 1];
				}
			}
			if (argType instanceof VariableLengthArgumentType) {
				argType = argType.getBaseType$();
			}
		}
		if (argType != null && ! Type.nullType.isConvertibleTo$LType$(argType)) {
			this._emitWithNullableGuard$LExpression$N(args[i], 0);
		} else {
			this._getExpressionEmitterFor$LExpression$(args[i]).emit$N(0);
		}
	}
	this._emit$SLToken$(")", token);
};

/**
 * @param {*} emitTestExpr
 * @param {Token} token
 * @param {!string} message
 */
JavaScriptEmitter.prototype._emitAssertion$F$V$LToken$S = function (emitTestExpr, token, message) {
	/** @type {!string} */
	var s;
	/** @type {!string} */
	var err;
	this._emit$SLToken$("if (! (", token);
	emitTestExpr();
	this._emit$SLToken$(")) {\n", null);
	this._advanceIndent$();
	this._emit$SLToken$("debugger;\n", null);
	s = Util$makeErrorMessage$LPlatform$SUSNNN(this._platform, message, token.getFilename$(), token.getLineNumber$(), token.getColumnNumber$(), token.getValue$().length);
	err = Util$format$SAS('throw new Error(%1);\n', [ Util$encodeStringLiteral$S(s) ]);
	this._emit$SLToken$(err, token);
	this._reduceIndent$();
	this._emit$SLToken$("}\n", null);
};

/**
 * @param {Expression} expr
 * @param {!number} outerOpPrecedence
 */
JavaScriptEmitter.prototype._emitWithNullableGuard$LExpression$N = function (expr, outerOpPrecedence) {
	var $this = this;
	/** @type {Token} */
	var token;
	if (this._enableRunTimeTypeCheck && expr.getType$() instanceof NullableType) {
		token = expr.getToken$();
		this._emit$SLToken$("(function (v) {\n", token);
		this._advanceIndent$();
		this._emitAssertion$F$V$LToken$S((function () {
			$this._emit$SLToken$("v != null", token);
		}), token, "null access");
		this._emit$SLToken$("return v;\n", token);
		this._reduceIndent$();
		this._emit$SLToken$("}(", token);
		this._getExpressionEmitterFor$LExpression$(expr).emit$N(0);
		this._emit$SLToken$("))", token);
	} else {
		this._getExpressionEmitterFor$LExpression$(expr).emit$N(outerOpPrecedence);
	}
};

/**
 * @param {Expression} expr
 * @param {Type} lhsType
 */
JavaScriptEmitter.prototype._emitRHSOfAssignment$LExpression$LType$ = function (expr, lhsType) {
	/** @type {Type} */
	var exprType;
	exprType = expr.getType$();
	if (lhsType.resolveIfNullable$().equals$LType$(Type.integerType) && exprType.equals$LType$(Type.numberType)) {
		if (expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression) {
			this._emit$SLToken$((expr.getToken$().getValue$() | 0).toString(), expr.getToken$());
		} else {
			this._emit$SLToken$("(", expr.getToken$());
			this._getExpressionEmitterFor$LExpression$(expr).emit$N(_BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
			this._emit$SLToken$(" | 0)", expr.getToken$());
		}
		return;
	}
	if (lhsType.equals$LType$(Type.integerType) && exprType.resolveIfNullable$().equals$LType$(Type.numberType)) {
		this._emit$SLToken$("(", expr.getToken$());
		this._emitWithNullableGuard$LExpression$N(expr, _BinaryNumberExpressionEmitter._operatorPrecedence["|"]);
		this._emit$SLToken$(" | 0)", expr.getToken$());
		return;
	}
	if (lhsType instanceof NullableType && lhsType.getBaseType$().equals$LType$(Type.integerType) && (exprType instanceof NullableType && exprType.getBaseType$().equals$LType$(Type.numberType))) {
		this._emit$SLToken$("(function (v) { return v != null ? v | 0 : v; })(", expr.getToken$());
		this._getExpressionEmitterFor$LExpression$(expr).emit$N(0);
		this._emit$SLToken$(")", expr.getToken$());
		return;
	}
	if (lhsType.equals$LType$(Type.variantType) || lhsType instanceof NullableType) {
		this._getExpressionEmitterFor$LExpression$(expr).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
	} else {
		this._emitWithNullableGuard$LExpression$N(expr, _AssignmentExpressionEmitter._operatorPrecedence["="]);
	}
};

/**
 */
JavaScriptEmitter._initialize$ = function () {
	/** @type {Array.<undefined|Array.<undefined|Object.<string, undefined|*>>>} */
	var precedence;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|Object.<string, undefined|*>>} */
	var opTypeList;
	/** @type {!number} */
	var j;
	/** @type {!string} */
	var key;
	if (JavaScriptEmitter._initialized) {
		return;
	}
	JavaScriptEmitter._initialized = true;
	precedence = [ [ ({ "new": (function (op, precedence) {
		_NewExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "[": (function (op, precedence) {
		_ArrayExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ".": (function (op, precedence) {
		_PropertyExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "(": (function (op, precedence) {
		_CallExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "super": (function (op, precedence) {
		_SuperExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "function": (function (op, precedence) {
		_FunctionExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "++": (function (op, precedence) {
		_PostfixExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "--": (function (op, precedence) {
		_PostfixExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "void": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "typeof": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "++": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "--": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "+": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "-": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "~": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "!": (function (op, precedence) {
		_UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "*": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "/": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "%": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "+": (function (op, precedence) {
		_AdditiveExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "-": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "<<": (function (op, precedence) {
		_ShiftExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">>": (function (op, precedence) {
		_ShiftExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">>>": (function (op, precedence) {
		_ShiftExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "<": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "<=": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">=": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "instanceof": (function (op, precedence) {
		_InstanceofExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "in": (function (op, precedence) {
		_InExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "==": (function (op, precedence) {
		_EqualityExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "!=": (function (op, precedence) {
		_EqualityExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "&": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "^": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "|": (function (op, precedence) {
		_BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "&&": (function (op, precedence) {
		_LogicalExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "||": (function (op, precedence) {
		_LogicalExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "*=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "/=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "%=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "+=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "-=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "<<=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">>=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ ">>>=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "&=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "^=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }), ({ "|=": (function (op, precedence) {
		_AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ "?": (function (op, precedence) {
		_ConditionalExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ], [ ({ ",": (function (op, precedence) {
		_CommaExpressionEmitter$_setOperatorPrecedence$SN(op, precedence);
	}) }) ] ];
	for (i = 0; i < precedence.length; ++ i) {
		opTypeList = precedence[i];
		for (j = 0; j < opTypeList.length; ++ j) {
			for (key in opTypeList[j]) {
				opTypeList[j][key](key, - (precedence.length - i));
			}
		}
	}
};

var JavaScriptEmitter$_initialize$ = JavaScriptEmitter._initialize$;

/**
 * class _Util extends Object
 * @constructor
 */
function _Util() {
}

/**
 * @constructor
 */
function _Util$() {
};

_Util$.prototype = new _Util;

/**
 * @param {*} cb
 * @param {Statement} statement
 * @return {!boolean}
 */
_Util.handleSubStatements$F$ALStatement$B$LStatement$ = function (cb, statement) {
	/** @type {!boolean} */
	var ret;
	ret = false;
	if (statement instanceof ContinuableStatement) {
		if (cb(statement.getStatements$())) {
			ret = true;
		}
	} else {
		if (statement instanceof IfStatement) {
			if (cb(statement.getOnTrueStatements$())) {
				ret = true;
			}
			if (cb(statement.getOnFalseStatements$())) {
				ret = true;
			}
		} else {
			if (statement instanceof SwitchStatement) {
				if (cb(statement.getStatements$())) {
					ret = true;
				}
			} else {
				if (statement instanceof TryStatement) {
					if (cb(statement.getTryStatements$())) {
						ret = true;
					}
					if (cb(statement.getCatchStatements$().map((function (s) {
						return s;
					})))) {
						ret = true;
					}
					if (cb(statement.getFinallyStatements$())) {
						ret = true;
					}
				} else {
					if (statement instanceof CatchStatement) {
						if (cb(statement.getStatements$())) {
							ret = true;
						}
					}
				}
			}
		}
	}
	return ret;
};

var _Util$handleSubStatements$F$ALStatement$B$LStatement$ = _Util.handleSubStatements$F$ALStatement$B$LStatement$;

/**
 * @param {ClassDefinition} classDef
 * @return {!boolean}
 */
_Util.classIsNative$LClassDefinition$ = function (classDef) {
	return ! classDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
		if (classDef.className$() === "Object" || (classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			return true;
		}
		return false;
	}));
};

var _Util$classIsNative$LClassDefinition$ = _Util.classIsNative$LClassDefinition$;

/**
 * @param {Expression} expr
 * @return {!boolean}
 */
_Util.exprHasSideEffects$LExpression$ = function (expr) {
	/** @type {*} */
	var onExpr;
	function onExpr(expr, _) {
		/** @type {MemberFunctionDefinition} */
		var callingFuncDef;
		if (expr instanceof FunctionExpression || expr instanceof NewExpression || expr instanceof AssignmentExpression || expr instanceof PreIncrementExpression || expr instanceof PostIncrementExpression || expr instanceof SuperExpression) {
			return false;
		} else {
			if (expr instanceof CallExpression) {
				callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
				if (callingFuncDef != null && (callingFuncDef.flags$() & ClassDefinition.IS_PURE) !== 0) {
				} else {
					return false;
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	};
	return ! onExpr(expr, null);
};

var _Util$exprHasSideEffects$LExpression$ = _Util.exprHasSideEffects$LExpression$;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {*} optimizeExpressions
 */
_Util.optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$ = function (funcDef, optimizeExpressions) {
	/** @type {*} */
	var optimizeStatements;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	function optimizeStatements(statements) {
		/** @type {!number} */
		var statementIndex;
		/** @type {Array.<undefined|Expression>} */
		var exprsToOptimize;
		/** @type {Array.<undefined|*>} */
		var setOptimizedExprs;
		/** @type {Statement} */
		var statement;
		/** @type {Expression} */
		var expr;
		/** @type {!number} */
		var i;
		statementIndex = 0;
		while (statementIndex < statements.length) {
			exprsToOptimize = [];
			setOptimizedExprs = [];
			while (statementIndex < statements.length) {
				statement = statements[statementIndex++];
				if (statement instanceof ExpressionStatement) {
					exprsToOptimize.push(statement.getExpr$());
					setOptimizedExprs.push((function (statement) {
						return (function (expr) {
							statement.setExpr$LExpression$(expr);
						});
					})(statement));
				} else {
					if (statement instanceof ReturnStatement) {
						expr = statement.getExpr$();
						if (expr != null) {
							exprsToOptimize.push(statement.getExpr$());
							setOptimizedExprs.push((function (statement) {
								return (function (expr) {
									statement.setExpr$LExpression$(expr);
								});
							})(statement));
						}
						break;
					} else {
						statement.handleStatements$F$ALStatement$B$((function (statements) {
							optimizeStatements(statements);
							return true;
						}));
						if (statement instanceof IfStatement) {
							exprsToOptimize.push(statement.getExpr$());
							setOptimizedExprs.push((function (statement) {
								return (function (expr) {
									statement.setExpr$LExpression$(expr);
								});
							})(statement));
						} else {
							if (statement instanceof SwitchStatement) {
								exprsToOptimize.push(statement.getExpr$());
								setOptimizedExprs.push((function (statement) {
									return (function (expr) {
										statement.setExpr$LExpression$(expr);
									});
								})(statement));
							}
						}
						break;
					}
				}
			}
			if (exprsToOptimize.length !== 0) {
				optimizeExpressions(exprsToOptimize);
				for (i = 0; i < exprsToOptimize.length; ++ i) {
					setOptimizedExprs[i](exprsToOptimize[i]);
				}
			}
		}
	};
	statements = funcDef.getStatements$();
	if (statements != null) {
		optimizeStatements(statements);
	}
};

var _Util$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$ = _Util.optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$;

/**
 * class Optimizer extends Object
 * @constructor
 */
function Optimizer() {
}

/**
 * @constructor
 */
function Optimizer$() {
	this._compiler = null;
	this._commands = [];
	this._log = [];
	this._dumpLogs = false;
	this._enableRunTimeTypeCheck = true;
};

Optimizer$.prototype = new Optimizer;

/**
 * @return {Array.<undefined|!string>}
 */
Optimizer.getReleaseOptimizationCommands$ = function () {
	return [ "lto", "no-assert", "no-log", "no-debug", "staticize", "fold-const", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify" ];
};

var Optimizer$getReleaseOptimizationCommands$ = Optimizer.getReleaseOptimizationCommands$;

/**
 * @param {Array.<undefined|!string>} cmds
 * @return {undefined|!string}
 */
Optimizer.prototype.setup$AS = function (cmds) {
	var $this = this;
	/** @type {!boolean} */
	var calleesAreDetermined;
	/** @type {*} */
	var determineCallee;
	/** @type {!number} */
	var i;
	/** @type {undefined|!string} */
	var cmd;
	calleesAreDetermined = false;
	function determineCallee() {
		if (! calleesAreDetermined) {
			$this._commands.push(new _DetermineCalleeCommand$());
			calleesAreDetermined = true;
		}
	};
	for (i = 0; i < cmds.length; ++ i) {
		cmd = cmds[i];
		if (cmd == "lto") {
			this._commands.push(new _LinkTimeOptimizationCommand$());
		} else {
			if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand$());
			} else {
				if (cmd == "no-log") {
					this._commands.push(new _NoLogCommand$());
				} else {
					if (cmd == "no-debug") {
						this._commands.push(new _NoDebugCommand$());
					} else {
						if (cmd == "staticize") {
							this._commands.push(new _StaticizeOptimizeCommand$());
							calleesAreDetermined = false;
						} else {
							if (cmd == "unclassify") {
								this._commands.push(new _UnclassifyOptimizationCommand$());
								calleesAreDetermined = false;
							} else {
								if (cmd == "fold-const") {
									this._commands.push(new _FoldConstantCommand$());
								} else {
									if (cmd == "dce") {
										determineCallee();
										this._commands.push(new _DeadCodeEliminationOptimizeCommand$());
									} else {
										if (cmd == "inline") {
											determineCallee();
											this._commands.push(new _InlineOptimizeCommand$());
										} else {
											if (cmd == "return-if") {
												this._commands.push(new _ReturnIfOptimizeCommand$());
											} else {
												if (cmd == "lcse") {
													this._commands.push(new _LCSEOptimizeCommand$());
												} else {
													if (cmd == "unbox") {
														determineCallee();
														this._commands.push(new _UnboxOptimizeCommand$());
													} else {
														if (cmd == "array-length") {
															this._commands.push(new _ArrayLengthOptimizeCommand$());
														} else {
															if (cmd == "dump-logs") {
																this._dumpLogs = true;
															} else {
																return "unknown optimization command: " + cmd;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	for (i = 0; i < this._commands.length; ++ i) {
		if (this._commands[i] instanceof _LinkTimeOptimizationCommand) {
			break;
		}
	}
	if (i !== this._commands.length) {
		this._commands.unshift(this._commands.splice(i, 1)[0]);
	}
	return null;
};

/**
 * @return {!boolean}
 */
Optimizer.prototype.enableRuntimeTypeCheck$ = function () {
	return this._enableRunTimeTypeCheck;
};

/**
 * @param {!boolean} mode
 */
Optimizer.prototype.setEnableRunTimeTypeCheck$B = function (mode) {
	this._enableRunTimeTypeCheck = mode;
};

/**
 * @param {Compiler} compiler
 * @return {Optimizer}
 */
Optimizer.prototype.setCompiler$LCompiler$ = function (compiler) {
	this._compiler = compiler;
	return this;
};

/**
 * @return {Compiler}
 */
Optimizer.prototype.getCompiler$ = function () {
	return this._compiler;
};

/**
 */
Optimizer.prototype.performOptimization$ = function () {
	/** @type {!number} */
	var i;
	/** @type {Platform} */
	var platform;
	for (i = 0; i < this._commands.length; ++ i) {
		try {
			this.log$S("starting optimizer: " + this._commands[i]._identifier);
			this._commands[i].setup$LOptimizer$(this).performOptimization$();
			this.log$S("finished optimizer: " + this._commands[i]._identifier);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				platform = this._compiler.getPlatform$();
				platform.error$S("fatal error: optimizer '" + this._commands[i]._identifier + "' died unexpectedly, dumping the logs");
				this.dumpLogs$();
				throw $__jsx_catch_0;
			} else {
				throw $__jsx_catch_0;
			}
		}
	}
	if (this._dumpLogs) {
		this.dumpLogs$();
	}
};

/**
 * @param {!string} message
 */
Optimizer.prototype.log$S = function (message) {
	this._log.push(message);
};

/**
 */
Optimizer.prototype.dumpLogs$ = function () {
	/** @type {Platform} */
	var platform;
	/** @type {!number} */
	var i;
	platform = this._compiler.getPlatform$();
	for (i = 0; i < this._log.length; ++ i) {
		platform.error$S(this._log[i]);
	}
};

/**
 * class _OptimizeCommand extends Object
 * @constructor
 */
function _OptimizeCommand() {
}

/**
 * @constructor
 * @param {!string} identifier
 */
function _OptimizeCommand$S(identifier) {
	this._identifier = identifier;
	this._optimizer = null;
};

_OptimizeCommand$S.prototype = new _OptimizeCommand;

/**
 * @param {Optimizer} optimizer
 * @return {_OptimizeCommand}
 */
_OptimizeCommand.prototype.setup$LOptimizer$ = function (optimizer) {
	this._optimizer = optimizer;
	return this;
};

/**
 * @return {Compiler}
 */
_OptimizeCommand.prototype.getCompiler$ = function () {
	return this._optimizer.getCompiler$();
};

/**
 * @param {Stashable} stashable
 * @return {OptimizerStash}
 */
_OptimizeCommand.prototype.getStash$LStashable$ = function (stashable) {
	/** @type {Object.<string, undefined|OptimizerStash>} */
	var stash;
	stash = stashable.getOptimizerStash$();
	if (stash[this._identifier] == null) {
		stash[this._identifier] = this._createStash$();
	}
	return stash[this._identifier];
};

/**
 * @return {OptimizerStash}
 */
_OptimizeCommand.prototype._createStash$ = function () {
	throw new Error("if you are going to use the stash, you need to override this function");
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Type} type
 * @param {!string} baseName
 * @return {LocalVariable}
 */
_OptimizeCommand.prototype.createVar$LMemberFunctionDefinition$LType$S = function (funcDef, type, baseName) {
	var $this = this;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {*} */
	var nameExists;
	/** @type {!number} */
	var i;
	/** @type {LocalVariable} */
	var newLocal;
	locals = funcDef.getLocals$();
	function nameExists(n) {
		/** @type {!number} */
		var i;
		for (i = 0; i < locals.length; ++ i) {
			if (locals[i].getName$().getValue$() === n) {
				return true;
			}
		}
		return false;
	};
	for (i = 0; nameExists(baseName + "$" + (i + "")); ++ i) {
	}
	newLocal = new LocalVariable$LToken$LType$(new Token$SB(baseName + "$" + (i + ""), false), type);
	locals.push(newLocal);
	this.log$S("rewriting " + baseName + " to " + newLocal.getName$().getValue$());
	return newLocal;
};

/**
 * @param {!string} message
 */
_OptimizeCommand.prototype.log$S = function (message) {
	this._optimizer.log$S("[" + this._identifier + "] " + message);
};

/**
 * @param {_OptimizeCommand} command
 * @return {_OptimizeCommand}
 */
_OptimizeCommand.prototype.setupCommand$L_OptimizeCommand$ = function (command) {
	command.setup$LOptimizer$(this._optimizer);
	return command;
};

/**
 * class _FunctionOptimizeCommand extends _OptimizeCommand
 * @constructor
 */
function _FunctionOptimizeCommand() {
}

_FunctionOptimizeCommand.prototype = new _OptimizeCommand;
/**
 * @constructor
 * @param {!string} identifier
 */
function _FunctionOptimizeCommand$S(identifier) {
	_OptimizeCommand$S.call(this, identifier);
	this._excludeNative = false;
};

_FunctionOptimizeCommand$S.prototype = new _FunctionOptimizeCommand;

/**
 */
_FunctionOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	/** @type {*} */
	var doit;
	function doit(funcDef) {
		$this.log$S("starting optimization of " + funcDef.getNotation$());
		$this.optimizeFunction$LMemberFunctionDefinition$(funcDef);
		$this.log$S("finished optimization of " + funcDef.getNotation$());
	};
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			if (funcDef.getStatements$() != null) {
				doit(funcDef);
			}
			funcDef.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
				doit(funcDef);
				return true;
			}));
			return true;
		}));
		return true;
	}));
};

/**
 * class _LinkTimeOptimizationCommand extends _OptimizeCommand
 * @constructor
 */
function _LinkTimeOptimizationCommand() {
}

_LinkTimeOptimizationCommand.prototype = new _OptimizeCommand;
/**
 * @constructor
 */
function _LinkTimeOptimizationCommand$() {
	_OptimizeCommand$S.call(this, _LinkTimeOptimizationCommand.IDENTIFIER);
};

_LinkTimeOptimizationCommand$.prototype = new _LinkTimeOptimizationCommand;

/**
 * @return {OptimizerStash}
 */
_LinkTimeOptimizationCommand.prototype._createStash$ = function () {
	return new _LinkTimeOptimizationCommand$CStash$();
};

/**
 */
_LinkTimeOptimizationCommand.prototype.performOptimization$ = function () {
	var $this = this;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		/** @type {!number} */
		var i;
		if (classDef.extendType$() != null) {
			$this.getStash$LStashable$(classDef.extendType$().getClassDef$()).extendedBy.push(classDef);
		}
		for (i = 0; i < classDef.implementTypes$().length; ++ i) {
			$this.getStash$LStashable$(classDef.implementTypes$()[i].getClassDef$()).extendedBy.push(classDef);
		}
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) === 0 && $this.getStash$LStashable$(classDef).extendedBy.length === 0) {
			$this.log$S("marking class as final: " + classDef.className$());
			classDef.setFlags$N(classDef.flags$() | ClassDefinition.IS_FINAL);
			classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				if ((funcDef.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) === 0) {
					funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_FINAL);
				}
				return true;
			}));
		} else {
			if ((classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) === 0) {
				classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
					/** @type {Array.<undefined|MemberFunctionDefinition>} */
					var overrides;
					if ((funcDef.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) !== 0) {
					} else {
						if ((funcDef.flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
							if (funcDef.getStatements$() == null) {
								throw new Error("a non-native, non-abstract function with out function body?");
							}
							overrides = $this._getOverrides$LClassDefinition$ALClassDefinition$SALType$(classDef, $this.getStash$LStashable$(classDef).extendedBy, funcDef.name$(), funcDef.getArgumentTypes$());
							if (overrides.length === 0) {
								$this.log$S("marking function as final: " + funcDef.getNotation$());
								funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_FINAL);
							} else {
								$this.log$S("function has overrides, not marking as final: " + funcDef.getNotation$());
							}
						} else {
							if ((funcDef.flags$() & ClassDefinition.IS_ABSTRACT) !== 0) {
							}
						}
					}
					return true;
				}));
			}
		}
		return true;
	}));
};

/**
 * @param {ClassDefinition} srcClassDef
 * @param {Array.<undefined|ClassDefinition>} classDefs
 * @param {!string} name
 * @param {Array.<undefined|Type>} argTypes
 * @return {Array.<undefined|MemberFunctionDefinition>}
 */
_LinkTimeOptimizationCommand.prototype._getOverrides$LClassDefinition$ALClassDefinition$SALType$ = function (srcClassDef, classDefs, name, argTypes) {
	/** @type {Array.<undefined|MemberFunctionDefinition>} */
	var overrides;
	/** @type {!number} */
	var i;
	overrides = [];
	for (i = 0; i < classDefs.length; ++ i) {
		overrides = overrides.concat(this._getOverridesByClass$LClassDefinition$LClassDefinition$SALType$(srcClassDef, classDefs[i], name, argTypes));
	}
	return overrides;
};

/**
 * @param {ClassDefinition} srcClassDef
 * @param {ClassDefinition} classDef
 * @param {!string} name
 * @param {Array.<undefined|Type>} argTypes
 * @return {Array.<undefined|MemberFunctionDefinition>}
 */
_LinkTimeOptimizationCommand.prototype._getOverridesByClass$LClassDefinition$LClassDefinition$SALType$ = function (srcClassDef, classDef, name, argTypes) {
	var $this = this;
	/** @type {Array.<undefined|MemberFunctionDefinition>} */
	var overrides;
	/** @type {*} */
	var addOverride;
	/** @type {Array.<undefined|ClassDefinition>} */
	var implementClassDefs;
	/** @type {!number} */
	var i;
	overrides = this._getOverrides$LClassDefinition$ALClassDefinition$SALType$(srcClassDef, this.getStash$LStashable$(classDef).extendedBy, name, argTypes);
	function addOverride(funcDef) {
		if (funcDef.name$() === name && (funcDef.flags$() & ClassDefinition.IS_ABSTRACT) === 0 && Util$typesAreEqual$ALType$ALType$(funcDef.getArgumentTypes$(), argTypes)) {
			overrides.push(funcDef);
			return false;
		}
		return true;
	};
	classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(addOverride);
	implementClassDefs = classDef.implementTypes$().map((function (type) {
		return type.getClassDef$();
	}));
	for (i = 0; i < implementClassDefs.length; ++ i) {
		if (srcClassDef != implementClassDefs[i]) {
			implementClassDefs[i].forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				return classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(addOverride);
			}));
		}
	}
	return overrides;
};

/**
 * class _NoAssertCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _NoAssertCommand() {
}

_NoAssertCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _NoAssertCommand$() {
	_FunctionOptimizeCommand$S.call(this, _NoAssertCommand.IDENTIFIER);
};

_NoAssertCommand$.prototype = new _NoAssertCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_NoAssertCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	return true;
};

/**
 * @param {Array.<undefined|Statement>} statements
 */
_NoAssertCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	var $this = this;
	/** @type {*} */
	var optimize;
	function optimize(statements) {
		/** @type {!number} */
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof AssertStatement) {
				statements.splice(i, 1);
			} else {
				_Util$handleSubStatements$F$ALStatement$B$LStatement$(optimize, statements[i]);
				++ i;
			}
		}
		return false;
	};
	optimize(statements);
};

/**
 * class _NoLogCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _NoLogCommand() {
}

_NoLogCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _NoLogCommand$() {
	_FunctionOptimizeCommand$S.call(this, _NoLogCommand.IDENTIFIER);
};

_NoLogCommand$.prototype = new _NoLogCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_NoLogCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	return true;
};

/**
 * @param {Array.<undefined|Statement>} statements
 */
_NoLogCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	var $this = this;
	/** @type {*} */
	var optimize;
	function optimize(statements) {
		/** @type {!number} */
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof LogStatement) {
				statements.splice(i, 1);
			} else {
				_Util$handleSubStatements$F$ALStatement$B$LStatement$(optimize, statements[i]);
				++ i;
			}
		}
		return false;
	};
	optimize(statements);
};

/**
 * class _DetermineCalleeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _DetermineCalleeCommand() {
}

_DetermineCalleeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _DetermineCalleeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _DetermineCalleeCommand.IDENTIFIER);
};

_DetermineCalleeCommand$.prototype = new _DetermineCalleeCommand;

/**
 * @return {OptimizerStash}
 */
_DetermineCalleeCommand.prototype._createStash$ = function () {
	return new _DetermineCalleeCommand$CStash$();
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_DetermineCalleeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		/** @type {MemberFunctionDefinition} */
		var callingFuncDef;
		if (statement instanceof ConstructorInvocationStatement) {
			callingFuncDef = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(statement.getConstructingClassDef$(), "constructor", statement.getConstructorType$().getArgumentTypes$(), false);
			if (callingFuncDef == null) {
				throw new Error("could not determine the associated parent ctor");
			}
			$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(statement, callingFuncDef);
		}
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			/** @type {Expression} */
			var calleeExpr;
			/** @type {PropertyExpression} */
			var propertyExpr;
			/** @type {Type} */
			var holderType;
			/** @type {MemberFunctionDefinition} */
			var callingFuncDef;
			if (expr instanceof CallExpression) {
				calleeExpr = expr.getExpr$();
				if (calleeExpr instanceof PropertyExpression && ! calleeExpr.getType$().isAssignable$()) {
					propertyExpr = calleeExpr;
					holderType = propertyExpr.getHolderType$();
					callingFuncDef = _DetermineCalleeCommand$findCallingFunction$LClassDefinition$SALType$B(holderType.getClassDef$(), propertyExpr.getIdentifierToken$().getValue$(), propertyExpr.getType$().getArgumentTypes$(), propertyExpr.getExpr$() instanceof ClassExpression);
					$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, callingFuncDef);
				} else {
					if (calleeExpr instanceof FunctionExpression) {
						$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, calleeExpr.getFuncDef$());
					} else {
						$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, null);
					}
				}
			} else {
				if (expr instanceof NewExpression) {
					callingFuncDef = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(expr.getType$().getClassDef$(), "constructor", expr.getConstructor$().getArgumentTypes$(), false);
					if (callingFuncDef == null) {
						throw new Error("could not find matching constructor for " + expr.getConstructor$().toString());
					}
					$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, callingFuncDef);
				}
			}
			if (expr instanceof FunctionExpression) {
				return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			} else {
				return expr.forEachExpression$F$LExpression$B$(onExpr);
			}
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	return true;
};

/**
 * @param {Stashable} stashable
 * @param {MemberFunctionDefinition} funcDef
 */
_DetermineCalleeCommand.prototype._setCallingFuncDef$LStashable$LMemberFunctionDefinition$ = function (stashable, funcDef) {
	this.getStash$LStashable$(stashable).callingFuncDef = funcDef;
};

/**
 * @param {ClassDefinition} classDef
 * @param {!string} funcName
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {MemberFunctionDefinition}
 */
_DetermineCalleeCommand.findCallingFunctionInClass$LClassDefinition$SALType$B = function (classDef, funcName, argTypes, isStatic) {
	/** @type {MemberFunctionDefinition} */
	var found;
	found = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic);
	if (found != null) {
		if ((found.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) === 0) {
			found = null;
		}
	}
	return found;
};

var _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B = _DetermineCalleeCommand.findCallingFunctionInClass$LClassDefinition$SALType$B;

/**
 * @param {ClassDefinition} classDef
 * @param {!string} funcName
 * @param {Array.<undefined|Type>} argTypes
 * @param {!boolean} isStatic
 * @return {MemberFunctionDefinition}
 */
_DetermineCalleeCommand.findCallingFunction$LClassDefinition$SALType$B = function (classDef, funcName, argTypes, isStatic) {
	/** @type {MemberFunctionDefinition} */
	var found;
	found = null;
	classDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
		if ((found = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic)) != null) {
			return false;
		}
		return true;
	}));
	return found;
};

var _DetermineCalleeCommand$findCallingFunction$LClassDefinition$SALType$B = _DetermineCalleeCommand.findCallingFunction$LClassDefinition$SALType$B;

/**
 * @param {Stashable} stashable
 * @return {MemberFunctionDefinition}
 */
_DetermineCalleeCommand.getCallingFuncDef$LStashable$ = function (stashable) {
	/** @type {_DetermineCalleeCommand$CStash} */
	var stash;
	stash = stashable.getOptimizerStash$()[_DetermineCalleeCommand.IDENTIFIER];
	if (stash == null) {
		throw new Error("callee not searched");
	}
	return stash.callingFuncDef;
};

var _DetermineCalleeCommand$getCallingFuncDef$LStashable$ = _DetermineCalleeCommand.getCallingFuncDef$LStashable$;

/**
 * class _StaticizeOptimizeCommand extends _OptimizeCommand
 * @constructor
 */
function _StaticizeOptimizeCommand() {
}

_StaticizeOptimizeCommand.prototype = new _OptimizeCommand;
/**
 * @constructor
 */
function _StaticizeOptimizeCommand$() {
	_OptimizeCommand$S.call(this, _StaticizeOptimizeCommand.IDENTIFIER);
};

_StaticizeOptimizeCommand$.prototype = new _StaticizeOptimizeCommand;

/**
 */
_StaticizeOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
			return true;
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFunction(funcDef) {
			if ((funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) === ClassDefinition.IS_FINAL && funcDef.name$() !== "constructor") {
				$this.log$S("rewriting method to static function: " + funcDef.name$());
				$this._rewriteFunctionAsStatic$LMemberFunctionDefinition$(funcDef);
			}
			return true;
		}));
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		/** @type {*} */
		var onFunction;
		$this.log$S("rewriting member method calls in class: " + classDef.className$());
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if (varDef.getInitialValue$() == null) {
				return true;
			}
			$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$(varDef.getInitialValue$(), (function (expr) {
				varDef.setInitialValue$LExpression$(expr);
			}));
			return true;
		}));
		function onFunction(funcDef) {
			/** @type {*} */
			var onStatement;
			function onStatement(statement) {
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$(expr, replaceCb);
					return true;
				}));
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			};
			funcDef.forEachStatement$F$LStatement$B$(onStatement);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		};
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFunction);
		return true;
	}));
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
_StaticizeOptimizeCommand.prototype._rewriteFunctionAsStatic$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {ArgumentDeclaration} */
	var thisArg;
	thisArg = new ArgumentDeclaration$LToken$LType$(new Token$SB("$this", false), new ObjectType$LClassDefinition$(funcDef.getClassDef$()));
	funcDef.getArguments$().unshift(thisArg);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression$LToken$LLocalVariable$(thisArg.getName$(), thisArg));
			} else {
				if (expr instanceof FunctionExpression) {
					return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
				}
			}
			return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		})) && statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_STATIC);
};

/**
 * @param {Expression} expr
 * @param {*} replaceCb
 */
_StaticizeOptimizeCommand.prototype._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	/** @type {*} */
	var onExpr;
	onExpr = (function (expr, replaceCb) {
		/** @type {Expression} */
		var calleeExpr;
		/** @type {PropertyExpression} */
		var propertyExpr;
		/** @type {Type} */
		var receiverType;
		/** @type {Pair$ClassDefinition$MemberFunctionDefinition$E} */
		var found;
		/** @type {ClassDefinition} */
		var classDef;
		/** @type {MemberFunctionDefinition} */
		var funcDef;
		if (expr instanceof CallExpression) {
			calleeExpr = expr.getExpr$();
			if (calleeExpr instanceof PropertyExpression && ! (calleeExpr.getExpr$() instanceof ClassExpression) && ! calleeExpr.getType$().isAssignable$()) {
				propertyExpr = calleeExpr;
				receiverType = propertyExpr.getExpr$().getType$().resolveIfNullable$();
				if ((receiverType.getClassDef$().flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
					found = $this._findRewrittenFunctionInClass$LType$SALType$B(receiverType, propertyExpr.getIdentifierToken$().getValue$(), propertyExpr.getType$().getArgumentTypes$(), true);
					(classDef = found.first, funcDef = found.second);
					if (funcDef != null && (funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) === ClassDefinition.IS_FINAL && funcDef.name$() !== "constructor") {
						onExpr(propertyExpr.getExpr$(), (function (expr) {
							propertyExpr.setExpr$LExpression$(expr);
						}));
						Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
						replaceCb(new CallExpression$LToken$LExpression$ALExpression$(expr.getToken$(), new PropertyExpression$LToken$LExpression$LToken$ALType$LType$(propertyExpr.getToken$(), new ClassExpression$LToken$LType$(new Token$SB(classDef.className$(), true), new ObjectType$LClassDefinition$(classDef)), propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), funcDef.getType$()), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
						return true;
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	onExpr(expr, replaceCb);
};

/**
 * @param {Type} type
 * @param {!string} funcName
 * @param {Array.<undefined|Type>} beforeArgTypes
 * @param {!boolean} isStatic
 * @return {Pair$ClassDefinition$MemberFunctionDefinition$E}
 */
_StaticizeOptimizeCommand.prototype._findRewrittenFunctionInClass$LType$SALType$B = function (type, funcName, beforeArgTypes, isStatic) {
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {MemberFunctionDefinition} */
	var funcDef;
	for (; ; ) {
		classDef = type.getClassDef$();
		if (classDef.className$() === "Object") {
			funcDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, [ type ].concat(beforeArgTypes), isStatic);
			break;
		}
		if ((funcDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, [ type ].concat(beforeArgTypes), isStatic)) != null) {
			break;
		}
		type = classDef.extendType$();
	}
	return new Pair$ClassDefinition$MemberFunctionDefinition$E$LClassDefinition$LMemberFunctionDefinition$(classDef, funcDef);
};

/**
 * class _UnclassifyOptimizationCommand extends _OptimizeCommand
 * @constructor
 */
function _UnclassifyOptimizationCommand() {
}

_UnclassifyOptimizationCommand.prototype = new _OptimizeCommand;
/**
 * @constructor
 */
function _UnclassifyOptimizationCommand$() {
	_OptimizeCommand$S.call(this, _UnclassifyOptimizationCommand.IDENTIFIER);
};

_UnclassifyOptimizationCommand$.prototype = new _UnclassifyOptimizationCommand;

/**
 * @return {OptimizerStash}
 */
_UnclassifyOptimizationCommand.prototype._createStash$ = function () {
	return new _UnclassifyOptimizationCommand$CStash$();
};

/**
 */
_UnclassifyOptimizationCommand.prototype.performOptimization$ = function () {
	var $this = this;
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	classDefs = this._getClassesToUnclassify$();
	classDefs.forEach((function (classDef) {
		$this.log$S("unclassifying class: " + classDef.className$());
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFunction(funcDef) {
			if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0 && funcDef.name$() !== "constructor") {
				$this.log$S("rewriting method to static function: " + funcDef.name$());
				$this._rewriteFunctionAsStatic$LMemberFunctionDefinition$(funcDef);
			}
			return true;
		}));
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		/** @type {*} */
		var onFunction;
		$this.log$S("rewriting member method calls in class: " + classDef.className$());
		function onFunction(funcDef) {
			/** @type {*} */
			var onStatement;
			function onStatement(statement) {
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$(expr, replaceCb, classDefs);
					return true;
				}));
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			};
			funcDef.forEachStatement$F$LStatement$B$(onStatement);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		};
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFunction);
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
				if (varDef.getInitialValue$() != null) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$(varDef.getInitialValue$(), (function (expr) {
						varDef.setInitialValue$LExpression$(expr);
					}), classDefs);
				}
			}
			return true;
		}));
		return true;
	}));
};

/**
 * @return {Array.<undefined|ClassDefinition>}
 */
_UnclassifyOptimizationCommand.prototype._getClassesToUnclassify$ = function () {
	var $this = this;
	/** @type {Array.<undefined|ClassDefinition>} */
	var candidates;
	/** @type {!number} */
	var candidateIndex;
	/** @type {!boolean} */
	var hasInlineableCtor;
	candidates = [];
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) === ClassDefinition.IS_FINAL && classDef.extendType$().getClassDef$().className$() === "Object" && classDef.implementTypes$().length === 0 && classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			return (funcDef.flags$() & ClassDefinition.IS_OVERRIDE) === 0;
		}))) {
			candidates.push(classDef);
		}
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		/** @type {*} */
		var onExpr;
		if (candidates.length === 0) {
			return false;
		}
		function onExpr(expr) {
			/** @type {!number} */
			var foundClassDefIndex;
			if (! (expr != null)) {
				debugger;
				throw new Error("[src/optimizer.jsx:910:28] assertion failure\n                assert expr != null;\n                            ^^\n");
			}
			if (expr instanceof InstanceofExpression) {
				foundClassDefIndex = candidates.indexOf(expr.getExpectedType$().getClassDef$());
				if (foundClassDefIndex !== - 1) {
					candidates.splice(foundClassDefIndex, 1);
					if (candidates.length === 0) {
						return false;
					}
				}
			} else {
				if (expr instanceof AsExpression && expr.getType$() instanceof ObjectType) {
					foundClassDefIndex = candidates.indexOf(expr.getType$().getClassDef$());
					if (foundClassDefIndex !== - 1) {
						candidates.splice(foundClassDefIndex, 1);
						if (candidates.length === 0) {
							return false;
						}
					}
				}
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		};
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFunction(funcDef) {
			funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
				statement.forEachExpression$F$LExpression$B$(onExpr);
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			}));
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}));
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
				if (varDef.getInitialValue$() != null) {
					onExpr(varDef.getInitialValue$());
				}
			}
			return true;
		}));
		return true;
	}));
	for (candidateIndex = candidates.length - 1; candidateIndex >= 0; -- candidateIndex) {
		hasInlineableCtor = false;
		candidates[candidateIndex].forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			/** @type {*} */
			var inliner;
			if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0 && funcDef.name$() === "constructor") {
				inliner = $this._createInliner$LMemberFunctionDefinition$(funcDef);
				$this.log$S(funcDef.getNotation$() + " is" + (inliner ? "" : " not") + " inlineable");
				if (inliner) {
					$this.getStash$LStashable$(funcDef).inliner = inliner;
					hasInlineableCtor = true;
				}
			}
			return true;
		}));
		if (! hasInlineableCtor) {
			candidates.splice(candidateIndex, 1);
		}
	}
	if (candidates.length === 0) {
		return candidates;
	}
	return candidates;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {*}
 */
_UnclassifyOptimizationCommand.prototype._createInliner$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {Array.<undefined|!string>} */
	var propertyNames;
	/** @type {Array.<undefined|Expression>} */
	var propertyExprs;
	/** @type {!number} */
	var initializePropertyIndex;
	/** @type {!number} */
	var expectedArgIndex;
	/** @type {Array.<undefined|Statement>} */
	var statements;
	/** @type {!number} */
	var statementIndex;
	/** @type {Expression} */
	var statementExpr;
	/** @type {Expression} */
	var lhsExpr;
	/** @type {*} */
	var onRHSExpr;
	/** @type {!number} */
	var propertyIndex;
	/** @type {!number} */
	var i;
	if (funcDef.getLocals$().length !== 0) {
		return null;
	}
	propertyNames = [];
	funcDef.getClassDef$().forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		if ((member.flags$() & ClassDefinition.IS_STATIC) === 0) {
			propertyNames.push(member.name$());
		}
		return true;
	}));
	propertyExprs = [];
	initializePropertyIndex = 0;
	expectedArgIndex = 0;
	statements = funcDef.getStatements$();
	if (statements.length !== propertyNames.length) {
		return null;
	}
	for (statementIndex = 0; statementIndex < statements.length; ++ statementIndex) {
		if (! (statements[statementIndex] instanceof ExpressionStatement)) {
			return null;
		}
		statementExpr = statements[statementIndex].getExpr$();
		if (! (statementExpr instanceof AssignmentExpression)) {
			return null;
		}
		lhsExpr = statementExpr.getFirstExpr$();
		if (! (lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$() instanceof ThisExpression)) {
			return null;
		}
		onRHSExpr = (function (expr) {
			/** @type {!number} */
			var argIndex;
			if (expr instanceof AssignmentExpression || expr instanceof PreIncrementExpression || expr instanceof PostIncrementExpression) {
				return false;
			} else {
				if (expr instanceof FunctionExpression) {
					return false;
				} else {
					if (expr instanceof ThisExpression) {
						return false;
					} else {
						if (expr instanceof LocalExpression) {
							argIndex = funcDef.getArguments$().map((function (i) {
								return i;
							})).indexOf(expr.getLocal$());
							if (argIndex === - 1) {
								throw new Error("logic flaw; could not find argument: " + expr.getLocal$().getName$().getValue$());
							}
							if (expectedArgIndex !== argIndex) {
								return false;
							}
							++ expectedArgIndex;
						}
					}
				}
			}
			return expr.forEachExpression$F$LExpression$B$(onRHSExpr);
		});
		if (! onRHSExpr(statementExpr.getSecondExpr$())) {
			return null;
		}
		propertyIndex = propertyNames.indexOf(lhsExpr.getIdentifierToken$().getValue$());
		if (propertyIndex === - 1) {
			throw new Error("logic flaw; could not find property: " + lhsExpr.getIdentifierToken$().getValue$());
		}
		if (propertyExprs[propertyIndex]) {
			return null;
		}
		for (i = propertyIndex + 1; i < propertyNames.length; ++ i) {
			if (propertyExprs[i] != null && _Util$exprHasSideEffects$LExpression$(propertyExprs[i])) {
				return null;
			}
		}
		propertyExprs[propertyIndex] = statementExpr.getSecondExpr$().clone$();
	}
	return (function (newExpr) {
		return propertyExprs.map((function (expr) {
			/** @type {*} */
			var onExpr;
			function onExpr(expr, replaceCb) {
				/** @type {Array.<undefined|ArgumentDeclaration>} */
				var args;
				/** @type {!number} */
				var argIndex;
				/** @type {!number} */
				var i;
				if (expr instanceof LocalExpression) {
					(args = funcDef.getArguments$(), argIndex = - 1);
					for (i in args) {
						if (args[i] == expr.getLocal$()) {
							argIndex = i;
							break;
						}
					}
					if (argIndex === - 1) {
						throw new Error("logic flaw");
					}
					replaceCb(newExpr.getArguments$()[argIndex]);
					return true;
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			};
			expr = expr.clone$();
			onExpr(expr, (function (newExpr) {
				expr = newExpr;
			}));
			return expr;
		}));
	});
};

/**
 * @param {MemberFunctionDefinition} funcDef
 */
_UnclassifyOptimizationCommand.prototype._rewriteFunctionAsStatic$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {ArgumentDeclaration} */
	var thisArg;
	thisArg = new ArgumentDeclaration$LToken$LType$(new Token$SB("$this", false), new ObjectType$LClassDefinition$(funcDef.getClassDef$()));
	funcDef.getArguments$().unshift(thisArg);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression$LToken$LLocalVariable$(thisArg.getName$(), thisArg));
			} else {
				if (expr instanceof FunctionExpression) {
					return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
				}
			}
			return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		})) && statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_STATIC);
};

/**
 * @param {Expression} expr
 * @param {*} replaceCb
 * @param {Array.<undefined|ClassDefinition>} unclassifyingClassDefs
 */
_UnclassifyOptimizationCommand.prototype._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$ = function (expr, replaceCb, unclassifyingClassDefs) {
	var $this = this;
	/** @type {*} */
	var onExpr;
	onExpr = (function (expr, replaceCb) {
		/** @type {Expression} */
		var calleeExpr;
		/** @type {PropertyExpression} */
		var propertyExpr;
		/** @type {Type} */
		var receiverType;
		/** @type {ClassDefinition} */
		var receiverClassDef;
		/** @type {Type} */
		var funcType;
		if (expr instanceof CallExpression) {
			calleeExpr = expr.getExpr$();
			if (calleeExpr instanceof PropertyExpression && ! (calleeExpr.getExpr$() instanceof ClassExpression) && ! calleeExpr.getType$().isAssignable$()) {
				propertyExpr = calleeExpr;
				receiverType = propertyExpr.getExpr$().getType$().resolveIfNullable$();
				receiverClassDef = receiverType.getClassDef$();
				if (unclassifyingClassDefs.indexOf(receiverClassDef) !== - 1) {
					onExpr(propertyExpr.getExpr$(), (function (expr) {
						propertyExpr.setExpr$LExpression$(expr);
					}));
					Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
					funcType = propertyExpr.getType$();
					replaceCb(new CallExpression$LToken$LExpression$ALExpression$(expr.getToken$(), new PropertyExpression$LToken$LExpression$LToken$ALType$LType$(propertyExpr.getToken$(), new ClassExpression$LToken$LType$(new Token$SB(receiverClassDef.className$(), true), receiverType), propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), new StaticFunctionType$LToken$LType$ALType$B(null, funcType.getReturnType$(), [ receiverType ].concat(funcType.getArgumentTypes$()), false)), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
					return true;
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	onExpr(expr, replaceCb);
};

/**
 * class _FoldConstantCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _FoldConstantCommand() {
}

_FoldConstantCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _FoldConstantCommand$() {
	_FunctionOptimizeCommand$S.call(this, _FoldConstantCommand.IDENTIFIER);
};

_FoldConstantCommand$.prototype = new _FoldConstantCommand;

/**
 * @return {OptimizerStash}
 */
_FoldConstantCommand.prototype._createStash$ = function () {
	return new _FoldConstantCommand$CStash$();
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_FoldConstantCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		statement.forEachStatement$F$LStatement$B$(onStatement);
		statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
			return $this._optimizeExpression$LExpression$F$LExpression$V$(expr, replaceCb);
		}));
		return true;
	}));
	return true;
};

/**
 * @param {Expression} expr
 * @param {*} replaceCb
 * @return {!boolean}
 */
_FoldConstantCommand.prototype._optimizeExpression$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	/** @type {Type} */
	var holderType;
	/** @type {MemberVariableDefinition} */
	var member;
	/** @type {Expression} */
	var foldedExpr;
	/** @type {*} */
	var calculateCb;
	/** @type {Expression} */
	var baseExpr;
	/** @type {Expression} */
	var firstExpr;
	/** @type {Expression} */
	var secondExpr;
	expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
		return $this._optimizeExpression$LExpression$F$LExpression$V$(expr, replaceCb);
	}));
	if (expr instanceof PropertyExpression) {
		holderType = expr.getHolderType$();
		if (expr.getExpr$() instanceof ClassExpression) {
			member = null;
			holderType.getClassDef$().forEachMemberVariable$F$LMemberVariableDefinition$B$((function (m) {
				if (m instanceof MemberVariableDefinition && m.name$() === expr.getIdentifierToken$().getValue$()) {
					member = m;
				}
				return member == null;
			}));
			if (member != null && (member.flags$() & ClassDefinition.IS_CONST) !== 0) {
				this._foldStaticConst$LMemberVariableDefinition$(member);
				foldedExpr = this._toFoldedExpr$LExpression$LType$(member.getInitialValue$(), member.getType$());
				if (foldedExpr != null) {
					foldedExpr = this._toFoldedExpr$LExpression$LType$(foldedExpr, expr.getType$());
					if (foldedExpr != null) {
						replaceCb(foldedExpr);
					}
				}
			}
		}
	} else {
		if (expr instanceof SignExpression) {
			switch (expr.getToken$().getValue$()) {
			case "+":
				calculateCb = (function (x) {
					return + x;
				});
				break;
			case "-":
				calculateCb = (function (x) {
					return - x;
				});
				break;
			default:
				return false;
			}
			this.log$S("folding operator '" + expr.getToken$().getValue$() + "' at '" + expr.getToken$().getFilename$() + ":" + (expr.getToken$().getLineNumber$() + ""));
			baseExpr = expr.getExpr$();
			if (baseExpr instanceof IntegerLiteralExpression) {
				replaceCb(new IntegerLiteralExpression$LToken$(new Token$SB(calculateCb(+baseExpr.getToken$().getValue$()) + "", false)));
			} else {
				if (baseExpr instanceof NumberLiteralExpression) {
					replaceCb(new NumberLiteralExpression$LToken$(new Token$SB(calculateCb(+baseExpr.getToken$().getValue$()) + "", false)));
				}
			}
		} else {
			if (expr instanceof AdditiveExpression) {
				firstExpr = expr.getFirstExpr$();
				secondExpr = expr.getSecondExpr$();
				if (this._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$(expr, replaceCb)) {
				} else {
					if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
						replaceCb(new StringLiteralExpression$LToken$(new Token$SB(Util$encodeStringLiteral$S(Util$decodeStringLiteral$S(firstExpr.getToken$().getValue$()) + Util$decodeStringLiteral$S(secondExpr.getToken$().getValue$())), false)));
					}
				}
			} else {
				if (expr instanceof EqualityExpression) {
					this._foldEqualityExpression$LEqualityExpression$F$LExpression$V$(expr, replaceCb);
				} else {
					if (expr instanceof BinaryNumberExpression || expr instanceof ShiftExpression) {
						this._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$(expr, replaceCb);
					} else {
						if (expr instanceof AsExpression) {
							if (expr.getType$().equals$LType$(Type.stringType)) {
								baseExpr = expr.getExpr$();
								if (baseExpr instanceof BooleanLiteralExpression || baseExpr instanceof NumberLiteralExpression || baseExpr instanceof IntegerLiteralExpression) {
									replaceCb(new StringLiteralExpression$LToken$(new Token$SB(Util$encodeStringLiteral$S(baseExpr.getToken$().getValue$()), false)));
								}
							}
						}
					}
				}
			}
		}
	}
	return true;
};

/**
 * @param {EqualityExpression} expr
 * @param {*} replaceCb
 */
_FoldConstantCommand.prototype._foldEqualityExpression$LEqualityExpression$F$LExpression$V$ = function (expr, replaceCb) {
	/** @type {Expression} */
	var firstExpr;
	/** @type {Expression} */
	var secondExpr;
	/** @type {undefined|!boolean} */
	var isEqual;
	/** @type {!boolean} */
	var result;
	firstExpr = expr.getFirstExpr$();
	secondExpr = expr.getSecondExpr$();
	isEqual = null;
	if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
		isEqual = Util$decodeStringLiteral$S(firstExpr.getToken$().getValue$()) === Util$decodeStringLiteral$S(secondExpr.getToken$().getValue$());
	} else {
		if (this._isIntegerOrNumberLiteralExpression$LExpression$(firstExpr) && this._isIntegerOrNumberLiteralExpression$LExpression$(secondExpr)) {
			isEqual = +firstExpr.getToken$().getValue$() === +secondExpr.getToken$().getValue$();
		}
	}
	if (isEqual != null) {
		result = (expr.getToken$().getValue$() === "==" ? isEqual : ! isEqual);
		replaceCb(new BooleanLiteralExpression$LToken$(new Token$SB(result ? "true" : "false", true)));
	}
};

/**
 * @param {BinaryExpression} expr
 * @param {*} replaceCb
 * @return {!boolean}
 */
_FoldConstantCommand.prototype._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	/** @type {*} */
	var exprIsZero;
	if (this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getFirstExpr$()) && this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getSecondExpr$())) {
		return this._foldNumericBinaryExpressionOfConstants$LBinaryExpression$F$LExpression$V$(expr, replaceCb);
	}
	function exprIsZero(expr) {
		return expr instanceof NumberLiteralExpression && +expr.getToken$().getValue$() === 0;
	};
	switch (expr.getToken$().getValue$()) {
	case "+":
		if (exprIsZero(expr.getFirstExpr$())) {
			replaceCb(expr.getSecondExpr$());
			return true;
		} else {
			if (exprIsZero(expr.getSecondExpr$())) {
				replaceCb(expr.getFirstExpr$());
				return true;
			}
		}
		break;
	case "-":
		if (exprIsZero(expr.getSecondExpr$())) {
			replaceCb(expr.getFirstExpr$());
			return true;
		}
		break;
	}
	return false;
};

/**
 * @param {BinaryExpression} expr
 * @param {*} replaceCb
 * @return {!boolean}
 */
_FoldConstantCommand.prototype._foldNumericBinaryExpressionOfConstants$LBinaryExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	switch (expr.getToken$().getValue$()) {
	case "*":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x * y;
		}));
		break;
	case "+":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x + y;
		}));
		break;
	case "-":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x - y;
		}));
		break;
	case "%":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x % y;
		}));
		break;
	case "/":
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x / y;
		}));
		break;
	case ">>>":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x >>> y;
		}));
		break;
	case ">>":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x >> y;
		}));
		break;
	case "<<":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x << y;
		}));
		break;
	case "&":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x & y;
		}));
		break;
	case "|":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x | y;
		}));
		break;
	case "^":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x ^ y;
		}));
		break;
	default:
		return false;
	}
	return true;
};

/**
 * @param {BinaryExpression} expr
 * @param {*} replaceCb
 * @param {*} calcCb
 */
_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	if (expr.getFirstExpr$() instanceof IntegerLiteralExpression && expr.getSecondExpr$() instanceof IntegerLiteralExpression) {
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, calcCb);
	} else {
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, calcCb);
	}
};

/**
 * @param {BinaryExpression} expr
 * @param {*} replaceCb
 * @param {*} calcCb
 */
_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	/** @type {!number} */
	var value;
	value = calcCb(+expr.getFirstExpr$().getToken$().getValue$(), +expr.getSecondExpr$().getToken$().getValue$());
	this.log$S("folding operator '" + expr.getToken$().getValue$() + "' at " + expr.getToken$().getFilename$() + ":" + (expr.getToken$().getLineNumber$() + "") + " to int: " + (value + ""));
	if (value % 1 !== 0) {
		throw new Error("value is not an integer");
	}
	replaceCb(new IntegerLiteralExpression$LToken$(new Token$SB(value + "", false)));
};

/**
 * @param {BinaryExpression} expr
 * @param {*} replaceCb
 * @param {*} calcCb
 */
_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	/** @type {!number} */
	var value;
	value = calcCb(+expr.getFirstExpr$().getToken$().getValue$(), +expr.getSecondExpr$().getToken$().getValue$());
	this.log$S("folding operator '" + expr.getToken$().getValue$() + "' at " + expr.getToken$().getFilename$() + ":" + (expr.getToken$().getLineNumber$() + "") + " to number: " + (value + ""));
	replaceCb(new NumberLiteralExpression$LToken$(new Token$SB(value + "", false)));
};

/**
 * @param {Expression} expr
 * @return {!boolean}
 */
_FoldConstantCommand.prototype._isIntegerOrNumberLiteralExpression$LExpression$ = function (expr) {
	return expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
};

/**
 * @param {MemberVariableDefinition} member
 */
_FoldConstantCommand.prototype._foldStaticConst$LMemberVariableDefinition$ = function (member) {
	var $this = this;
	/** @type {_FoldConstantCommand$CStash} */
	var stash;
	/** @type {Expression} */
	var initialValue;
	stash = this.getStash$LStashable$(member);
	if (stash.isOptimized) {
		return;
	}
	stash.isOptimized = true;
	initialValue = member.getInitialValue$();
	if (initialValue != null) {
		this._optimizeExpression$LExpression$F$LExpression$V$(initialValue, (function (expr) {
			member.setInitialValue$LExpression$(expr);
		}));
	}
};

/**
 * @param {Expression} expr
 * @param {Type} type
 * @return {Expression}
 */
_FoldConstantCommand.prototype._toFoldedExpr$LExpression$LType$ = function (expr, type) {
	if (expr instanceof NullExpression) {
		return expr;
	} else {
		if (expr instanceof BooleanLiteralExpression) {
			return expr;
		} else {
			if (expr instanceof IntegerLiteralExpression) {
				return expr;
			} else {
				if (expr instanceof NumberLiteralExpression) {
					if (type.resolveIfNullable$().equals$LType$(Type.integerType)) {
						return new IntegerLiteralExpression$LToken$(new Token$SB((expr.getToken$().getValue$() | 0).toString(), false));
					}
					return expr;
				} else {
					if (expr instanceof StringLiteralExpression) {
						return expr;
					}
				}
			}
		}
	}
	return null;
};

/**
 * class _DeadCodeEliminationOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _DeadCodeEliminationOptimizeCommand() {
}

_DeadCodeEliminationOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _DeadCodeEliminationOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _DeadCodeEliminationOptimizeCommand.IDENTIFIER);
};

_DeadCodeEliminationOptimizeCommand$.prototype = new _DeadCodeEliminationOptimizeCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_DeadCodeEliminationOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (funcDef.getStatements$() == null) {
		return true;
	}
	while (this._optimizeFunction$LMemberFunctionDefinition$(funcDef) || this._removeExpressionStatementsWithoutSideEffects$LMemberFunctionDefinition$(funcDef)) {
	}
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_DeadCodeEliminationOptimizeCommand.prototype._removeExpressionStatementsWithoutSideEffects$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {!boolean} */
	var shouldRetry;
	shouldRetry = false;
	(function onStatements(statements) {
		/** @type {!number} */
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof ExpressionStatement && ! _Util$exprHasSideEffects$LExpression$(statements[i].getExpr$())) {
				shouldRetry = true;
				statements.splice(i, 1);
			} else {
				statements[i++].handleStatements$F$ALStatement$B$(onStatements);
			}
		}
		return true;
	})(funcDef.getStatements$());
	return shouldRetry;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_DeadCodeEliminationOptimizeCommand.prototype._optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {!boolean} */
	var shouldRetry;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {Array.<undefined|!boolean>} */
	var localsUsed;
	/** @type {!boolean} */
	var altered;
	/** @type {!number} */
	var localIndex;
	shouldRetry = false;
	_Util$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, (function (exprs) {
		$this._eliminateDeadStoresToProperties$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
	}));
	(function onStatements(statements) {
		/** @type {!number} */
		var i;
		/** @type {Statement} */
		var statement;
		for (i = statements.length - 1; i >= 0; -- i) {
			statement = statements[i];
			if (statement instanceof ExpressionStatement) {
				if (! _Util$exprHasSideEffects$LExpression$(statement.getExpr$())) {
					statements.splice(i, 1);
				}
			}
			statement.handleStatements$F$ALStatement$B$(onStatements);
		}
		return true;
	})(funcDef.getStatements$());
	locals = funcDef.getLocals$();
	localsUsed = new Array(locals.length);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			/** @type {!number} */
			var i;
			if (expr instanceof AssignmentExpression && expr.getFirstExpr$() instanceof LocalExpression && expr.getFirstExpr$().getType$().equals$LType$(expr.getSecondExpr$().getType$())) {
				return onExpr(expr.getSecondExpr$());
			} else {
				if (expr instanceof LocalExpression) {
					for (i = 0; i < locals.length; ++ i) {
						if (locals[i] == expr.getLocal$()) {
							break;
						}
					}
					if (i !== locals.length) {
						localsUsed[i] = true;
					}
				} else {
					if (expr instanceof FunctionExpression) {
						expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
					}
				}
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	altered = false;
	for (localIndex = localsUsed.length - 1; localIndex >= 0; -- localIndex) {
		if (localsUsed[localIndex]) {
			continue;
		}
		funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
			statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				/** @type {Expression} */
				var rhsExpr;
				if (expr instanceof AssignmentExpression && expr.getFirstExpr$() instanceof LocalExpression && expr.getFirstExpr$().getLocal$() == locals[localIndex]) {
					rhsExpr = expr.getSecondExpr$();
					replaceCb(rhsExpr);
					shouldRetry = true;
					return onExpr(rhsExpr, null);
				} else {
					if (expr instanceof LocalExpression && expr.getLocal$() == locals[localIndex]) {
						throw new Error("logic flaw, found a variable going to be removed being used");
					} else {
						if (expr instanceof FunctionExpression) {
							expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
						}
					}
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			}));
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}));
		locals.splice(localIndex, 1);
	}
	return shouldRetry;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Expression>} exprs
 */
_DeadCodeEliminationOptimizeCommand.prototype._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	/** @type {TypedMap$LocalVariable$boolean$E} */
	var localsUntouchable;
	/** @type {TypedMap$LocalVariable$Expression$E} */
	var locals;
	/** @type {*} */
	var _onExpr;
	/** @type {*} */
	var onExpr;
	localsUntouchable = new TypedMap$LocalVariable$boolean$E$();
	locals = new TypedMap$LocalVariable$Expression$E$();
	_onExpr = (function (expr) {
		/** @type {LocalVariable} */
		var local;
		if (expr instanceof AssignmentExpression && expr.getToken$().getValue$() !== "=" && expr.getFirstExpr$() instanceof LocalExpression) {
			local = expr.getFirstExpr$().getLocal$();
			$this.log$S("local variable " + local.getName$().getValue$() + " cannot be rewritten (has fused op)");
			localsUntouchable.set$LLocalVariable$B(local, true);
		} else {
			if (expr instanceof IncrementExpression && expr.getExpr$() instanceof LocalExpression) {
				local = expr.getExpr$().getLocal$();
				$this.log$S("local variable " + local.getName$().getValue$() + " cannot be rewritten (has increment)");
				localsUntouchable.set$LLocalVariable$B(local, true);
			}
		}
		return expr.forEachExpression$F$LExpression$B$(_onExpr);
	});
	Util$forEachExpression$F$LExpression$B$ALExpression$(_onExpr, exprs);
	onExpr = (function (expr, replaceCb) {
		/** @type {AssignmentExpression} */
		var assignmentExpr;
		/** @type {LocalVariable} */
		var lhsLocal;
		/** @type {Expression} */
		var rhsExpr;
		/** @type {LocalVariable} */
		var rhsLocal;
		/** @type {Expression} */
		var cachedExpr;
		/** @type {MemberFunctionDefinition} */
		var callingFuncDef;
		if (expr instanceof AssignmentExpression) {
			assignmentExpr = expr;
			if (assignmentExpr.getFirstExpr$() instanceof LocalExpression) {
				onExpr(assignmentExpr.getSecondExpr$(), (function (expr) {
					assignmentExpr.setSecondExpr$LExpression$(expr);
				}));
				if (! localsUntouchable.get$LLocalVariable$(assignmentExpr.getFirstExpr$().getLocal$()) && assignmentExpr.getFirstExpr$().getType$().equals$LType$(assignmentExpr.getSecondExpr$().getType$())) {
					lhsLocal = assignmentExpr.getFirstExpr$().getLocal$();
					$this.log$S("resetting cache for: " + lhsLocal.getName$().getValue$());
					locals.reversedForEach$F$LLocalVariable$LExpression$B$((function (local, expr) {
						if (local == lhsLocal) {
							$this.log$S("  clearing itself");
							locals.delete$LLocalVariable$(local);
						} else {
							if (expr instanceof LocalExpression && expr.getLocal$() == lhsLocal) {
								$this.log$S("  clearing " + local.getName$().getValue$());
								locals.delete$LLocalVariable$(local);
							}
						}
						return true;
					}));
					if (assignmentExpr.getToken$().getValue$() === "=") {
						rhsExpr = assignmentExpr.getSecondExpr$();
						if (rhsExpr instanceof LocalExpression) {
							rhsLocal = rhsExpr.getLocal$();
							if (lhsLocal != rhsLocal && ! localsUntouchable.get$LLocalVariable$(rhsLocal)) {
								$this.log$S("  set to: " + rhsLocal.getName$().getValue$());
								locals.set$LLocalVariable$LExpression$(lhsLocal, rhsExpr);
							}
						} else {
							if (rhsExpr instanceof NullExpression || rhsExpr instanceof NumberLiteralExpression || rhsExpr instanceof IntegerLiteralExpression || rhsExpr instanceof StringLiteralExpression) {
								$this.log$S("  set to: " + rhsExpr.getToken$().getValue$());
								locals.set$LLocalVariable$LExpression$(lhsLocal, rhsExpr);
							}
						}
					}
				}
				return true;
			}
		} else {
			if (expr instanceof LocalExpression) {
				cachedExpr = locals.get$LLocalVariable$(expr.getLocal$());
				if (cachedExpr) {
					replaceCb(cachedExpr.clone$());
					return true;
				}
			} else {
				if (expr instanceof CallExpression) {
					callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
					if (callingFuncDef != null && (callingFuncDef.flags$() & ClassDefinition.IS_PURE) !== 0) {
					} else {
						expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
						if (funcDef.getParent$() != null || funcDef.getClosures$().length !== 0) {
							locals.clear$();
						}
						return true;
					}
				} else {
					if (expr instanceof NewExpression) {
						expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
						locals.clear$();
						return true;
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, exprs);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Expression>} exprs
 */
_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	/** @type {Array.<undefined|Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E>} */
	var lastAssignExpr;
	/** @type {*} */
	var onExpr;
	lastAssignExpr = [];
	onExpr = (function (expr, rewriteCb) {
		/** @type {LocalVariable} */
		var lhsLocal;
		/** @type {!number} */
		var i;
		/** @type {MemberFunctionDefinition} */
		var callingFuncDef;
		if (expr instanceof AssignmentExpression) {
			if (expr.getToken$().getValue$() === "=" && expr.getFirstExpr$() instanceof LocalExpression) {
				onExpr(expr.getSecondExpr$(), (function (assignExpr) {
					return (function (expr) {
						assignExpr.setSecondExpr$LExpression$(expr);
					});
				})(expr));
				lhsLocal = expr.getFirstExpr$().getLocal$();
				for (i = 0; i < lastAssignExpr.length; ++ i) {
					if (lastAssignExpr[i].first == lhsLocal) {
						break;
					}
				}
				if (i !== lastAssignExpr.length) {
					$this.log$S("eliminating dead store to: " + lhsLocal.getName$().getValue$());
					lastAssignExpr[i].third(lastAssignExpr[i].second.getSecondExpr$());
				}
				lastAssignExpr[i] = new Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E$LLocalVariable$LAssignmentExpression$F$LExpression$V$(lhsLocal, expr, rewriteCb);
				return true;
			}
		} else {
			if (expr instanceof LocalExpression) {
				for (i = 0; i < lastAssignExpr.length; ++ i) {
					if (lastAssignExpr[i].first == expr.getLocal$()) {
						lastAssignExpr.splice(i, 1);
						break;
					}
				}
			} else {
				if (expr instanceof CallExpression) {
					onExpr(expr.getExpr$(), (function (callExpr) {
						return (function (expr) {
							callExpr.setExpr$LExpression$(expr);
						});
					})(expr));
					Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
					callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
					if (callingFuncDef != null && (callingFuncDef.flags$() & ClassDefinition.IS_PURE) !== 0) {
					} else {
						lastAssignExpr.splice(0, lastAssignExpr.length);
					}
					return true;
				} else {
					if (expr instanceof NewExpression) {
						Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
						lastAssignExpr.splice(0, lastAssignExpr.length);
						return true;
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, exprs);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Expression>} exprs
 */
_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadStoresToProperties$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	/** @type {*} */
	var isFirstLevelPropertyAccess;
	/** @type {*} */
	var baseExprsAreEqual;
	/** @type {Object.<string, undefined|Pair$AssignmentExpression$function$$$$Expression$$$$void$E>} */
	var lastAssignExpr;
	/** @type {*} */
	var onExpr;
	function isFirstLevelPropertyAccess(expr) {
		/** @type {Expression} */
		var baseExpr;
		if (! (expr instanceof PropertyExpression)) {
			return false;
		}
		baseExpr = expr.getExpr$();
		if (baseExpr instanceof LocalExpression || baseExpr instanceof ThisExpression || baseExpr instanceof ClassExpression) {
			return true;
		} else {
			return false;
		}
	};
	function baseExprsAreEqual(x, y) {
		if (x instanceof LocalExpression && y instanceof LocalExpression) {
			return x.getLocal$() == y.getLocal$();
		} else {
			if (x instanceof ThisExpression && y instanceof ThisExpression) {
				return true;
			} else {
				if (x instanceof ClassExpression && y instanceof ClassExpression) {
					return x.getType$().equals$LType$(y.getType$());
				}
			}
		}
		return false;
	};
	lastAssignExpr = {};
	onExpr = (function (expr, rewriteCb) {
		/** @type {AssignmentExpression} */
		var assignmentExpr;
		/** @type {Expression} */
		var firstExpr;
		/** @type {!string} */
		var propertyName;
		/** @type {!string} */
		var k;
		/** @type {Expression} */
		var baseExpr;
		if (expr instanceof AssignmentExpression) {
			assignmentExpr = expr;
			firstExpr = assignmentExpr.getFirstExpr$();
			if (expr.getToken$().getValue$() === "=" && isFirstLevelPropertyAccess(firstExpr) && ! _Util$classIsNative$LClassDefinition$(firstExpr.getExpr$().getType$().getClassDef$())) {
				propertyName = firstExpr.getIdentifierToken$().getValue$();
				onExpr(assignmentExpr.getSecondExpr$(), null);
				if (lastAssignExpr[propertyName] && lastAssignExpr[propertyName].second != null && baseExprsAreEqual(firstExpr.getExpr$(), lastAssignExpr[propertyName].first.getFirstExpr$().getExpr$())) {
					lastAssignExpr[propertyName].second(lastAssignExpr[propertyName].first.getSecondExpr$());
				}
				lastAssignExpr[propertyName] = new Pair$AssignmentExpression$function$$$$Expression$$$$void$E$LAssignmentExpression$F$LExpression$V$(assignmentExpr, rewriteCb);
				return true;
			} else {
				if (assignmentExpr.getFirstExpr$() instanceof LocalExpression) {
					onExpr(assignmentExpr.getSecondExpr$(), null);
					for (k in lastAssignExpr) {
						baseExpr = lastAssignExpr[k].first.getFirstExpr$().getExpr$();
						if (baseExpr instanceof LocalExpression && baseExpr.getLocal$() == expr.getFirstExpr$().getLocal$()) {
							delete lastAssignExpr[k];
						}
					}
					return true;
				}
			}
		} else {
			if (isFirstLevelPropertyAccess(expr)) {
				propertyName = expr.getIdentifierToken$().getValue$();
				delete lastAssignExpr[propertyName];
			} else {
				if (expr instanceof CallExpression) {
					onExpr(expr.getExpr$(), null);
					Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
					lastAssignExpr = {};
					return true;
				} else {
					if (expr instanceof NewExpression) {
						Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
						lastAssignExpr = {};
						return true;
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, exprs);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Expression>} exprs
 */
_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	/** @type {*} */
	var conditionIsConstant;
	/** @type {*} */
	var spliceStatements;
	function conditionIsConstant(expr) {
		if (expr instanceof BooleanLiteralExpression) {
			return expr.getToken$().getValue$() === "true";
		} else {
			if (expr instanceof StringLiteralExpression) {
				return expr.getToken$().getValue$().length > 2;
			} else {
				if (expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression) {
					return +expr.getToken$().getValue$() !== 0;
				} else {
					if (expr instanceof MapLiteralExpression || expr instanceof ArrayLiteralExpression) {
						return true;
					}
				}
			}
		}
		return null;
	};
	function spliceStatements(dest, index, src) {
		/** @type {!number} */
		var i;
		dest.splice(index, 1);
		for (i = 0; i < src.length; ++ i) {
			dest.splice(index + i, 0, src[i]);
		}
	};
	(function onStatements(statements) {
		/** @type {!number} */
		var i;
		/** @type {Statement} */
		var statement;
		/** @type {IfStatement} */
		var ifStatement;
		/** @type {undefined|!boolean} */
		var cond;
		for (i = statements.length - 1; i >= 0; -- i) {
			statement = statements[i];
			if (statement instanceof IfStatement) {
				ifStatement = statement;
				cond = conditionIsConstant(ifStatement.getExpr$());
				if (cond == null) {
				} else {
					if (cond == false && ifStatement.getOnFalseStatements$().length === 0) {
						statements.splice(i, 1);
					} else {
						if (cond == false) {
							spliceStatements(statements, i, ifStatement.getOnFalseStatements$());
						} else {
							if (cond == true) {
								spliceStatements(statements, i, ifStatement.getOnTrueStatements$());
							}
						}
					}
				}
			}
			statement.handleStatements$F$ALStatement$B$(onStatements);
		}
		return true;
	})(funcDef.getStatements$());
};

/**
 * class _InlineOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _InlineOptimizeCommand() {
}

_InlineOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _InlineOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _InlineOptimizeCommand.IDENTIFIER);
};

_InlineOptimizeCommand$.prototype = new _InlineOptimizeCommand;

/**
 * @return {OptimizerStash}
 */
_InlineOptimizeCommand.prototype._createStash$ = function () {
	return new _InlineOptimizeCommand$CStash$();
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {_InlineOptimizeCommand$CStash} */
	var stash;
	stash = this.getStash$LStashable$(funcDef);
	if (stash.isOptimized) {
		return true;
	}
	stash.isOptimized = true;
	if (funcDef.getStatements$() == null) {
		return true;
	}
	this.log$S("* starting optimization of " + funcDef.getNotation$());
	while (true) {
		while (true) {
			if (! this._handleStatements$LMemberFunctionDefinition$ALStatement$(funcDef, funcDef.getStatements$())) {
				break;
			}
			this.setupCommand$L_OptimizeCommand$(new _DetermineCalleeCommand$()).optimizeFunction$LMemberFunctionDefinition$(funcDef);
		}
		if (! this.setupCommand$L_OptimizeCommand$(new _ReturnIfOptimizeCommand$()).optimizeFunction$LMemberFunctionDefinition$(funcDef)) {
			break;
		}
	}
	this.log$S("* finished optimization of " + funcDef.getNotation$());
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Statement>} statements
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._handleStatements$LMemberFunctionDefinition$ALStatement$ = function (funcDef, statements) {
	/** @type {!boolean} */
	var altered;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var left;
	altered = false;
	for (i = 0; i < statements.length; ++ i) {
		left = statements.length - i;
		if (this._handleStatement$LMemberFunctionDefinition$ALStatement$N(funcDef, statements, i)) {
			altered = true;
		}
		i = statements.length - left;
	}
	return altered;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Statement>} statements
 * @param {!number} stmtIndex
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._handleStatement$LMemberFunctionDefinition$ALStatement$N = function (funcDef, statements, stmtIndex) {
	var $this = this;
	/** @type {!boolean} */
	var altered;
	/** @type {Statement} */
	var statement;
	/** @type {MemberFunctionDefinition} */
	var callingFuncDef;
	altered = false;
	statement = statements[stmtIndex];
	statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
		/** @type {Array.<undefined|Expression>} */
		var args;
		/** @type {MemberFunctionDefinition} */
		var callingFuncDef;
		/** @type {Statement} */
		var stmt;
		/** @type {Expression} */
		var clonedExpr;
		expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		if (expr instanceof CallExpression) {
			args = $this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$B(expr, true);
			if (args != null) {
				callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
				$this.log$S("expanding " + callingFuncDef.getNotation$() + " as expression");
				stmt = callingFuncDef.getStatements$()[0];
				if (stmt instanceof ExpressionStatement) {
					expr = stmt.getExpr$();
				} else {
					if (stmt instanceof ReturnStatement) {
						expr = stmt.getExpr$();
					} else {
						throw new Error('logic flaw');
					}
				}
				clonedExpr = expr.clone$();
				$this._rewriteExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(clonedExpr, (function (expr) {
					clonedExpr = expr;
				}), args, callingFuncDef);
				replaceCb(clonedExpr);
			}
		}
		return true;
	}));
	if (statement instanceof ConstructorInvocationStatement) {
		callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(statement);
		this.optimizeFunction$LMemberFunctionDefinition$(callingFuncDef);
		if (this._functionIsInlineable$LMemberFunctionDefinition$(callingFuncDef) && this._argsAreInlineable$LMemberFunctionDefinition$ALExpression$B(callingFuncDef, statement.getArguments$(), false)) {
			statements.splice(stmtIndex, 1);
			this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, callingFuncDef, statement.getArguments$().concat([ new ThisExpression$LToken$LClassDefinition$(null, funcDef.getClassDef$()) ]));
		}
	} else {
		if (statement instanceof ExpressionStatement) {
			if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
				statements.splice(stmtIndex, 1);
			}))) {
				altered = true;
			}
		} else {
			if (statement instanceof ReturnStatement) {
				if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
					statements.splice(stmtIndex, 1);
					statements[stmtIndex - 1] = new ReturnStatement$LToken$LExpression$(statement.getToken$(), statements[stmtIndex - 1] instanceof ReturnStatement ? statements[stmtIndex - 1].getExpr$() : statements[stmtIndex - 1].getExpr$());
				}))) {
					altered = true;
				}
			} else {
				if (statement instanceof IfStatement) {
					if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
						statement.setExpr$LExpression$(statements[stmtIndex - 1] instanceof ReturnStatement ? statements[stmtIndex - 1].getExpr$() : statements[stmtIndex - 1].getExpr$());
						statements.splice(stmtIndex - 1, 1);
					}))) {
						altered = true;
					}
					if (this._handleSubStatements$LMemberFunctionDefinition$LStatement$(funcDef, statement)) {
						altered = true;
					}
				} else {
					if (this._handleSubStatements$LMemberFunctionDefinition$LStatement$(funcDef, statement)) {
						altered = true;
					}
				}
			}
		}
	}
	return altered;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Statement} statement
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._handleSubStatements$LMemberFunctionDefinition$LStatement$ = function (funcDef, statement) {
	var $this = this;
	return _Util$handleSubStatements$F$ALStatement$B$LStatement$((function (statements) {
		return $this._handleStatements$LMemberFunctionDefinition$ALStatement$(funcDef, statements);
	}), statement);
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Statement>} statements
 * @param {!number} stmtIndex
 * @param {Expression} expr
 * @param {*} cb
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$ = function (funcDef, statements, stmtIndex, expr, cb) {
	/** @type {Array.<undefined|Expression>} */
	var args;
	/** @type {Statement} */
	var stmt;
	/** @type {Expression} */
	var rhsExpr;
	/** @type {AssignmentExpression} */
	var lastExpr;
	if (expr instanceof CallExpression) {
		args = this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$B(expr, false);
		if (args != null) {
			stmtIndex = this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr), args);
			cb(stmtIndex);
			return true;
		}
	} else {
		if (expr instanceof AssignmentExpression && this._lhsHasNoSideEffects$LExpression$(expr.getFirstExpr$()) && expr.getSecondExpr$() instanceof CallExpression) {
			args = this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$B(expr.getSecondExpr$(), false);
			if (args != null) {
				stmtIndex = this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr.getSecondExpr$()), args);
				stmt = statements[stmtIndex - 1];
				if (stmt instanceof ReturnStatement) {
					rhsExpr = stmt.getExpr$();
				} else {
					if (stmt instanceof ExpressionStatement) {
						rhsExpr = stmt.getExpr$();
					} else {
						return false;
					}
				}
				lastExpr = new AssignmentExpression$LToken$LExpression$LExpression$(expr.getToken$(), expr.getFirstExpr$(), rhsExpr);
				statements[stmtIndex - 1] = new ExpressionStatement$LExpression$(lastExpr);
				cb(stmtIndex);
				return true;
			}
		}
	}
	return false;
};

/**
 * @param {Expression} lhsExpr
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._lhsHasNoSideEffects$LExpression$ = function (lhsExpr) {
	/** @type {Expression} */
	var holderExpr;
	/** @type {ArrayExpression} */
	var arrayExpr;
	if (lhsExpr instanceof LocalExpression) {
		return true;
	}
	if (lhsExpr instanceof PropertyExpression) {
		holderExpr = lhsExpr.getExpr$();
		if (holderExpr instanceof ThisExpression) {
			return true;
		}
		if (holderExpr instanceof LocalExpression || holderExpr instanceof ClassExpression) {
			return true;
		}
	} else {
		if (lhsExpr instanceof ArrayExpression) {
			arrayExpr = lhsExpr;
			if (arrayExpr.getFirstExpr$() instanceof LocalExpression && (arrayExpr.getSecondExpr$() instanceof NumberLiteralExpression || arrayExpr.getSecondExpr$() instanceof StringLiteralExpression || arrayExpr.getSecondExpr$() instanceof LocalExpression)) {
				return true;
			}
		}
	}
	return false;
};

/**
 * @param {CallExpression} callExpr
 * @param {!boolean} asExpression
 * @return {Array.<undefined|Expression>}
 */
_InlineOptimizeCommand.prototype._getArgsAndThisIfCallExprIsInlineable$LCallExpression$B = function (callExpr, asExpression) {
	var $this = this;
	/** @type {MemberFunctionDefinition} */
	var callingFuncDef;
	/** @type {Expression} */
	var receiverExpr;
	/** @type {Expression} */
	var calleeExpr;
	/** @type {!boolean} */
	var modifiesArgs;
	/** @type {Array.<undefined|Expression>} */
	var argsAndThis;
	callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(callExpr);
	if (callingFuncDef == null) {
		return null;
	}
	this.optimizeFunction$LMemberFunctionDefinition$(callingFuncDef);
	receiverExpr = null;
	if ((callingFuncDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		calleeExpr = callExpr.getExpr$();
		if (! (calleeExpr instanceof PropertyExpression)) {
			throw new Error("unexpected type of expression");
		}
		receiverExpr = calleeExpr.getExpr$();
		if (asExpression) {
			if (! (receiverExpr instanceof LocalExpression || receiverExpr instanceof ThisExpression)) {
				return null;
			}
		}
	}
	if (! this._functionIsInlineable$LMemberFunctionDefinition$(callingFuncDef)) {
		return null;
	}
	if (asExpression) {
		if (callingFuncDef.getStatements$().length !== 1) {
			return null;
		}
		if (callingFuncDef.getLocals$().length !== 0) {
			return null;
		}
		modifiesArgs = ! Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			/** @type {*} */
			var onExpr;
			onExpr = (function onExpr(expr) {
				if (expr instanceof AssignmentExpression && expr.getFirstExpr$() instanceof LocalExpression) {
					return false;
				}
				return expr.forEachExpression$F$LExpression$B$(onExpr);
			});
			return statement.forEachExpression$F$LExpression$B$(onExpr);
		}), callingFuncDef.getStatements$());
		if (modifiesArgs) {
			return null;
		}
	}
	if (! this._argsAreInlineable$LMemberFunctionDefinition$ALExpression$B(callingFuncDef, callExpr.getArguments$(), asExpression)) {
		return null;
	}
	argsAndThis = callExpr.getArguments$().concat([]);
	if (this._functionHasThis$LMemberFunctionDefinition$(callingFuncDef)) {
		if (receiverExpr != null) {
			argsAndThis.push(receiverExpr);
		} else {
			argsAndThis.push(new ThisExpression$LToken$LClassDefinition$(null, callingFuncDef.getClassDef$()));
		}
	} else {
		argsAndThis.push(null);
	}
	return argsAndThis;
};

/**
 * @param {MemberFunctionDefinition} callingFuncDef
 * @param {Array.<undefined|Expression>} actualArgs
 * @param {!boolean} asExpression
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._argsAreInlineable$LMemberFunctionDefinition$ALExpression$B = function (callingFuncDef, actualArgs, asExpression) {
	/** @type {Array.<undefined|Type>} */
	var formalArgsTypes;
	/** @type {!number} */
	var i;
	formalArgsTypes = callingFuncDef.getArgumentTypes$();
	if (actualArgs.length !== formalArgsTypes.length) {
		throw new Error("number of arguments mismatch");
	}
	for (i = 0; i < actualArgs.length; ++ i) {
		if (asExpression && ! (actualArgs[i] instanceof LeafExpression)) {
			return false;
		}
		if (! this._argIsInlineable$LType$LType$(actualArgs[i].getType$(), formalArgsTypes[i])) {
			return false;
		}
	}
	return true;
};

/**
 * @param {Type} actualType
 * @param {Type} formalType
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._argIsInlineable$LType$LType$ = function (actualType, formalType) {
	if (this._optimizer.enableRuntimeTypeCheck$()) {
		if (actualType instanceof NullableType && ! (formalType instanceof NullableType)) {
			return false;
		}
	}
	actualType = actualType.resolveIfNullable$();
	formalType = formalType.resolveIfNullable$();
	if (actualType instanceof ObjectType && formalType instanceof ObjectType) {
		return actualType.isConvertibleTo$LType$(formalType);
	} else {
		return actualType.equals$LType$(formalType);
	}
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._isWorthInline$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {!number} */
	var n;
	if (funcDef.isAnonymous$()) {
		return true;
	}
	n = 0;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		/** @type {!boolean} */
		var cont;
		cont = statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			if (++ n >= _InlineOptimizeCommand.INLINE_THRESHOLD) {
				return false;
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}));
		if (! cont) {
			return false;
		}
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	return n < _InlineOptimizeCommand.INLINE_THRESHOLD;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._functionIsInlineable$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	/** @type {_InlineOptimizeCommand$CStash} */
	var stash;
	stash = this.getStash$LStashable$(funcDef);
	if (stash.isInlineable == null) {
		stash.isInlineable = (function () {
			/** @type {Array.<undefined|Statement>} */
			var statements;
			/** @type {!boolean} */
			var requestsInline;
			statements = funcDef.getStatements$();
			if (statements == null) {
				return false;
			}
			requestsInline = (funcDef.flags$() & ClassDefinition.IS_INLINE) !== 0;
			if (requestsInline) {
			} else {
				if (! $this._isWorthInline$LMemberFunctionDefinition$(funcDef)) {
					return false;
				}
			}
			return funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
				if (statement instanceof ExpressionStatement) {
				} else {
					if (requestsInline && (statement instanceof ForStatement || statement instanceof ForInStatement || statement instanceof DoWhileStatement || statement instanceof WhileStatement || statement instanceof IfStatement || statement instanceof SwitchStatement)) {
					} else {
						if (statement instanceof ReturnStatement && statement == funcDef.getStatements$()[funcDef.getStatements$().length - 1]) {
						} else {
							return false;
						}
					}
				}
				if (! statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
					if (expr instanceof FunctionExpression) {
						return false;
					}
					if (expr instanceof SuperExpression) {
						return false;
					}
					return expr.forEachExpression$F$LExpression$B$(onExpr);
				}))) {
					return false;
				}
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			}));
		})();
		this.log$S(funcDef.getNotation$() + (stash.isInlineable ? " is" : " is not") + " inlineable");
	}
	return stash.isInlineable;
};

/**
 * @param {MemberFunctionDefinition} callerFuncDef
 * @param {Array.<undefined|Statement>} statements
 * @param {!number} stmtIndex
 * @param {MemberFunctionDefinition} calleeFuncDef
 * @param {Array.<undefined|Expression>} argsAndThis
 * @return {!number}
 */
_InlineOptimizeCommand.prototype._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$ = function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThis) {
	var $this = this;
	/** @type {Array.<undefined|Expression>} */
	var argsAndThisAndLocals;
	/** @type {Array.<undefined|Statement>} */
	var calleeStatements;
	/** @type {!number} */
	var i;
	/** @type {Statement} */
	var statement;
	/** @type {*} */
	var onExpr;
	this.log$S("expanding " + calleeFuncDef.getNotation$());
	argsAndThisAndLocals = argsAndThis.concat([]);
	stmtIndex = this._createVars$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals);
	calleeStatements = calleeFuncDef.getStatements$();
	for (i = 0; i < calleeStatements.length; ++ i) {
		statement = (calleeStatements[i] instanceof ReturnStatement ? new ExpressionStatement$LExpression$(calleeStatements[i].getExpr$().clone$()) : calleeStatements[i].clone$());
		onExpr = (function onExpr(expr, replaceCb) {
			return $this._rewriteExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
		});
		statement.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		statement.forEachStatement$F$LStatement$B$((function onStatement(statement) {
			statement.forEachStatement$F$LStatement$B$(onStatement);
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		}));
		statements.splice(stmtIndex++, 0, statement);
	}
	return stmtIndex;
};

/**
 * @param {MemberFunctionDefinition} callerFuncDef
 * @param {Array.<undefined|Statement>} statements
 * @param {!number} stmtIndex
 * @param {MemberFunctionDefinition} calleeFuncDef
 * @param {Array.<undefined|Expression>} argsAndThisAndLocals
 * @return {!number}
 */
_InlineOptimizeCommand.prototype._createVars$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$ = function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals) {
	/** @type {LocalExpression} */
	var tempExpr;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var formalArgs;
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {LocalVariable} */
	var tempVar;
	if ((calleeFuncDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		tempExpr = this._createVarForArgOrThis$LMemberFunctionDefinition$ALStatement$NLExpression$LType$S(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[argsAndThisAndLocals.length - 1], new ObjectType$LClassDefinition$(calleeFuncDef.getClassDef$()), "this");
		if (tempExpr != null) {
			argsAndThisAndLocals[argsAndThisAndLocals.length - 1] = tempExpr;
			++ stmtIndex;
		}
	}
	formalArgs = calleeFuncDef.getArguments$();
	for (i = 0; i < formalArgs.length; ++ i) {
		if (argsAndThisAndLocals[i] instanceof FunctionExpression && this._getNumberOfTimesArgIsUsed$LMemberFunctionDefinition$LArgumentDeclaration$(calleeFuncDef, formalArgs[i]) <= 1) {
		} else {
			tempExpr = this._createVarForArgOrThis$LMemberFunctionDefinition$ALStatement$NLExpression$LType$S(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[i], formalArgs[i].getType$(), formalArgs[i].getName$().getValue$());
			if (tempExpr != null) {
				argsAndThisAndLocals[i] = tempExpr;
				++ stmtIndex;
			}
		}
	}
	locals = calleeFuncDef.getLocals$();
	for (i = 0; i < locals.length; ++ i) {
		tempVar = this.createVar$LMemberFunctionDefinition$LType$S(callerFuncDef, locals[i].getType$(), locals[i].getName$().getValue$());
		argsAndThisAndLocals.push(new LocalExpression$LToken$LLocalVariable$(tempVar.getName$(), tempVar));
	}
	return stmtIndex;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {ArgumentDeclaration} local
 * @return {!number}
 */
_InlineOptimizeCommand.prototype._getNumberOfTimesArgIsUsed$LMemberFunctionDefinition$LArgumentDeclaration$ = function (funcDef, local) {
	var $this = this;
	/** @type {!number} */
	var count;
	count = 0;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		statement.forEachStatement$F$LStatement$B$(onStatement);
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			expr.forEachExpression$F$LExpression$B$(onExpr);
			if (expr instanceof LocalExpression && expr.getLocal$() == local) {
				++ count;
			}
			return true;
		}));
		return true;
	}));
	return count;
};

/**
 * @param {MemberFunctionDefinition} callerFuncDef
 * @param {Array.<undefined|Statement>} statements
 * @param {!number} stmtIndex
 * @param {Expression} expr
 * @param {Type} type
 * @param {!string} baseName
 * @return {LocalExpression}
 */
_InlineOptimizeCommand.prototype._createVarForArgOrThis$LMemberFunctionDefinition$ALStatement$NLExpression$LType$S = function (callerFuncDef, statements, stmtIndex, expr, type, baseName) {
	/** @type {LocalVariable} */
	var newLocal;
	if (expr instanceof ThisExpression || expr instanceof LeafExpression) {
		return null;
	}
	newLocal = this.createVar$LMemberFunctionDefinition$LType$S(callerFuncDef, type, baseName);
	statements.splice(stmtIndex, 0, new ExpressionStatement$LExpression$(new AssignmentExpression$LToken$LExpression$LExpression$(new Token$SB("=", false), new LocalExpression$LToken$LLocalVariable$(newLocal.getName$(), newLocal), expr)));
	return new LocalExpression$LToken$LLocalVariable$(newLocal.getName$(), newLocal);
};

/**
 * @param {Expression} expr
 * @param {*} replaceCb
 * @param {Array.<undefined|Expression>} argsAndThisAndLocals
 * @param {MemberFunctionDefinition} calleeFuncDef
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._rewriteExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$ = function (expr, replaceCb, argsAndThisAndLocals, calleeFuncDef) {
	var $this = this;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var formalArgs;
	/** @type {!number} */
	var j;
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {!number} */
	var k;
	formalArgs = calleeFuncDef.getArguments$();
	if (expr instanceof LocalExpression) {
		for (j = 0; j < formalArgs.length; ++ j) {
			if (formalArgs[j].getName$().getValue$() === expr.getToken$().getValue$()) {
				break;
			}
		}
		if (j === formalArgs.length) {
			++ j;
			locals = calleeFuncDef.getLocals$();
			if (locals.length !== argsAndThisAndLocals.length - j) {
				throw new Error("logic flaw");
			}
			for (k = 0; k < locals.length; (++ k, ++ j)) {
				if (locals[k].getName$().getValue$() === expr.getToken$().getValue$()) {
					break;
				}
			}
		}
		if (j !== argsAndThisAndLocals.length) {
			if (argsAndThisAndLocals[j] instanceof FunctionExpression) {
				replaceCb(argsAndThisAndLocals[j]);
				argsAndThisAndLocals[j] = null;
			} else {
				replaceCb(argsAndThisAndLocals[j].clone$());
			}
		}
	} else {
		if (expr instanceof ThisExpression) {
			replaceCb(argsAndThisAndLocals[formalArgs.length].clone$());
		}
	}
	expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
		return $this._rewriteExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
	}));
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_InlineOptimizeCommand.prototype._functionHasThis$LMemberFunctionDefinition$ = function (funcDef) {
	do {
		if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
			return true;
		}
	} while ((funcDef = funcDef.getParent$()) != null);
	return false;
};

/**
 * class _ReturnIfOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _ReturnIfOptimizeCommand() {
}

_ReturnIfOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _ReturnIfOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _ReturnIfOptimizeCommand.IDENTIFIER);
	this._altered = false;
};

_ReturnIfOptimizeCommand$.prototype = new _ReturnIfOptimizeCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_ReturnIfOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (funcDef.getReturnType$().equals$LType$(Type.voidType)) {
		return false;
	}
	this._altered = false;
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	this.log$S(funcDef.getNotation$() + " " + (this._altered ? "Y" : "N"));
	return this._altered;
};

/**
 * @param {Array.<undefined|Statement>} statements
 * @return {!boolean}
 */
_ReturnIfOptimizeCommand.prototype._statementsCanBeReturnExpr$ALStatement$ = function (statements) {
	if (statements.length === 1 && statements[0] instanceof ReturnStatement) {
		return true;
	}
	this._optimizeStatements$ALStatement$(statements);
	if (statements.length === 1 && statements[0] instanceof ReturnStatement) {
		return true;
	}
	return false;
};

/**
 * @param {Array.<undefined|Statement>} statements
 */
_ReturnIfOptimizeCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	/** @type {IfStatement} */
	var ifStatement;
	/** @type {Array.<undefined|Statement>} */
	var onFalseStatements;
	if (statements.length >= 1 && statements[statements.length - 1] instanceof IfStatement) {
		ifStatement = statements[statements.length - 1];
		if (this._statementsCanBeReturnExpr$ALStatement$(ifStatement.getOnTrueStatements$()) && this._statementsCanBeReturnExpr$ALStatement$(ifStatement.getOnFalseStatements$())) {
			statements[statements.length - 1] = this._createReturnStatement$LToken$LExpression$LExpression$LExpression$(ifStatement.getToken$(), ifStatement.getExpr$(), ifStatement.getOnTrueStatements$()[0].getExpr$(), ifStatement.getOnFalseStatements$()[0].getExpr$());
			this._altered = true;
			this._optimizeStatements$ALStatement$(statements);
		}
	} else {
		if (statements.length >= 2 && statements[statements.length - 1] instanceof ReturnStatement && statements[statements.length - 2] instanceof IfStatement) {
			ifStatement = statements[statements.length - 2];
			if (this._statementsCanBeReturnExpr$ALStatement$(ifStatement.getOnTrueStatements$())) {
				onFalseStatements = ifStatement.getOnFalseStatements$();
				if (onFalseStatements.length === 0) {
					statements.splice(statements.length - 2, 2, this._createReturnStatement$LToken$LExpression$LExpression$LExpression$(ifStatement.getToken$(), ifStatement.getExpr$(), ifStatement.getOnTrueStatements$()[0].getExpr$(), statements[statements.length - 1].getExpr$()));
					this._altered = true;
					this._optimizeStatements$ALStatement$(statements);
				} else {
					if (onFalseStatements.length === 1 && onFalseStatements[0] instanceof IfStatement && onFalseStatements[0].getOnFalseStatements$().length === 0) {
						onFalseStatements[0].getOnFalseStatements$().push(statements[statements.length - 1]);
						statements.pop();
						this._altered = true;
						this._optimizeStatements$ALStatement$(statements);
					}
				}
			}
		}
	}
};

/**
 * @param {Token} token
 * @param {Expression} condExpr
 * @param {Expression} trueExpr
 * @param {Expression} falseExpr
 * @return {Statement}
 */
_ReturnIfOptimizeCommand.prototype._createReturnStatement$LToken$LExpression$LExpression$LExpression$ = function (token, condExpr, trueExpr, falseExpr) {
	return new ReturnStatement$LToken$LExpression$(token, new ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$(new Token$SB("?", false), condExpr, trueExpr, falseExpr, falseExpr.getType$()));
};

/**
 * class _LCSECachedExpression extends Object
 * @constructor
 */
function _LCSECachedExpression() {
}

/**
 * @constructor
 * @param {Expression} origExpr
 * @param {*} replaceCb
 */
function _LCSECachedExpression$LExpression$F$LExpression$V$(origExpr, replaceCb) {
	this._origExpr = origExpr;
	this._replaceCb = replaceCb;
	this._localExpr = null;
};

_LCSECachedExpression$LExpression$F$LExpression$V$.prototype = new _LCSECachedExpression;

/**
 * @return {Expression}
 */
_LCSECachedExpression.prototype.getOrigExpr$ = function () {
	return this._origExpr;
};

/**
 * @param {*} createVarCb
 * @return {LocalExpression}
 */
_LCSECachedExpression.prototype.getLocalExpr$F$LType$SLLocalExpression$$ = function (createVarCb) {
	if (this._localExpr == null) {
		this._localExpr = createVarCb(this._origExpr.getType$(), this._origExpr.getIdentifierToken$().getValue$());
		this._replaceCb(new AssignmentExpression$LToken$LExpression$LExpression$(new Token$SB("=", false), this._localExpr, this._origExpr));
	}
	return this._localExpr;
};

/**
 * class _LCSEOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _LCSEOptimizeCommand() {
}

_LCSEOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _LCSEOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _LCSEOptimizeCommand.IDENTIFIER);
};

_LCSEOptimizeCommand$.prototype = new _LCSEOptimizeCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_LCSEOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	_Util$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, (function (exprs) {
		$this._optimizeExpressions$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
	}));
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {Array.<undefined|Expression>} exprs
 */
_LCSEOptimizeCommand.prototype._optimizeExpressions$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	/** @type {Object.<string, undefined|_LCSECachedExpression>} */
	var cachedExprs;
	/** @type {*} */
	var getCacheKey;
	/** @type {*} */
	var registerCacheable;
	/** @type {*} */
	var clearCacheByLocalName;
	/** @type {*} */
	var clearCacheByPropertyName;
	/** @type {*} */
	var clearCache;
	/** @type {*} */
	var onExpr;
	this.log$S("optimizing expressions starting");
	cachedExprs = {};
	getCacheKey = (function (expr) {
		/** @type {PropertyExpression} */
		var propertyExpr;
		/** @type {Type} */
		var receiverType;
		/** @type {undefined|!string} */
		var base;
		if (expr instanceof PropertyExpression) {
			propertyExpr = expr;
			receiverType = propertyExpr.getExpr$().getType$();
			if (receiverType instanceof ObjectType && _Util$classIsNative$LClassDefinition$(receiverType.getClassDef$())) {
				return null;
			}
			base = getCacheKey(propertyExpr.getExpr$());
			if (base == null) {
				return null;
			}
			return base + "." + propertyExpr.getIdentifierToken$().getValue$();
		} else {
			if (expr instanceof LocalExpression) {
				return expr.getLocal$().getName$().getValue$();
			} else {
				if (expr instanceof ThisExpression) {
					return "this";
				}
			}
		}
		return null;
	});
	registerCacheable = (function (key, expr, replaceCb) {
		$this.log$S("registering lcse entry for: " + key);
		cachedExprs[key] = new _LCSECachedExpression$LExpression$F$LExpression$V$(expr, replaceCb);
	});
	clearCacheByLocalName = (function (name) {
		/** @type {!string} */
		var k;
		$this.log$S("clearing lcse entry for local name: " + name);
		for (k in cachedExprs) {
			if (k.substring(0, name.length + 1) === name + ".") {
				$this.log$S("  removing: " + k);
				delete cachedExprs[k];
			}
		}
	});
	clearCacheByPropertyName = (function (name) {
		/** @type {!string} */
		var k;
		/** @type {!boolean} */
		var mayPreserve;
		$this.log$S("clearing lcse entry for property name: " + name);
		for (k in cachedExprs) {
			mayPreserve = (function onExpr(expr) {
				if (expr instanceof LocalExpression || expr instanceof ThisExpression) {
					return true;
				}
				if (expr.getIdentifierToken$().getValue$() === name) {
					return false;
				}
				return onExpr(expr.getExpr$());
			})(cachedExprs[k].getOrigExpr$());
			if (! mayPreserve) {
				$this.log$S("  removing: " + k);
				delete cachedExprs[k];
			}
		}
	});
	clearCache = (function () {
		$this.log$S("clearing lcse cache");
		cachedExprs = {};
	});
	onExpr = (function (expr, replaceCb) {
		/** @type {AssignmentExpression} */
		var assignmentExpr;
		/** @type {Expression} */
		var lhsExpr;
		/** @type {PropertyExpression} */
		var lhsPropertyExpr;
		/** @type {undefined|!string} */
		var cacheKey;
		/** @type {IncrementExpression} */
		var incrementExpr;
		/** @type {PropertyExpression} */
		var propertyExpr;
		/** @type {ConditionalExpression} */
		var conditionalExpr;
		/** @type {Expression} */
		var funcExpr;
		/** @type {Array.<undefined|Expression>} */
		var args;
		/** @type {!number} */
		var i;
		if (expr instanceof AssignmentExpression) {
			assignmentExpr = expr;
			lhsExpr = assignmentExpr.getFirstExpr$();
			if (lhsExpr instanceof LocalExpression) {
				onExpr(assignmentExpr.getSecondExpr$(), (function (expr) {
					assignmentExpr.setSecondExpr$LExpression$(expr);
				}));
				clearCacheByLocalName(lhsExpr.getLocal$().getName$().getValue$());
			} else {
				if (lhsExpr instanceof PropertyExpression) {
					lhsPropertyExpr = lhsExpr;
					onExpr(lhsExpr.getExpr$(), (function (expr) {
						lhsPropertyExpr.setExpr$LExpression$(expr);
					}));
					onExpr(assignmentExpr.getSecondExpr$(), (function (expr) {
						assignmentExpr.setSecondExpr$LExpression$(expr);
					}));
					if (lhsPropertyExpr.getIdentifierToken$().getValue$() === "length") {
					} else {
						cacheKey = getCacheKey(lhsExpr);
						if (cacheKey) {
							registerCacheable(cacheKey, lhsExpr, (function (expr) {
								assignmentExpr.setFirstExpr$LExpression$(expr);
							}));
						}
					}
				} else {
					clearCache();
				}
			}
			return true;
		} else {
			if (expr instanceof IncrementExpression) {
				incrementExpr = expr;
				if (incrementExpr.getExpr$() instanceof PropertyExpression) {
					propertyExpr = incrementExpr.getExpr$();
					onExpr(propertyExpr.getExpr$(), (function (expr) {
						propertyExpr.setExpr$LExpression$(expr);
					}));
				}
				clearCache();
				return true;
			} else {
				if (expr instanceof ConditionalExpression) {
					conditionalExpr = expr;
					onExpr(conditionalExpr.getCondExpr$(), (function (expr) {
						conditionalExpr.setCondExpr$LExpression$(expr);
					}));
					clearCache();
					return true;
				} else {
					if (expr instanceof FunctionExpression) {
						clearCache();
						return true;
					} else {
						if (expr instanceof CallExpression) {
							funcExpr = expr.getExpr$();
							if (funcExpr instanceof LocalExpression) {
							} else {
								if (funcExpr instanceof PropertyExpression) {
									propertyExpr = funcExpr;
									onExpr(propertyExpr.getExpr$(), (function (expr) {
										propertyExpr.setExpr$LExpression$(expr);
									}));
								} else {
									clearCache();
								}
							}
							args = expr.getArguments$();
							for (i = 0; i < args.length; ++ i) {
								onExpr(args[i], (function (args, index) {
									return (function (expr) {
										args[index] = expr;
									});
								})(args, i));
							}
							clearCache();
							return true;
						} else {
							if (expr instanceof NewExpression) {
								$this.log$S("new expression");
								args = expr.getArguments$();
								for (i = 0; i < args.length; ++ i) {
									onExpr(args[i], (function (args, index) {
										return (function (expr) {
											args[index] = expr;
										});
									})(args, i));
								}
								clearCache();
								return true;
							}
						}
					}
				}
			}
		}
		if (expr instanceof PropertyExpression) {
			if (expr.getIdentifierToken$().getValue$() === "length") {
			} else {
				cacheKey = getCacheKey(expr);
				if (cacheKey) {
					$this.log$S("rewriting cse for: " + cacheKey);
					if (cachedExprs[cacheKey]) {
						replaceCb(cachedExprs[cacheKey].getLocalExpr$F$LType$SLLocalExpression$$((function (type, baseName) {
							/** @type {LocalVariable} */
							var localVar;
							localVar = $this.createVar$LMemberFunctionDefinition$LType$S(funcDef, type, baseName);
							return new LocalExpression$LToken$LLocalVariable$(localVar.getName$(), localVar);
						})).clone$());
					} else {
						registerCacheable(cacheKey, expr, replaceCb);
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, exprs);
};

/**
 * class _UnboxOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _UnboxOptimizeCommand() {
}

_UnboxOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _UnboxOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _UnboxOptimizeCommand.IDENTIFIER);
};

_UnboxOptimizeCommand$.prototype = new _UnboxOptimizeCommand;

/**
 * @return {OptimizerStash}
 */
_UnboxOptimizeCommand.prototype._createStash$ = function () {
	return new _UnboxOptimizeCommand$CStash$();
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_UnboxOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {Array.<undefined|LocalVariable>} */
	var locals;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var iMax;
	if (funcDef.getStatements$() == null) {
		return false;
	}
	locals = funcDef.getLocals$();
	for ((i = 0, iMax = locals.length); i < iMax; ) {
		if (this._optimizeLocal$LMemberFunctionDefinition$LLocalVariable$(funcDef, locals[i])) {
			locals.splice(i, 1);
		} else {
			++ i;
		}
	}
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {LocalVariable} local
 * @return {!boolean}
 */
_UnboxOptimizeCommand.prototype._optimizeLocal$LMemberFunctionDefinition$LLocalVariable$ = function (funcDef, local) {
	var $this = this;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {!boolean} */
	var foundNew;
	/** @type {*} */
	var onStatement;
	/** @type {!boolean} */
	var canUnbox;
	if (! (local.getType$() instanceof ObjectType)) {
		return false;
	}
	classDef = local.getType$().getClassDef$();
	if (_Util$classIsNative$LClassDefinition$(classDef)) {
		return false;
	}
	foundNew = false;
	onStatement = (function (statement) {
		/** @type {*} */
		var onExpr;
		/** @type {NewExpression} */
		var newExpr;
		onExpr = (function (expr) {
			/** @type {Expression} */
			var baseExpr;
			if (expr instanceof PropertyExpression) {
				baseExpr = expr.getExpr$();
				if (baseExpr instanceof LocalExpression && baseExpr.getLocal$() == local) {
					if (! expr.getType$().isAssignable$()) {
						return false;
					}
					return true;
				}
			} else {
				if (expr instanceof LocalExpression) {
					if (expr.getLocal$() == local) {
						return false;
					}
				} else {
					if (expr instanceof FunctionExpression) {
						return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
					}
				}
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		});
		newExpr = $this._statementIsConstructingTheLocal$LStatement$LLocalVariable$(statement, local);
		if (newExpr != null) {
			if (! newExpr.getType$().equals$LType$(local.getType$())) {
				return false;
			}
			if (! $this._newExpressionCanUnbox$LExpression$(newExpr)) {
				return false;
			}
			if (! newExpr.forEachExpression$F$LExpression$B$(onExpr)) {
				return false;
			}
			if (! Util$forEachExpression$F$LExpression$B$ALExpression$((function (expr) {
				return ! _Util$exprHasSideEffects$LExpression$(expr);
			}), newExpr.getArguments$())) {
				return false;
			}
			foundNew = true;
			return true;
		}
		if (! statement.forEachExpression$F$LExpression$B$(onExpr)) {
			return false;
		}
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	});
	canUnbox = funcDef.forEachStatement$F$LStatement$B$(onStatement);
	if (canUnbox && foundNew) {
		this._unboxVariable$LMemberFunctionDefinition$LLocalVariable$(funcDef, local);
		return true;
	} else {
		return false;
	}
};

/**
 * @param {Expression} newExpr
 * @return {!boolean}
 */
_UnboxOptimizeCommand.prototype._newExpressionCanUnbox$LExpression$ = function (newExpr) {
	var $this = this;
	/** @type {MemberFunctionDefinition} */
	var ctor;
	/** @type {_UnboxOptimizeCommand$CStash} */
	var stash;
	ctor = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(newExpr);
	stash = this.getStash$LStashable$(ctor);
	if (stash.canUnbox != null) {
		return stash.canUnbox;
	}
	return stash.canUnbox = (function () {
		if (ctor.getLocals$().length !== 0) {
			return false;
		}
		return ctor.forEachStatement$F$LStatement$B$((function (statement) {
			/** @type {Object.<string, undefined|!boolean>} */
			var assigned;
			/** @type {Expression} */
			var expr;
			/** @type {Expression} */
			var lhsExpr;
			/** @type {!string} */
			var propertyName;
			assigned = {};
			if (! (statement instanceof ExpressionStatement)) {
				return false;
			}
			expr = statement.getExpr$();
			if (! (expr instanceof AssignmentExpression)) {
				return false;
			}
			lhsExpr = expr.getFirstExpr$();
			if (! (lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$() instanceof ThisExpression)) {
				return false;
			}
			propertyName = lhsExpr.getIdentifierToken$().getValue$();
			if (assigned[propertyName]) {
				return false;
			}
			assigned[propertyName] = true;
			return (function onExpr(expr) {
				if (expr instanceof ThisExpression) {
					return false;
				} else {
					if (expr instanceof FunctionExpression) {
						return false;
					}
				}
				return expr.forEachExpression$F$LExpression$B$(onExpr);
			})(expr.getSecondExpr$());
		}));
	})();
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {LocalVariable} local
 */
_UnboxOptimizeCommand.prototype._unboxVariable$LMemberFunctionDefinition$LLocalVariable$ = function (funcDef, local) {
	var $this = this;
	/** @type {Object.<string, undefined|LocalVariable>} */
	var variableMap;
	/** @type {*} */
	var createLocalExpressionFor;
	/** @type {*} */
	var buildConstructingStatements;
	/** @type {*} */
	var onStatements;
	this.log$S("unboxing " + local.getName$().getValue$());
	variableMap = {};
	local.getType$().getClassDef$().forEachClassFromBase$F$LClassDefinition$B$((function (classDef) {
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
			if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) === 0) {
				variableMap[member.name$()] = $this.createVar$LMemberFunctionDefinition$LType$S(funcDef, member.getType$(), local.getName$().getValue$() + "$" + member.name$());
			}
			return true;
		}));
		return true;
	}));
	createLocalExpressionFor = (function (propertyName) {
		if (! variableMap[propertyName]) {
			throw new Error("could not find local variable for property name: " + propertyName);
		}
		return new LocalExpression$LToken$LLocalVariable$(variableMap[propertyName].getName$(), variableMap[propertyName]);
	});
	buildConstructingStatements = (function (dstStatements, dstStatementIndex, newExpr) {
		/** @type {MemberFunctionDefinition} */
		var ctor;
		ctor = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(newExpr);
		ctor.forEachStatement$F$LStatement$B$((function (statement) {
			/** @type {!string} */
			var propertyName;
			/** @type {Expression} */
			var rhsExpr;
			/** @type {*} */
			var onExpr;
			propertyName = statement.getExpr$().getFirstExpr$().getIdentifierToken$().getValue$();
			rhsExpr = statement.getExpr$().getSecondExpr$().clone$();
			onExpr = (function (expr, replaceCb) {
				/** @type {!number} */
				var argIndex;
				if (expr instanceof LocalExpression) {
					for (argIndex = 0; argIndex < ctor.getArguments$().length; ++ argIndex) {
						if (expr.getLocal$() == ctor.getArguments$()[argIndex]) {
							break;
						}
					}
					if (argIndex === ctor.getArguments$().length) {
						throw new Error("logic flaw, could not find the local in arguments");
					}
					replaceCb(newExpr.getArguments$()[argIndex].clone$());
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			});
			onExpr(rhsExpr, (function (expr) {
				rhsExpr = expr;
			}));
			dstStatements.splice(dstStatementIndex++, 0, new ExpressionStatement$LExpression$(new AssignmentExpression$LToken$LExpression$LExpression$(new Token$SB("=", false), createLocalExpressionFor(propertyName), rhsExpr)));
			return true;
		}));
		return dstStatementIndex;
	});
	onStatements = (function (statements) {
		/** @type {!number} */
		var statementIndex;
		/** @type {*} */
		var onExpr;
		/** @type {NewExpression} */
		var newExpr;
		for (statementIndex = 0; statementIndex < statements.length; ) {
			onExpr = (function (expr, replaceCb) {
				if (expr instanceof PropertyExpression && expr.getExpr$() instanceof LocalExpression && expr.getExpr$().getLocal$() == local) {
					replaceCb(createLocalExpressionFor(expr.getIdentifierToken$().getValue$()));
					return true;
				} else {
					if (expr instanceof FunctionExpression) {
						return onStatements(expr.getFuncDef$().getStatements$());
					} else {
						if (expr instanceof LocalExpression && expr.getLocal$() == local) {
							throw new Error("logic flaw, unexpected pattern");
						}
					}
				}
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				return true;
			});
			newExpr = $this._statementIsConstructingTheLocal$LStatement$LLocalVariable$(statements[statementIndex], local);
			if (newExpr != null) {
				statements.splice(statementIndex, 1);
				statementIndex = buildConstructingStatements(statements, statementIndex, newExpr);
			} else {
				statements[statementIndex].forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				statements[statementIndex].handleStatements$F$ALStatement$B$(onStatements);
				++ statementIndex;
			}
		}
		return true;
	});
	onStatements(funcDef.getStatements$());
};

/**
 * @param {Statement} statement
 * @param {LocalVariable} local
 * @return {NewExpression}
 */
_UnboxOptimizeCommand.prototype._statementIsConstructingTheLocal$LStatement$LLocalVariable$ = function (statement, local) {
	/** @type {Expression} */
	var expr;
	/** @type {Expression} */
	var lhsExpr;
	/** @type {Expression} */
	var rhsExpr;
	if (! (statement instanceof ExpressionStatement)) {
		return null;
	}
	expr = statement.getExpr$();
	if (! (expr instanceof AssignmentExpression)) {
		return null;
	}
	lhsExpr = expr.getFirstExpr$();
	if (! (lhsExpr instanceof LocalExpression)) {
		return null;
	}
	if (lhsExpr.getLocal$() != local) {
		return null;
	}
	rhsExpr = expr.getSecondExpr$();
	if (! (rhsExpr instanceof NewExpression)) {
		return null;
	}
	return rhsExpr;
};

/**
 * class _ArrayLengthOptimizeCommand extends _FunctionOptimizeCommand
 * @constructor
 */
function _ArrayLengthOptimizeCommand() {
}

_ArrayLengthOptimizeCommand.prototype = new _FunctionOptimizeCommand;
/**
 * @constructor
 */
function _ArrayLengthOptimizeCommand$() {
	_FunctionOptimizeCommand$S.call(this, _ArrayLengthOptimizeCommand.IDENTIFIER);
};

_ArrayLengthOptimizeCommand$.prototype = new _ArrayLengthOptimizeCommand;

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
_ArrayLengthOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		/** @type {Expression} */
		var condExpr;
		/** @type {LocalVariable} */
		var arrayLocal;
		statement.forEachStatement$F$LStatement$B$(onStatement);
		if (statement instanceof ForStatement) {
			condExpr = statement.getCondExpr$();
			arrayLocal = (condExpr != null ? $this._hasLengthExprOfLocalArray$LExpression$(condExpr) : null);
			if (arrayLocal != null) {
				$this._optimizeArrayLength$LMemberFunctionDefinition$LForStatement$LLocalVariable$(funcDef, statement, arrayLocal);
			}
		}
		return true;
	}));
	return true;
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @param {ForStatement} statement
 * @param {LocalVariable} arrayLocal
 */
_ArrayLengthOptimizeCommand.prototype._optimizeArrayLength$LMemberFunctionDefinition$LForStatement$LLocalVariable$ = function (funcDef, statement, arrayLocal) {
	var $this = this;
	/** @type {LocalVariable} */
	var lengthLocal;
	/** @type {AssignmentExpression} */
	var assignToLocal;
	/** @type {*} */
	var onExpr;
	if (this._lengthIsUnmodifiedInExpr$LExpression$(statement.getCondExpr$()) && this._lengthIsUnmodifiedInExpr$LExpression$(statement.getPostExpr$()) && statement.forEachStatement$F$LStatement$B$((function (statement) {
		return $this._lengthIsUnmodifiedInStatement$LStatement$(statement);
	}))) {
		this.log$S(funcDef.getNotation$() + " optimizing .length at line " + (statement.getToken$().getLineNumber$() + ""));
		lengthLocal = this.createVar$LMemberFunctionDefinition$LType$S(funcDef, Type.integerType, arrayLocal.getName$().getValue$() + "$len");
		assignToLocal = new AssignmentExpression$LToken$LExpression$LExpression$(new Token$SB("=", false), new LocalExpression$LToken$LLocalVariable$(new Token$SB(lengthLocal.getName$().getValue$(), true), lengthLocal), new PropertyExpression$LToken$LExpression$LToken$ALType$LType$(new Token$SB(".", false), new LocalExpression$LToken$LLocalVariable$(new Token$SB(arrayLocal.getName$().getValue$(), true), arrayLocal), new Token$SB("length", true), [], lengthLocal.getType$()));
		if (statement.getInitExpr$() != null) {
			statement.setInitExpr$LExpression$(new CommaExpression$LToken$LExpression$LExpression$(new Token$SB(",", false), statement.getInitExpr$(), assignToLocal));
		} else {
			statement.setInitExpr$LExpression$(assignToLocal);
		}
		onExpr = (function (expr, replaceCb) {
			if (expr instanceof PropertyExpression && expr.getIdentifierToken$().getValue$() === "length" && expr.getExpr$() instanceof LocalExpression && expr.getExpr$().getLocal$() == arrayLocal) {
				replaceCb(new LocalExpression$LToken$LLocalVariable$(new Token$SB(lengthLocal.getName$().getValue$(), true), lengthLocal));
			} else {
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			}
			return true;
		});
		statement.getCondExpr$().forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		statement.getPostExpr$().forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		statement.forEachStatement$F$LStatement$B$((function onStatement2(statement) {
			statement.forEachStatement$F$LStatement$B$(onStatement2);
			statement.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			return true;
		}));
	}
};

/**
 * @param {Expression} expr
 * @return {LocalVariable}
 */
_ArrayLengthOptimizeCommand.prototype._hasLengthExprOfLocalArray$LExpression$ = function (expr) {
	var $this = this;
	/** @type {LocalVariable} */
	var local;
	local = null;
	expr.forEachExpression$F$LExpression$B$((function onExpr(expr) {
		if (expr instanceof PropertyExpression && expr.getIdentifierToken$().getValue$() === "length" && expr.getExpr$() instanceof LocalExpression && $this._typeIsArray$LType$(expr.getExpr$().getType$().resolveIfNullable$())) {
			local = expr.getExpr$().getLocal$();
			return false;
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	}));
	return local;
};

/**
 * @param {Statement} statement
 * @return {!boolean}
 */
_ArrayLengthOptimizeCommand.prototype._lengthIsUnmodifiedInStatement$LStatement$ = function (statement) {
	var $this = this;
	if (! statement.forEachStatement$F$LStatement$B$((function (statement) {
		return $this._lengthIsUnmodifiedInStatement$LStatement$(statement);
	}))) {
		return false;
	}
	return statement.forEachExpression$F$LExpression$B$((function (expr) {
		return $this._lengthIsUnmodifiedInExpr$LExpression$(expr);
	}));
};

/**
 * @param {Expression} expr
 * @return {!boolean}
 */
_ArrayLengthOptimizeCommand.prototype._lengthIsUnmodifiedInExpr$LExpression$ = function (expr) {
	if (expr instanceof AssignmentExpression) {
		if (this._lhsMayModifyLength$LExpression$(expr.getFirstExpr$())) {
			return false;
		}
	} else {
		if (expr instanceof CallExpression || expr instanceof SuperExpression) {
			return false;
		} else {
			if (expr instanceof IncrementExpression) {
				if (this._lhsMayModifyLength$LExpression$(expr.getExpr$())) {
					return false;
				}
			}
		}
	}
	return true;
};

/**
 * @param {Expression} expr
 * @return {!boolean}
 */
_ArrayLengthOptimizeCommand.prototype._lhsMayModifyLength$LExpression$ = function (expr) {
	/** @type {Type} */
	var exprType;
	if (expr instanceof PropertyExpression && expr.getIdentifierToken$().getValue$() === "length") {
		return true;
	}
	if (expr instanceof ArrayExpression) {
		return true;
	}
	exprType = expr.getType$().resolveIfNullable$();
	if (exprType.equals$LType$(Type.variantType)) {
		return true;
	}
	if (this._typeIsArray$LType$(exprType)) {
		return true;
	}
	return false;
};

/**
 * @param {Type} type
 * @return {!boolean}
 */
_ArrayLengthOptimizeCommand.prototype._typeIsArray$LType$ = function (type) {
	/** @type {ClassDefinition} */
	var classDef;
	if (! (type instanceof ObjectType)) {
		return false;
	}
	classDef = type.getClassDef$();
	if (! (classDef instanceof InstantiatedClassDefinition)) {
		return false;
	}
	return classDef.getTemplateClassName$() === "Array";
};

/**
 * class _NoDebugCommand extends _OptimizeCommand
 * @constructor
 */
function _NoDebugCommand() {
}

_NoDebugCommand.prototype = new _OptimizeCommand;
/**
 * @constructor
 */
function _NoDebugCommand$() {
	_OptimizeCommand$S.call(this, _NoDebugCommand.IDENTIFIER);
};

_NoDebugCommand$.prototype = new _NoDebugCommand;

/**
 * @return {_NoDebugCommand$CStash}
 */
_NoDebugCommand.prototype._createStash$ = function () {
	return new _NoDebugCommand$CStash$();
};

/**
 */
_NoDebugCommand.prototype.performOptimization$ = function () {
	var $this = this;
	/** @type {_NoDebugCommand$CStash} */
	var stash;
	stash = this.getStash$LStashable$(this.getCompiler$().getEmitter$());
	stash.debugValue = false;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (classDef.className$() === "JSX") {
			classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (memberVariable) {
				/** @type {BooleanLiteralExpression} */
				var falseExpr;
				if (memberVariable.name$() === "DEBUG" && (memberVariable.flags$() & ClassDefinition.IS_STATIC) !== 0) {
					$this.log$S("set JSX.DEBUG = " + (stash.debugValue + ""));
					falseExpr = new BooleanLiteralExpression$LToken$(new Token$SB(stash.debugValue + "", true));
					memberVariable.setInitialValue$LExpression$(falseExpr);
					return false;
				}
				return true;
			}));
			return false;
		}
		return true;
	}));
};

/**
 * class SourceMapper extends Object
 * @constructor
 */
function SourceMapper() {
}

/**
 * @constructor
 * @param {!string} rootDir
 * @param {!string} outputFile
 */
function SourceMapper$SS(rootDir, outputFile) {
	this._fileMap = {};
	this._rootDir = rootDir;
	this._outputFile = Util$resolvePath$S(outputFile);
	this._copyDestDir = this._outputFile + ".mapping.d";
	this._impl = SourceMapper$createSourceMapGenerator$HS(({ file: Util$basename$S(this._outputFile), sourceRoot: Util$basename$S(this._copyDestDir) }));
};

SourceMapper$SS.prototype = new SourceMapper;

/**
 * @param {Object.<string, undefined|!string>} args
 * @return {_SourceMapGenerator}
 */
SourceMapper.createSourceMapGenerator$HS = function (args) {
	return eval('new (require("source-map").SourceMapGenerator)(' + JSON.stringify(args) + ')');
};

var SourceMapper$createSourceMapGenerator$HS = SourceMapper.createSourceMapGenerator$HS;

/**
 * @param {*} mapping
 * @return {_SourceMapConsumer}
 */
SourceMapper.createSourceMapConsumer$X = function (mapping) {
	return eval('new (require("source-map").SourceMapConsumer)(' + JSON.stringify(mapping) + ')');
};

var SourceMapper$createSourceMapConsumer$X = SourceMapper.createSourceMapConsumer$X;

/**
 * @param {Object.<string, undefined|!number>} generatedPos
 * @param {Object.<string, undefined|!number>} originalPos
 * @param {undefined|!string} sourceFile
 * @param {undefined|!string} tokenName
 */
SourceMapper.prototype.add$HNHNUSUS = function (generatedPos, originalPos, sourceFile, tokenName) {
	if (sourceFile != null) {
		if (sourceFile.indexOf(this._rootDir + "/") === 0) {
			sourceFile = sourceFile.substring(this._rootDir.length + 1);
		}
		if (! $__jsx_ObjectHasOwnProperty.call(this._fileMap, sourceFile)) {
			this._fileMap[sourceFile] = this._copyDestDir + "/" + sourceFile;
		}
	}
	this._impl.addMapping(({ generated: generatedPos, original: originalPos, source: sourceFile, name: tokenName }));
};

/**
 * @return {!string}
 */
SourceMapper.prototype.getSourceMappingFile$ = function () {
	return this._outputFile + ".mapping";
};

/**
 * @return {Object.<string, undefined|!string>}
 */
SourceMapper.prototype.getSourceFileMap$ = function () {
	return this._fileMap;
};

/**
 * @return {!string}
 */
SourceMapper.prototype.generate$ = function () {
	return this._impl.toString();
};

/**
 * @return {!string}
 */
SourceMapper.prototype.magicToken$ = function () {
	/** @type {!string} */
	var sourceMappingFile;
	sourceMappingFile = Util$basename$S(this.getSourceMappingFile$());
	return "\n" + "//@ sourceMappingURL=" + sourceMappingFile + "\n";
};

/**
 * class Compiler extends Object
 * @constructor
 */
function Compiler() {
}

/**
 * @constructor
 * @param {Platform} platform
 */
function Compiler$LPlatform$(platform) {
	this._builtinParsers = null;
	this._emitter = null;
	this._platform = platform;
	this._mode = Compiler.MODE_COMPILE;
	this._optimizer = null;
	this._warningFilters = [  ];
	this._parsers = [  ];
	this._fileCache = {};
	this._searchPaths = [ this._platform.getRoot$() + "/lib/common" ];
	this.addSourceFile$LToken$S(null, this._platform.getRoot$() + "/lib/built-in.jsx");
	this._builtinParsers = this._parsers.concat([]);
};

Compiler$LPlatform$.prototype = new Compiler;

/**
 * @param {!string} path
 */
Compiler.prototype.addSearchPath$S = function (path) {
	this._searchPaths.unshift(path);
};

/**
 * @return {Platform}
 */
Compiler.prototype.getPlatform$ = function () {
	return this._platform;
};

/**
 * @return {!number}
 */
Compiler.prototype.getMode$ = function () {
	return this._mode;
};

/**
 * @param {!number} mode
 * @return {Compiler}
 */
Compiler.prototype.setMode$N = function (mode) {
	this._mode = mode;
	return this;
};

/**
 * @return {Emitter}
 */
Compiler.prototype.getEmitter$ = function () {
	return this._emitter;
};

/**
 * @param {Emitter} emitter
 */
Compiler.prototype.setEmitter$LEmitter$ = function (emitter) {
	this._emitter = emitter;
};

/**
 * @param {Optimizer} optimizer
 */
Compiler.prototype.setOptimizer$LOptimizer$ = function (optimizer) {
	this._optimizer = optimizer;
};

/**
 * @return {Array.<undefined|*>}
 */
Compiler.prototype.getWarningFilters$ = function () {
	return this._warningFilters;
};

/**
 * @return {Array.<undefined|Parser>}
 */
Compiler.prototype.getParsers$ = function () {
	return this._parsers;
};

/**
 * @param {Token} token
 * @param {!string} path
 * @return {Parser}
 */
Compiler.prototype.addSourceFile$LToken$S = function (token, path) {
	return this.addSourceFile$LToken$SLCompletionRequest$(token, path, null);
};

/**
 * @param {Token} token
 * @param {!string} path
 * @param {CompletionRequest} completionRequest
 * @return {Parser}
 */
Compiler.prototype.addSourceFile$LToken$SLCompletionRequest$ = function (token, path, completionRequest) {
	/** @type {Parser} */
	var parser;
	if ((parser = this.findParser$S(path)) == null) {
		parser = new Parser$LToken$SLCompletionRequest$(token, path, completionRequest);
		this._parsers.push(parser);
	}
	return parser;
};

/**
 * @param {!string} path
 * @return {Parser}
 */
Compiler.prototype.findParser$S = function (path) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._parsers.length; ++ i) {
		if (this._parsers[i].getPath$() === path) {
			return this._parsers[i];
		}
	}
	return null;
};

/**
 * @return {!boolean}
 */
Compiler.prototype.compile$ = function () {
	/** @type {Array.<undefined|CompileError>} */
	var errors;
	/** @type {!number} */
	var i;
	/** @type {Parser} */
	var builtins;
	errors = [];
	for (i = 0; i < this._parsers.length; ++ i) {
		if (! this.parseFile$ALCompileError$LParser$(errors, this._parsers[i])) {
			if (! this._handleErrors$ALCompileError$(errors)) {
				return false;
			}
		}
	}
	switch (this._mode) {
	case Compiler.MODE_PARSE:
		return true;
	}
	this._resolveImports$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	builtins = this._builtinParsers[0];
	BooleanType._classDef = builtins.lookup$ALCompileError$LToken$S(errors, null, "Boolean");
	NumberType._classDef = builtins.lookup$ALCompileError$LToken$S(errors, null, "Number");
	StringType._classDef = builtins.lookup$ALCompileError$LToken$S(errors, null, "String");
	FunctionType._classDef = builtins.lookup$ALCompileError$LToken$S(errors, null, "Function");
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	this._resolveTypes$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	this._analyze$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	switch (this._mode) {
	case Compiler.MODE_COMPLETE:
		return true;
	case Compiler.MODE_DOC:
		return true;
	}
	this._optimize$();
	this._generateCode$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	return true;
};

/**
 * @return {*}
 */
Compiler.prototype.getAST$ = function () {
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	/** @type {!number} */
	var i;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++ i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
	}
	return ClassDefinition$serialize$ALClassDefinition$(classDefs);
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Token} sourceToken
 * @param {!string} path
 * @return {undefined|!string}
 */
Compiler.prototype.getFileContent$ALCompileError$LToken$S = function (errors, sourceToken, path) {
	if (! (path !== "")) {
		debugger;
		throw new Error("[src/compiler.jsx:179:20] assertion failure\n        assert path != \"\";\n                    ^^\n");
	}
	if (this._fileCache[path] == null) {
		try {
			this._fileCache[path] = this._platform.load$S(path);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				errors.push(new CompileError$LToken$S(sourceToken, "could not open file: " + path + ", " + $__jsx_catch_0.toString()));
				this._fileCache[path] = null;
			} else {
				throw $__jsx_catch_0;
			}
		}
	}
	return this._fileCache[path];
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Parser} parser
 * @return {!boolean}
 */
Compiler.prototype.parseFile$ALCompileError$LParser$ = function (errors, parser) {
	/** @type {undefined|!string} */
	var content;
	/** @type {Array.<undefined|Import>} */
	var imports;
	/** @type {!number} */
	var i;
	content = this.getFileContent$ALCompileError$LToken$S(errors, parser.getSourceToken$(), parser.getPath$());
	if (content == null) {
		parser.parse$SALCompileError$("", []);
		return false;
	}
	parser.parse$SALCompileError$(content, errors);
	if (this._mode !== Compiler.MODE_PARSE) {
		imports = parser.getImports$();
		for (i = 0; i < imports.length; ++ i) {
			if (! this._handleImport$ALCompileError$LParser$LImport$(errors, parser, imports[i])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @param {Parser} parser
 * @param {Import} imprt
 * @return {!boolean}
 */
Compiler.prototype._handleImport$ALCompileError$LParser$LImport$ = function (errors, parser, imprt) {
	/** @type {WildcardImport} */
	var wildImprt;
	/** @type {!string} */
	var resolvedDir;
	/** @type {Array.<undefined|!string>} */
	var files;
	/** @type {!boolean} */
	var found;
	/** @type {!number} */
	var i;
	/** @type {!string} */
	var path;
	/** @type {Parser} */
	var newParser;
	if (imprt instanceof WildcardImport) {
		wildImprt = imprt;
		resolvedDir = this._resolvePath$SS(wildImprt.getFilenameToken$().getFilename$(), wildImprt.getDirectory$());
		files = [];
		try {
			files = this._platform.getFilesInDirectory$S(resolvedDir);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				errors.push(new CompileError$LToken$S(wildImprt.getFilenameToken$(), "could not read files in directory: " + resolvedDir + ", " + $__jsx_catch_0.toString()));
				return false;
			} else {
				throw $__jsx_catch_0;
			}
		}
		found = false;
		for (i = 0; i < files.length; ++ i) {
			if (files[i].length >= wildImprt.getSuffix$().length && files[i].charAt(0) !== "." && files[i].substring(files[i].length - wildImprt.getSuffix$().length) === wildImprt.getSuffix$()) {
				path = resolvedDir + "/" + files[i];
				if (path !== parser.getPath$()) {
					newParser = this.addSourceFile$LToken$SLCompletionRequest$(wildImprt.getFilenameToken$(), resolvedDir + "/" + files[i], null);
					wildImprt.addSource$LParser$(newParser);
					found = true;
				}
			}
		}
		if (! found) {
			errors.push(new CompileError$LToken$S(wildImprt.getFilenameToken$(), "no matching files found in directory: " + resolvedDir));
			return false;
		}
	} else {
		path = this._resolvePath$SS(imprt.getFilenameToken$().getFilename$(), Util$decodeStringLiteral$S(imprt.getFilenameToken$().getValue$()));
		if (path === parser.getPath$()) {
			errors.push(new CompileError$LToken$S(imprt.getFilenameToken$(), "cannot import itself"));
			return false;
		}
		newParser = this.addSourceFile$LToken$SLCompletionRequest$(imprt.getFilenameToken$(), path, null);
		imprt.addSource$LParser$(newParser);
	}
	return true;
};

/**
 * @param {*} f
 * @return {!boolean}
 */
Compiler.prototype.forEachClassDef$F$LParser$LClassDefinition$B$ = function (f) {
	var $this = this;
	/** @type {*} */
	var onClassDef;
	/** @type {!number} */
	var i;
	/** @type {Parser} */
	var parser;
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	/** @type {!number} */
	var j;
	function onClassDef(parser, classDef) {
		/** @type {Array.<undefined|ClassDefinition>} */
		var inners;
		/** @type {!number} */
		var i;
		if (! f(parser, classDef)) {
			return false;
		}
		inners = classDef.getInnerClasses$();
		for (i = 0; i < inners.length; ++ i) {
			if (! onClassDef(parser, inners[i])) {
				return false;
			}
		}
		return true;
	};
	for (i = 0; i < this._parsers.length; ++ i) {
		parser = this._parsers[i];
		classDefs = parser.getClassDefs$();
		for (j = 0; j < classDefs.length; ++ j) {
			if (! onClassDef(parser, classDefs[j])) {
				return false;
			}
		}
	}
	return true;
};

/**
 * @param {Array.<undefined|CompileError>} errors
 */
Compiler.prototype._resolveImports$ALCompileError$ = function (errors) {
	/** @type {!number} */
	var i;
	/** @type {Array.<undefined|Import>} */
	var imports;
	/** @type {!number} */
	var j;
	for (i = 0; i < this._parsers.length; ++ i) {
		this._parsers[i].registerBuiltinImports$ALParser$(this._builtinParsers);
		imports = this._parsers[i].getImports$();
		for (j = 0; j < imports.length; ++ j) {
			imports[j].assertExistenceOfNamedClasses$ALCompileError$(errors);
		}
	}
};

/**
 * @param {Array.<undefined|CompileError>} errors
 */
Compiler.prototype._resolveTypes$ALCompileError$ = function (errors) {
	var $this = this;
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.resolveTypes$LAnalysisContext$(new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, parser, null));
		return true;
	}));
};

/**
 * @param {Array.<undefined|CompileError>} errors
 */
Compiler.prototype._analyze$ALCompileError$ = function (errors) {
	var $this = this;
	/** @type {*} */
	var createContext;
	createContext = (function (parser) {
		return new AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$(errors, parser, (function (parser, classDef) {
			classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
			classDef.analyze$LAnalysisContext$(createContext(parser));
			return classDef;
		}));
	});
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
		return true;
	}));
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.analyze$LAnalysisContext$(createContext(parser));
		return true;
	}));
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.analyzeUnusedVariables$();
		return true;
	}));
};

/**
 */
Compiler.prototype._optimize$ = function () {
	if (this._optimizer != null) {
		this._optimizer.setCompiler$LCompiler$(this).performOptimization$();
	}
};

/**
 * @param {Array.<undefined|CompileError>} errors
 */
Compiler.prototype._generateCode$ALCompileError$ = function (errors) {
	var $this = this;
	/** @type {Array.<undefined|ClassDefinition>} */
	var classDefs;
	/** @type {!number} */
	var i;
	/** @type {*} */
	var getMaxIndexOfClasses;
	/** @type {Array.<undefined|ClassDefinition>} */
	var deps;
	/** @type {!number} */
	var maxIndexOfClasses;
	/** @type {Object.<string, undefined|!number>} */
	var countByName;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {!string} */
	var className;
	/** @type {!string} */
	var escapedClassName;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++ i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
	}
	for (i = 0; i < classDefs.length; ++ i) {
		if (classDefs[i].getInnerClasses$().length !== 0) {
			classDefs = classDefs.concat(classDefs[i].getInnerClasses$());
		}
	}
	getMaxIndexOfClasses = (function (deps) {
		/** @type {!number} */
		var i;
		/** @type {!number} */
		var j;
		deps = deps.concat([]);
		if (deps.length === 0) {
			return - 1;
		}
		for (i = 0; i < classDefs.length; ++ i) {
			for (j = 0; j < deps.length; ++ j) {
				if (classDefs[i] == deps[j]) {
					deps.splice(j, 1);
					if (deps.length === 0) {
						return i;
					}
				}
			}
		}
		throw new Error("logic flaw, could not find class definition of '" + deps[0].className$() + "'");
	});
	for (i = 0; i < classDefs.length; ) {
		deps = classDefs[i].implementTypes$().map((function (t) {
			return t.getClassDef$();
		})).concat([]);
		if (classDefs[i].extendType$() != null) {
			deps.unshift(classDefs[i].extendType$().getClassDef$());
		}
		if (classDefs[i].getOuterClassDef$() != null) {
			deps.unshift(classDefs[i].getOuterClassDef$());
		}
		maxIndexOfClasses = getMaxIndexOfClasses(deps);
		if (maxIndexOfClasses > i) {
			classDefs.splice(maxIndexOfClasses + 1, 0, classDefs[i]);
			classDefs.splice(i, 1);
		} else {
			++ i;
		}
	}
	countByName = {};
	for (i = 0; i < classDefs.length; ++ i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			className = classDef.className$();
			if (countByName[className]) {
				errors.push(new CompileError$LToken$S(classDef.getToken$(), "found multiple definition for native class: " + className));
				return;
			}
			classDef.setOutputClassName$S(className);
			countByName[className] = 1;
		}
	}
	for (i = 0; i < classDefs.length; ++ i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			if (classDef.getOuterClassDef$() != null) {
				className = classDef.getOuterClassDef$().getOutputClassName$() + "$C" + classDef.className$();
			} else {
				className = classDef.className$();
			}
			if (countByName[className]) {
				classDef.setOutputClassName$S(className + "$" + (countByName[className] - 1 + ""));
				countByName[className]++;
			} else {
				classDef.setOutputClassName$S(className);
				countByName[className] = 1;
			}
		}
	}
	for (i = 0; i < classDefs.length; ++ i) {
		if ((classDefs[i].flags$() & ClassDefinition.IS_NATIVE) === 0) {
			escapedClassName = classDefs[i].getOutputClassName$().replace(/\.</g, "$$").replace(/>/g, "$E").replace(/[^A-Za-z0-9_]/g, "$");
			classDefs[i].setOutputClassName$S(escapedClassName);
		}
	}
	this._emitter.emit$ALClassDefinition$(classDefs);
};

/**
 * @param {Array.<undefined|CompileError>} errors
 * @return {!boolean}
 */
Compiler.prototype._handleErrors$ALCompileError$ = function (errors) {
	var $this = this;
	/** @type {!boolean} */
	var isFatal;
	if (this._mode === Compiler.MODE_COMPLETE) {
		errors.splice(0, errors.length);
		return true;
	}
	isFatal = false;
	errors.forEach((function (error) {
		/** @type {CompileWarning} */
		var warning;
		/** @type {undefined|!boolean} */
		var doWarn;
		/** @type {!number} */
		var i;
		if (error instanceof CompileWarning) {
			warning = error;
			for (i = 0; i < $this._warningFilters.length; ++ i) {
				if ((doWarn = $this._warningFilters[i](warning)) != null) {
					break;
				}
			}
			if (doWarn != false) {
				$this._platform.warn$S(warning.format$LPlatform$($this.getPlatform$()));
			}
		} else {
			$this._platform.error$S(error.format$LPlatform$($this.getPlatform$()));
			error.getCompileNotes$().forEach((function (note) {
				$this._platform.error$S(note.format$LPlatform$($this.getPlatform$()));
			}));
			isFatal = true;
		}
	}));
	errors.splice(0, errors.length);
	return ! isFatal;
};

/**
 * @param {!string} srcPath
 * @param {!string} givenPath
 * @return {!string}
 */
Compiler.prototype._resolvePath$SS = function (srcPath, givenPath) {
	/** @type {Array.<undefined|!string>} */
	var searchPaths;
	/** @type {!number} */
	var i;
	/** @type {!string} */
	var path;
	/** @type {!number} */
	var lastSlashAt;
	if (givenPath.match(/^\.{1,2}\//) == null) {
		searchPaths = this._searchPaths.concat(this._emitter.getSearchPaths$());
		for (i = 0; i < searchPaths.length; ++ i) {
			path = Util$resolvePath$S(searchPaths[i] + "/" + givenPath);
			if (this._platform.fileExists$S(path)) {
				return path;
			}
		}
	}
	lastSlashAt = srcPath.lastIndexOf("/");
	path = Util$resolvePath$S((lastSlashAt !== - 1 ? srcPath.substring(0, lastSlashAt + 1) : "") + givenPath);
	return path;
};

/**
 * class CompletionRequest extends Object
 * @constructor
 */
function CompletionRequest() {
}

/**
 * @constructor
 * @param {!number} lineNumber
 * @param {!number} columnOffset
 */
function CompletionRequest$NN(lineNumber, columnOffset) {
	this._lineNumber = lineNumber;
	this._columnOffest = columnOffset;
	this._candidates = [];
};

CompletionRequest$NN.prototype = new CompletionRequest;

/**
 * @return {!number}
 */
CompletionRequest.prototype.getLineNumber$ = function () {
	return this._lineNumber;
};

/**
 * @return {!number}
 */
CompletionRequest.prototype.getColumnOffset$ = function () {
	return this._columnOffest;
};

/**
 * @param {!number} lineNumber
 * @param {!number} columnOffset
 * @param {!number} length
 * @return {!number}
 */
CompletionRequest.prototype.isInRange$NNN = function (lineNumber, columnOffset, length) {
	if (lineNumber !== this._lineNumber) {
		return - 1;
	}
	if (columnOffset <= this._columnOffest && this._columnOffest <= columnOffset + length) {
		return this._columnOffest - columnOffset;
	}
	return - 1;
};

/**
 * @param {CompletionCandidates} candidates
 */
CompletionRequest.prototype.pushCandidates$LCompletionCandidates$ = function (candidates) {
	this._candidates.push(candidates);
};

/**
 * @return {Array.<undefined|Object.<string, undefined|*>>}
 */
CompletionRequest.prototype.getCandidates$ = function () {
	var $this = this;
	/** @type {Object.<string, undefined|!boolean>} */
	var seen;
	/** @type {Array.<undefined|Object.<string, undefined|*>>} */
	var results;
	seen = {};
	results = [];
	this._candidates.forEach((function (candidates) {
		/** @type {Array.<undefined|Object.<string, undefined|*>>} */
		var rawCandidates;
		/** @type {!string} */
		var prefix;
		rawCandidates = [];
		candidates.getCandidates$AHX(rawCandidates);
		prefix = candidates.getPrefix$();
		rawCandidates.forEach((function (s) {
			/** @type {!string} */
			var word;
			/** @type {!string} */
			var left;
			/** @type {!string} */
			var identity;
			word = s.word + "";
			if (prefix === "" && word.substring(0, 2) === "__" && word !== "__noconvert__" && word !== "undefined") {
			} else {
				if (word.substring(0, prefix.length) === prefix) {
					left = word.substring(prefix.length);
					if (left.length === 0) {
						return;
					}
					identity = JSON.stringify([ left, s.args ]);
					if (! $__jsx_ObjectHasOwnProperty.call(seen, identity)) {
						seen[identity] = true;
						if (word !== left) {
							s.partialWord = left;
						}
						delete s.kind;
						results.push(s);
					}
				}
			}
		}));
	}));
	return results;
};

/**
 * class CompletionCandidates extends Object
 * @constructor
 */
function CompletionCandidates() {
}

/**
 * @constructor
 */
function CompletionCandidates$() {
	this._prefix = null;
};

CompletionCandidates$.prototype = new CompletionCandidates;

/**
 * @return {!string}
 */
CompletionCandidates.prototype.getPrefix$ = function () {
	return this._prefix;
};

/**
 * @param {!string} prefix
 * @return {CompletionCandidates}
 */
CompletionCandidates.prototype.setPrefix$S = function (prefix) {
	this._prefix = prefix;
	return this;
};

/**
 * @param {ClassDefinition} classDef
 * @return {Object.<string, undefined|*>}
 */
CompletionCandidates.makeClassCandidate$LClassDefinition$ = function (classDef) {
	/** @type {Object.<string, undefined|*>} */
	var data;
	/** @type {DocComment} */
	var docComment;
	data = {};
	data.word = classDef.className$();
	data.definedFilename = classDef.getToken$().getFilename$();
	data.definedLineNumber = classDef.getToken$().getLineNumber$();
	if ((classDef.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
		data.kind = "interface";
	} else {
		if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
			data.kind = "mixin";
		} else {
			data.kind = "class";
		}
	}
	docComment = classDef.getDocComment$();
	if (docComment) {
		data.doc = docComment.getDescription$();
	}
	return data;
};

var CompletionCandidates$makeClassCandidate$LClassDefinition$ = CompletionCandidates.makeClassCandidate$LClassDefinition$;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 * @param {Parser} parser
 * @param {*} autoCompleteMatchCb
 */
CompletionCandidates._addClasses$AHXLParser$F$LClassDefinition$B$ = function (candidates, parser, autoCompleteMatchCb) {
	parser.getClassDefs$().forEach((function (classDef) {
		if (classDef instanceof InstantiatedClassDefinition) {
		} else {
			if (autoCompleteMatchCb == null || autoCompleteMatchCb(classDef)) {
				candidates.push(CompletionCandidates$makeClassCandidate$LClassDefinition$(classDef));
			}
		}
	}));
	parser.getTemplateClassDefs$().forEach((function (classDef) {
		if (autoCompleteMatchCb == null || autoCompleteMatchCb(classDef)) {
			candidates.push(CompletionCandidates$makeClassCandidate$LClassDefinition$(classDef));
		}
	}));
};

var CompletionCandidates$_addClasses$AHXLParser$F$LClassDefinition$B$ = CompletionCandidates._addClasses$AHXLParser$F$LClassDefinition$B$;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 * @param {Import} imprt
 * @param {*} autoCompleteMatchCb
 */
CompletionCandidates._addImportedClasses$AHXLImport$F$LClassDefinition$B$ = function (candidates, imprt, autoCompleteMatchCb) {
	/** @type {Array.<undefined|!string>} */
	var classNames;
	classNames = imprt.getClassNames$();
	if (classNames != null) {
		classNames.forEach((function (className) {
			/** @type {Object.<string, undefined|*>} */
			var data;
			data = {};
			data.word = className;
			data.kind = "class";
			candidates.push(data);
		}));
	} else {
		imprt.getSources$().forEach((function (parser) {
			CompletionCandidates$_addClasses$AHXLParser$F$LClassDefinition$B$(candidates, parser, autoCompleteMatchCb);
		}));
	}
};

var CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$ = CompletionCandidates._addImportedClasses$AHXLImport$F$LClassDefinition$B$;

/**
 * class KeywordCompletionCandidate extends CompletionCandidates
 * @constructor
 */
function KeywordCompletionCandidate() {
}

KeywordCompletionCandidate.prototype = new CompletionCandidates;
/**
 * @constructor
 * @param {!string} expected
 */
function KeywordCompletionCandidate$S(expected) {
	CompletionCandidates$.call(this);
	this._expected = expected;
};

KeywordCompletionCandidate$S.prototype = new KeywordCompletionCandidate;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 */
KeywordCompletionCandidate.prototype.getCandidates$AHX = function (candidates) {
	/** @type {Object.<string, undefined|*>} */
	var data;
	data = {};
	data.word = this._expected;
	data.kind = "keyword";
	candidates.push(data);
};

/**
 * class CompletionCandidatesOfTopLevel extends CompletionCandidates
 * @constructor
 */
function CompletionCandidatesOfTopLevel() {
}

CompletionCandidatesOfTopLevel.prototype = new CompletionCandidates;
/**
 * @constructor
 * @param {Parser} parser
 * @param {*} autoCompleteMatchCb
 */
function CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$(parser, autoCompleteMatchCb) {
	CompletionCandidates$.call(this);
	this._parser = parser;
	this._autoCompleteMatchCb = autoCompleteMatchCb;
};

CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$.prototype = new CompletionCandidatesOfTopLevel;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 */
CompletionCandidatesOfTopLevel.prototype.getCandidates$AHX = function (candidates) {
	/** @type {!number} */
	var i;
	/** @type {Import} */
	var imprt;
	/** @type {undefined|!string} */
	var alias;
	/** @type {Object.<string, undefined|*>} */
	var data;
	CompletionCandidates$_addClasses$AHXLParser$F$LClassDefinition$B$(candidates, this._parser, this._autoCompleteMatchCb);
	for (i = 0; i < this._parser._imports.length; ++ i) {
		imprt = this._parser._imports[i];
		alias = imprt.getAlias$();
		if (alias != null) {
			data = {};
			data.word = alias;
			data.kind = "alias";
			candidates.push(data);
		} else {
			CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$(candidates, imprt, this._autoCompleteMatchCb);
		}
	}
};

/**
 * class _CompletionCandidatesWithLocal extends CompletionCandidatesOfTopLevel
 * @constructor
 */
function _CompletionCandidatesWithLocal() {
}

_CompletionCandidatesWithLocal.prototype = new CompletionCandidatesOfTopLevel;
/**
 * @constructor
 * @param {Parser} parser
 */
function _CompletionCandidatesWithLocal$LParser$(parser) {
	var $this = this;
	CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$.call(this, parser, null);
	this._locals = [];
	parser._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$((function (funcName, locals, args) {
		/** @type {!number} */
		var i;
		if (funcName != null) {
			$this._locals = $this._locals.concat([ funcName ]);
		}
		$this._locals = $this._locals.concat(locals);
		for (i in args) {
			$this._locals.push(args[i]);
		}
		return true;
	}));
};

_CompletionCandidatesWithLocal$LParser$.prototype = new _CompletionCandidatesWithLocal;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 */
_CompletionCandidatesWithLocal.prototype.getCandidates$AHX = function (candidates) {
	var $this = this;
	this._locals.forEach((function (local) {
		/** @type {Object.<string, undefined|*>} */
		var data;
		/** @type {Type} */
		var type;
		data = {};
		data.word = local.getName$().getValue$();
		data.kind = 'variable';
		data.definedFilename = local.getName$().getFilename$();
		data.definedLineNumber = local.getName$().getLineNumber$();
		type = local.getType$();
		if (type != null) {
			data.type = type.toString();
		}
		candidates.push(data);
	}));
	CompletionCandidatesOfTopLevel.prototype.getCandidates$AHX.call(this, candidates);
};

/**
 * class _CompletionCandidatesOfNamespace extends CompletionCandidates
 * @constructor
 */
function _CompletionCandidatesOfNamespace() {
}

_CompletionCandidatesOfNamespace.prototype = new CompletionCandidates;
/**
 * @constructor
 * @param {Import} imprt
 * @param {*} autoCompleteMatchCb
 */
function _CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$(imprt, autoCompleteMatchCb) {
	CompletionCandidates$.call(this);
	this._import = imprt;
	this._autoCompleteMatchCb = autoCompleteMatchCb;
};

_CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$.prototype = new _CompletionCandidatesOfNamespace;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 */
_CompletionCandidatesOfNamespace.prototype.getCandidates$AHX = function (candidates) {
	CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$(candidates, this._import, this._autoCompleteMatchCb);
};

/**
 * class _CompletionCandidatesOfProperty extends CompletionCandidates
 * @constructor
 */
function _CompletionCandidatesOfProperty() {
}

_CompletionCandidatesOfProperty.prototype = new CompletionCandidates;
/**
 * @constructor
 * @param {Expression} expr
 */
function _CompletionCandidatesOfProperty$LExpression$(expr) {
	CompletionCandidates$.call(this);
	this._expr = expr;
};

_CompletionCandidatesOfProperty$LExpression$.prototype = new _CompletionCandidatesOfProperty;

/**
 * @param {Array.<undefined|Object.<string, undefined|*>>} candidates
 */
_CompletionCandidatesOfProperty.prototype.getCandidates$AHX = function (candidates) {
	var $this = this;
	/** @type {Type} */
	var type;
	/** @type {ClassDefinition} */
	var classDef;
	/** @type {!boolean} */
	var isStatic;
	type = this._expr.getType$();
	if (type == null) {
		return;
	}
	type = type.resolveIfNullable$();
	if (type.equals$LType$(Type.voidType) || type.equals$LType$(Type.nullType) || type.equals$LType$(Type.variantType)) {
		return;
	}
	classDef = type.getClassDef$();
	if (classDef == null) {
		return;
	}
	isStatic = this._expr instanceof ClassExpression;
	classDef.forEachClassToBase$F$LClassDefinition$B$((function (c) {
		c.forEachMember$F$LMemberDefinition$B$((function (member) {
			if (((member.flags$() & ClassDefinition.IS_STATIC) !== 0) === isStatic) {
				if (! isStatic && member.name$() === "constructor") {
					return true;
				}
				candidates.push(_CompletionCandidatesOfProperty$_makeMemberCandidate$LMemberDefinition$(member));
			}
			return true;
		}));
		return true;
	}));
};

/**
 * @param {MemberDefinition} member
 * @return {Object.<string, undefined|*>}
 */
_CompletionCandidatesOfProperty._makeMemberCandidate$LMemberDefinition$ = function (member) {
	/** @type {!string} */
	var kind;
	/** @type {Object.<string, undefined|*>} */
	var data;
	/** @type {DocComment} */
	var docComment;
	/** @type {MemberFunctionDefinition} */
	var mf;
	kind = (member.flags$() & ClassDefinition.IS_STATIC ? "static member" : "member");
	kind += (member instanceof MemberFunctionDefinition ? " function" : " variable");
	data = {};
	data.word = member.name$();
	data.type = member.getType$().toString();
	data.kind = kind;
	data.definedClass = member.getClassDef$().className$();
	data.definedFilename = member.getToken$().getFilename$();
	data.definedLineNumber = member.getToken$().getLineNumber$();
	docComment = member.getDocComment$();
	if (docComment) {
		data.doc = docComment.getDescription$();
	}
	if (member instanceof MemberFunctionDefinition) {
		mf = member;
		data.returnType = mf.getReturnType$().toString();
		data.args = mf.getArguments$().map((function (arg) {
			/** @type {Object.<string, undefined|!string>} */
			var pair;
			pair = {};
			pair.name = arg.getName$().getValue$();
			pair.type = arg.getType$().toString();
			return pair;
		}));
	}
	return data;
};

var _CompletionCandidatesOfProperty$_makeMemberCandidate$LMemberDefinition$ = _CompletionCandidatesOfProperty._makeMemberCandidate$LMemberDefinition$;

/**
 * class DocCommentNode extends Object
 * @constructor
 */
function DocCommentNode() {
}

/**
 * @constructor
 */
function DocCommentNode$() {
	this._description = "";
};

DocCommentNode$.prototype = new DocCommentNode;

/**
 * @return {!string}
 */
DocCommentNode.prototype.getDescription$ = function () {
	return this._description;
};

/**
 * @param {!string} s
 */
DocCommentNode.prototype.appendDescription$S = function (s) {
	s = s.trim();
	if (s !== "") {
		if (this._description !== "") {
			this._description += " ";
		}
		this._description += s;
	}
};

/**
 * class DocCommentParameter extends DocCommentNode
 * @constructor
 */
function DocCommentParameter() {
}

DocCommentParameter.prototype = new DocCommentNode;
/**
 * @constructor
 * @param {Token} token
 */
function DocCommentParameter$LToken$(token) {
	DocCommentNode$.call(this);
	this._token = token;
};

DocCommentParameter$LToken$.prototype = new DocCommentParameter;

/**
 * @return {Token}
 */
DocCommentParameter.prototype.getToken$ = function () {
	return this._token;
};

/**
 * @return {!string}
 */
DocCommentParameter.prototype.getParamName$ = function () {
	return this._token.getValue$();
};

/**
 * class DocCommentTag extends DocCommentNode
 * @constructor
 */
function DocCommentTag() {
}

DocCommentTag.prototype = new DocCommentNode;
/**
 * @constructor
 * @param {!string} tagName
 */
function DocCommentTag$S(tagName) {
	DocCommentNode$.call(this);
	this._tagName = tagName;
};

DocCommentTag$S.prototype = new DocCommentTag;

/**
 * @return {!string}
 */
DocCommentTag.prototype.getTagName$ = function () {
	return this._tagName;
};

/**
 * class DocComment extends DocCommentNode
 * @constructor
 */
function DocComment() {
}

DocComment.prototype = new DocCommentNode;
/**
 * @constructor
 */
function DocComment$() {
	DocCommentNode$.call(this);
	this._params = [];
	this._tags = [];
};

DocComment$.prototype = new DocComment;

/**
 * @return {Array.<undefined|DocCommentParameter>}
 */
DocComment.prototype.getParams$ = function () {
	return this._params;
};

/**
 * @return {Array.<undefined|DocCommentTag>}
 */
DocComment.prototype.getTags$ = function () {
	return this._tags;
};

/**
 * @param {!string} tagName
 * @return {DocCommentTag}
 */
DocComment.prototype.getTagByName$S = function (tagName) {
	/** @type {!number} */
	var i;
	for (i = 0; i < this._tags.length; ++ i) {
		if (this._tags[i].getTagName$() === tagName) {
			return this._tags[i];
		}
	}
	return null;
};

/**
 * @param {!string} tagName
 * @return {Array.<undefined|DocCommentTag>}
 */
DocComment.prototype.getTagsByName$S = function (tagName) {
	/** @type {Array.<undefined|DocCommentTag>} */
	var tags;
	/** @type {!number} */
	var i;
	tags = [];
	for (i = 0; i < this._tags.length; ++ i) {
		if (this._tags[i].getTagName$() === tagName) {
			tags.push(this._tags[i]);
		}
	}
	return tags;
};

/**
 * class DocumentGenerator extends Object
 * @constructor
 */
function DocumentGenerator() {
}

/**
 * @constructor
 * @param {Compiler} compiler
 * @param {!string} templatePath
 * @param {!string} outputPath
 */
function DocumentGenerator$LCompiler$SS(compiler, templatePath, outputPath) {
	this._classDefToHTMLCache = new TypedMap$ClassDefinition$string$E$();
	this._compiler = compiler;
	this._templatePath = templatePath;
	this._outputPath = outputPath;
	this._resourceFiles = [];
	this._pathFilter = null;
};

DocumentGenerator$LCompiler$SS.prototype = new DocumentGenerator;

/**
 * @param {Array.<undefined|!string>} files
 * @return {DocumentGenerator}
 */
DocumentGenerator.prototype.setResourceFiles$AS = function (files) {
	this._resourceFiles = files;
	return this;
};

/**
 * @param {*} pathFilter
 * @return {DocumentGenerator}
 */
DocumentGenerator.prototype.setPathFilter$F$SB$ = function (pathFilter) {
	this._pathFilter = pathFilter;
	return this;
};

/**
 */
DocumentGenerator.prototype.buildDoc$ = function () {
	var $this = this;
	/** @type {Platform} */
	var platform;
	platform = this._compiler.getPlatform$();
	this._resourceFiles.forEach((function (file) {
		platform.save$USS($this._outputPath + "/" + file, platform.load$S($this._templatePath + "/" + file));
	}));
	this._compiler.getParsers$().forEach((function (parser) {
		/** @type {!string} */
		var encodedFilename;
		/** @type {!string} */
		var outputFile;
		/** @type {!string} */
		var html;
		encodedFilename = platform.encodeFilename$S(parser.getPath$());
		if ($this._pathFilter(encodedFilename)) {
			outputFile = $this._outputPath + "/" + parser.getPath$() + ".html";
			html = $this._buildDocOfFile$LParser$(parser);
			platform.save$USS(outputFile, html);
		}
	}));
};

/**
 * @param {Parser} parser
 * @return {!string}
 */
DocumentGenerator.prototype._buildDocOfFile$LParser$ = function (parser) {
	var $this = this;
	/** @type {!string} */
	var htmlFile;
	htmlFile = this._templatePath + "/template.html";
	return this._compiler.getPlatform$().load$S(htmlFile).replace(/<%JSX:(.*?)%>/g, (function (matched) {
		/** @type {!string} */
		var key;
		key = matched.substring(6, matched.length - 2);
		switch (key) {
		case "BASE_HREF":
			return parser.getPath$().replace(/\/[^\/]+$/, "").replace(/[^\/]+/g, "..");
		case "TITLE":
			return $this._escape$S(parser.getPath$());
		case "BODY":
			return $this._buildBodyOfFile$LParser$(parser);
		case "FOOTER":
			return $this._buildFooterOfFile$LParser$(parser);
		default:
			throw new Error("unknown template key:" + key + " in file: " + htmlFile);
		}
	}));
};

/**
 * @param {Parser} parser
 * @return {!string}
 */
DocumentGenerator.prototype._buildBodyOfFile$LParser$ = function (parser) {
	/** @type {!string} */
	var _;
	_ = "";
	_ += "<div class=\"jsxdoc\">\n";
	_ += "<div class=\"file\">\n";
	_ += "<h1>";
	_ += this._escape$S(parser.getPath$()).replace(/\n$/, "");
	_ += "</h1>\n";
	_ += this._descriptionToHTML$LDocComment$(parser.getDocComment$()).replace(/\n$/, "");
	_ += "\n";
	_ += "</div><!--/file-->\n";
	_ += this._buildListOfClasses$LParser$(parser).replace(/\n$/, "");
	_ += "\n";
	_ += "</div><!--/jsxdoc-->\n";
	return _;
};

/**
 * @param {Parser} parser
 * @return {!string}
 */
DocumentGenerator.prototype._buildFooterOfFile$LParser$ = function (parser) {
	/** @type {!string} */
	var _;
	/** @type {DocComment} */
	var docComment;
	/** @type {DocCommentTag} */
	var version;
	/** @type {DocCommentTag} */
	var author;
	/** @type {!string} */
	var d;
	/** @type {!boolean} */
	var endWithDot;
	_ = "";
	docComment = parser.getDocComment$();
	if (docComment) {
		version = docComment.getTagByName$S("version");
		if (version) {
			_ += "<p>This is <strong>";
			_ += this._escape$S(parser.getPath$()).replace(/\n$/, "");
			_ += " version ";
			_ += this._escape$S(version.getDescription$()).replace(/\n$/, "");
			_ += "</strong>.</p>\n";
		}
		author = docComment.getTagByName$S("author");
		if (author) {
			d = author.getDescription$();
			endWithDot = d.charAt(d.length - 1) === ".";
			_ += "<p>Copyright &copy; ";
			_ += (this._escape$S(d) + (endWithDot ? "" : ".")).replace(/\n$/, "");
			_ += "</p>\n";
		}
	}
	_ += "<p class=\"jsxdoc-notice\">This document was automatically generated by <a href=\"http://jsx.github.com/\">JSX</a> ";
	_ += Meta.VERSION_STRING.replace(/\n$/, "");
	_ += "<br />\n";
	_ += "at ";
	_ += this._escape$S(new Date().toISOString()).replace(/\n$/, "");
	_ += ".</p>\n";
	return _;
};

/**
 * @param {Parser} parser
 * @return {!string}
 */
DocumentGenerator.prototype._buildListOfClasses$LParser$ = function (parser) {
	var $this = this;
	/** @type {!string} */
	var _;
	_ = "";
	_ += "<div class=\"classes\">\n";
	parser.getTemplateClassDefs$().forEach((function (classDef) {
		_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
		_ += "\n";
	}));
	parser.getClassDefs$().forEach((function (classDef) {
		if (! (classDef instanceof InstantiatedClassDefinition)) {
			_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
			_ += "\n";
		}
	}));
	_ += "</div>\n";
	return _;
};

/**
 * @param {Parser} parser
 * @param {ClassDefinition} classDef
 * @return {!string}
 */
DocumentGenerator.prototype._buildDocOfClass$LParser$LClassDefinition$ = function (parser, classDef) {
	var $this = this;
	/** @type {!string} */
	var typeName;
	/** @type {Array.<undefined|Token>} */
	var typeArgs;
	/** @type {!string} */
	var _;
	typeName = "class";
	if ((classDef.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
		typeName = "interface";
	} else {
		if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
			typeName = "mixin";
		}
	}
	typeArgs = (classDef instanceof TemplateClassDefinition ? classDef.getTypeArguments$() : []);
	_ = "";
	_ += "<div class=\"class\" id=\"class-";
	_ += this._escape$S(classDef.className$()).replace(/\n$/, "");
	_ += "\">\n";
	_ += "<h2>";
	_ += (this._flagsToHTML$N(classDef.flags$()) + " " + this._escape$S(typeName + " " + classDef.className$()) + this._formalTypeArgsToHTML$ALToken$(typeArgs)).replace(/\n$/, "");
	_ += "</h2>\n";
	_ += this._descriptionToHTML$LDocComment$(classDef.getDocComment$()).replace(/\n$/, "");
	_ += "\n";
	if (this._hasPublicProperties$LClassDefinition$(classDef)) {
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if (! $this._isPrivate$LMemberDefinition$(varDef)) {
				_ += "<div class=\"member property\">\n";
				_ += "<h3>\n";
				_ += $this._flagsToHTML$N(varDef.flags$()).replace(/\n$/, "");
				_ += " var ";
				_ += varDef.name$().replace(/\n$/, "");
				_ += " : ";
				_ += $this._typeToHTML$LParser$LType$(parser, varDef.getType$()).replace(/\n$/, "");
				_ += "\n";
				_ += "</h3>\n";
				_ += $this._descriptionToHTML$LDocComment$(varDef.getDocComment$()).replace(/\n$/, "");
				_ += "\n";
				_ += "</div>\n";
			}
			return true;
		}));
	}
	classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		if (! (funcDef instanceof InstantiatedMemberFunctionDefinition) && $this._isConstructor$LMemberFunctionDefinition$(funcDef) && (funcDef.flags$() & ClassDefinition.IS_DELETE) === 0) {
			_ += $this._buildDocOfFunction$LParser$LMemberFunctionDefinition$(parser, funcDef).replace(/\n$/, "");
			_ += "\n";
		}
		return true;
	}));
	if (this._hasPublicFunctions$LClassDefinition$(classDef)) {
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			if (! (funcDef instanceof InstantiatedMemberFunctionDefinition || $this._isConstructor$LMemberFunctionDefinition$(funcDef) || $this._isPrivate$LMemberDefinition$(funcDef))) {
				_ += $this._buildDocOfFunction$LParser$LMemberFunctionDefinition$(parser, funcDef).replace(/\n$/, "");
				_ += "\n";
			}
			return true;
		}));
	}
	_ += "</div>\n";
	return _;
};

/**
 * @param {Parser} parser
 * @param {MemberFunctionDefinition} funcDef
 * @return {!string}
 */
DocumentGenerator.prototype._buildDocOfFunction$LParser$LMemberFunctionDefinition$ = function (parser, funcDef) {
	var $this = this;
	/** @type {!string} */
	var _;
	/** @type {!string} */
	var funcName;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!string} */
	var argsHTML;
	_ = "";
	funcName = (this._isConstructor$LMemberFunctionDefinition$(funcDef) ? "new " + funcDef.getClassDef$().className$() : this._flagsToHTML$N(funcDef.flags$()) + " function " + funcDef.name$());
	args = funcDef.getArguments$();
	argsHTML = args.map((function (arg) {
		return $this._escape$S(arg.getName$().getValue$()) + " : " + $this._typeToHTML$LParser$LType$(parser, arg.getType$());
	})).join(", ");
	_ += "<div class=\"member function\">\n";
	_ += "<h3>\n";
	_ += (this._escape$S(funcName) + this._formalTypeArgsToHTML$ALToken$(funcDef instanceof TemplateFunctionDefinition ? funcDef.getTypeArguments$() : [])).replace(/\n$/, "");
	_ += "(";
	_ += argsHTML.replace(/\n$/, "");
	_ += ")\n";
	if (! this._isConstructor$LMemberFunctionDefinition$(funcDef)) {
		_ += " : ";
		_ += this._typeToHTML$LParser$LType$(parser, funcDef.getReturnType$()).replace(/\n$/, "");
		_ += "\n";
	}
	_ += "</h3>\n";
	_ += this._descriptionToHTML$LDocComment$(funcDef.getDocComment$()).replace(/\n$/, "");
	_ += "\n";
	if (this._argsHasDocComment$LMemberFunctionDefinition$(funcDef)) {
		_ += "<table class=\"arguments\">\n";
		args.forEach((function (arg) {
			/** @type {!string} */
			var argName;
			argName = arg.getName$().getValue$();
			_ += "<tr>\n";
			_ += "<td class=\"param-name\">";
			_ += $this._escape$S(argName).replace(/\n$/, "");
			_ += "</td>\n";
			_ += "<td class=\"param-desc\">";
			_ += $this._argumentDescriptionToHTML$SLDocComment$(argName, funcDef.getDocComment$()).replace(/\n$/, "");
			_ += "</td>\n";
			_ += "</tr>\n";
		}));
		_ += "</table>\n";
	}
	_ += "</div>\n";
	return _;
};

/**
 * @param {DocComment} docComment
 * @return {!string}
 */
DocumentGenerator.prototype._descriptionToHTML$LDocComment$ = function (docComment) {
	var $this = this;
	/** @type {!string} */
	var _;
	/** @type {Array.<undefined|DocCommentTag>} */
	var seeTags;
	_ = "";
	if (docComment != null) {
		if (docComment.getDescription$() !== "") {
			_ += "<div class=\"description\">\n";
			_ += docComment.getDescription$().replace(/\n$/, "");
			_ += "\n";
			_ += "</div>\n";
		}
		seeTags = docComment.getTagsByName$S("see");
		if (seeTags.length > 0) {
			_ += "<ul class=\"see\">\n";
			seeTags.forEach((function (tag) {
				_ += "<li>";
				_ += $this._autoLink$S(tag.getDescription$()).replace(/\n$/, "");
				_ += "</li>\n";
			}));
			_ += "</ul>\n";
		}
	}
	return _;
};

/**
 * @param {!string} str
 * @return {!string}
 */
DocumentGenerator.prototype._autoLink$S = function (str) {
	var $this = this;
	/** @type {RegExp} */
	var uri;
	uri = /^https?:\/\/[A-Za-z0-9\-\._~:\/?#\[\]@!$&'()*+,;=]+/;
	return str.replace(uri, (function (matched) {
		return Util$format$SAS('<a href="%1">%1</a>', [ matched ]);
	}));
};

/**
 * @param {!string} name
 * @param {DocComment} docComment
 * @return {!string}
 */
DocumentGenerator.prototype._argumentDescriptionToHTML$SLDocComment$ = function (name, docComment) {
	return (docComment != null ? this._getDescriptionOfNamedArgument$LDocComment$S(docComment, name) : "");
};

/**
 * @param {Array.<undefined|Token>} typeArgs
 * @return {!string}
 */
DocumentGenerator.prototype._formalTypeArgsToHTML$ALToken$ = function (typeArgs) {
	var $this = this;
	if (typeArgs.length === 0) {
		return "";
	}
	return ".&lt;" + typeArgs.map((function (typeArg) {
		return $this._escape$S(typeArg.getValue$());
	})).join(", ") + "&gt;";
};

/**
 * @param {Parser} parser
 * @param {Type} type
 * @return {!string}
 */
DocumentGenerator.prototype._typeToHTML$LParser$LType$ = function (parser, type) {
	var $this = this;
	/** @type {ClassDefinition} */
	var classDef;
	if (type instanceof ObjectType) {
		classDef = type.getClassDef$();
		if (classDef != null) {
			return this._classDefToHTML$LParser$LClassDefinition$(parser, classDef);
		} else {
			if (type instanceof ParsedObjectType && type.getTypeArguments$().length !== 0) {
				classDef = type.getQualifiedName$().getTemplateClass$LParser$(parser);
				if (classDef != null) {
					return this._classDefToHTML$LParser$LClassDefinition$(parser, classDef) + ".&lt;" + type.getTypeArguments$().map((function (type) {
						return $this._typeToHTML$LParser$LType$(parser, type);
					})).join(", ") + "&gt;";
				}
			}
		}
	} else {
		if (type instanceof FunctionType) {
			return "function " + "(" + type.getArgumentTypes$().map((function (type) {
				return ":" + $this._typeToHTML$LParser$LType$(parser, type);
			})).join(", ") + ") : " + this._typeToHTML$LParser$LType$(parser, type.getReturnType$());
		} else {
			if (type instanceof VariableLengthArgumentType) {
				return "..." + this._typeToHTML$LParser$LType$(parser, type.getBaseType$());
			}
		}
	}
	return this._escape$S(type.toString());
};

/**
 * @param {Parser} parser
 * @param {ClassDefinition} classDef
 * @return {!string}
 */
DocumentGenerator.prototype._classDefToHTML$LParser$LClassDefinition$ = function (parser, classDef) {
	var $this = this;
	/** @type {undefined|!string} */
	var result;
	/** @type {*} */
	var determineParserOfClassDef;
	/** @type {Parser} */
	var parserOfClassDef;
	/** @type {!string} */
	var _;
	if (classDef instanceof InstantiatedClassDefinition) {
		return this._classDefToHTML$LParser$LClassDefinition$(parser, classDef.getTemplateClass$()) + ".&lt;" + classDef.getTypeArguments$().map((function (type) {
			return $this._typeToHTML$LParser$LType$(parser, type);
		})).join(", ") + "&gt;";
	}
	result = this._classDefToHTMLCache.get$LClassDefinition$(classDef);
	if (result != null) {
		return result;
	}
	function determineParserOfClassDef() {
		/** @type {Array.<undefined|Parser>} */
		var parsers;
		/** @type {!number} */
		var i;
		/** @type {Array.<undefined|TemplateClassDefinition>} */
		var templateClassDefs;
		/** @type {!number} */
		var j;
		/** @type {Array.<undefined|ClassDefinition>} */
		var classDefs;
		parsers = $this._compiler.getParsers$();
		for (i = 0; i < parsers.length; ++ i) {
			if (classDef instanceof TemplateClassDefinition) {
				templateClassDefs = parsers[i].getTemplateClassDefs$();
				for (j = 0; j < templateClassDefs.length; ++ j) {
					templateClassDefs = templateClassDefs.concat(templateClassDefs[j].getTemplateInnerClasses$());
				}
				if (templateClassDefs.indexOf(classDef) !== - 1) {
					return parsers[i];
				}
			} else {
				classDefs = parsers[i].getClassDefs$();
				for (j = 0; j < classDefs.length; ++ j) {
					classDefs = classDefs.concat(classDefs[j].getInnerClasses$());
				}
				if (classDefs.indexOf(classDef) !== - 1) {
					return parsers[i];
				}
			}
		}
		throw new Error("could not determine the parser to which the class belongs:" + classDef.className$());
	};
	parserOfClassDef = determineParserOfClassDef();
	if (! this._pathFilter(parserOfClassDef.getPath$())) {
		return this._escape$S(classDef.className$());
	}
	_ = "";
	_ += "<a href=\"";
	_ += this._escape$S(parserOfClassDef.getPath$()).replace(/\n$/, "");
	_ += ".html#class-";
	_ += this._escape$S(classDef.className$()).replace(/\n$/, "");
	_ += "\">";
	_ += this._escape$S(classDef.className$()).replace(/\n$/, "");
	_ += "</a>\n";
	_ = _.trim();
	this._classDefToHTMLCache.set$LClassDefinition$S(classDef, _);
	return _;
};

/**
 * @param {!number} flags
 * @return {!string}
 */
DocumentGenerator.prototype._flagsToHTML$N = function (flags) {
	/** @type {Array.<undefined|!string>} */
	var strs;
	strs = [];
	if ((flags & ClassDefinition.IS_STATIC) !== 0) {
		strs.push("static");
	}
	if ((flags & ClassDefinition.IS_CONST) !== 0) {
		strs.push("const");
	}
	if ((flags & ClassDefinition.IS_ABSTRACT) !== 0) {
		strs.push("abstract");
	}
	if ((flags & ClassDefinition.IS_FINAL) !== 0) {
		strs.push("final");
	}
	if ((flags & ClassDefinition.IS_OVERRIDE) !== 0) {
		strs.push("override");
	}
	if ((flags & ClassDefinition.IS_INLINE) !== 0) {
		strs.push("inline");
	}
	return strs.join(" ");
};

/**
 * @param {!string} str
 * @return {!string}
 */
DocumentGenerator.prototype._escape$S = function (str) {
	var $this = this;
	return str.replace(/[<>&'"]/g, (function (ch) {
		return ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", "\"": "&quot;" })[ch];
	}));
};

/**
 * @param {ClassDefinition} classDef
 * @return {!boolean}
 */
DocumentGenerator.prototype._hasPublicProperties$LClassDefinition$ = function (classDef) {
	var $this = this;
	return ! classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
		if (! $this._isPrivate$LMemberDefinition$(varDef)) {
			return false;
		}
		return true;
	}));
};

/**
 * @param {ClassDefinition} classDef
 * @return {!boolean}
 */
DocumentGenerator.prototype._hasPublicFunctions$LClassDefinition$ = function (classDef) {
	var $this = this;
	return ! classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		if (funcDef instanceof InstantiatedMemberFunctionDefinition || $this._isConstructor$LMemberFunctionDefinition$(funcDef) || $this._isPrivate$LMemberDefinition$(funcDef)) {
			return true;
		}
		return false;
	}));
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
DocumentGenerator.prototype._argsHasDocComment$LMemberFunctionDefinition$ = function (funcDef) {
	/** @type {DocComment} */
	var docComment;
	/** @type {Array.<undefined|ArgumentDeclaration>} */
	var args;
	/** @type {!number} */
	var argIndex;
	docComment = funcDef.getDocComment$();
	if (docComment == null) {
		return false;
	}
	args = funcDef.getArguments$();
	for (argIndex = 0; argIndex < args.length; ++ argIndex) {
		if (this._getDescriptionOfNamedArgument$LDocComment$S(docComment, args[argIndex].getName$().getValue$()) !== "") {
			return true;
		}
	}
	return false;
};

/**
 * @param {DocComment} docComment
 * @param {!string} argName
 * @return {!string}
 */
DocumentGenerator.prototype._getDescriptionOfNamedArgument$LDocComment$S = function (docComment, argName) {
	/** @type {Array.<undefined|DocCommentParameter>} */
	var params;
	/** @type {!number} */
	var paramIndex;
	params = docComment.getParams$();
	for (paramIndex = 0; paramIndex < params.length; ++ paramIndex) {
		if (params[paramIndex].getParamName$() === argName) {
			return params[paramIndex].getDescription$();
		}
	}
	return "";
};

/**
 * @param {MemberFunctionDefinition} funcDef
 * @return {!boolean}
 */
DocumentGenerator.prototype._isConstructor$LMemberFunctionDefinition$ = function (funcDef) {
	return funcDef.name$() === "constructor" && (funcDef.flags$() & ClassDefinition.IS_STATIC) === 0;
};

/**
 * @param {MemberDefinition} memberDef
 * @return {!boolean}
 */
DocumentGenerator.prototype._isPrivate$LMemberDefinition$ = function (memberDef) {
	return memberDef.name$().charAt(0) === "_";
};

/**
 * class _LinkTimeOptimizationCommand$CStash extends OptimizerStash
 * @constructor
 */
function _LinkTimeOptimizationCommand$CStash() {
}

_LinkTimeOptimizationCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _LinkTimeOptimizationCommand$CStash$() {
	OptimizerStash$.call(this);
	this.extendedBy = [];
};

_LinkTimeOptimizationCommand$CStash$.prototype = new _LinkTimeOptimizationCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_LinkTimeOptimizationCommand$CStash.prototype.clone$ = function () {
	throw new Error("not supported");
};

/**
 * class _DetermineCalleeCommand$CStash extends OptimizerStash
 * @constructor
 */
function _DetermineCalleeCommand$CStash() {
}

_DetermineCalleeCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _DetermineCalleeCommand$CStash$() {
	OptimizerStash$.call(this);
	this.callingFuncDef = null;
};

_DetermineCalleeCommand$CStash$.prototype = new _DetermineCalleeCommand$CStash;

/**
 * @constructor
 * @param {_DetermineCalleeCommand$CStash} that
 */
function _DetermineCalleeCommand$CStash$L_DetermineCalleeCommand$CStash$(that) {
	OptimizerStash$.call(this);
	this.callingFuncDef = that.callingFuncDef;
};

_DetermineCalleeCommand$CStash$L_DetermineCalleeCommand$CStash$.prototype = new _DetermineCalleeCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_DetermineCalleeCommand$CStash.prototype.clone$ = function () {
	return new _DetermineCalleeCommand$CStash$L_DetermineCalleeCommand$CStash$(this);
};

/**
 * class _UnclassifyOptimizationCommand$CStash extends OptimizerStash
 * @constructor
 */
function _UnclassifyOptimizationCommand$CStash() {
}

_UnclassifyOptimizationCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _UnclassifyOptimizationCommand$CStash$() {
	OptimizerStash$.call(this);
	this.inliner = null;
};

_UnclassifyOptimizationCommand$CStash$.prototype = new _UnclassifyOptimizationCommand$CStash;

/**
 * @constructor
 * @param {_UnclassifyOptimizationCommand$CStash} that
 */
function _UnclassifyOptimizationCommand$CStash$L_UnclassifyOptimizationCommand$CStash$(that) {
	OptimizerStash$.call(this);
	this.inliner = that.inliner;
};

_UnclassifyOptimizationCommand$CStash$L_UnclassifyOptimizationCommand$CStash$.prototype = new _UnclassifyOptimizationCommand$CStash;

/**
 * @return {_UnclassifyOptimizationCommand$CStash}
 */
_UnclassifyOptimizationCommand$CStash.prototype.clone$ = function () {
	return new _UnclassifyOptimizationCommand$CStash$L_UnclassifyOptimizationCommand$CStash$(this);
};

/**
 * class _FoldConstantCommand$CStash extends OptimizerStash
 * @constructor
 */
function _FoldConstantCommand$CStash() {
}

_FoldConstantCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _FoldConstantCommand$CStash$() {
	OptimizerStash$.call(this);
	this.isOptimized = false;
};

_FoldConstantCommand$CStash$.prototype = new _FoldConstantCommand$CStash;

/**
 * @constructor
 * @param {_FoldConstantCommand$CStash} that
 */
function _FoldConstantCommand$CStash$L_FoldConstantCommand$CStash$(that) {
	OptimizerStash$.call(this);
	this.isOptimized = that.isOptimized;
};

_FoldConstantCommand$CStash$L_FoldConstantCommand$CStash$.prototype = new _FoldConstantCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_FoldConstantCommand$CStash.prototype.clone$ = function () {
	return new _FoldConstantCommand$CStash$L_FoldConstantCommand$CStash$(this);
};

/**
 * class _InlineOptimizeCommand$CStash extends OptimizerStash
 * @constructor
 */
function _InlineOptimizeCommand$CStash() {
}

_InlineOptimizeCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _InlineOptimizeCommand$CStash$() {
	OptimizerStash$.call(this);
	this.isOptimized = false;
	this.isInlineable = null;
};

_InlineOptimizeCommand$CStash$.prototype = new _InlineOptimizeCommand$CStash;

/**
 * @constructor
 * @param {_InlineOptimizeCommand$CStash} that
 */
function _InlineOptimizeCommand$CStash$L_InlineOptimizeCommand$CStash$(that) {
	OptimizerStash$.call(this);
	this.isOptimized = that.isOptimized;
	this.isInlineable = that.isInlineable;
};

_InlineOptimizeCommand$CStash$L_InlineOptimizeCommand$CStash$.prototype = new _InlineOptimizeCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_InlineOptimizeCommand$CStash.prototype.clone$ = function () {
	return new _InlineOptimizeCommand$CStash$L_InlineOptimizeCommand$CStash$(this);
};

/**
 * class _UnboxOptimizeCommand$CStash extends OptimizerStash
 * @constructor
 */
function _UnboxOptimizeCommand$CStash() {
}

_UnboxOptimizeCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _UnboxOptimizeCommand$CStash$() {
	OptimizerStash$.call(this);
	this.canUnbox = null;
};

_UnboxOptimizeCommand$CStash$.prototype = new _UnboxOptimizeCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_UnboxOptimizeCommand$CStash.prototype.clone$ = function () {
	/** @type {_UnboxOptimizeCommand$CStash} */
	var tmp;
	tmp = new _UnboxOptimizeCommand$CStash$();
	tmp.canUnbox = this.canUnbox;
	return tmp;
};

/**
 * class _NoDebugCommand$CStash extends OptimizerStash
 * @constructor
 */
function _NoDebugCommand$CStash() {
}

_NoDebugCommand$CStash.prototype = new OptimizerStash;
/**
 * @constructor
 */
function _NoDebugCommand$CStash$() {
	OptimizerStash$.call(this);
	this.debugValue = true;
};

_NoDebugCommand$CStash$.prototype = new _NoDebugCommand$CStash;

/**
 * @return {OptimizerStash}
 */
_NoDebugCommand$CStash.prototype.clone$ = function () {
	/** @type {_NoDebugCommand$CStash} */
	var tmp;
	tmp = new _NoDebugCommand$CStash$();
	tmp.debugValue = this.debugValue;
	return tmp;
};

$__jsx_lazy_init(CompilationServer, "AUTO_SHUTDOWN", function () {
	return ! process.env.JSX_NO_AUTO_SHUTDOWN;
});
$__jsx_lazy_init(CompilationServer, "LIFE", function () {
	return 10 * 60 * 1000;
});
js.global = (function () { return this; })();
$__jsx_lazy_init(node, "__dirname", function () {
	return eval("__dirname") + "";
});
$__jsx_lazy_init(node, "__filename", function () {
	return eval("__filename") + "";
});
$__jsx_lazy_init(node, "fs", function () {
	return node$require$S('fs');
});
$__jsx_lazy_init(node, "path", function () {
	return node$require$S('path');
});
$__jsx_lazy_init(node, "child_process", function () {
	return node$require$S('child_process');
});
$__jsx_lazy_init(node, "url", function () {
	return node$require$S('url');
});
$__jsx_lazy_init(node, "http", function () {
	return node$require$S('http');
});
$__jsx_lazy_init(node, "https", function () {
	return node$require$S('https');
});
$__jsx_lazy_init(node, "net", function () {
	return node$require$S('net');
});
$__jsx_lazy_init(Timer, "_requestAnimationFrame", function () {
	return Timer$_getRequestAnimationFrameImpl$B(true);
});
$__jsx_lazy_init(Timer, "_cancelAnimationFrame", function () {
	return Timer$_getCancelAnimationFrameImpl$B(true);
});
$__jsx_lazy_init(Util, "_stringLiteralEncodingMap", function () {
	return ({ "\0": "\\0", "\r": "\\r", "\n": "\\n", "\t": "\\t", "\"": "\\\"", "\'": "\\\'", "\\": "\\\\" });
});
$__jsx_lazy_init(_UnaryExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
$__jsx_lazy_init(_PostfixExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
_InstanceofExpressionEmitter._operatorPrecedence = 0;
_PropertyExpressionEmitter._operatorPrecedence = 0;
_FunctionExpressionEmitter._operatorPrecedence = 0;
_AdditiveExpressionEmitter._operatorPrecedence = 0;
$__jsx_lazy_init(_AssignmentExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
$__jsx_lazy_init(_EqualityExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
_InExpressionEmitter._operatorPrecedence = 0;
$__jsx_lazy_init(_LogicalExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
$__jsx_lazy_init(_ShiftExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
$__jsx_lazy_init(_BinaryNumberExpressionEmitter, "_operatorPrecedence", function () {
	return {};
});
_ArrayExpressionEmitter._operatorPrecedence = 0;
_ConditionalExpressionEmitter._operatorPrecedence = 0;
_CallExpressionEmitter._operatorPrecedence = 0;
_SuperExpressionEmitter._operatorPrecedence = 0;
_NewExpressionEmitter._operatorPrecedence = 0;
_CommaExpressionEmitter._operatorPrecedence = 0;
Meta.VERSION_STRING = "0.9.21";
Meta.VERSION_NUMBER = 0.009021;
Meta.LAST_COMMIT_HASH = "e0b98a35c5f6640b04c6d8b01861b091d19eeb2a";
Meta.LAST_COMMIT_DATE = "2013-04-03 11:07:15 +0900";
$__jsx_lazy_init(Meta, "IDENTIFIER", function () {
	return Meta.VERSION_STRING + " (" + Meta.LAST_COMMIT_DATE + "; " + Meta.LAST_COMMIT_HASH + ")";
});
$__jsx_lazy_init(LocalVariableStatuses, "UNTYPED_RECURSIVE_FUNCTION", function () {
	return - 1;
});
LocalVariableStatuses.UNSET = 0;
LocalVariableStatuses.ISSET = 1;
LocalVariableStatuses.MAYBESET = 2;
$__jsx_lazy_init(Type, "voidType", function () {
	return new VoidType$();
});
$__jsx_lazy_init(Type, "nullType", function () {
	return new NullType$();
});
$__jsx_lazy_init(Type, "booleanType", function () {
	return new BooleanType$();
});
$__jsx_lazy_init(Type, "integerType", function () {
	return new IntegerType$();
});
$__jsx_lazy_init(Type, "numberType", function () {
	return new NumberType$();
});
$__jsx_lazy_init(Type, "stringType", function () {
	return new StringType$();
});
$__jsx_lazy_init(Type, "variantType", function () {
	return new VariantType$();
});
BooleanType._classDef = null;
IntegerType._classDef = null;
NumberType._classDef = null;
StringType._classDef = null;
FunctionType._classDef = null;
_Lexer.ident = " [a-zA-Z_] [a-zA-Z0-9_]* ";
_Lexer.doubleQuoted = ' "  [^"\\\\]* (?: \\\\. [^"\\\\]* )* " ';
_Lexer.singleQuoted = " '  [^'\\\\]* (?: \\\\. [^'\\\\]* )* ' ";
$__jsx_lazy_init(_Lexer, "stringLiteral", function () {
	return _Lexer$makeAlt$AS([ _Lexer.singleQuoted, _Lexer.doubleQuoted ]);
});
$__jsx_lazy_init(_Lexer, "regexpLiteral", function () {
	return _Lexer.doubleQuoted.replace(/"/g, "/") + "[mgi]*";
});
_Lexer.decimalIntegerLiteral = "(?: 0 | [1-9][0-9]* )";
_Lexer.exponentPart = "(?: [eE] [+-]? [0-9]+ )";
$__jsx_lazy_init(_Lexer, "numberLiteral", function () {
	return _Lexer$makeAlt$AS([ "(?: " + _Lexer.decimalIntegerLiteral + " \\. " + "[0-9]* " + _Lexer.exponentPart + "? )", "(?: \\. [0-9]+ " + _Lexer.exponentPart + "? )", "(?: " + _Lexer.decimalIntegerLiteral + _Lexer.exponentPart + " )", "NaN", "Infinity" ]) + "\\b";
});
$__jsx_lazy_init(_Lexer, "integerLiteral", function () {
	return _Lexer$makeAlt$AS([ "(?: 0 [xX] [0-9a-fA-F]+ )", _Lexer.decimalIntegerLiteral ]) + "(?![\\.0-9eE])\\b";
});
$__jsx_lazy_init(_Lexer, "rxIdent", function () {
	return _Lexer$rx$S("^" + _Lexer.ident);
});
$__jsx_lazy_init(_Lexer, "rxStringLiteral", function () {
	return _Lexer$rx$S("^" + _Lexer.stringLiteral);
});
$__jsx_lazy_init(_Lexer, "rxNumberLiteral", function () {
	return _Lexer$rx$S("^" + _Lexer.numberLiteral);
});
$__jsx_lazy_init(_Lexer, "rxIntegerLiteral", function () {
	return _Lexer$rx$S("^" + _Lexer.integerLiteral);
});
$__jsx_lazy_init(_Lexer, "rxRegExpLiteral", function () {
	return _Lexer$rx$S("^" + _Lexer.regexpLiteral);
});
_Lexer.rxNewline = /(?:\r\n?|\n)/;
$__jsx_lazy_init(_Lexer, "keywords", function () {
	return _Lexer$asMap$AS([ "null", "true", "false", "NaN", "Infinity", "break", "do", "instanceof", "typeof", "case", "else", "new", "var", "catch", "finally", "return", "void", "for", "switch", "while", "function", "this", "if", "throw", "in", "try", "class", "extends", "super", "import", "implements", "static", "__FILE__", "__LINE__", "undefined" ]);
});
$__jsx_lazy_init(_Lexer, "reserved", function () {
	return _Lexer$asMap$AS([ "debugger", "with", "const", "export", "let", "private", "public", "yield", "protected", "extern", "native", "as", "operator" ]);
});
MemberVariableDefinition.NOT_ANALYZED = 0;
MemberVariableDefinition.IS_ANALYZING = 1;
MemberVariableDefinition.ANALYZE_SUCEEDED = 2;
MemberVariableDefinition.ANALYZE_FAILED = 3;
ClassDefinition.IS_CONST = 1;
ClassDefinition.IS_ABSTRACT = 2;
ClassDefinition.IS_FINAL = 4;
ClassDefinition.IS_STATIC = 8;
ClassDefinition.IS_NATIVE = 16;
ClassDefinition.IS_OVERRIDE = 32;
ClassDefinition.IS_INTERFACE = 64;
ClassDefinition.IS_MIXIN = 128;
ClassDefinition.IS_FAKE = 256;
ClassDefinition.IS_READONLY = 512;
ClassDefinition.IS_INLINE = 1024;
ClassDefinition.IS_PURE = 2048;
ClassDefinition.IS_DELETE = 4096;
ClassDefinition.GET_MEMBER_MODE_ALL = 0;
ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY = 1;
ClassDefinition.GET_MEMBER_MODE_SUPER = 2;
ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY = 3;
ClassDefinition.GET_MEMBER_MODE_NOT_ABSTRACT = 4;
JavaScriptEmitter._initialized = false;
_LinkTimeOptimizationCommand.IDENTIFIER = "lto";
_NoAssertCommand.IDENTIFIER = "no-assert";
_NoLogCommand.IDENTIFIER = "no-log";
_DetermineCalleeCommand.IDENTIFIER = "determine-callee";
_StaticizeOptimizeCommand.IDENTIFIER = "staticize";
_UnclassifyOptimizationCommand.IDENTIFIER = "unclassify";
_FoldConstantCommand.IDENTIFIER = "fold-const";
_DeadCodeEliminationOptimizeCommand.IDENTIFIER = "dce";
_InlineOptimizeCommand.IDENTIFIER = "inline";
_InlineOptimizeCommand.INLINE_THRESHOLD = 30;
_ReturnIfOptimizeCommand.IDENTIFIER = "return-if";
_LCSEOptimizeCommand.IDENTIFIER = "lcse";
_UnboxOptimizeCommand.IDENTIFIER = "unbox";
_ArrayLengthOptimizeCommand.IDENTIFIER = "array-length";
_NoDebugCommand.IDENTIFIER = "no-debug";
Compiler.MODE_COMPILE = 0;
Compiler.MODE_PARSE = 1;
Compiler.MODE_COMPLETE = 2;
Compiler.MODE_DOC = 3;
var $__jsx_classMap = {
	"src/jsx-node-front.jsx": {
		CompilationServer: CompilationServer,
		CompilationServer$LPlatform$: CompilationServer$LPlatform$,
		_Main: _Main,
		_Main$: _Main$,
		NodePlatform: NodePlatform,
		NodePlatform$: NodePlatform$,
		NodePlatform$S: NodePlatform$S,
		CompilationServerPlatform: CompilationServerPlatform,
		CompilationServerPlatform$SNLServerRequest$LServerResponse$: CompilationServerPlatform$SNLServerRequest$LServerResponse$
	},
	"system:lib/js/js.jsx": {
		js: js,
		js$: js$
	},
	"system:lib/js/js/nodejs.jsx": {
		node: node,
		node$: node$
	},
	"system:lib/js/timer.jsx": {
		Timer: Timer,
		Timer$: Timer$,
		TimerHandle: TimerHandle,
		TimerHandle$: TimerHandle$
	},
	"src/util.jsx": {
		Util: Util,
		Util$: Util$,
		TemplateInstantiationRequest: TemplateInstantiationRequest,
		TemplateInstantiationRequest$LToken$SALType$: TemplateInstantiationRequest$LToken$SALType$,
		CompileIssue: CompileIssue,
		CompileIssue$LToken$S: CompileIssue$LToken$S,
		CompileIssue$SNNS: CompileIssue$SNNS,
		CompileError: CompileError,
		CompileError$LToken$S: CompileError$LToken$S,
		CompileError$SNNS: CompileError$SNNS,
		CompileWarning: CompileWarning,
		CompileWarning$LToken$S: CompileWarning$LToken$S,
		CompileWarning$SNNS: CompileWarning$SNNS,
		DeprecatedWarning: DeprecatedWarning,
		DeprecatedWarning$LToken$S: DeprecatedWarning$LToken$S,
		DeprecatedWarning$SNNS: DeprecatedWarning$SNNS,
		CompileNote: CompileNote,
		CompileNote$LToken$S: CompileNote$LToken$S,
		CompileNote$SNNS: CompileNote$SNNS
	},
	"src/jsemitter.jsx": {
		_TypeAnnotation: _TypeAnnotation,
		_TypeAnnotation$: _TypeAnnotation$,
		_StatementEmitter: _StatementEmitter,
		_StatementEmitter$LJavaScriptEmitter$: _StatementEmitter$LJavaScriptEmitter$,
		_ConstructorInvocationStatementEmitter: _ConstructorInvocationStatementEmitter,
		_ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$: _ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$,
		_ExpressionStatementEmitter: _ExpressionStatementEmitter,
		_ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$: _ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$,
		_ReturnStatementEmitter: _ReturnStatementEmitter,
		_ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$: _ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$,
		_DeleteStatementEmitter: _DeleteStatementEmitter,
		_DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$: _DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$,
		_BreakStatementEmitter: _BreakStatementEmitter,
		_BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$: _BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$,
		_ContinueStatementEmitter: _ContinueStatementEmitter,
		_ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$: _ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$,
		_DoWhileStatementEmitter: _DoWhileStatementEmitter,
		_DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$: _DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$,
		_ForInStatementEmitter: _ForInStatementEmitter,
		_ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$: _ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$,
		_ForStatementEmitter: _ForStatementEmitter,
		_ForStatementEmitter$LJavaScriptEmitter$LForStatement$: _ForStatementEmitter$LJavaScriptEmitter$LForStatement$,
		_IfStatementEmitter: _IfStatementEmitter,
		_IfStatementEmitter$LJavaScriptEmitter$LIfStatement$: _IfStatementEmitter$LJavaScriptEmitter$LIfStatement$,
		_SwitchStatementEmitter: _SwitchStatementEmitter,
		_SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$: _SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$,
		_CaseStatementEmitter: _CaseStatementEmitter,
		_CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$: _CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$,
		_DefaultStatementEmitter: _DefaultStatementEmitter,
		_DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$: _DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$,
		_WhileStatementEmitter: _WhileStatementEmitter,
		_WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$: _WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$,
		_TryStatementEmitter: _TryStatementEmitter,
		_TryStatementEmitter$LJavaScriptEmitter$LTryStatement$: _TryStatementEmitter$LJavaScriptEmitter$LTryStatement$,
		_CatchStatementEmitter: _CatchStatementEmitter,
		_CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$: _CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$,
		_ThrowStatementEmitter: _ThrowStatementEmitter,
		_ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$: _ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$,
		_AssertStatementEmitter: _AssertStatementEmitter,
		_AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$: _AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$,
		_LogStatementEmitter: _LogStatementEmitter,
		_LogStatementEmitter$LJavaScriptEmitter$LLogStatement$: _LogStatementEmitter$LJavaScriptEmitter$LLogStatement$,
		_DebuggerStatementEmitter: _DebuggerStatementEmitter,
		_DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$: _DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$,
		_ExpressionEmitter: _ExpressionEmitter,
		_ExpressionEmitter$LJavaScriptEmitter$: _ExpressionEmitter$LJavaScriptEmitter$,
		_LocalExpressionEmitter: _LocalExpressionEmitter,
		_LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$: _LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$,
		_ClassExpressionEmitter: _ClassExpressionEmitter,
		_ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$: _ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$,
		_NullExpressionEmitter: _NullExpressionEmitter,
		_NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$: _NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$,
		_BooleanLiteralExpressionEmitter: _BooleanLiteralExpressionEmitter,
		_BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$: _BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$,
		_IntegerLiteralExpressionEmitter: _IntegerLiteralExpressionEmitter,
		_IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$: _IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$,
		_NumberLiteralExpressionEmitter: _NumberLiteralExpressionEmitter,
		_NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$: _NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$,
		_StringLiteralExpressionEmitter: _StringLiteralExpressionEmitter,
		_StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$: _StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$,
		_RegExpLiteralExpressionEmitter: _RegExpLiteralExpressionEmitter,
		_RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$: _RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$,
		_ArrayLiteralExpressionEmitter: _ArrayLiteralExpressionEmitter,
		_ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$: _ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$,
		_MapLiteralExpressionEmitter: _MapLiteralExpressionEmitter,
		_MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$: _MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$,
		_ThisExpressionEmitter: _ThisExpressionEmitter,
		_ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$: _ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$,
		_AsExpressionEmitter: _AsExpressionEmitter,
		_AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$: _AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$,
		_AsNoConvertExpressionEmitter: _AsNoConvertExpressionEmitter,
		_AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$: _AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$,
		_OperatorExpressionEmitter: _OperatorExpressionEmitter,
		_OperatorExpressionEmitter$LJavaScriptEmitter$: _OperatorExpressionEmitter$LJavaScriptEmitter$,
		_UnaryExpressionEmitter: _UnaryExpressionEmitter,
		_UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$: _UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$,
		_PostfixExpressionEmitter: _PostfixExpressionEmitter,
		_PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$: _PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$,
		_InstanceofExpressionEmitter: _InstanceofExpressionEmitter,
		_InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$: _InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$,
		_PropertyExpressionEmitter: _PropertyExpressionEmitter,
		_PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$: _PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$,
		_FunctionExpressionEmitter: _FunctionExpressionEmitter,
		_FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$: _FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$,
		_AdditiveExpressionEmitter: _AdditiveExpressionEmitter,
		_AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$: _AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$,
		_AssignmentExpressionEmitter: _AssignmentExpressionEmitter,
		_AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$: _AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$,
		_EqualityExpressionEmitter: _EqualityExpressionEmitter,
		_EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$: _EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$,
		_InExpressionEmitter: _InExpressionEmitter,
		_InExpressionEmitter$LJavaScriptEmitter$LInExpression$: _InExpressionEmitter$LJavaScriptEmitter$LInExpression$,
		_LogicalExpressionEmitter: _LogicalExpressionEmitter,
		_LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$: _LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$,
		_ShiftExpressionEmitter: _ShiftExpressionEmitter,
		_ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$: _ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$,
		_BinaryNumberExpressionEmitter: _BinaryNumberExpressionEmitter,
		_BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$: _BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$,
		_ArrayExpressionEmitter: _ArrayExpressionEmitter,
		_ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$: _ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$,
		_ConditionalExpressionEmitter: _ConditionalExpressionEmitter,
		_ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$: _ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$,
		_CallExpressionEmitter: _CallExpressionEmitter,
		_CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$: _CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$,
		_SuperExpressionEmitter: _SuperExpressionEmitter,
		_SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$: _SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$,
		_NewExpressionEmitter: _NewExpressionEmitter,
		_NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$: _NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$,
		_CommaExpressionEmitter: _CommaExpressionEmitter,
		_CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$: _CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$,
		_JSEmitterStash: _JSEmitterStash,
		_JSEmitterStash$: _JSEmitterStash$,
		JavaScriptEmitter: JavaScriptEmitter,
		JavaScriptEmitter$LPlatform$: JavaScriptEmitter$LPlatform$
	},
	"src/platform.jsx": {
		Platform: Platform,
		Platform$: Platform$
	},
	"src/jsx-command.jsx": {
		JSXCommand: JSXCommand,
		JSXCommand$: JSXCommand$
	},
	"src/meta.jsx": {
		Meta: Meta,
		Meta$: Meta$
	},
	"src/expression.jsx": {
		MapLiteralElement: MapLiteralElement,
		MapLiteralElement$LToken$LExpression$: MapLiteralElement$LToken$LExpression$,
		Expression: Expression,
		Expression$LToken$: Expression$LToken$,
		Expression$LExpression$: Expression$LExpression$,
		CommaExpression: CommaExpression,
		CommaExpression$LToken$LExpression$LExpression$: CommaExpression$LToken$LExpression$LExpression$,
		FunctionExpression: FunctionExpression,
		FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B: FunctionExpression$LToken$LLocalVariable$LMemberFunctionDefinition$B,
		ThisExpression: ThisExpression,
		ThisExpression$LToken$LClassDefinition$: ThisExpression$LToken$LClassDefinition$,
		MapLiteralExpression: MapLiteralExpression,
		MapLiteralExpression$LToken$ALMapLiteralElement$LType$: MapLiteralExpression$LToken$ALMapLiteralElement$LType$,
		ArrayLiteralExpression: ArrayLiteralExpression,
		ArrayLiteralExpression$LToken$ALExpression$LType$: ArrayLiteralExpression$LToken$ALExpression$LType$,
		OperatorExpression: OperatorExpression,
		OperatorExpression$LToken$: OperatorExpression$LToken$,
		OperatorExpression$LExpression$: OperatorExpression$LExpression$,
		NewExpression: NewExpression,
		NewExpression$LToken$LType$ALExpression$: NewExpression$LToken$LType$ALExpression$,
		NewExpression$LNewExpression$: NewExpression$LNewExpression$,
		SuperExpression: SuperExpression,
		SuperExpression$LToken$LToken$ALExpression$: SuperExpression$LToken$LToken$ALExpression$,
		SuperExpression$LSuperExpression$: SuperExpression$LSuperExpression$,
		CallExpression: CallExpression,
		CallExpression$LToken$LExpression$ALExpression$: CallExpression$LToken$LExpression$ALExpression$,
		CallExpression$LCallExpression$: CallExpression$LCallExpression$,
		ConditionalExpression: ConditionalExpression,
		ConditionalExpression$LToken$LExpression$LExpression$LExpression$: ConditionalExpression$LToken$LExpression$LExpression$LExpression$,
		ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$: ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$,
		BinaryExpression: BinaryExpression,
		BinaryExpression$LToken$LExpression$LExpression$: BinaryExpression$LToken$LExpression$LExpression$,
		ShiftExpression: ShiftExpression,
		ShiftExpression$LToken$LExpression$LExpression$: ShiftExpression$LToken$LExpression$LExpression$,
		LogicalExpression: LogicalExpression,
		LogicalExpression$LToken$LExpression$LExpression$: LogicalExpression$LToken$LExpression$LExpression$,
		InExpression: InExpression,
		InExpression$LToken$LExpression$LExpression$: InExpression$LToken$LExpression$LExpression$,
		EqualityExpression: EqualityExpression,
		EqualityExpression$LToken$LExpression$LExpression$: EqualityExpression$LToken$LExpression$LExpression$,
		BinaryNumberExpression: BinaryNumberExpression,
		BinaryNumberExpression$LToken$LExpression$LExpression$: BinaryNumberExpression$LToken$LExpression$LExpression$,
		AssignmentExpression: AssignmentExpression,
		AssignmentExpression$LToken$LExpression$LExpression$: AssignmentExpression$LToken$LExpression$LExpression$,
		ArrayExpression: ArrayExpression,
		ArrayExpression$LToken$LExpression$LExpression$: ArrayExpression$LToken$LExpression$LExpression$,
		AdditiveExpression: AdditiveExpression,
		AdditiveExpression$LToken$LExpression$LExpression$: AdditiveExpression$LToken$LExpression$LExpression$,
		UnaryExpression: UnaryExpression,
		UnaryExpression$LToken$LExpression$: UnaryExpression$LToken$LExpression$,
		SignExpression: SignExpression,
		SignExpression$LToken$LExpression$: SignExpression$LToken$LExpression$,
		TypeofExpression: TypeofExpression,
		TypeofExpression$LToken$LExpression$: TypeofExpression$LToken$LExpression$,
		PropertyExpression: PropertyExpression,
		PropertyExpression$LToken$LExpression$LToken$ALType$: PropertyExpression$LToken$LExpression$LToken$ALType$,
		PropertyExpression$LToken$LExpression$LToken$ALType$LType$: PropertyExpression$LToken$LExpression$LToken$ALType$LType$,
		IncrementExpression: IncrementExpression,
		IncrementExpression$LToken$LExpression$: IncrementExpression$LToken$LExpression$,
		PreIncrementExpression: PreIncrementExpression,
		PreIncrementExpression$LToken$LExpression$: PreIncrementExpression$LToken$LExpression$,
		PostIncrementExpression: PostIncrementExpression,
		PostIncrementExpression$LToken$LExpression$: PostIncrementExpression$LToken$LExpression$,
		LogicalNotExpression: LogicalNotExpression,
		LogicalNotExpression$LToken$LExpression$: LogicalNotExpression$LToken$LExpression$,
		AsNoConvertExpression: AsNoConvertExpression,
		AsNoConvertExpression$LToken$LExpression$LType$: AsNoConvertExpression$LToken$LExpression$LType$,
		AsExpression: AsExpression,
		AsExpression$LToken$LExpression$LType$: AsExpression$LToken$LExpression$LType$,
		InstanceofExpression: InstanceofExpression,
		InstanceofExpression$LToken$LExpression$LType$: InstanceofExpression$LToken$LExpression$LType$,
		BitwiseNotExpression: BitwiseNotExpression,
		BitwiseNotExpression$LToken$LExpression$: BitwiseNotExpression$LToken$LExpression$,
		LeafExpression: LeafExpression,
		LeafExpression$LToken$: LeafExpression$LToken$,
		RegExpLiteralExpression: RegExpLiteralExpression,
		RegExpLiteralExpression$LToken$: RegExpLiteralExpression$LToken$,
		RegExpLiteralExpression$LToken$LType$: RegExpLiteralExpression$LToken$LType$,
		StringLiteralExpression: StringLiteralExpression,
		StringLiteralExpression$LToken$: StringLiteralExpression$LToken$,
		NumberLiteralExpression: NumberLiteralExpression,
		NumberLiteralExpression$LToken$: NumberLiteralExpression$LToken$,
		IntegerLiteralExpression: IntegerLiteralExpression,
		IntegerLiteralExpression$LToken$: IntegerLiteralExpression$LToken$,
		BooleanLiteralExpression: BooleanLiteralExpression,
		BooleanLiteralExpression$LToken$: BooleanLiteralExpression$LToken$,
		NullExpression: NullExpression,
		NullExpression$LToken$LType$: NullExpression$LToken$LType$,
		ClassExpression: ClassExpression,
		ClassExpression$LToken$LType$: ClassExpression$LToken$LType$,
		LocalExpression: LocalExpression,
		LocalExpression$LToken$LLocalVariable$: LocalExpression$LToken$LLocalVariable$
	},
	"src/classdef.jsx": {
		InstantiationContext: InstantiationContext,
		InstantiationContext$ALCompileError$HLType$: InstantiationContext$ALCompileError$HLType$,
		TemplateDefinition: TemplateDefinition,
		TemplateDefinition$: TemplateDefinition$,
		Block: Block,
		Block$: Block$,
		BlockContext: BlockContext,
		BlockContext$LLocalVariableStatuses$LBlock$: BlockContext$LLocalVariableStatuses$LBlock$,
		AnalysisContext: AnalysisContext,
		AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$: AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$,
		LocalVariable: LocalVariable,
		LocalVariable$LToken$LType$: LocalVariable$LToken$LType$,
		CaughtVariable: CaughtVariable,
		CaughtVariable$LToken$LType$: CaughtVariable$LToken$LType$,
		ArgumentDeclaration: ArgumentDeclaration,
		ArgumentDeclaration$LToken$LType$: ArgumentDeclaration$LToken$LType$,
		LocalVariableStatuses: LocalVariableStatuses,
		LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$: LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$,
		LocalVariableStatuses$LLocalVariableStatuses$: LocalVariableStatuses$LLocalVariableStatuses$,
		MemberDefinition: MemberDefinition,
		MemberDefinition$LToken$LToken$NLDocComment$: MemberDefinition$LToken$LToken$NLDocComment$,
		MemberFunctionDefinition: MemberFunctionDefinition,
		MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$,
		TemplateFunctionDefinition: TemplateFunctionDefinition,
		TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$,
		InstantiatedMemberFunctionDefinition: InstantiatedMemberFunctionDefinition,
		InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$,
		MemberVariableDefinition: MemberVariableDefinition,
		MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$: MemberVariableDefinition$LToken$LToken$NLType$LExpression$LDocComment$,
		ClassDefinition: ClassDefinition,
		ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$: ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$,
		InstantiatedClassDefinition: InstantiatedClassDefinition,
		InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$: InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$,
		TemplateClassDefinition: TemplateClassDefinition,
		TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$: TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$
	},
	"src/type.jsx": {
		Type: Type,
		Type$: Type$,
		VoidType: VoidType,
		VoidType$: VoidType$,
		NullType: NullType,
		NullType$: NullType$,
		PrimitiveType: PrimitiveType,
		PrimitiveType$: PrimitiveType$,
		BooleanType: BooleanType,
		BooleanType$: BooleanType$,
		IntegerType: IntegerType,
		IntegerType$: IntegerType$,
		NumberType: NumberType,
		NumberType$: NumberType$,
		StringType: StringType,
		StringType$: StringType$,
		VariantType: VariantType,
		VariantType$: VariantType$,
		NullableType: NullableType,
		NullableType$LType$: NullableType$LType$,
		VariableLengthArgumentType: VariableLengthArgumentType,
		VariableLengthArgumentType$LType$: VariableLengthArgumentType$LType$,
		ObjectType: ObjectType,
		ObjectType$LClassDefinition$: ObjectType$LClassDefinition$,
		ParsedObjectType: ParsedObjectType,
		ParsedObjectType$LQualifiedName$ALType$: ParsedObjectType$LQualifiedName$ALType$,
		FunctionType: FunctionType,
		FunctionType$: FunctionType$,
		FunctionChoiceType: FunctionChoiceType,
		FunctionChoiceType$ALResolvedFunctionType$: FunctionChoiceType$ALResolvedFunctionType$,
		ResolvedFunctionType: ResolvedFunctionType,
		ResolvedFunctionType$LToken$LType$ALType$B: ResolvedFunctionType$LToken$LType$ALType$B,
		StaticFunctionType: StaticFunctionType,
		StaticFunctionType$LToken$LType$ALType$B: StaticFunctionType$LToken$LType$ALType$B,
		MemberFunctionType: MemberFunctionType,
		MemberFunctionType$LToken$LType$LType$ALType$B: MemberFunctionType$LToken$LType$LType$ALType$B
	},
	"src/parser.jsx": {
		Token: Token,
		Token$SB: Token$SB,
		Token$SBUSNN: Token$SBUSNN,
		_Lexer: _Lexer,
		_Lexer$: _Lexer$,
		Import: Import,
		Import$LParser$: Import$LParser$,
		Import$LToken$LToken$ALToken$: Import$LToken$LToken$ALToken$,
		WildcardImport: WildcardImport,
		WildcardImport$LToken$LToken$ALToken$SS: WildcardImport$LToken$LToken$ALToken$SS,
		QualifiedName: QualifiedName,
		QualifiedName$LToken$: QualifiedName$LToken$,
		QualifiedName$LToken$LImport$: QualifiedName$LToken$LImport$,
		QualifiedName$LToken$LParsedObjectType$: QualifiedName$LToken$LParsedObjectType$,
		ParserState: ParserState,
		ParserState$NNLDocComment$NNNNN: ParserState$NNLDocComment$NNNNN,
		ClassState: ClassState,
		ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$: ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$,
		Scope: Scope,
		Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$: Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$,
		Parser: Parser,
		Parser$LToken$SLCompletionRequest$: Parser$LToken$SLCompletionRequest$
	},
	"src/optimizer.jsx": {
		OptimizerStash: OptimizerStash,
		OptimizerStash$: OptimizerStash$,
		Stashable: Stashable,
		Stashable$: Stashable$,
		_Util: _Util,
		_Util$: _Util$,
		Optimizer: Optimizer,
		Optimizer$: Optimizer$,
		_OptimizeCommand: _OptimizeCommand,
		_OptimizeCommand$S: _OptimizeCommand$S,
		_FunctionOptimizeCommand: _FunctionOptimizeCommand,
		_FunctionOptimizeCommand$S: _FunctionOptimizeCommand$S,
		_LinkTimeOptimizationCommand: _LinkTimeOptimizationCommand,
		_LinkTimeOptimizationCommand$: _LinkTimeOptimizationCommand$,
		_NoAssertCommand: _NoAssertCommand,
		_NoAssertCommand$: _NoAssertCommand$,
		_NoLogCommand: _NoLogCommand,
		_NoLogCommand$: _NoLogCommand$,
		_DetermineCalleeCommand: _DetermineCalleeCommand,
		_DetermineCalleeCommand$: _DetermineCalleeCommand$,
		_StaticizeOptimizeCommand: _StaticizeOptimizeCommand,
		_StaticizeOptimizeCommand$: _StaticizeOptimizeCommand$,
		_UnclassifyOptimizationCommand: _UnclassifyOptimizationCommand,
		_UnclassifyOptimizationCommand$: _UnclassifyOptimizationCommand$,
		_FoldConstantCommand: _FoldConstantCommand,
		_FoldConstantCommand$: _FoldConstantCommand$,
		_DeadCodeEliminationOptimizeCommand: _DeadCodeEliminationOptimizeCommand,
		_DeadCodeEliminationOptimizeCommand$: _DeadCodeEliminationOptimizeCommand$,
		_InlineOptimizeCommand: _InlineOptimizeCommand,
		_InlineOptimizeCommand$: _InlineOptimizeCommand$,
		_ReturnIfOptimizeCommand: _ReturnIfOptimizeCommand,
		_ReturnIfOptimizeCommand$: _ReturnIfOptimizeCommand$,
		_LCSECachedExpression: _LCSECachedExpression,
		_LCSECachedExpression$LExpression$F$LExpression$V$: _LCSECachedExpression$LExpression$F$LExpression$V$,
		_LCSEOptimizeCommand: _LCSEOptimizeCommand,
		_LCSEOptimizeCommand$: _LCSEOptimizeCommand$,
		_UnboxOptimizeCommand: _UnboxOptimizeCommand,
		_UnboxOptimizeCommand$: _UnboxOptimizeCommand$,
		_ArrayLengthOptimizeCommand: _ArrayLengthOptimizeCommand,
		_ArrayLengthOptimizeCommand$: _ArrayLengthOptimizeCommand$,
		_NoDebugCommand: _NoDebugCommand,
		_NoDebugCommand$: _NoDebugCommand$,
		Stash: _LinkTimeOptimizationCommand$CStash,
		Stash$: _LinkTimeOptimizationCommand$CStash$,
		Stash: _DetermineCalleeCommand$CStash,
		Stash$: _DetermineCalleeCommand$CStash$,
		Stash$L_DetermineCalleeCommand$CStash$: _DetermineCalleeCommand$CStash$L_DetermineCalleeCommand$CStash$,
		Stash: _UnclassifyOptimizationCommand$CStash,
		Stash$: _UnclassifyOptimizationCommand$CStash$,
		Stash$L_UnclassifyOptimizationCommand$CStash$: _UnclassifyOptimizationCommand$CStash$L_UnclassifyOptimizationCommand$CStash$,
		Stash: _FoldConstantCommand$CStash,
		Stash$: _FoldConstantCommand$CStash$,
		Stash$L_FoldConstantCommand$CStash$: _FoldConstantCommand$CStash$L_FoldConstantCommand$CStash$,
		Stash: _InlineOptimizeCommand$CStash,
		Stash$: _InlineOptimizeCommand$CStash$,
		Stash$L_InlineOptimizeCommand$CStash$: _InlineOptimizeCommand$CStash$L_InlineOptimizeCommand$CStash$,
		Stash: _UnboxOptimizeCommand$CStash,
		Stash$: _UnboxOptimizeCommand$CStash$,
		Stash: _NoDebugCommand$CStash,
		Stash$: _NoDebugCommand$CStash$
	},
	"src/statement.jsx": {
		Statement: Statement,
		Statement$: Statement$,
		InformationStatement: InformationStatement,
		InformationStatement$LToken$: InformationStatement$LToken$,
		DebuggerStatement: DebuggerStatement,
		DebuggerStatement$LToken$: DebuggerStatement$LToken$,
		LogStatement: LogStatement,
		LogStatement$LToken$ALExpression$: LogStatement$LToken$ALExpression$,
		AssertStatement: AssertStatement,
		AssertStatement$LToken$LExpression$: AssertStatement$LToken$LExpression$,
		ThrowStatement: ThrowStatement,
		ThrowStatement$LToken$LExpression$: ThrowStatement$LToken$LExpression$,
		CatchStatement: CatchStatement,
		CatchStatement$LToken$LCaughtVariable$ALStatement$: CatchStatement$LToken$LCaughtVariable$ALStatement$,
		TryStatement: TryStatement,
		TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$: TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$,
		DefaultStatement: DefaultStatement,
		DefaultStatement$LToken$: DefaultStatement$LToken$,
		CaseStatement: CaseStatement,
		CaseStatement$LToken$LExpression$: CaseStatement$LToken$LExpression$,
		IfStatement: IfStatement,
		IfStatement$LToken$LExpression$ALStatement$ALStatement$: IfStatement$LToken$LExpression$ALStatement$ALStatement$,
		LabellableStatement: LabellableStatement,
		LabellableStatement$LToken$LToken$: LabellableStatement$LToken$LToken$,
		SwitchStatement: SwitchStatement,
		SwitchStatement$LToken$LToken$LExpression$ALStatement$: SwitchStatement$LToken$LToken$LExpression$ALStatement$,
		ContinuableStatement: ContinuableStatement,
		ContinuableStatement$LToken$LToken$ALStatement$: ContinuableStatement$LToken$LToken$ALStatement$,
		WhileStatement: WhileStatement,
		WhileStatement$LToken$LToken$LExpression$ALStatement$: WhileStatement$LToken$LToken$LExpression$ALStatement$,
		ForStatement: ForStatement,
		ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$: ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$,
		ForInStatement: ForInStatement,
		ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$: ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$,
		DoWhileStatement: DoWhileStatement,
		DoWhileStatement$LToken$LToken$LExpression$ALStatement$: DoWhileStatement$LToken$LToken$LExpression$ALStatement$,
		JumpStatement: JumpStatement,
		JumpStatement$LToken$LToken$: JumpStatement$LToken$LToken$,
		ContinueStatement: ContinueStatement,
		ContinueStatement$LToken$LToken$: ContinueStatement$LToken$LToken$,
		BreakStatement: BreakStatement,
		BreakStatement$LToken$LToken$: BreakStatement$LToken$LToken$,
		ReturnStatement: ReturnStatement,
		ReturnStatement$LToken$LExpression$: ReturnStatement$LToken$LExpression$,
		UnaryExpressionStatement: UnaryExpressionStatement,
		UnaryExpressionStatement$LExpression$: UnaryExpressionStatement$LExpression$,
		DeleteStatement: DeleteStatement,
		DeleteStatement$LToken$LExpression$: DeleteStatement$LToken$LExpression$,
		ExpressionStatement: ExpressionStatement,
		ExpressionStatement$LExpression$: ExpressionStatement$LExpression$,
		ConstructorInvocationStatement: ConstructorInvocationStatement,
		ConstructorInvocationStatement$LToken$LType$ALExpression$: ConstructorInvocationStatement$LToken$LType$ALExpression$,
		ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$: ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$
	},
	"src/emitter.jsx": {
		Emitter: Emitter,
		Emitter$: Emitter$
	},
	"src/jssourcemap.jsx": {
		SourceMapper: SourceMapper,
		SourceMapper$SS: SourceMapper$SS
	},
	"src/compiler.jsx": {
		Compiler: Compiler,
		Compiler$LPlatform$: Compiler$LPlatform$
	},
	"src/completion.jsx": {
		CompletionRequest: CompletionRequest,
		CompletionRequest$NN: CompletionRequest$NN,
		CompletionCandidates: CompletionCandidates,
		CompletionCandidates$: CompletionCandidates$,
		KeywordCompletionCandidate: KeywordCompletionCandidate,
		KeywordCompletionCandidate$S: KeywordCompletionCandidate$S,
		CompletionCandidatesOfTopLevel: CompletionCandidatesOfTopLevel,
		CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$: CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$,
		_CompletionCandidatesWithLocal: _CompletionCandidatesWithLocal,
		_CompletionCandidatesWithLocal$LParser$: _CompletionCandidatesWithLocal$LParser$,
		_CompletionCandidatesOfNamespace: _CompletionCandidatesOfNamespace,
		_CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$: _CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$,
		_CompletionCandidatesOfProperty: _CompletionCandidatesOfProperty,
		_CompletionCandidatesOfProperty$LExpression$: _CompletionCandidatesOfProperty$LExpression$
	},
	"src/doc.jsx": {
		DocCommentNode: DocCommentNode,
		DocCommentNode$: DocCommentNode$,
		DocCommentParameter: DocCommentParameter,
		DocCommentParameter$LToken$: DocCommentParameter$LToken$,
		DocCommentTag: DocCommentTag,
		DocCommentTag$S: DocCommentTag$S,
		DocComment: DocComment,
		DocComment$: DocComment$,
		DocumentGenerator: DocumentGenerator,
		DocumentGenerator$LCompiler$SS: DocumentGenerator$LCompiler$SS
	}
};


/**
 * launches _Main.main(:string[]):void invoked by jsx --run|--executable
 */
JSX.runMain = function (sourceFile, args) {
	var module = JSX.require(sourceFile);
	if (! module) {
		throw new ReferenceError("entry point module not found in " + sourceFile);
	}
	if (! module._Main) {
		throw new ReferenceError("entry point _Main not found in " + sourceFile);
	}
	if (! module._Main.main$AS) {
		throw new ReferenceError("entry point _Main.main(:string[]):void not found in " + sourceFile);
	}
	module._Main.main$AS(args);
};

/**
 * launches _Test#test*():void invoked by jsx --test
 */
JSX.runTests = function (sourceFile, tests) {
	var module = JSX.require(sourceFile);
	var testClass = module._Test$;

	if (!testClass) return; // skip if there's no test class

	if(tests.length === 0) {
		var p = testClass.prototype;
		for (var m in p) {
			if (p[m] instanceof Function
				&& /^test.*[$]$/.test(m)) {
				tests.push(m);
			}
		}
	}
	else { // set as process arguments
		tests = tests.map(function (name) {
			return name + "$"; // mangle for function test*():void
		});
	}

	var testCase = new testClass();

	if (testCase.beforeClass$AS != null)
		testCase.beforeClass$AS(tests);

	for (var i = 0; i < tests.length; ++i) {
		(function (method) {
			if (method in testCase) {
				testCase.run$SF$V$(method, function() { testCase[method](); });
			}
			else {
				throw new ReferenceError("No such test method: " + method);
			}
		}(tests[i]));
	}

	if (testCase.afterClass$ != null)
		testCase.afterClass$();
};
JSX.runMain("src/jsx-node-front.jsx", process.argv.slice(2))
})(JSX);
