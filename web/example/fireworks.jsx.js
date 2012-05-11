function doit() {
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
	Object.defineProperty(obj, prop, {
		get: function () {
			return obj.p = func();
		},
		set: function (v) {
			Object.defineProperty(obj, prop, {
				value: v,
				enumerable: true,
				writable: true,
				configurable: true
			});
		},
		enumerable: true,
		configurable: true
	});
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
	this.posX = 0;
	this.posY = 0;
	this.velX = 0;
	this.velY = 0;
	this.size = 0;
	this.color = "";
	this.state = 0;
	/** @type {!number} */
	var angle;
	/** @type {!number} */
	var velocity;
	this.posX = posX;
	this.posY = posY;
	this.size = size;
	this.color = color;
	angle = Math.random() * Spark.rad;
	velocity = Math.random() * Config.speed;
	this.velX = Math.cos(angle) * velocity;
	this.velY = Math.sin(angle) * velocity;
};

Spark$NNNS.prototype = new Spark;

/**
 */
Spark.prototype._decay$ = function () {
	this.velX *= Config.decay;
	this.velY *= Config.decay;
	this.size *= Config.decay;
	if (this.size < 0.5 && this.state === 0) {
		this.color = Firework.randomColor$();
		this.size = Config.size;
		this.state++;
	} else {
	}
};

/**
 */
Spark.prototype._move$ = function () {
	this.posX += this.velX + Math.random() - 0.5;
	this.posY += this.velY + Math.random() - 0.5 + Config.gravity;
};

/**
 * @param {FireworkView} view
 */
Spark.prototype._render$LFireworkView$ = function (view) {
	view.cx.beginPath();
	view.cx.arc(this.posX, this.posY, this.size, 0, Spark.rad, true);
	view.cx.fillStyle = (Math.random() > 0.2 ? this.color : "white");
	view.cx.fill();
};

/**
 * @param {FireworkView} view
 * @return {!boolean}
 */
Spark.prototype._isLiving$LFireworkView$ = function (view) {
	if (this.size <= 0.01) {
		return false;
	} else {
	}
	if (this.posX <= 0) {
		return false;
	} else {
	}
	if (this.posX >= view.width || this.posY >= view.height) {
		return false;
	} else {
	}
	return true;
};

/**
 * @param {FireworkView} view
 * @return {!boolean}
 */
Spark.prototype.draw$LFireworkView$ = function (view) {
	this._decay$();
	(function () {
		this.posX += this.velX + Math.random() - 0.5;
		this.posY += this.velY + Math.random() - 0.5 + Config.gravity;
	}).call(this);
	this._render$LFireworkView$(view);
	return this._isLiving$LFireworkView$(view);
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
	this.sparks = [  ];
	this.view = null;
	/** @type {!string} */
	var color;
	/** @type {!number} */
	var i;
	this.view = view;
	color = "lime";
	for (i = 0; i < Config.quantity; ++ i) {
		this.sparks.push(new Spark$NNNS(x, y, Config.size, color));
	}
};

Firework$LFireworkView$II.prototype = new Firework;

/**
 * @return {!string}
 */
Firework.randomColor$ = function () {
	/** @type {!number} */
	var blightness;
	/** @type {Array.<undefined|!number>} */
	var rgb;
	/** @type {!number} */
	var i;
	blightness = 60;
	rgb = [  ];
	for (i = 0; i < 3; ++ i) {
		rgb[i] = Math.min(Math.random() * 0xFF + blightness | 0, 255);
	}
	return "rgb(" + (rgb[0] | 0) + "" + "," + (rgb[1] | 0) + "" + "," + (rgb[2] | 0) + "" + ")";
};

/**
 * @return {!boolean}
 */
Firework.prototype.update$ = function () {
	/** @type {!number} */
	var i;
	/** @type {undefined|Spark} */
	var s;
	for (i = 0; i < this.sparks.length; ++ i) {
		s = this.sparks[i];
		if (! s.draw$LFireworkView$(this.view)) {
			this.sparks.splice(i, 1);
		} else {
		}
	}
	return this.sparks.length > 0;
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
	this.cx = null;
	this.width = 0;
	this.height = 0;
	this.left = 0;
	this.top = 0;
	this.fireworks = [  ];
	this.numSparks = 0;
	var $this = this;
	/** @type {ClientRect} */
	var rect;
	this.cx = (function (o) { return o instanceof CanvasRenderingContext2D ? o : null; })(canvas.getContext("2d"));
	this.width = canvas.width;
	this.height = canvas.height;
	rect = canvas.getBoundingClientRect();
	this.left = rect.left | 0;
	this.top = rect.top | 0;
	canvas.addEventListener("mousedown", (function (e) {
		(function (x, y) {
			this.fireworks.push(new Firework$LFireworkView$II(this, x - this.left, y - this.top));
		}).call($this, e.clientX, e.clientY);
	}));
	canvas.addEventListener("touchstart", (function (e) {
		(function (x, y) {
			this.fireworks.push(new Firework$LFireworkView$II(this, x - this.left, y - this.top));
		}).call($this, e.touches[0].pageX, e.touches[0].pageY);
	}));
};

FireworkView$LHTMLCanvasElement$.prototype = new FireworkView;

/**
 * @param {!number} x
 * @param {!number} y
 */
FireworkView.prototype.explode$II = function (x, y) {
	this.fireworks.push(new Firework$LFireworkView$II(this, x - this.left, y - this.top));
};

/**
 */
FireworkView.prototype.update$ = function () {
	/** @type {!number} */
	var i;
	/** @type {undefined|Firework} */
	var fw;
	if (this.fireworks.length === 0) {
		(function (x, y) {
			this.fireworks.push(new Firework$LFireworkView$II(this, x - this.left, y - this.top));
		}).call(this, this.width / 2 + this.left, this.height / 3);
	} else {
	}
	this.numSparks = 0;
	for (i = 0; i < this.fireworks.length; ++ i) {
		fw = this.fireworks[i];
		if ((function () {
			/** @type {!number} */
			var i;
			/** @type {undefined|Spark} */
			var s;
			for (i = 0; i < this.sparks.length; ++ i) {
				s = this.sparks[i];
				if (! s.draw$LFireworkView$(this.view)) {
					this.sparks.splice(i, 1);
				} else {
				}
			}
			return this.sparks.length > 0;
		}).call(fw)) {
			this.numSparks += fw.sparks.length;
		} else {
			this.fireworks.splice(i, 1);
		}
	}
	this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
	this.cx.fillRect(0, 0, this.width, this.height);
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
	this.elementId = "";
	this.start = Date.now();
	this.frameCount = 0;
	this.elementId = elementId;
};

FPSWatcher$S.prototype = new FPSWatcher;

/**
 * @param {!number} numSparks
 */
FPSWatcher.prototype.update$I = function (numSparks) {
	/** @type {!string} */
	var message;
	++ this.frameCount;
	if (this.frameCount % 100 === 0) {
		message = "FPS: " + (this.frameCount / (Date.now() - this.start) * 1000 | 0) + "" + " (sparks: " + numSparks + "" + ")";
		(function (identifier) {
			return (function () {
				return js.global["window"];
			})().document.getElementById(identifier);
		})(this.elementId).innerHTML = message;
	} else {
	}
};

/**
 * class Application extends Object
 * @constructor
 */
function Application() {
}

Application.prototype = new Object;
/**
 * @constructor
 */
function Application$() {
};

Application$.prototype = new Application;

/**
 * @param {!string} canvasId
 * @param {!string} fpsId
 * @param {!number} quantity
 */
Application.main$SSI = function (canvasId, fpsId, quantity) {
	/** @type {HTMLCanvasElement} */
	var canvas;
	/** @type {FireworkView} */
	var view;
	/** @type {FPSWatcher} */
	var watcher;
	Config.quantity = quantity;
	canvas = (function (o) { return o instanceof HTMLCanvasElement ? o : null; })((function (identifier) {
		return (function () {
			return js.global["window"];
		})().document.getElementById(identifier);
	})(canvasId));
	view = new FireworkView$LHTMLCanvasElement$(canvas);
	watcher = new FPSWatcher$S(fpsId);
	(function () {
		return js.global["window"];
	})().setInterval((function () {
		view.update$();
		(function (numSparks) {
			/** @type {!string} */
			var message;
			++ this.frameCount;
			if (this.frameCount % 100 === 0) {
				message = "FPS: " + (this.frameCount / (Date.now() - this.start) * 1000 | 0) + "" + " (sparks: " + numSparks + "" + ")";
				(function (identifier) {
					return (function () {
						return js.global["window"];
					})().document.getElementById(identifier);
				})(this.elementId).innerHTML = message;
			} else {
			}
		}).call(watcher, view.numSparks);
	}), 0);
};

/**
 * class AbstractView extends Object
 * @constructor
 */
function AbstractView() {
}

AbstractView.prototype = new Object;
AbstractView.prototype.$__jsx_implements_AbstractView = true;

/**
 * @constructor
 */
function AbstractView$() {
};

AbstractView$.prototype = new AbstractView;

/**
 * class DocumentView extends Object
 * @constructor
 */
function DocumentView() {
}

DocumentView.prototype = new Object;
DocumentView.prototype.$__jsx_implements_DocumentView = true;

/**
 * @constructor
 */
function DocumentView$() {
};

DocumentView$.prototype = new DocumentView;

/**
 * class CanvasRenderingContext extends Object
 * @constructor
 */
function CanvasRenderingContext() {
}

CanvasRenderingContext.prototype = new Object;
CanvasRenderingContext.prototype.$__jsx_implements_CanvasRenderingContext = true;

/**
 * @constructor
 */
function CanvasRenderingContext$() {
};

CanvasRenderingContext$.prototype = new CanvasRenderingContext;

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
};

dom$.prototype = new dom;

/**
 * @return {Window}
 */
dom.getWindow$ = function () {
	return js.global["window"];
};

/**
 * @param {!string} identifier
 * @return {HTMLElement}
 */
dom.id$S = function (identifier) {
	return (function () {
		return js.global["window"];
	})().document.getElementById(identifier);
};

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
};

js$.prototype = new js;

Config.quantity = 360;
Config.size = 2.0;
Config.decay = 0.98;
Config.gravity = 2.0;
Config.speed = 6.0;
$__jsx_lazy_init(Spark, "rad", function () {
	return Math.PI * 2;
});
$__jsx_lazy_init(dom, "window", function () {
	return js.global["window"];
});
js.global = (function () { return this; })();

var $__jsx_classMap = {
	"web/example/fireworks.jsx": {
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
		Application: Application,
		Application$: Application$
	},
	"system:lib/js/js/dom.jsx": {
		AbstractView: AbstractView,
		AbstractView$: AbstractView$,
		DocumentView: DocumentView,
		DocumentView$: DocumentView$,
		CanvasRenderingContext: CanvasRenderingContext,
		CanvasRenderingContext$: CanvasRenderingContext$,
		dom: dom,
		dom$: dom$
	},
	"system:lib/js/js.jsx": {
		js: js,
		js$: js$
	}
};

Application.main$SSI("night-sky", "fps", 1000);
}
