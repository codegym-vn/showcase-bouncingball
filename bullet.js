class Bullet extends Ball {
    constructor(left, top, radius, color, leftAcc, topAcc) {
        super(left, top, radius, color, leftAcc, topAcc);
        this.radian = 0;
        this.type = "bullet";
        let self = this;
        this.draw = function () {
            let ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.arc(self.left, self.top, self.radius, 0, Math.PI * 2);
            ctx.fillStyle = self.color;
            ctx.shadowColor = self.color;
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fill();
        }
        this.reOrientation = function() {
            //Biến mất khi chạm cạnh trên
            if (this.top < this.radius) {
                this.removeSelf();
            }
            //Biến mất khi chạm cạnh phải
            if (this.left > (WIDTH - this.radius)) {
                this.removeSelf();
            }
            //Biến mất khi chạm cạnh dưới
            if (this.top > (HEIGHT - this.radius)) {
                this.removeSelf();
            }
            //Biến mất khi chạm cạnh trái
            if (this.left < this.radius) {
                this.removeSelf();
            }
        }
    }
}

class Rocket extends Bullet {
    constructor(left, top, radius, color, leftAcc, topAcc, imgId, targetId) {
        super(left, top, radius, color, leftAcc, topAcc);
        this.img = document.getElementById(imgId);
        this.size = 30;
        let self = this;
        let bulletSpeed;
        let id = targetId;
        let target = objectList[id];
        let rocketTargetRadian;
        this.draw = function () {
            let ctx = canvas.getContext("2d");
            //Start Rotation
            ctx.save();
            ctx.translate(self.left + self.size / 2, self.top + self.size / 2); //go to center of object
            //Rotate
            ctx.rotate(self.radian);
            self.radian = Math.atan(-self.leftAcc/self.topAcc);
            //Increase degree
            ctx.translate(-self.size / 2, -self.size / 2); //go to orginal top and center of object
            ctx.drawImage(self.img, 0, 0, self.size, self.size);
            //End Rotation
            //ctx.drawImage(self.img,self.left,self.top,self.size,self.size);
            ctx.restore();
        }
        this.move = function () {
            this.top += this.topAcc;
            this.left += this.leftAcc;
            oriLeft = (target.left - this.left)*0.1;
            oriTop = (target.top - this.top)*0.1;
            this.topAcc = this.topAcc + (oriTop-this.topAcc)*0.02; //+ oriLeft*0.02;
            this.leftAcc = this.leftAcc + (oriLeft-this.leftAcc)*0.02; //+ oriTop*0.02;
        }
    }
}