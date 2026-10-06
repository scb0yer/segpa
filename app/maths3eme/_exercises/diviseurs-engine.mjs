export const SERIES_LENGTH = 5;
export const modes = [
  { id: "recognize", label: "1 · Reconnaître un diviseur" },
  { id: "list", label: "2 · Trouver tous les diviseurs" },
];
export const criteria = [
  { divisor: 2, text: "Le chiffre des unités est 0, 2, 4, 6 ou 8." },
  { divisor: 3, text: "La somme des chiffres est un multiple de 3." },
  { divisor: 4, text: "Le nombre formé par les deux derniers chiffres est un multiple de 4." },
  { divisor: 5, text: "Le chiffre des unités est 0 ou 5." },
  { divisor: 9, text: "La somme des chiffres est un multiple de 9." },
];

function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function allDivisors(number) {
  if (!Number.isInteger(number) || number < 1 || number > 999)
    throw new RangeError("Le nombre doit être un entier de 1 à 999.");
  return Array.from({ length: number }, (_, index) => index + 1)
    .filter(divisor => number % divisor === 0);
}

export function makeSeries(mode, random = Math.random) {
  if (mode === "list") {
    // Nombres distincts dans une série, de 2 à 45 inclus, premiers compris.
    return shuffle(Array.from({ length: 44 }, (_, i) => i + 2), random)
      .slice(0, SERIES_LENGTH)
      .map(number => ({ mode, number, divisors: allDivisors(number) }));
  }
  if (mode !== "recognize") throw new Error("Mode de diviseurs inconnu.");
  const divisors = shuffle(criteria.map(rule => rule.divisor), random);
  // Chaque série comporte des « oui » et des « non », en ordre aléatoire.
  const answers = shuffle([true, true, false, false, random() < 0.5], random);
  const usedNumbers = new Set();
  return divisors.map((divisor, index) => {
    const numbers = Array.from({ length: 988 }, (_, i) => i + 12)
      .filter(number => (number % divisor === 0) === answers[index] && !usedNumbers.has(number));
    const number = numbers[Math.floor(random() * numbers.length)];
    usedNumbers.add(number);
    return { mode, number, divisor, correct: number % divisor === 0 };
  });
}

export function checkSelection(number, selected) {
  const expected = allDivisors(number);
  const choices = new Set(selected);
  const missing = expected.filter(value => !choices.has(value));
  const extra = [...choices].filter(value => !expected.includes(value)).sort((a, b) => a - b);
  return { correct: missing.length === 0 && extra.length === 0, expected, missing, extra };
}

export function explainRecognition({ number, divisor }) {
  const yes = number % divisor === 0;
  const digits = String(number).split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  let detail;
  if (divisor === 2) detail = `Le chiffre des unités est ${number % 10} : il est ${yes ? "pair" : "impair"}.`;
  else if (divisor === 5) detail = `Le chiffre des unités est ${number % 10} : ${yes ? "c'est 0 ou 5" : "ce n'est ni 0 ni 5"}.`;
  else if (divisor === 4) detail = `Les deux derniers chiffres forment ${number % 100}, qui ${yes ? "est" : "n'est pas"} un multiple de 4.`;
  else detail = `Somme des chiffres : ${digits.join(" + ")} = ${sum}. ${sum} ${yes ? "est" : "n'est pas"} un multiple de ${divisor}.`;
  const quotient = Math.floor(number / divisor);
  const remainder = number % divisor;
  return `${yes ? "Oui" : "Non"}, ${divisor} ${yes ? "est" : "n'est pas"} un diviseur de ${number}. ${detail} ${yes
    ? `${number} = ${divisor} × ${quotient}, sans reste.`
    : `${number} = ${divisor} × ${quotient} + ${remainder} : le reste n'est pas nul.`}`;
}
