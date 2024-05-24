import textCommentWalker from "../textWalker";
import useHint from "../useHint";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from "../matchers";

export default () => useInlayHintsFor(
  ["rust"],
  textCommentWalker({
    whatHint: useHint("rust"),
    matchers: [
      matchers.twoSlashRelative,
      matchers.twoSlashAbsolute,
    ],
  }),
);
