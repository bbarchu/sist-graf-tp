import { DibujadorDeGeometrias } from "./moduloGeometria.js";

import { CameraControl } from "./js/control/CameraControl.js";
import { Grua } from "./js/object3D/Grua.js";
import { Edificio } from "./js/object3D/Edificio.js";
import { Tobogan } from "./js/object3D/Tobogan.js";
import { Tierra } from "./js/object3D/Tierra.js";
import { Cielo } from "./js/object3D/Cielo.js";

import { Menu } from "./js/helper/Menu.js";

var mat4 = glMatrix.mat4;
var mat3 = glMatrix.mat3;
var vec3 = glMatrix.vec3;

var gl = null,
  canvas = null,
  dibGeo,
  time,
  lighting,
  glProgram = null,
  glProgramTexture = null,
  glProgramNoise = null,
  glProgramSky = null,
  glProgramWindow = null,
  fragmentShader = null,
  vertexShader = null,
  cameraControl,
  plano,
  esfera,
  cubo,
  forma,
  grua,
  edificio,
  menu,
  tobogan,
  tierra,
  cielo;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

function initCubeTexture() {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: "./img/px.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: "./img/nx.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: "./img/ny.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: "./img/py.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: "./img/pz.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: "./img/nz.jpg",
    },
  ];
  faceInfos.forEach((faceInfo) => {
    const { target, url } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      0,
      format,
      type,
      null
    );

    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener("load", function () {
      // Now that the image has loaded upload it to the texture.

      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(
    gl.TEXTURE_CUBE_MAP,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
}

function initTexture(file) {
  var texture = gl.createTexture();
  texture.image = new Image();

  return new Promise((resolve, reject) => {
    texture.image.onload = async () => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // invierto el ejeY
      gl.bindTexture(gl.TEXTURE_2D, texture); // activo la textura

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
      ); // cargo el bitmap en la GPU

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // selecciono filtro de magnificacion
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      ); // selecciono filtro de minificacion

      gl.generateMipmap(gl.TEXTURE_2D); // genero los mipmaps
      gl.bindTexture(gl.TEXTURE_2D, null);

      resolve(texture);
    };
    texture.image.src = file;
  });
}

async function initWebGL() {
  canvas = document.getElementById("my-canvas");

  try {
    gl = canvas.getContext("webgl");
  } catch (e) {
    alert("Error: Your browser does not appear to support WebGL.");
  }

  if (gl) {
    let textures = await {
      tierra: await initTexture("./img/tierra.jpg"),
      roca: await initTexture("./img/roca.jpg"),
      pasto: await initTexture("./img/pasto.jpg"),
      grid: await initTexture("./img/uvgrid.jpg"),
      stone: await initTexture("./img/stone.jpg"),
      sandy: await initTexture("./img/sandyGravel.jpg"),
      concrete: await initTexture("./img/concrete.jpg"),
      wooden: await initTexture("./img/wooden.jpg"),
      pintura: await initTexture("./img/po.jpg"),
      sky: await initCubeTexture(),
    };

    resize();
    setupWebGL();
    glProgramTexture = initShaders("shader-fs-texture", "shader-vs-texture");
    glProgramNoise = initShaders("shader-fs-noise", "shader-vs-noise");
    glProgramSky = initShaders("shader-fs-sky", "shader-vs-sky");
    glProgramWindow = initShaders("shader-fs-window", "shader-vs-window");
    glProgram = initShaders("shader-fs", "shader-vs");

    let glPrograms = {
      color: glProgram,
      texture: glProgramTexture,
      noise: glProgramNoise,
      window: glProgramWindow,
    }; //tiene que coincidir con los tipos definidos en extrusion
    //setupVertexShaderMatrix(glProgram);
    dibGeo = new DibujadorDeGeometrias(gl, glProgram);
    grua = new Grua(gl, glPrograms, projMatrix, dibGeo, textures);
    cameraControl = new CameraControl(canvas, grua, gl, glPrograms);
    grua.setCameraControl(cameraControl);
    cielo = await new Cielo(gl, glProgramSky, projMatrix, textures.sky);

    edificio = await new Edificio(
      gl,
      glPrograms,
      projMatrix,
      dibGeo,
      textures,
      cameraControl
    );
    tobogan = await new Tobogan(
      gl,
      glPrograms,
      projMatrix,
      dibGeo,
      textures,
      cameraControl
    );
    tierra = await new Tierra(
      gl,
      glPrograms,
      projMatrix,
      dibGeo,
      textures,
      cameraControl
    );

    menu = await new Menu(edificio, tobogan);
    initMenu();

    tick();
  } else {
    alert("Error: Your browser does not appear to support WebGL.");
  }
}

function initMenu() {
  var gui = new dat.GUI();
  gui.add(menu, "pisosTramo1", 1).step(1);
  gui.add(menu, "pisosTramo2", 1).step(1);
  gui.add(menu, "columnas", 4).step(1);
  gui.add(menu, "ventanasLargo", 4).step(1);
  gui.add(menu, "ventanasAncho", 4).step(1);
  gui.add(menu, "tramosTobogan", 4).step(1);
  gui.add(menu, "onMenuClick").name("Refresh");
}

function setupWebGL() {
  gl.enable(gl.DEPTH_TEST);
  //set the clear color
  gl.clearColor(0.1, 0.1, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Matrix de Proyeccion Perspectiva

  mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

  /*mat4.identity(modelMatrix);
  mat4.rotate(modelMatrix, modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

  mat4.identity(viewMatrix);
  mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);*/
}

function initShaders(fs, vs) {
  //get shader source
  var fs_source = document.getElementById(fs).innerHTML,
    vs_source = document.getElementById(vs).innerHTML,
    //compile shaders
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
  fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

  //create program
  let glProgram = gl.createProgram();

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
  glProgram.vertexPositionAttribute = gl.getAttribLocation(
    glProgram,
    "aPosition"
  );
  gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);

  glProgram.textureCoordAttribute = gl.getAttribLocation(glProgram, "aUv");
  gl.enableVertexAttribArray(glProgram.textureCoordAttribute);

  glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aNormal");
  gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);

  glProgram.materialColorUniform = gl.getUniformLocation(
    glProgram,
    "materialColor"
  );

  glProgram.viewPos = gl.getUniformLocation(glProgram, "viewPos");
  glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, "uPMatrix");
  glProgram.mMatrixUniform = gl.getUniformLocation(glProgram, "uMMatrix");
  glProgram.vMatrixUniform = gl.getUniformLocation(glProgram, "uVMatrix");
  glProgram.nMatrixUniform = gl.getUniformLocation(glProgram, "uNMatrix");
  glProgram.samplerUniform = gl.getUniformLocation(glProgram, "uSampler");
  glProgram.useLightingUniform = gl.getUniformLocation(
    glProgram,
    "uUseLighting"
  );
  glProgram.ambientColorUniform = gl.getUniformLocation(
    glProgram,
    "uAmbientColor"
  );
  glProgram.frameUniform = gl.getUniformLocation(glProgram, "time");
  glProgram.lightingDirectionUniform = gl.getUniformLocation(
    glProgram,
    "uLightPosition"
  );
  glProgram.directionalColorUniform = gl.getUniformLocation(
    glProgram,
    "uDirectionalColor"
  );

  glProgram.samplerUniform0 = gl.getUniformLocation(glProgram, "uSampler0");
  glProgram.samplerUniform1 = gl.getUniformLocation(glProgram, "uSampler1");
  glProgram.samplerUniform2 = gl.getUniformLocation(glProgram, "uSampler2");

  glProgram.skybox = gl.getUniformLocation(glProgram, "u_skybox");
  glProgram.projectionInverse = gl.getUniformLocation(
    glProgram,
    "u_viewDirectionProjectionInverse"
  );

  //

  return glProgram;
}

function makeShader(src, type) {
  //compile the vertex shader
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function setSharedUniforms(glProgram) {
  // Se inicializan las variables asociadas con la Iluminación

  gl.uniform1f(glProgram.frameUniform, time / 10.0);
  gl.uniform3f(glProgram.ambientColorUniform, 1, 1, 1);
  gl.uniform3f(glProgram.directionalColorUniform, 1.2, 1.1, 0.7);
  gl.uniform1i(glProgram.useLightingUniform, lighting == "true");

  var lightPosition = [10.0, 0.0, 3.0];
  gl.uniform3fv(glProgram.lightingDirectionUniform, lightPosition);
}

function drawScene() {
  // Se configura el viewport dentro del "canvas".
  // En este caso se utiliza toda el área disponible
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Se habilita el color de borrado para la pantalla (Color Buffer) y otros buffers
  gl.clearColor(0.2, 0.2, 0.2, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Se configura la matriz de proyección
  //mat4.identity(projMatrix);
  //mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
  //mat4.scale(projMatrix, projMatrix, [1, -1, 1]); // parche para hacer un flip de Y, parece haber un bug en glmatrix

  // Definimos la ubicación de la camara

  //agrego esto
  var m_trans = mat4.create();
  mat4.identity(m_trans);
  viewMatrix = cameraControl.getViewMatrix();

  cielo.draw(viewMatrix);
  tierra.draw(viewMatrix);
  edificio.draw(viewMatrix);
  grua.draw(viewMatrix);
  tobogan.draw(viewMatrix);
}

//var tickCount = 0;
function tick() {
  //if(tickCount % 2 == 0){
  time += 1 / 60;
  //drawScene(dibGeo);

  // };
  //tickCount++;

  drawScene(dibGeo);

  requestAnimationFrame(tick);

  //animate();
}

function resize() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let wf = width / 16;
  let hf = height / 9;
  if (wf > hf) {
    height *= 0.9;
    width = (16 * height) / 9;
  } else {
    width *= 0.9;
    height = (9 * width) / 16;
  }
  width = Math.round(width);
  height = Math.round(height);
  canvas.width = width;
  canvas.height = height;
  setupWebGL();
}

window.addEventListener(
  "resize",
  (event) => {
    resize(event);
  },
  false
);

window.onload = initWebGL;
