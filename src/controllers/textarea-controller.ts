import { type SelectionRange, type TextController, type TextState } from '../types/text-controller';
import { type RefObject } from 'react';
import { insertToSelection } from '../utils/insert-text-to-selection';
import { getSelectedText, getWordSelection } from '../utils/selection-and-text';

function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
    },
    text: textArea.value,
  };
}

export class TextareaController implements TextController {
  textAreaRef: RefObject<HTMLTextAreaElement>;

  constructor(textAreaRef: RefObject<HTMLTextAreaElement>) {
    this.textAreaRef = textAreaRef;
  }

  private get textArea() {
    const textArea = this.textAreaRef?.current;
    if (!textArea) {
      throw new Error('No TextAreaRef');
    }

    return textArea;
  }

  selectWordByCursor() {
    const initialState = this.getState();
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = getWordSelection({
      text: initialState.text,
      selection: initialState.selection,
    });
    return this.setSelection(newSelectionRange);
  }

  setSelection({ start, end }: SelectionRange): TextState {
    const textArea = this.textArea;

    textArea.focus();
    textArea.selectionStart = start;
    textArea.selectionEnd = end;
    return getStateFromTextArea(textArea);
  }

  replaceSelection(text: string): TextState {
    const textArea = this.textArea;

    insertToSelection(textArea, text);
    return getStateFromTextArea(textArea);
  }

  replaceText(searchString: string, replaceString: string): TextState {
    const textArea = this.textArea;
    const startIndex = textArea.value.indexOf(searchString);

    if (startIndex === -1) return getStateFromTextArea(textArea);

    this.setSelection({ start: startIndex, end: startIndex + searchString.length });
    this.replaceSelection(replaceString);

    return getStateFromTextArea(textArea);
  }

  wrapSelection(prefix: string, suffix: string): TextState {
    const state1 = this.getState();

    // Replaces the current selection with new string
    const state2 = this.replaceSelection(`${prefix}${getSelectedText(state1)}${suffix}`);

    // Adjust the selection to not contain the **
    return this.setSelection({
      start: state2.selection.end - prefix.length - getSelectedText(state1).length,
      end: state2.selection.end - suffix.length,
    });
  }

  unwrapSelection(prefixLength: number, suffixLength: number) {
    const initialState = this.getState();
    const text = getSelectedText(initialState);

    this.setSelection({
      start: initialState.selection.start - prefixLength,
      end: initialState.selection.end + suffixLength,
    });

    this.replaceSelection(text);

    return this.setSelection({
      start: initialState.selection.start - prefixLength,
      end: initialState.selection.end - suffixLength,
    });
  }

  getState(): TextState {
    const textArea = this.textArea;

    return getStateFromTextArea(textArea);
  }

  moveCursorToTheEnd() {
    const textArea = this.textArea;

    textArea.focus();
    textArea.selectionEnd = textArea.selectionStart = textArea.value.length;
    return getStateFromTextArea(textArea);
  }
}
