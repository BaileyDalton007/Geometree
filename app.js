var canvas = document.getElementById('canvas');
PIXI.utils.skipHello();

const renderer = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    view: canvas
})

const board = new PIXI.Container();
const gui = new PIXI.Container();
const menuCon = new PIXI.Container();
const optionsCon = new PIXI.Container();
const stage = new PIXI.Container();
menuCon.sortableChildren = true;
stage.sortableChildren = true;
gui.zIndex = 1;

board.interactive = true;
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

let dotArr = []
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

    board.addChild(dot);
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

graph.position.set(0,0);

let lineArr =[];

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

const clearBoard = () => {
    for (let i = board.children.length - 1; i >= 0; i--) {
        board.removeChild(board.children[i]);
    }
    dotArr = [];
    lineArr = [];
}

let textArr = [];

const addText = () => {
    let chars = [];
    window.addEventListener('keypress', function (e) {
        if (e.keyCode !== 13) {
                    chars.push(e.key);
        }
    }, false);
    window.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            let textContent = chars.join('');
            textArr.push(textContent);
            console.log(textContent);
    chars = [];
           }
    }, false);
};

const drawText = () => {
    
}

const drawDotButton = () => {
    const texture = PIXI.Texture.from('/assets/addDot.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 150;
    button.y = 100;
    button.scale.set(0.03, 0.03);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown',createDot);
    menuCon.addChild(button)
}

const drawTrashButton = () => {
    const texture = PIXI.Texture.from('/assets/trash.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 150;
    button.y = 150;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown', clearBoard);
    menuCon.addChild(button)
}

const drawTextButton = () => {
    const texture = PIXI.Texture.from('/assets/addText.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 100;
    button.y = 150;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown', addText);
    menuCon.addChild(button)
}

const drawLineButton = () => {
    const texture = PIXI.Texture.from('/assets/addLine.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 100;
    button.y = 100;
    button.scale.set(0.03, 0.03);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown', makeSelecting);
    menuCon.addChild(button)
}

const drawMenuButton = () => {
    const texture = PIXI.Texture.from('/assets/menu.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 200;
    button.y = 100;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown',openMenu);
    gui.addChild(button)
}

const drawOptionButton = () => {
    const texture = PIXI.Texture.from('/assets/options.png');
    const button = new PIXI.Sprite(texture);
    button.x = window.innerWidth - 200;
    button.y = 150;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on('pointerdown',openOptions);
    gui.addChild(button)
}

let isOptionsOpen = false
const openOptions = () => {
    if (isOptionsOpen == false){
        isOptionsOpen = true;
        if (isMenuOpen == true) {openMenu();};
        const texture = PIXI.Texture.from('/assets/uiBackground.png');
        const ui = new PIXI.Sprite(texture);
        ui.x = window.innerWidth - 200;
        ui.y = 0;
        ui.scale.set(1, 3);
        ui.interactive = true;
        ui.buttonMode = false;
        //ui.anchor.set(0.5);
        ui.zIndex = -1;
        optionsCon.addChild(ui)
        renderer.stage.addChild(optionsCon);
    } else {
        renderer.stage.removeChild(optionsCon);
        isOptionsOpen = false;
    }
}

let isMenuOpen = false
const openMenu = () => {
    if (isMenuOpen == false){
        isMenuOpen = true;
        if (isOptionsOpen == true) {openOptions();};
        const texture = PIXI.Texture.from('/assets/uiBackground.png');
        const ui = new PIXI.Sprite(texture);
        ui.x = window.innerWidth - 200;
        ui.y = 0;
        ui.scale.set(1, 3);
        ui.interactive = true;
        ui.buttonMode = false;
        //ui.anchor.set(0.5);
        ui.zIndex = -1;
        menuCon.addChild(ui)
        renderer.stage.addChild(menuCon);
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
    drawTrashButton();
    drawTextButton();
    drawMenuButton();
    drawOptionButton();
    }

const UpdateLine = () => {
    graph.clear();
    for (let i=0; i< lineArr.length; i++){
        drawLine(lineArr[i].startDotIndex, lineArr[i].endDotIndex)
    }
}

init();
//window.addEventListener("mousemove", UpdateLine);
stage.addChild(graph)
stage.addChild(board);
stage.addChild(gui);
renderer.stage.addChild(stage);


renderer.ticker.add(function(delta) {
    selectDots();
    UpdateLine();
});