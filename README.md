# Bloom Built Markdown Checklists for Remarkable

A [remarkable](https://github.com/jonschlinkert/remarkable) plugin to turn GitHub-style [task lists](https://github.com/blog/1825-task-lists-in-all-markdown-documents) into parsable tokens.

Modified from <https://github.com/linsir/markdown-it-task-checkbox>

## Usage

## Build

```bash
yarn install && yarn build
```

The compiled files will be written out to the `dist` folder

## Use

Install method will add itself globally into var `installRemarkableChecklistPluginGlobalFunc` [works around a problem where we use this].

Right now the .min.js file is having an issue exposing the function globally, so use the non-min file for now.

```js
var md = Remarkable(...)
var installRemarkableChecklistPluginGlobalFunc = undefined;
// ...Load script remarkable-task-checkbox.js...
installRemarkableChecklistPluginGlobalFunc(md)

md.parse('- [x] checked', {}) // =>
// [
//   ...,
//   {
//     type: 'list_item_open',
//     checkboxMeta: {idx: 0, checked: true, isCheckbox: true},
//     level: 1,
//     children: [... child tokens!],
//     content: 'checked',
//     hasCheckbox: true,
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
