const request = require('request');

module.exports = function (sync_url, callback) {
  request.get(sync_url, function (error, r, body) {
    if (!error && r.statusCode == 200) {
      callback(null, body);
    } else {
      callback(error || new Error('Un-success sync.'));
    }
  });
};
