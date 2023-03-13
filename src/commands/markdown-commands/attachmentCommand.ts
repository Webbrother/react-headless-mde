import { type Command } from '../command';
import { selectAfterWord } from '../../helpers/textHelpers';
import { commandsService } from '../commands-service';

interface AttachmentCommandContext {
  fileName: string;
  fileUrlPromise: Promise<string>;
}

// attachmentCommand does to following:
// 1. Sets cursor to the end of word
// 2. Inserts string "![Uploading test 1.jpg…]()"
// 3. When request is fulfilled replace "![Uploading test 1.jpg…]()" with real markdown url
// or add the markdown url to the end of text
// 4. If request is failed delete "![Uploading test 1.jpg…]()" and console.error
const attachmentCommand: Command<AttachmentCommandContext> = {
  execute({ initialState, textApi }, { fileName, fileUrlPromise }) {
    // Replaces the current selection with the empty selection
    // and sets the cursor position to the end of the word
    textApi.setSelection(
      selectAfterWord({
        text: initialState.text,
        selection: initialState.selection,
      }),
    );

    const uploadingString = `![Uploading ${fileName}…]()`;
    textApi.replaceSelection(' ' + uploadingString);

    fileUrlPromise
      .then(url => {
        const fileLinkString = `![${fileName}…](${url})`;

        if (textApi.getState().text.includes(uploadingString)) {
          textApi.replaceText(uploadingString, fileLinkString);
        } else {
          textApi.moveCursorToTheEnd();
          textApi.replaceSelection(`\n${fileLinkString}`);
        }
      })
      .catch(error => {
        if (textApi.getState().text.includes(uploadingString)) {
          textApi.replaceText(uploadingString, '');
        }
        console.error(error);
      });
  },
};

export const attachment = commandsService.createCommandFn<AttachmentCommandContext>(attachmentCommand);
