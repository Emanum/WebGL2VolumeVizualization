class VolumeVis{

  //requires WebGL2
  constructor(canvas,gl) {
    this.loadShader();

    this.m4 = twgl.m4;
    this.gl = gl;

    this.bufferPreparationProgram = twgl.createProgramInfo(this.gl,["bufferPreparation_vs","bufferPreparation_fs"]);
    this.gl.useProgram(this.bufferPreparationProgram.program);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clearColor(0,0,0,0);

    this.initCamera();

    this.arrays = {
      position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
      normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
      texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
    };

    //init Cube which will render each frame as base for our ray casting
    this.cubeBufferInfo = twgl.createBufferInfoFromArrays(this.gl,this.arrays);
  }

  renderCube(time){
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.uniforms = {
      mvMatrix : this.camera.getViewInverseMatrix(),
      projMatrix : this.camera.getViewProjectionMatrix()
    };

    this.gl.useProgram(this.bufferPreparationProgram.program);
    twgl.setBuffersAndAttributes(this.gl, this.bufferPreparationProgram, this.cubeBufferInfo);
    twgl.setUniforms(this.bufferPreparationProgram, this.uniforms);

    this.gl.drawElements(this.gl.TRIANGLES, this.cubeBufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame((time)=>this.renderCube(time));
  }

  initCubeArrays() {
    return {
      position: [
        // front
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // back
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0
      ],
      indices: [
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
        6, 7, 3
      ],
      texcoord: [
        // front
        0.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 1.0, 1.0,
        0.0, 1.0, 1.0,
        // back
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0
      ]
    }
  }

  initCamera() {
    this.camera = new PolarCoordinateCamera(this.gl, [0, 0, 0], 5.0, 90.0, 60.0);
    document.addEventListener("keydown", (e) => this.dealWithKeyboard(e), false);
    document.addEventListener("keyup", (e) => this.dealWithKeyboard(e), false);
    document.addEventListener("keypress", (e) => this.dealWithKeyboard(e), false);
  }

  loadShader() {
    var vertexShaderPath = "shader/bufferPreparation.vs";
    var fragmentShaderPath = "shader/bufferPreparation.fs";
    var vertexElemId = "bufferPreparation_vs";
    var fragmentElemId = "bufferPreparation_fs";

    loadShaderSrc(vertexElemId, vertexShaderPath);
    loadShaderSrc(fragmentElemId, fragmentShaderPath);
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

}
