export function countSameDivisorPairs(k: number): number {
    function countDivisors(n: number): number {
        let count = 0;
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                count += (n / i === i) ? 1 : 2;
            }
        }
        return count;
    }

    let count = 0;
    for (let n = 2; n < k; n++) {
        if (countDivisors(n) === countDivisors(n + 1)) {
            count++;
        }
    }
    return count;
}