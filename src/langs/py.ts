import * as vscode from "vscode";
import logger from '../logger';

import textCommentWalker, { NoHintError } from "../textWalker";
import useHint from "../useHint";
import useInlayHintsFor from "../useInlayHintsFor";

export default () => useInlayHintsFor(
  ["python"],
  textCommentWalker({
    wahtHint: useHint("python"),
    matchers: [
      [/^\s*#\s*(\^|_)(x\d*)?\?/gm, (endPos, match) => {
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
