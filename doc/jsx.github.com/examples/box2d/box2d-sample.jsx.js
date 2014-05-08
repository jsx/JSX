// generatedy by JSX compiler 0.9.59 (2013-08-08 21:45:23 +0900; 45c866115f50499f6899410900427d146fd1f06e)
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
JSX.DEBUG = false;
function StopIteration() {
	Error.call(this);
	this.name = "StopIteration";
	if (Error.captureStackTrace) Error.captureStackTrace(this, StopIteration);
};

$__jsx_extend([StopIteration], Error);
function _Main() {
};

$__jsx_extend([_Main], Object);
function _Main$random$() {
	_Main.seed = _Main.seed * 713 + 17 & 0xFF;
	return _Main.seed / 256;
};

_Main.random$ = _Main$random$;

function _Main$drawWorld$Lb2World$LCanvasRenderingContext2D$(world, context) {
	var b;
	var s;
	for (b = world.m_bodyList; b != null; b = b.m_next) {
		for (s = b.m_shapeList; s != null; s = s.m_next) {
			_Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$(s, context);
		}
	}
};

_Main.drawWorld$Lb2World$LCanvasRenderingContext2D$ = _Main$drawWorld$Lb2World$LCanvasRenderingContext2D$;

function _Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$(shape, context) {
	var circle;
	var pos;
	var r;
	var segments;
	var theta;
	var dtheta;
	var i;
	var ax;
	var poly;
	var a$0;
	var a$2;
	var A$2;
	var v$2;
	var A$4;
	var v$4;
	var d$x$0;
	var d$y$0;
	var v$x$0;
	var v$y$0;
	var pos2$x$0;
	var pos2$y$0;
	var tV$x$0;
	var tV$y$0;
	var b$0$x$0;
	var b$0$y$0;
	var b$2$x$0;
	var b$2$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	context.strokeStyle = '#ffffff';
	context.beginPath();
	switch (shape.m_type) {
	case 0:
		circle = shape;
		pos = circle.m_position;
		r = circle.m_radius;
		segments = 16.0;
		theta = 0.0;
		dtheta = 0.39269908169872414;
		context.moveTo(pos.x + r, pos.y);
		for (i = 0; i < segments; i++) {
			d$x$0 = r * Math.cos(theta);
			d$y$0 = r * Math.sin(theta);
			v$x$0 = pos.x + d$x$0;
			v$y$0 = pos.y + d$y$0;
			context.lineTo(v$x$0, v$y$0);
			theta += dtheta;
		}
		context.lineTo(pos.x + r, pos.y);
		context.moveTo(pos.x, pos.y);
		ax = circle.m_R.col1;
		pos2$x$0 = pos.x + r * ax.x;
		pos2$y$0 = pos.y + r * ax.y;
		context.lineTo(pos2$x$0, pos2$y$0);
		break;
	case 2:
		poly = shape;
		a$0 = poly.m_position;
		A$2 = poly.m_R;
		v$2 = poly.m_vertices[0];
		b$0$x$0 = (col1$1 = A$2.col1).x * (x$1 = v$2.x) + (col2$1 = A$2.col2).x * (y$1 = v$2.y);
		b$0$y$0 = col1$1.y * x$1 + col2$1.y * y$1;
		tV$x$0 = a$0.x + b$0$x$0;
		tV$y$0 = a$0.y + b$0$y$0;
		context.moveTo(tV$x$0, tV$y$0);
		for (i = 0; i < poly.m_vertexCount; i++) {
			a$2 = poly.m_position;
			A$4 = poly.m_R;
			v$4 = poly.m_vertices[i];
			b$2$x$0 = (col1$0 = A$4.col1).x * (x$0 = v$4.x) + (col2$0 = A$4.col2).x * (y$0 = v$4.y);
			b$2$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
			v$x$0 = a$2.x + b$2$x$0;
			v$y$0 = a$2.y + b$2$y$0;
			context.lineTo(v$x$0, v$y$0);
		}
		context.lineTo(tV$x$0, tV$y$0);
		break;
	}
	context.stroke();
};

_Main.drawShape$Lb2Shape$LCanvasRenderingContext2D$ = _Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$;

function _Main$createWorld$() {
	var worldAABB;
	var gravity;
	var world;
	var this$0;
	var this$2;
	worldAABB = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this$0 = worldAABB.minVertex;
	this$0.x = -1000;
	this$0.y = -1000;
	this$2 = worldAABB.maxVertex;
	this$2.x = 1000;
	this$2.y = 1000;
	gravity = ({x: 0, y: 300});
	world = new b2World(worldAABB, gravity, true);
	_Main$createGround$Lb2World$(world);
	_Main$createBox$Lb2World$NNNN(world, 0, 0, 10, 1000);
	_Main$createBox$Lb2World$NNNN(world, 320, 0, 10, 1000);
	return world;
};

_Main.createWorld$ = _Main$createWorld$;

function _Main$createGround$Lb2World$(world) {
	var groundSd;
	var groundBd;
	var this$0;
	var i$0;
	var this$2;
	groundSd = new b2BoxDef();
	this$0 = groundSd.extents;
	this$0.x = 1000;
	this$0.y = 10;
	groundSd.restitution = 0.2;
	groundSd.friction = 0.2;
	groundBd = new b2BodyDef();
	for (i$0 = 0; i$0 < 64; ++ i$0) {
		if (groundBd.shapes[i$0] == null) {
			groundBd.shapes[i$0] = groundSd;
			break;
		}
	}
	this$2 = groundBd.position;
	this$2.x = -500;
	this$2.y = 400;
	return b2World$CreateBody$Lb2World$Lb2BodyDef$(world, groundBd);
};

_Main.createGround$Lb2World$ = _Main$createGround$Lb2World$;

function _Main$createBox$Lb2World$NNNN(world, x, y, width, height) {
	var boxSd;
	var boxBd;
	var this$0;
	var i$0;
	var this$2;
	boxSd = new b2BoxDef();
	this$0 = boxSd.extents;
	this$0.x = width;
	this$0.y = height;
	boxBd = new b2BodyDef();
	for (i$0 = 0; i$0 < 64; ++ i$0) {
		if (boxBd.shapes[i$0] == null) {
			boxBd.shapes[i$0] = boxSd;
			break;
		}
	}
	this$2 = boxBd.position;
	this$2.x = x;
	this$2.y = y;
	return b2World$CreateBody$Lb2World$Lb2BodyDef$(world, boxBd);
};

_Main.createBox$Lb2World$NNNN = _Main$createBox$Lb2World$NNNN;

function _Main$createMy$Lb2World$NNN(world, x, y, r) {
	var ballSd;
	var v;
	var i;
	var ballBd;
	var body;
	var this$0;
	var x$0;
	var y$0;
	var i$0;
	var this$2;
	ballSd = new b2PolyDef();
	ballSd.density = 1.0;
	ballSd.restitution = 0.8;
	v = 3 + ((_Main.seed = _Main.seed * 713 + 17 & 0xFF, _Main.seed / 256) * 5 | 0);
	ballSd.vertexCount = v;
	for (i = 0; i < v; i++) {
		this$0 = ballSd.vertices[i];
		x$0 = r * Math.cos(6.283185307179586 / v * i);
		y$0 = r * Math.sin(6.283185307179586 / v * i);
		this$0.x = x$0;
		this$0.y = y$0;
	}
	ballBd = new b2BodyDef();
	for (i$0 = 0; i$0 < 64; ++ i$0) {
		if (ballBd.shapes[i$0] == null) {
			ballBd.shapes[i$0] = ballSd;
			break;
		}
	}
	this$2 = ballBd.position;
	this$2.x = x;
	this$2.y = y;
	body = b2World$CreateBody$Lb2World$Lb2BodyDef$(world, ballBd);
	return body;
};

_Main.createMy$Lb2World$NNN = _Main$createMy$Lb2World$NNN;

function _Main$main$AS(args) {
	var canvas;
	var ctx;
	var world;
	var count;
	var i;
	var frame;
	var frameTotal;
	var last;
	var tick;
	dom.window.setTimeout((function () {
		dom.window.scrollTo(0, 0);
	}), 100);
	canvas = dom.document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	world = _Main$createWorld$();
	count = 50;
	for (i = 0; i < count; i++) {
		_Main$createMy$Lb2World$NNN(world, i * (270 / count) + 25, -200 + (_Main.seed = _Main.seed * 713 + 17 & 0xFF, _Main.seed / 256) * 300, 15 + (_Main.seed = _Main.seed * 713 + 17 & 0xFF, _Main.seed / 256) * 10);
	}
	frame = 0;
	frameTotal = 0;
	dom.window.setTimeout((function () {
		if (JSX.profilerIsRunning()) {
			JSX.postProfileResults("http://localhosrt:5001/post-profile");
		}
		console.log("ave. fps:" + (frameTotal / 10 + "") + " in the first 10 sec.");
	}), 10000);
	last = Date.now();
	function tick() {
		var now;
		var b$0;
		var s$0;
		frame++;
		frameTotal++;
		dom.window.setTimeout(tick, 0);
		b2World$Step$Lb2World$NN(world, 0.016666666666666666, 1);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for (b$0 = world.m_bodyList; b$0 != null; b$0 = b$0.m_next) {
			for (s$0 = b$0.m_shapeList; s$0 != null; s$0 = s$0.m_next) {
				_Main$drawShape$Lb2Shape$LCanvasRenderingContext2D$(s$0, ctx);
			}
		}
		now = Date.now();
		if (now - last > 1000) {
			dom.document.getElementById("fps").innerHTML = "fps:" + (frame + "");
			frame = 0;
			last = now;
		}
	}
	tick();
};

_Main.main = _Main$main$AS;
_Main.main$AS = _Main$main$AS;

function b2Settings() {
};

$__jsx_extend([b2Settings], Object);
function b2Settings$b2Assert$B(a) {
	if (! a) {
		debugger;
	}
};

b2Settings.b2Assert$B = b2Settings$b2Assert$B;

function b2Mat22(angle, c1, c2) {
	this.col1 = null;
	this.col2 = null;
	b2Mat22$initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$(this, angle, c1, c2);
};

function b2Mat22$0(angle) {
	this.col1 = null;
	this.col2 = null;
	b2Mat22$initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$(this, angle, null, null);
};

function b2Mat22$1() {
	this.col1 = null;
	this.col2 = null;
	b2Mat22$initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$(this, 0, null, null);
};

$__jsx_extend([b2Mat22, b2Mat22$0, b2Mat22$1], Object);
b2Mat22.prototype.initializer$NLb2Vec2$Lb2Vec2$ = function (angle, c1, c2) {
	var c;
	var s;
	var this$0;
	var this$2;
	var col1$0;
	var col2$0;
	this.col1 = ({x: 0, y: 0});
	this.col2 = ({x: 0, y: 0});
	if (c1 != null && c2 != null) {
		this$0 = this.col1;
		this$0.x = c1.x;
		this$0.y = c1.y;
		this$2 = this.col2;
		this$2.x = c2.x;
		this$2.y = c2.y;
	} else {
		c = Math.cos(angle);
		s = Math.sin(angle);
		(col1$0 = this.col1).x = c;
		(col2$0 = this.col2).x = - s;
		col1$0.y = s;
		col2$0.y = c;
	}
};


function b2Mat22$initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$($this, angle, c1, c2) {
	var c;
	var s;
	var this$0;
	var this$2;
	var col1$0;
	var col2$0;
	$this.col1 = ({x: 0, y: 0});
	$this.col2 = ({x: 0, y: 0});
	if (c1 != null && c2 != null) {
		this$0 = $this.col1;
		this$0.x = c1.x;
		this$0.y = c1.y;
		this$2 = $this.col2;
		this$2.x = c2.x;
		this$2.y = c2.y;
	} else {
		c = Math.cos(angle);
		s = Math.sin(angle);
		(col1$0 = $this.col1).x = c;
		(col2$0 = $this.col2).x = - s;
		col1$0.y = s;
		col2$0.y = c;
	}
};

b2Mat22.initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$ = b2Mat22$initializer$Lb2Mat22$NLb2Vec2$Lb2Vec2$;

b2Mat22.prototype.Set$N = function (angle) {
	var c;
	var s;
	var col1$0;
	var col2$0;
	c = Math.cos(angle);
	s = Math.sin(angle);
	(col1$0 = this.col1).x = c;
	(col2$0 = this.col2).x = - s;
	col1$0.y = s;
	col2$0.y = c;
};


function b2Mat22$Set$Lb2Mat22$N($this, angle) {
	var c;
	var s;
	var col1$0;
	var col2$0;
	c = Math.cos(angle);
	s = Math.sin(angle);
	(col1$0 = $this.col1).x = c;
	(col2$0 = $this.col2).x = - s;
	col1$0.y = s;
	col2$0.y = c;
};

b2Mat22.Set$Lb2Mat22$N = b2Mat22$Set$Lb2Mat22$N;

b2Mat22.prototype.SetVV$Lb2Vec2$Lb2Vec2$ = function (c1, c2) {
	var this$0;
	var this$2;
	this$0 = this.col1;
	this$0.x = c1.x;
	this$0.y = c1.y;
	this$2 = this.col2;
	this$2.x = c2.x;
	this$2.y = c2.y;
};


function b2Mat22$SetVV$Lb2Mat22$Lb2Vec2$Lb2Vec2$($this, c1, c2) {
	var this$0;
	var this$2;
	this$0 = $this.col1;
	this$0.x = c1.x;
	this$0.y = c1.y;
	this$2 = $this.col2;
	this$2.x = c2.x;
	this$2.y = c2.y;
};

b2Mat22.SetVV$Lb2Mat22$Lb2Vec2$Lb2Vec2$ = b2Mat22$SetVV$Lb2Mat22$Lb2Vec2$Lb2Vec2$;

b2Mat22.prototype.Copy$ = function () {
	return new b2Mat22(0, this.col1, this.col2);
};


function b2Mat22$Copy$Lb2Mat22$($this) {
	return new b2Mat22(0, $this.col1, $this.col2);
};

b2Mat22.Copy$Lb2Mat22$ = b2Mat22$Copy$Lb2Mat22$;

b2Mat22.prototype.SetM$Lb2Mat22$ = function (m) {
	var this$0;
	var v$0;
	var this$2;
	var v$2;
	this$0 = this.col1;
	v$0 = m.col1;
	this$0.x = v$0.x;
	this$0.y = v$0.y;
	this$2 = this.col2;
	v$2 = m.col2;
	this$2.x = v$2.x;
	this$2.y = v$2.y;
};


function b2Mat22$SetM$Lb2Mat22$Lb2Mat22$($this, m) {
	var this$0;
	var v$0;
	var this$2;
	var v$2;
	this$0 = $this.col1;
	v$0 = m.col1;
	this$0.x = v$0.x;
	this$0.y = v$0.y;
	this$2 = $this.col2;
	v$2 = m.col2;
	this$2.x = v$2.x;
	this$2.y = v$2.y;
};

b2Mat22.SetM$Lb2Mat22$Lb2Mat22$ = b2Mat22$SetM$Lb2Mat22$Lb2Mat22$;

b2Mat22.prototype.AddM$Lb2Mat22$ = function (m) {
	var col1$0;
	var col1$1;
	var col2$0;
	var col2$1;
	(col1$0 = this.col1).x += (col1$1 = m.col1).x;
	col1$0.y += col1$1.y;
	(col2$0 = this.col2).x += (col2$1 = m.col2).x;
	col2$0.y += col2$1.y;
};


function b2Mat22$AddM$Lb2Mat22$Lb2Mat22$($this, m) {
	var col1$0;
	var col1$1;
	var col2$0;
	var col2$1;
	(col1$0 = $this.col1).x += (col1$1 = m.col1).x;
	col1$0.y += col1$1.y;
	(col2$0 = $this.col2).x += (col2$1 = m.col2).x;
	col2$0.y += col2$1.y;
};

b2Mat22.AddM$Lb2Mat22$Lb2Mat22$ = b2Mat22$AddM$Lb2Mat22$Lb2Mat22$;

b2Mat22.prototype.SetIdentity$ = function () {
	var col1$0;
	var col2$0;
	(col1$0 = this.col1).x = 1.0;
	(col2$0 = this.col2).x = 0.0;
	col1$0.y = 0.0;
	col2$0.y = 1.0;
};


function b2Mat22$SetIdentity$Lb2Mat22$($this) {
	var col1$0;
	var col2$0;
	(col1$0 = $this.col1).x = 1.0;
	(col2$0 = $this.col2).x = 0.0;
	col1$0.y = 0.0;
	col2$0.y = 1.0;
};

b2Mat22.SetIdentity$Lb2Mat22$ = b2Mat22$SetIdentity$Lb2Mat22$;

b2Mat22.prototype.SetZero$ = function () {
	var col1$0;
	var col2$0;
	(col1$0 = this.col1).x = 0.0;
	(col2$0 = this.col2).x = 0.0;
	col1$0.y = 0.0;
	col2$0.y = 0.0;
};


function b2Mat22$SetZero$Lb2Mat22$($this) {
	var col1$0;
	var col2$0;
	(col1$0 = $this.col1).x = 0.0;
	(col2$0 = $this.col2).x = 0.0;
	col1$0.y = 0.0;
	col2$0.y = 0.0;
};

b2Mat22.SetZero$Lb2Mat22$ = b2Mat22$SetZero$Lb2Mat22$;

b2Mat22.prototype.Invert$Lb2Mat22$ = function (out) {
	var a;
	var b;
	var c;
	var d;
	var det;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	a = (col1$0 = this.col1).x;
	b = (col2$0 = this.col2).x;
	c = col1$0.y;
	d = col2$0.y;
	det = a * d - b * c;
	det = 1.0 / det;
	(col1$1 = out.col1).x = det * d;
	(col2$1 = out.col2).x = - det * b;
	col1$1.y = - det * c;
	col2$1.y = det * a;
	return out;
};


function b2Mat22$Invert$Lb2Mat22$Lb2Mat22$($this, out) {
	var a;
	var b;
	var c;
	var d;
	var det;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	a = (col1$0 = $this.col1).x;
	b = (col2$0 = $this.col2).x;
	c = col1$0.y;
	d = col2$0.y;
	det = a * d - b * c;
	det = 1.0 / det;
	(col1$1 = out.col1).x = det * d;
	(col2$1 = out.col2).x = - det * b;
	col1$1.y = - det * c;
	col2$1.y = det * a;
	return out;
};

b2Mat22.Invert$Lb2Mat22$Lb2Mat22$ = b2Mat22$Invert$Lb2Mat22$Lb2Mat22$;

b2Mat22.prototype.Solve$Lb2Vec2$NN = function (out, bX, bY) {
	var a11;
	var a12;
	var a21;
	var a22;
	var det;
	var col1$0;
	var col2$0;
	a11 = (col1$0 = this.col1).x;
	a12 = (col2$0 = this.col2).x;
	a21 = col1$0.y;
	a22 = col2$0.y;
	det = a11 * a22 - a12 * a21;
	det = 1.0 / det;
	out.x = det * (a22 * bX - a12 * bY);
	out.y = det * (a11 * bY - a21 * bX);
	return out;
};


function b2Mat22$Solve$Lb2Mat22$Lb2Vec2$NN($this, out, bX, bY) {
	var a11;
	var a12;
	var a21;
	var a22;
	var det;
	var col1$0;
	var col2$0;
	a11 = (col1$0 = $this.col1).x;
	a12 = (col2$0 = $this.col2).x;
	a21 = col1$0.y;
	a22 = col2$0.y;
	det = a11 * a22 - a12 * a21;
	det = 1.0 / det;
	out.x = det * (a22 * bX - a12 * bY);
	out.y = det * (a11 * bY - a21 * bX);
	return out;
};

b2Mat22.Solve$Lb2Mat22$Lb2Vec2$NN = b2Mat22$Solve$Lb2Mat22$Lb2Vec2$NN;

b2Mat22.prototype.Abs$ = function () {
	var this$0;
	var x$0$0;
	var x$2$0;
	var this$2;
	var x$0$2;
	var x$2$2;
	this$0 = this.col1;
	x$0$0 = this$0.x;
	this$0.x = (x$0$0 >= 0 ? x$0$0 : - x$0$0);
	x$2$0 = this$0.y;
	this$0.y = (x$2$0 >= 0 ? x$2$0 : - x$2$0);
	this$2 = this.col2;
	x$0$2 = this$2.x;
	this$2.x = (x$0$2 >= 0 ? x$0$2 : - x$0$2);
	x$2$2 = this$2.y;
	this$2.y = (x$2$2 >= 0 ? x$2$2 : - x$2$2);
};


function b2Mat22$Abs$Lb2Mat22$($this) {
	var this$0;
	var x$0$0;
	var x$2$0;
	var this$2;
	var x$0$2;
	var x$2$2;
	this$0 = $this.col1;
	x$0$0 = this$0.x;
	this$0.x = (x$0$0 >= 0 ? x$0$0 : - x$0$0);
	x$2$0 = this$0.y;
	this$0.y = (x$2$0 >= 0 ? x$2$0 : - x$2$0);
	this$2 = $this.col2;
	x$0$2 = this$2.x;
	this$2.x = (x$0$2 >= 0 ? x$0$2 : - x$0$2);
	x$2$2 = this$2.y;
	this$2.y = (x$2$2 >= 0 ? x$2$2 : - x$2$2);
};

b2Mat22.Abs$Lb2Mat22$ = b2Mat22$Abs$Lb2Mat22$;

function b2Math() {
};

$__jsx_extend([b2Math], Object);
function b2Math$b2IsValid$N(x) {
	return $__jsx_isFinite(x);
};

b2Math.b2IsValid$N = b2Math$b2IsValid$N;

function b2Math$b2Dot$Lb2Vec2$Lb2Vec2$(a, b) {
	return a.x * b.x + a.y * b.y;
};

b2Math.b2Dot$Lb2Vec2$Lb2Vec2$ = b2Math$b2Dot$Lb2Vec2$Lb2Vec2$;

function b2Math$b2CrossVV$Lb2Vec2$Lb2Vec2$(a, b) {
	return a.x * b.y - a.y * b.x;
};

b2Math.b2CrossVV$Lb2Vec2$Lb2Vec2$ = b2Math$b2CrossVV$Lb2Vec2$Lb2Vec2$;

function b2Math$b2CrossVF$Lb2Vec2$N(a, s) {
	return ({x: s * a.y, y: - s * a.x});
};

b2Math.b2CrossVF$Lb2Vec2$N = b2Math$b2CrossVF$Lb2Vec2$N;

function b2Math$b2CrossFV$NLb2Vec2$(s, a) {
	return ({x: - s * a.y, y: s * a.x});
};

b2Math.b2CrossFV$NLb2Vec2$ = b2Math$b2CrossFV$NLb2Vec2$;

function b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$(A, v) {
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	return ({x: (col1$0 = A.col1).x * (x$0 = v.x) + (col2$0 = A.col2).x * (y$0 = v.y), y: col1$0.y * x$0 + col2$0.y * y$0});
};

b2Math.b2MulMV$Lb2Mat22$Lb2Vec2$ = b2Math$b2MulMV$Lb2Mat22$Lb2Vec2$;

function b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$(A, v) {
	var b$0;
	var b$1;
	var x$0;
	var y$0;
	return ({x: (b$0 = A.col1, (x$0 = v.x) * b$0.x + (y$0 = v.y) * b$0.y), y: (b$1 = A.col2, x$0 * b$1.x + y$0 * b$1.y)});
};

b2Math.b2MulTMV$Lb2Mat22$Lb2Vec2$ = b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$;

function b2Math$AddVV$Lb2Vec2$Lb2Vec2$(a, b) {
	return ({x: a.x + b.x, y: a.y + b.y});
};

b2Math.AddVV$Lb2Vec2$Lb2Vec2$ = b2Math$AddVV$Lb2Vec2$Lb2Vec2$;

function b2Math$SubtractVV$Lb2Vec2$Lb2Vec2$(a, b) {
	return ({x: a.x - b.x, y: a.y - b.y});
};

b2Math.SubtractVV$Lb2Vec2$Lb2Vec2$ = b2Math$SubtractVV$Lb2Vec2$Lb2Vec2$;

function b2Math$MulFV$NLb2Vec2$(s, a) {
	return ({x: s * a.x, y: s * a.y});
};

b2Math.MulFV$NLb2Vec2$ = b2Math$MulFV$NLb2Vec2$;

function b2Math$AddMM$Lb2Mat22$Lb2Mat22$(A, B) {
	var a$0;
	var b$0;
	var a$1;
	var b$1;
	return new b2Mat22(0, (a$0 = A.col1, b$0 = B.col1, ({x: a$0.x + b$0.x, y: a$0.y + b$0.y})), (a$1 = A.col2, b$1 = B.col2, ({x: a$1.x + b$1.x, y: a$1.y + b$1.y})));
};

b2Math.AddMM$Lb2Mat22$Lb2Mat22$ = b2Math$AddMM$Lb2Mat22$Lb2Mat22$;

function b2Math$b2MulMM$Lb2Mat22$Lb2Mat22$(A, B) {
	var v$0;
	var v$1;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	return new b2Mat22(0, (v$0 = B.col1, ({x: (col1$0 = A.col1).x * (x$0 = v$0.x) + (col2$0 = A.col2).x * (y$0 = v$0.y), y: col1$0.y * x$0 + col2$0.y * y$0})), (v$1 = B.col2, ({x: (col1$1 = A.col1).x * (x$1 = v$1.x) + (col2$1 = A.col2).x * (y$1 = v$1.y), y: col1$1.y * x$1 + col2$1.y * y$1})));
};

b2Math.b2MulMM$Lb2Mat22$Lb2Mat22$ = b2Math$b2MulMM$Lb2Mat22$Lb2Mat22$;

function b2Math$b2MulTMM$Lb2Mat22$Lb2Mat22$(A, B) {
	var c1;
	var c2;
	var C;
	var a$0;
	var b$0;
	var a$1;
	var a$2;
	var b$2;
	var a$3;
	var col1$0;
	var col2$0;
	c1 = ({x: (a$0 = A.col1, b$0 = col1$0 = B.col1, a$0.x * b$0.x + a$0.y * b$0.y), y: (a$1 = A.col2, col1$0, a$1.x * col1$0.x + a$1.y * col1$0.y)});
	c2 = ({x: (a$2 = A.col1, b$2 = col2$0 = B.col2, a$2.x * b$2.x + a$2.y * b$2.y), y: (a$3 = A.col2, col2$0, a$3.x * col2$0.x + a$3.y * col2$0.y)});
	C = new b2Mat22(0, c1, c2);
	return C;
};

b2Math.b2MulTMM$Lb2Mat22$Lb2Mat22$ = b2Math$b2MulTMM$Lb2Mat22$Lb2Mat22$;

function b2Math$b2Abs$N(a) {
	return (a >= 0 ? a : - a);
};

b2Math.b2Abs$N = b2Math$b2Abs$N;

function b2Math$b2AbsV$Lb2Vec2$(a) {
	var a$0;
	var a$1;
	return ({x: (a$0 = a.x, a$0 >= 0 ? a$0 : - a$0), y: (a$1 = a.y, a$1 >= 0 ? a$1 : - a$1)});
};

b2Math.b2AbsV$Lb2Vec2$ = b2Math$b2AbsV$Lb2Vec2$;

function b2Math$b2AbsM$Lb2Mat22$(A) {
	var a$0;
	var a$0$0;
	var a$1$0;
	var a$1;
	var a$0$1;
	var a$1$1;
	return new b2Mat22(0, (a$0 = A.col1, ({x: (a$0$0 = a$0.x, a$0$0 >= 0 ? a$0$0 : - a$0$0), y: (a$1$0 = a$0.y, a$1$0 >= 0 ? a$1$0 : - a$1$0)})), (a$1 = A.col2, ({x: (a$0$1 = a$1.x, a$0$1 >= 0 ? a$0$1 : - a$0$1), y: (a$1$1 = a$1.y, a$1$1 >= 0 ? a$1$1 : - a$1$1)})));
};

b2Math.b2AbsM$Lb2Mat22$ = b2Math$b2AbsM$Lb2Mat22$;

function b2Math$b2Min$NN(a, b) {
	return (a < b ? a : b);
};

b2Math.b2Min$NN = b2Math$b2Min$NN;

function b2Math$b2MinV$Lb2Vec2$Lb2Vec2$(a, b) {
	var a$0;
	var b$0;
	var a$1;
	var b$1;
	return ({x: (a$0 = a.x, b$0 = b.x, a$0 < b$0 ? a$0 : b$0), y: (a$1 = a.y, b$1 = b.y, a$1 < b$1 ? a$1 : b$1)});
};

b2Math.b2MinV$Lb2Vec2$Lb2Vec2$ = b2Math$b2MinV$Lb2Vec2$Lb2Vec2$;

function b2Math$b2Max$NN(a, b) {
	return (a > b ? a : b);
};

b2Math.b2Max$NN = b2Math$b2Max$NN;

function b2Math$b2MaxV$Lb2Vec2$Lb2Vec2$(a, b) {
	var a$0;
	var b$0;
	var a$1;
	var b$1;
	return ({x: (a$0 = a.x, b$0 = b.x, a$0 > b$0 ? a$0 : b$0), y: (a$1 = a.y, b$1 = b.y, a$1 > b$1 ? a$1 : b$1)});
};

b2Math.b2MaxV$Lb2Vec2$Lb2Vec2$ = b2Math$b2MaxV$Lb2Vec2$Lb2Vec2$;

function b2Math$b2Clamp$NNN(a, low, high) {
	var b$0;
	b$0 = (a < high ? a : high);
	return (low > b$0 ? low : b$0);
};

b2Math.b2Clamp$NNN = b2Math$b2Clamp$NNN;

function b2Math$b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$(a, low, high) {
	return b2Math$b2MaxV$Lb2Vec2$Lb2Vec2$(low, b2Math$b2MinV$Lb2Vec2$Lb2Vec2$(a, high));
};

b2Math.b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$ = b2Math$b2ClampV$Lb2Vec2$Lb2Vec2$Lb2Vec2$;

function b2Math$b2Random$() {
	return Math.random() * 2 - 1;
};

b2Math.b2Random$ = b2Math$b2Random$;

function b2Math$b2NextPowerOfTwo$N(x) {
	x |= x >> 1 & 0x7FFFFFFF;
	x |= x >> 2 & 0x3FFFFFFF;
	x |= x >> 4 & 0x0FFFFFFF;
	x |= x >> 8 & 0x00FFFFFF;
	x |= x >> 16 & 0x0000FFFF;
	return x + 1;
};

b2Math.b2NextPowerOfTwo$N = b2Math$b2NextPowerOfTwo$N;

function b2Math$b2IsPowerOfTwo$N(x) {
	return x > 0 && (x & x - 1) === 0;
};

b2Math.b2IsPowerOfTwo$N = b2Math$b2IsPowerOfTwo$N;

function b2Vec2() {
	this.x = 0;
	this.y = 0;
};

function b2Vec2$0(x, y) {
	this.x = x;
	this.y = y;
};

$__jsx_extend([b2Vec2, b2Vec2$0], Object);
function b2Vec2$SetZero$Lb2Vec2$($this) {
	$this.x = 0;
	$this.y = 0;
};

b2Vec2.SetZero$Lb2Vec2$ = b2Vec2$SetZero$Lb2Vec2$;

function b2Vec2$Set$Lb2Vec2$NN($this, x, y) {
	$this.x = x;
	$this.y = y;
};

b2Vec2.Set$Lb2Vec2$NN = b2Vec2$Set$Lb2Vec2$NN;

function b2Vec2$SetV$Lb2Vec2$Lb2Vec2$($this, v) {
	$this.x = v.x;
	$this.y = v.y;
};

b2Vec2.SetV$Lb2Vec2$Lb2Vec2$ = b2Vec2$SetV$Lb2Vec2$Lb2Vec2$;

function b2Vec2$Negative$Lb2Vec2$($this) {
	return ({x: - $this.x, y: - $this.y});
};

b2Vec2.Negative$Lb2Vec2$ = b2Vec2$Negative$Lb2Vec2$;

function b2Vec2$Copy$Lb2Vec2$($this) {
	return ({x: $this.x, y: $this.y});
};

b2Vec2.Copy$Lb2Vec2$ = b2Vec2$Copy$Lb2Vec2$;

function b2Vec2$Add$Lb2Vec2$Lb2Vec2$($this, v) {
	$this.x += v.x;
	$this.y += v.y;
};

b2Vec2.Add$Lb2Vec2$Lb2Vec2$ = b2Vec2$Add$Lb2Vec2$Lb2Vec2$;

function b2Vec2$Subtract$Lb2Vec2$Lb2Vec2$($this, v) {
	$this.x -= v.x;
	$this.y -= v.y;
};

b2Vec2.Subtract$Lb2Vec2$Lb2Vec2$ = b2Vec2$Subtract$Lb2Vec2$Lb2Vec2$;

function b2Vec2$Multiply$Lb2Vec2$N($this, a) {
	$this.x *= a;
	$this.y *= a;
};

b2Vec2.Multiply$Lb2Vec2$N = b2Vec2$Multiply$Lb2Vec2$N;

function b2Vec2$MulM$Lb2Vec2$Lb2Mat22$($this, A) {
	var tX;
	var col1$0;
	var col2$0;
	var y$0;
	tX = $this.x;
	$this.x = (col1$0 = A.col1).x * tX + (col2$0 = A.col2).x * (y$0 = $this.y);
	$this.y = col1$0.y * tX + col2$0.y * y$0;
};

b2Vec2.MulM$Lb2Vec2$Lb2Mat22$ = b2Vec2$MulM$Lb2Vec2$Lb2Mat22$;

function b2Vec2$MulTM$Lb2Vec2$Lb2Mat22$($this, A) {
	var tX;
	var b$0;
	var b$2;
	var x$0;
	var y$0;
	b$0 = A.col1;
	tX = (x$0 = $this.x) * b$0.x + (y$0 = $this.y) * b$0.y;
	b$2 = A.col2;
	$this.y = x$0 * b$2.x + y$0 * b$2.y;
	$this.x = tX;
};

b2Vec2.MulTM$Lb2Vec2$Lb2Mat22$ = b2Vec2$MulTM$Lb2Vec2$Lb2Mat22$;

function b2Vec2$CrossVF$Lb2Vec2$N($this, s) {
	var tX;
	tX = $this.x;
	$this.x = s * $this.y;
	$this.y = - s * tX;
};

b2Vec2.CrossVF$Lb2Vec2$N = b2Vec2$CrossVF$Lb2Vec2$N;

function b2Vec2$CrossFV$Lb2Vec2$N($this, s) {
	var tX;
	tX = $this.x;
	$this.x = - s * $this.y;
	$this.y = s * tX;
};

b2Vec2.CrossFV$Lb2Vec2$N = b2Vec2$CrossFV$Lb2Vec2$N;

function b2Vec2$MinV$Lb2Vec2$Lb2Vec2$($this, b) {
	$this.x = ($this.x < b.x ? $this.x : b.x);
	$this.y = ($this.y < b.y ? $this.y : b.y);
};

b2Vec2.MinV$Lb2Vec2$Lb2Vec2$ = b2Vec2$MinV$Lb2Vec2$Lb2Vec2$;

function b2Vec2$MaxV$Lb2Vec2$Lb2Vec2$($this, b) {
	$this.x = ($this.x > b.x ? $this.x : b.x);
	$this.y = ($this.y > b.y ? $this.y : b.y);
};

b2Vec2.MaxV$Lb2Vec2$Lb2Vec2$ = b2Vec2$MaxV$Lb2Vec2$Lb2Vec2$;

function b2Vec2$Abs$Lb2Vec2$($this) {
	var x$0;
	var x$2;
	x$0 = $this.x;
	$this.x = (x$0 >= 0 ? x$0 : - x$0);
	x$2 = $this.y;
	$this.y = (x$2 >= 0 ? x$2 : - x$2);
};

b2Vec2.Abs$Lb2Vec2$ = b2Vec2$Abs$Lb2Vec2$;

function b2Vec2$Length$Lb2Vec2$($this) {
	var x$0;
	var y$0;
	return Math.sqrt((x$0 = $this.x) * x$0 + (y$0 = $this.y) * y$0);
};

b2Vec2.Length$Lb2Vec2$ = b2Vec2$Length$Lb2Vec2$;

function b2Vec2$Normalize$Lb2Vec2$($this) {
	var length;
	var invLength;
	var x$0;
	var y$0;
	length = Math.sqrt((x$0 = $this.x) * x$0 + (y$0 = $this.y) * y$0);
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	invLength = 1.0 / length;
	$this.x *= invLength;
	$this.y *= invLength;
	return length;
};

b2Vec2.Normalize$Lb2Vec2$ = b2Vec2$Normalize$Lb2Vec2$;

function b2Vec2$IsValid$Lb2Vec2$($this) {
	var x$0;
	var x$1;
	return (x$0 = $this.x, $__jsx_isFinite(x$0)) && (x$1 = $this.y, $__jsx_isFinite(x$1));
};

b2Vec2.IsValid$Lb2Vec2$ = b2Vec2$IsValid$Lb2Vec2$;

function b2Vec2$Make$NN(x, y) {
	return ({x: x, y: y});
};

b2Vec2.Make$NN = b2Vec2$Make$NN;

function ClipVertex() {
	this.v = ({x: 0, y: 0});
	this.id = new b2ContactID();
};

$__jsx_extend([ClipVertex], Object);
function Features() {
	this._referenceFace = 0;
	this._incidentEdge = 0;
	this._incidentVertex = 0;
	this._flip = 0;
	this._m_id = null;
	this.referenceFace = 0;
	this.incidentEdge = 0;
	this.incidentVertex = 0;
	this.flip = 0;
};

$__jsx_extend([Features], Object);
function Features$set_referenceFace$LFeatures$N($this, value) {
	var _m_id$0;
	var _referenceFace$0;
	_referenceFace$0 = $this._referenceFace = value;
	(_m_id$0 = $this._m_id)._key = _m_id$0._key & 0xffffff00 | _referenceFace$0 & 0x000000ff;
};

Features.set_referenceFace$LFeatures$N = Features$set_referenceFace$LFeatures$N;

function Features$get_referenceFace$LFeatures$($this) {
	return $this._referenceFace;
};

Features.get_referenceFace$LFeatures$ = Features$get_referenceFace$LFeatures$;

function Features$set_incidentEdge$LFeatures$N($this, value) {
	var _m_id$0;
	var _incidentEdge$0;
	_incidentEdge$0 = $this._incidentEdge = value;
	(_m_id$0 = $this._m_id)._key = _m_id$0._key & 0xffff00ff | _incidentEdge$0 << 8 & 0x0000ff00;
};

Features.set_incidentEdge$LFeatures$N = Features$set_incidentEdge$LFeatures$N;

function Features$get_incidentEdge$LFeatures$($this) {
	return $this._incidentEdge;
};

Features.get_incidentEdge$LFeatures$ = Features$get_incidentEdge$LFeatures$;

function Features$set_incidentVertex$LFeatures$N($this, value) {
	var _m_id$0;
	var _incidentVertex$0;
	_incidentVertex$0 = $this._incidentVertex = value;
	(_m_id$0 = $this._m_id)._key = _m_id$0._key & 0xff00ffff | _incidentVertex$0 << 16 & 0x00ff0000;
};

Features.set_incidentVertex$LFeatures$N = Features$set_incidentVertex$LFeatures$N;

function Features$get_incidentVertex$LFeatures$($this) {
	return $this._incidentVertex;
};

Features.get_incidentVertex$LFeatures$ = Features$get_incidentVertex$LFeatures$;

function Features$set_flip$LFeatures$N($this, value) {
	var _m_id$0;
	var _flip$0;
	_flip$0 = $this._flip = value;
	(_m_id$0 = $this._m_id)._key = _m_id$0._key & 0x00ffffff | _flip$0 << 24 & 0xff000000;
};

Features.set_flip$LFeatures$N = Features$set_flip$LFeatures$N;

function Features$get_flip$LFeatures$($this) {
	return $this._flip;
};

Features.get_flip$LFeatures$ = Features$get_flip$LFeatures$;

function b2AABB() {
	this.minVertex = ({x: 0, y: 0});
	this.maxVertex = ({x: 0, y: 0});
};

$__jsx_extend([b2AABB], Object);
function b2AABB$IsValid$Lb2AABB$($this) {
	var dX;
	var dY;
	var valid;
	var x$0$0;
	var x$1$0;
	var this$1;
	var x$0$1;
	var x$1$1;
	var maxVertex$0;
	var minVertex$0;
	dX = (maxVertex$0 = $this.maxVertex).x;
	dY = maxVertex$0.y;
	dX -= (minVertex$0 = $this.minVertex).x;
	dY -= minVertex$0.y;
	valid = dX >= 0.0 && dY >= 0.0;
	valid = valid && (minVertex$0, (x$0$0 = minVertex$0.x, $__jsx_isFinite(x$0$0)) && (x$1$0 = minVertex$0.y, $__jsx_isFinite(x$1$0))) && (this$1 = $this.maxVertex, (x$0$1 = this$1.x, $__jsx_isFinite(x$0$1)) && (x$1$1 = this$1.y, $__jsx_isFinite(x$1$1)));
	return valid;
};

b2AABB.IsValid$Lb2AABB$ = b2AABB$IsValid$Lb2AABB$;

function b2Bound() {
	this.value = 0;
	this.proxyId = 0;
	this.stabbingCount = 0;
};

$__jsx_extend([b2Bound], Object);
function b2Bound$IsLower$Lb2Bound$($this) {
	return ($this.value & 1) === 0;
};

b2Bound.IsLower$Lb2Bound$ = b2Bound$IsLower$Lb2Bound$;

function b2Bound$IsUpper$Lb2Bound$($this) {
	return ($this.value & 1) === 1;
};

b2Bound.IsUpper$Lb2Bound$ = b2Bound$IsUpper$Lb2Bound$;

function b2Bound$Swap$Lb2Bound$Lb2Bound$($this, b) {
	var tempValue;
	var tempProxyId;
	var tempStabbingCount;
	tempValue = $this.value;
	tempProxyId = $this.proxyId;
	tempStabbingCount = $this.stabbingCount;
	$this.value = b.value;
	$this.proxyId = b.proxyId;
	$this.stabbingCount = b.stabbingCount;
	b.value = tempValue;
	b.proxyId = tempProxyId;
	b.stabbingCount = tempStabbingCount;
};

b2Bound.Swap$Lb2Bound$Lb2Bound$ = b2Bound$Swap$Lb2Bound$Lb2Bound$;

function b2BoundValues() {
	this.lowerValues = [ 0, 0 ];
	this.upperValues = [ 0, 0 ];
};

$__jsx_extend([b2BoundValues], Object);
function b2BroadPhase(worldAABB, callback) {
	var i;
	var j;
	var dX;
	var dY;
	var tProxy;
	var this$0;
	var next$0;
	var next$2;
	var m_queryResults$0;
	var m_proxyPool$0;
	var m_bounds$0;
	var m_queryResults$1;
	var maxVertex$0;
	var minVertex$0;
	var m_quantizationFactor$0;
	this.m_pairManager = null;
	this.m_proxyPool = null;
	this.m_freeProxy = 0;
	this.m_bounds = null;
	this.m_queryResultCount = 0;
	this.m_worldAABB = null;
	this.m_quantizationFactor = null;
	this.m_proxyCount = 0;
	this.m_timeStamp = 0;
	m_queryResults$0 = this.m_queryResults = [  ];
	m_queryResults$0.length = 1024;
	this.m_pairManager = new b2PairManager();
	m_proxyPool$0 = this.m_proxyPool = [  ];
	m_proxyPool$0.length = 8192;
	m_bounds$0 = this.m_bounds = [  ];
	m_bounds$0.length = 2048;
	m_queryResults$1 = this.m_queryResults = [  ];
	m_queryResults$1.length = 1024;
	this.m_quantizationFactor = ({x: 0, y: 0});
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
			this.m_bounds[i][j] = ({value: 0, proxyId: 0, stabbingCount: 0});
		}
	}
	dX = (maxVertex$0 = worldAABB.maxVertex).x;
	dY = maxVertex$0.y;
	dX -= (minVertex$0 = worldAABB.minVertex).x;
	dY -= minVertex$0.y;
	(m_quantizationFactor$0 = this.m_quantizationFactor).x = 0x0000ffff / dX;
	m_quantizationFactor$0.y = 0x0000ffff / dY;
	for (i = 0; i < 1023; ++ i) {
		tProxy = ({lowerBounds: [ 0, 0 ], upperBounds: [ 0, 0 ], overlapCount: 0, timeStamp: 0, userData: null});
		this.m_proxyPool[i] = tProxy;
		next$0 = i + 1;
		tProxy.lowerBounds[0] = next$0;
		tProxy.timeStamp = 0;
		tProxy.overlapCount = 0x0000ffff;
		tProxy.userData = null;
	}
	tProxy = ({lowerBounds: [ 0, 0 ], upperBounds: [ 0, 0 ], overlapCount: 0, timeStamp: 0, userData: null});
	this.m_proxyPool[1023] = tProxy;
	next$2 = b2Pair.b2_nullProxy;
	tProxy.lowerBounds[0] = next$2;
	tProxy.timeStamp = 0;
	tProxy.overlapCount = 0x0000ffff;
	tProxy.userData = null;
	this.m_freeProxy = 0;
	this.m_timeStamp = 1;
	this.m_queryResultCount = 0;
};

$__jsx_extend([b2BroadPhase], Object);
b2BroadPhase.prototype.InRange$Lb2AABB$ = function (aabb) {
	var dX;
	var dY;
	var d2X;
	var d2Y;
	var minVertex$0;
	var maxVertex$0;
	var m_worldAABB$0;
	var minVertex$1;
	var maxVertex$1;
	dX = (minVertex$0 = aabb.minVertex).x;
	dY = minVertex$0.y;
	dX -= (maxVertex$0 = (m_worldAABB$0 = this.m_worldAABB).maxVertex).x;
	dY -= maxVertex$0.y;
	d2X = (minVertex$1 = m_worldAABB$0.minVertex).x;
	d2Y = minVertex$1.y;
	d2X -= (maxVertex$1 = aabb.maxVertex).x;
	d2Y -= maxVertex$1.y;
	dX = (dX > d2X ? dX : d2X);
	dY = (dY > d2Y ? dY : d2Y);
	return (dX > dY ? dX : dY) < 0.0;
};


function b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$($this, aabb) {
	var dX;
	var dY;
	var d2X;
	var d2Y;
	var minVertex$0;
	var maxVertex$0;
	var m_worldAABB$0;
	var minVertex$1;
	var maxVertex$1;
	dX = (minVertex$0 = aabb.minVertex).x;
	dY = minVertex$0.y;
	dX -= (maxVertex$0 = (m_worldAABB$0 = $this.m_worldAABB).maxVertex).x;
	dY -= maxVertex$0.y;
	d2X = (minVertex$1 = m_worldAABB$0.minVertex).x;
	d2Y = minVertex$1.y;
	d2X -= (maxVertex$1 = aabb.maxVertex).x;
	d2Y -= maxVertex$1.y;
	dX = (dX > d2X ? dX : d2X);
	dY = (dY > d2Y ? dY : d2Y);
	return (dX > dY ? dX : dY) < 0.0;
};

b2BroadPhase.InRange$Lb2BroadPhase$Lb2AABB$ = b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$;

b2BroadPhase.prototype.GetProxy$N = function (proxyId) {
	var this$0;
	return (proxyId === b2Pair.b2_nullProxy || (this$0 = this.m_proxyPool[proxyId], this$0.overlapCount !== 0x0000ffff) === false ? null : this.m_proxyPool[proxyId]);
};


function b2BroadPhase$GetProxy$Lb2BroadPhase$N($this, proxyId) {
	var this$0;
	return (proxyId === b2Pair.b2_nullProxy || (this$0 = $this.m_proxyPool[proxyId], this$0.overlapCount !== 0x0000ffff) === false ? null : $this.m_proxyPool[proxyId]);
};

b2BroadPhase.GetProxy$Lb2BroadPhase$N = b2BroadPhase$GetProxy$Lb2BroadPhase$N;

b2BroadPhase.prototype.CreateProxy$Lb2AABB$X = function (aabb, userData) {
	var index;
	var proxy;
	var proxyId;
	var boundCount;
	var lowerValues;
	var upperValues;
	var axis;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerIndexOut;
	var upperIndexOut;
	var tArr;
	var j;
	var tEnd;
	var tBound1;
	var tBound2;
	var tIndex;
	var proxy2;
	var i;
	var this$0;
	var i$0;
	index = 0;
	proxyId = this.m_freeProxy;
	proxy = this.m_proxyPool[proxyId];
	this.m_freeProxy = proxy.lowerBounds[0];
	proxy.overlapCount = 0;
	proxy.userData = userData;
	boundCount = 2 * this.m_proxyCount;
	lowerValues = [  ];
	upperValues = [  ];
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$(this, lowerValues, upperValues, aabb);
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		lowerIndex = 0;
		upperIndex = 0;
		lowerIndexOut = [ 0 ];
		upperIndexOut = [ 0 ];
		b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN(this, lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
		lowerIndex = lowerIndexOut[0];
		upperIndex = upperIndexOut[0];
		tArr = [  ];
		j = 0;
		tEnd = boundCount;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
		b2PairManager$AddBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, this.m_queryResults[i]);
	}
	b2PairManager$Commit$Lb2PairManager$(this.m_pairManager);
	this.m_queryResultCount = 0;
	if (this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			this.m_proxyPool[i$0].timeStamp = 0;
		}
		this.m_timeStamp = 1;
	} else {
		++ this.m_timeStamp;
	}
	return proxyId;
};


function b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X($this, aabb, userData) {
	var index;
	var proxy;
	var proxyId;
	var boundCount;
	var lowerValues;
	var upperValues;
	var axis;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerIndexOut;
	var upperIndexOut;
	var tArr;
	var j;
	var tEnd;
	var tBound1;
	var tBound2;
	var tIndex;
	var proxy2;
	var i;
	var this$0;
	var i$0;
	index = 0;
	proxyId = $this.m_freeProxy;
	proxy = $this.m_proxyPool[proxyId];
	$this.m_freeProxy = proxy.lowerBounds[0];
	proxy.overlapCount = 0;
	proxy.userData = userData;
	boundCount = 2 * $this.m_proxyCount;
	lowerValues = [  ];
	upperValues = [  ];
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$($this, lowerValues, upperValues, aabb);
	for (axis = 0; axis < 2; ++ axis) {
		bounds = $this.m_bounds[axis];
		lowerIndex = 0;
		upperIndex = 0;
		lowerIndexOut = [ 0 ];
		upperIndexOut = [ 0 ];
		b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN($this, lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
		lowerIndex = lowerIndexOut[0];
		upperIndex = upperIndexOut[0];
		tArr = [  ];
		j = 0;
		tEnd = boundCount;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			proxy2 = $this.m_proxyPool[bounds[index].proxyId];
			this$0 = bounds[index];
			if ((this$0.value & 1) === 0) {
				proxy2.lowerBounds[axis] = index;
			} else {
				proxy2.upperBounds[axis] = index;
			}
		}
	}
	++ $this.m_proxyCount;
	for (i = 0; i < $this.m_queryResultCount; ++ i) {
		b2PairManager$AddBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, $this.m_queryResults[i]);
	}
	b2PairManager$Commit$Lb2PairManager$($this.m_pairManager);
	$this.m_queryResultCount = 0;
	if ($this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			$this.m_proxyPool[i$0].timeStamp = 0;
		}
		$this.m_timeStamp = 1;
	} else {
		++ $this.m_timeStamp;
	}
	return proxyId;
};

b2BroadPhase.CreateProxy$Lb2BroadPhase$Lb2AABB$X = b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X;

b2BroadPhase.prototype.DestroyProxy$N = function (proxyId) {
	var proxy;
	var boundCount;
	var axis;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerValue;
	var upperValue;
	var tArr;
	var j;
	var tEnd;
	var tBound1;
	var tBound2;
	var tIndex;
	var index;
	var proxy2;
	var index2;
	var i;
	var this$0;
	var i$0;
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
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
		b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN(this, [ 0 ], [ 0 ], lowerValue, upperValue, bounds, boundCount - 2, axis);
	}
	for (i = 0; i < this.m_queryResultCount; ++ i) {
		b2PairManager$RemoveBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, this.m_queryResults[i]);
	}
	b2PairManager$Commit$Lb2PairManager$(this.m_pairManager);
	this.m_queryResultCount = 0;
	if (this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			this.m_proxyPool[i$0].timeStamp = 0;
		}
		this.m_timeStamp = 1;
	} else {
		++ this.m_timeStamp;
	}
	proxy.userData = null;
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


function b2BroadPhase$DestroyProxy$Lb2BroadPhase$N($this, proxyId) {
	var proxy;
	var boundCount;
	var axis;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerValue;
	var upperValue;
	var tArr;
	var j;
	var tEnd;
	var tBound1;
	var tBound2;
	var tIndex;
	var index;
	var proxy2;
	var index2;
	var i;
	var this$0;
	var i$0;
	var next$0;
	proxy = $this.m_proxyPool[proxyId];
	boundCount = 2 * $this.m_proxyCount;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = $this.m_bounds[axis];
		lowerIndex = proxy.lowerBounds[axis];
		upperIndex = proxy.upperBounds[axis];
		lowerValue = bounds[lowerIndex].value;
		upperValue = bounds[upperIndex].value;
		tArr = [  ];
		j = 0;
		tEnd = upperIndex - lowerIndex - 1;
		for (j = 0; j < tEnd; j++) {
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			tArr[j] = ({value: 0, proxyId: 0, stabbingCount: 0});
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
			proxy2 = $this.m_proxyPool[bounds[index].proxyId];
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
		b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN($this, [ 0 ], [ 0 ], lowerValue, upperValue, bounds, boundCount - 2, axis);
	}
	for (i = 0; i < $this.m_queryResultCount; ++ i) {
		b2PairManager$RemoveBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, $this.m_queryResults[i]);
	}
	b2PairManager$Commit$Lb2PairManager$($this.m_pairManager);
	$this.m_queryResultCount = 0;
	if ($this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			$this.m_proxyPool[i$0].timeStamp = 0;
		}
		$this.m_timeStamp = 1;
	} else {
		++ $this.m_timeStamp;
	}
	proxy.userData = null;
	proxy.overlapCount = 0x0000ffff;
	proxy.lowerBounds[0] = 0x0000ffff;
	proxy.lowerBounds[1] = 0x0000ffff;
	proxy.upperBounds[0] = 0x0000ffff;
	proxy.upperBounds[1] = 0x0000ffff;
	next$0 = $this.m_freeProxy;
	proxy.lowerBounds[0] = next$0;
	$this.m_freeProxy = proxyId;
	-- $this.m_proxyCount;
};

b2BroadPhase.DestroyProxy$Lb2BroadPhase$N = b2BroadPhase$DestroyProxy$Lb2BroadPhase$N;

b2BroadPhase.prototype.MoveProxy$NLb2AABB$ = function (proxyId, aabb) {
	var axis;
	var index;
	var bound;
	var prevBound;
	var nextBound;
	var nextProxyId;
	var nextProxy;
	var boundCount;
	var proxy;
	var newValues;
	var oldValues;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerValue;
	var upperValue;
	var deltaLower;
	var deltaUpper;
	var prevProxyId;
	var prevProxy;
	var proxyId$0;
	axis = 0;
	index = 0;
	nextProxyId = 0;
	if (proxyId === b2Pair.b2_nullProxy || 1024 <= proxyId) {
		return;
	}
	if (b2AABB$IsValid$Lb2AABB$(aabb) === false) {
		return;
	}
	boundCount = 2 * this.m_proxyCount;
	proxy = this.m_proxyPool[proxyId];
	newValues = ({lowerValues: [ 0, 0 ], upperValues: [ 0, 0 ]});
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$(this, newValues.lowerValues, newValues.upperValues, aabb);
	oldValues = ({lowerValues: [ 0, 0 ], upperValues: [ 0, 0 ]});
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
				prevProxyId = proxyId$0 = prevBound.proxyId;
				prevProxy = this.m_proxyPool[proxyId$0];
				prevBound.stabbingCount++;
				if (((prevBound.value & 1) === 1) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$(this, newValues, prevProxy)) {
						b2PairManager$AddBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, prevProxyId);
					}
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				} else {
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				}
				proxy.lowerBounds[axis]--;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, prevBound);
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
				if (((nextBound.value & 1) === 0) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$(this, newValues, nextProxy)) {
						b2PairManager$AddBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, nextProxyId);
					}
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				} else {
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				}
				proxy.upperBounds[axis]++;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, nextBound);
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
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$(this, oldValues, nextProxy)) {
						b2PairManager$RemoveBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, nextProxyId);
					}
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				} else {
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				}
				proxy.lowerBounds[axis]++;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, nextBound);
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
				if (((prevBound.value & 1) === 0) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$(this, oldValues, prevProxy)) {
						b2PairManager$RemoveBufferedPair$Lb2PairManager$NN(this.m_pairManager, proxyId, prevProxyId);
					}
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				} else {
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				}
				proxy.upperBounds[axis]--;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, prevBound);
				index--;
			}
		}
	}
};


function b2BroadPhase$MoveProxy$Lb2BroadPhase$NLb2AABB$($this, proxyId, aabb) {
	var axis;
	var index;
	var bound;
	var prevBound;
	var nextBound;
	var nextProxyId;
	var nextProxy;
	var boundCount;
	var proxy;
	var newValues;
	var oldValues;
	var bounds;
	var lowerIndex;
	var upperIndex;
	var lowerValue;
	var upperValue;
	var deltaLower;
	var deltaUpper;
	var prevProxyId;
	var prevProxy;
	var proxyId$0;
	axis = 0;
	index = 0;
	nextProxyId = 0;
	if (proxyId === b2Pair.b2_nullProxy || 1024 <= proxyId) {
		return;
	}
	if (b2AABB$IsValid$Lb2AABB$(aabb) === false) {
		return;
	}
	boundCount = 2 * $this.m_proxyCount;
	proxy = $this.m_proxyPool[proxyId];
	newValues = ({lowerValues: [ 0, 0 ], upperValues: [ 0, 0 ]});
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$($this, newValues.lowerValues, newValues.upperValues, aabb);
	oldValues = ({lowerValues: [ 0, 0 ], upperValues: [ 0, 0 ]});
	for (axis = 0; axis < 2; ++ axis) {
		oldValues.lowerValues[axis] = $this.m_bounds[axis][proxy.lowerBounds[axis]].value;
		oldValues.upperValues[axis] = $this.m_bounds[axis][proxy.upperBounds[axis]].value;
	}
	for (axis = 0; axis < 2; ++ axis) {
		bounds = $this.m_bounds[axis];
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
				prevProxyId = proxyId$0 = prevBound.proxyId;
				prevProxy = $this.m_proxyPool[proxyId$0];
				prevBound.stabbingCount++;
				if (((prevBound.value & 1) === 1) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$($this, newValues, prevProxy)) {
						b2PairManager$AddBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, prevProxyId);
					}
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				} else {
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				}
				proxy.lowerBounds[axis]--;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, prevBound);
				-- index;
			}
		}
		if (deltaUpper > 0) {
			index = upperIndex;
			while (index < boundCount - 1 && bounds[index + 1].value <= upperValue) {
				bound = bounds[index];
				nextBound = bounds[index + 1];
				nextProxyId = nextBound.proxyId;
				nextProxy = $this.m_proxyPool[nextProxyId];
				nextBound.stabbingCount++;
				if (((nextBound.value & 1) === 0) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$($this, newValues, nextProxy)) {
						b2PairManager$AddBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, nextProxyId);
					}
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				} else {
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				}
				proxy.upperBounds[axis]++;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, nextBound);
				index++;
			}
		}
		if (deltaLower > 0) {
			index = lowerIndex;
			while (index < boundCount - 1 && bounds[index + 1].value <= lowerValue) {
				bound = bounds[index];
				nextBound = bounds[index + 1];
				nextProxyId = nextBound.proxyId;
				nextProxy = $this.m_proxyPool[nextProxyId];
				nextBound.stabbingCount--;
				if ((nextBound.value & 1) === 1) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$($this, oldValues, nextProxy)) {
						b2PairManager$RemoveBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, nextProxyId);
					}
					nextProxy.upperBounds[axis]--;
					bound.stabbingCount--;
				} else {
					nextProxy.lowerBounds[axis]--;
					bound.stabbingCount++;
				}
				proxy.lowerBounds[axis]++;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, nextBound);
				index++;
			}
		}
		if (deltaUpper < 0) {
			index = upperIndex;
			while (index > 0 && upperValue < bounds[index - 1].value) {
				bound = bounds[index];
				prevBound = bounds[index - 1];
				prevProxyId = prevBound.proxyId;
				prevProxy = $this.m_proxyPool[prevProxyId];
				prevBound.stabbingCount--;
				if (((prevBound.value & 1) === 0) === true) {
					if (b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$($this, oldValues, prevProxy)) {
						b2PairManager$RemoveBufferedPair$Lb2PairManager$NN($this.m_pairManager, proxyId, prevProxyId);
					}
					prevProxy.lowerBounds[axis]++;
					bound.stabbingCount--;
				} else {
					prevProxy.upperBounds[axis]++;
					bound.stabbingCount++;
				}
				proxy.upperBounds[axis]--;
				b2Bound$Swap$Lb2Bound$Lb2Bound$(bound, prevBound);
				index--;
			}
		}
	}
};

b2BroadPhase.MoveProxy$Lb2BroadPhase$NLb2AABB$ = b2BroadPhase$MoveProxy$Lb2BroadPhase$NLb2AABB$;

b2BroadPhase.prototype.Commit$ = function () {
	b2PairManager$Commit$Lb2PairManager$(this.m_pairManager);
};


function b2BroadPhase$Commit$Lb2BroadPhase$($this) {
	b2PairManager$Commit$Lb2PairManager$($this.m_pairManager);
};

b2BroadPhase.Commit$Lb2BroadPhase$ = b2BroadPhase$Commit$Lb2BroadPhase$;

b2BroadPhase.prototype.QueryAABB$Lb2AABB$AXN = function (aabb, userData, maxCount) {
	var lowerValues;
	var upperValues;
	var lowerIndexOut;
	var upperIndexOut;
	var count;
	var i;
	var proxy;
	var i$0;
	lowerValues = [  ];
	upperValues = [  ];
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$(this, lowerValues, upperValues, aabb);
	lowerIndexOut = [ 0 ];
	upperIndexOut = [ 0 ];
	b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN(this, lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
	b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN(this, lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
	count = 0;
	for (i = 0; i < this.m_queryResultCount && count < maxCount; (++ i, ++ count)) {
		proxy = this.m_proxyPool[this.m_queryResults[i]];
		userData[i] = proxy.userData;
	}
	this.m_queryResultCount = 0;
	if (this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			this.m_proxyPool[i$0].timeStamp = 0;
		}
		this.m_timeStamp = 1;
	} else {
		++ this.m_timeStamp;
	}
	return count;
};


function b2BroadPhase$QueryAABB$Lb2BroadPhase$Lb2AABB$AXN($this, aabb, userData, maxCount) {
	var lowerValues;
	var upperValues;
	var lowerIndexOut;
	var upperIndexOut;
	var count;
	var i;
	var proxy;
	var i$0;
	lowerValues = [  ];
	upperValues = [  ];
	b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$($this, lowerValues, upperValues, aabb);
	lowerIndexOut = [ 0 ];
	upperIndexOut = [ 0 ];
	b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN($this, lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], $this.m_bounds[0], 2 * $this.m_proxyCount, 0);
	b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN($this, lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], $this.m_bounds[1], 2 * $this.m_proxyCount, 1);
	count = 0;
	for (i = 0; i < $this.m_queryResultCount && count < maxCount; (++ i, ++ count)) {
		proxy = $this.m_proxyPool[$this.m_queryResults[i]];
		userData[i] = proxy.userData;
	}
	$this.m_queryResultCount = 0;
	if ($this.m_timeStamp === 0x0000ffff) {
		for (i$0 = 0; i$0 < 1024; ++ i$0) {
			$this.m_proxyPool[i$0].timeStamp = 0;
		}
		$this.m_timeStamp = 1;
	} else {
		++ $this.m_timeStamp;
	}
	return count;
};

b2BroadPhase.QueryAABB$Lb2BroadPhase$Lb2AABB$AXN = b2BroadPhase$QueryAABB$Lb2BroadPhase$Lb2AABB$AXN;

b2BroadPhase.prototype.Validate$ = function () {
	var axis;
	var bounds;
	var boundCount;
	var stabbingCount;
	var i;
	var bound;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = this.m_bounds[axis];
		boundCount = 2 * this.m_proxyCount;
		stabbingCount = 0;
		for (i = 0; i < boundCount; ++ i) {
			bound = bounds[i];
			if (((bound.value & 1) === 0) === true) {
				stabbingCount++;
			} else {
				stabbingCount--;
			}
		}
	}
};


function b2BroadPhase$Validate$Lb2BroadPhase$($this) {
	var axis;
	var bounds;
	var boundCount;
	var stabbingCount;
	var i;
	var bound;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = $this.m_bounds[axis];
		boundCount = 2 * $this.m_proxyCount;
		stabbingCount = 0;
		for (i = 0; i < boundCount; ++ i) {
			bound = bounds[i];
			if (((bound.value & 1) === 0) === true) {
				stabbingCount++;
			} else {
				stabbingCount--;
			}
		}
	}
};

b2BroadPhase.Validate$Lb2BroadPhase$ = b2BroadPhase$Validate$Lb2BroadPhase$;

b2BroadPhase.prototype.ComputeBounds$ANANLb2AABB$ = function (lowerValues, upperValues, aabb) {
	var minVertexX;
	var minVertexY;
	var maxVertexX;
	var maxVertexY;
	var b$0;
	var b$2;
	var b$4;
	var b$6;
	var b$8;
	var b$10;
	var b$12;
	var b$14;
	var minVertex$0;
	var maxVertex$0;
	minVertexX = (minVertex$0 = aabb.minVertex).x;
	minVertexY = minVertex$0.y;
	b$0 = this.m_worldAABB.maxVertex.x;
	minVertexX = (minVertexX < b$0 ? minVertexX : b$0);
	b$2 = this.m_worldAABB.maxVertex.y;
	minVertexY = (minVertexY < b$2 ? minVertexY : b$2);
	b$4 = this.m_worldAABB.minVertex.x;
	minVertexX = (minVertexX > b$4 ? minVertexX : b$4);
	b$6 = this.m_worldAABB.minVertex.y;
	minVertexY = (minVertexY > b$6 ? minVertexY : b$6);
	maxVertexX = (maxVertex$0 = aabb.maxVertex).x;
	maxVertexY = maxVertex$0.y;
	b$8 = this.m_worldAABB.maxVertex.x;
	maxVertexX = (maxVertexX < b$8 ? maxVertexX : b$8);
	b$10 = this.m_worldAABB.maxVertex.y;
	maxVertexY = (maxVertexY < b$10 ? maxVertexY : b$10);
	b$12 = this.m_worldAABB.minVertex.x;
	maxVertexX = (maxVertexX > b$12 ? maxVertexX : b$12);
	b$14 = this.m_worldAABB.minVertex.y;
	maxVertexY = (maxVertexY > b$14 ? maxVertexY : b$14);
	lowerValues[0] = this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.minVertex.x) & 65534;
	upperValues[0] = this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues[1] = this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.minVertex.y) & 65534;
	upperValues[1] = this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
};


function b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$($this, lowerValues, upperValues, aabb) {
	var minVertexX;
	var minVertexY;
	var maxVertexX;
	var maxVertexY;
	var b$0;
	var b$2;
	var b$4;
	var b$6;
	var b$8;
	var b$10;
	var b$12;
	var b$14;
	var minVertex$0;
	var maxVertex$0;
	minVertexX = (minVertex$0 = aabb.minVertex).x;
	minVertexY = minVertex$0.y;
	b$0 = $this.m_worldAABB.maxVertex.x;
	minVertexX = (minVertexX < b$0 ? minVertexX : b$0);
	b$2 = $this.m_worldAABB.maxVertex.y;
	minVertexY = (minVertexY < b$2 ? minVertexY : b$2);
	b$4 = $this.m_worldAABB.minVertex.x;
	minVertexX = (minVertexX > b$4 ? minVertexX : b$4);
	b$6 = $this.m_worldAABB.minVertex.y;
	minVertexY = (minVertexY > b$6 ? minVertexY : b$6);
	maxVertexX = (maxVertex$0 = aabb.maxVertex).x;
	maxVertexY = maxVertex$0.y;
	b$8 = $this.m_worldAABB.maxVertex.x;
	maxVertexX = (maxVertexX < b$8 ? maxVertexX : b$8);
	b$10 = $this.m_worldAABB.maxVertex.y;
	maxVertexY = (maxVertexY < b$10 ? maxVertexY : b$10);
	b$12 = $this.m_worldAABB.minVertex.x;
	maxVertexX = (maxVertexX > b$12 ? maxVertexX : b$12);
	b$14 = $this.m_worldAABB.minVertex.y;
	maxVertexY = (maxVertexY > b$14 ? maxVertexY : b$14);
	lowerValues[0] = $this.m_quantizationFactor.x * (minVertexX - $this.m_worldAABB.minVertex.x) & 65534;
	upperValues[0] = $this.m_quantizationFactor.x * (maxVertexX - $this.m_worldAABB.minVertex.x) & 0x0000ffff | 1;
	lowerValues[1] = $this.m_quantizationFactor.y * (minVertexY - $this.m_worldAABB.minVertex.y) & 65534;
	upperValues[1] = $this.m_quantizationFactor.y * (maxVertexY - $this.m_worldAABB.minVertex.y) & 0x0000ffff | 1;
};

b2BroadPhase.ComputeBounds$Lb2BroadPhase$ANANLb2AABB$ = b2BroadPhase$ComputeBounds$Lb2BroadPhase$ANANLb2AABB$;

b2BroadPhase.prototype.TestOverlap$Lb2BoundValues$Lb2Proxy$ = function (b, p) {
	var axis;
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


function b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$($this, b, p) {
	var axis;
	var bounds;
	for (axis = 0; axis < 2; ++ axis) {
		bounds = $this.m_bounds[axis];
		if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value) {
			return false;
		}
		if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value) {
			return false;
		}
	}
	return true;
};

b2BroadPhase.TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$ = b2BroadPhase$TestOverlap$Lb2BroadPhase$Lb2BoundValues$Lb2Proxy$;

b2BroadPhase.prototype.Query$ANANNNALb2Bound$NN = function (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
	var lowerQuery;
	var upperQuery;
	var j;
	var i;
	var s;
	var proxy;
	var this$0;
	var this$1;
	lowerQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, lowerValue);
	upperQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, upperValue);
	for (j = lowerQuery; j < upperQuery; ++ j) {
		this$0 = bounds[j];
		if ((this$0.value & 1) === 0) {
			b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N(this, bounds[j].proxyId);
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
					b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N(this, bounds[i].proxyId);
					-- s;
				}
			}
			-- i;
		}
	}
	lowerQueryOut[0] = lowerQuery;
	upperQueryOut[0] = upperQuery;
};


function b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN($this, lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
	var lowerQuery;
	var upperQuery;
	var j;
	var i;
	var s;
	var proxy;
	var this$0;
	var this$1;
	lowerQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, lowerValue);
	upperQuery = b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, boundCount, upperValue);
	for (j = lowerQuery; j < upperQuery; ++ j) {
		this$0 = bounds[j];
		if ((this$0.value & 1) === 0) {
			b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N($this, bounds[j].proxyId);
		}
	}
	if (lowerQuery > 0) {
		i = lowerQuery - 1;
		s = bounds[i].stabbingCount;
		while (s !== 0) {
			this$1 = bounds[i];
			if ((this$1.value & 1) === 0) {
				proxy = $this.m_proxyPool[bounds[i].proxyId];
				if (lowerQuery <= proxy.upperBounds[axis]) {
					b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N($this, bounds[i].proxyId);
					-- s;
				}
			}
			-- i;
		}
	}
	lowerQueryOut[0] = lowerQuery;
	upperQueryOut[0] = upperQuery;
};

b2BroadPhase.Query$Lb2BroadPhase$ANANNNALb2Bound$NN = b2BroadPhase$Query$Lb2BroadPhase$ANANNNALb2Bound$NN;

b2BroadPhase.prototype.IncrementOverlapCount$N = function (proxyId) {
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


function b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N($this, proxyId) {
	var proxy;
	proxy = $this.m_proxyPool[proxyId];
	if (proxy.timeStamp < $this.m_timeStamp) {
		proxy.timeStamp = $this.m_timeStamp;
		proxy.overlapCount = 1;
	} else {
		proxy.overlapCount = 2;
		$this.m_queryResults[$this.m_queryResultCount] = proxyId;
		++ $this.m_queryResultCount;
	}
};

b2BroadPhase.IncrementOverlapCount$Lb2BroadPhase$N = b2BroadPhase$IncrementOverlapCount$Lb2BroadPhase$N;

b2BroadPhase.prototype.IncrementTimeStamp$ = function () {
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


function b2BroadPhase$IncrementTimeStamp$Lb2BroadPhase$($this) {
	var i;
	if ($this.m_timeStamp === 0x0000ffff) {
		for (i = 0; i < 1024; ++ i) {
			$this.m_proxyPool[i].timeStamp = 0;
		}
		$this.m_timeStamp = 1;
	} else {
		++ $this.m_timeStamp;
	}
};

b2BroadPhase.IncrementTimeStamp$Lb2BroadPhase$ = b2BroadPhase$IncrementTimeStamp$Lb2BroadPhase$;

function b2BroadPhase$BinarySearch$ALb2Bound$NN(bounds, count, value) {
	var low;
	var high;
	var mid;
	low = 0;
	high = count - 1;
	while (low <= high) {
		mid = Math.floor((low + high) / 2);
		if (bounds[mid].value > value) {
			high = mid - 1;
		} else if (bounds[mid].value < value) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	return low;
};

b2BroadPhase.BinarySearch$ALb2Bound$NN = b2BroadPhase$BinarySearch$ALb2Bound$NN;

function b2BufferedPair() {
	this.proxyId1 = 0;
	this.proxyId2 = 0;
};

$__jsx_extend([b2BufferedPair], Object);
function b2Collision() {
};

$__jsx_extend([b2Collision], Object);
function b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N(vOut, vIn, normal, offset) {
	var numOut;
	var vIn0;
	var vIn1;
	var distance0;
	var distance1;
	var interp;
	var tVec;
	var b$0;
	var b$1;
	var x$0;
	var y$0;
	var x$1;
	var y$1;
	numOut = 0;
	vIn0 = vIn[0].v;
	vIn1 = vIn[1].v;
	distance0 = (b$0 = vIn[0].v, (x$0 = normal.x) * b$0.x + (y$0 = normal.y) * b$0.y) - offset;
	distance1 = (b$1 = vIn[1].v, x$0 * b$1.x + y$0 * b$1.y) - offset;
	if (distance0 <= 0.0) {
		vOut[numOut++] = vIn[0];
	}
	if (distance1 <= 0.0) {
		vOut[numOut++] = vIn[1];
	}
	if (distance0 * distance1 < 0.0) {
		interp = distance0 / (distance0 - distance1);
		tVec = vOut[numOut].v;
		tVec.x = (x$1 = vIn0.x) + interp * (vIn1.x - x$1);
		tVec.y = (y$1 = vIn0.y) + interp * (vIn1.y - y$1);
		if (distance0 > 0.0) {
			vOut[numOut].id = vIn[0].id;
		} else {
			vOut[numOut].id = vIn[1].id;
		}
		++ numOut;
	}
	return numOut;
};

b2Collision.ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N = b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N;

function b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$(poly1, edge1, poly2) {
	var vert1s;
	var count2;
	var vert2s;
	var normalX;
	var normalY;
	var tX;
	var tMat;
	var normalLocal2X;
	var normalLocal2Y;
	var vertexIndex2;
	var minDot;
	var i;
	var tVec;
	var dot;
	var v1X;
	var v1Y;
	var v2X;
	var v2Y;
	var separation;
	var m_normals$0;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	var m_position$0;
	var col1$2;
	var col2$2;
	var m_position$1;
	var col1$3;
	var col2$3;
	vert1s = poly1.m_vertices;
	count2 = poly2.m_vertexCount;
	vert2s = poly2.m_vertices;
	normalX = (m_normals$0 = poly1.m_normals)[edge1].x;
	normalY = m_normals$0[edge1].y;
	tX = normalX;
	tMat = poly1.m_R;
	normalX = (col1$0 = tMat.col1).x * normalX + (col2$0 = tMat.col2).x * normalY;
	normalY = col1$0.y * tX + col2$0.y * normalY;
	tMat = poly2.m_R;
	tX = normalX * (col1$1 = tMat.col1).x + normalY * col1$1.y;
	normalLocal2Y = normalX * (col2$1 = tMat.col2).x + normalY * col2$1.y;
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
	v1X = (m_position$0 = poly1.m_position).x + ((col1$2 = tMat.col1).x * vert1s[edge1].x + (col2$2 = tMat.col2).x * vert1s[edge1].y);
	v1Y = m_position$0.y + (col1$2.y * vert1s[edge1].x + col2$2.y * vert1s[edge1].y);
	tMat = poly2.m_R;
	v2X = (m_position$1 = poly2.m_position).x + ((col1$3 = tMat.col1).x * vert2s[vertexIndex2].x + (col2$3 = tMat.col2).x * vert2s[vertexIndex2].y);
	v2Y = m_position$1.y + (col1$3.y * vert2s[vertexIndex2].x + col2$3.y * vert2s[vertexIndex2].y);
	v2X -= v1X;
	v2Y -= v1Y;
	separation = v2X * normalX + v2Y * normalY;
	return separation;
};

b2Collision.EdgeSeparation$Lb2PolyShape$NLb2PolyShape$ = b2Collision$EdgeSeparation$Lb2PolyShape$NLb2PolyShape$;

function b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B(edgeIndex, poly1, poly2, conservative) {
	var count1;
	var dX;
	var dY;
	var dLocal1X;
	var dLocal1Y;
	var edge;
	var maxDot;
	var i;
	var dot;
	var s;
	var prevEdge;
	var sPrev;
	var nextEdge;
	var sNext;
	var bestEdge;
	var bestSeparation;
	var increment;
	var m_normals$0;
	var m_position$0;
	var m_position$1;
	var col1$0;
	var m_R$0;
	var col2$0;
	count1 = poly1.m_vertexCount;
	dX = (m_position$0 = poly2.m_position).x - (m_position$1 = poly1.m_position).x;
	dY = m_position$0.y - m_position$1.y;
	dLocal1X = dX * (col1$0 = (m_R$0 = poly1.m_R).col1).x + dY * col1$0.y;
	dLocal1Y = dX * (col2$0 = m_R$0.col2).x + dY * col2$0.y;
	edge = 0;
	maxDot = - Number.MAX_VALUE;
	for (i = 0; i < count1; ++ i) {
		dot = (m_normals$0 = poly1.m_normals)[i].x * dLocal1X + m_normals$0[i].y * dLocal1Y;
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
	} else if (sNext > s) {
		increment = 1;
		bestEdge = nextEdge;
		bestSeparation = sNext;
	} else {
		edgeIndex[0] = edge;
		return s;
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

b2Collision.FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B = b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B;

function b2Collision$FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$(c, poly1, edge1, poly2) {
	var count1;
	var vert1s;
	var count2;
	var vert2s;
	var vertex12;
	var tVec;
	var normal1Local1X;
	var normal1Local1Y;
	var tX;
	var invLength;
	var normal1X;
	var normal1Y;
	var tMat;
	var normal1Local2X;
	var normal1Local2Y;
	var vertex21;
	var vertex22;
	var minDot;
	var i;
	var i1;
	var i2;
	var normal2Local2X;
	var normal2Local2Y;
	var dot;
	var tClip;
	var v$0;
	var v$2;
	var v$4;
	var v$6;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	var features$0;
	var features$1;
	count1 = poly1.m_vertexCount;
	vert1s = poly1.m_vertices;
	count2 = poly2.m_vertexCount;
	vert2s = poly2.m_vertices;
	vertex12 = (edge1 + 1 === count1 ? 0 : edge1 + 1);
	tVec = vert1s[vertex12];
	normal1Local1X = tVec.x;
	normal1Local1Y = tVec.y;
	tVec = vert1s[edge1];
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
	normal1X = (col1$0 = tMat.col1).x * normal1X + (col2$0 = tMat.col2).x * normal1Y;
	normal1Y = col1$0.y * tX + col2$0.y * normal1Y;
	tMat = poly2.m_R;
	tX = normal1X * (col1$1 = tMat.col1).x + normal1Y * col1$1.y;
	normal1Local2Y = normal1X * (col2$1 = tMat.col2).x + normal1Y * col2$1.y;
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
		tVec = vert2s[i];
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
	b2Vec2$MulM$Lb2Vec2$Lb2Mat22$(tVec, poly2.m_R);
	v$2 = poly2.m_position;
	tVec.x += v$2.x;
	tVec.y += v$2.y;
	(features$0 = tClip.id.features).referenceFace = edge1;
	features$0.incidentEdge = vertex21;
	features$0.incidentVertex = vertex21;
	tClip = c[1];
	tVec = tClip.v;
	v$4 = vert2s[vertex22];
	tVec.x = v$4.x;
	tVec.y = v$4.y;
	b2Vec2$MulM$Lb2Vec2$Lb2Mat22$(tVec, poly2.m_R);
	v$6 = poly2.m_position;
	tVec.x += v$6.x;
	tVec.y += v$6.y;
	(features$1 = tClip.id.features).referenceFace = edge1;
	features$1.incidentEdge = vertex21;
	features$1.incidentVertex = vertex22;
};

b2Collision.FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$ = b2Collision$FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$;

function b2Collision$b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B(manifold, polyA, polyB, conservative) {
	var edgeA;
	var edgeAOut;
	var separationA;
	var edgeB;
	var edgeBOut;
	var separationB;
	var poly1;
	var poly2;
	var edge1;
	var flip;
	var incidentEdge;
	var count1;
	var vert1s;
	var v11;
	var v12;
	var sideNormalX;
	var sideNormalY;
	var tX;
	var tMat;
	var invLength;
	var frontNormalX;
	var frontNormalY;
	var v11X;
	var v11Y;
	var v12X;
	var v12Y;
	var frontOffset;
	var sideOffset1;
	var sideOffset2;
	var clipPoints1;
	var clipPoints2;
	var np;
	var pointCount;
	var i;
	var tVec;
	var separation;
	var cp;
	var this$0;
	var x$0;
	var y$0;
	var this$2;
	var this$4;
	var x$2;
	var y$2;
	var this$6;
	var this$8;
	var v$0;
	var this$10;
	var id$0;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	var m_position$0;
	var m_R$0;
	var col1$2;
	var col2$2;
	var x$1;
	var y$1;
	manifold.pointCount = 0;
	edgeA = 0;
	edgeAOut = [ 0 ];
	separationA = b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B(edgeAOut, polyA, polyB, conservative);
	edgeA = edgeAOut[0];
	if (separationA > 0.0 && conservative === false) {
		return;
	}
	edgeB = 0;
	edgeBOut = [ 0 ];
	separationB = b2Collision$FindMaxSeparation$ANLb2PolyShape$Lb2PolyShape$B(edgeBOut, polyB, polyA, conservative);
	edgeB = edgeBOut[0];
	if (separationB > 0.0 && conservative === false) {
		return;
	}
	edge1 = 0;
	flip = 0;
	if (separationB > 0.98 * separationA + 0.001) {
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
	incidentEdge = [ ({v: ({x: 0, y: 0}), id: new b2ContactID()}), ({v: ({x: 0, y: 0}), id: new b2ContactID()}) ];
	b2Collision$FindIncidentEdge$ALClipVertex$Lb2PolyShape$NLb2PolyShape$(incidentEdge, poly1, edge1, poly2);
	count1 = poly1.m_vertexCount;
	vert1s = poly1.m_vertices;
	v11 = vert1s[edge1];
	v12 = (edge1 + 1 < count1 ? vert1s[edge1 + 1] : vert1s[0]);
	sideNormalX = v12.x - v11.x;
	sideNormalY = v12.y - v11.y;
	tX = sideNormalX;
	tMat = poly1.m_R;
	sideNormalX = (col1$0 = tMat.col1).x * tX + (col2$0 = tMat.col2).x * sideNormalY;
	sideNormalY = col1$0.y * tX + col2$0.y * sideNormalY;
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
	tMat = m_R$0 = poly1.m_R;
	v11X = (col1$1 = tMat.col1).x * tX + (col2$1 = tMat.col2).x * v11Y;
	v11Y = col1$1.y * tX + col2$1.y * v11Y;
	v11X += x$1 = (m_position$0 = poly1.m_position).x;
	v11Y += y$1 = m_position$0.y;
	v12X = v12.x;
	v12Y = v12.y;
	tX = v12X;
	tMat = m_R$0;
	v12X = (col1$2 = m_R$0.col1).x * tX + (col2$2 = m_R$0.col2).x * v12Y;
	v12Y = col1$2.y * tX + col2$2.y * v12Y;
	v12X += x$1;
	v12Y += y$1;
	frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
	sideOffset1 = - (sideNormalX * v11X + sideNormalY * v11Y);
	sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;
	clipPoints1 = [ ({v: ({x: 0, y: 0}), id: new b2ContactID()}), ({v: ({x: 0, y: 0}), id: new b2ContactID()}) ];
	clipPoints2 = [ ({v: ({x: 0, y: 0}), id: new b2ContactID()}), ({v: ({x: 0, y: 0}), id: new b2ContactID()}) ];
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
	this$2 = b2Collision.b2CollidePolyTempVec;
	this$2.x = sideNormalX;
	this$2.y = sideNormalY;
	np = b2Collision$ClipSegmentToLine$ALClipVertex$ALClipVertex$Lb2Vec2$N(clipPoints2, clipPoints1, b2Collision.b2CollidePolyTempVec, sideOffset2);
	if (np < 2) {
		return;
	}
	if (flip !== 0) {
		this$4 = manifold.normal;
		x$2 = - frontNormalX;
		y$2 = - frontNormalY;
		this$4.x = x$2;
		this$4.y = y$2;
	} else {
		this$6 = manifold.normal;
		this$6.x = frontNormalX;
		this$6.y = frontNormalY;
	}
	pointCount = 0;
	for (i = 0; i < 2; ++ i) {
		tVec = clipPoints2[i].v;
		separation = frontNormalX * tVec.x + frontNormalY * tVec.y - frontOffset;
		if (separation <= 0.0 || conservative === true) {
			cp = manifold.points[pointCount];
			cp.separation = separation;
			this$8 = cp.position;
			v$0 = clipPoints2[i].v;
			this$8.x = v$0.x;
			this$8.y = v$0.y;
			this$10 = cp.id;
			id$0 = clipPoints2[i].id;
			b2ContactID$set_key$Lb2ContactID$N(this$10, id$0._key);
			cp.id.features.flip = flip;
			++ pointCount;
		}
	}
	manifold.pointCount = pointCount;
};

b2Collision.b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B = b2Collision$b2CollidePoly$Lb2Manifold$Lb2PolyShape$Lb2PolyShape$B;

function b2Collision$b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B(manifold, circle1, circle2, conservative) {
	var dX;
	var dY;
	var distSqr;
	var radiusSum;
	var separation;
	var dist;
	var a;
	var tPoint;
	var this$0;
	var m_position$0;
	var m_position$1;
	var normal$0;
	var position$0;
	var m_position$2;
	var m_radius$0;
	var normal$1;
	manifold.pointCount = 0;
	dX = (m_position$0 = circle2.m_position).x - (m_position$1 = circle1.m_position).x;
	dY = m_position$0.y - m_position$1.y;
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
		(normal$0 = manifold.normal).x = a * dX;
		normal$0.y = a * dY;
	}
	manifold.pointCount = 1;
	tPoint = manifold.points[0];
	b2ContactID$set_key$Lb2ContactID$N(tPoint.id, 0);
	tPoint.separation = separation;
	(position$0 = tPoint.position).x = (m_position$2 = circle2.m_position).x - (m_radius$0 = circle2.m_radius) * (normal$1 = manifold.normal).x;
	position$0.y = m_position$2.y - m_radius$0 * normal$1.y;
};

b2Collision.b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B = b2Collision$b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B;

function b2Collision$b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B(manifold, poly, circle, conservative) {
	var tPoint;
	var dX;
	var dY;
	var xLocalX;
	var xLocalY;
	var tMat;
	var tX;
	var dist;
	var normalIndex;
	var separation;
	var radius;
	var i;
	var s;
	var tVec;
	var vertIndex1;
	var vertIndex2;
	var eX;
	var eY;
	var length;
	var u;
	var pX;
	var pY;
	var this$0;
	var x$0;
	var y$0;
	var this$2;
	var x$2;
	var y$2;
	var m_normals$0;
	var m_vertices$0;
	var m_position$0;
	var m_position$1;
	var col1$0;
	var col2$0;
	var normal$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var features$0;
	var x$3;
	var position$0;
	var m_position$2;
	var m_vertices$1;
	var col1$2;
	var col2$2;
	var features$1;
	var normal$1;
	var position$1;
	var m_position$3;
	var m_vertices$2;
	var m_vertices$3;
	var m_vertices$4;
	var m_vertices$5;
	var m_vertices$6;
	var features$2;
	var col1$3;
	var col2$3;
	var normal$2;
	var position$2;
	var m_position$4;
	manifold.pointCount = 0;
	xLocalX = (m_position$0 = circle.m_position).x - (m_position$1 = poly.m_position).x;
	xLocalY = m_position$0.y - m_position$1.y;
	tMat = poly.m_R;
	tX = xLocalX * (col1$0 = tMat.col1).x + xLocalY * col1$0.y;
	xLocalY = xLocalX * (col2$0 = tMat.col2).x + xLocalY * col2$0.y;
	xLocalX = tX;
	normalIndex = 0;
	separation = - Number.MAX_VALUE;
	radius = circle.m_radius;
	for (i = 0; i < poly.m_vertexCount; ++ i) {
		s = (m_normals$0 = poly.m_normals)[i].x * (xLocalX - (m_vertices$0 = poly.m_vertices)[i].x) + m_normals$0[i].y * (xLocalY - m_vertices$0[i].y);
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
		x$3 = (normal$0 = manifold.normal).x = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
		normal$0.y = col1$1.y * x$1 + col2$1.y * y$1;
		tPoint = manifold.points[0];
		(features$0 = tPoint.id.features).incidentEdge = normalIndex;
		features$0.incidentVertex = b2Collision.b2_nullFeature;
		features$0.referenceFace = b2Collision.b2_nullFeature;
		features$0.flip = 0;
		(position$0 = tPoint.position).x = (m_position$2 = circle.m_position).x - radius * x$3;
		position$0.y = m_position$2.y - radius * normal$0.y;
		tPoint.separation = separation - radius;
		return;
	}
	vertIndex1 = normalIndex;
	vertIndex2 = (normalIndex + 1 < poly.m_vertexCount ? normalIndex + 1 : 0);
	eX = (m_vertices$2 = poly.m_vertices)[vertIndex2].x - m_vertices$2[normalIndex].x;
	eY = m_vertices$2[vertIndex2].y - m_vertices$2[normalIndex].y;
	length = Math.sqrt(eX * eX + eY * eY);
	eX /= length;
	eY /= length;
	if (length < Number.MIN_VALUE) {
		dX = xLocalX - (m_vertices$1 = poly.m_vertices)[vertIndex1].x;
		dY = xLocalY - m_vertices$1[vertIndex1].y;
		dist = Math.sqrt(dX * dX + dY * dY);
		dX /= dist;
		dY /= dist;
		if (dist > radius) {
			return;
		}
		manifold.pointCount = 1;
		this$0 = normal$1 = manifold.normal;
		x$0 = (col1$2 = tMat.col1).x * dX + (col2$2 = tMat.col2).x * dY;
		y$0 = col1$2.y * dX + col2$2.y * dY;
		this$0.x = x$0;
		this$0.y = y$0;
		tPoint = manifold.points[0];
		(features$1 = tPoint.id.features).incidentEdge = b2Collision.b2_nullFeature;
		features$1.incidentVertex = vertIndex1;
		features$1.referenceFace = b2Collision.b2_nullFeature;
		features$1.flip = 0;
		(position$1 = tPoint.position).x = (m_position$3 = circle.m_position).x - radius * normal$1.x;
		position$1.y = m_position$3.y - radius * normal$1.y;
		tPoint.separation = dist - radius;
		return;
	}
	u = (xLocalX - (m_vertices$6 = poly.m_vertices)[vertIndex1].x) * eX + (xLocalY - m_vertices$6[vertIndex1].y) * eY;
	tPoint = manifold.points[0];
	(features$2 = tPoint.id.features).incidentEdge = b2Collision.b2_nullFeature;
	features$2.incidentVertex = b2Collision.b2_nullFeature;
	features$2.referenceFace = b2Collision.b2_nullFeature;
	features$2.flip = 0;
	if (u <= 0.0) {
		pX = (m_vertices$3 = poly.m_vertices)[vertIndex1].x;
		pY = m_vertices$3[vertIndex1].y;
		tPoint.id.features.incidentVertex = vertIndex1;
	} else if (u >= length) {
		pX = (m_vertices$4 = poly.m_vertices)[vertIndex2].x;
		pY = m_vertices$4[vertIndex2].y;
		tPoint.id.features.incidentVertex = vertIndex2;
	} else {
		pX = eX * u + (m_vertices$5 = poly.m_vertices)[vertIndex1].x;
		pY = eY * u + m_vertices$5[vertIndex1].y;
		tPoint.id.features.incidentEdge = vertIndex1;
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
	this$2 = normal$2 = manifold.normal;
	x$2 = (col1$3 = tMat.col1).x * dX + (col2$3 = tMat.col2).x * dY;
	y$2 = col1$3.y * dX + col2$3.y * dY;
	this$2.x = x$2;
	this$2.y = y$2;
	(position$2 = tPoint.position).x = (m_position$4 = circle.m_position).x - radius * normal$2.x;
	position$2.y = m_position$4.y - radius * normal$2.y;
	tPoint.separation = dist - radius;
};

b2Collision.b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B = b2Collision$b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B;

function b2ContactID() {
	var features$0;
	this._key = 0;
	this.key = 0;
	features$0 = this.features = ({_referenceFace: 0, _incidentEdge: 0, _incidentVertex: 0, _flip: 0, _m_id: null, referenceFace: 0, incidentEdge: 0, incidentVertex: 0, flip: 0});
	features$0._m_id = this;
};

$__jsx_extend([b2ContactID], Object);
b2ContactID.prototype.Set$Lb2ContactID$ = function (id) {
	b2ContactID$set_key$Lb2ContactID$N(this, id._key);
};


function b2ContactID$Set$Lb2ContactID$Lb2ContactID$($this, id) {
	b2ContactID$set_key$Lb2ContactID$N($this, id._key);
};

b2ContactID.Set$Lb2ContactID$Lb2ContactID$ = b2ContactID$Set$Lb2ContactID$Lb2ContactID$;

b2ContactID.prototype.Copy$ = function () {
	var id;
	id = new b2ContactID();
	b2ContactID$set_key$Lb2ContactID$N(id, this._key);
	return id;
};


function b2ContactID$Copy$Lb2ContactID$($this) {
	var id;
	id = new b2ContactID();
	b2ContactID$set_key$Lb2ContactID$N(id, $this._key);
	return id;
};

b2ContactID.Copy$Lb2ContactID$ = b2ContactID$Copy$Lb2ContactID$;

b2ContactID.prototype.get_key$ = function () {
	return this._key;
};


function b2ContactID$get_key$Lb2ContactID$($this) {
	return $this._key;
};

b2ContactID.get_key$Lb2ContactID$ = b2ContactID$get_key$Lb2ContactID$;

b2ContactID.prototype.set_key$N = function (value) {
	var _key$0;
	var features$0;
	_key$0 = this._key = value;
	(features$0 = this.features)._referenceFace = _key$0 & 0x000000ff;
	features$0._incidentEdge = (_key$0 & 0x0000ff00) >> 8 & 0x000000ff;
	features$0._incidentVertex = (_key$0 & 0x00ff0000) >> 16 & 0x000000ff;
	features$0._flip = (_key$0 & 0xff000000) >> 24 & 0x000000ff;
};


function b2ContactID$set_key$Lb2ContactID$N($this, value) {
	var _key$0;
	var features$0;
	_key$0 = $this._key = value;
	(features$0 = $this.features)._referenceFace = _key$0 & 0x000000ff;
	features$0._incidentEdge = (_key$0 & 0x0000ff00) >> 8 & 0x000000ff;
	features$0._incidentVertex = (_key$0 & 0x00ff0000) >> 16 & 0x000000ff;
	features$0._flip = (_key$0 & 0xff000000) >> 24 & 0x000000ff;
};

b2ContactID.set_key$Lb2ContactID$N = b2ContactID$set_key$Lb2ContactID$N;

function b2ContactPoint() {
	this.normalImpulse = 0;
	this.tangentImpulse = 0;
	this.position = ({x: 0, y: 0});
	this.id = new b2ContactID();
	this.separation = 0;
};

$__jsx_extend([b2ContactPoint], Object);
function b2Manifold() {
	var i;
	var points$0;
	this.normal = null;
	this.pointCount = 0;
	points$0 = this.points = [  ];
	points$0.length = 2;
	for (i = 0; i < 2; i++) {
		this.points[i] = new b2ContactPoint();
	}
	this.normal = ({x: 0, y: 0});
};

$__jsx_extend([b2Manifold], Object);
function b2OBB() {
	this.R = new b2Mat22$1();
	this.center = ({x: 0, y: 0});
	this.extents = ({x: 0, y: 0});
};

$__jsx_extend([b2OBB], Object);
function b2Pair() {
	this.userData = null;
	this.proxyId1 = 0;
	this.proxyId2 = 0;
	this.next = 0;
	this.status = 0;
};

$__jsx_extend([b2Pair], Object);
function b2Pair$SetBuffered$Lb2Pair$($this) {
	$this.status |= 0x0001;
};

b2Pair.SetBuffered$Lb2Pair$ = b2Pair$SetBuffered$Lb2Pair$;

function b2Pair$ClearBuffered$Lb2Pair$($this) {
	$this.status &= -2;
};

b2Pair.ClearBuffered$Lb2Pair$ = b2Pair$ClearBuffered$Lb2Pair$;

function b2Pair$IsBuffered$Lb2Pair$($this) {
	return ($this.status & 0x0001) === 0x0001;
};

b2Pair.IsBuffered$Lb2Pair$ = b2Pair$IsBuffered$Lb2Pair$;

function b2Pair$SetRemoved$Lb2Pair$($this) {
	$this.status |= 0x0002;
};

b2Pair.SetRemoved$Lb2Pair$ = b2Pair$SetRemoved$Lb2Pair$;

function b2Pair$ClearRemoved$Lb2Pair$($this) {
	$this.status &= -3;
};

b2Pair.ClearRemoved$Lb2Pair$ = b2Pair$ClearRemoved$Lb2Pair$;

function b2Pair$IsRemoved$Lb2Pair$($this) {
	return ($this.status & 0x0002) === 0x0002;
};

b2Pair.IsRemoved$Lb2Pair$ = b2Pair$IsRemoved$Lb2Pair$;

function b2Pair$SetFinal$Lb2Pair$($this) {
	$this.status |= 0x0004;
};

b2Pair.SetFinal$Lb2Pair$ = b2Pair$SetFinal$Lb2Pair$;

function b2Pair$IsFinal$Lb2Pair$($this) {
	return ($this.status & 0x0004) === 0x0004;
};

b2Pair.IsFinal$Lb2Pair$ = b2Pair$IsFinal$Lb2Pair$;

function b2PairCallback() {
};

$__jsx_extend([b2PairCallback], Object);
b2PairCallback.prototype.PairAdded$XX = function (proxyUserData1, proxyUserData2) {
	return null;
};


b2PairCallback.prototype.PairRemoved$XXX = function (proxyUserData1, proxyUserData2, pairUserData) {
};


function b2PairManager() {
	var i;
	var m_hashTable$0;
	var m_pairs$0;
	var m_pairBuffer$0;
	var m_pairs$1;
	this.m_broadPhase = null;
	this.m_callback = null;
	this.m_pairs = null;
	this.m_freePair = 0;
	this.m_pairCount = 0;
	this.m_pairBuffer = null;
	this.m_pairBufferCount = 0;
	i = 0;
	m_hashTable$0 = this.m_hashTable = [  ];
	m_hashTable$0.length = b2Pair.b2_tableCapacity;
	for (i = 0; i < b2Pair.b2_tableCapacity; ++ i) {
		this.m_hashTable[i] = b2Pair.b2_nullPair;
	}
	m_pairs$0 = this.m_pairs = [  ];
	m_pairs$0.length = 8192;
	for (i = 0; i < 8192; ++ i) {
		this.m_pairs[i] = ({userData: null, proxyId1: 0, proxyId2: 0, next: 0, status: 0});
	}
	m_pairBuffer$0 = this.m_pairBuffer = [  ];
	m_pairBuffer$0.length = 8192;
	for (i = 0; i < 8192; ++ i) {
		this.m_pairBuffer[i] = ({proxyId1: 0, proxyId2: 0});
	}
	for (i = 0; i < 8192; ++ i) {
		(m_pairs$1 = this.m_pairs)[i].proxyId1 = b2Pair.b2_nullProxy;
		m_pairs$1[i].proxyId2 = b2Pair.b2_nullProxy;
		m_pairs$1[i].userData = null;
		m_pairs$1[i].status = 0;
		m_pairs$1[i].next = i + 1;
	}
	this.m_pairs[8191].next = b2Pair.b2_nullPair;
	this.m_pairCount = 0;
};

$__jsx_extend([b2PairManager], Object);
b2PairManager.prototype.Initialize$Lb2BroadPhase$Lb2PairCallback$ = function (broadPhase, callback) {
	this.m_broadPhase = broadPhase;
	this.m_callback = callback;
};


function b2PairManager$Initialize$Lb2PairManager$Lb2BroadPhase$Lb2PairCallback$($this, broadPhase, callback) {
	$this.m_broadPhase = broadPhase;
	$this.m_callback = callback;
};

b2PairManager.Initialize$Lb2PairManager$Lb2BroadPhase$Lb2PairCallback$ = b2PairManager$Initialize$Lb2PairManager$Lb2BroadPhase$Lb2PairCallback$;

b2PairManager.prototype.AddBufferedPair$NN = function (proxyId1, proxyId2) {
	var pair;
	var m_pairBuffer$0;
	var m_pairBufferCount$0;
	pair = b2PairManager$AddPair$Lb2PairManager$NN(this, proxyId1, proxyId2);
	if (((pair.status & 0x0001) === 0x0001) === false) {
		pair.status |= 0x0001;
		(m_pairBuffer$0 = this.m_pairBuffer)[m_pairBufferCount$0 = this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		m_pairBuffer$0[m_pairBufferCount$0].proxyId2 = pair.proxyId2;
		++ this.m_pairBufferCount;
	}
	pair.status &= -3;
};


function b2PairManager$AddBufferedPair$Lb2PairManager$NN($this, proxyId1, proxyId2) {
	var pair;
	var m_pairBuffer$0;
	var m_pairBufferCount$0;
	pair = b2PairManager$AddPair$Lb2PairManager$NN($this, proxyId1, proxyId2);
	if (((pair.status & 0x0001) === 0x0001) === false) {
		pair.status |= 0x0001;
		(m_pairBuffer$0 = $this.m_pairBuffer)[m_pairBufferCount$0 = $this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		m_pairBuffer$0[m_pairBufferCount$0].proxyId2 = pair.proxyId2;
		++ $this.m_pairBufferCount;
	}
	pair.status &= -3;
};

b2PairManager.AddBufferedPair$Lb2PairManager$NN = b2PairManager$AddBufferedPair$Lb2PairManager$NN;

b2PairManager.prototype.RemoveBufferedPair$NN = function (proxyId1, proxyId2) {
	var pair;
	var temp$0;
	var hash$0;
	var m_pairBuffer$0;
	var m_pairBufferCount$0;
	if (proxyId1 > proxyId2) {
		temp$0 = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp$0;
	}
	hash$0 = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	pair = b2PairManager$FindHash$Lb2PairManager$NNN(this, proxyId1, proxyId2, hash$0);
	if (pair == null) {
		return;
	}
	if (((pair.status & 0x0001) === 0x0001) === false) {
		pair.status |= 0x0001;
		(m_pairBuffer$0 = this.m_pairBuffer)[m_pairBufferCount$0 = this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		m_pairBuffer$0[m_pairBufferCount$0].proxyId2 = pair.proxyId2;
		++ this.m_pairBufferCount;
	}
	pair.status |= 0x0002;
};


function b2PairManager$RemoveBufferedPair$Lb2PairManager$NN($this, proxyId1, proxyId2) {
	var pair;
	var temp$0;
	var hash$0;
	var m_pairBuffer$0;
	var m_pairBufferCount$0;
	if (proxyId1 > proxyId2) {
		temp$0 = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp$0;
	}
	hash$0 = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	pair = b2PairManager$FindHash$Lb2PairManager$NNN($this, proxyId1, proxyId2, hash$0);
	if (pair == null) {
		return;
	}
	if (((pair.status & 0x0001) === 0x0001) === false) {
		pair.status |= 0x0001;
		(m_pairBuffer$0 = $this.m_pairBuffer)[m_pairBufferCount$0 = $this.m_pairBufferCount].proxyId1 = pair.proxyId1;
		m_pairBuffer$0[m_pairBufferCount$0].proxyId2 = pair.proxyId2;
		++ $this.m_pairBufferCount;
	}
	pair.status |= 0x0002;
};

b2PairManager.RemoveBufferedPair$Lb2PairManager$NN = b2PairManager$RemoveBufferedPair$Lb2PairManager$NN;

b2PairManager.prototype.Commit$ = function () {
	var i;
	var removeCount;
	var proxies;
	var pair;
	var proxy1;
	var proxy2;
	var proxyId1$0;
	var proxyId2$0;
	var temp$0;
	var hash$0;
	var m_pairBuffer$0;
	var m_pairBuffer$1;
	var status$0;
	var m_pairBuffer$2;
	i = 0;
	removeCount = 0;
	proxies = this.m_broadPhase.m_proxyPool;
	for (i = 0; i < this.m_pairBufferCount; ++ i) {
		proxyId1$0 = (m_pairBuffer$0 = this.m_pairBuffer)[i].proxyId1;
		proxyId2$0 = m_pairBuffer$0[i].proxyId2;
		if (proxyId1$0 > proxyId2$0) {
			temp$0 = proxyId1$0;
			proxyId1$0 = proxyId2$0;
			proxyId2$0 = temp$0;
		}
		hash$0 = b2PairManager$Hash$NN(proxyId1$0, proxyId2$0) & b2Pair.b2_tableMask;
		pair = b2PairManager$FindHash$Lb2PairManager$NNN(this, proxyId1$0, proxyId2$0, hash$0);
		status$0 = pair.status &= -2;
		proxy1 = proxies[pair.proxyId1];
		proxy2 = proxies[pair.proxyId2];
		if ((status$0 & 0x0002) === 0x0002) {
			if (((pair.status & 0x0004) === 0x0004) === true) {
				this.m_callback.PairRemoved$XXX(proxy1.userData, proxy2.userData, pair.userData);
			}
			(m_pairBuffer$1 = this.m_pairBuffer)[removeCount].proxyId1 = pair.proxyId1;
			m_pairBuffer$1[removeCount].proxyId2 = pair.proxyId2;
			++ removeCount;
		} else if (((pair.status & 0x0004) === 0x0004) === false) {
			pair.userData = this.m_callback.PairAdded$XX(proxy1.userData, proxy2.userData);
			pair.status |= 0x0004;
		}
	}
	for (i = 0; i < removeCount; ++ i) {
		b2PairManager$RemovePair$Lb2PairManager$NN(this, (m_pairBuffer$2 = this.m_pairBuffer)[i].proxyId1, m_pairBuffer$2[i].proxyId2);
	}
	this.m_pairBufferCount = 0;
};


function b2PairManager$Commit$Lb2PairManager$($this) {
	var i;
	var removeCount;
	var proxies;
	var pair;
	var proxy1;
	var proxy2;
	var proxyId1$0;
	var proxyId2$0;
	var temp$0;
	var hash$0;
	var m_pairBuffer$0;
	var m_pairBuffer$1;
	var status$0;
	var m_pairBuffer$2;
	i = 0;
	removeCount = 0;
	proxies = $this.m_broadPhase.m_proxyPool;
	for (i = 0; i < $this.m_pairBufferCount; ++ i) {
		proxyId1$0 = (m_pairBuffer$0 = $this.m_pairBuffer)[i].proxyId1;
		proxyId2$0 = m_pairBuffer$0[i].proxyId2;
		if (proxyId1$0 > proxyId2$0) {
			temp$0 = proxyId1$0;
			proxyId1$0 = proxyId2$0;
			proxyId2$0 = temp$0;
		}
		hash$0 = b2PairManager$Hash$NN(proxyId1$0, proxyId2$0) & b2Pair.b2_tableMask;
		pair = b2PairManager$FindHash$Lb2PairManager$NNN($this, proxyId1$0, proxyId2$0, hash$0);
		status$0 = pair.status &= -2;
		proxy1 = proxies[pair.proxyId1];
		proxy2 = proxies[pair.proxyId2];
		if ((status$0 & 0x0002) === 0x0002) {
			if (((pair.status & 0x0004) === 0x0004) === true) {
				$this.m_callback.PairRemoved$XXX(proxy1.userData, proxy2.userData, pair.userData);
			}
			(m_pairBuffer$1 = $this.m_pairBuffer)[removeCount].proxyId1 = pair.proxyId1;
			m_pairBuffer$1[removeCount].proxyId2 = pair.proxyId2;
			++ removeCount;
		} else if (((pair.status & 0x0004) === 0x0004) === false) {
			pair.userData = $this.m_callback.PairAdded$XX(proxy1.userData, proxy2.userData);
			pair.status |= 0x0004;
		}
	}
	for (i = 0; i < removeCount; ++ i) {
		b2PairManager$RemovePair$Lb2PairManager$NN($this, (m_pairBuffer$2 = $this.m_pairBuffer)[i].proxyId1, m_pairBuffer$2[i].proxyId2);
	}
	$this.m_pairBufferCount = 0;
};

b2PairManager.Commit$Lb2PairManager$ = b2PairManager$Commit$Lb2PairManager$;

b2PairManager.prototype.AddPair$NN = function (proxyId1, proxyId2) {
	var temp;
	var hash;
	var pair;
	var pIndex;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	pair = b2PairManager$FindHash$Lb2PairManager$NNN(this, proxyId1, proxyId2, hash);
	if (pair != null) {
		return pair;
	}
	pIndex = this.m_freePair;
	pair = this.m_pairs[pIndex];
	this.m_freePair = pair.next;
	pair.proxyId1 = proxyId1;
	pair.proxyId2 = proxyId2;
	pair.status = 0;
	pair.userData = null;
	pair.next = this.m_hashTable[hash];
	this.m_hashTable[hash] = pIndex;
	++ this.m_pairCount;
	return pair;
};


function b2PairManager$AddPair$Lb2PairManager$NN($this, proxyId1, proxyId2) {
	var temp;
	var hash;
	var pair;
	var pIndex;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	pair = b2PairManager$FindHash$Lb2PairManager$NNN($this, proxyId1, proxyId2, hash);
	if (pair != null) {
		return pair;
	}
	pIndex = $this.m_freePair;
	pair = $this.m_pairs[pIndex];
	$this.m_freePair = pair.next;
	pair.proxyId1 = proxyId1;
	pair.proxyId2 = proxyId2;
	pair.status = 0;
	pair.userData = null;
	pair.next = $this.m_hashTable[hash];
	$this.m_hashTable[hash] = pIndex;
	++ $this.m_pairCount;
	return pair;
};

b2PairManager.AddPair$Lb2PairManager$NN = b2PairManager$AddPair$Lb2PairManager$NN;

b2PairManager.prototype.RemovePair$NN = function (proxyId1, proxyId2) {
	var temp;
	var hash;
	var node;
	var pNode;
	var index;
	var pair;
	var userData;
	var pair$0;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	node = this.m_hashTable[hash];
	pNode = null;
	while (node !== b2Pair.b2_nullPair) {
		pair$0 = this.m_pairs[node];
		if (pair$0.proxyId1 === proxyId1 && pair$0.proxyId2 === proxyId2) {
			index = node;
			if (pNode != null) {
				pNode.next = this.m_pairs[node].next;
			} else {
				this.m_hashTable[hash] = this.m_pairs[node].next;
			}
			pair = this.m_pairs[index];
			userData = pair.userData;
			pair.next = this.m_freePair;
			pair.proxyId1 = b2Pair.b2_nullProxy;
			pair.proxyId2 = b2Pair.b2_nullProxy;
			pair.userData = null;
			pair.status = 0;
			this.m_freePair = index;
			-- this.m_pairCount;
			return userData;
		} else {
			pNode = this.m_pairs[node];
			node = pNode.next;
		}
	}
	return null;
};


function b2PairManager$RemovePair$Lb2PairManager$NN($this, proxyId1, proxyId2) {
	var temp;
	var hash;
	var node;
	var pNode;
	var index;
	var pair;
	var userData;
	var pair$0;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	node = $this.m_hashTable[hash];
	pNode = null;
	while (node !== b2Pair.b2_nullPair) {
		pair$0 = $this.m_pairs[node];
		if (pair$0.proxyId1 === proxyId1 && pair$0.proxyId2 === proxyId2) {
			index = node;
			if (pNode != null) {
				pNode.next = $this.m_pairs[node].next;
			} else {
				$this.m_hashTable[hash] = $this.m_pairs[node].next;
			}
			pair = $this.m_pairs[index];
			userData = pair.userData;
			pair.next = $this.m_freePair;
			pair.proxyId1 = b2Pair.b2_nullProxy;
			pair.proxyId2 = b2Pair.b2_nullProxy;
			pair.userData = null;
			pair.status = 0;
			$this.m_freePair = index;
			-- $this.m_pairCount;
			return userData;
		} else {
			pNode = $this.m_pairs[node];
			node = pNode.next;
		}
	}
	return null;
};

b2PairManager.RemovePair$Lb2PairManager$NN = b2PairManager$RemovePair$Lb2PairManager$NN;

b2PairManager.prototype.Find$NN = function (proxyId1, proxyId2) {
	var temp;
	var hash;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	return b2PairManager$FindHash$Lb2PairManager$NNN(this, proxyId1, proxyId2, hash);
};


function b2PairManager$Find$Lb2PairManager$NN($this, proxyId1, proxyId2) {
	var temp;
	var hash;
	if (proxyId1 > proxyId2) {
		temp = proxyId1;
		proxyId1 = proxyId2;
		proxyId2 = temp;
	}
	hash = b2PairManager$Hash$NN(proxyId1, proxyId2) & b2Pair.b2_tableMask;
	return b2PairManager$FindHash$Lb2PairManager$NNN($this, proxyId1, proxyId2, hash);
};

b2PairManager.Find$Lb2PairManager$NN = b2PairManager$Find$Lb2PairManager$NN;

b2PairManager.prototype.FindHash$NNN = function (proxyId1, proxyId2, hash) {
	var index;
	var pair$0;
	index = this.m_hashTable[hash];
	while (index !== b2Pair.b2_nullPair && (pair$0 = this.m_pairs[index], pair$0.proxyId1 === proxyId1 && pair$0.proxyId2 === proxyId2) === false) {
		index = this.m_pairs[index].next;
	}
	return (index === b2Pair.b2_nullPair ? null : this.m_pairs[index]);
};


function b2PairManager$FindHash$Lb2PairManager$NNN($this, proxyId1, proxyId2, hash) {
	var index;
	var pair$0;
	index = $this.m_hashTable[hash];
	while (index !== b2Pair.b2_nullPair && (pair$0 = $this.m_pairs[index], pair$0.proxyId1 === proxyId1 && pair$0.proxyId2 === proxyId2) === false) {
		index = $this.m_pairs[index].next;
	}
	return (index === b2Pair.b2_nullPair ? null : $this.m_pairs[index]);
};

b2PairManager.FindHash$Lb2PairManager$NNN = b2PairManager$FindHash$Lb2PairManager$NNN;

b2PairManager.prototype.ValidateBuffer$ = function () {
};


function b2PairManager$ValidateBuffer$Lb2PairManager$($this) {
};

b2PairManager.ValidateBuffer$Lb2PairManager$ = b2PairManager$ValidateBuffer$Lb2PairManager$;

b2PairManager.prototype.ValidateTable$ = function () {
};


function b2PairManager$ValidateTable$Lb2PairManager$($this) {
};

b2PairManager.ValidateTable$Lb2PairManager$ = b2PairManager$ValidateTable$Lb2PairManager$;

function b2PairManager$Hash$NN(proxyId1, proxyId2) {
	var key;
	key = proxyId2 << 16 & 0xffff0000 | proxyId1;
	key = ~ key + (key << 15 & 0xFFFF8000);
	key = key ^ key >> 12 & 0x000fffff;
	key = key + (key << 2 & 0xFFFFFFFC);
	key = key ^ key >> 4 & 0x0fffffff;
	key = key * 2057;
	key = key ^ key >> 16 & 0x0000ffff;
	return key;
};

b2PairManager.Hash$NN = b2PairManager$Hash$NN;

function b2PairManager$Equals$Lb2Pair$NN(pair, proxyId1, proxyId2) {
	return pair.proxyId1 === proxyId1 && pair.proxyId2 === proxyId2;
};

b2PairManager.Equals$Lb2Pair$NN = b2PairManager$Equals$Lb2Pair$NN;

function b2PairManager$EqualsPair$Lb2Pair$Lb2Pair$(pair1, pair2) {
	return pair1.proxyId1 === pair2.proxyId1 && pair1.proxyId2 === pair2.proxyId2;
};

b2PairManager.EqualsPair$Lb2Pair$Lb2Pair$ = b2PairManager$EqualsPair$Lb2Pair$Lb2Pair$;

function b2Proxy() {
	this.userData = null;
	this.lowerBounds = [ 0, 0 ];
	this.upperBounds = [ 0, 0 ];
	this.overlapCount = 0;
	this.timeStamp = 0;
};

$__jsx_extend([b2Proxy], Object);
function b2Proxy$GetNext$Lb2Proxy$($this) {
	return $this.lowerBounds[0];
};

b2Proxy.GetNext$Lb2Proxy$ = b2Proxy$GetNext$Lb2Proxy$;

function b2Proxy$SetNext$Lb2Proxy$N($this, next) {
	$this.lowerBounds[0] = next;
};

b2Proxy.SetNext$Lb2Proxy$N = b2Proxy$SetNext$Lb2Proxy$N;

function b2Proxy$IsValid$Lb2Proxy$($this) {
	return $this.overlapCount !== 0x0000ffff;
};

b2Proxy.IsValid$Lb2Proxy$ = b2Proxy$IsValid$Lb2Proxy$;

function b2MassData() {
	this.mass = 0.0;
	this.I = 0.0;
	this.center = ({x: 0, y: 0});
};

$__jsx_extend([b2MassData], Object);
function b2Shape(def, body) {
	this.m_next = null;
	this.m_type = 0;
	this.m_R = new b2Mat22$1();
	this.m_position = ({x: 0, y: 0});
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

$__jsx_extend([b2Shape], Object);
b2Shape.prototype.GetUserData$ = function () {
	return this.m_userData;
};


function b2Shape$GetUserData$Lb2Shape$($this) {
	return $this.m_userData;
};

b2Shape.GetUserData$Lb2Shape$ = b2Shape$GetUserData$Lb2Shape$;

b2Shape.prototype.GetType$ = function () {
	return this.m_type;
};


function b2Shape$GetType$Lb2Shape$($this) {
	return $this.m_type;
};

b2Shape.GetType$Lb2Shape$ = b2Shape$GetType$Lb2Shape$;

b2Shape.prototype.GetBody$ = function () {
	return this.m_body;
};


function b2Shape$GetBody$Lb2Shape$($this) {
	return $this.m_body;
};

b2Shape.GetBody$Lb2Shape$ = b2Shape$GetBody$Lb2Shape$;

b2Shape.prototype.GetPosition$ = function () {
	return this.m_position;
};


function b2Shape$GetPosition$Lb2Shape$($this) {
	return $this.m_position;
};

b2Shape.GetPosition$Lb2Shape$ = b2Shape$GetPosition$Lb2Shape$;

b2Shape.prototype.GetRotationMatrix$ = function () {
	return this.m_R;
};


function b2Shape$GetRotationMatrix$Lb2Shape$($this) {
	return $this.m_R;
};

b2Shape.GetRotationMatrix$Lb2Shape$ = b2Shape$GetRotationMatrix$Lb2Shape$;

b2Shape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
};


b2Shape.prototype.GetNext$ = function () {
	return this.m_next;
};


function b2Shape$GetNext$Lb2Shape$($this) {
	return $this.m_next;
};

b2Shape.GetNext$Lb2Shape$ = b2Shape$GetNext$Lb2Shape$;

b2Shape.prototype.DestroyProxy$ = function () {
	if (this.m_proxyId !== b2Pair.b2_nullProxy) {
		b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(this.m_body.m_world.m_broadPhase, this.m_proxyId);
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
};


function b2Shape$DestroyProxy$Lb2Shape$($this) {
	if ($this.m_proxyId !== b2Pair.b2_nullProxy) {
		b2BroadPhase$DestroyProxy$Lb2BroadPhase$N($this.m_body.m_world.m_broadPhase, $this.m_proxyId);
		$this.m_proxyId = b2Pair.b2_nullProxy;
	}
};

b2Shape.DestroyProxy$Lb2Shape$ = b2Shape$DestroyProxy$Lb2Shape$;

b2Shape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
};


b2Shape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
};


b2Shape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
};


b2Shape.prototype.GetMaxRadius$ = function () {
	return this.m_maxRadius;
};


function b2Shape$GetMaxRadius$Lb2Shape$($this) {
	return $this.m_maxRadius;
};

b2Shape.GetMaxRadius$Lb2Shape$ = b2Shape$GetMaxRadius$Lb2Shape$;

function b2Shape$Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$(def, body, center) {
	switch (def.type) {
	case 0:
		return new b2CircleShape(def, body, center);
	case 1:
	case 2:
		return new b2PolyShape(def, body, center);
	}
	return null;
};

b2Shape.Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$ = b2Shape$Create$Lb2ShapeDef$Lb2Body$Lb2Vec2$;

function b2Shape$Destroy$Lb2Shape$(shape) {
	if (shape.m_proxyId !== b2Pair.b2_nullProxy) {
		b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(shape.m_body.m_world.m_broadPhase, shape.m_proxyId);
	}
};

b2Shape.Destroy$Lb2Shape$ = b2Shape$Destroy$Lb2Shape$;

function b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN(massData, vs, count, rho) {
	var center;
	var area;
	var I;
	var pRef;
	var inv3;
	var i;
	var p2;
	var p3;
	var D;
	var triangleArea;
	var intx2;
	var inty2;
	var a$0;
	var a$2;
	var e1$x$0;
	var e1$y$0;
	var e2$x$0;
	var e2$y$0;
	var tVec$x$0;
	var tVec$y$0;
	var x$0;
	var y$0;
	var x$1;
	var y$1;
	var x$2;
	var y$2;
	var x$3;
	var y$3;
	center = ({x: 0, y: 0});
	center.x = 0;
	center.y = 0;
	area = 0.0;
	I = 0.0;
	pRef = ({x: 0.0, y: 0.0});
	inv3 = 0.3333333333333333;
	for (i = 0; i < count; ++ i) {
		p2 = vs[i];
		p3 = (i + 1 < count ? vs[i + 1] : vs[0]);
		e1$x$0 = (x$1 = p2.x) - pRef.x;
		e1$y$0 = (y$1 = p2.y) - pRef.y;
		e2$x$0 = (x$2 = p3.x) - (x$0 = pRef.x);
		e2$y$0 = (y$2 = p3.y) - (y$0 = pRef.y);
		D = e1$x$0 * e2$y$0 - e1$y$0 * e2$x$0;
		triangleArea = 0.5 * D;
		area += triangleArea;
		tVec$x$0 = x$0;
		tVec$y$0 = y$0;
		tVec$x$0 += x$1;
		tVec$y$0 += y$1;
		tVec$x$0 += x$2;
		tVec$y$0 += y$2;
		a$0 = inv3 * triangleArea;
		tVec$x$0 *= a$0;
		tVec$y$0 *= a$0;
		center.x += tVec$x$0;
		center.y += tVec$y$0;
		intx2 = inv3 * (0.25 * (e1$x$0 * e1$x$0 + e2$x$0 * e1$x$0 + e2$x$0 * e2$x$0) + (x$0 * e1$x$0 + x$0 * e2$x$0)) + 0.5 * x$0 * x$0;
		inty2 = inv3 * (0.25 * (e1$y$0 * e1$y$0 + e2$y$0 * e1$y$0 + e2$y$0 * e2$y$0) + (y$0 * e1$y$0 + y$0 * e2$y$0)) + 0.5 * y$0 * y$0;
		I += D * (intx2 + inty2);
	}
	massData.mass = rho * area;
	a$2 = 1.0 / area;
	x$3 = center.x *= a$2;
	y$3 = center.y *= a$2;
	massData.center = center;
	I = rho * (I - area * (x$3 * x$3 + y$3 * y$3));
	massData.I = I;
};

b2Shape.PolyMass$Lb2MassData$ALb2Vec2$NN = b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN;

function b2Shape$PolyCentroid$ALb2Vec2$NLb2Vec2$(vs, count, out) {
	var cX;
	var cY;
	var area;
	var pRefX;
	var pRefY;
	var inv3;
	var i;
	var p2X;
	var p2Y;
	var p3X;
	var p3Y;
	var e1X;
	var e1Y;
	var e2X;
	var e2Y;
	var D;
	var triangleArea;
	cX = 0.0;
	cY = 0.0;
	area = 0.0;
	pRefX = 0.0;
	pRefY = 0.0;
	inv3 = 0.3333333333333333;
	for (i = 0; i < count; ++ i) {
		p2X = vs[i].x;
		p2Y = vs[i].y;
		p3X = (i + 1 < count ? vs[i + 1].x : vs[0].x);
		p3Y = (i + 1 < count ? vs[i + 1].y : vs[0].y);
		e1X = p2X - pRefX;
		e1Y = p2Y - pRefY;
		e2X = p3X - pRefX;
		e2Y = p3Y - pRefY;
		D = e1X * e2Y - e1Y * e2X;
		triangleArea = 0.5 * D;
		area += triangleArea;
		cX += triangleArea * inv3 * (pRefX + p2X + p3X);
		cY += triangleArea * inv3 * (pRefY + p2Y + p3Y);
	}
	cX *= 1.0 / area;
	cY *= 1.0 / area;
	out.x = cX;
	out.y = cY;
};

b2Shape.PolyCentroid$ALb2Vec2$NLb2Vec2$ = b2Shape$PolyCentroid$ALb2Vec2$NLb2Vec2$;

function b2PolyShape(def, body, newOrigin) {
	var i;
	var hX;
	var hY;
	var tVec;
	var aabb;
	var localR;
	var box;
	var hcX;
	var hcY;
	var poly;
	var centroidX;
	var centroidY;
	var uX;
	var uY;
	var length;
	var minVertexX;
	var minVertexY;
	var maxVertexX;
	var maxVertexY;
	var v;
	var i2;
	var positionX;
	var positionY;
	var broadPhase;
	var value2$0;
	var value2$2;
	var value2$4;
	var value2$6;
	var value2$8;
	var value2$10;
	var value1$0;
	var value2$12;
	var this$0;
	var this$2;
	var x$0;
	var y$0;
	var this$4;
	var x$2;
	var y$2;
	var m_localCentroid$0;
	var localPosition$0;
	var extents$0;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	var col1$2;
	var col2$2;
	var col1$3;
	var col2$3;
	var col1$4;
	var col2$4;
	var col1$5;
	var col2$5;
	var col1$6;
	var col2$6;
	var col1$7;
	var col2$7;
	var vertices$0;
	var m_vertices$0;
	var col1$8;
	var col2$8;
	var m_coreVertices$0;
	var m_vertices$1;
	var vertexCount$0;
	var m_localCentroid$1;
	var localPosition$1;
	var col1$9;
	var col2$9;
	var m_vertices$2;
	var m_coreVertices$1;
	var m_normals$0;
	var x$1;
	var y$1;
	var m_vertices$3;
	var m_normals$1;
	var col1$10;
	var col2$10;
	var m_localOBB$0;
	var m_R$0;
	var m_localCentroid$2;
	var m_position$0;
	var m_position$1;
	var col1$11;
	var x$3;
	var col2$11;
	var y$3;
	var x$4;
	var x$5;
	var col1$12;
	var R$0;
	var y$4;
	var x$6;
	var y$5;
	var y$6;
	var col2$12;
	var x$7;
	var y$7;
	var extents$1;
	var m_localOBB$2;
	var x$8;
	var y$8;
	var m_R$1;
	var center$0;
	var m_position$2;
	var col1$13;
	var x$9;
	var col2$13;
	var y$9;
	var minVertex$0;
	var maxVertex$0;
	b2Shape.call(this, def, body);
	this.m_coreVertices = null;
	this.m_vertexCount = 0;
	this.m_normals = null;
	this.syncAABB = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this.syncMat = new b2Mat22$1();
	this.m_localCentroid = ({x: 0, y: 0});
	this.m_localOBB = ({R: new b2Mat22$1(), center: ({x: 0, y: 0}), extents: ({x: 0, y: 0})});
	i = 0;
	aabb = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	m_vertices$2 = this.m_vertices = [  ];
	m_vertices$2.length = 16;
	m_coreVertices$1 = this.m_coreVertices = [  ];
	m_coreVertices$1.length = 16;
	m_normals$0 = this.m_normals = [  ];
	m_normals$0.length = 16;
	this.m_type = 2;
	localR = new b2Mat22$0(def.localRotation);
	if (def.type === 1) {
		(m_localCentroid$0 = this.m_localCentroid).x = (localPosition$0 = def.localPosition).x - newOrigin.x;
		m_localCentroid$0.y = localPosition$0.y - newOrigin.y;
		box = def;
		this.m_vertexCount = 4;
		hX = (extents$0 = box.extents).x;
		hY = extents$0.y;
		value2$0 = hX - 0.3;
		hcX = (0.0 >= value2$0 ? 0.0 : value2$0);
		value2$2 = hY - 0.3;
		hcY = (0.0 >= value2$2 ? 0.0 : value2$2);
		tVec = this.m_vertices[0] = ({x: 0, y: 0});
		tVec.x = (col1$0 = localR.col1).x * hX + (col2$0 = localR.col2).x * hY;
		tVec.y = col1$0.y * hX + col2$0.y * hY;
		tVec = this.m_vertices[1] = ({x: 0, y: 0});
		tVec.x = (col1$1 = localR.col1).x * - hX + (col2$1 = localR.col2).x * hY;
		tVec.y = col1$1.y * - hX + col2$1.y * hY;
		tVec = this.m_vertices[2] = ({x: 0, y: 0});
		tVec.x = (col1$2 = localR.col1).x * - hX + (col2$2 = localR.col2).x * - hY;
		tVec.y = col1$2.y * - hX + col2$2.y * - hY;
		tVec = this.m_vertices[3] = ({x: 0, y: 0});
		tVec.x = (col1$3 = localR.col1).x * hX + (col2$3 = localR.col2).x * - hY;
		tVec.y = col1$3.y * hX + col2$3.y * - hY;
		tVec = this.m_coreVertices[0] = ({x: 0, y: 0});
		tVec.x = (col1$4 = localR.col1).x * hcX + (col2$4 = localR.col2).x * hcY;
		tVec.y = col1$4.y * hcX + col2$4.y * hcY;
		tVec = this.m_coreVertices[1] = ({x: 0, y: 0});
		tVec.x = (col1$5 = localR.col1).x * - hcX + (col2$5 = localR.col2).x * hcY;
		tVec.y = col1$5.y * - hcX + col2$5.y * hcY;
		tVec = this.m_coreVertices[2] = ({x: 0, y: 0});
		tVec.x = (col1$6 = localR.col1).x * - hcX + (col2$6 = localR.col2).x * - hcY;
		tVec.y = col1$6.y * - hcX + col2$6.y * - hcY;
		tVec = this.m_coreVertices[3] = ({x: 0, y: 0});
		tVec.x = (col1$7 = localR.col1).x * hcX + (col2$7 = localR.col2).x * - hcY;
		tVec.y = col1$7.y * hcX + col2$7.y * - hcY;
	} else {
		poly = def;
		this.m_vertexCount = vertexCount$0 = poly.vertexCount;
		b2Shape$PolyCentroid$ALb2Vec2$NLb2Vec2$(poly.vertices, vertexCount$0, b2PolyShape.tempVec);
		centroidX = b2PolyShape.tempVec.x;
		centroidY = b2PolyShape.tempVec.y;
		(m_localCentroid$1 = this.m_localCentroid).x = (localPosition$1 = def.localPosition).x + ((col1$9 = localR.col1).x * centroidX + (col2$9 = localR.col2).x * centroidY) - newOrigin.x;
		m_localCentroid$1.y = localPosition$1.y + (col1$9.y * centroidX + col2$9.y * centroidY) - newOrigin.y;
		for (i = 0; i < this.m_vertexCount; ++ i) {
			this.m_vertices[i] = ({x: 0, y: 0});
			this.m_coreVertices[i] = ({x: 0, y: 0});
			hX = (vertices$0 = poly.vertices)[i].x - centroidX;
			hY = vertices$0[i].y - centroidY;
			(m_vertices$0 = this.m_vertices)[i].x = (col1$8 = localR.col1).x * hX + (col2$8 = localR.col2).x * hY;
			m_vertices$0[i].y = col1$8.y * hX + col2$8.y * hY;
			uX = m_vertices$0[i].x;
			uY = m_vertices$0[i].y;
			length = Math.sqrt(uX * uX + uY * uY);
			if (length > Number.MIN_VALUE) {
				uX *= 1.0 / length;
				uY *= 1.0 / length;
			}
			(m_coreVertices$0 = this.m_coreVertices)[i].x = (m_vertices$1 = this.m_vertices)[i].x - 0.3 * uX;
			m_coreVertices$0[i].y = m_vertices$1[i].y - 0.3 * uY;
		}
	}
	minVertexX = Number.MAX_VALUE;
	minVertexY = Number.MAX_VALUE;
	maxVertexX = - Number.MAX_VALUE;
	maxVertexY = - Number.MAX_VALUE;
	this.m_maxRadius = 0.0;
	for (i = 0; i < this.m_vertexCount; ++ i) {
		v = this.m_vertices[i];
		value2$4 = v.x;
		minVertexX = (minVertexX <= value2$4 ? minVertexX : value2$4);
		value2$6 = v.y;
		minVertexY = (minVertexY <= value2$6 ? minVertexY : value2$6);
		value2$8 = v.x;
		maxVertexX = (maxVertexX >= value2$8 ? maxVertexX : value2$8);
		value2$10 = v.y;
		maxVertexY = (maxVertexY >= value2$10 ? maxVertexY : value2$10);
		value1$0 = this.m_maxRadius;
		value2$12 = Math.sqrt((x$1 = v.x) * x$1 + (y$1 = v.y) * y$1);
		this.m_maxRadius = (value1$0 >= value2$12 ? value1$0 : value2$12);
	}
	this$0 = (m_localOBB$0 = this.m_localOBB).R;
	(col1$10 = this$0.col1).x = 1.0;
	(col2$10 = this$0.col2).x = 0.0;
	col1$10.y = 0.0;
	col2$10.y = 1.0;
	this$2 = m_localOBB$0.center;
	x$0 = (minVertexX + maxVertexX) * 0.5;
	y$0 = (minVertexY + maxVertexY) * 0.5;
	this$2.x = x$0;
	this$2.y = y$0;
	this$4 = m_localOBB$0.extents;
	x$2 = (maxVertexX - minVertexX) * 0.5;
	y$2 = (maxVertexY - minVertexY) * 0.5;
	this$4.x = x$2;
	this$4.y = y$2;
	i2 = 0;
	for (i = 0; i < this.m_vertexCount; ++ i) {
		this.m_normals[i] = ({x: 0, y: 0});
		i2 = (i + 1 < this.m_vertexCount ? i + 1 : 0);
		(m_normals$1 = this.m_normals)[i].x = (m_vertices$3 = this.m_vertices)[i2].y - m_vertices$3[i].y;
		m_normals$1[i].y = - (m_vertices$3[i2].x - m_vertices$3[i].x);
		b2Vec2$Normalize$Lb2Vec2$(m_normals$1[i]);
	}
	for (i = 0; i < this.m_vertexCount; ++ i) {
		i2 = (i + 1 < this.m_vertexCount ? i + 1 : 0);
	}
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, this.m_body.m_R);
	(m_position$0 = this.m_position).x = (m_position$1 = this.m_body.m_position).x + ((x$4 = (col1$11 = (m_R$0 = this.m_R).col1).x) * (x$3 = (m_localCentroid$2 = this.m_localCentroid).x) + (x$5 = (col2$11 = m_R$0.col2).x) * (y$3 = m_localCentroid$2.y));
	m_position$0.y = m_position$1.y + ((y$4 = col1$11.y) * x$3 + (y$5 = col2$11.y) * y$3);
	b2PolyShape.tAbsR.col1.x = x$4 * (x$6 = (col1$12 = (R$0 = this.m_localOBB.R).col1).x) + x$5 * (y$6 = col1$12.y);
	b2PolyShape.tAbsR.col1.y = y$4 * x$6 + y$5 * y$6;
	b2PolyShape.tAbsR.col2.x = x$4 * (x$7 = (col2$12 = R$0.col2).x) + x$5 * (y$7 = col2$12.y);
	b2PolyShape.tAbsR.col2.y = y$4 * x$7 + y$5 * y$7;
	b2Mat22$Abs$Lb2Mat22$(b2PolyShape.tAbsR);
	hX = b2PolyShape.tAbsR.col1.x * (x$8 = (extents$1 = (m_localOBB$2 = this.m_localOBB).extents).x) + b2PolyShape.tAbsR.col2.x * (y$8 = extents$1.y);
	hY = b2PolyShape.tAbsR.col1.y * x$8 + b2PolyShape.tAbsR.col2.y * y$8;
	positionX = (m_position$2 = this.m_position).x + ((col1$13 = (m_R$1 = this.m_R).col1).x * (x$9 = (center$0 = m_localOBB$2.center).x) + (col2$13 = m_R$1.col2).x * (y$9 = center$0.y));
	positionY = m_position$2.y + (col1$13.y * x$9 + col2$13.y * y$9);
	(minVertex$0 = aabb.minVertex).x = positionX - hX;
	minVertex$0.y = positionY - hY;
	(maxVertex$0 = aabb.maxVertex).x = positionX + hX;
	maxVertex$0.y = positionY + hY;
	broadPhase = this.m_body.m_world.m_broadPhase;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, aabb)) {
		this.m_proxyId = b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X(broadPhase, aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};

$__jsx_extend([b2PolyShape], b2Shape);
b2PolyShape.prototype.TestPoint$Lb2Vec2$ = function (p) {
	var pLocal;
	var i;
	var dot;
	var v$0;
	var v$2;
	var a$0;
	var tVec$x$0;
	var tVec$y$0;
	pLocal = ({x: 0, y: 0});
	pLocal.x = p.x;
	pLocal.y = p.y;
	v$0 = this.m_position;
	pLocal.x -= v$0.x;
	pLocal.y -= v$0.y;
	b2Vec2$MulTM$Lb2Vec2$Lb2Mat22$(pLocal, this.m_R);
	for (i = 0; i < this.m_vertexCount; ++ i) {
		tVec$x$0 = pLocal.x;
		tVec$y$0 = pLocal.y;
		v$2 = this.m_vertices[i];
		tVec$x$0 -= v$2.x;
		tVec$y$0 -= v$2.y;
		a$0 = this.m_normals[i];
		dot = a$0.x * tVec$x$0 + a$0.y * tVec$y$0;
		if (dot > 0.0) {
			return false;
		}
	}
	return true;
};


function b2PolyShape$TestPoint$Lb2PolyShape$Lb2Vec2$($this, p) {
	var pLocal;
	var i;
	var dot;
	var v$0;
	var v$2;
	var a$0;
	var tVec$x$0;
	var tVec$y$0;
	pLocal = ({x: 0, y: 0});
	pLocal.x = p.x;
	pLocal.y = p.y;
	v$0 = $this.m_position;
	pLocal.x -= v$0.x;
	pLocal.y -= v$0.y;
	b2Vec2$MulTM$Lb2Vec2$Lb2Mat22$(pLocal, $this.m_R);
	for (i = 0; i < $this.m_vertexCount; ++ i) {
		tVec$x$0 = pLocal.x;
		tVec$y$0 = pLocal.y;
		v$2 = $this.m_vertices[i];
		tVec$x$0 -= v$2.x;
		tVec$y$0 -= v$2.y;
		a$0 = $this.m_normals[i];
		dot = a$0.x * tVec$x$0 + a$0.y * tVec$y$0;
		if (dot > 0.0) {
			return false;
		}
	}
	return true;
};

b2PolyShape.TestPoint$Lb2PolyShape$Lb2Vec2$ = b2PolyShape$TestPoint$Lb2PolyShape$Lb2Vec2$;

b2PolyShape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
	var hX;
	var hY;
	var v1;
	var v2;
	var v3;
	var v4;
	var centerX;
	var centerY;
	var broadPhase;
	var value1$0;
	var value2$0;
	var value1$1;
	var value2$1;
	var value1$2;
	var value2$2;
	var value1$3;
	var value2$3;
	var m_localCentroid$0;
	var m_position$0;
	var m_position$1;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var R$0;
	var col1$1;
	var syncMat$0;
	var x$1;
	var y$1;
	var x$2;
	var x$3;
	var col2$1;
	var y$2;
	var x$4;
	var y$3;
	var y$4;
	var m_localCentroid$1;
	var center$0;
	var m_localOBB$1;
	var col1$2;
	var col2$2;
	var syncMat$1;
	var extents$0;
	var col1$3;
	var x$5;
	var col2$3;
	var y$5;
	var minVertex$0;
	var syncAABB$0;
	var maxVertex$0;
	var R$1;
	var x$6;
	var y$6;
	var x$7;
	var x$8;
	var y$7;
	var x$9;
	var y$8;
	var y$9;
	var m_localCentroid$2;
	var center$1;
	var m_localOBB$2;
	var col1$4;
	var col2$4;
	var syncMat$2;
	var extents$1;
	var col1$5;
	var x$10;
	var col2$5;
	var y$10;
	var minVertex$1;
	var minVertex$2;
	var maxVertex$1;
	var maxVertex$2;
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, R2);
	(m_position$0 = this.m_position).x = (m_position$1 = this.m_body.m_position).x + ((col1$0 = R2.col1).x * (x$0 = (m_localCentroid$0 = this.m_localCentroid).x) + (col2$0 = R2.col2).x * (y$0 = m_localCentroid$0.y));
	m_position$0.y = m_position$1.y + (col1$0.y * x$0 + col2$0.y * y$0);
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	v1 = R1.col1;
	v2 = R1.col2;
	v3 = (R$0 = this.m_localOBB.R).col1;
	v4 = R$0.col2;
	(col1$1 = (syncMat$0 = this.syncMat).col1).x = (x$2 = v1.x) * (x$1 = v3.x) + (x$3 = v2.x) * (y$1 = v3.y);
	col1$1.y = (y$2 = v1.y) * x$1 + (y$3 = v2.y) * y$1;
	(col2$1 = syncMat$0.col2).x = x$2 * (x$4 = v4.x) + x$3 * (y$4 = v4.y);
	col2$1.y = y$2 * x$4 + y$3 * y$4;
	b2Mat22$Abs$Lb2Mat22$(syncMat$0);
	hX = (m_localCentroid$1 = this.m_localCentroid).x + (center$0 = (m_localOBB$1 = this.m_localOBB).center).x;
	hY = m_localCentroid$1.y + center$0.y;
	centerX = position1.x + ((col1$2 = R1.col1).x * hX + (col2$2 = R1.col2).x * hY);
	centerY = position1.y + (col1$2.y * hX + col2$2.y * hY);
	hX = (col1$3 = (syncMat$1 = this.syncMat).col1).x * (x$5 = (extents$0 = m_localOBB$1.extents).x) + (col2$3 = syncMat$1.col2).x * (y$5 = extents$0.y);
	hY = col1$3.y * x$5 + col2$3.y * y$5;
	(minVertex$0 = (syncAABB$0 = this.syncAABB).minVertex).x = centerX - hX;
	minVertex$0.y = centerY - hY;
	(maxVertex$0 = syncAABB$0.maxVertex).x = centerX + hX;
	maxVertex$0.y = centerY + hY;
	v1 = R2.col1;
	v2 = R2.col2;
	v3 = (R$1 = m_localOBB$1.R).col1;
	v4 = R$1.col2;
	col1$3.x = (x$7 = v1.x) * (x$6 = v3.x) + (x$8 = v2.x) * (y$6 = v3.y);
	col1$3.y = (y$7 = v1.y) * x$6 + (y$8 = v2.y) * y$6;
	col2$3.x = x$7 * (x$9 = v4.x) + x$8 * (y$9 = v4.y);
	col2$3.y = y$7 * x$9 + y$8 * y$9;
	b2Mat22$Abs$Lb2Mat22$(syncMat$1);
	hX = (m_localCentroid$2 = this.m_localCentroid).x + (center$1 = (m_localOBB$2 = this.m_localOBB).center).x;
	hY = m_localCentroid$2.y + center$1.y;
	centerX = position2.x + ((col1$4 = R2.col1).x * hX + (col2$4 = R2.col2).x * hY);
	centerY = position2.y + (col1$4.y * hX + col2$4.y * hY);
	hX = (col1$5 = (syncMat$2 = this.syncMat).col1).x * (x$10 = (extents$1 = m_localOBB$2.extents).x) + (col2$5 = syncMat$2.col2).x * (y$10 = extents$1.y);
	hY = col1$5.y * x$10 + col2$5.y * y$10;
	(minVertex$1 = this.syncAABB.minVertex).x = (value1$0 = minVertex$1.x, value2$0 = centerX - hX, value1$0 <= value2$0 ? value1$0 : value2$0);
	(minVertex$2 = this.syncAABB.minVertex).y = (value1$1 = minVertex$2.y, value2$1 = centerY - hY, value1$1 <= value2$1 ? value1$1 : value2$1);
	(maxVertex$1 = this.syncAABB.maxVertex).x = (value1$2 = maxVertex$1.x, value2$2 = centerX + hX, value1$2 >= value2$2 ? value1$2 : value2$2);
	(maxVertex$2 = this.syncAABB.maxVertex).y = (value1$3 = maxVertex$2.y, value2$3 = centerY + hY, value1$3 >= value2$3 ? value1$3 : value2$3);
	broadPhase = this.m_body.m_world.m_broadPhase;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, this.syncAABB)) {
		b2BroadPhase$MoveProxy$Lb2BroadPhase$NLb2AABB$(broadPhase, this.m_proxyId, this.syncAABB);
	} else {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};


b2PolyShape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
	var m_localCentroid$0;
	var m_position$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, R);
	(m_position$0 = this.m_position).x = position.x + ((col1$0 = R.col1).x * (x$0 = (m_localCentroid$0 = this.m_localCentroid).x) + (col2$0 = R.col2).x * (y$0 = m_localCentroid$0.y));
	m_position$0.y = position.y + (col1$0.y * x$0 + col2$0.y * y$0);
};


b2PolyShape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
	var proxy;
	var R;
	var absR;
	var aabb;
	var proxyId$0;
	var this$0$0;
	var v$0;
	var A$0;
	var v$2;
	var v$4;
	var this$0;
	var this$4;
	var h$x$0;
	var h$y$0;
	var position$x$0;
	var position$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var m_localOBB$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var minVertex$0;
	var maxVertex$0;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	proxyId$0 = this.m_proxyId;
	proxy = (proxyId$0 === b2Pair.b2_nullProxy || (this$0$0 = broadPhase.m_proxyPool[proxyId$0], this$0$0.overlapCount !== 0x0000ffff) === false ? null : broadPhase.m_proxyPool[proxyId$0]);
	b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(broadPhase, this.m_proxyId);
	proxy = null;
	R = b2Math$b2MulMM$Lb2Mat22$Lb2Mat22$(this.m_R, this.m_localOBB.R);
	absR = b2Math$b2AbsM$Lb2Mat22$(R);
	v$0 = (m_localOBB$0 = this.m_localOBB).extents;
	h$x$0 = (col1$0 = absR.col1).x * (x$0 = v$0.x) + (col2$0 = absR.col2).x * (y$0 = v$0.y);
	h$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	A$0 = this.m_R;
	v$2 = m_localOBB$0.center;
	position$x$0 = (col1$1 = A$0.col1).x * (x$1 = v$2.x) + (col2$1 = A$0.col2).x * (y$1 = v$2.y);
	position$y$0 = col1$1.y * x$1 + col2$1.y * y$1;
	v$4 = this.m_position;
	position$x$0 += v$4.x;
	position$y$0 += v$4.y;
	aabb = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this$0 = minVertex$0 = aabb.minVertex;
	this$0.x = position$x$0;
	this$0.y = position$y$0;
	minVertex$0.x -= h$x$0;
	minVertex$0.y -= h$y$0;
	this$4 = maxVertex$0 = aabb.maxVertex;
	this$4.x = position$x$0;
	this$4.y = position$y$0;
	maxVertex$0.x += h$x$0;
	maxVertex$0.y += h$y$0;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, aabb)) {
		this.m_proxyId = b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X(broadPhase, aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};


b2PolyShape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
	var dLocalX;
	var dLocalY;
	var bestIndex;
	var bestValue;
	var i;
	var value;
	var x$0;
	var y$0;
	var m_coreVertices$0;
	var col1$0;
	var m_R$0;
	var col2$0;
	var m_coreVertices$1;
	var m_R$1;
	var m_coreVertices$2;
	var m_position$0;
	var col1$1;
	var col2$1;
	dLocalX = dX * (col1$0 = (m_R$0 = this.m_R).col1).x + dY * col1$0.y;
	dLocalY = dX * (col2$0 = m_R$0.col2).x + dY * col2$0.y;
	bestIndex = 0;
	bestValue = (m_coreVertices$1 = this.m_coreVertices)[0].x * dLocalX + m_coreVertices$1[0].y * dLocalY;
	for (i = 1; i < this.m_vertexCount; ++ i) {
		value = (m_coreVertices$0 = this.m_coreVertices)[i].x * dLocalX + m_coreVertices$0[i].y * dLocalY;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	x$0 = (m_position$0 = this.m_position).x + ((col1$1 = (m_R$1 = this.m_R).col1).x * (m_coreVertices$2 = this.m_coreVertices)[bestIndex].x + (col2$1 = m_R$1.col2).x * m_coreVertices$2[bestIndex].y);
	y$0 = m_position$0.y + (col1$1.y * m_coreVertices$2[bestIndex].x + col2$1.y * m_coreVertices$2[bestIndex].y);
	out.x = x$0;
	out.y = y$0;
};


function b2CircleShape(def, body, localCenter) {
	var rX;
	var rY;
	var aabb;
	var broadPhase;
	var x$0;
	var y$0;
	var this$2;
	var x$2;
	var y$2;
	var this$4;
	var x$4;
	var y$4;
	var m_localPosition$0;
	var localPosition$0;
	var m_R$0;
	var m_localPosition$1;
	var col1$0;
	var x$1;
	var col2$0;
	var y$1;
	var m_position$0;
	var m_position$1;
	var m_position$2;
	var m_radius$0;
	var x$3;
	var y$3;
	b2Shape.call(this, def, body);
	this.m_radius = 0;
	m_localPosition$0 = this.m_localPosition = ({x: 0, y: 0});
	x$0 = (localPosition$0 = def.localPosition).x - localCenter.x;
	y$0 = localPosition$0.y - localCenter.y;
	m_localPosition$0.x = x$0;
	m_localPosition$0.y = y$0;
	this.m_type = 0;
	this.m_radius = def.radius;
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, this.m_body.m_R);
	rX = (col1$0 = (m_R$0 = this.m_R).col1).x * (x$1 = (m_localPosition$1 = this.m_localPosition).x) + (col2$0 = m_R$0.col2).x * (y$1 = m_localPosition$1.y);
	rY = col1$0.y * x$1 + col2$0.y * y$1;
	(m_position$0 = this.m_position).x = (m_position$1 = this.m_body.m_position).x + rX;
	m_position$0.y = m_position$1.y + rY;
	this.m_maxRadius = Math.sqrt(rX * rX + rY * rY) + this.m_radius;
	aabb = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this$2 = aabb.minVertex;
	x$2 = (x$3 = (m_position$2 = this.m_position).x) - (m_radius$0 = this.m_radius);
	y$2 = (y$3 = m_position$2.y) - m_radius$0;
	this$2.x = x$2;
	this$2.y = y$2;
	this$4 = aabb.maxVertex;
	x$4 = x$3 + m_radius$0;
	y$4 = y$3 + m_radius$0;
	this$4.x = x$4;
	this$4.y = y$4;
	broadPhase = this.m_body.m_world.m_broadPhase;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, aabb)) {
		this.m_proxyId = b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X(broadPhase, aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};

$__jsx_extend([b2CircleShape], b2Shape);
b2CircleShape.prototype.TestPoint$Lb2Vec2$ = function (p) {
	var v$0;
	var d$x$0;
	var d$y$0;
	var m_radius$0;
	d$x$0 = p.x;
	d$y$0 = p.y;
	v$0 = this.m_position;
	d$x$0 -= v$0.x;
	d$y$0 -= v$0.y;
	return d$x$0 * d$x$0 + d$y$0 * d$y$0 <= (m_radius$0 = this.m_radius) * m_radius$0;
};


function b2CircleShape$TestPoint$Lb2CircleShape$Lb2Vec2$($this, p) {
	var v$0;
	var d$x$0;
	var d$y$0;
	var m_radius$0;
	d$x$0 = p.x;
	d$y$0 = p.y;
	v$0 = $this.m_position;
	d$x$0 -= v$0.x;
	d$y$0 -= v$0.y;
	return d$x$0 * d$x$0 + d$y$0 * d$y$0 <= (m_radius$0 = $this.m_radius) * m_radius$0;
};

b2CircleShape.TestPoint$Lb2CircleShape$Lb2Vec2$ = b2CircleShape$TestPoint$Lb2CircleShape$Lb2Vec2$;

b2CircleShape.prototype.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$ = function (position1, R1, position2, R2) {
	var p1X;
	var p1Y;
	var lowerX;
	var lowerY;
	var upperX;
	var upperY;
	var aabb;
	var broadPhase;
	var value2$0;
	var value2$2;
	var value2$4;
	var value2$6;
	var this$0;
	var x$0;
	var y$0;
	var this$2;
	var x$2;
	var y$2;
	var m_localPosition$0;
	var m_position$0;
	var col1$0;
	var x$1;
	var col2$0;
	var y$1;
	var m_localPosition$1;
	var col1$1;
	var x$3;
	var col2$1;
	var y$3;
	var m_radius$0;
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, R2);
	(m_position$0 = this.m_position).x = (col1$0 = R2.col1).x * (x$1 = (m_localPosition$0 = this.m_localPosition).x) + (col2$0 = R2.col2).x * (y$1 = m_localPosition$0.y) + position2.x;
	m_position$0.y = col1$0.y * x$1 + col2$0.y * y$1 + position2.y;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	p1X = position1.x + ((col1$1 = R1.col1).x * (x$3 = (m_localPosition$1 = this.m_localPosition).x) + (col2$1 = R1.col2).x * (y$3 = m_localPosition$1.y));
	p1Y = position1.y + (col1$1.y * x$3 + col2$1.y * y$3);
	value2$0 = this.m_position.x;
	lowerX = (p1X <= value2$0 ? p1X : value2$0);
	value2$2 = this.m_position.y;
	lowerY = (p1Y <= value2$2 ? p1Y : value2$2);
	value2$4 = this.m_position.x;
	upperX = (p1X >= value2$4 ? p1X : value2$4);
	value2$6 = this.m_position.y;
	upperY = (p1Y >= value2$6 ? p1Y : value2$6);
	aabb = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this$0 = aabb.minVertex;
	x$0 = lowerX - (m_radius$0 = this.m_radius);
	y$0 = lowerY - m_radius$0;
	this$0.x = x$0;
	this$0.y = y$0;
	this$2 = aabb.maxVertex;
	x$2 = upperX + m_radius$0;
	y$2 = upperY + m_radius$0;
	this$2.x = x$2;
	this$2.y = y$2;
	broadPhase = this.m_body.m_world.m_broadPhase;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, aabb)) {
		b2BroadPhase$MoveProxy$Lb2BroadPhase$NLb2AABB$(broadPhase, this.m_proxyId, aabb);
	} else {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};


b2CircleShape.prototype.QuickSync$Lb2Vec2$Lb2Mat22$ = function (position, R) {
	var m_localPosition$0;
	var m_position$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	b2Mat22$SetM$Lb2Mat22$Lb2Mat22$(this.m_R, R);
	(m_position$0 = this.m_position).x = (col1$0 = R.col1).x * (x$0 = (m_localPosition$0 = this.m_localPosition).x) + (col2$0 = R.col2).x * (y$0 = m_localPosition$0.y) + position.x;
	m_position$0.y = col1$0.y * x$0 + col2$0.y * y$0 + position.y;
};


b2CircleShape.prototype.ResetProxy$Lb2BroadPhase$ = function (broadPhase) {
	var proxy;
	var aabb;
	var proxyId$0;
	var this$0$0;
	var this$0;
	var x$0;
	var y$0;
	var this$2;
	var x$2;
	var y$2;
	var m_position$0;
	var m_radius$0;
	var x$1;
	var y$1;
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		return;
	}
	proxyId$0 = this.m_proxyId;
	proxy = (proxyId$0 === b2Pair.b2_nullProxy || (this$0$0 = broadPhase.m_proxyPool[proxyId$0], this$0$0.overlapCount !== 0x0000ffff) === false ? null : broadPhase.m_proxyPool[proxyId$0]);
	b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(broadPhase, this.m_proxyId);
	proxy = null;
	aabb = ({minVertex: ({x: 0, y: 0}), maxVertex: ({x: 0, y: 0})});
	this$0 = aabb.minVertex;
	x$0 = (x$1 = (m_position$0 = this.m_position).x) - (m_radius$0 = this.m_radius);
	y$0 = (y$1 = m_position$0.y) - m_radius$0;
	this$0.x = x$0;
	this$0.y = y$0;
	this$2 = aabb.maxVertex;
	x$2 = x$1 + m_radius$0;
	y$2 = y$1 + m_radius$0;
	this$2.x = x$2;
	this$2.y = y$2;
	if (b2BroadPhase$InRange$Lb2BroadPhase$Lb2AABB$(broadPhase, aabb)) {
		this.m_proxyId = b2BroadPhase$CreateProxy$Lb2BroadPhase$Lb2AABB$X(broadPhase, aabb, this);
	} else {
		this.m_proxyId = b2Pair.b2_nullProxy;
	}
	if (this.m_proxyId === b2Pair.b2_nullProxy) {
		b2Body$Freeze$Lb2Body$(this.m_body);
	}
};


b2CircleShape.prototype.Support$NNLb2Vec2$ = function (dX, dY, out) {
	var len;
	var x$0;
	var y$0;
	var m_position$0;
	var m_radius$0;
	len = Math.sqrt(dX * dX + dY * dY);
	dX /= len;
	dY /= len;
	x$0 = (m_position$0 = this.m_position).x + (m_radius$0 = this.m_radius) * dX;
	y$0 = m_position$0.y + m_radius$0 * dY;
	out.x = x$0;
	out.y = y$0;
};


function b2ShapeDef() {
	this.type = -1;
	this.userData = null;
	this.localPosition = ({x: 0.0, y: 0.0});
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
};

$__jsx_extend([b2ShapeDef], Object);
b2ShapeDef.prototype.ComputeMass$Lb2MassData$ = function (massData) {
	var circle;
	var box;
	var poly;
	var this$0;
	var this$2;
	var this$4;
	var this$6;
	var radius$0;
	var mass$0;
	var extents$0;
	var mass$1;
	massData.center = ({x: 0.0, y: 0.0});
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
		mass$0 = massData.mass = this.density * 3.141592653589793 * (radius$0 = circle.radius) * radius$0;
		this$2 = massData.center;
		this$2.x = 0.0;
		this$2.y = 0.0;
		massData.I = 0.5 * mass$0 * radius$0 * radius$0;
		break;
	case 1:
		box = this;
		mass$1 = massData.mass = 4.0 * this.density * (extents$0 = box.extents).x * extents$0.y;
		this$4 = massData.center;
		this$4.x = 0.0;
		this$4.y = 0.0;
		massData.I = mass$1 / 3.0 * (extents$0, extents$0, extents$0.x * extents$0.x + extents$0.y * extents$0.y);
		break;
	case 2:
		poly = this;
		b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN(massData, poly.vertices, poly.vertexCount, this.density);
		break;
	default:
		massData.mass = 0.0;
		this$6 = massData.center;
		this$6.x = 0.0;
		this$6.y = 0.0;
		massData.I = 0.0;
		break;
	}
};


function b2ShapeDef$ComputeMass$Lb2ShapeDef$Lb2MassData$($this, massData) {
	var circle;
	var box;
	var poly;
	var this$0;
	var this$2;
	var this$4;
	var this$6;
	var radius$0;
	var mass$0;
	var extents$0;
	var mass$1;
	massData.center = ({x: 0.0, y: 0.0});
	if ($this.density === 0.0) {
		massData.mass = 0.0;
		this$0 = massData.center;
		this$0.x = 0.0;
		this$0.y = 0.0;
		massData.I = 0.0;
	}
	switch ($this.type) {
	case 0:
		circle = $this;
		mass$0 = massData.mass = $this.density * 3.141592653589793 * (radius$0 = circle.radius) * radius$0;
		this$2 = massData.center;
		this$2.x = 0.0;
		this$2.y = 0.0;
		massData.I = 0.5 * mass$0 * radius$0 * radius$0;
		break;
	case 1:
		box = $this;
		mass$1 = massData.mass = 4.0 * $this.density * (extents$0 = box.extents).x * extents$0.y;
		this$4 = massData.center;
		this$4.x = 0.0;
		this$4.y = 0.0;
		massData.I = mass$1 / 3.0 * (extents$0, extents$0, extents$0.x * extents$0.x + extents$0.y * extents$0.y);
		break;
	case 2:
		poly = $this;
		b2Shape$PolyMass$Lb2MassData$ALb2Vec2$NN(massData, poly.vertices, poly.vertexCount, $this.density);
		break;
	default:
		massData.mass = 0.0;
		this$6 = massData.center;
		this$6.x = 0.0;
		this$6.y = 0.0;
		massData.I = 0.0;
		break;
	}
};

b2ShapeDef.ComputeMass$Lb2ShapeDef$Lb2MassData$ = b2ShapeDef$ComputeMass$Lb2ShapeDef$Lb2MassData$;

function b2PolyDef() {
	var i;
	var vertices$0;
	b2ShapeDef.call(this);
	this.vertexCount = 0;
	this.type = -1;
	this.userData = null;
	this.localPosition = ({x: 0.0, y: 0.0});
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	vertices$0 = this.vertices = [  ];
	vertices$0.length = 16;
	this.type = 2;
	this.vertexCount = 0;
	for (i = 0; i < 16; i++) {
		this.vertices[i] = ({x: 0, y: 0});
	}
};

$__jsx_extend([b2PolyDef], b2ShapeDef);
function b2CircleDef() {
	b2ShapeDef.call(this);
	this.type = -1;
	this.userData = null;
	this.localPosition = ({x: 0.0, y: 0.0});
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

$__jsx_extend([b2CircleDef], b2ShapeDef);
function b2BoxDef() {
	b2ShapeDef.call(this);
	this.type = -1;
	this.userData = null;
	this.localPosition = ({x: 0.0, y: 0.0});
	this.localRotation = 0.0;
	this.friction = 0.2;
	this.restitution = 0.0;
	this.density = 0.0;
	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;
	this.groupIndex = 0;
	this.type = 1;
	this.extents = ({x: 1.0, y: 1.0});
};

$__jsx_extend([b2BoxDef], b2ShapeDef);
function b2Body(bd, world) {
	var i;
	var sd;
	var massData;
	var massDatas;
	var shape;
	var this$0;
	var v$0;
	var this$2;
	var v$2;
	var a$0;
	var b$0$0;
	var a$2;
	var b$0$2;
	var this$4;
	var a$4;
	var this$6;
	var b$0;
	var a$9;
	var this$8;
	var A$1;
	var a$12;
	var b$5;
	var s$1;
	var a$14;
	var r$x$0;
	var r$y$0;
	var v$4$x$0;
	var v$4$y$0;
	var a$6$x$0;
	var a$6$y$0;
	var b$3$x$0;
	var b$3$y$0;
	var m_rotation$0;
	var mass$0;
	var m_center$0;
	var localPosition$0;
	var center$0;
	var m_center$1;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	this.m_rotation = 0;
	this.m_rotation0 = 0;
	this.m_linearVelocity = null;
	this.m_angularVelocity = 0;
	this.m_force = null;
	this.m_torque = 0;
	this.m_center = null;
	this.m_world = null;
	this.m_prev = null;
	this.m_next = null;
	this.m_shapeList = null;
	this.m_shapeCount = 0;
	this.m_jointList = null;
	this.m_contactList = null;
	this.m_mass = 0;
	this.m_invMass = 0;
	this.m_I = 0;
	this.m_invI = 0;
	this.m_linearDamping = 0;
	this.m_angularDamping = 0;
	this.m_sleepTime = 0;
	this.m_userData = null;
	this.sMat0 = new b2Mat22$1();
	this.m_position = ({x: 0, y: 0});
	this.m_R = new b2Mat22$0(0);
	this.m_position0 = ({x: 0, y: 0});
	i = 0;
	this.m_flags = 0;
	this$0 = this.m_position;
	v$0 = bd.position;
	this$0.x = v$0.x;
	this$0.y = v$0.y;
	m_rotation$0 = this.m_rotation = bd.rotation;
	b2Mat22$Set$Lb2Mat22$N(this.m_R, m_rotation$0);
	this$2 = this.m_position0;
	v$2 = this.m_position;
	this$2.x = v$2.x;
	this$2.y = v$2.y;
	this.m_rotation0 = this.m_rotation;
	this.m_world = world;
	a$0 = 1.0 - bd.linearDamping;
	b$0$0 = (a$0 < 1.0 ? a$0 : 1.0);
	this.m_linearDamping = (0.0 > b$0$0 ? 0.0 : b$0$0);
	a$2 = 1.0 - bd.angularDamping;
	b$0$2 = (a$2 < 1.0 ? a$2 : 1.0);
	this.m_angularDamping = (0.0 > b$0$2 ? 0.0 : b$0$2);
	this.m_force = ({x: 0.0, y: 0.0});
	this.m_torque = 0.0;
	this.m_mass = 0.0;
	massDatas = [  ];
	massDatas.length = 64;
	for (i = 0; i < 64; i++) {
		massDatas[i] = ({mass: 0.0, I: 0.0, center: ({x: 0, y: 0})});
	}
	this.m_shapeCount = 0;
	this.m_center = ({x: 0.0, y: 0.0});
	for (i = 0; i < 64; ++ i) {
		sd = bd.shapes[i];
		if (sd == null) {
			break;
		}
		massData = massDatas[i];
		b2ShapeDef$ComputeMass$Lb2ShapeDef$Lb2MassData$(sd, massData);
		this.m_mass += mass$0 = massData.mass;
		(m_center$0 = this.m_center).x += mass$0 * ((localPosition$0 = sd.localPosition).x + (center$0 = massData.center).x);
		m_center$0.y += mass$0 * (localPosition$0.y + center$0.y);
		++ this.m_shapeCount;
	}
	if (this.m_mass > 0.0) {
		this$4 = m_center$1 = this.m_center;
		a$4 = 1.0 / this.m_mass;
		this$4.x *= a$4;
		this$4.y *= a$4;
		this$6 = this.m_position;
		A$1 = this.m_R;
		v$4$x$0 = (col1$0 = A$1.col1).x * (x$0 = m_center$1.x) + (col2$0 = A$1.col2).x * (y$0 = m_center$1.y);
		v$4$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
		this$6.x += v$4$x$0;
		this$6.y += v$4$y$0;
	} else {
		this.m_flags |= 0x0001;
	}
	this.m_I = 0.0;
	for (i = 0; i < this.m_shapeCount; ++ i) {
		sd = bd.shapes[i];
		massData = massDatas[i];
		this.m_I += massData.I;
		a$12 = sd.localPosition;
		b$5 = massData.center;
		a$6$x$0 = a$12.x + b$5.x;
		a$6$y$0 = a$12.y + b$5.y;
		b$0 = this.m_center;
		r$x$0 = a$6$x$0 - b$0.x;
		r$y$0 = a$6$y$0 - b$0.y;
		this.m_I += massData.mass * (r$x$0 * r$x$0 + r$y$0 * r$y$0);
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
	a$9 = bd.linearVelocity;
	s$1 = bd.angularVelocity;
	a$14 = this.m_center;
	b$3$x$0 = - s$1 * a$14.y;
	b$3$y$0 = s$1 * a$14.x;
	this.m_linearVelocity = ({x: a$9.x + b$3$x$0, y: a$9.y + b$3$y$0});
	this.m_angularVelocity = bd.angularVelocity;
	this.m_jointList = null;
	this.m_contactList = null;
	this.m_prev = null;
	this.m_next = null;
	this.m_shapeList = null;
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
		this$8 = this.m_linearVelocity;
		this$8.x = 0.0;
		this$8.y = 0.0;
		this.m_angularVelocity = 0.0;
	}
	this.m_userData = bd.userData;
};

$__jsx_extend([b2Body], Object);
b2Body.prototype.SetOriginPosition$Lb2Vec2$N = function (position, rotation) {
	var s;
	var this$0;
	var this$2;
	var A$1;
	var v$3;
	var b$0$x$0;
	var b$0$y$0;
	var m_position$0;
	var m_R$0;
	var m_rotation$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var m_position$1;
	if ((this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	m_rotation$0 = this.m_rotation = rotation;
	b2Mat22$Set$Lb2Mat22$N(this.m_R, m_rotation$0);
	A$1 = this.m_R;
	v$3 = this.m_center;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = v$3.x) + (col2$0 = A$1.col2).x * (y$0 = v$3.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	m_position$1 = this.m_position = ({x: position.x + b$0$x$0, y: position.y + b$0$y$0});
	this$0 = this.m_position0;
	this$0.x = m_position$1.x;
	this$0.y = m_position$1.y;
	this.m_rotation0 = this.m_rotation;
	for (s = this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(m_position$0 = this.m_position, m_R$0 = this.m_R, m_position$0, m_R$0);
	}
	this$2 = this.m_world.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$2.m_pairManager);
};


function b2Body$SetOriginPosition$Lb2Body$Lb2Vec2$N($this, position, rotation) {
	var s;
	var this$0;
	var this$2;
	var A$1;
	var v$3;
	var b$0$x$0;
	var b$0$y$0;
	var m_position$0;
	var m_R$0;
	var m_rotation$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var m_position$1;
	if (($this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	m_rotation$0 = $this.m_rotation = rotation;
	b2Mat22$Set$Lb2Mat22$N($this.m_R, m_rotation$0);
	A$1 = $this.m_R;
	v$3 = $this.m_center;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = v$3.x) + (col2$0 = A$1.col2).x * (y$0 = v$3.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	m_position$1 = $this.m_position = ({x: position.x + b$0$x$0, y: position.y + b$0$y$0});
	this$0 = $this.m_position0;
	this$0.x = m_position$1.x;
	this$0.y = m_position$1.y;
	$this.m_rotation0 = $this.m_rotation;
	for (s = $this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(m_position$0 = $this.m_position, m_R$0 = $this.m_R, m_position$0, m_R$0);
	}
	this$2 = $this.m_world.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$2.m_pairManager);
};

b2Body.SetOriginPosition$Lb2Body$Lb2Vec2$N = b2Body$SetOriginPosition$Lb2Body$Lb2Vec2$N;

b2Body.prototype.GetOriginPosition$ = function () {
	var a$0;
	var A$1;
	var v$1;
	var b$0$x$0;
	var b$0$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	a$0 = this.m_position;
	A$1 = this.m_R;
	v$1 = this.m_center;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = v$1.x) + (col2$0 = A$1.col2).x * (y$0 = v$1.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	return ({x: a$0.x - b$0$x$0, y: a$0.y - b$0$y$0});
};


function b2Body$GetOriginPosition$Lb2Body$($this) {
	var a$0;
	var A$1;
	var v$1;
	var b$0$x$0;
	var b$0$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	a$0 = $this.m_position;
	A$1 = $this.m_R;
	v$1 = $this.m_center;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = v$1.x) + (col2$0 = A$1.col2).x * (y$0 = v$1.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	return ({x: a$0.x - b$0$x$0, y: a$0.y - b$0$y$0});
};

b2Body.GetOriginPosition$Lb2Body$ = b2Body$GetOriginPosition$Lb2Body$;

b2Body.prototype.SetCenterPosition$Lb2Vec2$N = function (position, rotation) {
	var s;
	var this$0;
	var this$2;
	var this$4;
	var m_position$0;
	var m_R$0;
	var m_rotation$0;
	var m_position$1;
	if ((this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	m_rotation$0 = this.m_rotation = rotation;
	b2Mat22$Set$Lb2Mat22$N(this.m_R, m_rotation$0);
	this$0 = m_position$1 = this.m_position;
	this$0.x = position.x;
	this$0.y = position.y;
	this$2 = this.m_position0;
	this$2.x = m_position$1.x;
	this$2.y = m_position$1.y;
	this.m_rotation0 = this.m_rotation;
	for (s = this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(m_position$0 = this.m_position, m_R$0 = this.m_R, m_position$0, m_R$0);
	}
	this$4 = this.m_world.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$4.m_pairManager);
};


function b2Body$SetCenterPosition$Lb2Body$Lb2Vec2$N($this, position, rotation) {
	var s;
	var this$0;
	var this$2;
	var this$4;
	var m_position$0;
	var m_R$0;
	var m_rotation$0;
	var m_position$1;
	if (($this.m_flags & 0x0002) === 0x0002) {
		return;
	}
	m_rotation$0 = $this.m_rotation = rotation;
	b2Mat22$Set$Lb2Mat22$N($this.m_R, m_rotation$0);
	this$0 = m_position$1 = $this.m_position;
	this$0.x = position.x;
	this$0.y = position.y;
	this$2 = $this.m_position0;
	this$2.x = m_position$1.x;
	this$2.y = m_position$1.y;
	$this.m_rotation0 = $this.m_rotation;
	for (s = $this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(m_position$0 = $this.m_position, m_R$0 = $this.m_R, m_position$0, m_R$0);
	}
	this$4 = $this.m_world.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$4.m_pairManager);
};

b2Body.SetCenterPosition$Lb2Body$Lb2Vec2$N = b2Body$SetCenterPosition$Lb2Body$Lb2Vec2$N;

b2Body.prototype.GetCenterPosition$ = function () {
	return this.m_position;
};


function b2Body$GetCenterPosition$Lb2Body$($this) {
	return $this.m_position;
};

b2Body.GetCenterPosition$Lb2Body$ = b2Body$GetCenterPosition$Lb2Body$;

b2Body.prototype.GetRotation$ = function () {
	return this.m_rotation;
};


function b2Body$GetRotation$Lb2Body$($this) {
	return $this.m_rotation;
};

b2Body.GetRotation$Lb2Body$ = b2Body$GetRotation$Lb2Body$;

b2Body.prototype.GetRotationMatrix$ = function () {
	return this.m_R;
};


function b2Body$GetRotationMatrix$Lb2Body$($this) {
	return $this.m_R;
};

b2Body.GetRotationMatrix$Lb2Body$ = b2Body$GetRotationMatrix$Lb2Body$;

b2Body.prototype.SetLinearVelocity$Lb2Vec2$ = function (v) {
	var this$0;
	this$0 = this.m_linearVelocity;
	this$0.x = v.x;
	this$0.y = v.y;
};


function b2Body$SetLinearVelocity$Lb2Body$Lb2Vec2$($this, v) {
	var this$0;
	this$0 = $this.m_linearVelocity;
	this$0.x = v.x;
	this$0.y = v.y;
};

b2Body.SetLinearVelocity$Lb2Body$Lb2Vec2$ = b2Body$SetLinearVelocity$Lb2Body$Lb2Vec2$;

b2Body.prototype.GetLinearVelocity$ = function () {
	return this.m_linearVelocity;
};


function b2Body$GetLinearVelocity$Lb2Body$($this) {
	return $this.m_linearVelocity;
};

b2Body.GetLinearVelocity$Lb2Body$ = b2Body$GetLinearVelocity$Lb2Body$;

b2Body.prototype.SetAngularVelocity$N = function (w) {
	this.m_angularVelocity = w;
};


function b2Body$SetAngularVelocity$Lb2Body$N($this, w) {
	$this.m_angularVelocity = w;
};

b2Body.SetAngularVelocity$Lb2Body$N = b2Body$SetAngularVelocity$Lb2Body$N;

b2Body.prototype.GetAngularVelocity$ = function () {
	return this.m_angularVelocity;
};


function b2Body$GetAngularVelocity$Lb2Body$($this) {
	return $this.m_angularVelocity;
};

b2Body.GetAngularVelocity$Lb2Body$ = b2Body$GetAngularVelocity$Lb2Body$;

b2Body.prototype.ApplyForce$Lb2Vec2$Lb2Vec2$ = function (force, point) {
	var this$0;
	var b$1;
	var a$0$x$0;
	var a$0$y$0;
	var y$0;
	var x$0;
	if (((this.m_flags & 0x0008) === 0x0008) === false) {
		this$0 = this.m_force;
		this$0.x += x$0 = force.x;
		this$0.y += y$0 = force.y;
		b$1 = this.m_position;
		a$0$x$0 = point.x - b$1.x;
		a$0$y$0 = point.y - b$1.y;
		this.m_torque += a$0$x$0 * y$0 - a$0$y$0 * x$0;
	}
};


function b2Body$ApplyForce$Lb2Body$Lb2Vec2$Lb2Vec2$($this, force, point) {
	var this$0;
	var b$1;
	var a$0$x$0;
	var a$0$y$0;
	var y$0;
	var x$0;
	if ((($this.m_flags & 0x0008) === 0x0008) === false) {
		this$0 = $this.m_force;
		this$0.x += x$0 = force.x;
		this$0.y += y$0 = force.y;
		b$1 = $this.m_position;
		a$0$x$0 = point.x - b$1.x;
		a$0$y$0 = point.y - b$1.y;
		$this.m_torque += a$0$x$0 * y$0 - a$0$y$0 * x$0;
	}
};

b2Body.ApplyForce$Lb2Body$Lb2Vec2$Lb2Vec2$ = b2Body$ApplyForce$Lb2Body$Lb2Vec2$Lb2Vec2$;

b2Body.prototype.ApplyTorque$N = function (torque) {
	if (((this.m_flags & 0x0008) === 0x0008) === false) {
		this.m_torque += torque;
	}
};


function b2Body$ApplyTorque$Lb2Body$N($this, torque) {
	if ((($this.m_flags & 0x0008) === 0x0008) === false) {
		$this.m_torque += torque;
	}
};

b2Body.ApplyTorque$Lb2Body$N = b2Body$ApplyTorque$Lb2Body$N;

b2Body.prototype.ApplyImpulse$Lb2Vec2$Lb2Vec2$ = function (impulse, point) {
	var this$0;
	var b$0;
	var a$0;
	var s$1;
	var v$0$x$0;
	var v$0$y$0;
	if (((this.m_flags & 0x0008) === 0x0008) === false) {
		this$0 = this.m_linearVelocity;
		s$1 = this.m_invMass;
		v$0$x$0 = s$1 * impulse.x;
		v$0$y$0 = s$1 * impulse.y;
		this$0.x += v$0$x$0;
		this$0.y += v$0$y$0;
		this.m_angularVelocity += this.m_invI * (a$0 = (b$0 = this.m_position, ({x: point.x - b$0.x, y: point.y - b$0.y})), a$0.x * impulse.y - a$0.y * impulse.x);
	}
};


function b2Body$ApplyImpulse$Lb2Body$Lb2Vec2$Lb2Vec2$($this, impulse, point) {
	var this$0;
	var b$0;
	var a$0;
	var s$1;
	var v$0$x$0;
	var v$0$y$0;
	if ((($this.m_flags & 0x0008) === 0x0008) === false) {
		this$0 = $this.m_linearVelocity;
		s$1 = $this.m_invMass;
		v$0$x$0 = s$1 * impulse.x;
		v$0$y$0 = s$1 * impulse.y;
		this$0.x += v$0$x$0;
		this$0.y += v$0$y$0;
		$this.m_angularVelocity += $this.m_invI * (a$0 = (b$0 = $this.m_position, ({x: point.x - b$0.x, y: point.y - b$0.y})), a$0.x * impulse.y - a$0.y * impulse.x);
	}
};

b2Body.ApplyImpulse$Lb2Body$Lb2Vec2$Lb2Vec2$ = b2Body$ApplyImpulse$Lb2Body$Lb2Vec2$Lb2Vec2$;

b2Body.prototype.GetMass$ = function () {
	return this.m_mass;
};


function b2Body$GetMass$Lb2Body$($this) {
	return $this.m_mass;
};

b2Body.GetMass$Lb2Body$ = b2Body$GetMass$Lb2Body$;

b2Body.prototype.GetInertia$ = function () {
	return this.m_I;
};


function b2Body$GetInertia$Lb2Body$($this) {
	return $this.m_I;
};

b2Body.GetInertia$Lb2Body$ = b2Body$GetInertia$Lb2Body$;

b2Body.prototype.GetWorldPoint$Lb2Vec2$ = function (localPoint) {
	var a$0;
	var A$1;
	var b$0$x$0;
	var b$0$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	a$0 = this.m_position;
	A$1 = this.m_R;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = localPoint.x) + (col2$0 = A$1.col2).x * (y$0 = localPoint.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	return ({x: a$0.x + b$0$x$0, y: a$0.y + b$0$y$0});
};


function b2Body$GetWorldPoint$Lb2Body$Lb2Vec2$($this, localPoint) {
	var a$0;
	var A$1;
	var b$0$x$0;
	var b$0$y$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	a$0 = $this.m_position;
	A$1 = $this.m_R;
	b$0$x$0 = (col1$0 = A$1.col1).x * (x$0 = localPoint.x) + (col2$0 = A$1.col2).x * (y$0 = localPoint.y);
	b$0$y$0 = col1$0.y * x$0 + col2$0.y * y$0;
	return ({x: a$0.x + b$0$x$0, y: a$0.y + b$0$y$0});
};

b2Body.GetWorldPoint$Lb2Body$Lb2Vec2$ = b2Body$GetWorldPoint$Lb2Body$Lb2Vec2$;

b2Body.prototype.GetWorldVector$Lb2Vec2$ = function (localVector) {
	var A$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	A$0 = this.m_R;
	return ({x: (col1$0 = A$0.col1).x * (x$0 = localVector.x) + (col2$0 = A$0.col2).x * (y$0 = localVector.y), y: col1$0.y * x$0 + col2$0.y * y$0});
};


function b2Body$GetWorldVector$Lb2Body$Lb2Vec2$($this, localVector) {
	var A$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	A$0 = $this.m_R;
	return ({x: (col1$0 = A$0.col1).x * (x$0 = localVector.x) + (col2$0 = A$0.col2).x * (y$0 = localVector.y), y: col1$0.y * x$0 + col2$0.y * y$0});
};

b2Body.GetWorldVector$Lb2Body$Lb2Vec2$ = b2Body$GetWorldVector$Lb2Body$Lb2Vec2$;

b2Body.prototype.GetLocalPoint$Lb2Vec2$ = function (worldPoint) {
	var b$0;
	return b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$(this.m_R, (b$0 = this.m_position, ({x: worldPoint.x - b$0.x, y: worldPoint.y - b$0.y})));
};


function b2Body$GetLocalPoint$Lb2Body$Lb2Vec2$($this, worldPoint) {
	var b$0;
	return b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$($this.m_R, (b$0 = $this.m_position, ({x: worldPoint.x - b$0.x, y: worldPoint.y - b$0.y})));
};

b2Body.GetLocalPoint$Lb2Body$Lb2Vec2$ = b2Body$GetLocalPoint$Lb2Body$Lb2Vec2$;

b2Body.prototype.GetLocalVector$Lb2Vec2$ = function (worldVector) {
	return b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$(this.m_R, worldVector);
};


function b2Body$GetLocalVector$Lb2Body$Lb2Vec2$($this, worldVector) {
	return b2Math$b2MulTMV$Lb2Mat22$Lb2Vec2$($this.m_R, worldVector);
};

b2Body.GetLocalVector$Lb2Body$Lb2Vec2$ = b2Body$GetLocalVector$Lb2Body$Lb2Vec2$;

b2Body.prototype.IsStatic$ = function () {
	return (this.m_flags & 0x0001) === 0x0001;
};


function b2Body$IsStatic$Lb2Body$($this) {
	return ($this.m_flags & 0x0001) === 0x0001;
};

b2Body.IsStatic$Lb2Body$ = b2Body$IsStatic$Lb2Body$;

b2Body.prototype.IsFrozen$ = function () {
	return (this.m_flags & 0x0002) === 0x0002;
};


function b2Body$IsFrozen$Lb2Body$($this) {
	return ($this.m_flags & 0x0002) === 0x0002;
};

b2Body.IsFrozen$Lb2Body$ = b2Body$IsFrozen$Lb2Body$;

b2Body.prototype.IsSleeping$ = function () {
	return (this.m_flags & 0x0008) === 0x0008;
};


function b2Body$IsSleeping$Lb2Body$($this) {
	return ($this.m_flags & 0x0008) === 0x0008;
};

b2Body.IsSleeping$Lb2Body$ = b2Body$IsSleeping$Lb2Body$;

b2Body.prototype.AllowSleeping$B = function (flag) {
	if (flag) {
		this.m_flags |= 0x0010;
	} else {
		this.m_flags &= -17;
		this.m_flags &= -9;
		this.m_sleepTime = 0.0;
	}
};


function b2Body$AllowSleeping$Lb2Body$B($this, flag) {
	if (flag) {
		$this.m_flags |= 0x0010;
	} else {
		$this.m_flags &= -17;
		$this.m_flags &= -9;
		$this.m_sleepTime = 0.0;
	}
};

b2Body.AllowSleeping$Lb2Body$B = b2Body$AllowSleeping$Lb2Body$B;

b2Body.prototype.WakeUp$ = function () {
	this.m_flags &= -9;
	this.m_sleepTime = 0.0;
};


function b2Body$WakeUp$Lb2Body$($this) {
	$this.m_flags &= -9;
	$this.m_sleepTime = 0.0;
};

b2Body.WakeUp$Lb2Body$ = b2Body$WakeUp$Lb2Body$;

b2Body.prototype.GetShapeList$ = function () {
	return this.m_shapeList;
};


function b2Body$GetShapeList$Lb2Body$($this) {
	return $this.m_shapeList;
};

b2Body.GetShapeList$Lb2Body$ = b2Body$GetShapeList$Lb2Body$;

b2Body.prototype.GetContactList$ = function () {
	return this.m_contactList;
};


function b2Body$GetContactList$Lb2Body$($this) {
	return $this.m_contactList;
};

b2Body.GetContactList$Lb2Body$ = b2Body$GetContactList$Lb2Body$;

b2Body.prototype.GetJointList$ = function () {
	return this.m_jointList;
};


function b2Body$GetJointList$Lb2Body$($this) {
	return $this.m_jointList;
};

b2Body.GetJointList$Lb2Body$ = b2Body$GetJointList$Lb2Body$;

b2Body.prototype.GetNext$ = function () {
	return this.m_next;
};


function b2Body$GetNext$Lb2Body$($this) {
	return $this.m_next;
};

b2Body.GetNext$Lb2Body$ = b2Body$GetNext$Lb2Body$;

b2Body.prototype.GetUserData$ = function () {
	return this.m_userData;
};


function b2Body$GetUserData$Lb2Body$($this) {
	return $this.m_userData;
};

b2Body.GetUserData$Lb2Body$ = b2Body$GetUserData$Lb2Body$;

b2Body.prototype.Destroy$ = function () {
	var s;
	var s0;
	s = this.m_shapeList;
	while (s != null) {
		s0 = s;
		s = s.m_next;
		if (s0.m_proxyId !== b2Pair.b2_nullProxy) {
			b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s0.m_body.m_world.m_broadPhase, s0.m_proxyId);
		}
	}
};


function b2Body$Destroy$Lb2Body$($this) {
	var s;
	var s0;
	s = $this.m_shapeList;
	while (s != null) {
		s0 = s;
		s = s.m_next;
		if (s0.m_proxyId !== b2Pair.b2_nullProxy) {
			b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s0.m_body.m_world.m_broadPhase, s0.m_proxyId);
		}
	}
};

b2Body.Destroy$Lb2Body$ = b2Body$Destroy$Lb2Body$;

b2Body.prototype.SynchronizeShapes$ = function () {
	var s;
	b2Mat22$Set$Lb2Mat22$N(this.sMat0, this.m_rotation0);
	for (s = this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(this.m_position0, this.sMat0, this.m_position, this.m_R);
	}
};


function b2Body$SynchronizeShapes$Lb2Body$($this) {
	var s;
	b2Mat22$Set$Lb2Mat22$N($this.sMat0, $this.m_rotation0);
	for (s = $this.m_shapeList; s != null; s = s.m_next) {
		s.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$($this.m_position0, $this.sMat0, $this.m_position, $this.m_R);
	}
};

b2Body.SynchronizeShapes$Lb2Body$ = b2Body$SynchronizeShapes$Lb2Body$;

b2Body.prototype.QuickSyncShapes$ = function () {
	var s;
	for (s = this.m_shapeList; s != null; s = s.m_next) {
		s.QuickSync$Lb2Vec2$Lb2Mat22$(this.m_position, this.m_R);
	}
};


function b2Body$QuickSyncShapes$Lb2Body$($this) {
	var s;
	for (s = $this.m_shapeList; s != null; s = s.m_next) {
		s.QuickSync$Lb2Vec2$Lb2Mat22$($this.m_position, $this.m_R);
	}
};

b2Body.QuickSyncShapes$Lb2Body$ = b2Body$QuickSyncShapes$Lb2Body$;

b2Body.prototype.IsConnected$X = function (other) {
	return false;
};


function b2Body$IsConnected$Lb2Body$X($this, other) {
	return false;
};

b2Body.IsConnected$Lb2Body$X = b2Body$IsConnected$Lb2Body$X;

b2Body.prototype.Freeze$ = function () {
	var s;
	var this$0;
	this.m_flags |= 0x0002;
	this$0 = this.m_linearVelocity;
	this$0.x = 0;
	this$0.y = 0;
	this.m_angularVelocity = 0.0;
	for (s = this.m_shapeList; s != null; s = s.m_next) {
		if (s.m_proxyId !== b2Pair.b2_nullProxy) {
			b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s.m_body.m_world.m_broadPhase, s.m_proxyId);
			s.m_proxyId = b2Pair.b2_nullProxy;
		}
	}
};


function b2Body$Freeze$Lb2Body$($this) {
	var s;
	var this$0;
	$this.m_flags |= 0x0002;
	this$0 = $this.m_linearVelocity;
	this$0.x = 0;
	this$0.y = 0;
	$this.m_angularVelocity = 0.0;
	for (s = $this.m_shapeList; s != null; s = s.m_next) {
		if (s.m_proxyId !== b2Pair.b2_nullProxy) {
			b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s.m_body.m_world.m_broadPhase, s.m_proxyId);
			s.m_proxyId = b2Pair.b2_nullProxy;
		}
	}
};

b2Body.Freeze$Lb2Body$ = b2Body$Freeze$Lb2Body$;

function b2BodyDef() {
	var i;
	this.position = null;
	this.rotation = 0;
	this.linearVelocity = null;
	this.angularVelocity = 0;
	this.linearDamping = 0;
	this.angularDamping = 0;
	this.allowSleep = false;
	this.isSleeping = false;
	this.preventRotation = false;
	this.shapes = [  ];
	this.userData = null;
	for (i = 0; i < 64; i++) {
		this.shapes[i] = null;
	}
	this.position = ({x: 0.0, y: 0.0});
	this.rotation = 0.0;
	this.linearVelocity = ({x: 0.0, y: 0.0});
	this.angularVelocity = 0.0;
	this.linearDamping = 0.0;
	this.angularDamping = 0.0;
	this.allowSleep = true;
	this.isSleeping = false;
	this.preventRotation = false;
};

$__jsx_extend([b2BodyDef], Object);
b2BodyDef.prototype.AddShape$Lb2ShapeDef$ = function (shape) {
	var i;
	for (i = 0; i < 64; ++ i) {
		if (this.shapes[i] == null) {
			this.shapes[i] = shape;
			break;
		}
	}
};


function b2BodyDef$AddShape$Lb2BodyDef$Lb2ShapeDef$($this, shape) {
	var i;
	for (i = 0; i < 64; ++ i) {
		if ($this.shapes[i] == null) {
			$this.shapes[i] = shape;
			break;
		}
	}
};

b2BodyDef.AddShape$Lb2BodyDef$Lb2ShapeDef$ = b2BodyDef$AddShape$Lb2BodyDef$Lb2ShapeDef$;

function b2CollisionFilter() {
};

$__jsx_extend([b2CollisionFilter], Object);
function b2CollisionFilter$ShouldCollide$Lb2CollisionFilter$Lb2Shape$Lb2Shape$($this, shape1, shape2) {
	var collide;
	var m_groupIndex$0;
	if ((m_groupIndex$0 = shape1.m_groupIndex) === shape2.m_groupIndex && m_groupIndex$0 !== 0) {
		return shape1.m_groupIndex > 0;
	}
	collide = (shape1.m_maskBits & shape2.m_categoryBits) !== 0 && (shape1.m_categoryBits & shape2.m_maskBits) !== 0;
	return collide;
};

b2CollisionFilter.ShouldCollide$Lb2CollisionFilter$Lb2Shape$Lb2Shape$ = b2CollisionFilter$ShouldCollide$Lb2CollisionFilter$Lb2Shape$Lb2Shape$;

function b2ContactManager() {
	this.m_nullContact = new b2NullContact$0();
	this.m_world = null;
	this.m_destroyImmediate = false;
};

$__jsx_extend([b2ContactManager], b2PairCallback);
b2ContactManager.prototype.PairAdded$XX = function (proxyUserData1, proxyUserData2) {
	var shape1;
	var shape2;
	var body1;
	var body2;
	var tempShape;
	var tempBody;
	var contact;
	var m_filter$0;
	var m_contactList$0;
	var m_world$2;
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
	if (b2Body$IsConnected$Lb2Body$X(body2, body1)) {
		return this.m_nullContact;
	}
	if ((m_filter$0 = this.m_world.m_filter) != null && b2CollisionFilter$ShouldCollide$Lb2CollisionFilter$Lb2Shape$Lb2Shape$(m_filter$0, shape1, shape2) === false) {
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
	if (contact == null) {
		return this.m_nullContact;
	} else {
		contact.m_prev = null;
		contact.m_next = m_contactList$0 = this.m_world.m_contactList;
		if (m_contactList$0 != null) {
			this.m_world.m_contactList.m_prev = contact;
		}
		(m_world$2 = this.m_world).m_contactList = contact;
		m_world$2.m_contactCount++;
	}
	return contact;
};


b2ContactManager.prototype.PairRemoved$XXX = function (proxyUserData1, proxyUserData2, pairUserData) {
	var c;
	if (pairUserData == null) {
		return;
	}
	c = pairUserData;
	if (c != this.m_nullContact) {
		if (this.m_destroyImmediate === true) {
			b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$(this, c);
			c = null;
		} else {
			c.m_flags |= 0x0002;
		}
	}
};


b2ContactManager.prototype.DestroyContact$Lb2Contact$ = function (c) {
	var body1;
	var body2;
	var node1;
	var node2;
	if (c.m_prev != null) {
		c.m_prev.m_next = c.m_next;
	}
	if (c.m_next != null) {
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
		body1.m_flags &= -9;
		body1.m_sleepTime = 0.0;
		body2.m_flags &= -9;
		body2.m_sleepTime = 0.0;
		if (node1.prev != null) {
			node1.prev.next = node1.next;
		}
		if (node1.next != null) {
			node1.next.prev = node1.prev;
		}
		if (node1 == body1.m_contactList) {
			body1.m_contactList = node1.next;
		}
		node1.prev = null;
		node1.next = null;
		if (node2.prev != null) {
			node2.prev.next = node2.next;
		}
		if (node2.next != null) {
			node2.next.prev = node2.prev;
		}
		if (node2 == body2.m_contactList) {
			body2.m_contactList = node2.next;
		}
		node2.prev = null;
		node2.next = null;
	}
	b2Contact$Destroy$Lb2Contact$X(c, this.m_world.m_blockAllocator);
	-- this.m_world.m_contactCount;
};


function b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$($this, c) {
	var body1;
	var body2;
	var node1;
	var node2;
	if (c.m_prev != null) {
		c.m_prev.m_next = c.m_next;
	}
	if (c.m_next != null) {
		c.m_next.m_prev = c.m_prev;
	}
	if (c == $this.m_world.m_contactList) {
		$this.m_world.m_contactList = c.m_next;
	}
	if (c.m_manifoldCount > 0) {
		body1 = c.m_shape1.m_body;
		body2 = c.m_shape2.m_body;
		node1 = c.m_node1;
		node2 = c.m_node2;
		body1.m_flags &= -9;
		body1.m_sleepTime = 0.0;
		body2.m_flags &= -9;
		body2.m_sleepTime = 0.0;
		if (node1.prev != null) {
			node1.prev.next = node1.next;
		}
		if (node1.next != null) {
			node1.next.prev = node1.prev;
		}
		if (node1 == body1.m_contactList) {
			body1.m_contactList = node1.next;
		}
		node1.prev = null;
		node1.next = null;
		if (node2.prev != null) {
			node2.prev.next = node2.next;
		}
		if (node2.next != null) {
			node2.next.prev = node2.prev;
		}
		if (node2 == body2.m_contactList) {
			body2.m_contactList = node2.next;
		}
		node2.prev = null;
		node2.next = null;
	}
	b2Contact$Destroy$Lb2Contact$X(c, $this.m_world.m_blockAllocator);
	-- $this.m_world.m_contactCount;
};

b2ContactManager.DestroyContact$Lb2ContactManager$Lb2Contact$ = b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$;

b2ContactManager.prototype.CleanContactList$ = function () {
	var c;
	var c0;
	c = this.m_world.m_contactList;
	while (c != null) {
		c0 = c;
		c = c.m_next;
		if ((c0.m_flags & 0x0002) !== 0) {
			b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$(this, c0);
			c0 = null;
		}
	}
};


function b2ContactManager$CleanContactList$Lb2ContactManager$($this) {
	var c;
	var c0;
	c = $this.m_world.m_contactList;
	while (c != null) {
		c0 = c;
		c = c.m_next;
		if ((c0.m_flags & 0x0002) !== 0) {
			b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$($this, c0);
			c0 = null;
		}
	}
};

b2ContactManager.CleanContactList$Lb2ContactManager$ = b2ContactManager$CleanContactList$Lb2ContactManager$;

b2ContactManager.prototype.Collide$ = function () {
	var body1;
	var body2;
	var node1;
	var node2;
	var c;
	var oldCount;
	var newCount;
	var this$0;
	var this$1;
	var next$0;
	var next$1;
	for (c = this.m_world.m_contactList; c != null; c = c.m_next) {
		if ((this$0 = c.m_shape1.m_body, (this$0.m_flags & 0x0008) === 0x0008) && (this$1 = c.m_shape2.m_body, (this$1.m_flags & 0x0008) === 0x0008)) {
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
			node1.prev = null;
			next$0 = node1.next = body1.m_contactList;
			if (next$0 != null) {
				node1.next.prev = c.m_node1;
			}
			body1.m_contactList = c.m_node1;
			node2.contact = c;
			node2.other = body1;
			node2.prev = null;
			next$1 = node2.next = body2.m_contactList;
			if (next$1 != null) {
				node2.next.prev = node2;
			}
			body2.m_contactList = node2;
		} else if (oldCount > 0 && newCount === 0) {
			body1 = c.m_shape1.m_body;
			body2 = c.m_shape2.m_body;
			node1 = c.m_node1;
			node2 = c.m_node2;
			if (node1.prev != null) {
				node1.prev.next = node1.next;
			}
			if (node1.next != null) {
				node1.next.prev = node1.prev;
			}
			if (node1 == body1.m_contactList) {
				body1.m_contactList = node1.next;
			}
			node1.prev = null;
			node1.next = null;
			if (node2.prev != null) {
				node2.prev.next = node2.next;
			}
			if (node2.next != null) {
				node2.next.prev = node2.prev;
			}
			if (node2 == body2.m_contactList) {
				body2.m_contactList = node2.next;
			}
			node2.prev = null;
			node2.next = null;
		}
	}
};


function b2ContactManager$Collide$Lb2ContactManager$($this) {
	var body1;
	var body2;
	var node1;
	var node2;
	var c;
	var oldCount;
	var newCount;
	var this$0;
	var this$1;
	var next$0;
	var next$1;
	for (c = $this.m_world.m_contactList; c != null; c = c.m_next) {
		if ((this$0 = c.m_shape1.m_body, (this$0.m_flags & 0x0008) === 0x0008) && (this$1 = c.m_shape2.m_body, (this$1.m_flags & 0x0008) === 0x0008)) {
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
			node1.prev = null;
			next$0 = node1.next = body1.m_contactList;
			if (next$0 != null) {
				node1.next.prev = c.m_node1;
			}
			body1.m_contactList = c.m_node1;
			node2.contact = c;
			node2.other = body1;
			node2.prev = null;
			next$1 = node2.next = body2.m_contactList;
			if (next$1 != null) {
				node2.next.prev = node2;
			}
			body2.m_contactList = node2;
		} else if (oldCount > 0 && newCount === 0) {
			body1 = c.m_shape1.m_body;
			body2 = c.m_shape2.m_body;
			node1 = c.m_node1;
			node2 = c.m_node2;
			if (node1.prev != null) {
				node1.prev.next = node1.next;
			}
			if (node1.next != null) {
				node1.next.prev = node1.prev;
			}
			if (node1 == body1.m_contactList) {
				body1.m_contactList = node1.next;
			}
			node1.prev = null;
			node1.next = null;
			if (node2.prev != null) {
				node2.prev.next = node2.next;
			}
			if (node2.next != null) {
				node2.next.prev = node2.prev;
			}
			if (node2 == body2.m_contactList) {
				body2.m_contactList = node2.next;
			}
			node2.prev = null;
			node2.next = null;
		}
	}
};

b2ContactManager.Collide$Lb2ContactManager$ = b2ContactManager$Collide$Lb2ContactManager$;

function b2Island(bodyCapacity, contactCapacity, jointCapacity, allocator) {
	var i;
	var m_bodies$0;
	var m_contacts$0;
	var m_joints$0;
	this.m_allocator = null;
	this.m_contacts = null;
	this.m_joints = null;
	this.m_positionError = null;
	i = 0;
	this.m_bodyCapacity = bodyCapacity;
	this.m_contactCapacity = contactCapacity;
	this.m_jointCapacity = jointCapacity;
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
	m_bodies$0 = this.m_bodies = [  ];
	m_bodies$0.length = bodyCapacity;
	for (i = 0; i < bodyCapacity; i++) {
		this.m_bodies[i] = null;
	}
	m_contacts$0 = this.m_contacts = [  ];
	m_contacts$0.length = contactCapacity;
	for (i = 0; i < contactCapacity; i++) {
		this.m_contacts[i] = null;
	}
	m_joints$0 = this.m_joints = [  ];
	m_joints$0.length = jointCapacity;
	for (i = 0; i < jointCapacity; i++) {
		this.m_joints[i] = null;
	}
	this.m_allocator = allocator;
};

$__jsx_extend([b2Island], Object);
b2Island.prototype.Clear$ = function () {
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
};


function b2Island$Clear$Lb2Island$($this) {
	$this.m_bodyCount = 0;
	$this.m_contactCount = 0;
	$this.m_jointCount = 0;
};

b2Island.Clear$Lb2Island$ = b2Island$Clear$Lb2Island$;

b2Island.prototype.Solve$Lb2TimeStep$Lb2Vec2$ = function (step, gravity) {
	var i;
	var b;
	var contactSolver;
	var j;
	var contactsOkay;
	var jointsOkay;
	var this$0;
	var s$0;
	var a$0;
	var b$0;
	var this$2;
	var a$2;
	var this$4;
	var v$2;
	var s$2;
	var this$6;
	var s$3;
	var a$4;
	var v$0$x$0;
	var v$0$y$0;
	var m_position$0;
	var dt$0;
	var m_linearVelocity$0;
	var m_rotation$0;
	i = 0;
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		this$0 = b.m_linearVelocity;
		s$3 = step.dt;
		a$4 = (b$0 = (s$0 = b.m_invMass, a$0 = b.m_force, ({x: s$0 * a$0.x, y: s$0 * a$0.y})), ({x: gravity.x + b$0.x, y: gravity.y + b$0.y}));
		v$0$x$0 = s$3 * a$4.x;
		v$0$y$0 = s$3 * a$4.y;
		this$0.x += v$0$x$0;
		this$0.y += v$0$y$0;
		b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
		this$2 = b.m_linearVelocity;
		a$2 = b.m_linearDamping;
		this$2.x *= a$2;
		this$2.y *= a$2;
		b.m_angularVelocity *= b.m_angularDamping;
		this$4 = b.m_position0;
		v$2 = b.m_position;
		this$4.x = v$2.x;
		this$4.y = v$2.y;
		b.m_rotation0 = b.m_rotation;
	}
	contactSolver = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
	b2ContactSolver$PreSolve$Lb2ContactSolver$(contactSolver);
	for (i = 0; i < this.m_jointCount; ++ i) {
		debugger;
	}
	for (i = 0; i < step.iterations; ++ i) {
		b2ContactSolver$SolveVelocityConstraints$Lb2ContactSolver$(contactSolver);
		for (j = 0; j < this.m_jointCount; ++ j) {
			debugger;
		}
	}
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		(m_position$0 = b.m_position).x += (dt$0 = step.dt) * (m_linearVelocity$0 = b.m_linearVelocity).x;
		m_position$0.y += dt$0 * m_linearVelocity$0.y;
		m_rotation$0 = b.m_rotation += dt$0 * b.m_angularVelocity;
		b2Mat22$Set$Lb2Mat22$N(b.m_R, m_rotation$0);
	}
	for (i = 0; i < this.m_jointCount; ++ i) {
		debugger;
	}
	if (b2World.s_enablePositionCorrection) {
		for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < step.iterations; ++ b2Island.m_positionIterationCount) {
			contactsOkay = b2ContactSolver$SolvePositionConstraints$Lb2ContactSolver$N(contactSolver, 0.2);
			jointsOkay = true;
			for (i = 0; i < this.m_jointCount; ++ i) {
				debugger;
			}
			if (contactsOkay && jointsOkay) {
				break;
			}
		}
	}
	b2ContactSolver$PostSolve$Lb2ContactSolver$(contactSolver);
	for (i = 0; i < this.m_bodyCount; ++ i) {
		b = this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		b2Mat22$Set$Lb2Mat22$N(b.m_R, b.m_rotation);
		b2Mat22$Set$Lb2Mat22$N(b.sMat0, b.m_rotation0);
		for (s$2 = b.m_shapeList; s$2 != null; s$2 = s$2.m_next) {
			s$2.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(b.m_position0, b.sMat0, b.m_position, b.m_R);
		}
		this$6 = b.m_force;
		this$6.x = 0.0;
		this$6.y = 0.0;
		b.m_torque = 0.0;
	}
};


function b2Island$Solve$Lb2Island$Lb2TimeStep$Lb2Vec2$($this, step, gravity) {
	var i;
	var b;
	var contactSolver;
	var j;
	var contactsOkay;
	var jointsOkay;
	var this$0;
	var s$0;
	var a$0;
	var b$0;
	var this$2;
	var a$2;
	var this$4;
	var v$2;
	var s$2;
	var this$6;
	var s$3;
	var a$4;
	var v$0$x$0;
	var v$0$y$0;
	var m_position$0;
	var dt$0;
	var m_linearVelocity$0;
	var m_rotation$0;
	i = 0;
	for (i = 0; i < $this.m_bodyCount; ++ i) {
		b = $this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		this$0 = b.m_linearVelocity;
		s$3 = step.dt;
		a$4 = (b$0 = (s$0 = b.m_invMass, a$0 = b.m_force, ({x: s$0 * a$0.x, y: s$0 * a$0.y})), ({x: gravity.x + b$0.x, y: gravity.y + b$0.y}));
		v$0$x$0 = s$3 * a$4.x;
		v$0$y$0 = s$3 * a$4.y;
		this$0.x += v$0$x$0;
		this$0.y += v$0$y$0;
		b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
		this$2 = b.m_linearVelocity;
		a$2 = b.m_linearDamping;
		this$2.x *= a$2;
		this$2.y *= a$2;
		b.m_angularVelocity *= b.m_angularDamping;
		this$4 = b.m_position0;
		v$2 = b.m_position;
		this$4.x = v$2.x;
		this$4.y = v$2.y;
		b.m_rotation0 = b.m_rotation;
	}
	contactSolver = new b2ContactSolver($this.m_contacts, $this.m_contactCount, $this.m_allocator);
	b2ContactSolver$PreSolve$Lb2ContactSolver$(contactSolver);
	for (i = 0; i < $this.m_jointCount; ++ i) {
		debugger;
	}
	for (i = 0; i < step.iterations; ++ i) {
		b2ContactSolver$SolveVelocityConstraints$Lb2ContactSolver$(contactSolver);
		for (j = 0; j < $this.m_jointCount; ++ j) {
			debugger;
		}
	}
	for (i = 0; i < $this.m_bodyCount; ++ i) {
		b = $this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		(m_position$0 = b.m_position).x += (dt$0 = step.dt) * (m_linearVelocity$0 = b.m_linearVelocity).x;
		m_position$0.y += dt$0 * m_linearVelocity$0.y;
		m_rotation$0 = b.m_rotation += dt$0 * b.m_angularVelocity;
		b2Mat22$Set$Lb2Mat22$N(b.m_R, m_rotation$0);
	}
	for (i = 0; i < $this.m_jointCount; ++ i) {
		debugger;
	}
	if (b2World.s_enablePositionCorrection) {
		for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < step.iterations; ++ b2Island.m_positionIterationCount) {
			contactsOkay = b2ContactSolver$SolvePositionConstraints$Lb2ContactSolver$N(contactSolver, 0.2);
			jointsOkay = true;
			for (i = 0; i < $this.m_jointCount; ++ i) {
				debugger;
			}
			if (contactsOkay && jointsOkay) {
				break;
			}
		}
	}
	b2ContactSolver$PostSolve$Lb2ContactSolver$(contactSolver);
	for (i = 0; i < $this.m_bodyCount; ++ i) {
		b = $this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		b2Mat22$Set$Lb2Mat22$N(b.m_R, b.m_rotation);
		b2Mat22$Set$Lb2Mat22$N(b.sMat0, b.m_rotation0);
		for (s$2 = b.m_shapeList; s$2 != null; s$2 = s$2.m_next) {
			s$2.Synchronize$Lb2Vec2$Lb2Mat22$Lb2Vec2$Lb2Mat22$(b.m_position0, b.sMat0, b.m_position, b.m_R);
		}
		this$6 = b.m_force;
		this$6.x = 0.0;
		this$6.y = 0.0;
		b.m_torque = 0.0;
	}
};

b2Island.Solve$Lb2Island$Lb2TimeStep$Lb2Vec2$ = b2Island$Solve$Lb2Island$Lb2TimeStep$Lb2Vec2$;

b2Island.prototype.UpdateSleep$N = function (dt) {
	var i;
	var b;
	var minSleepTime;
	var linTolSqr;
	var angTolSqr;
	var a$0;
	var m_sleepTime$0;
	var m_angularVelocity$0;
	var m_linearVelocity$0;
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
		if ((b.m_flags & 0x0010) === 0 || (m_angularVelocity$0 = b.m_angularVelocity) * m_angularVelocity$0 > angTolSqr || (a$0 = m_linearVelocity$0 = b.m_linearVelocity, m_linearVelocity$0, a$0.x * m_linearVelocity$0.x + a$0.y * m_linearVelocity$0.y) > linTolSqr) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		} else {
			m_sleepTime$0 = b.m_sleepTime += dt;
			minSleepTime = (minSleepTime < m_sleepTime$0 ? minSleepTime : m_sleepTime$0);
		}
	}
	if (minSleepTime >= 0.5) {
		for (i = 0; i < this.m_bodyCount; ++ i) {
			b = this.m_bodies[i];
			b.m_flags |= 0x0008;
		}
	}
};


function b2Island$UpdateSleep$Lb2Island$N($this, dt) {
	var i;
	var b;
	var minSleepTime;
	var linTolSqr;
	var angTolSqr;
	var a$0;
	var m_sleepTime$0;
	var m_angularVelocity$0;
	var m_linearVelocity$0;
	i = 0;
	minSleepTime = Number.MAX_VALUE;
	linTolSqr = 0.09;
	angTolSqr = 0.0001234567901234568;
	for (i = 0; i < $this.m_bodyCount; ++ i) {
		b = $this.m_bodies[i];
		if (b.m_invMass === 0.0) {
			continue;
		}
		if ((b.m_flags & 0x0010) === 0) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		}
		if ((b.m_flags & 0x0010) === 0 || (m_angularVelocity$0 = b.m_angularVelocity) * m_angularVelocity$0 > angTolSqr || (a$0 = m_linearVelocity$0 = b.m_linearVelocity, m_linearVelocity$0, a$0.x * m_linearVelocity$0.x + a$0.y * m_linearVelocity$0.y) > linTolSqr) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		} else {
			m_sleepTime$0 = b.m_sleepTime += dt;
			minSleepTime = (minSleepTime < m_sleepTime$0 ? minSleepTime : m_sleepTime$0);
		}
	}
	if (minSleepTime >= 0.5) {
		for (i = 0; i < $this.m_bodyCount; ++ i) {
			b = $this.m_bodies[i];
			b.m_flags |= 0x0008;
		}
	}
};

b2Island.UpdateSleep$Lb2Island$N = b2Island$UpdateSleep$Lb2Island$N;

b2Island.prototype.AddBody$Lb2Body$ = function (body) {
	this.m_bodies[this.m_bodyCount++] = body;
};


function b2Island$AddBody$Lb2Island$Lb2Body$($this, body) {
	$this.m_bodies[$this.m_bodyCount++] = body;
};

b2Island.AddBody$Lb2Island$Lb2Body$ = b2Island$AddBody$Lb2Island$Lb2Body$;

b2Island.prototype.AddContact$Lb2Contact$ = function (contact) {
	this.m_contacts[this.m_contactCount++] = contact;
};


function b2Island$AddContact$Lb2Island$Lb2Contact$($this, contact) {
	$this.m_contacts[$this.m_contactCount++] = contact;
};

b2Island.AddContact$Lb2Island$Lb2Contact$ = b2Island$AddContact$Lb2Island$Lb2Contact$;

b2Island.prototype.AddJoint$X = function (joint) {
	debugger;
};


function b2Island$AddJoint$Lb2Island$X($this, joint) {
	debugger;
};

b2Island.AddJoint$Lb2Island$X = b2Island$AddJoint$Lb2Island$X;

function b2TimeStep() {
	this.dt = 0;
	this.inv_dt = 0;
	this.iterations = 0;
};

$__jsx_extend([b2TimeStep], Object);
function b2World(worldAABB, gravity, doSleep) {
	var bd;
	var m_contactManager$0;
	this.m_blockAllocator = null;
	this.m_stackAllocator = null;
	this.m_broadPhase = null;
	this.m_groundBody = null;
	this.m_positionIterationCount = 0;
	this.step = ({dt: 0, inv_dt: 0, iterations: 0});
	m_contactManager$0 = this.m_contactManager = new b2ContactManager();
	this.m_listener = null;
	this.m_filter = b2CollisionFilter.b2_defaultFilter;
	this.m_bodyList = null;
	this.m_contactList = null;
	this.m_jointList = null;
	this.m_bodyCount = 0;
	this.m_contactCount = 0;
	this.m_jointCount = 0;
	this.m_bodyDestroyList = null;
	this.m_allowSleep = doSleep;
	this.m_gravity = gravity;
	m_contactManager$0.m_world = this;
	this.m_broadPhase = new b2BroadPhase(worldAABB, m_contactManager$0);
	bd = new b2BodyDef();
	this.m_groundBody = b2World$CreateBody$Lb2World$Lb2BodyDef$(this, bd);
};

$__jsx_extend([b2World], Object);
b2World.prototype.SetListener$X = function (listener) {
	this.m_listener = listener;
};


function b2World$SetListener$Lb2World$X($this, listener) {
	$this.m_listener = listener;
};

b2World.SetListener$Lb2World$X = b2World$SetListener$Lb2World$X;

b2World.prototype.SetFilter$Lb2CollisionFilter$ = function (filter) {
	this.m_filter = filter;
};


function b2World$SetFilter$Lb2World$Lb2CollisionFilter$($this, filter) {
	$this.m_filter = filter;
};

b2World.SetFilter$Lb2World$Lb2CollisionFilter$ = b2World$SetFilter$Lb2World$Lb2CollisionFilter$;

b2World.prototype.CreateBody$Lb2BodyDef$ = function (def) {
	var b;
	var m_bodyList$0;
	b = new b2Body(def, this);
	b.m_prev = null;
	b.m_next = m_bodyList$0 = this.m_bodyList;
	if (m_bodyList$0 != null) {
		this.m_bodyList.m_prev = b;
	}
	this.m_bodyList = b;
	++ this.m_bodyCount;
	return b;
};


function b2World$CreateBody$Lb2World$Lb2BodyDef$($this, def) {
	var b;
	var m_bodyList$0;
	b = new b2Body(def, $this);
	b.m_prev = null;
	b.m_next = m_bodyList$0 = $this.m_bodyList;
	if (m_bodyList$0 != null) {
		$this.m_bodyList.m_prev = b;
	}
	$this.m_bodyList = b;
	++ $this.m_bodyCount;
	return b;
};

b2World.CreateBody$Lb2World$Lb2BodyDef$ = b2World$CreateBody$Lb2World$Lb2BodyDef$;

b2World.prototype.DestroyBody$Lb2Body$ = function (b) {
	if ((b.m_flags & 0x0020) !== 0) {
		return;
	}
	if (b.m_prev != null) {
		b.m_prev.m_next = b.m_next;
	}
	if (b.m_next != null) {
		b.m_next.m_prev = b.m_prev;
	}
	if (b == this.m_bodyList) {
		this.m_bodyList = b.m_next;
	}
	b.m_flags |= 0x0020;
	-- this.m_bodyCount;
	b.m_prev = null;
	b.m_next = this.m_bodyDestroyList;
	this.m_bodyDestroyList = b;
};


function b2World$DestroyBody$Lb2World$Lb2Body$($this, b) {
	if ((b.m_flags & 0x0020) !== 0) {
		return;
	}
	if (b.m_prev != null) {
		b.m_prev.m_next = b.m_next;
	}
	if (b.m_next != null) {
		b.m_next.m_prev = b.m_prev;
	}
	if (b == $this.m_bodyList) {
		$this.m_bodyList = b.m_next;
	}
	b.m_flags |= 0x0020;
	-- $this.m_bodyCount;
	b.m_prev = null;
	b.m_next = $this.m_bodyDestroyList;
	$this.m_bodyDestroyList = b;
};

b2World.DestroyBody$Lb2World$Lb2Body$ = b2World$DestroyBody$Lb2World$Lb2Body$;

b2World.prototype.CleanBodyList$ = function () {
	var b;
	var b0;
	var jn;
	var s$0;
	var s0$0;
	this.m_contactManager.m_destroyImmediate = true;
	b = this.m_bodyDestroyList;
	while (b != null) {
		b0 = b;
		b = b.m_next;
		jn = b0.m_jointList;
		while (jn != null) {
			debugger;
		}
		s$0 = b0.m_shapeList;
		while (s$0 != null) {
			s0$0 = s$0;
			s$0 = s$0.m_next;
			if (s0$0.m_proxyId !== b2Pair.b2_nullProxy) {
				b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s0$0.m_body.m_world.m_broadPhase, s0$0.m_proxyId);
			}
		}
	}
	this.m_bodyDestroyList = null;
	this.m_contactManager.m_destroyImmediate = false;
};


function b2World$CleanBodyList$Lb2World$($this) {
	var b;
	var b0;
	var jn;
	var s$0;
	var s0$0;
	$this.m_contactManager.m_destroyImmediate = true;
	b = $this.m_bodyDestroyList;
	while (b != null) {
		b0 = b;
		b = b.m_next;
		jn = b0.m_jointList;
		while (jn != null) {
			debugger;
		}
		s$0 = b0.m_shapeList;
		while (s$0 != null) {
			s0$0 = s$0;
			s$0 = s$0.m_next;
			if (s0$0.m_proxyId !== b2Pair.b2_nullProxy) {
				b2BroadPhase$DestroyProxy$Lb2BroadPhase$N(s0$0.m_body.m_world.m_broadPhase, s0$0.m_proxyId);
			}
		}
	}
	$this.m_bodyDestroyList = null;
	$this.m_contactManager.m_destroyImmediate = false;
};

b2World.CleanBodyList$Lb2World$ = b2World$CleanBodyList$Lb2World$;

b2World.prototype.GetGroundBody$ = function () {
	return this.m_groundBody;
};


function b2World$GetGroundBody$Lb2World$($this) {
	return $this.m_groundBody;
};

b2World.GetGroundBody$Lb2World$ = b2World$GetGroundBody$Lb2World$;

b2World.prototype.Step$NN = function (dt, iterations) {
	var b;
	var other;
	var island;
	var c;
	var stack;
	var k;
	var seed;
	var stackCount;
	var cn;
	var i;
	var this$0;
	var c$0;
	var c0$0;
	var contact$0;
	var a$0;
	var b$0;
	var this$1;
	var step$0;
	var m_flags$0;
	(step$0 = this.step).dt = dt;
	step$0.iterations = iterations;
	if (dt > 0.0) {
		this.step.inv_dt = 1.0 / dt;
	} else {
		this.step.inv_dt = 0.0;
	}
	this.m_positionIterationCount = 0;
	this$0 = this.m_contactManager;
	c$0 = this$0.m_world.m_contactList;
	while (c$0 != null) {
		c0$0 = c$0;
		c$0 = c$0.m_next;
		if ((c0$0.m_flags & 0x0002) !== 0) {
			b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$(this$0, c0$0);
			c0$0 = null;
		}
	}
	b2World$CleanBodyList$Lb2World$(this);
	b2ContactManager$Collide$Lb2ContactManager$(this.m_contactManager);
	island = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
	for (b = this.m_bodyList; b != null; b = b.m_next) {
		b.m_flags &= -5;
	}
	for (c = this.m_contactList; c != null; c = c.m_next) {
		c.m_flags &= -2;
	}
	stack = [  ];
	stack.length = this.m_bodyCount;
	for (k = 0; k < this.m_bodyCount; k++) {
		stack[k] = null;
	}
	for (seed = this.m_bodyList; seed != null; seed = seed.m_next) {
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
			m_flags$0 = b.m_flags &= -9;
			if ((m_flags$0 & 0x0001) !== 0) {
				continue;
			}
			for (cn = b.m_contactList; cn != null; cn = cn.next) {
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
		b2Island$Solve$Lb2Island$Lb2TimeStep$Lb2Vec2$(island, this.step, this.m_gravity);
		a$0 = this.m_positionIterationCount;
		b$0 = b2Island.m_positionIterationCount;
		this.m_positionIterationCount = (a$0 > b$0 ? a$0 : b$0);
		if (this.m_allowSleep) {
			b2Island$UpdateSleep$Lb2Island$N(island, dt);
		}
		for (i = 0; i < island.m_bodyCount; ++ i) {
			b = island.m_bodies[i];
			if ((b.m_flags & 0x0001) !== 0) {
				b.m_flags &= -5;
			}
			if ((b.m_flags & 0x0002) === 0x0002 && this.m_listener != null) {
				debugger;
			}
		}
	}
	this$1 = this.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$1.m_pairManager);
};


function b2World$Step$Lb2World$NN($this, dt, iterations) {
	var b;
	var other;
	var island;
	var c;
	var stack;
	var k;
	var seed;
	var stackCount;
	var cn;
	var i;
	var this$0;
	var c$0;
	var c0$0;
	var contact$0;
	var a$0;
	var b$0;
	var this$1;
	var step$0;
	var m_flags$0;
	(step$0 = $this.step).dt = dt;
	step$0.iterations = iterations;
	if (dt > 0.0) {
		$this.step.inv_dt = 1.0 / dt;
	} else {
		$this.step.inv_dt = 0.0;
	}
	$this.m_positionIterationCount = 0;
	this$0 = $this.m_contactManager;
	c$0 = this$0.m_world.m_contactList;
	while (c$0 != null) {
		c0$0 = c$0;
		c$0 = c$0.m_next;
		if ((c0$0.m_flags & 0x0002) !== 0) {
			b2ContactManager$DestroyContact$Lb2ContactManager$Lb2Contact$(this$0, c0$0);
			c0$0 = null;
		}
	}
	b2World$CleanBodyList$Lb2World$($this);
	b2ContactManager$Collide$Lb2ContactManager$($this.m_contactManager);
	island = new b2Island($this.m_bodyCount, $this.m_contactCount, $this.m_jointCount, $this.m_stackAllocator);
	for (b = $this.m_bodyList; b != null; b = b.m_next) {
		b.m_flags &= -5;
	}
	for (c = $this.m_contactList; c != null; c = c.m_next) {
		c.m_flags &= -2;
	}
	stack = [  ];
	stack.length = $this.m_bodyCount;
	for (k = 0; k < $this.m_bodyCount; k++) {
		stack[k] = null;
	}
	for (seed = $this.m_bodyList; seed != null; seed = seed.m_next) {
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
			m_flags$0 = b.m_flags &= -9;
			if ((m_flags$0 & 0x0001) !== 0) {
				continue;
			}
			for (cn = b.m_contactList; cn != null; cn = cn.next) {
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
		b2Island$Solve$Lb2Island$Lb2TimeStep$Lb2Vec2$(island, $this.step, $this.m_gravity);
		a$0 = $this.m_positionIterationCount;
		b$0 = b2Island.m_positionIterationCount;
		$this.m_positionIterationCount = (a$0 > b$0 ? a$0 : b$0);
		if ($this.m_allowSleep) {
			b2Island$UpdateSleep$Lb2Island$N(island, dt);
		}
		for (i = 0; i < island.m_bodyCount; ++ i) {
			b = island.m_bodies[i];
			if ((b.m_flags & 0x0001) !== 0) {
				b.m_flags &= -5;
			}
			if ((b.m_flags & 0x0002) === 0x0002 && $this.m_listener != null) {
				debugger;
			}
		}
	}
	this$1 = $this.m_broadPhase;
	b2PairManager$Commit$Lb2PairManager$(this$1.m_pairManager);
};

b2World.Step$Lb2World$NN = b2World$Step$Lb2World$NN;

b2World.prototype.Query$Lb2AABB$AXN = function (aabb, shapes, maxCount) {
	var results;
	var count;
	var i;
	results = [  ];
	count = b2BroadPhase$QueryAABB$Lb2BroadPhase$Lb2AABB$AXN(this.m_broadPhase, aabb, results, maxCount);
	for (i = 0; i < count; ++ i) {
		shapes[i] = results[i];
	}
	return count;
};


function b2World$Query$Lb2World$Lb2AABB$AXN($this, aabb, shapes, maxCount) {
	var results;
	var count;
	var i;
	results = [  ];
	count = b2BroadPhase$QueryAABB$Lb2BroadPhase$Lb2AABB$AXN($this.m_broadPhase, aabb, results, maxCount);
	for (i = 0; i < count; ++ i) {
		shapes[i] = results[i];
	}
	return count;
};

b2World.Query$Lb2World$Lb2AABB$AXN = b2World$Query$Lb2World$Lb2AABB$AXN;

b2World.prototype.GetBodyList$ = function () {
	return this.m_bodyList;
};


function b2World$GetBodyList$Lb2World$($this) {
	return $this.m_bodyList;
};

b2World.GetBodyList$Lb2World$ = b2World$GetBodyList$Lb2World$;

b2World.prototype.GetJointList$ = function () {
	return this.m_jointList;
};


function b2World$GetJointList$Lb2World$($this) {
	return $this.m_jointList;
};

b2World.GetJointList$Lb2World$ = b2World$GetJointList$Lb2World$;

b2World.prototype.GetContactList$ = function () {
	return this.m_contactList;
};


function b2World$GetContactList$Lb2World$($this) {
	return $this.m_contactList;
};

b2World.GetContactList$Lb2World$ = b2World$GetContactList$Lb2World$;

function b2Contact(s1, s2) {
	this.m_flags = 0;
	this.m_prev = null;
	this.m_next = null;
	this.m_node1 = null;
	this.m_node2 = null;
	this.m_shape1 = null;
	this.m_shape2 = null;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	b2Contact$initializer$Lb2Contact$Lb2Shape$Lb2Shape$(this, s1, s2);
};

function b2Contact$0() {
	this.m_flags = 0;
	this.m_prev = null;
	this.m_next = null;
	this.m_node1 = null;
	this.m_node2 = null;
	this.m_shape1 = null;
	this.m_shape2 = null;
	this.m_manifoldCount = 0;
	this.m_friction = 0;
	this.m_restitution = 0;
	b2Contact$initializer$Lb2Contact$Lb2Shape$Lb2Shape$(this, null, null);
};

$__jsx_extend([b2Contact, b2Contact$0], Object);
b2Contact.prototype.initializer$Lb2Shape$Lb2Shape$ = function (s1, s2) {
	var a$0;
	var b$0;
	var m_shape1$0;
	var m_shape2$0;
	var m_node1$0;
	var m_node2$0;
	this.m_node1 = ({other: null, contact: null, prev: null, next: null});
	this.m_node2 = ({other: null, contact: null, prev: null, next: null});
	this.m_flags = 0;
	if (s1 == null || s2 == null) {
		this.m_shape1 = null;
		this.m_shape2 = null;
		return;
	}
	m_shape1$0 = this.m_shape1 = s1;
	m_shape2$0 = this.m_shape2 = s2;
	this.m_manifoldCount = 0;
	this.m_friction = Math.sqrt(m_shape1$0.m_friction * m_shape2$0.m_friction);
	a$0 = this.m_shape1.m_restitution;
	b$0 = this.m_shape2.m_restitution;
	this.m_restitution = (a$0 > b$0 ? a$0 : b$0);
	this.m_prev = null;
	this.m_next = null;
	(m_node1$0 = this.m_node1).contact = null;
	m_node1$0.prev = null;
	m_node1$0.next = null;
	m_node1$0.other = null;
	(m_node2$0 = this.m_node2).contact = null;
	m_node2$0.prev = null;
	m_node2$0.next = null;
	m_node2$0.other = null;
};


function b2Contact$initializer$Lb2Contact$Lb2Shape$Lb2Shape$($this, s1, s2) {
	var a$0;
	var b$0;
	var m_shape1$0;
	var m_shape2$0;
	var m_node1$0;
	var m_node2$0;
	$this.m_node1 = ({other: null, contact: null, prev: null, next: null});
	$this.m_node2 = ({other: null, contact: null, prev: null, next: null});
	$this.m_flags = 0;
	if (s1 == null || s2 == null) {
		$this.m_shape1 = null;
		$this.m_shape2 = null;
		return;
	}
	m_shape1$0 = $this.m_shape1 = s1;
	m_shape2$0 = $this.m_shape2 = s2;
	$this.m_manifoldCount = 0;
	$this.m_friction = Math.sqrt(m_shape1$0.m_friction * m_shape2$0.m_friction);
	a$0 = $this.m_shape1.m_restitution;
	b$0 = $this.m_shape2.m_restitution;
	$this.m_restitution = (a$0 > b$0 ? a$0 : b$0);
	$this.m_prev = null;
	$this.m_next = null;
	(m_node1$0 = $this.m_node1).contact = null;
	m_node1$0.prev = null;
	m_node1$0.next = null;
	m_node1$0.other = null;
	(m_node2$0 = $this.m_node2).contact = null;
	m_node2$0.prev = null;
	m_node2$0.next = null;
	m_node2$0.other = null;
};

b2Contact.initializer$Lb2Contact$Lb2Shape$Lb2Shape$ = b2Contact$initializer$Lb2Contact$Lb2Shape$Lb2Shape$;

b2Contact.prototype.GetManifolds$ = function () {
	return null;
};


b2Contact.prototype.GetManifoldCount$ = function () {
	return this.m_manifoldCount;
};


function b2Contact$GetManifoldCount$Lb2Contact$($this) {
	return $this.m_manifoldCount;
};

b2Contact.GetManifoldCount$Lb2Contact$ = b2Contact$GetManifoldCount$Lb2Contact$;

b2Contact.prototype.GetNext$ = function () {
	return this.m_next;
};


function b2Contact$GetNext$Lb2Contact$($this) {
	return $this.m_next;
};

b2Contact.GetNext$Lb2Contact$ = b2Contact$GetNext$Lb2Contact$;

b2Contact.prototype.GetShape1$ = function () {
	return this.m_shape1;
};


function b2Contact$GetShape1$Lb2Contact$($this) {
	return $this.m_shape1;
};

b2Contact.GetShape1$Lb2Contact$ = b2Contact$GetShape1$Lb2Contact$;

b2Contact.prototype.GetShape2$ = function () {
	return this.m_shape2;
};


function b2Contact$GetShape2$Lb2Contact$($this) {
	return $this.m_shape2;
};

b2Contact.GetShape2$Lb2Contact$ = b2Contact$GetShape2$Lb2Contact$;

b2Contact.prototype.Evaluate$ = function () {
};


function b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(createFcn, destroyFcn, type1, type2) {
	b2Contact.s_registers[type1][type2].createFcn = createFcn;
	b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn;
	b2Contact.s_registers[type1][type2].primary = true;
	if (type1 !== type2) {
		b2Contact.s_registers[type2][type1].createFcn = createFcn;
		b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn;
		b2Contact.s_registers[type2][type1].primary = false;
	}
};

b2Contact.AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN = b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN;

function b2Contact$InitializeRegisters$() {
	var i;
	var j;
	var c;
	var d;
	b2Contact.s_registers = [  ];
	b2Contact.s_registers.length = 4;
	for (i = 0; i < 4; i++) {
		b2Contact.s_registers[i] = [  ];
		b2Contact.s_registers[i].length = 4;
		for (j = 0; j < 4; j++) {
			b2Contact.s_registers[i][j] = ({createFcn: null, destroyFcn: null, primary: false});
		}
	}
	c = (function (s1, s2, al) {
		var shape1$0;
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2CircleContact(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 0, 0);
	c = (function (s1, s2, al) {
		var shape1$0;
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2PolyAndCircleContact(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 2, 0);
	c = (function (s1, s2, al) {
		var shape1$0;
		var shape2$0;
		shape1$0 = s1;
		shape2$0 = s2;
		return new b2PolyContact(shape1$0, shape2$0);
	});
	d = (function (c, al) {
	});
	b2Contact$AddType$F$Lb2Shape$Lb2Shape$XLb2Contact$$F$Lb2Contact$XV$NN(c, d, 2, 2);
};

b2Contact.InitializeRegisters$ = b2Contact$InitializeRegisters$;

function b2Contact$Create$Lb2Shape$Lb2Shape$X(shape1, shape2, allocator) {
	var type1;
	var type2;
	var createFcn;
	var c;
	var i;
	var m;
	var this$0;
	if (b2Contact.s_initialized === false) {
		b2Contact$InitializeRegisters$();
		b2Contact.s_initialized = true;
	}
	type1 = shape1.m_type;
	type2 = shape2.m_type;
	createFcn = b2Contact.s_registers[type1][type2].createFcn;
	if (createFcn != null) {
		if (b2Contact.s_registers[type1][type2].primary) {
			return createFcn(shape1, shape2, allocator);
		} else {
			c = createFcn(shape2, shape1, allocator);
			for (i = 0; i < c.m_manifoldCount; ++ i) {
				m = c.GetManifolds$()[i];
				this$0 = m.normal;
				m.normal = ({x: - this$0.x, y: - this$0.y});
			}
			return c;
		}
	} else {
		return null;
	}
};

b2Contact.Create$Lb2Shape$Lb2Shape$X = b2Contact$Create$Lb2Shape$Lb2Shape$X;

function b2Contact$Destroy$Lb2Contact$X(contact, allocator) {
	var type1;
	var type2;
	var destroyFcn;
	var this$0;
	var this$2;
	if (contact.m_manifoldCount > 0) {
		this$0 = contact.m_shape1.m_body;
		this$0.m_flags &= -9;
		this$0.m_sleepTime = 0.0;
		this$2 = contact.m_shape2.m_body;
		this$2.m_flags &= -9;
		this$2.m_sleepTime = 0.0;
	}
	type1 = contact.m_shape1.m_type;
	type2 = contact.m_shape2.m_type;
	destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn;
	destroyFcn(contact, allocator);
};

b2Contact.Destroy$Lb2Contact$X = b2Contact$Destroy$Lb2Contact$X;

function b2CircleContact(s1, s2) {
	var m_manifold$0;
	b2Contact.call(this, s1, s2);
	this.m_manifold = null;
	if (s1 == null || s2 == null) {
		debugger;
	}
	m_manifold$0 = this.m_manifold = [ new b2Manifold() ];
	m_manifold$0[0].pointCount = 0;
	m_manifold$0[0].points[0].normalImpulse = 0.0;
	m_manifold$0[0].points[0].tangentImpulse = 0.0;
};

$__jsx_extend([b2CircleContact], b2Contact);
b2CircleContact.prototype.Evaluate$ = function () {
	b2Collision$b2CollideCircle$Lb2Manifold$Lb2CircleShape$Lb2CircleShape$B(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
	if (this.m_manifold[0].pointCount > 0) {
		this.m_manifoldCount = 1;
	} else {
		this.m_manifoldCount = 0;
	}
};


b2CircleContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};


function b2CircleContact$Create$Lb2CircleShape$Lb2CircleShape$X(shape1, shape2, allocator) {
	return new b2CircleContact(shape1, shape2);
};

b2CircleContact.Create$Lb2CircleShape$Lb2CircleShape$X = b2CircleContact$Create$Lb2CircleShape$Lb2CircleShape$X;

function b2CircleContact$Destroy$Lb2Contact$X(contact, allocator) {
};

b2CircleContact.Destroy$Lb2Contact$X = b2CircleContact$Destroy$Lb2Contact$X;

function b2ContactConstraint() {
	var i;
	var points$0;
	this.manifold = null;
	this.body1 = null;
	this.body2 = null;
	this.friction = 0;
	this.restitution = 0;
	this.pointCount = 0;
	this.normal = ({x: 0, y: 0});
	points$0 = this.points = [  ];
	points$0.length = 2;
	for (i = 0; i < 2; i++) {
		this.points[i] = ({localAnchor1: ({x: 0, y: 0}), localAnchor2: ({x: 0, y: 0}), normalImpulse: 0, tangentImpulse: 0, positionImpulse: 0, normalMass: 0, tangentMass: 0, separation: 0, velocityBias: 0});
	}
};

$__jsx_extend([b2ContactConstraint], Object);
function b2ContactConstraintPoint() {
	this.normalImpulse = 0;
	this.tangentImpulse = 0;
	this.positionImpulse = 0;
	this.normalMass = 0;
	this.tangentMass = 0;
	this.separation = 0;
	this.velocityBias = 0;
	this.localAnchor1 = ({x: 0, y: 0});
	this.localAnchor2 = ({x: 0, y: 0});
};

$__jsx_extend([b2ContactConstraintPoint], Object);
function b2ContactNode() {
	this.other = null;
	this.contact = null;
	this.prev = null;
	this.next = null;
};

$__jsx_extend([b2ContactNode], Object);
function b2ContactRegister() {
	this.createFcn = null;
	this.destroyFcn = null;
	this.primary = false;
};

$__jsx_extend([b2ContactRegister], Object);
function b2ContactSolver(contacts, contactCount, allocator) {
	var i;
	var tVec;
	var tMat;
	var count;
	var contact;
	var b1;
	var b2;
	var manifoldCount;
	var manifolds;
	var friction;
	var restitution;
	var v1X;
	var v1Y;
	var v2X;
	var v2Y;
	var w1;
	var w2;
	var j;
	var manifold;
	var normalX;
	var normalY;
	var c;
	var k;
	var cp;
	var ccp;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var r1Sqr;
	var r2Sqr;
	var rn1;
	var rn2;
	var kNormal;
	var tangentY;
	var rt1;
	var rt2;
	var kTangent;
	var tX;
	var tY;
	var vRel;
	var this$0;
	var position$0;
	var m_position$0;
	var x$0;
	var y$0;
	var m_position$1;
	var col1$0;
	var col2$0;
	var col1$1;
	var col2$1;
	var m_invMass$0;
	var m_invMass$1;
	var m_invI$0;
	var m_invI$1;
	var separation$0;
	var normal$0;
	var normal$1;
	var normal$2;
	var m_linearVelocity$0;
	var m_linearVelocity$1;
	this.m_constraints = [  ];
	this.m_allocator = allocator;
	i = 0;
	this.m_constraintCount = 0;
	for (i = 0; i < contactCount; ++ i) {
		this$0 = contacts[i];
		this.m_constraintCount += this$0.m_manifoldCount;
	}
	for (i = 0; i < this.m_constraintCount; i++) {
		this.m_constraints[i] = new b2ContactConstraint();
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
		v1X = (m_linearVelocity$0 = b1.m_linearVelocity).x;
		v1Y = m_linearVelocity$0.y;
		v2X = (m_linearVelocity$1 = b2.m_linearVelocity).x;
		v2Y = m_linearVelocity$1.y;
		w1 = b1.m_angularVelocity;
		w2 = b2.m_angularVelocity;
		for (j = 0; j < manifoldCount; ++ j) {
			manifold = manifolds[j];
			normalX = (normal$1 = manifold.normal).x;
			normalY = normal$1.y;
			c = this.m_constraints[count];
			c.body1 = b1;
			c.body2 = b2;
			c.manifold = manifold;
			(normal$2 = c.normal).x = normalX;
			normal$2.y = normalY;
			c.pointCount = manifold.pointCount;
			c.friction = friction;
			c.restitution = restitution;
			for (k = 0; k < c.pointCount; ++ k) {
				cp = manifold.points[k];
				ccp = c.points[k];
				ccp.normalImpulse = cp.normalImpulse;
				ccp.tangentImpulse = cp.tangentImpulse;
				separation$0 = ccp.separation = cp.separation;
				r1X = (x$0 = (position$0 = cp.position).x) - (m_position$0 = b1.m_position).x;
				r1Y = (y$0 = position$0.y) - m_position$0.y;
				r2X = x$0 - (m_position$1 = b2.m_position).x;
				r2Y = y$0 - m_position$1.y;
				tVec = ccp.localAnchor1;
				tMat = b1.m_R;
				tVec.x = r1X * (col1$0 = tMat.col1).x + r1Y * col1$0.y;
				tVec.y = r1X * (col2$0 = tMat.col2).x + r1Y * col2$0.y;
				tVec = ccp.localAnchor2;
				tMat = b2.m_R;
				tVec.x = r2X * (col1$1 = tMat.col1).x + r2Y * col1$1.y;
				tVec.y = r2X * (col2$1 = tMat.col2).x + r2Y * col2$1.y;
				r1Sqr = r1X * r1X + r1Y * r1Y;
				r2Sqr = r2X * r2X + r2Y * r2Y;
				rn1 = r1X * normalX + r1Y * normalY;
				rn2 = r2X * normalX + r2Y * normalY;
				kNormal = (m_invMass$0 = b1.m_invMass) + (m_invMass$1 = b2.m_invMass);
				kNormal += (m_invI$0 = b1.m_invI) * (r1Sqr - rn1 * rn1) + (m_invI$1 = b2.m_invI) * (r2Sqr - rn2 * rn2);
				ccp.normalMass = 1.0 / kNormal;
				tangentY = - normalX;
				rt1 = r1X * normalY + r1Y * tangentY;
				rt2 = r2X * normalY + r2Y * tangentY;
				kTangent = m_invMass$0 + m_invMass$1;
				kTangent += m_invI$0 * (r1Sqr - rt1 * rt1) + m_invI$1 * (r2Sqr - rt2 * rt2);
				ccp.tangentMass = 1.0 / kTangent;
				ccp.velocityBias = 0.0;
				if (separation$0 > 0.0) {
					ccp.velocityBias = -60 * ccp.separation;
				}
				tX = v2X + - w2 * r2Y - v1X - - w1 * r1Y;
				tY = v2Y + w2 * r2X - v1Y - w1 * r1X;
				vRel = (normal$0 = c.normal).x * tX + normal$0.y * tY;
				if (vRel < -30) {
					ccp.velocityBias += - c.restitution * vRel;
				}
			}
			++ count;
		}
	}
};

$__jsx_extend([b2ContactSolver], Object);
b2ContactSolver.prototype.PreSolve$ = function () {
	var tVec;
	var tMat;
	var i;
	var c;
	var b1;
	var b2;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tangentX;
	var tangentY;
	var j;
	var tCount;
	var ccp;
	var PX;
	var PY;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var ccp2;
	var normalImpulse$0;
	var tangentImpulse$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var m_linearVelocity$0;
	var m_linearVelocity$1;
	var normal$0;
	for (i = 0; i < this.m_constraintCount; ++ i) {
		c = this.m_constraints[i];
		b1 = c.body1;
		b2 = c.body2;
		invMass1 = b1.m_invMass;
		invI1 = b1.m_invI;
		invMass2 = b2.m_invMass;
		invI2 = b2.m_invI;
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tangentX = normalY;
		tangentY = - normalX;
		j = 0;
		tCount = 0;
		if (b2World.s_enableWarmStarting) {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++ j) {
				ccp = c.points[j];
				PX = (normalImpulse$0 = ccp.normalImpulse) * normalX + (tangentImpulse$0 = ccp.tangentImpulse) * tangentX;
				PY = normalImpulse$0 * normalY + tangentImpulse$0 * tangentY;
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
				r1Y = col1$0.y * x$0 + col2$0.y * y$0;
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
				r2Y = col1$1.y * x$1 + col2$1.y * y$1;
				b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
				(m_linearVelocity$0 = b1.m_linearVelocity).x -= invMass1 * PX;
				m_linearVelocity$0.y -= invMass1 * PY;
				b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
				(m_linearVelocity$1 = b2.m_linearVelocity).x += invMass2 * PX;
				m_linearVelocity$1.y += invMass2 * PY;
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


function b2ContactSolver$PreSolve$Lb2ContactSolver$($this) {
	var tVec;
	var tMat;
	var i;
	var c;
	var b1;
	var b2;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tangentX;
	var tangentY;
	var j;
	var tCount;
	var ccp;
	var PX;
	var PY;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var ccp2;
	var normalImpulse$0;
	var tangentImpulse$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var m_linearVelocity$0;
	var m_linearVelocity$1;
	var normal$0;
	for (i = 0; i < $this.m_constraintCount; ++ i) {
		c = $this.m_constraints[i];
		b1 = c.body1;
		b2 = c.body2;
		invMass1 = b1.m_invMass;
		invI1 = b1.m_invI;
		invMass2 = b2.m_invMass;
		invI2 = b2.m_invI;
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tangentX = normalY;
		tangentY = - normalX;
		j = 0;
		tCount = 0;
		if (b2World.s_enableWarmStarting) {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++ j) {
				ccp = c.points[j];
				PX = (normalImpulse$0 = ccp.normalImpulse) * normalX + (tangentImpulse$0 = ccp.tangentImpulse) * tangentX;
				PY = normalImpulse$0 * normalY + tangentImpulse$0 * tangentY;
				tMat = b1.m_R;
				tVec = ccp.localAnchor1;
				r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
				r1Y = col1$0.y * x$0 + col2$0.y * y$0;
				tMat = b2.m_R;
				tVec = ccp.localAnchor2;
				r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
				r2Y = col1$1.y * x$1 + col2$1.y * y$1;
				b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
				(m_linearVelocity$0 = b1.m_linearVelocity).x -= invMass1 * PX;
				m_linearVelocity$0.y -= invMass1 * PY;
				b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
				(m_linearVelocity$1 = b2.m_linearVelocity).x += invMass2 * PX;
				m_linearVelocity$1.y += invMass2 * PY;
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

b2ContactSolver.PreSolve$Lb2ContactSolver$ = b2ContactSolver$PreSolve$Lb2ContactSolver$;

b2ContactSolver.prototype.SolveVelocityConstraints$ = function () {
	var j;
	var ccp;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var dvX;
	var dvY;
	var lambda;
	var newImpulse;
	var PX;
	var PY;
	var tMat;
	var tVec;
	var i;
	var c;
	var b1;
	var b2;
	var b1_angularVelocity;
	var b1_linearVelocity;
	var b2_angularVelocity;
	var b2_linearVelocity;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tangentX;
	var tangentY;
	var tCount;
	var vn;
	var vt;
	var maxFriction;
	var a$0;
	var a$2;
	var low$0;
	var b$0$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var x$2;
	var x$3;
	var y$2;
	var y$3;
	var normalImpulse$0;
	var normal$0;
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
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tangentX = normalY;
		tangentY = - normalX;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
			r1Y = col1$0.y * x$0 + col2$0.y * y$0;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
			r2Y = col1$1.y * x$1 + col2$1.y * y$1;
			dvX = b2_linearVelocity.x + - b2_angularVelocity * r2Y - b1_linearVelocity.x - - b1_angularVelocity * r1Y;
			dvY = b2_linearVelocity.y + b2_angularVelocity * r2X - b1_linearVelocity.y - b1_angularVelocity * r1X;
			vn = dvX * normalX + dvY * normalY;
			lambda = - ccp.normalMass * (vn - ccp.velocityBias);
			a$0 = ccp.normalImpulse + lambda;
			newImpulse = (a$0 > 0.0 ? a$0 : 0.0);
			lambda = newImpulse - ccp.normalImpulse;
			PX = lambda * normalX;
			PY = lambda * normalY;
			x$3 = b1_linearVelocity.x -= invMass1 * PX;
			y$3 = b1_linearVelocity.y -= invMass1 * PY;
			b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
			x$2 = b2_linearVelocity.x += invMass2 * PX;
			y$2 = b2_linearVelocity.y += invMass2 * PY;
			b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
			normalImpulse$0 = ccp.normalImpulse = newImpulse;
			dvX = x$2 + - b2_angularVelocity * r2Y - x$3 - - b1_angularVelocity * r1Y;
			dvY = y$2 + b2_angularVelocity * r2X - y$3 - b1_angularVelocity * r1X;
			vt = dvX * tangentX + dvY * tangentY;
			lambda = ccp.tangentMass * - vt;
			maxFriction = c.friction * normalImpulse$0;
			a$2 = ccp.tangentImpulse + lambda;
			low$0 = - maxFriction;
			b$0$0 = (a$2 < maxFriction ? a$2 : maxFriction);
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


function b2ContactSolver$SolveVelocityConstraints$Lb2ContactSolver$($this) {
	var j;
	var ccp;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var dvX;
	var dvY;
	var lambda;
	var newImpulse;
	var PX;
	var PY;
	var tMat;
	var tVec;
	var i;
	var c;
	var b1;
	var b2;
	var b1_angularVelocity;
	var b1_linearVelocity;
	var b2_angularVelocity;
	var b2_linearVelocity;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tangentX;
	var tangentY;
	var tCount;
	var vn;
	var vt;
	var maxFriction;
	var a$0;
	var a$2;
	var low$0;
	var b$0$0;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var x$2;
	var x$3;
	var y$2;
	var y$3;
	var normalImpulse$0;
	var normal$0;
	j = 0;
	for (i = 0; i < $this.m_constraintCount; ++ i) {
		c = $this.m_constraints[i];
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
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tangentX = normalY;
		tangentY = - normalX;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
			r1Y = col1$0.y * x$0 + col2$0.y * y$0;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
			r2Y = col1$1.y * x$1 + col2$1.y * y$1;
			dvX = b2_linearVelocity.x + - b2_angularVelocity * r2Y - b1_linearVelocity.x - - b1_angularVelocity * r1Y;
			dvY = b2_linearVelocity.y + b2_angularVelocity * r2X - b1_linearVelocity.y - b1_angularVelocity * r1X;
			vn = dvX * normalX + dvY * normalY;
			lambda = - ccp.normalMass * (vn - ccp.velocityBias);
			a$0 = ccp.normalImpulse + lambda;
			newImpulse = (a$0 > 0.0 ? a$0 : 0.0);
			lambda = newImpulse - ccp.normalImpulse;
			PX = lambda * normalX;
			PY = lambda * normalY;
			x$3 = b1_linearVelocity.x -= invMass1 * PX;
			y$3 = b1_linearVelocity.y -= invMass1 * PY;
			b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
			x$2 = b2_linearVelocity.x += invMass2 * PX;
			y$2 = b2_linearVelocity.y += invMass2 * PY;
			b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
			normalImpulse$0 = ccp.normalImpulse = newImpulse;
			dvX = x$2 + - b2_angularVelocity * r2Y - x$3 - - b1_angularVelocity * r1Y;
			dvY = y$2 + b2_angularVelocity * r2X - y$3 - b1_angularVelocity * r1X;
			vt = dvX * tangentX + dvY * tangentY;
			lambda = ccp.tangentMass * - vt;
			maxFriction = c.friction * normalImpulse$0;
			a$2 = ccp.tangentImpulse + lambda;
			low$0 = - maxFriction;
			b$0$0 = (a$2 < maxFriction ? a$2 : maxFriction);
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

b2ContactSolver.SolveVelocityConstraints$Lb2ContactSolver$ = b2ContactSolver$SolveVelocityConstraints$Lb2ContactSolver$;

b2ContactSolver.prototype.SolvePositionConstraints$N = function (beta) {
	var minSeparation;
	var tMat;
	var tVec;
	var i;
	var c;
	var b1;
	var b2;
	var b1_position;
	var b1_rotation;
	var b2_position;
	var b2_rotation;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tCount;
	var j;
	var ccp;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var p1X;
	var p1Y;
	var p2X;
	var p2Y;
	var dpX;
	var dpY;
	var separation;
	var C;
	var dImpulse;
	var impulse0;
	var impulseX;
	var impulseY;
	var a$0;
	var b$0$0;
	var a$1;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var positionImpulse$0;
	var normal$0;
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
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
			r1Y = col1$0.y * x$0 + col2$0.y * y$0;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
			r2Y = col1$1.y * x$1 + col2$1.y * y$1;
			p1X = b1_position.x + r1X;
			p1Y = b1_position.y + r1Y;
			p2X = b2_position.x + r2X;
			p2Y = b2_position.y + r2Y;
			dpX = p2X - p1X;
			dpY = p2Y - p1Y;
			separation = dpX * normalX + dpY * normalY + ccp.separation;
			minSeparation = (minSeparation < separation ? minSeparation : separation);
			C = beta * (a$0 = separation + 0.15, b$0$0 = (a$0 < 0.0 ? a$0 : 0.0), -6 > b$0$0 ? -6 : b$0$0);
			dImpulse = - ccp.normalMass * C;
			impulse0 = ccp.positionImpulse;
			a$1 = impulse0 + dImpulse;
			positionImpulse$0 = ccp.positionImpulse = (a$1 > 0.0 ? a$1 : 0.0);
			dImpulse = positionImpulse$0 - impulse0;
			impulseX = dImpulse * normalX;
			impulseY = dImpulse * normalY;
			b1_position.x -= invMass1 * impulseX;
			b1_position.y -= invMass1 * impulseY;
			b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
			b2Mat22$Set$Lb2Mat22$N(b1.m_R, b1_rotation);
			b2_position.x += invMass2 * impulseX;
			b2_position.y += invMass2 * impulseY;
			b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
			b2Mat22$Set$Lb2Mat22$N(b2.m_R, b2_rotation);
		}
		b1.m_rotation = b1_rotation;
		b2.m_rotation = b2_rotation;
	}
	return minSeparation >= -0.15;
};


function b2ContactSolver$SolvePositionConstraints$Lb2ContactSolver$N($this, beta) {
	var minSeparation;
	var tMat;
	var tVec;
	var i;
	var c;
	var b1;
	var b2;
	var b1_position;
	var b1_rotation;
	var b2_position;
	var b2_rotation;
	var invMass1;
	var invI1;
	var invMass2;
	var invI2;
	var normalX;
	var normalY;
	var tCount;
	var j;
	var ccp;
	var r1X;
	var r1Y;
	var r2X;
	var r2Y;
	var p1X;
	var p1Y;
	var p2X;
	var p2Y;
	var dpX;
	var dpY;
	var separation;
	var C;
	var dImpulse;
	var impulse0;
	var impulseX;
	var impulseY;
	var a$0;
	var b$0$0;
	var a$1;
	var col1$0;
	var x$0;
	var col2$0;
	var y$0;
	var col1$1;
	var x$1;
	var col2$1;
	var y$1;
	var positionImpulse$0;
	var normal$0;
	minSeparation = 0.0;
	for (i = 0; i < $this.m_constraintCount; ++ i) {
		c = $this.m_constraints[i];
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
		normalX = (normal$0 = c.normal).x;
		normalY = normal$0.y;
		tCount = c.pointCount;
		for (j = 0; j < tCount; ++ j) {
			ccp = c.points[j];
			tMat = b1.m_R;
			tVec = ccp.localAnchor1;
			r1X = (col1$0 = tMat.col1).x * (x$0 = tVec.x) + (col2$0 = tMat.col2).x * (y$0 = tVec.y);
			r1Y = col1$0.y * x$0 + col2$0.y * y$0;
			tMat = b2.m_R;
			tVec = ccp.localAnchor2;
			r2X = (col1$1 = tMat.col1).x * (x$1 = tVec.x) + (col2$1 = tMat.col2).x * (y$1 = tVec.y);
			r2Y = col1$1.y * x$1 + col2$1.y * y$1;
			p1X = b1_position.x + r1X;
			p1Y = b1_position.y + r1Y;
			p2X = b2_position.x + r2X;
			p2Y = b2_position.y + r2Y;
			dpX = p2X - p1X;
			dpY = p2Y - p1Y;
			separation = dpX * normalX + dpY * normalY + ccp.separation;
			minSeparation = (minSeparation < separation ? minSeparation : separation);
			C = beta * (a$0 = separation + 0.15, b$0$0 = (a$0 < 0.0 ? a$0 : 0.0), -6 > b$0$0 ? -6 : b$0$0);
			dImpulse = - ccp.normalMass * C;
			impulse0 = ccp.positionImpulse;
			a$1 = impulse0 + dImpulse;
			positionImpulse$0 = ccp.positionImpulse = (a$1 > 0.0 ? a$1 : 0.0);
			dImpulse = positionImpulse$0 - impulse0;
			impulseX = dImpulse * normalX;
			impulseY = dImpulse * normalY;
			b1_position.x -= invMass1 * impulseX;
			b1_position.y -= invMass1 * impulseY;
			b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
			b2Mat22$Set$Lb2Mat22$N(b1.m_R, b1_rotation);
			b2_position.x += invMass2 * impulseX;
			b2_position.y += invMass2 * impulseY;
			b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
			b2Mat22$Set$Lb2Mat22$N(b2.m_R, b2_rotation);
		}
		b1.m_rotation = b1_rotation;
		b2.m_rotation = b2_rotation;
	}
	return minSeparation >= -0.15;
};

b2ContactSolver.SolvePositionConstraints$Lb2ContactSolver$N = b2ContactSolver$SolvePositionConstraints$Lb2ContactSolver$N;

b2ContactSolver.prototype.PostSolve$ = function () {
	var i;
	var c;
	var m;
	var j;
	var mPoint;
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


function b2ContactSolver$PostSolve$Lb2ContactSolver$($this) {
	var i;
	var c;
	var m;
	var j;
	var mPoint;
	var cPoint;
	for (i = 0; i < $this.m_constraintCount; ++ i) {
		c = $this.m_constraints[i];
		m = c.manifold;
		for (j = 0; j < c.pointCount; ++ j) {
			mPoint = m.points[j];
			cPoint = c.points[j];
			mPoint.normalImpulse = cPoint.normalImpulse;
			mPoint.tangentImpulse = cPoint.tangentImpulse;
		}
	}
};

b2ContactSolver.PostSolve$Lb2ContactSolver$ = b2ContactSolver$PostSolve$Lb2ContactSolver$;

function b2NullContact(s1, s2) {
	b2Contact.call(this, s1, s2);
};

function b2NullContact$0() {
	b2Contact$0.call(this);
};

$__jsx_extend([b2NullContact, b2NullContact$0], b2Contact);
b2NullContact.prototype.Evaluate$ = function () {
};


b2NullContact.prototype.GetManifolds$ = function () {
	return null;
};


function b2PolyAndCircleContact(s1, s2) {
	var a$0;
	var a$1;
	var m_manifold$0;
	b2Contact.call(this, s1, s2);
	this.m_manifold = [ new b2Manifold() ];
	a$0 = this.m_shape1.m_type === 2;
	if (! a$0) {
		debugger;
	}
	a$1 = this.m_shape2.m_type === 0;
	if (! a$1) {
		debugger;
	}
	(m_manifold$0 = this.m_manifold)[0].pointCount = 0;
	m_manifold$0[0].points[0].normalImpulse = 0.0;
	m_manifold$0[0].points[0].tangentImpulse = 0.0;
};

$__jsx_extend([b2PolyAndCircleContact], b2Contact);
b2PolyAndCircleContact.prototype.Evaluate$ = function () {
	b2Collision$b2CollidePolyAndCircle$Lb2Manifold$Lb2PolyShape$Lb2CircleShape$B(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
	if (this.m_manifold[0].pointCount > 0) {
		this.m_manifoldCount = 1;
	} else {
		this.m_manifoldCount = 0;
	}
};


b2PolyAndCircleContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};


function b2PolyAndCircleContact$Create$Lb2PolyShape$Lb2CircleShape$X(shape1, shape2, allocator) {
	return new b2PolyAndCircleContact(shape1, shape2);
};

b2PolyAndCircleContact.Create$Lb2PolyShape$Lb2CircleShape$X = b2PolyAndCircleContact$Create$Lb2PolyShape$Lb2CircleShape$X;

function b2PolyAndCircleContact$Destroy$Lb2Contact$X(contact, allocator) {
};

b2PolyAndCircleContact.Destroy$Lb2Contact$X = b2PolyAndCircleContact$Destroy$Lb2Contact$X;

function b2PolyContact(s1, s2) {
	var m_manifold$0;
	b2Contact.call(this, s1, s2);
	this.m0 = new b2Manifold();
	m_manifold$0 = this.m_manifold = [ new b2Manifold() ];
	m_manifold$0[0].pointCount = 0;
};

$__jsx_extend([b2PolyContact], b2Contact);
b2PolyContact.prototype.Evaluate$ = function () {
	var tMani;
	var tPoints;
	var k;
	var tPoint;
	var tPoint0;
	var match;
	var i;
	var cp;
	var idKey;
	var j;
	var cp0;
	var id0;
	var this$0;
	var id$0;
	tMani = this.m_manifold[0];
	tPoints = this.m0.points;
	for (k = 0; k < tMani.pointCount; k++) {
		tPoint = tPoints[k];
		tPoint0 = tMani.points[k];
		tPoint.normalImpulse = tPoint0.normalImpulse;
		tPoint.tangentImpulse = tPoint0.tangentImpulse;
		this$0 = tPoint0.id;
		id$0 = new b2ContactID();
		b2ContactID$set_key$Lb2ContactID$N(id$0, this$0._key);
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
				if (match[j] === true) {
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


b2PolyContact.prototype.GetManifolds$ = function () {
	return this.m_manifold;
};


function b2PolyContact$Create$Lb2PolyShape$Lb2PolyShape$X(shape1, shape2, allocator) {
	return new b2PolyContact(shape1, shape2);
};

b2PolyContact.Create$Lb2PolyShape$Lb2PolyShape$X = b2PolyContact$Create$Lb2PolyShape$Lb2PolyShape$X;

function b2PolyContact$Destroy$Lb2Contact$X(contact, allocator) {
};

b2PolyContact.Destroy$Lb2Contact$X = b2PolyContact$Destroy$Lb2Contact$X;

function dom() {
};

$__jsx_extend([dom], Object);
function dom$id$S(id) {
	return dom.document.getElementById(id);
};

dom.id$S = dom$id$S;

function dom$getElementById$S(id) {
	return dom.document.getElementById(id);
};

dom.getElementById$S = dom$getElementById$S;

function dom$createElement$S(tag) {
	return dom.document.createElement(tag);
};

dom.createElement$S = dom$createElement$S;

function EventInit() {
	this.bubbles = false;
	this.cancelable = false;
};

$__jsx_extend([EventInit], Object);
function CustomEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.detail = null;
};

$__jsx_extend([CustomEventInit], EventInit);
function MutationObserverInit() {
	this.childList = false;
	this.attributes = false;
	this.characterData = false;
	this.subtree = false;
	this.attributeOldValue = false;
	this.characterDataOldValue = false;
	this.attributeFilter = null;
};

$__jsx_extend([MutationObserverInit], Object);
function UIEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
};

$__jsx_extend([UIEventInit], EventInit);
function FocusEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
	this.relatedTarget = null;
};

$__jsx_extend([FocusEventInit], Object);
function MouseEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
	this.screenX = 0;
	this.screenY = 0;
	this.clientX = 0;
	this.clientY = 0;
	this.ctrlKey = false;
	this.shiftKey = false;
	this.altKey = false;
	this.metaKey = false;
	this.button = 0;
	this.buttons = 0;
	this.relatedTarget = null;
	this.region = null;
};

$__jsx_extend([MouseEventInit], UIEventInit);
function WheelEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
	this.screenX = 0;
	this.screenY = 0;
	this.clientX = 0;
	this.clientY = 0;
	this.ctrlKey = false;
	this.shiftKey = false;
	this.altKey = false;
	this.metaKey = false;
	this.button = 0;
	this.buttons = 0;
	this.relatedTarget = null;
	this.deltaX = 0;
	this.deltaY = 0;
	this.deltaZ = 0;
	this.deltaMode = 0;
};

$__jsx_extend([WheelEventInit], Object);
function KeyboardEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
	this.char = "";
	this.key = "";
	this.location = 0;
	this.ctrlKey = false;
	this.shiftKey = false;
	this.altKey = false;
	this.metaKey = false;
	this.repeat = false;
	this.locale = "";
	this.charCode = 0;
	this.keyCode = 0;
	this.which = 0;
};

$__jsx_extend([KeyboardEventInit], Object);
function CompositionEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.view = null;
	this.detail = 0;
	this.data = null;
	this.locale = "";
};

$__jsx_extend([CompositionEventInit], Object);
function ProgressEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.lengthComputable = false;
	this.loaded = 0;
	this.total = 0;
};

$__jsx_extend([ProgressEventInit], EventInit);
function XMLHttpRequestOptions() {
	this.anon = false;
};

$__jsx_extend([XMLHttpRequestOptions], Object);
function ScrollOptions() {
	this.x = 0;
	this.y = 0;
	this.behavior = "";
};

$__jsx_extend([ScrollOptions], Object);
function TrackEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.track = null;
};

$__jsx_extend([TrackEventInit], EventInit);
function PopStateEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.state = null;
};

$__jsx_extend([PopStateEventInit], EventInit);
function HashChangeEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.oldURL = "";
	this.newURL = "";
};

$__jsx_extend([HashChangeEventInit], EventInit);
function PageTransitionEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.persisted = false;
};

$__jsx_extend([PageTransitionEventInit], EventInit);
function ErrorEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.message = "";
	this.filename = "";
	this.lineno = 0;
	this.column = 0;
};

$__jsx_extend([ErrorEventInit], EventInit);
function DragEventInit() {
	MouseEventInit.call(this);
	this.dataTransfer = null;
};

$__jsx_extend([DragEventInit], MouseEventInit);
function CloseEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.wasClean = false;
	this.code = 0;
	this.reason = "";
};

$__jsx_extend([CloseEventInit], EventInit);
function StorageEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.key = null;
	this.oldValue = null;
	this.newValue = null;
	this.url = "";
	this.storageArea = null;
};

$__jsx_extend([StorageEventInit], EventInit);
function MessageEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.data = null;
	this.origin = "";
	this.lastEventId = "";
	this.source = null;
	this.ports = null;
};

$__jsx_extend([MessageEventInit], EventInit);
function EventSourceInit() {
	this.withCredentials = false;
};

$__jsx_extend([EventSourceInit], Object);
function IDBObjectStoreParameters() {
	this.keyPath = null;
	this.autoIncrement = false;
};

$__jsx_extend([IDBObjectStoreParameters], Object);
function IDBIndexParameters() {
	this.unique = false;
	this.multiEntry = false;
};

$__jsx_extend([IDBIndexParameters], Object);
function IDBVersionChangeEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.oldVersion = 0;
	this.newVersion = null;
};

$__jsx_extend([IDBVersionChangeEventInit], EventInit);
function NotificationOptions() {
	this.titleDir = "";
	this.body = "";
	this.bodyDir = "";
	this.tag = "";
	this.iconUrl = "";
};

$__jsx_extend([NotificationOptions], Object);
function RTCSessionDescriptionInit() {
	this.type = "";
	this.sdp = "";
};

$__jsx_extend([RTCSessionDescriptionInit], Object);
function RTCIceCandidateInit() {
	this.candidate = "";
	this.sdpMid = "";
	this.sdpMLineIndex = 0;
};

$__jsx_extend([RTCIceCandidateInit], Object);
function RTCIceServer() {
	this.url = "";
	this.credential = null;
};

$__jsx_extend([RTCIceServer], Object);
function RTCConfiguration() {
	this.iceServers = null;
};

$__jsx_extend([RTCConfiguration], Object);
function DataChannelInit() {
	this.reliable = false;
};

$__jsx_extend([DataChannelInit], Object);
function RTCPeerConnectionIceEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.candidate = null;
};

$__jsx_extend([RTCPeerConnectionIceEventInit], EventInit);
function MediaStreamEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.stream = null;
};

$__jsx_extend([MediaStreamEventInit], EventInit);
function DataChannelEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.channel = null;
};

$__jsx_extend([DataChannelEventInit], EventInit);
function MediaStreamConstraints() {
	this.video = null;
	this.audio = null;
};

$__jsx_extend([MediaStreamConstraints], Object);
function MediaTrackConstraints() {
	this.mandatory = null;
	this.optional = null;
};

$__jsx_extend([MediaTrackConstraints], Object);
function HitRegionOptions() {
	this.path = null;
	this.id = "";
	this.parentID = null;
	this.cursor = "";
	this.control = null;
	this.label = null;
	this.role = null;
};

$__jsx_extend([HitRegionOptions], Object);
function WebGLContextAttributes() {
	this.alpha = false;
	this.depth = false;
	this.stencil = false;
	this.antialias = false;
	this.premultipliedAlpha = false;
	this.preserveDrawingBuffer = false;
};

$__jsx_extend([WebGLContextAttributes], Object);
function WebGLContextEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.statusMessage = "";
};

$__jsx_extend([WebGLContextEventInit], EventInit);
function DeviceOrientationEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.alpha = null;
	this.beta = null;
	this.gamma = null;
	this.absolute = false;
};

$__jsx_extend([DeviceOrientationEventInit], EventInit);
function DeviceMotionEventInit() {
	this.bubbles = false;
	this.cancelable = false;
	this.acceleration = null;
	this.accelerationIncludingGravity = null;
	this.rotationRate = null;
	this.interval = null;
};

$__jsx_extend([DeviceMotionEventInit], EventInit);
var js$0 = (function () { var global = (function () { return this; }()); return { global: global, eval: global.eval, invoke: function(invocant, methodName, args) { return invocant[methodName].apply(invocant, args); } }; }());
_Main.PROFILER_URL = "http://localhosrt:5001/post-profile";
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
	return ({x: 0, y: 0});
});
$__jsx_lazy_init(b2Math, "tempVec3", function () {
	return ({x: 0, y: 0});
});
$__jsx_lazy_init(b2Math, "tempVec4", function () {
	return ({x: 0, y: 0});
});
$__jsx_lazy_init(b2Math, "tempVec5", function () {
	return ({x: 0, y: 0});
});
$__jsx_lazy_init(b2Math, "tempMat", function () {
	return new b2Mat22$1();
});
b2BroadPhase.s_validate = false;
b2BroadPhase.b2_invalid = 0x0000ffff;
$__jsx_lazy_init(b2BroadPhase, "b2_nullEdge", function () {
	return b2Settings.USHRT_MAX;
});
b2Collision.b2_nullFeature = 0x000000ff;
$__jsx_lazy_init(b2Collision, "b2CollidePolyTempVec", function () {
	return ({x: 0, y: 0});
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
	return ({x: 0, y: 0});
});
$__jsx_lazy_init(b2PolyShape, "tAbsR", function () {
	return new b2Mat22$1();
});
b2Body.e_staticFlag = 0x0001;
b2Body.e_frozenFlag = 0x0002;
b2Body.e_islandFlag = 0x0004;
b2Body.e_sleepFlag = 0x0008;
b2Body.e_allowSleepFlag = 0x0010;
b2Body.e_destroyFlag = 0x0020;
$__jsx_lazy_init(b2CollisionFilter, "b2_defaultFilter", function () {
	return ({});
});
b2Island.m_positionIterationCount = 0;
b2World.s_enablePositionCorrection = true;
b2World.s_enableWarmStarting = true;
b2Contact.e_islandFlag = 0x0001;
b2Contact.e_destroyFlag = 0x0002;
b2Contact.s_registers = null;
b2Contact.s_initialized = false;
$__jsx_lazy_init(dom, "window", function () {
	return js$0.global.window;
});
$__jsx_lazy_init(dom, "document", function () {
	return js$0.global.document;
});

var $__jsx_classMap = {
	"system:lib/built-in.jsx": {
		StopIteration: StopIteration,
		StopIteration$: StopIteration
	},
	"box2d-sample.jsx": {
		_Main: _Main,
		_Main$: _Main
	},
	"../src/box2d/common/b2Settings.jsx": {
		b2Settings: b2Settings,
		b2Settings$: b2Settings
	},
	"../src/box2d/common/math/b2Mat22.jsx": {
		b2Mat22: b2Mat22,
		b2Mat22$NLb2Vec2$Lb2Vec2$: b2Mat22,
		b2Mat22$N: b2Mat22$0,
		b2Mat22$: b2Mat22$1
	},
	"../src/box2d/common/math/b2Math.jsx": {
		b2Math: b2Math,
		b2Math$: b2Math
	},
	"../src/box2d/common/math/b2Vec2.jsx": {
		b2Vec2: b2Vec2,
		b2Vec2$: b2Vec2,
		b2Vec2$NN: b2Vec2$0
	},
	"../src/box2d/collision/ClipVertex.jsx": {
		ClipVertex: ClipVertex,
		ClipVertex$: ClipVertex
	},
	"../src/box2d/collision/Features.jsx": {
		Features: Features,
		Features$: Features
	},
	"../src/box2d/collision/b2AABB.jsx": {
		b2AABB: b2AABB,
		b2AABB$: b2AABB
	},
	"../src/box2d/collision/b2Bound.jsx": {
		b2Bound: b2Bound,
		b2Bound$: b2Bound
	},
	"../src/box2d/collision/b2BoundValues.jsx": {
		b2BoundValues: b2BoundValues,
		b2BoundValues$: b2BoundValues
	},
	"../src/box2d/collision/b2BroadPhase.jsx": {
		b2BroadPhase: b2BroadPhase,
		b2BroadPhase$Lb2AABB$Lb2PairCallback$: b2BroadPhase
	},
	"../src/box2d/collision/b2BufferedPair.jsx": {
		b2BufferedPair: b2BufferedPair,
		b2BufferedPair$: b2BufferedPair
	},
	"../src/box2d/collision/b2Collision.jsx": {
		b2Collision: b2Collision,
		b2Collision$: b2Collision
	},
	"../src/box2d/collision/b2ContactID.jsx": {
		b2ContactID: b2ContactID,
		b2ContactID$: b2ContactID
	},
	"../src/box2d/collision/b2ContactPoint.jsx": {
		b2ContactPoint: b2ContactPoint,
		b2ContactPoint$: b2ContactPoint
	},
	"../src/box2d/collision/b2Manifold.jsx": {
		b2Manifold: b2Manifold,
		b2Manifold$: b2Manifold
	},
	"../src/box2d/collision/b2OBB.jsx": {
		b2OBB: b2OBB,
		b2OBB$: b2OBB
	},
	"../src/box2d/collision/b2Pair.jsx": {
		b2Pair: b2Pair,
		b2Pair$: b2Pair
	},
	"../src/box2d/collision/b2PairCallback.jsx": {
		b2PairCallback: b2PairCallback,
		b2PairCallback$: b2PairCallback
	},
	"../src/box2d/collision/b2PairManager.jsx": {
		b2PairManager: b2PairManager,
		b2PairManager$: b2PairManager
	},
	"../src/box2d/collision/b2Proxy.jsx": {
		b2Proxy: b2Proxy,
		b2Proxy$: b2Proxy
	},
	"../src/box2d/collision/shapes/b2MassData.jsx": {
		b2MassData: b2MassData,
		b2MassData$: b2MassData
	},
	"../src/box2d/collision/shapes/b2Shape.jsx": {
		b2Shape: b2Shape,
		b2Shape$Lb2ShapeDef$Lb2Body$: b2Shape
	},
	"../src/box2d/collision/shapes/b2PolyShape.jsx": {
		b2PolyShape: b2PolyShape,
		b2PolyShape$Lb2ShapeDef$Lb2Body$Lb2Vec2$: b2PolyShape
	},
	"../src/box2d/collision/shapes/b2CircleShape.jsx": {
		b2CircleShape: b2CircleShape,
		b2CircleShape$Lb2CircleDef$Lb2Body$Lb2Vec2$: b2CircleShape
	},
	"../src/box2d/collision/shapes/b2ShapeDef.jsx": {
		b2ShapeDef: b2ShapeDef,
		b2ShapeDef$: b2ShapeDef
	},
	"../src/box2d/collision/shapes/b2PolyDef.jsx": {
		b2PolyDef: b2PolyDef,
		b2PolyDef$: b2PolyDef
	},
	"../src/box2d/collision/shapes/b2CircleDef.jsx": {
		b2CircleDef: b2CircleDef,
		b2CircleDef$: b2CircleDef
	},
	"../src/box2d/collision/shapes/b2BoxDef.jsx": {
		b2BoxDef: b2BoxDef,
		b2BoxDef$: b2BoxDef
	},
	"../src/box2d/dynamics/b2Body.jsx": {
		b2Body: b2Body,
		b2Body$Lb2BodyDef$Lb2World$: b2Body
	},
	"../src/box2d/dynamics/b2BodyDef.jsx": {
		b2BodyDef: b2BodyDef,
		b2BodyDef$: b2BodyDef
	},
	"../src/box2d/dynamics/b2CollisionFilter.jsx": {
		b2CollisionFilter: b2CollisionFilter,
		b2CollisionFilter$: b2CollisionFilter
	},
	"../src/box2d/dynamics/b2ContactManager.jsx": {
		b2ContactManager: b2ContactManager,
		b2ContactManager$: b2ContactManager
	},
	"../src/box2d/dynamics/b2Island.jsx": {
		b2Island: b2Island,
		b2Island$NNNX: b2Island
	},
	"../src/box2d/dynamics/b2TimeStep.jsx": {
		b2TimeStep: b2TimeStep,
		b2TimeStep$: b2TimeStep
	},
	"../src/box2d/dynamics/b2World.jsx": {
		b2World: b2World,
		b2World$Lb2AABB$Lb2Vec2$B: b2World
	},
	"../src/box2d/dynamics/contacts/b2Contact.jsx": {
		b2Contact: b2Contact,
		b2Contact$Lb2Shape$Lb2Shape$: b2Contact,
		b2Contact$: b2Contact$0
	},
	"../src/box2d/dynamics/contacts/b2CircleContact.jsx": {
		b2CircleContact: b2CircleContact,
		b2CircleContact$Lb2CircleShape$Lb2CircleShape$: b2CircleContact
	},
	"../src/box2d/dynamics/contacts/b2ContactConstraint.jsx": {
		b2ContactConstraint: b2ContactConstraint,
		b2ContactConstraint$: b2ContactConstraint
	},
	"../src/box2d/dynamics/contacts/b2ContactConstraintPoint.jsx": {
		b2ContactConstraintPoint: b2ContactConstraintPoint,
		b2ContactConstraintPoint$: b2ContactConstraintPoint
	},
	"../src/box2d/dynamics/contacts/b2ContactNode.jsx": {
		b2ContactNode: b2ContactNode,
		b2ContactNode$: b2ContactNode
	},
	"../src/box2d/dynamics/contacts/b2ContactRegister.jsx": {
		b2ContactRegister: b2ContactRegister,
		b2ContactRegister$: b2ContactRegister
	},
	"../src/box2d/dynamics/contacts/b2ContactSolver.jsx": {
		b2ContactSolver: b2ContactSolver,
		b2ContactSolver$ALb2Contact$NX: b2ContactSolver
	},
	"../src/box2d/dynamics/contacts/b2NullContact.jsx": {
		b2NullContact: b2NullContact,
		b2NullContact$Lb2Shape$Lb2Shape$: b2NullContact,
		b2NullContact$: b2NullContact$0
	},
	"../src/box2d/dynamics/contacts/b2PolyAndCircleContact.jsx": {
		b2PolyAndCircleContact: b2PolyAndCircleContact,
		b2PolyAndCircleContact$Lb2PolyShape$Lb2CircleShape$: b2PolyAndCircleContact
	},
	"../src/box2d/dynamics/contacts/b2PolyContact.jsx": {
		b2PolyContact: b2PolyContact,
		b2PolyContact$Lb2PolyShape$Lb2PolyShape$: b2PolyContact
	},
	"system:lib/js/js/web.jsx": {
		dom: dom,
		dom$: dom,
		EventInit: EventInit,
		EventInit$: EventInit,
		CustomEventInit: CustomEventInit,
		CustomEventInit$: CustomEventInit,
		MutationObserverInit: MutationObserverInit,
		MutationObserverInit$: MutationObserverInit,
		UIEventInit: UIEventInit,
		UIEventInit$: UIEventInit,
		FocusEventInit: FocusEventInit,
		FocusEventInit$: FocusEventInit,
		MouseEventInit: MouseEventInit,
		MouseEventInit$: MouseEventInit,
		WheelEventInit: WheelEventInit,
		WheelEventInit$: WheelEventInit,
		KeyboardEventInit: KeyboardEventInit,
		KeyboardEventInit$: KeyboardEventInit,
		CompositionEventInit: CompositionEventInit,
		CompositionEventInit$: CompositionEventInit,
		ProgressEventInit: ProgressEventInit,
		ProgressEventInit$: ProgressEventInit,
		XMLHttpRequestOptions: XMLHttpRequestOptions,
		XMLHttpRequestOptions$: XMLHttpRequestOptions,
		ScrollOptions: ScrollOptions,
		ScrollOptions$: ScrollOptions,
		TrackEventInit: TrackEventInit,
		TrackEventInit$: TrackEventInit,
		PopStateEventInit: PopStateEventInit,
		PopStateEventInit$: PopStateEventInit,
		HashChangeEventInit: HashChangeEventInit,
		HashChangeEventInit$: HashChangeEventInit,
		PageTransitionEventInit: PageTransitionEventInit,
		PageTransitionEventInit$: PageTransitionEventInit,
		ErrorEventInit: ErrorEventInit,
		ErrorEventInit$: ErrorEventInit,
		DragEventInit: DragEventInit,
		DragEventInit$: DragEventInit,
		CloseEventInit: CloseEventInit,
		CloseEventInit$: CloseEventInit,
		StorageEventInit: StorageEventInit,
		StorageEventInit$: StorageEventInit,
		MessageEventInit: MessageEventInit,
		MessageEventInit$: MessageEventInit,
		EventSourceInit: EventSourceInit,
		EventSourceInit$: EventSourceInit,
		IDBObjectStoreParameters: IDBObjectStoreParameters,
		IDBObjectStoreParameters$: IDBObjectStoreParameters,
		IDBIndexParameters: IDBIndexParameters,
		IDBIndexParameters$: IDBIndexParameters,
		IDBVersionChangeEventInit: IDBVersionChangeEventInit,
		IDBVersionChangeEventInit$: IDBVersionChangeEventInit,
		NotificationOptions: NotificationOptions,
		NotificationOptions$: NotificationOptions,
		RTCSessionDescriptionInit: RTCSessionDescriptionInit,
		RTCSessionDescriptionInit$: RTCSessionDescriptionInit,
		RTCIceCandidateInit: RTCIceCandidateInit,
		RTCIceCandidateInit$: RTCIceCandidateInit,
		RTCIceServer: RTCIceServer,
		RTCIceServer$: RTCIceServer,
		RTCConfiguration: RTCConfiguration,
		RTCConfiguration$: RTCConfiguration,
		DataChannelInit: DataChannelInit,
		DataChannelInit$: DataChannelInit,
		RTCPeerConnectionIceEventInit: RTCPeerConnectionIceEventInit,
		RTCPeerConnectionIceEventInit$: RTCPeerConnectionIceEventInit,
		MediaStreamEventInit: MediaStreamEventInit,
		MediaStreamEventInit$: MediaStreamEventInit,
		DataChannelEventInit: DataChannelEventInit,
		DataChannelEventInit$: DataChannelEventInit,
		MediaStreamConstraints: MediaStreamConstraints,
		MediaStreamConstraints$: MediaStreamConstraints,
		MediaTrackConstraints: MediaTrackConstraints,
		MediaTrackConstraints$: MediaTrackConstraints,
		HitRegionOptions: HitRegionOptions,
		HitRegionOptions$: HitRegionOptions,
		WebGLContextAttributes: WebGLContextAttributes,
		WebGLContextAttributes$: WebGLContextAttributes,
		WebGLContextEventInit: WebGLContextEventInit,
		WebGLContextEventInit$: WebGLContextEventInit,
		DeviceOrientationEventInit: DeviceOrientationEventInit,
		DeviceOrientationEventInit$: DeviceOrientationEventInit,
		DeviceMotionEventInit: DeviceMotionEventInit,
		DeviceMotionEventInit$: DeviceMotionEventInit
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
/**
 * call a function on load/DOMContentLoaded
 */
function $__jsx_onload (event) {
	window.removeEventListener("load", $__jsx_onload);
	document.removeEventListener("DOMContentLoaded", $__jsx_onload);
	JSX.runMain("box2d-sample.jsx", []);
}

window.addEventListener("load", $__jsx_onload);
document.addEventListener("DOMContentLoaded", $__jsx_onload);

})(JSX);
