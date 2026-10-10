export const SERIES_LENGTH = 5;
export const modes = [
  { id: "same", label: "1 · Même dénominateur" },
  { id: "multiple", label: "2 · Dénominateur double ou triple" },
  { id: "product", label: "3 · Multiplier les dénominateurs" },
];
const rand = (a, b, rng) => a + Math.floor(rng() * (b - a + 1));
export function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}
function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = rand(0, i, rng);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export function makeProblem(mode, operation = "+", rng = Math.random) {
  let d1, d2;
  if (mode === "same") {
    d1 = rand(2, 12, rng);
    d2 = d1;
  } else if (mode === "multiple") {
    d1 = rand(2, 9, rng);
    d2 = d1 * rand(2, 3, rng);
    if (rng() < 0.5) [d1, d2] = [d2, d1];
  } else if (mode === "product") {
    const pairs = [
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
      [5, 6],
      [5, 7],
      [7, 8],
      [8, 9],
    ];
    [d1, d2] = pairs[rand(0, pairs.length - 1, rng)];
    if (rng() < 0.5) [d1, d2] = [d2, d1];
  } else throw Error("Niveau inconnu");
  let n1 = rand(1, d1 - 1, rng),
    n2 = rand(1, d2 - 1, rng);
  if (operation === "−" && n1 * d2 < n2 * d1)
    [n1, d1, n2, d2] = [n2, d2, n1, d1];
  const common = mode === "product" ? d1 * d2 : Math.max(d1, d2);
  const top1 = n1 * (common / d1),
    top2 = n2 * (common / d2),
    answer = operation === "+" ? top1 + top2 : top1 - top2;
  return { n1, d1, n2, d2, operation, common, top1, top2, answer };
}
export function makeSeries(mode, rng = Math.random) {
  const operations = shuffle(["+", "+", "+", "−", "−"], rng),
    series = [],
    seen = new Set();
  for (const op of operations) {
    let p, key;
    for (let i = 0; i < 100; i++) {
      p = makeProblem(mode, op, rng);
      key = JSON.stringify(p);
      if (p.answer > 0 && !seen.has(key)) break;
    }
    // Garde une soustraction positive même avec un générateur de hasard constant utilisé en test.
    if (p.answer === 0) {
      p = {
        ...p,
        n1: p.n1 + 1,
        top1: p.top1 + p.common / p.d1,
        answer: p.common / p.d1,
      };
    }
    seen.add(key);
    series.push(p);
  }
  return series;
}
function integer(s) {
  if (!/^\d{1,6}$/.test(String(s).trim())) return null;
  return Number(String(s).trim());
}
export function checkCommon(p, denominator, left, right) {
  return (
    integer(denominator) === p.common &&
    integer(left) === p.top1 &&
    integer(right) === p.top2
  );
}
export function checkAnswer(p, n, d) {
  const top = integer(n),
    bottom = integer(d);
  return (
    top !== null &&
    bottom !== null &&
    bottom > 0 &&
    top * p.common === p.answer * bottom
  );
}

export function checkMultipliers(p, values) {
  return [
    ["left", p.d1],
    ["right", p.d2],
  ].every(
    ([side, d]) =>
      p.common === d ||
      (integer(values[`${side}FactorTop`]) === p.common / d &&
        integer(values[`${side}FactorBottom`]) === p.common / d),
  );
}
export function checkRewritten(p, values) {
  return [
    ["left", p.d1, p.top1],
    ["right", p.d2, p.top2],
  ].every(
    ([side, d, n]) =>
      p.common === d ||
      (integer(values[`${side}Top`]) === n &&
        integer(values[`${side}Bottom`]) === p.common),
  );
}
