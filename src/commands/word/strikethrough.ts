import { WrapCommand } from './wrap-command';

export class StrikethroughCommand extends WrapCommand {
  protected prefix = '~~';
  protected suffix = '~~';
}
