// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const config = {
  baseURL: 'https://jsonplaceholder.typicode.com',
};
const relativePath = '/users';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: null });

    await throttledGetDataFromApi(relativePath);

    await jest.runOnlyPendingTimersAsync();

    expect(axiosCreateSpy).toHaveBeenCalledWith(config);
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: null });

    await throttledGetDataFromApi(relativePath);

    await jest.runOnlyPendingTimersAsync();

    expect(axiosGetSpy).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const usersMockData = await import('./users-mock.json');

    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: usersMockData.default });

    const result = await throttledGetDataFromApi(relativePath);

    await jest.runOnlyPendingTimersAsync();

    expect(result).toStrictEqual(usersMockData.default);
  });
});
