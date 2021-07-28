import { Extrusion } from "./Extrusion.js";

export class Cubo extends Extrusion {
  constructor(lado1, lado2, _glHelper, _color, lado3 = lado1) {
    super(_glHelper, _color);

    this.vertices = [
      [-0.5, 0, -0.5, 1],
      [-0.5, 0, -0.5, 1],

      [-0.5, 0, 0.5, 1],
      [-0.5, 0, 0.5, 1],

      [0.5, 0, 0.5, 1],
      [0.5, 0, 0.5, 1],

      [0.5, 0, -0.5, 1],
      [0.5, 0, -0.5, 1],
    ];

    this.normales = [
      [0, 0, -1, 1],
      [-1, 0, 0, 1],

      [-1, 0, 0, 1],
      [0, 0, 1, 1],

      [0, 0, 1, 1],
      [1, 0, 0, 1],

      [1, 0, 0, 1],
      [0, 0, -1, 1],
    ];
    this.matrixes = [
      [lado1, 0, 0, 0, 0, 1, 0, 0, 0, 0, lado3, 0, 0, 0, 0, 1],
      [lado1, 0, 0, 0, 0, 1, 0, 0, 0, 0, lado3, 0, 0, lado2, 0, 1],
    ];
  }

  definirMatrix(matrixes) {
    this.matrixes = matrixes;
  }

  definirVertices(vertices) {
    this.vertices = vertices;
  }

  definirNormales(normales) {
    this.normales = normales;
  }

  getVertice(u) {
    let columnas = this.getColumnas();
    let delta = 1.0 / columnas;
    let index = (u / delta) % columnas;
    return glMatrix.vec4.clone(this.vertices[index]);
  }

  getColumnas() {
    return this.vertices.length;
  }

  getNormal(u) {
    let columnas = this.getColumnas();
    let delta = 1.0 / columnas; // 1/11 (con paso delta=0.1)
    let index = (u / delta) % columnas;
    return glMatrix.vec4.clone(
      this.normales != undefined ? this.normales[index] : [0, 0, 0]
    );
  }
}
