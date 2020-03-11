class VolumeVis2{

  constructor(canvas,gl) {
    this.m4 = twgl.m4;
    this.gl = gl;

    this.loadPreperationShaderProgram();
    this.loadRaycastingShaderProgram();

    //create Framebuffer, for Front and Backface
    var imageAttachment = [{
      format: twgl.RGBA,
      type: twgl.UNSIGNED_BYTE,
      min: twgl.LINEAR,
      wrap: twgl.CLAMP_TO_EDGE
    }];
    this.fboFrontFaces = twgl.createFramebufferInfo(this.gl,imageAttachment);
    this.fboBackFaces = twgl.createFramebufferInfo(this.gl,imageAttachment);
    twgl.bindFramebufferInfo(this.gl);//bind canvas (back) after creating Framebuffers
    //https://webglfundamentals.org/webgl/lessons/webgl-render-to-texture.html

    //this.inputHandler = new InputHandler(canvas,(changedScroll)=>this.scroll_event(changedScroll));
    document.addEventListener("keydown",(e)=>this.dealWithKeyboard(e),false);
    document.addEventListener("keyup",(e)=>this.dealWithKeyboard(e),false);
    document.addEventListener("keypress",(e)=>this.dealWithKeyboard(e),false);

    this.camera = new PolarCoordinateCamera(this.gl,[0,0,0],5.0,90.0,60.0);

    this.initCube();

    this.cubeShaderUniforms = {};//init uniforms array
    this.raycastingShaderUniforms = {};//init uniforms array

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
  }

  renderCube(time){
    //usual/common resets per frame
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    //draw to cubeShader
    this.gl.useProgram(this.cubePreperationProgramInfo.program);
    this.cubeShaderUniforms.u_worldViewProjection = this.camera.getViewProjectionMatrix();
    twgl.setUniforms(this.cubePreperationProgramInfo, this.cubeShaderUniforms);
    twgl.setBuffersAndAttributes(this.gl, this.cubePreperationProgramInfo, this.cubeBufferInfo);
      // draw FrontFaces
      twgl.bindFramebufferInfo(this.gl,this.fboFrontFaces);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.cullFace(this.gl.BACK);
      this.gl.drawElements(this.gl.TRIANGLES, this.cubeBufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

      //draw BackFaces
      // twgl.bindFramebufferInfo(this.gl,this.fboFrontFaces);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.cullFace(this.gl.FRONT);
      this.gl.drawElements(this.gl.TRIANGLES, this.cubeBufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

    //draw to raycasting shader
    this.gl.useProgram(this.raycastingProgramInfo.program);
    twgl.bindFramebufferInfo(this.gl);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.cullFace(this.gl.BACK);
    twgl.setBuffersAndAttributes(this.gl, this.raycastingProgramInfo, this.quadBufferInfo);

    //set frontFaces
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D,this.fboFrontFaces.attachments[0]);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D,this.fboBackFaces.attachments[0]);
    twgl.setUniforms(this.raycastingProgramInfo,{
      frontFaces : 0,//index for textureUnit from setActiveTexture
      backFaces : 1
    });
    //TODO: load and bind 3d texture
    this.gl.drawElements(this.gl.TRIANGLES, this.quadBufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

    //change frame
    requestAnimationFrame((time)=>this.renderCube(time));
  }

  loadPreperationShaderProgram() {
    var vertexShaderPath = "shader/bufferPreparation.vs";
    var fragmentShaderPath = "shader/bufferPreparation.fs";
    var vertexElemId = "bufferPreparation_vs";
    var fragmentElemId = "bufferPreparation_fs";
    loadShaderSrc(vertexElemId, vertexShaderPath);
    loadShaderSrc(fragmentElemId, fragmentShaderPath);
    this.cubePreperationProgramInfo = twgl.createProgramInfo(this.gl, [vertexElemId, fragmentElemId]);
  }

  loadRaycastingShaderProgram() {
    var vertexShaderPath = "shader/raycasting.vs";
    var fragmentShaderPath = "shader/raycasting.fs";
    var vertexElemId = "raycasting_vs";
    var fragmentElemId = "raycasting_fs";
    loadShaderSrc(vertexElemId, vertexShaderPath);
    loadShaderSrc(fragmentElemId, fragmentShaderPath);
    this.raycastingProgramInfo = twgl.createProgramInfo(this.gl, [vertexElemId, fragmentElemId]);
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

    //for Front and Backface(ray direction)
    var cubeInfoArray = {
      position: {numComponents: 3,data:this.cube_vertices},
      texcoord: {numComponents: 3,data:this.cube_tex_coordinates},
      indices:  {numComponents: 3,data:this.cube_elements},
    };

    //for rendering a "screen" across the window
    var quadInfoArray = {
      position: {numComponents: 3,data:this.quad_vertices},
      indices:  {numComponents: 3,data:this.quad_elements},
    };

    this.cubeBufferInfo = twgl.createBufferInfoFromArrays(this.gl, cubeInfoArray);
    this.quadBufferInfo = twgl.createBufferInfoFromArrays(this.gl, quadInfoArray);
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





