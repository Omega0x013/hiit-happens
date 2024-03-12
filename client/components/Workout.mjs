// Web Component: <workout-component></workout-component>
// A single workout component that displays the workout name and the exercises in the workout

export default class WorkoutComponent extends HTMLElement {
    constructor() { 
        super();
    }

    async fetchWorkoutData() {
        try {
            const res = await fetch(`/api/workout/${this.dataset.id}`);
            const body = await res.json();
            this.workout = body;
            console.log(this.workout);
        } catch (e) {
            console.error(e);
        }
    }

    async connectedCallback() {
        this.attachShadow({ mode: "open" });

        await this.fetchWorkoutData();
        
        this.h2 = Object.assign(document.createElement("h2"), {"textContent": `${this.workout.name}`});
        this.duration = Object.assign(document.createElement("p"), {"textContent": `Duration: ${Math.floor(this.workout.duration/1000)}`});
        this.link = Object.assign(document.createElement("a"), {"textContent": "Use this timer", "href": `/timer/?id=${this.dataset.id}`});
        this.hr = document.createElement("hr");

        this.shadowRoot.append(this.h2, this.duration, this.link, this.hr);
    }
}

customElements.define("workout-component", WorkoutComponent);