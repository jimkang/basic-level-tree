var callNextTick = require('call-next-tick');

function getSubtree(node, done) {
  callNextTick(done);
}

module.exports = getSubtree;
