import ExerciseLi from "./components/ExerciseLi.mjs";
import TimerDialog from "./components/TimerDialog.mjs";
import WorkoutTile from "./components/WorkoutTile.mjs";

customElements.define("exercise-li", ExerciseLi, { extends: "li" });
customElements.define("timer-dialog", TimerDialog, { extends: "dialog" });
customElements.define("workout-tile", WorkoutTile);

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/serviceworker.js");
}

const header = document.querySelector('header')
const main = document.querySelector('main');

header.querySelector('input[type=file]').addEventListener('change', async event => {
	for (const file of event.target.files) {
		try {
			main.append(await WorkoutTile.fromFile(file));
		} catch (error) {
			alert(`Failed to import file: ${file.name}`);
		}
	}
});

for (const id of Object.keys(localStorage)) {
	main.append(WorkoutTile.fromID(id));
}

document.querySelector("#new-workout-button").addEventListener("click", () => main.append(WorkoutTile.fromID(undefined)));
