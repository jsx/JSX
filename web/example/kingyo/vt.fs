precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D texture;

void main() {
	gl_FragColor = texture2D(texture, v_texcoord);
	//if (gl_FragColor.a <= 0.0) discard;
}
