function Robot(ctx, x, y, w, h, r, sc, fc) {
    this.context = ctx;
    this.position = {x: x, y: y, r: r};
    this.size = {w: w, h: h};
    this.color = {fillColor: fc, strokeColor: sc};
    this.velocities = {translationSpeed: {x: 0, y: 0}, rotationSpeed: 0};
    this.frictionMultipler = 0.50; //lose 80% of speed per 1/20 second
    this.drift = {x: 0, y: 0, r: 0};
    this.corners = {
        frontLeft: 0,
        frontRight: 0,
        backLeft: 0,
        backRight: 0
    };

    this.getSide = function(side) {
        switch (side) {
            case "left":
                return this.position.x - this.size.w/2;
            case "right":
                return this.position.x + this.size.w/2;
            case "front":
                return this.position.y + this.size.h/2;
            case "back":
                return this.position.y - this.size.h/2;
        }
    };

    this.getCorners = function() {
        return {
            front_left: {x: (Math.cos(this.position.r) * this.position.x) - this.size.w/2, y: (Math.cos(this.position.r) * this.position.y) - this.size.w/2},
            front_right: {x: this.position.x + this.size.w/2, y: this.position.y - this.size.w/2},
            rear_left: {x: this.position.x - this.size.w/2, y: this.position.y + this.size.w/2},
            rear_right: {x: this.position.x + this.size.w/2, y: this.position.y + this.size.w/2}
        };
    };

    this.getPosition = function() { // gets the position of the center of the bot
        return {x: this.position.x + this.size.w/2, y: this.position.y + this.size.h/2};
    };

    this.setVelocities = function(fm, sm, rm) {
        if (fm !== null) {
            this.velocities.translationSpeed.y = fm;
        }

        if (sm !== null) {
            this.velocities.translationSpeed.x = sm;
        }

        this.velocities.rotationSpeed = rm*(Math.PI/180);
    };

    this.setVelocityY = function(fm) {
        this.velocities.translationSpeed.y = fm;
    };

    this.setVelocityX = function(sm) {
        this.velocities.translationSpeed.x = sm;
    };

    this.setVelocityR = function(rm) { // takes degrees
        this.velocities.rotationSpeed = rm*(Math.PI/180);
    };

    this.getVelocityR = function() { // returns degrees
        return this.velocities.rotationSpeed*(180/Math.PI);
    };

    this.setRotation = function(r) { // takes degrees/second
        this.position.r = r*(Math.PI/180);
    };

    this.getRotation = function() { // returns degrees/second
        return this.position.r*(180/Math.PI);
    };

    this.stop = function() {
        this.velocities.translationSpeed.x = 0;
        this.velocities.translationSpeed.y = 0;
        this.velocities.rotationSpeed = 0;
    };

    this.update = function(interval) {
        var updatesPerSecond = 1000/interval;

        //Friction simulation
        var frictionM = (1-(this.frictionMultipler/updatesPerSecond*20));
        if (this.velocities.translationSpeed.y < 0.01 && this.velocities.translationSpeed.y > -0.01) {
            this.velocities.translationSpeed.y = 0;
        } else if (this.velocities.translationSpeed.y > 0) {
            this.velocities.translationSpeed.y *= frictionM;
        } else if (this.velocities.translationSpeed.y < 0) {
            this.velocities.translationSpeed.y *= frictionM;
        }

        if (this.velocities.translationSpeed.x < 0.01 && this.velocities.translationSpeed.x > -0.01) {
            this.velocities.translationSpeed.x = 0;
        } else if (this.velocities.translationSpeed.x > 0) {
            this.velocities.translationSpeed.x *= frictionM;
        } else if (this.velocities.translationSpeed.x < 0) {
            this.velocities.translationSpeed.x *= frictionM;
        }

        if (this.getVelocityR() < 0.1 && this.getVelocityR() > -0.1) {
            this.setVelocityR(this.getVelocityR() * frictionM);
        } else if (this.getVelocityR() > 0) {
            this.setVelocityR(this.getVelocityR() * frictionM);
        } else if (this.getVelocityR() < 0) {
            this.setVelocityR(this.getVelocityR() * frictionM);
        }

        var xWall = 0;
        var yWall = 0;
        var tSpeed = this.velocities.translationSpeed.y;
        var rSpeed = this.getVelocityR();
        for (c in this.corners) {
            if (c === "frontLeft" || c === "frontRight") {
                if (this.corners[c].x > this.context.canvas.width || this.corners[c].x < 0) {
                    xWall = -tSpeed-2;
                }

                if (this.corners[c].y > this.context.canvas.height || this.corners[c].y < 0) {
                    yWall = -tSpeed-2;
                }
            } else if (c === "backLeft" || c === "backRight") {
                if (this.corners[c].x > this.context.canvas.width || this.corners[c].x < 0) {
                    xWall = tSpeed+2;
                }

                if (this.corners[c].y > this.context.canvas.height || this.corners[c].y < 0) {
                    yWall = tSpeed+2;
                }
            }
        }

        this.position.x += ((tSpeed + xWall)/2 * Math.cos(this.position.r));
        this.position.y += ((tSpeed + yWall)/2 * Math.sin(this.position.r));

        this.position.x -= (this.velocities.translationSpeed.x/2 * Math.sin(this.position.r)) * (2/3);
        this.position.y += (this.velocities.translationSpeed.x/2 * Math.cos(this.position.r)) * (2/3);
        this.setRotation(this.getRotation() + (rSpeed/updatesPerSecond));

        this.corners = {
            frontLeft: {
                x: (Math.cos(this.position.r)*(this.size.w/2) - Math.sin(this.position.r)*(-this.size.h/2)) + this.position.x,
                y: (Math.sin(this.position.r)*(this.size.w/2) + Math.cos(this.position.r)*(-this.size.h/2)) + this.position.y
            },
            frontRight: {
                x: (Math.cos(this.position.r)*(this.size.w/2) - Math.sin(this.position.r)*(this.size.h/2)) + this.position.x,
                y: (Math.sin(this.position.r)*(this.size.w/2) + Math.cos(this.position.r)*(this.size.h/2)) + this.position.y
            },
            backLeft: {
                x: (Math.cos(this.position.r)*(-this.size.w/2) - Math.sin(this.position.r)*(-this.size.h/2)) + this.position.x,
                y: (Math.sin(this.position.r)*(-this.size.w/2) + Math.cos(this.position.r)*(-this.size.h/2)) + this.position.y
            },
            backRight: {
                x: (Math.cos(this.position.r)*(-this.size.w/2) - Math.sin(this.position.r)*(this.size.h/2)) + this.position.x,
                y: (Math.sin(this.position.r)*(-this.size.w/2) + Math.cos(this.position.r)*(this.size.h/2)) + this.position.y
            }
        };
    };

    this.draw = function() {
        //do drawing
        this.context.save();

        //do intial positioning and rotation relative to center of object
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.position.r + Math.PI/2);

        //draw object
        this.context.translate(-(this.size.w / 2),-(this.size.h / 2)); // move origin to top left corner of object

        this.context.beginPath();
        this.context.fillStyle = "#eee";
        this.context.fillRect(0, 0, this.size.w, this.size.h);
        this.context.strokeStyle = "black";
        this.context.strokeRect(0, 0, this.size.w, this.size.h);
        this.context.closePath();

        this.context.fillStyle = "black";
        this.context.fillRect(this.size.w/2 - 3, this.size.h/2 - 3, 6, 6);

        this.context.restore();

        this.context.fillStyle = "#0ff";
        this.context.fillRect(this.corners.frontRight.x - 3, this.corners.frontRight.y - 3, 6, 6);
        this.context.fillStyle = "#0f0";
        this.context.fillRect(this.corners.frontLeft.x - 3, this.corners.frontLeft.y - 3, 6, 6);
        this.context.fillStyle = "#f00";
        this.context.fillRect(this.corners.backLeft.x - 3, this.corners.backLeft.y - 3, 6, 6);
        this.context.fillStyle = "#f0f";
        this.context.fillRect(this.corners.backRight.x - 3, this.corners.backRight.y - 3, 6, 6);
    };
}
