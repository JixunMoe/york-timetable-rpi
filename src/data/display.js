const clui = require('clui');
const clc = require('cli-color');
const moment = require('moment');

module.exports = function (data, waitSeconds) {

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

  data.forEach(event => {
    let line = new Line(outputBuffer)
      .column(event.name, 20)
      .column(moment(event.startDate).format('LT'), 7)
      .column(event.location, 20)
      .column(event.teacher.join(', '), 40)
      .fill()
      .store();
  });


  let timeReload = moment().add(waitSeconds, 's');
  new Line(outputBuffer).fill().store();
  let lineReloadTime = new Line(outputBuffer)
    .column('Next reload at: ', 20)
    .column(timeReload.format('LTS'), 10, [clc.magenta])
    .fill()
    .store();


  outputBuffer.output();
};
