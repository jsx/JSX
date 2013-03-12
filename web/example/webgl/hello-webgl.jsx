import 'timer.jsx';
import 'js/web.jsx';

class _Main {
	static function main(args : string[]) : void {
		Hello.main();
	}
}

class Hello {

	static var gl:WebGLRenderingContext = null;
	static var program:WebGLProgram = null;
	static var tex:WebGLTexture = null;
	static var vbuf:WebGLBuffer = null;
	static var tbuf:WebGLBuffer = null;
	static var ibuf:WebGLBuffer = null;
	static var angle:number = 0;

	static function getGL(canvas : HTMLCanvasElement) : WebGLRenderingContext {
		var names = ["webgl", "experimental-webgl"];
		for (var i = 0; i < names.length; ++i) {
			var gl = canvas.getContext(names[i]) as WebGLRenderingContext;
			if (gl) {
				return gl;
			}
		}
		return null;
	}

	static function main() : void {
		var canvas = dom.id('webgl-canvas') as HTMLCanvasElement;
		var gl = Hello.getGL(canvas);

		if (gl == null) {
			dom.window.alert("This browser does not support WebGL :(");
			return;
		}

		// points of vertices
		var vertices = [
			-0.9, -0.9,
			0.9, -0.9,
			0.9, 0.9,
			-0.9, 0.9
		];

		var vbuf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		// texture coordinates of verteces
		var texcs = [
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		];
		var tbuf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcs), gl.STATIC_DRAW);
		var indices = [
			0, 1, 2,
			2, 3, 0
		];
		var ibuf = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		// shader of verteces
		var vshader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vshader, dom.id('vshader').innerHTML);
		gl.compileShader(vshader);
		var shederp = gl.getShaderParameter(vshader, gl.COMPILE_STATUS);
		if (!(gl.getShaderParameter(vshader, gl.COMPILE_STATUS) as boolean)) {
			dom.window.alert(gl.getShaderInfoLog(vshader));
			return;
		}

		// shader of fragments
		var fshader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fshader, dom.id('fshader').innerHTML);
		gl.compileShader(fshader);
		if (!(gl.getShaderParameter(fshader, gl.COMPILE_STATUS) as boolean)) {
			dom.window.alert(gl.getShaderInfoLog(fshader));
			return;
		}

		// build program
		var program = gl.createProgram();
		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.bindAttribLocation(program, 0, 'position');
		gl.bindAttribLocation(program, 1, 'color');
		gl.linkProgram(program);
		if (!(gl.getProgramParameter(program, gl.LINK_STATUS) as boolean)) {
			dom.window.alert(gl.getProgramInfoLog(program));
			return;
		}

		// texture
		var tex = gl.createTexture();
		var image = dom.window.document.createElement('img') as HTMLImageElement;
		image.onload = function(e:Event):void{
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		};
		image.src = 'teko.jpg';

		Hello.gl = gl;
		Hello.program = program;
		Hello.vbuf = vbuf;
		Hello.tbuf = tbuf;
		Hello.ibuf = ibuf;
		Timer.setInterval(Hello.draw, 30);
	}

	static function draw(): void {
		var gl = Hello.gl;
		Hello.angle -= 0.005;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.useProgram(Hello.program);
		gl.uniform1f(gl.getUniformLocation(Hello.program, 'angle'), Hello.angle);
		gl.bindBuffer(gl.ARRAY_BUFFER, Hello.vbuf);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);
		gl.bindBuffer(gl.ARRAY_BUFFER, Hello.tbuf);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(1);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Hello.ibuf);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		gl.flush();
	}

}

