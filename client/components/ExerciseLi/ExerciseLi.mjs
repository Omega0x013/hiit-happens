export default class ExerciseLi extends HTMLLIElement {
  async connectedCallback() {
    const template = await fetch(import.meta.resolve('./ExerciseLi.html'));
    this.innerHTML = await template.text();

    this.typeInput = this.querySelector('input[name=type]');
    this.typeInput.value = this.dataset.type;

    this.durationInput = this.querySelector('input[name=duration]');
    this.durationInput.value = Math.floor(this.dataset.duration / 1000);

    const deleteButton = this.querySelector('input[name=delete]');
    deleteButton.addEventListener('click', () => this.remove());

    const dialog = this.querySelector('dialog');
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'Cancel') {
        this.typeInput.value = dialog.returnValue;
      }
    });

    const res = await fetch(import.meta.resolve('../exercises.json'));
    const exercises = await res.json();

    const form = this.querySelector('form');

    for (const [name, color] of Object.entries(exercises)) {
      form.append(this.makeInput(name, color));
    }

    const choose = this.querySelector('input[name=choose]');
    choose.addEventListener('click', () => dialog.showModal());
  }

  makeInput(name, color) {
    const input = document.createElement('input');
    input.type = 'submit';
    input.value = name;
    input.setAttribute('style', `background-color: ${color}`);
    return input;
  }
}

customElements.define('exercise-li', ExerciseLi, { extends: 'li' });
