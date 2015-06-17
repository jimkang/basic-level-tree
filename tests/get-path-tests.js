var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');
var testData = require('./get-test-data');
var populateFreshDb = require('./fixtures/populate-fresh-db');

var session = {};

test('Prepare', function prepare(t) {
  t.plan(1);

  populateFreshDb(checkPopulate);

  function checkPopulate(error) {
    if (error) {
      console.log('Populate error:', error);
    }

    session.db = level(
      __dirname + '/test.db',
      {
        valueEncoding: 'json'
      }
    );

    t.ok(!error, 'No error while preparing db for tests.');
  }
});

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
