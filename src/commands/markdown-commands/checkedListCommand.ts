import { type Command } from '../command';
import { makeList } from '../../helpers/listHelpers';
import { commandsService } from '../commands-service';

const checkedListCommand: Command = {
  execute: ({ initialState, textApi }) => {
    makeList(initialState, textApi, () => `- [ ] `);
  },
};

export const checkedList = commandsService.createCommandFn(checkedListCommand);
