uniform mat4 u_worldViewProjection;

attribute vec4 position;
attribute vec3 texcoord;

varying vec3 v_texCoord;


void main() {
  v_texCoord = texcoord;
  gl_Position = u_worldViewProjection * position;
}
