
const log = console.log;

const cardList = document.querySelectorAll('.card');

// let index;
let card;
let indexHistoryMax = 3; // This needs to reduce as choiceArray gets shorter
let indexHistory = [];

let choiceArray = fillArrayConsecutive(cardList.length);
log(choiceArray);



let playing = false;
// let playing = true;

const interval = setInterval( () => {
  if (!playing) return;
  
  pickCard();

}, 100);

let lastIndex = null;
let lastCard = null;

function pickCard() {
  if (lastCard) lastCard.classList.remove('focus');
  // cardList.forEach( c => c.classList.remove('focus'));
  
  // Pick new card index excluding last 3 choices
  // lastIndex = nextIndexRandom(cardList.length - 1, indexHistory);
  lastIndex = nextIndexRandom(choiceArray.length - 1, indexHistory);
  // if (indexHistory.length >= indexHistoryMax) indexHistory.shift();
  if (indexHistory.length >= indexHistoryMax) indexHistory.length = indexHistoryMax - 1;
  indexHistory.push(lastIndex);
  log('indexHistory', indexHistory);

  // lastCard = cardList[lastIndex];
  lastCard = cardList[choiceArray[lastIndex]];
  lastCard.classList.add('focus');
}

function uncoverCard() {
  indexHistory = [];
  // indexHistoryMax
  log(choiceArray);
  lastCard.classList.add('hide');
  choiceArray.splice(lastIndex, 1);
  log(lastIndex, choiceArray);
}


//// From timer.js

function nextIndexRandom(max, excludeArray) { //// Choose random index, excluding previousIndexes
  let chosen = null;
  while (chosen === null) {
    const candidate = randomIntInclusive(0, max);
    if (excludeArray.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}


function randomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}


////////////////////////////////////////////////

const btnPlay = document.querySelector('#playtoggle');
btnPlay.addEventListener('click', e => {
  log(e);
  if (playing) {
    playing = false;
    uncoverCard();
  } else {
    playing = true;
  }
})


function fillArrayConsecutive(max, startZero = true) {
  // return Array(max).fill().map((_, index) => index + 1);
  // return [...Array(max).keys()].map( index => index + 1);
  return Array(max).fill().map((k, i) => (startZero) ? i : i + 1);
}

// log(fillArrayConsecutive(cardList.length));