import textCommentWalker, { NoHintError } from "../textWalker";
import useHint from "../useHint";
import useInlayHintsFor from "../useInlayHintsFor";
import matchers from "../matchers";

// export interface CommandInvocation {
// 	binPath: string;
// 	args?: string[];
// 	env?: Object;
// 	cwd?: string;
// }

// interface GoExports {
//   settrings: {
//     getExecutionCommand: (toolName: string, resource: vscode.Uri) => CommandInvocation | undefined;
//   };
// }

// async function getQuickInfoBy() {
//   const go = vscode.extensions.getExtension("golang.go");
//   if (!go) {
//     throw new NoHintError();
//   }
//   if (!go.isActive) {
//     await go.activate();
//   }
//   const goExports = go.exports as GoExports;
// }

export default () => useInlayHintsFor(
  ["go"],
  textCommentWalker({
    whatHint: useHint("go"),
    matchers: [
      matchers.twoSlashRelative,
      matchers.twoSlashAbsolute,
    ],
  }),
);
