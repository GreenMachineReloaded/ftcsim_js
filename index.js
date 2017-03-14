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

	App.loopCount = 0;

	App.code = '';
	var botCodeTextArea = document.querySelector(".code > textarea");
	botCodeTextArea.value = localStorage.getItem('code');

	// loading variables into list
	var appVars = document.querySelector('.variables .list');
	for (prop in App) {
		appVars.innerHTML += '<li>App.' + prop + '</li>';
	}

    App.keysPressed = [];

    document.addEventListener("keydown", function(e) {
        App.keysPressed[e.keyCode] = true; // keeps track of pressed keys
    });

    document.addEventListener("keyup", function(e) {
        App.keysPressed[e.keyCode] = false; // indicates that the key is no longer pressed
    });

	var runButton = document.getElementsByClassName("run-button")[0];
	runButton.addEventListener("click", function(e) {
		localStorage.setItem('code', botCodeTextArea.value);
		App.code = botCodeTextArea.value;
	});

	App.timeDisplay = document.getElementById("timer");
	App.timer = Date.now();

    window.setInterval(update, 5, 5);
    window.setInterval(draw, 21, 21);
};

function update(interval) {
	var curTime = Date.now() - App.timer;
	App.timeDisplay.textContent = Math.round(curTime)/1000;
	if (curTime < 30000) {
	    var bx = App.objects.bot.getPosition().x - App.objects.bot.size.w/2;
	    var by = App.objects.bot.getPosition().y - App.objects.bot.size.h/2;
	    var tx = App.objects.tgt.position.x;
	    var ty = App.objects.tgt.position.y;

	    var xDistToBeacon = bx - tx;
		var yDistToBeacon = by - ty;
	    var currentAngle = Math.atan2((bx-tx), (by-ty))*(180/Math.PI);

		try {
			document.querySelector('.loop .errors').style.display = 'none';
			eval(localStorage.getItem('code'));
		} catch (e) {
			document.querySelector('.loop .errors').style.display = 'block';
			var errorHeading = document.querySelector('.loop .errors > h3');
			var errorMessage = document.querySelector('.loop .errors > p');
			errorHeading.textContent = e.name;
			errorMessage.textContent = e.message;
		}

	    App.objects.bot.update(interval);
	}
}

function draw() {
    var ctx = document.getElementById("field").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(App.background, 0, 0);

    App.objects.bot.draw();
    App.objects.tgt.draw();
}
