const _ = require('underscore');
const regexReminderNameAtFront = /Reminder: (.+?)\s*Today from (\d\d[:.]\d\d)(?:-\d\d:\d\d)? in (.+?)(?:$| taught by)/i;
const regexReminderNameAtEnd = / at (\d\d:\d\d) in (.+?)(?: - (.+?)(?:$| - ))/i;
const time = require('../lib/time');
const moment = require('moment');

module.exports = function (ics_data) {
  var timeBegin = time.halfHourAgo;
  var _ics_data = _.chain(ics_data).filter(event => {
    return event.startDate >= timeBegin;
  }).sortBy(event => event.startDate)
    .first(7)
    .map(event => {
      let m_teacher = event.description.match(/taught by (.+?) $/m);
      if (m_teacher) {
        event.teacher = m_teacher[1].split(', ');
      } else {
        event.teacher = null;
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
          throw new Error('Unsupported reminder message: ' + JSON.stringify(event));
        }

        if (m_reminder) {
          let [h, m] = startDate.replace('.', ':').split(':').map(d => parseInt(d));
          event.name = 'Event / Talk';
          event.startDate = moment(event.startDate).hour(h).minute(m);
          event.location = location;
          event.note = name;
        }
      }

      return event;
    })
    .sortBy(event => event.startDate);
  return _ics_data.value();
};
