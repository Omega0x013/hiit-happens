const params = new URLSearchParams(window.location.search);
const workoutId = params.get("id");

if (workoutId) {
    // Should trigger the observed attribute
    document.querySelector('#timer').dataset.workoutId = workoutId;
} else {
    // TODO add error dialog
    alert('Workout ID parameter required');
}