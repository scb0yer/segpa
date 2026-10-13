export const SERIES_LENGTH = 5;
export const modes = [
  { id: "frequency", label: "Fréquence", difficulty: 2 },
  { id: "mean", label: "Moyenne", difficulty: 2 },
  { id: "median", label: "Médiane", difficulty: 2 },
  { id: "range", label: "Étendue", difficulty: 1 },
];
const rand = (a, b, rng) => a + Math.floor(rng() * (b - a + 1));
const pick = (values, rng) => values[rand(0, values.length - 1, rng)];
function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = rand(0, i, rng);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export const rounded = (value) =>
  Math.round((value + Number.EPSILON) * 10) / 10;
export const format = (value) => String(value).replace(".", ",");
export function describe(mode, values, target = null) {
  if (
    !modes.some((m) => m.id === mode) ||
    !values.length ||
    values.some((v) => !Number.isFinite(v))
  )
    throw Error("Série invalide");
  const sorted = [...values].sort((a, b) => a - b),
    total = values.length,
    sum = values.reduce((a, b) => a + b, 0);
  if (mode === "frequency") {
    const count = values.filter((v) => v === target).length,
      answer = (count / total) * 100;
    return {
      mode,
      values,
      target,
      sorted,
      answer,
      unit: "%",
      prompt: `Quelle est la fréquence de la valeur ${target} dans cette série ? Réponds en pourcentage.`,
      reminder:
        "Fréquence en % = effectif de la valeur ÷ effectif total × 100.",
      hint: `Compte les apparitions de ${target}, puis le nombre total de valeurs. Utilise la calculatrice : effectif de ${target} ÷ effectif total × 100.`,
      explanation: `La valeur ${target} apparaît ${count} fois sur ${total} valeurs. ${count} ÷ ${total} × 100 = ${format(rounded(answer))} %${answer !== rounded(answer) ? " (arrondi au dixième)" : ""}.`,
    };
  }
  if (mode === "mean") {
    const answer = sum / total;
    return {
      mode,
      values,
      sorted,
      answer,
      unit: "",
      prompt: "Quelle est la moyenne de cette série ?",
      reminder: "Moyenne = somme de toutes les valeurs ÷ nombre de valeurs.",
      hint: `Additionne les ${total} valeurs, puis divise par ${total}. Sur la calculatrice, tu peux faire l’addition, appuyer sur EXE, puis faire la division.`,
      explanation: `La somme vaut ${sum}. On divise par ${total} : ${sum} ÷ ${total} = ${format(rounded(answer))}${answer !== rounded(answer) ? " (arrondi au dixième)" : ""}.`,
    };
  }
  if (mode === "median") {
    const middle = Math.floor(total / 2),
      odd = total % 2 === 1,
      answer = odd ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    return {
      mode,
      values,
      sorted,
      answer,
      unit: "",
      prompt: "Quelle est la médiane de cette série ?",
      reminder:
        "Range les valeurs dans l’ordre croissant. Effectif impair : prends la valeur du milieu. Effectif pair : calcule la moyenne des deux valeurs centrales.",
      hint: odd
        ? `Il y a ${total} valeurs. Après les avoir rangées, prends la valeur au rang ${middle + 1}.`
        : `Il y a ${total} valeurs. Après les avoir rangées, repère les rangs ${middle} et ${middle + 1}, puis calcule la moyenne de ces deux valeurs.`,
      explanation: odd
        ? `Série rangée : ${sorted.join(" ; ")}. La valeur au rang ${middle + 1} est ${answer}.`
        : `Série rangée : ${sorted.join(" ; ")}. Les deux valeurs centrales sont ${sorted[middle - 1]} et ${sorted[middle]}. (${sorted[middle - 1]} + ${sorted[middle]}) ÷ 2 = ${format(answer)}.`,
    };
  }
  const min = sorted[0],
    max = sorted.at(-1),
    answer = max - min;
  return {
    mode,
    values,
    sorted,
    answer,
    unit: "",
    prompt: "Quelle est l’étendue de cette série ?",
    reminder: "Étendue = plus grande valeur − plus petite valeur.",
    hint: "Repère la plus petite et la plus grande valeur. Soustrais ensuite la plus petite à la plus grande.",
    explanation: `La plus grande valeur est ${max} et la plus petite est ${min}. L’étendue vaut ${max} − ${min} = ${answer}.`,
  };
}
export function makeSeries(mode, rng = Math.random) {
  if (!modes.some((m) => m.id === mode)) throw Error("Exercice inconnu");
  // Deux médianes paires et trois impaires à chaque série, dans un ordre variable.
  const sizes = shuffle([5, 6, 7, 8, 9], rng);
  return Array.from({ length: SERIES_LENGTH }, (_, index) => {
    if (mode === "frequency") {
      const total = pick([8, 10, 12, 20], rng),
        target = rand(1, 9, rng),
        count = rand(1, Math.min(7, total - 2), rng);
      const others = Array.from({ length: total - count }, () => {
        const x = rand(1, 8, rng);
        return x >= target ? x + 1 : x;
      });
      return describe(
        mode,
        shuffle([...Array(count).fill(target), ...others], rng),
        target,
      );
    }
    const total =
      mode === "range"
        ? rand(5, 7, rng)
        : mode === "mean"
          ? rand(4, 8, rng)
          : sizes[index];
    const values = Array.from({ length: total }, () =>
      rand(0, mode === "range" ? 50 : 20, rng),
    );
    if (values.every((v) => v === values[0]))
      values[values.length - 1] = values[0] === 0 ? 1 : values[0] - 1;
    return describe(mode, shuffle(values, rng));
  });
}
export function parseAnswer(raw, mode) {
  if (typeof raw !== "string") return null;
  let text = raw.trim();
  if (mode === "frequency") text = text.replace(/\s*%$/, "").trim();
  if (!/^[+-]?\d{1,6}(?:[.,]\d{1,8})?$/.test(text)) return null;
  const value = Number(text.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}
export function checkAnswer(question, raw) {
  const value = parseAnswer(raw, question.mode);
  if (value === null) return { valid: false, correct: false };
  return {
    valid: true,
    correct:
      Math.abs(value - question.answer) < 1e-8 ||
      Math.abs(value - rounded(question.answer)) < 1e-8,
  };
}
