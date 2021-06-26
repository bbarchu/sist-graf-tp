export class Esfera{
    constructor(radio){
        this.radio = radio;
    }

    getPosicion(u,v){
     let normal = this.getNormal(u,v);
     return normal.map(componente => componente * this.radio)
    }

    getNormal(u,v){
        let theta = v*Math.PI;
        let phi =  u * 2* Math.PI
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);
        let x = cosPhi * sinTheta*this.radio;
        let y = cosTheta*this.radio;
        let z = sinPhi * sinTheta*this.radio;
        return [x,y,z];
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }
}