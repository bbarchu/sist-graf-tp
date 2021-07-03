import { FormaConCurva } from './FormaConCurva.js';
import { Cubo } from './Cubo.js';

import { DibujadorBezierCuadratico } from '../helper/DibujadorBezierCuadratico.js';
import { DibujadorBezierCubico } from '../helper/DibujadorBezierCubico.js';
import { DibujadorBSPlineCuadratico } from '../helper/DibujadorBSPlineCuadratico.js';
import { DibujadorBSPlineCubico } from '../helper/DibujadorBSPlineCubico.js';


export class Grua{
    constructor(_gl, _glProgram, _projMatrix, _dibGeo){
    
        this.glHelper = {
            gl: _gl,
            glProgram: _glProgram,
            projMatrix: _projMatrix,
            dibGeo: _dibGeo,
        }

        this.dibujadorBezier = new DibujadorBezierCuadratico();
        this.dibujadorBezierCubico = new DibujadorBezierCubico();
        this.dibujadorBSplineCuadratico = new DibujadorBSPlineCuadratico();
        this.dibujadorBSplineCubico = new DibujadorBSPlineCubico();
        
        this.baseA = new Cubo(0.1,0.3, this.glHelper);
        this.cuboB = new Cubo(0.08,0.3, this.glHelper);
        this.formaC = new FormaConCurva(this._inicializarCurvaC(),0.2, this.glHelper);

        
    }



    draw(viewMatrix){
        this.baseA.draw(true, viewMatrix);

        let matrixA = this.baseA.getModelMatrix();        
        glMatrix.mat4.translate(matrixA,matrixA,[0,0.3,0]);   
        this.cuboB.drawFrom(true, viewMatrix, matrixA)

        let matrixB = this.cuboB.getModelMatrix();
        glMatrix.mat4.translate(matrixB,matrixB,[0,0.3,0]);
        glMatrix.mat4.scale(matrixB,matrixB,[0.05,1,0.05]);   
        this.formaC.drawFrom(true, viewMatrix, matrixB);
    }

    //private
    _inicializarCurvaC(){
        let tramo1= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,0.67],[0.5,0.67],[0.55, 0]]);
        let tramo2= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,-0.67],[0.5,-0.67],[0.55, 0]]);
        return tramo1.concat(tramo2);
    }


} 