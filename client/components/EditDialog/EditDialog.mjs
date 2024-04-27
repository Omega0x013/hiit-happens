export default class EditDialog extends HTMLDialogElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./EditDialog.html'));
    this.innerHTML = await template.text();

    this.addEventListener('close', this.closeDialogCallback.bind(this));
    this.addEventListener('update', this.update.bind(this));

    // TODO: #25 edit dialog drag reorder

    this.nameInput = this.querySelector('input[name=name]');
    this.figure = this.querySelector('figure');
    this.ul = this.figure.querySelector('ul');

    this.exerciseDialog = this.querySelector('dialog');
    this.querySelector('input[name=add]').addEventListener('click', () => this.exerciseDialog.showModal());

    this.update();
  }

  update() {
    const { name, exercises } = this.workout;
    this.nameInput.value = name;

    this.ul.innerHTML = '';
    for (const { type, duration } of exercises) {
      const li = document.createElement('li');
      li.textContent = `${type}: ${duration}`;
      this.ul.append(li);
    }
  }

  get workout() {
    return JSON.parse(localStorage.getItem(this.dataset.id));
  }

  set workout(workout) {
    localStorage.setItem(this.dataset.id, JSON.stringify(workout));
  }

  closeDialogCallback() {
    // TODO: #20 update localStorage based on the contents of the edit dialog
    if (this.returnValue !== 'Save') return;

    const exercises = [];
    for (const li of this.ul.querySelectorAll('li')) {
      const [type, duration] = li.textContent.split(':', 2);
      exercises.push({ type: type.trim(), duration: +duration.trim() });
    }

    this.workout = { name: this.nameInput.value, exercises };

    /**
     * Dispatch an event to ourselves which bubbles up to the tile,
     * causing it to update its own content and that of our neighbors.
     */
    const event = new Event('update', { bubbles: true });
    this.dispatchEvent(event);
  }
}

customElements.define('edit-dialog', EditDialog, { extends: 'dialog' });
