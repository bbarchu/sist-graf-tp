export class Menu{
    constructor(edificio){
        this.edificio = edificio;
        this.pisosTramo1 = 1;
        this.pisosTramo2 = 2;
        this.columnas = 10;
        this.ventanasLargo = 4;
        this.ventanasAncho = 4; //todo cambiar para q se obtengan de la instancia del ed en cuestion
    
        this.prevPisosTramo1 = this.pisosTramo1;
        this.prevPisosTramo2 = this.pisosTramo2;
        this.prevColumnas = this.columnas;
        this.prevVentanasLargo = this.ventanasLargo;
        this.prevVentanasAncho = this.ventanasAncho;
    }
    

    hayCambios = () => {
        return this.prevPisosTramo1 != this.pisosTramo1 ||
               this.prevPisosTramo2 != this.pisosTramo2 ||
               this.prevColumnas != this.columnas ||
               this.prevVentanasLargo != this.ventanasLargo ||
               this.prevVentanasAncho != this.ventanasAncho;
    }

    onMenuClick = () => {
        if (this.hayCambios()) {
            this.edificio.resetDimensiones(this.ventanasAncho, this.ventanasLargo, this.pisosTramo1, this.pisosTramo2, this.columnas);
            this.prevPisosTramo1 = this.pisosTramo1;
            this.prevPisosTramo2 = this.pisosTramo2;
            this.prevColumnas = this.columnas;
            this.prevVentanasLargo = this.ventanasLargo;
            this.prevVentanasAncho = this.ventanasAncho;
        }        
    }
}
