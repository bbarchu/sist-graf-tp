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

        this.losa = new FormaConCurva(this._initCurvaLosa, 0.01, this.glHelper, this.colors.brown);
        
    }

    draw(viewMatrix){
        let identidad = glMatrix.mat4.create();
        glMatrix.mat4.translate(identidad,identidad,[1,-0.5,0]);
        this.losa.drawFrom(true, viewMatrix, identidad);
    }

    //private

    _initCurvaLosa(){
        let xi = - this.dim.largo/2 - 1;
        let xf = this.dim.largo/2 + 1;

        let yi = - this.dim.ancho/2 - 1;
        let yf = this.dim.ancho/2 + 1;

        const xd = xf/3;
        const yd = yf/3;

        let puntosControl = [
            [xi , yi],
            [xi + xd, yi],
            [xi + 2 * xd, yi],
            [xi + 3 * xd, yi],
            [xf - 2 * xd, yi],
            [xf - 1 * xd, yi],
            [xf, yi],
            [xf, yi + yd],
            [xf, yi + 2 * yd],
            [xf, yi + 3 * yd],
            [xf, yf - 2 * yd], 
            [xf, yf - 1 * yd],
            [xf, yf],
            [xf - 1 * xd ,yf],
             [xf - 2 * xd,yf],
            [xi + 3 * xd,yf],
            [xi + 2 * xd,yf],
            [xi + xd,yf],
            [xi ,yf],
            [xi,yf - 1 * yd],
            [xi,yf - 2 * yd],
            [xi,yi + 3 * yd],
            [xi,yi + 2 * yd],
            [xi,yi + yd],
            [xi,yi]
        ]

        return this._construirCurvaLosa(puntosControl);
    }

    _construirCurvaLosa(puntos){
        let curva = []

        for(let i=0; i < 24; i++){
            curva.concat(this.dibujadorBSplineCuadratico.getVertices([[puntos[i],puntos[i+1],puntos[i+2]]]));
        }

        return curva;

    }

} 