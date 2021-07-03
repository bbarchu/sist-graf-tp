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

        this.cuboD = new Cubo(0.1,0.1, this.glHelper);
        this.cuboDTapa = new Cubo(0.1,0.1, this.glHelper)
        this.cuboDBajo = new Cubo(0.1,0.01, this.glHelper);
        this.cuboDAlto = new Cubo(0.1,0.01, this.glHelper);

    }



    draw(viewMatrix){

        let identidad = glMatrix.mat4.create();
        glMatrix.mat4.translate(identidad,identidad,[0,-0.5,0]);
        this.baseA.drawFrom(true, viewMatrix, identidad);

        let matrixA = this.baseA.getModelMatrix();        
        glMatrix.mat4.translate(matrixA,matrixA,[0,0.3,0]);   
        this.cuboB.drawFrom(true, viewMatrix, matrixA)

        let matrixB = this.cuboB.getModelMatrix();
        glMatrix.mat4.translate(matrixB,matrixB,[0,0.3,0]);
        let matrixBPrima = glMatrix.mat4.clone(matrixB);
        glMatrix.mat4.scale(matrixB,matrixB,[0.05,1,0.05]);   
        this.formaC.drawFrom(true, viewMatrix, matrixB);

        glMatrix.mat4.translate(matrixBPrima,matrixBPrima,[0,0.2,0]);
        glMatrix.mat4.scale(matrixBPrima,matrixBPrima,[1,1,1.3]);   
        let matrixDBajo = glMatrix.mat4.clone(matrixBPrima);
        glMatrix.mat4.scale(matrixBPrima,matrixBPrima,[2,1,1]);
        glMatrix.mat4.translate(matrixBPrima,matrixBPrima,[0.02,0,0]);
        this.cuboDBajo.drawFrom(true, viewMatrix, matrixBPrima)

        glMatrix.mat4.translate(matrixDBajo,matrixDBajo,[0.05,0.063,0]);
        glMatrix.mat4.rotate(matrixDBajo,matrixDBajo,Math.PI/2,[0,0,1]);
        this.cuboD.drawFrom(false, viewMatrix, matrixDBajo);
        
        glMatrix.mat4.scale(matrixDBajo,matrixDBajo,[1,0.1,1]);
        glMatrix.mat4.translate(matrixDBajo,matrixDBajo,[0,1,0]);
        this.cuboDTapa.drawFrom(true, viewMatrix, matrixDBajo);

        glMatrix.mat4.translate(matrixBPrima,matrixBPrima,[-0.01,0.11,0]);
        glMatrix.mat4.scale(matrixBPrima,matrixBPrima,[0.7,1,1]);
        this.cuboDAlto.drawFrom(true, viewMatrix, matrixBPrima);

        

    }

    //private
    _inicializarCurvaC(){
        let tramo1= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,0.67],[0.5,0.67],[0.55, 0]]);
        let tramo2= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,-0.67],[0.5,-0.67],[0.55, 0]]);
        return tramo1.concat(tramo2);
    }


} 