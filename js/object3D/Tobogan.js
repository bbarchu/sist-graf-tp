import { FormaConCurva } from "./FormaConCurva.js";
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
    };

    this.dibujadorBezier = new DibujadorBezierCuadratico();
    this.dibujadorBezierCubico = new DibujadorBezierCubico();

    this.tramo = new FormaConCurva(
      this._inicializarCurvaTobogan(),
      1,
      this.glHelper,
      this.colors.grey
    );

    this._inicializarRecorridoTobogan();
  }

  draw(viewMatrix) {
    let identidad = glMatrix.mat4.create();
    //glMatrix.mat4.translate(identidad, identidad, [5, -60, -0]);
    this.tramo.drawFrom(false, viewMatrix, identidad);
  }

  _inicializarCurvaTobogan() {
    return this.dibujadorBezierCubico.getVertices([
      [-0.5, 0],
      [-0.5, 0.67],
      [0.5, 0.67],
      [0.55, 0],
    ]);
  }

  _inicializarRecorridoTobogan() {
    let puntosDeControl = [
      [-0.5, 0],
      [-0.5, 0.67],
      [0.5, 0.67],
      [0.55, 0],
    ];

    let vertices = this.dibujadorBezier.getVertices(puntosDeControl);

    let derivadas = this.dibujadorBezier.getDerivadas(puntosDeControl);

    let normales = this.dibujadorBezier.getNormales(derivadas);

    let matrixes = [];

    derivadas.forEach((d, i) =>
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
        0,
        vertices[i][2],
        1,
      ])
    );

    this.tramo.definirMatrix(matrixes);
  }
}
