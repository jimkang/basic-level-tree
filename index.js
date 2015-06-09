var exportMethods = require('export-methods');
var _ = require('lodash');
var Sublevel = require('level-sublevel');
var idmaker = require('idmaker');
var queue = require('queue-async');

function createLevelTree(opts, done) {
  var treeDb;
  var treeName;

  if (opts) {
    treeName = opts.treeName;
  }

  if (!treeName) {
    done(new Error('Missing treeName. Cannot create tree.'));
    return;
  }

  var treeDb = Sublevel(opts.db).sublevel(treeName);

  if (!treeDb) {
    done(new Error('Missing db. Cannot create tree.'));
    return;
  }

  var rootId = idmaker.randomId(8);

  var node = {
    value: opts.root,
    children: []
  };
  node.addChild = _.curry(addChildToNode)(rootId)(node);

  treeDb.put(rootId, node, passBackRoot);

  function passBackRoot(error) {
    if (error) {
      done(error);
    }
    else {
      done(error, node);
    }
  }

  function addChildToNode(parentId, parent, child, addDone) {
    var childId = idmaker.randomId(8);

    var childNode = {
      value: child,
      children: []
    };
    childNode.addChild = _.curry(addChildToNode)(childNode);

    parent.children.push(childNode);

    var q = queue();
    q.defer(treeDb.put, parentId, parent);
    q.defer(treeDb.put, childId, childNode);
    q.await(passBackChild);

    function passBackChild(error) {
      if (error) {
        addDone(error);
      }
      else {
        addDone(error, childNode);
      }
    }
  }
}

module.exports = createLevelTree;
