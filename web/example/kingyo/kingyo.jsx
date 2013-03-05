import 'js/web.jsx';
import 'mvq.jsx';
import 'webgl-util.jsx';
import 'game.jsx';

class _Part {
	static function createArrayBuffer(a:number[]) : WebGLBuffer {
		var gl = Kingyo.gl;
		var buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a), gl.STATIC_DRAW);
		return buf;
	}
	static function createIndexBuffer(a:int[]) : WebGLBuffer {
		var gl = Kingyo.gl;
		var buf = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(a), gl.STATIC_DRAW);
		return buf;
	}

	var vbuf = null:WebGLBuffer;
	var nbuf = null:WebGLBuffer;
	var ibuf = null:WebGLBuffer;
	var numv:int = 0;
	var numi:int = 0;

	function setVertex(v:number[]) : _Part {this.vbuf = _Part.createArrayBuffer(v); this.numv = v.length / 3;return this;}
	function setNormal(n:number[]) : _Part {this.nbuf = _Part.createArrayBuffer(n); return this;}
	function setIndex(i:int[]) : _Part {this.ibuf = _Part.createIndexBuffer(i); this.numi = i.length; return this;}
}

class Kingyo {
	static const bound = 10;
	static var gl = null:WebGLRenderingContext;
	static var prog = null:WebGLProgram;
	static var ulocs = null:Map.<WebGLUniformLocation>;
	static var alocs = null:Map.<int>;
	static var body:_Part;
	static var lfin:_Part; // left fin
	static var rfin:_Part; // right fin
	static var bfin:_Part; // back fin
	static var tfin:_Part; // tail fin
	static var all = []:Kingyo[];
	static var prevTime = 0;

	static var eyeProg = null:WebGLProgram;
	static var eyeULocs = null:Map.<WebGLUniformLocation>;
	static var eyeALocs = null:Map.<int>;
	static var eyes = null:_Part;

	static function initWithGL(gl:WebGLRenderingContext) : void {
		Kingyo.gl = gl;
		Kingyo.prog = Util.getProgram('kbody.vs', 'kbody.fs');

		Kingyo.body =
			new _Part()
			.setVertex([0,0,1, 0.7,0,0, 0,1,0, -0.7,0,0, 0,-1,0, 0,0,-1])
			.setNormal([0,0,1, 1,0,0, 0,1,0, -1,0,0, 0,-1,0, 0,0,-1])
			.setIndex([0,1,2, 0,2,3, 0,3,4, 0,4,1, 5,2,1, 5,3,2, 5,4,3, 5,1,4]:int[]);
		Kingyo.lfin =
			new _Part()
			.setVertex([0,0,0, 0.5,-0.25,0, 0.8,0.25,0])
			.setNormal([0,0,1, 0,0,1, 0,0,1])
			.setIndex([0,1,2]:int[]);
		Kingyo.rfin =
			new _Part()
			.setVertex([0,0,0, -0.8,0.25,0, -0.5,-0.25,0])
			.setNormal([0,0,1, 0,0,1, 0,0,1])
			.setIndex([0,1,2]:int[]);
		Kingyo.bfin =
			new _Part()
			.setVertex([0,0,0, 0,-0.5,-1, 0,0.5,-0.8])
			.setNormal([1,0,0, 1,0,0, 1,0,0])
			.setIndex([0,1,2]:int[]);
		Kingyo.tfin =
			new _Part()
			.setVertex([0,0,0, 0.8,-0.5,-1, 0,0.4,-0.8, -0.8,-0.5,-1])
			.setNormal([0,1,1, 1,1,1, 0,1,0, -1,1,1])
			.setIndex([0,1,2, 0,2,3]:int[]);

		Kingyo.ulocs = Util.getUniformLocations(Kingyo.prog);
		Kingyo.alocs = Util.getAttribLocations(Kingyo.prog);

		Kingyo.eyeProg = Util.getProgram('keye.vs', 'keye.fs');
		Kingyo.eyeULocs = Util.getUniformLocations(Kingyo.eyeProg);
		Kingyo.eyeALocs = Util.getAttribLocations(Kingyo.eyeProg);
		var ex = 0.3, ey = 0.15, ez = 0.5;
		Kingyo.eyes =
			new _Part()
			.setVertex([-ex,ey,ez,0, -ex,ey,ez,1, -ex,ey,ez,2, -ex,ey,ez,3, ex,ey,ez,4, ex,ey,ez,5, ex,ey,ez,6, ex,ey,ez,7])
			.setIndex([0,1,2, 0,2,3, 4,5,6, 4,6,7]:int[]);
	}

	static function init(num_kingyos:int) : void {
		for (var i = 0; i < num_kingyos; ++i) Kingyo.all.push(new Kingyo());
	}

	static function reset() : void {
		for (var i = 0; i < Kingyo.all.length; ++i) Kingyo.all[i].init();
	}

	static function numRests() : int {
		var r = 0;
		for (var i = 0; i < Kingyo.all.length; ++i) if (Kingyo.all[i]._state == 'swimming') ++r;
		return r;
	}

	static function update(t:number) : void {
		if (Kingyo.prevTime == 0) Kingyo.prevTime = t;
		var dt = t - Kingyo.prevTime;

		for (var i = 0; i < Kingyo.all.length; ++i) Kingyo.all[i]._update(dt);

		Kingyo.prevTime = t;
	}

	static function drawUnderWater(projMat:M44, viewMat:M44) : void {
		Kingyo.draw(projMat, viewMat, function(k:Kingyo):boolean{return k._state == 'swimming';});
	}
	static function drawAboveWater(projMat:M44, viewMat:M44) : void {
		Kingyo.draw(projMat, viewMat, function(k:Kingyo):boolean{return k._state != 'swimming';});
	}
	static function draw(projMat:M44, viewMat:M44, pred:(Kingyo)->boolean) : void {
		var gl = Kingyo.gl;
		var prog = Kingyo.prog;


		// draw bodies
		var ulocs = Kingyo.ulocs;
		var alocs = Kingyo.alocs;
		gl.useProgram(Kingyo.prog);
		gl.uniformMatrix4fv(ulocs['projectionMatrix'], false, projMat.array());
		gl.uniformMatrix4fv(ulocs['viewMatrix'], false, viewMat.array());
		gl.uniform4fv(ulocs['lightPosition'], [0, 1, 1, 0]);
		gl.enableVertexAttribArray(alocs['vertex']);
		gl.enableVertexAttribArray(alocs['normal']);

		for (var i = 0; i < Kingyo.all.length; ++i) {
			var k = Kingyo.all[i];
			if (pred(k)) k._draw();
		}

		gl.disableVertexAttribArray(alocs['vertex']);
		gl.disableVertexAttribArray(alocs['normal']);

		// draw eyes
		var eulocs = Kingyo.eyeULocs;
		var ealocs = Kingyo.eyeALocs;
		gl.useProgram(Kingyo.eyeProg);
		gl.uniformMatrix4fv(eulocs['projectionMatrix'], false, projMat.array());
		gl.uniformMatrix4fv(eulocs['viewMatrix'], false, viewMat.array());
		gl.uniform4fv(eulocs['lightPosition'], [0, 1, 1, 0]);
		gl.uniform1f(eulocs['radius'], 0.2);
		gl.bindBuffer(gl.ARRAY_BUFFER, Kingyo.eyes.vbuf);
		gl.vertexAttribPointer(ealocs['position'], 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(ealocs['position']);

		for (var i = 0; i < Kingyo.all.length; ++i) {
			var k = Kingyo.all[i];
			if (pred(k)) k._drawEyes();
		}

		gl.disableVertexAttribArray(ealocs['position']);
	}

	static function hit(x:number, y:number) : Kingyo[] {
		var h = []:Kingyo[];
		for (var i = 0; i < Kingyo.all.length; ++i) {
			var k = Kingyo.all[i];
			if (k._state != 'swimming') continue;
			var dx = k._pos.x - x;
			var dy = k._pos.y - y;
			var r = Math.sqrt(dx*dx + dy*dy);
			if (r < 2) h.push(k);
		}
		return h;
	}

	static function fish(kingyos:Kingyo[]) : void {
		for (var i = 0; i < kingyos.length; ++i) {
			kingyos[i]._fished();
		}
	}

	var _pos = new V3();
	var _vangle = 0;
	var _velo = 0;
	var _anim = 0;
	var _state = ''; // 'swimming', 'flying' and 'listed'
	var _spinMat = new M44();
	var _spinAxis = new V3();
	var _spinSpeed = 0;
	var _vz = 0;
	var _color = [0.7, 0, 0]; // default color
	var _color2 = [0.7, 0, 0];
	var _color2pos = [0, 0, 0, 0]; // center.xyz & radius

	function constructor() {
		this.init();

		if (Math.random() < 0.3) {
			// red & white
			this._color2 = [0.7, 0.7, 0.8];
			this._color2pos = [2*Math.random()-1, 2*Math.random()-1, 2*Math.random()-1, 0.5*Math.random()+0.5];
		} else if (Math.random() < 0.5) {
			// black
			this._color = [0.15, 0.1, 0.2];
			this._color2 = [0.15, 0.1, 0.2];
			this._color2pos = [0, 0, 0, 0];
		}

	}

	function init() : void {
		this._setRandom();
		var r = 8 * Math.random();
		var x = r * Math.cos(this._vangle);
		var y = r * Math.sin(this._vangle);
		this._pos.set(x, y, -2 - Math.random() * 3);
		this._anim = 0;
		this._state = 'swimming';
		this._spinMat.setIdentity();
		this._spinAxis.set(0, 0, 0);
		this._spinSpeed = 0;
		this._vz = 0;
	}

	function _setRandom() : void {
		this._vangle = Math.random() * 2 * Math.PI;
		this._velo = Math.random() * 15 + 1;
	}

	function _fished() : void {
		this._state = 'flying';
		this._pos.z = 2;
		this._vz = 150 + Math.random() * 50;
		this._velo = 12;
		this._spinMat.setIdentity();
		var a = 2 * Math.PI * Math.random();
		this._spinAxis.set(Math.cos(a), Math.sin(a), Math.random()-0.5);
		this._spinSpeed = 10 * Math.random() + 2;
	}

	function _update(dt:number) : void {
		switch (this._state) {
		default:
			break;
		case 'swimming':
			var x = this._pos.x + Math.cos(this._vangle) * this._velo * dt;
			var y = this._pos.y + Math.sin(this._vangle) * this._velo * dt;
			var b = Kingyo.bound;
			if (x < -b) {x = -b; this._setRandom();}
			if (y < -b) {y = -b; this._setRandom();}
			if (x > b) {x = b; this._setRandom();}
			if (y > b) {y = b; this._setRandom();}
			this._pos.x = x;
			this._pos.y = y;
			break;
		case 'flying':
			this._vz -= 300 * dt;
			this._pos.z = this._pos.z + this._vz * dt;
			this._spinMat.mul(new M44().setRotation(dt * this._spinSpeed, this._spinAxis));
			if (this._pos.z >= 2) break;
			var num_listed = 0; for (var i = 0; i < Kingyo.all.length; ++i) if (Kingyo.all[i]._state == 'listed') ++num_listed;
			this._pos.set(num_listed * 1.5 - Kingyo.bound - 4.25, 3 + Kingyo.bound, 2);
			this._vangle = Math.PI / 2;
			this._spinMat.setIdentity();
			this._velo = 2;
			this._state = 'listed';
		case 'listed':
			break;
		}

		this._anim += dt * this._velo;
	}

	function _draw() : void {
		var gl = Kingyo.gl;
		var prog = Kingyo.prog;

		gl.uniform3fv(Kingyo.ulocs['color'], this._color);
		gl.uniform3fv(Kingyo.ulocs['color2'], this._color2);
		gl.uniform4fv(Kingyo.ulocs['color2pos'], this._color2pos);

		var modelMatLoc = Kingyo.ulocs['modelMatrix'];

		var s = Math.sin(this._anim * 5); // swing

		var bodyMat =
			new M44().setTranslation(this._pos)
			.mul(this._spinMat)
			.mul(new M44().setRotationZ(this._vangle - s/10))
			.mul(new M44().setRotationX(Math.PI/2))  // JSON kingyo model is +Z front and +Y up.
			.mul(new M44().setRotationY(Math.PI/2)); // These two lines transform model to +X front and +Z up.
		gl.uniformMatrix4fv(modelMatLoc, false, bodyMat.array());
		this._drawPart(Kingyo.body);

		var lfinMat =
			bodyMat.clone()
			.mul(new M44().setTranslation(0.5, -0.3, 0))
			.mul(new M44().setRotation(1+s/2, 0.2, 1, -0.5));
		gl.uniformMatrix4fv(modelMatLoc, false, lfinMat.array());
		this._drawPart(Kingyo.lfin);

		var rfinMat =
			bodyMat.clone()
			.mul(new M44().setTranslation(-0.5, -0.3, 0))
			.mul(new M44().setRotation(-1-s/2, -0.2, 1, -0.5));
		gl.uniformMatrix4fv(modelMatLoc, false, rfinMat.array());
		this._drawPart(Kingyo.rfin);

		var bfinMat =
			bodyMat.clone()
			.mul(new M44().setTranslation(0, 0.7, 0))
			.mul(new M44().setRotation(s/2, 0, 1, 1));
		gl.uniformMatrix4fv(modelMatLoc, false, bfinMat.array());
		this._drawPart(Kingyo.bfin);

		var tfinMat =
			bodyMat.clone()
			.mul(new M44().setTranslation(0,0,-0.7))
			.mul(new M44().setRotation(s/2, 0, 1, 0));
		gl.uniformMatrix4fv(modelMatLoc, false, tfinMat.array());
		this._drawPart(Kingyo.tfin);
	}
	function _drawPart(p:_Part) : void {
		var gl = Kingyo.gl;
		var prog = Kingyo.prog;

		gl.bindBuffer(gl.ARRAY_BUFFER, p.vbuf);
		gl.vertexAttribPointer(Kingyo.alocs['vertex'], 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, p.nbuf);
		gl.vertexAttribPointer(Kingyo.alocs['normal'], 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.ibuf);
		gl.drawElements(gl.TRIANGLES, p.numi, gl.UNSIGNED_SHORT, 0);
	}
	function _drawEyes() : void {
		var gl = Kingyo.gl;
		var prog = Kingyo.eyeProg;

		var ulocs = Kingyo.eyeULocs;
		var alocs = Kingyo.eyeALocs;

		gl.uniform3fv(ulocs['color'], this._color);

		var s = Math.sin(this._anim * 5); // swing

		var bodyMat =
			new M44().setTranslation(this._pos)
			.mul(this._spinMat)
			.mul(new M44().setRotationZ(this._vangle - s/10))
			.mul(new M44().setRotationX(Math.PI/2))  // JSON kingyo model is +Z front and +Y up.
			.mul(new M44().setRotationY(Math.PI/2)); // These two lines transform model to +X front and +Z up.
		gl.uniformMatrix4fv(ulocs['modelMatrix'], false, bodyMat.array());

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Kingyo.eyes.ibuf);
		gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
	}
}
