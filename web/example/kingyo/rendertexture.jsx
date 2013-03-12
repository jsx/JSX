import 'js/web.jsx';
import 'mvq.jsx';
import 'webgl-util.jsx';

class RenderTexture {
	static var gl = null:WebGLRenderingContext;

	static function initWithGL(gl:WebGLRenderingContext) : void {
		RenderTexture.gl = gl;
	}

	var framebuffer = null:WebGLFramebuffer;
	var texturebuffer = null:WebGLTexture;
	var depthbuffer = null:WebGLRenderbuffer;
	var width = 0;
	var height = 0;
	var _viewport = null:Int32Array;

	function constructor(w:int, h:int) {
		var gl = RenderTexture.gl;

		var framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

		var texturebuffer = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texturebuffer);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(w * h * 4));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texturebuffer, 0);

		var depthbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.framebuffer = framebuffer;
		this.texturebuffer = texturebuffer;
		this.depthbuffer = depthbuffer;
		this.width = w;
		this.height = h;
	}

	function destroy() : void {
		var gl = RenderTexture.gl;

		gl.deleteFramebuffer(this.framebuffer);
		gl.deleteTexture(this.texturebuffer);
		gl.deleteRenderbuffer(this.depthbuffer);
	}

	function begin() : void {
		var gl = RenderTexture.gl;

		//this._viewport = gl.getParameter(gl.VIEWPORT) as Int32Array;
		// XXX: workaround fod Firefox
		this._viewport = null;
		var tmp_vp = gl.getParameter(gl.VIEWPORT);
		if (tmp_vp instanceof Int32Array) {
			this._viewport = tmp_vp as __noconvert__ Int32Array;
		} else {
			this._viewport = new Int32Array(tmp_vp as __noconvert__ Array.<int>);
		}

		// draw begin
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.viewport(0, 0, this.width, this.height);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}

	function end() : void {
		var gl = RenderTexture.gl;

		// draw end
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		var vp = this._viewport;
		gl.viewport(vp[0], vp[1], vp[2], vp[3]);
	}

	function texture() : WebGLTexture {
		return this.texturebuffer;
	}

}
