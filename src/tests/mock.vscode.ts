import * as mock from 'mock-require';

mock('vscode', {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Position: class Position {
    constructor(public line: number, public character: number) {}
  }
});
