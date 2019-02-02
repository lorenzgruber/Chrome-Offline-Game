let app = new PIXI.Application({roundPixels: true, antialias: false});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

let scroller;
let dino;
let obstacle;
let sheet;
let score;
let resetBtn;
let speed;
let dist;
let retries = 0;

window.WebFontConfig = {
    google: {
        families: ['Fredoka One']
    }
};

// include the web-font loader script
/* jshint ignore:start */
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

PIXI.loader
  .add([
    "assets/sky.png",
    "assets/SpriteSheet.json",
    "assets/rm_playtime_solid.ttf"
  ])
  .load(setup);

function setup(){
    speed = 3;
    dist = 0;
  sheet = PIXI.loader.resources["assets/SpriteSheet.json"].spritesheet;
  scroller = new Scroller();
  dino = new Dino();
  obstacle = new ObstacleManager();

  let style = new PIXI.TextStyle({fill: "white", fontSize: 50, fontFamily: "Fredoka One"});
  score = new PIXI.Text(dist + " m", style);
  score.anchor.set(1,0);
  score.position.set(app.renderer.width - 20, 10);
  app.stage.addChildAt(score, app.stage.children.length);

    resetBtn = new PIXI.Sprite(sheet.textures["retry.png"]);
    resetBtn.anchor.set(0.5);
    resetBtn.position.set(app.renderer.width/2, app.renderer.height*1.5);
    resetBtn.visible = false;
    resetBtn.buttonMode = true;
    resetBtn.interactive = true;
    resetBtn.on("click", reset);
    resetBtn.on("mouseover", function(){
        resetBtn.scale.set(1.1);
  });
    resetBtn.on("mouseout", function(){
      resetBtn.scale.set(1);
  });
  app.stage.addChildAt(resetBtn, app.stage.children.length);

  let space = keyboard(32);
  space.press = () => dino.jump();

  if(retries === 0){
      app.ticker.add(delta => gameLoop(delta));
  }
}

function gameLoop(delta){
  dino.update();
  obstacle.update();
  scroller.update();
  dino.checkCollision(obstacle);
  if(!dino.dead){
      dist += 0.05 * delta * speed;
      score.text = Math.floor(dist) + " m";
  }
    if(dino.dead && speed === 0){
        resetBtn.visible = true;
        resetBtn.y = lerp(resetBtn.y, app.renderer.height/2, 0.1);
    }
}

function reset(){
    resetBtn.destroy();
    for(child of app.stage.children){
        child.destroy();
    }
    retries ++;
    setup();
}

function lerp (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}
