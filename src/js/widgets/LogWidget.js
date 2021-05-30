// import outputTime from '../utils/tools';

export default class LogWidget {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'log-widget',
      title: 'title',
      messages: 'messages',
    };
  }

  static get markup() {
    return `
      <p class="${this.classes.title}">
        Worklog:
      </p>
      <div class="${this.classes.messages}">      
      </div>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.messages = this.widget.querySelector(`.${this.classes.messages}`);

    this.parentEl.append(this.widget);
  }
}
