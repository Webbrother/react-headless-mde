import { WrapCommand } from './wrap-command';

export class BoldCommand extends WrapCommand {
  protected prefix = '**';
  protected suffix = '**';
}
