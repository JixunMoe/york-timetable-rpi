module.exports = generateObject(['display', 'process', 'sync']);

function generateObject (items) {
  let result = {};
  items.forEach(item => {
    result[item] = require(`./${item}`);
  });
  return result;
}
