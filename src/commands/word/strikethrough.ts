import { type ICommand } from '../../types/command';
import { getStringAfterSelection, getStringBeforeSelection } from '../../utils/selection-and-text';

export const strikethroughCommand: ICommand = {
  shouldUndo(textCtrl) {
    const wordSelectionState = textCtrl.selectWordByCursor();

    return (
      getStringBeforeSelection(wordSelectionState, 2) === '~~' &&
      getStringAfterSelection(wordSelectionState, 2) === '~~'
    );
  },

  do(textCtrl) {
    textCtrl.wrapSelection('~~', '~~');
  },

  undo(textCtrl) {
    textCtrl.unwrapSelection(2, 2);
  },
};
