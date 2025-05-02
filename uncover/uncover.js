
// import * as timer from '../_common/modules/timer-class.js';
import { Timer } from '../_common/modules/timer-class.js';

const log = console.log;


const btnPlay = document.querySelector('#playtoggle');
const btnReset = document.querySelector('#reset');
const btnReveal = document.querySelector('#reveal');





let cardArray = document.querySelectorAll('.card.show');


let indexHistory = [];
let card = null;
let playing = false;

const t1 = new Timer(btnPlay,  true,  false, [{ms: 300,  fn: doThis}]);
const t2 = new Timer(btnReset, false, true,  [{ms: 1000, fn: doThat}]);

log(t1);
log(t2);

function doThis(ts) {
  log('doThis', ts);
}
function doThat(ts) {
  log('doThat', ts);
}
// btnReset.addEventListener('click', e => { log(t2.report()) });
btnPlay.addEventListener('click', e => {
  // t1.start();
  const running = t1.toggle();
  btnPlay.classList.toggle('running', running);
});
btnReset.addEventListener('click', e => {
  // t1.start();
  const running = t2.toggle();
  btnReset.classList.toggle('running', running);
});