const randIndex=function(lastIndex){
  return Math.floor(Math.random() * (lastIndex + 1));
};

let allCards=[
  "&#127136;", "&#127137;", "&#127138;", "&#127139;", "&#127140;", "&#127141;",
  "&#127142;", "&#127143;", "&#127144;", "&#127145;", "&#127146;", "&#127147;",
  "&#127148;", "&#127149;", "&#127150;", "&#127153;", "&#127154;", "&#127155;",
  "&#127156;", "&#127157;", "&#127158;", "&#127159;", "&#127160;", "&#127161;",
  "&#127162;", "&#127163;", "&#127164;", "&#127165;", "&#127166;", "&#127167;",
  "&#127169;", "&#127170;", "&#127171;", "&#127172;", "&#127173;", "&#127174;",
  "&#127175;", "&#127176;", "&#127177;", "&#127178;", "&#127179;", "&#127180;",
  "&#127181;", "&#127182;", "&#127183;", "&#127185;", "&#127186;", "&#127187;",
  "&#127188;", "&#127189;", "&#127190;", "&#127191;", "&#127192;", "&#127193;",
  "&#127194;", "&#127195;", "&#127196;", "&#127197;", "&#127198;", "&#127199;"
];

let cardBack=allCards[0];

// game state
let gameDeck=[];
let currentPair=[];
let lockBoard=false;
let score=0;
let moves=0;
let seconds=0;
let timerId=null;
let timerRunning=false;

function updateScore(){
  document.querySelector("#score").textContent="Score: " + score;
}

function updateMoves(){
  document.querySelector("#moves").textContent="Moves: " + moves;
}

function updateTime(){
  document.querySelector("#time").textContent="Time: " + seconds + "s";
}

function startTimer(){
  if (timerRunning) return;
  timerRunning=true;
  timerId=setInterval(function(){
    seconds+=1;
    updateTime();
  },1000);
}

function stopTimer(){
  if (timerId !== null) clearInterval(timerId);
  timerId=null;
  timerRunning=false;
}

function cardIndexFromId(cardEl){
  return Number(cardEl.id.slice(5)); // "card-10" -> 10
}

function shuffleDeck(deck){
  for (let i=deck.length-1; i>0; i--){
    let j=randIndex(i);
    let temp=deck[i];
    deck[i]=deck[j];
    deck[j]=temp;
  }
}

function buildDeck(){
  // copy the list (so restart works cleanly)
  let pool=allCards.slice();
  cardBack=pool[0];
  pool.shift();
  let eight=[];
  for (let i=0; i<8; i++){
    let r=randIndex(pool.length-1);
    eight.push(pool[r]);
    pool.splice(r,1);
  }
  gameDeck=eight.concat(eight);
  shuffleDeck(gameDeck);
}

function allMatched(){
  for (let i=0; i<16; i++){
    if (document.querySelector("#card-" + i).onclick !== null) return false;
  }
  return true;
}

const handleClick=function(event){
  if (lockBoard) return;
  startTimer();
  let cardEl=event.target;
  // prevent clicking same card twice
  if (currentPair.length === 1 && currentPair[0] === cardEl) return;
  let idx=cardIndexFromId(cardEl);
  // flip up
  cardEl.innerHTML=gameDeck[idx];
  currentPair.push(cardEl);

  if (currentPair.length === 2){
    lockBoard=true;
    moves+=1;
    updateMoves();
    let firstEl=currentPair[0];
    let secondEl=currentPair[1];
    let firstIdx=cardIndexFromId(firstEl);
    let secondIdx=cardIndexFromId(secondEl);

    if (gameDeck[firstIdx] === gameDeck[secondIdx]){
      //match: disable
      firstEl.onclick=null;
      secondEl.onclick=null;
      score+=1;
      updateScore();
      currentPair=[];
      lockBoard=false;
      
      if (allMatched()){
        stopTimer();
        document.querySelector("#score").textContent =
          "You won! Score: " + score + " | Moves: " + moves + " | Time: " + seconds + "s";
      }
    } else{
      //no match: flip back
      setTimeout(function(){
        firstEl.innerHTML=cardBack;
        secondEl.innerHTML=cardBack;

        currentPair=[];
        lockBoard=false;
      },700);
    }
  }
};

function attachClicks(){
  for (let i=0; i<16; i++){
    document.querySelector("#card-" + i).onclick=handleClick;
  }
}
function resetBoardVisuals(){
  for (let i=0; i<16; i++){
    document.querySelector("#card-" + i).innerHTML=cardBack;
  }
}
function restartGame(){
  stopTimer();
  seconds=0;
  updateTime();
  score=0;
  moves=0;
  updateScore();
  updateMoves();
  currentPair=[];
  lockBoard=false;
  buildDeck();
  resetBoardVisuals();
  attachClicks();
}

//restart
document.querySelector("#restartBtn").onclick=restartGame;

//initial setup
restartGame();
