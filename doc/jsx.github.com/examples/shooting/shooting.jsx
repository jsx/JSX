/*
	This program is originated from http://nmi.jp/archives/386
	Copyright (c) 2012, Kihira Takuo. All rights reserved.

	Image resources are copied from the following web site:
	http://homepage2.nifty.com/hamcorossam/
	Copyright (c) 2012, HamCorossam. All rights reserved.
*/
import 'js/web.jsx';

final class Config {
	static const cols = 10;
	static const rows = 15;
	static const cellWidth  = 32;
	static const cellHeight = 32;
	static const bulletWidth  = 4;
	static const bulletHeight = 4;
	static const bulletSpeed = 20;
	static const reloadCount = 3;
	static const initialNumRocks = 5;

	static const FPS = 30;

	static const width  = Config.cols * Config.cellWidth;
	static const height = Config.rows * Config.cellHeight;

	static const imagePath = "img";

	static const canvasId = "stage";
	static const scoreboardId = "scoreboard";
}

mixin Sprite {
	abstract var x : number;
	abstract var y : number;

	abstract var width : number;
	abstract var height : number;

	abstract var image : HTMLCanvasElement;

	function detectCollision(other : Sprite) : boolean {
		return Math.abs(this.x - other.x) < (Config.cellWidth  >> 1)
			&& Math.abs(this.y - other.y) < (Config.cellHeight >> 1);

	}

	function draw(context : CanvasRenderingContext2D) : void {
		context.drawImage(this.image,
			this.x - (this.width  >> 1),
			this.y - (this.height >> 1));
	}
}

abstract class MovingObject implements Sprite {
	var x : number;
	var y : number;

	var dx : number;
	var dy : number;

	var image : HTMLCanvasElement;

	function constructor(x : number, y : number, dx : number, dy : number, image : HTMLCanvasElement) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.image = image;
	}

	function update() : boolean {
		this.x += this.dx;
		this.y += this.dy;
		return this._inDisplay();
	}

	function _inDisplay() : boolean {
		return !( this.x <= 0 || this.x >= Config.width
			|| this.y <= 0 || this.y >= Config.height);

	}
}

final class Bullet extends MovingObject {
	var width : number  = Config.bulletWidth;
	var height : number = Config.bulletHeight;

	function constructor(x : number, y : number, dx : number, dy : number, image : HTMLCanvasElement) {
		super(x, y, dx, dy, image);
	}

	function update(st : Stage) : boolean {
		var inDisplay = super.update();

		this.draw(st.ctx);

		for(var rockKey in st.rocks) {
			var rock = st.rocks[rockKey];

			if(this.detectCollision(rock)) {
				if(rock.hp == 0) return false;

				inDisplay = false;

				if(--rock.hp == 0) {
					st.score = Math.min(st.score + rock.score, 999999999);

					st.updateScore();

					rock.dx = rock.dy = 0;
					rock.setState(st, "bomb1");
				}
				else {
					var newState = (rock.state +  "w").substring(0, 6);
					rock.setState(st, newState);
				}
			}
		}
		return inDisplay;
	}
}

final class Rock extends MovingObject {
	var width  = Config.cellWidth;
	var height = Config.cellHeight;

	var hp : number;
	var score : number;
	var state : string;

	function constructor(
		x : number, y : number, dx : number, dy : number,
		hp : number, score : number, state : string,
		image : HTMLCanvasElement
		) {
		super(x, y, dx, dy, image);
		this.hp = hp;
		this.score = score;
		this.state = state;
	}

	function update(st : Stage) : boolean {
		var inDisplay = super.update();

		this.draw(st.ctx);

		if(this.hp == 0) {
			var next = (this.state.substring(4) as int) + 1;
			if(next > 10) {
				return false;
			}
			else {
				this.setState(st, "bomb" + next as string);
			}
		}
		else {
			this.setState(st, this.state.substring(0, 5));

			if(st.isGaming() && this.detectCollision(st.ship)) {
				st.changeStateToBeDying();
				st.dying = 1;
			}
		}
		return inDisplay;
	}

	function setState(stage : Stage, state : string) : void {
		this.state = state;
		this.image = stage.images[state];
	}
}

final class SpaceShip implements Sprite {
	var x : number;
	var y : number;

	var width  = Config.cellWidth;
	var height = Config.cellHeight;

	var image : HTMLCanvasElement;

	function constructor(x : number, y : number, image : HTMLCanvasElement) {
		this.x = x;
		this.y = y;
		this.image = image;
	}
}

final class Stage {

	var imageName : Array.<string>;
	var images : Map.<HTMLCanvasElement>;

	var state = "loading";

	var ship : SpaceShip;
	var dying = 0;

	var lastX : number = -1;
	var lastY : number = -1;
	var frameCount : number = 0;
	var currentTop : number;

	var ctx   : CanvasRenderingContext2D;
	var bgCtx : CanvasRenderingContext2D;

	var bullets : Map.<Bullet>;

	var rocks : Map.<Rock>;
	var numRocks : number;

	var score : number;
	var scoreElement : HTMLElement;

	function changeStateToBeLoading() : void {
		this.state = "loading";
	}
	function isLoading() : boolean {
		return this.state == "loading";
	}

	function changeStateToBeGaming() : void {
		this.state = "gaming";
	}
	function isGaming() : boolean {
		return this.state == "gaming";
	}

	function changeStateToBeDying() : void {
		this.state = "dying";
	}
	function isDying() : boolean {
		return this.state == "dying";
	}

	function changeStateToBeGameOver() : void {
		this.state = "gameover";
	}
	function isGameOver() : boolean {
		return this.state == "gameover";
	}

	function level() : int {
		return this.frameCount / 500;
	}


	function drawBackground() : void {
		var bottom = Config.height + Config.cellHeight - this.currentTop;
		if(bottom > 0) {
			this.ctx.drawImage(this.bgCtx.canvas, 0, this.currentTop,
				Config.width, bottom, 0, 0, Config.width, bottom);
		}
		if(Math.abs(Config.height - bottom) > 0) {
			this.ctx.drawImage(this.bgCtx.canvas, 0, bottom);
		}
	}

	function draw() : void {
		this.drawBackground();

		var ship = this.ship;

		if(this.isGaming()) {
			ship.draw(this.ctx);
		}
		else if(this.isDying()) {
			ship.image = this.images["bomb" + this.dying as string];
			ship.draw(this.ctx);

			if(++this.dying > 10) {
				this.initialize(); // restart the game
				//this.changeStateToBeGameOver();
			}
		}
	}

	function drawSpace(px : number, py : number) : void {
		var spaceType = (Math.random() * 10 + 1) as int as string;
		var image = this.images["space" + spaceType];

		assert image != null;

		this.bgCtx.drawImage(image,
			px * Config.cellWidth,
			py * Config.cellHeight);
	}

	function createBullet(dx : number, dy : number) : Bullet {
		return new Bullet(
			this.ship.x, this.ship.y,
			dx * Config.bulletSpeed,
			dy * Config.bulletSpeed,
			this.images["bullet"]
		);
	}

	function createRock() : Rock {
		var level = this.level();

		var px = this.ship.x + Math.random() * 100 - 50;
		var py = this.ship.y + Math.random() * 100 - 50;
		var fx = Math.random() * Config.width;
		var fy = (level >= 4) ? (Math.random() * 2) * Config.height : 0;

		var r = Math.atan2(py - fy, px - fx);
		var d = Math.max(Math.random() * (5.5 + level) + 1.5, 10);

		var hp = (Math.random() * Math.random()
			* ((5 + level / 4) as int)) | 1;

		var rockId = (Math.random() * 3 + 1) as int as string;
		return new Rock(
			fx,
			fy,
			Math.cos(r) * d,
			Math.sin(r) * d,
			hp,
			hp * hp * 100,
			"rock" + rockId,
			this.images["rock" + rockId]
		);
	}


	function tick() : void {
		++this.frameCount;

		dom.window.setTimeout(function() : void {
			this.tick();
		}, (1000 / Config.FPS) | 0);

		this.watchFPS();

		if(this.isLoading()) {
			return;
		}

		if(--this.currentTop == 0) {
			this.currentTop = Config.height + Config.cellHeight;
		}
		if( (this.currentTop % Config.cellHeight) == 0) {
			var line = this.currentTop / Config.cellHeight - 1;
			for(var px = 0; px < Config.cols; ++px) {
				this.drawSpace(px, line);
			}
		}

		this.draw();

		var fc = this.frameCount as string;
		if(this.isGaming() && (this.frameCount % Config.reloadCount) == 0) {
			this.bullets[fc + "a"] = this.createBullet(-1, -1);
			this.bullets[fc + "b"] = this.createBullet( 0, -1);
			this.bullets[fc + "c"] = this.createBullet( 1, -1);
			this.bullets[fc + "d"] = this.createBullet(-1,  1);
			this.bullets[fc + "e"] = this.createBullet( 1,  1);
		}

		if(this.numRocks < (Config.initialNumRocks + this.level())) {
			this.rocks[fc + "r"] = this.createRock();
			++this.numRocks;
		}

		for(var bulletKey in this.bullets) {
			if(!this.bullets[bulletKey].update(this)) {
				delete this.bullets[bulletKey];
			}
		}

		for(var rockKey in this.rocks) {
			if(!this.rocks[rockKey].update(this)) {
				delete this.rocks[rockKey];
				--this.numRocks;
			}
		}
	}

	function initialize() : void {

		for(var px = 0; px < Config.cols; ++px) {
			for(var py = 0; py < Config.rows + 1; ++py) {
				this.drawSpace(px, py);
			}
		}

		for(var i = 0; i < 3; ++i) {
			var canvas = dom.createElement("canvas") as HTMLCanvasElement;

			canvas.width  = Config.cellWidth;
			canvas.height = Config.cellHeight;

			// prepare flashing rock images
			var rctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			assert rctx != null;

			var k = "rock" + (i+1) as string;
			rctx.drawImage(this.images[k], 0, 0);
			rctx.globalCompositeOperation = "source-in";
			rctx.fillStyle = "#fff";
			rctx.fillRect(0, 0, canvas.width, canvas.height);
			this.images[k + "w"] = canvas;
		}

		this.currentTop = Config.height + Config.cellHeight;

		this.ship = new SpaceShip(
			 Config.width >> 2,
			(Config.height * 3/4) as int,
			this.images["my"]);

		this.score      = 0;

		this.bullets = {} : Map.<Bullet>;
		this.rocks   = {} : Map.<Rock>;
		this.numRocks = 0;

		this.changeStateToBeGaming();

		dom.window.setTimeout(function() : void {
			dom.window.scrollTo(0, 0);
		}, 250);
	}

	function constructor(stageCanvas : HTMLCanvasElement, scoreboard : HTMLElement) {
		// initialize properties
		this.changeStateToBeLoading();

		this.imageName = ["my", "bullet", "rock1", "rock2", "rock3"];
		this.images    = {} : Map.<HTMLCanvasElement>;

		scoreboard.style.width = Config.width as string + "px";
		this.scoreElement = scoreboard;

		stageCanvas.width  = Config.width;
		stageCanvas.height = Config.height;
		this.ctx = stageCanvas.getContext("2d") as CanvasRenderingContext2D;
        assert this.ctx != null;

		var bg = dom.createElement("canvas") as HTMLCanvasElement;
		bg.width  = Config.width;
		bg.height = Config.height + Config.cellHeight;
		this.bgCtx = bg.getContext("2d") as CanvasRenderingContext2D;
        assert this.bgCtx != null;

		for(var i = 0; i < 10; ++i) {
			this.imageName.push("space" + (i + 1) as string);
			this.imageName.push("bomb"  + (i + 1) as string);
		}

		// preload
		var loadedCount = 0;
		var checkLoad = function(e : Event) : void {
			var image = e.target as HTMLImageElement;
            assert image != null;

			var canvas = dom.createElement("canvas") as HTMLCanvasElement;
			var cx = canvas.getContext("2d") as CanvasRenderingContext2D;
            assert cx != null;
			cx.drawImage(image, 0, 0);
			this.images[image.name] = canvas;

			if(++loadedCount == this.imageName.length) {
				this.initialize();
			}
		};
		for(var i = 0; i < this.imageName.length; ++i) {
			var name = this.imageName[i];
			var image = dom.createElement("img") as HTMLImageElement;
			image.addEventListener("load", checkLoad);
			image.src = Config.imagePath + "/" + name + ".png";
			image.name = name;
		}

		var touchStart = function(e : Event) : void {
			e.preventDefault();

			var p = this.getPoint(e);

			this.lastX = p[0];
			this.lastY = p[1];

			if(this.isGameOver()) {
				this.initialize();
			}
		};

		var body = dom.window.document.body;

		body.addEventListener("mousedown",  touchStart);
		body.addEventListener("touchstart", touchStart);

		var touchMove = function(e : Event) : void {
			e.preventDefault();

			var p = this.getPoint(e);

			if(this.isGaming() && this.lastX != -1) {
				var ship = this.ship;
				ship.x += ((p[0] - this.lastX) * 2.5) as int;
				ship.y += ((p[1] - this.lastY) * 3.0) as int;

				ship.x = Math.max(ship.x, 0);
				ship.x = Math.min(ship.x, Config.width);

				ship.y = Math.max(ship.y, 0);
				ship.y = Math.min(ship.y, Config.height);
			}

			this.lastX = p[0];
			this.lastY = p[1];
		};

		body.addEventListener("mousemove", touchMove);
		body.addEventListener("touchmove", touchMove);
	}

	function getPoint(e : Event/*UIEvent*/) : number[] {
		var px = 0;
		var py = 0;
		if(e instanceof MouseEvent) {
			var me = e as MouseEvent;
			px = me.clientX;
			py = me.clientY;
		}
		else if(e instanceof TouchEvent) {
			var te = e as TouchEvent;
			px = te.touches[0].pageX;
			py = te.touches[0].pageY;
		}
		return [ px, py ];
	}

	var start = Date.now();
	var fps = 0;
	function watchFPS() : void {
		if((this.frameCount % Config.FPS) == 0) {
			this.fps = (this.frameCount / (Date.now() - this.start) * 1000) as int;
			this.updateScore();
		}
	}

	function updateScore() : void {
		var scoreStr = this.score as string;
		var fillz = "000000000".substring(
			0, 9 - scoreStr.length
		);
		this.scoreElement.innerHTML
			= fillz + scoreStr + "<br/>\n"
			+ this.fps as string + " FPS";
	}

}

final class _Main {
	static function main(args : string[]) : void {
		log "start shooting.jsx";

		var stageCanvas = dom.id(Config.canvasId) as HTMLCanvasElement;
		assert stageCanvas != null;
		var scoreboard = dom.id(Config.scoreboardId);
		assert scoreboard != null;

		var stage = new Stage(stageCanvas, scoreboard);
		stage.tick();
	}
}
