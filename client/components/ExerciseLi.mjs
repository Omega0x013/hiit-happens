export default class ExerciseLi extends HTMLLIElement {
  async connectedCallback() {
    this.append(document.querySelector('#exercise-li-template').content.cloneNode(true));

    const deleteButton = this.querySelector('input[name=delete]');
    deleteButton.addEventListener('click', () => this.remove());

    const res = await fetch(import.meta.resolve('./exercises.json'));
    this.exercises = await res.json();

    const form = this.querySelector('form');

    for (const [name, color] of Object.entries(this.exercises).reverse()) {
      const input = document.createElement('input');
      input.type = 'submit';
      input.value = name;
      input.setAttribute('style', `background-color: ${color}`);
      form.prepend(input);
    }

    const dialog = this.querySelector('dialog');
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'Cancel') {
        this.typeInput.value = dialog.returnValue;
        this.typeInput.setAttribute('style', `background-color: ${this.exercises[dialog.returnValue]}`);
      }
    });

    const choose = this.querySelector('input[name=choose]');
    choose.addEventListener('click', () => dialog.showModal());

    this.typeInput = this.querySelector('input[name=type]');
    this.typeInput.value = this.dataset.type;

    this.typeInput.setAttribute('style', `background-color: ${this.exercises[this.dataset.type]}`);

    this.durationInput = this.querySelector('input[name=duration]');
    this.durationInput.value = Math.floor(this.dataset.duration / 1000);
  }
}
