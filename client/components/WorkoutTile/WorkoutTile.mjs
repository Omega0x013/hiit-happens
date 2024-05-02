/**
 * The tile representing the workout on the main page.
 * - Displays the title, duration and other stats about the workout.
 * - Contains a dialog containing the exercises in an editable format.
 * - Contains a timer-dialog, allowing the user to run the exercise.
 */
export default class WorkoutTile extends HTMLElement {
  async connectedCallback() {
    this.attachShadow({ mode: 'open' });

    /* I was originally attaching the content of a template element stored in WorkoutTile.html
    to the shadow DOM. That was needless indirection since it still used innerHTML */
    const template = await fetch(import.meta.resolve('./WorkoutTile.html'));
    this.shadowRoot.innerHTML = await template.text();

    // Bind the buttons and dialogs together
    const [runButton, editButton, deleteButton] = this.shadowRoot.querySelectorAll('button');
    const [editDialog, timerDialog, deleteDialog] = this.shadowRoot.querySelectorAll('dialog');

    editDialog.dataset.id = this.dataset.id;
    timerDialog.dataset.id = this.dataset.id;

    this.shadowRoot.addEventListener('update', this.update.bind(this));

    runButton.addEventListener('click', () => timerDialog.showModal());

    editButton.addEventListener('click', () => editDialog.showModal());

    deleteButton.addEventListener('click', () => deleteDialog.showModal());
    deleteDialog.addEventListener('close', () => {
      if (deleteDialog.returnValue === 'Confirm') {
        localStorage.removeItem(this.dataset.id);
        this.remove();
      }
    });

    this.update();
  }

  update() {
    const { name, description, exercises } = JSON.parse(localStorage.getItem(this.dataset.id));

    // this.shadowRoot.querySelector('h2').innerText = name;
    // this.shadowRoot.querySelector('span').innerText = name;
    // const ms = exercises?.reduce((p, c) => p + c.duration, 0);
    // const [minutes, seconds] = [Math.floor(ms / 1000 / 60), Math.floor(ms / 1000 % 60)];
    // this.shadowRoot.querySelector('h3').innerText = `${minutes}m ${seconds}s`;

    this.shadowRoot.querySelector('h2').innerText = name;
    this.shadowRoot.querySelector('span').innerText = description;

    const ms = exercises?.reduce((p, c) => p + c.duration, 0);
    this.shadowRoot.querySelector('h3').textContent = `${Math.floor(ms / 1000 / 60)}m ${Math.floor(ms / 1000 % 60)}s`;

    // When this tile is updated, call the child event handlers without bubbling
    const event = new Event('update', { bubbles: false });
    for (const dialog of this.shadowRoot.querySelectorAll('dialog')) {
      dialog.dispatchEvent(event);
    }
  }
}

customElements.define('workout-tile', WorkoutTile);
