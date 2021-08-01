export const type = {
  COLOR: "color",
  TEXTURE: "texture",
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

  getMatrix(v) {
    let filas = this.getFilas();
    let delta = 1.0 / filas;
    let index = Math.round(v / delta);
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
    let p = this.getNormal(u);

    return this.calcularNormalTransformada(p, v);
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
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
      this.glHelper.glProgram[typeGlProgram].mMatrixUniform,
      false,
      modelMatrix
    );
    this.glHelper.gl.uniformMatrix4fv(
      this.glHelper.glProgram[typeGlProgram].vMatrixUniform,
      false,
      viewMatrix
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

      default:
        this.glHelper.gl.uniform4fv(
          this.glHelper.glProgram[typeGlProgram].materialColorUniform,
          this.color
        );
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
      this.glHelper.glProgram[typeGlProgram]
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

  //private
  _sum(eje) {
    let suma = 0;
    for (let vertice = 0; vertice < this.vertices.length; vertice++) {
      suma += this.vertices[vertice][eje];
    }
    return suma / this.vertices.length;
  }

  magnitude(v) {
    return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** 0.5;
  }

  normalize(v) {
    let magnitude = this.magnitude(v);
    return [v[0] / magnitude, v[1] / magnitude, v[2] / magnitude];
  }
}
