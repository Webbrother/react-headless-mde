import { type TextController, type TextState } from '../types/text-controller';
import { getSelectedText, getWordSelection } from './selection-and-text';

export function setHeader(initialState: TextState, api: TextController, prefix: string) {
  // Adjust the selection to encompass the whole word if the caret is inside one
  const newSelectionRange = getWordSelection({
    text: initialState.text,
    selection: initialState.selection,
  });
  const state1 = api.setSelection(newSelectionRange);
  // Add the prefix to the selection
  const state2 = api.replaceSelection(`${prefix}${getSelectedText(state1)}`);
  // Adjust the selection to not contain the prefix
  api.setSelection({
    start: state2.selection.end - getSelectedText(state1).length,
    end: state2.selection.end,
  });
}
