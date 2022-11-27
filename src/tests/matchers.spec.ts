import './mock.vscode';

import { expect } from "chai";
import { defineRelativeMatcherRegExp, relativeRule, resolveRelativeMatchResult } from "../matchers";

const relativeTwoSlashTestCodes = `
type T0 = string | number;
//   _?
type T1 = T0;//<5?
  // ^?
//   ^2?
// ignore next line
// // ^?
`.trim();

describe('Matchers', function () {
  describe('rules', function () {
    it('should test relativeRule', () => {
      const regexp = defineRelativeMatcherRegExp('//', relativeRule);
      const results0 = [
        ['_', '_', '', undefined, undefined],
        ['<5', undefined, '', '<', '5'],
        ['^', '^', '', undefined, undefined],
        ['^2', '^', '2', undefined, undefined],
      ];
      const results1 = [
        ['_', 1, '', 1],
        ['', 1, '<', 5],
        ['^', 1, '', 1],
        ['^', 2, '', 1],
      ];

      let count = 0;
      for (const match of relativeTwoSlashTestCodes.matchAll(regexp)) {
        count++;
        const [, all, offset, lineOffset, direction, charOffset] = match;
        expect([all, offset, lineOffset, direction, charOffset])
          .to.deep.equal(results0[count - 1]);
        expect(resolveRelativeMatchResult(match))
          .to.deep.equal(results1[count - 1]);
      }
      expect(count).to.equal(results0.length);
    });
  });
});
