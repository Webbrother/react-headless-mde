import { type SelectionRange, type TextController, type TextState } from '../types/TextController';
import { type RefObject } from 'react';
import { insertToSelection } from '../utils/insert-text-to-selection';

function getStateFromTextArea(textArea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
    },
    text: textArea.value,
  };
}

export class TextAreaTextController implements TextController {
  textAreaRef: RefObject<HTMLTextAreaElement>;

  constructor(textAreaRef: RefObject<HTMLTextAreaElement>) {
    this.textAreaRef = textAreaRef;
  }

  getTextArea() {
    const textArea = this.textAreaRef.current;
    if (!textArea) {
      throw new Error('TextAreaRef is not set');
    }

    return textArea;
  }

  setSelection(selection: SelectionRange): TextState {
    const textArea = this.getTextArea();

    textArea.focus();
    textArea.selectionStart = selection.start;
    textArea.selectionEnd = selection.end;
    return getStateFromTextArea(textArea);
  }

  replaceSelection(text: string): TextState {
    const textArea = this.getTextArea();

    insertToSelection(textArea, text);
    return getStateFromTextArea(textArea);
  }

  replaceText(searchString: string, replaceString: string): TextState {
    const textArea = this.getTextArea();
    const startIndex = textArea.value.indexOf(searchString);

    if (startIndex === -1) return getStateFromTextArea(textArea);

    this.setSelection({ start: startIndex, end: startIndex + searchString.length });
    this.replaceSelection(replaceString);

    return getStateFromTextArea(textArea);
  }

  getState(): TextState {
    const textArea = this.getTextArea();

    return getStateFromTextArea(textArea);
  }

  moveCursorToTheEnd() {
    const textArea = this.getTextArea();

    textArea.focus();
    textArea.selectionEnd = textArea.selectionStart = textArea.value.length;
    return getStateFromTextArea(textArea);
  }
}
