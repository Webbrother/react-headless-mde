import { type ICommand } from '../../types/command';
import { getStringAfterSelection, getStringBeforeSelection } from '../../utils/selection-and-text';

export const codeCommand: ICommand = {
  shouldUndo: textCtrl => {
    const wordSelectionState = textCtrl.selectWordByCursor();

    return (
      getStringBeforeSelection(wordSelectionState, 1) === '`' && getStringAfterSelection(wordSelectionState, 1) === '`'
    );
  },

  do(textCtrl) {
    textCtrl.wrapSelection('`', '`');
  },

  undo(textCtrl) {
    textCtrl.unwrapSelection(1, 1);
  },
};
