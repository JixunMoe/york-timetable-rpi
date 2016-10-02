const clui = require('clui');
const clc = require('cli-color');
const moment = require('moment');

const Line          = clui.Line;
const LineBuffer    = clui.LineBuffer;
const lineSeparator = (new Array(100)).join('_');


function newLine(outputBuffer, str) {
  return new Line(outputBuffer)
    .column(str || '')
    .fill()
    .store();
}

module.exports = function (data, waitSeconds) {
  ////// UI Display
  var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 'console',
    height: 'console'
  });

  // fix line missing for kedei led display.
  newLine(outputBuffer);

/*
  var header = new Line(outputBuffer)
    .column('Name', 20, [clc.cyan])
    .column('Time', 7, [clc.cyan])
    .column('Location', 20, [clc.cyan])
    // .column('Taught by', 40, [clc.cyan])
    .fill()
    .store();
  */

  let lastDate = null;
  data.forEach(event => {
    let startDate = moment(event.startDate);
    let eventDate = startDate.date();

    if (lastDate != eventDate) {
      lastDate = eventDate;
      
      // newLine(outputBuffer, lineSeparator);
      newLine(outputBuffer);
      let lineDate = new Line(outputBuffer)
        .column('Date', 6, [clc.red.bold])
        .column(startDate.format('L'))
        .fill()
        .store();
      newLine(outputBuffer);
    }

    let line1 = new Line(outputBuffer)
      .column(event.name, 20)
      .column(startDate.format('LT'), 7)
      .column(event.location, 20)
      .fill()
      .store();

    let line2 = new Line(outputBuffer);
    if (event.teacher) {
      line2
        .column('  By: ')
        .column(event.teacher.join(', '), 50, [clc.green]);
    } else if (event.note) {
      line2
        .column('   *  ')
        .column(event.note, 60, [clc.green]);
    }

    line2.fill().store();
    newLine(outputBuffer);
  });

/*
  let timeReload = moment().add(waitSeconds, 's');
  new Line(outputBuffer).fill().store();
  let lineReloadTime = new Line(outputBuffer)
    .column('Next reload at: ', 20)
    .column(timeReload.format('LTS'), 10, [clc.magenta])
    .fill()
    .store();
*/

  outputBuffer.output();
};
