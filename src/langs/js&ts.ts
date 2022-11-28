import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

import textCommentWalker, { NoHintError } from "../textWalker";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from '../matchers';

export default () => useInlayHintsFor(
  ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  textCommentWalker({
    async whatHint({
      scheme,
      fsPath,
      authority,
      path
    }, hintPos) {
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

      return hint.body.displayString;
    },
    matchers: [
      matchers.twoSlashRelative,
      matchers.twoSlashAbsolute,
    ],
  }),
);
