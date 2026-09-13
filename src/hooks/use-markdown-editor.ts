import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { type BaseCommand } from '../commands/base-command';
import { TextareaController } from '../controllers/textarea-controller';
import { type CommandClassMap, type CommandExecutors } from '../types/command';
import { type TextController } from '../types/text-controller';

export interface UseTextAreaMarkdownEditorOptions<M extends CommandClassMap> {
  // Maps command names (camelCase) to command classes:
  //   { bold: BoldCommand, attachment: AttachmentCommand }
  commandMap: M;
}

export interface UseTextAreaMarkdownEditorResult<M extends CommandClassMap> {
  ref: React.RefObject<HTMLTextAreaElement>;
  textController: TextController;
  // Callable commands with typed signatures:
  // a command without a context is called without arguments,
  // a command with a context requires the context argument
  commands: CommandExecutors<M>;
}

export function useTextAreaMarkdownEditor<M extends CommandClassMap>(
  options: UseTextAreaMarkdownEditorOptions<M>,
): UseTextAreaMarkdownEditorResult<M> {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Always execute commands from the most recent render
  const commandMapRef = useRef(options.commandMap);
  useEffect(() => {
    commandMapRef.current = options.commandMap;
  });

  // Command instances persist between executor rebuilds
  const instancesRef = useRef(new Map<string, BaseCommand<unknown>>());

  // Rebuild the executors object only when the set of command names changes,
  // so `commands` (and each executor) stays referentially stable between renders
  const commandNames = Object.keys(options.commandMap).sort().join('\0');

  return useMemo(() => {
    const textController = new TextareaController(textAreaRef);
    const instances = instancesRef.current;

    const executors: Record<string, (context?: unknown) => void> = {};

    for (const name of commandNames.split('\0')) {
      if (name === '') continue;
      executors[name] = (context?: unknown) => {
        const CommandClass = commandMapRef.current[name];

        if (CommandClass === undefined) {
          throw new Error(`Cannot execute command. Command not found: ${name}`);
        }

        let instance = instances.get(name);

        if (instance === undefined || instance.constructor !== CommandClass) {
          instance = new CommandClass(textController);
          instances.set(name, instance);
        }

        if (instance.undo !== undefined && instance.shouldUndo?.(context) === true) {
          instance.undo(context);
        } else {
          instance.do(context);
        }
      };
    }

    return {
      ref: textAreaRef,
      textController,
      commands: executors as CommandExecutors<M>,
    };
  }, [commandNames]);
}
