import 'js/web.jsx';
import 'webgl-util.jsx';
import 'mvq.jsx';
import 'game.jsx';

class Poi {
	static var gl:WebGLRenderingContext;
	static var prog = null:WebGLProgram;
	static var vtbuf = null:WebGLBuffer;
	static var tex = null:WebGLTexture;
	static var texx = null:WebGLTexture;
	static function initWithGL(gl:WebGLRenderingContext) : void {
		Poi.gl = gl;
		Poi.prog = Util.getProgram('vt.vs', 'vt.fs');

		Poi.vtbuf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, Poi.vtbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([/*vertex*/-2,-6, 2,-6, 2,2, -2,2, /*texcoord*/0,0, 1,0, 1,1, 0,1]), gl.STATIC_DRAW);

		Poi.tex = Poi.loadTex('poi.png');
		Poi.texx = Poi.loadTex('poix.png');
	}
	static function loadTex(filename:string) : WebGLTexture {
		var gl = Poi.gl;

		var tex = gl.createTexture();
		var image = dom.window.document.createElement('img') as HTMLImageElement;
		image.onload = function(e:Event) : void {
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		};
		image.src = filename;

		return tex;
	}

	var _x = 0;
	var _y = 0;
	var _z = 1;
	var _down:boolean;
	var _live = true;

	function setPosition(x:number, y:number) : Poi {
		this._x = x;
		this._y = y;
		return this;
	}
	function down(d:boolean) : Poi {
		this._down = d;
		return this;
	}
	function down() : boolean {
		return this._down;
	}

	function tear(t:boolean) : Poi {
		this._live = !t;
		return this;
	}

	function tearing() : boolean {
		return !this._live;
	}

	function draw(projMat:M44, viewMat:M44) : void {
		var gl = Poi.gl;
		var prog = Poi.prog;

		gl.useProgram(prog);

		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'projectionMatrix'), false, projMat.array());
		var mvMat = new M44(viewMat).mul(new M44().setTranslation(this._x, this._y, this._z));
		if (this._down) mvMat.mul(new M44().setTranslation(0,0,-7)).mul(new M44().setRotationX(-0.1));
		gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'modelviewMatrix'), false, mvMat.array());

		gl.bindBuffer(gl.ARRAY_BUFFER, Poi.vtbuf);
		var vloc = gl.getAttribLocation(prog, 'vertex');
		var tloc = gl.getAttribLocation(prog, 'texcoord');
		gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 4*8);
		gl.enableVertexAttribArray(vloc);
		gl.enableVertexAttribArray(tloc);

		gl.bindTexture(gl.TEXTURE_2D, this._live ? Poi.tex : Poi.texx);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

		gl.disableVertexAttribArray(vloc);
		gl.disableVertexAttribArray(tloc);
	}
}
