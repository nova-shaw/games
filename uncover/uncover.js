
import { Timer } from '../_common/modules/timer.js';
import * as choose from '../_common/modules/choose.js';
import { easeOutQuad } from '../_common/modules/utils.js';
import { uiElement } from '../_common/modules/ui-element.js';

const log = console.log;

// const board = document.querySelector('#board');
const btnPlay   = document.querySelector('#btn-play');
const btnCancel = document.querySelector('#btn-cancel');
const btnReset  = document.querySelector('#btn-reset');
const btnReveal = document.querySelector('#btn-reveal');



const speed = { min: 80, max: 1000}; // DOM slider is normalised value (ie 0-1 float)

const panelGrid = [4, 4];
// const panelCount = panelGrid.reduce((a, b) => { a * b });
const panelCount = panelGrid[0] * panelGrid[1];
// log(panelCount);


const imageElm = document.querySelector('.compcard img');
const textElm = document.querySelector('.compcard p');

imageElm.src = '../_lessons/class5_bookb_07/english.svg';
textElm.textContent = 'English';

// Build Panels
const panelParent = document.querySelector('#panels');
panelParent.style = `--cols: ${panelGrid[0]}; --rows: ${panelGrid[1]};`

for (let i = 0; i < panelCount; i++) {

  const panel = uiElement({ type: 'div', classes: 'panel pattern stripes',
    attrs: { 'style': `--anim-delay:${i}` }, // Thanks for the CSS-only stagger idea: https://stackoverflow.com/a/70476658
    data_attrs: { 'index': i }
  })

  panelParent.appendChild(panel)
}

// Set up Chooser
const panelList = document.querySelectorAll('.panel');
choose.setup(panelList.length);


// Set up Timer
const timer = new Timer(
  [{ ms: 100, fn: chooseNext }],
  onStart, onPause, onCancel
);



///////////////////////////////////////////////////////////////
// Timer Callbacks

function onStart() {
  chooseNext();
  document.body.classList.remove('reveal');

  // Enable play-state buttons
  document.body.classList.add('running');
  btnCancel.toggleAttribute('disabled', false);
}


function onPause() {
  // Indicate the current card is chosen, animate out
  // if (index != null) panelParent.children[index].classList.replace('show', 'hide');
  // if (index != null) panelParent.children[index].classList.add('hide');
  if (index != null) panelParent.children[index].classList.replace('focus', 'hide');

  // Remove this card's index from list of possibilities
  const indexArray = choose.removeIndex(index);

  // Enable play-state buttons
  document.body.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
  
  // If no more options, disable other buttons
  if (indexArray.length == 0) {
    btnPlay.toggleAttribute('disabled', true);
    btnReveal.toggleAttribute('disabled', true);
  }

  log(panelList)
}


function onCancel() {
  // Remove focus style without choosing
  if (index != null) panelParent.children[index].classList.remove('focus');

  // Disable play-state buttons
  document.body.classList.remove('running');
  btnCancel.toggleAttribute('disabled', true);
}


let index = null;
function chooseNext() { 
  // Remove focus from last focused card
  if (index != null) panelParent.children[index].classList.remove('focus');

  index = choose.random();
  // index = choose.next();
  // index = choose.nextReverse();

  // Add focus style to element at chosen index
  if (index != null) panelParent.children[index].classList.add('focus');
}



///////////////////////////////////////////////////////////////
// UI Events

btnPlay.addEventListener('click', e => {
  timer.toggle();
});


btnCancel.addEventListener('click', e => {
  timer.cancel();
});


btnReset.addEventListener('click', e => {
  timer.cancel();
  document.body.classList.remove('reveal');

  // Re-run setup to clear history etc
  choose.setup(panelList.length);

  // Reset all cards' classes without animating
  panelList.forEach( child => {
    // child.classList.add('show');
    child.classList.remove('hide');
  });

  // Enable play-state buttons
  btnPlay.toggleAttribute('disabled', false);
  btnReveal.toggleAttribute('disabled', false);
});


btnReveal.addEventListener('click', e => {

  document.body.classList.add('reveal');
  timer.cancel();

  // Hide all cards without animating
  panelList.forEach( child => {
    // child.classList.remove('show');
    child.classList.add('hide');
  });

  // Disable play-state buttons
  btnPlay.toggleAttribute('disabled', true);
  btnReveal.toggleAttribute('disabled', true);
})


///////////////////////////////
// Speed change

const rngSpeed = document.querySelector('#rng-speed');
rngSpeed.addEventListener('input', updateSpeedFromSlider);

function updateSpeedFromSlider() {
  const shapedValue = ((speed.max - speed.min) - easeOutQuad(rngSpeed.value) * (speed.max - speed.min)) + speed.min;
  // Update first interval only (chooseAndShow) - leave second interval (hideAll) as a constant
  timer.updateInterval(0, shapedValue);
}

updateSpeedFromSlider(); // Init value from DOM element
