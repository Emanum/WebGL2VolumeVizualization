precision mediump float;

varying vec3 v_texCoord;

void main() {
  gl_FragColor = vec4(v_texCoord,1);
}
