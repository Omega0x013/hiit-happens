import DownloadDialog from "./components/DownloadDialog.mjs";
import EditDialog from "./components/EditDialog.mjs";
import ExerciseLi from "./components/ExerciseLi.mjs";
import TimerDialog from "./components/TimerDialog.mjs";
import UploadDialog from "./components/UploadDialog.mjs";
import WorkoutTile from "./components/WorkoutTile.mjs";

customElements.define("edit-dialog", EditDialog, { extends: "dialog" });
customElements.define("exercise-li", ExerciseLi, { extends: "li" });
customElements.define("timer-dialog", TimerDialog, { extends: "dialog" });
customElements.define("workout-tile", WorkoutTile);
customElements.define("download-dialog", DownloadDialog, { extends: "dialog" });
customElements.define("upload-dialog", UploadDialog, { extends: "dialog" });

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/serviceworker.js");
}

const main = document.querySelector("main");

const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
if (workouts.length === 0) {
	localStorage.setItem("workouts", JSON.stringify([]));
}


// const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
console.log(workouts);
for (const workoutData of workouts) {
	const workout = document.createElement("workout-tile");
	workout.dataset.id = workoutData.id;
	main.append(workout);
}

for (const div of document.querySelectorAll("header div")) {
	const [button, dialog] = div.children;
	button.addEventListener("click", () => dialog.showModal());
}

function makeWorkout(event) {
	const workout = document.createElement("workout-tile");
	workout.dataset.id = event.target.dataset.id;
	main.append(workout);
}

document.querySelector("#new-workout-dialog").addEventListener("update", makeWorkout);
document.querySelector("#upload-dialog").addEventListener("update", makeWorkout);
