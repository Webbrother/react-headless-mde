import { TextareaController } from './controllers/textarea-controller';
import { type SelectionRange } from './types/text-controller';

/**
 * jsdom does not implement document.execCommand, so `insertToSelection`
 * falls back to `setRangeText` only if execCommand exists and returns false.
 */
export function stubExecCommand() {
  (document as any).execCommand = jest.fn(() => false);
}

export function cleanupExecCommand() {
  delete (document as any).execCommand;
}

export function createTextarea(text = '', selection?: SelectionRange) {
  stubExecCommand();

  const textArea = document.createElement('textarea');
  document.body.appendChild(textArea);
  textArea.value = text;

  const controller = new TextareaController({ current: textArea });

  if (selection) {
    controller.setSelection(selection);
  }

  return { textArea, controller };
}
