class VolumeVis2{

  constructor(canvas,gl) {
    var vertexShaderPath = "shader/bufferPreparation.vs";
    var fragmentShaderPath = "shader/bufferPreparation.fs";
    var vertexElemId = "bufferPreparation_vs";
    var fragmentElemId = "bufferPreparation_fs";

    loadShaderSrc(vertexElemId, vertexShaderPath);
    loadShaderSrc(fragmentElemId, fragmentShaderPath);

    this.m4 = twgl.m4;
    this.gl = gl;
    this.programInfo = twgl.createProgramInfo(this.gl, ["bufferPreparation_vs", "bufferPreparation_fs"]);

    //this.inputHandler = new InputHandler(canvas,(changedScroll)=>this.scroll_event(changedScroll));
    document.addEventListener("keydown",(e)=>this.dealWithKeyboard(e),false);
    document.addEventListener("keyup",(e)=>this.dealWithKeyboard(e),false);
    document.addEventListener("keypress",(e)=>this.dealWithKeyboard(e),false);

    this.camera = new PolarCoordinateCamera(this.gl,[0,0,0],5.0,90.0,60.0);

    this.initCube();

    this.uniforms = {};//init uniforms array
  }

  initCube() {
    this.cube_vertices = [
      // front
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      // back
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      -1.0, 1.0, -1.0,
    ];

    this.cube_tex_coordinates = [
      // front
      0.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      // back
      0.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
    ];

    this.cube_elements = [
      // front
      0, 1, 2,
      2, 3, 0,
      // top
      1, 5, 6,
      6, 2, 1,
      // back
      7, 6, 5,
      5, 4, 7,
      // bottom
      4, 0, 3,
      3, 7, 4,
      // left
      4, 5, 1,
      1, 0, 4,
      // right
      3, 2, 6,
      6, 7, 3];

    this.quad_vertices = [
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0
    ];

    this.quad_elements = [
      0, 1, 2,
      0, 2, 3
    ];

    this.arrays = {
      position: {numComponents: 3,data:this.cube_vertices},
      texcoord: {numComponents: 3,data:this.cube_tex_coordinates},
      indices:  {numComponents: 3,data:this.cube_elements},
    };

    this.cubeBufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);
    twgl.drawBufferInfo
  }

  dealWithKeyboard(event){
    switch (event.key) {
      case '-':
        this.camera.zoom(0.1);
        break;
      case '+':
        this.camera.zoom(-0.1);
        break;
      case 'ArrowDown':
        this.camera.rotatePolar(0.1);
        break;
      case 'ArrowUp':
        this.camera.rotatePolar(-0.1);
        break;
      case 'ArrowLeft':
        this.camera.rotateAzimuthal(-0.1);
        break;
      case 'ArrowRight':
        this.camera.rotateAzimuthal(0.1);
        break;
    }
  }

  renderCube(time){
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.uniforms.u_worldViewProjection = this.camera.getViewProjectionMatrix();

    this.gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.cubeBufferInfo);
    twgl.setUniforms(this.programInfo, this.uniforms);
    this.gl.drawElements(this.gl.TRIANGLES, this.cubeBufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame((time)=>this.renderCube(time));
  }

}





