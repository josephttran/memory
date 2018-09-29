const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const imgBackground = new Image();
imgBackground.src = "asset/img/background.jpg";

var MENU = true;
var GAME_START = false;
var IN_GAME = false;

var menuFont = "30px Arial";
var playBtnFont = "30px sans serif";

const btnColor = '#0ff';
const btnColorHover = '#07f';

let NUM_COLS = 4;
let NUM_ROWS = 4;
const rowFontSize = 20;
const rowFont = rowFontSize + "px Arial";
const rowTextX = canvas.width/4;
const rowTextY = canvas.height/4;
const columnFontSize = rowFontSize;
const columnFont = columnFontSize + "px Arial";
const columnTextX = canvas.width/3*2;
const columnTextY = rowTextY;

const playBtnX = ctx.canvas.width / 2;
const playBtnY = ctx.canvas.height * 3/4;

/* Get mouse position */
function getMousePos() {
  return {
    x: event.clientX - ctx.canvas.offsetLeft + pageXOffset,
    y: event.clientY - ctx.canvas.offsetTop + pageYOffset
  };
}

/* Triangle Object */
function Triangle(tri) {
  this.x1 = tri.x1;
  this.y1 = tri.y1;
  this.x2 = tri.x2;
  this.y2 = tri.y2;
  this.x3 = tri.x3;
  this.y3 = tri.y3;
}

Triangle.prototype.isMouseOnButton = function() {
  let mousePos = getMousePos();

  return (mousePos.x > this.x1 
      && mousePos.x < this.x3
      && ((this.y2 < this.y3) 
        ? mousePos.y > this.y2 && mousePos.y < this.y3 
        : mousePos.y < this.y2 && mousePos.y > this.y3)
  );
}

Triangle.prototype.draw = function(ctxx) {
  ctxx.fillStyle = btnColor; 

  if (MENU && this.isMouseOnButton()) {
    ctxx.fillStyle = btnColorHover;    
  } 

  ctxx.beginPath();
  ctxx.moveTo(this.x1, this.y1);
  ctxx.lineTo(this.x2, this.y2);
  ctxx.lineTo(this.x3, this.y3);
  ctxx.fill();
}

/* function draw rectangle with x, y as center */
function fillRectCentered(context, x, y, width, height) {
  context.fillRect(x - width / 2, y - height / 2, width, height);
}

/* Square Button Object */  
function SquareButton(obj) {
  this.x = obj.x;
  this.y = obj.y;
  this.height = obj.height;
  this.width = obj.width;
  this.text = obj.text;
  this.btnFont = obj.font;
}

SquareButton.prototype.isMouseOnButton = function() {
  let mousePos = getMousePos();
  
  return (mousePos.x > this.x - this.width/2
    && mousePos.x < this.x + this.width/2 
    && mousePos.y > this.y - this.height/2
    && mousePos.y < this.y + this.height/2
  );
}

SquareButton.prototype.draw = function() {
  ctx.fillStyle = btnColor;

  if (this.isMouseOnButton()) {
    ctx.fillStyle = btnColorHover;
  }

  fillRectCentered(ctx, this.x, this.y, this.width, this.height);

  ctx.fillStyle = '#000';
  ctx.font = this.btnFont;
  ctx.fillText(this.text, this.x, this.y); 
  
}

const columnUpTriangle = {
  x1: columnTextX + (columnFontSize * 2),
  y1: columnTextY - columnFontSize,
  x2: columnTextX + (columnFontSize * 2 + 10),
  y2: columnTextY - columnFontSize - 10,
  x3: columnTextX + (columnFontSize * 2 + 20),
  y3: columnTextY - columnFontSize
};

const columnDownTriangle = {
  x1: columnTextX + (columnFontSize * 2),
  y1: columnTextY + 10,
  x2: columnTextX + (columnFontSize * 2 + 10),
  y2: columnTextY + 20,
  x3: columnTextX + (columnFontSize * 2 + 20),
  y3: columnTextY + 10
};

const rowUpTriangle = {
  x1: rowTextX + 20,
  y1: rowTextY - rowFontSize,
  x2: rowTextX + 30,
  y2: rowTextY - rowFontSize - 10,
  x3: rowTextX + 40,
  y3: rowTextY - rowFontSize
};

const rowDownTriangle = {
  x1: rowTextX + 20,
  y1: rowTextY + 10,
  x2: rowTextX + 30,
  y2: rowTextY + 20,
  x3: rowTextX + 40,
  y3: rowTextY + 10
};

const playButton = {
  x: playBtnX,
  y: playBtnY,
  width: 100,
  height: 50, 
  text: "Play",
  font: playBtnFont
};

const columnUpBtn = new Triangle(columnUpTriangle);
const columnDownBtn = new Triangle(columnDownTriangle);
const rowUpBtn = new Triangle(rowUpTriangle);
const rowDownBtn = new Triangle(rowDownTriangle);
const playBtn = new SquareButton(playButton);

/* Draw menu screen with buttons */
function loadMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00853f';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(imgBackground, 0, 0, ctx.canvas.width, ctx.canvas.height); 

  ctx.fillStyle = '#fff';
  ctx.font = menuFont;
  ctx.textAlign = "center";
  ctx.fillText("Game Menu ", canvas.width / 2, 50);

  ctx.fillStyle = '#ff0';
  ctx.font = rowFont;
  ctx.fillText("Rows:  " + NUM_ROWS, rowTextX, rowTextY);
  rowUpBtn.draw(ctx);
  rowDownBtn.draw(ctx);

  ctx.fillStyle = '#ff0';
  ctx.font = columnFont;
  ctx.fillText("Columns:  " + NUM_COLS, columnTextX, columnTextY);
  columnUpBtn.draw(ctx);  
  columnDownBtn.draw(ctx);

  playBtn.draw();  
}

/* Write mouse position */
canvas.addEventListener('mousemove', () => {
  let mousePos = getMousePos();   
  let mPos = document.getElementById("mouse-coord");

  mPos.innerHTML = "Mouse Coordinate: (" + mousePos.x +", "+ mousePos.y +")";
 
  if (MENU === true) {
    rowUpBtn.draw(ctx);
    rowDownBtn.draw(ctx);    
    columnUpBtn.draw(ctx);  
    columnDownBtn.draw(ctx);  
    playBtn.draw();
  }
})

/* Click Event
 * Adjust row and column
 * Load game when play button is clicked if number of cards set is even
 */
canvas.addEventListener('click', () => {
  if (MENU === true ) {
    if (columnUpBtn.isMouseOnButton() && (((NUM_COLS + 1) * NUM_ROWS <= 30) || ((NUM_COLS * (NUM_ROWS + 1) <= 30)))) {
      NUM_COLS++;
      loadMenu();
    }
    if (columnDownBtn.isMouseOnButton() && NUM_COLS > 1) {
      NUM_COLS--;
      loadMenu();
    }
    if (rowUpBtn.isMouseOnButton()&& (((NUM_COLS + 1) * NUM_ROWS <= 30) || ((NUM_COLS * (NUM_ROWS + 1) <= 30)))) {
      NUM_ROWS++;
      loadMenu();
    }
    if (rowDownBtn.isMouseOnButton() && NUM_ROWS > 1) {
      NUM_ROWS--;
      loadMenu();
    }
  }

  if (MENU === true  &&  playBtn.isMouseOnButton()) { 
    if (NUM_COLS * NUM_ROWS % 2 !== 0) {
      alert("Total cards is not even. Adjust number of rows or columns.");
    }

    if (NUM_COLS * NUM_ROWS % 2 === 0) {
      GAME_START = true;
      IN_GAME = true;      
      MENU = false;     
      drawGame();           
    }
  }
})