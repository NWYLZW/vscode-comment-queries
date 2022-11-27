import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

import textCommentWalker, { NoHintError } from './textWalker';

export const logger = new Proxy(console, {
  get() {
    return (...args: any[]) => {
      console.log(`[vscode-comment-queries]`, ...args);
    };
  }
});

function useInlayHintsFor(
  langs: string[],
  provideInlayHints: vscode.InlayHintsProvider['provideInlayHints'],
  opts: Omit<vscode.InlayHintsProvider, 'provideInlayHints'> = {},
) {
  return vscode.languages.registerInlayHintsProvider(
    langs.map(language => ({ language })),
    {
      provideInlayHints,
      ...opts
    }
  );
}

const inlayHintsProviderForJSAndTS = () => useInlayHintsFor(
  ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  textCommentWalker({
    async wahtHint({
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
      [/^\s*\/\/\s*@\[?(\d+)\,\s?(\d+)\]?\?/gm, (endPos, match) => [endPos, new vscode.Position(
        Number(match[1]),
        Number(match[2])
      )]],
      // TODO (Type/*<?*/) | (/*>?*/Type)
      // [/\/\*(\s*?)([\<|\>])\?(\s*)\*\//gm, (endPos, match) => {
      //   const [,, direction,] = match as [string, string, '<' | '>', string];
      //   const inspectionPos = new vscode.Position(
      //     endPos.line,
      //     endPos.character - 1
      //   );
      //   return [];
      // }]
    ],
  }),
);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(inlayHintsProviderForJSAndTS());
}

export function deactivate() {}
