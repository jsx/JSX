import 'js.jsx';
import 'js/web.jsx';
import 'timer.jsx';
import 'webgl-util.jsx';
import 'mvq.jsx';
import 'kingyo.jsx';
import 'poi.jsx';
import 'water.jsx';
import 'rendertexture.jsx';

class _Main {
	static function main(args:string[]) : void {
		Game.main('webgl-canvas', 'life-bar');
	}
}

class Game {
	static const viewDistance = 80;
	static const viewLean = 0.2;
	static const near = 2;
	static const far = 1000;
	static const fovh = 0.2;
	static const fovv = 0.2;
	static var gl = null:WebGLRenderingContext;
	static var projMat =
		new M44().setFrustum(
			-Game.near * Game.fovh,
			Game.near * Game.fovh,
			-Game.near * Game.fovv,
			Game.near * Game.fovv,
			Game.near,
			Game.far
		);
	static var viewMat =
		new M44().setTranslation(0, 0, -Game.viewDistance)
		.mul(new M44().setRotationX(-Game.viewLean));
	static var poi = null:Poi;
	static var water = null:Water;
	static var canvas = null:HTMLCanvasElement;
	static var renderTex = null:RenderTexture;
	static var bltProg = null:WebGLProgram;
	static var bltULocs = null:Map.<WebGLUniformLocation>;
	static var bltALocs = null:Map.<int>;
	static var bltVTBuf = null:WebGLBuffer;

	static var life = 1;
	static var poi_down_time = 0;
	static const damage_per_second = 0.5;
	static var life_bar = null:HTMLDivElement;
	static var life_bar_width = 100;

	static var status_text = null:HTMLDivElement;
	static var startTime = 0;

	static function main(canvas_id:string, life_id:string) : void {
		var canvas = dom.id(canvas_id) as HTMLCanvasElement;
		var ww = dom.window.innerWidth;
		var wh = dom.window.innerHeight;
		var canvas_size = Math.min(ww, wh);
		canvas.width = canvas_size;
		canvas.height = canvas_size;

		Game.status_text = dom.id('status') as HTMLDivElement;
		Game.life_bar = dom.id(life_id) as HTMLDivElement;
		var lbw = Game.life_bar.style.width;
		Game.life_bar_width = lbw.substring(0, lbw.length - 2) as int;

		var gl = Util.getWebGL(canvas_id);
		Game.gl = gl;
		Poi.initWithGL(gl);
		Kingyo.initWithGL(gl);
		Water.initWithGL(gl);
		RenderTexture.initWithGL(gl);

		Game.poi = new Poi();
		Kingyo.init(20);
		Game.water = new Water();

		Game.bltProg = Util.getProgram('vt.vs', 'vt.fs');
		Game.bltULocs = Util.getUniformLocations(Game.bltProg);
		Game.bltALocs = Util.getAttribLocations(Game.bltProg);
		Game.bltVTBuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Game.bltVTBuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

		var getPoint = function(e:Event) : number[] {
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
		};

		var lastTouchPos = [0, 0];

		var calcMousePosOnXYPlane = function(p:number[]) : number[] {
			// window coordinate
			var wx = p[0] / canvas.width * 2 - 1;
			var wy = -p[1] / canvas.height * 2 + 1;
			// eye position
			var epos = new V3(0, 0, Game.viewDistance).transformBy(new M33().setRotateX(Game.viewLean));
			// pointer direction
			var pdir = new V3(Game.fovh * wx, Game.fovv * wy, -1).transformBy(new M33().setRotateX(Game.viewLean)).normalize();
			// hit position
			var hpos = pdir.clone().mul(epos.z / -pdir.z).add(epos);
			return [hpos.x, hpos.y];
		};

		var touchStart = function(e:Event) : void {
			e.preventDefault();
			lastTouchPos = getPoint(e);
			var pos = calcMousePosOnXYPlane(lastTouchPos);
			Game.poi.setPosition(pos[0], pos[1]);

			if (Game.poi.tearing() || Kingyo.numRests() == 0) {
				// reset game
				Game.life = 1;
				Game.life_bar.style.width = Game.life_bar_width.toString()+"px";
				Game.poi.tear(false);
				Kingyo.reset();
				Game.status_text.innerHTML = 'click to start';
			} else {
				if (!Game.poi.tearing()) {
					Game.poi.down(true);
					Game.poi_down_time = Date.now() / 1000;
					if (Game.startTime == 0) Game.startTime = Date.now();
				}
				var hit = Kingyo.hit(pos[0], pos[1]);
				if (hit.length > 0) {
					Game.poi.tear(true);
					Game.playSound('tear.mp3');
					Game.startTime = 0;
				}

				Game.water.setImpulse(
					pos[0]/40+0.5,
					pos[1]/40+0.5,
					0.03,
					0
				);
			}
		};
		canvas.addEventListener("mousedown",  touchStart);
		canvas.addEventListener("touchstart", touchStart);

		var touchEnd = function(e:Event) : void {
			e.preventDefault();
			if (e instanceof MouseEvent) lastTouchPos = getPoint(e);
			var pos = calcMousePosOnXYPlane(lastTouchPos);
			Game.poi.setPosition(pos[0], pos[1]);
			if (Game.poi.down()) {
				if (!Game.poi.tearing()) {
					var hit = Kingyo.hit(pos[0], pos[1]);
					Kingyo.fish(hit);
					if (hit.length > 0) Game.playSound('fish.mp3');
					if (Kingyo.numRests() == 0) Game.startTime = 0;
				}

				Game.water.setImpulse(
					pos[0]/40+0.5,
					pos[1]/40+0.5,
					0.03,
					1
				);
			}
			Game.poi.down(false);
		};
		canvas.addEventListener("mouseup", touchEnd);
		canvas.addEventListener("touchend", touchEnd);

		var touchMove = function(e:Event) : void {
			e.preventDefault();
			lastTouchPos = getPoint(e);
			var pos = calcMousePosOnXYPlane(lastTouchPos);
			Game.poi.setPosition(pos[0], pos[1]);

			if (Game.poi.down()) {
				Game.water.setImpulse(
					pos[0]/40+0.5,
					pos[1]/40+0.5,
					0.02,
					0.2
				);
			}
		};
		canvas.addEventListener("mousemove", touchMove);
		canvas.addEventListener("touchmove", touchMove);
		canvas.onmouseout = function(e:Event) : void {
			var pos = calcMousePosOnXYPlane(getPoint(e));
			Game.poi.setPosition(pos[0], pos[1]);
			Game.poi.down(false);
		};

		canvas.oncontextmenu = function(e:Event) : void {e.preventDefault();};
		canvas.style.cursor = 'none';
		Game.canvas = canvas;

		Game.renderTex = new RenderTexture(canvas.width, canvas.height);

		var raf = (dom.window.location.hash == "#raf");
		log "use native RAF: " + raf as string;
		Timer.useNativeRAF(raf);

		function update_render(time:number) : void {
			Game.update();
			Game.render();

			Timer.requestAnimationFrame(update_render);
		}

		update_render(0);

		log 'game start!';
	}

	static function playSound(url:string) : void {
		var s = dom.document.createElement('audio') as HTMLAudioElement;
		s.src = url;
		s.play();
	}

	static function update() : void {
		var t = Date.now() / 1000;

		Kingyo.update(t);

		Game.water.step(t);

		if (Game.poi.down()) {
			Game.life -= (t - Game.poi_down_time) * Game.damage_per_second;
			Game.poi_down_time = t;
			if (Game.life < 0 && !Game.poi.tearing()) {
				Game.life = 0;
				Game.poi.tear(true);
				Game.playSound('tear.mp3');
				Game.startTime = 0;
			}
			Game.life_bar.style.width = (Game.life*Game.life_bar_width).toString()+"px";
		}

		if (Game.startTime > 0) {
			Game.status_text.innerHTML = (((Date.now() - Game.startTime)|0)/1000).toString() + '[s]';
		}
	}

	static function render() : void {
		Game.update();

		var gl = Game.gl;

		Game.renderTex.begin();

		gl.clearColor(0.2, 0.6, 0.8, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

		Kingyo.drawUnderWater(Game.projMat, Game.viewMat);
		if (Game.poi.down()) Game.poi.draw(Game.projMat, Game.viewMat);
		//Game.water.debugDraw();

		Game.renderTex.end();

		gl.clear(gl.DEPTH_BUFFER_BIT);

		gl.useProgram(Game.bltProg);

		gl.bindTexture(gl.TEXTURE_2D, Game.renderTex.texture());
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.uniform1i(Game.bltULocs['texture'], 0);

		gl.uniformMatrix4fv(Game.bltULocs['projectionMatrix'], false, new M44().setOrtho(0,1,0,1,-1,0).array());
		gl.uniformMatrix4fv(Game.bltULocs['modelviewMatrix'], false, new M44().setIdentity().array());

		gl.bindBuffer(gl.ARRAY_BUFFER, Game.bltVTBuf);
		gl.vertexAttribPointer(Game.bltALocs['vertex'], 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(Game.bltALocs['texcoord'], 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(Game.bltALocs['vertex']);
		gl.enableVertexAttribArray(Game.bltALocs['texcoord']);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.disableVertexAttribArray(Game.bltALocs['vertex']);
		gl.disableVertexAttribArray(Game.bltALocs['texcoord']);

		Game.water.draw(Game.projMat, Game.viewMat, Game.renderTex.texture(), Game.canvas.offsetWidth, Game.canvas.offsetHeight);

		Kingyo.drawAboveWater(Game.projMat, Game.viewMat);
		if (!Game.poi.down()) Game.poi.draw(Game.projMat, Game.viewMat);

		Util.checkGLError();
	}


}
