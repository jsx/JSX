precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D texture;
uniform vec2 sampleStep;
uniform vec4 impulse;

void main() {
	float M = 1.0 / 255.0;

	// r,b=displacement, g,a=velocity
	vec4 tc = texture2D(texture, v_texcoord);
	float dc = tc.r + tc.b * M;
	float vc = tc.g + tc.a * M;

	float len = length(impulse.xy - v_texcoord);
	float d =
		len < impulse.w ?
			//dc + (impulse.z-0.5) * (1.0 - len / impulse.w):
			impulse.z - (dc - impulse.z) * smoothstep(0.0, impulse.w, len):
			(dc-0.5 + (vc-0.5) * 0.5) * 0.99 + 0.5;
	float v = vc;

	gl_FragColor.r = d - mod(d, M);
	gl_FragColor.g = v - mod(v, M);
	gl_FragColor.b = fract(d * 255.0);
	gl_FragColor.a = fract(v * 255.0);
}
