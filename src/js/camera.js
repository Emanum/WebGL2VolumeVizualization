class PolarCoordinateCamera {
  constructor(webGlContext,centerPosition,distance,azimuthalAngle, polarAngle){
    //init Framework
    this.m4 = twgl.m4;

    this.gl = webGlContext;
    this.centerPos = centerPosition;
    this.azimuthalAngle = azimuthalAngle;
    this.distance = distance;
    this.polarAngle = polarAngle;

    //calculate projectionMatrix only one time at startup
    const fov = 30 * Math.PI / 180;
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 50;
    this.projection = this.m4.perspective(fov, aspect, zNear, zFar);

    this.up = [0, 1, 0];

    this.camera;
    this.view;
    this.viewProj;
    this.updateMatrices();
  }

  zoom(radiusChanged){
    this.distance += radiusChanged;
    this.updateMatrices();
  }

  rotatePolar(polarAngleChanged){
    this.polarAngle += polarAngleChanged;
    if(this.polarAngle < 0.1){
      this.polarAngle = 0.1;
    }
    if(this.polarAngle > Math.PI - 0.1){
      this.polarAngle = Math.PI - 0.1;
    }
    this.updateMatrices();
  }

  rotateAzimuthal(azimuthalAngleChanged){
    this.azimuthalAngle += azimuthalAngleChanged;
    this.updateMatrices();
  }

  updateMatrices(){
    //currently projMatrix is static

    //calcutate Pos in normal System https://en.wikipedia.org/wiki/Spherical_coordinate_system#Coordinate_system_conversrions
    const z = this.distance * Math.cos(this.azimuthalAngle) * Math.sin(this.polarAngle);
    const x = this.distance * Math.sin(this.azimuthalAngle) * Math.sin(this.polarAngle);
    const y = this.distance * Math.cos(this.polarAngle);

    this.camera = this.m4.lookAt([x,y,z],this.centerPos,this.up);
    this.view = this.m4.inverse(this.camera);
    this.viewProjection = this.m4.multiply(this.projection, this.view);
  }

  getViewProjectionMatrix(){
    return this.viewProjection;
  }

  getViewMatrix(){
    return this.view;
  }

  getViewInverseMatrix(){
    return this.camera;
  }

}
