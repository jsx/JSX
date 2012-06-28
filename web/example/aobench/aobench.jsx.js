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
};

Config$.prototype = new Config;

/**
 * class vec3 extends Object
 * @constructor
 */
function vec3() {
}

vec3.prototype = new Object;
/**
 * @constructor
 * @param {!number} x
 * @param {!number} y
 * @param {!number} z
 */
function vec3$NNN(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

vec3$NNN.prototype = new vec3;

/**
 * @param {vec3} a
 * @param {vec3} b
 * @return {vec3}
 */
vec3.vadd$Lvec3$Lvec3$ = function (a, b) {
	return new vec3$NNN(a.x + b.x, a.y + b.y, a.z + b.z);
};

var vec3$vadd$Lvec3$Lvec3$ = vec3.vadd$Lvec3$Lvec3$;

/**
 * @param {vec3} a
 * @param {vec3} b
 * @return {vec3}
 */
vec3.vsub$Lvec3$Lvec3$ = function (a, b) {
	return new vec3$NNN(a.x - b.x, a.y - b.y, a.z - b.z);
};

var vec3$vsub$Lvec3$Lvec3$ = vec3.vsub$Lvec3$Lvec3$;

/**
 * @param {vec3} a
 * @param {vec3} b
 * @return {vec3}
 */
vec3.vcross$Lvec3$Lvec3$ = function (a, b) {
	return new vec3$NNN(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
};

var vec3$vcross$Lvec3$Lvec3$ = vec3.vcross$Lvec3$Lvec3$;

/**
 * @param {vec3} a
 * @param {vec3} b
 * @return {!number}
 */
vec3.vdot$Lvec3$Lvec3$ = function (a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

var vec3$vdot$Lvec3$Lvec3$ = vec3.vdot$Lvec3$Lvec3$;

/**
 * @param {vec3} a
 * @return {!number}
 */
vec3.vlength$Lvec3$ = function (a) {
	return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
};

var vec3$vlength$Lvec3$ = vec3.vlength$Lvec3$;

/**
 * @param {vec3} a
 * @return {vec3}
 */
vec3.vnormalize$Lvec3$ = function (a) {
	/** @type {!number} */
	var len;
	/** @type {vec3} */
	var v;
	len = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
	v = new vec3$NNN(a.x, a.y, a.z);
	if ((len >= 0 ? len : - len) > 1.0e-17) {
		v.x /= len;
		v.y /= len;
		v.z /= len;
	}
	return v;
};

var vec3$vnormalize$Lvec3$ = vec3.vnormalize$Lvec3$;

/**
 * class Isect extends Object
 * @constructor
 */
function Isect() {
}

Isect.prototype = new Object;
/**
 * @constructor
 */
function Isect$() {
	this.t = 1000000.0;
	this.hit = false;
	this.p = new vec3$NNN(0.0, 0.0, 0.0);
	this.n = new vec3$NNN(0.0, 0.0, 0.0);
};

Isect$.prototype = new Isect;

/**
 * class Ray extends Object
 * @constructor
 */
function Ray() {
}

Ray.prototype = new Object;
/**
 * @constructor
 * @param {vec3} org
 * @param {vec3} dir
 */
function Ray$Lvec3$Lvec3$(org, dir) {
	this.org = org;
	this.dir = dir;
};

Ray$Lvec3$Lvec3$.prototype = new Ray;

/**
 * class Sphere extends Object
 * @constructor
 */
function Sphere() {
}

Sphere.prototype = new Object;
/**
 * @constructor
 * @param {vec3} center
 * @param {!number} radius
 */
function Sphere$Lvec3$N(center, radius) {
	this.center = center;
	this.radius = radius;
};

Sphere$Lvec3$N.prototype = new Sphere;

/**
 * @param {Ray} ray
 * @param {Isect} isect
 */
Sphere.prototype.intersect$LRay$LIsect$ = function (ray, isect) {
	/** @type {vec3} */
	var rs;
	/** @type {!number} */
	var B;
	/** @type {!number} */
	var C;
	/** @type {!number} */
	var D;
	/** @type {!number} */
	var t;
	/** @type {vec3} */
	var n;
	/** @type {vec3} */
	var a$0;
	/** @type {vec3} */
	var b$0;
	/** @type {vec3} */
	var b$1;
	/** @type {vec3} */
	var a$1;
	/** @type {vec3} */
	var b$2;
	a$0 = ray.org;
	b$0 = this.center;
	rs = new vec3$NNN(a$0.x - b$0.x, a$0.y - b$0.y, a$0.z - b$0.z);
	b$1 = ray.dir;
	B = rs.x * b$1.x + rs.y * b$1.y + rs.z * b$1.z;
	C = rs.x * rs.x + rs.y * rs.y + rs.z * rs.z - this.radius * this.radius;
	D = B * B - C;
	if (D > 0.0) {
		t = - B - Math.sqrt(D);
		if (t > 0.0 && t < isect.t) {
			isect.t = t;
			isect.hit = true;
			isect.p = new vec3$NNN(ray.org.x + ray.dir.x * t, ray.org.y + ray.dir.y * t, ray.org.z + ray.dir.z * t);
			a$1 = isect.p;
			b$2 = this.center;
			n = new vec3$NNN(a$1.x - b$2.x, a$1.y - b$2.y, a$1.z - b$2.z);
			isect.n = vec3$vnormalize$Lvec3$(n);
		}
	}
};

/**
 * class Plane extends Object
 * @constructor
 */
function Plane() {
}

Plane.prototype = new Object;
/**
 * @constructor
 * @param {vec3} p
 * @param {vec3} n
 */
function Plane$Lvec3$Lvec3$(p, n) {
	this.p = p;
	this.n = n;
};

Plane$Lvec3$Lvec3$.prototype = new Plane;

/**
 * @param {Ray} ray
 * @param {Isect} isect
 */
Plane.prototype.intersect$LRay$LIsect$ = function (ray, isect) {
	/** @type {!number} */
	var d;
	/** @type {!number} */
	var v;
	/** @type {!number} */
	var t;
	/** @type {vec3} */
	var a$0;
	/** @type {vec3} */
	var b$0;
	d = - vec3$vdot$Lvec3$Lvec3$(this.p, this.n);
	a$0 = ray.dir;
	b$0 = this.n;
	v = a$0.x * b$0.x + a$0.y * b$0.y + a$0.z * b$0.z;
	if ((v >= 0 ? v : - v) < 1.0e-17) {
		return;
	}
	t = - (vec3$vdot$Lvec3$Lvec3$(ray.org, this.n) + d) / v;
	if (t > 0.0 && t < isect.t) {
		isect.hit = true;
		isect.t = t;
		isect.n = this.n;
		isect.p = new vec3$NNN(ray.org.x + t * ray.dir.x, ray.org.y + t * ray.dir.y, ray.org.z + t * ray.dir.z);
	}
};

/**
 * class AOBench extends Object
 * @constructor
 */
function AOBench() {
}

AOBench.prototype = new Object;
/**
 * @constructor
 */
function AOBench$() {
	this.spheres = [ new Sphere$Lvec3$N(new vec3$NNN(-2, 0.0, -3.5), 0.5), new Sphere$Lvec3$N(new vec3$NNN(-0.5, 0.0, -3), 0.5), new Sphere$Lvec3$N(new vec3$NNN(1.0, 0.0, -2.2), 0.5) ];
	this.plane = new Plane$Lvec3$Lvec3$(new vec3$NNN(0.0, -0.5, 0.0), new vec3$NNN(0.0, 1.0, 0.0));
};

AOBench$.prototype = new AOBench;

/**
 * @param {!number} f
 * @return {!number}
 */
AOBench.prototype.clamp$N = function (f) {
	/** @type {!number} */
	var i;
	i = f * 255.0;
	if (i > 255.0) {
		i = 255.0;
	}
	if (i < 0.0) {
		i = 0.0;
	}
	return Math.round(i);
};

/**
 * @param {Array.<undefined|vec3>} basis
 * @param {vec3} n
 */
AOBench.prototype.orthoBasis$ALvec3$Lvec3$ = function (basis, n) {
	/** @type {vec3} */
	var a$0;
	/** @type {vec3} */
	var b$0;
	/** @type {vec3} */
	var a$1;
	/** @type {vec3} */
	var b$1;
	basis[2] = n;
	basis[1] = new vec3$NNN(0.0, 0.0, 0.0);
	if (n.x < 0.6 && n.x > -0.6) {
		basis[1].x = 1.0;
	} else {
		if (n.y < 0.6 && n.y > -0.6) {
			basis[1].y = 1.0;
		} else {
			if (n.z < 0.6 && n.z > -0.6) {
				basis[1].z = 1.0;
			} else {
				basis[1].x = 1.0;
			}
		}
	}
	a$0 = basis[1];
	b$0 = basis[2];
	basis[0] = new vec3$NNN(a$0.y * b$0.z - a$0.z * b$0.y, a$0.z * b$0.x - a$0.x * b$0.z, a$0.x * b$0.y - a$0.y * b$0.x);
	basis[0] = vec3$vnormalize$Lvec3$(basis[0]);
	a$1 = basis[2];
	b$1 = basis[0];
	basis[1] = new vec3$NNN(a$1.y * b$1.z - a$1.z * b$1.y, a$1.z * b$1.x - a$1.x * b$1.z, a$1.x * b$1.y - a$1.y * b$1.x);
	basis[1] = vec3$vnormalize$Lvec3$(basis[1]);
};

/**
 * @param {Isect} isect
 * @return {vec3}
 */
AOBench.prototype.ambient_occlusion$LIsect$ = function (isect) {
	/** @type {Array.<undefined|vec3>} */
	var basis;
	/** @type {vec3} */
	var p;
	/** @type {!number} */
	var occlusion;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var phi;
	/** @type {!number} */
	var x;
	/** @type {!number} */
	var y;
	/** @type {!number} */
	var z;
	/** @type {!number} */
	var rx;
	/** @type {!number} */
	var ry;
	/** @type {!number} */
	var rz;
	/** @type {vec3} */
	var raydir;
	/** @type {Ray} */
	var ray;
	/** @type {Isect} */
	var occIsect;
	/** @type {!number} */
	var occ_f;
	basis = new Array(3);
	this.orthoBasis$ALvec3$Lvec3$(basis, isect.n);
	p = new vec3$NNN(isect.p.x + 0.0001 * isect.n.x, isect.p.y + 0.0001 * isect.n.y, isect.p.z + 0.0001 * isect.n.z);
	occlusion = 0;
	for (j = 0; j < 8; j++) {
		for (i = 0; i < 8; i++) {
			r = Math.random();
			phi = 6.283185307179586 * Math.random();
			x = Math.cos(phi) * Math.sqrt(1.0 - r);
			y = Math.sin(phi) * Math.sqrt(1.0 - r);
			z = Math.sqrt(r);
			rx = x * basis[0].x + y * basis[1].x + z * basis[2].x;
			ry = x * basis[0].y + y * basis[1].y + z * basis[2].y;
			rz = x * basis[0].z + y * basis[1].z + z * basis[2].z;
			raydir = new vec3$NNN(rx, ry, rz);
			ray = new Ray$Lvec3$Lvec3$(p, raydir);
			occIsect = new Isect$();
			this.spheres[0].intersect$LRay$LIsect$(ray, occIsect);
			this.spheres[1].intersect$LRay$LIsect$(ray, occIsect);
			this.spheres[2].intersect$LRay$LIsect$(ray, occIsect);
			this.plane.intersect$LRay$LIsect$(ray, occIsect);
			if (occIsect.hit) {
				occlusion++;
			}
		}
	}
	occ_f = (64 - occlusion) / 64;
	return new vec3$NNN(occ_f, occ_f, occ_f);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {!number} w
 * @param {!number} h
 */
AOBench.prototype.render$LCanvasRenderingContext2D$II = function (ctx, w, h) {
	/** @type {!number} */
	var cnt;
	/** @type {!number} */
	var x;
	/** @type {!number} */
	var y;
	/** @type {!number} */
	var half_w;
	/** @type {!number} */
	var half_h;
	/** @type {!number} */
	var px;
	/** @type {!number} */
	var py;
	/** @type {vec3} */
	var eye;
	/** @type {Ray} */
	var ray;
	/** @type {Isect} */
	var isect;
	/** @type {vec3} */
	var col;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var g;
	/** @type {!number} */
	var b;
	cnt = 0;
	half_w = w * .5;
	half_h = h * .5;
	for (y = 0; y < h; y++) {
		for (x = 0; x < w; x++) {
			cnt++;
			px = (x - half_w) / half_w;
			py = - (y - half_h) / half_h;
			eye = vec3$vnormalize$Lvec3$(new vec3$NNN(px, py, -1));
			ray = new Ray$Lvec3$Lvec3$(new vec3$NNN(0.0, 0.0, 0.0), eye);
			isect = new Isect$();
			this.spheres[0].intersect$LRay$LIsect$(ray, isect);
			this.spheres[1].intersect$LRay$LIsect$(ray, isect);
			this.spheres[2].intersect$LRay$LIsect$(ray, isect);
			this.plane.intersect$LRay$LIsect$(ray, isect);
			col = new vec3$NNN(0.0, 0.0, 0.0);
			if (isect.hit) {
				col = this.ambient_occlusion$LIsect$(isect);
			}
			r = col.x * 255.0 | 0;
			g = col.y * 255.0 | 0;
			b = col.z * 255.0 | 0;
			ctx.fillStyle = "rgb(" + (r + "") + "," + (g + "") + "," + (b + "") + ")";
			ctx.fillRect(x, y, 1, 1);
		}
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
 * @param {Array.<undefined|!string>} args
 */
_Main.main$AS = function (args) {
	/** @type {HTMLCanvasElement} */
	var canvas;
	/** @type {CanvasRenderingContext2D} */
	var ctx;
	/** @type {AOBench} */
	var ao;
	/** @type {!number} */
	var t0;
	/** @type {!number} */
	var t1;
	/** @type {!number} */
	var d;
	canvas = (function (o) { return o instanceof HTMLCanvasElement ? o : null; })((function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById("world")));
	ctx = (function (o) { return o instanceof CanvasRenderingContext2D ? o : null; })(canvas.getContext("2d"));
	ao = new AOBench$();
	t0 = Date.now();
	ao.render$LCanvasRenderingContext2D$II(ctx, canvas.width, canvas.height);
	t1 = Date.now();
	d = t1 - t0;
	(function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById("status")).innerHTML = "Time = " + (d + "") + "[ms]";
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
};

dom$.prototype = new dom;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.id$S = function (id) {
	return (function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id));
};

var dom$id$S = dom.id$S;

/**
 * @param {!string} id
 * @return {HTMLElement}
 */
dom.getElementById$S = function (id) {
	return (function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById(id));
};

var dom$getElementById$S = dom.getElementById$S;

/**
 * @param {!string} tag
 * @return {HTMLElement}
 */
dom.createElement$S = function (tag) {
	return dom.window.document.createElement(tag);
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
};

js$.prototype = new js;

Config.canvasId = "world";
Config.statusId = "status";
AOBench.IMAGE_WIDTH = 256;
AOBench.IMAGE_HEIGHT = 256;
AOBench.NSUBSAMPLES = 2;
AOBench.NAO_SAMPLES = 8;
AOBench.EPS = 0.0001;
AOBench.NPHI = 8;
AOBench.NTHETA = 8;
AOBench.ALLRAY = 64;
$__jsx_lazy_init(dom, "window", function () {
	return js.global.window;
});
js.global = (function () { return this; })();

var $__jsx_classMap = {
	"aobench.jsx": {
		Config: Config,
		Config$: Config$,
		vec3: vec3,
		vec3$NNN: vec3$NNN,
		Isect: Isect,
		Isect$: Isect$,
		Ray: Ray,
		Ray$Lvec3$Lvec3$: Ray$Lvec3$Lvec3$,
		Sphere: Sphere,
		Sphere$Lvec3$N: Sphere$Lvec3$N,
		Plane: Plane,
		Plane$Lvec3$Lvec3$: Plane$Lvec3$Lvec3$,
		AOBench: AOBench,
		AOBench$: AOBench$,
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
	JSX.runMain("aobench.jsx", [])
}

window.addEventListener("load", $__jsx_onload);
window.addEventListener("DOMContentLoaded", $__jsx_onload);

})();
