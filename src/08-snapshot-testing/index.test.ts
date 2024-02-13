import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const values = [1, 2, 3];
    const expectedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            next: null,
            value: null,
          },
        },
      },
    };
    const result = generateLinkedList(values);

    expect(result).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const values = [3, 2, 1];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });
});
