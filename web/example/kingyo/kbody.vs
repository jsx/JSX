precision mediump float;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 vertex;
attribute vec3 normal;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_texcoord;

void main(void) {
	v_position = (viewMatrix * modelMatrix * vec4(vertex, 1.0)).xyz;
	v_normal = (viewMatrix * modelMatrix * vec4(normal, 0.0)).xyz;
	v_texcoord = vertex;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertex, 1.0);
}
