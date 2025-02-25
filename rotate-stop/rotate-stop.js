
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display')
const btnPlay = document.querySelector('button#play');
btnPlay.addEventListener('click', () => {
  document.body.classList.toggle('playing');
  /*cardList.forEach( c => {
    c.classList.toggle('show');
  })*/
});


const cardList = [];


function buildDeck(data) {
  const deck = document.createElement('div');
  deck.id = 'deck';

  data.vocab.forEach( item => {
    const card = buildCard(item);
    cardList.push(card);
    deck.appendChild( card );
  });

  log(cardList);

  display.appendChild(deck);
}



function buildCard(cardData) {

  const card  = document.createElement('div');
  card.classList.add('card');

  const sides = document.createElement('div');
  sides.classList.add('sides');
  const back  = document.createElement('div');
  back.classList.add('back');
  const face = document.createElement('div');
  face.classList.add('face');

  const img = document.createElement('img');
  img.src = `${mediaPath}${cardData.image}`;

  const text = document.createElement('p');
  text.classList.add('text');
  text.textContent = cardData.text;

  face.appendChild(img);
  face.appendChild(text);

  sides.appendChild(face);
  sides.appendChild(back);
  card.appendChild(sides);

  card.addEventListener('click', flipCard);

  return card;
}

function flipCard(e) {
  const card = e.currentTarget.closest('.card');
  // log(card);
  card.classList.toggle('show');
}


buildDeck(lessonData.data);