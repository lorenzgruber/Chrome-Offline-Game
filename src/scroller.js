class Scroller{
  constructor(){
    this.sandF = new PIXI.extras.TilingSprite(sheet.textures["sand_foreground.png"], app.renderer.width, 80);
    this.sandB = new PIXI.extras.TilingSprite(sheet.textures["sand_background.png"], app.renderer.width, 80);
    this.dunesF = new PIXI.extras.TilingSprite(sheet.textures["dunes_foreground.png"], app.renderer.width, 400);
    this.dunesB = new PIXI.extras.TilingSprite(sheet.textures["dunes_background.png"], app.renderer.width, 235);
    this.sun = new PIXI.Sprite(sheet.textures["sun.png"]);
    this.sky = new PIXI.Sprite(PIXI.loader.resources["assets/sky.png"].texture);
    this.clouds = new PIXI.Container();
    this.decorations = new PIXI.Container();

    for (let i = 0; i < 4; i++){
      this.clouds.addChild(new PIXI.Sprite(sheet.textures["cloud_" + (i + 1) + ".png"]));
      this.clouds.children[i].anchor.set(0.5);
      this.clouds.children[i].scale.set(Math.random() * (0.65 - 0.4) + 0.4);
      this.clouds.children[i].vx = 1;
      //this.clouds[i].vx = Math.random() * (2 - 1) + 1;
    }

    for(let i = 0; i < 4; i++){
      this.decorations.addChild(new PIXI.Sprite(sheet.textures["dec_" + (i+1) + ".png"]));
      this.decorations.children[i].scale.set(0.7);
      this.decorations.children[i].position.set(app.renderer.width, app.renderer.height - this.decorations.children[i].height*4/5);
      this.decorations.children[i].visible = false;
    }
    this.decorations.children[0].visible = true;

    this.sandF.position.y = app.renderer.height - this.sandF.height;
    this.sandF.tileScale.set(0.8);
    this.sandB.position.y = app.renderer.height - this.sandF.height * 1.5;
    this.sandB.tileScale.set(0.8);
    this.dunesF.position.y = app.renderer.height - this.dunesF.height - this.sandF.height/1.9;
    this.dunesF.tileScale.set(0.8);
    this.dunesB.position.y = app.renderer.height - this.dunesB.height - this.sandF.height * 2;
    this.dunesB.tileScale.set(0.45);
    this.sun.scale.set(0.65);
    this.sun.anchor.set(0.5);
    this.sun.position.set(app.renderer.width*2/3, app.renderer.height/2);
    this.clouds.children[0].position.set(app.renderer.width/6, app.renderer.height/2 - app.renderer.height/3);
    this.clouds.children[1].position.set(app.renderer.width/2, app.renderer.height/2 - app.renderer.height/10);
    this.clouds.children[2].position.set(app.renderer.width*5/6, app.renderer.height/2 - app.renderer.height/4);
    this.clouds.children[3].position.set(app.renderer.width*7/6, app.renderer.height/2 - app.renderer.height/8);

    app.stage.addChild(this.sky);
    app.stage.addChild(this.sun);
    app.stage.addChild(this.clouds);
    app.stage.addChild(this.dunesB);
    app.stage.addChild(this.dunesF);
    app.stage.addChild(this.sandB);
    app.stage.addChild(this.sandF);
    app.stage.addChild(this.decorations);
  }

  update(){
    this.sandF.tilePosition.x -= 6.5 * speed;
    this.sandB.tilePosition.x -= 3 * speed;
    this.dunesF.tilePosition.x -= 1 * speed;
    this.dunesB.tilePosition.x -= 0.5 * speed;

    for (let cloud of this.clouds.children) {
      cloud.position.x -= cloud.vx +  speed;

      if(cloud.position.x < -cloud.width/2){
        cloud.scale.set(Math.random() * (0.65 - 0.4) + 0.4);
        cloud.vx = Math.random() * (0.4 - 0.3) + 0.3;
        cloud.position.x = app.renderer.width + cloud.width/2;
      }
    }

    for (let decoration of this.decorations.children) {
      if(decoration.visible){
        decoration.position.x -= 6.5 * speed;
      }

      if(decoration.position.x < -app.renderer.width){
        decoration.position.x = app.renderer.width;
        decoration.visible = false;
        let index = Math.floor(Math.random() * this.decorations.children.length);
        this.decorations.children[index].visible = true;
      }
    }
  }
}
