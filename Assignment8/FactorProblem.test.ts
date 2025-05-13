import { countSameDivisorPairs } from './FactorProblem';

describe('countSameDivisorPairs', () => {
    test('k = 3 → should return 1', () => {
        expect(countSameDivisorPairs(3)).toBe(1);
    });

    test('k = 15 → should return 2', () => {
        expect(countSameDivisorPairs(15)).toBe(2);
    });

    test('k = 100 → should return 15', () => {
        expect(countSameDivisorPairs(100)).toBe(15);
    });

    test('k = 5 → should return 1', () => {
        expect(countSameDivisorPairs(5)).toBe(1);
    });

    test('k = 50 → should return 9', () => {
        expect(countSameDivisorPairs(50)).toBe(8);
    });
});
