import "js/dom.jsx";
import "js/dom/canvas2d.jsx";

class Config {
	static const quantity = 360;
	static const size     = 2.0;
	static const decay    = 0.98;
	static const gravity  = 2.0;
	static const speed    = 6.0;
}


class Spark {
	static const rad = Math.PI * 2;

	var posX : number;
	var posY : number;
	var velX : number;
	var velY : number;
	var size : number;

	function constructor(posX : number, posY : number, size : number) {
		var angle    = Math.random() * Spark.rad;
		var velocity = Math.random() * Config.speed;

		this.velX = Math.cos(angle) * velocity;
		this.velY = Math.sin(angle) * velocity;
	}

	function draw(view : FireworkView, color : string) : boolean {
		this.posX += this.velX;
		this.posY += this.velY;

		this.velX *= Config.decay;
		this.velY *= Config.decay;
		this.size *= Config.decay;

		this.posY += Config.gravity;

		view.cx.beginPath();
		view.cx.arc(this.posX, this.posY, this.size, 0, Spark.rad, true);
		view.cx.fillStyle = color;
		view.cx.fill();

		// returns true if this spark lives
		if(this.size <= 0.1) return false;
		if(this.posX <= 0 || this.posY <= 0) return false;
		if(this.posX >= view.width || this.posY >= view.height) return false;
		return true;
	}
}

class Firework {
	var color : string;
	var sparks : Spark[];
	var view : FireworkView;

	static function randomColor() : string {
		var rgb = [] : int[];
		for (var i = 0; i < 3; ++i) {
			rgb.push( (Math.random() * 0xFF + 60) as int );
		}
		return "rgb(" +
			rgb[0] as string + "," +
			rgb[1] as string + "," +
			rgb[2] as string + ")";
	}

	function constructor(view : FireworkView, x : int, y : int) {
		this.view = view;
		this.color = Firework.randomColor();
		this.sparks = [ ] : Spark[];

		for (var i = 0; i < Config.quantity; ++i) {
			this.sparks.push(new Spark(x, y, Config.size));
		}
	}

	function update() : boolean {
		for(var i = 0; i < this.sparks.length; ++i) {
			var s = this.sparks[i];
			if (! s.draw(this.view, this.color)) {
				this.sparks.splice(i, 1);
			}
		}
		return this.sparks.length > 0;
	}
}

class FireworkView {
	var cx : CanvasRenderingContext2D;
	var width : int;
	var height : int;
	var left : int;
	var top : int;

	var fireworks : Firework[];

	var numSparks = 0;

	function constructor(canvas : HTMLCanvasElement) {
		this.fireworks = [] : Firework[];
		this.cx = canvas.getContext("2d") as CanvasRenderingContext2D;

		this.width  = canvas.width;
		this.height = canvas.height;

		var rect = canvas.getBoundingClientRect();
		this.left = rect.left;
		this.top  = rect.top;

		canvas.addEventListener("mousedown", function (e : MouseEvent) : void {
			this.explode(e.clientX, e.clientY);
		});
		canvas.addEventListener("touchstart", function (e : TouchEvent) : void {
			this.explode(e.touches[0].pageX, e.touches[0].pageY);
		});
	}

	function explode(x : int, y : int) : void {
		this.fireworks.push(new Firework(this, x - this.left, y - this.top));
	}

	function update() : void {
		if (this.fireworks.length == 0) return;

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

		this.cx.fillStyle = "rbga(0, 0, 0, 0.3)";
		this.cx.fillRect(0, 0, this.width, this.height);
	}

}

class FPSWatcher {
	var start = Date.now();
	var fps = 0;

	function update(numSparks : int) : void {
		++this.fps;

		if((Date.now() - this.start) >= 1000) {
			var message = "FPS: " + this.fps as string +
				" (sparks: " + numSparks as string + ")";
			dom.id("fps").innerHTML = message;
			if(numSparks > 0) log message;

			this.start = Date.now();
			this.fps = 0;
		}
	}
}

class Application {
	static function main() : void {
		var canvas = dom.id("night-sky") as HTMLCanvasElement;

		var view = new FireworkView(canvas);
		var watcher = new FPSWatcher();

		dom.getWindow().setInterval( function() : void {
			view.update();
			watcher.update(view.numSparks);
		}, 0);
	}
}

