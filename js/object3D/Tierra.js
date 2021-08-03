import { Cubo } from "./Cubo.js";
import { type } from "./Extrusion.js";

export class Tierra {
  constructor(_gl, _glPrograms, _projMatrix, _dibGeo, textures, camera) {
    this.glHelper = {
      gl: _gl,
      glProgram: _glPrograms,
      projMatrix: _projMatrix,
      dibGeo: _dibGeo,
      camera: camera,
    };
    this.textures = textures;
    let silverBlue = [0.5, 0.5, 0.6, 1];

    let texturasTierra = [
      this.textures.tierra,

      this.textures.pasto,
      this.textures.roca,
    ];
    this.tierra = new Cubo(100, 100, this.glHelper, silverBlue);
    this.tierra.setTexture(texturasTierra, true);
  }

  draw(viewMatrix) {
    let identidad = glMatrix.mat4.create();
    glMatrix.mat4.translate(identidad, identidad, [0, -0.5 - 100, 0]);
    this.tierra.drawFrom(true, viewMatrix, identidad, type.NOISE);
  }
}
