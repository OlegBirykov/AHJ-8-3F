export default class InstancesWidget {
  constructor(parentEl, log, url) {
    this.parentEl = parentEl;
    this.log = log;
    this.url = url;
    this.classes = this.constructor.classes;
    this.timeout = 30;
    this.connecting = true;
    this.instArray = [];
  }

  static get classes() {
    return {
      widget: 'instances-widget',
      title: 'title',
      instances: 'instances',
      instance: 'instance',
      id: 'instance-id',
      status: 'status',
      statusIndicator: 'status-indicator',
      statusText: 'status-text',
      actions: 'actions',
      startStopButton: 'start-stop-button',
      removeButton: 'remove-button',
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
      <div class="${this.classes.waiting}">
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
    this.newButton = this.widget.querySelector(`.${this.classes.newButton}`);
    this.waiting = this.widget.querySelector(`.${this.classes.waiting}`);

    this.newButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.setWaiting();
      this.send({
        event: 'create',
      });
    });

    this.parentEl.append(this.widget);

    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', () => {
      this.timeCount = this.timeout;
      this.timer = setInterval(() => this.pingTimer(), 1000);

      this.connecting = true;
      this.log.addMessage({
        event: 'connect',
        time: Date.now(),
      });
    });

    this.ws.addEventListener('message', (evt) => {
      const data = JSON.parse(evt.data);
      this.timeCount = this.timeout;
      let index;

      switch (data.event) {
        case 'instances':
          this.instArray = [...data.data];
          this.redraw();
          this.clearWaiting();
          break;

        case 'received':
          this.log.addMessage(data);
          break;

        case 'created':
          this.log.addMessage(data);
          this.instArray.push({
            id: data.id,
            state: 'stopped',
          });
          this.redraw();
          this.clearWaiting();
          break;

        case 'started':
          this.log.addMessage(data);
          index = this.instArray.findIndex((item) => item.id === data.id);
          this.instArray[index].state = 'running';
          this.redraw();
          this.clearWaiting();
          break;

        case 'stopped':
          this.log.addMessage(data);
          index = this.instArray.findIndex((item) => item.id === data.id);
          this.instArray[index].state = 'stopped';
          this.redraw();
          this.clearWaiting();
          break;

        case 'removed':
          this.log.addMessage(data);
          index = this.instArray.findIndex((item) => item.id === data.id);
          this.instArray.splice(index, 1);
          this.redraw();
          this.clearWaiting();
          break;

        default:
      }
    });

    this.ws.addEventListener('error', () => {
      this.ws.close();
    });

    this.ws.addEventListener('close', () => {
      clearInterval(this.timer);

      if (this.connecting) {
        this.setWaiting();
        this.log.addMessage({
          event: 'disconnect',
          time: Date.now(),
        });
      }

      this.connecting = false;
      setTimeout(() => this.connect(), 3000);
    });
  }

  send(req) {
    if (this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    this.ws.send(JSON.stringify(req));
  }

  pingTimer() {
    this.timeCount--;
    if (!this.timeCount) {
      this.ws.close();
      return;
    }

    if (this.timeCount === Math.trunc(this.timeout / 2)) {
      this.send({
        event: 'ping',
      });
    }
  }

  setWaiting() {
    this.waiting.classList.remove('hidden');
  }

  clearWaiting() {
    this.waiting.classList.add('hidden');
  }

  redraw() {
    this.instances.innerHTML = '';
    this.instArray.forEach((item) => {
      const instance = document.createElement('div');
      instance.className = this.classes.instance;
      instance.innerHTML = `
        <p class="${this.classes.id}">
          ${item.id}
        </p>
        <p class="${this.classes.status}">
          Status: <span class="${this.classes.statusIndicator}">i</span> <span class="${this.classes.statusText}">Stopped</span>
        </p>
        <p class="${this.classes.actions}">
          Actions: <a href="." class="${this.classes.startStopButton}">ssb</a> <a href="." class="${this.classes.removeButton}">rem</a>
        </p>
      `;

      const id = instance.querySelector(`.${this.classes.id}`);
      const removeButton = instance.querySelector(`.${this.classes.removeButton}`);

      removeButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.setWaiting();
        this.send({
          event: 'remove',
          id: id.innerText,
        });
      });

      this.instances.append(instance);
      this.instances.scrollTop = this.instances.scrollHeight - this.instances.clientHeight;
    });
  }
}
