/**
 * The tile representing the workout on the main page.
 * - Displays the title, duration and other stats about the workout.
 * - Contains a dialog containing the exercises in an editable format.
 * - Contains a timer-dialog, allowing the user to run the exercise.
 */
export default class WorkoutTile extends HTMLElement {
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		this.shadowRoot.append(document.querySelector("#workout-tile-template").content.cloneNode(true));

		for (const div of this.shadowRoot.querySelectorAll("div:not(dialog *)")) {
			const [button, dialog] = div.children;
			button.addEventListener("click", () => dialog.showModal());
			dialog.dataset.id = this.dataset.id;
		}

		this.shadowRoot.querySelector("#delete-dialog").addEventListener("close", (event) => {
			if (event.target.returnValue === "Confirm") {
				localStorage.removeItem(this.dataset.id);
				this.remove();
			}
		});

		this.shadowRoot.addEventListener("update", this.update.bind(this));
		this.shadowRoot.querySelector("#dropdown-button").addEventListener("click", this.toggleDropdown.bind(this));
		this.update();
	}

	update() {
		const workouts = JSON.parse(localStorage.getItem("workouts"));
		const workout = workouts.find(w => w.id === this.dataset.id);
		const { name, exercises } = workout;
		console.log(workouts)
		this.shadowRoot.querySelector("form p > span").textContent = name;

		const ms = exercises?.reduce((p, c) => p + c.duration, 0);
		const duration = `${Math.floor(ms / 1000 / 60)}m ${Math.floor((ms / 1000) % 60)}s`;
		this.shadowRoot.querySelector("h2").textContent = `${name} - ${duration}`;

		// When this tile is updated, call the child event handlers without bubbling
		const event = new Event("update", { bubbles: false });
		for (const dialog of this.shadowRoot.querySelectorAll("dialog")) {
			dialog.dispatchEvent(event);
		}
	}

	toggleDropdown() {
		this.shadowRoot.querySelector("#workout-tile-fieldset").classList.toggle("hidden");
		this.shadowRoot.querySelector("#workout-tile-fieldset").classList.toggle("visible");
		this.shadowRoot.querySelector("#dropdown-button").textContent = this.shadowRoot.querySelector("#workout-tile-fieldset").classList.contains("hidden") ? "Expand" : "Collapse";
	}
}
