
import { uiElement } from '../_common/modules/ui-element.js';
import { Timer } from '../_common/modules/timer.js';
import * as choose from '../_common/modules/choose.js';
import { lerp, easeOutQuad } from '../_common/modules/utils.js';

import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;

let timerChoose = new Timer(
  [
    { ms: 100, fn: chooseAndShow },
    { ms: 100, fn: hideLast }
  ],
  onStart,
  onPause,
  onCancel
);


const display = document.querySelector('#display');

// const cardParent = document.querySelector('#deck');
let deck;
// const cardList = document.querySelectorAll('.card');


const cardList = [];

function buildDeck(data) {
  deck = uiElement({ type: 'div', id: 'deck' });

  data.vocab.forEach( (item, index) => {
    const card = buildCard(item, index);
    cardList.push(card);
    deck.appendChild(card);
  });

  log(cardList);
  choose.setup(cardList.length);

  display.appendChild(deck);

  
}



function buildCard(cardData, index) {

  const card  = uiElement({ type: 'div', classes: 'card',
    attrs: { 'style': `--anim-delay:${index}` },
    data_attrs: { 'index': index }
  });

  const sides = uiElement({ type: 'div', classes: 'sides' });
  const back  = uiElement({ type: 'div', classes: 'back' });
  const face  = uiElement({ type: 'div', classes: 'face' });
  
  const image = uiElement({ type: 'img', attrs: { 'src': `${mediaPath}${cardData.image}` } });
  const text  = uiElement({ type: 'p',   classes: 'text', text: cardData.text });

  face.appendChild(image);
  face.appendChild(text);

  sides.appendChild(face);
  sides.appendChild(back);
  card.appendChild(sides);

  card.addEventListener('click', flipCard);

  return card;
}

buildDeck(lessonData.data);


function flipCard(e) {
  timerChoose.cancel();
  deck.classList.remove('staggered-flip');

  const card = e.currentTarget;
  const shown = card.classList.toggle('show');

  const cardIndex = Number(card.dataset.index);
  /*
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
const btnCancel = document.querySelector('#btn-cancel');
const btnReset  = document.querySelector('#btn-reset');
const btnReveal = document.querySelector('#btn-reveal');
const rngSpeed  = document.querySelector('#rng-speed');





///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  // chooseAndShow();

  // Enable play-state buttons
  display.classList.add('running');
  btnCancel.toggleAttribute('disabled', false);
}


function onPause() {
  // Indicate the current card is chosen, animate out
  if (index != null) deck.children[index].classList.add('show');

  // Remove this card's index from list of possibilities
  // const indexArray = choose.removeIndex(index);

  // Enable play-state buttons
  display.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
  
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
  btnCancel.toggleAttribute('disabled', true);
}


let index = null;
function chooseAndShow() {
  // Remove focus from last focused card
  // if (index != null) deck.children[index].classList.remove('show');

  // index = choose.random();
  index = choose.next();
  // index = choose.nextReverse();
  // log('chooseAndShow', index)

  // Add focus style to element at chosen index
  if (index != null) deck.children[index].classList.add('show');
}

function hideLast() {
  // log('hideLast', index)
  if (index != null) deck.children[index].classList.remove('show');
}


///////////////////////////////////////////////////////////////
// UI Events

btnPlay.addEventListener('click', e => {
  deck.classList.remove('staggered-flip');
  timerChoose.toggle(0);
});


btnCancel.addEventListener('click', e => {
  deck.classList.remove('staggered-flip');
  timerChoose.cancel();
});


btnReset.addEventListener('click', e => {
  timerChoose.cancel();

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
  timerChoose.cancel();


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

const speed = { min: 300, max: 1200}; // DOM slider is normalised value (ie 0-1 float)

// Needs to be its own function to allow timer to update from UI slider on page load
function updateSpeedFromSlider() {
  const shapedValue = ((speed.max - speed.min) - easeOutQuad(rngSpeed.value) * (speed.max - speed.min)) + speed.min;
  timerChoose.updateInterval(0, shapedValue);
  timerChoose.updateInterval(1, shapedValue / 2);
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