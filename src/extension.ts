import * as vscode from "vscode";

import inlayHintsProviderForJSAndTS from "./langs/js&ts";
import inlayHintsProviderForPY from "./langs/py";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(inlayHintsProviderForJSAndTS());
  context.subscriptions.push(inlayHintsProviderForPY());
}

export function deactivate() {}
