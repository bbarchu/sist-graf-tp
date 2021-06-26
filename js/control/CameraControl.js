import { OrbitalCamera } from "../camera/OrbitalCamera.js"

export class CameraControl {
    constructor(canvas) {

        this.canvas = canvas;
        this.camera = new OrbitalCamera(canvas)
        this.camera.use(this.canvas);
    }

    getViewMatrix() {
        return this.camera.getViewMatrix();
    }

    getCameraPosition() {
        return this.camera.getPosition();
    }

}