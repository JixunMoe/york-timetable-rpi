const config = require(`${__base}/config`);
const request = require('request');

module.exports = function (callback) {
  callback(null, require('fs').readFileSync(`${__base}/sample.ics`, 'utf8'));
  return ;

  request.get(config.sync_url, function (error, r, body) {
    if (!error && r.statusCode == 200) {
      callback(null, body);
    } else {
      callback(error || new Error('Un-success sync.'));
    }
  });
};
