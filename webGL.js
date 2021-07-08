

import { DibujadorDeGeometrias } from './moduloGeometria.js';

import { CameraControl } from "./js/control/CameraControl.js"
import { Grua } from './js/object3D/Grua.js';
import { Edificio } from './js/object3D/Edificio.js';

   
var mat4=glMatrix.mat4;
var mat3=glMatrix.mat3;
var vec3=glMatrix.vec3;

var gl = null,
canvas = null,
dibGeo,
time,
lighting,
glProgram = null,
fragmentShader = null,
vertexShader = null,
cameraControl,
plano,esfera, cubo, forma, grua, edificio;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;


function initWebGL(){

    canvas = document.getElementById("my-canvas");  

    try{
        gl = canvas.getContext("webgl");      

    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {

        setupWebGL();
        glProgram = initShaders();
        setupVertexShaderMatrix();
        dibGeo = new DibujadorDeGeometrias(gl,glProgram)
        cameraControl = new CameraControl(canvas);

        grua = new Grua(gl, glProgram, projMatrix, dibGeo);
        edificio = new Edificio(gl, glProgram, projMatrix, dibGeo);

        tick();   

    }else{    
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

}



function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva

    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100.0);
    
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix,modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -5.0]);
}  

               
function initShaders() {
    //get shader source
    var fs_source = document.getElementById('shader-fs').innerHTML,
        vs_source = document.getElementById('shader-vs').innerHTML;

    //compile shaders    
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
    

    //create program
    glProgram = gl.createProgram();
    
    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    
    //use program
    gl.useProgram(glProgram);

    //             
    glProgram.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aPosition");
    gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);

    glProgram.textureCoordAttribute = gl.getAttribLocation(glProgram, "aUv");
    gl.enableVertexAttribArray(glProgram.textureCoordAttribute);

    glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aNormal");
    gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);

    glProgram.materialColorUniform = gl.getUniformLocation(glProgram, "materialColor");

    glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, "uPMatrix");
    glProgram.mMatrixUniform = gl.getUniformLocation(glProgram, "uMMatrix");
    glProgram.vMatrixUniform = gl.getUniformLocation(glProgram, "uVMatrix");
    glProgram.nMatrixUniform = gl.getUniformLocation(glProgram, "uNMatrix");
    glProgram.samplerUniform = gl.getUniformLocation(glProgram, "uSampler");
    glProgram.useLightingUniform = gl.getUniformLocation(glProgram, "uUseLighting");
    glProgram.ambientColorUniform = gl.getUniformLocation(glProgram, "uAmbientColor");
    glProgram.frameUniform = gl.getUniformLocation(glProgram, "time");
    glProgram.lightingDirectionUniform = gl.getUniformLocation(glProgram, "uLightPosition");
    glProgram.directionalColorUniform = gl.getUniformLocation(glProgram, "uDirectionalColor");
    //

    return glProgram;
}
       
function makeShader(src, type){
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function setupVertexShaderMatrix(){
    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}
       
function setMatrixUniforms() {
        
    gl.uniformMatrix4fv(glProgram.mMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(glProgram.vMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, projMatrix);

    var normalMatrix = mat3.create();
    mat3.fromMat4(normalMatrix,modelMatrix); // normalMatrix= (inversa(traspuesta(modelMatrix)));

    mat3.invert(normalMatrix, normalMatrix);
    mat3.transpose(normalMatrix,normalMatrix);

    gl.uniformMatrix3fv(glProgram.nMatrixUniform, false, normalMatrix);
}

function drawScene(dibGeo){
    // Se configura el viewport dentro del "canvas". 
    // En este caso se utiliza toda el área disponible
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
    gl.clearColor(0.2,0.2,0.2,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se configura la matriz de proyección
    mat4.identity(projMatrix);
    mat4.perspective(projMatrix, 30, canvas.width / canvas.height, 0.1, 100.0);
    mat4.scale(projMatrix,projMatrix,[1,-1,1]); // parche para hacer un flip de Y, parece haber un bug en glmatrix
        
    // Se inicializan las variables asociadas con la Iluminación
    
    gl.uniform1f(glProgram.frameUniform, time/10.0 );
    gl.uniform3f(glProgram.ambientColorUniform, 0.6, 0.6, 0.6 );
    gl.uniform3f(glProgram.directionalColorUniform, 1.2, 1.1, 0.7);
    gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));
    
    // Definimos la ubicación de la camara                        
    
    //agrego esto
    var m_trans = mat4.create();
    mat4.identity(m_trans);
    viewMatrix = cameraControl.getViewMatrix(); 
         
    var lightPosition = [10.0,0.0, 3.0];  
    gl.uniform3fv(glProgram.lightingDirectionUniform, lightPosition);            
    
    edificio.draw(viewMatrix);
    grua.draw(viewMatrix);

}



function animate(){
    
    rotate_angle += 0.01;
    mat4.identity(modelMatrix);
    mat4.rotate(modelMatrix,modelMatrix, rotate_angle, [1.0, 0.0, 1.0]);


    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix,viewMatrix,modelMatrix);
    mat4.invert(normalMatrix,normalMatrix);
    mat4.transpose(normalMatrix,normalMatrix);

}
      
       
function tick(){

    requestAnimationFrame(tick);
    time+=1/60;

    drawScene(dibGeo);

    //animate();
}

window.onload=initWebGL;