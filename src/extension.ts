import type * as ts from 'typescript/lib/tsserverlibrary';
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider: vscode.InlayHintsProvider = {
    provideInlayHints: async (model, iRange, cancel) => {
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
      return results;
    },
  };

  context.subscriptions.push(
    vscode.languages.registerInlayHintsProvider(
      [{ language: "javascript" }, { language: "typescript" }, { language: "typescriptreact" }, { language: "javascriptreact" }],
      provider
    )
  );
}

export function deactivate() {}
