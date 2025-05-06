
export class Timer {
  
  #startMS;
  #intervalIndex;

  constructor(triggerOnStart, intervals) {
    // this.loopOn = loopOn;
    this.intervals = intervals;
    this.triggerOnStart = triggerOnStart;
    this.running = false;

    this.#startMS = 0;
    this.#intervalIndex = 0;
  }

  start() {
    this.running = true;
    this.#startMS = performance.now();
    
    if (this.triggerOnStart) { // Trigger the callback as soon as started
      this.intervals[this.#intervalIndex].fn(0);
    }

    this.#loop(this.#startMS);
    // console.log(this.running);
    return this.running;
  }

  pause() {
    this.running = false;
    // console.log(this.running);
    return this.running;
  }

  toggle() {
    if (this.running) {
      this.pause();
    } else { 
      this.start();
    }
    return this.running;
  }

  #loop = (timestamp) => {
    if (!this.running) return;

    const elapsed = timestamp - this.#startMS;

    if (elapsed >= this.intervals[this.#intervalIndex].ms) {
      this.intervals[this.#intervalIndex].fn(elapsed);
      this.#intervalIndex = (this.#intervalIndex == this.intervals.length - 1) ? 0 : this.#intervalIndex + 1;
      this.#startMS = timestamp;
    }

    requestAnimationFrame(this.#loop);
  }

}