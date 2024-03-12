/**
 * Web Component: `<timer-component data-workout-id="..."></timer-component>`
 * 
 * A timer, that fetches an array of exercises from the API.
 */
export default class TimerComponent extends HTMLElement {
    constructor() {
        super();
    }

    async fetchWorkoutData() {
        try {
            const res = await fetch(`/api/workout/${this.dataset.id}`);
            const body = await res.json();
            this.workout = body;
        } catch (e) {
            alert(`Error Encountered: "${e.message}"`);
        }
    }

    connectedCallback() {
        this.attachShadow({ mode: "open" });

        // Store the workout ID used in fetch in data-id
        this.dataset.id = new URLSearchParams(window.location.search).get("id");

        // Create the elements that belong to this component
        this.h1 = Object.assign(document.createElement("h1"), {"textContent": "-1"});
        this.start = Object.assign(document.createElement("button"), {"textContent": "Start"});
        this.pause = Object.assign(document.createElement("button"), {"textContent": "Pause", "disabled": "true"});
        this.reset = Object.assign(document.createElement("button"), {"textContent": "Reset"});

        // Bind the correct event listeners
        this.boundChangeTimerState = this.changeTimerState.bind(this);
        this.start.addEventListener("click", this.boundChangeTimerState);
        this.pause.addEventListener("click", this.boundChangeTimerState);
        this.reset.addEventListener("click", this.boundChangeTimerState);

        // We want to use the existing infrastructure to initialise the timer
        this.state = "Reset";
        this.fetchWorkoutData();

        // Add the elements to the shadow dom
        this.shadowRoot.append(this.h1, this.start, this.pause, this.reset);

        // Start the animation loop
        this.boundAnimationFrame = this.animationFrame.bind(this);
        requestAnimationFrame(this.boundAnimationFrame);
    }

    changeTimerState(event) {
        /* Currently taking an ostrich solution on the fact that you can
        click the start button to no effect while the timer is 0 */
        this.state = event.target.textContent;
        switch (this.state) {
            case "Start":
                this.start.disabled = true;
                this.pause.disabled = false;
                this.reset.disabled = true;
                break;
            case "Pause":
                this.start.disabled = false;
                this.pause.disabled = true;
                this.reset.disabled = false;
                break;
            case "Reset":
                break;
        }
    }

    /**
     * A single round of animation for this timer instance.
     * @param {Number} t Current window time in ms
     */
    animationFrame(t) {
        const elapsed = t - this.t ?? 0;
        this.t = t;
        switch (this.state) {
            case "Start":
                this.value -= elapsed;
                // Once the timer has hit 0 click the pause button ourselves
                if (this.value <= 0) this.pause.dispatchEvent(new Event("click"));
                break;
            case "Reset":
                this.value = this?.workout?.duration ?? 0;
                break;
            case "Pause":
            default:
                break;
        }

        this.h1.textContent = Math.ceil(this.value / 1000);
        requestAnimationFrame(this.boundAnimationFrame);
    }
}

customElements?.define("timer-component", TimerComponent);