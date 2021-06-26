export class OrbitalCamera {
    constructor(canvas) {
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseDown = false;
        this.radius = 1;
        this.phi = Math.PI/4;
        this.theta = Math.PI;
        this.moveSpeed = 0.025;
        this.zoomSpeed = 0.025;

        this.viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(this.viewMatrix);

        this.position = [0, 0, -0];
        this.up_vector = [0, 1, 0];
        this.target = [0, 0, 0];

        this._setEventListeners(canvas);
        this._updateCamera();
    }

    getViewMatrix() {
        return this.viewMatrix;
    }

    use(canvas) {
        this._setEventListeners(canvas);
    }

    getPosition() {
        return this.position;
    }

    // private

    _setEventListeners(canvas) {
        window.onkeydown = (event) => {
            if (event.keyCode == 49) {
                // zoom in 1
                this.radius -= this.zoomSpeed ;
                this._updateCamera();
            }

            if (event.keyCode == 50) {
                // zoom out 2
                this.radius += this.zoomSpeed ;
                this._updateCamera();

            }
        }

        canvas.onmousedown = (event) => {
            this.mouseDown = true;
        }

        canvas.onmouseup = (event) => {
            this.mouseDown = false;
            this.lastMouseX = 0;
            this.lastMouseY = 0;

        }

        canvas.onmousemove = (event) => {
            if (this.mouseDown) {
                var delta_X=0;
                var delta_Y=0;

                if (this.lastMouseX) delta_X = mouse.x - this.lastMouseX;
                if (this.lastMouseY) delta_Y = mouse.y - this.lastMouseY;

                this.lastMouseX = mouse.x;
                this.lastMouseY = mouse.y;

                this.phi = this.phi + delta_X * this.moveSpeed;
                this.theta = this.theta + delta_Y * this.moveSpeed;


                this._updateCamera();
            }
        }
    }

    _updateCamera() {
        var x = this.radius * Math.sin((this.theta)) * Math.cos(this.phi);
        var y = this.radius * Math.cos(this.theta);
        var z = this.radius * Math.sin(this.theta) * Math.sin(this.phi);
        this.position = [x, y, z];

        glMatrix.mat4.lookAt(this.viewMatrix,
            this.position,
            this.target,
            this.up_vector
        );
      
    }
}