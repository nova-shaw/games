
const log = console.log;

const opts = {
  interval: 1000,
  intervalArray: [],
  triggerOnPlay: true,
  playBackwards: false,
  playRandom: false //// false = linear, true = random
}

// Internal State
let playing = false;
let index = 0;
let indicesToExcludeFromRandom = []; // keep records of last 2 random choices so as to not repeat them
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
  playRandom,
  // intervalLoop = false,
  // callbacks = { interval: null, play: null, pause: null, end: null }
} = {}) {

  if (interval) opts.interval = interval;
  if (triggerOnPlay !== undefined) opts.triggerOnPlay = triggerOnPlay;
  if (playBackwards !== undefined) opts.playBackwards = playBackwards;
  if (intervalArray.length > 0) opts.intervalArray = intervalArray;
  if (playRandom !== undefined) opts.playRandom = playRandom;
  if (playRandom === true) {
    index = randomArrayIndex(intervalArray);
    previousIndexes.push(index);
  }

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

  if (!playing) return;

  elapsedInterval = timestamp - zero; //// timestamp is always total continuous MS that the window has been open

  if (elapsedInterval > opts.interval) {

    //// When interval has elapsed:
    
    if (opts.playRandom) {

      //// Play randomly
      index = randomArrayIndexNoRepeats(opts.intervalArray);

    } else {

      //// Play sequentially...

      if (opts.playBackwards) {

        //// Play sequentially backwards
        index = nextIndexDown(index, opts.intervalArray);

      } else {

        //// Play sequentially forwards
        index = nextIndexUp(index, opts.intervalArray);
      }
    }

    //// Trigger callback if set

    if (onInterval) {
      onInterval(index, opts.intervalArray[index]);
    }

    zero = document.timeline.currentTime;
  }

  raf = requestAnimationFrame(animate);
}


//// Utils

function nextIndexUp(index, array) {
  // log(index, array);
  return (index < array.length - 1) ? index + 1 : 0;
}

function nextIndexDown(index, array) {
  return (index <= 0) ? array.length - 1 : index - 1;
}


/*
  Ok, there are 2 ways to randomise the card chosen to flip:
  1. Just pick a random index each time (while keeping a list of what's already been chosen and excluding them)
  2. Shuffle the list of indexes first, then step through them sequentially
*/

let previousIndexes = [];

function randomArrayIndexNoRepeats(array, excludeHowMany = 2) {

  if (array.length < 3) {
    console.error('not enough options for random playback: ', array.length);
    return;
  }

  let chosen = null;
  while (chosen === null) {
    const candidate = randomArrayIndex(array);
    if (previousIndexes.indexOf(candidate) === -1) chosen = candidate;
  }

  previousIndexes.push(chosen);
  if (previousIndexes.length > excludeHowMany) {
    previousIndexes.shift();
  }
  log(previousIndexes)
  return chosen;

}

function randomArrayIndex(array) { //// this is used by both randomArrayIndexNoRepeats() and in settings()
  return Math.floor(Math.random() * array.length | 0);
}
