import { FormaExtensible } from "./FormaExtensible.js";
import { Cubo } from "./Cubo.js";
import { DibujadorBezierCuadratico } from "../helper/DibujadorBezierCuadratico.js";
import { DibujadorBezierCubico } from "../helper/DibujadorBezierCubico.js";
import { FormaConCurva } from "./FormaConCurva.js";
import { type as typeGlProgram } from "./Extrusion.js";

export class Tobogan {
  constructor(_gl, _glPrograms, _projMatrix, _dibGeo, _textures, camera) {
    this.glHelper = {
      gl: _gl,
      glProgram: _glPrograms,
      projMatrix: _projMatrix,
      dibGeo: _dibGeo,
      camera: camera,
    };

    this.textures = _textures;

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
    this.anchoEdificio = 4;
    this.largoEdificio = 4;

    this.dibujadorBezier = new DibujadorBezierCuadratico();
    this.dibujadorBezierCubico = new DibujadorBezierCubico();

    this.tramo = new FormaExtensible(
      this._inicializarCurvaTobogan(),
      this._inicializarRecorridoTobogan(),
      this.glHelper,
      this.colors.orange,
      this._inicializarNormalesTobogan()
    );

    this.alturaTramo = 0.6;

    this.cano = new FormaConCurva(
      this.inicializarCurvaCano(),
      this.alturaTramo * this.tramos,
      this.glHelper,
      this.colors.grey
    );
    this.cano.setTexture(this.textures.concrete, true);
  }

  setTramos(tramos, anchoEdificio, largoEdificio) {
    this.tramos = tramos;
    this.anchoEdificio = anchoEdificio;
    this.largoEdificio = largoEdificio;

    this.cano = new FormaConCurva(
      this.inicializarCurvaCano(),
      this.alturaTramo * this.tramos,
      this.glHelper,
      this.colors.grey
    );
    this.cano.setTexture(this.textures.concrete, true);
  }

  draw(viewMatrix) {
    let identidad = glMatrix.mat4.create();
    glMatrix.mat4.scale(identidad, identidad, [0.1, 0.1, 0.1]);
    glMatrix.mat4.translate(identidad, identidad, [
      2.5 + this.largoEdificio * 0.3,
      0,
      -0,
    ]);
    //glMatrix.mat4.rotate(identidad, identidad, Math.PI, [0, 0, 1]);

    let canoMatrix = glMatrix.mat4.clone(identidad);
    glMatrix.mat4.scale(canoMatrix, canoMatrix, [0.1, 1, 0.1]);
    glMatrix.mat4.translate(canoMatrix, canoMatrix, [0, 0, -1]);
    this.cano.drawFrom(true, viewMatrix, canoMatrix, typeGlProgram.TEXTURE);
    glMatrix.mat4.translate(canoMatrix, canoMatrix, [0, 0, 2]);
    this.cano.drawFrom(true, viewMatrix, canoMatrix, typeGlProgram.TEXTURE);

    glMatrix.mat4.translate(identidad, identidad, [0, 0.2, 0]);

    for (let t = 0; t < this.tramos; t++) {
      this.tramo.drawFrom(false, viewMatrix, identidad);
      glMatrix.mat4.translate(identidad, identidad, [0, this.alturaTramo, 0]);
    }
  }

  _inicializarCurvaTobogan() {
    return this.dibujadorBezierCubico.getVerticesConTramos([
      [-0.12, 0],
      [-0.12, -0.2],
      [0.12, -0.2],
      [0.12, 0],
      [0.1 - 0.2],
      [-0.1, -0.2],
      [-0.12, 0],
    ]);
  }

  _inicializarNormalesTobogan() {
    let derivadas = this.dibujadorBezierCubico.getDerivadasConTramos([
      [-0.12, 0],
      [-0.12, -0.2],
      [0.12, -0.2],
      [0.12, 0],
      [0.1 - 0.2],
      [-0.1, -0.2],
      [-0.12, 0],
    ]);
    return this.dibujadorBezierCubico.getNormales(derivadas);
  }

  _inicializarRecorridoTobogan() {
    let puntosDeControl = [
      [-0.3, 0.2],
      [-0.3, 0.0],
      [-0.3, -0.2],
      [-0.3, -0.4],
      [0, -0.4],
      [0.3, -0.4],
      [0.3, -0.2],
      [0.3, 0.0],
      [0.3, 0.2],
      [0.3, 0.4],
      [0, 0.4],
      [-0.3, 0.4],
      [-0.3, 0.2],
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

  inicializarCurvaCano() {
    let tramo1 = this.dibujadorBezierCubico.getVertices([
      [-0.5, 0],
      [-0.5, 0.67],
      [0.5, 0.67],
      [0.55, 0],
    ]);
    let tramo2 = this.dibujadorBezierCubico.getVertices([
      [-0.5, 0],
      [-0.5, -0.67],
      [0.5, -0.67],
      [0.55, 0],
    ]);
    return tramo1.concat(tramo2);
  }
}
