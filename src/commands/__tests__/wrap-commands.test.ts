import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { BoldCommand } from '../word/bold';
import { CodeCommand } from '../word/code';
import { ItalicCommand } from '../word/italic';
import { StrikethroughCommand } from '../word/strikethrough';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('BoldCommand', () => {
  it('wraps the selected text with **', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new BoldCommand(controller).do();

    expect(textArea.value).toBe('hello **world**');
    expect(textArea.selectionStart).toBe(8);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('wraps the word at the caret when nothing is selected', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

    new BoldCommand(controller).do();

    expect(textArea.value).toBe('hello **world**');
    expect(textArea.selectionStart).toBe(8);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('wraps the word to the left of the caret', () => {
    const { textArea, controller } = createTextarea('hello', { start: 5, end: 5 });

    new BoldCommand(controller).do();

    expect(textArea.value).toBe('**hello**');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('inserts empty markers when there is no word at the caret', () => {
    const { textArea, controller } = createTextarea('hello ', { start: 6, end: 6 });

    new BoldCommand(controller).do();

    expect(textArea.value).toBe('hello ****');
    expect(textArea.selectionStart).toBe(8);
    expect(textArea.selectionEnd).toBe(8);
  });

  it('inserts empty markers into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new BoldCommand(controller).do();

    expect(textArea.value).toBe('****');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(2);
  });

  it('shouldUndo returns true when the selection is already bold', () => {
    const { controller } = createTextarea('hello **world**', { start: 8, end: 13 });

    expect(new BoldCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns true when the caret is inside a bold word', () => {
    const { controller } = createTextarea('hello **world**', { start: 10, end: 10 });

    expect(new BoldCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns false when the selection is not bold', () => {
    const { controller } = createTextarea('hello world', { start: 6, end: 11 });

    expect(new BoldCommand(controller).shouldUndo?.()).toBe(false);
  });

  it('shouldUndo does not change the selection', () => {
    const { textArea, controller } = createTextarea('hello **world**', { start: 10, end: 10 });

    new BoldCommand(controller).shouldUndo?.();

    expect(textArea.selectionStart).toBe(10);
    expect(textArea.selectionEnd).toBe(10);
  });

  it('undo removes the ** markers around the selection', () => {
    const { textArea, controller } = createTextarea('hello **world**', { start: 8, end: 13 });

    new BoldCommand(controller).undo?.();

    expect(textArea.value).toBe('hello world');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });

  it('undo removes the ** markers when the caret is inside a bold word', () => {
    const { textArea, controller } = createTextarea('hello **world**', { start: 10, end: 10 });

    new BoldCommand(controller).undo?.();

    expect(textArea.value).toBe('hello world');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });

  it('undo removes empty markers', () => {
    const { textArea, controller } = createTextarea('****', { start: 2, end: 2 });

    new BoldCommand(controller).undo?.();

    expect(textArea.value).toBe('');
  });

  it('undo keeps the italic marker of a bold-italic word', () => {
    const { textArea, controller } = createTextarea('***world***', { start: 5, end: 5 });

    new BoldCommand(controller).undo?.();

    expect(textArea.value).toBe('*world*');
  });
});

describe('ItalicCommand', () => {
  it('wraps the selected text with *', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new ItalicCommand(controller).do();

    expect(textArea.value).toBe('hello *world*');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(12);
  });

  it('shouldUndo returns true when the selection is already italic', () => {
    const { controller } = createTextarea('hello *world*', { start: 7, end: 12 });

    expect(new ItalicCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns false when the selection is bold but not italic', () => {
    const { controller } = createTextarea('hello **world**', { start: 8, end: 13 });

    expect(new ItalicCommand(controller).shouldUndo?.()).toBe(false);
  });

  it('do on a bold word makes it bold-italic', () => {
    const { textArea, controller } = createTextarea('hello **world**', { start: 8, end: 13 });

    new ItalicCommand(controller).do();

    expect(textArea.value).toBe('hello ***world***');
    expect(textArea.selectionStart).toBe(9);
    expect(textArea.selectionEnd).toBe(14);
  });

  it('undo removes the * markers', () => {
    const { textArea, controller } = createTextarea('hello *world*', { start: 7, end: 12 });

    new ItalicCommand(controller).undo?.();

    expect(textArea.value).toBe('hello world');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });
});

describe('StrikethroughCommand', () => {
  it('wraps the selected text with ~~', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new StrikethroughCommand(controller).do();

    expect(textArea.value).toBe('hello ~~world~~');
    expect(textArea.selectionStart).toBe(8);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('shouldUndo returns true when the selection is already strikethrough', () => {
    const { controller } = createTextarea('hello ~~world~~', { start: 8, end: 13 });

    expect(new StrikethroughCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('undo removes the ~~ markers', () => {
    const { textArea, controller } = createTextarea('hello ~~world~~', { start: 8, end: 13 });

    new StrikethroughCommand(controller).undo?.();

    expect(textArea.value).toBe('hello world');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });
});

describe('CodeCommand', () => {
  it('wraps the selected text with backticks', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new CodeCommand(controller).do();

    expect(textArea.value).toBe('hello `world`');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(12);
  });

  it('shouldUndo returns true when the selection is already code', () => {
    const { controller } = createTextarea('hello `world`', { start: 7, end: 12 });

    expect(new CodeCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('undo removes the backticks', () => {
    const { textArea, controller } = createTextarea('hello `world`', { start: 7, end: 12 });

    new CodeCommand(controller).undo?.();

    expect(textArea.value).toBe('hello world');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });
});
