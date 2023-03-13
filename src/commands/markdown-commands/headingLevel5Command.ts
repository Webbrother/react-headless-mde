import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel5Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '##### ');
  },
};

export const headingLevel5 = commandsService.createCommandFn(headingLevel5Command);
