let cards = [];
let numTries = 0;

const END_FONT = "30px Arial";

//Back of card 
const cardBack = new Image();
cardBack.src = "asset/img/back.jpg"; 

//Declare an array with all possible faces
const face1 = new Image();
const face2 = new Image();
const face3 = new Image();
const face4 = new Image();
const face5 = new Image();
const face6 = new Image();
const face7 = new Image();
const face8 = new Image();
const face9 = new Image();
const face10 = new Image();
const face11 = new Image();
const face12 = new Image();
const face13 = new Image();
const face14 = new Image();
const face15 = new Image();
face1.src = "asset/img/anchors.jpg"; 
face2.src = "asset/img/birdcage.jpg";
face3.src = "asset/img/boat.jpg";
face4.src = "asset/img/rainbow.jpg";
face5.src = "asset/img/fortress.jpg";
face6.src = "asset/img/secretcave.jpg";
face7.src = "asset/img/trafalgar.jpg";
face8.src = "asset/img/waterfall.jpg";
face9.src = "asset/img/lake.jpg";
face10.src = "asset/img/phone.jpg";
face11.src = "asset/img/cosmic.jpg";
face12.src = "asset/img/mountain.jpg";
face13.src = "asset/img/pier.jpg";
face14.src = "asset/img/stone.jpg";
face15.src = "asset/img/water.jpg";
const faces = [face1, face2, face3, face4, face5, face6, face7, face8, face9,
   face10, face11, face12, face13, face14, face15];

class Card {
  constructor (x, y, face, width, height) {
    this.x = x;
    this.y = y;
    this.face = face;
    this.width = width;    
    this.height = height;
  }

  isUnderMouse(mousePos) { 
    return (
      mousePos.x >= this.x && mousePos.x <= this.x + this.width 
      && mousePos.y >= this.y && mousePos.y <= this.y + this.height  
    )
  }

  drawFaceDown() {
    ctx.drawImage(cardBack, this.x, this.y, this.width, this.height)
    this.isFaceUp = false;
  }
  drawFaceUp() {
    ctx.drawImage(this.face, this.x, this.y, this.width, this.height)
    this.isFaceUp = true;
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = arr[randomIndex];

    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }
  return arr;
}

function makeGame() {
  let cardWidth = canvas.width / NUM_COLS;
  let cardHeight = canvas.height / NUM_ROWS;
  let selected = [];
  let possibleFaces = [...faces];
  
  // Make array which has 2 of each
  for (let i = 0; i < NUM_COLS * NUM_ROWS / 2; i++) {
    let randomIndex = Math.floor(Math.random() * possibleFaces.length);
    let face = possibleFaces[randomIndex];
    // Push twice onto array
    selected.push(face);
    selected.push(face);
    possibleFaces.splice(randomIndex, 1);
  }

  // Randomize the array
  shuffle(selected);

  // Create cards
  for (let i = 0; i < NUM_COLS; i++) {
    for (let j = 0; j < NUM_ROWS; j++) {
      cards.push(new Card(i * cardWidth + 5, j * cardHeight + 5, selected.pop(), cardWidth - 10, cardHeight - 10));     
    }
  }

  // Draw them face down
  for (let i = 0; i < cards.length; i++) {
    cards[i].drawFaceDown(); 
  }
}

function makeEnd() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle='#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = END_FONT;
  ctx.fillText("You found them all in " + numTries +" tries!", canvas.width / 2, canvas.height / 2); 
}

let flippedCards = [];

function drawGame() {
  if (!MENU && GAME_START && IN_GAME){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle='#77effc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);    
    GAME_START = false;
    makeGame();
  }

  if (!GAME_START && IN_GAME){
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].isMatch) {
        cards[i].drawFaceDown();
      } else {
        cards[i].drawFaceUp();
      }
    }
    flippedCards = [];
  }

  setTimeout(function() {
    cancelAnimationFrame(drawGame)  
  }, 1000);  
}

canvas.addEventListener('click', () => {
  let mousePos = getMousePos(); 

  if (!MENU && IN_GAME && !GAME_START){
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].isUnderMouse(mousePos)) {
        if (flippedCards.length < 2 && !cards[i].isFaceUp) {
          cards[i].drawFaceUp();
          flippedCards.push(cards[i]);
          if (flippedCards.length === 2) {
            numTries++;
            if(flippedCards[0].face === flippedCards[1].face){
              flippedCards[0].isMatch = true;
              flippedCards[1].isMatch = true;
            }
            setTimeout(function() {
              requestAnimationFrame(drawGame);                
            }, 1000);
          }
        } 
      }
    }

    let foundAllMatches = true;
    for (let i = 0; i < cards.length; i++) {
      foundAllMatches = foundAllMatches && cards[i].isMatch;
    }

    if (!MENU && foundAllMatches) {
      IN_GAME = false;
      cancelAnimationFrame(drawGame); 
      setTimeout(makeEnd(), 1000);
    }          
  }
})


