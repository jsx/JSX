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
function Config() {
};

$__jsx_extend([Config], Object);
function Sprite() {
};

$__jsx_extend([Sprite], Object);
Sprite.prototype.$__jsx_implements_Sprite = true;

Sprite.prototype.detectCollision$LSprite$ = function (other) {
	var x$0;
	var x$1;
	return (x$0 = this.x - other.x, x$0 >= 0 ? x$0 : - x$0) < 16 && (x$1 = this.y - other.y, x$1 >= 0 ? x$1 : - x$1) < 16;
};


Sprite.prototype.draw$LCanvasRenderingContext2D$ = function (context) {
	context.drawImage(this.image, this.x - (this.width >> 1), this.y - (this.height >> 1));
};


function MovingObject(x, y, dx, dy, image) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.image = image;
};

$__jsx_extend([MovingObject], Object);
$__jsx_merge_interface(MovingObject, Sprite);

MovingObject.prototype.update$ = function () {
	var x$0;
	var y$0;
	x$0 = this.x += this.dx;
	y$0 = this.y += this.dy;
	return ! (x$0 <= 0 || x$0 >= 320 || y$0 <= 0 || y$0 >= 480);
};


function MovingObject$update$LMovingObject$($this) {
	var x$0;
	var y$0;
	x$0 = $this.x += $this.dx;
	y$0 = $this.y += $this.dy;
	return ! (x$0 <= 0 || x$0 >= 320 || y$0 <= 0 || y$0 >= 480);
};

MovingObject.update$LMovingObject$ = MovingObject$update$LMovingObject$;

MovingObject.prototype._inDisplay$ = function () {
	var x$0;
	var y$0;
	return ! ((x$0 = this.x) <= 0 || x$0 >= 320 || (y$0 = this.y) <= 0 || y$0 >= 480);
};


function MovingObject$_inDisplay$LMovingObject$($this) {
	var x$0;
	var y$0;
	return ! ((x$0 = $this.x) <= 0 || x$0 >= 320 || (y$0 = $this.y) <= 0 || y$0 >= 480);
};

MovingObject._inDisplay$LMovingObject$ = MovingObject$_inDisplay$LMovingObject$;

function Bullet(x, y, dx, dy, image) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.image = image;
	this.width = 4;
	this.height = 4;
};

$__jsx_extend([Bullet], MovingObject);
Bullet.prototype.update$LStage$ = function (st) {
	var inDisplay;
	var rockKey;
	var rock;
	var newState;
	var context$0;
	var value1$0;
	inDisplay = MovingObject$update$LMovingObject$(this);
	context$0 = st.ctx;
	context$0.drawImage(this.image, this.x - (this.width >> 1), this.y - (this.height >> 1));
	for (rockKey in st.rocks) {
		rock = st.rocks[rockKey];
		if (this.detectCollision$LSprite$(rock)) {
			if (rock.hp === 0) {
				return false;
			}
			inDisplay = false;
			if (-- rock.hp === 0) {
				value1$0 = st.score + rock.score;
				st.score = (value1$0 <= 999999999 ? value1$0 : 999999999);
				Stage$updateScore$LStage$(st);
				rock.dx = rock.dy = 0;
				rock.state = "bomb1";
				rock.image = st.images.bomb1;
			} else {
				newState = (rock.state + "w").substring(0, 6);
				rock.state = newState;
				rock.image = st.images[newState];
			}
		}
	}
	return inDisplay;
};


function Bullet$update$LBullet$LStage$($this, st) {
	var inDisplay;
	var rockKey;
	var rock;
	var newState;
	var context$0;
	var value1$0;
	inDisplay = MovingObject$update$LMovingObject$($this);
	context$0 = st.ctx;
	context$0.drawImage($this.image, $this.x - ($this.width >> 1), $this.y - ($this.height >> 1));
	for (rockKey in st.rocks) {
		rock = st.rocks[rockKey];
		if ($this.detectCollision$LSprite$(rock)) {
			if (rock.hp === 0) {
				return false;
			}
			inDisplay = false;
			if (-- rock.hp === 0) {
				value1$0 = st.score + rock.score;
				st.score = (value1$0 <= 999999999 ? value1$0 : 999999999);
				Stage$updateScore$LStage$(st);
				rock.dx = rock.dy = 0;
				rock.state = "bomb1";
				rock.image = st.images.bomb1;
			} else {
				newState = (rock.state + "w").substring(0, 6);
				rock.state = newState;
				rock.image = st.images[newState];
			}
		}
	}
	return inDisplay;
};

Bullet.update$LBullet$LStage$ = Bullet$update$LBullet$LStage$;

function Rock(x, y, dx, dy, hp, score, state, image) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.image = image;
	this.width = 32;
	this.height = 32;
	this.hp = hp;
	this.score = score;
	this.state = state;
};

$__jsx_extend([Rock], MovingObject);
Rock.prototype.update$LStage$ = function (st) {
	var inDisplay;
	var next;
	var context$0;
	var state$0;
	var state$2;
	inDisplay = MovingObject$update$LMovingObject$(this);
	context$0 = st.ctx;
	context$0.drawImage(this.image, this.x - (this.width >> 1), this.y - (this.height >> 1));
	if (this.hp === 0) {
		next = (this.state.substring(4) | 0) + 1;
		if (next > 10) {
			return false;
		} else {
			state$0 = "bomb" + (next + "");
			this.state = state$0;
			this.image = st.images[state$0];
		}
	} else {
		state$2 = this.state.substring(0, 5);
		this.state = state$2;
		this.image = st.images[state$2];
		if (st.state === "gaming" && this.detectCollision$LSprite$(st.ship)) {
			st.state = "dying";
			st.dying = 1;
		}
	}
	return inDisplay;
};


function Rock$update$LRock$LStage$($this, st) {
	var inDisplay;
	var next;
	var context$0;
	var state$0;
	var state$2;
	inDisplay = MovingObject$update$LMovingObject$($this);
	context$0 = st.ctx;
	context$0.drawImage($this.image, $this.x - ($this.width >> 1), $this.y - ($this.height >> 1));
	if ($this.hp === 0) {
		next = ($this.state.substring(4) | 0) + 1;
		if (next > 10) {
			return false;
		} else {
			state$0 = "bomb" + (next + "");
			$this.state = state$0;
			$this.image = st.images[state$0];
		}
	} else {
		state$2 = $this.state.substring(0, 5);
		$this.state = state$2;
		$this.image = st.images[state$2];
		if (st.state === "gaming" && $this.detectCollision$LSprite$(st.ship)) {
			st.state = "dying";
			st.dying = 1;
		}
	}
	return inDisplay;
};

Rock.update$LRock$LStage$ = Rock$update$LRock$LStage$;

Rock.prototype.setState$LStage$S = function (stage, state) {
	this.state = state;
	this.image = stage.images[state];
};


function Rock$setState$LRock$LStage$S($this, stage, state) {
	$this.state = state;
	$this.image = stage.images[state];
};

Rock.setState$LRock$LStage$S = Rock$setState$LRock$LStage$S;

function SpaceShip(x, y, image) {
	this.width = 32;
	this.height = 32;
	this.x = x;
	this.y = y;
	this.image = image;
};

$__jsx_extend([SpaceShip], Object);
$__jsx_merge_interface(SpaceShip, Sprite);

function Stage(stageCanvas, scoreboard) {
	var $this = this;
	var bg;
	var i;
	var loadedCount;
	var checkLoad;
	var name;
	var image;
	var touchStart;
	var body;
	var touchMove;
	this.imageName = null;
	this.images = null;
	this.state = "loading";
	this.ship = null;
	this.dying = 0;
	this.lastX = -1;
	this.lastY = -1;
	this.frameCount = 0;
	this.currentTop = 0;
	this.ctx = null;
	this.bgCtx = null;
	this.bullets = null;
	this.rocks = null;
	this.numRocks = 0;
	this.score = 0;
	this.scoreElement = null;
	this.start = Date.now();
	this.fps = 0;
	this.state = "loading";
	this.imageName = [ "my", "bullet", "rock1", "rock2", "rock3" ];
	this.images = ({  });
	scoreboard.style.width = "320px";
	this.scoreElement = scoreboard;
	stageCanvas.width = 320;
	stageCanvas.height = 480;
	this.ctx = stageCanvas.getContext("2d");
	bg = dom.document.createElement("canvas");
	bg.width = 320;
	bg.height = 512;
	this.bgCtx = bg.getContext("2d");
	for (i = 0; i < 10; ++ i) {
		this.imageName.push("space" + (i + 1 + ""));
		this.imageName.push("bomb" + (i + 1 + ""));
	}
	loadedCount = 0;
	checkLoad = (function (e) {
		var image;
		var canvas;
		var cx;
		image = e.target;
		canvas = dom.document.createElement("canvas");
		cx = canvas.getContext("2d");
		cx.drawImage(image, 0, 0);
		$this.images[image.name] = canvas;
		if (++ loadedCount === $this.imageName.length) {
			Stage$initialize$LStage$($this);
		}
	});
	for (i = 0; i < this.imageName.length; ++ i) {
		name = this.imageName[i];
		image = dom.document.createElement("img");
		image.addEventListener("load", checkLoad);
		image.src = "img/" + name + ".png";
		image.name = name;
	}
	touchStart = (function (e) {
		var p;
		e.preventDefault();
		p = Stage$getPoint$LStage$LEvent$($this, e);
		$this.lastX = p[0];
		$this.lastY = p[1];
		if ($this.state === "gameover") {
			Stage$initialize$LStage$($this);
		}
	});
	body = dom.window.document.body;
	body.addEventListener("mousedown", touchStart);
	body.addEventListener("touchstart", touchStart);
	touchMove = (function (e) {
		var p;
		var ship;
		var value1$4;
		var x$0;
		var x$1;
		var y$0;
		e.preventDefault();
		p = Stage$getPoint$LStage$LEvent$($this, e);
		if ($this.state === "gaming" && $this.lastX !== -1) {
			ship = $this.ship;
			x$0 = ship.x += (p[0] - $this.lastX) * 2.5 | 0;
			ship.y += (p[1] - $this.lastY) * 3.0 | 0;
			x$1 = ship.x = (x$0 >= 0 ? x$0 : 0);
			ship.x = (x$1 <= 320 ? x$1 : 320);
			value1$4 = ship.y;
			y$0 = ship.y = (value1$4 >= 0 ? value1$4 : 0);
			ship.y = (y$0 <= 480 ? y$0 : 480);
		}
		$this.lastX = p[0];
		$this.lastY = p[1];
	});
	body.addEventListener("mousemove", touchMove);
	body.addEventListener("touchmove", touchMove);
};

$__jsx_extend([Stage], Object);
Stage.prototype.changeStateToBeLoading$ = function () {
	this.state = "loading";
};


function Stage$changeStateToBeLoading$LStage$($this) {
	$this.state = "loading";
};

Stage.changeStateToBeLoading$LStage$ = Stage$changeStateToBeLoading$LStage$;

Stage.prototype.isLoading$ = function () {
	return this.state === "loading";
};


function Stage$isLoading$LStage$($this) {
	return $this.state === "loading";
};

Stage.isLoading$LStage$ = Stage$isLoading$LStage$;

Stage.prototype.changeStateToBeGaming$ = function () {
	this.state = "gaming";
};


function Stage$changeStateToBeGaming$LStage$($this) {
	$this.state = "gaming";
};

Stage.changeStateToBeGaming$LStage$ = Stage$changeStateToBeGaming$LStage$;

Stage.prototype.isGaming$ = function () {
	return this.state === "gaming";
};


function Stage$isGaming$LStage$($this) {
	return $this.state === "gaming";
};

Stage.isGaming$LStage$ = Stage$isGaming$LStage$;

Stage.prototype.changeStateToBeDying$ = function () {
	this.state = "dying";
};


function Stage$changeStateToBeDying$LStage$($this) {
	$this.state = "dying";
};

Stage.changeStateToBeDying$LStage$ = Stage$changeStateToBeDying$LStage$;

Stage.prototype.isDying$ = function () {
	return this.state === "dying";
};


function Stage$isDying$LStage$($this) {
	return $this.state === "dying";
};

Stage.isDying$LStage$ = Stage$isDying$LStage$;

Stage.prototype.changeStateToBeGameOver$ = function () {
	this.state = "gameover";
};


function Stage$changeStateToBeGameOver$LStage$($this) {
	$this.state = "gameover";
};

Stage.changeStateToBeGameOver$LStage$ = Stage$changeStateToBeGameOver$LStage$;

Stage.prototype.isGameOver$ = function () {
	return this.state === "gameover";
};


function Stage$isGameOver$LStage$($this) {
	return $this.state === "gameover";
};

Stage.isGameOver$LStage$ = Stage$isGameOver$LStage$;

Stage.prototype.level$ = function () {
	return (this.frameCount / 500 | 0);
};


function Stage$level$LStage$($this) {
	return ($this.frameCount / 500 | 0);
};

Stage.level$LStage$ = Stage$level$LStage$;

Stage.prototype.drawBackground$ = function () {
	var bottom;
	var x$0;
	bottom = 512 - this.currentTop;
	if (bottom > 0) {
		this.ctx.drawImage(this.bgCtx.canvas, 0, this.currentTop, 320, bottom, 0, 0, 320, bottom);
	}
	if ((x$0 = 480 - bottom, x$0 >= 0 ? x$0 : - x$0) > 0) {
		this.ctx.drawImage(this.bgCtx.canvas, 0, bottom);
	}
};


function Stage$drawBackground$LStage$($this) {
	var bottom;
	var x$0;
	bottom = 512 - $this.currentTop;
	if (bottom > 0) {
		$this.ctx.drawImage($this.bgCtx.canvas, 0, $this.currentTop, 320, bottom, 0, 0, 320, bottom);
	}
	if ((x$0 = 480 - bottom, x$0 >= 0 ? x$0 : - x$0) > 0) {
		$this.ctx.drawImage($this.bgCtx.canvas, 0, bottom);
	}
};

Stage.drawBackground$LStage$ = Stage$drawBackground$LStage$;

Stage.prototype.draw$ = function () {
	var ship;
	var context$0;
	var context$2;
	var image$0;
	Stage$drawBackground$LStage$(this);
	ship = this.ship;
	if (this.state === "gaming") {
		context$0 = this.ctx;
		context$0.drawImage(ship.image, ship.x - (ship.width >> 1), ship.y - (ship.height >> 1));
	} else if (this.state === "dying") {
		image$0 = ship.image = this.images["bomb" + (this.dying + "")];
		context$2 = this.ctx;
		context$2.drawImage(image$0, ship.x - (ship.width >> 1), ship.y - (ship.height >> 1));
		if (++ this.dying > 10) {
			Stage$initialize$LStage$(this);
		}
	}
};


function Stage$draw$LStage$($this) {
	var ship;
	var context$0;
	var context$2;
	var image$0;
	Stage$drawBackground$LStage$($this);
	ship = $this.ship;
	if ($this.state === "gaming") {
		context$0 = $this.ctx;
		context$0.drawImage(ship.image, ship.x - (ship.width >> 1), ship.y - (ship.height >> 1));
	} else if ($this.state === "dying") {
		image$0 = ship.image = $this.images["bomb" + ($this.dying + "")];
		context$2 = $this.ctx;
		context$2.drawImage(image$0, ship.x - (ship.width >> 1), ship.y - (ship.height >> 1));
		if (++ $this.dying > 10) {
			Stage$initialize$LStage$($this);
		}
	}
};

Stage.draw$LStage$ = Stage$draw$LStage$;

Stage.prototype.drawSpace$NN = function (px, py) {
	var spaceType;
	var image;
	spaceType = (Math.random() * 10 + 1 | 0) + "";
	image = this.images["space" + spaceType];
	this.bgCtx.drawImage(image, px * 32, py * 32);
};


function Stage$drawSpace$LStage$NN($this, px, py) {
	var spaceType;
	var image;
	spaceType = (Math.random() * 10 + 1 | 0) + "";
	image = $this.images["space" + spaceType];
	$this.bgCtx.drawImage(image, px * 32, py * 32);
};

Stage.drawSpace$LStage$NN = Stage$drawSpace$LStage$NN;

Stage.prototype.createBullet$NN = function (dx, dy) {
	var ship$0;
	return new Bullet((ship$0 = this.ship).x, ship$0.y, dx * 20, dy * 20, this.images.bullet);
};


function Stage$createBullet$LStage$NN($this, dx, dy) {
	var ship$0;
	return new Bullet((ship$0 = $this.ship).x, ship$0.y, dx * 20, dy * 20, $this.images.bullet);
};

Stage.createBullet$LStage$NN = Stage$createBullet$LStage$NN;

Stage.prototype.createRock$ = function () {
	var level;
	var px;
	var py;
	var fx;
	var fy;
	var r;
	var d;
	var hp;
	var rockId;
	var value1$0;
	level = this.frameCount / 500;
	px = this.ship.x + Math.random() * 100 - 50;
	py = this.ship.y + Math.random() * 100 - 50;
	fx = Math.random() * 320;
	fy = (level >= 4 ? Math.random() * 2 * 480 : 0);
	r = Math.atan2(py - fy, px - fx);
	value1$0 = Math.random() * (5.5 + level) + 1.5;
	d = (value1$0 >= 10 ? value1$0 : 10);
	hp = Math.random() * Math.random() * (5 + level / 4 | 0) | 1;
	rockId = (Math.random() * 3 + 1 | 0) + "";
	return new Rock(fx, fy, Math.cos(r) * d, Math.sin(r) * d, hp, hp * hp * 100, "rock" + rockId, this.images["rock" + rockId]);
};


function Stage$createRock$LStage$($this) {
	var level;
	var px;
	var py;
	var fx;
	var fy;
	var r;
	var d;
	var hp;
	var rockId;
	var value1$0;
	level = $this.frameCount / 500;
	px = $this.ship.x + Math.random() * 100 - 50;
	py = $this.ship.y + Math.random() * 100 - 50;
	fx = Math.random() * 320;
	fy = (level >= 4 ? Math.random() * 2 * 480 : 0);
	r = Math.atan2(py - fy, px - fx);
	value1$0 = Math.random() * (5.5 + level) + 1.5;
	d = (value1$0 >= 10 ? value1$0 : 10);
	hp = Math.random() * Math.random() * (5 + level / 4 | 0) | 1;
	rockId = (Math.random() * 3 + 1 | 0) + "";
	return new Rock(fx, fy, Math.cos(r) * d, Math.sin(r) * d, hp, hp * hp * 100, "rock" + rockId, $this.images["rock" + rockId]);
};

Stage.createRock$LStage$ = Stage$createRock$LStage$;

Stage.prototype.tick$ = function () {
	var $this = this;
	var line;
	var px;
	var fc;
	var bulletKey;
	var rockKey;
	var frameCount$0;
	++ this.frameCount;
	dom.window.setTimeout((function () {
		Stage$tick$LStage$($this);
	}), 33);
	if (this.frameCount % 30 === 0) {
		this.fps = this.frameCount / (Date.now() - this.start) * 1000 | 0;
		Stage$updateScore$LStage$(this);
	}
	if (this.state === "loading") {
		return;
	}
	if (-- this.currentTop === 0) {
		this.currentTop = 512;
	}
	if (this.currentTop % 32 === 0) {
		line = this.currentTop / 32 - 1;
		for (px = 0; px < 10; ++ px) {
			Stage$drawSpace$LStage$NN(this, px, line);
		}
	}
	Stage$draw$LStage$(this);
	fc = (frameCount$0 = this.frameCount) + "";
	if (this.state === "gaming" && frameCount$0 % 3 === 0) {
		this.bullets[fc + "a"] = new Bullet(this.ship.x, this.ship.y, -20, -20, this.images.bullet);
		this.bullets[fc + "b"] = new Bullet(this.ship.x, this.ship.y, 0, -20, this.images.bullet);
		this.bullets[fc + "c"] = new Bullet(this.ship.x, this.ship.y, 20, -20, this.images.bullet);
		this.bullets[fc + "d"] = new Bullet(this.ship.x, this.ship.y, -20, 20, this.images.bullet);
		this.bullets[fc + "e"] = new Bullet(this.ship.x, this.ship.y, 20, 20, this.images.bullet);
	}
	if (this.numRocks < 5 + this.frameCount / 500) {
		this.rocks[fc + "r"] = Stage$createRock$LStage$(this);
		++ this.numRocks;
	}
	for (bulletKey in this.bullets) {
		if (! Bullet$update$LBullet$LStage$(this.bullets[bulletKey], this)) {
			delete this.bullets[bulletKey];
		}
	}
	for (rockKey in this.rocks) {
		if (! Rock$update$LRock$LStage$(this.rocks[rockKey], this)) {
			delete this.rocks[rockKey];
			-- this.numRocks;
		}
	}
};


function Stage$tick$LStage$($this) {
	var line;
	var px;
	var fc;
	var bulletKey;
	var rockKey;
	var frameCount$0;
	++ $this.frameCount;
	dom.window.setTimeout((function () {
		Stage$tick$LStage$($this);
	}), 33);
	if ($this.frameCount % 30 === 0) {
		$this.fps = $this.frameCount / (Date.now() - $this.start) * 1000 | 0;
		Stage$updateScore$LStage$($this);
	}
	if ($this.state === "loading") {
		return;
	}
	if (-- $this.currentTop === 0) {
		$this.currentTop = 512;
	}
	if ($this.currentTop % 32 === 0) {
		line = $this.currentTop / 32 - 1;
		for (px = 0; px < 10; ++ px) {
			Stage$drawSpace$LStage$NN($this, px, line);
		}
	}
	Stage$draw$LStage$($this);
	fc = (frameCount$0 = $this.frameCount) + "";
	if ($this.state === "gaming" && frameCount$0 % 3 === 0) {
		$this.bullets[fc + "a"] = new Bullet($this.ship.x, $this.ship.y, -20, -20, $this.images.bullet);
		$this.bullets[fc + "b"] = new Bullet($this.ship.x, $this.ship.y, 0, -20, $this.images.bullet);
		$this.bullets[fc + "c"] = new Bullet($this.ship.x, $this.ship.y, 20, -20, $this.images.bullet);
		$this.bullets[fc + "d"] = new Bullet($this.ship.x, $this.ship.y, -20, 20, $this.images.bullet);
		$this.bullets[fc + "e"] = new Bullet($this.ship.x, $this.ship.y, 20, 20, $this.images.bullet);
	}
	if ($this.numRocks < 5 + $this.frameCount / 500) {
		$this.rocks[fc + "r"] = Stage$createRock$LStage$($this);
		++ $this.numRocks;
	}
	for (bulletKey in $this.bullets) {
		if (! Bullet$update$LBullet$LStage$($this.bullets[bulletKey], $this)) {
			delete $this.bullets[bulletKey];
		}
	}
	for (rockKey in $this.rocks) {
		if (! Rock$update$LRock$LStage$($this.rocks[rockKey], $this)) {
			delete $this.rocks[rockKey];
			-- $this.numRocks;
		}
	}
};

Stage.tick$LStage$ = Stage$tick$LStage$;

Stage.prototype.initialize$ = function () {
	var $this = this;
	var px;
	var py;
	var i;
	var canvas;
	var rctx;
	var k;
	for (px = 0; px < 10; ++ px) {
		for (py = 0; py < 16; ++ py) {
			Stage$drawSpace$LStage$NN(this, px, py);
		}
	}
	for (i = 0; i < 3; ++ i) {
		canvas = dom.document.createElement("canvas");
		canvas.width = 32;
		canvas.height = 32;
		rctx = canvas.getContext("2d");
		k = "rock" + (i + 1 + "");
		rctx.drawImage(this.images[k], 0, 0);
		rctx.globalCompositeOperation = "source-in";
		rctx.fillStyle = "#fff";
		rctx.fillRect(0, 0, canvas.width, canvas.height);
		this.images[k + "w"] = canvas;
	}
	this.currentTop = 512;
	this.ship = new SpaceShip(80, 360, this.images.my);
	this.score = 0;
	this.bullets = ({  });
	this.rocks = ({  });
	this.numRocks = 0;
	this.state = "gaming";
	dom.window.setTimeout((function () {
		dom.window.scrollTo(0, 0);
	}), 250);
};


function Stage$initialize$LStage$($this) {
	var px;
	var py;
	var i;
	var canvas;
	var rctx;
	var k;
	for (px = 0; px < 10; ++ px) {
		for (py = 0; py < 16; ++ py) {
			Stage$drawSpace$LStage$NN($this, px, py);
		}
	}
	for (i = 0; i < 3; ++ i) {
		canvas = dom.document.createElement("canvas");
		canvas.width = 32;
		canvas.height = 32;
		rctx = canvas.getContext("2d");
		k = "rock" + (i + 1 + "");
		rctx.drawImage($this.images[k], 0, 0);
		rctx.globalCompositeOperation = "source-in";
		rctx.fillStyle = "#fff";
		rctx.fillRect(0, 0, canvas.width, canvas.height);
		$this.images[k + "w"] = canvas;
	}
	$this.currentTop = 512;
	$this.ship = new SpaceShip(80, 360, $this.images.my);
	$this.score = 0;
	$this.bullets = ({  });
	$this.rocks = ({  });
	$this.numRocks = 0;
	$this.state = "gaming";
	dom.window.setTimeout((function () {
		dom.window.scrollTo(0, 0);
	}), 250);
};

Stage.initialize$LStage$ = Stage$initialize$LStage$;

Stage.prototype.getPoint$LEvent$ = function (e) {
	var px;
	var py;
	var me;
	var te;
	px = 0;
	py = 0;
	if (e instanceof MouseEvent) {
		me = e;
		px = me.clientX;
		py = me.clientY;
	} else if (e instanceof TouchEvent) {
		te = e;
		px = te.touches[0].pageX;
		py = te.touches[0].pageY;
	}
	return [ px, py ];
};


function Stage$getPoint$LStage$LEvent$($this, e) {
	var px;
	var py;
	var me;
	var te;
	px = 0;
	py = 0;
	if (e instanceof MouseEvent) {
		me = e;
		px = me.clientX;
		py = me.clientY;
	} else if (e instanceof TouchEvent) {
		te = e;
		px = te.touches[0].pageX;
		py = te.touches[0].pageY;
	}
	return [ px, py ];
};

Stage.getPoint$LStage$LEvent$ = Stage$getPoint$LStage$LEvent$;

Stage.prototype.watchFPS$ = function () {
	if (this.frameCount % 30 === 0) {
		this.fps = this.frameCount / (Date.now() - this.start) * 1000 | 0;
		Stage$updateScore$LStage$(this);
	}
};


function Stage$watchFPS$LStage$($this) {
	if ($this.frameCount % 30 === 0) {
		$this.fps = $this.frameCount / (Date.now() - $this.start) * 1000 | 0;
		Stage$updateScore$LStage$($this);
	}
};

Stage.watchFPS$LStage$ = Stage$watchFPS$LStage$;

Stage.prototype.updateScore$ = function () {
	var scoreStr;
	var fillz;
	scoreStr = this.score + "";
	fillz = "000000000".substring(0, 9 - scoreStr.length);
	this.scoreElement.innerHTML = fillz + scoreStr + "<br/>\n" + (this.fps + "") + " FPS";
};


function Stage$updateScore$LStage$($this) {
	var scoreStr;
	var fillz;
	scoreStr = $this.score + "";
	fillz = "000000000".substring(0, 9 - scoreStr.length);
	$this.scoreElement.innerHTML = fillz + scoreStr + "<br/>\n" + ($this.fps + "") + " FPS";
};

Stage.updateScore$LStage$ = Stage$updateScore$LStage$;

function _Main() {
};

$__jsx_extend([_Main], Object);
function _Main$main$AS(args) {
	var stageCanvas;
	var scoreboard;
	var stage;
	stageCanvas = dom.document.getElementById("stage");
	scoreboard = dom.document.getElementById("scoreboard");
	stage = new Stage(stageCanvas, scoreboard);
	Stage$tick$LStage$(stage);
};

_Main.main = _Main$main$AS;
_Main.main$AS = _Main$main$AS;

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
Config.cols = 10;
Config.rows = 15;
Config.cellWidth = 32;
Config.cellHeight = 32;
Config.bulletWidth = 4;
Config.bulletHeight = 4;
Config.bulletSpeed = 20;
Config.reloadCount = 3;
Config.initialNumRocks = 5;
Config.FPS = 30;
Config.width = 320;
Config.height = 480;
Config.imagePath = "img";
Config.canvasId = "stage";
Config.scoreboardId = "scoreboard";
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
	"shooting.jsx": {
		Config: Config,
		Config$: Config,
		Sprite: Sprite,
		Sprite$: Sprite,
		MovingObject: MovingObject,
		MovingObject$NNNNLHTMLCanvasElement$: MovingObject,
		Bullet: Bullet,
		Bullet$NNNNLHTMLCanvasElement$: Bullet,
		Rock: Rock,
		Rock$NNNNNNSLHTMLCanvasElement$: Rock,
		SpaceShip: SpaceShip,
		SpaceShip$NNLHTMLCanvasElement$: SpaceShip,
		Stage: Stage,
		Stage$LHTMLCanvasElement$LHTMLElement$: Stage,
		_Main: _Main,
		_Main$: _Main
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
	JSX.runMain("shooting.jsx", []);
}

window.addEventListener("load", $__jsx_onload);
document.addEventListener("DOMContentLoaded", $__jsx_onload);

})(JSX);
