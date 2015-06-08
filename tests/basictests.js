var test = require('tape');
var createLevelTree = require('../index');
var rimraf = require('rimraf');
var level = require('level');

var session = {};

((function prepare() {
  rimraf.sync('test.db');
  session.db = level(__dirname + '/test.db');
})());


var testCases = [
  {
    parentKey: 'tree',
    name: 'root',
    value: {
      name: 'Wart',
      weakness: 'vegetables'
    }
  },
  {
    parentKey: 'root',
    name: 'gc-A',
    value: {
      name: 'Tryclyde',
      weakness: 'mushroom blocks'
    },
  },
  {
    parentKey: 'root',
    name: 'gc-B',
    value: {
      name: 'Fryguy',
      weakness: 'mushroom blocks'
    }
  }
];

test('Create tree', function treeTest(t) {
  t.plan(1);

  session.tree = createLevelTree({
    db: session.db,
    treeName: 'subcon'
  });

  t.equal(typeof session.tree, 'object');
});

testCases.forEach(runAddChildTest);

function runAddChildTest(testCase) {
  test('Add ' + testCase.name, function addTest(t) {
    t.plan(3);

    session[testCase.parentKey]
      .addChild(testCase.name, testCase.value, checkAdd);

    function checkAdd(error, added) {
      t.ok(!error, 'No error while adding.');
      t.equal(typeof added, 'object');
      t.deepEqual(
        added.value, testCase.value, 'Value is stored correctly for node.'
      );
      session[testCase.name] = added;
    }
  });
}

