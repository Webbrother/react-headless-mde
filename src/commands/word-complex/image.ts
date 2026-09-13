import { getSelectedText } from '../../utils/selection-and-text';
import { BaseCommand } from '../base-command';

export class ImageCommand extends BaseCommand {
  do() {
    const textApi = this.textController;

    // Adjust the selection to encompass the whole word if the caret is inside one
    const wordSelectionState = textApi.selectWordByCursor();

    // Replaces the current selection with the image
    const imageTemplate = getSelectedText(wordSelectionState) || 'https://example.com/your-image.png';

    textApi.replaceSelection(`![](${imageTemplate})`);

    // Select the image url so it can be replaced right away
    textApi.setSelection({
      start: wordSelectionState.selection.start + 4,
      end: wordSelectionState.selection.start + 4 + imageTemplate.length,
    });
  }
}
