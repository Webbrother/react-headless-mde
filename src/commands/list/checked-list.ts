import { ListCommand } from './list-command';

export class CheckedListCommand extends ListCommand {
  protected getLinePrefix() {
    return '- [ ] ';
  }
}
