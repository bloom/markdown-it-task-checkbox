// Markdown-it plugin to turn task lists into specific tokens to be consumed
// by Day One's renderer

var lensIndex = require('ramda/src/lensIndex')
var lensProp = require('ramda/src/lensProp')
var compose = require('ramda/src/compose')
var over = require('ramda/src/over')

function installRemarkableTaskListPlugin(remarkableObj) {
  remarkableObj.core.ruler.after('inline', 'github-task-lists', function(state) {
    var tokens = state.tokens;
    var lastId = 0;
    for (var i = 2; i < tokens.length; i++) {
      if (isTodoItem(tokens, i)) {
        // Modify the checlist_item, adding a hasCheckbox property.
        tokens[i-2].hasCheckbox = true;

        // Modify the 'inline' token in-place to add the checkbox metadata and remove "- [ ] " part at start.
        tokens[i] = todoify(tokens[i], lastId);

        lastId += 1;
      }
    }
  });
};

// Expose method to outside world.
installRemarkableChecklistPluginGlobalFunc = installRemarkableTaskListPlugin;

function isTodoItem(tokens, index) {
  return isInline(tokens[index]) &&
    isParagraph(tokens[index - 1]) &&
    isListItem(tokens[index - 2]) &&
    startsWithTodoMarkdown(tokens[index].content);
}

function todoify(token, lastId, TokenConstructor) {

  var checkbox = token;

    //     type: 'checklist_item',
    //     content: "",
    //     level: token.level - 1,
    //     lines: token.lines,
    //     children: []
    // }

  var checked = (token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0)
  checkbox.checkboxMeta = {
    idx: lastId,
    checked: checked,
    isCheckbox: true
  }

  var firstChildSourceLens = compose(
    lensIndex(0),
    lensProp('content')
  )
  var childrenWithoutCheckboxSyntax = over(firstChildSourceLens, function(maybeContent) {
    if (maybeContent && startsWithTodoMarkdown(maybeContent)) {
      return maybeContent.slice(4)
    } else {
      return maybeContent
    }
  }, token.children)

  checkbox.children = childrenWithoutCheckboxSyntax
  checkbox.content = token.content.slice(4)
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
