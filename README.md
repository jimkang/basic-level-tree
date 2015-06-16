basic-level-tree
================

A basic LevelDB-backed key-value tree. It's got nodes and children and stuff.

Installation
------------

    npm install basic-level-tree

Usage
-----

    var level = require('level');
    var queue = require('queue-async');
    var createLevelTree = require('basic-level-tree');

    var db = level(
      './a-tree.db',
      {
        valueEncoding: 'json'
      }
    );

    // Note: basic-level-tree will not work without valueEncoding set to 'json'.

    async.waterfall(
      [
        populateSMB2Tree,
        readFromTree
      ],
      logSubtree
    );

    function populateSMB2Tree(populateDone) {
      async.waterfall(
        [
          setUpTree,
          addChildren,
          addGrandchildren
        ],
        passBackTree
      );

      function setUpTree(done) {
        createLevelTree(
          {
            db: db,
            treeName: 'subcon',
            root: 'Wart'
          },
          done
        );
      }

      function addChildren(root, done) {
        var childQueue = queue();
        childQueue.defer(root.addChild, 'gc-A', 'Tryclyde');
        childQueue.defer(root.addChild, 'gc-B', 'Fryguy');
        childQueue.await(done);
      }

      function addGrandchildren(gcA, gcB, done) {
        var grandchildQueue = queue();

        grandchildQueue.defer(gcA.addChild, 'grandchildA-1', 'Cobrat');
        grandchildQueue.defer(gcA.addChild, 'grandchildA-2', 'Pokey');
        grandchildQueue.defer(gcA.addChild, 'grandchildA-3, 'Panser');

        grandchildQueue.defer(gcB.addChild, 'grandchildB-1', 'Flurry');
        grandchildQueue.defer(gcB.addChild, 'grandchildB-2', 'Autobomb');

        grandchildQueue.awaitAll(done);
      }

      function passBackTree(error) {
        if (error) {
          done(error);
        }
        else {
          done(error, tree);
        }
      }
    }

    function readFromTree(tree, done) {
      tree.getSubtreeAtPath(
        {
          treePath: ['Wart', 'child-B']
        },
        done
      );
    }

    function logSubtree(error, subtree) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(subtree, null, '  ');
      }
    }

Output:

    {
      'child-b': {
        value: 'Tryclyde',
        children: {
          'grandchildB-1': {
            value: 'Flurry'
          },
          'grandchildB-2': {
            value: 'Autobomb'
          }
        ]
      }
    }

That's a pretty cumbersome example, but hopefully, the common use case for this is simpler: Adding children as a traversal of some structure necessitates that. If not, TODO: make this less busy.

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2015 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
