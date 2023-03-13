import { type CommandController } from './command-controller';
import { type TextController } from '../types/TextController';
import { type Command } from './command';

class CommandsService {
  private commandController: CommandController | null = null;
  private textController: TextController | null = null;

  init(commandController: CommandController, textController: TextController) {
    this.commandController = commandController;
    this.textController = textController;
  }

  createCommandFn<CommandContext = void>(command: Command<CommandContext>) {
    return (context: CommandContext) => {
      if (!this.commandController) {
        throw new Error('Cannot execute command. CommandsService is not initialized');
      }

      this.commandController.executeCommand<CommandContext>(command, context);
    };
  }
}

export const commandsService = new CommandsService();
