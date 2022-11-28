import * as vscode from "vscode";

import inlayHintsProviderForJSAndTS from "./langs/js&ts";
import inlayHintsProviderForPY from "./langs/py";
import inlayHintsProviderForGO from "./langs/go";
import logger from "./logger";
import matchers from "./matchers";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(inlayHintsProviderForJSAndTS());
  context.subscriptions.push(inlayHintsProviderForPY());
  context.subscriptions.push(inlayHintsProviderForGO());
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["typescript"], {
        provideDefinition: (model, position, token) => {
          const line = model.lineAt(position.line);
          const [regexp, matcher] = matchers.twoSlashRelative;
          const match = regexp.exec(line.text);
          if (match) {
            const [_, hintPos, file] = matcher(position, match);
            logger.log("provideDefinition", hintPos, file);
          }
          return null;
        }
      }
    ),
  );
}

export function deactivate() {}
