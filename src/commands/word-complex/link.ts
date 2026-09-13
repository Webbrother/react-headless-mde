import { getSelectedText } from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

export class LinkCommand extends BaseCommand {
  do() {
    const textApi = this.textController;

    // Adjust the selection to encompass the whole word if the caret is inside one
    const wordSelectionState = textApi.selectWordByCursor();

    // Replaces the current selection with the link markup
    const state2 = textApi.replaceSelection(`[${getSelectedText(wordSelectionState)}](url)`);

    // Select the `url` placeholder so it can be replaced right away
    textApi.setSelection({
      start: state2.selection.end - 4,
      end: state2.selection.end - 1,
    });
  }
}
