#version 300 es
uniform mat4 mvMatrix;
uniform mat4 projMatrix;

in vec3 v_position;
in vec3 v_texCoord;

out vec3 texCoordVar;

void main()
{
   texCoordVar=v_texCoord;
   gl_Position=projMatrix*mvMatrix*vec4(v_position,1);
}
