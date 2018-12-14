let Explosion = function(left, top, size) {
    this.top = top;
    this.left = left;
    this.size = size;
    this.lifeTime = Time;
    this.img = document.getElementById("Explosion");
    self = this;
    this.randomMove = function() {}
    this.draw = function() {
        let ctx = canvas.getContext("2d");
        ctx.drawImage(self.img, self.left, self.top, self.size*2, self.size*2);
        if (Time-this.lifeTime > 0.3) {
            this.removeSelf();
        }
    }
    this.removeSelf = function () {
        let i = objectList.indexOf(this);
        objectList.splice(i, 1);
    }
}