var JSX = {};
(function () {

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
 * global functions called by JSX
 * (enamed so that they do not conflict with local variable names)
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

JSX.postProfileResults = function (url) {
	if ($__jsx_profiler.postResults == null)
		throw new Error("profiler has not been turned on");
	return $__jsx_profiler.postResults(url);
};
/**
 * class Config extends Object
 * @constructor
 */
function Config() {
}

Config.prototype = new Object;
/**
 * @constructor
 */
function Config$() {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Config#constructor()");
	$__jsx_profiler.exit();
};

Config$.prototype = new Config;

/**
 * class Spark extends Object
 * @constructor
 */
function Spark() {
}

Spark.prototype = new Object;
/**
 * @constructor
 * @param {!number} posX
 * @param {!number} posY
 * @param {!number} size
 * @param {!string} color
 */
function Spark$NNNS(posX, posY, size, color) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#constructor(:number,\u0020:number,\u0020:number,\u0020:string)");
	/** @type {!number} */
	var angle;
	/** @type {!number} */
	var velocity;
	this.state = 0;
	this.posX = posX;
	this.posY = posY;
	this.size = size;
	this.color = color;
	angle = Math.random() * Spark.rad;
	velocity = Math.random() * Config.speed;
	this.velX = Math.cos(angle) * velocity;
	this.velY = Math.sin(angle) * velocity;
	$__jsx_profiler.exit();
};

Spark$NNNS.prototype = new Spark;

/**
 */
Spark.prototype._decay$ = function () {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#_decay()");
	this.velX *= Config.decay;
	this.velY *= Config.decay;
	this.size *= Config.decay;
	if (this.size < 0.5 && this.state === 0) {
		this.color = Firework$randomColor$();
		this.size = Config.size;
		this.state++;
	}
	$__jsx_profiler.exit();
};

/**
 */
Spark.prototype._move$ = function () {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#_move()");
	this.posX += this.velX + (Math.random() - 0.5);
	this.posY += this.velY + (Math.random() - 0.5) + Config.gravity;
	$__jsx_profiler.exit();
};

/**
 * @param {FireworkView} view
 */
Spark.prototype._render$LFireworkView$ = function (view) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#_render(:FireworkView)");
	view.cx.beginPath();
	view.cx.arc(this.posX, this.posY, this.size, 0, Spark.rad, true);
	view.cx.fillStyle = (Math.random() > 0.2 ? this.color : "white");
	view.cx.fill();
	$__jsx_profiler.exit();
};

/**
 * @param {FireworkView} view
 * @return {!boolean}
 */
Spark.prototype._isLiving$LFireworkView$ = function (view) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#_isLiving(:FireworkView)");
	if (this.size <= 0.01) {
		return $__jsx_profiler.exit(false);
	}
	if (this.posX <= 0) {
		return $__jsx_profiler.exit(false);
	}
	if (this.posX >= view.width || this.posY >= view.height) {
		return $__jsx_profiler.exit(false);
	}
	return $__jsx_profiler.exit(true);
};

/**
 * @param {FireworkView} view
 * @return {!boolean}
 */
Spark.prototype.draw$LFireworkView$ = function (view) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Spark#draw(:FireworkView)");
	this._decay$();
	this._move$();
	this._render$LFireworkView$(view);
	return $__jsx_profiler.exit(this._isLiving$LFireworkView$(view));
};

/**
 * class Firework extends Object
 * @constructor
 */
function Firework() {
}

Firework.prototype = new Object;
/**
 * @constructor
 * @param {FireworkView} view
 * @param {!number} x
 * @param {!number} y
 */
function Firework$LFireworkView$II(view, x, y) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Firework#constructor(:FireworkView,\u0020:int,\u0020:int)");
	/** @type {!string} */
	var color;
	/** @type {!number} */
	var i;
	this.sparks = [  ];
	this.view = view;
	color = "lime";
	for (i = 0; i < Config.quantity; ++ i) {
		this.sparks.push(new Spark$NNNS(x, y, Config.size, color));
	}
	$__jsx_profiler.exit();
};

Firework$LFireworkView$II.prototype = new Firework;

/**
 * @return {!string}
 */
Firework.randomColor$ = function () {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Firework.randomColor()");
	/** @type {!number} */
	var blightness;
	/** @type {Array.<undefined|!number>} */
	var rgb;
	/** @type {!number} */
	var i;
	blightness = 60;
	rgb = [  ];
	for (i = 0; i < 3; ++ i) {
		rgb[i] = (Math.min(Math.random() * 0xFF + blightness | 0, 255) | 0);
	}
	return $__jsx_profiler.exit("rgb(" + (rgb[0] + "") + "," + (rgb[1] + "") + "," + (rgb[2] + "") + ")");
};

var Firework$randomColor$ = Firework.randomColor$;

/**
 * @return {!boolean}
 */
Firework.prototype.update$ = function () {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("Firework#update()");
	/** @type {!number} */
	var i;
	/** @type {Spark} */
	var s;
	for (i = 0; i < this.sparks.length; ++ i) {
		s = this.sparks[i];
		if (! s.draw$LFireworkView$(this.view)) {
			this.sparks.splice(i, 1);
		}
	}
	return $__jsx_profiler.exit(this.sparks.length > 0);
};

/**
 * class FireworkView extends Object
 * @constructor
 */
function FireworkView() {
}

FireworkView.prototype = new Object;
/**
 * @constructor
 * @param {HTMLCanvasElement} canvas
 */
function FireworkView$LHTMLCanvasElement$(canvas) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("FireworkView#constructor(:HTMLCanvasElement)");
	var $this = this;
	/** @type {ClientRect} */
	var rect;
	this.fireworks = [  ];
	this.numSparks = 0;
	this.cx = (function (o) { return o instanceof CanvasRenderingContext2D ? o : null; })(canvas.getContext("2d"));
	this.width = canvas.width;
	this.height = canvas.height;
	rect = canvas.getBoundingClientRect();
	this.left = (rect.left | 0);
	this.top = (rect.top | 0);
	canvas.addEventListener("mousedown", (function (e) {
		var $__jsx_profiler_ctx = $__jsx_profiler.enter("FireworkView.line_137(:Event)");
		/** @type {MouseEvent} */
		var me;
		me = (function (o) { return o instanceof MouseEvent ? o : null; })(e);
		if (! (me != undefined)) {
			debugger;
			throw new Error("[web/profiler/fireworks.jsx:139] assertion failure");
		}
		$this.explode$II(me.clientX, me.clientY);
		$__jsx_profiler.exit();
	}));
	canvas.addEventListener("touchstart", (function (e) {
		var $__jsx_profiler_ctx = $__jsx_profiler.enter("FireworkView.line_142(:Event)");
		/** @type {TouchEvent} */
		var te;
		te = (function (o) { return o instanceof TouchEvent ? o : null; })(e);
		if (! (te != undefined)) {
			debugger;
			throw new Error("[web/profiler/fireworks.jsx:144] assertion failure");
		}
		$this.explode$II(te.touches[0].pageX, te.touches[0].pageY);
		$__jsx_profiler.exit();
	}));
	$__jsx_profiler.exit();
};

FireworkView$LHTMLCanvasElement$.prototype = new FireworkView;

/**
 * @param {!number} x
 * @param {!number} y
 */
FireworkView.prototype.explode$II = function (x, y) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("FireworkView#explode(:int,\u0020:int)");
	this.fireworks.push(new Firework$LFireworkView$II(this, x - this.left, y - this.top));
	$__jsx_profiler.exit();
};

/**
 */
FireworkView.prototype.update$ = function () {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("FireworkView#update()");
	/** @type {!number} */
	var i;
	/** @type {Firework} */
	var fw;
	if (this.fireworks.length === 0) {
		this.explode$II(this.width / 2 + this.left, this.height / 3);
	}
	this.numSparks = 0;
	for (i = 0; i < this.fireworks.length; ++ i) {
		fw = this.fireworks[i];
		if (fw.update$()) {
			this.numSparks += fw.sparks.length;
		} else {
			this.fireworks.splice(i, 1);
		}
	}
	this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
	this.cx.fillRect(0, 0, this.width, this.height);
	$__jsx_profiler.exit();
};

/**
 * class FPSWatcher extends Object
 * @constructor
 */
function FPSWatcher() {
}

FPSWatcher.prototype = new Object;
/**
 * @constructor
 * @param {!string} elementId
 */
function FPSWatcher$S(elementId) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("FPSWatcher#constructor(:string)");
	this.start = Date.now();
	this.frameCount = 0;
	this.elementId = elementId;
	$__jsx_profiler.exit();
};

FPSWatcher$S.prototype = new FPSWatcher;

/**
 * @param {!number} numSparks
 */
FPSWatcher.prototype.update$I = function (numSparks) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("FPSWatcher#update(:int)");
	/** @type {!string} */
	var message;
	++ this.frameCount;
	if (this.frameCount % 100 === 0) {
		message = "FPS: " + ((this.frameCount / (Date.now() - this.start) * 1000 | 0) + "") + " (sparks: " + (numSparks + "") + ")";
		dom$id$S(this.elementId).innerHTML = message;
	}
	$__jsx_profiler.exit();
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
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("_Main#constructor()");
	$__jsx_profiler.exit();
};

_Main$.prototype = new _Main;

/**
 * @param {Array.<undefined|!string>} args
 */
_Main.main$AS = function (args) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("_Main.main(:Array.<string>)");
	/** @type {HTMLCanvasElement} */
	var canvas;
	/** @type {FireworkView} */
	var view;
	/** @type {FPSWatcher} */
	var watcher;
	canvas = (function (o) { return o instanceof HTMLCanvasElement ? o : null; })(dom$id$S(Config.canvasId));
	view = new FireworkView$LHTMLCanvasElement$(canvas);
	watcher = new FPSWatcher$S(Config.fpsElementId);
	dom.window.setInterval((function () {
		var $__jsx_profiler_ctx = $__jsx_profiler.enter("_Main.line_205()");
		view.update$();
		watcher.update$I(view.numSparks);
		$__jsx_profiler.exit();
	}), 0);
	if (JSX.profilerIsRunning()) {
		console.log("profiler is running");
		dom.window.setTimeout((function () {
			var $__jsx_profiler_ctx = $__jsx_profiler.enter("_Main.line_212()");
			JSX.postProfileResults("http://localhost:5000/post-profile");
			dom.window.location.href = "http://localhost:5000/web/profiler.html";
			$__jsx_profiler.exit();
		}), 10 * 1000);
	}
	$__jsx_profiler.exit();
};

var _Main$main$AS = _Main.main$AS;

/**
 * class dom extends Object
 * @constructor
 */
function dom() {
}

dom.prototype = new Object;
/**
 * @constructor
 */
function dom$() {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("dom#constructor()");
	$__jsx_profiler.exit();
};

dom$.prototype = new dom;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.id$S = function (id) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("dom.id(:string)");
	return $__jsx_profiler.exit((function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id)));
};

var dom$id$S = dom.id$S;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.getElementById$S = function (id) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("dom.getElementById(:string)");
	return $__jsx_profiler.exit((function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id)));
};

var dom$getElementById$S = dom.getElementById$S;

/**
 * @param {!string} tag
 * @return {HTMLElement}
 */
dom.createElement$S = function (tag) {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("dom.createElement(:string)");
	return $__jsx_profiler.exit((function (v) {
		if (! (v == null || v instanceof HTMLElement)) {
			debugger;
			throw new Error("[/Users/fuji.goro/repo/JSX/lib/js/js/web.jsx:30] detected invalid cast, value is not an instance of the designated type or null");
		}
		return v;
	}(dom.window.document.createElement(tag))));
};

var dom$createElement$S = dom.createElement$S;

/**
 * class js extends Object
 * @constructor
 */
function js() {
}

js.prototype = new Object;
/**
 * @constructor
 */
function js$() {
	var $__jsx_profiler_ctx = $__jsx_profiler.enter("js#constructor()");
	$__jsx_profiler.exit();
};

js$.prototype = new js;

Config.quantity = 360;
Config.size = 2.0;
Config.decay = 0.98;
Config.gravity = 2.0;
Config.speed = 6.0;
Config.canvasId = "night-sky";
Config.fpsElementId = "fps";
$__jsx_lazy_init(Spark, "rad", function () {
	return Math.PI * 2;
});
$__jsx_lazy_init(dom, "window", function () {
	return js.global.window;
});
js.global = (function () { return this; })();

var $__jsx_classMap = {
	"web/profiler/fireworks.jsx": {
		Config: Config,
		Config$: Config$,
		Spark: Spark,
		Spark$NNNS: Spark$NNNS,
		Firework: Firework,
		Firework$LFireworkView$II: Firework$LFireworkView$II,
		FireworkView: FireworkView,
		FireworkView$LHTMLCanvasElement$: FireworkView$LHTMLCanvasElement$,
		FPSWatcher: FPSWatcher,
		FPSWatcher$S: FPSWatcher$S,
		_Main: _Main,
		_Main$: _Main$
	},
	"system:lib/js/js/web.jsx": {
		dom: dom,
		dom$: dom$
	},
	"system:lib/js/js.jsx": {
		js: js,
		js$: js$
	}
};


(function () {

	var Profiler = $__jsx_profiler;

	var stack = [ {
		$name: "<<root>>",
		$cur_exclusive: Date.now()
	} ];

	Profiler.enter = function (name) {
		var now = Date.now();
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive -= now;
		var callee = caller[name];
		if (callee) {
			callee.$cur_inclusive = now;
			callee.$cur_exclusive = now;
		} else {
			callee = caller[name] = {
				$name: name,
				$cur_inclusive: now,
				$cur_exclusive: now,
				$inclusive: 0,
				$exclusive: 0,
				$count: 0
			};
		}
		stack.push(callee);
		return stack.length;
	};

	Profiler.exit = function (retval) {
		var now = Date.now();
		var callee = stack.pop();
		++callee.$count;
		callee.$exclusive += now - callee.$cur_exclusive;
		callee.$inclusive += now - callee.$cur_inclusive;
		var caller = stack[stack.length - 1];
		caller.$cur_exclusive += now;
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

	Profiler.postResults = function (url) {
		// post target should support gist-style API
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.log(xhr.responseText);
				} else {
					console.log("failed to upload profiler results, received " + xhr.status + " response from server");
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(Profiler.getResults()));
	};

})();
/**
 * launches _Main.main(:string[]):void invoked by jsx --run|--executable
 */
JSX.runMain = function (sourceFile, args) {
	var module = JSX.require(sourceFile);

	if (! module._Main) {
		throw new Error("entry point _Main not found in " + sourceFile);
	}
	if (! module._Main.main$AS) {
		throw new Error("entry point _Main.main(:string[]):void not found in " + sourceFile);
	}

	module._Main.main$AS(args);
}

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

	var test = new testClass();

	if (test.beforeClass$AS != null)
		test.beforeClass$AS(tests);

	for (var i = 0; i < tests.length; ++i) {
		(function (m) {
			test.run$SF$V$(m, function() { test[m](); });
		}(tests[i]));
	}

	if (test.afterClass$ != null)
		test.afterClass$();
}
/**
 * call a function on load/DOMContentLoaded
 */
function $__jsx_onload (event) {
	window.removeEventListener("load", $__jsx_onload);
	window.removeEventListener("DOMContentLoaded", $__jsx_onload);
	JSX.runMain("web/profiler/fireworks.jsx", [])
}

window.addEventListener("load", $__jsx_onload);
window.addEventListener("DOMContentLoaded", $__jsx_onload);

})();
