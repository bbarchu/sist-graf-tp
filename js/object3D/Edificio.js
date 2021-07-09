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
            silverBlue: [0.5,0.5,0.6,1]
        }
 
        this.dibujadorBezier = new DibujadorBezierCuadratico();
        this.dibujadorBezierCubico = new DibujadorBezierCubico();
        this.dibujadorBSplineCuadratico = new DibujadorBSPlineCuadratico();
        this.dibujadorBSplineCubico = new DibujadorBSPlineCubico();
 
        const CANTIDAD_VENTANAS_ANCHO = 8;
        const CANTIDAD_VENTANAS_LARGO = 4;
        const ANCHO_VENTANA = 3;
 
        this.dim = { 
            anchoVentana: ANCHO_VENTANA, 
            losaGrande: {                
                cantidadVentanasAncho: CANTIDAD_VENTANAS_ANCHO,
                cantidadVentanasLargo: CANTIDAD_VENTANAS_LARGO,
                ancho: CANTIDAD_VENTANAS_ANCHO * ANCHO_VENTANA,
                largo: CANTIDAD_VENTANAS_LARGO * ANCHO_VENTANA
            },
            losaChica:{
                cantidadVentanasAncho: CANTIDAD_VENTANAS_ANCHO - 2,
                cantidadVentanasLargo: CANTIDAD_VENTANAS_LARGO - 2,
                ancho: CANTIDAD_VENTANAS_ANCHO * ANCHO_VENTANA,
                largo: CANTIDAD_VENTANAS_LARGO * ANCHO_VENTANA
            }      
 
        }
 

        this.losa = new FormaConCurva(this._initCurvaLosa(), 0.5, this.glHelper, this.colors.brown);
    }
 
    draw(viewMatrix){
        let identidad = glMatrix.mat4.create();
        glMatrix.mat4.scale(identidad,identidad,[0.01,0.01,0.01]);
        glMatrix.mat4.translate(identidad,identidad,[50,0,-0]);
        this.losa.drawFrom(true, viewMatrix, identidad);
    }
 
    //private
 
    _initCurvaLosa(){
        const margen = 5;
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
 
} 