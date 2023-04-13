import { type ICommand } from '../../types/command';
import { getSelectedText } from '../../utils/selection-and-text';

export const imageCommand: ICommand = {
  do: textApi => {
    // Replaces the current selection with the whole word selected
    const wordSelectionState = textApi.selectWordByCursor();

    // Replaces the current selection with the image
    const imageTemplate = getSelectedText(wordSelectionState) || 'https://example.com/your-image.png';

    textApi.replaceSelection(`![](${imageTemplate})`);

    // Adjust the selection to not contain the **
    textApi.setSelection({
      start: wordSelectionState.selection.start + 4,
      end: wordSelectionState.selection.start + 4 + imageTemplate.length,
    });
  },
};
