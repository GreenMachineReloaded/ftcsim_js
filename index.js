window.onload = function() {
    this.canvas = document.getElementById("field");
    this.canvas.style.border = "2px solid black";
    var ctx = canvas.getContext("2d");

    this.bot = new Robot(ctx, 260, canvas.height - 32, 65, 65, 0, "1px solid black", "#ddd");
    this.bot.setRotation(-90);

    this.keysPressed = [];
    this.currentState = "START";

    this.background = new Image();
    this.background.src = "vvmap.png";

    this.tgt = new Target(ctx, 5, 345);

    document.addEventListener("keydown", function(e) {
        window.keysPressed[e.keyCode] = true; // keeps track of pressed keys
    });

    document.addEventListener("keyup", function(e) {
        window.keysPressed[e.keyCode] = false; // indicates that the key is no longer pressed
    });

    window.setInterval(update, 50);
}

function update() {

    console.log("x: " + parseInt(this.bot.position.x) + ", y: " + parseInt(this.bot.position.y));
    var bx = this.bot.position.x-37;
    var by = this.bot.position.y;
    var tx = this.tgt.position.x;
    var ty = this.tgt.position.y;
    console.log((1/Math.sqrt(((bx-tx)*(bx-tx)) + ((by-ty)*(by-ty))))*(bx-tx));
    console.log((1/Math.sqrt(((bx-tx)*(bx-tx)) + ((by-ty)*(by-ty))))*(by-ty));

    if (this.currentState === "START") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 2500) {
            this.stateTime = null;
            this.currentState = "STRAFE_TO_BEACON";
        }

        this.bot.setVelocityY(0.5);
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

    if (this.currentState === "STRAFE_TO_BEACON") {
        if (!this.stateTime) {
            this.stateTime = Date.now();
        } else if (Date.now() - this.stateTime > 5000) {
            this.stateTime = null;
            this.currentState = null;
        }

        this.bot.setVelocities((1/Math.sqrt(((bx-tx)*(bx-tx)) + ((by-ty)*(by-ty))))*(by-ty)/3, (1/Math.sqrt(((bx-tx)*(bx-tx)) + ((by-ty)*(by-ty))))*(bx-tx)/3, 0);
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
        this.context.fillRect(this.position.x, this.position.y, 10, 10);
    }
}

function Robot(ctx, x, y, w, h, r, sc, fc) {
    this.context = ctx;
    this.position = {x: x, y: y, r: r};
    this.size = {w: w, h: h};
    this.color = {fillColor: fc, strokeColor: sc};
    this.velocities = {translationSpeed: {x: 0, y: 0}, rotationSpeed: 0};

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

        this.position.x += (this.velocities.translationSpeed.y * 10) * Math.cos(this.position.r);
        this.position.y += (this.velocities.translationSpeed.y * 6.6) * Math.sin(this.position.r);
        this.position.x += (this.velocities.translationSpeed.x * 10) * Math.sin(this.position.r);
        this.position.y += (this.velocities.translationSpeed.x * 6.6) * Math.cos(this.position.r);
        this.setRotation(this.getRotation() + this.getVelocityR());
        //this.setRotation(100);

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
        /*this.context.moveTo(this.size.w/2, 0);
        this.context.lineTo(this.size.w, this.size.height);
        this.context.lineTo(0, this.size.height);
        this.context.fill();*/

        this.context.closePath();
        this.context.restore();
    };
}
