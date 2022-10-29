const { setTimeout } = require('timers/promises');

exports.up = async () => {
  await setTimeout(10);
  return 'eee: up';
};

exports.down = async () => {
  await setTimeout(10);
  return 'eee: down';
};
