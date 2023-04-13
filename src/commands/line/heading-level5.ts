import { type ICommand } from '../../types/command';
import { setHeader } from '../../utils/header';

export const headingLevel5Command: ICommand = {
  do: textCtrl => {
    const initialState = textCtrl.getState();

    setHeader(initialState, textCtrl, '##### ');
  },
};
