import { OrbitalCamera } from "../camera/OrbitalCamera.js";
import { GruaCamera } from "../camera/GruaCamera.js";
import { DroneCameraControl } from "../camera/droneCamera.js";

export class CameraControl {
  constructor(canvas, grua, gl, glPrograms) {
    this.glHelper = { gl: gl, glProgram: glPrograms };

    this.canvas = canvas;
    this.cameraGrua = new GruaCamera(grua, this.glHelper);
    this.orbitalCamera = new OrbitalCamera(canvas, this.glHelper);

    this.camera = this.orbitalCamera;
    this.camera.setEventListeners(this.canvas);

    this._addEventListeners(canvas);
  }

  getViewMatrix() {
    this.camera.update();
    return this.camera.getViewMatrix();
  }

  getCameraPosition() {
    return this.camera.getPosition();
  }

  _addEventListeners(canvas) {
    window.addEventListener("keydown", (event) => {
      if (event.keyCode == 49) {
        // camera 1
        this.camera = this.orbitalCamera;
        this.camera.setEventListeners(canvas);
        this._addEventListeners(canvas);
      }
      if (event.keyCode == 50) {
        // camera 2
        this.droneCamera = new DroneCameraControl(
          [-0.3, 0.2, 1.4],
          this.glHelper
        );
        this.camera = this.droneCamera;
        this.camera.update();
        this._addEventListeners(canvas);
      }

      if (event.keyCode == 51) {
        // camera 3
        this.camera = this.cameraGrua;

        this.camera.setEventListeners();
        this.camera._updateCamera();
        this._addEventListeners(canvas);
      }
    });
  }
}
