let Ship = function (left, top, size, imgId) {
    this.life = 3;
    this.score = 0;
    this.left = left;
    this.top = top;
    this.topCenter = top + size / 2;
    this.leftCenter = left + size / 2;
    this.size = size;
    this.leftAcc = 1;
    this.topAcc = 1;
    this.type = "ship";
    this.degree = 0;
    this.radius = 20;
    this.img = document.getElementById(imgId);
    let self = this;
    this.radian = 0;
    this.lastFireTime = 0;
    let base = Math.sqrt(2 * Math.pow(this.size / 2, 2));

    this.draw = function () {
        self.reOrientation();
        self.move();
        let ctx = canvas.getContext("2d");
        //Start Rotation
        ctx.save();
        ctx.translate(self.left + self.size / 2, self.top + self.size / 2); //go to center of object
        this.radian = Math.PI * this.degree;
        //Rotate
        ctx.rotate(this.radian);
        //Increase degree
        if (this.degree == 2) {
            this.degree = 0;
        } else {
            this.degree += 0.02;
        };
        ctx.translate(-self.size / 2, -self.size / 2); //go to orginal top and center of object
        ctx.drawImage(self.img, 0, 0, self.size, self.size);
        //End Rotation
        //ctx.drawImage(self.img,self.left,self.top,self.size,self.size);
        ctx.restore();
    }
    this.move = function () {
        this.top += this.topAcc;
        this.left += this.leftAcc;
        this.topCenter = this.top + this.size / 2;
        this.leftCenter = this.left + this.size / 2;
    }
    this.reOrientation = function () {
        //Đổi hướng khi chạm cạnh trên
        if ((this.top < this.radius) && (this.topAcc < 0)) {
            this.topAcc = 2;
        }
        //Đổi hướng khi chạm cạnh phải
        if ((this.left > (WIDTH - this.radius)) && (this.leftAcc > 0)) {
            this.leftAcc = -2;
        }
        //Đổi hướng khi chạm cạnh dưới
        if ((this.top > HEIGHT - this.radius) && (this.topAcc > 0)) {
            this.topAcc = -2;
        }
        //Đổi hướng khi chạm cạnh trái
        if ((this.left < this.radius) && (this.leftAcc < 0)) {
            this.leftAcc = 2;
        }
    }
    this.randomMove = function () {}
    this.fire = function (bulletName) {
        if (recharge()) {
            this.lastFireTime = Time;
            bulletSpeed = 8;
            oriLeft = bulletSpeed * Math.sin(this.radian);
            oriTop = -bulletSpeed * Math.cos(this.radian);
            createBullet(oriLeft, oriTop, bulletName);
            //createBullet(-oriLeft, -oriTop, bulletName);
            //createBullet(-oriLeft, oriTop);
            //createBullet(oriLeft, -oriTop);
        }

        function createBullet(left, top, bulletName) {
            let bullet;
            let targetId = -1;
            switch (bulletName) {
                case "bullet":
                    bullet = new Bullet(self.leftCenter, self.topCenter, 5, "red", left, top);
                    bullet.type = "bullet";
                    break;
                case "rocket":
                    targetId = 0;
                    for (let i = 0; i < objectList.length; i++) {
                        if (objectList[i].type == "ball") {
                            targetId = i;
                            break;
                        }
                    }
                    if (targetId != -1) {
                    bullet = new Rocket(self.leftCenter, self.topCenter, 5, "red", left, top, "Rocket", targetId);
                    bullet.type = "rocket";
                    }
                    break;
            }            
            bullet.radian = self.radian;
            objectList.push(bullet);
        }

        function recharge() {
            if ((Time - self.lastFireTime) > 0.5) {
                return true;
            }
            return false;
        }

    }
    this.moveOnKeyDown = function () {
        $(document).keydown(function (event) {
            let step = 2;
            if ((event.which == 40) && (self.topAcc < 10)) { //Down
                self.topAcc += step;
            }
            if ((event.which == 38) && (self.topAcc > -10)) { //Up
                self.topAcc -= step;
            }
            if ((event.which == 37) && (self.leftAcc > -10)) { //Left
                self.leftAcc -= step;
            }
            if ((event.which == 39) && (self.leftAcc < 10)) { //Right
                self.leftAcc += step;
            }
            if (event.which == 65) { //fire
                self.fire("bullet");
            }
            if (event.which == 83) { //fire
                self.fire("rocket");
            }
        });
    }


}