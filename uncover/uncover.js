
import { Timer } from '../_common/modules/timer.js';
import * as choose from '../_common/modules/choose.js';

const log = console.log;

const board = document.querySelector('#board');
const btnPlay   = document.querySelector('#btn-play');
const btnCancel = document.querySelector('#btn-cancel');
const btnReset  = document.querySelector('#btn-reset');
const btnReveal = document.querySelector('#btn-reveal');
const rngSpeed  = document.querySelector('#rng-Speed');


// Set up Chooser
const cardParent = document.querySelector('#cards');
const cardList = document.querySelectorAll('.card');
choose.setup(cardList.length);


// Set up Timer
const timerChoose = new Timer(
  [{ ms: 100, fn: chooseNext }],
  onStart,
  onPause,
  onCancel
);


///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  chooseNext();

  // Enable play-state buttons
  board.classList.add('running');
  btnCancel.toggleAttribute('disabled', false);
}

function onPause() {
  // Indicate the current card is chosen, animate out
  if (index != null) cardParent.children[index].classList.replace('show', 'hide');

  // Remove this card's index from list of possibilities
  const indexArray = choose.removeIndex(index);

  // Enable play-state buttons
  board.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
  
  // If no more options, disable other buttons
  if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  }
}

function onCancel() {
  // Remove focus style without choosing
  if (index != null) cardParent.children[index].classList.remove('focus');

  // Disable play-state buttons
  board.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
}

let index = null;
function chooseNext(ts) { 
  // Remove focus from last focused card
  if (index != null) cardParent.children[index].classList.remove('focus');

  index = choose.random();
  // index = choose.next();
  // index = choose.nextReverse();

  // Add focus style to element at index
  if (index != null) cardParent.children[index].classList.add('focus');
}



///////////////////////////////////////////////////////////////
// UI Events

btnPlay.addEventListener('click', e => {
  timerChoose.toggle();
});

btnCancel.addEventListener('click', e => {
  timerChoose.cancel();
});

btnReset.addEventListener('click', e => {
  timerChoose.cancel();

  // Re-run setup to clear history etc
  choose.setup(cardList.length);

  // Reset all cards' classes without animating
  cardParent.querySelectorAll('.card').forEach( child => {
    child.classList.add('show');
    child.classList.remove('hide');
  });

  // Enable play-state buttons
  btnPlay.toggleAttribute('disabled', false);
  btnReveal.toggleAttribute('disabled', false);
});

btnReveal.addEventListener('click', e => {
  timerChoose.cancel();

  // Hide all cards without animating
  cardParent.querySelectorAll('.card').forEach( child => {
    child.classList.remove('show');
  });

  // Disable play-state buttons
  btnPlay.toggleAttribute('disabled', true);
  btnReveal.toggleAttribute('disabled', true);
})


rngSpeed.addEventListener('input', e => {
  // log(e.target.value, e.target.max);
  // timerChoose.updateInterval(0, e.target.value);
  timerChoose.updateInterval(0, (Number(e.target.max) - e.target.value) + Number(e.target.min));
})

