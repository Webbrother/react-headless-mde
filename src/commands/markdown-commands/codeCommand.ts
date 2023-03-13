import { type Command } from '../command';
import {
  getCharactersAfterSelection,
  getCharactersBeforeSelection,
  getSelectedText,
  selectWord,
} from '../../helpers/textHelpers';
import { commandsService } from '../commands-service';

const codeCommand: Command = {
  shouldUndo: options => {
    return (
      getCharactersBeforeSelection(options.initialState, 1) === '`' &&
      getCharactersAfterSelection(options.initialState, 1) === '`'
    );
  },
  execute: ({ initialState, textApi }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelection(newSelectionRange);
    // Replaces the current selection with the italic mark up
    const state2 = textApi.replaceSelection(`\`${getSelectedText(state1)}\``);
    // Adjust the selection to not contain the *
    textApi.setSelection({
      start: state2.selection.end - 1 - getSelectedText(state1).length,
      end: state2.selection.end - 1,
    });
  },
  undo: ({ initialState, textApi }) => {
    const text = getSelectedText(initialState);
    textApi.setSelection({
      start: initialState.selection.start - 1,
      end: initialState.selection.end + 1,
    });
    textApi.replaceSelection(text);
    textApi.setSelection({
      start: initialState.selection.start - 1,
      end: initialState.selection.end - 1,
    });
  },
};

export const code = commandsService.createCommandFn(codeCommand);
