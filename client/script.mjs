if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}

localStorage.setItem('abc', JSON.stringify({ name: 'full tilt', exercises: [{ type: 'walk', duration: 15000 }, { type: 'rest', duration: 3000 }, { type: 'sprint', duration: 9000 }] }));
localStorage.setItem('cbd', JSON.stringify({ name: 'low effort', exercises: [{ type: 'lie down', duration: 5000 }] }));

const main = document.querySelector('main');

for (let i = 0; i < localStorage.length; i++) {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = localStorage.key(i);
  main.append(workout);
}

const dialog = document.querySelector('footer > dialog');

document.querySelector('footer > button').addEventListener('click', () => {
  dialog.dataset.id = crypto.randomUUID();
  dialog.showModal();
});

dialog.addEventListener('update', () => {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = dialog.dataset.id;
  main.append(workout);
});
