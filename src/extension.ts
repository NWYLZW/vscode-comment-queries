import * as vscode from "vscode";

import inlayHintsProviderForJSAndTS from "./langs/js&ts";
import inlayHintsProviderForPY from "./langs/py";
import inlayHintsProviderForGO from "./langs/go";
import inlayHintsProviderForRust from "./langs/rust";
import logger from "./logger";
import matchers from "./matchers";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...[
    inlayHintsProviderForJSAndTS(),
    inlayHintsProviderForPY(),
    inlayHintsProviderForGO(),
    inlayHintsProviderForRust(),
  ]);
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["javascript", "typescript", "typescriptreact", "javascriptreact"], {
        provideDefinition: async (model, position) => {
          const line = model.lineAt(position.line);
          for (const [regexp, matcher] of [
            matchers.twoSlashRelative,
            matchers.twoSlashAbsolute,
          ]) {
            const match = regexp.exec(line.text);
            if (match) {
              const [_, hintPos, file] = matcher(
                new vscode.Position(
                  position.line,
                  line.text.length - match[1].length
                ),
                match
              );
              let fileUri = model.uri;
              if (file) {
                fileUri = vscode.Uri.joinPath(model.uri, "..", file);
              }
              const doc = await vscode.workspace.openTextDocument(fileUri);
              return new vscode.Location(doc.uri, new vscode.Range(
                new vscode.Position(hintPos.line, hintPos.character - 1),
                hintPos
              ));
            }
          }
          return null;
        }
      }
    ),
  );
}

export function deactivate() {}
