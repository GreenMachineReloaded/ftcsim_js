#FTC Simulator
Hi! This project is a little playground I put together to test out autonomous ideas. All you have to do to get started is open up index.html!

##Index.js
Index.js is the sort of jumping off point for the rest of the simulator. Currently the update() method handles all keystrokes and movements. update() also calls the physics update() methods of any objects on the field. If you'd like to play around with this project, that's probably a good place to start. It's currently structured as a state machine with some predefined behaviors. The starting state can be set in the window.onload method. By default, the first case is TELEOP, so you can move the bot around on the field.

##Robot.js
This is a default Robot object that has some basic behaviors. It behaves much like a mecanum wheeled robot, as it can move forward, backward, rotate, and strafe all at the same time. Currently, Robot.js has a simple collision detection system (with the field walls) and a friction simulation so that it coasts a short distance after you stop sending move commands to it.

##Target.js
Target.js is just a black box that doesn't do much. Use it for visual reference. Or don't.

##vvmap.png
Field image. Swap this out if you have a better/different field diagram.
