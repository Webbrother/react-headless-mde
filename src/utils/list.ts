import { type TextController, type TextState } from '../types/text-controller';

import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getSelectedText,
  insertBeforeEachLine,
  getWordSelection,
} from './selection-and-text';

export type AlterLineFunction = (line: string, index: number) => string;

export function makeList(state0: TextState, textController: TextController, insertBefore: string | AlterLineFunction) {
  // Adjust the selection to encompass the whole word if the caret is inside one
  const newSelectionRange = getWordSelection({
    text: state0.text,
    selection: state0.selection,
  });
  const state1 = textController.setSelection(newSelectionRange);

  const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
  const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

  const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
  const breaksAfter = Array(breaksAfterCount + 1).join('\n');

  const modifiedText = insertBeforeEachLine(getSelectedText(state1), insertBefore);

  textController.replaceSelection(`${breaksBefore}${modifiedText.modifiedText}${breaksAfter}`);

  // Specifically when the text has only one line, we can exclude the "- ", for example, from the selection
  const oneLinerOffset = !getSelectedText(state1).includes('\n') ? modifiedText.insertionLength : 0;

  const selectionStart = state1.selection.start + breaksBeforeCount + oneLinerOffset;
  const selectionEnd = selectionStart + modifiedText.modifiedText.length - oneLinerOffset;

  // Adjust the selection to not contain the **
  textController.setSelection({
    start: selectionStart,
    end: selectionEnd,
  });
}
