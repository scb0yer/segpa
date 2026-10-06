export const SERIES_LENGTH = 5;
export const modes = [
  { id: "factors", label: "1 · Repérer les facteurs communs" },
  { id: "gcd", label: "2 · Utiliser le PGCD" },
];
export function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}
function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function makeProblem(numerator, denominator, common, random = Math.random) {
  if (![numerator, denominator, common].every(Number.isInteger)
    || numerator < 1 || denominator < 2 || common < 2 || gcd(numerator, denominator) !== 1)
    throw new RangeError("La fraction de départ doit être construite depuis une forme irréductible et un facteur commun supérieur à 1.");
  return {
    numerator: numerator * common,
    denominator: denominator * common,
    reducedNumerator: numerator,
    reducedDenominator: denominator,
    common,
    topFactors: shuffle([common, numerator], random),
    bottomFactors: shuffle([common, denominator], random),
  };
}
const banks = new Map();
function bankFor(mode) {
  if (banks.has(mode)) return banks.get(mode);
  const bank = [];
  const max = mode === "factors" ? 12 : 45;
  const factors = mode === "factors" ? [2, 3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20, 25];
  for (let numerator = 1; numerator <= max; numerator++) {
    for (let denominator = 2; denominator <= max; denominator++) {
      if (gcd(numerator, denominator) !== 1) continue;
      for (const common of factors) {
        if (mode === "gcd" && Math.max(numerator, denominator) * common > 500) continue;
        bank.push({ numerator, denominator, common });
      }
    }
  }
  banks.set(mode, bank);
  return bank;
}
export function makeSeries(mode, random = Math.random) {
  if (!modes.some(item => item.id === mode)) throw new Error("Mode de fractions inconnu.");
  return shuffle(bankFor(mode), random).slice(0, SERIES_LENGTH)
    .map(item => makeProblem(item.numerator, item.denominator, item.common, random));
}
export function checkFactors(problem, topIndex, bottomIndex) {
  return Number.isInteger(topIndex) && Number.isInteger(bottomIndex)
    && [0, 1].includes(topIndex) && [0, 1].includes(bottomIndex)
    && problem.topFactors[topIndex] === problem.common
    && problem.bottomFactors[bottomIndex] === problem.common;
}
const positiveInteger = value => /^\d{1,3}$/.test(String(value).trim()) && Number(value) > 0;
export function checkDivisions(problem, top, bottom) {
  return positiveInteger(top) && positiveInteger(bottom)
    && Number(top) === problem.common && Number(bottom) === problem.common;
}
export function checkReduced(problem, top, bottom) {
  if (!positiveInteger(top) || !positiveInteger(bottom)) return { correct: false, reason: "integer" };
  const numerator = Number(top), denominator = Number(bottom);
  if (numerator === problem.reducedNumerator && denominator === problem.reducedDenominator)
    return { correct: true, reason: "correct" };
  if (numerator * problem.reducedDenominator === denominator * problem.reducedNumerator)
    return { correct: false, reason: "notReduced" };
  if (numerator === problem.reducedDenominator && denominator === problem.reducedNumerator)
    return { correct: false, reason: "inverted" };
  return { correct: false, reason: "different" };
}
