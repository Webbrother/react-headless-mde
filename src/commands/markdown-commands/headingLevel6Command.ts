import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel6Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '###### ');
  },
};

export const headingLevel6 = commandsService.createCommandFn(headingLevel6Command);
