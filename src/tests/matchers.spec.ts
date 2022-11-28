import './mock.vscode';

import { expect } from "chai";
import { absoluteRule, defineAbsoluteMatcherRegExp, defineRelativeMatcherRegExp, relativeRule, resolveAbsoluteMatchResult, resolveRelativeMatchResult } from "../matchers";

const relativeTwoSlashTestCodes = `
type T0 = string | number;
//   _?
type T1 = T0;//<5?
  // ^?
//   ^2?
// ignore next line
// // ^?
`.trim();

const absoluteTwoSlashTestCodes = `
// &1,1?
// &[1,1]?
// &1:1?
// &./a:1,1?
// &./a/b:1,1?
// &./a.b.c-d_e:1,1?
// &./a/b/c d/e:1,1?
// &/codes/a/b/c d/e:1,1?
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
    it('should test absoluteRule', () => {
      const regexp = defineAbsoluteMatcherRegExp('//', absoluteRule);
      const results0 = [
        ['1,1',     '',    '1,1'],
        ['[1,1]',   '',    '[1,1]'],
        ['1:1',     '',    '1:1'],
        ['./a:1,1', './a', '1,1'],
        ['./a/b:1,1', './a/b', '1,1'],
        ['./a.b.c-d_e:1,1', './a.b.c-d_e', '1,1'],
        ['./a/b/c d/e:1,1', './a/b/c d/e', '1,1'],
        ['/codes/a/b/c d/e:1,1', '/codes/a/b/c d/e', '1,1'],
      ];
      const results1 = [
        ['', 1, 1],
        ['', 1, 1],
        ['', 1, 1],
        ['./a', 1, 1],
        ['./a/b', 1, 1],
        ['./a.b.c-d_e', 1, 1],
        ['./a/b/c d/e', 1, 1],
        ['/codes/a/b/c d/e', 1, 1],
      ];

      // console.log(regexp);

      let count = 0;
      for (const match of absoluteTwoSlashTestCodes.matchAll(regexp)) {
        // console.log(match);

        count++;
        const [, all, fileWithColon, position] = match;
        console.log(match);

        const file = fileWithColon ? fileWithColon.slice(0, -1) : '';
        expect([all, file, position])
          .to.deep.equal(results0[count - 1]);
        expect(resolveAbsoluteMatchResult(match))
          .to.deep.equal(results1[count - 1]);
      }
      expect(count).to.equal(results0.length);
    });
  });
});
