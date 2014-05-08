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
function Spark(posX, posY, size, color) {
	var angle;
	var velocity;
	this.state = 0;
	this.posX = posX;
	this.posY = posY;
	this.size = size;
	this.color = color;
	angle = Math.random() * 6.283185307179586;
	velocity = Math.random() * 6.0;
	this.velX = Math.cos(angle) * velocity;
	this.velY = Math.sin(angle) * velocity;
};

$__jsx_extend([Spark], Object);
Spark.prototype._decay$ = function () {
	var size$0;
	this.velX *= 0.98;
	this.velY *= 0.98;
	size$0 = this.size *= 0.98;
	if (size$0 < 0.5 && this.state === 0) {
		this.color = Firework$randomColor$();
		this.size = 2.0;
		this.state++;
	}
};


function Spark$_decay$LSpark$($this) {
	var size$0;
	$this.velX *= 0.98;
	$this.velY *= 0.98;
	size$0 = $this.size *= 0.98;
	if (size$0 < 0.5 && $this.state === 0) {
		$this.color = Firework$randomColor$();
		$this.size = 2.0;
		$this.state++;
	}
};

Spark._decay$LSpark$ = Spark$_decay$LSpark$;

Spark.prototype._move$ = function () {
	this.posX += this.velX + (Math.random() - 0.5);
	this.posY += this.velY + (Math.random() - 0.5) + 2.0;
};


function Spark$_move$LSpark$($this) {
	$this.posX += $this.velX + (Math.random() - 0.5);
	$this.posY += $this.velY + (Math.random() - 0.5) + 2.0;
};

Spark._move$LSpark$ = Spark$_move$LSpark$;

Spark.prototype._render$LFireworkView$ = function (view) {
	view.cx.beginPath();
	view.cx.arc(this.posX, this.posY, this.size, 0, 6.283185307179586, true);
	view.cx.fillStyle = (Math.random() > 0.2 ? this.color : "white");
	view.cx.fill();
};


function Spark$_render$LSpark$LFireworkView$($this, view) {
	view.cx.beginPath();
	view.cx.arc($this.posX, $this.posY, $this.size, 0, 6.283185307179586, true);
	view.cx.fillStyle = (Math.random() > 0.2 ? $this.color : "white");
	view.cx.fill();
};

Spark._render$LSpark$LFireworkView$ = Spark$_render$LSpark$LFireworkView$;

Spark.prototype._isLiving$LFireworkView$ = function (view) {
	return (this.size <= 0.01 ? false : this.posX <= 0 ? false : this.posX >= view.width || this.posY >= view.height ? false : true);
};


function Spark$_isLiving$LSpark$LFireworkView$($this, view) {
	return ($this.size <= 0.01 ? false : $this.posX <= 0 ? false : $this.posX >= view.width || $this.posY >= view.height ? false : true);
};

Spark._isLiving$LSpark$LFireworkView$ = Spark$_isLiving$LSpark$LFireworkView$;

Spark.prototype.draw$LFireworkView$ = function (view) {
	Spark$_decay$LSpark$(this);
	this.posX += this.velX + (Math.random() - 0.5);
	this.posY += this.velY + (Math.random() - 0.5) + 2.0;
	Spark$_render$LSpark$LFireworkView$(this, view);
	return (this.size <= 0.01 ? false : this.posX <= 0 ? false : this.posX >= view.width || this.posY >= view.height ? false : true);
};


function Spark$draw$LSpark$LFireworkView$($this, view) {
	Spark$_decay$LSpark$($this);
	$this.posX += $this.velX + (Math.random() - 0.5);
	$this.posY += $this.velY + (Math.random() - 0.5) + 2.0;
	Spark$_render$LSpark$LFireworkView$($this, view);
	return ($this.size <= 0.01 ? false : $this.posX <= 0 ? false : $this.posX >= view.width || $this.posY >= view.height ? false : true);
};

Spark.draw$LSpark$LFireworkView$ = Spark$draw$LSpark$LFireworkView$;

function Firework(view, x, y) {
	var color;
	var i;
	this.sparks = [  ];
	this.view = view;
	color = "lime";
	for (i = 0; i < 360; ++ i) {
		this.sparks.push(new Spark(x, y, 2.0, color));
	}
};

$__jsx_extend([Firework], Object);
function Firework$randomColor$() {
	var blightness;
	var rgb;
	var i;
	blightness = 60;
	rgb = [  ];
	for (i = 0; i < 3; ++ i) {
		rgb[i] = (Math.min(Math.random() * 0xFF + blightness | 0, 255) | 0);
	}
	return "rgb(" + (rgb[0] + "") + "," + (rgb[1] + "") + "," + (rgb[2] + "") + ")";
};

Firework.randomColor$ = Firework$randomColor$;

Firework.prototype.update$ = function () {
	var i;
	var s;
	for (i = 0; i < this.sparks.length; ++ i) {
		s = this.sparks[i];
		if (! Spark$draw$LSpark$LFireworkView$(s, this.view)) {
			this.sparks.splice(i, 1);
		}
	}
	return this.sparks.length > 0;
};


function Firework$update$LFirework$($this) {
	var i;
	var s;
	for (i = 0; i < $this.sparks.length; ++ i) {
		s = $this.sparks[i];
		if (! Spark$draw$LSpark$LFireworkView$(s, $this.view)) {
			$this.sparks.splice(i, 1);
		}
	}
	return $this.sparks.length > 0;
};

Firework.update$LFirework$ = Firework$update$LFirework$;

function FireworkView(canvas) {
	var $this = this;
	var rect;
	this.fireworks = [  ];
	this.numSparks = 0;
	this.cx = canvas.getContext("2d");
	this.width = (canvas.width | 0);
	this.height = (canvas.height | 0);
	rect = canvas.getBoundingClientRect();
	this.left = (rect.left | 0);
	this.top = (rect.top | 0);
	canvas.addEventListener("mousedown", (function (e) {
		var me;
		me = e;
		FireworkView$explode$LFireworkView$II($this, (me.clientX | 0), (me.clientY | 0));
	}));
	canvas.addEventListener("touchstart", (function (e) {
		var te;
		te = e;
		FireworkView$explode$LFireworkView$II($this, (te.touches[0].pageX | 0), (te.touches[0].pageY | 0));
	}));
};

$__jsx_extend([FireworkView], Object);
FireworkView.prototype.explode$II = function (x, y) {
	this.fireworks.push(new Firework(this, x - this.left, y - this.top));
};


function FireworkView$explode$LFireworkView$II($this, x, y) {
	$this.fireworks.push(new Firework($this, x - $this.left, y - $this.top));
};

FireworkView.explode$LFireworkView$II = FireworkView$explode$LFireworkView$II;

FireworkView.prototype.update$ = function () {
	var i;
	var fw;
	var cx$0;
	if (this.fireworks.length === 0) {
		FireworkView$explode$LFireworkView$II(this, (this.width / 2 + this.left | 0), (this.height / 3 | 0));
	}
	this.numSparks = 0;
	for (i = 0; i < this.fireworks.length; ++ i) {
		fw = this.fireworks[i];
		if (Firework$update$LFirework$(fw)) {
			this.numSparks += fw.sparks.length;
		} else {
			this.fireworks.splice(i, 1);
		}
	}
	(cx$0 = this.cx).fillStyle = "rgba(0, 0, 0, 0.3)";
	cx$0.fillRect(0, 0, this.width, this.height);
};


function FireworkView$update$LFireworkView$($this) {
	var i;
	var fw;
	var cx$0;
	if ($this.fireworks.length === 0) {
		FireworkView$explode$LFireworkView$II($this, ($this.width / 2 + $this.left | 0), ($this.height / 3 | 0));
	}
	$this.numSparks = 0;
	for (i = 0; i < $this.fireworks.length; ++ i) {
		fw = $this.fireworks[i];
		if (Firework$update$LFirework$(fw)) {
			$this.numSparks += fw.sparks.length;
		} else {
			$this.fireworks.splice(i, 1);
		}
	}
	(cx$0 = $this.cx).fillStyle = "rgba(0, 0, 0, 0.3)";
	cx$0.fillRect(0, 0, $this.width, $this.height);
};

FireworkView.update$LFireworkView$ = FireworkView$update$LFireworkView$;

function FPSWatcher(elementId) {
	this.start = Date.now();
	this.frameCount = 0;
	this.elementId = elementId;
};

$__jsx_extend([FPSWatcher], Object);
FPSWatcher.prototype.update$I = function (numSparks) {
	var message;
	var id$0;
	++ this.frameCount;
	if (this.frameCount % 100 === 0) {
		message = "FPS: " + ((this.frameCount / (Date.now() - this.start) * 1000 | 0) + "") + " (sparks: " + (numSparks + "") + ")";
		(id$0 = this.elementId, dom.document.getElementById(id$0)).innerHTML = message;
	}
};


function FPSWatcher$update$LFPSWatcher$I($this, numSparks) {
	var message;
	var id$0;
	++ $this.frameCount;
	if ($this.frameCount % 100 === 0) {
		message = "FPS: " + (($this.frameCount / (Date.now() - $this.start) * 1000 | 0) + "") + " (sparks: " + (numSparks + "") + ")";
		(id$0 = $this.elementId, dom.document.getElementById(id$0)).innerHTML = message;
	}
};

FPSWatcher.update$LFPSWatcher$I = FPSWatcher$update$LFPSWatcher$I;

function _Main() {
};

$__jsx_extend([_Main], Object);
function _Main$main$AS(args) {
	var canvas;
	var view;
	var watcher;
	var value1$0;
	var value2$0;
	var value1$2;
	var value2$2;
	canvas = dom.document.getElementById("night-sky");
	value1$0 = canvas.width;
	value2$0 = dom.window.innerWidth;
	canvas.width = (value1$0 <= value2$0 ? value1$0 : value2$0);
	value1$2 = canvas.height;
	value2$2 = dom.window.innerHeight;
	canvas.height = (value1$2 <= value2$2 ? value1$2 : value2$2);
	view = new FireworkView(canvas);
	watcher = new FPSWatcher("fps");
	dom.window.setInterval((function () {
		FireworkView$update$LFireworkView$(view);
		FPSWatcher$update$LFPSWatcher$I(watcher, (view.numSparks | 0));
	}), 0);
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
Config.quantity = 360;
Config.size = 2.0;
Config.decay = 0.98;
Config.gravity = 2.0;
Config.speed = 6.0;
Config.canvasId = "night-sky";
Config.fpsElementId = "fps";
Spark.rad = 6.283185307179586;
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
	"fireworks.jsx": {
		Config: Config,
		Config$: Config,
		Spark: Spark,
		Spark$NNNS: Spark,
		Firework: Firework,
		Firework$LFireworkView$II: Firework,
		FireworkView: FireworkView,
		FireworkView$LHTMLCanvasElement$: FireworkView,
		FPSWatcher: FPSWatcher,
		FPSWatcher$S: FPSWatcher,
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
	JSX.runMain("fireworks.jsx", []);
}

window.addEventListener("load", $__jsx_onload);
document.addEventListener("DOMContentLoaded", $__jsx_onload);

})(JSX);
