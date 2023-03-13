import { type TextController, type TextState } from '../types/TextController';

export interface ExecuteOptions {
  initialState: TextState;
  textApi: TextController;
}

export interface Command<CommandContext = void> {
  execute: (options: ExecuteOptions, context: CommandContext) => void;
  shouldUndo?: (options: Pick<ExecuteOptions, 'initialState'>) => boolean;
  undo?: (options: ExecuteOptions) => void;
}
