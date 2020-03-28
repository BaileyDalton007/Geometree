var canvas = document.getElementById("canvas");
PIXI.utils.skipHello();

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const renderer = new PIXI.Application({
    width: window.innerWidth,
 	height: window.innerHeight,
    view: canvas
});

const board = new PIXI.Container();
const gui = new PIXI.Container();
const menuCon = new PIXI.Container();
const optionsCon = new PIXI.Container();
const infoCon = new PIXI.Container();

const stage = new PIXI.Container();

menuCon.sortableChildren = true;
stage.sortableChildren = true;
gui.zIndex = 10;

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
    } else {
        canvas.style.width = 800 * optimalRatio + "px";
        canvas.style.height = 480 * optimalRatio + "px";
        renderer.width = canvas.style.width;
        renderer.height = canvas.style.height;
    }
}

window.addEventListener("resize", resize, false);

let dotArr = [];
let namedDotsArr = [];
let selectedDotIndex;

const createDot = () => {
    const texture = PIXI.Texture.from("./assets/dot.png");
    const dot = new PIXI.Sprite(texture);
    dot.x = 100;
    dot.y = 100;
    dot.index = dotArr.length;
    dot.name = undefined;
    dot.scale.set(0.06, 0.06);
    dot.interactive = true;
    dot.buttonMode = true;
    dot.anchor.set(0.5);
    dot
        .on("pointerdown", onDotDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove)
        .on("rightdown", rightClick);

    board.addChild(dot);
    dotArr.push(dot);
};

const rightClick = () => {
    console.log("click");
};

function onDotDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    selectedDotIndex = this.index;
    if (naming == true && namedDotsArr.includes(this) == false) {
        namedDotsArr.push(this);
        namePoint(this.index);
        naming = false;
    }
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    selectedDotIndex = this.index;
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

graph.position.set(0, 0);

let lineArr = [];

const createLine = (startDotIndex, endDotIndex) => {
    const line = {
        index: lineArr.length,
        startDotIndex: startDotIndex,
        endDotIndex: endDotIndex
    };
    lineArr.push(line);
};

const drawLine = (startDotIndex, endDotIndex) => {
    let startDot = dotArr[startDotIndex];
    let endDot = dotArr[endDotIndex];
    graph
        .lineStyle(8, 0xf4a0f4)
        .moveTo(startDot.x, startDot.y)
        .lineTo(endDot.x, endDot.y);
};

const clearBoard = () => {
    for (let i = board.children.length - 1; i >= 0; i--) {
        board.removeChild(board.children[i]);
    }
    dotArr = [];
    namedDotsArr = [];
    nameArr = [];
    lineArr = [];
    textArr = [];
	tPointArr = [];
	circleArr = [];
};

const style = {
    fill: "#DB8EDB"
};

let textArr = [];

const drawText = () => {
    let input = new PixiTextInput("text", style);
    input.width = 400;
    input.background = false;
    input.position.x = 100;
    input.position.y = 250;
    //input.wordWrap = true;
    //input.wordWrapWidth = 40,
    //input.width = input.text * 5; + 100
    input.caretColor = 0xffffff;
    drawPickPoint(input.x + input.width / 2 + 65, input.y + input.height / 2);
    input.on("pointerdown", drawPickPoint);
    textArr.push(input);
    board.addChild(input);
};

let tPointArr = [];

const drawPickPoint = (x, y) => {
    const texture = PIXI.Texture.from("./assets/dot.png");
    const dot = new PIXI.Sprite(texture);
    dot.x = x;
    dot.y = y;
    dot.interactive = true;
    dot.buttonMode = true;
    dot.scale.set(0.03, 0.03);
    dot.anchor.set(0.5);
    dot
        .on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove)
        .on("rightdown", rightClick);
    tPointArr.push(dot);
    board.addChild(dot);
};

const updateText = () => {
    if (textArr.length > 0) {
        for (let i = 0; i < textArr.length; i++) {
            textArr[i].width = textArr[i].text.length * 15 + 20;
            textArr[i].x = tPointArr[i].x;
            textArr[i].y = tPointArr[i].y;
        }
    }
};

let wait = false;
const takeScreenshot = () => {
    wait = true;
    renderer.renderer.extract.canvas(renderer.stage).toBlob(b => {
        const a = document.createElement("a");
        document.body.append(a);
        a.download = "screenshot";
        a.href = URL.createObjectURL(b);
        a.click();
        a.remove();
    }, "image/png");
};

let naming = false;
let nameArr = [];

const startNaming = () => {
    naming = true
};

const namePoint = (dotIndex) => {
    let input = new PixiTextInput("text", style);
    input.width = 400;
    input.background = false;
    input.position.x = 100;
    input.position.y = 250;
    input.caretColor = 0xffffff;
    nameArr.push(input);
    board.addChild(input);

};

const updatePointNames = () => {
    if (nameArr.length > 0) {
        for (let i = 0; i < nameArr.length; i++) {
            nameArr[i].width = nameArr[i].text.length * 15 + 20;
            nameArr[i].x = namedDotsArr[i].x;
            nameArr[i].y = namedDotsArr[i].y - 40;
        }
    }
};

let showInfo = false;
let infoText = undefined;

const infoStyle = {
    fill: '#DB8EDB',
    fontSize: 15,
    wordWrap : true,
    wordWrapWidth : 100,
};

const drawInfoMenu = () => {
    showInfo = true;
    const texture = PIXI.Texture.from("./assets/infobar.png");
    const bar = new PIXI.Sprite(texture);
    bar.x = windowWidth - 110;
    bar.y = 40;
    bar.scale.set(0.4, 0.4);
    bar.interactive = true;
    bar.buttonMode = false;
    bar.anchor.set(0.5);
    const infoBarText = new PIXI.Text(infoText, infoStyle)
    infoBarText.x = windowWidth - 140;
    infoBarText.y = 22;
    infoCon.addChild(bar);
    infoCon.addChild(infoBarText);
};

const closeInfoMenu = () => {
    showInfo = false;
};

const drawDotButton = () => {
    const texture = PIXI.Texture.from("./assets/addDot.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 150;
    button.y = 100;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", createDot);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Add Point'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};


const drawTrashButton = () => {
    const texture = PIXI.Texture.from("./assets/trash.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 150;
    button.y = 170;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", clearBoard);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Clear Board'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};

const drawTextButton = () => {
    const texture = PIXI.Texture.from("./assets/addText.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 80;
    button.y = 170;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", drawText);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Create a text input'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};

const drawLineButton = () => {
    const texture = PIXI.Texture.from("./assets/addLine.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 80;
    button.y = 100;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", makeSelecting);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Click 2 points to add line'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};

const drawScreenShotButton = () => {
    const texture = PIXI.Texture.from("./assets/screenshot.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 150;
    button.y = 240;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", takeScreenshot);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Take a screenshot'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};

const drawNameButton = () => {
    const texture = PIXI.Texture.from("./assets/name.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 80;
    button.y = 240;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", startNaming);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Click on a point to name'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
};

const drawCircleButton = () => {
	const texture = PIXI.Texture.from("./assets/addCircle.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 150;
    button.y = 310;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.on("pointerdown", makeSelectingCir);
    const showThisInfo = () => {
        if (infoText !== undefined){
            for (let i = infoCon.children.length - 1; i >= 0; i--) {
                infoCon.removeChild(infoCon.children[i]);
            }
        }
        infoText = 'Click 2 points to add a circle'; 
        drawInfoMenu()
    };
    button.on("mouseover", showThisInfo);
    menuCon.addChild(button);
}

const drawMenuButton = () => {
    const texture = PIXI.Texture.from("./assets/menu.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 225;
    button.y = 100;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.anchor.set(0.5);
    button.zIndex = 10;
    button.on("pointerdown", openMenu);
    gui.addChild(button);
};

const drawOptionButton = () => {
    const texture = PIXI.Texture.from("./assets/options.png");
    const button = new PIXI.Sprite(texture);
    button.x = windowWidth - 225;
    button.y = 150;
    button.scale.set(0.1, 0.1);
    button.interactive = true;
    button.buttonMode = true;
    button.zIndex = 10;
    button.anchor.set(0.5);
    button.on("pointerdown", openOptions);
    gui.addChild(button);
};

let isOptionsOpen = false;
const openOptions = () => {
    if (isOptionsOpen == false) {
        isOptionsOpen = true;
        if (isMenuOpen == true) {
            openMenu();
        }
        const texture = PIXI.Texture.from("./assets/uiBackground.png");
        const ui = new PIXI.Sprite(texture);
        ui.x = windowWidth - 200;
        ui.y = 0;
        ui.scale.set(1, 3);
        ui.interactive = true;
        ui.buttonMode = false;
        //ui.anchor.set(0.5);
        ui.zIndex = -1;
        optionsCon.addChild(ui);
        renderer.stage.addChild(optionsCon);
    } else {
        renderer.stage.removeChild(optionsCon);
        isOptionsOpen = false;
    }
};

let isMenuOpen = false;
const openMenu = () => {
    if (isMenuOpen == false) {
        isMenuOpen = true;
        if (isOptionsOpen == true) {
            openOptions();
        }
        const texture = PIXI.Texture.from("./assets/uiBackground.png");
        const ui = new PIXI.Sprite(texture);
        ui.x = windowWidth - 200;
        ui.y = 0;
        ui.scale.set(1, 3);
        ui.interactive = true;
        ui.buttonMode = false;
        //ui.anchor.set(0.5);
        ui.zIndex = -1;
        ui.on('mouseout', closeInfoMenu);
        menuCon.addChild(ui);
        renderer.stage.addChild(menuCon);
    } else {
        renderer.stage.removeChild(menuCon);
        isMenuOpen = false;
    }
};

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
        if (selectedDotIndex !== undefined) {
            if (startP == undefined) {
                startP = selectedDotIndex;
            } else if (endP == undefined && selectedDotIndex !== startP) {
                endP = selectedDotIndex;
                createLine(startP, endP);
                selecting = false;
            }
        }
    }
};

let selectingCir = false;
let secCirPoint = undefined;
let startCenter = undefined;

const makeSelectingCir = () => {
    selectingCir = true;
    selectedDotIndex = undefined;
	startCenter = undefined;
	secCirPoint = undefined;
	
};

const selectDotsForCir = () => {
    if (selectingCir) {
        if (selectedDotIndex !== undefined) {
            if (startCenter == undefined) {
                startCenter = selectedDotIndex;
            } else if (secCirPoint == undefined && selectedDotIndex !== startCenter) {
				secCirPoint = selectedDotIndex;
                createCircle(startCenter, secCirPoint);
                selectingCir = false;
            }
        }
    }
};

let circleArr = [];

const createCircle = (c, r) => {
	const circle = {
		index : circleArr.length,
		centerIndex : c,
		radiusIndex : r
	}
	circleArr.push(circle)

}

const drawCircle = (c, r) => {
	let centerPoint = dotArr[c];
	let radiusPoint = dotArr[r];
	
	graph.drawCircle(centerPoint.x, centerPoint.y, Math.hypot(radiusPoint.x - centerPoint.x, radiusPoint.y - centerPoint.y));
	graph.endFill();
} 

const updateCircles = () => {
	for (let i = 0; i < circleArr.length; i++) {
		graph.lineStyle(8, 0xf4a0f4, 1);
        drawCircle(circleArr[i].centerIndex, circleArr[i].radiusIndex);
    }
}

const updateInfo = () => {
    if (showInfo == true) {
        menuCon.addChild(infoCon);
    } else {
        menuCon.removeChild(infoCon);
    }
};

const init = () => {
    drawDotButton();
    drawLineButton();
    drawTrashButton();
    drawTextButton();
    drawScreenShotButton();
	drawNameButton();
	drawCircleButton();
    drawMenuButton();
    drawOptionButton();
};

const updateLine = () => {
    graph.clear();
    for (let i = 0; i < lineArr.length; i++) {
        drawLine(lineArr[i].startDotIndex, lineArr[i].endDotIndex);
	}
};

init();
stage.addChild(graph);
stage.addChild(board);
stage.addChild(gui);
renderer.stage.addChild(stage);
window.setInterval(console.log('hi'), 1000);

renderer.ticker.add(function(delta) {
	selectDots();
	selectDotsForCir();
	updateLine();
    updateText();
	updatePointNames();
    updateCircles();
    updateInfo();
});