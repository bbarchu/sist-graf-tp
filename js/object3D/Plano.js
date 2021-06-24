export class Plano {

    constructor(lado1, lado2){
        this.ancho = lado1;
        this.largo = lado2;
    }

    getPosicion=function(u,v){

        var x=(u-0.5)*this.ancho;
        var z=(v-0.5)*this.largo;
        return [x,0,z];
    }

    getNormal=function(u,v){
        return [0,1,0];
    }

    getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}