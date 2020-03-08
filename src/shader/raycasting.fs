#version 300 es
precision mediump float;

uniform sampler2D frontFaces;
uniform sampler2D backFaces;
//uniform sampler3D volume;

uniform int renderingMode;

in vec2 texCoord;
out vec4 fragColor;

void main() {
  int marchingStepDivider = 500;
	vec4 rayStart = texture(frontFaces, texCoord);
	vec4 rayEnd = texture(backFaces, texCoord);

  fragColor = vec4(1,0,0,1);

  /*switch(renderingMode){
    default: //render front faces
      fragColor = rayStart;
  }*/
}
