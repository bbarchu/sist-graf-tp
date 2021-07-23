import { FormaExtensible } from "./FormaExtensible.js";
import { Cubo } from "./Cubo.js";
import { DibujadorBezierCuadratico } from "../helper/DibujadorBezierCuadratico.js";
import { DibujadorBezierCubico } from "../helper/DibujadorBezierCubico.js";

export class Tobogan {
  constructor(_gl, _glProgram, _projMatrix, _dibGeo) {
    this.glHelper = {
      gl: _gl,
      glProgram: _glProgram,
      projMatrix: _projMatrix,
      dibGeo: _dibGeo,
    };

    this.colors = {
      yellow: [0.7, 0.7, 0.0, 1.0],
      grey: [0.5, 0.5, 0.5, 1],
      brown: [0.5, 0.2, 0, 1],
      silverBlue: [0.5, 0.5, 0.6, 1],
      white: [1, 1, 1, 1],
      transparent: [0, 0.5, 0.7, 1],
      orange: [1, 0.7, 0, 1],
    };

    this.tramos = 4;

    this.dibujadorBezier = new DibujadorBezierCuadratico();
    this.dibujadorBezierCubico = new DibujadorBezierCubico();

    this.tramo = new FormaExtensible(
      this._inicializarCurvaTobogan(),
      this._inicializarRecorridoTobogan(),
      this.glHelper,
      this.colors.orange
    );
  }

  setTramos(tramos) {
    this.tramos = tramos;
  }

  draw(viewMatrix) {
    let identidad = glMatrix.mat4.create();
    glMatrix.mat4.scale(identidad, identidad, [0.1, 0.1, 0.1]);
    glMatrix.mat4.translate(identidad, identidad, [5, -6, -0]);
    //glMatrix.mat4.rotate(identidad, identidad, Math.PI, [0, 0, 1]);

    const alturaTramo = 10 * 0.05;

    for (let t = 0; t < this.tramos; t++) {
      this.tramo.drawFrom(false, viewMatrix, identidad);
      glMatrix.mat4.translate(identidad, identidad, [0, alturaTramo, 0]);
    }
  }

  _inicializarCurvaTobogan() {
    return this.dibujadorBezierCubico.getVertices([
      [-0.4, 0],
      [-0.4, -0.2],
      [0.4, -0.2],
      [0.4, 0],
    ]);
  }

  _inicializarRecorridoTobogan() {
    let puntosDeControl = [
      [0.1, -0.1],
      [-0.1, -0.1],
      [-0.2, -0.1],
      [-0.3, -0.1],
      [-0.3, 0],
      [-0.3, 0.1],
      [-0.2, 0.1],
      [-0.1, 0.1],
      [0.1, 0.1],
      [0.3, 0.1],
      [0.3, 0],
      [0.3, -0.1],
      [0.2, -0.1],
    ];

    let vertices = this.dibujadorBezier.getVerticesConTramos(puntosDeControl);

    let derivadas = this.dibujadorBezier.getDerivadasConTramos(puntosDeControl);

    let normales = this.dibujadorBezier.getNormales(derivadas);

    let matrixes = [];

    let j = 0;

    derivadas.forEach((d, i) => {
      if (i % 11 != 0) {
        j += 0.01;
      }

      matrixes.push([
        normales[i][0],
        normales[i][1],
        normales[i][2],
        0,
        0,
        1,
        0,
        0,
        d[0],
        d[1],
        d[2],
        0,
        vertices[i][0],
        j,
        vertices[i][2],
        1,
      ]);
    });

    return matrixes;
  }
}
