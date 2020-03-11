attribute vec4 position;

/* #version 300 es
in vec3 vertex;
out vec2 texCoord; */

varying vec2 v_texCoord;

void main() {
  v_texCoord = vec2(position.x,position.y);
  gl_Position = position;
}
