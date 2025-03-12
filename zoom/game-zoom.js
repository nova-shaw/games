import { lerp, norm, easeInQuart, easeOutQuart, easeInCubic, easeOutQuad, easeOutCubic } from '../_common/modules/utils.js';
import { uiElement } from '../_common/modules/ui-element.js';
import * as timer from '../_common/modules/timer.js';
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display');
let card = null;
let face = null;
let text = null;

const cardList = [];


function buildDeck(data) {
  const deck = uiElement({ type: 'div', id: 'deck' });
  
  const cardChooser = document.querySelector('ul#card-chooser');

  data.vocab.forEach( item => {
    const cardThumb = buildCardThumb(item);
    // cardList.push(cardThumb);
    cardChooser.appendChild(cardThumb);
  });

  // const card = buildCard(data.vocab[4]);
  // const card = buildBlankCard().card;
  card = buildCard();
  // card.classList.add('blank');
  deck.appendChild(card);
  display.appendChild(deck);
}


function buildCardThumb(cardData) {
  
  const li = uiElement({ type: 'li', classes: 'card-thumb', data_attrs: { card: cardData.slug } });
  const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
  const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });

  li.appendChild(img);
  li.appendChild(text);

  li.addEventListener('click', chooseCard);
  
  return li;
}



function chooseCard(e) {
  const cardSlug = e.currentTarget.dataset.card;
  const cardData = lessonData.data.vocab.find( item => item.slug == cardSlug );
  // log(cardData);
  // log(cardSlug);
  
  /*const newCard = buildCard(cardData);
  newCard.classList.add('zoom')
  const oldCard = document.querySelector('#deck .card');
  oldCard.replaceWith(newCard);
  card = newCard;*/


  const face = buildCardFace(cardData);
  const currentface = card.querySelector('.face');
  text = face.querySelector('.text');
  currentface.replaceWith(face);


  const poi = (cardData.poi) ? cardData.poi : [50, 50];
  card.style.setProperty('--poi', `${poi[0]}% ${poi[1]}%`)
  card.style.setProperty(`--zoom`, maxZoom);

  animReset();
}



function buildCard(cardData) {

  const card = uiElement({ type: 'div', classes: 'card' });
  const face = buildCardFace(cardData);
  card.appendChild(face);

  return card;
}

// function buildBlankCard() {
//   const card = uiElement({ type: 'div', classes: 'card' });
//   const face = uiElement({ type: 'div', classes: 'face blank' });
//   card.appendChild(face);
//   return card;
// }

function buildCardFace(cardData = null) {
  const face = uiElement({ type: 'div', classes: 'face' });
  if (cardData) {
    const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
    const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });
    face.appendChild(img);
    face.appendChild(text);
  } else {
    face.classList.add('blank');
  }
  return face;
}




buildDeck(lessonData.data);





///////////////////////////////////////////////////////////////
// Actual animation

const maxZoom = 40;
const minZoom = 1;

function doTheAnimation(per) { // `per` is float 0-1
  const factor = easeInQuart(1 - per); // Invert the percent and ease
  // const val = (maxZoom * factor) + minZoom;
  const val = lerp(factor, minZoom, maxZoom);
  card.style.setProperty(`--zoom`, val);
  text?.classList.toggle('show', per > 0.98);
}





///////////////////////////////////////////////////////////////
// Animation controls UI

const animToggle = document.querySelector('#btn_playtoggle');
const animRange  = document.querySelector('#rng_playback');
const animReveal = document.querySelector('#btn_reveal');

animToggle.addEventListener('click', () => {
  if (playing) {
    animPause();
  } else {
    animPlay();
  }
});

animRange.addEventListener('pointerdown', e => {
  playOnRelease = playing;
  playing = false;
  // animJump(e.currentTarget.value);
  animJumpFromRange(e);
});

animRange.addEventListener('input', e => {
  // animJump(e.currentTarget.value);
  animJumpFromRange(e);
});

animRange.addEventListener('pointerup', e => {
  if (playOnRelease) animPlay();
});

animReveal.addEventListener('click', e => {
  // duration = 1000;
  animPlay(1000);
})


///////////////////////////////////////////////////////////////
// Animation internals

const durationMain = 10000;
// let durationOnce = null;

let duration = durationMain;
let playing = false;
let elapsed = 0;
let startAt = 0;
let zero = 0;
let playOnRelease = false;

function animLoop(timestamp) {

  if (!playing) return;

  requestAnimationFrame(animLoop);

  elapsed = startAt + (timestamp - zero);

  const per = (elapsed / duration);
  animRange.value = per;

  doTheAnimation(per);

  if (elapsed >= duration) {
    // elapsed = duration;
    animEnd();
    // animReset();
  }
}

function animPlay(durationOnce = null) {
  if (durationOnce) {
    startAt = durationOnce * (elapsed / duration);
    duration = durationOnce;
  }
  playing = true;
  zero = document.timeline.currentTime;
  animLoop(zero);
}

function animPause() {
  duration = durationMain;
  startAt = elapsed;
  playing = false;
}

function animEnd() {
  duration = durationMain;
  elapsed = 0;
  animRange.value = 1;
  doTheAnimation(1);
  playing = false;
}

function animReset() {
  duration = durationMain;
  startAt = 0;
  // elapsed = 0;
  animRange.value = 0;
  playing = false;
}

function animJump(per) {
  startAt = lerp(per, 0, duration);
  animRange.value = per;
  doTheAnimation(per);
}

function animJumpFromRange(e) { // Same as `animJump` but doesn't set UI range value
  startAt = lerp(e.currentTarget.value, 0, duration);
  doTheAnimation(e.currentTarget.value);
}
