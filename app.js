var canvas = document.getElementById('canvas');

PIXI.utils.skipHello()
const renderer = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    view: canvas
})

const stage = new PIXI.Container();
const menuCon = new PIXI.Container();

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
let selectedDotIndex

const createDot = () => {
    const texture = PIXI.Texture.from('/assets/dot.png');
    const dot = new PIXI.Sprite(texture);
    dot.x = 100;
    dot.y = 100;
    dot.index = dotArr.length;
    dot.name = undefined;
    dot.scale.set(0.03, 0.03);
    dot.interactive = true;
    dot.buttonMode = true;
    dot.anchor.set(0.5);
    dot
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
        .on('rightdown', rightClick);

    stage.addChild(dot);
    dotArr.push(dot);
}

const rightClick = () => {
    console.log('click'); 
}


function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    selectedDotIndex = this.index
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
    }
}
stage.addChild(graph);
graph.position.set(0,0);

const lineArr =[];

const createLine = (startDotIndex, endDotIndex) => {
    const line = {
        index: lineArr.length,
        startDotIndex: startDotIndex,
        endDotIndex: endDotIndex
    }
    lineArr.push(line);
}

const drawLine = (startDotIndex, endDotIndex) => {
    let startDot = dotArr[startDotIndex]
    let endDot = dotArr[endDotIndex]
    graph.lineStyle(10, 0xffff00)
        .moveTo(startDot.x, startDot.y)
        .lineTo(endDot.x, endDot.y);
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

const drawLineButton = () => {
    const texture = PIXI.Texture.from('/assets/addLine.png');
    const button = new PIXI.Sprite(texture);
    button.x = 200;
    button.y = 800;
    button.scale.set(0.06, 0.06);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown', makeSelecting);
    stage.addChild(button)
}

const drawMenuButton = () => {
    const texture = PIXI.Texture.from('/assets/menu.png');
    const button = new PIXI.Sprite(texture);
    button.x = 1500;
    button.y = 100;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown',openMenu);
    stage.addChild(button)
}
let isMenuOpen = false
const openMenu = () => {
        if (isMenuOpen == false){
        const texture = PIXI.Texture.from('/assets/uiBackground.png');
        const ui = new PIXI.Sprite(texture);
        ui.x = 1600;
        ui.y = 0;
        ui.scale.set(1, 3);
        ui.interactive = true;
        ui.buttonMode = false;
        //ui.anchor.set(0.5);
        ui.on('pointerdown',openMenu);
        menuCon.addChild(ui)
        renderer.stage.addChild(menuCon);
        isMenuOpen = true;
    } else {
        renderer.stage.removeChild(menuCon);
        isMenuOpen = false;
    }
}

let selecting = false;
let startP = undefined;
let endP = undefined;

const makeSelecting = () => {
    selecting = true;
    selectedDotIndex = undefined;
    startP = undefined;
    endP = undefined;

};

const selectDots = () => {
    if (selecting) {
        if (selectedDotIndex !== undefined){
            if (startP == undefined){
                startP = selectedDotIndex;
            } else if (endP == undefined && selectedDotIndex !== startP){
                endP = selectedDotIndex;
                createLine(startP, endP);
                selecting = false;
            }
        }
    }
}

const init = () => {
    drawDotButton();
    drawLineButton();
    drawMenuButton();
    }

const UpdateLine = () => {
    graph.clear();
    for (let i=0; i< lineArr.length; i++){
        drawLine(lineArr[i].startDotIndex, lineArr[i].endDotIndex)
    }
}

init();
//window.addEventListener("mousemove", UpdateLine);
renderer.stage.addChild(stage);

renderer.ticker.add(function(delta) {
    selectDots();
    UpdateLine();
});