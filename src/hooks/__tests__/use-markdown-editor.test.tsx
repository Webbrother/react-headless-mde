import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BaseCommand } from '../../commands/base-command';
import { HeadingLevel1Command } from '../../commands/line/heading-level1';
import { QuoteCommand } from '../../commands/line/quote';
import { BoldCommand } from '../../commands/word/bold';
import { ItalicCommand } from '../../commands/word/italic';
import { cleanupExecCommand, stubExecCommand } from '../../test-utils';
import { type CommandClassMap } from '../../types/command';
import { type TextController } from '../../types/text-controller';
import { useTextAreaMarkdownEditor } from '../use-markdown-editor';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Custom command with a context: requires the context argument when executed
class InsertTextCommand extends BaseCommand<string> {
  do(context: string) {
    this.textController.replaceSelection(context);
  }
}

// Compile-time checks of the command executors typing (issue #22, 2nd idea).
// The component is never rendered — the checks run via tsc/ts-jest.
function StrictlyTypedComponent() {
  const { ref, commands } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: BoldCommand,
      insertText: InsertTextCommand,
    },
  });

  commands.bold();
  // @ts-expect-error a command without a context takes no arguments
  commands.bold(42);

  commands.insertText('some text');
  // @ts-expect-error a command with a context requires the context argument
  commands.insertText();

  return <textarea ref={ref} />;
}

// Loosely typed editor capture for runtime tests; strict typing is checked above
type AnyCommands = Record<string, (context?: unknown) => void>;

interface CapturedEditor {
  ref: React.RefObject<HTMLTextAreaElement>;
  textController: TextController;
  commands: AnyCommands;
}

let container: HTMLDivElement;
let root: Root;
let editor: CapturedEditor;

function cmd(name: string): (context?: unknown) => void {
  const command = editor.commands[name];

  if (command === undefined) {
    throw new Error(`No such command in test: ${name}`);
  }

  return command;
}

const TestComponent: React.FC<{ commandMap: CommandClassMap }> = ({ commandMap }) => {
  editor = useTextAreaMarkdownEditor({ commandMap });
  return <textarea ref={editor.ref} />;
};

function render(commandMap: CommandClassMap) {
  act(() => {
    root.render(<TestComponent commandMap={commandMap} />);
  });
}

function getTextArea(): HTMLTextAreaElement {
  const textArea = container.querySelector('textarea');

  if (textArea === null) {
    throw new Error('textarea not found in the test container');
  }

  return textArea;
}

beforeEach(() => {
  stubExecCommand();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  cleanupExecCommand();
  act(() => {
    root.unmount();
  });
  container.remove();
  document.body.innerHTML = '';
});

describe('useTextAreaMarkdownEditor typing (issue #22, 2nd idea)', () => {
  it('provides strictly typed command executors', () => {
    expect(StrictlyTypedComponent).toBeDefined();
  });
});

describe('useTextAreaMarkdownEditor', () => {
  it('attaches the ref to the textarea', () => {
    render({ bold: BoldCommand });

    expect(editor.ref.current).toBe(getTextArea());
  });

  it('returns textController and commands', () => {
    render({ bold: BoldCommand });

    expect(editor.textController).toBeDefined();
    expect(editor.commands.bold).toBeDefined();
  });

  it('executes a command on the textarea', () => {
    render({ bold: BoldCommand });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 6, end: 11 });

    act(() => {
      cmd('bold')();
    });

    expect(textArea.value).toBe('hello **world**');
  });

  it('undoes a command when it is executed twice on the same text', () => {
    render({ bold: BoldCommand });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 6, end: 11 });

    act(() => {
      cmd('bold')();
    });
    act(() => {
      cmd('bold')();
    });

    expect(textArea.value).toBe('hello world');
  });

  it('undoes a command when executed with the caret inside a formatted word', () => {
    render({ bold: BoldCommand });
    const textArea = getTextArea();
    textArea.value = 'hello **world**';
    editor.textController.setSelection({ start: 10, end: 10 });

    act(() => {
      cmd('bold')();
    });

    expect(textArea.value).toBe('hello world');
  });

  it('removes the quote prefix when the quote command is executed twice', () => {
    render({ quote: QuoteCommand });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 0, end: 11 });

    act(() => {
      cmd('quote')();
    });
    expect(textArea.value).toBe('> hello world');

    act(() => {
      cmd('quote')();
    });

    expect(textArea.value).toBe('hello world');
  });

  it('removes the heading prefix when the heading command is executed twice', () => {
    render({ heading: HeadingLevel1Command });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 0, end: 11 });

    act(() => {
      cmd('heading')();
    });
    expect(textArea.value).toBe('# hello world');

    act(() => {
      cmd('heading')();
    });

    expect(textArea.value).toBe('hello world');
  });

  it('passes the context to a command with a context', () => {
    render({ insertText: InsertTextCommand });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 5, end: 5 });

    act(() => {
      cmd('insertText')(' beautiful');
    });

    expect(textArea.value).toBe('hello beautiful world');
  });

  it('reuses the command instance between executions', () => {
    let constructionCount = 0;

    class CountingCommand extends BaseCommand {
      constructor(textController: TextController) {
        super(textController);
        constructionCount++;
      }

      do() {
        // do nothing
      }
    }

    render({ counting: CountingCommand });

    act(() => {
      cmd('counting')();
    });
    act(() => {
      cmd('counting')();
    });

    expect(constructionCount).toBe(1);
  });

  it('keeps stable results between rerenders with the same command names', () => {
    render({ bold: BoldCommand });
    const firstRender = editor;

    render({ bold: BoldCommand });

    expect(editor.commands).toBe(firstRender.commands);
    expect(editor.textController).toBe(firstRender.textController);
    expect(editor.ref).toBe(firstRender.ref);
  });

  it('executes commands from the updated commandMap without recreating executors', () => {
    const doFirst = jest.fn();
    const doSecond = jest.fn();

    class FirstCommand extends BaseCommand {
      do = doFirst;
    }

    class SecondCommand extends BaseCommand {
      do = doSecond;
    }

    render({ custom: FirstCommand });
    const stableCommands = editor.commands;

    render({ custom: SecondCommand });

    expect(editor.commands).toBe(stableCommands);

    act(() => {
      cmd('custom')();
    });

    expect(doSecond).toHaveBeenCalledTimes(1);
    expect(doFirst).not.toHaveBeenCalled();
  });

  it('supports commands added to the commandMap on a later render', () => {
    render({ bold: BoldCommand });

    render({ bold: BoldCommand, italic: ItalicCommand });
    const textArea = getTextArea();
    textArea.value = 'hello world';
    editor.textController.setSelection({ start: 0, end: 5 });

    act(() => {
      cmd('italic')();
    });

    expect(textArea.value).toBe('*hello* world');
  });

  it('throws when a detached executor is called after the command was removed', () => {
    render({ bold: BoldCommand });
    const boldExecutor = cmd('bold');

    render({});

    expect(() => {
      boldExecutor();
    }).toThrow('Cannot execute command. Command not found: bold');
  });
});
