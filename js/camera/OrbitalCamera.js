const type = {
  COLOR: "color",
  TEXTURE: "texture",
  NOISE: "noise",
  SKY: "sky",
  WINDOW: "window",
};

export class OrbitalCamera {
  constructor(canvas, glHelper) {
    this.glHelper = glHelper;

    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseDown = false;
    this.radius = 2;
    this.phi = 0;
    this.theta = Math.PI / 2;
    this.moveSpeed = 0.025;
    this.zoomSpeed = 0.025;

    this.viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.identity(this.viewMatrix);

    this.position = [0, 0, -0];
    this.up_vector = [0, 1, 0];
    this.target = [0, 0.5, 0];

    this.setEventListeners(canvas);
    this._updateCamera();
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  getPosition() {
    return this.position;
  }

  setEventListeners(canvas) {
    window.onkeydown = (event) => {
      if (event.keyCode == 57) {
        // zoom in 9
        this.radius -= this.zoomSpeed;
        this._updateCamera();
      }

      if (event.keyCode == 48) {
        // zoom out 0
        this.radius += this.zoomSpeed;
        this._updateCamera();
      }
    };

    canvas.onmousedown = (event) => {
      this.mouseDown = true;
    };

    canvas.onmouseup = (event) => {
      this.mouseDown = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
    };

    canvas.onmousemove = (event) => {
      if (this.mouseDown) {
        var delta_X = 0;
        var delta_Y = 0;

        if (this.lastMouseX) delta_X = mouse.x - this.lastMouseX;
        if (this.lastMouseY) delta_Y = mouse.y - this.lastMouseY;

        this.lastMouseX = mouse.x;
        this.lastMouseY = mouse.y;

        this.phi = this.phi - delta_X * this.moveSpeed;
        this.theta = this.theta - delta_Y * this.moveSpeed;

        this._updateCamera();
      }
    };
  }

  update() {}

  // private
  _updateCamera() {
    var x = this.radius * Math.sin(this.theta) * Math.sin(this.phi);
    var y = this.radius * Math.cos(this.theta);
    var z = this.radius * Math.sin(this.theta) * Math.cos(this.phi);

    this.position = [x, y, z];

    glMatrix.mat4.lookAt(
      this.viewMatrix,
      this.position,
      this.target,
      this.up_vector
    );

    /*this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[type.COLOR].viewPos,
      this.position
    );
    this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[type.TEXTURE].viewPos,
      this.position
    );
    this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[type.NOISE].viewPos,
      this.position
    );
    this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[type.WINDOW].viewPos,
      this.position
    );*/
  }
}
