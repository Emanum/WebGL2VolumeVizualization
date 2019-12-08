class SimpleCube{

  constructor(canvasName) {
    var vertexShaderPath = "shader/cube.vs";
    var fragmentShaderPath = "shader/cube.fs";
    var vertexElemId = "cube_vs";
    var fragmentElemId = "cube_fs";

    loadShaderSrc(vertexElemId, vertexShaderPath);
    loadShaderSrc(fragmentElemId, fragmentShaderPath);

    this.m4 = twgl.m4;
    this.gl = document.querySelector("#"+canvasName).getContext("webgl");
    this.programInfo = twgl.createProgramInfo(this.gl, ["cube_vs", "cube_fs"]);

    this.arrays = {
      position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
      normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
      texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
    };

    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, this.arrays);

    this.tex = twgl.createTexture(this.gl, {
      min: this.gl.NEAREST,
      mag: this.gl.NEAREST,
      src: [
        255, 255, 255, 255,
        192, 192, 192, 255,
        192, 192, 192, 255,
        255, 255, 255, 255,
      ],
    });

    this.uniforms = {
      u_lightWorldPos: [1, 8, -10],
      u_lightColor: [1, 0.8, 0.8, 1],
      u_ambient: [0, 0, 0, 1],
      u_specular: [1, 1, 1, 1],
      u_shininess: 50,
      u_specularFactor: 1,
      u_diffuse: this.tex,
    };
  }

  renderCube(time){
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10;
    const projection = this.m4.perspective(fov, aspect, zNear, zFar);
    const eye = [1, 4, -6];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const camera = this.m4.lookAt(eye, target, up);
    const view = this.m4.inverse(camera);
    const viewProjection = this.m4.multiply(projection, view);
    const world = this.m4.rotationY(time);

    this.uniforms.u_viewInverse = camera;
    this.uniforms.u_world = world;
    this.uniforms.u_worldInverseTranspose = this.m4.transpose(this.m4.inverse(world));
    this.uniforms.u_worldViewProjection = this.m4.multiply(viewProjection, world);

    this.gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    twgl.setUniforms(this.programInfo, this.uniforms);
    this.gl.drawElements(this.gl.TRIANGLES, this.bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame((time)=>this.renderCube(time));
  }

}





