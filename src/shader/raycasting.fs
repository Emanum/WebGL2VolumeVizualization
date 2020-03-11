// #version 300 es
precision mediump float;

uniform sampler2D frontFaces;
uniform sampler2D backFaces;
//uniform sampler3D volume;

uniform int renderingMode;

varying vec2 v_texCoord;
// out vec4 fragColor;

void main() {
  int marchingStepDivider = 500;
	vec4 rayStart = texture2D(frontFaces, vec2(v_texCoord.s, v_texCoord.t));
	vec4 rayEnd = texture2D(backFaces, vec2(v_texCoord.s, v_texCoord.t));


  gl_FragColor = vec4(v_texCoord.s,v_texCoord.t,0,1);
  //gl_FragColor = rayEnd;// texture is empty

  /*switch(renderingMode){
    default: //render front faces
      fragColor = rayStart;
  }*/
}
