export const modes = [
  { id: "choose", label: "1 · Choisir l'opération", total: 5 },
  { id: "write", label: "2 · Écrire les opérations", total: 3 },
];

export function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}
export function subtractionSteps(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1 || a > 350 || b > 350)
    throw new RangeError("Deux entiers de 1 à 350 sont attendus.");
  const steps = [];
  while (a !== b) {
    const hi = Math.max(a, b), lo = Math.min(a, b), result = hi - lo;
    steps.push({ hi, lo, result });
    a = result; b = lo;
  }
  return { steps, g: a };
}
function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// Banque calculée une seule fois, bornée ; aucun tirage en boucle sans limite.
// Les deux nombres de départ sont distincts et compris entre 2 et 120.
const bank = [];
for (let hi = 3; hi <= 120; hi++) {
  for (let lo = 2; lo < hi; lo++) {
    const data = subtractionSteps(hi, lo);
    if (data.steps.length >= 1 && data.steps.length <= 3)
      bank.push({ a: hi, b: lo, ...data });
  }
}

export const operationLabel = ({ hi, lo }) => `${hi} − ${lo}`;
export function operationChoices(problem, index, random = Math.random) {
  const step = problem.steps[index];
  const correct = operationLabel(step);
  const wrong = new Set([
    `${problem.a} − ${problem.b}`, `${step.lo} − ${step.hi}`,
    `${step.hi} − ${step.hi}`, `${step.lo} − ${step.lo}`,
    `${step.hi} − ${step.result}`,
  ]);
  wrong.delete(correct);
  return shuffle([correct, ...shuffle([...wrong], random).slice(0, 3)], random);
}
export function makeSeries(mode, random = Math.random) {
  const definition = modes.find(item => item.id === mode);
  if (!definition) throw new Error("Mode PGCD inconnu.");
  return shuffle(bank, random).slice(0, definition.total).map(problem => ({
    ...problem,
    steps: problem.steps.map(step => ({ ...step })),
    choices: problem.steps.map((_, index) => operationChoices(problem, index, random)),
  }));
}
export function checkOperation(step, left, right) {
  const valid = value => /^\d{1,3}$/.test(String(value).trim());
  return valid(left) && valid(right) && Number(left) === step.hi && Number(right) === step.lo;
}
