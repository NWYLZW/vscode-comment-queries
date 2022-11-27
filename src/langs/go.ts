import * as vscode from "vscode";
import logger from '../logger';

import textCommentWalker, { NoHintError } from "../textWalker";
import useInlayHintsFor from "../useInlayHintsFor";

// export interface CommandInvocation {
// 	binPath: string;
// 	args?: string[];
// 	env?: Object;
// 	cwd?: string;
// }

// interface GoExports {
//   settrings: {
//     getExecutionCommand: (toolName: string, resource: vscode.Uri) => CommandInvocation | undefined;
//   };
// }

// async function getQuickInfoBy() {
//   const go = vscode.extensions.getExtension("golang.go");
//   if (!go) {
//     throw new NoHintError();
//   }
//   if (!go.isActive) {
//     await go.activate();
//   }
//   const goExports = go.exports as GoExports;
// }

export default () => useInlayHintsFor(
  ["go"],
  textCommentWalker({
    async wahtHint(uri, hintPos) {
      const [hover, ...rest] = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        uri,
        hintPos
      );
      if (!hover) {
        throw new NoHintError();
      }
      let hoverContent = '';
      const { contents: [content, ...restContent] = [] } = hover;
      if (typeof content !== 'string') {
        hoverContent = content.value;
      } else {
        hoverContent = content;
      }
      /**
       * hover content is like:
       * ```go
       * func fmt.Println(a ...interface{}) (n int, err error)
       * ```
       * so we need to get the first line
       */
      const [, hint] = /`{3}go[\n]+(.*[\n]+)`{3}/gs.exec(hoverContent) || [];

      return hint?.trim() ?? 'no hint';
    },
    matchers: [
      [/^\s*\/\/\s*(\^|_)(x\d*)?\?/gm, (endPos, match) => {
        const [, lineOffset] = match[2]?.match(/x(\d*)/) ?? [, '1'];

        return [endPos, new vscode.Position(
          endPos.line + ({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '^': -1 * Number(lineOffset),
            '_': 1  * Number(lineOffset),
          }[match[1] as '^' | '_']),
          endPos.character
        )];
      }],
    ],
  }),
);
