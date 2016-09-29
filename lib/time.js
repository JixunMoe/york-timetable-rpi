const anHour = 3600000;

class Days {
  get today() {
    let today = new Date();
    today.setHours(0,0,0,0);
    return today;
  }

  get tomorrow() {
    let today = new Date();
    let tomorrow = new Date(today.getTime() + anHour * 24);
    tomorrow.setHours(0,0,0,0);
    return tomorrow;
  }

  get halfHourAgo() {
    let now = new Date();
    let halfHourAgo = new Date(now - anHour / 2);
    return halfHourAgo;
  }
}


module.exports = new Days();
