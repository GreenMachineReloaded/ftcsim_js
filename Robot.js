function Robot(ctx, x, y, w, h, r, sc, fc) {
    this.context = ctx;
    this.position = {x: x, y: y, r: r};
    this.size = {w: w, h: h};
    this.color = {fillColor: fc, strokeColor: sc};
    this.velocities = {translationSpeed: {x: 0, y: 0}, rotationSpeed: 0};
    this.frictionMultipler = 0.50; //lose 80% of speed per 1/20 second
    this.drift = {x: 0, y: 0, r: 0};

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
        if (fm) {
            this.velocities.translationSpeed.y = fm;
        }

        if (sm) {
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

        /* stops bot from going outside the canvas
        var corners = this.getCorners();
        for (var c in corners) {
            for (var v in corners[c]) {

                if (corners[c][v] < 10 || corners[c][v] > this.context.canvas.width - 10 || corners[c][v] > this.context.canvas.height - 10) {
                    this.stop();
                }
            }
        }*/

        //Friction simulation
        var frictionM = (1-(this.frictionMultipler/updatesPerSecond*20));
        if (this.velocities.translationSpeed.y < 0.001 && this.velocities.translationSpeed.y > -0.001) {
            this.velocities.translationSpeed.y = 0;
        } else if (this.velocities.translationSpeed.y > 0) {
            this.velocities.translationSpeed.y *= frictionM;
        } else if (this.velocities.translationSpeed.y < 0) {
            this.velocities.translationSpeed.y *= frictionM;
        }

        if (this.velocities.translationSpeed.x < 0.001 && this.velocities.translationSpeed.x > -0.001) {
            this.velocities.translationSpeed.x = 0;
        } else if (this.velocities.translationSpeed.x > 0) {
            this.velocities.translationSpeed.x *= frictionM;
        } else if (this.velocities.translationSpeed.x < 0) {
            this.velocities.translationSpeed.x *= frictionM;
        }

        if (this.velocities.rotationSpeed < 0.001 && this.velocities.rotationSpeed > -0.001) {
            this.velocities.rotationSpeed = 0;
        } else if (this.velocities.rotationSpeed > 0) {
            this.velocities.rotationSpeed *= frictionM;
        } else if (this.velocities.rotationSpeed < 0) {
            this.velocities.rotationSpeed *= frictionM;
        }

		if (this.velocities.translationSpeed.x || this.velocities.translationSpeed.y || this.velocities.rotationSpeed) {
            var tmpDriftX = (Math.random()-0.5)*0.7;
            var tmpDriftY = (Math.random()-0.5)*0.7;
            var tmpDriftR = (Math.random()-0.5)/2;
			this.drift.x = (this.drift.x + tmpDriftX) / 2;
			this.drift.y = (this.drift.y + tmpDriftY) / 2;
			this.drift.r = (this.drift.r + tmpDriftR) / 2;
		}

        this.position.x += ((this.velocities.translationSpeed.y * Math.cos(this.position.r))) + this.drift.x;
        this.position.y += ((this.velocities.translationSpeed.y * Math.sin(this.position.r))) + this.drift.y;

        this.position.x -= ((this.velocities.translationSpeed.x * Math.sin(this.position.r)) * (2/3));
        this.position.y += ((this.velocities.translationSpeed.x * Math.cos(this.position.r)) * (2/3));
        this.setRotation(this.getRotation() + (this.getVelocityR()/updatesPerSecond) + this.drift.r);
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
    };
}
