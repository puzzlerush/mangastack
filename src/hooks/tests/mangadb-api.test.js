import { shallowIsEqual } from '../mangadb-api';

describe('shallowIsEqual', () => {
  const paramsA = { limit: 10, skip: 0 };
  const paramsB = { ...paramsA };
  const nestedA = { target: { value: 'potato' } };
  const nestedB = { target: { value: 'tomato' } };
  
  it('should return true when passed two objects with the same properties', () => {
    expect(shallowIsEqual(paramsA, paramsB)).toBe(true);
    expect(shallowIsEqual({}, {})).toBe(true);
    expect(shallowIsEqual(nestedA, { target: nestedA.target })).toBe(true);
  });

  it('should return false when passed two objects with different properties', () => {
    expect(shallowIsEqual(paramsA, nestedA)).toBe(false);
    expect(shallowIsEqual(nestedA, nestedB)).toBe(false);
    expect(shallowIsEqual(nestedA, { target: { value: 'potato' } })).toBe(false);
  });
});