
const log = console.log;

const opts = {
  interval: 1000,
  intervalArray: [],
  triggerOnPlay: true,
  playBackwards: false,
  randomIndex: false //// false = linear, true = random
}

// Internal State
let playing = false;
let index = 0;
let raf; // reference for RAF, in case we need to cancel it
let zero = document.timeline.currentTime;
let elapsedInterval = 0;
// let elapsedDuration = 0;

// Callbacks
let onInterval = null;


//// Exports

export function settings({
  interval = null,
  intervalArray = [],
  intervalCallback = null,
  triggerOnPlay, //// dont wait for first interval to finish before calling first onInterval callback
  playBackwards,
  // intervalLoop = false,
  // callbacks = { interval: null, play: null, pause: null, end: null }
} = {}) {

  if (interval) opts.interval = interval;
  if (triggerOnPlay !== undefined) opts.triggerOnPlay = triggerOnPlay;
  if (playBackwards !== undefined) opts.playBackwards = playBackwards;
  if (intervalArray.length > 0) opts.intervalArray = intervalArray;

  log('interval', interval)

  if (intervalCallback) onInterval = intervalCallback;
}

export function play() {
  playing = true;
  if (opts.triggerOnPlay && onInterval) onInterval(index, opts.intervalArray[index]);
  zero = document.timeline.currentTime;
  animate(document.timeline.currentTime);
}

export function pause() {
  // log('PAUSE');
  playing = false;
  // elapsedDuration += document.timeline.currentTime - zero;
  // log(elapsedDuration);
}

/*export function reset() {
  if (onPause) onPause();
}*/

export function intervalSet(ms) {
  opts.interval = ms;
  log('interval set to', ms/1000);
}



//// Internals


function animate(timestamp) {

  // log(timestamp);

  if (!playing) return;

  elapsedInterval = timestamp - zero; //// timestamp is always total continuous MS that the window has been open

  if (elapsedInterval > opts.interval) {
    
    if (opts.playBackwards) {
      index = nextIndexDown(index, opts.intervalArray);
    } else {
      index = nextIndexUp(index, opts.intervalArray);
    }

    if (onInterval) onInterval(index, opts.intervalArray[index]);
    zero = document.timeline.currentTime;
  }

  raf = requestAnimationFrame(animate);
}


//// Utils

function nextIndexUp(index, array) {
  log(index, array);
  return (index < array.length - 1) ? index + 1 : 0;
}

function nextIndexDown(index, array) {
  return (index <= 0) ? array.length - 1 : index - 1;
}