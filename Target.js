function Target(ctx, x, y) {
    this.context = ctx;
    this.position = {x: x, y: y};
    this.draw = function() {
        this.context.fillStyle = "black";
        this.context.fillRect(this.position.x-5, this.position.y-5, 10, 10);
    }
}
