import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { TextareaController } from '../textarea-controller';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('TextareaController', () => {
  describe('getState', () => {
    it('returns the current text and selection', () => {
      const { controller } = createTextarea('hello world', { start: 0, end: 5 });

      expect(controller.getState()).toEqual({
        text: 'hello world',
        selection: { start: 0, end: 5 },
      });
    });

    it('throws when there is no textarea in the ref', () => {
      const controller = new TextareaController({ current: null });

      expect(() => controller.getState()).toThrow('No TextAreaRef');
    });
  });

  describe('setSelection', () => {
    it('sets the selection and returns the new state', () => {
      const { textArea, controller } = createTextarea('hello world');

      const state = controller.setSelection({ start: 6, end: 11 });

      expect(textArea.selectionStart).toBe(6);
      expect(textArea.selectionEnd).toBe(11);
      expect(state.selection).toEqual({ start: 6, end: 11 });
    });

    it('focuses the textarea', () => {
      const { textArea, controller } = createTextarea('hello');

      controller.setSelection({ start: 0, end: 0 });

      expect(document.activeElement).toBe(textArea);
    });
  });

  describe('replaceSelection', () => {
    it('replaces the selected text', () => {
      const { textArea, controller } = createTextarea('hello world', { start: 0, end: 5 });

      controller.replaceSelection('goodbye');

      expect(textArea.value).toBe('goodbye world');
    });

    it('inserts text at the caret when nothing is selected', () => {
      const { textArea, controller } = createTextarea('helloworld', { start: 5, end: 5 });

      controller.replaceSelection(' beautiful ');

      expect(textArea.value).toBe('hello beautiful world');
    });
  });

  describe('selectWordByCursor', () => {
    it('selects the word at the caret', () => {
      const { textArea, controller } = createTextarea('hello world', { start: 8, end: 8 });

      const state = controller.selectWordByCursor();

      expect(textArea.selectionStart).toBe(6);
      expect(textArea.selectionEnd).toBe(11);
      expect(state.selection).toEqual({ start: 6, end: 11 });
    });

    it('keeps a non-empty selection', () => {
      const { controller } = createTextarea('hello world', { start: 1, end: 4 });

      const state = controller.selectWordByCursor();

      expect(state.selection).toEqual({ start: 1, end: 4 });
    });
  });

  describe('wrapSelection', () => {
    it('wraps the selection with prefix and suffix', () => {
      const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

      controller.wrapSelection('**', '**');

      expect(textArea.value).toBe('hello **world**');
    });

    it('keeps the wrapped text selected without prefix and suffix', () => {
      const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

      controller.wrapSelection('**', '**');

      expect(textArea.selectionStart).toBe(8);
      expect(textArea.selectionEnd).toBe(13);
    });

    it('supports different prefix and suffix', () => {
      const { textArea, controller } = createTextarea('text', { start: 0, end: 4 });

      controller.wrapSelection('[', '](url)');

      expect(textArea.value).toBe('[text](url)');
      expect(textArea.selectionStart).toBe(1);
      expect(textArea.selectionEnd).toBe(5);
    });
  });

  describe('unwrapSelection', () => {
    it('removes prefix and suffix around the selection', () => {
      const { textArea, controller } = createTextarea('hello **world**', { start: 8, end: 13 });

      controller.unwrapSelection(2, 2);

      expect(textArea.value).toBe('hello world');
      expect(textArea.selectionStart).toBe(6);
      expect(textArea.selectionEnd).toBe(11);
    });
  });

  describe('replaceText', () => {
    it('replaces the first occurrence of a text', () => {
      const { textArea, controller } = createTextarea('foo bar foo');

      controller.replaceText('foo', 'baz');

      expect(textArea.value).toBe('baz bar foo');
    });

    it('does nothing when the text is not found', () => {
      const { textArea, controller } = createTextarea('foo bar');

      controller.replaceText('unknown', 'baz');

      expect(textArea.value).toBe('foo bar');
    });
  });

  describe('moveCursorToTheEnd', () => {
    it('moves the caret to the end of the text', () => {
      const { textArea, controller } = createTextarea('hello world', { start: 0, end: 5 });

      const state = controller.moveCursorToTheEnd();

      expect(textArea.selectionStart).toBe(11);
      expect(textArea.selectionEnd).toBe(11);
      expect(state.selection).toEqual({ start: 11, end: 11 });
    });
  });
});
