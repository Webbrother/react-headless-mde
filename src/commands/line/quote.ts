import { type ICommand } from '../../types/command';
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getSelectedText,
} from '../../utils/selection-and-text';

// Todo: try to rewrite with setHeader()
export const quoteCommand: ICommand = {
  do: textApi => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const state = textApi.selectWordByCursor();

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state.text, state.selection.start);
    const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state.text, state.selection.end);
    const breaksAfter = Array(breaksAfterCount + 1).join('\n');

    // Replaces the current selection with the quote mark up
    textApi.replaceSelection(`${breaksBefore}> ${getSelectedText(state)}${breaksAfter}`);

    const selectionStart = state.selection.start + breaksBeforeCount + 2;
    const selectionEnd = selectionStart + getSelectedText(state).length;

    textApi.setSelection({
      start: selectionStart,
      end: selectionEnd,
    });
  },
};
