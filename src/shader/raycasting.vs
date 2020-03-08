#version 300 es
in vec3 vertex;
out vec2 texCoord;

void main() {
  texCoord = vec2(vertex.x,vertex.y);
  gl_Position = vec4(vertex,1);
}
