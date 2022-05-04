let app = new PIXI.Application({ roundPixels: true, antialias: false });

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.view.id = "game-canvas";

document.body.appendChild(app.view);

let scroller;
let dino;
let obstacle;
let sheet;
let score;
let resetBtn;
let speed;
let dist;
let restarting = false;

const TICK_RATE = 16;
let lastUpdate = 0;

window.WebFontConfig = {
    google: {
        families: ['Fredoka One']
    }
};

// include the web-font loader script
/* jshint ignore:start */
(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

setTimeout(function () {
    PIXI.loader
        .add([
            "assets/SpriteSheet.json",
            "assets/sky.png"
        ]).on("progress", loadProgressHandler)
        .load(closeLoader);
}, 600);

function loadProgressHandler(loader, resource) {
    let progress = (loader.progress / 100) * 80;
    document.getElementById("loader-progress").style.width = progress + "%";
    if (progress === 80) {
        document.getElementById("shine").style.opacity = 1;
        document.getElementById("shine").style.left = "120%";
    }
}

function closeLoader() {
    setTimeout(function () {
        let parent = document.getElementById("loader");
        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i];
            child.classList.remove("pop-up-animation");
            child.classList.add("close-animation");
            child.style.animationDelay = 0.3 * (parent.children.length - i) + "s";
        }
        setup();
        setTimeout(function () {
            document.getElementById("game-canvas").style.top = 0;
        }, 500);
    }, 1300);
}

function setup() {
    speed = 3;
    dist = 0;
    sheet = PIXI.loader.resources["assets/SpriteSheet.json"].spritesheet;
    scroller = new Scroller();
    obstacle = new ObstacleManager();

    let style = new PIXI.TextStyle({ fill: "white", fontSize: 50, fontFamily: "Fredoka One" });
    score = new PIXI.Text(dist + " m", style);
    score.anchor.set(1, 0);
    score.position.set(app.renderer.width - 20, 10);
    app.stage.addChildAt(score, app.stage.children.length);

    resetBtn = new PIXI.Sprite(sheet.textures["retry.png"]);
    resetBtn.anchor.set(0.5);
    resetBtn.position.set(app.renderer.width / 2, app.renderer.height + resetBtn.height * 2);
    resetBtn.visible = false;
    resetBtn.buttonMode = true;
    resetBtn.interactive = true;
    resetBtn.on("click", reset);
    resetBtn.on("mouseover", function () {
        resetBtn.hovering = true;
    });
    resetBtn.on("mouseout", function () {
        resetBtn.hovering = false;
    });
    app.stage.addChildAt(resetBtn, app.stage.children.length);

    let space = keyboard(32);
    space.press = () => dino.jump();

    dino = new Dino();

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {

    let now = (new Date()).getTime();
    let timeDiff = now - lastUpdate;
    if (timeDiff < TICK_RATE)
        return;

    lastUpdate = now;

    dino.update();
    obstacle.update();
    scroller.update();
    dino.checkCollision(obstacle);
    if (!dino.dead && !restarting) {
        dist += 0.05 * delta * speed;
        if (Math.floor(dist) % 5 === 0) {
            score.text = Math.floor(dist) + " m";
        }
    }
    if (dino.dead && speed === 0) {
        resetBtn.visible = true;
        resetBtn.y = lerp(resetBtn.y, app.renderer.height / 2, 0.1);
        if (resetBtn.hovering) {
            let scale = resetBtn.getBounds().width / resetBtn.getLocalBounds().width;
            scale = lerp(scale, 1.1, 0.1);
            resetBtn.scale.set(scale);
        } else {
            let scale = resetBtn.getBounds().width / resetBtn.getLocalBounds().width;
            scale = lerp(scale, 1, 0.1);
            resetBtn.scale.set(scale);

        }
    }
    if (restarting) {
        speed = lerp(speed, 5, 0.08);
        if (speed >= 3) {
            speed = 3;
        }
        resetBtn.y = lerp(resetBtn.y, app.renderer.height + resetBtn.height * 2, 0.1);
    }
}

function reset() {
    restarting = true;
    dist = 0;
}

function lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}
