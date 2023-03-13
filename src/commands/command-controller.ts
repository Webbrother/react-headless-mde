import { type TextController } from '../types/TextController';
import { type Command } from './command';

export class CommandController {
  private readonly textController: TextController;

  constructor(textController: TextController) {
    this.textController = textController;
  }

  executeCommand<CommandContext = void>(command: Command<CommandContext>, context: CommandContext) {
    const executeOptions = {
      initialState: this.textController.getState(),
      textApi: this.textController,
    };

    if (command.undo && command.shouldUndo?.(executeOptions)) {
      command.undo(executeOptions);
    } else {
      command.execute(executeOptions, context);
    }
  }
}
