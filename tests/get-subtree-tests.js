// NOTE: Depends on add-tests having been run on the database.

var test = require('tape');
var createLevelTree = require('../index');
var level = require('level');
var testData = require('./get-test-data');

var fullTree = {
  value: testData.get('Wart').value,
  children: [
    {
      value: testData.get('Tryclyde'),
      children: [
        {
          value: testData.get('Cobrat'),
          children: []
        },
        {
          value: testData.get('Pokey'),
          children: []
        },
        {
          value: testData.get('Panser'),
          children: []
        },
      ]
    },
    {
      value: testData.get('Fryguy'),
      children: [
        {
          value: testData.get('Flurry'),
          children: []
        },
        {
          value: testData.get('Autobomb'),
          children: []
        }
      ]
    }
  ]
};

var subtreeTestCases = [
  {
    path: [],
    expectedTree: fullTree
  },
  {
    path: ['Fryguy'],
    expectedTree: fullTree.children[1]
  },
  {
    path: ['Tryclyde', 'Panser'],
    expectedTree: fullTree.children[0].children[2]
  }
];


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

subtreeTestCases.forEach(runSubtreeTest);

function runSubtreeTest(testCase) {
  test('Get subtree at path ' + testCase.path.join('/'),
    function subtreeTest(t) {
      t.plan(3);

      // session.root.getSubtree(testCase.path, checkResult);
      session.root.getChildAtPath(testCase.path, getChildSubtree);

      function getChildSubtree(error, child) {
        t.ok(!error, 'No error while getting child from path.');
        child.getSubtree(checkResult);
      }

      function checkResult(error, subtree) {
        t.ok(!error, 'No error while getting subtree from node.');
        t.deepEqual(
          subtree,
          testCase.expectedTree,
          'Correct subtree is retrieved.'
        );
      }
    }
  );
}
