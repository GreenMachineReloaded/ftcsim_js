var App = {};

window.onload = function() {
    App.canvas = document.getElementById("field");
    App.canvas.style.border = "2px solid black";
    var ctx = App.canvas.getContext("2d");

    App.bot = new Robot(ctx, 253, App.canvas.height - 43, 65, 65, 0, "1px solid black", "#ddd");
    App.bot.setRotation(-90);

    App.keysPressed = [];
    App.currentState = "START";

    App.background = new Image();
    App.background.src = "vvmap.png";

    App.tgt = new Target(ctx, 10, 350);

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
    var bx = App.bot.getPosition().x - App.bot.size.w/2;
    var by = App.bot.getPosition().y - App.bot.size.h/2;
    var tx = App.tgt.position.x;
    var ty = App.tgt.position.y;

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

        App.bot.setVelocityY(0.7);
    }

    if (App.currentState === "REV") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 10000) {
            App.stateTime = null;
            App.currentState = "START";
        }

        App.bot.setVelocities(0,-.2, 0);
    }

    if (App.currentState === "LEFT") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 2200) {
            App.stateTime = null;
            App.currentState = "FIND_LINE";
        }

        App.bot.setVelocityX(0.3);
    }

    if (App.currentState === "STRAFE_LEFT_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (currentAngle < 50) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = "STRAFE_LEFT_45_TO_BEACON";
        }

        App.bot.setVelocityX(-0.5);
    }

    if (App.currentState === "STRAFE_LEFT_45_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (currentAngle > 85) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = null;
        }

        App.bot.setVelocities(0.4, -0.2, 0.0);
    }

    if (App.currentState === "STRAFE_TO_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (xDistToBeacon < 55) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = "TELEOP";
        }

		if (currentAngle > 91) {
			App.bot.setVelocityY(-0.2);
		}

		if (currentAngle < 89) {
			App.bot.setVelocityY(0.2);
		}

        App.bot.setVelocityX(-0.3);
    }

	if (App.currentState === "TELEOP") {
		if (!App.stateTime) {
            App.stateTime = Date.now();
        }

		if (App.keysPressed[87]) {
			App.bot.setVelocityY(0.7);
		}

		if (App.keysPressed[83]) {
			App.bot.setVelocityY(-0.7);
		}

		if (App.keysPressed[65]) {
			App.bot.setVelocityX(-0.7);
		}

		if (App.keysPressed[68]) {
			App.bot.setVelocityX(0.7);
		}

		if (App.keysPressed[81]) {
			App.bot.setVelocityR(-90);
		}

		if (App.keysPressed[69]) {
			App.bot.setVelocityR(90);
		}
	}

    if (App.currentState === "STRAFE_LEFT_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 12000) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = null;
        }

        App.bot.setVelocities(0.1, -0.3, 0.0);
    }

    App.bot.update(interval);
}

function draw() {
    var ctx = document.getElementById("field").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(App.background, 0, 0);

    App.bot.draw();
    App.tgt.draw();
}
