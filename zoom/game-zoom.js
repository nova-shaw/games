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
range.addEventListener('input', e => {
  // log(e.currentTarget.value);
  animElapsed = lerp(e.currentTarget.value, 0, animDuration);
  doTheAnimation(e.currentTarget.value);
})


let playing = false;
let animDuration = 2000;
let animElapsed = 0;
let startElapsed = 0;
// let elapsed = 0;
let zero = 0;

function animate(timestamp) {

  if (!playing) {
    startElapsed = animElapsed;
    return;
  }

  const elapsed = timestamp - zero; // How many MS have elapsed since starting
  
  //// BAD: both of these add exponentially to the `animElapsed`
  // animElapsed += elapsed;
  // animElapsed = animElapsed + elapsed;

  // animElapsed = animElapsed + (timestamp - zero);
  animElapsed = startElapsed + (timestamp - zero);

  if (animElapsed >= animDuration) {
    playing = false;
    // return;
  }
  
  // log('t', timestamp, 'z', zero, 'elapsed', elapsed);
  

  // log('timestamp - zero', timestamp - zero);
  // elapsed = timestamp - zero;
  // animElapsed = timestamp - zero;
  // animElapsed += timestamp - zero;
  // animElapsed = animElapsed + (timestamp - zero);
  // animElapsed += elapsed;
  // log(zero);

  log('animElapsed', animElapsed);
  log('startElapsed', startElapsed);

  const per = (animElapsed / animDuration);
  range.value = per;
  doTheAnimation(per);


  requestAnimationFrame(animate);
}

/*document.body.addEventListener('dblclick', e => {
  // zero = document.timeline.currentTime;
  // playing = true;
  // animate(zero);
})*/
const maxZoom = 40;

function doTheAnimation(per) {
  // log(per);
  const inversePer = 1 - per
  // const val = norm(inversePer/100, 1, maxZoom);
  // const val = norm(inversePer/100, maxZoom, 1);
  // const val = norm(per/100, maxZoom, 1);
  // const val = norm(per/100, 1, maxZoom);
  // const val = maxZoom * norm(inversePer/100, 1, maxZoom);
  // const val = maxZoom * norm(per/100, 1, maxZoom);
  // const val = maxZoom * per;
  // const factor = easeOutQuad(inversePer);
  // const factor = easeOutCubic(inversePer);
  
  // const val = maxZoom * (inversePer) + 1;

  // const factor = easeInQuad(inversePer);
  // const factor = easeInCubic(inversePer);
  const factor = easeInQuart(inversePer);
  // const factor = easeOutQuart(inversePer);
  const val = (maxZoom * factor) + 1;
  
  // log(per, val);
  // card.style.setProperty(`--zoom`, (10 - percent/10) + 1);
  card.style.setProperty(`--zoom`, val);
}



const btnPlay = document.querySelector('#btn_playtoggle');
btnPlay.addEventListener('click', e => {

  if (playing) {
    playing = false;
    // animElapsed += elapsed;
    log('pause');
  } else {
    playing = true;
    zero = document.timeline.currentTime;
    animate(zero);
  }

});

function animPlay() {
  
}