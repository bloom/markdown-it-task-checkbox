// Markdown-it plugin to turn task lists into specific tokens to be consumed
// by Day One's renderer

var lensIndex = require('ramda/src/lensIndex')
var lensProp = require('ramda/src/lensProp')
var compose = require('ramda/src/compose')
var over = require('ramda/src/over')

module.exports = function(md) {
  var defaults;
  md.core.ruler.after('inline', 'github-task-lists', function(state) {
    var tokens = state.tokens;
    var lastId = 0;
    for (var i = 2; i < tokens.length; i++) {

      if (isTodoItem(tokens, i)) {
        // Remove the paragraph_open token before the todo token
        tokens.splice(i - 1, 1)
        i--
        // ---
        // Modify the 'inline' token in-place to be a checklist_item token instead
        tokens[i] = todoify(tokens[i], lastId, state.Token);
        // ---
        // Remove the paragraph_close token after the todo token
        tokens.splice(i + 1, 1)
        // ---
        lastId += 1;
        attrSet(tokens[i - 1], 'class', 'task-list-item');
      }
    }
  });
};

function attrSet(token, name, value) {
  var index = token.attrIndex(name);
  var attr = [name, value];

  if (index < 0) {
    token.attrPush(attr);
  } else {
    token.attrs[index] = attr;
  }
}

function isTodoItem(tokens, index) {
  return isInline(tokens[index]) &&
    isParagraph(tokens[index - 1]) &&
    isListItem(tokens[index - 2]) &&
    startsWithTodoMarkdown(tokens[index].content);
}

function todoify(token, lastId, TokenConstructor) {
  var checkbox = new TokenConstructor('checklist_item', 'div', 0);
  var checked = (token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0)
  checkbox.meta = {
    idx: lastId,
    checked: checked
  }

  var firstChildSourceLens = compose(
    lensIndex(0),
    lensProp('content')
  )
  var childrenWithoutCheckboxSyntax = over(firstChildSourceLens, function(maybeContent) {
    if (maybeContent && startsWithTodoMarkdown(maybeContent)) {
      return maybeContent.slice(3)
    } else {
      return maybeContent
    }
  }, token.children)

  checkbox.children = childrenWithoutCheckboxSyntax
  checkbox.content = token.content.slice(3)
  return checkbox;
}

function isInline(token) {
  return token.type === 'inline';
}
function isParagraph(token) {
  return token.type === 'paragraph_open';
}
function isListItem(token) {
  return token.type === 'list_item_open';
}

function startsWithTodoMarkdown(content) {
  // leading whitespace in a list item is already trimmed off by markdown-it
  return content.indexOf('[ ] ') === 0 || content.indexOf('[x] ') === 0 || content.indexOf('[X] ') === 0;
}
