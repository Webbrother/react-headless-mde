import { type Command } from '../command';
import { makeList } from '../../helpers/listHelpers';
import { commandsService } from '../commands-service';

const orderedListCommand: Command = {
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, (item, index) => `${index + 1}. `);
  },
};

export const orderedList = commandsService.createCommandFn(orderedListCommand);
