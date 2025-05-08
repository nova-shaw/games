
// import { uiElement } from '../_common/modules/ui-element.js';
import { buildDeck } from '../_common/modules/card-builder.js';
import { Timer } from '../_common/modules/timer.js';
import * as choose from '../_common/modules/choose.js';
import { lerp, easeOutQuad } from '../_common/modules/utils.js';
import * as fetcher from '../_common/modules/fetcher.js';


import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;

fetcher.all(['../_lessons/kids_5b07.json']);
fetcher.all(['kids_5b07.json'], '../_lessons/');

const display = document.querySelector('#display');
let deck;
let cardList;

// const deck = buildDeck(lessonData.data, mediaPath);

// IIFE = Immediately Invoked Function Expression
(async () => {
  deck = await buildDeck(lessonData.data, mediaPath, flipCard);
  display.appendChild(deck);
  // log(deck.children);
  // log([...deck.children]);
  cardList = [...deck.children];
  choose.setup(cardList.length);
})();




let timer = new Timer(
  [
    { ms: 100, fn: chooseAndShow },
    { ms: 100, fn: hideAll }
  ],
  onStart,
  onPause,
  onCancel
);


// const cardParent = document.querySelector('#deck');
// let deck;
// const cardList = document.querySelectorAll('.card');




function flipCard(e) {
  timer.cancel();
  deck.classList.remove('staggered-flip');

  const card = e.currentTarget;
  const shown = card.classList.toggle('show');

  /*
  const cardIndex = Number(card.dataset.index);
  let indexArray;
  if (shown) {
    indexArray = choose.removeIndex(cardIndex);
  } else {
    indexArray = choose.addIndex(cardIndex);
  }
  // log(indexArray);
  if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  } else {
    btnPlay.toggleAttribute('disabled', false);
    btnReveal.toggleAttribute('disabled', false);
  }
  */
}




//// Play

// const display = document.querySelector('#board');
const btnPlay   = document.querySelector('#btn-play');
// const btnCancel = document.querySelector('#btn-cancel');
const btnReset  = document.querySelector('#btn-reset');
const btnReveal = document.querySelector('#btn-reveal');
const rngSpeed  = document.querySelector('#rng-speed');





///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  // chooseAndShow();

  // Enable play-state buttons
  display.classList.add('running');
  // btnCancel.toggleAttribute('disabled', false);
}


function onPause() {
  
  // Keep current card shown
  if (index != null) deck.children[index].classList.add('show');

  // Remove this card's index from list of possibilities
  // const indexArray = choose.removeIndex(index);

  // Enable play-state buttons
  display.classList.remove('running');
  // btnCancel.toggleAttribute('disabled', true);
  
  // If no more options, disable other buttons
  /*if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  }*/
}


function onCancel() {
  // Remove focus style without choosing
  if (index != null) deck.children[index].classList.remove('focus');

  // Disable play-state buttons
  display.classList.remove('running');
  // btnCancel.toggleAttribute('disabled', true);
}


let index = null;
function chooseAndShow() {
  // Remove focus from last focused card
  // if (index != null) deck.children[index].classList.remove('show');

  // index = choose.random();
  index = choose.next();
  // index = choose.nextReverse();

  // Add focus style to element at chosen index
  if (index != null) deck.children[index].classList.add('show');
}

function hideLast() {
  if (index != null) deck.children[index].classList.remove('show');
}

function hideAll() {
  cardList.forEach( c => c.classList.remove('show') );
}


///////////////////////////////////////////////////////////////
// UI Events

btnPlay.addEventListener('click', e => {
  deck.classList.remove('staggered-flip');
  timer.toggle(0);
});


/*btnCancel.addEventListener('click', e => {
  deck.classList.remove('staggered-flip');
  timer.cancel();
});
*/

btnReset.addEventListener('click', e => {
  timer.cancel();

  // Re-run setup to clear history etc
  choose.setup(cardList.length);


  // Show all cards with time stagger
  deck.classList.add('staggered-flip');
  deck.querySelectorAll('.card').forEach( child => {
    child.classList.remove('show');
  });

  // Enable play-state buttons
  btnPlay.toggleAttribute('disabled', false);
  btnReveal.toggleAttribute('disabled', false);
});


btnReveal.addEventListener('click', e => {
  timer.cancel();


  // Hide all cards with time stagger
  deck.classList.add('staggered-flip');
  deck.querySelectorAll('.card').forEach( child => {
    child.classList.add('show');
  });

  // Disable play-state buttons
  btnPlay.toggleAttribute('disabled', true);
  btnReveal.toggleAttribute('disabled', true);
})


rngSpeed.addEventListener('input', updateSpeedFromSlider);

const speed = { min: 400, max: 1200}; // DOM slider is normalised value (ie 0-1 float)

// Needs to be its own function to allow timer to update from UI slider on page load
function updateSpeedFromSlider() {
  const shapedValue = ((speed.max - speed.min) - easeOutQuad(rngSpeed.value) * (speed.max - speed.min)) + speed.min;
  timer.updateInterval(0, shapedValue);
  // timer.updateInterval(1, shapedValue / 2);
}


updateSpeedFromSlider();



/*

function showCard(index) {
  // log('show', index)
  cardList[index].classList.add('show');
}

function hideCard(index) {
  // log('hide', index)
  cardList[index].classList.remove('show');
}


//// Utils

function speedToInterval(value) {
  return 2400 - (value * 20);
}

function speedToGap(value) {
  return 800 - (value * 5);
}*/