import { type TextController } from './text-controller';

export interface ICommand {
  do: (textCtrl: TextController) => void;
  shouldUndo?: (textCtrl: TextController) => boolean;
  undo?: (textCtrl: TextController) => void;
}

export type CommandMap<CommandName extends string> = Record<CommandName, ICommand>;
