function loadShaderSrc(vertexElemId, vertexShaderPath) {
  var script_tag = document.createElement('script');
  script_tag.id = vertexElemId;
  script_tag.type = 'notjs';
  script_tag.text = readTextFile(vertexShaderPath);
  document.body.appendChild(script_tag);
}

function initApplication() {
  "use strict";
  let cubeProgram = new SimpleCubeOwnCamera(document.querySelector("#mainCanvas") );
  requestAnimationFrame((time)=>cubeProgram.renderCube(time));//https://stackoverflow.com/questions/28908999/use-requestanimationframe-in-a-class
}
