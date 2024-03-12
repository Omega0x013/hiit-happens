if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

const workouts = document.querySelector("#workouts");

try {
    const res = await fetch(`/api/list/${1}`)
    const body = await res.json();
    for (const id of body) {
        const w = document.createElement("workout-component");
        w.dataset.id = id;
        workouts.append(w);
    }
} catch (e) {
    console.error(e.message);
}