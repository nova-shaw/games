
export class Timer {
  
  // running;
  #startMS;
  #intervalIndex;

  constructor(element, loopOn, callbackOnStart, intervals) {
    this.element = element;
    this.loopOn = loopOn;
    this.intervals = intervals;
    this.callbackOnStart = callbackOnStart;
    this.running = false;

    this.#startMS = 0;
    this.#intervalIndex = 0;
  }

  start() {
    // console.log(this.running);
    this.running = true;
    this.#startMS = performance.now();
    
    if (this.callbackOnStart) {
      this.intervals[this.#intervalIndex].fn(this.#startMS);
    }

    this.#loop(this.#startMS);
    return this.running;
  }

  pause() {
    this.running = false;
    // this.element.classList.remove('running');
    return this.running;
  }

  toggle() {
    if (this.running) {
      this.pause();
    } else { 
      this.start();
    }
  }

  // function loop(timestamp) {
  #loop = (timestamp) => {
  // static loop(timestamp) {
  // get loop(timestamp) {
    if (!this.running) return;

    const elapsed = timestamp - this.#startMS;
    // console.log(elapsed);

    if (elapsed >= this.intervals[this.#intervalIndex].ms) {
      this.intervals[this.#intervalIndex].fn(timestamp);
      this.#intervalIndex = (this.#intervalIndex == this.intervals.length - 1) ? 0 : this.#intervalIndex + 1;
      this.#startMS = timestamp;
    }

    requestAnimationFrame(this.#loop);
  }



}