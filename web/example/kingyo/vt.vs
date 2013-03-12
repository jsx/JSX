precision mediump float;
uniform mat4 projectionMatrix;
uniform mat4 modelviewMatrix;
attribute vec2 vertex;
attribute vec2 texcoord;
varying vec2 v_texcoord;

void main() {
	v_texcoord = texcoord;
	gl_Position = projectionMatrix * modelviewMatrix * vec4(vertex, 0.0, 1.0);
}
