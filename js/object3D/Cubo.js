import { Extrusion } from "./Extrusion.js";

export class Cubo  extends Extrusion{
 
    constructor(lado1, lado2, _glHelper, _color){
        super(_glHelper, _color );

        this.vertices = [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1], [0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1]];
        this.matrixes = [[lado1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, lado1, 0,
                          0, 0, 0, 1],
                         [lado1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, lado1, 0,
                          0, lado2, 0, 1]];

    }
    
    definirMatrix(matrixes){
        this.matrixes = matrixes;
    }
    
    getVertice(u){
        let columnas = this.getColumnas();
        let delta = 1.0/columnas;
        let index = (u / delta) % columnas;
        return glMatrix.vec4.clone(this.vertices[index]);
    }

    getColumnas(){
        return this.vertices.length;
    }
}