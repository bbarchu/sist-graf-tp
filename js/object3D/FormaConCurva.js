import { Extrusion } from "./Extrusion.js";
export class FormaConCurva extends Extrusion {
  constructor(verticesDeCurva, alto, _glHelper, _color, normales) {
    super(_glHelper, _color);

    this.normales = normales;
    this.vertices = verticesDeCurva; //lista de listas
    this.matrixes = [
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, alto, 0, 1],
    ];

    this.calculateAcumuladoVertices();
    this.calculateAcumuladoMatrixes();
  }

  definirMatrix(matrixes) {
    this.matrixes = matrixes;
    this.calculateAcumuladoMatrixes();
  }

  definirVertices(vertices) {
    this.vertices = vertices;

    this.calculateAcumuladoVertices();
  }

  getVertice(u) {
    let index = this.getIndexVertice(u);
    return glMatrix.vec4.clone(this.vertices[index]);
  }

  getColumnas() {
    return this.vertices.length - 1;
  }

  getNormal(u) {
    let index = this.getIndexVertice(u);
    return glMatrix.vec4.clone(
      this.normales != undefined ? this.normales[index] : [0, 0, 0]
    );
  }
}
