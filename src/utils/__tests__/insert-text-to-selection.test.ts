import { cleanupExecCommand, stubExecCommand } from '../../test-utils';
import { insertToSelection } from '../insert-text-to-selection';

afterEach(() => {
  cleanupExecCommand();
  delete (document as any).selection;
  document.body.innerHTML = '';
});

function createTextarea(text: string, start: number, end: number) {
  const textArea = document.createElement('textarea');
  document.body.appendChild(textArea);
  textArea.value = text;
  textArea.focus();
  textArea.setSelectionRange(start, end);
  return textArea;
}

describe('insertToSelection', () => {
  it('uses document.execCommand when it succeeds', () => {
    const execCommand = jest.fn(() => true);
    (document as any).execCommand = execCommand;
    const textArea = createTextarea('hello world', 0, 5);

    insertToSelection(textArea, 'goodbye');

    expect(execCommand).toHaveBeenCalledWith('insertText', false, 'goodbye');
    // execCommand did the insertion itself, so the fallback must not touch the value
    expect(textArea.value).toBe('hello world');
  });

  it('falls back to setRangeText when execCommand fails', () => {
    stubExecCommand();
    const textArea = createTextarea('hello world', 0, 5);

    insertToSelection(textArea, 'goodbye');

    expect(textArea.value).toBe('goodbye world');
  });

  it('inserts at the caret when nothing is selected', () => {
    stubExecCommand();
    const textArea = createTextarea('helloworld', 5, 5);

    insertToSelection(textArea, ' ');

    expect(textArea.value).toBe('hello world');
  });

  it('replaces the whole value when neither execCommand nor setRangeText are available', () => {
    stubExecCommand();
    const textArea = createTextarea('hello world', 0, 5);
    (textArea as any).setRangeText = undefined;

    insertToSelection(textArea, 'goodbye');

    expect(textArea.value).toBe('goodbye world');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('dispatches an input event on the value-replacement fallback', () => {
    stubExecCommand();
    const textArea = createTextarea('hello world', 0, 5);
    (textArea as any).setRangeText = undefined;
    const onInput = jest.fn();
    textArea.addEventListener('input', onInput);

    insertToSelection(textArea, 'goodbye');

    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it('supports the legacy IE document.selection API', () => {
    const range = {
      text: '',
      collapse: jest.fn(),
      select: jest.fn(),
    };
    (document as any).selection = {
      createRange: () => range,
    };
    const textArea = createTextarea('hello world', 0, 5);

    insertToSelection(textArea, 'goodbye');

    expect(range.text).toBe('goodbye');
    expect(range.collapse).toHaveBeenCalledWith(false);
    expect(range.select).toHaveBeenCalledTimes(1);
  });

  it('focuses the input before inserting', () => {
    stubExecCommand();
    const textArea = document.createElement('textarea');
    document.body.appendChild(textArea);
    textArea.value = 'hello';

    insertToSelection(textArea, 'hi');

    expect(document.activeElement).toBe(textArea);
  });
});
