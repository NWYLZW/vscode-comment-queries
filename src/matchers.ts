import { Position } from 'vscode';

export type CommentMatcher = [
  regexp: RegExp,
  matcher: (
    endPos: Position,
    math: RegExpMatchArray,
  ) => [insertPos: Position, hintPos: Position]
];

export default {
} as const;
