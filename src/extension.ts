import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

const logger = new Proxy(console, {
  get() {
    return (...args: any[]) => {
      console.log(`[vscode-comment-queries]`, ...args);
    };
  }
});

type ProvideInlayHints = vscode.InlayHintsProvider['provideInlayHints'];

type CommentMatcher = [
  regexp: RegExp,
  matcher: (
    endPos: vscode.Position,
    math: RegExpMatchArray,
  ) => [insertPos: vscode.Position, hintPos: vscode.Position]
];

type InlayHint = {
  matchers: CommentMatcher[];
  wahtHint: (
    uri: vscode.Uri,
    hintPos: vscode.Position
  ) => Promise<string>;
};

class NoHintError extends Error {}

function textCommentWalker(
  inlayHint: InlayHint
): ProvideInlayHints {
  return async (model, iRange, cancel) => {
    const offset = model.offsetAt(iRange.start);
    const text = model.getText(iRange);
    const hints: vscode.InlayHint[] = [];

    if (cancel.isCancellationRequested) {
      return;
    }

    for await (const [regexp, matcher] of inlayHint.matchers) {
      for (const match of text.matchAll(regexp)) {
        if (match.index === undefined) {
          return;
        }

        const [insertPos, hintPos] = matcher(
          model.positionAt(offset + match.index - 1 + match[0].length),
          match
        );
        let hint: string | undefined;
        try {
          hint = await inlayHint.wahtHint(model.uri, hintPos);
        } catch (e) {
          if (e instanceof NoHintError) {
            continue;
          }
          throw e;
        }
        let text = hint
          .replace(/\/n/g, " ")
          .replace(/\n */g, "␊")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        if (text.length > 120) {
          text = text.slice(0, 119) + "...";
        }

        hints.push({
          kind: 0,
          position: new vscode.Position(insertPos.line, insertPos.character + 1),
          label: text,
          paddingLeft: true,
        });
      }
    }
    return hints;
  };
}

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
