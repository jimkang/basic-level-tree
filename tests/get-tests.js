// NOTE: Depends on add-tests having been run on the database.

var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');

var session = {};

((function prepare() {
  session.db = level(__dirname + '/test.db');
})());

var testData = {
  root: {
    value: {
      name: 'Wart',
      weakness: 'vegetables'
    },
    keysOfExpectedChildren: [
      'gc-A',
      'gc-B'
    ]
  },
  'gc-A': {
    value: {
      name: 'Tryclyde',
      weakness: 'mushroom blocks'
    },
    keysOfExpectedChildren: []
  },
  'gc-B': {
    value: {
      name: 'Fryguy',
      weakness: 'mushroom blocks'
    },
    keysOfExpectedChildren: []
  }
};

test('Get tree', function treeTest(t) {
  t.plan(1);

  session.tree = createLevelTree({
    db: session.db,
    treeName: 'subcon'
  });

  t.equal(typeof session.tree, 'object');
});

// testCases.forEach(runGetChildTest);

// function runGetChildTest(testCase) {
//   test('Get ' + testCase.name, function getTest(t) {
//     t.plan(3);

//     session[testCase.parentKey].getChildren(checkGet);

//     function checkGet(error, children) {
//       t.ok(!error, 'No error while getting.');
//       t.equal(typeof children, 'object');
//       var child = children[testCase.name];
//       t.deepEqual(
//         child.value, testCase.value, 'Value is retrieved for node.'
//       );
//     }
//   });
// }
