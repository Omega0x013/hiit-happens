export default class ExerciseLi extends HTMLLIElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./ExerciseLi.html'));
    this.innerHTML = await template.text();

    this.typeInput = this.querySelector('input[name=type]');
    this.typeInput.value = this.dataset.type ?? '';

    this.durationInput = this.querySelector('input[name=duration]');
    this.durationInput.value = Math.floor(this.dataset.duration / 1000);

    this.deleteButton = this.querySelector('input[name=delete]');
    this.deleteButton.addEventListener('click', () => this.remove());

    // this.dialog = this.querySelector('dialog');
    // this.typeInput.addEventListener('click', () => this.dialog.showModal());
    // this.dialog.addEventListener('close', () => {
    //   if (this.dialog.returnValue !== 'Cancel') {
    //     this.typeInput.value = this.dialog.returnValue;
    //   }
    // });
  }
}

customElements.define('exercise-li', ExerciseLi, { extends: 'li' });
