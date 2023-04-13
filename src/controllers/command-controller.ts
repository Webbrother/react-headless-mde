import { type TextController } from '../types/text-controller';
import { type CommandMap } from '../types/command';

export class CommandController<CommandName extends string> {
  private readonly textController: TextController;
  private readonly commandMap: CommandMap<CommandName>;

  constructor(textController: TextController, commandMap: CommandMap<CommandName>) {
    this.textController = textController;
    this.commandMap = commandMap;
  }

  executeCommand(commandName: CommandName) {
    const command = this.commandMap[commandName];

    if (!command) {
      throw new Error(`Cannot execute command. Command not found: ${commandName}`);
    }

    if (command.undo && command.shouldUndo?.(this.textController)) {
      command.undo(this.textController);
    } else {
      command.do(this.textController);
    }
  }
}
