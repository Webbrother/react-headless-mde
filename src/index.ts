// Main hook
import { useTextAreaMarkdownEditor } from './hooks/use-markdown-editor';
// Commands
import { bold } from './commands/markdown-commands/boldCommand';
import { italic } from './commands/markdown-commands/italicCommand';
import { strikethrough } from './commands/markdown-commands/strikethroughCommand';
import { link } from './commands/markdown-commands/linkCommand';
import { quote } from './commands/markdown-commands/quoteCommand';
import { image } from './commands/markdown-commands/imageCommand';
import { code } from './commands/markdown-commands/codeCommand';
import { codeBlock } from './commands/markdown-commands/codeBlockCommand';
import { checkedList } from './commands/markdown-commands/checkedListCommand';
import { orderedList } from './commands/markdown-commands/orderedListCommand';
import { unorderedList } from './commands/markdown-commands/unorderedListCommand';
import { headingLevel1 } from './commands/markdown-commands/headingLevel1Command';
import { headingLevel2 } from './commands/markdown-commands/headingLevel2Command';
import { headingLevel3 } from './commands/markdown-commands/headingLevel3Command';
import { headingLevel4 } from './commands/markdown-commands/headingLevel4Command';
import { headingLevel5 } from './commands/markdown-commands/headingLevel5Command';
import { headingLevel6 } from './commands/markdown-commands/headingLevel6Command';
import { attachment } from './commands/markdown-commands/attachmentCommand';
// TextController
import { TextAreaTextController } from './text/textarea-text-controller';
import type { TextController } from './types/TextController';
// Helpers
import * as textHelpers from './helpers/textHelpers';
import * as listHelpers from './helpers/listHelpers';
import * as headerHelpers from './helpers/headerHelpers';

export {
  // Helpers
  textHelpers,
  listHelpers,
  headerHelpers,
  // TextController
  type TextController,
  TextAreaTextController,
  // Commands
  bold,
  italic,
  strikethrough,
  link,
  quote,
  code,
  codeBlock,
  checkedList,
  orderedList,
  unorderedList,
  image,
  headingLevel1,
  headingLevel2,
  headingLevel3,
  headingLevel4,
  headingLevel5,
  headingLevel6,
  attachment,
  // Main hook
  useTextAreaMarkdownEditor,
};
