import { type Command } from '../command';
import { makeList } from '../../helpers/listHelpers';
import { commandsService } from '../commands-service';

const unorderedListCommand: Command = {
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, '- ');
  },
};

export const unorderedList = commandsService.createCommandFn(unorderedListCommand);
