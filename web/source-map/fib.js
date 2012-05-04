/**
 * copies the implementations from source interface to target
 */
function $__jsx_merge_interface(target, source) {
	for (var k in source.prototype)
		if (source.prototype.hasOwnProperty(k))
			target.prototype[k] = source.prototype[k];
}

/*
 * global functions called by JSX as Number.* (renamed so that they do not conflict with local variable names)
 */
var $__jsx_parseInt = parseInt;
var $__jsx_parseFloat = parseFloat;
var $__jsx_isNaN = isNaN;
var $__jsx_isFinite = isFinite;

/*
 * public interface to JSX code
 */
var JSX = {};

JSX.require = function (path) {
	var m = $__jsx_classMap[path];
	return m !== undefined ? m : null;
}

/**
 * class Fib extends Object
 * @constructor
 */
function Fib() {
}

Fib.prototype = new Object;
/**
 * @constructor
 */
function Fib$() {
};

Fib$.prototype = new Fib;

/**
 * @param {!number} n
 * @return {!number}
 */
Fib.fib1$I = function (n) {
	if (n <= 2) {
		return 1;
	} else {
		return Fib.fib1$I(n - 1) + Fib.fib1$I(n - 2);
	}
};

/**
 * @param {!number} n
 * @return {!number}
 */
Fib.fib2$N = function (n) {
	return n <= 2 ? 1 : Fib.fib2$N(n - 1) + Fib.fib2$N(n - 2);
};

/**
 * @param {!number} n
 * @return {!number}
 */
Fib.fib3$I = function (n) {
	/** @type {!number} */
	var value = 0;
	/** @type {!number} */
	var prevValue = 0;
	/** @type {!number} */
	var i = 0;
	/** @type {!number} */
	var t = 0;
	if (n <= 2) {
		return 1;
	} else {
	}
	value = 1;
	prevValue = 1;
	for (i = 3; i <= n; i++) {
		t = value + prevValue;
		prevValue = value;
		value = t;
	}
	return value;
};

/**
 * @param {!number} n
 * @return {!number}
 */
Fib.fib4$I = function (n) {
	switch (n) {
	case 1:
		return 1;
	case 2:
		return 1;
	default:
		return Fib.fib4$I(n - 1) + Fib.fib4$I(n - 2);
	}
};

/**
 * class _Main extends Object
 * @constructor
 */
function _Main() {
}

_Main.prototype = new Object;
/**
 * @constructor
 */
function _Main$() {
};

_Main$.prototype = new _Main;

/**
 * @param {Array.<undefined|?string>} args
 */
_Main.main$AS = function (args) {
	console.log(Fib.fib1$I(10));
};

/**
 * class _Test extends Object
 * @constructor
 */
function _Test() {
}

_Test.prototype = new Object;
/**
 * @constructor
 */
function _Test$() {
};

_Test$.prototype = new _Test;

/**
 */
_Test.prototype.test_fib1$ = function () {
	console.log("fib1(10) = " + Fib.fib1$I(10).toString());
};

/**
 */
_Test.prototype.test_fib2$ = function () {
	console.log("fib2(10) = " + Fib.fib2$N(10).toString());
};

/**
 */
_Test.prototype.test_fib3$ = function () {
	console.log("fib3(10) = " + Fib.fib3$I(10).toString());
};

/**
 */
_Test.prototype.test_fib4$ = function () {
	console.log("fib4(10) = " + Fib.fib4$I(10).toString());
};

var $__jsx_classMap = {
	"example/fib.jsx": {
		Fib: Fib,
		Fib$: Fib$,
		_Main: _Main,
		_Main$: _Main$,
		_Test: _Test,
		_Test$: _Test$
	}
};


//@ sourceMappingURL=fib.js.mapping
