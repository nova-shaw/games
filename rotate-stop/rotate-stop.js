
import * as timer from '../_common/modules/timer.js'
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display')
const btnPlay = document.querySelector('button#play');
const rngSpeed = document.querySelector('#speed');


const cardList = [];


function buildDeck(data) {
  const deck = document.createElement('div');
  deck.id = 'deck';

  data.vocab.forEach( item => {
    const card = buildCard(item);
    cardList.push(card);
    deck.appendChild(card);
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

  // card.addEventListener('click', flipCard);

  return card;
}

/*function flipCard(e) {
  const card = e.currentTarget.closest('.card');
  // log(card);
  card.classList.toggle('show');
}*/


buildDeck(lessonData.data);


//// Play

btnPlay.addEventListener('click', togglePlay);
rngSpeed.addEventListener('input', speedChange);

function togglePlay() {
  const playingTrue = display.classList.toggle('playing'); //// toggle() returns boolean
  if (playingTrue) {
    timer.play();
  } else {
    timer.pause();
  }
}

function speedChange(e) {
  const ms = valToInterval(e.currentTarget.value);
  timer.intervalSet(ms);
}

timer.settings({
  interval: valToInterval(rngSpeed.value),
  intervalArray: cardList,
  intervalCallback: flipIndex,
  // playBackwards: true,
  playRandom: true
});


const fwd = document.querySelector('button#fwd');
const bck = document.querySelector('button#bck');

fwd.addEventListener('click', e => {
  timer.settings({ playBackwards: false });
});
bck.addEventListener('click', e => {
  timer.settings({ playBackwards: true });
});

let prevIndex = null;

function flipIndex(index, item) {
  // log(index, item);
  if (prevIndex != null) cardList[prevIndex].classList.remove('show');
  cardList[index].classList.add('show');
  prevIndex = index;
}


//// Utils

function valToInterval(value) {
  return 2400 - (value * 20);
}