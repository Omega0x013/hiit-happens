if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
}

const main = document.querySelector('main');

for (let i = 0; i < localStorage.length; i++) {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = localStorage.key(i);
  main.append(workout);
}

const dialog = document.querySelector('footer > dialog');

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='];

document.querySelector('footer > button').addEventListener('click', () => {
  // dialog.dataset.id = crypto.randomUUID();
  dialog.dataset.id = Array.from({ length: 32 }, () => ALPHABET.at(Math.floor(Math.random() * ALPHABET.length))).join('');
  dialog.showModal();
});

dialog.addEventListener('update', () => {
  const workout = document.createElement('workout-tile');
  workout.dataset.id = dialog.dataset.id;
  main.append(workout);
});
