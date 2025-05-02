/**
 * Timing, frequency, ticker, animation, etc
 * `performance.now()` instead of `date.now()` - 'a stable monotonic clock' - [High precision timing - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing)
 * `performance.timeOrigin` also
 * */


/*

FROM USAGE FILE:

import * as timer from './timer.js';

const log = console.log;

const btnToggle = document.querySelector('#toggle');

const btnTimer = timer.init(
  btnToggle,
  'toggle',
  [{ fn: doThis, ms: 1000 }]
)

// btnToggle.addEventListener('click', btnTimer.toggle );
// btnToggle.addEventListener('click', timer.toggle );

function doThis() {
  log('doThis');
}


*/





/* MIGHT WANT TO REWRITE THIS AS A CLASS... */

const log = console.log;

let timers = [];

let running = false;
let started = 0;


export function init(element, type, intervalArray) {
  element.addEventListener('click', e => {
    toggle();
    element.classList.toggle('running', running);
  });
}

export function start() {
  running = true;
  loop(performance.now());
}

export function pause() {
  running = false;
}

export function stop() {

}

export function toggle(e) {
  if (running) {
    pause();
  } else {
    start();
  }
}


///////////////////////////////////////////////////////////////

// const intervals = [10, 1000, 200, 2000];
const intervals = [
  { ms: 10,   fn: (e) => { log('end 10') } },
  { ms: 1000, fn: (e) => { log('end 1000') } },
  { ms: 200,  fn: (e) => { log('end 200') } },
  { ms: 2000, fn: (e) => { log('end 2000') } }
];
let intervalIndex = 0;


function loop(timestamp) {
  if (!running) return;

  const elapsed = timestamp - started;

  if (elapsed >= intervals[intervalIndex].ms) {
    intervals[intervalIndex].fn();
    intervalIndex = (intervalIndex == intervals.length - 1) ? 0 : intervalIndex + 1;
    started = timestamp;
  }

  requestAnimationFrame(loop);
}

