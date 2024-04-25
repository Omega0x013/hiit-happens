if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

localStorage.setItem("abc", JSON.stringify({"name": "b", exercises: [{type: "sprint", duration: 5000}, {type: "rest", duration: 3000}, {type: "sprint", duration: 9000}]}));
localStorage.setItem("cbd", JSON.stringify({"name": "hello", exercises: [{type: "sprint", duration: 5000}]}));

const main = document.querySelector('main');

for (let i = 0; i < localStorage.length; i++) {
    const workout = document.createElement('workout-tile');
    workout.dataset.id = localStorage.key(i);
    main.append(workout);
}
