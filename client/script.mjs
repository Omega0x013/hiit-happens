if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

localStorage.setItem("abc", JSON.stringify({"name": "b", exercises: [{type: "sprint", duration: 5000}, {type: "rest", duration: 3000}, {type: "sprint", duration: 9000}]}));
localStorage.setItem("cbd", JSON.stringify({"name": "hello", exercises: [{type: "sprint", duration: 5000}]}));

const main = document.querySelector('main');
const workout1 = document.createElement('workout-tile');
workout1.dataset.id = "abc";
const workout2 = document.createElement('workout-tile');
workout2.dataset.id = "cbd";

main.append(workout1, workout2);