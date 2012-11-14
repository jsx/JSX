(function (exports) {
"use strict";

var Config = {
	quantity : 360,
	size     : 2.0,
	decay    : 0.98,
	gravity  : 2.0,
	speed    : 6.0
};

var Class = function () {
};

Class.extend = function (properties) {
	var ctor = properties.constructor;
	if (ctor === Object) {
		var superCtor = this.prototype.constructor;
		ctor = properties.constructor = function () {
			superCtor.call(this);
		};
	}
	function tmp() {}
	tmp.prototype = this.prototype;
	ctor.prototype = new tmp();
	ctor.extend = Class.extend;
	// assign properties
	for (var k in properties) {
		if (k.charAt(0) == '$') {
			ctor[k.substring(1)] = properties[k];
		} else {
			ctor.prototype[k] = properties[k];
		}
	}
	if (typeof ctor.constructor === "function") {
		ctor.constructor();
	}
	return ctor;
};

Class.prototype.constructor = function () {
};

var Spark = Class.extend({
	$rad: Math.PI * 2,

	constructor: function (posX, posY, size, color) {
		this.state = 0;

		this.posX = posX;
		this.posY = posY;
		this.size = size;
		this.color = color;

		var angle    = Math.random() * Spark.rad;
		var velocity = Math.random() * Config.speed;

		this.velX = Math.cos(angle) * velocity;
		this.velY = Math.sin(angle) * velocity;
	},

	_decay: function () {
		this.velX *= Config.decay;
		this.velY *= Config.decay;
		this.size *= Config.decay;

		if(this.size < 0.5 && this.state == 0) {
			this.color = Firework.randomColor();
			this.size = Config.size;
			this.state++;
		}
	},

	_move: function () {
		this.posX += this.velX + (Math.random() - 0.5);
		this.posY += this.velY + (Math.random() - 0.5) + Config.gravity;
	},

	_render: function (view) {
		view.cx.beginPath();
		view.cx.arc(this.posX, this.posY, this.size, 0, Spark.rad, true);
		view.cx.fillStyle = Math.random() > 0.2 ? this.color : "white";
		view.cx.fill();
	},

	_isLiving: function (view) {
		if(this.size <= 0.01) return false;
		if(this.posX <= 0) return false;
		if(this.posX >= view.width || this.posY >= view.height) return false;
		return true;
	},

	draw: function (view) {
		this._decay();
		this._move();
		this._render(view);

		return this._isLiving(view);
	},
});

var Firework = Class.extend({
	$randomColor: function () {
		var blightness = 60;

		var rgb = [];
		for (var i = 0; i < 3; ++i) {
			rgb[i] = Math.min( (Math.random() * 0xFF + blightness) | 0, 255 );
		}
		return "rgb(" +
			rgb[0] + "," +
			rgb[1] + "," +
			rgb[2] + ")";
	},

	constructor: function (view, x, y ) {
		this.sparks = [];

		this.view = view;

		var color = "lime";
		for (var i = 0; i < Config.quantity; ++i) {
			this.sparks.push(new Spark(x, y, Config.size, color));
		}
	},

	update: function() {
		for(var i = 0; i < this.sparks.length; ++i) {
			var s = this.sparks[i];
			if (! s.draw(this.view)) {
				this.sparks.splice(i, 1);
			}
		}
		return this.sparks.length > 0;
	}
});

var FireworkView = Class.extend({
	constructor: function (canvas) {
		this.fireworks = [];
		this.numSparks = 0;

		this.cx = canvas.getContext("2d");

		this.width  = canvas.width;
		this.height = canvas.height;

		var rect = canvas.getBoundingClientRect();
		this.left = rect.left;
		this.top  = rect.top;

		var $this = this;
		canvas.addEventListener("mousedown", function (e) {
			$this.explode(e.clientX, e.clientY);
		});
		canvas.addEventListener("touchstart", function (e) {
			$this.explode(e.touches[0].pageX, e.touches[0].pageY);
		});
	},

	explode: function (x, y) {
		this.fireworks.push(new Firework(this, x - this.left, y - this.top));
	},

	update: function () {
		if (this.fireworks.length == 0) {
			// first one
			this.explode(this.width / 2 + this.left, this.height / 3);
		}

		this.numSparks = 0;

		for (var i = 0; i < this.fireworks.length; ++i) {
			var fw = this.fireworks[i];

			if(fw.update()) {
				this.numSparks += fw.sparks.length;
			}
			else {
				this.fireworks.splice(i, 1);
			}
		}

		this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
		this.cx.fillRect(0, 0, this.width, this.height);
	},

});

var FPSWatcher = Class.extend({
	constructor: function (elementId) {
		this.start = Date.now();
		this.frameCount = 0;

		this.elementId = elementId;
	},

	update: function(numSparks) {
		++this.frameCount;

		if(this.frameCount % 100 == 0) {
			var message = "FPS: " + ((this.frameCount / (Date.now() - this.start) * 1000) | 0) +
				" (sparks: " + numSparks + ")";
			document.getElementById(this.elementId).innerHTML = message;
		}
	}
});

exports.FireworkApplication = Class.extend({
	$main: function (canvasId, fpsId, quantity) {
		Config.quantity = quantity;

		var canvas = document.getElementById(canvasId);
		if(!canvas) {
			throw new Error("No such element: " + canvasId);
		}

		var view = new FireworkView(canvas);
		var watcher = new FPSWatcher(fpsId);

		window.setInterval( function() {
			view.update();
			watcher.update(view.numSparks);
		}, 0);
	}
});
}(window));
