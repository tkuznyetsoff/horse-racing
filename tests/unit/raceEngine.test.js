import { shuffleArray, pickRandom, calculateStep } from '@/utils/raceEngine';

describe('shuffleArray', () => {
  test('returns a new array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect(result).not.toBe(input); // new array, not mutated
  });

  test('contains all original elements', () => {
    const input = [10, 20, 30, 40, 50];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
  });

  test('does not mutate the original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffleArray(input);
    expect(input).toEqual(copy);
  });

  test('handles empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  test('handles single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('pickRandom', () => {
  test('returns the requested number of items', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = pickRandom(items, 5);
    expect(result).toHaveLength(5);
  });

  test('all picked items come from the source array', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const result = pickRandom(items, 3);
    result.forEach((item) => {
      expect(items).toContain(item);
    });
  });

  test('returns no duplicates', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = pickRandom(items, 10);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  test('returns all items when count equals array length', () => {
    const items = [1, 2, 3];
    const result = pickRandom(items, 3);
    expect(result.sort()).toEqual(items.sort());
  });

  test('returns empty array for count 0', () => {
    expect(pickRandom([1, 2, 3], 0)).toEqual([]);
  });
});

describe('calculateStep', () => {
  test('returns a positive number', () => {
    const step = calculateStep(50, 1200);
    expect(step).toBeGreaterThan(0);
  });

  test('higher condition produces higher average step', () => {
    // Statistical test: over many samples, high condition should average higher
    const samples = 1000;
    let sumLow = 0;
    let sumHigh = 0;
    for (let i = 0; i < samples; i++) {
      sumLow += calculateStep(10, 1200);
      sumHigh += calculateStep(90, 1200);
    }
    expect(sumHigh / samples).toBeGreaterThan(sumLow / samples);
  });

  test('shorter distances produce larger steps (faster finish)', () => {
    const samples = 1000;
    let sumShort = 0;
    let sumLong = 0;
    for (let i = 0; i < samples; i++) {
      sumShort += calculateStep(50, 1200);
      sumLong += calculateStep(50, 2200);
    }
    expect(sumShort / samples).toBeGreaterThan(sumLong / samples);
  });

  test('step is bounded within a reasonable range', () => {
    for (let i = 0; i < 100; i++) {
      const step = calculateStep(100, 1200);
      expect(step).toBeGreaterThan(0);
      expect(step).toBeLessThan(5); // reasonable upper bound
    }
  });
});
