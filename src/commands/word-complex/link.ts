import { type ICommand } from '../../types/command';
import { getSelectedText } from '../../utils/selection-and-text';

export const linkCommand: ICommand = {
  do: textApi => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const wordSelectionState = textApi.selectWordByCursor();

    // Replaces the current selection with the bold mark up
    const state2 = textApi.replaceSelection(`[${getSelectedText(wordSelectionState)}](url)`);
    // Adjust the selection to not contain the **
    textApi.setSelection({
      start: state2.selection.end - 6 - getSelectedText(wordSelectionState).length,
      end: state2.selection.end - 6,
    });
  },
};
