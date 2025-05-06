
export class Timer {
  #startat;
  #elapsed;
  #intervalIndex;

  constructor(intervals, startCallback = null, pauseCallback = null, cancelCallback = null) {
    this.intervals      = intervals;
    this.startCallback  = startCallback;
    this.pauseCallback  = pauseCallback;
    this.cancelCallback = cancelCallback;
    this.running        = false;

    this.#startat = 0;
    this.#elapsed = 0;
    this.#intervalIndex = 0;
  }

  start() {
    this.running = true;
    this.#startat = performance.now();
    
    if (this.startCallback) this.startCallback(0);

    this.#loop(this.#startat);
    return this.running;
  }

  pause() {
    this.running = false;
    if (this.pauseCallback) this.pauseCallback(this.#elapsed);
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

  cancel() {
    this.running = false;
    if (this.cancelCallback) this.cancelCallback();
    return this.running;
  }

  updateInterval(index, value) {
    this.intervals[index].ms = value;
  }

  #loop = (timestamp) => {
    if (!this.running) return;

    this.#elapsed = timestamp - this.#startat;

    if (this.#elapsed >= this.intervals[this.#intervalIndex].ms) {
      this.intervals[this.#intervalIndex].fn(this.#elapsed);
      this.#intervalIndex = (this.#intervalIndex == this.intervals.length - 1) ? 0 : this.#intervalIndex + 1;
      this.#startat = timestamp;
    }

    requestAnimationFrame(this.#loop);
  }
}