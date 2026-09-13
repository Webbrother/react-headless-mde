import { type BaseCommand } from '../commands/base-command';
import { type TextController } from './text-controller';

// A concrete (new-able) command class
export type CommandConstructor<Context = unknown> = new (textController: TextController) => BaseCommand<Context>;

export type CommandClassMap = Record<string, CommandConstructor>;

type ContextOf<T extends CommandConstructor> = InstanceType<T> extends BaseCommand<infer Context> ? Context : never;

// A command without a context is executed without arguments,
// a command with a context requires the context argument:
//   CommandExecutor<typeof BoldCommand>        // () => void
//   CommandExecutor<typeof AttachmentCommand>  // (context: Promise<string>) => void
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- void marks commands without a context
export type CommandExecutor<T extends CommandConstructor> = [ContextOf<T>] extends [void]
  ? () => void
  : (context: ContextOf<T>) => void;

export type CommandExecutors<M extends CommandClassMap> = {
  [K in keyof M]: CommandExecutor<M[K]>;
};
