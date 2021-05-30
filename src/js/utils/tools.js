import moment from 'moment';

export function outputTime(datetime) {
  return moment(datetime).format('HH:mm:ss DD.MM.YY');
}

export function outputCommand(command) {
  const comm = command[0].toUpperCase() + command.slice(1);
  return `Received "${comm} command"`;
}
