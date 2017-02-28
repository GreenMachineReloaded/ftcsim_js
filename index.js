var App = {};

window.onload = function() {
    App.canvas = document.getElementById("field");
    App.canvas.style.border = "2px solid black";
    var ctx = App.canvas.getContext("2d");

    App.objects = {};
    App.objects.bot = new Robot(ctx, 253, App.canvas.height - 43, 65, 65, 0, "1px solid black", "#ddd");
    App.objects.bot.setRotation(-90);

    App.keysPressed = [];
    App.currentState = "START";

    App.background = new Image();
    App.background.src = "vvmap.png";

    App.objects.tgt = new Target(ctx, 10, 350);

    App.keysPressed = [];

    document.addEventListener("keydown", function(e) {
        App.keysPressed[e.keyCode] = true; // keeps track of pressed keys
    });

    document.addEventListener("keyup", function(e) {
        App.keysPressed[e.keyCode] = false; // indicates that the key is no longer pressed
    });

    window.setInterval(update, 5, 5);
    window.setInterval(draw, 21, 21);
};

function update(interval) {
    this.timer = Date.now();
    var bx = App.objects.bot.getPosition().x - App.objects.bot.size.w/2;
    var by = App.objects.bot.getPosition().y - App.objects.bot.size.h/2;
    var tx = App.objects.tgt.position.x;
    var ty = App.objects.tgt.position.y;

    var xDistToBeacon = bx - tx;
	var yDistToBeacon = by - ty;
    var currentAngle = Math.atan2((bx-tx), (by-ty))*(180/Math.PI);

    if (App.currentState === "START") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 1700) {
            App.stateTime = null;
            App.currentState = "STRAFE_LEFT_TO_BEACON";
        }

        App.objects.bot.setVelocityY(0.7);
    }

    if (App.currentState === "REV") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 10000) {
            App.stateTime = null;
            App.currentState = "START";
        }

        App.objects.bot.setVelocities(0,-.2, 0);
    }

    if (App.currentState === "LEFT") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 2200) {
            App.stateTime = null;
            App.currentState = "FIND_LINE";
        }

        App.objects.bot.setVelocityX(0.3);
    }

    if (App.currentState === "STRAFE_LEFT_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (currentAngle < 50) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = "STRAFE_LEFT_45_TO_BEACON";
        }

        App.objects.bot.setVelocityX(-0.5);
    }

    if (App.currentState === "STRAFE_LEFT_45_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (currentAngle > 85) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = null;
        }

        App.objects.bot.setVelocities(0.4, -0.2, 0.0);
    }

    if (App.currentState === "STRAFE_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (xDistToBeacon < 55) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = "TELEOP";
        }

		if (currentAngle > 91) {
			App.objects.bot.setVelocityY(-0.2);
		}

		if (currentAngle < 89) {
			App.objects.bot.setVelocityY(0.2);
		}

        App.objects.bot.setVelocityX(-0.3);
    }

	if (App.currentState === "TELEOP") {
		if (!App.stateTime) {
            App.stateTime = Date.now();
        }

		if (App.keysPressed[87]) {
			App.objects.bot.setVelocityY(0.7);
		}

		if (App.keysPressed[83]) {
			App.objects.bot.setVelocityY(-0.7);
		}

		if (App.keysPressed[65]) {
			App.objects.bot.setVelocityX(-0.7);
		}

		if (App.keysPressed[68]) {
			App.objects.bot.setVelocityX(0.7);
		}

		if (App.keysPressed[81]) {
			App.objects.bot.setVelocityR(-75);
		}

		if (App.keysPressed[69]) {
			App.objects.bot.setVelocityR(75);
		}
	}

    if (App.currentState === "STRAFE_LEFT_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 12000) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = null;
        }

        App.objects.bot.setVelocities(0.1, -0.3, 0.0);
    }

    App.objects.bot.update(interval);
    if (Date.now() - this.timer > 0) console.log((Date.now() - this.timer) + "ms");
}

function draw() {
    var ctx = document.getElementById("field").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(App.background, 0, 0);

    App.objects.bot.draw();
    App.objects.tgt.draw();
}
