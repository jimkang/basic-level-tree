var test = require('tape');
var createLevelTree = require('../index');
var rimraf = require('rimraf');
var level = require('level');

var session = {};

((function prepare() {
  rimraf.sync('test.db');
  session.db = level(__dirname + '/test.db');
})());

test('Create tree', function treeTest(t) {
  t.plan(1);

  session.tree = createLevelTree({
    db: session.db,
    treeName: 'subcon'
  });

  t.equal(typeof session.tree, 'object');
});

test('Add child', function childTest(t) {
  t.plan(3);

  var value = {
    name: 'Wart',
    weakness: 'vegetables'
  };

  session.tree.addChild('root', value, checkAdd);

  function checkAdd(error, root) {
    t.ok(!error, 'No error while adding root.');
    t.equal(typeof root, 'object');
    t.deepEqual(root.value, value, 'Value is stored correctly for node.');
    session.root = root;
  }
});
