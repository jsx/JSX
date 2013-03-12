precision mediump float;
uniform mat4 projectionMatrix;
attribute vec2 vertex;
varying vec2 v_texcoord;

void main() {
	v_texcoord = vertex;
	gl_Position = projectionMatrix * vec4(vertex, 0.0, 1.0);
}
