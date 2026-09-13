import {
  type AlterLineFunction,
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getLineSelection,
  getSelectedText,
  getStringAfterSelection,
  getStringBeforeSelection,
  getWordSelection,
  insertBeforeEachLine,
  selectAfterWord,
} from '../selection-and-text';

describe('getWordSelection', () => {
  it('selects the whole word when the caret is inside a word', () => {
    const result = getWordSelection({
      text: 'hello world',
      selection: { start: 8, end: 8 },
    });

    expect(result).toEqual({ start: 6, end: 11 });
  });

  it('selects the word when the caret is at the start of a word', () => {
    const result = getWordSelection({
      text: 'hello world',
      selection: { start: 6, end: 6 },
    });

    expect(result).toEqual({ start: 6, end: 11 });
  });

  it('selects the first word when the caret is at position 0', () => {
    const result = getWordSelection({
      text: 'hello world',
      selection: { start: 0, end: 0 },
    });

    expect(result).toEqual({ start: 0, end: 5 });
  });

  it('stops at line breaks', () => {
    const result = getWordSelection({
      text: 'foo\nbar baz',
      selection: { start: 5, end: 5 },
    });

    expect(result).toEqual({ start: 4, end: 7 });
  });

  it('keeps the selection when a text range is already selected', () => {
    const result = getWordSelection({
      text: 'hello world',
      selection: { start: 0, end: 5 },
    });

    expect(result).toEqual({ start: 0, end: 5 });
  });

  it('returns the selection as is for empty text', () => {
    const result = getWordSelection({
      text: '',
      selection: { start: 0, end: 0 },
    });

    expect(result).toEqual({ start: 0, end: 0 });
  });
});

describe('getLineSelection', () => {
  it('expands the caret to the whole single-line text', () => {
    expect(
      getLineSelection({
        text: 'hello world',
        selection: { start: 8, end: 8 },
      }),
    ).toEqual({ start: 0, end: 11 });
  });

  it('expands the caret to the current line', () => {
    expect(
      getLineSelection({
        text: 'a\nb\nc',
        selection: { start: 2, end: 3 },
      }),
    ).toEqual({ start: 2, end: 3 });
  });

  it('expands a partial selection to whole lines', () => {
    expect(
      getLineSelection({
        text: 'a1\nb2\nc3',
        selection: { start: 1, end: 5 },
      }),
    ).toEqual({ start: 0, end: 5 });
  });

  it('keeps the selection that already covers whole lines', () => {
    expect(
      getLineSelection({
        text: 'a\nb',
        selection: { start: 0, end: 3 },
      }),
    ).toEqual({ start: 0, end: 3 });
  });

  it('handles empty text', () => {
    expect(
      getLineSelection({
        text: '',
        selection: { start: 0, end: 0 },
      }),
    ).toEqual({ start: 0, end: 0 });
  });
});

describe('selectAfterWord', () => {
  it('returns a collapsed selection right after the current word', () => {
    const result = selectAfterWord({
      text: 'hello world',
      selection: { start: 1, end: 1 },
    });

    expect(result).toEqual({ start: 5, end: 5 });
  });

  it('returns the selection as is for empty text', () => {
    const result = selectAfterWord({
      text: '',
      selection: { start: 0, end: 0 },
    });

    expect(result).toEqual({ start: 0, end: 0 });
  });
});

describe('getBreaksNeededForEmptyLineBefore', () => {
  it('returns 0 at the start of the text', () => {
    expect(getBreaksNeededForEmptyLineBefore('hello', 0)).toBe(0);
  });

  it('returns 2 when the position is in the middle of a line', () => {
    expect(getBreaksNeededForEmptyLineBefore('hello world', 6)).toBe(2);
  });

  it('returns 1 when there is a single line break before', () => {
    expect(getBreaksNeededForEmptyLineBefore('hello\nworld', 6)).toBe(1);
  });

  it('returns 0 when there is already an empty line before', () => {
    expect(getBreaksNeededForEmptyLineBefore('hello\n\nworld', 7)).toBe(0);
  });

  it('ignores blank spaces when counting breaks', () => {
    expect(getBreaksNeededForEmptyLineBefore('hello\n  \nworld', 9)).toBe(0);
  });

  it('returns 1 when there is a line break but no empty line before', () => {
    expect(getBreaksNeededForEmptyLineBefore('\nhello', 1)).toBe(1);
  });

  it('returns 0 when there is nothing but blank spaces before (first line)', () => {
    expect(getBreaksNeededForEmptyLineBefore('   hello', 3)).toBe(0);
  });
});

describe('getBreaksNeededForEmptyLineAfter', () => {
  it('returns 0 at the end of the text', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello', 4)).toBe(0);
  });

  it('returns 0 when there is no text after the position', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello', 5)).toBe(0);
  });

  it('returns 2 when the position is in the middle of a line', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello world', 5)).toBe(2);
  });

  it('returns 1 when there is a single line break after', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello\nworld', 5)).toBe(1);
  });

  it('returns 0 when there is already an empty line after', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello\n\nworld', 5)).toBe(0);
  });

  it('ignores blank spaces when counting breaks', () => {
    expect(getBreaksNeededForEmptyLineAfter('hello\n  \nworld', 5)).toBe(0);
  });
});

describe('getSelectedText', () => {
  it('returns the selected slice of text', () => {
    expect(
      getSelectedText({
        text: 'hello world',
        selection: { start: 0, end: 5 },
      }),
    ).toBe('hello');
  });

  it('returns an empty string when nothing is selected', () => {
    expect(
      getSelectedText({
        text: 'hello',
        selection: { start: 2, end: 2 },
      }),
    ).toBe('');
  });
});

describe('getStringBeforeSelection', () => {
  it('returns the given number of characters before the selection', () => {
    expect(
      getStringBeforeSelection(
        {
          text: 'hello world',
          selection: { start: 6, end: 11 },
        },
        2,
      ),
    ).toBe('o ');
  });
});

describe('getStringAfterSelection', () => {
  it('returns the given number of characters after the selection', () => {
    expect(
      getStringAfterSelection(
        {
          text: 'hello world',
          selection: { start: 0, end: 5 },
        },
        2,
      ),
    ).toBe(' w');
  });
});

describe('insertBeforeEachLine', () => {
  it('inserts a string before each line', () => {
    const { modifiedText, insertionLength } = insertBeforeEachLine('first\nsecond', '- ');

    expect(modifiedText).toBe('- first\n- second');
    expect(insertionLength).toBe(4);
  });

  it('supports a function to compute the insertion per line', () => {
    const { modifiedText, insertionLength } = insertBeforeEachLine(
      'first\nsecond\nthird',
      (line, index) => `${index + 1}. `,
    );

    expect(modifiedText).toBe('1. first\n2. second\n3. third');
    expect(insertionLength).toBe(9);
  });

  it('handles a single line', () => {
    const { modifiedText, insertionLength } = insertBeforeEachLine('first', '> ');

    expect(modifiedText).toBe('> first');
    expect(insertionLength).toBe(2);
  });

  it('throws when the insertion is neither a string nor a function', () => {
    expect(() => insertBeforeEachLine('first', 42 as unknown as AlterLineFunction)).toThrow(
      'insertion is expected to be either a string or a function',
    );
  });
});
