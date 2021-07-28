export class GruaCamera {
  constructor(grua, glHelper) {
    this.glHelper = glHelper;
    this.grua = grua;
    this.viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.identity(this.viewMatrix);

    this.position = this.grua.getPositionCabina();
    this.angle = this.grua.getAngleCabina();
    this.setEventListeners();
  }

  getViewMatrix() {
    return this.viewMatrix;
  }

  getPosition() {
    return this.position;
  }

  setEventListeners() {
    window.onkeydown = (event) => {
      if (
        event.keyCode == 87 ||
        event.keyCode == 83 ||
        event.keyCode == 73 ||
        event.keyCode == 75 ||
        event.keyCode == 74 ||
        event.keyCode == 76 ||
        event.keyCode == 81 ||
        event.keyCode == 65
      ) {
        this._updateCamera();
      }
    };
  }

  update() {}

  _updateCamera() {
    let matrixCabina = this.grua.getMatrixCabina();
    //this.position = this.grua.getPositionCabina();
    let angle = this.grua.getAngleCabina();

    glMatrix.mat4.identity(this.viewMatrix);
    glMatrix.mat4.rotate(
      this.viewMatrix,
      this.viewMatrix,
      -angle + Math.PI / 2,
      [0, 1, 0]
    );
    glMatrix.mat4.translate(this.viewMatrix, this.viewMatrix, [
      -matrixCabina[12],
      -matrixCabina[13],
      -matrixCabina[14],
    ]);
    //this.viewMatrix = glMatrix.mat4.clone(matrixCabina);

    let position = [-matrixCabina[12], -matrixCabina[13], -matrixCabina[14]];
    this.glHelper.gl.uniform3fv(this.glHelper.glProgram.viewPos, position);
  }
}
