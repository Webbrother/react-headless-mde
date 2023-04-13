import { type ICommand } from '../../types/command';
import { makeList } from '../../utils/list';

export const unorderedListCommand: ICommand = {
  do: textApi => {
    const initialState = textApi.getState();
    makeList(initialState, textApi, '- ');
  },
};
