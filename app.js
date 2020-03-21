var canvas = document.getElementById('canvas');

const renderer = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    view: canvas
})

const stage = new PIXI.Container();
stage.interactive = true;
let graph = new PIXI.Graphics();

//Resizes canvas to hopfully fit full window, its close enough
function resize() {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    var scaleToFitX = winWidth / 800;
    var scaleToFitY = winHeight / 480;
    var currentScreenRatio = winWidth / winHeight;
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
    if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
        canvas.style.width = winWidth + "px";
        canvas.style.height = winHeight + "px";
        renderer.width = canvas.style.width;
        renderer.height = canvas.style.height;
    }
    else {
        canvas.style.width = 800 * optimalRatio + "px";
        canvas.style.height = 480 * optimalRatio + "px";
        renderer.width = canvas.style.width;
        renderer.height = canvas.style.height;
    }
};

window.addEventListener('resize', resize, false);
const dotArr = []

const createDot = () => {
    const texture = PIXI.Texture.from('/assets/dot.png');
    const dot = new PIXI.Sprite(texture);
    dot.x = 100;
    dot.y = 100;
    dot.index = dotArr.length
    dot.scale.set(0.03, 0.03);
    dot.interactive = true;
    dot.buttonMode = true;
    dot.anchor.set(0.5);
    dot
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    stage.addChild(dot);
    dotArr.push(dot);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    if(selecting){
        if (currStartPoint == false){
            currStartPoint = dotArr[this.index];
        } else if (currEndPoint == false) {
            currEndPoint = dotArr[this.index];

        }
    }
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        //console.log(Math.round(this.x), Math.round(this.y));
    }
}
stage.addChild(graph);
graph.position.set(0,0);

const lineArr =[];

const createLine = (startP, endP) => {
    console.log(lineArr)
    let startPoint = {x:startP.x, y:startP.y};
    let endPoint = {x:endP.x, y:endP.y};
    console.log([startPoint, endPoint])

    lineArr.push([startPoint, endPoint])
    console.log("2"+ lineArr)
}

const drawLine = (startPoint, endPoint) => {
    graph.lineStyle(10, 0xffff00)
        .moveTo(startPoint.x, startPoint.y)
        .lineTo(endPoint.x, endPoint.y);
}

const drawDotButton = () => {
    const texture = PIXI.Texture.from('/assets/addDot.png');
    const button = new PIXI.Sprite(texture);
    button.x = 100;
    button.y = 800;
    button.scale.set(0.06, 0.06);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown',createDot);
    stage.addChild(button)
}

let currStartPoint = false;
let currEndPoint = false;
let selecting = false;

const selectDots = () => {
    selecting = true;
    if (currStartPoint && currEndPoint !== false){
        console.log("s")
        createLine(currStartPoint, currEndPoint);
        selecting = false;
    }
console.log('t')
currStartPoint = false;
currEndPoint = false;

}

const drawLineButton = () => {
    const texture = PIXI.Texture.from('/assets/addLine.png');
    const button = new PIXI.Sprite(texture);
    button.x = 200;
    button.y = 800;
    button.scale.set(0.06, 0.06);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown', selectDots);
    stage.addChild(button)
}

const init = () => {
    drawDotButton();
    drawLineButton();
    }

const UpdateLine = () => {
    graph.clear();
    for (let i=0; i< lineArr.length; i++){
        console.log(i)
        drawLine(lineArr[i[0]], lineArr[i[1]])
    }
}

init();
//window.addEventListener("mousemove", UpdateLine);
renderer.stage.addChild(stage);

renderer.ticker.add(function(delta) {
    //console.log(lineArr)
    UpdateLine();
});