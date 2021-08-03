import { Cubo } from "./Cubo.js";
import { type } from "./Extrusion.js";

export class Cielo {
  constructor(gl, glProgram, _projMatrix, texture) {
    this.gl = gl;
    this.glProgram = glProgram; //el q quiero
    this.projMatrix = _projMatrix;
    this.texture = texture;

    // Create a buffer for positions
    this.positionBuffer = this.gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    // Put the positions in the buffer
    this.setGeometry();
  }

  draw(_viewMatrix) {
    this.gl.useProgram(this.glProgram);

    let viewMatrix = glMatrix.mat4.clone(_viewMatrix);

    viewMatrix[12] = 0;
    viewMatrix[13] = 0;
    viewMatrix[14] = 0;

    glMatrix.mat4.multiply(viewMatrix, this.projMatrix, viewMatrix);
    glMatrix.mat4.invert(viewMatrix, viewMatrix);

    // Set the uniforms
    this.gl.uniformMatrix4fv(
      this.glProgram.projectionInverse,
      false,
      viewMatrix
    );

    // Tell the shader to use texture unit 0 for u_skybox
    this.gl.uniform1i(this.glProgram.skybox, 0);

    // let our quad pass the depth test at 1.0
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    var positionLocation = this.gl.getAttribLocation(
      this.glProgram,
      "aPosition"
    );

    var size = 2; // 2 components per iteration
    var type = this.gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 1 * 6);
  }

  setGeometry() {
    var positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }
}
