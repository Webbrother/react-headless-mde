import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel2Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '## ');
  },
};

export const headingLevel2 = commandsService.createCommandFn(headingLevel2Command);
