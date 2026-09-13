import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getSelectedText,
} from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

export class CodeBlockCommand extends BaseCommand {
  do() {
    const textApi = this.textController;

    // Adjust the selection to encompass the whole word if the caret is inside one
    const state1 = textApi.selectWordByCursor();
    const selectedText = getSelectedText(state1);

    // when there's no breaking line — inline code
    if (!selectedText.includes('\n')) {
      textApi.replaceSelection(`\`${selectedText}\``);

      textApi.setSelection({
        start: state1.selection.start + 1,
        end: state1.selection.start + 1 + selectedText.length,
      });
      return;
    }

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = '\n'.repeat(breaksBeforeCount);

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = '\n'.repeat(breaksAfterCount);

    textApi.replaceSelection(`${breaksBefore}\`\`\`\n${selectedText}\n\`\`\`${breaksAfter}`);

    const selectionStart = state1.selection.start + breaksBeforeCount + 4;

    textApi.setSelection({
      start: selectionStart,
      end: selectionStart + selectedText.length,
    });
  }
}
