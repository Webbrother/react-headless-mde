import { type Command } from '../command';
import { getSelectedText, selectWord } from '../../helpers/textHelpers';
import { commandsService } from '../commands-service';

const imageCommand: Command = {
  execute: ({ initialState, textApi }) => {
    // Replaces the current selection with the whole word selected
    const state1 = textApi.setSelection(
      selectWord({
        text: initialState.text,
        selection: initialState.selection,
      }),
    );

    // Replaces the current selection with the image
    const imageTemplate = getSelectedText(state1) || 'https://example.com/your-image.png';

    textApi.replaceSelection(`![](${imageTemplate})`);

    // Adjust the selection to not contain the **
    textApi.setSelection({
      start: state1.selection.start + 4,
      end: state1.selection.start + 4 + imageTemplate.length,
    });
  },
};

export const image = commandsService.createCommandFn(imageCommand);
