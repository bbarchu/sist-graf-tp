
export class DibujadorDeGeometrias {
    constructor(gl_, glProgram_){
        this.mallaDeTriangulos = null
        this.gl = gl_;
        this.shaderProgram = glProgram_;

        this.filas=10; //cantidad de triangulos por fila
        this.columnas=10; //idem por columnas
    }

    dibujarGeometria(superficie){
         
        this.mallaDeTriangulos=this._generarSuperficie(superficie);
        this._dibujarMalla();
    }

    //private 

    _generarSuperficie(superficie){
    
        var positionBuffer = [];
        var normalBuffer = [];
        var uvBuffer = [];
    
        for (var i=0; i <= this.filas; i++) {
            for (var j=0; j <= this.columnas; j++) {
    
                var u=j/this.columnas;
                var v=i/this.filas;
    
                var pos=superficie.getPosicion(u,v);
     
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);
    
                var nrm=superficie.getNormal(u,v);
    
                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);
    
                var uvs=superficie.getCoordenadasTextura(u,v);

                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
    
            }
        }
    
    
        var indexBuffer=[];  
    
        for (i=0; i < this.filas; i++) {
            for (j=0; j < this.columnas; j++) {
    
                indexBuffer.push(j + (this.columnas + 1) * (i ) );
                indexBuffer.push((this.columnas + 1) * (i + 1)  + j );
             
            }
            indexBuffer.push((this.columnas) + (this.columnas + 1) * (i ));
            indexBuffer.push((this.columnas + 1) * (i + 1)  + this.columnas );
    
            if(this.filas - 1 > i){
                indexBuffer.push((this.columnas + 1) * (i + 1)  + this.columnas );
                indexBuffer.push((this.columnas +1) * (i + 1) );
            }
            
    
        }
    
        // Creación e Inicialización de los buffers
    
        var webgl_position_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, webgl_position_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positionBuffer), this.gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = positionBuffer.length / 3;
    
        var webgl_normal_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, webgl_normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalBuffer), this.gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = normalBuffer.length / 3;
    
        var webgl_uvs_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, webgl_uvs_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvBuffer), this.gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = uvBuffer.length / 2;
    
    
        var webgl_index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), this.gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = indexBuffer.length;
    
        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
    
    _dibujarMalla(){
        
        // Se configuran los buffers que alimentaron el pipeline
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_position_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.mallaDeTriangulos.webgl_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_uvs_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.mallaDeTriangulos.webgl_uvs_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mallaDeTriangulos.webgl_normal_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.mallaDeTriangulos.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
           
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.mallaDeTriangulos.webgl_index_buffer);
    
        this.gl.uniform1i(this.shaderProgram.useLightingUniform,true);                
    
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.mallaDeTriangulos.webgl_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);
     
    }
}