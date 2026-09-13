import { getLineSelection, getSelectedText, insertBeforeEachLine } from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

// Base class for line-level commands that prefix each selected line: quote, headings.
// The selection is expanded to cover the whole lines it touches.
// Executing the command on already prefixed lines removes the prefixes (undo).
export abstract class LinePrefixCommand extends BaseCommand {
  protected abstract prefix: string;

  do() {
    const state = this.textController.getState();
    const state1 = this.textController.setSelection(getLineSelection(state));

    const selectedText = getSelectedText(state1);
    const { modifiedText } = insertBeforeEachLine(selectedText, this.prefix);
    const state2 = this.textController.replaceSelection(modifiedText);

    // For a single line select the content without the prefix,
    // for multiple lines select the whole modified block
    const prefixOffset = selectedText.includes('\n') ? 0 : this.prefix.length;

    this.textController.setSelection({
      start: state2.selection.end - modifiedText.length + prefixOffset,
      end: state2.selection.end,
    });
  }

  shouldUndo() {
    const state = this.textController.getState();
    const selectedText = getSelectedText({
      text: state.text,
      selection: getLineSelection(state),
    });

    return selectedText.split('\n').every(line => line.startsWith(this.prefix));
  }

  undo() {
    const state = this.textController.getState();
    const state1 = this.textController.setSelection(getLineSelection(state));

    const modifiedText = getSelectedText(state1)
      .split('\n')
      .map(line => (line.startsWith(this.prefix) ? line.slice(this.prefix.length) : line))
      .join('\n');

    this.textController.replaceSelection(modifiedText);

    // Select the content of the un-prefixed line(s)
    this.textController.setSelection({
      start: state1.selection.start,
      end: state1.selection.start + modifiedText.length,
    });
  }
}
