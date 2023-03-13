import { type Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';
import { commandsService } from '../commands-service';

const headingLevel4Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '#### ');
  },
};

export const headingLevel4 = commandsService.createCommandFn(headingLevel4Command);
