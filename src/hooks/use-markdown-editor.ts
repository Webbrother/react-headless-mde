import type React from 'react';
import { useMemo, useRef } from 'react';
import { CommandController } from '../commands/command-controller';
import { TextAreaTextController } from '../text/textarea-text-controller';
import { type TextController } from '../types/TextController';
import { commandsService } from '../commands/commands-service';

export interface UseTextAreaMarkdownEditorResult {
  ref: React.RefObject<HTMLTextAreaElement>;
  textController: TextController;
}

export function useTextAreaMarkdownEditor(): UseTextAreaMarkdownEditorResult {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const textController = useMemo(() => {
    const textAreaController = new TextAreaTextController(textAreaRef);
    const commandController = new CommandController(textAreaController);

    commandsService.init(commandController, textAreaController);

    return textAreaController;
  }, [textAreaRef]);

  return {
    textController,
    ref: textAreaRef,
  };
}
