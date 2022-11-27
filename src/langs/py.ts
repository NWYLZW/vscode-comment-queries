import * as vscode from "vscode";
import logger from '../logger';

import textCommentWalker, { NoHintError } from "../textWalker";
import useInlayHintsFor from "../useInlayHintsFor";

export default () => useInlayHintsFor(
  ["python"],
  textCommentWalker({
    async wahtHint({
      scheme,
      fsPath,
      authority,
      path
    }, hintPos) {
      // logger.log(
      //   (await vscode.commands.getCommands()).filter(s => s.startsWith('pylance')),
      //   (await vscode.commands.getCommands()).filter(s => s.startsWith('pyright')),
      //   (await vscode.commands.getCommands()).filter(s => s.startsWith('py'))
      // );
      // console.log(
      //   vscode.extensions.all.filter(e => e.id.includes('py'))
      // );
      // const hint = await vscode.commands.executeCommand(
      //   "typescript.tsserverRequest",
      //   "quickinfo",
      //   {
      //     // @ts-ignore
      //     __: 'vscode-comment-queries',
      //     file: scheme === 'file' ? fsPath : `^/${scheme}/${authority || 'ts-nul-authority'}/${path.replace(/^\//, '')}`,
      //     line: hintPos.line + 1,
      //     offset: hintPos.character,
      //   } as ts.server.protocol.QuickInfoRequest['arguments']
      // ) as ts.server.protocol.QuickInfoResponse;

      // if (!hint || !hint.body) {
      //   throw new NoHintError();
      // }

      return 'not supported';
    },
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
