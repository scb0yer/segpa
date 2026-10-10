"use client";
import { useEffect, useRef, useState } from "react";
import { useStudent } from "../_components/StudentProvider";
import { ClassContribution } from "../_components/WeeklyProgress";
import { exercises } from "../_lib/config";
import { SERIES_LENGTH, modes, makeSeries, checkFactors, checkDivisions, checkReduced } from "./fractions-engine.mjs";
import s from "../maths.module.css";
import f from "./fractions.module.css";
const noop = () => {};
const points = tenths => (tenths / 10).toLocaleString("fr-FR");
function Fraction({ top, bottom, label }) {
  return <span className={f.fraction} role="group" aria-label={label}>
    <span className={f.numerator}>{top}</span><span className={f.denominator}>{bottom}</span>
  </span>;
}

export default function FractionsExercice({ onDirtyChange = noop, onSavingChange = noop, onBack, initialMode = "factors" }) {
  const { student, checking, recordAttempt, refresh, openPanel } = useStudent();
  const [mode, setMode] = useState(() => modes.some(item => item.id === initialMode) ? initialMode : "factors");
  const firstMode = useRef(mode);
  const [series, setSeries] = useState(null);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [topIndex, setTopIndex] = useState(null);
  const [bottomIndex, setBottomIndex] = useState(null);
  const [topDivisor, setTopDivisor] = useState("");
  const [bottomDivisor, setBottomDivisor] = useState("");
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [problemDone, setProblemDone] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [contribution, setContribution] = useState(null);
  const owner = useRef(undefined);
  const scoreRef = useRef(0);
  const hadMistake = useRef(false);
  const stageLock = useRef(false);
  const answerLock = useRef(false);
  const nextLock = useRef(false);
  const saveLock = useRef(false);
  const pending = useRef(null);
  const firstAnswer = useRef(null);
  const heading = useRef(null);
  const total = SERIES_LENGTH;

  useEffect(() => { setSeries(makeSeries(firstMode.current)); }, []);
  useEffect(() => { onDirtyChange(started && (!finished || saveState !== "saved")); }, [started, finished, saveState, onDirtyChange]);
  useEffect(() => {
    stageLock.current = false; nextLock.current = false;
    if (stage === 1) firstAnswer.current?.focus();
    else if (index > 0) heading.current?.focus();
  }, [stage, index]);
  function begin() {
    if (owner.current === undefined) owner.current = student?.id || null;
    setStarted(true);
  }
  function clearProblem() {
    setStage(0); setTopIndex(null); setBottomIndex(null); setTopDivisor(""); setBottomDivisor("");
    setNumerator(""); setDenominator(""); setFeedback(null); setProblemDone(false);
    hadMistake.current = false; stageLock.current = false; answerLock.current = false;
  }
  function restart(nextMode = mode) {
    if (saveLock.current) return;
    if (started && (!finished || saveState !== "saved") && !window.confirm(
      "Recommencer ? La série en cours ou non enregistrée sera perdue.",
    )) return;
    setMode(nextMode); setSeries(makeSeries(nextMode)); setIndex(0); setScore(0); clearProblem();
    setStarted(false); setFinished(false); setSaveState("idle"); setMessage(""); setContribution(null);
    owner.current = undefined; scoreRef.current = 0; pending.current = null; nextLock.current = false;
  }
  function selectFactor(row, index) {
    if (checking || stage !== 0 || stageLock.current) return;
    begin();
    if (row === "top") setTopIndex(previous => previous === index ? null : index);
    else setBottomIndex(previous => previous === index ? null : index);
  }
  function validateTransform(event) {
    event.preventDefault();
    if (checking || stage !== 0 || stageLock.current) return;
    if (mode === "factors" && (topIndex === null || bottomIndex === null)) return;
    begin();
    const problem = series[index];
    const correct = mode === "factors"
      ? checkFactors(problem, topIndex, bottomIndex)
      : checkDivisions(problem, topDivisor, bottomDivisor);
    if (!correct) {
      hadMistake.current = true;
      setFeedback({ good: false, text: mode === "factors"
        ? "Choisis le même facteur au numérateur et au dénominateur. Tu peux modifier ta sélection et réessayer."
        : `Il faut diviser le numérateur ET le dénominateur par le PGCD donné : ${problem.common}. Corrige les deux cases.` });
      return;
    }
    stageLock.current = true; setStage(1);
    setFeedback({ good: true, text: mode === "factors"
      ? `Bien joué ! Simplifier le facteur ${problem.common} en haut et en bas revient à diviser les deux par ${problem.common}. Complète maintenant la fraction.`
      : `Les deux divisions sont correctes. Recopie maintenant le résultat sous forme de fraction.` });
  }
  function validateAnswer(event) {
    event.preventDefault();
    if (checking || stage !== 1 || answerLock.current) return;
    begin();
    const result = checkReduced(series[index], numerator, denominator);
    if (!result.correct) {
      hadMistake.current = true;
      const hints = {
        integer: "Écris un entier positif dans chaque case. Le dénominateur ne peut pas être zéro.",
        notReduced: "Ta fraction a la même valeur, mais elle n'est pas encore irréductible. Utilise les résultats de la simplification.",
        inverted: "Tu as inversé les deux nombres : le numérateur se place en haut et le dénominateur en bas.",
        different: "Vérifie les nombres obtenus : recopie le numérateur en haut et le dénominateur en bas.",
      };
      setFeedback({ good: false, text: hints[result.reason] });
      return;
    }
    answerLock.current = true;
    if (!hadMistake.current) { scoreRef.current++; setScore(scoreRef.current); }
    setProblemDone(true);
    setFeedback({ good: true, text: "Bravo ! Cette fraction est irréductible : le numérateur et le dénominateur n'ont plus de diviseur commun autre que 1." });
  }
  async function save() {
    if (saveLock.current || saveState === "saved") return;
    if (!owner.current) {
      setSaveState("guest");
      setMessage("Série terminée sans connexion. Connecte-toi avant de commencer la prochaine série pour l'enregistrer.");
      return;
    }
    if (student?.id !== owner.current) {
      setSaveState("error");
      setMessage("Reconnecte-toi avec le compte qui a commencé cette série, puis réessaie.");
      return;
    }
    const exerciceId = exercises.fractions?.exerciceIds?.[mode];
    if (!/^[a-f0-9]{24}$/i.test(exerciceId || "")) {
      setSaveState("unconfigured");
      setMessage("L'enregistrement de cette activité n'est pas encore activé. Tu peux continuer à t'entraîner.");
      return;
    }
    saveLock.current = true; setSaving(true); onSavingChange(true); setSaveState("saving");
    setMessage("Enregistrement…");
    try {
      // Le même identifiant est conservé après une erreur réseau pour éviter
      // de compter deux fois une série déjà enregistrée par le serveur.
      if (!pending.current) pending.current = {
        exerciceId, score: scoreRef.current, maxScore: total, submissionId: crypto.randomUUID(),
      };
      const result = await recordAttempt(pending.current);
      const reward = result?.reward;
      setContribution(!result?.replayed ? reward?.weeklyContribution || null : null);
      let confirmation = "Ta série est enregistrée !";
      if (reward) {
        if (result.replayed) confirmation = `Cette série était déjà enregistrée : aucun point ajouté une seconde fois. Total : ${points(reward.totalTenths)} points.`;
        else {
          confirmation = reward.creditedTenths > 0
            ? `+${points(reward.creditedTenths)} point${reward.creditedTenths > 10 ? "s" : ""} ! Ta série est enregistrée. `
            : "Ta série est enregistrée. ";
          confirmation += reward.remainingTenths === 0
            ? "Tu as gagné ton point du jour sur ce thème ! Tu peux continuer à t'entraîner ou essayer un autre thème."
            : `Il te reste ${points(reward.remainingTenths)} point à gagner sur ce thème aujourd'hui.`;
          confirmation += ` Total personnel : ${points(reward.totalTenths)} points.`;
        }
      }
      setSaveState("saved"); setMessage(confirmation);
      try { await refresh(); }
      catch { setMessage(confirmation + " Le tableau de bord sera actualisé plus tard."); }
    } catch (error) {
      setSaveState("error");
      setMessage(`Enregistrement non confirmé. ${error.message}`);
    } finally { saveLock.current = false; setSaving(false); onSavingChange(false); }
  }
  function next() {
    if (!problemDone || nextLock.current || saveLock.current) return;
    nextLock.current = true;
    if (index + 1 === total) { setFinished(true); void save(); return; }
    clearProblem(); setIndex(value => value + 1);
  }
  if (!series) return <p role="status">Préparation de la série…</p>;
  const problem = series[index];
  const completed = finished ? total : index + (problemDone ? 1 : 0);
  function factors(row) {
    const values = row === "top" ? problem.topFactors : problem.bottomFactors;
    const selected = row === "top" ? topIndex : bottomIndex;
    const name = row === "top" ? "numérateur" : "dénominateur";
    return <>
      {values.map((value, i) => <span key={i}>
        {i > 0 && <span aria-hidden="true"> × </span>}
        <button type="button" disabled={checking || stage > 0} aria-pressed={selected === i}
          aria-label={`Facteur ${value} au ${name}, position ${i + 1}${stage > 0 && selected === i ? ", simplifié" : ""}`}
          className={`${f.factor} ${selected === i ? f.selected : ""} ${stage > 0 && selected === i ? f.cancelled : ""}`}
          onClick={() => selectFactor(row, i)}>{value}</button>
      </span>)}
    </>;
  }
  const original = <Fraction top={problem.numerator} bottom={problem.denominator} label={`Fraction à réduire : ${problem.numerator} sur ${problem.denominator}`} />;

  return <>
    <nav className={`${s.tabs} ${f.tabs}`} aria-label="Type d'exercice de fractions">
      {modes.map(item => <button key={item.id} type="button" disabled={saving}
        className={`${s.tab} ${mode === item.id ? s.active : ""}`} aria-pressed={mode === item.id}
        onClick={() => { if (item.id !== mode) restart(item.id); }}>{item.label}</button>)}
    </nav>
    <div className={s.bar}>
      <b>{finished ? "Série terminée" : `Fraction ${index + 1} / ${total}`}</b>
      <progress className={s.progress} value={completed} max={total} aria-label="Avancement de la série" />
      <span className={s.score}>{score} / {completed}</span>
    </div>
    {finished ? <section className={s.card} aria-labelledby="fractions-result">
      <h2 id="fractions-result">Série terminée : {score}/{total}</h2>
      <p>{score === total ? "Bravo, tu as réduit les cinq fractions sans erreur !" : `Tu as terminé les cinq fractions, dont ${score} sans erreur. Chaque entraînement t'aide à progresser !`}</p>
      <p role="status">{message}</p><ClassContribution contribution={contribution} />
      <div className={s.actions}>
        {saveState === "error" && <button type="button" className={s.primary} disabled={saving} onClick={save}>Réessayer l'enregistrement</button>}
        {(!student || student.id !== owner.current) && <button type="button" className={s.secondary} disabled={saving} onClick={openPanel}>Se connecter</button>}
        <button type="button" className={s.primary} disabled={saving} onClick={() => restart()}>Nouvelle série</button>
        <button type="button" className={s.secondary} disabled={saving} onClick={openPanel}>Voir ma progression</button>
        {onBack && <button type="button" className={s.secondary} disabled={saving} onClick={onBack}>← Retour aux activités</button>}
      </div>
    </section> : <div className={s.exerciseGrid}>
      <section className={s.card} aria-label="Réduction de fraction">
        <span className={s.type}>{modes.find(item => item.id === mode).label}</span>
        <h2 ref={heading} tabIndex={-1}>Réduis cette fraction à sa forme irréductible.</h2>
        <p className={f.step}>Étape 1 · {mode === "factors" ? "Repérer le facteur commun" : "Diviser par le PGCD"}{stage > 0 ? " ✓" : ""}</p>
        {mode === "gcd" && <p className={f.badge}>Le PGCD de {problem.numerator} et {problem.denominator} est {problem.common}.</p>}
        <p className={f.instruction}>{mode === "factors"
          ? "Clique sur le même facteur une fois en haut et une fois en bas, puis valide."
          : "Complète les deux divisions avec le PGCD donné, puis valide."}</p>
        <form onSubmit={validateTransform}>
          <div className={f.equation}>
            {original}<span aria-hidden="true">=</span>
            {mode === "factors" ? <Fraction top={factors("top")} bottom={factors("bottom")} label="Décomposition en produits" />
              : <Fraction label="Divisions par le PGCD"
                top={<><span>{problem.numerator} ÷</span><input className={f.input} aria-label="Diviseur du numérateur" inputMode="numeric" autoComplete="off"
                  maxLength={3} pattern="[0-9]*" required disabled={checking || stage > 0} value={topDivisor}
                  onChange={event => { begin(); setTopDivisor(event.target.value); }} /></>}
                bottom={<><span>{problem.denominator} ÷</span><input className={f.input} aria-label="Diviseur du dénominateur" inputMode="numeric" autoComplete="off"
                  maxLength={3} pattern="[0-9]*" required disabled={checking || stage > 0} value={bottomDivisor}
                  onChange={event => { begin(); setBottomDivisor(event.target.value); }} /></>} />}
          </div>
          {stage === 0 && <button type="submit" className={s.primary}
            disabled={checking || (mode === "factors" ? topIndex === null || bottomIndex === null : !topDivisor.trim() || !bottomDivisor.trim())}>
            {mode === "factors" ? "Valider les facteurs" : "Valider les divisions"}
          </button>}
        </form>
        {stage === 1 && <>
          {mode === "gcd" && <div className={f.result}>
            <p>Résultats des divisions :</p>
            <p>{problem.numerator} ÷ {problem.common} = <b>{problem.reducedNumerator}</b></p>
            <p>{problem.denominator} ÷ {problem.common} = <b>{problem.reducedDenominator}</b></p>
          </div>}
          <p className={f.step}>Étape 2 · Compléter la fraction irréductible{problemDone ? " ✓" : ""}</p>
          <form onSubmit={validateAnswer}>
            <div className={f.answerRow}>
              {original}<span aria-hidden="true">=</span>
              <Fraction label="Fraction irréductible à compléter"
                top={<input ref={firstAnswer} className={f.input} aria-label="Numérateur de la fraction irréductible" inputMode="numeric" autoComplete="off"
                  maxLength={3} pattern="[0-9]*" required disabled={checking || problemDone} value={numerator}
                  onChange={event => { begin(); setNumerator(event.target.value); }} />}
                bottom={<input className={f.input} aria-label="Dénominateur de la fraction irréductible" inputMode="numeric" autoComplete="off"
                  maxLength={3} pattern="[0-9]*" required disabled={checking || problemDone} value={denominator}
                  onChange={event => { begin(); setDenominator(event.target.value); }} />} />
            </div>
            {!problemDone && <button type="submit" className={s.primary} disabled={checking || !numerator.trim() || !denominator.trim()}>Valider la fraction</button>}
          </form>
        </>}
        <div role="status" className={`${s.feedback} ${feedback ? feedback.good ? s.good : s.bad : ""}`}>
          {checking ? "Vérification de la connexion…" : feedback?.text || "Le numérateur est au-dessus de la barre ; le dénominateur est en dessous."}
        </div>
        {problemDone && <div className={s.actions}><button type="button" className={s.primary} onClick={next}>
          {index + 1 === total ? "Voir mon résultat" : "Fraction suivante →"}
        </button></div>}
      </section>
      <aside className={s.side}><details open><summary>💡 Réduire une fraction</summary><div>
        <p>Une fraction ne change pas de valeur si on divise son numérateur et son dénominateur par <b>le même nombre non nul</b>.</p>
        {mode === "factors" ? <>
          <p>Dans un produit, on peut simplifier un <b>facteur commun</b> en haut et en bas. Cela revient à diviser les deux par ce facteur.</p>
          <p>On simplifie des facteurs dans une multiplication, pas simplement des chiffres qui se ressemblent.</p>
        </> : <p>En divisant les deux nombres par leur <b>PGCD</b>, on obtient directement la forme irréductible.</p>}
        <p><b>Irréductible</b> signifie que les deux nombres n'ont plus de diviseur commun autre que 1.</p>
        <p>Tu peux corriger et réessayer. Une fraction compte comme une bonne réponse si ses deux étapes sont réussies sans erreur de validation.</p>
      </div></details></aside>
    </div>}
  </>;
}
