export class Menu {
  constructor(edificio, tobogan) {
    this.edificio = edificio;
    this.tobogan = tobogan;

    this.pisosTramo1 = 1;
    this.pisosTramo2 = 2;
    this.columnas = 12;
    this.ventanasLargo = 4;
    this.ventanasAncho = 4; //todo cambiar para q se obtengan de la instancia del ed en cuestion
    this.tramosTobogan = 4;

    this.prevPisosTramo1 = this.pisosTramo1;
    this.prevPisosTramo2 = this.pisosTramo2;
    this.prevColumnas = this.columnas;
    this.prevVentanasLargo = this.ventanasLargo;
    this.prevVentanasAncho = this.ventanasAncho;
    this.prevTramosTobogan = this.tramosTobogan;
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
