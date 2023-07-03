// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';

const timeout = 1000;
const interval = 100;
const pathToFile = './index.ts';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackSpy = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callbackSpy, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callbackSpy, timeout);
  });

  test('should call callback only after timeout', async () => {
    const callbackSpy = jest.fn();

    const start = performance.now();

    doStuffByTimeout(callbackSpy, timeout);
    await jest.runOnlyPendingTimersAsync();

    const end = performance.now();

    expect(end - start).toBeGreaterThanOrEqual(timeout);
    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackSpy = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callbackSpy, interval);

    expect(setIntervalSpy).toHaveBeenCalledWith(callbackSpy, interval);
  });

  test('should call callback multiple times after multiple intervals', async () => {
    const callbackSpy = jest.fn();

    const start = performance.now();

    doStuffByInterval(callbackSpy, timeout);
    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();

    const end = performance.now();

    expect(end - start).toBeGreaterThanOrEqual(interval * 3);
    expect(callbackSpy).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');

    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const sourceContent = 'My Content\r\n';
    const bufferContent = Buffer.from(sourceContent);

    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(bufferContent);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(sourceContent);
  });
});
