export default class WorkoutDialog extends HTMLDialogElement {
    constructor() {
        super();
    }

    static observedAttributes = ["data-id"];

    async attributeChangedCallback(name, _oldValue, newValue) {
        
    }

    async connectedCallback() {
        const template = await fetch(import.meta.resolve('./WorkoutDialog.html'));
        this.innerHTML = await template.text();
    }
}

customElements.define("workout-dialog", WorkoutDialog, {"extends": "dialog"});