import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { HeadingLevel1Command } from '../line/heading-level1';
import { HeadingLevel2Command } from '../line/heading-level2';
import { HeadingLevel3Command } from '../line/heading-level3';
import { HeadingLevel4Command } from '../line/heading-level4';
import { HeadingLevel5Command } from '../line/heading-level5';
import { HeadingLevel6Command } from '../line/heading-level6';
import { QuoteCommand } from '../line/quote';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('QuoteCommand', () => {
  it('prefixes the selected line with >', () => {
    const { textArea, controller } = createTextarea('hello', { start: 0, end: 5 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('> hello');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('quotes the whole line when the caret is in the middle of it', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('> hello world');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('quotes only the current line inside other text', () => {
    const { textArea, controller } = createTextarea('a\nb\nc', { start: 2, end: 3 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('a\n> b\nc');
    expect(textArea.selectionStart).toBe(4);
    expect(textArea.selectionEnd).toBe(5);
  });

  it('prefixes each line of a multi-line selection', () => {
    const { textArea, controller } = createTextarea('a\nb', { start: 0, end: 3 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('> a\n> b');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('expands a partial selection to whole lines', () => {
    const { textArea, controller } = createTextarea('a1\nb2\nc3', { start: 1, end: 5 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('> a1\n> b2\nc3');
  });

  it('inserts the quote marker into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new QuoteCommand(controller).do();

    expect(textArea.value).toBe('> ');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(2);
  });

  it('shouldUndo returns true when the line is already quoted', () => {
    const { controller } = createTextarea('> hello', { start: 0, end: 7 });

    expect(new QuoteCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns true when the caret is inside a quoted line', () => {
    const { controller } = createTextarea('hello\n> world\n!', { start: 10, end: 10 });

    expect(new QuoteCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns true when every line of the selection is quoted', () => {
    const { controller } = createTextarea('> a\n> b', { start: 0, end: 7 });

    expect(new QuoteCommand(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns false when the line is not quoted', () => {
    const { controller } = createTextarea('hello', { start: 0, end: 5 });

    expect(new QuoteCommand(controller).shouldUndo?.()).toBe(false);
  });

  it('shouldUndo returns false for an empty editor', () => {
    const { controller } = createTextarea('', { start: 0, end: 0 });

    expect(new QuoteCommand(controller).shouldUndo?.()).toBe(false);
  });

  it('undo removes the > prefix from the line', () => {
    const { textArea, controller } = createTextarea('> hello', { start: 0, end: 7 });

    new QuoteCommand(controller).undo?.();

    expect(textArea.value).toBe('hello');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(5);
  });

  it('undo removes the prefix when the caret is inside the quoted line', () => {
    const { textArea, controller } = createTextarea('hello\n> world\n!', { start: 10, end: 10 });

    new QuoteCommand(controller).undo?.();

    expect(textArea.value).toBe('hello\nworld\n!');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });

  it('undo removes the prefix from each line of a multi-line quote', () => {
    const { textArea, controller } = createTextarea('> a\n> b', { start: 0, end: 7 });

    new QuoteCommand(controller).undo?.();

    expect(textArea.value).toBe('a\nb');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(3);
  });

  it('undo removes only the current line prefix inside other text', () => {
    const { textArea, controller } = createTextarea('a\n> b\nc', { start: 2, end: 5 });

    new QuoteCommand(controller).undo?.();

    expect(textArea.value).toBe('a\nb\nc');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(3);
  });

  it('undo removes the empty quote marker', () => {
    const { textArea, controller } = createTextarea('> ', { start: 0, end: 2 });

    new QuoteCommand(controller).undo?.();

    expect(textArea.value).toBe('');
  });
});

describe('heading commands', () => {
  const cases = [
    { CommandClass: HeadingLevel1Command, prefix: '# ' },
    { CommandClass: HeadingLevel2Command, prefix: '## ' },
    { CommandClass: HeadingLevel3Command, prefix: '### ' },
    { CommandClass: HeadingLevel4Command, prefix: '#### ' },
    { CommandClass: HeadingLevel5Command, prefix: '##### ' },
    { CommandClass: HeadingLevel6Command, prefix: '###### ' },
  ];

  cases.forEach(({ CommandClass, prefix }) => {
    it(`prefixes the selected line with "${prefix}"`, () => {
      const { textArea, controller } = createTextarea('title', { start: 0, end: 5 });

      new CommandClass(controller).do();

      expect(textArea.value).toBe(`${prefix}title`);
      expect(textArea.selectionStart).toBe(prefix.length);
      expect(textArea.selectionEnd).toBe(prefix.length + 5);
    });
  });

  it('turns the whole line into a heading when the caret is in the middle of it', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

    new HeadingLevel1Command(controller).do();

    expect(textArea.value).toBe('# hello world');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('prefixes only the current line inside other text', () => {
    const { textArea, controller } = createTextarea('a\nb\nc', { start: 2, end: 3 });

    new HeadingLevel2Command(controller).do();

    expect(textArea.value).toBe('a\n## b\nc');
  });

  it('prefixes each line of a multi-line selection', () => {
    const { textArea, controller } = createTextarea('a\nb', { start: 0, end: 3 });

    new HeadingLevel1Command(controller).do();

    expect(textArea.value).toBe('# a\n# b');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('inserts the heading marker into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new HeadingLevel2Command(controller).do();

    expect(textArea.value).toBe('## ');
    expect(textArea.selectionStart).toBe(3);
    expect(textArea.selectionEnd).toBe(3);
  });

  it('shouldUndo returns true when the line is already a heading', () => {
    const { controller } = createTextarea('# title', { start: 0, end: 7 });

    expect(new HeadingLevel1Command(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns true when the caret is inside a heading line', () => {
    const { controller } = createTextarea('hello\n# world\n!', { start: 10, end: 10 });

    expect(new HeadingLevel1Command(controller).shouldUndo?.()).toBe(true);
  });

  it('shouldUndo returns false when the line is not a heading', () => {
    const { controller } = createTextarea('title', { start: 0, end: 5 });

    expect(new HeadingLevel1Command(controller).shouldUndo?.()).toBe(false);
  });

  it('undo removes the heading prefix from the line', () => {
    const { textArea, controller } = createTextarea('# title', { start: 0, end: 7 });

    new HeadingLevel1Command(controller).undo?.();

    expect(textArea.value).toBe('title');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(5);
  });

  it('undo removes the heading prefix when the caret is inside the line', () => {
    const { textArea, controller } = createTextarea('hello\n# world\n!', { start: 10, end: 10 });

    new HeadingLevel1Command(controller).undo?.();

    expect(textArea.value).toBe('hello\nworld\n!');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });

  it('undo removes the prefix from each line of a multi-line heading', () => {
    const { textArea, controller } = createTextarea('# a\n# b', { start: 0, end: 7 });

    new HeadingLevel1Command(controller).undo?.();

    expect(textArea.value).toBe('a\nb');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(3);
  });
});
