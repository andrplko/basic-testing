import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

const data = {
  userId: 1,
  id: 1,
  title: 'fake content',
  body: 'fake content',
};

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    axios.create = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data }),
    });
  });

  test('should create instance with provided base url', async () => {
    const expectedBaseURL = 'https://jsonplaceholder.typicode.com';

    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expectedBaseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/posts');

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axios.create().get).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('/posts');

    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(result).toEqual(data);
  });
});
