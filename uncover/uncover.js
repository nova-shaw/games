
import { Timer } from '../_common/modules/timer-class.js';

const log = console.log;


let cards = document.querySelector('#cards');
let cardArray = document.querySelectorAll('.card.show');
let card = null;
let index = null;
let indexHistory = [];
// let card = null;
let running = false;


function pickCard(ts) {

  // if (index != null) cards.children[index].classList.remove('picked');
  cardArray.forEach( c => c.classList.remove('picked') );
  
  // log('pickCard', ts);
  index = randomIndexExclude(cardArray.length-1, indexHistory);
  if (indexHistory.length > 2) indexHistory.shift();
  indexHistory.push(index);

  // log(index, indexHistory);
  // log(card);
  
  // cards.children[indexHistory[indexHistory.length-1]].classList.remove('picked');

  card = cards.children[index];  
  card.classList.add('picked');
}


const btnPlay = document.querySelector('#playtoggle');
const btnReset = document.querySelector('#reset');
const btnReveal = document.querySelector('#reveal');

const pickTimer = new Timer(true, [{ms: 200, fn: pickCard}]);



btnPlay.addEventListener('click', e => {
  log('running1', running);

  if (running == true) {
    // log('select');
    running = pickTimer.pause();
    if (card != null) card.classList.remove('show');
    // btnPlay.classList.remove('running');
  }

  if (running == false) {
    // log('start');
    prepPicker();
    running = pickTimer.start();
    // btnPlay.classList.add('running');
  }

  log('running2', running);

  // running = pickTimer.toggle(); // returns boolean
  btnPlay.classList.toggle('running', running);
  // log(running);

})


function prepPicker() {
  cardArray = document.querySelectorAll('.card.show');
  indexHistory = [];
}



///////////////////////////////////////////////////////////////

// Choose random index, excluding previousIndexes
function randomIndexExclude(max, excludeArray = []) {
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