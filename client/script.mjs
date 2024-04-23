if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

// TODO: #22 change exercises to be a single segment rather than pairs
localStorage.setItem("abc", JSON.stringify({"name": "b", exercises: [{type: "sprint", duration: 5, rest: 2}, {type: "sprint", duration: 3, rest: 4}, {type: "sprint", duration: 9, rest: 1}]}));
localStorage.setItem("cbd", JSON.stringify({"name": "hello", exercises: [{type: "sprint", duration: 5, rest: 2}]}))

const main = document.querySelector('main');
const workout1 = document.createElement('workout-tile');
workout1.dataset.id = "abc";
const workout2 = document.createElement('workout-tile');
workout2.dataset.id = "cbd";

main.append(workout1, workout2);