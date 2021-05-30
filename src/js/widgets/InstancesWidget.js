export default class InstancesWidget {
  constructor(parentEl, log, url) {
    this.parentEl = parentEl;
    this.log = log;
    this.url = url;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'instances-widget',
      title: 'title',
      instances: 'instances',
      newButton: 'new-button',
      waiting: 'waiting',
    };
  }

  static get markup() {
    return `
      <p class="${this.classes.title}">
        Your micro instances:
      </p>
      <div class="${this.classes.instances}"> 
      </div>
      <a href="." class="${this.classes.newButton}">
        Create new instance
      </a>
      <div class="${this.classes.waiting} hidden">
        <p>
          Waiting...
        </p>
      </p>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.instances = this.widget.querySelector(`.${this.classes.instances}`);

    this.parentEl.append(this.widget);
  }
}
