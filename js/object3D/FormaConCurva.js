export class FormaConCurva {
 
    constructor(verticesDeCurva){
        
        this.vertices = verticesDeCurva //lista de listas
        this.matrixes = [[1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, 0.5, 0, 1],
                         [1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, -0.5, 0, 1]];
    }
 
    getVertice(u ){ 
        let columnas = this.getColumnas();
        let delta = 1.0/columnas; // 1/11 (con paso delta=0.1)
        let index = Math.round(u / delta);
        return glMatrix.vec4.clone(this.vertices[index]);
    }
 
    getMatrix(v){
        let filas = this.getFilas();
        let delta = 1.0/filas;
        let index = v / delta;
        return glMatrix.mat4.clone(this.matrixes[index]);
    }
 
    getPosicion(u,v){
        let p = this.getVertice(u);
        let m = this.getMatrix(v);
        glMatrix.vec4.transformMat4(p, p, m);
        return p;
    }
 
    getNormal(u,v){
        return [0,1,0];
    }
 
    getCoordenadasTextura(u,v){
        return [u,v];
    }
 
    getFilas(){
        return 1;
    }
 
    getColumnas(){
        return this.vertices.length - 1;
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