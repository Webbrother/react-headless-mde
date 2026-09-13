import { type TextController } from '../types/text-controller';

/**
 * Base class for all commands.
 *
 * `Context` is the type of the value that must be passed when the command is executed.
 * Commands without a context extend `BaseCommand` (Context = void) and are executed
 * without arguments; commands with a context extend `BaseCommand<Context>` and require
 * an argument of that type:
 *
 * class AttachmentCommand extends BaseCommand<Promise<string>> {
 *   async do(upload: Promise<string>) {
 *     const url = await upload;
 *     this.textController.replaceSelection(`![](${url})`);
 *   }
 * }
 */
export abstract class BaseCommand<Context = void> {
  // Phantom field used only for Context type inference (see types/command.ts).
  // `declare` — no runtime footprint.
  declare protected readonly __contextType?: Context;

  constructor(protected readonly textController: TextController) {}

  abstract do(context: Context): void;

  shouldUndo?(context: Context): boolean;

  undo?(context: Context): void;
}
