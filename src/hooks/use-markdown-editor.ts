import type React from 'react';
import { useMemo, useRef } from 'react';
import { CommandController } from '../controllers/command-controller';
import { TextareaController } from '../controllers/textarea-controller';
import { type TextController } from '../types/text-controller';
import { type CommandMap } from '../types/command';

export interface UseTextAreaMarkdownEditorResult<CommandName extends string> {
  ref: React.RefObject<HTMLTextAreaElement>;
  textController: TextController;
  commandController: CommandController<CommandName>;
}

export interface UseTextAreaMarkdownEditorOptions<CommandName extends string> {
  commandMap: CommandMap<CommandName>;
}

export function useTextAreaMarkdownEditor<CommandName extends string>(
  options: UseTextAreaMarkdownEditorOptions<CommandName>,
): UseTextAreaMarkdownEditorResult<CommandName> {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return useMemo(() => {
    const textController = new TextareaController(textAreaRef);
    const commandController = new CommandController(textController, options.commandMap);

    return {
      ref: textAreaRef,
      textController,
      commandController,
    };
  }, [textAreaRef]);
}
