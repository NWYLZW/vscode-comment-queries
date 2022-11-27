import { Position } from 'vscode';
import logger from './logger';
import { narrowCurry } from './type';

export type CommentMatcher = [
  regexp: RegExp,
  matcher: (
    endPos: Position,
    math: RegExpMatchArray,
  ) => [insertPos: Position, hintPos: Position]
];

/**
 * relative rule
 * like:
 * * [x] ^
 * * [x] _
 * * [x] ^3
 * * [x] ^3<
 * * [x] ^3<2
 */
export const relativeRule = '(\\^|_)?(\\d*)(<|>)?(\\d*)?';
/**
 * file rule
 * like:
 * * [ ] ./a
 * * [ ] ./a/b
 * * [ ] ./a/b/c d/e
 * * [ ] /codes/a/b/c d/e
 */
export const fileRule = '(\\.\\/|\\/)?(\\S+\\s+)?(\\S+)';
/**
 * position rule
 * like:
 * * [ ] 1,2
 * * [ ] [1,2]
 * * [ ] [1, 2]
 */
export const positionRule = '(\\d+,\\d+|\\[\\d+,\\s*\\d+\\])';
/**
 * absolute rule
 * like:
 * * [ ] #positionRule
 * * [ ] #fileRule:potionRule
 */
export const absoluteRule = `#(${fileRule}:)?${positionRule}`;

export const defineLineMatcherRegExp = (prefix: string, rule: string) => new RegExp(
  `(?<!${prefix}\\s*)${prefix}\\s*(${rule})\\?$`, 'gm'
);

export class ParseError extends Error {}

export const resolveLineMatchResult = (match: RegExpMatchArray) => {
  const [all, , offset, lineOffsetStr, direction, charOffsetStr] = match;
  const lineOffset = +(lineOffsetStr || 1);
  const charOffset = +(charOffsetStr || 1);
  if (Number.isNaN(lineOffset) || Number.isNaN(charOffset)) {
    throw new ParseError(`invalid offset: ${all}`);
  }
  return [
    (offset || '') as '^' | '_' | '',
    lineOffset,
    (direction || '') as '<' | '>' | '',
    charOffset,
  ] as const;
};

export default narrowCurry<Record<string, CommentMatcher>>()({
  twoSlashRelative: [defineLineMatcherRegExp('//', relativeRule), (endPos, match) => {
    const [offset, lineOffset, direction, charOffset] = resolveLineMatchResult(match);

    /* eslint-disable @typescript-eslint/naming-convention */
    return [endPos, new Position(
      endPos.line + ({
        '^': -1 * Number(lineOffset),
        '_': 1  * Number(lineOffset),
        '': 0,
      }[offset]),
      endPos.character + ({
        '<': -1 * Number(charOffset),
        '>': 1  * Number(charOffset),
        '': 0,
      }[direction]),
    )];
    /* eslint-enable @typescript-eslint/naming-convention */
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
