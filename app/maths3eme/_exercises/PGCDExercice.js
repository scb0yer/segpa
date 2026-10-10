"use client";
import { useEffect, useRef, useState } from "react";
import { useStudent } from "../_components/StudentProvider";
import { ClassContribution } from "../_components/WeeklyProgress";
import { exercises } from "../_lib/config";
import { modes, makeSeries, operationLabel, checkOperation } from "./pgcd-engine.mjs";
import s from "../maths.module.css";
import p from "./pgcd.module.css";
const noop = () => {};
const points = tenths => (tenths / 10).toLocaleString("fr-FR");

export default function PGCDExercice({ onDirtyChange = noop, onSavingChange = noop, onBack, initialMode = "choose" }) {
  const { student, checking, recordAttempt, refresh, openPanel } = useStudent();
  const [mode, setMode] = useState(() => modes.some(item => item.id === initialMode) ? initialMode : "choose");
  const firstMode = useRef(mode);
  const [series, setSeries] = useState(null);
  const [index, setIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(null);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [problemDone, setProblemDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [contribution, setContribution] = useState(null);
  const owner = useRef(undefined);
  const scoreRef = useRef(0);
  const hadMistake = useRef(false);
  const stepLock = useRef(false);
  const problemLock = useRef(false);
  const nextLock = useRef(false);
  const saveLock = useRef(false);
  const pending = useRef(null);
  const firstInput = useRef(null);
  const questionHeading = useRef(null);
  const total = modes.find(item => item.id === mode).total;

  useEffect(() => { setSeries(makeSeries(firstMode.current)); }, []);
  useEffect(() => { onDirtyChange(started && (!finished || saveState !== "saved")); }, [started, finished, saveState, onDirtyChange]);
  useEffect(() => {
    stepLock.current = false; nextLock.current = false;
    if (mode === "write") firstInput.current?.focus();
    else if (index > 0 || stepIndex > 0) questionHeading.current?.focus();
  }, [index, stepIndex, mode]);

  function begin() {
    if (owner.current === undefined) owner.current = student?.id || null;
    setStarted(true);
  }
  function clearProblem() {
    setStepIndex(0); setChoice(null); setLeft(""); setRight(""); setFinalValue("");
    setFeedback(null); setProblemDone(false);
    hadMistake.current = false; stepLock.current = false; problemLock.current = false;
  }
  function restart(nextMode = mode) {
    if (saveLock.current) return;
    if (started && (!finished || saveState !== "saved") && !window.confirm(
      "Recommencer ? La série en cours ou non enregistrée sera perdue.",
    )) return;
    setMode(nextMode); setSeries(makeSeries(nextMode)); setIndex(0); setScore(0);
    clearProblem(); setStarted(false); setFinished(false); setSaveState("idle");
    setMessage(""); setContribution(null);
    owner.current = undefined; scoreRef.current = 0; pending.current = null; nextLock.current = false;
  }
  function finishProblem() {
    if (problemLock.current) return;
    problemLock.current = true;
    if (!hadMistake.current) { scoreRef.current++; setScore(scoreRef.current); }
    setProblemDone(true);
  }
  function choose(value) {
    if (checking || stepLock.current || problemLock.current) return;
    stepLock.current = true; begin();
    const problem = series[index], step = problem.steps[stepIndex];
    const correct = value === operationLabel(step);
    if (!correct) hadMistake.current = true;
    setChoice(value);
    setFeedback({ good: correct, text: `${correct ? "Bien joué !" : "Pas tout à fait."} On calcule ${operationLabel(step)} = ${step.result}, puis on garde ${step.lo} et ${step.result}.` });
    if (stepIndex + 1 === problem.steps.length) finishProblem();
  }
  function verifyOperation(event) {
    event.preventDefault();
    if (checking || stepLock.current || problemLock.current) return;
    begin();
    const problem = series[index], step = problem.steps[stepIndex];
    if (!checkOperation(step, left, right)) {
      hadMistake.current = true;
      setFeedback({ good: false, text: Number(left) === step.lo && Number(right) === step.hi
        ? "Tu as les bons nombres, mais il faut écrire le plus grand en premier. Inverse-les et réessaie."
        : "Reprends les deux nombres en cours. Écris le plus grand, puis le plus petit, et réessaie." });
      return;
    }
    stepLock.current = true;
    setFeedback({ good: true, text: `${operationLabel(step)} = ${step.result}. ${step.lo === step.result
      ? `Les deux nombres sont maintenant égaux à ${step.result}. Écris le PGCD pour terminer.`
      : `Continue avec ${step.lo} et ${step.result}.`}` });
    setStepIndex(value => value + 1); setLeft(""); setRight("");
  }
  function verifyFinal(event) {
    event.preventDefault();
    if (checking || problemLock.current) return;
    begin();
    const problem = series[index];
    if (!/^\d{1,3}$/.test(finalValue.trim()) || Number(finalValue) !== problem.g) {
      hadMistake.current = true;
      setFeedback({ good: false, text: "Regarde les deux nombres égaux obtenus à la fin : leur valeur est le PGCD. Tu peux corriger." });
      return;
    }
    finishProblem();
    setFeedback({ good: true, text: `Bravo, PGCD(${problem.a} ; ${problem.b}) = ${problem.g}. Tu as terminé cette recherche !` });
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
    const exerciceId = exercises.pgcd?.exerciceIds?.[mode];
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
    if (nextLock.current || saveLock.current) return;
    if (mode === "choose" && choice !== null && !problemDone) {
      nextLock.current = true;
      setStepIndex(value => value + 1); setChoice(null); setFeedback(null);
      return;
    }
    if (!problemDone) return;
    nextLock.current = true;
    if (index + 1 === total) { setFinished(true); void save(); return; }
    clearProblem(); setIndex(value => value + 1);
  }
  if (!series) return <p role="status">Préparation de la série…</p>;
  const problem = series[index];
  const current = problem.steps[stepIndex];
  const completed = finished ? total : index + (problemDone ? 1 : 0);
  const shownSteps = mode === "choose" ? stepIndex + (choice !== null ? 1 : 0) : stepIndex;
  const remainingPair = mode === "choose" && choice !== null
    ? `${current.lo} et ${current.result}`
    : current ? `${current.hi} et ${current.lo}` : `${problem.g} et ${problem.g}`;

  return <>
    <nav className={`${s.tabs} ${p.tabs}`} aria-label="Type d'exercice PGCD">
      {modes.map(item => <button key={item.id} type="button" disabled={saving}
        className={`${s.tab} ${mode === item.id ? s.active : ""}`} aria-pressed={mode === item.id}
        onClick={() => { if (item.id !== mode) restart(item.id); }}>{item.label}</button>)}
    </nav>
    <div className={s.bar}>
      <b>{finished ? "Série terminée" : `PGCD ${index + 1} / ${total}`}</b>
      <progress className={s.progress} value={completed} max={total} aria-label="Avancement de la série" />
      <span className={s.score}>{mode === "write" ? `${completed} / ${total} terminés` : `${score} / ${completed}`}</span>
    </div>
    {finished ? <section className={s.card} aria-labelledby="pgcd-result">
      <h2 id="pgcd-result">{mode === "write" ? "Bravo, tes 3 recherches sont terminées !" : `Série terminée : ${score}/${total}`}</h2>
      <p>{mode === "write"
        ? `${score} recherche${score > 1 ? "s" : ""} sur 3 réussie${score > 1 ? "s" : ""} sans erreur. Tu as persévéré jusqu'au bout : les corrections ne réduisent pas ton point de participation.`
        : score === total ? "Bravo, tu as choisi toutes les bonnes opérations !" : "Chaque recherche t'aide à progresser. Tu peux réessayer !"}</p>
      <p role="status">{message}</p>
      <ClassContribution contribution={contribution} />
      <div className={s.actions}>
        {saveState === "error" && <button type="button" className={s.primary} disabled={saving} onClick={save}>Réessayer l'enregistrement</button>}
        {(!student || student.id !== owner.current) && <button type="button" className={s.secondary} disabled={saving} onClick={openPanel}>Se connecter</button>}
        <button type="button" className={s.primary} disabled={saving} onClick={() => restart()}>Nouvelle série</button>
        <button type="button" className={s.secondary} disabled={saving} onClick={openPanel}>Voir ma progression</button>
        {onBack && <button type="button" className={s.secondary} disabled={saving} onClick={onBack}>← Retour aux activités</button>}
      </div>
    </section> : <div className={s.exerciseGrid}>
      <section className={s.card} aria-label="Recherche de PGCD">
        <span className={s.type}>{mode === "write" ? "3 recherches · 1 point à la fin, dans la limite du jour" : "5 recherches · Choisis chaque opération"}</span>
        <h2 ref={questionHeading} tabIndex={-1}>Trouve le PGCD de {problem.a} et {problem.b}.</h2>
        <p className={p.pair}>Nombres de départ : <strong>{problem.a} et {problem.b}</strong></p>
        {shownSteps > 0 && <ol className={p.history} aria-label="Opérations effectuées">
          {problem.steps.slice(0, shownSteps).map((step, i) => <li key={i}>{operationLabel(step)} = <b>{step.result}</b></li>)}
        </ol>}
        {!problemDone && <p className={p.pair}>À cette étape, on garde : <strong>{remainingPair}</strong>.</p>}
        {mode === "choose" ? <>
          {!problemDone && <p>Quelle soustraction faut-il effectuer ?</p>}
          <div className={s.answers}>
            {problem.choices[stepIndex].map(value => <button key={value} type="button"
              className={`${s.answer} ${choice !== null && value === operationLabel(current) ? s.good : ""} ${choice === value && value !== operationLabel(current) ? s.bad : ""}`}
              disabled={choice !== null || checking} onClick={() => choose(value)}>{value}</button>)}
          </div>
          {problemDone && <p className={p.conclusion}>Les deux nombres sont égaux à <b>{problem.g}</b> : PGCD({problem.a} ; {problem.b}) = <b>{problem.g}</b>.</p>}
        </> : !problemDone ? current ? <form onSubmit={verifyOperation}>
          <p>Écris la soustraction. Le résultat apparaîtra après vérification.</p>
          <div className={p.operation}>
            <input ref={firstInput} aria-label="Premier nombre de la soustraction" inputMode="numeric" autoComplete="off"
              value={left} maxLength={3} pattern="[0-9]*" required disabled={checking}
              onChange={event => { begin(); setLeft(event.target.value); }} />
            <span aria-hidden="true">−</span>
            <input aria-label="Deuxième nombre de la soustraction" inputMode="numeric" autoComplete="off"
              value={right} maxLength={3} pattern="[0-9]*" required disabled={checking}
              onChange={event => { begin(); setRight(event.target.value); }} />
            <span aria-hidden="true">=</span><span className={p.result} aria-label="Résultat à découvrir">?</span>
          </div>
          <button type="submit" className={s.primary} disabled={checking || !left.trim() || !right.trim()}>Vérifier l'opération</button>
        </form> : <form onSubmit={verifyFinal}>
          <label className={p.final} htmlFor="pgcd-final">PGCD({problem.a} ; {problem.b}) =
            <input id="pgcd-final" ref={firstInput} aria-label="Valeur du PGCD" inputMode="numeric" autoComplete="off"
              value={finalValue} maxLength={3} pattern="[0-9]*" required disabled={checking}
              onChange={event => { begin(); setFinalValue(event.target.value); }} />
          </label>
          <button type="submit" className={s.primary} disabled={checking || !finalValue.trim()}>Valider le PGCD</button>
        </form> : <p className={p.conclusion}>PGCD({problem.a} ; {problem.b}) = <b>{problem.g}</b>.</p>}
        <div role="status" className={`${s.feedback} ${feedback ? feedback.good ? s.good : s.bad : ""}`}>
          {checking ? "Vérification de la connexion…" : feedback?.text || "Soustrais le plus petit nombre du plus grand, puis garde le résultat et le plus petit nombre."}
        </div>
        {(problemDone || (mode === "choose" && choice !== null)) && <div className={s.actions}>
          <button type="button" className={s.primary} onClick={next}>{!problemDone ? "Continuer le calcul →"
            : index + 1 === total ? "Voir mon résultat" : "PGCD suivant →"}</button>
        </div>}
      </section>
      <aside className={s.side}><details open><summary>💡 La méthode</summary><div>
        <p>Le <b>PGCD</b> est le plus grand diviseur commun aux deux nombres.</p>
        <ol><li>Soustrais le plus petit du plus grand.</li><li>Garde le résultat et le plus petit nombre.</li><li>Recommence avec ces deux nombres.</li><li>Quand ils sont égaux, tu as trouvé le PGCD.</li></ol>
        <p>On s'arrête à deux nombres <b>égaux</b> : inutile de soustraire jusqu'à zéro.</p>
        {mode === "write" ? <p>Prends ton temps : tu peux corriger. Termine les trois recherches pour gagner ton point, dans la limite d'un point par jour pour ce thème.</p>
          : <p>Une recherche compte comme une bonne réponse si tous tes choix sont justes. Tu peux continuer après une erreur en suivant la correction.</p>}
      </div></details></aside>
    </div>}
  </>;
}
