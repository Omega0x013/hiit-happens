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

    async connectedCallback() {
        this.attachShadow({mode: "open"});

        /* I was originally attaching the content of a template element stored in WorkoutTile.html
        to the shadow DOM. That was needless indirection since it still used innerHTML */
        const template = await fetch(import.meta.resolve('./WorkoutTile.html'));
        this.shadowRoot.innerHTML = await template.text();

        const [runButton, editButton, deleteButton] = this.shadowRoot.querySelectorAll('button');
        const [workoutDialog, timerDialog, deleteDialog] = this.shadowRoot.querySelectorAll('dialog');

        // Bind the buttons and dialogs together
        runButton.addEventListener('click', () => workoutDialog.showModal());
        editButton.addEventListener('click', () => timerDialog.showModal());
        deleteButton.addEventListener('click', () => deleteDialog.showModal());
        deleteDialog.addEventListener('close', () => {
            if (deleteDialog.returnValue === "Confirm")
                localStorage.removeItem(this.dataset.id);
        });

        // Copy over the workout id to the child custom elements, causing them to update their content
        for (const dialog of [workoutDialog, timerDialog]) {
            dialog.dataset.id = this.dataset.id;
        }
    }
}

customElements.define("workout-tile", WorkoutTile);