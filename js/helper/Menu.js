export class Menu {
  constructor() {
    this.pisosTramo1 = 1;
    this.pisosTramo2 = 2;
    this.columnas = 12;
    this.ventanasLargo = 4;
    this.ventanasAncho = 4; //todo cambiar para q se obtengan de la instancia del ed en cuestion
    this.tramosTobogan = 4;
    this.ambiente = 0.3;
    this.sol = 0.5;
    this.puntual1 = 0.7;
    this.puntual2 = 0.7;
    this.puntual3 = 0.7;

    this.prevPisosTramo1 = this.pisosTramo1;
    this.prevPisosTramo2 = this.pisosTramo2;
    this.prevColumnas = this.columnas;
    this.prevVentanasLargo = this.ventanasLargo;
    this.prevVentanasAncho = this.ventanasAncho;
    this.prevTramosTobogan = this.tramosTobogan;
  }

  set(edificio, tobogan) {
    this.edificio = edificio;
    this.tobogan = tobogan;
  }

  getAmbiente() {
    return this.ambiente;
  }

  getSol() {
    return this.sol;
  }

  getPuntual1() {
    return this.puntual1;
  }

  getPuntual2() {
    return this.puntual2;
  }

  getPuntual3() {
    return this.puntual3;
  }

  hayCambios = () => {
    return (
      this.prevPisosTramo1 != this.pisosTramo1 ||
      this.prevPisosTramo2 != this.pisosTramo2 ||
      this.prevColumnas != this.columnas ||
      this.prevVentanasLargo != this.ventanasLargo ||
      this.prevVentanasAncho != this.ventanasAncho ||
      this.prevTramosTobogan != this.tramosTobogan
    );
  };

  onMenuClick = () => {
    if (this.hayCambios()) {
      this.edificio.resetDimensiones(
        this.ventanasAncho,
        this.ventanasLargo,
        this.pisosTramo1,
        this.pisosTramo2,
        this.columnas
      );

      this.tobogan.setTramos(
        this.tramosTobogan,
        this.ventanasAncho,
        this.ventanasLargo
      );

      this.prevPisosTramo1 = this.pisosTramo1;
      this.prevPisosTramo2 = this.pisosTramo2;
      this.prevColumnas = this.columnas;
      this.prevVentanasLargo = this.ventanasLargo;
      this.prevVentanasAncho = this.ventanasAncho;
      this.prevTramosTobogan = this.tramosTobogan;
    }
  };
}
