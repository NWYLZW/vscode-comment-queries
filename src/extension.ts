import * as vscode from "vscode";

import inlayHintsProviderForJSAndTS from "./langs/js&ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(inlayHintsProviderForJSAndTS());
}

export function deactivate() {}
