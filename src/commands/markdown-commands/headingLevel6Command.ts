import { Command } from '../command';
import { setHeader } from '../../helpers/headerHelpers';

export const headingLevel6Command: Command = {
  execute: ({ initialState, textApi }) => {
    setHeader(initialState, textApi, '###### ');
  },
};
