precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D texture;
uniform vec2 sampleStep;
uniform vec4 impulse;

void main() {
	float M = 1.0 / 255.0;

	// r,b=displacement, g,a=velocity
	vec4 tl = texture2D(texture, v_texcoord + vec2(-sampleStep.x, 0.0));
	float dl = tl.r + tl.b * M;
	float vl = tl.g + tl.a * M;
	vec4 tr = texture2D(texture, v_texcoord + vec2(sampleStep.x, 0.0));
	float dr = tr.r + tr.b * M;
	float vr = tr.g + tr.a * M;
	vec4 td = texture2D(texture, v_texcoord + vec2(0.0, -sampleStep.y));
	float dd = td.r + td.b * M;
	float vd = td.g + td.a * M;
	vec4 tu = texture2D(texture, v_texcoord + vec2(0.0, sampleStep.y));
	float du = tu.r + tu.b * M;
	float vu = tu.g + tu.a * M;
	vec4 tc = texture2D(texture, v_texcoord);
	float dc = tc.r + tc.b * M;
	float vc = tc.g + tc.a * M;

	float d = dc;
	float v =
		length(impulse.xy - v_texcoord) < impulse.w ?
			0.5:
			(vc-0.5 + (dl + dr + dd + du - dc * 4.0) * 0.5 + (0.5-dc)*0.01) * 0.99 + 0.5;

	//float d0 = d;
	//float d2 = d0 - mod(d0, 1.0/256.0);
	//float d3 = fract(d0*256.0);
	//float d4 = d2 + d3*1.0/256.0;

	gl_FragColor.r = d - mod(d, M);
	gl_FragColor.g = v - mod(v, M);
	gl_FragColor.b = fract(d * 255.0);
	gl_FragColor.a = fract(v * 255.0);
}
