# Introduction

A simple yet powerful and extensible **React Markdown Editor** that aims to have feature parity with the Github Markdown editor.
React-mde-headless has no 3rd party dependencies.

## [Demo](https://codesandbox.io/s/competent-jepsen-qyz51q?file=/src/index.tsx)

## Installing

    npm i react-headless-mde

## Using

```jsx
import { bold, italic, link, useTextAreaMarkdownEditor } from 'react-mde-headless';

export const MarkdownEditor = () => {
  const { ref } = useTextAreaMarkdownEditor();

  return (
    <div>
      <button onClick={bold}>B</button>

      <textarea ref={ref} />
    </div>
  );
};
```

## Supported commands

- bold
- italic
- strikethrough
- headingLevel1
- headingLevel2
- headingLevel3
- headingLevel4
- headingLevel5
- headingLevel6
- link
- quote
- code
- codeBlock
- checkedList
- orderedList
- unorderedList
- image
- attachment

## Todo

- heading undo
- undo/redo
- Check execution on SSR (For example, Next.js) and, if necessary, regenerate eslint config, taking into account execution on node.js
- peerDependencies React?

PR's are welcome!

### Third party

- https://github.com/grassator/insert-text-at-cursor by https://twitter.com/d_kubyshkin

### XSS concerns

React-mde-headless does not automatically sanitize the HTML preview. If you are using Showdown,
this has been taken from [their documentation](<https://github.com/showdownjs/showdown/wiki/Markdown's-XSS-Vulnerability-(and-how-to-mitigate-it)>):

> Cross-side scripting is a well known technique to gain access to private information of the users
> of a website. The attacker injects spurious HTML content (a script) on the web page which will read
> the user’s cookies and do something bad with it (like steal credentials). As a countermeasure,
> you should filter any suspicious content coming from user input. Showdown doesn’t include an
> XSS filter, so you must provide your own. But be careful in how you do it…

You might want to take a look at [showdown-xss-filter](https://github.com/VisionistInc/showdown-xss-filter).

## Licence

React-mde-headless is [MIT licensed](https://github.com/andrerpena/react-mde/blob/master/LICENSE).

## About the authors

Created by [André Pena](https://github.com/andrerpena). Maintained and developed by https://github.com/webbrother.
