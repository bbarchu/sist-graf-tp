import { OrbitalCamera } from "../camera/OrbitalCamera.js";
import { GruaCamera } from "../camera/GruaCamera.js";

export class CameraControl {
  constructor(canvas, grua) {
    this.canvas = canvas;
    this.cameraGrua = new GruaCamera(grua);
    this.orbitalCamera = new OrbitalCamera(canvas);

    this.camera = this.orbitalCamera;
    this.camera.setEventListeners(this.canvas);

    this._addEventListeners(canvas);
  }

  getViewMatrix() {
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
        console.log("no hay camera");
      }

      if (event.keyCode == 51) {
        // camera 3
        this.camera = this.cameraGrua;

        this.camera.setEventListeners();
        this._addEventListeners(canvas);
      }
    });
  }
}
