import * as vscode from "vscode";
import logger from '../logger';

import textCommentWalker, { NoHintError } from "../textWalker";
import useHint from "../useHint";
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
    wahtHint: useHint("go"),
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
