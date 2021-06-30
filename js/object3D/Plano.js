export class Plano {

    constructor(lado1, lado2){
        this.ancho = lado1;
        this.largo = lado2;
    }

    getPosicion(u,v){

        var x=(u-0.5)*this.ancho;
        var z=(v-0.5)*this.largo;
        return [x,0,z];
    }

    getNormal(u,v){
        return [0,1,0];
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }

    getFilas(){
        return 10;
    }
 
    getColumnas(){
        return 10;
    }

    setMatrixUniforms(gl, glProgram, viewMatrix, projMatrix) {
        
        var modelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.translate(modelMatrix, modelMatrix, [0.2,0.2,0])

        gl.uniformMatrix4fv(glProgram.mMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(glProgram.vMatrixUniform, false, viewMatrix);
        gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, projMatrix);
    
        var normalMatrix = glMatrix.mat3.create();
        glMatrix.mat3.fromMat4(normalMatrix,modelMatrix); 
    
        glMatrix.mat3.invert(normalMatrix, normalMatrix);
        glMatrix.mat3.transpose(normalMatrix,normalMatrix);
    
        gl.uniformMatrix3fv(glProgram.nMatrixUniform, false, normalMatrix);
    }
}