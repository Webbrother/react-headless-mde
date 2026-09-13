import { ListCommand } from './list-command';

export class OrderedListCommand extends ListCommand {
  protected getLinePrefix(_line: string, index: number) {
    return `${index + 1}. `;
  }
}
