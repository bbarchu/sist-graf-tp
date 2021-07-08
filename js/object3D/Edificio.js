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


    }



    draw(viewMatrix){

    }

    //private


} 