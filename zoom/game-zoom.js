import { lerp, norm, easeInQuart, easeOutQuart, easeInCubic, easeOutQuad, easeOutCubic } from '../_common/modules/utils.js';
import { uiElement } from '../_common/modules/ui-element.js';
import * as timer from '../_common/modules/timer.js';
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display');
let card = null;

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
  card = buildBlankCard().card;
  card.classList.add('blank');
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
  const newCard = buildCard(cardData);
  newCard.classList.add('zoom')
  const oldCard = document.querySelector('#deck .card');
  oldCard.replaceWith(newCard);
  card = newCard;
}



function buildCard(cardData) {

  const blank = buildBlankCard();

  const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
  const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });

  blank.face.appendChild(img);
  blank.face.appendChild(text);

  // blank.card.addEventListener('click', startZoom);

  return blank.card;
}

function buildBlankCard() {
  const card = uiElement({ type: 'div', classes: 'card' });
  const face = uiElement({ type: 'div', classes: 'face' });
  card.appendChild(face);
  return { card: card, face: face };
}




buildDeck(lessonData.data);


function startZoom(e) {
  const card = e.currentTarget;
  card.classList.toggle('zoom');
}




//// Play
const range = document.querySelector('#rng_playback');

range.addEventListener('pointerdown', e => {
  wasPlayingBeforePause = playing;
  playing = false;
  startAt = lerp(e.currentTarget.value, 0, animDuration);
  doTheAnimation(e.currentTarget.value);
});

range.addEventListener('input', e => {
  // log(playing);
  
  // log(e.currentTarget.value);
  // animElapsed = lerp(e.currentTarget.value, 0, animDuration);
  startAt = lerp(e.currentTarget.value, 0, animDuration);
  doTheAnimation(e.currentTarget.value);
});

range.addEventListener('pointerup', e => {
  // log('up');
  // log(wasPlayingBeforePause);
  if (wasPlayingBeforePause == true) {
    animPlay();
  }
});


let playing = false;
let animDuration = 2000;
let animElapsed = 0;
let startAt = 0;
let zero = 0;
let wasPlayingBeforePause = false;

function animate(timestamp) {

  if (!playing) return;


  const elapsed = timestamp - zero; // How many MS have elapsed since starting
  animElapsed = startAt + elapsed;


  const per = (animElapsed / animDuration);
  range.value = per;
  doTheAnimation(per);

  if (animElapsed >= animDuration) {
    // playing = false;
    // animPause();
    animReset();
  }

  requestAnimationFrame(animate);
}



const maxZoom = 40;

function doTheAnimation(per) { // `per` is float 0-1
  const factor = easeInQuart(1 - per); // Invert the percent and ease
  const val = (maxZoom * factor) + 1;
  card.style.setProperty(`--zoom`, val);
}



const btnPlay = document.querySelector('#btn_playtoggle');
btnPlay.addEventListener('click', () => {
  if (playing) {
    animPause();
  } else {
    animPlay();
  }
});

function animPlay() {
  playing = true;
  zero = document.timeline.currentTime;
  animate(zero);
}

function animPause() {
  startAt = animElapsed;
  playing = false;
}

function animReset() {
  startAt = 0;
  animElapsed = 0;
  playing = false;
}