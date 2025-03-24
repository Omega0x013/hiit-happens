export default class TimerDialog extends HTMLDialogElement {
  constructor() {
    super();
    this.previous = 0;
    this.exercises = [];

    this.closeDialogCallback();
  }

  async connectedCallback() {
    this.append(document.querySelector('#timer-dialog-template').content.cloneNode(true));

    this.boundAnimationFrame = this.animationFrame.bind(this);

    this.addEventListener('close', this.closeDialogCallback);
    this.addEventListener('update', this.update.bind(this));

    this.progress = this.querySelector('progress');
    this.activity = this.querySelector('input[name=activity]');

    this.button = this.querySelector('input[type=button]');
    this.button.addEventListener('click', () => (this.paused = !this.paused));

    const res = await fetch(import.meta.resolve('./exercises.json'));
    this.colors = await res.json();

    this.update();
  }

  update() {
    const { name, exercises } = JSON.parse(localStorage.getItem(this.dataset.id));
    this.querySelector('span').textContent = `${name}`;
    this.exercises = exercises;
    requestAnimationFrame(this.boundAnimationFrame);
  }

  animationFrame(now) {
    const { type, duration } = this.exercises[this.index];

    // Move the timer on if we're not paused, and set the background correctly
    if (!this.paused) {
      this.elapsed += now - this.previous;
      document.documentElement.setAttribute('style', `--workout-color: ${this.colors[type]}`);
    }
    this.previous = now;

    // Current segment has expired
    if (this.elapsed >= duration) {
      this.index++;
      this.elapsed -= duration;
      // Exercise is over, reset to zero
      if (this.index >= this.exercises.length) {
        // closeDialogCallback already does everything we want to do here
        this.closeDialogCallback();
      }
    }

    const ms = duration - this.elapsed;
    const minsands = `${Math.floor(ms / 1000 / 60)}m ${Math.floor(ms / 1000 % 60)}s`;

    this.progress.setAttribute('style', `--progress-text: '${minsands}';`);
    this.progress.value = (duration - this.elapsed) / duration;
    this.activity.value = type;

    requestAnimationFrame(this.boundAnimationFrame);
  }

  closeDialogCallback() {
    this.paused = true;
    this.index = 0;
    this.elapsed = 0;

    document.documentElement.setAttribute('style', '--workout-color: black');
  }
}
