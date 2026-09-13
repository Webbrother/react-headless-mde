import { type TextState } from '../../types/text-controller';
import {
  getSelectedText,
  getStringAfterSelection,
  getStringBeforeSelection,
  getWordSelection,
} from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

// Base class for commands that wrap a word/selection with prefix and suffix: bold, italic etc.
export abstract class WrapCommand extends BaseCommand {
  protected abstract prefix: string;
  protected abstract suffix: string;

  do() {
    // Adjust the selection to encompass the whole word if the caret is inside one
    this.textController.selectWordByCursor();
    this.textController.wrapSelection(this.prefix, this.suffix);
  }

  shouldUndo() {
    const state = this.getWordSelectionState();

    return this.hasMarkersInside(getSelectedText(state)) || this.hasMarkersOutside(state);
  }

  undo() {
    const state = this.getWordSelectionState();
    const selectedText = getSelectedText(state);

    this.textController.setSelection(state.selection);

    if (!this.hasMarkersInside(selectedText)) {
      // The markers surround the selection: `**[word]**`
      this.textController.unwrapSelection(this.prefix.length, this.suffix.length);
      return;
    }

    // The markers are inside the selection — the caret is within `**wo|rd**`:
    // strip the markers from the edges of the selection
    const innerText = selectedText.slice(this.prefix.length, selectedText.length - this.suffix.length);
    const replacedState = this.textController.replaceSelection(innerText);

    this.textController.setSelection({
      start: replacedState.selection.end - innerText.length,
      end: replacedState.selection.end,
    });
  }

  private getWordSelectionState(): TextState {
    const state = this.textController.getState();

    return {
      text: state.text,
      selection: getWordSelection(state),
    };
  }

  private hasMarkersInside(selectedText: string): boolean {
    return (
      selectedText.length >= this.prefix.length + this.suffix.length &&
      selectedText.startsWith(this.prefix) &&
      selectedText.endsWith(this.suffix)
    );
  }

  private hasMarkersOutside({ text, selection }: TextState): boolean {
    const markersMatch =
      getStringBeforeSelection({ text, selection }, this.prefix.length) === this.prefix &&
      getStringAfterSelection({ text, selection }, this.suffix.length) === this.suffix;

    if (!markersMatch) return false;

    // The characters right next to the markers must not continue the marker sequence:
    // `*` around `[word]` inside `**word**` is bold, not italic
    const charBeforeMarkers = text[selection.start - this.prefix.length - 1];
    const charAfterMarkers = text[selection.end + this.suffix.length];

    return charBeforeMarkers !== this.prefix[0] && charAfterMarkers !== this.suffix[this.suffix.length - 1];
  }
}
