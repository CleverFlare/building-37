export const cumulative = (arr: number[]): number[] => {
  let sum = 0;
  return arr.map((n) => (sum += n));
};
