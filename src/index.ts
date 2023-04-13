// Main hook
import { useTextAreaMarkdownEditor } from './hooks/use-markdown-editor';

import { TextareaController } from './controllers/textarea-controller';
import type { TextController } from './types/text-controller';
// Helpers
import * as textHelpers from './utils/selection-and-text';
import * as listHelpers from './utils/list';
import * as headerHelpers from './utils/header';
import { boldCommand } from './commands/word/bold';
import { italicCommand } from './commands/word/italic';
import { strikethroughCommand } from './commands/word/strikethrough';
import { linkCommand } from './commands/word-complex/link';
import { quoteCommand } from './commands/line/quote';
import { codeCommand } from './commands/word/code';
import { codeBlockCommand } from './commands/word/code-block';
import { checkedListCommand } from './commands/list/checked-list';
import { orderedListCommand } from './commands/list/ordered-list';
import { unorderedListCommand } from './commands/list/unordered-list';
import { imageCommand } from './commands/word-complex/image';
import { headingLevel1Command } from './commands/line/heading-level1';
import { headingLevel2Command } from './commands/line/heading-level2';
import { headingLevel3Command } from './commands/line/heading-level3';
import { headingLevel4Command } from './commands/line/heading-level4';
import { headingLevel5Command } from './commands/line/heading-level5';
import { headingLevel6Command } from './commands/line/heading-level6';

export {
  // Main hook
  useTextAreaMarkdownEditor,
  // commands
  boldCommand,
  italicCommand,
  strikethroughCommand,
  linkCommand,
  quoteCommand,
  codeCommand,
  codeBlockCommand,
  checkedListCommand,
  orderedListCommand,
  unorderedListCommand,
  imageCommand,
  headingLevel1Command,
  headingLevel2Command,
  headingLevel3Command,
  headingLevel4Command,
  headingLevel5Command,
  headingLevel6Command,
  // TextController
  type TextController,
  TextareaController,
  // Helpers
  textHelpers,
  listHelpers,
  headerHelpers,
};
