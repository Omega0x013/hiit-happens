export default class TimerDialog extends HTMLDialogElement {
    constructor() {
        super();
    }

    static observedAttributes = ["data-id"];

    async attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case "data-id":
                // Short-circuit if we don't have anything to update
                if (!this.children.length) return;

                const { name: name, exercises: exercises } = JSON.parse(localStorage.getItem(newValue));

                this.exercises = exercises ?? [];
                this.querySelector('h1').innerText = name;
                this.elapsed = 0;
                this.index = 0;
                this.previous = 0;
                this.paused = true;
        }
    }

    async connectedCallback() {
        const template = await fetch(import.meta.resolve('./TimerDialog.html'));
        this.innerHTML = await template.text();

        this.boundAnimationFrame = this.animationFrame.bind(this);
        requestAnimationFrame(this.boundAnimationFrame);

        this.addEventListener('close', () => this.paused = true);

        this.meter = this.querySelector('meter');
        this.p = this.querySelector('p');

        this.button = this.querySelector('button');
        this.button.addEventListener('click', () => this.paused = !this.paused);

        // Intentionally use side effects
        this.attributeChangedCallback("data-id", null, this.dataset.id);
    }

    animationFrame(now) {
        // Don't move the timer on if we're paused
        if (!this.paused)
            this.elapsed += now - this.previous;
        this.previous = now;

        let {type, duration} = this.exercises[this.index];

        // Current segment has expired
        if (this.elapsed >= duration) {
            this.index++;
            this.elapsed -= duration;
            // Exercise is over, reset to zero
            if (this.index >= this.exercises.length) {
                this.paused = true;
                this.index = 0;
            }
        };

        this.meter.value = (duration - this.elapsed) / duration;
        this.p.textContent = type;

        requestAnimationFrame(this.boundAnimationFrame);
    }
}

customElements.define("timer-dialog", TimerDialog, { "extends": "dialog" });