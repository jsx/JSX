precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D waveTexture;
uniform sampler2D bgTexture;
uniform vec2 texSize;

void main() {
	float d = 1.0 / 128.0;
	float M = 1.0 / 255.0;

	vec4 t0 = texture2D(waveTexture, v_texcoord + vec2(-d, 0.0));
	float h0 = t0.r + t0.b * M;
	vec4 t1 = texture2D(waveTexture, v_texcoord + vec2(d, 0.0));
	float h1 = t1.r + t1.b * M;
	vec4 t2 = texture2D(waveTexture, v_texcoord + vec2(0.0, -d));
	float h2 = t2.r + t2.b * M;
	vec4 t3 = texture2D(waveTexture, v_texcoord + vec2(0.0, d));
	float h3 = t3.r + t3.b * M;

	vec4 col = texture2D(bgTexture, gl_FragCoord.xy / texSize + vec2(h1-h0, h3-h2) * 0.25);

	//col.rgb += abs(h1-h0) + abs(h3-h2);
	float up = h2 - h3;
	if (up > 0.0) col.rgb += up * 3.0;
	//col.rg = t0.rg;

	gl_FragColor = col;
}
