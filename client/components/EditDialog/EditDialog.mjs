export default class EditDialog extends HTMLDialogElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./EditDialog.html'));
    this.innerHTML = await template.text();

    this.addEventListener('close', this.closeDialogCallback.bind(this));
    this.addEventListener('update', this.update.bind(this));

    // TODO: #25 edit dialog drag reorder

    this.nameInput = this.querySelector('input[name=name]');
    this.descriptionInput = this.querySelector('input[name=description]');
    this.ul = this.querySelector('ul');

    this.add = this.querySelector('input[name=add]');
    this.add.addEventListener('click', () => this.ul.append(this.makeLi()));

    this.update();
  }

  makeLi(type, duration) {
    const li = document.createElement('li', { is: 'exercise-li' });
    li.dataset.type = type ?? '';
    li.dataset.duration = duration;
    return li;
  }

  update() {
    const workout = JSON.parse(localStorage.getItem(this.dataset.id));
    const { name, description, exercises } = workout ?? { name: '', description: '', exercises: [] };
    this.nameInput.value = name;
    this.descriptionInput.value = description;

    // Delete the previous entries if they exist.
    for (const li of this.ul.querySelectorAll('li')) {
      li.remove();
    }

    // Add a new set of entries
    for (const { type, duration } of exercises) {
      this.ul.append(this.makeLi(type, duration));
    }
  }

  closeDialogCallback() {
    if (this.returnValue !== 'Save') return;

    const exercises = [];
    for (const li of this.ul.querySelectorAll('li')) {
      exercises.push({ type: li.typeInput.value.trim(), duration: li.durationInput.value * 1000 });
    }

    const workout = { name: this.nameInput.value, description: this.descriptionInput.value, exercises };
    localStorage.setItem(this.dataset.id, JSON.stringify(workout));

    /**
     * Dispatch an event to ourselves which bubbles up to the tile,
     * causing it to update its own content and that of our neighbors.
     */
    const event = new Event('update', { bubbles: true });
    this.dispatchEvent(event);
  }
}

customElements.define('edit-dialog', EditDialog, { extends: 'dialog' });
