/**
 * The tile representing the workout on the main page.
 * - Displays the title, duration and other stats about the workout.
 * - Contains a dialog containing the exercises in an editable format.
 * - Contains a timer-dialog, allowing the user to run the exercise.
 */
export default class WorkoutTile extends HTMLElement {
	async connectedCallback() {
		if (this.dataset.id == "undefined") {
			this.dataset.id = crypto.randomUUID();
			localStorage.setItem(this.dataset.id, JSON.stringify({ name: "New Workout", exercises: [] }));
		}

		this.append(document.querySelector("#workout-tile-template").content.cloneNode(true));

		this.addEventListener("change", this.change.bind(this));
		this.addEventListener("update", this.update.bind(this));

		[this.heading, this.duration] = this.querySelectorAll("h2 span");
		this.collapseButton = this.querySelector("button");
		this.list = this.querySelector("ul");
		this.dialogs = this.querySelectorAll("dialog");
		this.section = this.querySelector("section");

		const [renameButton, deleteButton] = this.querySelectorAll("menu button");
		const [deleteDialog] = this.dialogs;
		const addButton = this.querySelector("ul + button");

		this.collapseButton.addEventListener("click", this.toggleDropdown.bind(this));

		renameButton.addEventListener("click", () => {
			this.heading.toggleAttribute("contenteditable");
			this.change();
		});

		deleteButton.addEventListener("click", () => deleteDialog.showModal());
		deleteDialog.addEventListener("close", (event) => {
			if (event.target.returnValue === "Confirm") {
				localStorage.removeItem(this.dataset.id);
				this.remove();
			}
		});

		addButton.addEventListener("click", () => this.list.append(document.createElement("li", { is: "exercise-li" })));

		// Setup for timer
		this.dialogs.forEach((el) => (el.dataset.id = this.dataset.id));
		this.boundAnimationFrame = this.animationFrame.bind(this);

		this.progress = this.querySelector("progress");
		this.activity = this.querySelector("input[name=activity]");

		this.button = this.querySelector("#timerButton");
		this.button.addEventListener("click", this.toggleTimer.bind(this));

		const res = await fetch(import.meta.resolve("./exercises.json"));
		this.colors = await res.json();

		this.paused = true;
		this.elapsed = 0;
		this.index = 0;

		// the content should be initialised here rather than through this function
		this.update();
	}

	// synchronise every time anything changes.
	change() {
		const exercises = [];
		for (const li of this.list.querySelectorAll("li")) {
			const typeInput = li.querySelector("input[type=text]");
			const durationInput = li.querySelector("input[type=number]");
			exercises.push({ type: typeInput.value.trim(), duration: durationInput.value * 1000 });
		}

		const workout = { name: this.heading.textContent, exercises };
		localStorage.setItem(this.dataset.id, JSON.stringify(workout));

		// TODO: remove this.update from WorkoutTile.change
		this.update();
	}

	update() {
		const { name, exercises } = JSON.parse(localStorage.getItem(this.dataset.id));

		this.exercises = exercises;

		this.heading.textContent = name;
		const ms = exercises?.reduce((p, c) => p + c.duration, 0);
		this.duration.textContent = `${Math.floor(ms / 1000 / 60)}m ${Math.floor((ms / 1000) % 60)}s`;

		this.list.innerHTML = "";
		for (const { type, duration } of exercises) {
			const li = document.createElement("li", { is: "exercise-li" });
			li.dataset.type = type;
			li.dataset.duration = duration;
			this.list.append(li);
		}

		// When this tile is updated, call the child event handlers without bubbling
		const event = new Event("update", { bubbles: false });
		for (const dialog of this.dialogs) {
			dialog.dispatchEvent(event);
		}
	}

	toggleDropdown() {
		this.section.classList.toggle("hidden");
		this.collapseButton.textContent = this.section.classList.contains("hidden") ? "Expand" : "Collapse";
	}

	toggleTimer() {
		this.paused = !this.paused; // Toggle the paused state
		if (!this.paused) {
			this.previous = performance.now(); // Set the initial timestamp
			requestAnimationFrame(this.boundAnimationFrame); // Start the animation loop
		}
	}

	animationFrame(now) {
		const { type, duration } = this.exercises[this.index];

		// Move the timer on if we're not paused, and set the background correctly
		if (!this.paused) {
			this.elapsed += now - this.previous;
			document.documentElement.setAttribute("style", `--workout-color: ${this.colors[type]}`);
		}
		this.previous = now;

		// Current segment has expired
		if (this.elapsed >= duration) {
			this.index++;
			this.elapsed -= duration;
			// Exercise is over, reset to zero
			if (this.index >= this.exercises.length) {
				// closeDialogCallback already does everything we want to do here
				this.paused = true;
				this.index = 0;
				this.elapsed = 0;

				document.documentElement.setAttribute("style", "--workout-color: black");
			}
		}

		const ms = duration - this.elapsed;
		const minsands = `${Math.floor(ms / 1000 / 60)}m ${Math.floor((ms / 1000) % 60)}s`;

		this.progress.setAttribute("style", `--progress-text: '${minsands}';`);
		this.progress.value = (duration - this.elapsed) / duration;
		this.activity.value = type;

		requestAnimationFrame(this.boundAnimationFrame);
	}
}
