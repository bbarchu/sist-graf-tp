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

    getFilas(){
        return 10;
    }
 
    getColumnas(){
        return 10;
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }

    setMatrixUniforms(gl, glProgram, viewMatrix, projMatrix) {
        
        var modelMatrix = glMatrix.mat4.create();

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