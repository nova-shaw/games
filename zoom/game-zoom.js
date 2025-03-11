
import { uiElement } from '../_common/modules/ui-element.js'
import * as timer from '../_common/modules/timer.js'
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display');


const cardList = [];


function buildDeck(data) {
  const deck = uiElement({ type: 'div', id: 'deck' });
  const card = buildCard(data.vocab[4]);
  deck.appendChild(card);
  display.appendChild(deck);
}



function buildCard(cardData) {

  const card = uiElement({ type: 'div', classes: 'card' });
  const face = uiElement({ type: 'div', classes: 'face' });
  const img  = uiElement({ type: 'img', attrs: { src: `${mediaPath}${cardData.image}` } });
  const text = uiElement({ type: 'p', classes: 'text', text: cardData.text });

  face.appendChild(img);
  face.appendChild(text);
  card.appendChild(face);

  card.addEventListener('click', startZoom);

  return card;
}

buildDeck(lessonData.data);


function startZoom(e) {
  const card = e.currentTarget;
  card.classList.toggle('zoom');
}




//// Play

