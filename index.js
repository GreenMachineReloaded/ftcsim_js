var App = {};

window.onload = function() {
    App.canvas = document.getElementById("field");
    App.canvas.style.border = "2px solid black";
    var ctx = App.canvas.getContext("2d");
    console.log(new Robot());

    App.bot = new Robot(ctx, 253, App.canvas.height - 43, 65, 65, 0, "1px solid black", "#ddd");
    App.bot.setRotation(-45);

    App.keysPressed = [];
    App.currentState = "STAR";

    App.background = new Image();
    App.background.src = "vvmap.png";

    App.tgt = new Target(ctx, 350, 10);

    document.addEventListener("keydown", function(e) {
        window.keysPressed[e.keyCode] = true; // keeps track of pressed keys
    });

    document.addEventListener("keyup", function(e) {
        window.keysPressed[e.keyCode] = false; // indicates that the key is no longer pressed
    });

    window.setInterval(update, 5, 5);
    window.setInterval(draw, 21, 21);
};

function update(interval) {
    var bx = App.bot.getPosition().x - App.bot.size.w/2;
    var by = App.bot.getPosition().y - App.bot.size.h/2;
    var tx = App.tgt.position.x;
    var ty = App.tgt.position.y;

    var currentAngle = Math.atan2((bx-tx), (by-ty))*(180/Math.PI);

    if (App.currentState === "START") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 18000) {
            App.stateTime = null;
            //App.currentState = "STRAFE_LEFT_TO_BEACON";
            App.currentState = null;
        }

        App.bot.setVelocities(0.7, 0.0, 5);
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

    if (App.currentState === "STRAFE_LEFT_BEACON") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 12000) { // App.bot.getSide("left") < 10
            App.stateTime = null;
            App.currentState = null;
        }

        App.bot.setVelocities(0.1, -0.3, 0.0);
    }

    if (App.currentState === "FIND_LINE") {
        if (!App.stateTime) {
            App.stateTime = Date.now();
        } else if (Date.now() - App.stateTime > 1800) {
            App.stateTime = null;
            App.currentState = null;
        }

        App.bot.setVelocityY(0.3);
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
