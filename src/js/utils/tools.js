import moment from 'moment';

export default function outputTime(datetime) {
  return moment(datetime).format('HH:mm:ss DD.MM.YY');
}
