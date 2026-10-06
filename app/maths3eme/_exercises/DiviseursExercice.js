"use client";
import { useEffect, useRef, useState } from "react";
import { useStudent } from "../_components/StudentProvider";
import { ClassContribution } from "../_components/WeeklyProgress";
import { exercises } from "../_lib/config";
import { SERIES_LENGTH, modes, criteria, makeSeries, checkSelection, explainRecognition } from "./diviseurs-engine.mjs";
import s from "../maths.module.css";
import d from "./diviseurs.module.css";

const noop = () => {};
const points = tenths => (tenths / 10).toLocaleString("fr-FR");

export default function DiviseursExercice({
  onDirtyChange = noop,
  onSavingChange = noop,
  onBack,
  initialMode = "recognize",
}) {
  const { student, checking, recordAttempt, refresh, openPanel } = useStudent();
  const [mode, setMode] = useState(() => modes.some(item => item.id === initialMode) ? initialMode : "recognize");
  const firstMode = useRef(mode);
  const [series, setSeries] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [contribution, setContribution] = useState(null);
  const owner = useRef(undefined);
  const scoreRef = useRef(0);
  const answerLock = useRef(false);
  const nextLock = useRef(false);
  const saveLock = useRef(false);
  const pending = useRef(null);
  const questionHeading = useRef(null);
  const total = SERIES_LENGTH;

  useEffect(() => { setSeries(makeSeries(firstMode.current)); }, []);
  useEffect(() => {
    onDirtyChange(started && (!finished || saveState !== "saved"));
  }, [started, finished, saveState, onDirtyChange]);
  useEffect(() => {
    nextLock.current = false;
    if (index > 0) questionHeading.current?.focus();
  }, [index]);

  function begin() {
    if (owner.current === undefined) owner.current = student?.id || null;
    setStarted(true);
  }
  function restart(nextMode = mode) {
    if (saveLock.current) return;
    if (started && (!finished || saveState !== "saved") && !window.confirm(
      "Recommencer ? La série en cours ou non enregistrée sera perdue.",
    )) return;
    setMode(nextMode);
    setSeries(makeSeries(nextMode));
    setIndex(0); setScore(0); setSelected([]); setAnswer(null);
    setStarted(false); setFinished(false); setSaveState("idle");
    setMessage(""); setContribution(null);
    owner.current = undefined; scoreRef.current = 0; pending.current = null;
    answerLock.current = false; nextLock.current = false;
  }
  function toggle(value) {
    if (answerLock.current || checking || finished) return;
    begin();
    setSelected(previous => previous.includes(value)
      ? previous.filter(item => item !== value) : [...previous, value]);
  }
  function validate(value) {
    if (answerLock.current || checking || finished || !series) return;
    if (mode === "list" && selected.length === 0) return;
    answerLock.current = true;
    begin();
    const question = series[index];
    const result = mode === "recognize"
      ? { correct: value === question.correct, chosen: value }
      : checkSelection(question.number, selected);
    if (result.correct) {
      scoreRef.current++;
      setScore(scoreRef.current);
    }
    setAnswer(result);
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
    const exerciceId = exercises.diviseurs?.exerciceIds?.[mode];
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
            ? "Tu as gagné ton point du jour sur cet exercice ! Tu peux continuer à t'entraîner ou essayer une autre activité."
            : `Il te reste ${points(reward.remainingTenths)} point à gagner sur cet exercice aujourd'hui.`;
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
    if (!answer || nextLock.current || saveLock.current) return;
    nextLock.current = true;
    if (index + 1 === total) { setFinished(true); void save(); return; }
    setIndex(previous => previous + 1); setSelected([]); setAnswer(null);
    answerLock.current = false;
  }

  if (!series) return <p role="status">Préparation de la série…</p>;
  const question = series[index];
  const completed = finished ? total : index + (answer ? 1 : 0);

  return <>
    <nav className={`${s.tabs} ${d.tabs}`} aria-label="Type d'exercice de diviseurs">
      {modes.map(item => <button key={item.id} type="button"
        className={`${s.tab} ${mode === item.id ? s.active : ""}`} aria-pressed={mode === item.id}
        disabled={saving} onClick={() => { if (item.id !== mode) restart(item.id); }}>
        {item.label}
      </button>)}
    </nav>
    <div className={s.bar}>
      <b>{finished ? "Série terminée" : `Question ${index + 1} / ${total}`}</b>
      <progress className={s.progress} value={completed} max={total} aria-label="Avancement de la série" />
      <span className={s.score}>{score} / {completed}</span>
    </div>
    {finished ? <section className={s.card} aria-labelledby="diviseurs-result">
      <h2 id="diviseurs-result">Série terminée : {score}/{total}</h2>
      <p>{score === total ? "Bravo, tu as réussi toute la série !" : "Chaque entraînement t'aide à progresser. Tu peux réessayer !"}</p>
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
      <section className={s.card} aria-label="Question sur les diviseurs">
        <span className={s.type}>{modes.find(item => item.id === mode).label}</span>
        <h2 ref={questionHeading} tabIndex={-1} className={d.questionHeading}>
          {mode === "recognize"
            ? `${question.divisor} est-il un diviseur de ${question.number} ?`
            : `Trouve tous les diviseurs de ${question.number}.`}
        </h2>
        {mode === "recognize" ? <div className={s.answers}>
          {[true, false].map(value => <button key={String(value)} type="button"
            disabled={!!answer || checking}
            className={`${s.answer} ${answer && value === question.correct ? s.good : ""} ${answer?.chosen === value && !answer.correct ? s.bad : ""}`}
            onClick={() => validate(value)}>{value ? "Oui" : "Non"}</button>)}
        </div> : <>
          <p className={d.note}>Clique sur tous les diviseurs, puis sur « Valider ma réponse ».
            Tu peux recliquer sur un nombre pour le retirer. Une liste exacte compte comme une bonne réponse.</p>
          <div className={d.numbers} role="group" aria-label={`Nombres de 1 à ${question.number}`}>
            {Array.from({ length: question.number }, (_, i) => i + 1).map(value => {
              const chosen = selected.includes(value);
              const found = !!answer && chosen && question.number % value === 0;
              const extra = !!answer && chosen && question.number % value !== 0;
              const missing = !!answer && !chosen && question.number % value === 0;
              const detail = found ? " — diviseur trouvé" : extra ? " — intrus" : missing ? " — diviseur oublié" : "";
              return <button key={value} type="button" aria-pressed={chosen}
                aria-label={`${value}${detail}`} disabled={!!answer || checking}
                className={`${d.number} ${chosen ? d.selected : ""} ${found ? d.found : ""} ${extra ? d.extra : ""} ${missing ? d.missing : ""}`}
                onClick={() => toggle(value)}>
                {value}<span className={d.marker} aria-hidden="true">{found ? "✓" : extra ? "×" : missing ? "!" : ""}</span>
              </button>;
            })}
          </div>
          <p className={d.selection}>Ta sélection : {selected.length ? [...selected].sort((a, b) => a - b).join(" ; ") : "aucun nombre pour le moment"}.</p>
          {!answer && <button type="button" className={s.primary} disabled={checking || !selected.length} onClick={() => validate()}>
            Valider ma réponse
          </button>}
        </>}
        <div role="status" className={`${s.feedback} ${d.feedback} ${answer ? answer.correct ? s.good : s.bad : ""}`}>
          {checking ? "Vérification de la connexion…" : !answer
            ? mode === "recognize" ? "Aide-toi des critères de divisibilité pour répondre." : "Pense à 1 et au nombre lui-même. Vérifie aussi les nombres entre les deux."
            : mode === "recognize" ? <><b>{answer.correct ? "Bonne réponse ! " : "Pas tout à fait. "}</b>{explainRecognition(question)}</>
            : <>
              <p><b>{answer.correct ? "Bravo, ta liste est exacte !" : "Pas tout à fait. Regardons la correction."}</b></p>
              <p>Les diviseurs de {question.number} sont : <b>{answer.expected.join(" ; ")}</b>.</p>
              {answer.missing.length > 0 && <p>À ajouter ( ! ) : {answer.missing.join(" ; ")}.</p>}
              {answer.extra.length > 0 && <p>À retirer ( × ) : {answer.extra.join(" ; ")}.</p>}
            </>}
        </div>
        {answer && <div className={s.actions}><button type="button" className={s.primary} onClick={next}>
          {index + 1 === total ? "Voir mon résultat" : "Question suivante →"}
        </button></div>}
      </section>
      <aside className={s.side} aria-label="Aide sur les diviseurs">
        <details open>
          <summary>💡 {mode === "recognize" ? "Critères de divisibilité" : "Comment chercher ?"}</summary>
          <div>
            <p>Un diviseur partage un nombre <b>exactement, sans reste</b>.</p>
            {mode === "recognize" ? <ul className={d.criteria}>
              {criteria.map(rule => <li key={rule.divisor} className={rule.divisor === question.divisor ? d.current : ""}>
                <strong>Par {rule.divisor}</strong><br />{rule.text}
              </li>)}
            </ul> : <>
              <p><b>1 et le nombre lui-même</b> sont toujours des diviseurs d'un entier positif.</p>
              <p>Teste les nombres dans l'ordre. La division doit donner un entier, sans reste.</p>
              <p>Les diviseurs vont par couples : si <b>a × b = n</b>, alors a et b sont des diviseurs de n.</p>
              <p>Pour un carré, le même nombre peut apparaître deux fois dans un couple : on ne le sélectionne qu'une fois.</p>
            </>}
          </div>
        </details>
      </aside>
    </div>}
  </>;
}
