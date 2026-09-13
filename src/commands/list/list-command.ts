import {
  getBreaksNeededForEmptyLineAfter,
  getBreaksNeededForEmptyLineBefore,
  getLineSelection,
  getSelectedText,
  insertBeforeEachLine,
} from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

// Base class for list commands. Each selected line becomes a list item.
// The selection is expanded to cover the whole lines it touches; when a list is
// inserted in the middle of a paragraph, it is separated by empty lines.
export abstract class ListCommand extends BaseCommand {
  protected abstract getLinePrefix(line: string, index: number): string;

  do() {
    const state0 = this.textController.getState();
    const state1 = this.textController.setSelection(getLineSelection(state0));

    const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(state1.text, state1.selection.start);
    const breaksBefore = '\n'.repeat(breaksBeforeCount);

    const breaksAfterCount = getBreaksNeededForEmptyLineAfter(state1.text, state1.selection.end);
    const breaksAfter = '\n'.repeat(breaksAfterCount);

    const selectedText = getSelectedText(state1);
    const { modifiedText } = insertBeforeEachLine(selectedText, (line, index) => this.getLinePrefix(line, index));

    this.textController.replaceSelection(`${breaksBefore}${modifiedText}${breaksAfter}`);

    // For a single line select the content without the prefix,
    // for multiple lines select the whole modified block
    const prefixOffset = selectedText.includes('\n') ? 0 : this.getLinePrefix('', 0).length;
    const blockStart = state1.selection.start + breaksBeforeCount;

    this.textController.setSelection({
      start: blockStart + prefixOffset,
      end: blockStart + modifiedText.length,
    });
  }
}
