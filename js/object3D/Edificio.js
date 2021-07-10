import { FormaConCurva } from './FormaConCurva.js';
import { Cubo } from './Cubo.js';
 
import { DibujadorBezierCuadratico } from '../helper/DibujadorBezierCuadratico.js';
import { DibujadorBezierCubico } from '../helper/DibujadorBezierCubico.js';
import { DibujadorBSPlineCuadratico } from '../helper/DibujadorBSPlineCuadratico.js';
import { DibujadorBSPlineCubico } from '../helper/DibujadorBSPlineCubico.js';
 
 
export class Edificio{
    constructor(_gl, _glProgram, _projMatrix, _dibGeo){
        this.glHelper = {
            gl: _gl,
            glProgram: _glProgram,
            projMatrix: _projMatrix,
            dibGeo: _dibGeo,
        }
 
        this.colors = {
            yellow: [0.7,0.7,0.0,1.0],
            grey: [0.5,0.5,0.5,1],
            brown: [0.5,0.2,0,1],
            silverBlue: [0.5,0.5,0.6,1],
            white: [1,1,1,1],
            transparent: [0,0.5,0.7,1]
        }
 
        this.dibujadorBezier = new DibujadorBezierCuadratico();
        this.dibujadorBezierCubico = new DibujadorBezierCubico();
        this.dibujadorBSplineCuadratico = new DibujadorBSPlineCuadratico();
        this.dibujadorBSplineCubico = new DibujadorBSPlineCubico();
 
        this.definirDimensiones(4,4, 1, 2);

        this.curvaLosa = this._initCurvaLosa();
        this.losa = new FormaConCurva(this.curvaLosa, 0.5, this.glHelper, this.colors.silverBlue);
        this.columna = new FormaConCurva(this._inicializarCurva(), 10, this.glHelper, this.colors.white)
        this.columnaVentanal = new FormaConCurva(this._inicializarCurva(), 10, this.glHelper, this.colors.yellow)
       

    }

    definirDimensiones(nroVentanasAncho, nroVentanasLargo, cantPisosPrimerTramo, cantPisosSegTramo){
        
        const ANCHO_VENTANA = 3;

        this.dim = { 
            anchoVentana: ANCHO_VENTANA, 
            losaGrande: {                
                cantidadVentanasAncho: nroVentanasAncho,
                cantidadVentanasLargo: nroVentanasLargo,
                ancho: nroVentanasAncho * ANCHO_VENTANA,
                largo: nroVentanasLargo * ANCHO_VENTANA,
                pisos: cantPisosPrimerTramo,
            },
            losaChica:{
                cantidadVentanasAncho: nroVentanasAncho - 2,
                cantidadVentanasLargo: nroVentanasLargo - 2,
                ancho: nroVentanasAncho * ANCHO_VENTANA,
                largo: nroVentanasLargo * ANCHO_VENTANA,
                pisos: cantPisosSegTramo,
            }      
 
        }
    }
 
    draw(viewMatrix){
        
        let identidad = glMatrix.mat4.create();
        glMatrix.mat4.scale(identidad,identidad,[0.02,0.01,0.02]);
        glMatrix.mat4.translate(identidad,identidad,[5,-60,-0]);


        for(let i = 0; i < this.dim.losaGrande.pisos; i++){
            let matrix = glMatrix.mat4.clone(identidad);
            this.losa.drawFrom(true, viewMatrix, identidad);
            this._dibujarColumnas(viewMatrix, identidad);
            this._dibujarVentanas(viewMatrix, matrix, "losaGrande");
            glMatrix.mat4.translate(identidad,identidad,[0,10,0]);

        }


        for(let i = 0; i < this.dim.losaChica.pisos ; i++){
            
            if(i == 0){
                this.losa.drawFrom(true, viewMatrix, identidad);
                glMatrix.mat4.scale(identidad,identidad,[0.8,1,0.8]);
            }else{
                this.losa.drawFrom(true, viewMatrix, identidad);
            }
    
            let matrix1 = glMatrix.mat4.clone(identidad);
            this._dibujarColumnas(viewMatrix, identidad);
            this._dibujarVentanas(viewMatrix, matrix1, "losaChica");
            glMatrix.mat4.translate(identidad,identidad,[0,10,0]);
        }
        this.losa.drawFrom(true, viewMatrix, identidad);



    }
 
    //private
    _dibujarVentanas(viewMatrix, matrixInicial, tipoLosa){

        const margen = -1;
        
        let losa = this.dim[tipoLosa]
        let xi = - losa.largo/2 - margen;
        let xf = losa.largo/2 + margen;
 
        let yi = - losa.ancho/2 - margen;
        let yf = losa.ancho/2 +margen ;
 
        let cantVentanasAncho = losa.cantidadVentanasAncho 
        let cantVentanasLargo = losa.cantidadVentanasLargo 

        const anchoVentana = this.dim.anchoVentana; 

        this._dibujarVidrio(matrixInicial, viewMatrix, margen, losa);
        this._dibujarEsquinas(matrixInicial, viewMatrix, margen, losa);

        for(let i = 1;  i < cantVentanasLargo; i++){   
            
            

            let matrixIzq = glMatrix.mat4.clone(matrixInicial);
            let matrixDer = glMatrix.mat4.clone(matrixInicial);
            glMatrix.mat4.translate(matrixIzq,matrixIzq, [xi + (anchoVentana * i)  , 0, yi ]); 
            glMatrix.mat4.scale(matrixIzq,matrixIzq,[0.3,1,0.3]);

            this.columnaVentanal.drawFrom(true, viewMatrix, matrixIzq);

            glMatrix.mat4.translate(matrixDer,matrixDer, [ xi  + (anchoVentana * i) , 0, yf ]); 
            glMatrix.mat4.scale(matrixDer,matrixDer,[0.3,1,0.3]);
            this.columnaVentanal.drawFrom(true, viewMatrix, matrixDer);


        }

        for(let i = 1;  i < cantVentanasAncho; i++){
            let matrixIzq = glMatrix.mat4.clone(matrixInicial);
            let matrixDer = glMatrix.mat4.clone(matrixInicial);
            glMatrix.mat4.translate(matrixIzq,matrixIzq, [xi, 0, (yi ) + (anchoVentana * i)]); 
            glMatrix.mat4.scale(matrixIzq,matrixIzq,[0.3,1,0.3]);
            this.columnaVentanal.drawFrom(true, viewMatrix, matrixIzq);

            glMatrix.mat4.translate(matrixDer,matrixDer, [xf, 0, (yi ) + (anchoVentana * i) ]); 
            glMatrix.mat4.scale(matrixDer,matrixDer,[0.3,1,0.3]);
            this.columnaVentanal.drawFrom(true, viewMatrix, matrixDer);
        }
    }

    _dibujarVidrio(matrixInicial, viewMatrix, margen, losa){

        let xi = - losa.largo/2 - margen;
        let xf = losa.largo/2 + margen;
 
        let yi = - losa.ancho/2 - margen;
        let yf = losa.ancho/2 +margen ;

        let lado2 = yf-yi;
        let lado1 = xf-xi;
        let lado3 =  10;

        this.vidrio = new Cubo(lado1, lado2, this.glHelper, this.colors.transparent);

        let matrixes = [
            [lado1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, lado2, 0,
            0, 0, 0, 1],
           [lado1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, lado2, 0,
            0, lado3, 0, 1]];

        this.vidrio.definirMatrix(matrixes);


        this.vidrio.drawFrom(false, viewMatrix, matrixInicial);
    }

    _dibujarEsquinas(matrixInicial, viewMatrix, margen, losa){

        let xi = - losa.largo/2 - margen;
        let xf = losa.largo/2 + margen;
 
        let yi = - losa.ancho/2 - margen;
        let yf = losa.ancho/2 +margen ;

        let matrix = glMatrix.mat4.clone(matrixInicial);
        glMatrix.mat4.translate(matrix,matrix, [xi  , 0, yi ]); 
        glMatrix.mat4.scale(matrix,matrix,[0.3,1,0.3]);
        this.columnaVentanal.drawFrom(true, viewMatrix, matrix);

        let matrix1 = glMatrix.mat4.clone(matrixInicial);
        glMatrix.mat4.translate(matrix1,matrix1, [xi  , 0, yf ]); 
        glMatrix.mat4.scale(matrix1,matrix1,[0.3,1,0.3]);
        this.columnaVentanal.drawFrom(true, viewMatrix, matrix1);

        let matrix2 = glMatrix.mat4.clone(matrixInicial);
        glMatrix.mat4.translate(matrix2,matrix2, [xf  , 0, yi ]); 
        glMatrix.mat4.scale(matrix2,matrix2,[0.3,1,0.3]);
        this.columnaVentanal.drawFrom(true, viewMatrix, matrix2);

        let matrix3 = glMatrix.mat4.clone(matrixInicial);
        glMatrix.mat4.translate(matrix3,matrix3, [xf  , 0, yf ]); 
        glMatrix.mat4.scale(matrix3,matrix3,[0.3,1,0.3]);
        this.columnaVentanal.drawFrom(true, viewMatrix, matrix3);
    }

    _dibujarColumnas(viewMatrix, matrix){
        for(let j = 0; j< this.puntosDeControlLosa.length - 2; j+=2){
            this._dibujarColumna(j, matrix, viewMatrix);
        }
    }

    _dibujarColumna(i, matrix, viewMatrix){
        let derivada = this.dibujadorBSplineCuadratico.getDerivada(0,[this.puntosDeControlLosa[i],this.puntosDeControlLosa[i+1], this.puntosDeControlLosa[i+2]]);
        let producto = this._cross(derivada,[0,1,0]);
        let norma = (producto[0]**2 + producto[1]**2 + producto[2]**2)**(1/2)
        let normal = [ producto[0]/norma,  producto[1]/norma , producto[2]/norma]

        let curva = this.dibujadorBSplineCuadratico.getVertices([this.puntosDeControlLosa[i],this.puntosDeControlLosa[i+1], this.puntosDeControlLosa[i+2]]);

        let matrixinicial = glMatrix.mat4.clone(matrix);
        glMatrix.mat4.translate(matrixinicial,matrixinicial,this._sumCompVectores(curva[0],normal)); 
        this.columna.drawFrom(true, viewMatrix, matrixinicial);
    }

    _inicializarCurva(){
        let tramo1= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,0.67],[0.5,0.67],[0.55, 0]]);
        let tramo2= this.dibujadorBezierCubico.getVertices([[-0.5,0],[-0.5,-0.67],[0.5,-0.67],[0.55, 0]]);
        return tramo1.concat(tramo2);
    }
 
    _initCurvaLosa(){
        const margen = 3;
        let losa = this.dim.losaGrande;
        let xi = - losa.largo/2 - margen;
        let xf = losa.largo/2 + margen;
 
        let yi = - losa.ancho/2 - margen;
        let yf = losa.ancho/2 + margen;
 
        const xd = xf/3;
        const yd = yf/3;

        let random = () => (this._getRandomArbitrary(-margen, margen));


        let puntosControl = [
            [xi , yi ],
            [xi + xd, yi ],
            [xi + 2 * xd, yi + random()],
            [xi + 3 * xd, yi + random()],
            [xf - 2 * xd, yi + random()],
            [xf - 1 * xd, yi + random()],
            [xf, yi + random()],
            [xf + random(), yi + yd],
            [xf + random() , yi + 2 * yd],
            [xf + random(), yi + 3 * yd],
            [xf + random(), yf - 2 * yd], 
            [xf + random(), yf - 1 * yd],
            [xf + random(), yf],
            [xf - 1 * xd ,yf + random()],
             [xf - 2 * xd,yf + random()],
            [xi + 3 * xd,yf + random()],
            [xi + 2 * xd,yf + random()],
            [xi + xd,yf + random()],
            [xi ,yf + random()],
            [xi + random() ,yf - 1 * yd],
            [xi + random(),yf - 2 * yd],
            [xi + random(),yi + 3 * yd],
            [xi + random(),yi + 2 * yd],
            [xi + random(),yi + yd],
            [xi , yi],
            [xi + xd, yi]        ] //repito los ultimos 2 para cerrarla
 
        this.puntosDeControlLosa = puntosControl;
        return this._construirCurvaLosa(puntosControl);
    }
 
    _construirCurvaLosa(puntos){
        let curva = []
 
        for(let i=0; i < puntos.length-2; i++){
            let vertices = this.dibujadorBSplineCuadratico.getVertices([puntos[i],puntos[i+1],puntos[i+2]]);
            curva = [...curva, ...vertices];
        } 

        return curva;
 
    }

    _getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }


    _cross(A, B) { return [ A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0] ]}

    _sumCompVectores(A, B) { return [A[0] + B[0], A[1] + B[1], A[2]+B[2] ]}
 
} 