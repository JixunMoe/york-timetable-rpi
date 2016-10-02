const request = require('request');
const fs = require('fs');

module.exports = function (sync_url, callback) {
  if (process.env.sample == '1') {
    callback(null, fs.readFileSync(`${__base}/sample.ics`, 'utf8'));
    return ;
  }

  request.get(sync_url, function (error, r, body) {
    if (!error && r.statusCode == 200) {
      callback(null, body);
    } else {
      callback(error || new Error('Un-success sync.'));
    }
  });
};
