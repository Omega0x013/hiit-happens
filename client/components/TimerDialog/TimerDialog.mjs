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
                this.meter.value = 1;
                this.meter.classList.add('active');
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
        // Short-circuit drawing if we're paused, since nothing will change.
        if (this.paused) {
            this.previous = now;
            requestAnimationFrame(this.boundAnimationFrame);
            return;
        }

        this.elapsed += now - this.previous;
        this.previous = now;

        let { type, duration, rest } = this.exercises?.[this.index];
        duration *= 1000, rest *= 1000;
        const total = duration + rest;

        if (this.elapsed < duration) {
            // We're in the active section, therefore the meter regresses
            this.meter.value = (duration - this.elapsed) / duration;
            this.meter.classList.add('active');
        }
        else if (this.elapsed < total) {
            // We're in the rest section, therefore the meter fills
            this.meter.value = (this.elapsed - duration) / rest;
            this.meter.classList.remove('active');
            type = 'rest';
        }
        else {
            // We've hit the end of the section, progress to the next exercise
            this.elapsed -= total;
            this.index += 1;
            if (this.index >= this.exercises?.length) {
                // We've hit the end of the workout, loop back around to 0.
                this.paused = true;
                this.index = 0;
            }
        }

        this.p.textContent = type;

        requestAnimationFrame(this.boundAnimationFrame);
    }
}

customElements.define("timer-dialog", TimerDialog, { "extends": "dialog" });