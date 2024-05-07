import DownloadDialog from './components/DownloadDialog.mjs';
import EditDialog from './components/EditDialog.mjs';
import ExerciseLi from './components/ExerciseLi.mjs';
import TimerDialog from './components/TimerDialog.mjs';
import WorkoutTile from './components/WorkoutTile.mjs';

customElements.define('edit-dialog', EditDialog, { extends: 'dialog' });
customElements.define('exercise-li', ExerciseLi, { extends: 'li' });
customElements.define('timer-dialog', TimerDialog, { extends: 'dialog' });
customElements.define('workout-tile', WorkoutTile);
customElements.define('download-dialog', DownloadDialog, { extends: 'dialog' });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}

const main = document.querySelector('main');

for (const id of Object.keys(localStorage)) {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = id;
  main.append(workout);
}

// const dialog = document.querySelector('footer > dialog');

// document.querySelector('footer > button').addEventListener('click', () => {
//   dialog.dataset.id = crypto.randomUUID();
//   dialog.showModal();
// });

// dialog.addEventListener('update', () => {
//   const workout = document.createElement('workout-tile');
//   workout.dataset.id = dialog.dataset.id;
//   main.append(workout);
// });

for (const label of document.querySelectorAll('footer > label')) {
  const [button, dialog] = label.children;
  button.addEventListener('click', () => dialog.showModal());
}
