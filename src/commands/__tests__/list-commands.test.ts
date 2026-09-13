import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { CheckedListCommand } from '../list/checked-list';
import { OrderedListCommand } from '../list/ordered-list';
import { UnorderedListCommand } from '../list/unordered-list';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('UnorderedListCommand', () => {
  it('prefixes the selected line with - and selects the text without the marker', () => {
    const { textArea, controller } = createTextarea('hello', { start: 0, end: 5 });

    new UnorderedListCommand(controller).do();

    expect(textArea.value).toBe('- hello');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('turns the whole current line into a list item when the caret is inside a word', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

    new UnorderedListCommand(controller).do();

    expect(textArea.value).toBe('- hello world');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('prefixes each line of a multi-line selection', () => {
    const { textArea, controller } = createTextarea('a\nb', { start: 0, end: 3 });

    new UnorderedListCommand(controller).do();

    expect(textArea.value).toBe('- a\n- b');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(7);
  });

  it('adds empty lines around the list when it is inserted inside a paragraph', () => {
    const { textArea, controller } = createTextarea('start\nline\nend', { start: 8, end: 8 });

    new UnorderedListCommand(controller).do();

    expect(textArea.value).toBe('start\n\n- line\n\nend');
    expect(textArea.selectionStart).toBe(9);
    expect(textArea.selectionEnd).toBe(13);
  });

  it('inserts the list marker into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new UnorderedListCommand(controller).do();

    expect(textArea.value).toBe('- ');
    expect(textArea.selectionStart).toBe(2);
    expect(textArea.selectionEnd).toBe(2);
  });
});

describe('OrderedListCommand', () => {
  it('prefixes a single-line selection with 1.', () => {
    const { textArea, controller } = createTextarea('hello', { start: 0, end: 5 });

    new OrderedListCommand(controller).do();

    expect(textArea.value).toBe('1. hello');
    expect(textArea.selectionStart).toBe(3);
    expect(textArea.selectionEnd).toBe(8);
  });

  it('numbers each line of a multi-line selection starting from 1', () => {
    const { textArea, controller } = createTextarea('a\nb\nc', { start: 0, end: 5 });

    new OrderedListCommand(controller).do();

    expect(textArea.value).toBe('1. a\n2. b\n3. c');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(14);
  });
});

describe('CheckedListCommand', () => {
  it('prefixes a single-line selection with a checkbox marker', () => {
    const { textArea, controller } = createTextarea('hello', { start: 0, end: 5 });

    new CheckedListCommand(controller).do();

    expect(textArea.value).toBe('- [ ] hello');
    expect(textArea.selectionStart).toBe(6);
    expect(textArea.selectionEnd).toBe(11);
  });

  it('prefixes each line of a multi-line selection', () => {
    const { textArea, controller } = createTextarea('a\nb', { start: 0, end: 3 });

    new CheckedListCommand(controller).do();

    expect(textArea.value).toBe('- [ ] a\n- [ ] b');
    expect(textArea.selectionStart).toBe(0);
    expect(textArea.selectionEnd).toBe(15);
  });
});
