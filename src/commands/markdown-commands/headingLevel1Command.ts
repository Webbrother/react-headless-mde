import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel1Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '# ');
  },
};

export const headingLevel1 = commandsService.createCommandFn(headingLevel1Command);
