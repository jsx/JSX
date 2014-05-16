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

/**
 * GeneratorFunction polyfill
 */
var GeneratorFunction = (function () {
  try {
    return Function('import { GeneratorFunction } from "std:iteration"; return GeneratorFunction')();
  } catch (e) {
    return $__jsx_generator_function_polyfill;
  }
})();

function $__jsx_generator_function_polyfill () {
}

/**
 * for generator emulation on non-ES6 environment
 */
$__jsx_extend([__jsx_generator_object], GeneratorFunction);
function __jsx_generator_object() {
  this.__next = 0;
  this.__loop = null;
  this.__seed = null;
  this.__value = undefined;
  this.__status = 'suspended';
}

__jsx_generator_object.prototype.next = function (seed) {
  switch (this.__status) {
  case 'suspended':
    this.__status = 'active';
    this.__seed = seed;

    // go next!
    this.__loop(this.__next);

    var done = false;
    if (this.__next != -1) {
      this.__status = 'suspended';
    } else {
      this.__status = 'dead';
      done = true;
    }
    return { value: this.__value, done: done };
  case 'active':
    throw new Error("Generator is already running");
  case 'dead':
    throw new Error("Generator is already finished");
  default:
    throw new Error("Unexpected generator internal state");
  }
};

/**
 * Promise polyfill
 */
var Promise = (function () {
  try {
    return Function('Promise')();
  } catch (e) {
    return $__jsx_promise_polyfill;
  }
})();

function $__jsx_promise_polyfill (handler) {
  this._status = 'pending';
  this._reactors = [];		// list of [ promise, onFulfilled, onRejected ]
  this._cache = undefined;

  handler(this._resolve.bind(this), this._reject.bind(this));
};

$__jsx_promise_polyfill.prototype._resolve = function (result) {
  if (this._status != 'pending')
    return;

  for (var i = 0; i < this._reactors.length; ++i) {
    var then = this._reactors[i][0];
    var onFulfilled = this._reactors[i][1];
    try {
      onFulfilled(result).then(then._resolve.bind(then),then._reject.bind(then));
    } catch (e) {
      then._reject(e);
    }
  }
  this._status = 'fulfilled';
  this._cache = result;
};

$__jsx_promise_polyfill.prototype._reject = function (reason) {
  if (this._status != 'pending')
    return;

  for (var i = 0; i < this._reactors.length; ++i) {
    var then = this._reactors[i][0];
    var onRejected = this._reactors[i][2];
    try {
      onRejected(result).then(then._resolve.bind(then),then._reject.bind(then));
    } catch (e) {
      then._reject(e);
    }
  }
  this._status = 'rejected';
  this._cache = reason;
};

$__jsx_promise_polyfill.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = onFulfilled || function (x) { return x };
  onRejected = onRejected || function (x) { throw x };

  switch (this._status) {
  case 'pending':
    var then = new Promise(function () {});
    this._reactors.push([then, onFulfilled, onRejected]);
    return then;
  case 'fulfilled':
    try {
      return onFulfilled(this._cache);
    } catch (e) {
      return Promise.reject(e);
    }
  case 'rejected':
    try {
      return onRejected(this._cache);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

$__jsx_promise_polyfill.prototype.catch = function (onRejected) {
  this.then(undefined, onRejected);
};

$__jsx_promise_polyfill.all = function (promises) {
  return new Promise(function (resolve, reject) {
    var results = [];

    if (promises.length == 0) {
      resolve(results);
      return;
    }

    var count = 0;
    for (var i = 0; i < promises.length; ++i) {
      promises[i].then(
	(function (i) {
	  return function (result) {
	    results[i] = result;
	    if (++count == promises.length) {
	      resolve(results);
	      return;
	    }
	  }
	})(i),
	function (reason) {
	  reject(reason);
	});
    }
  });
};

$__jsx_promise_polyfill.race = function (promises) {
 return new Promise(function (resolve, reject) {
   var done = false;
   for (var i = 0; i < promises.length; ++i) {
     promises[i].then(
       function (result) {
	 if (! done) {
	   done = true;
	   resolve(result);
	   return;
	 }
       },
       function (reason) {
	 if (! done) {
	   done = true;
	   reject(result);
	   return;
	 }
       });
   }
 });
};

$__jsx_promise_polyfill.resolve = function (result) {
  return new Promise(function (resolve, reject) { resolve(result); });
};

$__jsx_promise_polyfill.reject = function (reason) {
  return new Promise(function (resolve, reject) { reject(reason); });
};

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
