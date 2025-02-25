
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
  if (playRandom !== undefined) opts.playRandom = playRandom;
  if (intervalArray.length > 0) opts.intervalArray = intervalArray;

  // log('interval', interval);
  log('settings', opts);

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
    
    if (opts.playRandom) {
      //// Play randomly

      // indicesToExcludeFromRandom.push(index);
      // log(indicesToExcludeFromRandom);
      // index = randomIndexExclude(0, opts.intervalArray.length - 1, indicesToExcludeFromRandom);
      index = randomIndexFromArray(opts.intervalArray);

    } else {
      //// Play sequentially

      if (opts.playBackwards) {

        //// Play sequentially backwards
        index = nextIndexDown(index, opts.intervalArray);

      } else {

        //// Play sequentially forwards
        index = nextIndexUp(index, opts.intervalArray);
      }
    }

    if (onInterval) onInterval(index, opts.intervalArray[index]);

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


function randomIndexExclude_old1(min, max, exclude) {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  // return (num === exclude) ? (num < max/2) ? num + 1 : num - 1 : num;
  return (exclude.indexOf(num) === -1) ? (num < max/2) ? num + 1 : num - 1 : num;
}

function randomIndexExclude(min, max, exclude) {
  let chosen
  if (exclude.length > max - 3) {
    console.error('too few options!');
    return;
  }
  while (!chosen) {
    const candidate = Math.floor( Math.random() * (max - min + 1) ) + min;
    if (exclude.indexOf(candidate) === -1) chosen = candidate;
  }
  return chosen;
}



let previousIndexes = [];
function randomIndexFromArray(array, excludeHowMany = 2) {

  // if (excludeHowMany > array.length - 2) {
  if (array.length < 3) {
    console.error('too many excluded:', excludeHowMany, ' from array of length:', array.length);
    return;
  }

  const min = 0;
  const max = array.length - 1;

  log(array);

  let chosen = null;
  while (chosen === null) {
    // const candidate = Math.floor( Math.random() * (max - min + 1) ) + min;
    // const candidate = Math.floor(Math.random() * array.length);
    const candidate = Math.floor(Math.random() * array.length | 0);
    log(candidate, previousIndexes.indexOf(candidate));
    // const candidate = ~~(Math.random() * array.length);
    // const candidate = Math.floor( Math.random() * (max - min) ) + min;
    if (previousIndexes.indexOf(candidate) === -1) chosen = candidate;
    // if (previousIndexes.indexOf(candidate) < 0) chosen = candidate;
  }
  previousIndexes.push(chosen);
  if (previousIndexes.length > excludeHowMany) {
    // previousIndexes.pop();
    previousIndexes.shift();
  }
  log(previousIndexes)
  return chosen;

}

function randomArrayIndex(array) {
  return Math.floor(Math.random() * array.length | 0);
}
