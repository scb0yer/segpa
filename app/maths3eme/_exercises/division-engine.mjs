export const modes = [
  { id: "division", label: "1 · Lire une égalité" },
  { id: "operation", label: "2 · Lire une division posée" },
  { id: "equality", label: "3 · Retrouver l'égalité" },
];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export function makeDivision() {
  for (let k = 0; k < 500; k++) {
    const divisor = rand(4, 24),
      quotient = rand(3, 18);
    const remainder = Math.random() < 0.2 ? 0 : rand(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    const values = [
      dividend,
      divisor,
      quotient,
      ...(remainder ? [remainder] : []),
    ];
    if (new Set(values).size === values.length && dividend <= 499)
      return { dividend, divisor, quotient, remainder };
  }
  return { dividend: 185, divisor: 15, quotient: 12, remainder: 5 };
}
export function equation(q) {
  return `${q.dividend} = ${q.divisor} × ${q.quotient} + ${q.remainder}`;
}
function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function makeQuestion(mode) {
  const q = makeDivision();
  const target = Math.random() < 0.5 ? "quotient" : "remainder";
  if (mode === "operation") {
    const correct = equation(q);
    return {
      q,
      target,
      correct,
      choices: shuffle([
        correct,
        `${q.dividend} = ${q.quotient} × ${q.divisor} + ${q.divisor}`,
        `${q.dividend} = ${q.divisor} × ${q.remainder} + ${q.quotient}`,
        `${q.dividend} = ${q.divisor} × ${q.quotient} + ${q.remainder + 1}`,
      ]),
    };
  }
  const correct = String(q[target]);
  // Échantillonnage sans remise : pas de boucle aléatoire non bornée.
  const pool = [];
  for (let n = Math.max(0, q[target] - 5); n <= q[target] + 5; n++)
    if (String(n) !== correct) pool.push(String(n));
  return {
    q,
    target,
    correct,
    choices: shuffle([correct, ...shuffle(pool).slice(0, 3)]),
  };
}
