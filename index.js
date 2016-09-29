const ics = require('./ics-parser');
const fs = require('fs');
const _ = require('underscore');
const time = require('./lib/time');
const moment = require('moment');
moment.locale('en-gb');
const clui = require('clui');
const clc = require('cli-color');

var ics_file = fs.readFileSync('./sample.ics', 'utf-8');

var ics_data = ics(ics_file);

// remove the one before today.


var timeBegin = time.halfHourAgo;
const regexReminderNameAtFront = /Reminder: (.+?)\s*Today from (\d\d[:.]\d\d)(?:-\d\d:\d\d)? in (.+?)(?:$| taught by)/i;
const regexReminderNameAtEnd = / at (\d\d:\d\d) in (.+?)(?: - (.+?)(?:$| - ))/i;
var _ics_data = _.chain(ics_data).filter(event => {
  return event.startDate >= timeBegin;
}).sortBy(event => event.startDate)
  .first(7)
  .map(event => {
    let m_teacher = event.description.match(/taught by (.+?) $/m);
    if (m_teacher) {
      event.teacher = m_teacher[1].split(', ');
    } else {
      event.teacher = ['--'];
    }

    if (event.name.indexOf('Reminder: ') === 0) {
      let zzz, name, startDate, location;
      let m_reminder = event.name.match(regexReminderNameAtEnd);
      if (m_reminder) {
        let yyy;
        [zzz, startDate, location, name] = m_reminder;
      } else if ((m_reminder = event.name.match(regexReminderNameAtFront))) {
        [zzz, name, startDate, location] = m_reminder;
      } else {
        console.info('Unsupported reminder message:');
        console.info(JSON.stringify(event));
        process.exit(1);
      }

      if (m_reminder) {
        let [h, m] = startDate.replace('.', ':').split(':').map(d => parseInt(d));
        event.name = 'Event / Talk';
        event.startDate = moment(event.startDate).hour(h).minute(m);
        event.location = location;
        event.teacher = ["* " + name];
      }
    }

    return event;
  })
  .sortBy(event => event.startDate);

////// UI Display

var Line          = clui.Line;
var LineBuffer    = clui.LineBuffer;

var outputBuffer = new LineBuffer({
  x: 0,
  y: 0,
  width: 'console',
  height: 'console'
});

var header = new Line(outputBuffer)
  .column('Name', 20, [clc.cyan])
  .column('Time', 7, [clc.cyan])
  .column('Location', 20, [clc.cyan])
  .column('Taught by', 40, [clc.cyan])
  .fill()
  .store();

_ics_data.each(event => {
  let line = new Line(outputBuffer)
    .column(event.name, 20)
    .column(moment(event.startDate).format('LT'), 7)
    .column(event.location, 20)
    .column(event.teacher.join(', '), 40)
    .fill()
    .store();
});

outputBuffer.output();
