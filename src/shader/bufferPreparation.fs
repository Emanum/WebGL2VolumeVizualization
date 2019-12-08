#version 300 es
precision mediump float;
in vec3 texCoordVar;

out vec4 outcolor;

void main()
{
   outcolor=vec4(texCoordVar,1);
   outcolor=vec4(1,1,0,1);
}
