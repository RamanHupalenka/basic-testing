// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

type ModuleType = typeof import('./index');

const consoleLogMock = jest.fn();

jest.mock('./index', () => {
  const originalModule = jest.requireActual<ModuleType>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  beforeAll(() => {
    console.log = consoleLogMock;
  });

  afterAll(() => {
    jest.unmock('./index');

    consoleLogMock.mockClear();
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();

    expect(mockOne).toHaveBeenCalledTimes(1);
    expect(mockTwo).toHaveBeenCalledTimes(1);
    expect(mockThree).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();

    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
