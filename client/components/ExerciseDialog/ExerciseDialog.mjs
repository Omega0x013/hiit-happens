export default class ExerciseDialog extends HTMLDialogElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./ExerciseDialog.html'));
    this.innerHTML = await template.text();
  }
}

customElements.define('exercise-dialog', ExerciseDialog, { extends: 'dialog' });
