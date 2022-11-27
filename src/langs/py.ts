import * as vscode from "vscode";

import textCommentWalker, { NoHintError } from "../textWalker";
import useHint from "../useHint";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from "../matchers";

export default () => useInlayHintsFor(
  ["python"],
  textCommentWalker({
    wahtHint: useHint("python"),
    matchers: [
      matchers.sharpRelative,
      matchers.sharpAbsolute,
    ],
  }),
);
