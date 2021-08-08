export class DibujadorBezierCuadratico {
  constructor() {
    this.base0 = function (u) {
      return (1 - u) * (1 - u);
    };
    this.base1 = function (u) {
      return 2 * u * (1 - u);
    };
    this.base2 = function (u) {
      return u * u;
    };

    this.base0der = function (u) {
      return -2 + 2 * u;
    };
    this.base1der = function (u) {
      return 2 - 4 * u;
    };
    this.base2der = function (u) {
      return 2 * u;
    };
  }

  getVerticesConTramos(puntosDeControl) {
    let vertices = [];
    for (let i = 0; i < puntosDeControl.length - 2; i += 2) {
      let v = this.getVertices([
        puntosDeControl[i],
        puntosDeControl[i + 1],
        puntosDeControl[i + 2],
      ]);

      vertices = [...vertices, ...v];
    }

    return vertices;
  }

  getDerivadasConTramos(puntosDeControl) {
    let derivadas = [];
    for (let i = 0; i < puntosDeControl.length - 2; i += 2) {
      let d = this.getDerivadas([
        puntosDeControl[i],
        puntosDeControl[i + 1],
        puntosDeControl[i + 2],
      ]);

      derivadas = [...derivadas, ...d];
    }

    return derivadas;
  }

  getVertices(puntosDeControl) {
    let delta = 0.1; //debe clavar en 0 y 1
    let lista = [];

    for (let paso = 0; paso <= 1; paso += delta) {
      lista.push(this.curva(paso, puntosDeControl));
    }

    return lista;
  }

  getDerivadas(puntosDeControl) {
    let delta = 0.1; //debe clavar en 0 y 1
    let lista = [];

    for (let paso = 0; paso <= 1; paso += delta) {
      lista.push(this.normalize(this._getDerivada(paso, puntosDeControl)));
    }

    return lista;
  }

  getNormales(derivadas) {
    let normales = [];
    let binormal = [0, 1, 0];
    derivadas.forEach((d) =>
      normales.push(this.normalize(this._cross(binormal, d)))
    ); //todo verificar prod cruz
    return normales;
  }

  //private

  _getDerivada(u, puntosDeControl) {
    var p0 = puntosDeControl[0];
    var p1 = puntosDeControl[1];
    var p2 = puntosDeControl[2];

    let punto = [];

    let x =
      this.base0der(u) * p0[0] +
      this.base1der(u) * p1[0] +
      this.base2der(u) * p2[0];
    punto.push(x);
    let y = 0;
    punto.push(y);

    let z =
      this.base0der(u) * p0[1] +
      this.base1der(u) * p1[1] +
      this.base2der(u) * p2[1];
    punto.push(z);

    //punto.push(1);
    return punto;
  }

  curva = function (u, puntosDeControl) {
    var p0 = puntosDeControl[0];
    var p1 = puntosDeControl[1];
    var p2 = puntosDeControl[2];

    let punto = [];

    let x =
      this.base0(u) * p0[0] + this.base1(u) * p1[0] + this.base2(u) * p2[0];
    punto.push(x);
    let y = 0;
    punto.push(y);
    let z =
      this.base0(u) * p0[1] + this.base1(u) * p1[1] + this.base2(u) * p2[1];
    punto.push(z);
    punto.push(1); //w

    return punto;
  };

  _cross(A, B) {
    return [
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0],
    ];
  }

  modulo(v) {
    return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** 0.5;
  }

  normalize(v) {
    let modulo = this.modulo(v);
    return [v[0] / modulo, v[1] / modulo, v[2] / modulo];
  }
}
