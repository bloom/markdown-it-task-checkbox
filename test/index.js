/* globals before, describe, it */
"use strict";

var fs = require('fs');
var assert = require('assert');
var md = require('markdown-it');
var taskLists = require('..');
var _ = require('ramda');

describe('markdown-it-task-lists', function() {
    var fixtures = {}, parsed = {}, $ = {}, parser;

    before(function() {
        var files = {
            basic: 'basic.md',
            children: 'children.md',
            dirty: 'dirty.md'
        };

        parser = md().use(taskLists);

        for (var key in files) {
            fixtures[key] = fs.readFileSync(__dirname + '/fixtures/' + files[key]).toString();
            parsed[key] = parser.parse(fixtures[key], {});
        }
    });

    it('returns a basic task token with appropriate meta information', function() {
      const actual = parsed.basic[2]

      const expected = _.merge(actual, {
        type: "checklist_item",
        content: " An item",
        meta: {
          idx: 0,
          checked: true
        }
      })
      assert.deepEqual(actual, expected)

      const chillins = actual.children
      assert.equal(chillins.length, 1)
      const child = chillins[0]
      assert.equal(child.type, 'text')
      assert.equal(child.content, ' An item')
    })

    it('identifies a checked box vs unchecked', function() {
      const actual = parsed.basic[5]

      const expected = _.merge(actual, {
        type: "checklist_item",
        meta: {
          idx: 1,
          checked: false
        }
      })
      assert.deepEqual(actual, expected)
    })

    it('does NOT render [  ], "[ ]" (no space after closing bracket), [ x], [x ], or [ x ] as checkboxes', function () {
        const tokens = parsed.dirty
        assert.equal(_.find(t => t.type == "checklist_item", tokens), undefined)
    });

    it('nests other tokens as children', function() {
      const actual = _.find(
        token => token.type == "em_open",
        parsed.children[2].children || []
      )

      assert.notEqual(undefined, actual)
    })

    it('doesn\'t include the [x] in the child tokens', function() {
      const actual = parsed.children[2].children[0]
      assert(actual.content.indexOf("[x]") == -1)
    })
});
