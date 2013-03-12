precision mediump float;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_texcoord;
uniform vec3 color;
uniform vec3 color2;
uniform vec4 color2pos;
uniform vec4 lightPosition;

void main(void) {
	vec3 n = normalize(gl_FrontFacing ? v_normal : -v_normal);
	float d = dot(n, normalize(lightPosition.xyz - v_position * lightPosition.w));
	float l = length(v_texcoord - color2pos.xyz);
	vec3 col = (l < color2pos.w || l > color2pos.w * 2.0 ? color2 : color) + d * 0.3;
	gl_FragColor = vec4(col, 1.0);
}
