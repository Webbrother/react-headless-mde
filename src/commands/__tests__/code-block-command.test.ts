import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { CodeBlockCommand } from '../word/code-block';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('CodeBlockCommand', () => {
  it('wraps a single-line selection with single backticks', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new CodeBlockCommand(controller).do();

    expect(textArea.value).toBe('hello `world`');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(12);
  });

  it('selects the word at the caret when nothing is selected', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

    new CodeBlockCommand(controller).do();

    expect(textArea.value).toBe('hello `world`');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(12);
  });

  it('inserts empty backticks into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new CodeBlockCommand(controller).do();

    expect(textArea.value).toBe('``');
    expect(textArea.selectionStart).toBe(1);
    expect(textArea.selectionEnd).toBe(1);
  });

  it('wraps a multi-line selection with triple backticks', () => {
    const { textArea, controller } = createTextarea('line1\nline2', { start: 0, end: 11 });

    new CodeBlockCommand(controller).do();

    expect(textArea.value).toBe('```\nline1\nline2\n```');
    expect(textArea.selectionStart).toBe(4);
    expect(textArea.selectionEnd).toBe(15);
  });

  it('adds empty lines around the block when it is inside other text', () => {
    const text = 'start\nline1\nline2\nend';
    const { textArea, controller } = createTextarea(text, { start: 6, end: 17 });

    new CodeBlockCommand(controller).do();

    expect(textArea.value).toBe('start\n\n```\nline1\nline2\n```\n\nend');
    expect(textArea.selectionStart).toBe(11);
    expect(textArea.selectionEnd).toBe(22);
  });
});
