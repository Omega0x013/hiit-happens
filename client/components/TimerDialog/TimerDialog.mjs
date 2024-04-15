export default class TimerDialog extends HTMLDialogElement {
    constructor() {
        super();
    }

    static observedAttributes = ["data-id"];

    async attributeChangedCallback(name, _oldValue, newValue) {

    }

    async connectedCallback() {
        const template = await fetch(import.meta.resolve('./TimerDialog.html'));
        this.innerHTML = await template.text();

        this.boundAnimationFrame = this.animationFrame.bind(this);
        requestAnimationFrame(this.boundAnimationFrame);
    }

    animationFrame(t) {
        if (!this.paused)
            this.elapsed += t;

        const duration = this.workout?.[this.index]?.duration ?? 1000;
        // NOTE: what if this.elapsed was undefined initially?
        if (this.elapsed ?? NaN >= duration) {
            this.elapsed -= duration;
            this.index += 1;
        }

        requestAnimationFrame(this.boundAnimationFrame);
    }
}

customElements.define("timer-dialog", TimerDialog, {"extends": "dialog"});