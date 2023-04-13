import { type ICommand } from '../../types/command';
import { makeList } from '../../utils/list';

export const checkedListCommand: ICommand = {
  do: textApi => {
    const initialState = textApi.getState();
    makeList(initialState, textApi, () => `- [ ] `);
  },
};
