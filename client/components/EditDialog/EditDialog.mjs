export default class EditDialog extends HTMLDialogElement {
    constructor() {
        super();
    }


    static observedAttributes = ["data-id"];

    async attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "data-id":
                // Short-circuit if we don't have any elements to write the content to yet
                if (!this.h1) return;

                const workout = JSON.parse(localStorage.getItem(newValue));

                this.h1.innerText = workout?.name;
                this.ul.innerHTML = "";

                for (const exercise of workout?.exercises ?? []) {
                    // TODO: #19 construct a draggable list
                }
                break;
        }
    }

    async connectedCallback() {
        const template = await fetch(import.meta.resolve('./EditDialog.html'));
        this.innerHTML = await template.text();

        // Force the content of the element to update once the element is attached to the page
        this.attributeChangedCallback("data-id", null, this.dataset.id);
    }

    closeDialogCallback(_event) {
        // TODO: #20 update localStorage based on the contents of the edit dialog
    }
}

customElements.define("edit-dialog", EditDialog, { "extends": "dialog" });