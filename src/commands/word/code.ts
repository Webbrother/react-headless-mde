import { WrapCommand } from './wrap-command';

export class CodeCommand extends WrapCommand {
  protected prefix = '`';
  protected suffix = '`';
}
