import { FormaConCurva } from './FormaConCurva.js';
import { Cubo } from './Cubo.js';

export class Grua{
    constructor(_gl, _glProgram, _projMatrix, _dibGeo){
    
        this.glHelper = {
            gl: _gl,
            glProgram: _glProgram,
            projMatrix: _projMatrix,
            dibGeo: _dibGeo,
        }
        
        this.baseA = new Cubo(0.1,0.3, this.glHelper);
        this.cuboB = new Cubo(0.08,0.3, this.glHelper);

    }



    draw(viewMatrix){
        this.baseA.draw(true, viewMatrix);
        let matrixA = this.baseA.getModelMatrix();
        
        glMatrix.mat4.translate(matrixA,matrixA,[0,0.3,0]);   
        
        this.cuboB.drawFrom(true, viewMatrix, matrixA)
    }

} 