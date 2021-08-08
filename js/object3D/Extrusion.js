export const type = {
  COLOR: "color",
  TEXTURE: "texture",
  NOISE: "noise",
  SKY: "sky",
  WINDOW: "window",
};

export class Extrusion {
  constructor(_glHelper, _color) {
    this.glHelper = _glHelper;
    this.color = _color;
    this.texture = undefined;
    this.modelMatrix = null;
    this.matrixes = undefined;
    this.vertices = undefined;
    this.normales = undefined;
  }

  setTexture(_texture, repetido = false) {
    this.texture = _texture;

    this.repetido = repetido;
  }

  getPromedioVertices(vertice) {
    let matrix = this.matrixes[0]; //es la primera
    if (vertice != 0) {
      matrix = this.matrixes[this.matrixes.length - 1]; //o la ultima
    }

    let promedioX = this._sum(0);

    let promedioY = 0;

    let promedioZ = this._sum(2);

    let promedioW = 1;

    let p = [promedioX, promedioY, promedioZ, promedioW];

    glMatrix.vec4.transformMat4(p, p, matrix);
    //TODO VERIFICAR SI SE LE PUEDE APLICAR LA MATRIX AL PUNTO PROMEDIADO... SINO DEBE SER ANTES

    return p;
  }

  getIndexMatrix(v) {
    let filas = this.getFilas() + 1;
    return Math.round(v * (filas - 1));
  }

  getMatrix(v) {
    let index = this.getIndexMatrix(v);
    return glMatrix.mat4.clone(this.matrixes[index]);
  }

  getPosicion(u, v) {
    let p = this.getVertice(u);

    let m = this.getMatrix(v);
    glMatrix.vec4.transformMat4(p, p, m);
    return p;
  }

  calcularNormalTransformada(p, v) {
    let m = this.getMatrix(v);

    let matrix = glMatrix.mat4.clone(m);
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;

    glMatrix.vec4.transformMat4(p, p, matrix);
    return this.normalize(p);
  }

  getNormalTapa(v) {
    let normal = [];
    if (v == 0) {
      normal = [0, -1, 0];
    } else {
      normal = [0, 1, 0];
    }
    return normal;
    //return this.calcularNormalTransformada(normal, v);
  }

  getNormal(u, v) {
    let index = this.getIndexVertice(u);
    let normal = this.normales[index];
    normal = [normal[0], normal[1], normal[2], 1];
    return this.calcularNormalTransformada(normal, v);
  }

  getCoordenadasTextura(u, v) {
    if (this.repetido) return this.getRepetido(u, v);
    return this.getAcumulado(u, v);
  }

  getCoordenadasTexturaTapa(pos) {
    if (this.repetido) {
      return [pos[0], pos[2]];
    } else {
      return [
        (pos[0] - this.minX) / this.ancho,
        (pos[2] - this.minY) / this.alto,
      ];
    }
  }

  getFilas() {
    return this.matrixes.length - 1;
  }

  setMatrixUniforms(viewMatrix, modelMatrix, typeGlProgram) {
    if (!modelMatrix) {
      modelMatrix = glMatrix.mat4.create();
    }

    this.modelMatrix = modelMatrix;
    this.glHelper.gl.uniformMatrix4fv(
      this.glHelper.glProgram[typeGlProgram].vMatrixUniform,
      false,
      viewMatrix
    );
    this.glHelper.gl.uniformMatrix4fv(
      this.glHelper.glProgram[typeGlProgram].mMatrixUniform,
      false,
      modelMatrix
    );

    this.glHelper.gl.uniformMatrix4fv(
      this.glHelper.glProgram[typeGlProgram].pMatrixUniform,
      false,
      this.glHelper.projMatrix
    );

    var normalMatrix = glMatrix.mat3.create();
    glMatrix.mat3.fromMat4(normalMatrix, modelMatrix);

    glMatrix.mat3.invert(normalMatrix, normalMatrix);
    glMatrix.mat3.transpose(normalMatrix, normalMatrix);

    this.glHelper.gl.uniformMatrix3fv(
      this.glHelper.glProgram[typeGlProgram].nMatrixUniform,
      false,
      normalMatrix
    );

    this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[typeGlProgram].viewPos,
      this.glHelper.camera.getCameraPosition()
    );

    switch (typeGlProgram) {
      case type.COLOR:
        this.glHelper.gl.uniform4fv(
          this.glHelper.glProgram[typeGlProgram].materialColorUniform,
          this.color
        );

        break;
      case type.TEXTURE:
        this.glHelper.gl.activeTexture(this.glHelper.gl.TEXTURE0);
        this.glHelper.gl.bindTexture(this.glHelper.gl.TEXTURE_2D, this.texture);
        this.glHelper.gl.uniform1i(
          this.glHelper.glProgram[typeGlProgram].samplerUniform,
          0
        );

        break;

      case type.NOISE:
        this.glHelper.gl.activeTexture(this.glHelper.gl.TEXTURE0);
        this.glHelper.gl.bindTexture(
          this.glHelper.gl.TEXTURE_2D,
          this.texture[0]
        );
        this.glHelper.gl.uniform1i(
          this.glHelper.glProgram[typeGlProgram].samplerUniform0,
          0
        );

        this.glHelper.gl.activeTexture(this.glHelper.gl.TEXTURE1);
        this.glHelper.gl.bindTexture(
          this.glHelper.gl.TEXTURE_2D,
          this.texture[1]
        );
        this.glHelper.gl.uniform1i(
          this.glHelper.glProgram[typeGlProgram].samplerUniform1,
          1
        );

        this.glHelper.gl.activeTexture(this.glHelper.gl.TEXTURE2);
        this.glHelper.gl.bindTexture(
          this.glHelper.gl.TEXTURE_2D,
          this.texture[2]
        );
        this.glHelper.gl.uniform1i(
          this.glHelper.glProgram[typeGlProgram].samplerUniform2,
          2
        );

        break;
      case type.SKY:
        break;
      default:
        break;
    }
  }

  draw(tapa, viewMatrix) {
    this.setMatrixUniforms(viewMatrix);
    this.glHelper.dibGeo.dibujarGeometria(
      this,
      tapa,
      this.glHelper.glProgram[typeGlProgram]
    );
  }

  drawFrom(tapa, viewMatrix, matrixFrom, typeGlProgram = type.COLOR) {
    let modelMatrix = glMatrix.mat4.create();

    glMatrix.mat4.multiply(modelMatrix, matrixFrom, modelMatrix);

    this.glHelper.gl.useProgram(this.glHelper.glProgram[typeGlProgram]);

    this.setMatrixUniforms(viewMatrix, modelMatrix, typeGlProgram);

    this.setSharedUniforms(typeGlProgram);

    this.glHelper.dibGeo.dibujarGeometria(
      this,
      tapa,
      this.glHelper.glProgram[typeGlProgram],
      typeGlProgram
    );
  }

  getModelMatrix() {
    return this.modelMatrix;
  }

  setSharedUniforms(typeGlProgram) {
    // Se inicializan las variables asociadas con la Iluminación

    this.glHelper.gl.uniform3f(
      this.glHelper.glProgram[typeGlProgram].ambientColorUniform,
      1,
      1,
      1
    );
    this.glHelper.gl.uniform3f(
      this.glHelper.glProgram[typeGlProgram].directionalColorUniform,
      1.2,
      1.1,
      0.7
    );

    let lightPosition = [10.0, 0.0, 3.0];
    this.glHelper.gl.uniform3fv(
      this.glHelper.glProgram[typeGlProgram].lightingDirectionUniform,
      lightPosition
    );
  }

  calculateAcumuladoVertices() {
    this.minX = this.vertices[0][0];
    this.minY = this.vertices[0][1];
    this.maxX = this.vertices[0][0];
    this.maxY = this.vertices[0][1];

    this.distanciaAcumuladaTotalVertices = 0;
    this.distanciaAcumuladaParcialVertices = [];
    this.distanciaAcumuladaParcialVertices.push(
      this.distanciaAcumuladaTotalVertices
    );
    for (let i = 1; i < this.vertices.length; i++) {
      this.distanciaAcumuladaTotalVertices += this.calcularDistancia(
        this.vertices[i],
        this.vertices[i - 1]
      );

      this.minX = this.getMin(this.minX, this.vertices[i][0]);
      this.minY = this.getMin(this.minY, this.vertices[i][1]);
      this.maxX = this.getMax(this.maxX, this.vertices[i][0]);
      this.maxY = this.getMax(this.maxY, this.vertices[i][1]);

      this.distanciaAcumuladaParcialVertices.push(
        this.distanciaAcumuladaTotalVertices
      );
    }

    this.ancho = this.maxX - this.minX;
    this.alto = this.maxY - this.minY;
  }

  calculateAcumuladoMatrixes() {
    this.distanciaAcumuladaTotalMatrices = 0;
    this.distanciaAcumuladaParcialMatrices = [];
    this.distanciaAcumuladaParcialMatrices.push(
      this.distanciaAcumuladaTotalMatrices
    );

    for (let i = 1; i < this.matrixes.length; i++) {
      let p = [0, 0, 0, 1];
      glMatrix.vec4.transformMat4(p, p, this.matrixes[i]);
      let p2 = [0, 0, 0, 1];
      glMatrix.vec4.transformMat4(p2, p2, this.matrixes[i - 1]);
      this.distanciaAcumuladaTotalMatrices += this.calcularDistancia(p, p2);
      this.distanciaAcumuladaParcialMatrices.push(
        this.distanciaAcumuladaTotalMatrices
      );
    }
  }

  //private
  _sum(eje) {
    let suma = 0;
    for (let vertice = 0; vertice < this.vertices.length; vertice++) {
      suma += this.vertices[vertice][eje];
    }
    return suma / this.vertices.length;
  }

  modulo(v) {
    return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** 0.5;
  }

  normalize(v) {
    let modulo = this.modulo(v);
    return [v[0] / modulo, v[1] / modulo, v[2] / modulo];
  }

  calcularDistancia(A, B) {
    return this.modulo([A[0] - B[0], A[1] - B[1], A[2] - B[2]]);
  }

  getIndexVertice(u) {
    let l = this.vertices.length;
    return Math.round(u * l) % l;
  }

  getAcumulado(u, v) {
    let indexMatrix = this.getIndexMatrix(v);

    let indexVertice = this.getIndexVertice(u);

    let vRetorno =
      this.distanciaAcumuladaParcialMatrices[indexMatrix] /
      this.distanciaAcumuladaTotalMatrices;
    let uRetorno =
      this.distanciaAcumuladaParcialVertices[indexVertice] /
      this.distanciaAcumuladaTotalVertices;

    return [uRetorno, vRetorno];
  }

  getRepetido(u, v) {
    let indexMatrix = this.getIndexMatrix(v);

    let indexVertice = this.getIndexVertice(u);

    let vRetorno = this.distanciaAcumuladaParcialMatrices[indexMatrix];
    let uRetorno = this.distanciaAcumuladaParcialVertices[indexVertice];

    return [uRetorno, vRetorno];
  }

  getMin(A, B) {
    return A < B ? A : B;
  }

  getMax(A, B) {
    return A > B ? A : B;
  }
}
