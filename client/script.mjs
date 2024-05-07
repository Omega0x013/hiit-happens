import DownloadDialog from './components/DownloadDialog.mjs';
import EditDialog from './components/EditDialog.mjs';
import ExerciseLi from './components/ExerciseLi.mjs';
import TimerDialog from './components/TimerDialog.mjs';
import UploadDialog from './components/UploadDialog.mjs';
import WorkoutTile from './components/WorkoutTile.mjs';

customElements.define('edit-dialog', EditDialog, { extends: 'dialog' });
customElements.define('exercise-li', ExerciseLi, { extends: 'li' });
customElements.define('timer-dialog', TimerDialog, { extends: 'dialog' });
customElements.define('workout-tile', WorkoutTile);
customElements.define('download-dialog', DownloadDialog, { extends: 'dialog' });
customElements.define('upload-dialog', UploadDialog, { extends: 'dialog' });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}

const main = document.querySelector('main');

for (const id of Object.keys(localStorage)) {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = id;
  main.append(workout);
}

for (const div of document.querySelectorAll('footer > div')) {
  const [button, dialog] = div.children;
  button.addEventListener('click', () => dialog.showModal());
}

const newWorkoutDialog = document.querySelector('#new-workout-dialog');
const newWorkoutButton = document.querySelector('#new-workout-button');

newWorkoutButton.addEventListener('click', () => {
  newWorkoutDialog.dataset.id = crypto.randomUUID();
  newWorkoutDialog.update();
  newWorkoutDialog.showModal();
});

newWorkoutDialog.addEventListener('update', () => {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = newWorkoutDialog.dataset.id;
  main.append(workout);
});
