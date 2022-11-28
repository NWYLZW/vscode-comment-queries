import { Position } from 'vscode';
import logger from './logger';
import { narrowCurry } from './type';

export type CommentMatcher = [
  regexp: RegExp,
  matcher: (
    endPos: Position,
    match: RegExpMatchArray,
  ) => [insertPos: Position, hintPos: Position, file?: string],
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

export const defineRelativeMatcherRegExp = (prefix: string, rule: string) => new RegExp(
  /**
   * TODO
   * * [x] //<6
   * * [x] // //<6
   * * [ ] // some //<6
   */
  `(?<!${prefix}\\s*)${prefix}\\s*(${rule})\\?$`, 'gm'
);

export class ParseError extends Error {}

export const resolveRelativeMatchResult = (match: RegExpMatchArray) => {
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

export const defineRelativeMatcher = (prefix: string): CommentMatcher => [
  defineRelativeMatcherRegExp(prefix, relativeRule), (endPos, match) => {
    const [offset, lineOffset, direction, charOffset] = resolveRelativeMatchResult(match);

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
  }
];

/**
 * file rule
 * like:
 * * [ ] ./a
 * * [ ] ./a/b
 * * [ ] ./a/b/c d/e
 * * [ ] ./a.b.c-d_e
 * * [ ] /codes/a/b/c d/e
 * * [ ] D:/codes/a/b/c d/e
 */
export const fileRule = '(?:[a-z|A-Z]\:)?(?:\\.)?\\/(?:[\\w|_|\\-|\\.| ]+\\/)*[\\w|_|\\-|\\.| ]+(?:\\.\\w+)*';
/**
 * position rule
 * like:
 * * [ ] 1,2
 * * [ ] [1,2]
 * * [ ] [1, 2]
 * * [ ] 1:2
 */
export const positionRule = '(\\d+[,|:]\\d+|\\[\\d+[,|:]\\s*\\d+\\])';
/**
 * absolute rule
 * like:
 * * [ ] positionRule
 * * [ ] fileRule:potionRule
 */
export const absoluteRule = `(${fileRule}:)?${positionRule}`;

export const defineAbsoluteMatcherRegExp = (prefix: string, rule: string) => new RegExp(
  `(?<!${prefix}\\s*)${prefix}\\s*&(${rule})\\?$`, 'gm'
);

export const resolveAbsoluteMatchResult = (match: RegExpMatchArray) => {
  const [, all, fileWithColon, position] = match;
  const file = fileWithColon ? fileWithColon.slice(0, -1) : '';
  const [line, char] = position.replace(/\[|\]/g, '').split(/[,|:]/);
  if (Number.isNaN(line) || Number.isNaN(char)) {
    throw new ParseError(`invalid position: ${all}`);
  }
  return [file, +line, +char] as const;
};

export const defineAbsoluteMatcher = (prefix: string): CommentMatcher => [
  defineAbsoluteMatcherRegExp(prefix, absoluteRule), (endPos, match) => {
    const [file, line, char] = resolveAbsoluteMatchResult(match);
    return [endPos, new Position(line - 1, char), file];
  }
];

export default narrowCurry<Record<string, CommentMatcher>>()({
  twoSlashRelative: defineRelativeMatcher('//'),
  twoSlashAbsolute: defineAbsoluteMatcher('//'),
  // TODO (Type/*<?*/) | (/*>?*/Type)
  // [/\/\*(\s*?)([\<|\>])\?(\s*)\*\//gm, (endPos, match) => {
  //   const [,, direction,] = match as [string, string, '<' | '>', string];
  //   const inspectionPos = new vscode.Position(
  //     endPos.line,
  //     endPos.character - 1
  //   );
  //   return [];
  // }],
  sharpRelative: defineRelativeMatcher('#'),
  sharpAbsolute: defineAbsoluteMatcher('#'),
});
