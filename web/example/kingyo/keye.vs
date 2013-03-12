precision mediump float;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float radius;
attribute vec4 position;
varying vec2 v_uv;
varying vec3 v_ec_pos;
varying vec3 v_ec_front;

void main() {
	int vnum = int(mod(position.w, 4.0));
	v_uv = vec2((vnum==0||vnum==3)?-1.0:1.0, (vnum==0||vnum==1)?-1:1);
	vec3 center = position.xyz;
	vec4 ec_center = viewMatrix * modelMatrix * vec4(center, 1);
	vec4 ec_vert = ec_center + vec4(v_uv * radius, 0, 0);
	v_ec_pos = ec_vert.xyz;
	int eyeNum = int(position.w);
	v_ec_front = (viewMatrix * modelMatrix * (eyeNum < 4 ? vec4(-1, 0, 1, 0) : vec4(1, 0, 1, 0))).xyz;
	gl_Position = projectionMatrix * ec_vert;
}
