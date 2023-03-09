/*
1. Вставить по курсору строку "![Uploading test 1.jpg…]()"

2. Т.к. юзер может менять текст в процессе загрузки найти эту строку и заменить на:
 ![test 2](https://user-images.githubusercontent.com/8310289/224096504-d9ad96ad-916e-482e-a6e1-a89146992ec2.jpg)
 file name   url

Если строка не найдена вставить ссылку в конец через пустую строку

Предусмотреть обработку ответа с бэка. Библиотека не знает ДТО ответа.
 */

import { type Command } from '../command';
import { selectAfterWord } from '../../helpers/textHelpers';

export const attachmentCommand: Command = {
  execute({ initialState, textApi }) {
    // Replaces the current selection with the empty selection and sets the position after word
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const state1 = textApi.setSelectionRange(
      selectAfterWord({
        text: initialState.text,
        selection: initialState.selection,
      }),
    );
  },
};
