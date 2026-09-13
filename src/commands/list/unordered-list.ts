import { ListCommand } from './list-command';

export class UnorderedListCommand extends ListCommand {
  protected getLinePrefix() {
    return '- ';
  }
}
