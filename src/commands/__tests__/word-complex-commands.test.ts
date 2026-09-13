import { cleanupExecCommand, createTextarea } from '../../test-utils';
import { ImageCommand } from '../word-complex/image';
import { LinkCommand } from '../word-complex/link';

afterEach(() => {
  cleanupExecCommand();
  document.body.innerHTML = '';
});

describe('LinkCommand', () => {
  it('converts the selected text into a link and selects the url placeholder', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 6, end: 11 });

    new LinkCommand(controller).do();

    expect(textArea.value).toBe('hello [world](url)');
    expect(textArea.selectionStart).toBe(14);
    expect(textArea.selectionEnd).toBe(17);
    expect(textArea.value.slice(textArea.selectionStart, textArea.selectionEnd)).toBe('url');
  });

  it('selects the word at the caret when nothing is selected', () => {
    const { textArea, controller } = createTextarea('hello world', { start: 7, end: 7 });

    new LinkCommand(controller).do();

    expect(textArea.value).toBe('hello [world](url)');
    expect(textArea.selectionStart).toBe(14);
    expect(textArea.selectionEnd).toBe(17);
  });

  it('inserts an empty link template into an empty textarea', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new LinkCommand(controller).do();

    expect(textArea.value).toBe('[](url)');
    expect(textArea.selectionStart).toBe(3);
    expect(textArea.selectionEnd).toBe(6);
  });
});

describe('ImageCommand', () => {
  it('inserts the default image template into an empty textarea and selects the url', () => {
    const { textArea, controller } = createTextarea('', { start: 0, end: 0 });

    new ImageCommand(controller).do();

    const template = 'https://example.com/your-image.png';
    expect(textArea.value).toBe(`![](${template})`);
    expect(textArea.selectionStart).toBe(4);
    expect(textArea.selectionEnd).toBe(4 + template.length);
  });

  it('uses the selected text as the image url', () => {
    const { textArea, controller } = createTextarea('my cat', { start: 3, end: 6 });

    new ImageCommand(controller).do();

    expect(textArea.value).toBe('my ![](cat)');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(10);
  });

  it('selects the word at the caret when nothing is selected', () => {
    const { textArea, controller } = createTextarea('my cat', { start: 4, end: 4 });

    new ImageCommand(controller).do();

    expect(textArea.value).toBe('my ![](cat)');
    expect(textArea.selectionStart).toBe(7);
    expect(textArea.selectionEnd).toBe(10);
  });
});
