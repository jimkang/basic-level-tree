// NOTE: Depends on add-tests having been run on the database.

var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');
var testData = require('./get-test-data');
// var callNextTick = require('call-next-tick');
// var _ = require('lodash');

var session = {};

((function prepare() {
  session.db = level(
    __dirname + '/test.db',
    {
      valueEncoding: 'json'
    }
  );
})());

test('Get root.', function getRoot(t) {
  t.plan(1);

  createLevelTree(
    {
      db: session.db,
      treeName: 'subcon'
    },
    saveRoot
  );

  function saveRoot(error, root) {
    t.ok(!error, 'No error while getting tree.');
    session.root = root;
  }
});

var pathTestCases = [
  {
    path: [],
    expectedTestDataKey: 'Wart'
  },
  {
    path: ['Fryguy'],
    expectedTestDataKey: 'Fryguy'
  },
  {
    path: ['Tryclyde', 'Panser'],
    expectedTestDataKey: 'Panser'
  }
];

pathTestCases.forEach(runPathTest);

function runPathTest(testCase) {
  test('Get child at path ' + testCase.path.join('/'), function getPathTest(t) {
    t.plan(2);

    session.root.getChildAtPath(testCase.path, checkResult);

    function checkResult(error, node) {
      t.ok(!error, 'No error while getting from path.');
      t.deepEqual(
        node.value,
        testData.get(testCase.expectedTestDataKey).value,
        'Correct child is retrieved.'
      );
    }
  });
}
