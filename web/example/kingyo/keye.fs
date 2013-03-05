precision mediump float;
uniform vec3 color;
uniform vec4 lightPosition;
varying vec2 v_uv;
varying vec3 v_ec_pos;
varying vec3 v_ec_front;

void main() {
	float u = v_uv.x;
	float v = v_uv.y;
	float r2 = u * u + v * v;
	if (r2 >= 1.0) discard;
	vec3 n = normalize(vec3(u, v, sqrt(1.0 - r2)));
	float f = dot(normalize(v_ec_front), n);
	vec3 l = normalize(lightPosition.xyz - v_ec_pos * lightPosition.w);
	if (f > 0.8) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} else if (f > 0.5) {
		gl_FragColor = vec4(vec3(0.9, 0.9, 1.0) + dot(n, l) * 0.3, 1.0);
	} else {
		gl_FragColor = vec4(color + dot(n, l) * 0.3, 1.0);
	}
}
