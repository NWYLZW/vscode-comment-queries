import { Uri, commands, Hover, Position } from "vscode";

import { NoHintError } from "./textWalker";

export default function useHint(
  ...langIds: string[]
) {
  return async (uri: Uri, hintPos: Position) => {
    const [hover, ...rest] = await commands.executeCommand<Hover[]>(
      'vscode.executeHoverProvider',
      uri,
      hintPos
    );
    if (!hover) {
      throw new NoHintError();
    }
    let hoverContent = '';
    const { contents: [content, ...restContent] = [] } = hover;
    if (typeof content !== 'string') {
      hoverContent = content.value;
    } else {
      hoverContent = content;
    }
    /**
     * hover content is like:
     * ```lang
     * codeblock
     * ```
     * some description
     */
    const regexp = new RegExp(`\`{3}${
      langIds.join('|')
    }[\n]+(.*[\n]+)\`{3}`, 'gs');
    const [, hint] = regexp.exec(hoverContent) || [];

    return hint?.trim() ?? 'No Hint';
  };
}
