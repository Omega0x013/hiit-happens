/**
 * The tile representing the workout on the main page.
 * - Displays the title, duration and other stats about the workout.
 * - Contains a dialog containing the exercises in an editable format.
 * - Contains a timer-dialog, allowing the user to run the exercise.
 */
export default class WorkoutTile extends HTMLElement {
    constructor() {
        super();
    }

    static observedAttributes = ["data-id"];

    async attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "data-id":
                if (!this.shadowRoot) return;

                const {name: name, exercises: exercises} = JSON.parse(localStorage.getItem(newValue));

                this.shadowRoot.querySelector('h2').innerText = name;
                this.shadowRoot.querySelector('span').innerText = name;
                this.shadowRoot.querySelector('h3').innerText = exercises?.reduce((p, c) => p + c.duration + c.rest, 0);

                // Propogate any changes to our children
                for (const dialog of this.shadowRoot.querySelectorAll('dialog')) {
                    dialog.dataset.id = newValue;
                }

                break;
        }
    }

    async connectedCallback() {
        this.attachShadow({ mode: "open" });

        /* I was originally attaching the content of a template element stored in WorkoutTile.html
        to the shadow DOM. That was needless indirection since it still used innerHTML */
        const template = await fetch(import.meta.resolve('./WorkoutTile.html'));
        this.shadowRoot.innerHTML = await template.text();

        // Bind the buttons and dialogs together
        const [runButton, editButton, deleteButton] = this.shadowRoot.querySelectorAll('button');
        const [editDialog, timerDialog, deleteDialog] = this.shadowRoot.querySelectorAll('dialog');

        runButton.addEventListener('click', () => timerDialog.showModal());

        editButton.addEventListener('click', () => editDialog.showModal());
        editDialog.addEventListener('close', () => this.attributeChangedCallback("data-id", null, this.dataset.id))
        
        // TODO: #21 move delete button into edit dialog
        deleteButton.addEventListener('click', () => deleteDialog.showModal());
        deleteDialog.addEventListener('close', () => {
            if (deleteDialog.returnValue === "Confirm") {
                localStorage.removeItem(this.dataset.id);
                this.remove();
            }
        });

        // Trigger a content refresh, since we now have elements to slot the content into
        this.attributeChangedCallback("data-id", null, this.dataset.id);
    }
}

customElements.define("workout-tile", WorkoutTile);