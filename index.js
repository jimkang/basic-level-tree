var exportMethods = require('export-methods');
var _ = require('lodash');
var Sublevel = require('level-sublevel');
var callNextTick = require('call-next-tick');

function createLevelTree(opts) {
  var db;
  var treeName;

  if (opts) {
    db = opts.db;
    treeName = opts.treeName;
  }

  if (!db) {
    throw new Error('Missing db. Cannot create tree.');
  }

  if (!treeName) {
    throw new Error('Missing treeName. Cannot create tree.');
  }

  var node = {
    addChild: _.curry(addChildToNode)(node),
  };

  return node;
}

function addChildToNode(parent, childName, childValue, done) {
  var child = {
    value: childValue
  };

  callNextTick(done, null, child);
}

module.exports = createLevelTree;
