import path = require("path");
import * as vscode from "vscode";
import logger from "./logger";
import { CommentMatcher } from "./matchers";

export type ProvideInlayHints = vscode.InlayHintsProvider['provideInlayHints'];

export type InlayHint = {
  matchers: CommentMatcher[];
  wahtHint: (
    uri: vscode.Uri,
    hintPos: vscode.Position
  ) => Promise<string>;
};

export class NoHintError extends Error {}

export default function textCommentWalker(
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

        const [insertPos, hintPos, file] = matcher(
          model.positionAt(offset + match.index - 1 + match[0].length),
          match
        );
        let hint: string | undefined;
        try {
          let uri = model.uri;
          if (file) {
            if (file.startsWith("/")) {
              uri = vscode.Uri.file(file);
            }
            if (file.startsWith(".")) {
              const dir = model.uri.path.split("/").slice(0, -1).join("/");
              uri = vscode.Uri.file(path.join(dir, file));
            }
          }
          hint = await inlayHint.wahtHint(uri, hintPos);
        } catch (e) {
          if (e instanceof NoHintError) {
            continue;
          }
          if (e instanceof Error) {
            hint = e.message;
            logger.error(e);
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
