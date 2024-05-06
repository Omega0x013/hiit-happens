export default class DownloadDialog extends HTMLDialogElement {
  connectedCallback() {
    this.append(document.querySelector('#download-dialog-template').content.cloneNode(true));
  }
}
