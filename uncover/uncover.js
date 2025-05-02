
const log = console.log;

let cardArray = document.querySelectorAll('.card.show');


let indexHistory = [];
let card = null;
let playing = false;


const interval = setInterval( () => {
  if (!playing) return;
  pickCard();
}, 100);


function pickCard() {
  if (card) card.classList.remove('focus'); // Remove focus on previous card

  if (cardArray.length > 3) {
    if (indexHistory.length == 2) indexHistory.pop(); // Remove last item in array
    indexHistory.unshift(
      randomIndexExclude(cardArray.length - 1, indexHistory) // Add new index to start
    );

  } else if (cardArray.length > 1) {
    indexHistory = [
      randomIndexExclude(cardArray.length - 1, indexHistory) // Array is single value (new index)
    ];
  
  } else {
    indexHistory = [0]; // Array is single value of 0
  }
  log(indexHistory);

  card = cardArray[indexHistory[0]];
  card.classList.add('focus');
}


function uncoverCard() {
  card.classList.remove('show', 'focus');
  indexHistory = [];
  cardArray = document.querySelectorAll('.card.show');
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
  if (playing) {
    playing = false;
    uncoverCard();
  } else {
    playing = true;
  }
})

const btnReset = document.querySelector('#reset');
btnReset.addEventListener('click', e => {
  indexHistory = [];
  card = null;
  playing = false;
  const allCards = document.querySelectorAll('.card');
  allCards.forEach( c => c.classList = ' card show' );
})

const btnReveal = document.querySelector('#reveal');
btnReveal.addEventListener('click', e => {
  indexHistory = [];
  card = null;
  playing = false;
  // const allCards = document.querySelectorAll('.card');
  cardArray.forEach( c => c.classList.remove('show') );
})
