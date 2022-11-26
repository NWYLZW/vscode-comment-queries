import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

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

const tsInlayHintsProvider = () => useInlayHintsFor(
  ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  async (model, iRange, cancel) => {
    const offset = model.offsetAt(iRange.start);
    const text = model.getText(iRange);
    const results: vscode.InlayHint[] = [];

    async function pushHint(
      inspectionPos: vscode.Position,
      endPos: vscode.Position,
    ) {
      const { scheme, fsPath, authority, path } = model.uri;

      const hint: any = await vscode.commands.executeCommand(
        "typescript.tsserverRequest",
        "quickinfo",
        {
          // @ts-ignore
          __: 'vscode-comment-queries',
          file: scheme === 'file' ? fsPath : `^/${scheme}/${authority || 'ts-nul-authority'}/${path.replace(/^\//, '')}`,
          line: inspectionPos.line + 1,
          offset: inspectionPos.character,
        } as ts.server.protocol.QuickInfoRequest['arguments']
      );

      if (!hint || !hint.body) {
        return;
      }

      // Make a one-liner
      let text = hint.body.displayString
        .replace(/\/n/g, " ")
        .replace(/\n */g, "␊")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      if (text.length > 120) {
        text = text.slice(0, 119) + "...";
      }

      const inlay: vscode.InlayHint = {
        kind: 0,
        position: new vscode.Position(endPos.line, endPos.character + 1),
        label: text,
        paddingLeft: true,
      };
      results.push(inlay);
    }

    for (const match of text.matchAll(/^\s*\/\/\s*(\^|_)(x\d*)?\?/gm)) {
      if (match.index === undefined) {
        return;
      }

      const end = match.index + match[0].length - 1;
      // Add the start range for the inlay hint
      const endPos = model.positionAt(end + offset);

      const [, lineOffset] = match[2]?.match(/x(\d*)/) ?? [, '1'];

      const inspectionPos = new vscode.Position(
        endPos.line + ({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          '^': -1 * Number(lineOffset),
          '_': 1  * Number(lineOffset),
        }[match[1] as '^' | '_']),
        endPos.character
      );

      if (cancel.isCancellationRequested) {
        return [];
      }

      await pushHint(inspectionPos, endPos);
    }

    for (const match of text.matchAll(/^\s*\/\/\s*@\[?(\d+)\,\s?(\d+)\]?\?/gm)) {
      if (match.index === undefined) {
        return;
      }

      const end = match.index + match[0].length - 1;
      // Add the start range for the inlay hint
      const endPos = model.positionAt(end + offset);

      const inspectionPos = new vscode.Position(
        Number(match[1]) - 1,
        Number(match[2]),
      );

      if (cancel.isCancellationRequested) {
        return [];
      }

      await pushHint(inspectionPos, endPos);
    }

    // TODO (Type/*<?*/) | (/*>?*/Type)
    // for (const match of text.matchAll(/\/\*(\s*?)([\<|\>])\?(\s*)\*\//gm)) {
    //   if (match.index === undefined) {
    //     return;
    //   }
    //   const [,, direction,] = match as [string, string, '<' | '>', string];
    //   const end = match.index + 2 + match[1].length + 2;
    //   // Add the start range for the inlay hint
    //   const endPos = model.positionAt(match.index + match[0].length - 1 + offset + 2);

    //   const inspectionPos = new vscode.Position(
    //     model.positionAt(end + offset).line,
    //     model.positionAt(end + offset).character - 1
    //   );

    //   if (cancel.isCancellationRequested) {
    //     return [];
    //   }

    //   console.log(
    //     inspectionPos,
    //     endPos,
    //     text.slice(match.index, end),
    //   );
      
    //   pushHint(inspectionPos, endPos);
    // }
    return results;
  }
);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(tsInlayHintsProvider());
}

export function deactivate() {}
