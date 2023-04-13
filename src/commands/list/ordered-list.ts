import { type ICommand } from '../../types/command';
import { makeList } from '../../utils/list';

export const orderedListCommand: ICommand = {
  do: textApi => {
    const initialState = textApi.getState();
    makeList(initialState, textApi, (item, index) => `${index + 1}. `);
  },
};
