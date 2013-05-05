#!/usr/bin/env node
// generatedy by JSX compiler 0.9.28 (2013-05-05 17:21:27 +0900; 27a1644e9b3800f8387a38410af80d18da43ba0d)
var JSX = {};
(function (JSX) {
/**
 * extends the class
 */
function $__jsx_extend(derivations, base) {
	var ctor = function () {};
	ctor.prototype = base.prototype;
	var proto = new ctor();
	for (var i in derivations) {
		derivations[i].prototype = proto;
	}
}

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
function g_StopIteration() {
	Error.call(this);
};

$__jsx_extend([g_StopIteration], Error);
function CompilationServer(parentPlatform) {
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

$__jsx_extend([CompilationServer], Object);
function CompilationServer$start$LPlatform$I(platform, port) {
	var server;
	server = new CompilationServer(platform);
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

CompilationServer.start$LPlatform$I = CompilationServer$start$LPlatform$I;

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


CompilationServer.prototype.handleRequest$LServerRequest$LServerResponse$ = function (request, response) {
	var $this = this;
	var startTime;
	var id;
	var c;
	var matched;
	var query;
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
	c = new CompilationServerPlatform(this._platform.getRoot$(), id, request, response);
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


CompilationServer.prototype.handleGET$NLDate$LServerRequest$LServerResponse$ = function (id, startTime, request, response) {
	this.finishRequest$NLDate$LServerResponse$NX(id, startTime, response, 200, ({ version_string: Meta.VERSION_STRING, version_number: Meta.VERSION_NUMBER, last_commit_hash: Meta.LAST_COMMIT_HASH, last_commit_date: Meta.LAST_COMMIT_DATE, status: true }));
};


CompilationServer.prototype.finishRequest$NLDate$LServerResponse$NX = function (id, startTime, response, statusCode, data) {
	var content;
	var headers;
	var now;
	var elapsed;
	content = JSON.stringify(data);
	headers = ({ "Content-Type": "application/json", "Content-Length": Buffer.byteLength(content, "utf-8") + "", "Cache-Control": "no-cache" });
	response.writeHead(statusCode, headers);
	response.end(content, "utf-8");
	now = new Date();
	elapsed = now.getTime() - startTime.getTime();
	console.info("%s #%s finish, elapsed %s [ms]", now.toISOString(), id, elapsed);
};


function _Main() {
};

$__jsx_extend([_Main], Object);
function _Main$main$AS(args) {
	var exitCode;
	var stdoutIsFlushed;
	var stderrIsFlushed;
	var exitIfFlushed;
	exitCode = JSXCommand$main$LPlatform$AS(new NodePlatform(), NodePlatform$getEnvOpts$().concat(args));
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

_Main.main = _Main$main$AS;
_Main.main$AS = _Main$main$AS;

function node() {
};

$__jsx_extend([node], Object);
function node$require$S(source) {
	var src;
	src = 'require(' + JSON.stringify(source) + ')';
	return eval(src);
};

node.require$S = node$require$S;

function Timer() {
};

$__jsx_extend([Timer], Object);
function Timer$setTimeout$F$V$N(callback, intervalMS) {
	return js.global.setTimeout(callback, intervalMS);
};

Timer.setTimeout$F$V$N = Timer$setTimeout$F$V$N;

function Timer$clearTimeout$LTimerHandle$(timer) {
	js.global.clearTimeout(timer);
};

Timer.clearTimeout$LTimerHandle$ = Timer$clearTimeout$LTimerHandle$;

function Timer$setInterval$F$V$N(callback, intervalMS) {
	return js.global.setInterval(callback, intervalMS);
};

Timer.setInterval$F$V$N = Timer$setInterval$F$V$N;

function Timer$clearInterval$LTimerHandle$(timer) {
	js.global.clearInterval(timer);
};

Timer.clearInterval$LTimerHandle$ = Timer$clearInterval$LTimerHandle$;

function Timer$requestAnimationFrame$F$NV$(callback) {
	return Timer._requestAnimationFrame(callback);
};

Timer.requestAnimationFrame$F$NV$ = Timer$requestAnimationFrame$F$NV$;

function Timer$cancelAnimationFrame$LTimerHandle$(timer) {
	Timer._cancelAnimationFrame(timer);
};

Timer.cancelAnimationFrame$LTimerHandle$ = Timer$cancelAnimationFrame$LTimerHandle$;

function Timer$useNativeRAF$B(enable) {
	Timer._requestAnimationFrame = Timer$_getRequestAnimationFrameImpl$B(enable);
	Timer._cancelAnimationFrame = Timer$_getCancelAnimationFrameImpl$B(enable);
};

Timer.useNativeRAF$B = Timer$useNativeRAF$B;

function Timer$_getRequestAnimationFrameImpl$B(useNativeImpl) {
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
		var now;
		var timeToCall;
		now = Date.now();
		timeToCall = Math.max(0, 16 - (now - lastTime));
		lastTime = now + timeToCall;
		return Timer$setTimeout$F$V$N((function () {
			callback(now + timeToCall);
		}), timeToCall);
	});
};

Timer._getRequestAnimationFrameImpl$B = Timer$_getRequestAnimationFrameImpl$B;

function Timer$_getCancelAnimationFrameImpl$B(useNativeImpl) {
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

Timer._getCancelAnimationFrameImpl$B = Timer$_getCancelAnimationFrameImpl$B;

function TimerHandle() {
};

$__jsx_extend([TimerHandle], Object);
function Util() {
};

$__jsx_extend([Util], Object);
function Util$repeat$SN(c, n) {
	var s;
	var i;
	s = "";
	for (i = 0; i < n; ++ i) {
		s += c;
	}
	return s;
};

Util.repeat$SN = Util$repeat$SN;

function Util$format$SAS(fmt, args) {
	var i;
	i = 0;
	return fmt.replace(/%(\d+|%)/g, (function (m) {
		var arg;
		if (m === "%%") {
			return "%";
		} else {
			arg = args[(m.substring(1) | 0) - 1];
			return (arg == null ? "null" : arg);
		}
	}));
};

Util.format$SAS = Util$format$SAS;

function Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, token, className, typeArguments) {
	return context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(token, className, typeArguments), context.postInstantiationCallback);
};

Util.instantiateTemplate$LAnalysisContext$LToken$SALType$ = Util$instantiateTemplate$LAnalysisContext$LToken$SALType$;

function Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, args, parentExpr, expectedTypes) {
	var argTypes;
	var i;
	var funcDef;
	var expectedCallbackType;
	var j;
	var arrayExpr;
	var expectedArrayType;
	var mapExpr;
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

Util.analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$ = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$;

function Util$typesAreEqual$ALType$ALType$(x, y) {
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

Util.typesAreEqual$ALType$ALType$ = Util$typesAreEqual$ALType$ALType$;

function Util$forEachStatement$F$LStatement$B$ALStatement$(cb, statements) {
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

Util.forEachStatement$F$LStatement$B$ALStatement$ = Util$forEachStatement$F$LStatement$B$ALStatement$;

function Util$forEachExpression$F$LExpression$B$ALExpression$(cb, exprs) {
	return Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$((function (expr, _) {
		return cb(expr);
	}), exprs);
};

Util.forEachExpression$F$LExpression$B$ALExpression$ = Util$forEachExpression$F$LExpression$B$ALExpression$;

function Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, exprs) {
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

Util.forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$ = Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$;

function Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic) {
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

Util.findFunctionInClass$LClassDefinition$SALType$B = Util$findFunctionInClass$LClassDefinition$SALType$B;

function Util$findVariableInClass$LClassDefinition$SB(classDef, name, isStatic) {
	var found;
	found = null;
	classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (def) {
		if (isStatic === ((def.flags$() & ClassDefinition.IS_STATIC) !== 0) && def.name$() === name) {
			found = def;
			return false;
		}
		return true;
	}));
	return found;
};

Util.findVariableInClass$LClassDefinition$SB = Util$findVariableInClass$LClassDefinition$SB;

function Util$findMemberInClass$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic) {
	if (argTypes != null) {
		return Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic);
	} else {
		return Util$findVariableInClass$LClassDefinition$SB(classDef, name, isStatic);
	}
};

Util.findMemberInClass$LClassDefinition$SALType$B = Util$findMemberInClass$LClassDefinition$SALType$B;

function Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic) {
	var rootIsNativeNonStatic;
	if (isStatic) {
		return (classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) !== 0;
	}
	function rootIsNativeNonStatic(classDef, name, argTypes) {
		var found;
		found = Util$findMemberInClass$LClassDefinition$SALType$B(classDef, name, argTypes, false);
		if (found != null && (found.flags$() & ClassDefinition.IS_OVERRIDE) === 0) {
			return (classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) !== 0;
		}
		if (classDef.extendType$() == null) {
			return false;
		}
		return rootIsNativeNonStatic(classDef.extendType$().getClassDef$(), name, argTypes);
	}
	return rootIsNativeNonStatic(classDef, name, argTypes);
};

Util.memberRootIsNative$LClassDefinition$SALType$B = Util$memberRootIsNative$LClassDefinition$SALType$B;

function Util$propertyRootIsNative$LPropertyExpression$(expr) {
	var baseExpr;
	baseExpr = expr.getExpr$();
	return Util$memberRootIsNative$LClassDefinition$SALType$B(baseExpr.getType$().getClassDef$(), expr.getIdentifierToken$().getValue$(), Util$isReferringToFunctionDefinition$LPropertyExpression$(expr) ? expr.getType$().getArgumentTypes$() : null, baseExpr instanceof ClassExpression);
};

Util.propertyRootIsNative$LPropertyExpression$ = Util$propertyRootIsNative$LPropertyExpression$;

function Util$memberIsExported$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic) {
	var found;
	var check;
	if (isStatic) {
		found = Util$findMemberInClass$LClassDefinition$SALType$B(classDef, name, argTypes, true);
		return (found.flags$() & ClassDefinition.IS_EXPORT) !== 0;
	}
	function check(classDef) {
		var found;
		var isExportedInImpl;
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			return false;
		}
		found = Util$findMemberInClass$LClassDefinition$SALType$B(classDef, name, argTypes, false);
		if (found != null && (found.flags$() & ClassDefinition.IS_EXPORT) !== 0) {
			return true;
		}
		if (classDef.extendType$() != null) {
			if (check(classDef.extendType$().getClassDef$())) {
				return true;
			}
		}
		isExportedInImpl = false;
		classDef.implementTypes$().forEach((function (implType) {
			if (check(implType.getClassDef$())) {
				isExportedInImpl = true;
			}
		}));
		return isExportedInImpl;
	}
	return check(classDef);
};

Util.memberIsExported$LClassDefinition$SALType$B = Util$memberIsExported$LClassDefinition$SALType$B;

function Util$isReferringToFunctionDefinition$LPropertyExpression$(expr) {
	var exprType;
	exprType = expr.getType$();
	if (! (exprType instanceof FunctionType)) {
		return false;
	}
	if (exprType.isAssignable$()) {
		return false;
	}
	return true;
};

Util.isReferringToFunctionDefinition$LPropertyExpression$ = Util$isReferringToFunctionDefinition$LPropertyExpression$;

function Util$encodeStringLiteral$S(str) {
	var escaped;
	escaped = str.replace(/[\0-\x19\\'"\u007f-\uffff]/g, (function (ch) {
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

Util.encodeStringLiteral$S = Util$encodeStringLiteral$S;

function Util$decodeStringLiteral$S(literal) {
	var matched;
	var src;
	var decoded;
	var pos;
	var backslashAt;
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

Util.decodeStringLiteral$S = Util$decodeStringLiteral$S;

function Util$_resolvedPathParts$S(path) {
	var tokens;
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

Util._resolvedPathParts$S = Util$_resolvedPathParts$S;

function Util$resolvePath$S(path) {
	return Util$_resolvedPathParts$S(path).join("/");
};

Util.resolvePath$S = Util$resolvePath$S;

function Util$relativePath$SSB(fromPath, toPath, isFile) {
	var f;
	var t;
	var minLen;
	var samePartsIndex;
	var i;
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

Util.relativePath$SSB = Util$relativePath$SSB;

function Util$basename$S(path) {
	var parts;
	parts = Util$_resolvedPathParts$S(path);
	return parts.pop();
};

Util.basename$S = Util$basename$S;

function Util$dirname$S(path) {
	var parts;
	parts = Util$_resolvedPathParts$S(path);
	parts.pop();
	return (parts.length !== 0 ? parts.join("/") : ".");
};

Util.dirname$S = Util$dirname$S;

function Util$toOrdinal$N(n) {
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

Util.toOrdinal$N = Util$toOrdinal$N;

function Util$makeErrorMessage$LPlatform$SUSNNN(platform, message, filename, lineNumber, columnNumber, size) {
	var content;
	var sourceLine;
	var TAB_WIDTH;
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

Util.makeErrorMessage$LPlatform$SUSNNN = Util$makeErrorMessage$LPlatform$SUSNNN;

function Util$isArrayOf$LClassDefinition$LType$(classDef, expectedElementType) {
	var instantiatedClassDef;
	if (! (classDef instanceof InstantiatedClassDefinition)) {
		return false;
	}
	instantiatedClassDef = classDef;
	if (instantiatedClassDef.getTemplateClassName$() !== "Array") {
		return false;
	}
	if (! instantiatedClassDef.getTypeArguments$()[0].equals$LType$(expectedElementType)) {
		return false;
	}
	return true;
};

Util.isArrayOf$LClassDefinition$LType$ = Util$isArrayOf$LClassDefinition$LType$;

function Cloner$Expression$E() {
};

$__jsx_extend([Cloner$Expression$E], Object);
function Cloner$Expression$E$cloneArray$ALExpression$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Cloner$Expression$E.cloneArray$ALExpression$ = Cloner$Expression$E$cloneArray$ALExpression$;

function Cloner$Expression$E$cloneNullable$LExpression$(o) {
	return (o == null ? null : o.clone$());
};

Cloner$Expression$E.cloneNullable$LExpression$ = Cloner$Expression$E$cloneNullable$LExpression$;

function Serializer$Expression$E() {
};

$__jsx_extend([Serializer$Expression$E], Object);
function Serializer$Expression$E$serializeArray$ALExpression$(a) {
	var ret;
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

Serializer$Expression$E.serializeArray$ALExpression$ = Serializer$Expression$E$serializeArray$ALExpression$;

function Serializer$Expression$E$serializeNullable$LExpression$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$Expression$E.serializeNullable$LExpression$ = Serializer$Expression$E$serializeNullable$LExpression$;

function Serializer$Type$E() {
};

$__jsx_extend([Serializer$Type$E], Object);
function Serializer$Type$E$serializeArray$ALType$(a) {
	var ret;
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

Serializer$Type$E.serializeArray$ALType$ = Serializer$Type$E$serializeArray$ALType$;

function Serializer$Type$E$serializeNullable$LType$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$Type$E.serializeNullable$LType$ = Serializer$Type$E$serializeNullable$LType$;

function Serializer$MapLiteralElement$E() {
};

$__jsx_extend([Serializer$MapLiteralElement$E], Object);
function Serializer$MapLiteralElement$E$serializeArray$ALMapLiteralElement$(a) {
	var ret;
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

Serializer$MapLiteralElement$E.serializeArray$ALMapLiteralElement$ = Serializer$MapLiteralElement$E$serializeArray$ALMapLiteralElement$;

function Serializer$MapLiteralElement$E$serializeNullable$LMapLiteralElement$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$MapLiteralElement$E.serializeNullable$LMapLiteralElement$ = Serializer$MapLiteralElement$E$serializeNullable$LMapLiteralElement$;

function Serializer$ClassDefinition$E() {
};

$__jsx_extend([Serializer$ClassDefinition$E], Object);
function Serializer$ClassDefinition$E$serializeArray$ALClassDefinition$(a) {
	var ret;
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

Serializer$ClassDefinition$E.serializeArray$ALClassDefinition$ = Serializer$ClassDefinition$E$serializeArray$ALClassDefinition$;

function Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$ClassDefinition$E.serializeNullable$LClassDefinition$ = Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$;

function Serializer$Token$E() {
};

$__jsx_extend([Serializer$Token$E], Object);
function Serializer$Token$E$serializeArray$ALToken$(a) {
	var ret;
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

Serializer$Token$E.serializeArray$ALToken$ = Serializer$Token$E$serializeArray$ALToken$;

function Serializer$Token$E$serializeNullable$LToken$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$Token$E.serializeNullable$LToken$ = Serializer$Token$E$serializeNullable$LToken$;

function Cloner$Statement$E() {
};

$__jsx_extend([Cloner$Statement$E], Object);
function Cloner$Statement$E$cloneArray$ALStatement$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Cloner$Statement$E.cloneArray$ALStatement$ = Cloner$Statement$E$cloneArray$ALStatement$;

function Cloner$Statement$E$cloneNullable$LStatement$(o) {
	return (o == null ? null : o.clone$());
};

Cloner$Statement$E.cloneNullable$LStatement$ = Cloner$Statement$E$cloneNullable$LStatement$;

function Serializer$Statement$E() {
};

$__jsx_extend([Serializer$Statement$E], Object);
function Serializer$Statement$E$serializeArray$ALStatement$(a) {
	var ret;
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

Serializer$Statement$E.serializeArray$ALStatement$ = Serializer$Statement$E$serializeArray$ALStatement$;

function Serializer$Statement$E$serializeNullable$LStatement$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$Statement$E.serializeNullable$LStatement$ = Serializer$Statement$E$serializeNullable$LStatement$;

function Cloner$CatchStatement$E() {
};

$__jsx_extend([Cloner$CatchStatement$E], Object);
function Cloner$CatchStatement$E$cloneArray$ALCatchStatement$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++ i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Cloner$CatchStatement$E.cloneArray$ALCatchStatement$ = Cloner$CatchStatement$E$cloneArray$ALCatchStatement$;

function Cloner$CatchStatement$E$cloneNullable$LCatchStatement$(o) {
	return (o == null ? null : o.clone$());
};

Cloner$CatchStatement$E.cloneNullable$LCatchStatement$ = Cloner$CatchStatement$E$cloneNullable$LCatchStatement$;

function Serializer$CatchStatement$E() {
};

$__jsx_extend([Serializer$CatchStatement$E], Object);
function Serializer$CatchStatement$E$serializeArray$ALCatchStatement$(a) {
	var ret;
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

Serializer$CatchStatement$E.serializeArray$ALCatchStatement$ = Serializer$CatchStatement$E$serializeArray$ALCatchStatement$;

function Serializer$CatchStatement$E$serializeNullable$LCatchStatement$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$CatchStatement$E.serializeNullable$LCatchStatement$ = Serializer$CatchStatement$E$serializeNullable$LCatchStatement$;

function Serializer$ParsedObjectType$E() {
};

$__jsx_extend([Serializer$ParsedObjectType$E], Object);
function Serializer$ParsedObjectType$E$serializeArray$ALParsedObjectType$(a) {
	var ret;
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

Serializer$ParsedObjectType$E.serializeArray$ALParsedObjectType$ = Serializer$ParsedObjectType$E$serializeArray$ALParsedObjectType$;

function Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$ParsedObjectType$E.serializeNullable$LParsedObjectType$ = Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$;

function Serializer$MemberDefinition$E() {
};

$__jsx_extend([Serializer$MemberDefinition$E], Object);
function Serializer$MemberDefinition$E$serializeArray$ALMemberDefinition$(a) {
	var ret;
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

Serializer$MemberDefinition$E.serializeArray$ALMemberDefinition$ = Serializer$MemberDefinition$E$serializeArray$ALMemberDefinition$;

function Serializer$MemberDefinition$E$serializeNullable$LMemberDefinition$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$MemberDefinition$E.serializeNullable$LMemberDefinition$ = Serializer$MemberDefinition$E$serializeNullable$LMemberDefinition$;

function Serializer$ArgumentDeclaration$E() {
};

$__jsx_extend([Serializer$ArgumentDeclaration$E], Object);
function Serializer$ArgumentDeclaration$E$serializeArray$ALArgumentDeclaration$(a) {
	var ret;
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

Serializer$ArgumentDeclaration$E.serializeArray$ALArgumentDeclaration$ = Serializer$ArgumentDeclaration$E$serializeArray$ALArgumentDeclaration$;

function Serializer$ArgumentDeclaration$E$serializeNullable$LArgumentDeclaration$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$ArgumentDeclaration$E.serializeNullable$LArgumentDeclaration$ = Serializer$ArgumentDeclaration$E$serializeNullable$LArgumentDeclaration$;

function Serializer$LocalVariable$E() {
};

$__jsx_extend([Serializer$LocalVariable$E], Object);
function Serializer$LocalVariable$E$serializeArray$ALLocalVariable$(a) {
	var ret;
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

Serializer$LocalVariable$E.serializeArray$ALLocalVariable$ = Serializer$LocalVariable$E$serializeArray$ALLocalVariable$;

function Serializer$LocalVariable$E$serializeNullable$LLocalVariable$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$LocalVariable$E.serializeNullable$LLocalVariable$ = Serializer$LocalVariable$E$serializeNullable$LLocalVariable$;

function TypedMap$Array$Type$E$MemberFunctionDefinition$E() {
	var $this = this;
	TypedMap$Array$Type$E$MemberFunctionDefinition$E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$Array$Type$E$MemberFunctionDefinition$E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$Array$Type$E$MemberFunctionDefinition$E, TypedMap$Array$Type$E$MemberFunctionDefinition$E$0], Object);
TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$Array$Type$E$MemberFunctionDefinition$E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.has$ALType$ = function (key) {
	var $this = this;
	return ! this.forEach$F$ALType$LMemberFunctionDefinition$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.set$ALType$LMemberFunctionDefinition$ = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$Array$Type$E$MemberFunctionDefinition$E(key, val));
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.get$ALType$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.delete$ALType$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.forEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$Array$Type$E$MemberFunctionDefinition$E.prototype.reversedForEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$Array$Type$E$MemberFunctionDefinition$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$Array$Type$E$MemberFunctionDefinition$E], Object);
function Serializer$Import$E() {
};

$__jsx_extend([Serializer$Import$E], Object);
function Serializer$Import$E$serializeArray$ALImport$(a) {
	var ret;
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

Serializer$Import$E.serializeArray$ALImport$ = Serializer$Import$E$serializeArray$ALImport$;

function Serializer$Import$E$serializeNullable$LImport$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Serializer$Import$E.serializeNullable$LImport$ = Serializer$Import$E$serializeNullable$LImport$;

function Pair$ClassDefinition$MemberFunctionDefinition$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$ClassDefinition$MemberFunctionDefinition$E], Object);
function TypedMap$LocalVariable$boolean$E() {
	var $this = this;
	TypedMap$LocalVariable$boolean$E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$LocalVariable$boolean$E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$LocalVariable$boolean$E, TypedMap$LocalVariable$boolean$E$0], Object);
TypedMap$LocalVariable$boolean$E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$LocalVariable$boolean$E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$LocalVariable$boolean$E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$BB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$LocalVariable$boolean$E.prototype.set$LLocalVariable$B = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$LocalVariable$boolean$E(key, val));
};


TypedMap$LocalVariable$boolean$E.prototype.get$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$LocalVariable$boolean$E.prototype.delete$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$LocalVariable$boolean$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$LocalVariable$boolean$E.prototype.forEach$F$LLocalVariable$BB$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$LocalVariable$boolean$E.prototype.reversedForEach$F$LLocalVariable$BB$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$LocalVariable$boolean$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$LocalVariable$boolean$E], Object);
function TypedMap$LocalVariable$Expression$E() {
	var $this = this;
	TypedMap$LocalVariable$Expression$E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$LocalVariable$Expression$E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$LocalVariable$Expression$E, TypedMap$LocalVariable$Expression$E$0], Object);
TypedMap$LocalVariable$Expression$E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$LocalVariable$Expression$E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$LocalVariable$Expression$E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$LExpression$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$LocalVariable$Expression$E.prototype.set$LLocalVariable$LExpression$ = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$LocalVariable$Expression$E(key, val));
};


TypedMap$LocalVariable$Expression$E.prototype.get$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$LocalVariable$Expression$E.prototype.delete$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$LocalVariable$Expression$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$LocalVariable$Expression$E.prototype.forEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$LocalVariable$Expression$E.prototype.reversedForEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$LocalVariable$Expression$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$LocalVariable$Expression$E], Object);
function Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E(first, second, third) {
	this.first = first;
	this.second = second;
	this.third = third;
};

$__jsx_extend([Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E], Object);
function Pair$AssignmentExpression$function$$$$Expression$$$$void$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$AssignmentExpression$function$$$$Expression$$$$void$E], Object);
function TypedMap$ClassDefinition$string$E() {
	var $this = this;
	TypedMap$ClassDefinition$string$E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$ClassDefinition$string$E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$ClassDefinition$string$E, TypedMap$ClassDefinition$string$E$0], Object);
TypedMap$ClassDefinition$string$E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$ClassDefinition$string$E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$ClassDefinition$string$E.prototype.has$LClassDefinition$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LClassDefinition$SB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$ClassDefinition$string$E.prototype.set$LClassDefinition$S = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$ClassDefinition$string$E(key, val));
};


TypedMap$ClassDefinition$string$E.prototype.get$LClassDefinition$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$ClassDefinition$string$E.prototype.delete$LClassDefinition$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++ i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$ClassDefinition$string$E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$ClassDefinition$string$E.prototype.forEach$F$LClassDefinition$SB$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++ i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$ClassDefinition$string$E.prototype.reversedForEach$F$LClassDefinition$SB$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; -- i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$ClassDefinition$string$E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$ClassDefinition$string$E], Object);
function _Util() {
};

$__jsx_extend([_Util], Object);
function _Util$getOutputClassName$LClassDefinition$(classDef) {
	return classDef.getStash$()[_Util.OUTPUTNAME_IDENTIFIER].outputName;
};

_Util.getOutputClassName$LClassDefinition$ = _Util$getOutputClassName$LClassDefinition$;

function _Util$getOutputConstructorName$LMemberFunctionDefinition$(ctor) {
	if ((ctor.getClassDef$().flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return _Util$getNameOfNativeConstructor$LClassDefinition$(ctor.getClassDef$());
	}
	return ctor.getStash$()[_Util.OUTPUTNAME_IDENTIFIER].outputName;
};

_Util.getOutputConstructorName$LMemberFunctionDefinition$ = _Util$getOutputConstructorName$LMemberFunctionDefinition$;

function _Util$getOutputConstructorName$LClassDefinition$ALType$(classDef, argTypes) {
	var ctor;
	ctor = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, "constructor", argTypes, false);
	return _Util$getOutputConstructorName$LMemberFunctionDefinition$(ctor);
};

_Util.getOutputConstructorName$LClassDefinition$ALType$ = _Util$getOutputConstructorName$LClassDefinition$ALType$;

function _Util$getNameOfNativeConstructor$LClassDefinition$(classDef) {
	if (classDef instanceof InstantiatedClassDefinition) {
		if (classDef.getTemplateClassName$() === "Map") {
			return "Object";
		} else {
			return classDef.getTemplateClassName$();
		}
	}
	return classDef.className$();
};

_Util.getNameOfNativeConstructor$LClassDefinition$ = _Util$getNameOfNativeConstructor$LClassDefinition$;

function _Util$setOutputClassNames$ALClassDefinition$(classDefs) {
	var setOutputName;
	var escapeClassNameIfInstantiated;
	var countByName;
	var newUniqueName;
	var i;
	var classDef;
	var className;
	var ctors;
	var j;
	var exportedCtor;
	var n;
	function setOutputName(stashable, name) {
		stashable.getStash$()[_Util.OUTPUTNAME_IDENTIFIER] = new _Util$COutputNameStash(name);
	}
	function escapeClassNameIfInstantiated(name) {
		return name.replace(/\.</g, "$$").replace(/>/g, "$E").replace(/[^A-Za-z0-9_]/g, "$");
	}
	countByName = {};
	function newUniqueName(className) {
		var name;
		if (countByName[className]) {
			name = className + "$" + (countByName[className] - 1 + "");
			++ countByName[className];
		} else {
			name = className;
			countByName[className] = 1;
		}
		return escapeClassNameIfInstantiated(name);
	}
	for (i = 0; i < classDefs.length; ++ i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			className = classDef.className$();
			setOutputName(classDef, escapeClassNameIfInstantiated(className));
			countByName[className] = 1;
		}
	}
	for (i = 0; i < classDefs.length; ++ i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			if (classDef.getOuterClassDef$() != null) {
				className = _Util$getOutputClassName$LClassDefinition$(classDef.getOuterClassDef$()) + "$C" + classDef.className$();
			} else {
				className = classDef.className$();
			}
			ctors = _Util$findFunctions$LClassDefinition$SB(classDef, "constructor", false);
			if (ctors.length !== 0) {
				for (j = 0; j < ctors.length; ++ j) {
					if ((ctors[j].flags$() & ClassDefinition.IS_EXPORT) !== 0) {
						exportedCtor = ctors[j];
						ctors.splice(j, 1);
						ctors.unshift(exportedCtor);
						break;
					}
				}
				n = newUniqueName(className);
				setOutputName(classDef, n);
				setOutputName(ctors[0], n);
				for (j = 1; j < ctors.length; ++ j) {
					setOutputName(ctors[j], newUniqueName(className));
				}
			} else {
				setOutputName(classDef, newUniqueName(className));
			}
		}
	}
};

_Util.setOutputClassNames$ALClassDefinition$ = _Util$setOutputClassNames$ALClassDefinition$;

function _Util$encodeObjectLiteralKey$S(s) {
	if (s.length === 0 || s.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)) {
		return s;
	}
	return Util$encodeStringLiteral$S(s);
};

_Util.encodeObjectLiteralKey$S = _Util$encodeObjectLiteralKey$S;

function _Util$findFunctions$LClassDefinition$SB(classDef, name, isStatic) {
	var functions;
	var members;
	var i;
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

_Util.findFunctions$LClassDefinition$SB = _Util$findFunctions$LClassDefinition$SB;

function _Mangler() {
};

$__jsx_extend([_Mangler], Object);
_Mangler.prototype.mangleFunctionName$SALType$ = function (name, argTypes) {
	return name + this.mangleFunctionArguments$ALType$(argTypes);
};


_Mangler.prototype.mangleTypeName$LType$ = function (type) {
	var classDef;
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
									return "A" + this.mangleTypeName$LType$(typeArgs[0]);
								case "Map":
									return "H" + this.mangleTypeName$LType$(typeArgs[0]);
								default:
								}
							}
							return "L" + _Util$getOutputClassName$LClassDefinition$(type.getClassDef$()) + "$";
						} else {
							if (type instanceof StaticFunctionType) {
								return "F" + this.mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this.mangleTypeName$LType$(type.getReturnType$()) + "$";
							} else {
								if (type instanceof MemberFunctionType) {
									return "M" + this.mangleTypeName$LType$(type.getObjectType$()) + this.mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this.mangleTypeName$LType$(type.getReturnType$()) + "$";
								} else {
									if (type instanceof NullableType) {
										return "U" + this.mangleTypeName$LType$(type.getBaseType$());
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


_Mangler.prototype.mangleFunctionArguments$ALType$ = function (argTypes) {
	var s;
	var i;
	s = "$";
	for (i = 0; i < argTypes.length; ++ i) {
		s += this.mangleTypeName$LType$(argTypes[i]);
	}
	return s;
};


_Mangler.prototype.requiresMangling$LClassDefinition$SALType$B = function (classDef, name, argTypes, isStatic) {
	return ! Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic);
};


_Mangler.prototype.requiresMangling$LPropertyExpression$ = function (expr) {
	if (! Util$isReferringToFunctionDefinition$LPropertyExpression$(expr)) {
		return false;
	}
	return ! Util$propertyRootIsNative$LPropertyExpression$(expr);
};


_Mangler.prototype.requiresMangling$LMemberFunctionDefinition$ = function (member) {
	return this.requiresMangling$LClassDefinition$SALType$B(member.getClassDef$(), member.name$(), member.getArgumentTypes$(), (member.flags$() & ClassDefinition.IS_STATIC) !== 0);
};


function _Namer() {
	this._emitter = null;
	this._catchLevel = - 1;
};

$__jsx_extend([_Namer], Object);
_Namer.prototype.setup$LJavaScriptEmitter$ = function (emitter) {
	this._emitter = emitter;
	return this;
};


_Namer.prototype.getNameOfProperty$LClassDefinition$S = function (classDef, name) {
	return name;
};


_Namer.prototype.getNameOfMethod$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, false)) {
		return name;
	}
	return this._emitter.getMangler$().mangleFunctionName$SALType$(name, argTypes);
};


_Namer.prototype.getNameOfStaticVariable$LClassDefinition$S = function (classDef, name) {
	return name;
};


_Namer.prototype.getNameOfStaticFunction$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
	var className;
	className = _Util$getOutputClassName$LClassDefinition$(classDef);
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, true)) {
		return className + "." + name;
	}
	return className + "$" + this._emitter.getMangler$().mangleFunctionName$SALType$(name, argTypes);
};


_Namer.prototype.getNameOfConstructor$LClassDefinition$ALType$ = function (classDef, argTypes) {
	return _Util$getOutputConstructorName$LClassDefinition$ALType$(classDef, argTypes);
};


_Namer.prototype.getNameOfClass$LClassDefinition$ = function (classDef) {
	return _Util$getOutputClassName$LClassDefinition$(classDef);
};


_Namer.prototype.enterScope$LLocalVariable$F$V$ = function (local, cb) {
	cb();
};


_Namer.prototype.enterFunction$LMemberFunctionDefinition$F$V$ = function (funcDef, cb) {
	cb();
};


_Namer.prototype.enterCatch$LTryStatement$F$F$S$V$ = function (tryStmt, cb) {
	++ this._catchLevel;
	this._enterCatch$LTryStatement$F$F$S$V$S(tryStmt, cb, "$__jsx_catch_" + (this._catchLevel + ""));
	-- this._catchLevel;
};


_Namer.prototype._enterCatch$LTryStatement$F$F$S$V$S = function (tryStmt, cb, catchName) {
	var $this = this;
	var catchStmts;
	var i;
	tryStmt.getStash$()[_Namer.IDENTIFIER] = new _Namer$C_TryStash(catchName);
	catchStmts = tryStmt.getCatchStatements$();
	for (i in catchStmts) {
		catchStmts[i].getLocal$().getStash$()[_Namer.IDENTIFIER] = new _Namer$C_CatchTargetStash(tryStmt);
	}
	cb((function () {
		return $this._getCatchName$LTryStatement$(tryStmt);
	}));
};


_Namer.prototype.getNameOfLocalVariable$LLocalVariable$ = function (local) {
	if (local instanceof CaughtVariable) {
		return this._getCatchName$LCaughtVariable$(local);
	} else {
		return local.getName$().getValue$();
	}
};


_Namer.prototype._getCatchName$LCaughtVariable$ = function (caught) {
	return this._getCatchName$LTryStatement$(caught.getStash$()[_Namer.IDENTIFIER].tryStmt);
};


_Namer.prototype._getCatchName$LTryStatement$ = function (tryStmt) {
	return tryStmt.getStash$()[_Namer.IDENTIFIER].catchName;
};


function _MinifiedNameGenerator(skipWords) {
	var i;
	this._skipWords = {};
	this._memo = [];
	this._counter = 0;
	for (i in skipWords) {
		this._skipWords[skipWords[i]] = true;
	}
};

$__jsx_extend([_MinifiedNameGenerator], Object);
_MinifiedNameGenerator.prototype.get$N = function (n) {
	var candidate;
	while (this._memo.length <= n) {
		do {
			candidate = _MinifiedNameGenerator$_stringify$N(this._counter++);
		} while ($__jsx_ObjectHasOwnProperty.call(this._skipWords, candidate) || candidate.match(/^[0-9$]/));
		this._memo.push(candidate);
	}
	return this._memo[n];
};


function _MinifiedNameGenerator$_stringify$N(n) {
	var name;
	var colIndex;
	name = "";
	do {
		colIndex = n % _MinifiedNameGenerator._MINIFY_CHARS.length;
		name += _MinifiedNameGenerator._MINIFY_CHARS.charAt(colIndex);
		n = (n - colIndex) / _MinifiedNameGenerator._MINIFY_CHARS.length;
	} while (n !== 0);
	return name;
};

_MinifiedNameGenerator._stringify$N = _MinifiedNameGenerator$_stringify$N;

function _Minifier(emitter, classDefs) {
	this._propertyUseCount = {};
	this._propertyConversionTable = null;
	this._globalUseCount = {};
	this._globalConversionTable = null;
	this._outerLocals = [];
	this._emitter = emitter;
	this._classDefs = classDefs;
};

$__jsx_extend([_Minifier], Object);
_Minifier.prototype.getCountingNamer$ = function () {
	return new _Minifier$C_MinifyingNamer().setup$L_Minifier$(this);
};


_Minifier.prototype.getMinifyingNamer$ = function () {
	this._minifyProperties$();
	this._minifyStaticVariables$();
	this._minifyGlobals$();
	return new _Minifier$C_MinifyingNamer().setup$L_Minifier$(this);
};


_Minifier.prototype._isCounting$ = function () {
	return this._propertyConversionTable == null;
};


_Minifier.prototype._recordUsedIdentifiers$LStashable$F$V$ = function (stashable, cb) {
	var globalUseCountBackup;
	var k;
	var outerLocalUseCount;
	var i;
	var scopeStash;
	globalUseCountBackup = {};
	for (k in this._globalUseCount) {
		globalUseCountBackup[k] = this._globalUseCount[k];
	}
	outerLocalUseCount = [];
	for (i in this._outerLocals) {
		outerLocalUseCount[i] = _Minifier$_getLocalStash$LLocalVariable$(this._outerLocals[i]).useCount;
	}
	cb();
	scopeStash = _Minifier$_getScopeStash$LStashable$(stashable);
	for (k in this._globalUseCount) {
		if (this._globalUseCount[k] != globalUseCountBackup[k]) {
			scopeStash.usedGlobals[k] = true;
		}
	}
	for (i in this._outerLocals) {
		if (outerLocalUseCount[i] != _Minifier$_getLocalStash$LLocalVariable$(this._outerLocals[i]).useCount) {
			scopeStash.usedOuterLocals.push(this._outerLocals[i]);
		}
	}
};


_Minifier.prototype._minifyProperties$ = function () {
	var $this = this;
	var k;
	this._log$S("minifying properties");
	this._propertyConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(this._propertyUseCount, new _MinifiedNameGenerator([  ].concat(_MinifiedNameGenerator.KEYWORDS, (function () {
		var nativePropertyNames;
		nativePropertyNames = {};
		$this._classDefs.forEach((function (classDef) {
			classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				if ((member.flags$() & ClassDefinition.IS_STATIC) === 0 && ((member.flags$() | classDef.flags$()) & ClassDefinition.IS_NATIVE) !== 0) {
					nativePropertyNames[member.name$()] = true;
				}
				return true;
			}));
		}));
		return Object.keys(nativePropertyNames);
	})())));
	for (k in this._propertyConversionTable) {
		this._log$S(" " + k + " => " + this._propertyConversionTable[k]);
	}
};


_Minifier.prototype._minifyStaticVariables$ = function () {
	var $this = this;
	this._log$S("minifying static variables");
	this._classDefs.forEach((function (classDef) {
		var exportedStaticVarNames;
		var stash;
		if ((classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) === 0) {
			exportedStaticVarNames = [];
			classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
				if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) === (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) {
					exportedStaticVarNames.push(member.name$());
				}
				return true;
			}));
			stash = _Minifier$_getClassStash$LClassDefinition$(classDef);
			stash.staticVariableConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(stash.staticVariableUseCount, new _MinifiedNameGenerator(_MinifiedNameGenerator.KEYWORDS.concat(exportedStaticVarNames)));
		}
	}));
};


_Minifier.prototype._minifyGlobals$ = function () {
	var $this = this;
	var useCount;
	var k;
	this._log$S("minifying classes and static functions");
	useCount = {};
	for (k in this._globalUseCount) {
		useCount[k] = this._globalUseCount[k];
	}
	this._classDefs.forEach((function (classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) !== 0) {
			delete useCount[classDef.className$()];
		}
	}));
	this._globalConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(useCount, new _MinifiedNameGenerator([  ].concat(_MinifiedNameGenerator.KEYWORDS, _MinifiedNameGenerator.GLOBALS, (function () {
		var nativeClassNames;
		nativeClassNames = [];
		$this._classDefs.forEach((function (classDef) {
			if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
				nativeClassNames.push(classDef.className$());
			}
		}));
		return nativeClassNames;
	})())));
	for (k in this._globalConversionTable) {
		this._log$S(" " + k + " => " + this._globalConversionTable[k]);
	}
};


_Minifier.prototype._log$S = function (message) {
};


_Minifier.prototype._buildConversionTable$ALLocalVariable$L_Minifier$C_ScopeStash$ = function (locals, scopeStash) {
	var $this = this;
	var useCount;
	var reserved;
	var k;
	var i;
	var conversionTable;
	useCount = {};
	locals.forEach((function (local) {
		useCount[local.getName$().getValue$()] = _Minifier$_getLocalStash$LLocalVariable$(local).useCount;
	}));
	reserved = [  ];
	for (k in scopeStash.usedGlobals) {
		reserved.push($__jsx_ObjectHasOwnProperty.call(this._globalConversionTable, k) ? this._globalConversionTable[k] : k);
	}
	for (i in scopeStash.usedOuterLocals) {
		reserved.push(_Minifier$_getLocalStash$LLocalVariable$(scopeStash.usedOuterLocals[i]).minifiedName);
	}
	this._log$S("local minification, preserving: " + reserved.join(","));
	reserved = reserved.concat(_MinifiedNameGenerator.KEYWORDS);
	conversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(useCount, new _MinifiedNameGenerator(reserved));
	locals.forEach((function (local) {
		_Minifier$_getLocalStash$LLocalVariable$(local).minifiedName = conversionTable[local.getName$().getValue$()];
	}));
};


function _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(useCount, nameGenerator) {
	var propertyNames;
	var conversionTable;
	var i;
	propertyNames = Object.keys(useCount).sort((function (x, y) {
		var delta;
		delta = useCount[y] - useCount[x];
		if (delta !== 0) {
			return delta;
		}
		if (x < y) {
			return - 1;
		} else {
			return 1;
		}
	}));
	conversionTable = {};
	for (i = 0; i < propertyNames.length; ++ i) {
		conversionTable[propertyNames[i]] = nameGenerator.get$N(i);
	}
	return conversionTable;
};

_Minifier._buildConversionTable$HNL_MinifiedNameGenerator$ = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$;

function _Minifier$_getClassStash$LClassDefinition$(classDef) {
	var stash;
	stash = classDef.getStash$();
	if (! $__jsx_ObjectHasOwnProperty.call(stash, _Minifier.CLASSSTASH_IDENTIFIER)) {
		stash[_Minifier.CLASSSTASH_IDENTIFIER] = new _Minifier$C_ClassStash();
	}
	return stash[_Minifier.CLASSSTASH_IDENTIFIER];
};

_Minifier._getClassStash$LClassDefinition$ = _Minifier$_getClassStash$LClassDefinition$;

function _Minifier$_getScopeStash$LStashable$(stashable) {
	var stash;
	stash = stashable.getStash$();
	if (! $__jsx_ObjectHasOwnProperty.call(stash, _Minifier.SCOPESTASH_IDENTIFIER)) {
		stash[_Minifier.SCOPESTASH_IDENTIFIER] = new _Minifier$C_ScopeStash();
	}
	return stash[_Minifier.SCOPESTASH_IDENTIFIER];
};

_Minifier._getScopeStash$LStashable$ = _Minifier$_getScopeStash$LStashable$;

function _Minifier$_getLocalStash$LLocalVariable$(local) {
	var stash;
	stash = local.getStash$();
	if (! $__jsx_ObjectHasOwnProperty.call(stash, _Minifier.LOCALSTASH_IDENTIFIER)) {
		stash[_Minifier.LOCALSTASH_IDENTIFIER] = new _Minifier$C_LocalStash();
	}
	return stash[_Minifier.LOCALSTASH_IDENTIFIER];
};

_Minifier._getLocalStash$LLocalVariable$ = _Minifier$_getLocalStash$LLocalVariable$;

function _Minifier$_incr$HNS(useCount, name) {
	if ($__jsx_ObjectHasOwnProperty.call(useCount, name)) {
		++ useCount[name];
	} else {
		useCount[name] = 1;
	}
};

_Minifier._incr$HNS = _Minifier$_incr$HNS;

function _Minifier$_getArgsAndLocals$LMemberFunctionDefinition$(funcDef) {
	var list;
	list = [];
	funcDef.getArguments$().forEach((function (a) {
		list.push(a);
	}));
	return list.concat(funcDef.getLocals$());
};

_Minifier._getArgsAndLocals$LMemberFunctionDefinition$ = _Minifier$_getArgsAndLocals$LMemberFunctionDefinition$;

function _Minifier$minifyJavaScript$S(src) {
	var esprima;
	var esmangle;
	var escodegen;
	var ast;
	esprima = eval("require('esprima')");
	esmangle = eval("require('esmangle')");
	escodegen = eval("require('escodegen')");
	ast = esprima["parse"](src);
	ast = esmangle["mangle"](ast, ({ destructive: true }));
	return escodegen["generate"](ast, ({ format: ({ renumber: true, hexadecimal: true, escapeless: true, compact: true, semicolons: false, parentheses: false }), directive: true })) + "";
};

_Minifier.minifyJavaScript$S = _Minifier$minifyJavaScript$S;

function _StatementEmitter(emitter) {
	this._emitter = emitter;
};

$__jsx_extend([_StatementEmitter], Object);
_StatementEmitter.prototype.emitLabelOfStatement$LLabellableStatement$ = function (statement) {
	var label;
	label = statement.getLabel$();
	if (label != null) {
		this._emitter._reduceIndent$();
		this._emitter._emit$SLToken$(label.getValue$() + ":\n", label);
		this._emitter._advanceIndent$();
	}
};


function _ConstructorInvocationStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ConstructorInvocationStatementEmitter], _StatementEmitter);
_ConstructorInvocationStatementEmitter.prototype.emit$ = function () {
	var ctorType;
	var argTypes;
	var ctorName;
	var token;
	ctorType = this._statement.getConstructorType$();
	argTypes = (ctorType != null ? ctorType.getArgumentTypes$() : []);
	ctorName = this._emitter.getNamer$().getNameOfConstructor$LClassDefinition$ALType$(this._statement.getConstructingClassDef$(), argTypes);
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


function _ExpressionStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ExpressionStatementEmitter], _StatementEmitter);
_ExpressionStatementEmitter.prototype.emit$ = function () {
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};


function _FunctionStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_FunctionStatementEmitter], _StatementEmitter);
_FunctionStatementEmitter.prototype.emit$ = function () {
	var $this = this;
	var funcDef;
	funcDef = this._statement.getFuncDef$();
	this._emitter._emit$SLToken$("function " + this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(funcDef.getFuncLocal$()) + "(", funcDef.getToken$());
	this._emitter.getNamer$().enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
		var args;
		var i;
		args = funcDef.getArguments$();
		for (i = 0; i < args.length; ++ i) {
			if (i !== 0) {
				$this._emitter._emit$SLToken$(", ", funcDef.getToken$());
			}
			$this._emitter._emit$SLToken$($this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(args[i]), funcDef.getToken$());
		}
		$this._emitter._emit$SLToken$(") {\n", funcDef.getToken$());
		$this._emitter._advanceIndent$();
		$this._emitter._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
		$this._emitter._reduceIndent$();
		$this._emitter._emit$SLToken$("}\n", funcDef.getToken$());
	}));
};


function _ReturnStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ReturnStatementEmitter], _StatementEmitter);
_ReturnStatementEmitter.prototype.emit$ = function () {
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


function _DeleteStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_DeleteStatementEmitter], _StatementEmitter);
_DeleteStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("delete ", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};


function _BreakStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_BreakStatementEmitter], _StatementEmitter);
_BreakStatementEmitter.prototype.emit$ = function () {
	if (this._statement.getLabel$() != null) {
		this._emitter._emit$SLToken$("break " + this._statement.getLabel$().getValue$() + ";\n", this._statement.getToken$());
	} else {
		this._emitter._emit$SLToken$("break;\n", this._statement.getToken$());
	}
};


function _ContinueStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ContinueStatementEmitter], _StatementEmitter);
_ContinueStatementEmitter.prototype.emit$ = function () {
	if (this._statement.getLabel$() != null) {
		this._emitter._emit$SLToken$("continue " + this._statement.getLabel$().getValue$() + ";\n", this._statement.getToken$());
	} else {
		this._emitter._emit$SLToken$("continue;\n", this._statement.getToken$());
	}
};


function _DoWhileStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_DoWhileStatementEmitter], _StatementEmitter);
_DoWhileStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("do {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("} while (", null);
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(");\n", null);
};


function _ForInStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ForInStatementEmitter], _StatementEmitter);
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


function _ForStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ForStatementEmitter], _StatementEmitter);
_ForStatementEmitter.prototype.emit$ = function () {
	var initExpr;
	var condExpr;
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


function _IfStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_IfStatementEmitter], _StatementEmitter);
_IfStatementEmitter.prototype.emit$ = function () {
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


function _SwitchStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_SwitchStatementEmitter], _StatementEmitter);
_SwitchStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("switch (", this._statement.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._statement.getExpr$(), 0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};


function _CaseStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_CaseStatementEmitter], _StatementEmitter);
_CaseStatementEmitter.prototype.emit$ = function () {
	this._emitter._reduceIndent$();
	this._emitter._emit$SLToken$("case ", null);
	this._emitter._emitWithNullableGuard$LExpression$N(this._statement.getExpr$(), 0);
	this._emitter._emit$SLToken$(":\n", null);
	this._emitter._advanceIndent$();
};


function _DefaultStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_DefaultStatementEmitter], _StatementEmitter);
_DefaultStatementEmitter.prototype.emit$ = function () {
	this._emitter._reduceIndent$();
	this._emitter._emit$SLToken$("default:\n", null);
	this._emitter._advanceIndent$();
};


function _WhileStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_WhileStatementEmitter], _StatementEmitter);
_WhileStatementEmitter.prototype.emit$ = function () {
	this.emitLabelOfStatement$LLabellableStatement$(this._statement);
	this._emitter._emit$SLToken$("while (", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(") {\n", null);
	this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
	this._emitter._emit$SLToken$("}\n", null);
};


function _TryStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_TryStatementEmitter], _StatementEmitter);
_TryStatementEmitter.prototype.emit$ = function () {
	var $this = this;
	var catchStatements;
	var finallyStatements;
	this._emitter._emit$SLToken$("try {\n", this._statement.getToken$());
	this._emitter._emitStatements$ALStatement$(this._statement.getTryStatements$());
	this._emitter._emit$SLToken$("}", null);
	catchStatements = this._statement.getCatchStatements$();
	if (catchStatements.length !== 0) {
		this._emitter.getNamer$().enterCatch$LTryStatement$F$F$S$V$(this._statement, (function (getCatchName) {
			$this._emitter._emit$SLToken$(" catch (" + getCatchName() + ") {\n", null);
			if ($this._emitter._enableProfiler) {
				$this._emitter._advanceIndent$();
				$this._emitter._emit$SLToken$("$__jsx_profiler.resume($__jsx_profiler_ctx);\n", null);
				$this._emitter._reduceIndent$();
			}
			$this._emitter._emitStatements$ALStatement$(catchStatements.map((function (s) {
				return s;
			})));
			if (! catchStatements[catchStatements.length - 1].getLocal$().getType$().equals$LType$(Type.variantType)) {
				$this._emitter._advanceIndent$();
				$this._emitter._emit$SLToken$("{\n", null);
				$this._emitter._advanceIndent$();
				$this._emitter._emit$SLToken$("throw " + getCatchName() + ";\n", null);
				$this._emitter._reduceIndent$();
				$this._emitter._emit$SLToken$("}\n", null);
				$this._emitter._reduceIndent$();
			}
			$this._emitter._emit$SLToken$("}", null);
		}));
	}
	finallyStatements = this._statement.getFinallyStatements$();
	if (finallyStatements.length !== 0 || catchStatements.length === 0) {
		this._emitter._emit$SLToken$(" finally {\n", null);
		this._emitter._emitStatements$ALStatement$(finallyStatements);
		this._emitter._emit$SLToken$("}", null);
	}
	this._emitter._emit$SLToken$("\n", null);
};


function _CatchStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_CatchStatementEmitter], _StatementEmitter);
_CatchStatementEmitter.prototype.emit$ = function () {
	var localType;
	localType = this._statement.getLocal$().getType$();
	if (localType instanceof ObjectType) {
		this._emitter._emit$SLToken$("if (" + this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(this._statement.getLocal$()) + " instanceof " + this._emitter.getNamer$().getNameOfClass$LClassDefinition$(localType.getClassDef$()) + ") {\n", this._statement.getToken$());
		this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
		this._emitter._emit$SLToken$("} else ", null);
	} else {
		this._emitter._emit$SLToken$("{\n", null);
		this._emitter._emitStatements$ALStatement$(this._statement.getStatements$());
		this._emitter._emit$SLToken$("}\n", null);
	}
};


function _ThrowStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_ThrowStatementEmitter], _StatementEmitter);
_ThrowStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("throw ", this._statement.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getExpr$()).emit$N(0);
	this._emitter._emit$SLToken$(";\n", null);
};


function _AssertStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_AssertStatementEmitter], _StatementEmitter);
_AssertStatementEmitter.prototype.emit$ = function () {
	var $this = this;
	var condExpr;
	condExpr = this._statement._expr;
	this._emitter._emitAssertion$F$V$LToken$S((function () {
		$this._emitter._getExpressionEmitterFor$LExpression$(condExpr).emit$N(0);
	}), condExpr.getToken$(), "assertion failure");
};


function _LogStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_LogStatementEmitter], _StatementEmitter);
_LogStatementEmitter.prototype.emit$ = function () {
	var exprs;
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


function _DebuggerStatementEmitter(emitter, statement) {
	_StatementEmitter.call(this, emitter);
	this._statement = statement;
};

$__jsx_extend([_DebuggerStatementEmitter], _StatementEmitter);
_DebuggerStatementEmitter.prototype.emit$ = function () {
	this._emitter._emit$SLToken$("debugger;\n", this._statement.getToken$());
};


function _ExpressionEmitter(emitter) {
	this._emitter = emitter;
};

$__jsx_extend([_ExpressionEmitter], Object);
_ExpressionEmitter.prototype.emitWithPrecedence$NNF$V$ = function (outerOpPrecedence, precedence, callback) {
	if (precedence > outerOpPrecedence) {
		this._emitter._emit$SLToken$("(", null);
		callback();
		this._emitter._emit$SLToken$(")", null);
	} else {
		callback();
	}
};


function _LocalExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_LocalExpressionEmitter], _ExpressionEmitter);
_LocalExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var local;
	local = this._expr.getLocal$();
	this._emitter._emit$SLToken$(this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(local), this._expr.getToken$());
};


function _ClassExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ClassExpressionEmitter], _ExpressionEmitter);
_ClassExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var type;
	type = this._expr.getType$();
	this._emitter._emit$SLToken$(this._emitter.getNamer$().getNameOfClass$LClassDefinition$(type.getClassDef$()), null);
};


function _NullExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_NullExpressionEmitter], _ExpressionEmitter);
_NullExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$("null", token);
};


function _BooleanLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_BooleanLiteralExpressionEmitter], _ExpressionEmitter);
_BooleanLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};


function _IntegerLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_IntegerLiteralExpressionEmitter], _ExpressionEmitter);
_IntegerLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$("" + token.getValue$(), token);
};


function _NumberLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_NumberLiteralExpressionEmitter], _ExpressionEmitter);
_NumberLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	var str;
	token = this._expr.getToken$();
	str = token.getValue$();
	if (outerOpPrecedence === _PropertyExpressionEmitter._operatorPrecedence && str.indexOf(".") === - 1) {
		this._emitter._emit$SLToken$("(" + str + ")", token);
	} else {
		this._emitter._emit$SLToken$("" + str, token);
	}
};


function _StringLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_StringLiteralExpressionEmitter], _ExpressionEmitter);
_StringLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};


function _RegExpLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_RegExpLiteralExpressionEmitter], _ExpressionEmitter);
_RegExpLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var token;
	token = this._expr.getToken$();
	this._emitter._emit$SLToken$(token.getValue$(), token);
};


function _ArrayLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ArrayLiteralExpressionEmitter], _ExpressionEmitter);
_ArrayLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var exprs;
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


function _MapLiteralExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_MapLiteralExpressionEmitter], _ExpressionEmitter);
_MapLiteralExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var elements;
	var i;
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


function _ThisExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ThisExpressionEmitter], _ExpressionEmitter);
_ThisExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var emittingFunction;
	emittingFunction = this._emitter._emittingFunction;
	if ((emittingFunction.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		this._emitter._emit$SLToken$("$this", this._expr.getToken$());
	} else {
		this._emitter._emit$SLToken$("this", this._expr.getToken$());
	}
};


function _AsExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_AsExpressionEmitter], _ExpressionEmitter);
_AsExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var srcType;
	var destType;
	var prec;
	srcType = this._expr.getExpr$().getType$();
	destType = this._expr.getType$();
	if (srcType instanceof ObjectType || srcType.equals$LType$(Type.variantType)) {
		if (srcType.isConvertibleTo$LType$(destType)) {
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(outerOpPrecedence);
			return;
		}
		if (destType instanceof ObjectType || destType instanceof FunctionType) {
			new _AsNoConvertExpressionEmitter(this._emitter, new AsNoConvertExpression(this._expr.getToken$(), this._expr.getExpr$(), this._expr.getType$())).emit$N(outerOpPrecedence);
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


function _AsNoConvertExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_AsNoConvertExpressionEmitter], _ExpressionEmitter);
_AsNoConvertExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var emitWithAssertion;
	var srcType;
	var destType;
	var destClassDef;
	if (this._emitter._enableRunTimeTypeCheck) {
		emitWithAssertion = (function (emitCheckExpr, message) {
			var token;
			token = $this._expr.getToken$();
			$this._emitter._emit$SLToken$("(function ($v) {\n", token);
			$this._emitter._advanceIndent$();
			$this._emitter._emitAssertion$F$V$LToken$S(emitCheckExpr, token, message);
			$this._emitter._emit$SLToken$("return $v;\n", token);
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
							$this._emitter._emit$SLToken$("typeof $v === \"boolean\"", $this._expr.getToken$());
						}), "detected invalid cast, value is not a boolean");
						return;
					} else {
						if (destType.resolveIfNullable$().equals$LType$(Type.booleanType)) {
							emitWithAssertion((function () {
								$this._emitter._emit$SLToken$("$v == null || typeof $v === \"boolean\"", $this._expr.getToken$());
							}), "detected invalid cast, value is not a boolean nor null");
							return;
						} else {
							if (destType.equals$LType$(Type.numberType)) {
								emitWithAssertion((function () {
									$this._emitter._emit$SLToken$("typeof $v === \"number\"", $this._expr.getToken$());
								}), "detected invalid cast, value is not a number");
								return;
							} else {
								if (destType.resolveIfNullable$().equals$LType$(Type.numberType)) {
									emitWithAssertion((function () {
										$this._emitter._emit$SLToken$("$v == null || typeof $v === \"number\"", $this._expr.getToken$());
									}), "detected invalid cast, value is not a number nor nullable");
									return;
								} else {
									if (destType.equals$LType$(Type.integerType)) {
										emitWithAssertion((function () {
											$this._emitter._emit$SLToken$("typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", $this._expr.getToken$());
										}), "detected invalid cast, value is not an int");
										return;
									} else {
										if (destType.resolveIfNullable$().equals$LType$(Type.integerType)) {
											emitWithAssertion((function () {
												$this._emitter._emit$SLToken$("$v == null || typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", $this._expr.getToken$());
											}), "detected invalid cast, value is not an int nor null");
											return;
										} else {
											if (destType.equals$LType$(Type.stringType)) {
												emitWithAssertion((function () {
													$this._emitter._emit$SLToken$("typeof $v === \"string\"", $this._expr.getToken$());
												}), "detected invalid cast, value is not a string");
												return;
											} else {
												if (destType.resolveIfNullable$().equals$LType$(Type.stringType)) {
													emitWithAssertion((function () {
														$this._emitter._emit$SLToken$("$v == null || typeof $v === \"string\"", $this._expr.getToken$());
													}), "detected invalid cast, value is not a string nor null");
													return;
												} else {
													if (destType instanceof FunctionType) {
														emitWithAssertion((function () {
															$this._emitter._emit$SLToken$("$v == null || typeof $v === \"function\"", $this._expr.getToken$());
														}), "detected invalid cast, value is not a function or null");
														return;
													} else {
														if (destType instanceof ObjectType) {
															destClassDef = destType.getClassDef$();
															if ((destClassDef.flags$() & ClassDefinition.IS_FAKE) !== 0) {
															} else {
																if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName$() === "Array") {
																	emitWithAssertion((function () {
																		$this._emitter._emit$SLToken$("$v == null || $v instanceof Array", $this._expr.getToken$());
																	}), "detected invalid cast, value is not an Array or null");
																	return;
																} else {
																	if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName$() === "Map") {
																		if (srcType.equals$LType$(Type.variantType)) {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"object\" || typeof $v === \"function\"", $this._expr.getToken$());
																			}), "detected invalid cast, value is not a Map or null");
																		} else {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"object\"", $this._expr.getToken$());
																			}), "detected invalid cast, value is not a Map or null");
																		}
																		return;
																	} else {
																		if ((destClassDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("$v == null || $v instanceof " + $this._emitter.getNamer$().getNameOfClass$LClassDefinition$(destClassDef), $this._expr.getToken$());
																			}), "detected invalid cast, value is not an instance of the designated type or null");
																			return;
																		} else {
																			emitWithAssertion((function () {
																				$this._emitter._emit$SLToken$("$v == null || $v.$__jsx_implements_" + $this._emitter.getNamer$().getNameOfClass$LClassDefinition$(destClassDef), $this._expr.getToken$());
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


function _OperatorExpressionEmitter(emitter) {
	_ExpressionEmitter.call(this, emitter);
};

$__jsx_extend([_OperatorExpressionEmitter], _ExpressionEmitter);
_OperatorExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	this.emitWithPrecedence$NNF$V$(outerOpPrecedence, this._getPrecedence$(), (function () {
		$this._emit$();
	}));
};


_OperatorExpressionEmitter.prototype._emit$ = function () {
};


function _UnaryExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_UnaryExpressionEmitter], _OperatorExpressionEmitter);
_UnaryExpressionEmitter.prototype._emit$ = function () {
	var opToken;
	opToken = this._expr.getToken$();
	this._emitter._emit$SLToken$(opToken.getValue$() + " ", opToken);
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(this._getPrecedence$());
};


_UnaryExpressionEmitter.prototype._getPrecedence$ = function () {
	return _UnaryExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _UnaryExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_UnaryExpressionEmitter._operatorPrecedence[op] = precedence;
};

_UnaryExpressionEmitter._setOperatorPrecedence$SN = _UnaryExpressionEmitter$_setOperatorPrecedence$SN;

function _PostfixExpressionEmitter(emitter, expr) {
	_UnaryExpressionEmitter.call(this, emitter, expr);
};

$__jsx_extend([_PostfixExpressionEmitter], _UnaryExpressionEmitter);
_PostfixExpressionEmitter.prototype._emit$ = function () {
	var opToken;
	opToken = this._expr.getToken$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(this._getPrecedence$());
	this._emitter._emit$SLToken$(opToken.getValue$(), opToken);
};


_PostfixExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PostfixExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _PostfixExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_PostfixExpressionEmitter._operatorPrecedence[op] = precedence;
};

_PostfixExpressionEmitter._setOperatorPrecedence$SN = _PostfixExpressionEmitter$_setOperatorPrecedence$SN;

function _InstanceofExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_InstanceofExpressionEmitter], _ExpressionEmitter);
_InstanceofExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var expectedType;
	expectedType = this._expr.getExpectedType$();
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
					$this._emitter._emit$SLToken$("(function (o) { return !! (o && o.$__jsx_implements_" + $this._emitter.getNamer$().getNameOfClass$LClassDefinition$(expectedType.getClassDef$()) + "); })(", $this._expr.getToken$());
					$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(0);
					$this._emitter._emit$SLToken$(")", $this._expr.getToken$());
				}));
			}
		}
	}
};


_InstanceofExpressionEmitter.prototype.getInstanceofNameFromClassDef$LClassDefinition$ = function (classDef) {
	var name;
	if (classDef instanceof InstantiatedClassDefinition) {
		name = classDef.getTemplateClassName$();
		if (name === "Map") {
			name = "Object";
		}
	} else {
		name = this._emitter.getNamer$().getNameOfClass$LClassDefinition$(classDef);
	}
	return name;
};


function _InstanceofExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_InstanceofExpressionEmitter._operatorPrecedence = precedence;
};

_InstanceofExpressionEmitter._setOperatorPrecedence$SN = _InstanceofExpressionEmitter$_setOperatorPrecedence$SN;

function _PropertyExpressionEmitter(emitter, expr) {
	_UnaryExpressionEmitter.call(this, emitter, expr);
};

$__jsx_extend([_PropertyExpressionEmitter], _UnaryExpressionEmitter);
_PropertyExpressionEmitter.prototype._emit$ = function () {
	var expr;
	var exprType;
	var identifierToken;
	var classDef;
	var name;
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
	classDef = expr.getHolderType$().getClassDef$();
	if (expr.getExpr$() instanceof ClassExpression) {
		name = identifierToken.getValue$();
		if (Util$isReferringToFunctionDefinition$LPropertyExpression$(expr)) {
			name = this._emitter.getNamer$().getNameOfStaticFunction$LClassDefinition$SALType$(classDef, name, exprType.getArgumentTypes$());
		} else {
			name = this._emitter.getNamer$().getNameOfClass$LClassDefinition$(classDef) + "." + this._emitter.getNamer$().getNameOfStaticVariable$LClassDefinition$S(classDef, name);
		}
		this._emitter._emit$SLToken$(name, identifierToken);
	} else {
		name = identifierToken.getValue$();
		if (Util$isReferringToFunctionDefinition$LPropertyExpression$(expr)) {
			name = this._emitter.getNamer$().getNameOfMethod$LClassDefinition$SALType$(classDef, name, exprType.getArgumentTypes$());
		} else {
			name = this._emitter.getNamer$().getNameOfProperty$LClassDefinition$S(classDef, name);
		}
		this._emitter._getExpressionEmitterFor$LExpression$(expr.getExpr$()).emit$N(this._getPrecedence$());
		this._emitter._emit$SLToken$("." + name, identifierToken);
	}
};


_PropertyExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PropertyExpressionEmitter._operatorPrecedence;
};


function _PropertyExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_PropertyExpressionEmitter._operatorPrecedence = precedence;
};

_PropertyExpressionEmitter._setOperatorPrecedence$SN = _PropertyExpressionEmitter$_setOperatorPrecedence$SN;

function _FunctionExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_FunctionExpressionEmitter], _OperatorExpressionEmitter);
_FunctionExpressionEmitter.prototype._emit$ = function () {
	var $this = this;
	var funcDef;
	var funcLocal;
	funcDef = this._expr.getFuncDef$();
	this._emitter._emit$SLToken$("(", funcDef.getToken$());
	funcLocal = funcDef.getFuncLocal$();
	this._emitter.getNamer$().enterScope$LLocalVariable$F$V$(funcLocal, (function () {
		$this._emitter._emit$SLToken$("function " + (funcLocal != null ? $this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(funcLocal) : "") + "(", funcDef.getToken$());
		$this._emitter.getNamer$().enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
			var args;
			var i;
			args = funcDef.getArguments$();
			for (i = 0; i < args.length; ++ i) {
				if (i !== 0) {
					$this._emitter._emit$SLToken$(", ", funcDef.getToken$());
				}
				$this._emitter._emit$SLToken$($this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(args[i]), funcDef.getToken$());
			}
			$this._emitter._emit$SLToken$(") {\n", funcDef.getToken$());
			$this._emitter._advanceIndent$();
			$this._emitter._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
			$this._emitter._reduceIndent$();
			$this._emitter._emit$SLToken$("}", funcDef.getToken$());
		}));
	}));
	this._emitter._emit$SLToken$(")", funcDef.getToken$());
};


_FunctionExpressionEmitter.prototype._getPrecedence$ = function () {
	return _FunctionExpressionEmitter._operatorPrecedence;
};


function _FunctionExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_FunctionExpressionEmitter._operatorPrecedence = precedence;
};

_FunctionExpressionEmitter._setOperatorPrecedence$SN = _FunctionExpressionEmitter$_setOperatorPrecedence$SN;

function _AdditiveExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_AdditiveExpressionEmitter], _OperatorExpressionEmitter);
_AdditiveExpressionEmitter.prototype._emit$ = function () {
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _AdditiveExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(" + ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _AdditiveExpressionEmitter._operatorPrecedence - 1);
};


_AdditiveExpressionEmitter.prototype._getPrecedence$ = function () {
	return _AdditiveExpressionEmitter._operatorPrecedence;
};


function _AdditiveExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_AdditiveExpressionEmitter._operatorPrecedence = precedence;
};

_AdditiveExpressionEmitter._setOperatorPrecedence$SN = _AdditiveExpressionEmitter$_setOperatorPrecedence$SN;

function _AssignmentExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_AssignmentExpressionEmitter], _OperatorExpressionEmitter);
_AssignmentExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	if (this._expr.getToken$().getValue$() === "/=" && this._expr.getFirstExpr$().getType$().resolveIfNullable$().equals$LType$(Type.integerType)) {
		this._emitDivAssignToInt$N(outerOpPrecedence);
		return;
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};


_AssignmentExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitRHSOfAssignment$LExpression$LType$(this._expr.getSecondExpr$(), this._expr.getFirstExpr$().getType$());
};


_AssignmentExpressionEmitter.prototype._emitDivAssignToInt$N = function (outerOpPrecedence) {
	var $this = this;
	var firstExpr;
	var secondExpr;
	var propertyExpr;
	var name;
	var classDef;
	firstExpr = this._expr.getFirstExpr$();
	secondExpr = this._expr.getSecondExpr$();
	if (firstExpr instanceof PropertyExpression || firstExpr instanceof ArrayExpression) {
		this._emitter._emit$SLToken$("$__jsx_div_assign(", this._expr.getToken$());
		if (firstExpr instanceof PropertyExpression) {
			propertyExpr = firstExpr;
			this._emitter._getExpressionEmitterFor$LExpression$(propertyExpr.getExpr$()).emit$N(0);
			this._emitter._emit$SLToken$(", ", this._expr.getToken$());
			if (propertyExpr.getExpr$() instanceof ClassExpression) {
				classDef = propertyExpr.getHolderType$().getClassDef$();
				name = this._emitter.getNamer$().getNameOfClass$LClassDefinition$(classDef) + "." + this._emitter.getNamer$().getNameOfStaticVariable$LClassDefinition$S(classDef, propertyExpr.getIdentifierToken$().getValue$());
			} else {
				name = this._emitter.getNamer$().getNameOfProperty$LClassDefinition$S(propertyExpr.getHolderType$().getClassDef$(), propertyExpr.getIdentifierToken$().getValue$());
			}
			this._emitter._emit$SLToken$(Util$encodeStringLiteral$S(name), propertyExpr.getIdentifierToken$());
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


_AssignmentExpressionEmitter.prototype._getPrecedence$ = function () {
	return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
};

_AssignmentExpressionEmitter._setOperatorPrecedence$SN = _AssignmentExpressionEmitter$_setOperatorPrecedence$SN;

function _EqualityExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_EqualityExpressionEmitter], _OperatorExpressionEmitter);
_EqualityExpressionEmitter.prototype._emit$ = function () {
	var op;
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


_EqualityExpressionEmitter.prototype._getPrecedence$ = function () {
	return _EqualityExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _EqualityExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_EqualityExpressionEmitter._operatorPrecedence[op] = precedence;
};

_EqualityExpressionEmitter._setOperatorPrecedence$SN = _EqualityExpressionEmitter$_setOperatorPrecedence$SN;

function _InExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_InExpressionEmitter], _OperatorExpressionEmitter);
_InExpressionEmitter.prototype._emit$ = function () {
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _InExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(" in ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_InExpressionEmitter._operatorPrecedence);
};


_InExpressionEmitter.prototype._getPrecedence$ = function () {
	return _InExpressionEmitter._operatorPrecedence;
};


function _InExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_InExpressionEmitter._operatorPrecedence = precedence;
};

_InExpressionEmitter._setOperatorPrecedence$SN = _InExpressionEmitter$_setOperatorPrecedence$SN;

function _LogicalExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_LogicalExpressionEmitter], _OperatorExpressionEmitter);
_LogicalExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	if (this._emitter.shouldBooleanize$LExpression$(this._expr)) {
		this._emitter._emit$SLToken$("!! (", this._expr.getToken$());
		_OperatorExpressionEmitter.prototype.emit$N.call(this, 0);
		this._emitter._emit$SLToken$(")", this._expr.getToken$());
		return;
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};


_LogicalExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(_LogicalExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getSecondExpr$()).emit$N(_LogicalExpressionEmitter._operatorPrecedence[op] - 1);
};


_LogicalExpressionEmitter.prototype._getPrecedence$ = function () {
	return _LogicalExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _LogicalExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_LogicalExpressionEmitter._operatorPrecedence[op] = precedence;
};

_LogicalExpressionEmitter._setOperatorPrecedence$SN = _LogicalExpressionEmitter$_setOperatorPrecedence$SN;

function _ShiftExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ShiftExpressionEmitter], _OperatorExpressionEmitter);
_ShiftExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _ShiftExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _ShiftExpressionEmitter._operatorPrecedence[op] - 1);
};


_ShiftExpressionEmitter.prototype._getPrecedence$ = function () {
	return _ShiftExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _ShiftExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_ShiftExpressionEmitter._operatorPrecedence[op] = precedence;
};

_ShiftExpressionEmitter._setOperatorPrecedence$SN = _ShiftExpressionEmitter$_setOperatorPrecedence$SN;

function _BinaryNumberExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_BinaryNumberExpressionEmitter], _OperatorExpressionEmitter);
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


_BinaryNumberExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
};


_BinaryNumberExpressionEmitter.prototype._emitIfEitherIs$NF$LExpression$LExpression$LExpression$$ = function (outerOpPrecedence, cb) {
	var outcomeExpr;
	if ((outcomeExpr = cb(this._expr.getFirstExpr$(), this._expr.getSecondExpr$())) != null || (outcomeExpr = cb(this._expr.getSecondExpr$(), this._expr.getFirstExpr$())) != null) {
		this._emitter._getExpressionEmitterFor$LExpression$(outcomeExpr).emit$N(outerOpPrecedence);
		return true;
	} else {
		return false;
	}
};


_BinaryNumberExpressionEmitter.prototype._getPrecedence$ = function () {
	return _BinaryNumberExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_BinaryNumberExpressionEmitter._operatorPrecedence[op] = precedence;
};

_BinaryNumberExpressionEmitter._setOperatorPrecedence$SN = _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN;

function _ArrayExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ArrayExpressionEmitter], _OperatorExpressionEmitter);
_ArrayExpressionEmitter.prototype._emit$ = function () {
	var secondExpr;
	var emitted;
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


_ArrayExpressionEmitter.prototype._getPrecedence$ = function () {
	return _ArrayExpressionEmitter._operatorPrecedence;
};


function _ArrayExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_ArrayExpressionEmitter._operatorPrecedence = precedence;
};

_ArrayExpressionEmitter._setOperatorPrecedence$SN = _ArrayExpressionEmitter$_setOperatorPrecedence$SN;

function _ConditionalExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_ConditionalExpressionEmitter], _OperatorExpressionEmitter);
_ConditionalExpressionEmitter.prototype._emit$ = function () {
	var precedence;
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


_ConditionalExpressionEmitter.prototype._getPrecedence$ = function () {
	return (this._expr.getIfTrueExpr$() != null ? _ConditionalExpressionEmitter._operatorPrecedence : _LogicalExpressionEmitter._operatorPrecedence["||"]);
};


function _ConditionalExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_ConditionalExpressionEmitter._operatorPrecedence = precedence;
};

_ConditionalExpressionEmitter._setOperatorPrecedence$SN = _ConditionalExpressionEmitter$_setOperatorPrecedence$SN;

function _CallExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_CallExpressionEmitter], _OperatorExpressionEmitter);
_CallExpressionEmitter.prototype._emit$ = function () {
	var calleeExpr;
	if (this._emitSpecial$()) {
		return;
	}
	calleeExpr = this._expr.getExpr$();
	this._emitter._getExpressionEmitterFor$LExpression$(calleeExpr).emit$N(_CallExpressionEmitter._operatorPrecedence);
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "(", this._expr.getArguments$(), this._expr.getExpr$().getType$().resolveIfNullable$().getArgumentTypes$());
};


_CallExpressionEmitter.prototype._getPrecedence$ = function () {
	return _CallExpressionEmitter._operatorPrecedence;
};


function _CallExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_CallExpressionEmitter._operatorPrecedence = precedence;
};

_CallExpressionEmitter._setOperatorPrecedence$SN = _CallExpressionEmitter$_setOperatorPrecedence$SN;

_CallExpressionEmitter.prototype._emitSpecial$ = function () {
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


_CallExpressionEmitter.prototype._emitIfJsEval$LPropertyExpression$ = function (calleeExpr) {
	var classDef;
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


_CallExpressionEmitter.prototype._emitIfJsInvoke$LPropertyExpression$ = function (calleeExpr) {
	var classDef;
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


_CallExpressionEmitter.prototype._emitCallsToMap$LPropertyExpression$ = function (calleeExpr) {
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
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "$__jsx_ObjectToString.call(", [ calleeExpr.getExpr$() ], [ new ObjectType(classDef) ]);
		return true;
	case "hasOwnProperty":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "$__jsx_ObjectHasOwnProperty.call(", [ calleeExpr.getExpr$(), this._expr.getArguments$()[0] ], [ new ObjectType(classDef), Type.stringType ]);
		return true;
	case "keys":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "Object.keys(", [ calleeExpr.getExpr$() ], [ new ObjectType(classDef) ]);
		return true;
	default:
		return false;
	}
};


_CallExpressionEmitter.prototype._emitIfMathAbs$LPropertyExpression$ = function (calleeExpr) {
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


function _CallExpressionEmitter$_calleeIsMathAbs$LPropertyExpression$(calleeExpr) {
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

_CallExpressionEmitter._calleeIsMathAbs$LPropertyExpression$ = _CallExpressionEmitter$_calleeIsMathAbs$LPropertyExpression$;

function _CallExpressionEmitter$mathAbsUsesTemporary$LMemberFunctionDefinition$(funcDef) {
	return ! funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (! statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
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

_CallExpressionEmitter.mathAbsUsesTemporary$LMemberFunctionDefinition$ = _CallExpressionEmitter$mathAbsUsesTemporary$LMemberFunctionDefinition$;

function _SuperExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_SuperExpressionEmitter], _OperatorExpressionEmitter);
_SuperExpressionEmitter.prototype._emit$ = function () {
	var funcType;
	var classDef;
	var methodName;
	var argTypes;
	var mangledFuncName;
	funcType = this._expr.getFunctionType$();
	classDef = funcType.getObjectType$().getClassDef$();
	methodName = this._expr.getName$().getValue$();
	argTypes = funcType.getArgumentTypes$();
	mangledFuncName = this._emitter.getNamer$().getNameOfMethod$LClassDefinition$SALType$(classDef, methodName, argTypes);
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), this._emitter.getNamer$().getNameOfClass$LClassDefinition$(classDef) + ".prototype." + mangledFuncName + ".call(this", this._expr.getArguments$(), argTypes);
};


_SuperExpressionEmitter.prototype._getPrecedence$ = function () {
	return _CallExpressionEmitter._operatorPrecedence;
};


function _SuperExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_SuperExpressionEmitter._operatorPrecedence = precedence;
};

_SuperExpressionEmitter._setOperatorPrecedence$SN = _SuperExpressionEmitter$_setOperatorPrecedence$SN;

function _NewExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_NewExpressionEmitter], _OperatorExpressionEmitter);
_NewExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var getInliner;
	var classDef;
	var ctor;
	var argTypes;
	var callingFuncDef;
	var inliner;
	function getInliner(funcDef) {
		var stash;
		stash = funcDef.getStash$().unclassify;
		return (stash ? stash.inliner : null);
	}
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
				this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "new " + this._emitter.getNamer$().getNameOfConstructor$LClassDefinition$ALType$(classDef, argTypes) + "(", this._expr.getArguments$(), argTypes);
			}
		}
	}
};


_NewExpressionEmitter.prototype._emitAsObjectLiteral$LClassDefinition$ALExpression$ = function (classDef, propertyExprs) {
	var $this = this;
	var propertyIndex;
	this._emitter._emit$SLToken$("({", this._expr.getToken$());
	propertyIndex = 0;
	classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		if ((member.flags$() & ClassDefinition.IS_STATIC) === 0) {
			if (propertyIndex !== 0) {
				$this._emitter._emit$SLToken$(", ", $this._expr.getToken$());
			}
			$this._emitter._emit$SLToken$($this._emitter.getNamer$().getNameOfProperty$LClassDefinition$S(classDef, member.name$()) + ": ", $this._expr.getToken$());
			$this._emitter._getExpressionEmitterFor$LExpression$(propertyExprs[propertyIndex++]).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
		}
		return true;
	}));
	this._emitter._emit$SLToken$("})", this._expr.getToken$());
};


_NewExpressionEmitter.prototype._getPrecedence$ = function () {
	return _NewExpressionEmitter._operatorPrecedence;
};


function _NewExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_NewExpressionEmitter._operatorPrecedence = precedence;
};

_NewExpressionEmitter._setOperatorPrecedence$SN = _NewExpressionEmitter$_setOperatorPrecedence$SN;

function _CommaExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_CommaExpressionEmitter], _ExpressionEmitter);
_CommaExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
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


function _CommaExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_CommaExpressionEmitter._operatorPrecedence = precedence;
};

_CommaExpressionEmitter._setOperatorPrecedence$SN = _CommaExpressionEmitter$_setOperatorPrecedence$SN;

function _BootstrapBuilder() {
	this._emitter = null;
	this._entrySourceFile = "";
	this._executableFor = "";
};

$__jsx_extend([_BootstrapBuilder], Object);
_BootstrapBuilder.prototype.init$LJavaScriptEmitter$SS = function (emitter, entrySourceFile, executableFor) {
	this._emitter = emitter;
	this._entrySourceFile = entrySourceFile;
	this._executableFor = executableFor;
};


_BootstrapBuilder.prototype.addBootstrap$S = function (code) {
	var args;
	var callEntryPoint;
	code += this._emitter._platform.load$S(this._emitter._platform.getRoot$() + "/src/js/launcher.js");
	switch (this._executableFor) {
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
	callEntryPoint = Util$format$SAS("JSX.%1(%2, %3)", [ this._getLauncher$(), JSON.stringify(this._emitter._platform.encodeFilename$S(this._entrySourceFile)), args ]);
	if (this._executableFor === "web") {
		callEntryPoint = this._wrapOnLoad$S(callEntryPoint);
	}
	return code + callEntryPoint + "\n";
};


_BootstrapBuilder.prototype._wrapOnLoad$S = function (code) {
	var wrapper;
	wrapper = this._emitter._platform.load$S(this._emitter._platform.getRoot$() + "/src/js/web-launcher.js");
	return wrapper.replace(/\/\/--CODE--\/\//, code);
};


function _ExecutableBootstrapBuilder() {
	_BootstrapBuilder.call(this);
};

$__jsx_extend([_ExecutableBootstrapBuilder], _BootstrapBuilder);
_ExecutableBootstrapBuilder.prototype._getLauncher$ = function () {
	return "runMain";
};


function _TestBootstrapBuilder() {
	_BootstrapBuilder.call(this);
};

$__jsx_extend([_TestBootstrapBuilder], _BootstrapBuilder);
_TestBootstrapBuilder.prototype._getLauncher$ = function () {
	return "runTests";
};


function Platform() {
	this.fileContent = {};
};

$__jsx_extend([Platform], Object);
Platform.prototype.setFileContent$SS = function (name, content) {
	this.fileContent[name] = content;
};


Platform.prototype.log$S = function (s) {
	console.log(s);
};


Platform.prototype.warn$S = function (s) {
	console.warn(s);
};


Platform.prototype.error$S = function (s) {
	console.error(s);
};


Platform.prototype.encodeFilename$S = function (filename) {
	var rootDir;
	rootDir = this.getRoot$() + "/";
	if (filename.indexOf(rootDir) === 0) {
		filename = "system:" + filename.substring(rootDir.length);
	}
	return filename;
};


function NodePlatform() {
	NodePlatform$0.call(this, node.path.dirname(node.__dirname));
};

function NodePlatform$0(root) {
	Platform.call(this);
	this._cwd = Util$resolvePath$S(process.cwd());
	this._root = Util$resolvePath$S(root);
};

$__jsx_extend([NodePlatform, NodePlatform$0], Platform);
NodePlatform.prototype.getRoot$ = function () {
	return this._root;
};


NodePlatform.prototype._absPath$S = function (path) {
	return (path.charAt(0) === "/" || path.match(/^[a-zA-Z]:\//) ? path : this._cwd + "/" + path);
};


NodePlatform.prototype.fileExists$S = function (name) {
	name = Util$resolvePath$S(name);
	if ($__jsx_ObjectHasOwnProperty.call(this.fileContent, name)) {
		return true;
	}
	return node.fs.existsSync(this._absPath$S(name));
};


NodePlatform.prototype.getFilesInDirectory$S = function (path) {
	return node.fs.readdirSync(this._absPath$S(path));
};


NodePlatform.prototype.load$S = function (name) {
	var fd;
	var content;
	var BUFFER_SIZE;
	var buffer;
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


NodePlatform.prototype.save$USS = function (outputFile, content) {
	if (outputFile == null) {
		process.stdout.write(content);
	} else {
		outputFile = this._absPath$S(outputFile);
		this.mkpath$S(Util$dirname$S(outputFile));
		node.fs.writeFileSync(outputFile, content);
	}
};


NodePlatform.prototype.setWorkingDir$S = function (dir) {
	this._cwd = this._absPath$S(dir);
};


NodePlatform.prototype.mkpath$S = function (path) {
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


NodePlatform.prototype.makeFileExecutable$SS = function (file, runEnv) {
	var filePath;
	var contents;
	if (runEnv === "node") {
		filePath = this._absPath$S(file);
		contents = node.fs.readFileSync(filePath, "utf-8");
		contents = "#!/usr/bin/env node\n" + contents;
		node.fs.writeFileSync(filePath, contents);
		node.fs.chmodSync(this._absPath$S(file), "0755");
	}
};


NodePlatform.prototype.execute$USSAS = function (scriptFile, jsSource, args) {
	var $this = this;
	var jsFile;
	var child;
	jsFile = this._absPath$S(Util$format$SAS(".jsx.%1.%2.%3.js", [ node.path.basename(scriptFile || "-"), process.pid.toString(), Date.now().toString(16) ]));
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


function NodePlatform$getEnvOpts$() {
	var opts;
	opts = process.env.JSX_OPTS;
	if (! opts) {
		return [];
	}
	return opts.split(/\s+/);
};

NodePlatform.getEnvOpts$ = NodePlatform$getEnvOpts$;

NodePlatform.prototype.runCompilationServer$X = function (arg) {
	var port;
	port = arg | 0;
	return CompilationServer$start$LPlatform$I(this, port);
};


function CompilationServerPlatform(root, reqId, req, res) {
	NodePlatform$0.call(this, root);
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

$__jsx_extend([CompilationServerPlatform], NodePlatform);
CompilationServerPlatform.prototype.save$USS = function (outputFile, content) {
	if (outputFile == null) {
		this._stdout += content;
	} else {
		this._file[outputFile] = content;
	}
};


CompilationServerPlatform.prototype.log$S = function (message) {
	this._stdout += message + "\n";
};


CompilationServerPlatform.prototype.warn$S = function (message) {
	this._stderr += message + "\n";
};


CompilationServerPlatform.prototype.error$S = function (message) {
	this._stderr += message + "\n";
};


CompilationServerPlatform.prototype.execute$USSAS = function (jsFile, jsSource, jsArgs) {
	this._scriptFile = jsFile;
	this._scriptSource = jsSource;
	this._scriptArgs = jsArgs;
};


CompilationServerPlatform.prototype.setStatusCode$N = function (statusCode) {
	this._statusCode = statusCode;
};


CompilationServerPlatform.prototype.getContents$ = function () {
	var content;
	content = ({ stdout: this._stdout, stderr: this._stderr, file: this._file, executableFile: this._executableFile, statusCode: this._statusCode });
	if (this._scriptSource != null) {
		content.run = ({ scriptFile: this._scriptFile, scriptSource: this._scriptSource, scriptArgs: this._scriptArgs });
	}
	return content;
};


CompilationServerPlatform.prototype.makeFileExecutable$SS = function (file, runEnv) {
	this._executableFile[file] = runEnv;
};


CompilationServerPlatform.prototype.runCompilationServer$X = function (arg) {
	this.error$S('--compilation-server is not supported');
	return 1;
};


function JSXCommand() {
};

$__jsx_extend([JSXCommand], Object);
function JSXCommand$help$() {
	return "JSX compiler version " + Meta.VERSION_STRING + "\n" + "\n" + "Usage: jsx [options] source-file\n" + "\n" + "Options:\n" + "  --add-search-path path     adds a path to library search paths\n" + "  --executable RUNENV        adds launcher to call _Main.main(:string[]):void\n" + "                             supported RUNENV is node, commonjs and web.\n" + "  --run                      runs _Main.main(:string[]):void after compiling\n" + "  --test                     runs _Test#test*():void after compiling\n" + "  --output file              output file (default:stdout)\n" + "  --input-filename file      names input filename\n" + "  --mode (compile|parse|doc) specifies compilation mode (default:compile)\n" + "  --target (javascript|c++)  specifies target language (default:javascript)\n" + "  --release                  disables run-time type checking and enables optimizations (" + Optimizer$getReleaseOptimizationCommands$().join(",") + ")\n" + "  --profile                  enables the profiler (experimental)\n" + "  --optimize cmd1,cmd2,...   enables optimization commands\n" + "  --warn type1,type2,...     enables warnings (all, deprecated, none)\n" + "  --disable-type-check       disables run-time type checking\n" + "  --minify                   compresses the target JavaScript code\n" + "  --enable-source-map        enables source map debugging info\n" + "  --complete line:column     shows code completion at line:column\n" + "  --version                  displays the version and compiler identifier and exits\n" + "  --version-number           displays the version as number and exits\n" + "  --help                     displays this help and exits\n" + "\n" + "Env:\n" + "  JSX_OPTS   options of jsx(1)\n" + "  JSX_RUNJS  JavaScript engine used by --run and --test\n" + "";
};

JSXCommand.help$ = JSXCommand$help$;

function JSXCommand$main$LPlatform$AS(platform, args) {
	var argIndex;
	var getopt;
	var getoptarg;
	var compiler;
	var tasks;
	var optimizer;
	var completionRequest;
	var emitter;
	var outputFile;
	var inputFilename;
	var executable;
	var setBootstrapMode;
	var runImmediately;
	var optimizeCommands;
	var opt;
	var optarg;
	var switchOpt;
	var mode;
	var sourceFile;
	var err;
	var result;
	var output;
	var map;
	var filename;
	argIndex = 0;
	getopt = (function () {
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
	compiler = new Compiler(platform);
	tasks = [];
	optimizer = null;
	completionRequest = null;
	emitter = null;
	outputFile = null;
	inputFilename = null;
	executable = null;
	setBootstrapMode = (function (sourceFile) {
	});
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
				var a;
				a = optarg.split(/:/);
				return new CompletionRequest(+a[0], +a[1] - 1);
			})();
			compiler.setMode$N(Compiler.MODE_COMPLETE);
			break;
		case "--target":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			switch (optarg) {
			case "javascript":
				emitter = new JavaScriptEmitter(platform);
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
			if (optarg == "release") {
				optimizeCommands = Optimizer$getReleaseOptimizationCommands$();
			} else {
				optimizeCommands = optimizeCommands.concat(optarg.split(","));
			}
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
		case "--warn-error":
			compiler.setWarningAsError$B(true);
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
				break;
			default:
				platform.error$S("unknown executable type (node|web)");
				return 1;
			}
			setBootstrapMode = (function (sourceFile) {
				emitter.setBootstrapMode$NSS(JavaScriptEmitter.BOOTSTRAP_EXECUTABLE, sourceFile, executable);
			});
			executable = optarg;
			break;
		case "--run":
			setBootstrapMode = (function (sourceFile) {
				emitter.setBootstrapMode$NSS(JavaScriptEmitter.BOOTSTRAP_EXECUTABLE, sourceFile, executable);
			});
			executable = executable || "node";
			runImmediately = true;
			break;
		case "--test":
			setBootstrapMode = (function (sourceFile) {
				emitter.setBootstrapMode$NSS(JavaScriptEmitter.BOOTSTRAP_TEST, sourceFile, executable);
			});
			executable = executable || "node";
			runImmediately = true;
			break;
		case "--profile":
			tasks.push((function () {
				emitter.setEnableProfiler$B(true);
			}));
			break;
		case "--minify":
			tasks.push((function () {
				emitter.setEnableMinifier$B(true);
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
		emitter = new JavaScriptEmitter(platform);
	}
	setBootstrapMode(sourceFile);
	compiler.setEmitter$LEmitter$(emitter);
	switch (compiler.getMode$()) {
	case Compiler.MODE_DOC:
		if (outputFile == null) {
			platform.error$S("--output is mandatory for --mode doc");
			return 1;
		}
		if (compiler.compile$()) {
			new DocumentGenerator(compiler, platform.getRoot$() + "/src/doc", outputFile).setResourceFiles$AS([ "style.css" ]).setPathFilter$F$SB$((function (sourcePath) {
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
	optimizer = new Optimizer();
	tasks.forEach((function (proc) {
		proc();
	}));
	if (emitter.getEnableMinifier$() && emitter.getEnableSourceMap$()) {
		platform.error$S("--minify and --source-map cannot be specified at the same time");
		return 1;
	}
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
		return 65;
	}
	output = emitter.getOutput$();
	if (emitter instanceof JavaScriptEmitter) {
		if (! runImmediately || outputFile != null) {
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

JSXCommand.main$LPlatform$AS = JSXCommand$main$LPlatform$AS;

function Meta() {
};

$__jsx_extend([Meta], Object);
function MapLiteralElement(key, expr) {
	this._key = key;
	this._expr = expr;
};

$__jsx_extend([MapLiteralElement], Object);
MapLiteralElement.prototype.getKey$ = function () {
	return this._key;
};


MapLiteralElement.prototype.getExpr$ = function () {
	return this._expr;
};


MapLiteralElement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


MapLiteralElement.prototype.serialize$ = function () {
	return [ this._key.serialize$(), this._expr.serialize$() ];
};


function InstantiationContext(errors, typemap) {
	this.errors = errors;
	this.typemap = typemap;
	this.objectTypesUsed = [];
};

$__jsx_extend([InstantiationContext], Object);
function TemplateInstantiationRequest(token, className, typeArgs) {
	this._token = token;
	this._className = className;
	this._typeArgs = typeArgs;
};

$__jsx_extend([TemplateInstantiationRequest], Object);
TemplateInstantiationRequest.prototype.getToken$ = function () {
	return this._token;
};


TemplateInstantiationRequest.prototype.getClassName$ = function () {
	return this._className;
};


TemplateInstantiationRequest.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


function Block() {
};

$__jsx_extend([Block], Object);
Block.prototype.$__jsx_implements_Block = true;

function BlockContext(localVariableStatuses, block) {
	this.localVariableStatuses = localVariableStatuses;
	this.block = block;
};

$__jsx_extend([BlockContext], Object);
function AnalysisContext(errors, parser, postInstantiationCallback) {
	this.errors = errors;
	this.parser = parser;
	this.postInstantiationCallback = postInstantiationCallback;
	this.funcDef = null;
	this.blockStack = null;
	this.statement = null;
};

$__jsx_extend([AnalysisContext], Object);
AnalysisContext.prototype.clone$ = function () {
	return new AnalysisContext(this.errors, this.parser, this.postInstantiationCallback).setFuncDef$LMemberFunctionDefinition$(this.funcDef);
};


AnalysisContext.prototype.setFuncDef$LMemberFunctionDefinition$ = function (funcDef) {
	this.funcDef = funcDef;
	return this;
};


AnalysisContext.prototype.setBlockStack$ALBlockContext$ = function (stack) {
	this.blockStack = stack;
	return this;
};


AnalysisContext.prototype.getTopBlock$ = function () {
	return this.blockStack[this.blockStack.length - 1];
};


function Stash() {
};

$__jsx_extend([Stash], Object);
function _JSEmitterStash() {
	Stash.call(this);
	this.shouldBooleanize = false;
	this.returnsBoolean = false;
};

$__jsx_extend([_JSEmitterStash], Stash);
_JSEmitterStash.prototype.clone$ = function () {
	throw new Error("logic flaw");
};


function Stashable() {
	this._stash = {};
};

$__jsx_extend([Stashable], Object);
Stashable.prototype.$__jsx_implements_Stashable = true;

Stashable.prototype.getStash$ = function () {
	return this._stash;
};


function Statement() {
	Stashable.call(this);
};

$__jsx_extend([Statement], Object);
$__jsx_merge_interface(Statement, Stashable);

Statement.prototype.analyze$LAnalysisContext$ = function (context) {
	var token;
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
};


Statement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return true;
};


Statement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	return true;
};


Statement.prototype.forEachExpression$F$LExpression$B$ = function (cb) {
	var $this = this;
	return this.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, _) {
		return cb(expr);
	}));
};


Statement.prototype._analyzeExpr$LAnalysisContext$LExpression$ = function (context, expr) {
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


function Statement$assertIsReachable$LAnalysisContext$LToken$(context, token) {
	if (! context.getTopBlock$().localVariableStatuses.isReachable$()) {
		context.errors.push(new CompileWarning(token, "the code is unreachable"));
	}
	return true;
};

Statement.assertIsReachable$LAnalysisContext$LToken$ = Statement$assertIsReachable$LAnalysisContext$LToken$;

function LabelStatement(name) {
	Statement.call(this);
	this._name = name;
};

$__jsx_extend([LabelStatement], Statement);
LabelStatement.prototype.getName$ = function () {
	return this._name;
};


LabelStatement.prototype.getToken$ = function () {
	return null;
};


LabelStatement.prototype.clone$ = function () {
	return new LabelStatement(this._name);
};


LabelStatement.prototype.serialize$ = function () {
	return null;
};


LabelStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	return true;
};


LabelStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function GotoStatement(label) {
	Statement.call(this);
	this.label = label;
};

$__jsx_extend([GotoStatement], Statement);
GotoStatement.prototype.getLabel$ = function () {
	return this.label;
};


GotoStatement.prototype.getToken$ = function () {
	return null;
};


GotoStatement.prototype.clone$ = function () {
	return new GotoStatement(this.label);
};


GotoStatement.prototype.serialize$ = function () {
	return null;
};


GotoStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	return true;
};


GotoStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function InformationStatement(token) {
	Statement.call(this);
	this._token = token;
};

$__jsx_extend([InformationStatement], Statement);
InformationStatement.prototype.getToken$ = function () {
	return this._token;
};


function DebuggerStatement(token) {
	InformationStatement.call(this, token);
};

$__jsx_extend([DebuggerStatement], InformationStatement);
DebuggerStatement.prototype.clone$ = function () {
	return new DebuggerStatement(this._token);
};


DebuggerStatement.prototype.serialize$ = function () {
	return [ "DebuggerStatement", this._token.serialize$() ];
};


DebuggerStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	return true;
};


DebuggerStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function LogStatement(token, exprs) {
	InformationStatement.call(this, token);
	this._exprs = exprs;
};

$__jsx_extend([LogStatement], InformationStatement);
LogStatement.prototype.clone$ = function () {
	return new LogStatement(this._token, Cloner$Expression$E$cloneArray$ALExpression$(this._exprs));
};


LogStatement.prototype.getExprs$ = function () {
	return this._exprs;
};


LogStatement.prototype.serialize$ = function () {
	return [ "LogStatement", this._token.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._exprs) ];
};


LogStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var i;
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
			context.errors.push(new CompileError(this._token, "cannot log a void expression"));
			break;
		}
	}
	return true;
};


LogStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._exprs);
};


function AssertStatement(token, expr) {
	InformationStatement.call(this, token);
	this._expr = expr;
};

$__jsx_extend([AssertStatement], InformationStatement);
AssertStatement.prototype.clone$ = function () {
	return new AssertStatement(this._token, this._expr.clone$());
};


AssertStatement.prototype.getExpr$ = function () {
	return this._expr;
};


AssertStatement.prototype.serialize$ = function () {
	return [ "AssertStatement", this._token.serialize$(), Serializer$Expression$E$serializeNullable$LExpression$(this._expr) ];
};


AssertStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var exprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	exprType = this._expr.getType$();
	if (exprType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._expr.getToken$(), "argument of the assert statement cannot be void"));
	}
	return true;
};


AssertStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function ThrowStatement(token, expr) {
	Statement.call(this);
	this._token = token;
	this._expr = expr;
};

$__jsx_extend([ThrowStatement], Statement);
ThrowStatement.prototype.clone$ = function () {
	return new ThrowStatement(this._token, this._expr.clone$());
};


ThrowStatement.prototype.getToken$ = function () {
	return this._token;
};


ThrowStatement.prototype.getExpr$ = function () {
	return this._expr;
};


ThrowStatement.prototype.serialize$ = function () {
	return [ "ThrowStatement", this._token.serialize$(), this._expr.serialize$() ];
};


ThrowStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var errorClassDef;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	errorClassDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, "Error");
	if (errorClassDef == null) {
		throw new Error("could not find definition for Error");
	}
	if (this._expr.getType$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "cannot throw 'void'"));
		return true;
	}
	context.getTopBlock$().localVariableStatuses.setIsReachable$B(false);
	return true;
};


ThrowStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function CatchStatement(token, local, statements) {
	Statement.call(this);
	Block.call(this);
	this._token = token;
	this._local = local;
	this._statements = statements;
};

$__jsx_extend([CatchStatement], Statement);
$__jsx_merge_interface(CatchStatement, Block);

CatchStatement.prototype.clone$ = function () {
	return new CatchStatement(this._token, this._local.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


CatchStatement.prototype.getToken$ = function () {
	return this._token;
};


CatchStatement.prototype.getLocal$ = function () {
	return this._local;
};


CatchStatement.prototype.setLocal$LCaughtVariable$ = function (local) {
	this._local = local;
};


CatchStatement.prototype.getStatements$ = function () {
	return this._statements;
};


CatchStatement.prototype.serialize$ = function () {
	return [ "CatchStatement", this._token.serialize$(), this._local.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ];
};


CatchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var catchType;
	var i;
	catchType = this.getLocal$().getType$();
	if (! (catchType instanceof ObjectType || catchType.equals$LType$(Type.variantType))) {
		context.errors.push(new CompileError(this._token, "only objects or a variant may be caught"));
	}
	for (i = 0; i < this._statements.length; ++ i) {
		if (! this._statements[i].analyze$LAnalysisContext$(context)) {
			return false;
		}
	}
	return true;
};


CatchStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements);
};


CatchStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	return cb(this._statements);
};


CatchStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function TryStatement(token, tryStatements, catchStatements, finallyStatements) {
	Statement.call(this);
	Block.call(this);
	this._token = token;
	this._tryStatements = tryStatements;
	this._catchStatements = catchStatements;
	this._finallyStatements = finallyStatements;
};

$__jsx_extend([TryStatement], Statement);
$__jsx_merge_interface(TryStatement, Block);

TryStatement.prototype.clone$ = function () {
	return new TryStatement(this._token, Cloner$Statement$E$cloneArray$ALStatement$(this._tryStatements), Cloner$CatchStatement$E$cloneArray$ALCatchStatement$(this._catchStatements), Cloner$Statement$E$cloneArray$ALStatement$(this._finallyStatements));
};


TryStatement.prototype.getToken$ = function () {
	return this._token;
};


TryStatement.prototype.getTryStatements$ = function () {
	return this._tryStatements;
};


TryStatement.prototype.getCatchStatements$ = function () {
	return this._catchStatements;
};


TryStatement.prototype.getFinallyStatements$ = function () {
	return this._finallyStatements;
};


TryStatement.prototype.serialize$ = function () {
	return [ "TryStatement", Serializer$Statement$E$serializeArray$ALStatement$(this._tryStatements), Serializer$CatchStatement$E$serializeArray$ALCatchStatement$(this._catchStatements), Serializer$Statement$E$serializeArray$ALStatement$(this._finallyStatements) ];
};


TryStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var lvStatusesAfterTryCatch;
	var i;
	var lvStatusesAfterCatch;
	var curCatchType;
	var j;
	var precCatchType;
	var lvStatusesAfterFinally;
	if ((context.funcDef.flags$() & ClassDefinition.IS_GENERATOR) !== 0) {
		context.errors.push(new CompileError(this._token, "invalid use of try block inside generator"));
		return false;
	}
	context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this));
	lvStatusesAfterTryCatch = null;
	try {
		for (i = 0; i < this._tryStatements.length; ++ i) {
			if (! this._tryStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesAfterTryCatch = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	for (i = 0; i < this._catchStatements.length; ++ i) {
		context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this._catchStatements[i]));
		lvStatusesAfterCatch = null;
		try {
			if (! this._catchStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
			lvStatusesAfterCatch = context.getTopBlock$().localVariableStatuses;
		} finally {
			context.blockStack.pop();
		}
		lvStatusesAfterTryCatch = lvStatusesAfterTryCatch.merge$LLocalVariableStatuses$(lvStatusesAfterCatch);
		curCatchType = this._catchStatements[i].getLocal$().getType$();
		for (j = 0; j < i; ++ j) {
			precCatchType = this._catchStatements[j].getLocal$().getType$();
			if (curCatchType.isConvertibleTo$LType$(precCatchType)) {
				context.errors.push(new CompileError(this._catchStatements[i]._token, "code is unreachable, a broader catch statement for type '" + precCatchType.toString() + "' already exists"));
				return false;
			}
		}
	}
	context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.merge$LLocalVariableStatuses$(lvStatusesAfterTryCatch), this));
	lvStatusesAfterFinally = null;
	try {
		for (i = 0; i < this._finallyStatements.length; ++ i) {
			if (! this._finallyStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesAfterFinally = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	context.getTopBlock$().localVariableStatuses = lvStatusesAfterTryCatch.mergeFinally$LLocalVariableStatuses$(lvStatusesAfterFinally);
	return true;
};


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


TryStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function DefaultStatement(token) {
	Statement.call(this);
	this._token = token;
};

$__jsx_extend([DefaultStatement], Statement);
DefaultStatement.prototype.clone$ = function () {
	return new DefaultStatement(this._token);
};


DefaultStatement.prototype.getToken$ = function () {
	return this._token;
};


DefaultStatement.prototype.serialize$ = function () {
	return [ "DefaultStatement" ];
};


DefaultStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$(context);
	return true;
};


DefaultStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function CaseStatement(token, expr) {
	Statement.call(this);
	this._token = token;
	this._expr = expr;
};

$__jsx_extend([CaseStatement], Statement);
CaseStatement.prototype.clone$ = function () {
	return new CaseStatement(this._token, this._expr.clone$());
};


CaseStatement.prototype.getToken$ = function () {
	return this._token;
};


CaseStatement.prototype.getExpr$ = function () {
	return this._expr;
};


CaseStatement.prototype.serialize$ = function () {
	return [ "CaseStatement", this._expr.serialize$() ];
};


CaseStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var statement;
	var expectedType;
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
				context.errors.push(new CompileError(this._token, "type mismatch; expected type was '" + expectedType.toString() + "' but got '" + exprType.toString() + "'"));
			}
		}
	}
	SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$(context);
	return true;
};


CaseStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function IfStatement(token, expr, onTrueStatements, onFalseStatements) {
	Statement.call(this);
	Block.call(this);
	this._token = token;
	this._expr = expr;
	this._onTrueStatements = onTrueStatements;
	this._onFalseStatements = onFalseStatements;
};

$__jsx_extend([IfStatement], Statement);
$__jsx_merge_interface(IfStatement, Block);

IfStatement.prototype.clone$ = function () {
	return new IfStatement(this._token, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._onTrueStatements), Cloner$Statement$E$cloneArray$ALStatement$(this._onFalseStatements));
};


IfStatement.prototype.getToken$ = function () {
	return this._token;
};


IfStatement.prototype.getExpr$ = function () {
	return this._expr;
};


IfStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


IfStatement.prototype.getOnTrueStatements$ = function () {
	return this._onTrueStatements;
};


IfStatement.prototype.getOnFalseStatements$ = function () {
	return this._onFalseStatements;
};


IfStatement.prototype.serialize$ = function () {
	return [ "IfStatement", this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._onTrueStatements), Serializer$Statement$E$serializeArray$ALStatement$(this._onFalseStatements) ];
};


IfStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var lvStatusesOnTrueStmts;
	var lvStatusesOnFalseStmts;
	var i;
	if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError(this._expr.getToken$(), "expression of the if statement should not return void"));
		}
	}
	context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this));
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
		context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this));
		for (i = 0; i < this._onFalseStatements.length; ++ i) {
			if (! this._onFalseStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesOnFalseStmts = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	context.getTopBlock$().localVariableStatuses = lvStatusesOnTrueStmts.merge$LLocalVariableStatuses$(lvStatusesOnFalseStmts);
	return true;
};


IfStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._onTrueStatements)) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._onFalseStatements)) {
		return false;
	}
	return true;
};


IfStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._onTrueStatements)) {
		return false;
	}
	if (! cb(this._onFalseStatements)) {
		return false;
	}
	return true;
};


IfStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function LabellableStatement(token, label) {
	Statement.call(this);
	Block.call(this);
	this._lvStatusesOnBreak = null;
	this._token = token;
	this._label = label;
};

$__jsx_extend([LabellableStatement], Statement);
$__jsx_merge_interface(LabellableStatement, Block);

LabellableStatement.prototype.getToken$ = function () {
	return this._token;
};


LabellableStatement.prototype.getLabel$ = function () {
	return this._label;
};


LabellableStatement.prototype._serialize$ = function () {
	return [ Serializer$Token$E$serializeNullable$LToken$(this._label) ];
};


LabellableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this));
	this._lvStatusesOnBreak = context.getTopBlock$().localVariableStatuses.clone$();
	this._lvStatusesOnBreak.setIsReachable$B(false);
};


LabellableStatement.prototype._abortBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.pop();
	this._lvStatusesOnBreak = null;
};


LabellableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$ = function (context) {
	context.blockStack.pop();
	context.getTopBlock$().localVariableStatuses = this._lvStatusesOnBreak;
	this._lvStatusesOnBreak = null;
};


LabellableStatement.prototype.registerVariableStatusesOnBreak$LLocalVariableStatuses$ = function (statuses) {
	if (statuses != null) {
		if (this._lvStatusesOnBreak == null) {
			this._lvStatusesOnBreak = statuses.clone$();
		} else {
			this._lvStatusesOnBreak = this._lvStatusesOnBreak.merge$LLocalVariableStatuses$(statuses);
		}
	}
};


function SwitchStatement(token, label, expr, statements) {
	LabellableStatement.call(this, token, label);
	this._expr = expr;
	this._statements = statements;
};

$__jsx_extend([SwitchStatement], LabellableStatement);
SwitchStatement.prototype.clone$ = function () {
	return new SwitchStatement(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


SwitchStatement.prototype.getExpr$ = function () {
	return this._expr;
};


SwitchStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


SwitchStatement.prototype.getStatements$ = function () {
	return this._statements;
};


SwitchStatement.prototype.serialize$ = function () {
	return [ "SwitchStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};


SwitchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var exprType;
	var hasDefaultLabel;
	var i;
	var statement;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	exprType = this._expr.getType$().resolveIfNullable$();
	if (! (exprType.equals$LType$(Type.booleanType) || exprType.equals$LType$(Type.integerType) || exprType.equals$LType$(Type.numberType) || exprType.equals$LType$(Type.stringType))) {
		context.errors.push(new CompileError(this._token, "switch statement only accepts boolean, number, or string expressions"));
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
		if (context.getTopBlock$().localVariableStatuses.isReachable$()) {
			this.registerVariableStatusesOnBreak$LLocalVariableStatuses$(context.getTopBlock$().localVariableStatuses);
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


SwitchStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements)) {
		return false;
	}
	return true;
};


SwitchStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._statements)) {
		return false;
	}
	return true;
};


SwitchStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$(context) {
	context.getTopBlock$().localVariableStatuses = context.blockStack[context.blockStack.length - 2].localVariableStatuses.clone$();
};

SwitchStatement.resetLocalVariableStatuses$LAnalysisContext$ = SwitchStatement$resetLocalVariableStatuses$LAnalysisContext$;

function ContinuableStatement(token, label, statements) {
	LabellableStatement.call(this, token, label);
	this._lvStatusesOnContinue = null;
	this._statements = statements;
};

$__jsx_extend([ContinuableStatement], LabellableStatement);
ContinuableStatement.prototype.getStatements$ = function () {
	return this._statements;
};


ContinuableStatement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements)) {
		return false;
	}
	return true;
};


ContinuableStatement.prototype.handleStatements$F$ALStatement$B$ = function (cb) {
	if (! cb(this._statements)) {
		return false;
	}
	return true;
};


ContinuableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$.call(this, context);
	this._lvStatusesOnContinue = null;
};


ContinuableStatement.prototype._abortBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._abortBlockAnalysis$LAnalysisContext$.call(this, context);
	this._lvStatusesOnContinue = null;
};


ContinuableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$ = function (context) {
	LabellableStatement.prototype._finalizeBlockAnalysis$LAnalysisContext$.call(this, context);
	this._restoreContinueVariableStatuses$LAnalysisContext$(context);
};


ContinuableStatement.prototype._restoreContinueVariableStatuses$LAnalysisContext$ = function (context) {
	if (this._lvStatusesOnContinue != null) {
		context.getTopBlock$().localVariableStatuses = context.getTopBlock$().localVariableStatuses.merge$LLocalVariableStatuses$(this._lvStatusesOnContinue);
		this._lvStatusesOnContinue = null;
	}
};


ContinuableStatement.prototype.registerVariableStatusesOnContinue$LLocalVariableStatuses$ = function (statuses) {
	if (statuses != null) {
		if (this._lvStatusesOnContinue == null) {
			this._lvStatusesOnContinue = statuses.clone$();
		} else {
			this._lvStatusesOnContinue = this._lvStatusesOnContinue.merge$LLocalVariableStatuses$(statuses);
		}
	}
};


function WhileStatement(token, label, expr, statements) {
	ContinuableStatement.call(this, token, label, statements);
	this._expr = expr;
};

$__jsx_extend([WhileStatement], ContinuableStatement);
WhileStatement.prototype.clone$ = function () {
	return new WhileStatement(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


WhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};


WhileStatement.prototype.getStatements$ = function () {
	return this._statements;
};


WhileStatement.prototype.serialize$ = function () {
	return [ "WhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};


WhileStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var i;
	if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError(this._expr.getToken$(), "expression of the while statement should not return void"));
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


WhileStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function ForStatement(token, label, initExpr, condExpr, postExpr, statements) {
	ContinuableStatement.call(this, token, label, statements);
	this._initExpr = initExpr;
	this._condExpr = condExpr;
	this._postExpr = postExpr;
};

$__jsx_extend([ForStatement], ContinuableStatement);
ForStatement.prototype.clone$ = function () {
	return new ForStatement(this._token, this._label, Cloner$Expression$E$cloneNullable$LExpression$(this._initExpr), Cloner$Expression$E$cloneNullable$LExpression$(this._condExpr), Cloner$Expression$E$cloneNullable$LExpression$(this._postExpr), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


ForStatement.prototype.getInitExpr$ = function () {
	return this._initExpr;
};


ForStatement.prototype.setInitExpr$LExpression$ = function (expr) {
	this._initExpr = expr;
};


ForStatement.prototype.getCondExpr$ = function () {
	return this._condExpr;
};


ForStatement.prototype.getPostExpr$ = function () {
	return this._postExpr;
};


ForStatement.prototype.getStatements$ = function () {
	return this._statements;
};


ForStatement.prototype.serialize$ = function () {
	return [ "ForStatement" ].concat(this._serialize$()).concat([ Serializer$Expression$E$serializeNullable$LExpression$(this._initExpr), Serializer$Expression$E$serializeNullable$LExpression$(this._condExpr), Serializer$Expression$E$serializeNullable$LExpression$(this._postExpr), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};


ForStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var i;
	if (this._initExpr != null) {
		this._analyzeExpr$LAnalysisContext$LExpression$(context, this._initExpr);
	}
	if (this._condExpr != null) {
		if (this._analyzeExpr$LAnalysisContext$LExpression$(context, this._condExpr)) {
			if (this._condExpr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError(this._condExpr.getToken$(), "condition expression of the for statement should not return void"));
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


function ForInStatement(token, label, lhsExpr, listExpr, statements) {
	ContinuableStatement.call(this, token, label, statements);
	this._lhsExpr = lhsExpr;
	this._listExpr = listExpr;
};

$__jsx_extend([ForInStatement], ContinuableStatement);
ForInStatement.prototype.clone$ = function () {
	return new ForInStatement(this._token, this._label, this._lhsExpr.clone$(), this._listExpr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


ForInStatement.prototype.getLHSExpr$ = function () {
	return this._lhsExpr;
};


ForInStatement.prototype.getListExpr$ = function () {
	return this._listExpr;
};


ForInStatement.prototype.getStatements$ = function () {
	return this._statements;
};


ForInStatement.prototype.serialize$ = function () {
	return [ "ForInStatement" ].concat(this._serialize$()).concat([ this._lhsExpr.serialize$(), this._listExpr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};


ForInStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var listType;
	var listClassDef;
	var listTypeName;
	var i;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._listExpr)) {
		return true;
	}
	listType = this._listExpr.getType$().resolveIfNullable$();
	if (listType instanceof ObjectType && (listClassDef = listType.getClassDef$()) instanceof InstantiatedClassDefinition && ((listTypeName = listClassDef.getTemplateClassName$()) === "Array" || listTypeName === "Map")) {
	} else {
		context.errors.push(new CompileError(this.getToken$(), "list expression of the for..in statement should be an array or a map"));
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


function DoWhileStatement(token, label, expr, statements) {
	ContinuableStatement.call(this, token, label, statements);
	this._expr = expr;
};

$__jsx_extend([DoWhileStatement], ContinuableStatement);
DoWhileStatement.prototype.clone$ = function () {
	return new DoWhileStatement(this._token, this._label, this._expr.clone$(), Cloner$Statement$E$cloneArray$ALStatement$(this._statements));
};


DoWhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};


DoWhileStatement.prototype.serialize$ = function () {
	return [ "DoWhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Serializer$Statement$E$serializeArray$ALStatement$(this._statements) ]);
};


DoWhileStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
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
				context.errors.push(new CompileError(this._expr.getToken$(), "expression of the do-while statement should not return void"));
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


DoWhileStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function JumpStatement(token, label) {
	Statement.call(this);
	this._token = token;
	this._label = label;
};

$__jsx_extend([JumpStatement], Statement);
JumpStatement.prototype.getToken$ = function () {
	return this._token;
};


JumpStatement.prototype.getLabel$ = function () {
	return this._label;
};


JumpStatement.prototype.serialize$ = function () {
	return [ this._getName$(), this._token.serialize$(), Serializer$Token$E$serializeNullable$LToken$(this._label) ];
};


JumpStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
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
	context.getTopBlock$().localVariableStatuses.setIsReachable$B(false);
	return true;
};


JumpStatement.prototype._determineDestination$LAnalysisContext$ = function (context) {
	var i;
	var statement;
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
					context.errors.push(new CompileError(this._token, "cannot 'continue' to a switch statement"));
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
		context.errors.push(new CompileError(this._label, "label '" + this._label.getValue$() + "' is either not defined or invalid as the destination"));
	} else {
		context.errors.push(new CompileError(this._token, "cannot '" + this._token.getValue$() + "' at this point"));
	}
	return null;
};


JumpStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function ContinueStatement(token, label) {
	JumpStatement.call(this, token, label);
};

$__jsx_extend([ContinueStatement], JumpStatement);
ContinueStatement.prototype.clone$ = function () {
	return new ContinueStatement(this._token, this._label);
};


ContinueStatement.prototype._getName$ = function () {
	return "ContinueStatement";
};


ContinueStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function BreakStatement(token, label) {
	JumpStatement.call(this, token, label);
};

$__jsx_extend([BreakStatement], JumpStatement);
BreakStatement.prototype.clone$ = function () {
	return new BreakStatement(this._token, this._label);
};


BreakStatement.prototype._getName$ = function () {
	return "BreakStatement";
};


BreakStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function YieldStatement(token, expr) {
	Statement.call(this);
	this._token = token;
	this._expr = expr;
};

$__jsx_extend([YieldStatement], Statement);
YieldStatement.prototype.clone$ = function () {
	return new YieldStatement(this._token, Cloner$Expression$E$cloneNullable$LExpression$(this._expr));
};


YieldStatement.prototype.getToken$ = function () {
	return this._token;
};


YieldStatement.prototype.getExpr$ = function () {
	return this._expr;
};


YieldStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


YieldStatement.prototype.serialize$ = function () {
	return [ "YieldStatement", Serializer$Expression$E$serializeNullable$LExpression$(this._expr) ];
};


YieldStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var returnType;
	var yieldType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	if (this._expr.getType$() == null) {
		return true;
	}
	returnType = context.funcDef.getReturnType$();
	if (returnType == null) {
		yieldType = this._expr.getType$();
		context.funcDef.setReturnType$LType$(new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "g_Enumerable", [ yieldType ])));
	} else {
		if (returnType instanceof ObjectType && returnType.getClassDef$() instanceof InstantiatedClassDefinition && returnType.getClassDef$().getTemplateClassName$() === "g_Enumerable") {
			yieldType = returnType.getClassDef$().getTypeArguments$()[0];
		} else {
			context.errors.push(new CompileError(this._token, "cannot convert 'g_Enumerable.<" + this._expr.getType$().toString() + ">' to return type '" + returnType.toString() + "'"));
			return false;
		}
	}
	if (! this._expr.getType$().isConvertibleTo$LType$(yieldType)) {
		context.errors.push(new CompileError(this._token, "cannot convert '" + this._expr.getType$().toString() + "' to yield type '" + yieldType.toString() + "'"));
		return false;
	}
	return true;
};


YieldStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (this._expr != null && ! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function ReturnStatement(token, expr) {
	Statement.call(this);
	this._token = token;
	this._expr = expr;
};

$__jsx_extend([ReturnStatement], Statement);
ReturnStatement.prototype.clone$ = function () {
	return new ReturnStatement(this._token, Cloner$Expression$E$cloneNullable$LExpression$(this._expr));
};


ReturnStatement.prototype.getToken$ = function () {
	return this._token;
};


ReturnStatement.prototype.getExpr$ = function () {
	return this._expr;
};


ReturnStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


ReturnStatement.prototype.serialize$ = function () {
	return [ "ReturnStatement", Serializer$Expression$E$serializeNullable$LExpression$(this._expr) ];
};


ReturnStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var returnType;
	var exprType;
	if (context.funcDef.isGenerator$()) {
		context.errors.push(new CompileError(this._token, "return statement in generator is not allowed"));
		return true;
	}
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
				context.errors.push(new CompileError(this._token, "cannot return a value from a void function"));
				return true;
			}
		} else {
			if (this._expr == null) {
				context.errors.push(new CompileError(this._token, "cannot return void, the function is declared to return a value of type '" + returnType.toString() + "'"));
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
				context.errors.push(new CompileError(this._token, "cannot convert '" + exprType.toString() + "' to return type '" + returnType.toString() + "'"));
				return false;
			}
		}
	}
	context.getTopBlock$().localVariableStatuses.setIsReachable$B(false);
	return true;
};


ReturnStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (this._expr != null && ! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function FunctionStatement(token, funcDef) {
	Statement.call(this);
	this._token = token;
	this._funcDef = funcDef;
};

$__jsx_extend([FunctionStatement], Statement);
FunctionStatement.prototype.clone$ = function () {
	return new FunctionStatement(this._token, this._funcDef);
};


FunctionStatement.prototype.getToken$ = function () {
	return this._token;
};


FunctionStatement.prototype.getFuncDef$ = function () {
	return this._funcDef;
};


FunctionStatement.prototype.setFuncDef$LMemberFunctionDefinition$ = function (funcDef) {
	this._funcDef = funcDef;
};


FunctionStatement.prototype.serialize$ = function () {
	return [ "FunctionStatement", this._funcDef.serialize$() ];
};


FunctionStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	if (! this._typesAreIdentified$()) {
		context.errors.push(new CompileError(this._token, "argument / return types were not automatically deductable, please specify them by hand"));
		return false;
	}
	this._funcDef.analyze$LAnalysisContext$(context);
	context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this._funcDef.getFuncLocal$());
	return true;
};


FunctionStatement.prototype._typesAreIdentified$ = function () {
	var argTypes;
	var i;
	argTypes = this._funcDef.getArgumentTypes$();
	for (i = 0; i < argTypes.length; ++ i) {
		if (argTypes[i] == null) {
			return false;
		}
	}
	if (this._funcDef.getReturnType$() == null) {
		return false;
	}
	return true;
};


FunctionStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function UnaryExpressionStatement(expr) {
	Statement.call(this);
	this._expr = null;
	if (expr == null) {
		throw new Error("logic flaw");
	}
	this._expr = expr;
};

$__jsx_extend([UnaryExpressionStatement], Statement);
UnaryExpressionStatement.prototype.getToken$ = function () {
	return this._expr.getToken$();
};


UnaryExpressionStatement.prototype.getExpr$ = function () {
	return this._expr;
};


UnaryExpressionStatement.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


UnaryExpressionStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr);
	return true;
};


UnaryExpressionStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	if (! cb(this._expr, (function (expr) {
		$this._expr = expr;
	}))) {
		return false;
	}
	return true;
};


function DeleteStatement(token, expr) {
	UnaryExpressionStatement.call(this, expr);
	this._token = token;
};

$__jsx_extend([DeleteStatement], UnaryExpressionStatement);
DeleteStatement.prototype.clone$ = function () {
	return new DeleteStatement(this._token, this._expr.clone$());
};


DeleteStatement.prototype.getToken$ = function () {
	return this._token;
};


DeleteStatement.prototype.serialize$ = function () {
	return [ "DeleteStatement", this._expr.serialize$() ];
};


DeleteStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var secondExprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	if (! (this._expr instanceof ArrayExpression)) {
		context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
		return true;
	}
	secondExprType = this._expr.getSecondExpr$().getType$();
	if (secondExprType == null) {
		return true;
	}
	if (! secondExprType.resolveIfNullable$().equals$LType$(Type.stringType)) {
		context.errors.push(new CompileError(this._token, "only properties of a hash object can be deleted"));
		return true;
	}
	return true;
};


function ExpressionStatement(expr) {
	UnaryExpressionStatement.call(this, expr);
};

$__jsx_extend([ExpressionStatement], UnaryExpressionStatement);
ExpressionStatement.prototype.clone$ = function () {
	return new ExpressionStatement(this._expr.clone$());
};


ExpressionStatement.prototype.serialize$ = function () {
	return [ "ExpressionStatement", this._expr.serialize$() ];
};


function ConstructorInvocationStatement(token, ctorClassType, args) {
	ConstructorInvocationStatement$0.call(this, token, ctorClassType, args, null);
};

function ConstructorInvocationStatement$0(token, ctorClassType, args, ctorFunctionType) {
	Statement.call(this);
	this._token = token;
	this._ctorClassType = ctorClassType;
	this._args = args;
	this._ctorFunctionType = (ctorFunctionType != null ? ctorFunctionType : null);
};

$__jsx_extend([ConstructorInvocationStatement, ConstructorInvocationStatement$0], Statement);
ConstructorInvocationStatement.prototype.clone$ = function () {
	return new ConstructorInvocationStatement$0(this._token, this._ctorClassType, Cloner$Expression$E$cloneArray$ALExpression$(this._args), this._ctorFunctionType);
};


ConstructorInvocationStatement.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	if (this._ctorFunctionType != null) {
		throw new Error("instantiation after analysis?");
	}
	return new ConstructorInvocationStatement$0(this._token, this._ctorClassType.instantiate$LInstantiationContext$(instantiationContext), Cloner$Expression$E$cloneArray$ALExpression$(this._args), null);
};


ConstructorInvocationStatement.prototype.getToken$ = function () {
	return this._token;
};


ConstructorInvocationStatement.prototype.getArguments$ = function () {
	return this._args;
};


ConstructorInvocationStatement.prototype.getConstructingClassDef$ = function () {
	return this._ctorClassType.getClassDef$();
};


ConstructorInvocationStatement.prototype.getConstructorType$ = function () {
	return this._ctorFunctionType;
};


ConstructorInvocationStatement.prototype.serialize$ = function () {
	return [ "ConstructorInvocationStatement", this._ctorClassType.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};


ConstructorInvocationStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var ctorType;
	var argTypes;
	ctorType = this.getConstructingClassDef$().getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "constructor", false, [], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
	if (ctorType == null) {
		if (this._args.length !== 0) {
			context.errors.push(new CompileError(this.getToken$(), "no function with matching arguments"));
			return true;
		}
		ctorType = new MemberFunctionType(this.getConstructingClassDef$().getToken$(), new ObjectType(this.getConstructingClassDef$()), Type.voidType, [], false);
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


ConstructorInvocationStatement.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};


function Expression(token) {
	Stashable.call(this);
	this._token = token;
};

function Expression$0(that) {
	var k;
	Stashable.call(this);
	this._token = that.getToken$();
	for (k in that._stash) {
		this._stash[k] = that._stash[k].clone$();
	}
};

$__jsx_extend([Expression, Expression$0], Object);
$__jsx_merge_interface(Expression, Stashable);

Expression.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	var onExpr;
	function onExpr(expr) {
		var srcType;
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
	}
	return onExpr(this);
};


Expression.prototype.getToken$ = function () {
	return this._token;
};


Expression.prototype.getHolderType$ = function () {
	return null;
};


Expression.prototype.forEachExpression$F$LExpression$B$ = function (cb) {
	var $this = this;
	return this.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, _) {
		return cb(expr);
	}));
};


Expression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	context.errors.push(new CompileError(token, "left-hand-side expression is not assignable"));
	return false;
};


function Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$(context, token, lhsType, rhsType) {
	if (! lhsType.isAssignable$()) {
		context.errors.push(new CompileError(token, "left-hand-side expression is not assignable"));
		return false;
	}
	if (! rhsType.isConvertibleTo$LType$(lhsType)) {
		context.errors.push(new CompileError(token, "cannot assign a value of type '" + rhsType.toString() + "' to '" + lhsType.toString() + "'"));
		return false;
	}
	return true;
};

Expression.assertIsAssignable$LAnalysisContext$LToken$LType$LType$ = Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$;

function Expression$getDefaultValueExpressionOf$LType$(type) {
	if (type.equals$LType$(Type.booleanType)) {
		return new BooleanLiteralExpression(new Token("false", false));
	} else {
		if (type.equals$LType$(Type.integerType)) {
			return new IntegerLiteralExpression(new Token("0", false));
		} else {
			if (type.equals$LType$(Type.numberType)) {
				return new NumberLiteralExpression(new Token("0", false));
			} else {
				if (type.equals$LType$(Type.stringType)) {
					return new StringLiteralExpression(new Token("\"\"", false));
				} else {
					return new NullExpression(new Token("null", false), type);
				}
			}
		}
	}
};

Expression.getDefaultValueExpressionOf$LType$ = Expression$getDefaultValueExpressionOf$LType$;

function CommaExpression(token, expr1, expr2) {
	Expression.call(this, token);
	this._expr1 = null;
	this._expr2 = null;
	this._expr1 = expr1;
	this._expr2 = expr2;
};

$__jsx_extend([CommaExpression], Expression);
CommaExpression.prototype.clone$ = function () {
	return new CommaExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


CommaExpression.prototype.getFirstExpr$ = function () {
	return this._expr1;
};


CommaExpression.prototype.getSecondExpr$ = function () {
	return this._expr2;
};


CommaExpression.prototype.serialize$ = function () {
	return [ "CommaExpression", this._expr1.serialize$(), this._expr2.serialize$() ];
};


CommaExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return this._expr1.analyze$LAnalysisContext$LExpression$(context, this) && this._expr2.analyze$LAnalysisContext$LExpression$(context, this);
};


CommaExpression.prototype.getType$ = function () {
	return this._expr2.getType$();
};


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


function FunctionExpression(token, funcDef) {
	Expression.call(this, token);
	this._funcDef = funcDef;
};

$__jsx_extend([FunctionExpression], Expression);
FunctionExpression.prototype.clone$ = function () {
	return new FunctionExpression(this._token, this._funcDef);
};


FunctionExpression.prototype.getFuncDef$ = function () {
	return this._funcDef;
};


FunctionExpression.prototype.setFuncDef$LMemberFunctionDefinition$ = function (funcDef) {
	this._funcDef = funcDef;
};


FunctionExpression.prototype.serialize$ = function () {
	return [ "FunctionExpression", this._funcDef.serialize$() ];
};


FunctionExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this.argumentTypesAreIdentified$()) {
		context.errors.push(new CompileError(this._token, "argument types were not automatically deductable, please specify them by hand"));
		return false;
	}
	this._funcDef.analyze$LAnalysisContext$(context);
	return true;
};


FunctionExpression.prototype.getType$ = function () {
	return this._funcDef.getType$();
};


FunctionExpression.prototype.argumentTypesAreIdentified$ = function () {
	var argTypes;
	var i;
	argTypes = this._funcDef.getArgumentTypes$();
	for (i = 0; i < argTypes.length; ++ i) {
		if (argTypes[i] == null) {
			return false;
		}
	}
	return true;
};


FunctionExpression.prototype.typesAreIdentified$ = function () {
	if (! this.argumentTypesAreIdentified$()) {
		return false;
	}
	if (this._funcDef.getReturnType$() == null) {
		return false;
	}
	return true;
};


FunctionExpression.prototype.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$ = function (context, type) {
	if (! this._funcDef.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, type)) {
		return false;
	}
	return true;
};


FunctionExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function ThisExpression(token, classDef) {
	Expression.call(this, token);
	this._classDef = classDef;
};

$__jsx_extend([ThisExpression], Expression);
ThisExpression.prototype.clone$ = function () {
	return new ThisExpression(this._token, this._classDef);
};


ThisExpression.prototype.serialize$ = function () {
	return [ "ThisExpression", this._token.serialize$(), Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$(this._classDef) ];
};


ThisExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var rootFuncDef;
	rootFuncDef = context.funcDef;
	if (rootFuncDef != null) {
		while (rootFuncDef.getParent$() != null) {
			rootFuncDef = rootFuncDef.getParent$();
		}
	}
	if (rootFuncDef == null || (rootFuncDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		context.errors.push(new CompileError(this._token, "cannot use 'this' outside of a member function"));
		return false;
	}
	this._classDef = rootFuncDef.getClassDef$();
	return true;
};


ThisExpression.prototype.getType$ = function () {
	return new ObjectType(this._classDef);
};


ThisExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function MapLiteralExpression(token, elements, type) {
	Expression.call(this, token);
	this._elements = elements;
	this._type = type;
};

$__jsx_extend([MapLiteralExpression], Expression);
MapLiteralExpression.prototype.clone$ = function () {
	var ret;
	var i;
	ret = new MapLiteralExpression(this._token, [], this._type);
	for (i = 0; i < this._elements.length; ++ i) {
		ret._elements[i] = new MapLiteralElement(this._elements[i].getKey$(), this._elements[i].getExpr$().clone$());
	}
	return ret;
};


MapLiteralExpression.prototype.getElements$ = function () {
	return this._elements;
};


MapLiteralExpression.prototype.getType$ = function () {
	return this._type;
};


MapLiteralExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


MapLiteralExpression.prototype.serialize$ = function () {
	return [ "MapLiteralExpression", this._token.serialize$(), Serializer$MapLiteralElement$E$serializeArray$ALMapLiteralElement$(this._elements), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};


MapLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var succeeded;
	var i;
	var classDef;
	var expectedType;
	var elementType;
	succeeded = true;
	for (i = 0; i < this._elements.length; ++ i) {
		if (! this._elements[i].getExpr$().analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else {
			if (this._elements[i].getExpr$().getType$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError(this._token, "cannot assign void to a hash"));
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
				context.errors.push(new CompileError(this._token, "specified type is not a hash type"));
				return false;
			}
			expectedType = this._type.getTypeArguments$()[0];
			for (i = 0; i < this._elements.length; ++ i) {
				elementType = this._elements[i].getExpr$().getType$();
				if (! elementType.isConvertibleTo$LType$(expectedType)) {
					context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to a map of '" + expectedType.toString() + "'"));
					succeeded = false;
				}
			}
		} else {
			if (this._type != null) {
				context.errors.push(new CompileError(this._token, "invalid type for a map literal"));
				return false;
			} else {
				elementType = Type$calcLeastCommonAncestor$ALType$B(this._elements.map((function (elt) {
					return elt.getExpr$().getType$();
				})), true);
				if (elementType == null || elementType.equals$LType$(Type.nullType)) {
					context.errors.push(new CompileError(this._token, "could not deduce hash type, please specify"));
					return false;
				}
				if (elementType.equals$LType$(Type.integerType)) {
					elementType = Type.numberType;
				}
				elementType = elementType.resolveIfNullable$();
				this._type = new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Map", [ elementType ]));
			}
		}
	}
	return succeeded;
};


MapLiteralExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
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


function ArrayLiteralExpression(token, exprs, type) {
	Expression.call(this, token);
	this._exprs = exprs;
	this._type = type;
};

$__jsx_extend([ArrayLiteralExpression], Expression);
ArrayLiteralExpression.prototype.clone$ = function () {
	return new ArrayLiteralExpression(this._token, Cloner$Expression$E$cloneArray$ALExpression$(this._exprs), this._type);
};


ArrayLiteralExpression.prototype.getExprs$ = function () {
	return this._exprs;
};


ArrayLiteralExpression.prototype.getType$ = function () {
	return this._type;
};


ArrayLiteralExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


ArrayLiteralExpression.prototype.serialize$ = function () {
	return [ "ArrayLiteralExpression", this._token.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._exprs), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};


ArrayLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var succeeded;
	var i;
	var classDef;
	var expectedType;
	var elementType;
	succeeded = true;
	for (i = 0; i < this._exprs.length; ++ i) {
		if (! this._exprs[i].analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else {
			if (this._exprs[i].getType$().equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError(this._token, "cannot assign void to an array"));
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
			context.errors.push(new CompileError(this._token, "the type specified after ':' is not an array type"));
			return false;
		}
		expectedType = this._type.getClassDef$().getTypeArguments$()[0].toNullableType$();
		for (i = 0; i < this._exprs.length; ++ i) {
			elementType = this._exprs[i].getType$();
			if (! elementType.isConvertibleTo$LType$(expectedType)) {
				context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to an array of '" + expectedType.toString() + "'"));
				succeeded = false;
			}
		}
	} else {
		elementType = Type$calcLeastCommonAncestor$ALType$B(this._exprs.map((function (expr) {
			return expr.getType$();
		})), true);
		if (elementType == null || elementType.equals$LType$(Type.nullType)) {
			context.errors.push(new CompileError(this._token, "could not deduce array type, please specify"));
			return false;
		}
		if (elementType.equals$LType$(Type.integerType)) {
			elementType = Type.numberType;
		}
		elementType = elementType.resolveIfNullable$();
		this._type = new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Array", [ elementType ]));
	}
	return succeeded;
};


ArrayLiteralExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._exprs)) {
		return false;
	}
	return true;
};


function OperatorExpression(token) {
	Expression.call(this, token);
};

function OperatorExpression$0(that) {
	Expression$0.call(this, that);
};

$__jsx_extend([OperatorExpression, OperatorExpression$0], Expression);
OperatorExpression.prototype.isConvertibleTo$LAnalysisContext$LExpression$LType$B = function (context, expr, type, mayUnbox) {
	var exprType;
	exprType = expr.getType$().resolveIfNullable$();
	if (mayUnbox && type instanceof PrimitiveType && exprType instanceof ObjectType && exprType.getClassDef$() == type.getClassDef$()) {
		return true;
	}
	return exprType.isConvertibleTo$LType$(type);
};


OperatorExpression.prototype.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B = function (context, expr, type, mayUnbox) {
	if (! this.isConvertibleTo$LAnalysisContext$LExpression$LType$B(context, expr, type, mayUnbox)) {
		context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue$() + "' to type '" + expr.getType$().toString() + "'"));
		return false;
	}
	return true;
};


function NewExpression(token, type, args) {
	OperatorExpression.call(this, token);
	this._type = type;
	this._args = args;
	this._constructor = null;
};

function NewExpression$0(that) {
	OperatorExpression$0.call(this, that);
	this._type = that._type;
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
	this._constructor = that._constructor;
};

$__jsx_extend([NewExpression, NewExpression$0], OperatorExpression);
NewExpression.prototype.clone$ = function () {
	return new NewExpression$0(this);
};


NewExpression.prototype.getQualifiedName$ = function () {
	throw new Error("will be removed");
};


NewExpression.prototype.getArguments$ = function () {
	return this._args;
};


NewExpression.prototype.serialize$ = function () {
	return [ "NewExpression", this._token.serialize$(), this._type.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};


NewExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var classDef;
	var ctors;
	var argTypes;
	if (! (this._type instanceof ObjectType)) {
		context.errors.push(new CompileError(this._token, "cannot instantiate a non-object type: " + this._type.toString()));
		return false;
	}
	classDef = this._type.getClassDef$();
	if (classDef == null) {
		return false;
	}
	if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
		context.errors.push(new CompileError(this._token, "cannot instantiate an interface or a mixin"));
		return false;
	}
	if ((classDef.flags$() & ClassDefinition.IS_ABSTRACT) !== 0) {
		context.errors.push(new CompileError(this._token, "cannot instantiate an abstract class"));
		return false;
	}
	ctors = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "constructor", false, [], ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY);
	if (ctors == null) {
		context.errors.push(new CompileError(this._token, "the class cannot be instantiated"));
		return false;
	}
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, this, ctors.getExpectedTypes$NB(this._args.length, false));
	if (argTypes == null) {
		return false;
	}
	if ((this._constructor = ctors.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, false)) == null) {
		context.errors.push(new CompileError(this._token, "cannot create an object of type '" + this._type.toString() + "', arguments mismatch"));
		return false;
	}
	return true;
};


NewExpression.prototype.getType$ = function () {
	return this._type;
};


NewExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


NewExpression.prototype.getConstructor$ = function () {
	return this._constructor;
};


NewExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};


function SuperExpression(token, name, args) {
	OperatorExpression.call(this, token);
	this._classDef = null;
	this._name = name;
	this._args = args;
	this._funcType = null;
};

function SuperExpression$0(that) {
	OperatorExpression$0.call(this, that);
	this._classDef = null;
	this._name = that._name;
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
	this._funcType = that._funcType;
};

$__jsx_extend([SuperExpression, SuperExpression$0], OperatorExpression);
SuperExpression.prototype.clone$ = function () {
	return new SuperExpression$0(this);
};


SuperExpression.prototype.getName$ = function () {
	return this._name;
};


SuperExpression.prototype.getArguments$ = function () {
	return this._args;
};


SuperExpression.prototype.getFunctionType$ = function () {
	return this._funcType;
};


SuperExpression.prototype.serialize$ = function () {
	return [ "SuperExpression", this._token.serialize$(), this._name.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args), Serializer$ClassDefinition$E$serializeNullable$LClassDefinition$(this._classDef) ];
};


SuperExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var classDef;
	var funcType;
	var argTypes;
	if ((context.funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		context.errors.push(new CompileError(this._token, "cannot use 'super' keyword in a static function"));
		return false;
	}
	classDef = context.funcDef.getClassDef$();
	funcType = null;
	if ((funcType = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, this._name.getValue$(), false, [], ClassDefinition.GET_MEMBER_MODE_SUPER)) == null) {
		context.errors.push(new CompileError(this._token, "could not find a member function with given name in super classes of class '" + classDef.className$() + "'"));
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


SuperExpression.prototype.getType$ = function () {
	return this._funcType.getReturnType$();
};


SuperExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	if (! Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, this._args)) {
		return false;
	}
	return true;
};


function CallExpression(token, expr, args) {
	OperatorExpression.call(this, token);
	this._expr = expr;
	this._args = args;
};

function CallExpression$0(that) {
	OperatorExpression$0.call(this, that);
	this._expr = that._expr.clone$();
	this._args = Cloner$Expression$E$cloneArray$ALExpression$(that._args);
};

$__jsx_extend([CallExpression, CallExpression$0], OperatorExpression);
CallExpression.prototype.clone$ = function () {
	return new CallExpression$0(this);
};


CallExpression.prototype.getExpr$ = function () {
	return this._expr;
};


CallExpression.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


CallExpression.prototype.getArguments$ = function () {
	return this._args;
};


CallExpression.prototype.serialize$ = function () {
	return [ "CallExpression", this._token.serialize$(), this._expr.serialize$(), Serializer$Expression$E$serializeArray$ALExpression$(this._args) ];
};


CallExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	var argTypes;
	var isCallingStatic;
	if (! this._expr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	exprType = this._expr.getType$().resolveIfNullable$();
	if (! (exprType instanceof FunctionType)) {
		context.errors.push(new CompileError(this._token, "cannot call a non-function"));
		return false;
	}
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$AALType$(context, this._args, this, exprType.getExpectedTypes$NB(this._args.length, ! (this._expr instanceof PropertyExpression && ! exprType.isAssignable$() && ! (this._expr.getExpr$() instanceof ClassExpression))));
	if (argTypes == null) {
		return false;
	}
	if (this._expr instanceof PropertyExpression && ! exprType.isAssignable$()) {
		isCallingStatic = this._expr.getExpr$() instanceof ClassExpression;
		if (! isCallingStatic && this._expr.getIdentifierToken$().getValue$() === "constructor") {
			context.errors.push(new CompileError(this._token, "cannot call a constructor other than by using 'new'"));
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


CallExpression.prototype.getType$ = function () {
	var type;
	type = this._expr.getType$();
	if (type == null) {
		return null;
	}
	return type.resolveIfNullable$().getReturnType$();
};


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


function ConditionalExpression(operatorToken, condExpr, ifTrueExpr, ifFalseExpr) {
	ConditionalExpression$0.call(this, operatorToken, condExpr, ifTrueExpr, ifFalseExpr, null);
};

function ConditionalExpression$0(operatorToken, condExpr, ifTrueExpr, ifFalseExpr, type) {
	OperatorExpression.call(this, operatorToken);
	this._condExpr = condExpr;
	this._ifTrueExpr = ifTrueExpr;
	this._ifFalseExpr = ifFalseExpr;
	this._type = (type != null ? type : null);
};

$__jsx_extend([ConditionalExpression, ConditionalExpression$0], OperatorExpression);
ConditionalExpression.prototype.clone$ = function () {
	return new ConditionalExpression$0(this._token, this._condExpr.clone$(), this._ifTrueExpr != null ? this._ifTrueExpr.clone$() : null, this._ifFalseExpr.clone$(), this._type);
};


ConditionalExpression.prototype.getCondExpr$ = function () {
	return this._condExpr;
};


ConditionalExpression.prototype.setCondExpr$LExpression$ = function (expr) {
	this._condExpr = expr;
};


ConditionalExpression.prototype.getIfTrueExpr$ = function () {
	return this._ifTrueExpr;
};


ConditionalExpression.prototype.getIfFalseExpr$ = function () {
	return this._ifFalseExpr;
};


ConditionalExpression.prototype.serialize$ = function () {
	return [ "ConditionalExpression", this._token.serialize$(), this._condExpr.serialize$(), Serializer$Expression$E$serializeNullable$LExpression$(this._ifTrueExpr), this._ifFalseExpr.serialize$() ];
};


ConditionalExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var typeIfTrue;
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
		context.errors.push(new CompileError(this._token, "condition cannot be void"));
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
		context.errors.push(new CompileError(this._token, "could not get the join type of '" + typeIfTrue.toString() + "' and '" + typeIfFalse.toString() + "'"));
		return false;
	}
	return true;
};


ConditionalExpression.prototype.getType$ = function () {
	return this._type;
};


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


function BinaryExpression(operatorToken, expr1, expr2) {
	OperatorExpression.call(this, operatorToken);
	this._expr1 = expr1;
	this._expr2 = expr2;
};

$__jsx_extend([BinaryExpression], OperatorExpression);
BinaryExpression.prototype.getFirstExpr$ = function () {
	return this._expr1;
};


BinaryExpression.prototype.setFirstExpr$LExpression$ = function (expr) {
	this._expr1 = expr;
};


BinaryExpression.prototype.getSecondExpr$ = function () {
	return this._expr2;
};


BinaryExpression.prototype.setSecondExpr$LExpression$ = function (expr) {
	this._expr2 = expr;
};


BinaryExpression.prototype.serialize$ = function () {
	return [ "BinaryExpression", this._token.serialize$(), this._expr1.serialize$(), this._expr2.serialize$() ];
};


BinaryExpression.prototype._analyze$LAnalysisContext$ = function (context) {
	if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (! this._expr2.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	return true;
};


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


function ShiftExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([ShiftExpression], BinaryExpression);
ShiftExpression.prototype.clone$ = function () {
	return new ShiftExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


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


ShiftExpression.prototype.getType$ = function () {
	return Type.integerType;
};


function LogicalExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([LogicalExpression], BinaryExpression);
LogicalExpression.prototype.clone$ = function () {
	return new LogicalExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


LogicalExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr1.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "left argument of operator '" + this._token.getValue$() + "' cannot be void"));
		return false;
	}
	if (this._expr2.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "right argument of operator '" + this._token.getValue$() + "' cannot be void"));
		return false;
	}
	return true;
};


LogicalExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function InExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([InExpression], BinaryExpression);
InExpression.prototype.clone$ = function () {
	return new InExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


InExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var expr2Type;
	var expr2ClassDef;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this._expr1.getType$().resolveIfNullable$().equals$LType$(Type.stringType)) {
		context.errors.push(new CompileError(this._token, "left operand of 'in' expression should be a string"));
		return false;
	}
	if ((expr2Type = this._expr2.getType$().resolveIfNullable$()) instanceof ObjectType && (expr2ClassDef = expr2Type.getClassDef$()) instanceof InstantiatedClassDefinition && expr2ClassDef.getTemplateClassName$() === "Map") {
	} else {
		context.errors.push(new CompileError(this._token, "right operand of 'in' expression should be a map"));
		return false;
	}
	return true;
};


InExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function EqualityExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([EqualityExpression], BinaryExpression);
EqualityExpression.prototype.clone$ = function () {
	return new EqualityExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


EqualityExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var bool;
	var expr1Type;
	var expr2Type;
	function bool(x) {
		return (x ? 1 : 0);
	}
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
				context.errors.push(new CompileError(this._token, "either side of operator == should be convertible from the other"));
				return false;
			}
		}
	}
	return true;
};


EqualityExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function BinaryNumberExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([BinaryNumberExpression], BinaryExpression);
BinaryNumberExpression.prototype.clone$ = function () {
	return new BinaryNumberExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


BinaryNumberExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var expr1Type;
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
		context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue$() + "' to type '" + this._expr1.getType$().toString() + "'"));
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


function AssignmentExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([AssignmentExpression], BinaryExpression);
AssignmentExpression.prototype.clone$ = function () {
	return new AssignmentExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


AssignmentExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var rhsType;
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
		context.errors.push(new CompileError(this._token, "cannot assign void"));
		return false;
	}
	if (this._expr2 instanceof ClassExpression) {
		context.errors.push(new CompileError(this._token, "cannot assign a class"));
		return false;
	}
	if (rhsType.resolveIfNullable$().equals$LType$(Type.nullType) && this._expr1.getType$() == null) {
		context.errors.push(new CompileError(this._token, "cannot assign null to an unknown type"));
		return false;
	}
	if (rhsType instanceof FunctionChoiceType) {
		lhsType = this._expr1.getType$();
		if (lhsType != null) {
			if (! (lhsType instanceof ResolvedFunctionType)) {
				context.errors.push(new CompileError(this._token, "cannot assign a function reference to '" + this._expr1.getType$().toString() + "'"));
				return false;
			}
			if ((rhsType = this._expr2.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, lhsType.getArgumentTypes$(), lhsType instanceof StaticFunctionType)) == null) {
				return false;
			}
		} else {
			context.errors.push(new CompileError(this._token, "function reference is ambiguous"));
			return false;
		}
	}
	if (rhsType instanceof MemberFunctionType) {
		context.errors.push(new CompileError(this._token, "cannot assign a member function"));
		return false;
	}
	if (! this._expr1.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, rhsType)) {
		return false;
	}
	return true;
};


AssignmentExpression.prototype._analyzeFusedAssignment$LAnalysisContext$ = function (context) {
	var lhsType;
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
	context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue$() + "' against '" + this._expr1.getType$().toString() + "' and '" + this._expr2.getType$().toString() + "'"));
	return false;
};


AssignmentExpression.prototype._analyzeFunctionExpressionAssignment$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._expr1.getType$() == null) {
		if (! this._expr2.typesAreIdentified$()) {
			context.errors.push(new CompileError(this._token, "either side of the operator should be fully type-qualified : " + (this._expr2.argumentTypesAreIdentified$() ? "return type not declared" : "argument / return types not declared")));
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


AssignmentExpression.prototype.getType$ = function () {
	return this._expr1.getType$();
};


function ArrayExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
	this._type = null;
};

$__jsx_extend([ArrayExpression], BinaryExpression);
ArrayExpression.prototype.clone$ = function () {
	var ret;
	ret = new ArrayExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
	ret._type = this._type;
	return ret;
};


ArrayExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var expr1Type;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr1.getType$() == null) {
		context.errors.push(new CompileError(this._token, "cannot determine type due to preceding errors"));
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
	context.errors.push(new CompileError(this._token, "cannot apply []; the operator is only applicable against an array or an variant"));
	return false;
};


ArrayExpression.prototype._analyzeApplicationOnObject$LAnalysisContext$LType$ = function (context, expr1Type) {
	var expr1ClassDef;
	var funcType;
	var deducedFuncType;
	expr1ClassDef = expr1Type.getClassDef$();
	funcType = expr1ClassDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._token, "__native_index_operator__", false, [], ClassDefinition.GET_MEMBER_MODE_ALL);
	if (funcType == null) {
		context.errors.push(new CompileError(this._token, "cannot apply operator[] on an instance of class '" + expr1ClassDef.className$() + "'"));
		return false;
	}
	deducedFuncType = funcType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, [ this._expr2.getType$() ], false);
	if (deducedFuncType == null) {
		return false;
	}
	this._type = deducedFuncType.getReturnType$();
	return true;
};


ArrayExpression.prototype._analyzeApplicationOnVariant$LAnalysisContext$ = function (context) {
	var expr2Type;
	expr2Type = this._expr2.getType$().resolveIfNullable$();
	if (! (expr2Type.equals$LType$(Type.stringType) || expr2Type.isConvertibleTo$LType$(Type.numberType))) {
		context.errors.push(new CompileError(this._token, "the argument of variant[] should be a string or a number"));
		return false;
	}
	this._type = Type.variantType;
	return true;
};


ArrayExpression.prototype.getType$ = function () {
	return this._type;
};


ArrayExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	return Expression$assertIsAssignable$LAnalysisContext$LToken$LType$LType$(context, token, this._type, type);
};


function AdditiveExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
	this._type = null;
};

$__jsx_extend([AdditiveExpression], BinaryExpression);
AdditiveExpression.prototype.clone$ = function () {
	var ret;
	ret = new AdditiveExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
	ret._type = this._type;
	return ret;
};


AdditiveExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var expr1Type;
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
			context.errors.push(new CompileError(this._token, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
			return false;
		}
	}
	return true;
};


AdditiveExpression.prototype.getType$ = function () {
	return this._type;
};


function UnaryExpression(operatorToken, expr) {
	OperatorExpression.call(this, operatorToken);
	this._expr = expr;
};

$__jsx_extend([UnaryExpression], OperatorExpression);
UnaryExpression.prototype.getExpr$ = function () {
	return this._expr;
};


UnaryExpression.prototype.setExpr$LExpression$ = function (expr) {
	this._expr = expr;
};


UnaryExpression.prototype.serialize$ = function () {
	return [ "UnaryExpression", this._token.serialize$(), this._expr.serialize$() ];
};


UnaryExpression.prototype._analyze$LAnalysisContext$ = function (context) {
	if (! this._expr.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._expr.getType$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue$() + "' against void"));
		return false;
	}
	return true;
};


UnaryExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	return cb(this._expr, (function (expr) {
		$this._expr = expr;
	}));
};


function SignExpression(operatorToken, expr) {
	UnaryExpression.call(this, operatorToken, expr);
};

$__jsx_extend([SignExpression], UnaryExpression);
SignExpression.prototype.clone$ = function () {
	return new SignExpression(this._token, this._expr.clone$());
};


SignExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr, Type.numberType, true)) {
		return false;
	}
	return true;
};


SignExpression.prototype.getType$ = function () {
	var type;
	type = this._expr.getType$();
	if (type.resolveIfNullable$().equals$LType$(Type.numberType)) {
		return Type.numberType;
	} else {
		return Type.integerType;
	}
};


function TypeofExpression(operatorToken, expr) {
	UnaryExpression.call(this, operatorToken, expr);
};

$__jsx_extend([TypeofExpression], UnaryExpression);
TypeofExpression.prototype.clone$ = function () {
	return new TypeofExpression(this._token, this._expr.clone$());
};


TypeofExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (! exprType.equals$LType$(Type.variantType)) {
		context.errors.push(new CompileError(this._token, "cannot apply operator 'typeof' to '" + this._expr.getType$().toString() + "'"));
		return false;
	}
	return true;
};


TypeofExpression.prototype.getType$ = function () {
	return Type.stringType;
};


function PropertyExpression(operatorToken, expr1, identifierToken, typeArgs) {
	PropertyExpression$0.call(this, operatorToken, expr1, identifierToken, typeArgs, null);
};

function PropertyExpression$0(operatorToken, expr1, identifierToken, typeArgs, type) {
	UnaryExpression.call(this, operatorToken, expr1);
	this._identifierToken = identifierToken;
	this._typeArgs = typeArgs;
	this._type = (type != null ? type : null);
};

$__jsx_extend([PropertyExpression, PropertyExpression$0], UnaryExpression);
PropertyExpression.prototype.clone$ = function () {
	return new PropertyExpression$0(this._token, this._expr.clone$(), this._identifierToken, this._typeArgs, this._type);
};


PropertyExpression.prototype.getIdentifierToken$ = function () {
	return this._identifierToken;
};


PropertyExpression.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


PropertyExpression.prototype.serialize$ = function () {
	return [ "PropertyExpression", this._expr.serialize$(), this._identifierToken.serialize$(), Serializer$Type$E$serializeNullable$LType$(this._type) ];
};


PropertyExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	var classDef;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of void"));
		return false;
	}
	if (exprType.equals$LType$(Type.nullType)) {
		context.errors.push(new CompileError(this._identifierToken, "cannot obtain a member of null"));
		return false;
	}
	if (exprType.resolveIfNullable$().equals$LType$(Type.variantType)) {
		context.errors.push(new CompileError(this._identifierToken, "property of a variant should be referred to by using the [] operator"));
		return false;
	}
	classDef = exprType.getClassDef$();
	if (classDef == null) {
		context.errors.push(new CompileError(this._identifierToken, "cannot determine type due to preceding errors"));
		return false;
	}
	this._type = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._identifierToken, this._identifierToken.getValue$(), this._expr instanceof ClassExpression, this._typeArgs, this._expr instanceof ClassExpression ? ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY : ClassDefinition.GET_MEMBER_MODE_ALL);
	if (this._type == null) {
		context.errors.push(new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have a property named '" + this._identifierToken.getValue$() + "'"));
		return false;
	}
	return true;
};


PropertyExpression.prototype.getType$ = function () {
	return this._type;
};


PropertyExpression.prototype.getHolderType$ = function () {
	var type;
	type = this._expr.getType$();
	if (type instanceof PrimitiveType) {
		type = new ObjectType(type.getClassDef$());
	}
	return type;
};


PropertyExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	var $this = this;
	var holderType;
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
		context.errors.push(new CompileError(token, "cannot modify a constant"));
		return false;
	} else {
		if ((varFlags & ClassDefinition.IS_READONLY) !== 0) {
			context.errors.push(new CompileError(token, "cannot modify a readonly variable"));
			return false;
		}
	}
	return true;
};


PropertyExpression.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var i;
	var rhsType;
	for (i = 0; i < argTypes.length; ++ i) {
		if (argTypes[i] instanceof FunctionChoiceType) {
			context.errors.push(new CompileError(operatorToken, "type deduction of overloaded function passed in as an argument is not supported; use 'as' to specify the function"));
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


function IncrementExpression(operatorToken, expr) {
	UnaryExpression.call(this, operatorToken, expr);
};

$__jsx_extend([IncrementExpression], UnaryExpression);
IncrementExpression.prototype.serialize$ = function () {
	return [ this._getClassName$(), this._token.serialize$(), this._expr.serialize$() ];
};


IncrementExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType.resolveIfNullable$().equals$LType$(Type.integerType) || exprType.resolveIfNullable$().equals$LType$(Type.numberType)) {
	} else {
		context.errors.push(new CompileError(this._token, "cannot apply operator '" + this._token.getValue$() + "' to a non-number"));
		return false;
	}
	if (! this._expr.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, exprType)) {
		return false;
	}
	return true;
};


IncrementExpression.prototype.getType$ = function () {
	return this._expr.getType$().resolveIfNullable$();
};


function PreIncrementExpression(operatorToken, expr) {
	IncrementExpression.call(this, operatorToken, expr);
};

$__jsx_extend([PreIncrementExpression], IncrementExpression);
PreIncrementExpression.prototype.clone$ = function () {
	return new PreIncrementExpression(this._token, this._expr.clone$());
};


PreIncrementExpression.prototype._getClassName$ = function () {
	return "PreIncrementExpression";
};


function PostIncrementExpression(operatorToken, expr) {
	IncrementExpression.call(this, operatorToken, expr);
};

$__jsx_extend([PostIncrementExpression], IncrementExpression);
PostIncrementExpression.prototype.clone$ = function () {
	return new PostIncrementExpression(this._token, this._expr.clone$());
};


PostIncrementExpression.prototype._getClassName$ = function () {
	return "PostIncrementExpression";
};


function LogicalNotExpression(operatorToken, expr) {
	UnaryExpression.call(this, operatorToken, expr);
};

$__jsx_extend([LogicalNotExpression], UnaryExpression);
LogicalNotExpression.prototype.clone$ = function () {
	return new LogicalNotExpression(this._token, this._expr.clone$());
};


LogicalNotExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "cannot apply operator '!' against void"));
		return false;
	}
	return true;
};


LogicalNotExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function AsNoConvertExpression(operatorToken, expr, type) {
	UnaryExpression.call(this, operatorToken, expr);
	this._type = type;
};

$__jsx_extend([AsNoConvertExpression], UnaryExpression);
AsNoConvertExpression.prototype.clone$ = function () {
	return new AsNoConvertExpression(this._token, this._expr.clone$(), this._type);
};


AsNoConvertExpression.prototype.serialize$ = function () {
	return [ "AsNoConvertExpression", this._expr.serialize$(), this._type.serialize$() ];
};


AsNoConvertExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var srcType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	srcType = this._expr.getType$();
	if (srcType.equals$LType$(Type.nullType) && ! (this._type instanceof NullableType || this._type instanceof ObjectType || this._type instanceof FunctionType)) {
		context.errors.push(new CompileError(this._token, "'" + srcType.toString() + "' cannot be treated as a value of type '" + this._type.toString() + "'"));
		return false;
	}
	return true;
};


AsNoConvertExpression.prototype.getType$ = function () {
	return this._type;
};


AsNoConvertExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


function AsExpression(operatorToken, expr, type) {
	UnaryExpression.call(this, operatorToken, expr);
	this._type = type;
};

$__jsx_extend([AsExpression], UnaryExpression);
AsExpression.prototype.clone$ = function () {
	return new AsExpression(this._token, this._expr.clone$(), this._type);
};


AsExpression.prototype.serialize$ = function () {
	return [ "AsExpression", this._expr.serialize$(), this._type.serialize$() ];
};


AsExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	var success;
	var deducedType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (this._type instanceof NullableType) {
		context.errors.push(new CompileError(this._token, "right operand of 'as' expression cannot be a Nullable<T> type"));
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
		context.errors.push(new CompileError(this._token, "cannot convert a value of type '" + exprType.toString() + "' to '" + this._type.toString() + "'"));
		return false;
	}
	return true;
};


AsExpression.prototype.getType$ = function () {
	return this._type;
};


AsExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


function InstanceofExpression(operatorToken, expr, expectedType) {
	UnaryExpression.call(this, operatorToken, expr);
	this._expectedType = expectedType;
};

$__jsx_extend([InstanceofExpression], UnaryExpression);
InstanceofExpression.prototype.clone$ = function () {
	return new InstanceofExpression(this._token, this._expr.clone$(), this._expectedType);
};


InstanceofExpression.prototype.getExpectedType$ = function () {
	return this._expectedType;
};


InstanceofExpression.prototype.setExpectedType$LType$ = function (type) {
	this._expectedType = type;
};


InstanceofExpression.prototype.serialize$ = function () {
	return [ "InstanceofExpression", this._expr.serialize$(), this._expectedType.serialize$() ];
};


InstanceofExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var exprType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	exprType = this._expr.getType$();
	if (exprType instanceof ObjectType) {
	} else {
		if (exprType.equals$LType$(Type.variantType)) {
		} else {
			context.errors.push(new CompileError(this._token, "operator 'instanceof' is only applicable to an object or a variant"));
			return false;
		}
	}
	return true;
};


InstanceofExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function BitwiseNotExpression(operatorToken, expr) {
	UnaryExpression.call(this, operatorToken, expr);
};

$__jsx_extend([BitwiseNotExpression], UnaryExpression);
BitwiseNotExpression.prototype.clone$ = function () {
	return new BitwiseNotExpression(this._token, this._expr.clone$());
};


BitwiseNotExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr, Type.numberType, false)) {
		return false;
	}
	return true;
};


BitwiseNotExpression.prototype.getType$ = function () {
	return Type.integerType;
};


function LeafExpression(token) {
	Expression.call(this, token);
};

$__jsx_extend([LeafExpression], Expression);
LeafExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	return true;
};


function RegExpLiteralExpression(token) {
	RegExpLiteralExpression$0.call(this, token, null);
};

function RegExpLiteralExpression$0(token, type) {
	LeafExpression.call(this, token);
	this._type = type;
};

$__jsx_extend([RegExpLiteralExpression, RegExpLiteralExpression$0], LeafExpression);
RegExpLiteralExpression.prototype.clone$ = function () {
	return new RegExpLiteralExpression$0(this._token, this._type);
};


RegExpLiteralExpression.prototype.serialize$ = function () {
	return [ "RegExpLiteralExpression", this._token.serialize$() ];
};


RegExpLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var classDef;
	classDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, "RegExp");
	if (classDef == null) {
		throw new Error("could not find definition for RegExp");
	}
	this._type = new ObjectType(classDef);
	return true;
};


RegExpLiteralExpression.prototype.getType$ = function () {
	return this._type;
};


function StringLiteralExpression(token) {
	LeafExpression.call(this, token);
};

$__jsx_extend([StringLiteralExpression], LeafExpression);
StringLiteralExpression.prototype.clone$ = function () {
	return new StringLiteralExpression(this._token);
};


StringLiteralExpression.prototype.serialize$ = function () {
	return [ "StringLiteralExpression", this._token.serialize$() ];
};


StringLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


StringLiteralExpression.prototype.getType$ = function () {
	return Type.stringType;
};


function NumberLiteralExpression(token) {
	LeafExpression.call(this, token);
};

$__jsx_extend([NumberLiteralExpression], LeafExpression);
NumberLiteralExpression.prototype.clone$ = function () {
	return new NumberLiteralExpression(this._token);
};


NumberLiteralExpression.prototype.serialize$ = function () {
	return [ "NumberLiteralExpression", this._token.serialize$() ];
};


NumberLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


NumberLiteralExpression.prototype.getType$ = function () {
	return Type.numberType;
};


function IntegerLiteralExpression(token) {
	LeafExpression.call(this, token);
};

$__jsx_extend([IntegerLiteralExpression], LeafExpression);
IntegerLiteralExpression.prototype.clone$ = function () {
	return new IntegerLiteralExpression(this._token);
};


IntegerLiteralExpression.prototype.serialize$ = function () {
	return [ "IntegerLiteralExpression", this._token.serialize$() ];
};


IntegerLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


IntegerLiteralExpression.prototype.getType$ = function () {
	return Type.integerType;
};


function BooleanLiteralExpression(token) {
	LeafExpression.call(this, token);
};

$__jsx_extend([BooleanLiteralExpression], LeafExpression);
BooleanLiteralExpression.prototype.clone$ = function () {
	return new BooleanLiteralExpression(this._token);
};


BooleanLiteralExpression.prototype.serialize$ = function () {
	return [ "BooleanLiteralExpression", this._token.serialize$() ];
};


BooleanLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


BooleanLiteralExpression.prototype.getType$ = function () {
	return Type.booleanType;
};


function NullExpression(token, type) {
	LeafExpression.call(this, token);
	this._type = type;
};

$__jsx_extend([NullExpression], LeafExpression);
NullExpression.prototype.clone$ = function () {
	return new NullExpression(this._token, this._type);
};


NullExpression.prototype.serialize$ = function () {
	return [ "NullExpression", this._token.serialize$(), this._type.serialize$() ];
};


NullExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


NullExpression.prototype.getType$ = function () {
	return this._type;
};


NullExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


function ClassExpression(token, parsedType) {
	LeafExpression.call(this, token);
	this._parsedType = parsedType;
};

$__jsx_extend([ClassExpression], LeafExpression);
ClassExpression.prototype.clone$ = function () {
	return new ClassExpression(this._token, this._parsedType);
};


ClassExpression.prototype.serialize$ = function () {
	return [ "ClassExpression", this._token.serialize$(), this._parsedType.serialize$() ];
};


ClassExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	return true;
};


ClassExpression.prototype.getType$ = function () {
	return this._parsedType;
};


ClassExpression.prototype.setType$LType$ = function (type) {
	this._parsedType = type;
};


ClassExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	context.errors.push(new CompileError(token, "cannot modify a class definition"));
	return false;
};


function LocalExpression(token, local) {
	LeafExpression.call(this, token);
	this._cloned = false;
	this._local = local;
};

$__jsx_extend([LocalExpression], LeafExpression);
LocalExpression.prototype.clone$ = function () {
	var that;
	that = new LocalExpression(this._token, this._local);
	that._cloned = true;
	return that;
};


LocalExpression.prototype.getLocal$ = function () {
	return this._local;
};


LocalExpression.prototype.setLocal$LLocalVariable$ = function (local) {
	this._local = local;
};


LocalExpression.prototype.serialize$ = function () {
	return [ "LocalExpression", this._token.serialize$(), this._local.serialize$() ];
};


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


LocalExpression.prototype.getType$ = function () {
	return this._local.getType$();
};


LocalExpression.prototype.assertIsAssignable$LAnalysisContext$LToken$LType$ = function (context, token, type) {
	if (this._local.getType$() == null) {
		if (type.equals$LType$(Type.nullType)) {
			context.errors.push(new CompileError(token, "cannot assign null without type annotation to a value of undetermined type"));
			return false;
		}
		this._local.setType$LType$(type.asAssignableType$());
	} else {
		if (! type.isConvertibleTo$LType$(this._local.getType$())) {
			context.errors.push(new CompileError(token, "cannot assign a value of type '" + type.toString() + "' to '" + this._local.getType$().toString() + "'"));
			return false;
		}
	}
	this._local.touchVariable$LAnalysisContext$LToken$B(context, this._token, true);
	return true;
};


function Emitter() {
	Stashable.call(this);
};

$__jsx_extend([Emitter], Object);
$__jsx_merge_interface(Emitter, Stashable);

Emitter.prototype.$__jsx_implements_Emitter = true;

function JavaScriptEmitter(platform) {
	Emitter.call(this);
	this._fileHeader = "var JSX = {};\n" + "(function (JSX) {\n";
	this._fileFooter = "})(JSX);\n";
	this._output = "";
	this._outputEndsWithReturn = false;
	this._outputFile = null;
	this._indent = 0;
	this._emittingClass = null;
	this._emittingFunction = null;
	this._enableSourceMap = false;
	this._enableProfiler = false;
	this._enableMinifier = false;
	this._enableRunTimeTypeCheck = true;
	this._bootstrapBuilder = null;
	this._sourceMapper = null;
	this._mangler = new _Mangler();
	this._namer = null;
	JavaScriptEmitter$_initialize$();
	this._platform = platform;
};

$__jsx_extend([JavaScriptEmitter], Object);
$__jsx_merge_interface(JavaScriptEmitter, Emitter);

JavaScriptEmitter.prototype.isJsModule$LClassDefinition$ = function (classDef) {
	return classDef.className$() === "js" && classDef.getToken$().getFilename$() == Util$resolvePath$S(this._platform.getRoot$() + "/lib/js/js.jsx");
};


JavaScriptEmitter.prototype.getSearchPaths$ = function () {
	return [ this._platform.getRoot$() + "/lib/js" ];
};


JavaScriptEmitter.prototype.setOutputFile$US = function (name) {
	if (name == null) {
		return;
	}
	this._outputFile = Util$resolvePath$S(name);
	if (this._enableSourceMap) {
		this._sourceMapper = new SourceMapper(this._platform.getRoot$(), name);
	}
};


JavaScriptEmitter.prototype.getSourceMappingFiles$ = function () {
	var files;
	var sourceMapper;
	var fileMap;
	var filename;
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


JavaScriptEmitter.prototype.setSourceMapper$LSourceMapper$ = function (gen) {
	this._sourceMapper = gen;
};


JavaScriptEmitter.prototype.getMangler$ = function () {
	return this._mangler;
};


JavaScriptEmitter.prototype.getNamer$ = function () {
	return this._namer;
};


JavaScriptEmitter.prototype.setEnableRunTimeTypeCheck$B = function (enable) {
	this._enableRunTimeTypeCheck = enable;
};


JavaScriptEmitter.prototype.getEnableSourceMap$ = function () {
	return this._enableSourceMap;
};


JavaScriptEmitter.prototype.setEnableSourceMap$B = function (enable) {
	this._enableSourceMap = enable;
};


JavaScriptEmitter.prototype.setEnableProfiler$B = function (enable) {
	this._enableProfiler = enable;
};


JavaScriptEmitter.prototype.getEnableMinifier$ = function () {
	return this._enableMinifier;
};


JavaScriptEmitter.prototype.setEnableMinifier$B = function (enable) {
	this._enableMinifier = enable;
};


JavaScriptEmitter.prototype.emit$ALClassDefinition$ = function (classDefs) {
	var minifier;
	_Util$setOutputClassNames$ALClassDefinition$(classDefs);
	if (this._enableMinifier) {
		minifier = new _Minifier(this, classDefs);
		this._namer = minifier.getCountingNamer$();
		this._emitInit$();
		this._emitCore$ALClassDefinition$(classDefs);
		this._namer = minifier.getMinifyingNamer$();
		this._emitInit$();
		this._emitCore$ALClassDefinition$(classDefs);
	} else {
		this._namer = new _Namer().setup$LJavaScriptEmitter$(this);
		this._emitInit$();
		this._emitCore$ALClassDefinition$(classDefs);
	}
	this._emitClassMap$ALClassDefinition$(classDefs);
};


JavaScriptEmitter.prototype._emitInit$ = function () {
	var stash;
	this._output = "";
	this._outputEndsWithReturn = true;
	this._outputFile = null;
	this._indent = 0;
	this._emittingClass = null;
	this._emittingFunction = null;
	this._output += "// generatedy by JSX compiler " + Meta.IDENTIFIER + "\n";
	this._output += this._fileHeader;
	this._output += this._platform.load$S(this._platform.getRoot$() + "/src/js/bootstrap.js");
	stash = this.getStash$()[_NoDebugCommand.IDENTIFIER];
	this._emit$SLToken$("JSX.DEBUG = " + (stash == null || stash.debugValue ? "true" : "false") + ";\n", null);
};


JavaScriptEmitter.prototype._emitCore$ALClassDefinition$ = function (classDefs) {
	var $this = this;
	var i;
	var onFuncDef;
	for (i = 0; i < classDefs.length; ++ i) {
		function onFuncDef(funcDef) {
			funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFuncDef);
			$this._setupBooleanizeFlags$LMemberFunctionDefinition$(funcDef);
			return true;
		}
		classDefs[i].forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFuncDef);
		classDefs[i].forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0 && varDef.getInitialValue$() != null) {
				$this._setupBooleanizeFlags$LExpression$(varDef.getInitialValue$());
			}
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
};


JavaScriptEmitter.prototype.setBootstrapMode$NSS = function (mode, sourceFile, executableFor) {
	switch (mode) {
	case JavaScriptEmitter.BOOTSTRAP_NONE:
		this._bootstrapBuilder = null;
		break;
	case JavaScriptEmitter.BOOTSTRAP_EXECUTABLE:
		this._bootstrapBuilder = new _ExecutableBootstrapBuilder();
		break;
	case JavaScriptEmitter.BOOTSTRAP_TEST:
		this._bootstrapBuilder = new _TestBootstrapBuilder();
		break;
	default:
		throw new Error("unexpected bootstrap mode:" + (mode + ""));
	}
	if (this._bootstrapBuilder != null) {
		this._bootstrapBuilder.init$LJavaScriptEmitter$SS(this, sourceFile, executableFor);
	}
};


JavaScriptEmitter.prototype.getStash$LStashable$ = function (stashable) {
	var stash;
	stash = stashable.getStash$();
	if (stash.jsemitter == null) {
		stash.jsemitter = new _JSEmitterStash();
	}
	return stash.jsemitter;
};


JavaScriptEmitter.prototype._setupBooleanizeFlags$LExpression$ = function (expr) {
	var $this = this;
	var exprReturnsBoolean;
	var parentExpr;
	var onExpr;
	exprReturnsBoolean = (function (expr) {
		if (expr instanceof LogicalExpression) {
			return $this.getStash$LStashable$(expr).returnsBoolean;
		} else {
			return expr.getType$().equals$LType$(Type.booleanType);
		}
	});
	parentExpr = [];
	onExpr = (function (expr) {
		var shouldBooleanize;
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
	});
	onExpr(expr);
};


JavaScriptEmitter.prototype._setupBooleanizeFlags$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		statement.forEachExpression$F$LExpression$B$((function (expr) {
			$this._setupBooleanizeFlags$LExpression$(expr);
			if (statement instanceof ExpressionStatement || statement instanceof IfStatement || statement instanceof DoWhileStatement || statement instanceof WhileStatement || statement instanceof ForStatement) {
				$this.getStash$LStashable$(expr).shouldBooleanize = false;
			}
			return true;
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
};


JavaScriptEmitter.prototype.shouldBooleanize$LExpression$ = function (logicalExpr) {
	return this.getStash$LStashable$(logicalExpr).shouldBooleanize;
};


JavaScriptEmitter.prototype._emitClassDefinition$LClassDefinition$ = function (classDef) {
	var ctors;
	var i;
	var members;
	var member;
	this._emittingClass = classDef;
	try {
		ctors = _Util$findFunctions$LClassDefinition$SB(classDef, "constructor", false);
		for (i = 0; i < ctors.length; ++ i) {
			this._emitConstructor$LMemberFunctionDefinition$(ctors[i]);
		}
		this._emitClassObjectAmendments$LClassDefinition$ALMemberFunctionDefinition$(classDef, ctors);
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


JavaScriptEmitter.prototype._emitStaticInitializationCode$LClassDefinition$ = function (classDef) {
	var members;
	var i;
	var member;
	if (this.isJsModule$LClassDefinition$(classDef)) {
		this._emit$SLToken$("var js = { global: function () { return this; }() };\n", null);
		return;
	}
	if (classDef.getNativeSource$() != null) {
		this._emit$SLToken$("var " + this._namer.getNameOfClass$LClassDefinition$(classDef) + " = " + Util$decodeStringLiteral$S(classDef.getNativeSource$().getValue$()) + ";\n", classDef.getNativeSource$());
	}
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return;
	}
	members = classDef.members$();
	for (i = 0; i < members.length; ++ i) {
		member = members[i];
		if (member instanceof MemberVariableDefinition && (member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) === ClassDefinition.IS_STATIC) {
			this._emitStaticMemberVariable$LMemberVariableDefinition$(member);
		}
	}
};


JavaScriptEmitter.prototype._emitClassMap$ALClassDefinition$ = function (classDefs) {
	var $this = this;
	var i;
	var isFirstEntry;
	var list;
	var pushClass;
	var filename;
	var escapedFilename;
	classDefs = classDefs.concat([]);
	for (i = 0; i < classDefs.length; ) {
		if (classDefs[i].getToken$() == null || (classDefs[i].flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			classDefs.splice(i, 1);
		} else {
			++ i;
		}
	}
	this._emit$SLToken$("\n" + "var $__jsx_classMap = {", null);
	isFirstEntry = true;
	while (classDefs.length !== 0) {
		list = [];
		pushClass = (function (classDef) {
			var ctors;
			var exportedCtor;
			var i;
			var push;
			ctors = _Util$findFunctions$LClassDefinition$SB(classDef, "constructor", false);
			if ((classDef.flags$() & ClassDefinition.IS_EXPORT) !== 0) {
				exportedCtor = null;
				for (i = 0; i < ctors.length; ++ i) {
					if ((ctors[i].flags$() & ClassDefinition.IS_EXPORT) !== 0) {
						exportedCtor = ctors[i];
					}
				}
				if (exportedCtor == null) {
					exportedCtor = ctors[0];
				}
				list.push([ classDef.classFullName$(), $this._namer.getNameOfConstructor$LClassDefinition$ALType$(classDef, exportedCtor.getArgumentTypes$()) ]);
			}
			if (! $this._enableMinifier) {
				if ((classDef.flags$() & ClassDefinition.IS_EXPORT) === 0) {
					list.push([ classDef.classFullName$(), $this._namer.getNameOfClass$LClassDefinition$(classDef) ]);
				}
				push = (function (argTypes) {
					list.push([ classDef.classFullName$() + $this._mangler.mangleFunctionArguments$ALType$(argTypes), $this._namer.getNameOfConstructor$LClassDefinition$ALType$(classDef, argTypes) ]);
				});
				if (ctors.length === 0) {
					push([]);
				} else {
					for (i = 0; i < ctors.length; ++ i) {
						push(ctors[i].getArgumentTypes$());
					}
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
		if (list.length !== 0 || ! this._enableMinifier) {
			if (isFirstEntry) {
				this._emit$SLToken$("\n", null);
				this._advanceIndent$();
				isFirstEntry = false;
			} else {
				this._emit$SLToken$(",\n", null);
			}
			escapedFilename = JSON.stringify(this._platform.encodeFilename$S(filename));
			this._emit$SLToken$(escapedFilename + ": ", null);
			this._emit$SLToken$("{\n", null);
			this._advanceIndent$();
			for (i = 0; i < list.length; ++ i) {
				this._emit$SLToken$(_Util$encodeObjectLiteralKey$S(list[i][0]) + ": " + list[i][1], null);
				if (i !== list.length - 1) {
					this._emit$SLToken$(",", null);
				}
				this._emit$SLToken$("\n", null);
			}
			this._reduceIndent$();
			this._emit$SLToken$("}", null);
		}
	}
	if (! isFirstEntry) {
		this._emit$SLToken$("\n", null);
		this._reduceIndent$();
	}
	this._emit$SLToken$("};\n\n", null);
};


JavaScriptEmitter.prototype.getOutput$ = function () {
	var output;
	output = this._output + "\n";
	if (this._enableProfiler) {
		output += this._platform.load$S(this._platform.getRoot$() + "/src/js/profiler.js");
	}
	if (this._bootstrapBuilder != null) {
		output = this._bootstrapBuilder.addBootstrap$S(output);
	}
	output += this._fileFooter;
	if (this._sourceMapper) {
		output += this._sourceMapper.magicToken$();
	}
	if (this._enableMinifier) {
		output = _Minifier$minifyJavaScript$S(output);
	}
	return output;
};


JavaScriptEmitter.prototype._emitClassObjectAmendments$LClassDefinition$ALMemberFunctionDefinition$ = function (classDef, constructors) {
	var $this = this;
	var extendClassDef;
	var i;
	var implementTypes;
	var unresolvedExports;
	if (classDef.extendType$() != null) {
		extendClassDef = classDef.extendType$().getClassDef$();
	} else {
		extendClassDef = null;
	}
	if (constructors.length !== 0) {
		this._emit$SLToken$("$__jsx_extend([", null);
		for (i = 0; i < constructors.length; ++ i) {
			if (i !== 0) {
				this._emit$SLToken$(", ", null);
			}
			this._emit$SLToken$(this._namer.getNameOfConstructor$LClassDefinition$ALType$(classDef, constructors[i].getArgumentTypes$()), null);
		}
		this._emit$SLToken$("], " + (extendClassDef != null ? this._namer.getNameOfClass$LClassDefinition$(extendClassDef) : "Object") + ");\n", null);
	} else {
		this._emit$SLToken$("function " + this._namer.getNameOfClass$LClassDefinition$(classDef) + "() {}\n", null);
		this._emit$SLToken$("$__jsx_extend([" + this._namer.getNameOfClass$LClassDefinition$(classDef) + "], " + (extendClassDef != null ? this._namer.getNameOfClass$LClassDefinition$(extendClassDef) : "Object") + ");\n", null);
	}
	implementTypes = classDef.implementTypes$();
	if (implementTypes.length !== 0) {
		for (i = 0; i < implementTypes.length; ++ i) {
			this._emit$SLToken$("$__jsx_merge_interface(" + this._namer.getNameOfClass$LClassDefinition$(classDef) + ", " + this._namer.getNameOfClass$LClassDefinition$(implementTypes[i].getClassDef$()) + ");\n", null);
		}
		unresolvedExports = {};
		(function buildUnresolvedExports(baseClassDef) {
			if (baseClassDef.extendType$() != null) {
				buildUnresolvedExports(baseClassDef.extendType$().getClassDef$());
			}
			baseClassDef.implementTypes$().forEach((function (implType) {
				buildUnresolvedExports(implType.getClassDef$());
			}));
			baseClassDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				if ((funcDef.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) === ClassDefinition.IS_EXPORT && funcDef.name$() !== "constructor") {
					if (classDef == baseClassDef && funcDef.getStatements$() != null) {
						delete unresolvedExports[funcDef.name$()];
					} else {
						unresolvedExports[funcDef.name$()] = funcDef.getArgumentTypes$();
					}
				}
				return true;
			}));
		})(classDef);
		for (i = implementTypes.length - 1; i >= 0 && Object.keys(unresolvedExports).length !== 0; -- i) {
			implementTypes[i].getClassDef$().forEachClassToBase$F$LClassDefinition$B$((function (baseClassDef) {
				var name;
				for (name in unresolvedExports) {
					unresolvedExports[name];
					if (Util$findFunctionInClass$LClassDefinition$SALType$B(baseClassDef, name, unresolvedExports[name], false)) {
						$this._emit$SLToken$($this._namer.getNameOfClass$LClassDefinition$(classDef) + ".prototype." + name + " = " + $this._namer.getNameOfClass$LClassDefinition$(classDef) + ".prototype." + $this._namer.getNameOfMethod$LClassDefinition$SALType$(classDef, name, unresolvedExports[name]) + ";\n", null);
						delete unresolvedExports[name];
					}
				}
				return Object.keys(unresolvedExports).length !== 0;
			}));
		}
		this._emit$SLToken$("\n", null);
	}
	if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(classDef) + ".prototype.$__jsx_implements_" + this._namer.getNameOfClass$LClassDefinition$(classDef) + " = true;\n\n", null);
	}
};


JavaScriptEmitter.prototype._emitConstructor$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var funcName;
	funcName = this._namer.getNameOfConstructor$LClassDefinition$ALType$(funcDef.getClassDef$(), funcDef.getArgumentTypes$());
	this._emit$SLToken$("function ", null);
	this._emit$SLToken$(funcName + "(", funcDef.getClassDef$().getToken$());
	this._namer.enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
		$this._emitFunctionArguments$LMemberFunctionDefinition$(funcDef);
		$this._emit$SLToken$(") {\n", null);
		$this._advanceIndent$();
		$this._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
		$this._reduceIndent$();
		$this._emit$SLToken$("};\n\n", null);
	}));
};


JavaScriptEmitter.prototype._emitFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var isStatic;
	isStatic = (funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0;
	if (isStatic) {
		this._emit$SLToken$("function " + this._namer.getNameOfStaticFunction$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + "(", funcDef.getNameToken$());
	} else {
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + ".prototype." + this._namer.getNameOfMethod$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + " = function (", funcDef.getNameToken$());
	}
	this._namer.enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
		$this._emitFunctionArguments$LMemberFunctionDefinition$(funcDef);
		$this._emit$SLToken$(") {\n", null);
		$this._advanceIndent$();
		$this._emitFunctionBody$LMemberFunctionDefinition$(funcDef);
		$this._reduceIndent$();
		$this._emit$SLToken$("};\n\n", null);
	}));
	if (isStatic) {
		if (Util$memberIsExported$LClassDefinition$SALType$B(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$(), true)) {
			this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + "." + funcDef.name$() + " = " + this._namer.getNameOfStaticFunction$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + ";\n", null);
		}
		if (! this._enableMinifier) {
			this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + "." + funcDef.name$() + this._mangler.mangleFunctionArguments$ALType$(funcDef.getArgumentTypes$()) + " = " + this._namer.getNameOfStaticFunction$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + ";\n", null);
		}
	} else {
		if (Util$memberIsExported$LClassDefinition$SALType$B(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$(), false)) {
			this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + ".prototype." + funcDef.name$() + " = " + this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + ".prototype." + this._namer.getNameOfMethod$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + ";\n", null);
		}
	}
	this._emit$SLToken$("\n", null);
};


JavaScriptEmitter.prototype._emitFunctionArguments$LMemberFunctionDefinition$ = function (funcDef) {
	var args;
	var i;
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++ i) {
		if (i !== 0) {
			this._emit$SLToken$(", ", null);
		}
		this._emit$SLToken$(this._namer.getNameOfLocalVariable$LLocalVariable$(args[i]), args[i].getName$());
	}
};


JavaScriptEmitter.prototype._emitFunctionBody$LMemberFunctionDefinition$ = function (funcDef) {
	var prevEmittingFunction;
	var locals;
	var i;
	var type;
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
			this._emit$SLToken$("var " + this._namer.getNameOfLocalVariable$LLocalVariable$(locals[i]) + ";\n", null);
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


JavaScriptEmitter.prototype._emitStaticMemberVariable$LMemberVariableDefinition$ = function (variable) {
	var initialValue;
	initialValue = variable.getInitialValue$();
	if (initialValue != null && ! (initialValue instanceof NullExpression || initialValue instanceof BooleanLiteralExpression || initialValue instanceof IntegerLiteralExpression || initialValue instanceof NumberLiteralExpression || initialValue instanceof StringLiteralExpression || initialValue instanceof RegExpLiteralExpression)) {
		this._emit$SLToken$("$__jsx_lazy_init(", variable.getNameToken$());
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(variable.getClassDef$()) + ", \"" + this._namer.getNameOfStaticVariable$LClassDefinition$S(variable.getClassDef$(), variable.name$()) + "\", function () {\n", variable.getNameToken$());
		this._advanceIndent$();
		this._emit$SLToken$("return ", variable.getNameToken$());
		this._emitRHSOfAssignment$LExpression$LType$(initialValue, variable.getType$());
		this._emit$SLToken$(";\n", variable.getNameToken$());
		this._reduceIndent$();
		this._emit$SLToken$("});\n", variable.getNameToken$());
	} else {
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(variable.getClassDef$()) + "." + this._namer.getNameOfStaticVariable$LClassDefinition$S(variable.getClassDef$(), variable.name$()) + " = ", variable.getNameToken$());
		this._emitRHSOfAssignment$LExpression$LType$(initialValue, variable.getType$());
		this._emit$SLToken$(";\n", initialValue.getToken$());
	}
};


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


JavaScriptEmitter.prototype._emitStatements$ALStatement$ = function (statements) {
	var i;
	this._advanceIndent$();
	for (i = 0; i < statements.length; ++ i) {
		this._emitStatement$LStatement$(statements[i]);
	}
	this._reduceIndent$();
};


JavaScriptEmitter.prototype._emitStatement$LStatement$ = function (statement) {
	var emitter;
	emitter = this._getStatementEmitterFor$LStatement$(statement);
	emitter.emit$();
};


JavaScriptEmitter.prototype._addSourceMapping$LToken$ = function (token) {
	var lastNewLinePos;
	var genColumn;
	var genPos;
	var tokenValue;
	var origPos;
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


JavaScriptEmitter.prototype._advanceIndent$ = function () {
	++ this._indent;
};


JavaScriptEmitter.prototype._reduceIndent$ = function () {
	if (-- this._indent < 0) {
		throw new Error("indent mistach");
	}
};


JavaScriptEmitter.prototype._getIndent$ = function () {
	var s;
	var i;
	s = "";
	for (i = 0; i < this._indent; ++ i) {
		s += "\t";
	}
	return s;
};


JavaScriptEmitter.prototype._getStatementEmitterFor$LStatement$ = function (statement) {
	if (statement instanceof ConstructorInvocationStatement) {
		return new _ConstructorInvocationStatementEmitter(this, statement);
	} else {
		if (statement instanceof ExpressionStatement) {
			return new _ExpressionStatementEmitter(this, statement);
		} else {
			if (statement instanceof FunctionStatement) {
				return new _FunctionStatementEmitter(this, statement);
			} else {
				if (statement instanceof ReturnStatement) {
					return new _ReturnStatementEmitter(this, statement);
				} else {
					if (statement instanceof DeleteStatement) {
						return new _DeleteStatementEmitter(this, statement);
					} else {
						if (statement instanceof BreakStatement) {
							return new _BreakStatementEmitter(this, statement);
						} else {
							if (statement instanceof ContinueStatement) {
								return new _ContinueStatementEmitter(this, statement);
							} else {
								if (statement instanceof DoWhileStatement) {
									return new _DoWhileStatementEmitter(this, statement);
								} else {
									if (statement instanceof ForInStatement) {
										return new _ForInStatementEmitter(this, statement);
									} else {
										if (statement instanceof ForStatement) {
											return new _ForStatementEmitter(this, statement);
										} else {
											if (statement instanceof IfStatement) {
												return new _IfStatementEmitter(this, statement);
											} else {
												if (statement instanceof SwitchStatement) {
													return new _SwitchStatementEmitter(this, statement);
												} else {
													if (statement instanceof CaseStatement) {
														return new _CaseStatementEmitter(this, statement);
													} else {
														if (statement instanceof DefaultStatement) {
															return new _DefaultStatementEmitter(this, statement);
														} else {
															if (statement instanceof WhileStatement) {
																return new _WhileStatementEmitter(this, statement);
															} else {
																if (statement instanceof TryStatement) {
																	return new _TryStatementEmitter(this, statement);
																} else {
																	if (statement instanceof CatchStatement) {
																		return new _CatchStatementEmitter(this, statement);
																	} else {
																		if (statement instanceof ThrowStatement) {
																			return new _ThrowStatementEmitter(this, statement);
																		} else {
																			if (statement instanceof AssertStatement) {
																				return new _AssertStatementEmitter(this, statement);
																			} else {
																				if (statement instanceof LogStatement) {
																					return new _LogStatementEmitter(this, statement);
																				} else {
																					if (statement instanceof DebuggerStatement) {
																						return new _DebuggerStatementEmitter(this, statement);
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
	throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize$()));
};


JavaScriptEmitter.prototype._getExpressionEmitterFor$LExpression$ = function (expr) {
	if (expr instanceof LocalExpression) {
		return new _LocalExpressionEmitter(this, expr);
	} else {
		if (expr instanceof ClassExpression) {
			return new _ClassExpressionEmitter(this, expr);
		} else {
			if (expr instanceof NullExpression) {
				return new _NullExpressionEmitter(this, expr);
			} else {
				if (expr instanceof BooleanLiteralExpression) {
					return new _BooleanLiteralExpressionEmitter(this, expr);
				} else {
					if (expr instanceof IntegerLiteralExpression) {
						return new _IntegerLiteralExpressionEmitter(this, expr);
					} else {
						if (expr instanceof NumberLiteralExpression) {
							return new _NumberLiteralExpressionEmitter(this, expr);
						} else {
							if (expr instanceof StringLiteralExpression) {
								return new _StringLiteralExpressionEmitter(this, expr);
							} else {
								if (expr instanceof RegExpLiteralExpression) {
									return new _RegExpLiteralExpressionEmitter(this, expr);
								} else {
									if (expr instanceof ArrayLiteralExpression) {
										return new _ArrayLiteralExpressionEmitter(this, expr);
									} else {
										if (expr instanceof MapLiteralExpression) {
											return new _MapLiteralExpressionEmitter(this, expr);
										} else {
											if (expr instanceof ThisExpression) {
												return new _ThisExpressionEmitter(this, expr);
											} else {
												if (expr instanceof BitwiseNotExpression) {
													return new _UnaryExpressionEmitter(this, expr);
												} else {
													if (expr instanceof InstanceofExpression) {
														return new _InstanceofExpressionEmitter(this, expr);
													} else {
														if (expr instanceof AsExpression) {
															return new _AsExpressionEmitter(this, expr);
														} else {
															if (expr instanceof AsNoConvertExpression) {
																return new _AsNoConvertExpressionEmitter(this, expr);
															} else {
																if (expr instanceof LogicalNotExpression) {
																	return new _UnaryExpressionEmitter(this, expr);
																} else {
																	if (expr instanceof TypeofExpression) {
																		return new _UnaryExpressionEmitter(this, expr);
																	} else {
																		if (expr instanceof PostIncrementExpression) {
																			return new _PostfixExpressionEmitter(this, expr);
																		} else {
																			if (expr instanceof PreIncrementExpression) {
																				return new _UnaryExpressionEmitter(this, expr);
																			} else {
																				if (expr instanceof PropertyExpression) {
																					return new _PropertyExpressionEmitter(this, expr);
																				} else {
																					if (expr instanceof SignExpression) {
																						return new _UnaryExpressionEmitter(this, expr);
																					} else {
																						if (expr instanceof AdditiveExpression) {
																							return new _AdditiveExpressionEmitter(this, expr);
																						} else {
																							if (expr instanceof ArrayExpression) {
																								return new _ArrayExpressionEmitter(this, expr);
																							} else {
																								if (expr instanceof AssignmentExpression) {
																									return new _AssignmentExpressionEmitter(this, expr);
																								} else {
																									if (expr instanceof BinaryNumberExpression) {
																										return new _BinaryNumberExpressionEmitter(this, expr);
																									} else {
																										if (expr instanceof EqualityExpression) {
																											return new _EqualityExpressionEmitter(this, expr);
																										} else {
																											if (expr instanceof InExpression) {
																												return new _InExpressionEmitter(this, expr);
																											} else {
																												if (expr instanceof LogicalExpression) {
																													return new _LogicalExpressionEmitter(this, expr);
																												} else {
																													if (expr instanceof ShiftExpression) {
																														return new _ShiftExpressionEmitter(this, expr);
																													} else {
																														if (expr instanceof ConditionalExpression) {
																															return new _ConditionalExpressionEmitter(this, expr);
																														} else {
																															if (expr instanceof CallExpression) {
																																return new _CallExpressionEmitter(this, expr);
																															} else {
																																if (expr instanceof SuperExpression) {
																																	return new _SuperExpressionEmitter(this, expr);
																																} else {
																																	if (expr instanceof NewExpression) {
																																		return new _NewExpressionEmitter(this, expr);
																																	} else {
																																		if (expr instanceof FunctionExpression) {
																																			return new _FunctionExpressionEmitter(this, expr);
																																		} else {
																																			if (expr instanceof CommaExpression) {
																																				return new _CommaExpressionEmitter(this, expr);
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


JavaScriptEmitter.prototype._emitCallArguments$LToken$SALExpression$ALType$ = function (token, prefix, args, argTypes) {
	var i;
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


JavaScriptEmitter.prototype._emitAssertion$F$V$LToken$S = function (emitTestExpr, token, message) {
	var s;
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


JavaScriptEmitter.prototype._emitWithNullableGuard$LExpression$N = function (expr, outerOpPrecedence) {
	var $this = this;
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


JavaScriptEmitter.prototype._emitRHSOfAssignment$LExpression$LType$ = function (expr, lhsType) {
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


function JavaScriptEmitter$_initialize$() {
	var precedence;
	var i;
	var opTypeList;
	var j;
	var key;
	if (JavaScriptEmitter._initialized) {
		return;
	}
	JavaScriptEmitter._initialized = true;
	precedence = [ [ ({ "new": _NewExpressionEmitter$_setOperatorPrecedence$SN }), ({ "[": _ArrayExpressionEmitter$_setOperatorPrecedence$SN }), ({ ".": _PropertyExpressionEmitter$_setOperatorPrecedence$SN }), ({ "(": _CallExpressionEmitter$_setOperatorPrecedence$SN }), ({ "super": _SuperExpressionEmitter$_setOperatorPrecedence$SN }), ({ "function": _FunctionExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "++": _PostfixExpressionEmitter$_setOperatorPrecedence$SN }), ({ "--": _PostfixExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "void": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "typeof": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "++": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "--": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "+": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "~": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "!": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "*": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "/": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "%": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "+": _AdditiveExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "<<": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>>": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "<": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "<=": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">=": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "instanceof": _InstanceofExpressionEmitter$_setOperatorPrecedence$SN }), ({ "in": _InExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "==": _EqualityExpressionEmitter$_setOperatorPrecedence$SN }), ({ "!=": _EqualityExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "&": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "^": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "|": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "&&": _LogicalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "||": _LogicalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "*=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "/=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "%=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "+=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "<<=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>>=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "&=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "^=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "|=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "?": _ConditionalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ ",": _CommaExpressionEmitter$_setOperatorPrecedence$SN }) ] ];
	for (i = 0; i < precedence.length; ++ i) {
		opTypeList = precedence[i];
		for (j = 0; j < opTypeList.length; ++ j) {
			for (key in opTypeList[j]) {
				opTypeList[j][key](key, - (precedence.length - i));
			}
		}
	}
};

JavaScriptEmitter._initialize$ = JavaScriptEmitter$_initialize$;

function LocalVariable(name, type) {
	Stashable.call(this);
	this.isInstantiated = false;
	this._name = name;
	this._type = type;
	this._instantiated = [];
};

$__jsx_extend([LocalVariable], Object);
$__jsx_merge_interface(LocalVariable, Stashable);

LocalVariable.prototype.serialize$ = function () {
	return [ this._name, Serializer$Type$E$serializeNullable$LType$(this._type) ];
};


LocalVariable.prototype.getName$ = function () {
	return this._name;
};


LocalVariable.prototype.getType$ = function () {
	return this._type;
};


LocalVariable.prototype.setType$LType$ = function (type) {
	if (this._type != null) {
		throw new Error("type is already set for " + this.toString());
	}
	if (type.equals$LType$(Type.integerType)) {
		type = Type.numberType;
	}
	this._type = type;
};


LocalVariable.prototype.setTypeForced$LType$ = function (type) {
	this._type = type;
};


LocalVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	if (isAssignment) {
		context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this);
	} else {
		switch (context.getTopBlock$().localVariableStatuses.getStatus$LLocalVariable$(this)) {
		case LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION:
			context.errors.push(new CompileError(token, "the return type of recursive function needs to be explicitly declared"));
			return false;
		case LocalVariableStatuses.ISSET:
			break;
		case LocalVariableStatuses.UNSET:
			context.errors.push(new CompileError(token, "variable is not initialized"));
			return false;
		case LocalVariableStatuses.MAYBESET:
			context.errors.push(new CompileError(token, "variable may not be initialized"));
			return false;
		default:
			throw new Error("logic flaw");
		}
	}
	return true;
};


LocalVariable.prototype.toString = function () {
	return this._name.getValue$() + " : " + this._type.toString();
};


LocalVariable.prototype.popInstantiated$ = function () {
	this._instantiated.pop();
};


LocalVariable.prototype.getInstantiated$ = function () {
	if (this._instantiated.length === 0) {
		throw new Error("logic flaw, no instantiation for " + this._name.getValue$() + "," + (this.isInstantiated + ""));
	}
	return this._instantiated[this._instantiated.length - 1];
};


LocalVariable.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	var instantiated;
	instantiated = this._instantiate$LInstantiationContext$(instantiationContext);
	instantiated.isInstantiated = true;
	this._instantiated.push(instantiated);
	return instantiated;
};


LocalVariable.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	var type;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	return new LocalVariable(this._name, type);
};


function CaughtVariable(name, type) {
	LocalVariable.call(this, name, type);
};

$__jsx_extend([CaughtVariable], LocalVariable);
CaughtVariable.prototype.clone$ = function () {
	return new CaughtVariable(this._name, this._type);
};


CaughtVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	return true;
};


CaughtVariable.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	return new CaughtVariable(this._name, this._type.instantiate$LInstantiationContext$(instantiationContext));
};


CaughtVariable.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	return LocalVariable.prototype.instantiateAndPush$LInstantiationContext$.call(this, instantiationContext);
};


function ArgumentDeclaration(name, type) {
	LocalVariable.call(this, name, type);
};

$__jsx_extend([ArgumentDeclaration], LocalVariable);
ArgumentDeclaration.prototype.clone$ = function () {
	return new ArgumentDeclaration(this._name, this._type);
};


ArgumentDeclaration.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	var type;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	return new ArgumentDeclaration(this._name, type);
};


ArgumentDeclaration.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	return LocalVariable.prototype.instantiateAndPush$LInstantiationContext$.call(this, instantiationContext);
};


function LocalVariableStatuses(funcDef, base) {
	var k;
	var args;
	var i;
	var locals;
	this._isReachable = false;
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
	this._isReachable = true;
};

function LocalVariableStatuses$0(srcStatus) {
	this._isReachable = false;
	this._statuses = {};
	this._copyFrom$LLocalVariableStatuses$(srcStatus);
	this._isReachable = srcStatus._isReachable;
};

$__jsx_extend([LocalVariableStatuses, LocalVariableStatuses$0], Object);
LocalVariableStatuses.prototype.clone$ = function () {
	return new LocalVariableStatuses$0(this);
};


LocalVariableStatuses.prototype.merge$LLocalVariableStatuses$ = function (that) {
	var ret;
	var k;
	if (this._isReachable !== that._isReachable) {
		if (this._isReachable) {
			return this.clone$();
		} else {
			return that.clone$();
		}
	}
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


LocalVariableStatuses.prototype.mergeFinally$LLocalVariableStatuses$ = function (postFinallyStats) {
	var ret;
	var k;
	ret = this.clone$();
	for (k in ret._statuses) {
		switch (postFinallyStats._statuses[k]) {
		case LocalVariableStatuses.ISSET:
			ret._statuses[k] = LocalVariableStatuses.ISSET;
			break;
		case LocalVariableStatuses.MAYBESET:
			if (ret._statuses[k] != LocalVariableStatuses.ISSET) {
				ret._statuses[k] = LocalVariableStatuses.MAYBESET;
			}
			break;
		}
	}
	if (! postFinallyStats._isReachable) {
		ret._isReachable = false;
	}
	return ret;
};


LocalVariableStatuses.prototype.setStatus$LLocalVariable$ = function (local) {
	var name;
	name = local.getName$().getValue$();
	if (this._statuses[name] == null) {
		throw new Error("logic flaw, could not find status for local variable: " + name);
	}
	this._statuses[name] = LocalVariableStatuses.ISSET;
};


LocalVariableStatuses.prototype.getStatus$LLocalVariable$ = function (local) {
	var name;
	name = local.getName$().getValue$();
	if (this._statuses[name] == null) {
		throw new Error("logic flaw, could not find status for local variable: " + name);
	}
	return this._statuses[name];
};


LocalVariableStatuses.prototype.isReachable$ = function () {
	return this._isReachable;
};


LocalVariableStatuses.prototype.setIsReachable$B = function (isReachable) {
	this._isReachable = isReachable;
};


LocalVariableStatuses.prototype._copyFrom$LLocalVariableStatuses$ = function (that) {
	var k;
	for (k in that._statuses) {
		this._statuses[k] = that._statuses[k];
	}
};


function CompileIssue(token, message) {
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

function CompileIssue$0(filename, lineNumber, columnNumber, message) {
	this._filename = filename;
	this._lineNumber = lineNumber;
	this._columnNumber = columnNumber;
	this._message = message;
	this._size = 1;
};

$__jsx_extend([CompileIssue, CompileIssue$0], Object);
CompileIssue.prototype.format$LPlatform$ = function (platform) {
	return Util$makeErrorMessage$LPlatform$SUSNNN(platform, this.getPrefix$() + this._message, this._filename, this._lineNumber, this._columnNumber, this._size);
};


function CompileError(token, message) {
	CompileIssue.call(this, token, message);
	this._notes = [];
};

function CompileError$0(filename, lineNumber, columnNumber, message) {
	CompileIssue$0.call(this, filename, lineNumber, columnNumber, message);
	this._notes = [];
};

$__jsx_extend([CompileError, CompileError$0], CompileIssue);
CompileError.prototype.addCompileNote$LCompileNote$ = function (note) {
	this._notes.push(note);
	return this;
};


CompileError.prototype.addCompileNotes$ALCompileNote$ = function (notes) {
	var $this = this;
	notes.forEach((function (note) {
		$this.addCompileNote$LCompileNote$(note);
	}));
};


CompileError.prototype.getCompileNotes$ = function () {
	return this._notes;
};


CompileError.prototype.getPrefix$ = function () {
	return "";
};


function CompileWarning(token, message) {
	CompileError.call(this, token, message);
};

function CompileWarning$0(filename, lineNumber, columnNumber, message) {
	CompileError$0.call(this, filename, lineNumber, columnNumber, message);
};

$__jsx_extend([CompileWarning, CompileWarning$0], CompileError);
CompileWarning.prototype.getPrefix$ = function () {
	return "Warning: ";
};


function DeprecatedWarning(token, message) {
	CompileWarning.call(this, token, message);
};

function DeprecatedWarning$0(filename, lineNumber, columnNumber, message) {
	CompileWarning$0.call(this, filename, lineNumber, columnNumber, message);
};

$__jsx_extend([DeprecatedWarning, DeprecatedWarning$0], CompileWarning);
function CompileNote(token, message) {
	CompileIssue.call(this, token, message);
};

function CompileNote$0(filename, lineNumber, columnNumber, message) {
	CompileIssue$0.call(this, filename, lineNumber, columnNumber, message);
};

$__jsx_extend([CompileNote, CompileNote$0], CompileIssue);
CompileNote.prototype.getPrefix$ = function () {
	return "Note: ";
};


function TemplateDefinition() {
};

$__jsx_extend([TemplateDefinition], Object);
TemplateDefinition.prototype.$__jsx_implements_TemplateDefinition = true;

TemplateDefinition.prototype.buildInstantiationContext$ALCompileError$LToken$ALToken$ALType$ = function (errors, token, formalTypeArgs, actualTypeArgs) {
	var typemap;
	var i;
	if (formalTypeArgs.length !== actualTypeArgs.length) {
		errors.push(new CompileError(token, "wrong number of template arguments (expected " + (formalTypeArgs.length + "") + ", got " + (actualTypeArgs.length + "") + ")"));
		return null;
	}
	typemap = {};
	for (i = 0; i < formalTypeArgs.length; ++ i) {
		typemap[formalTypeArgs[i].getValue$()] = actualTypeArgs[i];
	}
	return new InstantiationContext(errors, typemap);
};


function ClassDefinition(token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment) {
	Stashable.call(this);
	this._baseClassDef = null;
	this._outerClassDef = null;
	this._nativeSource = null;
	this._parser = null;
	this._token = token;
	this._className = className;
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

$__jsx_extend([ClassDefinition], Object);
$__jsx_merge_interface(ClassDefinition, Stashable);

ClassDefinition.prototype.serialize$ = function () {
	return ({ "token": this._token, "name": this._className, "flags": this._flags, "extends": Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$(this._extendType), "implements": Serializer$ParsedObjectType$E$serializeArray$ALParsedObjectType$(this._implementTypes), "members": Serializer$MemberDefinition$E$serializeArray$ALMemberDefinition$(this._members) });
};


function ClassDefinition$serialize$ALClassDefinition$(classDefs) {
	var s;
	var i;
	s = [];
	for (i = 0; i < classDefs.length; ++ i) {
		s[i] = classDefs[i].serialize$();
	}
	return s;
};

ClassDefinition.serialize$ALClassDefinition$ = ClassDefinition$serialize$ALClassDefinition$;

ClassDefinition.prototype.getParser$ = function () {
	return this._parser;
};


ClassDefinition.prototype.setParser$LParser$ = function (parser) {
	this._parser = parser;
};


ClassDefinition.prototype.getNativeSource$ = function () {
	return this._nativeSource;
};


ClassDefinition.prototype.setNativeSource$LToken$ = function (nativeSource) {
	this._nativeSource = nativeSource;
};


ClassDefinition.prototype.getToken$ = function () {
	return this._token;
};


ClassDefinition.prototype.className$ = function () {
	return this._className;
};


ClassDefinition.prototype.classFullName$ = function () {
	return (this._outerClassDef != null ? this._outerClassDef.classFullName$() + "." + this._className : this.className$());
};


ClassDefinition.prototype.flags$ = function () {
	return this._flags;
};


ClassDefinition.prototype.setFlags$N = function (flags) {
	this._flags = flags;
};


ClassDefinition.prototype.extendType$ = function () {
	return this._extendType;
};


ClassDefinition.prototype.implementTypes$ = function () {
	return this._implementTypes;
};


ClassDefinition.prototype.members$ = function () {
	return this._members;
};


ClassDefinition.prototype.setOuterClassDef$LClassDefinition$ = function (outer) {
	this._outerClassDef = outer;
};


ClassDefinition.prototype.getOuterClassDef$ = function () {
	return this._outerClassDef;
};


ClassDefinition.prototype.getInnerClasses$ = function () {
	return this._inners;
};


ClassDefinition.prototype.getTemplateInnerClasses$ = function () {
	return this._templateInners;
};


ClassDefinition.prototype.getDocComment$ = function () {
	return this._docComment;
};


ClassDefinition.prototype.setDocComment$LDocComment$ = function (docComment) {
	this._docComment = docComment;
};


ClassDefinition.prototype.forEachClassToBase$F$LClassDefinition$B$ = function (cb) {
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


ClassDefinition.prototype.forEachClassFromBase$F$LClassDefinition$B$ = function (cb) {
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


ClassDefinition.prototype.forEachMember$F$LMemberDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (! cb(this._members[i])) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype.forEachMemberVariable$F$LMemberVariableDefinition$B$ = function (cb) {
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


ClassDefinition.prototype.forEachMemberFunction$F$LMemberFunctionDefinition$B$ = function (cb) {
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


ClassDefinition.prototype.forEachInnerClass$F$LClassDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._inners.length; ++ i) {
		if (! cb(this._inners[i])) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype._resetMembersClassDef$ = function () {
	var $this = this;
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		this._members[i].setClassDef$LClassDefinition$(this);
		this._members[i].forEachClosure$F$LMemberFunctionDefinition$B$((function setClassDef(funcDef) {
			funcDef.setClassDef$LClassDefinition$($this);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(setClassDef);
		}));
	}
	for (i = 0; i < this._inners.length; ++ i) {
		this._inners[i].setOuterClassDef$LClassDefinition$(this);
		this._inners[i]._resetMembersClassDef$();
	}
	for (i = 0; i < this._templateInners.length; ++ i) {
		this._templateInners[i].setOuterClassDef$LClassDefinition$(this);
	}
};


ClassDefinition.prototype.getMemberTypeByName$ALCompileError$LToken$SBALType$N = function (errors, token, name, isStatic, typeArgs, mode) {
	var $this = this;
	var types;
	var pushMatchingMember;
	types = [];
	function pushMatchingMember(classDef) {
		var i;
		var member;
		var type;
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
									if (member.getStatements$() != null || mode !== ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY) {
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
	}
	pushMatchingMember(this);
	switch (types.length) {
	case 0:
		return null;
	case 1:
		return types[0];
	default:
		return new FunctionChoiceType(types.map((function (t) {
			return t;
		})));
	}
};


ClassDefinition.prototype.lookupInnerClass$S = function (className) {
	var i;
	var inner;
	for (i = 0; i < this._inners.length; ++ i) {
		inner = this._inners[i];
		if (inner.className$() === className) {
			return inner;
		}
	}
	return null;
};


ClassDefinition.prototype.lookupTemplateInnerClass$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var instantiateCallback;
	instantiateCallback = this.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback);
	if (instantiateCallback != null) {
		return instantiateCallback(errors, request, postInstantiationCallback);
	}
	return null;
};


ClassDefinition.prototype.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var $this = this;
	var i;
	var classDef;
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
				var classDef;
				classDef = templateDef.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$(errors, request);
				if (classDef == null) {
					return null;
				}
				$this._inners.push(classDef);
				classDef.setParser$LParser$($this._parser);
				classDef.resolveTypes$LAnalysisContext$(new AnalysisContext(errors, $this._parser, null));
				postInstantiationCallback($this._parser, classDef);
				return classDef;
			});
		}
	}
	return null;
};


ClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var context;
	var succeeded;
	var members;
	var i;
	var member;
	var inners;
	var inner;
	var templateInners;
	var templateInner;
	var extendType;
	var type;
	var implementTypes;
	context = new InstantiationContext(instantiationContext.errors, instantiationContext.typemap);
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
	extendType = null;
	if (this._extendType != null) {
		type = this._extendType.instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++ i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken$(), "non-object type is not extensible"));
			return null;
		}
		implementTypes[i] = type;
	}
	return new ClassDefinition(this._token, this._className, this._flags, extendType, implementTypes, members, inners, templateInners, context.objectTypesUsed, this._docComment);
};


ClassDefinition.prototype.resolveTypes$LAnalysisContext$ = function (context) {
	var $this = this;
	var i;
	var baseClass;
	var j;
	var isNative;
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
				context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend a final class"));
			} else {
				if ((baseClass.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
					context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend an interface, use the 'implements' keyword"));
				} else {
					if ((baseClass.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
						context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend an mixin, use the 'implements' keyword"));
					}
				}
			}
		}
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		baseClass = this._implementTypes[i].getClassDef$();
		if (baseClass != null) {
			if ((baseClass.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError(this._implementTypes[i].getToken$(), "cannot implement a class (only interfaces can be implemented)"));
			} else {
				for (j = i + 1; j < this._implementTypes.length; ++ j) {
					if (this._implementTypes[j].getClassDef$() == baseClass) {
						context.errors.push(new CompileError(this._implementTypes[i].getToken$(), "cannot implement the same interface more than once"));
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
		func = new MemberFunctionDefinition(this._token, new Token("constructor", true), ClassDefinition.IS_FINAL | this.flags$() & ClassDefinition.IS_NATIVE, Type.voidType, [], isNative ? null : [], isNative ? null : [], [], this._token, null);
		func.setClassDef$LClassDefinition$(this);
		this._members.push(func);
	}
	this.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		return funcDef.forEachStatement$F$LStatement$B$((function (statement) {
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				var propExpr;
				var identifierToken;
				var receiverType;
				var receiverClassDef;
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				if (expr instanceof PropertyExpression && expr.getExpr$() instanceof ClassExpression) {
					propExpr = expr;
					identifierToken = propExpr.getIdentifierToken$();
					receiverType = propExpr.getExpr$().getType$();
					receiverClassDef = receiverType.getClassDef$();
					if (receiverClassDef) {
						receiverClassDef.forEachInnerClass$F$LClassDefinition$B$((function (classDef) {
							var objectType;
							if (classDef.className$() === identifierToken.getValue$()) {
								objectType = new ParsedObjectType(new QualifiedName$1(identifierToken, receiverType), propExpr.getTypeArguments$());
								objectType.resolveType$LAnalysisContext$(context);
								replaceCb(new ClassExpression(propExpr.getToken$(), objectType));
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


ClassDefinition.prototype.setAnalysisContextOfVariables$LAnalysisContext$ = function (context) {
	var i;
	var member;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member instanceof MemberVariableDefinition) {
			member.setAnalysisContext$LAnalysisContext$(context);
		}
	}
};


ClassDefinition.prototype.analyze$LAnalysisContext$ = function (context) {
	var token;
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


ClassDefinition.prototype._analyzeClassDef$LAnalysisContext$ = function (context) {
	var $this = this;
	var implementClassDefs;
	var i;
	var allMixins;
	var interfaceDef;
	var j;
	var theMixin;
	var overrideFunctions;
	var done;
	var k;
	var abstractMembers;
	var msg;
	var usedNames;
	this._baseClassDef = (this.extendType$() != null ? this.extendType$().getClassDef$() : null);
	implementClassDefs = this.implementTypes$().map((function (type) {
		return type.getClassDef$();
	}));
	if ((this.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		if (this._baseClassDef != null) {
			if ((this._baseClassDef.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError(this.getToken$(), "cannot extend final class '" + this._baseClassDef.className$() + "'"));
				return;
			}
			if ((this._baseClassDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
				context.errors.push(new CompileError(this.getToken$(), "interfaces (or mixins) should be implemented, not extended"));
				return;
			}
			if (! this._baseClassDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				if ($this == classDef) {
					context.errors.push(new CompileError($this.getToken$(), "class inheritance is in loop"));
					return false;
				}
				return true;
			}))) {
				return;
			}
		}
	} else {
		for (i = 0; i < implementClassDefs.length; ++ i) {
			if ((implementClassDefs[i].flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError(this.getToken$(), "class '" + implementClassDefs[i].className$() + "' can only be extended, not implemented"));
				return;
			}
			if (! implementClassDefs[i].forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				if ($this == classDef) {
					context.errors.push(new CompileError($this.getToken$(), "class inheritance is in loop"));
					return false;
				}
				return true;
			}))) {
				return;
			}
		}
	}
	allMixins = [];
	if (! this.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
		if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
			if (allMixins.indexOf(classDef) !== - 1) {
				context.errors.push(new CompileError($this.getToken$(), "mixin '" + classDef.className$() + "' is implemented twice"));
				return false;
			}
			allMixins.push(classDef);
		}
		return true;
	}))) {
		return;
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
					context.errors.push(new CompileError(this._members[i].getNameToken$(), "could not find function definition in base classes / mixins to be overridden"));
				}
			}
		}
		for (i = 0; i < this._implementTypes.length; ++ i) {
			if ((this._implementTypes[i].getClassDef$().flags$() & ClassDefinition.IS_MIXIN) === 0) {
				continue;
			}
			theMixin = this._implementTypes[i].getClassDef$();
			overrideFunctions = [];
			theMixin._getMembers$ALMemberDefinition$BNN(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
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
				for (k = 0; k < theMixin._implementTypes.length; ++ k) {
					if (theMixin._implementTypes[k].getClassDef$()._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, overrideFunctions[j]) != null) {
						done = true;
						break;
					}
				}
				if (! done) {
					context.errors.push(new CompileError(this.getToken$(), "could not find function definition to be overridden by '" + overrideFunctions[j].getNotation$() + "'"));
				}
			}
		}
	}
	if ((this._flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		abstractMembers = [];
		this.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			return classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
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
			context.errors.push(new CompileError(this.getToken$(), msg));
		}
	}
	usedNames = {};
	this._getMembers$ALMemberDefinition$F$LMemberDefinition$B$([  ], (function (member) {
		var existingDef;
		var errMsg;
		if (! (member instanceof MemberFunctionDefinition)) {
			return false;
		}
		if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) !== ClassDefinition.IS_EXPORT) {
			return false;
		}
		if (! $__jsx_ObjectHasOwnProperty.call(usedNames, member.name$())) {
			usedNames[member.name$()] = member;
			return false;
		}
		existingDef = usedNames[member.name$()];
		if (existingDef.getType$().equals$LType$(member.getType$())) {
			return false;
		}
		if (($this._flags & ClassDefinition.IS_EXPORT) !== 0 && member.name$() === "constructor") {
			errMsg = "only one constructor is exportable, please mark others using the __noexport__ attribute";
		} else {
			errMsg = "methods with __export__ attribute cannot be overloaded";
		}
		context.errors.push(new CompileError(member.getToken$(), errMsg).addCompileNote$LCompileNote$(new CompileNote(usedNames[member.name$()].getToken$(), "previously defined here")));
		return false;
	}));
};


ClassDefinition.prototype._analyzeMembers$LAnalysisContext$ = function (context) {
	var i;
	var member;
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


ClassDefinition.prototype.analyzeUnusedVariables$ = function () {
	var i;
	var member;
	for (i = 0; i < this._members.length; ++ i) {
		member = this._members[i];
		if (member instanceof MemberVariableDefinition) {
			member.getType$();
		}
	}
};


ClassDefinition.prototype.isConvertibleTo$LClassDefinition$ = function (classDef) {
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


ClassDefinition.prototype._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$ = function (context, member, memberClassDef, token) {
	var numImplementsToCheck;
	var isCheckingSibling;
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


ClassDefinition.prototype._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$ = function (context, member, memberClassDef, token) {
	var i;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i].name$() === member.name$()) {
			if ((this._members[i].flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
				context.errors.push(new CompileError(member.getNameToken$(), Util$format$SAS("cannot define property '%1', the name is already used in class '%2'", [ member.getNotation$(), this.className$() ])));
				return false;
			}
			if (! this._members[i].getType$().equals$LType$(member.getType$())) {
				context.errors.push(new CompileError(member.getNameToken$(), Util$format$SAS("cannot override property '%1' of type '%2' with different type '%3'", [ member.getNotation$(), this._members[i].getType$().toString(), member.getType$().toString() ])));
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


ClassDefinition.prototype._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$B = function (context, member, memberClassDef, token, reportOverridesAsWell) {
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
			context.errors.push(new CompileError(member.getNameToken$(), "overriding functions must have 'override' attribute set (defined in base class '" + this.className$() + "')"));
			return false;
		}
		if (reportOverridesAsWell && (this._members[i].flags$() & ClassDefinition.IS_OVERRIDE) !== 0) {
			context.errors.push(new CompileError(member.getNameToken$(), "definition of the function conflicts with sibling mix-in '" + this.className$() + "'"));
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


ClassDefinition.prototype._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$ = function (context, overrideDef) {
	var i;
	var overrideReturnType;
	var memberReturnType;
	for (i = 0; i < this._members.length; ++ i) {
		if (this._members[i].name$() === overrideDef.name$() && this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags$() & ClassDefinition.IS_STATIC) === 0 && Util$typesAreEqual$ALType$ALType$(this._members[i].getArgumentTypes$(), overrideDef.getArgumentTypes$())) {
			if ((this._members[i].flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError(overrideDef.getToken$(), "cannot override final function defined in class '" + this.className$() + "'"));
				return false;
			}
			overrideReturnType = overrideDef.getReturnType$();
			memberReturnType = this._members[i].getReturnType$();
			if (! (overrideReturnType.equals$LType$(memberReturnType) || overrideReturnType.isConvertibleTo$LType$(memberReturnType)) || memberReturnType instanceof NullableType && ! (overrideReturnType instanceof NullableType)) {
				context.errors.push(new CompileError(overrideDef.getToken$(), "return type '" + overrideReturnType.toString() + "' is not convertible to '" + memberReturnType.toString() + "'"));
				return false;
			} else {
				return true;
			}
		}
	}
	return this._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$(context, overrideDef);
};


ClassDefinition.prototype._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$ = function (context, member) {
	var ret;
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


ClassDefinition.prototype._getMembers$ALMemberDefinition$F$LMemberDefinition$B$ = function (list, cb) {
	var i;
	if (this._baseClassDef != null) {
		this._baseClassDef._getMembers$ALMemberDefinition$F$LMemberDefinition$B$(list, cb);
	}
	for (i = 0; i < this._implementTypes.length; ++ i) {
		this._implementTypes[i].getClassDef$()._getMembers$ALMemberDefinition$F$LMemberDefinition$B$(list, cb);
	}
	for (i = 0; i < this._members.length; ++ i) {
		if (cb(this._members[i])) {
			list.push(this._members[i]);
		}
	}
};


ClassDefinition.prototype._getMembers$ALMemberDefinition$BNN = function (list, functionOnly, flagsMask, flagsMaskMatch) {
	var $this = this;
	this._getMembers$ALMemberDefinition$F$LMemberDefinition$B$(list, (function (member) {
		var j;
		if (functionOnly && ! (member instanceof MemberFunctionDefinition)) {
			return false;
		}
		if ((member.flags$() & flagsMask) !== flagsMaskMatch) {
			return false;
		}
		for (j = 0; j < list.length; ++ j) {
			if (list[j].name$() === member.name$()) {
				if (list[j] instanceof MemberVariableDefinition || Util$typesAreEqual$ALType$ALType$(list[j].getArgumentTypes$(), member.getArgumentTypes$())) {
					return false;
				}
			}
		}
		return true;
	}));
};


ClassDefinition.prototype.hasDefaultConstructor$ = function () {
	var hasCtorWithArgs;
	var i;
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


function ClassDefinition$membersAreEqual$LMemberDefinition$LMemberDefinition$(x, y) {
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

ClassDefinition.membersAreEqual$LMemberDefinition$LMemberDefinition$ = ClassDefinition$membersAreEqual$LMemberDefinition$LMemberDefinition$;

function MemberDefinition(token, nameToken, flags, closures, docComment) {
	Stashable.call(this);
	this._closures = null;
	this._docComment = null;
	this._classDef = null;
	this._token = token;
	this._nameToken = nameToken;
	this._flags = flags;
	this._closures = closures;
	this._docComment = docComment;
	this._classDef = null;
};

$__jsx_extend([MemberDefinition], Object);
$__jsx_merge_interface(MemberDefinition, Stashable);

MemberDefinition.prototype.getToken$ = function () {
	return this._token;
};


MemberDefinition.prototype.getNameToken$ = function () {
	return this._nameToken;
};


MemberDefinition.prototype.name$ = function () {
	return this._nameToken.getValue$();
};


MemberDefinition.prototype.flags$ = function () {
	return this._flags;
};


MemberDefinition.prototype.setFlags$N = function (flags) {
	this._flags = flags;
};


MemberDefinition.prototype.getClosures$ = function () {
	return this._closures;
};


MemberDefinition.prototype.forEachClosure$F$LMemberFunctionDefinition$B$ = function (cb) {
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


MemberDefinition.prototype.getDocComment$ = function () {
	return this._docComment;
};


MemberDefinition.prototype.setDocComment$LDocComment$ = function (docComment) {
	this._docComment = docComment;
};


MemberDefinition.prototype.getClassDef$ = function () {
	return this._classDef;
};


MemberDefinition.prototype.setClassDef$LClassDefinition$ = function (classDef) {
	this._classDef = classDef;
};


MemberDefinition.prototype._instantiateClosures$LInstantiationContext$ = function (instantiationContext) {
	var closures;
	var i;
	closures = [];
	for (i = 0; i < this._closures.length; ++ i) {
		closures[i] = this._closures[i].instantiate$LInstantiationContext$(instantiationContext);
	}
	return closures;
};


MemberDefinition.prototype._updateLinkFromExpressionToClosuresUponInstantiation$LExpression$ALMemberFunctionDefinition$ = function (instantiatedExpr, instantiatedClosures) {
	var $this = this;
	var onExpr;
	function onExpr(expr) {
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
			expr.setFuncDef$LMemberFunctionDefinition$(instantiatedClosures[i]);
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	}
	onExpr(instantiatedExpr);
};


function MemberVariableDefinition(token, name, flags, type, initialValue, closures, docComment) {
	MemberDefinition.call(this, token, name, flags, closures, docComment);
	this._type = type;
	this._initialValue = initialValue;
	this._analyzeState = MemberVariableDefinition.NOT_ANALYZED;
	this._analysisContext = null;
};

$__jsx_extend([MemberVariableDefinition], MemberDefinition);
MemberVariableDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var type;
	var initialValue;
	var closures;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$(instantiationContext) : null);
	initialValue = null;
	if (this._initialValue != null) {
		initialValue = this._initialValue.clone$();
		initialValue.instantiate$LInstantiationContext$(instantiationContext);
		closures = this._instantiateClosures$LInstantiationContext$(instantiationContext);
		this._updateLinkFromExpressionToClosuresUponInstantiation$LExpression$ALMemberFunctionDefinition$(initialValue, closures);
	} else {
		closures = [  ];
	}
	return new MemberVariableDefinition(this._token, this._nameToken, this._flags, type, initialValue, closures, null);
};


MemberVariableDefinition.prototype.toString = function () {
	return this.name$() + " : " + this._type.toString();
};


MemberVariableDefinition.prototype.serialize$ = function () {
	return ({ "token": Serializer$Token$E$serializeNullable$LToken$(this._token), "nameToken": Serializer$Token$E$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "type": Serializer$Type$E$serializeNullable$LType$(this._type), "initialValue": Serializer$Expression$E$serializeNullable$LExpression$(this._initialValue) });
};


MemberVariableDefinition.prototype.setAnalysisContext$LAnalysisContext$ = function (context) {
	this._analysisContext = context.clone$();
};


MemberVariableDefinition.prototype.getType$ = function () {
	var ivType;
	switch (this._analyzeState) {
	case MemberVariableDefinition.NOT_ANALYZED:
		try {
			this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
			if (this._initialValue != null) {
				if (this._initialValue instanceof ClassExpression) {
					this._analysisContext.errors.push(new CompileError(this._initialValue._token, "cannot assign a class"));
					return null;
				}
				if (! this._initialValue.analyze$LAnalysisContext$LExpression$(this._analysisContext, null)) {
					return null;
				}
				ivType = this._initialValue.getType$();
				if (this._type == null) {
					if (ivType.equals$LType$(Type.nullType)) {
						this._analysisContext.errors.push(new CompileError(this._initialValue.getToken$(), "cannot assign null to an unknown type"));
						return null;
					}
					if (ivType.equals$LType$(Type.voidType)) {
						this._analysisContext.errors.push(new CompileError(this._initialValue.getToken$(), "cannot assign void"));
						return null;
					}
					this._type = ivType.asAssignableType$();
				} else {
					if (! ivType.isConvertibleTo$LType$(this._type)) {
						this._analysisContext.errors.push(new CompileError(this._nameToken, "the variable is declared as '" + this._type.toString() + "' but initial value is '" + ivType.toString() + "'"));
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
		this._analysisContext.errors.push(new CompileError(this.getNameToken$(), "please declare type of variable '" + this.name$() + "' (detected recursion while trying to reduce type)"));
		break;
	default:
		break;
	}
	return this._type;
};


MemberVariableDefinition.prototype.getInitialValue$ = function () {
	return this._initialValue;
};


MemberVariableDefinition.prototype.setInitialValue$LExpression$ = function (initialValue) {
	this._initialValue = initialValue;
};


MemberVariableDefinition.prototype.getNotation$ = function () {
	var classDef;
	var s;
	classDef = this.getClassDef$();
	s = (classDef != null ? classDef.className$() : "<<unknown>>");
	s += ((this.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "." : "#");
	s += this.name$();
	return s;
};


function MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	var i;
	MemberDefinition.call(this, token, name, flags, closures, docComment);
	Block.call(this);
	this._returnType = returnType;
	this._args = args;
	this._locals = locals;
	this._statements = statements;
	this._lastTokenOfBody = lastTokenOfBody;
	this._parent = null;
	this._funcLocal = null;
	this._classDef = null;
	for (i = 0; i < this._closures.length; ++ i) {
		this._closures[i].setParent$LMemberFunctionDefinition$(this);
	}
};

$__jsx_extend([MemberFunctionDefinition], MemberDefinition);
$__jsx_merge_interface(MemberFunctionDefinition, Block);

MemberFunctionDefinition.prototype.isAnonymous$ = function () {
	return this._nameToken == null;
};


MemberFunctionDefinition.prototype.isGenerator$ = function () {
	return (this._flags & ClassDefinition.IS_GENERATOR) !== 0;
};


MemberFunctionDefinition.prototype.getNotation$ = function () {
	var $this = this;
	var classDef;
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


MemberFunctionDefinition.prototype.toString = function () {
	var $this = this;
	var argsText;
	argsText = this._args.map((function (arg) {
		return arg.getName$().getValue$() + " : " + arg.getType$().toString();
	})).join(", ");
	return "function " + this.name$() + "(" + argsText + ") : " + this._returnType.toString();
};


MemberFunctionDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var $this = this;
	return this._instantiateCore$LInstantiationContext$F$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$LMemberFunctionDefinition$$(instantiationContext, (function (token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
		return new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}));
};


MemberFunctionDefinition.prototype._instantiateCore$LInstantiationContext$F$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$LMemberFunctionDefinition$$ = function (instantiationContext, constructCallback) {
	var $this = this;
	var args;
	var i;
	var locals;
	var caughtVariables;
	var statements;
	var closures;
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
		closures = this._instantiateClosures$LInstantiationContext$(instantiationContext);
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
			var i;
			if (statement instanceof FunctionStatement) {
				for (i = 0; i < $this._closures.length; ++ i) {
					if ($this._closures[i] == statement.getFuncDef$()) {
						break;
					}
				}
				if (i === $this._closures.length) {
					throw new Error("logic flaw, cannot find the closure");
				}
				statement.setFuncDef$LMemberFunctionDefinition$(closures[i]);
				return true;
			}
			statement.forEachExpression$F$LExpression$B$((function (expr) {
				$this._updateLinkFromExpressionToClosuresUponInstantiation$LExpression$ALMemberFunctionDefinition$(expr, closures);
				return true;
			}));
			return statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
	} else {
		locals = null;
		statements = null;
		closures = [];
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


MemberFunctionDefinition.prototype.serialize$ = function () {
	return ({ "token": Serializer$Token$E$serializeNullable$LToken$(this._token), "nameToken": Serializer$Token$E$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "returnType": Serializer$Type$E$serializeNullable$LType$(this._returnType), "args": Serializer$ArgumentDeclaration$E$serializeArray$ALArgumentDeclaration$(this._args), "locals": Serializer$LocalVariable$E$serializeArray$ALLocalVariable$(this._locals), "statements": Serializer$Statement$E$serializeArray$ALStatement$(this._statements) });
};


MemberFunctionDefinition.prototype.analyze$LAnalysisContext$ = function (outerContext) {
	var $this = this;
	var docComment;
	var args;
	var context;
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
			outerContext.errors.push(new CompileError(docParam.getToken$(), 'invalid parameter name "' + docParam.getParamName$() + '" for ' + $this.name$() + "()"));
		}));
	}
	if (this._statements == null) {
		return;
	}
	context = outerContext.clone$().setFuncDef$LMemberFunctionDefinition$(this);
	if (this._parent == null) {
		context.setBlockStack$ALBlockContext$([ new BlockContext(new LocalVariableStatuses(this, null), this) ]);
	} else {
		context.setBlockStack$ALBlockContext$(outerContext.blockStack);
		context.blockStack.push(new BlockContext(new LocalVariableStatuses(this, outerContext.getTopBlock$().localVariableStatuses), this));
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
		if (this.isGenerator$()) {
		} else {
			if (! this._returnType.equals$LType$(Type.voidType) && context.getTopBlock$().localVariableStatuses.isReachable$()) {
				context.errors.push(new CompileError(this._lastTokenOfBody, "missing return statement"));
			}
		}
		if (this._parent == null && this.getNameToken$() != null && this.name$() === "constructor") {
			this._fixupConstructor$LAnalysisContext$(context);
		}
	} finally {
		context.blockStack.pop();
	}
	if (this._funcLocal != null) {
		this._funcLocal.setTypeForced$LType$(this.getType$());
	}
};


MemberFunctionDefinition.prototype._fixupConstructor$LAnalysisContext$ = function (context) {
	var $this = this;
	var success;
	var isAlternate;
	var stmtIndex;
	var baseIndex;
	var baseClassType;
	var ctorStmt;
	var normalStatementFromIndex;
	var initProperties;
	var i;
	var onExpr;
	var canContinue;
	var insertStmtAt;
	success = true;
	isAlternate = false;
	if ((this._flags & ClassDefinition.IS_GENERATOR) !== 0) {
		context.errors.push(new CompileError(this._token, "constructor must not be a generator"));
		return;
	}
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
							ctorStmt = new ConstructorInvocationStatement(this._token, baseClassType, []);
							this._statements.splice(stmtIndex, 0, ctorStmt);
							if (! ctorStmt.analyze$LAnalysisContext$(context)) {
								throw new Error("logic flaw");
							}
							++ stmtIndex;
						} else {
							if (stmtIndex < this._statements.length) {
								context.errors.push(new CompileError(this._statements[stmtIndex].getToken$(), "constructor of class '" + baseClassType.toString() + "' should be called prior to the statement"));
							} else {
								context.errors.push(new CompileError(this._token, "super class '" + baseClassType.toString() + "' should be initialized explicitely (no default constructor)"));
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
		context.errors.push(new CompileError(this._statements[stmtIndex].getToken$(), "constructors should be invoked in the order they are implemented"));
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
		}
		canContinue = this._statements[i].forEachExpression$F$LExpression$B$(onExpr);
		if (! canContinue) {
			break;
		}
	}
	insertStmtAt = normalStatementFromIndex;
	this._classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		var stmt;
		if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT)) === 0) {
			if (initProperties[member.name$()]) {
				stmt = new ExpressionStatement(new AssignmentExpression(new Token("=", false), new PropertyExpression$0(new Token(".", false), new ThisExpression(new Token("this", false), $this._classDef), member.getNameToken$(), [], member.getType$()), member.getInitialValue$()));
				$this._statements.splice(insertStmtAt++, 0, stmt);
			}
		}
		return true;
	}));
};


MemberFunctionDefinition.prototype.getReturnType$ = function () {
	return this._returnType;
};


MemberFunctionDefinition.prototype.setReturnType$LType$ = function (type) {
	this._returnType = type;
};


MemberFunctionDefinition.prototype.getArguments$ = function () {
	return this._args;
};


MemberFunctionDefinition.prototype.getArgumentTypes$ = function () {
	var argTypes;
	var i;
	argTypes = [];
	for (i = 0; i < this._args.length; ++ i) {
		argTypes[i] = this._args[i].getType$();
	}
	return argTypes;
};


MemberFunctionDefinition.prototype.getFuncLocal$ = function () {
	return this._funcLocal;
};


MemberFunctionDefinition.prototype.setFuncLocal$LLocalVariable$ = function (funcLocal) {
	this._funcLocal = funcLocal;
};


MemberFunctionDefinition.prototype.getParent$ = function () {
	return this._parent;
};


MemberFunctionDefinition.prototype.setParent$LMemberFunctionDefinition$ = function (parent) {
	this._parent = parent;
};


MemberFunctionDefinition.prototype.getLocals$ = function () {
	return this._locals;
};


MemberFunctionDefinition.prototype.getStatements$ = function () {
	return this._statements;
};


MemberFunctionDefinition.prototype.getLocal$LAnalysisContext$S = function (context, name) {
	var i;
	var block;
	var j;
	var local;
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


MemberFunctionDefinition.prototype.getType$ = function () {
	return ((this._flags & ClassDefinition.IS_STATIC) !== 0 ? new StaticFunctionType(this._token, this._returnType, this.getArgumentTypes$(), false) : new MemberFunctionType(this._token, new ObjectType(this._classDef), this._returnType, this.getArgumentTypes$(), false));
};


MemberFunctionDefinition.prototype.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$ = function (context, type) {
	var i;
	for (i = 0; i < this._args.length; ++ i) {
		if (this._args[i].getType$() == null) {
			break;
		}
	}
	if (i === this._args.length && this._returnType != null) {
		if (this._funcLocal != null) {
			this._funcLocal.setTypeForced$LType$(this.getType$());
		}
		return true;
	}
	if (type.getArgumentTypes$().length !== this._args.length) {
		context.errors.push(new CompileError(this.getToken$(), "expected the function to have " + (type.getArgumentTypes$().length + "") + " arguments, but found " + (this._args.length + "")));
		return false;
	} else {
		if (this._args.length !== 0 && type.getArgumentTypes$()[this._args.length - 1] instanceof VariableLengthArgumentType) {
			context.errors.push(new CompileError(this.getToken$(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
			return false;
		}
	}
	for (i = 0; i < this._args.length; ++ i) {
		if (this._args[i].getType$() != null) {
			if (! this._args[i].getType$().equals$LType$(type.getArgumentTypes$()[i])) {
				context.errors.push(new CompileError(this.getToken$(), "detected type conflict for argument '" + this._args[i].getName$().getValue$() + "' (expected '" + type.getArgumentTypes$()[i].toString() + "' but found '" + this._args[i].getType$().toString() + "'"));
				return false;
			}
		} else {
			this._args[i].setTypeForced$LType$(type.getArgumentTypes$()[i]);
		}
	}
	if (this._returnType != null) {
		if (! this._returnType.equals$LType$(type.getReturnType$())) {
			context.errors.push(new CompileError(this.getToken$(), "detected return type conflict, expected '" + type.getReturnType$().toString() + "' but found '" + this._returnType.toString() + "'"));
			return false;
		}
	} else {
		this._returnType = type.getReturnType$();
	}
	if (this._funcLocal != null) {
		this._funcLocal.setTypeForced$LType$(this.getType$());
	}
	return true;
};


MemberFunctionDefinition.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements);
};


function InstantiatedMemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	MemberFunctionDefinition.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
};

$__jsx_extend([InstantiatedMemberFunctionDefinition], MemberFunctionDefinition);
function TemplateFunctionDefinition(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	var $this = this;
	MemberFunctionDefinition.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	TemplateDefinition.call(this);
	this._typeArgs = typeArgs.concat([]);
	this._instantiatedDefs = new TypedMap$Array$Type$E$MemberFunctionDefinition$E$0((function (x, y) {
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

$__jsx_extend([TemplateFunctionDefinition], MemberFunctionDefinition);
$__jsx_merge_interface(TemplateFunctionDefinition, TemplateDefinition);

TemplateFunctionDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


TemplateFunctionDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var instantiated;
	var k;
	instantiated = new TemplateFunctionDefinition(this._token, this.getNameToken$(), this.flags$(), this._typeArgs.concat([]), this._returnType, this._args.concat([]), this._locals, this._statements, this._closures, this._lastTokenOfBody, this._docComment);
	for (k in this._resolvedTypemap) {
		instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
	}
	for (k in instantiationContext.typemap) {
		instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
	}
	return instantiated;
};


TemplateFunctionDefinition.prototype.instantiateTemplateFunction$ALCompileError$LToken$ALType$ = function (errors, token, typeArgs) {
	var $this = this;
	var instantiated;
	var instantiationContext;
	var k;
	var analysisContext;
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
		return new InstantiatedMemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	}));
	if (instantiated == null) {
		return null;
	}
	instantiated.setClassDef$LClassDefinition$(this._classDef);
	this._classDef._members.push(instantiated);
	analysisContext = new AnalysisContext(errors, this._classDef.getParser$(), (function (parser, classDef) {
		throw new Error("not implemented");
	}));
	for (i = 0; i < instantiationContext.objectTypesUsed.length; ++ i) {
		instantiationContext.objectTypesUsed[i].resolveType$LAnalysisContext$(analysisContext);
	}
	instantiated.analyze$LAnalysisContext$(analysisContext);
	this._instantiatedDefs.set$ALType$LMemberFunctionDefinition$(typeArgs.concat([]), instantiated);
	return instantiated;
};


function TemplateClassDefinition(token, className, flags, typeArgs, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment) {
	ClassDefinition.call(this, token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment);
	TemplateDefinition.call(this);
	this._token = token;
	this._className = className;
	this._flags = flags;
	this._typeArgs = typeArgs.concat([]);
	this._resetMembersClassDef$();
};

$__jsx_extend([TemplateClassDefinition], ClassDefinition);
$__jsx_merge_interface(TemplateClassDefinition, TemplateDefinition);

TemplateClassDefinition.prototype.getToken$ = function () {
	return this._token;
};


TemplateClassDefinition.prototype.className$ = function () {
	return this._className;
};


TemplateClassDefinition.prototype.flags$ = function () {
	return this._flags;
};


TemplateClassDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


TemplateClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var typemap;
	var key;
	var i;
	var context;
	var succeeded;
	var members;
	var member;
	var inners;
	var inner;
	var templateInners;
	var templateInner;
	var extendType;
	var type;
	var implementTypes;
	typemap = {};
	for (key in instantiationContext.typemap) {
		typemap[key] = instantiationContext.typemap[key];
	}
	for (i = 0; i < this._typeArgs.length; ++ i) {
		delete typemap[this._typeArgs[i].getValue$()];
	}
	context = new InstantiationContext(instantiationContext.errors, typemap);
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
	extendType = null;
	if (this._extendType != null) {
		type = this._extendType.instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++ i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken$(), "non-object type is not extensible"));
			return null;
		}
		implementTypes[i] = type;
	}
	return new TemplateClassDefinition(this._token, this._className, this._flags, this._typeArgs, extendType, implementTypes, members, inners, templateInners, context.objectTypesUsed, this._docComment);
};


TemplateClassDefinition.prototype.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$ = function (errors, request) {
	var instantiationContext;
	var succeeded;
	var members;
	var i;
	var member;
	var inners;
	var inner;
	var templateInners;
	var templateInner;
	var extendType;
	var type;
	var implementTypes;
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
	extendType = null;
	if (this._extendType != null) {
		type = this._extendType.instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++ i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$(instantiationContext);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken$(), "non-object type is not extensible"));
			return null;
		}
		implementTypes[i] = type;
	}
	instantiatedDef = new InstantiatedClassDefinition(this, request.getTypeArguments$(), extendType, implementTypes, members, inners, templateInners, instantiationContext.objectTypesUsed);
	return instantiatedDef;
};


function InstantiatedClassDefinition(templateClassDef, typeArguments, extendType, implementTypes, members, inners, templateInners, objectTypesUsed) {
	ClassDefinition.call(this, null, Type$templateTypeToString$SALType$(templateClassDef.classFullName$(), typeArguments), templateClassDef.flags$(), extendType, implementTypes, members, inners, templateInners, objectTypesUsed, null);
	this._templateClassDef = templateClassDef;
	this._typeArguments = typeArguments;
};

$__jsx_extend([InstantiatedClassDefinition], ClassDefinition);
InstantiatedClassDefinition.prototype.getTemplateClass$ = function () {
	return this._templateClassDef;
};


InstantiatedClassDefinition.prototype.getTemplateClassName$ = function () {
	return this._templateClassDef.className$();
};


InstantiatedClassDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArguments;
};


InstantiatedClassDefinition.prototype.typeArgumentsAreEqual$ALType$ = function (typeArgs) {
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


InstantiatedClassDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw");
};


function Type() {
};

$__jsx_extend([Type], Object);
Type.prototype.serialize$ = function () {
	return this.toString();
};


Type.prototype.equals$LType$ = function (x) {
	return this == x;
};


Type.prototype.resolveIfNullable$ = function () {
	if (this instanceof NullableType) {
		return this.getBaseType$();
	}
	return this;
};


Type.prototype.asAssignableType$ = function () {
	return this;
};


Type.prototype.toNullableType$ = function () {
	return this.toNullableType$B(false);
};


Type.prototype.toNullableType$B = function (force) {
	if (force || this instanceof PrimitiveType) {
		return new NullableType(this);
	}
	return this;
};


function Type$templateTypeToString$SALType$(parameterizedTypeName, typeArgs) {
	var s;
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

Type.templateTypeToString$SALType$ = Type$templateTypeToString$SALType$;

function Type$isIntegerOrNumber$LType$(type) {
	return type instanceof IntegerType || type instanceof NumberType;
};

Type.isIntegerOrNumber$LType$ = Type$isIntegerOrNumber$LType$;

function Type$calcLeastCommonAncestor$LType$LType$(type1, type2) {
	return Type$calcLeastCommonAncestor$LType$LType$B(type1, type2, false);
};

Type.calcLeastCommonAncestor$LType$LType$ = Type$calcLeastCommonAncestor$LType$LType$;

function Type$calcLeastCommonAncestor$LType$LType$B(type1, type2, acceptVariant) {
	var obj1;
	var obj2;
	var ifaces1;
	var candidates;
	var i;
	var iface;
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
		return (Type.nullType.isConvertibleTo$LType$(type2) ? type2 : new NullableType(type2));
	}
	if (Type.nullType.equals$LType$(type2)) {
		return (Type.nullType.isConvertibleTo$LType$(type1) ? type1 : new NullableType(type1));
	}
	if (type1.resolveIfNullable$() instanceof PrimitiveType || type2.resolveIfNullable$() instanceof PrimitiveType) {
		if (type1.resolveIfNullable$().equals$LType$(type2.resolveIfNullable$())) {
			return new NullableType(type1);
		} else {
			if (Type$isIntegerOrNumber$LType$(type1.resolveIfNullable$()) && Type$isIntegerOrNumber$LType$(type2.resolveIfNullable$())) {
				return new NullableType(Type.numberType);
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
			var result;
			var i;
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
		}
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

Type.calcLeastCommonAncestor$LType$LType$B = Type$calcLeastCommonAncestor$LType$LType$B;

function Type$calcLeastCommonAncestor$ALType$(types) {
	return Type$calcLeastCommonAncestor$ALType$B(types, false);
};

Type.calcLeastCommonAncestor$ALType$ = Type$calcLeastCommonAncestor$ALType$;

function Type$calcLeastCommonAncestor$ALType$B(types, acceptVariant) {
	var type;
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

Type.calcLeastCommonAncestor$ALType$B = Type$calcLeastCommonAncestor$ALType$B;

function VoidType() {
	Type.call(this);
};

$__jsx_extend([VoidType], Type);
VoidType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};


VoidType.prototype.isAssignable$ = function () {
	return false;
};


VoidType.prototype.isConvertibleTo$LType$ = function (type) {
	return false;
};


VoidType.prototype.getClassDef$ = function () {
	throw new Error("VoidType#getClassDef() is not supported");
};


VoidType.prototype.toString = function () {
	return "void";
};


function NullType() {
	Type.call(this);
};

$__jsx_extend([NullType], Type);
NullType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};


NullType.prototype.isAssignable$ = function () {
	return false;
};


NullType.prototype.isConvertibleTo$LType$ = function (type) {
	return type instanceof NullableType || type instanceof ObjectType || type instanceof VariantType || type instanceof StaticFunctionType;
};


NullType.prototype.getClassDef$ = function () {
	throw new Error("NullType#getClassDef() is not supported");
};


NullType.prototype.toString = function () {
	return "null";
};


function PrimitiveType() {
	Type.call(this);
};

$__jsx_extend([PrimitiveType], Type);
PrimitiveType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};


PrimitiveType.prototype.isAssignable$ = function () {
	return true;
};


function BooleanType() {
	PrimitiveType.call(this);
};

$__jsx_extend([BooleanType], PrimitiveType);
BooleanType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof BooleanType || type instanceof VariantType;
};


BooleanType.prototype.getClassDef$ = function () {
	return BooleanType._classDef;
};


BooleanType.prototype.toString = function () {
	return "boolean";
};


function IntegerType() {
	PrimitiveType.call(this);
};

$__jsx_extend([IntegerType], PrimitiveType);
IntegerType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
};


IntegerType.prototype.getClassDef$ = function () {
	return NumberType._classDef;
};


IntegerType.prototype.toString = function () {
	return "int";
};


function NumberType() {
	PrimitiveType.call(this);
};

$__jsx_extend([NumberType], PrimitiveType);
NumberType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof IntegerType || type instanceof NumberType || type instanceof VariantType;
};


NumberType.prototype.getClassDef$ = function () {
	return NumberType._classDef;
};


NumberType.prototype.toString = function () {
	return "number";
};


function StringType() {
	PrimitiveType.call(this);
};

$__jsx_extend([StringType], PrimitiveType);
StringType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof StringType || type instanceof VariantType;
};


StringType.prototype.getClassDef$ = function () {
	return StringType._classDef;
};


StringType.prototype.toString = function () {
	return "string";
};


function VariantType() {
	Type.call(this);
};

$__jsx_extend([VariantType], Type);
VariantType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	return this;
};


VariantType.prototype.isAssignable$ = function () {
	return true;
};


VariantType.prototype.isConvertibleTo$LType$ = function (type) {
	type = type.resolveIfNullable$();
	return type instanceof VariantType;
};


VariantType.prototype.getClassDef$ = function () {
	throw new Error("VariantType#getClassDef() is not supported");
};


VariantType.prototype.toString = function () {
	return "variant";
};


function NullableType(type) {
	Type.call(this);
	this._baseType = null;
	if (type.equals$LType$(Type.variantType)) {
		throw new Error("logic flaw, cannot create Nullable.<variant>");
	}
	this._baseType = (type instanceof NullableType ? type._baseType : type);
};

$__jsx_extend([NullableType], Type);
NullableType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var baseType;
	baseType = this._baseType.resolveIfNullable$().instantiate$LInstantiationContext$(instantiationContext);
	return baseType.toNullableType$();
};


NullableType.prototype.equals$LType$ = function (x) {
	return x instanceof NullableType && this._baseType.equals$LType$(x._baseType);
};


NullableType.prototype.isConvertibleTo$LType$ = function (type) {
	return this._baseType.isConvertibleTo$LType$(type instanceof NullableType ? type._baseType : type);
};


NullableType.prototype.isAssignable$ = function () {
	return true;
};


NullableType.prototype.getClassDef$ = function () {
	return this._baseType.getClassDef$();
};


NullableType.prototype.getBaseType$ = function () {
	return this._baseType;
};


NullableType.prototype.toString = function () {
	return "Nullable.<" + this._baseType.toString() + ">";
};


function VariableLengthArgumentType(type) {
	Type.call(this);
	this._baseType = null;
	if (type instanceof VariableLengthArgumentType) {
		throw new Error("logic flaw");
	}
	this._baseType = type;
};

$__jsx_extend([VariableLengthArgumentType], Type);
VariableLengthArgumentType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var baseType;
	baseType = this._baseType.instantiate$LInstantiationContext$(instantiationContext);
	return new VariableLengthArgumentType(baseType);
};


VariableLengthArgumentType.prototype.equals$LType$ = function (x) {
	return x instanceof VariableLengthArgumentType && this._baseType.equals$LType$(x._baseType);
};


VariableLengthArgumentType.prototype.isConvertibleTo$LType$ = function (type) {
	throw new Error("logic flaw");
};


VariableLengthArgumentType.prototype.isAssignable$ = function () {
	throw new Error("logic flaw");
};


VariableLengthArgumentType.prototype.getClassDef$ = function () {
	throw new Error("logic flaw");
};


VariableLengthArgumentType.prototype.getBaseType$ = function () {
	return this._baseType;
};


VariableLengthArgumentType.prototype.toString = function () {
	return "..." + this._baseType.toString();
};


function ObjectType(classDef) {
	Type.call(this);
	this._classDef = classDef;
};

$__jsx_extend([ObjectType], Type);
ObjectType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
};


ObjectType.prototype.equals$LType$ = function (x) {
	if (this instanceof ParsedObjectType && x instanceof ParsedObjectType && (this._classDef == null || x._classDef == null)) {
		return this.toString() === x.toString();
	}
	return x instanceof ObjectType && this._classDef == x._classDef;
};


ObjectType.prototype.resolveType$LAnalysisContext$ = function (context) {
	if (this._classDef == null) {
		throw new Error("logic flaw");
	}
};


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


ObjectType.prototype.isAssignable$ = function () {
	return true;
};


ObjectType.prototype.getClassDef$ = function () {
	return this._classDef;
};


ObjectType.prototype.toString = function () {
	return (this._classDef != null ? this._classDef.className$() : "(null)");
};


function ParsedObjectType(qualifiedName, typeArgs) {
	ObjectType.call(this, null);
	this._qualifiedName = qualifiedName;
	this._typeArguments = typeArgs;
};

$__jsx_extend([ParsedObjectType], ObjectType);
ParsedObjectType.prototype.getToken$ = function () {
	return this._qualifiedName.getToken$();
};


ParsedObjectType.prototype.getQualifiedName$ = function () {
	return this._qualifiedName;
};


ParsedObjectType.prototype.getTypeArguments$ = function () {
	return this._typeArguments;
};


ParsedObjectType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var enclosingType;
	var actualType;
	var qualifiedName;
	var actualEnclosingType;
	var typeArgs;
	var i;
	var templateClassName;
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
			qualifiedName = new QualifiedName$1(this._qualifiedName.getToken$(), actualEnclosingType);
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
	objectType = new ParsedObjectType(qualifiedName, typeArgs);
	instantiationContext.objectTypesUsed.push(objectType);
	return objectType;
};


ParsedObjectType.prototype.resolveType$LAnalysisContext$ = function (context) {
	if (this._classDef == null) {
		this._classDef = this._qualifiedName.getClass$LAnalysisContext$ALType$(context, this._typeArguments);
	}
};


ParsedObjectType.prototype.toString = function () {
	return (this._typeArguments.length !== 0 ? Type$templateTypeToString$SALType$(this._qualifiedName.getToken$().getValue$(), this._typeArguments) : this._qualifiedName.getToken$().getValue$());
};


function FunctionType() {
	Type.call(this);
};

$__jsx_extend([FunctionType], Type);
FunctionType.prototype.isConvertibleTo$LType$ = function (type) {
	return false;
};


FunctionType.prototype.getClassDef$ = function () {
	return FunctionType._classDef;
};


FunctionType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	throw new Error("logic flaw");
};


function FunctionChoiceType(types) {
	FunctionType.call(this);
	this._types = types;
};

$__jsx_extend([FunctionChoiceType], FunctionType);
FunctionChoiceType.prototype.isAssignable$ = function () {
	return false;
};


FunctionChoiceType.prototype.asAssignableType$ = function () {
	throw new Error("logic flaw");
};


FunctionChoiceType.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var types;
	var i;
	var matched;
	var notes;
	types = this._types;
	for (i = 0; i < types.length; ++ i) {
		if (types[i]._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(types[i].getToken$(), argTypes, isStatic, true, [  ])) {
			return types[i];
		}
	}
	matched = [];
	notes = [];
	for (i = 0; i < types.length; ++ i) {
		if (types[i]._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(types[i].getToken$(), argTypes, isStatic, false, notes)) {
			matched.push(types[i]);
		}
	}
	switch (matched.length) {
	case 0:
		context.errors.push(new CompileError(operatorToken, operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$().toString() : "no function with matching arguments"));
		break;
	case 1:
		return matched[0];
	default:
		context.errors.push(new CompileError(operatorToken, "result of function resolution using the arguments is ambiguous"));
		break;
	}
	context.errors[context.errors.length - 1].addCompileNotes$ALCompileNote$(notes);
	return null;
};


FunctionChoiceType.prototype.getExpectedTypes$NB = function (numberOfArgs, isStatic) {
	var expected;
	var i;
	expected = [];
	for (i = 0; i < this._types.length; ++ i) {
		this._types[i]._getExpectedTypes$AALType$NB(expected, numberOfArgs, isStatic);
	}
	return expected;
};


FunctionChoiceType.prototype.toString = function () {
	return (this._types.length === 1 ? this._types[0].toString() : "<<multiple choices>>");
};


FunctionChoiceType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


function ResolvedFunctionType(token, returnType, argTypes, isAssignable) {
	FunctionType.call(this);
	this._token = token;
	this._returnType = returnType;
	this._argTypes = argTypes;
	this._isAssignable = isAssignable;
};

$__jsx_extend([ResolvedFunctionType], FunctionType);
ResolvedFunctionType.prototype.setIsAssignable$B = function (isAssignable) {
	this._isAssignable = isAssignable;
	return this;
};


ResolvedFunctionType.prototype.isAssignable$ = function () {
	return this._isAssignable;
};


ResolvedFunctionType.prototype.asAssignableType$ = function () {
	return this._clone$().setIsAssignable$B(true);
};


ResolvedFunctionType.prototype.getToken$ = function () {
	return this._token;
};


ResolvedFunctionType.prototype.getReturnType$ = function () {
	return this._returnType;
};


ResolvedFunctionType.prototype.getArgumentTypes$ = function () {
	return this._argTypes;
};


ResolvedFunctionType.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var notes;
	var error;
	notes = [];
	if (! this._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(this._token != null ? this._token : operatorToken, argTypes, isStatic, false, notes)) {
		error = new CompileError(operatorToken, operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$().toString() : "no function with matching arguments");
		error.addCompileNotes$ALCompileNote$(notes);
		context.errors.push(error);
		return null;
	}
	return this;
};


ResolvedFunctionType.prototype._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$ = function (token, argTypes, isStatic, exact, notes) {
	var $this = this;
	var compareArg;
	var vargType;
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
		if (isStatic) {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a static function, but got a member function'));
		} else {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a member function, but got a static function'));
		}
		return false;
	}
	if (this._argTypes.length !== 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		vargType = this._argTypes[this._argTypes.length - 1];
		if (argTypes.length < this._argTypes.length - 1) {
			notes.push(new CompileNote(token, 'candidate function not viable: wrong number of arguments'));
			return false;
		}
		for (i = 0; i < this._argTypes.length - 1; ++ i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ])));
				return false;
			}
		}
		if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length === this._argTypes.length) {
			if (! compareArg(this._argTypes[i].getBaseType$(), argTypes[i].getBaseType$())) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].getBaseType$().toString(), this._argTypes[i].getBaseType$().toString(), Util$toOrdinal$N(i + 1) ])));
				return false;
			}
		} else {
			for (; i < argTypes.length; ++ i) {
				if (! compareArg(vargType.getBaseType$(), argTypes[i])) {
					notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), vargType.getBaseType$().toString(), Util$toOrdinal$N(i + 1) ])));
					return false;
				}
			}
		}
	} else {
		if (argTypes.length !== this._argTypes.length) {
			notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: wrong number of arguments (%1 for %2)', [ argTypes.length + "", this._argTypes.length + "" ])));
			return false;
		}
		for (i = 0; i < argTypes.length; ++ i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ])));
				return false;
			}
		}
	}
	return true;
};


ResolvedFunctionType.prototype.getExpectedTypes$NB = function (numberOfArgs, isStatic) {
	var expected;
	expected = [];
	this._getExpectedTypes$AALType$NB(expected, numberOfArgs, isStatic);
	return expected;
};


ResolvedFunctionType.prototype._getExpectedTypes$AALType$NB = function (expected, numberOfArgs, isStatic) {
	var $this = this;
	var argTypes;
	var i;
	var hasCallback;
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


ResolvedFunctionType.prototype.toString = function () {
	var args;
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


ResolvedFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


function StaticFunctionType(token, returnType, argTypes, isAssignable) {
	ResolvedFunctionType.call(this, token, returnType, argTypes, isAssignable);
};

$__jsx_extend([StaticFunctionType], ResolvedFunctionType);
StaticFunctionType.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var returnType;
	var argTypes;
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
	return new StaticFunctionType(this._token, returnType, argTypes, this._isAssignable);
};


StaticFunctionType.prototype.equals$LType$ = function (x) {
	return x instanceof StaticFunctionType && this._returnType.equals$LType$(x._returnType) && Util$typesAreEqual$ALType$ALType$(this._argTypes, x._argTypes);
};


StaticFunctionType.prototype._clone$ = function () {
	return new StaticFunctionType(this._token, this._returnType, this._argTypes, this._isAssignable);
};


StaticFunctionType.prototype.isConvertibleTo$LType$ = function (type) {
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
	return this._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(type.getToken$(), type.getArgumentTypes$(), true, true, [  ]);
};


StaticFunctionType.prototype._toStringPrefix$ = function () {
	return "";
};


StaticFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


function MemberFunctionType(token, objectType, returnType, argTypes, isAssignable) {
	ResolvedFunctionType.call(this, token, returnType, argTypes, isAssignable);
	this._objectType = objectType;
};

$__jsx_extend([MemberFunctionType], ResolvedFunctionType);
MemberFunctionType.prototype.equals$LType$ = function (x) {
	return x instanceof MemberFunctionType && this._objectType == x._objectType && this._returnType.equals$LType$(x._returnType) && Util$typesAreEqual$ALType$ALType$(this._argTypes, x._argTypes);
};


MemberFunctionType.prototype._clone$ = function () {
	return new MemberFunctionType(this._token, this._objectType, this._returnType, this._argTypes, this._isAssignable);
};


MemberFunctionType.prototype._toStringPrefix$ = function () {
	return this._objectType.toString() + ".";
};


MemberFunctionType.prototype.getObjectType$ = function () {
	return this._objectType;
};


function Token(value, isIdentifier) {
	Token$0.call(this, value, isIdentifier, null, NaN, NaN);
};

function Token$0(value, isIdentifier, filename, lineNumber, columnNumber) {
	this._value = value;
	this._isIdentifier = isIdentifier;
	this._filename = filename;
	this._lineNumber = lineNumber;
	this._columnNumber = columnNumber;
};

$__jsx_extend([Token, Token$0], Object);
Token.prototype.getValue$ = function () {
	return this._value;
};


Token.prototype.isIdentifier$ = function () {
	return this._isIdentifier;
};


Token.prototype.getFilename$ = function () {
	return this._filename;
};


Token.prototype.getLineNumber$ = function () {
	return this._lineNumber;
};


Token.prototype.getColumnNumber$ = function () {
	return this._columnNumber;
};


Token.prototype.serialize$ = function () {
	return [ this._value, this._isIdentifier, this._filename, this._lineNumber, this._columnNumber ];
};


function _Lexer() {
};

$__jsx_extend([_Lexer], Object);
function _Lexer$makeAlt$AS(patterns) {
	return "(?: \n" + patterns.join("\n | \n") + "\n)\n";
};

_Lexer.makeAlt$AS = _Lexer$makeAlt$AS;

function _Lexer$quoteMeta$S(pattern) {
	return pattern.replace(/([^0-9A-Za-z_])/g, '\\$1');
};

_Lexer.quoteMeta$S = _Lexer$quoteMeta$S;

function _Lexer$asMap$AS(array) {
	var hash;
	var i;
	hash = {};
	for (i = 0; i < array.length; ++ i) {
		hash[array[i]] = true;
	}
	return hash;
};

_Lexer.asMap$AS = _Lexer$asMap$AS;

function _Lexer$rx$S(pat) {
	return new RegExp(pat.replace(/[ \t\r\n]/g, ""));
};

_Lexer.rx$S = _Lexer$rx$S;

function Import(parser) {
	this._filenameToken = null;
	this._aliasToken = null;
	this._classNames = null;
	this._sourceParsers = [ parser ];
};

function Import$0(filenameToken, aliasToken, classNames) {
	this._filenameToken = filenameToken;
	this._aliasToken = aliasToken;
	this._classNames = classNames;
	this._sourceParsers = [  ];
};

$__jsx_extend([Import, Import$0], Object);
Import.prototype.getFilenameToken$ = function () {
	return this._filenameToken;
};


Import.prototype.getAlias$ = function () {
	if (this._aliasToken) {
		return this._aliasToken.getValue$();
	} else {
		return null;
	}
};


Import.prototype.getClassNames$ = function () {
	var names;
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


Import.prototype.serialize$ = function () {
	return [ "Import", Serializer$Token$E$serializeNullable$LToken$(this._filenameToken), Serializer$Token$E$serializeNullable$LToken$(this._aliasToken), Serializer$Token$E$serializeArray$ALToken$(this._classNames) ];
};


Import.prototype.checkNameConflict$ALCompileError$LToken$ = function (errors, nameToken) {
	var i;
	if (this._aliasToken != null) {
		if (this._aliasToken.getValue$() === nameToken.getValue$()) {
			errors.push(new CompileError(nameToken, "an alias with the same name is already declared"));
			return false;
		}
	} else {
		if (this._classNames != null) {
			for (i = 0; i < this._classNames.length; ++ i) {
				if (this._classNames[i].getValue$() === nameToken.getValue$()) {
					errors.push(new CompileError(nameToken, "a class with the same name has already been explicitely imported"));
					return false;
				}
			}
		}
	}
	return true;
};


Import.prototype.addSource$LParser$ = function (parser) {
	this._sourceParsers.push(parser);
};


Import.prototype.getSources$ = function () {
	return this._sourceParsers;
};


Import.prototype.assertExistenceOfNamedClasses$ALCompileError$ = function (errors) {
	var $this = this;
	var allClassNames;
	var i;
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
		var num;
		var i;
		num = 0;
		for (i = 0; i < allClassNames.length; ++ i) {
			if (allClassNames[i] == className) {
				++ num;
			}
		}
		return num;
	}
	for (i = 0; i < this._classNames.length; ++ i) {
		switch (countNumberOfClassesByName(this._classNames[i].getValue$())) {
		case 0:
			errors.push(new CompileError(this._classNames[i], "no definition for class '" + this._classNames[i].getValue$() + "'"));
			break;
		case 1:
			break;
		default:
			errors.push(new CompileError(this._classNames[i], "multiple candidates for class '" + this._classNames[i].getValue$() + "'"));
			break;
		}
	}
};


Import.prototype.getClasses$S = function (name) {
	var found;
	var i;
	var classDefs;
	var j;
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


Import.prototype.createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var callbacks;
	var i;
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


Import.prototype._classIsImportable$S = function (name) {
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


function Import$create$ALCompileError$LToken$LToken$ALToken$(errors, filenameToken, aliasToken, classNames) {
	var filename;
	var match;
	filename = Util$decodeStringLiteral$S(filenameToken.getValue$());
	if (filename.indexOf("*") !== - 1) {
		match = filename.match(/^([^\*]*)\/\*(\.[^\/\*]*)$/);
		if (match == null) {
			errors.push(new CompileError(filenameToken, "invalid use of wildcard"));
			return null;
		}
		return new WildcardImport(filenameToken, aliasToken, classNames, match[1], match[2]);
	}
	return new Import$0(filenameToken, aliasToken, classNames);
};

Import.create$ALCompileError$LToken$LToken$ALToken$ = Import$create$ALCompileError$LToken$LToken$ALToken$;

function WildcardImport(filenameToken, aliasToken, classNames, directory, suffix) {
	Import$0.call(this, filenameToken, aliasToken, classNames);
	this._directory = directory;
	this._suffix = suffix;
};

$__jsx_extend([WildcardImport], Import);
WildcardImport.prototype.getDirectory$ = function () {
	return this._directory;
};


WildcardImport.prototype.getSuffix$ = function () {
	return this._suffix;
};


function QualifiedName(token) {
	this._token = token;
	this._import = null;
	this._enclosingType = null;
};

function QualifiedName$0(token, imprt) {
	this._token = token;
	this._import = imprt;
	this._enclosingType = null;
};

function QualifiedName$1(token, enclosingType) {
	this._token = token;
	this._import = null;
	this._enclosingType = enclosingType;
};

$__jsx_extend([QualifiedName, QualifiedName$0, QualifiedName$1], Object);
QualifiedName.prototype.getToken$ = function () {
	return this._token;
};


QualifiedName.prototype.getImport$ = function () {
	return this._import;
};


QualifiedName.prototype.getEnclosingType$ = function () {
	return this._enclosingType;
};


QualifiedName.prototype.serialize$ = function () {
	return [ "QualifiedName", this._token.serialize$(), Serializer$Import$E$serializeNullable$LImport$(this._import), Serializer$ParsedObjectType$E$serializeNullable$LParsedObjectType$(this._enclosingType) ];
};


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


QualifiedName.prototype.getClass$LAnalysisContext$ALType$ = function (context, typeArguments) {
	var $this = this;
	var classDef;
	var classDefs;
	var callbacks;
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
				context.errors.push(new CompileError(this._token, "no definition for class '" + this.toString() + "' in file '" + this._import.getFilenameToken$().getValue$() + "'"));
				return null;
			default:
				context.errors.push(new CompileError(this._token, "multiple candidates"));
				return null;
			}
		} else {
			callbacks = this._import.createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
				return null;
			}));
			switch (callbacks.length) {
			case 1:
				return callbacks[0](null, null, null);
			case 0:
				context.errors.push(new CompileError(this._token, "no definition for template class '" + this.toString() + "' in file '" + this._import.getFilenameToken$().getValue$() + "'"));
				return null;
			default:
				context.errors.push(new CompileError(this._token, "multiple canditates"));
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
					context.errors.push(new CompileError(this._token, "no class definition for '" + this.toString() + "'"));
					return null;
				}
			} else {
				if ((classDef = enclosingClassDef.lookupTemplateInnerClass$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
					return null;
				}))) == null) {
					context.errors.push(new CompileError(this._token, "failed to instantiate class"));
					return null;
				}
			}
		} else {
			if (typeArguments.length === 0) {
				if ((classDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, this._token.getValue$())) == null) {
					context.errors.push(new CompileError(this._token, "no class definition for '" + this.toString() + "'"));
					return null;
				}
			} else {
				if ((classDef = context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
					return null;
				}))) == null) {
					context.errors.push(new CompileError(this._token, "failed to instantiate class"));
					return null;
				}
			}
		}
	}
	return classDef;
};


QualifiedName.prototype.getTemplateClass$LParser$ = function (parser) {
	var $this = this;
	var foundClassDefs;
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


QualifiedName.prototype.toString = function () {
	return (this._enclosingType != null ? this._enclosingType.toString() + "." + this._token.getValue$() : this._token.getValue$());
};


function ParserState(lineNumber, columnNumber, docComment, tokenLength, isGenerator, numErrors, numClosures, numObjectTypesUsed, numTemplateInstantiationRequests) {
	this.lineNumber = lineNumber;
	this.columnOffset = columnNumber;
	this.docComment = docComment;
	this.tokenLength = tokenLength;
	this.isGenerator = isGenerator;
	this.numErrors = numErrors;
	this.numClosures = numClosures;
	this.numObjectTypesUsed = numObjectTypesUsed;
	this.numTemplateInstantiationRequests = numTemplateInstantiationRequests;
};

$__jsx_extend([ParserState], Object);
function ClassState(outer, classType, typeArgs, extendType, implementTypes, objectTypesUsed, classFlags, inners, templateInners) {
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

$__jsx_extend([ClassState], Object);
function Scope(prev, locals, funcLocal, args, statements, closures, isGenerator) {
	this.prev = prev;
	this.locals = locals;
	this.funcLocal = funcLocal;
	this.arguments = args;
	this.statements = statements;
	this.closures = closures;
	this.isGenerator = isGenerator;
};

$__jsx_extend([Scope], Object);
function Parser(sourceToken, filename, completionRequest) {
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
	this._isGenerator = false;
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
	this._funcLocal = null;
	this._arguments = null;
	this._classFlags = 0;
	this._typeArgs = null;
	this._sourceToken = sourceToken;
	this._filename = filename;
	this._completionRequest = completionRequest;
};

$__jsx_extend([Parser], Object);
Parser.prototype.parse$SALCompileError$ = function (input, errors) {
	var compLineNumber;
	var line;
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
	this._isGenerator = false;
	this._locals = null;
	this._statements = null;
	this._closures = null;
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


Parser.prototype._getInput$ = function () {
	return this._lines[this._lineNumber - 1].substring(this._columnOffset);
};


Parser.prototype._getInputByLength$N = function (length) {
	return this._lines[this._lineNumber - 1].substring(this._columnOffset, this._columnOffset + length);
};


Parser.prototype._forwardPos$N = function (len) {
	this._columnOffset += len;
};


Parser.prototype.getSourceToken$ = function () {
	return this._sourceToken;
};


Parser.prototype.getPath$ = function () {
	return this._filename;
};


Parser.prototype.getDocComment$ = function () {
	return this._fileLevelDocComment;
};


Parser.prototype.getClassDefs$ = function () {
	return this._classDefs;
};


Parser.prototype.getTemplateClassDefs$ = function () {
	return this._templateClassDefs;
};


Parser.prototype.getTemplateInstantiationRequests$ = function () {
	return this._templateInstantiationRequests;
};


Parser.prototype.getImports$ = function () {
	return this._imports;
};


Parser.prototype.registerBuiltinImports$ALParser$ = function (parsers) {
	var i;
	for (i = parsers.length - 1; i >= 0; -- i) {
		this._imports.unshift(new Import(parsers[i]));
	}
};


Parser.prototype.lookupImportAlias$S = function (name) {
	var i;
	var alias;
	for (i = 0; i < this._imports.length; ++ i) {
		alias = this._imports[i].getAlias$();
		if (alias != null && alias == name) {
			return this._imports[i];
		}
	}
	return null;
};


Parser.prototype.lookup$ALCompileError$LToken$S = function (errors, contextToken, className) {
	var i;
	var classDef;
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
		errors.push(new CompileError(contextToken, "multiple candidates exist for class name '" + className + "'"));
	}
	return null;
};


Parser.prototype.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var instantiateCallback;
	var candidateCallbacks;
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
		errors.push(new CompileError(request.getToken$(), "could not find definition for template class: '" + request.getClassName$() + "'"));
		return null;
	} else {
		if (candidateCallbacks.length >= 2) {
			errors.push(new CompileError(request.getToken$(), "multiple candidates exist for template class name '" + request.getClassName$() + "'"));
			return null;
		}
	}
	return candidateCallbacks[0](null, null, null);
};


Parser.prototype.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var $this = this;
	var i;
	var classDef;
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
				var classDef;
				classDef = templateDef.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$(errors, request);
				if (classDef == null) {
					return null;
				}
				$this._classDefs.push(classDef);
				classDef.setParser$LParser$($this);
				classDef.resolveTypes$LAnalysisContext$(new AnalysisContext(errors, $this, null));
				postInstantiationCallback($this, classDef);
				return classDef;
			});
		}
	}
	return null;
};


Parser.prototype._pushClassState$ = function () {
	this._outerClass = new ClassState(this._outerClass, this._classType, this._typeArgs, this._extendType, this._implementTypes, this._objectTypesUsed, this._classFlags, this._inners, this._templateInners);
};


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


Parser.prototype._pushScope$LLocalVariable$ALArgumentDeclaration$ = function (funcLocal, args) {
	this._prevScope = new Scope(this._prevScope, this._locals, this._funcLocal, this._arguments, this._statements, this._closures, this._isGenerator);
	this._locals = [];
	this._funcLocal = funcLocal;
	this._arguments = args;
	this._statements = [];
	this._closures = [];
	this._isGenerator = false;
};


Parser.prototype._popScope$ = function () {
	this._locals = this._prevScope.locals;
	this._funcLocal = this._prevScope.funcLocal;
	this._arguments = this._prevScope.arguments;
	this._statements = this._prevScope.statements;
	this._closures = this._prevScope.closures;
	this._isGenerator = this._prevScope.isGenerator;
	this._prevScope = this._prevScope.prev;
};


Parser.prototype._registerLocal$LToken$LType$ = function (identifierToken, type) {
	var $this = this;
	var isEqualTo;
	var i;
	var newLocal;
	function isEqualTo(local) {
		if (local.getName$().getValue$() === identifierToken.getValue$()) {
			if (type != null && ! local.getType$().equals$LType$(type)) {
				$this._newError$S("conflicting types for variable " + identifierToken.getValue$());
			}
			return true;
		}
		return false;
	}
	if (this._arguments == null) {
		this._newError$S(Util$format$SAS("cannot declare variable %1 outside of a function", [ identifierToken.getValue$() ]));
		return null;
	}
	if (this._funcLocal != null) {
		if (isEqualTo(this._funcLocal)) {
			return this._funcLocal;
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
	newLocal = new LocalVariable(identifierToken, type);
	this._locals.push(newLocal);
	return newLocal;
};


Parser.prototype._preserveState$ = function () {
	return new ParserState(this._lineNumber, this._columnOffset, this._docComment, this._tokenLength, this._isGenerator, this._errors.length, this._closures != null ? this._closures.length : 0, this._objectTypesUsed.length, this._templateInstantiationRequests.length);
};


Parser.prototype._restoreState$LParserState$ = function (state) {
	this._lineNumber = state.lineNumber;
	this._columnOffset = state.columnOffset;
	this._docComment = state.docComment;
	this._tokenLength = state.tokenLength;
	this._isGenerator = state.isGenerator;
	this._errors.length = state.numErrors;
	if (this._closures != null) {
		this._closures.splice(state.numClosures, this._closures.length - state.numClosures);
	}
	this._objectTypesUsed.splice(state.numObjectTypesUsed, this._objectTypesUsed.length - state.numObjectTypesUsed);
	this._templateInstantiationRequests.splice(state.numTemplateInstantiationRequests, this._templateInstantiationRequests.length - state.numTemplateInstantiationRequests);
};


Parser.prototype._getColumn$ = function () {
	return this._columnOffset;
};


Parser.prototype._newError$S = function (message) {
	this._errors.push(new CompileError$0(this._filename, this._lineNumber, this._getColumn$(), message));
};


Parser.prototype._newDeprecatedWarning$S = function (message) {
	this._errors.push(new DeprecatedWarning$0(this._filename, this._lineNumber, this._getColumn$(), message));
};


Parser.prototype._advanceToken$ = function () {
	var matched;
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


Parser.prototype._skipMultilineComment$ = function () {
	var startLineNumber;
	var startColumnOffset;
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
			this._errors.push(new CompileError$0(this._filename, startLineNumber, startColumnOffset, "could not find the end of the comment"));
			return false;
		}
		++ this._lineNumber;
		this._columnOffset = 0;
	}
	return false;
};


Parser.prototype._parseDocComment$ = function () {
	var docComment;
	var node;
	var tagMatch;
	var tag;
	var nameMatch;
	var token;
	var endAt;
	docComment = new DocComment();
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
					token = new Token$0(nameMatch[0], false, this._filename, this._lineNumber, this._getColumn$());
					this._forwardPos$N(nameMatch[0].length);
					node = new DocCommentParameter(token);
					docComment.getParams$().push(node);
				} else {
					this._newError$S("name of the parameter not found after @param");
					node = null;
				}
				break;
			default:
				node = new DocCommentTag(tag);
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


Parser.prototype._parseDocCommentAdvanceWhiteSpace$ = function () {
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


Parser.prototype._isEOF$ = function () {
	this._advanceToken$();
	return this._lineNumber === this._lines.length && this._columnOffset === this._lines[this._lines.length - 1].length;
};


Parser.prototype._expectIsNotEOF$ = function () {
	if (this._isEOF$()) {
		this._newError$S("unexpected EOF");
		return false;
	}
	return true;
};


Parser.prototype._expectOpt$S = function (expected) {
	return this._expectOpt$ASLRegExp$([ expected ], null);
};


Parser.prototype._expectOpt$AS = function (expected) {
	return this._expectOpt$ASLRegExp$(expected, null);
};


Parser.prototype._expectOpt$SLRegExp$ = function (expected, excludePattern) {
	return this._expectOpt$ASLRegExp$([ expected ], excludePattern);
};


Parser.prototype._expectOpt$ASLRegExp$ = function (expected, excludePattern) {
	var i;
	var offset;
	this._advanceToken$();
	for (i = 0; i < expected.length; ++ i) {
		if (this._completionRequest != null) {
			offset = this._completionRequest.isInRange$NNN(this._lineNumber, this._columnOffset, expected[i].length);
			if (offset !== - 1) {
				this._completionRequest.pushCandidates$LCompletionCandidates$(new KeywordCompletionCandidate(expected[i]).setPrefix$S(this._getInputByLength$N(offset)));
			}
		}
		if (this._getInputByLength$N(expected[i].length) == expected[i]) {
			if (expected[i].match(_Lexer.rxIdent) != null && this._getInput$().match(_Lexer.rxIdent)[0].length !== expected[i].length) {
			} else {
				if (excludePattern != null && this._getInput$().match(excludePattern) != null) {
				} else {
					this._tokenLength = expected[i].length;
					return new Token$0(expected[i], false, this._filename, this._lineNumber, this._getColumn$());
				}
			}
		}
	}
	return null;
};


Parser.prototype._expect$S = function (expected) {
	return this._expect$ASLRegExp$([ expected ], null);
};


Parser.prototype._expect$AS = function (expected) {
	return this._expect$ASLRegExp$(expected, null);
};


Parser.prototype._expect$SLRegExp$ = function (expected, excludePattern) {
	return this._expect$ASLRegExp$([ expected ], excludePattern);
};


Parser.prototype._expect$ASLRegExp$ = function (expected, excludePattern) {
	var token;
	token = this._expectOpt$ASLRegExp$(expected, excludePattern);
	if (token == null) {
		this._newError$S("expected keyword: " + expected.join(" "));
		return null;
	}
	return token;
};


Parser.prototype._expectIdentifierOpt$ = function () {
	return this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
};


Parser.prototype._expectIdentifierOpt$F$LParser$LCompletionCandidates$$ = function (completionCb) {
	var matched;
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
	return new Token$0(matched[0], true, this._filename, this._lineNumber, this._getColumn$());
};


Parser.prototype._expectIdentifier$ = function () {
	return this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
};


Parser.prototype._expectIdentifier$F$LParser$LCompletionCandidates$$ = function (completionCb) {
	var token;
	token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(completionCb);
	if (token != null) {
		return token;
	}
	this._newError$S("expected an identifier");
	return null;
};


Parser.prototype._expectStringLiteralOpt$ = function () {
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxStringLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$0(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};


Parser.prototype._expectStringLiteral$ = function () {
	var token;
	token = this._expectStringLiteralOpt$();
	if (token != null) {
		return token;
	}
	this._newError$S("expected a string literal");
	return null;
};


Parser.prototype._expectNumberLiteralOpt$ = function () {
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
	return new Token$0(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};


Parser.prototype._expectRegExpLiteralOpt$ = function () {
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxRegExpLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token$0(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};


Parser.prototype._skipStatement$ = function () {
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


Parser.prototype._importStatement$LToken$ = function (importToken) {
	var classes;
	var token;
	var filenameToken;
	var alias;
	var success;
	var i;
	var j;
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
		this._errors.push(new CompileError(alias, "cannot use name of a built-in class as an alias"));
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
					this._errors.push(new CompileError(filenameToken, "cannot import the same file more than once (unless using an alias)"));
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


Parser.prototype._expectClassDefOpt$ = function () {
	var state;
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


Parser.prototype._classDefinition$ = function () {
	var $this = this;
	var nativeSource;
	var docComment;
	var token;
	var newFlag;
	var className;
	var implementType;
	var members;
	var success;
	var member;
	var i;
	var classDef;
	var templateClassDef;
	this._classType = null;
	this._extendType = null;
	this._implementTypes = [];
	this._objectTypesUsed = [];
	this._inners = [];
	this._templateInners = [];
	this._classFlags = 0;
	nativeSource = null;
	docComment = null;
	while (true) {
		token = this._expect$AS([ "class", "interface", "mixin", "abstract", "final", "native", "__fake__", "__export__" ]);
		if (token == null) {
			return null;
		}
		if (this._classFlags === 0) {
			docComment = this._docComment;
		}
		if (token.getValue$() === "class") {
			break;
		} else {
			if (token.getValue$() === "interface") {
				if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
					this._newError$S("interface cannot have final or native attribute set");
					return null;
				}
				this._classFlags |= ClassDefinition.IS_INTERFACE;
				break;
			} else {
				if (token.getValue$() === "mixin") {
					if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) !== 0) {
						this._newError$S("mixin cannot have final, native, or __export__ attribute set");
						return null;
					}
					this._classFlags |= ClassDefinition.IS_MIXIN;
					break;
				}
			}
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
			if (this._expectOpt$S("(") != null) {
				nativeSource = this._expectStringLiteral$();
				this._expect$S(")");
			}
			newFlag = ClassDefinition.IS_NATIVE;
			break;
		case "__fake__":
			newFlag = ClassDefinition.IS_FAKE;
			break;
		case "__export__":
			newFlag = ClassDefinition.IS_EXPORT;
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
	this._classType = new ParsedObjectType(new QualifiedName$1(className, this._outerClass != null ? this._outerClass.classType : null), this._typeArgs.map((function (token) {
		return new ParsedObjectType(new QualifiedName(token), []);
	})));
	this._objectTypesUsed.push(this._classType);
	if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		if (this._expectOpt$S("extends") != null) {
			this._extendType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, (function (classDef) {
				return (classDef.flags$() & (ClassDefinition.IS_MIXIN | ClassDefinition.IS_INTERFACE | ClassDefinition.IS_FINAL)) === 0;
			}));
		}
		if (this._extendType == null && className.getValue$() !== "Object") {
			this._extendType = new ParsedObjectType(new QualifiedName(new Token("Object", true)), []);
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
							this._errors.push(new CompileError(member.getNameToken$(), "a " + ((member.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "static" : "member") + " function with same name and arguments is already defined"));
							success = false;
							break;
						}
					} else {
						this._errors.push(new CompileError(member.getNameToken$(), "a property with same name already exists; only functions may be overloaded"));
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
		this._errors.push(new CompileError(className, "cannot re-define a built-in class"));
		success = false;
	} else {
		if (this._outerClass != null) {
			for (i = 0; i < this._outerClass.inners.length; ++ i) {
				if (this._outerClass.inners[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError(className, "a non-template inner class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (i = 0; i < this._outerClass.templateInners.length; ++ i) {
				if (this._outerClass.templateInners[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError(className, "a non-template inner class with the same name has been already declared"));
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
					this._errors.push(new CompileError(className, "a non-template class with the same name has been already declared"));
					success = false;
					break;
				}
			}
			for (i = 0; i < this._templateClassDefs.length; ++ i) {
				if (this._templateClassDefs[i].className$() === className.getValue$()) {
					this._errors.push(new CompileError(className, "a template class with the name same has been already declared"));
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
		templateClassDef = new TemplateClassDefinition(className, className.getValue$(), this._classFlags, this._typeArgs, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
		if (this._outerClass != null) {
			this._outerClass.templateInners.push(templateClassDef);
		} else {
			this._templateClassDefs.push(templateClassDef);
		}
		classDef = templateClassDef;
	} else {
		classDef = new ClassDefinition(className, className.getValue$(), this._classFlags, this._extendType, this._implementTypes, members, this._inners, this._templateInners, this._objectTypesUsed, docComment);
		if (this._outerClass != null) {
			this._outerClass.inners.push(classDef);
		} else {
			this._classDefs.push(classDef);
		}
	}
	if (nativeSource != null) {
		classDef.setNativeSource$LToken$(nativeSource);
	}
	classDef.setParser$LParser$(this);
	return classDef;
};


Parser.prototype._memberDefinition$ = function () {
	var $this = this;
	var flags;
	var isNoExport;
	var docComment;
	var token;
	var newFlag;
	var shouldExport;
	var name;
	var type;
	var initialValue;
	var closures;
	flags = 0;
	isNoExport = false;
	docComment = null;
	while (true) {
		token = this._expect$AS([ "function", "var", "static", "abstract", "override", "final", "const", "native", "__readonly__", "inline", "__pure__", "delete", "__export__", "__noexport__" ]);
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
			} else {
				if (token.getValue$() === "__noexport__") {
					if (isNoExport) {
						this._newError$S("same attribute cannot be specified more than once");
						return null;
					} else {
						if ((flags & ClassDefinition.IS_EXPORT) !== 0) {
							this._newError$S("cannot set the attribute, already declared as __export__");
							return null;
						}
					}
					isNoExport = true;
				} else {
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
					case "__export__":
						if (isNoExport) {
							this._newError$S("cannot set the attribute, already declared as __noexport__");
							return null;
						}
						newFlag = ClassDefinition.IS_EXPORT;
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
			}
		}
	}
	function shouldExport(name) {
		if (isNoExport) {
			return false;
		}
		if (($this._classFlags & ClassDefinition.IS_EXPORT) === 0) {
			return false;
		}
		if (name.charAt(0) === "_") {
			return false;
		}
		return true;
	}
	if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
		flags |= ClassDefinition.IS_ABSTRACT;
	}
	if (token.getValue$() === "function") {
		return this._functionDefinition$LToken$NLDocComment$F$SB$(token, flags, docComment, shouldExport);
	}
	if ((flags & ~ (ClassDefinition.IS_STATIC | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_CONST | ClassDefinition.IS_READONLY | ClassDefinition.IS_EXPORT)) !== 0) {
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
	if (shouldExport(name.getValue$())) {
		flags |= ClassDefinition.IS_EXPORT;
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	initialValue = null;
	closures = [];
	if (this._expectOpt$S("=") != null) {
		if ((flags & ClassDefinition.IS_ABSTRACT) !== 0) {
			this._newError$S("abstract variable cannot have default value");
			return null;
		}
		this._closures = closures;
		initialValue = this._assignExpr$B(false);
		this._closures = null;
		if (initialValue == null) {
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
	return new MemberVariableDefinition(token, name, flags, type, initialValue, closures, docComment);
};


Parser.prototype._functionDefinition$LToken$NLDocComment$F$SB$ = function (token, flags, docComment, shouldExport) {
	var $this = this;
	var name;
	var typeArgs;
	var numObjectTypesUsed;
	var args;
	var returnType;
	var createDefinition;
	var endDeclToken;
	var lastToken;
	var funcDef;
	name = this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
	if (name == null) {
		return null;
	}
	if (shouldExport(name.getValue$())) {
		flags |= ClassDefinition.IS_EXPORT;
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
			return (typeArgs.length !== 0 ? new TemplateFunctionDefinition(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastToken, docComment) : new MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastToken, docComment));
		}
		if ((this._classFlags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_DELETE)) !== 0) {
			if (this._expect$S(";") == null) {
				return null;
			}
			return createDefinition(null, null, [], null);
		} else {
			if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) !== 0) {
				endDeclToken = this._expect$AS([ ";", "{" ]);
				if (endDeclToken == null) {
					return null;
				}
				if (endDeclToken.getValue$() === ";") {
					return createDefinition(null, null, [], null);
				}
			} else {
				if (this._expect$S("{") == null) {
					return null;
				}
			}
		}
		this._funcLocal = null;
		this._arguments = args;
		this._locals = [];
		this._statements = [];
		this._closures = [];
		this._isGenerator = false;
		if (name.getValue$() === "constructor") {
			lastToken = this._initializeBlock$();
		} else {
			lastToken = this._block$();
		}
		if (this._isGenerator) {
			flags |= ClassDefinition.IS_GENERATOR;
		}
		funcDef = createDefinition(this._locals, this._statements, this._closures, lastToken);
		this._locals = null;
		this._statements = null;
		this._closures = null;
		return funcDef;
	} finally {
		this._typeArgs.splice(this._typeArgs.length - typeArgs.length, this._typeArgs.length);
		if (typeArgs.length !== 0) {
			this._objectTypesUsed.splice(numObjectTypesUsed, this._objectTypesUsed.length - numObjectTypesUsed);
		}
	}
};


Parser.prototype._formalTypeArguments$ = function () {
	var typeArgs;
	var typeArg;
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


Parser.prototype._actualTypeArguments$ = function () {
	var types;
	var state;
	var type;
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


Parser.prototype._typeDeclaration$B = function (allowVoid) {
	var token;
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


Parser.prototype._typeDeclarationNoArrayNoVoid$ = function () {
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


Parser.prototype._nullableTypeDeclaration$ = function () {
	var baseType;
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
			if (baseType.equals$LType$(new ParsedObjectType(new QualifiedName(this._typeArgs[i]), []))) {
				return baseType.toNullableType$B(true);
			}
		}
	}
	return baseType.toNullableType$();
};


Parser.prototype._primaryTypeDeclaration$ = function () {
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


Parser.prototype._objectTypeDeclaration$LToken$BF$LClassDefinition$B$ = function (firstToken, allowInner, autoCompleteMatchCb) {
	var $this = this;
	var token;
	var imprt;
	var qualifiedName;
	var typeArgs;
	var objectType;
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
		this._errors.push(new CompileError(token, "cannot use 'variant' as a class name"));
		return null;
	} else {
		if (token.getValue$() === "Nullable" || token.getValue$() === "MayBeUndefined") {
			this._errors.push(new CompileError(token, "cannot use 'Nullable' (or MayBeUndefined) as a class name"));
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
		qualifiedName = new QualifiedName$0(token, imprt);
		typeArgs = this._actualTypeArguments$();
		if (typeArgs == null) {
			return null;
		} else {
			if (typeArgs.length !== 0) {
				return this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
			} else {
				objectType = new ParsedObjectType(qualifiedName, []);
				this._objectTypesUsed.push(objectType);
				return objectType;
			}
		}
	} else {
		enclosingType = null;
		while (true) {
			qualifiedName = (enclosingType != null ? new QualifiedName$1(token, enclosingType) : new QualifiedName$0(token, imprt));
			typeArgs = this._actualTypeArguments$();
			if (typeArgs == null) {
				return null;
			} else {
				if (typeArgs.length !== 0) {
					enclosingType = this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
				} else {
					objectType = new ParsedObjectType(qualifiedName, []);
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


Parser.prototype._templateTypeDeclaration$LQualifiedName$ALType$ = function (qualifiedName, typeArgs) {
	var className;
	var objectType;
	className = qualifiedName.getToken$().getValue$();
	if ((className === "Array" || className === "Map") && typeArgs[0] instanceof NullableType) {
		this._newError$S("cannot declare " + className + ".<Nullable.<T>>, should be " + className + ".<T>");
		return null;
	}
	objectType = new ParsedObjectType(qualifiedName, typeArgs);
	this._objectTypesUsed.push(objectType);
	return objectType;
};


Parser.prototype._lightFunctionTypeDeclaration$LType$ = function (objectType) {
	var argTypes;
	var isVarArg;
	var argType;
	var token;
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
				argTypes.push(new VariableLengthArgumentType(argType));
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
		return new MemberFunctionType(null, objectType, returnType, argTypes, true);
	} else {
		return new StaticFunctionType(null, returnType, argTypes, true);
	}
};


Parser.prototype._functionTypeDeclaration$LType$ = function (objectType) {
	var argTypes;
	var isVarArg;
	var argType;
	var token;
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
				argTypes.push(new VariableLengthArgumentType(argType));
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
		return new MemberFunctionType(null, objectType, returnType, argTypes, true);
	} else {
		return new StaticFunctionType(null, returnType, argTypes, true);
	}
};


Parser.prototype._registerArrayTypeOf$LToken$LType$ = function (token, elementType) {
	var arrayType;
	arrayType = new ParsedObjectType(new QualifiedName(new Token("Array", true)), [ elementType ]);
	this._objectTypesUsed.push(arrayType);
	return arrayType;
};


Parser.prototype._initializeBlock$ = function () {
	var token;
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


Parser.prototype._block$ = function () {
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


Parser.prototype._statement$ = function () {
	var state;
	var label;
	var token;
	var expr;
	state = this._preserveState$();
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (label != null && this._expectOpt$S(":") != null) {
	} else {
		this._restoreState$LParserState$(state);
		label = null;
	}
	token = this._expectOpt$AS([ "{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "yield", "switch", "throw", "try", "assert", "log", "delete", "debugger", "function", "void" ]);
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
		case "yield":
			return this._yieldStatement$LToken$(token);
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
	this._statements.push(new ExpressionStatement(expr));
	if (this._expect$S(";") == null) {
		return false;
	}
	return true;
};


Parser.prototype._constructorInvocationStatement$ = function () {
	var token;
	var classType;
	var i;
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
	this._statements.push(new ConstructorInvocationStatement(token, classType, args));
	return true;
};


Parser.prototype._variableStatement$ = function () {
	var succeeded;
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
		this._statements.push(new ExpressionStatement(expr));
	}
	return true;
};


Parser.prototype._functionStatement$LToken$ = function (token) {
	var $this = this;
	var name;
	var args;
	var returnType;
	var funcLocal;
	var lastToken;
	var flags;
	var funcDef;
	name = this._expectIdentifierOpt$();
	if (name == null) {
		return false;
	}
	if (this._expect$S("(") == null) {
		return false;
	}
	args = this._functionArgumentsExpr$BB(false, true);
	if (args == null) {
		return false;
	}
	if (this._expect$S(":") == null) {
		return false;
	}
	returnType = this._typeDeclaration$B(true);
	if (returnType == null) {
		return false;
	}
	if (this._expect$S("{") == null) {
		return false;
	}
	funcLocal = this._registerLocal$LToken$LType$(name, new StaticFunctionType(token, returnType, args.map((function (arg) {
		return arg.getType$();
	})), false));
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(funcLocal, args);
	lastToken = this._block$();
	if (lastToken == null) {
		this._popScope$();
		return false;
	}
	flags = ClassDefinition.IS_STATIC;
	if (this._isGenerator) {
		flags |= ClassDefinition.IS_GENERATOR;
	}
	funcDef = new MemberFunctionDefinition(token, name, flags, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
	this._popScope$();
	this._closures.push(funcDef);
	funcDef.setFuncLocal$LLocalVariable$(funcLocal);
	this._statements.push(new FunctionStatement(token, funcDef));
	return true;
};


Parser.prototype._ifStatement$LToken$ = function (token) {
	var expr;
	var onTrueStatements;
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
	this._statements.push(new IfStatement(token, expr, onTrueStatements, onFalseStatements));
	return true;
};


Parser.prototype._doWhileStatement$LToken$LToken$ = function (token, label) {
	var statements;
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
	this._statements.push(new DoWhileStatement(token, label, expr, statements));
	return true;
};


Parser.prototype._whileStatement$LToken$LToken$ = function (token, label) {
	var expr;
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
	this._statements.push(new WhileStatement(token, label, expr, statements));
	return true;
};


Parser.prototype._forStatement$LToken$LToken$ = function (token, label) {
	var state;
	var initExpr;
	var succeeded;
	var condExpr;
	var postExpr;
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
	this._statements.push(new ForStatement(token, label, initExpr, condExpr, postExpr, statements));
	return true;
};


Parser.prototype._forInStatement$LToken$LToken$ = function (token, label) {
	var lhsExpr;
	var listExpr;
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
	this._statements.push(new ForInStatement(token, label, lhsExpr, listExpr, statements));
	return 1;
};


Parser.prototype._continueStatement$LToken$ = function (token) {
	var label;
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new ContinueStatement(token, label));
	return true;
};


Parser.prototype._breakStatement$LToken$ = function (token) {
	var label;
	label = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new BreakStatement(token, label));
	return true;
};


Parser.prototype._returnStatement$LToken$ = function (token) {
	var expr;
	if (this._expectOpt$S(";") != null) {
		this._statements.push(new ReturnStatement(token, null));
		return true;
	}
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	this._statements.push(new ReturnStatement(token, expr));
	if (this._expect$S(";") == null) {
		return false;
	}
	return true;
};


Parser.prototype._yieldStatement$LToken$ = function (token) {
	var expr;
	expr = this._expr$B(false);
	if (expr == null) {
		return false;
	}
	this._statements.push(new YieldStatement(token, expr));
	if (this._expect$S(";") == null) {
		return false;
	}
	this._isGenerator = true;
	return true;
};


Parser.prototype._switchStatement$LToken$LToken$ = function (token, label) {
	var expr;
	var foundCaseLabel;
	var foundDefaultLabel;
	var startStatementIndex;
	var caseOrDefaultToken;
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
				this._statements.push(new CaseStatement(caseOrDefaultToken, labelExpr));
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
				this._statements.push(new DefaultStatement(caseOrDefaultToken));
				foundDefaultLabel = true;
			}
		} else {
			if (! this._statement$()) {
				this._skipStatement$();
			}
		}
	}
	this._statements.push(new SwitchStatement(token, label, expr, this._statements.splice(startStatementIndex, this._statements.length - startStatementIndex)));
	return true;
};


Parser.prototype._throwStatement$LToken$ = function (token) {
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	this._statements.push(new ThrowStatement(token, expr));
	return true;
};


Parser.prototype._tryStatement$LToken$ = function (tryToken) {
	var startIndex;
	var tryStatements;
	var catchStatements;
	var catchOrFinallyToken;
	var catchIdentifier;
	var catchType;
	var caughtVariable;
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
		caughtVariable = new CaughtVariable(catchIdentifier, catchType);
		this._locals.push(caughtVariable);
		try {
			if (this._block$() == null) {
				return false;
			}
		} finally {
			this._locals.splice(this._locals.indexOf(caughtVariable), 1);
		}
		catchStatements.push(new CatchStatement(catchOrFinallyToken, caughtVariable, this._statements.splice(startIndex, this._statements.length - startIndex)));
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
	this._statements.push(new TryStatement(tryToken, tryStatements, catchStatements, finallyStatements));
	return true;
};


Parser.prototype._assertStatement$LToken$ = function (token) {
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new AssertStatement(token, expr));
	return true;
};


Parser.prototype._logStatement$LToken$ = function (token) {
	var exprs;
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
	this._statements.push(new LogStatement(token, exprs));
	return true;
};


Parser.prototype._deleteStatement$LToken$ = function (token) {
	var expr;
	expr = this._expr$();
	if (expr == null) {
		return false;
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new DeleteStatement(token, expr));
	return true;
};


Parser.prototype._debuggerStatement$LToken$ = function (token) {
	this._statements.push(new DebuggerStatement(token));
	return true;
};


Parser.prototype._subStatements$ = function () {
	var statementIndex;
	statementIndex = this._statements.length;
	if (! this._statement$()) {
		this._skipStatement$();
	}
	return this._statements.splice(statementIndex, this._statements.length - statementIndex);
};


Parser.prototype._variableDeclarations$BAB = function (noIn, isSuccess) {
	var expr;
	var commaToken;
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
			expr = (expr != null ? new CommaExpression(commaToken, expr, declExpr) : declExpr);
		}
	} while ((commaToken = this._expectOpt$S(",")) != null);
	isSuccess[0] = true;
	return expr;
};


Parser.prototype._variableDeclaration$B = function (noIn) {
	var identifier;
	var type;
	var local;
	var initialValue;
	var assignToken;
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
	expr = new LocalExpression(identifier, local);
	if (initialValue != null) {
		expr = new AssignmentExpression(assignToken, expr, initialValue);
	}
	return expr;
};


Parser.prototype._expr$ = function () {
	return this._expr$B(false);
};


Parser.prototype._expr$B = function (noIn) {
	var expr;
	var commaToken;
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
		expr = new CommaExpression(commaToken, expr, assignExpr);
	}
	return expr;
};


Parser.prototype._assignExpr$ = function () {
	return this._assignExpr$B(false);
};


Parser.prototype._assignExpr$B = function (noIn) {
	var state;
	var lhsExpr;
	var op;
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
			return new AssignmentExpression(op, lhsExpr, assignExpr);
		}
	}
	this._restoreState$LParserState$(state);
	return this._condExpr$B(noIn);
};


Parser.prototype._condExpr$B = function (noIn) {
	var lorExpr;
	var operatorToken;
	var ifTrueExpr;
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
	return new ConditionalExpression(operatorToken, lorExpr, ifTrueExpr, ifFalseExpr);
};


Parser.prototype._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$ = function (ops, excludePattern, parseFunc, noIn, builderFunc) {
	var expr;
	var op;
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


Parser.prototype._lorExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "||" ], null, (function (noIn) {
		return $this._landExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new LogicalExpression(op, e1, e2);
	}));
};


Parser.prototype._landExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "&&" ], null, (function (noIn) {
		return $this._borExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new LogicalExpression(op, e1, e2);
	}));
};


Parser.prototype._borExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "|" ], /^\|\|/, (function (noIn) {
		return $this._bxorExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression(op, e1, e2);
	}));
};


Parser.prototype._bxorExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "^" ], null, (function (noIn) {
		return $this._bandExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression(op, e1, e2);
	}));
};


Parser.prototype._bandExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "&" ], /^&&/, (function (noIn) {
		return $this._eqExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new BinaryNumberExpression(op, e1, e2);
	}));
};


Parser.prototype._eqExpr$B = function (noIn) {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "==", "!=" ], null, (function (noIn) {
		return $this._relExpr$B(noIn);
	}), noIn, (function (op, e1, e2) {
		return new EqualityExpression(op, e1, e2);
	}));
};


Parser.prototype._relExpr$B = function (noIn) {
	var $this = this;
	var ops;
	ops = [ "<=", ">=", "<", ">" ];
	if (! noIn) {
		ops.push("in");
	}
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$(ops, null, (function (noIn) {
		return $this._shiftExpr$();
	}), noIn, (function (op, e1, e2) {
		if (op.getValue$() === "in") {
			return new InExpression(op, e1, e2);
		} else {
			return new BinaryNumberExpression(op, e1, e2);
		}
	}));
};


Parser.prototype._shiftExpr$ = function () {
	var $this = this;
	var expr;
	expr = this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ ">>>", "<<", ">>" ], null, (function (noIn) {
		return $this._addExpr$();
	}), false, (function (op, e1, e2) {
		return new ShiftExpression(op, e1, e2);
	}));
	return expr;
};


Parser.prototype._addExpr$ = function () {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "+", "-" ], /^[+-]{2}/, (function (noIn) {
		return $this._mulExpr$();
	}), false, (function (op, e1, e2) {
		if (op.getValue$() === "+") {
			return new AdditiveExpression(op, e1, e2);
		} else {
			return new BinaryNumberExpression(op, e1, e2);
		}
	}));
};


Parser.prototype._mulExpr$ = function () {
	var $this = this;
	return this._binaryOpExpr$ASLRegExp$F$BLExpression$$BF$LToken$LExpression$LExpression$LExpression$$([ "*", "/", "%" ], null, (function (noIn) {
		return $this._unaryExpr$();
	}), false, (function (op, e1, e2) {
		return new BinaryNumberExpression(op, e1, e2);
	}));
};


Parser.prototype._unaryExpr$ = function () {
	var op;
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
		return new PreIncrementExpression(op, expr);
	case "+":
	case "-":
		return new SignExpression(op, expr);
	case "~":
		return new BitwiseNotExpression(op, expr);
	case "!":
		return new LogicalNotExpression(op, expr);
	case "typeof":
		return new TypeofExpression(op, expr);
	default:
		throw new Error("logic flaw");
	}
};


Parser.prototype._asExpr$ = function () {
	var expr;
	var token;
	var noConvert;
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
		expr = (noConvert ? new AsNoConvertExpression(token, expr, type) : new AsExpression(token, expr, type));
	}
	return expr;
};


Parser.prototype._postfixExpr$ = function () {
	var expr;
	var op;
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
		return new InstanceofExpression(op, expr, type);
	default:
		return new PostIncrementExpression(op, expr);
	}
};


Parser.prototype._lhsExpr$ = function () {
	var $this = this;
	var state;
	var expr;
	var token;
	var args;
	var index;
	var identifier;
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
			expr = this._functionExpr$LToken$(token);
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
			expr = new CallExpression(token, expr, args);
			break;
		case "[":
			index = this._expr$B(false);
			if (index == null) {
				return null;
			}
			if (this._expect$S("]") == null) {
				return null;
			}
			expr = new ArrayExpression(token, expr, index);
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
			expr = new PropertyExpression(token, expr, identifier, typeArgs);
			break;
		}
	}
	return expr;
};


Parser.prototype._newExpr$LToken$ = function (newToken) {
	var type;
	var lengthExpr;
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
			return new NewExpression(newToken, type, [ lengthExpr ]);
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
	return new NewExpression(newToken, type, args);
};


Parser.prototype._superExpr$ = function () {
	var identifier;
	var token;
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
	return new SuperExpression(token, identifier, args);
};


Parser.prototype._lambdaExpr$LToken$ = function (token) {
	var args;
	var returnType;
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
	return new FunctionExpression(token, funcDef);
};


Parser.prototype._lambdaBody$LToken$ALArgumentDeclaration$LType$ = function (token, args, returnType) {
	var openBlock;
	var flags;
	var expr;
	var lastToken;
	openBlock = this._expectOpt$S("{");
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(null, args);
	try {
		flags = ClassDefinition.IS_STATIC;
		if (openBlock == null) {
			expr = this._expr$();
			this._statements.push(new ReturnStatement(token, expr));
			return new MemberFunctionDefinition(token, null, flags, returnType, args, this._locals, this._statements, this._closures, null, null);
		} else {
			lastToken = this._block$();
			if (lastToken == null) {
				return null;
			}
			if (this._isGenerator) {
				flags |= ClassDefinition.IS_GENERATOR;
			}
			return new MemberFunctionDefinition(token, null, flags, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
		}
	} finally {
		this._popScope$();
	}
};


Parser.prototype._functionExpr$LToken$ = function (token) {
	var $this = this;
	var name;
	var args;
	var returnType;
	var type;
	var argTypes;
	var funcLocal;
	var lastToken;
	var flags;
	var funcDef;
	name = this._expectIdentifierOpt$();
	if (this._expect$S("(") == null) {
		return null;
	}
	args = this._functionArgumentsExpr$BB(false, false);
	if (args == null) {
		return null;
	}
	if (this._expectOpt$S(":") != null) {
		returnType = this._typeDeclaration$B(true);
		if (returnType == null) {
			return null;
		}
	} else {
		returnType = null;
	}
	if (this._expect$S("{") == null) {
		return null;
	}
	type = null;
	if (returnType != null) {
		argTypes = args.map((function (arg) {
			return arg.getType$();
		}));
		type = new StaticFunctionType(token, returnType, argTypes, false);
	}
	funcLocal = null;
	if (name != null) {
		funcLocal = new LocalVariable(name, type);
	}
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(funcLocal, args);
	lastToken = this._block$();
	if (lastToken == null) {
		this._popScope$();
		return null;
	}
	flags = ClassDefinition.IS_STATIC;
	if (this._isGenerator) {
		flags |= ClassDefinition.IS_GENERATOR;
	}
	funcDef = new MemberFunctionDefinition(token, name, flags, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
	this._popScope$();
	this._closures.push(funcDef);
	funcDef.setFuncLocal$LLocalVariable$(funcLocal);
	return new FunctionExpression(token, funcDef);
};


Parser.prototype._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$ = function (cb) {
	var scope;
	if (this._locals != null) {
		if (! cb(this._funcLocal, this._locals, this._arguments)) {
			return false;
		}
		for (scope = this._prevScope; scope != null; scope = scope.prev) {
			if (scope.locals && ! cb(scope.funcLocal, scope.locals, scope.arguments)) {
				return false;
			}
		}
	}
	return true;
};


Parser.prototype._findLocal$S = function (name) {
	var $this = this;
	var found;
	found = null;
	this._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$((function (funcLocal, locals, args) {
		var i;
		if (funcLocal != null && funcLocal.getName$().getValue$() === name) {
			found = funcLocal;
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


Parser.prototype._primaryExpr$ = function () {
	var $this = this;
	var token;
	var expr;
	var local;
	var parsedType;
	if ((token = this._expectOpt$AS([ "this", "undefined", "null", "false", "true", "[", "{", "(" ])) != null) {
		switch (token.getValue$()) {
		case "this":
			return new ThisExpression(token, null);
		case "undefined":
			this._newDeprecatedWarning$S("use of 'undefined' is deprerated, use 'null' instead");
		case "null":
			return this._nullLiteral$LToken$(token);
		case "false":
			return new BooleanLiteralExpression(token);
		case "true":
			return new BooleanLiteralExpression(token);
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
			return new NumberLiteralExpression(token);
		} else {
			if ((token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$((function (self) {
				return self._getCompletionCandidatesWithLocal$();
			}))) != null) {
				local = this._findLocal$S(token.getValue$());
				if (local != null) {
					return new LocalExpression(token, local);
				} else {
					parsedType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(token, false, null);
					if (parsedType == null) {
						return null;
					}
					return new ClassExpression(parsedType.getToken$(), parsedType);
				}
			} else {
				if ((token = this._expectStringLiteralOpt$()) != null) {
					return new StringLiteralExpression(token);
				} else {
					if ((token = this._expectRegExpLiteralOpt$()) != null) {
						return new RegExpLiteralExpression(token);
					} else {
						this._newError$S("expected primary expression");
						return null;
					}
				}
			}
		}
	}
};


Parser.prototype._nullLiteral$LToken$ = function (token) {
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
	return new NullExpression(token, type);
};


Parser.prototype._arrayLiteral$LToken$ = function (token) {
	var exprs;
	var expr;
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
	return new ArrayLiteralExpression(token, exprs, type);
};


Parser.prototype._hashLiteral$LToken$ = function (token) {
	var elements;
	var keyToken;
	var expr;
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
			elements.push(new MapLiteralElement(keyToken, expr));
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
	return new MapLiteralExpression(token, elements, type);
};


Parser.prototype._functionArgumentsExpr$BB = function (allowVarArgs, requireTypeDeclaration) {
	var args;
	var token;
	var isVarArg;
	var argName;
	var argType;
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
			if (requireTypeDeclaration) {
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
					this._errors.push(new CompileError(argName, "cannot declare an argument with the same name twice"));
					return null;
				}
			}
			if (isVarArg) {
				if (argType == null && isVarArg) {
					throw new Error("not yet implemented!");
				}
				args.push(new ArgumentDeclaration(argName, new VariableLengthArgumentType(argType)));
				if (this._expect$S(")") == null) {
					return null;
				}
				break;
			}
			args.push(new ArgumentDeclaration(argName, argType));
			token = this._expect$AS([ ")", "," ]);
			if (token == null) {
				return null;
			}
		} while (token.getValue$() === ",");
	}
	return args;
};


Parser.prototype._argsExpr$ = function () {
	var args;
	var token;
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


Parser.prototype._getCompletionCandidatesOfTopLevel$F$LClassDefinition$B$ = function (autoCompleteMatchCb) {
	return new CompletionCandidatesOfTopLevel(this, autoCompleteMatchCb);
};


Parser.prototype._getCompletionCandidatesWithLocal$ = function () {
	return new _CompletionCandidatesWithLocal(this);
};


Parser.prototype._getCompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$ = function (imprt, autoCompleteMatchCb) {
	return new _CompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb);
};


Parser.prototype._getCompletionCandidatesOfProperty$LExpression$ = function (expr) {
	return new _CompletionCandidatesOfProperty(expr);
};


function Parser$_isReservedClassName$S(name) {
	return name.match(/^(Array|Boolean|Date|Function|Map|Number|Object|RegExp|String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError|JSX)$/) != null;
};

Parser._isReservedClassName$S = Parser$_isReservedClassName$S;

function SourceMapper(rootDir, outputFile) {
	this._fileMap = {};
	this._rootDir = rootDir;
	this._outputFile = Util$resolvePath$S(outputFile);
	this._copyDestDir = this._outputFile + ".mapping.d";
	this._impl = SourceMapper$createSourceMapGenerator$HS(({ file: Util$basename$S(this._outputFile), sourceRoot: Util$basename$S(this._copyDestDir) }));
};

$__jsx_extend([SourceMapper], Object);
function SourceMapper$createSourceMapGenerator$HS(args) {
	return eval('new (require("source-map").SourceMapGenerator)(' + JSON.stringify(args) + ')');
};

SourceMapper.createSourceMapGenerator$HS = SourceMapper$createSourceMapGenerator$HS;

function SourceMapper$createSourceMapConsumer$X(mapping) {
	return eval('new (require("source-map").SourceMapConsumer)(' + JSON.stringify(mapping) + ')');
};

SourceMapper.createSourceMapConsumer$X = SourceMapper$createSourceMapConsumer$X;

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


SourceMapper.prototype.getSourceMappingFile$ = function () {
	return this._outputFile + ".mapping";
};


SourceMapper.prototype.getSourceFileMap$ = function () {
	return this._fileMap;
};


SourceMapper.prototype.generate$ = function () {
	return this._impl.toString();
};


SourceMapper.prototype.magicToken$ = function () {
	var sourceMappingFile;
	sourceMappingFile = Util$basename$S(this.getSourceMappingFile$());
	return "\n" + "//@ sourceMappingURL=" + sourceMappingFile + "\n";
};


function _Util$0() {
};

$__jsx_extend([_Util$0], Object);
function _Util$0$handleSubStatements$F$ALStatement$B$LStatement$(cb, statement) {
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

_Util$0.handleSubStatements$F$ALStatement$B$LStatement$ = _Util$0$handleSubStatements$F$ALStatement$B$LStatement$;

function _Util$0$classIsNative$LClassDefinition$(classDef) {
	return ! classDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
		if (classDef.className$() === "Object" || (classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			return true;
		}
		return false;
	}));
};

_Util$0.classIsNative$LClassDefinition$ = _Util$0$classIsNative$LClassDefinition$;

function _Util$0$exprHasSideEffects$LExpression$(expr) {
	var onExpr;
	function onExpr(expr, _) {
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
	}
	return ! onExpr(expr, null);
};

_Util$0.exprHasSideEffects$LExpression$ = _Util$0$exprHasSideEffects$LExpression$;

function _Util$0$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, optimizeExpressions) {
	var optimizeStatements;
	var statements;
	function optimizeStatements(statements) {
		var statementIndex;
		var exprsToOptimize;
		var setOptimizedExprs;
		var statement;
		var expr;
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
	}
	statements = funcDef.getStatements$();
	if (statements != null) {
		optimizeStatements(statements);
	}
};

_Util$0.optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$ = _Util$0$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$;

function Optimizer() {
	this._compiler = null;
	this._commands = [];
	this._log = [];
	this._dumpLogs = false;
	this._enableRunTimeTypeCheck = true;
};

$__jsx_extend([Optimizer], Object);
function Optimizer$getReleaseOptimizationCommands$() {
	return [ "lto", "no-assert", "no-log", "no-debug", "fold-const", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify" ];
};

Optimizer.getReleaseOptimizationCommands$ = Optimizer$getReleaseOptimizationCommands$;

Optimizer.prototype.setup$AS = function (cmds) {
	var $this = this;
	var calleesAreDetermined;
	var determineCallee;
	var i;
	var cmd;
	calleesAreDetermined = false;
	function determineCallee() {
		if (! calleesAreDetermined) {
			$this._commands.push(new _DetermineCalleeCommand());
			calleesAreDetermined = true;
		}
	}
	for (i = 0; i < cmds.length; ++ i) {
		cmd = cmds[i];
		if (cmd == "lto") {
			this._commands.push(new _LinkTimeOptimizationCommand());
		} else {
			if (cmd == "no-assert") {
				this._commands.push(new _NoAssertCommand());
			} else {
				if (cmd == "no-log") {
					this._commands.push(new _NoLogCommand());
				} else {
					if (cmd == "no-debug") {
						this._commands.push(new _NoDebugCommand());
					} else {
						if (cmd == "staticize") {
							this._commands.push(new _StaticizeOptimizeCommand());
							calleesAreDetermined = false;
						} else {
							if (cmd == "unclassify") {
								this._commands.push(new _UnclassifyOptimizationCommand());
								calleesAreDetermined = false;
							} else {
								if (cmd == "fold-const") {
									this._commands.push(new _FoldConstantCommand());
								} else {
									if (cmd == "dce") {
										determineCallee();
										this._commands.push(new _DeadCodeEliminationOptimizeCommand());
									} else {
										if (cmd == "inline") {
											determineCallee();
											this._commands.push(new _InlineOptimizeCommand());
										} else {
											if (cmd == "return-if") {
												this._commands.push(new _ReturnIfOptimizeCommand());
											} else {
												if (cmd == "lcse") {
													this._commands.push(new _LCSEOptimizeCommand());
												} else {
													if (cmd == "unbox") {
														determineCallee();
														this._commands.push(new _UnboxOptimizeCommand());
													} else {
														if (cmd == "array-length") {
															this._commands.push(new _ArrayLengthOptimizeCommand());
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


Optimizer.prototype.enableRuntimeTypeCheck$ = function () {
	return this._enableRunTimeTypeCheck;
};


Optimizer.prototype.setEnableRunTimeTypeCheck$B = function (mode) {
	this._enableRunTimeTypeCheck = mode;
};


Optimizer.prototype.setCompiler$LCompiler$ = function (compiler) {
	this._compiler = compiler;
	return this;
};


Optimizer.prototype.getCompiler$ = function () {
	return this._compiler;
};


Optimizer.prototype.performOptimization$ = function () {
	var i;
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


Optimizer.prototype.log$S = function (message) {
	this._log.push(message);
};


Optimizer.prototype.dumpLogs$ = function () {
	var platform;
	var i;
	platform = this._compiler.getPlatform$();
	for (i = 0; i < this._log.length; ++ i) {
		platform.error$S(this._log[i]);
	}
};


function _OptimizeCommand(identifier) {
	this._identifier = identifier;
	this._optimizer = null;
};

$__jsx_extend([_OptimizeCommand], Object);
_OptimizeCommand.prototype.setup$LOptimizer$ = function (optimizer) {
	this._optimizer = optimizer;
	return this;
};


_OptimizeCommand.prototype.getCompiler$ = function () {
	return this._optimizer.getCompiler$();
};


_OptimizeCommand.prototype.getStash$LStashable$ = function (stashable) {
	var stash;
	stash = stashable.getStash$();
	if (stash[this._identifier] == null) {
		stash[this._identifier] = this._createStash$();
	}
	return stash[this._identifier];
};


_OptimizeCommand.prototype._createStash$ = function () {
	throw new Error("if you are going to use the stash, you need to override this function");
};


_OptimizeCommand.prototype.createVar$LMemberFunctionDefinition$LType$S = function (funcDef, type, baseName) {
	var $this = this;
	var locals;
	var nameExists;
	var i;
	var newLocal;
	locals = funcDef.getLocals$();
	function nameExists(n) {
		var i;
		for (i = 0; i < locals.length; ++ i) {
			if (locals[i].getName$().getValue$() === n) {
				return true;
			}
		}
		return false;
	}
	for (i = 0; nameExists(baseName + "$" + (i + "")); ++ i) {
	}
	newLocal = new LocalVariable(new Token(baseName + "$" + (i + ""), false), type);
	locals.push(newLocal);
	this.log$S("rewriting " + baseName + " to " + newLocal.getName$().getValue$());
	return newLocal;
};


_OptimizeCommand.prototype.log$S = function (message) {
	this._optimizer.log$S("[" + this._identifier + "] " + message);
};


_OptimizeCommand.prototype.setupCommand$L_OptimizeCommand$ = function (command) {
	command.setup$LOptimizer$(this._optimizer);
	return command;
};


function _FunctionOptimizeCommand(identifier) {
	_OptimizeCommand.call(this, identifier);
	this._excludeNative = false;
};

$__jsx_extend([_FunctionOptimizeCommand], _OptimizeCommand);
_FunctionOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	var doit;
	function doit(funcDef) {
		$this.log$S("starting optimization of " + funcDef.getNotation$());
		$this.optimizeFunction$LMemberFunctionDefinition$(funcDef);
		$this.log$S("finished optimization of " + funcDef.getNotation$());
	}
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
			var funcDef;
			if (member instanceof MemberFunctionDefinition) {
				funcDef = member;
				if (funcDef.getStatements$() != null) {
					doit(funcDef);
				}
			}
			member.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
				doit(funcDef);
				return true;
			}));
			return true;
		}));
		return true;
	}));
};


function _LinkTimeOptimizationCommand() {
	_OptimizeCommand.call(this, _LinkTimeOptimizationCommand.IDENTIFIER);
};

$__jsx_extend([_LinkTimeOptimizationCommand], _OptimizeCommand);
_LinkTimeOptimizationCommand.prototype._createStash$ = function () {
	return new _LinkTimeOptimizationCommand$CStash();
};


_LinkTimeOptimizationCommand.prototype.performOptimization$ = function () {
	var $this = this;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
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
		if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL | ClassDefinition.IS_EXPORT)) === 0 && $this.getStash$LStashable$(classDef).extendedBy.length === 0) {
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


_LinkTimeOptimizationCommand.prototype._getOverrides$LClassDefinition$ALClassDefinition$SALType$ = function (srcClassDef, classDefs, name, argTypes) {
	var overrides;
	var i;
	overrides = [];
	for (i = 0; i < classDefs.length; ++ i) {
		overrides = overrides.concat(this._getOverridesByClass$LClassDefinition$LClassDefinition$SALType$(srcClassDef, classDefs[i], name, argTypes));
	}
	return overrides;
};


_LinkTimeOptimizationCommand.prototype._getOverridesByClass$LClassDefinition$LClassDefinition$SALType$ = function (srcClassDef, classDef, name, argTypes) {
	var $this = this;
	var overrides;
	var addOverride;
	var implementClassDefs;
	var i;
	overrides = this._getOverrides$LClassDefinition$ALClassDefinition$SALType$(srcClassDef, this.getStash$LStashable$(classDef).extendedBy, name, argTypes);
	function addOverride(funcDef) {
		if (funcDef.name$() === name && (funcDef.flags$() & ClassDefinition.IS_ABSTRACT) === 0 && Util$typesAreEqual$ALType$ALType$(funcDef.getArgumentTypes$(), argTypes)) {
			overrides.push(funcDef);
			return false;
		}
		return true;
	}
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


function _NoAssertCommand() {
	_FunctionOptimizeCommand.call(this, _NoAssertCommand.IDENTIFIER);
};

$__jsx_extend([_NoAssertCommand], _FunctionOptimizeCommand);
_NoAssertCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	return true;
};


_NoAssertCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	var $this = this;
	var optimize;
	function optimize(statements) {
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof AssertStatement) {
				statements.splice(i, 1);
			} else {
				_Util$0$handleSubStatements$F$ALStatement$B$LStatement$(optimize, statements[i]);
				++ i;
			}
		}
		return false;
	}
	optimize(statements);
};


function _NoLogCommand() {
	_FunctionOptimizeCommand.call(this, _NoLogCommand.IDENTIFIER);
};

$__jsx_extend([_NoLogCommand], _FunctionOptimizeCommand);
_NoLogCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	return true;
};


_NoLogCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	var $this = this;
	var optimize;
	function optimize(statements) {
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof LogStatement) {
				statements.splice(i, 1);
			} else {
				_Util$0$handleSubStatements$F$ALStatement$B$LStatement$(optimize, statements[i]);
				++ i;
			}
		}
		return false;
	}
	optimize(statements);
};


function _DetermineCalleeCommand() {
	_FunctionOptimizeCommand.call(this, _DetermineCalleeCommand.IDENTIFIER);
};

$__jsx_extend([_DetermineCalleeCommand], _FunctionOptimizeCommand);
_DetermineCalleeCommand.prototype._createStash$ = function () {
	return new _DetermineCalleeCommand$CStash();
};


_DetermineCalleeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		var callingFuncDef;
		if (statement instanceof ConstructorInvocationStatement) {
			callingFuncDef = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(statement.getConstructingClassDef$(), "constructor", statement.getConstructorType$().getArgumentTypes$(), false);
			if (callingFuncDef == null) {
				throw new Error("could not determine the associated parent ctor");
			}
			$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(statement, callingFuncDef);
		} else {
			if (statement instanceof FunctionStatement) {
				statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
		}
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			var calleeExpr;
			var propertyExpr;
			var holderType;
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


_DetermineCalleeCommand.prototype._setCallingFuncDef$LStashable$LMemberFunctionDefinition$ = function (stashable, funcDef) {
	this.getStash$LStashable$(stashable).callingFuncDef = funcDef;
};


function _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic) {
	var found;
	found = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic);
	if (found != null) {
		if ((found.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) === 0) {
			found = null;
		}
	}
	return found;
};

_DetermineCalleeCommand.findCallingFunctionInClass$LClassDefinition$SALType$B = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B;

function _DetermineCalleeCommand$findCallingFunction$LClassDefinition$SALType$B(classDef, funcName, argTypes, isStatic) {
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

_DetermineCalleeCommand.findCallingFunction$LClassDefinition$SALType$B = _DetermineCalleeCommand$findCallingFunction$LClassDefinition$SALType$B;

function _DetermineCalleeCommand$getCallingFuncDef$LStashable$(stashable) {
	var stash;
	stash = stashable.getStash$()[_DetermineCalleeCommand.IDENTIFIER];
	if (stash == null) {
		throw new Error("callee not searched");
	}
	return stash.callingFuncDef;
};

_DetermineCalleeCommand.getCallingFuncDef$LStashable$ = _DetermineCalleeCommand$getCallingFuncDef$LStashable$;

function _StaticizeOptimizeCommand() {
	_OptimizeCommand.call(this, _StaticizeOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_StaticizeOptimizeCommand], _OptimizeCommand);
_StaticizeOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	var memberCanBeStaticized;
	function memberCanBeStaticized(funcDef) {
		return (funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) === ClassDefinition.IS_FINAL && funcDef.name$() !== "constructor" && ! Util$memberIsExported$LClassDefinition$SALType$B(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$(), false);
	}
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
			return true;
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFunction(funcDef) {
			if (memberCanBeStaticized(funcDef)) {
				$this.log$S("rewriting method to static function: " + funcDef.name$());
				$this._rewriteFunctionAsStatic$LMemberFunctionDefinition$(funcDef);
			}
			return true;
		}));
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
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
			var onStatement;
			function onStatement(statement) {
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$(expr, replaceCb);
					return true;
				}));
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			}
			funcDef.forEachStatement$F$LStatement$B$(onStatement);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFunction);
		return true;
	}));
};


_StaticizeOptimizeCommand.prototype._rewriteFunctionAsStatic$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var thisArg;
	thisArg = new ArgumentDeclaration(new Token("$this", false), new ObjectType(funcDef.getClassDef$()));
	funcDef.getArguments$().unshift(thisArg);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression(thisArg.getName$(), thisArg));
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


_StaticizeOptimizeCommand.prototype._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	var onExpr;
	onExpr = (function (expr, replaceCb) {
		var calleeExpr;
		var propertyExpr;
		var receiverType;
		var found;
		var classDef;
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
						replaceCb(new CallExpression(expr.getToken$(), new PropertyExpression$0(propertyExpr.getToken$(), new ClassExpression(new Token(classDef.className$(), true), new ObjectType(classDef)), propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), funcDef.getType$()), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
						return true;
					}
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	onExpr(expr, replaceCb);
};


_StaticizeOptimizeCommand.prototype._findRewrittenFunctionInClass$LType$SALType$B = function (type, funcName, beforeArgTypes, isStatic) {
	var classDef;
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
	return new Pair$ClassDefinition$MemberFunctionDefinition$E(classDef, funcDef);
};


function _UnclassifyOptimizationCommand() {
	_OptimizeCommand.call(this, _UnclassifyOptimizationCommand.IDENTIFIER);
};

$__jsx_extend([_UnclassifyOptimizationCommand], _OptimizeCommand);
_UnclassifyOptimizationCommand.prototype._createStash$ = function () {
	return new _UnclassifyOptimizationCommand$CStash();
};


_UnclassifyOptimizationCommand.prototype.performOptimization$ = function () {
	var $this = this;
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
		var onFunction;
		$this.log$S("rewriting member method calls in class: " + classDef.className$());
		function onFunction(funcDef) {
			var onStatement;
			function onStatement(statement) {
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$(expr, replaceCb, classDefs);
					return true;
				}));
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			}
			funcDef.forEachStatement$F$LStatement$B$(onStatement);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFunction);
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
				if (varDef.getInitialValue$() != null) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$(varDef.getInitialValue$(), (function (expr) {
						varDef.setInitialValue$LExpression$(expr);
					}), classDefs);
				}
			}
			return varDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}));
		return true;
	}));
};


_UnclassifyOptimizationCommand.prototype._getClassesToUnclassify$ = function () {
	var $this = this;
	var candidates;
	var candidateIndex;
	var hasInlineableCtor;
	candidates = [];
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) === ClassDefinition.IS_FINAL && classDef.extendType$().getClassDef$().className$() === "Object" && classDef.implementTypes$().length === 0 && classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			return (funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_EXPORT)) === 0;
		}))) {
			candidates.push(classDef);
		}
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		var onExpr;
		var onFunction;
		if (candidates.length === 0) {
			return false;
		}
		function onExpr(expr) {
			var foundClassDefIndex;
			if (! (expr != null)) {
				debugger;
				throw new Error("[src/optimizer.jsx:931:28] assertion failure\n                assert expr != null;\n                            ^^\n");
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
		}
		function onFunction(funcDef) {
			funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
				statement.forEachExpression$F$LExpression$B$(onExpr);
				return statement.forEachStatement$F$LStatement$B$(onStatement);
			}));
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(onFunction);
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
				if (varDef.getInitialValue$() != null) {
					onExpr(varDef.getInitialValue$());
				}
			}
			return varDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFunction);
		}));
		return true;
	}));
	for (candidateIndex = candidates.length - 1; candidateIndex >= 0; -- candidateIndex) {
		hasInlineableCtor = false;
		candidates[candidateIndex].forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
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


_UnclassifyOptimizationCommand.prototype._createInliner$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var propertyNames;
	var propertyExprs;
	var initializePropertyIndex;
	var expectedArgIndex;
	var statements;
	var statementIndex;
	var statementExpr;
	var lhsExpr;
	var onRHSExpr;
	var propertyIndex;
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
			if (propertyExprs[i] != null && _Util$0$exprHasSideEffects$LExpression$(propertyExprs[i])) {
				return null;
			}
		}
		propertyExprs[propertyIndex] = statementExpr.getSecondExpr$().clone$();
	}
	return (function (newExpr) {
		return propertyExprs.map((function (expr) {
			var onExpr;
			function onExpr(expr, replaceCb) {
				var args;
				var argIndex;
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
			}
			expr = expr.clone$();
			onExpr(expr, (function (newExpr) {
				expr = newExpr;
			}));
			return expr;
		}));
	});
};


_UnclassifyOptimizationCommand.prototype._rewriteFunctionAsStatic$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var thisArg;
	thisArg = new ArgumentDeclaration(new Token("$this", false), new ObjectType(funcDef.getClassDef$()));
	funcDef.getArguments$().unshift(thisArg);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression(thisArg.getName$(), thisArg));
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


_UnclassifyOptimizationCommand.prototype._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$ALClassDefinition$ = function (expr, replaceCb, unclassifyingClassDefs) {
	var $this = this;
	var onExpr;
	onExpr = (function (expr, replaceCb) {
		var calleeExpr;
		var propertyExpr;
		var receiverType;
		var receiverClassDef;
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
					replaceCb(new CallExpression(expr.getToken$(), new PropertyExpression$0(propertyExpr.getToken$(), new ClassExpression(new Token(receiverClassDef.className$(), true), receiverType), propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), new StaticFunctionType(null, funcType.getReturnType$(), [ receiverType ].concat(funcType.getArgumentTypes$()), false)), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
					return true;
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	onExpr(expr, replaceCb);
};


function _FoldConstantCommand() {
	_FunctionOptimizeCommand.call(this, _FoldConstantCommand.IDENTIFIER);
};

$__jsx_extend([_FoldConstantCommand], _FunctionOptimizeCommand);
_FoldConstantCommand.prototype._createStash$ = function () {
	return new _FoldConstantCommand$CStash();
};


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


_FoldConstantCommand.prototype._optimizeExpression$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	var holderType;
	var member;
	var foldedExpr;
	var calculateCb;
	var baseExpr;
	var firstExpr;
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
				replaceCb(new IntegerLiteralExpression(new Token(calculateCb(+baseExpr.getToken$().getValue$()) + "", false)));
			} else {
				if (baseExpr instanceof NumberLiteralExpression) {
					replaceCb(new NumberLiteralExpression(new Token(calculateCb(+baseExpr.getToken$().getValue$()) + "", false)));
				}
			}
		} else {
			if (expr instanceof AdditiveExpression) {
				firstExpr = expr.getFirstExpr$();
				secondExpr = expr.getSecondExpr$();
				if (this._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$(expr, replaceCb)) {
				} else {
					if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
						replaceCb(new StringLiteralExpression(new Token(Util$encodeStringLiteral$S(Util$decodeStringLiteral$S(firstExpr.getToken$().getValue$()) + Util$decodeStringLiteral$S(secondExpr.getToken$().getValue$())), false)));
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
									replaceCb(new StringLiteralExpression(new Token(Util$encodeStringLiteral$S(baseExpr.getToken$().getValue$()), false)));
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


_FoldConstantCommand.prototype._foldEqualityExpression$LEqualityExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var firstExpr;
	var secondExpr;
	var isEqual;
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
		replaceCb(new BooleanLiteralExpression(new Token(result ? "true" : "false", true)));
	}
};


_FoldConstantCommand.prototype._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	var exprIsZero;
	if (this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getFirstExpr$()) && this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getSecondExpr$())) {
		return this._foldNumericBinaryExpressionOfConstants$LBinaryExpression$F$LExpression$V$(expr, replaceCb);
	}
	function exprIsZero(expr) {
		return expr instanceof NumberLiteralExpression && +expr.getToken$().getValue$() === 0;
	}
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


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	if (expr.getFirstExpr$() instanceof IntegerLiteralExpression && expr.getSecondExpr$() instanceof IntegerLiteralExpression) {
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, calcCb);
	} else {
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, calcCb);
	}
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	var value;
	value = calcCb(+expr.getFirstExpr$().getToken$().getValue$(), +expr.getSecondExpr$().getToken$().getValue$());
	this.log$S("folding operator '" + expr.getToken$().getValue$() + "' at " + expr.getToken$().getFilename$() + ":" + (expr.getToken$().getLineNumber$() + "") + " to int: " + (value + ""));
	if (value % 1 !== 0) {
		throw new Error("value is not an integer");
	}
	replaceCb(new IntegerLiteralExpression(new Token(value + "", false)));
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	var value;
	value = calcCb(+expr.getFirstExpr$().getToken$().getValue$(), +expr.getSecondExpr$().getToken$().getValue$());
	this.log$S("folding operator '" + expr.getToken$().getValue$() + "' at " + expr.getToken$().getFilename$() + ":" + (expr.getToken$().getLineNumber$() + "") + " to number: " + (value + ""));
	replaceCb(new NumberLiteralExpression(new Token(value + "", false)));
};


_FoldConstantCommand.prototype._isIntegerOrNumberLiteralExpression$LExpression$ = function (expr) {
	return expr instanceof NumberLiteralExpression || expr instanceof IntegerLiteralExpression;
};


_FoldConstantCommand.prototype._foldStaticConst$LMemberVariableDefinition$ = function (member) {
	var $this = this;
	var stash;
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
						return new IntegerLiteralExpression(new Token((expr.getToken$().getValue$() | 0).toString(), false));
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


function _DeadCodeEliminationOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _DeadCodeEliminationOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_DeadCodeEliminationOptimizeCommand], _FunctionOptimizeCommand);
_DeadCodeEliminationOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (funcDef.getStatements$() == null) {
		return true;
	}
	while (this._optimizeFunction$LMemberFunctionDefinition$(funcDef) || this._removeExpressionStatementsWithoutSideEffects$LMemberFunctionDefinition$(funcDef)) {
	}
	return true;
};


_DeadCodeEliminationOptimizeCommand.prototype._removeExpressionStatementsWithoutSideEffects$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var shouldRetry;
	shouldRetry = false;
	(function onStatements(statements) {
		var i;
		for (i = 0; i < statements.length; ) {
			if (statements[i] instanceof ExpressionStatement && ! _Util$0$exprHasSideEffects$LExpression$(statements[i].getExpr$())) {
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


_DeadCodeEliminationOptimizeCommand.prototype._optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var shouldRetry;
	var locals;
	var localsUsed;
	var altered;
	var localIndex;
	shouldRetry = false;
	_Util$0$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, (function (exprs) {
		$this._eliminateDeadStoresToProperties$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
	}));
	(function onStatements(statements) {
		var i;
		var statement;
		for (i = statements.length - 1; i >= 0; -- i) {
			statement = statements[i];
			if (statement instanceof ExpressionStatement) {
				if (! _Util$0$exprHasSideEffects$LExpression$(statement.getExpr$())) {
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
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
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
			if (statement instanceof FunctionStatement) {
				statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
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


_DeadCodeEliminationOptimizeCommand.prototype._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var localsUntouchable;
	var locals;
	var _onExpr;
	var onExpr;
	localsUntouchable = new TypedMap$LocalVariable$boolean$E();
	locals = new TypedMap$LocalVariable$Expression$E();
	_onExpr = (function (expr) {
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
		var assignmentExpr;
		var lhsLocal;
		var rhsExpr;
		var rhsLocal;
		var cachedExpr;
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


_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var lastAssignExpr;
	var onExpr;
	lastAssignExpr = [];
	onExpr = (function (expr, rewriteCb) {
		var lhsLocal;
		var i;
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
				lastAssignExpr[i] = new Triple$LocalVariable$AssignmentExpression$function$$$$Expression$$$$void$E(lhsLocal, expr, rewriteCb);
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


_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadStoresToProperties$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var isFirstLevelPropertyAccess;
	var baseExprsAreEqual;
	var lastAssignExpr;
	var onExpr;
	function isFirstLevelPropertyAccess(expr) {
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
	}
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
	}
	lastAssignExpr = {};
	onExpr = (function (expr, rewriteCb) {
		var assignmentExpr;
		var firstExpr;
		var propertyName;
		var k;
		var baseExpr;
		if (expr instanceof AssignmentExpression) {
			assignmentExpr = expr;
			firstExpr = assignmentExpr.getFirstExpr$();
			if (expr.getToken$().getValue$() === "=" && isFirstLevelPropertyAccess(firstExpr) && ! _Util$0$classIsNative$LClassDefinition$(firstExpr.getExpr$().getType$().getClassDef$())) {
				propertyName = firstExpr.getIdentifierToken$().getValue$();
				onExpr(assignmentExpr.getSecondExpr$(), null);
				if (lastAssignExpr[propertyName] && lastAssignExpr[propertyName].second != null && baseExprsAreEqual(firstExpr.getExpr$(), lastAssignExpr[propertyName].first.getFirstExpr$().getExpr$())) {
					lastAssignExpr[propertyName].second(lastAssignExpr[propertyName].first.getSecondExpr$());
				}
				lastAssignExpr[propertyName] = new Pair$AssignmentExpression$function$$$$Expression$$$$void$E(assignmentExpr, rewriteCb);
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


_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var conditionIsConstant;
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
	}
	function spliceStatements(dest, index, src) {
		var i;
		dest.splice(index, 1);
		for (i = 0; i < src.length; ++ i) {
			dest.splice(index + i, 0, src[i]);
		}
	}
	(function onStatements(statements) {
		var i;
		var statement;
		var ifStatement;
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


function _InlineOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _InlineOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_InlineOptimizeCommand], _FunctionOptimizeCommand);
_InlineOptimizeCommand.prototype._createStash$ = function () {
	return new _InlineOptimizeCommand$CStash();
};


_InlineOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
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
			this.setupCommand$L_OptimizeCommand$(new _DetermineCalleeCommand()).optimizeFunction$LMemberFunctionDefinition$(funcDef);
		}
		if (! this.setupCommand$L_OptimizeCommand$(new _ReturnIfOptimizeCommand()).optimizeFunction$LMemberFunctionDefinition$(funcDef)) {
			break;
		}
	}
	this.log$S("* finished optimization of " + funcDef.getNotation$());
	return true;
};


_InlineOptimizeCommand.prototype._handleStatements$LMemberFunctionDefinition$ALStatement$ = function (funcDef, statements) {
	var altered;
	var i;
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


_InlineOptimizeCommand.prototype._handleStatement$LMemberFunctionDefinition$ALStatement$N = function (funcDef, statements, stmtIndex) {
	var $this = this;
	var altered;
	var statement;
	var callingFuncDef;
	altered = false;
	statement = statements[stmtIndex];
	statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
		var args;
		var callingFuncDef;
		var stmt;
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
			this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, callingFuncDef, statement.getArguments$().concat([ new ThisExpression(null, funcDef.getClassDef$()) ]));
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
					statements[stmtIndex - 1] = new ReturnStatement(statement.getToken$(), statements[stmtIndex - 1] instanceof ReturnStatement ? statements[stmtIndex - 1].getExpr$() : statements[stmtIndex - 1].getExpr$());
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


_InlineOptimizeCommand.prototype._handleSubStatements$LMemberFunctionDefinition$LStatement$ = function (funcDef, statement) {
	var $this = this;
	return _Util$0$handleSubStatements$F$ALStatement$B$LStatement$((function (statements) {
		return $this._handleStatements$LMemberFunctionDefinition$ALStatement$(funcDef, statements);
	}), statement);
};


_InlineOptimizeCommand.prototype._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$ = function (funcDef, statements, stmtIndex, expr, cb) {
	var args;
	var stmt;
	var rhsExpr;
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
				lastExpr = new AssignmentExpression(expr.getToken$(), expr.getFirstExpr$(), rhsExpr);
				statements[stmtIndex - 1] = new ExpressionStatement(lastExpr);
				cb(stmtIndex);
				return true;
			}
		}
	}
	return false;
};


_InlineOptimizeCommand.prototype._lhsHasNoSideEffects$LExpression$ = function (lhsExpr) {
	var holderExpr;
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


_InlineOptimizeCommand.prototype._getArgsAndThisIfCallExprIsInlineable$LCallExpression$B = function (callExpr, asExpression) {
	var $this = this;
	var callingFuncDef;
	var receiverExpr;
	var calleeExpr;
	var modifiesArgs;
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
			argsAndThis.push(new ThisExpression(null, callingFuncDef.getClassDef$()));
		}
	} else {
		argsAndThis.push(null);
	}
	return argsAndThis;
};


_InlineOptimizeCommand.prototype._argsAreInlineable$LMemberFunctionDefinition$ALExpression$B = function (callingFuncDef, actualArgs, asExpression) {
	var formalArgsTypes;
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


_InlineOptimizeCommand.prototype._isWorthInline$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var n;
	if (funcDef.isAnonymous$()) {
		return true;
	}
	n = 0;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
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


_InlineOptimizeCommand.prototype._functionIsInlineable$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var stash;
	stash = this.getStash$LStashable$(funcDef);
	if (stash.isInlineable == null) {
		stash.isInlineable = (function () {
			var statements;
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
					if (expr instanceof LocalExpression) {
						if (funcDef.getFuncLocal$() != null && funcDef.getFuncLocal$() == expr.getLocal$()) {
							return false;
						}
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


_InlineOptimizeCommand.prototype._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$ = function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThis) {
	var $this = this;
	var argsAndThisAndLocals;
	var calleeStatements;
	var i;
	var statement;
	var onExpr;
	this.log$S("expanding " + calleeFuncDef.getNotation$());
	argsAndThisAndLocals = argsAndThis.concat([]);
	stmtIndex = this._createVars$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals);
	calleeStatements = calleeFuncDef.getStatements$();
	for (i = 0; i < calleeStatements.length; ++ i) {
		statement = (calleeStatements[i] instanceof ReturnStatement ? new ExpressionStatement(calleeStatements[i].getExpr$().clone$()) : calleeStatements[i].clone$());
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


_InlineOptimizeCommand.prototype._createVars$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$ = function (callerFuncDef, statements, stmtIndex, calleeFuncDef, argsAndThisAndLocals) {
	var tempExpr;
	var formalArgs;
	var i;
	var locals;
	var tempVar;
	if ((calleeFuncDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		tempExpr = this._createVarForArgOrThis$LMemberFunctionDefinition$ALStatement$NLExpression$LType$S(callerFuncDef, statements, stmtIndex, argsAndThisAndLocals[argsAndThisAndLocals.length - 1], new ObjectType(calleeFuncDef.getClassDef$()), "this");
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
		argsAndThisAndLocals.push(new LocalExpression(tempVar.getName$(), tempVar));
	}
	return stmtIndex;
};


_InlineOptimizeCommand.prototype._getNumberOfTimesArgIsUsed$LMemberFunctionDefinition$LArgumentDeclaration$ = function (funcDef, local) {
	var $this = this;
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


_InlineOptimizeCommand.prototype._createVarForArgOrThis$LMemberFunctionDefinition$ALStatement$NLExpression$LType$S = function (callerFuncDef, statements, stmtIndex, expr, type, baseName) {
	var newLocal;
	if (expr instanceof ThisExpression || expr instanceof LeafExpression) {
		return null;
	}
	newLocal = this.createVar$LMemberFunctionDefinition$LType$S(callerFuncDef, type, baseName);
	statements.splice(stmtIndex, 0, new ExpressionStatement(new AssignmentExpression(new Token("=", false), new LocalExpression(newLocal.getName$(), newLocal), expr)));
	return new LocalExpression(newLocal.getName$(), newLocal);
};


_InlineOptimizeCommand.prototype._rewriteExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$ = function (expr, replaceCb, argsAndThisAndLocals, calleeFuncDef) {
	var $this = this;
	var formalArgs;
	var j;
	var locals;
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


_InlineOptimizeCommand.prototype._functionHasThis$LMemberFunctionDefinition$ = function (funcDef) {
	do {
		if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
			return true;
		}
	} while ((funcDef = funcDef.getParent$()) != null);
	return false;
};


function _ReturnIfOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _ReturnIfOptimizeCommand.IDENTIFIER);
	this._altered = false;
};

$__jsx_extend([_ReturnIfOptimizeCommand], _FunctionOptimizeCommand);
_ReturnIfOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (funcDef.getReturnType$().equals$LType$(Type.voidType)) {
		return false;
	}
	this._altered = false;
	this._optimizeStatements$ALStatement$(funcDef.getStatements$());
	this.log$S(funcDef.getNotation$() + " " + (this._altered ? "Y" : "N"));
	return this._altered;
};


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


_ReturnIfOptimizeCommand.prototype._optimizeStatements$ALStatement$ = function (statements) {
	var ifStatement;
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


_ReturnIfOptimizeCommand.prototype._createReturnStatement$LToken$LExpression$LExpression$LExpression$ = function (token, condExpr, trueExpr, falseExpr) {
	return new ReturnStatement(token, new ConditionalExpression$0(new Token("?", false), condExpr, trueExpr, falseExpr, falseExpr.getType$()));
};


function _LCSECachedExpression(origExpr, replaceCb) {
	this._origExpr = origExpr;
	this._replaceCb = replaceCb;
	this._localExpr = null;
};

$__jsx_extend([_LCSECachedExpression], Object);
_LCSECachedExpression.prototype.getOrigExpr$ = function () {
	return this._origExpr;
};


_LCSECachedExpression.prototype.getLocalExpr$F$LType$SLLocalExpression$$ = function (createVarCb) {
	if (this._localExpr == null) {
		this._localExpr = createVarCb(this._origExpr.getType$(), this._origExpr.getIdentifierToken$().getValue$());
		this._replaceCb(new AssignmentExpression(new Token("=", false), this._localExpr, this._origExpr));
	}
	return this._localExpr;
};


function _LCSEOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _LCSEOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_LCSEOptimizeCommand], _FunctionOptimizeCommand);
_LCSEOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	_Util$0$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, (function (exprs) {
		$this._optimizeExpressions$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
	}));
	return true;
};


_LCSEOptimizeCommand.prototype._optimizeExpressions$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var cachedExprs;
	var getCacheKey;
	var registerCacheable;
	var clearCacheByLocalName;
	var clearCacheByPropertyName;
	var clearCache;
	var onExpr;
	this.log$S("optimizing expressions starting");
	cachedExprs = {};
	getCacheKey = (function (expr) {
		var propertyExpr;
		var receiverType;
		var base;
		if (expr instanceof PropertyExpression) {
			propertyExpr = expr;
			receiverType = propertyExpr.getExpr$().getType$();
			if (receiverType instanceof ObjectType && _Util$0$classIsNative$LClassDefinition$(receiverType.getClassDef$())) {
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
		cachedExprs[key] = new _LCSECachedExpression(expr, replaceCb);
	});
	clearCacheByLocalName = (function (name) {
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
		var k;
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
		var assignmentExpr;
		var lhsExpr;
		var lhsPropertyExpr;
		var cacheKey;
		var incrementExpr;
		var propertyExpr;
		var conditionalExpr;
		var funcExpr;
		var args;
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
							var localVar;
							localVar = $this.createVar$LMemberFunctionDefinition$LType$S(funcDef, type, baseName);
							return new LocalExpression(localVar.getName$(), localVar);
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


function _UnboxOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _UnboxOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_UnboxOptimizeCommand], _FunctionOptimizeCommand);
_UnboxOptimizeCommand.prototype._createStash$ = function () {
	return new _UnboxOptimizeCommand$CStash();
};


_UnboxOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var locals;
	var i;
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


_UnboxOptimizeCommand.prototype._optimizeLocal$LMemberFunctionDefinition$LLocalVariable$ = function (funcDef, local) {
	var $this = this;
	var classDef;
	var foundNew;
	var onStatement;
	var canUnbox;
	if (! (local.getType$() instanceof ObjectType)) {
		return false;
	}
	classDef = local.getType$().getClassDef$();
	if (_Util$0$classIsNative$LClassDefinition$(classDef)) {
		return false;
	}
	foundNew = false;
	onStatement = (function (statement) {
		var onExpr;
		var newExpr;
		onExpr = (function (expr) {
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
				return ! _Util$0$exprHasSideEffects$LExpression$(expr);
			}), newExpr.getArguments$())) {
				return false;
			}
			foundNew = true;
			return true;
		}
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
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


_UnboxOptimizeCommand.prototype._newExpressionCanUnbox$LExpression$ = function (newExpr) {
	var $this = this;
	var ctor;
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
			var assigned;
			var expr;
			var lhsExpr;
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


_UnboxOptimizeCommand.prototype._unboxVariable$LMemberFunctionDefinition$LLocalVariable$ = function (funcDef, local) {
	var $this = this;
	var variableMap;
	var createLocalExpressionFor;
	var buildConstructingStatements;
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
		return new LocalExpression(variableMap[propertyName].getName$(), variableMap[propertyName]);
	});
	buildConstructingStatements = (function (dstStatements, dstStatementIndex, newExpr) {
		var ctor;
		ctor = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(newExpr);
		ctor.forEachStatement$F$LStatement$B$((function (statement) {
			var propertyName;
			var rhsExpr;
			var onExpr;
			propertyName = statement.getExpr$().getFirstExpr$().getIdentifierToken$().getValue$();
			rhsExpr = statement.getExpr$().getSecondExpr$().clone$();
			onExpr = (function (expr, replaceCb) {
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
			dstStatements.splice(dstStatementIndex++, 0, new ExpressionStatement(new AssignmentExpression(new Token("=", false), createLocalExpressionFor(propertyName), rhsExpr)));
			return true;
		}));
		return dstStatementIndex;
	});
	onStatements = (function (statements) {
		var statementIndex;
		var onExpr;
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
			if (statements[statementIndex] instanceof FunctionStatement) {
				onStatements(statements[statementIndex].getFuncDef$().getStatements$());
				++ statementIndex;
			} else {
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
		}
		return true;
	});
	onStatements(funcDef.getStatements$());
};


_UnboxOptimizeCommand.prototype._statementIsConstructingTheLocal$LStatement$LLocalVariable$ = function (statement, local) {
	var expr;
	var lhsExpr;
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


function _ArrayLengthOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _ArrayLengthOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_ArrayLengthOptimizeCommand], _FunctionOptimizeCommand);
_ArrayLengthOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		var condExpr;
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


_ArrayLengthOptimizeCommand.prototype._optimizeArrayLength$LMemberFunctionDefinition$LForStatement$LLocalVariable$ = function (funcDef, statement, arrayLocal) {
	var $this = this;
	var lengthLocal;
	var assignToLocal;
	var onExpr;
	if (this._lengthIsUnmodifiedInExpr$LExpression$(statement.getCondExpr$()) && this._lengthIsUnmodifiedInExpr$LExpression$(statement.getPostExpr$()) && statement.forEachStatement$F$LStatement$B$((function (statement) {
		return $this._lengthIsUnmodifiedInStatement$LStatement$(statement);
	}))) {
		this.log$S(funcDef.getNotation$() + " optimizing .length at line " + (statement.getToken$().getLineNumber$() + ""));
		lengthLocal = this.createVar$LMemberFunctionDefinition$LType$S(funcDef, Type.integerType, arrayLocal.getName$().getValue$() + "$len");
		assignToLocal = new AssignmentExpression(new Token("=", false), new LocalExpression(new Token(lengthLocal.getName$().getValue$(), true), lengthLocal), new PropertyExpression$0(new Token(".", false), new LocalExpression(new Token(arrayLocal.getName$().getValue$(), true), arrayLocal), new Token("length", true), [], lengthLocal.getType$()));
		if (statement.getInitExpr$() != null) {
			statement.setInitExpr$LExpression$(new CommaExpression(new Token(",", false), statement.getInitExpr$(), assignToLocal));
		} else {
			statement.setInitExpr$LExpression$(assignToLocal);
		}
		onExpr = (function (expr, replaceCb) {
			if (expr instanceof PropertyExpression && expr.getIdentifierToken$().getValue$() === "length" && expr.getExpr$() instanceof LocalExpression && expr.getExpr$().getLocal$() == arrayLocal) {
				replaceCb(new LocalExpression(new Token(lengthLocal.getName$().getValue$(), true), lengthLocal));
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


_ArrayLengthOptimizeCommand.prototype._hasLengthExprOfLocalArray$LExpression$ = function (expr) {
	var $this = this;
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


_ArrayLengthOptimizeCommand.prototype._lhsMayModifyLength$LExpression$ = function (expr) {
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


_ArrayLengthOptimizeCommand.prototype._typeIsArray$LType$ = function (type) {
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


function _NoDebugCommand() {
	_OptimizeCommand.call(this, _NoDebugCommand.IDENTIFIER);
};

$__jsx_extend([_NoDebugCommand], _OptimizeCommand);
_NoDebugCommand.prototype._createStash$ = function () {
	return new _NoDebugCommand$CStash();
};


_NoDebugCommand.prototype.performOptimization$ = function () {
	var $this = this;
	var stash;
	stash = this.getStash$LStashable$(this.getCompiler$().getEmitter$());
	stash.debugValue = false;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (classDef.className$() === "JSX") {
			classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (memberVariable) {
				var falseExpr;
				if (memberVariable.name$() === "DEBUG" && (memberVariable.flags$() & ClassDefinition.IS_STATIC) !== 0) {
					$this.log$S("set JSX.DEBUG = " + (stash.debugValue + ""));
					falseExpr = new BooleanLiteralExpression(new Token(stash.debugValue + "", true));
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


function Compiler(platform) {
	this._builtinParsers = null;
	this._emitter = null;
	this._platform = platform;
	this._mode = Compiler.MODE_COMPILE;
	this._optimizer = null;
	this._warningFilters = [  ];
	this._warningAsError = false;
	this._parsers = [];
	this._fileCache = {};
	this._searchPaths = [ this._platform.getRoot$() + "/lib/common" ];
	this.addSourceFile$LToken$S(null, this._platform.getRoot$() + "/lib/built-in.jsx");
	this._builtinParsers = this._parsers.concat([]);
};

$__jsx_extend([Compiler], Object);
Compiler.prototype.addSearchPath$S = function (path) {
	this._searchPaths.unshift(path);
};


Compiler.prototype.getPlatform$ = function () {
	return this._platform;
};


Compiler.prototype.getMode$ = function () {
	return this._mode;
};


Compiler.prototype.setMode$N = function (mode) {
	this._mode = mode;
	return this;
};


Compiler.prototype.getEmitter$ = function () {
	return this._emitter;
};


Compiler.prototype.setEmitter$LEmitter$ = function (emitter) {
	this._emitter = emitter;
};


Compiler.prototype.setOptimizer$LOptimizer$ = function (optimizer) {
	this._optimizer = optimizer;
};


Compiler.prototype.getWarningFilters$ = function () {
	return this._warningFilters;
};


Compiler.prototype.setWarningAsError$B = function (f) {
	this._warningAsError = f;
};


Compiler.prototype.getParsers$ = function () {
	return this._parsers;
};


Compiler.prototype.addSourceFile$LToken$S = function (token, path) {
	return this.addSourceFile$LToken$SLCompletionRequest$(token, path, null);
};


Compiler.prototype.addSourceFile$LToken$SLCompletionRequest$ = function (token, path, completionRequest) {
	var parser;
	if ((parser = this.findParser$S(path)) == null) {
		parser = new Parser(token, path, completionRequest);
		this._parsers.push(parser);
	}
	return parser;
};


Compiler.prototype.findParser$S = function (path) {
	var i;
	for (i = 0; i < this._parsers.length; ++ i) {
		if (this._parsers[i].getPath$() === path) {
			return this._parsers[i];
		}
	}
	return null;
};


Compiler.prototype.compile$ = function () {
	var $this = this;
	var errors;
	var i;
	var builtins;
	var transformer;
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
	CodeTransformer.stopIterationType = new ObjectType(builtins.lookup$ALCompileError$LToken$S(errors, null, "g_StopIteration"));
	for (i = 0; i < builtins._templateClassDefs.length; ++ i) {
		if (builtins._templateClassDefs[i].className$() === "__jsx_generator") {
			CodeTransformer.jsxGeneratorClassDef = builtins._templateClassDefs[i];
		}
	}
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	this._resolveTypes$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	this._exportEntryPoints$();
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
	transformer = new CodeTransformer();
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		return classDef.forEachMember$F$LMemberDefinition$B$((function onMember(member) {
			var funcDef;
			if (member instanceof MemberFunctionDefinition) {
				funcDef = member;
				if (funcDef.isGenerator$()) {
					transformer.transformFunctionDefinition$LMemberFunctionDefinition$(funcDef);
				}
			}
			return member.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
				return onMember(funcDef);
			}));
		}));
	}));
	this._optimize$();
	this._generateCode$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	return true;
};


Compiler.prototype.getAST$ = function () {
	var classDefs;
	var i;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++ i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
	}
	return ClassDefinition$serialize$ALClassDefinition$(classDefs);
};


Compiler.prototype.getFileContent$ALCompileError$LToken$S = function (errors, sourceToken, path) {
	if (this._fileCache[path] == null) {
		try {
			this._fileCache[path] = this._platform.load$S(path);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				errors.push(new CompileError(sourceToken, "could not open file: " + path + ", " + $__jsx_catch_0.toString()));
				this._fileCache[path] = null;
			} else {
				throw $__jsx_catch_0;
			}
		}
	}
	return this._fileCache[path];
};


Compiler.prototype.parseFile$ALCompileError$LParser$ = function (errors, parser) {
	var content;
	var imports;
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


Compiler.prototype._handleImport$ALCompileError$LParser$LImport$ = function (errors, parser, imprt) {
	var wildImprt;
	var resolvedDir;
	var files;
	var found;
	var i;
	var path;
	var newParser;
	if (imprt instanceof WildcardImport) {
		wildImprt = imprt;
		resolvedDir = this._resolvePath$SS(wildImprt.getFilenameToken$().getFilename$(), wildImprt.getDirectory$());
		files = [];
		try {
			files = this._platform.getFilesInDirectory$S(resolvedDir);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				errors.push(new CompileError(wildImprt.getFilenameToken$(), "could not read files in directory: " + resolvedDir + ", " + $__jsx_catch_0.toString()));
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
			errors.push(new CompileError(wildImprt.getFilenameToken$(), "no matching files found in directory: " + resolvedDir));
			return false;
		}
	} else {
		path = this._resolvePath$SS(imprt.getFilenameToken$().getFilename$(), Util$decodeStringLiteral$S(imprt.getFilenameToken$().getValue$()));
		if (path === parser.getPath$()) {
			errors.push(new CompileError(imprt.getFilenameToken$(), "cannot import itself"));
			return false;
		}
		newParser = this.addSourceFile$LToken$SLCompletionRequest$(imprt.getFilenameToken$(), path, null);
		imprt.addSource$LParser$(newParser);
	}
	return true;
};


Compiler.prototype.forEachClassDef$F$LParser$LClassDefinition$B$ = function (f) {
	var $this = this;
	var onClassDef;
	var i;
	var parser;
	var classDefs;
	var j;
	function onClassDef(parser, classDef) {
		var inners;
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
	}
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


Compiler.prototype._resolveImports$ALCompileError$ = function (errors) {
	var i;
	var imports;
	var j;
	for (i = 0; i < this._parsers.length; ++ i) {
		this._parsers[i].registerBuiltinImports$ALParser$(this._builtinParsers);
		imports = this._parsers[i].getImports$();
		for (j = 0; j < imports.length; ++ j) {
			imports[j].assertExistenceOfNamedClasses$ALCompileError$(errors);
		}
	}
};


Compiler.prototype._resolveTypes$ALCompileError$ = function (errors) {
	var $this = this;
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.resolveTypes$LAnalysisContext$(new AnalysisContext(errors, parser, null));
		return true;
	}));
};


Compiler.prototype._analyze$ALCompileError$ = function (errors) {
	var $this = this;
	var createContext;
	createContext = (function (parser) {
		return new AnalysisContext(errors, parser, (function (parser, classDef) {
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


Compiler.prototype._optimize$ = function () {
	if (this._optimizer != null) {
		this._optimizer.setCompiler$LCompiler$(this).performOptimization$();
	}
};


Compiler.prototype._generateCode$ALCompileError$ = function (errors) {
	var $this = this;
	var classDefs;
	var i;
	var nativeClassNames;
	var foundConflict;
	var getMaxIndexOfClasses;
	var deps;
	var maxIndexOfClasses;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++ i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
	}
	for (i = 0; i < classDefs.length; ++ i) {
		if (classDefs[i].getInnerClasses$().length !== 0) {
			classDefs = classDefs.concat(classDefs[i].getInnerClasses$());
		}
	}
	nativeClassNames = {};
	foundConflict = false;
	classDefs.forEach((function (classDef) {
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			return;
		}
		if ($__jsx_ObjectHasOwnProperty.call(nativeClassNames, classDef.className$())) {
			errors.push(new CompileError(classDef.getToken$(), "native class with same name is already defined").addCompileNote$LCompileNote$(new CompileNote(nativeClassNames[classDef.className$()].getToken$(), "here")));
			foundConflict = true;
			return;
		}
		nativeClassNames[classDef.className$()] = classDef;
	}));
	if (foundConflict) {
		return;
	}
	getMaxIndexOfClasses = (function (deps) {
		var i;
		var j;
		deps = deps.concat([  ]);
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
		})).concat([  ]);
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
	this._emitter.emit$ALClassDefinition$(classDefs);
};


Compiler.prototype._exportEntryPoints$ = function () {
	var $this = this;
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		switch (classDef.classFullName$()) {
		case "_Main":
			classDef.setFlags$N(classDef.flags$() | ClassDefinition.IS_EXPORT);
			classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				if ((funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0 && funcDef.name$() === "main" && funcDef.getArguments$().length === 1 && Util$isArrayOf$LClassDefinition$LType$(funcDef.getArgumentTypes$()[0].getClassDef$(), Type.stringType)) {
					funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_EXPORT);
				}
				return true;
			}));
			break;
		case "_Test":
			classDef.setFlags$N(classDef.flags$() | ClassDefinition.IS_EXPORT);
			classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0 && funcDef.name$().match(/^test/) && funcDef.getArguments$().length === 0) {
					funcDef.setFlags$N(funcDef.flags$() | ClassDefinition.IS_EXPORT);
				}
				return true;
			}));
			break;
		}
		return true;
	}));
};


Compiler.prototype._handleErrors$ALCompileError$ = function (errors) {
	var $this = this;
	var isFatal;
	if (this._mode === Compiler.MODE_COMPLETE) {
		errors.splice(0, errors.length);
		return true;
	}
	isFatal = false;
	errors.forEach((function (error) {
		var warning;
		var doWarn;
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
				isFatal = $this._warningAsError;
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


Compiler.prototype._resolvePath$SS = function (srcPath, givenPath) {
	var searchPaths;
	var i;
	var path;
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


function CompletionRequest(lineNumber, columnOffset) {
	this._lineNumber = lineNumber;
	this._columnOffest = columnOffset;
	this._candidates = [];
};

$__jsx_extend([CompletionRequest], Object);
CompletionRequest.prototype.getLineNumber$ = function () {
	return this._lineNumber;
};


CompletionRequest.prototype.getColumnOffset$ = function () {
	return this._columnOffest;
};


CompletionRequest.prototype.isInRange$NNN = function (lineNumber, columnOffset, length) {
	if (lineNumber !== this._lineNumber) {
		return - 1;
	}
	if (columnOffset <= this._columnOffest && this._columnOffest <= columnOffset + length) {
		return this._columnOffest - columnOffset;
	}
	return - 1;
};


CompletionRequest.prototype.pushCandidates$LCompletionCandidates$ = function (candidates) {
	this._candidates.push(candidates);
};


CompletionRequest.prototype.getCandidates$ = function () {
	var $this = this;
	var seen;
	var results;
	seen = {};
	results = [];
	this._candidates.forEach((function (candidates) {
		var rawCandidates;
		var prefix;
		rawCandidates = [];
		candidates.getCandidates$AHX(rawCandidates);
		prefix = candidates.getPrefix$();
		rawCandidates.forEach((function (s) {
			var word;
			var left;
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


function CompletionCandidates() {
	this._prefix = null;
};

$__jsx_extend([CompletionCandidates], Object);
CompletionCandidates.prototype.getPrefix$ = function () {
	return this._prefix;
};


CompletionCandidates.prototype.setPrefix$S = function (prefix) {
	this._prefix = prefix;
	return this;
};


function CompletionCandidates$makeClassCandidate$LClassDefinition$(classDef) {
	var data;
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

CompletionCandidates.makeClassCandidate$LClassDefinition$ = CompletionCandidates$makeClassCandidate$LClassDefinition$;

function CompletionCandidates$_addClasses$AHXLParser$F$LClassDefinition$B$(candidates, parser, autoCompleteMatchCb) {
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

CompletionCandidates._addClasses$AHXLParser$F$LClassDefinition$B$ = CompletionCandidates$_addClasses$AHXLParser$F$LClassDefinition$B$;

function CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$(candidates, imprt, autoCompleteMatchCb) {
	var classNames;
	classNames = imprt.getClassNames$();
	if (classNames != null) {
		classNames.forEach((function (className) {
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

CompletionCandidates._addImportedClasses$AHXLImport$F$LClassDefinition$B$ = CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$;

function KeywordCompletionCandidate(expected) {
	CompletionCandidates.call(this);
	this._expected = expected;
};

$__jsx_extend([KeywordCompletionCandidate], CompletionCandidates);
KeywordCompletionCandidate.prototype.getCandidates$AHX = function (candidates) {
	var data;
	data = {};
	data.word = this._expected;
	data.kind = "keyword";
	candidates.push(data);
};


function CompletionCandidatesOfTopLevel(parser, autoCompleteMatchCb) {
	CompletionCandidates.call(this);
	this._parser = parser;
	this._autoCompleteMatchCb = autoCompleteMatchCb;
};

$__jsx_extend([CompletionCandidatesOfTopLevel], CompletionCandidates);
CompletionCandidatesOfTopLevel.prototype.getCandidates$AHX = function (candidates) {
	var i;
	var imprt;
	var alias;
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


function _CompletionCandidatesWithLocal(parser) {
	var $this = this;
	CompletionCandidatesOfTopLevel.call(this, parser, null);
	this._locals = [];
	parser._forEachScope$F$LLocalVariable$ALLocalVariable$ALArgumentDeclaration$B$((function (funcName, locals, args) {
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

$__jsx_extend([_CompletionCandidatesWithLocal], CompletionCandidatesOfTopLevel);
_CompletionCandidatesWithLocal.prototype.getCandidates$AHX = function (candidates) {
	var $this = this;
	this._locals.forEach((function (local) {
		var data;
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


function _CompletionCandidatesOfNamespace(imprt, autoCompleteMatchCb) {
	CompletionCandidates.call(this);
	this._import = imprt;
	this._autoCompleteMatchCb = autoCompleteMatchCb;
};

$__jsx_extend([_CompletionCandidatesOfNamespace], CompletionCandidates);
_CompletionCandidatesOfNamespace.prototype.getCandidates$AHX = function (candidates) {
	CompletionCandidates$_addImportedClasses$AHXLImport$F$LClassDefinition$B$(candidates, this._import, this._autoCompleteMatchCb);
};


function _CompletionCandidatesOfProperty(expr) {
	CompletionCandidates.call(this);
	this._expr = expr;
};

$__jsx_extend([_CompletionCandidatesOfProperty], CompletionCandidates);
_CompletionCandidatesOfProperty.prototype.getCandidates$AHX = function (candidates) {
	var $this = this;
	var type;
	var classDef;
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


function _CompletionCandidatesOfProperty$_makeMemberCandidate$LMemberDefinition$(member) {
	var kind;
	var data;
	var docComment;
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
			var pair;
			pair = {};
			pair.name = arg.getName$().getValue$();
			pair.type = arg.getType$().toString();
			return pair;
		}));
	}
	return data;
};

_CompletionCandidatesOfProperty._makeMemberCandidate$LMemberDefinition$ = _CompletionCandidatesOfProperty$_makeMemberCandidate$LMemberDefinition$;

function DocCommentNode() {
	this._description = "";
};

$__jsx_extend([DocCommentNode], Object);
DocCommentNode.prototype.getDescription$ = function () {
	return this._description;
};


DocCommentNode.prototype.appendDescription$S = function (s) {
	s = s.trim();
	if (s !== "") {
		if (this._description !== "") {
			this._description += " ";
		}
		this._description += s;
	}
};


function DocCommentParameter(token) {
	DocCommentNode.call(this);
	this._token = token;
};

$__jsx_extend([DocCommentParameter], DocCommentNode);
DocCommentParameter.prototype.getToken$ = function () {
	return this._token;
};


DocCommentParameter.prototype.getParamName$ = function () {
	return this._token.getValue$();
};


function DocCommentTag(tagName) {
	DocCommentNode.call(this);
	this._tagName = tagName;
};

$__jsx_extend([DocCommentTag], DocCommentNode);
DocCommentTag.prototype.getTagName$ = function () {
	return this._tagName;
};


function DocComment() {
	DocCommentNode.call(this);
	this._params = [];
	this._tags = [];
};

$__jsx_extend([DocComment], DocCommentNode);
DocComment.prototype.getParams$ = function () {
	return this._params;
};


DocComment.prototype.getTags$ = function () {
	return this._tags;
};


DocComment.prototype.getTagByName$S = function (tagName) {
	var i;
	for (i = 0; i < this._tags.length; ++ i) {
		if (this._tags[i].getTagName$() === tagName) {
			return this._tags[i];
		}
	}
	return null;
};


DocComment.prototype.getTagsByName$S = function (tagName) {
	var tags;
	var i;
	tags = [];
	for (i = 0; i < this._tags.length; ++ i) {
		if (this._tags[i].getTagName$() === tagName) {
			tags.push(this._tags[i]);
		}
	}
	return tags;
};


function DocumentGenerator(compiler, templatePath, outputPath) {
	this._classDefToHTMLCache = new TypedMap$ClassDefinition$string$E();
	this._compiler = compiler;
	this._templatePath = templatePath;
	this._outputPath = outputPath;
	this._resourceFiles = [];
	this._pathFilter = null;
};

$__jsx_extend([DocumentGenerator], Object);
DocumentGenerator.prototype.setResourceFiles$AS = function (files) {
	this._resourceFiles = files;
	return this;
};


DocumentGenerator.prototype.setPathFilter$F$SB$ = function (pathFilter) {
	this._pathFilter = pathFilter;
	return this;
};


DocumentGenerator.prototype.buildDoc$ = function () {
	var $this = this;
	var platform;
	platform = this._compiler.getPlatform$();
	this._resourceFiles.forEach((function (file) {
		platform.save$USS($this._outputPath + "/" + file, platform.load$S($this._templatePath + "/" + file));
	}));
	this._compiler.getParsers$().forEach((function (parser) {
		var encodedFilename;
		var outputFile;
		var html;
		encodedFilename = platform.encodeFilename$S(parser.getPath$());
		if ($this._pathFilter(encodedFilename)) {
			outputFile = $this._outputPath + "/" + parser.getPath$() + ".html";
			html = $this._buildDocOfFile$LParser$(parser);
			platform.save$USS(outputFile, html);
		}
	}));
};


DocumentGenerator.prototype._buildDocOfFile$LParser$ = function (parser) {
	var $this = this;
	var htmlFile;
	htmlFile = this._templatePath + "/template.html";
	return this._compiler.getPlatform$().load$S(htmlFile).replace(/<%JSX:(.*?)%>/g, (function (matched) {
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


DocumentGenerator.prototype._buildBodyOfFile$LParser$ = function (parser) {
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


DocumentGenerator.prototype._buildFooterOfFile$LParser$ = function (parser) {
	var _;
	var docComment;
	var version;
	var author;
	var d;
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
	_ += "<p class=\"jsxdoc-notice\">This document was automatically generated by <a href=\"http://jsx.github.io/\">JSX</a> ";
	_ += Meta.VERSION_STRING.replace(/\n$/, "");
	_ += "<br />\n";
	_ += "at ";
	_ += this._escape$S(new Date().toISOString()).replace(/\n$/, "");
	_ += ".</p>\n";
	return _;
};


DocumentGenerator.prototype._buildListOfClasses$LParser$ = function (parser) {
	var $this = this;
	var _;
	_ = "";
	_ += "<div class=\"classes\">\n";
	parser.getTemplateClassDefs$().forEach((function (classDef) {
		if (! $this._isPrivate$LClassDefinition$(classDef)) {
			_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
			_ += "\n";
		}
	}));
	parser.getClassDefs$().forEach((function (classDef) {
		if (! (classDef instanceof InstantiatedClassDefinition) && ! $this._isPrivate$LClassDefinition$(classDef)) {
			_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
			_ += "\n";
		}
	}));
	_ += "</div>\n";
	return _;
};


DocumentGenerator.prototype._buildDocOfClass$LParser$LClassDefinition$ = function (parser, classDef) {
	var $this = this;
	var typeName;
	var typeArgs;
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


DocumentGenerator.prototype._buildDocOfFunction$LParser$LMemberFunctionDefinition$ = function (parser, funcDef) {
	var $this = this;
	var _;
	var funcName;
	var args;
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


DocumentGenerator.prototype._descriptionToHTML$LDocComment$ = function (docComment) {
	var $this = this;
	var _;
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


DocumentGenerator.prototype._autoLink$S = function (str) {
	var $this = this;
	var uri;
	uri = /^https?:\/\/[A-Za-z0-9\-\._~:\/?#\[\]@!$&'()*+,;=]+/;
	return str.replace(uri, (function (matched) {
		return Util$format$SAS('<a href="%1">%1</a>', [ matched ]);
	}));
};


DocumentGenerator.prototype._argumentDescriptionToHTML$SLDocComment$ = function (name, docComment) {
	return (docComment != null ? this._getDescriptionOfNamedArgument$LDocComment$S(docComment, name) : "");
};


DocumentGenerator.prototype._formalTypeArgsToHTML$ALToken$ = function (typeArgs) {
	var $this = this;
	if (typeArgs.length === 0) {
		return "";
	}
	return ".&lt;" + typeArgs.map((function (typeArg) {
		return $this._escape$S(typeArg.getValue$());
	})).join(", ") + "&gt;";
};


DocumentGenerator.prototype._typeToHTML$LParser$LType$ = function (parser, type) {
	var $this = this;
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


DocumentGenerator.prototype._classDefToHTML$LParser$LClassDefinition$ = function (parser, classDef) {
	var $this = this;
	var result;
	var determineParserOfClassDef;
	var parserOfClassDef;
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
		var parsers;
		var i;
		var templateClassDefs;
		var j;
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
	}
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


DocumentGenerator.prototype._flagsToHTML$N = function (flags) {
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


DocumentGenerator.prototype._escape$S = function (str) {
	var $this = this;
	return str.replace(/[<>&'"]/g, (function (ch) {
		return ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", "\"": "&quot;" })[ch];
	}));
};


DocumentGenerator.prototype._hasPublicProperties$LClassDefinition$ = function (classDef) {
	var $this = this;
	return ! classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
		if (! $this._isPrivate$LMemberDefinition$(varDef)) {
			return false;
		}
		return true;
	}));
};


DocumentGenerator.prototype._hasPublicFunctions$LClassDefinition$ = function (classDef) {
	var $this = this;
	return ! classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		if (funcDef instanceof InstantiatedMemberFunctionDefinition || $this._isConstructor$LMemberFunctionDefinition$(funcDef) || $this._isPrivate$LMemberDefinition$(funcDef)) {
			return true;
		}
		return false;
	}));
};


DocumentGenerator.prototype._argsHasDocComment$LMemberFunctionDefinition$ = function (funcDef) {
	var docComment;
	var args;
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


DocumentGenerator.prototype._getDescriptionOfNamedArgument$LDocComment$S = function (docComment, argName) {
	var params;
	var paramIndex;
	params = docComment.getParams$();
	for (paramIndex = 0; paramIndex < params.length; ++ paramIndex) {
		if (params[paramIndex].getParamName$() === argName) {
			return params[paramIndex].getDescription$();
		}
	}
	return "";
};


DocumentGenerator.prototype._isConstructor$LMemberFunctionDefinition$ = function (funcDef) {
	return funcDef.name$() === "constructor" && (funcDef.flags$() & ClassDefinition.IS_STATIC) === 0;
};


DocumentGenerator.prototype._isPrivate$LClassDefinition$ = function (classDef) {
	return classDef.className$().charAt(0) === "_";
};


DocumentGenerator.prototype._isPrivate$LMemberDefinition$ = function (memberDef) {
	return memberDef.name$().charAt(0) === "_";
};


function _StatementTransformer(transformer, identifier) {
	this._id = 0;
	this._transformer = transformer;
	if (_StatementTransformer._statementCountMap[identifier] == null) {
		_StatementTransformer._statementCountMap[identifier] = 0;
	}
	this._id = _StatementTransformer._statementCountMap[identifier]++;
};

$__jsx_extend([_StatementTransformer], Object);
_StatementTransformer.prototype.getID$ = function () {
	return this._id;
};


function _ConstructorInvocationStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CONSTRUCTOR-INVOCATION");
	this._statement = statement;
};

$__jsx_extend([_ConstructorInvocationStatementTransformer], _StatementTransformer);
_ConstructorInvocationStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ConstructorInvocationStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _ExpressionStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "EXPRESSION");
	this._statement = statement;
};

$__jsx_extend([_ExpressionStatementTransformer], _StatementTransformer);
_ExpressionStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ExpressionStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _FunctionStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "FUNCTION");
	this._statement = statement;
};

$__jsx_extend([_FunctionStatementTransformer], _StatementTransformer);
_FunctionStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_FunctionStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _ReturnStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "RETURN");
	this._statement = statement;
};

$__jsx_extend([_ReturnStatementTransformer], _StatementTransformer);
_ReturnStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ReturnStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _YieldStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "YIELD");
	this._index = 0;
	this._statement = statement;
};

$__jsx_extend([_YieldStatementTransformer], _StatementTransformer);
_YieldStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_YieldStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var label;
	statements = [];
	statements.push(this._statement);
	label = "$YIELD_" + (this.getID$() + "");
	statements.push(new GotoStatement(label));
	statements.push(new LabelStatement(label));
	return statements;
};


function _DeleteStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "DELETE");
	this._statement = statement;
};

$__jsx_extend([_DeleteStatementTransformer], _StatementTransformer);
_DeleteStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DeleteStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _BreakStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "BREAK");
	this._statement = statement;
};

$__jsx_extend([_BreakStatementTransformer], _StatementTransformer);
_BreakStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_BreakStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var trans;
	if (this._statement.getLabel$() != null) {
		trans = this._transformer.findLabellableStatementTransformerByLabel$S(this._statement.getLabel$().getValue$());
	} else {
		trans = this._transformer.getInnermostLabellableStatementTransformer$();
	}
	return [ new GotoStatement(trans.getBreakingLabel$()) ];
};


function _ContinueStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CONTINUE");
	this._statement = statement;
};

$__jsx_extend([_ContinueStatementTransformer], _StatementTransformer);
_ContinueStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ContinueStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var trans;
	if (this._statement.getLabel$() != null) {
		trans = this._transformer.findLabellableStatementTransformerByLabel$S(this._statement.getLabel$().getValue$());
	} else {
		trans = this._transformer.getInnermostLabellableStatementTransformer$();
	}
	return [ new GotoStatement(trans.getContinuingLabel$()) ];
};


function _LabellableStatementTransformer(transformer, identifier) {
	_StatementTransformer.call(this, transformer, identifier);
};

$__jsx_extend([_LabellableStatementTransformer], _StatementTransformer);
function _DoWhileStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "DO-WHILE");
	this._index = 0;
	this._statement = statement;
};

$__jsx_extend([_DoWhileStatementTransformer], _LabellableStatementTransformer);
_DoWhileStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DoWhileStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var bodyLabel;
	var testLabel;
	var endLabel;
	statements = [];
	bodyLabel = "$BODY_DO_WHILE_" + (this.getID$() + "");
	statements.push(new GotoStatement(bodyLabel));
	statements.push(new LabelStatement(bodyLabel));
	this._transformer.enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._transformer.convertAndPushStatements$ALStatement$ALStatement$(this._statement.getStatements$(), statements);
	this._transformer.leaveLabelledBlock$();
	testLabel = "$TEST_DO_WHILE_" + (this.getID$() + "");
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(testLabel));
	endLabel = "$END_DO_WHILE_" + (this.getID$() + "");
	this._transformer.pushConditionalBranch$LExpression$SSALStatement$(this._statement.getExpr$(), bodyLabel, endLabel, statements);
	statements.push(new LabelStatement(endLabel));
	return statements;
};


_DoWhileStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$END_DO_WHILE_" + (this.getID$() + "");
};


_DoWhileStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$BODY_DO_WHILE_" + (this.getID$() + "");
};


function _ForInStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "FOR-IN");
	this._statement = statement;
};

$__jsx_extend([_ForInStatementTransformer], _LabellableStatementTransformer);
_ForInStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ForInStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


_ForInStatementTransformer.prototype.getBreakingLabel$ = function () {
	throw new Error("logic flaw");
};


_ForInStatementTransformer.prototype.getContinuingLabel$ = function () {
	throw new Error("logic flaw");
};


function _ForStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "FOR");
	this._index = 0;
	this._statement = statement;
};

$__jsx_extend([_ForStatementTransformer], _LabellableStatementTransformer);
_ForStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ForStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var initLabel;
	var testLabel;
	var bodyLabel;
	var endLabel;
	var postLabel;
	statements = [];
	initLabel = "$INIT_FOR_" + (this.getID$() + "");
	statements.push(new GotoStatement(initLabel));
	statements.push(new LabelStatement(initLabel));
	this._transformer.pushExpressionStatement$LExpression$ALStatement$(this._statement.getInitExpr$(), statements);
	testLabel = "$TEST_FOR_" + (this.getID$() + "");
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(testLabel));
	bodyLabel = "$BODY_FOR_" + (this.getID$() + "");
	endLabel = "$END_FOR_" + (this.getID$() + "");
	this._transformer.pushConditionalBranch$LExpression$SSALStatement$(this._statement.getCondExpr$(), bodyLabel, endLabel, statements);
	statements.push(new LabelStatement(bodyLabel));
	this._transformer.enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._transformer.convertAndPushStatements$ALStatement$ALStatement$(this._statement.getStatements$(), statements);
	this._transformer.leaveLabelledBlock$();
	postLabel = "$POST_FOR_" + (this.getID$() + "");
	statements.push(new GotoStatement(postLabel));
	statements.push(new LabelStatement(postLabel));
	this._transformer.pushExpressionStatement$LExpression$ALStatement$(this._statement.getPostExpr$(), statements);
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(endLabel));
	return statements;
};


_ForStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$END_FOR_" + (this.getID$() + "");
};


_ForStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$POST_FOR_" + (this.getID$() + "");
};


function _IfStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "IF");
	this._statement = statement;
};

$__jsx_extend([_IfStatementTransformer], _StatementTransformer);
_IfStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_IfStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var testLabel;
	var succLabel;
	var failLabel;
	var endLabel;
	statements = [];
	testLabel = "$TEST_IF_" + (this.getID$() + "");
	succLabel = "$SUCC_IF_" + (this.getID$() + "");
	failLabel = "$FAIL_IF_" + (this.getID$() + "");
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(testLabel));
	this._transformer.pushConditionalBranch$LExpression$SSALStatement$(this._statement.getExpr$(), succLabel, failLabel, statements);
	statements.push(new LabelStatement(succLabel));
	this._transformer.convertAndPushStatements$ALStatement$ALStatement$(this._statement.getOnTrueStatements$(), statements);
	endLabel = "$END_IF_" + (this.getID$() + "");
	statements.push(new GotoStatement(endLabel));
	statements.push(new LabelStatement(failLabel));
	this._transformer.convertAndPushStatements$ALStatement$ALStatement$(this._statement.getOnFalseStatements$(), statements);
	statements.push(new GotoStatement(endLabel));
	statements.push(new LabelStatement(endLabel));
	return statements;
};


function _SwitchStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "SWITCH");
	this._index = 0;
	this._statement = statement;
};

$__jsx_extend([_SwitchStatementTransformer], _LabellableStatementTransformer);
_SwitchStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_SwitchStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var testLabel;
	var endLabel;
	statements = [];
	testLabel = "$TEST_SWITCH_" + (this.getID$() + "");
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(testLabel));
	this._pushConditionalSwitch$ALStatement$(statements);
	endLabel = "$END_SWITCH_" + (this.getID$() + "");
	statements.push(new GotoStatement(endLabel));
	this._pushSwitchBody$ALStatement$(statements);
	statements.push(new LabelStatement(endLabel));
	return statements;
};


_SwitchStatementTransformer.prototype._pushConditionalSwitch$ALStatement$ = function (output) {
	var statements;
	var switchCases;
	var i;
	var stmt;
	var condSwitch;
	statements = this._statement.getStatements$();
	switchCases = [];
	for (i = 0; i < statements.length; ++ i) {
		stmt = statements[i];
		if (stmt instanceof CaseStatement) {
			switchCases.push(stmt);
			switchCases.push(new GotoStatement(this._getLabelFromCaseStatement$LCaseStatement$(stmt)));
			switchCases.push(new ReturnStatement(new Token("return", false), null));
		} else {
			if (stmt instanceof DefaultStatement) {
				switchCases.push(stmt);
				switchCases.push(new GotoStatement(this._getLabelFromDefaultStatement$()));
				switchCases.push(new ReturnStatement(new Token("return", false), null));
			}
		}
	}
	condSwitch = this._statement.clone$();
	condSwitch._statements = switchCases;
	output.push(condSwitch);
};


_SwitchStatementTransformer.prototype._pushSwitchBody$ALStatement$ = function (output) {
	var statements;
	var i;
	var stmt;
	var label;
	statements = this._statement.getStatements$();
	this._transformer.enterLabelledBlock$L_LabellableStatementTransformer$(this);
	for (i = 0; i < statements.length; ++ i) {
		stmt = statements[i];
		if (stmt instanceof CaseStatement) {
			label = this._getLabelFromCaseStatement$LCaseStatement$(stmt);
			output.push(new GotoStatement(label));
			output.push(new LabelStatement(label));
		} else {
			if (stmt instanceof DefaultStatement) {
				label = this._getLabelFromDefaultStatement$();
				output.push(new GotoStatement(label));
				output.push(new LabelStatement(label));
			} else {
				this._transformer.convertAndPushStatement$LStatement$ALStatement$(stmt, output);
			}
		}
	}
	this._transformer.leaveLabelledBlock$();
};


_SwitchStatementTransformer.prototype._getLabelFromCaseStatement$LCaseStatement$ = function (caseStmt) {
	return "$SWITCH_" + (this.getID$() + "") + "_CASE_" + caseStmt.getExpr$().getToken$().getValue$();
};


_SwitchStatementTransformer.prototype._getLabelFromDefaultStatement$ = function () {
	return "$SWITCH_" + (this.getID$() + "") + "_DEFAULT";
};


_SwitchStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$END_SWITCH_" + (this.getID$() + "");
};


_SwitchStatementTransformer.prototype.getContinuingLabel$ = function () {
	throw new Error("logic flaw");
};


function _CaseStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CASE");
	this._statement = statement;
};

$__jsx_extend([_CaseStatementTransformer], _StatementTransformer);
_CaseStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_CaseStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _DefaultStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "DEFAULT");
	this._statement = statement;
};

$__jsx_extend([_DefaultStatementTransformer], _StatementTransformer);
_DefaultStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DefaultStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _WhileStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "WHILE");
	this._statement = statement;
};

$__jsx_extend([_WhileStatementTransformer], _LabellableStatementTransformer);
_WhileStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_WhileStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var statements;
	var testLabel;
	var bodyLabel;
	var endLabel;
	statements = [];
	testLabel = "$TEST_WHILE_" + (this.getID$() + "");
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(testLabel));
	bodyLabel = "$BODY_WHILE_" + (this.getID$() + "");
	endLabel = "$END_WHILE_" + (this.getID$() + "");
	this._transformer.pushConditionalBranch$LExpression$SSALStatement$(this._statement.getExpr$(), bodyLabel, endLabel, statements);
	statements.push(new LabelStatement(bodyLabel));
	this._transformer.enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._transformer.convertAndPushStatements$ALStatement$ALStatement$(this._statement.getStatements$(), statements);
	this._transformer.leaveLabelledBlock$();
	statements.push(new GotoStatement(testLabel));
	statements.push(new LabelStatement(endLabel));
	return statements;
};


_WhileStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$END_WHILE_" + (this.getID$() + "");
};


_WhileStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$TEST_WHILE_" + (this.getID$() + "");
};


function _TryStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "TRY");
	this._statement = statement;
};

$__jsx_extend([_TryStatementTransformer], _StatementTransformer);
_TryStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_TryStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _CatchStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CATCH");
	this._statement = statement;
};

$__jsx_extend([_CatchStatementTransformer], _StatementTransformer);
_CatchStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_CatchStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _ThrowStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "THROW");
	this._statement = statement;
};

$__jsx_extend([_ThrowStatementTransformer], _StatementTransformer);
_ThrowStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ThrowStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _AssertStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "ASSERT");
	this._statement = statement;
};

$__jsx_extend([_AssertStatementTransformer], _StatementTransformer);
_AssertStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_AssertStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _LogStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "LOG");
	this._statement = statement;
};

$__jsx_extend([_LogStatementTransformer], _StatementTransformer);
_LogStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_LogStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function _DebuggerStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "DEBUGGER");
	this._statement = statement;
};

$__jsx_extend([_DebuggerStatementTransformer], _StatementTransformer);
_DebuggerStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DebuggerStatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	return [ this._statement ];
};


function CodeTransformer() {
	this._labelMap = [];
	this._statementIDs = {};
};

$__jsx_extend([CodeTransformer], Object);
CodeTransformer.prototype.findLabellableStatementTransformerByLabel$S = function (label) {
	var i;
	var trans;
	for (i = 0; this._labelMap.length; ++ i) {
		trans = this._labelMap[i];
		if (trans.getStatement$().getLabel$().getValue$() === label) {
			return trans;
		}
	}
	throw new Error("fatal error: no corresponding transformer for label \"" + label + "\"");
};


CodeTransformer.prototype.getInnermostLabellableStatementTransformer$ = function () {
	return this._labelMap[this._labelMap.length - 1];
};


CodeTransformer.prototype.enterLabelledBlock$L_LabellableStatementTransformer$ = function (transformer) {
	this._labelMap.push(transformer);
};


CodeTransformer.prototype.leaveLabelledBlock$ = function () {
	this._labelMap.pop();
};


CodeTransformer.prototype.convertAndPushStatement$LStatement$ALStatement$ = function (input, output) {
	var conved;
	var i;
	conved = this._getStatementTransformerFor$LStatement$(input).replaceControlStructuresWithGotos$();
	for (i = 0; i < conved.length; ++ i) {
		output.push(conved[i]);
	}
};


CodeTransformer.prototype.convertAndPushStatements$ALStatement$ALStatement$ = function (input, output) {
	var i;
	for (i = 0; i < input.length; ++ i) {
		this.convertAndPushStatement$LStatement$ALStatement$(input[i], output);
	}
};


CodeTransformer.prototype.pushConditionalBranch$LExpression$SSALStatement$ = function (expr, succLabel, failLabel, output) {
	output.push(new IfStatement(new Token("if", false), expr, [ new GotoStatement(succLabel) ], [ new GotoStatement(failLabel) ]));
};


CodeTransformer.prototype.pushExpressionStatement$LExpression$ALStatement$ = function (expr, output) {
	output.push(new ExpressionStatement(expr));
};


CodeTransformer.prototype.getStatementIDMap$ = function () {
	return this._statementIDs;
};


CodeTransformer.prototype.transformFunctionDefinition$LMemberFunctionDefinition$ = function (funcDef) {
	var newExpr;
	var numBlock;
	newExpr = new NewExpression(new Token("new", false), CodeTransformer.stopIterationType, [  ]);
	newExpr.analyze$LAnalysisContext$LExpression$(new AnalysisContext([  ], null, null), null);
	funcDef.getStatements$().push(new ThrowStatement(new Token("throw", false), newExpr));
	numBlock = this._doCPSConvert$LMemberFunctionDefinition$(funcDef);
	this._eliminateYields$LMemberFunctionDefinition$N(funcDef, numBlock);
};


CodeTransformer.prototype._getStatementTransformerFor$LStatement$ = function (statement) {
	if (statement instanceof ConstructorInvocationStatement) {
		return new _ConstructorInvocationStatementTransformer(this, statement);
	} else {
		if (statement instanceof ExpressionStatement) {
			return new _ExpressionStatementTransformer(this, statement);
		} else {
			if (statement instanceof FunctionStatement) {
				return new _FunctionStatementTransformer(this, statement);
			} else {
				if (statement instanceof ReturnStatement) {
					return new _ReturnStatementTransformer(this, statement);
				} else {
					if (statement instanceof YieldStatement) {
						return new _YieldStatementTransformer(this, statement);
					} else {
						if (statement instanceof DeleteStatement) {
							return new _DeleteStatementTransformer(this, statement);
						} else {
							if (statement instanceof BreakStatement) {
								return new _BreakStatementTransformer(this, statement);
							} else {
								if (statement instanceof ContinueStatement) {
									return new _ContinueStatementTransformer(this, statement);
								} else {
									if (statement instanceof DoWhileStatement) {
										return new _DoWhileStatementTransformer(this, statement);
									} else {
										if (statement instanceof ForInStatement) {
											return new _ForInStatementTransformer(this, statement);
										} else {
											if (statement instanceof ForStatement) {
												return new _ForStatementTransformer(this, statement);
											} else {
												if (statement instanceof IfStatement) {
													return new _IfStatementTransformer(this, statement);
												} else {
													if (statement instanceof SwitchStatement) {
														return new _SwitchStatementTransformer(this, statement);
													} else {
														if (statement instanceof CaseStatement) {
															return new _CaseStatementTransformer(this, statement);
														} else {
															if (statement instanceof DefaultStatement) {
																return new _DefaultStatementTransformer(this, statement);
															} else {
																if (statement instanceof WhileStatement) {
																	return new _WhileStatementTransformer(this, statement);
																} else {
																	if (statement instanceof TryStatement) {
																		return new _TryStatementTransformer(this, statement);
																	} else {
																		if (statement instanceof CatchStatement) {
																			return new _CatchStatementTransformer(this, statement);
																		} else {
																			if (statement instanceof ThrowStatement) {
																				return new _ThrowStatementTransformer(this, statement);
																			} else {
																				if (statement instanceof AssertStatement) {
																					return new _AssertStatementTransformer(this, statement);
																				} else {
																					if (statement instanceof LogStatement) {
																						return new _LogStatementTransformer(this, statement);
																					} else {
																						if (statement instanceof DebuggerStatement) {
																							return new _DebuggerStatementTransformer(this, statement);
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
	throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize$()));
};


CodeTransformer.prototype._doCPSConvert$LMemberFunctionDefinition$ = function (funcDef) {
	this._replaceControlStructuresWithGotos$LMemberFunctionDefinition$(funcDef);
	return this._eliminateGotos$LMemberFunctionDefinition$(funcDef);
};


CodeTransformer.prototype._replaceControlStructuresWithGotos$LMemberFunctionDefinition$ = function (funcDef) {
	var statements;
	var i;
	statements = [];
	for (i = 0; i < funcDef.getStatements$().length; ++ i) {
		statements = statements.concat(this._getStatementTransformerFor$LStatement$(funcDef.getStatements$()[i]).replaceControlStructuresWithGotos$());
	}
	statements.unshift(new GotoStatement("$START"), new LabelStatement("$START"));
	statements.push(new GotoStatement("$END"), new LabelStatement("$END"));
	funcDef._statements = statements;
};


CodeTransformer.prototype._eliminateGotos$LMemberFunctionDefinition$ = function (funcDef) {
	var statements;
	var labels;
	var i;
	var name;
	var stmt;
	var ifStmt;
	var succLabel;
	var failLabel;
	var switchStmt;
	var j;
	var entries;
	var codeBlocks;
	var currentLabel;
	var numBlock;
	var body;
	var block;
	statements = funcDef.getStatements$();
	labels = {};
	for (i = 0; i < statements.length; ++ i) {
		if (statements[i] instanceof LabelStatement && labels[statements[i].getName$()] == null) {
			name = statements[i].getName$();
			labels[name] = new LocalVariable(new Token(name, true), new StaticFunctionType(null, Type.voidType, [  ], true));
			funcDef.getLocals$().push(labels[name]);
		}
	}
	for (i = 0; i < statements.length; ++ i) {
		stmt = statements[i];
		if (stmt instanceof GotoStatement) {
			name = stmt.getLabel$();
			statements[i] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), [  ]));
		} else {
			if (stmt instanceof IfStatement) {
				ifStmt = stmt;
				succLabel = ifStmt.getOnTrueStatements$()[0].getLabel$();
				ifStmt.getOnTrueStatements$()[0] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[succLabel]), [  ]));
				failLabel = ifStmt.getOnFalseStatements$()[0].getLabel$();
				ifStmt.getOnFalseStatements$()[0] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[failLabel]), [  ]));
			} else {
				if (stmt instanceof SwitchStatement) {
					switchStmt = stmt;
					for (j = 0; j < switchStmt.getStatements$().length; ++ j) {
						if (switchStmt.getStatements$()[j] instanceof GotoStatement) {
							name = switchStmt.getStatements$()[j].getLabel$();
							switchStmt.getStatements$()[j] = new ExpressionStatement(new CallExpression(new Token("(", false), new LocalExpression(null, labels[name]), [  ]));
						}
					}
				}
			}
		}
	}
	entries = [];
	for (i = 0; i < statements.length; ++ i) {
		if (statements[i] instanceof LabelStatement) {
			break;
		}
		entries.push(statements[i]);
	}
	codeBlocks = [];
	currentLabel = null;
	numBlock = 0;
	while (i < statements.length) {
		currentLabel = statements[i];
		body = [];
		++ i;
		for (; i < statements.length; ++ i) {
			if (statements[i] instanceof LabelStatement) {
				break;
			}
			body.push(statements[i]);
		}
		block = new MemberFunctionDefinition(new Token("function", false), null, ClassDefinition.IS_STATIC, Type.voidType, [  ], [  ], body, [  ], null, null);
		funcDef.getClosures$().push(block);
		codeBlocks.push(new ExpressionStatement(new AssignmentExpression(new Token("=", false), new LocalExpression(null, labels[currentLabel.getName$()]), new FunctionExpression(new Token("function", false), block))));
		++ numBlock;
	}
	funcDef._statements = codeBlocks.concat(entries);
	return numBlock;
};


function CodeTransformer$_calcGeneratorNestDepth$LMemberFunctionDefinition$(funcDef) {
	var depth;
	var parent;
	depth = 0;
	while ((parent = funcDef.getParent$()) != null) {
		if (parent.isGenerator$()) {
			depth++;
		}
		funcDef = parent;
	}
	return depth;
};

CodeTransformer._calcGeneratorNestDepth$LMemberFunctionDefinition$ = CodeTransformer$_calcGeneratorNestDepth$LMemberFunctionDefinition$;

CodeTransformer.prototype._eliminateYields$LMemberFunctionDefinition$N = function (funcDef, numBlock) {
	var $this = this;
	var yieldType;
	var genClassDef;
	var createContext;
	var parser;
	var genType;
	var genLocalName;
	var genLocal;
	var newExpr;
	var blocks;
	var i;
	var statements;
	var j;
	yieldType = funcDef.getReturnType$().getClassDef$().getTypeArguments$()[0];
	genClassDef = CodeTransformer.jsxGeneratorClassDef.instantiateTemplateClass$ALCompileError$LTemplateInstantiationRequest$([  ], new TemplateInstantiationRequest(null, "__jsx_generator", [ yieldType ]));
	createContext = (function (parser) {
		return new AnalysisContext([  ], parser, (function (parser, classDef) {
			classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
			classDef.analyze$LAnalysisContext$(createContext(parser));
			return classDef;
		}));
	});
	parser = CodeTransformer.jsxGeneratorClassDef.getParser$();
	genClassDef.resolveTypes$LAnalysisContext$(createContext(parser));
	genClassDef.analyze$LAnalysisContext$(createContext(parser));
	CodeTransformer.jsxGeneratorClassDef.getParser$()._classDefs.push(genClassDef);
	genType = new ObjectType(genClassDef);
	genLocalName = "$generator" + (CodeTransformer$_calcGeneratorNestDepth$LMemberFunctionDefinition$(funcDef) + "");
	genLocal = new LocalVariable(new Token(genLocalName, false), genType);
	funcDef.getLocals$().push(genLocal);
	newExpr = new NewExpression(new Token("new", false), genType, [  ]);
	newExpr.analyze$LAnalysisContext$LExpression$(new AnalysisContext([  ], null, null), null);
	funcDef.getStatements$().unshift(new ExpressionStatement(new AssignmentExpression(new Token("=", false), new LocalExpression(new Token(genLocalName, false), genLocal), newExpr)));
	blocks = funcDef.getClosures$().slice(funcDef.getClosures$().length - numBlock);
	for (i = 0; i < blocks.length; ++ i) {
		statements = blocks[i].getStatements$();
		for (j = 0; j < statements.length; ++ j) {
			if (statements[j] instanceof YieldStatement) {
				statements.splice(j, 2, new ExpressionStatement(new AssignmentExpression(new Token("=", false), new PropertyExpression$0(new Token(".", false), new LocalExpression(new Token(genLocalName, false), genLocal), new Token("__value", false), [  ], yieldType), statements[j].getExpr$())), new ExpressionStatement(new AssignmentExpression(new Token("=", false), new PropertyExpression$0(new Token(".", false), new LocalExpression(new Token(genLocalName, false), genLocal), new Token("__next", true), [  ], new StaticFunctionType(null, Type.voidType, [  ], true)), statements[j + 1].getExpr$().getExpr$())));
				break;
			}
		}
	}
	statements = funcDef.getStatements$();
	statements.splice(statements.length - 1, 1, new ExpressionStatement(new AssignmentExpression(new Token("=", false), new PropertyExpression$0(new Token(".", false), new LocalExpression(new Token(genLocalName, false), genLocal), new Token("__next", true), [  ], new StaticFunctionType(null, Type.voidType, [  ], true)), new LocalExpression(new Token("$START", true), statements[statements.length - 1].getExpr$().getExpr$().getLocal$()))));
	statements.push(new ReturnStatement(new Token("return", false), new LocalExpression(new Token("$generator", false), genLocal)));
};


function _Util$COutputNameStash(outputName) {
	Stash.call(this);
	this.outputName = outputName;
};

$__jsx_extend([_Util$COutputNameStash], Stash);
_Util$COutputNameStash.prototype.clone$ = function () {
	throw new Error("not supported");
};


function _Namer$C_TryStash(catchName) {
	Stash.call(this);
	this.catchName = catchName;
};

$__jsx_extend([_Namer$C_TryStash], Stash);
_Namer$C_TryStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Namer$C_CatchTargetStash(tryStmt) {
	Stash.call(this);
	this.tryStmt = tryStmt;
};

$__jsx_extend([_Namer$C_CatchTargetStash], Stash);
_Namer$C_CatchTargetStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$C_ClassStash() {
	Stash.call(this);
	this.staticVariableUseCount = {};
	this.staticVariableConversionTable = {};
};

$__jsx_extend([_Minifier$C_ClassStash], Stash);
_Minifier$C_ClassStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$C_ScopeStash() {
	Stash.call(this);
	this.usedGlobals = {};
	this.usedOuterLocals = [];
};

$__jsx_extend([_Minifier$C_ScopeStash], Stash);
_Minifier$C_ScopeStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$C_LocalStash() {
	Stash.call(this);
	this.useCount = 0;
	this.minifiedName = null;
};

$__jsx_extend([_Minifier$C_LocalStash], Stash);
_Minifier$C_LocalStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$C_MinifyingNamer() {
	_Namer.call(this);
	this._minifier = null;
};

$__jsx_extend([_Minifier$C_MinifyingNamer], _Namer);
_Minifier$C_MinifyingNamer.prototype.setup$L_Minifier$ = function (minifier) {
	this._minifier = minifier;
	_Namer.prototype.setup$LJavaScriptEmitter$.call(this, minifier._emitter);
	return this;
};


_Minifier$C_MinifyingNamer.prototype._getMangler$ = function () {
	return this._minifier._emitter.getMangler$();
};


_Minifier$C_MinifyingNamer.prototype._isCounting$ = function () {
	return this._minifier._isCounting$();
};


_Minifier$C_MinifyingNamer.prototype.getNameOfProperty$LClassDefinition$S = function (classDef, name) {
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, null, false) || Util$memberIsExported$LClassDefinition$SALType$B(classDef, name, null, false)) {
		return name;
	}
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(this._minifier._propertyUseCount, name);
	} else {
		name = this._minifier._propertyConversionTable[name];
	}
	return name;
};


_Minifier$C_MinifyingNamer.prototype.getNameOfMethod$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
	var mangledName;
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, false)) {
		return name;
	}
	mangledName = this._getMangler$().mangleFunctionName$SALType$(name, argTypes);
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(this._minifier._propertyUseCount, mangledName);
	} else {
		mangledName = this._minifier._propertyConversionTable[mangledName];
	}
	return mangledName;
};


_Minifier$C_MinifyingNamer.prototype.getNameOfStaticVariable$LClassDefinition$S = function (classDef, name) {
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, null, true) || Util$memberIsExported$LClassDefinition$SALType$B(classDef, name, null, true)) {
		return name;
	}
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(_Minifier$_getClassStash$LClassDefinition$(classDef).staticVariableUseCount, name);
	} else {
		name = _Minifier$_getClassStash$LClassDefinition$(classDef).staticVariableConversionTable[name];
	}
	return name;
};


_Minifier$C_MinifyingNamer.prototype.getNameOfStaticFunction$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
	var mangledName;
	if (Util$memberRootIsNative$LClassDefinition$SALType$B(classDef, name, argTypes, true)) {
		return this.getNameOfClass$LClassDefinition$(classDef) + "." + name;
	}
	mangledName = _Util$getOutputClassName$LClassDefinition$(classDef) + "$" + this._getMangler$().mangleFunctionName$SALType$(name, argTypes);
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(this._minifier._globalUseCount, mangledName);
	} else {
		mangledName = this._minifier._globalConversionTable[mangledName];
	}
	return mangledName;
};


_Minifier$C_MinifyingNamer.prototype.getNameOfConstructor$LClassDefinition$ALType$ = function (classDef, argTypes) {
	var name;
	var mangledName;
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		name = _Util$getNameOfNativeConstructor$LClassDefinition$(classDef);
		if (this._isCounting$()) {
			_Minifier$_incr$HNS(this._minifier._globalUseCount, name);
		}
		return name;
	}
	mangledName = _Util$getOutputConstructorName$LClassDefinition$ALType$(classDef, argTypes);
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(this._minifier._globalUseCount, mangledName);
	} else {
		mangledName = this._minifier._globalConversionTable[mangledName];
	}
	return mangledName;
};


_Minifier$C_MinifyingNamer.prototype.getNameOfClass$LClassDefinition$ = function (classDef) {
	var name;
	name = _Util$getOutputClassName$LClassDefinition$(classDef);
	if (this._isCounting$()) {
		_Minifier$_incr$HNS(this._minifier._globalUseCount, name);
	}
	if ((classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FAKE)) === 0 && ! this._isCounting$()) {
		return this._minifier._globalConversionTable[name];
	}
	return name;
};


_Minifier$C_MinifyingNamer.prototype.enterScope$LLocalVariable$F$V$ = function (local, cb) {
	var $this = this;
	if (local == null) {
		cb();
	} else {
		if (this._isCounting$()) {
			this._minifier._recordUsedIdentifiers$LStashable$F$V$(local, (function () {
				$this._minifier._outerLocals.push(local);
				cb();
				$this._minifier._outerLocals.pop();
			}));
		} else {
			this._minifier._buildConversionTable$ALLocalVariable$L_Minifier$C_ScopeStash$([ local ], _Minifier$_getScopeStash$LStashable$(local));
			cb();
		}
	}
};


_Minifier$C_MinifyingNamer.prototype.enterFunction$LMemberFunctionDefinition$F$V$ = function (funcDef, cb) {
	var $this = this;
	if (this._isCounting$()) {
		this._minifier._recordUsedIdentifiers$LStashable$F$V$(funcDef, (function () {
			$this._minifier._outerLocals = $this._minifier._outerLocals.concat(_Minifier$_getArgsAndLocals$LMemberFunctionDefinition$(funcDef));
			cb();
			$this._minifier._outerLocals.length -= funcDef.getArguments$().length + funcDef.getLocals$().length;
		}));
	} else {
		this._minifier._buildConversionTable$ALLocalVariable$L_Minifier$C_ScopeStash$(_Minifier$_getArgsAndLocals$LMemberFunctionDefinition$(funcDef), _Minifier$_getScopeStash$LStashable$(funcDef));
		cb();
	}
};


_Minifier$C_MinifyingNamer.prototype.getNameOfLocalVariable$LLocalVariable$ = function (local) {
	if (local instanceof CaughtVariable) {
		return this._getCatchName$LCaughtVariable$(local);
	}
	if (this._isCounting$()) {
		++ _Minifier$_getLocalStash$LLocalVariable$(local).useCount;
		return local.getName$().getValue$();
	} else {
		return _Minifier$_getLocalStash$LLocalVariable$(local).minifiedName;
	}
};


function _LinkTimeOptimizationCommand$CStash() {
	Stash.call(this);
	this.extendedBy = [];
};

$__jsx_extend([_LinkTimeOptimizationCommand$CStash], Stash);
_LinkTimeOptimizationCommand$CStash.prototype.clone$ = function () {
	throw new Error("not supported");
};


function _DetermineCalleeCommand$CStash() {
	Stash.call(this);
	this.callingFuncDef = null;
};

function _DetermineCalleeCommand$CStash$0(that) {
	Stash.call(this);
	this.callingFuncDef = that.callingFuncDef;
};

$__jsx_extend([_DetermineCalleeCommand$CStash, _DetermineCalleeCommand$CStash$0], Stash);
_DetermineCalleeCommand$CStash.prototype.clone$ = function () {
	return new _DetermineCalleeCommand$CStash$0(this);
};


function _UnclassifyOptimizationCommand$CStash() {
	Stash.call(this);
	this.inliner = null;
};

function _UnclassifyOptimizationCommand$CStash$0(that) {
	Stash.call(this);
	this.inliner = that.inliner;
};

$__jsx_extend([_UnclassifyOptimizationCommand$CStash, _UnclassifyOptimizationCommand$CStash$0], Stash);
_UnclassifyOptimizationCommand$CStash.prototype.clone$ = function () {
	return new _UnclassifyOptimizationCommand$CStash$0(this);
};


function _FoldConstantCommand$CStash() {
	Stash.call(this);
	this.isOptimized = false;
};

function _FoldConstantCommand$CStash$0(that) {
	Stash.call(this);
	this.isOptimized = that.isOptimized;
};

$__jsx_extend([_FoldConstantCommand$CStash, _FoldConstantCommand$CStash$0], Stash);
_FoldConstantCommand$CStash.prototype.clone$ = function () {
	return new _FoldConstantCommand$CStash$0(this);
};


function _InlineOptimizeCommand$CStash() {
	Stash.call(this);
	this.isOptimized = false;
	this.isInlineable = null;
};

function _InlineOptimizeCommand$CStash$0(that) {
	Stash.call(this);
	this.isOptimized = that.isOptimized;
	this.isInlineable = that.isInlineable;
};

$__jsx_extend([_InlineOptimizeCommand$CStash, _InlineOptimizeCommand$CStash$0], Stash);
_InlineOptimizeCommand$CStash.prototype.clone$ = function () {
	return new _InlineOptimizeCommand$CStash$0(this);
};


function _UnboxOptimizeCommand$CStash() {
	Stash.call(this);
	this.canUnbox = null;
};

$__jsx_extend([_UnboxOptimizeCommand$CStash], Stash);
_UnboxOptimizeCommand$CStash.prototype.clone$ = function () {
	var tmp;
	tmp = new _UnboxOptimizeCommand$CStash();
	tmp.canUnbox = this.canUnbox;
	return tmp;
};


function _NoDebugCommand$CStash() {
	Stash.call(this);
	this.debugValue = true;
};

$__jsx_extend([_NoDebugCommand$CStash], Stash);
_NoDebugCommand$CStash.prototype.clone$ = function () {
	var tmp;
	tmp = new _NoDebugCommand$CStash();
	tmp.debugValue = this.debugValue;
	return tmp;
};


$__jsx_lazy_init(CompilationServer, "AUTO_SHUTDOWN", function () {
	return ! process.env.JSX_NO_AUTO_SHUTDOWN;
});
$__jsx_lazy_init(CompilationServer, "LIFE", function () {
	return 10 * 60 * 1000;
});
var js = { global: function () { return this; }() };
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
_Util.OUTPUTNAME_IDENTIFIER = "emitter.outputname";
_Namer.IDENTIFIER = "namer";
_MinifiedNameGenerator._MINIFY_CHARS = "$_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
$__jsx_lazy_init(_MinifiedNameGenerator, "KEYWORDS", function () {
	return ("break else new var case finally return void catch for switch while continue function this with default if throw" + " delete in try do instanceof typeof abstract enum int" + " boolean export interface byte extends long char final native class float package const goto private debugger implements protected double import public" + " NaN Infinity undefined eval").split(/\s+/);
});
$__jsx_lazy_init(_MinifiedNameGenerator, "GLOBALS", function () {
	return ("parseInt parseFloat isNaN isFinite decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Object Function Array String Boolean Number Date RegExp Error EvalError RangeError ReferenceError SyntaxError TypeError URIError Math").split(/\s+/);
});
_Minifier.CLASSSTASH_IDENTIFIER = "minifier.class";
_Minifier.SCOPESTASH_IDENTIFIER = "minifier.scope";
_Minifier.LOCALSTASH_IDENTIFIER = "minifier.local";
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
Meta.VERSION_STRING = "0.9.28";
Meta.VERSION_NUMBER = 0.009028;
Meta.LAST_COMMIT_HASH = "27a1644e9b3800f8387a38410af80d18da43ba0d";
Meta.LAST_COMMIT_DATE = "2013-05-05 17:21:27 +0900";
$__jsx_lazy_init(Meta, "IDENTIFIER", function () {
	return Meta.VERSION_STRING + " (" + Meta.LAST_COMMIT_DATE + "; " + Meta.LAST_COMMIT_HASH + ")";
});
JavaScriptEmitter.BOOTSTRAP_NONE = 0;
JavaScriptEmitter.BOOTSTRAP_EXECUTABLE = 1;
JavaScriptEmitter.BOOTSTRAP_TEST = 2;
JavaScriptEmitter._initialized = false;
$__jsx_lazy_init(LocalVariableStatuses, "UNTYPED_RECURSIVE_FUNCTION", function () {
	return - 1;
});
LocalVariableStatuses.UNSET = 0;
LocalVariableStatuses.ISSET = 1;
LocalVariableStatuses.MAYBESET = 2;
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
ClassDefinition.IS_GENERATOR = 8192;
ClassDefinition.IS_EXPORT = 16384;
ClassDefinition.GET_MEMBER_MODE_ALL = 0;
ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY = 1;
ClassDefinition.GET_MEMBER_MODE_SUPER = 2;
ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY = 3;
MemberVariableDefinition.NOT_ANALYZED = 0;
MemberVariableDefinition.IS_ANALYZING = 1;
MemberVariableDefinition.ANALYZE_SUCEEDED = 2;
MemberVariableDefinition.ANALYZE_FAILED = 3;
$__jsx_lazy_init(Type, "voidType", function () {
	return new VoidType();
});
$__jsx_lazy_init(Type, "nullType", function () {
	return new NullType();
});
$__jsx_lazy_init(Type, "booleanType", function () {
	return new BooleanType();
});
$__jsx_lazy_init(Type, "integerType", function () {
	return new IntegerType();
});
$__jsx_lazy_init(Type, "numberType", function () {
	return new NumberType();
});
$__jsx_lazy_init(Type, "stringType", function () {
	return new StringType();
});
$__jsx_lazy_init(Type, "variantType", function () {
	return new VariantType();
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
$__jsx_lazy_init(_StatementTransformer, "_statementCountMap", function () {
	return {};
});
CodeTransformer.stopIterationType = null;
CodeTransformer.jsxGeneratorClassDef = null;

var $__jsx_classMap = {
	"system:lib/built-in.jsx": {
		g_StopIteration: g_StopIteration,
		g_StopIteration$: g_StopIteration
	},
	"src/jsx-node-front.jsx": {
		CompilationServer: CompilationServer,
		CompilationServer$LPlatform$: CompilationServer,
		_Main: _Main,
		_Main$: _Main,
		NodePlatform: NodePlatform,
		NodePlatform$: NodePlatform,
		NodePlatform$S: NodePlatform$0,
		CompilationServerPlatform: CompilationServerPlatform,
		CompilationServerPlatform$SNLServerRequest$LServerResponse$: CompilationServerPlatform
	},
	"system:lib/js/js/nodejs.jsx": {
		node: node,
		node$: node
	},
	"system:lib/js/timer.jsx": {
		Timer: Timer,
		Timer$: Timer,
		TimerHandle: TimerHandle,
		TimerHandle$: TimerHandle
	},
	"src/util.jsx": {
		Util: Util,
		Util$: Util
	},
	"src/jsemitter.jsx": {
		_Util: _Util,
		_Util$: _Util,
		_Mangler: _Mangler,
		_Mangler$: _Mangler,
		_Namer: _Namer,
		_Namer$: _Namer,
		_MinifiedNameGenerator: _MinifiedNameGenerator,
		_MinifiedNameGenerator$AS: _MinifiedNameGenerator,
		_Minifier: _Minifier,
		_Minifier$LJavaScriptEmitter$ALClassDefinition$: _Minifier,
		_StatementEmitter: _StatementEmitter,
		_StatementEmitter$LJavaScriptEmitter$: _StatementEmitter,
		_ConstructorInvocationStatementEmitter: _ConstructorInvocationStatementEmitter,
		_ConstructorInvocationStatementEmitter$LJavaScriptEmitter$LConstructorInvocationStatement$: _ConstructorInvocationStatementEmitter,
		_ExpressionStatementEmitter: _ExpressionStatementEmitter,
		_ExpressionStatementEmitter$LJavaScriptEmitter$LExpressionStatement$: _ExpressionStatementEmitter,
		_FunctionStatementEmitter: _FunctionStatementEmitter,
		_FunctionStatementEmitter$LJavaScriptEmitter$LFunctionStatement$: _FunctionStatementEmitter,
		_ReturnStatementEmitter: _ReturnStatementEmitter,
		_ReturnStatementEmitter$LJavaScriptEmitter$LReturnStatement$: _ReturnStatementEmitter,
		_DeleteStatementEmitter: _DeleteStatementEmitter,
		_DeleteStatementEmitter$LJavaScriptEmitter$LDeleteStatement$: _DeleteStatementEmitter,
		_BreakStatementEmitter: _BreakStatementEmitter,
		_BreakStatementEmitter$LJavaScriptEmitter$LBreakStatement$: _BreakStatementEmitter,
		_ContinueStatementEmitter: _ContinueStatementEmitter,
		_ContinueStatementEmitter$LJavaScriptEmitter$LContinueStatement$: _ContinueStatementEmitter,
		_DoWhileStatementEmitter: _DoWhileStatementEmitter,
		_DoWhileStatementEmitter$LJavaScriptEmitter$LDoWhileStatement$: _DoWhileStatementEmitter,
		_ForInStatementEmitter: _ForInStatementEmitter,
		_ForInStatementEmitter$LJavaScriptEmitter$LForInStatement$: _ForInStatementEmitter,
		_ForStatementEmitter: _ForStatementEmitter,
		_ForStatementEmitter$LJavaScriptEmitter$LForStatement$: _ForStatementEmitter,
		_IfStatementEmitter: _IfStatementEmitter,
		_IfStatementEmitter$LJavaScriptEmitter$LIfStatement$: _IfStatementEmitter,
		_SwitchStatementEmitter: _SwitchStatementEmitter,
		_SwitchStatementEmitter$LJavaScriptEmitter$LSwitchStatement$: _SwitchStatementEmitter,
		_CaseStatementEmitter: _CaseStatementEmitter,
		_CaseStatementEmitter$LJavaScriptEmitter$LCaseStatement$: _CaseStatementEmitter,
		_DefaultStatementEmitter: _DefaultStatementEmitter,
		_DefaultStatementEmitter$LJavaScriptEmitter$LDefaultStatement$: _DefaultStatementEmitter,
		_WhileStatementEmitter: _WhileStatementEmitter,
		_WhileStatementEmitter$LJavaScriptEmitter$LWhileStatement$: _WhileStatementEmitter,
		_TryStatementEmitter: _TryStatementEmitter,
		_TryStatementEmitter$LJavaScriptEmitter$LTryStatement$: _TryStatementEmitter,
		_CatchStatementEmitter: _CatchStatementEmitter,
		_CatchStatementEmitter$LJavaScriptEmitter$LCatchStatement$: _CatchStatementEmitter,
		_ThrowStatementEmitter: _ThrowStatementEmitter,
		_ThrowStatementEmitter$LJavaScriptEmitter$LThrowStatement$: _ThrowStatementEmitter,
		_AssertStatementEmitter: _AssertStatementEmitter,
		_AssertStatementEmitter$LJavaScriptEmitter$LAssertStatement$: _AssertStatementEmitter,
		_LogStatementEmitter: _LogStatementEmitter,
		_LogStatementEmitter$LJavaScriptEmitter$LLogStatement$: _LogStatementEmitter,
		_DebuggerStatementEmitter: _DebuggerStatementEmitter,
		_DebuggerStatementEmitter$LJavaScriptEmitter$LDebuggerStatement$: _DebuggerStatementEmitter,
		_ExpressionEmitter: _ExpressionEmitter,
		_ExpressionEmitter$LJavaScriptEmitter$: _ExpressionEmitter,
		_LocalExpressionEmitter: _LocalExpressionEmitter,
		_LocalExpressionEmitter$LJavaScriptEmitter$LLocalExpression$: _LocalExpressionEmitter,
		_ClassExpressionEmitter: _ClassExpressionEmitter,
		_ClassExpressionEmitter$LJavaScriptEmitter$LClassExpression$: _ClassExpressionEmitter,
		_NullExpressionEmitter: _NullExpressionEmitter,
		_NullExpressionEmitter$LJavaScriptEmitter$LNullExpression$: _NullExpressionEmitter,
		_BooleanLiteralExpressionEmitter: _BooleanLiteralExpressionEmitter,
		_BooleanLiteralExpressionEmitter$LJavaScriptEmitter$LBooleanLiteralExpression$: _BooleanLiteralExpressionEmitter,
		_IntegerLiteralExpressionEmitter: _IntegerLiteralExpressionEmitter,
		_IntegerLiteralExpressionEmitter$LJavaScriptEmitter$LIntegerLiteralExpression$: _IntegerLiteralExpressionEmitter,
		_NumberLiteralExpressionEmitter: _NumberLiteralExpressionEmitter,
		_NumberLiteralExpressionEmitter$LJavaScriptEmitter$LNumberLiteralExpression$: _NumberLiteralExpressionEmitter,
		_StringLiteralExpressionEmitter: _StringLiteralExpressionEmitter,
		_StringLiteralExpressionEmitter$LJavaScriptEmitter$LStringLiteralExpression$: _StringLiteralExpressionEmitter,
		_RegExpLiteralExpressionEmitter: _RegExpLiteralExpressionEmitter,
		_RegExpLiteralExpressionEmitter$LJavaScriptEmitter$LRegExpLiteralExpression$: _RegExpLiteralExpressionEmitter,
		_ArrayLiteralExpressionEmitter: _ArrayLiteralExpressionEmitter,
		_ArrayLiteralExpressionEmitter$LJavaScriptEmitter$LArrayLiteralExpression$: _ArrayLiteralExpressionEmitter,
		_MapLiteralExpressionEmitter: _MapLiteralExpressionEmitter,
		_MapLiteralExpressionEmitter$LJavaScriptEmitter$LMapLiteralExpression$: _MapLiteralExpressionEmitter,
		_ThisExpressionEmitter: _ThisExpressionEmitter,
		_ThisExpressionEmitter$LJavaScriptEmitter$LThisExpression$: _ThisExpressionEmitter,
		_AsExpressionEmitter: _AsExpressionEmitter,
		_AsExpressionEmitter$LJavaScriptEmitter$LAsExpression$: _AsExpressionEmitter,
		_AsNoConvertExpressionEmitter: _AsNoConvertExpressionEmitter,
		_AsNoConvertExpressionEmitter$LJavaScriptEmitter$LAsNoConvertExpression$: _AsNoConvertExpressionEmitter,
		_OperatorExpressionEmitter: _OperatorExpressionEmitter,
		_OperatorExpressionEmitter$LJavaScriptEmitter$: _OperatorExpressionEmitter,
		_UnaryExpressionEmitter: _UnaryExpressionEmitter,
		_UnaryExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$: _UnaryExpressionEmitter,
		_PostfixExpressionEmitter: _PostfixExpressionEmitter,
		_PostfixExpressionEmitter$LJavaScriptEmitter$LUnaryExpression$: _PostfixExpressionEmitter,
		_InstanceofExpressionEmitter: _InstanceofExpressionEmitter,
		_InstanceofExpressionEmitter$LJavaScriptEmitter$LInstanceofExpression$: _InstanceofExpressionEmitter,
		_PropertyExpressionEmitter: _PropertyExpressionEmitter,
		_PropertyExpressionEmitter$LJavaScriptEmitter$LPropertyExpression$: _PropertyExpressionEmitter,
		_FunctionExpressionEmitter: _FunctionExpressionEmitter,
		_FunctionExpressionEmitter$LJavaScriptEmitter$LFunctionExpression$: _FunctionExpressionEmitter,
		_AdditiveExpressionEmitter: _AdditiveExpressionEmitter,
		_AdditiveExpressionEmitter$LJavaScriptEmitter$LAdditiveExpression$: _AdditiveExpressionEmitter,
		_AssignmentExpressionEmitter: _AssignmentExpressionEmitter,
		_AssignmentExpressionEmitter$LJavaScriptEmitter$LAssignmentExpression$: _AssignmentExpressionEmitter,
		_EqualityExpressionEmitter: _EqualityExpressionEmitter,
		_EqualityExpressionEmitter$LJavaScriptEmitter$LEqualityExpression$: _EqualityExpressionEmitter,
		_InExpressionEmitter: _InExpressionEmitter,
		_InExpressionEmitter$LJavaScriptEmitter$LInExpression$: _InExpressionEmitter,
		_LogicalExpressionEmitter: _LogicalExpressionEmitter,
		_LogicalExpressionEmitter$LJavaScriptEmitter$LLogicalExpression$: _LogicalExpressionEmitter,
		_ShiftExpressionEmitter: _ShiftExpressionEmitter,
		_ShiftExpressionEmitter$LJavaScriptEmitter$LShiftExpression$: _ShiftExpressionEmitter,
		_BinaryNumberExpressionEmitter: _BinaryNumberExpressionEmitter,
		_BinaryNumberExpressionEmitter$LJavaScriptEmitter$LBinaryNumberExpression$: _BinaryNumberExpressionEmitter,
		_ArrayExpressionEmitter: _ArrayExpressionEmitter,
		_ArrayExpressionEmitter$LJavaScriptEmitter$LArrayExpression$: _ArrayExpressionEmitter,
		_ConditionalExpressionEmitter: _ConditionalExpressionEmitter,
		_ConditionalExpressionEmitter$LJavaScriptEmitter$LConditionalExpression$: _ConditionalExpressionEmitter,
		_CallExpressionEmitter: _CallExpressionEmitter,
		_CallExpressionEmitter$LJavaScriptEmitter$LCallExpression$: _CallExpressionEmitter,
		_SuperExpressionEmitter: _SuperExpressionEmitter,
		_SuperExpressionEmitter$LJavaScriptEmitter$LSuperExpression$: _SuperExpressionEmitter,
		_NewExpressionEmitter: _NewExpressionEmitter,
		_NewExpressionEmitter$LJavaScriptEmitter$LNewExpression$: _NewExpressionEmitter,
		_CommaExpressionEmitter: _CommaExpressionEmitter,
		_CommaExpressionEmitter$LJavaScriptEmitter$LCommaExpression$: _CommaExpressionEmitter,
		_BootstrapBuilder: _BootstrapBuilder,
		_BootstrapBuilder$: _BootstrapBuilder,
		_ExecutableBootstrapBuilder: _ExecutableBootstrapBuilder,
		_ExecutableBootstrapBuilder$: _ExecutableBootstrapBuilder,
		_TestBootstrapBuilder: _TestBootstrapBuilder,
		_TestBootstrapBuilder$: _TestBootstrapBuilder,
		_JSEmitterStash: _JSEmitterStash,
		_JSEmitterStash$: _JSEmitterStash,
		JavaScriptEmitter: JavaScriptEmitter,
		JavaScriptEmitter$LPlatform$: JavaScriptEmitter,
		"_Util.OutputNameStash": _Util$COutputNameStash,
		"_Util.OutputNameStash$S": _Util$COutputNameStash,
		"_Namer._TryStash": _Namer$C_TryStash,
		"_Namer._TryStash$S": _Namer$C_TryStash,
		"_Namer._CatchTargetStash": _Namer$C_CatchTargetStash,
		"_Namer._CatchTargetStash$LTryStatement$": _Namer$C_CatchTargetStash,
		"_Minifier._ClassStash": _Minifier$C_ClassStash,
		"_Minifier._ClassStash$": _Minifier$C_ClassStash,
		"_Minifier._ScopeStash": _Minifier$C_ScopeStash,
		"_Minifier._ScopeStash$": _Minifier$C_ScopeStash,
		"_Minifier._LocalStash": _Minifier$C_LocalStash,
		"_Minifier._LocalStash$": _Minifier$C_LocalStash,
		"_Minifier._MinifyingNamer": _Minifier$C_MinifyingNamer,
		"_Minifier._MinifyingNamer$": _Minifier$C_MinifyingNamer
	},
	"src/platform.jsx": {
		Platform: Platform,
		Platform$: Platform
	},
	"src/jsx-command.jsx": {
		JSXCommand: JSXCommand,
		JSXCommand$: JSXCommand
	},
	"src/meta.jsx": {
		Meta: Meta,
		Meta$: Meta
	},
	"src/expression.jsx": {
		MapLiteralElement: MapLiteralElement,
		MapLiteralElement$LToken$LExpression$: MapLiteralElement,
		Expression: Expression,
		Expression$LToken$: Expression,
		Expression$LExpression$: Expression$0,
		CommaExpression: CommaExpression,
		CommaExpression$LToken$LExpression$LExpression$: CommaExpression,
		FunctionExpression: FunctionExpression,
		FunctionExpression$LToken$LMemberFunctionDefinition$: FunctionExpression,
		ThisExpression: ThisExpression,
		ThisExpression$LToken$LClassDefinition$: ThisExpression,
		MapLiteralExpression: MapLiteralExpression,
		MapLiteralExpression$LToken$ALMapLiteralElement$LType$: MapLiteralExpression,
		ArrayLiteralExpression: ArrayLiteralExpression,
		ArrayLiteralExpression$LToken$ALExpression$LType$: ArrayLiteralExpression,
		OperatorExpression: OperatorExpression,
		OperatorExpression$LToken$: OperatorExpression,
		OperatorExpression$LExpression$: OperatorExpression$0,
		NewExpression: NewExpression,
		NewExpression$LToken$LType$ALExpression$: NewExpression,
		NewExpression$LNewExpression$: NewExpression$0,
		SuperExpression: SuperExpression,
		SuperExpression$LToken$LToken$ALExpression$: SuperExpression,
		SuperExpression$LSuperExpression$: SuperExpression$0,
		CallExpression: CallExpression,
		CallExpression$LToken$LExpression$ALExpression$: CallExpression,
		CallExpression$LCallExpression$: CallExpression$0,
		ConditionalExpression: ConditionalExpression,
		ConditionalExpression$LToken$LExpression$LExpression$LExpression$: ConditionalExpression,
		ConditionalExpression$LToken$LExpression$LExpression$LExpression$LType$: ConditionalExpression$0,
		BinaryExpression: BinaryExpression,
		BinaryExpression$LToken$LExpression$LExpression$: BinaryExpression,
		ShiftExpression: ShiftExpression,
		ShiftExpression$LToken$LExpression$LExpression$: ShiftExpression,
		LogicalExpression: LogicalExpression,
		LogicalExpression$LToken$LExpression$LExpression$: LogicalExpression,
		InExpression: InExpression,
		InExpression$LToken$LExpression$LExpression$: InExpression,
		EqualityExpression: EqualityExpression,
		EqualityExpression$LToken$LExpression$LExpression$: EqualityExpression,
		BinaryNumberExpression: BinaryNumberExpression,
		BinaryNumberExpression$LToken$LExpression$LExpression$: BinaryNumberExpression,
		AssignmentExpression: AssignmentExpression,
		AssignmentExpression$LToken$LExpression$LExpression$: AssignmentExpression,
		ArrayExpression: ArrayExpression,
		ArrayExpression$LToken$LExpression$LExpression$: ArrayExpression,
		AdditiveExpression: AdditiveExpression,
		AdditiveExpression$LToken$LExpression$LExpression$: AdditiveExpression,
		UnaryExpression: UnaryExpression,
		UnaryExpression$LToken$LExpression$: UnaryExpression,
		SignExpression: SignExpression,
		SignExpression$LToken$LExpression$: SignExpression,
		TypeofExpression: TypeofExpression,
		TypeofExpression$LToken$LExpression$: TypeofExpression,
		PropertyExpression: PropertyExpression,
		PropertyExpression$LToken$LExpression$LToken$ALType$: PropertyExpression,
		PropertyExpression$LToken$LExpression$LToken$ALType$LType$: PropertyExpression$0,
		IncrementExpression: IncrementExpression,
		IncrementExpression$LToken$LExpression$: IncrementExpression,
		PreIncrementExpression: PreIncrementExpression,
		PreIncrementExpression$LToken$LExpression$: PreIncrementExpression,
		PostIncrementExpression: PostIncrementExpression,
		PostIncrementExpression$LToken$LExpression$: PostIncrementExpression,
		LogicalNotExpression: LogicalNotExpression,
		LogicalNotExpression$LToken$LExpression$: LogicalNotExpression,
		AsNoConvertExpression: AsNoConvertExpression,
		AsNoConvertExpression$LToken$LExpression$LType$: AsNoConvertExpression,
		AsExpression: AsExpression,
		AsExpression$LToken$LExpression$LType$: AsExpression,
		InstanceofExpression: InstanceofExpression,
		InstanceofExpression$LToken$LExpression$LType$: InstanceofExpression,
		BitwiseNotExpression: BitwiseNotExpression,
		BitwiseNotExpression$LToken$LExpression$: BitwiseNotExpression,
		LeafExpression: LeafExpression,
		LeafExpression$LToken$: LeafExpression,
		RegExpLiteralExpression: RegExpLiteralExpression,
		RegExpLiteralExpression$LToken$: RegExpLiteralExpression,
		RegExpLiteralExpression$LToken$LType$: RegExpLiteralExpression$0,
		StringLiteralExpression: StringLiteralExpression,
		StringLiteralExpression$LToken$: StringLiteralExpression,
		NumberLiteralExpression: NumberLiteralExpression,
		NumberLiteralExpression$LToken$: NumberLiteralExpression,
		IntegerLiteralExpression: IntegerLiteralExpression,
		IntegerLiteralExpression$LToken$: IntegerLiteralExpression,
		BooleanLiteralExpression: BooleanLiteralExpression,
		BooleanLiteralExpression$LToken$: BooleanLiteralExpression,
		NullExpression: NullExpression,
		NullExpression$LToken$LType$: NullExpression,
		ClassExpression: ClassExpression,
		ClassExpression$LToken$LType$: ClassExpression,
		LocalExpression: LocalExpression,
		LocalExpression$LToken$LLocalVariable$: LocalExpression
	},
	"src/analysis.jsx": {
		InstantiationContext: InstantiationContext,
		InstantiationContext$ALCompileError$HLType$: InstantiationContext,
		TemplateInstantiationRequest: TemplateInstantiationRequest,
		TemplateInstantiationRequest$LToken$SALType$: TemplateInstantiationRequest,
		Block: Block,
		Block$: Block,
		BlockContext: BlockContext,
		BlockContext$LLocalVariableStatuses$LBlock$: BlockContext,
		AnalysisContext: AnalysisContext,
		AnalysisContext$ALCompileError$LParser$F$LParser$LClassDefinition$LClassDefinition$$: AnalysisContext,
		Stash: Stash,
		Stash$: Stash,
		Stashable: Stashable,
		Stashable$: Stashable,
		LocalVariable: LocalVariable,
		LocalVariable$LToken$LType$: LocalVariable,
		CaughtVariable: CaughtVariable,
		CaughtVariable$LToken$LType$: CaughtVariable,
		ArgumentDeclaration: ArgumentDeclaration,
		ArgumentDeclaration$LToken$LType$: ArgumentDeclaration,
		LocalVariableStatuses: LocalVariableStatuses,
		LocalVariableStatuses$LMemberFunctionDefinition$LLocalVariableStatuses$: LocalVariableStatuses,
		LocalVariableStatuses$LLocalVariableStatuses$: LocalVariableStatuses$0,
		CompileIssue: CompileIssue,
		CompileIssue$LToken$S: CompileIssue,
		CompileIssue$SNNS: CompileIssue$0,
		CompileError: CompileError,
		CompileError$LToken$S: CompileError,
		CompileError$SNNS: CompileError$0,
		CompileWarning: CompileWarning,
		CompileWarning$LToken$S: CompileWarning,
		CompileWarning$SNNS: CompileWarning$0,
		DeprecatedWarning: DeprecatedWarning,
		DeprecatedWarning$LToken$S: DeprecatedWarning,
		DeprecatedWarning$SNNS: DeprecatedWarning$0,
		CompileNote: CompileNote,
		CompileNote$LToken$S: CompileNote,
		CompileNote$SNNS: CompileNote$0
	},
	"src/statement.jsx": {
		Statement: Statement,
		Statement$: Statement,
		LabelStatement: LabelStatement,
		LabelStatement$S: LabelStatement,
		GotoStatement: GotoStatement,
		GotoStatement$S: GotoStatement,
		InformationStatement: InformationStatement,
		InformationStatement$LToken$: InformationStatement,
		DebuggerStatement: DebuggerStatement,
		DebuggerStatement$LToken$: DebuggerStatement,
		LogStatement: LogStatement,
		LogStatement$LToken$ALExpression$: LogStatement,
		AssertStatement: AssertStatement,
		AssertStatement$LToken$LExpression$: AssertStatement,
		ThrowStatement: ThrowStatement,
		ThrowStatement$LToken$LExpression$: ThrowStatement,
		CatchStatement: CatchStatement,
		CatchStatement$LToken$LCaughtVariable$ALStatement$: CatchStatement,
		TryStatement: TryStatement,
		TryStatement$LToken$ALStatement$ALCatchStatement$ALStatement$: TryStatement,
		DefaultStatement: DefaultStatement,
		DefaultStatement$LToken$: DefaultStatement,
		CaseStatement: CaseStatement,
		CaseStatement$LToken$LExpression$: CaseStatement,
		IfStatement: IfStatement,
		IfStatement$LToken$LExpression$ALStatement$ALStatement$: IfStatement,
		LabellableStatement: LabellableStatement,
		LabellableStatement$LToken$LToken$: LabellableStatement,
		SwitchStatement: SwitchStatement,
		SwitchStatement$LToken$LToken$LExpression$ALStatement$: SwitchStatement,
		ContinuableStatement: ContinuableStatement,
		ContinuableStatement$LToken$LToken$ALStatement$: ContinuableStatement,
		WhileStatement: WhileStatement,
		WhileStatement$LToken$LToken$LExpression$ALStatement$: WhileStatement,
		ForStatement: ForStatement,
		ForStatement$LToken$LToken$LExpression$LExpression$LExpression$ALStatement$: ForStatement,
		ForInStatement: ForInStatement,
		ForInStatement$LToken$LToken$LExpression$LExpression$ALStatement$: ForInStatement,
		DoWhileStatement: DoWhileStatement,
		DoWhileStatement$LToken$LToken$LExpression$ALStatement$: DoWhileStatement,
		JumpStatement: JumpStatement,
		JumpStatement$LToken$LToken$: JumpStatement,
		ContinueStatement: ContinueStatement,
		ContinueStatement$LToken$LToken$: ContinueStatement,
		BreakStatement: BreakStatement,
		BreakStatement$LToken$LToken$: BreakStatement,
		YieldStatement: YieldStatement,
		YieldStatement$LToken$LExpression$: YieldStatement,
		ReturnStatement: ReturnStatement,
		ReturnStatement$LToken$LExpression$: ReturnStatement,
		FunctionStatement: FunctionStatement,
		FunctionStatement$LToken$LMemberFunctionDefinition$: FunctionStatement,
		UnaryExpressionStatement: UnaryExpressionStatement,
		UnaryExpressionStatement$LExpression$: UnaryExpressionStatement,
		DeleteStatement: DeleteStatement,
		DeleteStatement$LToken$LExpression$: DeleteStatement,
		ExpressionStatement: ExpressionStatement,
		ExpressionStatement$LExpression$: ExpressionStatement,
		ConstructorInvocationStatement: ConstructorInvocationStatement,
		ConstructorInvocationStatement$LToken$LType$ALExpression$: ConstructorInvocationStatement,
		ConstructorInvocationStatement$LToken$LType$ALExpression$LFunctionType$: ConstructorInvocationStatement$0
	},
	"src/emitter.jsx": {
		Emitter: Emitter,
		Emitter$: Emitter
	},
	"src/classdef.jsx": {
		TemplateDefinition: TemplateDefinition,
		TemplateDefinition$: TemplateDefinition,
		ClassDefinition: ClassDefinition,
		ClassDefinition$LToken$SNLParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$: ClassDefinition,
		MemberDefinition: MemberDefinition,
		MemberDefinition$LToken$LToken$NALMemberFunctionDefinition$LDocComment$: MemberDefinition,
		MemberVariableDefinition: MemberVariableDefinition,
		MemberVariableDefinition$LToken$LToken$NLType$LExpression$ALMemberFunctionDefinition$LDocComment$: MemberVariableDefinition,
		MemberFunctionDefinition: MemberFunctionDefinition,
		MemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: MemberFunctionDefinition,
		InstantiatedMemberFunctionDefinition: InstantiatedMemberFunctionDefinition,
		InstantiatedMemberFunctionDefinition$LToken$LToken$NLType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: InstantiatedMemberFunctionDefinition,
		TemplateFunctionDefinition: TemplateFunctionDefinition,
		TemplateFunctionDefinition$LToken$LToken$NALToken$LType$ALArgumentDeclaration$ALLocalVariable$ALStatement$ALMemberFunctionDefinition$LToken$LDocComment$: TemplateFunctionDefinition,
		TemplateClassDefinition: TemplateClassDefinition,
		TemplateClassDefinition$LToken$SNALToken$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$LDocComment$: TemplateClassDefinition,
		InstantiatedClassDefinition: InstantiatedClassDefinition,
		InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$: InstantiatedClassDefinition
	},
	"src/type.jsx": {
		Type: Type,
		Type$: Type,
		VoidType: VoidType,
		VoidType$: VoidType,
		NullType: NullType,
		NullType$: NullType,
		PrimitiveType: PrimitiveType,
		PrimitiveType$: PrimitiveType,
		BooleanType: BooleanType,
		BooleanType$: BooleanType,
		IntegerType: IntegerType,
		IntegerType$: IntegerType,
		NumberType: NumberType,
		NumberType$: NumberType,
		StringType: StringType,
		StringType$: StringType,
		VariantType: VariantType,
		VariantType$: VariantType,
		NullableType: NullableType,
		NullableType$LType$: NullableType,
		VariableLengthArgumentType: VariableLengthArgumentType,
		VariableLengthArgumentType$LType$: VariableLengthArgumentType,
		ObjectType: ObjectType,
		ObjectType$LClassDefinition$: ObjectType,
		ParsedObjectType: ParsedObjectType,
		ParsedObjectType$LQualifiedName$ALType$: ParsedObjectType,
		FunctionType: FunctionType,
		FunctionType$: FunctionType,
		FunctionChoiceType: FunctionChoiceType,
		FunctionChoiceType$ALResolvedFunctionType$: FunctionChoiceType,
		ResolvedFunctionType: ResolvedFunctionType,
		ResolvedFunctionType$LToken$LType$ALType$B: ResolvedFunctionType,
		StaticFunctionType: StaticFunctionType,
		StaticFunctionType$LToken$LType$ALType$B: StaticFunctionType,
		MemberFunctionType: MemberFunctionType,
		MemberFunctionType$LToken$LType$LType$ALType$B: MemberFunctionType
	},
	"src/parser.jsx": {
		Token: Token,
		Token$SB: Token,
		Token$SBUSNN: Token$0,
		_Lexer: _Lexer,
		_Lexer$: _Lexer,
		Import: Import,
		Import$LParser$: Import,
		Import$LToken$LToken$ALToken$: Import$0,
		WildcardImport: WildcardImport,
		WildcardImport$LToken$LToken$ALToken$SS: WildcardImport,
		QualifiedName: QualifiedName,
		QualifiedName$LToken$: QualifiedName,
		QualifiedName$LToken$LImport$: QualifiedName$0,
		QualifiedName$LToken$LParsedObjectType$: QualifiedName$1,
		ParserState: ParserState,
		ParserState$NNLDocComment$NBNNNN: ParserState,
		ClassState: ClassState,
		ClassState$LClassState$LParsedObjectType$ALToken$LParsedObjectType$ALParsedObjectType$ALParsedObjectType$NALClassDefinition$ALTemplateClassDefinition$: ClassState,
		Scope: Scope,
		Scope$LScope$ALLocalVariable$LLocalVariable$ALArgumentDeclaration$ALStatement$ALMemberFunctionDefinition$B: Scope,
		Parser: Parser,
		Parser$LToken$SLCompletionRequest$: Parser
	},
	"src/jssourcemap.jsx": {
		SourceMapper: SourceMapper,
		SourceMapper$SS: SourceMapper
	},
	"src/optimizer.jsx": {
		_Util: _Util$0,
		_Util$: _Util$0,
		Optimizer: Optimizer,
		Optimizer$: Optimizer,
		_OptimizeCommand: _OptimizeCommand,
		_OptimizeCommand$S: _OptimizeCommand,
		_FunctionOptimizeCommand: _FunctionOptimizeCommand,
		_FunctionOptimizeCommand$S: _FunctionOptimizeCommand,
		_LinkTimeOptimizationCommand: _LinkTimeOptimizationCommand,
		_LinkTimeOptimizationCommand$: _LinkTimeOptimizationCommand,
		_NoAssertCommand: _NoAssertCommand,
		_NoAssertCommand$: _NoAssertCommand,
		_NoLogCommand: _NoLogCommand,
		_NoLogCommand$: _NoLogCommand,
		_DetermineCalleeCommand: _DetermineCalleeCommand,
		_DetermineCalleeCommand$: _DetermineCalleeCommand,
		_StaticizeOptimizeCommand: _StaticizeOptimizeCommand,
		_StaticizeOptimizeCommand$: _StaticizeOptimizeCommand,
		_UnclassifyOptimizationCommand: _UnclassifyOptimizationCommand,
		_UnclassifyOptimizationCommand$: _UnclassifyOptimizationCommand,
		_FoldConstantCommand: _FoldConstantCommand,
		_FoldConstantCommand$: _FoldConstantCommand,
		_DeadCodeEliminationOptimizeCommand: _DeadCodeEliminationOptimizeCommand,
		_DeadCodeEliminationOptimizeCommand$: _DeadCodeEliminationOptimizeCommand,
		_InlineOptimizeCommand: _InlineOptimizeCommand,
		_InlineOptimizeCommand$: _InlineOptimizeCommand,
		_ReturnIfOptimizeCommand: _ReturnIfOptimizeCommand,
		_ReturnIfOptimizeCommand$: _ReturnIfOptimizeCommand,
		_LCSECachedExpression: _LCSECachedExpression,
		_LCSECachedExpression$LExpression$F$LExpression$V$: _LCSECachedExpression,
		_LCSEOptimizeCommand: _LCSEOptimizeCommand,
		_LCSEOptimizeCommand$: _LCSEOptimizeCommand,
		_UnboxOptimizeCommand: _UnboxOptimizeCommand,
		_UnboxOptimizeCommand$: _UnboxOptimizeCommand,
		_ArrayLengthOptimizeCommand: _ArrayLengthOptimizeCommand,
		_ArrayLengthOptimizeCommand$: _ArrayLengthOptimizeCommand,
		_NoDebugCommand: _NoDebugCommand,
		_NoDebugCommand$: _NoDebugCommand,
		"_LinkTimeOptimizationCommand.Stash": _LinkTimeOptimizationCommand$CStash,
		"_LinkTimeOptimizationCommand.Stash$": _LinkTimeOptimizationCommand$CStash,
		"_DetermineCalleeCommand.Stash": _DetermineCalleeCommand$CStash,
		"_DetermineCalleeCommand.Stash$": _DetermineCalleeCommand$CStash,
		"_DetermineCalleeCommand.Stash$L_DetermineCalleeCommand$CStash$": _DetermineCalleeCommand$CStash$0,
		"_UnclassifyOptimizationCommand.Stash": _UnclassifyOptimizationCommand$CStash,
		"_UnclassifyOptimizationCommand.Stash$": _UnclassifyOptimizationCommand$CStash,
		"_UnclassifyOptimizationCommand.Stash$L_UnclassifyOptimizationCommand$CStash$": _UnclassifyOptimizationCommand$CStash$0,
		"_FoldConstantCommand.Stash": _FoldConstantCommand$CStash,
		"_FoldConstantCommand.Stash$": _FoldConstantCommand$CStash,
		"_FoldConstantCommand.Stash$L_FoldConstantCommand$CStash$": _FoldConstantCommand$CStash$0,
		"_InlineOptimizeCommand.Stash": _InlineOptimizeCommand$CStash,
		"_InlineOptimizeCommand.Stash$": _InlineOptimizeCommand$CStash,
		"_InlineOptimizeCommand.Stash$L_InlineOptimizeCommand$CStash$": _InlineOptimizeCommand$CStash$0,
		"_UnboxOptimizeCommand.Stash": _UnboxOptimizeCommand$CStash,
		"_UnboxOptimizeCommand.Stash$": _UnboxOptimizeCommand$CStash,
		"_NoDebugCommand.Stash": _NoDebugCommand$CStash,
		"_NoDebugCommand.Stash$": _NoDebugCommand$CStash
	},
	"src/compiler.jsx": {
		Compiler: Compiler,
		Compiler$LPlatform$: Compiler
	},
	"src/completion.jsx": {
		CompletionRequest: CompletionRequest,
		CompletionRequest$NN: CompletionRequest,
		CompletionCandidates: CompletionCandidates,
		CompletionCandidates$: CompletionCandidates,
		KeywordCompletionCandidate: KeywordCompletionCandidate,
		KeywordCompletionCandidate$S: KeywordCompletionCandidate,
		CompletionCandidatesOfTopLevel: CompletionCandidatesOfTopLevel,
		CompletionCandidatesOfTopLevel$LParser$F$LClassDefinition$B$: CompletionCandidatesOfTopLevel,
		_CompletionCandidatesWithLocal: _CompletionCandidatesWithLocal,
		_CompletionCandidatesWithLocal$LParser$: _CompletionCandidatesWithLocal,
		_CompletionCandidatesOfNamespace: _CompletionCandidatesOfNamespace,
		_CompletionCandidatesOfNamespace$LImport$F$LClassDefinition$B$: _CompletionCandidatesOfNamespace,
		_CompletionCandidatesOfProperty: _CompletionCandidatesOfProperty,
		_CompletionCandidatesOfProperty$LExpression$: _CompletionCandidatesOfProperty
	},
	"src/doc.jsx": {
		DocCommentNode: DocCommentNode,
		DocCommentNode$: DocCommentNode,
		DocCommentParameter: DocCommentParameter,
		DocCommentParameter$LToken$: DocCommentParameter,
		DocCommentTag: DocCommentTag,
		DocCommentTag$S: DocCommentTag,
		DocComment: DocComment,
		DocComment$: DocComment,
		DocumentGenerator: DocumentGenerator,
		DocumentGenerator$LCompiler$SS: DocumentGenerator
	},
	"src/instruments.jsx": {
		_StatementTransformer: _StatementTransformer,
		_StatementTransformer$LCodeTransformer$S: _StatementTransformer,
		_ConstructorInvocationStatementTransformer: _ConstructorInvocationStatementTransformer,
		_ConstructorInvocationStatementTransformer$LCodeTransformer$LConstructorInvocationStatement$: _ConstructorInvocationStatementTransformer,
		_ExpressionStatementTransformer: _ExpressionStatementTransformer,
		_ExpressionStatementTransformer$LCodeTransformer$LExpressionStatement$: _ExpressionStatementTransformer,
		_FunctionStatementTransformer: _FunctionStatementTransformer,
		_FunctionStatementTransformer$LCodeTransformer$LFunctionStatement$: _FunctionStatementTransformer,
		_ReturnStatementTransformer: _ReturnStatementTransformer,
		_ReturnStatementTransformer$LCodeTransformer$LReturnStatement$: _ReturnStatementTransformer,
		_YieldStatementTransformer: _YieldStatementTransformer,
		_YieldStatementTransformer$LCodeTransformer$LYieldStatement$: _YieldStatementTransformer,
		_DeleteStatementTransformer: _DeleteStatementTransformer,
		_DeleteStatementTransformer$LCodeTransformer$LDeleteStatement$: _DeleteStatementTransformer,
		_BreakStatementTransformer: _BreakStatementTransformer,
		_BreakStatementTransformer$LCodeTransformer$LBreakStatement$: _BreakStatementTransformer,
		_ContinueStatementTransformer: _ContinueStatementTransformer,
		_ContinueStatementTransformer$LCodeTransformer$LContinueStatement$: _ContinueStatementTransformer,
		_LabellableStatementTransformer: _LabellableStatementTransformer,
		_LabellableStatementTransformer$LCodeTransformer$S: _LabellableStatementTransformer,
		_DoWhileStatementTransformer: _DoWhileStatementTransformer,
		_DoWhileStatementTransformer$LCodeTransformer$LDoWhileStatement$: _DoWhileStatementTransformer,
		_ForInStatementTransformer: _ForInStatementTransformer,
		_ForInStatementTransformer$LCodeTransformer$LForInStatement$: _ForInStatementTransformer,
		_ForStatementTransformer: _ForStatementTransformer,
		_ForStatementTransformer$LCodeTransformer$LForStatement$: _ForStatementTransformer,
		_IfStatementTransformer: _IfStatementTransformer,
		_IfStatementTransformer$LCodeTransformer$LIfStatement$: _IfStatementTransformer,
		_SwitchStatementTransformer: _SwitchStatementTransformer,
		_SwitchStatementTransformer$LCodeTransformer$LSwitchStatement$: _SwitchStatementTransformer,
		_CaseStatementTransformer: _CaseStatementTransformer,
		_CaseStatementTransformer$LCodeTransformer$LCaseStatement$: _CaseStatementTransformer,
		_DefaultStatementTransformer: _DefaultStatementTransformer,
		_DefaultStatementTransformer$LCodeTransformer$LDefaultStatement$: _DefaultStatementTransformer,
		_WhileStatementTransformer: _WhileStatementTransformer,
		_WhileStatementTransformer$LCodeTransformer$LWhileStatement$: _WhileStatementTransformer,
		_TryStatementTransformer: _TryStatementTransformer,
		_TryStatementTransformer$LCodeTransformer$LTryStatement$: _TryStatementTransformer,
		_CatchStatementTransformer: _CatchStatementTransformer,
		_CatchStatementTransformer$LCodeTransformer$LCatchStatement$: _CatchStatementTransformer,
		_ThrowStatementTransformer: _ThrowStatementTransformer,
		_ThrowStatementTransformer$LCodeTransformer$LThrowStatement$: _ThrowStatementTransformer,
		_AssertStatementTransformer: _AssertStatementTransformer,
		_AssertStatementTransformer$LCodeTransformer$LAssertStatement$: _AssertStatementTransformer,
		_LogStatementTransformer: _LogStatementTransformer,
		_LogStatementTransformer$LCodeTransformer$LLogStatement$: _LogStatementTransformer,
		_DebuggerStatementTransformer: _DebuggerStatementTransformer,
		_DebuggerStatementTransformer$LCodeTransformer$LDebuggerStatement$: _DebuggerStatementTransformer,
		CodeTransformer: CodeTransformer,
		CodeTransformer$: CodeTransformer
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
	if (! module._Main.main) {
		throw new ReferenceError("entry point _Main.main(:string[]):void not found in " + sourceFile);
	}
	module._Main.main(args);
};

/**
 * launches _Test#test*():void invoked by jsx --test
 */
JSX.runTests = function (sourceFile, tests) {
	var module = JSX.require(sourceFile);
	var testClass = module._Test;

	if (!testClass) return; // skip if there's no test class

	if(tests.length === 0) {
		var p = testClass.prototype;
		for (var m in p) {
			if (p[m] instanceof Function && m.match(/^test\w+$/)) {
				tests.push(m);
			}
		}
	}

	var testCase = new testClass();

	if (testCase.beforeClass != null)
		testCase.beforeClass(tests);

	for (var i = 0; i < tests.length; ++i) {
		(function (method) {
			if (method in testCase) {
				testCase.run(method, function() { testCase[method](); });
			}
			else {
				throw new ReferenceError("No such test method: " + method);
			}
		}(tests[i]));
	}

	if (testCase.afterClass != null)
		testCase.afterClass();
};
JSX.runMain("src/jsx-node-front.jsx", process.argv.slice(2))
})(JSX);
