// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const result = await resolveValue(25);

    expect(result).toBe(25);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Error message';

    const testFn = () => throwError(errorMessage);

    expect(testFn).toThrowError(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultErrorMessage = 'Oops!';

    const testFn = () => throwError();

    expect(testFn).toThrowError(defaultErrorMessage);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const testFn = () => throwCustomError();

    expect(testFn).toThrowError(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const testFn = async () => await rejectCustomError();

    await expect(testFn).rejects.toThrowError(MyAwesomeError);
  });
});
