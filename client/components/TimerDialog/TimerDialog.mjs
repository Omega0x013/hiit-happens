export default class TimerDialog extends HTMLDialogElement {
  constructor() {
    super();
    this.elapsed = 0;
    this.index = 0;
    this.previous = 0;
    this.paused = true;
    this.exercises = [];
  }

  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./TimerDialog.html'));
    this.innerHTML = await template.text();

    this.boundAnimationFrame = this.animationFrame.bind(this);
    requestAnimationFrame(this.boundAnimationFrame);

    this.addEventListener('close', () => (this.paused = true));
    this.addEventListener('update', this.update.bind(this));

    this.meter = this.querySelector('meter');
    this.p = this.querySelector('p');

    this.button = this.querySelector('input[type=button]');
    this.button.addEventListener('click', () => (this.paused = !this.paused));

    this.update();
  }

  update() {
    const { name, exercises } = JSON.parse(localStorage.getItem(this.dataset.id));
    this.querySelector('h1').textContent = name;
    this.exercises = exercises;
  }

  animationFrame(now) {
    // Only progress the timer if we're not paused
    if (!this.paused) { this.elapsed += now - this.previous; }
    this.previous = now;

    const { type, duration } = this.exercises[this.index];

    // Current segment has expired
    if (this.elapsed >= duration) {
      this.index++;
      this.elapsed -= duration;
      // Exercise is over, reset to zero
      if (this.index >= this.exercises.length) {
        this.paused = true;
        this.index = 0;
        this.elapsed = 0;
      }
    }

    this.meter.value = (duration - this.elapsed) / duration;
    this.p.textContent = type;

    requestAnimationFrame(this.boundAnimationFrame);
  }
}

customElements.define('timer-dialog', TimerDialog, { extends: 'dialog' });
