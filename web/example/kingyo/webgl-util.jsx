import 'console.jsx';
import 'js/web.jsx';

class Util {
	static var gl:WebGLRenderingContext = null;

	static function getWebGL(canvas_id:string) : WebGLRenderingContext {
		if (Util.gl) return Util.gl;

		var canvas = dom.id(canvas_id) as HTMLCanvasElement;

		var ctx_names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
		var ctx:WebGLRenderingContext = null;

		for (var ni in ctx_names) {
			try {
				ctx = canvas.getContext(ctx_names[ni]) as WebGLRenderingContext;
			} catch (e:DOMException) {
				continue;
			}
			if (ctx) {
				Util.gl = ctx;
				break;
			}
		}
		return Util.gl;
	}

	static function getFile(url:string) : string {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		xhr.send();
		return xhr.responseText;
	}

	static function checkGLError() : void {
		var gl = Util.gl;
		var err = gl.getError();
		if (err) {
			console.error('GL ERROR! :' + err.toString());
		}
	}

	static function getShader(url:string, type:int) : WebGLShader {
		var gl = Util.gl;

		var src = Util.getFile(url);
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!(gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean)) {
			console.warn(gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	static function getProgram(vs_url:string, fs_url:string) : WebGLProgram {
		var gl = Util.gl;
		var vs = Util.getShader(vs_url, gl.VERTEX_SHADER);
		var fs = Util.getShader(fs_url, gl.FRAGMENT_SHADER);
		if (!vs || !fs) return null;

		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!(gl.getProgramParameter(program, gl.LINK_STATUS) as boolean)) {
			console.warn(gl.getProgramInfoLog(program));
			return null;
		}
		return program;
	}

	static function getUniformLocations(prog:WebGLProgram) : Map.<WebGLUniformLocation> {
		var gl = Util.gl;
		var ulocs = {}:Map.<WebGLUniformLocation>;
		for (var ui = 0, nu = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as int; ui < nu; ++ui) {
			var unif = gl.getActiveUniform(prog, ui);
			ulocs[unif.name] = gl.getUniformLocation(prog, unif.name);
		}
		return ulocs;
	}
	static function getAttribLocations(prog:WebGLProgram) : Map.<int> {
		var gl = Util.gl;
		var alocs = {}:Map.<int>;
		for (var ai = 0, na = gl.getProgramParameter(prog, gl.ACTIVE_ATTRIBUTES) as int; ai < na; ++ai) {
			var attr = gl.getActiveAttrib(prog, ai);
			alocs[attr.name] = gl.getAttribLocation(prog, attr.name);
		}
		return alocs;
	}

}
