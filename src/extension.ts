import * as vscode from "vscode";

import inlayHintsProviderForJSAndTS from "./langs/js&ts";
import inlayHintsProviderForPY from "./langs/py";
import inlayHintsProviderForGO from "./langs/go";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(inlayHintsProviderForJSAndTS());
  context.subscriptions.push(inlayHintsProviderForPY());
  context.subscriptions.push(inlayHintsProviderForGO());
}

export function deactivate() {}
