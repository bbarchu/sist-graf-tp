export class Cubo {
 
    constructor(lado1, lado2, _glHelper){
        
        this.vertices = [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1], [0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1]];
        this.matrixes = [[lado1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, lado1, 0,
                          0, 0, 0, 1],
                         [lado1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, lado1, 0,
                          0, lado2, 0, 1]];
        this.modelMatrix = null;
        this.glHelper = _glHelper;
    }
 
    getPromedioVertices(vertice){
        let matrix = this.matrixes[0]; //es la primera
        if(vertice !=0 ){
            matrix = this.matrixes[this.matrixes.length-1] //o la ultima
        }

        let promedioX= this._sum(0)

        let promedioY = 0
    
        let promedioZ= this._sum(2)

        let promedioW = 1

        let p = [promedioX, promedioY, promedioZ, promedioW]

        glMatrix.vec4.transformMat4(p, p, matrix);
        //TODO VERIFICAR SI SE LE PUEDE APLICAR LA MATRIX AL PUNTO PROMEDIADO... SINO DEBE SER ANTES

        return p
    }

    _sum(eje){
        let suma=0;
        for(let vertice = 0; vertice < this.vertices.length ; vertice++ ){
            suma+=this.vertices[vertice][eje];
        }
        return suma/this.vertices.length
    }    

    getNormalTapa(){
        return [0,1,0]
        //TODO ESTO PARA LA LUZ VA A CAMBIAR.
    }

    getVertice(u){
        let columnas = this.getColumnas();
        let delta = 1.0/columnas;
        let index = (u / delta) % columnas;
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
        return this.matrixes.length -1 ;
    }
 
    getColumnas(){
        return this.vertices.length;
    }
 
    setMatrixUniforms(viewMatrix, modelMatrix) {
        
        if(!modelMatrix){
            modelMatrix = glMatrix.mat4.create();
        }
 
        this.modelMatrix = modelMatrix;

        this.glHelper.gl.uniformMatrix4fv(this.glHelper.glProgram.mMatrixUniform, false, modelMatrix);
        this.glHelper.gl.uniformMatrix4fv(this.glHelper.glProgram.vMatrixUniform, false, viewMatrix);
        this.glHelper.gl.uniformMatrix4fv(this.glHelper.glProgram.pMatrixUniform, false, this.glHelper.projMatrix);
    
        var normalMatrix = glMatrix.mat3.create();
        glMatrix.mat3.fromMat4(normalMatrix,modelMatrix); 
    
        glMatrix.mat3.invert(normalMatrix, normalMatrix);
        glMatrix.mat3.transpose(normalMatrix,normalMatrix);
    
        this.glHelper.gl.uniformMatrix3fv(this.glHelper.glProgram.nMatrixUniform, false, normalMatrix);
    }

    draw(tapa, viewMatrix){
        this.setMatrixUniforms(viewMatrix);    
        this.glHelper.dibGeo.dibujarGeometria(this, tapa);
    }

    drawFrom(tapa, viewMatrix, matrixFrom){

        let modelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.multiply(modelMatrix,matrixFrom, modelMatrix)
    
        this.setMatrixUniforms(viewMatrix, modelMatrix);     
        
        this.glHelper.dibGeo.dibujarGeometria(this, tapa);
    }

    getModelMatrix(){
        return this.modelMatrix;
    }
}