/**
 * Web Component: `<timer-component data-workout-id="..."></timer-component>`
 * 
 * A timer, that fetches an array of exercises from the API.
 */
export default class TimerComponent extends HTMLElement {
    static get observedAttributes() {
        return ["data-workout-id"]
    }

    constructor() {
        super();
        this.boundAnimationFrame = this.animationFrame.bind(this);
    }

    async attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "data-workout-id") {
            // When the page adds the ID from the URL, this function is called
            try {
                const response = await fetch("/api/workout?" + new URLSearchParams({ id: newValue }));
                const body = await response.json();
                // TODO verify body
                this.dataset.body = body;
            } catch (exception) {
                // TODO add error dialog
                alert(exception.message);
            }
        }
    }

    async connectedCallback() {
        requestAnimationFrame(this.boundAnimationFrame);
    }

    /**
     * 
     * @param {Number} t Current window time in ms
     */
    animationFrame(t) {
        const elapsed = t - this.t ?? 0;
        this.t = t;
        requestAnimationFrame(this.boundAnimationFrame);
    }
}

customElements?.define("timer-component", TimerComponent);