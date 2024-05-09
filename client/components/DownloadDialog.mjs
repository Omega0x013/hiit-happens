export default class DownloadDialog extends HTMLDialogElement {
  connectedCallback() {
    this.append(document.querySelector('#download-dialog-template').content.cloneNode(true));

    this.ul = this.querySelector('ul');

    this.addEventListener('update', this.update.bind(this));
    this.addEventListener('change', this.change);

    this.update(); // Set up our initial content
  }

  update() {
    this.ul.innerHTML = '';
    for (const workout of Object.values(localStorage)) {
      const { name } = JSON.parse(workout);
      const a = document.createElement('a');
      // Since workout is already the product of JSON.stringify, it's easy to bundle it up.
      a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(workout)}`;
      a.textContent = name;
      a.download = `${name}.json`;

      const li = document.createElement('li');
      li.append(a);

      this.ul.append(li);
    }
  }
}
