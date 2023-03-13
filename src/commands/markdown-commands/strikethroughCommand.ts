import { type Command } from '../command';
import { getSelectedText, selectWord } from '../../helpers/textHelpers';
import { commandsService } from '../commands-service';

const strikethroughCommand: Command = {
  execute: ({ initialState, textApi }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelection(newSelectionRange);
    // Replaces the current selection with the strikethrough mark up
    const state2 = textApi.replaceSelection(`~~${getSelectedText(state1)}~~`);
    // Adjust the selection to not contain the ~~
    textApi.setSelection({
      start: state2.selection.end - 2 - getSelectedText(state1).length,
      end: state2.selection.end - 2,
    });
  },
};

export const strikethrough = commandsService.createCommandFn(strikethroughCommand);
