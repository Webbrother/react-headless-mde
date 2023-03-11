import { type TextController, type TextState } from '../types/CommandOptions';

export interface ExecuteOptions {
  initialState: TextState;
  textApi: TextController;
}

export interface Command {
  execute: (options: ExecuteOptions) => void;
  shouldUndo?: (options: Pick<ExecuteOptions, 'initialState'>) => boolean;
  undo?: (options: ExecuteOptions) => void;
}

export interface CommandContext {
  type: string;
}

export type CommandMap<CommandName extends string> = Record<CommandName, Command>;
