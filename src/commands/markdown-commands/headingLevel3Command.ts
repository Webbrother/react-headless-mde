import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel3Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '### ');
  },
};

export const headingLevel3 = commandsService.createCommandFn(headingLevel3Command);
