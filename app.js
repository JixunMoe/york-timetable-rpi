global.__base = __dirname + '/';
global.__src  = __dirname + '/src/';

const config = require('./config.json');
const ics = require('./ics-parser');

const moment = require('moment');
moment.locale('en-gb');

const dataSrc = require('./src/data');

// Sync calendar every 8 hours.
const syncMs = 8 * 3600000;

// Reload display every 5 minutes.
const reloadSeconds = 1 // 5 * 60;
const reloadMs = reloadSeconds * 1000;

let ics_data = null;
let processTimer = 0;

// 1. Sync data
function syncData () {
  clearTimeout(processTimer);

  dataSrc.sync(config.sync_url, function (err, data) {
    if (err) {
      console.error('Sync Error: ', err);
      process.exit(1);
    }

    ics_data = ics(data);
    processData(ics_data);

    setTimeout(syncData, syncMs);
  });
}

// 2. Process Data
function processData (ics_data) {
  clearTimeout(processTimer);
  let data = dataSrc.process(ics_data);
  displayData(data);

  processTimer = setTimeout(processData, reloadMs, ics_data);
}

// 3. Display data
function displayData(data) {
  dataSrc.display(data, reloadSeconds);
}

// Begin Sync-Process-Display cycle.
syncData();
