// NOTE: Depends on add-tests having been run on the database.

var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');
var callNextTick = require('call-next-tick');
var _ = require('lodash');

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
    sessionKeysOfExpectedChildren: [
      'Cobrat',
      'Pokey',
      'Panser'
    ]
  },
  'Fryguy': {
    value: {
      name: 'Fryguy',
      weakness: 'mushroom blocks'
    },
    sessionKeysOfExpectedChildren: [
      'Flurry',
      'Autobomb'
    ]
  },
  'Cobrat': {
    value: {
      name: 'Cobrat',
      weakness: 'turnips'
    },
    sessionKeysOfExpectedChildren: []
  },
  'Pokey': {
    value: {
      name: 'Pokey',
      weakness: 'Pokey heads'
    },
    sessionKeysOfExpectedChildren: []
  },
  'Panser': {
    value: {
      name: 'Panser',
      weakness: 'turtle shells'
    },
    sessionKeysOfExpectedChildren: []
  },
  'Flurry': {
    value: {
      name: 'Flurry',
      weakness: 'carrots'
    },
    sessionKeysOfExpectedChildren: []
  },
  'Autobomb': {
    value: {
      name: 'Autobomb',
      weakness: 'Flurry'
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
    t.plan(5);

    t.equal(typeof node.getChildren, 'function', 'Has a getChildren method.');
    t.deepEqual(node.value, testDatum.value, 'Node value is correct.');

    node.getChildren(checkGet);

    function checkGet(error, children) {
      t.ok(!error, 'No error while getting.');
      t.equal(typeof children, 'object');

      var childNames = _.pluck(_.pluck(children, 'value'), 'name');
      t.deepEqual(
        childNames,
        testDatum.sessionKeysOfExpectedChildren,
        'Children`s names are correct.'
      );

      children.forEach(runGetChildTest);
    }
  });
}
