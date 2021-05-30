import { outputTime, outputCommand } from '../utils/tools';

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
      message: 'message',
      time: 'time',
      server: 'server',
      info: 'info',
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

  addMessage(msg) {
    const time = outputTime(msg.time);
    let server = 'Server: ';
    let info = 'INFO: ';

    switch (msg.event) {
      case 'connect':
        server += 'All';
        info += 'Connected';
        break;

      case 'disconnect':
        server += 'All';
        info += 'Disconnected';
        break;

      case 'received':
        server += msg.id;
        info += outputCommand(msg.command);
        break;

      case 'created':
        server += msg.id;
        info += 'Created';
        break;

      case 'started':
        server += msg.id;
        info += 'Started';
        break;

      case 'stopped':
        server += msg.id;
        info += 'Stopped';
        break;

      case 'removed':
        server += msg.id;
        info += 'Removed';
        break;

      default:
    }

    const message = document.createElement('div');
    message.className = this.classes.message;
    message.innerHTML = `
      <p class="${this.classes.time}">
        ${time}
      </p>
      <p class="${this.classes.server}">
        ${server}
      </p>
      <p class="${this.classes.info}">
        ${info}
      </p>
    `;

    this.messages.append(message);
    this.messages.scrollTop = this.messages.scrollHeight - this.messages.clientHeight;
  }
}
