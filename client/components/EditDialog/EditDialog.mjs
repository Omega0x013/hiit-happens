export default class EditDialog extends HTMLDialogElement {
    constructor() {
        super();
    }

    update(_event) {
        const {name, exercises} = this.workout;
        this.nameInput.value = name;
    }

    get workout() {
        return JSON.parse(localStorage.getItem(this.dataset.id));
    }

    set workout(workout) {
        localStorage.setItem(this.dataset.id, JSON.stringify(workout));
    }

    async connectedCallback() {
        const template = await fetch(import.meta.resolve('./EditDialog.html'));
        this.innerHTML = await template.text();

        this.addEventListener('close', this.closeDialogCallback.bind(this));
        this.addEventListener('update', this.update.bind(this));

        this.nameInput = this.querySelector('input[name=name]');

        this.update();
    }

    closeDialogCallback(_event) {
        // TODO: #20 update localStorage based on the contents of the edit dialog
        if (this.returnValue !== "Save") return;

        const name = this.nameInput.value;

        this.workout = {name: name, exercises: this.workout.exercises};

        /**
         * Dispatch an event to ourselves which bubbles up to the tile,
         * causing it to update its own content and that of our neighbors.
         */
        const event = new Event("update", {bubbles: true});
        this.dispatchEvent(event);
    }
}

customElements.define("edit-dialog", EditDialog, { "extends": "dialog" });