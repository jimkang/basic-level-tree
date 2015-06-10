var callNextTick = require('call-next-tick');

function getChildAtPath(parent, path, done) {
  callNextTick(done);
}

module.exports = getChildAtPath;
