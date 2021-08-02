import { Extrusion } from "./Extrusion.js";
export class FormaExtensible extends Extrusion {
  constructor(vertices, matrixes, _glHelper, _color) {
    super(_glHelper, _color);

    this.vertices = vertices; //lista de listas
    this.matrixes = matrixes;

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

  getPosicion(u, v) {
    let p = this.getVertice(u);
    let auxp1 = p[1];
    p[1] = p[2];
    p[2] = auxp1;

    let m = this.getMatrix(v);
    glMatrix.vec4.transformMat4(p, p, m);
    return p;
  }

  getColumnas() {
    return this.vertices.length - 1;
  }

  getNormal(u) {
    return [0, 1, 0];
  }
}
