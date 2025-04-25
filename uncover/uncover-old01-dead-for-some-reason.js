
const log = console.log;




///////////////////////////////////////////////////////////////

const cardList = document.querySelectorAll('.card');
let chosenIndex = null;
let chosenCard  = null;


function chooseCard() {
  if (chosenCard) chosenCard.classList.remove('focus');

  chosenIndex = chooseIndex();
  log(chosenIndex);
  chosenCard  = cardList[chosenIndex];
  chosenCard.classList.add('focus');
}

function uncoverCard() {
  chosenCard.classList.add('hide');
}



///////////////////////////////////////////////////////////////


let playing = false;
// let playing = true;

const interval = setInterval( () => {
  if (!playing) return;
  // log('chosenIndex', chosenIndex);
  // chooseCard();
}, 500);



///////////////////////////////////////////////////////////////

const choiceArray = fillArrayConsecutive(cardList.length); // results in an array of indices, like [0, 1, 2, 3 etc] - one index for each choice
const choiceHistory = [];
const choiceHistoryMax = 3;

function chooseIndex() {
  log(choiceArray);

  let index;

  if (choiceArray.length = 0) {
    console.error('No choices left!');
    return;
  
  } else if (choiceArray.length == 1) {
    index = 0;
  
  } else {
    index = nextIndexRandom(choiceArray.length - 1, choiceHistory);
    if (choiceHistory.length == choiceHistoryMax) choiceHistory.shift(); // remove first in history if at maximum history length
    choiceHistory.push(index);
  }

  log('chooseIndex', index);

  return index;
}

function removeIndexFromChoices(index) {
  choiceArray.splice(index, 1);
}





///////////////////////////////////////////////////////////////







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


///////

const btnPlay = document.querySelector('#playtoggle');
btnPlay.addEventListener('click', e => {
  if (playing) {
    playing = false;
    // uncoverCard();
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