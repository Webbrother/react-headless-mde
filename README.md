# Introduction

A simple yet powerful and extensible **React Markdown Editor** that aims to have feature parity with the Github Markdown editor.
React-mde-headless has **no 3rd party dependencies**.

## [Demo](https://codesandbox.io/s/competent-jepsen-qyz51q?file=/src/index.tsx)

## Installing

    npm i react-headless-mde

## Using

```jsx
import { BoldCommand, ItalicCommand, LinkCommand, useTextAreaMarkdownEditor } from 'react-headless-mde';

export const MarkdownEditor = () => {
  const { ref, commands } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: BoldCommand,
      italic: ItalicCommand,
      link: LinkCommand,
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          commands.bold();
        }}
      >
        B
      </button>

      <textarea ref={ref} />
    </div>
  );
};
```

## Custom commands

A command is a class extending `BaseCommand`. The hook instantiates it with the editor's
`TextController` and returns a typed executor. If a command needs a context
(e.g. an `attachment` command accepting an upload promise), extend `BaseCommand<Context>`
— the executor then requires the context argument:

```tsx
import { BaseCommand, useTextAreaMarkdownEditor } from 'react-headless-mde';

class AttachmentCommand extends BaseCommand<Promise<string>> {
  async do(upload: Promise<string>) {
    const url = await upload;
    this.textController.replaceSelection(`![](${url})`);
  }
}

export const MarkdownEditor = () => {
  const { ref, commands } = useTextAreaMarkdownEditor({
    commandMap: {
      attachment: AttachmentCommand,
      bold: BoldCommand,
    },
  });

  commands.attachment(uploadPromise); // OK
  commands.attachment(); // Type error: 1 argument expected
  commands.bold(42); // Type error: 0 arguments expected

  // ...
};
```

Working examples of commands with a context live in
[demo/attachment-command.ts](demo/attachment-command.ts) (`Promise<string>` context)
and [demo/wrap-text-command.ts](demo/wrap-text-command.ts) (a simple `string` context,
wraps the word at the caret with it on both sides), wired up in `demo/index.tsx`.

For undoable commands implement `shouldUndo`/`undo` — the command is then toggled:
executing it on already formatted text removes the formatting (see `WrapCommand`).

## Supported commands

- headingLevel1
- headingLevel2
- headingLevel3
- headingLevel4
- headingLevel5
- headingLevel6
- quote
- checkedList
- orderedList
- unorderedList
- bold
- code
- codeBlock
- italic
- strikethrough
- image
- link

## Command API

Since v3 commands are classes (see [issue #22](https://github.com/Webbrother/react-headless-mde/issues/22)):
the `commandMap` maps camelCase command names to command classes, and the hook returns
strictly typed `commands` executors. The pre-v3 object-based API
(`commandController.executeCommand('bold')`) was removed.

## Todo

- Redo commands
- Check execution on SSR (For example, Next.js) and, if necessary, regenerate eslint config, taking into account execution on node.js
- Undo for
  - 2nd priority
    - `orderedList`
    - `unorderedList`
    - `checkedList`
    - `codeBlock`

PR's are welcome!

### Third party

- https://github.com/grassator/insert-text-at-cursor by https://twitter.com/d_kubyshkin

### XSS concerns

React-mde-headless does not automatically sanitize the HTML preview. If you are using Showdown,
this has been taken from [their documentation](<https://github.com/showdownjs/showdown/wiki/Markdown's-XSS-Vulnerability-(and-how-to-mitigate-it)>):

> Cross-side scripting is a well known technique to gain access to private information of the users
> of a website. The attacker injects spurious HTML content (a script) on the web page which will read
> the user’s cookies and do something bad with it (like steal credentials). As a countermeasure,
> you should filter any suspicious content coming from user input. Showdown does not include an
> XSS filter, so you must provide your own. But be careful in how you do it…

You might want to take a look at

- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize).
- [showdown-xss-filter](https://github.com/VisionistInc/showdown-xss-filter).

## About the authors

The idea from [André Pena](https://github.com/andrerpena). Maintained and developed by Vitaliy Komarov https://github.com/webbrother.
