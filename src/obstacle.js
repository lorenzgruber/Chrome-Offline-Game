class ObstacleManager{
    constructor(){
        this.obstacles = new PIXI.Container();
        for (let i = 0; i < 3; i++){
            this.obstacles.addChild(new PIXI.Sprite(sheet.textures["cactus.png"]));
            this.obstacles.children[i].scale.set(Math.random() * 0.12+ 0.35);
            this.obstacles.children[i].y =  -this.obstacles.children[i].height;
            this.obstacles.children[i].x = i * 80;

        }
        this.obstacles.y = app.renderer.height;
        this.obstacles.x = app.renderer.width * 1.5;
        app.stage.addChildAt(this.obstacles, app.stage.children.length - 2);
    }

    update(){
        this.obstacles.position.x -= 5.5 * speed;
        if(this.obstacles.x <= -this.obstacles.width){
            for (let obstacle of this.obstacles.children) {
                obstacle.scale.set(Math.random() * 0.12 + 0.35);
                obstacle.y = -obstacle.height;
            }
            this.obstacles.x = app.renderer.width + speed * 100 + Math.random() * 200 * speed;
            this.obstacles.y = app.renderer.height;
            if(speed < 8){
                speed += 0.05;
                dino.dino.animationSpeed = 0.35 * speed / 2;
            }
        }
    }
}