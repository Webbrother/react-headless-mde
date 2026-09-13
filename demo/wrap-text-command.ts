import { BaseCommand } from '../src';

// A command with a simple context: the executor `commands.wrapText('!!!')`
// is typed to require a string argument — anything else is a compile-time error.
// The string is used as both the prefix and the suffix of the word at the caret.
export class WrapTextCommand extends BaseCommand<string> {
  do(marker: string) {
    // select the word under the caret (keeps an existing selection)
    this.textController.selectWordByCursor();

    this.textController.wrapSelection(marker, marker);
  }
}
