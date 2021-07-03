export class Cubo {
 
    constructor(lado1, lado2){
        this.ancho = lado1;
        this.largo = lado2;
        this.vertices = [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1], [0.5, 0, 0.5, 1], [0.5, 0, -0.5, 1]];
        this.matrixes = [[1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, 0.5, 0, 1],
                         [1, 0, 0, 0,
                          0, 1, 0, 0,
                          0, 0, 1, 0,
                          0, -0.5, 0, 1]];
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
        return [p[0]*this.ancho, p[1]*this.largo, p[2]*this.ancho];
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

    draw(gl, glProgram, viewMatrix, projMatrix, dibGeo, tapa){
        this.setMatrixUniforms(gl, glProgram, viewMatrix, projMatrix);    
        dibGeo.dibujarGeometria(this, tapa);
    }
}