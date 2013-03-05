import 'js/web.jsx';
import 'mvq.jsx';
import 'webgl-util.jsx';

class Water {
	static var gl = null:WebGLRenderingContext;
	static var progDisp = null:WebGLProgram;
	static var progVelo = null:WebGLProgram;
	static var vbuf = null:WebGLBuffer;

	static var drawProg = null:WebGLProgram;
	static var drawVBuf = null:WebGLBuffer;
	static var drawTBuf = null:WebGLBuffer;

	static const tsize = 64;
	static const time_step = 0.02;

	static function initWithGL(gl:WebGLRenderingContext) : void {
		Water.gl = gl;

		Water.progDisp = Util.getProgram('water.vs', 'waterd.fs');
		Water.progVelo = Util.getProgram('water.vs', 'waterv.fs');

		Water.vbuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Water.vbuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

		Water.drawProg = Util.getProgram('vt.vs', 'refr.fs');
		Water.drawVBuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Water.drawVBuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-20,-20, 20,-20, 20,20, -20,20]), gl.STATIC_DRAW);
		Water.drawTBuf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, Water.drawTBuf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);
	}

	var texture = null:WebGLTexture;
	var framebuffer = null:WebGLFramebuffer;
	var texturebuffer = null:WebGLTexture;
	var depthbuffer = null:WebGLRenderbuffer;
	var width = 0;
	var height = 0;

	var _ix = -1;
	var _iy = -1;
	var _ir = 0;
	var _iz = 0;

	var _next_step_time = 0;

	function constructor() {
		var gl = Water.gl;
		var w = Water.tsize;
		var h = Water.tsize;

		var framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

		for (var i = 0; i < 2; ++i) {
			var timg = new Uint8Array(w * h * 4);
			for (var y = 0; y < h; ++y) for (var x = 0; x < w; ++x) {
				var b = (y*w+x)*4;
				timg[b] = 128;
				timg[b + 1] = 128;
				timg[b + 2] = 0;
				timg[b + 3] = 0;
			}
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, timg);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
			if (i == 0) {
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
				this.texturebuffer = texture;
			} else {
				this.texture = texture;
			}
		}

		var depthbuffer = gl.createRenderbuffer();
		//gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer);
		//gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
		//gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		//gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.framebuffer = framebuffer;
		this.depthbuffer = depthbuffer;
		this.width = w;
		this.height = h;
	}

	function destroy() : void {
		var gl = Water.gl;

		gl.deleteFramebuffer(this.framebuffer);
		gl.deleteTexture(this.texturebuffer);
		gl.deleteRenderbuffer(this.depthbuffer);

		gl.deleteTexture(this.texture);
	}

	function step(t:number) : void {
		if (!this._next_step_time) this._next_step_time = t;
		if (t < this._next_step_time) return;
		this._next_step_time += Water.time_step;
		if (this._next_step_time < t) this._next_step_time = t;

		var gl = Water.gl;

		// get viewport
		//var vp = gl.getParameter(gl.VIEWPORT) as Int32Array;
		// XXX: workaround fod Firefox
		var vp = null:Int32Array;
		var tmp_vp = gl.getParameter(gl.VIEWPORT);
		if (tmp_vp instanceof Int32Array) {
			vp = tmp_vp as __noconvert__ Int32Array;
		} else {
			vp = new Int32Array(tmp_vp as __noconvert__ Array.<int>);
		}

		gl.disable(gl.BLEND);
		gl.disable(gl.DEPTH_TEST);

		this._step(Water.progDisp);  // displacement step
		this._step(Water.progVelo); // velocity step

		// restore viewport
		gl.viewport(vp[0], vp[1], vp[2], vp[3]);
		gl.enable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);

		// reset down pos
		if (this._ir > 0) this._ir = 0;
	}
	function _step(prog:WebGLProgram) : void {
		var gl = Water.gl;
		var vloc = gl.getAttribLocation(prog, 'vertex');

		// draw begin
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.viewport(0, 0, this.width, this.height);

		gl.useProgram(prog);

		var impLoc = gl.getUniformLocation(prog, 'impulse');
		if (impLoc) {
			gl.uniform4f(impLoc, this._ix, this._iy, this._iz, this._ir);
		}

		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'projectionMatrix'), false, new M44().setOrtho(0, 1, 0, 1, -1, 1).array());
		gl.uniform2f(gl.getUniformLocation(prog, 'sampleStep'), 1/this.width, 1/this.height);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.bindBuffer(gl.ARRAY_BUFFER, Water.vbuf);
		gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vloc);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.disableVertexAttribArray(vloc);
		gl.bindTexture(gl.TEXTURE_2D, null);

		// draw end
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// swap textures
		var tmpTex = this.texturebuffer;
		this.texturebuffer = this.texture;
		this.texture = tmpTex;
	}

	function debugDraw() : void {
		var gl = Water.gl;
		var prog = Water.progDisp;
		var vloc = gl.getAttribLocation(prog, 'vertex');

		gl.useProgram(prog);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'projectionMatrix'), false, new M44().setOrtho(0, 1, 0, 1, -1, 1).array());
		gl.uniform2f(gl.getUniformLocation(prog, 'sampleStep'), 1/this.width, 1/this.height);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.bindBuffer(gl.ARRAY_BUFFER, Water.vbuf);
		gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vloc);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.disableVertexAttribArray(vloc);
	}

	function draw(projMat:M44, viewMat:M44, bgTex:WebGLTexture, w:number, h:number) : void {
		var gl = Water.gl;
		var prog = Water.drawProg;
		var vloc = gl.getAttribLocation(prog, 'vertex');
		var tloc = gl.getAttribLocation(prog, 'texcoord');

		gl.useProgram(prog);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'projectionMatrix'), false, projMat.array());
		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'modelviewMatrix'), false, viewMat.array());
		gl.uniform2f(gl.getUniformLocation(prog, 'texSize'), w, h);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(gl.getUniformLocation(prog, 'waveTexture'), 1);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, bgTex);
		gl.uniform1i(gl.getUniformLocation(prog, 'bgTexture'), 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, Water.drawVBuf);
		gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vloc);
		gl.bindBuffer(gl.ARRAY_BUFFER, Water.drawTBuf);
		gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(tloc);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.disableVertexAttribArray(vloc);
		gl.disableVertexAttribArray(tloc);
	}


	function setImpulse(x:number, y:number, r:number, z:number) : void {
		this._ix = x;
		this._iy = y;
		this._ir = r;
		this._iz = z;
	}
}
