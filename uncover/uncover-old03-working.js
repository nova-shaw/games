
const log = console.log;

let cardArray = document.querySelectorAll('.card.show');

// let index;
let card = null;
let indexHistoryMax = 2; // This needs to reduce as choiceArray gets shorter
let indexHistory = [];

// let choiceArray = fillArrayConsecutive(cardArray.length);
// log(choiceArray);



let playing = false;
// let playing = true;

const interval = setInterval( () => {
  if (!playing) return;
  
  pickCard();

}, 100);

let lastIndex = null;
// let lastCard = null;

function pickCard() {
  log('pickCard')

  if (card) card.classList.remove('focus');

  // let index = 0; // default if there is only one choice

  if (cardArray.length > 3) {
    if (indexHistory.length == indexHistoryMax) indexHistory.shift();
    index = randomIndexExclude(cardArray.length - 1, indexHistory);
    indexHistory.push(index);

  } else if (cardArray.length > 1) {
    index = randomIndexExclude(cardArray.length - 1, indexHistory);
    indexHistory = [index];
  }
  log(indexHistory);

  card = cardArray[index];
  card.classList.add('focus');

  lastIndex = index;
}

function uncoverCard() {
  
  card.classList.remove('show', 'focus');

  indexHistory = [];
  cardArray = document.querySelectorAll('.card.show');
  log(cardArray);
}


//// From timer.js

function randomIndexExclude(max, excludeArray) { //// Choose random index, excluding previousIndexes
  let chosen = null;
  while (chosen === null) {
    const candidate = randomIntInclusive(0, max);
    if (excludeArray.length === 0) chosen = candidate;
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

// log(fillArrayConsecutive(cardArray.length));