var App = {};

window.onload = function() {
    App.canvas = document.getElementById("field");
    App.canvas.style.border = "2px solid black";
    App.context = App.canvas.getContext("2d");

    App.objects = {};
	App.background = new Image();
    App.background.src = "vvmap.png";
	App.currentState = 'START';

	App.getCode = function() {
		return document.querySelector(".code > textarea").value;
	};

	App.setCode = function(c) {
		document.querySelector(".code > textarea").value = c;
	};

	App.setCode(localStorage.getItem('code'));

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

	var textarea = document.querySelector('textarea');
	textarea.addEventListener('keydown', function(e) {
		if (e.keyCode === 9) {
			e.preventDefault();
			var beforeCursorPos = this.selectionStart;
			this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
			this.selectionEnd = beforeCursorPos+1;
		}

		localStorage.setItem('code', App.getCode());
	});

	var runButton = document.getElementsByClassName("run-button")[0];
	runButton.addEventListener("click", function(e) {
		localStorage.setItem('code', App.getCode());
		start();
	});

	var runButton = document.getElementsByClassName("stop-button")[0];
	runButton.addEventListener("click", stop);

	App.timeDisplay = document.getElementById("timer");

    window.setInterval(draw, 21, 21);
};

function start() {
	clearInterval(update);

    var ctx = App.canvas.getContext("2d");

	App.objects = {};

    App.keysPressed = [];
    App.currentState = "START";

	App.loopCount = 0;

	App.setCode(localStorage.getItem('code'));

	App.timer = Date.now();
	App.updateInterval = setInterval(update, 5, 5);
}

function update() {
	var curTime = Date.now() - App.timer;
	App.timeDisplay.textContent = Math.round(curTime)/1000;
	if (curTime < 30000) {
		/*
	    var bx = App.objects.bot.getPosition().x - App.objects.bot.size.w/2;
	    var by = App.objects.bot.getPosition().y - App.objects.bot.size.h/2;
	    var tx = App.objects.tgt.position.x;
	    var ty = App.objects.tgt.position.y;

	    var xDistToBeacon = bx - tx;
		var yDistToBeacon = by - ty;
	    var currentAngle = Math.atan2((bx-tx), (by-ty))*(180/Math.PI);
		*/

		try {
			document.querySelector('.loop .errors').style.display = 'none';
			eval(App.getCode());
		} catch (e) {
			stop();
			document.querySelector('.loop .errors').style.display = 'block';
			var errorHeading = document.querySelector('.loop .errors > h3');
			var errorMessage = document.querySelector('.loop .errors > p');
			errorHeading.textContent = e.name;
			errorMessage.textContent = e.message;
		}

		for (o in App.objects) {
			App.objects[o].update(5);
		}
	} else {
		stop();
	}
}

function stop() {
	clearInterval(App.updateInterval);
}

function draw() {
    var ctx = App.canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(App.background, 0, 0);

    for (o in App.objects) {
		App.objects[o].draw();
	}
}
