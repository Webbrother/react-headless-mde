import { type Command } from '../command';
import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getSelectedText,
  selectWord,
} from '../../helpers/textHelpers';
import { commandsService } from '../commands-service';

const codeBlockCommand: Command = {
  execute: ({ textApi, initialState }) => {
    // Adjust the selection to encompass the whole word if the caret is inside one
    const newSelectionRange = selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });
    const state1 = textApi.setSelection(newSelectionRange);

    // when there's no breaking line
    if (!getSelectedText(state1).includes('\n')) {
      textApi.replaceSelection(`\`${getSelectedText(state1)}\``);
      // Adjust the selection to not contain the **

      const selectionStart = state1.selection.start + 1;
      const selectionEnd = selectionStart + getSelectedText(state1).length;

      textApi.setSelection({
        start: selectionStart,
        end: selectionEnd,
      });
      return;
    }

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = Array(breaksBeforeCount + 1).join('\n');

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = Array(breaksAfterCount + 1).join('\n');

    textApi.replaceSelection(`${breaksBefore}\`\`\`\n${getSelectedText(state1)}\n\`\`\`${breaksAfter}`);

    const selectionStart = state1.selection.start + breaksBeforeCount + 4;
    const selectionEnd = selectionStart + getSelectedText(state1).length;

    textApi.setSelection({
      start: selectionStart,
      end: selectionEnd,
    });
  },
};

export const codeBlock = commandsService.createCommandFn(codeBlockCommand);
