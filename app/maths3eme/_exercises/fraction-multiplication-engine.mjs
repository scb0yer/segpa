export const SERIES_LENGTH = 5;
export const modes = [
  { id: "integer", label: "1 · Fraction × entier" },
  { id: "fractions", label: "2 · Fraction × fraction" },
];
const rand = (a, b, rng) => a + Math.floor(rng() * (b - a + 1));
export function makeSeries(mode, rng = Math.random) {
  if (!modes.some((m) => m.id === mode)) throw Error("Niveau inconnu");
  const questions = [],
    seen = new Set();
  while (questions.length < SERIES_LENGTH) {
    let p, key;
    for (let tries = 0; tries < 100; tries++) {
      p = {
        n1: rand(1, 9, rng),
        d1: rand(2, 10, rng),
        n2: rand(2, 9, rng),
        d2: mode === "integer" ? 1 : rand(2, 10, rng),
      };
      if (p.n1 === p.d1) p.n1 = p.n1 === 9 ? 8 : p.n1 + 1;
      if (mode === "fractions" && p.n2 === p.d2)
        p.n2 = p.n2 === 9 ? 8 : p.n2 + 1;
      key = JSON.stringify(p);
      if (!seen.has(key)) break;
    }
    seen.add(key);
    questions.push({ ...p, answerTop: p.n1 * p.n2, answerBottom: p.d1 * p.d2 });
  }
  return questions;
}
const integer = (s) =>
  /^\d{1,6}$/.test(String(s).trim()) ? Number(String(s).trim()) : null;
export function checkInteger(p, top, bottom) {
  return integer(top) === p.n2 && integer(bottom) === 1;
}
function pair(a, b, x, y) {
  a = integer(a);
  b = integer(b);
  return (a === x && b === y) || (a === y && b === x);
}
export function checkProducts(p, v) {
  return (
    pair(v.top1, v.top2, p.n1, p.n2) && pair(v.bottom1, v.bottom2, p.d1, p.d2)
  );
}
export function checkAnswer(p, n, d) {
  const top = integer(n),
    bottom = integer(d);
  return (
    top !== null &&
    bottom !== null &&
    bottom > 0 &&
    top * p.answerBottom === p.answerTop * bottom
  );
}
