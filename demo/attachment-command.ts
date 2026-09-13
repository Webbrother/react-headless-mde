import { BaseCommand } from '../src';

// A command with a context (issue #22): the executor `commands.attachment(upload)`
// is typed to require a Promise<string> argument — calling it without the argument
// is a compile-time error.
export class AttachmentCommand extends BaseCommand<Promise<string>> {
  async do(upload: Promise<string>) {
    const placeholder = '![Uploading...]()';

    // Insert the placeholder immediately so the upload is visible in the editor
    this.textController.replaceSelection(placeholder);

    try {
      const url = await upload;
      // no-op if the user edited the placeholder while the upload was in flight
      this.textController.replaceText(placeholder, `![](${url})`);
    } catch {
      this.textController.replaceText(placeholder, '![Upload failed]()');
    }
  }
}
