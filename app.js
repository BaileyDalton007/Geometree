var canvas = document.getElementById('canvas');
const app = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    view: canvas
})

function resize() {
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var scaleToFitX = gameWidth / 800;
    var scaleToFitY = gameHeight / 480;
    var currentScreenRatio = gameWidth / gameHeight;
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
    if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
        canvas.style.width = gameWidth + "px";
        canvas.style.height = gameHeight + "px";
        app.width = canvas.style.width;
        app.height = canvas.style.height;
    }
    else {
        canvas.style.width = 800 * optimalRatio + "px";
        canvas.style.height = 480 * optimalRatio + "px";
        app.width = canvas.style.width;
        app.height = canvas.style.height;
    }
};
window.addEventListener('resize', resize, false);

const texture = PIXI.Texture.from('/assets/dot.png');
const dot = new PIXI.Sprite(texture);
dot.x = 100;
dot.y = 100;
dot.scale.set(0.03, 0.03);
app.stage.addChild(dot);


