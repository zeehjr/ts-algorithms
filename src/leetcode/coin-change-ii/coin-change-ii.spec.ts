import { coinChangeDepthFirstSearch } from './depth-first-search';
import { coinChangeDynamicProgramming } from './dynamic-programming';

type Fixture = {
  input: { amount: number; coins: Array<number> };
  output: number;
};

const fixtures: Array<Fixture> = [
  { input: { amount: 5, coins: [1, 2, 5] }, output: 4 },
  { input: { amount: 3, coins: [2] }, output: 0 },
  { input: { amount: 10, coins: [10] }, output: 1 },
];

describe('Coin Change II', () => {
  describe('Depth First Search (DFS)', () => {
    fixtures.forEach((fixture) => {
      test(`Input: amount = ${
        fixture.input.amount
      }, coins = [${fixture.input.coins.join(',')}]. Output: ${
        fixture.output
      }`, () => {
        expect(coinChangeDepthFirstSearch(fixture.input)).toBe(fixture.output);
      });
    });
  });
  describe('Dynamic Programming (DP)', () => {
    fixtures.forEach((fixture) => {
      test(`Input: amount = ${
        fixture.input.amount
      }, coins = [${fixture.input.coins.join(',')}]. Output: ${
        fixture.output
      }`, () => {
        expect(coinChangeDynamicProgramming(fixture.input)).toBe(
          fixture.output,
        );
      });
    });
  });
});
