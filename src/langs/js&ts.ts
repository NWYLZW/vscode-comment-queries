import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

import textCommentWalker, { NoHintError } from "../textWalker";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from '../matchers';

function isServerError(error: any): error is {
  serverId: string;
  serverMessage: string;
} {
  return error.serverId && error.serverMessage;
}

export default () => useInlayHintsFor(
  ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  textCommentWalker({
    async whatHint({
      scheme,
      fsPath,
      authority,
      path
    }, hintPos) {
      let displayString = "";
      try {
        const hint = await vscode.commands.executeCommand(
          "typescript.tsserverRequest",
          "quickinfo",
          {
            // @ts-ignore
            __: 'vscode-comment-queries',
            file: scheme === 'file' ? fsPath : `^/${scheme}/${authority || 'ts-nul-authority'}/${path.replace(/^\//, '')}`,
            line: hintPos.line + 1,
            offset: hintPos.character,
          } as ts.server.protocol.QuickInfoRequest['arguments']
        ) as ts.server.protocol.QuickInfoResponse;

        if (!hint || !hint.body) {
          throw new NoHintError();
        }

        displayString = hint.body.displayString;
      } catch (err) {
        if (err instanceof NoHintError) {
          throw err;
        }
        if (err instanceof Error) {
          if (isServerError(err)) {
            displayString = err.serverMessage;
            if (displayString === "No Project.") {
              displayString += ` (open a folder, or open ${fsPath})`;
            }
          } else {
            displayString = err.message ?? 'Unknown error';
          }
          displayString = `Error: ${displayString}`;
        } else {
          throw err;
        }
      }
      return displayString;
    },
    matchers: [
      matchers.twoSlashRelative,
      matchers.twoSlashAbsolute,
    ],
  }),
);
