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
 * @return {!number}
 */
_Main.random$ = function () {
	_Main.seed = _Main.seed * 713 + 17 & 0xFF;
	return _Main.seed / 256;
};

var _Main$random$ = _Main.random$;

/**
 * @param {b2World} world
 * @param {CanvasRenderingContext2D} context
 */
_Main.drawWorld$Lb2World$LCanvasRenderingContext2D$ = function (world, context) {
	/** @type {b2Body} */
	var b;
	/** @type {b2Shape} */
	var s;
	for (b = world.m_bodyList; b != undefined; b = b.m_next) {
		for (s = b.m_shapeList; s != undefined; s = s.m_next) {
			_Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$(s, context);
		}
	}
};

var _Main$drawWorld$Lb2World$LCanvasRenderingContext2D$ = _Main.drawWorld$Lb2World$LCanvasRenderingContext2D$;

/**
 * @param {b2Shape} shape
 * @param {CanvasRenderingContext2D} context
 */
_Main.drawShape$Lb2Shape$LCanvasRenderingContext2D$ = function (shape, context) {
	/** @type {b2CircleShape} */
	var circle;
	/** @type {b2Vec2} */
	var pos;
	/** @type {!number} */
	var r;
	/** @type {!number} */
	var segments;
	/** @type {!number} */
	var theta;
	/** @type {!number} */
	var dtheta;
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var d;
	/** @type {b2Vec2} */
	var v;
	/** @type {b2Vec2} */
	var ax;
	/** @type {b2Vec2} */
	var pos2;
	/** @type {b2PolyShape} */
	var poly;
	/** @type {b2Vec2} */
	var tV;
	/** @type {b2Vec2} */
	var a$0;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Vec2} */
	var a$1;
	/** @type {b2Vec2} */
	var b$1;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Mat22} */
	var A$1;
	/** @type {b2Vec2} */
	var v$1;
	context.strokeStyle = '#ffffff';
	context.beginPath();
	switch (shape.m_type) {
	case 0:
		circle = shape;
		pos = circle.m_position;
		r = circle.m_radius;
		segments = 16.0;
		theta = 0.0;
		dtheta = 6.283185307179586 / segments;
		context.moveTo(pos.x + r, pos.y);
		for (i = 0; i < segments; i++) {
			d = new b2Vec2$NN(r * Math.cos(theta), r * Math.sin(theta));
			v = new b2Vec2$NN(pos.x + d.x, pos.y + d.y);
			context.lineTo(v.x, v.y);
			theta += dtheta;
		}
		context.lineTo(pos.x + r, pos.y);
		context.moveTo(pos.x, pos.y);
		ax = circle.m_R.col1;
		pos2 = new b2Vec2$NN(pos.x + r * ax.x, pos.y + r * ax.y);
		context.lineTo(pos2.x, pos2.y);
		break;
	case 2:
		poly = shape;
		a$0 = poly.m_position;
		A$0 = poly.m_R;
		v$0 = poly.m_vertices[0];
		b$0 = new b2Vec2$NN(A$0.col1.x * v$0.x + A$0.col2.x * v$0.y, A$0.col1.y * v$0.x + A$0.col2.y * v$0.y);
		tV = new b2Vec2$NN(a$0.x + b$0.x, a$0.y + b$0.y);
		context.moveTo(tV.x, tV.y);
		for (i = 0; i < poly.m_vertexCount; i++) {
			a$1 = poly.m_position;
			A$1 = poly.m_R;
			v$1 = poly.m_vertices[i];
			b$1 = new b2Vec2$NN(A$1.col1.x * v$1.x + A$1.col2.x * v$1.y, A$1.col1.y * v$1.x + A$1.col2.y * v$1.y);
			v = new b2Vec2$NN(a$1.x + b$1.x, a$1.y + b$1.y);
			context.lineTo(v.x, v.y);
		}
		context.lineTo(tV.x, tV.y);
		break;
	}
	context.stroke();
};

var _Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$ = _Main.drawShape$Lb2Shape$LCanvasRenderingContext2D$;

/**
 * @return {b2World}
 */
_Main.createWorld$ = function () {
	/** @type {b2AABB} */
	var worldAABB;
	/** @type {b2Vec2} */
	var gravity;
	/** @type {!boolean} */
	var doSleep;
	/** @type {b2World} */
	var world;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2BoxDef} */
	var groundSd$0;
	/** @type {b2BodyDef} */
	var groundBd$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2BoxDef} */
	var boxSd$0;
	/** @type {b2BodyDef} */
	var boxBd$0;
	/** @type {b2Vec2} */
	var this$0$1;
	/** @type {b2Vec2} */
	var this$1$1;
	/** @type {b2BoxDef} */
	var boxSd$1;
	/** @type {b2BodyDef} */
	var boxBd$1;
	/** @type {b2Vec2} */
	var this$0$2;
	/** @type {b2Vec2} */
	var this$1$2;
	worldAABB = new b2AABB$();
	this$0 = worldAABB.minVertex;
	this$0.x = -1000;
	this$0.y = -1000;
	this$1 = worldAABB.maxVertex;
	this$1.x = 1000;
	this$1.y = 1000;
	gravity = new b2Vec2$NN(0, 300);
	doSleep = true;
	world = new b2World$Lb2AABB$Lb2Vec2$B(worldAABB, gravity, doSleep);
	groundSd$0 = new b2BoxDef$();
	this$0$0 = groundSd$0.extents;
	this$0$0.x = 1000;
	this$0$0.y = 10;
	groundSd$0.restitution = 0.2;
	groundSd$0.friction = 0.2;
	groundBd$0 = new b2BodyDef$();
	groundBd$0.AddShape$Lb2ShapeDef$(groundSd$0);
	this$1$0 = groundBd$0.position;
	this$1$0.x = -500;
	this$1$0.y = 400;
	world.CreateBody$Lb2BodyDef$(groundBd$0);
	boxSd$0 = new b2BoxDef$();
	this$0$1 = boxSd$0.extents;
	this$0$1.x = 10;
	this$0$1.y = 1000;
	boxBd$0 = new b2BodyDef$();
	boxBd$0.AddShape$Lb2ShapeDef$(boxSd$0);
	this$1$1 = boxBd$0.position;
	this$1$1.x = 0;
	this$1$1.y = 0;
	world.CreateBody$Lb2BodyDef$(boxBd$0);
	boxSd$1 = new b2BoxDef$();
	this$0$2 = boxSd$1.extents;
	this$0$2.x = 10;
	this$0$2.y = 1000;
	boxBd$1 = new b2BodyDef$();
	boxBd$1.AddShape$Lb2ShapeDef$(boxSd$1);
	this$1$2 = boxBd$1.position;
	this$1$2.x = 320;
	this$1$2.y = 0;
	world.CreateBody$Lb2BodyDef$(boxBd$1);
	return world;
};

var _Main$createWorld$ = _Main.createWorld$;

/**
 * @param {b2World} world
 * @return {b2Body}
 */
_Main.createGround$Lb2World$ = function (world) {
	/** @type {b2BoxDef} */
	var groundSd;
	/** @type {b2BodyDef} */
	var groundBd;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	groundSd = new b2BoxDef$();
	this$0 = groundSd.extents;
	this$0.x = 1000;
	this$0.y = 10;
	groundSd.restitution = 0.2;
	groundSd.friction = 0.2;
	groundBd = new b2BodyDef$();
	groundBd.AddShape$Lb2ShapeDef$(groundSd);
	this$1 = groundBd.position;
	this$1.x = -500;
	this$1.y = 400;
	return world.CreateBody$Lb2BodyDef$(groundBd);
};

var _Main$createGround$Lb2World$ = _Main.createGround$Lb2World$;

/**
 * @param {b2World} world
 * @param {!number} x
 * @param {!number} y
 * @param {!number} width
 * @param {!number} height
 * @return {b2Body}
 */
_Main.createBox$Lb2World$NNNN = function (world, x, y, width, height) {
	/** @type {b2BoxDef} */
	var boxSd;
	/** @type {b2BodyDef} */
	var boxBd;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	boxSd = new b2BoxDef$();
	this$0 = boxSd.extents;
	this$0.x = width;
	this$0.y = height;
	boxBd = new b2BodyDef$();
	boxBd.AddShape$Lb2ShapeDef$(boxSd);
	this$1 = boxBd.position;
	this$1.x = x;
	this$1.y = y;
	return world.CreateBody$Lb2BodyDef$(boxBd);
};

var _Main$createBox$Lb2World$NNNN = _Main.createBox$Lb2World$NNNN;

/**
 * @param {b2World} world
 * @param {!number} x
 * @param {!number} y
 * @param {!number} r
 * @return {b2Body}
 */
_Main.createMy$Lb2World$NNN = function (world, x, y, r) {
	/** @type {b2PolyDef} */
	var ballSd;
	/** @type {!number} */
	var v;
	/** @type {!number} */
	var i;
	/** @type {b2BodyDef} */
	var ballBd;
	/** @type {b2Body} */
	var body;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$1;
	ballSd = new b2PolyDef$();
	ballSd.density = 1.0;
	ballSd.restitution = 0.8;
	v = 3 + (_Main$random$() * 5 | 0);
	ballSd.vertexCount = v;
	for (i = 0; i < v; i++) {
		this$0 = ballSd.vertices[i];
		x$0 = r * Math.cos(6.283185307179586 / v * i);
		y$0 = r * Math.sin(6.283185307179586 / v * i);
		this$0.x = x$0;
		this$0.y = y$0;
	}
	ballBd = new b2BodyDef$();
	ballBd.AddShape$Lb2ShapeDef$(ballSd);
	this$1 = ballBd.position;
	this$1.x = x;
	this$1.y = y;
	body = world.CreateBody$Lb2BodyDef$(ballBd);
	return body;
};

var _Main$createMy$Lb2World$NNN = _Main.createMy$Lb2World$NNN;

/**
 */
_Main.main$ = function () {
	/** @type {HTMLCanvasElement} */
	var canvas;
	/** @type {CanvasRenderingContext2D} */
	var ctx;
	/** @type {b2World} */
	var world;
	/** @type {!number} */
	var count;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var frame;
	/** @type {!number} */
	var last;
	var tick;
	/** @type {b2AABB} */
	var worldAABB$0;
	/** @type {b2Vec2} */
	var gravity$0;
	/** @type {!boolean} */
	var doSleep$0;
	/** @type {b2World} */
	var world$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2BoxDef} */
	var groundSd$0$0;
	/** @type {b2BodyDef} */
	var groundBd$0$0;
	/** @type {b2Vec2} */
	var this$0$0$0;
	/** @type {b2Vec2} */
	var this$1$0$0;
	/** @type {b2BoxDef} */
	var boxSd$0$0;
	/** @type {b2BodyDef} */
	var boxBd$0$0;
	/** @type {b2Vec2} */
	var this$0$1$0;
	/** @type {b2Vec2} */
	var this$1$1$0;
	/** @type {b2BoxDef} */
	var boxSd$1$0;
	/** @type {b2BodyDef} */
	var boxBd$1$0;
	/** @type {b2Vec2} */
	var this$0$2$0;
	/** @type {b2Vec2} */
	var this$1$2$0;
	dom.window.setTimeout((function () {
		dom.window.scrollTo(0, 0);
	}), 100);
	canvas = (function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById("canvas"));
	ctx = canvas.getContext("2d");
	worldAABB$0 = new b2AABB$();
	this$0$0 = worldAABB$0.minVertex;
	this$0$0.x = -1000;
	this$0$0.y = -1000;
	this$1$0 = worldAABB$0.maxVertex;
	this$1$0.x = 1000;
	this$1$0.y = 1000;
	gravity$0 = new b2Vec2$NN(0, 300);
	doSleep$0 = true;
	world$0 = new b2World$Lb2AABB$Lb2Vec2$B(worldAABB$0, gravity$0, doSleep$0);
	groundSd$0$0 = new b2BoxDef$();
	this$0$0$0 = groundSd$0$0.extents;
	this$0$0$0.x = 1000;
	this$0$0$0.y = 10;
	groundSd$0$0.restitution = 0.2;
	groundSd$0$0.friction = 0.2;
	groundBd$0$0 = new b2BodyDef$();
	groundBd$0$0.AddShape$Lb2ShapeDef$(groundSd$0$0);
	this$1$0$0 = groundBd$0$0.position;
	this$1$0$0.x = -500;
	this$1$0$0.y = 400;
	world$0.CreateBody$Lb2BodyDef$(groundBd$0$0);
	boxSd$0$0 = new b2BoxDef$();
	this$0$1$0 = boxSd$0$0.extents;
	this$0$1$0.x = 10;
	this$0$1$0.y = 1000;
	boxBd$0$0 = new b2BodyDef$();
	boxBd$0$0.AddShape$Lb2ShapeDef$(boxSd$0$0);
	this$1$1$0 = boxBd$0$0.position;
	this$1$1$0.x = 0;
	this$1$1$0.y = 0;
	world$0.CreateBody$Lb2BodyDef$(boxBd$0$0);
	boxSd$1$0 = new b2BoxDef$();
	this$0$2$0 = boxSd$1$0.extents;
	this$0$2$0.x = 10;
	this$0$2$0.y = 1000;
	boxBd$1$0 = new b2BodyDef$();
	boxBd$1$0.AddShape$Lb2ShapeDef$(boxSd$1$0);
	this$1$2$0 = boxBd$1$0.position;
	this$1$2$0.x = 320;
	this$1$2$0.y = 0;
	world$0.CreateBody$Lb2BodyDef$(boxBd$1$0);
	world = world$0;
	count = 50;
	for (i = 0; i < count; i++) {
		_Main$createMy$Lb2World$NNN(world, i * (270 / count) + 25, -200 + _Main$random$() * 300, 15 + _Main$random$() * 10);
	}
	frame = 0;
	last = Date.now();
	tick = (function () {
	});
	tick = (function () {
		/** @type {!number} */
		var now;
		frame++;
		dom.window.setTimeout(tick, 0);
		world.Step$NN(0.016666666666666666, 1);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		_Main$drawWorld$Lb2World$LCanvasRenderingContext2D$(world, ctx);
		now = Date.now();
		if (now - last > 1000) {
			(function (o) { return o instanceof HTMLElement ? o : null; })(dom.window.document.getElementById("fps")).innerHTML = "fps:" + frame;
			frame = 0;
			last = now;
		}
	});
	tick();
};

var _Main$main$ = _Main.main$;

/**
 * class b2Settings extends Object
 * @constructor
 */
function b2Settings() {
}

b2Settings.prototype = new Object;
/**
 * @constructor
 */
function b2Settings$() {
};

b2Settings$.prototype = new b2Settings;

/**
 * @param {!boolean} a
 */
b2Settings.b2Assert$B = function (a) {
	if (! a) {
		debugger;
	}
};

var b2Settings$b2Assert$B = b2Settings.b2Assert$B;

/**
 * class b2Mat22 extends Object
 * @constructor
 */
function b2Mat22() {
}

b2Mat22.prototype = new Object;
/**
 * @constructor
 * @param {!number} angle
 * @param {b2Vec2} c1
 * @param {b2Vec2} c2
 */
function b2Mat22$NLb2Vec2$Lb2Vec2$(angle, c1, c2) {
	this.col1 = undefined;
	this.col2 = undefined;
	this.initializer$NLb2Vec2$Lb2Vec2$(angle, c1, c2);
};

b2Mat22$NLb2Vec2$Lb2Vec2$.prototype = new b2Mat22;

/**
 * @constructor
 * @param {!number} angle
 */
function b2Mat22$N(angle) {
	this.col1 = undefined;
	this.col2 = undefined;
	this.initializer$NLb2Vec2$Lb2Vec2$(angle, undefined, undefined);
};

b2Mat22$N.prototype = new b2Mat22;

/**
 * @constructor
 */
function b2Mat22$() {
	this.col1 = undefined;
	this.col2 = undefined;
	this.initializer$NLb2Vec2$Lb2Vec2$(0, undefined, undefined);
};

b2Mat22$.prototype = new b2Mat22;

/**
 * @param {!number} angle
 * @param {b2Vec2} c1
 * @param {b2Vec2} c2
 */
b2Mat22.prototype.initializer$NLb2Vec2$Lb2Vec2$ = function (angle, c1, c2) {
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var s;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	this.col1 = new b2Vec2$();
	this.col2 = new b2Vec2$();
	if (c1 != undefined && c2 != undefined) {
		this$0 = this.col1;
		this$0.x = c1.x;
		this$0.y = c1.y;
		this$1 = this.col2;
		this$1.x = c2.x;
		this$1.y = c2.y;
	} else {
		c = Math.cos(angle);
		s = Math.sin(angle);
		this.col1.x = c;
		this.col2.x = - s;
		this.col1.y = s;
		this.col2.y = c;
	}
};

/**
 * @param {!number} angle
 */
b2Mat22.prototype.Set$N = function (angle) {
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var s;
	c = Math.cos(angle);
	s = Math.sin(angle);
	this.col1.x = c;
	this.col2.x = - s;
	this.col1.y = s;
	this.col2.y = c;
};

/**
 * @param {b2Vec2} c1
 * @param {b2Vec2} c2
 */
b2Mat22.prototype.SetVV$Lb2Vec2$Lb2Vec2$ = function (c1, c2) {
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	this$0 = this.col1;
	this$0.x = c1.x;
	this$0.y = c1.y;
	this$1 = this.col2;
	this$1.x = c2.x;
	this$1.y = c2.y;
};

/**
 * @return {b2Mat22}
 */
b2Mat22.prototype.Copy$ = function () {
	return new b2Mat22$NLb2Vec2$Lb2Vec2$(0, this.col1, this.col2);
};

/**
 * @param {b2Mat22} m
 */
b2Mat22.prototype.SetM$Lb2Mat22$ = function (m) {
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var v$1;
	this$0 = this.col1;
	v$0 = m.col1;
	this$0.x = v$0.x;
	this$0.y = v$0.y;
	this$1 = this.col2;
	v$1 = m.col2;
	this$1.x = v$1.x;
	this$1.y = v$1.y;
};

/**
 * @param {b2Mat22} m
 */
b2Mat22.prototype.AddM$Lb2Mat22$ = function (m) {
	this.col1.x += m.col1.x;
	this.col1.y += m.col1.y;
	this.col2.x += m.col2.x;
	this.col2.y += m.col2.y;
};

/**
 */
b2Mat22.prototype.SetIdentity$ = function () {
	this.col1.x = 1.0;
	this.col2.x = 0.0;
	this.col1.y = 0.0;
	this.col2.y = 1.0;
};

/**
 */
b2Mat22.prototype.SetZero$ = function () {
	this.col1.x = 0.0;
	this.col2.x = 0.0;
	this.col1.y = 0.0;
	this.col2.y = 0.0;
};

/**
 * @param {b2Mat22} out
 * @return {b2Mat22}
 */
b2Mat22.prototype.Invert$Lb2Mat22$ = function (out) {
	/** @type {!number} */
	var a;
	/** @type {!number} */
	var b;
	/** @type {!number} */
	var c;
	/** @type {!number} */
	var d;
	/** @type {!number} */
	var det;
	a = this.col1.x;
	b = this.col2.x;
	c = this.col1.y;
	d = this.col2.y;
	det = a * d - b * c;
	det = 1.0 / det;
	out.col1.x = det * d;
	out.col2.x = - det * b;
	out.col1.y = - det * c;
	out.col2.y = det * a;
	return out;
};

/**
 * @param {b2Vec2} out
 * @param {!number} bX
 * @param {!number} bY
 * @return {b2Vec2}
 */
b2Mat22.prototype.Solve$Lb2Vec2$NN = function (out, bX, bY) {
	/** @type {!number} */
	var a11;
	/** @type {!number} */
	var a12;
	/** @type {!number} */
	var a21;
	/** @type {!number} */
	var a22;
	/** @type {!number} */
	var det;
	a11 = this.col1.x;
	a12 = this.col2.x;
	a21 = this.col1.y;
	a22 = this.col2.y;
	det = a11 * a22 - a12 * a21;
	det = 1.0 / det;
	out.x = det * (a22 * bX - a12 * bY);
	out.y = det * (a11 * bY - a21 * bX);
	return out;
};

/**
 */
b2Mat22.prototype.Abs$ = function () {
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0$0;
	/** @type {!number} */
	var x$1$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var x$0$1;
	/** @type {!number} */
	var x$1$1;
	this$0 = this.col1;
	x$0$0 = this$0.x;
	this$0.x = (x$0$0 >= 0 ? x$0$0 : - x$0$0);
	x$1$0 = this$0.y;
	this$0.y = (x$1$0 >= 0 ? x$1$0 : - x$1$0);
	this$1 = this.col2;
	x$0$1 = this$1.x;
	this$1.x = (x$0$1 >= 0 ? x$0$1 : - x$0$1);
	x$1$1 = this$1.y;
	this$1.y = (x$1$1 >= 0 ? x$1$1 : - x$1$1);
};

/**
 * class b2Math extends Object
 * @constructor
 */
function b2Math() {
}

b2Math.prototype = new Object;
/**
 * @constructor
 */
function b2Math$() {
};

b2Math$.prototype = new b2Math;

/**
 * @param {!number} x
 * @return {!boolean}
 */
b2Math.b2IsValid$N = function (x) {
	return $__jsx_isFinite(x);
};

var b2Math$b2IsValid$N = b2Math.b2IsValid$N;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {!number}
 */
b2Math.b2Dot$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return a.x * b.x + a.y * b.y;
};

var b2Math$b2Dot$Lb2Vec2$Lb2Vec2$ = b2Math.b2Dot$Lb2Vec2$Lb2Vec2$;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {!number}
 */
b2Math.b2CrossVV$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return a.x * b.y - a.y * b.x;
};

var b2Math$b2CrossVV$Lb2Vec2$Lb2Vec2$ = b2Math.b2CrossVV$Lb2Vec2$Lb2Vec2$;

/**
 * @param {b2Vec2} a
 * @param {!number} s
 * @return {b2Vec2}
 */
b2Math.b2CrossVF$Lb2Vec2$N = function (a, s) {
	return new b2Vec2$NN(s * a.y, - s * a.x);
};

var b2Math$b2CrossVF$Lb2Vec2$N = b2Math.b2CrossVF$Lb2Vec2$N;

/**
 * @param {!number} s
 * @param {b2Vec2} a
 * @return {b2Vec2}
 */
b2Math.b2CrossFV$NLb2Vec2$ = function (s, a) {
	return new b2Vec2$NN(- s * a.y, s * a.x);
};

var b2Math$b2CrossFV$NLb2Vec2$ = b2Math.b2CrossFV$NLb2Vec2$;

/**
 * @param {b2Mat22} A
 * @param {b2Vec2} v
 * @return {b2Vec2}
 */
b2Math.b2MulMV$Lb2Mat22$Lb2Vec2$ = function (A, v) {
	return new b2Vec2$NN(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
};

var b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$ = b2Math.b2MulMV$Lb2Mat22$Lb2Vec2$;

/**
 * @param {b2Mat22} A
 * @param {b2Vec2} v
 * @return {b2Vec2}
 */
b2Math.b2MulTMV$Lb2Mat22$Lb2Vec2$ = function (A, v) {
	return new b2Vec2$NN(b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(v, A.col1), b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(v, A.col2));
};

var b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$ = b2Math.b2MulTMV$Lb2Mat22$Lb2Vec2$;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {b2Vec2}
 */
b2Math.AddVV$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return new b2Vec2$NN(a.x + b.x, a.y + b.y);
};

var b2Math$AddVV$Lb2Vec2$Lb2Vec2$ = b2Math.AddVV$Lb2Vec2$Lb2Vec2$;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {b2Vec2}
 */
b2Math.SubtractVV$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return new b2Vec2$NN(a.x - b.x, a.y - b.y);
};

var b2Math$SubtractVV$Lb2Vec2$Lb2Vec2$ = b2Math.SubtractVV$Lb2Vec2$Lb2Vec2$;

/**
 * @param {!number} s
 * @param {b2Vec2} a
 * @return {b2Vec2}
 */
b2Math.MulFV$NLb2Vec2$ = function (s, a) {
	return new b2Vec2$NN(s * a.x, s * a.y);
};

var b2Math$MulFV$NLb2Vec2$ = b2Math.MulFV$NLb2Vec2$;

/**
 * @param {b2Mat22} A
 * @param {b2Mat22} B
 * @return {b2Mat22}
 */
b2Math.AddMM$Lb2Mat22$Lb2Mat22$ = function (A, B) {
	return new b2Mat22$NLb2Vec2$Lb2Vec2$(0, b2Math$AddVV$Lb2Vec2$Lb2Vec2$(A.col1, B.col1), b2Math$AddVV$Lb2Vec2$Lb2Vec2$(A.col2, B.col2));
};

var b2Math$AddMM$Lb2Mat22$Lb2Mat22$ = b2Math.AddMM$Lb2Mat22$Lb2Mat22$;

/**
 * @param {b2Mat22} A
 * @param {b2Mat22} B
 * @return {b2Mat22}
 */
b2Math.b2MulMM$Lb2Mat22$Lb2Mat22$ = function (A, B) {
	return new b2Mat22$NLb2Vec2$Lb2Vec2$(0, b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$(A, B.col1), b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$(A, B.col2));
};

var b2Math$b2MulMM$Lb2Mat22$Lb2Mat22$ = b2Math.b2MulMM$Lb2Mat22$Lb2Mat22$;

/**
 * @param {b2Mat22} A
 * @param {b2Mat22} B
 * @return {b2Mat22}
 */
b2Math.b2MulTMM$Lb2Mat22$Lb2Mat22$ = function (A, B) {
	/** @type {b2Vec2} */
	var c1;
	/** @type {b2Vec2} */
	var c2;
	/** @type {b2Mat22} */
	var C;
	c1 = new b2Vec2$NN(b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(A.col1, B.col1), b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(A.col2, B.col1));
	c2 = new b2Vec2$NN(b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(A.col1, B.col2), b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(A.col2, B.col2));
	C = new b2Mat22$NLb2Vec2$Lb2Vec2$(0, c1, c2);
	return C;
};

var b2Math$b2MulTMM$Lb2Mat22$Lb2Mat22$ = b2Math.b2MulTMM$Lb2Mat22$Lb2Mat22$;

/**
 * @param {!number} a
 * @return {!number}
 */
b2Math.b2Abs$N = function (a) {
	return (a >= 0 ? a : - a);
};

var b2Math$b2Abs$N = b2Math.b2Abs$N;

/**
 * @param {b2Vec2} a
 * @return {b2Vec2}
 */
b2Math.b2AbsV$Lb2Vec2$ = function (a) {
	return new b2Vec2$NN(b2Math$b2Abs$N(a.x), b2Math$b2Abs$N(a.y));
};

var b2Math$b2AbsV$Lb2Vec2$ = b2Math.b2AbsV$Lb2Vec2$;

/**
 * @param {b2Mat22} A
 * @return {b2Mat22}
 */
b2Math.b2AbsM$Lb2Mat22$ = function (A) {
	return new b2Mat22$NLb2Vec2$Lb2Vec2$(0, b2Math$b2AbsV$Lb2Vec2$(A.col1), b2Math$b2AbsV$Lb2Vec2$(A.col2));
};

var b2Math$b2AbsM$Lb2Mat22$ = b2Math.b2AbsM$Lb2Mat22$;

/**
 * @param {!number} a
 * @param {!number} b
 * @return {!number}
 */
b2Math.b2Min$NN = function (a, b) {
	return (a < b ? a : b);
};

var b2Math$b2Min$NN = b2Math.b2Min$NN;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {b2Vec2}
 */
b2Math.b2MinV$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return new b2Vec2$NN(b2Math$b2Min$NN(a.x, b.x), b2Math$b2Min$NN(a.y, b.y));
};

var b2Math$b2MinV$Lb2Vec2$Lb2Vec2$ = b2Math.b2MinV$Lb2Vec2$Lb2Vec2$;

/**
 * @param {!number} a
 * @param {!number} b
 * @return {!number}
 */
b2Math.b2Max$NN = function (a, b) {
	return (a > b ? a : b);
};

var b2Math$b2Max$NN = b2Math.b2Max$NN;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} b
 * @return {b2Vec2}
 */
b2Math.b2MaxV$Lb2Vec2$Lb2Vec2$ = function (a, b) {
	return new b2Vec2$NN(b2Math$b2Max$NN(a.x, b.x), b2Math$b2Max$NN(a.y, b.y));
};

var b2Math$b2MaxV$Lb2Vec2$Lb2Vec2$ = b2Math.b2MaxV$Lb2Vec2$Lb2Vec2$;

/**
 * @param {!number} a
 * @param {!number} low
 * @param {!number} high
 * @return {!number}
 */
b2Math.b2Clamp$NNN = function (a, low, high) {
	/** @type {!number} */
	var b$0;
	b$0 = (a < high ? a : high);
	return (low > b$0 ? low : b$0);
};

var b2Math$b2Clamp$NNN = b2Math.b2Clamp$NNN;

/**
 * @param {b2Vec2} a
 * @param {b2Vec2} low
 * @param {b2Vec2} high
 * @return {b2Vec2}
 */
b2Math.b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$ = function (a, low, high) {
	/** @type {b2Vec2} */
	var b$0;
	b$0 = new b2Vec2$NN(b2Math$b2Min$NN(a.x, high.x), b2Math$b2Min$NN(a.y, high.y));
	return new b2Vec2$NN(b2Math$b2Max$NN(low.x, b$0.x), b2Math$b2Max$NN(low.y, b$0.y));
};

var b2Math$b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$ = b2Math.b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$;

/**
 * @return {!number}
 */
b2Math.b2Random$ = function () {
	return Math.random() * 2 - 1;
};

var b2Math$b2Random$ = b2Math.b2Random$;

/**
 * @param {!number} x
 * @return {!number}
 */
b2Math.b2NextPowerOfTwo$N = function (x) {
	x |= x >> 1 & 0x7FFFFFFF;
	x |= x >> 2 & 0x3FFFFFFF;
	x |= x >> 4 & 0x0FFFFFFF;
	x |= x >> 8 & 0x00FFFFFF;
	x |= x >> 16 & 0x0000FFFF;
	return x + 1;
};

var b2Math$b2NextPowerOfTwo$N = b2Math.b2NextPowerOfTwo$N;

/**
 * @param {!number} x
 * @return {!boolean}
 */
b2Math.b2IsPowerOfTwo$N = function (x) {
	return x > 0 && (x & x - 1) === 0;
};

var b2Math$b2IsPowerOfTwo$N = b2Math.b2IsPowerOfTwo$N;

/**
 * class b2Vec2 extends Object
 * @constructor
 */
function b2Vec2() {
}

b2Vec2.prototype = new Object;
/**
 * @constructor
 */
function b2Vec2$() {
	this.x = 0;
	this.y = 0;
	this.x = 0;
	this.y = 0;
};

b2Vec2$.prototype = new b2Vec2;

/**
 * @constructor
 * @param {!number} x
 * @param {!number} y
 */
function b2Vec2$NN(x, y) {
	this.x = 0;
	this.y = 0;
	this.x = x;
	this.y = y;
};

b2Vec2$NN.prototype = new b2Vec2;

/**
 */
b2Vec2.prototype.SetZero$ = function () {
	this.x = 0;
	this.y = 0;
};

/**
 * @param {!number} x
 * @param {!number} y
 */
b2Vec2.prototype.Set$NN = function (x, y) {
	this.x = x;
	this.y = y;
};

/**
 * @param {b2Vec2} v
 */
b2Vec2.prototype.SetV$Lb2Vec2$ = function (v) {
	this.x = v.x;
	this.y = v.y;
};

/**
 * @return {b2Vec2}
 */
b2Vec2.prototype.Negative$ = function () {
	return new b2Vec2$NN(- this.x, - this.y);
};

/**
 * @return {b2Vec2}
 */
b2Vec2.prototype.Copy$ = function () {
	return new b2Vec2$NN(this.x, this.y);
};

/**
 * @param {b2Vec2} v
 */
b2Vec2.prototype.Add$Lb2Vec2$ = function (v) {
	this.x += v.x;
	this.y += v.y;
};

/**
 * @param {b2Vec2} v
 */
b2Vec2.prototype.Subtract$Lb2Vec2$ = function (v) {
	this.x -= v.x;
	this.y -= v.y;
};

/**
 * @param {!number} a
 */
b2Vec2.prototype.Multiply$N = function (a) {
	this.x *= a;
	this.y *= a;
};

/**
 * @param {b2Mat22} A
 */
b2Vec2.prototype.MulM$Lb2Mat22$ = function (A) {
	/** @type {!number} */
	var tX;
	tX = this.x;
	this.x = A.col1.x * tX + A.col2.x * this.y;
	this.y = A.col1.y * tX + A.col2.y * this.y;
};

/**
 * @param {b2Mat22} A
 */
b2Vec2.prototype.MulTM$Lb2Mat22$ = function (A) {
	/** @type {!number} */
	var tX;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Vec2} */
	var b$1;
	b$0 = A.col1;
	tX = this.x * b$0.x + this.y * b$0.y;
	b$1 = A.col2;
	this.y = this.x * b$1.x + this.y * b$1.y;
	this.x = tX;
};

/**
 * @param {!number} s
 */
b2Vec2.prototype.CrossVF$N = function (s) {
	/** @type {!number} */
	var tX;
	tX = this.x;
	this.x = s * this.y;
	this.y = - s * tX;
};

/**
 * @param {!number} s
 */
b2Vec2.prototype.CrossFV$N = function (s) {
	/** @type {!number} */
	var tX;
	tX = this.x;
	this.x = - s * this.y;
	this.y = s * tX;
};

/**
 * @param {b2Vec2} b
 */
b2Vec2.prototype.MinV$Lb2Vec2$ = function (b) {
	this.x = (this.x < b.x ? this.x : b.x);
	this.y = (this.y < b.y ? this.y : b.y);
};

/**
 * @param {b2Vec2} b
 */
b2Vec2.prototype.MaxV$Lb2Vec2$ = function (b) {
	this.x = (this.x > b.x ? this.x : b.x);
	this.y = (this.y > b.y ? this.y : b.y);
};

/**
 */
b2Vec2.prototype.Abs$ = function () {
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var x$1;
	x$0 = this.x;
	this.x = (x$0 >= 0 ? x$0 : - x$0);
	x$1 = this.y;
	this.y = (x$1 >= 0 ? x$1 : - x$1);
};

/**
 * @return {!number}
 */
b2Vec2.prototype.Length$ = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * @return {!number}
 */
b2Vec2.prototype.Normalize$ = function () {
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var invLength;
	length = Math.sqrt(this.x * this.x + this.y * this.y);
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	invLength = 1.0 / length;
	this.x *= invLength;
	this.y *= invLength;
	return length;
};

/**
 * @return {!boolean}
 */
b2Vec2.prototype.IsValid$ = function () {
	return b2Math$b2IsValid$N(this.x) && b2Math$b2IsValid$N(this.y);
};

/**
 * @param {!number} x
 * @param {!number} y
 * @return {b2Vec2}
 */
b2Vec2.Make$NN = function (x, y) {
	return new b2Vec2$NN(x, y);
};

var b2Vec2$Make$NN = b2Vec2.Make$NN;

/**
 * class b2AABB extends Object
 * @constructor
 */
function b2AABB() {
}

b2AABB.prototype = new Object;
/**
 * @constructor
 */
function b2AABB$() {
	this.minVertex = new b2Vec2$();
	this.maxVertex = new b2Vec2$();
};

b2AABB$.prototype = new b2AABB;

/**
 * @return {!boolean}
 */
b2AABB.prototype.IsValid$ = function () {
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {!boolean} */
	var valid;
	dX = this.maxVertex.x;
	dY = this.maxVertex.y;
	dX = this.maxVertex.x;
	dY = this.maxVertex.y;
	dX -= this.minVertex.x;
	dY -= this.minVertex.y;
	valid = dX >= 0.0 && dY >= 0.0;
	valid = valid && this.minVertex.IsValid$() && this.maxVertex.IsValid$();
	return valid;
};

/**
 * class b2Bound extends Object
 * @constructor
 */
function b2Bound() {
}

b2Bound.prototype = new Object;
/**
 * @constructor
 */
function b2Bound$() {
	this.value = 0;
	this.proxyId = 0;
	this.stabbingCount = 0;
};

b2Bound$.prototype = new b2Bound;

/**
 * @return {!boolean}
 */
b2Bound.prototype.IsLower$ = function () {
	return (this.value & 1) === 0;
};

/**
 * @return {!boolean}
 */
b2Bound.prototype.IsUpper$ = function () {
	return (this.value & 1) === 1;
};

/**
 * @param {b2Bound} b
 */
b2Bound.prototype.Swap$Lb2Bound$ = function (b) {
	/** @type {!number} */
	var tempValue;
	/** @type {!number} */
	var tempProxyId;
	/** @type {!number} */
	var tempStabbingCount;
	tempValue = this.value;
	tempProxyId = this.proxyId;
	tempStabbingCount = this.stabbingCount;
	this.value = b.value;
	this.proxyId = b.proxyId;
	this.stabbingCount = b.stabbingCount;
	b.value = tempValue;
	b.proxyId = tempProxyId;
	b.stabbingCount = tempStabbingCount;
};

/**
 * class b2BoundValues extends Object
 * @constructor
 */
function b2BoundValues() {
}

b2BoundValues.prototype = new Object;
/**
 * @constructor
 */
function b2BoundValues$() {
	this.lowerValues = [ 0, 0 ];
	this.upperValues = [ 0, 0 ];
};

b2BoundValues$.prototype = new b2BoundValues;

/**
 * class b2BroadPhase extends Object
 * @constructor
 */
function b2BroadPhase() {
}

b2BroadPhase.prototype = new Object;
/**
 * @constructor
 * @param {b2AABB} worldAABB
 * @param {b2PairCallback} callback
 */
function b2BroadPhase$Lb2AABB$Lb2PairCallback$(worldAABB, callback) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {b2Proxy} */
	var tProxy;
	/** @type {b2PairManager} */
	var this$0;
	/** @type {!number} */
	var next$0;
	/** @type {!number} */
	var next$1;
	this.m_pairManager = undefined;
	this.m_proxyPool = undefined;
	this.m_freeProxy = 0;
	this.m_bounds = undefined;
	this.m_queryResultCount = 0;
	this.m_worldAABB = undefined;
	this.m_quantizationFactor = undefined;
	this.m_proxyCount = 0;
	this.m_timeStamp = 0;
	this.m_queryResults = [  ];
	this.m_queryResults.length = 1024;
	this.m_pairManager = new b2PairManager$();
	this.m_proxyPool = [  ];
	this.m_proxyPool.length = 8192;
	this.m_bounds = [  ];
	this.m_bounds.length = 2048;
	this.m_queryResults = [  ];
	this.m_queryResults.length = 1024;
	this.m_quantizationFactor = new b2Vec2$();
	i = 0;
	this$0 = this.m_pairManager;
	this$0.m_broadPhase = this;
	this$0.m_callback = callback;
	this.m_worldAABB = worldAABB;
	this.m_proxyCount = 0;
	for (i = 0; i < 1024; i++) {
		this.m_queryResults[i] = 0;
	}
	this.m_bounds = [  ];
	for (i = 0; i < 2; i++) {
		this.m_bounds[i] = [  ];
		this.m_bounds[i].length = 2048;
		for (j = 0; j < 2048; j++) {
			this.m_bounds[i][j] = new b2Bound$();
		}
	}
	dX = worldAABB.maxVertex.x;
	dY = worldAABB.maxVertex.y;
	dX -= worldAABB.minVertex.x;
	dY -= worldAABB.minVertex.y;
	this.m_quantizationFactor.x = 0x0000ffff / dX;
	this.m_quantizationFactor.y = 0x0000ffff / dY;
	for (i = 0; i < 1023; ++ i) {
		tProxy = new b2Proxy$();
		this.m_proxyPool[i] = tProxy;
		next$0 = i + 1;
		tProxy.lowerBounds[0] = next$0;
		tProxy.timeStamp = 0;
		tProxy.overlapCount = 0x0000ffff;
		tProxy.userData = undefined;
	}
	tProxy = new b2Proxy$();
	this.m_proxyPool[1023] = tProxy;
	next$1 = b2Pair.b2_nullProxy;
	tProxy.lowerBounds[0] = next$1;
	tProxy.timeStamp = 0;
	tProxy.overlapCount = 0x0000ffff;
	tProxy.userData = undefined;
	this.m_freeProxy = 0;
	this.m_timeStamp = 1;
	this.m_queryResultCount = 0;
};

b2BroadPhase$Lb2AABB$Lb2PairCallback$.prototype = new b2BroadPhase;

/**
 * @param {b2AABB} aabb
 * @return {!boolean}
 */
b2BroadPhase.prototype.InRange$Lb2AABB$ = function (aabb) {
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {!number} */
	var d2X;
	/** @type {!number} */
	var d2Y;
	dX = aabb.minVertex.x;
	dY = aabb.minVertex.y;
	dX -= this.m_worldAABB.maxVertex.x;
	dY -= this.m_worldAABB.maxVertex.y;
	d2X = this.m_worldAABB.minVertex.x;
	d2Y = this.m_worldAABB.minVertex.y;
	d2X -= aabb.maxVertex.x;
	d2Y -= aabb.maxVertex.y;
	dX = (dX > d2X ? dX : d2X);
	dY = (dY > d2Y ? dY : d2Y);
	return (dX > dY ? dX : dY) < 0.0;
};

/**
 * @param {!number} proxyId
 * @return {b2Proxy}
 */
b2BroadPhase.prototype.GetProxy$N = function (proxyId) {
	return (proxyId === b2Pair.b2_nullProxy || this.m_proxyPool[proxyId].IsValid$() === false ? undefined : this.m_proxyPool[proxyId]);
};

/**
 * @param {b2AABB} aabb
 * @param {*} userData
 * @return {!number}
 */
b2BroadPhase.prototype.CreateProxy$Lb2AABB$X = function (aabb, userData) {
	/** @type {!number} */
	var index;
	/** @type {b2Proxy} */
	var proxy;
	/** @type {!number} */
	var proxyId;
	/** @type {!number} */
	var boundCount;
	/** @type {Array.<undefined|!number>} */
	var lowerValues;
	/** @type {Array.<undefined|!number>} */
	var upperValues;
	/** @type {!number} */
	var axis;
	/** @type {Array.<undefined|b2Bound>} */
	var bounds;
	/** @type {!number} */
	var lowerIndex;
	/** @type {!number} */
	var upperIndex;
	/** @type {Array.<undefined|!number>} */
	var lowerIndexOut;
	/** @type {Array.<undefined|!number>} */
	var upperIndexOut;
	/** @type {Array.<undefined|b2Bound>} */
	var tArr;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var tEnd;
	/** @type {b2Bound} */
	var tBound1;
	/** @type {b2Bound} */
	var tBound2;
	/** @type {!number} */
	var tIndex;
	/** @type {b2Proxy} */
	var proxy2;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var minVertexX$0;
	/** @type {!number} */
	var minVertexY$0;
	/** @type {!number} */
	var maxVertexX$0;
	/** @type {!number} */
	var maxVertexY$0;
	/** @type {!number} */
	var b$0$0;
	/** @type {!number} */
	var b$1$0;
	/** @type {!number} */
	var b$2$0;
	/** @type {!number} */
	var b$3$0;
	/** @type {!number} */
	var b$4$0;
	/** @type {!number} */
	var b$5$0;
	/** @type {!number} */
	var b$6$0;
	/** @type {!number} */
	var b$7$0;
	/** @type {b2Bound} */
	var this$0;
	index = 0;
	proxyId = this.m_freeProxy;
	proxy = this.m_proxyPool[proxyId];
	this.m_freeProxy = proxy.lowerBounds[0];
	proxy.overlapCount = 0;
	proxy.userData = userData;
	boundCount = 2 * this.m_proxyCount;
	lowerValues = [  ];
	upperValues = [  ];
	minVertexX$0 = aabb.minVertex.x;
	minVertexY$0 = aabb.minVertex.y;
	b$0$0 = this.m_worldAABB.maxVertex.x;
	minVertexX$0 = (minVertexX$0 < b$0$0 ? minVertexX$0 : b$0$0);
	b$1$0 = this.m_worldAABB.maxVertex.y;
	minVertexY$0 = (minVertexY$0 < b$1$0 ? minVertexY$0 : b$1$0);
	b$2$0 = this.m_worldAABB.minVertex.x;
	minVertexX$0 = (minVertexX$0 > b$2$0 ? minVertexX$0 : b$2$0);
	b$3$0 = this.m_worldAABB.minVertex.y;
	minVertexY$0 = (minVertexY$0 > b$3$0 ? minVertexY$0 : b$3$0);
	maxVertexX$0 = aabb.maxVertex.x;
	maxVertexY$0 = aabb.maxVertex.y;
	b$4$0 = this.m_worldAABB.maxVertex.x;
	maxVertexX$0 = (maxVertexX$0 < b$4$0 ? maxVertexX$0 : b$4$0);
	b$5$0 = this.m_worldAABB.maxVertex.y;
	maxVertexY$0 = (maxVertexY$0 < b$5$0 ? maxVertexY$0 : b$5$0);
	b$6$0 = this.m_worldAABB.minVertex.x;
	maxVertexX$0 = (maxVertexX$0 > b$6$0 ? maxVertexX$0 : b$6$0);
	b$7$0 = this.m_worldAABB.minVertex.y;
	maxVertexY$0 = (maxVertexY$0 > b$7$0 ? maxVertexY$0 : b$7$0);
	lowerValues[0] = this.m_quantizationFactor.x * (minVertexX$0 - this.m_worldAABB.minVertex.x) & 65534;
	upperValues[0] = this.m_quantizationFactor.x * (maxVertexX$0 - this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues[1] = this.m_quantizationFactor.y * (minVertexY$0 - this.m_worldAABB.minVertex.y) & 65534;
	upperValues[1] = this.m_quantizationFactor.y * (maxVertexY$0 - this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		lowerIndex = 0;
		upperIndex = 0;
		lowerIndexOut = [ lowerIndex ];
		upperIndexOut = [ upperIndex ];
		this.Query$ANANNNALb2Bound$NN(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
		lowerIndex = lowerIndexOut[0];
		upperIndex = upperIndexOut[0];
		tArr = [  ];
		j = 0;
		tEnd = boundCount - upperIndex;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = new b2Bound$();
			tBound1 = tArr[j];
			tBound2 = bounds[upperIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tEnd = tArr.length;
		tIndex = upperIndex + 2;
		for (j = 0; j < tEnd; j++) {
			tBound2 = tArr[j];
			tBound1 = bounds[tIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tArr = [  ];
		tEnd = upperIndex - lowerIndex;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = new b2Bound$();
			tBound1 = tArr[j];
			tBound2 = bounds[lowerIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tEnd = tArr.length;
		tIndex = lowerIndex + 1;
		for (j = 0; j < tEnd; j++) {
			tBound2 = tArr[j];
			tBound1 = bounds[tIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		++ upperIndex;
		bounds[lowerIndex].value = lowerValues[axis];
		bounds[lowerIndex].proxyId = proxyId;
		bounds[upperIndex].value = upperValues[axis];
		bounds[upperIndex].proxyId = proxyId;
		bounds[lowerIndex].stabbingCount = (lowerIndex === 0 ? 0 : bounds[lowerIndex - 1].stabbingCount);
		bounds[upperIndex].stabbingCount = bounds[upperIndex - 1].stabbingCount;
		for (index = lowerIndex; index < upperIndex; ++ index) {
			bounds[index].stabbingCount++;
		}
		for (index = lowerIndex; index < boundCount + 2; ++ index) {
			proxy2 = this.m_proxyPool[bounds[index].proxyId];
			this$0 = bounds[index];
			if ((this$0.value & 1) === 0) {
				proxy2.lowerBounds[axis] = index;
			} else {
				proxy2.upperBounds[axis] = index;
			}
		}
	}
	++ this.m_proxyCount;
	for (i = 0; i < this.m_queryResultCount; ++ i) {
		this.m_pairManager.AddBufferedPair$NN(proxyId, this.m_queryResults[i]);
	}
	this.m_pairManager.Commit$();
	this.m_queryResultCount = 0;
	this.IncrementTimeStamp$();
	return proxyId;
};

/**
 * @param {!number} proxyId
 */
b2BroadPhase.prototype.DestroyProxy$N = function (proxyId) {
	/** @type {b2Proxy} */
	var proxy;
	/** @type {!number} */
	var boundCount;
	/** @type {!number} */
	var axis;
	/** @type {Array.<undefined|b2Bound>} */
	var bounds;
	/** @type {undefined|!number} */
	var lowerIndex;
	/** @type {undefined|!number} */
	var upperIndex;
	/** @type {!number} */
	var lowerValue;
	/** @type {!number} */
	var upperValue;
	/** @type {Array.<undefined|b2Bound>} */
	var tArr;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var tEnd;
	/** @type {b2Bound} */
	var tBound1;
	/** @type {b2Bound} */
	var tBound2;
	/** @type {undefined|!number} */
	var tIndex;
	/** @type {undefined|!number} */
	var index;
	/** @type {b2Proxy} */
	var proxy2;
	/** @type {undefined|!number} */
	var index2;
	/** @type {!number} */
	var i;
	/** @type {b2Bound} */
	var this$0;
	/** @type {!number} */
	var next$0;
	proxy = this.m_proxyPool[proxyId];
	boundCount = 2 * this.m_proxyCount;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		lowerIndex = proxy.lowerBounds[axis];
		upperIndex = proxy.upperBounds[axis];
		lowerValue = bounds[lowerIndex].value;
		upperValue = bounds[upperIndex].value;
		tArr = [  ];
		j = 0;
		tEnd = upperIndex - lowerIndex - 1;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = new b2Bound$();
			tBound1 = tArr[j];
			tBound2 = bounds[lowerIndex + 1 + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tEnd = tArr.length;
		tIndex = lowerIndex;
		for (j = 0; j < tEnd; j++) {
			tBound2 = tArr[j];
			tBound1 = bounds[tIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tArr = [  ];
		tEnd = boundCount - upperIndex - 1;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = new b2Bound$();
			tBound1 = tArr[j];
			tBound2 = bounds[upperIndex + 1 + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tEnd = tArr.length;
		tIndex = upperIndex - 1;
		for (j = 0; j < tEnd; j++) {
			tBound2 = tArr[j];
			tBound1 = bounds[tIndex + j];
			tBound1.value = tBound2.value;
			tBound1.proxyId = tBound2.proxyId;
			tBound1.stabbingCount = tBound2.stabbingCount;
		}
		tEnd = boundCount - 2;
		for (index = lowerIndex; index < tEnd; ++ index) {
			proxy2 = this.m_proxyPool[bounds[index].proxyId];
			this$0 = bounds[index];
			if ((this$0.value & 1) === 0) {
				proxy2.lowerBounds[axis] = index;
			} else {
				proxy2.upperBounds[axis] = index;
			}
		}
		tEnd = upperIndex - 1;
		for (index2 = lowerIndex; index2 < tEnd; ++ index2) {
			bounds[index2].stabbingCount--;
		}
		this.Query$ANANNNALb2Bound$NN([ 0 ], [ 0 ], lowerValue, upperValue, bounds, boundCount - 2, axis);
	}
	for (i = 0; i < this.m_queryResultCount; ++ i) {
		this.m_pairManager.RemoveBufferedPair$NN(proxyId, this.m_queryResults[i]);
	}
	this.m_pairManager.Commit$();
	this.m_queryResultCount = 0;
	this.IncrementTimeStamp$();
	proxy.userData = undefined;
	proxy.overlapCount = 0x0000ffff;
	proxy.lowerBounds[0] = 0x0000ffff;
	proxy.lowerBounds[1] = 0x0000ffff;
	proxy.upperBounds[0] = 0x0000ffff;
	proxy.upperBounds[1] = 0x0000ffff;
	next$0 = this.m_freeProxy;
	proxy.lowerBounds[0] = next$0;
	this.m_freeProxy = proxyId;
	-- this.m_proxyCount;
};

/**
 * @param {!number} proxyId
 * @param {b2AABB} aabb
 */
b2BroadPhase.prototype.MoveProxy$NLb2AABB$ = function (proxyId, aabb) {
	/** @type {!number} */
	var axis;
	/** @type {!number} */
	var index;
	/** @type {b2Bound} */
	var bound;
	/** @type {b2Bound} */
	var prevBound;
	/** @type {b2Bound} */
	var nextBound;
	/** @type {!number} */
	var nextProxyId;
	/** @type {b2Proxy} */
	var nextProxy;
	/** @type {!number} */
	var boundCount;
	/** @type {b2Proxy} */
	var proxy;
	/** @type {b2BoundValues} */
	var newValues;
	/** @type {b2BoundValues} */
	var oldValues;
	/** @type {Array.<undefined|b2Bound>} */
	var bounds;
	/** @type {undefined|!number} */
	var lowerIndex;
	/** @type {undefined|!number} */
	var upperIndex;
	/** @type {undefined|!number} */
	var lowerValue;
	/** @type {undefined|!number} */
	var upperValue;
	/** @type {!number} */
	var deltaLower;
	/** @type {!number} */
	var deltaUpper;
	/** @type {!number} */
	var prevProxyId;
	/** @type {b2Proxy} */
	var prevProxy;
	/** @type {Array.<undefined|!number>} */
	var lowerValues$0;
	/** @type {Array.<undefined|!number>} */
	var upperValues$0;
	/** @type {!number} */
	var minVertexX$0;
	/** @type {!number} */
	var minVertexY$0;
	/** @type {!number} */
	var maxVertexX$0;
	/** @type {!number} */
	var maxVertexY$0;
	/** @type {!number} */
	var b$0$0;
	/** @type {!number} */
	var b$1$0;
	/** @type {!number} */
	var b$2$0;
	/** @type {!number} */
	var b$3$0;
	/** @type {!number} */
	var b$4$0;
	/** @type {!number} */
	var b$5$0;
	/** @type {!number} */
	var b$6$0;
	/** @type {!number} */
	var b$7$0;
	/** @type {!number} */
	var tempValue$0;
	/** @type {!number} */
	var tempProxyId$0;
	/** @type {!number} */
	var tempStabbingCount$0;
	/** @type {!number} */
	var tempValue$1;
	/** @type {!number} */
	var tempProxyId$1;
	/** @type {!number} */
	var tempStabbingCount$1;
	/** @type {!number} */
	var tempValue$2;
	/** @type {!number} */
	var tempProxyId$2;
	/** @type {!number} */
	var tempStabbingCount$2;
	/** @type {!number} */
	var tempValue$3;
	/** @type {!number} */
	var tempProxyId$3;
	/** @type {!number} */
	var tempStabbingCount$3;
	axis = 0;
	index = 0;
	nextProxyId = 0;
	if (proxyId === b2Pair.b2_nullProxy || 1024 <= proxyId) {
		return;
	}
	if (aabb.IsValid$() === false) {
		return;
	}
	boundCount = 2 * this.m_proxyCount;
	proxy = this.m_proxyPool[proxyId];
	newValues = new b2BoundValues$();
	lowerValues$0 = newValues.lowerValues;
	upperValues$0 = newValues.upperValues;
	minVertexX$0 = aabb.minVertex.x;
	minVertexY$0 = aabb.minVertex.y;
	b$0$0 = this.m_worldAABB.maxVertex.x;
	minVertexX$0 = (minVertexX$0 < b$0$0 ? minVertexX$0 : b$0$0);
	b$1$0 = this.m_worldAABB.maxVertex.y;
	minVertexY$0 = (minVertexY$0 < b$1$0 ? minVertexY$0 : b$1$0);
	b$2$0 = this.m_worldAABB.minVertex.x;
	minVertexX$0 = (minVertexX$0 > b$2$0 ? minVertexX$0 : b$2$0);
	b$3$0 = this.m_worldAABB.minVertex.y;
	minVertexY$0 = (minVertexY$0 > b$3$0 ? minVertexY$0 : b$3$0);
	maxVertexX$0 = aabb.maxVertex.x;
	maxVertexY$0 = aabb.maxVertex.y;
	b$4$0 = this.m_worldAABB.maxVertex.x;
	maxVertexX$0 = (maxVertexX$0 < b$4$0 ? maxVertexX$0 : b$4$0);
	b$5$0 = this.m_worldAABB.maxVertex.y;
	maxVertexY$0 = (maxVertexY$0 < b$5$0 ? maxVertexY$0 : b$5$0);
	b$6$0 = this.m_worldAABB.minVertex.x;
	maxVertexX$0 = (maxVertexX$0 > b$6$0 ? maxVertexX$0 : b$6$0);
	b$7$0 = this.m_worldAABB.minVertex.y;
	maxVertexY$0 = (maxVertexY$0 > b$7$0 ? maxVertexY$0 : b$7$0);
	lowerValues$0[0] = this.m_quantizationFactor.x * (minVertexX$0 - this.m_worldAABB.minVertex.x) & 65534;
	upperValues$0[0] = this.m_quantizationFactor.x * (maxVertexX$0 - this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues$0[1] = this.m_quantizationFactor.y * (minVertexY$0 - this.m_worldAABB.minVertex.y) & 65534;
	upperValues$0[1] = this.m_quantizationFactor.y * (maxVertexY$0 - this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
	oldValues = new b2BoundValues$();
	for (axis = 0; axis < 2; ++ axis) {
		oldValues.lowerValues[axis] = this.m_bounds[axis][proxy.lowerBounds[axis]].value;
		oldValues.upperValues[axis] = this.m_bounds[axis][proxy.upperBounds[axis]].value;
	}
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		lowerIndex = proxy.lowerBounds[axis];
		upperIndex = proxy.upperBounds[axis];
		lowerValue = newValues.lowerValues[axis];
		upperValue = newValues.upperValues[axis];
		deltaLower = lowerValue - bounds[lowerIndex].value;
		deltaUpper = upperValue - bounds[upperIndex].value;
		bounds[lowerIndex].value = lowerValue;
		bounds[upperIndex].value = upperValue;
		if (deltaLower < 0) {
			index = lowerIndex;
			while (index > 0 && lowerValue < bounds[index - 1].value) {
				bound = bounds[index];
				prevBound = bounds[index - 1];
				prevProxyId = prevBound.proxyId;
				prevProxy = this.m_proxyPool[prevBound.proxyId];
				prevBound.stabbingCount++;
				if ((prevBound.value & 1) === 1 === true) {
					if (this.TestOverlap$Lb2BoundValues$Lb2Proxy$(newValues, prevProxy)) {
						this.m_pairManager.AddBufferedPair$NN(proxyId, prevProxyId);
					}
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				} else {
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				}
				proxy.lowerBounds[axis]--;
				tempValue$0 = bound.value;
				tempProxyId$0 = bound.proxyId;
				tempStabbingCount$0 = bound.stabbingCount;
				bound.value = prevBound.value;
				bound.proxyId = prevBound.proxyId;
				bound.stabbingCount = prevBound.stabbingCount;
				prevBound.value = tempValue$0;
				prevBound.proxyId = tempProxyId$0;
				prevBound.stabbingCount = tempStabbingCount$0;
				-- index;
			}
		}
		if (deltaUpper > 0) {
			index = upperIndex;
			while (index < boundCount - 1 && bounds[index + 1].value <= upperValue) {
				bound = bounds[index];
				nextBound = bounds[index + 1];
				nextProxyId = nextBound.proxyId;
				nextProxy = this.m_proxyPool[nextProxyId];
				nextBound.stabbingCount++;
				if ((nextBound.value & 1) === 0 === true) {
					if (this.TestOverlap$Lb2BoundValues$Lb2Proxy$(newValues, nextProxy)) {
						this.m_pairManager.AddBufferedPair$NN(proxyId, nextProxyId);
					}
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				} else {
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				}
				proxy.upperBounds[axis]++;
				tempValue$1 = bound.value;
				tempProxyId$1 = bound.proxyId;
				tempStabbingCount$1 = bound.stabbingCount;
				bound.value = nextBound.value;
				bound.proxyId = nextBound.proxyId;
				bound.stabbingCount = nextBound.stabbingCount;
				nextBound.value = tempValue$1;
				nextBound.proxyId = tempProxyId$1;
				nextBound.stabbingCount = tempStabbingCount$1;
				index++;
			}
		}
		if (deltaLower > 0) {
			index = lowerIndex;
			while (index < boundCount - 1 && bounds[index + 1].value <= lowerValue) {
				bound = bounds[index];
				nextBound = bounds[index + 1];
				nextProxyId = nextBound.proxyId;
				nextProxy = this.m_proxyPool[nextProxyId];
				nextBound.stabbingCount--;
				if ((nextBound.value & 1) === 1) {
					if (this.TestOverlap$Lb2BoundValues$Lb2Proxy$(oldValues, nextProxy)) {
						this.m_pairManager.RemoveBufferedPair$NN(proxyId, nextProxyId);
					}
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				} else {
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				}
				proxy.lowerBounds[axis]++;
				tempValue$2 = bound.value;
				tempProxyId$2 = bound.proxyId;
				tempStabbingCount$2 = bound.stabbingCount;
				bound.value = nextBound.value;
				bound.proxyId = nextBound.proxyId;
				bound.stabbingCount = nextBound.stabbingCount;
				nextBound.value = tempValue$2;
				nextBound.proxyId = tempProxyId$2;
				nextBound.stabbingCount = tempStabbingCount$2;
				index++;
			}
		}
		if (deltaUpper < 0) {
			index = upperIndex;
			while (index > 0 && upperValue < bounds[index - 1].value) {
				bound = bounds[index];
				prevBound = bounds[index - 1];
				prevProxyId = prevBound.proxyId;
				prevProxy = this.m_proxyPool[prevProxyId];
				prevBound.stabbingCount--;
				if ((prevBound.value & 1) === 0 === true) {
					if (this.TestOverlap$Lb2BoundValues$Lb2Proxy$(oldValues, prevProxy)) {
						this.m_pairManager.RemoveBufferedPair$NN(proxyId, prevProxyId);
					}
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				} else {
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				}
				proxy.upperBounds[axis]--;
				tempValue$3 = bound.value;
				tempProxyId$3 = bound.proxyId;
				tempStabbingCount$3 = bound.stabbingCount;
				bound.value = prevBound.value;
				bound.proxyId = prevBound.proxyId;
				bound.stabbingCount = prevBound.stabbingCount;
				prevBound.value = tempValue$3;
				prevBound.proxyId = tempProxyId$3;
				prevBound.stabbingCount = tempStabbingCount$3;
				index--;
			}
		}
	}
};

/**
 */
b2BroadPhase.prototype.Commit$ = function () {
	this.m_pairManager.Commit$();
};

/**
 * @param {b2AABB} aabb
 * @param {Array.<undefined|*>} userData
 * @param {!number} maxCount
 * @return {!number}
 */
b2BroadPhase.prototype.QueryAABB$Lb2AABB$AXN = function (aabb, userData, maxCount) {
	/** @type {Array.<undefined|!number>} */
	var lowerValues;
	/** @type {Array.<undefined|!number>} */
	var upperValues;
	/** @type {!number} */
	var lowerIndex;
	/** @type {!number} */
	var upperIndex;
	/** @type {Array.<undefined|!number>} */
	var lowerIndexOut;
	/** @type {Array.<undefined|!number>} */
	var upperIndexOut;
	/** @type {!number} */
	var count;
	/** @type {!number} */
	var i;
	/** @type {b2Proxy} */
	var proxy;
	/** @type {!number} */
	var minVertexX$0;
	/** @type {!number} */
	var minVertexY$0;
	/** @type {!number} */
	var maxVertexX$0;
	/** @type {!number} */
	var maxVertexY$0;
	/** @type {!number} */
	var b$0$0;
	/** @type {!number} */
	var b$1$0;
	/** @type {!number} */
	var b$2$0;
	/** @type {!number} */
	var b$3$0;
	/** @type {!number} */
	var b$4$0;
	/** @type {!number} */
	var b$5$0;
	/** @type {!number} */
	var b$6$0;
	/** @type {!number} */
	var b$7$0;
	lowerValues = [  ];
	upperValues = [  ];
	minVertexX$0 = aabb.minVertex.x;
	minVertexY$0 = aabb.minVertex.y;
	b$0$0 = this.m_worldAABB.maxVertex.x;
	minVertexX$0 = (minVertexX$0 < b$0$0 ? minVertexX$0 : b$0$0);
	b$1$0 = this.m_worldAABB.maxVertex.y;
	minVertexY$0 = (minVertexY$0 < b$1$0 ? minVertexY$0 : b$1$0);
	b$2$0 = this.m_worldAABB.minVertex.x;
	minVertexX$0 = (minVertexX$0 > b$2$0 ? minVertexX$0 : b$2$0);
	b$3$0 = this.m_worldAABB.minVertex.y;
	minVertexY$0 = (minVertexY$0 > b$3$0 ? minVertexY$0 : b$3$0);
	maxVertexX$0 = aabb.maxVertex.x;
	maxVertexY$0 = aabb.maxVertex.y;
	b$4$0 = this.m_worldAABB.maxVertex.x;
	maxVertexX$0 = (maxVertexX$0 < b$4$0 ? maxVertexX$0 : b$4$0);
	b$5$0 = this.m_worldAABB.maxVertex.y;
	maxVertexY$0 = (maxVertexY$0 < b$5$0 ? maxVertexY$0 : b$5$0);
	b$6$0 = this.m_worldAABB.minVertex.x;
	maxVertexX$0 = (maxVertexX$0 > b$6$0 ? maxVertexX$0 : b$6$0);
	b$7$0 = this.m_worldAABB.minVertex.y;
	maxVertexY$0 = (maxVertexY$0 > b$7$0 ? maxVertexY$0 : b$7$0);
	lowerValues[0] = this.m_quantizationFactor.x * (minVertexX$0 - this.m_worldAABB.minVertex.x) & 65534;
	upperValues[0] = this.m_quantizationFactor.x * (maxVertexX$0 - this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues[1] = this.m_quantizationFactor.y * (minVertexY$0 - this.m_worldAABB.minVertex.y) & 65534;
	upperValues[1] = this.m_quantizationFactor.y * (maxVertexY$0 - this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
	lowerIndex = 0;
	upperIndex = 0;
	lowerIndexOut = [ lowerIndex ];
	upperIndexOut = [ upperIndex ];
	this.Query$ANANNNALb2Bound$NN(lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
	this.Query$ANANNNALb2Bound$NN(lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
	count = 0;
	for (i = 0; i < this.m_queryResultCount && count < maxCount; (++ i, ++ count)) {
		proxy = this.m_proxyPool[this.m_queryResults[i]];
		userData[i] = proxy.userData;
	}
	this.m_queryResultCount = 0;
	this.IncrementTimeStamp$();
	return count;
};

/**
 */
b2BroadPhase.prototype.Validate$ = function () {
	/** @type {!number} */
	var axis;
	/** @type {Array.<undefined|b2Bound>} */
	var bounds;
	/** @type {!number} */
	var boundCount;
	/** @type {!number} */
	var stabbingCount;
	/** @type {!number} */
	var i;
	/** @type {b2Bound} */
	var bound;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		boundCount = 2 * this.m_proxyCount;
		stabbingCount = 0;
		for (i = 0; i < boundCount; ++ i) {
			bound = bounds[i];
			if ((bound.value & 1) === 0 === true) {
				stabbingCount++;
			} else {
				stabbingCount--;
			}
		}
	}
};

/**
 * @param {Array.<undefined|!number>} lowerValues
 * @param {Array.<undefined|!number>} upperValues
 * @param {b2AABB} aabb
 */
b2BroadPhase.prototype.ComputeBounds$ANANLb2AABB$ = function (lowerValues, upperValues, aabb) {
	/** @type {!number} */
	var minVertexX;
	/** @type {!number} */
	var minVertexY;
	/** @type {!number} */
	var maxVertexX;
	/** @type {!number} */
	var maxVertexY;
	/** @type {!number} */
	var b$0;
	/** @type {!number} */
	var b$1;
	/** @type {!number} */
	var b$2;
	/** @type {!number} */
	var b$3;
	/** @type {!number} */
	var b$4;
	/** @type {!number} */
	var b$5;
	/** @type {!number} */
	var b$6;
	/** @type {!number} */
	var b$7;
	minVertexX = aabb.minVertex.x;
	minVertexY = aabb.minVertex.y;
	b$0 = this.m_worldAABB.maxVertex.x;
	minVertexX = (minVertexX < b$0 ? minVertexX : b$0);
	b$1 = this.m_worldAABB.maxVertex.y;
	minVertexY = (minVertexY < b$1 ? minVertexY : b$1);
	b$2 = this.m_worldAABB.minVertex.x;
	minVertexX = (minVertexX > b$2 ? minVertexX : b$2);
	b$3 = this.m_worldAABB.minVertex.y;
	minVertexY = (minVertexY > b$3 ? minVertexY : b$3);
	maxVertexX = aabb.maxVertex.x;
	maxVertexY = aabb.maxVertex.y;
	b$4 = this.m_worldAABB.maxVertex.x;
	maxVertexX = (maxVertexX < b$4 ? maxVertexX : b$4);
	b$5 = this.m_worldAABB.maxVertex.y;
	maxVertexY = (maxVertexY < b$5 ? maxVertexY : b$5);
	b$6 = this.m_worldAABB.minVertex.x;
	maxVertexX = (maxVertexX > b$6 ? maxVertexX : b$6);
	b$7 = this.m_worldAABB.minVertex.y;
	maxVertexY = (maxVertexY > b$7 ? maxVertexY : b$7);
	lowerValues[0] = this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.minVertex.x) & 65534;
	upperValues[0] = this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues[1] = this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.minVertex.y) & 65534;
	upperValues[1] = this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
};

/**
 * @param {b2BoundValues} b
 * @param {b2Proxy} p
 * @return {!boolean}
 */
b2BroadPhase.prototype.TestOverlap$Lb2BoundValues$Lb2Proxy$ = function (b, p) {
	/** @type {!number} */
	var axis;
	/** @type {Array.<undefined|b2Bound>} */
	var bounds;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value) {
			return false;
		}
		if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value) {
			return false;
		}
	}
	return true;
};

/**
 * @param {Array.<undefined|!number>} lowerQueryOut
 * @param {Array.<undefined|!number>} upperQueryOut
 * @param {!number} lowerValue
 * @param {!number} upperValue
 * @param {Array.<undefined|b2Bound>} bounds
 * @param {!number} boundCount
 * @param {!number} axis
 */
b2BroadPhase.prototype.Query$ANANNNALb2Bound$NN = function (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
	/** @type {!number} */
	var lowerQuery;
	/** @type {!number} */
	var upperQuery;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var s;
	/** @type {b2Proxy} */
	var proxy;
	/** @type {b2Bound} */
	var this$0;
	/** @type {b2Bound} */
	var this$1;
	lowerQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, lowerValue);
	upperQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, upperValue);
	for (j = lowerQuery; j < upperQuery; ++ j) {
		this$0 = bounds[j];
		if ((this$0.value & 1) === 0) {
			this.IncrementOverlapCount$N(bounds[j].proxyId);
		}
	}
	if (lowerQuery > 0) {
		i = lowerQuery - 1;
		s = bounds[i].stabbingCount;
		while (s !== 0) {
			this$1 = bounds[i];
			if ((this$1.value & 1) === 0) {
				proxy = this.m_proxyPool[bounds[i].proxyId];
				if (lowerQuery <= proxy.upperBounds[axis]) {
					this.IncrementOverlapCount$N(bounds[i].proxyId);
					-- s;
				}
			}
			-- i;
		}
	}
	lowerQueryOut[0] = lowerQuery;
	upperQueryOut[0] = upperQuery;
};

/**
 * @param {!number} proxyId
 */
b2BroadPhase.prototype.IncrementOverlapCount$N = function (proxyId) {
	/** @type {b2Proxy} */
	var proxy;
	proxy = this.m_proxyPool[proxyId];
	if (proxy.timeStamp < this.m_timeStamp) {
		proxy.timeStamp = this.m_timeStamp;
		proxy.overlapCount = 1;
	} else {
		proxy.overlapCount = 2;
		this.m_queryResults[this.m_queryResultCount] = proxyId;
		++ this.m_queryResultCount;
	}
};

/**
 */
b2BroadPhase.prototype.IncrementTimeStamp$ = function () {
	/** @type {!number} */
	var i;
	if (this.m_timeStamp === 0x0000ffff) {
		for (i = 0; i < 1024; ++ i) {
			this.m_proxyPool[i].timeStamp = 0;
		}
		this.m_timeStamp = 1;
	} else {
		++ this.m_timeStamp;
	}
};

/**
 * @param {Array.<undefined|b2Bound>} bounds
 * @param {!number} count
 * @param {!number} value
 * @return {!number}
 */
b2BroadPhase.BinarySearch$ALb2Bound$NN = function (bounds, count, value) {
	/** @type {!number} */
	var low;
	/** @type {!number} */
	var high;
	/** @type {!number} */
	var mid;
	low = 0;
	high = count - 1;
	while (low <= high) {
		mid = Math.floor((low + high) / 2);
		if (bounds[mid].value > value) {
			high = mid - 1;
		} else {
			if (bounds[mid].value < value) {
				low = mid + 1;
			} else {
				return mid;
			}
		}
	}
	return low;
};

var b2BroadPhase$BinarySearch$ALb2Bound$NN = b2BroadPhase.BinarySearch$ALb2Bound$NN;

/**
 * class b2BufferedPair extends Object
 * @constructor
 */
function b2BufferedPair() {
}

b2BufferedPair.prototype = new Object;
/**
 * @constructor
 */
function b2BufferedPair$() {
	this.proxyId1 = 0;
	this.proxyId2 = 0;
};

b2BufferedPair$.prototype = new b2BufferedPair;

/**
 * class b2Collision extends Object
 * @constructor
 */
function b2Collision() {
}

b2Collision.prototype = new Object;
/**
 * @constructor
 */
function b2Collision$() {
};

b2Collision$.prototype = new b2Collision;

/**
 * @param {Array.<undefined|ClipVertex>} vOut
 * @param {Array.<undefined|ClipVertex>} vIn
 * @param {b2Vec2} normal
 * @param {!number} offset
 * @return {!number}
 */
b2Collision.ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N = function (vOut, vIn, normal, offset) {
	/** @type {!number} */
	var numOut;
	/** @type {b2Vec2} */
	var vIn0;
	/** @type {b2Vec2} */
	var vIn1;
	/** @type {!number} */
	var distance0;
	/** @type {!number} */
	var distance1;
	/** @type {!number} */
	var interp;
	/** @type {b2Vec2} */
	var tVec;
	numOut = 0;
	vIn0 = vIn[0].v;
	vIn1 = vIn[1].v;
	distance0 = b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(normal, vIn[0].v) - offset;
	distance1 = b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(normal, vIn[1].v) - offset;
	if (distance0 <= 0.0) {
		vOut[numOut++] = vIn[0];
	}
	if (distance1 <= 0.0) {
		vOut[numOut++] = vIn[1];
	}
	if (distance0 * distance1 < 0.0) {
		interp = distance0 / (distance0 - distance1);
		tVec = vOut[numOut].v;
		tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
		tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
		if (distance0 > 0.0) {
			vOut[numOut].id = vIn[0].id;
		} else {
			vOut[numOut].id = vIn[1].id;
		}
		++ numOut;
	}
	return numOut;
};

var b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N = b2Collision.ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N;

/**
 * @param {b2PolyShape} poly1
 * @param {!number} edge1
 * @param {b2PolyShape} poly2
 * @return {!number}
 */
b2Collision.EdgeSeparation$Lb2PolyShape$NLb2PolyShape$ = function (poly1, edge1, poly2) {
	/** @type {Array.<undefined|b2Vec2>} */
	var vert1s;
	/** @type {!number} */
	var count2;
	/** @type {Array.<undefined|b2Vec2>} */
	var vert2s;
	/** @type {!number} */
	var normalX;
	/** @type {!number} */
	var normalY;
	/** @type {!number} */
	var tX;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var normalLocal2X;
	/** @type {!number} */
	var normalLocal2Y;
	/** @type {!number} */
	var vertexIndex2;
	/** @type {!number} */
	var minDot;
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var dot;
	/** @type {!number} */
	var v1X;
	/** @type {!number} */
	var v1Y;
	/** @type {!number} */
	var v2X;
	/** @type {!number} */
	var v2Y;
	/** @type {!number} */
	var separation;
	vert1s = poly1.m_vertices;
	count2 = poly2.m_vertexCount;
	vert2s = poly2.m_vertices;
	normalX = poly1.m_normals[edge1].x;
	normalY = poly1.m_normals[edge1].y;
	tX = normalX;
	tMat = poly1.m_R;
	normalX = tMat.col1.x * tX + tMat.col2.x * normalY;
	normalY = tMat.col1.y * tX + tMat.col2.y * normalY;
	normalLocal2X = normalX;
	normalLocal2Y = normalY;
	tMat = poly2.m_R;
	tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y;
	normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y;
	normalLocal2X = tX;
	vertexIndex2 = 0;
	minDot = Number.MAX_VALUE;
	for (i = 0; i < count2; ++ i) {
		tVec = vert2s[i];
		dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y;
		if (dot < minDot) {
			minDot = dot;
			vertexIndex2 = i;
		}
	}
	tMat = poly1.m_R;
	v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y);
	v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y);
	tMat = poly2.m_R;
	v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y);
	v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y);
	v2X -= v1X;
	v2Y -= v1Y;
	separation = v2X * normalX + v2Y * normalY;
	return separation;
};

var b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$ = b2Collision.EdgeSeparation$Lb2PolyShape$NLb2PolyShape$;

/**
 * @param {Array.<undefined|!number>} edgeIndex
 * @param {b2PolyShape} poly1
 * @param {b2PolyShape} poly2
 * @param {!boolean} conservative
 * @return {!number}
 */
b2Collision.FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B = function (edgeIndex, poly1, poly2, conservative) {
	/** @type {!number} */
	var count1;
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {!number} */
	var dLocal1X;
	/** @type {!number} */
	var dLocal1Y;
	/** @type {!number} */
	var edge;
	/** @type {!number} */
	var maxDot;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var dot;
	/** @type {!number} */
	var s;
	/** @type {!number} */
	var prevEdge;
	/** @type {!number} */
	var sPrev;
	/** @type {!number} */
	var nextEdge;
	/** @type {!number} */
	var sNext;
	/** @type {!number} */
	var bestEdge;
	/** @type {!number} */
	var bestSeparation;
	/** @type {!number} */
	var increment;
	count1 = poly1.m_vertexCount;
	dX = poly2.m_position.x - poly1.m_position.x;
	dY = poly2.m_position.y - poly1.m_position.y;
	dLocal1X = dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y;
	dLocal1Y = dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y;
	edge = 0;
	maxDot = - Number.MAX_VALUE;
	for (i = 0; i < count1; ++ i) {
		dot = poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y;
		if (dot > maxDot) {
			maxDot = dot;
			edge = i;
		}
	}
	s = b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$(poly1, edge, poly2);
	if (s > 0.0 && conservative === false) {
		return s;
	}
	prevEdge = (edge - 1 >= 0 ? edge - 1 : count1 - 1);
	sPrev = b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$(poly1, prevEdge, poly2);
	if (sPrev > 0.0 && conservative === false) {
		return sPrev;
	}
	nextEdge = (edge + 1 < count1 ? edge + 1 : 0);
	sNext = b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$(poly1, nextEdge, poly2);
	if (sNext > 0.0 && conservative === false) {
		return sNext;
	}
	bestEdge = 0;
	increment = 0;
	if (sPrev > s && sPrev > sNext) {
		increment = -1;
		bestEdge = prevEdge;
		bestSeparation = sPrev;
	} else {
		if (sNext > s) {
			increment = 1;
			bestEdge = nextEdge;
			bestSeparation = sNext;
		} else {
			edgeIndex[0] = edge;
			return s;
		}
	}
	while (true) {
		if (increment === -1) {
			edge = (bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1);
		} else {
			edge = (bestEdge + 1 < count1 ? bestEdge + 1 : 0);
		}
		s = b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$(poly1, edge, poly2);
		if (s > 0.0 && conservative === false) {
			return s;
		}
		if (s > bestSeparation) {
			bestEdge = edge;
			bestSeparation = s;
		} else {
			break;
		}
	}
	edgeIndex[0] = bestEdge;
	return bestSeparation;
};

var b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B = b2Collision.FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B;

/**
 * @param {Array.<undefined|ClipVertex>} c
 * @param {b2PolyShape} poly1
 * @param {!number} edge1
 * @param {b2PolyShape} poly2
 */
b2Collision.FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$ = function (c, poly1, edge1, poly2) {
	/** @type {!number} */
	var count1;
	/** @type {Array.<undefined|b2Vec2>} */
	var vert1s;
	/** @type {!number} */
	var count2;
	/** @type {Array.<undefined|b2Vec2>} */
	var vert2s;
	/** @type {!number} */
	var vertex11;
	/** @type {!number} */
	var vertex12;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var normal1Local1X;
	/** @type {!number} */
	var normal1Local1Y;
	/** @type {!number} */
	var tX;
	/** @type {!number} */
	var invLength;
	/** @type {!number} */
	var normal1X;
	/** @type {!number} */
	var normal1Y;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var normal1Local2X;
	/** @type {!number} */
	var normal1Local2Y;
	/** @type {!number} */
	var vertex21;
	/** @type {!number} */
	var vertex22;
	/** @type {!number} */
	var minDot;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var i1;
	/** @type {!number} */
	var i2;
	/** @type {!number} */
	var normal2Local2X;
	/** @type {!number} */
	var normal2Local2Y;
	/** @type {!number} */
	var dot;
	/** @type {ClipVertex} */
	var tClip;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {!number} */
	var tX$0;
	/** @type {b2Vec2} */
	var v$1;
	/** @type {b2Vec2} */
	var v$2;
	/** @type {b2Mat22} */
	var A$1;
	/** @type {!number} */
	var tX$1;
	/** @type {b2Vec2} */
	var v$3;
	count1 = poly1.m_vertexCount;
	vert1s = poly1.m_vertices;
	count2 = poly2.m_vertexCount;
	vert2s = poly2.m_vertices;
	vertex11 = edge1;
	vertex12 = (edge1 + 1 === count1 ? 0 : edge1 + 1);
	tVec = vert1s[vertex12];
	normal1Local1X = tVec.x;
	normal1Local1Y = tVec.y;
	tVec = vert1s[vertex11];
	normal1Local1X -= tVec.x;
	normal1Local1Y -= tVec.y;
	tX = normal1Local1X;
	normal1Local1X = normal1Local1Y;
	normal1Local1Y = - tX;
	invLength = 1.0 / Math.sqrt(normal1Local1X * normal1Local1X + normal1Local1Y * normal1Local1Y);
	normal1Local1X *= invLength;
	normal1Local1Y *= invLength;
	normal1X = normal1Local1X;
	normal1Y = normal1Local1Y;
	tX = normal1X;
	tMat = poly1.m_R;
	normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y;
	normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y;
	normal1Local2X = normal1X;
	normal1Local2Y = normal1Y;
	tMat = poly2.m_R;
	tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y;
	normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y;
	normal1Local2X = tX;
	vertex21 = 0;
	vertex22 = 0;
	minDot = Number.MAX_VALUE;
	for (i = 0; i < count2; ++ i) {
		i1 = i;
		i2 = (i + 1 < count2 ? i + 1 : 0);
		tVec = vert2s[i2];
		normal2Local2X = tVec.x;
		normal2Local2Y = tVec.y;
		tVec = vert2s[i1];
		normal2Local2X -= tVec.x;
		normal2Local2Y -= tVec.y;
		tX = normal2Local2X;
		normal2Local2X = normal2Local2Y;
		normal2Local2Y = - tX;
		invLength = 1.0 / Math.sqrt(normal2Local2X * normal2Local2X + normal2Local2Y * normal2Local2Y);
		normal2Local2X *= invLength;
		normal2Local2Y *= invLength;
		dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y;
		if (dot < minDot) {
			minDot = dot;
			vertex21 = i1;
			vertex22 = i2;
		}
	}
	tClip = c[0];
	tVec = tClip.v;
	v$0 = vert2s[vertex21];
	tVec.x = v$0.x;
	tVec.y = v$0.y;
	A$0 = poly2.m_R;
	tX$0 = tVec.x;
	tVec.x = A$0.col1.x * tX$0 + A$0.col2.x * tVec.y;
	tVec.y = A$0.col1.y * tX$0 + A$0.col2.y * tVec.y;
	v$1 = poly2.m_position;
	tVec.x += v$1.x;
	tVec.y += v$1.y;
	tClip.id.features.referenceFace = edge1;
	tClip.id.features.incidentEdge = vertex21;
	tClip.id.features.incidentVertex = vertex21;
	tClip = c[1];
	tVec = tClip.v;
	v$2 = vert2s[vertex22];
	tVec.x = v$2.x;
	tVec.y = v$2.y;
	A$1 = poly2.m_R;
	tX$1 = tVec.x;
	tVec.x = A$1.col1.x * tX$1 + A$1.col2.x * tVec.y;
	tVec.y = A$1.col1.y * tX$1 + A$1.col2.y * tVec.y;
	v$3 = poly2.m_position;
	tVec.x += v$3.x;
	tVec.y += v$3.y;
	tClip.id.features.referenceFace = edge1;
	tClip.id.features.incidentEdge = vertex21;
	tClip.id.features.incidentVertex = vertex22;
};

var b2Collision$FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$ = b2Collision.FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$;

/**
 * @param {b2Manifold} manifold
 * @param {b2PolyShape} polyA
 * @param {b2PolyShape} polyB
 * @param {!boolean} conservative
 */
b2Collision.b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B = function (manifold, polyA, polyB, conservative) {
	/** @type {!number} */
	var edgeA;
	/** @type {Array.<undefined|!number>} */
	var edgeAOut;
	/** @type {!number} */
	var separationA;
	/** @type {!number} */
	var edgeB;
	/** @type {Array.<undefined|!number>} */
	var edgeBOut;
	/** @type {!number} */
	var separationB;
	/** @type {b2PolyShape} */
	var poly1;
	/** @type {b2PolyShape} */
	var poly2;
	/** @type {!number} */
	var edge1;
	/** @type {!number} */
	var flip;
	/** @type {!number} */
	var k_relativeTol;
	/** @type {!number} */
	var k_absoluteTol;
	/** @type {Array.<undefined|ClipVertex>} */
	var incidentEdge;
	/** @type {!number} */
	var count1;
	/** @type {Array.<undefined|b2Vec2>} */
	var vert1s;
	/** @type {b2Vec2} */
	var v11;
	/** @type {b2Vec2} */
	var v12;
	/** @type {!number} */
	var dvX;
	/** @type {!number} */
	var dvY;
	/** @type {!number} */
	var sideNormalX;
	/** @type {!number} */
	var sideNormalY;
	/** @type {!number} */
	var tX;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var invLength;
	/** @type {!number} */
	var frontNormalX;
	/** @type {!number} */
	var frontNormalY;
	/** @type {!number} */
	var v11X;
	/** @type {!number} */
	var v11Y;
	/** @type {!number} */
	var v12X;
	/** @type {!number} */
	var v12Y;
	/** @type {!number} */
	var frontOffset;
	/** @type {!number} */
	var sideOffset1;
	/** @type {!number} */
	var sideOffset2;
	/** @type {Array.<undefined|ClipVertex>} */
	var clipPoints1;
	/** @type {Array.<undefined|ClipVertex>} */
	var clipPoints2;
	/** @type {!number} */
	var np;
	/** @type {!number} */
	var pointCount;
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var separation;
	/** @type {b2ContactPoint} */
	var cp;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	/** @type {b2Vec2} */
	var this$3;
	/** @type {b2Vec2} */
	var this$4;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2ContactID} */
	var this$5;
	/** @type {b2ContactID} */
	var id$0;
	/** @type {!number} */
	var value$0$0;
	manifold.pointCount = 0;
	edgeA = 0;
	edgeAOut = [ edgeA ];
	separationA = b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B(edgeAOut, polyA, polyB, conservative);
	edgeA = edgeAOut[0];
	if (separationA > 0.0 && conservative === false) {
		return;
	}
	edgeB = 0;
	edgeBOut = [ edgeB ];
	separationB = b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B(edgeBOut, polyB, polyA, conservative);
	edgeB = edgeBOut[0];
	if (separationB > 0.0 && conservative === false) {
		return;
	}
	edge1 = 0;
	flip = 0;
	k_relativeTol = 0.98;
	k_absoluteTol = 0.001;
	if (separationB > k_relativeTol * separationA + k_absoluteTol) {
		poly1 = polyB;
		poly2 = polyA;
		edge1 = edgeB;
		flip = 1;
	} else {
		poly1 = polyA;
		poly2 = polyB;
		edge1 = edgeA;
		flip = 0;
	}
	incidentEdge = [ new ClipVertex$(), new ClipVertex$() ];
	b2Collision$FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$(incidentEdge, poly1, edge1, poly2);
	count1 = poly1.m_vertexCount;
	vert1s = poly1.m_vertices;
	v11 = vert1s[edge1];
	v12 = (edge1 + 1 < count1 ? vert1s[edge1 + 1] : vert1s[0]);
	dvX = v12.x - v11.x;
	dvY = v12.y - v11.y;
	sideNormalX = v12.x - v11.x;
	sideNormalY = v12.y - v11.y;
	tX = sideNormalX;
	tMat = poly1.m_R;
	sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY;
	sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY;
	invLength = 1.0 / Math.sqrt(sideNormalX * sideNormalX + sideNormalY * sideNormalY);
	sideNormalX *= invLength;
	sideNormalY *= invLength;
	frontNormalX = sideNormalX;
	frontNormalY = sideNormalY;
	tX = frontNormalX;
	frontNormalX = frontNormalY;
	frontNormalY = - tX;
	v11X = v11.x;
	v11Y = v11.y;
	tX = v11X;
	tMat = poly1.m_R;
	v11X = tMat.col1.x * tX + tMat.col2.x * v11Y;
	v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y;
	v11X += poly1.m_position.x;
	v11Y += poly1.m_position.y;
	v12X = v12.x;
	v12Y = v12.y;
	tX = v12X;
	tMat = poly1.m_R;
	v12X = tMat.col1.x * tX + tMat.col2.x * v12Y;
	v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y;
	v12X += poly1.m_position.x;
	v12Y += poly1.m_position.y;
	frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
	sideOffset1 = - (sideNormalX * v11X + sideNormalY * v11Y);
	sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;
	clipPoints1 = [ new ClipVertex$(), new ClipVertex$() ];
	clipPoints2 = [ new ClipVertex$(), new ClipVertex$() ];
	np = 0;
	this$0 = b2Collision.b2CollidePolyTempVec;
	x$0 = - sideNormalX;
	y$0 = - sideNormalY;
	this$0.x = x$0;
	this$0.y = y$0;
	np = b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1);
	if (np < 2) {
		return;
	}
	this$1 = b2Collision.b2CollidePolyTempVec;
	this$1.x = sideNormalX;
	this$1.y = sideNormalY;
	np = b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N(clipPoints2, clipPoints1, b2Collision.b2CollidePolyTempVec, sideOffset2);
	if (np < 2) {
		return;
	}
	if (flip !== 0) {
		this$2 = manifold.normal;
		x$1 = - frontNormalX;
		y$1 = - frontNormalY;
		this$2.x = x$1;
		this$2.y = y$1;
	} else {
		this$3 = manifold.normal;
		this$3.x = frontNormalX;
		this$3.y = frontNormalY;
	}
	pointCount = 0;
	for (i = 0; i < 2; ++ i) {
		tVec = clipPoints2[i].v;
		separation = frontNormalX * tVec.x + frontNormalY * tVec.y - frontOffset;
		if (separation <= 0.0 || conservative === true) {
			cp = manifold.points[pointCount];
			cp.separation = separation;
			this$4 = cp.position;
			v$0 = clipPoints2[i].v;
			this$4.x = v$0.x;
			this$4.y = v$0.y;
			this$5 = cp.id;
			id$0 = clipPoints2[i].id;
			value$0$0 = id$0._key;
			this$5._key = value$0$0;
			this$5.features._referenceFace = this$5._key & 0x000000ff;
			this$5.features._incidentEdge = (this$5._key & 0x0000ff00) >> 8 & 0x000000ff;
			this$5.features._incidentVertex = (this$5._key & 0x00ff0000) >> 16 & 0x000000ff;
			this$5.features._flip = (this$5._key & 0xff000000) >> 24 & 0x000000ff;
			cp.id.features.flip = flip;
			++ pointCount;
		}
	}
	manifold.pointCount = pointCount;
};

var b2Collision$b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B = b2Collision.b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B;

/**
 * @param {b2Manifold} manifold
 * @param {b2CircleShape} circle1
 * @param {b2CircleShape} circle2
 * @param {!boolean} conservative
 */
b2Collision.b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B = function (manifold, circle1, circle2, conservative) {
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {!number} */
	var distSqr;
	/** @type {!number} */
	var radiusSum;
	/** @type {!number} */
	var separation;
	/** @type {!number} */
	var dist;
	/** @type {!number} */
	var a;
	/** @type {b2ContactPoint} */
	var tPoint;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2ContactID} */
	var this$1;
	manifold.pointCount = 0;
	dX = circle2.m_position.x - circle1.m_position.x;
	dY = circle2.m_position.y - circle1.m_position.y;
	distSqr = dX * dX + dY * dY;
	radiusSum = circle1.m_radius + circle2.m_radius;
	if (distSqr > radiusSum * radiusSum && conservative === false) {
		return;
	}
	if (distSqr < Number.MIN_VALUE) {
		separation = - radiusSum;
		this$0 = manifold.normal;
		this$0.x = 0.0;
		this$0.y = 1.0;
	} else {
		dist = Math.sqrt(distSqr);
		separation = dist - radiusSum;
		a = 1.0 / dist;
		manifold.normal.x = a * dX;
		manifold.normal.y = a * dY;
	}
	manifold.pointCount = 1;
	tPoint = manifold.points[0];
	this$1 = tPoint.id;
	this$1._key = 0;
	this$1.features._referenceFace = this$1._key & 0x000000ff;
	this$1.features._incidentEdge = (this$1._key & 0x0000ff00) >> 8 & 0x000000ff;
	this$1.features._incidentVertex = (this$1._key & 0x00ff0000) >> 16 & 0x000000ff;
	this$1.features._flip = (this$1._key & 0xff000000) >> 24 & 0x000000ff;
	tPoint.separation = separation;
	tPoint.position.x = circle2.m_position.x - circle2.m_radius * manifold.normal.x;
	tPoint.position.y = circle2.m_position.y - circle2.m_radius * manifold.normal.y;
};

var b2Collision$b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B = b2Collision.b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B;

/**
 * @param {b2Manifold} manifold
 * @param {b2PolyShape} poly
 * @param {b2CircleShape} circle
 * @param {!boolean} conservative
 */
b2Collision.b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B = function (manifold, poly, circle, conservative) {
	/** @type {b2ContactPoint} */
	var tPoint;
	/** @type {!number} */
	var dX;
	/** @type {!number} */
	var dY;
	/** @type {!number} */
	var xLocalX;
	/** @type {!number} */
	var xLocalY;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var tX;
	/** @type {!number} */
	var dist;
	/** @type {!number} */
	var normalIndex;
	/** @type {!number} */
	var separation;
	/** @type {!number} */
	var radius;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var s;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var vertIndex1;
	/** @type {!number} */
	var vertIndex2;
	/** @type {!number} */
	var eX;
	/** @type {!number} */
	var eY;
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var u;
	/** @type {!number} */
	var pX;
	/** @type {!number} */
	var pY;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	manifold.pointCount = 0;
	xLocalX = circle.m_position.x - poly.m_position.x;
	xLocalY = circle.m_position.y - poly.m_position.y;
	tMat = poly.m_R;
	tX = xLocalX * tMat.col1.x + xLocalY * tMat.col1.y;
	xLocalY = xLocalX * tMat.col2.x + xLocalY * tMat.col2.y;
	xLocalX = tX;
	normalIndex = 0;
	separation = - Number.MAX_VALUE;
	radius = circle.m_radius;
	for (i = 0; i < poly.m_vertexCount; ++ i) {
		s = poly.m_normals[i].x * (xLocalX - poly.m_vertices[i].x) + poly.m_normals[i].y * (xLocalY - poly.m_vertices[i].y);
		if (s > radius) {
			return;
		}
		if (s > separation) {
			separation = s;
			normalIndex = i;
		}
	}
	if (separation < Number.MIN_VALUE) {
		manifold.pointCount = 1;
		tVec = poly.m_normals[normalIndex];
		manifold.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		manifold.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tPoint = manifold.points[0];
		tPoint.id.features.incidentEdge = normalIndex;
		tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
		tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
		tPoint.id.features.flip = 0;
		tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
		tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
		tPoint.separation = separation - radius;
		return;
	}
	vertIndex1 = normalIndex;
	vertIndex2 = (vertIndex1 + 1 < poly.m_vertexCount ? vertIndex1 + 1 : 0);
	eX = poly.m_vertices[vertIndex2].x - poly.m_vertices[vertIndex1].x;
	eY = poly.m_vertices[vertIndex2].y - poly.m_vertices[vertIndex1].y;
	length = Math.sqrt(eX * eX + eY * eY);
	eX /= length;
	eY /= length;
	if (length < Number.MIN_VALUE) {
		dX = xLocalX - poly.m_vertices[vertIndex1].x;
		dY = xLocalY - poly.m_vertices[vertIndex1].y;
		dist = Math.sqrt(dX * dX + dY * dY);
		dX /= dist;
		dY /= dist;
		if (dist > radius) {
			return;
		}
		manifold.pointCount = 1;
		this$0 = manifold.normal;
		x$0 = tMat.col1.x * dX + tMat.col2.x * dY;
		y$0 = tMat.col1.y * dX + tMat.col2.y * dY;
		this$0.x = x$0;
		this$0.y = y$0;
		tPoint = manifold.points[0];
		tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
		tPoint.id.features.incidentVertex = vertIndex1;
		tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
		tPoint.id.features.flip = 0;
		tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
		tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
		tPoint.separation = dist - radius;
		return;
	}
	u = (xLocalX - poly.m_vertices[vertIndex1].x) * eX + (xLocalY - poly.m_vertices[vertIndex1].y) * eY;
	tPoint = manifold.points[0];
	tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
	tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
	tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
	tPoint.id.features.flip = 0;
	if (u <= 0.0) {
		pX = poly.m_vertices[vertIndex1].x;
		pY = poly.m_vertices[vertIndex1].y;
		tPoint.id.features.incidentVertex = vertIndex1;
	} else {
		if (u >= length) {
			pX = poly.m_vertices[vertIndex2].x;
			pY = poly.m_vertices[vertIndex2].y;
			tPoint.id.features.incidentVertex = vertIndex2;
		} else {
			pX = eX * u + poly.m_vertices[vertIndex1].x;
			pY = eY * u + poly.m_vertices[vertIndex1].y;
			tPoint.id.features.incidentEdge = vertIndex1;
		}
	}
	dX = xLocalX - pX;
	dY = xLocalY - pY;
	dist = Math.sqrt(dX * dX + dY * dY);
	dX /= dist;
	dY /= dist;
	if (dist > radius) {
		return;
	}
	manifold.pointCount = 1;
	this$1 = manifold.normal;
	x$1 = tMat.col1.x * dX + tMat.col2.x * dY;
	y$1 = tMat.col1.y * dX + tMat.col2.y * dY;
	this$1.x = x$1;
	this$1.y = y$1;
	tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
	tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
	tPoint.separation = dist - radius;
};

var b2Collision$b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B = b2Collision.b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B;

/**
 * class b2ContactID extends Object
 * @constructor
 */
function b2ContactID() {
}

b2ContactID.prototype = new Object;
/**
 * @constructor
 */
function b2ContactID$() {
	this._key = 0;
	this.key = 0;
	this.features = new Features$();
	this.features._m_id = this;
};

b2ContactID$.prototype = new b2ContactID;

/**
 * @param {b2ContactID} id
 */
b2ContactID.prototype.Set$Lb2ContactID$ = function (id) {
	/** @type {!number} */
	var value$0;
	value$0 = id._key;
	this._key = value$0;
	this.features._referenceFace = this._key & 0x000000ff;
	this.features._incidentEdge = (this._key & 0x0000ff00) >> 8 & 0x000000ff;
	this.features._incidentVertex = (this._key & 0x00ff0000) >> 16 & 0x000000ff;
	this.features._flip = (this._key & 0xff000000) >> 24 & 0x000000ff;
};

/**
 * @return {b2ContactID}
 */
b2ContactID.prototype.Copy$ = function () {
	/** @type {b2ContactID} */
	var id;
	/** @type {!number} */
	var value$0;
	id = new b2ContactID$();
	value$0 = this._key;
	id._key = value$0;
	id.features._referenceFace = id._key & 0x000000ff;
	id.features._incidentEdge = (id._key & 0x0000ff00) >> 8 & 0x000000ff;
	id.features._incidentVertex = (id._key & 0x00ff0000) >> 16 & 0x000000ff;
	id.features._flip = (id._key & 0xff000000) >> 24 & 0x000000ff;
	return id;
};

/**
 * @return {!number}
 */
b2ContactID.prototype.get_key$ = function () {
	return this._key;
};

/**
 * @param {!number} value
 */
b2ContactID.prototype.set_key$N = function (value) {
	this._key = value;
	this.features._referenceFace = this._key & 0x000000ff;
	this.features._incidentEdge = (this._key & 0x0000ff00) >> 8 & 0x000000ff;
	this.features._incidentVertex = (this._key & 0x00ff0000) >> 16 & 0x000000ff;
	this.features._flip = (this._key & 0xff000000) >> 24 & 0x000000ff;
};

/**
 * class b2ContactPoint extends Object
 * @constructor
 */
function b2ContactPoint() {
}

b2ContactPoint.prototype = new Object;
/**
 * @constructor
 */
function b2ContactPoint$() {
	this.normalImpulse = 0;
	this.tangentImpulse = 0;
	this.position = new b2Vec2$();
	this.id = new b2ContactID$();
	this.separation = 0;
};

b2ContactPoint$.prototype = new b2ContactPoint;

/**
 * class b2Manifold extends Object
 * @constructor
 */
function b2Manifold() {
}

b2Manifold.prototype = new Object;
/**
 * @constructor
 */
function b2Manifold$() {
	/** @type {!number} */
	var i;
	this.normal = undefined;
	this.pointCount = 0;
	this.points = [  ];
	this.points.length = 2;
	for (i = 0; i < 2; i++) {
		this.points[i] = new b2ContactPoint$();
	}
	this.normal = new b2Vec2$();
};

b2Manifold$.prototype = new b2Manifold;

/**
 * class b2OBB extends Object
 * @constructor
 */
function b2OBB() {
}

b2OBB.prototype = new Object;
/**
 * @constructor
 */
function b2OBB$() {
	this.R = new b2Mat22$();
	this.center = new b2Vec2$();
	this.extents = new b2Vec2$();
};

b2OBB$.prototype = new b2OBB;

/**
 * class b2Pair extends Object
 * @constructor
 */
function b2Pair() {
}

b2Pair.prototype = new Object;
/**
 * @constructor
 */
function b2Pair$() {
	this.userData = undefined;
	this.proxyId1 = 0;
	this.proxyId2 = 0;
	this.next = 0;
	this.status = 0;
};

b2Pair$.prototype = new b2Pair;

/**
 */
b2Pair.prototype.SetBuffered$ = function () {
	this.status |= 0x0001;
};

/**
 */
b2Pair.prototype.ClearBuffered$ = function () {
	this.status &= ~ 0x0001;
};

/**
 * @return {!boolean}
 */
b2Pair.prototype.IsBuffered$ = function () {
	return (this.status & 0x0001) === 0x0001;
};

/**
 */
b2Pair.prototype.SetRemoved$ = function () {
	this.status |= 0x0002;
};

/**
 */
b2Pair.prototype.ClearRemoved$ = function () {
	this.status &= ~ 0x0002;
};

/**
 * @return {!boolean}
 */
b2Pair.prototype.IsRemoved$ = function () {
	return (this.status & 0x0002) === 0x0002;
};

/**
 */
b2Pair.prototype.SetFinal$ = function () {
	this.status |= 0x0004;
};

/**
 * @return {!boolean}
 */
b2Pair.prototype.IsFinal$ = function () {
	return (this.status & 0x0004) === 0x0004;
};

/**
 * class b2PairCallback extends Object
 * @constructor
 */
function b2PairCallback() {
}

b2PairCallback.prototype = new Object;
/**
 * @constructor
 */
function b2PairCallback$() {
};

b2PairCallback$.prototype = new b2PairCallback;

/**
 * @param {*} proxyUserData1
 * @param {*} proxyUserData2
 * @return {*}
 */
b2PairCallback.prototype.PairAdded$XX = function (proxyUserData1, proxyUserData2) {
	return undefined;
};

/**
 * @param {*} proxyUserData1
 * @param {*} proxyUserData2
 * @param {*} pairUserData
 */
b2PairCallback.prototype.PairRemoved$XXX = function (proxyUserData1, proxyUserData2, pairUserData) {
};

/**
 * class b2PairManager extends Object
 * @constructor
 */
function b2PairManager() {
}

b2PairManager.prototype = new Object;
/**
 * @constructor
 */
function b2PairManager$() {
	/** @type {!number} */
	var i;
	this.m_broadPhase = undefined;
	this.m_callback = undefined;
	this.m_pairs = undefined;
	this.m_freePair = 0;
	this.m_pairCount = 0;
	this.m_pairBuffer = undefined;
	this.m_pairBufferCount = 0;
	i = 0;
	this.m_hashTable = [  ];
	this.m_hashTable.length = (b2Pair.b2_tableCapacity | 0);
	for (i = 0; i < b2Pair.b2_tableCapacity; ++ i) {
		this.m_hashTable[i] = b2Pair.b2_nullPair;
	}
	this.m_pairs = [  ];
	this.m_pairs.length = 8192;
	for (i = 0; i < 8192; ++ i) {
		this.m_pairs[i] = new b2Pair$();
	}
	this.m_pairBuffer = [  ];
	this.m_pairBuffer.length = 8192;
	for (i = 0; i < 8192; ++ i) {
		this.m_pairBuffer[i] = new b2BufferedPair$();
	}
	for (i = 0; i < 8192; ++ i) {
		this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
		this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
		this.m_pairs[i].userData = undefined;
		this.m_pairs[i].status = 0;
		this.m_pairs[i].next = i + 1;
	}
	this.m_pairs[8191].next = b2Pair.b2_nullPair;
	this.m_pairCount = 0;
};

b2PairManager$.prototype = new b2PairManager;

/**
 * @param {b2BroadPhase} broadPhase
 * @param {b2PairCallback} callback
 */
b2PairManager.prototype.Initialize$Lb2BroadPhase$Lb2PairCallback$ = function (broadPhase, callback) {
	this.m_broadPhase = broadPhase;
	this.m_callback = callback;
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 */
b2PairManager.prototype.AddBufferedPair$NN = function (proxyId1, proxyId2) {
	/** @type {b2Pair} */
	var pair;
	pair = this.AddPair$NN(proxyId1, proxyId2);
	if ((pair.status & 0x0001) === 0x0001 === false) {
		pair.status |= 0x0001;
		this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
		++ this.m_pairBufferCount;
	}
	pair.status &= ~ 0x0002;
	if (false) {
	}
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 */
b2PairManager.prototype.RemoveBufferedPair$NN = function (proxyId1, proxyId2) {
	/** @type {b2Pair} */
	var pair;
	pair = this.Find$NN(proxyId1, proxyId2);
	if (pair == undefined) {
		return;
	}
	if ((pair.status & 0x0001) === 0x0001 === false) {
		pair.status |= 0x0001;
		this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
		++ this.m_pairBufferCount;
	}
	pair.status |= 0x0002;
	if (false) {
	}
};

/**
 */
b2PairManager.prototype.Commit$ = function () {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var removeCount;
	/** @type {Array.<undefined|b2Proxy>} */
	var proxies;
	/** @type {b2Pair} */
	var pair;
	/** @type {b2Proxy} */
	var proxy1;
	/** @type {b2Proxy} */
	var proxy2;
	i = 0;
	removeCount = 0;
	proxies = this.m_broadPhase.m_proxyPool;
	for (i = 0; i < this.m_pairBufferCount; ++ i) {
		pair = this.Find$NN(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
		pair.status &= ~ 0x0001;
		proxy1 = proxies[pair.proxyId1];
		proxy2 = proxies[pair.proxyId2];
		if ((pair.status & 0x0002) === 0x0002) {
			if ((pair.status & 0x0004) === 0x0004 === true) {
				this.m_callback.PairRemoved$XXX(proxy1.userData, proxy2.userData, pair.userData);
			}
			this.m_pairBuffer[removeCount].proxyId1 = pair.proxyId1;
			this.m_pairBuffer[removeCount].proxyId2 = pair.proxyId2;
			++ removeCount;
		} else {
			if ((pair.status & 0x0004) === 0x0004 === false) {
				pair.userData = this.m_callback.PairAdded$XX(proxy1.userData, proxy2.userData);
				pair.status |= 0x0004;
			}
		}
	}
	for (i = 0; i < removeCount; ++ i) {
		this.RemovePair$NN(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
	}
	this.m_pairBufferCount = 0;
	if (false) {
	}
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @return {b2Pair}
 */
b2PairManager.prototype.AddPair$NN = function (proxyId1, proxyId2) {
	/** @type {!number} */
	var temp;
	/** @type {!number} */
	var hash;
	/** @type {b2Pair} */
	var pair;
	/** @type {!number} */
	var pIndex;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	pair = pair = this.FindHash$NNN(proxyId1, proxyId2, hash);
	if (pair != undefined) {
		return pair;
	}
	pIndex = this.m_freePair;
	pair = this.m_pairs[pIndex];
	this.m_freePair = pair.next;
	pair.proxyId1 = proxyId1;
	pair.proxyId2 = proxyId2;
	pair.status = 0;
	pair.userData = undefined;
	pair.next = this.m_hashTable[hash];
	this.m_hashTable[hash] = pIndex;
	++ this.m_pairCount;
	return pair;
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @return {*}
 */
b2PairManager.prototype.RemovePair$NN = function (proxyId1, proxyId2) {
	/** @type {!number} */
	var temp;
	/** @type {!number} */
	var hash;
	/** @type {undefined|!number} */
	var node;
	/** @type {b2Pair} */
	var pNode;
	/** @type {undefined|!number} */
	var index;
	/** @type {b2Pair} */
	var pair;
	/** @type {*} */
	var userData;
	/** @type {b2Pair} */
	var pair$0;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	node = this.m_hashTable[hash];
	pNode = undefined;
	while (node != b2Pair.b2_nullPair) {
		pair$0 = this.m_pairs[node];
		if (pair$0.proxyId1 === proxyId1 && pair$0.proxyId2 === proxyId2) {
			index = node;
			if (pNode != undefined) {
				pNode.next = this.m_pairs[node].next;
			} else {
				this.m_hashTable[hash] = this.m_pairs[node].next;
			}
			pair = this.m_pairs[index];
			userData = pair.userData;
			pair.next = this.m_freePair;
			pair.proxyId1 = b2Pair.b2_nullProxy;
			pair.proxyId2 = b2Pair.b2_nullProxy;
			pair.userData = undefined;
			pair.status = 0;
			this.m_freePair = index;
			-- this.m_pairCount;
			return userData;
		} else {
			pNode = this.m_pairs[node];
			node = pNode.next;
		}
	}
	return undefined;
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @return {b2Pair}
 */
b2PairManager.prototype.Find$NN = function (proxyId1, proxyId2) {
	/** @type {!number} */
	var temp;
	/** @type {!number} */
	var hash;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	return this.FindHash$NNN(proxyId1, proxyId2, hash);
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @param {!number} hash
 * @return {b2Pair}
 */
b2PairManager.prototype.FindHash$NNN = function (proxyId1, proxyId2, hash) {
	/** @type {undefined|!number} */
	var index;
	index = this.m_hashTable[hash];
	while (index != b2Pair.b2_nullPair && b2PairManager$Equals$Lb2Pair$NN(this.m_pairs[index], proxyId1, proxyId2) === false) {
		index = this.m_pairs[index].next;
	}
	return (index == b2Pair.b2_nullPair ? undefined : this.m_pairs[index]);
};

/**
 */
b2PairManager.prototype.ValidateBuffer$ = function () {
};

/**
 */
b2PairManager.prototype.ValidateTable$ = function () {
};

/**
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @return {!number}
 */
b2PairManager.Hash$NN = function (proxyId1, proxyId2) {
	/** @type {!number} */
	var key;
	key = proxyId2 << 16 & 0xffff0000 | proxyId1;
	key = ~ key + (key << 15 & 0xFFFF8000);
	key = key ^ key >> 12 & 0x000fffff;
	key = key + (key << 2 & 0xFFFFFFFC);
	key = key ^ key >> 4 & 0x0fffffff;
	key = (key * 2057 | 0);
	key = key ^ key >> 16 & 0x0000ffff;
	return key;
};

var b2PairManager$Hash$NN = b2PairManager.Hash$NN;

/**
 * @param {b2Pair} pair
 * @param {!number} proxyId1
 * @param {!number} proxyId2
 * @return {!boolean}
 */
b2PairManager.Equals$Lb2Pair$NN = function (pair, proxyId1, proxyId2) {
	return pair.proxyId1 === proxyId1 && pair.proxyId2 === proxyId2;
};

var b2PairManager$Equals$Lb2Pair$NN = b2PairManager.Equals$Lb2Pair$NN;

/**
 * @param {b2Pair} pair1
 * @param {b2Pair} pair2
 * @return {!boolean}
 */
b2PairManager.EqualsPair$Lb2Pair$Lb2Pair$ = function (pair1, pair2) {
	return pair1.proxyId1 === pair2.proxyId1 && pair1.proxyId2 === pair2.proxyId2;
};

var b2PairManager$EqualsPair$Lb2Pair$Lb2Pair$ = b2PairManager.EqualsPair$Lb2Pair$Lb2Pair$;

/**
 * class b2Proxy extends Object
 * @constructor
 */
function b2Proxy() {
}

b2Proxy.prototype = new Object;
/**
 * @constructor
 */
function b2Proxy$() {
	this.userData = undefined;
	this.lowerBounds = [ 0, 0 ];
	this.upperBounds = [ 0, 0 ];
	this.overlapCount = 0;
	this.timeStamp = 0;
};

b2Proxy$.prototype = new b2Proxy;

/**
 * @return {!number}
 */
b2Proxy.prototype.GetNext$ = function () {
	return this.lowerBounds[0];
};

/**
 * @param {!number} next
 */
b2Proxy.prototype.SetNext$N = function (next) {
	this.lowerBounds[0] = next;
};

/**
 * @return {!boolean}
 */
b2Proxy.prototype.IsValid$ = function () {
	return this.overlapCount !== 0x0000ffff;
};

/**
 * class ClipVertex extends Object
 * @constructor
 */
function ClipVertex() {
}

ClipVertex.prototype = new Object;
/**
 * @constructor
 */
function ClipVertex$() {
	this.v = new b2Vec2$();
	this.id = new b2ContactID$();
};

ClipVertex$.prototype = new ClipVertex;

/**
 * class Features extends Object
 * @constructor
 */
function Features() {
}

Features.prototype = new Object;
/**
 * @constructor
 */
function Features$() {
	this._referenceFace = 0;
	this._incidentEdge = 0;
	this._incidentVertex = 0;
	this._flip = 0;
	this._m_id = undefined;
	this.referenceFace = 0;
	this.incidentEdge = 0;
	this.incidentVertex = 0;
	this.flip = 0;
};

Features$.prototype = new Features;

/**
 * @param {!number} value
 */
Features.prototype.set_referenceFace$N = function (value) {
	this._referenceFace = value;
	this._m_id._key = this._m_id._key & 0xffffff00 | this._referenceFace & 0x000000ff;
};

/**
 * @return {!number}
 */
Features.prototype.get_referenceFace$ = function () {
	return this._referenceFace;
};

/**
 * @param {!number} value
 */
Features.prototype.set_incidentEdge$N = function (value) {
	this._incidentEdge = value;
	this._m_id._key = this._m_id._key & 0xffff00ff | this._incidentEdge << 8 & 0x0000ff00;
};

/**
 * @return {!number}
 */
Features.prototype.get_incidentEdge$ = function () {
	return this._incidentEdge;
};

/**
 * @param {!number} value
 */
Features.prototype.set_incidentVertex$N = function (value) {
	this._incidentVertex = value;
	this._m_id._key = this._m_id._key & 0xff00ffff | this._incidentVertex << 16 & 0x00ff0000;
};

/**
 * @return {!number}
 */
Features.prototype.get_incidentVertex$ = function () {
	return this._incidentVertex;
};

/**
 * @param {!number} value
 */
Features.prototype.set_flip$N = function (value) {
	this._flip = value;
	this._m_id._key = this._m_id._key & 0x00ffffff | this._flip << 24 & 0xff000000;
};

/**
 * @return {!number}
 */
Features.prototype.get_flip$ = function () {
	return this._flip;
};

/**
 * class b2MassData extends Object
 * @constructor
 */
function b2MassData() {
}

b2MassData.prototype = new Object;
/**
 * @constructor
 */
function b2MassData$() {
	this.mass = 0.0;
	this.I = 0.0;
	this.center = new b2Vec2$NN(0, 0);
};

b2MassData$.prototype = new b2MassData;

/**
 * class b2Shape extends Object
 * @constructor
 */
function b2Shape() {
}

b2Shape.prototype = new Object;
/**
 * @constructor
 * @param {b2ShapeDef} def
 * @param {b2Body} body
 */
function b2Shape$Lb2ShapeDef$Lb2Body$(def, body) {
	this.m_next = undefined;
	this.m_type = 0;
	this.m_R = new b2Mat22$();
	this.m_position = new b2Vec2$();
	this.m_userData = def.userData;
	this.m_friction = def.friction;
	this.m_restitution = def.restitution;
	this.m_body = body;
	this.m_proxyId = b2Pair.b2_nullProxy;
	this.m_maxRadius = 0.0;
	this.m_categoryBits = def.categoryBits;
	this.m_maskBits = def.maskBits;
	this.m_groupIndex = def.groupIndex;
};

b2Shape$Lb2ShapeDef$Lb2Body$.prototype = new b2Shape;

/**
 * @return {*}
 */
b2Shape.prototype.GetUserData$ = function () {
	return this.m_userData;
};

/**
 * @return {!number}
 */
b2Shape.prototype.GetType$ = function () {
	return this.m_type;
};

/**
 * @return {b2Body}
 */
b2Shape.prototype.GetBody$ = function () {
	return this.m_body;
};

/**
 * @return {b2Vec2}
 */
b2Shape.prototype.GetPosition$ = function () {
	return this.m_position;
};

/**
 * @return {b2Mat22}
 */
b2Shape.prototype.GetRotationMatrix$ = function () {
	return this.m_R;
};

/**
 * @param {b2BroadPhase} broadPhase
 */
b2Shape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
};

/**
 * @return {b2Shape}
 */
b2Shape.prototype.GetNext$ = function () {
	return this.m_next;
};

/**
 */
b2Shape.prototype.DestroyProxy$ = function () {
	if (this.m_proxyId !== b2Pair.b2_nullProxy) {
		this.m_body.m_world.m_broadPhase.DestroyProxy$N(this.m_proxyId);
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
};

/**
 * @param {b2Vec2} position1
 * @param {b2Mat22} R1
 * @param {b2Vec2} position2
 * @param {b2Mat22} R2
 */
b2Shape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
};

/**
 * @param {b2Vec2} position
 * @param {b2Mat22} R
 */
b2Shape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
};

/**
 * @param {!number} dX
 * @param {!number} dY
 * @param {b2Vec2} out
 */
b2Shape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
};

/**
 * @return {!number}
 */
b2Shape.prototype.GetMaxRadius$ = function () {
	return this.m_maxRadius;
};

/**
 * @param {b2ShapeDef} def
 * @param {b2Body} body
 * @param {b2Vec2} center
 * @return {b2Shape}
 */
b2Shape.Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$ = function (def, body, center) {
	switch (def.type) {
	case 0:
		return new b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$(def, body, center);
	case 1:
	case 2:
		return new b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$(def, body, center);
	}
	return undefined;
};

var b2Shape$Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$ = b2Shape.Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$;

/**
 * @param {b2Shape} shape
 */
b2Shape.Destroy$Lb2Shape$ = function (shape) {
	if (shape.m_proxyId !== b2Pair.b2_nullProxy) {
		shape.m_body.m_world.m_broadPhase.DestroyProxy$N(shape.m_proxyId);
	}
};

var b2Shape$Destroy$Lb2Shape$ = b2Shape.Destroy$Lb2Shape$;

/**
 * @param {b2MassData} massData
 * @param {Array.<undefined|b2Vec2>} vs
 * @param {!number} count
 * @param {!number} rho
 */
b2Shape.PolyMass$Lb2MassData$ALb2Vec2$NN = function (massData, vs, count, rho) {
	/** @type {b2Vec2} */
	var center;
	/** @type {!number} */
	var area;
	/** @type {!number} */
	var I;
	/** @type {b2Vec2} */
	var pRef;
	/** @type {!number} */
	var inv3;
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var p1;
	/** @type {b2Vec2} */
	var p2;
	/** @type {b2Vec2} */
	var p3;
	/** @type {b2Vec2} */
	var e1;
	/** @type {b2Vec2} */
	var e2;
	/** @type {!number} */
	var D;
	/** @type {!number} */
	var triangleArea;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var px;
	/** @type {!number} */
	var py;
	/** @type {!number} */
	var ex1;
	/** @type {!number} */
	var ey1;
	/** @type {!number} */
	var ex2;
	/** @type {!number} */
	var ey2;
	/** @type {!number} */
	var intx2;
	/** @type {!number} */
	var inty2;
	/** @type {!number} */
	var a$0;
	/** @type {!number} */
	var a$1;
	center = new b2Vec2$();
	center.x = 0;
	center.y = 0;
	area = 0.0;
	I = 0.0;
	pRef = new b2Vec2$NN(0.0, 0.0);
	inv3 = 0.3333333333333333;
	for (i = 0; i < count; ++ i) {
		p1 = pRef;
		p2 = vs[i];
		p3 = (i + 1 < count ? vs[i + 1] : vs[0]);
		e1 = new b2Vec2$NN(p2.x - p1.x, p2.y - p1.y);
		e2 = new b2Vec2$NN(p3.x - p1.x, p3.y - p1.y);
		D = e1.x * e2.y - e1.y * e2.x;
		triangleArea = 0.5 * D;
		area += triangleArea;
		tVec = new b2Vec2$();
		tVec.x = p1.x;
		tVec.y = p1.y;
		tVec.x += p2.x;
		tVec.y += p2.y;
		tVec.x += p3.x;
		tVec.y += p3.y;
		a$0 = inv3 * triangleArea;
		tVec.x *= a$0;
		tVec.y *= a$0;
		center.x += tVec.x;
		center.y += tVec.y;
		px = p1.x;
		py = p1.y;
		ex1 = e1.x;
		ey1 = e1.y;
		ex2 = e2.x;
		ey2 = e2.y;
		intx2 = inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
		inty2 = inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
		I += D * (intx2 + inty2);
	}
	massData.mass = rho * area;
	a$1 = 1.0 / area;
	center.x *= a$1;
	center.y *= a$1;
	massData.center = center;
	I = rho * (I - area * (center.x * center.x + center.y * center.y));
	massData.I = I;
};

var b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN = b2Shape.PolyMass$Lb2MassData$ALb2Vec2$NN;

/**
 * @param {Array.<undefined|b2Vec2>} vs
 * @param {!number} count
 * @param {b2Vec2} out
 */
b2Shape.PolyCentroid$ALb2Vec2$NLb2Vec2$ = function (vs, count, out) {
	/** @type {!number} */
	var cX;
	/** @type {!number} */
	var cY;
	/** @type {!number} */
	var area;
	/** @type {!number} */
	var pRefX;
	/** @type {!number} */
	var pRefY;
	/** @type {!number} */
	var inv3;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var p1X;
	/** @type {!number} */
	var p1Y;
	/** @type {!number} */
	var p2X;
	/** @type {!number} */
	var p2Y;
	/** @type {!number} */
	var p3X;
	/** @type {!number} */
	var p3Y;
	/** @type {!number} */
	var e1X;
	/** @type {!number} */
	var e1Y;
	/** @type {!number} */
	var e2X;
	/** @type {!number} */
	var e2Y;
	/** @type {!number} */
	var D;
	/** @type {!number} */
	var triangleArea;
	cX = 0.0;
	cY = 0.0;
	area = 0.0;
	pRefX = 0.0;
	pRefY = 0.0;
	inv3 = 0.3333333333333333;
	for (i = 0; i < count; ++ i) {
		p1X = pRefX;
		p1Y = pRefY;
		p2X = vs[i].x;
		p2Y = vs[i].y;
		p3X = (i + 1 < count ? vs[i + 1].x : vs[0].x);
		p3Y = (i + 1 < count ? vs[i + 1].y : vs[0].y);
		e1X = p2X - p1X;
		e1Y = p2Y - p1Y;
		e2X = p3X - p1X;
		e2Y = p3Y - p1Y;
		D = e1X * e2Y - e1Y * e2X;
		triangleArea = 0.5 * D;
		area += triangleArea;
		cX += triangleArea * inv3 * (p1X + p2X + p3X);
		cY += triangleArea * inv3 * (p1Y + p2Y + p3Y);
	}
	cX *= 1.0 / area;
	cY *= 1.0 / area;
	out.x = cX;
	out.y = cY;
};

var b2Shape$PolyCentroid$ALb2Vec2$NLb2Vec2$ = b2Shape.PolyCentroid$ALb2Vec2$NLb2Vec2$;

/**
 * class b2PolyShape extends b2Shape
 * @constructor
 */
function b2PolyShape() {
}

b2PolyShape.prototype = new b2Shape;
/**
 * @constructor
 * @param {b2ShapeDef} def
 * @param {b2Body} body
 * @param {b2Vec2} newOrigin
 */
function b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$(def, body, newOrigin) {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var hX;
	/** @type {!number} */
	var hY;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {b2AABB} */
	var aabb;
	/** @type {b2Mat22} */
	var localR;
	/** @type {b2BoxDef} */
	var box;
	/** @type {!number} */
	var hcX;
	/** @type {!number} */
	var hcY;
	/** @type {b2PolyDef} */
	var poly;
	/** @type {!number} */
	var centroidX;
	/** @type {!number} */
	var centroidY;
	/** @type {!number} */
	var uX;
	/** @type {!number} */
	var uY;
	/** @type {!number} */
	var length;
	/** @type {!number} */
	var minVertexX;
	/** @type {!number} */
	var minVertexY;
	/** @type {!number} */
	var maxVertexX;
	/** @type {!number} */
	var maxVertexY;
	/** @type {b2Vec2} */
	var v;
	/** @type {!number} */
	var i1;
	/** @type {!number} */
	var i2;
	/** @type {!number} */
	var positionX;
	/** @type {!number} */
	var positionY;
	/** @type {b2BroadPhase} */
	var broadPhase;
	/** @type {!number} */
	var value2$0;
	/** @type {!number} */
	var value2$1;
	/** @type {!number} */
	var value2$2;
	/** @type {!number} */
	var value2$3;
	/** @type {!number} */
	var value2$4;
	/** @type {!number} */
	var value2$5;
	/** @type {!number} */
	var value1$0;
	/** @type {!number} */
	var value2$6;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	/** @type {b2Mat22} */
	var this$3;
	/** @type {b2Mat22} */
	var m$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	/** @type {b2Mat22} */
	var this$4;
	/** @type {b2Vec2} */
	var this$0$1;
	/** @type {!number} */
	var x$0$0$0;
	/** @type {!number} */
	var x$1$0$0;
	/** @type {b2Vec2} */
	var this$1$1;
	/** @type {!number} */
	var x$0$1$0;
	/** @type {!number} */
	var x$1$1$0;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	this.m_next = undefined;
	this.m_type = 0;
	this.m_R = new b2Mat22$();
	this.m_position = new b2Vec2$();
	this.m_userData = def.userData;
	this.m_friction = def.friction;
	this.m_restitution = def.restitution;
	this.m_body = body;
	this.m_proxyId = b2Pair.b2_nullProxy;
	this.m_maxRadius = 0.0;
	this.m_categoryBits = def.categoryBits;
	this.m_maskBits = def.maskBits;
	this.m_groupIndex = def.groupIndex;
	this.m_coreVertices = undefined;
	this.m_vertexCount = 0;
	this.m_normals = undefined;
	this.syncAABB = new b2AABB$();
	this.syncMat = new b2Mat22$();
	this.m_localCentroid = new b2Vec2$();
	this.m_localOBB = new b2OBB$();
	i = 0;
	aabb = new b2AABB$();
	this.m_vertices = [  ];
	this.m_vertices.length = 16;
	this.m_coreVertices = [  ];
	this.m_coreVertices.length = 16;
	this.m_normals = [  ];
	this.m_normals.length = 16;
	this.m_type = 2;
	localR = new b2Mat22$N(def.localRotation);
	if (def.type === 1) {
		this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
		this.m_localCentroid.y = def.localPosition.y - newOrigin.y;
		box = def;
		this.m_vertexCount = 4;
		hX = box.extents.x;
		hY = box.extents.y;
		value2$0 = hX - 0.3;
		hcX = (0.0 >= value2$0 ? 0.0 : value2$0);
		value2$1 = hY - 0.3;
		hcY = (0.0 >= value2$1 ? 0.0 : value2$1);
		tVec = this.m_vertices[0] = new b2Vec2$();
		tVec.x = localR.col1.x * hX + localR.col2.x * hY;
		tVec.y = localR.col1.y * hX + localR.col2.y * hY;
		tVec = this.m_vertices[1] = new b2Vec2$();
		tVec.x = localR.col1.x * - hX + localR.col2.x * hY;
		tVec.y = localR.col1.y * - hX + localR.col2.y * hY;
		tVec = this.m_vertices[2] = new b2Vec2$();
		tVec.x = localR.col1.x * - hX + localR.col2.x * - hY;
		tVec.y = localR.col1.y * - hX + localR.col2.y * - hY;
		tVec = this.m_vertices[3] = new b2Vec2$();
		tVec.x = localR.col1.x * hX + localR.col2.x * - hY;
		tVec.y = localR.col1.y * hX + localR.col2.y * - hY;
		tVec = this.m_coreVertices[0] = new b2Vec2$();
		tVec.x = localR.col1.x * hcX + localR.col2.x * hcY;
		tVec.y = localR.col1.y * hcX + localR.col2.y * hcY;
		tVec = this.m_coreVertices[1] = new b2Vec2$();
		tVec.x = localR.col1.x * - hcX + localR.col2.x * hcY;
		tVec.y = localR.col1.y * - hcX + localR.col2.y * hcY;
		tVec = this.m_coreVertices[2] = new b2Vec2$();
		tVec.x = localR.col1.x * - hcX + localR.col2.x * - hcY;
		tVec.y = localR.col1.y * - hcX + localR.col2.y * - hcY;
		tVec = this.m_coreVertices[3] = new b2Vec2$();
		tVec.x = localR.col1.x * hcX + localR.col2.x * - hcY;
		tVec.y = localR.col1.y * hcX + localR.col2.y * - hcY;
	} else {
		poly = def;
		this.m_vertexCount = poly.vertexCount;
		b2Shape$PolyCentroid$ALb2Vec2$NLb2Vec2$(poly.vertices, poly.vertexCount, b2PolyShape.tempVec);
		centroidX = b2PolyShape.tempVec.x;
		centroidY = b2PolyShape.tempVec.y;
		this.m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x;
		this.m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y;
		for (i = 0; i < this.m_vertexCount; ++ i) {
			this.m_vertices[i] = new b2Vec2$();
			this.m_coreVertices[i] = new b2Vec2$();
			hX = poly.vertices[i].x - centroidX;
			hY = poly.vertices[i].y - centroidY;
			this.m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY;
			this.m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY;
			uX = this.m_vertices[i].x;
			uY = this.m_vertices[i].y;
			length = Math.sqrt(uX * uX + uY * uY);
			if (length > Number.MIN_VALUE) {
				uX *= 1.0 / length;
				uY *= 1.0 / length;
			}
			this.m_coreVertices[i].x = this.m_vertices[i].x - 0.3 * uX;
			this.m_coreVertices[i].y = this.m_vertices[i].y - 0.3 * uY;
		}
	}
	minVertexX = Number.MAX_VALUE;
	minVertexY = Number.MAX_VALUE;
	maxVertexX = - Number.MAX_VALUE;
	maxVertexY = - Number.MAX_VALUE;
	this.m_maxRadius = 0.0;
	for (i = 0; i < this.m_vertexCount; ++ i) {
		v = this.m_vertices[i];
		value2$2 = v.x;
		minVertexX = (minVertexX <= value2$2 ? minVertexX : value2$2);
		value2$3 = v.y;
		minVertexY = (minVertexY <= value2$3 ? minVertexY : value2$3);
		value2$4 = v.x;
		maxVertexX = (maxVertexX >= value2$4 ? maxVertexX : value2$4);
		value2$5 = v.y;
		maxVertexY = (maxVertexY >= value2$5 ? maxVertexY : value2$5);
		value1$0 = this.m_maxRadius;
		value2$6 = Math.sqrt(v.x * v.x + v.y * v.y);
		this.m_maxRadius = (value1$0 >= value2$6 ? value1$0 : value2$6);
	}
	this$0 = this.m_localOBB.R;
	this$0.col1.x = 1.0;
	this$0.col2.x = 0.0;
	this$0.col1.y = 0.0;
	this$0.col2.y = 1.0;
	this$1 = this.m_localOBB.center;
	x$0 = (minVertexX + maxVertexX) * 0.5;
	y$0 = (minVertexY + maxVertexY) * 0.5;
	this$1.x = x$0;
	this$1.y = y$0;
	this$2 = this.m_localOBB.extents;
	x$1 = (maxVertexX - minVertexX) * 0.5;
	y$1 = (maxVertexY - minVertexY) * 0.5;
	this$2.x = x$1;
	this$2.y = y$1;
	i1 = 0;
	i2 = 0;
	for (i = 0; i < this.m_vertexCount; ++ i) {
		this.m_normals[i] = new b2Vec2$();
		i1 = i;
		i2 = (i + 1 < this.m_vertexCount ? i + 1 : 0);
		this.m_normals[i].x = this.m_vertices[i2].y - this.m_vertices[i1].y;
		this.m_normals[i].y = - (this.m_vertices[i2].x - this.m_vertices[i1].x);
		this.m_normals[i].Normalize$();
	}
	for (i = 0; i < this.m_vertexCount; ++ i) {
		i1 = i;
		i2 = (i + 1 < this.m_vertexCount ? i + 1 : 0);
	}
	this$3 = this.m_R;
	m$0 = this.m_body.m_R;
	this$0$0 = this$3.col1;
	v$0$0 = m$0.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$3.col2;
	v$1$0 = m$0.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
	this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
	b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
	b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
	b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
	b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y;
	this$4 = b2PolyShape.tAbsR;
	this$0$1 = this$4.col1;
	x$0$0$0 = this$0$1.x;
	this$0$1.x = (x$0$0$0 >= 0 ? x$0$0$0 : - x$0$0$0);
	x$1$0$0 = this$0$1.y;
	this$0$1.y = (x$1$0$0 >= 0 ? x$1$0$0 : - x$1$0$0);
	this$1$1 = this$4.col2;
	x$0$1$0 = this$1$1.x;
	this$1$1.x = (x$0$1$0 >= 0 ? x$0$1$0 : - x$0$1$0);
	x$1$1$0 = this$1$1.y;
	this$1$1.y = (x$1$1$0 >= 0 ? x$1$1$0 : - x$1$1$0);
	hX = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
	hY = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
	positionX = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
	positionY = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
	aabb.minVertex.x = positionX - hX;
	aabb.minVertex.y = positionY - hY;
	aabb.maxVertex.x = positionX + hX;
	aabb.maxVertex.y = positionY + hY;
	broadPhase = this.m_body.m_world.m_broadPhase;
	dX$0 = aabb.minVertex.x;
	dY$0 = aabb.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb.maxVertex.x;
	d2Y$0 -= aabb.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		this.m_proxyId = broadPhase.CreateProxy$Lb2AABB$X(aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		this.m_body.Freeze$();
	}
};

b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$.prototype = new b2PolyShape;

/**
 * @param {b2Vec2} p
 * @return {!boolean}
 */
b2PolyShape.prototype.TestPoint$Lb2Vec2$ = function (p) {
	/** @type {b2Vec2} */
	var pLocal;
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var dot;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {!number} */
	var tX$0;
	/** @type {b2Vec2} */
	var b$0$0;
	/** @type {b2Vec2} */
	var b$1$0;
	/** @type {b2Vec2} */
	var v$1;
	/** @type {b2Vec2} */
	var a$0;
	pLocal = new b2Vec2$();
	pLocal.x = p.x;
	pLocal.y = p.y;
	v$0 = this.m_position;
	pLocal.x -= v$0.x;
	pLocal.y -= v$0.y;
	A$0 = this.m_R;
	b$0$0 = A$0.col1;
	tX$0 = pLocal.x * b$0$0.x + pLocal.y * b$0$0.y;
	b$1$0 = A$0.col2;
	pLocal.y = pLocal.x * b$1$0.x + pLocal.y * b$1$0.y;
	pLocal.x = tX$0;
	for (i = 0; i < this.m_vertexCount; ++ i) {
		tVec = new b2Vec2$();
		tVec.x = pLocal.x;
		tVec.y = pLocal.y;
		v$1 = this.m_vertices[i];
		tVec.x -= v$1.x;
		tVec.y -= v$1.y;
		a$0 = this.m_normals[i];
		dot = a$0.x * tVec.x + a$0.y * tVec.y;
		if (dot > 0.0) {
			return false;
		}
	}
	return true;
};

/**
 * @param {b2Vec2} position1
 * @param {b2Mat22} R1
 * @param {b2Vec2} position2
 * @param {b2Mat22} R2
 */
b2PolyShape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
	/** @type {!number} */
	var hX;
	/** @type {!number} */
	var hY;
	/** @type {b2Vec2} */
	var v1;
	/** @type {b2Vec2} */
	var v2;
	/** @type {b2Vec2} */
	var v3;
	/** @type {b2Vec2} */
	var v4;
	/** @type {!number} */
	var centerX;
	/** @type {!number} */
	var centerY;
	/** @type {b2BroadPhase} */
	var broadPhase;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	/** @type {b2Mat22} */
	var this$1;
	/** @type {b2Vec2} */
	var this$0$1;
	/** @type {!number} */
	var x$0$0$0;
	/** @type {!number} */
	var x$1$0$0;
	/** @type {b2Vec2} */
	var this$1$1;
	/** @type {!number} */
	var x$0$1$0;
	/** @type {!number} */
	var x$1$1$0;
	/** @type {b2Mat22} */
	var this$2;
	/** @type {b2Vec2} */
	var this$0$2;
	/** @type {!number} */
	var x$0$0$1;
	/** @type {!number} */
	var x$1$0$1;
	/** @type {b2Vec2} */
	var this$1$2;
	/** @type {!number} */
	var x$0$1$1;
	/** @type {!number} */
	var x$1$1$1;
	/** @type {b2AABB} */
	var aabb$0;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	this$0 = this.m_R;
	this$0$0 = this$0.col1;
	v$0$0 = R2.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$0.col2;
	v$1$0 = R2.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
	this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	v1 = R1.col1;
	v2 = R1.col2;
	v3 = this.m_localOBB.R.col1;
	v4 = this.m_localOBB.R.col2;
	this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
	this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
	this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
	this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
	this$1 = this.syncMat;
	this$0$1 = this$1.col1;
	x$0$0$0 = this$0$1.x;
	this$0$1.x = (x$0$0$0 >= 0 ? x$0$0$0 : - x$0$0$0);
	x$1$0$0 = this$0$1.y;
	this$0$1.y = (x$1$0$0 >= 0 ? x$1$0$0 : - x$1$0$0);
	this$1$1 = this$1.col2;
	x$0$1$0 = this$1$1.x;
	this$1$1.x = (x$0$1$0 >= 0 ? x$0$1$0 : - x$0$1$0);
	x$1$1$0 = this$1$1.y;
	this$1$1.y = (x$1$1$0 >= 0 ? x$1$1$0 : - x$1$1$0);
	hX = this.m_localCentroid.x + this.m_localOBB.center.x;
	hY = this.m_localCentroid.y + this.m_localOBB.center.y;
	centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
	centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
	hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
	hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
	this.syncAABB.minVertex.x = centerX - hX;
	this.syncAABB.minVertex.y = centerY - hY;
	this.syncAABB.maxVertex.x = centerX + hX;
	this.syncAABB.maxVertex.y = centerY + hY;
	v1 = R2.col1;
	v2 = R2.col2;
	v3 = this.m_localOBB.R.col1;
	v4 = this.m_localOBB.R.col2;
	this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
	this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
	this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
	this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
	this$2 = this.syncMat;
	this$0$2 = this$2.col1;
	x$0$0$1 = this$0$2.x;
	this$0$2.x = (x$0$0$1 >= 0 ? x$0$0$1 : - x$0$0$1);
	x$1$0$1 = this$0$2.y;
	this$0$2.y = (x$1$0$1 >= 0 ? x$1$0$1 : - x$1$0$1);
	this$1$2 = this$2.col2;
	x$0$1$1 = this$1$2.x;
	this$1$2.x = (x$0$1$1 >= 0 ? x$0$1$1 : - x$0$1$1);
	x$1$1$1 = this$1$2.y;
	this$1$2.y = (x$1$1$1 >= 0 ? x$1$1$1 : - x$1$1$1);
	hX = this.m_localCentroid.x + this.m_localOBB.center.x;
	hY = this.m_localCentroid.y + this.m_localOBB.center.y;
	centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
	centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
	hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
	hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
	this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
	this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
	this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
	this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);
	broadPhase = this.m_body.m_world.m_broadPhase;
	aabb$0 = this.syncAABB;
	dX$0 = aabb$0.minVertex.x;
	dY$0 = aabb$0.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb$0.maxVertex.x;
	d2Y$0 -= aabb$0.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		broadPhase.MoveProxy$NLb2AABB$(this.m_proxyId, this.syncAABB);
	} else {
		this.m_body.Freeze$();
	}
};

/**
 * @param {b2Vec2} position
 * @param {b2Mat22} R
 */
b2PolyShape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
	/** @type {b2Mat22} */
	var this$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	this$0 = this.m_R;
	this$0$0 = this$0.col1;
	v$0$0 = R.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$0.col2;
	v$1$0 = R.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
	this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
};

/**
 * @param {b2BroadPhase} broadPhase
 */
b2PolyShape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
	/** @type {b2Proxy} */
	var proxy;
	/** @type {b2Mat22} */
	var R;
	/** @type {b2Mat22} */
	var absR;
	/** @type {b2Vec2} */
	var h;
	/** @type {b2Vec2} */
	var position;
	/** @type {b2AABB} */
	var aabb;
	/** @type {!number} */
	var proxyId$0;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Mat22} */
	var B$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Mat22} */
	var A$1;
	/** @type {b2Vec2} */
	var v$1;
	/** @type {b2Vec2} */
	var v$2;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {b2Vec2} */
	var this$3;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	proxyId$0 = this.m_proxyId;
	proxy = (proxyId$0 === b2Pair.b2_nullProxy || broadPhase.m_proxyPool[proxyId$0].IsValid$() === false ? undefined : broadPhase.m_proxyPool[proxyId$0]);
	broadPhase.DestroyProxy$N(this.m_proxyId);
	proxy = undefined;
	A$0 = this.m_R;
	B$0 = this.m_localOBB.R;
	R = new b2Mat22$NLb2Vec2$Lb2Vec2$(0, b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$(A$0, B$0.col1), b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$(A$0, B$0.col2));
	absR = new b2Mat22$NLb2Vec2$Lb2Vec2$(0, b2Math$b2AbsV$Lb2Vec2$(R.col1), b2Math$b2AbsV$Lb2Vec2$(R.col2));
	v$0 = this.m_localOBB.extents;
	h = new b2Vec2$NN(absR.col1.x * v$0.x + absR.col2.x * v$0.y, absR.col1.y * v$0.x + absR.col2.y * v$0.y);
	A$1 = this.m_R;
	v$1 = this.m_localOBB.center;
	position = new b2Vec2$NN(A$1.col1.x * v$1.x + A$1.col2.x * v$1.y, A$1.col1.y * v$1.x + A$1.col2.y * v$1.y);
	v$2 = this.m_position;
	position.x += v$2.x;
	position.y += v$2.y;
	aabb = new b2AABB$();
	this$0 = aabb.minVertex;
	this$0.x = position.x;
	this$0.y = position.y;
	this$1 = aabb.minVertex;
	this$1.x -= h.x;
	this$1.y -= h.y;
	this$2 = aabb.maxVertex;
	this$2.x = position.x;
	this$2.y = position.y;
	this$3 = aabb.maxVertex;
	this$3.x += h.x;
	this$3.y += h.y;
	dX$0 = aabb.minVertex.x;
	dY$0 = aabb.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb.maxVertex.x;
	d2Y$0 -= aabb.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		this.m_proxyId = broadPhase.CreateProxy$Lb2AABB$X(aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		this.m_body.Freeze$();
	}
};

/**
 * @param {!number} dX
 * @param {!number} dY
 * @param {b2Vec2} out
 */
b2PolyShape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
	/** @type {!number} */
	var dLocalX;
	/** @type {!number} */
	var dLocalY;
	/** @type {!number} */
	var bestIndex;
	/** @type {!number} */
	var bestValue;
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var value;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	dLocalX = dX * this.m_R.col1.x + dY * this.m_R.col1.y;
	dLocalY = dX * this.m_R.col2.x + dY * this.m_R.col2.y;
	bestIndex = 0;
	bestValue = this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY;
	for (i = 1; i < this.m_vertexCount; ++ i) {
		value = this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	x$0 = this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y);
	y$0 = this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y);
	out.x = x$0;
	out.y = y$0;
};

/**
 * class b2CircleShape extends b2Shape
 * @constructor
 */
function b2CircleShape() {
}

b2CircleShape.prototype = new b2Shape;
/**
 * @constructor
 * @param {b2CircleDef} def
 * @param {b2Body} body
 * @param {b2Vec2} localCenter
 */
function b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$(def, body, localCenter) {
	/** @type {b2CircleDef} */
	var circle;
	/** @type {!number} */
	var rX;
	/** @type {!number} */
	var rY;
	/** @type {b2AABB} */
	var aabb;
	/** @type {b2BroadPhase} */
	var broadPhase;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Mat22} */
	var this$1;
	/** @type {b2Mat22} */
	var m$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	/** @type {b2Vec2} */
	var this$3;
	/** @type {!number} */
	var x$2;
	/** @type {!number} */
	var y$2;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	this.m_next = undefined;
	this.m_type = 0;
	this.m_R = new b2Mat22$();
	this.m_position = new b2Vec2$();
	this.m_userData = def.userData;
	this.m_friction = def.friction;
	this.m_restitution = def.restitution;
	this.m_body = body;
	this.m_proxyId = b2Pair.b2_nullProxy;
	this.m_maxRadius = 0.0;
	this.m_categoryBits = def.categoryBits;
	this.m_maskBits = def.maskBits;
	this.m_groupIndex = def.groupIndex;
	this.m_radius = 0;
	this.m_localPosition = new b2Vec2$();
	circle = def;
	this$0 = this.m_localPosition;
	x$0 = def.localPosition.x - localCenter.x;
	y$0 = def.localPosition.y - localCenter.y;
	this$0.x = x$0;
	this$0.y = y$0;
	this.m_type = 0;
	this.m_radius = circle.radius;
	this$1 = this.m_R;
	m$0 = this.m_body.m_R;
	this$0$0 = this$1.col1;
	v$0$0 = m$0.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$1.col2;
	v$1$0 = m$0.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	rX = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
	rY = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
	this.m_position.x = this.m_body.m_position.x + rX;
	this.m_position.y = this.m_body.m_position.y + rY;
	this.m_maxRadius = Math.sqrt(rX * rX + rY * rY) + this.m_radius;
	aabb = new b2AABB$();
	this$2 = aabb.minVertex;
	x$1 = this.m_position.x - this.m_radius;
	y$1 = this.m_position.y - this.m_radius;
	this$2.x = x$1;
	this$2.y = y$1;
	this$3 = aabb.maxVertex;
	x$2 = this.m_position.x + this.m_radius;
	y$2 = this.m_position.y + this.m_radius;
	this$3.x = x$2;
	this$3.y = y$2;
	broadPhase = this.m_body.m_world.m_broadPhase;
	dX$0 = aabb.minVertex.x;
	dY$0 = aabb.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb.maxVertex.x;
	d2Y$0 -= aabb.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		this.m_proxyId = broadPhase.CreateProxy$Lb2AABB$X(aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		this.m_body.Freeze$();
	}
};

b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$.prototype = new b2CircleShape;

/**
 * @param {b2Vec2} p
 * @return {!boolean}
 */
b2CircleShape.prototype.TestPoint$Lb2Vec2$ = function (p) {
	/** @type {b2Vec2} */
	var d;
	/** @type {b2Vec2} */
	var v$0;
	d = new b2Vec2$();
	d.x = p.x;
	d.y = p.y;
	v$0 = this.m_position;
	d.x -= v$0.x;
	d.y -= v$0.y;
	return d.x * d.x + d.y * d.y <= this.m_radius * this.m_radius;
};

/**
 * @param {b2Vec2} position1
 * @param {b2Mat22} R1
 * @param {b2Vec2} position2
 * @param {b2Mat22} R2
 */
b2CircleShape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
	/** @type {!number} */
	var p1X;
	/** @type {!number} */
	var p1Y;
	/** @type {!number} */
	var lowerX;
	/** @type {!number} */
	var lowerY;
	/** @type {!number} */
	var upperX;
	/** @type {!number} */
	var upperY;
	/** @type {b2AABB} */
	var aabb;
	/** @type {b2BroadPhase} */
	var broadPhase;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	/** @type {!number} */
	var value2$0;
	/** @type {!number} */
	var value2$1;
	/** @type {!number} */
	var value2$2;
	/** @type {!number} */
	var value2$3;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	this$0 = this.m_R;
	this$0$0 = this$0.col1;
	v$0$0 = R2.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$0.col2;
	v$1$0 = R2.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	this.m_position.x = R2.col1.x * this.m_localPosition.x + R2.col2.x * this.m_localPosition.y + position2.x;
	this.m_position.y = R2.col1.y * this.m_localPosition.x + R2.col2.y * this.m_localPosition.y + position2.y;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	p1X = position1.x + (R1.col1.x * this.m_localPosition.x + R1.col2.x * this.m_localPosition.y);
	p1Y = position1.y + (R1.col1.y * this.m_localPosition.x + R1.col2.y * this.m_localPosition.y);
	value2$0 = this.m_position.x;
	lowerX = (p1X <= value2$0 ? p1X : value2$0);
	value2$1 = this.m_position.y;
	lowerY = (p1Y <= value2$1 ? p1Y : value2$1);
	value2$2 = this.m_position.x;
	upperX = (p1X >= value2$2 ? p1X : value2$2);
	value2$3 = this.m_position.y;
	upperY = (p1Y >= value2$3 ? p1Y : value2$3);
	aabb = new b2AABB$();
	this$1 = aabb.minVertex;
	x$0 = lowerX - this.m_radius;
	y$0 = lowerY - this.m_radius;
	this$1.x = x$0;
	this$1.y = y$0;
	this$2 = aabb.maxVertex;
	x$1 = upperX + this.m_radius;
	y$1 = upperY + this.m_radius;
	this$2.x = x$1;
	this$2.y = y$1;
	broadPhase = this.m_body.m_world.m_broadPhase;
	dX$0 = aabb.minVertex.x;
	dY$0 = aabb.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb.maxVertex.x;
	d2Y$0 -= aabb.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		broadPhase.MoveProxy$NLb2AABB$(this.m_proxyId, aabb);
	} else {
		this.m_body.Freeze$();
	}
};

/**
 * @param {b2Vec2} position
 * @param {b2Mat22} R
 */
b2CircleShape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
	/** @type {b2Mat22} */
	var this$0;
	/** @type {b2Vec2} */
	var this$0$0;
	/** @type {b2Vec2} */
	var v$0$0;
	/** @type {b2Vec2} */
	var this$1$0;
	/** @type {b2Vec2} */
	var v$1$0;
	this$0 = this.m_R;
	this$0$0 = this$0.col1;
	v$0$0 = R.col1;
	this$0$0.x = v$0$0.x;
	this$0$0.y = v$0$0.y;
	this$1$0 = this$0.col2;
	v$1$0 = R.col2;
	this$1$0.x = v$1$0.x;
	this$1$0.y = v$1$0.y;
	this.m_position.x = R.col1.x * this.m_localPosition.x + R.col2.x * this.m_localPosition.y + position.x;
	this.m_position.y = R.col1.y * this.m_localPosition.x + R.col2.y * this.m_localPosition.y + position.y;
};

/**
 * @param {b2BroadPhase} broadPhase
 */
b2CircleShape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
	/** @type {b2Proxy} */
	var proxy;
	/** @type {b2AABB} */
	var aabb;
	/** @type {!number} */
	var proxyId$0;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var x$1;
	/** @type {!number} */
	var y$1;
	/** @type {!number} */
	var dX$0;
	/** @type {!number} */
	var dY$0;
	/** @type {!number} */
	var d2X$0;
	/** @type {!number} */
	var d2Y$0;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	proxyId$0 = this.m_proxyId;
	proxy = (proxyId$0 === b2Pair.b2_nullProxy || broadPhase.m_proxyPool[proxyId$0].IsValid$() === false ? undefined : broadPhase.m_proxyPool[proxyId$0]);
	broadPhase.DestroyProxy$N(this.m_proxyId);
	proxy = undefined;
	aabb = new b2AABB$();
	this$0 = aabb.minVertex;
	x$0 = this.m_position.x - this.m_radius;
	y$0 = this.m_position.y - this.m_radius;
	this$0.x = x$0;
	this$0.y = y$0;
	this$1 = aabb.maxVertex;
	x$1 = this.m_position.x + this.m_radius;
	y$1 = this.m_position.y + this.m_radius;
	this$1.x = x$1;
	this$1.y = y$1;
	dX$0 = aabb.minVertex.x;
	dY$0 = aabb.minVertex.y;
	dX$0 -= broadPhase.m_worldAABB.maxVertex.x;
	dY$0 -= broadPhase.m_worldAABB.maxVertex.y;
	d2X$0 = broadPhase.m_worldAABB.minVertex.x;
	d2Y$0 = broadPhase.m_worldAABB.minVertex.y;
	d2X$0 -= aabb.maxVertex.x;
	d2Y$0 -= aabb.maxVertex.y;
	dX$0 = (dX$0 > d2X$0 ? dX$0 : d2X$0);
	dY$0 = (dY$0 > d2Y$0 ? dY$0 : d2Y$0);
	if ((dX$0 > dY$0 ? dX$0 : dY$0) < 0.0) {
		this.m_proxyId = broadPhase.CreateProxy$Lb2AABB$X(aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		this.m_body.Freeze$();
	}
};

/**
 * @param {!number} dX
 * @param {!number} dY
 * @param {b2Vec2} out
 */
b2CircleShape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
	/** @type {!number} */
	var len;
	/** @type {!number} */
	var x$0;
	/** @type {!number} */
	var y$0;
	len = Math.sqrt(dX * dX + dY * dY);
	dX /= len;
	dY /= len;
	x$0 = this.m_position.x + this.m_radius * dX;
	y$0 = this.m_position.y + this.m_radius * dY;
	out.x = x$0;
	out.y = y$0;
};

/**
 * class b2ShapeDef extends Object
 * @constructor
 */
function b2ShapeDef() {
}

b2ShapeDef.prototype = new Object;
/**
 * @constructor
 */
function b2ShapeDef$() {
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
};

b2ShapeDef$.prototype = new b2ShapeDef;

/**
 * @param {b2MassData} massData
 */
b2ShapeDef.prototype.ComputeMass$Lb2MassData$ = function (massData) {
	/** @type {b2CircleDef} */
	var circle;
	/** @type {b2BoxDef} */
	var box;
	/** @type {b2PolyDef} */
	var poly;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {b2Vec2} */
	var this$3;
	massData.center = new b2Vec2$NN(0.0, 0.0);
	if (this.density === 0.0) {
		massData.mass = 0.0;
		this$0 = massData.center;
		this$0.x = 0.0;
		this$0.y = 0.0;
		massData.I = 0.0;
	}
	switch (this.type) {
	case 0:
		circle = this;
		massData.mass = this.density * 3.141592653589793 * circle.radius * circle.radius;
		this$1 = massData.center;
		this$1.x = 0.0;
		this$1.y = 0.0;
		massData.I = 0.5 * massData.mass * circle.radius * circle.radius;
		break;
	case 1:
		box = this;
		massData.mass = 4.0 * this.density * box.extents.x * box.extents.y;
		this$2 = massData.center;
		this$2.x = 0.0;
		this$2.y = 0.0;
		massData.I = massData.mass / 3.0 * b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(box.extents, box.extents);
		break;
	case 2:
		poly = this;
		b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN(massData, poly.vertices, poly.vertexCount, this.density);
		break;
	default:
		massData.mass = 0.0;
		this$3 = massData.center;
		this$3.x = 0.0;
		this$3.y = 0.0;
		massData.I = 0.0;
		break;
	}
};

/**
 * class b2PolyDef extends b2ShapeDef
 * @constructor
 */
function b2PolyDef() {
}

b2PolyDef.prototype = new b2ShapeDef;
/**
 * @constructor
 */
function b2PolyDef$() {
	/** @type {!number} */
	var i;
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.vertexCount = 0;
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.vertices = [  ];
	this.vertices.length = 16;
	this.type = 2;
	this.vertexCount = 0;
	for (i = 0; i < 16; i++) {
		this.vertices[i] = new b2Vec2$();
	}
};

b2PolyDef$.prototype = new b2PolyDef;

/**
 * class b2CircleDef extends b2ShapeDef
 * @constructor
 */
function b2CircleDef() {
}

b2CircleDef.prototype = new b2ShapeDef;
/**
 * @constructor
 */
function b2CircleDef$() {
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.type = 0;
	this.radius = 1.0;
};

b2CircleDef$.prototype = new b2CircleDef;

/**
 * class b2BoxDef extends b2ShapeDef
 * @constructor
 */
function b2BoxDef() {
}

b2BoxDef.prototype = new b2ShapeDef;
/**
 * @constructor
 */
function b2BoxDef$() {
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.type = -1;
	this.userData = undefined;
	this.localPosition = new b2Vec2$NN(0.0, 0.0);
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.type = 1;
	this.extents = new b2Vec2$NN(1.0, 1.0);
};

b2BoxDef$.prototype = new b2BoxDef;

/**
 * class b2Body extends Object
 * @constructor
 */
function b2Body() {
}

b2Body.prototype = new Object;
/**
 * @constructor
 * @param {b2BodyDef} bd
 * @param {b2World} world
 */
function b2Body$Lb2BodyDef$Lb2World$(bd, world) {
	/** @type {!number} */
	var i;
	/** @type {b2ShapeDef} */
	var sd;
	/** @type {b2MassData} */
	var massData;
	/** @type {Array.<undefined|b2MassData>} */
	var massDatas;
	/** @type {b2Vec2} */
	var r;
	/** @type {b2Shape} */
	var shape;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Mat22} */
	var this$1;
	/** @type {!number} */
	var angle$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {b2Vec2} */
	var v$1;
	/** @type {!number} */
	var a$0;
	/** @type {!number} */
	var b$0$0;
	/** @type {!number} */
	var a$1;
	/** @type {!number} */
	var b$0$1;
	/** @type {b2Vec2} */
	var this$3;
	/** @type {!number} */
	var a$2;
	/** @type {b2Vec2} */
	var this$4;
	/** @type {b2Vec2} */
	var v$2;
	/** @type {b2Vec2} */
	var a$3;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Vec2} */
	var a$4;
	/** @type {b2Vec2} */
	var b$1;
	/** @type {b2Vec2} */
	var this$5;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Vec2} */
	var v$3;
	/** @type {b2Vec2} */
	var a$5;
	/** @type {b2Vec2} */
	var b$2;
	/** @type {!number} */
	var s$1;
	/** @type {b2Vec2} */
	var a$6;
	this.m_rotation = 0;
	this.m_rotation0 = 0;
	this.m_linearVelocity = undefined;
	this.m_angularVelocity = 0;
	this.m_force = undefined;
	this.m_torque = 0;
	this.m_center = undefined;
	this.m_world = undefined;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_shapeList = undefined;
	this.m_shapeCount = 0;
	this.m_jointList = undefined;
	this.m_contactList = undefined;
	this.m_mass = 0;
	this.m_invMass = 0;
	this.m_I = 0;
	this.m_invI = 0;
	this.m_linearDamping = 0;
	this.m_angularDamping = 0;
	this.m_sleepTime = 0;
	this.m_userData = undefined;
	this.sMat0 = new b2Mat22$();
	this.m_position = new b2Vec2$();
	this.m_R = new b2Mat22$N(0);
	this.m_position0 = new b2Vec2$();
	i = 0;
	this.m_flags = 0;
	this$0 = this.m_position;
	v$0 = bd.position;
	this$0.x = v$0.x;
	this$0.y = v$0.y;
	this.m_rotation = bd.rotation;
	this$1 = this.m_R;
	angle$0 = this.m_rotation;
	c$0 = Math.cos(angle$0);
	s$0 = Math.sin(angle$0);
	this$1.col1.x = c$0;
	this$1.col2.x = - s$0;
	this$1.col1.y = s$0;
	this$1.col2.y = c$0;
	this$2 = this.m_position0;
	v$1 = this.m_position;
	this$2.x = v$1.x;
	this$2.y = v$1.y;
	this.m_rotation0 = this.m_rotation;
	this.m_world = world;
	a$0 = 1.0 - bd.linearDamping;
	b$0$0 = (a$0 < 1.0 ? a$0 : 1.0);
	this.m_linearDamping = (0.0 > b$0$0 ? 0.0 : b$0$0);
	a$1 = 1.0 - bd.angularDamping;
	b$0$1 = (a$1 < 1.0 ? a$1 : 1.0);
	this.m_angularDamping = (0.0 > b$0$1 ? 0.0 : b$0$1);
	this.m_force = new b2Vec2$NN(0.0, 0.0);
	this.m_torque = 0.0;
	this.m_mass = 0.0;
	massDatas = [  ];
	massDatas.length = 64;
	for (i = 0; i < 64; i++) {
		massDatas[i] = new b2MassData$();
	}
	this.m_shapeCount = 0;
	this.m_center = new b2Vec2$NN(0.0, 0.0);
	for (i = 0; i < 64; ++ i) {
		sd = bd.shapes[i];
		if (sd == undefined) {
			break;
		}
		massData = massDatas[i];
		sd.ComputeMass$Lb2MassData$(massData);
		this.m_mass += massData.mass;
		this.m_center.x += massData.mass * (sd.localPosition.x + massData.center.x);
		this.m_center.y += massData.mass * (sd.localPosition.y + massData.center.y);
		++ this.m_shapeCount;
	}
	if (this.m_mass > 0.0) {
		this$3 = this.m_center;
		a$2 = 1.0 / this.m_mass;
		this$3.x *= a$2;
		this$3.y *= a$2;
		this$4 = this.m_position;
		A$0 = this.m_R;
		v$3 = this.m_center;
		v$2 = new b2Vec2$NN(A$0.col1.x * v$3.x + A$0.col2.x * v$3.y, A$0.col1.y * v$3.x + A$0.col2.y * v$3.y);
		this$4.x += v$2.x;
		this$4.y += v$2.y;
	} else {
		this.m_flags |= 0x0001;
	}
	this.m_I = 0.0;
	for (i = 0; i < this.m_shapeCount; ++ i) {
		sd = bd.shapes[i];
		massData = massDatas[i];
		this.m_I += massData.I;
		a$5 = sd.localPosition;
		b$2 = massData.center;
		a$3 = new b2Vec2$NN(a$5.x + b$2.x, a$5.y + b$2.y);
		b$0 = this.m_center;
		r = new b2Vec2$NN(a$3.x - b$0.x, a$3.y - b$0.y);
		this.m_I += massData.mass * (r.x * r.x + r.y * r.y);
	}
	if (this.m_mass > 0.0) {
		this.m_invMass = 1.0 / this.m_mass;
	} else {
		this.m_invMass = 0.0;
	}
	if (this.m_I > 0.0 && bd.preventRotation === false) {
		this.m_invI = 1.0 / this.m_I;
	} else {
		this.m_I = 0.0;
		this.m_invI = 0.0;
	}
	a$4 = bd.linearVelocity;
	s$1 = bd.angularVelocity;
	a$6 = this.m_center;
	b$1 = new b2Vec2$NN(- s$1 * a$6.y, s$1 * a$6.x);
	this.m_linearVelocity = new b2Vec2$NN(a$4.x + b$1.x, a$4.y + b$1.y);
	this.m_angularVelocity = bd.angularVelocity;
	this.m_jointList = undefined;
	this.m_contactList = undefined;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_shapeList = undefined;
	for (i = 0; i < this.m_shapeCount; ++ i) {
		sd = bd.shapes[i];
		shape = b2Shape$Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$(sd, this, this.m_center);
		shape.m_next = this.m_shapeList;
		this.m_shapeList = shape;
	}
	this.m_sleepTime = 0.0;
	if (bd.allowSleep) {
		this.m_flags |= 0x0010;
	}
	if (bd.isSleeping) {
		this.m_flags |= 0x0008;
	}
	if ((this.m_flags & 0x0008) !== 0 || this.m_invMass === 0.0) {
		this$5 = this.m_linearVelocity;
		this$5.x = 0.0;
		this$5.y = 0.0;
		this.m_angularVelocity = 0.0;
	}
	this.m_userData = bd.userData;
};

b2Body$Lb2BodyDef$Lb2World$.prototype = new b2Body;

/**
 * @param {b2Vec2} position
 * @param {!number} rotation
 */
b2Body.prototype.SetOriginPosition$Lb2Vec2$N = function (position, rotation) {
	/** @type {b2Shape} */
	var s;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {!number} */
	var angle$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2BroadPhase} */
	var this$2;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Vec2} */
	var v$1;
	if ((this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	this.m_rotation = rotation;
	this$0 = this.m_R;
	angle$0 = this.m_rotation;
	c$0 = Math.cos(angle$0);
	s$0 = Math.sin(angle$0);
	this$0.col1.x = c$0;
	this$0.col2.x = - s$0;
	this$0.col1.y = s$0;
	this$0.col2.y = c$0;
	A$0 = this.m_R;
	v$1 = this.m_center;
	b$0 = new b2Vec2$NN(A$0.col1.x * v$1.x + A$0.col2.x * v$1.y, A$0.col1.y * v$1.x + A$0.col2.y * v$1.y);
	this.m_position = new b2Vec2$NN(position.x + b$0.x, position.y + b$0.y);
	this$1 = this.m_position0;
	v$0 = this.m_position;
	this$1.x = v$0.x;
	this$1.y = v$0.y;
	this.m_rotation0 = this.m_rotation;
	for (s = this.m_shapeList; s != undefined; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(this.m_position, this.m_R, this.m_position, this.m_R);
	}
	this$2 = this.m_world.m_broadPhase;
	this$2.m_pairManager.Commit$();
};

/**
 * @return {b2Vec2}
 */
b2Body.prototype.GetOriginPosition$ = function () {
	/** @type {b2Vec2} */
	var a$0;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Vec2} */
	var v$0;
	a$0 = this.m_position;
	A$0 = this.m_R;
	v$0 = this.m_center;
	b$0 = new b2Vec2$NN(A$0.col1.x * v$0.x + A$0.col2.x * v$0.y, A$0.col1.y * v$0.x + A$0.col2.y * v$0.y);
	return new b2Vec2$NN(a$0.x - b$0.x, a$0.y - b$0.y);
};

/**
 * @param {b2Vec2} position
 * @param {!number} rotation
 */
b2Body.prototype.SetCenterPosition$Lb2Vec2$N = function (position, rotation) {
	/** @type {b2Shape} */
	var s;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {!number} */
	var angle$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2BroadPhase} */
	var this$3;
	if ((this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	this.m_rotation = rotation;
	this$0 = this.m_R;
	angle$0 = this.m_rotation;
	c$0 = Math.cos(angle$0);
	s$0 = Math.sin(angle$0);
	this$0.col1.x = c$0;
	this$0.col2.x = - s$0;
	this$0.col1.y = s$0;
	this$0.col2.y = c$0;
	this$1 = this.m_position;
	this$1.x = position.x;
	this$1.y = position.y;
	this$2 = this.m_position0;
	v$0 = this.m_position;
	this$2.x = v$0.x;
	this$2.y = v$0.y;
	this.m_rotation0 = this.m_rotation;
	for (s = this.m_shapeList; s != undefined; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(this.m_position, this.m_R, this.m_position, this.m_R);
	}
	this$3 = this.m_world.m_broadPhase;
	this$3.m_pairManager.Commit$();
};

/**
 * @return {b2Vec2}
 */
b2Body.prototype.GetCenterPosition$ = function () {
	return this.m_position;
};

/**
 * @return {!number}
 */
b2Body.prototype.GetRotation$ = function () {
	return this.m_rotation;
};

/**
 * @return {b2Mat22}
 */
b2Body.prototype.GetRotationMatrix$ = function () {
	return this.m_R;
};

/**
 * @param {b2Vec2} v
 */
b2Body.prototype.SetLinearVelocity$Lb2Vec2$ = function (v) {
	/** @type {b2Vec2} */
	var this$0;
	this$0 = this.m_linearVelocity;
	this$0.x = v.x;
	this$0.y = v.y;
};

/**
 * @return {b2Vec2}
 */
b2Body.prototype.GetLinearVelocity$ = function () {
	return this.m_linearVelocity;
};

/**
 * @param {!number} w
 */
b2Body.prototype.SetAngularVelocity$N = function (w) {
	this.m_angularVelocity = w;
};

/**
 * @return {!number}
 */
b2Body.prototype.GetAngularVelocity$ = function () {
	return this.m_angularVelocity;
};

/**
 * @param {b2Vec2} force
 * @param {b2Vec2} point
 */
b2Body.prototype.ApplyForce$Lb2Vec2$Lb2Vec2$ = function (force, point) {
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var a$0;
	/** @type {b2Vec2} */
	var b$0;
	if ((this.m_flags & 0x0008) === 0x0008 === false) {
		this$0 = this.m_force;
		this$0.x += force.x;
		this$0.y += force.y;
		b$0 = this.m_position;
		a$0 = new b2Vec2$NN(point.x - b$0.x, point.y - b$0.y);
		this.m_torque += a$0.x * force.y - a$0.y * force.x;
	}
};

/**
 * @param {!number} torque
 */
b2Body.prototype.ApplyTorque$N = function (torque) {
	if ((this.m_flags & 0x0008) === 0x0008 === false) {
		this.m_torque += torque;
	}
};

/**
 * @param {b2Vec2} impulse
 * @param {b2Vec2} point
 */
b2Body.prototype.ApplyImpulse$Lb2Vec2$Lb2Vec2$ = function (impulse, point) {
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {!number} */
	var s$0;
	if ((this.m_flags & 0x0008) === 0x0008 === false) {
		this$0 = this.m_linearVelocity;
		s$0 = this.m_invMass;
		v$0 = new b2Vec2$NN(s$0 * impulse.x, s$0 * impulse.y);
		this$0.x += v$0.x;
		this$0.y += v$0.y;
		this.m_angularVelocity += this.m_invI * b2Math$b2CrossVV$Lb2Vec2$Lb2Vec2$(b2Math$SubtractVV$Lb2Vec2$Lb2Vec2$(point, this.m_position), impulse);
	}
};

/**
 * @return {!number}
 */
b2Body.prototype.GetMass$ = function () {
	return this.m_mass;
};

/**
 * @return {!number}
 */
b2Body.prototype.GetInertia$ = function () {
	return this.m_I;
};

/**
 * @param {b2Vec2} localPoint
 * @return {b2Vec2}
 */
b2Body.prototype.GetWorldPoint$Lb2Vec2$ = function (localPoint) {
	/** @type {b2Vec2} */
	var a$0;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {b2Mat22} */
	var A$0;
	a$0 = this.m_position;
	A$0 = this.m_R;
	b$0 = new b2Vec2$NN(A$0.col1.x * localPoint.x + A$0.col2.x * localPoint.y, A$0.col1.y * localPoint.x + A$0.col2.y * localPoint.y);
	return new b2Vec2$NN(a$0.x + b$0.x, a$0.y + b$0.y);
};

/**
 * @param {b2Vec2} localVector
 * @return {b2Vec2}
 */
b2Body.prototype.GetWorldVector$Lb2Vec2$ = function (localVector) {
	/** @type {b2Mat22} */
	var A$0;
	A$0 = this.m_R;
	return new b2Vec2$NN(A$0.col1.x * localVector.x + A$0.col2.x * localVector.y, A$0.col1.y * localVector.x + A$0.col2.y * localVector.y);
};

/**
 * @param {b2Vec2} worldPoint
 * @return {b2Vec2}
 */
b2Body.prototype.GetLocalPoint$Lb2Vec2$ = function (worldPoint) {
	/** @type {b2Mat22} */
	var A$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Vec2} */
	var b$0;
	A$0 = this.m_R;
	b$0 = this.m_position;
	v$0 = new b2Vec2$NN(worldPoint.x - b$0.x, worldPoint.y - b$0.y);
	return new b2Vec2$NN(b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(v$0, A$0.col1), b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(v$0, A$0.col2));
};

/**
 * @param {b2Vec2} worldVector
 * @return {b2Vec2}
 */
b2Body.prototype.GetLocalVector$Lb2Vec2$ = function (worldVector) {
	/** @type {b2Mat22} */
	var A$0;
	A$0 = this.m_R;
	return new b2Vec2$NN(b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(worldVector, A$0.col1), b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(worldVector, A$0.col2));
};

/**
 * @return {!boolean}
 */
b2Body.prototype.IsStatic$ = function () {
	return (this.m_flags & 0x0001) === 0x0001;
};

/**
 * @return {!boolean}
 */
b2Body.prototype.IsFrozen$ = function () {
	return (this.m_flags & 0x0002) === 0x0002;
};

/**
 * @return {!boolean}
 */
b2Body.prototype.IsSleeping$ = function () {
	return (this.m_flags & 0x0008) === 0x0008;
};

/**
 * @param {!boolean} flag
 */
b2Body.prototype.AllowSleeping$B = function (flag) {
	if (flag) {
		this.m_flags |= 0x0010;
	} else {
		this.m_flags &= ~ 0x0010;
		this.m_flags &= ~ 0x0008;
		this.m_sleepTime = 0.0;
	}
};

/**
 */
b2Body.prototype.WakeUp$ = function () {
	this.m_flags &= ~ 0x0008;
	this.m_sleepTime = 0.0;
};

/**
 * @return {b2Shape}
 */
b2Body.prototype.GetShapeList$ = function () {
	return this.m_shapeList;
};

/**
 * @return {b2ContactNode}
 */
b2Body.prototype.GetContactList$ = function () {
	return this.m_contactList;
};

/**
 * @return {*}
 */
b2Body.prototype.GetJointList$ = function () {
	return this.m_jointList;
};

/**
 * @return {b2Body}
 */
b2Body.prototype.GetNext$ = function () {
	return this.m_next;
};

/**
 * @return {*}
 */
b2Body.prototype.GetUserData$ = function () {
	return this.m_userData;
};

/**
 */
b2Body.prototype.Destroy$ = function () {
	/** @type {b2Shape} */
	var s;
	/** @type {b2Shape} */
	var s0;
	s = this.m_shapeList;
	while (s != undefined) {
		s0 = s;
		s = s.m_next;
		b2Shape$Destroy$Lb2Shape$(s0);
	}
};

/**
 */
b2Body.prototype.SynchronizeShapes$ = function () {
	/** @type {b2Shape} */
	var s;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {!number} */
	var angle$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	this$0 = this.sMat0;
	angle$0 = this.m_rotation0;
	c$0 = Math.cos(angle$0);
	s$0 = Math.sin(angle$0);
	this$0.col1.x = c$0;
	this$0.col2.x = - s$0;
	this$0.col1.y = s$0;
	this$0.col2.y = c$0;
	for (s = this.m_shapeList; s != undefined; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(this.m_position0, this.sMat0, this.m_position, this.m_R);
	}
};

/**
 */
b2Body.prototype.QuickSyncShapes$ = function () {
	/** @type {b2Shape} */
	var s;
	for (s = this.m_shapeList; s != undefined; s = s.m_next) {
		s.QuickSync$Lb2Vec2$Lb2Mat22$(this.m_position, this.m_R);
	}
};

/**
 * @param {*} other
 * @return {!boolean}
 */
b2Body.prototype.IsConnected$X = function (other) {
	return false;
};

/**
 */
b2Body.prototype.Freeze$ = function () {
	/** @type {b2Shape} */
	var s;
	/** @type {b2Vec2} */
	var this$0;
	this.m_flags |= 0x0002;
	this$0 = this.m_linearVelocity;
	this$0.x = 0;
	this$0.y = 0;
	this.m_angularVelocity = 0.0;
	for (s = this.m_shapeList; s != undefined; s = s.m_next) {
		s.DestroyProxy$();
	}
};

/**
 * class b2BodyDef extends Object
 * @constructor
 */
function b2BodyDef() {
}

b2BodyDef.prototype = new Object;
/**
 * @constructor
 */
function b2BodyDef$() {
	/** @type {!number} */
	var i;
	this.position = undefined;
	this.rotation = 0;
	this.linearVelocity = undefined;
	this.angularVelocity = 0;
	this.linearDamping = 0;
	this.angularDamping = 0;
	this.allowSleep = false;
	this.isSleeping = false;
	this.preventRotation = false;
	this.shapes = [  ];
	this.userData = undefined;
	for (i = 0; i < 64; i++) {
		this.shapes[i] = undefined;
	}
	this.position = new b2Vec2$NN(0.0, 0.0);
	this.rotation = 0.0;
	this.linearVelocity = new b2Vec2$NN(0.0, 0.0);
	this.angularVelocity = 0.0;
	this.linearDamping = 0.0;
	this.angularDamping = 0.0;
	this.allowSleep = true;
	this.isSleeping = false;
	this.preventRotation = false;
};

b2BodyDef$.prototype = new b2BodyDef;

/**
 * @param {b2ShapeDef} shape
 */
b2BodyDef.prototype.AddShape$Lb2ShapeDef$ = function (shape) {
	/** @type {!number} */
	var i;
	for (i = 0; i < 64; ++ i) {
		if (this.shapes[i] == undefined) {
			this.shapes[i] = shape;
			break;
		}
	}
};

/**
 * class b2CollisionFilter extends Object
 * @constructor
 */
function b2CollisionFilter() {
}

b2CollisionFilter.prototype = new Object;
/**
 * @constructor
 */
function b2CollisionFilter$() {
};

b2CollisionFilter$.prototype = new b2CollisionFilter;

/**
 * @param {b2Shape} shape1
 * @param {b2Shape} shape2
 * @return {!boolean}
 */
b2CollisionFilter.prototype.ShouldCollide$Lb2Shape$Lb2Shape$ = function (shape1, shape2) {
	/** @type {!boolean} */
	var collide;
	if (shape1.m_groupIndex === shape2.m_groupIndex && shape1.m_groupIndex !== 0) {
		return shape1.m_groupIndex > 0;
	}
	collide = (shape1.m_maskBits & shape2.m_categoryBits) !== 0 && (shape1.m_categoryBits & shape2.m_maskBits) !== 0;
	return collide;
};

/**
 * class b2ContactManager extends b2PairCallback
 * @constructor
 */
function b2ContactManager() {
}

b2ContactManager.prototype = new b2PairCallback;
/**
 * @constructor
 */
function b2ContactManager$() {
	this.m_nullContact = new b2NullContact$();
	this.m_world = undefined;
	this.m_destroyImmediate = false;
};

b2ContactManager$.prototype = new b2ContactManager;

/**
 * @param {*} proxyUserData1
 * @param {*} proxyUserData2
 * @return {*}
 */
b2ContactManager.prototype.PairAdded$XX = function (proxyUserData1, proxyUserData2) {
	/** @type {b2Shape} */
	var shape1;
	/** @type {b2Shape} */
	var shape2;
	/** @type {b2Body} */
	var body1;
	/** @type {b2Body} */
	var body2;
	/** @type {b2Shape} */
	var tempShape;
	/** @type {b2Body} */
	var tempBody;
	/** @type {b2Contact} */
	var contact;
	shape1 = proxyUserData1;
	shape2 = proxyUserData2;
	body1 = shape1.m_body;
	body2 = shape2.m_body;
	if ((body1.m_flags & 0x0001) === 0x0001 && (body2.m_flags & 0x0001) === 0x0001) {
		return this.m_nullContact;
	}
	if (shape1.m_body == shape2.m_body) {
		return this.m_nullContact;
	}
	if (body2.IsConnected$X(body1)) {
		return this.m_nullContact;
	}
	if (this.m_world.m_filter != undefined && this.m_world.m_filter.ShouldCollide$Lb2Shape$Lb2Shape$(shape1, shape2) === false) {
		return this.m_nullContact;
	}
	if (body2.m_invMass === 0.0) {
		tempShape = shape1;
		shape1 = shape2;
		shape2 = tempShape;
		tempBody = body1;
		body1 = body2;
		body2 = tempBody;
	}
	contact = b2Contact$Create$Lb2Shape$Lb2Shape$X(shape1, shape2, this.m_world.m_blockAllocator);
	if (contact == undefined) {
		return this.m_nullContact;
	} else {
		contact.m_prev = undefined;
		contact.m_next = this.m_world.m_contactList;
		if (this.m_world.m_contactList != undefined) {
			this.m_world.m_contactList.m_prev = contact;
		}
		this.m_world.m_contactList = contact;
		this.m_world.m_contactCount++;
	}
	return contact;
};

/**
 * @param {*} proxyUserData1
 * @param {*} proxyUserData2
 * @param {*} pairUserData
 */
b2ContactManager.prototype.PairRemoved$XXX = function (proxyUserData1, proxyUserData2, pairUserData) {
	/** @type {b2Contact} */
	var c;
	if (pairUserData == undefined) {
		return;
	}
	c = pairUserData;
	if (c != this.m_nullContact) {
		if (this.m_destroyImmediate === true) {
			this.DestroyContact$Lb2Contact$(c);
			c = undefined;
		} else {
			c.m_flags |= 0x0002;
		}
	}
};

/**
 * @param {b2Contact} c
 */
b2ContactManager.prototype.DestroyContact$Lb2Contact$ = function (c) {
	/** @type {b2Body} */
	var body1;
	/** @type {b2Body} */
	var body2;
	/** @type {b2ContactNode} */
	var node1;
	/** @type {b2ContactNode} */
	var node2;
	if (c.m_prev != undefined) {
		c.m_prev.m_next = c.m_next;
	}
	if (c.m_next != undefined) {
		c.m_next.m_prev = c.m_prev;
	}
	if (c == this.m_world.m_contactList) {
		this.m_world.m_contactList = c.m_next;
	}
	if (c.m_manifoldCount > 0) {
		body1 = c.m_shape1.m_body;
		body2 = c.m_shape2.m_body;
		node1 = c.m_node1;
		node2 = c.m_node2;
		body1.m_flags &= ~ 0x0008;
		body1.m_sleepTime = 0.0;
		body2.m_flags &= ~ 0x0008;
		body2.m_sleepTime = 0.0;
		if (node1.prev != undefined) {
			node1.prev.next = node1.next;
		}
		if (node1.next != undefined) {
			node1.next.prev = node1.prev;
		}
		if (node1 == body1.m_contactList) {
			body1.m_contactList = node1.next;
		}
		node1.prev = undefined;
		node1.next = undefined;
		if (node2.prev != undefined) {
			node2.prev.next = node2.next;
		}
		if (node2.next != undefined) {
			node2.next.prev = node2.prev;
		}
		if (node2 == body2.m_contactList) {
			body2.m_contactList = node2.next;
		}
		node2.prev = undefined;
		node2.next = undefined;
	}
	b2Contact$Destroy$Lb2Contact$X(c, this.m_world.m_blockAllocator);
	-- this.m_world.m_contactCount;
};

/**
 */
b2ContactManager.prototype.CleanContactList$ = function () {
	/** @type {b2Contact} */
	var c;
	/** @type {b2Contact} */
	var c0;
	c = this.m_world.m_contactList;
	while (c != undefined) {
		c0 = c;
		c = c.m_next;
		if ((c0.m_flags & 0x0002) !== 0) {
			this.DestroyContact$Lb2Contact$(c0);
			c0 = undefined;
		}
	}
};

/**
 */
b2ContactManager.prototype.Collide$ = function () {
	/** @type {b2Body} */
	var body1;
	/** @type {b2Body} */
	var body2;
	/** @type {b2ContactNode} */
	var node1;
	/** @type {b2ContactNode} */
	var node2;
	/** @type {b2Contact} */
	var c;
	/** @type {!number} */
	var oldCount;
	/** @type {!number} */
	var newCount;
	for (c = this.m_world.m_contactList; c != undefined; c = c.m_next) {
		if (c.m_shape1.m_body.IsSleeping$() && c.m_shape2.m_body.IsSleeping$()) {
			continue;
		}
		oldCount = c.m_manifoldCount;
		c.Evaluate$();
		newCount = c.m_manifoldCount;
		if (oldCount === 0 && newCount > 0) {
			body1 = c.m_shape1.m_body;
			body2 = c.m_shape2.m_body;
			node1 = c.m_node1;
			node2 = c.m_node2;
			node1.contact = c;
			node1.other = body2;
			node1.prev = undefined;
			node1.next = body1.m_contactList;
			if (node1.next != undefined) {
				node1.next.prev = c.m_node1;
			}
			body1.m_contactList = c.m_node1;
			node2.contact = c;
			node2.other = body1;
			node2.prev = undefined;
			node2.next = body2.m_contactList;
			if (node2.next != undefined) {
				node2.next.prev = node2;
			}
			body2.m_contactList = node2;
		} else {
			if (oldCount > 0 && newCount === 0) {
				body1 = c.m_shape1.m_body;
				body2 = c.m_shape2.m_body;
				node1 = c.m_node1;
				node2 = c.m_node2;
				if (node1.prev != undefined) {
					node1.prev.next = node1.next;
				}
				if (node1.next != undefined) {
					node1.next.prev = node1.prev;
				}
				if (node1 == body1.m_contactList) {
					body1.m_contactList = node1.next;
				}
				node1.prev = undefined;
				node1.next = undefined;
				if (node2.prev != undefined) {
					node2.prev.next = node2.next;
				}
				if (node2.next != undefined) {
					node2.next.prev = node2.prev;
				}
				if (node2 == body2.m_contactList) {
					body2.m_contactList = node2.next;
				}
				node2.prev = undefined;
				node2.next = undefined;
			}
		}
	}
};

/**
 * class b2Island extends Object
 * @constructor
 */
function b2Island() {
}

b2Island.prototype = new Object;
/**
 * @constructor
 * @param {!number} bodyCapacity
 * @param {!number} contactCapacity
 * @param {!number} jointCapacity
 * @param {*} allocator
 */
function b2Island$NNNX(bodyCapacity, contactCapacity, jointCapacity, allocator) {
	/** @type {!number} */
	var i;
	this.m_allocator = undefined;
	this.m_contacts = undefined;
	this.m_joints = undefined;
	this.m_positionError = undefined;
	i = 0;
	this.m_bodyCapacity = bodyCapacity;
	this.m_contactCapacity = contactCapacity;
	this.m_jointCapacity = jointCapacity;
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
	this.m_bodies = [  ];
	this.m_bodies.length = (bodyCapacity | 0);
	for (i = 0; i < bodyCapacity; i++) {
		this.m_bodies[i] = undefined;
	}
	this.m_contacts = [  ];
	this.m_contacts.length = (contactCapacity | 0);
	for (i = 0; i < contactCapacity; i++) {
		this.m_contacts[i] = undefined;
	}
	this.m_joints = [  ];
	this.m_joints.length = (jointCapacity | 0);
	for (i = 0; i < jointCapacity; i++) {
		this.m_joints[i] = undefined;
	}
	this.m_allocator = allocator;
};

b2Island$NNNX.prototype = new b2Island;

/**
 */
b2Island.prototype.Clear$ = function () {
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
};

/**
 * @param {b2TimeStep} step
 * @param {b2Vec2} gravity
 */
b2Island.prototype.Solve$Lb2TimeStep$Lb2Vec2$ = function (step, gravity) {
	/** @type {!number} */
	var i;
	/** @type {b2Body} */
	var b;
	/** @type {b2ContactSolver} */
	var contactSolver;
	/** @type {!number} */
	var j;
	/** @type {!boolean} */
	var contactsOkay;
	/** @type {!boolean} */
	var jointsOkay;
	/** @type {b2Vec2} */
	var this$0;
	/** @type {b2Vec2} */
	var v$0;
	/** @type {b2Vec2} */
	var this$1;
	/** @type {!number} */
	var a$0;
	/** @type {b2Vec2} */
	var this$2;
	/** @type {b2Vec2} */
	var v$1;
	/** @type {b2Mat22} */
	var this$3;
	/** @type {!number} */
	var angle$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	/** @type {b2Mat22} */
	var this$4;
	/** @type {!number} */
	var angle$1;
	/** @type {!number} */
	var c$1;
	/** @type {!number} */
	var s$1;
	/** @type {b2Vec2} */
	var this$5;
	/** @type {!number} */
	var s$2;
	/** @type {b2Vec2} */
	var a$1;
	/** @type {b2Vec2} */
	var b$0;
	/** @type {!number} */
	var s$3;
	/** @type {b2Vec2} */
	var a$2;
	i = 0;
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		this$0 = b.m_linearVelocity;
		s$2 = step.dt;
		s$3 = b.m_invMass;
		a$2 = b.m_force;
		b$0 = new b2Vec2$NN(s$3 * a$2.x, s$3 * a$2.y);
		a$1 = new b2Vec2$NN(gravity.x + b$0.x, gravity.y + b$0.y);
		v$0 = new b2Vec2$NN(s$2 * a$1.x, s$2 * a$1.y);
		this$0.x += v$0.x;
		this$0.y += v$0.y;
		b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
		this$1 = b.m_linearVelocity;
		a$0 = b.m_linearDamping;
		this$1.x *= a$0;
		this$1.y *= a$0;
		b.m_angularVelocity *= b.m_angularDamping;
		this$2 = b.m_position0;
		v$1 = b.m_position;
		this$2.x = v$1.x;
		this$2.y = v$1.y;
		b.m_rotation0 = b.m_rotation;
	}
	contactSolver = new b2ContactSolver$ALb2Contact$NX(this.m_contacts, this.m_contactCount, this.m_allocator);
	contactSolver.PreSolve$();
	for (i = 0; i < this.m_jointCount; ++ i) {
		debugger;
	}
	for (i = 0; i < step.iterations; ++ i) {
		contactSolver.SolveVelocityConstraints$();
		for (j = 0; j < this.m_jointCount; ++ j) {
			debugger;
		}
	}
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		b.m_position.x += step.dt * b.m_linearVelocity.x;
		b.m_position.y += step.dt * b.m_linearVelocity.y;
		b.m_rotation += step.dt * b.m_angularVelocity;
		this$3 = b.m_R;
		angle$0 = b.m_rotation;
		c$0 = Math.cos(angle$0);
		s$0 = Math.sin(angle$0);
		this$3.col1.x = c$0;
		this$3.col2.x = - s$0;
		this$3.col1.y = s$0;
		this$3.col2.y = c$0;
	}
	for (i = 0; i < this.m_jointCount; ++ i) {
		debugger;
	}
	if (b2World.s_enablePositionCorrection) {
		for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < step.iterations; ++ b2Island.m_positionIterationCount) {
			contactsOkay = contactSolver.SolvePositionConstraints$N(0.2);
			jointsOkay = true;
			for (i = 0; i < this.m_jointCount; ++ i) {
				debugger;
			}
			if (contactsOkay && jointsOkay) {
				break;
			}
		}
	}
	contactSolver.PostSolve$();
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		this$4 = b.m_R;
		angle$1 = b.m_rotation;
		c$1 = Math.cos(angle$1);
		s$1 = Math.sin(angle$1);
		this$4.col1.x = c$1;
		this$4.col2.x = - s$1;
		this$4.col1.y = s$1;
		this$4.col2.y = c$1;
		b.SynchronizeShapes$();
		this$5 = b.m_force;
		this$5.x = 0.0;
		this$5.y = 0.0;
		b.m_torque = 0.0;
	}
};

/**
 * @param {!number} dt
 */
b2Island.prototype.UpdateSleep$N = function (dt) {
	/** @type {!number} */
	var i;
	/** @type {b2Body} */
	var b;
	/** @type {!number} */
	var minSleepTime;
	/** @type {!number} */
	var linTolSqr;
	/** @type {!number} */
	var angTolSqr;
	/** @type {!number} */
	var b$0;
	i = 0;
	minSleepTime = Number.MAX_VALUE;
	linTolSqr = 0.09;
	angTolSqr = 0.0001234567901234568;
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		if ((b.m_flags & 0x0010) === 0) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		}
		if ((b.m_flags & 0x0010) === 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		} else {
			b.m_sleepTime += dt;
			b$0 = b.m_sleepTime;
			minSleepTime = (minSleepTime < b$0 ? minSleepTime : b$0);
		}
	}
	if (minSleepTime >= 0.5) {
		for (i = 0; i < this.m_bodyCount; ++ i) {
			b = this.m_bodies[i];
			b.m_flags |= 0x0008;
		}
	}
};

/**
 * @param {b2Body} body
 */
b2Island.prototype.AddBody$Lb2Body$ = function (body) {
	this.m_bodies[this.m_bodyCount++] = body;
};

/**
 * @param {b2Contact} contact
 */
b2Island.prototype.AddContact$Lb2Contact$ = function (contact) {
	this.m_contacts[this.m_contactCount++] = contact;
};

/**
 * @param {*} joint
 */
b2Island.prototype.AddJoint$X = function (joint) {
	debugger;
};

/**
 * class b2TimeStep extends Object
 * @constructor
 */
function b2TimeStep() {
}

b2TimeStep.prototype = new Object;
/**
 * @constructor
 */
function b2TimeStep$() {
	this.dt = 0;
	this.inv_dt = 0;
	this.iterations = 0;
};

b2TimeStep$.prototype = new b2TimeStep;

/**
 * class b2World extends Object
 * @constructor
 */
function b2World() {
}

b2World.prototype = new Object;
/**
 * @constructor
 * @param {b2AABB} worldAABB
 * @param {b2Vec2} gravity
 * @param {!boolean} doSleep
 */
function b2World$Lb2AABB$Lb2Vec2$B(worldAABB, gravity, doSleep) {
	/** @type {b2BodyDef} */
	var bd;
	this.m_blockAllocator = undefined;
	this.m_stackAllocator = undefined;
	this.m_broadPhase = undefined;
	this.m_groundBody = undefined;
	this.m_positionIterationCount = 0;
	this.step = new b2TimeStep$();
	this.m_contactManager = new b2ContactManager$();
	this.m_listener = undefined;
	this.m_filter = b2CollisionFilter.b2_defaultFilter;
	this.m_bodyList = undefined;
	this.m_contactList = undefined;
	this.m_jointList = undefined;
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
	this.m_bodyDestroyList = undefined;
	this.m_allowSleep = doSleep;
	this.m_gravity = gravity;
	this.m_contactManager.m_world = this;
	this.m_broadPhase = new b2BroadPhase$Lb2AABB$Lb2PairCallback$(worldAABB, this.m_contactManager);
	bd = new b2BodyDef$();
	this.m_groundBody = this.CreateBody$Lb2BodyDef$(bd);
};

b2World$Lb2AABB$Lb2Vec2$B.prototype = new b2World;

/**
 * @param {*} listener
 */
b2World.prototype.SetListener$X = function (listener) {
	this.m_listener = listener;
};

/**
 * @param {b2CollisionFilter} filter
 */
b2World.prototype.SetFilter$Lb2CollisionFilter$ = function (filter) {
	this.m_filter = filter;
};

/**
 * @param {b2BodyDef} def
 * @return {b2Body}
 */
b2World.prototype.CreateBody$Lb2BodyDef$ = function (def) {
	/** @type {b2Body} */
	var b;
	b = new b2Body$Lb2BodyDef$Lb2World$(def, this);
	b.m_prev = undefined;
	b.m_next = this.m_bodyList;
	if (this.m_bodyList != undefined) {
		this.m_bodyList.m_prev = b;
	}
	this.m_bodyList = b;
	++ this.m_bodyCount;
	return b;
};

/**
 * @param {b2Body} b
 */
b2World.prototype.DestroyBody$Lb2Body$ = function (b) {
	if ((b.m_flags & 0x0020) !== 0) {
		return;
	}
	if (b.m_prev != undefined) {
		b.m_prev.m_next = b.m_next;
	}
	if (b.m_next != undefined) {
		b.m_next.m_prev = b.m_prev;
	}
	if (b == this.m_bodyList) {
		this.m_bodyList = b.m_next;
	}
	b.m_flags |= 0x0020;
	-- this.m_bodyCount;
	b.m_prev = undefined;
	b.m_next = this.m_bodyDestroyList;
	this.m_bodyDestroyList = b;
};

/**
 */
b2World.prototype.CleanBodyList$ = function () {
	/** @type {b2Body} */
	var b;
	/** @type {b2Body} */
	var b0;
	/** @type {*} */
	var jn;
	this.m_contactManager.m_destroyImmediate = true;
	b = this.m_bodyDestroyList;
	while (b != undefined) {
		b0 = b;
		b = b.m_next;
		jn = b0.m_jointList;
		while (jn != undefined) {
			debugger;
		}
		b0.Destroy$();
	}
	this.m_bodyDestroyList = undefined;
	this.m_contactManager.m_destroyImmediate = false;
};

/**
 * @return {b2Body}
 */
b2World.prototype.GetGroundBody$ = function () {
	return this.m_groundBody;
};

/**
 * @param {!number} dt
 * @param {!number} iterations
 */
b2World.prototype.Step$NN = function (dt, iterations) {
	/** @type {b2Body} */
	var b;
	/** @type {b2Body} */
	var other;
	/** @type {b2Island} */
	var island;
	/** @type {b2Contact} */
	var c;
	/** @type {!number} */
	var stackSize;
	/** @type {Array.<undefined|b2Body>} */
	var stack;
	/** @type {!number} */
	var k;
	/** @type {b2Body} */
	var seed;
	/** @type {!number} */
	var stackCount;
	/** @type {b2ContactNode} */
	var cn;
	/** @type {!number} */
	var i;
	/** @type {b2Contact} */
	var contact$0;
	/** @type {!number} */
	var a$0;
	/** @type {!number} */
	var b$0;
	/** @type {b2BroadPhase} */
	var this$0;
	this.step.dt = dt;
	this.step.iterations = iterations;
	if (dt > 0.0) {
		this.step.inv_dt = 1.0 / dt;
	} else {
		this.step.inv_dt = 0.0;
	}
	this.m_positionIterationCount = 0;
	this.m_contactManager.CleanContactList$();
	this.CleanBodyList$();
	this.m_contactManager.Collide$();
	island = new b2Island$NNNX(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
	for (b = this.m_bodyList; b != undefined; b = b.m_next) {
		b.m_flags &= ~ 0x0004;
	}
	for (c = this.m_contactList; c != undefined; c = c.m_next) {
		c.m_flags &= ~ 0x0001;
	}
	stackSize = this.m_bodyCount;
	stack = [  ];
	stack.length = (this.m_bodyCount | 0);
	for (k = 0; k < this.m_bodyCount; k++) {
		stack[k] = undefined;
	}
	for (seed = this.m_bodyList; seed != undefined; seed = seed.m_next) {
		if ((seed.m_flags & 15) !== 0) {
			continue;
		}
		island.m_bodyCount = 0;
		island.m_contactCount = 0;
		island.m_jointCount = 0;
		stackCount = 0;
		stack[stackCount++] = seed;
		seed.m_flags |= 0x0004;
		while (stackCount > 0) {
			b = stack[-- stackCount];
			island.m_bodies[island.m_bodyCount++] = b;
			b.m_flags &= ~ 0x0008;
			if ((b.m_flags & 0x0001) !== 0) {
				continue;
			}
			for (cn = b.m_contactList; cn != undefined; cn = cn.next) {
				if ((cn.contact.m_flags & 0x0001) !== 0) {
					continue;
				}
				contact$0 = cn.contact;
				island.m_contacts[island.m_contactCount++] = contact$0;
				cn.contact.m_flags |= 0x0001;
				other = cn.other;
				if ((other.m_flags & 0x0004) !== 0) {
					continue;
				}
				stack[stackCount++] = other;
				other.m_flags |= 0x0004;
			}
		}
		island.Solve$Lb2TimeStep$Lb2Vec2$(this.step, this.m_gravity);
		a$0 = this.m_positionIterationCount;
		b$0 = b2Island.m_positionIterationCount;
		this.m_positionIterationCount = (a$0 > b$0 ? a$0 : b$0);
		if (this.m_allowSleep) {
			island.UpdateSleep$N(dt);
		}
		for (i = 0; i < island.m_bodyCount; ++ i) {
			b = island.m_bodies[i];
			if ((b.m_flags & 0x0001) !== 0) {
				b.m_flags &= ~ 0x0004;
			}
			if ((b.m_flags & 0x0002) === 0x0002 && this.m_listener != undefined) {
				debugger;
			}
		}
	}
	this$0 = this.m_broadPhase;
	this$0.m_pairManager.Commit$();
};

/**
 * @param {b2AABB} aabb
 * @param {Array.<undefined|*>} shapes
 * @param {!number} maxCount
 * @return {!number}
 */
b2World.prototype.Query$Lb2AABB$AXN = function (aabb, shapes, maxCount) {
	/** @type {Array.<undefined|*>} */
	var results;
	/** @type {!number} */
	var count;
	/** @type {!number} */
	var i;
	results = [  ];
	count = this.m_broadPhase.QueryAABB$Lb2AABB$AXN(aabb, results, maxCount);
	for (i = 0; i < count; ++ i) {
		shapes[i] = results[i];
	}
	return count;
};

/**
 * @return {b2Body}
 */
b2World.prototype.GetBodyList$ = function () {
	return this.m_bodyList;
};

/**
 * @return {*}
 */
b2World.prototype.GetJointList$ = function () {
	return this.m_jointList;
};

/**
 * @return {b2Contact}
 */
b2World.prototype.GetContactList$ = function () {
	return this.m_contactList;
};

/**
 * class b2Contact extends Object
 * @constructor
 */
function b2Contact() {
}

b2Contact.prototype = new Object;
/**
 * @constructor
 * @param {b2Shape} s1
 * @param {b2Shape} s2
 */
function b2Contact$Lb2Shape$Lb2Shape$(s1, s2) {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(s1, s2);
};

b2Contact$Lb2Shape$Lb2Shape$.prototype = new b2Contact;

/**
 * @constructor
 */
function b2Contact$() {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(undefined, undefined);
};

b2Contact$.prototype = new b2Contact;

/**
 * @param {b2Shape} s1
 * @param {b2Shape} s2
 */
b2Contact.prototype.initializer$Lb2Shape$Lb2Shape$ = function (s1, s2) {
	/** @type {!number} */
	var a$0;
	/** @type {!number} */
	var b$0;
	this.m_node1 = new b2ContactNode$();
	this.m_node2 = new b2ContactNode$();
	this.m_flags = 0;
	if (s1 == undefined || s2 == undefined) {
		this.m_shape1 = undefined;
		this.m_shape2 = undefined;
		return;
	}
	this.m_shape1 = s1;
	this.m_shape2 = s2;
	this.m_manifoldCount = 0;
	this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
	a$0 = this.m_shape1.m_restitution;
	b$0 = this.m_shape2.m_restitution;
	this.m_restitution = (a$0 > b$0 ? a$0 : b$0);
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1.contact = undefined;
	this.m_node1.prev = undefined;
	this.m_node1.next = undefined;
	this.m_node1.other = undefined;
	this.m_node2.contact = undefined;
	this.m_node2.prev = undefined;
	this.m_node2.next = undefined;
	this.m_node2.other = undefined;
};

/**
 * @return {Array.<undefined|b2Manifold>}
 */
b2Contact.prototype.GetManifolds$ = function () {
	return undefined;
};

/**
 * @return {!number}
 */
b2Contact.prototype.GetManifoldCount$ = function () {
	return this.m_manifoldCount;
};

/**
 * @return {b2Contact}
 */
b2Contact.prototype.GetNext$ = function () {
	return this.m_next;
};

/**
 * @return {b2Shape}
 */
b2Contact.prototype.GetShape1$ = function () {
	return this.m_shape1;
};

/**
 * @return {b2Shape}
 */
b2Contact.prototype.GetShape2$ = function () {
	return this.m_shape2;
};

/**
 */
b2Contact.prototype.Evaluate$ = function () {
};

/**
 * @param {!number} type1
 * @param {!number} type2
 */
b2Contact.AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN = function (createFcn, destroyFcn, type1, type2) {
	b2Contact.s_registers[type1][type2].createFcn = createFcn;
	b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn;
	b2Contact.s_registers[type1][type2].primary = true;
	if (type1 !== type2) {
		b2Contact.s_registers[type2][type1].createFcn = createFcn;
		b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn;
		b2Contact.s_registers[type2][type1].primary = false;
	}
};

var b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN = b2Contact.AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN;

/**
 */
b2Contact.InitializeRegisters$ = function () {
	/** @type {!number} */
	var i;
	/** @type {!number} */
	var j;
	var c;
	var d;
	b2Contact.s_registers = [  ];
	b2Contact.s_registers.length = 4;
	for (i = 0; i < 4; i++) {
		b2Contact.s_registers[i] = [  ];
		b2Contact.s_registers[i].length = 4;
		for (j = 0; j < 4; j++) {
			b2Contact.s_registers[i][j] = new b2ContactRegister$();
		}
	}
	c = (function (s1, s2, al) {
		/** @type {b2CircleShape} */
		var shape1$0;
		/** @type {b2CircleShape} */
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2CircleContact$Lb2CircleShape$Lb2CircleShape$(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 0, 0);
	c = (function (s1, s2, al) {
		/** @type {b2PolyShape} */
		var shape1$0;
		/** @type {b2CircleShape} */
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 2, 0);
	c = (function (s1, s2, al) {
		/** @type {b2PolyShape} */
		var shape1$0;
		/** @type {b2PolyShape} */
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2PolyContact$Lb2PolyShape$Lb2PolyShape$(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 2, 2);
};

var b2Contact$InitializeRegisters$ = b2Contact.InitializeRegisters$;

/**
 * @param {b2Shape} shape1
 * @param {b2Shape} shape2
 * @param {*} allocator
 * @return {b2Contact}
 */
b2Contact.Create$Lb2Shape$Lb2Shape$X = function (shape1, shape2, allocator) {
	/** @type {!number} */
	var type1;
	/** @type {!number} */
	var type2;
	var createFcn;
	/** @type {b2Contact} */
	var c;
	/** @type {!number} */
	var i;
	/** @type {b2Manifold} */
	var m;
	/** @type {b2Vec2} */
	var this$0;
	if (b2Contact.s_initialized === false) {
		b2Contact$InitializeRegisters$();
		b2Contact.s_initialized = true;
	}
	type1 = shape1.m_type;
	type2 = shape2.m_type;
	createFcn = b2Contact.s_registers[type1][type2].createFcn;
	if (createFcn != undefined) {
		if (b2Contact.s_registers[type1][type2].primary) {
			return createFcn(shape1, shape2, allocator);
		} else {
			c = createFcn(shape2, shape1, allocator);
			for (i = 0; i < c.m_manifoldCount; ++ i) {
				m = c.GetManifolds$()[i];
				this$0 = m.normal;
				m.normal = new b2Vec2$NN(- this$0.x, - this$0.y);
			}
			return c;
		}
	} else {
		return undefined;
	}
};

var b2Contact$Create$Lb2Shape$Lb2Shape$X = b2Contact.Create$Lb2Shape$Lb2Shape$X;

/**
 * @param {b2Contact} contact
 * @param {*} allocator
 */
b2Contact.Destroy$Lb2Contact$X = function (contact, allocator) {
	/** @type {!number} */
	var type1;
	/** @type {!number} */
	var type2;
	var destroyFcn;
	/** @type {b2Body} */
	var this$0;
	/** @type {b2Body} */
	var this$1;
	if (contact.m_manifoldCount > 0) {
		this$0 = contact.m_shape1.m_body;
		this$0.m_flags &= ~ 0x0008;
		this$0.m_sleepTime = 0.0;
		this$1 = contact.m_shape2.m_body;
		this$1.m_flags &= ~ 0x0008;
		this$1.m_sleepTime = 0.0;
	}
	type1 = contact.m_shape1.m_type;
	type2 = contact.m_shape2.m_type;
	destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn;
	destroyFcn(contact, allocator);
};

var b2Contact$Destroy$Lb2Contact$X = b2Contact.Destroy$Lb2Contact$X;

/**
 * class b2CircleContact extends b2Contact
 * @constructor
 */
function b2CircleContact() {
}

b2CircleContact.prototype = new b2Contact;
/**
 * @constructor
 * @param {b2CircleShape} s1
 * @param {b2CircleShape} s2
 */
function b2CircleContact$Lb2CircleShape$Lb2CircleShape$(s1, s2) {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(s1, s2);
	this.m_manifold = undefined;
	if (s1 == undefined || s2 == undefined) {
		debugger;
	}
	this.m_manifold = [ new b2Manifold$() ];
	this.m_manifold[0].pointCount = 0;
	this.m_manifold[0].points[0].normalImpulse = 0.0;
	this.m_manifold[0].points[0].tangentImpulse = 0.0;
};

b2CircleContact$Lb2CircleShape$Lb2CircleShape$.prototype = new b2CircleContact;

/**
 */
b2CircleContact.prototype.Evaluate$ = function () {
	b2Collision$b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
	if (this.m_manifold[0].pointCount > 0) {
		this.m_manifoldCount = 1;
	} else {
		this.m_manifoldCount = 0;
	}
};

/**
 * @return {Array.<undefined|b2Manifold>}
 */
b2CircleContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};

/**
 * @param {b2CircleShape} shape1
 * @param {b2CircleShape} shape2
 * @param {*} allocator
 * @return {b2CircleContact}
 */
b2CircleContact.Create$Lb2CircleShape$Lb2CircleShape$X = function (shape1, shape2, allocator) {
	return new b2CircleContact$Lb2CircleShape$Lb2CircleShape$(shape1, shape2);
};

var b2CircleContact$Create$Lb2CircleShape$Lb2CircleShape$X = b2CircleContact.Create$Lb2CircleShape$Lb2CircleShape$X;

/**
 * @param {b2Contact} contact
 * @param {*} allocator
 */
b2CircleContact.Destroy$Lb2Contact$X = function (contact, allocator) {
};

var b2CircleContact$Destroy$Lb2Contact$X = b2CircleContact.Destroy$Lb2Contact$X;

/**
 * class b2ContactConstraint extends Object
 * @constructor
 */
function b2ContactConstraint() {
}

b2ContactConstraint.prototype = new Object;
/**
 * @constructor
 */
function b2ContactConstraint$() {
	/** @type {!number} */
	var i;
	this.manifold = undefined;
	this.body1 = undefined;
	this.body2 = undefined;
	this.friction = 0;
	this.restitution = 0;
	this.pointCount = 0;
	this.normal = new b2Vec2$();
	this.points = [  ];
	this.points.length = 2;
	for (i = 0; i < 2; i++) {
		this.points[i] = new b2ContactConstraintPoint$();
	}
};

b2ContactConstraint$.prototype = new b2ContactConstraint;

/**
 * class b2ContactConstraintPoint extends Object
 * @constructor
 */
function b2ContactConstraintPoint() {
}

b2ContactConstraintPoint.prototype = new Object;
/**
 * @constructor
 */
function b2ContactConstraintPoint$() {
	this.normalImpulse = 0;
	this.tangentImpulse = 0;
	this.positionImpulse = 0;
	this.normalMass = 0;
	this.tangentMass = 0;
	this.separation = 0;
	this.velocityBias = 0;
	this.localAnchor1 = new b2Vec2$();
	this.localAnchor2 = new b2Vec2$();
};

b2ContactConstraintPoint$.prototype = new b2ContactConstraintPoint;

/**
 * class b2ContactNode extends Object
 * @constructor
 */
function b2ContactNode() {
}

b2ContactNode.prototype = new Object;
/**
 * @constructor
 */
function b2ContactNode$() {
	this.other = undefined;
	this.contact = undefined;
	this.prev = undefined;
	this.next = undefined;
};

b2ContactNode$.prototype = new b2ContactNode;

/**
 * class b2ContactRegister extends Object
 * @constructor
 */
function b2ContactRegister() {
}

b2ContactRegister.prototype = new Object;
/**
 * @constructor
 */
function b2ContactRegister$() {
	this.createFcn = undefined;
	this.destroyFcn = undefined;
	this.primary = false;
};

b2ContactRegister$.prototype = new b2ContactRegister;

/**
 * class b2ContactSolver extends Object
 * @constructor
 */
function b2ContactSolver() {
}

b2ContactSolver.prototype = new Object;
/**
 * @constructor
 * @param {Array.<undefined|b2Contact>} contacts
 * @param {!number} contactCount
 * @param {*} allocator
 */
function b2ContactSolver$ALb2Contact$NX(contacts, contactCount, allocator) {
	/** @type {!number} */
	var i;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var count;
	/** @type {b2Contact} */
	var contact;
	/** @type {b2Body} */
	var b1;
	/** @type {b2Body} */
	var b2;
	/** @type {!number} */
	var manifoldCount;
	/** @type {Array.<undefined|b2Manifold>} */
	var manifolds;
	/** @type {!number} */
	var friction;
	/** @type {!number} */
	var restitution;
	/** @type {!number} */
	var v1X;
	/** @type {!number} */
	var v1Y;
	/** @type {!number} */
	var v2X;
	/** @type {!number} */
	var v2Y;
	/** @type {!number} */
	var w1;
	/** @type {!number} */
	var w2;
	/** @type {!number} */
	var j;
	/** @type {b2Manifold} */
	var manifold;
	/** @type {!number} */
	var normalX;
	/** @type {!number} */
	var normalY;
	/** @type {b2ContactConstraint} */
	var c;
	/** @type {!number} */
	var k;
	/** @type {b2ContactPoint} */
	var cp;
	/** @type {b2ContactConstraintPoint} */
	var ccp;
	/** @type {!number} */
	var r1X;
	/** @type {!number} */
	var r1Y;
	/** @type {!number} */
	var r2X;
	/** @type {!number} */
	var r2Y;
	/** @type {!number} */
	var r1Sqr;
	/** @type {!number} */
	var r2Sqr;
	/** @type {!number} */
	var rn1;
	/** @type {!number} */
	var rn2;
	/** @type {!number} */
	var kNormal;
	/** @type {!number} */
	var tangentX;
	/** @type {!number} */
	var tangentY;
	/** @type {!number} */
	var rt1;
	/** @type {!number} */
	var rt2;
	/** @type {!number} */
	var kTangent;
	/** @type {!number} */
	var tX;
	/** @type {!number} */
	var tY;
	/** @type {!number} */
	var vRel;
	/** @type {b2Contact} */
	var this$0;
	this.m_constraints = [  ];
	this.m_allocator = allocator;
	i = 0;
	this.m_constraintCount = 0;
	for (i = 0; i < contactCount; ++ i) {
		this$0 = contacts[i];
		this.m_constraintCount += this$0.m_manifoldCount;
	}
	for (i = 0; i < this.m_constraintCount; i++) {
		this.m_constraints[i] = new b2ContactConstraint$();
	}
	count = 0;
	for (i = 0; i < contactCount; ++ i) {
		contact = contacts[i];
		b1 = contact.m_shape1.m_body;
		b2 = contact.m_shape2.m_body;
		manifoldCount = contact.m_manifoldCount;
		manifolds = contact.GetManifolds$();
		friction = contact.m_friction;
		restitution = contact.m_restitution;
		v1X = b1.m_linearVelocity.x;
		v1Y = b1.m_linearVelocity.y;
		v2X = b2.m_linearVelocity.x;
		v2Y = b2.m_linearVelocity.y;
		w1 = b1.m_angularVelocity;
		w2 = b2.m_angularVelocity;
		for (j = 0; j < manifoldCount; ++ j) {
			manifold = manifolds[j];
			normalX = manifold.normal.x;
			normalY = manifold.normal.y;
			c = this.m_constraints[count];
			c.body1 = b1;
			c.body2 = b2;
			c.manifold = manifold;
			c.normal.x = normalX;
			c.normal.y = normalY;
			c.pointCount = manifold.pointCount;
			c.friction = friction;
			c.restitution = restitution;
			for (k = 0; k < c.pointCount; ++ k) {
				cp = manifold.points[k];
				ccp = c.points[k];
				ccp.normalImpulse = cp.normalImpulse;
				ccp.tangentImpulse = cp.tangentImpulse;
				ccp.separation = cp.separation;
				r1X = cp.position.x - b1.m_position.x;
				r1Y = cp.position.y - b1.m_position.y;
				r2X = cp.position.x - b2.m_position.x;
				r2Y = cp.position.y - b2.m_position.y;
				tVec = ccp.localAnchor1;
				tMat = b1.m_R;
				tVec.x = r1X * tMat.col1.x + r1Y * tMat.col1.y;
				tVec.y = r1X * tMat.col2.x + r1Y * tMat.col2.y;
				tVec = ccp.localAnchor2;
				tMat = b2.m_R;
				tVec.x = r2X * tMat.col1.x + r2Y * tMat.col1.y;
				tVec.y = r2X * tMat.col2.x + r2Y * tMat.col2.y;
				r1Sqr = r1X * r1X + r1Y * r1Y;
				r2Sqr = r2X * r2X + r2Y * r2Y;
				rn1 = r1X * normalX + r1Y * normalY;
				rn2 = r2X * normalX + r2Y * normalY;
				kNormal = b1.m_invMass + b2.m_invMass;
				kNormal += b1.m_invI * (r1Sqr - rn1 * rn1) + b2.m_invI * (r2Sqr - rn2 * rn2);
				ccp.normalMass = 1.0 / kNormal;
				tangentX = normalY;
				tangentY = - normalX;
				rt1 = r1X * tangentX + r1Y * tangentY;
				rt2 = r2X * tangentX + r2Y * tangentY;
				kTangent = b1.m_invMass + b2.m_invMass;
				kTangent += b1.m_invI * (r1Sqr - rt1 * rt1) + b2.m_invI * (r2Sqr - rt2 * rt2);
				ccp.tangentMass = 1.0 / kTangent;
				ccp.velocityBias = 0.0;
				if (ccp.separation > 0.0) {
					ccp.velocityBias = -60 * ccp.separation;
				}
				tX = v2X + - w2 * r2Y - v1X - - w1 * r1Y;
				tY = v2Y + w2 * r2X - v1Y - w1 * r1X;
				vRel = c.normal.x * tX + c.normal.y * tY;
				if (vRel < -30) {
					ccp.velocityBias += - c.restitution * vRel;
				}
			}
			++ count;
		}
	}
};

b2ContactSolver$ALb2Contact$NX.prototype = new b2ContactSolver;

/**
 */
b2ContactSolver.prototype.PreSolve$ = function () {
	/** @type {b2Vec2} */
	var tVec;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {!number} */
	var i;
	/** @type {b2ContactConstraint} */
	var c;
	/** @type {b2Body} */
	var b1;
	/** @type {b2Body} */
	var b2;
	/** @type {!number} */
	var invMass1;
	/** @type {!number} */
	var invI1;
	/** @type {!number} */
	var invMass2;
	/** @type {!number} */
	var invI2;
	/** @type {!number} */
	var normalX;
	/** @type {!number} */
	var normalY;
	/** @type {!number} */
	var tangentX;
	/** @type {!number} */
	var tangentY;
	/** @type {!number} */
	var j;
	/** @type {!number} */
	var tCount;
	/** @type {b2ContactConstraintPoint} */
	var ccp;
	/** @type {!number} */
	var PX;
	/** @type {!number} */
	var PY;
	/** @type {!number} */
	var r1X;
	/** @type {!number} */
	var r1Y;
	/** @type {!number} */
	var r2X;
	/** @type {!number} */
	var r2Y;
	/** @type {b2ContactConstraintPoint} */
	var ccp2;
	for (i = 0; i < this.m_constraintCount; ++ i) {
		c = this.m_constraints[i];
		b1 = c.body1;
		b2 = c.body2;
		invMass1 = b1.m_invMass;
		invI1 = b1.m_invI;
		invMass2 = b2.m_invMass;
		invI2 = b2.m_invI;
		normalX = c.normal.x;
		normalY = c.normal.y;
		tangentX = normalY;
		tangentY = - normalX;
		j = 0;
		tCount = 0;
		if (b2World.s_enableWarmStarting) {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++ j) {
				ccp = c.points[j];
				PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
				PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
				b1.m_linearVelocity.x -= invMass1 * PX;
				b1.m_linearVelocity.y -= invMass1 * PY;
				b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
				b2.m_linearVelocity.x += invMass2 * PX;
				b2.m_linearVelocity.y += invMass2 * PY;
				ccp.positionImpulse = 0.0;
			}
		} else {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++ j) {
				ccp2 = c.points[j];
				ccp2.normalImpulse = 0.0;
				ccp2.tangentImpulse = 0.0;
				ccp2.positionImpulse = 0.0;
			}
		}
	}
};

/**
 */
b2ContactSolver.prototype.SolveVelocityConstraints$ = function () {
	/** @type {!number} */
	var j;
	/** @type {b2ContactConstraintPoint} */
	var ccp;
	/** @type {!number} */
	var r1X;
	/** @type {!number} */
	var r1Y;
	/** @type {!number} */
	var r2X;
	/** @type {!number} */
	var r2Y;
	/** @type {!number} */
	var dvX;
	/** @type {!number} */
	var dvY;
	/** @type {!number} */
	var lambda;
	/** @type {!number} */
	var newImpulse;
	/** @type {!number} */
	var PX;
	/** @type {!number} */
	var PY;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var i;
	/** @type {b2ContactConstraint} */
	var c;
	/** @type {b2Body} */
	var b1;
	/** @type {b2Body} */
	var b2;
	/** @type {!number} */
	var b1_angularVelocity;
	/** @type {b2Vec2} */
	var b1_linearVelocity;
	/** @type {!number} */
	var b2_angularVelocity;
	/** @type {b2Vec2} */
	var b2_linearVelocity;
	/** @type {!number} */
	var invMass1;
	/** @type {!number} */
	var invI1;
	/** @type {!number} */
	var invMass2;
	/** @type {!number} */
	var invI2;
	/** @type {!number} */
	var normalX;
	/** @type {!number} */
	var normalY;
	/** @type {!number} */
	var tangentX;
	/** @type {!number} */
	var tangentY;
	/** @type {!number} */
	var tCount;
	/** @type {!number} */
	var vn;
	/** @type {!number} */
	var vt;
	/** @type {!number} */
	var maxFriction;
	/** @type {!number} */
	var a$0;
	/** @type {!number} */
	var a$1;
	/** @type {!number} */
	var low$0;
	/** @type {!number} */
	var b$0$0;
	j = 0;
	for (i = 0; i < this.m_constraintCount; ++ i) {
		c = this.m_constraints[i];
		b1 = c.body1;
		b2 = c.body2;
		b1_angularVelocity = b1.m_angularVelocity;
		b1_linearVelocity = b1.m_linearVelocity;
		b2_angularVelocity = b2.m_angularVelocity;
		b2_linearVelocity = b2.m_linearVelocity;
		invMass1 = b1.m_invMass;
		invI1 = b1.m_invI;
		invMass2 = b2.m_invMass;
		invI2 = b2.m_invI;
		normalX = c.normal.x;
		normalY = c.normal.y;
		tangentX = normalY;
		tangentY = - normalX;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			dvX = b2_linearVelocity.x + - b2_angularVelocity * r2Y - b1_linearVelocity.x - - b1_angularVelocity * r1Y;
			dvY = b2_linearVelocity.y + b2_angularVelocity * r2X - b1_linearVelocity.y - b1_angularVelocity * r1X;
			vn = dvX * normalX + dvY * normalY;
			lambda = - ccp.normalMass * (vn - ccp.velocityBias);
			a$0 = ccp.normalImpulse + lambda;
			newImpulse = (a$0 > 0.0 ? a$0 : 0.0);
			lambda = newImpulse - ccp.normalImpulse;
			PX = lambda * normalX;
			PY = lambda * normalY;
			b1_linearVelocity.x -= invMass1 * PX;
			b1_linearVelocity.y -= invMass1 * PY;
			b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
			b2_linearVelocity.x += invMass2 * PX;
			b2_linearVelocity.y += invMass2 * PY;
			b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
			ccp.normalImpulse = newImpulse;
			dvX = b2_linearVelocity.x + - b2_angularVelocity * r2Y - b1_linearVelocity.x - - b1_angularVelocity * r1Y;
			dvY = b2_linearVelocity.y + b2_angularVelocity * r2X - b1_linearVelocity.y - b1_angularVelocity * r1X;
			vt = dvX * tangentX + dvY * tangentY;
			lambda = ccp.tangentMass * - vt;
			maxFriction = c.friction * ccp.normalImpulse;
			a$1 = ccp.tangentImpulse + lambda;
			low$0 = - maxFriction;
			b$0$0 = (a$1 < maxFriction ? a$1 : maxFriction);
			newImpulse = (low$0 > b$0$0 ? low$0 : b$0$0);
			lambda = newImpulse - ccp.tangentImpulse;
			PX = lambda * tangentX;
			PY = lambda * tangentY;
			b1_linearVelocity.x -= invMass1 * PX;
			b1_linearVelocity.y -= invMass1 * PY;
			b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
			b2_linearVelocity.x += invMass2 * PX;
			b2_linearVelocity.y += invMass2 * PY;
			b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
			ccp.tangentImpulse = newImpulse;
		}
		b1.m_angularVelocity = b1_angularVelocity;
		b2.m_angularVelocity = b2_angularVelocity;
	}
};

/**
 * @param {!number} beta
 * @return {!boolean}
 */
b2ContactSolver.prototype.SolvePositionConstraints$N = function (beta) {
	/** @type {!number} */
	var minSeparation;
	/** @type {b2Mat22} */
	var tMat;
	/** @type {b2Vec2} */
	var tVec;
	/** @type {!number} */
	var i;
	/** @type {b2ContactConstraint} */
	var c;
	/** @type {b2Body} */
	var b1;
	/** @type {b2Body} */
	var b2;
	/** @type {b2Vec2} */
	var b1_position;
	/** @type {!number} */
	var b1_rotation;
	/** @type {b2Vec2} */
	var b2_position;
	/** @type {!number} */
	var b2_rotation;
	/** @type {!number} */
	var invMass1;
	/** @type {!number} */
	var invI1;
	/** @type {!number} */
	var invMass2;
	/** @type {!number} */
	var invI2;
	/** @type {!number} */
	var normalX;
	/** @type {!number} */
	var normalY;
	/** @type {!number} */
	var tangentX;
	/** @type {!number} */
	var tangentY;
	/** @type {!number} */
	var tCount;
	/** @type {!number} */
	var j;
	/** @type {b2ContactConstraintPoint} */
	var ccp;
	/** @type {!number} */
	var r1X;
	/** @type {!number} */
	var r1Y;
	/** @type {!number} */
	var r2X;
	/** @type {!number} */
	var r2Y;
	/** @type {!number} */
	var p1X;
	/** @type {!number} */
	var p1Y;
	/** @type {!number} */
	var p2X;
	/** @type {!number} */
	var p2Y;
	/** @type {!number} */
	var dpX;
	/** @type {!number} */
	var dpY;
	/** @type {!number} */
	var separation;
	/** @type {!number} */
	var C;
	/** @type {!number} */
	var dImpulse;
	/** @type {!number} */
	var impulse0;
	/** @type {!number} */
	var impulseX;
	/** @type {!number} */
	var impulseY;
	/** @type {!number} */
	var a$0;
	/** @type {b2Mat22} */
	var this$0;
	/** @type {!number} */
	var c$0;
	/** @type {!number} */
	var s$0;
	/** @type {b2Mat22} */
	var this$1;
	/** @type {!number} */
	var c$1;
	/** @type {!number} */
	var s$1;
	minSeparation = 0.0;
	for (i = 0; i < this.m_constraintCount; ++ i) {
		c = this.m_constraints[i];
		b1 = c.body1;
		b2 = c.body2;
		b1_position = b1.m_position;
		b1_rotation = b1.m_rotation;
		b2_position = b2.m_position;
		b2_rotation = b2.m_rotation;
		invMass1 = b1.m_invMass;
		invI1 = b1.m_invI;
		invMass2 = b2.m_invMass;
		invI2 = b2.m_invI;
		normalX = c.normal.x;
		normalY = c.normal.y;
		tangentX = normalY;
		tangentY = - normalX;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			p1X = b1_position.x + r1X;
			p1Y = b1_position.y + r1Y;
			p2X = b2_position.x + r2X;
			p2Y = b2_position.y + r2Y;
			dpX = p2X - p1X;
			dpY = p2Y - p1Y;
			separation = dpX * normalX + dpY * normalY + ccp.separation;
			minSeparation = (minSeparation < separation ? minSeparation : separation);
			C = beta * b2Math$b2Clamp$NNN(separation + 0.15, -6, 0.0);
			dImpulse = - ccp.normalMass * C;
			impulse0 = ccp.positionImpulse;
			a$0 = impulse0 + dImpulse;
			ccp.positionImpulse = (a$0 > 0.0 ? a$0 : 0.0);
			dImpulse = ccp.positionImpulse - impulse0;
			impulseX = dImpulse * normalX;
			impulseY = dImpulse * normalY;
			b1_position.x -= invMass1 * impulseX;
			b1_position.y -= invMass1 * impulseY;
			b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
			this$0 = b1.m_R;
			c$0 = Math.cos(b1_rotation);
			s$0 = Math.sin(b1_rotation);
			this$0.col1.x = c$0;
			this$0.col2.x = - s$0;
			this$0.col1.y = s$0;
			this$0.col2.y = c$0;
			b2_position.x += invMass2 * impulseX;
			b2_position.y += invMass2 * impulseY;
			b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
			this$1 = b2.m_R;
			c$1 = Math.cos(b2_rotation);
			s$1 = Math.sin(b2_rotation);
			this$1.col1.x = c$1;
			this$1.col2.x = - s$1;
			this$1.col1.y = s$1;
			this$1.col2.y = c$1;
		}
		b1.m_rotation = b1_rotation;
		b2.m_rotation = b2_rotation;
	}
	return minSeparation >= -0.15;
};

/**
 */
b2ContactSolver.prototype.PostSolve$ = function () {
	/** @type {!number} */
	var i;
	/** @type {b2ContactConstraint} */
	var c;
	/** @type {b2Manifold} */
	var m;
	/** @type {!number} */
	var j;
	/** @type {b2ContactPoint} */
	var mPoint;
	/** @type {b2ContactConstraintPoint} */
	var cPoint;
	for (i = 0; i < this.m_constraintCount; ++ i) {
		c = this.m_constraints[i];
		m = c.manifold;
		for (j = 0; j < c.pointCount; ++ j) {
			mPoint = m.points[j];
			cPoint = c.points[j];
			mPoint.normalImpulse = cPoint.normalImpulse;
			mPoint.tangentImpulse = cPoint.tangentImpulse;
		}
	}
};

/**
 * class b2NullContact extends b2Contact
 * @constructor
 */
function b2NullContact() {
}

b2NullContact.prototype = new b2Contact;
/**
 * @constructor
 * @param {b2Shape} s1
 * @param {b2Shape} s2
 */
function b2NullContact$Lb2Shape$Lb2Shape$(s1, s2) {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(s1, s2);
};

b2NullContact$Lb2Shape$Lb2Shape$.prototype = new b2NullContact;

/**
 * @constructor
 */
function b2NullContact$() {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(undefined, undefined);
};

b2NullContact$.prototype = new b2NullContact;

/**
 */
b2NullContact.prototype.Evaluate$ = function () {
};

/**
 * @return {Array.<undefined|b2Manifold>}
 */
b2NullContact.prototype.GetManifolds$ = function () {
	return undefined;
};

/**
 * class b2PolyAndCircleContact extends b2Contact
 * @constructor
 */
function b2PolyAndCircleContact() {
}

b2PolyAndCircleContact.prototype = new b2Contact;
/**
 * @constructor
 * @param {b2PolyShape} s1
 * @param {b2CircleShape} s2
 */
function b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$(s1, s2) {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(s1, s2);
	this.m_manifold = [ new b2Manifold$() ];
	b2Settings$b2Assert$B(this.m_shape1.m_type === 2);
	b2Settings$b2Assert$B(this.m_shape2.m_type === 0);
	this.m_manifold[0].pointCount = 0;
	this.m_manifold[0].points[0].normalImpulse = 0.0;
	this.m_manifold[0].points[0].tangentImpulse = 0.0;
};

b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$.prototype = new b2PolyAndCircleContact;

/**
 */
b2PolyAndCircleContact.prototype.Evaluate$ = function () {
	b2Collision$b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
	if (this.m_manifold[0].pointCount > 0) {
		this.m_manifoldCount = 1;
	} else {
		this.m_manifoldCount = 0;
	}
};

/**
 * @return {Array.<undefined|b2Manifold>}
 */
b2PolyAndCircleContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};

/**
 * @param {b2PolyShape} shape1
 * @param {b2CircleShape} shape2
 * @param {*} allocator
 * @return {b2PolyAndCircleContact}
 */
b2PolyAndCircleContact.Create$Lb2PolyShape$Lb2CircleShape$X = function (shape1, shape2, allocator) {
	return new b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$(shape1, shape2);
};

var b2PolyAndCircleContact$Create$Lb2PolyShape$Lb2CircleShape$X = b2PolyAndCircleContact.Create$Lb2PolyShape$Lb2CircleShape$X;

/**
 * @param {b2Contact} contact
 * @param {*} allocator
 */
b2PolyAndCircleContact.Destroy$Lb2Contact$X = function (contact, allocator) {
};

var b2PolyAndCircleContact$Destroy$Lb2Contact$X = b2PolyAndCircleContact.Destroy$Lb2Contact$X;

/**
 * class b2PolyContact extends b2Contact
 * @constructor
 */
function b2PolyContact() {
}

b2PolyContact.prototype = new b2Contact;
/**
 * @constructor
 * @param {b2PolyShape} s1
 * @param {b2PolyShape} s2
 */
function b2PolyContact$Lb2PolyShape$Lb2PolyShape$(s1, s2) {
	this.m_flags = 0;
	this.m_prev = undefined;
	this.m_next = undefined;
	this.m_node1 = undefined;
	this.m_node2 = undefined;
	this.m_shape1 = undefined;
	this.m_shape2 = undefined;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	this.initializer$Lb2Shape$Lb2Shape$(s1, s2);
	this.m0 = new b2Manifold$();
	this.m_manifold = [ new b2Manifold$() ];
	this.m_manifold[0].pointCount = 0;
};

b2PolyContact$Lb2PolyShape$Lb2PolyShape$.prototype = new b2PolyContact;

/**
 */
b2PolyContact.prototype.Evaluate$ = function () {
	/** @type {b2Manifold} */
	var tMani;
	/** @type {Array.<undefined|b2ContactPoint>} */
	var tPoints;
	/** @type {!number} */
	var k;
	/** @type {b2ContactPoint} */
	var tPoint;
	/** @type {b2ContactPoint} */
	var tPoint0;
	/** @type {Array.<undefined|!boolean>} */
	var match;
	/** @type {!number} */
	var i;
	/** @type {b2ContactPoint} */
	var cp;
	/** @type {!number} */
	var idKey;
	/** @type {!number} */
	var j;
	/** @type {b2ContactPoint} */
	var cp0;
	/** @type {b2ContactID} */
	var id0;
	/** @type {b2ContactID} */
	var this$0;
	/** @type {b2ContactID} */
	var id$0;
	/** @type {!number} */
	var value$0$0;
	tMani = this.m_manifold[0];
	tPoints = this.m0.points;
	for (k = 0; k < tMani.pointCount; k++) {
		tPoint = tPoints[k];
		tPoint0 = tMani.points[k];
		tPoint.normalImpulse = tPoint0.normalImpulse;
		tPoint.tangentImpulse = tPoint0.tangentImpulse;
		this$0 = tPoint0.id;
		id$0 = new b2ContactID$();
		value$0$0 = this$0._key;
		id$0._key = value$0$0;
		id$0.features._referenceFace = id$0._key & 0x000000ff;
		id$0.features._incidentEdge = (id$0._key & 0x0000ff00) >> 8 & 0x000000ff;
		id$0.features._incidentVertex = (id$0._key & 0x00ff0000) >> 16 & 0x000000ff;
		id$0.features._flip = (id$0._key & 0xff000000) >> 24 & 0x000000ff;
		tPoint.id = id$0;
	}
	this.m0.pointCount = tMani.pointCount;
	b2Collision$b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B(tMani, this.m_shape1, this.m_shape2, false);
	if (tMani.pointCount > 0) {
		match = [ false, false ];
		for (i = 0; i < tMani.pointCount; ++ i) {
			cp = tMani.points[i];
			cp.normalImpulse = 0.0;
			cp.tangentImpulse = 0.0;
			idKey = cp.id.key;
			for (j = 0; j < this.m0.pointCount; ++ j) {
				if (match[j] == true) {
					continue;
				}
				cp0 = this.m0.points[j];
				id0 = cp0.id;
				if (id0.key === idKey) {
					match[j] = true;
					cp.normalImpulse = cp0.normalImpulse;
					cp.tangentImpulse = cp0.tangentImpulse;
					break;
				}
			}
		}
		this.m_manifoldCount = 1;
	} else {
		this.m_manifoldCount = 0;
	}
};

/**
 * @return {Array.<undefined|b2Manifold>}
 */
b2PolyContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};

/**
 * @param {b2PolyShape} shape1
 * @param {b2PolyShape} shape2
 * @param {*} allocator
 * @return {b2PolyContact}
 */
b2PolyContact.Create$Lb2PolyShape$Lb2PolyShape$X = function (shape1, shape2, allocator) {
	return new b2PolyContact$Lb2PolyShape$Lb2PolyShape$(shape1, shape2);
};

var b2PolyContact$Create$Lb2PolyShape$Lb2PolyShape$X = b2PolyContact.Create$Lb2PolyShape$Lb2PolyShape$X;

/**
 * @param {b2Contact} contact
 * @param {*} allocator
 */
b2PolyContact.Destroy$Lb2Contact$X = function (contact, allocator) {
};

var b2PolyContact$Destroy$Lb2Contact$X = b2PolyContact.Destroy$Lb2Contact$X;

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

_Main.seed = 0;
b2Settings.USHRT_MAX = 0x0000ffff;
b2Settings.b2_pi = 3.141592653589793;
b2Settings.b2_massUnitsPerKilogram = 1.0;
b2Settings.b2_timeUnitsPerSecond = 1.0;
b2Settings.b2_lengthUnitsPerMeter = 30.0;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_maxShapesPerBody = 64;
b2Settings.b2_maxPolyVertices = 16;
b2Settings.b2_maxProxies = 1024;
b2Settings.b2_maxPairs = 8192;
b2Settings.b2_linearSlop = 0.15;
$__jsx_lazy_init(b2Settings, "b2_angularSlop", function () {
	return 2.0 / 180.0 * b2Settings.b2_pi;
});
b2Settings.b2_velocityThreshold = 30;
b2Settings.b2_maxLinearCorrection = 6;
$__jsx_lazy_init(b2Settings, "b2_maxAngularCorrection", function () {
	return 8.0 / 180.0 * b2Settings.b2_pi;
});
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5;
b2Settings.b2_linearSleepTolerance = 0.3;
b2Settings.b2_angularSleepTolerance = 0.011111111111111112;
$__jsx_lazy_init(b2Math, "tempVec2", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2Math, "tempVec3", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2Math, "tempVec4", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2Math, "tempVec5", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2Math, "tempMat", function () {
	return new b2Mat22$();
});
b2BroadPhase.s_validate = false;
b2BroadPhase.b2_invalid = 0x0000ffff;
$__jsx_lazy_init(b2BroadPhase, "b2_nullEdge", function () {
	return b2Settings.USHRT_MAX;
});
b2Collision.b2_nullFeature = 0x000000ff;
$__jsx_lazy_init(b2Collision, "b2CollidePolyTempVec", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2Pair, "b2_nullPair", function () {
	return b2Settings.USHRT_MAX;
});
$__jsx_lazy_init(b2Pair, "b2_nullProxy", function () {
	return b2Settings.USHRT_MAX;
});
$__jsx_lazy_init(b2Pair, "b2_tableCapacity", function () {
	return b2Settings.b2_maxPairs;
});
$__jsx_lazy_init(b2Pair, "b2_tableMask", function () {
	return b2Pair.b2_tableCapacity - 1;
});
b2Pair.e_pairBuffered = 0x0001;
b2Pair.e_pairRemoved = 0x0002;
b2Pair.e_pairFinal = 0x0004;
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;
$__jsx_lazy_init(b2PolyShape, "tempVec", function () {
	return new b2Vec2$();
});
$__jsx_lazy_init(b2PolyShape, "tAbsR", function () {
	return new b2Mat22$();
});
b2Body.e_staticFlag = 0x0001;
b2Body.e_frozenFlag = 0x0002;
b2Body.e_islandFlag = 0x0004;
b2Body.e_sleepFlag = 0x0008;
b2Body.e_allowSleepFlag = 0x0010;
b2Body.e_destroyFlag = 0x0020;
$__jsx_lazy_init(b2CollisionFilter, "b2_defaultFilter", function () {
	return new b2CollisionFilter$();
});
b2Island.m_positionIterationCount = 0;
b2World.s_enablePositionCorrection = true;
b2World.s_enableWarmStarting = true;
b2Contact.e_islandFlag = 0x0001;
b2Contact.e_destroyFlag = 0x0002;
b2Contact.s_registers = undefined;
b2Contact.s_initialized = false;
$__jsx_lazy_init(dom, "window", function () {
	return js.global.window;
});
js.global = (function () { return this; })();

var $__jsx_classMap = {
	"src/box2d.jsx": {
		_Main: _Main,
		_Main$: _Main$
	},
	"src/common/b2Settings.jsx": {
		b2Settings: b2Settings,
		b2Settings$: b2Settings$
	},
	"src/common/math/b2Mat22.jsx": {
		b2Mat22: b2Mat22,
		b2Mat22$NLb2Vec2$Lb2Vec2$: b2Mat22$NLb2Vec2$Lb2Vec2$,
		b2Mat22$N: b2Mat22$N,
		b2Mat22$: b2Mat22$
	},
	"src/common/math/b2Math.jsx": {
		b2Math: b2Math,
		b2Math$: b2Math$
	},
	"src/common/math/b2Vec2.jsx": {
		b2Vec2: b2Vec2,
		b2Vec2$: b2Vec2$,
		b2Vec2$NN: b2Vec2$NN
	},
	"src/collision/b2AABB.jsx": {
		b2AABB: b2AABB,
		b2AABB$: b2AABB$
	},
	"src/collision/b2Bound.jsx": {
		b2Bound: b2Bound,
		b2Bound$: b2Bound$
	},
	"src/collision/b2BoundValues.jsx": {
		b2BoundValues: b2BoundValues,
		b2BoundValues$: b2BoundValues$
	},
	"src/collision/b2BroadPhase.jsx": {
		b2BroadPhase: b2BroadPhase,
		b2BroadPhase$Lb2AABB$Lb2PairCallback$: b2BroadPhase$Lb2AABB$Lb2PairCallback$
	},
	"src/collision/b2BufferedPair.jsx": {
		b2BufferedPair: b2BufferedPair,
		b2BufferedPair$: b2BufferedPair$
	},
	"src/collision/b2Collision.jsx": {
		b2Collision: b2Collision,
		b2Collision$: b2Collision$
	},
	"src/collision/b2ContactID.jsx": {
		b2ContactID: b2ContactID,
		b2ContactID$: b2ContactID$
	},
	"src/collision/b2ContactPoint.jsx": {
		b2ContactPoint: b2ContactPoint,
		b2ContactPoint$: b2ContactPoint$
	},
	"src/collision/b2Manifold.jsx": {
		b2Manifold: b2Manifold,
		b2Manifold$: b2Manifold$
	},
	"src/collision/b2OBB.jsx": {
		b2OBB: b2OBB,
		b2OBB$: b2OBB$
	},
	"src/collision/b2Pair.jsx": {
		b2Pair: b2Pair,
		b2Pair$: b2Pair$
	},
	"src/collision/b2PairCallback.jsx": {
		b2PairCallback: b2PairCallback,
		b2PairCallback$: b2PairCallback$
	},
	"src/collision/b2PairManager.jsx": {
		b2PairManager: b2PairManager,
		b2PairManager$: b2PairManager$
	},
	"src/collision/b2Proxy.jsx": {
		b2Proxy: b2Proxy,
		b2Proxy$: b2Proxy$
	},
	"src/collision/ClipVertex.jsx": {
		ClipVertex: ClipVertex,
		ClipVertex$: ClipVertex$
	},
	"src/collision/Features.jsx": {
		Features: Features,
		Features$: Features$
	},
	"src/collision/shapes/b2MassData.jsx": {
		b2MassData: b2MassData,
		b2MassData$: b2MassData$
	},
	"src/collision/shapes/b2Shape.jsx": {
		b2Shape: b2Shape,
		b2Shape$Lb2ShapeDef$Lb2Body$: b2Shape$Lb2ShapeDef$Lb2Body$
	},
	"src/collision/shapes/b2PolyShape.jsx": {
		b2PolyShape: b2PolyShape,
		b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$: b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$
	},
	"src/collision/shapes/b2CircleShape.jsx": {
		b2CircleShape: b2CircleShape,
		b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$: b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$
	},
	"src/collision/shapes/b2ShapeDef.jsx": {
		b2ShapeDef: b2ShapeDef,
		b2ShapeDef$: b2ShapeDef$
	},
	"src/collision/shapes/b2PolyDef.jsx": {
		b2PolyDef: b2PolyDef,
		b2PolyDef$: b2PolyDef$
	},
	"src/collision/shapes/b2CircleDef.jsx": {
		b2CircleDef: b2CircleDef,
		b2CircleDef$: b2CircleDef$
	},
	"src/collision/shapes/b2BoxDef.jsx": {
		b2BoxDef: b2BoxDef,
		b2BoxDef$: b2BoxDef$
	},
	"src/dynamics/b2Body.jsx": {
		b2Body: b2Body,
		b2Body$Lb2BodyDef$Lb2World$: b2Body$Lb2BodyDef$Lb2World$
	},
	"src/dynamics/b2BodyDef.jsx": {
		b2BodyDef: b2BodyDef,
		b2BodyDef$: b2BodyDef$
	},
	"src/dynamics/b2CollisionFilter.jsx": {
		b2CollisionFilter: b2CollisionFilter,
		b2CollisionFilter$: b2CollisionFilter$
	},
	"src/dynamics/b2ContactManager.jsx": {
		b2ContactManager: b2ContactManager,
		b2ContactManager$: b2ContactManager$
	},
	"src/dynamics/b2Island.jsx": {
		b2Island: b2Island,
		b2Island$NNNX: b2Island$NNNX
	},
	"src/dynamics/b2TimeStep.jsx": {
		b2TimeStep: b2TimeStep,
		b2TimeStep$: b2TimeStep$
	},
	"src/dynamics/b2World.jsx": {
		b2World: b2World,
		b2World$Lb2AABB$Lb2Vec2$B: b2World$Lb2AABB$Lb2Vec2$B
	},
	"src/dynamics/contacts/b2Contact.jsx": {
		b2Contact: b2Contact,
		b2Contact$Lb2Shape$Lb2Shape$: b2Contact$Lb2Shape$Lb2Shape$,
		b2Contact$: b2Contact$
	},
	"src/dynamics/contacts/b2CircleContact.jsx": {
		b2CircleContact: b2CircleContact,
		b2CircleContact$Lb2CircleShape$Lb2CircleShape$: b2CircleContact$Lb2CircleShape$Lb2CircleShape$
	},
	"src/dynamics/contacts/b2ContactConstraint.jsx": {
		b2ContactConstraint: b2ContactConstraint,
		b2ContactConstraint$: b2ContactConstraint$
	},
	"src/dynamics/contacts/b2ContactConstraintPoint.jsx": {
		b2ContactConstraintPoint: b2ContactConstraintPoint,
		b2ContactConstraintPoint$: b2ContactConstraintPoint$
	},
	"src/dynamics/contacts/b2ContactNode.jsx": {
		b2ContactNode: b2ContactNode,
		b2ContactNode$: b2ContactNode$
	},
	"src/dynamics/contacts/b2ContactRegister.jsx": {
		b2ContactRegister: b2ContactRegister,
		b2ContactRegister$: b2ContactRegister$
	},
	"src/dynamics/contacts/b2ContactSolver.jsx": {
		b2ContactSolver: b2ContactSolver,
		b2ContactSolver$ALb2Contact$NX: b2ContactSolver$ALb2Contact$NX
	},
	"src/dynamics/contacts/b2NullContact.jsx": {
		b2NullContact: b2NullContact,
		b2NullContact$Lb2Shape$Lb2Shape$: b2NullContact$Lb2Shape$Lb2Shape$,
		b2NullContact$: b2NullContact$
	},
	"src/dynamics/contacts/b2PolyAndCircleContact.jsx": {
		b2PolyAndCircleContact: b2PolyAndCircleContact,
		b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$: b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$
	},
	"src/dynamics/contacts/b2PolyContact.jsx": {
		b2PolyContact: b2PolyContact,
		b2PolyContact$Lb2PolyShape$Lb2PolyShape$: b2PolyContact$Lb2PolyShape$Lb2PolyShape$
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


})();
