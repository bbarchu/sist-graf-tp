import { Extrusion } from "./Extrusion.js";
export class FormaConCurva extends Extrusion{
 
    constructor(verticesDeCurva, alto, _glHelper, _color){
        super(_glHelper, _color );

        this.vertices = verticesDeCurva //lista de listas
        this.matrixes = [[1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, alto, 0, 1],
                          [1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1]];


    }
   
    getVertice(u ){ 
        let columnas = this.getColumnas();
        let delta = 1.0/columnas; // 1/11 (con paso delta=0.1)
        let index = Math.round(u / delta);
        return glMatrix.vec4.clone(this.vertices[index]);
    }
 
    getColumnas(){
        return this.vertices.length - 1;
    }
 
   
}