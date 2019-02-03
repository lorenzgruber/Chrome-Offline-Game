class Dino{
    constructor() {
        this.dino = new PIXI.extras.AnimatedSprite(sheet.animations["Dino"]);
        this.dino.scale.set(0.48);
        if(restarting){
            this.dino.position.set(-app.renderer.width/2, app.renderer.height - this.dino.height * 1.1);
            restarting = false;
        }else{
            this.dino.position.set(100, app.renderer.height - this.dino.height * 1.1);
        }
        this.dino.animationSpeed = 0.35 * speed / 2;
        this.dino.play();
        app.stage.addChildAt(this.dino, app.stage.children.length - 5);

        this.dinoDead = new PIXI.Sprite(sheet.textures["Dino_dead.png"]);
        this.dinoDead.scale.set(0.7);
        this.dinoDead.visible = false;
        app.stage.addChildAt(this.dinoDead, app.stage.children.length - 5);

        this.vy = 0;
        this.vx = 0;
        this.airborn = false;

        this.dead = false;
    }

    update(){
        if(this.airborn){
            this.dino.position.y += this.vy;
            this.vy += 1;

            if(this.dino.position.y >= app.renderer.height - this.dino.height * 1.1){
                this.airborn = false;
                this.vy = 0;
                this.dino.position.y = app.renderer.height - this.dino.height * 1.1;
                if (!this.dead) {
                    this.dino.gotoAndPlay(0);
                }
            }
        }

        if(this.dead){
            if(this.airborn){
                this.vx = lerp(this.vx, 0, 0.02);
            }else{
                speed = lerp(speed, 0, 0.05);
                this.vx = lerp(this.vx, 0, 0.1);
            }
            if(speed <= 0.1){
                speed = 0;
            }
            this.dino.x += this.vx;
        }

        if(restarting){
            this.dino.x -= 5.5 * speed;
        }

        if(this.dino.x < 100 && !restarting){
            this.dino.x = lerp(this.dino.x, 100, 0.02);
            if(this.dino.x >= 99){
                this.dino.x = 100;
            }
        }
    }

    jump(){
        if(!this.airborn && !this.dead){
            this.airborn = true;
            this.vy -= 26;
            this.dino.gotoAndStop(3);
        }
    }

    checkCollision(obstacle){
        let dinoX = this.dino.x + this.dino.width/3;
        let dinoY = this.dino.y;
        let dinoW = this.dino.width/2.5;
        let dinoH = this.dino.height*0.9;
        let obstX = obstacle.obstacles.x;
        let obstY = obstacle.obstacles.y;
        let obstW = obstacle.obstacles.height * 0.8;
        let obstH = obstacle.obstacles.height;

        if(dinoX + dinoW >= obstX &&
            dinoX <= obstX + obstW &&
            dinoY + dinoH >= obstY - obstH &&
            !this.dead){
                this.dead = true;
                this.dinoDead.position.set(this.dino.x, this.dino.y + this.dino.height/2);
                this.dino.destroy();
                this.dino = this.dinoDead;
                this.dino.visible = true;
                this.vy = -15;
                this.vx = 3 * speed;
                this.airborn = true;
        }
    }
}

