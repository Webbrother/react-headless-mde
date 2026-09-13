// Main hook
import { useTextAreaMarkdownEditor } from './hooks/use-markdown-editor';

import { TextareaController } from './controllers/textarea-controller';
import type { TextController } from './types/text-controller';
import type { CommandClassMap, CommandConstructor, CommandExecutor, CommandExecutors } from './types/command';
// Helpers
import * as textHelpers from './utils/selection-and-text';
// Command base classes
import { BaseCommand } from './commands/base-command';
import { WrapCommand } from './commands/word/wrap-command';
import { LinePrefixCommand } from './commands/line/line-prefix-command';
import { ListCommand } from './commands/list/list-command';
// Commands
import { BoldCommand } from './commands/word/bold';
import { ItalicCommand } from './commands/word/italic';
import { StrikethroughCommand } from './commands/word/strikethrough';
import { CodeCommand } from './commands/word/code';
import { CodeBlockCommand } from './commands/word/code-block';
import { LinkCommand } from './commands/word-complex/link';
import { ImageCommand } from './commands/word-complex/image';
import { QuoteCommand } from './commands/line/quote';
import { HeadingLevel1Command } from './commands/line/heading-level1';
import { HeadingLevel2Command } from './commands/line/heading-level2';
import { HeadingLevel3Command } from './commands/line/heading-level3';
import { HeadingLevel4Command } from './commands/line/heading-level4';
import { HeadingLevel5Command } from './commands/line/heading-level5';
import { HeadingLevel6Command } from './commands/line/heading-level6';
import { UnorderedListCommand } from './commands/list/unordered-list';
import { OrderedListCommand } from './commands/list/ordered-list';
import { CheckedListCommand } from './commands/list/checked-list';

export {
  // Main hook
  useTextAreaMarkdownEditor,
  // Command base classes
  BaseCommand,
  WrapCommand,
  LinePrefixCommand,
  ListCommand,
  // commands
  BoldCommand,
  ItalicCommand,
  StrikethroughCommand,
  CodeCommand,
  CodeBlockCommand,
  LinkCommand,
  ImageCommand,
  QuoteCommand,
  HeadingLevel1Command,
  HeadingLevel2Command,
  HeadingLevel3Command,
  HeadingLevel4Command,
  HeadingLevel5Command,
  HeadingLevel6Command,
  UnorderedListCommand,
  OrderedListCommand,
  CheckedListCommand,
  // TextController
  type TextController,
  TextareaController,
  // Command types
  type CommandClassMap,
  type CommandConstructor,
  type CommandExecutor,
  type CommandExecutors,
  // Helpers
  textHelpers,
};
