
import * as timer from '../_common/modules/timer.js'
import * as mouse from '../_common/modules/mouse.js'
import * as lessonData from '../_lessons/class5_bookb_07.js';

const log = console.log;

const lessonid = 'class5_bookb_07';
const mediaPath = `../_lessons/${lessonid}/`;



const display = document.querySelector('#display');


const cardList = [];


function buildDeck(data) {
  const deck = document.createElement('div');
  deck.id = 'deck';

  data.vocab.forEach( item => {
    const card = buildCard(item);
    cardList.push(card);
    deck.appendChild(card);
  });

  // log(cardList);

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

buildDeck(lessonData.data);


function flipCard(e) {
  const card = e.currentTarget;
  card.classList.toggle('show');
}




//// Play


const btnPlay = document.querySelector('button#play');
btnPlay.addEventListener('click', () => {
  const playingTrue = display.classList.toggle('playing'); //// toggle() returns boolean
  if (playingTrue) {
    timer.play();
  } else {
    timer.pause();
  }
});

const rngSpeed = document.querySelector('#speed');
rngSpeed.addEventListener('input', (e) => {
  const val = e.currentTarget.value;
  timer.intervalSet( speedToInterval(val) );

  const gapMS = speedToGap(val);
  timer.gapSet( gapMS );
  document.documentElement.style.setProperty('--flipms', `${gapMS * 0.8}ms`);
});

const fwd = document.querySelector('button#fwd');
fwd.addEventListener('click', e => {
  timer.settings({ playBackwards: false });
});

const bck = document.querySelector('button#bck');
bck.addEventListener('click', e => {
  timer.settings({ playBackwards: true });
});

const rnd = document.querySelector('#playrandom');
rnd.addEventListener('change', e => {
  timer.settings({ playRandom: e.currentTarget.checked });
});


timer.settings({
  interval: speedToInterval(rngSpeed.value),
  intervalGap: 1000,
  maxIndex: cardList.length - 1,
  intervalStartCallback: showCard,
  intervalEndCallback: hideCard,
  // playBackwards: true,
  playRandom: true
});




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
}