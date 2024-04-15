if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

// // There's only one timer on the page, when the dialog is opened, the timer is modified.
// const dialog = document.querySelector('dialog');
// const timer = document.querySelector('timer-component');

// localStorage.setItem("abc", JSON.stringify({"name": "b", exercises: [{type: "sprint", duration: 5, rest: 2}, {type: "sprint", duration: 3, rest: 4}, {type: "sprint", duration: 9, rest: 1}]}));

const main = document.querySelector('main');
const workout1 = document.createElement('workout-tile');
workout1.dataset.id = "abc";
const workout2 = workout1.cloneNode(true);

main.append(workout1, workout2);