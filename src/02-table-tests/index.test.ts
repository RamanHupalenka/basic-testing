// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

interface TestCasePayload {
  a: number | unknown;
  b: number | unknown;
  action: Action | unknown;
  expected: number | null;
}

type TestCaseWithDescription = [string, TestCasePayload];

const testCases: TestCaseWithDescription[] = [
  ['should add two numbers', { a: 1, b: 2, action: Action.Add, expected: 3 }],
  [
    'should substract two numbers',
    { a: 3, b: 2, action: Action.Substract, expected: 1 },
  ],
  [
    'should multiply two numbers',
    { a: 3, b: 3, action: Action.Multiply, expected: 9 },
  ],
  [
    'should divide two numbers',
    { a: 9, b: 3, action: Action.Divide, expected: 3 },
  ],
  [
    'should exponentiate two numbers',
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
  ],
  [
    'should return null for invalid action',
    { a: 1, b: 2, action: 'sum', expected: null },
  ],
  [
    'should return null for invalid arguments',
    { a: '2', b: '1', action: Action.Add, expected: null },
  ],
];

describe('simpleCalculator', () => {
  test.each(testCases)('%s', (_, { a, b, action, expected }) => {
    const result = simpleCalculator({
      a,
      b,
      action,
    });

    expect(result).toBe(expected);
  });
});
