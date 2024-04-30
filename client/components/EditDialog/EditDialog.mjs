export default class EditDialog extends HTMLDialogElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./EditDialog.html'));
    this.innerHTML = await template.text();

    this.addEventListener('close', this.closeDialogCallback.bind(this));
    this.addEventListener('update', this.update.bind(this));

    // TODO: #25 edit dialog drag reorder

    this.template = this.querySelector('template');

    this.nameInput = this.querySelector('input[name=name]');
    this.figure = this.querySelector('figure');
    this.ul = this.figure.querySelector('ul');

    this.add = this.querySelector('input[name=add]');
    this.add.addEventListener('click', () => this.ul.append(this.makeLi(null, 1000)));

    this.update();
  }

  makeLi(type, duration) {
    const li = this.template.content.cloneNode(true).querySelector('li');
    li.querySelector('input[name=type]').value = type;
    li.querySelector('input[name=duration]').value = Math.floor(duration / 1000);
    li.querySelector('input[type=button]').addEventListener('click', () => li.remove());
    return li;
  }

  update() {
    const { name, exercises } = this.workout ?? { name: '', exercises: [] };
    this.nameInput.value = name;

    // Delete the previous entries if they exist.
    for (const li of this.ul.querySelectorAll('li')) {
      li.remove();
    }

    // Add a new set of entries
    for (const { type, duration } of exercises) {
      this.ul.append(this.makeLi(type, duration));
    }
  }

  get workout() {
    return JSON.parse(localStorage.getItem(this.dataset.id));
  }

  set workout(workout) {
    localStorage.setItem(this.dataset.id, JSON.stringify(workout));
  }

  closeDialogCallback() {
    if (this.returnValue !== 'Save') return;

    const exercises = [];
    for (const li of this.ul.querySelectorAll('li')) {
      const [type, duration] = li.querySelectorAll('input');
      exercises.push({ type: type.value.trim(), duration: duration.value * 1000 });
    }

    this.workout = { name: this.nameInput.value, exercises };

    // This serves as a fallback
    if (!this.workout.name || !this.workout.exercises?.length) {
      console.error('EditDialog: Invalid form submitted');
    }

    /**
     * Dispatch an event to ourselves which bubbles up to the tile,
     * causing it to update its own content and that of our neighbors.
     */
    const event = new Event('update', { bubbles: true });
    this.dispatchEvent(event);
  }
}

customElements.define('edit-dialog', EditDialog, { extends: 'dialog' });
