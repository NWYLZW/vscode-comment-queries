import * as vscode from "vscode";

import textCommentWalker, { NoHintError } from "../textWalker";
import useHint from "../useHint";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from "../matchers";

export default () => useInlayHintsFor(
  ["python"],
  textCommentWalker({
    whatHint: useHint("python"),
    matchers: [
      matchers.sharpRelative,
      matchers.sharpAbsolute,
    ],
  }),
);
