// NOTE: Depends on add-tests having been run on the database.

var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');
var callNextTick = require('call-next-tick');

var session = {};

((function prepare() {
  session.db = level(
    __dirname + '/test.db',
    {
      valueEncoding: 'json'
    }
  );
})());

var testData = {
  'Wart': {
    value: {
      name: 'Wart',
      weakness: 'vegetables'
    },
    sessionKeysOfExpectedChildren: [
      'Tryclyde',
      'Fryguy'
    ]
  },
  'Tryclyde': {
    value: {
      name: 'Tryclyde',
      weakness: 'mushroom blocks'
    },
    sessionKeysOfExpectedChildren: []
  },
  'Fryguy': {
    value: {
      name: 'Fryguy',
      weakness: 'mushroom blocks'
    },
    sessionKeysOfExpectedChildren: []
  }
};

test('Get tree', function treeTest(t) {
  t.plan(3);

  createLevelTree(
    {
      db: session.db,
      treeName: 'subcon'
    },
    checkTree
  );

  function checkTree(error, root) {
    t.ok(!error, 'No error when getting tree.');
    t.equal(typeof root, 'object');
    t.deepEqual(root.value, testData.Wart.value, 'Root value got.');
    session.root = root;

    callNextTick(runGetChildTest, root);
  }
});

function runGetChildTest(node) {
  var testDatum = testData[node.value.name];

  test('Get ' + node.value.name + ' children', function getTest(t) {
    t.plan(testDatum.sessionKeysOfExpectedChildren.length + 3);

    t.equal(typeof node.getChildren, 'function', 'Has a getChildren method.');
    node.getChildren(checkGet);

    function checkGet(error, children) {
      t.ok(!error, 'No error while getting.');
      t.equal(typeof children, 'object');

      testDatum.sessionKeysOfExpectedChildren.forEach(checkChild);

      function checkChild(key, i) {
        var expectedChild = testData[key];
        t.deepEqual(
          children[i].value, expectedChild.value, 'Child is retrieved.'
        );
        callNextTick(runGetChildTest, children[i]);
      }
    }
  });
}
