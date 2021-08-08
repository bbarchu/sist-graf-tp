import { FormaConCurva } from "./FormaConCurva.js";
import { Cubo } from "./Cubo.js";
import { DibujadorBezierCubico } from "../helper/DibujadorBezierCubico.js";
import { type as typeGlProgram } from "./Extrusion.js";

export class Grua {
  constructor(_gl, _glPrograms, _projMatrix, _dibGeo, _textures) {
    this._addEventListener();

    this.glHelper = {
      gl: _gl,
      glProgram: _glPrograms,
      projMatrix: _projMatrix,
      dibGeo: _dibGeo,
    };

    this.colors = {
      yellow: [0.7, 0.7, 0.0, 1.0],
      grey: [0.5, 0.5, 0.5, 1],
      brown: [0.5, 0.2, 0, 1],
      silverBlue: [0.5, 0.5, 0.6, 1],
    };

    this.textures = _textures;

    this.speed = 0.2;
    this.estiradoG = 0;
    this.alfaBrazo = 0;
    this.speedAngulo = Math.PI / 128;
    this.speedCabina = Math.PI / 128;
    this.rotCabina = 0;
    this.contraidoColumnas = 0;
    this.speedColumnas = 0.01;

    this.dibujadorBezierCubico = new DibujadorBezierCubico();

    this.baseA = new Cubo(0.1, 0.3, this.glHelper, this.colors.yellow);
    this.baseA.setTexture(this.textures.pintura);

    this.cuboB = new Cubo(0.08, 0.3, this.glHelper, this.colors.yellow);
    this.cuboB.setTexture(this.textures.pintura);

    this.formaC = new FormaConCurva(
      this._inicializarCurvaC(),
      0.21,
      this.glHelper,
      this.colors.silverBlue,
      this._getNormales()
    );

    this.cuboD = new Cubo(0.1, 0.1, this.glHelper, this.colors.yellow);
    this.cuboD.setTexture(this.textures.pintura, true);

    this.cuboDTapa = new Cubo(0.1, 0.1, this.glHelper, this.colors.yellow);
    this.cuboDTapa.setTexture(this.textures.pintura, true);

    this.cuboDBajo = new Cubo(0.1, 0.01, this.glHelper, this.colors.yellow);
    this.cuboDBajo.setTexture(this.textures.pintura, true);

    this.cuboDAlto = new Cubo(0.1, 0.01, this.glHelper, this.colors.yellow);
    this.cuboDAlto.setTexture(this.textures.pintura, true);

    this.formaE = new FormaConCurva(
      [
        [-0.025, 0, 0, 1],

        [-0.01, 0, 0.03, 1],
        [-0.01, 0, 0.03, 1],

        [0.01, 0, 0.03, 1],
        [0.01, 0, 0.03, 1],

        [0.025, 0, 0, 1],
        [0.025, 0, 0, 1],

        [-0.025, 0, 0, 1],
        [-0.025, 0, 0, 1],

        [-0.025, 0, 0, 1],
      ],
      0.01,
      this.glHelper,
      this.colors.yellow,
      [
        [-1, 0, 0],
        [-1, 0, 0],

        [-0.7, 0, 0.7],
        [-0.7, 0, 0.7],

        [0.7, 0, 0.7],
        [0.7, 0, 0.7],

        [1, 0, 0],
        [1, 0, 0],

        [-1, 0, 0],
        [-1, 0, 0],
      ]
    );
    this.formaE.setTexture(this.textures.pintura, true);

    this.circuloE = new FormaConCurva(
      this._inicializarCurvaC(),
      0.01,
      this.glHelper,
      this.colors.grey,
      this._getNormales()
    );
    this.circuloE.setTexture(this.textures.concrete, true);

    this.cuboF = new Cubo(0.8, 0.1, this.glHelper, this.colors.yellow);
    this.cuboF.setTexture(this.textures.pintura, true);

    this.cajaFAtras = new Cubo(0.2, 0.2, this.glHelper, this.colors.grey);

    this.circuloG = new FormaConCurva(
      this._inicializarCurvaC(),
      0.01,
      this.glHelper,
      this.colors.grey,
      this._getNormales()
    );
    this.circuloG.setTexture(this.textures.concrete, true);

    this.lineaG = new FormaConCurva(
      this._inicializarCurvaC(),
      0.05,
      this.glHelper,
      this.colors.grey,
      this._getNormales()
    );

    this.lineaH = new FormaConCurva(
      this._inicializarCurvaC(),
      0.05,
      this.glHelper,
      this.colors.grey,
      this._getNormales()
    );

    this.tablaH = new Cubo(0.1, 0.005, this.glHelper, this.colors.brown);
    this.tablaH.setTexture(this.textures.wooden, true);
  }

  setCameraControl(camera) {
    this.glHelper.camera = camera;
  }

  draw(viewMatrix) {
    let identidad = glMatrix.mat4.create();
    glMatrix.mat4.translate(identidad, identidad, [-1, 0, 0]);
    this.baseA.drawFrom(true, viewMatrix, identidad, typeGlProgram.TEXTURE);

    let matrixA = this.baseA.getModelMatrix();
    glMatrix.mat4.translate(matrixA, matrixA, [
      0,
      0.3 - this.contraidoColumnas,
      0,
    ]);
    this.cuboB.drawFrom(true, viewMatrix, matrixA, typeGlProgram.TEXTURE);

    let matrixB = this.cuboB.getModelMatrix();
    glMatrix.mat4.translate(matrixB, matrixB, [
      0,
      0.3 - this.contraidoColumnas,
      0,
    ]);
    let matrixBPrima = glMatrix.mat4.clone(matrixB);
    glMatrix.mat4.scale(matrixB, matrixB, [0.05, 1, 0.05]);
    this.formaC.drawFrom(true, viewMatrix, matrixB);

    glMatrix.mat4.rotate(matrixBPrima, matrixBPrima, this.rotCabina, [0, 1, 0]);
    glMatrix.mat4.translate(matrixBPrima, matrixBPrima, [0, 0.2, 0]);
    glMatrix.mat4.scale(matrixBPrima, matrixBPrima, [1, 1, 1.3]);
    let matrixDBajo = glMatrix.mat4.clone(matrixBPrima);
    glMatrix.mat4.scale(matrixBPrima, matrixBPrima, [2, 1, 1]);
    glMatrix.mat4.translate(matrixBPrima, matrixBPrima, [0.02, +0.01, 0]);
    this.cuboDBajo.drawFrom(
      true,
      viewMatrix,
      matrixBPrima,
      typeGlProgram.TEXTURE
    );

    glMatrix.mat4.translate(matrixDBajo, matrixDBajo, [0.05, 0.063, 0]);
    glMatrix.mat4.rotate(matrixDBajo, matrixDBajo, Math.PI / 2, [0, 0, 1]);

    //this.cuboD.drawFrom(false, viewMatrix, matrixDBajo);
    this.matrixCabina = glMatrix.mat4.clone(matrixDBajo);

    //new code
    let tapaCabinaMatrix = glMatrix.mat4.clone(matrixDBajo);
    glMatrix.mat4.rotate(
      tapaCabinaMatrix,
      tapaCabinaMatrix,
      Math.PI / 2,
      [1, 0, 0]
    );
    glMatrix.mat4.scale(tapaCabinaMatrix, tapaCabinaMatrix, [1, 0.1, 1.5]);

    let tapaCabina1 = glMatrix.mat4.clone(tapaCabinaMatrix);
    glMatrix.mat4.translate(tapaCabina1, tapaCabina1, [0, 0.4, -0.02]);

    this.cuboDTapa.drawFrom(
      true,
      viewMatrix,
      tapaCabina1,
      typeGlProgram.TEXTURE
    );

    glMatrix.mat4.translate(
      tapaCabinaMatrix,
      tapaCabinaMatrix,
      [0, -0.5, -0.02]
    );
    this.cuboDTapa.drawFrom(
      true,
      viewMatrix,
      tapaCabinaMatrix,
      typeGlProgram.TEXTURE
    );

    //

    glMatrix.mat4.scale(matrixDBajo, matrixDBajo, [1, 0.1, 1]);
    glMatrix.mat4.translate(matrixDBajo, matrixDBajo, [0, 1, 0]);
    this.cuboDTapa.drawFrom(
      true,
      viewMatrix,
      matrixDBajo,
      typeGlProgram.TEXTURE
    );

    glMatrix.mat4.translate(matrixBPrima, matrixBPrima, [-0.01, 0.1, 0]);
    glMatrix.mat4.scale(matrixBPrima, matrixBPrima, [0.7, 1, 1]);
    this.cuboDAlto.drawFrom(
      true,
      viewMatrix,
      matrixBPrima,
      typeGlProgram.TEXTURE
    );

    glMatrix.mat4.rotate(matrixBPrima, matrixBPrima, -Math.PI / 2, [1, 0, 0]);
    glMatrix.mat4.scale(matrixBPrima, matrixBPrima, [1, 1, 3]);
    let matrixE = glMatrix.mat4.clone(matrixBPrima);

    glMatrix.mat4.translate(matrixBPrima, matrixBPrima, [0, 0.02, 0]);
    this.formaE.drawFrom(true, viewMatrix, matrixBPrima, typeGlProgram.TEXTURE);

    glMatrix.mat4.translate(matrixE, matrixE, [0, -0.03, 0]);
    this.formaE.drawFrom(true, viewMatrix, matrixE, typeGlProgram.TEXTURE);

    glMatrix.mat4.scale(matrixBPrima, matrixBPrima, [0.02, 8, 0.008]);
    glMatrix.mat4.translate(matrixBPrima, matrixBPrima, [0, -0.0075, 2.5]);
    this.circuloE.drawFrom(
      true,
      viewMatrix,
      matrixBPrima,
      typeGlProgram.TEXTURE
    );

    glMatrix.mat4.translate(matrixE, matrixE, [0.1, 0.045, 0.02]);
    glMatrix.mat4.rotate(matrixE, matrixE, Math.PI, [0, 0, 1]);
    glMatrix.mat4.translate(matrixE, matrixE, [0.1, 0, 0]); //muevo para que quede el origen corrido
    glMatrix.mat4.rotate(matrixE, matrixE, this.alfaBrazo, [0, 1, 0]);
    glMatrix.mat4.translate(matrixE, matrixE, [-0.1, 0, 0]); //vuelvo pa tras
    glMatrix.mat4.scale(matrixE, matrixE, [1, 0.3, 0.01]);
    this.cuboF.drawFrom(true, viewMatrix, matrixE, typeGlProgram.TEXTURE);

    let matrixF = glMatrix.mat4.clone(matrixE);

    glMatrix.mat4.translate(matrixE, matrixE, [0.35, -0.15, 0]);
    glMatrix.mat4.scale(matrixE, matrixE, [0.5, 2, 10]);
    this.cajaFAtras.drawFrom(true, viewMatrix, matrixE);

    glMatrix.mat4.scale(matrixF, matrixF, [0.02, 8, 0.008]); //repito escala
    glMatrix.mat4.scale(matrixF, matrixF, [1 / 1, 1 / 0.3, 1 / 0.01]); //revierto escala
    glMatrix.mat4.translate(matrixF, matrixF, [-18, -0.003, 0]);
    this.circuloG.drawFrom(true, viewMatrix, matrixF, typeGlProgram.TEXTURE);

    glMatrix.mat4.scale(matrixF, matrixF, [1 / 0.02, 1 / 8, 1 / 0.008]);
    glMatrix.mat4.rotate(matrixF, matrixF, this.alfaBrazo, [0, -1, 0]); //le saco el angulo del brazo
    glMatrix.mat4.rotate(matrixF, matrixF, Math.PI / 2, [1, 0, 0]);
    glMatrix.mat4.scale(matrixF, matrixF, [0.001, 1 + this.estiradoG, 0.001]);
    glMatrix.mat4.translate(matrixF, matrixF, [0, -0.05, -43]);
    this.lineaG.drawFrom(true, viewMatrix, matrixF);

    glMatrix.mat4.scale(matrixF, matrixF, [
      1 / 0.001,
      1 / (1 + this.estiradoG),
      1 / 0.001,
    ]);

    let matrixH1 = glMatrix.mat4.clone(matrixF);
    let matrixH2 = glMatrix.mat4.clone(matrixF);
    let matrixH3 = glMatrix.mat4.clone(matrixF);
    let matrixH4 = glMatrix.mat4.clone(matrixF);

    glMatrix.mat4.rotate(matrixH4, matrixH4, (Math.PI * 3) / 4, [1, 0, 0]);
    glMatrix.mat4.scale(matrixH4, matrixH4, [0.001, 1, 0.001]);
    this.lineaH.drawFrom(true, viewMatrix, matrixH4);

    glMatrix.mat4.rotate(matrixH1, matrixH1, (Math.PI * 3) / 4, [0, 0, 1]);
    glMatrix.mat4.scale(matrixH1, matrixH1, [0.001, 1, 0.001]);
    this.lineaH.drawFrom(true, viewMatrix, matrixH1);

    glMatrix.mat4.rotate(matrixH2, matrixH2, (Math.PI * 3) / 4, [-1, 0, 0]);
    glMatrix.mat4.scale(matrixH2, matrixH2, [0.001, 1, 0.001]);
    this.lineaH.drawFrom(true, viewMatrix, matrixH2);

    glMatrix.mat4.rotate(matrixH3, matrixH3, (Math.PI * 3) / 4, [0, 0, -1]);
    glMatrix.mat4.scale(matrixH3, matrixH3, [0.001, 1, 0.001]);
    this.lineaH.drawFrom(true, viewMatrix, matrixH3);

    glMatrix.mat4.translate(matrixF, matrixF, [0, -0.04, 0]);
    this.tablaH.drawFrom(true, viewMatrix, matrixF, typeGlProgram.TEXTURE);
  }

  getMatrixCabina() {
    return this.matrixCabina;
  }

  getPositionCabina() {
    return [0, 0, 0];
  }

  getAngleCabina() {
    return this.rotCabina;
  }

  //private
  _inicializarCurvaC() {
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
    //return tramo1.concat(tramo2);

    let puntosDeControl = [
      [-0.5, 0],
      [-0.5, 0.67],
      [0.5, 0.67],
      [0.55, 0],
      [0.5, -0.67],
      [-0.5, -0.67],
      [-0.5, 0],
    ];

    return this.dibujadorBezierCubico.getVerticesConTramos(puntosDeControl);
  }

  _getNormales() {
    let puntosDeControl = [
      [-0.5, 0],
      [-0.5, 0.67],
      [0.5, 0.67],
      [0.55, 0],
      [0.5, -0.67],
      [-0.5, -0.67],
      [-0.5, 0],
    ];

    let derivadas =
      this.dibujadorBezierCubico.getDerivadasConTramos(puntosDeControl);
    return this.dibujadorBezierCubico.getNormales(derivadas);
  }

  _addEventListener() {
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.keyCode == 87) {
          // contraer lazo W
          if (this.estiradoG < 4) {
            this.estiradoG += this.speed;
          }
        }

        if (event.keyCode == 83) {
          // estirar lazo S
          if (this.estiradoG > 0 + this.speed) {
            this.estiradoG -= this.speed;
          }
        }

        if (event.keyCode == 73) {
          // girar brazo I
          if (this.alfaBrazo < Math.PI / 16) {
            this.alfaBrazo += this.speedAngulo;
          }
        }

        if (event.keyCode == 75) {
          // girar brazo K
          if (this.alfaBrazo > -Math.PI / 16) {
            this.alfaBrazo -= this.speedAngulo;
          }
        }

        if (event.keyCode == 74) {
          // girar cabina j
          this.rotCabina += this.speedAngulo;
        }

        if (event.keyCode == 76) {
          // girar cabina L
          this.rotCabina -= this.speedAngulo;
        }

        if (event.keyCode == 81) {
          // girar cabina Q
          if (this.contraidoColumnas < 0.2) {
            this.contraidoColumnas += this.speedColumnas;
          }
        }

        if (event.keyCode == 65) {
          // girar cabina A
          if (this.contraidoColumnas > 0) {
            this.contraidoColumnas -= this.speedColumnas;
          }
        }
      },
      false
    );
  }
}
