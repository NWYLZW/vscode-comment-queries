import { Position } from 'vscode';
import { narrowCurry } from './type';

export type CommentMatcher = [
  regexp: RegExp,
  matcher: (
    endPos: Position,
    math: RegExpMatchArray,
  ) => [insertPos: Position, hintPos: Position]
];

export default narrowCurry<Record<string, CommentMatcher>>()({
  twoSlashRelative: [/^\s*\/\/\s*(\^|_)(x\d*)?\?/gm, (endPos, match) => {
    const [, lineOffset] = match[2]?.match(/x(\d*)/) ?? [, '1'];

    return [endPos, new Position(
      endPos.line + ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': -1 * Number(lineOffset),
        '_': 1  * Number(lineOffset),
      }[match[1] as '^' | '_']),
      endPos.character
    )];
  }],
  twoSlashAbsolute: [/^\s*\/\/\s*@\[?(\d+)\,\s?(\d+)\]?\?/gm, (endPos, match) => [endPos, new Position(
    Number(match[1]),
    Number(match[2])
  )]],
  // TODO (Type/*<?*/) | (/*>?*/Type)
  // [/\/\*(\s*?)([\<|\>])\?(\s*)\*\//gm, (endPos, match) => {
  //   const [,, direction,] = match as [string, string, '<' | '>', string];
  //   const inspectionPos = new vscode.Position(
  //     endPos.line,
  //     endPos.character - 1
  //   );
  //   return [];
  // }],
  sharpRelative: [/^\s*#\s*(\^|_)(x\d*)?\?/gm, (endPos, match) => {
    const [, lineOffset] = match[2]?.match(/x(\d*)/) ?? [, '1'];

    return [endPos, new Position(
      endPos.line + ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^': -1 * Number(lineOffset),
        '_': 1  * Number(lineOffset),
      }[match[1] as '^' | '_']),
      endPos.character
    )];
  }],
  sharpAbsolute: [/^\s*#\s*@\[?(\d+)\,\s?(\d+)\]?\?/gm, (endPos, match) => [endPos, new Position(
    Number(match[1]),
    Number(match[2])
  )]],
});
