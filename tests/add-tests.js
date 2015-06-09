var test = require('tape');
var createLevelTree = require('../index');
var rimraf = require('rimraf');
var level = require('level');

var session = {};

((function prepare() {
  var dbPath = __dirname + '/test.db';
  rimraf.sync(dbPath);
  session.db = level(
    dbPath,
    {
      valueEncoding: 'json'
    }
  );
})());

var testCases = [
  {
    parentKey: 'root',
    value: {
      name: 'Tryclyde',
      weakness: 'mushroom blocks'
    },
  },
  {
    parentKey: 'root',
    value: {
      name: 'Fryguy',
      weakness: 'mushroom blocks'
    }
  }
];

test('Create tree', function treeTest(t) {
  t.plan(1);

  createLevelTree(
    {
      db: session.db,
      treeName: 'subcon',
      root: {
        name: 'Wart',
        weakness: 'vegetables'
      }
    },
    checkTree
  );

  function checkTree(error, root) {
    t.equal(typeof root, 'object');
    session.root = root;
  }
});

testCases.forEach(runAddChildTest);

test('Close db', function close(t) {
  t.plan(1);

  session.db.close(checkClose);

  function checkClose(error) {
    t.ok(!error, 'No error while closing database.');
  }
});

function runAddChildTest(testCase) {
  test('Add ' + testCase.name, function addTest(t) {
    t.plan(3);
    session[testCase.parentKey].addChild(testCase.value, checkAdd);

    function checkAdd(error, added) {
      t.ok(!error, 'No error while adding.');
      t.equal(typeof added, 'object');
      t.deepEqual(
        added.value, testCase.value, 'Value is stored correctly for node.'
      );
      session[testCase.value.name] = added;
    }
  });
}
