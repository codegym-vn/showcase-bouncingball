let Ball = function (left, top, radius, color, leftAcc, topAcc, imgObj) {
    this.top = top;
    this.left = left;
    this.radius = radius;
    this.color = color;
    let self = this;
    this.leftAcc = leftAcc;
    this.topAcc = topAcc;
    this.imgObj = imgObj;
    this.type = "ball";
    this.pos = 0;

    this.draw = function () {
        let ctx = canvas.getContext("2d");
        //ctx.beginPath();
        //ctx.arc(self.left, self.top, self.radius, 0, Math.PI * 2);
        //ctx.fillStyle = self.color;
        ctx.drawImage(self.imgObj, self.left-self.radius, self.top-self.radius, self.radius*2, self.radius*2)
        ctx.shadowColor = self.color;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        //ctx.fill();
    }
    this.randomMove = function () {
        this.reOrientation();
        this.move();
    }
    this.move = function () {
        this.top += this.topAcc;
        this.left += this.leftAcc;
    }
    this.reOrientation = function () {
        //Đổi hướng khi chạm cạnh trên
        if ((this.top < this.radius) && (this.topAcc < 0)) {
            this.topAcc = (-1) * this.topAcc;
        }
        //Đổi hướng khi chạm cạnh phải
        if ((this.left > (WIDTH - this.radius)) && (this.leftAcc > 0)) {
            this.leftAcc = (-1) * this.leftAcc;
        }
        //Đổi hướng khi chạm cạnh dưới
        if ((this.top > HEIGHT - this.radius) && (this.topAcc > 0)) {
            this.topAcc = (-1) * this.topAcc;
        }
        //Đổi hướng khi chạm cạnh trái
        if ((this.left < this.radius) && (this.leftAcc < 0)) {
            this.leftAcc = (-1) * this.leftAcc;
        }
        //Đổi hướng khi chạm bóng khác
    }
    this.removeSelf = function () {
        let i = objectList.indexOf(this);
        objectList.splice(i, 1);
    }
}