export default class UploadDialog extends HTMLDialogElement {
  connectedCallback() {
    this.append(document.querySelector('#upload-dialog-template').content.cloneNode(true));

    this.upload = this.querySelector('input[name=upload]');

    this.addEventListener('drop', this.drop.bind(this));
    this.addEventListener('close', this.close.bind(this));
  }

  drop(event) {
    this.upload.files = event.dataTransfer.files;
    event.preventDefault();
  }

  async close() {
    // Minor issue: pressing escape after hitting the 'No file uploaded.' error
    // message still has the return value of 'Save'.
    if (this.returnValue !== 'Save') return;

    const file = this.upload.files[0];

    if (!file) {
      // Keep the dialog open
      this.showModal();
      alert('No file uploaded.');
      return;
    }

    const reader = new FileReader();
    const { target: { result } } = await new Promise(resolve => {
      reader.addEventListener('load', resolve);
      reader.readAsText(file);
    });

    this.dataset.id = crypto.randomUUID();
    localStorage.setItem(this.dataset.id, result);

    const event = new Event('update', { bubbles: true });
    this.dispatchEvent(event);
  }
}
