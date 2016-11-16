# Bloom Build Markdown Checklists

A [markdown-it](https://www.npmjs.com/package/markdown-it) plugin to turn GitHub-style [task lists](https://github.com/blog/1825-task-lists-in-all-markdown-documents) into parsable tokens.

Modified from <https://github.com/linsir/markdown-it-task-checkbox>

## Usage

## Build

```bash
yarn install && yarn build
```

The compiled files will be written out to the `dist` folder

## Use

If you load script directly into the page, without a
package system, module will add itself globally as `window.markdownitCheckbox`.

```js
var checkboxes = window.markdownitCheckbox // insert your favorite way of importing the module
var md = require('markdown-it')()
  .use(require('markdown-it-checkbox'), checkboxes());

md.parse('- [x] checked', {}) // =>
// [
//   ...,
//   {
//     type: 'checklist_item',
//     tag: 'div',
//     attrs: null,
//     map: null,
//     nesting: 0,
//     level: 0,
//     children: [... child tokens!],
//     content: ' checked',
//     markup: '',
//     info: '',
//     meta: {
//       idx: 0, // <- The global index of the checkbox
//       checked: true // <- The checked state
//     },
//     block: false,
//     hidden: false
//   },
//   ...
// ]
```

## THANKS

- <https://github.com/mcecot/markdown-it-checkbox>
- <https://github.com/revin/markdown-it-task-lists>
- <https://github.com/linsir/markdown-it-task-checkbox>
