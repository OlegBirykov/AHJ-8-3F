import InstancesWidget from './widgets/InstancesWidget';
import LogWidget from './widgets/LogWidget';

const url = 'wss://ahj-8-3.herokuapp.com/ws';

const log = new LogWidget(document.getElementById('container-2'));
log.bindToDOM();

const chat = new InstancesWidget(
  document.getElementById('container-1'),
  log,
  url,
);
chat.bindToDOM();
