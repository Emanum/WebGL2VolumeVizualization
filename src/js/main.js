function loadShaderSrc(vertexElemId, vertexShaderPath) {
  var script_tag = document.createElement('script');
  script_tag.id = vertexElemId;
  script_tag.type = 'notjs';
  script_tag.text = readTextFile(vertexShaderPath);
  document.body.appendChild(script_tag);
}

function initApplication() {
  "use strict";
  let gl = document.querySelector("#mainCanvas").getContext("webgl2");
  if(!gl){
    document.querySelector("#no-webgl2").style.display = "";
    return;
  }
  let volumeVis = new VolumeVis(document.querySelector("#mainCanvas"),gl);
  requestAnimationFrame((time)=>volumeVis.renderCube(time));//https://stackoverflow.com/questions/28908999/use-requestanimationframe-in-a-class
}
