const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

var imgBackground = new Image();
imgBackground.src = "asset/img/background.jpg";

var MENU = true;
var GAME_START = false;
var IN_GAME = false;

const menuFont = "30px Arial";

var NUM_COLS = 4;
var NUM_ROWS = 4;
const rowFontSize = 20;
const rowFont = rowFontSize + "px Arial";
const rowTextX = canvas.width/4;
const rowTextY = canvas.height/4;
const columnFontSize = rowFontSize;
const columnFont = columnFontSize + "px Arial";
const columnTextX = canvas.width/3*2;
const columnTextY = rowTextY;

/* Get mouse position */
function getMousePos(){
  return{
       x: event.clientX - ctx.canvas.offsetLeft + pageXOffset,
       y: event.clientY - ctx.canvas.offsetTop + pageYOffset
  };
};

/* @param: canvas, color, triangle object position
 *function draw triangle on canvas 
 */
function triangle(ctxx, ctxFill, tri) {
  ctxx.fillStyle = ctxFill;
  ctxx.beginPath();
  ctxx.moveTo(tri.x1, tri.y1);
  ctxx.lineTo(tri.x2, tri.y2);
  ctxx.lineTo(tri.x3, tri.y3);
  ctxx.fill();
}

const columnUpTriangle = {
  x1: rowTextX + 20,
  y1: rowTextY - rowFontSize,
  x2: rowTextX + 30,
  y2: rowTextY - rowFontSize - 10,
  x3: rowTextX + 40,
  y3: rowTextY - rowFontSize
}
const columnDownTriangle = {
  x1: rowTextX + 20,
  y1: rowTextY + 10,
  x2: rowTextX + 30,
  y2: rowTextY + 20,
  x3: rowTextX + 40,
  y3: rowTextY + 10
}
const rowUpTriangle = {
  x1: columnTextX + (columnFontSize * 2),
  y1: columnTextY - columnFontSize,
  x2: columnTextX + (columnFontSize * 2 + 10),
  y2: columnTextY - columnFontSize - 10,
  x3: columnTextX + (columnFontSize * 2 + 20),
  y3: columnTextY - columnFontSize
}
const rowDownTriangle = {
  x1: columnTextX + (columnFontSize * 2),
  y1: columnTextY + 10,
  x2: columnTextX + (columnFontSize * 2 + 10),
  y2: columnTextY + 20,
  x3: columnTextX + (columnFontSize * 2 + 20),
  y3: columnTextY + 10
}
const playButton = {
  x: 20,
  y: 350,
  width: 100,
  height: 50 
}


/* Draw menu screen and play button */
function loadMenu(){
 
  ctx.fillStyle = '#00853F';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(imgBackground, 0, 0, ctx.canvas.width, ctx.canvas.height); 

  ctx.fillStyle = '#fff';
  ctx.font = menuFont;
  ctx.textAlign = "center";
  ctx.fillText("Game Menu ", canvas.width / 2, 50);

  ctx.fillStyle = '#ff0';
  ctx.font = rowFont;
  ctx.fillText("Rows:  " + NUM_ROWS, rowTextX, rowTextY);
  triangle(ctx, '#f0f', rowUpTriangle);
  triangle(ctx, '#f0f', rowDownTriangle);

  ctx.fillStyle = '#ff0';    
  ctx.font = columnFont;
  ctx.fillText("Columns:  " + NUM_COLS, columnTextX, columnTextY);
  triangle(ctx, '#f0f', columnUpTriangle);
  triangle(ctx, '#f0f', columnDownTriangle); 
}