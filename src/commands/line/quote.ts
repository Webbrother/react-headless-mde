import { LinePrefixCommand } from './line-prefix-command';

export class QuoteCommand extends LinePrefixCommand {
  protected prefix = '> ';
}
