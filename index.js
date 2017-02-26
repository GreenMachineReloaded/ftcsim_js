window.onload = function() {
    this.canvas = document.getElementById("field");
    this.canvas.style.border = "2px solid black";
    var ctx = canvas.getContext("2d");

    this.bot = new Robot(ctx, 253, canvas.height - 40, 65, 65, 0, "1px solid black", "#ddd");
    this.bot.setRotation(-90);

    this.keysPressed = [];
    this.currentState = "START";

    this.background = new Image();
    this.background.src = "vvmap.png";

    this.tgt = new Target(ctx, 10, 350);

    document.addEventListener("keydown", function(e) {
        window.keysPressed[e.keyCode] = true; // keeps track of pressed keys
    });

    document.addEventListener("keyup", function(e) {
        window.keysPressed[e.keyCode] = false; // indicates that the key is no longer pressed
    });

    window.setInterval(update, 50);
}

function update() {

	var bx = this.bot.getPosition().x - this.bot.size.w/2;
	var by = this.bot.getPosition().y - this.bot.size.h/2;
	var tx = this.tgt.position.x;
	var ty = this.tgt.position.y;

	console.log("x: " + bx + " y: " + by);

	var currentAngle = Math.atan2((bx-tx), (by-ty))*(180/Math.PI);

    if (this.currentState === "START") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 1900) {
            this.stateTime = null;
            this.currentState = "STRAFE_LEFT_TO_BEACON";
        }

        this.bot.setVelocityY(0.6);
    }

    if (this.currentState === "REV") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 10000) {
            this.stateTime = null;
            this.currentState = "START";
        }

        this.bot.setVelocities(0,-.2, 0);
    }

    if (this.currentState === "LEFT") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 2200) {
            this.stateTime = null;
            this.currentState = "FIND_LINE";
        }

        this.bot.setVelocityX(0.3);
    }

	if (this.currentState === "STRAFE_LEFT_TO_BEACON") {
		console.log(currentAngle);

		if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (currentAngle < 50) { // this.bot.getSide("left") < 10
            this.stateTime = null;
            this.currentState = "STRAFE_LEFT_45_TO_BEACON";
        }

        this.bot.setVelocities(0.0, -0.5, 0.0);
	}

	if (this.currentState === "STRAFE_LEFT_45_TO_BEACON") {
		console.log(currentAngle);

		if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (currentAngle > 85) { // this.bot.getSide("left") < 10
            this.stateTime = null;
            this.currentState = null;
        }

        this.bot.setVelocities(0.4, -0.2, 0.0);
	}

    if (this.currentState === "STRAFE_LEFT_BEACON") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 12000) { // this.bot.getSide("left") < 10
            this.stateTime = null;
            this.currentState = null;
        }

        this.bot.setVelocities(0.1, -0.3, 0.0);
    }

    if (this.currentState === "FIND_LINE") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 1800) {
            this.stateTime = null;
            this.currentState = null;
        }

        this.bot.setVelocityY(0.3);
    }

    var ctx = document.getElementById("field").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(this.background, 0, 0);

    this.bot.draw();
    this.tgt.draw();
}

function Target(ctx, x, y) {
    this.context = ctx;
    this.position = {x: x, y: y};
    this.draw = function() {
        this.context.fillStyle = "black";
        this.context.fillRect(this.position.x-5, this.position.y-5, 10, 10);
    }
}

function Robot(ctx, x, y, w, h, r, sc, fc) {
    this.context = ctx;
    this.position = {x: x, y: y, r: r};
    this.size = {w: w, h: h};
    this.color = {fillColor: fc, strokeColor: sc};
    this.velocities = {translationSpeed: {x: 0, y: 0}, rotationSpeed: 0};

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

    this.getPosition = function() { // gets the position of the center of the bot
        return {x: this.position.x + this.size.w/2, y: this.position.y + this.size.h/2};
    };

    this.setVelocities = function(fm, sm, rm) {
        this.velocities.translationSpeed.x = sm;
        this.velocities.translationSpeed.y = fm;
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

    this.getVelocityR = function() { // takes degrees
        return this.velocities.rotationSpeed*(180/Math.PI);
    };

    this.setRotation = function(r) { // takes degrees
        this.position.r = r*(Math.PI/180);
    }

    this.getRotation = function() { // returns degrees
        return this.position.r*(180/Math.PI);
    }

    this.draw = function() {

        this.position.x -= this.velocities.translationSpeed.x * Math.sin(this.position.r) * 3.3;
        this.position.y += this.velocities.translationSpeed.y * Math.sin(this.position.r) * 5;
        this.setRotation(this.getRotation() + this.getVelocityR());

        //Friction simulation
        if (this.velocities.translationSpeed.y < 0.1 && this.velocities.translationSpeed.y > -0.1) {
            this.velocities.translationSpeed.y = 0;
        } else if (this.velocities.translationSpeed.y > 0) {
            this.velocities.translationSpeed.y *= 0.75;
        } else if (this.velocities.translationSpeed.y < 0) {
            this.velocities.translationSpeed.y *= 0.75;
        }

        if (this.velocities.translationSpeed.x < 0.1 && this.velocities.translationSpeed.x > -0.1) {
            this.velocities.translationSpeed.x = 0;
        } else if (this.velocities.translationSpeed.x > 0) {
            this.velocities.translationSpeed.x *= 0.75;
        } else if (this.velocities.translationSpeed.x < 0) {
            this.velocities.translationSpeed.x *= 0.75;
        }

        if (this.velocities.rotationSpeed < 0.01 && this.velocities.rotationSpeed > -0.01) {
            this.velocities.rotationSpeed = 0;
        } else if (this.velocities.rotationSpeed > 0) {
            this.velocities.rotationSpeed *= 0.85;
        } else if (this.velocities.rotationSpeed < 0) {
            this.velocities.rotationSpeed *= 0.85;
        }

        // stops bot from going outside the canvas
        if (this.position.x + this.size.h/2 > this.context.canvas.width
            || this.position.y + this.size.h/2 > this.context.canvas.height
            || this.position.x - this.size.h/2 < 0
            || this.position.y - this.size.h/2 < 0) {
            this.setVelocities(0, 0, 0);
        }

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
