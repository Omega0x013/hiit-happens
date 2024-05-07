export default class UploadDialog extends HTMLDialogElement {
  connectedCallback() {
    this.append(document.querySelector('#upload-dialog-template').content.cloneNode(true));

    this.upload = this.querySelector('input[name=upload]');

    this.addEventListener('drop', this.drop.bind(this));
  }

  drop(event) {
    this.upload.files = event.dataTransfer.files;
    event.preventDefault();
  }
}
