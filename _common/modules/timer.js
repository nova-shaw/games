
const log = console.log;

const opts = {
  interval: 1000,
  intervalArray: [],
  triggerOnPlay: true, //// dont wait for first interval to finish before calling first onInterval callback
  playBackwards: false,
  playRandom: false
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

export function settings({ interval, intervalArray, triggerOnPlay, playBackwards, playRandom, intervalCallback } = {}) {

  if (interval)      opts.interval = interval;
  if (intervalArray) opts.intervalArray = intervalArray;
  if (triggerOnPlay) opts.triggerOnPlay = triggerOnPlay;
  if (playBackwards) opts.playBackwards = playBackwards;
  if (playRandom)    opts.playRandom = playRandom;
  if (intervalCallback) onInterval = intervalCallback;

  if (playRandom === true) {
    index = randomArrayIndex(intervalArray);
    previousIndexes.push(index);
  }

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

  //// Exit: random impossible for less than 3 items
  //// TODO: better fallback would be just sequential ordering
  if (array.length < 3) {
    console.error('not enough options for random playback: ', array.length);
    return;
  }

  //// Choose random index, excluding previousIndexes
  let chosen = null;
  while (chosen === null) {
    const candidate = randomArrayIndex(array);
    if (previousIndexes.indexOf(candidate) === -1) chosen = candidate;
  }

  //// Remember chosen index, trim previousIndexes array from front if needed
  previousIndexes.push(chosen);
  if (previousIndexes.length > excludeHowMany) {
    previousIndexes.shift();
  }
  
  return chosen;
}


function randomArrayIndex(array) { //// this is used by both randomArrayIndexNoRepeats() and in settings()
  return Math.floor(Math.random() * array.length | 0);
}
