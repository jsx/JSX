#!/usr/bin/env node
// generatedy by JSX compiler 0.9.89 (2014-05-20 12:19:39 +0900; 0173307ab02abcc6cefc8c54be988ca9909b190e)
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

var $__jsx_imul = Math.imul;
if (typeof $__jsx_imul === "undefined") {
	$__jsx_imul = function (a, b) {
		var ah  = (a >>> 16) & 0xffff;
		var al = a & 0xffff;
		var bh  = (b >>> 16) & 0xffff;
		var bl = b & 0xffff;
		return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
	};
}

/**
 * fused int-ops with side-effects
 */
function $__jsx_ipadd(o, p, r) {
	return o[p] = (o[p] + r) | 0;
}
function $__jsx_ipsub(o, p, r) {
	return o[p] = (o[p] - r) | 0;
}
function $__jsx_ipmul(o, p, r) {
	return o[p] = $__jsx_imul(o[p], r);
}
function $__jsx_ipdiv(o, p, r) {
	return o[p] = (o[p] / r) | 0;
}
function $__jsx_ipmod(o, p, r) {
	return o[p] = (o[p] % r) | 0;
}
function $__jsx_ippostinc(o, p) {
	var v = o[p];
	o[p] = (v + 1) | 0;
	return v;
}
function $__jsx_ippostdec(o, p) {
	var v = o[p];
	o[p] = (v - 1) | 0;
	return v;
}

/**
 * non-inlined version of Array#each
 */
function $__jsx_forEach(o, f) {
	var l = o.length;
	for (var i = 0; i < l; ++i)
		f(o[i]);
}

/*
 * global functions, renamed to avoid conflict with local variable names
 */
var $__jsx_parseInt = parseInt;
var $__jsx_parseFloat = parseFloat;
function $__jsx_isNaN(n) { return n !== n; }
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
var GeneratorFunction$0 = 
(function () {
  try {
    return Function('import {GeneratorFunction} from "std:iteration"; return GeneratorFunction')();
  } catch (e) {
    return function GeneratorFunction () {};
  }
})();
var __jsx_generator_object$0 = 
(function () {
  function __jsx_generator_object() {
  	this.__next = 0;
  	this.__loop = null;
	this.__seed = null;
  	this.__value = undefined;
  	this.__status = 0;	// SUSPENDED: 0, ACTIVE: 1, DEAD: 2
  }

  __jsx_generator_object.prototype.next = function (seed) {
  	switch (this.__status) {
  	case 0:
  		this.__status = 1;
  		this.__seed = seed;

  		// go next!
  		this.__loop(this.__next);

  		var done = false;
  		if (this.__next != -1) {
  			this.__status = 0;
  		} else {
  			this.__status = 2;
  			done = true;
  		}
  		return { value: this.__value, done: done };
  	case 1:
  		throw new Error("Generator is already running");
  	case 2:
  		throw new Error("Generator is already finished");
  	default:
  		throw new Error("Unexpected generator internal state");
  	}
  };

  return __jsx_generator_object;
}());
function _Main() {
};

$__jsx_extend([_Main], Object);
function _Main$main$AS(args) {
	var exitCode;
	var stdoutIsFlushed;
	var stderrIsFlushed;
	var exitIfFlushed;
	exitCode = JSXCommand$main$LPlatform$AS(new NodePlatform(), NodePlatform$getEnvOpts$().concat(args));
	if (JSX.profilerIsRunning()) {
		Timer$setTimeout$F$V$N((function () {
			JSX.postProfileResults("http://localhost:2012/post-profile", (function (err, result) {
			}));
		}), 0);
	}
	if (exitCode === 0) {
		return;
	}
	stdoutIsFlushed = process.stdout.write("");
	stderrIsFlushed = process.stderr.write("");
	exitIfFlushed = (function (data) {
		if (stdoutIsFlushed && stderrIsFlushed) {
			process.exit((exitCode | 0));
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

var js$0 = (function () {
	var global = Function("return this")();
	return {
		global: global,
		eval: global.eval,
		invoke: function(invocant, methodName, args) {
			return invocant[methodName].apply(invocant, args);
		},
		newFunction: Function
	};
}());
function node() {}
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
	return js$0.global.setTimeout(callback, intervalMS);
};

Timer.setTimeout$F$V$N = Timer$setTimeout$F$V$N;

function Timer$clearTimeout$LTimerHandle$(timer) {
	js$0.global.clearTimeout(timer);
};

Timer.clearTimeout$LTimerHandle$ = Timer$clearTimeout$LTimerHandle$;

function Timer$setInterval$F$V$N(callback, intervalMS) {
	return js$0.global.setInterval(callback, intervalMS);
};

Timer.setInterval$F$V$N = Timer$setInterval$F$V$N;

function Timer$clearInterval$LTimerHandle$(timer) {
	js$0.global.clearInterval(timer);
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
	var prefixes;
	var i;
	var name;
	var lastTime;
	if (useNativeImpl) {
		prefixes = [ "r", "webkitR", "mozR", "oR", "msR" ];
		for (i = 0; i < prefixes.length; ++i) {
			name = prefixes[i] + "equestAnimationFrame";
			if (js$0.global[name] instanceof Function) {
				return (function (callback) {
					return js$0.global[name](callback);
				});
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
	var prefixes;
	var i;
	var name;
	if (useNativeImpl) {
		prefixes = [ "c", "webkitC", "mozC", "oC", "msC" ];
		for (i = 0; i < prefixes.length; ++i) {
			name = prefixes[i] + "ancelAnimationFrame";
			if (js$0.global[name] instanceof Function) {
				return (function (timer) {
					js$0.global[name](timer);
				});
			}
		}
	}
	return Timer$clearTimeout$LTimerHandle$;
};

Timer._getCancelAnimationFrameImpl$B = Timer$_getCancelAnimationFrameImpl$B;

function TimerHandle() {}
$__jsx_extend([TimerHandle], Object);
function Util() {
};

$__jsx_extend([Util], Object);
function Util$repeat$SN(c, n) {
	var s;
	var i;
	s = "";
	for (i = 0; i < n; ++i) {
		s += c;
	}
	return s;
};

Util.repeat$SN = Util$repeat$SN;

function Util$format$SAS(fmt, args) {
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

function Util$ld$SS(a, b) {
	var m;
	var i;
	var j;
	var diff;
	var x;
	m = [];
	for (i = 0; i <= a.length; ++i) {
		m[i] = [ i ];
	}
	for (j = 0; j <= b.length; ++j) {
		m[0][j] = j;
	}
	for (i = 1; i <= a.length; ++i) {
		for (j = 1; j <= b.length; ++j) {
			diff = (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1);
			m[i][j] = Math.min(m[i - 1][j - 1] + diff, m[i - 1][j] + 1, m[i][j - 1] + 1);
		}
	}
	x = m[m.length - 1];
	return x[x.length - 1];
};

Util.ld$SS = Util$ld$SS;

function Util$isBuiltInClass$S(name) {
	return $__jsx_ObjectHasOwnProperty.call(Util._builtInClass, name);
};

Util.isBuiltInClass$S = Util$isBuiltInClass$S;

function Util$isBuiltInClass$LType$(type) {
	return Util$_isBuiltInObjectType$LType$HB(type, Util._builtInClass);
};

Util.isBuiltInClass$LType$ = Util$isBuiltInClass$LType$;

function Util$isBuiltInContainer$LType$(type) {
	return Util$_isBuiltInObjectType$LType$HB(type, Util._builtInContainer);
};

Util.isBuiltInContainer$LType$ = Util$isBuiltInContainer$LType$;

function Util$_isBuiltInObjectType$LType$HB(type, classeSet) {
	var classDef;
	var className;
	if (type instanceof ObjectType) {
		classDef = type.getClassDef$();
		className = (classDef instanceof InstantiatedClassDefinition ? classDef.getTemplateClassName$() : classDef.className$());
		return $__jsx_ObjectHasOwnProperty.call(classeSet, className);
	}
	return false;
};

Util._isBuiltInObjectType$LType$HB = Util$_isBuiltInObjectType$LType$HB;

function Util$rootIsNativeClass$LType$(type) {
	var classDef;
	if (type instanceof ObjectType) {
		classDef = type.getClassDef$();
		return ! classDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			if (classDef.className$() === "Object" || (classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
				return true;
			}
			return false;
		}));
	}
	return false;
};

Util.rootIsNativeClass$LType$ = Util$rootIsNativeClass$LType$;

function Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, token, className, typeArguments) {
	return context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(token, className, typeArguments), context.postInstantiationCallback);
};

Util.instantiateTemplate$LAnalysisContext$LToken$SALType$ = Util$instantiateTemplate$LAnalysisContext$LToken$SALType$;

function Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$(context, args, parentExpr, expectedTypes) {
	var argTypes;
	var i;
	var funcDef;
	var expectedCallbackType;
	var j;
	var callbackType;
	var typeNotContainsParameter;
	var k;
	var argType;
	var arrayExpr;
	var expectedArrayType;
	var mapExpr;
	var expectedMapType;
	argTypes = [  ];
	for (i = 0; i < args.length; ++i) {
		if (args[i] instanceof FunctionExpression && ! args[i].argumentTypesAreIdentified$()) {
			funcDef = args[i].getFuncDef$();
			expectedCallbackType = null;
			for (j = 0; j < expectedTypes.length; ++j) {
				if (expectedTypes[j].at$I((i | 0)) != null && expectedTypes[j].at$I((i | 0)) instanceof StaticFunctionType && expectedTypes[j].at$I((i | 0)).getArgumentTypes$().length === funcDef.getArguments$().length) {
					callbackType = expectedTypes[j].at$I((i | 0))._clone$();
					function typeNotContainsParameter(type) {
						var k;
						for (k = 0; k < expectedTypes[j].typeArgs.length; ++k) {
							if (type instanceof ParsedObjectType && type.getQualifiedName$().getImport$() == null && type.getQualifiedName$().getEnclosingType$() == null && type.getToken$().getValue$() === expectedTypes[j].typeArgs[k].getValue$()) {
								return false;
							}
						}
						return type.forEachType$F$LType$B$(typeNotContainsParameter);
					}
					for (k = 0; k < callbackType.getArgumentTypes$().length; ++k) {
						argType = callbackType.getArgumentTypes$()[k];
						if (! typeNotContainsParameter(argType)) {
							callbackType.getArgumentTypes$()[k] = null;
						}
					}
					if (callbackType.getReturnType$() != null && ! typeNotContainsParameter(callbackType.getReturnType$())) {
						callbackType._returnType = null;
					}
					if (expectedCallbackType == null) {
						expectedCallbackType = callbackType;
					} else if (Util$typesAreEqual$ALType$ALType$(expectedCallbackType.getArgumentTypes$(), callbackType.getArgumentTypes$()) && (expectedCallbackType.getReturnType$() == null && callbackType.getReturnType$() == null || expectedCallbackType.getReturnType$().equals$LType$(callbackType.getReturnType$()))) {
					} else {
						break;
					}
				}
			}
			if (j !== expectedTypes.length) {
			} else if (expectedCallbackType != null) {
				if (! args[i].deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, expectedCallbackType)) {
					return null;
				}
			}
		} else if (args[i] instanceof ArrayLiteralExpression) {
			arrayExpr = args[i];
			expectedArrayType = null;
			for (j = 0; j < expectedTypes.length; ++j) {
				if (expectedTypes[j].at$I((i | 0)) != null && expectedTypes[j].at$I((i | 0)) instanceof ObjectType && expectedTypes[j].at$I((i | 0)).getClassDef$() instanceof InstantiatedClassDefinition && expectedTypes[j].at$I((i | 0)).getClassDef$().getTemplateClassName$() === 'Array') {
					if (expectedArrayType == null) {
						expectedArrayType = expectedTypes[j].at$I((i | 0));
					} else if (expectedArrayType.equals$LType$(expectedTypes[j].at$I((i | 0)))) {
					} else {
						break;
					}
				}
			}
			if (j !== expectedTypes.length) {
			} else if (expectedArrayType != null) {
				arrayExpr.setType$LType$(expectedArrayType);
			}
		} else if (args[i] instanceof MapLiteralExpression) {
			mapExpr = args[i];
			expectedMapType = null;
			for (j = 0; j < expectedTypes.length; ++j) {
				if (expectedTypes[j].at$I((i | 0)) != null && expectedTypes[j].at$I((i | 0)) instanceof ObjectType && expectedTypes[j].at$I((i | 0)).getClassDef$() instanceof InstantiatedClassDefinition && expectedTypes[j].at$I((i | 0)).getClassDef$().getTemplateClassName$() === 'Map') {
					if (expectedMapType == null) {
						expectedMapType = expectedTypes[j].at$I((i | 0));
					} else if (expectedMapType.equals$LType$(expectedTypes[j].at$I((i | 0)))) {
					} else {
						break;
					}
				}
			}
			if (j !== expectedTypes.length) {
			} else if (expectedMapType != null) {
				mapExpr.setType$LType$(expectedMapType);
			}
		}
		if (! args[i].analyze$LAnalysisContext$LExpression$(context, parentExpr)) {
			return null;
		}
		argTypes[i] = args[i].getType$();
	}
	return argTypes;
};

Util.analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$ = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$;

function Util$typesAreEqual$ALType$ALType$(x, y) {
	var i;
	if (x.length !== y.length) {
		return false;
	}
	for (i = 0; i < x.length; ++i) {
		if (x[i] == null || y[i] == null) {
			continue;
		}
		if (! x[i].equals$LType$(y[i])) {
			return false;
		}
	}
	return true;
};

Util.typesAreEqual$ALType$ALType$ = Util$typesAreEqual$ALType$ALType$;

function Util$forEachStatement$F$LStatement$B$ALStatement$(cb, statements) {
	return Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$((function (stmt, _) {
		return cb(stmt);
	}), statements);
};

Util.forEachStatement$F$LStatement$B$ALStatement$ = Util$forEachStatement$F$LStatement$B$ALStatement$;

function Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, statements) {
	var i;
	if (statements != null) {
		for (i = 0; i < statements.length; ++i) {
			if (! cb(statements[i], (function (statements, index) {
				return (function (stmt) {
					statements[index] = stmt;
				});
			})(statements, i))) {
				return false;
			}
		}
	}
	return true;
};

Util.forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$ = Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$;

function Util$forEachExpression$F$LExpression$B$ALExpression$(cb, exprs) {
	return Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$((function (expr, _) {
		return cb(expr);
	}), exprs);
};

Util.forEachExpression$F$LExpression$B$ALExpression$ = Util$forEachExpression$F$LExpression$B$ALExpression$;

function Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(cb, exprs) {
	var i;
	if (exprs != null) {
		for (i = 0; i < exprs.length; ++i) {
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
	return Util$memberRootIsNative$LClassDefinition$SALType$B(baseExpr.getType$().getClassDef$(), expr.getIdentifierToken$().getValue$(), Util$isReferringToFunctionDefinition$LPropertyExpression$(expr) ? expr.getType$().getArgumentTypes$() : null, baseExpr.isClassSpecifier$());
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
	literal = Util$_normalizeHeredoc$S(literal);
	matched = literal.match(/^([\'\"]).*([\'\"])$/);
	if (matched == null || matched[1] !== matched[2]) {
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
		case "x":
			matched = src.substring(pos).match(/^([0-9A-Fa-f]{2})/);
			if (matched == null) {
				throw new Error("expected two hexdigits after \\x: " + literal);
			}
			decoded += String.fromCharCode($__jsx_parseInt(matched[1], 16));
			pos += 2;
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

function Util$_normalizeHeredoc$S(literal) {
	var body;
	if (! literal.match(/^(?:"""|''')/)) {
		return literal;
	}
	body = literal.substring(3, literal.length - 3);
	body = body.replace(/\\*['"]/g, (function (matched) {
		return (matched.length % 2 === 0 ? matched : matched.replace(/(.)$/, "\\$1"));
	}));
	body = body.replace(/\n/g, "\\n");
	return '"' + body + '"';
};

Util._normalizeHeredoc$S = Util$_normalizeHeredoc$S;

function Util$_resolvedPathParts$S(path) {
	var tokens;
	var i;
	tokens = path.split(/[\\\/]+/);
	if (tokens.length === 1) {
		return tokens;
	}
	for (i = 0; i < tokens.length; ) {
		if (tokens[i] === ".") {
			tokens.splice(i, 1);
		} else if (tokens[i] === ".." && i !== 0 && tokens[i - 1] !== "..") {
			tokens.splice(i - 1, 2);
			i -= 1;
		} else {
			i++;
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
	if (f[0] === "") {
		f.shift();
	}
	if (t[0] === "") {
		t.shift();
	}
	minLen = Math.min(f.length, t.length);
	samePartsIndex = minLen;
	for (i = 0; i < minLen; ++i) {
		if (f[i] !== t[i]) {
			samePartsIndex = i;
			break;
		}
	}
	pathParts = [];
	for (i = samePartsIndex; i < f.length; ++i) {
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

function Util$asSet$AS(array) {
	var set;
	var i;
	set = {};
	for (i = 0; i < array.length; ++i) {
		set[array[i]] = true;
	}
	return set;
};

Util.asSet$AS = Util$asSet$AS;

function Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(srcParent, dstParent) {
	var closures;
	var i;
	closures = [];
	dstParent.forEachStatement$F$LStatement$B$((function (statement) {
		if (statement instanceof FunctionStatement) {
			closures.push(statement.getFuncDef$());
		}
		return statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			if (expr instanceof FunctionExpression) {
				closures.push(expr.getFuncDef$());
				return true;
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}));
	}));
	for (i = 0; i < closures.length; ++i) {
		Util$unlinkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(closures[i], srcParent);
		Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(closures[i], dstParent);
	}
};

Util.rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$ = Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$;

function Util$unlinkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(funcDef, oldParent) {
	var j;
	if ((j = oldParent.getClosures$().indexOf(funcDef)) !== - 1) {
		oldParent.getClosures$().splice(j, 1);
	}
	funcDef.setParent$LMemberFunctionDefinition$(null);
};

Util.unlinkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$ = Util$unlinkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$;

function Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(funcDef, newParent) {
	newParent.getClosures$().push(funcDef);
	funcDef.setParent$LMemberFunctionDefinition$(newParent);
	funcDef.setClassDef$LClassDefinition$(newParent.getClassDef$());
};

Util.linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$ = Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$;

function Util$cloneArray$ALExpression$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Util.cloneArray$ALExpression$ = Util$cloneArray$ALExpression$;

function Util$serializeArray$ALExpression$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALExpression$ = Util$serializeArray$ALExpression$;

function Util$serializeNullable$LType$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Util.serializeNullable$LType$ = Util$serializeNullable$LType$;

function Util$serializeArray$ALMapLiteralElement$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALMapLiteralElement$ = Util$serializeArray$ALMapLiteralElement$;

function Util$serializeNullable$LExpression$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Util.serializeNullable$LExpression$ = Util$serializeNullable$LExpression$;

function Util$cloneNullable$LExpression$(o) {
	return (o == null ? null : o.clone$());
};

Util.cloneNullable$LExpression$ = Util$cloneNullable$LExpression$;

function Util$serializeNullable$LToken$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Util.serializeNullable$LToken$ = Util$serializeNullable$LToken$;

function Util$cloneArray$ALStatement$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Util.cloneArray$ALStatement$ = Util$cloneArray$ALStatement$;

function Util$serializeArray$ALStatement$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALStatement$ = Util$serializeArray$ALStatement$;

function Util$cloneArray$ALCatchStatement$(a) {
	var r;
	var i;
	r = [  ];
	for (i = 0; i < a.length; ++i) {
		r[i] = a[i].clone$();
	}
	return r;
};

Util.cloneArray$ALCatchStatement$ = Util$cloneArray$ALCatchStatement$;

function Util$serializeArray$ALCatchStatement$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALCatchStatement$ = Util$serializeArray$ALCatchStatement$;

function Util$serializeNullable$LParsedObjectType$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Util.serializeNullable$LParsedObjectType$ = Util$serializeNullable$LParsedObjectType$;

function Util$serializeArray$ALParsedObjectType$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALParsedObjectType$ = Util$serializeArray$ALParsedObjectType$;

function Util$serializeArray$ALMemberDefinition$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALMemberDefinition$ = Util$serializeArray$ALMemberDefinition$;

function Util$serializeArray$ALClassDefinition$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALClassDefinition$ = Util$serializeArray$ALClassDefinition$;

function Util$serializeArray$ALTemplateClassDefinition$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALTemplateClassDefinition$ = Util$serializeArray$ALTemplateClassDefinition$;

function Util$serializeArray$ALArgumentDeclaration$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALArgumentDeclaration$ = Util$serializeArray$ALArgumentDeclaration$;

function Util$serializeArray$ALLocalVariable$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALLocalVariable$ = Util$serializeArray$ALLocalVariable$;

function Util$serializeArray$ALToken$(a) {
	var ret;
	var i;
	if (a == null) {
		return null;
	}
	ret = [  ];
	for (i = 0; i < a.length; ++i) {
		ret[i] = a[i].serialize$();
	}
	return ret;
};

Util.serializeArray$ALToken$ = Util$serializeArray$ALToken$;

function Util$serializeNullable$LImport$(v) {
	if (v == null) {
		return null;
	}
	return v.serialize$();
};

Util.serializeNullable$LImport$ = Util$serializeNullable$LImport$;

function Util$makePair$LAssignmentExpression$F$LExpression$V$(first, second) {
	return new Pair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E(first, second);
};

Util.makePair$LAssignmentExpression$F$LExpression$V$ = Util$makePair$LAssignmentExpression$F$LExpression$V$;

function TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E() {
	var $this = this;
	TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E, TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E$0], Object);
TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.has$ALType$ = function (key) {
	var $this = this;
	return ! this.forEach$F$ALType$LMemberFunctionDefinition$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.set$ALType$LMemberFunctionDefinition$ = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E(key, val));
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.get$ALType$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.delete$ALType$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.forEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E.prototype.reversedForEach$F$ALType$LMemberFunctionDefinition$B$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; --i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E], Object);
function TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E() {
	var $this = this;
	TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E, TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E$0], Object);
TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$BB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.set$LLocalVariable$B = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$x2E$x3CLocalVariable$x2Cboolean$x3E(key, val));
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.get$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.delete$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.forEach$F$LLocalVariable$BB$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E.prototype.reversedForEach$F$LLocalVariable$BB$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; --i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$x2E$x3CLocalVariable$x2Cboolean$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CLocalVariable$x2Cboolean$x3E], Object);
function TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E() {
	var $this = this;
	TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E, TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E$0], Object);
TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$LExpression$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.set$LLocalVariable$LExpression$ = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$x2E$x3CLocalVariable$x2CExpression$x3E(key, val));
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.get$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.delete$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.forEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E.prototype.reversedForEach$F$LLocalVariable$LExpression$B$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; --i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$x2E$x3CLocalVariable$x2CExpression$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CLocalVariable$x2CExpression$x3E], Object);
function Pair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E], Object);
function TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E() {
	var $this = this;
	TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E, TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E$0], Object);
TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.has$LLocalVariable$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LLocalVariable$LPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$B$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.set$LLocalVariable$LPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$ = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E(key, val));
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.get$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.delete$LLocalVariable$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.forEach$F$LLocalVariable$LPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$B$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E.prototype.reversedForEach$F$LLocalVariable$LPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$B$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; --i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E], Object);
function TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E() {
	var $this = this;
	TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E$0.call(this, (function (x, y) {
		return x == y;
	}));
};

function TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E$0(equalsCallback) {
	this._list = [];
	this._equalsCallback = equalsCallback;
};

$__jsx_extend([TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E, TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E$0], Object);
TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.clone$ = function () {
	var x;
	x = new TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E$0(this._equalsCallback);
	x._list = this._list.concat([  ]);
	return x;
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.has$LClassDefinition$ = function (key) {
	var $this = this;
	return ! this.forEach$F$LClassDefinition$SB$((function (entryKey, entryValue) {
		return ! $this._equalsCallback(key, entryKey);
	}));
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.set$LClassDefinition$S = function (key, val) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list[i].second = val;
			return;
		}
	}
	this._list.push(new Pair$x2E$x3CClassDefinition$x2Cstring$x3E(key, val));
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.get$LClassDefinition$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			return this._list[i].second;
		}
	}
	return null;
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.delete$LClassDefinition$ = function (key) {
	var i;
	for (i = 0; i < this._list.length; ++i) {
		if (this._equalsCallback(this._list[i].first, key)) {
			this._list.splice(i, 1);
			return;
		}
	}
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.clear$ = function () {
	this._list.splice(0, this._list.length);
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.forEach$F$LClassDefinition$SB$ = function (cb) {
	var i;
	var e;
	for (i = 0; i < this._list.length; ++i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E.prototype.reversedForEach$F$LClassDefinition$SB$ = function (cb) {
	var i;
	var e;
	for (i = this._list.length - 1; i >= 0; --i) {
		e = this._list[i];
		if (! cb(e.first, e.second)) {
			return false;
		}
	}
	return true;
};


function Pair$x2E$x3CClassDefinition$x2Cstring$x3E(first, second) {
	this.first = first;
	this.second = second;
};

$__jsx_extend([Pair$x2E$x3CClassDefinition$x2Cstring$x3E], Object);
function _Util() {
};

$__jsx_extend([_Util], Object);
function _Util$getOutputClassName$LClassDefinition$(classDef) {
	var stash;
	stash = classDef.getStash$S(_Util.OUTPUTNAME_IDENTIFIER);
	return stash.outputName;
};

_Util.getOutputClassName$LClassDefinition$ = _Util$getOutputClassName$LClassDefinition$;

function _Util$getOutputConstructorName$LClassDefinition$ALType$(classDef, argTypes) {
	var ctor;
	var stash;
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return _Util$getNameOfNativeConstructor$LClassDefinition$(classDef);
	}
	ctor = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, "constructor", argTypes, false);
	stash = ctor.getStash$S(_Util.OUTPUTNAME_IDENTIFIER);
	return stash.outputName;
};

_Util.getOutputConstructorName$LClassDefinition$ALType$ = _Util$getOutputConstructorName$LClassDefinition$ALType$;

function _Util$getNameOfNativeConstructor$LClassDefinition$(classDef) {
	if (classDef.getNativeSource$() != null || classDef.getOuterClassDef$() != null) {
		return _Util$getOutputClassName$LClassDefinition$(classDef);
	}
	if (classDef instanceof InstantiatedClassDefinition) {
		if (classDef.getTemplateClass$().getNativeSource$() != null) {
			return _Util$getOutputClassName$LClassDefinition$(classDef.getTemplateClass$());
		}
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
	var escapeClassName;
	var countByName;
	var newUniqueName;
	var i;
	var classDef;
	var className;
	var ctors;
	var j;
	var exportedCtor;
	var n;
	var instantiated;
	function setOutputName(stashable, name) {
		stashable.setStash$SLStash$(_Util.OUTPUTNAME_IDENTIFIER, new _Util$x2EOutputNameStash(name));
	}
	function escapeClassName(name) {
		return name.replace(/[^A-Za-z0-9_\$]/g, (function (matched) {
			return "$x" + matched.charCodeAt(0).toString(16).toUpperCase();
		}));
	}
	countByName = {};
	function newUniqueName(className) {
		var name;
		if (countByName[className]) {
			name = className + "$" + (countByName[className] - 1 + "");
			++countByName[className];
		} else {
			name = className;
			countByName[className] = 1;
		}
		return escapeClassName(name);
	}
	for (i = 0; i < classDefs.length; ++i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			className = classDef.className$();
			if (! $__jsx_ObjectHasOwnProperty.call(countByName, className)) {
				setOutputName(classDef, escapeClassName(className));
				countByName[className] = 1;
			}
		}
	}
	for (i = 0; i < classDefs.length; ++i) {
		classDef = classDefs[i];
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) === 0) {
			className = classDef.classFullName$();
			ctors = _Util$findFunctions$LClassDefinition$SB(classDef, "constructor", false);
			if (ctors.length !== 0) {
				for (j = 0; j < ctors.length; ++j) {
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
				for (j = 1; j < ctors.length; ++j) {
					setOutputName(ctors[j], newUniqueName(className));
				}
			} else {
				setOutputName(classDef, newUniqueName(className));
			}
		} else if (classDef.getOuterClassDef$() != null) {
			className = _Util$getOutputClassName$LClassDefinition$(classDef.getOuterClassDef$()) + "." + classDef.className$();
			setOutputName(classDef, className);
		} else if (classDef.getNativeSource$() != null) {
			setOutputName(classDef, newUniqueName(classDef.classFullName$()));
		} else if (classDef instanceof InstantiatedClassDefinition) {
			instantiated = classDef;
			className = instantiated.getTemplateClassName$() + newUniqueName(".<" + instantiated.getTypeArguments$().map((function (type) {
				return type.toString();
			})).join(",") + ">");
			setOutputName(classDef, escapeClassName(className));
		} else {
			setOutputName(classDef, escapeClassName(classDef.classFullName$()));
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
	for (i = 0; i < members.length; ++i) {
		member = members[i];
		if (member instanceof MemberFunctionDefinition && member.name$() === name && (member.flags$() & ClassDefinition.IS_STATIC) === (isStatic ? ClassDefinition.IS_STATIC : 0)) {
			functions.push(member);
		}
	}
	return functions;
};

_Util.findFunctions$LClassDefinition$SB = _Util$findFunctions$LClassDefinition$SB;

function _Util$nameIsValidAsProperty$S(name) {
	return /^[\$_A-Za-z][\$_0-9A-Za-z]*$/.test(name) && ! _Util$isECMA262Reserved$S(name);
};

_Util.nameIsValidAsProperty$S = _Util$nameIsValidAsProperty$S;

function _Util$isECMA262Reserved$S(word) {
	return $__jsx_ObjectHasOwnProperty.call(_Util._ecma262reserved, word);
};

_Util.isECMA262Reserved$S = _Util$isECMA262Reserved$S;

function _Util$getECMA262ReservedWords$() {
	return Object.keys(_Util._ecma262reserved);
};

_Util.getECMA262ReservedWords$ = _Util$getECMA262ReservedWords$;

function _Util$getECMA262NumberLiteral$LNumberLiteralExpression$(expr) {
	if (expr.tokenIsECMA262Conformant$()) {
		return expr.getToken$().getValue$();
	} else {
		return expr.getDecoded$() + "";
	}
};

_Util.getECMA262NumberLiteral$LNumberLiteralExpression$ = _Util$getECMA262NumberLiteral$LNumberLiteralExpression$;

function _Util$getECMA262StringLiteral$LStringLiteralExpression$(expr) {
	if (expr.tokenIsECMA262Conformant$()) {
		return expr.getToken$().getValue$();
	} else {
		return Util$encodeStringLiteral$S(expr.getDecoded$());
	}
};

_Util.getECMA262StringLiteral$LStringLiteralExpression$ = _Util$getECMA262StringLiteral$LStringLiteralExpression$;

function _Util$isArrayType$LType$(type) {
	return type.getClassDef$() instanceof InstantiatedClassDefinition && type.getClassDef$().getTemplateClassName$() === "Array";
};

_Util.isArrayType$LType$ = _Util$isArrayType$LType$;

function _Util$emitWithPrecedence$LJavaScriptEmitter$NNF$V$(emitter, outerOpPrecedence, precedence, callback) {
	if (precedence > outerOpPrecedence) {
		emitter._emit$SLToken$("(", null);
		callback();
		emitter._emit$SLToken$(")", null);
	} else {
		callback();
	}
};

_Util.emitWithPrecedence$LJavaScriptEmitter$NNF$V$ = _Util$emitWithPrecedence$LJavaScriptEmitter$NNF$V$;

function _Util$emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N(emitter, helperFunc, expr, otherExprEmitter, outerOpPrecedence) {
	var propertyExpr;
	var name;
	var classDef;
	emitter._emit$SLToken$(helperFunc + "(", expr.getToken$());
	if (expr instanceof PropertyExpression) {
		propertyExpr = expr;
		emitter._getExpressionEmitterFor$LExpression$(propertyExpr.getExpr$()).emit$N(0);
		emitter._emit$SLToken$(", ", expr.getToken$());
		if (propertyExpr.getExpr$().isClassSpecifier$()) {
			classDef = propertyExpr.getHolderType$().getClassDef$();
			name = emitter.getNamer$().getNameOfStaticVariable$LClassDefinition$S(classDef, propertyExpr.getIdentifierToken$().getValue$());
		} else {
			name = emitter.getNamer$().getNameOfProperty$LClassDefinition$S(propertyExpr.getHolderType$().getClassDef$(), propertyExpr.getIdentifierToken$().getValue$());
		}
		emitter._emit$SLToken$(Util$encodeStringLiteral$S(name), propertyExpr.getIdentifierToken$());
	} else {
		emitter._getExpressionEmitterFor$LExpression$(expr.getFirstExpr$()).emit$N(0);
		emitter._emit$SLToken$(", ", expr.getToken$());
		emitter._getExpressionEmitterFor$LExpression$(expr.getSecondExpr$()).emit$N(0);
	}
	if (otherExprEmitter != null) {
		emitter._emit$SLToken$(", ", expr.getToken$());
		otherExprEmitter(0);
	}
	emitter._emit$SLToken$(")", expr.getToken$());
};

_Util.emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N = _Util$emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N;

function _Util$getNewExpressionInliner$LNewExpression$(expr) {
	var classDef;
	var ctor;
	var argTypes;
	var callingFuncDef;
	var stash;
	classDef = expr.getType$().getClassDef$();
	ctor = expr.getConstructor$();
	argTypes = ctor.getArgumentTypes$();
	callingFuncDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, "constructor", argTypes, false);
	stash = callingFuncDef.getStash$S("unclassify");
	return (stash ? stash.inliner : null);
};

_Util.getNewExpressionInliner$LNewExpression$ = _Util$getNewExpressionInliner$LNewExpression$;

function _Util$getElementTypeOfCompoundType$LType$(type) {
	var classDef;
	if (type.equals$LType$(Type.variantType)) {
		return Type.variantType;
	}
	classDef = type.getClassDef$();
	return classDef.getTypeArguments$()[0];
};

_Util.getElementTypeOfCompoundType$LType$ = _Util$getElementTypeOfCompoundType$LType$;

function _TempVarLister() {
	this._varNameMap = {};
};

$__jsx_extend([_TempVarLister], Object);
_TempVarLister.prototype.finalize$ = function () {
	var varNames;
	var k;
	varNames = [];
	for (k in this._varNameMap) {
		varNames.push(k);
	}
	return varNames;
};


_TempVarLister.prototype.update$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var onStmt;
	function onStmt(stmt) {
		stmt.forEachExpression$F$LExpression$B$((function (expr) {
			$this.update$LExpression$(expr);
			return true;
		}));
		stmt.forEachStatement$F$LStatement$B$(onStmt);
		return true;
	}
	Util$forEachStatement$F$LStatement$B$ALStatement$(onStmt, funcDef.getStatements$());
	return this;
};


_TempVarLister.prototype.update$LExpression$ = function (expr) {
	var $this = this;
	var onExpr;
	function onExpr(expr) {
		expr.forEachExpression$F$LExpression$B$(onExpr);
		if (expr instanceof PostIncrementExpression) {
			if ($this._varNameMap[_PostIncrementExpressionEmitter.TEMP_VAR_NAME] == null && _PostIncrementExpressionEmitter$needsTempVarFor$LPostIncrementExpression$(expr)) {
				$this._varNameMap[_PostIncrementExpressionEmitter.TEMP_VAR_NAME] = true;
			}
		}
		return true;
	}
	onExpr(expr);
	return this;
};


function _Mangler() {
};

$__jsx_extend([_Mangler], Object);
_Mangler.prototype.mangleFunctionName$SALType$ = function (name, argTypes) {
	return name + this.mangleFunctionArguments$ALType$(argTypes);
};


_Mangler.prototype.mangleTypeName$LType$ = function (type) {
	var $this = this;
	var classDef;
	var typeArgs;
	if (type.equals$LType$(Type.voidType)) {
		return "V";
	} else if (type.equals$LType$(Type.booleanType)) {
		return "B";
	} else if (type.equals$LType$(Type.integerType)) {
		return "I";
	} else if (type.equals$LType$(Type.numberType)) {
		return "N";
	} else if (type.equals$LType$(Type.stringType)) {
		return "S";
	} else if (type instanceof ObjectType) {
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
		return "L" + _Util$getOutputClassName$LClassDefinition$(type.getClassDef$()).replace(/\./g, (function (c) {
			return "$x" + c.charCodeAt(0).toString(16).toUpperCase();
		})) + "$";
	} else if (type instanceof StaticFunctionType) {
		return "F" + this.mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this.mangleTypeName$LType$(type.getReturnType$()) + "$";
	} else if (type instanceof MemberFunctionType) {
		return "M" + this.mangleTypeName$LType$(type.getObjectType$()) + this.mangleFunctionArguments$ALType$(type.getArgumentTypes$()) + this.mangleTypeName$LType$(type.getReturnType$()) + "$";
	} else if (type instanceof NullableType) {
		return "U" + this.mangleTypeName$LType$(type.getBaseType$());
	} else if (type.equals$LType$(Type.variantType)) {
		return "X";
	} else {
		throw new Error("FIXME " + type.toString());
	}
};


_Mangler.prototype.mangleFunctionArguments$ALType$ = function (argTypes) {
	var s;
	var i;
	s = "$";
	for (i = 0; i < argTypes.length; ++i) {
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
	++this._catchLevel;
	this._enterCatch$LTryStatement$F$F$S$V$S(tryStmt, cb, "$__jsx_catch_" + (this._catchLevel + ""));
	--this._catchLevel;
};


_Namer.prototype._enterCatch$LTryStatement$F$F$S$V$S = function (tryStmt, cb, catchName) {
	var $this = this;
	var catchStmts;
	var i;
	tryStmt.setStash$SLStash$(_Namer.IDENTIFIER, new _Namer$x2E_TryStash(catchName));
	catchStmts = tryStmt.getCatchStatements$();
	for (i in catchStmts) { i |= 0;
		catchStmts[i].getLocal$().setStash$SLStash$(_Namer.IDENTIFIER, new _Namer$x2E_CatchTargetStash(tryStmt));
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
	return this._getCatchName$LTryStatement$(caught.getStash$S(_Namer.IDENTIFIER).tryStmt);
};


_Namer.prototype._getCatchName$LTryStatement$ = function (tryStmt) {
	return tryStmt.getStash$S(_Namer.IDENTIFIER).catchName;
};


function _MinifiedNameGenerator(skipWords) {
	var i;
	this._skipWords = {};
	this._memo = [];
	this._counter = 0;
	for (i in skipWords) { i |= 0;
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
	return new _Minifier$x2E_MinifyingNamer().setup$L_Minifier$(this);
};


_Minifier.prototype.getMinifyingNamer$ = function () {
	this._minifyProperties$();
	this._minifyStaticVariables$();
	this._minifyGlobals$();
	return new _Minifier$x2E_MinifyingNamer().setup$L_Minifier$(this);
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
	for (i in this._outerLocals) { i |= 0;
		outerLocalUseCount[i] = _Minifier$_getLocalStash$LLocalVariable$(this._outerLocals[i]).useCount;
	}
	cb();
	scopeStash = _Minifier$_getScopeStash$LStashable$(stashable);
	for (k in this._globalUseCount) {
		if (this._globalUseCount[k] !== globalUseCountBackup[k]) {
			scopeStash.usedGlobals[k] = true;
		}
	}
	for (i in this._outerLocals) { i |= 0;
		if (outerLocalUseCount[i] !== _Minifier$_getLocalStash$LLocalVariable$(this._outerLocals[i]).useCount) {
			scopeStash.usedOuterLocals.push(this._outerLocals[i]);
		}
	}
};


_Minifier.prototype._minifyProperties$ = function () {
	var $this = this;
	var exportedPropertyNames;
	var k;
	this._log$S("minifying properties");
	exportedPropertyNames = [];
	this._classDefs.forEach((function (classDef) {
		classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
			if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) === ClassDefinition.IS_EXPORT && ! (member instanceof MemberFunctionDefinition && member.name$() === "constructor")) {
				exportedPropertyNames.push(member.name$());
			}
			return true;
		}));
	}));
	this._propertyConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(this._propertyUseCount, new _MinifiedNameGenerator(_Util$getECMA262ReservedWords$().concat((function () {
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
	})()).concat(exportedPropertyNames)));
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
			stash.staticVariableConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(stash.staticVariableUseCount, new _MinifiedNameGenerator(_Util$getECMA262ReservedWords$().concat(exportedStaticVarNames)));
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
	this._globalConversionTable = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$(useCount, new _MinifiedNameGenerator(_Util$getECMA262ReservedWords$().concat(_MinifiedNameGenerator.GLOBALS, (function () {
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


_Minifier.prototype._buildConversionTable$ALLocalVariable$L_Minifier$x2E_ScopeStash$ = function (locals, scopeStash) {
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
	for (i in scopeStash.usedOuterLocals) { i |= 0;
		reserved.push(_Minifier$_getLocalStash$LLocalVariable$(scopeStash.usedOuterLocals[i]).minifiedName);
	}
	this._log$S("local minification, preserving: " + reserved.join(","));
	reserved = reserved.concat(_Util$getECMA262ReservedWords$());
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
	for (i = 0; i < propertyNames.length; ++i) {
		conversionTable[propertyNames[i]] = nameGenerator.get$N(i);
	}
	return conversionTable;
};

_Minifier._buildConversionTable$HNL_MinifiedNameGenerator$ = _Minifier$_buildConversionTable$HNL_MinifiedNameGenerator$;

function _Minifier$_getClassStash$LClassDefinition$(classDef) {
	var stash;
	stash = classDef.getStash$S(_Minifier.CLASSSTASH_IDENTIFIER);
	if (stash == null) {
		stash = classDef.setStash$SLStash$(_Minifier.CLASSSTASH_IDENTIFIER, new _Minifier$x2E_ClassStash());
	}
	return stash;
};

_Minifier._getClassStash$LClassDefinition$ = _Minifier$_getClassStash$LClassDefinition$;

function _Minifier$_getScopeStash$LStashable$(stashable) {
	var stash;
	stash = stashable.getStash$S(_Minifier.SCOPESTASH_IDENTIFIER);
	if (stash == null) {
		stash = stashable.setStash$SLStash$(_Minifier.SCOPESTASH_IDENTIFIER, new _Minifier$x2E_ScopeStash());
	}
	return stash;
};

_Minifier._getScopeStash$LStashable$ = _Minifier$_getScopeStash$LStashable$;

function _Minifier$_getLocalStash$LLocalVariable$(local) {
	var stash;
	stash = local.getStash$S(_Minifier.LOCALSTASH_IDENTIFIER);
	if (stash == null) {
		stash = local.setStash$SLStash$(_Minifier.LOCALSTASH_IDENTIFIER, new _Minifier$x2E_LocalStash());
	}
	return stash;
};

_Minifier._getLocalStash$LLocalVariable$ = _Minifier$_getLocalStash$LLocalVariable$;

function _Minifier$_incr$HNS(useCount, name) {
	if ($__jsx_ObjectHasOwnProperty.call(useCount, name)) {
		++useCount[name];
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
	var ast;
	ast = esprima$0.parse(src);
	ast = esmangle$0.mangle(ast, ({ destructive: true }));
	return escodegen$0.generate(ast, ({ format: ({ renumber: true, hexadecimal: true, escapeless: true, compact: true, semicolons: false, parentheses: false }), directive: true }));
};

_Minifier.minifyJavaScript$S = _Minifier$minifyJavaScript$S;

var esprima$0 = require('esprima');
var esmangle$0 = require('esmangle');
var escodegen$0 = require('escodegen');
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
	var thisVar;
	ctorType = this._statement.getConstructorType$();
	argTypes = (ctorType != null ? ctorType.getArgumentTypes$() : []);
	ctorName = this._emitter.getNamer$().getNameOfConstructor$LClassDefinition$ALType$(this._statement.getConstructingClassDef$(), argTypes);
	token = this._statement.getToken$();
	thisVar = (this._emitter._emittingFunction.getParent$() != null ? "$this" : "this");
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(token, ctorName + ".call(" + thisVar, this._statement.getArguments$(), argTypes);
	this._emitter._emit$SLToken$(";\n", token);
	if (ctorName === "Error") {
		if (this._statement.getArguments$().length === 1) {
			this._emitter._emit$SLToken$("this.message = ", token);
			this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getArguments$()[0]).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			this._emitter._emit$SLToken$(";\n", token);
		}
		this._emitter._emit$SLToken$("this.name = \"" + this._emitter._emittingFunction.getClassDef$().classFullName$() + "\";\n", token);
		this._emitter._emit$SLToken$("if (Error.captureStackTrace) Error.captureStackTrace(this, ", null);
		this._emitter._emit$SLToken$(this._emitter.getNamer$().getNameOfClass$LClassDefinition$(this._emitter._emittingFunction.getClassDef$()), null);
		this._emitter._emit$SLToken$(");\n", null);
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
	this._emitter._emit$SLToken$("function " + (funcDef.isGenerator$() ? "* " : "") + this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(funcDef.getFuncLocal$()) + "(", funcDef.getToken$());
	this._emitter.getNamer$().enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
		var args;
		var i;
		args = funcDef.getArguments$();
		for (i = 0; i < args.length; ++i) {
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
	} else if (this._emitter._enableProfiler) {
		this._emitter._emit$SLToken$("return $__jsx_profiler.exit();\n", this._statement.getToken$());
	} else {
		this._emitter._emit$SLToken$("return;\n", this._statement.getToken$());
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
	this._emitter._emit$SLToken$(") {", null);
	if (_Util$isArrayType$LType$(this._statement.getListExpr$().getType$())) {
		this._emitter._emit$SLToken$(" ", null);
		this._emitter._getExpressionEmitterFor$LExpression$(this._statement.getLHSExpr$()).emit$N(0);
		this._emitter._emit$SLToken$(" |= 0;", null);
	}
	this._emitter._emit$SLToken$("\n", null);
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
	if (ifFalseStatements.length === 1 && ifFalseStatements[0] instanceof IfStatement) {
		this._emitter._emit$SLToken$("} else ", null);
		this._emitter._emitStatement$LStatement$(ifFalseStatements[0]);
		ifFalseStatements = ifFalseStatements[0].getOnTrueStatements$();
	} else {
		if (ifFalseStatements.length !== 0) {
			this._emitter._emit$SLToken$("} else {\n", null);
			this._emitter._emitStatements$ALStatement$(ifFalseStatements);
		}
		this._emitter._emit$SLToken$("}\n", null);
	}
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
	if (this._statement._msgExpr != null) {
		this._emitter._emitAssertionWithMsg$F$V$LToken$SLExpression$((function () {
			$this._emitter._getExpressionEmitterFor$LExpression$(condExpr).emit$N(0);
		}), condExpr.getToken$(), "assertion failure", this._statement._msgExpr);
	} else {
		this._emitter._emitAssertion$F$V$LToken$S((function () {
			$this._emitter._getExpressionEmitterFor$LExpression$(condExpr).emit$N(0);
		}), condExpr.getToken$(), "assertion failure");
	}
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
	for (i = 0; i < exprs.length; ++i) {
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
	_Util$emitWithPrecedence$LJavaScriptEmitter$NNF$V$(this._emitter, outerOpPrecedence, precedence, callback);
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
	var str;
	str = _Util$getECMA262NumberLiteral$LNumberLiteralExpression$(this._expr);
	if (outerOpPrecedence === _PropertyExpressionEmitter._operatorPrecedence && str.indexOf(".") === - 1) {
		this._emitter._emit$SLToken$("(" + str + ")", this._expr.getToken$());
	} else {
		this._emitter._emit$SLToken$("" + str, this._expr.getToken$());
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
	this._emitter._emit$SLToken$(_Util$getECMA262StringLiteral$LStringLiteralExpression$(this._expr), token);
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
	var exprType;
	var i;
	this._emitter._emit$SLToken$("[ ", null);
	exprs = this._expr.getExprs$();
	exprType = _Util$getElementTypeOfCompoundType$LType$(this._expr.getType$());
	for (i = 0; i < exprs.length; ++i) {
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", null);
		}
		this._emitter._emitRHSOfAssignment$LExpression$LType$(exprs[i], exprType);
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
	var elementType;
	var i;
	var element;
	this._emitter._emit$SLToken$("({ ", null);
	elements = this._expr.getElements$();
	elementType = _Util$getElementTypeOfCompoundType$LType$(this._expr.getType$());
	for (i = 0; i < elements.length; ++i) {
		element = elements[i];
		if (i !== 0) {
			this._emitter._emit$SLToken$(", ", null);
		}
		this._emitter._emit$SLToken$(element.getKey$().getValue$(), element.getKey$());
		this._emitter._emit$SLToken$(": ", null);
		this._emitter._emitRHSOfAssignment$LExpression$LType$(element.getExpr$(), elementType);
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
	if (emittingFunction.getParent$() != null) {
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
		} else if (destType instanceof VariantType) {
		} else if (srcType instanceof ObjectType && srcType.isConvertibleTo$LType$(destType)) {
		} else if (destType.equals$LType$(Type.booleanType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("typeof $v === \"boolean\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a boolean");
			return;
		} else if (destType.resolveIfNullable$().equals$LType$(Type.booleanType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"boolean\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a boolean nor null");
			return;
		} else if (destType.equals$LType$(Type.numberType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("typeof $v === \"number\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a number");
			return;
		} else if (destType.resolveIfNullable$().equals$LType$(Type.numberType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"number\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a number nor nullable");
			return;
		} else if (destType.equals$LType$(Type.integerType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", $this._expr.getToken$());
			}), "detected invalid cast, value is not an int");
			return;
		} else if (destType.resolveIfNullable$().equals$LType$(Type.integerType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"number\" && (! $__jsx_isFinite($v) || $v % 1 === 0)", $this._expr.getToken$());
			}), "detected invalid cast, value is not an int nor null");
			return;
		} else if (destType.equals$LType$(Type.stringType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("typeof $v === \"string\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a string");
			return;
		} else if (destType.resolveIfNullable$().equals$LType$(Type.stringType)) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"string\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a string nor null");
			return;
		} else if (destType instanceof FunctionType) {
			emitWithAssertion((function () {
				$this._emitter._emit$SLToken$("$v == null || typeof $v === \"function\"", $this._expr.getToken$());
			}), "detected invalid cast, value is not a function or null");
			return;
		} else if (destType instanceof ObjectType) {
			destClassDef = destType.getClassDef$();
			if ((destClassDef.flags$() & ClassDefinition.IS_FAKE) !== 0) {
			} else if (_Util$isArrayType$LType$(destType)) {
				emitWithAssertion((function () {
					$this._emitter._emit$SLToken$("$v == null || $v instanceof Array", $this._expr.getToken$());
				}), "detected invalid cast, value is not an Array or null");
				return;
			} else if (destClassDef instanceof InstantiatedClassDefinition && destClassDef.getTemplateClassName$() === "Map") {
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
			} else if ((destClassDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
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
		} else {
			throw new Error("Hmm");
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

function _PreIncrementExpressionEmitter(emitter, expr) {
	_UnaryExpressionEmitter.call(this, emitter, expr);
};

$__jsx_extend([_PreIncrementExpressionEmitter], _UnaryExpressionEmitter);
_PreIncrementExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var opToken;
	opToken = this._expr.getToken$();
	if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.integerType)) {
		if (this._expr.getExpr$().hasSideEffects$()) {
			_Util$emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N(this._emitter, (opToken.getValue$() === "++" ? "$__jsx_ipadd" : "$__jsx_ipsub"), this._expr.getExpr$(), (function (outerPred) {
				$this._emitter._emit$SLToken$("1", opToken);
			}), 0);
		} else {
			this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], (function () {
				$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				$this._emitter._emit$SLToken$(" = (", $this._expr.getToken$());
				$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_AdditiveExpressionEmitter._operatorPrecedence);
				$this._emitter._emit$SLToken$(" " + opToken.getValue$().charAt(0) + " 1) | 0", $this._expr.getToken$());
			}));
		}
	} else {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, this._getPrecedence$(), (function () {
			$this._emitter._emit$SLToken$(opToken.getValue$(), opToken);
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N($this._getPrecedence$());
		}));
	}
};


_PreIncrementExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PreIncrementExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _PreIncrementExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_PreIncrementExpressionEmitter._operatorPrecedence[op] = precedence;
};

_PreIncrementExpressionEmitter._setOperatorPrecedence$SN = _PreIncrementExpressionEmitter$_setOperatorPrecedence$SN;

function _PostIncrementExpressionEmitter(emitter, expr) {
	_UnaryExpressionEmitter.call(this, emitter, expr);
};

$__jsx_extend([_PostIncrementExpressionEmitter], _UnaryExpressionEmitter);
_PostIncrementExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var opToken;
	opToken = this._expr.getToken$();
	if (this._expr.getType$().resolveIfNullable$().equals$LType$(Type.integerType)) {
		if (this._expr.getExpr$().hasSideEffects$()) {
			_Util$emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N(this._emitter, (opToken.getValue$() === "++" ? "$__jsx_ippostinc" : "$__jsx_ippostdec"), this._expr.getExpr$(), (function (outerPred) {
				$this._emitter._emit$SLToken$("1", opToken);
			}), 0);
		} else {
			this._emitter._emit$SLToken$("(" + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + " = ", this._expr.getToken$());
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			this._emitter._emit$SLToken$(", ", this._expr.getToken$());
			this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
			this._emitter._emit$SLToken$(" = (" + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + " " + opToken.getValue$().charAt(0) + " 1) | 0, " + _PostIncrementExpressionEmitter.TEMP_VAR_NAME + ")", this._expr.getToken$());
		}
	} else {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, this._getPrecedence$(), (function () {
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N($this._getPrecedence$());
			$this._emitter._emit$SLToken$(opToken.getValue$(), opToken);
		}));
	}
};


_PostIncrementExpressionEmitter.prototype._getPrecedence$ = function () {
	return _PostIncrementExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _PostIncrementExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_PostIncrementExpressionEmitter._operatorPrecedence[op] = precedence;
};

_PostIncrementExpressionEmitter._setOperatorPrecedence$SN = _PostIncrementExpressionEmitter$_setOperatorPrecedence$SN;

function _PostIncrementExpressionEmitter$needsTempVarFor$LPostIncrementExpression$(expr) {
	return expr.getType$().resolveIfNullable$().equals$LType$(Type.integerType) && ! expr.getExpr$().hasSideEffects$();
};

_PostIncrementExpressionEmitter.needsTempVarFor$LPostIncrementExpression$ = _PostIncrementExpressionEmitter$needsTempVarFor$LPostIncrementExpression$;

function _InstanceofExpressionEmitter(emitter, expr) {
	_ExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_InstanceofExpressionEmitter], _ExpressionEmitter);
_InstanceofExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var expectedType;
	expectedType = this._expr.getExpectedType$();
	if (_Util$isArrayType$LType$(expectedType)) {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_InstanceofExpressionEmitter._operatorPrecedence);
			$this._emitter._emit$SLToken$(" instanceof Array", $this._expr.getToken$());
		}));
	} else if (expectedType.getClassDef$() instanceof InstantiatedClassDefinition && expectedType.getClassDef$().getTemplateClassName$() === "Map") {
		this.emitWithPrecedence$NNF$V$(outerOpPrecedence, _InstanceofExpressionEmitter._operatorPrecedence, (function () {
			$this._emitter._emit$SLToken$("(typeof(", $this._expr.getToken$());
			$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getExpr$()).emit$N(_InstanceofExpressionEmitter._operatorPrecedence);
			$this._emitter._emit$SLToken$(") === \"object\")", $this._expr.getToken$());
		}));
	} else if ((expectedType.getClassDef$().flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
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
	if (expr.getExpr$().isClassSpecifier$() && expr.getExpr$().getType$().getClassDef$() == Type.numberType.getClassDef$()) {
		switch (identifierToken.getValue$()) {
		case "parseInt":
		case "parseFloat":
		case "isNaN":
		case "isFinite":
			this._emitter._emit$SLToken$('$__jsx_' + identifierToken.getValue$(), identifierToken);
			return;
		}
	} else if (expr.getExpr$().isClassSpecifier$() && expr.getExpr$().getType$().getClassDef$() == Type.stringType.getClassDef$()) {
		switch (identifierToken.getValue$()) {
		case "encodeURIComponent":
		case "decodeURIComponent":
		case "encodeURI":
		case "decodeURI":
			this._emitter._emit$SLToken$('$__jsx_' + identifierToken.getValue$(), identifierToken);
			return;
		}
	}
	classDef = expr.getHolderType$().getClassDef$();
	if (expr.getExpr$().isClassSpecifier$()) {
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
		$this._emitter._emit$SLToken$("function " + (funcDef.isGenerator$() ? "* " : "") + (funcLocal != null ? $this._emitter.getNamer$().getNameOfLocalVariable$LLocalVariable$(funcLocal) : "") + "(", funcDef.getToken$());
		$this._emitter.getNamer$().enterFunction$LMemberFunctionDefinition$F$V$(funcDef, (function () {
			var args;
			var i;
			args = funcDef.getArguments$();
			for (i = 0; i < args.length; ++i) {
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
	var isInt;
	isInt = this._expr.getType$().resolveIfNullable$().equals$LType$(Type.integerType);
	if (isInt) {
		this._emitter._emit$SLToken$("((", this._expr.getToken$());
	}
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _AdditiveExpressionEmitter._operatorPrecedence);
	this._emitter._emit$SLToken$(" + ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _AdditiveExpressionEmitter._operatorPrecedence - 1);
	if (isInt) {
		this._emitter._emit$SLToken$(") | 0)", this._expr.getToken$());
	}
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
_AssignmentExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(this._getPrecedence$());
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitRHSOfAssignment$LExpression$LType$(this._expr.getSecondExpr$(), this._expr.getFirstExpr$().getType$());
};


_AssignmentExpressionEmitter.prototype._getPrecedence$ = function () {
	return _AssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _AssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_AssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
};

_AssignmentExpressionEmitter._setOperatorPrecedence$SN = _AssignmentExpressionEmitter$_setOperatorPrecedence$SN;

function _FusedAssignmentExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_FusedAssignmentExpressionEmitter], _OperatorExpressionEmitter);
_FusedAssignmentExpressionEmitter.prototype.emit$N = function (outerOpPrecedence) {
	var $this = this;
	var coreOp;
	coreOp = this._expr.getToken$().getValue$().charAt(0);
	if (_FusedAssignmentExpressionEmitter._fusedIntHelpers[coreOp] != null && this._expr.getFirstExpr$().getType$().resolveIfNullable$().equals$LType$(Type.integerType)) {
		if (this._expr.getFirstExpr$().hasSideEffects$()) {
			_Util$emitFusedIntOpWithSideEffects$LJavaScriptEmitter$SLExpression$F$NV$N(this._emitter, _FusedAssignmentExpressionEmitter._fusedIntHelpers[coreOp], this._expr.getFirstExpr$(), (function (outerPred) {
				$this._emitter._emitWithNullableGuard$LExpression$N($this._expr.getSecondExpr$(), outerPred);
			}), outerOpPrecedence);
		} else {
			_Util$emitWithPrecedence$LJavaScriptEmitter$NNF$V$(this._emitter, outerOpPrecedence, _AssignmentExpressionEmitter._operatorPrecedence["="], (function () {
				var coreOpPrecedence;
				$this._emitter._getExpressionEmitterFor$LExpression$($this._expr.getFirstExpr$()).emit$N(_AssignmentExpressionEmitter._operatorPrecedence["="]);
				if (coreOp === "*") {
					$this._emitter._emit$SLToken$(" = $__jsx_imul(", $this._expr.getToken$());
					$this._emitter._emitWithNullableGuard$LExpression$N($this._expr.getFirstExpr$(), 0);
					$this._emitter._emit$SLToken$(", ", $this._expr.getToken$());
					$this._emitter._emitWithNullableGuard$LExpression$N($this._expr.getSecondExpr$(), 0);
					$this._emitter._emit$SLToken$(")", $this._expr.getToken$());
				} else {
					coreOpPrecedence = (coreOp === "+" ? _AdditiveExpressionEmitter._operatorPrecedence : _BinaryNumberExpressionEmitter._operatorPrecedence[coreOp]);
					$this._emitter._emit$SLToken$(" = (", $this._expr.getToken$());
					$this._emitter._emitWithNullableGuard$LExpression$N($this._expr.getFirstExpr$(), coreOpPrecedence);
					$this._emitter._emit$SLToken$(" " + coreOp + " ", $this._expr.getToken$());
					$this._emitter._emitWithNullableGuard$LExpression$N($this._expr.getSecondExpr$(), coreOpPrecedence - 1);
					$this._emitter._emit$SLToken$(") | 0", $this._expr.getToken$());
				}
			}));
		}
		return;
	}
	_OperatorExpressionEmitter.prototype.emit$N.call(this, outerOpPrecedence);
};


_FusedAssignmentExpressionEmitter.prototype._emit$ = function () {
	var op;
	op = this._expr.getToken$().getValue$();
	this._emitter._getExpressionEmitterFor$LExpression$(this._expr.getFirstExpr$()).emit$N(this._getPrecedence$());
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitRHSOfAssignment$LExpression$LType$(this._expr.getSecondExpr$(), this._expr.getFirstExpr$().getType$());
};


_FusedAssignmentExpressionEmitter.prototype._getPrecedence$ = function () {
	return _FusedAssignmentExpressionEmitter._operatorPrecedence[this._expr.getToken$().getValue$()];
};


function _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN(op, precedence) {
	_FusedAssignmentExpressionEmitter._operatorPrecedence[op] = precedence;
};

_FusedAssignmentExpressionEmitter._setOperatorPrecedence$SN = _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN;

function _EqualityExpressionEmitter(emitter, expr) {
	_OperatorExpressionEmitter.call(this, emitter);
	this._expr = expr;
};

$__jsx_extend([_EqualityExpressionEmitter], _OperatorExpressionEmitter);
_EqualityExpressionEmitter.prototype._emit$ = function () {
	var op;
	var emitOp;
	var lhs;
	var rhs;
	op = this._expr.getToken$().getValue$();
	emitOp = op;
	lhs = this._expr.getFirstExpr$();
	rhs = this._expr.getSecondExpr$();
	if (lhs.getType$() instanceof PrimitiveType && rhs.getType$() instanceof PrimitiveType) {
		emitOp += "=";
	} else if (lhs.getType$().resolveIfNullable$() instanceof PrimitiveType && lhs.getType$().resolveIfNullable$().equals$LType$(rhs.getType$().resolveIfNullable$())) {
		emitOp += "=";
	}
	this._emitter._getExpressionEmitterFor$LExpression$(lhs).emit$N(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
	this._emitter._emit$SLToken$(" " + emitOp + " ", this._expr.getToken$());
	this._emitter._getExpressionEmitterFor$LExpression$(rhs).emit$N(_EqualityExpressionEmitter._operatorPrecedence[op] - 1);
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
_BinaryNumberExpressionEmitter.prototype._emit$ = function () {
	var op;
	var isInt;
	var needsBitOr;
	op = this._expr.getToken$().getValue$();
	isInt = this._expr.getType$().resolveIfNullable$().equals$LType$(Type.integerType);
	if (isInt && op === "*") {
		this._emitter._emit$SLToken$("$__jsx_imul(", this._expr.getToken$());
		this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), 0);
		this._emitter._emit$SLToken$(", ", this._expr.getToken$());
		this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), 0);
		this._emitter._emit$SLToken$(")", this._expr.getToken$());
		return;
	}
	needsBitOr = isInt && ! _BinaryNumberExpressionEmitter._OPS_RETURNING_INT[op];
	if (needsBitOr) {
		this._emitter._emit$SLToken$("((", this._expr.getToken$());
	}
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getFirstExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op]);
	this._emitter._emit$SLToken$(" " + op + " ", this._expr.getToken$());
	this._emitter._emitWithNullableGuard$LExpression$N(this._expr.getSecondExpr$(), _BinaryNumberExpressionEmitter._operatorPrecedence[op] - 1);
	if (needsBitOr) {
		this._emitter._emit$SLToken$(") | 0)", this._expr.getToken$());
	}
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
		propertyName = secondExpr.getDecoded$();
		if (_Util$nameIsValidAsProperty$S(propertyName)) {
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
	}
	if (this._emitCallsToMap$LPropertyExpression$(calleeExpr)) {
		return true;
	}
	if (this._emitCallsToArray$LPropertyExpression$(calleeExpr)) {
		return true;
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
		if (args[1] instanceof StringLiteralExpression && _Util$nameIsValidAsProperty$S(args[1].getDecoded$())) {
			this._emitter._emit$SLToken$(".", calleeExpr.getToken$());
			this._emitter._emit$SLToken$(args[1].getDecoded$(), args[1].getToken$());
		} else {
			this._emitter._emit$SLToken$("[", calleeExpr.getToken$());
			this._emitter._getExpressionEmitterFor$LExpression$(args[1]).emit$N(0);
			this._emitter._emit$SLToken$("]", calleeExpr.getToken$());
		}
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


_CallExpressionEmitter.prototype._emitCallsToArray$LPropertyExpression$ = function (calleeExpr) {
	var classDef;
	if (calleeExpr.getType$() instanceof StaticFunctionType) {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! (classDef instanceof InstantiatedClassDefinition)) {
		return false;
	}
	if (classDef.getTemplateClassName$() !== "Array") {
		return false;
	}
	switch (calleeExpr.getIdentifierToken$().getValue$()) {
	case "_forEach":
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(calleeExpr.getToken$(), "$__jsx_forEach(", [ calleeExpr.getExpr$(), this._expr.getArguments$()[0] ], null);
		return true;
	default:
		return false;
	}
};


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
	var thisVar;
	funcType = this._expr.getFunctionType$();
	classDef = funcType.getObjectType$().getClassDef$();
	methodName = this._expr.getName$().getValue$();
	argTypes = funcType.getArgumentTypes$();
	mangledFuncName = this._emitter.getNamer$().getNameOfMethod$LClassDefinition$SALType$(classDef, methodName, argTypes);
	thisVar = (this._emitter._emittingFunction.getParent$() != null ? "$this" : "this");
	this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), this._emitter.getNamer$().getNameOfClass$LClassDefinition$(classDef) + ".prototype." + mangledFuncName + ".call(" + thisVar, this._expr.getArguments$(), argTypes);
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
	var inliner;
	var classDef;
	var argTypes;
	inliner = _Util$getNewExpressionInliner$LNewExpression$(this._expr);
	classDef = this._expr.getType$().getClassDef$();
	if (inliner) {
		this._emitAsObjectLiteral$LClassDefinition$ALExpression$(classDef, inliner(this._expr));
	} else if (_Util$isArrayType$LType$(this._expr.getType$()) && this._expr.getArguments$().length === 0) {
		this._emitter._emit$SLToken$("[]", this._expr.getToken$());
	} else if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map") {
		this._emitter._emit$SLToken$("{}", this._expr.getToken$());
	} else {
		argTypes = this._expr.getConstructor$().getArgumentTypes$();
		this._emitter._emitCallArguments$LToken$SALExpression$ALType$(this._expr.getToken$(), "new " + this._emitter.getNamer$().getNameOfConstructor$LClassDefinition$ALType$(classDef, argTypes) + "(", this._expr.getArguments$(), argTypes);
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
	code += this._emitter._platform.load$S(this._emitter._platform.getRoot$() + "/lib/js/rt/launcher.js");
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
	callEntryPoint = Util$format$SAS("JSX.%1(%2, %3);", [ this._getLauncher$(), JSON.stringify(this._emitter._platform.encodeFilename$S(this._entrySourceFile)), args ]);
	if (this._executableFor === "web") {
		callEntryPoint = this._wrapOnLoad$S(callEntryPoint);
	}
	return code + callEntryPoint + "\n";
};


_BootstrapBuilder.prototype._wrapOnLoad$S = function (code) {
	var wrapper;
	wrapper = this._emitter._platform.load$S(this._emitter._platform.getRoot$() + "/lib/js/rt/web-launcher.js");
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
	return (path.charAt(0) === "/" || path.match(/^[a-zA-Z]:[\/\\]/) ? path : this._cwd + "/" + path);
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
	} else if (name === "-") {
		fd = process.stdin.fd;
		content = "";
		BUFFER_SIZE = 4096;
		buffer = new Buffer(BUFFER_SIZE);
		while ((n = node.fs.readSync((fd | 0), buffer, 0, (BUFFER_SIZE | 0))) > 0) {
			content += buffer.slice(0, n).toString();
		}
		return content;
	} else {
		content = node.fs.readFileSync(this._absPath$S(name), "utf-8");
		this.fileContent[name] = content;
		return content;
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
	var argv;
	var child;
	jsFile = this._absPath$S(Util$format$SAS(".jsx.%1.%2.%3.js", [ node.path.basename(scriptFile || "-"), process.pid.toString(), Date.now().toString(16) ]));
	node.fs.writeFileSync(jsFile, jsSource);
	process.on("exit", (function (stream) {
		node.fs.unlinkSync(jsFile);
	}));
	if (process.env.JSX_RUNJS) {
		argv = process.env.JSX_RUNJS.split(/\s+/).concat([ jsFile ]).concat(args);
		child = node.child_process.spawn(argv.shift(), argv);
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

NodePlatform.prototype.colorize$NS = function (colorId, message) {
	if (NodePlatform._isColorSupported) {
		return "\x1b[" + (colorId + "") + "m" + message + "\x1b[0m";
	} else {
		return message;
	}
};


NodePlatform.prototype.error$S = function (message) {
	console.error(this.colorize$NS(NodePlatform.COLOR_RED, message));
};


NodePlatform.prototype.warn$S = function (message) {
	console.warn(this.colorize$NS(NodePlatform.COLOR_YELLOW, message));
};


function JSXCommand() {
};

$__jsx_extend([JSXCommand], Object);
function JSXCommand$help$() {
	return "JSX compiler version " + Meta.VERSION_STRING + "\n" + "\n" + "Usage: jsx [options] source-file\n" + "\n" + "Options:\n" + "  --add-search-path path     adds a path to library search paths\n" + "  --executable RUNENV        adds launcher to call _Main.main(:string[]):void\n" + "                             supported RUNENV is node, commonjs and web.\n" + "  --run                      runs _Main.main(:string[]):void after compiling\n" + "  --test                     runs _Test#test*():void after compiling\n" + "  --define name=var          defines compile-time constant as a property of JSX.ENV\n" + "  --output file              output file (default:stdout)\n" + "  --input-filename file      specifies the root path for searching imports (used when the source-file is \"-\" (stdin))\n" + "  --mode (compile|parse|doc) specifies compilation mode (default:compile)\n" + "  --target (javascript|c++)  specifies target language (default:javascript)\n" + "  --release                  disables run-time type checking and enables optimizations (" + Optimizer$getReleaseOptimizationCommands$().join(",") + ")\n" + "  --profile                  enables the profiler (experimental)\n" + "  --optimize cmd1,cmd2,...   enables optimization commands\n" + "  --warn type1,type2,...     enables warnings (all, unused, experimental, deprecated, none)\n" + "  --disable-type-check       disables run-time type checking\n" + "  --minify                   compresses the target JavaScript code\n" + "  --enable-source-map        enables source map debugging info\n" + "  --complete line:column     shows code completion at line:column\n" + "  --version                  displays the version and compiler identifier and exits\n" + "  --version-number           displays the version as number and exits\n" + "  --help                     displays this help and exits\n" + "\n" + "Env:\n" + "  JSX_OPTS   options of jsx(1)\n" + "  JSX_RUNJS  JavaScript engine used by --run and --test\n" + "";
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
	var transformCommands;
	var opt;
	var optarg;
	var a;
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
		if (arg === "--") {
			return null;
		}
		if (arg.match(/^-/)) {
			return arg;
		} else {
			--argIndex;
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
	transformCommands = [];
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
		case "--define":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			a = optarg.split(/=/, 2);
			if (a.length !== 2) {
				platform.error$S("invalid environment variable (not defined as name=var): " + optarg);
				return 1;
			}
			compiler.getUserEnvironment$()[a[0]] = a[1];
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
			optarg.split(",").forEach((function (command) {
				if (command === "release") {
					optimizeCommands = Optimizer$getReleaseOptimizationCommands$();
				} else if (command.charAt(0) === "-") {
					command = command.slice(1);
					optimizeCommands = optimizeCommands.filter((function (item) {
						return command !== item;
					}));
				} else {
					optimizeCommands.push(command);
				}
			}));
			break;
		case "--transform":
			if ((optarg = getoptarg()) == null) {
				return 1;
			}
			optarg.split(",").forEach((function (command) {
				transformCommands.push(command);
			}));
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
				case "unused":
					compiler.getWarningFilters$().unshift((function (warning) {
						if (warning instanceof UnusedWarning) {
							return true;
						}
						return null;
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
				case "experimental":
					compiler.getWarningFilters$().unshift((function (warning) {
						if (warning instanceof ExperimentalWarning) {
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
				if (optimizeCommands.length !== 0 && optimizeCommands[0] !== "strip") {
					optimizeCommands.unshift("strip");
				}
				if (optimizeCommands[optimizeCommands.length - 1] !== "strip") {
					optimizeCommands.push("strip");
				}
			}));
			break;
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
				mode = switchOpt[1] === "enable";
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
				case "generator-emulation":
					if (mode) {
						transformCommands.push("generator");
					} else {
						transformCommands = transformCommands.filter((function (cmd) {
							return cmd !== "generator";
						}));
					}
					break NEXTOPT;
				case "cps-transform":
					if (mode) {
						transformCommands.push("cps");
					} else {
						transformCommands = transformCommands.filter((function (cmd) {
							return cmd !== "cps";
						}));
					}
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
	emitter.setRunEnv$S((executable != null ? executable : ""));
	emitter.setOutputFile$US(outputFile);
	setBootstrapMode(sourceFile);
	compiler.setEmitter$LEmitter$(emitter);
	switch (compiler.getMode$()) {
	case Compiler.MODE_DOC:
		if (outputFile == null) {
			platform.error$S("--output is mandatory for --mode doc");
			return 1;
		}
		if (compiler.compile$()) {
			new DocumentGenerator(compiler, platform.getRoot$() + "/etc/doc-template", outputFile).setResourceFiles$AS([ "style.css" ]).setPathFilter$F$SB$((function (sourcePath) {
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
	err = compiler.setTransformCommands$AS(transformCommands);
	if (err != null) {
		platform.error$S(err);
		return 1;
	}
	err = optimizer.setup$AS(optimizeCommands);
	if (err != null) {
		platform.error$S(err);
		return 1;
	}
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
InstantiationContext.prototype.clone$ = function () {
	return new InstantiationContext(this.errors, this.typemap);
};


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

Stashable.prototype.setStash$SLStash$ = function (id, stash) {
	return this._stash[id] = stash;
};


Stashable.prototype.getStash$S = function (id) {
	return this._stash[id];
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
			srcPos = (token != null ? Util$format$SAS(" at file %1, line %2, near %3", [ token.getFilename$(), token.getLineNumber$() + "", token.getValue$() ]) : "");
			$__jsx_catch_0.message = Util$format$SAS("fatal error while compiling statement%1\n%2", [ srcPos, $__jsx_catch_0.message ]);
			throw $__jsx_catch_0;
		} else {
			throw $__jsx_catch_0;
		}
	}
};


Statement.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	var $this = this;
	return this.forEachStatement$F$LStatement$F$LStatement$V$B$((function (stmt, _) {
		return cb(stmt);
	}));
};


Statement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
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
	this._id = (- 1 | 0);
};

$__jsx_extend([LabelStatement], Statement);
LabelStatement.prototype.getName$ = function () {
	return this._name;
};


LabelStatement.prototype.getID$ = function () {
	return this._id;
};


LabelStatement.prototype.setID$I = function (id) {
	this._id = id;
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
	this._label = label;
	this._id = (- 1 | 0);
};

$__jsx_extend([GotoStatement], Statement);
GotoStatement.prototype.getLabel$ = function () {
	return this._label;
};


GotoStatement.prototype.setLabel$S = function (label) {
	this._label = label;
};


GotoStatement.prototype.getID$ = function () {
	return this._id;
};


GotoStatement.prototype.setID$I = function (id) {
	this._id = id;
};


GotoStatement.prototype.getToken$ = function () {
	return null;
};


GotoStatement.prototype.clone$ = function () {
	return new GotoStatement(this._label);
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
	return new LogStatement(this._token, Util$cloneArray$ALExpression$(this._exprs));
};


LogStatement.prototype.getExprs$ = function () {
	return this._exprs;
};


LogStatement.prototype.serialize$ = function () {
	return [ "LogStatement", this._token.serialize$(), Util$serializeArray$ALExpression$(this._exprs) ];
};


LogStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var i;
	var exprType;
	for (i = 0; i < this._exprs.length; ++i) {
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


function AssertStatement(token, expr, msgExpr) {
	InformationStatement.call(this, token);
	this._expr = expr;
	this._msgExpr = msgExpr;
};

$__jsx_extend([AssertStatement], InformationStatement);
AssertStatement.prototype.clone$ = function () {
	return new AssertStatement(this._token, this._expr.clone$(), Util$cloneNullable$LExpression$(this._msgExpr));
};


AssertStatement.prototype.getExpr$ = function () {
	return this._expr;
};


AssertStatement.prototype.getMessageExpr$ = function () {
	return this._msgExpr;
};


AssertStatement.prototype.serialize$ = function () {
	return [ "AssertStatement", this._token.serialize$(), Util$serializeNullable$LExpression$(this._expr), Util$serializeNullable$LExpression$(this._msgExpr) ];
};


AssertStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var exprType;
	var msgExprType;
	if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
		return true;
	}
	exprType = this._expr.getType$();
	if (exprType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._expr.getToken$(), "argument of the assert statement cannot be void"));
	}
	if (this._msgExpr != null) {
		if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._msgExpr)) {
			return true;
		}
		msgExprType = this._msgExpr.getType$();
		if (! msgExprType.equals$LType$(Type.stringType)) {
			context.errors.push(new CompileError(this._msgExpr.getToken$(), "message expression of the assert statement must be of string type"));
		}
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
	if (this._msgExpr != null && ! cb(this._msgExpr, (function (expr) {
		$this._msgExpr = expr;
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
	return new CatchStatement(this._token, this._local, Util$cloneArray$ALStatement$(this._statements));
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
	return [ "CatchStatement", this._token.serialize$(), this._local.serialize$(), Util$serializeArray$ALStatement$(this._statements) ];
};


CatchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var catchType;
	var i;
	catchType = this.getLocal$().getType$();
	if (! (catchType instanceof ObjectType || catchType.equals$LType$(Type.variantType))) {
		context.errors.push(new CompileError(this._token, "only objects or a variant may be caught"));
	}
	for (i = 0; i < this._statements.length; ++i) {
		if (! this._statements[i].analyze$LAnalysisContext$(context)) {
			return false;
		}
	}
	return true;
};


CatchStatement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._statements);
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
	return new TryStatement(this._token, Util$cloneArray$ALStatement$(this._tryStatements), Util$cloneArray$ALCatchStatement$(this._catchStatements), Util$cloneArray$ALStatement$(this._finallyStatements));
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
	return [ "TryStatement", Util$serializeArray$ALStatement$(this._tryStatements), Util$serializeArray$ALCatchStatement$(this._catchStatements), Util$serializeArray$ALStatement$(this._finallyStatements) ];
};


TryStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var lvStatusesAfterTryCatch;
	var i;
	var lvStatusesAfterCatch;
	var curCatchType;
	var j;
	var precCatchType;
	var lvStatusesAfterFinally;
	context.blockStack.push(new BlockContext(context.getTopBlock$().localVariableStatuses.clone$(), this));
	lvStatusesAfterTryCatch = null;
	try {
		for (i = 0; i < this._tryStatements.length; ++i) {
			if (! this._tryStatements[i].analyze$LAnalysisContext$(context)) {
				return false;
			}
		}
		lvStatusesAfterTryCatch = context.getTopBlock$().localVariableStatuses;
	} finally {
		context.blockStack.pop();
	}
	for (i = 0; i < this._catchStatements.length; ++i) {
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
		for (j = 0; j < i; ++j) {
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
		for (i = 0; i < this._finallyStatements.length; ++i) {
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


TryStatement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	var $this = this;
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._tryStatements)) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._catchStatements.map((function (s) {
		return s;
	})))) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._finallyStatements)) {
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
	} else if (Type$isIntegerOrNumber$LType$(exprType) && Type$isIntegerOrNumber$LType$(expectedType)) {
	} else if (expectedType.equals$LType$(Type.stringType) && exprType.equals$LType$(Type.nullType)) {
	} else {
		context.errors.push(new CompileError(this._token, "type mismatch; expected type was '" + expectedType.toString() + "' but got '" + exprType.toString() + "'"));
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
	return new IfStatement(this._token, this._expr.clone$(), Util$cloneArray$ALStatement$(this._onTrueStatements), Util$cloneArray$ALStatement$(this._onFalseStatements));
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
	return [ "IfStatement", this._expr.serialize$(), Util$serializeArray$ALStatement$(this._onTrueStatements), Util$serializeArray$ALStatement$(this._onFalseStatements) ];
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
		for (i = 0; i < this._onTrueStatements.length; ++i) {
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
		for (i = 0; i < this._onFalseStatements.length; ++i) {
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


IfStatement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._onTrueStatements)) {
		return false;
	}
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._onFalseStatements)) {
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
	return [ Util$serializeNullable$LToken$(this._label) ];
};


LabellableStatement.prototype._prepareBlockAnalysis$LAnalysisContext$ = function (context) {
	var i;
	var statement;
	var ls;
	var error;
	if (this._label) {
		for (i = context.blockStack.length - 1; ! (context.blockStack[i].block instanceof MemberFunctionDefinition); --i) {
			statement = context.blockStack[i].block;
			if (! (statement instanceof LabellableStatement)) {
				continue;
			}
			ls = statement;
			if (ls.getLabel$() && ls.getLabel$().getValue$() === this.getLabel$().getValue$()) {
				error = new CompileError(this.getLabel$(), Util$format$SAS("label '%1' has already been defined", [ this.getLabel$().getValue$() ]));
				error.addCompileNote$LCompileNote$(new CompileNote(ls.getLabel$(), "defined here"));
				context.errors.push(error);
				break;
			}
		}
	}
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
	return new SwitchStatement(this._token, this._label, this._expr.clone$(), Util$cloneArray$ALStatement$(this._statements));
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
	return [ "SwitchStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Util$serializeArray$ALStatement$(this._statements) ]);
};


SwitchStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var exprType;
	var hasDefaultLabel;
	var caseMap;
	var i;
	var statement;
	var caseExpr;
	var caseStr;
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
		caseMap = {};
		for (i = 0; i < this._statements.length; ++i) {
			statement = this._statements[i];
			if (! statement.analyze$LAnalysisContext$(context)) {
				return false;
			}
			if (statement instanceof DefaultStatement) {
				hasDefaultLabel = true;
			} else if (statement instanceof CaseStatement) {
				caseExpr = statement.getExpr$();
				if (caseExpr instanceof IntegerLiteralExpression) {
					caseStr = caseExpr.getDecoded$() + "";
				} else if (caseExpr instanceof NumberLiteralExpression) {
					caseStr = caseExpr.getDecoded$() + "";
				} else if (caseExpr instanceof BooleanLiteralExpression) {
					caseStr = caseExpr.getDecoded$() + "";
				} else if (caseExpr instanceof StringLiteralExpression) {
					caseStr = caseExpr.getDecoded$();
				} else {
					caseStr = null;
				}
				if (caseStr != null && $__jsx_ObjectHasOwnProperty.call(caseMap, caseStr)) {
					context.errors.push(new CompileError(caseExpr.getToken$(), "duplicate case value " + caseExpr.getToken$().getValue$()));
					return false;
				}
				caseMap[caseStr] = true;
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


SwitchStatement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._statements)) {
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


ContinuableStatement.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	if (! Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._statements)) {
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
	return new WhileStatement(this._token, this._label, this._expr.clone$(), Util$cloneArray$ALStatement$(this._statements));
};


WhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};


WhileStatement.prototype.getStatements$ = function () {
	return this._statements;
};


WhileStatement.prototype.serialize$ = function () {
	return [ "WhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Util$serializeArray$ALStatement$(this._statements) ]);
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
		for (i = 0; i < this._statements.length; ++i) {
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
	return new ForStatement(this._token, this._label, Util$cloneNullable$LExpression$(this._initExpr), Util$cloneNullable$LExpression$(this._condExpr), Util$cloneNullable$LExpression$(this._postExpr), Util$cloneArray$ALStatement$(this._statements));
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
	return [ "ForStatement" ].concat(this._serialize$()).concat([ Util$serializeNullable$LExpression$(this._initExpr), Util$serializeNullable$LExpression$(this._condExpr), Util$serializeNullable$LExpression$(this._postExpr), Util$serializeArray$ALStatement$(this._statements) ]);
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
		for (i = 0; i < this._statements.length; ++i) {
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
	return new ForInStatement(this._token, this._label, this._lhsExpr.clone$(), this._listExpr.clone$(), Util$cloneArray$ALStatement$(this._statements));
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
	return [ "ForInStatement" ].concat(this._serialize$()).concat([ this._lhsExpr.serialize$(), this._listExpr.serialize$(), Util$serializeArray$ALStatement$(this._statements) ]);
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
		for (i = 0; i < this._statements.length; ++i) {
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
	return new DoWhileStatement(this._token, this._label, this._expr.clone$(), Util$cloneArray$ALStatement$(this._statements));
};


DoWhileStatement.prototype.getExpr$ = function () {
	return this._expr;
};


DoWhileStatement.prototype.serialize$ = function () {
	return [ "DoWhileStatement" ].concat(this._serialize$()).concat([ this._expr.serialize$(), Util$serializeArray$ALStatement$(this._statements) ]);
};


DoWhileStatement.prototype.doAnalyze$LAnalysisContext$ = function (context) {
	var i;
	this._prepareBlockAnalysis$LAnalysisContext$(context);
	try {
		for (i = 0; i < this._statements.length; ++i) {
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
	return [ this._getName$(), this._token.serialize$(), Util$serializeNullable$LToken$(this._label) ];
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
	for (i = context.blockStack.length - 1; ! (context.blockStack[i].block instanceof MemberFunctionDefinition); --i) {
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
		} else if (this._token.getValue$() === "continue" && statement instanceof SwitchStatement) {
			continue;
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


function ReturnStatement(token, expr) {
	Statement.call(this);
	this._token = token;
	this._expr = expr;
};

$__jsx_extend([ReturnStatement], Statement);
ReturnStatement.prototype.clone$ = function () {
	return new ReturnStatement(this._token, Util$cloneNullable$LExpression$(this._expr));
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
	return [ "ReturnStatement", Util$serializeNullable$LExpression$(this._expr) ];
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
	} else if (returnType.equals$LType$(Type.voidType)) {
		if (this._expr != null) {
			if (! this._analyzeExpr$LAnalysisContext$LExpression$(context, this._expr)) {
				return true;
			}
			exprType = this._expr.getType$();
			if (exprType == null) {
				return true;
			}
			if (! exprType.equals$LType$(Type.voidType)) {
				context.errors.push(new CompileError(this._token, "unmatched return type, expected a void expression"));
				return true;
			}
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
	var returnType;
	var classDef;
	if (! this._typesAreIdentified$()) {
		context.errors.push(new CompileError(this._token, "argument / return types were not automatically deductable, please specify them by hand"));
		return false;
	}
	returnType = this._funcDef.getReturnType$();
	if (this._funcDef.isGenerator$()) {
		if (! (returnType instanceof ObjectType && (classDef = returnType.getClassDef$()) instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Generator")) {
			this._funcDef.setReturnType$LType$(new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Generator", [ Type.voidType, returnType ])));
		}
	}
	this._funcDef.analyze$LAnalysisContext$(context);
	context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this._funcDef.getFuncLocal$());
	return true;
};


FunctionStatement.prototype._typesAreIdentified$ = function () {
	var argTypes;
	var i;
	argTypes = this._funcDef.getArgumentTypes$();
	for (i = 0; i < argTypes.length; ++i) {
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
		context.errors.push(new CompileError(this._token, "only properties of a map object can be deleted"));
		return true;
	}
	secondExprType = this._expr.getSecondExpr$().getType$();
	if (secondExprType == null) {
		return true;
	}
	if (! secondExprType.resolveIfNullable$().equals$LType$(Type.stringType)) {
		context.errors.push(new CompileError(this._token, "only properties of a map object can be deleted"));
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
	return new ConstructorInvocationStatement$0(this._token, this._ctorClassType, Util$cloneArray$ALExpression$(this._args), this._ctorFunctionType);
};


ConstructorInvocationStatement.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	if (this._ctorFunctionType != null) {
		throw new Error("instantiation after analysis?");
	}
	return new ConstructorInvocationStatement$0(this._token, this._ctorClassType.instantiate$LInstantiationContext$B(instantiationContext, false), Util$cloneArray$ALExpression$(this._args), null);
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
	return [ "ConstructorInvocationStatement", this._ctorClassType.serialize$(), Util$serializeArray$ALExpression$(this._args) ];
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
		argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$(context, this._args, null, ctorType.getExpectedTypes$NB(this._args.length, false));
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
		var propertyExpr;
		var srcTypes;
		var instanceofExpr;
		if (expr instanceof NullExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof NewExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof PropertyExpression) {
			propertyExpr = expr;
			srcType = expr.getType$();
			if (srcType != null) {
				propertyExpr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
			srcTypes = propertyExpr.getTypeArguments$();
			if (srcTypes != null) {
				propertyExpr.setTypeArguments$ALType$(srcTypes.map((function (type) {
					return type.instantiate$LInstantiationContext$B(instantiationContext, false);
				})));
			}
		} else if (expr instanceof ArrayLiteralExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof MapLiteralExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof AsExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof AsNoConvertExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof ClassExpression) {
			srcType = expr.getType$();
			if (srcType != null) {
				expr.setType$LType$(srcType.instantiate$LInstantiationContext$B(instantiationContext, false));
			}
		} else if (expr instanceof LocalExpression) {
			expr.setLocal$LLocalVariable$(expr.getLocal$().getInstantiated$());
		} else if (expr instanceof InstanceofExpression) {
			instanceofExpr = expr;
			instanceofExpr.setExpectedType$LType$(instanceofExpr.getExpectedType$().instantiate$LInstantiationContext$B(instantiationContext, false));
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


Expression.prototype.isClassSpecifier$ = function () {
	return false;
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

Expression.prototype.hasSideEffects$ = function () {
	var $this = this;
	return this.hasSideEffects$F$LExpression$UB$((function (expr) {
		return null;
	}));
};


Expression.prototype.hasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	var r;
	r = preCheckCb(this);
	if (r != null) {
		return r;
	}
	return this._doHasSideEffects$F$LExpression$UB$(preCheckCb);
};


Expression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	var $this = this;
	return ! this.forEachExpression$F$LExpression$B$((function (expr) {
		return ! expr.hasSideEffects$F$LExpression$UB$(preCheckCb);
	}));
};


function Expression$getDefaultValueExpressionOf$LType$(type) {
	if (type.equals$LType$(Type.booleanType)) {
		return new BooleanLiteralExpression(new Token$2("false", false));
	} else if (type.equals$LType$(Type.integerType)) {
		return new IntegerLiteralExpression(new Token$2("0", false));
	} else if (type.equals$LType$(Type.numberType)) {
		return new NumberLiteralExpression(new Token$2("0", false));
	} else if (type.equals$LType$(Type.stringType)) {
		return new StringLiteralExpression(new Token$2("\"\"", false));
	} else {
		return new NullExpression(new Token$2("null", false), type);
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
	var returnType;
	var classDef;
	if (! this.argumentTypesAreIdentified$()) {
		context.errors.push(new CompileError(this._token, "argument types were not automatically deductable, please specify them by hand"));
		return false;
	}
	returnType = this._funcDef.getReturnType$();
	if (this._funcDef.isGenerator$()) {
		if (returnType == null) {
			context.errors.push(new CompileError(this._token, "return type was not automatically deductable, please specify them by hand"));
			return false;
		} else if (! (returnType instanceof ObjectType && (classDef = returnType.getClassDef$()) instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Generator")) {
			this._funcDef.setReturnType$LType$(new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Generator", [ Type.voidType, returnType ])));
		}
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
	for (i = 0; i < argTypes.length; ++i) {
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
	for (i = 0; i < this._elements.length; ++i) {
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
	return [ "MapLiteralExpression", this._token.serialize$(), Util$serializeArray$ALMapLiteralElement$(this._elements), Util$serializeNullable$LType$(this._type) ];
};


MapLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var succeeded;
	var i;
	var classDef;
	var expectedType;
	var elementType;
	succeeded = true;
	for (i = 0; i < this._elements.length; ++i) {
		if (! this._elements[i].getExpr$().analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else if (this._elements[i].getExpr$().getType$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot assign void to a map"));
			succeeded = false;
		}
	}
	if (! succeeded) {
		return false;
	}
	if (this._type != null && this._type == Type.variantType) {
	} else if (this._type != null && this._type instanceof ObjectType) {
		classDef = this._type.getClassDef$();
		if (! (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map")) {
			context.errors.push(new CompileError(this._token, "specified type is not a map type"));
			return false;
		}
		expectedType = this._type.getTypeArguments$()[0].toNullableType$();
		for (i = 0; i < this._elements.length; ++i) {
			elementType = this._elements[i].getExpr$().getType$();
			if (! elementType.isConvertibleTo$LType$(expectedType)) {
				context.errors.push(new CompileError(this._token, "cannot assign '" + elementType.toString() + "' to a map of '" + expectedType.toString() + "'"));
				succeeded = false;
			}
		}
	} else if (this._type != null) {
		context.errors.push(new CompileError(this._token, "invalid type for a map literal"));
		return false;
	} else {
		elementType = Type$calcLeastCommonAncestor$ALType$B(this._elements.map((function (elt) {
			return elt.getExpr$().getType$();
		})), true);
		if (elementType == null || elementType.equals$LType$(Type.nullType)) {
			context.errors.push(new CompileError(this._token, "could not deduce map type, please specify"));
			return false;
		}
		if (elementType.equals$LType$(Type.integerType)) {
			elementType = Type.numberType;
		}
		elementType = elementType.resolveIfNullable$();
		this._type = new ObjectType(Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, this._token, "Map", [ elementType ]));
	}
	return succeeded;
};


MapLiteralExpression.prototype.forEachExpression$F$LExpression$F$LExpression$V$B$ = function (cb) {
	var $this = this;
	var i;
	for (i = 0; i < this._elements.length; ++i) {
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
	return new ArrayLiteralExpression(this._token, Util$cloneArray$ALExpression$(this._exprs), this._type);
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
	return [ "ArrayLiteralExpression", this._token.serialize$(), Util$serializeArray$ALExpression$(this._exprs), Util$serializeNullable$LType$(this._type) ];
};


ArrayLiteralExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var succeeded;
	var i;
	var classDef;
	var expectedType;
	var elementType;
	succeeded = true;
	for (i = 0; i < this._exprs.length; ++i) {
		if (! this._exprs[i].analyze$LAnalysisContext$LExpression$(context, this)) {
			succeeded = false;
		} else if (this._exprs[i].getType$().equals$LType$(Type.voidType)) {
			context.errors.push(new CompileError(this._token, "cannot assign void to an array"));
			succeeded = false;
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
		for (i = 0; i < this._exprs.length; ++i) {
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
	this._args = Util$cloneArray$ALExpression$(that._args);
	this._constructor = that._constructor;
};

$__jsx_extend([NewExpression, NewExpression$0], OperatorExpression);
NewExpression.prototype.clone$ = function () {
	return new NewExpression$0(this);
};


NewExpression.prototype.getArguments$ = function () {
	return this._args;
};


NewExpression.prototype.serialize$ = function () {
	return [ "NewExpression", this._token.serialize$(), this._type.serialize$(), Util$serializeArray$ALExpression$(this._args) ];
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
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$(context, this._args, this, ctors.getExpectedTypes$NB(this._args.length, false));
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


NewExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	var classDef;
	var className;
	classDef = this._type.getClassDef$();
	className = classDef.className$().replace(/\.<.*/, "");
	switch (className) {
	case "Object":
	case "Map":
		return false;
	case "Array":
		return false;
	}
	return true;
};


function SuperExpression(token, name, args) {
	OperatorExpression.call(this, token);
	this._name = name;
	this._args = args;
	this._funcType = null;
};

function SuperExpression$0(that) {
	OperatorExpression$0.call(this, that);
	this._name = that._name;
	this._args = Util$cloneArray$ALExpression$(that._args);
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
	return [ "SuperExpression", this._token.serialize$(), this._name.serialize$(), Util$serializeArray$ALExpression$(this._args) ];
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
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$(context, this._args, this, funcType.getExpectedTypes$NB(this._args.length, false));
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


SuperExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
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
	this._args = Util$cloneArray$ALExpression$(that._args);
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
	return [ "CallExpression", this._token.serialize$(), this._expr.serialize$(), Util$serializeArray$ALExpression$(this._args) ];
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
	argTypes = Util$analyzeArgs$LAnalysisContext$ALExpression$LExpression$ALUtil$x2EArgumentTypeRequest$(context, this._args, this, exprType.getExpectedTypes$NB(this._args.length, ! (this._expr instanceof PropertyExpression && ! exprType.isAssignable$() && ! this._expr.getExpr$().isClassSpecifier$())));
	if (argTypes == null) {
		return false;
	}
	if (this._expr instanceof PropertyExpression && ! exprType.isAssignable$()) {
		isCallingStatic = this._expr.getExpr$().isClassSpecifier$();
		if (! isCallingStatic && this._expr.getIdentifierToken$().getValue$() === "constructor") {
			context.errors.push(new CompileError(this._token, "cannot call a constructor other than by using 'new'"));
			return false;
		}
		if (this._expr.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, isCallingStatic) == null) {
			return false;
		}
	} else if (exprType.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, argTypes, true) == null) {
		return false;
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


CallExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
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
	return [ "ConditionalExpression", this._token.serialize$(), this._condExpr.serialize$(), Util$serializeNullable$LExpression$(this._ifTrueExpr), this._ifFalseExpr.serialize$() ];
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
	} else if (expr1Type.isConvertibleTo$LType$(expr2Type) || expr2Type.isConvertibleTo$LType$(expr1Type)) {
	} else if (bool(expr1Type instanceof ObjectType) + bool(expr2Type instanceof ObjectType) === 1 && expr1Type.getClassDef$() == expr2Type.getClassDef$()) {
	} else {
		context.errors.push(new CompileError(this._token, "either side of operator == should be convertible from the other"));
		return false;
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
		if (! this.assertIsConvertibleTo$LAnalysisContext$LExpression$LType$B(context, this._expr1, Type.numberType, true)) {
			return false;
		}
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


function FusedAssignmentExpression(operatorToken, expr1, expr2) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
};

$__jsx_extend([FusedAssignmentExpression], BinaryExpression);
FusedAssignmentExpression.prototype.clone$ = function () {
	return new FusedAssignmentExpression(this._token, this._expr1.clone$(), this._expr2.clone$());
};


FusedAssignmentExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var lhsType;
	var rhsType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
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


FusedAssignmentExpression.prototype.getType$ = function () {
	return this._expr1.getType$();
};


FusedAssignmentExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	return true;
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
	if (this._expr2 instanceof ArrayLiteralExpression && this._expr2.getExprs$().length === 0 && this._expr2.getType$() == null || this._expr2 instanceof MapLiteralExpression && this._expr2.getElements$().length === 0 && this._expr2.getType$() == null) {
		if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
			return false;
		}
		if (! AssignmentExpression$analyzeEmptyLiteralAssignment$LAnalysisContext$LToken$LType$LExpression$(context, this._token, this._expr1.getType$(), this._expr2)) {
			return false;
		}
		if (! this._expr1.assertIsAssignable$LAnalysisContext$LToken$LType$(context, this._token, this._expr2.getType$())) {
			return false;
		}
		if (! this._expr2.analyze$LAnalysisContext$LExpression$(context, this)) {
			return false;
		}
		return true;
	}
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	rhsType = this._expr2.getType$();
	if (rhsType == null) {
		return false;
	}
	if (rhsType.equals$LType$(Type.voidType)) {
		context.errors.push(new CompileError(this._token, "cannot assign void"));
		return false;
	}
	if (this._expr2.isClassSpecifier$()) {
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


function AssignmentExpression$analyzeEmptyLiteralAssignment$LAnalysisContext$LToken$LType$LExpression$(context, token, lhsType, rhs) {
	var classDef;
	if (lhsType == null) {
		context.errors.push(new CompileError(token, "either side of the operator should be fully type-qualified"));
		return false;
	}
	if (rhs instanceof ArrayLiteralExpression) {
		if (! (lhsType instanceof ObjectType && (classDef = lhsType.getClassDef$()) instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Array")) {
			context.errors.push(new CompileError(token, "cannot deduce the type of [] because left-hand-side expression is not of Array type"));
			return false;
		}
		rhs.setType$LType$(lhsType);
	} else {
		if (! (lhsType instanceof ObjectType && (classDef = lhsType.getClassDef$()) instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === "Map")) {
			context.errors.push(new CompileError(token, "cannot deduce the type of {} because left-hand-side expression is not of Map type"));
			return false;
		}
		rhs.setType$LType$(lhsType);
	}
	return true;
};

AssignmentExpression.analyzeEmptyLiteralAssignment$LAnalysisContext$LToken$LType$LExpression$ = AssignmentExpression$analyzeEmptyLiteralAssignment$LAnalysisContext$LToken$LType$LExpression$;

AssignmentExpression.prototype._analyzeFunctionExpressionAssignment$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	if (! this._expr1.analyze$LAnalysisContext$LExpression$(context, this)) {
		return false;
	}
	if (this._expr1.getType$() == null) {
		if (! this._expr2.typesAreIdentified$()) {
			context.errors.push(new CompileError(this._token, "either side of the operator should be fully type-qualified : " + (this._expr2.argumentTypesAreIdentified$() ? "return type not declared" : "argument / return types not declared")));
			return false;
		}
	} else if (! this._expr1.getType$().equals$LType$(Type.variantType)) {
		if (this._expr1.getType$() instanceof ResolvedFunctionType) {
			if (! this._expr2.deductTypeIfUnknown$LAnalysisContext$LResolvedFunctionType$(context, this._expr1.getType$())) {
				return false;
			}
		} else {
			context.errors.push(new CompileError(this._token, Util$format$SAS("%1 is not convertible to %2", [ this._expr2.getType$().toString(), this._expr1.getType$().toString() ])));
			return false;
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


AssignmentExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	return true;
};


function ArrayExpression(operatorToken, expr1, expr2) {
	ArrayExpression$0.call(this, operatorToken, expr1, expr2, null);
};

function ArrayExpression$0(operatorToken, expr1, expr2, type) {
	BinaryExpression.call(this, operatorToken, expr1, expr2);
	this._type = type;
};

$__jsx_extend([ArrayExpression, ArrayExpression$0], BinaryExpression);
ArrayExpression.prototype.clone$ = function () {
	return new ArrayExpression$0(this._token, this._expr1.clone$(), this._expr2.clone$(), this._type);
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
	} else if (expr1Type.equals$LType$(Type.variantType)) {
		return this._analyzeApplicationOnVariant$LAnalysisContext$(context);
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


ArrayExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	if (! Util$isBuiltInClass$LType$(this._expr1.getType$()) && Util$rootIsNativeClass$LType$(this._expr1.getType$())) {
		return true;
	}
	return Expression.prototype._doHasSideEffects$F$LExpression$UB$.call(this, preCheckCb);
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
	var $this = this;
	var typeIsNumber;
	var typeIsString;
	var expr1Type;
	var expr2Type;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	function typeIsNumber(type) {
		return type.isConvertibleTo$LType$(Type.numberType) || type instanceof ObjectType && type.getClassDef$() == Type.numberType.getClassDef$();
	}
	function typeIsString(type) {
		return type.equals$LType$(Type.stringType) || type instanceof ObjectType && type.getClassDef$() == Type.stringType.getClassDef$();
	}
	expr1Type = this._expr1.getType$().resolveIfNullable$();
	expr2Type = this._expr2.getType$().resolveIfNullable$();
	if (typeIsNumber(expr1Type) && typeIsNumber(expr2Type)) {
		this._type = (expr1Type instanceof NumberType || expr2Type instanceof NumberType ? Type.numberType : Type.integerType);
	} else if (typeIsString(expr1Type) && typeIsString(expr2Type)) {
		this._type = expr1Type;
	} else if (typeIsString(expr1Type) && typeIsNumber(expr2Type) || typeIsNumber(expr1Type) && typeIsString(expr2Type)) {
		if (typeIsNumber(expr1Type)) {
			this._expr1 = new AsExpression(new Token$2("as", false), this._expr1, Type.stringType);
		} else {
			this._expr2 = new AsExpression(new Token$2("as", false), this._expr2, Type.stringType);
		}
		this._type = Type.stringType;
	} else {
		context.errors.push(new CompileError(this._token, "cannot apply operator '+' to '" + expr1Type.toString() + "' and '" + expr2Type.toString() + "'"));
		return false;
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


function YieldExpression(operatorToken, expr) {
	YieldExpression$0.call(this, operatorToken, expr, null, null);
};

function YieldExpression$0(operatorToken, expr, seedType, genType) {
	UnaryExpression.call(this, operatorToken, expr);
	this._seedType = seedType;
	this._genType = genType;
};

$__jsx_extend([YieldExpression, YieldExpression$0], UnaryExpression);
YieldExpression.prototype.clone$ = function () {
	return new YieldExpression$0(this._token, this._expr.clone$(), this._seedType, this._genType);
};


YieldExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var returnType;
	var genType;
	if (! this._analyze$LAnalysisContext$(context)) {
		return false;
	}
	returnType = context.funcDef.getReturnType$();
	if (returnType == null) {
		context.errors.push(new CompileError(this._token, "cannot deduce yield expression type"));
		return false;
	} else if (returnType instanceof ObjectType && returnType.getClassDef$() instanceof InstantiatedClassDefinition && returnType.getClassDef$().getTemplateClassName$() === "Generator") {
		this._seedType = returnType.getClassDef$().getTypeArguments$()[0];
		genType = returnType.getClassDef$().getTypeArguments$()[1];
	} else {
		context.errors.push(new CompileError(this._token, "cannot convert 'Generator' to return type '" + returnType.toString() + "'"));
		return false;
	}
	if (! this._expr.getType$().isConvertibleTo$LType$(genType)) {
		context.errors.push(new CompileError(this._token, "cannot convert '" + this._expr.getType$().toString() + "' to yield type '" + genType.toString() + "'"));
		return false;
	}
	this._genType = genType;
	return true;
};


YieldExpression.prototype.getType$ = function () {
	return this._seedType.toNullableType$();
};


YieldExpression.prototype.getSeedType$ = function () {
	return this._seedType;
};


YieldExpression.prototype.getGenType$ = function () {
	return this._genType;
};


YieldExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	return true;
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
	if (this._token.getValue$() === "-") {
		return Type.numberType;
	}
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
	this._isInner = false;
};

$__jsx_extend([PropertyExpression, PropertyExpression$0], UnaryExpression);
PropertyExpression.prototype.clone$ = function () {
	var propExpr;
	propExpr = new PropertyExpression$0(this._token, this._expr.clone$(), this._identifierToken, this._typeArgs, this._type);
	propExpr._isInner = this._isInner;
	return propExpr;
};


PropertyExpression.prototype.getIdentifierToken$ = function () {
	return this._identifierToken;
};


PropertyExpression.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


PropertyExpression.prototype.setTypeArguments$ALType$ = function (types) {
	this._typeArgs = types;
};


PropertyExpression.prototype.serialize$ = function () {
	return [ "PropertyExpression", this._expr.serialize$(), this._identifierToken.serialize$(), Util$serializeNullable$LType$(this._type) ];
};


PropertyExpression.prototype.analyze$LAnalysisContext$LExpression$ = function (context, parentExpr) {
	var $this = this;
	var exprType;
	var classDef;
	var innerClassDef;
	var objectType;
	var error;
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
	if (this._expr.isClassSpecifier$()) {
		innerClassDef = classDef.lookupInnerClass$S(this._identifierToken.getValue$());
		if (innerClassDef == null) {
			classDef.forEachTemplateInnerClass$F$LTemplateClassDefinition$B$((function (classDef) {
				if (classDef.className$() === $this._identifierToken.getValue$()) {
					innerClassDef = classDef;
					return false;
				}
				return true;
			}));
		}
		if (innerClassDef) {
			objectType = new ParsedObjectType(new QualifiedName$1(this._identifierToken, exprType), this._typeArgs);
			objectType.resolveType$LAnalysisContext$(context);
			this._type = objectType;
			this._isInner = true;
			return true;
		}
	}
	this._type = classDef.getMemberTypeByName$ALCompileError$LToken$SBALType$N(context.errors, this._identifierToken, this._identifierToken.getValue$(), this._expr.isClassSpecifier$(), this._typeArgs, (this._expr.isClassSpecifier$() ? ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY : ClassDefinition.GET_MEMBER_MODE_ALL));
	if (this._type == null) {
		error = new CompileError(this._identifierToken, "'" + exprType.toString() + "' does not have a property or inner class named '" + this._identifierToken.getValue$() + "'");
		classDef.forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
			return classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				if (Util$ld$SS(member.name$(), $this._identifierToken.getValue$()) < 2) {
					error.addCompileNote$LCompileNote$(new CompileNote(member.getNameToken$(), "candidates: " + member.getNotation$()));
					if (error.getCompileNotes$().length > 3) {
						return false;
					}
				}
				return true;
			}));
		}));
		context.errors.push(error);
		return false;
	}
	return true;
};


PropertyExpression.prototype.getType$ = function () {
	return this._type;
};


PropertyExpression.prototype.setType$LType$ = function (type) {
	this._type = type;
};


PropertyExpression.prototype.getHolderType$ = function () {
	var type;
	type = this._expr.getType$();
	if (type instanceof PrimitiveType) {
		type = new ObjectType(type.getClassDef$());
	}
	return type;
};


PropertyExpression.prototype.isClassSpecifier$ = function () {
	return this._isInner;
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
	} else if ((varFlags & ClassDefinition.IS_READONLY) !== 0) {
		context.errors.push(new CompileError(token, "cannot modify a readonly variable"));
		return false;
	}
	return true;
};


PropertyExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	if (this.isClassSpecifier$()) {
		return false;
	}
	if (! Util$isBuiltInClass$LType$(this._expr.getType$()) && Util$rootIsNativeClass$LType$(this._expr.getType$())) {
		return true;
	}
	return Expression.prototype._doHasSideEffects$F$LExpression$UB$.call(this, preCheckCb);
};


PropertyExpression.prototype.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B = function (context, operatorToken, argTypes, isStatic) {
	var i;
	var rhsType;
	for (i = 0; i < argTypes.length; ++i) {
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


IncrementExpression.prototype._doHasSideEffects$F$LExpression$UB$ = function (preCheckCb) {
	return true;
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
	} else if (exprType instanceof PrimitiveType) {
		if (this._type instanceof PrimitiveType) {
			success = true;
		}
	} else if (exprType.equals$LType$(Type.variantType)) {
		success = true;
	} else if (exprType instanceof ObjectType) {
		if (this._type instanceof ObjectType && this._type.isConvertibleTo$LType$(exprType)) {
			success = true;
		}
	} else if (this._expr instanceof PropertyExpression && exprType instanceof FunctionType && this._type instanceof StaticFunctionType) {
		deducedType = this._expr.deduceByArgumentTypes$LAnalysisContext$LToken$ALType$B(context, this._token, this._type.getArgumentTypes$(), true);
		if (deducedType != null) {
			exprType = deducedType;
			if (deducedType.getReturnType$().equals$LType$(this._type.getReturnType$())) {
				success = true;
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
	} else if (exprType.equals$LType$(Type.variantType)) {
	} else {
		context.errors.push(new CompileError(this._token, "operator 'instanceof' is only applicable to an object or a variant"));
		return false;
	}
	if (this._expectedType.getClassDef$().flags$() & ClassDefinition.IS_FAKE) {
		context.errors.push(new CompileError(this._token, "operator 'instanceof' is not applicable to a fake class " + this._expectedType.toString()));
		return false;
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


function ThisExpression(token, classDef) {
	LeafExpression.call(this, token);
	this._classDef = classDef;
};

$__jsx_extend([ThisExpression], LeafExpression);
ThisExpression.prototype.clone$ = function () {
	return new ThisExpression(this._token, this._classDef);
};


ThisExpression.prototype.serialize$ = function () {
	return [ "ThisExpression", this._token.serialize$(), (this._classDef != null ? this._classDef.getToken$().serialize$() : null) ];
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


function PrimitiveLiteralExpression(token) {
	LeafExpression.call(this, token);
};

$__jsx_extend([PrimitiveLiteralExpression], LeafExpression);
function StringLiteralExpression(token) {
	PrimitiveLiteralExpression.call(this, token);
};

$__jsx_extend([StringLiteralExpression], PrimitiveLiteralExpression);
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


StringLiteralExpression.prototype.toNormalizedString$ = function () {
	return this.getDecoded$();
};


StringLiteralExpression.prototype.tokenIsECMA262Conformant$ = function () {
	return this._token.getValue$().match(/^(?:"""|''')/) == null;
};


StringLiteralExpression.prototype.getDecoded$ = function () {
	return Util$decodeStringLiteral$S(this._token.getValue$());
};


function FileMacroExpression(token) {
	StringLiteralExpression.call(this, token);
};

$__jsx_extend([FileMacroExpression], StringLiteralExpression);
FileMacroExpression.prototype.clone$ = function () {
	return new FileMacroExpression(this._token);
};


FileMacroExpression.prototype.serialize$ = function () {
	var json;
	json = StringLiteralExpression.prototype.serialize$.call(this);
	json[0] = "FileMacroExpression";
	return json;
};


FileMacroExpression.prototype.tokenIsECMA262Conformant$ = function () {
	return false;
};


FileMacroExpression.prototype.getDecoded$ = function () {
	return this._token.getFilename$();
};


function NumberLiteralExpression(token) {
	PrimitiveLiteralExpression.call(this, token);
};

$__jsx_extend([NumberLiteralExpression], PrimitiveLiteralExpression);
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


NumberLiteralExpression.prototype.toNormalizedString$ = function () {
	return this.getDecoded$() + "";
};


NumberLiteralExpression.prototype.tokenIsECMA262Conformant$ = function () {
	return true;
};


NumberLiteralExpression.prototype.getDecoded$ = function () {
	return +this._token.getValue$();
};


function LineMacroExpression(token) {
	NumberLiteralExpression.call(this, token);
};

$__jsx_extend([LineMacroExpression], NumberLiteralExpression);
LineMacroExpression.prototype.clone$ = function () {
	return new LineMacroExpression(this._token);
};


LineMacroExpression.prototype.serialize$ = function () {
	var json;
	json = NumberLiteralExpression.prototype.serialize$.call(this);
	json[0] = "LineMacroExpression";
	return json;
};


LineMacroExpression.prototype.tokenIsECMA262Conformant$ = function () {
	return false;
};


LineMacroExpression.prototype.getDecoded$ = function () {
	return this._token.getLineNumber$();
};


function IntegerLiteralExpression(token) {
	PrimitiveLiteralExpression.call(this, token);
};

$__jsx_extend([IntegerLiteralExpression], PrimitiveLiteralExpression);
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


IntegerLiteralExpression.prototype.toNormalizedString$ = function () {
	return this.getDecoded$() + "";
};


IntegerLiteralExpression.prototype.getDecoded$ = function () {
	return this._token.getValue$() | 0;
};


function BooleanLiteralExpression(token) {
	PrimitiveLiteralExpression.call(this, token);
};

$__jsx_extend([BooleanLiteralExpression], PrimitiveLiteralExpression);
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


BooleanLiteralExpression.prototype.toNormalizedString$ = function () {
	return this._token.getValue$();
};


BooleanLiteralExpression.prototype.getDecoded$ = function () {
	return this._token.getValue$() !== "false";
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


ClassExpression.prototype.isClassSpecifier$ = function () {
	return true;
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
	if (parentExpr instanceof AssignmentExpression && parentExpr.getFirstExpr$() == this || parentExpr == null && context.statement instanceof ForInStatement && context.statement.getLHSExpr$() == this) {
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
	} else if (! type.isConvertibleTo$LType$(this._local.getType$())) {
		context.errors.push(new CompileError(token, "cannot assign a value of type '" + type.toString() + "' to '" + this._local.getType$().toString() + "'"));
		return false;
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
	this._runenv = "";
	this._output = "";
	this._outputEndsWithReturn = false;
	this._outputFile = null;
	this._indent = 0;
	this._emittingClass = null;
	this._emittingFunction = null;
	this._usesGenerator = false;
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

JavaScriptEmitter.prototype.isSpecialCall$LCallExpression$ = function (callExpr) {
	var calleeExpr;
	var propExpr;
	calleeExpr = callExpr.getExpr$();
	if (! (calleeExpr instanceof PropertyExpression)) {
		return false;
	}
	propExpr = calleeExpr;
	return this._isJsEval$LPropertyExpression$(propExpr) || this._isJsInvoke$LPropertyExpression$(propExpr) || this._isCallToMap$LPropertyExpression$(propExpr);
};


JavaScriptEmitter.prototype.isJsModule$LClassDefinition$ = function (classDef) {
	return classDef.className$() === "js" && classDef.getToken$().getFilename$() === Util$resolvePath$S(this._platform.getRoot$() + "/lib/js/js.jsx");
};


JavaScriptEmitter.prototype._isJsEval$LPropertyExpression$ = function (calleeExpr) {
	var classDef;
	if (! (calleeExpr.getType$() instanceof StaticFunctionType)) {
		return false;
	}
	if (calleeExpr.getIdentifierToken$().getValue$() !== "eval") {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! this.isJsModule$LClassDefinition$(classDef)) {
		return false;
	}
	return true;
};


JavaScriptEmitter.prototype._isJsInvoke$LPropertyExpression$ = function (calleeExpr) {
	var classDef;
	if (! (calleeExpr.getType$() instanceof StaticFunctionType)) {
		return false;
	}
	if (calleeExpr.getIdentifierToken$().getValue$() !== "invoke") {
		return false;
	}
	classDef = calleeExpr.getExpr$().getType$().getClassDef$();
	if (! this.isJsModule$LClassDefinition$(classDef)) {
		return false;
	}
	return true;
};


JavaScriptEmitter.prototype._isCallToMap$LPropertyExpression$ = function (calleeExpr) {
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
	case "hasOwnProperty":
	case "keys":
		return true;
	default:
		return false;
	}
};


JavaScriptEmitter.prototype.setRunEnv$S = function (runenv) {
	this._runenv = runenv;
};


JavaScriptEmitter.prototype.getSearchPaths$ = function () {
	return [ this._platform.getRoot$() + "/lib/js" ];
};


JavaScriptEmitter.prototype.setOutputFile$US = function (name) {
	if (name == null) {
		return;
	}
	this._outputFile = Util$resolvePath$S(name);
};


JavaScriptEmitter.prototype.getSourceMappingFiles$ = function () {
	var $this = this;
	var files;
	var sourceMapper;
	files = {};
	sourceMapper = this._sourceMapper;
	if (sourceMapper != null && this._outputFile != null) {
		sourceMapper.getSourceFiles$().forEach((function (filename) {
			try {
				sourceMapper.setSourceContent$SS(filename, $this._platform.load$S(filename));
			} catch ($__jsx_catch_0) {
				if ($__jsx_catch_0 instanceof Error) {
					if (JSX.DEBUG) {
						$this._platform.error$S("XXX: " + $__jsx_catch_0.toString());
					}
				} else {
					throw $__jsx_catch_0;
				}
			}
		}));
		files[sourceMapper.getSourceMappingFile$()] = sourceMapper.generate$();
	}
	return files;
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
	return this._sourceMapper != null;
};


JavaScriptEmitter.prototype.setEnableSourceMap$B = function (enable) {
	this._sourceMapper = (enable ? new SourceMapper(this._platform.getRoot$(), this._outputFile, this._runenv) : null);
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
	this._indent = 0;
	this._emittingClass = null;
	this._emittingFunction = null;
	this._output += "// generatedy by JSX compiler " + Meta.IDENTIFIER + "\n";
	this._output += this._fileHeader;
	this._output += this._platform.load$S(this._platform.getRoot$() + "/lib/js/rt/bootstrap.js");
	stash = this.getStash$S(_NoDebugCommand.IDENTIFIER);
	this._emit$SLToken$("JSX.DEBUG = " + (stash == null || stash.debugValue ? "true" : "false") + ";\n", null);
};


JavaScriptEmitter.prototype._emitCore$ALClassDefinition$ = function (classDefs) {
	var $this = this;
	var i;
	for (i = 0; i < classDefs.length; ++i) {
		classDefs[i].forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFuncDef(funcDef) {
			funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(onFuncDef);
			if (funcDef.isGenerator$()) {
				$this._usesGenerator = true;
			}
			$this._setupBooleanizeFlags$LMemberFunctionDefinition$(funcDef);
			return true;
		}));
		classDefs[i].forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0 && varDef.getInitialValue$() != null) {
				$this._setupBooleanizeFlags$LExpression$(varDef.getInitialValue$());
			}
			return true;
		}));
	}
	for (i = 0; i < classDefs.length; ++i) {
		this._emitClassDefinition$LClassDefinition$(classDefs[i]);
	}
	for (i = 0; i < classDefs.length; ++i) {
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
	stash = stashable.getStash$S("jsemitter");
	if (stash == null) {
		stash = stashable.setStash$SLStash$("jsemitter", new _JSEmitterStash());
	}
	return stash;
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
			} else if (parentExpr.length === 0) {
			} else if (parentExpr[0] instanceof LogicalExpression || parentExpr[0] instanceof LogicalNotExpression) {
				shouldBooleanize = false;
			} else if (parentExpr[0] instanceof ConditionalExpression && parentExpr[0].getCondExpr$() == expr) {
				shouldBooleanize = false;
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
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		if (classDef.getNativeSource$() != null) {
			this._emit$SLToken$("var " + this._namer.getNameOfClass$LClassDefinition$(classDef) + " = " + Util$decodeStringLiteral$S(classDef.getNativeSource$().getValue$()) + ";\n", classDef.getNativeSource$());
		}
		return;
	}
	this._emittingClass = classDef;
	try {
		ctors = _Util$findFunctions$LClassDefinition$SB(classDef, "constructor", false);
		for (i = 0; i < ctors.length; ++i) {
			this._emitConstructor$LMemberFunctionDefinition$(ctors[i]);
		}
		this._emitClassObjectAmendments$LClassDefinition$ALMemberFunctionDefinition$(classDef, ctors);
		members = classDef.members$();
		for (i = 0; i < members.length; ++i) {
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
	if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return;
	}
	members = classDef.members$();
	for (i = 0; i < members.length; ++i) {
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
			++i;
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
				if (ctors.length !== 0) {
					exportedCtor = null;
					for (i = 0; i < ctors.length; ++i) {
						if ((ctors[i].flags$() & ClassDefinition.IS_EXPORT) !== 0) {
							exportedCtor = ctors[i];
						}
					}
					if (exportedCtor == null) {
						exportedCtor = ctors[0];
					}
					list.push([ classDef.classFullName$(), $this._namer.getNameOfConstructor$LClassDefinition$ALType$(classDef, exportedCtor.getArgumentTypes$()) ]);
				} else {
					list.push([ classDef.classFullName$(), $this._namer.getNameOfClass$LClassDefinition$(classDef) ]);
				}
			}
			if (! $this._enableMinifier) {
				if ((classDef.flags$() & ClassDefinition.IS_EXPORT) === 0) {
					list.push([ classDef.classFullName$(), $this._namer.getNameOfClass$LClassDefinition$(classDef) ]);
				}
				push = (function (argTypes) {
					list.push([ classDef.classFullName$() + $this._mangler.mangleFunctionArguments$ALType$(argTypes), $this._namer.getNameOfConstructor$LClassDefinition$ALType$(classDef, argTypes) ]);
				});
				for (i = 0; i < ctors.length; ++i) {
					push(ctors[i].getArgumentTypes$());
				}
			}
		});
		filename = classDefs[0].getToken$().getFilename$();
		pushClass(classDefs.shift());
		for (i = 0; i < classDefs.length; ) {
			if (classDefs[i].getToken$().getFilename$() === filename) {
				pushClass(classDefs[i]);
				classDefs.splice(i, 1);
			} else {
				++i;
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
			for (i = 0; i < list.length; ++i) {
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
	output = "";
	if (this._sourceMapper) {
		output += this._sourceMapper.getSourceMapHeader$();
	}
	output += this._output + "\n";
	if (this._enableProfiler) {
		output += this._platform.load$S(this._platform.getRoot$() + "/lib/js/rt/profiler.js");
	}
	if (this._bootstrapBuilder != null) {
		output = this._bootstrapBuilder.addBootstrap$S(output);
	}
	output += this._fileFooter;
	if (this._sourceMapper) {
		output += this._sourceMapper.getSourceMapFooter$();
	}
	if (this._enableMinifier) {
		if (! this._usesGenerator) {
			output = _Minifier$minifyJavaScript$S(output);
		}
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
		for (i = 0; i < constructors.length; ++i) {
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
		for (i = 0; i < implementTypes.length; ++i) {
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
		for (i = implementTypes.length - 1; i >= 0 && Object.keys(unresolvedExports).length !== 0; --i) {
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
	} else if (Util$memberIsExported$LClassDefinition$SALType$B(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$(), false)) {
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + ".prototype." + funcDef.name$() + " = " + this._namer.getNameOfClass$LClassDefinition$(funcDef.getClassDef$()) + ".prototype." + this._namer.getNameOfMethod$LClassDefinition$SALType$(funcDef.getClassDef$(), funcDef.name$(), funcDef.getArgumentTypes$()) + ";\n", null);
	}
	this._emit$SLToken$("\n", null);
};


JavaScriptEmitter.prototype._emitFunctionArguments$LMemberFunctionDefinition$ = function (funcDef) {
	var args;
	var i;
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++i) {
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
	var tempVars;
	var statements;
	prevEmittingFunction = this._emittingFunction;
	try {
		this._emittingFunction = funcDef;
		if (this._enableProfiler) {
			this._emit$SLToken$("var $__jsx_profiler_ctx = $__jsx_profiler.enter(" + Util$encodeStringLiteral$S(funcDef.getNotation$()) + ");\n", null);
		}
		if (funcDef.getParent$() == null && (funcDef.flags$() & ClassDefinition.IS_STATIC) === 0 && funcDef.getClosures$().length !== 0) {
			this._emit$SLToken$("var $this = this;\n", null);
		}
		locals = funcDef.getLocals$();
		for (i = 0; i < locals.length; ++i) {
			type = locals[i].getType$();
			if (type == null) {
				continue;
			}
			this._emit$SLToken$("var " + this._namer.getNameOfLocalVariable$LLocalVariable$(locals[i]) + ";\n", null);
		}
		tempVars = new _TempVarLister().update$LMemberFunctionDefinition$(funcDef).finalize$();
		for (i = 0; i !== tempVars.length; ++i) {
			this._emit$SLToken$("var " + tempVars[i] + ";\n", null);
		}
		statements = funcDef.getStatements$();
		for (i = 0; i < statements.length; ++i) {
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
	var $this = this;
	var initialValue;
	var tempVars;
	var i;
	initialValue = variable.getInitialValue$();
	if (initialValue != null && initialValue.hasSideEffects$F$LExpression$UB$((function (expr) {
		var holderExpr;
		if (expr instanceof PropertyExpression) {
			holderExpr = expr.getExpr$();
			if (holderExpr instanceof ClassExpression || holderExpr instanceof PropertyExpression && holderExpr.isClassSpecifier$()) {
				return true;
			}
		} else if (expr instanceof NewExpression) {
			if (_Util$getNewExpressionInliner$LNewExpression$(expr) != null) {
				return false;
			}
		}
		return null;
	}))) {
		this._emit$SLToken$("$__jsx_lazy_init(", variable.getNameToken$());
		this._emit$SLToken$(this._namer.getNameOfClass$LClassDefinition$(variable.getClassDef$()) + ", \"" + this._namer.getNameOfStaticVariable$LClassDefinition$S(variable.getClassDef$(), variable.name$()) + "\", function () {\n", variable.getNameToken$());
		this._advanceIndent$();
		tempVars = new _TempVarLister().update$LExpression$(initialValue).finalize$();
		for (i = 0; i !== tempVars.length; ++i) {
			this._emit$SLToken$("var " + tempVars[i] + ";\n", variable.getNameToken$());
		}
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


JavaScriptEmitter.prototype._emitStatements$ALStatement$ = function (statements) {
	var i;
	this._advanceIndent$();
	for (i = 0; i < statements.length; ++i) {
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
	this._sourceMapper.add$SNNUSUS(this._output, token.getLineNumber$(), token.getColumnNumber$(), token.isIdentifier$() ? token.getValue$() : null, token.getFilename$());
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
	++this._indent;
};


JavaScriptEmitter.prototype._reduceIndent$ = function () {
	if (--this._indent < 0) {
		throw new Error("indent mistach");
	}
};


JavaScriptEmitter.prototype._getIndent$ = function () {
	var s;
	var i;
	s = "";
	for (i = 0; i < this._indent; ++i) {
		s += "\t";
	}
	return s;
};


JavaScriptEmitter.prototype._getStatementEmitterFor$LStatement$ = function (statement) {
	if (statement instanceof ConstructorInvocationStatement) {
		return new _ConstructorInvocationStatementEmitter(this, statement);
	} else if (statement instanceof ExpressionStatement) {
		return new _ExpressionStatementEmitter(this, statement);
	} else if (statement instanceof FunctionStatement) {
		return new _FunctionStatementEmitter(this, statement);
	} else if (statement instanceof ReturnStatement) {
		return new _ReturnStatementEmitter(this, statement);
	} else if (statement instanceof DeleteStatement) {
		return new _DeleteStatementEmitter(this, statement);
	} else if (statement instanceof BreakStatement) {
		return new _BreakStatementEmitter(this, statement);
	} else if (statement instanceof ContinueStatement) {
		return new _ContinueStatementEmitter(this, statement);
	} else if (statement instanceof DoWhileStatement) {
		return new _DoWhileStatementEmitter(this, statement);
	} else if (statement instanceof ForInStatement) {
		return new _ForInStatementEmitter(this, statement);
	} else if (statement instanceof ForStatement) {
		return new _ForStatementEmitter(this, statement);
	} else if (statement instanceof IfStatement) {
		return new _IfStatementEmitter(this, statement);
	} else if (statement instanceof SwitchStatement) {
		return new _SwitchStatementEmitter(this, statement);
	} else if (statement instanceof CaseStatement) {
		return new _CaseStatementEmitter(this, statement);
	} else if (statement instanceof DefaultStatement) {
		return new _DefaultStatementEmitter(this, statement);
	} else if (statement instanceof WhileStatement) {
		return new _WhileStatementEmitter(this, statement);
	} else if (statement instanceof TryStatement) {
		return new _TryStatementEmitter(this, statement);
	} else if (statement instanceof CatchStatement) {
		return new _CatchStatementEmitter(this, statement);
	} else if (statement instanceof ThrowStatement) {
		return new _ThrowStatementEmitter(this, statement);
	} else if (statement instanceof AssertStatement) {
		return new _AssertStatementEmitter(this, statement);
	} else if (statement instanceof LogStatement) {
		return new _LogStatementEmitter(this, statement);
	} else if (statement instanceof DebuggerStatement) {
		return new _DebuggerStatementEmitter(this, statement);
	}
	throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize$()));
};


JavaScriptEmitter.prototype._getExpressionEmitterFor$LExpression$ = function (expr) {
	if (expr instanceof LocalExpression) {
		return new _LocalExpressionEmitter(this, expr);
	} else if (expr instanceof ClassExpression) {
		return new _ClassExpressionEmitter(this, expr);
	} else if (expr instanceof NullExpression) {
		return new _NullExpressionEmitter(this, expr);
	} else if (expr instanceof BooleanLiteralExpression) {
		return new _BooleanLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof IntegerLiteralExpression) {
		return new _IntegerLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof NumberLiteralExpression) {
		return new _NumberLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof StringLiteralExpression) {
		return new _StringLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof RegExpLiteralExpression) {
		return new _RegExpLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof ArrayLiteralExpression) {
		return new _ArrayLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof MapLiteralExpression) {
		return new _MapLiteralExpressionEmitter(this, expr);
	} else if (expr instanceof ThisExpression) {
		return new _ThisExpressionEmitter(this, expr);
	} else if (expr instanceof BitwiseNotExpression) {
		return new _UnaryExpressionEmitter(this, expr);
	} else if (expr instanceof InstanceofExpression) {
		return new _InstanceofExpressionEmitter(this, expr);
	} else if (expr instanceof AsExpression) {
		return new _AsExpressionEmitter(this, expr);
	} else if (expr instanceof AsNoConvertExpression) {
		return new _AsNoConvertExpressionEmitter(this, expr);
	} else if (expr instanceof LogicalNotExpression) {
		return new _UnaryExpressionEmitter(this, expr);
	} else if (expr instanceof TypeofExpression) {
		return new _UnaryExpressionEmitter(this, expr);
	} else if (expr instanceof PostIncrementExpression) {
		return new _PostIncrementExpressionEmitter(this, expr);
	} else if (expr instanceof PreIncrementExpression) {
		return new _PreIncrementExpressionEmitter(this, expr);
	} else if (expr instanceof PropertyExpression) {
		return new _PropertyExpressionEmitter(this, expr);
	} else if (expr instanceof SignExpression) {
		return new _UnaryExpressionEmitter(this, expr);
	} else if (expr instanceof YieldExpression) {
		return new _UnaryExpressionEmitter(this, expr);
	} else if (expr instanceof AdditiveExpression) {
		return new _AdditiveExpressionEmitter(this, expr);
	} else if (expr instanceof ArrayExpression) {
		return new _ArrayExpressionEmitter(this, expr);
	} else if (expr instanceof AssignmentExpression) {
		return new _AssignmentExpressionEmitter(this, expr);
	} else if (expr instanceof FusedAssignmentExpression) {
		return new _FusedAssignmentExpressionEmitter(this, expr);
	} else if (expr instanceof BinaryNumberExpression) {
		return new _BinaryNumberExpressionEmitter(this, expr);
	} else if (expr instanceof EqualityExpression) {
		return new _EqualityExpressionEmitter(this, expr);
	} else if (expr instanceof InExpression) {
		return new _InExpressionEmitter(this, expr);
	} else if (expr instanceof LogicalExpression) {
		return new _LogicalExpressionEmitter(this, expr);
	} else if (expr instanceof ShiftExpression) {
		return new _ShiftExpressionEmitter(this, expr);
	} else if (expr instanceof ConditionalExpression) {
		return new _ConditionalExpressionEmitter(this, expr);
	} else if (expr instanceof CallExpression) {
		return new _CallExpressionEmitter(this, expr);
	} else if (expr instanceof SuperExpression) {
		return new _SuperExpressionEmitter(this, expr);
	} else if (expr instanceof NewExpression) {
		return new _NewExpressionEmitter(this, expr);
	} else if (expr instanceof FunctionExpression) {
		return new _FunctionExpressionEmitter(this, expr);
	} else if (expr instanceof CommaExpression) {
		return new _CommaExpressionEmitter(this, expr);
	}
	throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize$()) : expr.toString()));
};


JavaScriptEmitter.prototype._emitCallArguments$LToken$SALExpression$ALType$ = function (token, prefix, args, argTypes) {
	var i;
	var argType;
	this._emit$SLToken$(prefix, token);
	for (i = 0; i < args.length; ++i) {
		if (i !== 0 || prefix.charAt(prefix.length - 1) !== '(') {
			this._emit$SLToken$(", ", null);
		}
		argType = null;
		if (argTypes != null) {
			if (i < argTypes.length) {
				argType = argTypes[i];
			} else if (argTypes.length !== 0 && argTypes[argTypes.length - 1] instanceof VariableLengthArgumentType) {
				argType = argTypes[argTypes.length - 1];
			}
			if (argType instanceof VariableLengthArgumentType) {
				argType = argType.getBaseType$();
			}
		}
		if (argType != null && ! Type.nullType.isConvertibleTo$LType$(argType)) {
			this._emitRHSOfAssignment$LExpression$LType$(args[i], argType);
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


JavaScriptEmitter.prototype._emitAssertionWithMsg$F$V$LToken$SLExpression$ = function (emitTestExpr, token, message, msgExpr) {
	var s;
	this._emit$SLToken$("if (! (", token);
	emitTestExpr();
	this._emit$SLToken$(")) {\n", null);
	this._advanceIndent$();
	this._emit$SLToken$("debugger;\n", null);
	s = Util$makeErrorMessage$LPlatform$SUSNNN(this._platform, message + ": {MSG}", token.getFilename$(), token.getLineNumber$(), token.getColumnNumber$(), token.getValue$().length).split("{MSG}");
	this._emit$SLToken$(Util$format$SAS('throw new Error(%1 + ', [ Util$encodeStringLiteral$S(s[0]) ]), token);
	this._getExpressionEmitterFor$LExpression$(msgExpr).emit$N(0);
	this._emit$SLToken$(Util$format$SAS(' + %1);\n', [ Util$encodeStringLiteral$S(s[1]) ]), token);
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
		if (expr instanceof NumberLiteralExpression) {
			this._emit$SLToken$((expr.getDecoded$() | 0) + "", expr.getToken$());
		} else if (expr instanceof IntegerLiteralExpression) {
			this._emit$SLToken$(expr.getDecoded$() + "", expr.getToken$());
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
	precedence = [ [ ({ "new": _NewExpressionEmitter$_setOperatorPrecedence$SN }), ({ "[": _ArrayExpressionEmitter$_setOperatorPrecedence$SN }), ({ ".": _PropertyExpressionEmitter$_setOperatorPrecedence$SN }), ({ "(": _CallExpressionEmitter$_setOperatorPrecedence$SN }), ({ "super": _SuperExpressionEmitter$_setOperatorPrecedence$SN }), ({ "function": _FunctionExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "++": _PostIncrementExpressionEmitter$_setOperatorPrecedence$SN }), ({ "--": _PostIncrementExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "void": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "typeof": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "++": _PreIncrementExpressionEmitter$_setOperatorPrecedence$SN }), ({ "--": _PreIncrementExpressionEmitter$_setOperatorPrecedence$SN }), ({ "+": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "~": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }), ({ "!": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "*": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "/": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "%": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "+": _AdditiveExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "<<": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>>": _ShiftExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "<": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "<=": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">=": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }), ({ "instanceof": _InstanceofExpressionEmitter$_setOperatorPrecedence$SN }), ({ "in": _InExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "==": _EqualityExpressionEmitter$_setOperatorPrecedence$SN }), ({ "!=": _EqualityExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "&": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "^": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "|": _BinaryNumberExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "&&": _LogicalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "||": _LogicalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "=": _AssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "*=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "/=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "%=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "+=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "-=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "<<=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ ">>>=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "&=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "^=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }), ({ "|=": _FusedAssignmentExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "?": _ConditionalExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ "yield": _UnaryExpressionEmitter$_setOperatorPrecedence$SN }) ], [ ({ ",": _CommaExpressionEmitter$_setOperatorPrecedence$SN }) ] ];
	for (i = 0; i < precedence.length; ++i) {
		opTypeList = precedence[i];
		for (j = 0; j < opTypeList.length; ++j) {
			for (key in opTypeList[j]) {
				opTypeList[j][key](key, - (precedence.length - i));
			}
		}
	}
};

JavaScriptEmitter._initialize$ = JavaScriptEmitter$_initialize$;

function LocalVariable(name, type, isConst) {
	Stashable.call(this);
	this._instantiated = [];
	this.isInstantiated = false;
	this._isUsedAsRHS = false;
	this._name = name;
	this._type = type;
	this._isConstant = isConst;
};

$__jsx_extend([LocalVariable], Object);
$__jsx_merge_interface(LocalVariable, Stashable);

LocalVariable.prototype.serialize$ = function () {
	return [ this._name, Util$serializeNullable$LType$(this._type) ];
};


LocalVariable.prototype.getName$ = function () {
	return this._name;
};


LocalVariable.prototype.getType$ = function () {
	return this._type;
};


LocalVariable.prototype.isUsedAsRHS$ = function () {
	return this._isUsedAsRHS;
};


LocalVariable.prototype.isConstant$ = function () {
	return this._isConstant;
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


LocalVariable.prototype._findVarTokenFromFuncDef$LAnalysisContext$ = function (context) {
	var locals;
	var i;
	locals = context.funcDef.getLocals$();
	for (i = 0; i < locals.length; ++i) {
		if (this.getName$().getValue$() === locals[i].getName$().getValue$()) {
			return locals[i].getName$();
		}
	}
	return this.getName$();
};


LocalVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	var error;
	if (isAssignment) {
		if (this._isConstant && context.getTopBlock$().localVariableStatuses.getStatus$LLocalVariable$(this) !== LocalVariableStatuses.UNSET) {
			context.errors.push(new CompileError(token, "assignment of read-only variable"));
			return false;
		}
		context.getTopBlock$().localVariableStatuses.setStatus$LLocalVariable$(this);
	} else {
		switch (context.getTopBlock$().localVariableStatuses.getStatus$LLocalVariable$(this)) {
		case LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION:
			context.errors.push(new CompileError(token, "the return type of recursive function needs to be explicitly declared"));
			return false;
		case LocalVariableStatuses.ISSET:
			this._isUsedAsRHS = true;
			break;
		case LocalVariableStatuses.UNSET:
			error = new CompileError(token, "variable is not initialized");
			error.addCompileNote$LCompileNote$(new CompileNote(this._findVarTokenFromFuncDef$LAnalysisContext$(context), "declared here"));
			context.errors.push(error);
			return false;
		case LocalVariableStatuses.MAYBESET:
			error = new CompileError(token, "variable may not be initialized");
			error.addCompileNote$LCompileNote$(new CompileNote(this._findVarTokenFromFuncDef$LAnalysisContext$(context), "declared here"));
			context.errors.push(error);
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
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$B(instantiationContext, false) : null);
	return new LocalVariable(this._name, type, this._isConstant);
};


function CaughtVariable(name, type) {
	LocalVariable.call(this, name, type, false);
};

$__jsx_extend([CaughtVariable], LocalVariable);
CaughtVariable.prototype.clone$ = function () {
	return new CaughtVariable(this._name, this._type);
};


CaughtVariable.prototype.touchVariable$LAnalysisContext$LToken$B = function (context, token, isAssignment) {
	return true;
};


CaughtVariable.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	return new CaughtVariable(this._name, this._type.instantiate$LInstantiationContext$B(instantiationContext, false));
};


CaughtVariable.prototype.instantiateAndPush$LInstantiationContext$ = function (instantiationContext) {
	return LocalVariable.prototype.instantiateAndPush$LInstantiationContext$.call(this, instantiationContext);
};


function ArgumentDeclaration(name, type) {
	LocalVariable.call(this, name, type, false);
	this._defaultValue = null;
};

function ArgumentDeclaration$0(name, type, defaultValue) {
	LocalVariable.call(this, name, type, false);
	this._defaultValue = defaultValue;
};

$__jsx_extend([ArgumentDeclaration, ArgumentDeclaration$0], LocalVariable);
ArgumentDeclaration.prototype.clone$ = function () {
	return new ArgumentDeclaration$0(this._name, this._type, Util$cloneNullable$LExpression$(this._defaultValue));
};


ArgumentDeclaration.prototype.getDefaultValue$ = function () {
	return this._defaultValue;
};


ArgumentDeclaration.prototype._instantiate$LInstantiationContext$ = function (instantiationContext) {
	var type;
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$B(instantiationContext, false) : null);
	return new ArgumentDeclaration$0(this._name, type, this._defaultValue);
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
			this._statuses[k] = (base._statuses[k] === LocalVariableStatuses.UNSET ? LocalVariableStatuses.MAYBESET : base._statuses[k]);
		}
	}
	args = funcDef.getArguments$();
	for (i = 0; i < args.length; ++i) {
		this._statuses[args[i].getName$().getValue$()] = LocalVariableStatuses.ISSET;
	}
	locals = funcDef.getLocals$();
	for (i = 0; i < locals.length; ++i) {
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
		if (ret._statuses[k] === LocalVariableStatuses.UNSET && that._statuses[k] === LocalVariableStatuses.UNSET) {
		} else if (ret._statuses[k] === LocalVariableStatuses.ISSET && that._statuses[k] === LocalVariableStatuses.ISSET) {
		} else {
			ret._statuses[k] = LocalVariableStatuses.MAYBESET;
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
			if (ret._statuses[k] !== LocalVariableStatuses.ISSET) {
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


function UnusedWarning(token, message) {
	CompileWarning.call(this, token, message);
};

function UnusedWarning$0(filename, lineNumber, columnNumber, message) {
	CompileWarning$0.call(this, filename, lineNumber, columnNumber, message);
};

$__jsx_extend([UnusedWarning, UnusedWarning$0], CompileWarning);
function DeprecatedWarning(token, message) {
	CompileWarning.call(this, token, message);
};

function DeprecatedWarning$0(filename, lineNumber, columnNumber, message) {
	CompileWarning$0.call(this, filename, lineNumber, columnNumber, message);
};

$__jsx_extend([DeprecatedWarning, DeprecatedWarning$0], CompileWarning);
function ExperimentalWarning(token, feature) {
	CompileWarning.call(this, token, "'" + feature + "' is experimental");
};

function ExperimentalWarning$0(filename, lineNumber, columnNumber, feature) {
	CompileWarning$0.call(this, filename, lineNumber, columnNumber, "'" + feature + "' is experimental");
};

$__jsx_extend([ExperimentalWarning, ExperimentalWarning$0], CompileWarning);
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
	for (i = 0; i < formalTypeArgs.length; ++i) {
		typemap[formalTypeArgs[i].getValue$()] = actualTypeArgs[i];
	}
	return new InstantiationContext(errors, typemap);
};


function ClassDefinition(token, className, flags, extendType, implementTypes, members, inners, templateInners, objectTypesUsed, docComment) {
	Stashable.call(this);
	this._baseClassDef = null;
	this._outerClassDef = null;
	this._nativeSource = null;
	this._analized = false;
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
	if (! (this instanceof TemplateClassDefinition || this instanceof InstantiatedClassDefinition)) {
		this._generateWrapperFunctions$();
	}
};

$__jsx_extend([ClassDefinition], Object);
$__jsx_merge_interface(ClassDefinition, Stashable);

ClassDefinition.prototype._generateWrapperFunctions$ = function () {
	var $this = this;
	this.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		funcDef.generateWrappersForDefaultParameters$();
		return true;
	}));
	this.forEachTemplateFunction$F$LTemplateFunctionDefinition$B$((function (funcDef) {
		funcDef.generateWrappersForDefaultParameters$();
		return true;
	}));
};


ClassDefinition.prototype.serialize$ = function () {
	return ({ "token": this._token, "name": this._className, "flags": this._flags, "extends": Util$serializeNullable$LParsedObjectType$(this._extendType), "implements": Util$serializeArray$ALParsedObjectType$(this._implementTypes), "members": Util$serializeArray$ALMemberDefinition$(this._members), "inners": Util$serializeArray$ALClassDefinition$(this._inners), "templateInners": Util$serializeArray$ALTemplateClassDefinition$(this._templateInners) });
};


function ClassDefinition$serialize$ALClassDefinition$(classDefs) {
	var s;
	var i;
	s = [];
	for (i = 0; i < classDefs.length; ++i) {
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
	for (i = this._implementTypes.length - 1; i >= 0; --i) {
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
	for (i = 0; i < this._implementTypes.length; ++i) {
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
	for (i = 0; i < this._members.length; ++i) {
		if (! cb(this._members[i])) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype.forEachMemberVariable$F$LMemberVariableDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._members.length; ++i) {
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
	var member;
	for (i = 0; i < this._members.length; ++i) {
		member = this._members[i];
		if (member instanceof MemberFunctionDefinition && ! (member instanceof TemplateFunctionDefinition)) {
			if (! cb(member)) {
				return false;
			}
		}
	}
	return true;
};


ClassDefinition.prototype.forEachTemplateFunction$F$LTemplateFunctionDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._members.length; ++i) {
		if (this._members[i] instanceof TemplateFunctionDefinition) {
			if (! cb(this._members[i])) {
				return false;
			}
		}
	}
	return true;
};


ClassDefinition.prototype.forEachInnerClass$F$LClassDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._inners.length; ++i) {
		if (! cb(this._inners[i])) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype.forEachTemplateInnerClass$F$LTemplateClassDefinition$B$ = function (cb) {
	var i;
	for (i = 0; i < this._templateInners.length; ++i) {
		if (! cb(this._templateInners[i])) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype._resetMembersClassDef$ = function () {
	var $this = this;
	var i;
	for (i = 0; i < this._members.length; ++i) {
		this._members[i].setClassDef$LClassDefinition$(this);
		this._members[i].forEachClosure$F$LMemberFunctionDefinition$B$((function setClassDef(funcDef) {
			funcDef.setClassDef$LClassDefinition$($this);
			return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$(setClassDef);
		}));
	}
	for (i = 0; i < this._inners.length; ++i) {
		this._inners[i].setOuterClassDef$LClassDefinition$(this);
		this._inners[i]._resetMembersClassDef$();
	}
	for (i = 0; i < this._templateInners.length; ++i) {
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
			for (i = 0; i < classDef._members.length; ++i) {
				member = classDef._members[i];
				if ((member.flags$() & ClassDefinition.IS_DELETE) !== 0) {
				} else if (((member.flags$() & ClassDefinition.IS_STATIC) !== 0) === isStatic && name === member.name$()) {
					if (member instanceof MemberVariableDefinition) {
						if ((member.flags$() & ClassDefinition.IS_OVERRIDE) === 0) {
							type = member.getType$();
							if (type != null && types.length === 0) {
								types[0] = type;
							}
						}
					} else if (member instanceof MemberFunctionDefinition) {
						if (member instanceof InstantiatedMemberFunctionDefinition) {
						} else {
							if (member instanceof TemplateFunctionDefinition && typeArgs.length !== 0) {
								if ((member = member.instantiateTemplateFunction$ALCompileError$LToken$ALType$(errors, token, typeArgs)) == null) {
									return;
								}
							}
							if (member.getStatements$() != null || mode !== ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY || (member.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_ABSTRACT)) === ClassDefinition.IS_NATIVE) {
								for (j = 0; j < types.length; ++j) {
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
		} else {
			mode = ClassDefinition.GET_MEMBER_MODE_FUNCTION_WITH_BODY;
		}
		if (mode !== ClassDefinition.GET_MEMBER_MODE_CLASS_ONLY) {
			if (classDef._extendType != null) {
				pushMatchingMember(classDef._extendType.getClassDef$());
			}
			for (i = 0; i < classDef._implementTypes.length; ++i) {
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
	for (i = 0; i < this._inners.length; ++i) {
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
	for (i = 0; i < this._inners.length; ++i) {
		classDef = this._inners[i];
		if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === request.getClassName$() && Util$typesAreEqual$ALType$ALType$(classDef.getTypeArguments$(), request.getTypeArguments$())) {
			return (function (_, __, ___) {
				return classDef;
			});
		}
	}
	for (i = 0; i < this._templateInners.length; ++i) {
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
	context = instantiationContext.clone$();
	succeeded = true;
	members = [];
	for (i = 0; i < this._members.length; ++i) {
		member = this._members[i].instantiate$LInstantiationContext$(context);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(context);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++i) {
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
		type = this._extendType.instantiate$LInstantiationContext$B(instantiationContext, false);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$B(instantiationContext, false);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._implementTypes[i].getToken$(), "non-object type is not extensible"));
			return null;
		}
		implementTypes[i] = type;
	}
	return new ClassDefinition(this._token, this._className, this._flags, extendType, implementTypes, members, inners, templateInners, context.objectTypesUsed, this._docComment);
};


ClassDefinition.prototype.normalizeClassDefs$ALCompileError$ = function (errors) {
	var x;
	var y;
	var errorMsg;
	var error;
	for (x = 0; x < this._members.length; ++x) {
		for (y = 0; y < x; ++y) {
			if (this._members[x].name$() === this._members[y].name$() && (this._members[x].flags$() & ClassDefinition.IS_STATIC) === (this._members[y].flags$() & ClassDefinition.IS_STATIC)) {
				errorMsg = null;
				if (this._members[x] instanceof MemberFunctionDefinition && this._members[y] instanceof MemberFunctionDefinition) {
					if (Util$typesAreEqual$ALType$ALType$(this._members[x].getArgumentTypes$(), this._members[y].getArgumentTypes$())) {
						errorMsg = "a " + ((this._members[x].flags$() & ClassDefinition.IS_STATIC) !== 0 ? "static" : "member") + " function with same name and arguments is already defined";
						errorMsg += ":" + (x + "") + ":" + (this._members[x].getArgumentTypes$().length + "");
						errorMsg += ":" + (y + "") + ":" + (this._members[y].getArgumentTypes$().length + "");
					}
				} else {
					errorMsg = "a property with same name already exists (note: only functions may be overloaded)";
				}
				if (errorMsg != null) {
					error = new CompileError(this._members[x].getNameToken$(), errorMsg);
					error.addCompileNote$LCompileNote$(new CompileNote(this._members[y].getNameToken$(), "conflicting definition found here"));
					errors.push(error);
					break;
				}
			}
		}
	}
};


ClassDefinition.prototype.resolveTypes$LAnalysisContext$ = function (context) {
	var $this = this;
	var i;
	var baseClass;
	var j;
	var isNative;
	var func;
	for (i = 0; i < this._objectTypesUsed.length; ++i) {
		this._objectTypesUsed[i].resolveType$LAnalysisContext$(context);
	}
	for (i = 0; i < this._inners.length; ++i) {
		this._inners[i].resolveTypes$LAnalysisContext$(context);
	}
	if (this._extendType != null) {
		baseClass = this._extendType.getClassDef$();
		if (baseClass != null) {
			if ((baseClass.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend a final class"));
			} else if ((baseClass.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
				context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend an interface, use the 'implements' keyword"));
			} else if ((baseClass.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
				context.errors.push(new CompileError(this._extendType.getToken$(), "cannot extend an mixin, use the 'implements' keyword"));
			}
		}
	}
	for (i = 0; i < this._implementTypes.length; ++i) {
		baseClass = this._implementTypes[i].getClassDef$();
		if (baseClass != null) {
			if ((baseClass.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError(this._implementTypes[i].getToken$(), "cannot implement a class (only interfaces can be implemented)"));
			} else {
				for (j = i + 1; j < this._implementTypes.length; ++j) {
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
		func = new MemberFunctionDefinition(this._token, new Token$2("constructor", true), ClassDefinition.IS_FINAL | this.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT), Type.voidType, [], isNative ? null : [], isNative ? null : [], [], this._token, null);
		func.setClassDef$LClassDefinition$(this);
		this._members.push(func);
	}
	for (i = 0; i !== this._members.length; ++i) {
		if (this._members[i] instanceof MemberFunctionDefinition && this._members[i].name$() === "constructor" && (this._members[i].flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_DELETE)) === ClassDefinition.IS_DELETE) {
			this._members.splice(i, 1);
			break;
		}
	}
};


ClassDefinition.prototype.setAnalysisContextOfVariables$LAnalysisContext$ = function (context) {
	var $this = this;
	this.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		member.setAnalysisContext$LAnalysisContext$(context);
		return true;
	}));
};


ClassDefinition.prototype.analyze$LAnalysisContext$ = function (context) {
	var token;
	var srcPos;
	if (this._analized) {
		return;
	}
	this._analized = true;
	try {
		this._analyzeClassDef$LAnalysisContext$(context);
	} catch ($__jsx_catch_0) {
		if ($__jsx_catch_0 instanceof Error) {
			token = this.getToken$();
			srcPos = (token != null ? Util$format$SAS(" at file %1, line %2", [ token.getFilename$(), token.getLineNumber$() + "" ]) : "");
			$__jsx_catch_0.message = Util$format$SAS("fatal error while analyzing class %1%2\n%3", [ this.classFullName$(), srcPos, $__jsx_catch_0.message ]);
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
	var existingExportedCtor;
	this._baseClassDef = (this.extendType$() != null ? this.extendType$().getClassDef$() : null);
	implementClassDefs = this.implementTypes$().map((function (type) {
		return type.getClassDef$();
	}));
	if ((this.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		if (this._baseClassDef != null) {
			if ((this._baseClassDef.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError(this.getToken$(), "cannot extend final class '" + this._baseClassDef.classFullName$() + "'"));
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
		for (i = 0; i < implementClassDefs.length; ++i) {
			if ((implementClassDefs[i].flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
				context.errors.push(new CompileError(this.getToken$(), "class '" + implementClassDefs[i].classFullName$() + "' can only be extended, not implemented"));
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
				context.errors.push(new CompileError($this.getToken$(), "mixin '" + classDef.classFullName$() + "' is implemented twice"));
				return false;
			}
			allMixins.push(classDef);
		}
		return true;
	}))) {
		return;
	}
	for (i = 0; i < this._members.length; ++i) {
		this._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$(context, this._members[i], this, this._members[i].getToken$());
	}
	for (i = 0; i < this._implementTypes.length; ++i) {
		interfaceDef = this._implementTypes[i].getClassDef$();
		for (j = 0; j < interfaceDef._members.length; ++j) {
			this._assertMemberIsDefinable$LAnalysisContext$LMemberDefinition$LClassDefinition$LToken$(context, interfaceDef._members[j], interfaceDef, this._implementTypes[i].getToken$());
		}
	}
	if ((this._flags & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
		for (i = 0; i < this._members.length; ++i) {
			if (this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags$() & ClassDefinition.IS_OVERRIDE) !== 0) {
				if (this._assertFunctionIsOverridableInBaseClasses$LAnalysisContext$LMemberFunctionDefinition$(context, this._members[i]) == null) {
					context.errors.push(new CompileError(this._members[i].getNameToken$(), "could not find function definition in base classes / mixins to be overridden"));
				}
			}
		}
		for (i = 0; i < this._implementTypes.length; ++i) {
			if ((this._implementTypes[i].getClassDef$().flags$() & ClassDefinition.IS_MIXIN) === 0) {
				continue;
			}
			theMixin = this._implementTypes[i].getClassDef$();
			overrideFunctions = [];
			theMixin._getMembers$ALMemberDefinition$BNN(overrideFunctions, true, ClassDefinition.IS_OVERRIDE, ClassDefinition.IS_OVERRIDE);
			for (j = 0; j < overrideFunctions.length; ++j) {
				done = false;
				if (this._baseClassDef != null) {
					if (this._baseClassDef._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, overrideFunctions[j]) != null) {
						done = true;
					}
				}
				for (k = 0; k < i; ++k) {
					if (this._implementTypes[k].getClassDef$()._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$(context, overrideFunctions[j]) != null) {
						done = true;
						break;
					}
				}
				for (k = 0; k < theMixin._implementTypes.length; ++k) {
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
					for (i = 0; i < abstractMembers.length; ++i) {
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
					for (i = 0; i < abstractMembers.length; ++i) {
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
			for (i = 0; i < abstractMembers.length; ++i) {
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
		if (! (member instanceof MemberFunctionDefinition)) {
			return false;
		}
		if ((member.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_EXPORT)) !== ClassDefinition.IS_EXPORT || member.name$() === "constructor") {
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
		context.errors.push(new CompileError(member.getToken$(), "methods with __export__ attribute cannot be overloaded").addCompileNote$LCompileNote$(new CompileNote(usedNames[member.name$()].getToken$(), "previously defined here")));
		return false;
	}));
	existingExportedCtor = null;
	this.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
		if ((funcDef.flags$() & (ClassDefinition.IS_EXPORT | ClassDefinition.IS_STATIC)) === ClassDefinition.IS_EXPORT && funcDef.name$() === "constructor") {
			if (existingExportedCtor != null) {
				context.errors.push(new CompileError(funcDef.getToken$(), "only one constructor is exportable per class (or interface or mixin), pleaose mark others using the __noexport__ attribute").addCompileNote$LCompileNote$(new CompileNote(existingExportedCtor.getToken$(), "previously defined here")));
			} else {
				existingExportedCtor = funcDef;
			}
		}
		return true;
	}));
};


ClassDefinition.prototype._analyzeMembers$LAnalysisContext$ = function (context) {
	var i;
	var member;
	for (i = 0; i < this._members.length; ++i) {
		member = this._members[i];
		if (member instanceof MemberFunctionDefinition) {
			if (! (member instanceof TemplateFunctionDefinition)) {
				member.analyze$LAnalysisContext$(context);
			}
		} else {
			member.analyze$LAnalysisContext$(context);
		}
	}
};


ClassDefinition.prototype.analyzeUnusedVariables$ = function () {
	var $this = this;
	this.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (member) {
		member.getType$();
		return true;
	}));
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
	for (i = 0; i < this._implementTypes.length; ++i) {
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
	var isCheckingInterface;
	if ((member.flags$() & ClassDefinition.IS_STATIC) !== 0) {
		return true;
	}
	for (numImplementsToCheck = 0; numImplementsToCheck < this._implementTypes.length; ++numImplementsToCheck) {
		if (memberClassDef == this._implementTypes[numImplementsToCheck].getClassDef$()) {
			break;
		}
	}
	isCheckingSibling = numImplementsToCheck !== this._implementTypes.length;
	if (member instanceof MemberVariableDefinition) {
		if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
			return false;
		}
		for (i = 0; i < numImplementsToCheck; ++i) {
			if (! this._implementTypes[i].getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
				return false;
			}
		}
	} else {
		isCheckingInterface = (memberClassDef.flags$() & ClassDefinition.IS_INTERFACE) !== 0;
		if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$BB(context, member, memberClassDef, token, false, isCheckingInterface)) {
			return false;
		}
		for (i = 0; i < numImplementsToCheck; ++i) {
			if (memberClassDef != this._implementTypes[i].getClassDef$() && ! this._implementTypes[i].getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$BB(context, member, memberClassDef, token, isCheckingSibling, isCheckingInterface)) {
				return false;
			}
		}
	}
	return true;
};


ClassDefinition.prototype._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$ = function (context, member, memberClassDef, token) {
	var i;
	for (i = 0; i < this._members.length; ++i) {
		if (this._members[i].name$() === member.name$()) {
			if ((this._members[i].flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
				context.errors.push(new CompileError(member.getNameToken$(), Util$format$SAS("cannot define property '%1', the name is already used in class '%2'", [ member.getNotation$(), this.classFullName$() ])));
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
	for (i = 0; i < this._implementTypes.length; ++i) {
		if (! this._implementTypes[i].getClassDef$()._assertMemberVariableIsDefinable$LAnalysisContext$LMemberVariableDefinition$LClassDefinition$LToken$(context, member, memberClassDef, token)) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$BB = function (context, member, memberClassDef, token, reportOverridesAsWell, isCheckingInterface) {
	var i;
	var error;
	if (member.name$() === "constructor") {
		return true;
	}
	for (i = 0; i < this._members.length; ++i) {
		if (this._members[i].name$() !== member.name$()) {
			continue;
		}
		if (this._members[i] instanceof MemberVariableDefinition) {
			error = new CompileError(member.getNameToken$(), "definition of the function conflicts with property '" + this._members[i].getNameToken$().getValue$() + "'");
			error.addCompileNote$LCompileNote$(new CompileNote(this._members[i].getNameToken$(), "property with the same name has been found here"));
			context.errors.push(error);
			return false;
		}
		if (! Util$typesAreEqual$ALType$ALType$(this._members[i].getArgumentTypes$(), member.getArgumentTypes$())) {
			continue;
		}
		if (! isCheckingInterface && ((member.flags$() | this._members[i].flags$()) & ClassDefinition.IS_STATIC) === 0 && (member.flags$() & ClassDefinition.IS_OVERRIDE) === 0) {
			error = new CompileError(member.getNameToken$(), "overriding functions must have 'override' attribute set");
			error.addCompileNote$LCompileNote$(new CompileNote(this._members[i].getNameToken$(), Util$format$SAS("defined in base class '%1'", [ this.classFullName$() ])));
			context.errors.push(error);
			return false;
		}
		if (reportOverridesAsWell && (this._members[i].flags$() & ClassDefinition.IS_OVERRIDE) !== 0) {
			error = new CompileError(member.getNameToken$(), "definition of the function conflicts with sibling mix-in '" + this.classFullName$() + "'");
			context.errors.push(error);
			return false;
		}
		return true;
	}
	if (this._extendType != null && ! this._extendType.getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$BB(context, member, memberClassDef, token, false, isCheckingInterface)) {
		return false;
	}
	for (i = 0; i < this._implementTypes.length; ++i) {
		if (! this._implementTypes[i].getClassDef$()._assertMemberFunctionIsDefinable$LAnalysisContext$LMemberFunctionDefinition$LClassDefinition$LToken$BB(context, member, memberClassDef, token, false, isCheckingInterface)) {
			return false;
		}
	}
	return true;
};


ClassDefinition.prototype._assertFunctionIsOverridable$LAnalysisContext$LMemberFunctionDefinition$ = function (context, overrideDef) {
	var i;
	var overrideReturnType;
	var memberReturnType;
	for (i = 0; i < this._members.length; ++i) {
		if (this._members[i].name$() === overrideDef.name$() && this._members[i] instanceof MemberFunctionDefinition && (this._members[i].flags$() & ClassDefinition.IS_STATIC) === 0 && Util$typesAreEqual$ALType$ALType$(this._members[i].getArgumentTypes$(), overrideDef.getArgumentTypes$())) {
			if ((this._members[i].flags$() & ClassDefinition.IS_FINAL) !== 0) {
				context.errors.push(new CompileError(overrideDef.getToken$(), "cannot override final function defined in class '" + this.classFullName$() + "'"));
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
	for (i = 0; i < this._implementTypes.length; ++i) {
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
	for (i = 0; i < this._implementTypes.length; ++i) {
		this._implementTypes[i].getClassDef$()._getMembers$ALMemberDefinition$F$LMemberDefinition$B$(list, cb);
	}
	for (i = 0; i < this._members.length; ++i) {
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
		for (j = 0; j < list.length; ++j) {
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
	for (i = 0; i < this._members.length; ++i) {
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
	} else if (! (y instanceof MemberVariableDefinition)) {
		return false;
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
		for (i = 0; i < this._closures.length; ++i) {
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
	for (i = 0; i < this._closures.length; ++i) {
		closures[i] = this._closures[i].instantiate$LInstantiationContext$(instantiationContext);
	}
	return closures;
};


MemberDefinition.prototype._updateLinkFromExpressionToClosuresUponInstantiation$LExpression$ALMemberFunctionDefinition$ = function (instantiatedExpr, instantiatedClosures) {
	var $this = this;
	(function onExpr(expr) {
		var idx;
		if (expr instanceof FunctionExpression) {
			idx = $this._closures.indexOf(expr.getFuncDef$());
			if (idx === - 1) {
				throw new Error("logic flaw, cannot find the closure for " + $this.getNotation$());
			}
			expr.setFuncDef$LMemberFunctionDefinition$(instantiatedClosures[idx]);
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	})(instantiatedExpr);
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
	type = (this._type != null ? this._type.instantiate$LInstantiationContext$B(instantiationContext, false) : null);
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
	return ({ "token": Util$serializeNullable$LToken$(this._token), "nameToken": Util$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "type": Util$serializeNullable$LType$(this._type), "initialValue": Util$serializeNullable$LExpression$(this._initialValue) });
};


MemberVariableDefinition.prototype.analyze$LAnalysisContext$ = function (context) {
	var rhs;
	if (this.getInitialValue$() == null && (this.getClassDef$().flags$() & ClassDefinition.IS_NATIVE) !== ClassDefinition.IS_NATIVE) {
		this.setInitialValue$LExpression$(Expression$getDefaultValueExpressionOf$LType$(this.getType$()));
	}
	if (this.getInitialValue$() != null) {
		rhs = this.getInitialValue$();
		if ((rhs instanceof ArrayLiteralExpression && rhs.getExprs$().length === 0 || rhs instanceof MapLiteralExpression && rhs.getElements$().length === 0) && rhs.getType$() == null) {
			if (! AssignmentExpression$analyzeEmptyLiteralAssignment$LAnalysisContext$LToken$LType$LExpression$(context, rhs.getToken$(), this._type, rhs)) {
				return;
			}
		}
	}
};


MemberVariableDefinition.prototype.setAnalysisContext$LAnalysisContext$ = function (context) {
	this._analysisContext = context.clone$();
};


MemberVariableDefinition.prototype.getType$ = function () {
	switch (this._analyzeState) {
	case MemberVariableDefinition.NOT_ANALYZED:
		this._lazyAnalyze$();
		break;
	case MemberVariableDefinition.IS_ANALYZING:
		this._analysisContext.errors.push(new CompileError(this.getNameToken$(), "please declare type of variable '" + this.name$() + "' (detected recursion while trying to reduce type)"));
		break;
	default:
		break;
	}
	return this._type;
};


MemberVariableDefinition.prototype._lazyAnalyze$ = function () {
	var rhs;
	var ivType;
	try {
		this._analyzeState = MemberVariableDefinition.IS_ANALYZING;
		rhs = this._initialValue;
		if (rhs != null) {
			if (! rhs.analyze$LAnalysisContext$LExpression$(this._analysisContext, null)) {
				return;
			}
			if (rhs.isClassSpecifier$()) {
				this._analysisContext.errors.push(new CompileError(rhs._token, "cannot assign a class"));
				return;
			}
			ivType = rhs.getType$();
			if (this._type == null) {
				if (ivType.equals$LType$(Type.nullType)) {
					this._analysisContext.errors.push(new CompileError(rhs.getToken$(), "cannot assign null to an unknown type"));
					return;
				}
				if (ivType.equals$LType$(Type.voidType)) {
					this._analysisContext.errors.push(new CompileError(rhs.getToken$(), "cannot assign void"));
					return;
				}
				this._type = ivType.asAssignableType$();
			} else if (! ivType.isConvertibleTo$LType$(this._type)) {
				this._analysisContext.errors.push(new CompileError(this._nameToken, "the variable is declared as '" + this._type.toString() + "' but initial value is '" + ivType.toString() + "'"));
			}
		}
		this._analyzeState = MemberVariableDefinition.ANALYZE_SUCEEDED;
	} finally {
		if (this._analyzeState !== MemberVariableDefinition.ANALYZE_SUCEEDED) {
			this._analyzeState = MemberVariableDefinition.ANALYZE_FAILED;
		}
	}
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
	s = (classDef != null ? classDef.classFullName$() : "<<unknown:" + (this._token.getFilename$() || "?") + ">>");
	s += ((this.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "." : "#");
	s += this.name$();
	return s;
};


function MemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	var i;
	MemberDefinition.call(this, token, name, flags, closures, docComment);
	Block.call(this);
	this._analyzed = false;
	this._returnType = returnType;
	this._args = args;
	this._locals = locals;
	this._statements = statements;
	this._lastTokenOfBody = lastTokenOfBody;
	this._parent = null;
	this._funcLocal = null;
	this._classDef = null;
	for (i = 0; i < this._closures.length; ++i) {
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
	s = (classDef != null ? classDef.classFullName$() : "<<unknown:" + (this._token.getFilename$() || "?") + ">>");
	s += ((this.flags$() & ClassDefinition.IS_STATIC) !== 0 ? "." : "#");
	s += (this.getNameToken$() != null ? this.name$() : "$" + (this.getToken$().getLineNumber$() + "") + "_" + (this.getToken$().getColumnNumber$() + ""));
	s += "(";
	s += this._args.map((function (arg) {
		return ":" + (arg.getType$() ? arg.getType$().toString() : "null");
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


MemberFunctionDefinition.prototype.clone$ = function () {
	var $this = this;
	var stashesUsed;
	var getStash;
	var cloneFuncDef;
	var clonedFuncDef;
	var i;
	var stash;
	var classDef;
	stashesUsed = [];
	function getStash(stashable) {
		var stash;
		stash = stashable.getStash$S("CLONE-FUNC-DEF");
		if (stash == null) {
			stash = stashable.setStash$SLStash$("CLONE-FUNC-DEF", new MemberFunctionDefinition$x2E_CloneStash());
		}
		stashesUsed.push(stash);
		return stash;
	}
	function cloneFuncDef(funcDef) {
		var statements;
		var closures;
		var funcLocal;
		var newFuncLocal;
		var args;
		var locals;
		var clonedFuncDef;
		statements = Util$cloneArray$ALStatement$(funcDef.getStatements$());
		closures = funcDef.getClosures$().map((function (funcDef) {
			var newFuncDef;
			newFuncDef = cloneFuncDef(funcDef);
			getStash(funcDef).newFuncDef = newFuncDef;
			return newFuncDef;
		}));
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			var newFuncDef;
			if (statement instanceof FunctionStatement) {
				if ((newFuncDef = getStash(statement.getFuncDef$()).newFuncDef) != null) {
					statement.setFuncDef$LMemberFunctionDefinition$(newFuncDef);
				}
				return true;
			}
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				var newFuncDef;
				if (expr instanceof FunctionExpression) {
					if ((newFuncDef = getStash(expr.getFuncDef$()).newFuncDef) != null) {
						expr.setFuncDef$LMemberFunctionDefinition$(newFuncDef);
					}
					return true;
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			})) && statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
		funcLocal = funcDef.getFuncLocal$();
		if (funcLocal != null) {
			if ((newFuncLocal = getStash(funcLocal).newLocal) != null) {
			} else {
				newFuncLocal = new LocalVariable(funcLocal.getName$(), funcLocal.getType$(), funcLocal.isConstant$());
				getStash(funcLocal).newLocal = newFuncLocal;
			}
			funcLocal = newFuncLocal;
		}
		args = funcDef.getArguments$().map((function (arg) {
			var newArg;
			newArg = arg.clone$();
			getStash(arg).newLocal = newArg;
			return newArg;
		}));
		locals = funcDef.getLocals$().map((function (local) {
			var newLocal;
			if ((newLocal = getStash(local).newLocal) != null) {
				return newLocal;
			}
			newLocal = new LocalVariable(local.getName$(), local.getType$(), local.isConstant$());
			getStash(local).newLocal = newLocal;
			return newLocal;
		}));
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			var caughtVar;
			if (statement instanceof CatchStatement) {
				caughtVar = statement.getLocal$().clone$();
				getStash(statement.getLocal$()).newLocal = caughtVar;
				statement.setLocal$LCaughtVariable$(caughtVar);
			} else if (statement instanceof FunctionStatement) {
				statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				if (expr instanceof FunctionExpression) {
					return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			})) && statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			if (statement instanceof FunctionStatement) {
				statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				var newLocal;
				if (expr instanceof LocalExpression) {
					if ((newLocal = getStash(expr.getLocal$()).newLocal) != null) {
						expr.setLocal$LLocalVariable$(newLocal);
					}
				} else if (expr instanceof FunctionExpression) {
					return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
				}
				return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			})) && statement.forEachStatement$F$LStatement$B$(onStatement);
		}), statements);
		clonedFuncDef = new MemberFunctionDefinition(funcDef.getToken$(), funcDef.getNameToken$(), funcDef.flags$(), funcDef.getReturnType$(), args, locals, statements, closures, funcDef._lastTokenOfBody, null);
		clonedFuncDef.setFuncLocal$LLocalVariable$(funcLocal);
		clonedFuncDef.setClassDef$LClassDefinition$($this.getClassDef$());
		return clonedFuncDef;
	}
	clonedFuncDef = cloneFuncDef(this);
	for (i = 0; i < stashesUsed.length; ++i) {
		stash = stashesUsed[i];
		stash.newLocal = null;
		stash.newFuncDef = null;
	}
	if (this._parent == null) {
		classDef = this._classDef;
		if (classDef == null) {
		} else {
			classDef.members$().splice(classDef.members$().indexOf(this) + 1, 0, clonedFuncDef);
		}
	} else {
		this._parent.getClosures$().push(clonedFuncDef);
		clonedFuncDef.setParent$LMemberFunctionDefinition$(this._parent);
	}
	return clonedFuncDef;
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
	for (i = 0; i < this._args.length; ++i) {
		args[i] = this._args[i].instantiateAndPush$LInstantiationContext$(instantiationContext);
	}
	if (this._statements != null) {
		locals = [];
		for (i = 0; i < this._locals.length; ++i) {
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
		for (i = 0; i < this._statements.length; ++i) {
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
		for (i = 0; i < this._locals.length; ++i) {
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
			var idx;
			if (statement instanceof FunctionStatement) {
				idx = $this._closures.indexOf(statement.getFuncDef$());
				if (i === - 1) {
					throw new Error("logic flaw, cannot find the closure for " + $this.getNotation$());
				}
				statement.setFuncDef$LMemberFunctionDefinition$(closures[idx]);
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
	for (i = 0; i < this._args.length; ++i) {
		this._args[i].popInstantiated$();
	}
	if (this._returnType != null) {
		returnType = this._returnType.instantiate$LInstantiationContext$B(instantiationContext, true);
		if (returnType == null) {
			return null;
		}
	} else {
		returnType = null;
	}
	return constructCallback(this._token, this._nameToken, this._flags, returnType, args, locals, statements, closures, this._lastTokenOfBody, this._docComment);
};


MemberFunctionDefinition.prototype.serialize$ = function () {
	return ({ "token": Util$serializeNullable$LToken$(this._token), "nameToken": Util$serializeNullable$LToken$(this._nameToken), "flags": this.flags$(), "returnType": Util$serializeNullable$LType$(this._returnType), "args": Util$serializeArray$ALArgumentDeclaration$(this._args), "locals": Util$serializeArray$ALLocalVariable$(this._locals), "statements": Util$serializeArray$ALStatement$(this._statements) });
};


MemberFunctionDefinition.prototype.analyze$LAnalysisContext$ = function (outerContext) {
	var $this = this;
	var docComment;
	var args;
	var context;
	var i;
	if (this._analyzed === true) {
		return;
	}
	this._analyzed = true;
	if ((this.flags$() & ClassDefinition.IS_GENERATED) === 0) {
		docComment = this.getDocComment$();
		if (docComment) {
			args = this.getArguments$();
			docComment.getParams$().forEach((function (docParam, i) {
				for (; i < args.length; ++i) {
					if (args[i].getName$().getValue$() === docParam.getParamName$()) {
						return;
					}
				}
				outerContext.errors.push(new CompileError(docParam.getToken$(), 'invalid parameter name "' + docParam.getParamName$() + '" for ' + $this.name$() + "()"));
			}));
		}
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
		for (i = 0; i < this._statements.length; ++i) {
			if (! this._statements[i].analyze$LAnalysisContext$(context)) {
				break;
			}
		}
		if (this._returnType == null) {
			this._returnType = Type.voidType;
		}
		if (this.isGenerator$()) {
		} else if (! this._returnType.equals$LType$(Type.voidType) && context.getTopBlock$().localVariableStatuses.isReachable$()) {
			context.errors.push(new CompileError(this._lastTokenOfBody, "missing return statement"));
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
	this.getLocals$().forEach((function (local) {
		if (! local.isUsedAsRHS$()) {
			context.errors.push(new UnusedWarning(local.getName$(), "unused variable " + local.getName$().getValue$()));
		}
	}));
};


MemberFunctionDefinition.prototype.generateWrappersForDefaultParameters$ = function () {
	var $this = this;
	var createObjectType;
	var origArgIndex;
	var formalArgs;
	var argExprs;
	var i;
	var defVal;
	var statement;
	var invocant;
	var methodRef;
	var callExpression;
	var wrapper;
	function createObjectType(classDef) {
		var typeArgs;
		if (classDef instanceof TemplateClassDefinition) {
			typeArgs = classDef.getTypeArguments$().map((function (token) {
				return new ParsedObjectType(new QualifiedName(token), []);
			}));
			return new ParsedObjectType(new QualifiedName(classDef.getToken$()), typeArgs);
		} else {
			return new ObjectType(classDef);
		}
	}
	for (origArgIndex = 0; origArgIndex !== this.getArguments$().length; ++origArgIndex) {
		if (this.getArguments$()[origArgIndex].getDefaultValue$() != null) {
			break;
		}
	}
	for (; origArgIndex !== this.getArguments$().length; ++origArgIndex) {
		formalArgs = this.getArguments$().slice(0, origArgIndex).map((function (arg) {
			return new ArgumentDeclaration(arg.getName$(), arg.getType$());
		}));
		argExprs = formalArgs.map((function (arg) {
			return new LocalExpression(arg.getName$(), arg);
		}));
		for (i = origArgIndex; i !== this.getArguments$().length; ++i) {
			defVal = this.getArguments$()[i].getDefaultValue$();
			argExprs.push(defVal.clone$());
		}
		if (this.name$() === "constructor") {
			statement = new ConstructorInvocationStatement(new Token$2("this", false), createObjectType(this.getClassDef$()), argExprs);
		} else {
			invocant = ((this.flags$() & ClassDefinition.IS_STATIC) === 0 ? new ThisExpression(new Token$2("this", false), this.getClassDef$()) : new ClassExpression(new Token$2(this.getClassDef$().className$(), true), createObjectType(this.getClassDef$())));
			methodRef = new PropertyExpression(new Token$2(".", false), invocant, this.getNameToken$(), this.getArgumentTypes$());
			callExpression = new CallExpression(new Token$2("(", false), methodRef, argExprs);
			statement = new ReturnStatement(new Token$2("return", false), callExpression);
		}
		if (! (this instanceof TemplateFunctionDefinition)) {
			wrapper = new MemberFunctionDefinition(this.getToken$(), this.getNameToken$(), this.flags$() | ClassDefinition.IS_INLINE | ClassDefinition.IS_GENERATED, this.getReturnType$(), formalArgs, [], [ statement ], this.getClosures$().slice(0), this._lastTokenOfBody, this._docComment);
		} else {
			throw new Error("TODO: template function with default parameters in " + this.getNotation$() + " is not yet supported");
		}
		wrapper.setClassDef$LClassDefinition$(this.getClassDef$());
		this.getClassDef$().members$().splice(this.getClassDef$().members$().indexOf(this) + 1, 0, wrapper);
		Util$forEachExpression$F$LExpression$B$ALExpression$((function onExpr(expr) {
			var newFuncDef;
			if (expr instanceof FunctionExpression) {
				newFuncDef = expr.getFuncDef$().clone$();
				Util$unlinkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(newFuncDef, $this);
				Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(newFuncDef, wrapper);
				expr.setFuncDef$LMemberFunctionDefinition$(newFuncDef);
				return true;
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}), argExprs);
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
		++stmtIndex;
	} else {
		for (baseIndex = 0; baseIndex <= this._classDef.implementTypes$().length; ++baseIndex) {
			baseClassType = (baseIndex === 0 ? this._classDef.extendType$() : this._classDef.implementTypes$()[baseIndex - 1]);
			if (baseClassType != null) {
				if (stmtIndex < this._statements.length && this._statements[stmtIndex] instanceof ConstructorInvocationStatement && baseClassType.getClassDef$() == this._statements[stmtIndex].getConstructingClassDef$()) {
					if (baseClassType.getToken$().getValue$() === "Object") {
						this._statements.splice(stmtIndex, 1);
					} else {
						++stmtIndex;
					}
				} else if (baseClassType.getClassDef$().className$() === "Object") {
				} else if (baseClassType.getClassDef$().hasDefaultConstructor$()) {
					ctorStmt = new ConstructorInvocationStatement(this._token, baseClassType, []);
					this._statements.splice(stmtIndex, 0, ctorStmt);
					if (! ctorStmt.analyze$LAnalysisContext$(context)) {
						throw new Error("logic flaw");
					}
					++stmtIndex;
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
	for (; stmtIndex < this._statements.length; ++stmtIndex) {
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
	for (i = normalStatementFromIndex; i < this._statements.length; ++i) {
		if (! (this._statements[i] instanceof ExpressionStatement)) {
			break;
		}
		function onExpr(expr) {
			var assignExpr;
			var lhsExpr;
			if (expr instanceof AssignmentExpression) {
				assignExpr = expr;
				if (! onExpr(assignExpr.getSecondExpr$())) {
					return false;
				}
				lhsExpr = assignExpr.getFirstExpr$();
				if (lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$() instanceof ThisExpression) {
					initProperties[lhsExpr.getIdentifierToken$().getValue$()] = false;
					return true;
				}
			} else if (expr instanceof ThisExpression || expr instanceof FunctionExpression) {
				return false;
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
				stmt = new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new ThisExpression(new Token$2("this", false), $this._classDef), member.getNameToken$(), [], member.getType$()), member.getInitialValue$()));
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
	for (i = 0; i < this._args.length; ++i) {
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


MemberFunctionDefinition.prototype.setStatements$ALStatement$ = function (statements) {
	this._statements = statements;
};


MemberFunctionDefinition.prototype.getLocal$LAnalysisContext$S = function (context, name) {
	var i;
	var block;
	var j;
	var local;
	var arg;
	for (i = context.blockStack.length - 1; i >= 0; --i) {
		block = context.blockStack[i].block;
		if (block instanceof MemberFunctionDefinition) {
			for (j = 0; j < block._locals.length; ++j) {
				local = block._locals[j];
				if (local.getName$().getValue$() === name) {
					return local;
				}
			}
			for (j = 0; j < block._args.length; ++j) {
				arg = block._args[j];
				if (arg.getName$().getValue$() === name) {
					return arg;
				}
			}
		} else if (block instanceof CatchStatement) {
			local = block.getLocal$();
			if (local.getName$().getValue$() === name) {
				return local;
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
	for (i = 0; i < this._args.length; ++i) {
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
	} else if (this._args.length !== 0 && type.getArgumentTypes$()[this._args.length - 1] instanceof VariableLengthArgumentType) {
		context.errors.push(new CompileError(this.getToken$(), "could not deduct function argument (left hand expression is a function with an variable-length argument)"));
		return false;
	}
	for (i = 0; i < this._args.length; ++i) {
		if (type.getArgumentTypes$()[i] != null) {
			if (this._args[i].getType$() != null) {
				if (! this._args[i].getType$().equals$LType$(type.getArgumentTypes$()[i])) {
					context.errors.push(new CompileError(this.getToken$(), "detected type conflict for argument '" + this._args[i].getName$().getValue$() + "' (expected '" + type.getArgumentTypes$()[i].toString() + "' but found '" + this._args[i].getType$().toString() + "'"));
					return false;
				}
			} else {
				this._args[i].setTypeForced$LType$(type.getArgumentTypes$()[i]);
			}
		}
	}
	if (type.getReturnType$() != null) {
		if (this._returnType != null) {
			if (! this._returnType.equals$LType$(type.getReturnType$())) {
				context.errors.push(new CompileError(this.getToken$(), "detected return type conflict, expected '" + type.getReturnType$().toString() + "' but found '" + this._returnType.toString() + "'"));
				return false;
			}
		} else {
			this._returnType = type.getReturnType$();
		}
	}
	if (this._funcLocal != null) {
		this._funcLocal.setTypeForced$LType$(this.getType$());
	}
	return true;
};


MemberFunctionDefinition.prototype.forEachStatement$F$LStatement$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$B$ALStatement$(cb, this._statements);
};


MemberFunctionDefinition.prototype.forEachStatement$F$LStatement$F$LStatement$V$B$ = function (cb) {
	return Util$forEachStatement$F$LStatement$F$LStatement$V$B$ALStatement$(cb, this._statements);
};


function InstantiatedMemberFunctionDefinition(token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	MemberFunctionDefinition.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
};

$__jsx_extend([InstantiatedMemberFunctionDefinition], MemberFunctionDefinition);
function TemplateFunctionDefinition(token, name, flags, typeArgs, returnType, args, locals, statements, closures, lastTokenOfBody, docComment) {
	var $this = this;
	MemberFunctionDefinition.call(this, token, name, flags, returnType, args, locals, statements, closures, lastTokenOfBody, docComment);
	TemplateDefinition.call(this);
	this._resolvedTypemap = null;
	this._instantiatedDefs = null;
	this._typeArgs = typeArgs.concat([]);
	this._instantiatedDefs = new TypedMap$x2E$x3CArray$x2E$x3CType$x3E$x2CMemberFunctionDefinition$x3E$0((function (x, y) {
		var i;
		for (i = 0; i < x.length; ++i) {
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

TemplateFunctionDefinition.prototype.getType$ = function () {
	return new TemplateFunctionType(this._token, this);
};


TemplateFunctionDefinition.prototype.getResolvedTypemap$ = function () {
	return this._resolvedTypemap;
};


TemplateFunctionDefinition.prototype.getTypeArguments$ = function () {
	return this._typeArgs;
};


TemplateFunctionDefinition.prototype.instantiate$LInstantiationContext$ = function (instantiationContext) {
	var instantiated;
	var k;
	instantiated = new TemplateFunctionDefinition(this._token, this.getNameToken$(), this.flags$(), this._typeArgs.concat([  ]), this._returnType, this._args.concat([  ]), this._locals, this._statements, this._closures, this._lastTokenOfBody, this._docComment);
	for (k in this._resolvedTypemap) {
		instantiated._resolvedTypemap[k] = this._resolvedTypemap[k];
	}
	for (k in instantiationContext.typemap) {
		instantiated._resolvedTypemap[k] = instantiationContext.typemap[k];
	}
	return instantiated;
};


TemplateFunctionDefinition.prototype.instantiateByArgumentTypes$ALCompileError$ALCompileNote$LToken$ALType$B = function (errors, notes, token, actualArgTypes, exact) {
	var $this = this;
	var typemap;
	var i;
	var k;
	var unify;
	var formalArgTypes;
	var typeArgs;
	var remains;
	typemap = {};
	for (i = 0; i < this._typeArgs.length; ++i) {
		typemap[this._typeArgs[i].getValue$()] = null;
	}
	for (k in this._resolvedTypemap) {
		typemap[k] = this._resolvedTypemap[k];
	}
	function unify(formal, actual) {
		var expectedType;
		var parser;
		var formalClassDef;
		var actualClassDef;
		var formalTypeArgs;
		var actualTypeArgs;
		var i;
		var formalFuncType;
		var actualFuncType;
		if (formal instanceof ParsedObjectType && formal.getTypeArguments$().length === 0 && formal.getQualifiedName$().getImport$() == null && formal.getQualifiedName$().getEnclosingType$() == null && $__jsx_ObjectHasOwnProperty.call(typemap, formal.getToken$().getValue$())) {
			expectedType = typemap[formal.getToken$().getValue$()];
			if (expectedType != null) {
				if (exact && ! expectedType.equals$LType$(actual)) {
					return false;
				}
				if (! actual.isConvertibleTo$LType$(expectedType)) {
					notes.push(new CompileNote(token, "expected " + expectedType.toString() + ", but got " + actual.toString()));
					return false;
				}
			} else {
				typemap[formal.getToken$().getValue$()] = actual;
			}
		} else if (formal instanceof ParsedObjectType) {
			if (! (actual instanceof ObjectType)) {
				notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
				return false;
			}
			parser = $this._classDef.getParser$();
			if (formal.getTypeArguments$().length === 0) {
				formal.resolveType$LAnalysisContext$(new AnalysisContext(errors, parser, null));
				if (! actual.isConvertibleTo$LType$(formal)) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
			} else {
				formalClassDef = formal.getQualifiedName$().getTemplateClass$LParser$(parser);
				actualClassDef = actual.getClassDef$();
				if (formalClassDef == null) {
					notes.push(new CompileNote(token, "not matching class definition " + formal.toString()));
					return false;
				}
				if (! (actualClassDef instanceof InstantiatedClassDefinition && formalClassDef == actualClassDef.getTemplateClass$())) {
					notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
					return false;
				}
				formalTypeArgs = formal.getTypeArguments$();
				actualTypeArgs = actualClassDef.getTypeArguments$();
				for (i = 0; i < formalTypeArgs.length; ++i) {
					if (! unify(formalTypeArgs[i], actualTypeArgs[i])) {
						return false;
					}
				}
			}
		} else if (formal instanceof NullableType) {
			if (! unify(formal.getBaseType$(), actual)) {
				return false;
			}
		} else if (formal instanceof StaticFunctionType) {
			if (! (actual instanceof StaticFunctionType)) {
				notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
				return false;
			}
			formalFuncType = formal;
			actualFuncType = actual;
			if (formalFuncType.getArgumentTypes$().length !== actualFuncType.getArgumentTypes$().length) {
				notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
				return false;
			}
			for (i = 0; i < formalFuncType.getArgumentTypes$().length; ++i) {
				if (! unify(formalFuncType.getArgumentTypes$()[i], actualFuncType.getArgumentTypes$()[i])) {
					return false;
				}
			}
			if (! unify(formalFuncType.getReturnType$(), actualFuncType.getReturnType$())) {
				return false;
			}
		} else {
			if (exact && ! formal.equals$LType$(actual)) {
				return false;
			}
			if (! actual.isConvertibleTo$LType$(formal)) {
				notes.push(new CompileNote(token, "expected " + formal.toString() + ", but got " + actual.toString()));
				return false;
			}
		}
		return true;
	}
	formalArgTypes = this.getArgumentTypes$();
	for (i = 0; i < formalArgTypes.length; ++i) {
		if (! unify(formalArgTypes[i], actualArgTypes[i])) {
			break;
		}
	}
	if (i !== formalArgTypes.length) {
		return null;
	}
	typeArgs = [];
	for (i = 0; i < this._typeArgs.length; ++i) {
		if ((typeArgs[i] = typemap[this._typeArgs[i].getValue$()]) == null) {
			break;
		}
	}
	if (i !== this._typeArgs.length) {
		remains = [];
		this._typeArgs.forEach((function (typeArg) {
			if (typemap[typeArg.getValue$()] == null) {
				remains.push(typeArg.getValue$());
			}
		}));
		notes.push(new CompileNote(token, "cannot decide type parameter(s) from given argument expressions: " + remains.join(", ")));
		return null;
	} else {
		return this.instantiateTemplateFunction$ALCompileError$LToken$ALType$(errors, token, typeArgs);
	}
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
	for (i = 0; i < instantiationContext.objectTypesUsed.length; ++i) {
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
	this._generateWrapperFunctions$();
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
	for (i = 0; i < this._typeArgs.length; ++i) {
		delete typemap[this._typeArgs[i].getValue$()];
	}
	context = new InstantiationContext(instantiationContext.errors, typemap);
	succeeded = true;
	members = [];
	for (i = 0; i < this._members.length; ++i) {
		member = this._members[i].instantiate$LInstantiationContext$(context);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(context);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++i) {
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
		type = this._extendType.instantiate$LInstantiationContext$B(instantiationContext, false);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$B(instantiationContext, false);
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
	for (i = 0; i < this._members.length; ++i) {
		member = this._members[i].instantiate$LInstantiationContext$(instantiationContext);
		if (member == null) {
			succeeded = false;
		}
		members[i] = member;
	}
	inners = [];
	for (i = 0; i < this._inners.length; ++i) {
		inner = this._inners[i].instantiate$LInstantiationContext$(instantiationContext);
		if (inner == null) {
			succeeded = false;
		}
		inners[i] = inner;
	}
	templateInners = [];
	for (i = 0; i < this._templateInners.length; ++i) {
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
		type = this._extendType.instantiate$LInstantiationContext$B(instantiationContext, false);
		if (! (type instanceof ParsedObjectType)) {
			instantiationContext.errors.push(new CompileError(this._extendType.getToken$(), "non-object type is not extensible"));
			return null;
		}
		extendType = type;
	}
	implementTypes = [];
	for (i = 0; i < this._implementTypes.length; ++i) {
		type = this._implementTypes[i].instantiate$LInstantiationContext$B(instantiationContext, false);
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
	for (i = 0; i < typeArgs.length; ++i) {
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
	if (force || this instanceof PrimitiveType || this.equals$LType$(Type.voidType)) {
		return new NullableType(this);
	}
	return this;
};


Type.prototype.forEachType$F$LType$B$ = function (cb) {
	return true;
};


function Type$templateTypeToString$SALType$(parameterizedTypeName, typeArgs) {
	var s;
	var i;
	s = parameterizedTypeName + ".<";
	for (i = 0; i < typeArgs.length; ++i) {
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
		} else if (Type$isIntegerOrNumber$LType$(type1.resolveIfNullable$()) && Type$isIntegerOrNumber$LType$(type2.resolveIfNullable$())) {
			return new NullableType(Type.numberType);
		} else {
			return (acceptVariant ? Type.variantType : null);
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
		for (i in ifaces1) { i |= 0;
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
			for (i = 0; i < list.length; ++i) {
				result.push(list[i]);
				for (j = i + 1; j < list.length; ++j) {
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
	for (i = 1; i < types.length; ++i) {
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
VoidType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
	return this;
};


VoidType.prototype.isAssignable$ = function () {
	return false;
};


VoidType.prototype.isConvertibleTo$LType$ = function (type) {
	return type.equals$LType$(Type.voidType);
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
NullType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
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
PrimitiveType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
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
VariantType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
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
NullableType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
	var baseType;
	baseType = this._baseType.resolveIfNullable$().instantiate$LInstantiationContext$B(instantiationContext, true);
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


NullableType.prototype.forEachType$F$LType$B$ = function (cb) {
	if (! cb(this._baseType)) {
		return false;
	}
	return true;
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
VariableLengthArgumentType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
	var baseType;
	baseType = this._baseType.instantiate$LInstantiationContext$B(instantiationContext, allowVoid);
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


VariableLengthArgumentType.prototype.forEachType$F$LType$B$ = function (cb) {
	if (! cb(this._baseType)) {
		return false;
	}
	return true;
};


function ObjectType(classDef) {
	Type.call(this);
	this._classDef = classDef;
};

$__jsx_extend([ObjectType], Type);
ObjectType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
	throw new Error("logic flaw; ObjectType is created during semantic analysis, after template instantiation");
};


ObjectType.prototype.equals$LType$ = function (x) {
	var that;
	var a;
	var b;
	if (! (x instanceof ObjectType)) {
		return false;
	}
	that = x;
	if (this instanceof ParsedObjectType && x instanceof ParsedObjectType && (this._classDef == null || that._classDef == null)) {
		a = this;
		b = that;
		return a.getQualifiedName$().equals$LQualifiedName$(b.getQualifiedName$()) && Util$typesAreEqual$ALType$ALType$(a.getTypeArguments$(), b.getTypeArguments$());
	}
	return this._classDef == that._classDef;
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
	if (type._classDef == null) {
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


ObjectType.prototype.forEachType$F$LType$B$ = function (cb) {
	return true;
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


ParsedObjectType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
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
			if (! allowVoid && actualType.equals$LType$(Type.voidType)) {
				instantiationContext.errors.push(new CompileError(this.getToken$(), "the type cannot be instantiated as void in this context"));
			}
			return actualType;
		}
		if (this._classDef == null) {
			instantiationContext.objectTypesUsed.push(this);
		}
		return this;
	}
	qualifiedName = this._qualifiedName;
	if (enclosingType != null) {
		actualEnclosingType = this._qualifiedName.getEnclosingType$().instantiate$LInstantiationContext$B(instantiationContext, true);
		if (! this._qualifiedName.getEnclosingType$().equals$LType$(actualEnclosingType)) {
			qualifiedName = new QualifiedName$1(this._qualifiedName.getToken$(), actualEnclosingType);
		}
	}
	typeArgs = [];
	for (i = 0; i < this._typeArguments.length; ++i) {
		if (this._typeArguments[i] instanceof ParsedObjectType && this._typeArguments[i].getTypeArguments$().length !== 0) {
			actualType = this._typeArguments[i].instantiate$LInstantiationContext$B(instantiationContext, true);
		} else {
			actualType = instantiationContext.typemap[this._typeArguments[i].toString()];
		}
		typeArgs[i] = (actualType != null ? actualType : this._typeArguments[i]);
		templateClassName = qualifiedName.getToken$().getValue$();
		if (templateClassName === "Array" || templateClassName === "Map") {
			if (typeArgs[i] instanceof NullableType) {
				typeArgs[i] = typeArgs[i].getBaseType$();
			} else if (typeArgs[i].equals$LType$(Type.voidType)) {
				instantiationContext.errors.push(new CompileError(this.getToken$(), "cannot instantiate " + templateClassName + ".<T> with T=void"));
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


ParsedObjectType.prototype.forEachType$F$LType$B$ = function (cb) {
	var i;
	if (this._qualifiedName.getEnclosingType$() != null && ! cb(this._qualifiedName.getEnclosingType$())) {
		return false;
	}
	for (i = 0; i < this._typeArguments.length; ++i) {
		if (! cb(this._typeArguments[i])) {
			return false;
		}
	}
	return true;
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


FunctionType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
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
	var type;
	var i;
	var matched;
	var notes;
	types = this._types;
	for (i = 0; i < types.length; ++i) {
		if ((type = types[i]._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(types[i].getToken$(), argTypes, isStatic, true, [  ])) != null) {
			return type;
		}
	}
	matched = [];
	notes = [];
	for (i = 0; i < types.length; ++i) {
		if ((type = types[i]._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(types[i].getToken$(), argTypes, isStatic, false, notes)) != null) {
			matched.push(type);
		}
	}
	switch (matched.length) {
	case 0:
		context.errors.push(new CompileError(operatorToken, (operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$().toString() : "no function with matching arguments")));
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
	for (i = 0; i < this._types.length; ++i) {
		this._types[i]._getExpectedTypes$ALUtil$x2EArgumentTypeRequest$NB(expected, numberOfArgs, isStatic);
	}
	return expected;
};


FunctionChoiceType.prototype.toString = function () {
	var $this = this;
	return (this._types.length === 1 ? this._types[0].toString() : "<<multiple choices: " + this._types.map((function (f) {
		return f.toString();
	})).join(" | ") + ">>");
};


FunctionChoiceType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


FunctionChoiceType.prototype.forEachType$F$LType$B$ = function (cb) {
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
	var type;
	var error;
	notes = [];
	if ((type = this._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(this._token != null ? this._token : operatorToken, argTypes, isStatic, false, notes)) == null) {
		error = new CompileError(operatorToken, (operatorToken.getValue$() === "[" ? "operator [] of type " + argTypes[0].toString() + " is not applicable to " + this.getObjectType$().toString() : "no function with matching arguments"));
		error.addCompileNotes$ALCompileNote$(notes);
		context.errors.push(error);
		return null;
	}
	return type;
};


ResolvedFunctionType.prototype._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$ = function (token, argTypes, isStatic, exact, notes) {
	var $this = this;
	var compareArg;
	var vargType;
	var i;
	compareArg = (function (formal, actual) {
		if (formal.equals$LType$(actual)) {
			return true;
		} else if (! exact && actual.isConvertibleTo$LType$(formal)) {
			return true;
		}
		return false;
	});
	if (this instanceof StaticFunctionType !== isStatic) {
		if (isStatic) {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a static function, but got a member function'));
		} else {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a member function, but got a static function'));
		}
		return null;
	}
	if (this._argTypes.length !== 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		vargType = this._argTypes[this._argTypes.length - 1];
		if (argTypes.length < this._argTypes.length - 1) {
			notes.push(new CompileNote(token, 'candidate function not viable: wrong number of arguments'));
			return null;
		}
		for (i = 0; i < this._argTypes.length - 1; ++i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ])));
				return null;
			}
		}
		if (argTypes[i] instanceof VariableLengthArgumentType && argTypes.length === this._argTypes.length) {
			if (! compareArg(this._argTypes[i].getBaseType$(), argTypes[i].getBaseType$())) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].getBaseType$().toString(), this._argTypes[i].getBaseType$().toString(), Util$toOrdinal$N(i + 1) ])));
				return null;
			}
		} else {
			for (; i < argTypes.length; ++i) {
				if (! compareArg(vargType.getBaseType$(), argTypes[i])) {
					notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), vargType.getBaseType$().toString(), Util$toOrdinal$N(i + 1) ])));
					return null;
				}
			}
		}
	} else {
		if (argTypes.length !== this._argTypes.length) {
			notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: wrong number of arguments (%1 for %2)', [ argTypes.length + "", this._argTypes.length + "" ])));
			return null;
		}
		for (i = 0; i < argTypes.length; ++i) {
			if (! compareArg(this._argTypes[i], argTypes[i])) {
				notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: no known conversion from %1 to %2 for %3 argument.', [ argTypes[i].toString(), this._argTypes[i].toString(), Util$toOrdinal$N(i + 1) ])));
				return null;
			}
		}
	}
	return this;
};


ResolvedFunctionType.prototype.getExpectedTypes$NB = function (numberOfArgs, isStatic) {
	var expected;
	expected = [];
	this._getExpectedTypes$ALUtil$x2EArgumentTypeRequest$NB(expected, numberOfArgs, isStatic);
	return expected;
};


ResolvedFunctionType.prototype._getExpectedTypes$ALUtil$x2EArgumentTypeRequest$NB = function (expected, numberOfArgs, isStatic) {
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
		for (i = 0; i < numberOfArgs; ++i) {
			if (i < this._argTypes.length - 1) {
				argTypes[i] = this._argTypes[i];
			} else {
				argTypes[i] = this._argTypes[this._argTypes.length - 1].getBaseType$();
			}
		}
	} else if (this._argTypes.length === numberOfArgs) {
		argTypes = this._argTypes;
	} else {
		return;
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
		expected.push(new Util$x2EArgumentTypeRequest(callbackArgTypes, [  ]));
	}
};


ResolvedFunctionType.prototype.toString = function () {
	var args;
	var i;
	var s;
	args = [];
	for (i = 0; i < this._argTypes.length; ++i) {
		if (this._argTypes[i] == null) {
		} else if (this._argTypes[i] instanceof VariableLengthArgumentType) {
			args[i] = "... : " + this._argTypes[i].getBaseType$().toString();
		} else {
			args[i] = ": " + this._argTypes[i].toString();
		}
	}
	s = this._toStringPrefix$() + "function (" + args.join(", ") + ")";
	if (this._returnType != null) {
		s += " : " + this._returnType.toString();
	}
	return s;
};


ResolvedFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


ResolvedFunctionType.prototype.forEachType$F$LType$B$ = function (cb) {
	var i;
	for (i = 0; i < this._argTypes.length; ++i) {
		if (! cb(this._argTypes[i])) {
			return false;
		}
	}
	if (! cb(this._returnType)) {
		return false;
	}
	return true;
};


function StaticFunctionType(token, returnType, argTypes, isAssignable) {
	ResolvedFunctionType.call(this, token, returnType, argTypes, isAssignable);
};

$__jsx_extend([StaticFunctionType], ResolvedFunctionType);
StaticFunctionType.prototype.instantiate$LInstantiationContext$B = function (instantiationContext, allowVoid) {
	var returnType;
	var argTypes;
	var i;
	returnType = this._returnType.instantiate$LInstantiationContext$B(instantiationContext, true);
	if (returnType == null) {
		return null;
	}
	argTypes = [];
	for (i = 0; i < this._argTypes.length; ++i) {
		if ((argTypes[i] = this._argTypes[i].instantiate$LInstantiationContext$B(instantiationContext, true)) == null) {
			return null;
		}
	}
	return new StaticFunctionType(this._token, returnType, argTypes, this._isAssignable);
};


StaticFunctionType.prototype.equals$LType$ = function (x) {
	return x instanceof StaticFunctionType && this._returnType.equals$LType$(x._returnType) && Util$typesAreEqual$ALType$ALType$(this._argTypes, x._argTypes);
};


StaticFunctionType.prototype._clone$ = function () {
	return new StaticFunctionType(this._token, this._returnType, this._argTypes.concat([  ]), this._isAssignable);
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
	if (this._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$(type.getToken$(), type.getArgumentTypes$(), true, true, [  ]) == null) {
		return false;
	}
	return true;
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
	return new MemberFunctionType(this._token, this._objectType, this._returnType, this._argTypes.concat([  ]), this._isAssignable);
};


MemberFunctionType.prototype._toStringPrefix$ = function () {
	return this._objectType.toString() + ".";
};


MemberFunctionType.prototype.getObjectType$ = function () {
	return this._objectType;
};


function TemplateFunctionType(token, funcDef) {
	ResolvedFunctionType.call(this, token, funcDef.getReturnType$(), funcDef.getArgumentTypes$().concat([  ]), false);
	this._funcDef = funcDef;
};

$__jsx_extend([TemplateFunctionType], ResolvedFunctionType);
TemplateFunctionType.prototype._clone$ = function () {
	return new TemplateFunctionType(this._token, this._funcDef);
};


TemplateFunctionType.prototype._toStringPrefix$ = function () {
	return 'template ';
};


TemplateFunctionType.prototype.asAssignableType$ = function () {
	throw new Error('logic flaw');
};


TemplateFunctionType.prototype._deduceByArgumentTypes$LToken$ALType$BBALCompileNote$ = function (token, argTypes, isStatic, exact, notes) {
	var errors;
	var member;
	var i;
	errors = [];
	if (((this._funcDef.flags$() & ClassDefinition.IS_STATIC) === ClassDefinition.IS_STATIC) !== isStatic) {
		if (isStatic) {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a static function, but got a member function'));
		} else {
			notes.push(new CompileNote(token, 'candidate function not viable: expected a member function, but got a static function'));
		}
		return null;
	}
	if (this._argTypes.length !== 0 && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		notes.push(new CompileNote(token, "template functions with variable-length arguments cannot be instantiated by the arguments: please specify the type arguments by hand"));
		return null;
	} else {
		if (argTypes.length !== this._argTypes.length) {
			notes.push(new CompileNote(token, Util$format$SAS('candidate function not viable: wrong number of arguments (%1 for %2)', [ argTypes.length + "", this._argTypes.length + "" ])));
			return null;
		}
		member = this._funcDef.instantiateByArgumentTypes$ALCompileError$ALCompileNote$LToken$ALType$B(errors, notes, token, argTypes, exact);
		if (member == null) {
			for (i = 0; i < errors.length; ++i) {
				notes.push(new CompileNote$0(errors[i]._filename, errors[i]._lineNumber, errors[i]._columnNumber, errors[i]._message));
			}
			return null;
		}
		return member.getType$();
	}
};


TemplateFunctionType.prototype._getExpectedTypes$ALUtil$x2EArgumentTypeRequest$NB = function (expected, numberOfArgs, isStatic) {
	var $this = this;
	var argTypes;
	var i;
	var instantiationContext;
	var hasCallback;
	var callbackArgTypes;
	if (((this._funcDef.flags$() & ClassDefinition.IS_STATIC) !== 0) !== isStatic) {
		return;
	}
	argTypes = [];
	if (this._argTypes.length > 0 && numberOfArgs >= this._argTypes.length && this._argTypes[this._argTypes.length - 1] instanceof VariableLengthArgumentType) {
		for (i = 0; i < numberOfArgs; ++i) {
			if (i < this._argTypes.length - 1) {
				argTypes[i] = this._argTypes[i];
			} else {
				argTypes[i] = this._argTypes[this._argTypes.length - 1].getBaseType$();
			}
		}
	} else if (this._argTypes.length === numberOfArgs) {
		argTypes = this._argTypes.concat([  ]);
	} else {
		return;
	}
	instantiationContext = new InstantiationContext([  ], this._funcDef.getResolvedTypemap$());
	for (i = 0; i < numberOfArgs; ++i) {
		argTypes[i] = argTypes[i].instantiate$LInstantiationContext$B(instantiationContext, true);
	}
	hasCallback = false;
	callbackArgTypes = argTypes.map((function (argType) {
		if (argType instanceof StaticFunctionType) {
			hasCallback = true;
			return argType;
		} else {
			return null;
		}
	}));
	if (hasCallback) {
		expected.push(new Util$x2EArgumentTypeRequest(callbackArgTypes, this._funcDef.getTypeArguments$()));
	}
};


TemplateFunctionType.prototype.getObjectType$ = function () {
	throw new Error("logic flaw");
};


function Token(value, isIdentifier, filename, lineNumber, columnNumber) {
	this._value = value;
	this._isIdentifier = isIdentifier;
	this._filename = filename;
	this._lineNumber = lineNumber;
	this._columnNumber = columnNumber;
};

function Token$0(value, isIdentifier, filename, lineNumber) {
	Token.call(this, value, isIdentifier, filename, lineNumber, NaN);
};

function Token$1(value, isIdentifier, filename) {
	Token.call(this, value, isIdentifier, filename, NaN, NaN);
};

function Token$2(value, isIdentifier) {
	Token.call(this, value, isIdentifier, null, NaN, NaN);
};

function Token$3(value) {
	Token.call(this, value, false, null, NaN, NaN);
};

$__jsx_extend([Token, Token$0, Token$1, Token$2, Token$3], Object);
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


Token.prototype.getNotation$ = function () {
	return "'" + this._value + "'" + " at " + (this._filename || "<<unknown>>") + ":" + (this._lineNumber + "") + ":" + (this._columnNumber + "");
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
	for (i = 0; i < this._classNames.length; ++i) {
		names[i] = this._classNames[i].getValue$();
	}
	return names;
};


Import.prototype.serialize$ = function () {
	return [ "Import", Util$serializeNullable$LToken$(this._filenameToken), Util$serializeNullable$LToken$(this._aliasToken), Util$serializeArray$ALToken$(this._classNames) ];
};


Import.prototype.checkNameConflict$ALCompileError$LToken$ = function (errors, nameToken) {
	var i;
	if (this._aliasToken != null) {
		if (this._aliasToken.getValue$() === nameToken.getValue$()) {
			errors.push(new CompileError(nameToken, "an alias with the same name is already declared"));
			return false;
		}
	} else if (this._classNames != null) {
		for (i = 0; i < this._classNames.length; ++i) {
			if (this._classNames[i].getValue$() === nameToken.getValue$()) {
				errors.push(new CompileError(nameToken, "a class with the same name has already been explicitely imported"));
				return false;
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
	for (i = 0; i < this._sourceParsers.length; ++i) {
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
		for (i = 0; i < allClassNames.length; ++i) {
			if (allClassNames[i] === className) {
				++num;
			}
		}
		return num;
	}
	for (i = 0; i < this._classNames.length; ++i) {
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
	for (i = 0; i < this._sourceParsers.length; ++i) {
		classDefs = this._sourceParsers[i].getClassDefs$();
		for (j = 0; j < classDefs.length; ++j) {
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
	for (i = 0; i < this._sourceParsers.length; ++i) {
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
		for (i = 0; i < this._classNames.length; ++i) {
			if (this._classNames[i].getValue$() === name) {
				break;
			}
		}
		if (i === this._classNames.length) {
			return false;
		}
	} else if (name.charAt(0) === '_') {
		return false;
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
	return [ "QualifiedName", this._token.serialize$(), Util$serializeNullable$LImport$(this._import), Util$serializeNullable$LParsedObjectType$(this._enclosingType) ];
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
	} else if (! this._enclosingType.equals$LType$(x._enclosingType)) {
		return false;
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
	} else if (this._enclosingType != null) {
		this._enclosingType.resolveType$LAnalysisContext$(context);
		if ((enclosingClassDef = this._enclosingType.getClassDef$()) == null) {
			return null;
		}
		if (typeArguments.length === 0) {
			if ((classDef = enclosingClassDef.lookupInnerClass$S(this._token.getValue$())) == null) {
				context.errors.push(new CompileError(this._token, "no class definition or variable for '" + this.toString() + "'"));
				return null;
			}
		} else if ((classDef = enclosingClassDef.lookupTemplateInnerClass$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
			return null;
		}))) == null) {
			context.errors.push(new CompileError(this._token, "failed to instantiate class"));
			return null;
		}
	} else if (typeArguments.length === 0) {
		if ((classDef = context.parser.lookup$ALCompileError$LToken$S(context.errors, this._token, this._token.getValue$())) == null) {
			if ((classDef = context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
				return null;
			}))) == null) {
				context.errors.push(new CompileError(this._token, "no class definition or variable for '" + this.toString() + "'"));
				return null;
			}
		}
	} else if ((classDef = context.parser.lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(context.errors, new TemplateInstantiationRequest(this._token, this._token.getValue$(), typeArguments), (function (parser, classDef) {
		return null;
	}))) == null) {
		context.errors.push(new CompileError(this._token, "failed to instantiate class"));
		return null;
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
	this._content = null;
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
Parser.prototype.parse$SALCompileError$ = function (content, errors) {
	var compLineNumber;
	var line;
	var importToken;
	this._content = content;
	this._lines = this._content.split(_Lexer.rxNewline);
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


Parser.prototype.getContent$ = function () {
	return this._content;
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
	for (i = parsers.length - 1; i >= 0; --i) {
		this._imports.unshift(new Import(parsers[i]));
	}
};


Parser.prototype.lookupImportAlias$S = function (name) {
	var i;
	var alias;
	for (i = 0; i < this._imports.length; ++i) {
		alias = this._imports[i].getAlias$();
		if (alias != null && alias === name) {
			return this._imports[i];
		}
	}
	return null;
};


Parser.prototype.lookup$ALCompileError$LToken$S = function (errors, contextToken, className) {
	var i;
	var classDef;
	var found;
	for (i = 0; i < this._classDefs.length; ++i) {
		classDef = this._classDefs[i];
		if (classDef.className$() === className) {
			return classDef;
		}
	}
	found = [];
	for (i = 0; i < this._imports.length; ++i) {
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
	for (i = 0; i < this._imports.length; ++i) {
		candidateCallbacks = candidateCallbacks.concat(this._imports[i].createGetTemplateClassCallbacks$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$(errors, request, postInstantiationCallback));
	}
	if (candidateCallbacks.length === 0) {
		errors.push(new CompileError(request.getToken$(), "could not find definition for template class: '" + request.getClassName$() + "'"));
		return null;
	} else if (candidateCallbacks.length >= 2) {
		errors.push(new CompileError(request.getToken$(), "multiple candidates exist for template class name '" + request.getClassName$() + "'"));
		return null;
	}
	return candidateCallbacks[0](null, null, null);
};


Parser.prototype.createGetTemplateClassCallback$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$ = function (errors, request, postInstantiationCallback) {
	var $this = this;
	var i;
	var classDef;
	var templateDef;
	for (i = 0; i < this._classDefs.length; ++i) {
		classDef = this._classDefs[i];
		if (classDef instanceof InstantiatedClassDefinition && classDef.getTemplateClassName$() === request.getClassName$() && Util$typesAreEqual$ALType$ALType$(classDef.getTypeArguments$(), request.getTypeArguments$())) {
			return (function (_, __, ___) {
				return classDef;
			});
		}
	}
	for (i = 0; i < this._templateClassDefs.length; ++i) {
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


Parser.prototype._registerLocal$LToken$LType$BB = function (identifierToken, type, isConst, isFunctionStmt) {
	var $this = this;
	var isEqualTo;
	var i;
	var newLocal;
	function isEqualTo(local) {
		if (local.getName$().getValue$() === identifierToken.getValue$()) {
			if (type != null && local.getType$() != null && ! local.getType$().equals$LType$(type) || isFunctionStmt) {
				$this._newError$SLToken$("conflicting types for variable " + identifierToken.getValue$(), identifierToken);
			}
			if (local.isConstant$() !== isConst) {
				$this._newError$SLToken$("const attribute conflict for variable " + identifierToken.getValue$(), identifierToken);
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
	for (i = 0; i < this._arguments.length; ++i) {
		if (isEqualTo(this._arguments[i])) {
			return this._arguments[i];
		}
	}
	for (i = 0; i < this._locals.length; i++) {
		if (isEqualTo(this._locals[i])) {
			return this._locals[i];
		}
	}
	newLocal = new LocalVariable(identifierToken, type, isConst);
	this._locals.push(newLocal);
	return newLocal;
};


Parser.prototype._registerLocal$LToken$LType$B = function (identifierToken, type, isConst) {
	var $this = this;
	return this._registerLocal$LToken$LType$BB(identifierToken, type, isConst, false);
};


Parser.prototype._preserveState$ = function () {
	return new ParserState(this._lineNumber, this._columnOffset, this._docComment, this._tokenLength, this._isGenerator, this._errors.length, (this._closures != null ? this._closures.length : 0), this._objectTypesUsed.length, this._templateInstantiationRequests.length);
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


Parser.prototype._newError$SNN = function (message, lineNumber, columnOffset) {
	this._errors.push(new CompileError$0(this._filename, lineNumber, columnOffset, message));
};


Parser.prototype._newError$SLToken$ = function (message, token) {
	this._errors.push(new CompileError(token, message));
};


Parser.prototype._newDeprecatedWarning$S = function (message) {
	this._errors.push(new DeprecatedWarning$0(this._filename, this._lineNumber, this._getColumn$(), message));
};


Parser.prototype._newExperimentalWarning$LToken$ = function (feature) {
	this._errors.push(new ExperimentalWarning(feature, feature.getValue$()));
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
			} else if (this._getInputByLength$N(3) === "/**") {
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
		++this._lineNumber;
		this._columnOffset = 0;
	}
	return false;
};


Parser.prototype._parseDocComment$ = function () {
	var docComment;
	var node;
	var count;
	var tagMatch;
	var tag;
	var nameMatch;
	var token;
	var endAt;
	docComment = new DocComment();
	node = docComment;
	while (true) {
		count = this._parseDocCommentAdvanceWhiteSpace$();
		if (this._getInputByLength$N(2) === "*/") {
			this._forwardPos$N(2);
			break;
		} else if (this._getInputByLength$N(1) === "*") {
			this._forwardPos$N(1);
			this._parseDocCommentAdvanceWhiteSpace$();
		} else {
			this._forwardPos$N(- count);
		}
		tagMatch = this._getInput$().match(/^\@([0-9A-Za-z_]+)[ \t]*/);
		if (tagMatch != null) {
			this._forwardPos$N(tagMatch[0].length);
			tag = tagMatch[1];
			switch (tag) {
			case "param":
				nameMatch = this._getInput$().match(/[0-9A-Za-z_]+/);
				if (nameMatch != null) {
					token = new Token(nameMatch[0], false, this._filename, this._lineNumber, this._getColumn$());
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
				node.appendDescription$S(this._getInput$().substring(0, endAt) + "\n");
			}
			this._forwardPos$N(endAt + 2);
			break;
		}
		if (node != null) {
			node.appendDescription$S(this._getInput$() + "\n");
		}
		if (this._lineNumber === this._lines.length) {
			this._columnOffset = this._lines[this._lineNumber - 1].length;
			this._newError$S("could not find the end of the doccomment");
			return null;
		}
		++this._lineNumber;
		this._columnOffset = 0;
	}
	return docComment;
};


Parser.prototype._parseDocCommentAdvanceWhiteSpace$ = function () {
	var count;
	var ch;
	count = 0;
	while (true) {
		ch = this._getInputByLength$N(1);
		if (ch === " " || ch === "\t") {
			this._forwardPos$N(1);
			count++;
		} else {
			break;
		}
	}
	return count;
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


Parser.prototype._expectOpt$SLRegExp$ = function (expected, excludePattern) {
	return this._expectOpt$ASLRegExp$([ expected ], excludePattern);
};


Parser.prototype._expectOpt$S = function (expected) {
	return this._expectOpt$SLRegExp$(expected, null);
};


Parser.prototype._expectOpt$ASLRegExp$ = function (expected, excludePattern) {
	var i;
	var offset;
	this._advanceToken$();
	for (i = 0; i < expected.length; ++i) {
		if (this._completionRequest != null) {
			offset = this._completionRequest.isInRange$NNN(this._lineNumber, this._columnOffset, expected[i].length);
			if (offset !== - 1) {
				this._completionRequest.pushCandidates$LCompletionCandidates$(new KeywordCompletionCandidate(expected[i]).setPrefix$S(this._getInputByLength$N(offset)));
			}
		}
		if (this._getInputByLength$N(expected[i].length) === expected[i]) {
			if (expected[i].match(_Lexer.rxIdent) != null && this._getInput$().match(_Lexer.rxIdent)[0].length !== expected[i].length) {
			} else if (excludePattern != null && this._getInput$().match(excludePattern) != null) {
			} else {
				this._tokenLength = expected[i].length;
				return new Token(expected[i], false, this._filename, this._lineNumber, this._getColumn$());
			}
		}
	}
	return null;
};


Parser.prototype._expectOpt$AS = function (expected) {
	return this._expectOpt$ASLRegExp$(expected, null);
};


Parser.prototype._expect$SLRegExp$ = function (expected, excludePattern) {
	return this._expect$ASLRegExp$([ expected ], excludePattern);
};


Parser.prototype._expect$S = function (expected) {
	return this._expect$SLRegExp$(expected, null);
};


Parser.prototype._expect$ASLRegExp$ = function (expected, excludePattern) {
	var token;
	var lineOffset;
	var columnOffset;
	token = this._expectOpt$ASLRegExp$(expected, excludePattern);
	if (token == null) {
		lineOffset = this._lineNumber - 1;
		columnOffset = this._columnOffset - 1;
		while (lineOffset >= 0 && columnOffset >= 0) {
			if (! /[ \t\r\n]/.test(this._lines[lineOffset].charAt(columnOffset) || " ")) {
				break;
			}
			if (columnOffset !== 0) {
				columnOffset--;
			} else {
				do {
					columnOffset = this._lines[--lineOffset].length - 1;
				} while (this._lines[lineOffset].length === 0 && lineOffset >= 0);
			}
		}
		this._newError$SNN("expected keyword: " + expected.join(" "), lineOffset + 1, columnOffset + 1);
		return null;
	}
	return token;
};


Parser.prototype._expect$AS = function (expected) {
	return this._expect$ASLRegExp$(expected, null);
};


Parser.prototype._expectIdentifierOpt$F$LParser$LCompletionCandidates$$ = function (completionCb) {
	var matched;
	var offset;
	var token;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxIdent);
	if (completionCb != null && this._completionRequest != null) {
		offset = this._completionRequest.isInRange$NNN(this._lineNumber, this._columnOffset, (matched != null ? matched[0].length : 0));
		if (offset !== - 1) {
			this._completionRequest.pushCandidates$LCompletionCandidates$(completionCb(this).setPrefix$S(matched[0].substring(0, offset)));
		}
	}
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	token = new Token(matched[0], true, this._filename, this._lineNumber, this._getColumn$());
	if ($__jsx_ObjectHasOwnProperty.call(_Lexer.keywords, matched[0])) {
		this._newError$SLToken$("expected an identifier but found a keyword", token);
		return null;
	}
	if ($__jsx_ObjectHasOwnProperty.call(_Lexer.reserved, matched[0])) {
		this._newError$SLToken$("expected an identifier but found a reserved word", token);
		return null;
	}
	return token;
};


Parser.prototype._expectIdentifierOpt$ = function () {
	return this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$(null);
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


Parser.prototype._expectIdentifier$ = function () {
	return this._expectIdentifier$F$LParser$LCompletionCandidates$$(null);
};


Parser.prototype._expectStringLiteralOpt$ = function () {
	var heredocStartMatch;
	var preservedState;
	var value;
	var endRe;
	var input;
	var endMatch;
	var matched;
	this._advanceToken$();
	heredocStartMatch = this._getInput$().match(_Lexer.rxHeredocStart);
	if (heredocStartMatch) {
		preservedState = this._preserveState$();
		value = heredocStartMatch[0];
		this._forwardPos$N(value.length);
		endRe = (value.charAt(0) === '"' ? _Lexer.rxHeredocEndDoubleQuoted : _Lexer.rxHeredocEndSingleQuoted);
		while (true) {
			input = this._getInput$();
			endMatch = input.match(endRe);
			if (endMatch) {
				value += endMatch[0];
				this._forwardPos$N(endMatch[0].length);
				break;
			}
			value += input + "\n";
			this._lineNumber++;
			this._columnOffset = 0;
			if (this._lineNumber > this._lines.length) {
				this._restoreState$LParserState$(preservedState);
				this._newError$S("unterminated multi-line string literal");
				break;
			}
		}
		return new Token(value, false, this._filename, preservedState.lineNumber, preservedState.columnOffset);
	}
	matched = this._getInput$().match(_Lexer.rxStringLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
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
	return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
};


Parser.prototype._expectRegExpLiteralOpt$ = function () {
	var matched;
	this._advanceToken$();
	matched = this._getInput$().match(_Lexer.rxRegExpLiteral);
	if (matched == null) {
		return null;
	}
	this._tokenLength = matched[0].length;
	return new Token(matched[0], false, this._filename, this._lineNumber, this._getColumn$());
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
	token = this._expectIdentifierOpt$();
	if (token != null) {
		classes = [ token ];
		while (true) {
			if ((token = this._expect$AS([ ",", "from" ])) == null) {
				return false;
			}
			if (token.getValue$() === "from") {
				break;
			}
			if ((token = this._expectIdentifier$()) == null) {
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
		if ((alias = this._expectIdentifier$()) == null) {
			return false;
		}
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	if (alias != null && Util$isBuiltInClass$S(alias.getValue$())) {
		this._errors.push(new CompileError(alias, "cannot use name of a built-in class as an alias"));
		return false;
	}
	if (classes != null) {
		success = true;
		for (i = 0; i < this._imports.length; ++i) {
			for (j = 0; j < classes.length; ++j) {
				if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, classes[j])) {
					success = false;
				}
			}
		}
		if (! success) {
			return false;
		}
	} else {
		for (i = 0; i < this._imports.length; ++i) {
			if (alias == null) {
				if (this._imports[i].getAlias$() == null && this._imports[i].getFilenameToken$().getValue$() === filenameToken.getValue$()) {
					this._errors.push(new CompileError(filenameToken, "cannot import the same file more than once (unless using an alias)"));
					return false;
				}
			} else if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, alias)) {
				return false;
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
	var assignToken;
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
	if (this._outerClass) {
		this._classFlags |= this._outerClass.classFlags & ClassDefinition.IS_NATIVE;
	}
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
		} else if (token.getValue$() === "interface") {
			if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
				this._newError$S("interface cannot have final or native attribute set");
				return null;
			}
			this._classFlags |= ClassDefinition.IS_INTERFACE;
			break;
		} else if (token.getValue$() === "mixin") {
			if ((this._classFlags & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE | ClassDefinition.IS_EXPORT)) !== 0) {
				this._newError$S("mixin cannot have final, native, or __export__ attribute set");
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
			if (this._expectOpt$S("(") != null) {
				this._newDeprecatedWarning$S("use of native(\"...\") is deprecated, use class N { ... } = \"...\"; instead");
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
	className = this._expectIdentifier$();
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
			this._extendType = new ParsedObjectType(new QualifiedName(new Token$2("Object", true)), []);
			this._objectTypesUsed.push(this._extendType);
		}
	} else if ((this._classFlags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE)) !== 0) {
		this._newError$S("interface or mixin cannot have attributes: 'abstract', 'final', 'native");
		this._classFlags &= ~ (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE);
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
			members.push(member);
		} else {
			this._skipStatement$();
		}
	}
	assignToken = this._expectOpt$S("=");
	if (assignToken != null) {
		nativeSource = this._expectStringLiteral$();
		if (this._expect$S(";") == null) {
			return null;
		}
		if ((this._classFlags & ClassDefinition.IS_NATIVE) === 0) {
			this._errors.push(new CompileError(assignToken, "in-line native definition requires native attribute"));
			return null;
		}
	}
	if ((this._classFlags & ClassDefinition.IS_NATIVE) === 0 && Util$isBuiltInClass$S(className.getValue$())) {
		this._errors.push(new CompileError(className, "cannot re-define a built-in class"));
		success = false;
	} else if (this._outerClass != null) {
		for (i = 0; i < this._outerClass.inners.length; ++i) {
			if (this._outerClass.inners[i].className$() === className.getValue$()) {
				this._errors.push(new CompileError(className, "a non-template inner class with the same name has been already declared"));
				success = false;
				break;
			}
		}
		for (i = 0; i < this._outerClass.templateInners.length; ++i) {
			if (this._outerClass.templateInners[i].className$() === className.getValue$()) {
				this._errors.push(new CompileError(className, "a template inner class with the same name has been already declared"));
				success = false;
				break;
			}
		}
	} else {
		for (i = 0; i < this._imports.length; ++i) {
			if (! this._imports[i].checkNameConflict$ALCompileError$LToken$(this._errors, className)) {
				success = false;
			}
		}
		for (i = 0; i < this._classDefs.length; ++i) {
			if (this._classDefs[i].className$() === className.getValue$()) {
				this._errors.push(new CompileError(className, "a non-template class with the same name has been already declared"));
				success = false;
				break;
			}
		}
		for (i = 0; i < this._templateClassDefs.length; ++i) {
			if (this._templateClassDefs[i].className$() === className.getValue$()) {
				this._errors.push(new CompileError(className, "a template class with the name same has been already declared"));
				success = false;
				break;
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
		} else if (token.getValue$() === "function" || token.getValue$() === "var") {
			break;
		} else if (token.getValue$() === "__noexport__") {
			if (isNoExport) {
				this._newError$S("same attribute cannot be specified more than once");
				return null;
			} else if ((flags & ClassDefinition.IS_EXPORT) !== 0) {
				this._newError$S("cannot set the attribute, already declared as __export__");
				return null;
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
	name = this._expectIdentifier$();
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
	name = this._expectIdentifier$();
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
	this._typeArgs = this._typeArgs.concat(typeArgs);
	numObjectTypesUsed = this._objectTypesUsed.length;
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(null, null);
	try {
		if (this._expect$S("(") == null) {
			return null;
		}
		args = this._functionArgumentsExpr$BBB((this._classFlags & ClassDefinition.IS_NATIVE) !== 0, true, true);
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
		if ((this._classFlags & ClassDefinition.IS_INTERFACE) !== 0) {
			if (this._expect$S(";") == null) {
				return null;
			}
			return createDefinition(null, null, [], null);
		} else if ((flags & (ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE | ClassDefinition.IS_DELETE)) !== 0) {
			endDeclToken = this._expect$AS([ ";", "{" ]);
			if (endDeclToken == null) {
				return null;
			}
			if (endDeclToken.getValue$() === ";") {
				return createDefinition(null, null, [], null);
			}
		} else if (this._expect$S("{") == null) {
			return null;
		}
		this._arguments = args;
		if (name.getValue$() === "constructor") {
			lastToken = this._initializeBlock$();
		} else {
			lastToken = this._block$();
		}
		funcDef = createDefinition(this._locals, this._statements, this._closures, lastToken);
		return funcDef;
	} finally {
		this._popScope$();
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
		typeArg = this._expectIdentifier$();
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
		type = this._typeDeclaration$B(true);
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
	var genType;
	if ((token = this._expectOpt$S("void")) != null) {
		typeDecl = Type.voidType;
	} else {
		typeDecl = this._typeDeclarationNoVoidNoYield$();
		if (typeDecl == null) {
			return null;
		}
	}
	while (this._expectOpt$S("yield") != null) {
		genType = this._typeDeclaration$B(true);
		if (genType == null) {
			return null;
		}
		typeDecl = this._registerGeneratorTypeOf$LType$LType$(typeDecl, genType);
	}
	if (! allowVoid && typeDecl.equals$LType$(Type.voidType)) {
		this._newError$SLToken$("'void' cannot be used here", token);
		return null;
	}
	return typeDecl;
};


Parser.prototype._typeDeclarationNoVoidNoYield$ = function () {
	var typeDecl;
	var token;
	typeDecl = this._typeDeclarationNoArrayNoVoidNoYield$();
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


Parser.prototype._typeDeclarationNoArrayNoVoidNoYield$ = function () {
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
	baseType = this._typeDeclaration$B(true);
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
		for (i = 0; i < this._typeArgs.length; ++i) {
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
		if (this._classType != null && (token = this._expectOpt$S("__CLASS__")) != null) {
		} else if ((token = this._expectIdentifier$F$LParser$LCompletionCandidates$$((function (self) {
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
	} else if (token.getValue$() === "Nullable" || token.getValue$() === "MayBeUndefined") {
		this._errors.push(new CompileError(token, "cannot use 'Nullable' (or MayBeUndefined) as a class name"));
		return null;
	} else if (token.getValue$() === "__CLASS__") {
		return this._classType;
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
		} else if (typeArgs.length !== 0) {
			return this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
		} else {
			objectType = new ParsedObjectType(qualifiedName, []);
			this._objectTypesUsed.push(objectType);
			return objectType;
		}
	} else {
		enclosingType = null;
		while (true) {
			qualifiedName = (enclosingType != null ? new QualifiedName$1(token, enclosingType) : new QualifiedName$0(token, imprt));
			typeArgs = this._actualTypeArguments$();
			if (typeArgs == null) {
				return null;
			} else if (typeArgs.length !== 0) {
				enclosingType = this._templateTypeDeclaration$LQualifiedName$ALType$(qualifiedName, typeArgs);
			} else {
				objectType = new ParsedObjectType(qualifiedName, []);
				this._objectTypesUsed.push(objectType);
				enclosingType = objectType;
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
	if (className === "Array" || className === "Map") {
		if (typeArgs[0] instanceof NullableType) {
			this._newError$S("cannot declare " + className + ".<Nullable.<T>>, should be " + className + ".<T>");
			return null;
		}
		if (typeArgs[0].equals$LType$(Type.voidType)) {
			this._newError$S("cannot declare " + className + ".<T> with T=void");
			return null;
		}
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
	if (this._expect$AS([ "->", "=>" ]) == null) {
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
	this._expectIdentifierOpt$();
	if (this._expect$S("(") == null) {
		return null;
	}
	argTypes = [];
	if (this._expectOpt$S(")") == null) {
		do {
			isVarArg = this._expectOpt$S("...") != null;
			this._expectIdentifierOpt$();
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
	arrayType = new ParsedObjectType(new QualifiedName(new Token$2("Array", true)), [ elementType ]);
	this._objectTypesUsed.push(arrayType);
	return arrayType;
};


Parser.prototype._registerGeneratorTypeOf$LType$LType$ = function (seedType, genType) {
	var generatorType;
	generatorType = new ParsedObjectType(new QualifiedName(new Token$2("Generator", true)), [ seedType, genType ]);
	this._objectTypesUsed.push(generatorType);
	return generatorType;
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
	label = this._expectIdentifierOpt$();
	if (label != null && this._expectOpt$S(":") != null) {
	} else {
		this._restoreState$LParserState$(state);
		label = null;
	}
	token = this._expectOpt$AS([ "{", "var", ";", "if", "do", "while", "for", "continue", "break", "return", "switch", "throw", "try", "assert", "log", "delete", "debugger", "function", "void", "const" ]);
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
			return this._variableStatement$B(false);
		case "const":
			return this._variableStatement$B(true);
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
	} else if ((token = this._expectOpt$S("this")) != null) {
		classType = this._classType;
	} else {
		if ((classType = this._objectTypeDeclaration$LToken$BF$LClassDefinition$B$(null, true, null)) == null) {
			return false;
		}
		token = classType.getToken$();
		if (this._classType.equals$LType$(classType)) {
		} else if (this._extendType != null && this._extendType.equals$LType$(classType)) {
		} else {
			for (i = 0; i < this._implementTypes.length; ++i) {
				if (this._implementTypes[i].equals$LType$(classType)) {
					break;
				}
			}
			if (i === this._implementTypes.length) {
				return false;
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


Parser.prototype._variableStatement$B = function (isConst) {
	var succeeded;
	var expr;
	succeeded = [ false ];
	expr = this._variableDeclarations$BBAB(false, isConst, succeeded);
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
	var isGenerator;
	var name;
	var args;
	var returnType;
	var funcLocal;
	var funcDef;
	isGenerator = false;
	if (this._expectOpt$S("*") != null) {
		isGenerator = true;
	}
	name = this._expectIdentifier$();
	if (name == null) {
		return false;
	}
	if (this._expect$S("(") == null) {
		return false;
	}
	args = this._functionArgumentsExpr$BBB(false, true, false);
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
	funcLocal = this._registerLocal$LToken$LType$BB(name, new StaticFunctionType(token, returnType, args.map((function (arg) {
		return arg.getType$();
	})), false), false, true);
	funcDef = this._functionBody$LToken$LToken$LLocalVariable$ALArgumentDeclaration$LType$BB(token, name, funcLocal, args, returnType, true, isGenerator);
	if (funcDef == null) {
		return false;
	}
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
	} else if (this._expectOpt$S("var") != null) {
		succeeded = [ false ];
		initExpr = this._variableDeclarations$BBAB(true, false, succeeded);
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
		if ((lhsExpr = this._variableDeclaration$BB(true, false)) == null) {
			return - 1;
		}
	} else if ((lhsExpr = this._lhsExpr$()) == null) {
		return - 1;
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
	label = this._expectIdentifierOpt$();
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new ContinueStatement(token, label));
	return true;
};


Parser.prototype._breakStatement$LToken$ = function (token) {
	var label;
	label = this._expectIdentifierOpt$();
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
		} else if (! this._statement$()) {
			this._skipStatement$();
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
	if (this._expect$S(";") == null) {
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
		if (this._expect$S("(") == null || (catchIdentifier = this._expectIdentifier$()) == null || this._expect$S(":") == null || (catchType = this._typeDeclaration$B(false)) == null || this._expect$S(")") == null || this._expect$S("{") == null) {
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
	var msgExpr;
	expr = this._assignExpr$B(false);
	if (expr == null) {
		return false;
	}
	msgExpr = null;
	if (this._expectOpt$S(",") != null) {
		msgExpr = this._assignExpr$B(false);
		if (msgExpr == null) {
			return false;
		}
	}
	if (this._expect$S(";") == null) {
		return false;
	}
	this._statements.push(new AssertStatement(token, expr, msgExpr));
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


Parser.prototype._variableDeclarations$BBAB = function (noIn, isConst, isSuccess) {
	var expr;
	var commaToken;
	var declExpr;
	isSuccess[0] = false;
	expr = null;
	commaToken = null;
	do {
		declExpr = this._variableDeclaration$BB(noIn, isConst);
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


Parser.prototype._variableDeclaration$BB = function (noIn, isConst) {
	var identifier;
	var type;
	var local;
	var initialValue;
	var assignToken;
	var expr;
	identifier = this._expectIdentifier$();
	if (identifier == null) {
		return null;
	}
	type = null;
	if (this._expectOpt$S(":")) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	local = this._registerLocal$LToken$LType$B(identifier, type, isConst);
	initialValue = null;
	if ((assignToken = this._expectOpt$S("=")) == null) {
		if (isConst) {
			this._newError$S("initializer expression is mandatory for constant declaration");
			return null;
		}
	} else if ((initialValue = this._assignExpr$B(noIn)) == null) {
		return null;
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
			if (op.getValue$() === "=") {
				return new AssignmentExpression(op, lhsExpr, assignExpr);
			} else {
				return new FusedAssignmentExpression(op, lhsExpr, assignExpr);
			}
		}
	}
	this._restoreState$LParserState$(state);
	return this._yieldExpr$B(noIn);
};


Parser.prototype._yieldExpr$B = function (noIn) {
	var operatorToken;
	var condExpr;
	if ((operatorToken = this._expectOpt$S("yield")) != null) {
		this._newExperimentalWarning$LToken$(operatorToken);
		if (! this._isGenerator) {
			this._newError$S("invalid use of 'yield' keyword in non-generator function");
			return null;
		}
		condExpr = this._condExpr$B(noIn);
		if (condExpr == null) {
			return null;
		}
		return new YieldExpression(operatorToken, condExpr);
	}
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
	var expr;
	var token;
	var args;
	var index;
	var identifier;
	var typeArgs;
	token = this._expectOpt$AS([ "new", "super", "function" ]);
	if (token != null) {
		switch (token.getValue$()) {
		case "super":
			return this._superExpr$();
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
		expr = this._arrowFunctionOpt$();
		if (expr == null) {
			expr = this._primaryExpr$();
		}
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
	type = this._typeDeclarationNoArrayNoVoidNoYield$();
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


Parser.prototype._arrowFunctionOpt$ = function () {
	var state;
	var expr;
	state = this._preserveState$();
	if ((expr = this._arrowFunction$()) == null) {
		this._restoreState$LParserState$(state);
		return null;
	}
	return expr;
};


Parser.prototype._arrowFunction$ = function () {
	var args;
	var argName;
	var argType;
	var returnType;
	var token;
	var funcDef;
	if (this._expectOpt$S("(") != null) {
		args = this._functionArgumentsExpr$BBB(false, false, false);
		if (args == null) {
			return null;
		}
	} else {
		argName = this._expectIdentifier$();
		if (argName == null) {
			return null;
		}
		argType = null;
		if (this._expectOpt$S(":") != null) {
			if ((argType = this._typeDeclaration$B(false)) == null) {
				return null;
			}
		}
		args = [ new ArgumentDeclaration$0(argName, argType, null) ];
	}
	returnType = null;
	if (this._expectOpt$S(":") != null) {
		if ((returnType = this._typeDeclaration$B(true)) == null) {
			return null;
		}
	}
	token = this._expect$AS([ "->", "=>" ]);
	if (token == null) {
		return null;
	}
	funcDef = this._functionBody$LToken$LToken$LLocalVariable$ALArgumentDeclaration$LType$BB(token, null, null, args, returnType, this._expectOpt$S("{") != null, false);
	if (funcDef == null) {
		return null;
	}
	this._closures.push(funcDef);
	return new FunctionExpression(token, funcDef);
};


Parser.prototype._functionBody$LToken$LToken$LLocalVariable$ALArgumentDeclaration$LType$BB = function (token, name, funcLocal, args, returnType, withBlock, isGenerator) {
	var flags;
	var lastToken;
	var expr;
	var funcDef;
	this._pushScope$LLocalVariable$ALArgumentDeclaration$(funcLocal, args);
	try {
		flags = ClassDefinition.IS_STATIC;
		if (isGenerator) {
			this._isGenerator = isGenerator;
			flags |= ClassDefinition.IS_GENERATOR;
		}
		if (! withBlock) {
			lastToken = null;
			expr = this._assignExpr$();
			this._statements.push(new ReturnStatement(token, expr));
		} else {
			lastToken = this._block$();
			if (lastToken == null) {
				return null;
			}
		}
		funcDef = new MemberFunctionDefinition(token, name, flags, returnType, args, this._locals, this._statements, this._closures, lastToken, null);
		if (funcLocal != null) {
			funcDef.setFuncLocal$LLocalVariable$(funcLocal);
		}
		return funcDef;
	} finally {
		this._popScope$();
	}
};


Parser.prototype._functionExpr$LToken$ = function (token) {
	var $this = this;
	var isGenerator;
	var name;
	var args;
	var returnType;
	var type;
	var argTypes;
	var funcLocal;
	var funcDef;
	isGenerator = false;
	if (this._expectOpt$S("*") != null) {
		isGenerator = true;
	}
	name = this._expectIdentifierOpt$();
	if (this._expect$S("(") == null) {
		return null;
	}
	args = this._functionArgumentsExpr$BBB(false, false, false);
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
		funcLocal = new LocalVariable(name, type, true);
	}
	funcDef = this._functionBody$LToken$LToken$LLocalVariable$ALArgumentDeclaration$LType$BB(token, name, funcLocal, args, returnType, true, isGenerator);
	if (funcDef == null) {
		return null;
	}
	this._closures.push(funcDef);
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
		for (i = 0; i < locals.length; ++i) {
			if (locals[i].getName$().getValue$() === name) {
				found = locals[i];
				return false;
			}
		}
		if (args != null) {
			for (i = 0; i < args.length; ++i) {
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
	if ((token = this._expectOpt$AS([ "this", "undefined", "null", "false", "true", "[", "{", "(", "__FILE__", "__LINE__", "__CLASS__" ])) != null) {
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
			return this._mapLiteral$LToken$(token);
		case "(":
			expr = this._expr$B(false);
			if (this._expect$S(")") == null) {
				return null;
			}
			return expr;
		case "__FILE__":
			return new FileMacroExpression(token);
		case "__LINE__":
			return new LineMacroExpression(token);
		case "__CLASS__":
			return new ClassExpression(token, this._classType);
		default:
			throw new Error("logic flaw");
		}
	} else if ((token = this._expectNumberLiteralOpt$()) != null) {
		return new NumberLiteralExpression(token);
	} else if ((token = this._expectIdentifierOpt$F$LParser$LCompletionCandidates$$((function (self) {
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
	} else if ((token = this._expectStringLiteralOpt$()) != null) {
		return new StringLiteralExpression(token);
	} else if ((token = this._expectRegExpLiteralOpt$()) != null) {
		return new RegExpLiteralExpression(token);
	} else {
		this._newError$S("expected primary expression");
		return null;
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
	var separator;
	var type;
	exprs = [];
	while (this._expectOpt$S("]") == null) {
		expr = this._assignExpr$();
		if (expr == null) {
			return null;
		}
		exprs.push(expr);
		separator = this._expect$AS([ ",", "]" ]);
		if (separator == null) {
			return null;
		} else if (separator.getValue$() === "]") {
			break;
		}
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	return new ArrayLiteralExpression(token, exprs, type);
};


Parser.prototype._mapLiteral$LToken$ = function (token) {
	var elements;
	var keyToken;
	var expr;
	var separator;
	var type;
	elements = [];
	while (this._expectOpt$S("}") == null) {
		if ((keyToken = this._expectIdentifierOpt$()) != null || (keyToken = this._expectNumberLiteralOpt$()) != null || (keyToken = this._expectStringLiteralOpt$()) != null) {
		} else {
			this._newError$S("expected identifier, number or string");
			return null;
		}
		if (this._expect$S(":") == null) {
			return null;
		}
		expr = this._assignExpr$();
		if (expr == null) {
			return null;
		}
		elements.push(new MapLiteralElement(keyToken, expr));
		separator = this._expect$AS([ ",", "}" ]);
		if (separator == null) {
			return null;
		} else if (separator.getValue$() === "}") {
			break;
		}
	}
	type = null;
	if (this._expectOpt$S(":") != null) {
		if ((type = this._typeDeclaration$B(false)) == null) {
			return null;
		}
	}
	return new MapLiteralExpression(token, elements, type);
};


Parser.prototype._functionArgumentsExpr$BBB = function (allowVarArgs, requireTypeDeclaration, allowDefaultValues) {
	var args;
	var token;
	var isVarArg;
	var argName;
	var argType;
	var i;
	var defaultValue;
	var assignToken;
	var state;
	args = [];
	if (this._expectOpt$S(")") == null) {
		token = null;
		do {
			isVarArg = allowVarArgs && this._expectOpt$S("...") != null;
			argName = this._expectIdentifier$();
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
			} else if (this._expectOpt$S(":") != null) {
				if ((argType = this._typeDeclaration$B(false)) == null) {
					return null;
				}
			}
			for (i = 0; i < args.length; ++i) {
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
			defaultValue = null;
			assignToken = this._expectOpt$S("=");
			if (assignToken != null) {
				state = this._preserveState$();
				this._pushScope$LLocalVariable$ALArgumentDeclaration$(null, args);
				try {
					if ((defaultValue = this._assignExpr$B(true)) == null) {
						return null;
					}
				} finally {
					if (this._closures != null) {
						this._closures.splice(state.numClosures, this._closures.length - state.numClosures);
					}
					this._popScope$();
				}
				if (! allowDefaultValues) {
					this._errors.push(new CompileError(assignToken, "default parameters are only allowed for member functions"));
					return null;
				}
			} else if (args.length !== 0 && args[args.length - 1].getDefaultValue$() != null) {
				this._errors.push(new CompileError(argName, "required argument cannot be declared after an optional argument"));
				return null;
			}
			args.push(new ArgumentDeclaration$0(argName, argType, defaultValue));
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


var SourceMapGenerator$0 = require('source-map').SourceMapGenerator;
var SourceMapConsumer$0 = require('source-map').SourceMapConsumer;
function SourceMapper(rootDir, outputFile, runenv) {
	this._impl = null;
	this._header = "";
	this._sourceFiles = {};
	this._outputLength = 0;
	this._outputLineNumber = 1;
	this._rootDir = rootDir;
	this._outputFile = (outputFile != null ? Util$resolvePath$S(outputFile) : null);
	this._impl = new SourceMapGenerator$0(({ file: (outputFile != null ? Util$basename$S(this._outputFile) : null) }));
	switch (runenv) {
	case "node":
		this._header = SourceMapper.NODE_SOURCE_MAP_HEADER;
		break;
	case "web":
		this._header = SourceMapper.WEB_SOURCE_MAP_HEADER;
		break;
	default:
		this._header = "";
	}
	this._outputLength += this._header.length;
	this._outputLineNumber += this._header.split('\n').length - 1;
};

$__jsx_extend([SourceMapper], Object);
SourceMapper.prototype.getSourceMapHeader$ = function () {
	return this._header;
};


SourceMapper.prototype.makeGeneratedPos$S = function (output) {
	var pos;
	var line;
	var lastNewLinePos;
	var column;
	pos = this._outputLength;
	line = this._outputLineNumber;
	while ((pos = output.indexOf("\n", pos)) !== - 1) {
		++pos;
		++line;
	}
	this._outputLength = output.length;
	this._outputLineNumber = line;
	lastNewLinePos = output.lastIndexOf("\n") + 1;
	column = output.length - lastNewLinePos;
	return ({ line: line, column: column });
};


SourceMapper.prototype.add$SNNUSUS = function (output, tokenLineNumber, tokenColumnNumber, tokenValue, tokenFilename) {
	var genPos;
	var origPos;
	var sourceFile;
	genPos = this.makeGeneratedPos$S(output);
	if ($__jsx_isNaN(tokenLineNumber) || tokenFilename == null) {
		origPos = null;
		sourceFile = null;
		tokenValue = null;
	} else {
		origPos = ({ line: tokenLineNumber, column: tokenColumnNumber });
		sourceFile = tokenFilename;
		this._sourceFiles[sourceFile] = true;
		if (sourceFile.indexOf(this._rootDir + "/") === 0) {
			sourceFile = sourceFile.substring(this._rootDir.length + 1);
		}
	}
	this._impl.addMapping(({ generated: genPos, original: origPos, source: sourceFile, name: tokenValue }));
};


SourceMapper.prototype.setSourceContent$SS = function (sourceFile, sourceContent) {
	this._impl.setSourceContent(sourceFile, sourceContent);
};


SourceMapper.prototype.getSourceMappingFile$ = function () {
	return this._outputFile + ".mapping";
};


SourceMapper.prototype.getSourceFiles$ = function () {
	return Object.keys(this._sourceFiles);
};


SourceMapper.prototype.generate$ = function () {
	return this._impl.toString();
};


SourceMapper.prototype.getSourceMapFooter$ = function () {
	var sourceMappingURL;
	if (this._outputFile != null) {
		sourceMappingURL = Util$basename$S(this.getSourceMappingFile$());
	} else {
		sourceMappingURL = "data:application/json;base64," + new Buffer(this.generate$(), "utf8").toString("base64");
	}
	return "\n" + "//# sourceMappingURL=" + sourceMappingURL + "\n";
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
	} else if (statement instanceof IfStatement) {
		if (cb(statement.getOnTrueStatements$())) {
			ret = true;
		}
		if (cb(statement.getOnFalseStatements$())) {
			ret = true;
		}
	} else if (statement instanceof SwitchStatement) {
		if (cb(statement.getStatements$())) {
			ret = true;
		}
	} else if (statement instanceof TryStatement) {
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
	} else if (statement instanceof CatchStatement) {
		if (cb(statement.getStatements$())) {
			ret = true;
		}
	}
	return ret;
};

_Util$0.handleSubStatements$F$ALStatement$B$LStatement$ = _Util$0$handleSubStatements$F$ALStatement$B$LStatement$;

function _Util$0$exprIsAssignment$LExpression$(expr) {
	return expr instanceof AssignmentExpression || expr instanceof FusedAssignmentExpression || expr instanceof PreIncrementExpression || expr instanceof PostIncrementExpression;
};

_Util$0.exprIsAssignment$LExpression$ = _Util$0$exprIsAssignment$LExpression$;

function _Util$0$exprHasSideEffects$LExpression$(expr) {
	return expr.hasSideEffects$F$LExpression$UB$((function precheck(expr) {
		var callingFuncDef;
		if (expr instanceof CallExpression) {
			callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
			if (callingFuncDef != null && (callingFuncDef.flags$() & ClassDefinition.IS_PURE) !== 0) {
				return ! expr.forEachExpression$F$LExpression$B$((function (expr) {
					return ! expr.hasSideEffects$F$LExpression$UB$(precheck);
				}));
			}
		}
		return null;
	}));
};

_Util$0.exprHasSideEffects$LExpression$ = _Util$0$exprHasSideEffects$LExpression$;

function _Util$0$conditionIsConstant$LExpression$(expr) {
	var leafIsConstant;
	var asExpr;
	function leafIsConstant(expr) {
		if (expr instanceof NullExpression) {
			return false;
		} else if (expr instanceof BooleanLiteralExpression) {
			return expr.getDecoded$();
		} else if (expr instanceof StringLiteralExpression) {
			return !! expr.getDecoded$();
		} else if (expr instanceof NumberLiteralExpression) {
			return !! expr.getDecoded$();
		} else if (expr instanceof IntegerLiteralExpression) {
			return !! expr.getDecoded$();
		} else if (expr instanceof MapLiteralExpression || expr instanceof ArrayLiteralExpression) {
			return true;
		}
		return null;
	}
	if (expr instanceof LeafExpression) {
		return leafIsConstant(expr);
	} else if (expr instanceof AsExpression) {
		asExpr = expr;
		if (asExpr.getType$().equals$LType$(Type.booleanType)) {
			return leafIsConstant(asExpr.getExpr$());
		} else {
			return null;
		}
	}
	return null;
};

_Util$0.conditionIsConstant$LExpression$ = _Util$0$conditionIsConstant$LExpression$;

function _Util$0$decodeNumericLiteral$LExpression$(expr) {
	if (expr instanceof NumberLiteralExpression) {
		return expr.getDecoded$();
	} else {
		return expr.getDecoded$();
	}
};

_Util$0.decodeNumericLiteral$LExpression$ = _Util$0$decodeNumericLiteral$LExpression$;

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
				} else if (statement instanceof ReturnStatement) {
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
					} else if (statement instanceof SwitchStatement) {
						exprsToOptimize.push(statement.getExpr$());
						setOptimizedExprs.push((function (statement) {
							return (function (expr) {
								statement.setExpr$LExpression$(expr);
							});
						})(statement));
					}
					break;
				}
			}
			if (exprsToOptimize.length !== 0) {
				optimizeExpressions(exprsToOptimize);
				for (i = 0; i < exprsToOptimize.length; ++i) {
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
	this._log = "";
	this._dumpLogs = false;
	this._enableRunTimeTypeCheck = true;
};

$__jsx_extend([Optimizer], Object);
function Optimizer$getReleaseOptimizationCommands$() {
	return [ "lto", "no-assert", "no-log", "no-debug", "fold-const", "tail-rec", "return-if", "inline", "dce", "unbox", "fold-const", "lcse", "dce", "fold-const", "array-length", "unclassify", "staticize" ];
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
	for (i = 0; i < cmds.length; ++i) {
		cmd = cmds[i];
		if (cmd === "lto") {
			this._commands.push(new _LinkTimeOptimizationCommand());
		} else if (cmd === "no-assert") {
			this._commands.push(new _NoAssertCommand());
		} else if (cmd === "no-log") {
			this._commands.push(new _NoLogCommand());
		} else if (cmd === "no-debug") {
			this._commands.push(new _NoDebugCommand());
		} else if (cmd === "strip") {
			this._commands.push(new _StripOptimizeCommand());
		} else if (cmd === "staticize") {
			this._commands.push(new _StaticizeOptimizeCommand());
			calleesAreDetermined = false;
		} else if (cmd === "unclassify") {
			this._commands.push(new _UnclassifyOptimizationCommand());
			calleesAreDetermined = false;
		} else if (cmd === "fold-const") {
			this._commands.push(new _FoldConstantCommand());
		} else if (cmd === "dce") {
			determineCallee();
			this._commands.push(new _DeadCodeEliminationOptimizeCommand());
		} else if (cmd === "inline") {
			determineCallee();
			this._commands.push(new _InlineOptimizeCommand());
		} else if (cmd === "return-if") {
			this._commands.push(new _ReturnIfOptimizeCommand());
		} else if (cmd === "lcse") {
			determineCallee();
			this._commands.push(new _LCSEOptimizeCommand());
		} else if (cmd === "unbox") {
			determineCallee();
			this._commands.push(new _UnboxOptimizeCommand());
		} else if (cmd === "array-length") {
			this._commands.push(new _ArrayLengthOptimizeCommand());
		} else if (cmd === "tail-rec") {
			determineCallee();
			this._commands.push(new _TailRecursionOptimizeCommand());
		} else if (cmd === "dump-logs") {
			this._dumpLogs = true;
		} else {
			return "unknown optimization command: " + cmd;
		}
	}
	for (i = 0; i < this._commands.length; ++i) {
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
	for (i = 0; i < this._commands.length; ++i) {
		try {
			this.log$S("starting optimizer: " + this._commands[i]._identifier);
			this._commands[i].setup$LOptimizer$(this).performOptimization$();
			this.log$S("finished optimizer: " + this._commands[i]._identifier);
		} catch ($__jsx_catch_0) {
			if ($__jsx_catch_0 instanceof Error) {
				platform = this._compiler.getPlatform$();
				platform.error$S("fatal error: optimizer '" + this._commands[i]._identifier + "' died unexpectedly, dumping the logs" + this.dumpLogs$());
				throw $__jsx_catch_0;
			} else {
				throw $__jsx_catch_0;
			}
		}
	}
	if (this._dumpLogs) {
		platform = this._compiler.getPlatform$();
		platform.warn$S(this.dumpLogs$());
	}
};


Optimizer.prototype.log$S = function (message) {
	this._log += message + "\n";
};


Optimizer.prototype.dumpLogs$ = function () {
	return this._log;
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


_OptimizeCommand.prototype.createVar$LMemberFunctionDefinition$LType$S = function (funcDef, type, baseName) {
	var $this = this;
	var locals;
	var nameExists;
	var i;
	var newLocal;
	locals = funcDef.getLocals$();
	function nameExists(n) {
		var i;
		for (i = 0; i < locals.length; ++i) {
			if (locals[i].getName$().getValue$() === n) {
				return true;
			}
		}
		return false;
	}
	for (i = 0; nameExists(baseName + "$" + (i + "")); ++i) {
	}
	newLocal = new LocalVariable(new Token$2(baseName + "$" + (i + ""), false), type, false);
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
			if (member instanceof TemplateFunctionDefinition) {
				return true;
			}
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
				++i;
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
				++i;
			}
		}
		return false;
	}
	optimize(statements);
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
				if (statements[i] instanceof ExpressionStatement) {
					$this._optimizeExprInVoid$LExpression$F$LExpression$V$(statements[i].getExpr$(), (function (expr) {
						statements[i] = new ExpressionStatement(expr);
					}));
				}
				statements[i++].handleStatements$F$ALStatement$B$(onStatements);
			}
		}
		return true;
	})(funcDef.getStatements$());
	return shouldRetry;
};


_DeadCodeEliminationOptimizeCommand.prototype._optimizeExprInVoid$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var condExpr;
	var ifTrueHasSideEffect;
	var ifFalseHasSideEffect;
	var condAndIfTrue;
	var condOrIfFalse;
	if (expr instanceof ConditionalExpression) {
		condExpr = expr;
		ifTrueHasSideEffect = _Util$0$exprHasSideEffects$LExpression$(condExpr.getIfTrueExpr$());
		ifFalseHasSideEffect = _Util$0$exprHasSideEffects$LExpression$(condExpr.getIfFalseExpr$());
		if (ifTrueHasSideEffect && ifFalseHasSideEffect) {
		} else if (ifTrueHasSideEffect && ! ifFalseHasSideEffect) {
			condAndIfTrue = new LogicalExpression(new Token$3("&&"), condExpr.getCondExpr$(), condExpr.getIfTrueExpr$());
			replaceCb(condAndIfTrue);
		} else if (! ifTrueHasSideEffect && ifFalseHasSideEffect) {
			condOrIfFalse = new LogicalExpression(new Token$3("||"), condExpr.getCondExpr$(), condExpr.getIfFalseExpr$());
			replaceCb(condOrIfFalse);
		} else {
			replaceCb(condExpr.getCondExpr$());
		}
	} else if (expr instanceof LogicalNotExpression) {
		replaceCb(expr.getExpr$());
	}
};


_DeadCodeEliminationOptimizeCommand.prototype._optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	_Util$0$optimizeBasicBlock$LMemberFunctionDefinition$F$ALExpression$V$(funcDef, (function (exprs) {
		$this._eliminateDeadStoresToProperties$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
		$this._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$(funcDef, exprs);
	}));
	return this._eliminateUnusedVariables$LMemberFunctionDefinition$(funcDef);
};


_DeadCodeEliminationOptimizeCommand.prototype._eliminateUnusedVariables$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var shouldRetry;
	var locals;
	var localsUsed;
	var localIndex;
	shouldRetry = false;
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
			} else if (expr instanceof LocalExpression) {
				for (i = 0; i < locals.length; ++i) {
					if (locals[i] == expr.getLocal$()) {
						break;
					}
				}
				if (i !== locals.length) {
					localsUsed[i] = true;
				}
			} else if (expr instanceof FunctionExpression) {
				expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
	for (localIndex = localsUsed.length - 1; localIndex >= 0; --localIndex) {
		if (localsUsed[localIndex]) {
			continue;
		}
		(function onStatements(statements) {
			var i;
			var statement;
			var localFuncDef;
			for (i = 0; i < statements.length; ) {
				statement = statements[i];
				if (statement instanceof FunctionStatement) {
					localFuncDef = statement.getFuncDef$();
					onStatements(localFuncDef.getStatements$());
					if (localFuncDef.getFuncLocal$() == locals[localIndex]) {
						$this.log$S("removing definition of " + locals[localIndex].getName$().getNotation$());
						funcDef.getClosures$().splice(funcDef.getClosures$().indexOf(localFuncDef), 1);
						statements.splice(i, 1);
					} else {
						i++;
					}
				} else {
					i++;
				}
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
					var rhsExpr;
					if (expr instanceof AssignmentExpression && expr.getFirstExpr$() instanceof LocalExpression && expr.getFirstExpr$().getLocal$() == locals[localIndex]) {
						$this.log$S("removing assignment to " + locals[localIndex].getName$().getNotation$());
						rhsExpr = expr.getSecondExpr$();
						replaceCb(rhsExpr);
						shouldRetry = true;
						return rhsExpr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
					} else if (expr instanceof LocalExpression && expr.getLocal$() == locals[localIndex]) {
						throw new Error("logic flaw, found a variable going to be removed being used");
					} else if (expr instanceof FunctionExpression) {
						onStatements(expr.getFuncDef$().getStatements$());
					}
					return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				}));
				_Util$0$handleSubStatements$F$ALStatement$B$LStatement$(onStatements, statement);
			}
			return true;
		})(funcDef.getStatements$());
		locals.splice(localIndex, 1);
	}
	return shouldRetry;
};


_DeadCodeEliminationOptimizeCommand.prototype._delayAssignmentsBetweenLocals$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var localsUntouchable;
	var locals;
	localsUntouchable = new TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E();
	locals = new TypedMap$x2E$x3CLocalVariable$x2CExpression$x3E();
	Util$forEachExpression$F$LExpression$B$ALExpression$((function onExpr(expr) {
		var local;
		if (expr instanceof FusedAssignmentExpression && expr.getFirstExpr$() instanceof LocalExpression) {
			local = expr.getFirstExpr$().getLocal$();
			$this.log$S("local variable " + local.getName$().getValue$() + " cannot be rewritten (has fused assignment)");
			localsUntouchable.set$LLocalVariable$B(local, true);
		} else if (expr instanceof IncrementExpression && expr.getExpr$() instanceof LocalExpression) {
			local = expr.getExpr$().getLocal$();
			$this.log$S("local variable " + local.getName$().getValue$() + " cannot be rewritten (has increment)");
			localsUntouchable.set$LLocalVariable$B(local, true);
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	}), exprs);
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$((function onExpr(expr, replaceCb) {
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
					$this.log$S("resetting cache for: " + lhsLocal.getName$().getNotation$());
					locals.reversedForEach$F$LLocalVariable$LExpression$B$((function (local, expr) {
						if (local == lhsLocal) {
							$this.log$S("  clearing itself");
							locals.delete$LLocalVariable$(local);
						} else if (expr instanceof LocalExpression && expr.getLocal$() == lhsLocal) {
							$this.log$S("  clearing " + local.getName$().getNotation$());
							locals.delete$LLocalVariable$(local);
						}
						return true;
					}));
					if (assignmentExpr.getToken$().getValue$() === "=") {
						rhsExpr = assignmentExpr.getSecondExpr$();
						if (rhsExpr instanceof LocalExpression) {
							rhsLocal = rhsExpr.getLocal$();
							if (lhsLocal != rhsLocal && ! localsUntouchable.get$LLocalVariable$(rhsLocal)) {
								$this.log$S("  set to: " + rhsLocal.getName$().getNotation$());
								locals.set$LLocalVariable$LExpression$(lhsLocal, rhsExpr);
							}
						} else if (rhsExpr instanceof LeafExpression) {
							$this.log$S("  set to: " + rhsExpr.getToken$().getNotation$());
							locals.set$LLocalVariable$LExpression$(lhsLocal, rhsExpr);
						}
					}
				}
				return true;
			}
		} else if (expr instanceof LocalExpression) {
			cachedExpr = locals.get$LLocalVariable$(expr.getLocal$());
			if (cachedExpr) {
				replaceCb(cachedExpr.clone$());
				return true;
			}
		} else if (expr instanceof CallExpression) {
			callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
			if (callingFuncDef != null && (callingFuncDef.flags$() & ClassDefinition.IS_PURE) !== 0) {
			} else {
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				if (funcDef.getParent$() != null || funcDef.getClosures$().length !== 0) {
					locals.clear$();
				}
				return true;
			}
		} else if (expr instanceof NewExpression) {
			expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			locals.clear$();
			return true;
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	}), exprs);
};


_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadStores$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var lastAssignExpr;
	var onExpr;
	lastAssignExpr = new TypedMap$x2E$x3CLocalVariable$x2CPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$x3E();
	function onExpr(expr, rewriteCb) {
		var assignExpr;
		var lhsLocal;
		var lastAssign;
		if (expr instanceof AssignmentExpression) {
			assignExpr = expr;
			if (assignExpr.getFirstExpr$() instanceof LocalExpression) {
				onExpr(assignExpr.getSecondExpr$(), (function (assignExpr) {
					return (function (expr) {
						assignExpr.setSecondExpr$LExpression$(expr);
					});
				})(assignExpr));
				lhsLocal = assignExpr.getFirstExpr$().getLocal$();
				lastAssign = lastAssignExpr.get$LLocalVariable$(lhsLocal);
				if (lastAssign) {
					$this.log$S("eliminating dead store to: " + lhsLocal.getName$().getValue$());
					lastAssign.second(lastAssign.first.getSecondExpr$());
				}
				lastAssignExpr.set$LLocalVariable$LPair$x2E$x3CAssignmentExpression$x2Cfunction$x20$x28$x3A$x20Expression$x29$x20$x3A$x20void$x3E$(lhsLocal, Util$makePair$LAssignmentExpression$F$LExpression$V$(assignExpr, rewriteCb));
				return true;
			}
		} else if (expr instanceof LocalExpression) {
			lastAssignExpr.delete$LLocalVariable$(expr.getLocal$());
		} else if (expr instanceof LogicalExpression || expr instanceof ConditionalExpression) {
			expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, rewriteCb) {
				var result;
				result = onExpr(expr, rewriteCb);
				lastAssignExpr.clear$();
				return result;
			}));
			return true;
		} else if (_Util$0$exprHasSideEffects$LExpression$(expr)) {
			expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			lastAssignExpr.clear$();
			return true;
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	}
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
		if (baseExpr instanceof LocalExpression || baseExpr instanceof ThisExpression || baseExpr.isClassSpecifier$()) {
			return true;
		} else {
			return false;
		}
	}
	function baseExprsAreEqual(x, y) {
		if (x instanceof LocalExpression && y instanceof LocalExpression) {
			return x.getLocal$() == y.getLocal$();
		} else if (x instanceof ThisExpression && y instanceof ThisExpression) {
			return true;
		} else if (x.isClassSpecifier$() && y.isClassSpecifier$()) {
			return x.getType$().equals$LType$(y.getType$());
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
			if (isFirstLevelPropertyAccess(firstExpr) && ! Util$rootIsNativeClass$LType$(firstExpr.getExpr$().getType$())) {
				propertyName = firstExpr.getIdentifierToken$().getValue$();
				onExpr(assignmentExpr.getSecondExpr$(), null);
				if (lastAssignExpr[propertyName] && lastAssignExpr[propertyName].second != null && baseExprsAreEqual(firstExpr.getExpr$(), lastAssignExpr[propertyName].first.getFirstExpr$().getExpr$())) {
					lastAssignExpr[propertyName].second(lastAssignExpr[propertyName].first.getSecondExpr$());
				}
				lastAssignExpr[propertyName] = Util$makePair$LAssignmentExpression$F$LExpression$V$(assignmentExpr, rewriteCb);
				return true;
			} else if (assignmentExpr.getFirstExpr$() instanceof LocalExpression) {
				onExpr(assignmentExpr.getSecondExpr$(), null);
				for (k in lastAssignExpr) {
					baseExpr = lastAssignExpr[k].first.getFirstExpr$().getExpr$();
					if (baseExpr instanceof LocalExpression && baseExpr.getLocal$() == expr.getFirstExpr$().getLocal$()) {
						delete lastAssignExpr[k];
					}
				}
				return true;
			}
		} else if (isFirstLevelPropertyAccess(expr)) {
			propertyName = expr.getIdentifierToken$().getValue$();
			delete lastAssignExpr[propertyName];
		} else if (expr instanceof CallExpression) {
			onExpr(expr.getExpr$(), null);
			Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
			lastAssignExpr = {};
			return true;
		} else if (expr instanceof NewExpression) {
			Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
			lastAssignExpr = {};
			return true;
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, exprs);
};


_DeadCodeEliminationOptimizeCommand.prototype._eliminateDeadConditions$LMemberFunctionDefinition$ALExpression$ = function (funcDef, exprs) {
	var $this = this;
	var spliceStatements;
	function spliceStatements(dest, index, src) {
		var i;
		dest.splice(index, 1);
		for (i = 0; i < src.length; ++i) {
			dest.splice(index + i, 0, src[i]);
		}
	}
	(function onStatements(statements) {
		var i;
		var statement;
		var ifStatement;
		var cond;
		for (i = statements.length - 1; i >= 0; --i) {
			statement = statements[i];
			if (statement instanceof IfStatement) {
				ifStatement = statement;
				cond = _Util$0$conditionIsConstant$LExpression$(ifStatement.getExpr$());
				if (cond == null) {
				} else if (cond === false && ifStatement.getOnFalseStatements$().length === 0) {
					statements.splice(i, 1);
				} else if (cond === false) {
					spliceStatements(statements, i, ifStatement.getOnFalseStatements$());
				} else if (cond === true) {
					spliceStatements(statements, i, ifStatement.getOnTrueStatements$());
				}
			}
			statement.handleStatements$F$ALStatement$B$(onStatements);
		}
		return true;
	})(funcDef.getStatements$());
};


function _ReturnIfOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _ReturnIfOptimizeCommand.IDENTIFIER);
	this._altered = false;
};

$__jsx_extend([_ReturnIfOptimizeCommand], _FunctionOptimizeCommand);
_ReturnIfOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (funcDef.getReturnType$() == null || funcDef.getReturnType$().equals$LType$(Type.voidType)) {
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
	} else if (statements.length >= 2 && statements[statements.length - 1] instanceof ReturnStatement && statements[statements.length - 2] instanceof IfStatement) {
		ifStatement = statements[statements.length - 2];
		if (this._statementsCanBeReturnExpr$ALStatement$(ifStatement.getOnTrueStatements$())) {
			onFalseStatements = ifStatement.getOnFalseStatements$();
			if (onFalseStatements.length === 0) {
				statements.splice(statements.length - 2, 2, this._createReturnStatement$LToken$LExpression$LExpression$LExpression$(ifStatement.getToken$(), ifStatement.getExpr$(), ifStatement.getOnTrueStatements$()[0].getExpr$(), statements[statements.length - 1].getExpr$()));
				this._altered = true;
				this._optimizeStatements$ALStatement$(statements);
			} else if (onFalseStatements.length === 1 && onFalseStatements[0] instanceof IfStatement && onFalseStatements[0].getOnFalseStatements$().length === 0) {
				onFalseStatements[0].getOnFalseStatements$().push(statements[statements.length - 1]);
				statements.pop();
				this._altered = true;
				this._optimizeStatements$ALStatement$(statements);
			}
		}
	}
};


_ReturnIfOptimizeCommand.prototype._createReturnStatement$LToken$LExpression$LExpression$LExpression$ = function (token, condExpr, trueExpr, falseExpr) {
	return new ReturnStatement(token, new ConditionalExpression$0(new Token$2("?", false), condExpr, trueExpr, falseExpr, falseExpr.getType$()));
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
		this._replaceCb(new AssignmentExpression(new Token$2("=", false), this._localExpr, this._origExpr));
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
	var clearCache;
	this.log$S("optimizing expressions starting");
	cachedExprs = {};
	getCacheKey = (function (expr) {
		var propertyExpr;
		var receiverType;
		var base;
		if (expr instanceof PropertyExpression) {
			propertyExpr = expr;
			receiverType = propertyExpr.getExpr$().getType$();
			if (Util$rootIsNativeClass$LType$(receiverType)) {
				return null;
			}
			base = getCacheKey(propertyExpr.getExpr$());
			if (base == null) {
				return null;
			}
			return base + "." + propertyExpr.getIdentifierToken$().getValue$();
		} else if (expr instanceof LocalExpression) {
			return expr.getLocal$().getName$().getValue$();
		} else if (expr instanceof ThisExpression) {
			return "this";
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
	clearCache = (function () {
		$this.log$S("clearing lcse cache");
		cachedExprs = {};
	});
	Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$((function onExpr(expr, replaceCb) {
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
		if (expr instanceof AssignmentExpression || expr instanceof FusedAssignmentExpression) {
			assignmentExpr = expr;
			lhsExpr = assignmentExpr.getFirstExpr$();
			if (lhsExpr instanceof LocalExpression) {
				onExpr(assignmentExpr.getSecondExpr$(), (function (expr) {
					assignmentExpr.setSecondExpr$LExpression$(expr);
				}));
				clearCacheByLocalName(lhsExpr.getLocal$().getName$().getValue$());
			} else if (lhsExpr instanceof PropertyExpression) {
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
			return true;
		} else if (expr instanceof IncrementExpression) {
			incrementExpr = expr;
			if (incrementExpr.getExpr$() instanceof PropertyExpression) {
				propertyExpr = incrementExpr.getExpr$();
				onExpr(propertyExpr.getExpr$(), (function (expr) {
					propertyExpr.setExpr$LExpression$(expr);
				}));
			}
			clearCache();
			return true;
		} else if (expr instanceof ConditionalExpression) {
			conditionalExpr = expr;
			onExpr(conditionalExpr.getCondExpr$(), (function (expr) {
				conditionalExpr.setCondExpr$LExpression$(expr);
			}));
			clearCache();
			return true;
		} else if (expr instanceof LogicalExpression) {
			if (! expr.forEachExpression$F$LExpression$B$((function (expr) {
				return ! _Util$0$exprHasSideEffects$LExpression$(expr);
			}))) {
				clearCache();
				return true;
			}
		} else if (expr instanceof FunctionExpression) {
			clearCache();
			return true;
		} else if (expr instanceof CallExpression) {
			funcExpr = expr.getExpr$();
			if (funcExpr instanceof LocalExpression) {
			} else if (funcExpr instanceof PropertyExpression) {
				propertyExpr = funcExpr;
				onExpr(propertyExpr.getExpr$(), (function (expr) {
					propertyExpr.setExpr$LExpression$(expr);
				}));
			} else {
				clearCache();
			}
			args = expr.getArguments$();
			for (i = 0; i < args.length; ++i) {
				onExpr(args[i], (function (args, index) {
					return (function (expr) {
						args[index] = expr;
					});
				})(args, i));
			}
			clearCache();
			return true;
		} else if (expr instanceof NewExpression) {
			$this.log$S("new expression");
			args = expr.getArguments$();
			for (i = 0; i < args.length; ++i) {
				onExpr(args[i], (function (args, index) {
					return (function (expr) {
						args[index] = expr;
					});
				})(args, i));
			}
			clearCache();
			return true;
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
	}), exprs);
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
		this.log$S(funcDef.getNotation$() + " optimizing " + statement.getToken$().getNotation$());
		lengthLocal = this.createVar$LMemberFunctionDefinition$LType$S(funcDef, Type.integerType, arrayLocal.getName$().getValue$() + "$len");
		assignToLocal = new AssignmentExpression(new Token$3("="), new LocalExpression(new Token$2(lengthLocal.getName$().getValue$(), true), lengthLocal), new PropertyExpression$0(new Token$3("."), new LocalExpression(new Token$2(arrayLocal.getName$().getValue$(), true), arrayLocal), new Token$3("length"), [], lengthLocal.getType$()));
		if (statement.getInitExpr$() != null) {
			statement.setInitExpr$LExpression$(new CommaExpression(new Token$3(","), statement.getInitExpr$(), assignToLocal));
		} else {
			statement.setInitExpr$LExpression$(assignToLocal);
		}
		onExpr = (function (expr, replaceCb) {
			if (expr instanceof PropertyExpression && expr.getIdentifierToken$().getValue$() === "length" && expr.getExpr$() instanceof LocalExpression && expr.getExpr$().getLocal$() == arrayLocal) {
				replaceCb(new LocalExpression(new Token$2(lengthLocal.getName$().getValue$(), true), lengthLocal));
			} else {
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			}
			return true;
		});
		if (statement.getCondExpr$() != null) {
			statement.getCondExpr$().forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		}
		if (statement.getPostExpr$() != null) {
			statement.getPostExpr$().forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		}
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
	} else if (expr instanceof CallExpression || expr instanceof SuperExpression) {
		return false;
	} else if (expr instanceof IncrementExpression) {
		if (this._lhsMayModifyLength$LExpression$(expr.getExpr$())) {
			return false;
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


function _TailRecursionOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _TailRecursionOptimizeCommand.IDENTIFIER);
};

$__jsx_extend([_TailRecursionOptimizeCommand], _FunctionOptimizeCommand);
_TailRecursionOptimizeCommand.prototype.optimizeFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var altered;
	var statements;
	var body;
	if ((funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_NATIVE)) !== 0 || (funcDef.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_FINAL)) === 0) {
		return false;
	}
	altered = false;
	statements = funcDef.getStatements$();
	(function onStatements(statements) {
		var i;
		for (i = 0; i < statements.length; ++i) {
			if ($this._isTailCall$LMemberFunctionDefinition$LStatement$(funcDef, statements[i])) {
				$this._replaceTailCallStatement$LMemberFunctionDefinition$ALStatement$N(funcDef, statements, i);
				altered = true;
			}
			statements[i].handleStatements$F$ALStatement$B$(onStatements);
		}
		return true;
	})(statements);
	if (altered) {
		this.log$S("transform " + funcDef.getNotation$());
		body = new WhileStatement(new Token$3("while"), new Token$3(_TailRecursionOptimizeCommand.LABEL), new BooleanLiteralExpression(new Token$3("true")), statements);
		funcDef.setStatements$ALStatement$([ body ]);
	}
	return true;
};


_TailRecursionOptimizeCommand.prototype._isTailCall$LMemberFunctionDefinition$LStatement$ = function (funcDef, statement) {
	var returnStatement;
	if (statement instanceof ReturnStatement) {
		returnStatement = statement;
		if (returnStatement.getExpr$() != null && returnStatement.getExpr$() instanceof CallExpression) {
			return funcDef == _DetermineCalleeCommand$getCallingFuncDef$LStashable$(returnStatement.getExpr$());
		}
	}
	return false;
};


_TailRecursionOptimizeCommand.prototype._replaceTailCallStatement$LMemberFunctionDefinition$ALStatement$N = function (funcDef, statements, idx) {
	var $this = this;
	var callExpression;
	var locals;
	var setupArgs;
	var retry;
	var localsToArgs;
	callExpression = statements[idx].getExpr$();
	locals = funcDef.getArguments$().map((function (argDecl) {
		return $this.createVar$LMemberFunctionDefinition$LType$S(funcDef, argDecl.getType$(), argDecl.getName$().getValue$());
	}));
	setupArgs = callExpression.getArguments$().reduce((function (prevExpr, arg, i) {
		var assignToArg;
		assignToArg = new AssignmentExpression(new Token$3("="), new LocalExpression(locals[i].getName$(), locals[i]), arg);
		return (prevExpr == null ? assignToArg : new CommaExpression(new Token$3(","), prevExpr, assignToArg));
	}), null);
	retry = new ContinueStatement(new Token$3("continue"), new Token$3(_TailRecursionOptimizeCommand.LABEL));
	if (setupArgs == null) {
		statements.splice(idx, 1, retry);
	} else {
		localsToArgs = locals.reduce((function (prevExpr, local, i) {
			var assignToArg;
			assignToArg = new AssignmentExpression(new Token$3("="), new LocalExpression(funcDef.getArguments$()[i].getName$(), funcDef.getArguments$()[i]), new LocalExpression(local.getName$(), local));
			return (prevExpr == null ? assignToArg : new CommaExpression(new Token$3(","), prevExpr, assignToArg));
		}), null);
		statements.splice(idx, 1, new ExpressionStatement(setupArgs), new ExpressionStatement(localsToArgs), retry);
	}
};


function _StructuredStashAccessor$x2E$x3CStash$x3E() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E = true;

_StructuredStashAccessor$x2E$x3CStash$x3E.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _LinkTimeOptimizationCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _LinkTimeOptimizationCommand() {
	_OptimizeCommand.call(this, _LinkTimeOptimizationCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E.call(this);
};

$__jsx_extend([_LinkTimeOptimizationCommand], _OptimizeCommand);
$__jsx_merge_interface(_LinkTimeOptimizationCommand, _StructuredStashAccessor$x2E$x3CStash$x3E);

_LinkTimeOptimizationCommand.prototype.performOptimization$ = function () {
	var $this = this;
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		var i;
		if (classDef.extendType$() != null) {
			$this.getStash$LStashable$(classDef.extendType$().getClassDef$()).extendedBy.push(classDef);
		}
		for (i = 0; i < classDef.implementTypes$().length; ++i) {
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
		} else if ((classDef.flags$() & (ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) === 0) {
			classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				var overrides;
				if ((funcDef.flags$() & (ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE | ClassDefinition.IS_FINAL)) !== 0) {
				} else if ((funcDef.flags$() & ClassDefinition.IS_ABSTRACT) === 0) {
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
				} else if ((funcDef.flags$() & ClassDefinition.IS_ABSTRACT) !== 0) {
				}
				return true;
			}));
		}
		return true;
	}));
};


_LinkTimeOptimizationCommand.prototype._getOverrides$LClassDefinition$ALClassDefinition$SALType$ = function (srcClassDef, classDefs, name, argTypes) {
	var overrides;
	var i;
	overrides = [];
	for (i = 0; i < classDefs.length; ++i) {
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
	for (i = 0; i < implementClassDefs.length; ++i) {
		if (srcClassDef != implementClassDefs[i]) {
			implementClassDefs[i].forEachClassToBase$F$LClassDefinition$B$((function (classDef) {
				return classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$(addOverride);
			}));
		}
	}
	return overrides;
};


function _StructuredStashAccessor$x2E$x3C_Stash$x3E() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3C_Stash$x3E], Object);
_StructuredStashAccessor$x2E$x3C_Stash$x3E.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3C_Stash$x3E = true;

_StructuredStashAccessor$x2E$x3C_Stash$x3E.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _StripOptimizeCommand$x2E_Stash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3C_Stash$x3E.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _StripOptimizeCommand() {
	_OptimizeCommand.call(this, _StripOptimizeCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3C_Stash$x3E.call(this);
	this._classesInstantiated = [];
	this._methodsAlive = {};
	this._membersToWalk = [];
};

$__jsx_extend([_StripOptimizeCommand], _OptimizeCommand);
$__jsx_merge_interface(_StripOptimizeCommand, _StructuredStashAccessor$x2E$x3C_Stash$x3E);

_StripOptimizeCommand.prototype._touchStatic$LMemberDefinition$ = function (member) {
	var stash;
	stash = this.getStash$LStashable$(member);
	if (stash.touched) {
		return;
	}
	this.log$S("touched " + member.getNotation$());
	stash.touched = true;
	this._membersToWalk.push(member);
};


_StripOptimizeCommand.prototype._touchInstance$LClassDefinition$ = function (classDef) {
	var $this = this;
	var stash;
	var name;
	var listOfArgTypes;
	var i;
	var funcDef;
	stash = this.getStash$LStashable$(classDef);
	if (stash.touched) {
		return;
	}
	this.log$S("touched " + classDef.className$());
	stash.touched = true;
	this._classesInstantiated.push(classDef);
	for (name in this._methodsAlive) {
		listOfArgTypes = this._methodsAlive[name];
		for (i = 0; i !== listOfArgTypes.length; ++i) {
			funcDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, name, listOfArgTypes[i], false);
			if (funcDef != null) {
				this._membersToWalk.push(funcDef);
			}
		}
	}
	classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
		if ((varDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
			$this._membersToWalk.push(varDef);
		}
		return true;
	}));
	if (classDef.extendType$() != null) {
		this._touchInstance$LClassDefinition$(classDef.extendType$().getClassDef$());
	}
	classDef.implementTypes$().forEach((function (implementType) {
		$this._touchInstance$LClassDefinition$(implementType.getClassDef$());
	}));
	if (classDef.getOuterClassDef$() != null) {
		this._touchInstance$LClassDefinition$(classDef.getOuterClassDef$());
	}
};


_StripOptimizeCommand.prototype._touchConstructor$LMemberFunctionDefinition$ = function (funcDef) {
	var stash;
	stash = this.getStash$LStashable$(funcDef);
	if (stash.touched) {
		return;
	}
	this.log$S("touched " + funcDef.getNotation$());
	stash.touched = true;
	this._membersToWalk.push(funcDef);
	this._touchInstance$LClassDefinition$(funcDef.getClassDef$());
};


_StripOptimizeCommand.prototype._touchMethod$SALType$ = function (name, argTypes) {
	var listOfArgTypes;
	var i;
	var funcDef;
	if ($__jsx_ObjectHasOwnProperty.call(this._methodsAlive, name)) {
		listOfArgTypes = this._methodsAlive[name];
	} else {
		listOfArgTypes = this._methodsAlive[name] = [];
	}
	for (i = 0; i < listOfArgTypes.length; ++i) {
		if (Util$typesAreEqual$ALType$ALType$(listOfArgTypes[i], argTypes)) {
			return;
		}
	}
	this.log$S("touched #" + name);
	listOfArgTypes.push(argTypes.concat());
	for (i = 0; i < this._classesInstantiated.length; ++i) {
		funcDef = Util$findFunctionInClass$LClassDefinition$SALType$B(this._classesInstantiated[i], name, argTypes, false);
		if (funcDef != null) {
			this._membersToWalk.push(funcDef);
		}
	}
};


_StripOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	var isEmittedClass;
	var member;
	var memberShouldPreserve;
	function isEmittedClass(classDef) {
		if (classDef instanceof TemplateClassDefinition) {
			return false;
		}
		if ((classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			return false;
		}
		return true;
	}
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		$this.resetStash$LStashable$(classDef);
		return classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
			$this.resetStash$LStashable$(member);
			return true;
		}));
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (! (classDef instanceof TemplateClassDefinition) && (classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
				if (funcDef.name$() === "constructor") {
				} else if ((funcDef.flags$() & ClassDefinition.IS_FINAL) !== 0) {
				} else {
					$this._touchMethod$SALType$(funcDef.name$(), funcDef.getArgumentTypes$());
				}
				return true;
			}));
		}
		return true;
	}));
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (isEmittedClass(classDef)) {
			if ((classDef.flags$() & ClassDefinition.IS_EXPORT) !== 0) {
				$this._touchInstance$LClassDefinition$(classDef);
			}
			classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				var funcDef;
				if ((member.flags$() & ClassDefinition.IS_EXPORT) !== 0) {
					if ((member.flags$() & ClassDefinition.IS_STATIC) !== 0) {
						$this._touchStatic$LMemberDefinition$(member);
					} else if (member instanceof MemberFunctionDefinition) {
						funcDef = member;
						if (funcDef.name$() === "constructor") {
							$this._touchConstructor$LMemberFunctionDefinition$(funcDef);
						} else {
							$this._touchMethod$SALType$(funcDef.name$(), funcDef.getArgumentTypes$());
						}
					}
				}
				return true;
			}));
		}
		return true;
	}));
	while (this._membersToWalk.length !== 0) {
		member = this._membersToWalk.shift();
		this.log$S("walking " + member.getNotation$());
		if (member instanceof MemberFunctionDefinition) {
			this._walkFunctionDefinition$LMemberFunctionDefinition$(member);
		} else {
			this._walkVariableDefinition$LMemberVariableDefinition$(member);
		}
	}
	function memberShouldPreserve(member) {
		var isTouched;
		var listOfArgTypes;
		var i;
		if ((member.flags$() & ClassDefinition.IS_EXPORT) !== 0) {
			return true;
		}
		isTouched = $this.getStash$LStashable$(member).touched;
		if ((member.flags$() & ClassDefinition.IS_STATIC) !== 0) {
			return isTouched;
		} else if (member instanceof MemberFunctionDefinition) {
			if (member.name$() === "constructor") {
				return isTouched;
			} else {
				if ($this.getStash$LStashable$(member.getClassDef$()).touched && $__jsx_ObjectHasOwnProperty.call($this._methodsAlive, member.name$())) {
					listOfArgTypes = $this._methodsAlive[member.name$()];
					for (i = 0; i !== listOfArgTypes.length; ++i) {
						if (Util$typesAreEqual$ALType$ALType$(listOfArgTypes[i], member.getArgumentTypes$())) {
							return true;
						}
					}
				}
				return false;
			}
		}
		return true;
	}
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		var numConstructors;
		var members;
		var memberIndex;
		var member;
		var ctor;
		if (isEmittedClass(classDef)) {
			numConstructors = 0;
			members = classDef.members$();
			for (memberIndex = 0; memberIndex !== members.length; ) {
				member = members[memberIndex];
				if (memberShouldPreserve(member)) {
					if (member instanceof MemberFunctionDefinition && (member.flags$() & ClassDefinition.IS_STATIC) === 0 && member.name$() === "constructor") {
						++numConstructors;
					}
					++memberIndex;
					$this.log$S("preserving used: " + member.getNotation$());
				} else {
					$this.log$S("removing unused: " + member.getNotation$());
					members.splice(memberIndex, 1);
				}
			}
			if (numConstructors === 0) {
				$this.log$S("substituting fake constructor for class: " + classDef.className$());
				ctor = new MemberFunctionDefinition(null, new Token$2("constructor", true), ClassDefinition.IS_FINAL | classDef.flags$() & ClassDefinition.IS_EXPORT, Type.voidType, [], [], [], [], classDef.getToken$(), null);
				ctor.setClassDef$LClassDefinition$(classDef);
				members.push(ctor);
			}
		}
		return true;
	}));
	this.getCompiler$().getParsers$().forEach((function (parser) {
		var classDefs;
		var i;
		var preserve;
		classDefs = parser.getClassDefs$();
		for (i = 0; i !== classDefs.length; ) {
			preserve = true;
			if ((classDefs[i].flags$() & ClassDefinition.IS_NATIVE) !== 0 && classDefs[i].getNativeSource$() != null && ! $this.getStash$LStashable$(classDefs[i]).touched && classDefs[i].forEachMember$F$LMemberDefinition$B$((function (member) {
				if ((member.flags$() & ClassDefinition.IS_STATIC) === 0) {
					return true;
				}
				return ! $this.getStash$LStashable$(member).touched;
			}))) {
				preserve = false;
			}
			if (preserve) {
				++i;
			} else {
				$this.log$S("removing unused native class: " + classDefs[i].className$());
				classDefs.splice(i, 1);
			}
		}
	}));
};


_StripOptimizeCommand.prototype._walkExpression$LExpression$ = function (expr) {
	var $this = this;
	var onExpr;
	function onExpr(expr) {
		var callee;
		var propertyExpr;
		var holderClassDef;
		var name;
		var member;
		var superExpr;
		if (expr instanceof NewExpression) {
			callee = Util$findFunctionInClass$LClassDefinition$SALType$B(expr.getType$().getClassDef$(), "constructor", expr.getConstructor$().getArgumentTypes$(), false);
			$this._touchConstructor$LMemberFunctionDefinition$(callee);
		} else if (expr instanceof InstanceofExpression) {
			$this._touchInstance$LClassDefinition$(expr.getExpectedType$().getClassDef$());
		} else if (expr instanceof AsExpression) {
			if (expr.getType$() instanceof ObjectType) {
				$this._touchInstance$LClassDefinition$(expr.getType$().getClassDef$());
			}
		} else if (expr instanceof AsNoConvertExpression) {
			if (expr.getType$() instanceof ObjectType) {
				$this._touchInstance$LClassDefinition$(expr.getType$().getClassDef$());
			}
		} else if (expr instanceof PropertyExpression) {
			propertyExpr = expr;
			holderClassDef = propertyExpr.getHolderType$().getClassDef$();
			if (propertyExpr.isClassSpecifier$()) {
				if ((holderClassDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
					$this._touchInstance$LClassDefinition$(holderClassDef);
				}
			} else {
				name = propertyExpr.getIdentifierToken$().getValue$();
				if (propertyExpr.getExpr$().isClassSpecifier$()) {
					if (Util$isReferringToFunctionDefinition$LPropertyExpression$(propertyExpr)) {
						member = Util$findFunctionInClass$LClassDefinition$SALType$B(holderClassDef, name, expr.getType$().getArgumentTypes$(), true);
					} else {
						member = Util$findVariableInClass$LClassDefinition$SB(holderClassDef, name, true);
					}
					$this._touchStatic$LMemberDefinition$(member);
				} else if (Util$isReferringToFunctionDefinition$LPropertyExpression$(propertyExpr)) {
					$this._touchMethod$SALType$(name, expr.getType$().getArgumentTypes$());
				}
			}
		} else if (expr instanceof SuperExpression) {
			superExpr = expr;
			$this._touchMethod$SALType$(superExpr.getName$().getValue$(), superExpr.getFunctionType$().getArgumentTypes$());
		}
		return expr.forEachExpression$F$LExpression$B$(onExpr);
	}
	return onExpr(expr);
};


_StripOptimizeCommand.prototype._walkStatement$LStatement$ = function (statement) {
	var $this = this;
	var onStatement;
	function onStatement(statement) {
		var ctorStatement;
		var callee;
		if (statement instanceof ConstructorInvocationStatement) {
			ctorStatement = statement;
			callee = Util$findFunctionInClass$LClassDefinition$SALType$B(ctorStatement.getConstructingClassDef$(), "constructor", ctorStatement.getConstructorType$().getArgumentTypes$(), false);
			$this._touchConstructor$LMemberFunctionDefinition$(callee);
		}
		statement.forEachExpression$F$LExpression$B$((function (expr) {
			return $this._walkExpression$LExpression$(expr);
		}));
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}
	return onStatement(statement);
};


_StripOptimizeCommand.prototype._walkFunctionDefinition$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	if (funcDef.getStatements$() != null) {
		funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
			return $this._walkStatement$LStatement$(statement);
		}));
	}
	return funcDef.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
		return $this._walkFunctionDefinition$LMemberFunctionDefinition$(funcDef);
	}));
};


_StripOptimizeCommand.prototype._walkVariableDefinition$LMemberVariableDefinition$ = function (varDef) {
	var $this = this;
	var initialValue;
	initialValue = varDef.getInitialValue$();
	if (initialValue != null) {
		this._walkExpression$LExpression$(initialValue);
	}
	return varDef.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
		return $this._walkFunctionDefinition$LMemberFunctionDefinition$(funcDef);
	}));
};


function _StructuredStashAccessor$x2E$x3CStash$x3E$0() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$0], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$0.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$0 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$0.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _DetermineCalleeCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$0.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _DetermineCalleeCommand() {
	_FunctionOptimizeCommand.call(this, _DetermineCalleeCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$0.call(this);
};

$__jsx_extend([_DetermineCalleeCommand], _FunctionOptimizeCommand);
$__jsx_merge_interface(_DetermineCalleeCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$0);

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
		} else if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			var calleeExpr;
			var propertyExpr;
			var holderType;
			var callingFuncDef;
			var newExpr;
			if (expr instanceof CallExpression) {
				calleeExpr = expr.getExpr$();
				if (calleeExpr instanceof PropertyExpression && ! calleeExpr.getType$().isAssignable$()) {
					propertyExpr = calleeExpr;
					holderType = propertyExpr.getHolderType$();
					callingFuncDef = _DetermineCalleeCommand$findCallingFunction$LClassDefinition$SALType$B(holderType.getClassDef$(), propertyExpr.getIdentifierToken$().getValue$(), propertyExpr.getType$().getArgumentTypes$(), propertyExpr.getExpr$().isClassSpecifier$());
					$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, callingFuncDef);
				} else if (calleeExpr instanceof FunctionExpression) {
					$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, calleeExpr.getFuncDef$());
				} else {
					$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(expr, null);
				}
			} else if (expr instanceof NewExpression) {
				newExpr = expr;
				if (! (newExpr.getType$().getClassDef$() != null)) {
					debugger;
					throw new Error("[src/optimizer.jsx:1039:59] assertion failure\n                    assert newExpr.getType().getClassDef() != null;\n                                                           ^^\n");
				}
				if (! (newExpr.getConstructor$() != null)) {
					debugger;
					throw new Error("[src/optimizer.jsx:1040:52] assertion failure\n                    assert newExpr.getConstructor() != null;\n                                                    ^^\n");
				}
				callingFuncDef = _DetermineCalleeCommand$findCallingFunctionInClass$LClassDefinition$SALType$B(newExpr.getType$().getClassDef$(), "constructor", newExpr.getConstructor$().getArgumentTypes$(), false);
				if (callingFuncDef == null) {
					throw new Error("could not find matching constructor for " + newExpr.getConstructor$().toString());
				}
				$this._setCallingFuncDef$LStashable$LMemberFunctionDefinition$(newExpr, callingFuncDef);
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
	stash = stashable.getStash$S(_DetermineCalleeCommand.IDENTIFIER);
	if (stash == null) {
		throw new Error("callee not searched");
	}
	return stash.callingFuncDef;
};

_DetermineCalleeCommand.getCallingFuncDef$LStashable$ = _DetermineCalleeCommand$getCallingFuncDef$LStashable$;

function _StructuredStashAccessor$x2E$x3CStash$x3E$1() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$1], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$1.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$1 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$1.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _StaticizeOptimizeCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$1.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _StaticizeOptimizeCommand() {
	_OptimizeCommand.call(this, _StaticizeOptimizeCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$1.call(this);
};

$__jsx_extend([_StaticizeOptimizeCommand], _OptimizeCommand);
$__jsx_merge_interface(_StaticizeOptimizeCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$1);

_StaticizeOptimizeCommand.prototype.performOptimization$ = function () {
	var $this = this;
	var memberCanBeStaticized;
	function memberCanBeStaticized(funcDef) {
		var onStatement;
		if ((funcDef.flags$() & (ClassDefinition.IS_OVERRIDE | ClassDefinition.IS_ABSTRACT | ClassDefinition.IS_FINAL | ClassDefinition.IS_STATIC | ClassDefinition.IS_NATIVE)) !== ClassDefinition.IS_FINAL) {
			return false;
		}
		if (funcDef.name$() === "constructor") {
			return false;
		}
		function onStatement(statement) {
			if (statement instanceof FunctionStatement) {
				return statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			return statement.forEachExpression$F$LExpression$B$((function onExpression(expr) {
				if (expr instanceof FunctionExpression) {
					return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
				} else if (expr instanceof SuperExpression) {
					return false;
				}
				return expr.forEachExpression$F$LExpression$B$(onExpression);
			})) && statement.forEachStatement$F$LStatement$B$(onStatement);
		}
		if (! funcDef.forEachStatement$F$LStatement$B$(onStatement)) {
			return false;
		}
		return true;
	}
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if ((classDef.flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) !== 0) {
			return true;
		}
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function onFunction(funcDef) {
			if (memberCanBeStaticized(funcDef)) {
				$this.log$S("staticizing method: " + funcDef.name$());
				$this._staticizeMethod$LMemberFunctionDefinition$(funcDef);
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
			$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$LMemberFunctionDefinition$(varDef.getInitialValue$(), (function (expr) {
				varDef.setInitialValue$LExpression$(expr);
			}), null);
			return true;
		}));
		function onFunction(funcDef) {
			var onStatement;
			function onStatement(statement) {
				statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
					$this._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$LMemberFunctionDefinition$(expr, replaceCb, funcDef);
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


_StaticizeOptimizeCommand.prototype._staticizeMethod$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var staticFuncDef;
	var classDef;
	var newName;
	var thisArg;
	staticFuncDef = funcDef.clone$();
	classDef = staticFuncDef.getClassDef$();
	newName = this._newStaticFunctionName$LClassDefinition$SALType$B(classDef, funcDef.name$(), [ new ObjectType(classDef) ].concat(funcDef.getType$().getArgumentTypes$()), true);
	this.getStash$LStashable$(funcDef).altName = newName;
	staticFuncDef._nameToken = new Token$2(newName, true);
	staticFuncDef.setFlags$N(funcDef.flags$() & ~ ClassDefinition.IS_EXPORT | ClassDefinition.IS_STATIC);
	thisArg = new ArgumentDeclaration(new Token$2("$this", false), new ObjectType(classDef));
	staticFuncDef.getArguments$().unshift(thisArg);
	staticFuncDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression(thisArg.getName$(), thisArg));
			} else if (expr instanceof FunctionExpression) {
				return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
			}
			return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		})) && statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
};


_StaticizeOptimizeCommand.prototype._newStaticFunctionName$LClassDefinition$SALType$B = function (classDef, baseName, argTypes, isStatic) {
	var index;
	var newName;
	index = 0;
	newName = baseName;
	while (Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, newName, argTypes, isStatic) != null) {
		newName = Util$format$SAS("%1_%2", [ baseName, index + "" ]);
		++index;
	}
	return newName;
};


_StaticizeOptimizeCommand.prototype._rewriteMethodCallsToStatic$LExpression$F$LExpression$V$LMemberFunctionDefinition$ = function (expr, replaceCb, rewritingFuncDef) {
	var $this = this;
	var onExpr;
	function onExpr(expr, replaceCb) {
		var calleeExpr;
		var propertyExpr;
		var receiverType;
		var funcDef;
		var newName;
		var superExpr;
		var classDef;
		var thisVar;
		var thisArg;
		if (expr instanceof CallExpression) {
			calleeExpr = expr.getExpr$();
			if (calleeExpr instanceof PropertyExpression && ! calleeExpr.getExpr$().isClassSpecifier$() && ! calleeExpr.getType$().isAssignable$()) {
				propertyExpr = calleeExpr;
				receiverType = propertyExpr.getExpr$().getType$().resolveIfNullable$();
				if ((receiverType.getClassDef$().flags$() & (ClassDefinition.IS_INTERFACE | ClassDefinition.IS_MIXIN)) === 0) {
					funcDef = $this._findFunctionInClassTree$LClassDefinition$SALType$B(receiverType.getClassDef$(), propertyExpr.getIdentifierToken$().getValue$(), propertyExpr.getType$().getArgumentTypes$(), false);
					if (funcDef != null && (newName = $this.getStash$LStashable$(funcDef).altName) != null) {
						onExpr(propertyExpr.getExpr$(), (function (expr) {
							propertyExpr.setExpr$LExpression$(expr);
						}));
						Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
						replaceCb(new CallExpression(expr.getToken$(), new PropertyExpression$0(propertyExpr.getToken$(), new ClassExpression(new Token$2(funcDef.getClassDef$().className$(), true), new ObjectType(funcDef.getClassDef$())), new Token$2(newName, true), propertyExpr.getTypeArguments$(), new StaticFunctionType(null, funcDef.getType$().getReturnType$(), [ new ObjectType(funcDef.getClassDef$()) ].concat(funcDef.getType$().getArgumentTypes$()), false)), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
						return true;
					}
				}
			}
		} else if (expr instanceof SuperExpression) {
			superExpr = expr;
			classDef = superExpr.getFunctionType$().getObjectType$().getClassDef$();
			funcDef = $this._findFunctionInClassTree$LClassDefinition$SALType$B(classDef, superExpr.getName$().getValue$(), superExpr.getFunctionType$().getArgumentTypes$(), false);
			if (funcDef != null && (newName = $this.getStash$LStashable$(funcDef).altName) != null) {
				Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, superExpr.getArguments$());
				if ((rewritingFuncDef.flags$() & ClassDefinition.IS_STATIC) !== 0) {
					thisArg = rewritingFuncDef.getArguments$()[0];
					thisVar = new LocalExpression(thisArg.getName$(), thisArg);
				} else {
					thisVar = new ThisExpression(new Token$2("this", false), funcDef.getClassDef$());
				}
				replaceCb(new CallExpression(expr.getToken$(), new PropertyExpression$0(superExpr.getToken$(), new ClassExpression(new Token$2(funcDef.getClassDef$().className$(), true), new ObjectType(funcDef.getClassDef$())), new Token$2(newName, true), [  ], new StaticFunctionType(null, funcDef.getType$().getReturnType$(), [ new ObjectType(funcDef.getClassDef$()) ].concat(funcDef.getType$().getArgumentTypes$()), false)), [ thisVar ].concat(superExpr.getArguments$())));
				return true;
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	}
	onExpr(expr, replaceCb);
};


_StaticizeOptimizeCommand.prototype._findFunctionInClassTree$LClassDefinition$SALType$B = function (classDef, name, argTypes, isStatic) {
	var funcDef;
	while (classDef.className$() !== "Object") {
		if ((funcDef = Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic)) != null) {
			return funcDef;
		}
		classDef = classDef.extendType$().getClassDef$();
	}
	return Util$findFunctionInClass$LClassDefinition$SALType$B(classDef, name, argTypes, isStatic);
};


function _StructuredStashAccessor$x2E$x3CStash$x3E$2() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$2], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$2.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$2 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$2.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _UnclassifyOptimizationCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$2.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _UnclassifyOptimizationCommand() {
	_OptimizeCommand.call(this, _UnclassifyOptimizationCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$2.call(this);
};

$__jsx_extend([_UnclassifyOptimizationCommand], _OptimizeCommand);
$__jsx_merge_interface(_UnclassifyOptimizationCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$2);

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
				throw new Error("[src/optimizer.jsx:1420:28] assertion failure\n                assert expr != null;\n                            ^^\n");
			}
			if (expr instanceof InstanceofExpression) {
				foundClassDefIndex = candidates.indexOf(expr.getExpectedType$().getClassDef$());
				if (foundClassDefIndex !== - 1) {
					candidates.splice(foundClassDefIndex, 1);
					if (candidates.length === 0) {
						return false;
					}
				}
			} else if (expr instanceof AsExpression && expr.getType$() instanceof ObjectType) {
				foundClassDefIndex = candidates.indexOf(expr.getType$().getClassDef$());
				if (foundClassDefIndex !== - 1) {
					candidates.splice(foundClassDefIndex, 1);
					if (candidates.length === 0) {
						return false;
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
	for (candidateIndex = candidates.length - 1; candidateIndex >= 0; --candidateIndex) {
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
	expectedArgIndex = 0;
	statements = funcDef.getStatements$();
	if (statements.length !== propertyNames.length) {
		return null;
	}
	for (statementIndex = 0; statementIndex < statements.length; ++statementIndex) {
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
		function onRHSExpr(expr) {
			var argIndex;
			if (_Util$0$exprIsAssignment$LExpression$(expr)) {
				return false;
			} else if (expr instanceof FunctionExpression) {
				return false;
			} else if (expr instanceof ThisExpression) {
				return false;
			} else if (expr instanceof LocalExpression) {
				argIndex = funcDef.getArguments$().map((function (i) {
					return i;
				})).indexOf(expr.getLocal$());
				if (argIndex === - 1) {
					throw new Error("logic flaw; could not find argument: " + expr.getLocal$().getName$().getValue$());
				}
				if (expectedArgIndex !== argIndex) {
					return false;
				}
				++expectedArgIndex;
			}
			return expr.forEachExpression$F$LExpression$B$(onRHSExpr);
		}
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
		for (i = propertyIndex + 1; i < propertyNames.length; ++i) {
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
					for (i in args) { i |= 0;
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
	thisArg = new ArgumentDeclaration(new Token$2("$this", false), new ObjectType(funcDef.getClassDef$()));
	funcDef.getArguments$().unshift(thisArg);
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		if (statement instanceof FunctionStatement) {
			statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
		}
		return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			if (expr instanceof ThisExpression) {
				replaceCb(new LocalExpression(thisArg.getName$(), thisArg));
			} else if (expr instanceof FunctionExpression) {
				return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
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
			if (calleeExpr instanceof PropertyExpression && ! calleeExpr.getExpr$().isClassSpecifier$() && ! calleeExpr.getType$().isAssignable$() && ! (calleeExpr.getIdentifierToken$().getValue$() === "toString" && expr.getArguments$().length === 0)) {
				propertyExpr = calleeExpr;
				receiverType = propertyExpr.getExpr$().getType$().resolveIfNullable$();
				receiverClassDef = receiverType.getClassDef$();
				if (unclassifyingClassDefs.indexOf(receiverClassDef) !== - 1) {
					onExpr(propertyExpr.getExpr$(), (function (expr) {
						propertyExpr.setExpr$LExpression$(expr);
					}));
					Util$forEachExpression$F$LExpression$F$LExpression$V$B$ALExpression$(onExpr, expr.getArguments$());
					funcType = propertyExpr.getType$();
					replaceCb(new CallExpression(expr.getToken$(), new PropertyExpression$0(propertyExpr.getToken$(), new ClassExpression(new Token$2(receiverClassDef.className$(), true), receiverType), propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), new StaticFunctionType(null, funcType.getReturnType$(), [ receiverType ].concat(funcType.getArgumentTypes$()), false)), [ propertyExpr.getExpr$() ].concat(expr.getArguments$())));
					return true;
				}
			}
		}
		return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
	});
	onExpr(expr, replaceCb);
};


function _StructuredStashAccessor$x2E$x3CStash$x3E$3() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$3], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$3.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$3 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$3.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _FoldConstantCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$3.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _FoldConstantCommand() {
	_FunctionOptimizeCommand.call(this, _FoldConstantCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$3.call(this);
};

$__jsx_extend([_FoldConstantCommand], _FunctionOptimizeCommand);
$__jsx_merge_interface(_FoldConstantCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$3);

_FoldConstantCommand.prototype.performOptimization$ = function () {
	var $this = this;
	_FunctionOptimizeCommand.prototype.performOptimization$.call(this);
	this.getCompiler$().forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (classDef instanceof TemplateClassDefinition || (classDef.flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			return true;
		}
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if ((varDef.flags$() & ClassDefinition.IS_STATIC) !== 0 && varDef.getInitialValue$() != null) {
				$this.log$S("starting optimization of " + varDef.getNotation$());
				$this._optimizeExpression$LExpression$F$LExpression$V$(varDef.getInitialValue$(), (function (expr) {
					varDef.setInitialValue$LExpression$(expr);
				}));
				$this.log$S("finished optimization of " + varDef.getNotation$());
			}
			return true;
		}));
		return true;
	}));
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
	var propertyExpr;
	var holderType;
	var member;
	var foldedExpr;
	var calculateCb;
	var baseExpr;
	var firstExpr;
	var secondExpr;
	var innerExpr;
	var condition;
	var op;
	var conditionalExpr;
	var condExpr;
	var ifTrueExpr;
	var ifFalseExpr;
	var callExpr;
	var allArgsAreConstants;
	expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
		return $this._optimizeExpression$LExpression$F$LExpression$V$(expr, replaceCb);
	}));
	if (expr instanceof PropertyExpression) {
		propertyExpr = expr;
		holderType = propertyExpr.getHolderType$();
		if (propertyExpr.getExpr$().isClassSpecifier$()) {
			member = null;
			holderType.getClassDef$().forEachMemberVariable$F$LMemberVariableDefinition$B$((function (m) {
				if (m.name$() === propertyExpr.getIdentifierToken$().getValue$()) {
					member = m;
				}
				return member == null;
			}));
			if (member != null && (member.flags$() & ClassDefinition.IS_CONST) !== 0) {
				this._foldStaticConst$LMemberVariableDefinition$(member);
				foldedExpr = this._toFoldedExpr$LExpression$LType$(member.getInitialValue$(), member.getType$());
				if (foldedExpr != null) {
					foldedExpr = this._toFoldedExpr$LExpression$LType$(foldedExpr, propertyExpr.getType$());
					if (foldedExpr != null && ! (foldedExpr instanceof StringLiteralExpression && foldedExpr.getDecoded$().length > _FoldConstantCommand.LONG_STRING_LITERAL)) {
						this.log$S("folding property " + member.getNotation$() + " at " + propertyExpr.getToken$().getFilename$() + ":" + (propertyExpr.getToken$().getLineNumber$() + ""));
						replaceCb(foldedExpr);
					}
				}
			}
		} else if (propertyExpr.getExpr$() instanceof StringLiteralExpression) {
			if (propertyExpr.getIdentifierToken$().getValue$() === "length") {
				replaceCb(new NumberLiteralExpression(new Token$3(propertyExpr.getExpr$().getDecoded$().length + "")));
			}
		}
	} else if (expr instanceof SignExpression) {
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
		baseExpr = expr.getExpr$();
		if (baseExpr instanceof IntegerLiteralExpression) {
			this.log$S("folding operator (number) " + expr.getToken$().getNotation$());
			replaceCb(new IntegerLiteralExpression(new Token$3(calculateCb(_Util$0$decodeNumericLiteral$LExpression$(baseExpr)) + "")));
		} else if (baseExpr instanceof NumberLiteralExpression) {
			this.log$S("folding operator (number) " + expr.getToken$().getNotation$());
			replaceCb(new NumberLiteralExpression(new Token$3(calculateCb(_Util$0$decodeNumericLiteral$LExpression$(baseExpr)) + "")));
		}
	} else if (expr instanceof BitwiseNotExpression) {
		baseExpr = expr.getExpr$();
		if (this._isIntegerOrNumberLiteralExpression$LExpression$(baseExpr)) {
			this.log$S("folding operator " + expr.getToken$().getNotation$());
			replaceCb(new IntegerLiteralExpression(new Token$3(~ _Util$0$decodeNumericLiteral$LExpression$(baseExpr) + "")));
		}
	} else if (expr instanceof AdditiveExpression) {
		firstExpr = expr.getFirstExpr$();
		secondExpr = expr.getSecondExpr$();
		if (this._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$(expr, replaceCb)) {
		} else if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
			replaceCb(new StringLiteralExpression(new Token$2(Util$encodeStringLiteral$S(firstExpr.getDecoded$() + secondExpr.getDecoded$()), false)));
		}
	} else if (expr instanceof EqualityExpression) {
		this._foldEqualityExpression$LEqualityExpression$F$LExpression$V$(expr, replaceCb);
	} else if (expr instanceof BinaryNumberExpression || expr instanceof ShiftExpression) {
		this._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$(expr, replaceCb);
	} else if (expr instanceof AsExpression) {
		this._foldAsExpression$LAsExpression$F$LExpression$V$(expr, replaceCb);
	} else if (expr instanceof LogicalNotExpression) {
		innerExpr = expr.getExpr$();
		if ((condition = _Util$0$conditionIsConstant$LExpression$(innerExpr)) != null) {
			replaceCb(new BooleanLiteralExpression(new Token$2((condition ? "false" : "true"), false)));
		}
	} else if (expr instanceof LogicalExpression) {
		firstExpr = expr.getFirstExpr$();
		secondExpr = expr.getSecondExpr$();
		if ((condition = _Util$0$conditionIsConstant$LExpression$(firstExpr)) != null) {
			op = expr.getToken$().getValue$();
			if (op === "||" && condition) {
				replaceCb(new AsExpression(firstExpr.getToken$(), firstExpr, Type.booleanType));
			} else if (op === "||" && ! condition) {
				replaceCb(new AsExpression(secondExpr.getToken$(), secondExpr, Type.booleanType));
			} else if (op === "&&" && condition) {
				replaceCb(new AsExpression(secondExpr.getToken$(), secondExpr, Type.booleanType));
			} else if (op === "&&" && ! condition) {
				replaceCb(new AsExpression(firstExpr.getToken$(), firstExpr, Type.booleanType));
			} else {
				throw new Error("logic flaw");
			}
		}
	} else if (expr instanceof ConditionalExpression) {
		conditionalExpr = expr;
		condExpr = conditionalExpr.getCondExpr$();
		if ((condition = _Util$0$conditionIsConstant$LExpression$(condExpr)) != null) {
			ifTrueExpr = conditionalExpr.getIfTrueExpr$() || condExpr;
			ifFalseExpr = conditionalExpr.getIfFalseExpr$();
			replaceCb(condition ? ifTrueExpr : ifFalseExpr);
		}
	} else if (expr instanceof CallExpression) {
		callExpr = expr;
		if (callExpr.getExpr$() instanceof PropertyExpression) {
			allArgsAreConstants = true;
			callExpr.getArguments$().forEach((function (expr) {
				if (! (expr instanceof IntegerLiteralExpression || expr instanceof NumberLiteralExpression || expr instanceof BooleanLiteralExpression || expr instanceof StringLiteralExpression)) {
					allArgsAreConstants = false;
				}
			}));
			if (allArgsAreConstants) {
				this._foldCallExpression$LCallExpression$F$LExpression$V$(callExpr, replaceCb);
			}
		}
	}
	return true;
};


_FoldConstantCommand.prototype._foldCallExpression$LCallExpression$F$LExpression$V$ = function (callExpr, replaceCb) {
	var $this = this;
	var propertyExpr;
	var holderType;
	var argExprs;
	var member;
	var s;
	var recvStr;
	propertyExpr = callExpr.getExpr$();
	holderType = propertyExpr.getHolderType$();
	if ((holderType.getClassDef$().flags$() & ClassDefinition.IS_NATIVE) === 0) {
		return;
	}
	argExprs = callExpr.getArguments$();
	member = null;
	holderType.getClassDef$().forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (m) {
		if (m.name$() === propertyExpr.getIdentifierToken$().getValue$()) {
			member = m;
		}
		return member == null;
	}));
	if (member != null && (member.flags$() & ClassDefinition.IS_PURE) === 0) {
		return;
	}
	if (propertyExpr.getExpr$().isClassSpecifier$()) {
		if (holderType.getClassDef$().classFullName$() === "Math") {
			switch (propertyExpr.getIdentifierToken$().getValue$()) {
			case "sqrt":
				this.log$S("folding " + member.getNotation$());
				replaceCb(new NumberLiteralExpression(new Token$3(Math.sqrt(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0])) + "")));
				break;
			case "log":
				this.log$S("folding " + member.getNotation$());
				replaceCb(new NumberLiteralExpression(new Token$3(Math.log(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0])) + "")));
				break;
			case "pow":
				this.log$S("folding " + member.getNotation$());
				replaceCb(new NumberLiteralExpression(new Token$3(Math.pow(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0]), _Util$0$decodeNumericLiteral$LExpression$(argExprs[1])) + "")));
				break;
			case "sin":
				this.log$S("folding " + member.getNotation$());
				replaceCb(new NumberLiteralExpression(new Token$3(Math.sin(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0])) + "")));
				break;
			case "cos":
				this.log$S("folding " + member.getNotation$());
				replaceCb(new NumberLiteralExpression(new Token$3(Math.cos(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0])) + "")));
				break;
			}
		}
		if (holderType.getClassDef$().classFullName$() === "String") {
			switch (propertyExpr.getIdentifierToken$().getValue$()) {
			case "fromCharCode":
				this.log$S("folding " + member.getNotation$());
				s = "";
				argExprs.forEach((function (arg) {
					s += String.fromCharCode(_Util$0$decodeNumericLiteral$LExpression$(arg));
				}));
				replaceCb(new StringLiteralExpression(new Token$3(Util$encodeStringLiteral$S(s))));
				break;
			}
		}
	} else if (propertyExpr.getExpr$() instanceof StringLiteralExpression) {
		switch (propertyExpr.getIdentifierToken$().getValue$()) {
		case "charCodeAt":
			this.log$S("folding " + member.getNotation$());
			recvStr = propertyExpr.getExpr$().getDecoded$();
			replaceCb(new NumberLiteralExpression(new Token$3(recvStr.charCodeAt(_Util$0$decodeNumericLiteral$LExpression$(argExprs[0])) + "")));
			break;
		}
	}
};


_FoldConstantCommand.prototype._foldEqualityExpression$LEqualityExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	var firstExpr;
	var secondExpr;
	var isEqual;
	var isNullVsPrimitiveLiteral;
	var result;
	firstExpr = expr.getFirstExpr$();
	secondExpr = expr.getSecondExpr$();
	isEqual = null;
	function isNullVsPrimitiveLiteral(x, y) {
		return x instanceof NullExpression && y instanceof PrimitiveLiteralExpression;
	}
	if (firstExpr instanceof NullExpression && secondExpr instanceof NullExpression) {
		isEqual = true;
	} else if (isNullVsPrimitiveLiteral(firstExpr, secondExpr) || isNullVsPrimitiveLiteral(secondExpr, firstExpr)) {
		isEqual = false;
	} else if (firstExpr instanceof StringLiteralExpression && secondExpr instanceof StringLiteralExpression) {
		isEqual = firstExpr.getDecoded$() === secondExpr.getDecoded$();
	} else if (this._isIntegerOrNumberLiteralExpression$LExpression$(firstExpr) && this._isIntegerOrNumberLiteralExpression$LExpression$(secondExpr)) {
		isEqual = _Util$0$decodeNumericLiteral$LExpression$(firstExpr) === _Util$0$decodeNumericLiteral$LExpression$(secondExpr);
	}
	if (isEqual != null) {
		result = (expr.getToken$().getValue$() === "==" ? isEqual : ! isEqual);
		replaceCb(new BooleanLiteralExpression(new Token$2((result ? "true" : "false"), true)));
	}
};


_FoldConstantCommand.prototype._foldNumericBinaryExpression$LBinaryExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	var exprIsZero;
	var exprIsOne;
	if (this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getFirstExpr$()) && this._isIntegerOrNumberLiteralExpression$LExpression$(expr.getSecondExpr$())) {
		return this._foldNumericBinaryExpressionOfConstants$LBinaryExpression$F$LExpression$V$(expr, replaceCb);
	}
	function exprIsZero(expr) {
		return expr instanceof NumberLiteralExpression && expr.getDecoded$() === 0;
	}
	function exprIsOne(expr) {
		return expr instanceof NumberLiteralExpression && expr.getDecoded$() === 1;
	}
	switch (expr.getToken$().getValue$()) {
	case "+":
		if (exprIsZero(expr.getFirstExpr$())) {
			replaceCb(expr.getSecondExpr$());
			return true;
		} else if (exprIsZero(expr.getSecondExpr$())) {
			replaceCb(expr.getFirstExpr$());
			return true;
		}
		break;
	case "-":
		if (exprIsZero(expr.getFirstExpr$())) {
			replaceCb(new SignExpression(new Token$2("-", false), expr.getSecondExpr$()));
			return true;
		} else if (exprIsZero(expr.getSecondExpr$())) {
			replaceCb(expr.getFirstExpr$());
			return true;
		}
		break;
	case "*":
		if (exprIsOne(expr.getFirstExpr$())) {
			replaceCb(expr.getSecondExpr$());
			return true;
		} else if (exprIsOne(expr.getSecondExpr$())) {
			replaceCb(expr.getFirstExpr$());
			return true;
		}
		break;
	case "/":
		if (exprIsOne(expr.getSecondExpr$())) {
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
	case "+":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$III$F$NNN$(expr, replaceCb, (function (x, y) {
			return ((x + y) | 0);
		}), (function (x, y) {
			return x + y;
		}));
		break;
	case "-":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$III$F$NNN$(expr, replaceCb, (function (x, y) {
			return ((x - y) | 0);
		}), (function (x, y) {
			return x - y;
		}));
		break;
	case "*":
		this._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$III$F$NNN$(expr, replaceCb, (function (x, y) {
			return $__jsx_imul(x, y);
		}), (function (x, y) {
			return x * y;
		}));
		break;
	case "/":
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x / y;
		}));
		break;
	case "%":
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, (function (x, y) {
			return x % y;
		}));
		break;
	case ">>>":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x >>> y;
		}));
		break;
	case ">>":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x >> y;
		}));
		break;
	case "<<":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x << y;
		}));
		break;
	case "&":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x & y;
		}));
		break;
	case "|":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x | y;
		}));
		break;
	case "^":
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, (function (x, y) {
			return x ^ y;
		}));
		break;
	case "<":
		this._foldNumericBinaryExpressionAsBoolean$LBinaryExpression$F$LExpression$V$F$NNB$(expr, replaceCb, (function (x, y) {
			return x < y;
		}));
		break;
	case "<=":
		this._foldNumericBinaryExpressionAsBoolean$LBinaryExpression$F$LExpression$V$F$NNB$(expr, replaceCb, (function (x, y) {
			return x <= y;
		}));
		break;
	case ">":
		this._foldNumericBinaryExpressionAsBoolean$LBinaryExpression$F$LExpression$V$F$NNB$(expr, replaceCb, (function (x, y) {
			return x > y;
		}));
		break;
	case ">=":
		this._foldNumericBinaryExpressionAsBoolean$LBinaryExpression$F$LExpression$V$F$NNB$(expr, replaceCb, (function (x, y) {
			return x >= y;
		}));
		break;
	default:
		return false;
	}
	return true;
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumeric$LBinaryExpression$F$LExpression$V$F$III$F$NNN$ = function (expr, replaceCb, calcCbInt, calcCbNumber) {
	if (expr.getFirstExpr$() instanceof IntegerLiteralExpression && expr.getSecondExpr$() instanceof IntegerLiteralExpression) {
		this._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$(expr, replaceCb, calcCbInt);
	} else {
		this._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$(expr, replaceCb, calcCbNumber);
	}
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsInteger$LBinaryExpression$F$LExpression$V$F$III$ = function (expr, replaceCb, calcCb) {
	var value;
	value = calcCb((_Util$0$decodeNumericLiteral$LExpression$(expr.getFirstExpr$()) | 0), (_Util$0$decodeNumericLiteral$LExpression$(expr.getSecondExpr$()) | 0));
	this.log$S("folding operator " + expr.getToken$().getNotation$() + " to int: " + (value + ""));
	if (value !== (value | 0)) {
		throw new Error("value is not an integer");
	}
	replaceCb(new IntegerLiteralExpression(new Token$3(value + "")));
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsNumber$LBinaryExpression$F$LExpression$V$F$NNN$ = function (expr, replaceCb, calcCb) {
	var value;
	value = calcCb(_Util$0$decodeNumericLiteral$LExpression$(expr.getFirstExpr$()), _Util$0$decodeNumericLiteral$LExpression$(expr.getSecondExpr$()));
	this.log$S("folding operator " + expr.getToken$().getNotation$() + " to number: " + (value + ""));
	replaceCb(new NumberLiteralExpression(new Token$3(value + "")));
};


_FoldConstantCommand.prototype._foldNumericBinaryExpressionAsBoolean$LBinaryExpression$F$LExpression$V$F$NNB$ = function (expr, replaceCb, calcCb) {
	var value;
	value = calcCb(_Util$0$decodeNumericLiteral$LExpression$(expr.getFirstExpr$()), _Util$0$decodeNumericLiteral$LExpression$(expr.getSecondExpr$()));
	this.log$S("folding operator " + expr.getToken$().getNotation$() + " to boolean: " + (value + ""));
	replaceCb(new BooleanLiteralExpression(new Token$3(value + "")));
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
	} else if (expr instanceof BooleanLiteralExpression) {
		return expr;
	} else if (expr instanceof IntegerLiteralExpression) {
		return expr;
	} else if (expr instanceof NumberLiteralExpression) {
		if (type.resolveIfNullable$().equals$LType$(Type.integerType)) {
			return new IntegerLiteralExpression(new Token$3((expr.getDecoded$() | 0) + ""));
		}
		return expr;
	} else if (expr instanceof StringLiteralExpression) {
		return expr;
	}
	return null;
};


_FoldConstantCommand.prototype._foldAsExpression$LAsExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var baseExpr;
	baseExpr = expr.getExpr$();
	if (expr.getType$().equals$LType$(Type.stringType)) {
		if (baseExpr.getType$().equals$LType$(Type.stringType)) {
			this.log$S("folding type cast: string as string");
			replaceCb(baseExpr);
		} else if (baseExpr instanceof PrimitiveLiteralExpression) {
			this.log$S("folding type cast: primitive literal as string");
			replaceCb(new StringLiteralExpression(new Token$2(Util$encodeStringLiteral$S(baseExpr.toNormalizedString$()), false)));
		}
	} else if (expr.getType$().equals$LType$(Type.numberType)) {
		if (baseExpr.getType$().equals$LType$(Type.numberType)) {
			this.log$S("folding type cast: number as number");
			replaceCb(baseExpr);
		} else if (baseExpr instanceof StringLiteralExpression) {
			this.log$S("folding type cast: string literal as number");
			replaceCb(new NumberLiteralExpression(new Token$2(+baseExpr.getDecoded$() + "", false)));
		} else if (baseExpr instanceof IntegerLiteralExpression) {
			this.log$S("folding type cast: int literal as number");
			replaceCb(new NumberLiteralExpression(new Token$2(+baseExpr.getDecoded$() + "", false)));
		}
	} else if (expr.getType$().equals$LType$(Type.integerType)) {
		if (baseExpr.getType$().equals$LType$(Type.integerType)) {
			this.log$S("folding type cast: int as int");
			replaceCb(baseExpr);
		} else if (baseExpr instanceof StringLiteralExpression) {
			this.log$S("folding type cast: string literal as int");
			replaceCb(new IntegerLiteralExpression(new Token$2((baseExpr.getDecoded$() | 0) + "", false)));
		} else if (baseExpr instanceof NumberLiteralExpression) {
			this.log$S("folding type cast: number literal as int");
			replaceCb(new IntegerLiteralExpression(new Token$2((baseExpr.getDecoded$() | 0) + "", false)));
		}
	} else if (expr.getType$().equals$LType$(Type.booleanType)) {
		if (baseExpr.getType$().equals$LType$(Type.booleanType)) {
			this.log$S("folding type cast: boolean as boolean");
			replaceCb(baseExpr);
		} else if (baseExpr instanceof StringLiteralExpression) {
			this.log$S("folding type cast: string literal as boolean");
			replaceCb(new BooleanLiteralExpression(new Token$2(!! baseExpr.getDecoded$() + "", false)));
		} else if (baseExpr instanceof NumberLiteralExpression) {
			this.log$S("folding type cast: number literal as boolean");
			replaceCb(new BooleanLiteralExpression(new Token$2((baseExpr.getDecoded$() ? "true" : "false"), false)));
		} else if (baseExpr instanceof IntegerLiteralExpression) {
			this.log$S("folding type cast: integer literal as boolean");
			replaceCb(new BooleanLiteralExpression(new Token$2((baseExpr.getDecoded$() ? "true" : "false"), false)));
		}
	}
};


function _StructuredStashAccessor$x2E$x3CStash$x3E$4() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$4], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$4.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$4 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$4.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _InlineOptimizeCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$4.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _InlineOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _InlineOptimizeCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$4.call(this);
};

$__jsx_extend([_InlineOptimizeCommand], _FunctionOptimizeCommand);
$__jsx_merge_interface(_InlineOptimizeCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$4);

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
	return true;
};


_InlineOptimizeCommand.prototype._handleStatements$LMemberFunctionDefinition$ALStatement$ = function (funcDef, statements) {
	var altered;
	var i;
	var left;
	altered = false;
	for (i = 0; i < statements.length; ++i) {
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
	if (statement instanceof ConstructorInvocationStatement) {
		callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(statement);
		this.log$S("optimizing calling constructor " + callingFuncDef.getNotation$());
		this.optimizeFunction$LMemberFunctionDefinition$(callingFuncDef);
		if (this._functionIsInlineable$LMemberFunctionDefinition$(callingFuncDef) && this._argsAreInlineable$LMemberFunctionDefinition$ALExpression$(callingFuncDef, statement.getArguments$())) {
			statements.splice(stmtIndex, 1);
			this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, callingFuncDef, statement.getArguments$().concat([ new ThisExpression(null, funcDef.getClassDef$()) ]));
		}
	} else if (statement instanceof ExpressionStatement) {
		if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
			statements.splice(stmtIndex, 1);
		}))) {
			altered = true;
		}
	} else if (statement instanceof ReturnStatement) {
		if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
			statements.splice(stmtIndex, 1);
			if (statements[stmtIndex - 1] instanceof ReturnStatement) {
				statements[stmtIndex - 1] = new ReturnStatement(statement.getToken$(), statements[stmtIndex - 1].getExpr$());
			} else if (statements[stmtIndex - 1] instanceof ExpressionStatement) {
				statements[stmtIndex - 1] = new ReturnStatement(statement.getToken$(), statements[stmtIndex - 1].getExpr$());
			}
		}))) {
			altered = true;
		}
	} else if (statement instanceof IfStatement) {
		if (this._expandStatementExpression$LMemberFunctionDefinition$ALStatement$NLExpression$F$NV$(funcDef, statements, stmtIndex, statement.getExpr$(), (function (stmtIndex) {
			statement.setExpr$LExpression$(statements[stmtIndex - 1] instanceof ReturnStatement ? statements[stmtIndex - 1].getExpr$() : statements[stmtIndex - 1].getExpr$());
			statements.splice(stmtIndex - 1, 1);
		}))) {
			altered = true;
		}
		if (this._handleSubStatements$LMemberFunctionDefinition$LStatement$(funcDef, statement)) {
			altered = true;
		}
	} else if (this._handleSubStatements$LMemberFunctionDefinition$LStatement$(funcDef, statement)) {
		altered = true;
	}
	if (! altered) {
		statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			var callExpr;
			var argsAndThis;
			expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
			if (expr instanceof CallExpression) {
				callExpr = expr;
				argsAndThis = $this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$(callExpr);
				if (argsAndThis != null) {
					if ($this._expandCallAsExpression$LMemberFunctionDefinition$LExpression$ALExpression$F$LExpression$V$(funcDef, expr, argsAndThis, replaceCb)) {
						altered = true;
					}
				}
			}
			return true;
		}));
	}
	return altered;
};


_InlineOptimizeCommand.prototype._countNumberOfArgsUsed$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var formalArgs;
	var map;
	var updateCountOfLocal;
	formalArgs = new TypedMap$x2E$x3CLocalVariable$x2Cboolean$x3E();
	map = {};
	funcDef.getArguments$().forEach((function (formalArg) {
		formalArgs.set$LLocalVariable$B(formalArg, true);
		map[formalArg.getName$().getValue$()] = 0;
	}));
	map["this"] = 0;
	function updateCountOfLocal(local, delta) {
		if (formalArgs.has$LLocalVariable$(local)) {
			map[local.getName$().getValue$()] += delta;
		}
	}
	funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		statement.forEachStatement$F$LStatement$B$(onStatement);
		statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			var assignExpr;
			var incrExpr;
			expr.forEachExpression$F$LExpression$B$(onExpr);
			if (expr instanceof LocalExpression) {
				updateCountOfLocal(expr.getLocal$(), 1);
			} else if (expr instanceof AssignmentExpression || expr instanceof FusedAssignmentExpression) {
				assignExpr = expr;
				if (assignExpr.getFirstExpr$() instanceof LocalExpression) {
					updateCountOfLocal(assignExpr.getFirstExpr$().getLocal$(), - Infinity);
				}
			} else if (expr instanceof IncrementExpression) {
				incrExpr = expr;
				if (incrExpr.getExpr$() instanceof LocalExpression) {
					updateCountOfLocal(incrExpr.getExpr$().getLocal$(), - Infinity);
				}
			} else if (expr instanceof ThisExpression) {
				map["this"]++;
			}
			return true;
		}));
		return true;
	}));
	return map;
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
		args = this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$(expr);
		if (args != null) {
			stmtIndex = this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr), args);
			cb(stmtIndex);
			return true;
		}
	} else if (expr instanceof AssignmentExpression && ! expr.getFirstExpr$().hasSideEffects$() && expr.getSecondExpr$() instanceof CallExpression) {
		args = this._getArgsAndThisIfCallExprIsInlineable$LCallExpression$(expr.getSecondExpr$());
		if (args != null) {
			stmtIndex = this._expandCallingFunction$LMemberFunctionDefinition$ALStatement$NLMemberFunctionDefinition$ALExpression$(funcDef, statements, stmtIndex, _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr.getSecondExpr$()), args);
			stmt = statements[stmtIndex - 1];
			if (stmt instanceof ReturnStatement) {
				rhsExpr = stmt.getExpr$();
			} else if (stmt instanceof ExpressionStatement) {
				rhsExpr = stmt.getExpr$();
			} else {
				return false;
			}
			lastExpr = new AssignmentExpression(expr.getToken$(), expr.getFirstExpr$(), rhsExpr);
			statements[stmtIndex - 1] = new ExpressionStatement(lastExpr);
			cb(stmtIndex);
			return true;
		}
	}
	return false;
};


_InlineOptimizeCommand.prototype._getArgsAndThisIfCallExprIsInlineable$LCallExpression$ = function (callExpr) {
	var callingFuncDef;
	var receiverExpr;
	var calleeExpr;
	var argsAndThis;
	callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(callExpr);
	if (callingFuncDef == null) {
		return null;
	}
	this.log$S("optimizing calling function " + callingFuncDef.getNotation$());
	this.optimizeFunction$LMemberFunctionDefinition$(callingFuncDef);
	receiverExpr = null;
	if ((callingFuncDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		calleeExpr = callExpr.getExpr$();
		if (! (calleeExpr instanceof PropertyExpression)) {
			throw new Error("unexpected type of expression");
		}
		receiverExpr = calleeExpr.getExpr$();
	}
	if (! this._functionIsInlineable$LMemberFunctionDefinition$(callingFuncDef)) {
		return null;
	}
	if (! this._argsAreInlineable$LMemberFunctionDefinition$ALExpression$(callingFuncDef, callExpr.getArguments$())) {
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


_InlineOptimizeCommand.prototype._argsAreInlineable$LMemberFunctionDefinition$ALExpression$ = function (callingFuncDef, actualArgs) {
	var formalArgsTypes;
	var i;
	formalArgsTypes = callingFuncDef.getArgumentTypes$();
	if (actualArgs.length !== formalArgsTypes.length) {
		throw new Error("logic flow, number of arguments mismatch");
	}
	for (i = 0; i < actualArgs.length; ++i) {
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
			if (++n >= _InlineOptimizeCommand.INLINE_THRESHOLD) {
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
			} else if (! $this._isWorthInline$LMemberFunctionDefinition$(funcDef)) {
				return false;
			}
			return funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
				if (statement instanceof ExpressionStatement || statement instanceof BreakStatement || statement instanceof ContinueStatement || statement instanceof CaseStatement || statement instanceof DefaultStatement || statement instanceof ThrowStatement || statement instanceof DebuggerStatement || statement instanceof LogStatement || statement instanceof AssertStatement || statement instanceof ForStatement || statement instanceof ForInStatement || statement instanceof DoWhileStatement || statement instanceof WhileStatement || statement instanceof IfStatement || statement instanceof SwitchStatement) {
				} else if (statement instanceof ReturnStatement && statement == funcDef.getStatements$()[funcDef.getStatements$().length - 1]) {
				} else {
					return false;
				}
				if (! statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
					if (expr instanceof FunctionExpression) {
						return false;
					} else if (expr instanceof SuperExpression) {
						return false;
					} else if (expr instanceof CallExpression && _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr) == funcDef) {
						return false;
					} else if (expr instanceof LocalExpression) {
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
	var returnStatement;
	var onExpr;
	this.log$S("expanding " + calleeFuncDef.getNotation$());
	argsAndThisAndLocals = argsAndThis.concat([  ]);
	this._createVarsAndInit$LMemberFunctionDefinition$LMemberFunctionDefinition$ALExpression$F$LExpression$V$(callerFuncDef, calleeFuncDef, argsAndThisAndLocals, (function (expr) {
		statements.splice(stmtIndex++, 0, new ExpressionStatement(expr));
	}));
	calleeStatements = calleeFuncDef.getStatements$();
	for (i = 0; i < calleeStatements.length; ++i) {
		if (calleeStatements[i] instanceof ReturnStatement) {
			returnStatement = calleeStatements[i];
			if (returnStatement.getExpr$() == null) {
				continue;
			}
			statement = new ExpressionStatement(returnStatement.getExpr$().clone$());
		} else {
			statement = calleeStatements[i].clone$();
		}
		function onExpr(expr, replaceCb) {
			return $this._rewriteExpression$LExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(expr, null, replaceCb, argsAndThisAndLocals, calleeFuncDef);
		}
		statement.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		statement.forEachStatement$F$LStatement$B$((function onStatement(statement) {
			statement.forEachStatement$F$LStatement$B$(onStatement);
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		}));
		statements.splice(stmtIndex++, 0, statement);
	}
	return stmtIndex;
};


_InlineOptimizeCommand.prototype._expandCallAsExpression$LMemberFunctionDefinition$LExpression$ALExpression$F$LExpression$V$ = function (funcDef, expr, argsAndThisAndLocals, replaceCb) {
	var $this = this;
	var callingFuncDef;
	var statements;
	var returnStatement;
	var i;
	var singleExpr;
	var stmt;
	var setupArgs;
	var clonedExpr;
	callingFuncDef = _DetermineCalleeCommand$getCallingFuncDef$LStashable$(expr);
	statements = callingFuncDef.getStatements$();
	if (statements.length === 0) {
		return false;
	} else if (statements.length !== 1) {
		statements = statements.concat([  ]);
		if (statements[statements.length - 1] instanceof ReturnStatement) {
			returnStatement = statements.pop();
			if (returnStatement.getExpr$() == null) {
				returnStatement = null;
			}
		} else {
			returnStatement = null;
		}
		for (i = 0; i < statements.length; ++i) {
			if (! (statements[i] instanceof ExpressionStatement)) {
				return false;
			}
		}
		singleExpr = statements.reduce((function (prevExpr, stmt) {
			return (prevExpr == null ? stmt.getExpr$() : new CommaExpression(new Token$3(","), prevExpr, stmt.getExpr$()));
		}), null);
		if (returnStatement) {
			singleExpr = new CommaExpression(new Token$3(","), singleExpr, returnStatement.getExpr$());
			statements.splice(0, statements.length, new ReturnStatement(new Token$3("return"), singleExpr));
		} else {
			statements.splice(0, statements.length, new ExpressionStatement(singleExpr));
		}
	}
	stmt = statements[0];
	if (stmt instanceof ExpressionStatement) {
		expr = stmt.getExpr$();
	} else if (stmt instanceof ReturnStatement) {
		expr = stmt.getExpr$();
	} else {
		return false;
	}
	this.log$S("expanding " + callingFuncDef.getNotation$() + " as expression");
	setupArgs = null;
	this._createVarsAndInit$LMemberFunctionDefinition$LMemberFunctionDefinition$ALExpression$F$LExpression$V$(funcDef, callingFuncDef, argsAndThisAndLocals, (function (expr) {
		if (setupArgs == null) {
			setupArgs = expr;
		} else {
			setupArgs = new CommaExpression(new Token$3(","), setupArgs, expr);
		}
	}));
	clonedExpr = expr.clone$();
	this._rewriteExpression$LExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(clonedExpr, null, (function (expr) {
		clonedExpr = expr;
	}), argsAndThisAndLocals, callingFuncDef);
	if (setupArgs != null) {
		clonedExpr = new CommaExpression(new Token$3(","), setupArgs, clonedExpr);
	}
	replaceCb(clonedExpr);
	return true;
};


_InlineOptimizeCommand.prototype._createVarsAndInit$LMemberFunctionDefinition$LMemberFunctionDefinition$ALExpression$F$LExpression$V$ = function (callerFuncDef, calleeFuncDef, argsAndThisAndLocals, initArgExpr) {
	var $this = this;
	var exprIsInlineableFor;
	var createVarWithInit;
	var argUsed;
	var thisIdx;
	var recvExpr;
	var formalArgs;
	var i;
	var numberOfUsed;
	var argExpr;
	function exprIsInlineableFor(expr) {
		var min;
		if (expr instanceof LocalExpression) {
			return - 1;
		} else if (expr instanceof FunctionExpression) {
			return 1;
		} else if (expr instanceof PropertyExpression && expr.getExpr$() instanceof ClassExpression && ! expr.getType$().isAssignable$()) {
			return Infinity;
		} else if (expr instanceof LeafExpression || expr instanceof LogicalNotExpression || expr instanceof BitwiseNotExpression || expr instanceof SignExpression || expr instanceof AdditiveExpression || expr instanceof EqualityExpression || expr instanceof ShiftExpression || expr instanceof MapLiteralExpression || expr instanceof ArrayLiteralExpression) {
			min = 1;
			expr.forEachExpression$F$LExpression$B$((function (expr) {
				min = Math.min(min, exprIsInlineableFor(expr));
				return min > 0;
			}));
			return min;
		} else {
			return - 1;
		}
	}
	function createVarWithInit(funcDef, type, baseName, initExpr) {
		var tempVar;
		tempVar = $this.createVar$LMemberFunctionDefinition$LType$S(funcDef, type, baseName);
		initArgExpr(new AssignmentExpression(new Token$3("="), new LocalExpression(tempVar.getName$(), tempVar), initExpr));
		return new LocalExpression(tempVar.getName$(), tempVar);
	}
	argUsed = this._countNumberOfArgsUsed$LMemberFunctionDefinition$(calleeFuncDef);
	if ((calleeFuncDef.flags$() & ClassDefinition.IS_STATIC) === 0) {
		thisIdx = argsAndThisAndLocals.length - 1;
		recvExpr = argsAndThisAndLocals[thisIdx];
		if (! (recvExpr instanceof LeafExpression || argUsed["this"] <= exprIsInlineableFor(recvExpr))) {
			argsAndThisAndLocals[thisIdx] = createVarWithInit(callerFuncDef, new ObjectType(calleeFuncDef.getClassDef$()), "this", recvExpr);
		}
	}
	formalArgs = calleeFuncDef.getArguments$();
	for (i = 0; i < formalArgs.length; ++i) {
		numberOfUsed = argUsed[formalArgs[i].getName$().getValue$()];
		argExpr = argsAndThisAndLocals[i];
		if (numberOfUsed === - Infinity || ! (argExpr instanceof LeafExpression || numberOfUsed <= exprIsInlineableFor(argExpr))) {
			argsAndThisAndLocals[i] = createVarWithInit(callerFuncDef, formalArgs[i].getType$(), formalArgs[i].getName$().getValue$(), argExpr);
		}
	}
	calleeFuncDef.getLocals$().forEach((function (local) {
		var tempVar;
		tempVar = $this.createVar$LMemberFunctionDefinition$LType$S(callerFuncDef, local.getType$(), local.getName$().getValue$());
		argsAndThisAndLocals.push(new LocalExpression(tempVar.getName$(), tempVar));
	}));
};


_InlineOptimizeCommand.prototype._rewriteExpression$LExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$ = function (expr, parentExpr, replaceCb, argsAndThisAndLocals, calleeFuncDef) {
	var $this = this;
	var formalArgs;
	var localExpr;
	var j;
	var locals;
	var k;
	formalArgs = calleeFuncDef.getArguments$();
	if (expr instanceof LocalExpression) {
		localExpr = expr;
		for (j = 0; j < formalArgs.length; ++j) {
			if (formalArgs[j].getName$().getValue$() === localExpr.getLocal$().getName$().getValue$()) {
				break;
			}
		}
		if (j === formalArgs.length) {
			++j;
			locals = calleeFuncDef.getLocals$();
			for (k = 0; k < locals.length; (++k, ++j)) {
				if (locals[k].getName$().getValue$() === localExpr.getLocal$().getName$().getValue$()) {
					break;
				}
			}
		}
		if (j !== argsAndThisAndLocals.length) {
			if (argsAndThisAndLocals[j] instanceof FunctionExpression) {
				replaceCb(argsAndThisAndLocals[j]);
				argsAndThisAndLocals[j] = null;
			} else {
				if (parentExpr != null && parentExpr instanceof AssignmentExpression && parentExpr.getFirstExpr$() == expr && ! (argsAndThisAndLocals[j] instanceof LocalExpression)) {
					return true;
				}
				replaceCb(argsAndThisAndLocals[j].clone$());
			}
		}
	} else if (expr instanceof ThisExpression) {
		replaceCb(argsAndThisAndLocals[formalArgs.length].clone$());
	}
	expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (childExpr, replaceCb) {
		return $this._rewriteExpression$LExpression$LExpression$F$LExpression$V$ALExpression$LMemberFunctionDefinition$(childExpr, expr, replaceCb, argsAndThisAndLocals, calleeFuncDef);
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


function _StructuredStashAccessor$x2E$x3CStash$x3E$5() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$5], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$5.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$5 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$5.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _UnboxOptimizeCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$5.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _UnboxOptimizeCommand() {
	_FunctionOptimizeCommand.call(this, _UnboxOptimizeCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$5.call(this);
};

$__jsx_extend([_UnboxOptimizeCommand], _FunctionOptimizeCommand);
$__jsx_merge_interface(_UnboxOptimizeCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$5);

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
			++i;
		}
	}
	return true;
};


_UnboxOptimizeCommand.prototype._optimizeLocal$LMemberFunctionDefinition$LLocalVariable$ = function (funcDef, local) {
	var $this = this;
	var foundNew;
	var onStatement;
	var canUnbox;
	if (! (local.getType$() instanceof ObjectType)) {
		return false;
	}
	if (Util$rootIsNativeClass$LType$(local.getType$())) {
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
			} else if (expr instanceof LocalExpression) {
				if (expr.getLocal$() == local) {
					return false;
				}
			} else if (expr instanceof FunctionExpression) {
				return expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement);
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
			if (! statement.getFuncDef$().forEachStatement$F$LStatement$B$(onStatement)) {
				return false;
			}
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
	if ((newExpr.getType$().getClassDef$().flags$() & ClassDefinition.IS_NATIVE) !== 0) {
		return false;
	}
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
			var expr;
			var lhsExpr;
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
			return (function onExpr(expr) {
				if (expr instanceof ThisExpression) {
					return false;
				} else if (expr instanceof FunctionExpression) {
					return false;
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
	this.log$S("unboxing " + local.getName$().getNotation$());
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
					for (argIndex = 0; argIndex < ctor.getArguments$().length; ++argIndex) {
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
			dstStatements.splice(dstStatementIndex++, 0, new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), createLocalExpressionFor(propertyName), rhsExpr)));
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
				} else if (expr instanceof FunctionExpression) {
					return onStatements(expr.getFuncDef$().getStatements$());
				} else if (expr instanceof LocalExpression && expr.getLocal$() == local) {
					throw new Error("logic flaw, unexpected pattern");
				}
				expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				return true;
			});
			if (statements[statementIndex] instanceof FunctionStatement) {
				onStatements(statements[statementIndex].getFuncDef$().getStatements$());
				++statementIndex;
			} else {
				newExpr = $this._statementIsConstructingTheLocal$LStatement$LLocalVariable$(statements[statementIndex], local);
				if (newExpr != null) {
					statements.splice(statementIndex, 1);
					statementIndex = buildConstructingStatements(statements, statementIndex, newExpr);
				} else {
					statements[statementIndex].forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
					statements[statementIndex].handleStatements$F$ALStatement$B$(onStatements);
					++statementIndex;
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


function _StructuredStashAccessor$x2E$x3CStash$x3E$6() {
};

$__jsx_extend([_StructuredStashAccessor$x2E$x3CStash$x3E$6], Object);
_StructuredStashAccessor$x2E$x3CStash$x3E$6.prototype.$__jsx_implements__StructuredStashAccessor$x2E$x3CStash$x3E$6 = true;

_StructuredStashAccessor$x2E$x3CStash$x3E$6.prototype.getStash$LStashable$ = function (stashable) {
	var identifier;
	var stash;
	identifier = this._identifier;
	stash = stashable.getStash$S(identifier);
	if (stash == null) {
		stash = new _NoDebugCommand$x2EStash();
		stashable.setStash$SLStash$(identifier, stash);
	}
	return stash;
};


_StructuredStashAccessor$x2E$x3CStash$x3E$6.prototype.resetStash$LStashable$ = function (stashable) {
	var identifier;
	identifier = this._identifier;
	stashable.setStash$SLStash$(identifier, null);
};


function _NoDebugCommand() {
	_OptimizeCommand.call(this, _NoDebugCommand.IDENTIFIER);
	_StructuredStashAccessor$x2E$x3CStash$x3E$6.call(this);
};

$__jsx_extend([_NoDebugCommand], _OptimizeCommand);
$__jsx_merge_interface(_NoDebugCommand, _StructuredStashAccessor$x2E$x3CStash$x3E$6);

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
					falseExpr = new BooleanLiteralExpression(new Token$2(stash.debugValue + "", true));
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
	this._searchPaths = null;
	this._builtinParsers = null;
	this._userEnvironment = null;
	this._emitter = null;
	this._npmModulesParsed = {};
	this._packageJsonCache = {};
	this._platform = platform;
	this._mode = Compiler.MODE_COMPILE;
	this._transformCommands = [  ];
	this._optimizer = null;
	this._warningFilters = [  ];
	this._warningAsError = false;
	this._parsers = [];
	this._fileCache = {};
	this._searchPaths = [ this._platform.getRoot$() + "/lib/common" ];
	this.addSourceFile$LToken$S(null, this._platform.getRoot$() + "/lib/built-in.jsx");
	this._builtinParsers = this._parsers.concat([]);
	this._userEnvironment = {};
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


Compiler.prototype.setTransformCommands$AS = function (cmds) {
	var i;
	var cmd;
	for (i = 0; i < cmds.length; ++i) {
		cmd = cmds[i];
		switch (cmd) {
		case "generator":
			this._transformCommands.push(new GeneratorTransformCommand(this));
			break;
		case "cps":
			this._transformCommands.push(new CPSTransformCommand(this));
			break;
		default:
			return "unknown transformation command: " + cmd;
		}
	}
	return null;
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


Compiler.prototype.getBuiltinParsers$ = function () {
	return this._builtinParsers;
};


Compiler.prototype.getUserEnvironment$ = function () {
	return this._userEnvironment;
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
	for (i = 0; i < this._parsers.length; ++i) {
		if (this._parsers[i].getPath$() === path) {
			return this._parsers[i];
		}
	}
	return null;
};


Compiler.prototype.compile$ = function () {
	var errors;
	var i;
	var builtins;
	errors = [];
	for (i = 0; i < this._parsers.length; ++i) {
		if (! this._parseFile$ALCompileError$N(errors, i)) {
			if (! this._handleErrors$ALCompileError$(errors)) {
				return false;
			}
		}
	}
	switch (this._mode) {
	case Compiler.MODE_PARSE:
		return true;
	}
	this.normalizeClassDefs$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
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
	this._transform$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	this._optimize$();
	this._generateCode$ALCompileError$(errors);
	if (! this._handleErrors$ALCompileError$(errors)) {
		return false;
	}
	return true;
};


Compiler.prototype.getAST$ = function () {
	var $this = this;
	var classDefs;
	var i;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
		classDefs = classDefs.concat(this._parsers[i].getTemplateClassDefs$().map((function (classDef) {
			return classDef;
		})));
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


Compiler.prototype._parseFile$ALCompileError$N = function (errors, parserIndex) {
	var parser;
	var content;
	var conflictWarning;
	var imports;
	var i;
	parser = this._parsers[parserIndex];
	content = this.getFileContent$ALCompileError$LToken$S(errors, parser.getSourceToken$(), parser.getPath$());
	if (content == null) {
		parser.parse$SALCompileError$("", []);
		return false;
	}
	conflictWarning = this._checkConflictOfNpmModulesParsed$N(parserIndex) || this._checkConflictOfIdenticalFiles$NS(parserIndex, content);
	if (conflictWarning != null) {
		errors.push(conflictWarning);
	}
	parser.parse$SALCompileError$(content, errors);
	if (this._mode !== Compiler.MODE_PARSE) {
		imports = parser.getImports$();
		for (i = 0; i < imports.length; ++i) {
			if (! this._handleImport$ALCompileError$LParser$LImport$(errors, parser, imports[i])) {
				return false;
			}
		}
	}
	return true;
};


Compiler.prototype._checkConflictOfNpmModulesParsed$N = function (parserIndex) {
	var $this = this;
	var getModuleNameAndPath;
	var parser;
	var moduleNameAndPath;
	var offendingParser;
	var offendingModulePath;
	function getModuleNameAndPath(path) {
		var match;
		match = path.match(/^(?:.*\/|)node_modules\/([^\/]+)\//);
		if (match == null) {
			return null;
		}
		return [ match[1], match[0].substring(0, match[0].length - 1) ];
	}
	parser = this._parsers[parserIndex];
	moduleNameAndPath = getModuleNameAndPath(parser.getPath$());
	if (moduleNameAndPath == null) {
		return null;
	}
	if (! $__jsx_ObjectHasOwnProperty.call(this._npmModulesParsed, moduleNameAndPath[0])) {
		this._npmModulesParsed[moduleNameAndPath[0]] = parserIndex;
		return null;
	}
	offendingParser = this._parsers[this._npmModulesParsed[moduleNameAndPath[0]]];
	offendingModulePath = getModuleNameAndPath(offendingParser.getPath$())[1];
	if (offendingModulePath === moduleNameAndPath[1]) {
		return null;
	}
	return new CompileWarning(parser.getSourceToken$(), "please consider running \"npm dedupe\"; the NPM module has already been read from a different location:").addCompileNote$LCompileNote$(new CompileNote(offendingParser.getSourceToken$(), "at first from here as: " + offendingParser.getPath$())).addCompileNote$LCompileNote$(new CompileNote(parser.getSourceToken$(), "and now from here as: " + parser.getPath$()));
};


Compiler.prototype._checkConflictOfIdenticalFiles$NS = function (parserIndex, content) {
	var parser;
	var i;
	parser = this._parsers[parserIndex];
	for (i = 0; i !== parserIndex; ++i) {
		if (this._parsers[i].getContent$() === content && Util$basename$S(this._parsers[i].getPath$()) === Util$basename$S(parser.getPath$())) {
			return new CompileWarning(parser.getSourceToken$(), "the file (with identical content) has been read from different locations:").addCompileNote$LCompileNote$(new CompileNote(parser.getSourceToken$(), "from here as: " + parser.getPath$())).addCompileNote$LCompileNote$(new CompileNote(this._parsers[i].getSourceToken$(), "from here as: " + this._parsers[i].getPath$()));
		}
	}
	return null;
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
		resolvedDir = this._resolvePath$SSB(wildImprt.getFilenameToken$().getFilename$(), wildImprt.getDirectory$(), true);
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
		for (i = 0; i < files.length; ++i) {
			if (files[i].length >= wildImprt.getSuffix$().length && files[i].charAt(0) !== "." && files[i].substring(((files[i].length - wildImprt.getSuffix$().length) | 0)) === wildImprt.getSuffix$()) {
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
		path = this._resolvePath$SSB(imprt.getFilenameToken$().getFilename$(), Util$decodeStringLiteral$S(imprt.getFilenameToken$().getValue$()), false);
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
		for (i = 0; i < inners.length; ++i) {
			if (! onClassDef(parser, inners[i])) {
				return false;
			}
		}
		return true;
	}
	for (i = 0; i < this._parsers.length; ++i) {
		parser = this._parsers[i];
		classDefs = parser.getClassDefs$();
		for (j = 0; j < classDefs.length; ++j) {
			if (! onClassDef(parser, classDefs[j])) {
				return false;
			}
		}
	}
	return true;
};


Compiler.prototype.normalizeClassDefs$ALCompileError$ = function (errors) {
	var $this = this;
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.normalizeClassDefs$ALCompileError$(errors);
		return true;
	}));
};


Compiler.prototype._resolveImports$ALCompileError$ = function (errors) {
	var i;
	var imports;
	var j;
	for (i = 0; i < this._parsers.length; ++i) {
		this._parsers[i].registerBuiltinImports$ALParser$(this._builtinParsers);
		imports = this._parsers[i].getImports$();
		for (j = 0; j < imports.length; ++j) {
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
		classDef.analyze$LAnalysisContext$(createContext(parser));
		return true;
	}));
	this.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		classDef.analyzeUnusedVariables$();
		return true;
	}));
};


Compiler.prototype._transform$ALCompileError$ = function (errors) {
	var $this = this;
	var doit;
	var i;
	function doit(cmd) {
		cmd.setup$ALCompileError$(errors);
		cmd.performTransformation$();
		return errors.length === 0;
	}
	for (i = 0; i < this._transformCommands.length; ++i) {
		if (! doit(this._transformCommands[i])) {
			return;
		}
	}
	if (! doit(new FixedExpressionTransformCommand(this))) {
		return;
	}
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
	var maxIndexOfClasses;
	var deps;
	classDefs = [];
	for (i = 0; i < this._parsers.length; ++i) {
		classDefs = classDefs.concat(this._parsers[i].getClassDefs$());
		this._parsers[i].getTemplateClassDefs$().forEach((function (templateClassDef) {
			if ((templateClassDef.flags$() & ClassDefinition.IS_NATIVE) !== 0 && templateClassDef.getNativeSource$() != null) {
				classDefs.push(templateClassDef);
			}
		}));
	}
	for (i = 0; i < classDefs.length; ++i) {
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
		if ($__jsx_ObjectHasOwnProperty.call(nativeClassNames, classDef.className$()) && ! (classDef instanceof InstantiatedClassDefinition && nativeClassNames[classDef.className$()] instanceof InstantiatedClassDefinition && classDef.getTemplateClass$() == nativeClassNames[classDef.className$()].getTemplateClass$()) && classDef.getNativeSource$() == null && classDef.getOuterClassDef$() == null) {
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
		for (i = 0; i < classDefs.length; ++i) {
			for (j = 0; j < deps.length; ++j) {
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
		if ((classDefs[i].flags$() & ClassDefinition.IS_NATIVE) !== 0) {
			maxIndexOfClasses = - 1;
		} else {
			deps = classDefs[i].implementTypes$().map((function (t) {
				return t.getClassDef$();
			})).concat([  ]);
			if (classDefs[i].extendType$() != null) {
				deps.unshift(classDefs[i].extendType$().getClassDef$());
			}
			if (classDefs[i].getOuterClassDef$() != null && deps.indexOf(classDefs[i].getOuterClassDef$()) === - 1) {
				deps.unshift(classDefs[i].getOuterClassDef$());
			}
			maxIndexOfClasses = getMaxIndexOfClasses(deps);
		}
		if (maxIndexOfClasses > i) {
			classDefs.splice(maxIndexOfClasses + 1, 0, classDefs[i]);
			classDefs.splice(i, 1);
		} else {
			++i;
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
				if ((funcDef.flags$() & ClassDefinition.IS_STATIC) === 0 && (funcDef.name$().match(/^test/) || funcDef.name$() === "constructor") && funcDef.getArguments$().length === 0) {
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
			for (i = 0; i < $this._warningFilters.length; ++i) {
				if ((doWarn = $this._warningFilters[i](warning)) != null) {
					break;
				}
			}
			if (doWarn !== false) {
				$this._platform.warn$S(warning.format$LPlatform$($this.getPlatform$()));
				warning.getCompileNotes$().forEach((function (note) {
					$this._platform.warn$S(note.format$LPlatform$($this.getPlatform$()));
				}));
				if ($this._warningAsError) {
					isFatal = true;
				}
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


Compiler.prototype._readPackageJson$S = function (moduleDir) {
	var json;
	var contents;
	if ($__jsx_ObjectHasOwnProperty.call(this._packageJsonCache, moduleDir)) {
		return this._packageJsonCache[moduleDir];
	}
	json = null;
	if (this._platform.fileExists$S(moduleDir + "/package.json")) {
		try {
			contents = this._platform.load$S(moduleDir + "/package.json");
			json = JSON.parse(contents);
		} catch ($__jsx_catch_0) {
			{
				this._platform.warn$S("could not parse file:" + moduleDir + "/package.json");
			}
		}
	}
	this._packageJsonCache[moduleDir] = json;
	return json;
};


Compiler.prototype._resolvePathFromNodeModules$SSB = function (srcDir, givenPath, isWildcard) {
	var $this = this;
	var firstSlashAtGivenPath;
	var moduleName;
	var lookupInNodeModules;
	var path;
	var match;
	firstSlashAtGivenPath = givenPath.indexOf("/");
	moduleName = (firstSlashAtGivenPath !== - 1 ? givenPath.substring(0, firstSlashAtGivenPath) : givenPath);
	function lookupInNodeModules(nodeModulesDir) {
		var moduleDir;
		var packageJson;
		var libDir;
		var subPathWithLeadingSlash;
		var main;
		moduleDir = nodeModulesDir + "/" + moduleName;
		if (! $this._platform.fileExists$S(moduleDir)) {
			return "";
		}
		packageJson = $this._readPackageJson$S(moduleDir);
		if (packageJson == null) {
			packageJson = ({  });
		}
		if (isWildcard || firstSlashAtGivenPath !== - 1) {
			libDir = (packageJson.directories && packageJson.directories.lib ? packageJson.directories.lib + "" : "lib");
			subPathWithLeadingSlash = (firstSlashAtGivenPath !== - 1 ? givenPath.substring(firstSlashAtGivenPath) : "");
			return Util$resolvePath$S(moduleDir + "/" + libDir + subPathWithLeadingSlash);
		} else {
			main = (packageJson.main ? packageJson.main + "" : "index.jsx");
			return Util$resolvePath$S(moduleDir + "/" + main);
		}
	}
	while (true) {
		path = lookupInNodeModules(srcDir + "/node_modules");
		if (path !== "") {
			return path;
		}
		match = srcDir.match(/^(.*)\/node_modules\/[^\/]+$/);
		if (match == null) {
			break;
		}
		srcDir = match[1];
	}
	return "";
};


Compiler.prototype._resolvePath$SSB = function (srcPath, givenPath, isWildcard) {
	var searchPaths;
	var i;
	var path;
	var srcDir;
	var lastSlashAt;
	if (givenPath.match(/^\.{1,2}\//) == null) {
		searchPaths = this._searchPaths.concat(this._emitter.getSearchPaths$());
		for (i = 0; i < searchPaths.length; ++i) {
			path = Util$resolvePath$S(searchPaths[i] + "/" + givenPath);
			if (this._platform.fileExists$S(path)) {
				return path;
			}
		}
		srcDir = Util$dirname$S(srcPath);
		path = this._resolvePathFromNodeModules$SSB(srcDir, givenPath, isWildcard);
		if (path !== "") {
			return path;
		}
		if (srcDir !== ".") {
			path = this._resolvePathFromNodeModules$SSB(".", givenPath, isWildcard);
			if (path !== "") {
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
			} else if (word.substring(0, prefix.length) === prefix) {
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
	} else if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
		data.kind = "mixin";
	} else {
		data.kind = "class";
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
		} else if (autoCompleteMatchCb == null || autoCompleteMatchCb(classDef)) {
			candidates.push(CompletionCandidates$makeClassCandidate$LClassDefinition$(classDef));
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
	for (i = 0; i < this._parser._imports.length; ++i) {
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
		for (i in args) { i |= 0;
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
	isStatic = this._expr.isClassSpecifier$();
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
	return this._description.replace(/^[\r\n]+/, "").replace(/[\r\n\t ]+$/, "");
};


DocCommentNode.prototype.appendDescription$S = function (s) {
	this._description += s;
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


DocCommentParameter.prototype.getDescription$ = function () {
	var d;
	d = DocCommentNode.prototype.getDescription$.call(this);
	return d.trim();
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
	for (i = 0; i < this._tags.length; ++i) {
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
	for (i = 0; i < this._tags.length; ++i) {
		if (this._tags[i].getTagName$() === tagName) {
			tags.push(this._tags[i]);
		}
	}
	return tags;
};


function DocumentGenerator(compiler, templatePath, outputPath) {
	this._classDefToHTMLCache = new TypedMap$x2E$x3CClassDefinition$x2Cstring$x3E();
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
	var _;
	var typeName;
	var typeArgs;
	_ = "";
	typeName = "class";
	if ((classDef.flags$() & ClassDefinition.IS_INTERFACE) !== 0) {
		typeName = "interface";
	} else if ((classDef.flags$() & ClassDefinition.IS_MIXIN) !== 0) {
		typeName = "mixin";
	}
	typeArgs = (classDef instanceof TemplateClassDefinition ? classDef.getTypeArguments$() : []);
	_ += "<div class=\"class\" id=\"class-";
	_ += this._escape$S(classDef.classFullName$()).replace(/\n$/, "");
	_ += "\">\n";
	_ += "<h2>";
	_ += (this._flagsToHTML$N(classDef.flags$()) + " " + this._escape$S(typeName) + " " + this._name$S(classDef.classFullName$()) + this._formalTypeArgsToHTML$ALToken$(typeArgs) + this._inheritance$LParser$LClassDefinition$(parser, classDef)).replace(/\n$/, "");
	_ += "</h2>\n";
	_ += this._descriptionToHTML$LDocComment$(classDef.getDocComment$()).replace(/\n$/, "");
	_ += "\n";
	classDef.getTemplateInnerClasses$().forEach((function (classDef) {
		if (! $this._isPrivate$LClassDefinition$(classDef)) {
			_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
			_ += "\n";
		}
	}));
	classDef.getInnerClasses$().forEach((function (classDef) {
		if (! (classDef instanceof InstantiatedClassDefinition) && ! $this._isPrivate$LClassDefinition$(classDef)) {
			_ += $this._buildDocOfClass$LParser$LClassDefinition$(parser, classDef).replace(/\n$/, "");
			_ += "\n";
		}
	}));
	if (this._hasPublicProperties$LClassDefinition$(classDef)) {
		classDef.forEachMemberVariable$F$LMemberVariableDefinition$B$((function (varDef) {
			if (! $this._isPrivate$LMemberDefinition$(varDef)) {
				_ += "<div class=\"member property\">\n";
				_ += "<h3>\n";
				_ += $this._flagsToHTML$N(varDef.flags$()).replace(/\n$/, "");
				_ += " var ";
				_ += $this._name$S(varDef.name$()).replace(/\n$/, "");
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
		if (! (funcDef instanceof InstantiatedMemberFunctionDefinition) && $this._isConstructor$LMemberFunctionDefinition$(funcDef) && (funcDef.flags$() & ClassDefinition.IS_DELETE) === 0 && ! $this._isPrivate$LMemberDefinition$(funcDef)) {
			_ += $this._buildDocOfFunction$LParser$LMemberFunctionDefinition$(parser, funcDef).replace(/\n$/, "");
			_ += "\n";
		}
		return true;
	}));
	if (this._hasPublicFunctions$LClassDefinition$(classDef)) {
		classDef.forEachMemberFunction$F$LMemberFunctionDefinition$B$((function (funcDef) {
			if (! (funcDef instanceof InstantiatedMemberFunctionDefinition) && ! $this._isConstructor$LMemberFunctionDefinition$(funcDef) && ! $this._isPrivate$LMemberDefinition$(funcDef)) {
				_ += $this._buildDocOfFunction$LParser$LMemberFunctionDefinition$(parser, funcDef).replace(/\n$/, "");
				_ += "\n";
			}
			return true;
		}));
	}
	_ += "</div>\n";
	return _;
};


DocumentGenerator.prototype._inheritance$LParser$LClassDefinition$ = function (parser, classDef) {
	var $this = this;
	var extendClassDef;
	var _;
	var implementTypes;
	if (classDef.extendType$() == null) {
		return "";
	}
	extendClassDef = classDef.extendType$().getClassDef$();
	if (extendClassDef == null || extendClassDef.classFullName$() === "Object") {
		return "";
	}
	_ = " extends " + this._classDefToHTML$LParser$LClassDefinition$(parser, extendClassDef);
	implementTypes = classDef.implementTypes$();
	if (implementTypes.length > 0) {
		_ += " implements " + implementTypes.map((function (type) {
			return $this._classDefToHTML$LParser$LClassDefinition$(parser, type.getClassDef$());
		})).join(", ");
	}
	return _;
};


DocumentGenerator.prototype._buildDocOfFunction$LParser$LMemberFunctionDefinition$ = function (parser, funcDef) {
	var $this = this;
	var _;
	var ignoreFlags;
	var funcName;
	var args;
	var argsHTML;
	_ = "";
	ignoreFlags = funcDef.getClassDef$().flags$() & (ClassDefinition.IS_FINAL | ClassDefinition.IS_NATIVE) | ClassDefinition.IS_INLINE;
	funcName = (this._isConstructor$LMemberFunctionDefinition$(funcDef) ? "new " + this._name$S(funcDef.getClassDef$().classFullName$()) : this._flagsToHTML$N(funcDef.flags$() & ~ ignoreFlags) + " function " + this._name$S(funcDef.name$()));
	args = funcDef.getArguments$();
	argsHTML = args.map((function (arg) {
		return $this._escape$S(arg.getName$().getValue$()) + " : " + $this._typeToHTML$LParser$LType$(parser, arg.getType$());
	})).join(", ");
	_ += "<div class=\"member function\">\n";
	_ += "<h3>\n";
	_ += (funcName + this._formalTypeArgsToHTML$ALToken$(funcDef instanceof TemplateFunctionDefinition ? funcDef.getTypeArguments$() : [])).replace(/\n$/, "");
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
			_ += docComment.getDescription$().replace(/\t/g, "  ").replace(/\n$/, "");
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
	uri = /^https?:\/\/[A-Za-z0-9\-\._~:\/?#\[\]@!$&'()*+,;=]+/g;
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
		} else if (type instanceof ParsedObjectType && type.getTypeArguments$().length !== 0) {
			classDef = type.getQualifiedName$().getTemplateClass$LParser$(parser);
			if (classDef != null) {
				return this._classDefToHTML$LParser$LClassDefinition$(parser, classDef) + ".&lt;" + type.getTypeArguments$().map((function (type) {
					return $this._typeToHTML$LParser$LType$(parser, type);
				})).join(", ") + "&gt;";
			}
		}
	} else if (type instanceof FunctionType) {
		return "function " + "(" + type.getArgumentTypes$().map((function (type) {
			return ":" + $this._typeToHTML$LParser$LType$(parser, type);
		})).join(", ") + ") : " + this._typeToHTML$LParser$LType$(parser, type.getReturnType$());
	} else if (type instanceof VariableLengthArgumentType) {
		return "..." + this._typeToHTML$LParser$LType$(parser, type.getBaseType$());
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
		for (i = 0; i < parsers.length; ++i) {
			if (classDef instanceof TemplateClassDefinition) {
				templateClassDefs = parsers[i].getTemplateClassDefs$();
				for (j = 0; j < templateClassDefs.length; ++j) {
					templateClassDefs = templateClassDefs.concat(templateClassDefs[j].getTemplateInnerClasses$());
				}
				if (templateClassDefs.indexOf(classDef) !== - 1) {
					return parsers[i];
				}
			} else {
				classDefs = parsers[i].getClassDefs$();
				for (j = 0; j < classDefs.length; ++j) {
					classDefs = classDefs.concat(classDefs[j].getInnerClasses$());
				}
				if (classDefs.indexOf(classDef) !== - 1) {
					return parsers[i];
				}
			}
		}
		throw new Error("could not determine the parser to which the class belongs:" + classDef.classFullName$());
	}
	parserOfClassDef = determineParserOfClassDef();
	if (! this._pathFilter(parserOfClassDef.getPath$())) {
		return this._escape$S(classDef.classFullName$());
	}
	_ = "";
	_ += "<a href=\"";
	_ += this._escape$S(parserOfClassDef.getPath$()).replace(/\n$/, "");
	_ += ".html#class-";
	_ += this._escape$S(classDef.classFullName$()).replace(/\n$/, "");
	_ += "\">";
	_ += this._escape$S(classDef.classFullName$()).replace(/\n$/, "");
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
	if ((flags & ClassDefinition.IS_READONLY) !== 0) {
		strs.push("__readonly__");
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
	if ((flags & ClassDefinition.IS_NATIVE) !== 0) {
		strs.push("native");
	}
	if ((flags & ClassDefinition.IS_EXPORT) !== 0) {
		strs.push("__export__");
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
	for (argIndex = 0; argIndex < args.length; ++argIndex) {
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
	for (paramIndex = 0; paramIndex < params.length; ++paramIndex) {
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
	return !! (classDef.className$().charAt(0) === "_" || classDef.getDocComment$() && classDef.getDocComment$().getTagByName$S('private'));
};


DocumentGenerator.prototype._isPrivate$LMemberDefinition$ = function (memberDef) {
	return !! (memberDef.name$().charAt(0) === "_" || memberDef.getDocComment$() && memberDef.getDocComment$().getTagByName$S('private') || (memberDef.flags$() & ClassDefinition.IS_GENERATED) !== 0);
};


DocumentGenerator.prototype._name$S = function (name) {
	return "<strong>" + this._escape$S(name) + "</strong>";
};


function _ExpressionTransformer(transformer, identifier) {
	this._id = 0;
	this._transformer = transformer;
	if (_ExpressionTransformer._expressionCountMap[identifier] == null) {
		_ExpressionTransformer._expressionCountMap[identifier] = 0;
	}
	this._id = _ExpressionTransformer._expressionCountMap[identifier]++;
};

$__jsx_extend([_ExpressionTransformer], Object);
_ExpressionTransformer.prototype.getID$ = function () {
	return this._id;
};


function _MultiaryOperatorTransformer(transformer, identifier) {
	_ExpressionTransformer.call(this, transformer, identifier);
};

$__jsx_extend([_MultiaryOperatorTransformer], _ExpressionTransformer);
_MultiaryOperatorTransformer.prototype.doCPSTransform$LMemberFunctionDefinition$LExpression$LType$ = function (parent, continuation, returnType) {
	if (continuation != null) {
	}
	return this.transformOp$LMemberFunctionDefinition$LExpression$ALExpression$LType$(parent, continuation, this.getArgumentExprs$(), returnType);
};


_MultiaryOperatorTransformer.prototype.transformOp$LMemberFunctionDefinition$LExpression$ALExpression$LType$ = function (parent, continuation, exprs, returnType) {
	var result;
	if (exprs.length === 0) {
		return this._createContinuationCall$LExpression$LExpression$(continuation, this.constructOp$ALExpression$([  ]));
	} else {
		if (continuation != null) {
		}
		result = {};
		this._transformArgs$LMemberFunctionDefinition$ALExpression$LType$HX(parent, exprs, returnType, result);
		this._injectBody$ALExpression$LExpression$LMemberFunctionDefinition$LMemberFunctionDefinition$LExpression$(result.newArgs, result.topExpr, result.topFuncDef, result.botFuncDef, continuation);
		return result.topExpr;
	}
};


_MultiaryOperatorTransformer.prototype._transformArgs$LMemberFunctionDefinition$ALExpression$LType$HX = function (parent, exprs, returnType, result) {
	var newArgs;
	var i;
	var newArgLocals;
	var topExpr;
	var rootFuncDef;
	var prevFuncDef;
	var funcDef;
	var cont;
	var body;
	newArgs = [];
	for (i = 0; i < exprs.length; ++i) {
		newArgs.push(_Util$1$_createFreshArgumentDeclaration$LType$(exprs[i].getType$()));
	}
	newArgLocals = [];
	for (i = 0; i < exprs.length; ++i) {
		newArgLocals.push(new LocalExpression(exprs[i].getToken$(), newArgs[i]));
	}
	topExpr = null;
	rootFuncDef = null;
	prevFuncDef = parent;
	for (i = 0; i < exprs.length; ++i) {
		funcDef = _Util$1$_createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$(prevFuncDef, this.getExpression$().getToken$(), [ newArgs[i] ], returnType);
		if (rootFuncDef == null) {
			rootFuncDef = funcDef;
		}
		cont = new FunctionExpression(funcDef.getToken$(), funcDef);
		body = this._transformer._getExpressionTransformerFor$LExpression$(exprs[i]).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(prevFuncDef, cont, returnType);
		if (i === 0) {
			topExpr = body;
		} else {
			prevFuncDef.getStatements$().push(new ReturnStatement(new Token$2("return", false), body));
		}
		prevFuncDef = funcDef;
	}
	topExpr._token = this.getExpression$().getToken$();
	result.newArgs = newArgLocals;
	result.topExpr = topExpr;
	result.topFuncDef = rootFuncDef;
	result.botFuncDef = prevFuncDef;
};


_MultiaryOperatorTransformer.prototype._injectBody$ALExpression$LExpression$LMemberFunctionDefinition$LMemberFunctionDefinition$LExpression$ = function (args, topExpr, topFuncDef, botFuncDef, continuation) {
	var body;
	body = this._createContinuationCall$LExpression$LExpression$(continuation, this.constructOp$ALExpression$(args));
	botFuncDef._statements = [ new ReturnStatement(new Token$2("return", false), body) ];
	Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(topFuncDef, botFuncDef);
};


_MultiaryOperatorTransformer.prototype._createContinuationCall$LExpression$LExpression$ = function (proc, arg) {
	if (proc == null) {
		return arg;
	} else {
		return new CallExpression(arg.getToken$(), proc, [ arg ]);
	}
};


function _LeafExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "LEAF");
	this._expr = expr;
};

$__jsx_extend([_LeafExpressionTransformer], _MultiaryOperatorTransformer);
_LeafExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_LeafExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return [];
};


_LeafExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	return this._expr;
};


function _ArrayLiteralExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "ARRAY-LITERAL");
	this._expr = expr;
};

$__jsx_extend([_ArrayLiteralExpressionTransformer], _MultiaryOperatorTransformer);
_ArrayLiteralExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_ArrayLiteralExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return this._expr.getExprs$();
};


_ArrayLiteralExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var arrayLiteralExpr;
	arrayLiteralExpr = this._expr.clone$();
	arrayLiteralExpr._exprs = exprs;
	return arrayLiteralExpr;
};


function _MapLiteralExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "MAP-LITERAL");
	this._expr = expr;
};

$__jsx_extend([_MapLiteralExpressionTransformer], _MultiaryOperatorTransformer);
_MapLiteralExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_MapLiteralExpressionTransformer.prototype.getArgumentExprs$ = function () {
	var $this = this;
	return this._expr.getElements$().map((function (elt) {
		return elt.getExpr$();
	}));
};


_MapLiteralExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var elts;
	var i;
	var elt;
	elts = [];
	for (i = 0; i < this._expr.getElements$().length; ++i) {
		elt = this._expr.getElements$()[i];
		elts[i] = new MapLiteralElement(elt.getKey$(), exprs[i]);
	}
	return new MapLiteralExpression(this._expr.getToken$(), elts, this._expr.getType$());
};


function _FunctionExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "FUNCTION");
	this._expr = expr;
};

$__jsx_extend([_FunctionExpressionTransformer], _MultiaryOperatorTransformer);
_FunctionExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_FunctionExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return [];
};


_FunctionExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	return this._expr;
};


function _UnaryExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "UNARY");
	this._expr = expr;
};

$__jsx_extend([_UnaryExpressionTransformer], _MultiaryOperatorTransformer);
_UnaryExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_UnaryExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return [ this._expr.getExpr$() ];
};


_UnaryExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	return this._clone$LExpression$(exprs[0]);
};


function _BitwiseNotExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_BitwiseNotExpressionTransformer], _UnaryExpressionTransformer);
_BitwiseNotExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new BitwiseNotExpression(this._expr.getToken$(), arg);
};


function _InstanceofExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_InstanceofExpressionTransformer], _UnaryExpressionTransformer);
_InstanceofExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new InstanceofExpression(this._expr.getToken$(), arg, this._expr.getExpectedType$());
};


function _AsExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_AsExpressionTransformer], _UnaryExpressionTransformer);
_AsExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new AsExpression(this._expr.getToken$(), arg, this._expr.getType$());
};


function _AsNoConvertExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_AsNoConvertExpressionTransformer], _UnaryExpressionTransformer);
_AsNoConvertExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new AsNoConvertExpression(this._expr.getToken$(), arg, this._expr.getType$());
};


function _LogicalNotExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_LogicalNotExpressionTransformer], _UnaryExpressionTransformer);
_LogicalNotExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new LogicalNotExpression(this._expr.getToken$(), arg);
};


function _IncrementExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_IncrementExpressionTransformer], _UnaryExpressionTransformer);
_IncrementExpressionTransformer.prototype.getArgumentExprs$ = function () {
	var expr;
	var arrayExpr;
	expr = this._expr.getExpr$();
	if (expr instanceof LocalExpression || expr instanceof PropertyExpression && expr.getExpr$().isClassSpecifier$()) {
		return [];
	} else if (expr instanceof PropertyExpression) {
		return [ expr.getExpr$() ];
	} else if (expr instanceof ArrayExpression) {
		arrayExpr = expr;
		return [ arrayExpr.getFirstExpr$(), arrayExpr.getSecondExpr$() ];
	} else {
		throw new Error("logic flaw");
	}
};


_IncrementExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var expr;
	var propertyExpr;
	var arrayExpr;
	expr = this._expr.getExpr$();
	if (expr instanceof PropertyExpression) {
		propertyExpr = expr.clone$();
		propertyExpr._expr = exprs[0];
		return this._clone$LExpression$(propertyExpr);
	} else if (expr instanceof ArrayExpression) {
		arrayExpr = new ArrayExpression(expr.getToken$(), exprs[0], exprs[1]);
		arrayExpr._type = expr.getType$();
		return this._clone$LExpression$(arrayExpr);
	} else {
		return this._expr;
	}
};


function _PostIncrementExpressionTransformer(transformer, expr) {
	_IncrementExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_PostIncrementExpressionTransformer], _IncrementExpressionTransformer);
_PostIncrementExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new PostIncrementExpression(this._expr.getToken$(), arg);
};


function _PreIncrementExpressionTransformer(transformer, expr) {
	_IncrementExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_PreIncrementExpressionTransformer], _IncrementExpressionTransformer);
_PreIncrementExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new PreIncrementExpression(this._expr.getToken$(), arg);
};


function _PropertyExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "PROPERTY");
	this._expr = expr;
};

$__jsx_extend([_PropertyExpressionTransformer], _MultiaryOperatorTransformer);
_PropertyExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_PropertyExpressionTransformer.prototype.getArgumentExprs$ = function () {
	if (this._expr.getType$() instanceof MemberFunctionType) {
		throw new Error("logic flaw");
	}
	if (this._expr.getExpr$().isClassSpecifier$()) {
		return [];
	} else {
		return [ this._expr.getExpr$() ];
	}
};


_PropertyExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var propExpr;
	if (this._expr.getExpr$().isClassSpecifier$()) {
		return this._expr;
	} else {
		propExpr = new PropertyExpression$0(this._expr.getToken$(), exprs[0], this._expr.getIdentifierToken$(), this._expr.getTypeArguments$(), this._expr.getType$());
		propExpr._isInner = this._expr._isInner;
		return propExpr;
	}
};


function _TypeofExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_TypeofExpressionTransformer], _UnaryExpressionTransformer);
_TypeofExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new TypeofExpression(this._expr.getToken$(), arg);
};


function _SignExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_SignExpressionTransformer], _UnaryExpressionTransformer);
_SignExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new SignExpression(this._expr.getToken$(), arg);
};


function _YieldExpressionTransformer(transformer, expr) {
	_UnaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_YieldExpressionTransformer], _UnaryExpressionTransformer);
_YieldExpressionTransformer.prototype._clone$LExpression$ = function (arg) {
	return new YieldExpression$0(this._expr.getToken$(), arg, this._expr.getSeedType$(), this._expr.getGenType$());
};


function _BinaryExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "BINARY");
	this._expr = expr;
};

$__jsx_extend([_BinaryExpressionTransformer], _MultiaryOperatorTransformer);
_BinaryExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_BinaryExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return [ this._expr.getFirstExpr$(), this._expr.getSecondExpr$() ];
};


_BinaryExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	return this._clone$LExpression$LExpression$(exprs[0], exprs[1]);
};


function _AdditiveExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_AdditiveExpressionTransformer], _BinaryExpressionTransformer);
_AdditiveExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	var ret;
	ret = new AdditiveExpression(this._expr.getToken$(), arg1, arg2);
	ret._type = this._expr._type;
	return ret;
};


function _ArrayExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_ArrayExpressionTransformer], _BinaryExpressionTransformer);
_ArrayExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	var aryExpr;
	aryExpr = new ArrayExpression(this._expr.getToken$(), arg1, arg2);
	aryExpr._type = this._expr._type;
	return aryExpr;
};


function _AssignmentExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "ASSIGNMENT");
	this._expr = expr;
};

$__jsx_extend([_AssignmentExpressionTransformer], _MultiaryOperatorTransformer);
_AssignmentExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_AssignmentExpressionTransformer.prototype.getArgumentExprs$ = function () {
	var lhsExpr;
	var arrayExpr;
	lhsExpr = this._expr.getFirstExpr$();
	if (lhsExpr instanceof LocalExpression || lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$().isClassSpecifier$()) {
		return [ this._expr.getSecondExpr$() ];
	} else if (lhsExpr instanceof PropertyExpression) {
		return [ this._expr.getFirstExpr$().getExpr$(), this._expr.getSecondExpr$() ];
	} else if (lhsExpr instanceof ArrayExpression) {
		arrayExpr = this._expr.getFirstExpr$();
		return [ arrayExpr.getFirstExpr$(), arrayExpr.getSecondExpr$(), this._expr.getSecondExpr$() ];
	} else {
		throw new Error("logic flaw");
	}
};


_AssignmentExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var lhsExpr;
	lhsExpr = this._expr.getFirstExpr$();
	if (lhsExpr instanceof LocalExpression || lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$().isClassSpecifier$()) {
		return this._constructSimpleAssignment$LExpression$(exprs[0]);
	} else if (lhsExpr instanceof PropertyExpression) {
		return this._constructPropertyAssignment$LExpression$LExpression$(exprs[0], exprs[1]);
	} else if (lhsExpr instanceof ArrayExpression) {
		return this._constructArrayAssignment$LExpression$LExpression$LExpression$(exprs[0], exprs[1], exprs[2]);
	} else {
		throw new Error("logic flaw");
	}
};


_AssignmentExpressionTransformer.prototype._constructSimpleAssignment$LExpression$ = function (expr) {
	return new AssignmentExpression(this._expr.getToken$(), this._expr.getFirstExpr$(), expr);
};


_AssignmentExpressionTransformer.prototype._constructPropertyAssignment$LExpression$LExpression$ = function (expr1, expr2) {
	var propertyExpr;
	propertyExpr = this._expr.getFirstExpr$().clone$();
	propertyExpr._expr = expr1;
	return new AssignmentExpression(this._expr.getToken$(), propertyExpr, expr2);
};


_AssignmentExpressionTransformer.prototype._constructArrayAssignment$LExpression$LExpression$LExpression$ = function (receiver, key, value) {
	var arrayExpr;
	arrayExpr = new ArrayExpression(this._expr.getFirstExpr$().getToken$(), receiver, key);
	arrayExpr._type = this._expr.getFirstExpr$().getType$();
	return new AssignmentExpression(this._expr.getToken$(), arrayExpr, value);
};


function _FusedAssignmentExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "FUSED-ASSIGNMENT");
	this._expr = expr;
};

$__jsx_extend([_FusedAssignmentExpressionTransformer], _MultiaryOperatorTransformer);
_FusedAssignmentExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_FusedAssignmentExpressionTransformer.prototype.getArgumentExprs$ = function () {
	var lhsExpr;
	var arrayExpr;
	lhsExpr = this._expr.getFirstExpr$();
	if (lhsExpr instanceof LocalExpression || lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$().isClassSpecifier$()) {
		return [ this._expr.getSecondExpr$() ];
	} else if (lhsExpr instanceof PropertyExpression) {
		return [ this._expr.getFirstExpr$().getExpr$(), this._expr.getSecondExpr$() ];
	} else if (lhsExpr instanceof ArrayExpression) {
		arrayExpr = this._expr.getFirstExpr$();
		return [ arrayExpr.getFirstExpr$(), arrayExpr.getSecondExpr$(), this._expr.getSecondExpr$() ];
	} else {
		throw new Error("logic flaw");
	}
};


_FusedAssignmentExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var lhsExpr;
	lhsExpr = this._expr.getFirstExpr$();
	if (lhsExpr instanceof LocalExpression || lhsExpr instanceof PropertyExpression && lhsExpr.getExpr$().isClassSpecifier$()) {
		return this._constructSimpleAssignment$LExpression$(exprs[0]);
	} else if (lhsExpr instanceof PropertyExpression) {
		return this._constructPropertyAssignment$LExpression$LExpression$(exprs[0], exprs[1]);
	} else if (lhsExpr instanceof ArrayExpression) {
		return this._constructArrayAssignment$LExpression$LExpression$LExpression$(exprs[0], exprs[1], exprs[2]);
	} else {
		throw new Error("logic flaw");
	}
};


_FusedAssignmentExpressionTransformer.prototype._constructSimpleAssignment$LExpression$ = function (expr) {
	return new FusedAssignmentExpression(this._expr.getToken$(), this._expr.getFirstExpr$(), expr);
};


_FusedAssignmentExpressionTransformer.prototype._constructPropertyAssignment$LExpression$LExpression$ = function (expr1, expr2) {
	var propertyExpr;
	propertyExpr = this._expr.getFirstExpr$().clone$();
	propertyExpr._expr = expr1;
	return new FusedAssignmentExpression(this._expr.getToken$(), propertyExpr, expr2);
};


_FusedAssignmentExpressionTransformer.prototype._constructArrayAssignment$LExpression$LExpression$LExpression$ = function (receiver, key, value) {
	var arrayExpr;
	arrayExpr = new ArrayExpression(this._expr.getFirstExpr$().getToken$(), receiver, key);
	arrayExpr._type = this._expr.getFirstExpr$().getType$();
	return new FusedAssignmentExpression(this._expr.getToken$(), arrayExpr, value);
};


function _BinaryNumberExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_BinaryNumberExpressionTransformer], _BinaryExpressionTransformer);
_BinaryNumberExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	return new BinaryNumberExpression(this._expr.getToken$(), arg1, arg2);
};


function _EqualityExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_EqualityExpressionTransformer], _BinaryExpressionTransformer);
_EqualityExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	return new EqualityExpression(this._expr.getToken$(), arg1, arg2);
};


function _InExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_InExpressionTransformer], _BinaryExpressionTransformer);
_InExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	return new InExpression(this._expr.getToken$(), arg1, arg2);
};


function _LogicalExpressionTransformer(transformer, expr) {
	_ExpressionTransformer.call(this, transformer, "LOGICAL");
	this._expr = expr;
};

$__jsx_extend([_LogicalExpressionTransformer], _ExpressionTransformer);
_LogicalExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_LogicalExpressionTransformer.prototype.doCPSTransform$LMemberFunctionDefinition$LExpression$LType$ = function (parent, continuation, returnType) {
	var argVar;
	var contFuncDef;
	var contVar;
	var condStmt;
	var ifTrueExpr;
	var ifFalseExpr;
	var ifTrueCont;
	var ifFalseCont;
	var condExpr;
	var returnStmt;
	var cont;
	if (continuation != null) {
	}
	argVar = _Util$1$_createFreshArgumentDeclaration$LType$(this._expr.getFirstExpr$().getType$());
	contFuncDef = _Util$1$_createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$(parent, null, [ argVar ], returnType);
	contVar = null;
	if (continuation != null) {
		contVar = _Util$1$_createFreshLocalVariable$LType$(continuation.getType$());
		contFuncDef.getLocals$().push(contVar);
		condStmt = new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(contVar.getName$(), contVar), continuation));
		contFuncDef.getStatements$().push(condStmt);
	}
	if (this._expr.getToken$().getValue$() === "&&") {
		ifTrueExpr = this._expr.getSecondExpr$();
		ifFalseExpr = new LocalExpression(argVar.getName$(), argVar);
	} else {
		ifTrueExpr = new LocalExpression(argVar.getName$(), argVar);
		ifFalseExpr = this._expr.getSecondExpr$();
	}
	if (ifTrueExpr.getType$().resolveIfNullable$() instanceof PrimitiveType) {
		ifTrueExpr = new AsExpression(new Token$2("as", false), ifTrueExpr, Type.booleanType);
	} else {
		ifTrueExpr = new LogicalNotExpression(new Token$2("!", false), new LogicalNotExpression(new Token$2("!", false), ifTrueExpr));
	}
	if (ifFalseExpr.getType$().resolveIfNullable$() instanceof PrimitiveType) {
		ifFalseExpr = new AsExpression(new Token$2("as", false), ifFalseExpr, Type.booleanType);
	} else {
		ifFalseExpr = new LogicalNotExpression(new Token$2("!", false), new LogicalNotExpression(new Token$2("!", false), ifFalseExpr));
	}
	ifTrueCont = null;
	ifFalseCont = null;
	if (continuation != null) {
		ifTrueCont = new LocalExpression(contVar.getName$(), contVar);
		ifFalseCont = new LocalExpression(contVar.getName$(), contVar);
	}
	condExpr = new ConditionalExpression(this._expr.getToken$(), new LocalExpression(argVar.getName$(), argVar), this._transformer._getExpressionTransformerFor$LExpression$(ifTrueExpr).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(contFuncDef, ifTrueCont, returnType), this._transformer._getExpressionTransformerFor$LExpression$(ifFalseExpr).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(contFuncDef, ifFalseCont, returnType));
	condExpr._type = returnType;
	returnStmt = new ReturnStatement(new Token$2("return", false), condExpr);
	contFuncDef.getStatements$().push(returnStmt);
	Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(parent, contFuncDef);
	cont = new FunctionExpression(contFuncDef.getToken$(), contFuncDef);
	return this._transformer._getExpressionTransformerFor$LExpression$(this._expr.getFirstExpr$()).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(parent, cont, returnType);
};


function _ShiftExpressionTransformer(transformer, expr) {
	_BinaryExpressionTransformer.call(this, transformer, expr);
};

$__jsx_extend([_ShiftExpressionTransformer], _BinaryExpressionTransformer);
_ShiftExpressionTransformer.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	return new ShiftExpression(this._expr.getToken$(), arg1, arg2);
};


function _ConditionalExpressionTransformer(transformer, expr) {
	_ExpressionTransformer.call(this, transformer, "CONDITIONAL");
	this._expr = expr;
};

$__jsx_extend([_ConditionalExpressionTransformer], _ExpressionTransformer);
_ConditionalExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_ConditionalExpressionTransformer.prototype.doCPSTransform$LMemberFunctionDefinition$LExpression$LType$ = function (parent, continuation, returnType) {
	var argVar;
	var contFuncDef;
	var contVar;
	var condStmt;
	var ifTrueExpr;
	var ifFalseExpr;
	var ifTrueCont;
	var ifFalseCont;
	var condExpr;
	var returnStmt;
	var cont;
	if (continuation != null) {
	}
	argVar = _Util$1$_createFreshArgumentDeclaration$LType$(this._expr.getCondExpr$().getType$());
	contFuncDef = _Util$1$_createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$(parent, null, [ argVar ], returnType);
	contVar = null;
	if (continuation != null) {
		contVar = _Util$1$_createFreshLocalVariable$LType$(continuation.getType$());
		contFuncDef.getLocals$().push(contVar);
		condStmt = new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(contVar.getName$(), contVar), continuation));
		contFuncDef.getStatements$().push(condStmt);
	}
	ifTrueExpr = this._expr.getIfTrueExpr$();
	if (ifTrueExpr == null) {
		ifTrueExpr = new LocalExpression(argVar.getName$(), argVar);
	}
	ifFalseExpr = this._expr.getIfFalseExpr$();
	ifTrueCont = null;
	ifFalseCont = null;
	if (continuation != null) {
		ifTrueCont = new LocalExpression(contVar.getName$(), contVar);
		ifFalseCont = new LocalExpression(contVar.getName$(), contVar);
	}
	condExpr = new ConditionalExpression(this._expr.getToken$(), new LocalExpression(argVar.getName$(), argVar), this._transformer._getExpressionTransformerFor$LExpression$(ifTrueExpr).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(contFuncDef, ifTrueCont, returnType), this._transformer._getExpressionTransformerFor$LExpression$(ifFalseExpr).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(contFuncDef, ifFalseCont, returnType));
	condExpr._type = returnType;
	returnStmt = new ReturnStatement(new Token$2("return", false), condExpr);
	contFuncDef.getStatements$().push(returnStmt);
	Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(parent, contFuncDef);
	cont = new FunctionExpression(contFuncDef.getToken$(), contFuncDef);
	return this._transformer._getExpressionTransformerFor$LExpression$(this._expr.getCondExpr$()).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(parent, cont, returnType);
};


function _CallExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "CALL");
	this._expr = expr;
};

$__jsx_extend([_CallExpressionTransformer], _MultiaryOperatorTransformer);
_CallExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_CallExpressionTransformer.prototype._isMethodCall$ = function () {
	var propertyExpr;
	if (this._expr.getExpr$() instanceof PropertyExpression) {
		propertyExpr = this._expr.getExpr$();
		if (propertyExpr.getType$() instanceof MemberFunctionType) {
			return true;
		}
	}
	return false;
};


_CallExpressionTransformer.prototype.getArgumentExprs$ = function () {
	var receiver;
	if (this._isMethodCall$()) {
		receiver = this._expr.getExpr$().getExpr$();
		return [ receiver ].concat(this._expr.getArguments$());
	} else if (this._transformer._compiler.getEmitter$().isSpecialCall$LCallExpression$(this._expr)) {
		return this._expr.getArguments$().concat([  ]);
	} else {
		return [ this._expr.getExpr$() ].concat(this._expr.getArguments$());
	}
};


_CallExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var propertyExpr;
	if (this._isMethodCall$()) {
		propertyExpr = this._expr.getExpr$();
		return new CallExpression(new Token$2("(", false), new PropertyExpression$0(propertyExpr.getToken$(), exprs[0], propertyExpr.getIdentifierToken$(), propertyExpr.getTypeArguments$(), propertyExpr.getType$()), exprs.slice(1));
	} else if (this._transformer._compiler.getEmitter$().isSpecialCall$LCallExpression$(this._expr)) {
		return new CallExpression(new Token$2("(", false), this._expr.getExpr$(), exprs);
	} else {
		return new CallExpression(new Token$2("(", false), exprs[0], exprs.slice(1));
	}
};


function _SuperExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "SUPER");
	this._expr = expr;
};

$__jsx_extend([_SuperExpressionTransformer], _MultiaryOperatorTransformer);
_SuperExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_SuperExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return this._expr.getArguments$();
};


_SuperExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var superExpr;
	superExpr = new SuperExpression$0(this._expr);
	superExpr._args = exprs;
	return superExpr;
};


function _NewExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "NEW");
	this._expr = expr;
};

$__jsx_extend([_NewExpressionTransformer], _MultiaryOperatorTransformer);
_NewExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_NewExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return this._expr.getArguments$();
};


_NewExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	var newExpr;
	newExpr = new NewExpression$0(this._expr);
	newExpr._args = exprs;
	return newExpr;
};


function _CommaExpressionTransformer(transformer, expr) {
	_MultiaryOperatorTransformer.call(this, transformer, "COMMA");
	this._expr = expr;
};

$__jsx_extend([_CommaExpressionTransformer], _MultiaryOperatorTransformer);
_CommaExpressionTransformer.prototype.getExpression$ = function () {
	return this._expr;
};


_CommaExpressionTransformer.prototype.getArgumentExprs$ = function () {
	return [ this._expr.getFirstExpr$(), this._expr.getSecondExpr$() ];
};


_CommaExpressionTransformer.prototype.constructOp$ALExpression$ = function (exprs) {
	return new CommaExpression(this._expr.getToken$(), exprs[0], exprs[1]);
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


_StatementTransformer.prototype.replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var funcDef;
	if (this._transformer._transformExprs) {
		funcDef = CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(this._transformer._getTransformingFuncDef$());
		this.getStatement$().forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
			var id;
			id = _Util$1$_createIdentityFunction$LMemberFunctionDefinition$LType$(funcDef, expr.getType$());
			if ((expr = $this._transformer._getExpressionTransformerFor$LExpression$(expr).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(funcDef, id, expr.getType$())) == null) {
				throw new Error("fatal error in expression transformation");
			}
			replaceCb(expr);
			return true;
		}));
	}
	this._replaceControlStructuresWithGotos$();
};


function _ConstructorInvocationStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CONSTRUCTOR-INVOCATION");
	this._statement = statement;
};

$__jsx_extend([_ConstructorInvocationStatementTransformer], _StatementTransformer);
_ConstructorInvocationStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ConstructorInvocationStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _ExpressionStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "EXPRESSION");
	this._statement = statement;
};

$__jsx_extend([_ExpressionStatementTransformer], _StatementTransformer);
_ExpressionStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ExpressionStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _FunctionStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "FUNCTION");
	this._statement = statement;
};

$__jsx_extend([_FunctionStatementTransformer], _StatementTransformer);
_FunctionStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_FunctionStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var funcDef;
	var statement;
	funcDef = this._statement.getFuncDef$();
	statement = new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(funcDef.getFuncLocal$().getName$(), funcDef.getFuncLocal$()), new FunctionExpression(this._statement.getToken$(), funcDef)));
	funcDef.setFuncLocal$LLocalVariable$(null);
	this._transformer._emit$LStatement$(statement);
};


function _ReturnStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "RETURN");
	this._statement = statement;
};

$__jsx_extend([_ReturnStatementTransformer], _StatementTransformer);
_ReturnStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ReturnStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var returnLocal;
	if (this._statement.getExpr$() != null) {
		returnLocal = CPSTransformCommand$_extractReturnLocal$LMemberFunctionDefinition$(this._transformer._getTransformingFuncDef$());
		if (returnLocal == null) {
			this._transformer._emitExpressionStatement$LExpression$(this._statement.getExpr$());
		} else {
			this._transformer._emitExpressionStatement$LExpression$(new AssignmentExpression(new Token$2("=", false), new LocalExpression(returnLocal.getName$(), returnLocal), this._statement.getExpr$()));
		}
	}
	this._transformer._emitGotoStatement$S("$L_exit");
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
	var funcDef;
	var aryExpr;
	if (this._transformer._transformExprs) {
		funcDef = CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(this._transformer._getTransformingFuncDef$());
		aryExpr = this._statement.getExpr$();
		this._transformer._emitExpressionStatement$LExpression$(new _DeleteStatementTransformer$x2E_Stash(this._transformer, this._statement).doCPSTransform$LMemberFunctionDefinition$LExpression$LType$(funcDef, null, aryExpr.getType$()));
	} else {
		this._transformer._emit$LStatement$(this._statement);
	}
};


_DeleteStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	throw new Error("logic flaw");
};


function _BreakStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "BREAK");
	this._statement = statement;
};

$__jsx_extend([_BreakStatementTransformer], _StatementTransformer);
_BreakStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_BreakStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var label;
	if (this._statement.getLabel$() != null) {
		label = this._transformer._getStatementTransformerByLabel$S(this._statement.getLabel$().getValue$()).getBreakingLabel$();
	} else {
		label = this._transformer._getTopLabelledBlock$().getBreakingLabel$();
	}
	this._transformer._emitGotoStatement$S(label);
};


function _ContinueStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CONTINUE");
	this._statement = statement;
};

$__jsx_extend([_ContinueStatementTransformer], _StatementTransformer);
_ContinueStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ContinueStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var label;
	if (this._statement.getLabel$() != null) {
		label = this._transformer._getStatementTransformerByLabel$S(this._statement.getLabel$().getValue$()).getContinuingLabel$();
	} else {
		label = this._transformer._getTopLabelledBlock$().getContinuingLabel$();
	}
	this._transformer._emitGotoStatement$S(label);
};


function _LabellableStatementTransformer(transformer, identifier) {
	_StatementTransformer.call(this, transformer, identifier);
};

$__jsx_extend([_LabellableStatementTransformer], _StatementTransformer);
function _DoWhileStatementTransformer(transformer, statement) {
	_LabellableStatementTransformer.call(this, transformer, "DO-WHILE");
	this._statement = statement;
};

$__jsx_extend([_DoWhileStatementTransformer], _LabellableStatementTransformer);
_DoWhileStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DoWhileStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var bodyLabel;
	var testLabel;
	var endLabel;
	bodyLabel = "$L_body_do_while_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(bodyLabel);
	this._transformer._emitLabelStatement$S(bodyLabel);
	this._transformer._enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._statement.getStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	this._transformer._leaveLabelledBlock$();
	testLabel = "$L_test_do_while_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(testLabel);
	endLabel = "$L_end_do_while_" + (this.getID$() + "");
	this._transformer._emitConditionalBranch$LExpression$SS(this._statement.getExpr$(), bodyLabel, endLabel);
	this._transformer._emitLabelStatement$S(endLabel);
};


_DoWhileStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$L_end_do_while_" + (this.getID$() + "");
};


_DoWhileStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$L_body_do_while_" + (this.getID$() + "");
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
	this._transformer._emit$LStatement$(this._statement);
};


_ForInStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
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
	this._statement = statement;
};

$__jsx_extend([_ForStatementTransformer], _LabellableStatementTransformer);
_ForStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_ForStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var initLabel;
	var testLabel;
	var bodyLabel;
	var endLabel;
	var postLabel;
	initLabel = "$L_init_for_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(initLabel);
	this._transformer._emitLabelStatement$S(initLabel);
	if (this._statement.getInitExpr$() != null) {
		this._transformer._emitExpressionStatement$LExpression$(this._statement.getInitExpr$());
	}
	testLabel = "$L_test_for_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(testLabel);
	bodyLabel = "$L_body_for_" + (this.getID$() + "");
	endLabel = "$L_end_for_" + (this.getID$() + "");
	if (this._statement.getCondExpr$() != null) {
		this._transformer._emitConditionalBranch$LExpression$SS(this._statement.getCondExpr$(), bodyLabel, endLabel);
	} else {
		this._transformer._emitConditionalBranch$LExpression$SS(new BooleanLiteralExpression(new Token$2("true", false)), bodyLabel, endLabel);
	}
	this._transformer._emitLabelStatement$S(bodyLabel);
	this._transformer._enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._statement.getStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	this._transformer._leaveLabelledBlock$();
	postLabel = "$L_post_for_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(postLabel);
	this._transformer._emitLabelStatement$S(postLabel);
	if (this._statement.getPostExpr$() != null) {
		this._transformer._emitExpressionStatement$LExpression$(this._statement.getPostExpr$());
	}
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(endLabel);
};


_ForStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$L_end_for_" + (this.getID$() + "");
};


_ForStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$L_post_for_" + (this.getID$() + "");
};


function _IfStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "IF");
	this._statement = statement;
};

$__jsx_extend([_IfStatementTransformer], _StatementTransformer);
_IfStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_IfStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var testLabel;
	var succLabel;
	var failLabel;
	var endLabel;
	testLabel = "$L_test_if_" + (this.getID$() + "");
	succLabel = "$L_succ_if_" + (this.getID$() + "");
	failLabel = "$L_fail_if_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(testLabel);
	this._transformer._emitConditionalBranch$LExpression$SS(this._statement.getExpr$(), succLabel, failLabel);
	this._transformer._emitLabelStatement$S(succLabel);
	this._statement.getOnTrueStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	endLabel = "$L_end_if_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(endLabel);
	this._transformer._emitLabelStatement$S(failLabel);
	this._statement.getOnFalseStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	this._transformer._emitGotoStatement$S(endLabel);
	this._transformer._emitLabelStatement$S(endLabel);
};


function _SwitchStatementTransformer(transformer, statement) {
	var $this = this;
	_LabellableStatementTransformer.call(this, transformer, "SWITCH");
	this._hasDefault = false;
	this._statement = statement;
	statement.getStatements$().forEach((function (statement) {
		if (statement instanceof CaseStatement) {
			statement.setStash$SLStash$(_SwitchStatementTransformer$x2ECaseStash.ID, new _SwitchStatementTransformer$x2ECaseStash());
		} else if (statement instanceof DefaultStatement) {
			$this._hasDefault = true;
		}
	}));
};

$__jsx_extend([_SwitchStatementTransformer], _LabellableStatementTransformer);
_SwitchStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_SwitchStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var beginLabel;
	var endLabel;
	beginLabel = "$L_begin_switch_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(beginLabel);
	this._transformer._emitLabelStatement$S(beginLabel);
	this._emitSwitchConditionals$();
	this._emitSwitchBodies$();
	endLabel = "$L_end_switch_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(endLabel);
	this._transformer._emitLabelStatement$S(endLabel);
};


_SwitchStatementTransformer.prototype._emitSwitchConditionals$ = function () {
	var exprVar;
	var statements;
	var i;
	var caseStmt;
	exprVar = _Util$1$_createFreshLocalVariable$LType$(this._statement.getExpr$().getType$());
	this._transformer._getTransformingFuncDef$().getLocals$().push(exprVar);
	this._transformer._emit$LStatement$(new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(exprVar.getName$(), exprVar), this._statement.getExpr$())));
	statements = this._statement.getStatements$();
	for (i = 0; i < statements.length; ++i) {
		if (statements[i] instanceof CaseStatement) {
			caseStmt = statements[i];
			this._transformer._emitConditionalBranch$LExpression$SS(new EqualityExpression(new Token$2("==", false), new LocalExpression(exprVar.getName$(), exprVar), caseStmt.getExpr$()), this._getLabelFromCaseStatement$LCaseStatement$(caseStmt), this._getLabelFromEndCaseStatement$LCaseStatement$(caseStmt));
			this._transformer._emitLabelStatement$S(this._getLabelFromEndCaseStatement$LCaseStatement$(caseStmt));
		}
	}
	if (this._hasDefault) {
		this._transformer._emitGotoStatement$S(this._getLabelFromDefaultStatement$());
	} else {
		this._transformer._emitGotoStatement$S("$L_end_switch_" + (this.getID$() + ""));
	}
};


_SwitchStatementTransformer.prototype._emitSwitchBodies$ = function () {
	var statements;
	var i;
	var stmt;
	var label;
	statements = this._statement.getStatements$();
	this._transformer._enterLabelledBlock$L_LabellableStatementTransformer$(this);
	for (i = 0; i < statements.length; ++i) {
		stmt = statements[i];
		if (stmt instanceof CaseStatement) {
			label = this._getLabelFromCaseStatement$LCaseStatement$(stmt);
			this._transformer._emitGotoStatement$S(label);
			this._transformer._emitLabelStatement$S(label);
		} else if (stmt instanceof DefaultStatement) {
			label = this._getLabelFromDefaultStatement$();
			this._transformer._emitGotoStatement$S(label);
			this._transformer._emitLabelStatement$S(label);
		} else {
			this._transformer._getStatementTransformerFor$LStatement$(stmt).replaceControlStructuresWithGotos$();
		}
	}
	this._transformer._leaveLabelledBlock$();
};


_SwitchStatementTransformer.prototype._getLabelFromCaseStatement$LCaseStatement$ = function (caseStmt) {
	return "$L_switch_" + (this.getID$() + "") + "_case_" + (caseStmt.getStash$S(_SwitchStatementTransformer$x2ECaseStash.ID).index + "");
};


_SwitchStatementTransformer.prototype._getLabelFromEndCaseStatement$LCaseStatement$ = function (caseStmt) {
	return "$L_switch_" + (this.getID$() + "") + "_end_case_" + (caseStmt.getStash$S(_SwitchStatementTransformer$x2ECaseStash.ID).index + "");
};


_SwitchStatementTransformer.prototype._getLabelFromDefaultStatement$ = function () {
	return "$L_switch_" + (this.getID$() + "") + "_default";
};


_SwitchStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$L_end_switch_" + (this.getID$() + "");
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


_CaseStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
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


_DefaultStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
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


_WhileStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var testLabel;
	var bodyLabel;
	var endLabel;
	testLabel = "$L_test_while_" + (this.getID$() + "");
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(testLabel);
	bodyLabel = "$L_body_while_" + (this.getID$() + "");
	endLabel = "$L_end_while_" + (this.getID$() + "");
	this._transformer._emitConditionalBranch$LExpression$SS(this._statement.getExpr$(), bodyLabel, endLabel);
	this._transformer._emitLabelStatement$S(bodyLabel);
	this._transformer._enterLabelledBlock$L_LabellableStatementTransformer$(this);
	this._statement.getStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	this._transformer._leaveLabelledBlock$();
	this._transformer._emitGotoStatement$S(testLabel);
	this._transformer._emitLabelStatement$S(endLabel);
};


_WhileStatementTransformer.prototype.getBreakingLabel$ = function () {
	return "$L_end_while_" + (this.getID$() + "");
};


_WhileStatementTransformer.prototype.getContinuingLabel$ = function () {
	return "$L_test_while_" + (this.getID$() + "");
};


function _TryStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "TRY");
	this._statement = statement;
};

$__jsx_extend([_TryStatementTransformer], _StatementTransformer);
_TryStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_TryStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	var $this = this;
	var funcDef;
	var raisedLocal;
	var errorLocal;
	var beginLabel;
	var finallyLabel;
	var catchLabel;
	var endLabel;
	var catchStmt;
	var endCatchLabel;
	var endFinallyLabel;
	funcDef = this._transformer._getTransformingFuncDef$();
	raisedLocal = CPSTransformCommand$_extractRaisedLocal$LMemberFunctionDefinition$(funcDef);
	errorLocal = CPSTransformCommand$_extractErrorLocal$LMemberFunctionDefinition$(funcDef);
	beginLabel = "$L_begin_try_" + (this.getID$() + "");
	this._transformer._emit$LStatement$(new GotoStatement(beginLabel));
	this._transformer._emit$LStatement$(new LabelStatement(beginLabel));
	this._transformer._emit$LStatement$(new GotoStatement("$__push_local_jump__"));
	finallyLabel = "$L_begin_finally_" + (this.getID$() + "");
	this._transformer._emit$LStatement$(new GotoStatement(finallyLabel));
	this._transformer._emit$LStatement$(new GotoStatement("$__push_local_jump__"));
	catchLabel = "$L_begin_catch_" + (this.getID$() + "");
	this._transformer._emit$LStatement$(new GotoStatement(catchLabel));
	this._statement.getTryStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	endLabel = "$L_end_try_" + (this.getID$() + "");
	this._transformer._emit$LStatement$(new GotoStatement(endLabel));
	this._transformer._emit$LStatement$(new LabelStatement(endLabel));
	catchStmt = this._statement.getCatchStatements$()[0];
	catchStmt.forEachStatement$F$LStatement$B$((function onStmt(stmt) {
		return stmt.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
			var local;
			if (expr instanceof LocalExpression) {
				local = expr.getLocal$();
				if (local == catchStmt.getLocal$()) {
					expr = new AsNoConvertExpression(new Token$2("as", false), new LocalExpression(errorLocal.getName$(), errorLocal), local.getType$());
					replaceCb(expr);
					return true;
				}
			}
			return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
		})) && stmt.forEachStatement$F$LStatement$B$(onStmt);
	}));
	this._transformer._emit$LStatement$(new GotoStatement(catchLabel));
	this._transformer._emit$LStatement$(new LabelStatement(catchLabel));
	this._transformer._emit$LStatement$(new GotoStatement("$__pop_local_jump__"));
	this._transformer._getStatementTransformerFor$LStatement$(new IfStatement(new Token$2("if", false), new LocalExpression(raisedLocal.getName$(), raisedLocal), [ new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(raisedLocal.getName$(), raisedLocal), new BooleanLiteralExpression(new Token$2("false", false)))) ].concat(catchStmt.getStatements$()), [  ])).replaceControlStructuresWithGotos$();
	endCatchLabel = "$L_end_catch_" + (this.getID$() + "");
	this._transformer._emit$LStatement$(new GotoStatement(endCatchLabel));
	this._transformer._emit$LStatement$(new LabelStatement(endCatchLabel));
	this._transformer._emit$LStatement$(new GotoStatement(finallyLabel));
	this._transformer._emit$LStatement$(new LabelStatement(finallyLabel));
	this._transformer._emit$LStatement$(new GotoStatement("$__pop_local_jump__"));
	this._statement.getFinallyStatements$().forEach((function (statement) {
		$this._transformer._getStatementTransformerFor$LStatement$(statement).replaceControlStructuresWithGotos$();
	}));
	endFinallyLabel = "$L_end_finally_" + (this.getID$() + "");
	this._transformer._getStatementTransformerFor$LStatement$(new IfStatement(new Token$2("if", false), new LocalExpression(raisedLocal.getName$(), raisedLocal), [ new ThrowStatement(new Token$2("throw", false), new LocalExpression(errorLocal.getName$(), errorLocal)) ], [  ])).replaceControlStructuresWithGotos$();
	this._transformer._emit$LStatement$(new LabelStatement(endFinallyLabel));
};


function _CatchStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "CATCH");
	this._statement = statement;
};

$__jsx_extend([_CatchStatementTransformer], _StatementTransformer);
_CatchStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_CatchStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
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


_ThrowStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _AssertStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "ASSERT");
	this._statement = statement;
};

$__jsx_extend([_AssertStatementTransformer], _StatementTransformer);
_AssertStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_AssertStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _LogStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "LOG");
	this._statement = statement;
};

$__jsx_extend([_LogStatementTransformer], _StatementTransformer);
_LogStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_LogStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _DebuggerStatementTransformer(transformer, statement) {
	_StatementTransformer.call(this, transformer, "DEBUGGER");
	this._statement = statement;
};

$__jsx_extend([_DebuggerStatementTransformer], _StatementTransformer);
_DebuggerStatementTransformer.prototype.getStatement$ = function () {
	return this._statement;
};


_DebuggerStatementTransformer.prototype._replaceControlStructuresWithGotos$ = function () {
	this._transformer._emit$LStatement$(this._statement);
};


function _Util$1() {
};

$__jsx_extend([_Util$1], Object);
function _Util$1$_createFreshArgumentDeclaration$LType$(type) {
	var id;
	id = _Util$1._numUniqVar++;
	return new ArgumentDeclaration(new Token$2("$a" + (id + ""), true), type);
};

_Util$1._createFreshArgumentDeclaration$LType$ = _Util$1$_createFreshArgumentDeclaration$LType$;

function _Util$1$_createFreshLocalVariable$LType$(type) {
	var id;
	id = _Util$1._numUniqVar++;
	return new LocalVariable(new Token$2("$a" + (id + ""), true), type, false);
};

_Util$1._createFreshLocalVariable$LType$ = _Util$1$_createFreshLocalVariable$LType$;

function _Util$1$_createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$(parent, token, args, returnType) {
	return _Util$1$_createNamedFunction$LMemberFunctionDefinition$LToken$LToken$ALArgumentDeclaration$LType$(parent, token, null, args, returnType);
};

_Util$1._createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$ = _Util$1$_createAnonymousFunction$LMemberFunctionDefinition$LToken$ALArgumentDeclaration$LType$;

function _Util$1$_createNamedFunction$LMemberFunctionDefinition$LToken$LToken$ALArgumentDeclaration$LType$(parent, token, nameToken, args, returnType) {
	var funcDef;
	if (token == null) {
		token = new Token$2("function", false);
	}
	funcDef = new MemberFunctionDefinition(token, nameToken, ClassDefinition.IS_STATIC, returnType, args, [  ], [  ], [  ], null, null);
	Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(funcDef, parent);
	return funcDef;
};

_Util$1._createNamedFunction$LMemberFunctionDefinition$LToken$LToken$ALArgumentDeclaration$LType$ = _Util$1$_createNamedFunction$LMemberFunctionDefinition$LToken$LToken$ALArgumentDeclaration$LType$;

function _Util$1$_createIdentityFunction$LMemberFunctionDefinition$LType$(parent, type) {
	var arg;
	var identity;
	arg = _Util$1$_createFreshArgumentDeclaration$LType$(type);
	identity = new MemberFunctionDefinition(new Token$2("function", false), null, ClassDefinition.IS_STATIC, type, [ arg ], [  ], [ new ReturnStatement(new Token$2("return", false), new LocalExpression(new Token$2(arg.getName$().getValue$(), true), arg)) ], [  ], null, null);
	Util$linkFunction$LMemberFunctionDefinition$LMemberFunctionDefinition$(identity, parent);
	return new FunctionExpression(identity.getToken$(), identity);
};

_Util$1._createIdentityFunction$LMemberFunctionDefinition$LType$ = _Util$1$_createIdentityFunction$LMemberFunctionDefinition$LType$;

function _Util$1$instantiateBuiltinTemplate$LCompiler$SALType$(compiler, name, typeArgs) {
	var createContext;
	var context;
	function createContext(parser) {
		return new AnalysisContext([  ], parser, (function (parser, classDef) {
			classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
			classDef.analyze$LAnalysisContext$(createContext(parser));
			return classDef;
		}));
	}
	context = createContext(compiler.getBuiltinParsers$()[0]);
	return Util$instantiateTemplate$LAnalysisContext$LToken$SALType$(context, null, name, typeArgs);
};

_Util$1.instantiateBuiltinTemplate$LCompiler$SALType$ = _Util$1$instantiateBuiltinTemplate$LCompiler$SALType$;

function TransformCommand(compiler, identifier) {
	this.errors = null;
	this._compiler = compiler;
	this._identifier = identifier;
};

$__jsx_extend([TransformCommand], Object);
TransformCommand.prototype.setup$ALCompileError$ = function (errors) {
	this.errors = errors;
};


TransformCommand.prototype.getCompiler$ = function () {
	return this._compiler;
};


function FunctionTransformCommand(compiler, identifier) {
	TransformCommand.call(this, compiler, identifier);
};

$__jsx_extend([FunctionTransformCommand], TransformCommand);
FunctionTransformCommand.prototype.performTransformation$ = function () {
	var $this = this;
	this._getAllClosures$().forEach((function (funcDef) {
		$this.transformFunction$LMemberFunctionDefinition$(funcDef);
	}));
};


FunctionTransformCommand.prototype._getAllClosures$ = function () {
	var $this = this;
	var closures;
	closures = [];
	this._compiler.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		return classDef.forEachMember$F$LMemberDefinition$B$((function onMember(member) {
			member.forEachClosure$F$LMemberFunctionDefinition$B$((function (funcDef) {
				return onMember(funcDef);
			}));
			if (member instanceof MemberFunctionDefinition) {
				closures.push(member);
			}
			return true;
		}));
	}));
	return closures;
};


function GeneratorTransformCommand(compiler) {
	FunctionTransformCommand.call(this, compiler, GeneratorTransformCommand.IDENTIFIER);
	this._jsxGeneratorObject = null;
};

$__jsx_extend([GeneratorTransformCommand], FunctionTransformCommand);
GeneratorTransformCommand.prototype.setup$ALCompileError$ = function (errors) {
	var builtins;
	var i;
	TransformCommand.prototype.setup$ALCompileError$.call(this, errors);
	builtins = this._compiler.getBuiltinParsers$()[0];
	for (i = 0; i < builtins._templateClassDefs.length; ++i) {
		if (builtins._templateClassDefs[i].className$() === "__jsx_generator_object") {
			this._jsxGeneratorObject = builtins._templateClassDefs[i];
			break;
		}
	}
};


GeneratorTransformCommand.prototype.transformFunction$LMemberFunctionDefinition$ = function (funcDef) {
	if (! funcDef.isGenerator$()) {
		return;
	}
	this._transformGeneratorCore$LMemberFunctionDefinition$(funcDef);
	funcDef.setFlags$N(funcDef.flags$() & ~ ClassDefinition.IS_GENERATOR);
};


GeneratorTransformCommand.prototype._performANFTransformation$LMemberFunctionDefinition$ = function (funcDef) {
	var anfTransformer;
	anfTransformer = new ANFTransformCommand(this._compiler);
	anfTransformer.setup$ALCompileError$([  ]);
	anfTransformer.transformFunction$LMemberFunctionDefinition$(funcDef);
};


GeneratorTransformCommand.prototype._transformGeneratorCore$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var generatorClassDef;
	var seedType;
	var genType;
	var jsxGenType;
	var jsxGenLocal;
	var statements;
	var caseCnt;
	var i;
	var exprStmt;
	var assignExpr;
	var yieldExpr;
	var caseLabel;
	var newExpr;
	generatorClassDef = funcDef.getReturnType$().getClassDef$();
	seedType = null;
	genType = null;
	if (generatorClassDef.getTypeArguments$().length === 2) {
		seedType = generatorClassDef.getTypeArguments$()[0];
		genType = generatorClassDef.getTypeArguments$()[1];
	} else {
		throw new Error("logic flaw!");
	}
	jsxGenType = this._instantiateJSXGeneratorType$LType$LType$(seedType, genType);
	jsxGenLocal = new LocalVariable(new Token$2("$generator", false), jsxGenType, false);
	funcDef.getLocals$().push(jsxGenLocal);
	this._performANFTransformation$LMemberFunctionDefinition$(funcDef);
	statements = CPSTransformCommand$_extractVMDispatchBody$LMemberFunctionDefinition$(funcDef);
	caseCnt = 0;
	statements.forEach((function (statement) {
		if (statement instanceof CaseStatement) {
			caseCnt++;
		}
	}));
	for (i = 0; i < statements.length; ++i) {
		if (statements[i] instanceof ExpressionStatement && (exprStmt = statements[i]).getExpr$() instanceof AssignmentExpression && (assignExpr = exprStmt.getExpr$()).getSecondExpr$() instanceof YieldExpression) {
			yieldExpr = assignExpr.getSecondExpr$();
			caseLabel = caseCnt++;
			statements.splice(i, 1, new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__value", false), [  ], genType.toNullableType$()), yieldExpr.getExpr$())), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__next", true), [  ], Type.integerType.toNullableType$()), new IntegerLiteralExpression(new Token$2("" + (caseLabel + ""), false)))), new ReturnStatement(new Token$2("return", false), null), new CaseStatement(new Token$2("case", false), new IntegerLiteralExpression(new Token$2("" + (caseLabel + ""), false))), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), assignExpr.getFirstExpr$(), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__seed", true), [  ], seedType.toNullableType$()))));
			i += 4;
		} else if (statements[i] instanceof ReturnStatement) {
			statements.splice(i, 0, new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__value", false), [  ], genType.toNullableType$()), new LocalExpression(new Token$2("$return", true), CPSTransformCommand$_extractReturnLocal$LMemberFunctionDefinition$(funcDef)))), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__next", true), [  ], Type.integerType.toNullableType$()), new IntegerLiteralExpression(new Token$2("-1", false)))));
			i += 2;
		}
	}
	newExpr = new NewExpression(new Token$2("new", false), jsxGenType, [  ]);
	newExpr.analyze$LAnalysisContext$LExpression$(new AnalysisContext([  ], null, null), null);
	funcDef.getStatements$().unshift(new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), newExpr)));
	statements = funcDef.getStatements$();
	statements.splice(statements.length - 2, 2, new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__next", true), [  ], Type.integerType.toNullableType$()), new IntegerLiteralExpression(new Token$2("0", false)))), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal), new Token$2("__loop", true), [  ], new StaticFunctionType(null, Type.voidType, [ Type.integerType ], true)), new LocalExpression(new Token$2("$loop", true), CPSTransformCommand$_extractLoopLocal$LMemberFunctionDefinition$(funcDef)))));
	statements.push(new ReturnStatement(new Token$2("return", false), new LocalExpression(new Token$2("$generator", false), jsxGenLocal)));
};


GeneratorTransformCommand.prototype._instantiateJSXGeneratorType$LType$LType$ = function (seedType, genType) {
	var $this = this;
	var genClassDef;
	var createContext;
	var parser;
	genClassDef = this._jsxGeneratorObject.getParser$().lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$([  ], new TemplateInstantiationRequest(null, "__jsx_generator_object", [ seedType, genType ]), (function (parser, classDef) {
		return null;
	}));
	createContext = (function (parser) {
		return new AnalysisContext([  ], parser, (function (parser, classDef) {
			classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
			classDef.analyze$LAnalysisContext$(createContext(parser));
			return classDef;
		}));
	});
	parser = this._jsxGeneratorObject.getParser$();
	genClassDef.resolveTypes$LAnalysisContext$(createContext(parser));
	genClassDef.analyze$LAnalysisContext$(createContext(parser));
	return new ObjectType(genClassDef);
};


function ANFTransformCommand(compiler) {
	FunctionTransformCommand.call(this, compiler, ANFTransformCommand.IDENTIFIER);
	this._vm = null;
};

$__jsx_extend([ANFTransformCommand], FunctionTransformCommand);
ANFTransformCommand.prototype._performCPSTransformation$LMemberFunctionDefinition$ = function (funcDef) {
	var cpsTransformer;
	cpsTransformer = new CPSTransformCommand(this._compiler);
	cpsTransformer.setup$ALCompileError$([  ]);
	cpsTransformer.setTransformYield$B(true);
	cpsTransformer.setTransformExprs$B(true);
	cpsTransformer.transformFunction$LMemberFunctionDefinition$(funcDef);
};


ANFTransformCommand.prototype.transformFunction$LMemberFunctionDefinition$ = function (funcDef) {
	this._performCPSTransformation$LMemberFunctionDefinition$(funcDef);
	this._vm = CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(funcDef);
	try {
		this._unfoldExpressions$ALStatement$(CPSTransformCommand$_extractVMDispatchBody$LMemberFunctionDefinition$(funcDef));
	} finally {
		this._vm = null;
	}
};


ANFTransformCommand.prototype._unfoldExpressions$ALStatement$ = function (statements) {
	var $this = this;
	var i;
	var assignExprs;
	var j;
	for (i = 0; i < statements.length; ++i) {
		assignExprs = [];
		Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
			return statement.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
				if (! (expr instanceof CallExpression)) {
					return true;
				}
				if (! (expr.getExpr$() instanceof FunctionExpression)) {
					return true;
				}
				replaceCb($this._unfoldExpr$LExpression$ALAssignmentExpression$(expr, assignExprs));
				return true;
			})) && statement.forEachStatement$F$LStatement$B$(onStatement);
		}), [ statements[i] ]);
		for (j = assignExprs.length - 1; j >= 0; --j) {
			statements.splice(i, 0, new ExpressionStatement(assignExprs[j]));
		}
		i += assignExprs.length;
	}
};


ANFTransformCommand.prototype._unfoldExpr$LExpression$ALAssignmentExpression$ = function (expr, assignExprs) {
	var $this = this;
	var callExpr;
	var funcExpr;
	var argVar;
	var localVar;
	var retStmt;
	if (expr instanceof CallExpression) {
		callExpr = expr;
		funcExpr = callExpr.getExpr$();
		argVar = funcExpr.getFuncDef$().getArguments$()[0];
		localVar = new LocalVariable(argVar.getName$(), argVar.getType$(), false);
		this._vm.getLocals$().push(localVar);
		assignExprs.push(new AssignmentExpression(new Token$2("=", false), new LocalExpression(localVar.getName$(), localVar), callExpr.getArguments$()[0]));
		funcExpr.getFuncDef$().forEachStatement$F$LStatement$B$((function onStmt(stmt) {
			return stmt.forEachExpression$F$LExpression$B$((function onExpr(expr) {
				var local;
				if (expr instanceof LocalExpression) {
					local = expr.getLocal$();
					if (local == argVar) {
						expr.setLocal$LLocalVariable$(localVar);
					}
				}
				if (expr instanceof FunctionExpression) {
					expr.getFuncDef$().forEachStatement$F$LStatement$B$(onStmt);
				}
				return expr.forEachExpression$F$LExpression$B$(onExpr);
			})) && stmt.forEachStatement$F$LStatement$B$(onStmt);
		}));
		retStmt = funcExpr.getFuncDef$().getStatements$()[0];
		return this._unfoldExpr$LExpression$ALAssignmentExpression$(retStmt.getExpr$(), assignExprs);
	} else if (expr instanceof LocalExpression) {
		return expr;
	} else {
		throw new Error('logic flaw!');
	}
};


function CPSTransformCommand(compiler) {
	FunctionTransformCommand.call(this, compiler, CPSTransformCommand.IDENTIFIER);
	this._outputStatements = null;
	this._labelStack = [];
	this._funcDefs = [];
	this._transformYield = false;
	this._transformExprs = false;
};

$__jsx_extend([CPSTransformCommand], FunctionTransformCommand);
CPSTransformCommand.prototype.setTransformYield$B = function (flag) {
	this._transformYield = flag;
};


CPSTransformCommand.prototype.setTransformExprs$B = function (flag) {
	this._transformExprs = flag;
};


CPSTransformCommand.prototype._functionIsTransformable$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	if (funcDef instanceof TemplateFunctionDefinition) {
		return false;
	}
	if (funcDef.getStatements$() == null) {
		return false;
	}
	if (funcDef.getNameToken$() != null && funcDef.name$() === "constructor") {
		return false;
	}
	return funcDef.forEachStatement$F$LStatement$B$((function onStatement(statement) {
		return statement.forEachExpression$F$LExpression$B$((function onExpr(expr) {
			if (! $this._transformYield && expr instanceof YieldExpression) {
				return false;
			}
			return expr.forEachExpression$F$LExpression$B$(onExpr);
		})) && statement.forEachStatement$F$LStatement$B$(onStatement);
	}));
};


CPSTransformCommand.prototype.transformFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var cmd;
	if (! this._functionIsTransformable$LMemberFunctionDefinition$(funcDef)) {
		return;
	}
	cmd = new NormalizeTryStatementTransformCommand(this._compiler);
	cmd.setup$ALCompileError$([  ]);
	cmd.transformFunction$LMemberFunctionDefinition$(funcDef);
	cmd = new ForInStatementTransformCommand(this._compiler);
	cmd.setup$ALCompileError$([  ]);
	cmd.transformFunction$LMemberFunctionDefinition$(funcDef);
	this._doCPSTransform$LMemberFunctionDefinition$(funcDef);
};


CPSTransformCommand.prototype._doCPSTransform$LMemberFunctionDefinition$ = function (funcDef) {
	this._createAndSetVMReady$LMemberFunctionDefinition$(funcDef);
	this._replaceControlStructuresWithGotos$LMemberFunctionDefinition$(funcDef);
	this._eliminateDeadBranches$LMemberFunctionDefinition$(funcDef);
	this._resolveLabels$LMemberFunctionDefinition$(funcDef);
	this._convertPseudoInstructions$LMemberFunctionDefinition$(funcDef);
	this._eliminateGotos$LMemberFunctionDefinition$(funcDef);
};


CPSTransformCommand.prototype._createAndSetVMReady$LMemberFunctionDefinition$ = function (funcDef) {
	var loopVar;
	var vm;
	var localJumpsVar;
	loopVar = new LocalVariable(new Token$2("$loop", true), new StaticFunctionType(null, Type.voidType, [ Type.integerType ], true), false);
	funcDef.getLocals$().push(loopVar);
	vm = _Util$1$_createNamedFunction$LMemberFunctionDefinition$LToken$LToken$ALArgumentDeclaration$LType$(funcDef, null, new Token$2("$loop", true), [ new ArgumentDeclaration(new Token$2("$next", true), Type.integerType) ], Type.voidType);
	vm.setFuncLocal$LLocalVariable$(loopVar);
	localJumpsVar = new LocalVariable(new Token$2("$localJumps", true), this._instantiateArrayType$LType$(Type.integerType), false);
	funcDef.getLocals$().push(localJumpsVar);
	vm._statements = funcDef.getStatements$();
	Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(funcDef, vm);
	funcDef._statements = [ new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new ArrayLiteralExpression(new Token$2("[", false), [  ], this._instantiateArrayType$LType$(Type.integerType)))), new FunctionStatement(new Token$2("function", false), vm), new ExpressionStatement(new CallExpression(new Token$2("(", false), new LocalExpression(new Token$2("$loop", true), loopVar), [ new IntegerLiteralExpression(new Token$2("0", false)) ])) ];
};


CPSTransformCommand.prototype._replaceControlStructuresWithGotos$LMemberFunctionDefinition$ = function (funcDef) {
	var inStatements;
	var outStatements;
	var i;
	this._enterFunction$LMemberFunctionDefinition$(funcDef);
	try {
		inStatements = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef);
		outStatements = [];
		this._setOutputStatements$ALStatement$(outStatements);
		for (i = 0; i < inStatements.length; ++i) {
			this._getStatementTransformerFor$LStatement$(inStatements[i]).replaceControlStructuresWithGotos$();
		}
		outStatements.unshift(new LabelStatement("$L_enter"));
		outStatements.push(new GotoStatement("$L_exit"), new LabelStatement("$L_exit"), new ReturnStatement(new Token$2("return", false), null));
		CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(funcDef)._statements = outStatements;
	} finally {
		this._leaveFunction$();
	}
};


CPSTransformCommand.prototype._eliminateDeadBranches$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var statements;
	var isPseudoStatement;
	var i;
	var j;
	var srcLabel;
	var destLabel;
	var labelRenames;
	var labels;
	var fusedLabel;
	statements = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef);
	function isPseudoStatement(statement) {
		return statement instanceof GotoStatement && statement.getLabel$().search(/\$__/) !== - 1;
	}
	for (i = 0; i < statements.length; ++i) {
		if (isPseudoStatement(statements[i])) {
			switch (statements[i].getLabel$()) {
			case "$__push_local_jump__":
				i += 1;
				break;
			}
		} else if (statements[i] instanceof GotoStatement) {
			for (j = i; j < statements.length; ++j) {
				if (statements[j] instanceof LabelStatement) {
					break;
				}
			}
			statements.splice(i + 1, j - i - 1);
		}
	}
	for (i = 0; i < statements.length - 1; ++i) {
		if (statements[i] instanceof LabelStatement && statements[i + 1] instanceof GotoStatement && ! isPseudoStatement(statements[i + 1])) {
			srcLabel = statements[i];
			destLabel = statements[i + 1].getLabel$();
			statements.splice(i, 2);
			for (j = 0; j < statements.length; ++j) {
				if (statements[j] instanceof LabelStatement && statements[j].getName$() === destLabel) {
					break;
				}
			}
			if (j === statements.length) {
				throw new Error("logic flaw");
			}
			statements.splice(j, 0, srcLabel);
			if (i <= j) {
				i--;
			}
		}
	}
	labelRenames = {};
	for (i = 0; i < statements.length; ++i) {
		if (statements[i] instanceof LabelStatement) {
			labels = [];
			for (j = i; statements[j] instanceof LabelStatement; ++j) {
				labels.push(statements[j]);
			}
			fusedLabel = labels.reduce((function (fuse, label) {
				if (fuse !== "") {
					fuse += "_";
				}
				return fuse + label.getName$();
			}), "");
			labels.forEach((function (label) {
				labelRenames[label.getName$()] = fusedLabel;
			}));
			statements.splice(i, labels.length, new LabelStatement(fusedLabel));
		}
	}
	Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
		var gotoStmt;
		if (statement instanceof GotoStatement && ! isPseudoStatement(statement)) {
			gotoStmt = statement;
			gotoStmt.setLabel$S(labelRenames[gotoStmt.getLabel$()]);
		}
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}), statements);
};


CPSTransformCommand.prototype._resolveLabels$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var statements;
	var labelIDs;
	var i;
	var c;
	var labelStmt;
	statements = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef);
	labelIDs = {};
	for ((i = 0, c = 0); i < statements.length; ++i) {
		if (statements[i] instanceof LabelStatement) {
			labelStmt = statements[i];
			labelStmt.setID$I((c | 0));
			labelIDs[labelStmt.getName$()] = (c | 0);
			c++;
		}
	}
	Util$forEachStatement$F$LStatement$B$ALStatement$((function onStatement(statement) {
		var gotoStmt;
		var label;
		if (statement instanceof GotoStatement) {
			gotoStmt = statement;
			if (gotoStmt.getLabel$().search(/^\$__/) !== - 1) {
				return true;
			}
			label = gotoStmt.getLabel$();
			if (! (label in labelIDs)) {
				throw new Error("logic flaw! label not found: " + label);
			}
			gotoStmt.setID$I(labelIDs[label]);
		}
		return statement.forEachStatement$F$LStatement$B$(onStatement);
	}), statements);
};


CPSTransformCommand.prototype._convertPseudoInstructions$LMemberFunctionDefinition$ = function (funcDef) {
	var statements;
	var localJumpsVar;
	var raisedVar;
	var i;
	var gotoStmt;
	var gotoBeginFinally;
	statements = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef);
	localJumpsVar = CPSTransformCommand$_extractLocalJumpsLocal$LMemberFunctionDefinition$(funcDef);
	raisedVar = CPSTransformCommand$_extractRaisedLocal$LMemberFunctionDefinition$(funcDef);
	for (i = 0; i < statements.length; ++i) {
		if (statements[i] instanceof GotoStatement && statements[i].getLabel$().search(/^\$__/) !== - 1) {
			gotoStmt = statements[i];
			switch (gotoStmt.getLabel$()) {
			case '$__push_local_jump__':
				gotoBeginFinally = statements[i + 1];
				statements.splice(i, 2, new ExpressionStatement(new CallExpression(new Token$2("(", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new Token$2("push", true), [  ], new MemberFunctionType(null, localJumpsVar.getType$(), Type.integerType, [ new VariableLengthArgumentType(Type.integerType.toNullableType$()) ], false)), [ new IntegerLiteralExpression(new Token$2("" + (gotoBeginFinally.getID$() + ""), false)) ])));
				break;
			case '$__pop_local_jump__':
				statements.splice(i, 1, new ExpressionStatement(new CallExpression(new Token$2("(", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new Token$2("pop", true), [  ], new MemberFunctionType(null, localJumpsVar.getType$(), Type.integerType.toNullableType$(), [  ], false)), [  ])));
				break;
			default:
				throw new Error('got unknown pseudo-instruction');
			}
		}
	}
};


CPSTransformCommand.prototype._eliminateGotos$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var statements;
	var nextVar;
	var localJumpsVar;
	var raisedVar;
	var errorVar;
	var replaceGoto;
	var i;
	var stmt;
	var ifStmt;
	var replaceBasicBlock;
	var index;
	var eVar;
	var switchStmt;
	var inferiorWhileStmt;
	var tryStmt;
	var superiorWhileStmt;
	statements = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef);
	nextVar = CPSTransformCommand$_extractNextLocal$LMemberFunctionDefinition$(funcDef);
	localJumpsVar = CPSTransformCommand$_extractLocalJumpsLocal$LMemberFunctionDefinition$(funcDef);
	raisedVar = CPSTransformCommand$_extractRaisedLocal$LMemberFunctionDefinition$(funcDef);
	errorVar = CPSTransformCommand$_extractErrorLocal$LMemberFunctionDefinition$(funcDef);
	function replaceGoto(statements, index) {
		var gotoStmt;
		gotoStmt = statements[index];
		statements.splice(index, 1, new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$next", true), nextVar), new IntegerLiteralExpression(new Token$2("" + (gotoStmt.getID$() + ""), false)))), new BreakStatement(new Token$2("break", false), null));
		return (index + 1 | 0);
	}
	for (i = 0; i < statements.length; ++i) {
		stmt = statements[i];
		if (stmt instanceof GotoStatement) {
			i = replaceGoto(statements, (i | 0));
		} else if (stmt instanceof IfStatement) {
			ifStmt = stmt;
			replaceGoto(ifStmt.getOnTrueStatements$(), 0);
			replaceGoto(ifStmt.getOnFalseStatements$(), 0);
		}
	}
	function replaceBasicBlock(statements, index, end) {
		var labelStmt;
		labelStmt = statements[index];
		statements.splice(index, 1, new CaseStatement(new Token$2("case", false), new IntegerLiteralExpression(new Token$2("" + (labelStmt.getID$() + ""), false))));
		return end;
	}
	for (i = 0; i < statements.length; ) {
		index = i;
		for (i += 1; i < statements.length; ++i) {
			if (statements[i] instanceof LabelStatement) {
				break;
			}
		}
		i = replaceBasicBlock(statements, (index | 0), (i | 0));
	}
	eVar = new CaughtVariable(new Token$2("$e", true), Type.variantType);
	switchStmt = new SwitchStatement(new Token$2("switch", false), null, new LocalExpression(new Token$2("$next", true), nextVar), statements);
	inferiorWhileStmt = new WhileStatement(new Token$2("while", false), null, new BooleanLiteralExpression(new Token$2("true", false)), [ switchStmt ]);
	tryStmt = new TryStatement(new Token$2("try", false), [ inferiorWhileStmt ], [ new CatchStatement(new Token$2("catch", false), eVar, [ new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$raised", true), raisedVar), new BooleanLiteralExpression(new Token$2("true", false)))), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$error", true), errorVar), new LocalExpression(new Token$2("$e", true), eVar))), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(new Token$2("$next", true), nextVar), new ArrayExpression$0(new Token$2("[", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new BinaryNumberExpression(new Token$2("-", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new Token$2("length", true), [  ], Type.numberType), new IntegerLiteralExpression(new Token$2("1", false))), Type.integerType))) ]) ], [ new IfStatement(new Token$2("if", false), new LogicalExpression(new Token$2("&&", false), new EqualityExpression(new Token$2("==", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(new Token$2("$localJumps", true), localJumpsVar), new Token$2("length", true), [  ], Type.numberType), new IntegerLiteralExpression(new Token$2("0", false))), new LocalExpression(new Token$2("$raised", true), raisedVar)), [ new ThrowStatement(new Token$2("throw", false), new LocalExpression(new Token$2("$error", true), errorVar)) ], [  ]) ]);
	superiorWhileStmt = new WhileStatement(new Token$2("while", false), null, new BooleanLiteralExpression(new Token$2("true", false)), [ tryStmt ]);
	CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(funcDef)._statements = [ superiorWhileStmt ];
};


CPSTransformCommand.prototype._instantiateArrayType$LType$ = function (type) {
	var $this = this;
	var arrayClass;
	var builtins;
	var i;
	var arrayClassDef;
	var createContext;
	var parser;
	arrayClass = null;
	builtins = this._compiler.getBuiltinParsers$()[0];
	for (i = 0; i < builtins._templateClassDefs.length; ++i) {
		if (builtins._templateClassDefs[i].className$() === "Array") {
			arrayClass = builtins._templateClassDefs[i];
			break;
		}
	}
	if (arrayClass == null) {
		throw new Error("logic flaw");
	}
	arrayClassDef = arrayClass.getParser$().lookupTemplate$ALCompileError$LTemplateInstantiationRequest$F$LParser$LClassDefinition$LClassDefinition$$([  ], new TemplateInstantiationRequest(null, "Array", [ type ]), (function (parser, classDef) {
		return null;
	}));
	if (arrayClassDef == null) {
		throw new Error("logic flaw");
	}
	createContext = (function (parser) {
		return new AnalysisContext([  ], parser, (function (parser, classDef) {
			classDef.setAnalysisContextOfVariables$LAnalysisContext$(createContext(parser));
			classDef.analyze$LAnalysisContext$(createContext(parser));
			return classDef;
		}));
	});
	parser = arrayClass.getParser$();
	arrayClassDef.resolveTypes$LAnalysisContext$(createContext(parser));
	arrayClassDef.analyze$LAnalysisContext$(createContext(parser));
	return new ObjectType(arrayClassDef);
};


CPSTransformCommand.prototype._setOutputStatements$ALStatement$ = function (statements) {
	this._outputStatements = statements;
};


CPSTransformCommand.prototype._getOutputStatements$ = function () {
	return this._outputStatements;
};


CPSTransformCommand.prototype._emit$LStatement$ = function (statement) {
	this._outputStatements.push(statement);
};


CPSTransformCommand.prototype._emitLabelStatement$S = function (label) {
	this._emit$LStatement$(new LabelStatement(label));
};


CPSTransformCommand.prototype._emitGotoStatement$S = function (label) {
	this._emit$LStatement$(new GotoStatement(label));
};


CPSTransformCommand.prototype._emitExpressionStatement$LExpression$ = function (expr) {
	this._emit$LStatement$(new ExpressionStatement(expr));
};


CPSTransformCommand.prototype._emitConditionalBranch$LExpression$SS = function (expr, succLabel, failLabel) {
	this._emit$LStatement$(new IfStatement(new Token$2("if", false), expr, [ new GotoStatement(succLabel) ], [ new GotoStatement(failLabel) ]));
};


CPSTransformCommand.prototype._getStatementTransformerByLabel$S = function (label) {
	var i;
	var trans;
	for (i = 0; this._labelStack.length; ++i) {
		trans = this._labelStack[i];
		if (trans.getStatement$().getLabel$().getValue$() === label) {
			return trans;
		}
	}
	throw new Error("fatal error: no corresponding transformer for label \"" + label + "\"");
};


CPSTransformCommand.prototype._getTopLabelledBlock$ = function () {
	return this._labelStack[this._labelStack.length - 1];
};


CPSTransformCommand.prototype._enterLabelledBlock$L_LabellableStatementTransformer$ = function (transformer) {
	this._labelStack.push(transformer);
};


CPSTransformCommand.prototype._leaveLabelledBlock$ = function () {
	this._labelStack.pop();
};


CPSTransformCommand.prototype._enterFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var returnLocal;
	var raisedVar;
	var errorVar;
	this._funcDefs.push(funcDef);
	if (! Type.voidType.equals$LType$(funcDef.getReturnType$())) {
		returnLocal = new LocalVariable(new Token$2("$return", true), funcDef.getReturnType$(), false);
		funcDef.getLocals$().push(returnLocal);
	}
	raisedVar = new LocalVariable(new Token$2("$raised", true), Type.booleanType, false);
	funcDef.getLocals$().push(raisedVar);
	errorVar = new LocalVariable(new Token$2("$error", true), Type.variantType, false);
	funcDef.getLocals$().push(errorVar);
};


CPSTransformCommand.prototype._leaveFunction$ = function () {
	var funcDef;
	var returnLocal;
	funcDef = this._funcDefs.pop();
	returnLocal = CPSTransformCommand$_extractReturnLocal$LMemberFunctionDefinition$(funcDef);
	if (! Type.voidType.equals$LType$(funcDef.getReturnType$())) {
		funcDef.getStatements$().push(new ReturnStatement(new Token$2("return", false), new LocalExpression(returnLocal.getName$(), returnLocal)));
	}
};


CPSTransformCommand.prototype._getTransformingFuncDef$ = function () {
	return this._funcDefs[this._funcDefs.length - 1];
};


CPSTransformCommand.prototype._getStatementTransformerFor$LStatement$ = function (statement) {
	if (statement instanceof ConstructorInvocationStatement) {
		return new _ConstructorInvocationStatementTransformer(this, statement);
	} else if (statement instanceof ExpressionStatement) {
		return new _ExpressionStatementTransformer(this, statement);
	} else if (statement instanceof FunctionStatement) {
		return new _FunctionStatementTransformer(this, statement);
	} else if (statement instanceof ReturnStatement) {
		return new _ReturnStatementTransformer(this, statement);
	} else if (statement instanceof DeleteStatement) {
		return new _DeleteStatementTransformer(this, statement);
	} else if (statement instanceof BreakStatement) {
		return new _BreakStatementTransformer(this, statement);
	} else if (statement instanceof ContinueStatement) {
		return new _ContinueStatementTransformer(this, statement);
	} else if (statement instanceof DoWhileStatement) {
		return new _DoWhileStatementTransformer(this, statement);
	} else if (statement instanceof ForInStatement) {
		return new _ForInStatementTransformer(this, statement);
	} else if (statement instanceof ForStatement) {
		return new _ForStatementTransformer(this, statement);
	} else if (statement instanceof IfStatement) {
		return new _IfStatementTransformer(this, statement);
	} else if (statement instanceof SwitchStatement) {
		return new _SwitchStatementTransformer(this, statement);
	} else if (statement instanceof CaseStatement) {
		return new _CaseStatementTransformer(this, statement);
	} else if (statement instanceof DefaultStatement) {
		return new _DefaultStatementTransformer(this, statement);
	} else if (statement instanceof WhileStatement) {
		return new _WhileStatementTransformer(this, statement);
	} else if (statement instanceof TryStatement) {
		return new _TryStatementTransformer(this, statement);
	} else if (statement instanceof CatchStatement) {
		return new _CatchStatementTransformer(this, statement);
	} else if (statement instanceof ThrowStatement) {
		return new _ThrowStatementTransformer(this, statement);
	} else if (statement instanceof AssertStatement) {
		return new _AssertStatementTransformer(this, statement);
	} else if (statement instanceof LogStatement) {
		return new _LogStatementTransformer(this, statement);
	} else if (statement instanceof DebuggerStatement) {
		return new _DebuggerStatementTransformer(this, statement);
	}
	throw new Error("got unexpected type of statement: " + JSON.stringify(statement.serialize$()));
};


CPSTransformCommand.prototype._getExpressionTransformerFor$LExpression$ = function (expr) {
	if (expr instanceof LocalExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof ClassExpression) {
		throw new Error("logic flaw");
	} else if (expr instanceof NullExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof BooleanLiteralExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof IntegerLiteralExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof NumberLiteralExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof StringLiteralExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof RegExpLiteralExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof ArrayLiteralExpression) {
		return new _ArrayLiteralExpressionTransformer(this, expr);
	} else if (expr instanceof MapLiteralExpression) {
		return new _MapLiteralExpressionTransformer(this, expr);
	} else if (expr instanceof ThisExpression) {
		return new _LeafExpressionTransformer(this, expr);
	} else if (expr instanceof BitwiseNotExpression) {
		return new _BitwiseNotExpressionTransformer(this, expr);
	} else if (expr instanceof InstanceofExpression) {
		return new _InstanceofExpressionTransformer(this, expr);
	} else if (expr instanceof AsExpression) {
		return new _AsExpressionTransformer(this, expr);
	} else if (expr instanceof AsNoConvertExpression) {
		return new _AsNoConvertExpressionTransformer(this, expr);
	} else if (expr instanceof LogicalNotExpression) {
		return new _LogicalNotExpressionTransformer(this, expr);
	} else if (expr instanceof TypeofExpression) {
		return new _TypeofExpressionTransformer(this, expr);
	} else if (expr instanceof PostIncrementExpression) {
		return new _PostIncrementExpressionTransformer(this, expr);
	} else if (expr instanceof PreIncrementExpression) {
		return new _PreIncrementExpressionTransformer(this, expr);
	} else if (expr instanceof PropertyExpression) {
		return new _PropertyExpressionTransformer(this, expr);
	} else if (expr instanceof SignExpression) {
		return new _SignExpressionTransformer(this, expr);
	} else if (expr instanceof YieldExpression) {
		return new _YieldExpressionTransformer(this, expr);
	} else if (expr instanceof AdditiveExpression) {
		return new _AdditiveExpressionTransformer(this, expr);
	} else if (expr instanceof ArrayExpression) {
		return new _ArrayExpressionTransformer(this, expr);
	} else if (expr instanceof AssignmentExpression) {
		return new _AssignmentExpressionTransformer(this, expr);
	} else if (expr instanceof FusedAssignmentExpression) {
		return new _FusedAssignmentExpressionTransformer(this, expr);
	} else if (expr instanceof BinaryNumberExpression) {
		return new _BinaryNumberExpressionTransformer(this, expr);
	} else if (expr instanceof EqualityExpression) {
		return new _EqualityExpressionTransformer(this, expr);
	} else if (expr instanceof InExpression) {
		return new _InExpressionTransformer(this, expr);
	} else if (expr instanceof LogicalExpression) {
		return new _LogicalExpressionTransformer(this, expr);
	} else if (expr instanceof ShiftExpression) {
		return new _ShiftExpressionTransformer(this, expr);
	} else if (expr instanceof ConditionalExpression) {
		return new _ConditionalExpressionTransformer(this, expr);
	} else if (expr instanceof CallExpression) {
		return new _CallExpressionTransformer(this, expr);
	} else if (expr instanceof SuperExpression) {
		return new _SuperExpressionTransformer(this, expr);
	} else if (expr instanceof NewExpression) {
		return new _NewExpressionTransformer(this, expr);
	} else if (expr instanceof FunctionExpression) {
		return new _FunctionExpressionTransformer(this, expr);
	} else if (expr instanceof CommaExpression) {
		return new _CommaExpressionTransformer(this, expr);
	}
	throw new Error("got unexpected type of expression: " + (expr != null ? JSON.stringify(expr.serialize$()) : expr.toString()));
};


function CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(funcDef) {
	var funcStmt;
	funcStmt = funcDef.getStatements$()[1];
	return funcStmt.getFuncDef$();
};

CPSTransformCommand._extractVM$LMemberFunctionDefinition$ = CPSTransformCommand$_extractVM$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$(funcDef) {
	var funcStmt;
	funcStmt = funcDef.getStatements$()[1];
	return funcStmt.getFuncDef$().getStatements$();
};

CPSTransformCommand._extractVMBody$LMemberFunctionDefinition$ = CPSTransformCommand$_extractVMBody$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractVMDispatchBody$LMemberFunctionDefinition$(funcDef) {
	var funcStmt;
	var superiorWhileStmt;
	var tryStmt;
	var inferiorWhileStmt;
	var switchStmt;
	funcStmt = funcDef.getStatements$()[1];
	superiorWhileStmt = funcStmt.getFuncDef$().getStatements$()[0];
	tryStmt = superiorWhileStmt.getStatements$()[0];
	inferiorWhileStmt = tryStmt.getTryStatements$()[0];
	switchStmt = inferiorWhileStmt.getStatements$()[0];
	return switchStmt.getStatements$();
};

CPSTransformCommand._extractVMDispatchBody$LMemberFunctionDefinition$ = CPSTransformCommand$_extractVMDispatchBody$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, name) {
	var locals;
	var i;
	locals = funcDef.getLocals$();
	for (i = 0; i < locals.length; ++i) {
		if (locals[i].getName$().getValue$() === name) {
			return locals[i];
		}
	}
	return null;
};

CPSTransformCommand._extractLocal$LMemberFunctionDefinition$S = CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S;

function CPSTransformCommand$_extractReturnLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, "$return");
};

CPSTransformCommand._extractReturnLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractReturnLocal$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractNextLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractVM$LMemberFunctionDefinition$(funcDef).getArguments$()[0];
};

CPSTransformCommand._extractNextLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractNextLocal$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractLoopLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, "$loop");
};

CPSTransformCommand._extractLoopLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractLoopLocal$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractLocalJumpsLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, "$localJumps");
};

CPSTransformCommand._extractLocalJumpsLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractLocalJumpsLocal$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractRaisedLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, "$raised");
};

CPSTransformCommand._extractRaisedLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractRaisedLocal$LMemberFunctionDefinition$;

function CPSTransformCommand$_extractErrorLocal$LMemberFunctionDefinition$(funcDef) {
	return CPSTransformCommand$_extractLocal$LMemberFunctionDefinition$S(funcDef, "$error");
};

CPSTransformCommand._extractErrorLocal$LMemberFunctionDefinition$ = CPSTransformCommand$_extractErrorLocal$LMemberFunctionDefinition$;

function ExpressionTransformCommand(compiler, identifier) {
	TransformCommand.call(this, compiler, identifier);
};

$__jsx_extend([ExpressionTransformCommand], TransformCommand);
ExpressionTransformCommand.prototype.performTransformation$ = function () {
	var $this = this;
	var touchMemberFunction;
	var touchMemberVariable;
	function touchMemberFunction(member) {
		member.forEachStatement$F$LStatement$B$((function (stmt) {
			return $this.touchStatement$LStatement$(stmt);
		}));
	}
	function touchMemberVariable(member) {
		var expr;
		expr = member.getInitialValue$();
		if (expr != null) {
			$this.touchExpression$LExpression$F$LExpression$V$(expr, (function (expr) {
				return member.setInitialValue$LExpression$(expr);
			}));
		}
	}
	this._compiler.forEachClassDef$F$LParser$LClassDefinition$B$((function (parser, classDef) {
		if (! (classDef instanceof TemplateClassDefinition)) {
			classDef.forEachMember$F$LMemberDefinition$B$((function (member) {
				if (! (classDef instanceof TemplateFunctionDefinition)) {
					if (member instanceof MemberFunctionDefinition) {
						touchMemberFunction(member);
					} else {
						if (! (member instanceof MemberVariableDefinition)) {
							debugger;
							throw new Error("[src/transformer.jsx:191:42] assertion failure\n                            assert member instanceof MemberVariableDefinition;\n                                          ^^^^^^^^^^\n");
						}
						touchMemberVariable(member);
					}
				}
				return true;
			}));
		}
		return true;
	}));
};


ExpressionTransformCommand.prototype.touchStatement$LStatement$ = function (stmt) {
	var $this = this;
	if (stmt instanceof FunctionStatement) {
		stmt.getFuncDef$().forEachStatement$F$LStatement$B$((function (stmt) {
			return $this.touchStatement$LStatement$(stmt);
		}));
	}
	stmt.forEachStatement$F$LStatement$B$((function (stmt) {
		return $this.touchStatement$LStatement$(stmt);
	}));
	stmt.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
		return $this.touchExpression$LExpression$F$LExpression$V$(expr, replaceCb);
	}));
	return true;
};


ExpressionTransformCommand.prototype.touchExpression$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var $this = this;
	if (expr instanceof FunctionExpression) {
		expr.getFuncDef$().forEachStatement$F$LStatement$B$((function (stmt) {
			return $this.touchStatement$LStatement$(stmt);
		}));
	}
	expr.forEachExpression$F$LExpression$F$LExpression$V$B$((function (expr, replaceCb) {
		return $this.touchExpression$LExpression$F$LExpression$V$(expr, replaceCb);
	}));
	return true;
};


function FixedExpressionTransformCommand(compiler) {
	ExpressionTransformCommand.call(this, compiler, FixedExpressionTransformCommand.IDENTIFIER);
};

$__jsx_extend([FixedExpressionTransformCommand], ExpressionTransformCommand);
FixedExpressionTransformCommand.prototype.touchExpression$LExpression$F$LExpression$V$ = function (expr, replaceCb) {
	var envName;
	var envVar;
	if (expr instanceof ArrayExpression && expr.getFirstExpr$() instanceof PropertyExpression && FixedExpressionTransformCommand$_refersToJSXENV$LPropertyExpression$(expr.getFirstExpr$()) && expr.getSecondExpr$() instanceof StringLiteralExpression) {
		envName = expr.getSecondExpr$().getDecoded$();
		envVar = this.getCompiler$().getUserEnvironment$()[envName];
		if (envVar != null) {
			replaceCb(new StringLiteralExpression(new Token$2(Util$encodeStringLiteral$S(envVar), false)));
		} else {
			replaceCb(new NullExpression(new Token$2("null", false), new NullableType(Type.stringType)));
		}
		return true;
	} else if (expr instanceof PropertyExpression && FixedExpressionTransformCommand$_refersToJSXENV$LPropertyExpression$(expr)) {
		this.errors.push(new CompileError(expr.getToken$(), "JSX.ENV can only be accessed via: JSX.ENV[\"string-literal\"]"));
	}
	return ExpressionTransformCommand.prototype.touchExpression$LExpression$F$LExpression$V$.call(this, expr, replaceCb);
};


function FixedExpressionTransformCommand$_refersToJSXENV$LPropertyExpression$(expr) {
	return expr.getExpr$() instanceof ClassExpression && expr.getExpr$().getToken$().getValue$() === "JSX" && expr.getIdentifierToken$().getValue$() === "ENV";
};

FixedExpressionTransformCommand._refersToJSXENV$LPropertyExpression$ = FixedExpressionTransformCommand$_refersToJSXENV$LPropertyExpression$;

function StatementTransformCommand(compiler, identifier) {
	FunctionTransformCommand.call(this, compiler, identifier);
	this._funcDef = null;
};

$__jsx_extend([StatementTransformCommand], FunctionTransformCommand);
StatementTransformCommand.prototype.transformFunction$LMemberFunctionDefinition$ = function (funcDef) {
	var $this = this;
	var prev;
	prev = this._funcDef;
	try {
		this._funcDef = funcDef;
		funcDef.forEachStatement$F$LStatement$F$LStatement$V$B$((function (stmt, replaceCb) {
			return $this.touchStatement$LStatement$F$LStatement$V$(stmt, replaceCb);
		}));
	} finally {
		this._funcDef = prev;
	}
};


StatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$ = function (stmt, replaceCb) {
	var $this = this;
	stmt.forEachStatement$F$LStatement$F$LStatement$V$B$((function (stmt, replaceCb) {
		return $this.touchStatement$LStatement$F$LStatement$V$(stmt, replaceCb);
	}));
	return true;
};


StatementTransformCommand.prototype.getProcessingFuncDef$ = function () {
	return this._funcDef;
};


function NormalizeTryStatementTransformCommand(compiler) {
	StatementTransformCommand.call(this, compiler, NormalizeTryStatementTransformCommand.IDENTIFIER);
};

$__jsx_extend([NormalizeTryStatementTransformCommand], StatementTransformCommand);
NormalizeTryStatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$ = function (statement, replaceCb) {
	var $this = this;
	var tryStatement;
	var catchStatements;
	var newCaught;
	var newBody;
	var newCatch;
	if (statement instanceof TryStatement) {
		tryStatement = statement;
		catchStatements = tryStatement.getCatchStatements$();
		newCaught = new CaughtVariable(new Token$2("e", true), Type.variantType);
		catchStatements.forEach((function (catchStmt) {
			catchStmt.forEachStatement$F$LStatement$B$((function onStmt(stmt) {
				return stmt.forEachExpression$F$LExpression$F$LExpression$V$B$((function onExpr(expr, replaceCb) {
					var local;
					if (expr instanceof LocalExpression) {
						local = expr.getLocal$();
						if (local == catchStmt.getLocal$()) {
							expr = new AsNoConvertExpression(new Token$2("as", false), new LocalExpression(newCaught.getName$(), newCaught), local.getType$());
							replaceCb(expr);
							return true;
						}
					}
					return expr.forEachExpression$F$LExpression$F$LExpression$V$B$(onExpr);
				})) && stmt.forEachStatement$F$LStatement$B$(onStmt);
			}));
		}));
		newBody = catchStatements.reduceRight((function (elseStmts, catchStmt) {
			var caughtVar;
			caughtVar = catchStmt.getLocal$();
			if (caughtVar.getType$() instanceof ObjectType) {
				return [ new IfStatement(new Token$2("if", false), new InstanceofExpression(new Token$2("instanceof", false), new LocalExpression(newCaught.getName$(), newCaught), caughtVar.getType$()), catchStmt.getStatements$(), elseStmts) ];
			} else {
				return catchStmt.getStatements$();
			}
		}), [ new ThrowStatement(new Token$2("throw", false), new LocalExpression(newCaught.getName$(), newCaught)) ]);
		newCatch = new CatchStatement(new Token$2("catch", false), newCaught, newBody);
		tryStatement.getCatchStatements$().length = 0;
		tryStatement.getCatchStatements$().push(newCatch);
	}
	return StatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$.call(this, statement, replaceCb);
};


function ForInStatementTransformCommand(compiler) {
	StatementTransformCommand.call(this, compiler, ForInStatementTransformCommand.IDENTIFIER);
};

$__jsx_extend([ForInStatementTransformCommand], StatementTransformCommand);
ForInStatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$ = function (statement, replaceCb) {
	var funcDef;
	funcDef = this.getProcessingFuncDef$();
	if (statement instanceof ForInStatement) {
		StatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$.call(this, statement, replaceCb);
		replaceCb(this._transformForIn$LMemberFunctionDefinition$LForInStatement$(funcDef, statement));
		return true;
	}
	return StatementTransformCommand.prototype.touchStatement$LStatement$F$LStatement$V$.call(this, statement, replaceCb);
};


ForInStatementTransformCommand.prototype._transformForIn$LMemberFunctionDefinition$LForInStatement$ = function (funcDef, forInStmt) {
	var listExpr;
	var vLocal;
	var listLocal;
	var propsLocal;
	var propLocal;
	var indexLocal;
	var statements;
	listExpr = forInStmt.getListExpr$();
	vLocal = forInStmt.getLHSExpr$().getLocal$();
	listLocal = _Util$1$_createFreshLocalVariable$LType$(listExpr.getType$());
	propsLocal = _Util$1$_createFreshLocalVariable$LType$(new ObjectType(_Util$1$instantiateBuiltinTemplate$LCompiler$SALType$(this._compiler, "Array", [ Type.stringType ])));
	propLocal = _Util$1$_createFreshLocalVariable$LType$(Type.stringType);
	indexLocal = _Util$1$_createFreshLocalVariable$LType$(Type.integerType);
	funcDef.getLocals$().push(listLocal, propsLocal, propLocal, indexLocal);
	statements = [ new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(listLocal.getName$(), listLocal), listExpr)), new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(propsLocal.getName$(), propsLocal), new ArrayLiteralExpression(new Token$2("[", false), [  ], propsLocal.getType$()))), new ForInStatement(new Token$2("for", false), null, new LocalExpression(propLocal.getName$(), propLocal), new LocalExpression(listLocal.getName$(), listLocal), [ new ExpressionStatement(new CallExpression(new Token$2("(", false), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(propsLocal.getName$(), propsLocal), new Token$2("push", true), [  ], propsLocal.getType$().getClassDef$().getMemberTypeByName$ALCompileError$LToken$SBALType$N([  ], null, "push", false, [  ], ClassDefinition.GET_MEMBER_MODE_ALL)), [ new LocalExpression(propLocal.getName$(), propLocal) ])) ]), new ForStatement(new Token$2("for", false), null, new AssignmentExpression(new Token$2("=", false), new LocalExpression(indexLocal.getName$(), indexLocal), new IntegerLiteralExpression(new Token$2("0", false))), new BinaryNumberExpression(new Token$2("<", false), new LocalExpression(indexLocal.getName$(), indexLocal), new PropertyExpression$0(new Token$2(".", false), new LocalExpression(propsLocal.getName$(), propsLocal), new Token$2("length", true), [  ], Type.integerType)), new PreIncrementExpression(new Token$2("++", false), new LocalExpression(indexLocal.getName$(), indexLocal)), [ new ExpressionStatement(new AssignmentExpression(new Token$2("=", false), new LocalExpression(vLocal.getName$(), vLocal), new ArrayExpression$0(new Token$2("[", false), new LocalExpression(propsLocal.getName$(), propsLocal), new LocalExpression(indexLocal.getName$(), indexLocal), vLocal.getType$()))), new IfStatement(new Token$2("if", false), new LogicalNotExpression(new Token$2("!", false), new InExpression(new Token$2("in", false), new LocalExpression(vLocal.getName$(), vLocal), new LocalExpression(listLocal.getName$(), listLocal))), [ new ContinueStatement(new Token$2("continue", false), null) ], [  ]) ].concat(forInStmt.getStatements$())) ];
	return new DoWhileStatement(new Token$2("do", false), null, new BooleanLiteralExpression(new Token$2("false", false)), statements);
};


function Util$x2EArgumentTypeRequest(argTypes, typeArgs) {
	this.argTypes = argTypes;
	this.typeArgs = typeArgs;
};

$__jsx_extend([Util$x2EArgumentTypeRequest], Object);
Util$x2EArgumentTypeRequest.prototype.at$I = function (i) {
	return this.argTypes[i];
};


function _Util$x2EOutputNameStash(outputName) {
	Stash.call(this);
	this.outputName = outputName;
};

$__jsx_extend([_Util$x2EOutputNameStash], Stash);
_Util$x2EOutputNameStash.prototype.clone$ = function () {
	throw new Error("not supported");
};


function _Namer$x2E_TryStash(catchName) {
	Stash.call(this);
	this.catchName = catchName;
};

$__jsx_extend([_Namer$x2E_TryStash], Stash);
_Namer$x2E_TryStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Namer$x2E_CatchTargetStash(tryStmt) {
	Stash.call(this);
	this.tryStmt = tryStmt;
};

$__jsx_extend([_Namer$x2E_CatchTargetStash], Stash);
_Namer$x2E_CatchTargetStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$x2E_ClassStash() {
	Stash.call(this);
	this.staticVariableUseCount = {};
	this.staticVariableConversionTable = {};
};

$__jsx_extend([_Minifier$x2E_ClassStash], Stash);
_Minifier$x2E_ClassStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$x2E_ScopeStash() {
	Stash.call(this);
	this.usedGlobals = {};
	this.usedOuterLocals = [];
};

$__jsx_extend([_Minifier$x2E_ScopeStash], Stash);
_Minifier$x2E_ScopeStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$x2E_LocalStash() {
	Stash.call(this);
	this.useCount = 0;
	this.minifiedName = null;
};

$__jsx_extend([_Minifier$x2E_LocalStash], Stash);
_Minifier$x2E_LocalStash.prototype.clone$ = function () {
	throw new Error("operation not supported");
};


function _Minifier$x2E_MinifyingNamer() {
	_Namer.call(this);
	this._minifier = null;
};

$__jsx_extend([_Minifier$x2E_MinifyingNamer], _Namer);
_Minifier$x2E_MinifyingNamer.prototype.setup$L_Minifier$ = function (minifier) {
	this._minifier = minifier;
	_Namer.prototype.setup$LJavaScriptEmitter$.call(this, minifier._emitter);
	return this;
};


_Minifier$x2E_MinifyingNamer.prototype._getMangler$ = function () {
	return this._minifier._emitter.getMangler$();
};


_Minifier$x2E_MinifyingNamer.prototype._isCounting$ = function () {
	return this._minifier._isCounting$();
};


_Minifier$x2E_MinifyingNamer.prototype.getNameOfProperty$LClassDefinition$S = function (classDef, name) {
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


_Minifier$x2E_MinifyingNamer.prototype.getNameOfMethod$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
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


_Minifier$x2E_MinifyingNamer.prototype.getNameOfStaticVariable$LClassDefinition$S = function (classDef, name) {
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


_Minifier$x2E_MinifyingNamer.prototype.getNameOfStaticFunction$LClassDefinition$SALType$ = function (classDef, name, argTypes) {
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


_Minifier$x2E_MinifyingNamer.prototype.getNameOfConstructor$LClassDefinition$ALType$ = function (classDef, argTypes) {
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


_Minifier$x2E_MinifyingNamer.prototype.getNameOfClass$LClassDefinition$ = function (classDef) {
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


_Minifier$x2E_MinifyingNamer.prototype.enterScope$LLocalVariable$F$V$ = function (local, cb) {
	var $this = this;
	if (local == null) {
		cb();
	} else if (this._isCounting$()) {
		this._minifier._recordUsedIdentifiers$LStashable$F$V$(local, (function () {
			$this._minifier._outerLocals.push(local);
			cb();
			$this._minifier._outerLocals.pop();
		}));
	} else {
		this._minifier._buildConversionTable$ALLocalVariable$L_Minifier$x2E_ScopeStash$([ local ], _Minifier$_getScopeStash$LStashable$(local));
		cb();
	}
};


_Minifier$x2E_MinifyingNamer.prototype.enterFunction$LMemberFunctionDefinition$F$V$ = function (funcDef, cb) {
	var $this = this;
	if (this._isCounting$()) {
		this._minifier._recordUsedIdentifiers$LStashable$F$V$(funcDef, (function () {
			$this._minifier._outerLocals = $this._minifier._outerLocals.concat(_Minifier$_getArgsAndLocals$LMemberFunctionDefinition$(funcDef));
			cb();
			$this._minifier._outerLocals.length -= funcDef.getArguments$().length + funcDef.getLocals$().length;
		}));
	} else {
		this._minifier._buildConversionTable$ALLocalVariable$L_Minifier$x2E_ScopeStash$(_Minifier$_getArgsAndLocals$LMemberFunctionDefinition$(funcDef), _Minifier$_getScopeStash$LStashable$(funcDef));
		cb();
	}
};


_Minifier$x2E_MinifyingNamer.prototype.getNameOfLocalVariable$LLocalVariable$ = function (local) {
	if (local instanceof CaughtVariable) {
		return this._getCatchName$LCaughtVariable$(local);
	}
	if (this._isCounting$()) {
		++_Minifier$_getLocalStash$LLocalVariable$(local).useCount;
		return local.getName$().getValue$();
	} else {
		return _Minifier$_getLocalStash$LLocalVariable$(local).minifiedName;
	}
};


function MemberFunctionDefinition$x2E_CloneStash() {
	Stash.call(this);
	this.newLocal = null;
	this.newFuncDef = null;
};

function MemberFunctionDefinition$x2E_CloneStash$0(that) {
	Stash.call(this);
	this.newLocal = that.newLocal;
	this.newFuncDef = that.newFuncDef;
};

$__jsx_extend([MemberFunctionDefinition$x2E_CloneStash, MemberFunctionDefinition$x2E_CloneStash$0], Stash);
MemberFunctionDefinition$x2E_CloneStash.prototype.clone$ = function () {
	return new MemberFunctionDefinition$x2E_CloneStash$0(this);
};


function _LinkTimeOptimizationCommand$x2EStash() {
	Stash.call(this);
	this.extendedBy = [];
};

$__jsx_extend([_LinkTimeOptimizationCommand$x2EStash], Stash);
_LinkTimeOptimizationCommand$x2EStash.prototype.clone$ = function () {
	throw new Error("not supported");
};


function _StripOptimizeCommand$x2E_Stash() {
	Stash.call(this);
	this.touched = false;
};

$__jsx_extend([_StripOptimizeCommand$x2E_Stash], Stash);
_StripOptimizeCommand$x2E_Stash.prototype.clone$ = function () {
	throw new Error("not supported");
};


function _DetermineCalleeCommand$x2EStash() {
	Stash.call(this);
	this.callingFuncDef = null;
};

function _DetermineCalleeCommand$x2EStash$0(that) {
	Stash.call(this);
	this.callingFuncDef = that.callingFuncDef;
};

$__jsx_extend([_DetermineCalleeCommand$x2EStash, _DetermineCalleeCommand$x2EStash$0], Stash);
_DetermineCalleeCommand$x2EStash.prototype.clone$ = function () {
	return new _DetermineCalleeCommand$x2EStash$0(this);
};


function _StaticizeOptimizeCommand$x2EStash() {
	Stash.call(this);
	this.altName = null;
};

function _StaticizeOptimizeCommand$x2EStash$0(that) {
	Stash.call(this);
	this.altName = that.altName;
};

$__jsx_extend([_StaticizeOptimizeCommand$x2EStash, _StaticizeOptimizeCommand$x2EStash$0], Stash);
_StaticizeOptimizeCommand$x2EStash.prototype.clone$ = function () {
	return new _StaticizeOptimizeCommand$x2EStash$0(this);
};


function _UnclassifyOptimizationCommand$x2EStash() {
	Stash.call(this);
	this.inliner = null;
};

function _UnclassifyOptimizationCommand$x2EStash$0(that) {
	Stash.call(this);
	this.inliner = that.inliner;
};

$__jsx_extend([_UnclassifyOptimizationCommand$x2EStash, _UnclassifyOptimizationCommand$x2EStash$0], Stash);
_UnclassifyOptimizationCommand$x2EStash.prototype.clone$ = function () {
	return new _UnclassifyOptimizationCommand$x2EStash$0(this);
};


function _FoldConstantCommand$x2EStash() {
	Stash.call(this);
	this.isOptimized = false;
};

function _FoldConstantCommand$x2EStash$0(that) {
	Stash.call(this);
	this.isOptimized = that.isOptimized;
};

$__jsx_extend([_FoldConstantCommand$x2EStash, _FoldConstantCommand$x2EStash$0], Stash);
_FoldConstantCommand$x2EStash.prototype.clone$ = function () {
	return new _FoldConstantCommand$x2EStash$0(this);
};


function _InlineOptimizeCommand$x2EStash() {
	Stash.call(this);
	this.isOptimized = false;
	this.isInlineable = null;
};

function _InlineOptimizeCommand$x2EStash$0(that) {
	Stash.call(this);
	this.isOptimized = that.isOptimized;
	this.isInlineable = that.isInlineable;
};

$__jsx_extend([_InlineOptimizeCommand$x2EStash, _InlineOptimizeCommand$x2EStash$0], Stash);
_InlineOptimizeCommand$x2EStash.prototype.clone$ = function () {
	return new _InlineOptimizeCommand$x2EStash$0(this);
};


function _UnboxOptimizeCommand$x2EStash() {
	Stash.call(this);
	this.canUnbox = null;
};

$__jsx_extend([_UnboxOptimizeCommand$x2EStash], Stash);
_UnboxOptimizeCommand$x2EStash.prototype.clone$ = function () {
	var tmp;
	tmp = new _UnboxOptimizeCommand$x2EStash();
	tmp.canUnbox = this.canUnbox;
	return tmp;
};


function _NoDebugCommand$x2EStash() {
	Stash.call(this);
	this.debugValue = true;
};

$__jsx_extend([_NoDebugCommand$x2EStash], Stash);
_NoDebugCommand$x2EStash.prototype.clone$ = function () {
	var tmp;
	tmp = new _NoDebugCommand$x2EStash();
	tmp.debugValue = this.debugValue;
	return tmp;
};


function _DeleteStatementTransformer$x2E_Stash(transformer, statement) {
	_BinaryExpressionTransformer.call(this, transformer, statement.getExpr$());
	this._statement = statement;
};

$__jsx_extend([_DeleteStatementTransformer$x2E_Stash], _BinaryExpressionTransformer);
_DeleteStatementTransformer$x2E_Stash.prototype._injectBody$ALExpression$LExpression$LMemberFunctionDefinition$LMemberFunctionDefinition$LExpression$ = function (args, topExpr, topFuncDef, botFuncDef, continuation) {
	botFuncDef._statements = [ new DeleteStatement(this._statement.getToken$(), this.constructOp$ALExpression$(args)) ];
	Util$rebaseClosures$LMemberFunctionDefinition$LMemberFunctionDefinition$(topFuncDef, botFuncDef);
};


_DeleteStatementTransformer$x2E_Stash.prototype._clone$LExpression$LExpression$ = function (arg1, arg2) {
	return new ArrayExpression(this._expr.getToken$(), arg1, arg2);
};


function _SwitchStatementTransformer$x2ECaseStash() {
	Stash.call(this);
	this.index = _SwitchStatementTransformer$x2ECaseStash.count++;
};

$__jsx_extend([_SwitchStatementTransformer$x2ECaseStash], Stash);
_SwitchStatementTransformer$x2ECaseStash.prototype.clone$ = function () {
	throw new Error("not supported");
};


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
$__jsx_lazy_init(node, "util", function () {
	return node$require$S('util');
});
$__jsx_lazy_init(Timer, "_requestAnimationFrame", function () {
	return Timer$_getRequestAnimationFrameImpl$B(true);
});
$__jsx_lazy_init(Timer, "_cancelAnimationFrame", function () {
	return Timer$_getCancelAnimationFrameImpl$B(true);
});
$__jsx_lazy_init(Util, "_builtInClass", function () {
	return Util$asSet$AS([ "Array", "Boolean", "Date", "Function", "Map", "Math", "Number", "Object", "RegExp", "String", "JSON", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "JSX", "Transferable", "ArrayBuffer", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array", "DataView" ]);
});
$__jsx_lazy_init(Util, "_builtInContainer", function () {
	return Util$asSet$AS([ "Array", "Map", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array" ]);
});
Util._stringLiteralEncodingMap = ({ "\0": "\\0", "\r": "\\r", "\n": "\\n", "\t": "\\t", "\"": "\\\"", "\'": "\\\'", "\\": "\\\\" });
_Util.OUTPUTNAME_IDENTIFIER = "emitter.outputname";
$__jsx_lazy_init(_Util, "_ecma262reserved", function () {
	return Util$asSet$AS([ "break", "do", "instanceof", "typeof", "case", "else", "new", "var", "catch", "finally", "return", "void", "continue", "for", "switch", "while", "debugger", "function", "this", "with", "default", "if", "throw", "delete", "in", "try", "class", "enum", "extends", "super", "const", "export", "import", "implements", "let", "private", "public", "yield", "interface", "package", "protected", "static", "null", "true", "false" ]);
});
_Namer.IDENTIFIER = "namer";
_MinifiedNameGenerator._MINIFY_CHARS = "$_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
$__jsx_lazy_init(_MinifiedNameGenerator, "GLOBALS", function () {
	return ("NaN Infinity undefined eval" + "parseInt parseFloat isNaN isFinite decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Object Function Array String Boolean Number Date RegExp Error EvalError RangeError ReferenceError SyntaxError TypeError URIError Math").split(/\s+/);
});
_Minifier.CLASSSTASH_IDENTIFIER = "minifier.class";
_Minifier.SCOPESTASH_IDENTIFIER = "minifier.scope";
_Minifier.LOCALSTASH_IDENTIFIER = "minifier.local";
_UnaryExpressionEmitter._operatorPrecedence = {};
_PreIncrementExpressionEmitter._operatorPrecedence = {};
_PostIncrementExpressionEmitter._operatorPrecedence = {};
_PostIncrementExpressionEmitter.TEMP_VAR_NAME = "$__jsx_postinc_t";
_InstanceofExpressionEmitter._operatorPrecedence = 0;
_PropertyExpressionEmitter._operatorPrecedence = 0;
_FunctionExpressionEmitter._operatorPrecedence = 0;
_AdditiveExpressionEmitter._operatorPrecedence = 0;
_AssignmentExpressionEmitter._operatorPrecedence = {};
_FusedAssignmentExpressionEmitter._fusedIntHelpers = ({ "+": "$__jsx_ipadd", "-": "$__jsx_ipsub", "*": "$__jsx_ipmul", "/": "$__jsx_ipdiv", "%": "$__jsx_ipmod" });
_FusedAssignmentExpressionEmitter._operatorPrecedence = {};
_EqualityExpressionEmitter._operatorPrecedence = {};
_InExpressionEmitter._operatorPrecedence = 0;
_LogicalExpressionEmitter._operatorPrecedence = {};
_ShiftExpressionEmitter._operatorPrecedence = {};
_BinaryNumberExpressionEmitter._OPS_RETURNING_INT = ({ '&': true, '|': true, '^': true });
_BinaryNumberExpressionEmitter._operatorPrecedence = {};
_ArrayExpressionEmitter._operatorPrecedence = 0;
_ConditionalExpressionEmitter._operatorPrecedence = 0;
_CallExpressionEmitter._operatorPrecedence = 0;
_SuperExpressionEmitter._operatorPrecedence = 0;
_NewExpressionEmitter._operatorPrecedence = 0;
_CommaExpressionEmitter._operatorPrecedence = 0;
NodePlatform.COLOR_BLACK = 30;
NodePlatform.COLOR_RED = 31;
NodePlatform.COLOR_GREEN = 32;
NodePlatform.COLOR_YELLOW = 33;
NodePlatform.COLOR_BLUE = 34;
$__jsx_lazy_init(NodePlatform, "_isColorSupported", function () {
	return (function () {
		var term;
		if (process.stdout.isTTY && process.stderr.isTTY) {
			term = (process.env.TERM || "").toLowerCase();
			return /color/.test(term) || /xterm/.test(term);
		}
		return false;
	})();
});
Meta.VERSION_STRING = "0.9.89";
Meta.VERSION_NUMBER = 0.009089;
Meta.LAST_COMMIT_HASH = "0173307ab02abcc6cefc8c54be988ca9909b190e";
Meta.LAST_COMMIT_DATE = "2014-05-20 12:19:39 +0900";
$__jsx_lazy_init(Meta, "IDENTIFIER", function () {
	return Meta.VERSION_STRING + " (" + Meta.LAST_COMMIT_DATE + "; " + Meta.LAST_COMMIT_HASH + ")";
});
JavaScriptEmitter.BOOTSTRAP_NONE = 0;
JavaScriptEmitter.BOOTSTRAP_EXECUTABLE = 1;
JavaScriptEmitter.BOOTSTRAP_TEST = 2;
JavaScriptEmitter._initialized = false;
LocalVariableStatuses.UNTYPED_RECURSIVE_FUNCTION = - 1;
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
ClassDefinition.IS_GENERATED = 32768;
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
_Lexer.heredocStartDoubleQuoted = '"""';
_Lexer.heredocStartSingleQuoted = "'''";
$__jsx_lazy_init(_Lexer, "heredocStart", function () {
	return _Lexer$makeAlt$AS([ _Lexer.heredocStartDoubleQuoted, _Lexer.heredocStartSingleQuoted ]);
});
_Lexer.heredocEndDoubleQuoted = ' (?:^|.*?[^\\\\]) (?:\\\\\\\\)* """ ';
_Lexer.heredocEndSingleQuoted = " (?:^|.*?[^\\\\]) (?:\\\\\\\\)* ''' ";
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
$__jsx_lazy_init(_Lexer, "rxHeredocStart", function () {
	return _Lexer$rx$S("^" + _Lexer.heredocStart);
});
$__jsx_lazy_init(_Lexer, "rxHeredocEndDoubleQuoted", function () {
	return _Lexer$rx$S(_Lexer.heredocEndDoubleQuoted);
});
$__jsx_lazy_init(_Lexer, "rxHeredocEndSingleQuoted", function () {
	return _Lexer$rx$S(_Lexer.heredocEndSingleQuoted);
});
_Lexer.rxNewline = /(?:\r\n?|\n)/;
$__jsx_lazy_init(_Lexer, "keywords", function () {
	return Util$asSet$AS([ "null", "true", "false", "NaN", "Infinity", "break", "do", "instanceof", "typeof", "case", "else", "new", "var", "finally", "return", "void", "const", "for", "switch", "while", "function", "this", "if", "throw", "in", "try", "class", "extends", "super", "import", "implements", "static", "__FILE__", "__LINE__", "undefined" ]);
});
$__jsx_lazy_init(_Lexer, "reserved", function () {
	return Util$asSet$AS([ "debugger", "with", "export", "let", "private", "public", "yield", "protected", "extern", "native", "as", "operator" ]);
});
SourceMapper.NODE_SOURCE_MAP_HEADER = "require('source-map-support').install();\n\n";
SourceMapper.WEB_SOURCE_MAP_HEADER = "";
_NoAssertCommand.IDENTIFIER = "no-assert";
_NoLogCommand.IDENTIFIER = "no-log";
_DeadCodeEliminationOptimizeCommand.IDENTIFIER = "dce";
_ReturnIfOptimizeCommand.IDENTIFIER = "return-if";
_LCSEOptimizeCommand.IDENTIFIER = "lcse";
_ArrayLengthOptimizeCommand.IDENTIFIER = "array-length";
_TailRecursionOptimizeCommand.IDENTIFIER = "tail-rec";
_TailRecursionOptimizeCommand.LABEL = "$TAIL_REC";
_LinkTimeOptimizationCommand.IDENTIFIER = "lto";
_StripOptimizeCommand.IDENTIFIER = "strip";
_DetermineCalleeCommand.IDENTIFIER = "determine-callee";
_StaticizeOptimizeCommand.IDENTIFIER = "staticize";
_UnclassifyOptimizationCommand.IDENTIFIER = "unclassify";
_FoldConstantCommand.IDENTIFIER = "fold-const";
_FoldConstantCommand.LONG_STRING_LITERAL = 64;
_InlineOptimizeCommand.IDENTIFIER = "inline";
_InlineOptimizeCommand.INLINE_THRESHOLD = 30;
_UnboxOptimizeCommand.IDENTIFIER = "unbox";
_NoDebugCommand.IDENTIFIER = "no-debug";
Compiler.MODE_COMPILE = 0;
Compiler.MODE_PARSE = 1;
Compiler.MODE_COMPLETE = 2;
Compiler.MODE_DOC = 3;
_ExpressionTransformer._expressionCountMap = {};
_StatementTransformer._statementCountMap = {};
_Util$1._numUniqVar = 0;
GeneratorTransformCommand.IDENTIFIER = "generator";
ANFTransformCommand.IDENTIFIER = "anf";
CPSTransformCommand.IDENTIFIER = "cps";
FixedExpressionTransformCommand.IDENTIFIER = "fixed";
NormalizeTryStatementTransformCommand.IDENTIFIER = "normalize-try";
ForInStatementTransformCommand.IDENTIFIER = "transform-for-in";
_SwitchStatementTransformer$x2ECaseStash.ID = "CASE-ID";
_SwitchStatementTransformer$x2ECaseStash.count = 0;

var $__jsx_classMap = {
	"src/jsx-node-front.jsx": {
		_Main: _Main,
		_Main$: _Main,
		NodePlatform: NodePlatform,
		NodePlatform$: NodePlatform,
		NodePlatform$S: NodePlatform$0
	},
	"system:lib/js/js/nodejs.jsx": {
		node: node
	},
	"system:lib/js/timer.jsx": {
		Timer: Timer,
		Timer$: Timer,
		TimerHandle: TimerHandle
	},
	"src/util.jsx": {
		Util: Util,
		Util$: Util,
		"Util.ArgumentTypeRequest": Util$x2EArgumentTypeRequest,
		"Util.ArgumentTypeRequest$ALType$ALToken$": Util$x2EArgumentTypeRequest
	},
	"src/jsemitter.jsx": {
		_Util: _Util,
		_Util$: _Util,
		_TempVarLister: _TempVarLister,
		_TempVarLister$: _TempVarLister,
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
		_PreIncrementExpressionEmitter: _PreIncrementExpressionEmitter,
		_PreIncrementExpressionEmitter$LJavaScriptEmitter$LPreIncrementExpression$: _PreIncrementExpressionEmitter,
		_PostIncrementExpressionEmitter: _PostIncrementExpressionEmitter,
		_PostIncrementExpressionEmitter$LJavaScriptEmitter$LPostIncrementExpression$: _PostIncrementExpressionEmitter,
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
		_FusedAssignmentExpressionEmitter: _FusedAssignmentExpressionEmitter,
		_FusedAssignmentExpressionEmitter$LJavaScriptEmitter$LFusedAssignmentExpression$: _FusedAssignmentExpressionEmitter,
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
		"_Util.OutputNameStash": _Util$x2EOutputNameStash,
		"_Util.OutputNameStash$S": _Util$x2EOutputNameStash,
		"_Namer._TryStash": _Namer$x2E_TryStash,
		"_Namer._TryStash$S": _Namer$x2E_TryStash,
		"_Namer._CatchTargetStash": _Namer$x2E_CatchTargetStash,
		"_Namer._CatchTargetStash$LTryStatement$": _Namer$x2E_CatchTargetStash,
		"_Minifier._ClassStash": _Minifier$x2E_ClassStash,
		"_Minifier._ClassStash$": _Minifier$x2E_ClassStash,
		"_Minifier._ScopeStash": _Minifier$x2E_ScopeStash,
		"_Minifier._ScopeStash$": _Minifier$x2E_ScopeStash,
		"_Minifier._LocalStash": _Minifier$x2E_LocalStash,
		"_Minifier._LocalStash$": _Minifier$x2E_LocalStash,
		"_Minifier._MinifyingNamer": _Minifier$x2E_MinifyingNamer,
		"_Minifier._MinifyingNamer$": _Minifier$x2E_MinifyingNamer
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
		FusedAssignmentExpression: FusedAssignmentExpression,
		FusedAssignmentExpression$LToken$LExpression$LExpression$: FusedAssignmentExpression,
		AssignmentExpression: AssignmentExpression,
		AssignmentExpression$LToken$LExpression$LExpression$: AssignmentExpression,
		ArrayExpression: ArrayExpression,
		ArrayExpression$LToken$LExpression$LExpression$: ArrayExpression,
		ArrayExpression$LToken$LExpression$LExpression$LType$: ArrayExpression$0,
		AdditiveExpression: AdditiveExpression,
		AdditiveExpression$LToken$LExpression$LExpression$: AdditiveExpression,
		UnaryExpression: UnaryExpression,
		UnaryExpression$LToken$LExpression$: UnaryExpression,
		YieldExpression: YieldExpression,
		YieldExpression$LToken$LExpression$: YieldExpression,
		YieldExpression$LToken$LExpression$LType$LType$: YieldExpression$0,
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
		ThisExpression: ThisExpression,
		ThisExpression$LToken$LClassDefinition$: ThisExpression,
		RegExpLiteralExpression: RegExpLiteralExpression,
		RegExpLiteralExpression$LToken$: RegExpLiteralExpression,
		RegExpLiteralExpression$LToken$LType$: RegExpLiteralExpression$0,
		PrimitiveLiteralExpression: PrimitiveLiteralExpression,
		PrimitiveLiteralExpression$LToken$: PrimitiveLiteralExpression,
		StringLiteralExpression: StringLiteralExpression,
		StringLiteralExpression$LToken$: StringLiteralExpression,
		FileMacroExpression: FileMacroExpression,
		FileMacroExpression$LToken$: FileMacroExpression,
		NumberLiteralExpression: NumberLiteralExpression,
		NumberLiteralExpression$LToken$: NumberLiteralExpression,
		LineMacroExpression: LineMacroExpression,
		LineMacroExpression$LToken$: LineMacroExpression,
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
		LocalVariable$LToken$LType$B: LocalVariable,
		CaughtVariable: CaughtVariable,
		CaughtVariable$LToken$LType$: CaughtVariable,
		ArgumentDeclaration: ArgumentDeclaration,
		ArgumentDeclaration$LToken$LType$: ArgumentDeclaration,
		ArgumentDeclaration$LToken$LType$LExpression$: ArgumentDeclaration$0,
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
		UnusedWarning: UnusedWarning,
		UnusedWarning$LToken$S: UnusedWarning,
		UnusedWarning$SNNS: UnusedWarning$0,
		DeprecatedWarning: DeprecatedWarning,
		DeprecatedWarning$LToken$S: DeprecatedWarning,
		DeprecatedWarning$SNNS: DeprecatedWarning$0,
		ExperimentalWarning: ExperimentalWarning,
		ExperimentalWarning$LToken$S: ExperimentalWarning,
		ExperimentalWarning$SNNS: ExperimentalWarning$0,
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
		AssertStatement$LToken$LExpression$LExpression$: AssertStatement,
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
		InstantiatedClassDefinition$LTemplateClassDefinition$ALType$LParsedObjectType$ALParsedObjectType$ALMemberDefinition$ALClassDefinition$ALTemplateClassDefinition$ALParsedObjectType$: InstantiatedClassDefinition,
		"MemberFunctionDefinition._CloneStash": MemberFunctionDefinition$x2E_CloneStash,
		"MemberFunctionDefinition._CloneStash$": MemberFunctionDefinition$x2E_CloneStash,
		"MemberFunctionDefinition._CloneStash$LMemberFunctionDefinition$x2E_CloneStash$": MemberFunctionDefinition$x2E_CloneStash$0
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
		MemberFunctionType$LToken$LType$LType$ALType$B: MemberFunctionType,
		TemplateFunctionType: TemplateFunctionType,
		TemplateFunctionType$LToken$LTemplateFunctionDefinition$: TemplateFunctionType
	},
	"src/parser.jsx": {
		Token: Token,
		Token$SBUSNN: Token,
		Token$SBUSN: Token$0,
		Token$SBUS: Token$1,
		Token$SB: Token$2,
		Token$S: Token$3,
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
		SourceMapper$SUSS: SourceMapper
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
		_NoAssertCommand: _NoAssertCommand,
		_NoAssertCommand$: _NoAssertCommand,
		_NoLogCommand: _NoLogCommand,
		_NoLogCommand$: _NoLogCommand,
		_DeadCodeEliminationOptimizeCommand: _DeadCodeEliminationOptimizeCommand,
		_DeadCodeEliminationOptimizeCommand$: _DeadCodeEliminationOptimizeCommand,
		_ReturnIfOptimizeCommand: _ReturnIfOptimizeCommand,
		_ReturnIfOptimizeCommand$: _ReturnIfOptimizeCommand,
		_LCSECachedExpression: _LCSECachedExpression,
		_LCSECachedExpression$LExpression$F$LExpression$V$: _LCSECachedExpression,
		_LCSEOptimizeCommand: _LCSEOptimizeCommand,
		_LCSEOptimizeCommand$: _LCSEOptimizeCommand,
		_ArrayLengthOptimizeCommand: _ArrayLengthOptimizeCommand,
		_ArrayLengthOptimizeCommand$: _ArrayLengthOptimizeCommand,
		_TailRecursionOptimizeCommand: _TailRecursionOptimizeCommand,
		_TailRecursionOptimizeCommand$: _TailRecursionOptimizeCommand,
		_LinkTimeOptimizationCommand: _LinkTimeOptimizationCommand,
		_LinkTimeOptimizationCommand$: _LinkTimeOptimizationCommand,
		_StripOptimizeCommand: _StripOptimizeCommand,
		_StripOptimizeCommand$: _StripOptimizeCommand,
		_DetermineCalleeCommand: _DetermineCalleeCommand,
		_DetermineCalleeCommand$: _DetermineCalleeCommand,
		_StaticizeOptimizeCommand: _StaticizeOptimizeCommand,
		_StaticizeOptimizeCommand$: _StaticizeOptimizeCommand,
		_UnclassifyOptimizationCommand: _UnclassifyOptimizationCommand,
		_UnclassifyOptimizationCommand$: _UnclassifyOptimizationCommand,
		_FoldConstantCommand: _FoldConstantCommand,
		_FoldConstantCommand$: _FoldConstantCommand,
		_InlineOptimizeCommand: _InlineOptimizeCommand,
		_InlineOptimizeCommand$: _InlineOptimizeCommand,
		_UnboxOptimizeCommand: _UnboxOptimizeCommand,
		_UnboxOptimizeCommand$: _UnboxOptimizeCommand,
		_NoDebugCommand: _NoDebugCommand,
		_NoDebugCommand$: _NoDebugCommand,
		"_LinkTimeOptimizationCommand.Stash": _LinkTimeOptimizationCommand$x2EStash,
		"_LinkTimeOptimizationCommand.Stash$": _LinkTimeOptimizationCommand$x2EStash,
		"_StripOptimizeCommand._Stash": _StripOptimizeCommand$x2E_Stash,
		"_StripOptimizeCommand._Stash$": _StripOptimizeCommand$x2E_Stash,
		"_DetermineCalleeCommand.Stash": _DetermineCalleeCommand$x2EStash,
		"_DetermineCalleeCommand.Stash$": _DetermineCalleeCommand$x2EStash,
		"_DetermineCalleeCommand.Stash$L_DetermineCalleeCommand$x2EStash$": _DetermineCalleeCommand$x2EStash$0,
		"_StaticizeOptimizeCommand.Stash": _StaticizeOptimizeCommand$x2EStash,
		"_StaticizeOptimizeCommand.Stash$": _StaticizeOptimizeCommand$x2EStash,
		"_StaticizeOptimizeCommand.Stash$L_StaticizeOptimizeCommand$x2EStash$": _StaticizeOptimizeCommand$x2EStash$0,
		"_UnclassifyOptimizationCommand.Stash": _UnclassifyOptimizationCommand$x2EStash,
		"_UnclassifyOptimizationCommand.Stash$": _UnclassifyOptimizationCommand$x2EStash,
		"_UnclassifyOptimizationCommand.Stash$L_UnclassifyOptimizationCommand$x2EStash$": _UnclassifyOptimizationCommand$x2EStash$0,
		"_FoldConstantCommand.Stash": _FoldConstantCommand$x2EStash,
		"_FoldConstantCommand.Stash$": _FoldConstantCommand$x2EStash,
		"_FoldConstantCommand.Stash$L_FoldConstantCommand$x2EStash$": _FoldConstantCommand$x2EStash$0,
		"_InlineOptimizeCommand.Stash": _InlineOptimizeCommand$x2EStash,
		"_InlineOptimizeCommand.Stash$": _InlineOptimizeCommand$x2EStash,
		"_InlineOptimizeCommand.Stash$L_InlineOptimizeCommand$x2EStash$": _InlineOptimizeCommand$x2EStash$0,
		"_UnboxOptimizeCommand.Stash": _UnboxOptimizeCommand$x2EStash,
		"_UnboxOptimizeCommand.Stash$": _UnboxOptimizeCommand$x2EStash,
		"_NoDebugCommand.Stash": _NoDebugCommand$x2EStash,
		"_NoDebugCommand.Stash$": _NoDebugCommand$x2EStash
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
		_ExpressionTransformer: _ExpressionTransformer,
		_ExpressionTransformer$LCPSTransformCommand$S: _ExpressionTransformer,
		_MultiaryOperatorTransformer: _MultiaryOperatorTransformer,
		_MultiaryOperatorTransformer$LCPSTransformCommand$S: _MultiaryOperatorTransformer,
		_LeafExpressionTransformer: _LeafExpressionTransformer,
		_LeafExpressionTransformer$LCPSTransformCommand$LLeafExpression$: _LeafExpressionTransformer,
		_ArrayLiteralExpressionTransformer: _ArrayLiteralExpressionTransformer,
		_ArrayLiteralExpressionTransformer$LCPSTransformCommand$LArrayLiteralExpression$: _ArrayLiteralExpressionTransformer,
		_MapLiteralExpressionTransformer: _MapLiteralExpressionTransformer,
		_MapLiteralExpressionTransformer$LCPSTransformCommand$LMapLiteralExpression$: _MapLiteralExpressionTransformer,
		_FunctionExpressionTransformer: _FunctionExpressionTransformer,
		_FunctionExpressionTransformer$LCPSTransformCommand$LFunctionExpression$: _FunctionExpressionTransformer,
		_UnaryExpressionTransformer: _UnaryExpressionTransformer,
		_UnaryExpressionTransformer$LCPSTransformCommand$LUnaryExpression$: _UnaryExpressionTransformer,
		_BitwiseNotExpressionTransformer: _BitwiseNotExpressionTransformer,
		_BitwiseNotExpressionTransformer$LCPSTransformCommand$LBitwiseNotExpression$: _BitwiseNotExpressionTransformer,
		_InstanceofExpressionTransformer: _InstanceofExpressionTransformer,
		_InstanceofExpressionTransformer$LCPSTransformCommand$LInstanceofExpression$: _InstanceofExpressionTransformer,
		_AsExpressionTransformer: _AsExpressionTransformer,
		_AsExpressionTransformer$LCPSTransformCommand$LAsExpression$: _AsExpressionTransformer,
		_AsNoConvertExpressionTransformer: _AsNoConvertExpressionTransformer,
		_AsNoConvertExpressionTransformer$LCPSTransformCommand$LAsNoConvertExpression$: _AsNoConvertExpressionTransformer,
		_LogicalNotExpressionTransformer: _LogicalNotExpressionTransformer,
		_LogicalNotExpressionTransformer$LCPSTransformCommand$LLogicalNotExpression$: _LogicalNotExpressionTransformer,
		_IncrementExpressionTransformer: _IncrementExpressionTransformer,
		_IncrementExpressionTransformer$LCPSTransformCommand$LIncrementExpression$: _IncrementExpressionTransformer,
		_PostIncrementExpressionTransformer: _PostIncrementExpressionTransformer,
		_PostIncrementExpressionTransformer$LCPSTransformCommand$LIncrementExpression$: _PostIncrementExpressionTransformer,
		_PreIncrementExpressionTransformer: _PreIncrementExpressionTransformer,
		_PreIncrementExpressionTransformer$LCPSTransformCommand$LIncrementExpression$: _PreIncrementExpressionTransformer,
		_PropertyExpressionTransformer: _PropertyExpressionTransformer,
		_PropertyExpressionTransformer$LCPSTransformCommand$LPropertyExpression$: _PropertyExpressionTransformer,
		_TypeofExpressionTransformer: _TypeofExpressionTransformer,
		_TypeofExpressionTransformer$LCPSTransformCommand$LTypeofExpression$: _TypeofExpressionTransformer,
		_SignExpressionTransformer: _SignExpressionTransformer,
		_SignExpressionTransformer$LCPSTransformCommand$LSignExpression$: _SignExpressionTransformer,
		_YieldExpressionTransformer: _YieldExpressionTransformer,
		_YieldExpressionTransformer$LCPSTransformCommand$LYieldExpression$: _YieldExpressionTransformer,
		_BinaryExpressionTransformer: _BinaryExpressionTransformer,
		_BinaryExpressionTransformer$LCPSTransformCommand$LBinaryExpression$: _BinaryExpressionTransformer,
		_AdditiveExpressionTransformer: _AdditiveExpressionTransformer,
		_AdditiveExpressionTransformer$LCPSTransformCommand$LAdditiveExpression$: _AdditiveExpressionTransformer,
		_ArrayExpressionTransformer: _ArrayExpressionTransformer,
		_ArrayExpressionTransformer$LCPSTransformCommand$LArrayExpression$: _ArrayExpressionTransformer,
		_AssignmentExpressionTransformer: _AssignmentExpressionTransformer,
		_AssignmentExpressionTransformer$LCPSTransformCommand$LAssignmentExpression$: _AssignmentExpressionTransformer,
		_FusedAssignmentExpressionTransformer: _FusedAssignmentExpressionTransformer,
		_FusedAssignmentExpressionTransformer$LCPSTransformCommand$LFusedAssignmentExpression$: _FusedAssignmentExpressionTransformer,
		_BinaryNumberExpressionTransformer: _BinaryNumberExpressionTransformer,
		_BinaryNumberExpressionTransformer$LCPSTransformCommand$LBinaryNumberExpression$: _BinaryNumberExpressionTransformer,
		_EqualityExpressionTransformer: _EqualityExpressionTransformer,
		_EqualityExpressionTransformer$LCPSTransformCommand$LEqualityExpression$: _EqualityExpressionTransformer,
		_InExpressionTransformer: _InExpressionTransformer,
		_InExpressionTransformer$LCPSTransformCommand$LInExpression$: _InExpressionTransformer,
		_LogicalExpressionTransformer: _LogicalExpressionTransformer,
		_LogicalExpressionTransformer$LCPSTransformCommand$LLogicalExpression$: _LogicalExpressionTransformer,
		_ShiftExpressionTransformer: _ShiftExpressionTransformer,
		_ShiftExpressionTransformer$LCPSTransformCommand$LShiftExpression$: _ShiftExpressionTransformer,
		_ConditionalExpressionTransformer: _ConditionalExpressionTransformer,
		_ConditionalExpressionTransformer$LCPSTransformCommand$LConditionalExpression$: _ConditionalExpressionTransformer,
		_CallExpressionTransformer: _CallExpressionTransformer,
		_CallExpressionTransformer$LCPSTransformCommand$LCallExpression$: _CallExpressionTransformer,
		_SuperExpressionTransformer: _SuperExpressionTransformer,
		_SuperExpressionTransformer$LCPSTransformCommand$LSuperExpression$: _SuperExpressionTransformer,
		_NewExpressionTransformer: _NewExpressionTransformer,
		_NewExpressionTransformer$LCPSTransformCommand$LNewExpression$: _NewExpressionTransformer,
		_CommaExpressionTransformer: _CommaExpressionTransformer,
		_CommaExpressionTransformer$LCPSTransformCommand$LCommaExpression$: _CommaExpressionTransformer,
		_StatementTransformer: _StatementTransformer,
		_StatementTransformer$LCPSTransformCommand$S: _StatementTransformer,
		_ConstructorInvocationStatementTransformer: _ConstructorInvocationStatementTransformer,
		_ConstructorInvocationStatementTransformer$LCPSTransformCommand$LConstructorInvocationStatement$: _ConstructorInvocationStatementTransformer,
		_ExpressionStatementTransformer: _ExpressionStatementTransformer,
		_ExpressionStatementTransformer$LCPSTransformCommand$LExpressionStatement$: _ExpressionStatementTransformer,
		_FunctionStatementTransformer: _FunctionStatementTransformer,
		_FunctionStatementTransformer$LCPSTransformCommand$LFunctionStatement$: _FunctionStatementTransformer,
		_ReturnStatementTransformer: _ReturnStatementTransformer,
		_ReturnStatementTransformer$LCPSTransformCommand$LReturnStatement$: _ReturnStatementTransformer,
		_DeleteStatementTransformer: _DeleteStatementTransformer,
		_DeleteStatementTransformer$LCPSTransformCommand$LDeleteStatement$: _DeleteStatementTransformer,
		_BreakStatementTransformer: _BreakStatementTransformer,
		_BreakStatementTransformer$LCPSTransformCommand$LBreakStatement$: _BreakStatementTransformer,
		_ContinueStatementTransformer: _ContinueStatementTransformer,
		_ContinueStatementTransformer$LCPSTransformCommand$LContinueStatement$: _ContinueStatementTransformer,
		_LabellableStatementTransformer: _LabellableStatementTransformer,
		_LabellableStatementTransformer$LCPSTransformCommand$S: _LabellableStatementTransformer,
		_DoWhileStatementTransformer: _DoWhileStatementTransformer,
		_DoWhileStatementTransformer$LCPSTransformCommand$LDoWhileStatement$: _DoWhileStatementTransformer,
		_ForInStatementTransformer: _ForInStatementTransformer,
		_ForInStatementTransformer$LCPSTransformCommand$LForInStatement$: _ForInStatementTransformer,
		_ForStatementTransformer: _ForStatementTransformer,
		_ForStatementTransformer$LCPSTransformCommand$LForStatement$: _ForStatementTransformer,
		_IfStatementTransformer: _IfStatementTransformer,
		_IfStatementTransformer$LCPSTransformCommand$LIfStatement$: _IfStatementTransformer,
		_SwitchStatementTransformer: _SwitchStatementTransformer,
		_SwitchStatementTransformer$LCPSTransformCommand$LSwitchStatement$: _SwitchStatementTransformer,
		_CaseStatementTransformer: _CaseStatementTransformer,
		_CaseStatementTransformer$LCPSTransformCommand$LCaseStatement$: _CaseStatementTransformer,
		_DefaultStatementTransformer: _DefaultStatementTransformer,
		_DefaultStatementTransformer$LCPSTransformCommand$LDefaultStatement$: _DefaultStatementTransformer,
		_WhileStatementTransformer: _WhileStatementTransformer,
		_WhileStatementTransformer$LCPSTransformCommand$LWhileStatement$: _WhileStatementTransformer,
		_TryStatementTransformer: _TryStatementTransformer,
		_TryStatementTransformer$LCPSTransformCommand$LTryStatement$: _TryStatementTransformer,
		_CatchStatementTransformer: _CatchStatementTransformer,
		_CatchStatementTransformer$LCPSTransformCommand$LCatchStatement$: _CatchStatementTransformer,
		_ThrowStatementTransformer: _ThrowStatementTransformer,
		_ThrowStatementTransformer$LCPSTransformCommand$LThrowStatement$: _ThrowStatementTransformer,
		_AssertStatementTransformer: _AssertStatementTransformer,
		_AssertStatementTransformer$LCPSTransformCommand$LAssertStatement$: _AssertStatementTransformer,
		_LogStatementTransformer: _LogStatementTransformer,
		_LogStatementTransformer$LCPSTransformCommand$LLogStatement$: _LogStatementTransformer,
		_DebuggerStatementTransformer: _DebuggerStatementTransformer,
		_DebuggerStatementTransformer$LCPSTransformCommand$LDebuggerStatement$: _DebuggerStatementTransformer,
		GeneratorTransformCommand: GeneratorTransformCommand,
		GeneratorTransformCommand$LCompiler$: GeneratorTransformCommand,
		ANFTransformCommand: ANFTransformCommand,
		ANFTransformCommand$LCompiler$: ANFTransformCommand,
		CPSTransformCommand: CPSTransformCommand,
		CPSTransformCommand$LCompiler$: CPSTransformCommand,
		"_DeleteStatementTransformer._Stash": _DeleteStatementTransformer$x2E_Stash,
		"_DeleteStatementTransformer._Stash$LCPSTransformCommand$LDeleteStatement$": _DeleteStatementTransformer$x2E_Stash,
		"_SwitchStatementTransformer.CaseStash": _SwitchStatementTransformer$x2ECaseStash,
		"_SwitchStatementTransformer.CaseStash$": _SwitchStatementTransformer$x2ECaseStash
	},
	"src/transformer.jsx": {
		_Util: _Util$1,
		_Util$: _Util$1,
		TransformCommand: TransformCommand,
		TransformCommand$LCompiler$S: TransformCommand,
		FunctionTransformCommand: FunctionTransformCommand,
		FunctionTransformCommand$LCompiler$S: FunctionTransformCommand,
		ExpressionTransformCommand: ExpressionTransformCommand,
		ExpressionTransformCommand$LCompiler$S: ExpressionTransformCommand,
		FixedExpressionTransformCommand: FixedExpressionTransformCommand,
		FixedExpressionTransformCommand$LCompiler$: FixedExpressionTransformCommand,
		StatementTransformCommand: StatementTransformCommand,
		StatementTransformCommand$LCompiler$S: StatementTransformCommand,
		NormalizeTryStatementTransformCommand: NormalizeTryStatementTransformCommand,
		NormalizeTryStatementTransformCommand$LCompiler$: NormalizeTryStatementTransformCommand,
		ForInStatementTransformCommand: ForInStatementTransformCommand,
		ForInStatementTransformCommand$LCompiler$: ForInStatementTransformCommand
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
	if (! module) return;

	var testClass = module._Test;

	if (!testClass) return; // skip if there's no test class

	if(tests.length === 0) {
		var p = testClass.prototype;
		for (var m in p) {
			if (p[m] instanceof Function && m.match(/^test\w*$/)) {
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
JSX.runMain("src/jsx-node-front.jsx", process.argv.slice(2));
})(JSX);
